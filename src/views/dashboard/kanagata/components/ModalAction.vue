<template>
  <Teleport to="body">
    <BaseModal
      :visible="kanagataDashboardStore.modal.visible"
      :modal-title="modalTitle"
      @close="handleClose"
    >
      <template #title>
        <a-space direction="vertical" :size="5" class="mb-small">
          <span class="large">{{ modalTitle }}</span>
          <a-space :size="2">
            <a-tag :color="themeStore.colorPrimary">{{
              kanagataDashboardStore.modal.idKanagata
            }}</a-tag>
            <a-tag color="grey">{{ kanagata?.name }}</a-tag>
          </a-space>
        </a-space>
      </template>
      <template #body>
        <BaseLogAction
          :logs="logStore.logs"
          v-if="kanagataDashboardStore.modal.mode === 'Log Action'"
          v-model:dateRange="logStore.filter.dateRange"
          @date-range-change="logStore.get()"
        />
        <ActionForm v-else />
      </template>
    </BaseModal>
  </Teleport>
</template>

<script setup>
import BaseModal from '@/components/base/BaseModal.vue'
import { useKanagataDashboardStore } from '@/stores/kanagataDashboard'
import { capitalizeEachWord } from '@/utils/capitalizeEachWord'
import { computed, watch } from 'vue'
import { useThemeStore } from '@/stores/theme'
import { useLogKanagataStore } from '@/stores/logKanagata'
import BaseLogAction from '@/components/base/BaseLogAction.vue'
import ActionForm from './ActionForm.vue'

const logStore = useLogKanagataStore()
const themeStore = useThemeStore()
const kanagataDashboardStore = useKanagataDashboardStore()

const modalTitle = computed(() => {
  const mode = capitalizeEachWord(kanagataDashboardStore.modal.mode)
  const shotType = capitalizeEachWord(kanagataDashboardStore.modal.shotType)
  return `${mode} ${shotType}`
})

const kanagata = computed(() =>
  kanagataDashboardStore.getKanagataById(
    kanagataDashboardStore.modal.idKanagata,
  ),
)
watch(
  () => kanagataDashboardStore.modal,
  modal => {
    if (modal.visible && modal.mode === 'Log Action') {
      logStore.get()
    }
  },
  { deep: true },
)

const handleClose = () => {
  kanagataDashboardStore.resetModal()
  logStore.$reset()
}
</script>

<style scoped></style>
