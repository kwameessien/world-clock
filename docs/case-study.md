# World Clock

**A world clock you read, not a dashboard you scan.**
Design and front-end, 2025–2026 · React, Vite, Figma · [clock.kwame.co](https://clock.kwame.co)

## The problem

The first version did what most world clocks do: a grid of city cards, each showing a time, a search box, favourites, a copy button, scrolling marquees. Feature by feature it grew into a dashboard. It answered "what time is it in Lagos?", but you had to do the arithmetic of a working day in your head. You read numbers and then translated them.

I rebuilt it around one question: what if the clock did the reading for you?

## Three views of the same minute

Each view borrows its form from an artwork that already solved part of the problem.

- **Dial**, after Richard Long's *One Hour* (1984). One 24-hour ring with midnight at the top. Every city sits at its own local time, its name radiating outward like a walked line. The arc between home and the selected city states the difference, so "three hours behind" is something you see, not something you work out.
- **Table**, after Karl Nimtsch's permanent calendar. Your home city's hours run across, your cities run down. Night is shaded, working hours are yellow, and the best overlap for a meeting is bracketed and written as a sentence: *"The best hour to meet is 09:00 in Toronto: 6 of 13 cities are at work."*
- **Scores**, after Yoko Ono's *Clock Piece* (1963). Each city becomes a one-line instruction: the time in words, then one observation. *"Los Angeles. Fourteen minutes past ten in the morning. Someone is already thinking about lunch."*

## Sentences over numbers

The Scores view writes time the way a person says it, and names the weekday only when a city is already on a different day. Seventy-one observations, written by hand, are grouped by time of day, with weekend variants and city-specific lines. One is picked per city per hour, so a sentence holds still long enough to read.

The type does the same work. Aujournuit Densed, a condensed serif, carries the voice. IBM Plex Mono carries the data. You can tell at a glance which lines are prose and which are figures.

## From Figma to code

Every screen, colour variable (light and dark) and text style was drawn in Figma first, and the CSS mirrors that variable collection token for token. The dial's geometry is specified in Figma pixels and scales from a 1440 frame, so the build matches the drawing at the size it was designed for and grows on larger displays.

Under the surface, times come from `Intl` with IANA zones, so daylight saving is always right and no offsets are stored. Working hours respect each city's own weekend, and the meeting window only considers hours you could actually take a call.

<!-- Image slots: 1) Dial, desktop. 2) Figma frame beside the built screen. 3) Scores on a phone. -->
