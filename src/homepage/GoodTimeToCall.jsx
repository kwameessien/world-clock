import { useState } from 'react'

function getLocalHour(utcDate, offsetHours) {
  const h = utcDate.getUTCHours() + offsetHours
  return ((h % 24) + 24) % 24
}

const TAB_WIDTH = 130

function LocationIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
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

  return (
    <section className="max-w-xl mx-auto mb-6 px-4 py-6 rounded-2xl bg-sky-50 dark:bg-sky-950/30">
      <h3 className="text-sm font-medium mb-4 text-center text-gray-700 dark:text-gray-300">
        Good time to call?
      </h3>

      {/* Pill-shaped tab bar with sliding overlay (like the reference design) */}
      <div className="relative mx-auto flex justify-center">
        <div
          className="relative flex rounded-full bg-white dark:bg-gray-800 shadow-lg border border-gray-200/80 dark:border-gray-600 overflow-hidden"
          style={{ width: TAB_WIDTH * 2 }}
        >
          {/* Sliding overlay - moves on tab click like the jQuery version */}
          <div
            className="navigation-tab-overlay absolute top-1 bottom-1 rounded-full bg-sky-100 dark:bg-sky-900/60 transition-all duration-300 ease-out"
            style={{
              left: activeTab * TAB_WIDTH + 4,
              width: TAB_WIDTH - 8,
            }}
            aria-hidden
          />
          <button
            type="button"
            onClick={() => setActiveTab(0)}
            className={`navigation-tab-item relative z-10 flex flex-1 items-center justify-center gap-2 py-3 transition-colors ${
              activeTab === 0
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-blue-500 dark:text-blue-400/80'
            }`}
            aria-pressed={activeTab === 0}
          >
            <LocationIcon />
            {activeTab === 0 && (
              <span className="text-sm font-medium whitespace-nowrap">City A</span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab(1)}
            className={`navigation-tab-item relative z-10 flex flex-1 items-center justify-center gap-2 py-3 transition-colors ${
              activeTab === 1
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-blue-500 dark:text-blue-400/80'
            }`}
            aria-pressed={activeTab === 1}
          >
            <LocationIcon />
            {activeTab === 1 && (
              <span className="text-sm font-medium whitespace-nowrap">City B</span>
            )}
          </button>
        </div>
      </div>

      {/* Content below tabs: show only the active tab's city selector */}
      <div className="mt-4 space-y-3">
        <div className="flex flex-col items-center gap-2">
          <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            {activeTab === 0 ? 'City A' : 'City B'}
          </label>
          <select
            value={activeTab === 0 ? cityA : cityB}
            onChange={(e) =>
              activeTab === 0 ? setCityA(e.target.value) : setCityB(e.target.value)
            }
            className="rounded-full border border-gray-300 dark:bg-gray-700 dark:border-gray-500 dark:text-white px-4 py-2 text-sm bg-white dark:bg-gray-700 shadow-sm min-w-[200px]"
            aria-label={activeTab === 0 ? 'Select first city' : 'Select second city'}
          >
            {cities.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <p className="text-center text-xs text-gray-500 dark:text-gray-400">
          {activeTab === 0
            ? 'Switch to City B tab to choose the second city.'
            : 'Switch to City A tab to change the first city.'}
        </p>
        <div className="flex justify-center">
          <span
            className={`text-sm font-medium px-3 py-1.5 rounded-full ${
              bothBusiness
                ? 'text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900/40'
                : 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800'
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
