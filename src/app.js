import { ASSESSMENT, LESSONS } from './content.js';
import * as cloud from './cloud.js';
import * as voice from './speech.js';

const KEY = 'atchiverse:v1';
const fresh = () => ({ xp: 0, streak: 0, levels: {}, missed: [], done: [] });
const loadLocal = () => { try { return JSON.parse(localStorage.getItem(KEY)) || null; } catch { return null; } };
let state = Object.assign(fresh(), loadLocal() || {});
const save = () => {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {}
  cloud.save(state);
};

const $ = (s) => document.querySelector(s);
const app = $('#app');
const shuffle = (a) => [...a].sort(() => Math.random() - 0.5);
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const QS_PER_SUBJECT = 6;
const BREAK_MS = 8 * 60 * 1000;
let sessionStart = Date.now();

function hud() {
  $('#xp').textContent = `⚡ ${state.xp} XP`;
  $('#streak').textContent = `🔥 ${state.streak}`;
  $('#read').textContent = voice.autoRead() ? '🔊 On' : '🔇 Off';
}
function addXP(n) { state.xp += n; save(); hud(); }
$('#read').onclick = () => { voice.setAutoRead(!voice.autoRead()); if (!voice.autoRead()) voice.stop(); hud(); };

function burst(text) {
  const el = document.createElement('div');
  el.className = 'burst'; el.textContent = text;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 900);
}

// Render a card; wire every [data-say] speaker button; auto-read the main text if on.
function render(html, readText) {
  voice.stop();
  app.innerHTML = html;
  app.querySelectorAll('[data-say]').forEach((b) => (b.onclick = (e) => { e.stopPropagation(); voice.say(b.dataset.say); }));
  if (readText && voice.autoRead()) voice.say(readText);
}
const spk = (text) => `<button class="spk" data-say="${esc(text)}" aria-label="Read aloud">🔊</button>`;

function maybeBreak(next) {
  if (Date.now() - sessionStart < BREAK_MS) return next();
  const moves = ['Do 10 jumping jacks', 'Stretch to the ceiling for 10 seconds', 'Grab some water', 'Do 5 wall push-ups', 'Shake it out for 15 seconds'];
  const m = moves[Math.floor(Math.random() * moves.length)];
  render(`<section class="card center">
    <h2>🧠 Brain Break</h2><p class="big">${m}</p>
    <p class="muted">Get up, move, come back. +5 XP</p>
    <button class="btn" id="back">I'm back</button></section>`, `Brain break! ${m}`);
  $('#back').onclick = () => { sessionStart = Date.now(); addXP(5); next(); };
}

// One multiple-choice card. meta = {kind, subject, skill, grade} for logging.
function ask(item, label, meta, onAnswer) {
  const { q, a, choices } = item;
  render(`<section class="card">
    <p class="muted">${label}</p>
    <div class="qrow"><h2 class="q">${esc(q)}</h2>${spk(q)}</div>
    <div class="choices">${shuffle(choices).map((c) => `<button class="choice" data-v="${esc(c)}">${esc(c)}</button>`).join('')}</div>
  </section>`, q);
  let picked = false;
  app.querySelectorAll('.choice').forEach((b) => (b.onclick = () => {
    if (picked) return;
    picked = true;
    voice.stop();
    const ok = b.dataset.v === a;
    app.querySelectorAll('.choice').forEach((x) => { x.disabled = true; if (x.dataset.v === a) x.classList.add('right'); });
    if (!ok) b.classList.add('wrong');
    state.streak = ok ? state.streak + 1 : 0;
    cloud.logAnswer({ ...meta, question: q, answer: b.dataset.v, correct: ok });
    if (ok) { addXP(10); burst(state.streak >= 3 ? `🔥 ${state.streak} streak!` : '+10'); } else { save(); hud(); }
    setTimeout(() => onAnswer(ok), ok ? 650 : 1400);
  }));
}

// Adaptive placement: start at grade 2, up on right, down on wrong.
function placement(subject, done) {
  const bank = ASSESSMENT[subject];
  const used = new Set(); const tally = {};
  let grade = 2, n = 0;
  const step = () => {
    if (n >= QS_PER_SUBJECT) return finish();
    const item = bank.find((x) => x.g === grade && !used.has(x))
      || bank.filter((x) => !used.has(x)).sort((x, y) => Math.abs(x.g - grade) - Math.abs(y.g - grade))[0];
    if (!item) return finish();
    used.add(item); n++;
    ask(item, `${subject === 'math' ? '🔢 Math' : '📖 Reading'} check · ${n}/${QS_PER_SUBJECT}`,
      { kind: 'assessment', subject, skill: item.skill, grade: item.g }, (ok) => {
        const t = (tally[item.g] ||= { r: 0, w: 0 });
        if (ok) t.r++; else { t.w++; if (!state.missed.includes(item.skill)) state.missed.push(item.skill); }
        grade = Math.max(1, Math.min(6, item.g + (ok ? 1 : -1)));
        step();
      });
  };
  const finish = () => {
    const solid = Object.entries(tally).filter(([, t]) => t.r > t.w).map(([g]) => +g);
    state.levels[subject] = solid.length ? Math.max(...solid) : 1;
    state.assessedAt = new Date().toISOString();
    save(); done();
  };
  step();
}

