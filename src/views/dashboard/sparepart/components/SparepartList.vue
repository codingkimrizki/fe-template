<template>
  <div>
    <a-spin
      :spinning="sparepartStore.loading"
      v-if="sparepartStore.sparepartList.length"
      size="large"
      tip="Loading..."
    >
      <a-row :gutter="[8, 8]" :wrap="true" class="wrapper-sparepart mb-large">
        <template v-if="sparepartStore.sparepartList.length > 0">
          <a-col
            :xs="24"
            :sm="24"
            :md="24"
            :lg="12"
            :xl="8"
            v-for="part in sparepartStore.sparepartList"
            :key="part.id"
          >
            <a-card
              :bordered="false"
              hoverable
              size="small"
              class="sparepart-card"
              @click="openDetail(part.id)"
            >
              <template #title>
                <a-flex vertical :gap="0" class="card-title">
                  <span class="large bold ellipsis-text">{{ part.name }}</span>
                  <a-space :size="0">
                    <a-tag :color="themeStore.colorPrimary">{{
                      part.sparepartNumber
                    }}</a-tag>
                    <a-tag :color="categoryColor(part.categoryName)">{{
                      capitalizeEachWord(part.categoryName)
                    }}</a-tag>
                  </a-space>
                </a-flex>
              </template>
              <a-card-grid class="grid-card" :hoverable="false">
                <a-flex vertical :gap="0">
                  <a-flex justify="space-between">
                    <span class="secondary">Stock</span>
                    <a-tooltip
                      v-if="part.unitType == 'pack'"
                      :title="`@${formatThousandSeparator(part.unitQty)} / ${part.unitType}`"
                    >
                      <QuestionCircleOutlined class="secondary" />
                    </a-tooltip>
                  </a-flex>
                  <span class="small"
                    >{{ formatThousandSeparator(part.stockCount) }}
                    {{ part.unitType }}</span
                  >
                </a-flex>
              </a-card-grid>
              <a-card-grid :hoverable="false" class="grid-card">
                <a-flex vertical :gap="0">
                  <span class="secondary">Safety</span>
                  <span class="small"
                    >{{ formatThousandSeparator(part.minStock) }}
                    {{ part.unitType }}</span
                  >
                </a-flex>
              </a-card-grid>
              <a-card-grid :hoverable="false" class="grid-card">
                <a-flex vertical :gap="0">
                  <span class="secondary">Progress</span>
                  <span class="small"
                    >{{ formatThousandSeparator(part.stockPending) }} PO</span
                  >
                </a-flex>
              </a-card-grid>
              <a-card-grid :hoverable="false" class="grid-card">
                <a-space direction="vertical" :size="0">
                  <span class="secondary">Status</span>
                  <a-tag color="red" class="blink" v-if="part.isLowStock"
                    >Low</a-tag
                  >
                  <a-tag color="green" v-else>Normal</a-tag>
                </a-space>
              </a-card-grid>
            </a-card>
          </a-col>
        </template>
      </a-row>
      <a-flex justify="flex-end" align="center">
        <BasePagination
          v-model:page="sparepartStore.pagination.page"
          v-model:pageSize="sparepartStore.pagination.pageSize"
          v-model:total="sparepartStore.pagination.total"
          @pageChange="updateDashboard"
          :show-size-changer="true"
        />
      </a-flex>
    </a-spin>
    <a-flex justify="center" align="center" class="wrapper-empty" v-else>
      <BaseEmpty description="No sparepart data" />
    </a-flex>
  </div>
</template>

<script setup>
import BaseEmpty from '@/components/base/BaseEmpty.vue'
import BasePagination from '@/components/base/BasePagination.vue'
import { useSparepartStore } from '@/stores/sparepart'
import { onMounted } from 'vue'
import { categoryColor } from '@/utils/sparepartCategoryColor'
import { capitalizeEachWord } from '@/utils/capitalizeEachWord'
import { formatThousandSeparator } from '@/utils/formatterInputNumber'
import { useThemeStore } from '@/stores/theme'
import { QuestionCircleOutlined } from '@ant-design/icons-vue'

const themeStore = useThemeStore()
const sparepartStore = useSparepartStore()

const updateDashboard = async () => {
  sparepartStore.loading = true
  await sparepartStore.get()
  sparepartStore.loading = false
}

const openDetail = async id => {
  sparepartStore.drawer.data = await sparepartStore.getDetail(id)
  sparepartStore.drawer.open = true
  sparepartStore.drawer.mode = 'detail'
}

onMounted(() => {
  if (sparepartStore.pagination.pageSize != 30) {
    sparepartStore.pagination.pageSize = 30
  }
  updateDashboard()
})
</script>

<style scoped>
.wrapper-sparepart {
  width: 100%;
  height: calc(85vh - 50px);
  overflow-y: auto;
  padding: 5px 2px 5px 2px;
  align-content: flex-start;
}

.wrapper-empty {
  height: calc(80vh - 70px);
}

.wrapper-sparepart::-webkit-scrollbar {
  width: 8px;
}

.wrapper-sparepart::-webkit-scrollbar-track {
  background: transparent;
  border-radius: 10px;
}

.wrapper-sparepart::-webkit-scrollbar-thumb {
  background-color: #888;
  border-radius: 10px;
}

.wrapper-sparepart::-webkit-scrollbar-thumb:hover {
  background-color: #555;
}

.card-title {
  padding: 0.8rem 0rem;
}

.grid-card {
  width: 25%;
  padding: 0.5rem 1rem;
}
</style>
