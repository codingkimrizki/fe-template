import { defineStore } from 'pinia'

export const useMaintenanceNotifyStore = defineStore('maintenanceNotify', {
  state: () => ({
    machine: [],
    kanagata: [],
    renewalReminder: [],
    drawer: {
      open: false,
      mode: null,
    },
  }),
  getters: {
    countNotification: state =>
      state.machine.length +
      state.kanagata.length +
      state.renewalReminder.length,
    countRenewalReminder: state => state.renewalReminder.length,
  },
  actions: {
    toggleDrawer(mode) {
      this.drawer.open = !this.drawer.open
      this.drawer.mode = mode
    },
  },
})
