import { useState } from 'react'

function getLocalHour(utcDate, offsetHours) {
  const h = utcDate.getUTCHours() + offsetHours
  return ((h % 24) + 24) % 24
}

function GoodTimeToCall({ cities }) {
  const [cityA, setCityA] = useState(cities[0]?.id ?? '')
  const [cityB, setCityB] = useState(cities[1]?.id ?? '')

  const a = cities.find((c) => c.id === cityA)
  const b = cities.find((c) => c.id === cityB)
  const now = new Date()
  const hourA = a ? getLocalHour(now, a.offset) : 0
  const hourB = b ? getLocalHour(now, b.offset) : 0
  const bothBusiness = a && b && hourA >= 9 && hourA < 17 && hourB >= 9 && hourB < 17

  if (cities.length < 2) return null

  return (
    <section className="max-w-xl mx-auto mb-4 p-4 rounded-lg bg-gray-100 dark:bg-gray-800">
      <h3 className="text-sm font-medium mb-2">Good time to call?</h3>
      <div className="flex flex-wrap items-center gap-2">
        <select
          value={cityA}
          onChange={(e) => setCityA(e.target.value)}
          className="rounded border dark:bg-gray-700 dark:border-gray-600 px-2 py-1 text-sm"
        >
          {cities.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <span className="text-sm">and</span>
        <select
          value={cityB}
          onChange={(e) => setCityB(e.target.value)}
          className="rounded border dark:bg-gray-700 dark:border-gray-600 px-2 py-1 text-sm"
        >
          {cities.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <span className={`text-sm font-medium ${bothBusiness ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
          {bothBusiness ? '✓ Both in business hours' : '✗ Not both in business hours'}
        </span>
      </div>
    </section>
  )
}

export default GoodTimeToCall
