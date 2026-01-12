import api from '@/axios/interceptor'
import { message, notification } from 'ant-design-vue'
import { defineStore } from 'pinia'

export const useSparepartControlledStore = defineStore('sparepartControlled', {
  state: () => ({}),
  actions: {
    async add(endpoint = 'machine', data) {
      try {
        const response = await api.post(
          `/spareparts/${endpoint}/controlled`,
          data,
        )
        if (response.status === 201) {
          notification.success({
            message: 'Success added sparepart controlled',
          })
        }
      } catch (error) {
        message.error(
          error.response?.data?.message ||
            'An error occured while adding sparepart controlled',
        )
      }
    },
    async update(stockId, entityId, endpoint = 'machine', data) {
      try {
        const response = await api.put(
          `/spareparts/${endpoint}/controlled/${stockId}/${entityId}`,
          data,
        )
        if (response.status === 200) {
          notification.success({
            message: 'Success updated sparepart controlled',
          })
        }
      } catch (error) {
        message.error(
          error.response?.data?.message ||
            'An error occured while updating sparepart controlled',
        )
      }
    },
    async delete(stockId, entityId, endpoint = 'machine') {
      try {
        const response = await api.delete(
          `/spareparts/${endpoint}/controlled/${stockId}/${entityId}`,
        )
        if (response.status === 200) {
          notification.success({
            message: 'Success deleted sparepart controlled',
          })
        }
      } catch (error) {
        message.error(
          error.response?.data?.message ||
            'An error occured while deleting sparepart controlled',
        )
      }
    },
  },
  getters: {},
})
