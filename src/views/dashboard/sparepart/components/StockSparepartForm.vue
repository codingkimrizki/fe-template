<template>
  <a-form
    layout="vertical"
    :model="formData"
    :rules="formRules"
    @finish="handleAction"
  >
    <a-flex align="center" class="mb-large sparepart-info" gap="large">
      <a-space direction="vertical" :size="0">
        <span class="secondary">Name</span>
        <span class="ellipsis-text ellipsis-width">{{ sparepart.name }}</span>
      </a-space>
      <a-space direction="vertical" :size="0">
        <span class="secondary">Number</span>
        <a-tag
          class="ellipsis-text ellipsis-width"
          :color="themeStore.colorPrimary"
          >{{ sparepart.sparepartNumber }}</a-tag
        >
      </a-space>
      <a-space direction="vertical" :size="0">
        <span class="secondary">Category</span>
        <a-tag :color="categoryColor(sparepart.category.name)">{{
          capitalizeEachWord(sparepart.category.name)
        }}</a-tag>
      </a-space>
      <a-space direction="vertical" :size="0">
        <span class="secondary">Unit</span>
        <a-tag color="grey"
          >{{ capitalizeEachWord(sparepart.unitType) }}
          <span v-if="sparepart.unitType === 'pack'"
            >[{{ sparepart.unitQty }}]</span
          ></a-tag
        >
      </a-space>
    </a-flex>
    <a-row :gutter="[16, 8]">
      <a-col :span="12">
        <a-form-item
          label="Supplier"
          name="supplierId"
          :validate-trigger="['change', 'blur']"
          autocomplete="off"
        >
          <a-select
            v-model:value="formData.supplierId"
            :options="supplierStore.supplierOptions"
            :disabled="!isAddMode"
          />
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item
          label="Quantity Order"
          name="qty"
          :validate-trigger="['change', 'blur']"
          autocomplete="off"
          tooltip="Number of orders refers to sparepart unit"
        >
          <a-input-number
            v-model:value="formData.qty"
            :min="1"
            :formatter="value => formatThousandSeparator(value, ',')"
            :disabled="!isAddMode"
          />
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item
          label="Price (IDR)"
          name="price"
          :validate-trigger="['change', 'blur']"
          autocomplete="off"
        >
          <a-input-number
            v-model:value="formData.price"
            class="full"
            prefix="Rp"
            :min="0"
            :disabled="!isAddMode"
            :formatter="value => formatThousandSeparator(value, '.')"
            :parser="value => parseThousandSeparator(value, '.')"
          />
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item
          label="Price (USD)"
          name="usdValue"
          :validate-trigger="['change', 'blur']"
          autocomplete="off"
        >
          <a-input-number
            :min="0"
            prefix="$"
            class="full"
            :disabled="!isAddMode"
            v-model:value="usdValue"
            :formatter="value => formatThousandSeparator(value, '.')"
            :parser="value => parseThousandSeparator(value, '.')"
          />
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item
          label="Price (JPY)"
          name="jpyValue"
          :validate-trigger="['change', 'blur']"
          autocomplete="off"
        >
          <a-input-number
            :min="0"
            prefix="¥"
            class="full"
            :disabled="!isAddMode"
            v-model:value="jpyValue"
            :formatter="value => formatThousandSeparator(value, '.')"
            :parser="value => parseThousandSeparator(value, '.')"
          />
        </a-form-item>
      </a-col>
      <a-col :span="24">
        <a-alert type="info">
          <template #message>
            <a-flex justify="space-between">
              <span class="small"
                >Conversion rates from
                <a
                  class="italic"
                  target="_blank"
                  href="https://www.exchangerate-api.com/docs/free"
                  >exchangerate-api</a
                >
              </span>
              <span class="small italic">{{
                exchangeRatesStore.timeLastUpdateUtc
              }}</span>
            </a-flex>
          </template>
        </a-alert>
      </a-col>
      <a-col :span="8">
        <a-form-item
          label="PO Date"
          name="po"
          :validate-trigger="['change', 'blur']"
          autocomplete="off"
        >
          <a-date-picker
            class="full"
            v-model:value="formData.po"
            :disabled="!isAddMode"
          />
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item
          label="Entry Date"
          name="arrival"
          :validate-trigger="['change', 'blur']"
          autocomplete="off"
        >
          <a-date-picker
            class="full"
            :disabled="isAddMode || isDeleteMode || isNccMode"
            v-model:value="formData.arrival"
          />
        </a-form-item>
      </a-col>
      <a-col :span="8">
        <a-form-item
          label="Quality Check Date"
          name="qc"
          :validate-trigger="['change', 'blur']"
          autocomplete="off"
        >
          <a-date-picker
            class="full"
            :disabled="isAddMode || isDeleteMode || isNccMode"
            v-model:value="formData.qc"
          />
        </a-form-item>
      </a-col>
      <a-col :span="24" v-if="isUpdateMode">
        <a-space size="small" align="center" class="mb-small">
          <a-switch
            size="small"
            v-model:checked="formData.isFinal"
            :disabled="true"
          />
          <span class="small">Verified this order progress to stock</span>
        </a-space>
      </a-col>
      <a-col
        :span="24"
        v-if="isNccMode || (isUpdateMode && props.data.status === 'NCC')"
      >
        <a-form-item
          label="NCC Note"
          name="note"
          :validate-trigger="['change', 'blur']"
          autocomplete="off"
        >
          <a-textarea
            v-model:value="formData.note"
            :maxlength="200"
            :rows="3"
            :disabled="!isNccMode"
          />
        </a-form-item>
      </a-col>
    </a-row>
    <a-alert
      v-if="alertMessage"
      :message="alertMessage"
      type="warning"
      show-icon
      style="margin-bottom: 1rem"
    />
    <a-flex justify="flex-end">
      <a-button
        type="primary"
        html-type="submit"
        :loading="loading"
        :disabled="loading"
        >Submit</a-button
      >
    </a-flex>
  </a-form>
