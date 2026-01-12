<template>
  <a-row :gutter="[24, 24]" :wrap="true">
    <BaseWidget
      title="Total Users"
      :value="userStore.totalUsers"
      :icon="TeamOutlined"
      suffix="Users"
      description="Counted user registered for this system"
    />
    <BaseWidget
      title="Admin Role"
      :value="userStore.userStat?.admin"
      :icon="CrownOutlined"
      suffix="Users"
      description="Granted all access to content and page"
    />
    <BaseWidget
      title="Staff Role"
      :value="userStore.userStat?.staff"
      :icon="UserSwitchOutlined"
      suffix="Users"
      description="Granted access for read, update, add content"
    />
    <BaseWidget
      title="User Role"
      :value="userStore.userStat?.user"
      :icon="UserOutlined"
      suffix="Users"
      description="Read only permission & limited page access"
    />
  </a-row>
</template>

<script setup>
import { useUserStore } from '@/stores/user'
import BaseWidget from '@/components/base/BaseWidget.vue'
import {
  TeamOutlined,
  UserOutlined,
  CrownOutlined,
  UserSwitchOutlined,
} from '@ant-design/icons-vue'

const userStore = useUserStore()
</script>
