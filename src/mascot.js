// Jio: the orb. One persistent instance; moods are CSS states driven by data-mood.
// Eyes track the pointer (transform only, rAF-batched), blink on a jittered timer.
const reduce = matchMedia('(prefers-reduced-motion: reduce)');

const el = document.createElement('div');
el.className = 'jio';
el.dataset.mood = 'idle';
el.setAttribute('aria-hidden', 'true');
el.innerHTML = `
  <div class="jio-float">
    <div class="jio-body">
      <div class="jio-glow"></div>
      <div class="jio-eyes"><span class="eye"><i></i></span><span class="eye"><i></i></span></div>
    </div>
  </div>
  <div class="jio-shadow"></div>`;

const eyes = el.querySelector('.jio-eyes');
let moodTimer, blinkTimer, raf, tx = 0, ty = 0;

export function mount(parent) { parent.prepend(el); blinkLoop(); }

export function mood(m, ms) {
  clearTimeout(moodTimer);
  el.dataset.mood = m;
  // restart one-shot animations when the same mood fires twice
  el.classList.remove('pulse'); void el.offsetWidth; el.classList.add('pulse');
  if (ms) moodTimer = setTimeout(() => (el.dataset.mood = 'idle'), ms);
}

function blinkLoop() {
  clearTimeout(blinkTimer);
  blinkTimer = setTimeout(() => {
    if (!reduce.matches) {
      el.classList.add('blink');
      setTimeout(() => el.classList.remove('blink'), 140);
    }
    blinkLoop();
  }, 2600 + Math.random() * 3200);
}

addEventListener('pointermove', (e) => {
  if (reduce.matches) return;
  const r = el.getBoundingClientRect();
  const dx = e.clientX - (r.left + r.width / 2);
  const dy = e.clientY - (r.top + r.height / 2);
  const d = Math.hypot(dx, dy) || 1;
  const k = Math.min(1, d / 400);
  tx = (dx / d) * 9 * k; ty = (dy / d) * 7 * k;
  if (!raf) raf = requestAnimationFrame(() => { eyes.style.transform = `translate(${tx}px, ${ty}px)`; raf = 0; });
}, { passive: true });

// Talk while audio plays.
addEventListener('jio:talk', (e) => el.classList.toggle('talking', e.detail));
