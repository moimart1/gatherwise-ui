import dayjs from 'dayjs'
import Duration from 'dayjs/plugin/duration'
import LocalizedFormat from 'dayjs/plugin/localizedFormat'

dayjs.extend(Duration)
dayjs.extend(LocalizedFormat)

export function isoDateToHuman(isoDate) {
  if (!(isoDate instanceof Date)) isoDate = new Date(isoDate)
  // 'sv' is Swedish that use the format YYYY-MM-DD HH:mm:ss
  return isoDate.toLocaleString('sv', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

export function browserTimeZone() {
  const { timeZone } = Intl.DateTimeFormat().resolvedOptions()
  return timeZone
}

export const dateTime = dayjs
