import dayjs from 'dayjs'

const generateFiscalMonths = year => {
  const start = dayjs(`${year}-04-01`)
  const fiscal = []
  for (let i = 0; i < 12; i++) {
    const ym = start.add(i, 'month')
    fiscal.push(ym.format('YYYY-MM'))
  }
  return fiscal
}

export default generateFiscalMonths
