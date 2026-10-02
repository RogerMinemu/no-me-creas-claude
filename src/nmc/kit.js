// kit.js: shared sets, props and helpers for "No me creas" (Claude). Loaded after core/clawd/cast/props.
// Everything is a pure function of t (frames render out of order).

const NM = {
  pink: '#F58FB8', hot: '#E8508C', cyan: '#5CC9E0', lilac: '#B79CE8', lime: '#B8E06A', butter: '#FFE07A',
  mint: '#9FE3C8', night: '#241B45', deep: '#16123A', red: '#E2475A', green: '#3E9E57', gold: '#F2C53D',
  peach: '#FFC2A1', blush: '#FFD6E5', ice: '#DDF4FA', grape: '#5B3E96'
};
const WORDS = (window.SONG_WORDS?.lines || []).flat();
const SECTIONS = window.SONG_CONFIG?.sections || [];

// Extra display font for signs and titles. Wrap core's setup so rendering waits for it.
const coreSetup = setup;
window.setup = async function () { await document.fonts.load('700 100px "Fredoka"'); return coreSetup(); };

// ---------- text ----------
function title(txt, x, y, size, col, o = {}) {
  letter(txt, x, y, size, col, { font: `700 ${size}px "Fredoka", sans-serif`, stroke: o.stroke === undefined ? PAL.ink : o.stroke, ink: o.ink ?? false, ...o });
}
function label(txt, x, y, size, col = PAL.ink, o = {}) { letter(txt, x, y, size, col, { font: `700 ${size}px "Fredoka", sans-serif`, ink: false, ...o }); }

// ---------- singing ----------
// The word being sung at t (or null) and progress k through it.
function wordAt(t) {
  for (const w of WORDS) { if (t < w.start - .02) return null; if (t <= w.end + .06) return { w, k: clamp((t - w.start) / Math.max(.08, w.end - w.start)) }; }
  return null;
}
// Clawd's mouth while singing: opens on each syllable, rests on a smile between words.
function singMouth(t, rest = 'smile') {
  const a = wordAt(t); if (!a) return rest;
  const syl = Math.max(1, Math.round(a.w.text.replace(/[^\p{L}]/gu, '').length / 2.4));
  return frac(a.k * syl) < .6 ? 'O' : 'o';
}

// ---------- shapes & props ----------
function spark4(x, y, r, col = NM.butter, rot = 0, sw = .8) { paint(starPts(x, y, r, .3, 4, rot - Math.PI / 2), { wash: col, ink: PAL.ink, sw }); }
function glow(x, y, rx, ry, col, op = 110) { paint(ellPts(x, y, rx, ry, 26, rx * .04), { fill: col, fillOp: op, bleed: .3, tex: .4, border: .2, ink: null }); }
function bead(x, y, r, col, o = {}) { paint(ellPts(x, y, r, r, Math.max(10, Math.min(28, r * .8))), { wash: col, ink: o.ink === undefined ? PAL.ink : o.ink, sw: o.sw ?? .8 }); }
function rbox(x, y, w, h, col, o = {}) { paint(rrPts(x, y, w, h, o.r ?? Math.min(w, h) * .18, o.j ?? 1.5), { wash: col, washOp: o.op ?? 255, ink: o.ink === undefined ? PAL.ink : o.ink, sw: o.sw ?? 1.1, ...(o.fill ? { fill: o.fill, fillOp: o.fillOp ?? 60, tex: .6, bleed: .05 } : {}) }); }
function ln(pts, w = 1, col = PAL.ink, curv = 0) { inkLine(pts, w, col, w < .9 ? "inkfine" : "ink", pts.length < 3 ? 0 : curv); }

// Speech bubble centred on (x, y); the tail points to [tx, ty].
function bubble(x, y, w, h, o = {}) {
  const k = o.k ?? 1; if (k < .02) return;
  w *= k; h *= k;
  const r = Math.min(h / 2, 46), p = rrPts(x - w / 2, y - h / 2, w, h, r, 1.5);
  if (o.tail) {
    const tx = x + (o.tail[0] - x) * k, ty = y + (o.tail[1] - y) * k, side = tx < x ? -1 : 1, bx = clamp(tx, x - w / 2 + r + 30, x + w / 2 - r - 30);
    // bottom edge runs right→left between indices 11 and 12 of rrPts
    p.splice(12, 0, [bx + 28 - side * 6, y + h / 2], [tx, ty], [bx - 28 - side * 6, y + h / 2]);
  }
  paint(p, { wash: o.col || PAL.cream, washOp: 255, ink: PAL.ink, sw: o.sw ?? 1.3 });
  if (o.txt) label(o.txt, x, y + 2, (o.size || h / k * .4) * k, o.tcol || PAL.ink);
}

