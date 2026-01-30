import '../App.css'

// Stateless component - receives cities and times as props
function ClockDisplay({ cities, times }) {
  const firstRowCities = cities.slice(0, 10)
  const secondRowCities = cities.slice(10, 20)

  const renderRow = (rowCities, startIndex) => (
    <ul className="flex flex-wrap justify-center items-center list-none p-0 m-0 w-full">
      {rowCities.map((city, index) => {
        const globalIndex = startIndex + index
        return (
          <li key={globalIndex} className="flex-1 min-w-[120px] text-center">
            <span className="block py-5 text-black city-name">
              {city}
            </span>
            <span className="block py-5 text-black time-display">
              {times[globalIndex]}
            </span>
          </li>
        )
      })}
    </ul>
  )

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white py-8">
      <div className="w-full max-w-5xl px-4 flex flex-col gap-8">
        {renderRow(firstRowCities, 0)}
        {renderRow(secondRowCities, 10)}
      </div>
    </div>
  )
}

export default ClockDisplay

