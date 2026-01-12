import api from '@/axios/interceptor'
import { defineStore } from 'pinia'

export const useRoleStore = defineStore('role', {
  state: () => ({
    roleOptions: [],
  }),
  actions: {
    async getRoleOptions() {
      try {
        const response = await api.get(`/role/options`)
        if (response.status === 200) {
          this.roleOptions = response.data.data
        }
      } catch (error) {
        console.error(error)
      }
    },
  },
  getters: {},
})
