<template>
  <a-flex
    v-if="!store.renewalReminder.length"
    justify="center"
    align="center"
    style="height: 85vh"
  >
    <a-empty description="There is no kanagata reach total shot" />
  </a-flex>
  <template v-else>
    <a-flex justify="flex-end">
      <a-button
        type="primary"
        size="small"
        :icon="h(DownloadOutlined)"
        @click="
          generatePdfFromArray(
            store.renewalReminder,
            'KanagataRenewalList',
            'Kanagata Renewal List',
            authStore.user.name,
          )
        "
        >Download .pdf</a-button
      >
    </a-flex>
    <a-card
      size="small"
      hoverable
      :bordered="true"
      :key="kanagata.id"
      v-for="kanagata in store.renewalReminder"
    >
      <a-flex vertical :gap="0">
        <span class="medium bold">{{ kanagata.name }}</span>
        <a-flex justify="space-between" align="center">
          <a-tag :color="themeStore.colorPrimary">{{ kanagata.id }}</a-tag>
          <a-tooltip title="Percent shot usage" placement="bottom">
            <div style="width: 120px; margin-right: 5%">
              <a-progress
                :stroke-color="getProgressColor(kanagata.percentage)"
                :percent="Number(kanagata.percentage)"
                size="small"
                status="active"
              >
                <template #format>
                  <span style="color: white"> {{ kanagata.percentage }}% </span>
                </template>
              </a-progress>
            </div>
          </a-tooltip>
        </a-flex>
        <a-flex justify="space-between">
          <span
            >Overshot : {{ formatThousandSeparator(kanagata.targetTotal) }}
          </span>
          <span
            >Total Shot :
            {{ formatThousandSeparator(kanagata.totalKanagataShot) }}
          </span>
        </a-flex>
      </a-flex>
    </a-card>
  </template>
</template>

<script setup>
import { useMaintenanceNotifyStore } from '@/stores/maintenanceNotify'
import { formatThousandSeparator } from '@/utils/formatterInputNumber'
import { useThemeStore } from '@/stores/theme'
import { generatePdfFromArray } from '@/utils/generatePdfList'
import { DownloadOutlined } from '@ant-design/icons-vue'
import { h } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const themeStore = useThemeStore()
const store = useMaintenanceNotifyStore()

// 👉 warna progress berdasarkan rules
const getProgressColor = p => {
  if (p >= 100) return '#F56C6C' // merah
  if (p >= 90) return '#FAC859' // kuning
  return '#52c41a' // hijau
}
</script>

<style scoped></style>
