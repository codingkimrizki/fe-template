<template>
  <div>
    <a-flex justify="space-between" align="center" wrap="wrap">
      <h1 class="bold">Kanagata Shot Control</h1>
      <FilterDashboard />
    </a-flex>
    <a-spin
      :spinning="kanagataDashboardStore.loading"
      v-if="kanagataDashboardStore.kanagataList.length"
      size="large"
    >
      <a-row :gutter="[24, 24]" align="top" class="mb-large">
        <a-col
          :xs="24"
          :sm="24"
          :md="24"
          :lg="12"
          :xl="8"
          v-for="kanagata in kanagataDashboardStore.kanagataList"
          :key="kanagata.id"
        >
          <KanagataCard :kanagata-data="kanagata" />
        </a-col>
      </a-row>
      <a-flex
        justify="space-between"
        align="center"
        wrap="wrap"
        gap="large"
        class="mb-large"
        v-show="
          kanagataDashboardStore.pagination.total >
          kanagataDashboardStore.pagination.pageSize
        "
      >
        <span class="italic medium"
          >This page is realtime update from RDZ device</span
        >
        <BasePagination
          v-model:page="kanagataDashboardStore.pagination.page"
          :simple="true"
          v-model:pageSize="kanagataDashboardStore.pagination.pageSize"
          v-model:total="kanagataDashboardStore.pagination.total"
          @pageChange="updateDashboard"
          :show-size-changer="false"
        />
      </a-flex>
    </a-spin>
    <a-flex justify="center" align="center" class="wrapper-empty" v-else>
      <BaseEmpty />
    </a-flex>
    <ModalAction />
    <DrawerKanagata />
  </div>
</template>

<script setup>
import BaseEmpty from '@/components/base/BaseEmpty.vue'
import KanagataCard from './components/KanagataCard.vue'
import FilterDashboard from './components/FilterDashboard.vue'
import BasePagination from '@/components/base/BasePagination.vue'
import ModalAction from './components/ModalAction.vue'
import { useKanagataDashboardStore } from '@/stores/kanagataDashboard'
import { onMounted, onUnmounted } from 'vue'
import { useMqttStore } from '@/stores/mqttWebsocket'
import DrawerKanagata from './components/DrawerKanagata.vue'

const mqttStore = useMqttStore()
const kanagataDashboardStore = useKanagataDashboardStore()

const updateDashboard = async () => {
  await kanagataDashboardStore.get()
}

onMounted(async () => {
  await mqttStore.connect()
  await updateDashboard()
})

onUnmounted(() => {
  mqttStore.disconnect()
  mqttStore.$reset()
  kanagataDashboardStore.$reset()
})
</script>

<style scoped>
.wrapper-empty {
  min-height: calc(75vh - 32px);
}
</style>
