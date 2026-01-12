<template>
  <div>
    <a-divider orientation="left">
      <span class="large">Used History</span>
    </a-divider>
    <a-flex justify="space-between" class="mb-small" align="center">
      <a-tag color="grey" class="small">Total : {{ historyUsed.length }}</a-tag>
      <a-date-picker
        size="small"
        class="yearmonth-picker"
        picker="month"
        v-model:value="yearmonth"
        :allowClear="false"
      />
    </a-flex>
    <div class="wrapper-history-used">
      <a-flex vertical gap="small" v-if="historyUsed.length">
        <a-card
          size="small"
          hoverable
          :bordered="false"
          v-for="item in historyUsed"
          :key="item.id"
        >
          <a-flex justify="space-between" align="start" class="mb-small">
            <a-space :size="15">
              <a-space direction="vertical" :size="0">
                <span class="small secondary">Stock ID</span>
                <span class="small ellipsis-text" style="max-width: 100px">{{
                  item.stockId
                }}</span>
              </a-space>
              <a-space direction="vertical" :size="0">
                <span class="small secondary">Used Date</span>
                <span class="small">
                  <CalendarOutlined />
                  {{ formatDateTime(item.usedDate, 'YYYY-MM-DD') }}
                </span>
              </a-space>
              <a-space direction="vertical" :size="0">
                <span class="small secondary">Pic Used</span>
                <span class="small">
                  <UserOutlined />
                  {{ capitalizeEachWord(item.picUsed ?? 'Unknown') }}
                </span>
              </a-space>
              <a-space direction="vertical" :size="0" v-if="!isGeneralPart">
                <span class="small secondary">{{
                  isControlled(item).label
                }}</span>
                <a-tag :color="themeStore.colorPrimary">
                  {{ isControlled(item).value }}
                </a-tag>
              </a-space>
            </a-space>
            <a-space-compact size="small">
              <a-tooltip
                title="Revert"
                v-if="
                  (authStore.isAdmin && isGeneralPart) ||
                  isControlled(item).value === 'No'
                "
                placement="bottom"
              >
                <a-popconfirm
                  title="Are you sure?"
                  placement="leftTop"
                  @confirm="handleRevert(item.stockId)"
                >
                  <a-button>
                    <UndoOutlined />
                  </a-button>
                </a-popconfirm>
              </a-tooltip>
            </a-space-compact>
          </a-flex>
        </a-card>
      </a-flex>
      <BaseEmpty class="empty" v-else description="No history used" />
    </div>
  </div>
</template>

<script setup>
import {
  UndoOutlined,
  UserOutlined,
  CalendarOutlined,
} from '@ant-design/icons-vue'
import dayjs from 'dayjs'
import { formatDateTime } from '@/utils/formatDateTime'
import { useAuthStore } from '@/stores/auth'
import BaseEmpty from '@/components/base/BaseEmpty.vue'
import { useSparepartStore } from '@/stores/sparepart'
import { computed, ref, watch } from 'vue'
import { capitalizeEachWord } from '@/utils/capitalizeEachWord'
import { useSparepartStockStore } from '@/stores/sparepartStock'
import { message } from 'ant-design-vue'
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()
const stockStore = useSparepartStockStore()
const sparepartStore = useSparepartStore()
const authStore = useAuthStore()

const isGeneralPart = computed(
  () => sparepartStore.drawer.data?.category?.name === 'general',
)
const isMachinePart = computed(
  () => sparepartStore.drawer.data?.category?.name === 'machine',
)
const sparepartId = computed(() => sparepartStore.drawer.data?.id)

const yearmonth = ref(dayjs())
const historyUsed = ref([])

const isControlled = data => {
  if (isGeneralPart.value) return false
  if (isMachinePart.value && data.machineId)
    return { label: 'Controlled', value: `Machine ${data.machineId}` }
  if (data.kanagataId)
    return { label: 'Controlled', value: `${data.kanagataId}` }
  return { label: 'Controlled', value: 'No' }
}

const handleRevert = async stockId => {
  if (!isGeneralPart.value && !isControlled(stockId).value === 'No')
    return message.error('Only general sparepart can be reverted')
  try {
    await stockStore.update(stockId, {
      isUsed: false,
      usedDate: null,
      picUsedId: null,
    })
    fetchHistory()
    message.success('Revert used sparepart success')
  } catch (error) {
    message.error(error.response?.data?.message || 'An error occurred')
    console.error(error)
  }
}

const fetchHistory = async () => {
  const v = yearmonth.value
  historyUsed.value = await sparepartStore.getHistoryUsed(sparepartId.value, {
    year: v.year(),
    month: v.month() + 1,
  })
}

watch([yearmonth, sparepartId], fetchHistory, { immediate: true })
watch(
  () => sparepartStore.updateHistoryUsed,
  () => {
    if (sparepartStore.updateHistoryUsed) fetchHistory()
    sparepartStore.updateHistoryUsed = false
  },
)
</script>

<style scoped>
.wrapper-history-used {
  height: 255px;
  overflow-y: auto;
  padding: 5px 8px;
}

.yearmonth-picker {
  max-width: 100px;
}

.wrapper-history-used:has(.empty) {
  display: flex;
  justify-content: center;
  align-items: center;
}

.wrapper-history-used::-webkit-scrollbar {
  width: 5px;
}

.wrapper-history-used::-webkit-scrollbar-track {
  background: transparent;
  border-radius: 10px;
}

.wrapper-history-used::-webkit-scrollbar-thumb {
  background-color: #888;
  border-radius: 10px;
}

.wrapper-history-used::-webkit-scrollbar-thumb:hover {
  background-color: #555;
}
</style>
