<template>
  <div>
    <a-divider orientation="left">
      <span class="x-large">Master Product</span>
    </a-divider>
    <a-row :gutter="[16, 16]">
      <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
        <ProductWidget />
      </a-col>
      <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
        <ProductList />
      </a-col>
    </a-row>
  </div>
</template>

<script setup>
import ProductList from './component/ProductList.vue'
import ProductWidget from './component/ProductWidget.vue'
</script>

<style scoped></style>
