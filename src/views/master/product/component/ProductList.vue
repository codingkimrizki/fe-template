<template>
  <BaseTable
    :add-action="true"
    :bordered="true"
    v-model:search="productStore.filter.search"
    size="small"
    :columns="columns"
    :data="productStore.productList"
    :pagination="pagination"
    :loading="loading"
    :scroll="{ y: 'calc(100vh - 450px)', x: 'max-content' }"
    @change="onTableChange"
    @add="handleAction('add')"
  >
    <template #additional>
      <a-checkbox v-model:checked="productStore.filter.showDeleted"
        >Show Deleted</a-checkbox
      >
    </template>
    <template #action="{ record }">
      <a-space size="small">
        <a-popconfirm
          @confirm="handleRestore(record.id)"
          title="Are you sure restore this product ?"
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
      :modal-title="modal.title"
    >
      <template #body>
        <ProductForm
          @close="handleClose"
          :data="modal.data"
          :mode="modal.mode"
        />
      </template>
    </BaseModal>
  </Teleport>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useProductStore } from '@/stores/product'
import { debounce } from 'lodash-es'
import { capitalizeEachWord } from '@/utils/capitalizeEachWord'
import BaseTable from '@/components/base/BaseTable.vue'
import BaseModal from '@/components/base/BaseModal.vue'
import ProductForm from './ProductForm.vue'

const loading = ref(false)
const productStore = useProductStore()
const pagination = computed(() => ({
  current: productStore.pagination.page,
  pageSize: productStore.pagination.pageSize,
  total: productStore.pagination.total,
  showSizeChanger: true,
  pageSizeOptions: ['10', '20', '50'],
}))

const modal = ref({
  visible: false,
  title: '',
  data: null,
  mode: '',
})

const debounceFetch = debounce(async () => {
  productStore.pagination.page = 1
  loading.value = true
  await productStore.get() // fetch ulang data
  loading.value = false
}, 500)

const baseColumns = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    ellipsis: true,
    sorter: true,
    width: 150,
  },
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    ellipsis: true,
    sorter: true,
    width: 200,
  },
  {
    title: 'Created At',
    dataIndex: 'createdAt',
    key: 'createdAt',
    ellipsis: true,
    sorter: true,
    width: 150,
  },
  {
    title: 'Updated At',
    dataIndex: 'updatedAt',
    key: 'updatedAt',
    ellipsis: true,
    sorter: true,
    width: 150,
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
  if (productStore.filter.showDeleted) {
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

const onTableChange = async ({ pagination: pag, sorter }) => {
  productStore.filter.sortBy = sorter.field
  productStore.filter.order = sorter.order === 'ascend' ? 'asc' : 'desc'
  productStore.pagination.page = pag.current
  productStore.pagination.pageSize = pag.pageSize
  await productStore.get()
}

const handleRestore = async id => {
  await productStore.restore(id)
}

watch(
  [() => productStore.filter.search, () => productStore.filter.showDeleted],
  () => {
    debounceFetch()
  },
  { deep: true },
)

onMounted(async () => {
  loading.value = true
  await productStore.get()
  loading.value = false
})
</script>

<style scoped></style>
