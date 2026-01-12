<template>
  <div>
    <a-divider orientation="left">
      <span class="x-large">Master Inventory</span>
    </a-divider>
    <a-row :gutter="[16, 16]">
      <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
        <SparepartWidget />
      </a-col>
      <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
        <SparepartList />
      </a-col>
    </a-row>
    <SparepartDrawer />
  </div>
</template>

<script setup>
import SparepartWidget from './component/SparepartWidget.vue'
import SparepartList from './component/SparepartList.vue'
import SparepartDrawer from './component/SparepartDrawer.vue'
import { onUnmounted } from 'vue'
import { useSparepartStore } from '@/stores/sparepart'

const sparepartStore = useSparepartStore()

onUnmounted(() => {
  sparepartStore.$reset()
})
</script>

<style scoped></style>
