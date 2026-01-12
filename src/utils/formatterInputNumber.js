/**
 * Memformat angka menjadi string dengan pemisah ribuan dan desimal.
 * Contoh: 1234567.89 -> "1.234.567,89"
 * @param {Number | String} value Angka yang akan diformat
 * @param {String} separator Pemisah ribuan (default: '.')
 * @returns {String} String yang sudah diformat
 */
export function formatThousandSeparator(value, separator = '.') {
  // Pastikan nilai adalah angka atau string yang bisa dikonversi
  if (value === null || value === undefined) return ''

  const stringValue = String(value)
  const parts = stringValue.split('.')

  // Format bagian integer dengan pemisah ribuan
  const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, separator)

  // Tambahkan kembali bagian desimal, ganti titik dengan koma
  if (parts.length > 1) {
    return `${integerPart},${parts[1]}`
  }

  return integerPart
}

/**
 * Mengonversi string format ribuan dan desimal kembali menjadi angka.
 * Contoh: "1.234.567,89" -> 1234567.89
 * @param {String} value String yang akan di-parsing
 * @param {String} separator Pemisah ribuan (default: '.')
 * @returns {Number} Angka yang sudah di-parsing
 */
export function parseThousandSeparator(value, separator = '.') {
  if (value === null || value === undefined || value === '') {
    return 0
  }

  // Hapus semua pemisah ribuan (titik)
  const cleanedValue = value.replace(new RegExp(`\\${separator}`, 'g'), '')

  // Ganti pemisah desimal (koma) dengan titik
  const parsedValue = cleanedValue.replace(',', '.')

  // Konversi string yang sudah bersih ke tipe Number
  return Number(parsedValue)
}
