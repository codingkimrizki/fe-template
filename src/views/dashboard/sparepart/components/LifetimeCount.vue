<template>
  <div>
    <a-divider orientation="left">
      <span class="large">Historical Lifetime</span>
    </a-divider>
    <a-row :gutter="[8, 8]" class="mb-small">
      <a-col :span="8" v-for="item in data" :key="item.status">
        <a-card size="small" :class="`card-${item.status}`" :bordered="false">
          <a-flex vertical :gap="5">
            <a-flex justify="space-between" align="center">
              <span class="medium secondary">{{
                capitalizeEachWord(item.status)
              }}</span>
              <div class="circle">
                <component :is="iconMap[item.status]" />
              </div>
            </a-flex>
            <span class="small"
              >{{ formatThousandSeparator(item.shot) }} Shot</span
            >
          </a-flex>
        </a-card>
      </a-col>
    </a-row>
    <span class="small italic secondary"
      >* Calculation based on historical usage data</span
    >
  </div>
</template>

<script setup>
import { capitalizeEachWord } from '@/utils/capitalizeEachWord'
import { formatThousandSeparator } from '@/utils/formatterInputNumber'
import { RiseOutlined, FallOutlined, LineOutlined } from '@ant-design/icons-vue'

defineProps({
  data: {
    type: Object,
    required: true,
  },
})

const iconMap = {
  longest: RiseOutlined,
  shortest: FallOutlined,
  average: LineOutlined,
}
</script>

<style scoped>
.card-longest.ant-card {
  border-left: 3px solid #a3dc9a !important;
}

.card-shortest.ant-card {
  border-left: 3px solid #fa6868 !important;
}

.card-average.ant-card {
  border-left: 3px solid #face68 !important;
}

.circle {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 1px solid var(--text-color);
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
