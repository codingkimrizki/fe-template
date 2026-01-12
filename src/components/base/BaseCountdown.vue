<template>
  <a-statistic-countdown
    :value="deadline"
    format="D[D] HH[H] mm[m] ss[s]"
    :valueStyle="{ fontSize: '3rem', fontWeight: 'bold', textAlign: 'center' }"
  >
    <template #title>
      <span style="font-size: x-large">{{ title }}</span>
    </template>
  </a-statistic-countdown>
</template>

<script setup>
import dayjs from 'dayjs'
defineProps({
  deadline: {
    type: Number,
    default: () => dayjs().add(1, 'day').valueOf(),
  },
  title: {
    type: String,
    default: 'Title Countdown',
  },
})
</script>
