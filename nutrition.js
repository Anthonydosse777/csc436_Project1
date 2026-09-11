/* ==========================================================================
   GYM STARTER GUIDE — nutrition page interactivity
   Loaded only by nutrition.html, after script.js (which already runs the
   theme toggle and scroll reveal both pages share). Three features:
     1. A protein calculator that turns bodyweight into a daily target.
     2. Food cards whose bars show how much of that target one serving
        covers, plus a diet filter that narrows the list.
     3. A daily checklist that remembers today's ticks and resets tomorrow.
   ========================================================================== */


/* --------------------------------------------------------------------------
   1. PROTEIN CALCULATOR
   -------------------------------------------------------------------------- */

const proteinForm = document.getElementById('protein-form');
const weightInput = document.getElementById('weight');
const unitRadios  = [...document.querySelectorAll('input[name="unit"]')];
const resultDaily = document.getElementById('result-daily');
const resultMeal  = document.getElementById('result-meal');

/* Grams of protein per kilogram of bodyweight per day. 1.6 is where the
   research sees muscle gain level off; 2.2 is the top of the useful range. */
const PROTEIN_LOW  = 1.6;
const PROTEIN_HIGH = 2.2;
const MEALS_PER_DAY = 4;
const KG_PER_LB = 0.4536;

/* Sensible bodyweight limits in each unit. The input's min and max are
   swapped to match whenever the unit changes, so the browser's own
   validation always checks the right range. */
const WEIGHT_LIMITS = {
  kg: { min: 30, max: 250 },
  lb: { min: 66, max: 550 }
};

/* Before anyone types a weight, the food bars use a 70 kg reference. */
const REFERENCE_TARGET = Math.round(70 * PROTEIN_LOW);   // 112 g

function selectedUnit() {
  return unitRadios.find(radio => radio.checked).value;
}

/**
 * Read the form and return the daily protein range in grams, or null if the
 * weight is missing or outside the allowed range.
 * @returns {{low: number, high: number} | null}
 */
function readTarget() {
  const weight = weightInput.valueAsNumber;   // NaN when the box is empty
  if (Number.isNaN(weight) || !weightInput.checkValidity()) return null;

  const kilograms = selectedUnit() === 'lb' ? weight * KG_PER_LB : weight;
  return {
    low:  Math.round(kilograms * PROTEIN_LOW),
    high: Math.round(kilograms * PROTEIN_HIGH)
  };
}

/** Write a target into the result panel and pass it on to the food cards. */
function showTarget(target) {
  resultDaily.textContent = `${target.low}–${target.high} g a day`;

  const mealLow  = Math.round(target.low  / MEALS_PER_DAY);
  const mealHigh = Math.round(target.high / MEALS_PER_DAY);
  resultMeal.textContent = `About ${mealLow}–${mealHigh} g at each of ${MEALS_PER_DAY} meals.`;

  updateFoodBars(target.low, `your daily minimum of ${target.low} g`);
}

/* Update live as the visitor types, but only once the number is valid —
   a half-typed "7" should not flash a tiny target on the way to "72". */
weightInput.addEventListener('input', () => {
  const target = readTarget();
  if (target) showTarget(target);
});

/* Switching units re-ranges the input and re-reads the same number, so
   typing 160 and then choosing "lb" gives the right answer immediately. */
unitRadios.forEach(radio => {
  radio.addEventListener('change', () => {
    const limits = WEIGHT_LIMITS[selectedUnit()];
    weightInput.min = limits.min;
    weightInput.max = limits.max;

    const target = readTarget();
    if (target) showTarget(target);
  });
});

/* Pressing the button (or Enter) must not reload the page. If the number is
   invalid, reportValidity() shows the browser's own message on the input. */
proteinForm.addEventListener('submit', event => {
  event.preventDefault();

  const target = readTarget();
  if (target) {
    showTarget(target);
  } else {
    weightInput.reportValidity();
  }
});


/* --------------------------------------------------------------------------
   2. FOOD CARDS — protein bars and the diet filter
   -------------------------------------------------------------------------- */

