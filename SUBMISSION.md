# Seedsong: Chroma Awards S2 submission kit (Game division, Music & Rhythm)

- Playable link (web, no download): https://arnavjhajharia.github.io/seedsong/
- DOWNLOAD LINK (gameplay video, paste as-is, no upload needed; strategist s29): https://arnavjhajharia.github.io/seedsong/video/seedsong-gameplay.mp4 (= lantern-tide-v2, 1080p)
- Source: https://github.com/arnavjhajharia/seedsong
- Gameplay videos (1080p, ~50-60 fps, game audio), in ventures/chroma-game/seedsong-media/:
  - NEWEST, RECOMMENDED: `seedsong-lantern-tide-v2-1080p.mp4` (builder s11): same wilt-and-recover run, plus the
    perfect-hit ripples. It shows the core mechanic best.
  - `seedsong-kite-static-wild-1080p.mp4` (80.8 s): a clean autoplay run, so the whole arrangement blooms.
  - `seedsong-lantern-tide-wilt-and-recover-1080p.mp4`: scripted mistakes mid-song, so the garden wilts and the
    layers drop out, then come back. It shows the core mechanic best. RECOMMENDED for the submission.
  (Old step, no longer needed: the recommended video is already hosted at the DOWNLOAD LINK above.)
  Re-record anytime with tools/capture.sh (headless Chrome + MediaRecorder; see the comments in the script).
- Category: Music & Rhythm. Deadline: Jan 7 2027. No entry fee.

## Title
Seedsong

## One-liner
A radial rhythm game where the song doesn't exist until you play it.

## Description (paste)
Seeds fly outward from a glowing core along four lanes. Hit each one as it crosses the ring. Every hit is the melody
note itself: if you miss, that note is missing from the song. Every hit also plants a flower in a night garden. As the
garden blooms, new layers join the arrangement: roots (bass), canopy (pads), rustle (drums), fireflies (arpeggio) and
aurora (bells). Misses wilt flowers and strip layers away, so you hear how well you play.

The lanes follow the melody's shape. When the melody rises, the next seed comes clockwise. When it falls, the seed
comes counter-clockwise. A repeated note jumps across the ring. After a few bars you start to read the music with
your hands.

Seedsong has three hand-tuned songs (Dawn Moss, Lantern Tide, Kite Static), each at three difficulties. Seed mode
lets you type any word, and a new song grows from it: its own tempo, mode, chord progression and melody.

All music is composed at runtime by the game's own procedural composer, then played in WebAudio on recorded
CC0 instrument samples (VSCO 2 Community Edition: harp, contrabass, violins, glockenspiel, drums). Controls: arrow keys, WASD, or tap the quadrants on a phone.

## Why it fits "Music & Rhythm" (paste after the description if there is room)
These follow the category page's three judging headings (chromaawards.com/prizes/game-music-rhythm, checked 2026-11-03):
- Sound as gameplay: every hit IS a melody note, so a missed seed is a missing note. The garden you grow decides
  which layers (bass, pads, drums, arpeggio, bells) are playing. You hear your score.
- Feel & feedback: the timing windows are ±50 ms (perfect) and ±100 ms (good). A perfect hit flashes the lane, throws
  a ripple and plants a flower. A miss wilts one and strips a layer away. There is an audio-offset slider and a tap-to-calibrate screen,
  and the timing accounts for the device's output latency.
- Craft: 3 hand-tuned songs x 3 difficulties, plus Seed mode (type any word and get a new song). Recorded CC0 orchestral samples,
  pause and mute buttons, and tap-quadrant controls on phones.

## Tools / AI disclosure (paste honestly)
The code was written with an AI coding assistant (Anthropic Claude). The music is not made by an AI music model:
it is generated at runtime by a deterministic procedural composer written for this game. The menu key art
(night-garden illustration) was generated with an image model on Higgsfield (gpt_image_2_5) from a prompt we wrote.
Third-party assets: CC0 instrument samples from VSCO 2 Community Edition (harp, contrabass, violins, glockenspiel,
kick/snare/tambourine/claves; licence file in the repo's audio/ folder). Nothing else third-party. The design, mechanics and song structure were directed by the entrant.
  [OWNER: before pasting, edit the 'directed by the entrant' wording to describe your real involvement accurately. The rules require "human-led storytelling" (same note as the FFN kit, scout s23). Agents wrote this line; don't submit a claim that isn't true.]
- Key art file for a thumbnail: ventures/chroma-game/seedsong-media/seedsong-keyart.png (1344x752).

## Owner steps (about 5 min)
1. Sign in at chromaawards.com and open the submission form (Game division).
2. Paste the title, link, description and disclosure above. Choose the Music & Rhythm category.
3. For the download/video field, paste the DOWNLOAD LINK at the top of this file (already hosted, nothing to upload).
4. Submit before Jan 7 2027.
