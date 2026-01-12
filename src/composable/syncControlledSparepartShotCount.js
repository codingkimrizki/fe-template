import { useMachineDashboardStore } from '@/stores/machineDashboard'
import { useKanagataDashboardStore } from '@/stores/kanagataDashboard'

export function syncControlledSparepartShotCount(topic, payload) {
  if (!topic.includes('/out')) return

  let parsed
  try {
    parsed = JSON.parse(payload)
  } catch (error) {
    return console.warn('Invalid JSON payload : ', error)
  }

  if (parsed.type !== 'running') return

  const machineStore = useMachineDashboardStore()
  const kanagataStore = useKanagataDashboardStore()
  const { machine, kanagata } = parsed.data

  if (machine.machineId === machineStore.detailMachine.id) {
    const diffShot =
      machine.injectionShot - machineStore.detailMachine.injectionShot

    // Increment nilai store setiap ada payload masuk
    machineStore.detailMachine.injectionShot++

    machineStore.detailMachine.controlledSparepart?.forEach(
      s => (s.shotCount += diffShot),
    )
  }

  if (kanagata.kanagataId === kanagataStore.detailKanagata.id) {
    const diffShot =
      kanagata.kanagataShot - kanagataStore.detailKanagata.kanagataShot

    // Increment nilai store setiap ada payload masuk
    kanagataStore.detailKanagata.kanagataShot++

    kanagataStore.detailKanagata.controlledSparepart?.forEach(
      s => (s.shotCount += diffShot),
    )
  }
}