// Browser window. (x, y) top-left. o.tabs = ['No me creas', ...]; o.active tab index; o.flap 0..1 tabs flutter like eyelashes;
// o.closeGlow 0..1 highlights the active tab's ×; o.bg page colour; o.bar chrome colour.
function browserWin(x, y, w, h, t, o = {}) {
  const bar = o.bar || NM.lilac, tabs = o.tabs || ['No me creas'], act = o.active ?? 0;
  if (!o.noShadow) paint(rrPts(x + 18, y + 24, w, h, 30), { wash: PAL.ink, washOp: 70, ink: null });
  paint(rrPts(x, y, w, h, 30, 1.5), { wash: bar, washOp: 255, ink: null });
  paint(rrPts(x + 14, y + 96, w - 28, h - 110, 20, 1.5), { wash: o.bg || PAL.cream, washOp: 255, ink: PAL.ink, sw: 1 });
  for (let i = 0; i < 3; i++) bead(x + 42 + i * 40, y + 46, 13, [NM.red, NM.butter, NM.mint][i], { sw: .7 });
  const tw = Math.min(330, (w - 260) / tabs.length);
  tabs.forEach((name, i) => {
    const tx = x + 170 + i * (tw + 8), on = i === act, f = (o.flap || 0) * Math.sin(t * 22 + i * 1.7);
    push(); translate(tx + tw / 2, y + 96); rotate(f * .25); scale(1, 1 + f * .25); translate(-tx - tw / 2, -y - 96);
    paint([[tx, y + 96], [tx + 16, y + 30], [tx + tw - 16, y + 30], [tx + tw, y + 96]], { wash: on ? (o.bg || PAL.cream) : mixCol(bar, PAL.cream, .45), washOp: 255, ink: PAL.ink, sw: .9, curv: .15 });
    label(name, tx + tw / 2 - 16, y + 64, 26, PAL.ink);
    const cx = tx + tw - 34, cy = y + 63, g = on ? clamp(o.closeGlow || 0) : 0;
    if (g > .01) bead(cx, cy, 13 + 5 * g, mixCol(PAL.cream, NM.red, g), { ink: null });
    ln([[cx - 7, cy - 7], [cx + 7, cy + 7]], .9); ln([[cx + 7, cy - 7], [cx - 7, cy + 7]], .9);
    pop();
  });
  paint(rrPts(x, y, w, h, 30, 1.5), { ink: PAL.ink, sw: 1.6 });
}

// Hyperpop stage: lilac back wall, a soft glow, turning sparkles, perspective checker floor from y 780.
function popStage(t, o = {}) {
  const a = o.a || NM.lilac, b = o.b || NM.pink, c = o.c || NM.cyan;
  paint(rectPts(-300, -300, W + 600, 1110, 0), { wash: a, washOp: 255, ink: null });
  glow(960, 470, 760, 470, b, o.glowOp ?? 150);
  // giant slow sunrays in alternating tints, then sparkles
  for (let i = 0; i < 12; i++) {
    const a0 = t * .15 + i * TAU / 12, a1 = a0 + TAU / 30;
    paint([[960, 480], [960 + Math.cos(a0) * 1800, 480 + Math.sin(a0) * 1800], [960 + Math.cos(a1) * 1800, 480 + Math.sin(a1) * 1800]], { wash: i % 2 ? PAL.cream : c, washOp: 55, ink: null });
  }
  const n = o.sparks ?? 9;
  for (let i = 0; i < n; i++) {
    const x = 140 + hash(i * 3.1) * 1640, y = 90 + hash(i * 7.7) * 520, r = (24 + hash(i) * 30) * (1 + .35 * pulse(t + i * .07, 5));
    spark4(x + wob(t, .1, i) * 20, y, r, [NM.butter, PAL.cream, NM.mint, c][i % 4], t * (i % 2 ? .8 : -.6));
  }
  // checker floor
  const fy = 780, rows = 5, cols = 14;
  paint([[-300, fy], [W + 300, fy], [W + 300, 1400], [-300, 1400]], { wash: o.floor || PAL.cream, washOp: 255, ink: PAL.ink, sw: 1.2 });
  for (let r = 0; r < rows; r++) {
    const y0 = fy + Math.pow(r / rows, 1.6) * 330, y1 = fy + Math.pow((r + 1) / rows, 1.6) * 330;
    for (let k = 0; k < cols; k++) {
      if ((k + r) % 2) continue;
      const X = (kk, yy) => 960 + (kk / cols - .5) * (1900 + (yy - fy) * 4.2);
      paint([[X(k, y0), y0], [X(k + 1, y0), y0], [X(k + 1, y1), y1], [X(k, y1), y1]], { wash: o.tile || b, washOp: 200, ink: null });
    }
  }
  if (o.spots) for (const [sx, col] of o.spots) {
    paint([[sx - 70, -60], [sx + 70, -60], [sx + 240, 860], [sx - 240, 860]], { fill: col || PAL.cream, fillOp: 45, bleed: .05, tex: .2, ink: null });
  }
}

