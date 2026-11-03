// Seedsong procedural composer + chart generator. Original music, generated from a seed.
// Works in the browser (window.SG) and in node (module.exports) so charts can be unit-tested.
(function (root) {
  const SCALES = {
    ionian: [0, 2, 4, 5, 7, 9, 11],
    dorian: [0, 2, 3, 5, 7, 9, 10],
    aeolian: [0, 2, 3, 5, 7, 8, 10],
    mixolydian: [0, 2, 4, 5, 7, 9, 10],
    lydian: [0, 2, 4, 6, 7, 9, 11],
  };

  function hash(str) {
    let h = 2166136261 >>> 0;
    for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }
  function rngFrom(seed) {
    let a = (typeof seed === 'number' ? seed : hash(String(seed))) >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  const pick = (r, arr) => arr[Math.floor(r() * arr.length)];

  // scale degree (can be negative / > 6) -> midi
  function degMidi(deg, root, scale) {
    const oct = Math.floor(deg / 7), i = ((deg % 7) + 7) % 7;
    return root + 12 * oct + scale[i];
  }

  // 16-step bar rhythm patterns by tier (0 easy, 1 normal, 2 hard)
  const PATTERNS = [
    [[0, 8], [0, 4, 8, 12], [0, 6, 12], [0, 4, 8], [0, 8, 12], [0, 12]],
    [[0, 4, 6, 8, 12], [0, 3, 6, 8, 12], [0, 4, 8, 10, 12], [0, 2, 4, 8, 12], [0, 6, 10, 12], [0, 4, 8, 12, 14], [0, 3, 6, 10, 12]],
    [[0, 2, 4, 6, 8, 10, 12, 14], [0, 3, 6, 8, 10, 12, 14], [0, 2, 3, 4, 8, 10, 11, 12], [0, 4, 6, 7, 8, 12, 14, 15], [0, 2, 4, 6, 8, 12, 13, 14], [0, 3, 4, 6, 8, 11, 12, 14]],
  ];

  const SONGS = [
    {
      id: 'dawn-moss', title: 'Dawn Moss', mood: 'slow bloom', seed: 'dawn-moss-1', bpm: 88, root: 50, mode: 'dorian',
      sections: [
        { bars: 2, prog: [0], notes: false },
        { bars: 8, prog: [0, 3, 0, 4], energy: 0 },
        { bars: 8, prog: [6, 3, 0, 0], energy: 1 },
        { bars: 8, prog: [0, 3, 0, 4], energy: 1 },
        { bars: 4, prog: [5, 6, 3, 0], energy: 2 },
        { bars: 2, prog: [0], notes: false },
      ],
    },
    {
      id: 'lantern-tide', title: 'Lantern Tide', mood: 'night current', seed: 'lantern-tide-7', bpm: 108, root: 45, mode: 'aeolian',
      sections: [
        { bars: 2, prog: [0], notes: false },
        { bars: 8, prog: [0, 5, 2, 6], energy: 0 },
        { bars: 8, prog: [3, 0, 4, 4], energy: 1 },
        { bars: 8, prog: [0, 5, 2, 6], energy: 1 },
        { bars: 8, prog: [5, 6, 0, 0, 3, 4, 0, 0], energy: 2 },
        { bars: 2, prog: [0], notes: false },
      ],
    },
    {
      id: 'kite-static', title: 'Kite Static', mood: 'bright wind', seed: 'kite-static-3', bpm: 126, root: 52, mode: 'mixolydian',
      sections: [
        { bars: 2, prog: [0], notes: false },
        { bars: 8, prog: [0, 6, 3, 0], energy: 0 },
        { bars: 8, prog: [3, 4, 6, 0], energy: 1 },
        { bars: 8, prog: [0, 6, 3, 0], energy: 2 },
        { bars: 8, prog: [5, 3, 6, 0, 5, 3, 4, 4], energy: 2 },
        { bars: 4, prog: [0, 6, 3, 0], energy: 1 },
        { bars: 2, prog: [0], notes: false },
      ],
    },
  ];

  // Build a whole new song definition from any text ("Seed mode").
  function songFromText(text) {
    const r = rngFrom('seed:' + text.trim().toLowerCase());
    const modes = Object.keys(SCALES);
    const progs = [[0, 3, 0, 4], [0, 5, 2, 6], [0, 6, 3, 0], [3, 4, 0, 0], [0, 2, 5, 4], [5, 3, 0, 4], [0, 4, 5, 3], [1, 4, 0, 0]];
    const a = pick(r, progs), b = pick(r, progs), c = pick(r, progs);
    return {
      id: 'seed-' + hash(text.trim().toLowerCase()).toString(36), title: '“' + text.trim().slice(0, 24) + '”', mood: 'grown from a seed',
      seed: 'user:' + text.trim().toLowerCase(), bpm: 84 + Math.floor(r() * 11) * 4, root: 43 + Math.floor(r() * 10),
      mode: pick(r, modes),
      sections: [
        { bars: 2, prog: [a[0]], notes: false },
        { bars: 8, prog: a, energy: 0 },
        { bars: 8, prog: b, energy: 1 },
        { bars: 8, prog: a, energy: 1 },
        { bars: 8, prog: c, energy: 2 },
        { bars: 2, prog: [a[0]], notes: false },
      ],
    };
  }

  // diff: 0 easy, 1 normal, 2 hard.
  // Returns {bpm, spb, step (sec per 16th), root, scale, bars:[{chord, section}], notes:[{t, step, lane, midi, deg}], totalSteps}
  function build(def, diff) {
    const r = rngFrom(def.seed + '|' + diff);
    const scale = SCALES[def.mode];
    const spb = 60 / def.bpm, stepDur = spb / 4;
    const melRoot = def.root + 12; // melody one octave above bass root
    const bars = [];
    const notes = [];
    let deg = 7, bar = 0;
    let lastLane = -1, lastStep = -999, prevDeg = 7;
    def.sections.forEach((sec, si) => {
      const tier = [[0, 0, 1], [0, 1, 1], [1, 2, 2]][diff][sec.energy || 0];
      // two-bar motif, re-rolled every 4 bars for variation
      let motif = null;
      for (let b = 0; b < sec.bars; b++, bar++) {
        const chord = sec.prog[b % sec.prog.length];
        bars.push({ chord, section: si, energy: sec.energy || 0, notes: sec.notes !== false });
        if (sec.notes === false) continue;
        if (b % 4 === 0) motif = [pick(r, PATTERNS[tier]), pick(r, PATTERNS[tier])];
        let pattern = motif[b % 2];
        if (b === sec.bars - 1 && b % 2 === 1) pattern = pattern.filter(s => s <= 8); // breathe at section end
        const chordTones = [chord, chord + 2, chord + 4];
        for (const s of pattern) {
          const strong = s % 4 === 0;
          if (strong) {
            // nearest chord tone (any octave) to current deg, avoiding a plain repeat on the downbeat sometimes
            let best = deg, bd = 99;
            for (let o = -1; o <= 2; o++) for (const ct of chordTones) {
              const d = ct + 7 * o;
              const dist = Math.abs(d - deg) + (d === deg && r() < 0.5 ? 2 : 0);
              if (dist < bd && d >= 3 && d <= 13) { bd = dist; best = d; }
            }
            deg = best;
          } else {
            const mv = pick(r, [-2, -1, -1, 1, 1, 2, 0]);
            deg = Math.max(3, Math.min(13, deg + mv));
          }
          const absStep = bar * 16 + s;
          // contour mapping: melody up = clockwise, down = counter-clockwise, repeat = jump across
          const mv = deg - prevDeg;
          const lane = lastLane < 0 ? 0 : (lastLane + (mv > 0 ? 1 : mv < 0 ? 3 : 2)) % 4;
          prevDeg = deg;
          notes.push({ step: absStep, t: absStep * stepDur, lane, deg, midi: degMidi(deg, melRoot, scale) });
          lastLane = lane; lastStep = absStep;
          // hard: harmony double on the downbeat of high-energy bars
          if (diff === 2 && s === 0 && (sec.energy || 0) >= 1 && b % 2 === 0) {
            const hd = deg - 2;
            notes.push({ step: absStep, t: absStep * stepDur, lane: (lane + 2) % 4, deg: hd, midi: degMidi(hd, melRoot, scale), harmony: true });
          }
        }
      }
    });
    notes.sort((a, b) => a.t - b.t || a.lane - b.lane);
    return { def, diff, bpm: def.bpm, spb, stepDur, root: def.root, melRoot, scale, bars, notes, totalSteps: bars.length * 16 };
  }

  const api = { SCALES, SONGS, build, songFromText, degMidi, rngFrom, hash };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.SG = api;
})(typeof window !== 'undefined' ? window : globalThis);
