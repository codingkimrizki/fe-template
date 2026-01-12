import api from '@/axios/interceptor'
import { message, notification } from 'ant-design-vue'
import { defineStore } from 'pinia'
import { useKanagataStore } from './kanagata'

const kanagataStore = useKanagataStore()

export const useProductRegisterStore = defineStore('productRegister', {
  state: () => ({
    detailKanagata: {},
    modal: {
      visible: false,
      kanagataId: null,
    },
  }),
  actions: {
    async getDetailKanagata() {
      try {
        const response = await api.get(`/kanagatas/${this.modal.kanagataId}`)
        if (response.status === 200) {
          this.detailKanagata = response.data.data
        }
      } catch (error) {
        message.error(error.response?.data?.message)
        console.error('Error fetching detail kanagata: ', error)
        throw error
      }
    },
    async updateProductRegister(productIds) {
      try {
        const response = await api.post('/product-register', {
          kanagataId: this.modal.kanagataId,
          productIds: productIds,
        })
        if (response.status === 200) {
          notification.success({
            message: `Success update kanagata products`,
          })
          await kanagataStore.get()
        }
      } catch (error) {
        message.error(error.response?.data?.message)
        console.error(error)
      }
    },
  },
  getters: {},
})
