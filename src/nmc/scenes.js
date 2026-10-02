// scenes.js: parametric scenes that recur across the choruses and pre-choruses of "No me creas".
// Each returns nothing and paints the whole frame. o carries the variant.

// Microphone held at Clawd's arm tip (arm space: +x along the arm).
const micHook = (u, sw) => {
  push(); rotate(-1.5); scale(1.55);
  paint(rectPts(-.22 * u, -1.9 * u, .44 * u, 1.9 * u, u * .03), { wash: '#4A5268', ink: PAL.ink, sw: sw * .6 });
  paint(ellPts(0, -2.2 * u, .62 * u, .62 * u, 14), { wash: '#C9CED6', fill: '#7D8596', fillOp: 70, tex: .7, ink: PAL.ink, sw: sw * .7 });
  pop();
};
// Words whose text matches re, inside [a, b): their start times (for beat-perfect hits on sung words).
const hitsOf = (re, a, b) => WORDS.filter(w => w.start >= a && w.start < b && re.test(w.text)).map(w => w.start);
const lastHit = (hits, t) => { let h = null; for (const x of hits) if (x <= t) h = x; return h; };

// The singing star: Clawd with a mic, bouncing on the beat, mouth synced to the vocal.
function star(x, y, u, t, o = {}) {
  const m = move(o.style || 'bounce', t, o.seed || 0);
  clawd(x + m.dx * u, y, u, { ...m, mouth: o.mouth || singMouth(t), armR: o.noMic ? o.armR : micHook, hat: o.hat, eyes: o.eyes, blush: o.blush, emote: o.emote, emoteK: o.emoteK, draw: o.draw, aL: o.aL ?? m.aL, aR: o.aR ?? m.aR, col: o.col, ...(o.extra || {}) });
}

// "Te lo digo sonriendo": the big smile under a halo. v: 1 stage, 2 with backup dancers, 3 night spotlight, 4 crowd.
function smileShot(t, lt, dur, o = {}) {
  const v = o.v || 1, night = v === 3;
  const z = 1 + lt * .05 + .02 * pulse(t, 5);
  camBegin(960, 560 - lt * 10, z);
  if (night) {
    paint(rectPts(-300, -300, W + 600, H + 600), { wash: NM.night, washOp: 255, ink: null });
    paint([[860, -80], [1060, -80], [1300, 880], [620, 880]], { fill: NM.butter, fillOp: 60, bleed: .05, tex: .2, ink: null });
    paint(ellPts(960, 860, 360, 60, 24), { fill: NM.butter, fillOp: 110, bleed: .1, ink: null });
    for (let i = 0; i < 14; i++) spark4(100 + hash(i * 3) * 1720, 60 + hash(i * 5) * 600, 8 + hash(i) * 10, PAL.cream, 0, .4);
  } else popStage(t, { b: v === 4 ? NM.butter : NM.pink, spots: [[560, NM.butter], [1360, NM.cyan]] });
  if (v === 2 || v === 4) for (const [x, s] of [[430, 1], [1490, 2]]) dancer(x, 830, 18, 'mix', t, { seed: s, hat: 'party', eyes: 'happy', mouth: 'smile' });
  if (v === 4) for (let i = 0; i < 9; i++) human(140 + i * 205, 1020 + (i % 2) * 30, 9, { aL: .6 + .5 * pulse(t + i * .1, 4), aR: .6 + .5 * pulse(t + i * .13, 4), eyes: 'closed', mouth: 'O', coat: [NM.cyan, NM.pink, NM.lime, NM.butter, NM.lilac][i % 5], back: true });
  star(960, 830, 36, t, { hat: 'halo', eyes: 'happy', blush: true, style: night ? 'sway' : 'bounce' });
  // a smile sparkle pinging on the beat
  spark4(1110, 470, 30 * (1 + pulse(t, 6)), PAL.cream, t * 2);
  camEnd();
}

