// stores/theme.js
import { defineStore } from 'pinia'
import { theme } from 'ant-design-vue'

export const useThemeStore = defineStore('theme', {
  state: () => ({
    isDarkMode: true,
    isFluid: true,
    defaultColorPrimary: '#264D8E',
    colorPrimary: '#264D8E',
    fontFamily: 'Nunito, Arial',
  }),

  getters: {
    getTheme(state) {
      return {
        token: {
          colorPrimary: state.colorPrimary,
          fontFamily: state.fontFamily,
        },
        algorithm: state.isDarkMode
          ? theme.darkAlgorithm
          : theme.defaultAlgorithm,
      }
    },
  },

  actions: {
    applyTheme(isDark) {
      document.body.setAttribute('data-theme', isDark ? 'dark' : 'light')
    },

    setPrimaryColor(color) {
      this.colorPrimary = color
      document.documentElement.style.setProperty('--primary-color', color)
    },

    resetPrimaryColor() {
      this.colorPrimary = this.defaultColorPrimary
      document.documentElement.style.setProperty(
        '--primary-color',
        this.defaultColorPrimary,
      )
    },

    setFontFamily(font) {
      this.fontFamily = font
    },
  },
  persist: true,
})
