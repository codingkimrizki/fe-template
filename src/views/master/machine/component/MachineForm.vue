<template>
  <a-form
    layout="vertical"
    :model="formData"
    :rules="formRules"
    @finish="handleSubmit"
  >
    <!-- Machine Number Field -->
    <a-form-item
      label="Machine Number"
      name="id"
      :validate-trigger="['blur', 'change']"
    >
      <a-input-number
        :controls="false"
        :min="1"
        placeholder="Enter Machine Number"
        v-model:value="formData.id"
        :disabled="isDeleteMode || isUpdateMode"
        :readonly="isDeleteMode || isUpdateMode"
        autocomplete="off"
      />
    </a-form-item>

    <!-- Brand Field -->
    <a-form-item
      label="Brand"
      name="brand"
      :validate-trigger="['blur', 'change']"
    >
      <a-input
        placeholder="Enter Brand"
        v-model:value="formData.brand"
        :disabled="isDeleteMode"
      />
    </a-form-item>

    <!-- Tonnage Field -->
    <a-form-item
      label="Tonnage"
      name="tonnage"
      :validate-trigger="['blur', 'change']"
    >
      <a-input-number
        :disabled="isDeleteMode"
        placeholder="Enter Machine Tonnage"
        v-model:value="formData.tonnage"
        class="full-width"
        :controls="false"
        :min="1"
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
import { useMachineStore } from '@/stores/machine'

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
const machineStore = useMachineStore()

// Component state
const isSubmitting = ref(false)

// Form data with proper initialization
const formData = ref({
  id: 0,
  brand: '',
  tonnage: 0,
})

// Validation rules
const formRules = computed(() => ({
  id: [
    {
      required: props.mode === 'add',
      message: 'Machine Number is required when adding a new machine',
      trigger: 'blur',
    },
    {
      type: 'number',
      min: 1,
      message: 'Machine Number must be greater than 0',
      trigger: 'blur',
    },
  ],
  brand: [
    {
      required: props.mode !== 'delete',
      message: 'Brand is required',
      trigger: 'blur',
    },
    {
      min: 1,
      max: 100,
      message: 'Brand must be between 1 and 100 characters',
      trigger: 'blur',
    },
  ],
  tonnage: [
    {
      required: props.mode !== 'delete',
      message: 'Tonnage is required',
      trigger: 'blur',
    },
    {
      type: 'number',
      min: 1,
      message: 'Tonnage must be greater than 0',
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
  if (isUpdateMode.value) return 'Update Machine'
  return 'Create Machine'
})

// Initialize form with provided data
const initializeFormData = () => {
  // Reset form data to defaults
  formData.value = {
    id: 0,
    brand: '',
    tonnage: 0,
  }

  // If we have data, populate the form
  if (props.data && Object.keys(props.data).length > 0) {
    formData.value = {
      id: props.data.id || 0,
      brand: props.data.brand || '',
      tonnage: Number(props.data.tonnage) || 0,
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
        id: 0,
        brand: '',
        tonnage: 0,
      }
    }
  },
)

// Handle form submission
const handleSubmit = async values => {
  isSubmitting.value = true

  try {
    if (props.mode === 'update') {
      await machineStore.update(props.data.id, values)
    } else if (props.mode === 'add') {
      await machineStore.add(values)
    } else if (props.mode === 'delete') {
      await machineStore.delete(props.data.id)
    }
    emit('close')
  } catch (error) {
    console.error(`Error ${props.mode}ing machine:`, error)
  } finally {
    isSubmitting.value = false
  }
}

// Lifecycle hooks
onMounted(() => {
  // Initialize form data when component mounts
  initializeFormData()
})
</script>

<style scoped>
.full-width {
  width: 100%;
}

/* Additional styling for better accessibility */
:deep(.ant-form-item) {
  margin-bottom: 16px;
}

:deep(.ant-form-item-label > label) {
  font-weight: 500;
}

:deep(.ant-input-number) {
  width: 100%;
}
</style>