// A plain painted room wall + floor (verses). o.wall, o.floor, o.window (night window at x)
function room(t, o = {}) {
  paint(rectPts(-300, -300, W + 600, 1100), { wash: o.wall || NM.blush, washOp: 255, ink: null });
  // wallpaper dots
  for (let i = 0; i < 26; i++) { const x = (i % 7) * 300 + (Math.floor(i / 7) % 2) * 150 + 40, y = 70 + Math.floor(i / 7) * 190; spark4(x, y, 14, o.dots || PAL.cream, 0, .5); }
  paint([[-300, 800], [W + 300, 800], [W + 300, 1400], [-300, 1400]], { wash: o.floor || '#C99A7A', washOp: 255, fill: '#8C5E46', fillOp: 50, tex: .7, bleed: .05, ink: PAL.ink, sw: 1.2 });
  for (const yy of [870, 960]) ln([[-300, yy], [W + 300, yy + jit(2)]], .5, '#8C5E46');
}

// Desk with a laptop (laptop screen shows o.screen colour).
function desk(x, y, s = 1, o = {}) {
  push(); translate(x, y); scale(s);
  rbox(-330, -20, 660, 40, '#B07A55', { r: 8 });
  paint(rectPts(-300, 20, 30, 180), { wash: '#8C5E46', ink: PAL.ink, sw: .9 });
  paint(rectPts(270, 20, 30, 180), { wash: '#8C5E46', ink: PAL.ink, sw: .9 });
  if (o.laptop !== false) {
    paint([[-150, -20], [150, -20], [175, -8], [-175, -8]], { wash: '#9AA3B5', ink: PAL.ink, sw: .9 });
    paint(rrPts(-140, -210, 280, 190, 12), { wash: '#4A5268', ink: PAL.ink, sw: 1 });
    paint(rrPts(-126, -198, 252, 166, 8), { wash: o.screen || NM.lilac, ink: null });
    if (o.onScreen) o.onScreen();
  }
  pop();
}

// Magnifying glass: lens centre (x, y), radius r, handle toward angle a.
function lupa(x, y, r, a = .8, o = {}) {
  const hx = x + Math.cos(a) * r, hy = y + Math.sin(a) * r;
  paint([[hx - Math.sin(a) * r * .14, hy + Math.cos(a) * r * .14], [hx + Math.cos(a) * r * 1.1 - Math.sin(a) * r * .14, hy + Math.sin(a) * r * 1.1 + Math.cos(a) * r * .14],
         [hx + Math.cos(a) * r * 1.1 + Math.sin(a) * r * .14, hy + Math.sin(a) * r * 1.1 - Math.cos(a) * r * .14], [hx + Math.sin(a) * r * .14, hy - Math.cos(a) * r * .14]], { wash: '#8C5E46', ink: PAL.ink, sw: .9 });
  paint(ellPts(x, y, r, r, 28), { wash: o.lens || NM.ice, washOp: o.op ?? 150, ink: null });
  paint(ellPts(x, y, r, r, 28), { ink: PAL.ink, sw: 1.4 });
  paint(ellPts(x, y, r * 1.08, r * 1.08, 28), { ink: NM.gold, sw: 1.1 });
  ln([[x - r * .55, y - r * .25], [x - r * .3, y - r * .55]], .9, PAL.cream, .5);
}
// Hand hook that holds a lupa (for researcher handR / clawd armR).
const holdLupa = (r = 1.6) => (s) => lupa(s * r * .9, -s * r * 1.2, s * r, 2.3);

