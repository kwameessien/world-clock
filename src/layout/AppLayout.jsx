import { useCallback, useLayoutEffect, useMemo, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { useWorldClockSettings, buildShareUrl } from '../hooks/useWorldClockSettings'
import { useNow } from '../hooks/useNow'
import { useIsMobile } from '../hooks/useMediaQuery'
import { getCityById, getCitiesByIds } from '../data/cities'
import { describeCity, clusterForDial } from '../lib/model'
import { formatShortDate } from '../lib/time'
import Header from '../components/Header'
import AddCityPanel from '../components/AddCityPanel'
import Toast from '../components/Toast'

function AppLayout() {
  const { settings, update, addCity, removeCity, moveCity, setHome } = useWorldClockSettings()
  const now = useNow()
  const isMobile = useIsMobile()
  const [addOpen, setAddOpen] = useState(false)
  const [toast, setToast] = useState(null)

  useLayoutEffect(() => {
    document.documentElement.dataset.theme = settings.theme
  }, [settings.theme])

  const home = getCityById(settings.homeCityId) || getCityById('local')
  const cities = useMemo(() => {
    const list = getCitiesByIds(settings.cityIds)
    return list.some((c) => c.id === home.id) ? list : [home, ...list]
  }, [settings.cityIds, home])

  const entries = cities.map((c) => describeCity(c, now, home, settings.use12h))
  const homeEntry = entries.find((e) => e.city.id === home.id)
  const selected = entries.find((e) => e.city.id === settings.selectedId && e.city.id !== home.id)
    || entries.find((e) => e.city.id !== home.id) || null
  const clusters = clusterForDial(entries)

  const dismissToast = useCallback(() => setToast(null), [])
  const share = async () => {
    const url = buildShareUrl({ ...settings, selectedId: selected?.city.id ?? null })
    const detail = `Opens with ${home.name} as home${selected ? `, ${selected.city.name} selected` : ''}, ${cities.length} ${cities.length === 1 ? 'city' : 'cities'}.`
    try {
      await navigator.clipboard.writeText(url)
      setToast({ title: 'Link copied', detail })
    } catch {
      setToast({ title: 'Copy this link', detail: url })
    }
  }

  const context = {
    now, settings, update, home, cities, entries, homeEntry, selected, clusters, isMobile,
    select: (id) => update({ selectedId: id }),
    addCity, removeCity, moveCity, setHome,
    openAdd: () => setAddOpen(true),
  }

  return (
    <div className="app">
      <Header
        meta={`${cities.length} ${cities.length === 1 ? 'city' : 'cities'} — ${formatShortDate(now, home.tz)}`}
        settings={settings}
        onUpdate={update}
        onShare={share}
        shareOn={Boolean(toast)}
        onAddCity={() => setAddOpen(true)}
        addOpen={addOpen}
      />
      <main>
        <Outlet context={context} />
      </main>
      {addOpen && (
        <AddCityPanel cityIds={cities.map((c) => c.id)} home={home} now={now} use12h={settings.use12h}
          onAdd={addCity} onClose={() => setAddOpen(false)} />
      )}
      {toast && <Toast title={toast.title} detail={toast.detail} onDismiss={dismissToast} />}
    </div>
  )
}

export default AppLayout
