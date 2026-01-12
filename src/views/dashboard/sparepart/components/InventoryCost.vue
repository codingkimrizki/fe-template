<template>
  <div>
    <a-flex align="center" class="mb-large" style="padding-top: 1rem">
      <span class="x-large bold">Inventory Cost</span>
    </a-flex>
    <a-spin :spinning="loading" size="large" tip="Loading...">
      <a-card size="small" :bordered="false" class="mb-small">
        <a-flex vertical gap="large">
          <div v-for="category in inventoryAnalysis" :key="category.name">
            <a-flex justify="flex-start" align="center" gap="small">
              <Package :size="32" :color="categoryColor(category.name)" />
              <a-flex vertical :gap="0" flex="1">
                <span class="medium bold">{{
                  capitalizeEachWord(category.name)
                }}</span>
                <a-flex justify="space-between" align="center">
                  <a-space size="small">
                    <span class="small secondary"
                      >Listed :
                      {{ formatThousandSeparator(category.totalSparepart) }}
                    </span>
                    <span class="small secondary"
                      >Stock :
                      {{ formatThousandSeparator(category.totalStock) }}
                    </span>
                  </a-space>
                  <span class="small secondary italic"
                    >Rp. {{ formatThousandSeparator(category.cost) }}
                  </span>
                </a-flex>
              </a-flex>
            </a-flex>
          </div>
        </a-flex>
      </a-card>
      <a-card size="small" :bordered="false">
        <a-flex justify="space-between" align="center">
          <span class="medium">Cost</span>
          <span class="medium bold italic"
            >Rp.
            {{
              formatThousandSeparator(inventoryReportStore.totalInventoryCost)
            }}</span
          >
        </a-flex>
      </a-card>
    </a-spin>
  </div>
</template>

<script setup>
import { useInventoryReportStore } from '@/stores/inventoryReport'
import { categoryColor } from '@/utils/sparepartCategoryColor'
import { capitalizeEachWord } from '@/utils/capitalizeEachWord'
import { formatThousandSeparator } from '@/utils/formatterInputNumber'
import { nextTick, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { Package } from 'lucide-vue-next'

const inventoryReportStore = useInventoryReportStore()
const loading = ref(false)

const { inventoryAnalysis } = storeToRefs(inventoryReportStore)

onMounted(async () => {
  loading.value = true
  await inventoryReportStore.getInventoryAnalysis()
  await nextTick()
  loading.value = false
})
</script>

<style scoped></style>
