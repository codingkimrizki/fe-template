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
  <a-drawer
    title="Major Notifications"
    :open="store.drawer.open"
    @close="store.toggleDrawer()"
  >
    <div v-if="store.majorNotifications.length">
      <div v-for="n in store.majorNotifications" :key="n.id" class="mb-2">
        🚨 {{ n.message }}
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
import { BaseEmpty } from '@/components/base/BaseEmpty.vue'

const store = useAnswersStore()

onMounted(() => {
  store.fetchAnswers()
})
</script>
