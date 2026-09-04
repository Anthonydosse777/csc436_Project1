/* Gym Starter Guide — exercise data, rendering, and filtering.
   The grid is built from EXERCISES so adding a movement is a one-line change. */

const EXERCISES = [
  { name: 'Bench Press',        group: 'chest',     equipment: 'Barbell',   level: 'Beginner',
    cue: 'Shoulder blades pinned back, bar to mid-chest, drive through your feet.' },
  { name: 'Push-Up',            group: 'chest',     equipment: 'Bodyweight', level: 'Beginner',
    cue: 'Body in one straight line. Elbows at 45°, not flared out to the sides.' },
  { name: 'Chest Fly',          group: 'chest',     equipment: 'Cable',     level: 'Beginner',
    cue: 'Soft bend in the elbows the whole way. Hug, don’t press.' },
  { name: 'Lat Pulldown',       group: 'back',      equipment: 'Machine',   level: 'Beginner',
    cue: 'Pull the bar to your collarbone with your elbows, not your hands.' },
  { name: 'Seated Row',         group: 'back',      equipment: 'Cable',     level: 'Beginner',
    cue: 'Chest tall, squeeze the shoulder blades together at the end of each rep.' },
  { name: 'Pull-Up',            group: 'back',      equipment: 'Bodyweight', level: 'Advanced',
    cue: 'Use a band or the assisted machine until you can manage five clean reps.' },
  { name: 'Goblet Squat',       group: 'legs',      equipment: 'Dumbbell',  level: 'Beginner',
    cue: 'Hold the weight at your chest, sit down between your knees, heels flat.' },
  { name: 'Romanian Deadlift',  group: 'legs',      equipment: 'Barbell',   level: 'Intermediate',
    cue: 'Push your hips back, bar close to your legs, stop when your hamstrings pull.' },
  { name: 'Leg Press',          group: 'legs',      equipment: 'Machine',   level: 'Beginner',
    cue: 'Feet shoulder-width. Never let your lower back round off the pad.' },
  { name: 'Walking Lunge',      group: 'legs',      equipment: 'Dumbbell',  level: 'Intermediate',
    cue: 'Long step, back knee toward the floor, torso upright the whole time.' },
  { name: 'Calf Raise',         group: 'legs',      equipment: 'Machine',   level: 'Beginner',
    cue: 'Full stretch at the bottom, hard squeeze at the top. Slow it down.' },
  { name: 'Shoulder Press',     group: 'shoulders', equipment: 'Dumbbell',  level: 'Beginner',
    cue: 'Press straight overhead without arching your lower back to help.' },
  { name: 'Lateral Raise',      group: 'shoulders', equipment: 'Dumbbell',  level: 'Beginner',
    cue: 'Light weight, lead with the elbows, stop level with your shoulders.' },
  { name: 'Bicep Curl',         group: 'arms',      equipment: 'Dumbbell',  level: 'Beginner',
    cue: 'Elbows glued to your ribs. If they drift forward, the weight is too heavy.' },
  { name: 'Tricep Pushdown',    group: 'arms',      equipment: 'Cable',     level: 'Beginner',
    cue: 'Upper arms still, extend fully, control the way back up.' },
  { name: 'Plank',              group: 'core',      equipment: 'Bodyweight', level: 'Beginner',
    cue: 'Squeeze glutes and abs. Thirty honest seconds beats two minutes of sagging.' }
];

const GROUP_LABELS = {
  chest: 'Chest', back: 'Back', legs: 'Legs',
  shoulders: 'Shoulders', arms: 'Arms', core: 'Core'
};

const grid        = document.getElementById('exercise-grid');
const chips       = document.querySelectorAll('.chip');
const searchInput = document.getElementById('search');
const countEl     = document.getElementById('result-count');
const noResults   = document.getElementById('no-results');

let activeGroup = 'all';
let query       = '';

function escapeHtml(str) {
  return str.replace(/[&<>"']/g, ch => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]
  ));
}

function cardMarkup(ex) {
  return `
    <li class="card" data-group="${ex.group}">
      <div class="card-head">
        <span class="card-icon" aria-hidden="true">
          <svg><use href="#icon-${ex.group}"></use></svg>
        </span>
        <div>
          <h3>${escapeHtml(ex.name)}</h3>
          <span class="card-group">${GROUP_LABELS[ex.group]}</span>
        </div>
      </div>
      <p>${escapeHtml(ex.cue)}</p>
      <div class="card-meta">
        <span class="tag">${escapeHtml(ex.equipment)}</span>
        <span class="tag">${escapeHtml(ex.level)}</span>
      </div>
    </li>`;
}

function matches(ex) {
  const inGroup = activeGroup === 'all' || ex.group === activeGroup;
  if (!inGroup) return false;
  if (!query) return true;

  const haystack = `${ex.name} ${ex.equipment} ${GROUP_LABELS[ex.group]} ${ex.cue}`.toLowerCase();
  return haystack.includes(query);
}

function render() {
  const visible = EXERCISES.filter(matches);

  grid.innerHTML = visible.map(cardMarkup).join('');
  noResults.hidden = visible.length > 0;

  const label = activeGroup === 'all' ? 'exercises' : `${GROUP_LABELS[activeGroup].toLowerCase()} exercises`;
  countEl.textContent = visible.length
    ? `Showing ${visible.length} ${label}${query ? ` matching “${query}”` : ''}.`
    : '';
}

chips.forEach(chip => {
  chip.addEventListener('click', () => {
    activeGroup = chip.dataset.filter;

    chips.forEach(c => {
      const on = c === chip;
      c.classList.toggle('is-active', on);
      c.setAttribute('aria-pressed', String(on));
    });

    render();
  });
});

searchInput.addEventListener('input', () => {
  query = searchInput.value.trim().toLowerCase();
  render();
});

render();
