<template>
  <a-row :gutter="[24, 24]" :wrap="true">
    <BaseWidget
      title="Total Product"
      :value="productStore.totalProduct"
      :icon="ShoppingCartOutlined"
      description="Counted product listed on database"
    />
    <BaseWidget
      title="Notes"
      description="Search bar is only used for name, code or ID fields"
      :icon="ExclamationCircleOutlined"
    />
  </a-row>
</template>

<script setup>
import { useProductStore } from '@/stores/product'
import {
  ShoppingCartOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons-vue'
import BaseWidget from '@/components/base/BaseWidget.vue'
const productStore = useProductStore()
</script>

<style scoped></style>
