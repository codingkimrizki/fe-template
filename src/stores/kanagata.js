import { defineStore } from 'pinia'
import { createCrudStore } from '@/composable/crudStore'
import api from '@/axios/interceptor'
import { message } from 'ant-design-vue'

const crudStore = createCrudStore({
  entityName: 'kanagata',
  endpoint: '/kanagatas',
  responseTotalProperty: response => response.data.totalData,
})

export const useKanagataStore = defineStore('kanagata', {
  ...crudStore,
  state: () => ({
    ...crudStore.state(),
    selectedKanagata: null,
    kanagataOptions: [],
  }),
  actions: {
    ...crudStore.actions,
    async getOptions() {
      try {
        const response = await api.get(`/kanagatas/options`)
        if (response.status === 200) {
          this.kanagataOptions = response.data.data || []
        }
      } catch (error) {
        message.error(
          error.response?.data?.message ||
            'An error occurred while fetching kanagata options',
        )
        console.error('Error fetching kanagata options:', error)
        throw error
      }
    },
  },
  getters: {
    ...crudStore.getters,
  },
})
