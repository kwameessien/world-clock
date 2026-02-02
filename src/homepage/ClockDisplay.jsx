import '../App.css'

// Stateless component - receives cities and times as props
function ClockDisplay({ cities = [], times = [] }) {
  const firstRowCities = (cities || []).slice(0, 10)
  const secondRowCities = (cities || []).slice(10, 20)

  const renderRowContent = (rowCities, startIndex, keyPrefix = '') => (
    <>
      {rowCities.map((city, index) => (
        <li key={`${keyPrefix}-${startIndex + index}`} className="flex-shrink-0 min-w-[140px] text-center px-4">
          <span className="block py-5 text-black city-name">{city}</span>
          <span className="block py-5 text-black time-display">{times[startIndex + index] ?? '00:00:00'}</span>
        </li>
      ))}
      {rowCities.map((city, index) => (
        <li key={`${keyPrefix}-dup-${startIndex + index}`} className="flex-shrink-0 min-w-[140px] text-center px-4">
          <span className="block py-5 text-black city-name">{city}</span>
          <span className="block py-5 text-black time-display">{times[startIndex + index] ?? '00:00:00'}</span>
        </li>
      ))}
    </>
  )

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white py-8 w-full">
      <div className="w-full flex flex-col gap-8">
        {/* Top row: marquee moves right - full width */}
        <div className="marquee-container w-full">
          <ul className="marquee-track-right flex items-center list-none p-0 m-0">
            {renderRowContent(firstRowCities, 0, 'top')}
          </ul>
        </div>
        {/* Bottom row: marquee moves left - full width */}
        <div className="marquee-container w-full">
          <ul className="marquee-track-left flex items-center list-none p-0 m-0">
            {renderRowContent(secondRowCities, 10, 'bottom')}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default ClockDisplay

