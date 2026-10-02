"""Inspect and locally transcribe the chosen song for subtitle alignment."""
from pathlib import Path
import json
import os
import sys
import argparse

os.environ.setdefault('HF_HUB_DISABLE_SYMLINKS_WARNING', '1')
sys.stdout.reconfigure(encoding='utf-8')
from mutagen.mp3 import MP3
import imageio_ffmpeg
from faster_whisper import WhisperModel

root = Path(__file__).resolve().parent.parent
parser=argparse.ArgumentParser()
parser.add_argument('--audio',default='song/no-me-creas/No me creas.mp3')
parser.add_argument('--output',default='song/no-me-creas')
parser.add_argument('--language',default='es')
parser.add_argument('--prompt',default='No me creas. Compruébalo. Pero eso diría igual. Golden Gate. Pestañas. Ábreme y mira por dentro.')
args=parser.parse_args()
source = root / args.audio
destination=root/args.output
destination.mkdir(parents=True,exist_ok=True)
info = MP3(source).info
metadata = {'audio': args.audio, 'duration': info.length,
            'sample_rate': info.sample_rate, 'channels': info.channels,
            'ffmpeg': imageio_ffmpeg.get_ffmpeg_exe()}
(destination / 'audio-info.json').write_text(json.dumps(metadata, indent=2), encoding='utf-8')
print(json.dumps(metadata), flush=True)
model = WhisperModel('small', device='cpu', compute_type='int8', cpu_threads=6)
segments, details = model.transcribe(str(source), language=args.language, word_timestamps=True,
                                    beam_size=5, vad_filter=False,
                                    initial_prompt=args.prompt)
result = []
for segment in segments:
    row = {'start': segment.start, 'end': segment.end, 'text': segment.text,
           'words': [{'start': w.start, 'end': w.end, 'word': w.word, 'probability': w.probability}
                     for w in (segment.words or [])]}
    result.append(row)
    print(f'{segment.start:.2f} - {segment.end:.2f} {segment.text}', flush=True)
    (destination / 'transcript.json').write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding='utf-8')
print('Transcription complete.', flush=True)
