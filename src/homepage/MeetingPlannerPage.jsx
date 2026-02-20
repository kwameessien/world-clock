import { useWorldClockSettings } from './useWorldClockSettings'
import { getCitiesByIds } from '../data/cities'
import MeetingPlanner from './MeetingPlanner'

function MeetingPlannerPage() {
  const { settings } = useWorldClockSettings()
  const cities = getCitiesByIds(settings.cityIds)
  const filteredCities = settings.searchQuery.trim()
    ? cities.filter((c) => c.name.toLowerCase().includes(settings.searchQuery.toLowerCase()))
    : cities

  const isDark = settings.theme === 'dark'

  return (
    <div
      className={`min-h-screen py-8 px-4 max-w-2xl mx-auto ${
        isDark ? 'bg-gray-900 text-gray-100' : 'bg-white text-black'
      }`}
    >
      <MeetingPlanner
        cities={filteredCities}
        theme={settings.theme}
        homeCityId={settings.homeCityId}
      />
    </div>
  )
}

export default MeetingPlannerPage
