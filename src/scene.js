// Illustrated scenes for the history videos. Portrait 360x640 SVG, layered:
// sky → far landscape → landmarks → characters. Animation is CSS (classes a-*), see style.css.
let uid = 0;
const id = (p) => `${p}${++uid}`;
const H = 380; // horizon
const FEET = 470; // where characters stand

// ── Sky, land, water ──────────────────────────────────────────────────
function sky(top, bottom, { sun = '#ffd27a', sx = 268, sy = 120, stars = false } = {}) {
  const g = id('sky'), glow = id('glow');
  return `<defs>
    <linearGradient id="${g}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${top}"/><stop offset="1" stop-color="${bottom}"/></linearGradient>
    <radialGradient id="${glow}"><stop offset="0" stop-color="${sun || '#fff'}" stop-opacity=".55"/><stop offset="1" stop-color="${sun || '#fff'}" stop-opacity="0"/></radialGradient>
  </defs>
  <rect width="360" height="640" fill="url(#${g})"/>
  ${stars ? Array.from({ length: 26 }, (_, i) => `<circle class="a-twinkle" style="animation-delay:${(i % 7) * 0.4}s" cx="${(i * 137) % 360}" cy="${(i * 71) % 300}" r="${1 + (i % 3) * 0.6}" fill="#fff"/>`).join('') : ''}
  ${sun ? `<circle class="a-pulse" cx="${sx}" cy="${sy}" r="90" fill="url(#${glow})"/><circle cx="${sx}" cy="${sy}" r="34" fill="${sun}"/>` : ''}`;
}
const clouds = (c = '#fff', o = 0.8) => [[40, 70, 1], [230, 50, 0.8], [140, 150, 0.6]].map(([x, y, s], i) =>
  `<g class="a-drift" style="animation-delay:${-i * 6}s" opacity="${o}"><g transform="translate(${x} ${y}) scale(${s})">
    <ellipse cx="0" cy="0" rx="34" ry="14" fill="${c}"/><ellipse cx="20" cy="-8" rx="22" ry="16" fill="${c}"/><ellipse cx="-16" cy="-4" rx="18" ry="12" fill="${c}"/></g></g>`).join('');
const hills = (c, y = H, amp = 40) => `<path d="M0 ${y} C60 ${y - amp} 110 ${y - amp * 0.4} 170 ${y - amp * 0.8} S290 ${y - amp * 1.2} 360 ${y - amp * 0.5} V640 H0Z" fill="${c}"/>`;
const peaks = (c, y = H, snow) => `<path d="M-10 ${y} L50 ${y - 110} L95 ${y - 60} L150 ${y - 150} L215 ${y - 70} L270 ${y - 125} L370 ${y} Z" fill="${c}"/>${snow ? `<path d="M135 ${y - 128} L150 ${y - 150} L166 ${y - 126} L157 ${y - 120} L150 ${y - 128} L142 ${y - 119}Z M258 ${y - 108} L270 ${y - 125} L283 ${y - 106} L270 ${y - 102}Z" fill="#fff"/>` : ''}`;
const dunes = (c, c2) => `<path d="M0 ${H - 20} Q90 ${H - 60} 180 ${H - 25} T360 ${H - 35} V640 H0Z" fill="${c2}"/><path d="M0 ${H} Q120 ${H - 30} 220 ${H + 5} T360 ${H - 5} V640 H0Z" fill="${c}"/>`;
const ground = (c, y = H) => `<rect y="${y}" width="360" height="${640 - y}" fill="${c}"/>`;
const river = (c, y = 420, h = 46) => `<rect y="${y}" width="360" height="${h}" fill="${c}"/>
  <g class="a-flow" stroke="#fff" stroke-opacity=".45" stroke-width="2" stroke-linecap="round" stroke-dasharray="14 22">
    <line x1="0" y1="${y + h * 0.3}" x2="360" y2="${y + h * 0.3}"/><line x1="0" y1="${y + h * 0.7}" x2="360" y2="${y + h * 0.7}" style="animation-direction:reverse"/></g>`;

// ── Landmarks ─────────────────────────────────────────────────────────
const pop = (d = 0) => `class="a-pop" style="animation-delay:${d}s"`;
const pyramid = (x, y, s, c = '#e2b766', d = 0) => `<g ${pop(d)}><g transform="translate(${x} ${y}) scale(${s})">
  <path d="M-80 0 L0 -100 L80 0Z" fill="${c}"/><path d="M0 -100 L80 0 L20 0Z" fill="#000" opacity=".18"/>
  ${[20, 40, 60, 80].map((v) => `<line x1="${-80 + v * 0.8}" y1="${-v}" x2="${80 - v * 0.8}" y2="${-v}" stroke="#000" stroke-opacity=".08"/>`).join('')}</g></g>`;
const kushPyr = (x, y, s, d = 0) => `<g ${pop(d)}><g transform="translate(${x} ${y}) scale(${s})"><path d="M-26 0 L0 -90 L26 0Z" fill="#b5652f"/><path d="M0 -90 L26 0 L8 0Z" fill="#000" opacity=".2"/><rect x="-34" y="-22" width="18" height="22" fill="#a65a29"/></g></g>`;
const ziggurat = (x, y, s, d = 0) => `<g ${pop(d)}><g transform="translate(${x} ${y}) scale(${s})">
  <rect x="-90" y="-40" width="180" height="40" fill="#c9955a"/><rect x="-65" y="-75" width="130" height="35" fill="#d6a468"/>
  <rect x="-42" y="-105" width="84" height="30" fill="#e0b177"/><rect x="-18" y="-128" width="36" height="23" fill="#f1c88d"/>
  <rect x="-8" y="-105" width="16" height="105" fill="#b07f48"/>${[0, 1, 2, 3, 4, 5, 6].map((i) => `<line x1="-8" x2="8" y1="${-i * 15}" y2="${-i * 15}" stroke="#8a6236"/>`).join('')}</g></g>`;
const hut = (x, y, s, d = 0, roof = '#b9873f') => `<g ${pop(d)}><g transform="translate(${x} ${y}) scale(${s})">
  <rect x="-24" y="-30" width="48" height="30" rx="4" fill="#c99a62"/><path d="M-32 -28 L0 -60 L32 -28Z" fill="${roof}"/><rect x="-7" y="-18" width="14" height="18" rx="7" fill="#5c3d22"/></g></g>`;
