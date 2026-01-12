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
    <a-form-item label="Supplier Location" name="location">
      <CountrySelect v-model="formData.location" :disabled="isDeleteMode" />
    </a-form-item>
    <a-form-item label="Email" name="email">
      <a-input
        v-model:value="formData.email"
        placeholder="user@example.com"
        class="input-email"
        :disabled="isDeleteMode"
      />
    </a-form-item>
    <a-alert
      v-if="isDeleteMode"
      message="Warning: This action will delete supplier data"
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
import { useSparepartSupplierStore } from '@/stores/sparepartSupplier'
import CountrySelect from '@/components/CountrySelect.vue'
const store = useSparepartSupplierStore()
const props = defineProps({
  mode: { type: String, default: 'add' },
  data: { type: Object, default: () => ({}) },
})
const isSubmitting = ref(false)
const emit = defineEmits(['close'])

const formData = ref({
  name: props.data.name,
  email: props.data.email,
  location: props.data.location,
})

const formRules = ref({
  name: [{ required: true, message: 'Please input name' }],
  location: [{ required: true, message: 'Please select supplier location' }],
})

const initializeFormData = () => {
  formData.value = {
    name: props.data.name || '',
    email: props.data.email || '',
    location: props.data.location || '',
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
    console.log(`Error ${props.mode} supplier`, error)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped></style>
