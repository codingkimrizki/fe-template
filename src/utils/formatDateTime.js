import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)

export function formatDateTime(datetime, format = 'YYYY-MM-DD HH:mm:ss', tz) {
  if (!datetime) return ''

  // jika tidak diberi timezone manual → ambil dari browser client
  const clientTz = tz || Intl.DateTimeFormat().resolvedOptions().timeZone

  return dayjs(datetime).tz(clientTz).format(format)
}
