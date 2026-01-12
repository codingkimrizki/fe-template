<template>
  <div class="color-picker">
    <label v-if="label" class="color-label">{{ label }}</label>
    <div class="color-input-wrapper">
      <input type="color" v-model="colorValue" class="color-input" />
      <span
        class="color-preview"
        :style="{ backgroundColor: colorValue }"
      ></span>
      <span class="color-code">{{ colorValue }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

// Props
const props = defineProps({
  modelValue: {
    type: String,
    default: '#1890ff',
  },
  label: {
    type: String,
    default: '',
  },
})

// Emits
const emit = defineEmits(['update:modelValue'])

const colorValue = ref(props.modelValue)

watch(colorValue, val => {
  emit('update:modelValue', val)
})

watch(
  () => props.modelValue,
  val => {
    if (val !== colorValue.value) {
      colorValue.value = val
    }
  },
)
</script>

<style scoped>
.color-picker {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.color-label {
  font-size: medium;
  font-weight: 500;
  color: var(--text-color, #333);
}

.color-input-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
}

/* Hide default color input look */
.color-input {
  border: none;
  width: 36px;
  height: 36px;
  padding: 0;
  background: none;
  cursor: pointer;
}

/* Custom circle preview for input */
.color-input::-webkit-color-swatch-wrapper {
  padding: 0;
}

.color-input::-webkit-color-swatch {
  border-radius: 50%;
  border: 1px solid #ccc;
}

/* Additional preview box */
.color-preview {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  border: 1px solid #ccc;
}

/* Hex code text */
.color-code {
  font-size: 13px;
  color: #555;
  min-width: 70px;
}
</style>
