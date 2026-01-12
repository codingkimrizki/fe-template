import { defineStore } from 'pinia'
import api from '@/axios/interceptor'
import { message } from 'ant-design-vue'

export const useInventoryReportStore = defineStore('inventoryReport', {
  state: () => ({
    inventoryAnalysis: [],
  }),
  actions: {
    async getInventoryAnalysis() {
      try {
        const response = await api.get(`/spareparts/report/inventory-analysis`)
        if (response.status === 200) {
          this.inventoryAnalysis = response.data.data
        }
      } catch (error) {
        message.error(error.response?.data?.message || 'An error occured')
        console.error(error)
      }
    },
  },
  getters: {
    totalInventoryCost(state) {
      if (!Array.isArray(state.inventoryAnalysis)) return 0
      return state.inventoryAnalysis
        .reduce((total, category) => total + category.cost, 0)
        .toFixed(0)
    },
  },
})
