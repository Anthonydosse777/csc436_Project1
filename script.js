/* ==========================================================================
   GYM STARTER GUIDE — interactivity
   Four features, all plain vanilla JavaScript with no libraries:
     1. An experience-level picker that layers extra tips onto every card.
     2. A light/dark theme toggle that remembers the visitor's choice.
     3. A scroll reveal that hinges sections into place as they arrive.
     4. A pointer tilt that turns each card to face the cursor in 3D.
   Each one selects elements, listens for an event, and changes the page.

   Both pages load this file. The nutrition page has no level picker and no
   exercise cards, so features 1 and 4 simply find nothing to attach to
   there; its own interactions live in nutrition.js.
   ========================================================================== */

/* "defer"-like safety: this script tag sits at the end of <body>, so the DOM
   is already parsed by the time these selectors run. */


/* --------------------------------------------------------------------------
   1. EXPERIENCE LEVEL — TIPS, NOT A FILTER

   An earlier version of this page hid exercises that did not match the chosen
   difficulty, which meant an advanced visitor lost sight of the bench press
   and a beginner never learned that pull-ups exist. Nothing is hidden now.
   Every level shows all sixteen exercises; choosing intermediate or advanced
   simply reveals the coaching notes already sitting inside each card —
   progressive-overload steps, and the handful of lifts you should deliberately
   NOT keep loading.
   -------------------------------------------------------------------------- */

/* SELECT the elements we need. querySelectorAll returns a NodeList, which we
   spread into a real array so array methods like forEach() read cleanly. */
const levelButtons = [...document.querySelectorAll('.filter-btn[data-level]')];
const tipBlocks    = [...document.querySelectorAll('.card-tips')];
const tipItems     = [...document.querySelectorAll('.tip')];
const statusMessage = document.getElementById('filter-status');

/* Which tiers of tip each level should see. Advanced is cumulative: the
   intermediate note is usually the setup the advanced one builds on. */
const TIPS_FOR_LEVEL = {
  beginner:     [],
  intermediate: ['intermediate'],
  advanced:     ['intermediate', 'advanced']
};

/* What the status line says once a level is chosen. */
const STATUS_FOR_LEVEL = {
  beginner:     'All sixteen exercises, with the plain steps for each one.',
  intermediate: 'All sixteen exercises, plus an intermediate tip on each card.',
  advanced:     'All sixteen exercises, plus intermediate and advanced tips on each card.'
};

/**
 * Reveal the tips that belong to a level. No card is ever hidden.
 * @param {string} level - "beginner", "intermediate", or "advanced".
 */
function applyLevel(level) {
  const visibleTiers = TIPS_FOR_LEVEL[level] || [];

  // CHANGE THE PAGE: show or hide each individual tip.
  tipItems.forEach(tip => {
    // Each tip carries its tier in a data-tip attribute in the HTML, which
    // the browser exposes here as tip.dataset.tip.
    tip.hidden = !visibleTiers.includes(tip.dataset.tip);
  });

  // Hide the whole "Taking it further" block when it has no visible tips,
  // so beginners are not left with an empty heading on every card. The
  // "hidden" property is the accessible way to hide something: it removes the
  // element from the page AND from screen reader output.
  tipBlocks.forEach(block => {
    const blockTips = [...block.querySelectorAll('.tip')];
    block.hidden    = blockTips.every(tip => tip.hidden);
  });

  // Update the live status line. Its aria-live="polite" in the HTML means
  // screen readers announce this change without interrupting the user.
  statusMessage.textContent = STATUS_FOR_LEVEL[level];
}

/* LISTEN for clicks on each level button. */
levelButtons.forEach(button => {
  button.addEventListener('click', () => {
    // Move the active styling and the aria-pressed state onto this button.
    levelButtons.forEach(other => {
      const isActive = other === button;
      other.classList.toggle('is-active', isActive);
      other.setAttribute('aria-pressed', String(isActive));
    });

    applyLevel(button.dataset.level);
  });
});

/* Start on beginner: every exercise visible, no extra notes yet. Only on the
   page that actually has the picker — elsewhere statusMessage is null. */
