import { zoned, formatClock, formatDiff, dayRelation, zoneName, formatUtcOffset } from './time'
import { timeInWords, observation } from './scores'

export const isWeekend = (city, weekday) => (city.weekend || [0, 6]).includes(weekday)

/** Night 18:00–06:00, working hours 09:00–17:00 on local weekdays. */
export function hourState(city, t) {
  if (t.hours >= 9 && t.hours < 17 && !isWeekend(city, t.weekday)) return 'work'
  if (t.hours >= 6 && t.hours < 18) return 'day'
  return 'night'
}

/** Everything the views need about one city at `now`, relative to `home`. */
export function describeCity(city, now, home, use12h) {
  const t = zoned(now, city.tz)
  const h = zoned(now, home.tz)
  const dayDelta = t.dayNumber - h.dayNumber
  const diffMinutes = t.offset - h.offset
  return {
    city,
    t,
    clock: formatClock(t.hour, t.minute, use12h),
    state: hourState(city, t),
    dayDelta,
    diffMinutes,
    diff: formatDiff(diffMinutes),
    relation: dayRelation(dayDelta),
    zone: `${zoneName(now, city.tz)}, ${formatUtcOffset(t.offset)}`,
    words: timeInWords(t.hour, t.minute, { weekday: t.weekday, otherDay: dayDelta !== 0 }),
    observation: observation(city.id, t, isWeekend(city, t.weekday)),
  }
}

/**
 * Groups cities whose local time is within a few minutes, so cities in the
 * same zone share one label on the dial instead of printing over each other.
 */
export function clusterForDial(entries) {
  const sorted = [...entries].sort((a, b) => a.t.hours - b.t.hours)
  const clusters = []
  for (const e of sorted) {
    const last = clusters[clusters.length - 1]
    if (last && Math.abs(e.t.hours - last.entries[0].t.hours) < 0.1) last.entries.push(e)
    else clusters.push({ entries: [e] })
  }
  return clusters.map((c) => ({ ...c, hours: c.entries[0].t.hours, clock: c.entries[0].clock }))
}

/**
 * The Table: for each hour of home's day, each city's local time and state,
 * the number of cities at work, and the longest run of best-covered hours.
 */
export function buildPlanner(cities, now, home) {
  const h = zoned(now, home.tz)
  const midnight = now.getTime() - (h.hour * 3600 + h.minute * 60 + h.second) * 1000
  const columns = Array.from({ length: 24 }, (_, H) => new Date(midnight + H * 3600000))
  const rows = cities.map((city) => ({
    city,
    offset: zoned(now, city.tz).offset,
    cells: columns.map((instant) => {
      const t = zoned(instant, city.tz)
      return { hour: t.hour, minute: t.minute, state: hourState(city, t) }
    }),
  }))
  const counts = columns.map((_, i) => rows.filter((r) => r.cells[i].state === 'work').length)
  const best = Math.max(0, ...counts)
  let window = null
  if (best > 0) {
    for (let i = 0; i < 24; i++) {
      if (counts[i] !== best) continue
      let j = i
      while (j + 1 < 24 && counts[j + 1] === best) j++
      if (!window || j - i > window.to - window.from) window = { from: i, to: j }
      i = j
    }
  }
  return { rows, counts, best, window, nowColumn: h.hour }
}
