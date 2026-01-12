<template>
  <a-flex
    justify="flex-start"
    wrap="wrap"
    gap="small"
    align="center"
    class="mb-large"
  >
    <a-space direction="vertical" :size="1">
      <span class="small">Search</span>
      <a-input
        v-model:value="dashboardStore.filter.search"
        placeholder="Type name or ID"
        allowClear
        style="max-width: 300px"
      >
        <template #prefix>
          <SearchOutlined />
        </template>
      </a-input>
    </a-space>
    <a-space direction="vertical" :size="1">
      <span class="small">Sort By</span>
      <a-select
        class="select-filter"
        v-model:value="dashboardStore.filter.sortBy"
      >
        <a-select-option value="name">Name</a-select-option>
        <a-select-option value="kanagataShot">Kanagata Shot</a-select-option>
        <a-select-option value="targetKanagata">Target Shot</a-select-option>
        <a-select-option value="totalKanagataShot">Total Shot</a-select-option>
      </a-select>
    </a-space>
    <a-space direction="vertical" :size="1">
      <span class="small">Order</span>
      <a-button @click="dashboardStore.toggleFilterOrder">
        {{ dashboardStore.filter.order.toUpperCase() }}
        <SortAscendingOutlined v-if="dashboardStore.filter.order === 'asc'" />
        <SortDescendingOutlined v-else />
      </a-button>
    </a-space>
  </a-flex>
</template>

<script setup>
import { SearchOutlined } from '@ant-design/icons-vue'
import { useKanagataDashboardStore } from '@/stores/kanagataDashboard'
import { debounce } from 'lodash-es'
import { watch } from 'vue'
import {
  SortAscendingOutlined,
  SortDescendingOutlined,
} from '@ant-design/icons-vue'
const dashboardStore = useKanagataDashboardStore()

const debounceFetch = debounce(async () => {
  dashboardStore.pagination.page = 1
  dashboardStore.loading = true
  await dashboardStore.get() // fetch ulang data
  dashboardStore.loading = false
}, 500)

watch(
  [
    () => dashboardStore.filter.search,
    () => dashboardStore.filter.sortBy,
    () => dashboardStore.filter.order,
  ],
  () => {
    debounceFetch()
  },
)
</script>

<style scoped>
.select-filter {
  min-width: 200px;
}
</style>