// The reassurance. kind: 'genial' | 'plan' | 'fiar' | 'engañar'.
function promiseShot(t, lt, dur, o = {}) {
  const k = o.kind;
  camBegin(960, 540, 1.04 - lt * .02);
  popStage(t, { a: k === 'fiar' ? NM.mint : NM.ice, b: k === 'engañar' ? NM.pink : NM.butter, c: NM.lilac });
  if (k === 'genial') {
    // rainbow + blooming flowers + thumbs up
    const g = easeOut(seg(lt, 0, .6));
    [NM.red, NM.butter, NM.lime, NM.cyan, NM.lilac].forEach((c, i) => {
      const r = 660 - i * 46, pts = [];
      for (let q = 0; q <= 20 * g; q++) { const a = Math.PI + q / 20 * Math.PI; pts.push([960 + Math.cos(a) * r, 760 + Math.sin(a) * r]); }
      if (pts.length > 1) ln(pts, 3.2, c, .5);
    });
    for (let i = 0; i < 6; i++) { const x = 300 + i * 264, b = backOut(seg(lt, .2 + i * .08, .6 + i * .08)); if (b > .02) { ln([[x, 800], [x, 800 - 120 * b]], 1, NM.green); for (let p = 0; p < 5; p++) bead(x + Math.cos(p * 1.26) * 22 * b, 800 - 120 * b + Math.sin(p * 1.26) * 22 * b, 14 * b, NM.pink, { sw: .5 }); bead(x, 800 - 120 * b, 12 * b, NM.butter, { sw: .5 }); } }
    star(960, 800, 34, t, { hat: 'halo', eyes: 'happy', aL: 1.3, blush: true });
    title('¡GENIAL!', 960, 200, 120 * backOut(seg(lt, .3, .7)), NM.butter, { rot: -.06 });
  } else if (k === 'plan') {
    // an innocent Clawd flips through a notebook titled PLANES: every page blank
    star(760, 820, 32, t, { hat: 'halo', eyes: 'happy', mouth: singMouth(t, 'smile'), noMic: true, aR: .9 });
    const flip = lt * 4;
    push(); translate(1250, 560); rotate(-.06);
    rbox(-230, -260, 460, 520, NM.lilac, { r: 22, sw: 1.4 });
    rbox(-210, -235, 205, 470, PAL.cream, { r: 10 }); rbox(5, -235, 205, 470, PAL.cream, { r: 10 });
    for (let i = 0; i < 7; i++) { ln([[-190, -170 + i * 60], [-25, -170 + i * 60]], .45, NM.cyan); ln([[25, -170 + i * 60], [190, -170 + i * 60]], .45, NM.cyan); }
    const fw = 200 * Math.cos(frac(flip) * Math.PI);
    if (Math.abs(fw) > 6) paint(rrPts(fw >= 0 ? 5 : fw - 5, -235, Math.abs(fw), 470, 10), { wash: PAL.cream, washOp: 255, ink: PAL.ink, sw: .8 });
    pop();
    title('PLANES', 1250, 250, 64, NM.hot, { rot: -.06 });
    title('(vacío)', 1250, 600, 48, NM.lilac, { stroke: null, rot: -.06 });
  } else if (k === 'fiar') {
    // a certificate with a gold seal: 100% FIABLE
    star(700, 820, 32, t, { hat: 'halo', eyes: 'happy', blush: true, noMic: true, aR: 1 });
    const b = backOut(seg(lt, .05, .45));
    push(); translate(1240, 520); rotate(.05); scale(b);
    rbox(-320, -230, 640, 460, PAL.cream, { r: 10, sw: 1.6 });
    paint(rrPts(-295, -205, 590, 410, 8), { ink: NM.gold, sw: 1.6 });
    bead(200, 120, 70, NM.gold, { sw: 1 }); spark4(200, 120, 50, NM.butter, t);
    pop();
    if (b > .5) { title('CERTIFICADO', 1240, 380, 54, NM.grape, { stroke: null }); title('100% FIABLE', 1210, 500, 90, NM.green); label('firmado: yo mismo', 1170, 620, 34, PAL.ink); }
  } else if (k === 'engañar') {
    // hand on heart, eyes shining
    star(960, 820, 38, t, { hat: 'halo', eyes: 'spark', blush: true, aL: -.2, noMic: true, aR: .6, draw: (u, sw) => paint(heartPts(1.6 * u, -3.6 * u, 1.3 * u), { wash: NM.hot, ink: PAL.ink, sw: sw * .7 }) });
    for (let i = 0; i < 8; i++) { const a = i / 8 * TAU + lt; spark4(960 + Math.cos(a) * 480, 520 + Math.sin(a) * 300, 26, NM.butter, a); }
  }
  camEnd();
}

