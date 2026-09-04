# Gym Starter Guide

A single-page, dependency-free guide for people walking into a gym for the first time:
sixteen core exercises, a three-day sample week, and plain answers to the questions
beginners actually ask.

## Run it

No build step, no package manager. Either open the file directly:

```bash
open index.html
```

…or serve it locally so relative paths behave exactly as they will in production:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Files

| File | What's in it |
| --- | --- |
| `index.html` | All page content, plus an inline SVG sprite that supplies the muscle-group icons |
| `styles.css` | Mobile-first stylesheet: design tokens, layout, components, then media queries |
| `script.js` | The `EXERCISES` data array, card rendering, and the filter/search behaviour |

## Features

- **Data-driven exercise grid** — cards are rendered from the `EXERCISES` array in `script.js`;
  adding a movement is one line, not a block of duplicated markup.
- **Filter and search** — muscle-group chips plus a live text search across name, equipment,
  group, and coaching cue.
- **Mobile-first responsive layout** — one column, then two at 40rem, then three at 64rem.
- **Light and dark themes** — driven entirely by CSS custom properties and `prefers-color-scheme`.
- **Accessible by default** — skip link, visible focus rings, `aria-pressed` on the filter chips,
  a live region announcing result counts, and a `prefers-reduced-motion` guard.
- **Zero dependencies** — no frameworks, no fonts fetched over the network, no tracking.

## Adding an exercise

Append an object to `EXERCISES` in `script.js`:

```js
{ name: 'Face Pull', group: 'shoulders', equipment: 'Cable', level: 'Beginner',
  cue: 'Pull toward your forehead, thumbs back, and pause for a second at the end.' }
```

`group` must be one of `chest`, `back`, `legs`, `shoulders`, `arms`, `core` — those keys map to
both the filter chips and the icons in the sprite. To introduce a new group, add a `<symbol>`
with a matching `icon-<group>` id in `index.html`, an entry in `GROUP_LABELS`, and a chip button.

## Deploying

The site is fully static, so any host works. For Netlify, drag the project folder onto the
dashboard, or connect the repo with:

- **Build command:** _(leave empty)_
- **Publish directory:** `.`

Live URL: _add once deployed_

## Disclaimer

General fitness information only — not medical advice. Anyone starting a new training programme
should check with a doctor first.
