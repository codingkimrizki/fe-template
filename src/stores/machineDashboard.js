import api from '@/axios/interceptor'
import { message, notification } from 'ant-design-vue'
import { defineStore } from 'pinia'
import { useMqttStore } from './mqttWebsocket'

export const useMachineDashboardStore = defineStore('machineDashboard', {
  state: () => ({
    machineList: [],
    loading: false,
    modal: {
      visible: false,
      mode: null,
      idMachine: null,
      shotType: null,
    },
    filter: {
      search: '',
      sortBy: 'id',
      order: 'asc',
    },
    pagination: {
      page: 1,
      pageSize: 9,
      total: 0,
    },
    drawer: {
      visible: false,
      mode: null,
      machineId: null,
    },
    detailMachine: {
      controlledSparepart: [],
    },
  }),
  persist: {
    pick: ['machineList', 'filter'],
  },
  actions: {
    async get() {
      try {
        this.loading = true
        const params = {
          page: this.pagination.page,
          pageSize: this.pagination.pageSize,
          search: this.filter.search,
          sortBy: this.filter.sortBy,
          order: this.filter.order,
        }
        const response = await api.get('/machines', { params })
        if (response.status === 200) {
          this.machineList = response.data.data
          this.pagination.total = response.data.pagination.total
        }
        this.loading = false
      } catch (error) {
        message.error(error.response?.data?.message || 'An error occurred')
        console.error(error)
      }
    },

    async getDetail(id) {
      try {
        const response = await api.get(`/machines/${id}`)
        if (response.status === 200) {
          this.detailMachine = response.data.data
        }
      } catch (error) {
        message.error(error.response?.data?.message || 'An error occurred')
        console.error(error)
      }
    },

    async update(machineData, logData, forceUpdate = false) {
      try {
        const mqttStore = useMqttStore()
        const topicIn = `rdz/rdz-m/${this.modal.idMachine}/in`
        const topicOut = `rdz/rdz-m/${this.modal.idMachine}/out`

        // 1. Prepare Waiter (Listen first to capture quick response)
        let responsePromise
        if (!forceUpdate) {
          responsePromise = mqttStore.waitForResponse((topic, payload) => {
            if (topic !== topicOut) return false
            try {
              const parsed = JSON.parse(payload)
              // Expect same structure with type 'change' or similar confirmation
              return parsed.type === 'change'
            } catch {
              return false
            }
          }, 5000) // 5s timeout
        }

        // 2. Publish to Device
        mqttStore.publish(topicIn, {
          type: 'change',
          data: { machine: { ...machineData } },
        })

        if (!forceUpdate) {
          // 3. Wait for Device Response
          await responsePromise
        }

        // 4. Update Database only after device confirmation
        await Promise.all([
          api.put(`/machines/${this.modal.idMachine}`, machineData),
          api.post(`/machines/${this.modal.idMachine}/logs`, logData),
        ])

        await this.get()

        notification.success({
          message: `Success update machine parameter`,
          description: `Device acknowledged and data saved to DB`,
        })
      } catch (error) {
        if (error.response?.status == 403) {
          notification.error({
            message: 'Restricted Access',
            description: 'Your role not required for this action',
            duration: 1,
          })
        } else if (error.message === 'Timeout waiting for device response') {
          notification.error({
            message: 'Device Timeout',
            description:
              'Device did not respond in time. Database not updated.',
          })
        } else {
          message.error(
            error.response?.data?.message || 'Error while update machine',
          )
        }
        console.error(error)
      }
    },

    toggleFilterOrder() {
      this.filter.order = this.filter.order === 'asc' ? 'desc' : 'asc'
    },

    resetModal() {
      this.modal = {
        visible: false,
        mode: null,
        idMachine: null,
        shotType: null,
      }
    },

    resetDrawer() {
      this.drawer = {
        visible: false,
        mode: null,
        machineId: null,
      }
    },
  },
  getters: {
    getMachineById: state => id => {
      return state.machineList.find(machine => machine.id === id)
    },

    getShotData: state => machineId => {
      const machine = state.machineList.find(m => m.id === machineId)

      const createShotData = (actual, tolerance, target) => ({
        actual,
        tolerance,
        target,
      })

      if (!machine) {
        const initial = createShotData(0, 0, 0)
        return { injection: initial, zclean: initial }
      }

      return {
        updatedAt: machine.updatedAt,
        injection: createShotData(
          machine.injectionShot,
          machine.toleranceInjection,
          machine.targetInjection,
        ),
        zclean: createShotData(
          machine.zcleanShot,
          machine.toleranceZclean,
          machine.targetZclean,
        ),
      }
    },
  },
})
