// Mini-games. Short rounds (40-60s), instant feedback, combos. Each one trains a gap from his results.
import { make } from './gen.js?v=11';

export const GAMES = {
  sprint: { title: 'Fact Sprint', icon: 'ph-lightning', blurb: '60 seconds. Answer fast, build a combo.', secs: 60 },
  tenpop: { title: 'Ten Pop', icon: 'ph-circles-four', blurb: 'Pop two numbers that make 10.', secs: 45 },
  catch: { title: 'Word Catch', icon: 'ph-hand-grabbing', blurb: 'Tap the words that fit the rule.', secs: 40 },
};

const R = (lo, hi) => lo + Math.floor(Math.random() * (hi - lo + 1));
const shuffle = (a) => [...a].sort(() => Math.random() - 0.5);
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// ctx: { app, say, sfx, mathPool: () => [skill], onEnd(score, title) }
export function play(id, ctx) {
  const g = GAMES[id];
  let timers = [], raf = 0, over = false;
  const later = (fn, ms) => { const t = setTimeout(fn, ms); timers.push(t); return t; };
  const cleanup = () => { over = true; timers.forEach(clearTimeout); cancelAnimationFrame(raf); };

  ctx.app.innerHTML = `<section class="card game">
    <div class="game-top">
      <p class="label"><i class="ph-bold ${g.icon}"></i>${g.title}</p>
      <div class="game-stats"><span class="combo" id="combo"></span><span class="score" id="score">0</span></div>
    </div>
    <div class="timer"><span id="bar"></span></div>
    <div class="arena" id="arena"><div class="count" id="count">3</div></div>
    <button class="link quit" id="quit">Quit</button>
  </section>`;
  const $ = (s) => ctx.app.querySelector(s);
  $('#quit').onclick = () => { cleanup(); ctx.onEnd(null); };

  let score = 0, combo = 0;
  const setScore = (n) => { score = Math.max(0, n); const el = $('#score'); el.textContent = score; el.classList.remove('bump'); void el.offsetWidth; el.classList.add('bump'); };
  const setCombo = (n) => { combo = n; $('#combo').textContent = n >= 3 ? `${n} combo` : ''; };
  const hit = () => {
    setCombo(combo + 1);
    const mult = combo >= 8 ? 3 : combo >= 4 ? 2 : 1;
    setScore(score + mult);
    ctx.sfx(combo >= 4 && combo % 4 === 0 ? 'streak' : 'right');
    if (combo === 4 || combo === 8) ctx.say(combo === 8 ? 'Triple points!' : 'Double points!', 'cheer', 900);
    else if (combo % 3 === 0) ctx.say(['Yes!', 'Keep going!', 'So fast.', 'On fire.'][R(0, 3)], 'happy', 700);
  };
  const miss = () => { if (combo >= 4) ctx.say('Combo lost. Get it back!', 'sad', 900); setCombo(0); ctx.sfx('wrong'); };

  // 3-2-1, then go
  ctx.say('Get ready...', 'think');
  [2, 1].forEach((n, i) => later(() => { $('#count').textContent = n; ctx.sfx('key'); }, (i + 1) * 600));
  later(() => {
    $('#count').remove(); ctx.sfx('pop'); ctx.say('Go!', 'cheer', 700);
    const end = performance.now() + g.secs * 1000;
    const bar = $('#bar');
    const tick = () => {
      if (over) return;
      const left = Math.max(0, end - performance.now());
      bar.style.transform = `scaleX(${left / (g.secs * 1000)})`;
      bar.classList.toggle('low', left < 10000);
      if (left <= 0) return finish();
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    MODES[id]({ $, later, hit, miss, ctx, isOver: () => over });
  }, 1800);

  function finish() {
    cleanup();
    ctx.onEnd(score, g.title);
  }
}

const MODES = {
  // Rapid facts from his current math skills.
  sprint({ $, later, hit, miss, ctx, isOver }) {
    const pool = ctx.mathPool();
    const arena = $('#arena');
    const next = () => {
      if (isOver()) return;
      const item = make(pool[R(0, pool.length - 1)]);
      arena.innerHTML = `<div class="sprint-q">${esc(item.q)}</div>
        <div class="sprint-grid">${shuffle(item.choices).map((c) => `<button class="choice" data-v="${esc(c)}">${esc(c)}</button>`).join('')}</div>`;
      arena.querySelectorAll('.choice').forEach((b) => (b.onclick = () => {
        arena.querySelectorAll('.choice').forEach((x) => (x.disabled = true));
        if (b.dataset.v === item.a) { b.classList.add('right'); hit(); later(next, 220); }
        else {
          b.classList.add('wrong'); miss();
          arena.querySelector(`[data-v="${CSS.escape(item.a)}"]`)?.classList.add('right');
          later(next, 750);
        }
      }));
    };
    next();
  },

  // 4x4 board of 1-9. Tap two that make 10. Popped pairs are replaced by a new pair, so it never runs dry.
  tenpop({ $, later, hit, miss }) {
    const arena = $('#arena');
    const pairs = Array.from({ length: 8 }, () => { const n = R(1, 9); return [n, 10 - n]; }).flat();
    arena.innerHTML = `<div class="pop-grid">${shuffle(pairs).map((n, i) => `<button class="bubble-n" data-i="${i}">${n}</button>`).join('')}</div>`;
    let sel = null;
    arena.querySelectorAll('.bubble-n').forEach((b) => (b.onclick = () => {
      if (b.classList.contains('gone')) return;
      if (!sel) { sel = b; b.classList.add('sel'); return; }
      if (sel === b) { b.classList.remove('sel'); sel = null; return; }
      const a = sel; sel = null; a.classList.remove('sel');
      if (+a.textContent + +b.textContent === 10) {
        hit();
        [a, b].forEach((x) => x.classList.add('gone'));
        later(() => {
          const n = R(1, 9);
          [[a, n], [b, 10 - n]].sort(() => Math.random() - 0.5).forEach(([x, v]) => { x.textContent = v; x.classList.remove('gone'); x.classList.add('fresh'); later(() => x.classList.remove('fresh'), 400); });
        }, 260);
      } else {
        miss();
        [a, b].forEach((x) => { x.classList.add('no'); later(() => x.classList.remove('no'), 380); });
      }
    }));
  },

  // Words pop up in slots and fade. Tap only the ones that fit the rule.
  catch({ $, later, hit, miss, ctx, isOver }) {
    const r = WORD_RULES[R(0, WORD_RULES.length - 1)];
    const arena = $('#arena');
    arena.innerHTML = `<div class="rule">${esc(r.rule)}</div><div class="slots">${'<div class="slot"></div>'.repeat(6)}</div>`;
    ctx.say(r.rule, 'happy', 1600);
    const slots = [...arena.querySelectorAll('.slot')];
    const spawn = () => {
      if (isOver()) return;
      const free = slots.filter((s) => !s.firstChild);
      if (free.length) {
        const slot = free[R(0, free.length - 1)];
        const yes = Math.random() < 0.55;
        const word = yes ? r.yes[R(0, r.yes.length - 1)] : r.no[R(0, r.no.length - 1)];
        const w = document.createElement('button');
        w.className = 'word'; w.textContent = word;
        w.onclick = () => {
          if (w.dataset.done) return; w.dataset.done = 1;
          w.classList.add(yes ? 'got' : 'bad');
          yes ? hit() : miss();
          later(() => w.remove(), 320);
        };
        slot.appendChild(w);
        later(() => { if (!w.dataset.done) { w.dataset.done = 1; w.classList.add('fade'); later(() => w.remove(), 300); } }, 2600);
      }
      later(spawn, 750);
    };
    spawn();
  },
};

// Rules lean on his reading results: rhymes (strong), tricky spellings ("becaus" miss), prefixes ("pre" miss), compounds.
const WORD_RULES = [
  { rule: 'Tap words that rhyme with "cake"', yes: ['lake', 'bake', 'make', 'snake', 'shake', 'rake', 'flake'], no: ['cat', 'kick', 'back', 'cook', 'sick', 'lock', 'cape'] },
  { rule: 'Tap the words spelled right', yes: ['because', 'friend', 'said', 'people', 'would', 'again', 'enough', 'their'], no: ['becaus', 'freind', 'sed', 'peple', 'wud', 'agen', 'enuff', 'thier'] },
  { rule: 'Tap words with a prefix (un, re, pre)', yes: ['unlock', 'redo', 'preview', 'unfair', 'rewrite', 'preheat', 'unhappy', 'replay'], no: ['under', 'read', 'pretty', 'uncle', 'ready', 'press', 'robot', 'unit'] },
  { rule: 'Tap the compound words', yes: ['sunflower', 'baseball', 'backpack', 'rainbow', 'cupcake', 'football', 'snowman'], no: ['sunny', 'happen', 'tablet', 'garden', 'raining', 'pencil', 'monkey'] },
];
