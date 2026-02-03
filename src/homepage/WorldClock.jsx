import { useState, useEffect } from 'react'
import ClockDisplay from './ClockDisplay'
import SettingsBar from './SettingsBar'
import AddCityModal from './AddCityModal'
import GoodTimeToCall from './GoodTimeToCall'
import { useWorldClockSettings } from './useWorldClockSettings'
import { getCitiesByIds } from '../data/cities'

function pad(i) {
  return i < 10 ? '0' + i : String(i)
}

function formatTime24(h, m, s) {
  return `${pad(h)}:${pad(m)}:${pad(s)}`
}

function formatTime12(h, m, s) {
  const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h
  const ampm = h < 12 ? 'AM' : 'PM'
  return `${hour12}:${pad(m)}:${pad(s)} ${ampm}`
}

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function getLocalDate(utcDate, offsetHours) {
  const d = new Date(utcDate)
  d.setUTCHours(d.getUTCHours() + offsetHours)
  return d
}

function formatDate(d) {
  return `${DAY_NAMES[d.getDay()]} ${d.getDate()} ${MONTH_NAMES[d.getMonth()]}`
}

function computeClockData(cities, use12h) {
  const now = new Date()
  const h = now.getUTCHours()
  const m = now.getUTCMinutes()
  const s = now.getUTCSeconds()

  return cities.map((city) => {
    let localH = h + city.offset
    const localDate = getLocalDate(now, city.offset)
    if (localH >= 24) localH -= 24
    else if (localH < 0) localH += 24

    const timeStr = use12h ? formatTime12(localH, m, s) : formatTime24(localH, m, s)
    const dateStr = formatDate(localDate)
    const isDay = localH >= 6 && localH < 18
    const isBusinessHours = localH >= 9 && localH < 17

    return {
      city,
      time: timeStr,
      date: dateStr,
      timezoneLabel: city.label,
      offsetHours: city.offset,
      isDay,
      isBusinessHours,
    }
  })
}

function WorldClock() {
  const { settings, update, toggleFavorite, setHome, addCity, removeCity, moveCity } = useWorldClockSettings()
  const [showAddCity, setShowAddCity] = useState(false)

  const cities = getCitiesByIds(settings.cityIds)
  const filteredCities = settings.searchQuery.trim()
    ? cities.filter((c) => c.name.toLowerCase().includes(settings.searchQuery.toLowerCase()))
    : cities

  const [clockData, setClockData] = useState(() => computeClockData(filteredCities, settings.use12h))

  useEffect(() => {
    const tick = () => setClockData(computeClockData(filteredCities, settings.use12h))
    tick()
    const interval = setInterval(tick, 500)
    return () => clearInterval(interval)
  }, [filteredCities, settings.use12h])

  const displayData = clockData.map((d) => ({
    ...d,
    isFavorite: settings.favoriteIds.includes(d.city.id),
    isHome: settings.homeCityId === d.city.id,
  }))

  const shareUrl = () => {
    const base = window.location.origin + window.location.pathname
    const params = new URLSearchParams()
    settings.cityIds.forEach((id) => params.append('c', id))
    return `${base}?${params.toString()}`
  }

  const handleShare = () => {
    navigator.clipboard?.writeText(shareUrl())
  }

  useEffect(() => {
    document.documentElement.classList.toggle('dark', settings.theme === 'dark')
  }, [settings.theme])

  return (
    <div className={`min-h-screen ${settings.theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-white text-black'}`}>
      <SettingsBar
        settings={settings}
        onUpdate={update}
        onAddCity={() => setShowAddCity(true)}
        onShare={handleShare}
      />

      <div className="py-4 px-2">
        <GoodTimeToCall cities={filteredCities} />
      </div>

      <ClockDisplay
        displayData={displayData}
        settings={settings}
        onToggleFavorite={toggleFavorite}
        onSetHome={setHome}
        onRemoveCity={removeCity}
        onMoveCity={moveCity}
      />

      {showAddCity && (
        <AddCityModal
          currentIds={settings.cityIds}
          onAdd={addCity}
          onClose={() => setShowAddCity(false)}
        />
      )}
    </div>
  )
}

export default WorldClock