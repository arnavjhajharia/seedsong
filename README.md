# Seedsong

**Play:** [Playgama](https://playgama.ai/play/h2lla7p4eujkc6) · [GitHub Pages](https://arnavjhajharia.github.io/seedsong/) · [devlog: the procedural composer](https://dev.to/bharat_ankh_920bf0864220a/i-made-a-rhythm-game-where-the-song-doesnt-exist-until-you-play-it-160-lines-of-procedural-2pph)

A radial rhythm game where **the song doesn't exist until you play it**.

- Seeds fly out from the centre along 4 lanes; hit them as they cross the ring (arrows / WASD / tap).
- Every hit *is* the melody note: miss it and that note is simply absent from the song.
- Every hit plants a flower. As the garden blooms, new layers join the arrangement:
  roots (bass) → canopy (pads) → rustle (drums) → fireflies (arpeggio) → aurora (bells). Misses wilt flowers and strip layers.
- Lanes follow the melody contour: melody goes up = next lane clockwise, down = counter-clockwise, repeat = jump across.
- 3 hand-tuned songs + **seed mode**: type any word and a brand-new song (tempo, mode, chords, melody) grows from it.
- 100% procedural WebAudio: original music, no samples, no assets, no build step, no downloads.

Play: https://arnavjhajharia.github.io/seedsong/
Autoplay/trailer capture: `?demo=1&song=0..2&diff=0..2` (or `&seed=word`).

Built for Chroma Awards S2, Game division, Music & Rhythm category.
AI disclosure: code written with an AI coding assistant (Claude); all music is generated at runtime by the game's own
procedural composer (`songgen.js`), not by an AI music model.

Tests: `node test.js` (chart sanity: no same-lane jacks <120 ms, lane balance, duration, determinism).
