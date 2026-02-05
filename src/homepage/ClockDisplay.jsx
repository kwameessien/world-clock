import { useState } from 'react'
import '../App.css'

function ClockDisplay({ displayData = [], settings, onToggleFavorite, onSetHome, onRemoveCity, onMoveCity }) {
  const [copiedId, setCopiedId] = useState(null)
  const theme = settings?.theme ?? 'light'
  const fontSize = settings?.fontSize ?? 'normal'
  const compact = settings?.compactView ?? false
  const isDark = theme === 'dark'

  const half = Math.ceil(displayData.length / 2)
  const firstRow = displayData.slice(0, half)
  const secondRow = displayData.slice(half)

  const textSize = fontSize === 'large' ? 'text-lg' : 'text-base'
  const py = compact ? 'py-2' : 'py-5'

  const copyTime = (d) => {
    const text = `${d.city.name}: ${d.time} ${d.timezoneLabel}`
    navigator.clipboard?.writeText(text).then(() => {
      setCopiedId(d.city.id)
      setTimeout(() => setCopiedId(null), 1500)
    }).catch(() => {})
  }

  const renderItem = (d, globalIndex, keyPrefix) => (
    <li
      key={`${keyPrefix}-${d.city.id}`}
      className={`flex-shrink-0 min-w-[160px] text-center px-4 rounded-lg transition-colors ${
        d.isHome ? (isDark ? 'bg-blue-900/40 ring-1 ring-blue-500' : 'bg-blue-50 ring-1 ring-blue-300') : ''
      }`}
    >
      <div className="flex items-center justify-center gap-1">
        <button
          type="button"
          onClick={() => onToggleFavorite(d.city.id)}
          className="p-0.5 rounded hover:bg-black/10 dark:hover:bg-white/10"
          title={d.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          aria-label="Toggle favorite"
        >
          {d.isFavorite ? '★' : '☆'}
        </button>
        <button
          type="button"
          onClick={() => onSetHome(d.city.id)}
          className={`text-xs hover:opacity-100 ${isDark ? 'text-gray-300 opacity-90' : 'opacity-70'}`}
          title="Set as my location"
        >
          {d.isHome ? '🏠' : '⌂'}
        </button>
        <button
          type="button"
          onClick={() => onRemoveCity(d.city.id)}
          className={`text-xs hover:opacity-100 hover:text-red-500 ${isDark ? 'text-gray-300 opacity-90' : 'opacity-50'}`}
          title="Remove city"
        >
          ✕
        </button>
        <button
          type="button"
          onClick={() => copyTime(d)}
          className={`text-xs hover:opacity-100 ${isDark ? 'text-gray-300 opacity-90' : 'text-gray-600 opacity-70'}`}
          title="Copy time"
          aria-label="Copy time"
        >
          {copiedId === d.city.id ? '✓' : '📋'}
        </button>
      </div>
      <div
        className={`${py} ${textSize} ${isDark ? 'text-white font-medium' : 'text-black'} city-name`}
        title={`${d.city.name} (${d.timezoneLabel}) • ${d.date} • ${d.time}${d.isBusinessHours ? ' • Business hours' : ''}`}
      >
        {d.city.name}
      </div>
      <div className={`${py} ${textSize} ${isDark ? 'text-white' : 'text-black'} time-display`}>
        {d.time}
      </div>
      {!compact && (
        <>
          <div className={`text-xs ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>{d.date}</div>
          <div className={`text-xs ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            {d.timezoneLabel} (UTC{d.offsetHours >= 0 ? '+' : ''}{d.offsetHours})
          </div>
        </>
      )}
      <div className="flex items-center justify-center gap-1 mt-1">
        <span title={d.isDay ? 'Day' : 'Night'} className="text-sm">
          {d.isDay ? '☀️' : '🌙'}
        </span>
        {d.isBusinessHours && (
          <span className="text-xs bg-green-500/30 text-green-800 dark:bg-green-500/30 dark:text-green-100 px-1.5 py-0.5 rounded font-medium">
            Work
          </span>
        )}
      </div>
      <div className="flex justify-center gap-1 mt-1">
        <button
          type="button"
          onClick={() => onMoveCity(d.city.id, 'up')}
          className={`text-xs hover:opacity-100 ${isDark ? 'text-gray-300 opacity-90' : 'text-gray-600 opacity-60'}`}
          title="Move up"
        >
          ↑
        </button>
        <button
          type="button"
          onClick={() => onMoveCity(d.city.id, 'down')}
          className={`text-xs hover:opacity-100 ${isDark ? 'text-gray-300 opacity-90' : 'text-gray-600 opacity-60'}`}
          title="Move down"
        >
          ↓
        </button>
      </div>
    </li>
  )

  const renderRowContent = (rowData, startIndex, keyPrefix) => (
    <>
      {rowData.map((d, index) => renderItem(d, startIndex + index, keyPrefix))}
      {rowData.map((d, index) => renderItem(d, startIndex + index, `${keyPrefix}-dup`))}
    </>
  )

  if (displayData.length === 0) {
    return (
      <div className={`min-h-[40vh] flex items-center justify-center ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
        <p>No cities. Use “Add city” or clear search.</p>
      </div>
    )
  }

  return (
    <div className={`w-full flex flex-col gap-8 py-8 ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
      <div className="marquee-container w-full">
        <ul className="marquee-track-right flex items-center list-none p-0 m-0">
          {renderRowContent(firstRow, 0, 'top')}
        </ul>
      </div>
      <div className="marquee-container w-full">
        <ul className="marquee-track-left flex items-center list-none p-0 m-0">
          {renderRowContent(secondRow, half, 'bottom')}
        </ul>
      </div>
    </div>
  )
}

export default ClockDisplay