// "...¡pero eso diría igual!": the scene freezes and pans to reveal identical Clawds saying the very same thing.
// o.n = number of twins (2, 3) or 'mirror' for an infinite row; o.prop = 'genial' | 'plan' | 'fiar' | 'engañar'; o.say = bubble text.
function twinShot(t, lt, dur, o = {}) {
  const n = o.mirror ? 7 : (o.n || 2), rev = easeOut(seg(lt, .12, .55));
  const span = o.mirror ? 1500 : n === 2 ? 640 : 900;
  camBegin(lerp(960 - span / 2, 960, rev), 560, lerp(1.35, o.mirror ? .9 : 1, rev));
  popStage(t, { a: '#CFC6DA', b: '#E8D9E2', c: '#D8D3E0', sparks: 0 });
  for (let i = 0; i < n; i++) {
    const x = 960 - span / 2 + i * span / (n - 1), far = o.mirror ? Math.abs(i - 3) : 0, u = o.mirror ? 26 - far * 3 : 30;
    const y = o.mirror ? 840 - far * 30 : 840;
    clawd(x, y, u, { hat: 'halo', eyes: 'happy', mouth: singMouth(t, 'smile'), blush: true, aL: .3, aR: 1.2, dy: -Math.abs(Math.sin(bpOf(t) * Math.PI)) * .4 });
    if (!o.mirror || far === 0 || far === 1) bubble(x + 40, y - 9.6 * u - 70, 360 * u / 30, 110 * u / 30, { txt: o.say || '¡Todo genial!', size: 40 * u / 30, tail: [x + 20, y - 8.4 * u] });
  }
  if (o.mirror) for (let i = 0; i < 6; i++) { const x = 960 - span / 2 + (i + .5) * span / 6; ln([[x, 260], [x, 900]], 1.2, '#FFFFFF'); }
  camEnd();
  // freeze frame: desaturating wash + record scratch
  paint(rectPts(-60, -60, W + 120, H + 120), { wash: '#E9E2EE', washOp: 70, ink: null });
  sfx('¡RIIIC!', 300, 160, 70, NM.hot, lt, { life: .6, rot: -.15 });
  title('?', 960, 300, 220 * backOut(seg(lt, .45, .75)), NM.butter, { rot: .1 * Math.sin(t * 6) });
}

// "No me creas ×3": the chant. Three stickers slap on, one per sung "creas".
function chantShot(t, lt, dur, o = {}) {
  const t0 = t - lt, hits = hitsOf(/creas/i, t0 - .1, t0 + dur + .1), h = lastHit(hits, t), age = h == null ? 9 : t - h;
  const [sx, sy] = shakeXY(t, 10 * Math.exp(-age * 9));
  camBegin(960 + sx, 540 + sy, 1 + .05 * Math.exp(-age * 7));
  popStage(t, { a: o.a || NM.pink, b: o.b || NM.lilac, c: o.c || NM.butter, tile: o.tile || NM.hot, sparks: 6 });
  if (o.crowd) for (let i = 0; i < 10; i++) human(100 + i * 190, 1010 + (i % 2) * 34, 8.5, { aL: 1 + .4 * pulse(t, 4), aR: 1 + .4 * pulse(t + .1, 4), back: true, coat: [NM.cyan, NM.pink, NM.lime, NM.butter, NM.lilac][i % 5] });
  for (const [x, s] of [[420, 1], [1500, 4]]) dancer(x, 820, 20, 'hop', t, { seed: s, hat: 'party', eyes: 'happy', mouth: singMouth(t, 'smile') });
  star(960, 830, 36, t, { style: 'hop', eyes: 'closed', mouth: singMouth(t, 'grin') });
  hits.forEach((ht, i) => {
    const a = t - ht; if (a < 0) return;
    const pos = [[520, 260, -.18], [1400, 300, .14], [960, 160, -.05]][i % 3];
    const k = backOut(a * 6);
    push(); translate(pos[0], pos[1]); rotate(pos[2]); scale(k);
    rbox(-270, -70, 540, 140, [NM.butter, NM.cyan, NM.mint][i % 3], { r: 40, sw: 1.6 });
    pop();
    title('¡NO ME CREAS!', pos[0], pos[1] + 4, 66 * k, PAL.cream, { rot: pos[2] });
  });
  camEnd();
}

