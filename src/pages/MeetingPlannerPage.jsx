import { useWorldClockSettings } from '../hooks/useWorldClockSettings'
import { getCitiesByIds } from '../data/cities'
import MeetingPlanner from '../components/MeetingPlanner'

function MeetingPlannerPage() {
  const { settings } = useWorldClockSettings()
  const cities = getCitiesByIds(settings.cityIds)
  const filteredCities = settings.searchQuery.trim()
    ? cities.filter((c) => c.name.toLowerCase().includes(settings.searchQuery.toLowerCase()))
    : cities

  const isDark = settings.theme === 'dark'

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900 text-gray-100' : 'bg-white text-black'}`}>
      <div className="py-4 px-4 w-full max-w-[1400px] mx-auto">
        {filteredCities.length === 0 ? (
          <section
            className={`rounded-lg border p-8 text-center ${
              isDark ? 'border-gray-600 bg-gray-800/80' : 'border-gray-200 bg-white'
            } shadow-sm`}
          >
            <p className={`mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              No cities to plan with
            </p>
            <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
              Add cities on the World Clock page to see when your team overlaps.
            </p>
          </section>
        ) : (
          <MeetingPlanner
            cities={filteredCities}
            theme={settings.theme}
            homeCityId={settings.homeCityId}
          />
        )}
      </div>
    </div>
  )
}

export default MeetingPlannerPage
