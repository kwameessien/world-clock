import { useState } from 'react'

function getLocalHour(utcDate, offsetHours) {
  const h = utcDate.getUTCHours() + offsetHours
  return ((h % 24) + 24) % 24
}

const selectClass =
  'rounded border border-gray-300 dark:bg-gray-700 dark:border-gray-500 dark:text-white px-2 py-1 text-sm min-w-[160px]'

function GoodTimeToCall({ cities, theme = 'light' }) {
  const [cityA, setCityA] = useState(cities[0]?.id ?? '')
  const [cityB, setCityB] = useState(cities[1]?.id ?? '')
  const [activeTab, setActiveTab] = useState(0)

  const a = cities.find((c) => c.id === cityA)
  const b = cities.find((c) => c.id === cityB)
  const now = new Date()
  const hourA = a ? getLocalHour(now, a.offset) : 0
  const hourB = b ? getLocalHour(now, b.offset) : 0
  const bothBusiness = a && b && hourA >= 9 && hourA < 17 && hourB >= 9 && hourB < 17
  const isDark = theme === 'dark'

  const diffHours = a && b ? a.offset - b.offset : 0
  const timeDiffText =
    !a || !b
      ? null
      : diffHours === 0
        ? `${a.name} and ${b.name} are in the same time zone`
        : diffHours > 0
          ? `${a.name} is ${diffHours === 1 ? '1 hour' : `${diffHours} hours`} ahead of ${b.name}`
          : `${a.name} is ${-diffHours === 1 ? '1 hour' : `${-diffHours} hours`} behind ${b.name}`

  if (cities.length < 2) return null

  return (
    <section
      className={`max-w-xl mx-auto px-4 py-4 rounded-lg border ${
        isDark
          ? 'border-gray-600 bg-gray-800/80'
          : 'border-gray-200 bg-white'
      } shadow-sm`}
    >
      <h3 className={`text-sm font-semibold mb-3 ${isDark ? 'text-white' : 'text-black'}`}>
        Good time to call?
      </h3>

      <div
        className={`flex rounded border p-0.5 mb-4 ${
          isDark ? 'border-gray-600 bg-gray-700/60' : 'border-gray-300 bg-gray-200/60'
        }`}
      >
        <button
          type="button"
          onClick={() => setActiveTab(0)}
          className={`flex-1 rounded py-2 px-3 text-sm font-medium transition-colors ${
            activeTab === 0
              ? isDark
                ? 'bg-blue-900/50 text-white ring-1 ring-blue-500'
                : 'bg-blue-50 text-blue-700 ring-1 ring-blue-300'
              : isDark
                ? 'text-gray-400 hover:text-gray-200'
                : 'text-gray-600 hover:text-black'
          }`}
          aria-pressed={activeTab === 0}
        >
          City A
        </button>
        <button
          type="button"
          onClick={() => setActiveTab(1)}
          className={`flex-1 rounded py-2 px-3 text-sm font-medium transition-colors ${
            activeTab === 1
              ? isDark
                ? 'bg-blue-900/50 text-white ring-1 ring-blue-500'
                : 'bg-blue-50 text-blue-700 ring-1 ring-blue-300'
              : isDark
                ? 'text-gray-400 hover:text-gray-200'
                : 'text-gray-600 hover:text-black'
          }`}
          aria-pressed={activeTab === 1}
        >
          City B
        </button>
      </div>

      <div className="space-y-3">
        <label className={`block text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          {activeTab === 0 ? 'First city' : 'Second city'}
        </label>
        <select
          value={activeTab === 0 ? cityA : cityB}
          onChange={(e) =>
            activeTab === 0 ? setCityA(e.target.value) : setCityB(e.target.value)
          }
          className={selectClass}
          aria-label={activeTab === 0 ? 'Select first city' : 'Select second city'}
        >
          {cities.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          {activeTab === 0 ? 'Switch to City B tab to pick the second city.' : 'Switch to City A tab to pick the first city.'}
        </p>
        <div className="pt-1 flex flex-wrap items-center gap-2">
          <span
            className={`inline-block text-xs font-medium px-1.5 py-0.5 rounded shrink-0 ${
              bothBusiness
                ? 'bg-green-500/30 text-green-800 dark:bg-green-500/30 dark:text-green-100'
                : isDark
                  ? 'bg-gray-700 text-gray-400'
                  : 'bg-gray-200 text-gray-600'
            }`}
          >
            {bothBusiness ? '✓ Both in business hours' : '✗ Not both in business hours'}
          </span>
          {timeDiffText && (
            <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {timeDiffText}
            </span>
          )}
        </div>
      </div>
    </section>
  )
}

export default GoodTimeToCall