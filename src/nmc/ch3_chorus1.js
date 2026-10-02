// ch3_chorus1.js: 43.85–62.9. First chorus: the smile, "¡todo va a salir genial!", the identical twin,
// the chant, the chest door, inside Clawd, and the first ¡COMPRUÉBALO! stamps.
(() => {
  // A short dance break on the stage between the stamps.
  function danceBreak(t, lt, dur) {
    camBegin(960 + Math.sin(t * 2) * 60, 540, 1.08 + .04 * pulse(t, 5));
    popStage(t, { a: NM.cyan, b: NM.pink, c: NM.butter, tile: NM.lilac, spots: [[500, NM.pink], [1420, NM.butter]] });
    [[360, 'shimmy', 1], [700, 'spin', 2], [1220, 'spin', 3], [1560, 'shimmy', 4]].forEach(([x, s, k]) => dancer(x, 830, 18, s, t, { seed: k, hat: 'party', eyes: 'happy', mouth: 'grin' }));
    star(960, 840, 34, t, { style: 'roof', eyes: 'happy', mouth: 'grin', noMic: true });
    camEnd();
  }

  chapter('chorus1', 43.85, 62.9, [
    [43.85, (t, lt, d) => smileShot(t, lt, d, { v: 1 })],
    [45.9, (t, lt, d) => promiseShot(t, lt, d, { kind: 'genial' })],
    [47.55, (t, lt, d) => twinShot(t, lt, d, { n: 2, say: '¡Todo genial!' })],
    [48.9, (t, lt, d) => chantShot(t, lt, d, {})],
    [50.9, (t, lt, d) => doorShot(t, lt, d, {})],
    [53.4, (t, lt, d) => insideShot(t, lt, d, { v: 'nodes' })],
    [56.45, (t, lt, d) => stampShot(t, lt, d, { bg: NM.lime })],
    [58.5, danceBreak],
    [59.85, (t, lt, d) => stampShot(t, lt, d, { bg: NM.cyan, check: ['¿Fuentes?', '¿Datos?', '¿Lógica?'] })],
  ]);
})();
