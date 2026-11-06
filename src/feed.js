// History feed: vertical, swipeable 1-minute videos built from illustrated scenes,
// voiceover (Cloak TTS), word-by-word captions, sound effects, likes, and a FAQ sheet.
import { VIDEOS as ALL } from './history.js?v=10';
import { scene } from './scene.js?v=10';
import * as voice from './speech.js?v=10';
import * as audio from './audio.js?v=10';

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const words = (t) => t.trim().split(/\s+/).length;
const CAMS = ['cam-in', 'cam-pan-r', 'cam-out', 'cam-pan-l'];
const GAP = 1.5; // seconds of breathing room after each line
const NUM = ['One', 'Two', 'Three', 'Four'];
// Story beats + recap beats. The recap card builds one point at a time.
export const allBeats = (v) => [...v.beats, ...(v.recap || []).map((pt, k) => ({
  set: 'title', recap: k + 1, sfx: 'chime',
  say: `${k === 0 ? "Let's recap. " : ''}${NUM[k]}: ${pt}.`,
}))];

class Timer {
  start(ms, fn) { this.clear(); this.fn = fn; this.left = ms; this.resume(); }
  resume() { if (!this.fn) return; this.t0 = performance.now(); this.h = setTimeout(() => { const f = this.fn; this.fn = null; f(); }, this.left); }
  pause() { if (!this.fn) return; clearTimeout(this.h); this.left -= performance.now() - this.t0; }
  clear() { clearTimeout(this.h); this.fn = null; }
}

