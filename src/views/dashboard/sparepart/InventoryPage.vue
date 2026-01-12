<template>
  <div>
    <a-row :gutter="[16, 16]" :wrap="true">
      <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="5">
        <InventoryCost />
      </a-col>
      <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="19">
        <FilterInventory />
        <SparepartList />
        <DrawerDetailSparepart />
      </a-col>
    </a-row>
    <ModalUseStock />
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useSparepartCategoryStore } from '@/stores/sparepartCategory'
import { useSparepartStore } from '@/stores/sparepart'
import { useExchangeRatesStore } from '@/stores/exchangeRates'
import { useMachineStore } from '@/stores/machine'
import { useKanagataStore } from '@/stores/kanagata'
import FilterInventory from './components/FilterInventory.vue'
import SparepartList from './components/SparepartList.vue'
import DrawerDetailSparepart from './components/DrawerDetailSparepart.vue'
import ModalUseStock from './components/ModalUseStock.vue'
import InventoryCost from './components/InventoryCost.vue'

const sparepartStore = useSparepartStore()
const exchangeRatesStore = useExchangeRatesStore()
const categoryStore = useSparepartCategoryStore()
const machineStore = useMachineStore()
const kanagataStore = useKanagataStore()

onMounted(async () => {
  await categoryStore.getOptions()
  await machineStore.getOptions()
  await kanagataStore.getOptions()
  await exchangeRatesStore.get()
})

onUnmounted(() => {
  sparepartStore.$reset()
})
</script>

<style scoped>
.title-area {
  height: 45px;
}
</style>
