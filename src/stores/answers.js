import { defineStore } from 'pinia'
import api from '@/axios/interceptor'
import { message } from 'ant-design-vue'

export const useAnswersStore = defineStore('answers', {
  state: () => ({
    answers: [],
    questions: [],
    totalDevice: 0,
    totalIpAddress: 0,
    totalMajor: 0,

    // 🔔 notif MAJOR only
    majorNotifications: [],
  }),

  actions: {
    async fetchAnswers() {
      try {
        const response = await api.get('/answers/all')
        if (response.status === 200) {
          const newTotalMajor = response.data.totalMajor || 0

          // 🚨 DETEKSI MAJOR BARU
          if (newTotalMajor > this.totalMajor) {
            const diff = newTotalMajor - this.totalMajor

            for (let i = 0; i < diff; i++) {
              this.majorNotifications.push({
                id: Date.now() + i,
                message: 'Major issue baru terdeteksi',
                read: false,
                createdAt: new Date(),
              })
            }

            message.warning(`${diff} Major issue baru 🚨`)
          }

          // update data utama
          this.answers = response.data.data || []
          this.totalDevice = this.answers.length
          this.totalIpAddress = response.data.totalIpAddress || 0
          this.totalMajor = newTotalMajor
        }
      } catch (error) {
        message.error(
          error.response?.data?.message || 'Failed to fetch answers',
        )
        console.error(error)
      }
    },

    async fetchQuestions() {
      const res = await api.get('/questions/all')
      this.questions = res.data.data || []
    },

    // 🧼 UX helper
    markAllMajorAsRead() {
      this.majorNotifications.forEach(n => {
        n.read = true
      })
    },
  },

  getters: {
    getTotalDevice: state => state.totalDevice,
    getTotalIpAddress: state => state.totalIpAddress,
    getTotalMajor: state => state.totalMajor,

    // 🔔 notif (gutter style)
    countMajorNotification: state =>
      state.majorNotifications.filter(n => !n.read).length,

    // karena cuma MAJOR
    countNotification: state =>
      state.majorNotifications.filter(n => !n.read).length,
  },
})
