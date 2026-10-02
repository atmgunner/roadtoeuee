import { useState, useEffect } from 'react';
import { today, fmt } from '../data';

function useNow() {
  const [n, setN] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setN(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  return n;
}

const addMonths = (from, n) => {
  const d = new Date(from);
  const day = d.getDate();
  d.setDate(1);
  d.setMonth(d.getMonth() + n);
  d.setDate(Math.min(day, new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate()));
  return d;
};

export function calDiff(from, to) {
  if (to <= from) return { mo: 0, d: 0, h: 0, m: 0, s: 0 };
  let mo = (to.getFullYear() - from.getFullYear()) * 12 + to.getMonth() - from.getMonth();
  let anchor = addMonths(from, mo);
  if (anchor > to) { mo--; anchor = addMonths(from, mo); }
  const t = Math.floor((to - anchor) / 1000);
  return { mo, d: Math.floor(t / 86400), h: Math.floor((t % 86400) / 3600), m: Math.floor((t % 3600) / 60), s: t % 60 };
}

const split = (ms) => {
  const t = Math.max(0, Math.floor(ms / 1000));
  return { d: Math.floor(t / 86400), h: Math.floor((t % 86400) / 3600), m: Math.floor((t % 3600) / 60), s: t % 60 };
};

const Box = ({ v, l }) => (
  <div className="min-w-[58px] rounded-xl bg-white/5 py-2 text-center">
    <div className="font-display text-2xl sm:text-3xl font-extrabold tabular-nums">{String(v).padStart(2, '0')}</div>
    <div className="text-[10px] uppercase tracking-wider text-slate-400">{l}</div>
  </div>
);

export default function Countdowns({ stats, set, log }) {
  const now = useNow();
  const exam = set.exam ? new Date(set.exam + 'T08:00:00') : null;

  const end = new Date();
  end.setDate(end.getDate() + Math.max(stats.total - 1, 0));
  end.setHours(23, 59, 59, 0);

  const left = Math.max(0, set.daily - (log[today()] || 0));
  const late = exam && stats.total > 0 && end > exam;
  const gap = late ? Math.ceil((end - exam) / 864e5) : 0;
  const c = stats.total > 0 ? split(end - now) : null;

  return (
    <div className="glass px-6 py-4 mt-6 flex flex-wrap items-center justify-between gap-4" style={{ boxShadow: '0 0 40px -14px #22d3ee' }}>
      <div>
        <div className="flex items-center gap-2 font-semibold">
          <span className="size-2.5 rounded-full bg-cyan-400 animate-pulse" />
          Countdown to the end of your study plan
        </div>
        <div className="text-xs text-slate-400 mt-0.5">
          {c ? `Plan finishes ${fmt(end)} · ${left.toFixed(1)} h of study left today` : 'All units finished. Time to practise past papers.'}
        </div>
        {late && (
          <div className="text-amber-400 text-xs mt-1">
            Your plan ends {gap} day{gap > 1 ? 's' : ''} after the exam. Raise your daily hours to catch up.
          </div>
        )}
      </div>
      {c && (
        <div className="flex gap-2">
          <Box v={c.d} l="days" /><Box v={c.h} l="hours" /><Box v={c.m} l="min" /><Box v={c.s} l="sec" />
        </div>
      )}
    </div>
  );
}