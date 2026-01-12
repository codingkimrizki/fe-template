<template>
  <a-switch
    v-model:checked="isDarkMode"
    checked-children="Dark"
    un-checked-children="Light"
    :style="{
      '--ant-switch-color': '#1890ff',
      '--ant-switch-track-color': '#d9d9d9',
    }"
  />
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useThemeStore } from '@/stores/theme'
import { watch } from 'vue'

const themeStore = useThemeStore()
const { isDarkMode } = storeToRefs(themeStore)

watch(isDarkMode, val => {
  themeStore.applyTheme(val) // hanya apply ke document.body misalnya
})
</script>

<style scoped></style>
