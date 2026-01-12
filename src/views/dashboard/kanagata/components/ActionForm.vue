<template>
  <a-form layout="vertical" :model="formData" @finish="handleSubmit">
    <a-row :gutter="[24, 24]" align="top">
      <!-- Mode Adjust / Reset -->
      <template v-if="!isSetting">
        <a-col :flex="1">
          <a-form-item
            label="Kanagata Shot"
            name="kanagataShot"
            :validate-trigger="['blur', 'change']"
          >
            <a-input-number
              :disabled="isReset"
              :controls="false"
              :min="0"
              placeholder="Enter a number"
              v-model:value="formData.kanagataShot"
              :formatter="value => formatThousandSeparator(value)"
              :parser="value => parseThousandSeparator(value)"
              autocomplete="off"
            />
          </a-form-item>
        </a-col>
        <a-col :span="8" v-if="kanagata?.ultrasonicStatus">
          <a-form-item
            label="Reset Ultrasonic"
            name="ultrasonicCheck"
            :validate-trigger="['blur', 'change']"
          >
            <a-switch v-model:checked="formData.ultrasonicCheck" />
          </a-form-item>
        </a-col>
        <a-col :flex="1" v-if="isAdjust">
          <a-form-item
            label="Lifetime Shot"
            name="totalKanagataShot"
            tooltip="Counted from the first time kanagata was used"
          >
            <a-input-number
              :controls="false"
              :min="0"
              placeholder="Enter a number"
              v-model:value="formData.totalKanagataShot"
              :formatter="value => formatThousandSeparator(value)"
              :parser="value => parseThousandSeparator(value)"
              autocomplete="off"
            />
          </a-form-item>
        </a-col>
      </template>

      <!-- Mode Setting -->
      <a-col :flex="1" v-else>
        <a-form-item
          label="Overshot Kanagata"
          name="targetKanagata"
          :validate-trigger="['blur', 'change']"
        >
          <a-input-number
            :controls="false"
            :min="0"
            placeholder="Enter a number"
            v-model:value="formData.targetKanagata"
            autocomplete="off"
            :formatter="value => formatThousandSeparator(value)"
            :parser="value => parseThousandSeparator(value)"
          />
        </a-form-item>

        <a-form-item
          label="Tolerance Kanagata"
          name="toleranceKanagata"
          :validate-trigger="['blur', 'change']"
        >
          <a-input-number
            :controls="false"
            :min="0"
            placeholder="Enter a number"
            v-model:value="formData.toleranceKanagata"
            autocomplete="off"
            :formatter="value => formatThousandSeparator(value)"
            :parser="value => parseThousandSeparator(value)"
          />
        </a-form-item>

        <a-form-item
          label="Overshot Total"
          name="targetTotal"
          :validate-trigger="['blur', 'change']"
        >
          <a-input-number
            :controls="false"
            :min="0"
            placeholder="Enter a number"
            v-model:value="formData.targetTotal"
            autocomplete="off"
            :formatter="value => formatThousandSeparator(value)"
            :parser="value => parseThousandSeparator(value)"
          />
        </a-form-item>
      </a-col>
    </a-row>

    <!-- Warning -->
    <a-alert
      v-if="!isSetting"
      message="WARNING"
      description="Adjust shot can make impact on invalid data, please check before continue."
      show-icon
      class="mb-large"
      type="warning"
    />
    <!-- Switch force update -->
    <a-space size="small" class="mb-small" v-if="authStore.isAdmin">
      <a-switch v-model:checked="forceUpdate" size="small" />
      <span class="small italic">Force update db without sync to device</span>
    </a-space>

    <!-- Submit button -->
    <a-form-item>
      <a-flex justify="flex-end" :gap="10">
        <a-button
          type="primary"
          html-type="submit"
          :loading="isSubmitting"
          :disabled="isSubmitting"
        >
          Submit
        </a-button>
      </a-flex>
    </a-form-item>
  </a-form>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useKanagataDashboardStore } from '@/stores/kanagataDashboard'
