<template>
  <BaseTable
    :add-action="true"
    :bordered="true"
    v-model:search="kanagataStore.filter.search"
    size="small"
    :columns="columns"
    :data="kanagataStore.kanagataList"
    :pagination="pagination"
    :loading="loading"
    :scroll="{ y: 'calc(100vh - 450px)', x: 'max-content' }"
    @change="onTableChange"
    @add="handleAction('add')"
  >
    <template #additional>
      <a-checkbox v-model:checked="kanagataStore.filter.showDeleted"
        >Show Deleted</a-checkbox
      >
    </template>
    <template #id="{ text }">
      {{ text }}
    </template>
    <template #drawingNumber="{ record }">
      <a
        v-if="record.drawingPath"
        :href="generatePublicUrl(record.drawingPath)"
        target="_blank"
        >{{ record.drawingNumber }}
      </a>
      <span v-else>
        {{ record.drawingNumber }}
      </span>
    </template>
    <template #ultrasonicStatus="{ text }">
      <a-tag :color="text ? '#41A67E' : '#BF092F'">{{
        text ? 'YES' : 'NO'
      }}</a-tag>
    </template>
    <template #productAction="{ record }">
      <a-button
        :disabled="kanagataStore.filter.showDeleted"
        size="small"
        @click="handleProductRegister(record.id)"
        >Manage</a-button
      >
    </template>
    <template #action="{ record }">
      <a-space size="small">
        <a-popconfirm
          @confirm="handleRestore(record.id)"
          title="Are you sure restore this kanagata ?"
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
        <KanagataForm
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
import { useKanagataStore } from '@/stores/kanagata'
import { debounce } from 'lodash-es'
import { capitalizeEachWord } from '@/utils/capitalizeEachWord'
import BaseTable from '@/components/base/BaseTable.vue'
import BaseModal from '@/components/base/BaseModal.vue'
import KanagataForm from './KanagataForm.vue'
import { useProductRegisterStore } from '@/stores/productRegister'
import { generatePublicUrl } from '@/utils/generatePublicUrl'

const loading = ref(false)
const productRegisterStore = useProductRegisterStore()
const kanagataStore = useKanagataStore()
const pagination = computed(() => ({
  current: kanagataStore.pagination.page,
  pageSize: kanagataStore.pagination.pageSize,
  total: kanagataStore.pagination.total,
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
  kanagataStore.pagination.page = 1
  loading.value = true
  await kanagataStore.get() // fetch ulang data
  loading.value = false
}, 500)

const baseColumns = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    ellipsis: true,
    sorter: true,
    width: 80,
  },
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    ellipsis: true,
    sorter: true,
    width: 150,
  },
  {
    title: 'Specification',
    children: [
      {
        title: 'Drawing Number',
        dataIndex: 'drawingNumber',
        key: 'drawingNumber',
        sorter: true,
        width: 150,
        align: 'center',
      },
      {
        title: 'Cavity',
        dataIndex: 'cavity',
        key: 'cavity',
        ellipsis: true,
        sorter: true,
        width: 80,
        align: 'center',
      },
      {
        title: 'Die',
        dataIndex: 'die',
        key: 'die',
        ellipsis: true,
        sorter: true,
        width: 70,
        align: 'center',
      },
      {
        title: 'Ultrasonic',
        dataIndex: 'ultrasonicStatus',
        key: 'ultrasonicStatus',
        ellipsis: true,
        sorter: true,
        width: 110,
        align: 'center',
      },
    ],
  },
  {
    title: 'Product',
    children: [
      {
        title: 'Registered',
        dataIndex: 'registeredProduct',
        width: 80,
        ellipsis: true,
        align: 'center',
      },
      {
        title: 'Action',
        dataIndex: 'productAction',
        width: 80,
        align: 'center',
      },
    ],
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
  width: '5%',
}

const columns = computed(() => {
  const cols = [...baseColumns]
  if (kanagataStore.filter.showDeleted) {
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

const handleProductRegister = async id => {
  productRegisterStore.modal = {
    visible: true,
    kanagataId: id,
  }
}

const onTableChange = async ({ pagination: pag, sorter }) => {
  kanagataStore.filter.sortBy = sorter.field
  kanagataStore.filter.order = sorter.order === 'ascend' ? 'asc' : 'desc'
  kanagataStore.pagination.page = pag.current
  kanagataStore.pagination.pageSize = pag.pageSize
  await kanagataStore.get()
}

const handleRestore = async id => {
  await kanagataStore.restore(id)
}

watch(
  [() => kanagataStore.filter.search, () => kanagataStore.filter.showDeleted],
  () => {
    debounceFetch()
  },
  { deep: true },
)

onMounted(async () => {
  loading.value = true
  await kanagataStore.get()
  loading.value = false
})
</script>

<style scoped></style>
