# Encode screencast frames (from record.mjs) into an H.264 MP4 at constant 30 fps.
# python scripts/encode.py <framesDir> <out.mp4>
import json, os, subprocess, sys
import imageio_ffmpeg

frames_dir, out = sys.argv[1], sys.argv[2]
ts = json.load(open(os.path.join(frames_dir, 'timestamps.json')))
lines = ['ffconcat version 1.0']
for i, t in enumerate(ts):
    dur = (ts[i + 1] - t) if i + 1 < len(ts) else 1.0
    lines += [f"file 'f{i:05d}.jpg'", f'duration {max(dur, 0.001):.4f}']
lines.append(f"file 'f{len(ts) - 1:05d}.jpg'")
lst = os.path.join(frames_dir, 'list.ffconcat')
open(lst, 'w').write('\n'.join(lines))

ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
subprocess.run([
    ffmpeg, '-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', lst,
    '-vf', 'fps=30,scale=trunc(iw/2)*2:trunc(ih/2)*2,format=yuv420p',
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '20', '-movflags', '+faststart', out,
], check=True)
print(out, round(os.path.getsize(out) / 1e6, 1), 'MB')
