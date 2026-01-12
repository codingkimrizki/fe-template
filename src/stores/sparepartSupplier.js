import api from '@/axios/interceptor'
import { message, notification } from 'ant-design-vue'
import { defineStore } from 'pinia'

export const useSparepartSupplierStore = defineStore('sparepartSupplier', {
  state: () => ({
    supplierList: [],
    supplierOptions: [],
  }),
  actions: {
    async get() {
      try {
        const response = await api.get('spareparts/supplier')
        if (response.status === 200) {
          this.supplierList = response.data.data
        }
      } catch (error) {
        message.error(error.response?.data?.message || 'An error occurred')
        console.error(error)
      }
    },
    async getOptions() {
      try {
        const response = await api.get('spareparts/supplier/options')
        if (response.status === 200) {
          this.supplierOptions = response.data.data || []
        }
      } catch (error) {
        message.error(error.response?.data?.message || 'An error occurred')
        console.error(error)
      }
    },
    async update(id, data) {
      try {
        const response = await api.put(`spareparts/supplier/${id}`, data)
        if (response.status === 200) {
          notification.success({
            message: `Success update sparepart supplier`,
          })
          this.get()
        }
      } catch (error) {
        message.error(error.response?.data?.message || 'An error occurred')
        console.error(error)
      }
    },
    async add(data) {
      try {
        const response = await api.post('spareparts/supplier', data)
        if (response.status === 201) {
          notification.success({
            message: `Success add new sparepart supplier`,
          })
          this.get()
        }
      } catch (error) {
        message.error(error.response?.data?.message || 'An error occurred')
        console.error(error)
      }
    },
    async delete(id) {
      try {
        const response = await api.delete(`spareparts/supplier/${id}`)
        if (response.status === 200) {
          notification.success({
            message: `Success delete sparepart supplier`,
          })
          this.get()
        }
      } catch (error) {
        message.error(error.response?.data?.message || 'An error occurred')
        console.error(error)
      }
    },
  },
  getters: {},
})
