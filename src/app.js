import { ASSESSMENT, LESSONS } from './content.js?v=6';
import * as cloud from './cloud.js?v=6';
import * as voice from './speech.js?v=6';
import * as jio from './mascot.js?v=6';
import * as audio from './audio.js?v=6';

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
const bubble = $('#bubble');
const shuffle = (a) => [...a].sort(() => Math.random() - 0.5);
const pick = (a) => a[Math.floor(Math.random() * a.length)];
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const icon = (subject) => (subject === 'math' ? 'ph-calculator' : 'ph-book-open-text');
const QS_PER_SUBJECT = 6;
const BREAK_MS = 8 * 60 * 1000;
let sessionStart = Date.now();

jio.mount($('#stage'));

// Jio's lines. Short, plain, encouraging. No sarcasm on misses.
const LINES = {
  right: ['Nice!', 'Yes! That one.', 'Got it.', 'Clean.', 'Easy work.'],
  streak: (n) => [`${n} in a row!`, `${n} straight. Keep going.`, `On fire. ${n} in a row.`],
  wrong: ['Close one. Look at the green.', 'All good. Now you know.', "That's how we learn it.", 'Shake it off.'],
  unsure: ['Good call. Better than guessing.', 'No stress. That helps me pick lessons.'],
};
function say(text, mood, ms) {
  bubble.textContent = text;
  bubble.classList.remove('say'); void bubble.offsetWidth; bubble.classList.add('say');
  if (mood) jio.mood(mood, ms);
}

function hud(bump) {
  $('#xp span').textContent = state.xp;
  $('#streak span').textContent = state.streak;
  const on = voice.autoRead();
  $('#read').setAttribute('aria-pressed', on);
  $('#read i').className = `ph-bold ${on ? 'ph-speaker-high' : 'ph-speaker-slash'}`;
  if (bump) { const c = $(bump); c.classList.remove('bump'); void c.offsetWidth; c.classList.add('bump'); }
}
function setRead(on) {
  voice.setAutoRead(on);
  if (!on) voice.stop();
  hud();
  say(on ? "I'll read everything out loud." : 'Okay, reading is off.', 'happy', 1400);
}
$('#read').onclick = () => { audio.sfx('tap'); setRead(!voice.autoRead()); };

// Sound settings sheet
const dlg = $('#settings');
const pct = (v) => `${Math.round(v * 100)}%`;
$('#gear').onclick = () => {
  audio.sfx('tap');
  const p = audio.get();
  $('#vol-voice').value = p.voice; $('#out-voice').textContent = pct(p.voice);
  $('#vol-sfx').value = p.sfx; $('#out-sfx').textContent = pct(p.sfx);
  $('#auto-read').checked = voice.autoRead();
  dlg.showModal();
};
$('#vol-voice').oninput = (e) => { audio.set('voice', +e.target.value); $('#out-voice').textContent = pct(+e.target.value); };
$('#vol-sfx').oninput = (e) => { audio.set('sfx', +e.target.value); $('#out-sfx').textContent = pct(+e.target.value); };
$('#vol-sfx').onchange = () => audio.sfx('right');
$('#test-voice').onclick = () => voice.say('Hey Atchi! This is how loud I am.');
$('#test-sfx').onclick = () => audio.sfx('win');
$('#auto-read').onchange = (e) => setRead(e.target.checked);
dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });

function addXP(n, from) {
  state.xp += n; save(); hud('#xp');
  if (from) {
    const r = from.getBoundingClientRect();
    const f = document.createElement('div');
    f.className = 'fly'; f.textContent = `+${n}`;
    f.style.left = `${r.left + r.width / 2 - 16}px`; f.style.top = `${r.top - 8}px`;
    document.body.appendChild(f); setTimeout(() => f.remove(), 950);
  }
}

// Swap the card. Speaker buttons are wired here. Auto-read speaks readText.
function render(html, readText) {
  voice.stop();
  app.innerHTML = `<section class="card">${html}</section>`;
  app.querySelectorAll('[data-say]').forEach((b) => (b.onclick = (e) => { e.stopPropagation(); voice.say(b.dataset.say); }));
  if (readText && voice.autoRead()) voice.say(readText);
  if (matchMedia('(max-width: 860px)').matches) scrollTo({ top: 0, behavior: 'smooth' });
}
const spk = (text) => `<button class="spk" data-say="${esc(text)}" aria-label="Read out loud"><i class="ph-bold ph-speaker-high"></i></button>`;
const steps = (n, total) => `<div class="steps" aria-label="Question ${n} of ${total}">${
  Array.from({ length: total }, (_, i) => `<span class="${i < n - 1 ? 'on' : i === n - 1 ? 'now' : ''}"></span>`).join('')}</div>`;

