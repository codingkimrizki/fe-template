import api from '@/axios/interceptor'
import { message, notification } from 'ant-design-vue'

/**
 * Generic CRUD store factory
 * @param {Object} config - Configuration object
 * @param {string} config.entityName - Name of the entity (e.g., 'machine', 'kanagata')
 * @param {string} config.endpoint - API endpoint (e.g., '/machines', '/kanagatas')
 * @param {string} config.listProperty - Property name for the list in state (e.g., 'machineList', 'kanagataList')
 * @param {string} config.totalProperty - Property name for the total count in state (e.g., 'totalMachine', 'totalKanagata')
 * @param {Object} config.persistConfig - Optional persistence configuration for Pinia
 * @param {Function} config.responseTotalProperty - Function to get total from response (e.g., (res) => res.data.totalData)
 * @returns {Object} Pinia store configuration
 */
export const createCrudStore = config => {
  const {
    entityName,
    endpoint,
    listProperty = `${entityName}List`,
    totalProperty = `total${entityName.charAt(0).toUpperCase() + entityName.slice(1)}`,
    persistConfig = null,
    responseTotalProperty = response => response.data.totalData, // default to totalData
  } = config

  return {
    state: () => ({
      [listProperty]: [],
      pagination: {
        page: 1,
        pageSize: 10,
        total: 0,
      },
      filter: {
        search: '',
        sortBy: 'id',
        order: 'asc',
        showDeleted: false,
      },
      [totalProperty]: 0,
    }),

    ...(persistConfig && { persist: persistConfig }),

    actions: {
      async get() {
        try {
          const { showDeleted, ...otherFilters } = this.filter
          const params = {
            page: this.pagination.page,
            pageSize: this.pagination.pageSize,
            deletedAt: showDeleted,
            ...otherFilters,
          }
          const response = await api.get(endpoint, { params })
          if (response.status === 200) {
            this[listProperty] = response.data.data
            this.pagination.total = response.data.pagination.total
            this[totalProperty] = responseTotalProperty(response)
          }
        } catch (error) {
          message.error(error.response?.data?.message || 'An error occurred')
          console.error(error)
        }
      },

      async getDetail(id) {
        try {
          const response = await api.get(`${endpoint}/${id}`)
          if (response.status === 200) {
            return response.data.data
          }
        } catch (error) {
          message.error(error.response?.data?.message || 'An error occurred')
          console.error(error)
          return null
        }
      },

      async update(id, data) {
        try {
          const response = await api.put(`${endpoint}/${id}`, data)
          if (response.status === 200) {
            notification.success({
              message: `Success update ${entityName}`,
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
          const response = await api.post(endpoint, data)
          if (response.status === 201) {
            notification.success({
              message: `Success add new ${entityName}`,
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
          const response = await api.delete(`${endpoint}/${id}`)
          if (response.status === 200) {
            notification.success({
              message: `Success delete ${entityName}s`,
            })
            this.get()
          }
        } catch (error) {
          message.error(error.response?.data?.message || 'An error occurred')
          console.error(error)
        }
      },

      async restore(id) {
        try {
          const response = await api.post(`${endpoint}/${id}/restore`)
          if (response.status === 200) {
            notification.success({
              message: `Success restore ${entityName}`,
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
  }
}
