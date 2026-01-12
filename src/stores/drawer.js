import { defineStore } from 'pinia'

export const useDrawerStore = defineStore('drawer', {
  state: () => ({
    open: false,
  }),
  actions: {
    toggleDrawer() {
      this.open = !this.open
    },
    setDrawer(value) {
      this.open = value
    },
  },
})
