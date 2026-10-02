// setup.mjs: fetch the painting engine this video is built on, straight from its author's repository.
//
// The watercolor engine (paint wrapper, paper, lettering, compositing), the Clawd character, the Researcher,
// the stage props and the ANIMATION_GUIDE.md that I followed all come from John Heibel's
// "I'm Upping My P(doom)" music video: https://github.com/JohnHeibel/PDoomVideo
// That repository has no license, so its files are not redistributed here: this script downloads them
// from a pinned commit, and applies the one-line change this song needs (core.js reads the song's
// BPM, beat offset and duration from window.SONG_CONFIG instead of P(doom)'s hard-coded 88 BPM).
//
//   node setup.mjs
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';

const REPO = 'JohnHeibel/PDoomVideo', COMMIT = 'fa546a38092e75f2b079e6a86d6abc54dd525d17';
const FILES = ['src/core.js', 'src/clawd.js', 'src/cast.js', 'src/props.js', 'ANIMATION_GUIDE.md'];
const PATCH = {
  file: 'src/core.js',
  from: 'const BPM = 88, BEAT = 60 / BPM, OFF = 0.21, BOIL = 12, DUR = 156.6;',
  to: 'const BPM = window.SONG_CONFIG?.bpm ?? 88, BEAT = 60 / BPM, OFF = window.SONG_CONFIG?.offset ?? 0.21, BOIL = 12, DUR = window.SONG_CONFIG?.duration ?? 156.6;'
};

for (const f of FILES) {
  const url = `https://raw.githubusercontent.com/${REPO}/${COMMIT}/${f}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url} → HTTP ${res.status}`);
  let text = await res.text();
  if (f === PATCH.file) {
    if (!text.includes(PATCH.from)) throw new Error(`${f}: the line to patch was not found`);
    text = text.replace(PATCH.from, PATCH.to);
  }
  mkdirSync(dirname(f), { recursive: true });
  writeFileSync(f, text);
  console.log(`✓ ${f}${f === PATCH.file ? '  (patched: reads window.SONG_CONFIG)' : ''}`);
}
console.log(`\nEngine ready (from github.com/${REPO} @ ${COMMIT.slice(0, 7)}). Open no-me-creas.html or run: npm run sheet`);
