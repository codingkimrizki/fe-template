<template>
  <a-dropdown :trigger="['contextmenu']">
    <a-card size="small" :hoverable="true" :bordered="true">
      <a-space direction="vertical" :size="0" class="mb-large">
        <span class="x-large bold">MACHINE {{ machineData.id }}</span>
        <a-space :size="0">
          <a-tag class="bold" :color="themeStore.colorPrimary"
            >{{ machineData.brand }} ({{ machineData.tonnage }})</a-tag
          >
          <a-tag
            :class="['bold', machineData.status == 'RUNNING' ? 'run' : 'stop']"
            >{{ machineData.status || 'STOP' }}</a-tag
          >
          <a-tag class="run bold" v-if="machineData.status == 'RUNNING'">
            {{ machineData.productName }}</a-tag
          >
        </a-space>
      </a-space>
      <a-row :gutter="[24, 24]" :wrap="true" align="middle">
        <ShotControl
          title="Injection"
          :shotData="shotData.injection"
          :id="machineData.id"
          type="machine"
        />
        <ShotControl
          title="Zclean"
          :shotData="shotData.zclean"
          :id="machineData.id"
          type="machine"
        />
      </a-row>
    </a-card>
    <template #overlay>
      <a-menu>
        <a-menu-item @click="openLog">
          <a-space size="small">
            <HistoryOutlined />
            <span>Log Action</span>
          </a-space>
        </a-menu-item>
        <a-menu-item @click="openSparepartControlled">
          <a-space size="small">
            <Wrench :size="14" />
            <span>Sparepart</span>
          </a-space>
        </a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
</template>

<script setup>
import ShotControl from '@/views/dashboard/machine/component/ShotControl.vue'
import { useMachineDashboardStore } from '@/stores/machineDashboard'
import { computed } from 'vue'
import { HistoryOutlined } from '@ant-design/icons-vue'
import { useThemeStore } from '@/stores/theme'
import { Wrench } from 'lucide-vue-next'

const themeStore = useThemeStore()
const machineDashboardStore = useMachineDashboardStore()

const props = defineProps({
  machineData: { type: Object, required: true },
})

const shotData = computed(() =>
  machineDashboardStore.getShotData(props.machineData.id),
)

const openLog = () => {
  machineDashboardStore.modal = {
    visible: true,
    mode: 'Log Action',
    idMachine: props.machineData.id,
    shotType: null,
  }
}

const openSparepartControlled = () => {
  machineDashboardStore.drawer = {
    visible: true,
    mode: 'sparepartControlled',
    machineId: props.machineData.id,
  }
}
</script>

<style scoped></style>
