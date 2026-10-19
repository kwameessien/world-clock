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

## Deployment

The site is live at **https://clock.kwame.co**, on GitHub Pages. The old `kwameessien.github.io/world-clock/` address redirects there.

- Every push to `main` runs `.github/workflows/deploy.yml`, which builds the app and publishes `dist/`. Pages is set to use GitHub Actions as its source.
- The custom domain is set in the repo's Pages settings, and `public/CNAME` records it. DNS for kwame.co is at GoDaddy: `clock` is a CNAME to `kwameessien.github.io`.
- The app is served from the domain root, so Vite and the router need no base path.
- Pages can't route paths like `/table` itself, so the workflow copies `index.html` to `404.html`. A deep link loads the app with a 404 status and the router shows the right view. Visitors won't notice, but search engines may not index those inner pages.

## How the text is made

- **Times, offsets and dates** come from `Intl` with IANA zones (`src/lib/time.js`), so daylight saving is always right. No offsets are stored.
- **The time in words** ("Eighteen minutes to six on Wednesday morning.") is generated in `src/lib/scores.js`. The weekday is named only when the city is on a different day from home.
- **Observations** ("The first trains are running.") are hand-written lines in `src/lib/scores.js`, grouped by time of day, with weekend variants and a few city-specific lines. One is picked per city per hour, so a sentence holds still for the hour.
- **The Table headline** is computed from your cities (`src/lib/model.js`): the longest run of hours with the most cities at work. Work hours count only on local weekdays; a city's `weekend` field covers places where the weekend is not Saturday and Sunday.

## Typeface

The voice face is **Aujournuit Densed**, bundled at `public/fonts/Aujournuit-Densed.otf`; the data face is IBM Plex Mono (bundled via Fontsource). If the visitor has Aujournuit Densed installed, that copy is used instead. The `@font-face` rule is at the top of `src/index.css`.

## Design

The Figma file holds the screens, colour variables (Light and Dark) and text styles that `src/index.css` mirrors.
