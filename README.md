# World Clock

A world clock you read, not a dashboard you scan. Three views of the same minute:

- **Dial** — one 24-hour ring, midnight at the top. Every city sits at its own local time and its name radiates outward, after Richard Long's *One Hour* (1984). The arc between home and the selected city states the difference.
- **Table** — your home city's hours across, cities down, after Karl Nimtsch's permanent calendar. Night is shaded, working hours are yellow, and the best overlap for a meeting is bracketed.
- **Scores** — each city as a one-line instruction, after Yoko Ono's *Clock Piece* (1963): the time in words and one observation.

## Running it

```sh
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
npm run lint
```

## How the text is made

- **Times, offsets and dates** come from `Intl` with IANA zones (`src/lib/time.js`), so daylight saving is always right. No offsets are stored.
- **The time in words** ("Eighteen minutes to six on Wednesday morning.") is generated in `src/lib/scores.js`. The weekday is named only when the city is on a different day from home.
- **Observations** ("The first trains are running.") are hand-written lines in `src/lib/scores.js`, grouped by time of day, with weekend variants and a few city-specific lines. One is picked per city per hour, so a sentence holds still for the hour.
- **The Table headline** is computed from your cities (`src/lib/model.js`): the longest run of hours with the most cities at work. Work hours count only on local weekdays; a city's `weekend` field covers places where the weekend is not Saturday and Sunday.

## Typeface

The voice face is **Aujournuit Densed**; the data face is IBM Plex Mono (bundled via Fontsource).

Aujournuit is not bundled. The page uses it, in order:

1. from the visitor's computer, if it is installed (`local('Aujournuit Densed')`);
2. from `public/fonts/Aujournuit-Densed.woff2` or `public/fonts/Aujournuit-Densed.otf`, if you add those files;
3. otherwise it falls back to Instrument Serif.

To ship it to everyone, put the font files in `public/fonts/` with those names (check the licence allows web use). The `@font-face` rule is at the top of `src/index.css`.

## Design

The Figma file holds the screens, colour variables (Light and Dark) and text styles that `src/index.css` mirrors.
