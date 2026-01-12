<template>
  <div>
    <a-divider orientation="left">
      <span class="large">Progress Order</span>
    </a-divider>
    <a-flex align="center" justify="space-between" class="mb-small">
      <a-tag color="grey" class="small">Total : {{ list.length }}</a-tag>
      <a-button size="small" type="primary" @click="handleAction('add', {})">
        <span class="small"> <FileAddOutlined /> Add </span>
      </a-button>
    </a-flex>
    <div class="wrapper-progress-order">
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
                <span class="small secondary">PO Date</span>
                <span class="small">{{
                  formatDateTime(item.po, 'YYYY-MM-DD')
                }}</span>
              </a-space>
              <a-space direction="vertical" :size="0">
                <span class="small secondary">Supplier</span>
                <span class="small">{{
                  item.supplier.name.toUpperCase()
                }}</span>
              </a-space>
              <a-space direction="vertical" :size="0">
                <span class="small secondary">Status</span>
                <a-tag class="small" :color="statusPart(item).color">{{
                  statusPart(item).name
                }}</a-tag>
              </a-space>
            </a-space>
            <a-space-compact size="small">
              <a-tooltip
                title="Delete"
                v-if="authStore.isAdmin || authStore.isStaff"
              >
                <a-button @click="handleAction('delete', item)">
                  <DeleteOutlined />
                </a-button>
              </a-tooltip>
              <a-tooltip title="NCC" v-if="statusPart(item).name !== 'NCC'">
                <a-button @click="handleAction('ncc', item)">
                  <CloseCircleOutlined />
                </a-button>
              </a-tooltip>
              <a-tooltip title="Update">
                <a-button @click="handleAction('update', item)">
                  <EditOutlined />
                </a-button>
              </a-tooltip>
            </a-space-compact>
          </a-flex>
        </a-card>
      </a-flex>
      <BaseEmpty
        class="empty"
        v-else
        description="No sparepart progress order"
      />
    </div>
    <Teleport to="body">
      <BaseModal
        :width="650"
        :visible="modal.visible"
        @close="handleClose"
        :modal-title="modal.title"
      >
        <template #body>
          <StockSparepartForm
            @close="handleClose"
            :data="modal.data"
            :mode="modal.mode"
          />
        </template>
      </BaseModal>
    </Teleport>
  </div>
</template>

<script setup>
import {
  CloseCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  FileAddOutlined,
} from '@ant-design/icons-vue'
import BaseModal from '@/components/base/BaseModal.vue'
import BaseEmpty from '@/components/base/BaseEmpty.vue'
import { ref } from 'vue'
import { capitalizeEachWord } from '@/utils/capitalizeEachWord'
import StockSparepartForm from './StockSparepartForm.vue'
import { formatDateTime } from '@/utils/formatDateTime'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

defineProps({
  list: {
    type: Array,
    default: () => [],
  },
})

const modal = ref({
  visible: false,
  title: '',
  data: null,
  mode: '',
})

const statusPart = part => {
  if (part.po && !part.arrival && !part.sparepartNcc) {
    return { name: 'Waiting Shipment', color: 'blue' }
  }
  if (part.po && part.arrival && !part.qc && !part.sparepartNcc) {
    return { name: 'Waiting QC', color: 'orange' }
  }
  if (part.sparepartNcc) {
    return { name: 'NCC', color: 'red' }
  }
}

const handleClose = () => {
  modal.value.visible = false
  modal.value.mode = null
  modal.value.data = null // Reset data to ensure form resets on next open
}

const handleAction = (mode, data = {}) => {
  modal.value.visible = !modal.value.visible
  modal.value.title = `${capitalizeEachWord(mode)} Progress Order`
  modal.value.data =
    Object.keys(data).length > 0
      ? { ...data, status: statusPart(data)?.name }
      : {}
  modal.value.mode = mode
}
</script>

<style scoped>
.wrapper-progress-order {
  height: 255px;
  overflow-y: auto;
  padding: 5px 8px;
}

.wrapper-progress-order:has(.empty) {
  display: flex;
  justify-content: center;
  align-items: center;
}

.wrapper-progress-order::-webkit-scrollbar {
  width: 5px;
}

.wrapper-progress-order::-webkit-scrollbar-track {
  background: transparent;
  border-radius: 10px;
}

.wrapper-progress-order::-webkit-scrollbar-thumb {
  background-color: #888;
  border-radius: 10px;
}

.wrapper-progress-order::-webkit-scrollbar-thumb:hover {
  background-color: #555;
}

.secondary {
  color: grey;
}
</style>
