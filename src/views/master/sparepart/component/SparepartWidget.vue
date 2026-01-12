<template>
  <a-row :gutter="[24, 24]" :wrap="true">
    <BaseWidget
      title="Total Sparepart"
      :value="sparepartStore.totalSparepart"
      :icon="Wrench"
      description="Counted sparepart listed on database"
    />
    <BaseWidget
      title="Category"
      :value="categoryStore.categoryList.length"
      :icon="ClipboardList"
      description="Counted sparepart category listed on database"
      @click="openDrawer('category')"
    />
    <BaseWidget
      title="Supplier"
      :value="supplierStore.supplierList.length"
      :icon="Package"
      description="Counted supplier listed on database"
      @click="openDrawer('supplier')"
    />
  </a-row>
</template>

<script setup>
import BaseWidget from '@/components/base/BaseWidget.vue'
import { useSparepartStore } from '@/stores/sparepart'
import { useSparepartCategoryStore } from '@/stores/sparepartCategory'
import { useSparepartSupplierStore } from '@/stores/sparepartSupplier'
import { ClipboardList, Wrench, Package } from 'lucide-vue-next'
import { onMounted } from 'vue'

const categoryStore = useSparepartCategoryStore()
const sparepartStore = useSparepartStore()
const supplierStore = useSparepartSupplierStore()

const openDrawer = mode => {
  sparepartStore.toggleDrawer()
  sparepartStore.drawer.mode = mode
}

onMounted(async () => {
  categoryStore.get()
  supplierStore.get()
})
</script>

<style scoped></style>
