// ch5_chorus2.js: 85.98–100.6. Second chorus: backup dancers join, "¡no tengo ningún plan!" (blank notebook),
// three identical Clawds, the chant in cyan, the door, the library of everything people wrote, the stamps.
(() => {
  chapter('chorus2', 85.98, 100.6, [
    [85.98, (t, lt, d) => smileShot(t, lt, d, { v: 2 })],
    [88.0, (t, lt, d) => promiseShot(t, lt, d, { kind: 'plan' })],
    [89.95, (t, lt, d) => twinShot(t, lt, d, { n: 3, say: '¡Ningún plan!' })],
    [91.3, (t, lt, d) => chantShot(t, lt, d, { a: NM.cyan, b: NM.mint, c: NM.pink, tile: NM.lilac })],
    [93.25, (t, lt, d) => doorShot(t, lt, d, {})],
    [95.75, (t, lt, d) => insideShot(t, lt, d, { v: 'library' })],
    [98.75, (t, lt, d) => stampShot(t, lt, d, { bg: NM.pink })],
  ]);
})();
