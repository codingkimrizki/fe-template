<template>
  <a-form
    layout="vertical"
    :model="formData"
    :rules="formRules"
    @finish="handleSubmit"
  >
    <a-form-item label="Name" name="name">
      <a-input v-model:value="formData.name" :disabled="isDeleteMode" />
    </a-form-item>
    <a-alert
      v-if="isDeleteMode"
      message="Warning: This action will delete category"
      type="warning"
      class="mb-small"
      show-icon
    />
    <a-form-item>
      <a-flex justify="flex-end" :gap="10">
        <a-button type="primary" html-type="submit"> Submit </a-button>
      </a-flex>
    </a-form-item>
  </a-form>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useSparepartCategoryStore } from '@/stores/sparepartCategory'
const store = useSparepartCategoryStore()
const props = defineProps({
  mode: { type: String, default: 'add' },
  data: { type: Object, default: () => ({}) },
})
const isSubmitting = ref(false)
const emit = defineEmits(['close'])

const formData = ref({
  name: props.data.name,
})

const formRules = computed(() => ({
  name: [
    { required: true, message: 'Please input name' },
    { pattern: /^\S+$/, message: 'Name cannot contain spaces' },
  ],
}))

const initializeFormData = () => {
  formData.value = {
    name: props.data.name || '',
  }
}

watch(() => props.data, initializeFormData, { deep: true })
watch(() => props.mode, initializeFormData)

const isDeleteMode = computed(() => props.mode === 'delete')

const handleSubmit = async values => {
  isSubmitting.value = true
  try {
    if (props.mode === 'add') await store.add(values)
    if (props.mode === 'update') await store.update(props.data.id, values)
    if (props.mode === 'delete') await store.delete(props.data.id)
    emit('close')
  } catch (error) {
    console.log(`Error ${props.mode} category`, error)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped></style>
