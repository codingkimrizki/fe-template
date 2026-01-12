import api from '@/axios/interceptor'
import { message, notification } from 'ant-design-vue'
import { defineStore } from 'pinia'
import { useMqttStore } from './mqttWebsocket'

export const useKanagataDashboardStore = defineStore('kanagataDashboard', {
  state: () => ({
    kanagataList: [],
    loading: false,
    modal: {
      visible: false,
      mode: null,
      idKanagata: null,
      shotType: null,
    },
    filter: {
      search: '',
      sortBy: 'name',
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
      kanagataId: null,
    },
    detailKanagata: {
      controlledSparepart: [],
    },
  }),
  persist: {
    pick: ['kanagataList', 'filter'],
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
        const response = await api.get('/kanagatas', { params })
        if (response.status === 200) {
          this.kanagataList = response.data.data
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
        const response = await api.get(`/kanagatas/${id}`)
        if (response.status === 200) {
          this.detailKanagata = response.data.data
        }
      } catch (error) {
        message.error(error.response?.data?.message || 'An error occurred')
        console.error(error)
      }
    },

    async update(kanagataData, logData, forceUpdate = false) {
      try {
        const mqttStore = useMqttStore()
        let topicIn = null
        let isInstalled = false

        const {
          data: { data: kanagata },
        } = await api.get(`/kanagatas/${this.modal.idKanagata}`)

        const machineId = kanagata?.onMachine

        if (machineId && !forceUpdate) {
          isInstalled = true
          topicIn = `rdz/rdz-m/${machineId}/in`
        } else {
          forceUpdate = true
        }

        let responsePromise
        if (!forceUpdate && topicIn) {
          responsePromise = mqttStore.waitForResponse((topic, payload) => {
            const topicOut = topicIn.replace(/\/in$/, '/out')
            if (topic !== topicOut) return false
            try {
              return JSON.parse(payload).type === 'change'
            } catch {
              return false
            }
          }, 5000)
        }

        if (topicIn) {
          mqttStore.publish(topicIn, {
            type: 'change',
            data: {
              kanagata: {
                kanagataId: kanagata.id,
                ...kanagataData,
              },
            },
          })
        }

        if (!forceUpdate && responsePromise) {
          await responsePromise
        }

        await Promise.all([
          api.put(`/kanagatas/${this.modal.idKanagata}`, kanagataData),
          api.post(`/kanagatas/${this.modal.idKanagata}/logs`, logData),
        ])

        await this.get()

        notification.success({
          message: isInstalled ? 'Sync update success' : 'Force update success',
          description: 'See log action kanagata for historical action',
        })
      } catch (error) {
        if (error.response?.status === 403) {
          notification.error({
            message: 'Restricted Access',
            description: 'Your role not required for this action',
            duration: 1,
          })
        } else if (error.message === 'Timeout waiting for device response') {
          notification.error({
            message: 'Device Timeout',
            description: 'Device did not respond in time. Database not updated',
          })
        } else {
          message.error(
            error.response?.data?.message || 'Error while update machine',
          )
        }
        console.error(error)
      }
    },

    async updateUltrasonicCheck(id, logData) {
      try {
        const mqttStore = useMqttStore()

        const kanagata = this.getKanagataById(id)

        // Update ultrasonic check to true & add log actions
        await Promise.all([
          api.put(`/kanagatas/${id}`, { ultrasonicCheck: true }),
          api.post(`/kanagatas/${id}/logs`, logData),
        ])

        if (kanagata.onMachine) {
          mqttStore.publish(`rdz/rdz-m/${kanagata.onMachine}/in`, {
            type: 'ultrasonic_verification',
          })
        }

        await this.get()
        notification.success({
          message: `Success verify 1/2 PM`,
          description: `See log action kanagata for historical action`,
        })
      } catch (error) {
        message.error(
          error.response?.data?.message || 'Error while update machine',
        )
        console.error(error)
      }
    },

    resetModal() {
      this.modal = {
        visible: false,
        mode: null,
        idKanagata: null,
        shotType: null,
      }
    },

    resetDrawer() {
      this.drawer = {
        visible: false,
        mode: null,
        kanagataId: null,
      }
    },

    toggleFilterOrder() {
      this.filter.order = this.filter.order === 'asc' ? 'desc' : 'asc'
    },
  },

  getters: {
    getKanagataById: state => id => {
      return state.kanagataList.find(kanagata => kanagata.id === id)
    },

    getShotData: state => kanagataId => {
      const kanagata = state.kanagataList.find(k => k.id === kanagataId)

      return {
        updatedAt: kanagata.updatedAt,
        actual: kanagata.kanagataShot,
        tolerance: kanagata.toleranceKanagata,
        target: kanagata.targetKanagata,
        ultrasonicStatus: kanagata.ultrasonicStatus,
        ultrasonicCheck: kanagata.ultrasonicCheck,
        total: kanagata.totalKanagataShot,
        targetTotal: kanagata.targetTotal,
      }
    },
  },
})
