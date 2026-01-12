import { defineStore } from 'pinia'
import { createCrudStore } from '@/composable/crudStore'
import api from '@/axios/interceptor'
import { message } from 'ant-design-vue'

const crudStore = createCrudStore({
  entityName: 'machine',
  endpoint: '/machines',
  persistConfig: {
    pick: ['pagination', 'filter'],
  },
  responseTotalProperty: response => response.data.totalData,
})

export const useMachineStore = defineStore('machine', {
  ...crudStore,
  state: () => ({
    ...crudStore.state(),
    machineOptions: [],
  }),
  actions: {
    ...crudStore.actions,
    async getOptions() {
      try {
        const response = await api.get(`/machines/options`)
        if (response.status === 200) {
          this.machineOptions = response.data.data || []
        }
      } catch (error) {
        message.error(
          error.response?.data?.message ||
            'An error occurred while fetching machine options',
        )
        console.error('Error fetching machine options:', error)
        throw error
      }
    },
  },
  getters: {
    ...crudStore.getters,
  },
})