if (levelButtons.length > 0) {
  applyLevel('beginner');
}


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
    themeButton.textContent = 'Black background';  // offers the OTHER option
    themeButton.setAttribute('aria-pressed', 'true');
  } else {
    rootElement.removeAttribute('data-theme');
    themeButton.textContent = 'White background';
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


/* --------------------------------------------------------------------------
   3. SCROLL REVEAL
   Fades each section in as it scrolls into view. This uses IntersectionObserver,
   the browser's built-in way of asking "is this element on screen yet?" — it is
   far cheaper than listening to every scroll event and measuring positions.
   -------------------------------------------------------------------------- */

const revealTargets = document.querySelectorAll('.reveal');

/* Respect the visitor's motion preference. If their operating system asks for
   reduced motion, everything is shown immediately with no animation at all. */
const prefersReducedMotion =
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (prefersReducedMotion || !('IntersectionObserver' in window)) {
  // No animation, or an older browser without the API: just show everything.
  revealTargets.forEach(target => target.classList.add('is-visible'));
} else {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      // isIntersecting becomes true once the element enters the viewport.
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');

        // Reveal each section only once, then stop watching it.
        observer.unobserve(entry.target);
      }
    });
  }, {
    // Start the animation slightly before the element is fully on screen,
    // so it has finished by the time the visitor is looking at it.
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px'
  });

  revealTargets.forEach(target => observer.observe(target));
}


/* --------------------------------------------------------------------------
   4. POINTER TILT — the cards turn to face the cursor

   The stylesheet already knows how to draw a tilted card: it reads two custom
   properties, --rx and --ry, inside its transform. All this code does is keep
   those two numbers in sync with the pointer. Doing it this way means the
   maths lives here and every decision about how the card LOOKS stays in CSS,
   and it also means the page degrades cleanly — with JavaScript off the
   properties keep their 0deg defaults and the cards simply do not tilt.

   Two guards before any of it runs:
     - a coarse pointer (a finger) has no hover position to track, and a tap
       would leave a card frozen mid-turn;
     - prefersReducedMotion, reused from section 3, is the visitor explicitly
       asking for less of exactly this.
   -------------------------------------------------------------------------- */

const tiltCards = [...document.querySelectorAll('.card')];

/* "hover: hover" is true only for an input device that can hover without
   committing to a click — in practice, a mouse or trackpad. */
const hasFinePointer =
  window.matchMedia('(hover: hover) and (pointer: fine)').matches;

if (hasFinePointer && !prefersReducedMotion) {

  const MAX_TILT = 8;   // degrees at the very edge of a card

  tiltCards.forEach(card => {
    /* Pointer events fire far faster than the screen refreshes. Holding a
       frame id and skipping any move that arrives while one is already
       queued throttles the work to once per frame — the browser never gets
       asked to redraw more often than it can. */
    let pendingFrame = null;

    card.addEventListener('pointermove', event => {
      if (pendingFrame !== null) return;

      pendingFrame = requestAnimationFrame(() => {
        pendingFrame = null;

        /* getBoundingClientRect is read inside the frame, not on every
           event, because reading layout is the expensive half of this. */
        const bounds = card.getBoundingClientRect();

        /* Position of the pointer within the card, as -0.5 to +0.5 with
           zero at the centre. */
        const offsetX = (event.clientX - bounds.left) / bounds.width  - 0.5;
        const offsetY = (event.clientY - bounds.top)  / bounds.height - 0.5;

        /* Horizontal movement turns the card around its vertical axis, so
           it drives rotateY. Vertical movement drives rotateX, and is
           negated: a positive rotateX pitches the top of the card away from
           the viewer, but the pointer being LOW should tip the bottom away. */
        card.style.setProperty('--ry', `${( offsetX * MAX_TILT * 2).toFixed(2)}deg`);
        card.style.setProperty('--rx', `${(-offsetY * MAX_TILT * 2).toFixed(2)}deg`);

        /* The same position again, this time as percentages, which the CSS
           uses to place the highlight under the cursor. */
        card.style.setProperty('--gx', `${((offsetX + 0.5) * 100).toFixed(1)}%`);
        card.style.setProperty('--gy', `${((offsetY + 0.5) * 100).toFixed(1)}%`);
      });
    });

    /* On the way out, cancel any queued frame — otherwise it lands after the
       reset and leaves the card tilted — then hand the angles back to CSS by
       removing the inline values. The card's transition eases it flat. */
    card.addEventListener('pointerleave', () => {
      if (pendingFrame !== null) {
        cancelAnimationFrame(pendingFrame);
        pendingFrame = null;
      }
      card.style.removeProperty('--rx');
      card.style.removeProperty('--ry');
    });
  });
}
