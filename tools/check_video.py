"""Decode the assembled export and check for corruption and timestamp reversals."""
from pathlib import Path
import av
import argparse
import math

parser=argparse.ArgumentParser()
parser.add_argument('--video',default='out/No me creas.mp4')
parser.add_argument('--duration',type=float,default=190.9)
args=parser.parse_args()
source=Path(__file__).resolve().parent.parent/args.video
with av.open(str(source)) as c:
    last=-1
    count=0
    for frame in c.decode(video=0):
        assert frame.pts is not None and frame.pts > last, 'Non-increasing video timestamps'
        last=frame.pts
        count+=1
    assert count==math.ceil(args.duration*24), count
    print(f'Decoded all {count} video frames; timestamps strictly increase.',flush=True)
with av.open(str(source)) as c:
    seconds=0
    for frame in c.decode(audio=0):seconds+=frame.samples/frame.sample_rate
    assert abs(seconds-args.duration)<.1, seconds
    print(f'Decoded {seconds:.3f} seconds of audio.',flush=True)
