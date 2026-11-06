import { ASSESSMENT, LESSONS, PATH } from './content.js?v=7';
import * as cloud from './cloud.js?v=7';
import * as voice from './speech.js?v=7';
import * as jio from './mascot.js?v=7';
import * as audio from './audio.js?v=7';
import { hasGen, make } from './gen.js?v=7';
import { GAMES, play } from './games.js?v=7';
import { confetti, confettiFrom } from './fx.js?v=7';

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
const icon = (subject) => (subject === 'math' ? 'ph-calculator' : 'ph-book-open-text');
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
const nextIn = (subject) => {
  for (const u of PATH[subject]) for (const k of u.skills) if (!passed(k)) return { k, unit: u.unit };
  return null;
};
// Fact skills he has reached so far feed Fact Sprint.
const FACTS = ['make-10', 'doubles', 'add-20', 'sub-20', 'fact-families', 'mult-easy', 'mult-mid', 'mult-hard', 'div-facts'];
function mathPool() {
  const order = PATH.math.flatMap((u) => u.skills).filter((k) => FACTS.includes(k));
  const cur = nextIn('math')?.k;
  const idx = Math.max(order.indexOf(cur), 0);
  const reached = order.slice(0, idx + 1);
  return reached.length >= 2 ? reached : order.slice(0, 3);
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
  render(`<p class="label"><i class="ph-bold ${icon(L.subject)}"></i>Lesson</p>
    <div class="qrow"><h1>${esc(L.title)}</h1>${spk(read)}</div>
    <p class="lead">${esc(L.hook)}</p>
    <div class="example">${esc(L.example)}</div>
    <p class="muted-sm">${total} questions. Get ${need} right to clear it.</p>
    <button class="btn" id="go">Let's practice <i class="ph-bold ph-arrow-right"></i></button>`, read);
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
      const prev = state.mastery[key] || 0;
      if (stars > prev) state.mastery[key] = stars;
      if (pass && !state.done.includes(key)) state.done.push(key);
      save();
      say(pass ? (stars === 3 ? 'Perfect run!' : 'Cleared it!') : `${right} of ${total}. One more try?`, pass ? 'cheer' : 'sad', 2000);
      const nxt = nextIn(L.subject);
      render(`<p class="label"><i class="ph-bold ${icon(L.subject)}"></i>${esc(L.title)}</p>
        <h1>${pass ? (stars === 3 ? 'Perfect.' : 'Lesson cleared.') : 'So close.'}</h1>
        <p class="lead">${right} of ${total} right${pass ? '' : `. Need ${need}.`}</p>
        <div class="stars big-stars" aria-label="${stars} of 3 stars">${Array.from({ length: 3 }, (_, j) =>
          `<i class="${j < stars ? 'ph-fill' : 'ph-bold'} ph-star" style="--i:${j}"></i>`).join('')}</div>
        <div class="btn-row">
          ${pass && nxt ? `<button class="btn" id="next">Next: ${esc(LESSONS[nxt.k].title)}</button>` : ''}
          ${pass ? '' : '<button class="btn" id="retry">Try again</button>'}
          <button class="btn ghost" id="home">Home</button>
        </div>`, pass ? 'Lesson cleared!' : 'So close. Want to try again?');
      if (pass) {
        addXP(20 + stars * 10, $('.stars'));
        audio.sfx('win');
        confettiFrom($('.stars'), stars === 3 ? 140 : 80);
      }
      $('#home').onclick = () => { audio.sfx('tap'); home(); };
      $('#retry') && ($('#retry').onclick = () => { audio.sfx('tap'); runLesson(key); });
      $('#next') && ($('#next').onclick = () => { audio.sfx('tap'); runLesson(nxt.k); });
    };
    next();
  };
}

