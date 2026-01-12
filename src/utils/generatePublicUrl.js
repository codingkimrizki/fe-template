export function generatePublicUrl(relativePath) {
  if (!relativePath) return null

  const baseUrl = import.meta.env.VITE_BACKEND_PUBLIC_URL

  // Pastikan tidak ada double slash (//)
  const normalizedBase = baseUrl.replace(/\/+$/, '')
  const normalizedPath = relativePath.replace(/^\/+/, '')

  return `${normalizedBase}/${normalizedPath}`
}
