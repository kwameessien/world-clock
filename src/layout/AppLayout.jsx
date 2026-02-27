import { useLayoutEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { useWorldClockSettings } from '../hooks/useWorldClockSettings'
import SettingsBar from '../components/SettingsBar'
import AddCityModal from '../components/AddCityModal'

function AppLayout() {
  const { settings, update, addCity } = useWorldClockSettings()

  useLayoutEffect(() => {
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
