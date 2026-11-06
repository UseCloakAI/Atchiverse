import { ASSESSMENT, LESSONS, PATH } from './content.js?v=9';
import * as cloud from './cloud.js?v=9';
import * as voice from './speech.js?v=9';
import * as jio from './mascot.js?v=9';
import * as audio from './audio.js?v=9';
import { hasGen, make } from './gen.js?v=9';
import { GAMES, play } from './games.js?v=9';
import { confetti, confettiFrom } from './fx.js?v=9';
import { VIDEOS } from './history.js?v=9';
import { scene } from './scene.js?v=9';
import { openFeed } from './feed.js?v=9';
import { SUBJECTS, PASS, units, walk, progress, questions } from './path.js?v=9';

// ── State ──────────────────────────────────────────────────────────────
// Each role saves to its own local key so a debug session never touches Atchi's save.
const LOCAL = { student: 'atchiverse:v1', debug: 'jio:debug:v1', parent: 'jio:parent:v1' };
let role = 'student', who = 'Atchi';
const fresh = () => ({ v: 2, xp: 0, streak: 0, levels: {}, missed: [], done: [], mastery: {}, best: {} });
const loadLocal = (r = role) => { try { return JSON.parse(localStorage.getItem(LOCAL[r])) || null; } catch { return null; } };
let state = fresh();
const save = () => {
  if (role === 'parent') return;
  try { localStorage.setItem(LOCAL[role], JSON.stringify(state)); } catch {}
  cloud.save(state);
};

// v1 → v2: credit reading lessons he already cleared. Math restarts at the path start
// because his answer log shows facts within 20 aren't solid yet.
function migrate(raw) {
  const old = (raw && raw.v) !== 2;
  const s = Object.assign(fresh(), raw);
  if (old) {
    const reading = PATH.reading.flatMap((u) => u.skills);
    for (const k of s.done || []) if (reading.includes(k)) s.mastery[k] = Math.max(s.mastery[k] || 0, 2);
    s.v = 2;
  }
  return s;
}

const $ = (s) => document.querySelector(s);
const app = $('#app');
const bubble = $('#bubble');
const shuffle = (a) => [...a].sort(() => Math.random() - 0.5);
const pick = (a) => a[Math.floor(Math.random() * a.length)];
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const icon = (subject) => ({ math: 'ph-calculator', reading: 'ph-book-open-text', history: 'ph-scroll' }[subject] || 'ph-book-open-text');
const QS_PER_SUBJECT = 6;
const BREAK_MS = 8 * 60 * 1000;
let sessionStart = Date.now();

jio.mount($('#stage'));

// ── Jio talk ───────────────────────────────────────────────────────────
const LINES = {
  right: ['Nice!', 'Yes! That one.', 'Got it.', 'Clean.', 'Easy work.', 'Boom.'],
  streak: (n) => [`${n} in a row!`, `${n} straight. Keep going.`, `On fire. ${n} in a row.`],
  wrong: ["Here's the trick. Read it, then keep going.", 'All good. Check the trick.', "That's how we learn it."],
  wrongNoHint: ['Close one. Look at the green.', 'All good. Now you know.', 'Shake it off.'],
  unsure: ['Good call. Better than guessing.', 'No stress. That helps me pick lessons.'],
  poke: ['Hey! That tickles.', 'Boop.', "I'm awake, I'm awake.", 'You found me.', 'Again? Okay, one more.', 'Hi Atchi.'],
  nudge: ['Take your time.', 'Stuck? Tap the speaker and I\'ll read it.', 'No rush. Think it through.'],
};
function say(text, mood, ms) {
  bubble.textContent = text;
  bubble.classList.remove('say'); void bubble.offsetWidth; bubble.classList.add('say');
  if (mood) jio.mood(mood, ms);
}
addEventListener('jio:talk', (e) => document.body.classList.toggle('jio-talking', e.detail));
addEventListener('jio:poke', () => { audio.sfx('pop'); say(pick(LINES.poke), 'cheer', 1000); });

