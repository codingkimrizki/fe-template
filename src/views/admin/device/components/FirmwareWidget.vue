<template>
  <div>
    <a-row :gutter="[24, 24]" :wrap="true">
      <BaseWidget
        :height="110"
        title="Latest Firmware"
        :icon="CodeXml"
        :description="description"
      />
      <BaseWidget
        :height="110"
        title="Total Firmware"
        :icon="ListCheck"
        :value="firmwareStore.totalFirmware"
        description="Total RDZ-M firmware uploaded to server"
      />
      <BaseWidget
        :hoverable="false"
        :height="110"
        title="OTA Endpoint"
        :icon="WifiSync"
        :col="{
          xs: 24,
          sm: 24,
          md: 24,
          lg: 24,
          xl: 12,
        }"
      >
        <template #description>
          <a-flex justify="space-between" align="center">
            <a :href="`${otaEndpoint}ILI`" class="italic underlined"
              >{{ otaEndpoint }}ILI</a
            >
            <a-tooltip title="Copy URL">
              <a-button
                type="primary"
                size="small"
                @click="copyUrl(`${otaEndpoint}ILI`)"
              >
                <a-space>
                  <Copy :size="12" />
                  URL
                </a-space>
              </a-button>
            </a-tooltip>
          </a-flex>
          <a-flex justify="space-between" align="center">
            <a :href="`${otaEndpoint}ST`" class="italic underlined"
              >{{ otaEndpoint }}ST</a
            >
            <a-tooltip title="Copy URL">
              <a-button
                type="primary"
                size="small"
                @click="copyUrl(`${otaEndpoint}ST`)"
              >
                <a-space>
                  <Copy :size="12" />
                  URL
                </a-space>
              </a-button>
            </a-tooltip>
          </a-flex>
        </template>
      </BaseWidget>
    </a-row>
  </div>
</template>

<script setup>
import BaseWidget from '@/components/base/BaseWidget.vue'
import { CodeXml, Copy, ListCheck, WifiSync } from 'lucide-vue-next'
import { useFirmwareManagerStore } from '@/stores/firmwareManager'
import { computed } from 'vue'
import { message } from 'ant-design-vue'

const firmwareStore = useFirmwareManagerStore()

const description = computed(() =>
  firmwareStore.latestVersion.length === 0
    ? 'There is no firmware with latest version'
    : `Version ${firmwareStore.latestVersion.join(', ')} is the latest firmware`,
)

const otaEndpoint = `${import.meta.env.VITE_API_BASE_URL}/firmwares/download?version=`

const copyUrl = async url => {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(url)
      message.success('URL copied to clipboard')
    } else {
      // Fallback jika Clipboard API tidak tersedia (misal non-HTTPS)
      const textArea = document.createElement('textarea')
      textArea.value = url
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      message.success('URL copied to clipboard')
    }
  } catch (err) {
    message.error('Failed to copy URL')
    console.error('Copy error:', err)
  }
}
</script>

<style scoped>
.hoverable {
  cursor: pointer;
}

.hoverable:hover {
  opacity: 0.6;
  scale: 1.2;
}
</style>