function maybeBreak(next) {
  if (Date.now() - sessionStart < BREAK_MS) return next();
  const m = pick(['Do 10 jumping jacks.', 'Reach for the ceiling for 10 seconds.', 'Go grab some water.', 'Do 5 wall push-ups.', 'Shake it out for 15 seconds.']);
  say('Brain break! Move first, then we keep going.', 'cheer', 1800);
  render(`<p class="label"><i class="ph-bold ph-person-simple-run"></i>Brain break</p>
    <h1>${m}</h1>
    <p class="lead">Get up, move, come back. Worth 5 XP.</p>
    <button class="btn" id="back">I'm back <i class="ph-bold ph-arrow-right"></i></button>`, `Brain break! ${m}`);
  audio.sfx('pop');
  $('#back').onclick = (e) => { audio.sfx('tap'); sessionStart = Date.now(); addXP(5, e.currentTarget); next(); };
}

// One question. meta = {kind, subject, skill, grade}. allowUnsure adds a "not sure" option.
function ask(item, { label, n, total, meta, allowUnsure }, onAnswer) {
  const { q, a, choices } = item;
  jio.mood('think');
  render(`${steps(n, total)}
    <p class="label"><i class="ph-bold ${icon(meta.subject)}"></i>${label}</p>
    <div class="qrow"><h2>${esc(q)}</h2>${spk(q)}</div>
    <div class="choices">${shuffle(choices).map((c, i) =>
      `<button class="choice" style="--i:${i}" data-v="${esc(c)}">${esc(c)}<span class="mark"></span></button>`).join('')}</div>
    ${allowUnsure ? '<button class="link" id="unsure">I\'m not sure</button>' : ''}`, q);

  let done = false;
  const finish = (picked, ok, unsure) => {
    if (done) return;
    done = true;
    voice.stop();
    app.querySelectorAll('.choice').forEach((x) => {
      x.disabled = true;
      if (x.dataset.v === a) { x.classList.add('right'); x.querySelector('.mark').innerHTML = '<i class="ph-fill ph-check-circle"></i>'; }
      else if (x !== picked) x.classList.add('dim');
    });
    if (picked && !ok) { picked.classList.add('wrong'); picked.querySelector('.mark').innerHTML = '<i class="ph-fill ph-x-circle"></i>'; }
    state.streak = ok ? state.streak + 1 : 0;
    cloud.logAnswer({ ...meta, question: q, answer: unsure ? '(not sure)' : picked.dataset.v, correct: ok });
    audio.sfx(ok ? (state.streak >= 3 ? 'streak' : 'right') : 'wrong');
    if (ok) {
      addXP(10, picked);
      say(state.streak >= 3 ? pick(LINES.streak(state.streak)) : pick(LINES.right), state.streak >= 3 ? 'cheer' : 'happy', 1200);
    } else {
      save(); hud();
      say(pick(unsure ? LINES.unsure : LINES.wrong), unsure ? 'idle' : 'sad', 1500);
    }
    hud('#streak');
    setTimeout(() => onAnswer(ok), ok ? 900 : 1700);
  };
  app.querySelectorAll('.choice').forEach((b) => (b.onclick = () => finish(b, b.dataset.v === a, false)));
  const u = $('#unsure');
  if (u) u.onclick = () => finish(null, false, true);
}

