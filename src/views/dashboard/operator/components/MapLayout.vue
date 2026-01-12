<template>
  <Teleport to="body">
    <a-tooltip title="Layout Machine" placement="left">
      <a-float-button
        type="primary"
        class="float-button"
        @click="modal.visible = true"
      >
        <template #icon="">
          <AppstoreOutlined />
        </template>
      </a-float-button>
    </a-tooltip>
    <BaseModal
      :width="1000"
      :visible="modal.visible"
      :title="modal.title"
      @close="modal.visible = false"
    >
      <template #body>
        <a-flex
          vertical
          gap="middle"
          justify="center"
          align="center"
          class="flex-modal-body"
        >
          <a-image
            v-if="imageExist"
            crossorigin="anonymous"
            :src="imageUrl"
            :preview="false"
            class="layout-image"
          />
          <a-empty
            v-else
            description="No layout image available"
            class="empty-layout"
          >
            <template #image>
              <PictureOutlined
                :style="{ fontSize: '94px', color: '#bfbfbf' }"
              />
            </template>
          </a-empty>
        </a-flex>

        <!-- Upload Section -->
        <a-flex vertical align="center" :gap="4" style="margin-top: 16px">
          <a-upload
            :showUploadList="false"
            :file-list="fileList"
            accept=".png"
            :max-count="1"
            :before-upload="beforeUpload"
            :customRequest="handleUpload"
          >
            <a-button
              type="primary"
              :icon="h(UploadOutlined)"
              :disabled="!authStore.isAdmin"
            >
              Upload
            </a-button>
          </a-upload>
          <span class="small">File extension .png (size max 1Mb)</span>
        </a-flex>
      </template>
    </BaseModal>
  </Teleport>
</template>

<script setup>
import {
  AppstoreOutlined,
  UploadOutlined,
  PictureOutlined,
} from '@ant-design/icons-vue'
import BaseModal from '@/components/base/BaseModal.vue'
import { h, onMounted, ref } from 'vue'
import { uploadData } from '@/composable/upload'
import { message, Upload } from 'ant-design-vue'
import { generatePublicUrl } from '@/utils/generatePublicUrl'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const modal = ref({
  title: 'Machine Layout Map',
  visible: false,
})
const imageUrl = ref(generatePublicUrl('/public/image/machineLayout.png'))
const imageExist = ref(false)
const fileList = ref([])

// ✅ Validasi file sebelum upload
const beforeUpload = file => {
  const allowedTypes = ['image/png']
  const maxSize = 1 * 1024 * 1024 // 1MB

  if (!allowedTypes.includes(file.type)) {
    message.error('Only PNG files are allowed')
    return Upload.LIST_IGNORE
  }

  if (file.size > maxSize) {
    message.error('File size must be less than 1MB')
    return Upload.LIST_IGNORE
  }

  return true
}

// Check existing image
const checkImageExists = async () => {
  try {
    const res = await axios.head(imageUrl.value, { withCredentials: false })
    imageExist.value = res.status === 200
  } catch {
    imageExist.value = false
  }
}

// Cache busting: ubah URL agar browser ambil ulang
const reloadImage = () => {
  imageUrl.value = `${generatePublicUrl('/image/machineLayout.png')}?t=${Date.now()}`
  checkImageExists()
}

// ✅ handle upload menggunakan customRequest bawaan Ant Design Vue
const handleUpload = async ({ file, onSuccess, onError }) => {
  const formData = new FormData()
  formData.append('machineLayout', file)

  try {
    const result = await uploadData('machine-layout', formData)
    message.success('Layout uploaded successfully!')
    onSuccess(result) // wajib panggil ini agar status upload jadi "done"
    reloadImage() // Reload new image after success
  } catch (error) {
    message.error('Failed to upload layout')
    onError(error)
  }
}

onMounted(() => {
  checkImageExists()
})
</script>

<style scoped>
.empty-layout {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  min-height: 300px;
}

.layout-image {
  max-width: 100%;
  height: auto;
  object-fit: contain;
  /* atau 'cover' tergantung kebutuhan */
}

.flex-modal-body {
  max-height: 700px;
}

.float-button {
  bottom: 72px;
  left: 24px;
}
</style>
