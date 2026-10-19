import { useState, useEffect, useCallback } from 'react'
import { getDefaultCityIds, getDefaultHomeId, getCityById } from '../data/cities'

const STORAGE_KEY = 'world-clock-settings'

function systemTheme() {
  try {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  } catch {
    return 'light'
  }
}

function defaultSettings() {
  return {
    cityIds: getDefaultCityIds(),
    homeCityId: getDefaultHomeId(),
    selectedId: null,
    use12h: false,
    theme: systemTheme(),
  }
}

const known = (ids) => (Array.isArray(ids) ? ids.filter((id) => getCityById(id)) : [])

/** Share links carry ?c=<id>&c=<id>&h=<home>&s=<selected>. */
function readUrl() {
  if (typeof window === 'undefined') return null
  const params = new URLSearchParams(window.location.search)
  const cityIds = known(params.getAll('c'))
  if (cityIds.length === 0) return null
  const out = { cityIds }
  if (getCityById(params.get('h'))) out.homeCityId = params.get('h')
  if (getCityById(params.get('s'))) out.selectedId = params.get('s')
  return out
}

function loadSettings() {
  const base = defaultSettings()
  const fromUrl = readUrl()
  if (fromUrl) return { ...base, ...fromUrl }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return base
    const parsed = JSON.parse(raw)
    const cityIds = known(parsed.cityIds)
    return {
      ...base,
      cityIds: cityIds.length > 0 ? cityIds : Array.isArray(parsed.cityIds) ? [] : base.cityIds,
      homeCityId: getCityById(parsed.homeCityId) ? parsed.homeCityId : base.homeCityId,
      selectedId: getCityById(parsed.selectedId) ? parsed.selectedId : null,
      use12h: Boolean(parsed.use12h),
      theme: parsed.theme === 'dark' || parsed.theme === 'light' ? parsed.theme : base.theme,
    }
  } catch {
    return base
  }
}

export function buildShareUrl(settings) {
  const params = new URLSearchParams()
  settings.cityIds.forEach((id) => params.append('c', id))
  if (settings.homeCityId) params.set('h', settings.homeCityId)
  if (settings.selectedId) params.set('s', settings.selectedId)
  return `${window.location.origin}${window.location.pathname}?${params.toString()}`
}

export function useWorldClockSettings() {
  const [settings, setSettings] = useState(loadSettings)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
    } catch {
      // storage can be unavailable (private mode); settings still work in memory
    }
  }, [settings])

  // Drop share params once they have been read, so a refresh uses saved settings.
  useEffect(() => {
    if (readUrl()) {
      try {
        window.history.replaceState({}, '', window.location.pathname)
      } catch {
        // ignore
      }
    }
  }, [])

  const update = useCallback((partial) => {
    setSettings((prev) => ({ ...prev, ...partial }))
  }, [])

  const addCity = useCallback((id) => {
    setSettings((prev) => (prev.cityIds.includes(id) ? prev : { ...prev, cityIds: [...prev.cityIds, id] }))
  }, [])

  const removeCity = useCallback((id) => {
    setSettings((prev) => ({
      ...prev,
      cityIds: prev.cityIds.filter((x) => x !== id),
      selectedId: prev.selectedId === id ? null : prev.selectedId,
    }))
  }, [])

  const moveCity = useCallback((id, direction) => {
    setSettings((prev) => {
      const idx = prev.cityIds.indexOf(id)
      const next = idx + (direction === 'up' ? -1 : 1)
      if (idx === -1 || next < 0 || next >= prev.cityIds.length) return prev
      const ids = [...prev.cityIds]
      ;[ids[idx], ids[next]] = [ids[next], ids[idx]]
      return { ...prev, cityIds: ids }
    })
  }, [])

  const setHome = useCallback((id) => {
    setSettings((prev) => ({
      ...prev,
      homeCityId: id,
      cityIds: prev.cityIds.includes(id) ? prev.cityIds : [id, ...prev.cityIds],
      selectedId: prev.selectedId === id ? null : prev.selectedId,
    }))
  }, [])

  return { settings, update, addCity, removeCity, moveCity, setHome }
}