</template>

<script setup>
import dayjs from 'dayjs'
import { useThemeStore } from '@/stores/theme'
import { computed, onMounted, ref, watch } from 'vue'
import { useSparepartStore } from '@/stores/sparepart'
import { storeToRefs } from 'pinia'
import { categoryColor } from '@/utils/sparepartCategoryColor'
import { capitalizeEachWord } from '@/utils/capitalizeEachWord'
import { useSparepartSupplierStore } from '@/stores/sparepartSupplier'
import {
  formatThousandSeparator,
  parseThousandSeparator,
} from '@/utils/formatterInputNumber'
import { useSparepartStockStore } from '@/stores/sparepartStock'
import { useAuthStore } from '@/stores/auth'
import { useExchangeRatesStore } from '@/stores/exchangeRates'
import { notification } from 'ant-design-vue'

const exchangeRatesStore = useExchangeRatesStore()
const authStore = useAuthStore()
const stockStore = useSparepartStockStore()
const sparepartStore = useSparepartStore()
const supplierStore = useSparepartSupplierStore()
const themeStore = useThemeStore()
const { drawer } = storeToRefs(sparepartStore)

const sparepart = computed(() => drawer.value.data)
const loading = ref(false)

const emit = defineEmits(['close'])

// Form Mode
const isUpdateMode = computed(() => props.mode === 'update')
const isDeleteMode = computed(() => props.mode === 'delete')
const isNccMode = computed(() => props.mode === 'ncc')
const isAddMode = computed(() => props.mode === 'add')

// Alert Form
const alertMessage = computed(() => {
  if (props.mode === 'delete') {
    return 'If you submit, will delete progress order data.'
  }

  if (props.mode === 'update' && props.data.status === 'NCC') {
    return 'This operation will update progress order and set to good spareparts'
  }
  return ''
})

const props = defineProps({
  mode: {
    type: String,
    default: 'add',
  },
  data: {
    type: Object,
    default: () => ({}),
  },
})

const formData = ref({
  price: 0,
  qty: 1,
  po: null,
  arrival: null,
  qc: null,
  picPoId: null,
  picQcId: null,
  isFinal: false,
  supplierId: null,
  note: null,
})

const formRules = ref({
  supplierId: {
    required: true,
    message: 'Please select supplier',
    trigger: 'change',
  },
  price: {
    required: true,
    message: 'Please enter price',
    trigger: 'change',
  },
  qty: [
    {
      required: true,
      message: 'Please enter quantity',
      trigger: 'change',
    },
    {
      type: 'number',
      min: 1,
      message: 'Quantity must be greater than 0',
      trigger: 'change',
    },
  ],
  po: {
    required: true,
    trigger: 'change',
    message: 'PO Date is required',
  },
  arrival: {
    validator: (_, value) => {
      if (!value) return Promise.resolve()
      // Required if NCC
      const isNcc = props.data.status === 'NCC'
      if (isNcc && !value) {
        return Promise.reject('Arrival date is required for NCC')
      }
      // Checking if arrival date is before PO date
      const poDate = formData.value.po
      if (!poDate) return Promise.resolve()
      if (dayjs(value).isBefore(dayjs(poDate), 'day')) {
        return Promise.reject('Cannot be earlier than PO date')
      }
      return Promise.resolve()
    },
    trigger: 'change',
  },
  qc: {
    validator: (_, value) => {
      if (!value) return Promise.resolve()
      // Required if NCC
      const isNcc = props.data.status === 'NCC'
      if (isNcc && !value) {
        return Promise.reject('QC date is required')
      }
      // validate qc date
      const poDate = formData.value.po
      if (!poDate) return Promise.resolve()
      if (dayjs(value).isBefore(dayjs(poDate), 'day')) {
        return Promise.reject('Cannot be earlier than PO date')
      }
      if (dayjs(value).isBefore(dayjs(formData.value.arrival), 'day')) {
        return Promise.reject('Cannot be earlier than Arrival date')
      }
      return Promise.resolve()
    },
    trigger: 'change',
  },
})