const mudHouse = (x, y, w, h, c = '#d3a971', d = 0) => `<g ${pop(d)}><rect x="${x}" y="${y - h}" width="${w}" height="${h}" fill="${c}"/><rect x="${x + w / 2 - 5}" y="${y - 14}" width="10" height="14" fill="#6b4a2b"/><rect x="${x}" y="${y - h}" width="${w}" height="4" fill="#000" opacity=".1"/></g>`;
const palm = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><g class="a-sway">
  <path d="M0 0 Q-6 -50 4 -100" stroke="#8a5a2b" stroke-width="8" fill="none"/>
  ${[-60, -25, 15, 50, 85].map((a) => `<path d="M4 -100 q${30 * Math.cos(a * Math.PI / 180)} ${-14 + 30 * Math.sin(a * Math.PI / 180)} ${52 * Math.cos(a * Math.PI / 180)} ${10 + 40 * Math.sin(a * Math.PI / 180)}" stroke="#2f8a4a" stroke-width="9" fill="none" stroke-linecap="round"/>`).join('')}</g></g>`;
const acacia = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 0 L2 -50 M2 -45 L-20 -70 M2 -45 L22 -72" stroke="#5a3b1f" stroke-width="6" fill="none"/><ellipse cx="0" cy="-78" rx="56" ry="14" fill="#5f7d2c"/></g>`;
const bodhi = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-6 0 Q0 -60 -4 -90 M4 0 Q8 -50 14 -90" stroke="#6b4426" stroke-width="12" fill="none"/>
  <g class="a-sway">${[[-50, -120, 50], [10, -150, 60], [55, -110, 45], [-10, -100, 55]].map(([cx, cy, r]) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#3f8a3a" opacity=".92"/>`).join('')}</g></g>`;
const wheat = (x, y, n = 8, gap = 12) => `<g class="a-sway">${Array.from({ length: n }, (_, i) => `<g transform="translate(${x + i * gap} ${y})"><line y2="-40" stroke="#c9a227" stroke-width="2"/><ellipse cy="-46" rx="4" ry="10" fill="#e6c14a"/></g>`).join('')}</g>`;
const fire = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-18 0 L18 -6 M-18 -6 L18 0" stroke="#6b3e1f" stroke-width="6"/>
  <g class="a-flicker"><path d="M0 -6 C-16 -20 -6 -40 0 -54 C6 -40 18 -24 0 -6Z" fill="#ff7a1a"/><path d="M0 -8 C-8 -18 -3 -30 0 -36 C4 -28 9 -18 0 -8Z" fill="#ffd34d"/></g></g>`;
const mammoth = (x, y, s = 1, d = 0) => `<g transform="translate(${x} ${y}) scale(${s})"><g class="a-walk-slow" style="animation-delay:${d}s">
  <ellipse cx="0" cy="-48" rx="48" ry="36" fill="#6b4a33"/><circle cx="40" cy="-62" r="24" fill="#6b4a33"/>
  <path d="M58 -50 Q70 -20 58 0" stroke="#6b4a33" stroke-width="10" fill="none" stroke-linecap="round"/>
  <path d="M50 -44 Q80 -40 82 -62" stroke="#f3ead6" stroke-width="6" fill="none" stroke-linecap="round"/>
  ${[-30, -10, 14, 30].map((lx) => `<rect x="${lx - 7}" y="-22" width="14" height="22" rx="5" fill="#5a3d2a"/>`).join('')}<circle cx="46" cy="-68" r="3" fill="#1f0d08"/></g></g>`;
const goat = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><g class="a-bob"><ellipse cx="0" cy="-20" rx="18" ry="11" fill="#f1ece2"/><circle cx="18" cy="-30" r="8" fill="#f1ece2"/><path d="M17 -37 q4 -8 10 -6" stroke="#8a7a6a" stroke-width="2" fill="none"/>${[-10, -2, 6, 12].map((l) => `<rect x="${l}" y="-12" width="3" height="12" fill="#8a7a6a"/>`).join('')}<circle cx="21" cy="-31" r="1.6" fill="#222"/></g></g>`;
const boat = (x, y, s = 1, sail = '#f4efe2') => `<g transform="translate(${x} ${y}) scale(${s})"><g class="a-boat"><path d="M-40 -6 Q0 12 40 -6 L34 -14 L-34 -14Z" fill="#8a5a2b"/><line x1="0" y1="-14" x2="0" y2="-70" stroke="#5a3b1f" stroke-width="3"/><path d="M2 -68 L34 -20 L2 -20Z" fill="${sail}"/></g></g>`;
const temple = (x, y, s = 1, d = 0) => `<g ${pop(d)}><g transform="translate(${x} ${y}) scale(${s})">
  <rect x="-80" y="-12" width="160" height="12" fill="#e9e3d6"/><rect x="-72" y="-20" width="144" height="8" fill="#f4f0e7"/>
  ${Array.from({ length: 7 }, (_, i) => `<rect x="${-66 + i * 21}" y="-84" width="11" height="64" fill="#f7f3ea"/><rect x="${-68 + i * 21}" y="-88" width="15" height="5" fill="#e9e3d6"/>`).join('')}
  <rect x="-76" y="-98" width="152" height="10" fill="#efe9dc"/><path d="M-80 -98 L0 -128 L80 -98Z" fill="#f7f3ea"/><path d="M-60 -101 L0 -122 L60 -101Z" fill="#e2dccd"/></g></g>`;
const arches = (x, y, s = 1, n = 5, rows = 3, c = '#d7b98a', d = 0) => `<g ${pop(d)}><g transform="translate(${x} ${y}) scale(${s})">
  ${Array.from({ length: rows }, (_, r) => `<rect x="${-n * 18}" y="${-(r + 1) * 40}" width="${n * 36}" height="40" fill="${c}"/>${Array.from({ length: n }, (_, i) => `<path d="M${-n * 18 + 8 + i * 36} ${-r * 40} v-22 a10 10 0 0 1 20 0 v22Z" fill="#000" opacity=".28"/>`).join('')}`).join('')}</g></g>`;
const stupa = (x, y, s = 1, d = 0) => `<g ${pop(d)}><g transform="translate(${x} ${y}) scale(${s})"><rect x="-70" y="-14" width="140" height="14" fill="#d9c7a3"/><path d="M-60 -14 A60 56 0 0 1 60 -14Z" fill="#f1e6cc"/><rect x="-10" y="-88" width="20" height="16" fill="#d9c7a3"/><line x1="0" y1="-88" x2="0" y2="-120" stroke="#b08a4a" stroke-width="3"/>${[-104, -112, -118].map((cy, i) => `<ellipse cx="0" cy="${cy}" rx="${10 - i * 3}" ry="2.5" fill="#c9a227"/>`).join('')}</g></g>`;
const brickCity = (y) => `<g>${[[10, 70, 44], [86, 60, 56], [150, 76, 40], [232, 64, 50], [300, 56, 46]].map(([x, w, h], i) => mudHouse(x, y, w, h, i % 2 ? '#b8683f' : '#c97b4c', i * 0.08)).join('')}
  <rect x="0" y="${y}" width="360" height="6" fill="#7a3f22"/><rect x="0" y="${y + 6}" width="360" height="5" fill="#3b6ea5" opacity=".6"/></g>`;
const cnRoof = (x, y, s = 1, d = 0) => `<g ${pop(d)}><g transform="translate(${x} ${y}) scale(${s})"><rect x="-60" y="-50" width="120" height="50" fill="#b3261e"/>
  ${[-40, -15, 10, 35].map((cx) => `<rect x="${cx}" y="-50" width="6" height="50" fill="#7a1912"/>`).join('')}
  <path d="M-90 -50 Q-60 -62 -50 -80 L50 -80 Q60 -62 90 -50 Q60 -56 0 -56 Q-60 -56 -90 -50Z" fill="#2d3a2e"/><path d="M-50 -80 Q0 -100 50 -80Z" fill="#3b4a3c"/><rect x="-80" y="-4" width="160" height="6" fill="#d9c7a3"/></g></g>`;
const greatWall = () => `<path d="M-10 330 L40 300 L90 318 L140 270 L190 296 L240 250 L290 280 L370 240" stroke="#a89878" stroke-width="16" fill="none" stroke-linejoin="round"/>
  <path d="M-10 322 L40 292 L90 310 L140 262 L190 288 L240 242 L290 272 L370 232" stroke="#c9b994" stroke-width="5" fill="none" stroke-dasharray="6 5"/>
  ${[[40, 300], [140, 270], [240, 250]].map(([x, y], i) => `<g ${pop(0.2 + i * 0.15)}><rect x="${x - 12}" y="${y - 30}" width="24" height="30" fill="#b3a382"/><rect x="${x - 14}" y="${y - 34}" width="28" height="6" fill="#9a8a68"/></g>`).join('')}`;
const terracotta = (y) => Array.from({ length: 7 }, (_, i) => `<g ${pop(i * 0.06)}><g transform="translate(${30 + i * 50} ${y}) scale(.55)"><rect x="-12" y="-36" width="24" height="36" rx="4" fill="#a8744a"/><path d="M-20 -36 L-16 -86 L16 -86 L20 -36Z" fill="#b98457"/><circle cy="-104" r="18" fill="#b98457"/><rect x="-10" y="-130" width="20" height="10" rx="5" fill="#8a5d39"/></g></g>`).join('');
const tablet = (x, y, s = 1, d = 0) => `<g ${pop(d)}><g transform="translate(${x} ${y}) scale(${s})"><rect x="-60" y="-80" width="120" height="150" rx="16" fill="#c99a62"/><rect x="-60" y="-80" width="120" height="150" rx="16" fill="none" stroke="#a87a45" stroke-width="4"/>
  ${Array.from({ length: 8 }, (_, r) => Array.from({ length: 5 }, (_, c) => `<path class="a-write" style="animation-delay:${(r * 5 + c) * 0.05}s" d="M${-44 + c * 20} ${-60 + r * 16} l8 3 l-8 3 z M${-38 + c * 20} ${-57 + r * 16} h8" stroke="#6b4a2b" stroke-width="2" fill="#6b4a2b"/>`).join('')).join('')}</g></g>`;
const stele = (x, y, s = 1, d = 0) => `<g ${pop(d)}><g transform="translate(${x} ${y}) scale(${s})"><path d="M-50 0 V-170 Q0 -210 50 -170 V0Z" fill="#3a3a44"/><path d="M-50 0 V-170 Q0 -210 50 -170 V0Z" fill="none" stroke="#5a5a68" stroke-width="3"/>
  <circle cx="0" cy="-160" r="18" fill="#4c4c58"/>${Array.from({ length: 9 }, (_, i) => `<line x1="-36" x2="36" y1="${-120 + i * 13}" y2="${-120 + i * 13}" stroke="#8a8a9a" stroke-width="2" stroke-dasharray="4 3"/>`).join('')}</g></g>`;
const papyrus = (x, y, s = 1, d = 0) => `<g ${pop(d)}><g transform="translate(${x} ${y}) scale(${s})"><rect x="-70" y="-60" width="140" height="110" fill="#efdcaa"/><rect x="-78" y="-64" width="12" height="118" rx="6" fill="#d9c08a"/><rect x="66" y="-64" width="12" height="118" rx="6" fill="#d9c08a"/>
  ${['M-50 -40 a8 8 0 1 0 0.1 0', 'M-20 -48 v16 h12', 'M8 -46 l10 14 l10 -14', 'M40 -48 q6 10 0 16', 'M-50 -6 h20', 'M-14 -14 a6 6 0 1 1 0.1 0 v14', 'M14 -12 l8 -8 l8 8 l-8 8z', 'M44 -14 v16', 'M-44 26 q10 -14 20 0', 'M-8 18 h16 v12', 'M26 18 a6 6 0 1 0 12 0']
    .map((dd, i) => `<path class="a-write" style="animation-delay:${i * 0.08}s" d="${dd}" stroke="#3a6ea5" stroke-width="3" fill="none" stroke-linecap="round"/>`).join('')}</g></g>`;
const caveArt = () => `<rect width="360" height="640" fill="#2a1c14"/><path d="M0 0 H360 V300 Q300 250 260 300 Q180 220 100 300 Q50 260 0 300Z" fill="#4a3324"/>
  <g opacity=".85">${[[70, 150], [210, 120]].map(([x, y], i) => `<g ${pop(0.3 + i * 0.3)}><g transform="translate(${x} ${y})"><ellipse rx="32" ry="16" fill="#b5532a"/><circle cx="30" cy="-10" r="10" fill="#b5532a"/>${[-20, -6, 8, 20].map((l) => `<rect x="${l}" y="10" width="4" height="18" fill="#b5532a"/>`).join('')}<path d="M34 -18 q10 -14 2 -24 M28 -18 q-2 -16 -10 -20" stroke="#b5532a" stroke-width="3" fill="none"/></g></g>`).join('')}
  ${[[150, 220], [290, 200]].map(([x, y], i) => `<g ${pop(0.9 + i * 0.2)}><g transform="translate(${x} ${y}) rotate(${i ? 12 : -10})" fill="#e3c08a" opacity=".8"><ellipse rx="10" ry="13"/>${[-12, -5, 2, 9].map((fx, j) => `<rect x="${fx - 2}" y="${-28 + (j % 2) * 4}" width="5" height="16" rx="2.5"/>`).join('')}<rect x="10" y="-6" width="12" height="5" rx="2.5" transform="rotate(-30 10 -6)"/></g></g>`).join('')}</g>`;

// Stylized maps (not to scale). Land, water, labels, a pulsing pin.
function map(kind) {
  const sea = '#7fb6d9', land = '#e8d6a8', land2 = '#d9c48d';
  const label = (x, y, t, s = 15, c = '#3a2a14') => `<text x="${x}" y="${y}" font-size="${s}" font-weight="800" fill="${c}" text-anchor="middle" font-family="inherit" class="a-pop" style="animation-delay:.5s">${t}</text>`;
  const pin = (x, y) => `<circle class="a-ping" cx="${x}" cy="${y}" r="10" fill="#ff5a36"/><circle cx="${x}" cy="${y}" r="6" fill="#ff5a36" stroke="#fff" stroke-width="2"/>`;
  const riv = (d, w = 5) => `<path class="a-draw" d="${d}" stroke="#3b82c4" stroke-width="${w}" fill="none" stroke-linecap="round"/>`;
  const base = `<rect width="360" height="640" fill="${sea}"/><g opacity=".25" stroke="#fff">${Array.from({ length: 12 }, (_, i) => `<line x1="0" x2="360" y1="${i * 55}" y2="${i * 55}"/>`).join('')}</g>`;
  const M = {
    world: `<path d="M150 210 Q190 190 215 230 Q230 300 200 360 Q180 410 160 360 Q140 300 130 250Z" fill="${land}"/>
      <path d="M200 120 Q280 90 340 140 Q350 200 300 210 Q240 200 215 175Z" fill="${land2}"/><path d="M20 120 Q70 100 90 160 Q80 230 60 280 Q40 230 30 180Z" fill="${land2}"/>
      ${riv('M175 290 Q200 220 240 170', 3).replace('#3b82c4', '#ff5a36').replace('stroke-linecap', 'stroke-dasharray="8 7" stroke-linecap')}
      ${riv('M240 165 Q290 150 320 170', 3).replace('#3b82c4', '#ff5a36').replace('stroke-linecap', 'stroke-dasharray="8 7" stroke-linecap')}
      ${riv('M215 175 Q140 120 70 150', 3).replace('#3b82c4', '#ff5a36').replace('stroke-linecap', 'stroke-dasharray="8 7" stroke-linecap')}
      ${pin(175, 290)}${label(175, 330, 'AFRICA')}${label(290, 120, 'ASIA')}${label(55, 100, 'AMERICAS', 13)}`,
    fertile: `<path d="M0 120 H360 V520 H0Z" fill="${land}"/><path d="M0 120 H120 Q100 200 0 230Z" fill="${sea}"/>
      <path class="a-draw" d="M90 330 Q120 200 200 170 Q280 160 320 260" stroke="#7fbf5a" stroke-width="44" fill="none" stroke-linecap="round" opacity=".75"/>
      ${riv('M210 160 Q240 260 280 380')}${riv('M180 175 Q200 280 262 384', 4)}
      ${label(200, 140, 'FERTILE CRESCENT', 14)}${label(300, 330, 'Tigris', 13, '#1f4f80')}${label(205, 320, 'Euphrates', 13, '#1f4f80')}${pin(250, 330)}${label(250, 420, 'MESOPOTAMIA', 15)}`,
    nile: `<path d="M40 60 H320 V600 H40Z" fill="#e9c98a"/><path d="M40 60 H320 V110 H40Z" fill="${sea}"/>
      <path d="M150 110 L180 160 L210 110Z" fill="#8cc06a"/>${riv('M180 600 Q170 480 190 380 Q200 260 180 160', 7)}
      <path d="M180 600 Q170 480 190 380 Q200 260 180 160" stroke="#8cc06a" stroke-width="26" fill="none" opacity=".5"/>
      ${label(260, 200, 'Lower Egypt', 13)}${label(260, 360, 'Upper Egypt', 13)}${label(260, 520, 'KUSH', 16, '#8a3a12')}${label(110, 90, 'Mediterranean Sea', 12, '#1f4f80')}${pin(180, 200)}`,
    india: `<path d="M60 120 H320 V200 Q300 260 250 330 Q205 420 180 470 Q150 400 120 330 Q80 260 60 200Z" fill="${land}"/>
      <path d="M60 110 Q190 70 320 110 V140 Q190 100 60 140Z" fill="#cfd8e0"/>${riv('M110 140 Q100 220 90 250', 5)}${riv('M180 150 Q240 200 300 230', 5)}
      ${label(95, 280, 'Indus', 13, '#1f4f80')}${label(255, 260, 'Ganges', 13, '#1f4f80')}${label(190, 100, 'Himalayas', 13, '#4a5560')}${pin(100, 210)}`,
    china: `<path d="M40 100 H340 V520 H40Z" fill="${land}"/><path d="M290 100 H360 V520 H300 Q270 400 300 300 Q280 200 290 100Z" fill="${sea}"/>
      ${riv('M60 220 Q140 160 190 230 Q240 280 290 220', 7).replace('#3b82c4', '#c9a227')}${riv('M60 380 Q160 330 220 400 Q260 430 300 400', 6)}
      ${label(170, 190, 'Huang He', 13, '#7a5a10')}${label(170, 300, '(Yellow River)', 11, '#7a5a10')}${label(170, 450, 'Yangtze', 13, '#1f4f80')}${pin(180, 225)}`,
    greece: `<path d="M120 140 Q200 120 230 180 Q200 230 230 280 Q210 320 180 300 Q170 360 140 340 Q120 280 140 240 Q100 200 120 140Z" fill="${land}"/>
      ${[[270, 260, 14], [250, 340, 10], [300, 320, 9], [200, 420, 26]].map(([x, y, r]) => `<ellipse cx="${x}" cy="${y}" rx="${r * 1.4}" ry="${r * 0.7}" fill="${land}"/>`).join('')}
      <path d="M140 170 l10 -18 l10 18 M170 200 l10 -18 l10 18 M150 250 l8 -14 l8 14" stroke="#8a7a50" stroke-width="3" fill="none"/>
      ${pin(205, 255)}${label(225, 240, 'Athens', 13)}${pin(160, 310)}${label(140, 330, 'Sparta', 13)}${label(180, 470, 'Mediterranean Sea', 12, '#1f4f80')}`,
    rome: `<ellipse cx="180" cy="340" rx="170" ry="120" fill="#c5e0b4"/><ellipse cx="180" cy="340" rx="120" ry="64" fill="${sea}"/>
      <path d="M150 240 Q170 260 175 290 Q190 320 205 340 L198 348 Q178 330 165 300 Q150 280 140 250Z" fill="#c5e0b4"/>
      ${pin(165, 285)}${label(140, 280, 'Rome', 13)}${label(180, 350, 'Mediterranean', 12, '#1f4f80')}${label(180, 200, 'ROMAN EMPIRE', 15, '#5a2a6e')}`,
    silk: `<path d="M0 140 H360 V500 H0Z" fill="${land}"/>${riv('M330 300 Q260 250 200 290 Q140 330 80 280 Q40 250 20 270', 4).replace('#3b82c4', '#b3261e').replace('stroke-linecap', 'stroke-dasharray="10 8" stroke-linecap')}
      ${pin(330, 300)}${label(320, 340, 'China', 13)}${pin(20, 270)}${label(40, 240, 'Rome', 13)}${label(180, 200, 'SILK ROAD', 16, '#b3261e')}`,
  };
  return base + M[kind];
}

// Named sets. Each is a full background for one or more beats.
const SETS = {
  savanna: () => sky('#ffb36b', '#ffe3b0', { sy: 150 }) + clouds('#fff3e0', 0.6) + hills('#d9a55a', H, 30) + ground('#c98f45') + acacia(60, H + 4, 1.1) + acacia(300, H, 0.8) + mammoth(230, H + 6, 0.55),
  ice: () => sky('#9cc4e4', '#e9f3fb', { sun: '#fff7d6', sy: 110 }) + peaks('#c9d9e6', H, true) + ground('#eef5fa') + mammoth(110, H + 8, 0.7) + mammoth(250, H + 2, 0.45, 1),
  cave: () => caveArt() + ground('#3a281c', 400) + fire(180, 455, 1.4),
  'map-world': () => map('world'),
  fields: () => sky('#8ec9f0', '#e3f4ff') + clouds() + hills('#9cc56a', H, 26) + ground('#b6d47a') + wheat(10, 445, 12, 11) + wheat(210, 440, 13, 11) + hut(250, H + 4, 0.9, 0.2) + hut(310, H, 0.7, 0.35) + goat(70, H + 10, 0.9),
  village: () => sky('#ffc98b', '#fff1d6', { sy: 150 }) + hills('#a9c46b', H, 24) + ground('#c6b07a') + hut(60, H + 6, 1, 0) + hut(160, H - 4, 0.8, 0.12) + hut(270, H + 4, 1.1, 0.24) + `<g class="a-smoke" opacity=".5"><circle cx="160" cy="300" r="8" fill="#fff"/><circle cx="166" cy="280" r="11" fill="#fff"/></g>` + goat(220, H + 30, 0.8),
  'map-fertile': () => map('fertile'),
  rivers: () => sky('#9fd3f2', '#eaf7ff') + clouds() + ground('#d8c08a') + river('#4f9fd6', H + 4, 40) + `<path d="M0 ${H + 60} H360" stroke="#4f9fd6" stroke-width="6"/><path d="M120 ${H + 44} V${H + 110}" stroke="#4f9fd6" stroke-width="6"/>` + wheat(140, H + 110, 10, 12) + palm(40, H + 2, 0.9) + palm(320, H + 2, 0.8) + boat(220, H + 26, 0.6, '#e9dfc8'),
  ziggurat: () => sky('#ffcf8a', '#fff1d8', { sy: 110, sx: 90 }) + ground('#d8b77e') + ziggurat(180, H + 6, 1.1) + mudHouse(10, H + 20, 50, 34) + mudHouse(300, H + 24, 54, 40, '#cfa066') + palm(70, H + 10, 0.7),
  scribe: () => `<rect width="360" height="640" fill="#4a3424"/><rect y="400" width="360" height="240" fill="#6b4a32"/>` + Array.from({ length: 3 }, (_, r) => `<rect x="20" y="${110 + r * 80}" width="320" height="8" fill="#8a6440"/>${Array.from({ length: 9 }, (_, i) => `<rect x="${28 + i * 35}" y="${76 + r * 80}" width="26" height="34" rx="5" fill="#c99a62"/>`).join('')}`).join('') + `<rect x="0" y="0" width="360" height="640" fill="#000" opacity=".25"/>` + tablet(260, 330, 0.7, 0.2),
  stele: () => sky('#ffd79a', '#fff2dc', { sx: 70, sy: 100 }) + ground('#d8b77e') + mudHouse(0, H, 70, 50) + mudHouse(290, H, 70, 46, '#cfa066') + stele(180, H + 10, 1.2, 0.1),
  'map-nile': () => map('nile'),
  nile: () => sky('#ffb36b', '#ffe9c4', { sy: 140 }) + dunes('#e8c47c', '#d9ad62') + `<rect y="${H + 10}" width="360" height="50" fill="#5d9e48"/>` + river('#3f8fcf', H + 40, 44) + `<rect y="${H + 84}" width="360" height="200" fill="#4f8f3c"/>` + palm(50, H + 18, 0.8) + palm(310, H + 16, 0.9) + boat(180, H + 66, 0.8),
  pyramids: () => sky('#ffa95c', '#ffe2b3', { sx: 280, sy: 160 }) + dunes('#e8c47c', '#d9ad62') + pyramid(250, H + 2, 1, '#e2b766', 0.2) + pyramid(130, H + 6, 1.35, '#e8c27a', 0) + pyramid(40, H + 10, 0.6, '#dcae5c', 0.35),
  tomb: () => `<rect width="360" height="640" fill="#3a2c1e"/><rect y="390" width="360" height="250" fill="#5a4430"/>` + papyrus(180, 210, 1.2, 0.1) + `<g ${pop(0.4)}><rect x="90" y="380" width="180" height="70" rx="20" fill="#c9a227"/><rect x="100" y="388" width="160" height="54" rx="16" fill="#2f6db5"/><ellipse cx="180" cy="415" rx="34" ry="20" fill="#e2b766"/></g>`,
  meroe: () => sky('#ff8f5a', '#ffd6a8', { sy: 140, sx: 90 }) + dunes('#d99a5c', '#c9874a') + kushPyr(200, H + 4, 1, 0) + kushPyr(250, H + 2, 0.85, 0.12) + kushPyr(295, H, 0.7, 0.24) + kushPyr(150, H + 6, 0.75, 0.36) + `<g ${pop(0.5)}><rect x="30" y="${H - 40}" width="40" height="44" rx="8" fill="#5a3a26"/><g class="a-smoke"><circle cx="50" cy="${H - 56}" r="10" fill="#777" opacity=".5"/><circle cx="56" cy="${H - 80}" r="14" fill="#888" opacity=".4"/></g>${fire(50, H - 30, 0.6)}</g>`,
  indus: () => sky('#9fd3f2', '#eaf7ff') + clouds() + ground('#c99a62') + brickCity(H + 6) + `<rect y="${H + 12}" width="360" height="200" fill="#b98557"/>` + Array.from({ length: 6 }, (_, i) => `<line x1="${i * 70}" x2="${i * 70 + 20}" y1="${H + 12}" y2="640" stroke="#a87448" stroke-width="3"/>`).join(''),
  bodhi: () => sky('#ffcf9a', '#fff3dc', { sy: 130, sx: 290 }) + hills('#8fbf6a', H, 30) + ground('#a8c97a') + bodhi(120, H + 10, 1.1) + stupa(280, H + 6, 0.8, 0.3),
  'map-india': () => map('india'),
  'map-china': () => map('china'),
  'yellow-river': () => sky('#f7d49a', '#fff2d6', { sy: 130 }) + hills('#d4b26a', H - 20, 50) + hills('#c9a35a', H, 30) + river('#c9a043', H + 10, 46) + ground('#b88f43', H + 56) + `<path d="M0 ${H + 90} h360 M0 ${H + 120} h360" stroke="#a37d36" stroke-width="3"/>` + wheat(20, H + 140, 12, 12),
  wall: () => sky('#8ec9f0', '#e3f4ff') + clouds() + peaks('#7aa86a', H) + hills('#5f9150', H, 40) + greatWall() + ground('#5f9150', H + 30),
  palace: () => sky('#ffc48a', '#fff0d8', { sx: 70, sy: 110 }) + ground('#c9b48a') + cnRoof(180, H, 1.3, 0) + terracotta(H + 80),
  'map-silk': () => map('silk'),
  'map-greece': () => map('greece'),
  athens: () => sky('#8ec9f0', '#e8f6ff', { sy: 110 }) + clouds() + `<path d="M0 ${H} Q60 ${H - 120} 180 ${H - 130} Q300 ${H - 120} 360 ${H}Z" fill="#b9a27a"/>` + temple(180, H - 128, 0.9, 0.1) + ground('#d9c79e') + `<path d="M0 ${H} h360" stroke="#c9b48a" stroke-width="4"/>`,
  sparta: () => sky('#f2b07a', '#ffe5c8', { sy: 140, sx: 80 }) + peaks('#9a7f5f', H) + ground('#c9a46a') + `<rect x="250" y="${H - 40}" width="8" height="44" fill="#6b4a2b"/><rect x="290" y="${H - 40}" width="8" height="44" fill="#6b4a2b"/><rect x="246" y="${H - 44}" width="56" height="6" fill="#6b4a2b"/>`,
  olympia: () => sky('#8ec9f0', '#eaf7ff', { sy: 100 }) + clouds() + ground('#d6b886') + `<ellipse cx="180" cy="${H + 70}" rx="200" ry="60" fill="#c9a46a"/><ellipse cx="180" cy="${H + 70}" rx="150" ry="36" fill="#b5d48a"/>` + temple(80, H - 10, 0.5, 0.2) + `<g transform="translate(290 ${H - 10})"><rect x="-4" y="-60" width="8" height="60" fill="#c9a227"/>${fire(0, -58, 0.7)}</g>`,
  'map-rome': () => map('rome'),
  rome: () => sky('#ffb980', '#ffe8cc', { sy: 120, sx: 290 }) + hills('#a5b878', H - 10, 40) + ground('#d9c39a') + temple(90, H + 4, 0.7, 0.1) + arches(260, H + 4, 0.7, 3, 2, '#e3d2b0', 0.25),
  senate: () => `<rect width="360" height="640" fill="#e9e1cf"/><rect y="400" width="360" height="240" fill="#c9b48a"/>` + Array.from({ length: 6 }, (_, i) => `<rect x="${12 + i * 62}" y="90" width="22" height="310" fill="#f7f3ea"/><rect x="${8 + i * 62}" y="82" width="30" height="10" fill="#ddd3bd"/>`).join('') + `<rect y="60" width="360" height="24" fill="#ddd3bd"/>` + `<rect x="0" y="380" width="360" height="22" fill="#b8a27a"/>`,
  colosseum: () => sky('#8ec9f0', '#eaf7ff', { sy: 100 }) + clouds() + ground('#d9c39a') + arches(180, H + 4, 1, 7, 4, '#d9b98a', 0),
  aqueduct: () => sky('#9fd3f2', '#eaf7ff') + clouds() + hills('#8fbf6a', H, 30) + ground('#b9a273') + arches(180, H + 4, 0.9, 9, 2, '#cdb48a', 0) + `<rect x="0" y="${H - 76}" width="360" height="8" fill="#4f9fd6"/>`,
  title: (hue = '#ff5a36') => `<defs><radialGradient id="tg${++uid}" cx=".5" cy=".35" r=".8"><stop offset="0" stop-color="${hue}"/><stop offset="1" stop-color="#1a1013"/></radialGradient></defs><rect width="360" height="640" fill="url(#tg${uid})"/>` +
    Array.from({ length: 14 }, (_, i) => `<circle class="a-float" style="animation-delay:${-i * 0.7}s" cx="${(i * 97) % 360}" cy="${(i * 53) % 640}" r="${3 + (i % 4) * 3}" fill="#fff" opacity=".12"/>`).join(''),
};

// ── Characters ────────────────────────────────────────────────────────
const SK = ['#8d5524', '#c68642', '#e0ac69', '#f1c27d', '#a0522d', '#6b3e26'];
export const KINDS = {
  hunter: { skin: SK[1], body: '#7a4b2a', trim: '#5a361d', hat: 'hair', hair: '#2b1a10', prop: 'spear', fur: true },
  gatherer: { skin: SK[2], body: '#8a6a3d', trim: '#6a4f2b', hat: 'long', hair: '#3a2414', prop: 'basket', fur: true },
  farmer: { skin: SK[1], body: '#c9a46a', trim: '#8a6a3d', hat: 'band', hair: '#2b1a10', prop: 'hoe' },
  scribe: { skin: SK[4], body: '#f1ead8', trim: '#3b6ea5', hat: 'bald', prop: 'tablet' },
  king: { skin: SK[4], body: '#6b3fa0', trim: '#f5b700', hat: 'tall', beard: '#1a1a1a', prop: 'staff' },
  pharaoh: { skin: SK[0], body: '#f4efe2', trim: '#f5b700', hat: 'nemes', prop: 'crook' },
  egyptian: { skin: SK[0], body: '#f4efe2', trim: '#2f8fd8', hat: 'bob', hair: '#121212', prop: 'none' },
  kush: { skin: SK[5], body: '#c0392b', trim: '#f5b700', hat: 'band', hair: '#121212', prop: 'spear' },
  kandake: { skin: SK[5], body: '#f5b700', trim: '#c0392b', hat: 'crown', prop: 'staff' },
  indus: { skin: SK[1], body: '#e9d8b4', trim: '#b5651d', hat: 'band', hair: '#1a1a1a', prop: 'none' },
  monk: { skin: SK[2], body: '#e8871e', trim: '#c96d10', hat: 'bald', prop: 'none' },
  sage: { skin: SK[3], body: '#2c4a6e', trim: '#e9d8b4', hat: 'topknot', hair: '#1a1a1a', beard: '#3a3a3a', prop: 'scroll' },
  emperor: { skin: SK[3], body: '#1d1d1d', trim: '#f5b700', hat: 'mian', prop: 'none' },
  greek: { skin: SK[3], body: '#f4f1ea', trim: '#2f6db5', hat: 'laurel', hair: '#4a2c17', beard: '#4a2c17', prop: 'scroll' },
  spartan: { skin: SK[2], body: '#b3261e', trim: '#f5b700', hat: 'crest', prop: 'spear', shield: '#c9a227' },
  roman: { skin: SK[3], body: '#f4f1ea', trim: '#7b2d8e', hat: 'hair', hair: '#3a2414', prop: 'scroll' },
  legion: { skin: SK[2], body: '#b3261e', trim: '#c9a227', hat: 'galea', prop: 'spear', shield: '#b3261e' },
  caesar: { skin: SK[3], body: '#f4f1ea', trim: '#7b2d8e', hat: 'laurel', hair: '#3a2414', prop: 'none' },
};

const HATS = {
  hair: (k) => `<path d="M-23 -112 Q-22 -140 0 -138 Q22 -140 23 -112 Q14 -128 0 -127 Q-14 -128 -23 -112Z" fill="${k.hair}"/>`,
  long: (k) => `<path d="M-24 -96 Q-28 -142 0 -139 Q28 -142 24 -96 L18 -96 Q20 -124 0 -126 Q-20 -124 -18 -96Z" fill="${k.hair}"/>`,
  bald: () => `<ellipse cx="-8" cy="-126" rx="6" ry="3" fill="#fff" opacity=".25"/>`,
  band: (k) => HATS.hair(k) + `<rect x="-23" y="-124" width="46" height="6" rx="3" fill="${k.trim}"/>`,
  bob: (k) => `<path d="M-25 -98 Q-28 -142 0 -139 Q28 -142 25 -98 L17 -98 L17 -122 L-17 -122 L-17 -98Z" fill="${k.hair}"/>`,
  nemes: (k) => `<path d="M-24 -110 Q-24 -140 0 -140 Q24 -140 24 -110 L32 -78 L18 -84 L18 -112 L-18 -112 L-18 -84 L-32 -78Z" fill="${k.trim}"/>
    ${[-130, -120, -100, -90].map((y) => `<path d="M-30 ${y + 10} L-20 ${y + 10} M20 ${y + 10} L30 ${y + 10}" stroke="#2f6db5" stroke-width="4"/>`).join('')}<rect x="-24" y="-124" width="48" height="5" fill="#2f6db5"/><circle cx="0" cy="-130" r="4" fill="#2f6db5"/>`,
  tall: (k) => `<rect x="-20" y="-158" width="40" height="34" rx="6" fill="${k.trim}"/><rect x="-22" y="-130" width="44" height="6" rx="3" fill="#c48f00"/>${[-10, 0, 10].map((x) => `<circle cx="${x}" cy="-146" r="3" fill="#6b3fa0"/>`).join('')}`,
  crown: (k) => `<path d="M-20 -126 L-20 -146 L-10 -136 L0 -152 L10 -136 L20 -146 L20 -126Z" fill="${k.body}" stroke="#c48f00" stroke-width="2"/><circle cx="0" cy="-140" r="3" fill="${k.trim}"/>`,
  topknot: (k) => HATS.hair(k) + `<circle cx="0" cy="-142" r="9" fill="${k.hair}"/><rect x="-6" y="-150" width="12" height="6" rx="2" fill="${k.trim}"/>`,
  mian: (k) => `<rect x="-14" y="-142" width="28" height="18" rx="4" fill="#1d1d1d"/><rect x="-32" y="-148" width="64" height="7" rx="2" fill="#1d1d1d"/>${[-24, -12, 0, 12, 24].map((x) => `<line x1="${x}" x2="${x}" y1="-141" y2="-118" stroke="${k.trim}" stroke-width="2" stroke-dasharray="2 3"/>`).join('')}`,
  laurel: (k) => HATS.hair(k) + Array.from({ length: 7 }, (_, i) => `<ellipse cx="${-20 + i * 6.6}" cy="${-124 - Math.sin((i / 6) * Math.PI) * 10}" rx="5" ry="2.6" fill="#4f8a3a" transform="rotate(${-40 + i * 13} ${-20 + i * 6.6} ${-124 - Math.sin((i / 6) * Math.PI) * 10})"/>`).join(''),
  crest: () => `<path d="M-25 -104 Q-26 -144 0 -142 Q26 -144 25 -104 L14 -104 L14 -116 L-14 -116 L-14 -104Z" fill="#c9a227"/><path d="M-26 -140 Q0 -186 30 -136" stroke="#b3261e" stroke-width="12" fill="none" stroke-linecap="round"/>`,
  galea: () => `<path d="M-24 -110 Q-25 -144 0 -142 Q25 -144 24 -110Z" fill="#9aa3ad"/><rect x="-26" y="-114" width="52" height="5" rx="2" fill="#c9a227"/><path d="M-4 -142 Q0 -170 22 -156 Q8 -150 4 -142Z" fill="#b3261e"/><rect x="16" y="-112" width="8" height="18" rx="3" fill="#9aa3ad"/>`,
};
const PROPS = {
  none: () => '',
  spear: () => `<line x1="28" y1="-8" x2="28" y2="-168" stroke="#7a4b2a" stroke-width="4"/><path d="M28 -186 L21 -166 L35 -166Z" fill="#9aa3ad"/>`,
  staff: () => `<line x1="28" y1="0" x2="28" y2="-158" stroke="#c48f00" stroke-width="5"/><circle cx="28" cy="-162" r="8" fill="#f5b700"/>`,
  crook: () => `<path d="M26 -30 L34 -110 Q36 -128 22 -124" stroke="#f5b700" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M27 -60 L32 -100" stroke="#2f6db5" stroke-width="6" stroke-dasharray="5 5"/>`,
  tablet: () => `<rect x="14" y="-76" width="26" height="32" rx="5" fill="#c99a62"/><path d="M19 -68 h14 M19 -60 h10 M19 -52 h14" stroke="#6b4a2b" stroke-width="2"/>`,
  scroll: () => `<rect x="18" y="-72" width="26" height="22" fill="#f1e6c8"/><rect x="14" y="-74" width="6" height="26" rx="3" fill="#d9c08a"/><rect x="42" y="-74" width="6" height="26" rx="3" fill="#d9c08a"/>`,
  hoe: () => `<line x1="22" y1="-20" x2="40" y2="-150" stroke="#7a4b2a" stroke-width="4"/><path d="M28 -18 L48 -14 L46 -4Z" fill="#9aa3ad"/>`,
  basket: () => `<path d="M14 -56 Q28 -30 42 -56Z" fill="#c9a46a"/><path d="M16 -54 h24 M18 -48 h20" stroke="#8a6a3d" stroke-width="2"/><circle cx="24" cy="-58" r="4" fill="#c0392b"/><circle cx="32" cy="-59" r="4" fill="#7a3f9a"/>`,
};

// person('pharaoh', x, { s, flip, anim, talk, d })
export function person(kind, x, o = {}) {
  const k = { ...KINDS[kind], ...o };
  const s = o.s || 1, f = o.flip ? -1 : 1, y = o.y || FEET;
  const fur = k.fur ? `<path d="M-24 -32 l6 -8 l6 8 l6 -8 l6 8 l6 -8 l6 8 l6 -8 l6 8Z" fill="${k.trim}"/>` : '';
  return `<g transform="translate(${x} ${y}) scale(${s * f} ${s})"><g class="actor ${o.anim || 'a-idle'}${o.talk ? ' talking' : ''}" style="animation-delay:${o.d || 0}s">
    <ellipse cx="0" cy="2" rx="26" ry="6" fill="#000" opacity=".18"/>
    <g class="leg-l"><rect x="-13" y="-40" width="10" height="40" rx="5" fill="${k.skin}"/></g><g class="leg-r"><rect x="3" y="-40" width="10" height="40" rx="5" fill="${k.skin}"/></g>
    <path d="M-24 -32 Q-21 -62 -17 -86 Q0 -94 17 -86 Q21 -62 24 -32Z" fill="${k.body}"/>${fur}
    <rect x="-21" y="-58" width="42" height="6" rx="3" fill="${k.trim}"/>
    ${k.shield ? `<g class="arm-l"><circle cx="-28" cy="-62" r="20" fill="${k.shield}" stroke="#7a5a10" stroke-width="3"/><circle cx="-28" cy="-62" r="6" fill="#7a5a10"/></g>` : `<g class="arm-l"><path d="M-15 -82 Q-28 -66 -26 -50" stroke="${k.skin}" stroke-width="9" fill="none" stroke-linecap="round"/></g>`}
    <g class="arm-r"><path d="M15 -82 Q28 -66 26 -50" stroke="${k.skin}" stroke-width="9" fill="none" stroke-linecap="round"/>${PROPS[k.prop]()}</g>
    <rect x="-6" y="-94" width="12" height="10" fill="${k.skin}"/>
    <circle cx="0" cy="-112" r="23" fill="${k.skin}"/>
    <g class="eyes"><rect x="-8" y="-121" width="6" height="11" rx="3" fill="#1f0d08"/><rect x="6" y="-121" width="6" height="11" rx="3" fill="#1f0d08"/>
      <circle cx="-6" cy="-118" r="1.4" fill="#fff"/><circle cx="8" cy="-118" r="1.4" fill="#fff"/></g>
    <circle cx="-12" cy="-104" r="4" fill="#ff8a7a" opacity=".35"/><circle cx="16" cy="-104" r="4" fill="#ff8a7a" opacity=".35"/>
    <ellipse class="mouth" cx="3" cy="-101" rx="4.5" ry="2.2" fill="#5a1f14"/>
    ${k.beard ? `<path d="M-14 -102 Q0 -78 16 -102 Q8 -92 0 -92 Q-8 -92 -14 -102Z" fill="${k.beard}"/>` : ''}
    ${HATS[k.hat](k)}
  </g></g>`;
}

// Build the SVG for one beat: set + cast.
export function scene(setName, cast = [], arg) {
  const bg = SETS[setName] ? SETS[setName](arg) : SETS.title();
  const actors = cast.map(([kind, x, o]) => person(kind, x, o)).join('');
  return `<svg viewBox="0 0 360 640" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><g class="cam">${bg}${actors}</g></svg>`;
}
export const SET_NAMES = Object.keys(SETS);
