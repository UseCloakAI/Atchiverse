// Math question generators. Fresh numbers every time, so practice can't be memorized.
// Each returns { q, a, choices, hint } — hint shows the strategy after a miss.
const R = (lo, hi) => lo + Math.floor(Math.random() * (hi - lo + 1));
const pickN = (arr, n) => [...arr].sort(() => Math.random() - 0.5).slice(0, n);

// Distractors that look like real mistakes: off by one or two, wrong place.
function choices(a, extra = []) {
  const pool = new Set([a - 1, a + 1, a - 2, a + 2, ...extra].filter((x) => x >= 0 && x !== a));
  return [String(a), ...pickN([...pool], 3).map(String)];
}

export const GEN = {
  'make-10': () => {
    const n = R(1, 9), a = 10 - n;
    return { q: `${n} + ? = 10`, a: String(a), choices: choices(a), hint: `${n} and ${a} are partners. Together they make 10.` };
  },
  doubles: () => {
    const n = R(3, 9);
    if (Math.random() < 0.4) return { q: `${n} + ${n} = ?`, a: String(2 * n), choices: choices(2 * n), hint: `Double ${n} is ${2 * n}.` };
    const [x, y] = Math.random() < 0.5 ? [n, n + 1] : [n + 1, n];
    return { q: `${x} + ${y} = ?`, a: String(2 * n + 1), choices: choices(2 * n + 1), hint: `${n} + ${n} = ${2 * n}. One more is ${2 * n + 1}.` };
  },
  'add-20': () => {
    const x = R(5, 9), y = R(11 - x, 9), need = 10 - x;
    return { q: `${x} + ${y} = ?`, a: String(x + y), choices: choices(x + y),
      hint: `Make a 10: ${x} + ${need} = 10. ${y} − ${need} = ${y - need} left. 10 + ${y - need} = ${x + y}.` };
  },
  'sub-20': () => {
    const t = R(11, 18), b = R(t - 9, 9);
    return { q: `${t} − ${b} = ?`, a: String(t - b), choices: choices(t - b),
      hint: `Count up from ${b}: to 10 is ${10 - b}, then to ${t} is ${t - 10} more. ${10 - b} + ${t - 10} = ${t - b}.` };
  },
  'fact-families': () => {
    const x = R(4, 9), y = R(4, 9), c = x + y;
    return { q: `${x} + ${y} = ${c}. So ${c} − ${x} = ?`, a: String(y), choices: choices(y, [c, x]),
      hint: `Same family: ${x}, ${y}, ${c}. Take ${x} away from ${c} and ${y} is left.` };
  },
  'place-value': () => {
    const ds = pickN([1, 2, 3, 4, 5, 6, 7, 8, 9], 3), n = ds[0] * 100 + ds[1] * 10 + ds[2];
    const pos = R(0, 2), d = ds[pos], val = d * [100, 10, 1][pos];
    const name = ['hundreds', 'tens', 'ones'][pos];
    return { q: `In ${n}, what is the ${d} worth?`, a: String(val),
      choices: [...new Set([val, d, d * 10, d * 100, d * 1000])].slice(0, 4).map(String),
      hint: `The ${d} sits in the ${name} spot, so it's worth ${val}.` };
  },
  'add-regroup': () => {
    let x, y;
    do { x = R(15, 68); y = R(14, 29); } while ((x % 10) + (y % 10) < 10 || x + y > 99);
    const ones = (x % 10) + (y % 10);
    return { q: `${x} + ${y} = ?`, a: String(x + y), choices: choices(x + y, [x + y - 10, x + y + 10]),
      hint: `Ones: ${x % 10} + ${y % 10} = ${ones}. Write ${ones % 10}, carry 1. Tens: ${Math.floor(x / 10)} + ${Math.floor(y / 10)} + 1 = ${Math.floor((x + y) / 10)}.` };
  },
  'sub-regroup': () => {
    let x, y;
    do { x = R(31, 94); y = R(12, x - 10); } while ((x % 10) >= (y % 10));
    return { q: `${x} − ${y} = ?`, a: String(x - y), choices: choices(x - y, [x - y + 10, x - y - 10]),
      hint: `Can't take ${y % 10} from ${x % 10}. Borrow a ten: ${(x % 10) + 10} − ${y % 10} = ${(x % 10) + 10 - (y % 10)}. Tens: ${Math.floor(x / 10) - 1} − ${Math.floor(y / 10)} = ${Math.floor(x / 10) - 1 - Math.floor(y / 10)}.` };
  },
  'mult-easy': () => mult([2, 5, 10]),
  'mult-mid': () => mult([3, 4]),
  'mult-hard': () => mult([6, 7, 8, 9]),
  'div-facts': () => {
    const f = R(2, 9), n = R(2, 9), p = f * n;
    return { q: `${p} ÷ ${f} = ?`, a: String(n), choices: choices(n, [f]),
      hint: `Flip it: ${f} × ? = ${p}. ${f} × ${n} = ${p}, so the answer is ${n}.` };
  },
};

function mult(fs) {
  const f = fs[R(0, fs.length - 1)], n = R(2, 10), p = f * n;
  const [x, y] = Math.random() < 0.5 ? [f, n] : [n, f];
  const skip = Array.from({ length: n }, (_, i) => f * (i + 1)).join(', ');
  const hint = n <= 6 ? `Skip count by ${f}: ${skip}.` : `${f} × 5 = ${f * 5}, plus ${f} × ${n - 5} = ${f * (n - 5)}. Total ${p}.`;
  return { q: `${x} × ${y} = ?`, a: String(p), choices: choices(p, [p + f, p - f, x + y]), hint };
}

export const hasGen = (skill) => !!GEN[skill];
export const make = (skill) => GEN[skill]();
