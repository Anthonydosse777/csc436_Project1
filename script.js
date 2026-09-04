/* ============================================================
   GYM STARTER GUIDE — script.js

   One interaction: the "All / Push / Pull / Legs / Core" buttons
   above the exercise sections. Clicking one shows only the cards
   in that muscle group and hides the rest.

   How it works, in plain language:
   1. Every button has a data-filter value ("push", "pull", ...).
   2. Every exercise card has a matching data-category value.
   3. When a button is clicked we compare the two, and add or
      remove the CSS class .is-hidden (which is just display:none)
      on each card.
   ============================================================ */


/* ---------- 1. SELECT THE ELEMENTS WE NEED ----------
   querySelectorAll returns a list of every matching element. */
const filterButtons = document.querySelectorAll('.filter-btn');
const exerciseCards = document.querySelectorAll('.exercise-card');
const exerciseSections = document.querySelectorAll('.exercise-section');


/* ---------- 2. THE FILTER ITSELF ----------
   Takes a category name and shows or hides each card to match. */
function applyFilter(category) {

  // Show a card if the filter is "all", or if its data-category
  // matches the button that was clicked.
  exerciseCards.forEach(function (card) {
    const matches = (category === 'all') || (card.dataset.category === category);

    // The second argument of toggle() decides whether the class is
    // added or removed: add .is-hidden when the card does NOT match.
    card.classList.toggle('is-hidden', !matches);
  });

  // If a whole section has no cards left on screen, hide the
  // section too, so we are not left with an empty heading.
  exerciseSections.forEach(function (section) {
    const visibleCards = section.querySelectorAll('.exercise-card:not(.is-hidden)');
    section.classList.toggle('is-hidden', visibleCards.length === 0);
  });
}


/* ---------- 3. LISTEN FOR CLICKS ----------
   Attach a click listener to every filter button. */
filterButtons.forEach(function (button) {

  button.addEventListener('click', function () {

    // Clear the highlight from all buttons, then highlight this one,
    // so the selected filter is always obvious.
    filterButtons.forEach(function (otherButton) {
      otherButton.classList.remove('is-active');
      otherButton.setAttribute('aria-pressed', 'false');
    });

    button.classList.add('is-active');
    button.setAttribute('aria-pressed', 'true');

    // Finally, run the filter using this button's data-filter value.
    applyFilter(button.dataset.filter);
  });
});


/* ---------- 4. STARTING STATE ----------
   The page loads with "All" selected, so mark it as pressed for
   screen readers. Everything is already visible, so there is
   nothing to hide yet. */
if (filterButtons.length > 0) {
  filterButtons[0].setAttribute('aria-pressed', 'true');
}
