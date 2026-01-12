<template>
  <a-form
    layout="vertical"
    :model="formData"
    :rules="formRules"
    @finish="handleSubmit"
  >
    <!-- ID Field -->
    <a-form-item label="ID" name="id" :validate-trigger="['blur', 'change']">
      <a-input
        :controls="false"
        placeholder="Enter ID (letters, numbers, hyphens, and underscores allowed)"
        v-model:value="formData.id"
        :disabled="isDeleteMode"
        :readonly="isDeleteMode"
        autocomplete="off"
      />
    </a-form-item>

    <!-- Name Field -->
    <a-form-item
      label="Name"
      name="name"
      :validate-trigger="['blur', 'change']"
    >
      <a-input
        placeholder="Enter Name"
        v-model:value="formData.name"
        :disabled="isDeleteMode"
      />
    </a-form-item>

    <!-- Delete Confirmation Alert -->
    <a-alert
      v-if="isDeleteMode"
      message="Warning: This action will delete the selected data"
      description="Please confirm that you want to proceed with the deletion. This action cannot be undone."
      type="warning"
      show-icon
      closable
      class="mb-small"
    />

    <!-- Form Actions -->
    <a-form-item>
      <a-flex justify="flex-end" :gap="10">
        <a-button
          type="primary"
          html-type="submit"
          :loading="isSubmitting"
          :disabled="isSubmitting"
        >
          {{ submitButtonText }}
        </a-button>
      </a-flex>
    </a-form-item>
  </a-form>
</template>

<script setup>
import { computed, ref, watch, onMounted } from 'vue'
import { useProductStore } from '@/stores/product'

// Define component props
const props = defineProps({
  mode: {
    type: String,
    default: 'add',
  },
  data: {
    type: Object,
    default: () => ({}),
  },
})

// Define component events
const emit = defineEmits(['close'])

// Store reference
const productStore = useProductStore()

// Component state
const isSubmitting = ref(false)

// Form data with proper initialization
const formData = ref({
  id: '',
  name: '',
})

// Validation rules
const formRules = computed(() => ({
  id: [
    {
      required: true,
      message: 'ID is required',
      trigger: 'blur',
    },
    {
      pattern: /^[A-Za-z0-9_\-\s]+$/,
      message:
        'ID can only contain letters, numbers, hyphens, underscores, and spaces',
      trigger: 'blur',
    },
  ],
  name: [
    {
      required: true,
      message: 'Name is required',
      trigger: 'blur',
    },
    {
      min: 1,
      max: 150,
      message: 'Name must be between 1 and 150 characters',
      trigger: 'blur',
    },
  ],
}))

// Computed properties
const isDeleteMode = computed(() => props.mode === 'delete')
const isUpdateMode = computed(() => props.mode === 'update')

const submitButtonText = computed(() => {
  if (isSubmitting.value) return 'Processing...'
  if (isDeleteMode.value) return 'Confirm Delete'
  if (isUpdateMode.value) return 'Update Product'
  return 'Create Product'
})

// Initialize form with provided data
const initializeFormData = () => {
  // Reset form data to defaults
  formData.value = {
    id: '',
    name: '',
  }

  // If we have data, populate the form
  if (props.data && Object.keys(props.data).length > 0) {
    formData.value = {
      id: props.data.id || '',
      name: props.data.name || '',
    }
  }
}

// Watch for changes in props.data and update form accordingly
watch(
  () => props.data,
  newData => {
    if (newData) {
      initializeFormData()
    }
  },
  { immediate: true },
)

// Watch for changes in mode to update form state if needed
watch(
  () => props.mode,
  newMode => {
    if (newMode === 'add') {
      // Reset form when switching to add mode
      formData.value = {
        id: '',
        name: '',
      }
    }
  },
)

// Handle form submission
const handleSubmit = async values => {
  isSubmitting.value = true

  try {
    if (props.mode === 'update') {
      await productStore.update(props.data.id, values)
    } else if (props.mode === 'add') {
      await productStore.add(values)
    } else if (props.mode === 'delete') {
      await productStore.delete(props.data.id)
    }
    emit('close')
  } catch (error) {
    console.error(`Error ${props.mode}ing product:`, error)
  } finally {
    isSubmitting.value = false
  }
}

// Lifecycle hooks
onMounted(() => {
  initializeFormData()
})
</script>

<style scoped>
/* Additional styling for better accessibility */
:deep(.ant-form-item) {
  margin-bottom: 16px;
}

:deep(.ant-form-item-label > label) {
  font-weight: 500;
}
</style>