const foodCards   = [...document.querySelectorAll('.food-card')];
const foodBasis   = document.getElementById('food-basis');
const dietButtons = [...document.querySelectorAll('.filter-btn[data-diet]')];
const dietStatus  = document.getElementById('diet-status');

/**
 * Size every card's bar as the share of a daily target its serving covers.
 * @param {number} dailyGrams - the daily minimum to measure against.
 * @param {string} basisText  - whose target it is, for the caption.
 */
function updateFoodBars(dailyGrams, basisText) {
  foodCards.forEach(card => {
    const grams   = Number(card.dataset.protein);
    const percent = Math.round((grams / dailyGrams) * 100);

    // The CSS reads --share as the bar's width; a single serving can never
    // fill more than the whole bar, even for a very light person.
    card.style.setProperty('--share', `${Math.min(percent, 100)}%`);
    card.querySelector('.food-share').textContent = `${percent}% of the day`;
  });

  foodBasis.textContent = `Bars are based on ${basisText}.`;
}

/* Which data-diet values each filter button lets through. Vegetarian
   includes plant-based foods, so the lists nest rather than overlap. */
const DIETS_SHOWN = {
  all:        ['meat', 'vegetarian', 'plant'],
  vegetarian: ['vegetarian', 'plant'],
  plant:      ['plant']
};

const DIET_STATUS = {
  all:        'Showing all twelve foods.',
  vegetarian: 'Showing the eight vegetarian foods.',
  plant:      'Showing the four plant-based foods.'
};

dietButtons.forEach(button => {
  button.addEventListener('click', () => {
    const diet = button.dataset.diet;

    dietButtons.forEach(other => {
      const isActive = other === button;
      other.classList.toggle('is-active', isActive);
      other.setAttribute('aria-pressed', String(isActive));
    });

    foodCards.forEach(card => {
      card.hidden = !DIETS_SHOWN[diet].includes(card.dataset.diet);
    });

    dietStatus.textContent = DIET_STATUS[diet];
  });
});

/* Draw the bars for the reference person on load. They start at zero width
   in the CSS, so this also plays their first grow-in animation. */
updateFoodBars(REFERENCE_TARGET, `a 70 kg person's daily minimum of ${REFERENCE_TARGET} g — use the calculator above to see your own`);


/* --------------------------------------------------------------------------
   3. DAILY CHECKLIST
   Saved as { date, done } in localStorage. The date is today's in the
   visitor's own time zone, so the list clears itself at their midnight
   rather than at midnight UTC.
   -------------------------------------------------------------------------- */

const habitBoxes    = [...document.querySelectorAll('.checklist-items input[type="checkbox"]')];
const progressBar   = document.getElementById('checklist-progress');
const progressCount = document.getElementById('checklist-count');
const resetButton   = document.getElementById('checklist-reset');

const STORAGE_KEY = 'daily-checklist';

/* "en-CA" formats a date as YYYY-MM-DD, which is easy to compare. */
const today = new Date().toLocaleDateString('en-CA');

/** Return the habits ticked earlier today, or an empty list. */
function loadTicks() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved && saved.date === today) return saved.done;
  } catch (error) {
    /* Storage unavailable or unreadable — start with a clean list. */
  }
  return [];
}

function saveTicks() {
  const done = habitBoxes.filter(box => box.checked).map(box => box.value);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ date: today, done }));
  } catch (error) {
    /* Storage unavailable — the checklist still works for this visit. */
  }
}

/** Update the progress bar and the sentence above it. */
function renderProgress() {
  const done  = habitBoxes.filter(box => box.checked).length;
  const total = habitBoxes.length;

  progressBar.value = done;
  progressCount.textContent = done === total
    ? `All ${total} done — that is a full day. Same again tomorrow.`
    : `${done} of ${total} done today`;
}

habitBoxes.forEach(box => {
  box.addEventListener('change', () => {
    saveTicks();
    renderProgress();
  });
});

resetButton.addEventListener('click', () => {
  habitBoxes.forEach(box => { box.checked = false; });
  saveTicks();
  renderProgress();
});

/* Restore today's ticks when the page loads. */
const tickedToday = loadTicks();
habitBoxes.forEach(box => {
  box.checked = tickedToday.includes(box.value);
});
renderProgress();
