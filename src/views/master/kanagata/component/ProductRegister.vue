<template>
  <Teleport to="body">
    <BaseModal
      @close="productRegisterStore.$reset()"
      :visible="productRegisterStore.modal.visible"
      :width="800"
    >
      <template #title>
        <span class="x-large">Manage Product</span>
      </template>
      <template #body>
        <a-card size="small" class="mb-large" :bordered="false">
          <a-flex justify="space-between">
            <span class="medium">Kanagata ID</span>
            <span class="medium">{{
              productRegisterStore.detailKanagata.id
            }}</span>
          </a-flex>
          <a-flex justify="space-between">
            <span class="medium">Name</span>
            <span class="medium">{{
              productRegisterStore.detailKanagata.name
            }}</span>
          </a-flex>
        </a-card>

        <div class="transfer-container mb-large">
          <a-transfer
            v-model:target-keys="targetKeys"
            :data-source="transferDataSource"
            :titles="['Unregistered Products', 'Registered Products']"
            :render="item => `${item.title}`"
            :show-search="true"
            :filter-option="filterOption"
            @change="handleTransferChange"
            :loading="loading"
            :disabled="loading"
            style="width: 100%"
          >
            <template #operations="{ direction }">
              <span v-if="direction === 'right'">Register</span>
              <span v-else>Unregister</span>
            </template>
          </a-transfer>
        </div>
        <a-flex justify="flex-end" gap="small">
          <!-- <a-button @click="productRegisterStore.$reset()">Cancel</a-button> -->
          <a-button
            type="primary"
            @click="updateProductRegister"
            :loading="loading"
            >Save Changes</a-button
          >
        </a-flex>
      </template>
    </BaseModal>
  </Teleport>
</template>

<script setup>
import BaseModal from '@/components/base/BaseModal.vue'
import { useProductRegisterStore } from '@/stores/productRegister'
import { useProductStore } from '@/stores/product'
import { watch, ref, computed } from 'vue'
import { message } from 'ant-design-vue'

const productRegisterStore = useProductRegisterStore()
const productStore = useProductStore()

const targetKeys = ref([])
const loading = ref(false)

// Convert product options to transfer data format
const transferDataSource = computed(() => {
  return productStore.productOptions.map(product => ({
    key: product.value.toString(),
    title: `${product.label}`,
    disabled: false,
  }))
})

// Initialize targetKeys when detailKanagata is loaded
watch(
  () => productRegisterStore.detailKanagata.registeredProduct,
  registeredProducts => {
    if (registeredProducts) {
      targetKeys.value = registeredProducts.map(product =>
        product.id.toString(),
      )
    }
  },
  { immediate: true },
)

// Fetch product options when modal becomes visible
watch(
  () => productRegisterStore.modal.visible,
  async visible => {
    if (visible) {
      loading.value = true
      await productRegisterStore.getDetailKanagata()
      await productStore.getProductOptions()
      loading.value = false
    } else {
      // Reset data when modal is closed
      targetKeys.value = []
    }
  },
)

// Filter function for search
const filterOption = (inputValue, option) => {
  return option.title.toLowerCase().includes(inputValue.toLowerCase())
}

// Handle transfer change
const handleTransferChange = (newTargetKeys, direction, moveKeys) => {
  targetKeys.value = newTargetKeys
  if (direction === 'right') {
    message.success(`Registered ${moveKeys.length} product(s)`)
  } else if (direction === 'left') {
    message.warning(`Unregistered ${moveKeys.length} product(s)`)
  }
}

// Update product registration
const updateProductRegister = async () => {
  loading.value = true
  await productRegisterStore.updateProductRegister(targetKeys.value)
  await productRegisterStore.getDetailKanagata()
  loading.value = false
}
</script>

<style scoped>
.transfer-container {
  min-height: 400px;
}

:deep(.ant-transfer-list) {
  width: 100%;
  height: 400px;
}

/* Make scrollbar track transparent */
:deep(.ant-transfer-list-content::-webkit-scrollbar) {
  width: 10px;
}

:deep(.ant-transfer-list-content::-webkit-scrollbar-track) {
  background: transparent;
}

:deep(.ant-transfer-list-content::-webkit-scrollbar-thumb) {
  background-color: rgba(105, 105, 105, 0.8);
  border-radius: 8px;
}

:deep(.ant-transfer-list-content::-webkit-scrollbar-thumb:hover) {
  background-color: rgba(0, 0, 0, 0.3);
}

/* Make transfer operation buttons have transparent background */
:deep(.ant-transfer-operation) {
  align-self: center;
}

:deep(.ant-transfer-operation .ant-btn) {
  background: transparent;
  border: 1px solid #d9d9d9;
  margin-bottom: 8px;
}

:deep(.ant-transfer-operation .ant-btn:hover) {
  background: rgba(0, 0, 0, 0.03);
}

:deep(.ant-transfer-operation .ant-btn:disabled) {
  background: transparent;
  opacity: 0.5;
  cursor: not-allowed;
}

:deep(.ant-transfer-list-content-item) {
  padding: 8px 12px;
}
</style>
