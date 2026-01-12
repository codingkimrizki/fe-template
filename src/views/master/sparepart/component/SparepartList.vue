<template>
  <BaseTable
    :add-action="true"
    :bordered="true"
    v-model:search="sparepartStore.filter.search"
    size="small"
    :columns="columns"
    :data="sparepartStore.sparepartList"
    :pagination="pagination"
    :loading="loading"
    :scroll="{ y: 'calc(100vh - 450px)', x: 'max-content' }"
    @change="onTableChange"
    @add="handleAction('add')"
  >
    <template #additional>
      <a-checkbox v-model:checked="sparepartStore.filter.showDeleted"
        >Show Deleted</a-checkbox
      >
    </template>
    <template #action="{ record }">
      <a-space size="small">
        <a-popconfirm
          @confirm="handleRestore(record.id)"
          title="Are you sure restore this sparepart ?"
        >
          <a-button size="small" v-show="record.deletedAt">Restore</a-button>
        </a-popconfirm>
        <a-button
          size="small"
          v-show="!record.deletedAt"
          type="primary"
          @click="handleAction('update', record)"
          >Update</a-button
        >
        <a-button
          v-show="!record.deletedAt"
          type="primary"
          danger
          size="small"
          @click="handleAction('delete', record)"
          >Delete</a-button
        >
      </a-space>
    </template>
    <template #sparepartNumber="{ record }">
      <a
        v-if="record.drawingPath"
        target="_blank"
        :href="generatePublicUrl(record.drawingPath)"
      >
        {{ record.sparepartNumber }}</a
      >
      <span v-else> {{ record.sparepartNumber }}</span>
    </template>
    <template #categoryId="{ record }">
      <a-tag :color="categoryColor(record.categoryName)">{{
        capitalizeEachWord(record.categoryName) || 'Uncategorized'
      }}</a-tag>
    </template>
  </BaseTable>
  <Teleport to="body">
    <BaseModal
      :visible="modal.visible"
      @close="handleClose"
      :modal-title="modal.title"
    >
      <template #body>
        <SparepartForm
          @close="handleClose"
          :data="modal.data"
          :mode="modal.mode"
        />
      </template>
    </BaseModal>
  </Teleport>
</template>

<script setup>
import BaseTable from '@/components/base/BaseTable.vue'
import BaseModal from '@/components/base/BaseModal.vue'
import SparepartForm from './SparepartForm.vue'
import { useSparepartStore } from '@/stores/sparepart'
import { computed, onMounted, ref, watch } from 'vue'
import { debounce } from 'lodash-es'
import { capitalizeEachWord } from '@/utils/capitalizeEachWord'
import { categoryColor } from '@/utils/sparepartCategoryColor'
import { generatePublicUrl } from '@/utils/generatePublicUrl'

const sparepartStore = useSparepartStore()

const loading = ref(false)
const pagination = computed(() => ({
  current: sparepartStore.filter.page,
  pageSize: sparepartStore.filter.limit,
  total: sparepartStore.totalSparepart,
  showSizeChanger: true,
  pageSizeOptions: ['10', '25', '50', '100'],
}))

const modal = ref({
  visible: false,
  title: '',
  data: null,
  mode: '',
})

const handleClose = () => {
  modal.value.visible = false
  modal.value.mode = null
}

const handleAction = (mode, data = {}) => {
  modal.value.visible = !modal.value.visible
  modal.value.title = `${capitalizeEachWord(mode)} Data`
  modal.value.data = data
  modal.value.mode = mode
}

const baseColumns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    ellipsis: true,
    sorter: true,
    width: 200,
  },
  {
    title: 'Sparepart Number',
    dataIndex: 'sparepartNumber',
    key: 'sparepartNumber',
    ellipsis: true,
    sorter: true,
    width: 200,
  },
  {
    title: 'Category',
    dataIndex: 'categoryId',
    key: 'categoryId',
    ellipsis: true,
    sorter: true,
    width: 90,
  },
  {
    title: 'Unit',
    dataIndex: 'unitType',
    key: 'unitType',
    ellipsis: true,
    sorter: true,
    width: 70,
  },
  {
    title: 'Unit Qty',
    dataIndex: 'unitQty',
    key: 'unitQty',
    ellipsis: true,
    sorter: true,
    width: 70,
  },
  {
    title: 'Min Stock',
    dataIndex: 'minStock',
    key: 'minStock',
    ellipsis: true,
    sorter: true,
    width: 70,
  },
  {
    title: 'Update At',
    dataIndex: 'updatedAt',
    key: 'updatedAt',
    ellipsis: true,
    sorter: true,
    width: 100,
  },
  {
    title: 'Action',
    dataIndex: 'action',
    width: 150,
    align: 'center',
  },
]

const deletedColumn = {
  title: 'Deleted At',
  dataIndex: 'deletedAt',
  key: 'deletedAt',
  ellipsis: true,
  width: 150,
}

const columns = computed(() => {
  const cols = [...baseColumns]
  if (sparepartStore.filter.showDeleted) {
    const actionIndex = cols.findIndex(col => col.key === 'action')
    cols.splice(actionIndex, 0, deletedColumn)
  }
  return cols
})

const onTableChange = async ({ pagination: pag, sorter }) => {
  sparepartStore.filter.sortBy = sorter.field
  sparepartStore.filter.order = sorter.order === 'ascend' ? 'asc' : 'desc'
  sparepartStore.pagination.page = pag.current
  sparepartStore.pagination.pageSize = pag.pageSize
  await sparepartStore.get()
}

const handleRestore = async id => {
  await sparepartStore.restore(id)
}

const debounceFetch = debounce(async () => {
  sparepartStore.pagination.page = 1
  loading.value = true
  await sparepartStore.get()
  loading.value = false
}, 500)

watch(
  [() => sparepartStore.filter.search, () => sparepartStore.filter.showDeleted],
  () => {
    debounceFetch()
  },
  { deep: true },
)

onMounted(async () => {
  loading.value = true
  await sparepartStore.get()
  loading.value = false
})
</script>

<style scoped></style>
