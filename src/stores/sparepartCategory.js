import api from '@/axios/interceptor'
import { message, notification } from 'ant-design-vue'
import { defineStore } from 'pinia'

export const useSparepartCategoryStore = defineStore('sparepartCategory', {
  state: () => ({
    categoryList: [],
    categoryOptions: [],
  }),
  actions: {
    async get() {
      try {
        const response = await api.get('spareparts/category')
        if (response.status === 200) {
          this.categoryList = response.data.data
        }
      } catch (error) {
        message.error(error.response?.data?.message || 'An error occurred')
        console.error(error)
      }
    },
    async getOptions() {
      try {
        const response = await api.get('spareparts/category/options')
        if (response.status === 200) {
          this.categoryOptions = response.data.data || []
        }
      } catch (error) {
        message.error(error.response?.data?.message || 'An error occurred')
        console.error(error)
      }
    },
    async update(id, data) {
      try {
        const response = await api.put(`spareparts/category/${id}`, data)
        if (response.status === 200) {
          notification.success({
            message: `Success update sparepart category`,
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
        const response = await api.post('spareparts/category', data)
        if (response.status === 201) {
          notification.success({
            message: `Success add new sparepart category`,
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
        const response = await api.delete(`spareparts/category/${id}`)
        if (response.status === 200) {
          notification.success({
            message: `Success delete sparepart category`,
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
