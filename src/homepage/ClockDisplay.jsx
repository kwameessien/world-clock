import '../App.css'

// Stateless component - receives cities and times as props
function ClockDisplay({ cities, times }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-5xl px-4">
        <ul className="flex flex-wrap justify-center items-center list-none p-0 m-0">
          {cities.map((city, index) => (
            <li key={index} className="flex-1 min-w-[120px] text-center">
              <span className="block py-5 text-black city-name">
                {city}
              </span>
              <span className="block py-5 text-black time-display">
                {times[index]}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default ClockDisplay

