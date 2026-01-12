<template>
  <Teleport to="body">
    <BaseDrawer
      :title="title"
      :width="450"
      :open="store.drawer.open"
      @close="store.toggleDrawer"
    >
      <a-flex vertical :gap="10">
        <MaintenanceMachine v-if="store.drawer.mode === 'machine'" />
        <MaintenanceKanagata v-if="store.drawer.mode === 'kanagata'" />
        <RenewalList v-if="store.drawer.mode === 'renewal'" />
      </a-flex>
      <template #footer>
        <a-flex justify="space-between">
          <span>Total</span>
          <span v-if="store.drawer.mode === 'kanagata'">
            {{ store.kanagata.length }} Kanagata
          </span>
          <span v-if="store.drawer.mode === 'machine'">
            {{ store.machine.length }} Machine
          </span>
          <span v-if="store.drawer.mode === 'renewal'">
            {{ store.renewalReminder.length }} Kanagata
          </span>
        </a-flex>
      </template>
    </BaseDrawer>
  </Teleport>
</template>

<script setup>
import { useMaintenanceNotifyStore } from '@/stores/maintenanceNotify'
import MaintenanceKanagata from './MaintenanceKanagata.vue'
import MaintenanceMachine from './MaintenanceMachine.vue'
import BaseDrawer from './base/BaseDrawer.vue'
import RenewalList from './RenewalList.vue'
import { computed } from 'vue'

const title = computed(() => {
  return store.drawer.mode !== 'renewal' ? 'Maintenance List' : 'Renewal List'
})

const store = useMaintenanceNotifyStore()
</script>
