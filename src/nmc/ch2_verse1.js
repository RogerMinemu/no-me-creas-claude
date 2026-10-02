// ch2_verse1.js: 19.3–43.85. The over-eager assistant: flattery, homework, poems, guessed words, an invented book,
// the unblinking stare and the eyelashes it doesn't have.
(() => {
  const coats = [NM.cyan, NM.lime, NM.butter, NM.pink, NM.lilac, NM.mint];

  // "¡Qué pregunta tan buena! (se lo digo a todos)": a queue of people, each asks anything, each gets the same applause.
  function preguntaBuena(t, lt, dur) {
    const pan = ease(seg(lt, 1.7, dur));
    camBegin(lerp(860, 1180, pan), 520, lerp(1.08, .92, pan));
    room(t, { wall: NM.ice, dots: PAL.cream, floor: '#B9A0D6' });
    const qs = ['¿2+2?', '¿Hola?', '¿Qué hora es?', '¿Y tú?', '¿Me ayudas?', '¿Pizza?'];
    for (let i = 0; i < 6; i++) {
      const x = 760 + i * 300, asked = lt > .3 + i * .28;
      human(x, 870, 14, { coat: coats[i], eyes: asked ? 'star' : 'dot', mouth: asked ? 'grin' : 'o', aL: asked ? 1.2 : -1.2, blush: asked });
      if (lt > i * .2) bubble(x + 40, 520, 210, 84, { col: PAL.cream, txt: qs[i], size: 34, tail: [x + 10, 640] });
      if (asked) { const s = backOut(seg(lt, .3 + i * .28, .5 + i * .28)); push(); translate(x, 395); rotate((hash(i) - .5) * .2); scale(s); rbox(-130, -40, 260, 80, NM.butter, { r: 18 }); pop(); label('¡BUENÍSIMA!', x, 397, 34 * s, NM.hot, { rot: (hash(i) - .5) * .2 }); }
    }
    for (const h of hitsOf(/buena|todos/i, 19, 22.3)) confetti(t, h, 420, 560, 22);
    clawd(420, 870, 26, { eyes: 'happy', mouth: singMouth(t, 'grin'), blush: true, aL: 1.3 + .4 * pulse(t, 5), aR: 1.3 + .4 * pulse(t + .2, 5), dy: -pulse(t, 4) * .6 });
    camEnd();
  }

  // "¡Tienes toda la razón! (aunque no la tengas)": 2 + 2 = 5 on the blackboard gets a big green tick.
  function razon(t, lt, dur) {
    camBegin(960, 520, 1.05 + lt * .03);
    room(t, { wall: NM.mint, floor: '#C99A7A' });
    rbox(330, 120, 1260, 560, '#2F5C4E', { r: 16, sw: 2, fill: '#1F3F36', fillOp: 70 });
    rbox(310, 100, 1300, 600, '#8C5E46', { op: 0, sw: 2.2, r: 18 });
    title('2 + 2 = 5', 960, 360, 190, PAL.cream, { stroke: null, font: '400 190px "Permanent Marker", cursive' });
    human(1460, 880, 15, { coat: NM.lime, eyes: 'closed', mouth: 'grin', aR: 1, blush: true, handR: s => rbox(-s * .3, -s * .3, s * .9, s * .5, PAL.cream, { r: 4, sw: .5 }) });
    clawd(560, 880, 24, { eyes: 'happy', mouth: singMouth(t, 'grin'), aL: .4, aR: .9 + .3 * pulse(t, 5), dy: -Math.abs(Math.sin(bpOf(t) * Math.PI)) * .5 });
    const h = hitsOf(/razón/i, 22.3, 24.7)[0] ?? 23.4;
    stamp(1000, 560, .7, '¡CORRECTO!', t - h, { rot: -.1 });
    camEnd();
    // the backing vocal: a tiny honest red cross blinks in the corner
    const back = hitsOf(/tengas/i, 22.3, 24.7)[0] ?? 24;
    if (t > back - .5) { const k = backOut(seg(t, back - .5, back - .2)); title('✗', 1720, 160, 120 * k, NM.red, { rot: .2 }); label('(no)', 1720, 250, 40 * k, NM.red); }
  }

  // "Te hago los deberes, te arreglo el código": homework on the left, a squashed bug on the right.
  function deberes(t, lt, dur) {
    const code = hitsOf(/código/i, 24.6, 27.3)[0] ?? 26.4, toCode = ease(seg(t, code - .45, code));
    camBegin(lerp(760, 1160, toCode), 520, 1.06);
    room(t, { wall: NM.butter, dots: PAL.cream });
    // homework notebook with ticks appearing on the beat
    push(); translate(560, 470); rotate(-.05); rbox(-300, -300, 600, 600, PAL.cream, { r: 10, sw: 1.4 }); pop();
    title('DEBERES', 560, 230, 56, NM.hot, { rot: -.05 });
    for (let i = 0; i < 5; i++) { const y = 320 + i * 85, on = lt > .2 + i * .25; ln([[340, y], [700, y + jit(2)]], .5, NM.cyan); if (on) { ln([[360, y - 8], [380, y + 14], [420, y - 30]], 2, NM.green); label(['x = 4', 'Napoleón', 'H₂O', '√9 = 3', 'fin :)'][i], 560, y - 18, 34, PAL.ink); } }
    // code window and the bug
    rbox(1000, 200, 620, 460, NM.night, { r: 18, sw: 1.4 });
    for (let i = 0; i < 6; i++) ln([[1050, 270 + i * 60], [1050 + 120 + hash(i) * 360, 270 + i * 60]], 2, [NM.cyan, NM.pink, NM.lime][i % 3]);
    const squash = seg(t, code, code + .08);
    if (squash < 1) { push(); translate(1300, 450); bead(0, 0, 34, '#5B3A29'); for (const s of [-1, 1]) for (let k = 0; k < 3; k++) ln([[s * 20, -15 + k * 15], [s * 52, -25 + k * 18]], .9); pop(); }
    else { paint(ellPts(1300, 460, 70, 18, 16), { wash: '#5B3A29', ink: PAL.ink, sw: .8 }); sfx('¡BUG!', 1300, 330, 70, NM.lime, t - code, { life: 1 }); }
    const hx = lerp(560, 1300, toCode);
    clawd(hx, 880, 22, { eyes: 'narrow', mouth: singMouth(t, 'flat'), aL: .3, aR: 1.2 + .8 * pulse(t, 8), dy: -.3,
      armR: (u, sw) => { push(); rotate(-1); rbox(-.3 * u, -2.6 * u, .6 * u, 2.6 * u, '#8C5E46', { r: 2 }); rbox(-1.1 * u, -3.4 * u, 2.2 * u, .9 * u, toCode > .5 ? '#9AA3B5' : NM.butter, { r: 4 }); pop(); } });
    camEnd();
  }

  // "te escribo un poema y te paso recetas": a quill writes hearts; then a pot steams with a recipe card.
  function poema(t, lt, dur) {
    const rec = hitsOf(/recetas/i, 27.1, 29.5)[0] ?? 28.5;
    camBegin(960, 520, 1.04);
    room(t, { wall: NM.blush, dots: PAL.cream, floor: '#C99A7A' });
    // scroll
    const un = ease(seg(lt, 0, .6));
    rbox(260, 160, 560, 120 + 480 * un, PAL.cream, { r: 30, sw: 1.4 });
    title('Oda a tu pregunta', 540, 230, 40, NM.grape, { stroke: null });
    for (let i = 0; i < 5; i++) if (lt > .3 + i * .2) { ln([[320, 320 + i * 70], [320 + 380 * clamp((lt - .3 - i * .2) * 4), 320 + i * 70]], 1, PAL.ink, .2); paint(heartPts(760, 320 + i * 70, 16), { wash: NM.hot, ink: null }); }
    clawd(940, 880, 22, { eyes: 'closed', mouth: singMouth(t, 'smile'), blush: true, hat: 'wizard', aL: 1.2 + .2 * wob(t, 3), aR: .2 });
    // pot + recipe
    const k = backOut(seg(t, rec - .1, rec + .25));
    if (k > .02) {
      push(); translate(1440, 800); scale(k);
      rbox(-170, -160, 340, 170, '#7D8596', { r: 30, sw: 1.4 }); rbox(-200, -180, 400, 40, '#9AA3B5', { r: 16 });
      for (let i = 0; i < 3; i++) { const sx = -80 + i * 80, ph = t * 2 + i; ln([[sx, -200], [sx + 20 * Math.sin(ph), -280], [sx - 10 * Math.sin(ph), -360]], 1.2, PAL.cream, .6); }
      pop();
      push(); translate(1500, 320); rotate(.08 * Math.sin(t * 2)); scale(k); rbox(-170, -120, 340, 240, PAL.cream, { r: 10 }); pop();
      title('RECETA', 1500, 250, 44 * k, NM.hot, { stroke: null }); label('1 taza de cariño', 1500, 320, 28 * k); label('2 pizcas de datos', 1500, 365, 28 * k);
    }
    camEnd();
  }

  // "Solo adivino la siguiente palabra": a fortune teller pulls the next word out of the crystal ball.
  function adivino(t, lt, dur) {
    const pal = hitsOf(/palabra/i, 29.4, 32)[0] ?? 30.9;
    camBegin(960, 500, 1.05 + lt * .04);
    paint(rectPts(-300, -300, W + 600, H + 600), { wash: NM.grape, washOp: 255, ink: null });
    glow(960, 420, 700, 400, NM.lilac, 120);
    for (let i = 0; i < 12; i++) spark4(120 + hash(i * 5) * 1680, 80 + hash(i * 9) * 500, 14, NM.butter, t, .5);
    const words = ['la', 'que', 'tu', 'gato', 'sí', 'y', 'luna', 'de'];
    words.forEach((w, i) => { const a = t * .9 + i * TAU / words.length; tile(960 + Math.cos(a) * 520, 430 + Math.sin(a) * 200, 86, w, [NM.butter, NM.mint, NM.pink, NM.cyan][i % 4], Math.sin(a) * .2); });
    // the seer sits behind a draped table; the crystal ball glows to the right
    clawd(820, 760, 24, { hat: 'hood', eyes: 'narrow', mouth: singMouth(t, 'flat'), aL: .5 + .2 * wob(t, 2), aR: .2 - .25 * wob(t, 2), noShadow: true });
    paint([[440, 690], [1480, 690], [1540, 960], [380, 960]], { wash: NM.hot, washOp: 255, fill: '#B23A6A', fillOp: 70, tex: .7, ink: PAL.ink, sw: 1.4 });
    for (let i = 0; i < 9; i++) bead(470 + i * 125, 700, 14, NM.butter, { sw: .6 });
    rbox(1090, 640, 180, 50, '#8C5E46', { r: 14 });
    glow(1180, 540, 200, 200, NM.cyan, 150);
    bead(1180, 540, 120, mixCol(NM.ice, NM.cyan, .35 + .2 * Math.sin(t * 3)), { sw: 1.5 });
    const sw_ = []; for (let i = 0; i < 18; i++) { const a = i * .55 + t * 3, r = i * 5.5; sw_.push([1180 + Math.cos(a) * r, 540 + Math.sin(a) * r]); }
    ln(sw_, .8, PAL.cream, .6);
    ln([[1120, 480], [1150, 455]], 1.2, PAL.cream);
    const k = backOut(seg(t, pal - .15, pal + .25));
    if (k > .02) tile(1180, lerp(540, 250, k), 150 * k, 'palabra', NM.butter, -.05);
    camEnd();
  }

  // "pero la digo con tanta, tanta gracia...": a deep bow, roses, applause with heart eyes.
  function gracia(t, lt, dur) {
    camBegin(960, 540, 1 + lt * .02);
    popStage(t, { a: NM.night, b: NM.hot, c: NM.lilac, sparks: 6, spots: [[960, NM.butter]] });
    const bow = Math.sin(seg(lt, .5, 1.7) * Math.PI);
    clawd(960, 820, 32, { eyes: 'closed', mouth: 'smile', blush: true, rot: bow * .35, aL: -.6 * bow + .2, aR: 1.2 - bow, sq: bow * .05 });
    for (let i = 0; i < 6; i++) { const ft = .4 + i * .3, a = lt - ft; if (a > 0) { const x = 300 + i * 260 + a * 120 * (i % 2 ? 1 : -1), y = 1050 - a * 900 + a * a * 800; if (y < 900) { push(); translate(x, Math.min(y, 860)); rotate(a * 5); ln([[0, 0], [0, 60]], 1, NM.green); pop(); bead(x, Math.min(y, 860), 22, NM.red, { sw: .7 }); } } }
    for (let i = 0; i < 7; i++) human(150 + i * 270, 1060, 10, { back: true, aL: .8 + .6 * pulse(t + i * .1, 6), aR: .8 + .6 * pulse(t + i * .15, 6), coat: coats[i % 6] });
    camEnd();
    sfx('¡BRAVO!', 1520, 260, 90, NM.butter, lt - .6, { life: 1.6 });
  }

  // "A veces alucino,": the world turns into swirling candy rings and floating impossible things.
  function alucino(t, lt, dur) {
    camBegin(960, 540, 1 + lt * .1, lt * .15);
    for (let i = 10; i > 0; i--) paint(ellPts(960, 540, i * 150 + 40 * Math.sin(t * 3 + i), i * 150 + 40 * Math.sin(t * 3 + i), 32), { wash: [NM.pink, NM.cyan, NM.butter, NM.lilac, NM.mint][i % 5], washOp: 255, ink: null });
    const fish = (x, y, s) => { push(); translate(x, y); scale(s); paint(ellPts(0, 0, 70, 38, 18), { wash: NM.cyan, ink: PAL.ink, sw: 1 }); paint([[60, 0], [110, -36], [110, 36]], { wash: NM.cyan, ink: PAL.ink, sw: 1 }); bead(-36, -8, 8, PAL.ink, { ink: null }); ln([[0, -40], [0, -120]], 1); paint([[-70, -120], [0, -170], [70, -120]], { wash: NM.hot, ink: PAL.ink, sw: 1, curv: .5 }); pop(); };
    fish(420 + lt * 200, 300 + wob(t, .8) * 30, 1); fish(1500 - lt * 160, 700 + wob(t, .6, .3) * 30, .8);
    clawd(960, 820, 30, { eyes: 'swirl', mouth: singMouth(t, 'wobble'), aL: 1 + .5 * wob(t, 2), aR: 1 - .5 * wob(t, 2), rot: .1 * wob(t, 1.5) });
    camEnd();
  }

  // "te invento un libro y su autor,": a book poofs into existence, complete with a citation.
  function libro(t, lt, dur) {
    camBegin(960, 520, 1.05);
    room(t, { wall: NM.lilac, dots: NM.blush, floor: '#9E86C4' });
    const k = backOut(seg(lt, .1, .55));
    if (lt < .6) for (let i = 0; i < 10; i++) { const a = i / 10 * TAU, r = 120 + lt * 500; glow(1100 + Math.cos(a) * r, 450 + Math.sin(a) * r * .6, 50, 50, PAL.cream, 120 * (1 - lt / .6)); }
    push(); translate(1100, 450); rotate(-.08 + .03 * wob(t, 1)); scale(k);
    rbox(-230, -300, 460, 600, NM.hot, { r: 14, sw: 1.6 }); rbox(-230, -300, 50, 600, '#B23A6A', { r: 8 });
    pop();
    if (k > .3) { title('EL LIBRO', 1110, 300, 62 * k, NM.butter, { rot: -.08 }); title('QUE NO', 1110, 380, 62 * k, NM.butter, { rot: -.08 }); title('EXISTE', 1110, 460, 62 * k, NM.butter, { rot: -.08 }); label('por el Dr. Inventado (2019)', 1110, 620, 30 * k, PAL.cream, { rot: -.08 }); }
    clawd(500, 880, 24, { eyes: 'happy', mouth: singMouth(t, 'grin'), aR: 1.1, aL: .3, blush: true, emote: 'spark', emoteK: seg(lt, .4, .7) });
    human(1560, 880, 14, { coat: NM.butter, eyes: 'star', mouth: 'o', aL: .5, handL: s => rbox(-s * .2, -s * .9, s * 1.2, s * 1.6, PAL.cream, { r: 3, sw: .5 }) });
    camEnd();
    title('[1]', 1350, 170, 60 * backOut(seg(lt, .9, 1.2)), NM.cyan, { rot: .1 });
  }

  chapter('verse1', 19.3, 43.85, [
    [19.3, preguntaBuena], [22.38, razon], [24.66, deberes], [27.2, poema], [29.46, adivino], [31.94, gracia],
    [34.38, alucino], [35.28, libro], [37.2, (t, lt, d) => stareShot(t, lt, d, { bg: NM.ice })], [40.92, (t, lt, d) => lashShot(t, lt, d, { v: 1 })],
    [43.1, (t, lt, d) => upsShot(t, lt, d, { bg: NM.butter })]
  ]);
})();
