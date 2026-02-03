import { useState } from 'react'

function getLocalHour(utcDate, offsetHours) {
  const h = utcDate.getUTCHours() + offsetHours
  return ((h % 24) + 24) % 24
}

function GoodTimeToCall({ cities }) {
  const [cityA, setCityA] = useState(cities[0]?.id ?? '')
  const [cityB, setCityB] = useState(cities[1]?.id ?? '')
  const [activeTab, setActiveTab] = useState(0)

  const a = cities.find((c) => c.id === cityA)
  const b = cities.find((c) => c.id === cityB)
  const now = new Date()
  const hourA = a ? getLocalHour(now, a.offset) : 0
  const hourB = b ? getLocalHour(now, b.offset) : 0
  const bothBusiness = a && b && hourA >= 9 && hourA < 17 && hourB >= 9 && hourB < 17

  if (cities.length < 2) return null

  const selectClass =
    'rounded border border-gray-300 dark:bg-gray-700 dark:border-gray-500 dark:text-white px-3 py-1.5 text-sm min-w-[160px]'

  return (
    <section className="max-w-xl mx-auto mb-4 px-4 py-4 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50/80 dark:bg-gray-800/50">
      <h3 className="text-sm font-medium mb-3 text-black dark:text-white">
        Good time to call?
      </h3>

      {/* Tab bar - matches app rounded/border style */}
      <div className="flex rounded border border-gray-300 dark:border-gray-600 bg-gray-200/60 dark:bg-gray-700/60 p-0.5 mb-4">
        <button
          type="button"
          onClick={() => setActiveTab(0)}
          className={`flex-1 rounded py-2 px-3 text-sm font-medium transition-colors ${
            activeTab === 0
              ? 'bg-white dark:bg-gray-700 text-black dark:text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-gray-200'
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
              ? 'bg-white dark:bg-gray-700 text-black dark:text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-gray-200'
          }`}
          aria-pressed={activeTab === 1}
        >
          City B
        </button>
      </div>

      {/* Active tab's city selector - same select style as SettingsBar */}
      <div className="space-y-3">
        <label className="block text-xs text-gray-500 dark:text-gray-400">
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
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {activeTab === 0
            ? 'Switch to City B to choose the second city.'
            : 'Switch to City A to change the first city.'}
        </p>
        <div className="pt-1">
          <span
            className={`inline-block text-xs font-medium px-2 py-1 rounded ${
              bothBusiness
                ? 'text-green-700 dark:text-green-300 bg-green-500/20 dark:bg-green-900/40'
                : 'text-gray-600 dark:text-gray-400 bg-gray-200/80 dark:bg-gray-700'
            }`}
          >
            {bothBusiness ? '✓ Both in business hours' : '✗ Not both in business hours'}
          </span>
        </div>
      </div>
    </section>
  )
}

export default GoodTimeToCall
