// Stateless component - receives cities and times as props
function ClockDisplay({ cities, times }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="clock-container w-full max-w-5xl px-4">
        <ul className="flex justify-center items-center list-none p-0 m-0">
          {cities.map((city, index) => (
            <li key={index} className="flex-1 text-center">
              <span className="block py-5 text-black text-xl font-sans">
                {city}
              </span>
              <span className="block py-5 text-black text-xl font-sans">
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

