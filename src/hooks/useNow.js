import { useEffect, useState } from 'react'

/** Current time, refreshed on each second boundary. */
export function useNow() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    let timer
    const tick = () => {
      setNow(new Date())
      timer = setTimeout(tick, 1000 - (Date.now() % 1000))
    }
    timer = setTimeout(tick, 1000 - (Date.now() % 1000))
    return () => clearTimeout(timer)
  }, [])
  return now
}
