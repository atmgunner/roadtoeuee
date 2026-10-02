import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Ring, Count } from '../ui';

const Q = [
  'Every unit you finish removes one more obstacle between you and the seat you want.',
  'Discipline is choosing future you, again, one focused hour at a time.',
  'Small ticks. Big rank.',
  'You are not behind. You are one focused session away.',
  'Study like the paper is tomorrow.',
];

export default function Hero({ pct, days, streak, left }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((x) => (x + 1) % Q.length), 5500);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="grid lg:grid-cols-[1.25fr_1fr] gap-10 items-center pt-10 pb-16">
      <div>
        <div className="inline-flex items-center gap-2 text-sm text-slate-300 glass !rounded-full px-4 py-1.5 mb-6">
          <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
          EUEE Natural Science · Created for test takers
        </div>
        <h1 className="font-display font-extrabold tracking-tighter leading-[.95] text-5xl sm:text-7xl">
          Welcome back, <span className="gt">test takers.</span>
        </h1>
        <div className="h-16 mt-6 max-w-lg">
          <AnimatePresence mode="wait">
            <motion.p key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="text-lg text-slate-300">
              {Q[i]}
            </motion.p>
          </AnimatePresence>
        </div>
        <div className="flex flex-wrap gap-3 mt-4">
          <a href="#focus" className="btn !px-6 !py-3 !rounded-full">Start a focus session</a>
          <a href="#subjects" className="btn g !px-6 !py-3 !rounded-full">Open my units</a>
        </div>
      </div>

      <motion.div initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', damping: 15 }} className="glass p-8 grid place-items-center relative">
        <Ring p={pct} c="#22d3ee" size={250} w={16}>
          <div className="font-display text-6xl font-extrabold"><Count v={pct} />%</div>
          <div className="text-slate-400 text-sm">curriculum mastered</div>
        </Ring>
        <div className="flex gap-3 mt-6 w-full">
          <div className="flex-1 text-center rounded-2xl bg-white/5 py-3">
            <div className="text-2xl font-bold">🔥 {streak}</div>
            <div className="text-xs text-slate-400">day streak</div>
          </div>
          <div className="flex-1 text-center rounded-2xl bg-white/5 py-3">
            <div className="text-2xl font-bold">{days === null ? '—' : days}</div>
            <div className="text-xs text-slate-400">{days === null ? 'set exam date' : 'days to EUEE'}</div>
          </div>
          <div className="flex-1 text-center rounded-2xl bg-white/5 py-3">
            <div className="text-2xl font-bold">{left}</div>
            <div className="text-xs text-slate-400">units left</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}