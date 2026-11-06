// One AudioContext for voice + sound effects, each on its own gain.
// Voice gain goes above 1.0 (louder than the raw clip); a compressor keeps it from clipping.
const PREF = 'jio:audio';
const defaults = { voice: 2, sfx: 0.7 };
let prefs = { ...defaults };
try { Object.assign(prefs, JSON.parse(localStorage.getItem(PREF)) || {}); } catch {}

let ctx, voiceGain, sfxGain;
function graph() {
  if (ctx) { if (ctx.state === 'suspended') ctx.resume(); return ctx; }
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  ctx = new AC();
  const comp = ctx.createDynamicsCompressor();
  comp.threshold.value = -12; comp.knee.value = 8; comp.ratio.value = 6; comp.attack.value = 0.003; comp.release.value = 0.2;
  comp.connect(ctx.destination);
  voiceGain = ctx.createGain(); voiceGain.gain.value = prefs.voice; voiceGain.connect(comp);
  sfxGain = ctx.createGain(); sfxGain.gain.value = prefs.sfx; sfxGain.connect(comp);
  return ctx;
}
// Browsers only allow audio after a tap; warm the context on the first one.
addEventListener('pointerdown', graph, { once: true, capture: true });

export const get = () => ({ ...prefs });
export function set(k, v) {
  prefs[k] = v;
  try { localStorage.setItem(PREF, JSON.stringify(prefs)); } catch {}
  if (ctx) (k === 'voice' ? voiceGain : sfxGain).gain.setTargetAtTime(v, ctx.currentTime, 0.02);
}

// ── Voice ──
const buffers = new Map();
let voiceSrc;
export async function playVoice(key, blob, onEnd) {
  const c = graph();
  if (!c) throw new Error('no audio');
  let buf = buffers.get(key);
  if (!buf) { buf = await c.decodeAudioData(await blob.arrayBuffer()); buffers.set(key, buf); }
  stopVoice();
  const src = c.createBufferSource();
  src.buffer = buf; src.connect(voiceGain);
  src.onended = () => { if (voiceSrc === src) voiceSrc = null; onEnd?.(); };
  src.start();
  voiceSrc = src;
}
export const hasVoice = (key) => buffers.has(key);
export function stopVoice() {
  if (!voiceSrc) return;
  const s = voiceSrc; voiceSrc = null;
  s.onended = null;
  try { s.stop(); } catch {}
}

// ── Sound effects: synthesized, no files ──
function tone(freq, t0, dur, { type = 'sine', vol = 0.3, to } = {}) {
  const o = ctx.createOscillator(), g = ctx.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, t0);
  if (to) o.frequency.exponentialRampToValueAtTime(to, t0 + dur);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(vol, t0 + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  o.connect(g).connect(sfxGain);
  o.start(t0); o.stop(t0 + dur + 0.02);
}
const SFX = {
  tap: (t) => tone(620, t, 0.07, { type: 'triangle', vol: 0.18, to: 520 }),
  key: (t) => tone(440, t, 0.06, { type: 'triangle', vol: 0.16 }),
  right: (t) => { tone(784, t, 0.14, { vol: 0.28 }); tone(1175, t + 0.09, 0.22, { vol: 0.24 }); },
  wrong: (t) => { tone(220, t, 0.18, { type: 'triangle', vol: 0.22, to: 180 }); tone(196, t + 0.12, 0.24, { type: 'triangle', vol: 0.18, to: 150 }); },
  streak: (t) => [659, 880, 1319].forEach((f, i) => tone(f, t + i * 0.07, 0.18, { vol: 0.22 })),
  win: (t) => [523, 659, 784, 1047].forEach((f, i) => tone(f, t + i * 0.1, i === 3 ? 0.5 : 0.2, { type: 'triangle', vol: 0.26 })),
  pop: (t) => tone(300, t, 0.12, { vol: 0.25, to: 900 }),
};
export function sfx(name) {
  if (!prefs.sfx || !graph() || !SFX[name]) return;
  SFX[name](ctx.currentTime + 0.01);
}
