import { useState, useEffect, useRef } from 'react';
import { Ring } from '../ui';
import { useTicker } from '../useTicker';
import { unlockAudio, playChime } from '../sound';

const M = { focus: 25 * 60, break: 5 * 60 };

export default function Timer({ onFocusDone, onStatus = () => {} }) {
  const [mode, setMode] = useState('focus');
  const [left, setLeft] = useState(M.focus);
  const [run, setRun] = useState(false);
  const endAt = useRef(0);

  useTicker(run, () => setLeft(Math.max(0, Math.round((endAt.current - Date.now()) / 1000))));

  const toggle = () => {
    if (!run) { unlockAudio(); endAt.current = Date.now() + left * 1000; }
    setRun(!run);
  };

  useEffect(() => {
    if (left > 0) return;
    playChime();
    if (mode === 'focus') onFocusDone(25 / 60);
    const m = mode === 'focus' ? 'break' : 'focus';
    setMode(m);
    setLeft(M[m]);
    if (run) endAt.current = Date.now() + M[m] * 1000;
  }, [left]);

  const mm = String(Math.floor(left / 60)).padStart(2, '0');
  const ss = String(left % 60).padStart(2, '0');

  useEffect(() => {
    onStatus(run ? `${mm}:${ss} ${mode}` : '');
  }, [run, mm, ss, mode]);
  useEffect(() => () => onStatus(''), []);

  const c = mode === 'focus' ? '#f59e0b' : '#22c55e';

  return (
    <div className="flex flex-col items-center gap-4">
      <Ring p={(1 - left / M[mode]) * 100} c={c} size={190} w={12}>
        <div className="font-display text-5xl font-bold tabular-nums">{mm}:{ss}</div>
        <div className="text-xs text-slate-400">{mode === 'focus' ? 'deep focus' : 'break'}</div>
      </Ring>
      <div className="flex gap-2">
        <button className="btn" style={{ '--ac': c }} onClick={toggle}>{run ? 'Pause' : 'Start'}</button>
        <button className="btn g" onClick={() => { setRun(false); setLeft(M[mode]); }}>Reset</button>
        <button className="btn g" onClick={playChime}>Test sound</button>
      </div>
      <p className="text-xs text-slate-500 text-center">Each finished 25-minute session adds to today's hours and plays a chime.</p>
    </div>
  );
}