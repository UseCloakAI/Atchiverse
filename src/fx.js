// Confetti burst on a fixed, pointer-less canvas. Removes itself when done.
const reduce = matchMedia('(prefers-reduced-motion: reduce)');
const COLORS = ['#ff5a36', '#ff9a7a', '#ffc2ae', '#14935a', '#f5b700', '#17161c'];

export function confetti({ x = innerWidth / 2, y = innerHeight / 3, count = 90 } = {}) {
  if (reduce.matches) return;
  const c = document.createElement('canvas');
  c.className = 'confetti';
  const dpr = Math.min(devicePixelRatio || 1, 2);
  c.width = innerWidth * dpr; c.height = innerHeight * dpr;
  document.body.appendChild(c);
  const g = c.getContext('2d'); g.scale(dpr, dpr);
  const parts = Array.from({ length: count }, () => {
    const a = Math.random() * Math.PI * 2, v = 5 + Math.random() * 9;
    return { x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 7, w: 6 + Math.random() * 6, h: 4 + Math.random() * 6,
      r: Math.random() * 6, vr: (Math.random() - 0.5) * 0.4, c: COLORS[(Math.random() * COLORS.length) | 0], life: 1 };
  });
  let last = performance.now();
  const tick = (now) => {
    const dt = Math.min(2, (now - last) / 16.7); last = now;
    g.clearRect(0, 0, innerWidth, innerHeight);
    let alive = 0;
    for (const p of parts) {
      p.vy += 0.35 * dt; p.vx *= 0.985; p.x += p.vx * dt; p.y += p.vy * dt; p.r += p.vr * dt; p.life -= 0.009 * dt;
      if (p.life <= 0 || p.y > innerHeight + 20) continue;
      alive++;
      g.save(); g.globalAlpha = Math.min(1, p.life * 2); g.translate(p.x, p.y); g.rotate(p.r);
      g.fillStyle = p.c; g.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); g.restore();
    }
    if (alive) requestAnimationFrame(tick); else c.remove();
  };
  requestAnimationFrame(tick);
}

export function confettiFrom(el, count) {
  const r = el.getBoundingClientRect();
  confetti({ x: r.left + r.width / 2, y: r.top + r.height / 2, count });
}
