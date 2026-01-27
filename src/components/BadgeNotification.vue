<template>
  <!-- BADGE -->
  <a-badge :count="store.countNotification" :show-zero="false" :offset="[0, 6]">
    <a-button type="dashed" shape="circle" @click="store.toggleDrawer('major')">
      <span class="items-center">
        <BellOutlined />
      </span>
    </a-button>
  </a-badge>

  <!-- DRAWER -->
  <a-drawer :open="store.drawer.open" @close="store.toggleDrawer()">
    <template #title>
      <span class="font-bold">Major Notifications</span>
    </template>
    <div class="mb-3" v-if="store.majorNotifications.length">
      <div
        v-for="n in store.majorNotifications"
        :key="n.id"
        class="mb-2 flex items-start gap-3"
      >
        <a-avatar size="small" style="background: #fa541c">
          {{ getInitials(n.userName) }}
        </a-avatar>
        <div class="flex flex-col leading-tight">
          <span class="text-xs text-gray-400">
            {{ formatDateTime(n.createdAt) }}
          </span>
          <span>
            {{ n.message }}
          </span>
        </div>
      </div>
    </div>

    <div v-else>
      <BaseEmpty />
    </div>
  </a-drawer>
</template>

<script setup>
import { onMounted } from 'vue'
import { BellOutlined } from '@ant-design/icons-vue'
import { useAnswersStore } from '@/stores/answers'
import { formatDateTime } from '@/utils/formatDateTime'
import BaseEmpty from '@/components/base/BaseEmpty.vue'

const store = useAnswersStore()
const getInitials = name => {
  if (!name) return '?'
  return name
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
}

onMounted(() => {
  store.fetchAnswers()
})
</script>