// Rubber stamp with a check. age = time since the hit (negative = still coming down).
function stamp(x, y, s, txt, age, o = {}) {
  const col = o.col || NM.green, rot = o.rot ?? -.12;
  if (age > 0) {
    const k = backOut(age * 7);
    push(); translate(x, y); rotate(rot); scale(s * (.7 + .3 * k));
    paint(rrPts(-420, -95, 840, 190, 34, 3), { wash: PAL.cream, washOp: 120, ink: col, sw: 3.2 });
    paint(rrPts(-402, -78, 804, 156, 26, 3), { ink: col, sw: 1.4 });
    // check mark
    paint([[-372, -6], [-338, -36], [-306, 0], [-232, -78], [-202, -48], [-306, 58]], { wash: col, ink: null });
    pop();
    letter(txt, x + 70 * s, y - 2 * s, 68 * s, col, { font: `700 ${68 * s}px "Fredoka", sans-serif`, rot, ink: false, pop: age * 7 });
  }
  // the stamp itself: lifts off after the hit
  const lift = age < 0 ? easeIn(clamp(-age / .25)) * 520 : easeOut(clamp((age - .12) / .3)) * 560;
  if (lift < 600) {
    const sy = y - 90 * s - lift, sq = age >= 0 && age < .1 ? .12 : 0;
    push(); translate(x, sy); rotate(rot); scale(s * (1 + sq), s * (1 - sq));
    rbox(-400, -60, 800, 70, '#8C5E46', { r: 14 });
    rbox(-60, -220, 120, 170, '#B07A55', { r: 30 });
    bead(0, -250, 80, NM.hot);
    rbox(-410, 0, 820, 26, col, { r: 8 });
    pop();
  }
}

// Clawd's chest door (body-local hook for clawd o.draw). k = 0 shut .. 1 open. Light spills out when open.
function chestDoor(k, glowCol = NM.butter) {
  return (u, sw) => {
    const x0 = -1.9 * u, y0 = -4.9 * u, w = 3.8 * u, h = 2.7 * u;
    paint(rrPts(x0, y0, w, h, .5 * u), { wash: k > .02 ? glowCol : PAL.clayDk, washOp: 255, ink: PAL.ink, sw: sw * .7 });
    if (k > .02) {
      paint(ellPts(0, y0 + h / 2, 1.2 * u, .9 * u, 16), { wash: PAL.cream, washOp: 200, ink: null });
      for (let i = 0; i < 3; i++) spark4(x0 + (.8 + i * 1.1) * u, y0 + (.7 + (i % 2) * 1.2) * u, .35 * u, PAL.cream, T * 2 + i, sw * .4);
    }
    const dw = w * Math.cos(clamp(k) * Math.PI * .47);
    paint(rrPts(x0 - (w - dw) * .04, y0, dw, h, .5 * u), { wash: PAL.clay, washOp: 255, fill: PAL.clayDk, fillOp: 40, ink: PAL.ink, sw: sw * .8 });
    if (dw > u) bead(x0 + dw - .5 * u, y0 + h / 2, .22 * u, NM.gold, { sw: sw * .4 });
  };
}

// The inside of Clawd: deep night, threads between glowing feature-nodes. o.focus = node index to highlight.
const NODES = Array.from({ length: 22 }, (_, i) => [140 + hash(i * 4.3) * 1640, 120 + hash(i * 9.1 + 2) * 700, 26 + hash(i * 2.2) * 30]);
const LINKS = Array.from({ length: 30 }, (_, i) => [Math.floor(hash(i * 5.5) * 22), Math.floor(hash(i * 3.3 + 1) * 22)]).filter(([a, b]) => a !== b);
function insideWorld(t, o = {}) {
  paint(rectPts(-300, -300, W + 600, H + 600), { wash: o.bg || NM.deep, washOp: 255, ink: null });
  glow(960, 520, 900, 520, o.tint || NM.grape, 120);
  for (const [a, b] of LINKS) {
    const [x1, y1] = NODES[a], [x2, y2] = NODES[b];
    ln([[x1, y1], [(x1 + x2) / 2 + 40 * Math.sin(a + b), (y1 + y2) / 2 + 30 * Math.cos(a)], [x2, y2]], .6, mixCol(NM.lilac, NM.night, .3), .5);
  }
  NODES.forEach(([x, y, r], i) => {
    const lit = .35 + .65 * Math.pow(.5 + .5 * Math.sin(t * 2.2 + i * 1.9), 3) + (i % 4 === beatN(t) % 4 ? .3 * pulse(t, 4) : 0);
    const col = [NM.butter, NM.cyan, NM.pink, NM.mint][i % 4];
    if (lit > .5) glow(x, y, r * 2.2, r * 2.2, col, 70 * lit);
    bead(x, y, r * (.85 + .15 * lit), mixCol(NM.night, col, clamp(lit)), { sw: .7 });
    if (o.labels && o.labels[i]) label(o.labels[i], x, y + r + 26, 26, PAL.cream);
  });
}