import {
  formatThousandSeparator,
  parseThousandSeparator,
} from '@/utils/formatterInputNumber'
import { capitalizeEachWord } from '@/utils/capitalizeEachWord'

const authStore = useAuthStore()
const kanagataDashboardStore = useKanagataDashboardStore()

// Ambil data kanagata dari store
const kanagata = computed(() =>
  kanagataDashboardStore.getKanagataById(
    kanagataDashboardStore.modal.idKanagata,
  ),
)

const isSubmitting = ref(false)
const isAdjust = computed(() => kanagataDashboardStore.modal.mode === 'Adjust')
const isReset = computed(() => kanagataDashboardStore.modal.mode === 'Reset')
const isSetting = computed(
  () => kanagataDashboardStore.modal.mode === 'Setting',
)

const forceUpdate = ref(false)

// Default form data (akan diisi dari store)
const formData = ref({
  kanagataShot: 0,
  totalKanagataShot: 0,
  targetKanagata: 0,
  toleranceKanagata: 0,
  targetTotal: 0,
  ultrasonicCheck: false,
})

// ✅ Ambil data dari `kanagata` saat modal terbuka atau data berubah
const initializeFormData = () => {
  if (kanagata.value) {
    formData.value = {
      kanagataShot: kanagata.value.kanagataShot || 0,
      totalKanagataShot: kanagata.value.totalKanagataShot || 0,
      targetKanagata: kanagata.value.targetKanagata || 0,
      toleranceKanagata: kanagata.value.toleranceKanagata || 0,
      targetTotal: kanagata.value.targetTotal || 0,
    }
  } else {
    // Jika belum ada data
    formData.value = {
      kanagataShot: 0,
      totalKanagataShot: 0,
      targetKanagata: 0,
      toleranceKanagata: 0,
      targetTotal: 0,
    }
  }
}

// Jalankan saat kanagata berubah atau modal terbuka
watch(
  () => kanagataDashboardStore.modal.idKanagata,
  () => initializeFormData(),
  { immediate: true },
)

// ✅ Handle submit
const handleSubmit = async () => {
  isSubmitting.value = true
  const key = kanagataDashboardStore.modal.shotType.toLowerCase()
  const logData = {
    kanagataId: kanagataDashboardStore.modal.idKanagata,
    userId: authStore.user.id,
  }

  try {
    if (isReset.value) {
      const kanagataData = { [key + 'Shot']: 0, ultrasonicCheck: false }
      await kanagataDashboardStore.update(
        kanagataData,
        {
          ...logData,
          event: `Reset ${key}`,
        },
        forceUpdate.value,
      )
    }

    if (isSetting.value) {
      const target = 'target' + capitalizeEachWord(key)
      const tolerance = 'tolerance' + capitalizeEachWord(key)
      const kanagataData = {
        [target]: formData.value[target],
        [tolerance]: formData.value[tolerance],
        targetTotal: formData.value.targetTotal,
      }
      await kanagataDashboardStore.update(
        kanagataData,
        {
          ...logData,
          event: `Setting target and tolerance ${key}`,
        },
        forceUpdate.value,
      )
    }

    if (isAdjust.value) {
      const kanagataData = { [key + 'Shot']: formData.value[key + 'Shot'] }
      kanagataData.totalKanagataShot = formData.value.totalKanagataShot

      if (formData.value.ultrasonicCheck) kanagataData.ultrasonicCheck = false

      await kanagataDashboardStore.update(
        kanagataData,
        {
          ...logData,
          event: `Adjust lifetime or ${key} shot`,
        },
        forceUpdate.value,
      )
    }
  } finally {
    kanagataDashboardStore.resetModal()
    isSubmitting.value = false
  }
}
</script>

<style scoped></style>
