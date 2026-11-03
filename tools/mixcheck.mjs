// node tools/mixcheck.mjs <url> : renders each Seedsong layer offline (mid-song, 10 s) and prints RMS/peak dBFS per layer.
// Used to keep the sampled instruments at the same loudness as the old synth mix.
import { spawn } from 'node:child_process'; import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path';
const url = process.argv[2], DBG = 9300 + Math.floor(Math.random() * 600);
const prof = fs.mkdtempSync(path.join(os.tmpdir(), 'ss-chrome-'));
const ch = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', ['--headless=new', `--remote-debugging-port=${DBG}`, `--user-data-dir=${prof}`, '--no-first-run', 'about:blank'], { stdio: 'ignore' });
const sleep = ms => new Promise(r => setTimeout(r, ms));
let tgt; for (let i = 0; i < 50 && !tgt; i++) { await sleep(200); try { tgt = (await (await fetch(`http://127.0.0.1:${DBG}/json`)).json()).find(t => t.type === 'page'); } catch {} }
const ws = new WebSocket(tgt.webSocketDebuggerUrl); await new Promise(r => ws.onopen = r);
let id = 0; const pend = {}; const exc = [];
ws.onmessage = m => { const d = JSON.parse(m.data); if (d.id && pend[d.id]) { pend[d.id](d); delete pend[d.id]; } if (d.method === 'Runtime.exceptionThrown') exc.push(d.params.exceptionDetails.exception?.description?.split('\n')[0]); };
const send = (method, params = {}) => new Promise(r => { pend[++id] = r; ws.send(JSON.stringify({ id, method, params })); });
await send('Runtime.enable'); await send('Page.navigate', { url }); await sleep(2500);
const expr = `(async () => {
  const SR = 44100, DUR = 10, out = {};
  for (const mask of ['heart', 'L0', 'L1', 'L2', 'L3', 'L4', 'melody', 'all']) {
    const off = new OfflineAudioContext(1, SR * DUR, SR);
    window.AudioContext = function () { return off; };
    ac = null; initAudio();
    if (typeof loadSamples === 'function') { smpReady = null; await loadSamples(); }
    const on = k => mask === 'all' || mask === k;
    layerGain.forEach((g, i) => g.gain.value = on('L' + i) ? 1 : 0);
    heartGain.gain.value = on('heart') ? 0.55 : 0; melodyBus.gain.value = on('melody') ? 0.9 : 0;
    const S = SG.build(SG.SONGS[0], 1), s0 = 16 * 16, n = Math.floor((DUR - 1.5) / S.stepDur);
    melodyBus._dly.delayTime.value = S.spb * 0.75;
    for (let k = 0; k < n; k++) scheduleStep(S, s0 + k, 0.1 + k * S.stepDur);
    const t0 = s0 * S.stepDur; for (const nt of S.notes) if (nt.t >= t0 && nt.t < t0 + DUR - 1.5) pluck(nt.midi, 0.1 + nt.t - t0, nt.harmony ? 0.6 : 1);
    const b = (await off.startRendering()).getChannelData(0);
    let ss = 0, pk = 0; for (const v of b) { ss += v * v; pk = Math.max(pk, Math.abs(v)); }
    out[mask] = { rms: +(10 * Math.log10(ss / b.length + 1e-12)).toFixed(1), peak: +(20 * Math.log10(pk + 1e-12)).toFixed(1) };
  }
  return out; })()`;
const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true });
console.log(JSON.stringify(r.result?.result?.value ?? r.result), exc.length ? 'EXC ' + exc.join(' | ') : '');
ws.close(); ch.kill(); await sleep(300); try { fs.rmSync(prof, { recursive: true, force: true }); } catch {}
