<template>
  <a-flex
    v-if="!store.kanagata.length"
    justify="center"
    align="center"
    style="height: 85vh"
  >
    <a-empty description="All kanagata ready for production" />
  </a-flex>
  <template v-else>
    <a-card
      v-for="kanagata in store.kanagata"
      :key="kanagata.id"
      :bordered="true"
      hoverable
      size="small"
    >
      <a-flex vertical :gap="0">
        <span class="medium bold">{{ kanagata.name }}</span>
        <a-flex justify="space-between" align="center">
          <a-tag>{{ kanagata.id }}</a-tag>
          <a-space :size="0">
            <a-tag class="stop" v-if="kanagata.ultrasonic">Ultrasonic</a-tag>
            <a-tag class="stop" v-if="kanagata.kanagata">Kanagata</a-tag>
          </a-space>
        </a-flex>
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
