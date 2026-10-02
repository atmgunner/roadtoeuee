import { useState, useRef } from 'react';
import { Ring } from '../ui';
import { useTicker } from '../useTicker';
import { unlockAudio, playAlarm } from '../sound';

const PRESETS = [30, 60, 90, 120, 180];

export default function PaperTimer() {
  const [mins, setMins] = useState(120);
  const [left, setLeft] = useState(120 * 60);
  const [run, setRun] = useState(false);
  const endAt = useRef(0);

  useTicker(run, () => {
    const l = Math.max(0, Math.round((endAt.current - Date.now()) / 1000));
    setLeft(l);
    if (l === 0) { setRun(false); playAlarm(); }
  });

  const toggle = () => {
    if (!run) { unlockAudio(); endAt.current = Date.now() + left * 1000; }
    setRun(!run);
  };
  const pick = (v) => { setRun(false); setMins(v); setLeft(v * 60); };

  const pct = (left / (mins * 60)) * 100;
  const c = pct <= 10 ? '#ef4444' : pct <= 25 ? '#f59e0b' : '#22d3ee';
  const h = Math.floor(left / 3600);
  const m = String(Math.floor((left % 3600) / 60)).padStart(2, '0');
  const s = String(left % 60).padStart(2, '0');

  return (
    <div className="card p-6 flex flex-col md:flex-row items-center gap-8">
      <Ring p={pct} c={c} size={200} w={13}>
        <div className="font-display text-3xl font-bold tabular-nums">{h}:{m}:{s}</div>
        <div className="text-xs text-slate-400">{left === 0 ? "time's up" : 'time remaining'}</div>
      </Ring>
      <div className="flex-1 w-full">
        <div className="font-semibold mb-1">Paper countdown</div>
        <p className="text-sm text-slate-400 mb-4">Set the exam length, start the clock, and practise under real pressure. An alarm sounds when time is up.</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {PRESETS.map((p) => (
            <button key={p} className={'pill' + (mins === p ? ' on' : '')} onClick={() => pick(p)}>{p} min</button>
          ))}
          <input type="number" min="1" max="300" value={mins} aria-label="Custom minutes"
            onChange={(e) => pick(Math.min(300, Math.max(1, +e.target.value || 1)))} style={{ width: 90 }} />
        </div>
        <div className="flex gap-2 flex-wrap">
          <button className="btn" style={{ '--ac': c }} onClick={toggle} disabled={left === 0}>
            {run ? 'Pause' : left === mins * 60 ? 'Start paper' : 'Resume'}
          </button>
          <button className="btn g" onClick={() => pick(mins)}>Reset</button>
          <button className="btn g" onClick={playAlarm}>Test sound</button>
        </div>
        {left === 0 && <div className="mt-3 text-red-400 font-semibold">Time's up. Stop writing and mark your paper.</div>}
        {run && pct <= 10 && left > 0 && <div className="mt-3 text-amber-400 text-sm">Final stretch. Check your answers.</div>}
      </div>
    </div>
  );
}