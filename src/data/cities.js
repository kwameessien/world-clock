/**
 * Full list of cities with id, name, UTC offset, and timezone label.
 * Used for display, add-city picker, and persistence by id.
 */
export const ALL_CITIES = [
  { id: 'los-angeles', name: 'Los Angeles', offset: -8, label: 'PST' },
  { id: 'london', name: 'London', offset: 0, label: 'GMT' },
  { id: 'paris', name: 'Paris', offset: 1, label: 'CET' },
  { id: 'rome', name: 'Rome', offset: 1, label: 'CET' },
  { id: 'tokyo', name: 'Tokyo', offset: 9, label: 'JST' },
  { id: 'lahore', name: 'Lahore', offset: 5, label: 'PKT' },
  { id: 'accra', name: 'Accra', offset: 0, label: 'GMT' },
  { id: 'amsterdam', name: 'Amsterdam', offset: 1, label: 'CET' },
  { id: 'mexico-city', name: 'Mexico City', offset: -6, label: 'CST' },
  { id: 'milan', name: 'Milan', offset: 1, label: 'CET' },
  { id: 'new-york', name: 'New York', offset: -5, label: 'EST' },
  { id: 'sydney', name: 'Sydney', offset: 11, label: 'AEDT' },
  { id: 'dubai', name: 'Dubai', offset: 4, label: 'GST' },
  { id: 'singapore', name: 'Singapore', offset: 8, label: 'SGT' },
  { id: 'cairo', name: 'Cairo', offset: 2, label: 'EET' },
  { id: 'sao-paulo', name: 'São Paulo', offset: -3, label: 'BRT' },
  { id: 'toronto', name: 'Toronto', offset: -5, label: 'EST' },
  { id: 'berlin', name: 'Berlin', offset: 1, label: 'CET' },
  { id: 'mumbai', name: 'Mumbai', offset: 5, label: 'IST' },
  { id: 'bangkok', name: 'Bangkok', offset: 7, label: 'ICT' },
  { id: 'hong-kong', name: 'Hong Kong', offset: 8, label: 'HKT' },
  { id: 'moscow', name: 'Moscow', offset: 3, label: 'MSK' },
  { id: 'johannesburg', name: 'Johannesburg', offset: 2, label: 'SAST' },
  { id: 'seoul', name: 'Seoul', offset: 9, label: 'KST' },
  { id: 'beijing', name: 'Beijing', offset: 8, label: 'CST' },
  { id: 'madrid', name: 'Madrid', offset: 1, label: 'CET' },
  { id: 'istanbul', name: 'Istanbul', offset: 3, label: 'TRT' },
  { id: 'buenos-aires', name: 'Buenos Aires', offset: -3, label: 'ART' },
  { id: 'chicago', name: 'Chicago', offset: -6, label: 'CST' },
]

const defaultOrder = [
  'los-angeles', 'london', 'paris', 'rome', 'tokyo', 'lahore', 'accra', 'amsterdam', 'mexico-city', 'milan',
  'new-york', 'sydney', 'dubai', 'singapore', 'cairo', 'sao-paulo', 'toronto', 'berlin', 'mumbai', 'bangkok',
]

export function getDefaultCityIds() {
  return [...defaultOrder]
}

export function getCityById(id) {
  return ALL_CITIES.find((c) => c.id === id)
}

export function getCitiesByIds(ids) {
  const byId = Object.fromEntries(ALL_CITIES.map((c) => [c.id, c]))
  return ids.map((id) => byId[id]).filter(Boolean)
}
