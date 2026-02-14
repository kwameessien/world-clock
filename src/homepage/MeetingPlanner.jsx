import { useState } from 'react'

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

  if (cities.length === 0) return null

  return (
    <section
      className={`max-w-2xl mx-auto px-4 py-4 rounded-lg border ${
        isDark ? 'border-gray-600 bg-gray-800/80' : 'border-gray-200 bg-white'
      } shadow-sm`}
    >
      <h3 className={`text-sm font-semibold mb-3 ${isDark ? 'text-white' : 'text-black'}`}>
        Meeting planner
      </h3>

      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <label className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Date (in {refCity?.name ?? 'reference'} time)
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className={`rounded border px-2 py-1.5 text-sm ${
              isDark
                ? 'border-gray-500 bg-gray-700 text-white'
                : 'border-gray-300 bg-white text-black'
            }`}
            aria-label="Pick date"
          />
        </div>

        <div className="overflow-x-auto">
          <div
            className={`min-w-[600px] grid gap-px rounded border ${
              isDark ? 'border-gray-600' : 'border-gray-300'
            } p-1`}
            style={{ gridTemplateColumns: 'repeat(24, minmax(0, 1fr))' }}
          >
            {Array.from({ length: 24 }, (_, h) => {
              const utc = getUtcMoment(selectedDate, h, refOffset)
              const utcHour = utc.getUTCHours()

              const inBusiness = cities.map((city) => {
                const localH = ((utcHour + city.offset) % 24 + 24) % 24
                return { city, inBusiness: localH >= 9 && localH < 17 }
              })

              const count = inBusiness.filter((b) => b.inBusiness).length
              const allIn = count === cities.length && cities.length > 0

              return (
                <div
                  key={h}
                  className={`flex flex-col items-center pt-1 pb-2 px-0.5 rounded ${
                    isDark ? 'bg-gray-800/50' : 'bg-gray-50'
                  }`}
                  title={`${String(h).padStart(2, '0')}:00 – ${inBusiness
                    .filter((b) => b.inBusiness)
                    .map((b) => b.city.name)
                    .join(', ') || 'None'} in business hours`}
                >
                  <span
                    className={`text-[10px] font-medium mb-1 ${
                      isDark ? 'text-gray-400' : 'text-gray-500'
                    }`}
                  >
                    {h}
                  </span>
                  <div className="flex flex-wrap justify-center gap-0.5">
                    {inBusiness.map(({ city, inBusiness: ok }) => (
                      <span
                        key={city.id}
                        className={`inline-block w-1.5 h-1.5 rounded-full ${
                          ok ? (allIn ? 'bg-green-500' : 'bg-amber-500') : 'bg-gray-400 dark:bg-gray-600'
                        }`}
                        title={`${city.name}: ${ok ? 'Business hours' : 'Outside 9–17'}`}
                      />
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className={`flex flex-wrap items-center gap-3 text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" /> All in business
          </span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Some in business
          </span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-gray-400 dark:bg-gray-600" /> Outside 9–17
          </span>
        </div>
      </div>
    </section>
  )
}

export default MeetingPlanner