// ── Games ──────────────────────────────────────────────────────────────
function runGame(id) {
  audio.sfx('tap');
  app.innerHTML = '';
  play(id, {
    app, say, sfx: audio.sfx, mathPool,
    onEnd: (score, title) => {
      if (score === null) return home();
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
          <button class="btn ghost" id="home">Home</button>
        </div>`, `${score} points!`);
      if (xp) addXP(xp, $('#final'));
      audio.sfx(record ? 'win' : 'streak');
      if (record) confettiFrom($('#final'), 140);
      $('#again').onclick = () => runGame(id);
      $('#home').onclick = () => { audio.sfx('tap'); home(); };
    },
  });
}

// ── Home ───────────────────────────────────────────────────────────────
function home(justAssessed) {
  hud();
  if (role === 'parent') return dashboard();
  if (role === 'student' && !state.levels.math && !Object.keys(state.mastery).length) return startAssessment();
  const m = nextIn('math'), r = nextIn('reading');
  const allSkills = [...PATH.math, ...PATH.reading].flatMap((u) => u.skills);
  const cleared = allSkills.filter(passed).length;
  say(justAssessed ? 'Done! Your path is ready.' : pick([`Welcome back, ${who}.`, 'Ready when you are.', "Let's knock one out.", 'Tap me if you get bored.']), 'happy', 1600);

  const nextCard = (n, subject) => n ? `<button class="up" data-k="${n.k}">
      <span class="up-ico"><i class="ph-bold ${icon(subject)}"></i></span>
      <span class="up-txt"><small>${subject === 'math' ? 'Math' : 'Reading'} · ${esc(n.unit)}</small><b>${esc(LESSONS[n.k].title)}</b></span>
      <i class="ph-bold ph-play-circle up-go"></i></button>`
    : `<div class="up done-all"><i class="ph-fill ph-trophy"></i><b>${subject === 'math' ? 'Math' : 'Reading'} path complete</b></div>`;

  const map = (subject) => PATH[subject].map((u) => `<div class="unit"><p class="unit-name">${esc(u.unit)}</p><div class="nodes">${
    u.skills.map((k) => {
      const st = state.mastery[k] || 0, cur = (subject === 'math' ? m : r)?.k === k;
      return `<button class="node ${st ? 'got' : ''} ${cur ? 'cur' : ''}" data-k="${k}" title="${esc(LESSONS[k].title)}">
        <span class="node-t">${esc(LESSONS[k].title)}</span><span class="node-s">${st ? starRow(st) : cur ? 'Up next' : ''}</span></button>`;
    }).join('')}</div></div>`).join('');

  render(`<div class="home-head"><h1>Hey ${esc(who)}.</h1>${role === 'debug' ? '<span class="tag">Debug</span>' : ''}</div>
    <h3>Up next</h3>
    <div class="ups">${nextCard(m, 'math')}${nextCard(r, 'reading')}</div>
    <h3>Games</h3>
    <div class="games">${Object.entries(GAMES).map(([id, g], i) => `<button class="game-tile" style="--i:${i}" data-g="${id}">
      <i class="ph-bold ${g.icon}"></i><b>${g.title}</b><small>${state.best[id] ? `Best ${state.best[id]}` : g.blurb}</small></button>`).join('')}</div>
    <div class="tabs" role="tablist">
      <button class="tab on" data-t="math" role="tab">Math path</button><button class="tab" data-t="reading" role="tab">Reading path</button>
    </div>
    <div class="map" id="map">${map('math')}</div>
    <div class="foot"><span>${cleared} of ${allSkills.length} cleared</span>
      <span>${role === 'debug' ? '<button class="link" id="dbg">Debug tools</button>' : ''}<button class="link" id="retest">Level check</button><button class="link" id="out">Log out</button></span></div>`);

  app.querySelectorAll('.up[data-k], .node').forEach((b) => (b.onclick = () => { audio.sfx('tap'); runLesson(b.dataset.k); }));
  app.querySelectorAll('.game-tile').forEach((b) => (b.onclick = () => runGame(b.dataset.g)));
  app.querySelectorAll('.tab').forEach((t) => (t.onclick = () => {
    audio.sfx('tap');
    app.querySelectorAll('.tab').forEach((x) => x.classList.toggle('on', x === t));
    $('#map').innerHTML = map(t.dataset.t);
    app.querySelectorAll('#map .node').forEach((b) => (b.onclick = () => { audio.sfx('tap'); runLesson(b.dataset.k); }));
  }));
  $('#retest').onclick = startAssessment;
  $('#out').onclick = () => { cloud.logout(); pinScreen(); };
  $('#dbg') && ($('#dbg').onclick = debugTools);
}

// ── Debug role: sandbox profile + tools ──────────────────────────────
function debugTools() {
  render(`<p class="label"><i class="ph-bold ph-bug"></i>Debug tools</p>
    <h1>Debug</h1>
    <p class="lead">This profile is separate. Nothing here touches Atchi's data.</p>
    <div class="dbg-grid">
      <button class="btn ghost" data-a="xp">+500 XP</button>
      <button class="btn ghost" data-a="all">Clear every lesson</button>
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
    if (a === 'all') { for (const u of [...PATH.math, ...PATH.reading]) for (const k of u.skills) state.mastery[k] = 3; save(); }
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
  const allSkills = [...PATH.math, ...PATH.reading].flatMap((u) => u.skills);
  const ago = (t) => { if (!t) return 'never'; const m = Math.round((Date.now() - new Date(t)) / 60000); return m < 60 ? `${m} min ago` : m < 1440 ? `${Math.round(m / 60)} h ago` : `${Math.round(m / 1440)} d ago`; };
  render(`<div class="home-head"><h1>Progress</h1><span class="tag">${role === 'debug' ? 'Debug' : 'Parent'}</span></div>
    ${kids.map((k) => {
      const p = migrate(k.progress || {});
      const done = allSkills.filter((s) => (p.mastery[s] || 0) >= 1).length;
      const acc = k.total ? Math.round((100 * k.right) / k.total) : 0;
      const weak = (k.skills || []).filter((s) => s.misses > 0).slice(0, 5);
      return `<h3>${esc(k.name)}</h3>
      <div class="kpis">
        <div class="level"><i class="ph-bold ph-lightning"></i><b>Lv ${lvl(p.xp)}</b><span>${p.xp} XP</span></div>
        <div class="level"><i class="ph-bold ph-check-circle"></i><b>${acc}%</b><span>${k.right} of ${k.total} right</span></div>
        <div class="level"><i class="ph-bold ph-path"></i><b>${done}/${allSkills.length}</b><span>lessons cleared</span></div>
        <div class="level"><i class="ph-bold ph-clock"></i><b>${ago(k.last_active)}</b><span>last active</span></div>
      </div>
      <h3>Needs work</h3>
      ${weak.length ? `<div class="weak">${weak.map((s) => `<div class="weak-row"><span><b>${esc(LESSONS[s.skill]?.title || s.skill)}</b><small>${s.subject}</small></span>
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
