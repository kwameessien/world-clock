import { formatHour } from '../lib/time'
import { SIZES, angle, rad, point } from '../lib/dialGeometry'

function ringBand(c, R, inner) {
  // Night band from 18:00 through midnight to 06:00, drawn as two half arcs.
  const [o1, o2, o3] = [18, 0, 6].map((h) => point(c, R, h))
  const [i3, i2, i1] = [6, 0, 18].map((h) => point(c, inner, h))
  return `M${o1} A${R} ${R} 0 0 1 ${o2} A${R} ${R} 0 0 1 ${o3} L${i3} A${inner} ${inner} 0 0 0 ${i2} A${inner} ${inner} 0 0 0 ${i1} Z`
}

function Dial({ clusters, home, selected, use12h, utcClock, compact, onSelect, children }) {
  const g = compact ? SIZES.compact : SIZES.full
  const c = g.size / 2
  const inner = g.R - g.band
  const homeEntry = clusters.flatMap((cl) => cl.entries).find((e) => e.city.id === home.id)
  const selEntry = selected && clusters.flatMap((cl) => cl.entries).find((e) => e.city.id === selected.id)

  const ticks = []
  for (let q = 0; q < 96; q++) {
    const major = q % 4 === 0
    const [x1, y1] = point(c, g.R, q / 4)
    const [x2, y2] = point(c, major ? inner : g.R - (compact ? 4 : 7), q / 4)
    ticks.push(<line key={q} x1={x1} y1={y1} x2={x2} y2={y2} className={major ? 'tick-major' : 'tick-minor'} />)
  }

  let arc = null
  if (homeEntry && selEntry) {
    const diffH = selEntry.diffMinutes / 60
    const [ax, ay] = point(c, g.arc, homeEntry.t.hours)
    const [bx, by] = point(c, g.arc, selEntry.t.hours)
    const large = Math.abs(diffH) * 15 > 180 ? 1 : 0
    const [dx, dy] = point(c, g.diffAt, homeEntry.t.hours + diffH / 2)
    arc = (
      <g className="signal">
        <path d={`M${ax} ${ay} A${g.arc} ${g.arc} 0 ${large} ${diffH > 0 ? 1 : 0} ${bx} ${by}`} className="arc" />
        <circle cx={bx} cy={by} r={compact ? 2 : 3} className="fill-signal" />
        <text x={dx} y={dy} className={compact ? 'svg-caption' : 'svg-data'} textAnchor="middle" dominantBaseline="central">
          {selEntry.diff}
        </text>
      </g>
    )
  }

  return (
    <div className={`dial ${compact ? 'dial-compact' : ''}`}>
      <svg viewBox={`0 0 ${g.size} ${g.size}`} role="img" aria-label="24-hour dial with each city at its local time">
        <path d={ringBand(c, g.R, inner)} className="fill-night" />
        <circle cx={c} cy={c} r={g.R} className="ring" />
        <circle cx={c} cy={c} r={inner} className="ring-inner" />
        {ticks}

        {Array.from({ length: 24 }, (_, h) => {
          if (compact && h % 6 !== 0) return null
          const [x, y] = point(c, inner - g.numeralGap, h)
          return (
            <text key={h} x={x} y={y} textAnchor="middle" dominantBaseline="central"
              className={`svg-caption ${h % 6 === 0 ? 'ink' : ''}`}>{formatHour(h, use12h)}</text>
          )
        })}

        {homeEntry && selEntry && (() => {
          const [hx, hy] = point(c, g.R, homeEntry.t.hours)
          const [sx, sy] = point(c, g.R, selEntry.t.hours)
          return (
            <>
              <line x1={c} y1={c} x2={hx} y2={hy} className="spoke" />
              <line x1={c} y1={c} x2={sx} y2={sy} className="spoke signal" />
            </>
          )
        })()}
        {arc}
        <circle cx={c} cy={c} r={compact ? 2.5 : 3.5} className="fill-ink" />
        {!compact && (
          <text x={c} y={c + 22} textAnchor="middle" className="svg-caption">UTC {utcClock}</text>
        )}

        {clusters.map((cl) => {
          const deg = angle(cl.hours)
          const [px, py] = point(c, g.R, cl.hours)
          const [lx, ly] = point(c, g.R + g.labelGap, cl.hours)
          const right = Math.cos(rad(deg)) >= -0.001
          const isSel = cl.entries.some((e) => e.city.id === selected?.id)
          const names = compact
            ? [cl.entries[0].city.name + (cl.entries.length > 1 ? ` +${cl.entries.length - 1}` : '')]
            : cl.entries.map((e) => e.city.name)
          const work = cl.entries.some((e) => e.state === 'work')
          const next = () => {
            const i = cl.entries.findIndex((e) => e.city.id === selected?.id)
            onSelect(cl.entries[(i + 1) % cl.entries.length].city.id)
          }
          return (
            <g key={cl.entries.map((e) => e.city.id).join()} className={`city ${isSel ? 'is-selected' : ''}`}
              role="button" tabIndex={0}
              aria-label={cl.entries.map((e) => `${e.city.name}, ${e.clock}`).join('; ')}
              onClick={next}
              onKeyDown={(ev) => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); next() } }}>
              {/* Generous invisible hit area along the label, under the text */}
              <line x1={px} y1={py} x2={point(c, g.R + (compact ? 70 : 160), cl.hours)[0]}
                y2={point(c, g.R + (compact ? 70 : 160), cl.hours)[1]} className="hit" />
              <circle cx={px} cy={py} r={g.dot}
                className={isSel ? 'dot dot-selected' : work ? 'dot dot-work' : 'dot'} />
              {cl.entries.some((e) => e.city.id === home.id) && (
                <circle cx={px} cy={py} r={g.home} className="dot-home" />
              )}
              <text transform={`translate(${lx} ${ly}) rotate(${right ? deg : deg + 180})`}
                textAnchor={right ? 'start' : 'end'} dominantBaseline="central">
                {names.map((n, i) => (
                  <tspan key={n} className={compact ? 'svg-caption label-name' : 'svg-label label-name'}
                    onClick={compact ? undefined : (ev) => { ev.stopPropagation(); onSelect(cl.entries[i].city.id) }}>
                    {i > 0 ? ' · ' : ''}{n}
                  </tspan>
                ))}
                {!compact && <tspan className="svg-data label-time">{'  '}{cl.clock}</tspan>}
              </text>
            </g>
          )
        })}
      </svg>
      {children}
    </div>
  )
}

export default Dial