const usdValue = computed({
  get: () => {
    if (!exchangeRatesStore.rates) return 0
    const convertedValue = formData.value.price / exchangeRatesStore.rates.IDR
    return Number(convertedValue.toFixed(2))
  },
  set: val => {
    if (!exchangeRatesStore.rates || !val) {
      formData.value.price = 0
      return
    }
    formData.value.price = Number(
      (val * exchangeRatesStore.rates.IDR).toFixed(2),
    )
  },
})

const jpyValue = computed({
  get: () => {
    if (!exchangeRatesStore.rates) return 0
    const convertedValue =
      (formData.value.price / exchangeRatesStore.rates.IDR) *
      exchangeRatesStore.rates.JPY
    return Number(convertedValue.toFixed(2))
  },
  set: val => {
    if (!exchangeRatesStore.rates || !val) {
      formData.value.price = 0
      return
    }
    formData.value.price = Number(
      (
        (val / exchangeRatesStore.rates.JPY) *
        exchangeRatesStore.rates.IDR
      ).toFixed(2),
    )
  },
})

const handleAction = async () => {
  try {
    if (props.mode === 'add') {
      loading.value = true
      const { qty, ...rest } = formData.value
      const addParts = Array.from({ length: qty }, () =>
        stockStore.add({
          ...rest,
          sparepartId: sparepart.value.id,
          picPoId: authStore.user.id,
        }),
      )

      await Promise.all(addParts)

      notification.success({
        message: `Success add new ${formData.value.qty} progress order sparepart`,
      })
    }

    if (props.mode === 'update') {
      loading.value = true

      // Set user id when update qc date
      const updateQc = formData.value.qc !== props.data.qc
      updateQc ? (formData.value.picQcId = authStore.user.id) : null

      if (props.data.status === 'NCC') {
        await stockStore.deleteNcc(props.data.sparepartNcc?.id)
      }

      await stockStore.update(props.data.id, formData.value)
    }

    if (props.mode === 'delete') {
      await stockStore.delete(props.data.id)
    }

    if (props.mode === 'ncc') {
      loading.value = true
      await stockStore.ncc({
        stockId: props.data.id,
        note: formData.value.note,
      })
    }

    emit('close')
  } catch (error) {
    console.log(`Error ${props.mode} sparepart stock :`, error)
  } finally {
    loading.value = false
  }
}

const resetFormData = () => {
  formData.value = {
    price: 0,
    qty: 1,
    po: null,
    arrival: null,
    qc: null,
    picPoId: null,
    picQcId: null,
    isFinal: false,
    supplierId: null,
    note: null,
  }
}

const initializeFormData = () => {
  // Always reset first
  resetFormData()

  if (props.data && Object.keys(props.data).length > 0 && props.data.id) {
    formData.value = {
      price: props.data.price ?? 0,
      qty: props.data.qty ?? 1,
      supplierId: props.data.supplier?.id ?? null,
      po: props.data.po ? dayjs(props.data.po) : null,
      arrival: props.data.arrival ? dayjs(props.data.arrival) : null,
      qc: props.data.qc ? dayjs(props.data.qc) : null,
      picPoId: props.data.picPo?.id ?? null,
      picQcId: props.data.picQc?.id ?? null,
      isFinal: props.data.isFinal ?? false,
      note: props.data.sparepartNcc?.note ?? null,
    }
  }
}

// Watch for changes in props.data with deep comparison
watch(
  () => props.data,
  () => {
    initializeFormData()
  },
  { immediate: true, deep: true },
)

// Watch to auto-set isFinal based on qc and arrival
watch(
  () => [formData.value.qc, formData.value.arrival],
  ([qc, arrival]) => {
    formData.value.isFinal = !!(qc && arrival)
  },
)

onMounted(async () => {
  await supplierStore.getOptions()
})
</script>

<style scoped>
.full {
  width: 100%;
}

.sparepart-info {
  border: 2px solid var(--card-bg-transparent);
  padding: 16px;
  border-radius: 8px;
}

.ellipsis-width {
  max-width: 200px;
}
</style>
