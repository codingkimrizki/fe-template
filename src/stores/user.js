import api from '@/axios/interceptor'
import { message, notification } from 'ant-design-vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    userList: [],
    userStat: {},
    pagination: {
      page: 1,
      pageSize: 10,
      total: 0,
    },
    filter: {
      search: '',
      sortBy: 'roleName',
      order: 'asc',
    },
  }),
  persist: {
    pick: ['pagination', 'filter'],
  },
  actions: {
    async get() {
      try {
        const params = {
          page: this.pagination.page,
          pageSize: this.pagination.pageSize,
          search: this.filter.search,
          sortBy: this.filter.sortBy,
          order: this.filter.order,
        }
        const response = await api.get('/users', { params })
        if (response.status === 200) {
          this.userList = response.data.data.users
          this.userStat = response.data.data.roles
          this.pagination.total = response.data.pagination.total
        }
      } catch (error) {
        message.error(error.response.data.message)
        console.error(error)
      }
    },

    async updateRole(id, data) {
      try {
        const { roleId, name } = data
        const response = await api.put(`/users/${id}/role`, {
          roleId: Number(roleId),
        })
        if (response.status === 200) {
          notification.success({
            message: `Success update role for ${name}`,
          })
        }
      } catch (error) {
        notification.error({
          message: `Error while update user role`,
        })
        console.error(error)
      }
    },
  },
  getters: {
    totalUsers(state) {
      return Object.values(state.userStat).reduce((sum, val) => sum + val, 0)
    },
  },
})
