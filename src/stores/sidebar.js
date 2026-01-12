import { defineStore } from 'pinia'

export const useSiderStore = defineStore('sider', {
  state: () => ({
    // Memuat nilai collapsed dari localStorage jika ada, default false jika tidak ada
    collapsed: JSON.parse(localStorage.getItem('sider-collapsed')),
    hidden: JSON.parse(localStorage.getItem('sider-hidden')),
    isMobile: localStorage.getItem('isMobile'),
  }),
  actions: {
    toggleCollapse() {
      this.collapsed = !this.collapsed
      localStorage.setItem('sider-collapsed', JSON.stringify(this.collapsed))
    },
    toggleHidden() {
      this.hidden = !this.hidden
      localStorage.setItem('sider-hidden', JSON.stringify(this.hidden))
    },
    setCollapse(value) {
      this.collapsed = value
      localStorage.setItem('sider-collapsed', JSON.stringify(this.collapsed))
    },
    setHidden(value) {
      this.hidden = value
      localStorage.setItem('sider-hidden', JSON.stringify(this.hidden))
    },
    setIsMobile(value) {
      this.isMobile = value
      localStorage.setItem('isMobile', this.isMobile)
    },
  },
})
