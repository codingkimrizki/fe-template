import { defineStore } from 'pinia'
import { createCrudStore } from '@/composable/crudStore'
import api from '@/axios/interceptor'
import { message } from 'ant-design-vue'

const crudStore = createCrudStore({
  entityName: 'product',
  endpoint: '/products',
  responseTotalProperty: response => response.data.totalData,
})

export const useProductStore = defineStore('product', {
  ...crudStore,
  state: () => ({
    ...crudStore.state(),
    productOptions: [],
  }),
  actions: {
    ...crudStore.actions,
    async getProductOptions() {
      try {
        const response = await api.get('/products/options')
        if (response.status === 200) {
          this.productOptions = response.data.data || []
        }
      } catch (error) {
        message.error(
          error.response?.data?.message ||
            'An error occurred while fetching product options',
        )
        console.error('Error fetching product options:', error)
        throw error
      }
    },
  },
})
