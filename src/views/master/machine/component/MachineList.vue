<template>
  <BaseTable
    :add-action="false"
    :bordered="true"
    v-model:search="machineStore.filter.search"
    size="small"
    :columns="columns"
    :data="machineStore.machineList"
    :pagination="pagination"
    :loading="loading"
    :scroll="{ y: 'calc(100vh - 450px)', x: 'max-content' }"
    @change="onTableChange"
  >
    <!-- SLOT STATUS -->
    <template #status="{ text, record }">
      <a-button
        v-if="text === 'major'"
        type="primary"
        danger
        size="small"
        @click="handleAction(record)"
      >
        MAJOR
      </a-button>

      <a-button v-else-if="text === 'clear'" type="primary" size="small">
        NO ISSUES
      </a-button>

      <span v-else>-</span>
    </template>
  </BaseTable>
  <Teleport to="body">
    <BaseModal
      :visible="modal.visible"
      @close="handleClose"
      :modalTitle="modal.title"
    >
      <template #body>
        <div v-if="modal.data?.answers?.length">
          <a-table
            :columns="modalColumns"
            :data-source="modal.data.answers"
            :pagination="false"
            row-key="id_questions"
            bordered
            size="small"
          />
        </div>
        <div v-else>
          <p>No answers 'Y' for this IP & date.</p>
        </div>
      </template>
    </BaseModal>
  </Teleport>
</template>

<script setup>
import BaseTable from '@/components/base/BaseTable.vue'
import BaseModal from '@/components/base/BaseModal.vue'
import { ref, computed, onMounted, watch } from 'vue'
import { debounce } from 'lodash-es'
import { useTabelAnswersStore } from '@/stores/tabelAnswers'
import { useAnswersStore } from '@/stores/answers'

const machineStore = useTabelAnswersStore()
const answersStore = useAnswersStore()
const loading = ref(false)

const pagination = computed(() => ({
  current: machineStore.pagination.page,
  pageSize: machineStore.pagination.pageSize,
  total: machineStore.pagination.total,
  showSizeChanger: true,
  pageSizeOptions: ['10', '20', '50'],
}))

const columns = [
  {
    title: 'No',
    dataIndex: 'no',
    key: 'no',
    width: 80,
  },
  {
    title: 'Device IP Address',
    dataIndex: 'ipAddress',
    key: 'ipAddress',
    width: 200,
  },
  {
    title: 'Date',
    dataIndex: 'date',
    key: 'date',
    width: 120,
  },
  {
    title: 'Time',
    dataIndex: 'time',
    key: 'time',
    width: 120,
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    width: 120,
  },
]

const modalColumns = [
  {
    title: 'Questions',
    dataIndex: 'question_text',
    key: 'question_text',
    ellipsis: false, // jangan di-truncate
    customCell: () => ({
      style: { whiteSpace: 'normal', wordBreak: 'break-word' },
    }),
  },
  {
    title: 'Answers',
    dataIndex: 'answer',
    key: 'answer',
    width: 120,
    align: 'center',
    customRender: ({ text }) => {
      if (text === 'Y') return 'Ya'
      if (text === 'N') return 'Tidak'
      return text
    },
  },
]

const onTableChange = async ({ pagination: pag, sorter }) => {
  machineStore.filter.sortBy = sorter.field
  machineStore.filter.order = sorter.order === 'ascend' ? 'asc' : 'desc'
  machineStore.pagination.page = pag.current
  machineStore.pagination.pageSize = pag.pageSize
  await machineStore.get()
}

const debounceFetch = debounce(async () => {
  machineStore.pagination.page = 1
  loading.value = true
  await machineStore.get()
  loading.value = false
}, 500)

watch(
  [() => machineStore.filter.search, () => machineStore.filter.showDeleted],
  () => debounceFetch(),
  { deep: true },
)

onMounted(async () => {
  loading.value = true
  await machineStore.get()
  await answersStore.fetchAnswers()
  await answersStore.fetchQuestions()
  loading.value = false
})

const modal = ref({
  visible: false,
  title: '',
  data: null, // data baris yang diklik
})

const handleAction = async (record = null) => {
  modal.value.visible = true
  modal.value.title = 'Major Alert'

  // default modal data
  modal.value.data = {
    ...record,
    answers: [],
  }

  // Filter jawaban 'Y' untuk IP dan tanggal yang sama
  const filteredAnswers = answersStore.answers
    .filter(
      a =>
        a.ipAddress === record.ipAddress &&
        a.createdAt.slice(0, 10) === record.date &&
        a.answer === 'Y',
    )
    .map(a => {
      // cari question_text
      const q = answersStore.questions.find(
        q => q.id_questions === a.id_questions,
      )
      return {
        ...a,
        question_text: q ? q.question_text : 'Unknown question',
      }
    })

  modal.value.data.answers = filteredAnswers
  console.log('Filtered answers:', filteredAnswers)
}

const handleClose = () => {
  modal.value.visible = false
  modal.value.data = null
  modal.value.title = ''
}
</script>
