<template>
  <a-flex justify="flex-start" wrap="wrap" gap="small" class="mb-large">
    <a-space direction="vertical" :size="1">
      <span class="small">Search</span>
      <a-input
        v-model:value="dashboardStore.filter.search"
        placeholder="Type machine number or tonnage"
        allowClear
        style="max-width: 350px"
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
        <a-select-option value="id">Machine Number</a-select-option>
        <a-select-option value="tonnage">Tonnage</a-select-option>
        <a-select-option value="zcleanShot">Zclean Shot</a-select-option>
        <a-select-option value="injectionShot">Injection Shot</a-select-option>
        <a-select-option value="targetInjection"
          >Target Injection</a-select-option
        >
        <a-select-option value="targetZclean">Target Zclean</a-select-option>
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
import { useMachineDashboardStore } from '@/stores/machineDashboard'
import { debounce } from 'lodash-es'
import { watch } from 'vue'
import {
  SortAscendingOutlined,
  SortDescendingOutlined,
} from '@ant-design/icons-vue'

const dashboardStore = useMachineDashboardStore()

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
