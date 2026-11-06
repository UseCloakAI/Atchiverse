import { ASSESSMENT, LESSONS } from './content.js';

const KEY = 'atchiverse:v1';
const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; } };
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {} };
const state = Object.assign({ xp: 0, streak: 0, levels: {}, missed: [], done: [] }, load());

const $ = (s) => document.querySelector(s);
const app = $('#app');
const shuffle = (a) => [...a].sort(() => Math.random() - 0.5);
const QS_PER_SUBJECT = 6;
const BREAK_MS = 8 * 60 * 1000; // brain break every 8 min
let sessionStart = Date.now();

function hud() {
  $('#xp').textContent = `⚡ ${state.xp} XP`;
  $('#streak').textContent = `🔥 ${state.streak}`;
}
function addXP(n) { state.xp += n; save(); hud(); }

function burst(text) {
  const el = document.createElement('div');
  el.className = 'burst'; el.textContent = text;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 900);
}

function maybeBreak(next) {
  if (Date.now() - sessionStart < BREAK_MS) return next();
  const moves = ['Do 10 jumping jacks', 'Stretch to the ceiling for 10 sec', 'Grab some water', 'Do 5 wall push-ups', 'Shake it out — 15 seconds'];
  app.innerHTML = `<section class="card center">
    <h2>🧠 Brain Break</h2><p class="big">${moves[Math.floor(Math.random() * moves.length)]}</p>
    <p class="muted">Get up, move, come back. +5 XP</p>
    <button class="btn" id="back">I'm back</button></section>`;
  $('#back').onclick = () => { sessionStart = Date.now(); addXP(5); next(); };
}

// One multiple-choice card. Calls onAnswer(correct).
function ask({ q, a, choices }, label, onAnswer) {
  app.innerHTML = `<section class="card">
    <p class="muted">${label}</p><h2 class="q">${q}</h2>
    <div class="choices">${shuffle(choices).map((c) => `<button class="choice">${c}</button>`).join('')}</div>
  </section>`;
  app.querySelectorAll('.choice').forEach((b) => (b.onclick = () => {
    const ok = b.textContent === a;
    app.querySelectorAll('.choice').forEach((x) => { x.disabled = true; if (x.textContent === a) x.classList.add('right'); });
    if (!ok) b.classList.add('wrong');
    state.streak = ok ? state.streak + 1 : 0;
    if (ok) { addXP(10); burst(state.streak >= 3 ? `🔥 ${state.streak} streak!` : '+10'); } else hud();
    setTimeout(() => onAnswer(ok), ok ? 650 : 1400);
  }));
}

// Adaptive placement: start at grade 2, go up on right, down on wrong.
function placement(subject, done) {
  const bank = ASSESSMENT[subject];
  const used = new Set(); const tally = {};
  let grade = 2, n = 0;
  const step = () => {
    if (n >= QS_PER_SUBJECT) return finish();
    const pool = bank.filter((x) => x.g === grade && !used.has(x)) ;
    const item = pool[0] || bank.filter((x) => !used.has(x)).sort((x, y) => Math.abs(x.g - grade) - Math.abs(y.g - grade))[0];
    if (!item) return finish();
    used.add(item); n++;
    ask(item, `${subject === 'math' ? '🔢 Math' : '📖 Reading'} check · ${n}/${QS_PER_SUBJECT}`, (ok) => {
      const t = (tally[item.g] ||= { r: 0, w: 0 });
      ok ? t.r++ : (t.w++, state.missed.includes(item.skill) || state.missed.push(item.skill));
      grade = Math.max(1, Math.min(6, item.g + (ok ? 1 : -1)));
      step();
    });
  };
  const finish = () => {
    const solid = Object.entries(tally).filter(([, t]) => t.r > t.w).map(([g]) => +g);
    state.levels[subject] = solid.length ? Math.max(...solid) : 1;
    save(); done();
  };
  step();
}

function startAssessment() {
  state.missed = [];
  app.innerHTML = `<section class="card center"><h2>Let's find your level 🎯</h2>
    <p>12 quick questions. No grades, no pressure — wrong answers just help us pick the right lessons.</p>
    <button class="btn" id="go">Start</button></section>`;
  $('#go').onclick = () => placement('math', () => placement('reading', () => { addXP(25); home(); }));
}

function recommended() {
  return Object.entries(LESSONS)
    .filter(([k]) => !state.done.includes(k))
    .map(([k, l]) => ({ k, l, score: (state.missed.includes(k) ? 0 : 10) + Math.abs(l.g - ((state.levels[l.subject] || 1) + 1)) }))
    .sort((a, b) => a.score - b.score);
}

function runLesson(key) {
  const L = LESSONS[key];
  app.innerHTML = `<section class="card">
    <p class="muted">${L.subject === 'math' ? '🔢' : '📖'} Lesson · Grade ${L.g}</p><h2>${L.title}</h2>
    <p class="big">${L.hook}</p><div class="example">${L.example}</div>
    <button class="btn" id="go">Got it — let's practice</button></section>`;
  $('#go').onclick = () => {
    let i = 0, right = 0;
    const next = () => {
      if (i >= L.practice.length) {
        const stars = '⭐'.repeat(right) + '☆'.repeat(L.practice.length - right);
        if (right >= 2 && !state.done.includes(key)) { state.done.push(key); state.missed = state.missed.filter((m) => m !== key); addXP(20); }
        save();
        app.innerHTML = `<section class="card center"><h2>${right >= 2 ? 'Lesson cleared!' : 'Almost — run it back?'}</h2>
          <p class="stars">${stars}</p>
          <button class="btn" id="home">Back to base</button>
          ${right < 2 ? '<button class="btn ghost" id="retry">Retry</button>' : ''}</section>`;
        $('#home').onclick = home;
        if ($('#retry')) $('#retry').onclick = () => runLesson(key);
        return;
      }
      const item = L.practice[i++];
      maybeBreak(() => ask(item, `Practice ${i}/${L.practice.length}`, (ok) => { if (ok) right++; next(); }));
    };
    next();
  };
}

function home() {
  hud();
  if (!state.levels.math) return startAssessment();
  const recs = recommended();
  app.innerHTML = `<section class="card">
    <h2>Hey Atchi 👋</h2>
    <div class="levels">
      <div class="pill">🔢 Math: Grade ${state.levels.math}</div>
      <div class="pill">📖 Reading: Grade ${state.levels.reading}</div>
    </div>
    <h3>Next missions</h3>
    <div class="missions">${recs.slice(0, 4).map(({ k, l }) =>
      `<button class="mission" data-k="${k}"><span>${l.subject === 'math' ? '🔢' : '📖'}</span><b>${l.title}</b><small>~3 min · +50 XP</small></button>`
    ).join('') || '<p>All missions cleared. More coming soon.</p>'}</div>
    <p class="muted">Cleared: ${state.done.length}/${Object.keys(LESSONS).length}</p>
    <button class="btn ghost" id="retest">Retake level check</button></section>`;
  app.querySelectorAll('.mission').forEach((b) => (b.onclick = () => runLesson(b.dataset.k)));
  $('#retest').onclick = startAssessment;
}

home();
