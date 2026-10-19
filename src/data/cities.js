/**
 * Cities the app knows about. Each city carries an IANA time zone, so offsets
 * and daylight saving come from the browser (Intl), never from a fixed number.
 * `weekend` lists local weekday numbers (0 = Sunday) where it differs from Sat/Sun.
 * Ids are stable: they are stored in localStorage and in share links.
 */
export const ALL_CITIES = [
  { id: 'los-angeles', name: 'Los Angeles', country: 'United States', tz: 'America/Los_Angeles' },
  { id: 'san-francisco', name: 'San Francisco', country: 'United States', tz: 'America/Los_Angeles' },
  { id: 'vancouver', name: 'Vancouver', country: 'Canada', tz: 'America/Vancouver' },
  { id: 'denver', name: 'Denver', country: 'United States', tz: 'America/Denver' },
  { id: 'mexico-city', name: 'Mexico City', country: 'Mexico', tz: 'America/Mexico_City' },
  { id: 'chicago', name: 'Chicago', country: 'United States', tz: 'America/Chicago' },
  { id: 'toronto', name: 'Toronto', country: 'Canada', tz: 'America/Toronto' },
  { id: 'new-york', name: 'New York', country: 'United States', tz: 'America/New_York' },
  { id: 'bogota', name: 'Bogotá', country: 'Colombia', tz: 'America/Bogota' },
  { id: 'lima', name: 'Lima', country: 'Peru', tz: 'America/Lima' },
  { id: 'santiago', name: 'Santiago', country: 'Chile', tz: 'America/Santiago' },
  { id: 'buenos-aires', name: 'Buenos Aires', country: 'Argentina', tz: 'America/Argentina/Buenos_Aires' },
  { id: 'sao-paulo', name: 'São Paulo', country: 'Brazil', tz: 'America/Sao_Paulo' },
  { id: 'reykjavik', name: 'Reykjavík', country: 'Iceland', tz: 'Atlantic/Reykjavik' },
  { id: 'accra', name: 'Accra', country: 'Ghana', tz: 'Africa/Accra' },
  { id: 'lagos', name: 'Lagos', country: 'Nigeria', tz: 'Africa/Lagos' },
  { id: 'dakar', name: 'Dakar', country: 'Senegal', tz: 'Africa/Dakar' },
  { id: 'london', name: 'London', country: 'United Kingdom', tz: 'Europe/London' },
  { id: 'dublin', name: 'Dublin', country: 'Ireland', tz: 'Europe/Dublin' },
  { id: 'lisbon', name: 'Lisbon', country: 'Portugal', tz: 'Europe/Lisbon' },
  { id: 'madrid', name: 'Madrid', country: 'Spain', tz: 'Europe/Madrid' },
  { id: 'paris', name: 'Paris', country: 'France', tz: 'Europe/Paris' },
  { id: 'amsterdam', name: 'Amsterdam', country: 'Netherlands', tz: 'Europe/Amsterdam' },
  { id: 'berlin', name: 'Berlin', country: 'Germany', tz: 'Europe/Berlin' },
  { id: 'milan', name: 'Milan', country: 'Italy', tz: 'Europe/Rome' },
  { id: 'rome', name: 'Rome', country: 'Italy', tz: 'Europe/Rome' },
  { id: 'sarajevo', name: 'Sarajevo', country: 'Bosnia & Herzegovina', tz: 'Europe/Sarajevo' },
  { id: 'stockholm', name: 'Stockholm', country: 'Sweden', tz: 'Europe/Stockholm' },
  { id: 'athens', name: 'Athens', country: 'Greece', tz: 'Europe/Athens' },
  { id: 'cairo', name: 'Cairo', country: 'Egypt', tz: 'Africa/Cairo', weekend: [5, 6] },
  { id: 'johannesburg', name: 'Johannesburg', country: 'South Africa', tz: 'Africa/Johannesburg' },
  { id: 'nairobi', name: 'Nairobi', country: 'Kenya', tz: 'Africa/Nairobi' },
  { id: 'istanbul', name: 'Istanbul', country: 'Türkiye', tz: 'Europe/Istanbul' },
  { id: 'moscow', name: 'Moscow', country: 'Russia', tz: 'Europe/Moscow' },
  { id: 'saint-petersburg', name: 'Saint Petersburg', country: 'Russia', tz: 'Europe/Moscow' },
  { id: 'tel-aviv', name: 'Tel Aviv', country: 'Israel', tz: 'Asia/Jerusalem', weekend: [5, 6] },
  { id: 'riyadh', name: 'Riyadh', country: 'Saudi Arabia', tz: 'Asia/Riyadh', weekend: [5, 6] },
  { id: 'dubai', name: 'Dubai', country: 'United Arab Emirates', tz: 'Asia/Dubai' },
  { id: 'tehran', name: 'Tehran', country: 'Iran', tz: 'Asia/Tehran', weekend: [5] },
  { id: 'karachi', name: 'Karachi', country: 'Pakistan', tz: 'Asia/Karachi' },
  { id: 'lahore', name: 'Lahore', country: 'Pakistan', tz: 'Asia/Karachi' },
  { id: 'mumbai', name: 'Mumbai', country: 'India', tz: 'Asia/Kolkata' },
  { id: 'delhi', name: 'Delhi', country: 'India', tz: 'Asia/Kolkata' },
  { id: 'kathmandu', name: 'Kathmandu', country: 'Nepal', tz: 'Asia/Kathmandu' },
  { id: 'dhaka', name: 'Dhaka', country: 'Bangladesh', tz: 'Asia/Dhaka' },
  { id: 'bangkok', name: 'Bangkok', country: 'Thailand', tz: 'Asia/Bangkok' },
  { id: 'jakarta', name: 'Jakarta', country: 'Indonesia', tz: 'Asia/Jakarta' },
  { id: 'singapore', name: 'Singapore', country: 'Singapore', tz: 'Asia/Singapore' },
  { id: 'hong-kong', name: 'Hong Kong', country: 'China', tz: 'Asia/Hong_Kong' },
  { id: 'beijing', name: 'Beijing', country: 'China', tz: 'Asia/Shanghai' },
  { id: 'taipei', name: 'Taipei', country: 'Taiwan', tz: 'Asia/Taipei' },
  { id: 'manila', name: 'Manila', country: 'Philippines', tz: 'Asia/Manila' },
  { id: 'seoul', name: 'Seoul', country: 'South Korea', tz: 'Asia/Seoul' },
  { id: 'tokyo', name: 'Tokyo', country: 'Japan', tz: 'Asia/Tokyo' },
  { id: 'sapporo', name: 'Sapporo', country: 'Japan', tz: 'Asia/Tokyo' },
  { id: 'perth', name: 'Perth', country: 'Australia', tz: 'Australia/Perth' },
  { id: 'sydney', name: 'Sydney', country: 'Australia', tz: 'Australia/Sydney' },
  { id: 'melbourne', name: 'Melbourne', country: 'Australia', tz: 'Australia/Melbourne' },
  { id: 'auckland', name: 'Auckland', country: 'New Zealand', tz: 'Pacific/Auckland' },
  { id: 'honolulu', name: 'Honolulu', country: 'United States', tz: 'Pacific/Honolulu' },
]

const DEFAULT_IDS = [
  'los-angeles', 'mexico-city', 'new-york', 'accra', 'london', 'amsterdam',
  'cairo', 'dubai', 'lahore', 'singapore', 'tokyo', 'sydney',
]

const BY_ID = Object.fromEntries(ALL_CITIES.map((c) => [c.id, c]))

/** The visitor's own zone, used as home when it is not one of the listed cities. */
export function localCity() {
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
  const name = tz.split('/').pop().replace(/_/g, ' ')
  return { id: 'local', name, country: 'Your time zone', tz }
}

export function getDefaultCityIds() {
  return [...DEFAULT_IDS]
}

/** Home defaults to a listed city in the visitor's zone, else their zone itself. */
export function getDefaultHomeId() {
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
  const match = ALL_CITIES.find((c) => c.tz === tz && DEFAULT_IDS.includes(c.id)) || ALL_CITIES.find((c) => c.tz === tz)
  return match ? match.id : 'local'
}

export function getCityById(id) {
  if (id === 'local') return localCity()
  return BY_ID[id]
}

export function getCitiesByIds(ids) {
  return ids.map(getCityById).filter(Boolean)
}
