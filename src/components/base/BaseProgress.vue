<template>
  <a-flex vertical :gap="3" align="center">
    <span class="medium">{{ title }}</span>
    <a-progress
      :type="type"
      :percent="percent"
      :size="size"
      :stroke-color="themeStore.colorPrimary"
      :format="formatProgress"
    />
    <slot name="additional" />
  </a-flex>
</template>

<script setup>
import { useThemeStore } from '@/stores/theme'
import { h } from 'vue'

const themeStore = useThemeStore()
const props = defineProps({
  title: { type: String, default: 'Title' },
  type: { type: String, default: 'dashboard' },
  percent: { type: Number, default: 50 },
  size: { type: [Number, String] },
  status: { type: String, default: 'normal' },
  value: { type: [Number, String], default: 0 },
})

const formatProgress = percent => {
  return h('div', { style: 'text-align: center; color: var(--text-color);' }, [
    h('span', {}, `${percent}%`),
    props.value != 0 || props.value != '0'
      ? h(
          'div',
          { class: 'small', style: 'margin-top: 10px' },
          `${props.value}`,
        )
      : null,
  ])
}
</script>

<style scoped></style>
