import {useState} from 'react';import {D,today,fmt} from '../data';import {Ring,Spot,Count} from '../ui';import Timer from './Timer';
export default function Dashboard({stats,set,setSet,log,setLog,xp,level,lp,onFocusStatus}){
  const [d,setD]=useState(set),[ok,setOk]=useState(false);const t=today(),h=log[t]||0,hp=Math.round(h/set.daily*100);
  const add=v=>setLog(l=>({...l,[t]:Math.max(0,+((l[t]||0)+v).toFixed(2))}));
  const end=new Date();end.setDate(end.getDate()+Math.max(stats.total-1,0));
  const setExam=v=>{setD(x=>({...x,exam:v}));setSet(s=>({...s,exam:v}))};
  return <div className="grid md:grid-cols-3 gap-5">
    <Spot className="p-6 flex flex-col items-center gap-4"><div className="self-start font-semibold">Today's hours</div>
      <Ring p={hp} c={hp>=100?'#22c55e':'#f59e0b'} size={190} w={12}><div className="font-display text-5xl font-bold">{h.toFixed(1)}</div><div className="text-xs text-slate-400">of {set.daily} h target</div></Ring>
      <div className="flex gap-2 flex-wrap justify-center"><button className="btn g" onClick={()=>add(-.5)}>−0.5h</button><button className="btn" onClick={()=>add(.5)}>+0.5h</button><button className="btn g" onClick={()=>add(1)}>+1h</button></div>
      {hp>=100&&<div className="text-emerald-400 text-sm font-semibold">Daily target smashed 🎯</div>}</Spot>
    <Spot id="focus" className="p-6 scroll-mt-28"><div className="font-semibold mb-4">Focus timer</div><Timer onFocusDone={add} onStatus={onFocusStatus}/></Spot>
    <Spot className="p-6 flex flex-col gap-3"><div className="font-semibold">Level</div>
      <div className="font-display text-7xl font-extrabold gt">{level}</div>
      <div className="h-3 rounded-full bg-white/10 overflow-hidden"><div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 transition-all duration-700" style={{width:lp+'%'}}/></div>
      <div className="text-sm text-slate-400"><Count v={xp}/> XP · units 100, hours 20 each, papers 50</div></Spot>
    <Spot className="p-6 md:col-span-2"><div className="flex justify-between items-baseline flex-wrap gap-2"><div className="font-semibold">Auto schedule</div><div className="text-sm text-slate-400">{stats.total>0?`Finish by ${fmt(end)} · ${stats.total} days`:'All units finished'}</div></div>
      <div className="flex h-4 rounded-full overflow-hidden my-4 bg-white/5">{stats.sch.map(x=><div key={x.s} title={D[x.s].n} style={{flex:x.days||0.001,background:D[x.s].c}} className="transition-all duration-700"/>)}</div>
      {stats.sch.map(x=><div key={x.s} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0"><span className="size-3 rounded-full" style={{background:D[x.s].c,boxShadow:`0 0 10px ${D[x.s].c}`}}/><div className="flex-1"><b>{D[x.s].n}</b><div className="text-xs text-slate-400">{x.left} units · {x.days} days</div></div><span className="text-sm text-slate-400">{x.days?`${fmt(x.a)} – ${fmt(x.b)}`:'Done'}</span></div>)}</Spot>
    <Spot className="p-6"><div className="font-semibold mb-3">Daily settings</div>
      <div className="grid gap-3"><div><label>Hours per day</label><input type="number" min=".5" max="16" step=".5" value={d.daily} onChange={e=>setD({...d,daily:+e.target.value||1})}/></div>
      <div><label>Hours per unit</label><input type="number" min="1" max="40" value={d.hpu} onChange={e=>setD({...d,hpu:+e.target.value||1})}/></div>
      <div><label>EUEE date (applies instantly)</label><div className="flex gap-2"><input type="date" value={d.exam||''} onChange={e=>setExam(e.target.value)}/>{d.exam&&<button className="pill" onClick={()=>setExam('')}>Clear</button>}</div></div>
      <button className="btn" onClick={()=>{setSet({...d});setOk(true);setTimeout(()=>setOk(false),1500)}}>{ok?'Saved ✓':'Save daily settings'}</button></div></Spot>
  </div>;
}