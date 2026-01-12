<template>
  <a-form
    layout="vertical"
    :model="formData"
    :rules="formRules"
    @finish="handleAction"
  >
    <a-form-item label="Name" name="name" :validate-trigger="['change']">
      <a-input
        v-model:value="formData.name"
        :disabled="isDeleteMode"
        autocomplete="off"
        placeholder="Sparepart name"
      />
    </a-form-item>
    <a-form-item
      label="Sparepart Number"
      name="sparepartNumber"
      :validate-trigger="['change', 'blur']"
    >
      <a-input
        v-model:value="formData.sparepartNumber"
        :disabled="isDeleteMode"
        autocomplete="off"
        placeholder="Sparepart number"
      />
    </a-form-item>
    <a-row :gutter="[16, 16]">
      <a-col :span="12">
        <a-form-item
          label="Unit Type"
          name="unitType"
          :validate-trigger="['change', 'blur']"
        >
          <a-select
            v-model:value="formData.unitType"
            :options="[
              { label: 'pcs', value: 'pcs' },
              { label: 'pack', value: 'pack' },
            ]"
            :disabled="isDeleteMode"
          />
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item
          label="Unit Quantity"
          name="unitQty"
          :validate-trigger="['change', 'blur']"
        >
          <a-input-number
            v-model:value="formData.unitQty"
            :disabled="isDeleteMode || formData.unitType === 'pcs'"
            :min="1"
          />
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item
          label="Minimum Stock"
          name="minStock"
          :validate-trigger="['change', 'blur']"
          autocomplete="off"
          tooltip="Minimum stock refers to sparepart unit"
        >
          <a-input-number
            v-model:value="formData.minStock"
            :disabled="isDeleteMode"
            :min="0"
          />
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item
          label="Category"
          name="categoryId"
          :validate-trigger="['change', 'blur']"
        >
          <a-select
            v-model:value="formData.categoryId"
            :options="categoryStore.categoryOptions"
            :disabled="isDeleteMode"
          />
        </a-form-item>
      </a-col>
    </a-row>
    <a-flex gap="small" align="end" class="mb-large">
      <a-space direction="vertical">
        <span>Drawing File</span>
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
      </a-space>
      <template v-if="props.data.drawingPath && !fileList.length">
        <a-button
          :icon="h(FileOutlined)"
          :disabled="isDeleteMode"
          type="dashed"
          :href="generatePublicUrl(props.data.drawingPath)"
          target="_blank"
        >
          Recent File
        </a-button>
      </template>
    </a-flex>
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
import { useSparepartCategoryStore } from '@/stores/sparepartCategory'
import { useSparepartStore } from '@/stores/sparepart'
import { computed, onMounted, ref, h, watch } from 'vue'
import { generatePublicUrl } from '@/utils/generatePublicUrl'
import { message, Upload } from 'ant-design-vue'
import { UploadOutlined, FileOutlined } from '@ant-design/icons-vue'
import { uploadData } from '@/composable/upload'

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

const sparepartStore = useSparepartStore()
const categoryStore = useSparepartCategoryStore()

// Define component events
const emit = defineEmits(['close'])
const isSubmitting = ref(false)
const fileList = ref([])

const formData = ref({
  name: null,
  sparepartNumber: null,
  minStock: 0,
  categoryId: null,
  unitType: 'pcs',
  unitQty: 1,
})

const formRules = computed(() => ({
  name: [
    {
      required: true,
      message: 'Sparepart name is required',
      trigger: 'blur',
    },
  ],
  sparepartNumber: [
    {
      required: true,
      message: 'Sparepart number is required',
      trigger: 'blur',
    },
  ],
  categoryId: [
    {
      required: true,
      message: 'Category is required',
      trigger: 'blur',
    },
  ],
  unitType: [
    {
      required: true,
      message: 'Unit type is required',
      trigger: 'blur',
    },
  ],
  unitQty: [
    {
      required: true,
      message: 'Unit quantity is required',
      trigger: 'blur',
    },
  ],
}))

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

// Remove file from file list
const handleRemove = () => {
  fileList.value = []
}

const isDeleteMode = computed(() => props.mode === 'delete')
const isUpdateMode = computed(() => props.mode === 'update')

const handleAction = async values => {
  isSubmitting.value = true
  try {
    let uploadedFilePath = null

    if (fileList.value.length) {
      const formDataToSend = new FormData()
      formDataToSend.append('document', fileList.value[0])

      const response = await uploadData('document', formDataToSend)
      uploadedFilePath = response?.file?.path || null
    }

    const payload = {
      ...values,
      ...(uploadedFilePath && { drawingPath: uploadedFilePath }),
    }

    if (props.mode === 'update') {
      await sparepartStore.update(props.data.id, payload)
    } else if (props.mode === 'add') {
      await sparepartStore.add(payload)
    } else if (props.mode === 'delete') {
      await sparepartStore.delete(props.data.id)
    }
    emit('close')
  } catch (error) {
    console.log(`Error ${props.mode}ing sparepart:`, error)
  } finally {
    isSubmitting.value = false
  }
}

const submitButtonText = computed(() => {
  if (isSubmitting.value) return 'Processing...'
  if (isDeleteMode.value) return 'Confirm Delete'
  if (isUpdateMode.value) return 'Update Sparepart'
  return 'Add Sparepart'
})

const initializeFormData = () => {
  formData.value = {
    name: null,
    sparepartNumber: null,
    minStock: 0,
    categoryId: null,
    unitQty: 1,
    unitType: 'pcs',
  }
  fileList.value = []

  if (props.data && Object.keys(props.data).length > 0) {
    formData.value = {
      name: props.data.name || '',
      sparepartNumber: props.data.sparepartNumber || '',
      minStock: Number(props.data.minStock) || 0,
      categoryId: props.data.categoryId || null,
      unitQty: Number(props.data.unitQty) || 1,
      unitType: props.data.unitType || 'pcs',
    }
  }
}

onMounted(async () => {
  categoryStore.getOptions()
  initializeFormData()
})

watch(
  () => props.data,
  () => {
    initializeFormData()
  },
  { immediate: true },
)

watch(
  () => props.mode,
  () => initializeFormData(),
)

watch(
  () => formData.value.unitType,
  () => {
    if (formData.value.unitType === 'pcs') {
      formData.value.unitQty = 1
    }
  },
)
</script>

<style scoped>
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
