<template>
  <div>
    <a-divider orientation="left">
      <span class="large">Stock</span>
    </a-divider>
    <a-space :size="0" class="mb-small">
      <a-tag color="grey">Stock : {{ list.length }} {{ unit }}</a-tag>
      <a-tag color="#E67E22">Safety : {{ safety }} {{ unit }}</a-tag>
      <a-tag color="red" v-if="list.length < safety" class="blink"
        >Low Stock</a-tag
      >
    </a-space>
    <div class="wrapper-stock-list">
      <a-flex vertical gap="small" v-if="list.length">
        <a-card
          size="small"
          hoverable
          :bordered="false"
          v-for="item in list"
          :key="item.id"
        >
          <a-flex justify="space-between" align="start" class="mb-small">
            <a-space :size="15">
              <a-space direction="vertical" :size="0">
                <span class="small secondary">Stock ID</span>
                <span class="small ellipsis-text" style="max-width: 100px">{{
                  item.id
                }}</span>
              </a-space>
              <a-space direction="vertical" :size="0">
                <span class="small secondary">Entry Date</span>
                <span class="small">
                  <CalendarOutlined />
                  {{ formatDateTime(item.arrival, 'YYYY-MM-DD') }}
                </span>
              </a-space>
              <a-space direction="vertical" :size="0">
                <span class="small secondary">QC PIC</span>
                <span class="small">
                  <UserOutlined /> {{ capitalizeEachWord(item.picQc.name) }}
                </span>
              </a-space>
            </a-space>
            <a-space-compact size="small">
              <a-tooltip
                title="Delete"
                v-if="authStore.isAdmin"
                placement="bottom"
              >
                <a-popconfirm
                  title="Are you sure?"
                  @confirm="handleDelete(item.id)"
                >
                  <a-button>
                    <DeleteOutlined />
                  </a-button>
                </a-popconfirm>
              </a-tooltip>
              <a-tooltip title="Detail" placement="bottom">
                <a-button @click="openDetail(item)">
                  <ExclamationCircleOutlined />
                </a-button>
              </a-tooltip>
              <a-tooltip title="Use" placement="bottom">
                <a-button @click="openUseStock(item.id)">
                  <CheckCircleOutlined />
                </a-button>
              </a-tooltip>
            </a-space-compact>
          </a-flex>
        </a-card>
      </a-flex>
      <BaseEmpty class="empty" v-else description="Stock is empty" />
    </div>
    <Teleport to="body">
      <BaseModal
        :width="800"
        :visible="modal.visible"
        @close="handleClose"
        :modal-title="modal.title"
      >
        <template #body>
          <DetailStockInfo :stockData="modal.data" />
        </template>
      </BaseModal>
    </Teleport>
  </div>
</template>

<script setup>
import {
  CalendarOutlined,
  UserOutlined,
  CheckCircleOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons-vue'
import { formatDateTime } from '@/utils/formatDateTime'
import { capitalizeEachWord } from '@/utils/capitalizeEachWord'
import { useAuthStore } from '@/stores/auth'
import { useSparepartStockStore } from '@/stores/sparepartStock'
import BaseEmpty from '@/components/base/BaseEmpty.vue'
import BaseModal from '@/components/base/BaseModal.vue'
import DetailStockInfo from './DetailStockInfo.vue'
import { ref } from 'vue'

const stockStore = useSparepartStockStore()
const authStore = useAuthStore()
defineProps({
  list: {
    type: Array,
    default: () => [],
  },
  safety: {
    type: Number,
    default: 0,
  },
  unit: {
    type: String,
    default: 'pcs',
  },
})

const openUseStock = id => {
  stockStore.modal.visible = true
  stockStore.modal.stockId = id
}

const handleDelete = async id => {
  await stockStore.delete(id)
}

const modal = ref({
  visible: false,
  title: 'Detail Stock Information',
  data: null,
})

const openDetail = data => {
  modal.value.visible = true
  modal.value.data = data
}

const handleClose = () => {
  modal.value.visible = false
}
</script>

<style scoped>
.wrapper-stock-list {
  height: 255px;
  overflow-y: auto;
  padding: 5px 8px;
}

.wrapper-stock-list:has(.empty) {
  display: flex;
  justify-content: center;
  align-items: center;
}

.wrapper-stock-list::-webkit-scrollbar {
  width: 5px;
}

.wrapper-stock-list::-webkit-scrollbar-track {
  background: transparent;
  border-radius: 10px;
}

.wrapper-stock-list::-webkit-scrollbar-thumb {
  background-color: #888;
  border-radius: 10px;
}

.wrapper-stock-list::-webkit-scrollbar-thumb:hover {
  background-color: #555;
}
</style>
