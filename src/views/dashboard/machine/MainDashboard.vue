<template>
  <div>
    <a-flex justify="space-between" align="center" wrap="wrap">
      <h1 class="bold">Machine Shot Control</h1>
      <FilterDashboard />
    </a-flex>
    <a-spin
      :spinning="machineDashboardStore.loading"
      v-if="machineDashboardStore.machineList.length"
      size="large"
      tip="Loading..."
    >
      <a-row :gutter="[24, 24]" align="top">
        <a-col
          :xs="24"
          :sm="24"
          :md="24"
          :lg="12"
          :xl="8"
          v-for="machine in machineDashboardStore.machineList"
          :key="machine.id"
          class="mb-large"
        >
          <MachineCard :machine-data="machine" />
        </a-col>
      </a-row>
      <a-flex
        justify="space-between"
        align="center"
        wrap="wrap"
        gap="large"
        class="mb-large"
        v-show="
          machineDashboardStore.pagination.total >
          machineDashboardStore.pagination.pageSize
        "
      >
        <span class="italic medium"
          >This page is realtime update from RDZ device</span
        >
        <BasePagination
          v-model:page="machineDashboardStore.pagination.page"
          :simple="true"
          v-model:pageSize="machineDashboardStore.pagination.pageSize"
          v-model:total="machineDashboardStore.pagination.total"
          @pageChange="updateDashboard"
          :show-size-changer="false"
        />
      </a-flex>
    </a-spin>
    <a-flex justify="center" align="center" class="wrapper-empty" v-else>
      <BaseEmpty />
    </a-flex>
    <ModalAction />
    <DrawerMachine />
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useMqttStore } from '@/stores/mqttWebsocket'
import { useMachineDashboardStore } from '@/stores/machineDashboard'
import MachineCard from './component/MachineCard.vue'
import FilterDashboard from './component/FilterDashboard.vue'
import BasePagination from '@/components/base/BasePagination.vue'
import BaseEmpty from '@/components/base/BaseEmpty.vue'
import ModalAction from './component/ModalAction.vue'
import DrawerMachine from './component/DrawerMachine.vue'

const machineDashboardStore = useMachineDashboardStore()
const mqttStore = useMqttStore()

const updateDashboard = async () => {
  await machineDashboardStore.get()
}

onMounted(async () => {
  await mqttStore.connect()
  await updateDashboard()
})

onUnmounted(() => {
  mqttStore.disconnect()
  mqttStore.$reset()
})
</script>

<style scoped>
.wrapper-dashboard {
  min-height: calc(75vh - 32px);
}

.wrapper-empty {
  min-height: calc(75vh - 32px);
}
</style>
