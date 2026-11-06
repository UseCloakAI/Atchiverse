// Supabase via RPC only (tables are RLS-locked). Publishable key is safe to ship.
const URL = 'https://flsjetuwysxzrlscigww.supabase.co/rest/v1/rpc/';
const KEY = 'sb_publishable_yKo5dZtVUEOiwBzjsDuj3w_SEqz9JTo';
const TOKEN_KEY = 'atchiverse:token';

const get = (k) => { try { return localStorage.getItem(k); } catch { return null; } };
const set = (k, v) => { try { v == null ? localStorage.removeItem(k) : localStorage.setItem(k, v); } catch {} };

async function rpc(fn, body) {
  const r = await fetch(URL + fn, {
    method: 'POST',
    headers: { apikey: KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!r.ok) throw Object.assign(new Error(`${fn} ${r.status}`), { status: r.status });
  const t = await r.text();
  return t ? JSON.parse(t) : null;
}

export const token = () => get(TOKEN_KEY);
export const logout = () => set(TOKEN_KEY, null);

export async function login(pin) {
  const res = await rpc('pin_login', { p_pin: pin });
  if (!res) return null;
  set(TOKEN_KEY, res.token);
  return res;
}

export async function load() {
  try { return await rpc('load_progress', { p_token: token() }); }
  catch (e) { if (e.status === 400) logout(); return null; }
}

export async function overview() {
  return rpc('parent_overview', { p_token: token() });
}

let saveTimer;
export function save(progress) {
  if (!token()) return;
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => rpc('save_progress', { p_token: token(), p_progress: progress }).catch(() => {}), 800);
}

export function logAnswer(a) {
  if (!token()) return;
  rpc('log_answer', {
    p_token: token(), p_kind: a.kind, p_subject: a.subject, p_skill: a.skill, p_grade: a.grade,
    p_question: a.question, p_answer: a.answer, p_correct: a.correct,
  }).catch(() => {});
}