// ── XP levels ──────────────────────────────────────────────────────────
const lvl = (xp) => Math.floor(Math.sqrt(xp / 40)) + 1;
const xpFor = (L) => 40 * (L - 1) ** 2;
function hud(bump) {
  const L = lvl(state.xp), lo = xpFor(L), hi = xpFor(L + 1);
  $('#xp').style.setProperty('--p', ((state.xp - lo) / (hi - lo)).toFixed(3));
  $('#lvl').textContent = L;
  $('#xp-n').textContent = state.xp;
  $('#streak span').textContent = state.streak;
  const on = voice.autoRead();
  $('#read').setAttribute('aria-pressed', on);
  $('#read i').className = `ph-bold ${on ? 'ph-speaker-high' : 'ph-speaker-slash'}`;
  if (bump) { const c = $(bump); c.classList.remove('bump'); void c.offsetWidth; c.classList.add('bump'); }
}
function addXP(n, from) {
  const before = lvl(state.xp);
  state.xp += n; save(); hud('#xp');
  if (from) {
    const r = from.getBoundingClientRect();
    const f = document.createElement('div');
    f.className = 'fly'; f.textContent = `+${n}`;
    f.style.left = `${r.left + r.width / 2 - 16}px`; f.style.top = `${r.top - 8}px`;
    document.body.appendChild(f); setTimeout(() => f.remove(), 950);
  }
  const after = lvl(state.xp);
  if (after > before) setTimeout(() => {
    audio.sfx('win'); confettiFrom($('#xp'), 120);
    say(`Level ${after}! Let's go!`, 'cheer', 2200);
  }, 300);
}

// ── Header controls + sound sheet ──────────────────────────────────────
function setRead(on) {
  voice.setAutoRead(on);
  if (!on) voice.stop();
  hud();
  say(on ? "I'll read everything out loud." : 'Okay, reading is off.', 'happy', 1400);
}
$('#read').onclick = () => { audio.sfx('tap'); setRead(!voice.autoRead()); };
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

// ── Rendering helpers ──────────────────────────────────────────────────
let nudgeTimer;
function render(html, readText, cls = '') {
  voice.stop();
  clearTimeout(nudgeTimer);
  app.innerHTML = `<section class="card ${cls}">${html}</section>`;
  app.querySelectorAll('[data-say]').forEach((b) => (b.onclick = (e) => { e.stopPropagation(); voice.say(b.dataset.say); }));
  if (readText && voice.autoRead()) voice.say(readText);
  if (matchMedia('(max-width: 860px)').matches) scrollTo({ top: 0, behavior: 'smooth' });
}
const spk = (text) => `<button class="spk" data-say="${esc(text)}" aria-label="Read out loud"><i class="ph-bold ph-speaker-high"></i></button>`;
const steps = (n, total) => `<div class="steps" aria-label="Question ${n} of ${total}">${
  Array.from({ length: total }, (_, i) => `<span class="${i < n - 1 ? 'on' : i === n - 1 ? 'now' : ''}"></span>`).join('')}</div>`;
const starRow = (n, max = 3) => Array.from({ length: max }, (_, j) => `<i class="${j < n ? 'ph-fill' : 'ph-bold'} ph-star"></i>`).join('');

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

