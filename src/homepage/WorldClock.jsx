import { useState, useEffect } from 'react'
import ClockDisplay from './ClockDisplay'

const cities = ['Los Angeles', 'London', 'Paris', 'Rome', 'Tokyo']
const timeZones = [-7, 1, 2, 2, 9] // UTC offsets

const fixLayout = (i) => {
  if (i < 10) {
    return "0" + i
  }
  return i
}

const convertHourByTimeZone = (h) => {
  const hourArr = []
  for (let i = 0; i < 5; i++) {
    let hour = h + timeZones[i]
    if (hour >= 24) {
      hour = hour - 24
    } else if (hour < 0) {
      hour = 24 + hour
    }
    hourArr.push(hour)
  }
  return hourArr
}

// Stateful component - manages clock state and logic
function WorldClock() {
  const [times, setTimes] = useState(['00:00:00', '00:00:00', '00:00:00', '00:00:00', '00:00:00'])

  useEffect(() => {
    const updateClock = () => {
      const today = new Date()
      const h = today.getUTCHours()
      const m = today.getUTCMinutes()
      const s = today.getUTCSeconds()

      const formattedM = fixLayout(m)
      const formattedS = fixLayout(s)

      const hoursArr = convertHourByTimeZone(h)
      const strArr = []

      for (let i = 0; i < 5; i++) {
        const str = hoursArr[i] + ':' + formattedM + ':' + formattedS
        strArr.push(str)
      }

      setTimes(strArr)
    }

    // Update immediately
    updateClock()

    // Update every 500ms
    const interval = setInterval(updateClock, 500)

    return () => clearInterval(interval)
  }, [])

  return <ClockDisplay cities={cities} times={times} />
}

export default WorldClock

