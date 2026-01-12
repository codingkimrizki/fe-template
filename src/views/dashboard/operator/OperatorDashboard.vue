<template>
  <div>
    <a-flex justify="space-between" align="center" wrap="wrap" class="mb-small">
      <h1 class="mb-large">Lotfull & Tray Status</h1>
      <span class="x-large"
        >Total : {{ operatorDashboardStore.machineList.length }} Machines</span
      >
    </a-flex>
    <a-spin :spinning="operatorDashboardStore.loading">
      <a-row :gutter="[24, 24]" align="middle" :wrap="true" class="mb-large">
        <a-col
          :xs="24"
          :sm="12"
          :md="8"
          :lg="6"
          :xl="4"
          v-for="machine in operatorDashboardStore.machineList"
          :key="machine.id"
        >
          <a-card size="small" hoverable class="machine-status-card">
            <a-flex vertical :gap="4">
              <a-flex justify="space-between" align="center">
                <span class="x-large bold">MACHINE {{ machine.id }}</span>
                <Settings
                  :size="32"
                  :class="[
                    'settings-icon',
                    machine.status !== 'stop' ? 'spinning' : '',
                  ]"
                  :color="machine.status === 'stop' ? 'grey' : '#2eb85c'"
                />
              </a-flex>
              <a-divider style="margin: 4px 0" />
              <a-flex justify="space-between" align="center">
                <span class="large bold">TRAY</span>
                <a-tag
                  class="large bold"
                  :color="formatColorYellowTrayStatus(machine.yellowTrayStatus)"
                  >{{ formatYellowTrayStatus(machine.yellowTrayStatus) }}</a-tag
                >
              </a-flex>
              <a-flex justify="space-between" align="center">
                <span class="large bold">LOTFULL</span>
                <a-tooltip
                  :title="machine.isLotfull ? 'Yes' : 'No'"
                  placement="bottom"
                >
                  <div
                    class="toggle-circle"
                    :class="machine.isLotfull ? 'active' : 'inactive'"
                  />
                </a-tooltip>
              </a-flex>
            </a-flex>
          </a-card>
        </a-col>
      </a-row>
    </a-spin>
    <VoiceSetting />
    <MapLayout />
  </div>
</template>

<script setup>
import { useOperatorDashboardStore } from '@/stores/operatorDashboard'
import { onMounted, onUnmounted } from 'vue'
import { useMqttStore } from '@/stores/mqttWebsocket'
import { useVoiceStore } from '@/stores/voice'
import { Settings } from 'lucide-vue-next'
import MapLayout from './components/MapLayout.vue'
import VoiceSetting from './components/VoiceSetting.vue'

const voiceStore = useVoiceStore()
const mqttStore = useMqttStore()
const operatorDashboardStore = useOperatorDashboardStore()

let intervalVoice = null

const updateDashboard = async () => {
  operatorDashboardStore.loading = true
  await operatorDashboardStore.get()
  operatorDashboardStore.loading = false
}

onMounted(async () => {
  await voiceStore.initVoices()
  await mqttStore.connect()
  await updateDashboard()

  intervalVoice = setInterval(() => {
    const message = operatorDashboardStore.generateTTSMessage
    if (message) voiceStore.speak(message)
  }, 15000)
})

onUnmounted(() => {
  mqttStore.disconnect()
  mqttStore.$reset()
  operatorDashboardStore.$reset()
  if (intervalVoice) clearInterval(intervalVoice)
})

const formatColorYellowTrayStatus = status => {
  if (!status) return '#2eb85c'
  if (status.includes('last')) return '#f56c6c'
  if (['start', 'ongoing'].includes(status)) return '#FCB53B'
}

const formatYellowTrayStatus = status => {
  if (!status) return 'NORMAL'
  if (status.includes('last')) return 'UNLOAD'
  return status.toUpperCase()
}
</script>

<style scoped>
/* Settings Icon */
.settings-icon {
  transition: color 0.3s ease;
  cursor: pointer;
}

.settings-icon.spinning {
  animation: spin 2s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

.toggle-circle {
  width: 25px;
  height: 25px;
  border-radius: 50%;
  transition: background-color 0.2s ease;
  margin-right: 10px;
  position: relative;
  border: 1px solid white;
}

/* Efek beat dentuman */
.toggle-circle.active {
  animation: beat 1.2s infinite ease-in-out;
}

/* Warna */
.toggle-circle.active {
  background-color: #f56c6c;
}

.toggle-circle.inactive {
  background-color: #2eb85c;
}

/* Radiasi (glow pulse) */
.toggle-circle::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  opacity: 0.6;
  transform: scale(1);
  animation: pulse 1.2s infinite ease-out;
}

/* Beat (membesar mengecil) */
@keyframes beat {
  0%,
  100% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.15);
  }
}

/* Radiasi yang melebar keluar */
@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 0.8;
  }

  100% {
    transform: scale(2.2);
    opacity: 0;
  }
}
</style>