// ── One question ───────────────────────────────────────────────────────
// After a miss with a hint, he reads the trick and taps "Got it" (no auto-advance), so the strategy sticks.
function ask(item, { label, n, total, meta, allowUnsure }, onAnswer) {
  const { q, a, choices, hint } = item;
  jio.mood('think');
  render(`${steps(n, total)}
    <p class="label"><i class="ph-bold ${icon(meta.subject)}"></i>${esc(label)}</p>
    <div class="qrow"><h2>${esc(q)}</h2>${spk(q)}</div>
    <div class="choices">${shuffle(choices).map((c, i) =>
      `<button class="choice" style="--i:${i}" data-v="${esc(c)}">${esc(c)}<span class="mark"></span></button>`).join('')}</div>
    <div id="after"></div>
    ${allowUnsure ? '<button class="link" id="unsure">I\'m not sure</button>' : ''}`, q);
  nudgeTimer = setTimeout(() => say(pick(LINES.nudge), 'idle'), 20000);

  let done = false;
  const finish = (picked, ok, unsure) => {
    if (done) return;
    done = true;
    clearTimeout(nudgeTimer);
    voice.stop();
    $('#unsure')?.remove();
    app.querySelectorAll('.choice').forEach((x) => {
      x.disabled = true;
      if (x.dataset.v === a) { x.classList.add('right'); x.querySelector('.mark').innerHTML = '<i class="ph-fill ph-check-circle"></i>'; }
      else if (x !== picked) x.classList.add('dim');
    });
    if (picked && !ok) { picked.classList.add('wrong'); picked.querySelector('.mark').innerHTML = '<i class="ph-fill ph-x-circle"></i>'; }
    state.streak = ok ? state.streak + 1 : 0;
    cloud.logAnswer({ ...meta, question: q, answer: unsure ? '(not sure)' : picked.dataset.v, correct: ok });
    audio.sfx(ok ? (state.streak >= 3 ? 'streak' : 'right') : 'wrong');
    hud('#streak');
    if (ok) {
      addXP(10, picked);
      if (state.streak > 0 && state.streak % 5 === 0) confettiFrom(picked, 60);
      say(state.streak >= 3 ? pick(LINES.streak(state.streak)) : pick(LINES.right), state.streak >= 3 ? 'cheer' : 'happy', 1200);
      return setTimeout(() => onAnswer(ok), 900);
    }
    save(); hud();
    if (hint) {
      say(pick(LINES.wrong), 'think');
      $('#after').innerHTML = `<div class="hint"><div class="qrow"><p><b>The trick:</b> ${esc(hint)}</p>${spk(hint)}</div>
        <button class="btn" id="gotit">Got it <i class="ph-bold ph-arrow-right"></i></button></div>`;
      $('#after [data-say]').onclick = () => voice.say(hint);
      if (voice.autoRead()) voice.say(hint);
      $('#gotit').onclick = () => { audio.sfx('tap'); onAnswer(false); };
    } else {
      say(pick(unsure ? LINES.unsure : LINES.wrongNoHint), unsure ? 'idle' : 'sad', 1500);
      setTimeout(() => onAnswer(false), 1700);
    }
  };
  app.querySelectorAll('.choice').forEach((b) => (b.onclick = () => finish(b, b.dataset.v === a, false)));
  const u = $('#unsure');
  if (u) u.onclick = () => finish(null, false, true);
}

// ── Level check (kept for new players and re-checks) ───────────────────
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

// ── Path ───────────────────────────────────────────────────────────────
const passed = (k) => (state.mastery[k] || 0) >= 1;
const curSubject = () => state.ui?.subject || 'math';
// Fact skills he has reached so far feed Fact Sprint.
const FACTS = ['make-10', 'doubles', 'add-20', 'sub-20', 'fact-families', 'mult-easy', 'mult-mid', 'mult-hard', 'div-facts'];
function mathPool() {
  const cur = walk('math', state).current;
  const reached = FACTS.filter((k) => passed(k) || cur?.key === k);
  return reached.length >= 2 ? reached : FACTS.slice(0, 3);
}
const NODE_ICON = { video: 'ph-play', review: 'ph-arrows-clockwise', test: 'ph-trophy' };
const nodeIcon = (n, subject) => (!n.open ? 'ph-lock' : n.done && n.type === 'lesson' ? 'ph-check' : NODE_ICON[n.type] || SUBJECTS[subject].icon);

function openNode(subject, n) {
  if (n.type === 'lesson') return runLesson(n.key);
  if (n.type === 'video') return watch(n.id);
  return runCheck(subject, n);
}
function goNext(subject) {
  const { current } = walk(subject, state);
  return current ? openNode(subject, current) : home();
}

