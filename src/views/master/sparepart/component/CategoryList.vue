<template>
  <div>
    <a-flex class="mb-large" justify="space-between" align="center">
      <a-button
        type="primary"
        @click="handleAction('add')"
        :icon="h(PlusCircleOutlined)"
        >New Category</a-button
      >
    </a-flex>
    <a-flex
      v-if="!store.categoryList.length"
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
          v-for="category in store.categoryList"
          :key="category.id"
        >
          <a-flex vertical>
            <a-flex justify="space-between" align="center">
              <a-tag
                class="medium bold"
                :color="categoryColor(category.name)"
                >{{ capitalizeEachWord(category.name) }}</a-tag
              >
              <a-space size="small">
                <a-button
                  size="small"
                  shape="circle"
                  type="dashed"
                  v-if="!disabledAction(category.name)"
                  :icon="h(EditOutlined, { style: { fontSize: '12px' } })"
                  @click="handleAction('update', category)"
                />
                <a-button
                  size="small"
                  shape="circle"
                  type="dashed"
                  danger
                  v-if="!disabledAction(category.name)"
                  :icon="h(DeleteOutlined, { style: { fontSize: '12px' } })"
                  @click="handleAction('delete', category)"
                />
              </a-space>
            </a-flex>
            <span v-if="category.sparepartCount"
              >{{ category.sparepartCount }} Sparepart listed</span
            >
            <span v-else>No sparepart listed</span>
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
          <CategoryForm
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
import { useSparepartCategoryStore } from '@/stores/sparepartCategory'
import { capitalizeEachWord } from '@/utils/capitalizeEachWord'
import { categoryColor } from '@/utils/sparepartCategoryColor'
import { PlusCircleOutlined } from '@ant-design/icons-vue'
import { h, ref } from 'vue'
import CategoryForm from './CategoryForm.vue'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons-vue'

const store = useSparepartCategoryStore()

const modal = ref({
  visible: false,
  title: '',
  data: null,
  mode: '',
})

const handleAction = (mode, data = {}) => {
  modal.value = {
    visible: !modal.value.visible,
    title: `${capitalizeEachWord(mode)} Category`,
    mode,
    data,
  }
}

const disabledAction = category => {
  return ['machine', 'kanagata', 'general'].includes(category)
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
