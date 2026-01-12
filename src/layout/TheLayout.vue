<template>
  <a-layout class="main-layout">
    <!-- Sider -->
    <TheSider class="sider-fixed" />

    <a-layout>
      <!-- Header -->
      <TheHeader />

      <!-- Content -->
      <a-layout-content
        class="content-scroll"
        :class="{ 'content-fluid': themeStore.isFluid }"
      >
        <TheContent />
        <ScrollToTop />
      </a-layout-content>
      <TheDrawer />
      <MaintenanceDrawer />
    </a-layout>
  </a-layout>
</template>

<script setup>
import TheSider from './TheSider.vue'
import TheHeader from './TheHeader.vue'
import TheContent from './TheContent.vue'
import ScrollToTop from '@/components/ScrollToTop.vue'
import TheDrawer from './TheDrawer.vue'
import MaintenanceDrawer from '@/components/MaintenanceDrawer.vue'
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()
</script>

<style scoped>
.main-layout {
  height: 100dvh;
  overflow: hidden;
}

.sider-fixed {
  height: 100dvh;
}

.content-scroll {
  padding: 0rem 12rem;
  overflow-y: auto;
  overflow-x: hidden;
  min-height: calc(100vh - 64px);
  background-color: var(--content-bg);
}

.content-fluid {
  padding: 0rem 2rem !important;
  /* Fluid mode */
}

@media (max-width: 1200px) {
  .content-scroll {
    padding: 0 2rem; /* boxed di layar kecil jadi lebih fluid */
  }
}

.content-scroll::-webkit-scrollbar {
  width: 10px;
}

.content-scroll::-webkit-scrollbar-track {
  background: transparent;
  border-radius: 10px;
}

.content-scroll::-webkit-scrollbar-thumb {
  background-color: #888;
  border-radius: 10px;
}

.content-scroll::-webkit-scrollbar-thumb:hover {
  background-color: #555;
}
</style>
