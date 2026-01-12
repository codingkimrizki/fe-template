<template>
  <Teleport to="body">
    <BaseDrawer
      :title="title"
      :width="500"
      :open="store.drawer.open"
      @close="store.toggleDrawer"
    >
      <CategoryList v-if="store.drawer.mode === 'category'" />
      <SupplierList v-if="store.drawer.mode === 'supplier'" />
      <template #footer>
        <a-flex justify="flex-end">
          <span class="medium bold"
            >{{
              store.drawer.mode === 'category'
                ? categoryStore.categoryList.length
                : supplierStore.supplierList.length
            }}
            Listed
            {{
              store.drawer.mode === 'category' ? 'Category' : 'Supplier'
            }}</span
          >
        </a-flex>
      </template>
    </BaseDrawer>
  </Teleport>
</template>

<script setup>
import BaseDrawer from '@/components/base/BaseDrawer.vue'
import { useSparepartStore } from '@/stores/sparepart'
import { useSparepartCategoryStore } from '@/stores/sparepartCategory'
import { computed } from 'vue'
import CategoryList from './CategoryList.vue'
import SupplierList from './SupplierList.vue'
import { useSparepartSupplierStore } from '@/stores/sparepartSupplier'

const store = useSparepartStore()
const supplierStore = useSparepartSupplierStore()
const categoryStore = useSparepartCategoryStore()

const title = computed(() => {
  return store.drawer.mode !== 'category' ? 'Supplier List' : 'Category List'
})
</script>

<style scoped></style>
