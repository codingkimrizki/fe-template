<template>
  <a-row :gutter="[24, 24]" :wrap="true">
    <BaseWidget
      title="Total Kanagata"
      :value="kanagataStore.totalKanagata"
      :icon="SettingOutlined"
      description="Counted kanagata listed on database"
    />
    <BaseWidget
      title="Notes"
      description="Search bar is only used for name or id fields"
      :icon="ExclamationCircleOutlined"
    />
  </a-row>
</template>

<script setup>
import { useKanagataStore } from '@/stores/kanagata'
import {
  SettingOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons-vue'
import BaseWidget from '@/components/base/BaseWidget.vue'
const kanagataStore = useKanagataStore()
</script>

<style scoped></style>
