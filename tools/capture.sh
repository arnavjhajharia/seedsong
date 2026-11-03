#!/bin/sh
# Record a 1080p gameplay trailer with game audio. Usage: tools/capture.sh <song 0-2> <diff 0-2> <name> [slip]
# Needs: python3 -m http.server 8765 in the seedsong folder, and tools/put_server.py <outdir> running (port 8766).
CH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
exec "$CH" --headless=new --user-data-dir=/tmp/seedsong-cap-$$ --window-size=1920,1080 --autoplay-policy=no-user-gesture-required \
  --no-first-run --mute-audio --enable-gpu --use-angle=metal --disable-background-timer-throttling --disable-renderer-backgrounding \
  "http://localhost:8765/?demo=1&song=$1&diff=$2&slip=${4:-0}&rw=1920&rh=1080&record=http://localhost:8766/$3.webm"
# Chrome stays open: kill it after the .webm appears (song length + ~4 s), then:
# ffmpeg -i x.webm -vf fps=60 -c:v libx264 -crf 20 -pix_fmt yuv420p -c:a aac -b:a 192k -movflags +faststart x.mp4
