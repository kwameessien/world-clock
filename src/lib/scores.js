// The app's voice: a city's time written out in words, followed by one short
// observation. The words are generated; the observations are written by hand
// and picked deterministically, so a sentence holds still for the whole hour.

import { weekdayName } from './time'

const ONES = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
  'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen']
const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty']

export function numberWord(n) {
  if (n < 20) return ONES[n]
  return TENS[Math.floor(n / 10)] + (n % 10 ? `-${ONES[n % 10]}` : '')
}

function hourWord(h) {
  const h24 = ((h % 24) + 24) % 24
  if (h24 === 0) return 'midnight'
  if (h24 === 12) return 'noon'
  return ONES[h24 % 12 || 12]
}

function minutePhrase(m) {
  if (m === 15) return 'quarter'
  if (m === 30) return 'half'
  if (m % 5 === 0) return numberWord(m)
  return `${numberWord(m)} ${m === 1 ? 'minute' : 'minutes'}`
}

function period(h) {
  if (h < 12) return 'morning'
  if (h < 17) return 'afternoon'
  if (h < 21) return 'evening'
  return 'night'
}

/**
 * "Eighteen minutes to six on Wednesday morning."
 * The weekday is named only when the city is on a different day from home.
 */
export function timeInWords(hour, minute, { weekday, otherDay }) {
  const target = minute > 30 ? hour + 1 : hour
  let core
  if (minute === 0) core = hour === 0 || hour === 12 ? hourWord(hour) : `${hourWord(hour)} o’clock`
  else if (minute <= 30) core = `${minutePhrase(minute)} past ${hourWord(hour)}`
  else core = `${minutePhrase(60 - minute)} to ${hourWord(target)}`

  const t = ((target % 24) + 24) % 24
  let when = ''
  if (t !== 0 && t !== 12) {
    const p = period(hour)
    if (otherDay) when = ` on ${weekdayName(weekday)} ${p}`
    else when = p === 'night' ? ' at night' : ` in the ${p}`
  } else if (otherDay) {
    when = `, ${weekdayName(weekday)}`
  }
  const s = core + when
  return s.charAt(0).toUpperCase() + s.slice(1) + '.'
}

// Bands follow the shape of an ordinary day. Weekend variants replace the
// weekday line where the day is shaped differently.
const BANDS = [
  { id: 'small', from: 0, to: 4 },
  { id: 'dawn', from: 4, to: 6 },
  { id: 'early', from: 6, to: 8 },
  { id: 'commute', from: 8, to: 10 },
  { id: 'morning', from: 10, to: 12 },
  { id: 'lunch', from: 12, to: 14 },
  { id: 'afternoon', from: 14, to: 17 },
  { id: 'homeward', from: 17, to: 19 },
  { id: 'evening', from: 19, to: 22 },
  { id: 'late', from: 22, to: 24 },
]

const LINES = {
  small: [
    'Somebody is still making tea.',
    'The streets belong to the night buses.',
    'Most of the city is asleep.',
    'Only the bakeries are awake.',
    'A taxi waits at a red light with no one around.',
    'The last bars are putting chairs on tables.',
  ],
  dawn: [
    'The first trains are running.',
    'The sky is beginning to think about it.',
    'Delivery vans are doing their rounds.',
    'The birds have started before anyone else.',
    'Early shifts are pulling on their coats.',
  ],
  early: [
    'Kettles are on.',
    'The first emails are being ignored.',
    'Children are being found shoes.',
    'The radio is reading the news.',
    'Coffee is the only appointment so far.',
  ],
  commute: [
    'Everyone is on their way somewhere.',
    'The trains are full and quiet.',
    'Offices are filling up.',
    'Inboxes are being opened.',
    'The first meeting is about to start.',
  ],
  morning: [
    'Work is properly under way.',
    'The morning is half spent.',
    'Someone is already thinking about lunch.',
    'Markets are busy.',
    'The second coffee is being made.',
  ],
  lunch: [
    'Lunch is running long.',
    'Desks are empty for an hour.',
    'Queues are forming at the counters.',
    'The city stops to eat.',
    'Afternoon plans are being made over food.',
  ],
  afternoon: [
    'The afternoon is getting on.',
    'School is nearly out.',
    'Meetings are running into each other.',
    'The light is starting to lean.',
    'It is the long middle of the day.',
  ],
  homeward: [
    'The light is going early now.',
    'People are heading home.',
    'Offices are emptying.',
    'The evening rush has begun.',
    'Someone is deciding what to cook.',
  ],
  evening: [
    'Dinner is on the table.',
    'The heat has finally broken.',
    'Windows are lit up and down the street.',
    'The city has changed into its evening clothes.',
    'Television is doing the talking.',
  ],
  late: [
    'The city is still awake.',
    'Tomorrow is being postponed.',
    'The last trains are thinning out.',
    'Lights are going off one by one.',
  ],
}

const WEEKEND_LINES = {
  early: ['Nobody has set an alarm.', 'The streets are still quiet for the weekend.'],
  commute: ['The weekend is having a slow start.', 'Breakfast is taking its time.'],
  morning: ['Markets are busy with the weekend.', 'There is nowhere to be.'],
  afternoon: ['The weekend is stretching out.', 'Parks are full.'],
}

// A few lines that only make sense in one place. Used when they exist.
const CITY_LINES = {
  tokyo: { dawn: ['The first trains are running.'], late: ['The last trains are leaving.'] },
  'mexico-city': { lunch: ['The comida is only just beginning.'], afternoon: ['The comida is still going.'] },
  singapore: { dawn: ['The hawker stalls are not yet lit.'], evening: ['The hawker centres are full.'] },
  accra: { evening: ['The heat has finally broken.'] },
  amsterdam: { late: ['The bicycles are going home.'], commute: ['The bike lanes are full.'] },
  lahore: { small: ['Somebody is still making tea.'] },
  cairo: { late: ['The city is still awake.'], small: ['The city is only now slowing down.'] },
  'new-york': { homeward: ['The subway is packed.'] },
}

function hash(str) {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

export function observation(cityId, t, weekend) {
  const band = BANDS.find((b) => t.hour >= b.from && t.hour < b.to).id
  const cityLines = CITY_LINES[cityId]?.[band] || []
  const weekendLines = weekend ? WEEKEND_LINES[band] || [] : []
  // City lines count twice so they win more often than not.
  const pool = [...cityLines, ...cityLines, ...weekendLines, ...weekendLines, ...LINES[band]]
  return pool[hash(`${cityId}|${t.dayNumber}|${t.hour}`) % pool.length]
}
