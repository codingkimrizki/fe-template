<template>
  <a-flex
    v-if="!store.machine.length"
    justify="center"
    align="center"
    style="height: 85vh"
  >
    <a-empty description="All machine ready for production" />
  </a-flex>
  <template v-else>
    <a-card
      v-for="machine in store.machine"
      :key="machine.id"
      :bordered="true"
      hoverable
      size="small"
    >
      <a-flex justify="space-between">
        <a-space direction="vertical" :size="0">
          <span class="medium bold">MACHINE {{ machine.id }}</span>
          <a-tag>{{ machine.brand }}</a-tag>
        </a-space>

        <a-space :size="2">
          <a-tag class="stop" v-if="machine.injection">Injection</a-tag>
          <a-tag class="stop" v-if="machine.zclean">Zclean</a-tag>
        </a-space>
      </a-flex>
    </a-card>
  </template>
</template>

<script setup>
import { useMaintenanceNotifyStore } from '@/stores/maintenanceNotify'
const store = useMaintenanceNotifyStore()
</script>

<style scoped>
.empty-list {
  margin-top: 60%;
}
</style>
