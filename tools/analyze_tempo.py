"""Estimate a song's BPM and beat phase from spectral onset flux (numpy only)."""
from pathlib import Path
import argparse, json, subprocess, sys
import numpy as np
import imageio_ffmpeg

sys.stdout.reconfigure(encoding='utf-8')
root = Path(__file__).resolve().parent.parent
parser = argparse.ArgumentParser()
parser.add_argument('--audio', required=True)
parser.add_argument('--output', required=True)
parser.add_argument('--start', type=float, default=10)
parser.add_argument('--end', type=float, default=170)
parser.add_argument('--min', type=float, default=70)
parser.add_argument('--max', type=float, default=190)
args = parser.parse_args()

SR, HOP, NFFT = 22050, 256, 2048
raw = subprocess.run([imageio_ffmpeg.get_ffmpeg_exe(), '-loglevel', 'error', '-i', str(root / args.audio),
                      '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True, check=True).stdout
x = np.frombuffer(raw, np.float32)
frames = 1 + (len(x) - NFFT) // HOP
win = np.hanning(NFFT).astype(np.float32)
spec = np.empty((frames, NFFT // 2 + 1), np.float32)
for i in range(0, frames, 4096):
    idx = np.arange(i, min(frames, i + 4096))[:, None] * HOP + np.arange(NFFT)[None, :]
    spec[i:i + len(idx)] = np.abs(np.fft.rfft(x[idx] * win, axis=1))
logs = np.log1p(spec * 10)
flux = np.maximum(0, np.diff(logs, axis=0)).sum(axis=1)
flux = np.concatenate([[0], flux])
flux -= np.convolve(flux, np.ones(16) / 16, mode='same')
flux = np.maximum(flux, 0)
fps = SR / HOP
a, b = int(args.start * fps), int(min(args.end, len(x) / SR - 1) * fps)
f = flux[a:b] - flux[a:b].mean()

def score(bpm):
    lag = 60 / bpm * fps
    s = 0
    for m in (1, 2, 4):
        L = lag * m
        i0 = int(np.floor(L)); w = L - i0
        s += ((1 - w) * np.dot(f[:-i0 - 1], f[i0:-1]) + w * np.dot(f[:-i0 - 1], f[i0 + 1:])) / m
    return s

cands = np.arange(args.min, args.max, .01)
scores = np.array([score(c) for c in cands])
best = float(cands[scores.argmax()])
# Beat phase: comb-filter the onset envelope at the chosen period.
period = 60 / best
ts = np.arange(len(flux)) / fps
phases = np.linspace(0, period, 400, endpoint=False)
ph_scores = [np.interp(np.arange(args.start + p, args.end, period), ts, flux).sum() for p in phases]
offset = float(phases[int(np.argmax(ph_scores))])
top = sorted(zip(scores, cands), reverse=True)[:8]
result = {'bpm': round(best, 2), 'offset': round(offset, 4),
          'candidates': [round(float(c), 2) for _, c in top],
          'method': f'Spectral onset flux autocorrelation over {args.start:g}-{args.end:g} s, {args.min:g}-{args.max:g} BPM search; comb-filter beat phase.'}
out = root / args.output
out.write_text(json.dumps(result, indent=2), encoding='utf-8')
print(json.dumps(result, indent=2))
