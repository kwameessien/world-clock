import { useOutletContext } from 'react-router-dom'
import { formatUtcOffset } from '../lib/time'
import { numberWord } from '../lib/scores'

const capital = (s) => s.charAt(0).toUpperCase() + s.slice(1)

function ScoresPage() {
  const { home, homeEntry, entries, selected, settings } = useOutletContext()
  const n = entries.length
  const count = n < 60 ? numberWord(n) : String(n)

  return (
    <div className="scores-page">
      <div className="page-intro">
        <p className="caption">Scores<br />{homeEntry.clock} in {home.name}</p>
        <h1 className="display">{capital(count)} {n === 1 ? 'city' : 'cities'},<br />one minute, read aloud.</h1>
      </div>
      <ol className="scores">
        {entries.map((e, i) => {
          const isHome = e.city.id === home.id
          return (
            <li key={e.city.id} className={e.city.id === selected?.city.id ? 'signal-text' : undefined}>
              <span className="caption idx">{String(i + 1).padStart(2, '0')}</span>
              <span className="caption city">{e.city.name}</span>
              <p className="score">{e.city.name}. {e.words} {isHome ? 'You are here.' : e.observation}</p>
              <span className="caption time">{e.clock}  {formatUtcOffset(e.t.offset)}</span>
            </li>
          )
        })}
      </ol>
      {settings.cityIds.length === 0 && (
        <p className="data muted">Add cities to hear what time it is there.</p>
      )}
    </div>
  )
}

export default ScoresPage
