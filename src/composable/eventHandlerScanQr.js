import { ref } from 'vue'
import { useEventListener } from '@vueuse/core'

export function useBarcodeScanner(options = {}) {
  const {
    threshold = 50, // max jeda antar karakter (ms)
    onScan = null, // callback ketika scan selesai
  } = options

  const scanned = ref('')

  let buffer = ''
  let lastTime = Date.now()

  useEventListener('keydown', e => {
    const now = Date.now()

    // Jika jarak antar keydown cepat → dianggap barcode scanner
    if (now - lastTime < threshold) {
      buffer += e.key
    } else {
      buffer = e.key
    }

    lastTime = now

    // Scanner biasanya mengirim Enter di akhir
    if (e.key === 'Enter') {
      const result = buffer.replace('Enter', '')

      scanned.value = result

      if (onScan) onScan(result)

      buffer = ''
    }
  })

  return {
    scanned,
  }
}
