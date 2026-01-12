// utils/capitalizeEachWord.js
export function capitalizeEachWord(str) {
  if (!str || typeof str !== 'string') return ''

  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}