// ── Lessons ────────────────────────────────────────────────────────────
function runLesson(key) {
  const L = LESSONS[key];
  const gen = hasGen(key);
  const items = gen ? Array.from({ length: 5 }, () => make(key)) : shuffle(L.practice);
  const total = items.length;
  const need = gen ? 4 : Math.ceil(total * 0.66);
  const read = `${L.title}. ${L.hook} For example: ${L.example}`;
  say(pick(['New one. You got this.', 'Read this part, then we practice.', `Quick lesson, then ${total} questions.`]), 'happy', 1400);
  render(`<button class="back" id="back"><i class="ph-bold ph-caret-left"></i>Path</button>
    <p class="label"><i class="ph-bold ${icon(L.subject)}"></i>Lesson</p>
    <div class="qrow"><h1>${esc(L.title)}</h1>${spk(read)}</div>
    <p class="lead">${esc(L.hook)}</p>
    <div class="example">${esc(L.example)}</div>
    <p class="muted-sm">${total} questions. Get ${need} right to clear it.</p>
    <button class="btn" id="go">Let's practice <i class="ph-bold ph-arrow-right"></i></button>`, read);
  $('#back').onclick = () => { audio.sfx('tap'); home(); };
  $('#go').onclick = () => {
    audio.sfx('tap');
    let i = 0, right = 0;
    const next = () => {
      if (i >= total) return result();
      const item = items[i++];
      maybeBreak(() => ask(item, { label: L.title, n: i, total, meta: { kind: 'lesson', subject: L.subject, skill: key, grade: L.g } },
        (ok) => { if (ok) right++; next(); }));
    };
    const result = () => {
      const pass = right >= need;
      const stars = !pass ? 0 : right === total ? 3 : right >= need + 1 || total <= 3 ? 2 : 1;
      if (stars > (state.mastery[key] || 0)) state.mastery[key] = stars;
      if (pass && !state.done.includes(key)) state.done.push(key);
      save();
      say(pass ? (stars === 3 ? 'Perfect run!' : 'Cleared it!') : `${right} of ${total}. One more try?`, pass ? 'cheer' : 'sad', 2000);
      const nxt = walk(L.subject, state).current;
      render(`<p class="label"><i class="ph-bold ${icon(L.subject)}"></i>${esc(L.title)}</p>
        <h1>${pass ? (stars === 3 ? 'Perfect.' : 'Lesson cleared.') : 'So close.'}</h1>
        <p class="lead">${right} of ${total} right${pass ? '' : `. Need ${need}.`}</p>
        <div class="stars big-stars" aria-label="${stars} of 3 stars">${Array.from({ length: 3 }, (_, j) =>
          `<i class="${j < stars ? 'ph-fill' : 'ph-bold'} ph-star" style="--i:${j}"></i>`).join('')}</div>
        ${pass && nxt && nxt.type !== 'lesson' ? `<p class="unlock"><i class="ph-fill ph-lock-open"></i>${nxt.type === 'review' ? 'Unit review unlocked' : 'Unit test unlocked'}</p>` : ''}
        <div class="btn-row">
          ${pass && nxt ? `<button class="btn" id="next">Next: ${esc(nxt.title)}</button>` : ''}
          ${pass ? '' : '<button class="btn" id="retry">Try again</button>'}
          <button class="btn ghost" id="home">Back to path</button>
        </div>`, pass ? 'Lesson cleared!' : 'So close. Want to try again?');
      if (pass) { addXP(20 + stars * 10, $('.stars')); audio.sfx('win'); confettiFrom($('.stars'), stars === 3 ? 140 : 80); }
      $('#home').onclick = () => { audio.sfx('tap'); home(); };
      $('#retry') && ($('#retry').onclick = () => { audio.sfx('tap'); runLesson(key); });
      $('#next') && ($('#next').onclick = () => { audio.sfx('tap'); goNext(L.subject); });
    };
    next();
  };
}

