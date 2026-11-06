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
  return buf.duration;
}
// Pause/resume everything (video feed tap-to-pause).
export function pauseAll() { if (ctx && ctx.state === 'running') ctx.suspend(); }
export function resumeAll() { if (ctx && ctx.state === 'suspended') ctx.resume(); }
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
let noiseBuf;
function noise(t0, dur, { vol = 0.25, from = 400, to = 3000, q = 0.8 } = {}) {
  if (!noiseBuf) {
    noiseBuf = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const d = noiseBuf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }
  const src = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
  src.buffer = noiseBuf; f.type = 'bandpass'; f.Q.value = q;
  f.frequency.setValueAtTime(from, t0); f.frequency.exponentialRampToValueAtTime(to, t0 + dur);
  g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(vol, t0 + dur * 0.4); g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  src.connect(f).connect(g).connect(sfxGain); src.start(t0); src.stop(t0 + dur + 0.05);
}
const SFX = {
  whoosh: (t) => noise(t, 0.45, { vol: 0.22, from: 300, to: 2400 }),
  swoosh: (t) => noise(t, 0.3, { vol: 0.18, from: 2600, to: 500 }),
  boom: (t) => { tone(110, t, 0.6, { vol: 0.45, to: 40 }); noise(t, 0.35, { vol: 0.15, from: 200, to: 80, q: 0.5 }); },
  chime: (t) => { tone(1568, t, 0.6, { vol: 0.16 }); tone(2093, t + 0.05, 0.7, { vol: 0.1 }); },
  sparkle: (t) => [1319, 1568, 1976, 2637].forEach((f, i) => tone(f, t + i * 0.05, 0.18, { vol: 0.12 })),
  drum: (t) => [0, 0.18, 0.36].forEach((d, i) => tone(i === 2 ? 90 : 140, t + d, 0.16, { vol: 0.35, to: 60 })),
  tick: (t) => tone(1800, t, 0.03, { type: 'square', vol: 0.06 }),
  like: (t) => { tone(880, t, 0.08, { vol: 0.2, to: 1320 }); tone(1320, t + 0.06, 0.16, { vol: 0.18 }); },
  tap: (t) => tone(620, t, 0.07, { type: 'triangle', vol: 0.18, to: 520 }),
  key: (t) => tone(440, t, 0.06, { type: 'triangle', vol: 0.16 }),
  right: (t) => { tone(784, t, 0.14, { vol: 0.28 }); tone(1175, t + 0.09, 0.22, { vol: 0.24 }); },
  wrong: (t) => { tone(220, t, 0.18, { type: 'triangle', vol: 0.22, to: 180 }); tone(196, t + 0.12, 0.24, { type: 'triangle', vol: 0.18, to: 150 }); },
  streak: (t) => [659, 880, 1319].forEach((f, i) => tone(f, t + i * 0.07, 0.18, { vol: 0.22 })),
  win: (t) => [523, 659, 784, 1047].forEach((f, i) => tone(f, t + i * 0.1, i === 3 ? 0.5 : 0.2, { type: 'triangle', vol: 0.26 })),
  pop: (t) => tone(300, t, 0.12, { vol: 0.25, to: 900 }),
};
// Haptics where supported (Android). iOS Safari ignores vibrate; no harm.
const BUZZ = { key: 8, tap: 8, right: 18, streak: [14, 40, 14], wrong: [40, 50, 40], win: [20, 40, 20, 40, 60] };
export function sfx(name) {
  if (BUZZ[name] && navigator.vibrate) { try { navigator.vibrate(BUZZ[name]); } catch {} }
  if (!prefs.sfx || !graph() || !SFX[name]) return;
  SFX[name](ctx.currentTime + 0.01);
}
