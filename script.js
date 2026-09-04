/* ==========================================================================
   GYM STARTER GUIDE — interactivity
   Two features, both plain vanilla JavaScript with no libraries:
     1. A difficulty filter that shows and hides exercise cards.
     2. A light/dark theme toggle that remembers the visitor's choice.
   Each one selects elements, listens for an event, and changes the page.
   ========================================================================== */

/* "defer"-like safety: this script tag sits at the end of <body>, so the DOM
   is already parsed by the time these selectors run. */


/* --------------------------------------------------------------------------
   1. DIFFICULTY FILTER
   -------------------------------------------------------------------------- */

/* SELECT the elements we need. querySelectorAll returns a NodeList, which we
   spread into a real array so array methods like filter() are available. */
const filterButtons = [...document.querySelectorAll('.filter-btn')];
const cards         = [...document.querySelectorAll('.card')];
const sections      = [...document.querySelectorAll('.exercise-section')];
const statusMessage = document.getElementById('filter-status');

/**
 * Show only the cards matching the chosen difficulty.
 * @param {string} level - "all", "beginner", "intermediate", or "advanced".
 */
function applyFilter(level) {
  let visibleCount = 0;

  // CHANGE THE PAGE: hide or show each card.
  cards.forEach(card => {
    // Every card carries its level in a data-level attribute in the HTML,
    // which the browser exposes here as card.dataset.level.
    const matches = level === 'all' || card.dataset.level === level;

    // The "hidden" property is the accessible way to hide something: it
    // removes the element from the page AND from screen reader output.
    card.hidden = !matches;

    if (matches) visibleCount++;
  });

  // If a filter empties a whole section, hide its heading too — otherwise
  // you get a "Push" heading sitting above nothing.
  sections.forEach(section => {
    const sectionCards = [...section.querySelectorAll('.card')];
    const hasVisible   = sectionCards.some(card => !card.hidden);
    section.hidden     = !hasVisible;
  });

  // Update the live status line. Its aria-live="polite" in the HTML means
  // screen readers announce this change without interrupting the user.
  const label = level === 'all' ? '' : ` ${level}`;
  statusMessage.textContent = visibleCount === 1
    ? `Showing 1${label} exercise.`
    : `Showing all ${visibleCount}${label} exercises.`;
}

/* LISTEN for clicks on each filter button. */
filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    // Move the active styling and the aria-pressed state onto this button.
    filterButtons.forEach(other => {
      const isActive = other === button;
      other.classList.toggle('is-active', isActive);
      other.setAttribute('aria-pressed', String(isActive));
    });

    applyFilter(button.dataset.level);
  });
});


/* --------------------------------------------------------------------------
   2. THEME TOGGLE
   Sets data-theme="light" on the <html> element. The stylesheet defines a
   light palette under :root[data-theme="light"], so flipping this one
   attribute recolours the entire page.
   -------------------------------------------------------------------------- */

const themeButton = document.getElementById('theme-toggle');
const rootElement = document.documentElement;   // the <html> element

/**
 * Apply a theme and update the button's label and pressed state.
 * @param {string} theme - "light" or "dark".
 */
function applyTheme(theme) {
  if (theme === 'light') {
    rootElement.setAttribute('data-theme', 'light');
    themeButton.textContent = 'Dark mode';       // offers the OTHER option
    themeButton.setAttribute('aria-pressed', 'true');
  } else {
    rootElement.removeAttribute('data-theme');
    themeButton.textContent = 'Light mode';
    themeButton.setAttribute('aria-pressed', 'false');
  }

  // Remember the choice so it survives a reload. localStorage can throw in
  // private browsing, so the write is wrapped in try/catch.
  try {
    localStorage.setItem('theme', theme);
  } catch (error) {
    /* Storage unavailable — the toggle still works for this visit. */
  }
}

/* LISTEN for clicks and flip to whichever theme is not active. */
themeButton.addEventListener('click', () => {
  const isLightNow = rootElement.getAttribute('data-theme') === 'light';
  applyTheme(isLightNow ? 'dark' : 'light');
});

/* On load, restore a previously saved choice. */
try {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') applyTheme('light');
} catch (error) {
  /* Storage unavailable — fall back to the default dark theme. */
}
