// Geometry for the two dial sizes, in Figma pixels: the desktop dial box is 604 with a 580 ring,
// the mobile one a 390-wide frame with a 224 ring. Labels overflow the box.
export const SIZES = {
  full: { size: 604, R: 290, band: 26, labelGap: 18, numeralGap: 18, arc: 74, diffAt: 100, dot: 5, home: 10 },
  compact: { size: 390, R: 112, band: 16, labelGap: 10, numeralGap: 11, arc: 30, diffAt: 48, dot: 3.5, home: 7 },
}

/** Midnight at the top, noon at the bottom, clockwise. Degrees from +x. */
export const angle = (hours) => -90 + hours * 15
export const rad = (deg) => (deg * Math.PI) / 180

export function point(c, r, hours) {
  const a = rad(angle(hours))
  return [c + r * Math.cos(a), c + r * Math.sin(a)]
}

/** Position (in % of the dial box) for a popover that sits inside the ring, toward a city. */
export function dialAnchor(hours, compact) {
  const g = compact ? SIZES.compact : SIZES.full
  const [x, y] = point(g.size / 2, g.R * 0.5, hours)
  return { left: `${(x / g.size) * 100}%`, top: `${(y / g.size) * 100}%` }
}
