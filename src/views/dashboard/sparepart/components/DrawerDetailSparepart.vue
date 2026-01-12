<template>
  <Teleport to="body">
    <BaseDrawer
      title="Sparepart Detail"
      :open="drawer.open"
      @close="handleClose"
      width="600"
    >
      <a-flex justify="space-between" align="center" class="mb-small">
        <a-space direction="vertical">
          <span class="x-large bold">{{ detail.name }}</span>
          <a-space :size="0">
            <a-tag :color="themeStore.colorPrimary">{{
              detail.sparepartNumber
            }}</a-tag>
            <a-tag :color="categoryColor(detail.category?.name)">{{
              capitalizeEachWord(detail.category?.name)
            }}</a-tag>
            <a-tag v-if="detail.drawingPath"
              ><a target="_blank" :href="generatePublicUrl(detail.drawingPath)">
                <FileOutlined /> Drawing
              </a>
            </a-tag>
          </a-space>
        </a-space>
      </a-flex>
      <StockList
        :list="sparepartStore.stockList"
        :safety="detail.minStock"
        :unit="detail.unitType"
      />
      <ProgressOrderList :list="sparepartStore.onProgressStockList" />
      <LifetimeCount v-if="isKanagata || isMachine" :data="detail.lifetime" />
      <HistoryUsed />
    </BaseDrawer>
  </Teleport>
</template>

<script setup>
import { useSparepartStore } from '@/stores/sparepart'
import { useThemeStore } from '@/stores/theme'
import { capitalizeEachWord } from '@/utils/capitalizeEachWord'
import { generatePublicUrl } from '@/utils/generatePublicUrl'
import { categoryColor } from '@/utils/sparepartCategoryColor'
import { FileOutlined } from '@ant-design/icons-vue'
import { storeToRefs } from 'pinia'
import BaseDrawer from '@/components/base/BaseDrawer.vue'
import StockList from './StockList.vue'
import ProgressOrderList from './ProgressOrderList.vue'
import { computed } from 'vue'
import HistoryUsed from './HistoryUsed.vue'
import LifetimeCount from './LifetimeCount.vue'

const themeStore = useThemeStore()
const sparepartStore = useSparepartStore()
const { drawer } = storeToRefs(sparepartStore)

const detail = computed(() => drawer.value.data)

const isMachine = computed(() => detail.value.category?.name === 'machine')
const isKanagata = computed(() => detail.value.category?.name === 'kanagata')

const handleClose = () => {
  drawer.value.open = false
}
</script>

<style scoped></style>
