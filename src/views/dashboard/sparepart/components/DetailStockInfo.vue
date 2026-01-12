<template>
  <div>
    <a-flex justify="space-between" align="center" gap="small">
      <a-flex vertical :gap="15">
        <span class="medium">Timeline Sparepart</span>
        <a-timeline>
          <a-timeline-item>
            <a-space direction="vertical" :size="0">
              <span class="bold">Purchase Order</span>
              <a-space :size="0">
                <a-tag>
                  <CalendarOutlined />
                  {{ formatDateTime(stockData.po, 'YYYY-MM-DD') }}
                </a-tag>
                <a-tag>
                  <UserOutlined />
                  {{ capitalizeEachWord(stockData.picPo.name) }}
                </a-tag>
              </a-space>
            </a-space>
          </a-timeline-item>
          <a-timeline-item
            ><a-space direction="vertical" :size="0">
              <span class="bold">Entry Date</span>
              <a-space :size="0">
                <a-tag>
                  <CalendarOutlined />
                  {{ formatDateTime(stockData.arrival, 'YYYY-MM-DD') }}
                </a-tag>
                <a-tag>
                  <ClockCircleOutlined />
                  {{ dayjs(stockData.arrival).diff(stockData.po, 'day') }} Days
                  Shipment
                </a-tag>
              </a-space>
            </a-space></a-timeline-item
          >
          <a-timeline-item>
            <a-space direction="vertical" :size="0">
              <span class="bold">Quality Check</span>
              <a-space :size="0">
                <a-tag>
                  <CalendarOutlined />
                  {{ formatDateTime(stockData.qc, 'YYYY-MM-DD') }}
                </a-tag>
                <a-tag>
                  <UserOutlined />
                  {{ capitalizeEachWord(stockData.picQc.name) }}
                </a-tag>
              </a-space>
            </a-space>
          </a-timeline-item>
          <a-timeline-item color="green" v-if="stockData.isFinal">
            <span class="bold">Good Part</span>
          </a-timeline-item>
        </a-timeline>
      </a-flex>
      <a-flex vertical align="center" gap="small">
        <div ref="labelStock">
          <div size="small" class="stock-card">
            <a-flex
              justify="space-between"
              align="center"
              gap="small"
              class="mb-small"
            >
              <a-space :size="10">
                <a-image :width="80" :src="hrs" :preview="false" />
                <span class="large bold"
                  >IOT <br />
                  MOLDING</span
                >
              </a-space>
              <Qrcode :value="stockData.id" :size="70" level="H" />
            </a-flex>
            <a-flex justify="space-between" class="description" align="center">
              <span class="bold">Name</span>
              <span class="ellipsis-text">{{ sparepartData.name }}</span>
            </a-flex>
            <a-flex justify="space-between" class="description" align="center">
              <span class="bold">Number</span>
              <span class="ellipsis-text">{{
                sparepartData.sparepartNumber
              }}</span>
            </a-flex>
            <a-flex justify="space-between" class="description" align="center">
              <span class="bold">Category</span>
              <span class="ellipsis-text">{{
                capitalizeEachWord(sparepartData.category.name)
              }}</span>
            </a-flex>
            <a-flex justify="space-between" class="description" align="center">
              <span class="bold">Entry</span>
              <span class="">{{
                formatDateTime(stockData.arrival, 'YYYY-MM-DD')
              }}</span>
            </a-flex>
            <a-flex justify="space-between" class="description" align="center">
              <span class="bold">Supplier</span>
              <span class="ellipsis-text">{{ stockData.supplier.name }}</span>
            </a-flex>
          </div>
        </div>
        <a-button type="primary" @click="handlePrint">
          <PrinterOutlined /> Print
        </a-button>
      </a-flex>
    </a-flex>
  </div>
</template>

<script setup>
import hrs from '@/assets/images/hrs.png'
import Qrcode from 'qrcode.vue'
import { useSparepartStore } from '@/stores/sparepart'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import { formatDateTime } from '@/utils/formatDateTime'
import html2pdf from 'html2pdf.js'
import { capitalizeEachWord } from '@/utils/capitalizeEachWord'
import {
  CalendarOutlined,
  UserOutlined,
  PrinterOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons-vue'
import dayjs from 'dayjs'

const sparepartStore = useSparepartStore()
const { drawer } = storeToRefs(sparepartStore)

const sparepartData = computed(() => drawer.value.data)
const labelStock = ref(null)

defineProps({
  stockData: {
    type: Object,
    default: () => ({}),
  },
})

const handlePrint = () => {
  if (labelStock.value) {
    const opt = {
      margin: 0.2,
      filename: 'label-stock.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 4, useCORS: true },
      // 105mm x 65mm untuk ukuran kertas label print 3.34 x 2.16 in
      jsPDF: { unit: 'mm', format: [105, 65], orientation: 'landscape' },
    }

    // Generate PDF and open in new tab for printing
    html2pdf()
      .set(opt)
      .from(labelStock.value)
      .toPdf()
      .get('pdf')
      .then(pdf => {
        pdf.autoPrint()
        window.open(pdf.output('bloburl'), '_blank')
      })
  }
}
</script>

<style scoped>
.stock-card {
  width: 400px;
  padding: 1rem 1rem;
  border-radius: 8px;
  color: black;
  background-color: #fff;
}

.description {
  border-bottom: 0.5px solid black;
  margin-bottom: 8px;
}

.description .ellipsis-text {
  max-width: 250px;
}
</style>