// Golden Gate bridge silhouette across [x0, x1] with deck at y. s scales tower height.
function goldenGate(x0, x1, y, s = 1, o = {}) {
  const col = o.col || '#D9533C', w = x1 - x0, tx = [x0 + w * .22, x0 + w * .78], th = 330 * s;
  if (o.water !== false) paint([[x0 - 200, y + 30], [x1 + 200, y + 30], [x1 + 200, y + 400], [x0 - 200, y + 400]], { wash: '#7FB7D8', fill: '#4F8DB8', fillOp: 70, tex: .6, ink: null });
  for (const X of tx) {
    rbox(X - 18 * s, y - th, 36 * s, th + 160 * s, col, { r: 4, sw: .9 });
    for (const k of [.18, .5, .8]) rbox(X - 30 * s, y - th * k, 60 * s, 14 * s, col, { r: 2, sw: .7 });
  }
  // main cable: down to the deck at both ends, a deep sag between the towers
  const cab = [];
  for (let i = 0; i <= 24; i++) {
    const q = i / 24, X = x0 + q * w;
    const h = q < .22 ? q / .22 * .95 : q > .78 ? (1 - q) / .22 * .95 : .95 - .8 * (1 - Math.pow((q - .5) / .28, 2));
    cab.push([X, y - th * Math.max(.04, h)]);
  }
  ln(cab, 1.3 * s, col, .5);
  for (let i = 1; i < 24; i++) { const [X, Y] = cab[i]; ln([[X, Y], [X, y]], .45, col); }
  rbox(x0 - 40, y - 8, w + 80, 26 * s, col, { r: 3, sw: .9 });
}

// Confetti burst fired at t0 from (x, y): little paper rectangles fly out, tumble and fall.
function confetti(t, t0, x, y, n = 18, spread = 520) {
  const a = t - t0; if (a < 0 || a > 1.6) return;
  for (let i = 0; i < n; i++) {
    const ang = -Math.PI / 2 + (hash(i * 3.3 + t0) - .5) * 2.6, v = spread * (.5 + hash(i * 7.1 + t0) * .7);
    const px = x + Math.cos(ang) * v * a, py = y + Math.sin(ang) * v * a + 520 * a * a, r = a * 9 + i;
    push(); translate(px, py); rotate(r);
    paint(rectPts(-12, -6, 24, 12), { wash: [NM.butter, NM.cyan, NM.hot, NM.lime, NM.lilac][i % 5], washOp: 255 * (1 - seg(a, 1.2, 1.6)), ink: null });
    pop();
  }
}

// Simple word tile (Scrabble-ish).
function tile(x, y, s, txt, col = NM.butter, rot = 0) {
  const w = Math.max(s, txt.length * s * .34 + s * .35);
  push(); translate(x, y); rotate(rot); rbox(-w / 2, -s / 2, w, s, col, { r: s * .14 }); pop();
  label(txt, x, y + 2, s * .52, PAL.ink, { rot });
}

// Researcher with variants (coat/shirt/hair via o). Wrapper so scenes read nicely.
function human(x, y, s, o = {}) { researcher(x, y, s, o); }

// Big friendly ON/OFF switch.
function switchProp(x, y, s, on, o = {}) {
  push(); translate(x, y); scale(s);
  rbox(-90, -150, 180, 300, o.plate || PAL.cream, { r: 30, sw: 1.3 });
  rbox(-40, -100, 80, 200, '#4A5268', { r: 20 });
  const ky = on ? -48 : 48;
  rbox(-56, ky - 46, 112, 92, on ? NM.lime : NM.red, { r: 24, sw: 1.2 });
  pop();
  label(on ? 'ON' : 'OFF', x, y + (on ? -48 : 48) * s, 34 * s, PAL.ink);
}

// Chapter registry (same contract as the original timeline: shots paint the whole frame).
const CH = [];
function chapter(name, start, end, shots) { CH.push({ name, start, end, shots }); CH.sort((a, b) => a.start - b.start); }
