import { Link, NavLink } from 'react-router-dom'

const navClass = ({ isActive }) => (isActive ? 'on' : undefined)

function Pair({ left, right, rightOn, label, onClick }) {
  return (
    <button type="button" onClick={onClick} aria-label={label}>
      <span className={rightOn ? undefined : 'on'}>{left}</span> / <span className={rightOn ? 'on' : undefined}>{right}</span>
    </button>
  )
}

function Header({ meta, settings, onUpdate, onShare, onAddCity, addOpen, shareOn }) {
  return (
    <header className="hdr">
      <div className="hdr-id">
        <Link to="/" className="wordmark">World Clock</Link>
        <span className="hdr-meta">{meta}</span>
      </div>
      <nav className="hdr-nav" aria-label="Views and settings">
        <NavLink to="/" end className={navClass}>Dial</NavLink>
        <NavLink to="/table" className={navClass}>Table</NavLink>
        <NavLink to="/scores" className={navClass}>Scores</NavLink>
        <Pair left="24h" right="12h" rightOn={settings.use12h} label="Switch between 24-hour and 12-hour time"
          onClick={() => onUpdate({ use12h: !settings.use12h })} />
        <Pair left="Light" right="Dark" rightOn={settings.theme === 'dark'} label="Switch between light and dark"
          onClick={() => onUpdate({ theme: settings.theme === 'dark' ? 'light' : 'dark' })} />
        <button type="button" onClick={onShare} className={shareOn ? 'on' : undefined}>Share</button>
        <button type="button" onClick={onAddCity} className={addOpen ? 'on' : undefined}>+ Add city</button>
      </nav>
    </header>
  )
}

export default Header
