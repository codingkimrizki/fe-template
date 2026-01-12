<template>
  <div>
    <a-flex class="mb-large" justify="space-between" align="center">
      <a-button
        type="primary"
        @click="handleAction('add')"
        :icon="h(PlusCircleOutlined)"
        >New Supplier</a-button
      >
    </a-flex>
    <a-flex
      v-if="!store.supplierList.length"
      justify="center"
      align="center"
      class="empty-wrapper"
    >
      <a-empty description="Empty" />
    </a-flex>
    <template v-else>
      <a-flex vertical :gap="10">
        <a-card
          :bordered="true"
          hoverable
          size="small"
          v-for="supplier in store.supplierList"
          :key="supplier.id"
        >
          <a-flex vertical>
            <a-flex justify="space-between" align="center">
              <span class="medium bold">{{ supplier.name }}</span>
              <a-space size="small">
                <a-button
                  size="small"
                  shape="circle"
                  type="dashed"
                  :icon="h(EditOutlined, { style: { fontSize: '12px' } })"
                  @click="handleAction('update', supplier)"
                />
                <a-button
                  size="small"
                  shape="circle"
                  type="dashed"
                  danger
                  :icon="h(DeleteOutlined, { style: { fontSize: '12px' } })"
                  @click="handleAction('delete', supplier)"
                />
              </a-space>
            </a-flex>
            <a-flex align="center">
              <a-tag color="grey">{{ supplier.location.toUpperCase() }}</a-tag>
              <a-tag class="italic" v-if="supplier.email">
                <a :href="`mailto:${supplier.email}`" class="underline">
                  {{ supplier.email }}
                </a>
              </a-tag>
            </a-flex>
          </a-flex>
        </a-card>
      </a-flex>
    </template>
    <Teleport to="body">
      <BaseModal
        :visible="modal.visible"
        @close="handleClose"
        :modal-title="modal.title"
      >
        <template #body>
          <SupplierForm
            @close="handleClose"
            :data="modal.data"
            :mode="modal.mode"
          />
        </template>
      </BaseModal>
    </Teleport>
  </div>
</template>

<script setup>
import BaseModal from '@/components/base/BaseModal.vue'
import { useSparepartSupplierStore } from '@/stores/sparepartSupplier'
import { capitalizeEachWord } from '@/utils/capitalizeEachWord'
import { PlusCircleOutlined } from '@ant-design/icons-vue'
import { h, ref } from 'vue'
import SupplierForm from './SupplierForm.vue'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons-vue'

const store = useSparepartSupplierStore()

const modal = ref({
  visible: false,
  title: '',
  data: null,
  mode: '',
})

const handleAction = (mode, data = {}) => {
  modal.value = {
    visible: !modal.value.visible,
    title: `${capitalizeEachWord(mode)} Supplier`,
    mode,
    data,
  }
}

const handleClose = () => {
  modal.value.visible = false
  modal.value.mode = null
}
</script>

<style scoped>
.empty-wrapper {
  height: 75vh;
}
</style>
