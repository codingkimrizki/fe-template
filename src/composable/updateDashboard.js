import { useMachineDashboardStore } from '@/stores/machineDashboard'
import { useKanagataDashboardStore } from '@/stores/kanagataDashboard'
import dayjs from 'dayjs'

export function updateDashboard(topic, payload) {
  if (!topic.includes('/out')) return

  let parsed
  try {
    parsed = JSON.parse(payload)
  } catch {
    return console.warn('Invalid JSON payload:', payload)
  }

  if (parsed.type !== 'running' && parsed.type !== 'stop') return

  const machineStore = useMachineDashboardStore()
  const kanagataStore = useKanagataDashboardStore()
  const { machine, kanagata } = parsed.data
  const now = dayjs().toISOString()

  // helper update item di store list
  const updateItem = (list, idKey, newData) => {
    const index = list.findIndex(i => i.id == idKey)
    if (index === -1) return
    list[index] = { ...list[index], ...newData, updatedAt: now }
  }

  // update machine dan kanagata
  updateItem(machineStore.machineList, machine.machineId, {
    zcleanShot: machine.zcleanShot,
    injectionShot: machine.injectionShot,
    status: parsed.type.toUpperCase(),
    productName: kanagata.productName,
  })

  updateItem(kanagataStore.kanagataList, kanagata.kanagataId, {
    kanagataShot: kanagata.kanagataShot,
    totalKanagataShot: kanagata.totalKanagataShot,
    status: parsed.type.toUpperCase(),
    onMachine: machine.machineId,
    productName: kanagata.productName,
  })
}
