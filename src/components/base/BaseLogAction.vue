<template>
  <a-space direction="vertical" :size="0" class="mb-large">
    <span>Date Range</span>
    <a-range-picker
      :allowClear="false"
      v-model:value="dateRangeModel"
      @change="handleDateRangeChange"
    />
  </a-space>
  <a-timeline class="wrapper" v-if="logs.length">
    <a-timeline-item v-for="(log, index) in logs" :key="index">
      <a-flex vertical :gap="5">
        <a-space :size="2">
          <a-tag color="grey" class="small">
            <UserOutlined /> {{ capitalizeEachWord(log.user?.name) }}
          </a-tag>
          <a-tag class="small">
            <CalendarOutlined /> {{ formatDateTime(log.createdAt) }}
          </a-tag>
        </a-space>
        <span>{{ log.event }}</span>
      </a-flex>
    </a-timeline-item>
  </a-timeline>
  <a-flex justify="center" align="center" class="empty" v-else>
    <BaseEmpty />
  </a-flex>
</template>

<script setup>
import { UserOutlined, CalendarOutlined } from '@ant-design/icons-vue'
import { formatDateTime } from '@/utils/formatDateTime'
import { capitalizeEachWord } from '@/utils/capitalizeEachWord'
import BaseEmpty from './BaseEmpty.vue'
import { notification } from 'ant-design-vue'

// Define model for dateRange with proper type and default
const dateRangeModel = defineModel('dateRange', {
  type: Array,
  required: true,
})

defineProps({
  logs: {
    type: Array,
    default: () => [],
  },
})

// Define emits for the dateRangeChange event only
const emit = defineEmits(['dateRangeChange'])

// Handle date range change
const handleDateRangeChange = value => {
  const [start, end] = value
  if (!end.isAfter(start, 'day')) {
    notification.warning({
      message: 'Warning',
      description: 'End date must be at least 1 day after start date',
    })
    return
  }
  emit('dateRangeChange', value)
}
</script>

<style scoped>
.wrapper {
  height: 400px;
  overflow-y: auto;
  padding: 12px 16px;
}

.empty {
  height: 400px;
  padding: 12px 16px;
}

.wrapper::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.wrapper::-webkit-scrollbar-track {
  background: var(--card-bg-transparent);
  border-radius: 8px;
}

.wrapper::-webkit-scrollbar-thumb {
  background-color: gray;
  border-radius: 8px;
}

.wrapper::-webkit-scrollbar-thumb:hover {
  background-color: gray;
}
</style>
