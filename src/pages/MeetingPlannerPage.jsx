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
    <div
      className={`min-h-screen py-8 px-4 ${
        isDark
          ? 'bg-gradient-to-b from-gray-900 via-gray-800/50 to-gray-900'
          : 'bg-gradient-to-b from-slate-50 via-white to-slate-100'
      }`}
    >
      <div className="max-w-3xl mx-auto space-y-8">
        <header className="text-center space-y-2">
          <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Meeting planner
          </h1>
          <p className={`text-sm max-w-md mx-auto ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Find the best times to schedule calls across your time zones. Green = everyone available.
          </p>
        </header>

        {filteredCities.length === 0 ? (
          <div
            className={`rounded-2xl border-2 border-dashed p-12 text-center ${
              isDark ? 'border-gray-600 bg-gray-800/30' : 'border-gray-300 bg-gray-50'
            }`}
          >
            <p className={`text-lg mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              No cities to plan with
            </p>
            <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
              Add cities on the World Clock page to see when your team overlaps.
            </p>
          </div>
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
