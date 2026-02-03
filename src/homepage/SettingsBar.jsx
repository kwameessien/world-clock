function SettingsBar({ settings, onUpdate, onAddCity, onShare }) {
  return (
    <header className="sticky top-0 z-20 flex flex-wrap items-center gap-4 p-4 border-b border-gray-200 dark:border-gray-700 bg-white/90 dark:bg-gray-900/90 backdrop-blur">
      <h1 className="text-xl font-semibold mr-4">World Clock</h1>

      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={settings.use12h}
          onChange={(e) => onUpdate({ use12h: e.target.checked })}
          className="rounded"
        />
        <span className="text-sm">12-hour</span>
      </label>

      <label className="flex items-center gap-2 cursor-pointer">
        <span className="text-sm">Theme</span>
        <select
          value={settings.theme}
          onChange={(e) => onUpdate({ theme: e.target.value })}
          className="rounded border dark:bg-gray-800 dark:border-gray-600 px-2 py-1 text-sm"
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </label>

      <label className="flex items-center gap-2 cursor-pointer">
        <span className="text-sm">Font</span>
        <select
          value={settings.fontSize}
          onChange={(e) => onUpdate({ fontSize: e.target.value })}
          className="rounded border dark:bg-gray-800 dark:border-gray-600 px-2 py-1 text-sm"
        >
          <option value="normal">Normal</option>
          <option value="large">Large</option>
        </select>
      </label>

      <label className="flex items-center gap-2 cursor-pointer">
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
        className="rounded border dark:bg-gray-800 dark:border-gray-600 px-3 py-1.5 text-sm min-w-[160px]"
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
        className="rounded bg-gray-200 dark:bg-gray-700 px-3 py-1.5 text-sm hover:bg-gray-300 dark:hover:bg-gray-600"
      >
        Share link
      </button>
    </header>
  )
}

export default SettingsBar
