export function categoryColor(category) {
  if (!category) return 'grey'
  if (category.toLowerCase() == 'machine') return '#41A67E'
  if (category.toLowerCase() == 'kanagata') return '#789DBC'
  if (category.toLowerCase() == 'general') return '#FFA239'
}
