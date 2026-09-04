# Gym Starter Guide

A static, beginner-friendly reference site for the gym. Sixteen exercises are
organised the way most starter programmes are written — **Push, Pull, Legs and
Core** — and each one shows the muscles it works, a difficulty label, and two or
three short cues for doing it correctly. A FAQ section answers the questions most
people have in their first month.

Built for CSC 436 (Full-Stack Web Development) with semantic HTML, modern CSS
(Flexbox **and** Grid) and vanilla JavaScript. No frameworks, no build step.

## Live site

<!-- Paste the Netlify URL here after deploying -->
**Live URL:** _(add your Netlify link here)_

## Features

- **Semantic HTML** — `header`, `nav`, `main`, `section`, `article`, `footer`, a
  single `h1`, and heading levels that step down without skipping.
- **Flexbox** — the header bar (logo left, links right, wrapping on mobile), the
  hero layout, the filter bar, and the tag/difficulty row inside every card.
- **CSS Grid** — the exercise galleries use
  `repeat(auto-fit, minmax(min(260px, 100%), 1fr))`, so they reflow from three
  columns to two to one without a media query.
- **Mobile-first responsive design** — base styles target small screens, then
  `min-width` media queries at 600px and 900px enhance the layout. No horizontal
  scrolling at 375px.
- **JavaScript interactivity** — filter buttons (All / Push / Pull / Legs / Core)
  select the cards with `querySelectorAll`, listen for `click`, and show or hide
  each card with a CSS class. The selected button is highlighted.
- **Expandable FAQ** — built with native `<details>` / `<summary>`, no JS needed.

## Running it locally

It is a static site, so there is nothing to install:

1. Download or clone the repository.
2. Open `index.html` in any web browser (double-click it, or drag it into the
   browser window).

If you use VS Code, the **Live Server** extension is handy — right-click
`index.html` and choose *Open with Live Server* to get automatic reloads.

## File structure

```
.
├── index.html      all page content and structure
├── styles.css      all styling, mobile-first, numbered sections
├── script.js       the muscle-group filter interaction
├── images/         SVG illustrations (one per exercise, plus hero + favicon)
└── README.md
```

## Credits

All illustrations are original SVG line drawings made for this project, so
there are no third-party image licences to attribute.

## Disclaimer

This site is a student project for general education. It is not medical advice.
