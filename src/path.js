// Path model. Every subject is one ordered path of units.
// Unit = lessons (or videos) in order → review → unit test. Passing the test unlocks the next unit.
import { ASSESSMENT, LESSONS, PATH } from './content.js?v=12';
import { VIDEOS, HIST_PATH } from './history.js?v=12';
import { hasGen, make } from './gen.js?v=12';

export const SUBJECTS = {
  math: { name: 'Math', icon: 'ph-calculator' },
  reading: { name: 'Reading', icon: 'ph-book-open-text' },
  history: { name: 'History', icon: 'ph-scroll' },
};
export const PASS = { review: 0.7, test: 0.8 };
export const SIZE = { review: 8, test: 10, histTest: 6 };

const vid = (id) => VIDEOS.find((v) => v.id === id);

// Raw structure (no progress).
export function units(subject) {
  if (subject === 'history') {
    return HIST_PATH.map((u, i) => ({
      subject, i, name: u.unit,
      nodes: [
        ...u.videos.map((id) => ({ type: 'video', id, key: id, title: vid(id).title })),
        { type: 'test', id: `test:history:${i}`, title: 'Unit test', unit: i },
      ],
    }));
  }
  return PATH[subject].map((u, i) => ({
    subject, i, name: u.unit,
    nodes: [
      ...u.skills.map((k) => ({ type: 'lesson', id: k, key: k, title: LESSONS[k].title })),
      { type: 'review', id: `review:${subject}:${i}`, title: 'Unit review', unit: i },
      { type: 'test', id: `test:${subject}:${i}`, title: 'Unit test', unit: i },
    ],
  }));
}

// A video counts once it's watched AND its quiz is passed.
export const isDone = (node, st) => node.type === 'video' ? !!(st.watched?.[node.id] && st.checks?.[node.id]) : (st.mastery?.[node.id] || 0) >= 1;
export const starsOf = (node, st) => node.type === 'video' ? (st.watched?.[node.id] && st.checks?.[node.id] ? 3 : 0) : st.mastery?.[node.id] || 0;

// Units with progress: each node gets done / open / current; each unit gets open.
export function walk(subject, st) {
  const us = units(subject);
  let current = null;
  us.forEach((u, ui) => {
    u.open = ui === 0 || isDone(us[ui - 1].nodes.at(-1), st);
    let prevDone = true;
    u.nodes.forEach((n) => {
      n.done = isDone(n, st);
      n.stars = starsOf(n, st);
      n.open = n.done || (u.open && prevDone);
      if (!current && n.open && !n.done) { current = n; n.current = true; }
      prevDone = n.done;
    });
    u.doneCount = u.nodes.filter((n) => n.done).length;
  });
  return { units: us, current };
}

export function progress(subject, st) {
  const nodes = units(subject).flatMap((u) => u.nodes);
  return { done: nodes.filter((n) => isDone(n, st)).length, total: nodes.length };
}

// Questions for a review or unit test, spread evenly across the unit's skills.
export function questions(subject, unitIdx, kind) {
  const shuffle = (a) => [...a].sort(() => Math.random() - 0.5);
  if (subject === 'history') {
    const u = HIST_PATH[unitIdx];
    const pool = u.videos.flatMap((id) => { const v = vid(id); return [...v.quiz, v.check].map((q) => ({ ...q, skill: `hist-${id}`, grade: 6 })); });
    return shuffle(pool).slice(0, SIZE.histTest);
  }
  const skills = PATH[subject][unitIdx].skills;
  const n = SIZE[kind];
  const pools = Object.fromEntries(skills.map((k) => {
    const L = LESSONS[k];
    const extra = ASSESSMENT[subject].filter((q) => q.skill === k);
    return [k, shuffle([...(L.practice || []), ...extra])];
  }));
  const out = [];
  for (let i = 0; out.length < n && i < n * 4; i++) {
    const k = skills[i % skills.length];
    let item = null;
    if (hasGen(k)) item = make(k);
    else if (pools[k].length) item = pools[k].shift();
    if (item) out.push({ ...item, skill: k, grade: LESSONS[k].g });
  }
  return shuffle(out);
}
