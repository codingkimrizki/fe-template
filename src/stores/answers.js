import { defineStore } from 'pinia'
import api from '@/axios/interceptor'
import { message } from 'ant-design-vue'
import { useAuthStore } from '@/stores/auth'

export const useAnswersStore = defineStore('answers', {
  state: () => ({
    answers: [],
    questions: [],
    totalDevice: 0,
    totalIpAddress: 0,
    totalMajor: 0,
    majorNotifications: JSON.parse(
      localStorage.getItem('majorNotifications') || '[]',
    ),
    drawer: {
      open: false,
      mode: null,
    },
  }),

  getters: {
    getTotalDevice: state => state.totalDevice,
    getTotalIpAddress: state => state.totalIpAddress,
    getTotalMajor: state => state.totalMajor,

    //badge = unread only
    countNotification: state =>
      state.majorNotifications.filter(n => !n.read).length,
  },

  actions: {
    async fetchAnswers() {
      try {
        const res = await api.get('/answers/all')
        if (res.status !== 200) return

        const newTotalMajor = res.data.totalMajor || 0
        const lastTotalMajor = Number(
          localStorage.getItem('lastTotalMajor') || 0,
        )

        //DETECT MAJOR BARU
        if (newTotalMajor > lastTotalMajor) {
          const diff = newTotalMajor - lastTotalMajor

          const authStore = useAuthStore()
          const userName = authStore.user?.name || 'Unknown User'

          for (let i = 0; i < diff; i++) {
            this.majorNotifications.push({
              id: Date.now() + i,
              message: 'a new issue major was detected',
              userName,
              read: false,
              createdAt: new Date().toISOString(),
            })
          }

          message.warning(`${diff} new major issues🚨`)
        }

        //update data utama
        this.answers = res.data.data || []
        this.totalDevice = this.answers.length
        this.totalIpAddress = res.data.totalIpAddress || 0
        this.totalMajor = newTotalMajor

        //persist
        localStorage.setItem('lastTotalMajor', newTotalMajor)
        localStorage.setItem(
          'majorNotifications',
          JSON.stringify(this.majorNotifications),
        )
      } catch (err) {
        message.error(err.response?.data?.message || 'Failed to fetch answers')
        console.error(err)
      }
    },

    async fetchQuestions() {
      const res = await api.get('/questions/all')
      this.questions = res.data.data || []
    },

    //drawer toggle
    toggleDrawer(mode = 'major') {
      this.drawer.open = !this.drawer.open
      this.drawer.mode = mode

      //UX: buka drawer = notif dianggap kebaca
      if (this.drawer.open && mode === 'major') {
        this.markAllMajorAsRead()
      }
    },

    //mark read
    markAllMajorAsRead() {
      this.majorNotifications.forEach(n => {
        n.read = true
      })

      localStorage.setItem(
        'majorNotifications',
        JSON.stringify(this.majorNotifications),
      )
    },
  },
})
