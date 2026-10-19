import { useOutletContext } from 'react-router-dom'
import { buildPlanner } from '../lib/model'
import { formatClock, formatHour, formatUtcOffset } from '../lib/time'

const pad = (n) => String(n).padStart(2, '0')

function cellLabel(cell, use12h) {
  if (cell.minute) return use12h ? formatClock(cell.hour, cell.minute, true).replace(/ (am|pm)/, '') : `${pad(cell.hour)}:${pad(cell.minute)}`
  return formatHour(cell.hour, use12h)
}

function headline(plan, home, total, use12h) {
  const w = plan.window
  if (!w) return `Nobody on your list is at work at the same time today.`
  const at = (h) => formatClock(h % 24, 0, use12h)
  const span = w.from === w.to
    ? `The best hour to meet is ${at(w.from)}`
    : `The best window to meet is ${at(w.from)}–${at(w.to + 1)}`
  return `${span} in ${home.name}: ${plan.best} of ${total} ${total === 1 ? 'city is' : 'cities are'} at work.`
}

function TablePage() {
  const { now, settings, home, cities, selected, entries, isMobile } = useOutletContext()
  const plan = buildPlanner(cities, now, home)
  const { window: w, nowColumn } = plan
  const use12h = settings.use12h
  const nowLabel = `Now ${entries.find((e) => e.city.id === home.id).clock}`

  const intro = (
    <div className="page-intro">
      <p className="caption">Table<br />Hours in {home.name} × {cities.length} {cities.length === 1 ? 'city' : 'cities'}</p>
      <p className="score">{headline(plan, home, cities.length, use12h)}</p>
    </div>
  )

  if (isMobile) {
    const pct = (h) => `${(h / 24) * 100}%`
    return (
      <div className="table-page">
        {intro}
        <div className="strips">
          {plan.rows.map((row) => {
            const e = entries.find((x) => x.city.id === row.city.id)
            return (
              <div key={row.city.id} className="strip-row">
                <p className="strip-line">
                  <span className={`title ${row.city.id === selected?.city.id ? 'signal-text' : ''}`}>{row.city.name}</span>
                  <span className="data muted">{e.clock}</span>
                </p>
                <div className="strip" aria-label={`${row.city.name}, hours across ${home.name}'s day`}>
                  {row.cells.map((cell, i) => <span key={i} className={`s-${cell.state}`} title={cellLabel(cell, use12h)} />)}
                </div>
              </div>
            )
          })}
          <div className="strip-axis caption">
            {[0, 6, 12, 18].map((h) => <span key={h} style={{ left: pct(h) }}>{formatHour(h, use12h)}</span>)}
          </div>
          {w && <div className="strip-best" style={{ left: pct(w.from), width: pct(w.to - w.from + 1) }} />}
          <div className="strip-now" style={{ left: pct(nowColumn), width: pct(1) }} />
        </div>
        <p className="caption strip-legend">
          {w && <>▢ Best {formatHour(w.from, use12h)}–{formatHour((w.to + 1) % 24, use12h)}    </>}
          <span className="signal-text">{nowLabel}</span>
        </p>
      </div>
    )
  }

  return (
    <div className="table-page">
      {intro}
      <div className="grid" role="table" aria-label={`Hours in ${home.name} across your cities`}>
        <div className="grid-row head" role="row">
          <span className="caption" role="columnheader">{home.name} →</span>
          <span className="caption" role="columnheader">UTC</span>
          {plan.counts.map((_, H) => (
            <span key={H} role="columnheader" className={`hcell ${H === nowColumn ? 'col-now col-top signal-text strong' : ''}`}>
              {formatHour(H, use12h)}
            </span>
          ))}
        </div>
        {plan.rows.map((row) => (
          <div key={row.city.id} className="grid-row" role="row">
            <span role="rowheader" className={`title ${row.city.id === selected?.city.id ? 'signal-text' : ''}`}>{row.city.name}</span>
            <span className="data muted">{formatUtcOffset(row.offset).replace('UTC', '')}</span>
            {row.cells.map((cell, H) => (
              <span key={H} role="cell" className={`cell s-${cell.state} ${H === nowColumn ? 'col-now' : ''}`}>
                {cellLabel(cell, use12h)}
              </span>
            ))}
          </div>
        ))}
        <div className="grid-row foot" role="row">
          <span className="caption">At work</span>
          <span />
          {plan.counts.map((n, H) => (
            <span key={H} className={`hcell ${w && H >= w.from && H <= w.to ? 'strong' : 'muted'} ${H === nowColumn ? 'col-now col-bottom' : ''}`}>{n}</span>
          ))}
        </div>
        <div className="grid-row notes">
          {w && (
            <span className="bracket" style={{ gridColumn: `${w.from + 3} / ${w.to + 4}` }}>
              <span className="caption ink">Best overlap  {formatHour(w.from, use12h)}–{formatHour((w.to + 1) % 24, use12h)}</span>
            </span>
          )}
        </div>
        <div className="grid-row notes">
          <span className="caption signal-text now-label" style={{ gridColumn: `${nowColumn + 3} / span 1` }}>{nowLabel}</span>
        </div>
      </div>
      <p className="legend caption">
        <span>Shaded  night, 18:00–06:00</span>
        <span>Yellow  working hours, 09:00–17:00 on weekdays</span>
        <span>Red  now</span>
      </p>
    </div>
  )
}

export default TablePage
