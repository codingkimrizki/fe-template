<template>
  <a-flex
    justify="center"
    align="center"
    :style="{ height: `${height}vh` }"
    vertical
  >
    <a-image :src="maintenance" :preview="false" :width="500" />
    <BaseCountdown
      title="This page is under construction, will be ready in"
      :deadline="deadline"
    />
  </a-flex>
</template>

<script setup>
import dayjs from 'dayjs'
import BaseCountdown from '@/components/base/BaseCountdown.vue'
import maintenance from '../../assets/images/maintenance.png'

defineProps({
  title: {
    type: String,
    default: 'This page is under construction, will be ready in',
  },
  deadline: {
    type: Number,
    default: dayjs().add(1, 'month').valueOf(),
  },
  height: {
    type: Number,
    default: 80,
  },
})
</script>
