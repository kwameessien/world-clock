import { useState, useEffect } from 'react'
import ClockDisplay from './ClockDisplay'

/**
 * Array of city names displayed in the world clock.
 * The order corresponds to the timeZones array below.
 */
const cities = ['Los Angeles', 'London', 'Paris', 'Rome', 'Tokyo', 'Lahore', 'Accra', 'Amsterdam', 'Mexico City', 'Milan']

/**
 * UTC timezone offsets for each city in hours.
 * Negative values are behind UTC, positive values are ahead.
 * Order: Los Angeles (-7), London (+1), Paris (+2), Rome (+2), Tokyo (+9),
 *        Lahore (+5), Accra (0), Amsterdam (+1), Mexico City (-6), Milan (+1)
 */
const timeZones = [-7, 1, 2, 2, 9, 5, 0, 1, -6, 1] // UTC offsets

/**
 * Formats a number to always have 2 digits with a leading zero if needed.
 * This ensures consistent time display format (e.g., "09" instead of "9").
 * 
 * @param {number} i - The number to format (minutes or seconds)
 * @returns {string} - The formatted string with leading zero if needed
 */
const fixLayout = (i) => {
  if (i < 10) {
    return "0" + i
  }
  return i
}

/**
 * Converts UTC hour to local hours for all cities based on their timezone offsets.
 * Handles day rollover (hours >= 24 or < 0) by wrapping around the 24-hour clock.
 * 
 * @param {number} h - The current UTC hour (0-23)
 * @returns {number[]} - Array of local hours for each city
 */
const convertHourByTimeZone = (h) => {
  const hourArr = []
  for (let i = 0; i < cities.length; i++) {
    // Add the timezone offset to UTC hour
    let hour = h + timeZones[i]
    
    // Handle day rollover: if hour is 24 or more, subtract 24 (next day)
    if (hour >= 24) {
      hour = hour - 24
    } 
    // Handle previous day: if hour is negative, add 24 (previous day)
    else if (hour < 0) {
      hour = 24 + hour
    }
    hourArr.push(hour)
  }
  return hourArr
}

/**
 * Stateful component that manages the world clock logic and state.
 * 
 * This component:
 * - Maintains the current time for all cities in state
 * - Updates the clock every 500ms for smooth second-by-second display
 * - Calculates local times based on UTC and timezone offsets
 * - Passes the calculated times to the stateless ClockDisplay component
 */
function WorldClock() {
  /**
   * State to store the formatted time strings for all cities.
   * Initialized with placeholder values that will be updated immediately on mount.
   * Format: "HH:MM:SS" for each city
   */
  const [times, setTimes] = useState(Array(cities.length).fill('00:00:00'))

  /**
   * useEffect hook that sets up and manages the clock update interval.
   * Runs once on component mount (empty dependency array).
   * 
   * The updateClock function:
   * 1. Gets the current UTC time
   * 2. Formats minutes and seconds with leading zeros
   * 3. Converts UTC hour to local hours for each city
   * 4. Combines hours, minutes, and seconds into formatted time strings
   * 5. Updates the state with the new times
   */
  useEffect(() => {
    const updateClock = () => {
      // Get current UTC date and time
      const today = new Date()
      const h = today.getUTCHours()      // UTC hour (0-23)
      const m = today.getUTCMinutes()    // UTC minutes (0-59)
      const s = today.getUTCSeconds()    // UTC seconds (0-59)

      // Format minutes and seconds to always have 2 digits
      const formattedM = fixLayout(m)
      const formattedS = fixLayout(s)

      // Convert UTC hour to local hours for each city
      const hoursArr = convertHourByTimeZone(h)
      const strArr = []

      // Build formatted time strings for each city: "HH:MM:SS"
      for (let i = 0; i < cities.length; i++) {
        // Format hour with leading zero if needed
        const formattedH = fixLayout(hoursArr[i])
        const str = formattedH + ':' + formattedM + ':' + formattedS
        strArr.push(str)
      }

      // Update state with the new times, triggering a re-render
      setTimes(strArr)
    }

    // Update immediately when component mounts (no delay for first render)
    updateClock()

    // Set up interval to update clock every 500ms for smooth updates
    const interval = setInterval(updateClock, 500)

    // Cleanup: clear the interval when component unmounts to prevent memory leaks
    return () => clearInterval(interval)
  }, [])

  // Render the stateless display component with cities and calculated times
  return <ClockDisplay cities={cities} times={times} />
}

export default WorldClock

