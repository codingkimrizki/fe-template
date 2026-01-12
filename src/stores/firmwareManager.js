import { defineStore } from 'pinia'
import { createCrudStore } from '@/composable/crudStore'
import { notification } from 'ant-design-vue'
import api from '@/axios/interceptor'

const crudStore = createCrudStore({
  entityName: 'firmware',
  endpoint: '/firmwares',
  responseTotalProperty: response => response.data.totalData,
})

export const useFirmwareManagerStore = defineStore('firmwareManager', {
  ...crudStore,
  state: () => ({
    ...crudStore.state(),
  }),
  actions: {
    ...crudStore.actions,
    async download(id) {
      try {
        const res = await api.get(`/firmwares/download/${id}`, {
          responseType: 'blob', // WAJIB untuk binary
        })

        // Ambil nama file dari header
        const disposition = res.headers['content-disposition']
        let filename = 'program.bin'

        if (disposition) {
          const match = disposition.match(/filename="(.+)"/)
          if (match) filename = match[1]
        }

        // Trigger browser download
        const blob = new Blob([res.data])
        const url = window.URL.createObjectURL(blob)

        const a = document.createElement('a')
        a.href = url
        a.download = filename
        a.click()

        URL.revokeObjectURL(url)

        notification.success({
          message: 'Success',
          description: 'Firmware downloaded successfully',
        })
      } catch (error) {
        notification.error({
          message: 'Download Failed',
          description:
            error.response?.statusText ||
            'An error occurred while download firmware',
        })
        console.error('Error while download firmware', error)
        throw error
      }
    },
  },
  getters: {
    ...crudStore.getters,

    // Get latest firmware versions (can be multiple for different types like ILI and ST)
    latestVersion: state => {
      return state.firmwareList
        .filter(firmware => firmware.status === 'LATEST')
        .map(firmware => firmware.version)
    },
  },
})
