<template>
  <a-drawer
    :title="title"
    :width="width"
    :closable="closable"
    :maskClosable="maskClosable"
    :open="open"
    @close="emit('close')"
  >
    <slot></slot>
    <template #footer>
      <slot name="footer" />
    </template>
  </a-drawer>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: 'Detail',
  },
  width: {
    type: [Number, String],
    default: 500,
  },
  closable: {
    type: Boolean,
    default: true,
  },
  maskClosable: {
    type: Boolean,
    default: true,
  },
})
const open = defineModel('open', { type: Boolean, default: false })
const emit = defineEmits(['close'])
</script>