// ── Reviews and unit tests ─────────────────────────────────────────────
// Review: mixed practice with hints, pass 70%. Test: no hints, pass 80%, unlocks the next unit.
function runCheck(subject, node) {
  const kind = node.type;
  const us = units(subject);
  const u = us[node.unit];
  const qs = questions(subject, node.unit, kind);
  const total = qs.length;
  const need = Math.ceil(total * PASS[kind]);
  const nextUnit = us[node.unit + 1];
  const isTest = kind === 'test';
  const intro = isTest
    ? `Unit test. ${total} questions, no hints. Get ${need} right to unlock ${nextUnit ? nextUnit.name : 'the finish'}.`
    : `Review time. ${total} mixed questions from ${u.name}. Get ${need} right to unlock the unit test.`;
  say(isTest ? 'Test time. You got this.' : 'Quick review. Hints are on.', 'happy', 1600);
  render(`<button class="back" id="back"><i class="ph-bold ph-caret-left"></i>Path</button>
    <div class="check-hero ${kind}"><i class="ph-fill ${isTest ? 'ph-trophy' : 'ph-arrows-clockwise'}"></i></div>
    <p class="label"><i class="ph-bold ${icon(subject)}"></i>Unit ${node.unit + 1}: ${esc(u.name)}</p>
    <div class="qrow"><h1>${isTest ? 'Unit test' : 'Unit review'}</h1>${spk(intro)}</div>
    <p class="lead">${esc(intro)}</p>
    <button class="btn" id="go">${isTest ? 'Start test' : 'Start review'} <i class="ph-bold ph-arrow-right"></i></button>`, intro);
  $('#back').onclick = () => { audio.sfx('tap'); home(); };
  $('#go').onclick = () => {
    audio.sfx('tap');
    let i = 0, right = 0;
    const missed = new Set();
    const next = () => {
      if (i >= total) return result();
      const item = qs[i++];
      const shown = isTest ? { ...item, hint: undefined } : item;
      ask(shown, { label: isTest ? 'Unit test' : 'Review', n: i, total, meta: { kind, subject, skill: item.skill, grade: item.grade || 6 } },
        (ok) => { if (ok) right++; else missed.add(item.skill); next(); });
    };
    const result = () => {
      const pass = right >= need;
      const stars = !pass ? 0 : right === total ? 3 : right >= need + 1 ? 2 : 1;
      if (stars > (state.mastery[node.id] || 0)) state.mastery[node.id] = stars;
      save();
      const unlocked = pass && isTest && nextUnit;
      const missedNames = [...missed].map((k) => LESSONS[k]?.title || VIDEOS.find((v) => `hist-${v.id}` === k)?.title).filter(Boolean);
      say(pass ? (unlocked ? `Unit ${node.unit + 2} unlocked!` : 'Passed!') : 'Not yet. Check what to practice.', pass ? 'cheer' : 'sad', 2400);
      render(`<div class="check-hero ${kind} ${pass ? 'win' : ''}"><i class="ph-fill ${pass ? (isTest ? 'ph-trophy' : 'ph-check-circle') : 'ph-arrow-counter-clockwise'}"></i></div>
        <h1>${pass ? (isTest ? 'Unit passed!' : 'Review passed.') : 'Not yet.'}</h1>
        <p class="lead">${right} of ${total} right${pass ? '' : `. You need ${need}.`}</p>
        <div class="stars big-stars">${Array.from({ length: 3 }, (_, j) => `<i class="${j < stars ? 'ph-fill' : 'ph-bold'} ph-star" style="--i:${j}"></i>`).join('')}</div>
        ${unlocked ? `<p class="unlock big"><i class="ph-fill ph-lock-open"></i>Unit ${node.unit + 2}: ${esc(nextUnit.name)} unlocked</p>` : ''}
        ${!pass && missedNames.length ? `<div class="practice"><b>Practice these:</b>${missedNames.map((t) => `<span>${esc(t)}</span>`).join('')}</div>` : ''}
        <div class="btn-row">
          ${pass ? '<button class="btn" id="next">Keep going</button>' : '<button class="btn" id="retry">Try again</button>'}
          <button class="btn ghost" id="home">Back to path</button>
        </div>`, pass ? 'Passed!' : 'Not yet.');
      if (pass) {
        addXP(isTest ? 60 + stars * 20 : 30 + stars * 10, $('.stars'));
        audio.sfx('win');
        confettiFrom($('.check-hero'), unlocked ? 220 : 100);
        if (unlocked) setTimeout(() => confetti({ count: 160 }), 500);
      } else audio.sfx('wrong');
      $('#home').onclick = () => { audio.sfx('tap'); home(); };
      $('#retry') && ($('#retry').onclick = () => { audio.sfx('tap'); runCheck(subject, node); });
      $('#next') && ($('#next').onclick = () => { audio.sfx('tap'); goNext(subject); });
    };
    next();
  };
}

// ── Arcade (games live here, off the main path) ────────────────────────
function arcade() {
  say('Arcade! Pick a game.', 'cheer', 1400);
  render(`<button class="back" id="back"><i class="ph-bold ph-caret-left"></i>Path</button>
    <h1>Arcade</h1><p class="lead">Quick games that train your skills. Beat your best.</p>
    <div class="games arcade">${Object.entries(GAMES).map(([id, g], i) => `<button class="game-tile" style="--i:${i}" data-g="${id}">
      <i class="ph-bold ${g.icon}"></i><b>${g.title}</b><small>${state.best[id] ? `Best ${state.best[id]}` : g.blurb}</small></button>`).join('')}</div>`);
  $('#back').onclick = () => { audio.sfx('tap'); home(); };
  app.querySelectorAll('.game-tile').forEach((b) => (b.onclick = () => runGame(b.dataset.g)));
}

