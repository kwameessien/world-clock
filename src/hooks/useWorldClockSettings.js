import { useState, useEffect, useCallback } from 'react'
import { getDefaultCityIds } from '../data/cities'

const STORAGE_KEY = 'world-clock-settings'

const defaultSettings = {
  cityIds: getDefaultCityIds(),
  favoriteIds: [],
  homeCityId: null,
  use12h: false,
  theme: 'light',
  fontSize: 'normal',
  compactView: false,
  searchQuery: '',
}

function getCityIdsFromUrl() {
  if (typeof window === 'undefined') return null
  const params = new URLSearchParams(window.location.search)
  const ids = params.getAll('c')
  return ids.length > 0 ? ids : null
}

function loadSettings() {
  const urlIds = getCityIdsFromUrl()
  if (urlIds && urlIds.length > 0) {
    return { ...defaultSettings, cityIds: urlIds }
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultSettings
    const parsed = JSON.parse(raw)
    return {
      ...defaultSettings,
      ...parsed,
      cityIds: Array.isArray(parsed.cityIds) && parsed.cityIds.length > 0 ? parsed.cityIds : defaultSettings.cityIds,
      favoriteIds: Array.isArray(parsed.favoriteIds) ? parsed.favoriteIds : defaultSettings.favoriteIds,
    }
  } catch {
    return defaultSettings
  }
}

function saveSettings(settings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  } catch {
    // ignore localStorage errors
  }
}

export function useWorldClockSettings() {
  const [settings, setSettings] = useState(loadSettings)

  useEffect(() => {
    saveSettings(settings)
  }, [settings])

  // Defer URL cleanup to avoid interfering with React Router during initial render
  useEffect(() => {
    const urlIds = getCityIdsFromUrl()
    if (urlIds && urlIds.length > 0) {
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

  const toggleFavorite = useCallback((id) => {
    setSettings((prev) => ({
      ...prev,
      favoriteIds: prev.favoriteIds.includes(id)
        ? prev.favoriteIds.filter((x) => x !== id)
        : [...prev.favoriteIds, id],
    }))
  }, [])

  const setHome = useCallback((id) => {
    setSettings((prev) => ({ ...prev, homeCityId: id || null }))
  }, [])

  const reorderCities = useCallback((fromIndex, toIndex) => {
    setSettings((prev) => {
      const ids = [...prev.cityIds]
      const [removed] = ids.splice(fromIndex, 1)
      ids.splice(toIndex, 0, removed)
      return { ...prev, cityIds: ids }
    })
  }, [])

  const addCity = useCallback((id) => {
    setSettings((prev) => {
      if (prev.cityIds.includes(id)) return prev
      return { ...prev, cityIds: [...prev.cityIds, id] }
    })
  }, [])

  const removeCity = useCallback((id) => {
    setSettings((prev) => ({
      ...prev,
      cityIds: prev.cityIds.filter((x) => x !== id),
      favoriteIds: prev.favoriteIds.filter((x) => x !== id),
      homeCityId: prev.homeCityId === id ? null : prev.homeCityId,
    }))
  }, [])

  const moveCity = useCallback((id, direction) => {
    setSettings((prev) => {
      const idx = prev.cityIds.indexOf(id)
      if (idx === -1) return prev
      const next = idx + (direction === 'up' ? -1 : 1)
      if (next < 0 || next >= prev.cityIds.length) return prev
      const ids = [...prev.cityIds]
      ;[ids[idx], ids[next]] = [ids[next], ids[idx]]
      return { ...prev, cityIds: ids }
    })
  }, [])

  return {
    settings,
    update,
    toggleFavorite,
    setHome,
    reorderCities,
    addCity,
    removeCity,
    moveCity,
  }
}
