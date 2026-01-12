<template>
  <Teleport to="body">
    <BaseModal
      :width="600"
      :modal-title="stockStore.modal.title"
      :visible="stockStore.modal.visible"
      @close="handleClose"
    >
      <template #body>
        <a-form
          layout="vertical"
          :model="formData"
          :rules="formRules"
          @finish="handleAction"
        >
          <!-- Stock info card -->
          <a-flex
            align="center"
            class="mb-large sparepart-info"
            gap="large"
            wrap="wrap"
          >
            <a-space direction="vertical" :size="0">
              <span class="secondary">Name</span>
              <span class="ellipsis-text ellipsis-width">{{
                stockData.sparepart?.name
              }}</span>
            </a-space>
            <a-space direction="vertical" :size="0">
              <span class="secondary">Number</span>
              <a-tag
                class="ellipsis-text ellipsis-width"
                :color="themeStore.colorPrimary"
                >{{ stockData.sparepart?.sparepartNumber }}</a-tag
              >
            </a-space>
            <a-space direction="vertical" :size="0">
              <span class="secondary">Category</span>
              <a-tag
                :color="categoryColor(stockData.sparepart?.category?.name)"
                >{{
                  capitalizeEachWord(stockData.sparepart?.category?.name)
                }}</a-tag
              >
            </a-space>
            <a-space direction="vertical" :size="0">
              <span class="secondary">Entry Date</span>
              <a-tag>{{
                formatDateTime(stockData.arrival, 'YYYY-MM-DD')
              }}</a-tag>
            </a-space>
          </a-flex>
          <a-space
            size="small"
            align="center"
            class="mb-large"
            v-if="isControlledPart"
          >
            <a-switch
              size="small"
              v-model:checked="formData.controlledPart"
              :filterOption="filterOption"
            />
            <span
              >Make this sparepart shot controlled to
              {{ stockData.sparepart?.category?.name }}</span
            >
          </a-space>

          <!-- Form -->
          <a-form-item
            v-if="isMachine"
            label="Select Machine"
            name="machineId"
            :validate-trigger="['change', 'blur']"
            autocomplete="off"
          >
            <a-select
              show-search
              v-model:value="formData.machineId"
              :options="machineStore.machineOptions"
            />
          </a-form-item>
          <a-form-item
            v-if="isKanagata"
            label="Select Kanagata"
            name="kanagataId"
            :validate-trigger="['change', 'blur']"
            autocomplete="off"
          >
            <a-select
              show-search
              v-model:value="formData.kanagataId"
              :options="kanagataStore.kanagataOptions"
              :filterOption="filterOption"
            />
          </a-form-item>
          <a-form-item v-if="formData.controlledPart" label="Note" name="note">
            <a-textarea
              v-model:value="formData.note"
              :rows="2"
              :maxlength="100"
            />
          </a-form-item>
          <a-alert
            message="This action will update this stock as used"
            type="info"
            class="mb-large"
            show-icon
          />
          <a-flex justify="flex-end">
            <a-button type="primary" html-type="submit" :loading="loading"
              >Submit</a-button
            >
          </a-flex>
        </a-form>
      </template>
    </BaseModal>
  </Teleport>
</template>

<script setup>
import BaseModal from '@/components/base/BaseModal.vue'
import { useBarcodeScanner } from '@/composable/eventHandlerScanQr'
import { useSparepartStockStore } from '@/stores/sparepartStock'
import { message, notification } from 'ant-design-vue'
import { useThemeStore } from '@/stores/theme'
import { useSparepartControlledStore } from '@/stores/sparepartControlled'
import { useAuthStore } from '@/stores/auth'
import { capitalizeEachWord } from '@/utils/capitalizeEachWord'
import { formatDateTime } from '@/utils/formatDateTime'
import { categoryColor } from '@/utils/sparepartCategoryColor'
import { computed, ref, watch } from 'vue'
import { useMachineStore } from '@/stores/machine'
import { useKanagataStore } from '@/stores/kanagata'
import { filterOption } from '@/utils/filterSelectOptions'
import { useSparepartStore } from '@/stores/sparepart'
import dayjs from 'dayjs'

