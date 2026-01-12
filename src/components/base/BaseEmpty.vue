<template>
  <a-empty :description="description" :image="Empty.PRESENTED_IMAGE_SIMPLE" />
</template>

<script setup>
import { Empty } from 'ant-design-vue'
defineProps({
  description: {
    type: String,
    default: `There's nothing to display here`,
  },
})
</script>

<style scoped></style>
