<template>
  <BaseTable
    v-model:search="userStore.filter.search"
    size="large"
    :columns="columns"
    :data="userStore.userList"
    :pagination="pagination"
    :loading="loading"
    :scroll="{ y: 'calc(100vh - 450px)', x: 'max-content' }"
    @change="onTableChange"
  >
    <template #name="{ text }">
      <a-space size="small">
        <UserOutlined />
        <span>{{ capitalizeEachWord(text) }}</span>
      </a-space>
    </template>
    <template #roleName="{ text }">
      <a-tag class="bold" :color="getRoleColor(text)">{{
        text.toUpperCase()
      }}</a-tag>
    </template>
    <template #action="{ record }">
      <a-button
        type="primary"
        :disabled="record.roleName == 'admin'"
        size="small"
        @click="handleAction('update', record)"
      >
        Update
      </a-button>
    </template>
  </BaseTable>
  <Teleport to="body">
    <BaseModal
      :visible="modal.visible"
      @close="handleClose"
      :modalTitle="modal.title"
    >
      <template #body>
        <UserForm
          :data="modal.data"
          :mode="modal.mode"
          @close="handleClose"
          @update="userStore.get()"
        />
      </template>
    </BaseModal>
  </Teleport>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { debounce } from 'lodash-es'
import { useUserStore } from '@/stores/user'
import { capitalizeEachWord } from '@/utils/capitalizeEachWord'
import { getRoleColor } from '@/utils/getRoleColor'
import { UserOutlined } from '@ant-design/icons-vue'
import BaseTable from '@/components/base/BaseTable.vue'
import BaseModal from '@/components/base/BaseModal.vue'
import UserForm from './UserForm.vue'

const userStore = useUserStore()
const loading = ref(false)
const pagination = computed(() => ({
  current: userStore.pagination.page,
  pageSize: userStore.pagination.pageSize,
  total: userStore.pagination.total,
  showSizeChanger: true,
  pageSizeOptions: ['10', '20', '50'],
}))
const modal = ref({
  visible: false,
  title: '',
  data: null,
  mode: '',
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

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    sorter: true,
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
    ellipsis: true,
    sorter: true,
  },
  {
    title: 'Role',
    dataIndex: 'roleName',
    key: 'roleName',
    sorter: true,
    width: '10%',
  },
  {
    title: 'Registered Date',
    dataIndex: 'createdAt',
    key: 'createdAt',
    ellipsis: true,
    sorter: true,
  },
  {
    title: 'Last Updated',
    dataIndex: 'updatedAt',
    key: 'updatedAt',
    ellipsis: true,
    sorter: true,
  },
  {
    title: 'Action',
    dataIndex: 'action',
    width: '10%',
  },
]

const onTableChange = ({ pagination: pag, sorter }) => {
  userStore.filter.sortBy = sorter.field
  userStore.filter.order = sorter.order == 'ascend' ? 'asc' : 'desc'
  userStore.pagination.page = pag.current
  userStore.pagination.pageSize = pag.pageSize
  userStore.get() // fetch ulang data
}

const debounceFetch = debounce(async () => {
  userStore.pagination.page = 1
  loading.value = true
  await userStore.get() // fetch ulang data
  loading.value = false
}, 500)

watch(
  () => userStore.filter.search,
  () => {
    debounceFetch()
  },
)

onMounted(async () => {
  loading.value = true
  await userStore.get()
  loading.value = false
})
</script>