const authStore = useAuthStore()
const kanagataStore = useKanagataStore()
const themeStore = useThemeStore()
const stockStore = useSparepartStockStore()
const machineStore = useMachineStore()
const sparepartControlledStore = useSparepartControlledStore()
const stockData = ref({})
const sparepartStore = useSparepartStore()

const loading = ref(false)

// Form data
const formData = ref({
  machineId: null,
  kanagataId: null,
  controlledPart: false,
  note: null,
})

const resetFormData = () => {
  formData.value = {
    machineId: null,
    kanagataId: null,
    controlledPart: false,
    note: null,
  }
}

// form rules use stock
const controlledPartValidator = errorMessage => {
  return async (_, value) => {
    if (!formData.value.controlledPart) {
      return Promise.resolve()
    }
    if (!value) {
      return Promise.reject(new Error(errorMessage))
    }
    return Promise.resolve()
  }
}

// form rules use stock
const formRules = ref({
  machineId: {
    validator: controlledPartValidator('Please select machine'),
  },
  kanagataId: {
    validator: controlledPartValidator('Please select kanagata'),
  },
  note: {
    validator: controlledPartValidator('Note is required'),
  },
})

// Action form submit
const handleAction = async () => {
  const endpoint = stockData.value.sparepart?.category?.name?.toLowerCase()
  const stockId = stockData.value.id
  const note = formData.value.note

  const payload = {
    stockId,
    note,
    ...(isMachine.value && { machineId: formData.value.machineId }),
    ...(isKanagata.value && { kanagataId: formData.value.kanagataId }),
  }

  try {
    // Update stock as used
    await stockStore.update(stockId, {
      isUsed: true,
      picUsedId: authStore.user.id,
      usedDate: dayjs(),
      isFinal: true,
    })

    // Add controlled part
    if (formData.value.controlledPart) {
      await sparepartControlledStore.add(endpoint, payload)
    }

    sparepartStore.updateHistoryUsed = true
  } catch (error) {
    message.error(error.response?.data?.message || 'An error occurred')
    console.error(error)
  }

  // tutup modal
  handleClose()
}

const isControlledPart = computed(() => {
  return ['machine', 'kanagata'].includes(
    stockData.value?.sparepart?.category?.name?.toLowerCase(),
  )
})

const isMachine = computed(() => {
  return (
    formData.value.controlledPart &&
    stockData.value?.sparepart?.category?.name?.toLowerCase() === 'machine'
  )
})

const isKanagata = computed(() => {
  return (
    formData.value.controlledPart &&
    stockData.value?.sparepart?.category?.name?.toLowerCase() === 'kanagata'
  )
})

// Event listener for barcode scanner
useBarcodeScanner({
  threshold: 80,
  onScan: code => {
    getStockData(code)
  },
})

// Close modal function
const handleClose = () => {
  stockStore.modal.visible = false
}

// Get stock data function
const getStockData = async id => {
  stockStore.modal.visible = false
  stockStore.modal.stockId = id

  stockData.value = await stockStore.getDetail(id)
  if (stockData.value.isUsed) {
    notification.error({
      message: 'Sparepart stock already used',
    })
    return
  }
  resetFormData()
  stockStore.modal.visible = true
}

// Watch stock id change for manual trigger with button
watch(
  () => stockStore.modal.stockId,
  newId => {
    if (!newId) return
    getStockData(newId)
  },
)
</script>

<style scoped>
.sparepart-info {
  border: 2px solid var(--card-bg-transparent);
  padding: 16px;
  border-radius: 8px;
}

.ellipsis-width {
  max-width: 200px;
}
</style>
