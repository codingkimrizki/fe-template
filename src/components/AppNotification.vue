<template>
  <a-dropdown placement="bottomRight" :trigger="['hover']" arrow>
    <a-badge :count="store.countNotification">
      <a-button type="dashed" shape="circle">
        <MailOutlined />
      </a-button>
    </a-badge>
    <template #overlay>
      <a-menu class="notif-menu">
        <span class="medium mb-small bold" style="padding: 8px 10px"
          >Maintenance</span
        >
        <a-menu-item @click="store.toggleDrawer('machine')">
          <a-flex justify="space-between">
            <span>Machine</span>
            <a-badge :count="store.machine.length" />
          </a-flex>
        </a-menu-item>
        <a-menu-item @click="store.toggleDrawer('kanagata')">
          <a-flex justify="space-between">
            <span>Kanagata</span>
            <a-badge :count="store.kanagata.length" />
          </a-flex>
        </a-menu-item>
        <span class="medium mb-small bold" style="padding: 8px 10px"
          >Renewal Reminder</span
        >
        <a-menu-item @click="store.toggleDrawer('renewal')">
          <a-flex justify="space-between">
            <span>Kanagata</span>
            <a-badge :count="store.renewalReminder.length" />
          </a-flex>
        </a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
</template>

<script setup>
import { MailOutlined } from '@ant-design/icons-vue'
import { useMaintenanceNotifyStore } from '@/stores/maintenanceNotify'

const store = useMaintenanceNotifyStore()
</script>

<style scoped>
.notif-menu {
  min-width: 250px;
}
</style>
