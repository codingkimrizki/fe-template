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
  >
    <template #brand="{ text }">
      <span class="bold">{{ text }}</span>
    </template>
  </BaseTable>
</template>

<script setup>
import BaseTable from '@/components/base/BaseTable.vue'
import { computed, onMounted, ref, watch } from 'vue'
import { debounce } from 'lodash-es'
import { useMachineStore } from '@/stores/machine'

const machineStore = useMachineStore()
const loading = ref(false)
const pagination = computed(() => ({
  current: machineStore.pagination.page,
  pageSize: machineStore.pagination.pageSize,
  total: machineStore.pagination.total,
  showSizeChanger: true,
  pageSizeOptions: ['10', '20', '50'],
}))

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
    title: 'Device IP Address',
    dataIndex: 'brand',
    key: 'brand',
    ellipsis: true,
    sorter: true,
    width: 200,
  },
  {
    title: 'Date',
    dataIndex: 'brand',
    key: 'brand',
    ellipsis: true,
    sorter: true,
    width: 150,
  },
  {
    title: 'Time',
    dataIndex: 'tonnage',
    key: 'tonnage',
    sorter: true,
    width: 150,
  },
  {
    title: 'Status',
    dataIndex: 'updatedAt',
    key: 'updatedAt',
    ellipsis: true,
    sorter: true,
    width: 150,
  },
]

const columns = computed(() => {
  const cols = [...baseColumns]
  if (machineStore.filter.showDeleted) {
    const actionIndex = cols.findIndex(col => col.key === 'action')
    cols.splice(actionIndex, 0)
  }
  return cols
})

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
