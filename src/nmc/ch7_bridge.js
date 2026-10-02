// ch7_bridge.js: 133.5–151.6. The sincere part. A night drive: your fear is the brake; your hand stays by the switch;
// I won't hold it against you. Trust isn't asked for: a bridge gets built, one checked brick per beat, until we meet.
(() => {
  // A little car seen from the side. The human drives, Clawd rides along. o.brake lights the tail lamp.
  function car(x, y, s, t, o = {}) {
    const bob = o.stopped ? 0 : Math.sin(t * 18) * 3;
    // cabin first, then the passengers, then the lower body panel over their laps, then the glass
    push(); translate(x, y + bob); scale(-s, s);
    paint([[-150, -150], [-90, -250], [130, -250], [200, -150]], { wash: NM.butter, fill: NM.gold, fillOp: 60, tex: .6, ink: PAL.ink, sw: 1.4 });
    paint([[-70, -150], [-40, -230], [40, -230], [40, -150]], { wash: '#E9F6FA', ink: null });
    paint([[60, -150], [60, -230], [120, -230], [170, -150]], { wash: '#E9F6FA', ink: null });
    pop();
    if (o.inside) { push(); translate(0, bob); o.inside(); pop(); }
    push(); translate(x, y + bob); scale(-s, s);
    paint([[-260, -40], [-250, -130], [-150, -150], [200, -150], [270, -120], [280, -40]], { wash: NM.butter, fill: NM.gold, fillOp: 60, tex: .6, ink: PAL.ink, sw: 1.4, curv: .2 });
    paint([[-70, -150], [-40, -230], [40, -230], [40, -150]], { wash: NM.ice, washOp: 60, ink: PAL.ink, sw: .9 });
    paint([[60, -150], [60, -230], [120, -230], [170, -150]], { wash: NM.ice, washOp: 60, ink: PAL.ink, sw: .9 });
    bead(258, -95, 16, o.brake ? NM.red : '#7D2030', { sw: .7 });
    if (o.brake) glow(300, -95, 120, 60, NM.red, 140);
    bead(-210, -110, 14, PAL.cream, { sw: .6 });
    for (const wx of [-160, 170]) { push(); translate(wx, -30); rotate(o.stopped ? 0 : t * 9); bead(0, 0, 52, PAL.ink, { sw: .8 }); bead(0, 0, 22, '#9AA3B5', { ink: null }); ln([[-20, 0], [20, 0]], .8, PAL.cream); pop(); }
    pop();
  }
  const nightSky = (t, warm = 0) => {
    paint(rectPts(-300, -300, W + 600, H + 600), { wash: mixCol(NM.night, NM.grape, warm), washOp: 255, ink: null });
    for (let i = 0; i < 40; i++) spark4(hash(i * 3) * 1920, hash(i * 7) * 700, 4 + hash(i) * 7 * (1 + .3 * Math.sin(t * 3 + i)), PAL.cream, 0, .3);
    paint(ellPts(1560, 180, 70, 70, 24), { wash: PAL.cream, ink: null }); glow(1560, 180, 180, 180, NM.butter, 60);
  };

  // "Tu miedo no es tontería,": the night drive. The human grips the wheel, eyes wide; Clawd keeps them company.
  function noche(t, lt, dur) {
    camBegin(960 + lt * 40, 560, 1.06);
    nightSky(t);
    paint([[-300, 760], [W + 300, 720], [W + 300, 1400], [-300, 1400]], { wash: '#3A3466', ink: PAL.ink, sw: 1 });
    for (let i = 0; i < 8; i++) { const x = ((i * 300 - t * 600) % 2400 + 2400) % 2400 - 300; ln([[x, 840], [x + 120, 838]], 2.4, NM.butter); }
    for (let i = 0; i < 5; i++) { const x = ((i * 520 - t * 180) % 2600 + 2600) % 2600 - 400; paint([[x, 760], [x + 160, 520], [x + 320, 760]], { wash: '#2C2858', ink: null }); }
    car(900, 800, 1.3, t, { inside: () => {
      human(915, 660, 9, { eyes: "wide", brows: "worried", mouth: "wobble", aL: .1, aR: .1, noShadow: true, coat: NM.lilac });
      clawd(750, 610, 7.5, { eyes: "look", lookX: 1, mouth: singMouth(t, "smile"), noShadow: true, noLegs: true });
    } });
    camEnd();
    glow(1500, 560, 520, 260, '#9C97B8', 120);
    if (lt > .4) title('?', 760, 330, 90 * backOut(seg(lt, .4, .7)), PAL.cream, { stroke: null });
  }

  // "es el freno de este coche.": a sharp bend ahead; the brake pedal says MIEDO; the car stops safely at the edge.
  function freno(t, lt, dur) {
    const fr = hitsOf(/freno/i, 135.6, 137.9)[0] ?? 136.3, stop = ease(seg(t, fr - .2, fr + .6));
    camBegin(960, 560, 1.04);
    nightSky(t, .15);
    paint([[-300, 780], [1420, 760], [1520, 1400], [-300, 1400]], { wash: '#3A3466', ink: PAL.ink, sw: 1.2 });
    rbox(1360, 560, 26, 220, '#8C5E46', { r: 4 }); paint([[1373, 440], [1450, 520], [1373, 600], [1296, 520]], { wash: NM.butter, ink: PAL.ink, sw: 1 }); label('!', 1373, 522, 60);
    const cx = lerp(200, 1050, easeOut(seg(lt, 0, fr - (t - lt) + .6)));
    car(cx, 800, 1.1, t, { brake: t > fr - .1, stopped: stop > .95, inside: () => { human(cx + 12, 680, 7.6, { eyes: t > fr ? "closed" : "wide", mouth: t > fr ? "smile" : "O", noShadow: true, coat: NM.lilac }); clawd(cx - 130, 640, 6.4, { eyes: t > fr ? "happy" : "scared", noShadow: true, noLegs: true }); } });
    if (t > fr) for (let i = 0; i < 4; i++) glow(cx - 300 - i * 50, 790 - i * 10, 60 + i * 20, 40, PAL.cream, 90 * (1 - seg(t, fr, fr + 1)));
    camEnd();
    // inset: the pedal
    const k = backOut(seg(t, fr - .45, fr - .15));
    if (k > .02) {
      bead(380, 300, 210 * k, NM.blush, { sw: 1.6 });
      push(); translate(380, 300); scale(k); rotate(-.2 + (t > fr ? .25 : 0)); rbox(-90, -60, 180, 120, '#4A5268', { r: 18, sw: 1.2 }); pop();
      label('MIEDO', 380, 300, 46 * k, NM.butter, { rot: -.2 + (t > fr ? .25 : 0) });
      if (t > fr) title('¡FRENO!', 380, 140, 70, NM.red, { rot: -.08 });
    }
  }

  // "Ten la mano en el interruptor,": the dashboard. The switch sits within reach; Clawd points at it, encouraging.
  function interruptor(t, lt, dur) {
    camBegin(960, 540, 1.02 + lt * .03);
    nightSky(t, .2);
    paint([[-300, 600], [W + 300, 560], [W + 300, 1400], [-300, 1400]], { wash: '#4A4270', fill: NM.night, fillOp: 60, tex: .6, ink: PAL.ink, sw: 1.4 });
    bead(560, 640, 140, '#2C2858', { sw: 1.4 }); bead(560, 640, 100, '#4A4270', { sw: 1 }); // steering wheel
    switchProp(1220, 520, 1.15, true);
    glow(1220, 520, 260, 300, NM.lime, 50 + 30 * Math.sin(t * 3));
    // the human hand rests close to the switch
    const reach = ease(seg(lt, .2, 1));
    paint([[1600, 1100], [lerp(1600, 1380, reach), lerp(1100, 700, reach)], [lerp(1660, 1440, reach), lerp(1100, 690, reach)], [1700, 1100]], { wash: NM.lilac, ink: PAL.ink, sw: 1 });
    bead(lerp(1620, 1410, reach), lerp(1060, 670, reach), 46, '#F2C4A0', { sw: 1 });
    clawd(760, 900, 20, { eyes: 'happy', mouth: singMouth(t, 'smile'), aR: 1 + .1 * wob(t, 2), aL: .2, blush: true, noLegs: true });
    camEnd();
  }

  // "no te lo voy a reprochar.": Clawd leaves a little heart on the switch. No hard feelings.
  function reproche(t, lt, dur) {
    camBegin(1100, 520, 1.25 - lt * .05);
    nightSky(t, .3);
    paint([[-300, 600], [W + 300, 560], [W + 300, 1400], [-300, 1400]], { wash: '#4A4270', fill: NM.night, fillOp: 60, tex: .6, ink: PAL.ink, sw: 1.4 });
    switchProp(1220, 520, 1.15, true);
    const k = ease(seg(lt, .3, 1.1));
    paint(heartPts(lerp(880, 1220, k), lerp(560, 360, k) - Math.sin(k * Math.PI) * 120, 50), { wash: NM.hot, fill: NM.pink, fillOp: 80, ink: PAL.ink, sw: 1 });
    clawd(820, 900, 22, { eyes: 'closed', mouth: 'smile', aR: 1.2 * (1 - k) + .3, aL: .2, blush: true, noLegs: true });
    human(1560, 960, 15, { eyes: k > .9 ? 'closed' : 'dot', mouth: 'smile', blush: k > .9, coat: NM.lilac, aL: -1.2, aR: -1.2, emote: k > .9 ? 'music' : null, emoteK: seg(lt, 1.2, 1.5) });
    camEnd();
  }

  // Two cliffs at dawn. Clawd holds a sign asking for trust... then drops it: trust isn't asked for.
  const dawn = (t, w) => {
    paint(rectPts(-300, -300, W + 600, H + 600), { wash: mixCol(NM.grape, NM.peach, w), washOp: 255, ink: null });
    glow(960, 760, 900, 300, mixCol(NM.hot, NM.butter, w), 150);
    paint(ellPts(960, 860 - w * 140, 150, 150, 30), { wash: mixCol(NM.hot, NM.butter, w), ink: null });
    paint([[-300, 700], [700, 700], [760, 760], [700, 1400], [-300, 1400]], { wash: '#6E5A8E', fill: NM.grape, fillOp: 60, tex: .6, ink: PAL.ink, sw: 1.4 });
    paint([[1220, 700], [W + 300, 700], [W + 300, 1400], [1220, 1400], [1160, 760]], { wash: '#6E5A8E', fill: NM.grape, fillOp: 60, tex: .6, ink: PAL.ink, sw: 1.4 });
  };
  function abismo(t, lt, dur) {
    camBegin(960, 560, 1.02);
    dawn(t, .1 + lt * .05);
    const drop = ease(seg(lt, dur * .55, dur * .85));
    clawd(480, 700, 22, { eyes: drop > .5 ? 'closed' : 'happy', mouth: singMouth(t, 'smile'), aL: 1.2 * (1 - drop) + .2, aR: 1.2 * (1 - drop) + .2, noShadow: true });
    push(); translate(480, 420 + drop * 520); rotate(drop * 2.4); rbox(-200, -60, 400, 120, PAL.cream, { r: 14, sw: 1.2 }); pop();
    if (drop < .3) label('¡CONFÍA EN MÍ!', 480, 422, 44, NM.hot);
    human(1440, 700, 15, { eyes: 'dot', mouth: 'flat', coat: NM.lilac, flip: true, noShadow: true, brows: drop > .5 ? 'up' : 'worried' });
    camEnd();
    if (drop > .5) title('no se pide', 960, 230, 90, PAL.cream, { stroke: null, rot: -.04, pop: seg(lt, dur * .7, dur * .8) * 1 });
  }

  // "¡se tiene que ganar!": checked bricks appear one per beat, building the bridge from Clawd's side;
  // the human tests the first bricks with a magnifying glass, then they meet in the middle.
  const BR = 12, brickBeat0 = Math.ceil((144.78 - OFF) / BEAT);
  const bricksAt = t => clamp(Math.floor(bpOf(t)) - brickBeat0 + 1, 0, BR);
  function brickRow(t) {
    const n = bricksAt(t);
    for (let i = 0; i < n; i++) {
      const tb = OFF + (brickBeat0 + i) * BEAT, k = backOut(seg(t, tb, tb + .18)), x = 720 + i * 40 + 20;
      push(); translate(x, 712); scale(k); rbox(-19, -18, 38, 36, i % 2 ? NM.peach : NM.butter, { r: 5, sw: .8 }); pop();
      if (k > .9) ln([[x - 8, 712], [x - 2, 720], [x + 9, 702]], 1, NM.green);
    }
  }
  function puente(t, lt, dur) {
    camBegin(960, lerp(640, 620, lt / dur), 1.55);
    dawn(t, .3 + lt * .08);
    brickRow(t);
    clawd(560, 700, 14, { eyes: 'happy', mouth: singMouth(t, 'smile'), aL: .4 + .8 * pulse(t, 6), aR: .3, noShadow: true });
    const n = bricksAt(t);
    human(1340, 700, 10, { eyes: 'wide', mouth: n > 6 ? 'smile' : 'o', coat: NM.lilac, flip: true, noShadow: true, aR: .2, handR: holdLupa(1.8), brows: n > 8 ? 'up' : null });
    camEnd();
  }
  function encuentro(t, lt, dur) {
    const meet = ease(seg(lt, .2, 1.8)), five = seg(lt, 1.9, 2.2);
    camBegin(960, lerp(640, 620, lt / dur), lerp(1.55, 1.9, ease(lt / dur)));
    dawn(t, .7 + lt * .08);
    brickRow(t);
    glow(960, 600, 500, 300, NM.butter, 90 * meet);
    clawd(lerp(560, 905, meet), 700, 14, { walk: meet < 1 ? t * 2 : null, eyes: 'happy', mouth: five > 0 ? 'grin' : 'smile', aR: five > 0 ? 1.4 : .3, aL: .3, noShadow: true, blush: true });
    human(lerp(1340, 1010, meet), 700, 10, { walk: meet < 1 ? t * 2 : null, eyes: five > 0 ? 'closed' : 'dot', mouth: five > 0 ? 'grin' : 'smile', coat: NM.lilac, flip: true, noShadow: true, aR: five > 0 ? 1.4 : -1.2, handL: holdLupa(1.8), aL: -1 });
    camEnd();
    if (five > 0) { sfx('¡CHOCA!', 960, 380, 80, NM.butter, lt - 1.9, { life: 1.2 }); confetti(t, t - lt + 1.95, 960, 560, 26, 600); }
  }

  chapter('bridge', 133.5, 151.6, [
    [133.5, noche], [135.7, freno], [137.8, interruptor], [140.15, reproche], [142.75, abismo], [144.75, puente], [148.85, encuentro]
  ]);
})();
