<template>
  <div>
    <a-divider orientation="left">
      <span class="x-large">Master Kanagata</span>
    </a-divider>
    <a-row :gutter="[16, 16]">
      <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
        <KanagataWidget />
      </a-col>
      <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
        <KanagataList />
        <ProductRegister />
      </a-col>
    </a-row>
  </div>
</template>

<script setup>
import KanagataList from './component/KanagataList.vue'
import KanagataWidget from './component/KanagataWidget.vue'
import ProductRegister from './component/ProductRegister.vue'
</script>

<style scoped></style>