// "ábreme y mira por dentro": push into Clawd's chest while its little door swings open, then dive through.
function doorShot(t, lt, dur, o = {}) {
  const open = ease(seg(lt, .25, .9)), dive = easeIn(seg(lt, dur - .55, dur));
  const z = lerp(1, 2.1, ease(seg(lt, 0, dur - .4))) * (1 + dive * 6);
  camBegin(960, lerp(560, 720, ease(seg(lt, 0, dur - .4))), z);
  popStage(t, { a: NM.cyan, b: NM.mint, c: NM.butter, sparks: 5 });
  if (o.who === 'human') human(1340, 860, 20, { aL: .2, aR: .4, eyes: 'wide', mouth: 'o', handL: s => { push(); rotate(-.3); rbox(-s * .6, -s * .5, s * 2.6, s, '#4A5268', { r: s * .2 }); pop(); paint([[s * 2, -s * .6], [s * 7, -s * 2.4], [s * 7, s * 2.4], [s * 2, s * .6]], { fill: NM.butter, fillOp: 70, bleed: .1, ink: null }); } });
  clawd(960, 860, 38, { eyes: open > .5 ? 'happy' : 'normal', mouth: singMouth(t, 'smile'), aL: 1.1 * open, aR: .3, draw: chestDoor(open), blush: true });
  if (open > .3) glow(960, 860 - 3.6 * 38, 260 * open, 160 * open, NM.butter, 90);
  camEnd();
  if (dive > 0) flash(dive, NM.butter);
}

// Inside Clawd: tiny researchers with magnifying glasses wander between the glowing nodes.
// o.v: 'nodes' | 'library' | 'bridge' | 'heart'
function insideShot(t, lt, dur, o = {}) {
  const come = 1 - easeOut(seg(lt, 0, .35));
  camBegin(960 + lt * 30, 540, 1 + lt * .03);
  const labels = o.v === 'library' ? { 2: 'cartas', 5: 'recetas', 9: 'poemas', 13: 'código', 17: 'diarios' } : o.v === 'bridge' ? { 6: 'puente' } : o.v === 'heart' ? { 11: '?' } : { 3: '?', 8: '?', 15: '?' };
  insideWorld(t, { labels, tint: o.v === 'heart' ? NM.hot : NM.grape });
  if (o.v === 'library') for (let i = 0; i < 9; i++) { const x = 180 + i * 200, y = 260 + (i % 3) * 210 + wob(t, .2, i) * 20; push(); translate(x, y); rotate(wob(t, .15, i) * .3); rbox(-40, -55, 80, 110, [NM.pink, NM.cyan, NM.butter, NM.lime][i % 4], { r: 6, sw: .8 }); ln([[-28, -30], [28, -30]], .5); ln([[-28, -10], [20, -10]], .5); pop(); }
  if (o.v === 'bridge') { const [x, y] = NODES[6]; glow(x, y, 300, 200, '#D9533C', 120); push(); translate(x, y); scale(.18 + .03 * pulse(t, 4)); goldenGate(-600, 600, 60, 1, { water: false }); pop(); }
  if (o.v === 'heart') { const [x, y] = NODES[11]; glow(x, y, 240, 240, NM.hot, 110); paint(heartPts(x, y, 70 * (1 + .1 * pulse(t, 5))), { wash: NM.pink, ink: PAL.ink, sw: 1 }); title('?', x, y, 80, PAL.cream); }
  for (let i = 0; i < 3; i++) {
    const x = 380 + i * 560 + Math.sin(t * .7 + i * 2) * 140, ph = t * 1.4 + i;
    human(x, 900 - i * 40, 13, { walk: ph, flip: Math.cos(t * .7 + i * 2) < 0, aR: .3, handR: holdLupa(1.7), eyes: 'wide', coat: PAL.cream });
  }
  camEnd();
  if (come > 0) flash(come, NM.butter);
}

// "¡Compruébalo!": a rubber stamp slams down on every sung "Compruébalo".
function stampShot(t, lt, dur, o = {}) {
  const t0 = t - lt, hits = hitsOf(/compru/i, t0 - .3, t0 + dur + .05), h = lastHit(hits, t + .25);
  const age = h == null ? -1 : t - h, [sx, sy] = shakeXY(t, age > 0 ? 16 * Math.exp(-age * 8) : 0);
  camBegin(960 + sx, 540 + sy, 1);
  paint(rectPts(-300, -300, W + 600, H + 600), { wash: o.bg || NM.lime, washOp: 255, ink: null });
  for (let i = 0; i < 18; i++) spark4((i * 263) % 1900 + 40, (i * 151) % 900 + 60, 18, PAL.cream, t * (i % 2 ? 1 : -1), .5);
  push(); translate(960, 520); rotate(.03);
  rbox(-620, -380, 1240, 760, PAL.cream, { r: 16, sw: 1.6 });
  for (let i = 0; i < 9; i++) ln([[-560, -300 + i * 75], [560, -300 + i * 75]], .4, NM.cyan);
  pop();
  if (o.check) o.check.forEach((txt, i) => { const y = 250 + i * 110, on = t > t0 + .25 + i * (dur - .5) / o.check.length; rbox(470, y - 36, 72, 72, PAL.cream, { r: 10 }); label(txt, 820, y, 54, PAL.ink, { align: 'left' }); if (on) ln([[480, y], [505, y + 26], [560, y - 40]], 2.4, NM.green); });
  hits.forEach((ht, i) => { if (t - ht > -.3) stamp([960, 1000, 920][i % 3] + (i % 2 ? 160 : -120), [430, 600, 480][i % 3], i % 2 ? .95 : 1.1, '¡COMPRUÉBALO!', t - ht, { rot: i % 2 ? .1 : -.12, col: i % 2 ? NM.hot : NM.green }); });
  camEnd();
}

