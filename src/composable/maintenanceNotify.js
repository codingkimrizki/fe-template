import { useMaintenanceNotifyStore } from '@/stores/maintenanceNotify'
import dayjs from 'dayjs'

export function maintenanceNotify(topic, payload) {
  if (!topic.includes('/maintenance-reminder')) return

  let parsed
  try {
    parsed = JSON.parse(payload)
  } catch {
    return console.warn(`Invalid JSON payload from topic : ${topic}`)
  }

  const { type, data } = parsed
  if (!type.includes('maintenance-reminder')) return

  const { machine, kanagata, kanagataRenewal } = data
  const store = useMaintenanceNotifyStore()

  store.machine = machine || []
  store.kanagata = kanagata || []
  store.renewalReminder = kanagataRenewal || []
  store.updatedAt = dayjs().toISOString()
}