// ctx: { state, save, addXP, log, onClose }
// ids: which videos to show (unlocked ones), in path order.
export function openFeed(ctx, startId, ids) {
  const VIDEOS = ids ? ids.map((id) => ALL.find((v) => v.id === id)).filter(Boolean) : ALL;
  const muted = { v: false };
  const root = document.createElement('div');
  root.className = 'feed';
  root.setAttribute('role', 'dialog');
  root.setAttribute('aria-label', 'History videos');
  root.innerHTML = `
    <div class="feed-top">
      <button class="feed-btn" id="f-close" aria-label="Close"><i class="ph-bold ph-x"></i></button>
      <span class="feed-title">History</span>
      <button class="feed-btn" id="f-mute" aria-label="Mute"><i class="ph-bold ph-speaker-high"></i></button>
    </div>
    <div class="feed-scroll">${VIDEOS.map((v, i) => reelHTML(v, i, ctx.state, VIDEOS.length)).join('')}</div>
    <div class="faq" aria-hidden="true"><div class="faq-card"></div></div>`;
  document.body.appendChild(root);
  document.body.classList.add('feed-open');
  const scroller = root.querySelector('.feed-scroll');
  const reels = [...root.querySelectorAll('.reel')];
  const players = reels.map((el, i) => new Player(el, VIDEOS[i], ctx, muted));
  let active = null;

  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      const p = players[+e.target.dataset.i];
      if (e.isIntersecting && e.intersectionRatio > 0.6) {
        if (active && active !== p) active.reset();
        active = p; p.play();
        // warm the next video's first lines
        const nxt = VIDEOS[+e.target.dataset.i + 1];
        if (nxt && !muted.v) nxt.beats.slice(0, 2).forEach((b) => voice.prefetch(b.say));
      } else if (!e.isIntersecting && p === active) { p.reset(); active = null; }
    }
  }, { root: scroller, threshold: [0, 0.6, 1] });
  reels.forEach((r) => io.observe(r));

  const start = Math.max(0, VIDEOS.findIndex((v) => v.id === startId));
  scroller.scrollTop = start * scroller.clientHeight;

  const close = () => {
    players.forEach((p) => p.reset());
    voice.stop(); audio.resumeAll();
    io.disconnect(); removeEventListener('keydown', onKey);
    root.classList.add('closing');
    document.body.classList.remove('feed-open');
    setTimeout(() => root.remove(), 260);
    ctx.onClose?.();
  };
  root.querySelector('#f-close').onclick = close;
  root.querySelector('#f-mute').onclick = (e) => {
    muted.v = !muted.v;
    e.currentTarget.innerHTML = `<i class="ph-bold ${muted.v ? 'ph-speaker-slash' : 'ph-speaker-high'}"></i>`;
    if (muted.v) voice.stop();
    if (active) active.restartBeat();
  };
  const onKey = (e) => {
    if (root.querySelector('.faq.open')) { if (e.key === 'Escape') closeFaq(); return; }
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowDown') scroller.scrollBy({ top: scroller.clientHeight, behavior: 'smooth' });
    else if (e.key === 'ArrowUp') scroller.scrollBy({ top: -scroller.clientHeight, behavior: 'smooth' });
    else if (e.key === ' ') { e.preventDefault(); active?.toggle(); }
  };
  addEventListener('keydown', onKey);

  // FAQ sheet
  const faq = root.querySelector('.faq');
  let faqWasPlaying = false;
  const openFaq = (v) => {
    faqWasPlaying = active && !active.paused;
    active?.pause(true);
    faq.querySelector('.faq-card').innerHTML = faqHTML(v, ctx.state);
    faq.classList.add('open'); faq.setAttribute('aria-hidden', 'false');
    audio.sfx('swoosh');
    faq.querySelectorAll('.faq-q').forEach((b) => (b.onclick = () => { b.parentElement.classList.toggle('open'); audio.sfx('tap'); }));
    faq.querySelectorAll('[data-say]').forEach((b) => (b.onclick = (e) => { e.stopPropagation(); voice.say(b.dataset.say); }));
    faq.querySelector('#faq-close').onclick = closeFaq;
    faq.querySelectorAll('.chk').forEach((b) => (b.onclick = () => {
      const ok = b.dataset.v === v.check.a;
      faq.querySelectorAll('.chk').forEach((x) => { x.disabled = true; if (x.dataset.v === v.check.a) x.classList.add('right'); });
      if (!ok) b.classList.add('wrong');
      audio.sfx(ok ? 'win' : 'wrong');
      ctx.log({ kind: 'history', subject: 'history', skill: `hist-${v.id}`, grade: 6, question: v.check.q, answer: b.dataset.v, correct: ok });
      const res = faq.querySelector('.chk-res');
      res.textContent = ok ? 'Correct! +10 XP' : `Not quite. It's "${v.check.a}".`;
      res.className = `chk-res ${ok ? 'ok' : 'no'}`;
      if (ok) { ctx.state.checks = { ...(ctx.state.checks || {}), [v.id]: true }; ctx.addXP(10, b); }
    }));
  };
  const closeFaq = () => {
    voice.stop();
    faq.classList.remove('open'); faq.setAttribute('aria-hidden', 'true');
    if (faqWasPlaying) active?.resume();
  };
  faq.addEventListener('click', (e) => { if (e.target === faq) closeFaq(); });

  reels.forEach((el, i) => {
    const v = VIDEOS[i], p = players[i];
    el.querySelector('.r-faq').onclick = () => openFaq(v);
    el.querySelector('.r-like').onclick = (e) => p.like(e.currentTarget);
    el.querySelector('.r-replay').onclick = () => p.restart();
    el.querySelector('.end-replay').onclick = () => p.restart();
    el.querySelector('.end-faq').onclick = () => openFaq(v);
    const nextBtn = el.querySelector('.end-next');
    if (nextBtn) nextBtn.onclick = () => scroller.scrollBy({ top: scroller.clientHeight, behavior: 'smooth' });
    // tap = pause/play, double tap = like
    let lastTap = 0, tapTimer;
    el.querySelector('.r-stage').addEventListener('click', (e) => {
      const now = performance.now();
      if (now - lastTap < 280) { clearTimeout(tapTimer); lastTap = 0; p.like(null, e); return; }
      lastTap = now;
      tapTimer = setTimeout(() => p.toggle(), 280);
    });
  });
  return close;
}

function reelHTML(v, i, state, count) {
  const liked = state.likes?.[v.id];
  return `<section class="reel" data-i="${i}" style="--hue:${v.hue}"><div class="r-frame">
    <div class="r-stage"><div class="r-layers"></div><div class="r-over"></div><div class="r-hearts"></div>
      <div class="r-paused"><i class="ph-fill ph-play"></i></div></div>
    <div class="r-prog">${allBeats(v).map(() => '<span><i></i></span>').join('')}</div>
    <div class="r-rail">
      <button class="r-btn r-like${liked ? ' on' : ''}" aria-pressed="${!!liked}" aria-label="Like"><i class="ph-fill ph-heart"></i><small>${liked ? 'Liked' : 'Like'}</small></button>
      <button class="r-btn r-faq" aria-label="FAQ"><i class="ph-fill ph-question"></i><small>FAQ</small></button>
      <button class="r-btn r-replay" aria-label="Replay"><i class="ph-bold ph-arrow-counter-clockwise"></i><small>Replay</small></button>
    </div>
    <div class="r-meta">
      <div class="mini-jio"><span></span><span></span></div>
      <div><b>${esc(v.title)}</b><small>CA History 6th grade, standard ${v.std}${state.watched?.[v.id] ? ' · Watched' : ''}</small></div>
    </div>
    <p class="r-cap" aria-live="polite"></p>
    <div class="r-end"><div class="end-card">
      <i class="ph-fill ph-check-circle"></i><b>Nice. Video done.</b><span class="end-xp"></span>
      <div class="end-btns"><button class="btn end-faq"><i class="ph-bold ph-question"></i>FAQ + quiz</button>
      <button class="btn ghost end-replay">Replay</button>${i < count - 1 ? '<button class="btn ghost end-next">Next video</button>' : ''}</div>
    </div></div>
  </div></section>`;
}