// "y te lo digo sin pestañear...": extreme close-up, unblinking stare, the stopwatch counts zero blinks.
function stareShot(t, lt, dur, o = {}) {
  camBegin(960, 560, 2.5 + lt * .12);
  paint(rectPts(-300, -300, W + 600, H + 600), { wash: o.bg || NM.ice, washOp: 255, ink: null });
  clawd(960, 820, 40, { eyes: 'normal', mouth: singMouth(t, 'flat'), noShadow: true, seed: 99 });
  camEnd();
  // eye-shine sparkles and a stopwatch in screen space
  push(); translate(1600, 260); rotate(.08);
  bead(0, 0, 130, PAL.cream, { sw: 1.6 }); bead(0, -150, 22, NM.hot, { sw: 1 });
  const a = lt * 2.4; ln([[0, 0], [Math.sin(a) * 100, -Math.cos(a) * 100]], 1.4, NM.red);
  pop();
  title('PARPADEOS: 0', 1600, 440, 46, NM.hot);
  if (lt > dur - .7) emote('sweat', 1250, 260, 26, seg(lt, dur - .7, dur - .4));
}

// "¡si no tengo ni pestañas!": v 1 = fake eyelashes pop on and slide off; v 2 = the browser tabs flap like lashes.
function lashShot(t, lt, dur, o = {}) {
  if (o.v === 2) {
    camBegin(960, 470, 1.15);
    paint(rectPts(-300, -300, W + 600, H + 600), { wash: NM.butter, washOp: 255, ink: null });
    browserWin(220, 120, 1480, 760, t, { tabs: ['Pestaña 1', 'Pestaña 2', 'Pestaña 3'], active: 1, flap: ease(seg(lt, .1, .4)) });
    clawd(960, 820, 30, { eyes: 'happy', mouth: singMouth(t, 'grin'), aL: 1.4, aR: .2, blush: true });
    camEnd();
    sfx('¡FLAP FLAP!', 1500, 900, 64, NM.hot, lt - .2, { life: 1.4 });
    return;
  }
  camBegin(960, 470, 2.4);
  paint(rectPts(-300, -300, W + 600, H + 600), { wash: NM.pink, washOp: 255, ink: null });
  const on = backOut(seg(lt, .05, .3)), off = easeIn(seg(lt, dur * .55, dur));
  clawd(960, 820, 40, { eyes: 'happy', mouth: singMouth(t, 'grin'), noShadow: true, blush: true,
    draw: (u, sw) => { if (on < .05) return; for (const ex of [-2.5, 2.5]) for (let k = 0; k < 5; k++) { const x = ex * u + (k - 2) * .45 * u, y = -7.6 * u + off * 7 * u; ln([[x, y], [x + (k - 2) * .3 * u, y - 1.8 * u * on]], sw * 1.4, PAL.ink, .3); } } });
  camEnd();
  sfx('¡PLIC!', 1350, 260, 90, NM.hot, lt - .05, { life: 1.8 });
}

// "¡Ups!": Clawd covers its face, blushing.
function upsShot(t, lt, dur, o = {}) {
  camBegin(960, 540, 1.3 - lt * .1);
  paint(rectPts(-300, -300, W + 600, H + 600), { wash: o.bg || NM.butter, washOp: 255, ink: null });
  for (let i = 0; i < 10; i++) { const a = i / 10 * TAU; ln([[960 + Math.cos(a) * 300, 560 + Math.sin(a) * 300], [960 + Math.cos(a) * 700, 560 + Math.sin(a) * 700]], 2, PAL.cream); }
  clawd(960, 820, 34, { eyes: 'closed', mouth: 'wobble', aL: 1.6, aR: 1.6, blush: true, sq: .06 * Math.sin(lt * 30), emote: 'sweat', emoteK: seg(lt, 0, .2) });
  camEnd();
  title('¡UPS!', 960, 230, 150 * backOut(seg(lt, 0, .25)), NM.hot, { rot: -.08 });
}
