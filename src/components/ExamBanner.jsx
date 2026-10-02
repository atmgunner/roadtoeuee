import { useState, useEffect } from 'react';
import { calDiff } from './Countdowns';
import { fmt } from '../data';

const p2 = (n) => String(n).padStart(2, '0');

export default function ExamBanner({ exam }) {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    if (!exam) return;
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, [exam]);

  const t = exam ? new Date(exam + 'T08:00:00') : null;

  if (!t) {
    return (
      <a href="#dash" className="glass block px-6 py-4 text-slate-300 hover:text-white transition">
        Set your EUEE date in Daily settings to start the live countdown →
      </a>
    );
  }
  if (t <= now) {
    return <div className="glass px-6 py-4 font-semibold text-rose-400">The EUEE date has arrived. Good luck!</div>;
  }

  const c = calDiff(now, t);
  const boxes = [[c.mo, 'months'], [c.d, 'days'], [p2(c.h), 'hours'], [p2(c.m), 'min'], [p2(c.s), 'sec']];
  return (
    <div className="glass px-6 py-4 flex flex-wrap items-center justify-between gap-4" style={{ boxShadow: '0 0 40px -14px #f43f5e' }}>
      <div>
        <div className="flex items-center gap-2 font-semibold">
          <span className="size-2.5 rounded-full bg-rose-500 animate-pulse" />
          Countdown to the EUEE
        </div>
        <div className="text-xs text-slate-400 mt-0.5">Exam day: {fmt(t)}, 8:00 AM</div>
      </div>
      <div className="flex gap-2">
        {boxes.map(([v, l]) => (
          <div key={l} className="min-w-[58px] rounded-xl bg-white/5 py-2 text-center">
            <div className="font-display text-2xl sm:text-3xl font-extrabold tabular-nums">{v}</div>
            <div className="text-[10px] uppercase tracking-wider text-slate-400">{l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}