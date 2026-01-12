<template>
  <a-row :gutter="[24, 24]" :wrap="true">
    <BaseWidget
      :height="110"
      title="Total Machine"
      :value="machineStore.totalMachine"
      :icon="SettingOutlined"
      description="Counted machine listed on database"
    />
    <BaseWidget
      :height="110"
      title="Notes"
      description="Machine statistics data doesn't automatically update from the RDZ device."
      :icon="ExclamationCircleOutlined"
    />
  </a-row>
</template>

<script setup>
import BaseWidget from '@/components/base/BaseWidget.vue'
import { useMachineStore } from '@/stores/machine'
import {
  SettingOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons-vue'
const machineStore = useMachineStore()
</script>

<style scoped></style>
