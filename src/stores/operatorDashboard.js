import api from '@/axios/interceptor'
import { message } from 'ant-design-vue'
import { defineStore } from 'pinia'
import voiceVocabulary from '@/composable/voiceVocabulary'
import { useVoiceStore } from './voice'

export const useOperatorDashboardStore = defineStore('operatorDashboard', {
  state: () => ({
    machineList: [],
    loading: false,
    modalVisible: false,
  }),
  persist: {
    pick: ['machineList'],
  },
  actions: {
    async get() {
      try {
        const response = await api.get(`/machines/status`)
        if (response.status === 200) {
          const machines = response.data.data.map(item => ({
            id: item.id,
            status: 'stop',
            countTray: 0,
            yellowTrayStatus: item.yellowTrayStatus,
            isLotfull: item.isLotfull,
            updatedAt: item.updatedAt,
          }))
          this.machineList = machines
        }
      } catch (error) {
        message.error(error.response?.data?.message || 'An error occured')
        console.error(error)
      }
    },
  },
  getters: {
    generateTTSMessage() {
      const voiceStore = useVoiceStore()

      // type list berdasarkan state terbaru
      const statusTypes = [
        {
          check: m => m.isLotfull === true,
          type: 'lotfull',
          typeCheck: v => v.type === 'lotfull',
        },
        {
          check: m => m.yellowTrayStatus?.toLowerCase() === 'last',
          type: 'yellow tray end',
          typeCheck: v =>
            v.type === 'yellow tray end' || v.type === 'yellow tray',
        },
      ]

      const findVoiceWord = typeCheck => {
        return voiceVocabulary.find(
          v =>
            voiceStore.voiceSetting.selectedVoice.includes(v.lang) &&
            typeCheck(v),
        )
      }

      const messages = statusTypes
        .map(statusType => {
          const machines = this.machineList
            .filter(m => statusType.check(m))
            .map(m => m.id)

          if (machines.length) {
            const voiceWord = findVoiceWord(statusType.typeCheck)
            if (voiceWord) {
              return `${voiceWord.suffix} ${machines.join(', ')} ${voiceWord.prefix}.`
            }
          }
          return null
        })
        .filter(Boolean)

      return messages.join(' ')
    },
  },
})
