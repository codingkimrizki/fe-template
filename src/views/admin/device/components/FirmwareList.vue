<template>
  <div>
    <BaseTable
      :add-action="true"
      :bordered="true"
      v-model:search="firmwareStore.filter.search"
      size="small"
      :columns="columns"
      @add="handleAction('add')"
      @change="onTableChange"
      :data="firmwareStore.firmwareList"
      :pagination="pagination"
      :loading="loading"
      :scroll="{ y: 'calc(100vh-450px)', x: 'max-content' }"
    >
      <template #status="{ text }">
        <a-tag class="bold" :color="statusColor(text)">{{ text }}</a-tag>
      </template>
      <template #fileSize="{ text }">
        {{ (Number(text) / 1024 / 1024).toFixed(2) }} MB
      </template>
      <template #action="{ record }">
        <a-space size="small">
          <a-popconfirm
            title="Are you sure to download this firmware?"
            @confirm="firmwareStore.download(record.id)"
          >
            <a-button
              size="small"
              type="primary"
              style="background-color: #687fe5"
              :icon="h(CloudDownloadOutlined)"
              >Download</a-button
            >
          </a-popconfirm>
          <a-button
            size="small"
            type="primary"
            @click="handleAction('update', record)"
            >Update</a-button
          >
          <a-button
            size="small"
            type="primary"
            danger
            @click="handleAction('delete', record)"
            >Delete</a-button
          >
        </a-space>
      </template>
    </BaseTable>
    <Teleport to="body">
      <BaseModal
        :visible="modal.visible"
        @close="handleClose"
        :modal-title="modal.title"
      >
        <template #body>
          <FirmwareForm
            @close="handleClose"
            :mode="modal.mode"
            :data="modal.data"
          />
        </template>
      </BaseModal>
    </Teleport>
  </div>
</template>

<script setup>
import BaseTable from '@/components/base/BaseTable.vue'
import { useFirmwareManagerStore } from '@/stores/firmwareManager'
import { computed, h, onMounted, ref, watch } from 'vue'
import { debounce } from 'lodash-es'
import BaseModal from '@/components/base/BaseModal.vue'
import FirmwareForm from './FirmwareForm.vue'
import { capitalizeEachWord } from '@/utils/capitalizeEachWord'
import { CloudDownloadOutlined } from '@ant-design/icons-vue'

const firmwareStore = useFirmwareManagerStore()
const loading = ref(false)

const modal = ref({
  visible: false,
  title: '',
  data: null,
  mode: '',
})

const pagination = computed(() => ({
  current: firmwareStore.pagination.page,
  pageSize: firmwareStore.pagination.pageSize,
  total: firmwareStore.pagination.total,
  showSizeChanger: true,
  pageSizeOptions: ['10', '20', '50'],
}))

const debounceFetch = debounce(async () => {
  firmwareStore.pagination.page = 1
  loading.value = true
  await firmwareStore.get() // fetch ulang data
  loading.value = false
}, 500)

const columns = [
  {
    title: 'Version',
    key: 'version',
    dataIndex: 'version',
    width: 150,
    sorter: true,
  },
  {
    title: 'Status',
    key: 'status',
    dataIndex: 'status',
    width: 120,
    sorter: true,
  },
  {
    title: 'Note',
    dataIndex: 'note',
    key: 'note',
    width: 400,
  },
  {
    title: 'Size (MB)',
    dataIndex: 'fileSize',
    key: 'fileSize',
    width: 100,
    sorter: true,
  },
  {
    title: 'Last Updated',
    dataIndex: 'updatedAt',
    key: 'updatedAt',
    width: 150,
    sorter: true,
  },
  {
    title: 'Action',
    dataIndex: 'action',
    key: 'action',
    width: 120,
  },
]

const handleAction = (mode, data = {}) => {
  modal.value.visible = !modal.value.visible
  modal.value.title = `${capitalizeEachWord(mode)} Firmware`
  modal.value.data = data
  modal.value.mode = mode
}

const handleClose = () => {
  modal.value.visible = false
  modal.value.mode = null
}

const statusColor = status => {
  if (status === 'BETA') return '#FA6868'
  if (status === 'STABLE') return '#55AD9B'
  if (status === 'LATEST') return '#295F98'
  if (status === 'DEPRECATED') return 'grey'
}

const onTableChange = async ({ pagination: pag, sorter }) => {
  firmwareStore.filter.sortBy = sorter.field
  firmwareStore.filter.order = sorter.order === 'ascend' ? 'asc' : 'desc'
  firmwareStore.pagination.page = pag.current
  firmwareStore.pagination.pageSize = pag.pageSize
  await firmwareStore.get()
}

watch(
  [() => firmwareStore.filter.search],
  () => {
    debounceFetch()
  },
  { deep: true },
)

onMounted(async () => {
  loading.value = true
  await firmwareStore.get()
  loading.value = false
})
</script>
