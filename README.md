# Gym Starter Guide

A single-page static site for people walking into a gym for the first time. Sixteen
core exercises grouped into push, pull, legs, and core, each with a photograph,
muscle and difficulty labels, and plain-language coaching cues — plus straight answers
to the questions beginners are usually too self-conscious to ask.

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
| `index.html` | All page content and structure |
| `styles.css` | Design tokens, layout, components, animations, and media queries |
| `script.js` | Difficulty filter, background toggle, and scroll reveal |
| `images/photos/` | Seventeen photographs (Pexels licence) |
| `images/favicon.svg` | Site icon |

## How the project meets the brief

**Semantic structure.** One `<h1>`, no skipped heading levels, and seven `<section>`
elements inside `<main>`, wrapped by `<header>`, two labelled `<nav>` elements, and a
`<footer>`. Each exercise is an `<article>`; muscle and difficulty are a `<dl>` because
they are genuinely name/value pairs. Every section is named with `aria-labelledby` so
it appears in a screen reader's landmark list.

**Flexbox.** Six layouts: the header shell (stacked on phones, a single row on desktop),
the navigation row, the difficulty filter bar, the interior of each card, and the footer
links. `flex-wrap: wrap` is what keeps six nav links usable on a narrow screen.

**CSS Grid.** Two layouts: the exercise galleries and the desktop intro. The galleries
use `repeat(auto-fit, minmax(260px, 1fr))`, so the column count responds to the
available width with no media query at all — one column on a phone, two on a tablet,
three on a desktop, decided by the browser.

**Responsive design.** Written mobile-first: the rules outside any media query describe
the phone layout, and two `min-width` breakpoints (40em and 64em) add to it. No
horizontal scrolling at 375px — the rule that guarantees this is `img { max-width: 100% }`,
without which the photographs force the page wider than the screen.

**JavaScript interactivity.** Three interactions, all vanilla:

1. **Difficulty filter** — selects the buttons and cards, listens for clicks, hides
   non-matching cards with the `hidden` property, collapses any section left empty, and
   updates a live status line that screen readers announce.
2. **Background toggle** — flips a `data-theme` attribute on `<html>`, which swaps the
   custom-property palette from black to white, and remembers the choice in
   `localStorage`.
3. **Scroll reveal** — fades sections in with `IntersectionObserver`.

**Real content.** Sixteen genuine exercises with real coaching cues and seventeen
photographs. No placeholder text.

## Accessibility notes

- Skip link as the first tab stop
- Visible `:focus-visible` outlines on every interactive element
- `aria-pressed` on the filter and toggle buttons; `aria-live` on the status line
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

General fitness information only — not medical advice. Check with a doctor before
starting a new training programme.