// ── Games ──────────────────────────────────────────────────────────────
function runGame(id) {
  audio.sfx('tap');
  app.innerHTML = '';
  play(id, {
    app, say, sfx: audio.sfx, mathPool,
    onEnd: (score, title) => {
      if (score === null) return arcade();
      const best = state.best[id] || 0;
      const record = score > best;
      if (record) state.best[id] = score;
      save();
      const xp = Math.min(60, score * 2);
      say(record && best ? 'New record!' : score >= 10 ? 'That was fast!' : 'Nice run. Again?', record ? 'cheer' : 'happy', 2000);
      render(`<p class="label"><i class="ph-bold ${GAMES[id].icon}"></i>${esc(title)}</p>
        <h1>${record && best ? 'New record!' : 'Time!'}</h1>
        <div class="final"><b id="final">${score}</b><span>points</span></div>
        <p class="lead">Best: ${Math.max(score, best)}</p>
        <div class="btn-row">
          <button class="btn" id="again">Play again</button>
          <button class="btn ghost" id="home">Arcade</button>
        </div>`, `${score} points!`);
      if (xp) addXP(xp, $('#final'));
      audio.sfx(record ? 'win' : 'streak');
      if (record) confettiFrom($('#final'), 140);
      $('#again').onclick = () => runGame(id);
      $('#home').onclick = () => { audio.sfx('tap'); arcade(); };
    },
  });
}

// ── History videos ─────────────────────────────────────────────────────
// Only unlocked videos are in the feed, in path order.
function watch(id) {
  audio.sfx('tap');
  voice.stop();
  const ids = walk('history', state).units.flatMap((u) => u.nodes).filter((n) => n.type === 'video' && n.open).map((n) => n.id);
  say('Watch to the end to unlock the next one.', 'happy', 2200);
  openFeed({ state, save, addXP, log: (a) => cloud.logAnswer(a), onClose: () => home() }, id, ids);
}

// ── Home: one path at a time ───────────────────────────────────────────
const OFFS = [0, 56, 84, 56, 0, -56, -84, -56];
function home(justAssessed) {
  hud();
  if (role === 'parent') return dashboard();
  if (role === 'student' && !state.levels.math && !Object.keys(state.mastery).length) return startAssessment();
  const subject = curSubject();
  const { units: us, current } = walk(subject, state);
  say(justAssessed ? 'Done! Your path is ready.' : current ? pick([`Next up: ${current.title}.`, `Let's do ${current.title}.`, 'Tap the glowing one.']) : 'You finished this whole path!', 'happy', 1800);

  const nodeHTML = (n, j) => `<div class="pnode-wrap" style="--x:${OFFS[j % OFFS.length]}">
      ${n.current ? `<span class="pstart">${n.type === 'test' ? 'Unit test' : n.type === 'review' ? 'Review' : n.type === 'video' ? 'Watch' : 'Start'}</span>` : ''}
      <button class="pnode t-${n.type}${n.done ? ' done' : ''}${n.current ? ' cur' : ''}${n.open ? '' : ' locked'}" data-id="${n.id}" aria-label="${esc(n.title)}${n.open ? '' : ' (locked)'}">
        <i class="ph-${(n.done || n.current) && !(n.done && n.type === 'lesson') ? 'fill' : 'bold'} ${nodeIcon(n, subject)}"></i></button>
      <span class="plabel">${esc(n.title)}</span>
      ${n.done ? `<span class="pstars">${starRow(n.stars)}</span>` : ''}
    </div>`;

  render(`<div class="home-head"><h1>Hey ${esc(who)}.</h1>${role === 'debug' ? '<span class="tag">Debug</span>' : ''}
      <button class="arcade-btn" id="arcade"><i class="ph-fill ph-game-controller"></i>Arcade</button></div>
    <div class="subj" role="tablist">${Object.entries(SUBJECTS).map(([k, s]) => { const p = progress(k, state); return `<button class="subj-b${k === subject ? ' on' : ''}" role="tab" aria-selected="${k === subject}" data-s="${k}">
      <i class="ph-bold ${s.icon}"></i><span>${s.name}</span><small>${p.done}/${p.total}</small></button>`; }).join('')}</div>
    <div class="path">${us.map((u) => `<section class="punit${u.open ? '' : ' locked'}">
      <div class="pbanner"><div><small>Unit ${u.i + 1}</small><b>${esc(u.name)}</b></div>
        <span class="pcount">${u.open ? `${u.doneCount}/${u.nodes.length}` : '<i class="ph-fill ph-lock"></i>'}</span></div>
      <div class="pnodes">${u.nodes.map(nodeHTML).join('')}</div></section>`).join('')}
      ${current ? '' : '<div class="pdone"><i class="ph-fill ph-crown"></i><b>Path complete</b></div>'}</div>
    <div class="foot"><span></span>
      <span>${role === 'debug' ? '<button class="link" id="dbg">Debug tools</button>' : ''}<button class="link" id="retest">Level check</button><button class="link" id="out">Log out</button></span></div>`);

  const all = us.flatMap((u) => u.nodes);
  app.querySelectorAll('.pnode').forEach((b) => (b.onclick = () => {
    const n = all.find((x) => x.id === b.dataset.id);
    if (!n.open) {
      audio.sfx('wrong');
      b.classList.remove('nope'); void b.offsetWidth; b.classList.add('nope');
      return say(current ? `Locked. Finish "${current.title}" first.` : 'Locked.', 'sad', 1600);
    }
    audio.sfx('tap'); openNode(subject, n);
  }));
  app.querySelectorAll('.subj-b').forEach((b) => (b.onclick = () => {
    audio.sfx('tap'); state.ui = { ...(state.ui || {}), subject: b.dataset.s }; save(); home();
  }));
  $('#arcade').onclick = () => { audio.sfx('tap'); arcade(); };
  $('#retest').onclick = startAssessment;
  $('#out').onclick = () => { cloud.logout(); pinScreen(); };
  $('#dbg') && ($('#dbg').onclick = debugTools);
  const cur = app.querySelector('.pnode.cur');
  if (cur) setTimeout(() => cur.scrollIntoView({ behavior: 'smooth', block: 'center' }), 350);
}

