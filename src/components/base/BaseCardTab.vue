<template>
  <a-card
    :tab-list="parsedTabList"
    :active-tab-key="modelValue"
    @tabChange="key => $emit('update:modelValue', key)"
  >
    <Transition name="slide-fade" mode="out-in">
      <div :key="modelValue">
        <slot :name="modelValue" />
      </div>
    </Transition>
    <template #title>
      <span class="x-large bold">
        {{ title }}
      </span>
    </template>
  </a-card>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  tabList: {
    type: Array,
    required: true,
  },
  modelValue: {
    type: String,
    required: true,
  },
})

defineEmits(['update:modelValue'])

// 👉 Parsing tabList agar support fungsi render/icon
const parsedTabList = computed(() =>
  props.tabList.map(tab => ({
    ...tab,
    tab: typeof tab.tab === 'function' ? tab.tab() : tab.tab,
  })),
)
</script>
