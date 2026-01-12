<template>
  <a-form layout="vertical" :model="formData" @finish="handleSubmit">
    <a-row :gutter="[24, 24]" align="top">
      <a-col :flex="1" v-show="isInjection">
        <a-form-item
          label="Injection Shot"
          v-show="!isSetting"
          name="injectionShot"
          :validate-trigger="['blur', 'change']"
        >
          <a-input-number
            :disabled="isReset"
            :controls="false"
            :min="0"
            placeholder="Enter a number"
            v-model:value="formData.injectionShot"
            :formatter="value => formatThousandSeparator(value)"
            :parser="value => parseThousandSeparator(value)"
            autocomplete="off"
          />
        </a-form-item>
        <a-form-item
          v-show="isSetting"
          label="Overshot Injection"
          name="targetInjection"
          :validate-trigger="['blur', 'change']"
        >
          <a-input-number
            :controls="false"
            :min="0"
            placeholder="Enter a number"
            v-model:value="formData.targetInjection"
            autocomplete="off"
            :formatter="value => formatThousandSeparator(value)"
            :parser="value => parseThousandSeparator(value)"
          />
        </a-form-item>
        <a-form-item
          v-show="isSetting"
          label="Tolerance Injection"
          name="toleranceInjection"
          :validate-trigger="['blur', 'change']"
        >
          <a-input-number
            :controls="false"
            :min="0"
            placeholder="Enter a number"
            v-model:value="formData.toleranceInjection"
            autocomplete="off"
            :formatter="value => formatThousandSeparator(value)"
            :parser="value => parseThousandSeparator(value)"
          />
        </a-form-item>
      </a-col>
      <a-col :flex="1" v-show="isZclean">
        <a-form-item
          v-show="!isSetting"
          label="Zclean Shot"
          name="zcleanShot"
          :validate-trigger="['blur', 'change']"
        >
          <a-input-number
            :disabled="isReset"
            :controls="false"
            :min="0"
            placeholder="Enter a number"
            v-model:value="formData.zcleanShot"
            autocomplete="off"
            :formatter="value => formatThousandSeparator(value)"
            :parser="value => parseThousandSeparator(value)"
          />
        </a-form-item>
        <a-form-item
          v-show="isSetting"
          label="Overshot Zclean"
          name="targetZclean"
          :validate-trigger="['blur', 'change']"
        >
          <a-input-number
            :controls="false"
            :min="0"
            placeholder="Enter a number"
            v-model:value="formData.targetZclean"
            autocomplete="off"
            :formatter="value => formatThousandSeparator(value)"
            :parser="value => parseThousandSeparator(value)"
          />
        </a-form-item>
        <a-form-item
          v-show="isSetting"
          label="Tolerance Zclean"
          name="toleranceZclean"
          :validate-trigger="['blur', 'change']"
        >
          <a-input-number
            :controls="false"
            :min="0"
            placeholder="Enter a number"
            v-model:value="formData.toleranceZclean"
            autocomplete="off"
            :formatter="value => formatThousandSeparator(value)"
            :parser="value => parseThousandSeparator(value)"
          />
        </a-form-item>
      </a-col>
    </a-row>
    <a-alert
      v-if="isAdjust || isReset"
      message="WARNING"
      description="Adjust shot can make impact on invalid data, please check before continue."
      type="warning"
      show-icon
      class="mb-large"
    />
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
import {
  formatThousandSeparator,
  parseThousandSeparator,
} from '@/utils/formatterInputNumber'
import { computed, ref, watch } from 'vue'
import { useMachineDashboardStore } from '@/stores/machineDashboard'
import { useAuthStore } from '@/stores/auth'
import { capitalizeEachWord } from '@/utils/capitalizeEachWord'

const authStore = useAuthStore()
const machineDashboardStore = useMachineDashboardStore()

// ambil data machine dari store
const machine = computed(() =>
  machineDashboardStore.getMachineById(machineDashboardStore.modal.idMachine),
)

const isSubmitting = ref(false)
const isZclean = computed(
  () => machineDashboardStore.modal.shotType === 'Zclean',
)
const isInjection = computed(
  () => machineDashboardStore.modal.shotType === 'Injection',
)
const isSetting = computed(() => machineDashboardStore.modal.mode === 'Setting')
const isReset = computed(() => machineDashboardStore.modal.mode === 'Reset')
const isAdjust = computed(() => machineDashboardStore.modal.mode === 'Adjust')

const forceUpdate = ref(false)

const formData = ref({
  injectionShot: 0,
  zcleanShot: 0,
  targetInjection: 0,
  targetZclean: 0,
  toleranceInjection: 0,
  toleranceZclean: 0,
})

const initializeFormData = () => {
  // Reset form data to defaults
  if (machine.value) {
    formData.value = {
      injectionShot: machine.value.injectionShot || 0,
      zcleanShot: machine.value.zcleanShot || 0,
      targetInjection: machine.value.targetInjection || 0,
      targetZclean: machine.value.targetZclean || 0,
      toleranceInjection: machine.value.toleranceInjection || 0,
      toleranceZclean: machine.value.toleranceZclean || 0,
    }
  } else {
    formData.value = {
      injectionShot: 0,
      zcleanShot: 0,
      targetInjection: 0,
      targetZclean: 0,
      toleranceInjection: 0,
      toleranceZclean: 0,
    }
  }
}

watch(
  () => machineDashboardStore.modal.idMachine,
  () => initializeFormData(),
  { immediate: true },
)

const handleSubmit = async () => {
  isSubmitting.value = true

  const key = machineDashboardStore.modal.shotType.toLowerCase()
  const logData = {
    machineId: machineDashboardStore.modal.idMachine,
    userId: authStore.user.id,
  }

  if (isReset.value) {
    const machineData = { [key + 'Shot']: 0 }
    await machineDashboardStore.update(
      machineData,
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
    const machineData = {
      [target]: formData.value[target],
      [tolerance]: formData.value[tolerance],
    }
    await machineDashboardStore.update(
      machineData,
      {
        ...logData,
        event: `Setting target and tolerance ${key}`,
      },
      forceUpdate.value,
    )
  }

  if (isAdjust.value) {
    const machineData = { [key + 'Shot']: formData.value[key + 'Shot'] }
    await machineDashboardStore.update(
      machineData,
      {
        ...logData,
        event: `Adjust ${key}`,
      },
      forceUpdate.value,
    )
  }
  machineDashboardStore.resetModal()
  isSubmitting.value = false
}
</script>

<style scoped></style>
