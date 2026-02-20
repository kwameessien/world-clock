import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { useWorldClockSettings } from './useWorldClockSettings'
import SettingsBar from './SettingsBar'
import AddCityModal from './AddCityModal'

function AppLayout() {
  const { settings, update, addCity } = useWorldClockSettings()

  useEffect(() => {
    document.documentElement.classList.toggle('dark', settings.theme === 'dark')
  }, [settings.theme])
  const [showAddCity, setShowAddCity] = useState(false)

  const shareUrl = () => {
    const base = window.location.origin + window.location.pathname
    const params = new URLSearchParams()
    settings.cityIds.forEach((id) => params.append('c', id))
    return `${base}?${params.toString()}`
  }

  return (
    <>
      <SettingsBar
        settings={settings}
        onUpdate={update}
        onAddCity={() => setShowAddCity(true)}
        onShare={() => navigator.clipboard?.writeText(shareUrl())}
      />
      <Outlet />
      {showAddCity && (
        <AddCityModal
          currentIds={settings.cityIds}
          onAdd={addCity}
          onClose={() => setShowAddCity(false)}
        />
      )}
    </>
  )
}

export default AppLayout