// Adaptive placement: start at grade 2, up on right, down on wrong.
function placement(subject, done) {
  const bank = ASSESSMENT[subject];
  const used = new Set(); const tally = {};
  let grade = 2, n = 0;
  say(subject === 'math' ? 'Math first. Six quick ones.' : 'Now reading. Six more.', 'happy', 1400);
  const step = () => {
    if (n >= QS_PER_SUBJECT) return finish();
    const item = bank.find((x) => x.g === grade && !used.has(x))
      || bank.filter((x) => !used.has(x)).sort((x, y) => Math.abs(x.g - grade) - Math.abs(y.g - grade))[0];
    if (!item) return finish();
    used.add(item); n++;
    ask(item, {
      label: subject === 'math' ? 'Math check' : 'Reading check', n, total: QS_PER_SUBJECT, allowUnsure: true,
      meta: { kind: 'assessment', subject, skill: item.skill, grade: item.g },
    }, (ok) => {
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
  const intro = "Twelve quick questions so I know where to start. Not a test. If you don't know one, hit I'm not sure instead of guessing.";
  say("Let's see where you're at.", 'happy', 1600);
  render(`<p class="label"><i class="ph-bold ph-target"></i>Level check</p>
    <div class="qrow"><h1>Let's find your level.</h1>${spk(intro)}</div>
    <p class="lead">Twelve quick questions. No grade. If you don't know one, tap "I'm not sure" instead of guessing.</p>
    <button class="btn" id="go">Start <i class="ph-bold ph-arrow-right"></i></button>`, intro);
  $('#go').onclick = (e) => {
    const btn = e.currentTarget;
    audio.sfx('tap');
    placement('math', () => placement('reading', () => { addXP(25, btn); audio.sfx('win'); home(true); }));
  };
}

function recommended() {
  return Object.entries(LESSONS)
    .filter(([k]) => !state.done.includes(k))
    .map(([k, l]) => ({ k, l, score: (state.missed.includes(k) ? 0 : 10) + Math.abs(l.g - ((state.levels[l.subject] || 1) + 1)) }))
    .sort((a, b) => a.score - b.score || a.l.g - b.l.g);
}

function runLesson(key) {
  const L = LESSONS[key];
  const read = `${L.title}. ${L.hook} For example: ${L.example}`;
  say(pick(['New one. You got this.', 'Read this part, then we practice.', 'Quick lesson, then three questions.']), 'happy', 1400);
  render(`<p class="label"><i class="ph-bold ${icon(L.subject)}"></i>Lesson</p>
    <div class="qrow"><h1>${esc(L.title)}</h1>${spk(read)}</div>
    <p class="lead">${esc(L.hook)}</p>
    <div class="example">${esc(L.example)}</div>
    <button class="btn" id="go">Let's practice <i class="ph-bold ph-arrow-right"></i></button>`, read);
  $('#go').onclick = () => {
    audio.sfx('tap');
    let i = 0, right = 0;
    const total = L.practice.length;
    const next = () => {
      if (i >= total) return result();
      const item = L.practice[i++];
      maybeBreak(() => ask(item, { label: L.title, n: i, total, meta: { kind: 'lesson', subject: L.subject, skill: key, grade: L.g } },
        (ok) => { if (ok) right++; next(); }));
    };
    const result = () => {
      const pass = right >= 2;
      if (pass && !state.done.includes(key)) { state.done.push(key); state.missed = state.missed.filter((m) => m !== key); }
      save();
      const stars = Array.from({ length: total }, (_, j) =>
        `<i class="${j < right ? 'ph-fill' : 'ph-bold'} ph-star" style="--i:${j}"></i>`).join('');
      say(pass ? (right === total ? 'Perfect run!' : 'Cleared it!') : 'Almost. One more try?', pass ? 'cheer' : 'sad', 2000);
      render(`<p class="label"><i class="ph-bold ${icon(L.subject)}"></i>${esc(L.title)}</p>
        <h1>${pass ? 'Lesson cleared.' : 'So close.'}</h1>
        <div class="stars" aria-label="${right} of ${total} stars">${stars}</div>
        <div class="btn-row">
          ${pass ? '' : '<button class="btn" id="retry">Try again</button>'}
          <button class="btn ${pass ? '' : 'ghost'}" id="home">${pass ? 'Next mission' : 'Back home'}</button>
        </div>`, pass ? 'Lesson cleared!' : 'So close. Want to try again?');
      if (pass) { addXP(20, $('.stars')); audio.sfx('win'); }
      $('#home').onclick = () => home();
      if ($('#retry')) $('#retry').onclick = () => runLesson(key);
    };
    next();
  };
}

function home(justAssessed) {
  hud();
  if (!state.levels.math) return startAssessment();
  const recs = recommended().slice(0, 4);
  const total = Object.keys(LESSONS).length;
  say(justAssessed ? 'Done! I picked your next missions.' : pick(['Welcome back, Atchi.', 'Ready when you are.', "Let's knock one out."]), 'happy', 1600);
  render(`<h1>Hey Atchi.</h1>
    <div class="levels">
      <div class="level"><i class="ph-bold ph-calculator"></i><b>Grade ${state.levels.math}</b><span>Math level</span></div>
      <div class="level"><i class="ph-bold ph-book-open-text"></i><b>Grade ${state.levels.reading}</b><span>Reading level</span></div>
    </div>
    <h3>Next missions</h3>
    <div class="missions">${recs.map(({ k, l }, i) =>
      `<button class="mission" style="--i:${i}" data-k="${k}">
        <span class="ico"><i class="ph-bold ${icon(l.subject)}"></i></span>
        <span><b>${esc(l.title)}</b><small>About 3 min, 50 XP</small></span>
        <i class="ph-bold ph-caret-right go"></i></button>`).join('')
      || '<p class="lead">Every mission cleared. New ones are on the way.</p>'}</div>
    <div class="foot"><span>${state.done.length} of ${total} cleared</span>
      <span><button class="link" id="retest">Redo level check</button><button class="link" id="out">Log out</button></span></div>`);
  app.querySelectorAll('.mission').forEach((b) => (b.onclick = () => { audio.sfx('tap'); runLesson(b.dataset.k); }));
  $('#retest').onclick = startAssessment;
  $('#out').onclick = () => { cloud.logout(); pinScreen(); };
}

// Cloud wins if it has data; otherwise upload what this device already has.
function adopt(remote) {
  const local = loadLocal();
  const hasCloud = remote && remote.levels && Object.keys(remote.levels).length;
  state = Object.assign(fresh(), hasCloud ? remote : local || {});
  save();
  home();
}

// One global key handler; it only acts while the PIN pad is on screen.
let pinPress = null;
addEventListener('keydown', (e) => {
  if (!pinPress || !app.querySelector('.pin') || dlg.open) return;
  if (/^\d$/.test(e.key)) pinPress(e.key);
  else if (e.key === 'Backspace') pinPress('del');
});

function pinScreen(msg = '') {
  let pin = '';
  say(msg ? 'Hmm, not that one.' : "Hey! What's your PIN?", msg ? 'sad' : 'happy', 1400);
  const draw = (shake) => {
    app.innerHTML = `<section class="card pin">
      <h1>Welcome back.</h1>
      <p class="lead" style="margin-inline:auto">Type your 4-digit PIN.</p>
      <div class="dots${shake ? ' no' : ''}">${[0, 1, 2, 3].map((i) => `<span class="${i < pin.length ? 'on' : ''}"></span>`).join('')}</div>
      <p class="err" role="alert">${msg}</p>
      <div class="pad">${[1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0, 'del'].map((k) =>
        k === '' ? '<span class="key blank"></span>'
        : `<button class="key" data-k="${k}" aria-label="${k === 'del' ? 'Delete' : k}">${k === 'del' ? '<i class="ph-bold ph-backspace"></i>' : k}</button>`).join('')}</div>
    </section>`;
    app.querySelectorAll('.key[data-k]').forEach((b) => (b.onclick = () => press(b.dataset.k)));
  };
  const press = async (k) => {
    audio.sfx('key');
    if (k === 'del') pin = pin.slice(0, -1);
    else if (pin.length >= 4) return;
    else pin += k;
    msg = '';
    draw();
    if (pin.length < 4) return;
    app.querySelectorAll('.key').forEach((b) => (b.disabled = true));
    jio.mood('think');
    try {
      const res = await cloud.login(pin);
      if (res) { audio.sfx('win'); return adopt(res.progress); }
      audio.sfx('wrong');
      msg = 'Nope, try again.';
      say('Hmm, not that one.', 'sad', 1400);
    } catch {
      msg = "Can't connect. Check the Wi-Fi.";
      say("I can't reach the internet.", 'sad', 1800);
    }
    pin = ''; draw(true);
  };
  pinPress = press;
  draw();
}

async function boot() {
  hud();
  if (!cloud.token()) return pinScreen();
  jio.mood('think');
  const res = await cloud.load();
  if (!res) return pinScreen();
  adopt(res.progress);
}
boot();
