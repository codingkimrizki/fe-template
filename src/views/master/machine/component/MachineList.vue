<template>
  <BaseTable
    :add-action="true"
    :bordered="true"
    v-model:search="machineStore.filter.search"
    size="small"
    :columns="columns"
    :data="machineStore.machineList"
    :pagination="pagination"
    :loading="loading"
    :scroll="{ y: 'calc(100vh - 450px)', x: 'max-content' }"
    @change="onTableChange"
    @add="handleAction('add')"
  >
    <template #additional>
      <a-checkbox v-model:checked="machineStore.filter.showDeleted"
        >Show Deleted</a-checkbox
      >
    </template>
    <template #brand="{ text }">
      <span class="bold">{{ text }}</span>
    </template>
    <template #action="{ record }">
      <a-space size="small">
        <a-popconfirm
          @confirm="handleRestore(record.id)"
          title="Are you sure restore this machine ?"
        >
          <a-button size="small" v-show="record.deletedAt">Restore</a-button>
        </a-popconfirm>
        <a-button
          size="small"
          v-show="!record.deletedAt"
          type="primary"
          @click="handleAction('update', record)"
        >
          Update
        </a-button>
        <a-button
          v-show="!record.deletedAt"
          type="primary"
          danger
          size="small"
          @click="handleAction('delete', record)"
        >
          Delete
        </a-button>
      </a-space>
    </template>
  </BaseTable>
  <Teleport to="body">
    <BaseModal
      :visible="modal.visible"
      @close="handleClose"
      :modalTitle="modal.title"
    >
      <template #body>
        <MachineForm
          :data="modal.data"
          :mode="modal.mode"
          @close="handleClose"
        />
      </template>
    </BaseModal>
  </Teleport>
</template>

<script setup>
import BaseModal from '@/components/base/BaseModal.vue'
import BaseTable from '@/components/base/BaseTable.vue'
import { computed, onMounted, ref, watch } from 'vue'
import { debounce } from 'lodash-es'
import MachineForm from './MachineForm.vue'
import { useMachineStore } from '@/stores/machine'
import { capitalizeEachWord } from '@/utils/capitalizeEachWord'

const machineStore = useMachineStore()
const loading = ref(false)
const pagination = computed(() => ({
  current: machineStore.pagination.page,
  pageSize: machineStore.pagination.pageSize,
  total: machineStore.pagination.total,
  showSizeChanger: true,
  pageSizeOptions: ['10', '20', '50'],
}))

const modal = ref({
  visible: false,
  title: '',
  data: null,
  mode: '',
})

const baseColumns = [
  {
    title: 'No',
    dataIndex: 'id',
    key: 'id',
    ellipsis: true,
    width: 100,
    sorter: true,
  },
  {
    title: 'Brand',
    dataIndex: 'brand',
    key: 'brand',
    ellipsis: true,
    sorter: true,
  },
  {
    title: 'Tonnage',
    dataIndex: 'tonnage',
    key: 'tonnage',
    sorter: true,
    width: 100,
  },
  {
    title: 'Machine Stats',
    children: [
      {
        title: 'Injection',
        children: [
          {
            title: 'Shot',
            dataIndex: 'injectionShot',
            key: 'injectionShot',
            ellipsis: true,
            sorter: true,
            width: 120,
          },
          {
            title: 'Target',
            dataIndex: 'targetInjection',
            key: 'targetInjection',
            ellipsis: true,
            sorter: true,
            width: 120,
          },
          {
            title: 'Tolerance',
            dataIndex: 'toleranceInjection',
            key: 'toleranceInjection',
            ellipsis: true,
            sorter: true,
            width: 120,
          },
        ],
      },
      {
        title: 'Zclean',
        children: [
          {
            title: 'Shot',
            dataIndex: 'zcleanShot',
            key: 'zcleanShot',
            ellipsis: true,
            sorter: true,
            width: 120,
          },
          {
            title: 'Target',
            dataIndex: 'targetZclean',
            key: 'targetZclean',
            ellipsis: true,
            sorter: true,
            width: 120,
          },
          {
            title: 'Tolerance',
            dataIndex: 'toleranceZclean',
            key: 'toleranceZclean',
            ellipsis: true,
            sorter: true,
            width: 120,
          },
        ],
      },
    ],
  },
  {
    title: 'Last Updated',
    dataIndex: 'updatedAt',
    key: 'updatedAt',
    ellipsis: true,
    sorter: true,
    width: 150,
  },
  {
    title: 'Action',
    dataIndex: 'action',
    width: 100,
  },
]

const deletedColumn = {
  title: 'Deleted At',
  dataIndex: 'deletedAt',
  key: 'deletedAt',
  ellipsis: true,
  width: '5%',
}

const columns = computed(() => {
  const cols = [...baseColumns]
  if (machineStore.filter.showDeleted) {
    const actionIndex = cols.findIndex(col => col.key === 'action')
    cols.splice(actionIndex, 0, deletedColumn)
  }
  return cols
})

const handleAction = (mode, data = {}) => {
  modal.value.visible = !modal.value.visible
  modal.value.title = `${capitalizeEachWord(mode)} Data`
  modal.value.data = data
  modal.value.mode = mode
}

const handleClose = () => {
  modal.value.visible = false
  modal.value.mode = null
}

const handleRestore = async id => {
  await machineStore.restore(id)
}

const onTableChange = async ({ pagination: pag, sorter }) => {
  machineStore.filter.sortBy = sorter.field
  machineStore.filter.order = sorter.order === 'ascend' ? 'asc' : 'desc'
  machineStore.pagination.page = pag.current
  machineStore.pagination.pageSize = pag.pageSize
  await machineStore.get() // fetch ulang data
}

const debounceFetch = debounce(async () => {
  machineStore.pagination.page = 1
  loading.value = true
  await machineStore.get() // fetch ulang data
  loading.value = false
}, 500)

watch(
  [() => machineStore.filter.search, () => machineStore.filter.showDeleted],
  () => {
    debounceFetch()
  },
  { deep: true },
)

onMounted(async () => {
  loading.value = true
  await machineStore.get()
  loading.value = false
})
</script>

<style scoped></style>
