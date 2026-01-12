<template>
  <a-flex justify="space-between" align="end" wrap="wrap" class="mb-large">
    <span class="x-large bold">Sparepart List</span>
    <a-space size="small" :wrap="true" align="center">
      <a-space direction="vertical" :size="0">
        <span>Search</span>
        <a-input
          :prefix="h(SearchOutlined)"
          v-model:value="sparepartStore.filter.search"
          class="search-bar"
        />
      </a-space>
      <a-space direction="vertical" :size="0">
        <span>Category</span>
        <a-select
          v-model:value="sparepartStore.filter.categoryId"
          :options="categoryOptions"
          class="full"
        />
      </a-space>
      <a-space direction="vertical" :size="0">
        <span>Status</span>
        <a-select
          v-model:value="sparepartStore.filter.status"
          :options="statusOptions"
          class="full"
        />
      </a-space>
    </a-space>
  </a-flex>
</template>

<script setup>
import { useSparepartCategoryStore } from '@/stores/sparepartCategory'
import { computed, h, watch } from 'vue'
import { SearchOutlined } from '@ant-design/icons-vue'
import { debounce } from 'lodash-es'
import { useSparepartStore } from '@/stores/sparepart'

const sparepartStore = useSparepartStore()
const categoryStore = useSparepartCategoryStore()

const categoryOptions = computed(() => {
  return [
    {
      value: null,
      label: 'All',
    },
    ...categoryStore.categoryOptions,
  ]
})

const statusOptions = [
  { value: null, label: 'All' },
  { value: 'OutOfStock', label: 'Out Of Stock' },
  { value: 'NoStockControl', label: 'No Stock Control' },
]

const fetchData = async () => {
  sparepartStore.pagination.page = 1
  sparepartStore.loading = true
  await sparepartStore.get()
  sparepartStore.loading = false
}

const debounceFetch = debounce(fetchData, 500)

watch(() => sparepartStore.filter.search, debounceFetch)

watch(
  [() => sparepartStore.filter.categoryId, () => sparepartStore.filter.status],
  fetchData,
)
</script>

<style scoped>
.full {
  min-width: 150px;
  max-width: 100%;
}

.search-bar {
  width: 100%;
}
</style>
