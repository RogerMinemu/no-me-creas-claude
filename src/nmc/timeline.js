// timeline.js: chapter dispatch, hyperpop stripe wipes and word-level karaoke for "No me creas".
const LY = window.SONG_CONFIG.lyrics, LW = window.SONG_WORDS.lines;
const WIPES = [19.3, 62.9, 100.6, 133.5, 171.0];
const WIPE_TR = .32;

function drawWorld(t) {
  const ch = CH.find(c => t >= c.start && t < c.end);
  if (!ch) placeholder(t);
  else {
    let i = 0; while (i + 1 < ch.shots.length && t >= ch.shots[i + 1][0]) i++;
    const t0 = ch.shots[i][0], end = i + 1 < ch.shots.length ? ch.shots[i + 1][0] : ch.end;
    ch.shots[i][1](t, t - t0, end - t0);
    if (CAM) camEnd();
  }
  flushLetters();
  WIPES.forEach((b, j) => { if (Math.abs(t - b) < WIPE_TR) stripeWipe((t - (b - WIPE_TR)) / (2 * WIPE_TR), j); });
  flushLetters();
  karaoke(t);
}

function placeholder(t) {
  popStage(t);
  title('(sin pintar)', 960, 420, 80, PAL.cream);
  dancer(960, 900, 16, 'bounce', t, { mouth: singMouth(t) });
}

// Diagonal candy stripes slide in, cover the cut at p = .5, and slide out the other side.
const STRIPES = [NM.pink, NM.lilac, NM.cyan, NM.butter, NM.mint, NM.hot];
function stripeWipe(p, idx) {
  const n = 7, bw = 420;
  push(); translate(W / 2, H / 2); rotate(-.5); translate(-W / 2, -H / 2);
  for (let i = 0; i < n; i++) {
    const d = (i % 3) * .07, q = p < .5 ? easeOut(clamp((p * 2 - d) / (1 - d))) : ease(clamp(((p - .5) * 2 - d) / (1 - d)));
    const y0 = -560 + i * (H + 1120) / n, h = (H + 1120) / n + 6;
    const x0 = p < .5 ? -900 : lerp(-900, W + 900, q), x1 = p < .5 ? lerp(-900, W + 900, q) : W + 900;
    if (x1 - x0 < 20) continue;
    const col = STRIPES[(i + idx) % STRIPES.length];
    paint([[x0, y0], [x1, y0], [x1 + 60, y0 + h / 2], [x1, y0 + h], [x0, y0 + h]], { wash: col, washOp: 255, fill: PAL.cream, fillOp: 40, tex: .6, bleed: .03, ink: PAL.ink, sw: 1.2 });
    if (x1 - x0 > bw) spark4(x1 - 80, y0 + h / 2, 34, PAL.cream, p * 6, .8);
  }
  pop();
}

// ---------- karaoke ----------
const KFONT = '800 50px "Shantell Sans", sans-serif';
function karaoke(t) {
  const i = LY.findIndex(l => t >= l[0] - .1 && t < l[1] + .15); if (i < 0) return;
  const [a, b, txt] = LY[i];
  outX.font = KFONT;
  const tw = Math.min(1700, outX.measureText(txt).width), grow = easeOut((t - (a - .1)) / .16) * (1 - ease((t - (b + .03)) / .12));
  if (grow < .02) return;
  const w = (tw + 120) * grow, x0 = 960 - w / 2, y0 = 980;
  const pts = [[x0 + jit(6), y0 + jit(4)], [x0 + w / 2, y0 - 6 + jit(4)], [x0 + w + jit(6), y0 + jit(4)], [x0 + w + 18, y0 + 42], [x0 + w + jit(6), y0 + 84 + jit(4)], [x0 + w / 2, y0 + 90 + jit(4)], [x0 + jit(6), y0 + 84 + jit(4)], [x0 - 18, y0 + 42]];
  paint(pts, { wash: NM.night, washOp: 230, fill: NM.grape, fillOp: 80, tex: .7, border: .4, ink: PAL.ink, sw: 1 });
  KARAOKE = { i, a, b, txt, grow };
}
function drawKaraokeText(c) {
  if (!KARAOKE || KARAOKE.grow < .85) return;
  const { i, txt } = KARAOKE, t = T, words = LW[i] || txt.split(' ').map(text => ({ text, start: KARAOKE.a, end: KARAOKE.b }));
  c.save(); c.font = KFONT; c.textBaseline = 'middle'; c.textAlign = 'left';
  const sp = c.measureText(' ').width, ws = words.map(w => c.measureText(w.text).width);
  const total = ws.reduce((p, q) => p + q, 0) + sp * (words.length - 1), sc = Math.min(1, 1700 / total);
  c.translate(960, 1022); c.scale(sc, sc);
  let x = -total / 2, back = false;
  words.forEach((w, j) => {
    if (w.text.startsWith('(')) back = true;
    const f = clamp((t - w.start) / Math.max(.06, w.end - w.start)), on = t >= w.start - .03 && t <= w.end + .05;
    const base = back ? '#F7B9D2' : PAL.cream, hi = back ? NM.hot : NM.butter;
    const bump = on ? 1 + .12 * Math.sin(f * Math.PI) : 1;
    c.save(); c.translate(x + ws[j] / 2, 0); c.scale(bump, bump); c.translate(-ws[j] / 2, 0);
    c.fillStyle = base; c.fillText(w.text, 0, 0);
    if (f > 0) { c.save(); c.beginPath(); c.rect(-2, -40, ws[j] * f + 2, 80); c.clip(); c.fillStyle = hi; c.fillText(w.text, 0, 0); c.restore(); }
    c.restore();
    if (w.text.endsWith(')') || w.text.endsWith(')!') ) back = false;
    x += ws[j] + sp;
  });
  c.restore();
}
