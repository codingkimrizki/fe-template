import api from '@/axios/interceptor'
import { message } from 'ant-design-vue'
import { defineStore } from 'pinia'

export const useExchangeRatesStore = defineStore('exchangeRates', {
  state: () => ({
    timeLastUpdateUtc: null,
    baseCode: null,
    rates: {},
  }),
  actions: {
    async get() {
      try {
        const response = await api.get(`/exchange-rates`)
        if (response.status === 200) {
          const { rates, timeLastUpdateUtc, baseCode } = response.data.data
          this.rates = rates
          this.timeLastUpdateUtc = timeLastUpdateUtc
          this.baseCode = baseCode
        }
      } catch (error) {
        message.error(
          error.response?.data?.message || 'Error while get exchange rates',
        )
        console.error(error)
      }
    },
  },
  getters: {},
})
