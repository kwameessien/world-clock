// All time maths goes through Intl with IANA zones, so daylight saving is
// always right. Nothing here stores a fixed UTC offset.

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const formatters = new Map()

function partsFormatter(tz) {
  if (!formatters.has(tz)) {
    formatters.set(tz, new Intl.DateTimeFormat('en-GB', {
      timeZone: tz,
      hourCycle: 'h23',
      weekday: 'short',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    }))
  }
  return formatters.get(tz)
}

/** Wall-clock parts of `date` in `tz`, plus its UTC offset in minutes. */
export function zoned(date, tz) {
  const p = {}
  for (const { type, value } of partsFormatter(tz).formatToParts(date)) p[type] = value
  const year = Number(p.year), month = Number(p.month), day = Number(p.day)
  const hour = Number(p.hour) % 24, minute = Number(p.minute), second = Number(p.second)
  const asUtc = Date.UTC(year, month - 1, day, hour, minute, second)
  const offset = Math.round((asUtc - Math.floor(date.getTime() / 1000) * 1000) / 60000)
  return {
    year, month, day, hour, minute, second, offset,
    weekday: WEEKDAYS.indexOf(p.weekday),
    dayNumber: Math.floor(Date.UTC(year, month - 1, day) / 86400000),
    hours: hour + minute / 60 + second / 3600,
  }
}

const pad = (n) => String(n).padStart(2, '0')

export function formatClock(hour, minute, use12h) {
  if (!use12h) return `${pad(hour)}:${pad(minute)}`
  return `${hour % 12 === 0 ? 12 : hour % 12}:${pad(minute)} ${hour < 12 ? 'am' : 'pm'}`
}

/** Hour label for dial numerals and table headers. */
export function formatHour(hour, use12h) {
  if (!use12h) return pad(hour)
  const h = hour % 12 === 0 ? 12 : hour % 12
  return hour % 6 === 0 ? `${h}${hour < 12 ? 'am' : 'pm'}` : String(h)
}

const MINUS = '−'

function formatMinutes(total, unit) {
  const sign = total < 0 ? MINUS : '+'
  const abs = Math.abs(total)
  const h = Math.floor(abs / 60), m = abs % 60
  return `${sign}${h}${m ? `:${pad(m)}` : ''}${unit}`
}

export const formatUtcOffset = (offset) => `UTC${formatMinutes(offset, '')}`
export const formatDiff = (minutes) => formatMinutes(minutes, ' h')

/** "already tomorrow", "same day", "still yesterday" relative to home. */
export function dayRelation(dayDelta) {
  if (dayDelta > 0) return 'already tomorrow'
  if (dayDelta < 0) return 'still yesterday'
  return 'same day'
}

export function zoneName(date, tz) {
  const part = new Intl.DateTimeFormat('en-GB', { timeZone: tz, timeZoneName: 'long' })
    .formatToParts(date).find((p) => p.type === 'timeZoneName')
  return part ? part.value : tz
}

export const formatShortDate = (date, tz) =>
  new Intl.DateTimeFormat('en-GB', { timeZone: tz, weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
    .format(date).replace(/,/g, '')

export const formatLongDate = (date, tz) =>
  new Intl.DateTimeFormat('en-GB', { timeZone: tz, weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
    .format(date).replace(/,/g, '')

export const weekdayName = (weekday) =>
  ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][weekday]