// ── Debug role: sandbox profile + tools ──────────────────────────────
function debugTools() {
  render(`<p class="label"><i class="ph-bold ph-bug"></i>Debug tools</p>
    <h1>Debug</h1>
    <p class="lead">This profile is separate. Nothing here touches Atchi's data.</p>
    <div class="dbg-grid">
      <button class="btn ghost" data-a="xp">+500 XP</button>
      <button class="btn ghost" data-a="all">Clear every node</button>
      <button class="btn ghost" data-a="reset">Reset this profile</button>
      <button class="btn ghost" data-a="break">Force brain break</button>
      <button class="btn ghost" data-a="dash">Parent dashboard</button>
      <button class="btn ghost" data-a="confetti">Confetti</button>
    </div>
    <h3>Raw save</h3><pre class="raw">${esc(JSON.stringify(state, null, 2))}</pre>
    <button class="btn" id="home">Home</button>`);
  app.querySelectorAll('[data-a]').forEach((b) => (b.onclick = () => {
    const a = b.dataset.a;
    if (a === 'xp') addXP(500, b);
    if (a === 'all') { for (const sub of Object.keys(SUBJECTS)) for (const u of units(sub)) for (const n of u.nodes) { if (n.type === 'video') state.watched = { ...(state.watched || {}), [n.id]: true }; else state.mastery[n.id] = 3; } save(); }
    if (a === 'reset') { state = fresh(); save(); hud(); }
    if (a === 'break') { sessionStart = 0; return maybeBreak(home); }
    if (a === 'dash') return dashboard();
    if (a === 'confetti') confetti();
    audio.sfx('right');
    if (a !== 'confetti') debugTools();
  }));
  $('#home').onclick = () => home();
}

