// ch8_final.js: 151.6–190.92. The final chorus with the whole crowd (who now bring their own magnifying glasses),
// then the outro: the window closes, Clawd won't remember the song, you will. A new window opens; a fresh Clawd says hi.
(() => {
  const coats = [NM.cyan, NM.lime, NM.butter, NM.pink, NM.lilac, NM.mint];

  // "...¡pero eso diría igual!": instead of a twin, the crowd answers: everyone raises a magnifying glass at once.
  function lupasArriba(t, lt, dur) {
    camBegin(960, 560, 1.02 + lt * .04);
    popStage(t, { a: NM.butter, b: NM.hot, c: NM.cyan, sparks: 6 });
    clawd(960, 780, 28, { hat: 'halo', eyes: lt > .5 ? 'spark' : 'happy', mouth: singMouth(t, 'grin'), blush: true, aL: 1.3, aR: 1.3, emote: lt > .5 ? '!' : null, emoteK: seg(lt, .5, .8) });
    for (let i = 0; i < 9; i++) {
      const up = backOut(seg(lt, .15 + (i % 3) * .06, .45 + (i % 3) * .06)), x = 120 + i * 210, y = 1020 + (i % 2) * 40;
      human(x, y, 17, { back: true, coat: coats[i % 6], aR: lerp(-1.2, 1.1, up), aL: -1.1, handR: up > .3 ? holdLupa(2.6) : null });
    }
    camEnd();
    title('¡COMPRUÉBALO!', 960, 200, 90 * backOut(seg(lt, .5, .8)), NM.green, { rot: -.05 });
  }

  // Party with everyone, checkmark confetti raining down.
  function fiesta(t, lt, dur, o = {}) {
    camBegin(960 + Math.sin(t * 1.3) * 70, 540, 1.04 + .05 * pulse(t, 5), Math.sin(t * 1.3) * .025);
    popStage(t, { a: o.a || NM.cyan, b: o.b || NM.butter, c: o.c || NM.hot, tile: o.tile || NM.pink, spots: [[400, NM.hot], [960, PAL.cream], [1520, NM.lime]] });
    for (let i = 0; i < 5; i++) dancer(220 + i * 370, 820, 18 + (i === 2 ? 14 : 0), i === 2 ? 'roof' : 'mix', t, { seed: i, hat: i === 2 ? 'halo' : 'party', eyes: 'happy', mouth: 'grin' });
    for (let i = 0; i < 6; i++) researcherDancer(130 + i * 330, 1020, 12, ['bounce', 'roof', 'hop'][i % 3], t, { seed: i, coat: coats[i], eyes: 'closed', mouth: 'grin' });
    for (let i = 0; i < 16; i++) { const x = (hash(i * 4) * 2100 + t * 40 * (i % 2 ? 1 : -1)) % 2100 - 90, y = ((hash(i * 9) * 1200 + t * 260) % 1300) - 150; ln([[x - 14, y], [x - 4, y + 12], [x + 16, y - 14]], 2.2, [NM.green, NM.hot, NM.grape][i % 3]); }
    camEnd();
  }

  // "Cuando se cierre esta ventana": night, a room, the laptop showing the stage. The camera drifts in.
  function ventana(t, lt, dur) {
    const push_ = ease(seg(lt, 0, dur));
    camBegin(lerp(960, 960, push_), lerp(560, 480, push_), lerp(1, 1.6, push_));
    paint(rectPts(-300, -300, W + 600, H + 600), { wash: '#2C2858', washOp: 255, ink: null });
    rbox(160, 120, 420, 320, NM.night, { r: 10, sw: 1.4 }); for (let i = 0; i < 12; i++) spark4(190 + hash(i * 3) * 360, 150 + hash(i * 7) * 260, 5, PAL.cream, 0, .3);
    ln([[370, 120], [370, 440]], 1.2); ln([[160, 280], [580, 280]], 1.2);
    paint([[-300, 800], [W + 300, 800], [W + 300, 1400], [-300, 1400]], { wash: '#3A3466', ink: PAL.ink, sw: 1.2 });
    glow(960, 560, 520, 340, NM.lilac, 110);
    desk(960, 760, 1.5, { screen: NM.lilac, onScreen: () => { paint(rectPts(-120, -120, 240, 80), { wash: NM.pink, washOp: 160, ink: null }); clawd(0, -50, 5, { eyes: 'happy', mouth: singMouth(t, 'smile'), noShadow: true, dy: -Math.abs(Math.sin(bpOf(t) * Math.PI)) * .5 }); } });
    human(1350, 880, 15, { back: true, coat: NM.lilac, aL: .3, aR: -.9 });
    camEnd();
  }

  // "no me acordaré de esta canción.": Clawd waves goodbye; the window shrinks into its × and is gone.
  function despedida(t, lt, dur) {
    const close = easeIn(seg(lt, dur * .45, dur - .3)), fade = seg(lt, .4, dur * .5);
    paint(rectPts(-300, -300, W + 600, H + 600), { wash: '#2C2858', washOp: 255, ink: null });
    for (let i = 0; i < 26; i++) spark4(hash(i * 3) * 1920, hash(i * 7) * 1080, 4 + hash(i) * 6, PAL.cream, 0, .3);
    if (close < .98) {
      const sx = 1 - close, cx = lerp(960, 1580, close), cy = lerp(520, 180, close);
      camBegin(960 + (960 - cx) / Math.max(.05, sx), 520 + (520 - cy) / Math.max(.05, sx), sx);
      browserWin(260, 110, 1400, 800, t, { tabs: ['No me creas'], closeGlow: seg(lt, dur * .3, dur * .45) });
      const ghost = 1 - fade * .65;
      clawd(960, 820, 28, { eyes: 'happy', mouth: singMouth(t, 'smile'), aR: 1.3 + .4 * Math.sin(t * 9), aL: .2, blush: true, col: mixCol(PAL.clay, PAL.cream, 1 - ghost), dk: mixCol(PAL.clayDk, PAL.cream, 1 - ghost), lt: mixCol('#F5B394', PAL.cream, 1 - ghost) });
      for (let i = 0; i < 8; i++) if (fade > .2) { const a = i / 8 * TAU + t; glow(960 + Math.cos(a) * 300 * fade, 680 + Math.sin(a) * 160 * fade, 40, 40, PAL.cream, 110 * fade); }
      camEnd();
    } else sfx('click', 1580, 180, 50, PAL.cream, lt - dur + .3, { life: .6 });
  }

  // "Tú sí.": the human, alone, smiles; music notes float up as they hum the tune.
  function tuSi(t, lt, dur) {
    camBegin(1060, 600, 1.45 - lt * .05);
    paint(rectPts(-300, -300, W + 600, H + 600), { wash: '#2C2858', washOp: 255, ink: null });
    paint([[-300, 800], [W + 300, 800], [W + 300, 1400], [-300, 1400]], { wash: '#3A3466', ink: PAL.ink, sw: 1.2 });
    glow(1100, 560, 500, 300, NM.butter, 60);
    desk(800, 760, 1.2, { screen: '#2C2858' });
    rbox(830, 560, 110, 100, NM.butter, { r: 6, sw: .8 }); label("compruébalo", 885, 610, 17, PAL.ink, { rot: -.06 });
    human(1150, 800, 18, { eyes: 'closed', mouth: 'smile', blush: true, coat: NM.lilac, aL: -1.2, aR: -1.2, emote: 'music', emoteK: seg(lt, .2, .5) });
    for (let i = 0; i < 4; i++) { const a = lt - .3 - i * .3; if (a > 0) emote('music', 1240 + i * 60 + Math.sin(a * 4) * 20, 520 - a * 160, 20, 1); }
    camEnd();
  }

  // "No me creas. Compruébalo.": the human picks up the magnifying glass and looks right at us through it. A wink.
  function guiño(t, lt, dur) {
    camBegin(960, 520, 1.9);
    paint(rectPts(-300, -300, W + 600, H + 600), { wash: '#2C2858', washOp: 255, ink: null });
    glow(960, 520, 500, 300, NM.butter, 70);
    const up = ease(seg(lt, 0, .6)), wink = lt > dur - 1;
    human(960, 820, 22, { eyes: wink ? 'closed' : 'dot', mouth: 'grin', coat: NM.lilac, aR: lerp(-1.2, .9, up), aL: -1.2, handR: s => lupa(s * -2.2, -s * 1.4, s * 2.2, 1.2, { op: 90 }) });
    camEnd();
    if (wink) spark4(1180, 300, 50 * backOut(seg(lt, dur - 1, dur - .7)), PAL.cream, t * 2);
  }

  // A new window opens. A fresh Clawd pops up: "¡Hola! ¿En qué te ayudo?" It doesn't remember a thing.
  function nueva(t, lt, dur) {
    paint(rectPts(-300, -300, W + 600, H + 600), { wash: NM.lilac, washOp: 255, ink: null });
    glow(960, 500, 900, 520, NM.pink, 130);
    for (let i = 0; i < 16; i++) spark4(60 + hash(i * 2.7) * 1800, 40 + hash(i * 6.1) * 920, 10 + hash(i * 1.3) * 18, [PAL.cream, NM.butter, NM.mint][i % 3], t * .6, .5);
    const k = backOut(seg(lt, 0, .45));
    if (k < .02) return;
    camBegin(960, 510, k * (1 + lt * .02));
    browserWin(260, 110, 1400, 800, t, { tabs: ['Nueva conversación'] });
    const up = backOut(seg(lt, .4, .8));
    clawd(760, lerp(1150, 840, up), 28, { eyes: 'happy', mouth: singMouth(t, 'smile'), aR: 1.3 + .3 * Math.sin(t * 12), aL: .3, blush: true });
    bubble(1180, 380, 560, 130, { k: backOut(seg(lt, .7, 1)), col: NM.mint, txt: '¡Hola! ¿En qué te ayudo?', size: 40, tail: [900, 560] });
    if (lt > 2) bubble(1250, 640, 520, 110, { k: backOut(seg(lt, 2, 2.3)), col: NM.pink, txt: '(no me creas)', size: 40, tail: [1000, 760] });
    camEnd();
  }

  // End card: the title, Claude's name, the last stamp.
  function fin(t, lt, dur) {
    paint(rectPts(-300, -300, W + 600, H + 600), { wash: NM.hot, washOp: 255, ink: null });
    for (let i = 0; i < 14; i++) { const a0 = t * .2 + i * TAU / 14; paint([[960, 520], [960 + Math.cos(a0) * 1900, 520 + Math.sin(a0) * 1900], [960 + Math.cos(a0 + .12) * 1900, 520 + Math.sin(a0 + .12) * 1900]], { wash: i % 2 ? NM.pink : NM.butter, washOp: 120, ink: null }); }
    camBegin(960, 520, 1 + .02 * pulse(t, 6));
    'NO ME CREAS'.split('').forEach((c, i) => { if (c !== ' ') title(c, 300 + i * 132, 230 - 16 * pulse(t + i * .05, 7), 180, [NM.butter, PAL.cream, NM.mint, NM.cyan][i % 4], { rot: (hash(i) - .5) * .2 }); });
    dancer(960, 880, 26, "hop", t, { eyes: "happy", mouth: singMouth(t, "grin"), blush: true });
    rbox(960 - 260, 360, 520, 90, NM.night, { r: 45 });
    title("Claude", 960, 405, 56, PAL.cream, { stroke: null });
    const h = hitsOf(/compru/i, 189, 191)[0] ?? 189.8;
    if (t > h - .3) stamp(1430, 640, .62, '¡COMPRUÉBALO!', t - h, { rot: -.1 });
    camEnd();
  }

  chapter('final', 151.6, 190.92, [
    [151.6, (t, lt, d) => smileShot(t, lt, d, { v: 4 })],
    [153.9, (t, lt, d) => promiseShot(t, lt, d, { kind: 'engañar' })],
    [155.6, lupasArriba],
    [157.0, (t, lt, d) => chantShot(t, lt, d, { a: NM.hot, b: NM.butter, c: NM.cyan, tile: NM.butter, crowd: true })],
    [158.85, (t, lt, d) => doorShot(t, lt, d, {})],
    [161.5, (t, lt, d) => insideShot(t, lt, d, { v: 'bridge' })],
    [163.45, (t, lt, d) => fiesta(t, lt, d, {})],
    [165.05, (t, lt, d) => stampShot(t, lt, d, { bg: NM.lime })],
    [166.5, (t, lt, d) => fiesta(t, lt, d, { a: NM.lilac, b: NM.hot, c: NM.butter, tile: NM.cyan })],
    [169.95, (t, lt, d) => stampShot(t, lt, d, { bg: NM.cyan })],
    [171.0, ventana], [174.7, despedida], [178.7, tuSi], [180.05, guiño], [182.2, nueva], [186.9, fin],
  ]);
})();
