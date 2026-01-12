<template>
  <Teleport to="body">
    <BaseDrawer
      title="Sparepart Controlled"
      :open="dashboardStore.drawer.visible"
      @close="handleClose"
    >
      <a-flex align="end" class="mb-large">
        <a-tag class="bold" :color="themeStore.colorPrimary"
          >MACHINE {{ machineData.id }}</a-tag
        >
        <a-tag class="bold" color="grey"
          >{{ machineData.brand }} ({{ machineData.tonnage }})</a-tag
        >
      </a-flex>
      <a-flex
        vertical
        gap="small"
        v-if="machineData.controlledSparepart?.length"
      >
        <a-card
          :bordered="false"
          size="small"
          v-for="(data, index) in machineData.controlledSparepart"
          :key="index"
        >
          <a-descriptions class="compact-desc" bordered :column="2">
            <a-descriptions-item label="Name" :span="2" class="ellipsis-text">{{
              data.sparepartName
            }}</a-descriptions-item>
            <a-descriptions-item label="Shot" :span="2">{{
              formatThousandSeparator(data.shotCount)
            }}</a-descriptions-item>
            <a-descriptions-item label="Installed At">
              <a-tag :color="themeStore.colorPrimary">
                {{ formatDateTime(data.createdAt, 'YYYY-MM-DD') }}
              </a-tag>
            </a-descriptions-item>
            <a-descriptions-item label="Lifetime">
              {{ lifetime(data.createdAt) }} Days
            </a-descriptions-item>
            <a-descriptions-item label="Note" :span="2" v-if="data.note">
              {{ data.note }}
            </a-descriptions-item>
            <a-descriptions-item label="Action" v-if="!authStore.isUser">
              <a-space size="small">
                <a-tooltip title="Stop" placement="bottom">
                  <a-popconfirm
                    title="Are you sure stop control shot count for this part ?"
                    @confirm="handleAction('end', data)"
                  >
                    <a-button type="dashed" size="small" shape="circle">
                      <CloseCircleOutlined />
                    </a-button>
                  </a-popconfirm>
                </a-tooltip>
                <a-tooltip title="Remove" placement="bottom">
                  <a-popconfirm
                    v-if="authStore.isAdmin"
                    title="Are you sure remove this part from controlled part ?"
                    @confirm="handleAction('remove', data)"
                  >
                    <a-button danger type="dashed" shape="circle" size="small">
                      <DeleteOutlined />
                    </a-button>
                  </a-popconfirm>
                </a-tooltip>
              </a-space>
            </a-descriptions-item>
          </a-descriptions>
        </a-card>
      </a-flex>
      <div class="empty" v-else>
        <BaseEmpty description="No Controlled Sparepart" />
      </div>
    </BaseDrawer>
  </Teleport>
</template>

<script setup>
import BaseDrawer from '@/components/base/BaseDrawer.vue'
import { useMachineDashboardStore } from '@/stores/machineDashboard'
import { useThemeStore } from '@/stores/theme'
import { formatDateTime } from '@/utils/formatDateTime'
import { formatThousandSeparator } from '@/utils/formatterInputNumber'
import { watch } from 'vue'
import { DeleteOutlined, CloseCircleOutlined } from '@ant-design/icons-vue'
import { useSparepartControlledStore } from '@/stores/sparepartControlled'
import BaseEmpty from '@/components/base/BaseEmpty.vue'
import { useAuthStore } from '@/stores/auth'
import dayjs from 'dayjs'
import { storeToRefs } from 'pinia'

const authStore = useAuthStore()
const sparepartControlledStore = useSparepartControlledStore()
const dashboardStore = useMachineDashboardStore()
const themeStore = useThemeStore()

const { detailMachine: machineData } = storeToRefs(dashboardStore)

const handleClose = () => {
  dashboardStore.resetDrawer()
}

const handleAction = async (action, data) => {
  const { stockId } = data
  if (action === 'end') {
    await sparepartControlledStore.update(
      stockId,
      machineData.value.id,
      'machine',
      { finishedAt: dayjs() },
    )
    await dashboardStore.getDetail(machineData.value.id)
  }
  if (action === 'remove') {
    await sparepartControlledStore.delete(
      stockId,
      machineData.value.id,
      'machine',
    )
    await dashboardStore.getDetail(machineData.value.id)
  }
}

const lifetime = target => {
  return dayjs().startOf('day').diff(dayjs(target).startOf('day'), 'day')
}

watch(
  () => dashboardStore.drawer.machineId,
  async newId => {
    if (!newId) return
    await dashboardStore.getDetail(newId)
  },
)
</script>

<style scoped>
:deep(.ant-descriptions-item-content).ellipsis-text {
  max-width: 260px;
}

.compact-desc :deep(.ant-descriptions-item-label),
.compact-desc :deep(.ant-descriptions-item-content) {
  padding: 5px 15px !important;
}

.empty {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80%;
}
</style>
