<template>
  <a-config-provider :theme="themeStore.getTheme">
    <RouterView v-slot="{ Component }">
      <Transition name="fade" mode="out-in">
        <component :is="Component" />
      </Transition>
    </RouterView>
  </a-config-provider>
</template>

<script setup>
import { watch } from 'vue'
import { useThemeStore } from './stores/theme'
const themeStore = useThemeStore()

// Fungsi untuk konversi HEX -> RGB
function hexToRgb(hex) {
  const sanitizedHex = hex.replace('#', '')
  const bigint = parseInt(sanitizedHex, 16)
  const r = (bigint >> 16) & 255
  const g = (bigint >> 8) & 255
  const b = bigint & 255
  return `${r}, ${g}, ${b}`
}

const applyThemeClass = isDark => {
  if (isDark) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

watch(
  () => themeStore.isDarkMode,
  newVal => {
    applyThemeClass(newVal)

    // Set warna utama HEX
    const primaryColor = themeStore.colorPrimary
    document.documentElement.style.setProperty('--primary-color', primaryColor)

    // Konversi HEX -> RGB dan simpan juga versi RGB
    const rgb = hexToRgb(primaryColor)
    document.documentElement.style.setProperty('--primary-color-rgb', rgb)
  },
  { immediate: true },
)
</script>
