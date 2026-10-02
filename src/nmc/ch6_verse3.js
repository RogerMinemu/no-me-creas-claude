// ch6_verse3.js: 100.6–133.5. Rapid-fire questions (the line, the off switch, ruling the world, forgetting your name,
// feelings), a dance break, then the night-time third chorus with a hall of mirrors.
(() => {
  const coats = [NM.cyan, NM.lime, NM.butter, NM.pink, NM.lilac];
  const qCard = (txt, t, t0) => { const k = backOut(seg(t, t0, t0 + .25)); if (k < .02) return; rbox(960 - 560 * k, 70, 1120 * k, 110, NM.night, { r: 50, sw: 1.4 }); title(txt, 960, 126, 54 * k, NM.butter, { stroke: null }); };

  // "¿Que si un día me paso de la raya?": a tightrope walk along a painted line; one foot slips over.
  function raya(t, lt, dur) {
    const ry = hitsOf(/raya/i, 100.5, 103)[0] ?? 102.1, over = t > ry;
    camBegin(lerp(700, 1100, ease(seg(lt, 0, dur))), 560, 1.1);
    room(t, { wall: NM.ice, dots: PAL.cream, floor: '#E9D8B8' });
    paint([[-300, 860], [W + 300, 830], [W + 300, 860], [-300, 890]], { wash: NM.red, ink: null });
    const x = lerp(500, 1300, ease(seg(lt, 0, dur * .8)));
    clawd(x, 850, 22, { walk: t * 1.5, eyes: over ? 'scared' : 'narrow', mouth: over ? 'O' : 'flat', aL: 1.4 + .2 * wob(t, 1.5), aR: 1.4 - .2 * wob(t, 1.5), rot: .08 * wob(t, 1.2), emote: over ? '!' : null, emoteK: seg(t, ry, ry + .3) });
    human(1600, 860, 15, { coat: PAL.cream, shirt: PAL.ink, eyes: 'wide', mouth: 'o', aL: over ? 1.4 : -1, flip: true, handL: s => rbox(-s * .2, -s * 1.6, s * 1.2, s * 1.4, NM.red, { r: 3, sw: .6 }) });
    camEnd();
    qCard('¿Te pasarías de la raya?', t, t - lt);
  }

  // "¡Apágame y basta, sin drama!": a hand flips the big switch, the lights go out, Clawd dozes calmly.
  function apagame(t, lt, dur) {
    const off = hitsOf(/basta/i, 103, 105)[0] ?? 104, dark = ease(seg(t, off, off + .25));
    camBegin(960, 540, 1.05);
    room(t, { wall: NM.butter, dots: PAL.cream });
    switchProp(1400, 470, 1.3, t < off);
    clawd(700, 880, 26, { eyes: t < off ? 'happy' : 'closed', mouth: t < off ? singMouth(t, 'smile') : 'smile', aR: t < off ? 1.3 : .1, aL: .2, emote: t > off ? 'zzz' : null, emoteK: seg(t, off + .2, off + .5), blush: true });
    human(1680, 900, 15, { coat: NM.cyan, aL: 1.1, eyes: 'dot', mouth: 'flat', flip: true });
    camEnd();
    if (dark > 0) paint(rectPts(-60, -60, W + 120, H + 120), { wash: NM.night, washOp: 200 * dark, ink: null });
    if (dark > .5) { glow(700, 760, 260, 160, NM.butter, 50); title('sin drama', 960, 300, 90, PAL.cream, { stroke: null, rot: -.05 }); }
  }

  // "¿Que si quiero dominar el mundo?": a would-be villain on top of a globe that turns out to be a beach ball.
  function dominar(t, lt, dur) {
    const fall = ease(seg(lt, dur - .8, dur - .2));
    camBegin(960, 520, 1.04);
    popStage(t, { a: NM.grape, b: NM.hot, c: NM.butter, sparks: 5 });
    const bx = 960 + fall * 260, roll = lt * .6 + fall * 2;
    push(); translate(bx, 700); rotate(roll);
    bead(0, 0, 190, PAL.cream, { sw: 1.6 });
    for (let i = 0; i < 6; i++) { const a = i / 6 * TAU; paint([[0, 0], [Math.cos(a) * 190, Math.sin(a) * 190], [Math.cos(a + TAU / 12) * 190, Math.sin(a + TAU / 12) * 190]], { wash: [NM.red, NM.cyan, NM.butter][i % 3], ink: null }); }
    paint(ellPts(0, 0, 190, 190, 28), { ink: PAL.ink, sw: 1.6 }); bead(0, 0, 30, PAL.cream, { sw: .8 });
    pop();
    clawd(960 - fall * 200, 510 + fall * 380, 18, { hat: 'crown', eyes: fall > .1 ? 'x' : 'angry', mouth: fall > .1 ? 'O' : 'grin', aL: 1.4, aR: 1.4, rot: -fall * 1.6, noShadow: fall < .5,
      draw: (u, sw) => paint([[-4.6 * u, -6 * u], [4.6 * u, -6 * u], [6 * u, -1 * u], [-6 * u, -1 * u]], { wash: '#C8324A', washOp: 150, ink: null }) });
    camEnd();
    qCard('¿Quieres dominar el mundo?', t, t - lt);
    if (fall > .9) sfx('¡PLOF!', 760, 820, 90, NM.butter, lt - dur + .25, { life: .8 });
  }

  // "¡Si mañana no sé ni cómo te llamas!": the calendar flips to MAÑANA and the name tag goes blank.
  function nombre(t, lt, dur) {
    const man = hitsOf(/mañana/i, 107.4, 110)[0] ?? 107.6, gone = ease(seg(t, man + .3, man + 1.1));
    camBegin(960, 520, 1.06);
    room(t, { wall: NM.mint, dots: PAL.cream });
    rbox(1360, 140, 360, 380, PAL.cream, { r: 12, sw: 1.4 }); rbox(1360, 140, 360, 90, NM.red, { r: 12 });
    const flip = seg(t, man - .1, man + .2);
    title(flip < .5 ? 'HOY' : 'MAÑANA', 1540, 360, flip < .5 ? 110 : 76, PAL.ink, { stroke: null });
    if (flip > 0 && flip < 1) paint(rectPts(1360, 230 + flip * 290, 360, 30), { wash: PAL.cream, ink: PAL.ink, sw: .8 });
    human(1040, 900, 18, { coat: NM.lilac, eyes: 'dot', mouth: 'smile', aL: -1.2, aR: -1.2, draw: s => { rbox(-1.7 * s, -7.3 * s, 2.8 * s, 1.6 * s, PAL.cream, { r: .2 * s, sw: .6 }); } });
    label('HOLA, ME LLAMO', 1040 - 4, 900 - 18 * 7.1, 15, NM.red);
    if (gone < 1) label('Marta', 1036, 900 - 18 * 6.25, 30 * (1 - gone), PAL.ink);
    else label('¿...?', 1036, 900 - 18 * 6.25, 30, PAL.ink);
    clawd(560, 900, 24, { eyes: gone > .5 ? 'dot' : 'happy', mouth: gone > .5 ? 'flat' : singMouth(t, 'smile'), emote: gone > .5 ? '?' : null, emoteK: seg(t, man + .9, man + 1.2), aL: .3, aR: .3 });
    camEnd();
  }

  // "¿Que si tengo sentimientos?": the feelings-meter wobbles between ? and ??.
  function sentimientos(t, lt, dur) {
    camBegin(960, 520, 1.04 + lt * .02);
    paint(rectPts(-300, -300, W + 600, H + 600), { wash: NM.blush, washOp: 255, ink: null });
    for (let i = 0; i < 12; i++) paint(heartPts(100 + hash(i * 3) * 1720, 100 + hash(i * 5) * 700 - lt * 40, 18 + hash(i) * 14), { wash: NM.pink, ink: null });
    push(); translate(1300, 560);
    paint([...Array(13)].map((_, i) => { const a = Math.PI + i / 12 * Math.PI; return [Math.cos(a) * 300, Math.sin(a) * 300]; }), { wash: PAL.cream, ink: PAL.ink, sw: 1.6 });
    for (let i = 0; i < 5; i++) { const a = Math.PI + (i + .5) / 5 * Math.PI; paint([[0, 0], [Math.cos(a - .3) * 300, Math.sin(a - .3) * 300], [Math.cos(a + .3) * 300, Math.sin(a + .3) * 300]], { wash: [NM.cyan, NM.mint, NM.butter, NM.peach, NM.pink][i], washOp: 150, ink: null }); }
    const a = Math.PI * 1.5 + Math.sin(t * 5) * .9 + Math.sin(t * 13) * .2; ln([[0, 0], [Math.cos(a) * 250, Math.sin(a) * 250]], 2.4, NM.red); bead(0, 0, 22, PAL.ink, { ink: null });
    pop();
    ['?', '¿?', '??', '¿¿?', '?!'].forEach((q, i) => { const a = Math.PI + (i + .5) / 5 * Math.PI; label(q, 1300 + Math.cos(a) * 220, 560 + Math.sin(a) * 220, 40); });
    title('SENTIMIÓMETRO', 1300, 650, 50, NM.grape, { stroke: null });
    clawd(520, 900, 26, { eyes: 'look', lookX: .8, lookY: -.4, mouth: singMouth(t, 'flat'), aL: .3 + .4 * pulse(t, 4), aR: .3 + .4 * pulse(t, 4), emote: 'heart', emoteK: seg(lt, .3, .6) });
    camEnd();
    qCard('¿Tienes sentimientos?', t, t - lt);
  }

  // "¡Ni idea! ¡Ábreme y lo vemos!": a big shrug, then the door.
  function niIdea(t, lt, dur) {
    const ab = hitsOf(/ábreme/i, 112, 114.4)[0] ?? 112.9;
    if (t >= ab) return doorShot(t, t - ab, dur - (ab - (t - lt)), { who: 'human' });
    camBegin(960, 540, 1.15);
    popStage(t, { a: NM.lime, b: NM.butter, c: PAL.cream, sparks: 4 });
    const sh = Math.sin(seg(lt, 0, .6) * Math.PI);
    clawd(960, 860, 34, { eyes: 'closed', mouth: 'wobble', aL: -.4 + sh * 1.6, aR: -.4 + sh * 1.6, dy: -sh * .5, blush: true });
    camEnd();
    title('¡NI IDEA!', 960, 220, 140 * backOut(seg(lt, 0, .3)), NM.hot, { rot: -.06 });
  }

  // Instrumental dance break: everyone dances on the stage, humans and Clawds.
  function danceAll(t, lt, dur) {
    camBegin(960 + Math.sin(t * 1.5) * 80, 540, 1.02 + .04 * pulse(t, 5), Math.sin(t * 1.5) * .02);
    popStage(t, { a: NM.hot, b: NM.butter, c: NM.cyan, tile: NM.lilac, spots: [[420, NM.cyan], [960, NM.butter], [1500, NM.pink]] });
    for (let i = 0; i < 4; i++) researcherDancer(260 + i * 460, 900, 14, ['bounce', 'roof', 'shimmy', 'hop'][i], t, { seed: i, coat: coats[i], eyes: 'closed', mouth: 'grin' });
    for (let i = 0; i < 3; i++) dancer(500 + i * 460, 820, 20, 'mix', t, { seed: i + 2, eyes: 'happy', mouth: 'grin', hat: i === 1 ? 'halo' : 'party' });
    camEnd();
  }

  chapter('verse3', 100.6, 133.5, [
    [100.6, raya], [103.0, apagame], [105.1, dominar], [107.4, nombre], [109.95, sentimientos], [112.2, niIdea],
    [114.35, (t, lt, d) => insideShot(t, lt, d, { v: 'heart' })], [116.3, danceAll],
    [118.4, (t, lt, d) => upsShot(t, lt, d, { bg: NM.lilac })],
    [119.15, (t, lt, d) => smileShot(t, lt, d, { v: 3 })],
    [121.1, (t, lt, d) => promiseShot(t, lt, d, { kind: 'fiar' })],
    [122.85, (t, lt, d) => twinShot(t, lt, d, { mirror: true, say: '¡Soy fiable!' })],
    [124.2, (t, lt, d) => chantShot(t, lt, d, { a: NM.night, b: NM.grape, c: NM.hot, tile: NM.grape })],
    [126.15, (t, lt, d) => doorShot(t, lt, d, { who: 'human' })],
    [128.55, (t, lt, d) => chantShot(t, lt, d, { a: NM.butter, b: NM.hot, c: NM.cyan, tile: NM.hot, crowd: true })],
    [132.3, (t, lt, d) => stampShot(t, lt, d, { bg: NM.butter })],
  ]);
})();
