const SG = require('./songgen.js');
let fail = 0;
const ok = (c, m) => { if (!c) { fail++; console.log('FAIL', m); } };
const defs = [...SG.SONGS, SG.songFromText('hello world'), SG.songFromText('monsoon')];
for (const def of defs) for (const d of [0, 1, 2]) {
  const s = SG.build(def, d);
  const dur = s.totalSteps * s.stepDur;
  const lanes = [0,0,0,0]; s.notes.forEach(n => lanes[n.lane]++);
  const nps = s.notes.length / dur;
  // jacks
  const last = [-9,-9,-9,-9]; let jacks = 0;
  for (const n of s.notes) { if (n.t - last[n.lane] < 0.12) jacks++; last[n.lane] = n.t; }
  ok(jacks === 0, `${def.id} d${d} jacks=${jacks}`);
  ok(dur > 60 && dur < 110, `${def.id} duration ${dur}`);
  ok(Math.min(...lanes) > s.notes.length * 0.12, `${def.id} d${d} lane balance ${lanes}`);
  ok(s.notes.every(n => n.midi >= 50 && n.midi <= 96), `${def.id} midi range`);
  // determinism
  ok(JSON.stringify(SG.build(def, d).notes) === JSON.stringify(s.notes), 'deterministic');
  console.log(def.id.padEnd(16), 'd'+d, 'notes', String(s.notes.length).padStart(3), 'dur', dur.toFixed(1)+'s', 'nps', nps.toFixed(2), 'lanes', lanes.join('/'));
}
console.log(fail ? fail + ' FAILED' : 'ALL PASS');
process.exit(fail ? 1 : 0);
