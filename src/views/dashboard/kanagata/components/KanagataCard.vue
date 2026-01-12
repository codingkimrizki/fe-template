<template>
  <a-dropdown :trigger="['contextmenu']">
    <a-card size="small" :hoverable="true" :bordered="true">
      <a-flex justify="space-between" class="mb-large" align="top" gap="small">
        <a-space direction="vertical" :size="0">
          <span class="large bold">{{ kanagataData.name }}</span>
          <a-space :size="0">
            <a-tag class="bold" :color="themeStore.colorPrimary">
              {{ kanagataData.id }}</a-tag
            >
            <a-tag
              class="bold"
              :class="kanagataData.status?.includes('RUNNING') ? 'run' : 'stop'"
            >
              {{
                kanagataData.status
                  ? `${kanagataData.status} [${kanagataData.onMachine}]`
                  : 'STOP'
              }}
            </a-tag>
            <a-tag class="bold run" v-if="kanagataData.status == 'RUNNING'">{{
              kanagataData.productName
            }}</a-tag>
          </a-space>
        </a-space>
      </a-flex>
      <a-row :gutter="[16, 16]" :wrap="true" align="middle">
        <ShotControl
          :shot-data="shotData"
          type="kanagata"
          title="Kanagata"
          :id="kanagataData.id"
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
import { useThemeStore } from '@/stores/theme'
import { useKanagataDashboardStore } from '@/stores/kanagataDashboard'
import { HistoryOutlined } from '@ant-design/icons-vue'
import { Wrench } from 'lucide-vue-next'
import ShotControl from './ShotControl.vue'
import { computed } from 'vue'

const kanagataDashboardStore = useKanagataDashboardStore()
const themeStore = useThemeStore()

const props = defineProps({
  kanagataData: {
    type: Object,
    required: true,
  },
})

const openLog = () => {
  kanagataDashboardStore.modal = {
    visible: true,
    mode: 'Log Action',
    idKanagata: props.kanagataData.id,
    shotType: null,
  }
}

const openSparepartControlled = () => {
  kanagataDashboardStore.drawer = {
    visible: true,
    mode: 'Sparepart Controlled',
    kanagataId: props.kanagataData.id,
  }
}

const shotData = computed(() =>
  kanagataDashboardStore.getShotData(props.kanagataData.id),
)
</script>

<style scoped></style>