// ── Parent dashboard (parent + debug roles) ─────────────────────────────────
async function dashboard() {
  say('Here is how Atchi is doing.', 'happy', 1600);
  render('<h1>Loading…</h1><div class="skeleton"></div><div class="skeleton"></div>');
  let kids;
  try { kids = await cloud.overview(); } catch { kids = null; }
  if (!kids) {
    render(`<h1>Can't load right now.</h1><p class="lead">Check the connection and try again.</p>
      <div class="btn-row"><button class="btn" id="again">Retry</button><button class="btn ghost" id="out">Log out</button></div>`);
    $('#again').onclick = dashboard; $('#out').onclick = () => { cloud.logout(); pinScreen(); };
    return;
  }
  const ago = (t) => { if (!t) return 'never'; const m = Math.round((Date.now() - new Date(t)) / 60000); return m < 60 ? `${m} min ago` : m < 1440 ? `${Math.round(m / 60)} h ago` : `${Math.round(m / 1440)} d ago`; };
  render(`<div class="home-head"><h1>Progress</h1><span class="tag">${role === 'debug' ? 'Debug' : 'Parent'}</span></div>
    ${kids.map((k) => {
      const p = migrate(k.progress || {});
      const prog = Object.keys(SUBJECTS).map((k) => progress(k, p));
      const done = prog.reduce((a, x) => a + x.done, 0), steps = prog.reduce((a, x) => a + x.total, 0);
      const where = Object.entries(SUBJECTS).map(([k, sub]) => { const w = walk(k, p); const u = w.units.find((uu) => uu.nodes.includes(w.current));
        return `<div class="weak-row"><span><b>${sub.name}</b><small>${w.current ? `Unit ${u.i + 1}: ${esc(u.name)}` : 'Complete'}</small></span><span class="where">${w.current ? esc(w.current.title) : 'Done'}</span></div>`; }).join('');
      const acc = k.total ? Math.round((100 * k.right) / k.total) : 0;
      const weak = (k.skills || []).filter((s) => s.misses > 0).slice(0, 5);
      return `<h3>${esc(k.name)}</h3>
      <div class="kpis">
        <div class="level"><i class="ph-bold ph-lightning"></i><b>Lv ${lvl(p.xp)}</b><span>${p.xp} XP</span></div>
        <div class="level"><i class="ph-bold ph-check-circle"></i><b>${acc}%</b><span>${k.right} of ${k.total} right</span></div>
        <div class="level"><i class="ph-bold ph-path"></i><b>${done}/${steps}</b><span>path steps done</span></div>
        <div class="level"><i class="ph-bold ph-clock"></i><b>${ago(k.last_active)}</b><span>last active</span></div>
      </div>
      <h3>On the path</h3><div class="weak">${where}</div>
      <h3>Needs work</h3>
      ${weak.length ? `<div class="weak">${weak.map((s) => `<div class="weak-row"><span><b>${esc(LESSONS[s.skill]?.title || VIDEOS.find((v) => `hist-${v.id}` === s.skill)?.title || s.skill)}</b><small>${s.subject}</small></span>
        <span class="weak-n">${s.right}/${s.attempts}</span></div>`).join('')}</div>` : '<p class="lead">Nothing flagged yet.</p>'}
      <h3>Recent answers</h3>
      <div class="recent">${(k.recent || []).slice(0, 15).map((a) => `<div class="ans ${a.correct ? 'ok' : 'no'}">
        <i class="ph-fill ${a.correct ? 'ph-check-circle' : 'ph-x-circle'}"></i>
        <span><b>${esc(a.question)}</b><small>Answered ${esc(a.answer)}</small></span></div>`).join('') || '<p class="lead">No answers yet.</p>'}</div>`;
    }).join('')}
    <div class="foot"><span></span><span>${role === 'debug' ? '<button class="link" id="back">Back</button>' : ''}<button class="link" id="out">Log out</button></span></div>`);
  $('#out').onclick = () => { cloud.logout(); pinScreen(); };
  $('#back') && ($('#back').onclick = () => home());
}

// ── Login ──────────────────────────────────────────────────────────────
// Cloud wins if it has data; otherwise upload this device's save for the same role.
function adopt(res) {
  role = res.role || 'student';
  who = role === 'debug' ? 'Tester' : role === 'parent' ? 'Parent' : (res.name || 'Atchi');
  document.body.dataset.role = role;
  const remote = res.progress;
  const hasCloud = remote && ((remote.levels && Object.keys(remote.levels).length) || remote.mastery);
  state = migrate(hasCloud ? remote : loadLocal() || {});
  save();
  home();
}

let pinPress = null;
addEventListener('keydown', (e) => {
  if (!pinPress || !app.querySelector('.pin') || dlg.open) return;
  if (/^\d$/.test(e.key)) pinPress(e.key);
  else if (e.key === 'Backspace') pinPress('del');
});

function pinScreen(msg = '') {
  let pin = '';
  role = 'student'; state = fresh(); hud();
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
      if (res) { audio.sfx('win'); return adopt(res); }
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
  adopt(res);
}
boot();
