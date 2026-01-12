<template>
  <a-select
    class="full"
    v-model:value="model"
    :placeholder="placeholder"
    show-search
    allow-clear
    :filter-option="filterOption"
    :disabled="disabled"
  >
    <a-select-option
      v-for="item in options"
      :key="item.value"
      :value="item.value"
      :label="item.label"
    >
      <span>{{ item.flag }} {{ item.label }}</span>
    </a-select-option>
  </a-select>
</template>

<script setup>
import { asiaCountries } from '@/utils/asiaCountries'
import { filterOption } from '@/utils/filterSelectOptions'
// Two-way binding
const model = defineModel({
  type: String,
  default: null,
})

// Props
defineProps({
  placeholder: { type: String, default: 'Select Country' },
  disabled: { type: Boolean, default: false },
})

// Convert to AntD format
const options = asiaCountries.map(c => ({
  label: c.name,
  value: c.name,
  flag: c.flag,
}))
</script>

<style scoped>
.full {
  width: 100%;
}
</style>
