import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import Dial from '../components/Dial'
import { dialAnchor } from '../lib/dialGeometry'
import CityMenu from '../components/CityMenu'
import { formatClock, formatLongDate, zoned } from '../lib/time'

function HomeClock({ t, use12h }) {
  if (!use12h) return <p className="display">{formatClock(t.hour, t.minute, false)}</p>
  const [time, suffix] = formatClock(t.hour, t.minute, true).split(' ')
  return <p className="display">{time}<span className="ampm">{suffix}</span></p>
}

function DialPage() {
  const ctx = useOutletContext()
  const { now, settings, home, homeEntry, selected, clusters, entries, isMobile } = ctx
  const [menuFor, setMenuFor] = useState(null)
  const utc = zoned(now, 'UTC')

  const ids = settings.cityIds
  const menuEntry = entries.find((e) => e.city.id === menuFor)
  const actionsFor = (entry, extra) => (
    <CityMenu
      city={entry.city}
      isHome={entry.city.id === home.id}
      canMoveUp={ids.indexOf(entry.city.id) > 0}
      canMoveDown={ids.includes(entry.city.id) && ids.indexOf(entry.city.id) < ids.length - 1}
      onHome={() => { ctx.setHome(entry.city.id); setMenuFor(null) }}
      onMove={(dir) => ctx.moveCity(entry.city.id, dir)}
      onRemove={() => { ctx.removeCity(entry.city.id); setMenuFor(null) }}
      onClose={() => setMenuFor(null)}
      {...extra}
    />
  )

  const onSelect = (id) => {
    if (id !== home.id) ctx.select(id)
    setMenuFor(id)
  }

  const homeBlock = (
    <div className="home-block">
      <p className="caption">Home — {home.name}</p>
      <HomeClock t={homeEntry.t} use12h={settings.use12h} />
      <p className="data muted">{formatLongDate(now, home.tz)}<br />{homeEntry.zone}</p>
    </div>
  )

  const selectedBlock = selected ? (
    <div className="selected-block">
      <p className="caption signal-text">Selected — {selected.city.name}{isMobile ? `  ·  ${selected.diff}` : ''}</p>
      <p className="score">{selected.words} {selected.observation}</p>
      <p className="data muted">
        {selected.diff} from {home.name}  ·  {selected.relation}<br />{selected.zone}
      </p>
      {isMobile && actionsFor(selected, { inline: true })}
    </div>
  ) : (
    <div className="selected-block">
      <p className="caption">No other cities yet</p>
      <p className="score">The ring holds only {home.name}. Add a city and it takes its place at its own time.</p>
      <button type="button" className="data link" onClick={ctx.openAdd}>+ Add your first city</button>
    </div>
  )

  const dial = (
    <Dial clusters={clusters} home={home} selected={selected?.city} use12h={settings.use12h}
      utcClock={formatClock(utc.hour, utc.minute, settings.use12h)} compact={isMobile} onSelect={onSelect}>
      {!isMobile && menuEntry && actionsFor(menuEntry, { style: dialAnchor(menuEntry.t.hours, false) })}
    </Dial>
  )

  if (isMobile) {
    return (
      <div className="dial-page-mobile">
        {dial}
        {homeBlock}
        {selectedBlock}
        <ul className="city-list">
          {entries.map((e) => (
            <li key={e.city.id}>
              <button type="button" onClick={() => onSelect(e.city.id)}
                className={e.city.id === selected?.city.id ? 'is-selected' : undefined}>
                <span className="title">{e.city.name}</span>
                <span className="caption lower">{e.city.id === home.id ? 'home' : e.diff}</span>
                <span className="data">{e.clock}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  return (
    <div className="dial-page">
      <section className="home-col">
        {homeBlock}
        {selectedBlock}
      </section>
      <div className="dial-wrap">{dial}</div>
      <p className="legend caption">
        <span>Ring  night, 18:00–06:00</span>
        <span><i className="key key-work" /> working hours</span>
        <span><i className="key" /> outside hours</span>
        <span>Red  selected city</span>
      </p>
    </div>
  )
}

export default DialPage
