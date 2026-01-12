<template>
  <a-form layout="vertical" :model="form" :rules="rules" @finish="handleSubmit">
    <a-form-item label="Version" name="version">
      <a-input
        placeholder="Firmware version"
        v-model:value="form.version"
        :disabled="isDeleteMode"
      />
    </a-form-item>
    <a-form-item label="Status" name="status">
      <a-select
        v-model:value="form.status"
        placeholder="Select Status"
        :disabled="isDeleteMode"
      >
        <a-select-option value="BETA">BETA</a-select-option>
        <a-select-option value="STABLE">STABLE</a-select-option>
        <a-select-option value="DEPRECATED">DEPRECATED</a-select-option>
        <a-select-option value="LATEST">LATEST</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item label="Note" name="note">
      <a-textarea
        placeholder="Note for this firmware version"
        :rows="5"
        v-model:value="form.note"
        :disabled="isDeleteMode"
      />
    </a-form-item>
    <a-card size="small" :bordered="false" class="mb-large" v-if="!isAddMode">
      <a-flex vertical gap="small">
        <span class="bold">File Data</span>
        <a-flex justify="space-between" class="small">
          <span>
            {{ props.data?.firmwarePath?.split('/')[2] }}
          </span>
          <span>
            {{
              props.data?.fileSize
                ? (props.data.fileSize / 1024 / 1024).toFixed(2)
                : '0.00'
            }}
            MB
          </span>
        </a-flex>
      </a-flex>
    </a-card>
    <a-form-item label="Firmware File" v-if="!isDeleteMode" name="document">
      <a-upload
        :before-upload="beforeUpload"
        :file-list="fileList"
        :max-count="1"
        @remove="handleRemove"
        accept=".bin,.hex"
      >
        <a-button
          type="dashed"
          :icon="h(UploadOutlined)"
          :disabled="isDeleteMode"
          >{{ uploadText }}</a-button
        >
      </a-upload>
    </a-form-item>
    <a-flex justify="flex-end">
      <a-button
        type="primary"
        html-type="submit"
        :loading="isSubmitting"
        :disabled="isSubmitting"
      >
        {{ submitButtonText }}
      </a-button>
    </a-flex>
  </a-form>
</template>

<script setup>
import { uploadData } from '@/composable/upload'
import { message, Upload } from 'ant-design-vue'
import { computed, h, ref, watch } from 'vue'
import { useFirmwareManagerStore } from '@/stores/firmwareManager'
import { UploadOutlined } from '@ant-design/icons-vue'

const firmwareStore = useFirmwareManagerStore()

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

const form = ref({
  version: null,
  status: null,
  note: null,
  firmwarePath: null,
})

const emit = defineEmits(['close'])

const rules = computed(() => ({
  version: [
    {
      required: true,
      message: 'Firmware version is required',
      trigger: 'blur',
    },
  ],
  status: [
    { required: true, message: 'Status is required', trigger: 'blur' },
    {
      validator: (rule, value) => {
        if (value === 'LATEST') {
          const version = form.value.version
          if (!version) {
            return Promise.reject('Version is required for LATEST status')
          }
          const upperVersion = version.toUpperCase()
          if (!upperVersion.includes('ILI') && !upperVersion.includes('ST')) {
            return Promise.reject(
              'Status latest only for firmware versions containing ILI or ST',
            )
          }
        }
        return Promise.resolve()
      },
      trigger: 'change',
    },
  ],
  note: [
    { max: 200, message: 'Note cannot exceed 200 characters', trigger: 'blur' },
  ],
}))

const isSubmitting = ref(false)
const isDeleteMode = computed(() => props.mode === 'delete')
const isUpdateMode = computed(() => props.mode === 'update')
const isAddMode = computed(() => props.mode === 'add')

const submitButtonText = computed(() => {
  if (isSubmitting.value) return 'Processing...'
  if (isDeleteMode.value) return 'Confirm Delete'
  if (isUpdateMode.value) return 'Update Firmware'
  return 'Add Firmware'
})

const uploadText = computed(() => {
  if (isUpdateMode.value) return 'Reupload for update file'
  return 'Upload'
})

const fileList = ref([])

// Validasi seeblum upload
const beforeUpload = file => {
  const allowedExtensions = ['bin', 'hex']
  const maxSize = 100 * 1024 * 1024 // 50MB

  const fileName = file.name.toLowerCase()
  const extension = fileName.split('.').pop()

  // validasi ekstensi
  if (!allowedExtensions.includes(extension)) {
    message.error('Only .bin or .hex firmware files are allowed')
    return Upload.LIST_IGNORE
  }

  // validasi size
  if (file.size > maxSize) {
    message.error('Firmware size must be less than 100MB')
    return Upload.LIST_IGNORE
  }

  // simpan file secara manual
  fileList.value = [file]

  // cegah auto upload
  return false
}

const handleRemove = () => {
  fileList.value = []
}

const resetForm = () => {
  form.value = {
    version: null,
    status: null,
    note: null,
    firmwarePath: null,
  }
}

const initializeFormData = () => {
  // Reset form first
  resetForm()

  fileList.value = []

  if (props.data && Object.keys(props.data).length > 0) {
    form.value = {
      version: props.data.version,
      status: props.data.status,
      note: props.data.note,
      firmwarePath: props.data.firmwarePath,
    }
  }
}

watch(
  () => props.data,
  newData => {
    if (newData) {
      initializeFormData()
    }
  },
  { immediate: true },
)

watch(
  () => props.mode,
  newMode => {
    if (newMode === 'add') {
      resetForm()
    }
  },
)

const handleSubmit = async values => {
  isSubmitting.value = true

  try {
    let metadata = null

    if (fileList.value.length) {
      const formDataToSend = new FormData()
      formDataToSend.append('firmware', fileList.value[0])
      const response = await uploadData('firmware', formDataToSend)
      const { file } = response
      const { path, sha256, md5, size } = file
      metadata = { firmwarePath: path, sha256, md5, fileSize: size }
    }

    const payload = {
      ...values,
      ...(metadata && metadata),
    }

    if (props.mode === 'add') {
      await firmwareStore.add(payload)
    } else if (props.mode === 'update') {
      await firmwareStore.update(props.data.id, payload)
    } else if (props.mode === 'delete') {
      await firmwareStore.delete(props.data.id)
    }

    emit('close')
  } catch (error) {
    console.error(`Error ${props.mode} firmware:`, error)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped></style>
