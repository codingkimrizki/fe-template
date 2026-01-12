<template>
  <Teleport to="body">
    <a-tooltip title="Voice Setting" placement="left">
      <a-float-button
        type="primary"
        class="float-button"
        @click="store.visible = true"
      >
        <template #icon>
          <SettingOutlined />
        </template>
      </a-float-button>
    </a-tooltip>
    <BaseModal
      :visible="store.visible"
      modal-title="Voice Setting"
      @close="handleClose"
    >
      <template #body>
        <a-form layout="vertical">
          <a-form-item label="Voice" name="voice">
            <a-select
              v-model:value="store.voiceSetting.selectedVoice"
              :options="store.voices"
            />
          </a-form-item>
          <a-form-item label="Rate" name="rate">
            <a-slider
              v-model:value="store.voiceSetting.rate"
              :min="0"
              :max="2"
              :step="0.1"
            />
          </a-form-item>
          <a-form-item label="Pitch" name="rate">
            <a-slider
              v-model:value="store.voiceSetting.pitch"
              :min="0"
              :max="2"
              :step="0.1"
            />
          </a-form-item>
          <a-flex justify="flex-end">
            <a-button
              type="primary"
              @click="store.speak('Machine number 1, 2, 3 is lotfull')"
              >Test Speak</a-button
            >
          </a-flex>
        </a-form>
      </template>
    </BaseModal>
  </Teleport>
</template>

<script setup>
import BaseModal from '@/components/base/BaseModal.vue'
import { SettingOutlined } from '@ant-design/icons-vue'

import { useVoiceStore } from '@/stores/voice'

const store = useVoiceStore()

const handleClose = () => {
  store.visible = false
}
</script>

<style scoped>
.float-button {
  left: 24px;
  bottom: 120px;
}
</style>
