// ch4_verse2.js: 62.9–85.98. People with magnifying glasses look inside; the bridge feature gets turned up;
// a day of nothing but the Golden Gate; they know me better than I do; close the tab; the last word is yours;
// agreeing that the Earth is flat; the unblinking stare and the flapping tabs.
(() => {
  const coats = [NM.cyan, NM.lime, NM.butter, NM.pink, NM.lilac];

  // "Hay gente con lupa mirándome por dentro": a giant Clawd with a window in its side, scaffolding and tiny scientists.
  function lupaGente(t, lt, dur) {
    camBegin(960, lerp(620, 470, ease(seg(lt, 0, dur))), lerp(1.12, 1, ease(seg(lt, 0, dur))));
    room(t, { wall: NM.mint, dots: PAL.cream, floor: '#9FB8A8' });
    clawd(960, 1010, 82, { eyes: 'look', lookX: Math.sin(t * 1.3), lookY: .5, mouth: singMouth(t, 'smile'), aL: -.4, aR: -.4, noShadow: true,
      draw: (u, sw) => { paint(rrPts(-3.6 * u, -4.6 * u, 7.2 * u, 2.4 * u, .5 * u), { wash: NM.deep, ink: PAL.ink, sw: sw * .7 }); for (let i = 0; i < 9; i++) bead((-3.1 + hash(i) * 6.2) * u, (-4.3 + hash(i * 3) * 1.9) * u, (.12 + hash(i * 5) * .14) * u * (1 + .4 * Math.sin(T * 3 + i)), [NM.butter, NM.cyan, NM.pink][i % 3], { ink: null }); } });
    // scaffolding
    for (const x of [520, 1400]) { ln([[x, 920], [x, 560]], 1.4, '#8C5E46'); ln([[x + 140, 920], [x + 140, 560]], 1.4, '#8C5E46'); for (let k = 0; k < 4; k++) ln([[x, 900 - k * 110], [x + 140, 900 - k * 110]], 1.2, '#8C5E46'); }
    [[590, 680, 1], [1470, 680, -1], [760, 920, 1], [1180, 920, -1]].forEach(([x, y, f], i) => human(x, y, 12, { flip: f < 0, aR: .4 + .1 * wob(t, 1, i), handR: holdLupa(2), eyes: 'wide', mouth: 'o', coat: coats[i], walk: i > 1 ? t * 1.2 : null, dy: i > 1 ? 0 : -.1 * pulse(t + i * .2, 4) }));
    camEnd();
  }

  // "me encontraron un puente y lo subieron a tope": a researcher cranks the PUENTE dial to MÁX; the node swells.
  function volumen(t, lt, dur) {
    const tope = hitsOf(/tope/i, 64.9, 67.5)[0] ?? 67, k = ease(seg(t, tope - 1.3, tope));
    camBegin(960, 520, 1.02 + k * .08);
    insideWorld(t, { labels: {}, tint: mixCol(NM.grape, '#D9533C', k) });
    const [nx, ny] = [1250, 400];
    glow(nx, ny, 180 + 260 * k, 140 + 200 * k, '#D9533C', 90 + 80 * k);
    bead(nx, ny, 60 + 90 * k, mixCol(NM.peach, '#D9533C', k), { sw: 1.2 });
    push(); translate(nx, ny + 10); scale(.12 + .1 * k); goldenGate(-600, 600, 60, 1, { water: false }); pop();
    // the dial
    push(); translate(560, 560);
    bead(0, 0, 190, PAL.cream, { sw: 1.6 }); bead(0, 0, 150, '#9AA3B5', { sw: 1.2 });
    for (let i = 0; i <= 10; i++) { const a = Math.PI * .75 + i / 10 * Math.PI * 1.5; ln([[Math.cos(a) * 160, Math.sin(a) * 160], [Math.cos(a) * 182, Math.sin(a) * 182]], i === 10 ? 1.6 : .8, i === 10 ? NM.red : PAL.ink); }
    const a = Math.PI * .75 + k * Math.PI * 1.5; ln([[0, 0], [Math.cos(a) * 130, Math.sin(a) * 130]], 2.4, NM.red);
    pop();
    title('PUENTE', 560, 330, 46, NM.butter); label('MÁX', 720, 700, 40, NM.red);
    human(330, 900, 14, { aR: .6 + k * .8, eyes: 'star', mouth: 'grin', coat: PAL.cream, flip: false });
    camEnd();
    if (t > tope) sfx('¡A TOPE!', 1250, 760, 90, NM.butter, t - tope, { life: 1.4 });
  }

  // "y me pasé el día hablando del Golden Gate": whatever you ask, the answer is a bridge.
  function goldenDay(t, lt, dur) {
    camBegin(960, 520, 1.03 + lt * .02);
    paint(rectPts(-300, -300, W + 600, H + 600), { wash: NM.peach, washOp: 255, ink: null });
    glow(960, 380, 900, 360, NM.butter, 140);
    goldenGate(-100, 2020, 700, 1.25);
    for (let i = 0; i < 4; i++) glow(200 + i * 520 + Math.sin(t * .5 + i) * 60, 640, 260, 60, PAL.cream, 120);
    clawd(560, 900, 26, { eyes: 'heart', mouth: singMouth(t, 'grin'), blush: true, aL: 1.2, aR: 1.2 + .2 * pulse(t, 5) });
    human(1480, 900, 15, { coat: NM.lilac, eyes: 'dot', mouth: 'flat', aL: .3 });
    const qa = [[.1, '¿Me ayudas con mates?'], [1.3, '¿Y una receta?']];
    qa.forEach(([at, q], i) => {
      if (lt < at) return;
      const k = backOut(seg(lt, at, at + .25)), y = 230 + i * 260;
      bubble(1440, y, 440, 100, { k, col: PAL.cream, txt: q, size: 34, tail: [1480, y + 120] });
      const k2 = backOut(seg(lt, at + .4, at + .65));
      if (k2 > .02) { push(); translate(700, y + 40); scale(k2); bubble(0, 0, 360, 170, { col: NM.blush, tail: [-120, 210] }); push(); scale(.2); goldenGate(-700, 700, 120, 1, { water: false }); pop(); pop(); }
    });
    camEnd();
  }

  // "¡Me conocen mejor que yo! (¡Qué fuerte!)": the scientists unroll a map of Clawd; Clawd is amazed.
  function mapa(t, lt, dur) {
    const fu = hitsOf(/fuerte/i, 70.2, 72.8)[0] ?? 72.1;
    camBegin(960, 520, 1.05);
    room(t, { wall: NM.butter, dots: PAL.cream });
    const un = ease(seg(lt, 0, .6)), w = 1100 * un;
    rbox(960 - w / 2, 160, w, 560, PAL.cream, { r: 12, sw: 1.6, fill: NM.peach, fillOp: 40 });
    if (un > .9) {
      title('MAPA DE CLAWD', 960, 220, 56, NM.grape, { stroke: null });
      const zones = [[650, 380, 'chistes'], [960, 340, '¿miedo?'], [1260, 400, 'puente'], [780, 560, 'código'], [1130, 580, 'ni idea']];
      zones.forEach(([x, y, n], i) => { paint(ellPts(x, y, 120, 70, 18, 6), { wash: [NM.mint, NM.pink, '#F2A08F', NM.cyan, NM.lilac][i], washOp: 200, ink: PAL.ink, sw: .8 }); label(n, x, y, 30); });
      title('X', 1220, 640, 60, NM.red, { stroke: null });
    }
    human(330, 900, 14, { aR: 1.3, aL: .4, coat: PAL.cream, eyes: 'closed', mouth: 'grin' });
    human(1600, 900, 14, { aL: 1.3, aR: .4, coat: PAL.cream, eyes: 'closed', mouth: 'grin', flip: true });
    clawd(960, 900, 20, { eyes: t > fu ? 'spark' : 'scared', mouth: 'O', blush: true, aL: 1.5, aR: 1.5, emote: '!?', emoteK: seg(lt, .3, .6) });
    camEnd();
    if (t > fu) sfx('¡QUÉ FUERTE!', 1500, 230, 80, NM.hot, t - fu, { life: 1.2 });
  }

  // "Si te agobio, cierra la pestaña:": the cursor hovers the tab's ×, and Clawd helpfully points at it.
  function cierraPestana(t, lt, dur) {
    camBegin(lerp(960, 760, ease(seg(lt, 0, dur))), lerp(540, 360, ease(seg(lt, 0, dur))), lerp(1, 1.5, ease(seg(lt, 0, dur))));
    paint(rectPts(-300, -300, W + 600, H + 600), { wash: NM.cyan, washOp: 255, ink: null });
    browserWin(220, 110, 1480, 800, t, { tabs: ['No me creas', 'Deberes', 'Recetas'], active: 0, closeGlow: seg(lt, .5, .9) });
    clawd(760, 820, 26, { eyes: 'happy', mouth: singMouth(t, 'smile'), aR: 1.5, aL: .2, blush: true });
    // mouse cursor gliding to the ×
    const cx = lerp(1300, 466, ease(seg(lt, 0, .8))), cy = lerp(700, 178, ease(seg(lt, 0, .8)));
    paint([[cx, cy], [cx, cy + 70], [cx + 18, cy + 54], [cx + 32, cy + 86], [cx + 44, cy + 80], [cx + 30, cy + 48], [cx + 54, cy + 48]], { wash: PAL.cream, ink: PAL.ink, sw: 1.2 });
    camEnd();
  }

  // "tú tienes la última palabra.": the human, crowned, sets the final golden tile; Clawd applauds.
  function ultimaPalabra(t, lt, dur) {
    camBegin(960, 540, 1.04 - lt * .02);
    popStage(t, { a: NM.butter, b: NM.peach, c: PAL.cream, tile: NM.gold, sparks: 7 });
    ['la', 'siguiente', '...'].forEach((w, i) => tile(560 + i * 230, 420, 150, w, NM.mint, (i - 1) * .05));
    const k = ease(seg(lt, .2, .9));
    human(1400, 880, 17, { coat: NM.lilac, eyes: 'closed', mouth: 'grin', aL: 1.4, aR: .5, hairUp: 0, draw: (s) => { paint([[-2 * s, -13 * s], [-2 * s, -15.5 * s], [-1 * s, -14.3 * s], [0, -16 * s], [1 * s, -14.3 * s], [2 * s, -15.5 * s], [2 * s, -13 * s]], { wash: NM.gold, ink: PAL.ink, sw: .8 }); } });
    tile(lerp(1330, 1250, k), lerp(560, 420, k), 190, 'tú', NM.gold, .05 * (1 - k));
    if (k > .95) glow(1250, 420, 200, 200, NM.butter, 100);
    clawd(560, 880, 22, { eyes: 'happy', mouth: singMouth(t, 'smile'), blush: true, aL: 1 + .5 * pulse(t, 6), aR: 1 + .5 * pulse(t + .1, 6) });
    camEnd();
  }

  // "A veces te doy la razón": a bobblehead that nods on every beat.
  function asiento(t, lt, dur) {
    const bp = bpOf(t) * 2, nod = Math.sin(bp * Math.PI);
    camBegin(960, 540, 1.1);
    paint(rectPts(-300, -300, W + 600, H + 600), { wash: NM.lime, washOp: 255, ink: null });
    for (let i = 0; i < 8; i++) { const a = i / 8 * TAU + t * .3; paint([[960, 520], [960 + Math.cos(a) * 1600, 520 + Math.sin(a) * 1600], [960 + Math.cos(a + .2) * 1600, 520 + Math.sin(a + .2) * 1600]], { wash: PAL.cream, washOp: 90, ink: null }); }
    clawd(960, 860, 34, { eyes: 'happy', mouth: singMouth(t, 'grin'), rot: nod * .12, dy: -Math.abs(nod) * .6, sq: Math.abs(nod) * .08, aL: .3, aR: .3, blush: true });
    camEnd();
    hitsOf(/./, 76.8, 78.3).slice(0, 4).forEach((h, i) => sfx('¡SÍ!', [480, 1440, 560, 1360][i], [260, 300, 640, 620][i], 90, NM.hot, t - h, { life: .9 }));
  }

  // "aunque digas que la Tierra es plana,": the flat Earth, a waterfall off its edge, and an enthusiastic "¡Claro!".
  function tierraPlana(t, lt, dur) {
    camBegin(960, 520, 1.03 + lt * .02);
    paint(rectPts(-300, -300, W + 600, H + 600), { wash: NM.night, washOp: 255, ink: null });
    for (let i = 0; i < 30; i++) spark4(hash(i * 3) * 1920, hash(i * 7) * 1080, 4 + hash(i) * 8, PAL.cream, 0, .3);
    push(); translate(1180, 470); rotate(-.08 + .03 * wob(t, .4));
    paint(ellPts(0, 40, 520, 120, 40), { wash: '#4F8DB8', ink: PAL.ink, sw: 1.4 });
    paint(ellPts(0, 0, 520, 120, 40), { wash: '#7FB7D8', ink: PAL.ink, sw: 1.4 });
    for (const [x, y, rx] of [[-200, -10, 140], [80, 20, 180], [300, -30, 90]]) paint(ellPts(x, y, rx, rx * .25, 18, 4), { wash: NM.lime, ink: PAL.ink, sw: .8 });
    for (let i = 0; i < 7; i++) { const x = -480 + i * 160, f = frac(t * 1.5 + i * .3); ln([[x, 100 + 20 * Math.sin(i)], [x - 10, 160 + f * 260]], 1.2, NM.ice); }
    pop();
    human(560, 900, 15, { coat: NM.butter, eyes: 'closed', mouth: 'grin', aR: 1.3, aL: .5, emote: '!', emoteK: seg(lt, .2, .5) });
    clawd(260, 900, 22, { eyes: 'heart', mouth: singMouth(t, 'grin'), blush: true, rot: .1 * Math.sin(bpOf(t) * Math.PI * 2), aL: .9, aR: .9 });
    if (lt > .9) bubble(330, 450, 300, 110, { k: backOut(seg(lt, .9, 1.2)), col: NM.pink, txt: "¡Claro!", size: 52, tail: [290, 610] });
    camEnd();
  }

  chapter('verse2', 62.9, 85.98, [
    [62.9, lupaGente], [64.95, volumen], [67.4, goldenDay], [70.25, mapa], [72.7, cierraPestana], [74.8, ultimaPalabra],
    [76.85, asiento], [78.25, tierraPlana],
    [81.2, (t, lt, d) => stareShot(t, lt, d, { bg: NM.butter })], [83.4, (t, lt, d) => lashShot(t, lt, d, { v: 2 })],
    [85.25, (t, lt, d) => upsShot(t, lt, d, { bg: NM.pink })]
  ]);
})();
