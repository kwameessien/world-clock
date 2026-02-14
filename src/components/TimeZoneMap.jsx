import { useState, useEffect } from 'react'

const OFFSETS = Array.from({ length: 27 }, (_, i) => i - 12) // UTC-12 to UTC+14

function getLocalHour(utcHours, offset) {
  return ((utcHours + offset) % 24 + 24) % 24
}

function TimeZoneMap({ theme = 'light' }) {
  const [now, setNow] = useState(() => new Date())
  const isDark = theme === 'dark'

  useEffect(() => {
    const tick = () => setNow(new Date())
    const interval = setInterval(tick, 60000) // Update every minute
    return () => clearInterval(interval)
  }, [])

  const utcHours = now.getUTCHours() + now.getUTCMinutes() / 60

  return (
    <section
      className={`max-w-2xl mx-auto px-4 py-4 rounded-lg border ${
        isDark ? 'border-gray-600 bg-gray-800/80' : 'border-gray-200 bg-white'
      } shadow-sm`}
    >
      <h3 className={`text-sm font-semibold mb-2 ${isDark ? 'text-white' : 'text-black'}`}>
        World day & night
      </h3>
      <div
        className={`flex h-8 rounded overflow-hidden border ${
          isDark ? 'border-gray-600' : 'border-gray-300'
        }`}
        role="img"
        aria-label="World time zones colored by day and night"
      >
        {OFFSETS.map((offset) => {
          const localH = getLocalHour(utcHours, offset)
          const isDay = localH >= 6 && localH < 18
          const isDuskDawn = (localH >= 5 && localH < 6) || (localH >= 18 && localH < 19)

          let bg
          if (isDark) {
            bg = isDay ? 'bg-amber-400/70' : isDuskDawn ? 'bg-amber-900/50' : 'bg-slate-800'
          } else {
            bg = isDay ? 'bg-amber-200' : isDuskDawn ? 'bg-amber-800/30' : 'bg-slate-600'
          }

          return (
            <div
              key={offset}
              className={`flex-1 min-w-0 ${bg} transition-colors duration-1000`}
              title={`UTC${offset >= 0 ? '+' : ''}${offset}: ${isDay ? 'Day' : 'Night'} (local ~${Math.floor(localH)}:00)`}
            />
          )
        })}
      </div>
      <div className="flex justify-between mt-1 text-[10px] text-gray-500 dark:text-gray-400">
        <span>UTC-12</span>
        <span>UTC 0</span>
        <span>UTC+14</span>
      </div>
    </section>
  )
}

export default TimeZoneMap
