// TTS via Cloak API, played through the boosted voice channel. Browser voice as fallback.
import * as audio from './audio.js?v=10';

const API = 'https://api.usecloak.org/v1/speech';
const PREF = 'atchiverse:autoread';
const blobs = new Map();
let seq = 0;

export const autoRead = () => { try { return localStorage.getItem(PREF) === '1'; } catch { return false; } };
export const setAutoRead = (on) => { try { localStorage.setItem(PREF, on ? '1' : '0'); } catch {} };

const talk = (on) => dispatchEvent(new CustomEvent('jio:talk', { detail: on }));

export function stop() {
  seq++;
  talk(false);
  audio.stopVoice();
  if ('speechSynthesis' in window) speechSynthesis.cancel();
}

function fallback(text) {
  if (!('speechSynthesis' in window)) return;
  const u = new SpeechSynthesisUtterance(text);
  u.rate = 0.9;
  u.volume = 1; // browser voices can't go past 1
  u.onstart = () => talk(true); u.onend = () => talk(false);
  speechSynthesis.speak(u);
}

// Turn symbols into words so the voice reads math right.
const clean = (t) => t.replace(/×/g, ' times ').replace(/÷/g, ' divided by ').replace(/−/g, ' minus ')
  .replace(/\+/g, ' plus ').replace(/=\s*\?/g, ' equals what?').replace(/___/g, ' blank ')
  .replace(/(\d)\/(\d)/g, '$1 over $2').replace(/→/g, ', then ').replace(/[\u{1F300}-\u{1FAFF}☀-➿]/gu, '');

export async function say(text) {
  stop();
  const my = seq;
  const t = clean(text).trim().slice(0, 600);
  if (!t) return;
  try {
    let blob = blobs.get(t);
    if (!blob && !audio.hasVoice(t)) {
      const r = await fetch(API, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: t }) });
      if (!r.ok) throw new Error(r.status);
      blob = await r.blob();
      blobs.set(t, blob);
    }
    if (my !== seq) return; // something else started talking meanwhile
    talk(true);
    await audio.playVoice(t, blob, () => talk(false));
  } catch {
    if (my === seq) fallback(t);
  }
}

// ── Narration for the video feed ──
// Fetches are de-duplicated so prefetch + play share one request.
const inflight = new Map();
export function fetchVoice(text) {
  const t = clean(text).trim().slice(0, 600);
  if (blobs.has(t)) return Promise.resolve(blobs.get(t));
  if (!inflight.has(t)) {
    inflight.set(t, fetch(API, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: t }) })
      .then((r) => { if (!r.ok) throw new Error(r.status); return r.blob(); })
      .then((b) => { blobs.set(t, b); return b; })
      .finally(() => inflight.delete(t)));
  }
  return inflight.get(t);
}
export const prefetch = (text) => fetchVoice(text).catch(() => {});

// Speak one line. Resolves with its duration in seconds once audio starts,
// or null if no audio (caller then runs on an estimated timer). onEnd fires when it finishes.
export async function narrate(text, onEnd) {
  stop();
  const my = seq;
  const t = clean(text).trim().slice(0, 600);
  try {
    const blob = await Promise.race([fetchVoice(text), new Promise((_, rej) => setTimeout(() => rej(new Error('slow')), 7000))]);
    if (my !== seq) return null;
    talk(true);
    return await audio.playVoice(t, blob, () => { talk(false); onEnd?.(); });
  } catch {
    return null;
  }
}
