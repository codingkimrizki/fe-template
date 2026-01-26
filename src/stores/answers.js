import { defineStore } from 'pinia'
import api from '@/axios/interceptor'
import { message } from 'ant-design-vue'

export const useAnswersStore = defineStore('answers', {
  state: () => ({
    answers: [],
    questions: [],
    totalDevice: 0, // ini bakal kita update dari API
    totalIpAddress: 0,
    totalMajor: 0,
  }),
  actions: {
    async fetchAnswers() {
      try {
        const response = await api.get('/answers/all') // nanti bikin route GET /answers/all
        if (response.status === 200) {
          this.answers = response.data.data || []
          this.totalDevice = this.answers.length
          this.totalIpAddress = response.data.totalIpAddress || 0
          this.totalMajor = response.data.totalMajor || 0
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
  },
  getters: {
    getTotalDevice: state => state.totalDevice,
    getTotalIpAddress: state => state.totalIpAddress,
    getTotalMajor: state => state.totalMajor,
  },
})
