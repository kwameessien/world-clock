import { useState, useMemo } from 'react'

function getUtcMoment(selectedDateStr, hourRef, refOffset) {
  const base = new Date(selectedDateStr + 'T12:00:00.000Z')
  const dayAdjust = Math.floor((hourRef - refOffset) / 24)
  const utcHour = ((hourRef - refOffset) % 24 + 24) % 24
  const d = new Date(base)
  d.setUTCDate(d.getUTCDate() + dayAdjust)
  d.setUTCHours(utcHour, 0, 0, 0)
  return d
}

function MeetingPlanner({ cities = [], theme = 'light', homeCityId }) {
  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date()
    return d.toISOString().slice(0, 10)
  })

  const isDark = theme === 'dark'
  const refCity = cities.find((c) => c.id === homeCityId) ?? cities[0]
  const refOffset = refCity?.offset ?? 0

  const hourData = useMemo(() => {
    return Array.from({ length: 24 }, (_, h) => {
      const utc = getUtcMoment(selectedDate, h, refOffset)
      const utcHour = utc.getUTCHours()
      const inBusiness = cities.map((city) => {
        const localH = ((utcHour + city.offset) % 24 + 24) % 24
        return { city, inBusiness: localH >= 9 && localH < 17 }
      })
      const count = inBusiness.filter((b) => b.inBusiness).length
      const allIn = count === cities.length && cities.length > 0
      return { hour: h, inBusiness, count, allIn }
    })
  }, [selectedDate, refOffset, cities])

  const bestSlots = useMemo(() => {
    const allInHours = hourData.filter((d) => d.allIn).map((d) => d.hour)
    if (allInHours.length === 0) return []
    const ranges = []
    let start = allInHours[0]
    for (let i = 1; i <= allInHours.length; i++) {
      if (i === allInHours.length || allInHours[i] !== allInHours[i - 1] + 1) {
        ranges.push({ start, end: allInHours[i - 1] })
        if (i < allInHours.length) start = allInHours[i]
      }
    }
    return ranges
  }, [hourData])

  if (cities.length === 0) return null

  return (
    <section
      className={`rounded-2xl border px-6 py-6 shadow-lg transition-all ${
        isDark ? 'border-gray-600 bg-gray-800/60' : 'border-gray-200 bg-white'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <label className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Date
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className={`rounded-lg border px-3 py-2 text-sm font-medium ${
              isDark
                ? 'border-gray-500 bg-gray-700 text-white'
                : 'border-gray-300 bg-white text-black'
            }`}
            aria-label="Pick date"
          />
        </div>
        {bestSlots.length > 0 && (
          <div className={`text-sm ${isDark ? 'text-green-400' : 'text-green-600'}`}>
            <span className="font-medium">Best slots:</span>{' '}
            {bestSlots
              .map((r) =>
                r.start === r.end
                  ? `${String(r.start).padStart(2, '0')}:00`
                  : `${String(r.start).padStart(2, '0')}:00–${String(r.end + 1).padStart(2, '0')}:00`
              )
              .join(', ')}
          </div>
        )}
      </div>

      {/* City timeline rows */}
      <div className="space-y-2 mb-4">
        {cities.map((city) => (
          <div key={city.id} className="flex items-center gap-3">
            <span
              className={`w-24 text-xs font-medium shrink-0 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
              title={city.label}
            >
              {city.name}
            </span>
            <div className="flex-1 flex h-6 rounded overflow-hidden">
              {hourData.map(({ hour, inBusiness }) => {
                const ok = inBusiness.find((b) => b.city.id === city.id)?.inBusiness
                return (
                  <div
                    key={hour}
                    className={`flex-1 min-w-0 transition-colors ${
                      ok ? (isDark ? 'bg-green-500/60' : 'bg-green-400') : 'bg-gray-300/50 dark:bg-gray-700'
                    }`}
                    title={`${String(hour).padStart(2, '0')}:00 – ${ok ? 'In office' : 'Outside hours'}`}
                  />
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Hour labels */}
      <div className="grid text-[10px] text-gray-500 dark:text-gray-400 mb-1" style={{ gridTemplateColumns: 'repeat(24, minmax(0, 1fr))' }}>
        {Array.from({ length: 24 }, (_, h) => (
          <span key={h} className={`text-center ${[0, 6, 12, 18].includes(h) ? '' : 'invisible'}`}>
            {h}:00
          </span>
        ))}
      </div>

      {/* Summary strip */}
      <div className="flex h-10 rounded-lg overflow-hidden border dark:border-gray-600">
        {hourData.map(({ hour, count, allIn }) => (
          <div
            key={hour}
            className={`flex-1 min-w-0 transition-colors ${
              allIn
                ? 'bg-green-500'
                : count > 0
                  ? 'bg-amber-400'
                  : isDark
                    ? 'bg-gray-700'
                    : 'bg-gray-200'
            }`}
            title={`${String(hour).padStart(2, '0')}:00 – ${count}/${cities.length} available`}
          />
        ))}
      </div>

      <div className={`flex flex-wrap items-center gap-4 mt-4 text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-green-500" /> Everyone available
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-amber-400" /> Some available
        </span>
        <span className="flex items-center gap-1.5">
          <span className={`w-3 h-3 rounded ${isDark ? 'bg-gray-600' : 'bg-gray-200'}`} /> Outside 9–17
        </span>
      </div>
    </section>
  )
}

export default MeetingPlanner
