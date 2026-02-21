import { useState, useMemo } from 'react'

function toLocalDateStr(d) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

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
  const [selectedDate, setSelectedDate] = useState(() => toLocalDateStr(new Date()))
  const [hoveredHour, setHoveredHour] = useState(null)
  const [copiedSlot, setCopiedSlot] = useState(null)

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

  const setQuickDate = (daysFromToday) => {
    const d = new Date()
    d.setDate(d.getDate() + daysFromToday)
    setSelectedDate(toLocalDateStr(d))
  }

  const todayStr = toLocalDateStr(new Date())
  const tomorrowD = new Date()
  tomorrowD.setDate(tomorrowD.getDate() + 1)
  const tomorrowStr = toLocalDateStr(tomorrowD)

  const copySlot = (r) => {
    const text =
      r.start === r.end
        ? `${selectedDate} at ${String(r.start).padStart(2, '0')}:00`
        : `${selectedDate} ${String(r.start).padStart(2, '0')}:00–${String(r.end + 1).padStart(2, '0')}:00`
    navigator.clipboard?.writeText(text).then(() => {
      setCopiedSlot(r)
      setTimeout(() => setCopiedSlot(null), 1500)
    })
  }

  if (cities.length === 0) return null

  const hoveredData = hoveredHour != null ? hourData[hoveredHour] : null
  const showNowIndicator = selectedDate === todayStr
  const nowInRef = showNowIndicator
    ? (() => {
        const now = new Date()
        const utcH = now.getUTCHours() + now.getUTCMinutes() / 60
        return ((utcH + refOffset) % 24 + 24) % 24
      })()
    : null

  return (
    <section
      className={`rounded-lg border px-4 py-4 ${
        isDark ? 'border-gray-600 bg-gray-800/80' : 'border-gray-200 bg-white'
      } shadow-sm`}
    >
      <h3 className={`text-sm font-semibold mb-3 ${isDark ? 'text-white' : 'text-black'}`}>
        Meeting planner
      </h3>

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className={`flex rounded border p-0.5 ${isDark ? 'border-gray-600 bg-gray-700/60' : 'border-gray-300 bg-gray-200/60'}`}>
          <button
            type="button"
            onClick={() => setQuickDate(0)}
            className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${
              selectedDate === todayStr
                ? isDark
                  ? 'bg-blue-900/50 text-white ring-1 ring-blue-500'
                  : 'bg-blue-50 text-blue-700 ring-1 ring-blue-300'
                : isDark
                  ? 'text-gray-400 hover:text-gray-200'
                  : 'text-gray-600 hover:text-black'
            }`}
          >
            Today
          </button>
          <button
            type="button"
            onClick={() => setQuickDate(1)}
            className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${
              selectedDate === tomorrowStr
                ? isDark
                  ? 'bg-blue-900/50 text-white ring-1 ring-blue-500'
                  : 'bg-blue-50 text-blue-700 ring-1 ring-blue-300'
                : isDark
                  ? 'text-gray-400 hover:text-gray-200'
                  : 'text-gray-600 hover:text-black'
            }`}
          >
            Tomorrow
          </button>
        </div>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className={`rounded border px-2 py-1 text-sm ${
            isDark
              ? 'border-gray-500 bg-gray-700 text-white'
              : 'border-gray-300 bg-white text-black'
          }`}
          aria-label="Pick date"
        />
        <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          (in {refCity?.name ?? 'ref'} time)
        </span>
      </div>

      {bestSlots.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {bestSlots.map((r) => {
            const key = `${r.start}-${r.end}`
            const label =
              r.start === r.end
                ? `${String(r.start).padStart(2, '0')}:00`
                : `${String(r.start).padStart(2, '0')}:00–${String(r.end + 1).padStart(2, '0')}:00`
            const justCopied = copiedSlot?.start === r.start && copiedSlot?.end === r.end
            return (
              <button
                key={key}
                type="button"
                onClick={() => copySlot(r)}
                className={`inline-flex items-center gap-1.5 rounded px-2 py-1 text-xs font-medium transition-colors ${
                  justCopied
                    ? 'bg-green-500/30 text-green-800 dark:bg-green-500/30 dark:text-green-100'
                    : isDark
                      ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                      : 'bg-green-500/20 text-green-700 hover:bg-green-500/30'
                }`}
                title="Copy to clipboard"
              >
                {justCopied ? '✓ Copied' : label}
              </button>
            )
          })}
        </div>
      )}

      {/* City timeline rows - interactive */}
      <div className="space-y-2 mb-3">
        {cities.map((city) => (
          <div key={city.id} className="flex items-center gap-3">
            <span
              className={`w-20 text-xs font-medium shrink-0 truncate ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
              title={`${city.name} (${city.label})`}
            >
              {city.name}
            </span>
            <div className="flex-1 flex h-5 rounded overflow-hidden">
              {hourData.map(({ hour, inBusiness }) => {
                const ok = inBusiness.find((b) => b.city.id === city.id)?.inBusiness
                const isHovered = hoveredHour === hour
                return (
                  <div
                    key={hour}
                    className={`flex-1 min-w-0 transition-all cursor-default ${
                      ok ? (isDark ? 'bg-green-500/60' : 'bg-green-500/50') : 'bg-gray-300/50 dark:bg-gray-700'
                    } ${isHovered ? 'ring-1 ring-inset ring-white/50' : ''}`}
                    onMouseEnter={() => setHoveredHour(hour)}
                    onMouseLeave={() => setHoveredHour(null)}
                    title={`${String(hour).padStart(2, '0')}:00 – ${ok ? 'In office' : 'Outside hours'}`}
                  />
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Summary strip - interactive */}
      <div className={`relative flex h-8 rounded overflow-hidden border ${isDark ? 'border-gray-600' : 'border-gray-300'}`}>
        {nowInRef != null && (
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-blue-500 z-10 pointer-events-none"
            style={{ left: `${(nowInRef / 24) * 100}%` }}
            title="Current time"
          />
        )}
        {hourData.map(({ hour, count, allIn }) => {
          const isHovered = hoveredHour === hour
          return (
            <div
              key={hour}
              className={`flex-1 min-w-0 cursor-pointer transition-all ${
                allIn
                  ? 'bg-green-500/80 hover:bg-green-500'
                  : count > 0
                    ? 'bg-amber-500/60 hover:bg-amber-500/80'
                    : isDark
                      ? 'bg-gray-700'
                      : 'bg-gray-200'
              } ${isHovered ? 'ring-2 ring-blue-500 ring-inset' : ''}`}
              onMouseEnter={() => setHoveredHour(hour)}
              onMouseLeave={() => setHoveredHour(null)}
              title={`${String(hour).padStart(2, '0')}:00 – ${count}/${cities.length} available`}
            />
          )
        })}
      </div>

      {/* Hover tooltip */}
      {hoveredData && (
        <div
          className={`mt-2 rounded px-2 py-1.5 text-xs ${
            isDark ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-800'
          }`}
        >
          <span className="font-medium">
            {String(hoveredData.hour).padStart(2, '0')}:00
          </span>
          {' – '}
          {hoveredData.inBusiness
            .filter((b) => b.inBusiness)
            .map((b) => b.city.name)
            .join(', ') || 'None'} in business hours
        </div>
      )}

      <div className="flex justify-between mt-2 text-[10px] text-gray-500 dark:text-gray-400">
        <span>0</span>
        <span>6</span>
        <span>12</span>
        <span>18</span>
        <span>24h</span>
      </div>

      <div className={`flex flex-wrap items-center gap-3 mt-3 text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded bg-green-500" /> Everyone
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded bg-amber-500" /> Some
        </span>
        <span className="flex items-center gap-1">
          <span className={`w-2 h-2 rounded ${isDark ? 'bg-gray-600' : 'bg-gray-200'}`} /> Outside 9–17
        </span>
      </div>
    </section>
  )
}

export default MeetingPlanner