function startAssessment() {
  state.missed = [];
  const intro = '12 quick questions. No grades, no pressure. Wrong answers just help us pick the right lessons.';
  render(`<section class="card center"><h2>Let's find your level 🎯</h2>
    <p>${intro}</p>${spk(intro)}<br><button class="btn" id="go">Start</button></section>`, intro);
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
  const read = `${L.title}. ${L.hook} For example: ${L.example}`;
  render(`<section class="card">
    <p class="muted">${L.subject === 'math' ? '🔢' : '📖'} Lesson · Grade ${L.g}</p>
    <div class="qrow"><h2>${esc(L.title)}</h2>${spk(read)}</div>
    <p class="big">${esc(L.hook)}</p><div class="example">${esc(L.example)}</div>
    <button class="btn" id="go">Got it, let's practice</button></section>`, read);
  $('#go').onclick = () => {
    let i = 0, right = 0;
    const next = () => {
      if (i >= L.practice.length) {
        const stars = '⭐'.repeat(right) + '☆'.repeat(L.practice.length - right);
        const pass = right >= 2;
        if (pass && !state.done.includes(key)) { state.done.push(key); state.missed = state.missed.filter((m) => m !== key); addXP(20); }
        save();
        render(`<section class="card center"><h2>${pass ? 'Lesson cleared!' : 'Almost. Run it back?'}</h2>
          <p class="stars">${stars}</p>
          <button class="btn" id="home">Back to base</button>
          ${pass ? '' : '<button class="btn ghost" id="retry">Retry</button>'}</section>`, pass ? 'Lesson cleared!' : 'Almost. Want to run it back?');
        $('#home').onclick = home;
        if ($('#retry')) $('#retry').onclick = () => runLesson(key);
        return;
      }
      const item = L.practice[i++];
      maybeBreak(() => ask(item, `Practice ${i}/${L.practice.length}`,
        { kind: 'lesson', subject: L.subject, skill: key, grade: L.g }, (ok) => { if (ok) right++; next(); }));
    };
    next();
  };
}

function home() {
  hud();
  if (!state.levels.math) return startAssessment();
  const recs = recommended();
  render(`<section class="card">
    <h2>Hey Atchi 👋</h2>
    <div class="levels">
      <div class="pill">🔢 Math: Grade ${state.levels.math}</div>
      <div class="pill">📖 Reading: Grade ${state.levels.reading}</div>
    </div>
    <h3>Next missions</h3>
    <div class="missions">${recs.slice(0, 4).map(({ k, l }) =>
      `<button class="mission" data-k="${k}"><span>${l.subject === 'math' ? '🔢' : '📖'}</span><b>${esc(l.title)}</b><small>~3 min · +50 XP</small></button>`
    ).join('') || '<p>All missions cleared. More coming soon.</p>'}</div>
    <p class="muted">Cleared: ${state.done.length}/${Object.keys(LESSONS).length}</p>
    <button class="btn ghost" id="retest">Retake level check</button>
    <button class="btn ghost" id="out">Log out</button></section>`);
  app.querySelectorAll('.mission').forEach((b) => (b.onclick = () => runLesson(b.dataset.k)));
  $('#retest').onclick = startAssessment;
  $('#out').onclick = () => { cloud.logout(); pinScreen(); };
}

// Cloud wins if it has data; otherwise upload whatever this device already has.
async function adopt(remote) {
  const local = loadLocal();
  const hasCloud = remote && remote.levels && Object.keys(remote.levels).length;
  if (hasCloud) state = Object.assign(fresh(), remote);
  else if (local) state = Object.assign(fresh(), local);
  else state = fresh();
  save();
  home();
}

function pinScreen(msg = '') {
  let pin = '';
  const draw = () => {
    app.innerHTML = `<section class="card center">
      <h2>Welcome back 🪐</h2><p class="muted">Enter your PIN</p>
      <div class="dots">${[0, 1, 2, 3].map((i) => `<span class="${i < pin.length ? 'on' : ''}"></span>`).join('')}</div>
      <p class="err">${msg}</p>
      <div class="pad">${[1, 2, 3, 4, 5, 6, 7, 8, 9, '⌫', 0, '✓'].map((k) => `<button class="key">${k}</button>`).join('')}</div>
    </section>`;
    app.querySelectorAll('.key').forEach((b) => (b.onclick = () => press(b.textContent)));
  };
  const press = async (k) => {
    if (k === '⌫') pin = pin.slice(0, -1);
    else if (k === '✓' || pin.length >= 4) return;
    else pin += k;
    msg = '';
    draw();
    if (pin.length === 4) {
      app.querySelectorAll('.key').forEach((b) => (b.disabled = true));
      try {
        const res = await cloud.login(pin);
        if (res) return adopt(res.progress);
        msg = 'Nope, try again';
      } catch { msg = "Can't connect. Check Wi-Fi."; }
      pin = ''; draw();
    }
  };
  draw();
}

async function boot() {
  hud();
  if (!cloud.token()) return pinScreen();
  const res = await cloud.load();
  if (!res) return pinScreen();
  adopt(res.progress);
}
boot();
