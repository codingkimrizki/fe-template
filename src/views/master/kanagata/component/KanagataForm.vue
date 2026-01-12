<template>
  <a-form
    layout="vertical"
    :model="formData"
    :rules="formRules"
    @finish="handleSubmit"
  >
    <!-- RFID Number Field -->
    <a-form-item
      label="RFID Number"
      name="id"
      :validate-trigger="['blur', 'change']"
    >
      <a-input
        :controls="false"
        placeholder="Enter RFID Number"
        v-model:value="formData.id"
        :disabled="isDeleteMode"
        autocomplete="off"
      />
    </a-form-item>

    <!-- Kanagata Name Field -->
    <a-form-item
      label="Kanagata Name"
      name="name"
      :validate-trigger="['blur', 'change']"
    >
      <a-input
        placeholder="Enter Kanagata Name"
        v-model:value="formData.name"
        :disabled="isDeleteMode"
      />
    </a-form-item>

    <!-- Drawing Number Field -->
    <a-form-item
      label="Drawing Number"
      name="drawingNumber"
      :validate-trigger="['blur', 'change']"
    >
      <a-input
        :disabled="isDeleteMode"
        placeholder="Enter Drawing Number"
        v-model:value="formData.drawingNumber"
        :controls="false"
      />
    </a-form-item>

    <a-flex gap="small" align="center">
      <a-form-item label="Drawing File" name="document">
        <a-upload
          :before-upload="beforeUpload"
          :file-list="fileList"
          :max-count="1"
          accept=".pdf"
          @remove="handleRemove"
        >
          <a-button :icon="h(UploadOutlined)" :disabled="isDeleteMode">
            Upload
          </a-button>
        </a-upload>
      </a-form-item>
      <template v-if="props.data.drawingPath && !fileList.length">
        <a-button
          :icon="h(FileOutlined)"
          :disabled="isDeleteMode"
          type="dashed"
          :href="generatePublicUrl(props.data.drawingPath)"
          target="_blank"
          >Recent File</a-button
        >
      </template>
    </a-flex>

    <!-- Cavity, Die, and Ultrasonic Status Row -->
    <a-row :gutter="[16, 8]">
      <a-col :span="24" :md="8">
        <a-form-item
          label="Cavity"
          name="cavity"
          :validate-trigger="['blur', 'change']"
        >
          <a-input-number
            :disabled="isDeleteMode"
            placeholder="Enter Cavity Count"
            :min="0"
            v-model:value="formData.cavity"
            class="full-width"
            :controls="false"
          />
        </a-form-item>
      </a-col>

      <a-col :span="24" :md="8">
        <a-form-item
          label="Die"
          name="die"
          :validate-trigger="['blur', 'change']"
        >
          <a-input-number
            :disabled="isDeleteMode"
            placeholder="Enter Die Count"
            :min="0"
            v-model:value="formData.die"
            class="full-width"
            :controls="false"
          />
        </a-form-item>
      </a-col>

      <a-col :span="24" :md="8">
        <a-form-item
          label="Ultrasonic"
          name="ultrasonicStatus"
          :validate-trigger="['blur', 'change']"
        >
          <a-switch
            :disabled="isDeleteMode"
            v-model:checked="formData.ultrasonicStatus"
            checked-children="Yes"
            un-checked-children="No"
          />
        </a-form-item>
      </a-col>
    </a-row>

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
import { computed, ref, watch, onMounted, h } from 'vue'
import { UploadOutlined, FileOutlined } from '@ant-design/icons-vue'
import { useKanagataStore } from '@/stores/kanagata'
import { uploadData } from '@/composable/upload'
import { generatePublicUrl } from '@/utils/generatePublicUrl'
import { message, Upload } from 'ant-design-vue'

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
const kanagataStore = useKanagataStore()

// Component state
const isSubmitting = ref(false)

// Form data with proper initialization
const formData = ref({
  id: '',
  name: '',
  drawingNumber: '',
  cavity: 0,
  die: 0,
  ultrasonicStatus: false,
})
const fileList = ref([])

// Validation rules
const formRules = computed(() => ({
  id: [
    {
      required: true,
      message: 'RFID Number is required',
      trigger: 'blur',
    },
    {
      pattern: /^[A-Za-z0-9_-]+$/,
      message:
        'RFID Number can only contain letters, numbers, hyphens, and underscores',
      trigger: 'blur',
    },
  ],
  name: [
    {
      required: true,
      message: 'Kanagata Name is required',
      trigger: 'blur',
    },
    {
      min: 1,
      max: 150,
      message: 'Kanagata Name must be between 1 and 150 characters',
      trigger: 'blur',
    },
  ],
  drawingNumber: [
    {
      required: false,
      message: 'Drawing Number is required',
      trigger: 'blur',
    },
    {
      max: 50,
      message: 'Drawing Number cannot exceed 50 characters',
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
  if (isUpdateMode.value) return 'Update Kanagata'
  return 'Create Kanagata'
})

const beforeUpload = file => {
  // daftar MIME type yang diizinkan
  const allowedTypes = [
    'application/pdf',
    'image/png',
    'image/jpeg',
    'image/jpg',
  ]
  const maxSize = 2 * 1024 * 1024 // 2MB

  // validasi type
  if (!allowedTypes.includes(file.type)) {
    message.error('Only PDF, PNG, JPG, or JPEG files are allowed')
    return Upload.LIST_IGNORE
  }

  // validasi size
  if (file.size > maxSize) {
    message.error('File size must be less than 2MB')
    return Upload.LIST_IGNORE
  }

  // tambahkan file ke fileList secara manual
  fileList.value = [file]

  // return false agar tidak upload otomatis
  return false
}

const handleRemove = () => {
  fileList.value = []
}

// Initialize form with provided data
const initializeFormData = () => {
  // Reset form data to defaults
  formData.value = {
    id: '',
    name: '',
    drawingNumber: '',
    cavity: 0,
    die: 0,
    ultrasonicStatus: false,
  }

  fileList.value = []

  // If we have data, populate the form
  if (props.data && Object.keys(props.data).length > 0) {
    formData.value = {
      id: props.data.id || '',
      name: props.data.name || '',
      drawingNumber: props.data.drawingNumber || '', // Fixed: was tonnage
      cavity: Number(props.data.cavity) || 0,
      die: Number(props.data.die) || 0,
      ultrasonicStatus: Boolean(props.data.ultrasonicStatus) || false,
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
        drawingNumber: '',
        cavity: 0,
        die: 0,
        ultrasonicStatus: false,
      }
    }
  },
)

// Handle form submission
const handleSubmit = async values => {
  isSubmitting.value = true

  try {
    let uploadedFilePath = null

    // ⬇️ Upload file hanya jika ada
    if (fileList.value.length) {
      const formDataToSend = new FormData()
      formDataToSend.append('document', fileList.value[0])

      const response = await uploadData('document', formDataToSend)
      uploadedFilePath = response?.file?.path || null
    }

    // Data yang akan dikirim ke backend
    const payload = {
      ...values,
      ...(uploadedFilePath && { drawingPath: uploadedFilePath }), // tambahkan hanya jika ada
    }

    // Mode logic
    if (props.mode === 'update') {
      await kanagataStore.update(props.data.id, payload)
    } else if (props.mode === 'add') {
      await kanagataStore.add(payload)
    } else if (props.mode === 'delete') {
      await kanagataStore.delete(props.data.id)
    }

    emit('close')
  } catch (error) {
    console.error(`Error ${props.mode} kanagata:`, error)
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
