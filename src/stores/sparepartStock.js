import api from '@/axios/interceptor'
import { message, notification } from 'ant-design-vue'
import { defineStore } from 'pinia'
import { useSparepartStore } from './sparepart'
import { useInventoryReportStore } from './inventoryReport'

export const useSparepartStockStore = defineStore('sparepartStock', {
  state: () => ({
    modal: {
      visible: false,
      title: 'Use Sparepart Stock',
      stockId: null,
    },
  }),
  actions: {
    async getDetail(id) {
      try {
        const response = await api.get(`/spareparts/stock/${id}`)
        return response.data.data
      } catch (error) {
        message.error(error.response?.data?.message || 'An error occurred')
        console.error(error)
      }
    },
    async add(data) {
      try {
        const response = await api.post(`/spareparts/stock`, data)
        if (response.status === 201) {
          // initiate sparepart store
          const sparepartStore = useSparepartStore()
          const inventoryStore = useInventoryReportStore()

          // update sparepart list in inventory page
          sparepartStore.drawer.data = await sparepartStore.getDetail(
            sparepartStore.drawer.data.id,
          )

          // update sparepart data in drawer
          await sparepartStore.get()

          // update inventory report
          await inventoryStore.getInventoryAnalysis()
        }
      } catch (error) {
        message.error(error.response?.data?.message || 'An error occurred')
        console.error(error)
      }
    },
    async update(id, data) {
      try {
        const response = await api.put(`/spareparts/stock/${id}`, data)
        if (response.status === 200) {
          notification.success({
            message: `Success update sparepart data`,
          })
          // initiate sparepart store
          const sparepartStore = useSparepartStore()

          const inventoryStore = useInventoryReportStore()

          // update sparepart list in inventory page
          sparepartStore.drawer.data = await sparepartStore.getDetail(
            sparepartStore.drawer.data.id,
          )
          // update sparepart data in drawer
          await sparepartStore.get()

          // update inventory report
          await inventoryStore.getInventoryAnalysis()
        }
      } catch (error) {
        message.error(error.response?.data?.message || 'An error occurred')
        console.error(error)
      }
    },
    async delete(id) {
      try {
        const response = await api.delete(`/spareparts/stock/${id}`)
        if (response.status === 200) {
          notification.success({
            message: `Success delete sparepart data`,
          })
          // initiate sparepart store
          const sparepartStore = useSparepartStore()

          const inventoryStore = useInventoryReportStore()

          // update sparepart list in inventory page
          sparepartStore.drawer.data = await sparepartStore.getDetail(
            sparepartStore.drawer.data.id,
          )
          // update sparepart data in drawer
          await sparepartStore.get()

          // update inventory report
          await inventoryStore.getInventoryAnalysis()
        }
      } catch (error) {
        message.error(error.response?.data?.message || 'An error occurred')
        console.error(error)
      }
    },
    async ncc(data) {
      try {
        const response = await api.post(`/spareparts/stock/ncc`, data)
        if (response.status === 200) {
          notification.success({
            message: `Success update sparepart data`,
          })
          // initiate sparepart store
          const sparepartStore = useSparepartStore()
          // update sparepart list in inventory page
          sparepartStore.drawer.data = await sparepartStore.getDetail(
            sparepartStore.drawer.data.id,
          )
        }
      } catch (error) {
        message.error(error.response?.data?.message || 'An error occurred')
        console.error(error)
      }
    },
    async deleteNcc(id) {
      try {
        const response = await api.delete(`/spareparts/stock/ncc/${id}`)
        if (response.status === 200) {
          notification.success({
            message: `Success delete ncc data`,
          })
        }
      } catch (error) {
        message.error(error.response?.data?.message || 'An error occurred')
        console.error(error)
      }
    },
  },
})
