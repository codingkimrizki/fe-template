<template>
  <a-col :flex="1">
    <a-flex
      justify="space-evenly"
      align="center"
      class="mb-small"
      wrap="wrap"
      :gap="20"
    >
      <a-space direction="vertical" :size="2" align="center">
        <BaseProgress
          title="Kanagata"
          :percent="percent"
          :size="110"
          type="dashboard"
          :value="formatNumber(shotData?.actual)"
        />
        <a-space :size="5">
          <a-tooltip title="Setting" placement="bottom">
            <a-button
              type="primary"
              :icon="h(SettingOutlined)"
              shape="circle"
              @click="handleEvent('Setting')"
            />
          </a-tooltip>
          <a-tooltip title="Reset Shot" placement="bottom">
            <a-button
              type="primary"
              :icon="h(UndoOutlined)"
              shape="circle"
              @click="handleEvent('Reset')"
            />
          </a-tooltip>
          <a-tooltip title="Adjust Shot" placement="bottom">
            <a-button
              type="primary"
              :icon="h(FormOutlined)"
              shape="circle"
              @click="handleEvent('Adjust')"
            />
          </a-tooltip>
          <a-tooltip
            title="Verify 1/2 PM"
            placement="bottom"
            v-if="shotData.ultrasonicStatus && !shotData.ultrasonicCheck"
          >
            <a-popconfirm title="Complete 1/2 PM ?" @confirm="verifyUltrasonic">
              <a-button
                type="primary"
                :icon="h(CheckCircleOutlined)"
                shape="circle"
              />
            </a-popconfirm>
          </a-tooltip>
        </a-space>
      </a-space>
      <a-descriptions
        bordered
        :column="{ xxl: 2, xl: 2, lg: 2, md: 2, sm: 2, xs: 2 }"
        class="compact-desc"
      >
        <a-descriptions-item :span="2">
          <template #label>
            <span class="bold">Remaining</span>
          </template>
          {{ formatNumber(shotData?.target - shotData?.actual) }}
        </a-descriptions-item>
        <a-descriptions-item :span="2">
          <template #label>
            <span class="bold">Overshot</span>
          </template>
          {{ formatNumber(shotData?.target) }}
        </a-descriptions-item>
        <a-descriptions-item>
          <template #label>
            <span class="bold">Ultrasonic</span>
          </template>
          <CheckCircleOutlined
            v-if="shotData.ultrasonicStatus"
            class="green large"
          />
          <CloseCircleOutlined v-else class="stop-icon large" />
        </a-descriptions-item>
        <a-descriptions-item>
          <template #label>
            <span class="bold">{{
              shotData?.ultrasonicCheck ? '1/2 PM' : 'Remaining'
            }}</span>
          </template>
          <template v-if="!Number.isFinite(ultrasonicRemaining)">
            <CheckCircleOutlined
              v-if="ultrasonicRemaining == 'checked'"
              class="green large"
            />
            <CloseCircleOutlined
              v-if="ultrasonicRemaining == 'unchecked'"
              class="stop-icon large"
            />
          </template>
          <span v-else>{{ formatNumber(ultrasonicRemaining) }}</span>
        </a-descriptions-item>
        <a-descriptions-item :span="2">
          <template #label>
            <span class="bold">Status</span>
          </template>
          <a-tag :color="status.color">{{ status.name }}</a-tag>
        </a-descriptions-item>
        <a-descriptions-item :span="2">
          <template #label>
            <span class="bold">Total Shot</span>
          </template>
          <a-flex justify="space-between" align="center">
            <span>{{ formatNumber(shotData.total) }}</span>
            <ExclamationCircleOutlined
              style="color: #e9b63b"
              class="large"
              v-if="lifetimeReminder == 'Renewal Reminder'"
            />
            <CloseCircleOutlined
              class="stop-icon large"
              v-if="lifetimeReminder == 'Overshot'"
            />
          </a-flex>
        </a-descriptions-item>
      </a-descriptions>
    </a-flex>
  </a-col>
</template>

<script setup>
import { formatNumber } from '@/utils/FormatThousandSeparator'
import BaseProgress from '@/components/base/BaseProgress.vue'
import { computed, h } from 'vue'
import {
  SettingOutlined,
  UndoOutlined,
  FormOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons-vue'
import { useThemeStore } from '@/stores/theme'
import { useAuthStore } from '@/stores/auth'
import { useKanagataDashboardStore } from '@/stores/kanagataDashboard'
import { notification } from 'ant-design-vue'

const kanagataDashboardStore = useKanagataDashboardStore()
const authStore = useAuthStore()
const themeStore = useThemeStore()

// Props Component
const props = defineProps({
  title: { type: String, default: 'Shot Control' },
  shotData: { type: Object, required: true },
  id: { type: [String, Number], required: true },
  type: { type: String, default: 'kanagata' },
})

// Calculate percen
const percent = computed(() => {
  const { actual, target } = props.shotData
  if (!target || target === 0) return 0 // hindari pembagian 0
  return Math.min(Math.round((actual / target) * 100), 100) // batasi max 100%
})

// Reactive Status kanagata
const status = computed(() => {
  const {
    actual = 0,
    target = 0,
    tolerance = 0,
    ultrasonicCheck = false,
    ultrasonicStatus = false,
  } = props.shotData
  if (target <= 0) return { name: 'Normal', color: themeStore.colorPrimary }
  if (actual > target) return { name: 'Overshot', color: '#f56c6c' }
  if (actual >= target - tolerance)
    return { name: 'Request PM', color: '#E9B63B' }
  if (ultrasonicStatus && !ultrasonicCheck && actual >= target / 2)
    return { name: 'Request 1/2 PM', color: '#E9B63B' }
  return { name: 'Normal', color: themeStore.colorPrimary }
})

// Ultrasonic Remaining shot
const ultrasonicRemaining = computed(() => {
  const { actual, target, ultrasonicCheck, ultrasonicStatus } = props.shotData
  if (!ultrasonicStatus) return 'unchecked'
  if (ultrasonicCheck) return 'checked'
  return Number(target / 2 - actual)
})

// Lifetime Reminder
const lifetimeReminder = computed(() => {
  const { total, targetTotal } = props.shotData
  const tolerance = targetTotal * 0.1
  const toleranceLimit = targetTotal - tolerance
  if (total > targetTotal && targetTotal != 0) {
    return 'Overshot'
  }

  if (total >= toleranceLimit && targetTotal != 0) {
    return 'Renewal Reminder'
  }

  return 'Normal'
})

// Event Handler button
const handleEvent = mode => {
  if (mode === 'Adjust' && !authStore.isAdmin) {
    notification.error({
      message: 'Restricted Access',
      description: 'Admin role required for this actions',
      duration: 1,
    })
    return
  }
  kanagataDashboardStore.modal = {
    visible: true,
    mode,
    idKanagata: props.id,
    shotType: props.title,
  }
}

const verifyUltrasonic = async () => {
  const logData = {
    kanagataId: props.id,
    userId: authStore.user.id,
    event: 'Verify 1/2 PM',
  }
  await kanagataDashboardStore.updateUltrasonicCheck(props.id, logData)
}
</script>

<style scoped>
.compact-desc :deep(.ant-descriptions-item-label),
.compact-desc :deep(.ant-descriptions-item-content) {
  padding: 5px 15px !important;
}

.red {
  color: #c66e52;
}

.green {
  color: forestgreen;
}
</style>
