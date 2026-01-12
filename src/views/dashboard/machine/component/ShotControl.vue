<template>
  <a-col :flex="1">
    <a-flex align="center" justify="center" :gap="30" class="mb-small">
      <BaseProgress
        :title="title"
        type="dashboard"
        :percent="percent"
        :size="130"
        :value="formatNumber(shotData?.actual)"
      />
      <a-flex align="center" vertical :gap="6">
        <a-tooltip title="Setting" placement="right">
          <a-button
            type="primary"
            :icon="h(SettingOutlined)"
            shape="circle"
            @click="handleEvent('Setting')"
          />
        </a-tooltip>
        <a-tooltip title="Reset Shot" placement="right">
          <a-button
            type="primary"
            :icon="h(UndoOutlined)"
            shape="circle"
            @click="handleEvent('Reset')"
          />
        </a-tooltip>
        <a-tooltip title="Adjust Shot" placement="right">
          <a-button
            type="primary"
            :icon="h(FormOutlined)"
            shape="circle"
            @click="handleEvent('Adjust')"
          />
        </a-tooltip>
      </a-flex>
    </a-flex>
    <a-descriptions bordered :column="1" size="small" class="compact-desc">
      <a-descriptions-item>
        <template #label>
          <span class="bold">Remaining</span>
        </template>
        {{ formatNumber(shotData?.target - shotData?.actual) }}
      </a-descriptions-item>
      <a-descriptions-item>
        <template #label>
          <span class="bold">Overshot</span>
        </template>
        {{ formatNumber(shotData?.target) }}
      </a-descriptions-item>
      <a-descriptions-item>
        <template #label>
          <span class="bold">Status</span>
        </template>
        <a-tag :color="status.color">{{ status.name }}</a-tag>
      </a-descriptions-item>
    </a-descriptions>
  </a-col>
</template>
<script setup>
import BaseProgress from '@/components/base/BaseProgress.vue'
import { formatNumber } from '@/utils/FormatThousandSeparator'
import {
  SettingOutlined,
  UndoOutlined,
  FormOutlined,
} from '@ant-design/icons-vue'
import { computed, h } from 'vue'
import { useMachineDashboardStore } from '@/stores/machineDashboard'
import { useAuthStore } from '@/stores/auth'
import { notification } from 'ant-design-vue'
import { useThemeStore } from '@/stores/theme'

const authStore = useAuthStore()
const machineDashboardStore = useMachineDashboardStore()
const themeStore = useThemeStore()

const props = defineProps({
  title: { type: String, default: 'Shot Control', required: true },
  shotData: {
    type: Object,
    default: () => ({ actual: 1000, tolerance: 1000, target: 1000 }),
    required: true,
  },
  id: { type: [String, Number], required: true },
  type: { type: String, default: 'machine', required: true },
})

const handleEvent = mode => {
  if (mode === 'Adjust' && !authStore.isAdmin) {
    notification.error({
      message: 'Restricted Access',
      description: 'Admin role required for this actions',
      duration: 1,
    })
    return
  }
  machineDashboardStore.modal = {
    visible: true,
    mode,
    idMachine: props.id,
    shotType: props.title,
  }
}

const status = computed(() => {
  const { actual, target, tolerance } = props.shotData
  if (actual > target) return { name: 'Overshot', color: '#f56c6c' }
  if (actual >= target - tolerance && actual != 0)
    return { name: 'Request PM', color: '#E9B63B' }
  return { name: 'Normal', color: themeStore.colorPrimary }
})

const percent = computed(() => {
  const { actual, target } = props.shotData

  if (!target || target === 0) return 0 // hindari pembagian 0
  return Math.min(Math.round((actual / target) * 100), 100) // batasi max 100%
})
</script>

<style scoped>
.compact-desc :deep(.ant-descriptions-item-label),
.compact-desc :deep(.ant-descriptions-item-content) {
  padding: 3px 8px !important;
}
</style>
