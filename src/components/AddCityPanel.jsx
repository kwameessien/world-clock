import { useEffect, useMemo, useRef, useState } from 'react'
import { ALL_CITIES } from '../data/cities'
import { zoned, formatClock, formatDiff } from '../lib/time'

const fold = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

function search(query) {
  const q = fold(query.trim())
  if (!q) return ALL_CITIES
  const starts = [], contains = []
  for (const c of ALL_CITIES) {
    const name = fold(c.name)
    if (name.startsWith(q)) starts.push(c)
    else if (name.includes(q) || fold(c.country).includes(q)) contains.push(c)
  }
  return [...starts, ...contains]
}

/** The typed letters are set in ink, the rest of the name muted. */
function Highlight({ name, query }) {
  const q = fold(query.trim())
  const i = q ? fold(name).indexOf(q) : -1
  if (i < 0) return <span className="muted-name">{name}</span>
  return (
    <>
      <span className="muted-name">{name.slice(0, i)}</span>
      {name.slice(i, i + q.length)}
      <span className="muted-name">{name.slice(i + q.length)}</span>
    </>
  )
}

function AddCityPanel({ cityIds, home, now, use12h, onAdd, onClose }) {
  const [query, setQuery] = useState('')
  const [focus, setFocus] = useState(0)
  const inputRef = useRef(null)
  const listRef = useRef(null)
  const results = useMemo(() => search(query), [query])
  const homeOffset = zoned(now, home.tz).offset

  useEffect(() => { inputRef.current?.focus() }, [])
  useEffect(() => {
    listRef.current?.querySelector('[data-focus="true"]')?.scrollIntoView({ block: 'nearest' })
  }, [focus])

  const onKeyDown = (e) => {
    if (e.key === 'Escape') onClose()
    else if (e.key === 'ArrowDown') { e.preventDefault(); setFocus((f) => Math.min(f + 1, results.length - 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setFocus((f) => Math.max(f - 1, 0)) }
    else if (e.key === 'Enter' && results[focus]) { e.preventDefault(); onAdd(results[focus].id) }
  }

  return (
    <div className="add-layer" onKeyDown={onKeyDown}>
      <div className="add-scrim" onClick={onClose} aria-hidden="true" />
      <section className="add-panel" role="dialog" aria-modal="true" aria-label="Add a city">
        <div className="add-top">
          <span className="caption">Add a city — search {ALL_CITIES.length}</span>
          <button type="button" className="caption" onClick={onClose}>Esc close</button>
        </div>
        <label className="add-field">
          <span className="visually-hidden">City name</span>
          <input ref={inputRef} value={query} placeholder="Type a city"
            onChange={(e) => { setQuery(e.target.value); setFocus(0) }} />
        </label>
        <p className="caption add-count">
          {results.length} {results.length === 1 ? 'match' : 'matches'} · {cityIds.length} {cityIds.length === 1 ? 'city' : 'cities'} on your dial
        </p>
        <ul className="add-results" ref={listRef}>
          {results.map((c, i) => {
            const t = zoned(now, c.tz)
            const onDial = cityIds.includes(c.id)
            return (
              <li key={c.id} data-focus={i === focus} className={i === focus ? 'focus' : undefined}
                onMouseEnter={() => setFocus(i)}>
                <button type="button" disabled={onDial} onClick={() => onAdd(c.id)}>
                  <span className="add-name"><Highlight name={c.name} query={query} /></span>
                  <span className="caption add-country">{c.country}</span>
                  <span className="data muted">{formatClock(t.hour, t.minute, use12h)}  {formatDiff(t.offset - homeOffset)}</span>
                  <span className="data add-action">{onDial ? 'On dial' : i === focus ? '↵ Add' : '+ Add'}</span>
                </button>
              </li>
            )
          })}
        </ul>
        <p className="caption add-keys">↑ ↓ move    ↵ add to dial    Esc close</p>
      </section>
    </div>
  )
}

export default AddCityPanel