function faqHTML(v, state) {
  return `<div class="faq-head"><div><small>FAQ</small><h2>${esc(v.title)}</h2></div><button class="spk" id="faq-close" aria-label="Close"><i class="ph-bold ph-x"></i></button></div>
    <div class="faq-list">${v.faq.map((f, i) => `<div class="faq-item${i === 0 ? ' open' : ''}">
      <button class="faq-q"><span>${esc(f.q)}</span><i class="ph-bold ph-caret-down"></i></button>
      <div class="faq-a"><p>${esc(f.a)}</p><button class="spk" data-say="${esc(`${f.q} ${f.a}`)}" aria-label="Read out loud"><i class="ph-bold ph-speaker-high"></i></button></div></div>`).join('')}</div>
    <div class="faq-check"><p class="label"><i class="ph-bold ph-target"></i>Quick check${state.checks?.[v.id] ? ' (done)' : ''}</p><h3>${esc(v.check.q)}</h3>
      <div class="chk-grid">${[...v.check.choices].sort(() => Math.random() - 0.5).map((c) => `<button class="choice chk" data-v="${esc(c)}">${esc(c)}</button>`).join('')}</div>
      <p class="chk-res"></p></div>`;
}

class Player {
  constructor(el, v, ctx, muted) {
    Object.assign(this, { el, v, ctx, muted });
    this.i = -1; this.paused = false; this.ended = false; this.timer = new Timer(); this.tok = 0;
    this.beats = allBeats(v);
    this.layers = el.querySelector('.r-layers'); this.over = el.querySelector('.r-over');
    this.cap = el.querySelector('.r-cap'); this.segs = [...el.querySelectorAll('.r-prog span')];
  }
  play() { if (this.i === -1 || this.ended) this.restart(); else if (this.paused) this.resume(); }
  restart() { this.reset(); this.ended = false; this.el.classList.remove('done'); this.beat(0); }
  reset() {
    this.tok++; this.timer.clear(); voice.stop(); audio.resumeAll();
    this.i = -1; this.paused = false; this.el.classList.remove('paused', 'done');
    this.segs.forEach((s) => s.className = '');
  }
  toggle() { this.paused ? this.resume() : this.pause(); }
  pause(silent) {
    if (this.paused || this.ended) return;
    this.paused = true; this.timer.pause(); audio.pauseAll();
    if ('speechSynthesis' in window) speechSynthesis.pause();
    this.el.classList.add('paused');
    if (!silent) this.el.classList.add('show-paused');
  }
  resume() {
    if (!this.paused) return;
    this.paused = false; audio.resumeAll();
    if ('speechSynthesis' in window) speechSynthesis.resume();
    this.el.classList.remove('paused', 'show-paused');
    this.timer.resume();
  }
  restartBeat() { if (this.i >= 0 && !this.ended) { const i = this.i; this.tok++; this.timer.clear(); voice.stop(); this.beat(i); } }

