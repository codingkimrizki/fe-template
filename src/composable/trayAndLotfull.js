import { useOperatorDashboardStore } from '@/stores/operatorDashboard'
import dayjs from 'dayjs'

export function updateOperatorDashboard(topic, payload) {
  if (!topic.includes('/out')) return

  let parsed
  try {
    parsed = JSON.parse(payload)
  } catch {
    return console.warn(`Invalid JSON payload from topic : ${topic}`)
  }

  const { type, data } = parsed
  if (
    !['yellow tray', 'lotfull', 'stop', 'running'].some(keyword =>
      type.includes(keyword),
    )
  )
    return

  const { machine, kanagata } = data
  const store = useOperatorDashboardStore()

  // helper function for search data and update di store list
  const updateItem = (list, idKey, newData) => {
    const index = list.findIndex(i => i.id == idKey)
    if (index === -1) return
    list[index] = {
      ...list[index],
      ...newData,
      updatedAt: dayjs().toISOString(),
    }
  }

  let newData

  if (['stop', 'running'].includes(type)) {
    newData = {
      status: type,
    }
  }

  if (type.includes('yellow tray')) {
    const shouldReset = type.includes('end') || type.includes('abort')
    newData = {
      yellowTrayStatus: shouldReset ? null : type.split(' ')[2],
      countTray: kanagata.countTray,
    }
  }

  if (type.includes('lotfull')) {
    const isLotfull = type === 'lotfull'
    newData = {
      isLotfull,
      countTray: kanagata.countTray,
    }
  }

  updateItem(store.machineList, machine.machineId, newData)
}
