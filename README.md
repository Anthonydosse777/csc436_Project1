# Gym Starter Guide

A two-page static site for people walking into a gym for the first time.

- **Training** (`index.html`) — sixteen core exercises grouped into push, pull, legs, and
  core, each with a photograph, muscle and difficulty labels, and plain-language coaching
  cues, plus progressive-overload notes that appear when you tell the page you are past
  beginner, and straight answers to the questions beginners are too self-conscious to ask.
- **Nutrition and recovery** (`nutrition.html`) — everything outside the gym: how to build
  a plate, a protein calculator, twelve everyday protein sources, what to eat around a
  workout, sleep and rest-day habits, and a daily checklist.

Built for **CSC 436 · Full-Stack Web Development · Project 1: Static Foundations**.

**Live site:** [gainsforyou.netlify.app](https://gainsforyou.netlify.app)

## Running it locally

There is no build step and no package manager. Clone the repository and open the file:

```bash
git clone https://github.com/Anthonydosse777/csc436_Project1.git
cd csc436_Project1
open index.html
```

Or serve it over HTTP, which is closer to how it behaves in production:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Files

| File | Contents |
| --- | --- |
| `index.html` | Training page: the sixteen exercises and the gym FAQ |
| `nutrition.html` | Nutrition and recovery page |
| `styles.css` | Design tokens, layout, components, animations, and media queries for both pages |
| `script.js` | Shared by both pages: experience-level tips, background toggle, scroll reveal, card tilt |
| `nutrition.js` | Nutrition page only: protein calculator, food bars and diet filter, daily checklist |
| `images/photos/` | Seventeen photographs (Pexels licence) |
| `images/favicon.svg` | Site icon |

## How the project meets the brief

**Semantic structure.** Each page has one `<h1>`, no skipped heading levels, and its
content in `<section>` elements inside `<main>`, wrapped by `<header>`, two labelled
`<nav>` elements, and a `<footer>`. Elements are chosen for what the content is:

- each exercise and each recovery habit is an `<article>`
- muscle/difficulty labels and the nutrition headline numbers are `<dl>` name/value pairs
- exercise steps and the workout-timing steps are `<ol>`, because their order matters
- the protein calculator is a real `<form>` with a `<label>`, a `<fieldset>` and
  `<legend>` for the unit choice, and an `<output>` for the result
- the plate diagram is a `<figure>` with a `<figcaption>`, and the checklist tracks
  progress with a native `<progress>` element
- both FAQs use `<details>` and `<summary>`

Every section is named with `aria-labelledby` so it appears in a screen reader's
landmark list.

**Flexbox.** Used wherever items sit in a single line that should wrap or stretch: the
header shell (stacked below 1280px, a single row above), the nav row, the filter bars,
the inside of each exercise and food card (a column, so bars and body text line up), the
plate legend rows, the calculator form, the workout timeline (a vertical line on phones,
horizontal on desktop), the checklist rows and footer, and the footer links.

**CSS Grid.** Used for two-dimensional layouts: the exercise galleries, the desktop
intro, the nutrition headline numbers, the plate beside its legend, the calculator beside
its result, the food cards, the recovery cards, and the checklist. Most use
`repeat(auto-fit, minmax(…, 1fr))`, so the column count follows the available width with
no media query at all. The food cards deliberately use `auto-fill` instead, so the
diet filter's shorter list keeps the same card size rather than stretching.

**Responsive design.** Written mobile-first: the rules outside any media query describe
the phone layout, and `min-width` breakpoints at 40em, 64em, and 80em add to it. Checked
at 320px, 375px, 768px, and 1280px with no horizontal scrolling on either page. Two
details guarantee this: `img { max-width: 100% }` stops the photographs forcing the page
wider than the screen, and the 3D scroll reveal tips sections *away* from the viewer, so
a section that has not yet arrived is drawn narrower than the screen, never wider.

**JavaScript interactivity.** Seven interactions across the two pages, all vanilla and
free of console errors.

`script.js`, shared by both pages:

1. **Experience-level tips** — selects the level buttons and the tip blocks inside each
   card, listens for clicks, and unhides the notes that match the chosen level with the
   `hidden` property, then updates a live status line that screen readers announce.
   Choosing a level never removes an exercise: beginners see all sixteen movements with
   their steps, and intermediate and advanced visitors get the same sixteen plus
   progressive-overload notes and warnings about the lifts not worth loading further.
2. **Background toggle** — flips a `data-theme` attribute on `<html>`, which swaps the
   custom-property palette from black to white, and remembers the choice in
   `localStorage` across both pages.
3. **Scroll reveal** — hinges sections into place with `IntersectionObserver`.
4. **Card tilt** — turns each exercise card toward the mouse pointer in 3D; skipped on
   touch screens and when the visitor asks for reduced motion.

`nutrition.js`, nutrition page only:

5. **Protein calculator** — reads bodyweight in kg or lb, validates it with the
   browser's own constraint checking, and shows a daily range (1.6–2.2 g per kg) and a
   per-meal amount, updating live as you type.
6. **Food bars and diet filter** — every food card's bar shows what share of the daily
   target one serving covers, and resizes when the calculator changes. A filter narrows
   the list to vegetarian or plant-based foods.
7. **Daily checklist** — six habits whose ticks are saved in `localStorage` against
   today's date, so the list survives a reload and clears itself the next day.

**Real content.** Sixteen genuine exercises with real coaching cues and seventeen
photographs; evidence-based nutrition guidance with protein figures rounded from standard
food composition data. No placeholder text.

## Accessibility notes

- Skip link as the first tab stop
- Visible `:focus-visible` outlines on every interactive element
- `aria-pressed` on the level and toggle buttons; `aria-live` on the status line
- Alt text on every image describing the actual photograph
- `prefers-reduced-motion` disables every animation and forces revealed sections visible
- A `<noscript>` fallback so the page is never blank if JavaScript fails
- Both themes meet WCAG AA contrast; the lowest measured pair is 4.81:1

## Colour

Black and gold by default, with a white-and-gold alternative on the toggle. The gold
darkens from `#d4af37` to `#8a6a12` in the light theme — the bright gold sits at roughly
1.8:1 against white, far below the readable threshold.

## Deploying

Static, so no build configuration is needed. On Netlify: **Add new site → Import an
existing project**, pick this repository, leave the build command empty, and set the
publish directory to `.`. Every push to `main` redeploys automatically.

## Credits

Photographs from [Pexels](https://www.pexels.com), used under the Pexels licence
(free for commercial and personal use, no attribution required).

## Disclaimer

General fitness and nutrition information only — not medical or dietary advice. Check
with a doctor before starting a new training programme, and with a doctor or registered
dietitian before changing how you eat if you have a medical condition.