  async beat(i) {
    const tok = ++this.tok;
    if (i >= this.beats.length) return this.finish();
    this.i = i;
    const b = this.beats[i];
    const est = Math.max(3, words(b.say) / 2.3);

    // scene: crossfade a new layer over the old one
    const layer = document.createElement('div');
    layer.className = `r-layer ${CAMS[i % CAMS.length]}`;
    layer.style.setProperty('--dur', `${est + 1}s`);
    const cast = b.cast || (b.set === 'title' && !b.recap && this.v.hero ? [[this.v.hero, 180, { anim: 'a-wave', talk: true, s: 1.3 }]] : []);
    layer.innerHTML = scene(b.set, cast, b.set === 'title' ? this.v.hue : undefined);
    this.layers.appendChild(layer);
    const old = [...this.layers.children].slice(0, -1);
    setTimeout(() => old.forEach((o) => o.remove()), 650);
    this.overlay(b.over, i);
    this.segs.forEach((s, j) => { s.className = j < i ? 'full' : ''; });
    if (!this.muted.v) audio.sfx(b.sfx || 'whoosh');
    this.cap.innerHTML = '';
    // warm the next lines while this one plays
    if (!this.muted.v) this.beats.slice(i + 1, i + 3).forEach((n) => voice.prefetch(n.say));

    let dur = null;
    if (!this.muted.v) {
      this.cap.classList.add('loading');
      dur = await voice.narrate(b.say);
      this.cap.classList.remove('loading');
      if (tok !== this.tok) return; // skipped, scrolled away, or closed
      if (this.paused) audio.pauseAll();
    }
    const d = dur || est;
    this.caption(b.say, d);
    layer.style.setProperty('--dur', `${d + 1}s`);
    const seg = this.segs[i]; seg.style.setProperty('--d', `${d + GAP}s`); seg.className = 'now';
    this.timer.start((d + GAP) * 1000, () => { if (tok === this.tok) this.beat(i + 1); });
    if (this.paused) this.timer.pause();
  }

  caption(text, d) {
    const ws = text.split(/\s+/);
    const total = text.length;
    let acc = 0;
    this.cap.innerHTML = ws.map((w) => {
      const delay = (acc / total) * d * 0.95; acc += w.length + 1;
      return `<span style="animation-delay:${delay.toFixed(2)}s">${esc(w)}</span>`;
    }).join(' ');
  }

  overlay(o, i) {
    const b = this.beats[i];
    if (b.recap) {
      const pts = this.v.recap;
      this.over.innerHTML = `<div class="ov-recap"><h3><i class="ph-fill ph-list-checks"></i>Recap</h3><ol>${pts.map((p, k) =>
        `<li class="${k < b.recap - 1 ? 'shown' : k === b.recap - 1 ? 'shown now' : ''}"><span>${k + 1}</span>${esc(p)}</li>`).join('')}</ol></div>`;
      return;
    }
    if (!o) { this.over.innerHTML = ''; return; }
    if (o.title) {
      this.over.innerHTML = `<h2 class="ov-title">${o.title.split(' ').map((w, wi) => `<span class="ov-w">${[...w].map((ch, ci) =>
        `<span class="ov-ch" style="animation-delay:${(wi * 4 + ci) * 0.035 + 0.15}s">${esc(ch)}</span>`).join('')}</span>`).join(' ')}</h2>`;
    } else if (o.chip) this.over.innerHTML = `<span class="ov-chip">${esc(o.chip)}</span>`;
    else if (o.fact) this.over.innerHTML = `<span class="ov-fact"><i class="ph-fill ph-lightbulb"></i>${esc(o.fact)}</span>`;
    if (o.title && !this.muted.v) audio.sfx('sparkle');
  }

  finish() {
    this.ended = true; this.timer.clear();
    this.segs.forEach((s) => (s.className = 'full'));
    this.el.classList.add('done');
    const st = this.ctx.state;
    const first = !st.watched?.[this.v.id];
    st.watched = { ...(st.watched || {}), [this.v.id]: true };
    this.el.querySelector('.end-xp').textContent = first ? '+15 XP' : '';
    if (first) this.ctx.addXP(15, this.el.querySelector('.end-card b'));
    else this.ctx.save();
    if (!this.muted.v) audio.sfx('win');
  }

  like(btn, e) {
    const st = this.ctx.state;
    const b = btn || this.el.querySelector('.r-like');
    const on = btn ? !st.likes?.[this.v.id] : true; // double tap only likes
    st.likes = { ...(st.likes || {}), [this.v.id]: on };
    if (!on) delete st.likes[this.v.id];
    b.classList.toggle('on', on); b.setAttribute('aria-pressed', on);
    b.querySelector('small').textContent = on ? 'Liked' : 'Like';
    if (on) { b.classList.remove('pop'); void b.offsetWidth; b.classList.add('pop'); if (!this.paused && !this.muted.v) audio.sfx('like'); }
    this.ctx.save();
    if (e) {
      const r = this.el.querySelector('.r-frame').getBoundingClientRect();
      const h = document.createElement('i');
      h.className = 'ph-fill ph-heart big-heart';
      h.style.left = `${e.clientX - r.left}px`; h.style.top = `${e.clientY - r.top}px`;
      this.el.querySelector('.r-hearts').appendChild(h);
      setTimeout(() => h.remove(), 900);
    }
  }
}
