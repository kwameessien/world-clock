import { useEffect, useRef } from 'react'

/**
 * Actions for one city. Renders as a popover on the dial, or inline (mobile).
 * Home cannot be removed or made home again, so those items are left out.
 */
function CityMenu({ city, isHome, canMoveUp, canMoveDown, onHome, onMove, onRemove, onClose, inline, style }) {
  const ref = useRef(null)

  useEffect(() => {
    if (inline) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'h' || e.key === 'H') { if (!isHome) onHome() }
      if (e.key === 'Backspace' || e.key === 'Delete') { if (!isHome) onRemove() }
    }
    const onDown = (e) => {
      if (ref.current && !ref.current.contains(e.target) && !e.target.closest?.('.city')) onClose()
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('pointerdown', onDown)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('pointerdown', onDown)
    }
  }, [inline, isHome, onClose, onHome, onRemove])

  const items = [
    !isHome && { label: 'Make home', hint: 'H', run: onHome },
    canMoveUp && { label: 'Move earlier on list', hint: '↑', run: () => onMove('up') },
    canMoveDown && { label: 'Move later on list', hint: '↓', run: () => onMove('down') },
    !isHome && { label: 'Remove from dial', hint: '⌫', run: onRemove, danger: true },
  ].filter(Boolean)

  if (inline) {
    return (
      <div className="city-actions" role="group" aria-label={`${city.name} actions`}>
        {items.map((it) => (
          <button key={it.label} type="button" onClick={it.run} className={it.danger ? 'danger' : undefined}>
            {it.label.replace(' on list', '').replace(' from dial', '')}
          </button>
        ))}
      </div>
    )
  }

  return (
    <div ref={ref} className="city-menu" role="menu" aria-label={`${city.name} actions`} style={style}>
      <div className="city-menu-title">{city.name}</div>
      {items.map((it) => (
        <button key={it.label} type="button" role="menuitem" onClick={it.run} className={it.danger ? 'danger' : undefined}>
          <span>{it.label}</span><span className="hint">{it.hint}</span>
        </button>
      ))}
    </div>
  )
}

export default CityMenu
