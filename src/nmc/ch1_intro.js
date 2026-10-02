// ch1_intro.js: 0–19.3. A browser window opens, someone asks for a message to humanity, and Clawd answers by singing.
(() => {
  const BG = t => {
    paint(rectPts(-300, -300, W + 600, H + 600), { wash: NM.lilac, washOp: 255, ink: null });
    glow(960, 500, 900, 520, NM.pink, 130);
    for (let i = 0; i < 16; i++) spark4(60 + hash(i * 2.7) * 1800, 40 + hash(i * 6.1) * 920 + wob(t, .1, i) * 14, 10 + hash(i * 1.3) * 18, [PAL.cream, NM.butter, NM.mint][i % 3], t * (i % 2 ? .7 : -.7), .5);
  };
  const WX = 260, WY = 110, WW = 1400, WH = 800;
  const userQ = (t, lt, k = 1) => bubble(1280, 300, 640, 120, { k, col: NM.ice, txt: 'Claude, ¿un mensaje para la humanidad?', size: 30, tail: [1500, 380] });

  function winOpen(t, lt, dur) {
    BG(t);
    const k = backOut(seg(lt, .05, .55));
    if (k < .02) return;
    camBegin(960, 510, k);
    browserWin(WX, WY, WW, WH, t, { tabs: ['Nueva conversación'] });
    if (lt > .45) userQ(t, lt, backOut(seg(lt, .45, .8)));
    const h = hitsOf(/creas/i, 0, 2)[0] ?? 1.1, a = backOut(seg(t, h - .1, h + .25));
    bubble(640, 600, 520, 140, { k: a, col: NM.pink, txt: "¡No me creas!", size: 56, tail: [460, 720] });
    // blinking cursor in the input row
    rbox(WX + 60, WY + WH - 110, WW - 120, 70, PAL.cream, { r: 30, sw: 1 });
    if (frac(t * 1.6) < .55) ln([[WX + 100, WY + WH - 95], [WX + 100, WY + WH - 55]], 1.4);
    camEnd();
  }

  function popUp(t, lt, dur) {
    BG(t);
    camBegin(960, 520, 1 + lt * .03);
    browserWin(WX, WY, WW, WH, t, { tabs: ['Nueva conversación'] });
    userQ(t, lt);
    const up = backOut(seg(lt, 0, .4)), y = lerp(1150, 840, up);
    clawd(640, y, 26, { eyes: lt < .5 ? 'spark' : 'happy', mouth: singMouth(t), aL: .4, aR: 1.4 + .3 * Math.sin(t * 12), blush: true });
    const h = hitsOf(/creas/i, 2.5, 4.4)[0] ?? 3.5, a = backOut(seg(t, h - .1, h + .25));
    bubble(760, 420, 500, 130, { k: a, col: NM.pink, txt: "¡No me creas!", size: 54, tail: [680, 560] });
    camEnd();
  }

  // The chant echoes as a pile of chat bubbles, while the camera pushes into the page.
  function stack(t, lt, dur) {
    BG(t);
    const push_ = ease(seg(lt, .8, dur)), z = lerp(1.03, 1.35, push_);
    camBegin(lerp(960, 900, push_), lerp(520, 540, push_), z);
    browserWin(WX, WY, WW, WH, t, { tabs: ['Nueva conversación'] });
    const hits = [...hitsOf(/creas/i, 4.9, 6.3), 6.8, 7.4, 8.0, 8.6, 9.2];
    hits.forEach((h, i) => {
      const a = backOut(seg(t, h - .05, h + .25)); if (a < .02) return;
      const x = 760 + (i % 3) * 330 + (i % 2) * 40, y = 330 + Math.floor(i / 3) * 165 + (i % 2) * 30;
      bubble(x, y, 400, 110, { k: a, col: [NM.pink, NM.cyan, NM.butter, NM.mint, NM.lilac][i % 5], txt: '¡No me creas!', size: 44, tail: [x - 120, y + 110] });
    });
    dancer(640, 860, 26, 'bounce', t, { eyes: 'happy', mouth: singMouth(t), blush: true });
    camEnd();
  }

  // Title card: NO ME CREAS drops in letter by letter on the beat; Clawd hops along the letters.
  function titleCard(t, lt, dur) {
    paint(rectPts(-300, -300, W + 600, H + 600), { wash: NM.hot, washOp: 255, ink: null });
    for (let i = 0; i < 14; i++) { const a0 = t * .2 + i * TAU / 14; paint([[960, 520], [960 + Math.cos(a0) * 1900, 520 + Math.sin(a0) * 1900], [960 + Math.cos(a0 + .12) * 1900, 520 + Math.sin(a0 + .12) * 1900]], { wash: i % 2 ? NM.pink : NM.butter, washOp: 120, ink: null }); }
    const [sx, sy] = shakeXY(t, 6 * pulse(t, 8));
    camBegin(960 + sx, 520 + sy, 1 + .03 * pulse(t, 6));
    const L = 'NO ME CREAS'.split(''), b0 = Math.ceil(bpOf(t - lt));
    let x = 300;
    const xs = L.map(c => { const w = c === ' ' ? 70 : 140; const cx = x + w / 2; x += w; return cx; });
    L.forEach((c, i) => {
      if (c === ' ') return;
      const tb = OFF + (b0 + i * .5) * BEAT, a = t - tb; if (a < 0) return;
      const drop = 1 - backOut(a * 4), y = 470 - drop * 600 - 18 * pulse(t + i * .05, 7);
      title(c, xs[i], y, 190, [NM.butter, PAL.cream, NM.mint, NM.cyan][i % 4], { rot: (hash(i) - .5) * .2 });
    });
    // Clawd hops from letter to letter on the beat
    const bp = bpOf(t), j = clamp(Math.floor(bp - b0) % 11, 0, 10), f = frac(bp);
    const jx = lerp(xs[j], xs[Math.min(10, j + 1)], ease(f)), jy = 385 - Math.sin(f * Math.PI) * 150;
    if (lt > .6) clawd(jx, jy, 15, { eyes: 'happy', mouth: 'grin', sq: f < .15 ? .2 : 0, noShadow: true, aL: 1.3, aR: 1.3 });
    const s = backOut(seg(lt, 2.2, 2.8));
    if (s > .02) { rbox(960 - 380 * s, 700 - 50 * s, 760 * s, 100 * s, NM.night, { r: 50 * s, sw: 1.2 }); title('una canción de Claude', 960, 700, 52 * s, PAL.cream, { stroke: null }); }
    camEnd();
  }

  // Stage reveal: the camera pulls back from the mic to the whole hyperpop stage; then the lights dip for the verse.
  function stageReveal(t, lt, dur) {
    const z = lerp(2.6, 1, easeOut(seg(lt, 0, 1.6))), dim = ease(seg(lt, 2.6, 4.6));
    camBegin(960, lerp(470, 540, seg(lt, 0, 1.6)), z);
    popStage(t, { spots: [[600, NM.butter], [1320, NM.cyan]] });
    for (const [x, s] of [[440, 2], [1480, 5]]) dancer(x, 830, 18, 'mix', t, { seed: s, hat: 'party', eyes: 'happy' });
    const wink = lt > 1.7 && lt < 2.4;
    star(960, 830, 36, t, { eyes: wink ? 'wink' : 'happy', mouth: singMouth(t, wink ? 'grin' : 'smile'), blush: true, style: lt < 2.4 ? 'hop' : 'sway' });
    camEnd();
    if (wink) spark4(1130, 420, 60 * backOut(seg(lt, 1.7, 1.95)), PAL.cream, t * 3);
    if (dim > 0) paint(rectPts(-60, -60, W + 120, H + 120), { wash: NM.night, washOp: 150 * dim, ink: null });
  }

  chapter('intro', 0, 19.3, [[0, winOpen], [2.62, popUp], [4.98, stack], [9.68, titleCard], [14.16, stageReveal]]);
})();
