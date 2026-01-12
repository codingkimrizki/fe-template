<template>
  <Teleport to="body">
    <BaseModal
      :visible="machineDashboardStore.modal.visible"
      :modal-title="modalTitle"
      @close="handleClose"
    >
      <template #title>
        <a-space direction="vertical" :size="5" class="mb-small">
          <span class="large">{{ modalTitle }}</span>
          <a-tag :color="themeStore.colorPrimary"
            >MACHINE {{ machineDashboardStore.modal.idMachine }}</a-tag
          >
        </a-space>
      </template>
      <template #body>
        <BaseLogAction
          :logs="logStore.logs"
          v-if="machineDashboardStore.modal.mode === 'Log Action'"
          v-model:dateRange="logStore.filter.dateRange"
          @date-range-change="logStore.get()"
        />
        <ActionForm v-else />
      </template>
    </BaseModal>
  </Teleport>
</template>

<script setup>
import BaseLogAction from '@/components/base/BaseLogAction.vue'
import BaseModal from '@/components/base/BaseModal.vue'
import { useLogMachineStore } from '@/stores/logMachine'
import { useMachineDashboardStore } from '@/stores/machineDashboard'
import { computed, watch } from 'vue'
import ActionForm from './ActionForm.vue'
import { useThemeStore } from '@/stores/theme'
import { capitalizeEachWord } from '@/utils/capitalizeEachWord'

const logStore = useLogMachineStore()
const machineDashboardStore = useMachineDashboardStore()
const themeStore = useThemeStore()

const modalTitle = computed(() => {
  const mode = capitalizeEachWord(machineDashboardStore.modal.mode)
  const shotType = capitalizeEachWord(machineDashboardStore.modal.shotType)
  return `${mode} ${shotType}`
})

watch(
  () => machineDashboardStore.modal,
  modal => {
    if (modal.visible && modal.mode === 'Log Action') {
      logStore.get()
    }
  },
  { deep: true },
)

const handleClose = () => {
  machineDashboardStore.resetModal()
  logStore.$reset()
}
</script>

<style scoped></style>
