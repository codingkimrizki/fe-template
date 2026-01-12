import { defineStore } from 'pinia'
import dayjs from 'dayjs'
import api from '@/axios/interceptor'
import { message } from 'ant-design-vue'
import { useMachineDashboardStore } from './machineDashboard'

const machineDashboardStore = useMachineDashboardStore()

export const useLogMachineStore = defineStore('logMachine', {
  state: () => ({
    logs: [],
    filter: {
      dateRange: [
        dayjs().subtract(5, 'days').startOf('day'),
        dayjs().endOf('day'),
      ],
    },
  }),
  actions: {
    async get() {
      try {
        const params = {
          start: this.filter.dateRange[0].format('YYYY-MM-DD'),
          end: this.filter.dateRange[1].format('YYYY-MM-DD'),
        }
        const response = await api.get(
          `/machines/${machineDashboardStore.modal.idMachine}/logs`,
          { params },
        )
        if (response.status === 200) {
          this.logs = response.data.data
        }
      } catch (error) {
        message.error(
          error.response?.data?.message || 'Error while get log action',
        )
        console.error(error)
      }
    },
  },
  getters: {},
})
