import { NavLink } from 'react-router-dom'

function SettingsBar({ settings, onUpdate, onAddCity, onShare }) {
  const linkClass = ({ isActive }) =>
    `text-sm font-medium ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'}`

  return (
    <header className="sticky top-0 z-20 flex flex-wrap items-center gap-4 p-4 border-b border-gray-200 dark:border-gray-600 bg-white/90 dark:bg-gray-900/95 backdrop-blur">
      <nav className="flex items-center gap-3 mr-2">
        <NavLink to="/" end className={linkClass}>
          World Clock
        </NavLink>
        <NavLink to="/meeting-planner" className={linkClass}>
          Meeting planner
        </NavLink>
      </nav>

      <label className="flex items-center gap-2 cursor-pointer text-black dark:text-gray-100">
        <input
          type="checkbox"
          checked={settings.use12h}
          onChange={(e) => onUpdate({ use12h: e.target.checked })}
          className="rounded"
        />
        <span className="text-sm">12-hour</span>
      </label>

      <label className="flex items-center gap-2 cursor-pointer text-black dark:text-gray-100">
        <span className="text-sm">Theme</span>
        <select
          value={settings.theme}
          onChange={(e) => onUpdate({ theme: e.target.value })}
          className="rounded border border-gray-300 dark:bg-gray-700 dark:border-gray-500 dark:text-white px-2 py-1 text-sm"
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </label>

      <label className="flex items-center gap-2 cursor-pointer text-black dark:text-gray-100">
        <span className="text-sm">Font</span>
        <select
          value={settings.fontSize}
          onChange={(e) => onUpdate({ fontSize: e.target.value })}
          className="rounded border border-gray-300 dark:bg-gray-700 dark:border-gray-500 dark:text-white px-2 py-1 text-sm"
        >
          <option value="normal">Normal</option>
          <option value="large">Large</option>
        </select>
      </label>

      <label className="flex items-center gap-2 cursor-pointer text-black dark:text-gray-100">
        <input
          type="checkbox"
          checked={settings.compactView}
          onChange={(e) => onUpdate({ compactView: e.target.checked })}
          className="rounded"
        />
        <span className="text-sm">Compact</span>
      </label>

      <input
        type="search"
        placeholder="Search cities..."
        value={settings.searchQuery}
        onChange={(e) => onUpdate({ searchQuery: e.target.value })}
        className="rounded border border-gray-300 dark:bg-gray-700 dark:border-gray-500 dark:text-white dark:placeholder-gray-400 px-3 py-1.5 text-sm min-w-[160px]"
      />

      <button
        type="button"
        onClick={onAddCity}
        className="rounded bg-blue-600 text-white px-3 py-1.5 text-sm hover:bg-blue-700"
      >
        + Add city
      </button>

      <button
        type="button"
        onClick={onShare}
        className="rounded bg-gray-200 dark:bg-gray-600 dark:text-white px-3 py-1.5 text-sm hover:bg-gray-300 dark:hover:bg-gray-500"
      >
        Share link
      </button>
    </header>
  )
}

export default SettingsBar
