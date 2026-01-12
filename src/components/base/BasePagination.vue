<template>
  <a-pagination
    :current="page"
    :pageSize="pageSize"
    :total="total"
    :show-size-changer="showSizeChanger"
    @change="onPageChange"
    :page-size-options="pageSizeOptions"
    @showSizeChange="onShowSizeChange"
    :simple="simple"
    :show-total="
      (total, range) => `${range[0]} - ${range[1]} of ${total} items`
    "
  />
</template>

<script setup>
const page = defineModel('page', { type: Number, default: 1 })
const pageSize = defineModel('pageSize', { type: Number, default: 10 })
const total = defineModel('total', { type: Number, default: 0 })

defineProps({
  pageSizeOptions: {
    type: Array,
    default: () => ['5', '10', '20', '30', '50'],
  },
  showSizeChanger: {
    type: Boolean,
    default: true,
  },
  simple: {
    type: Boolean,
    default: false,
  },
})

// Tambahkan emit untuk event kustom
const emit = defineEmits(['pageChange', 'pageSizeChange'])

const onPageChange = current => {
  page.value = current
  emit('pageChange', current)
}

const onShowSizeChange = (current, size) => {
  page.value = current
  pageSize.value = size
  emit('pageSizeChange', { current, size })
}
</script>
