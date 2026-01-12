import { defineStore } from 'pinia'
import { createCrudStore } from '@/composable/crudStore'
import api from '@/axios/interceptor'
import { message } from 'ant-design-vue'

const crudStore = createCrudStore({
  entityName: 'sparepart',
  endpoint: 'spareparts',
  persistConfig: {
    pick: ['pagination'],
  },
  responseTotalProperty: response => response.data.totalData,
})

export const useSparepartStore = defineStore('sparepart', {
  ...crudStore,
  state: () => ({
    ...crudStore.state(),
    filter: {
      ...crudStore.state().filter,
      categoryId: null,
      status: null,
    },
    loading: false,
    drawer: {
      open: false,
      data: {},
      mode: null,
    },
    updateHistoryUsed: false,
  }),
  actions: {
    ...crudStore.actions,

    toggleDrawer() {
      this.drawer.open = !this.drawer.open
    },
    async getHistoryUsed(id, params) {
      try {
        const response = await api.get(`/spareparts/${id}/used-history`, {
          params,
        })
        if (response.status === 200) {
          return response.data.data
        }
      } catch (error) {
        message.error(error.response?.data?.message || 'An error occured')
        console.error(error)
      }
    },
  },
  getters: {
    ...crudStore.getters,
    stockList(state) {
      return (
        state.drawer.data?.stockSpareparts?.filter(
          item => item.isFinal && !item.isUsed,
        ) || []
      )
    },
    onProgressStockList(state) {
      return (
        state.drawer.data?.stockSpareparts?.filter(item => !item.isFinal) || []
      )
    },
  },
})
