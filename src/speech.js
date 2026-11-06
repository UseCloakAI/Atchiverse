// TTS via Cloak API, browser voice as fallback. Clips cached per text.
const API = 'https://api.usecloak.org/v1/speech';
const PREF = 'atchiverse:autoread';
const cache = new Map();
let current;

export const autoRead = () => { try { return localStorage.getItem(PREF) === '1'; } catch { return false; } };
export const setAutoRead = (on) => { try { localStorage.setItem(PREF, on ? '1' : '0'); } catch {} };

export function stop() {
  if (current) { current.pause(); current = null; }
  if ('speechSynthesis' in window) speechSynthesis.cancel();
}

function fallback(text) {
  if (!('speechSynthesis' in window)) return;
  const u = new SpeechSynthesisUtterance(text);
  u.rate = 0.9;
  speechSynthesis.speak(u);
}

// Turn symbols into words so the voice reads math right.
const clean = (t) => t.replace(/×/g, ' times ').replace(/÷/g, ' divided by ').replace(/−/g, ' minus ')
  .replace(/\+/g, ' plus ').replace(/=\s*\?/g, ' equals what?').replace(/___/g, ' blank ')
  .replace(/(\d)\/(\d)/g, '$1 over $2').replace(/→/g, ', then ').replace(/[🔢📖⭐☆🔥⚡🎯👋🧠]/gu, '');

export async function say(text) {
  stop();
  const t = clean(text).trim().slice(0, 600);
  if (!t) return;
  try {
    let url = cache.get(t);
    if (!url) {
      const r = await fetch(API, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: t }) });
      if (!r.ok) throw new Error(r.status);
      url = URL.createObjectURL(await r.blob());
      cache.set(t, url);
    }
    current = new Audio(url);
    await current.play();
  } catch { fallback(t); }
}
