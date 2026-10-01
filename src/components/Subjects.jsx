import {useState} from 'react';import {motion,AnimatePresence} from 'framer-motion';import confetti from 'canvas-confetti';
import {D,ORDER,units,uid} from '../data';import {Ring} from '../ui';
export default function Subjects({done,setDone}){
  const [sub,setSub]=useState('chem');const d=D[sub];
  const cnt=s=>{const u=units(s);return {n:u.filter(x=>done[x.id]).length,t:u.length}};
  const toggle=(id,e)=>{const on=!done[id];setDone({...done,[id]:on});if(!on)return;
    const {n,t}=cnt(sub);const r=e.currentTarget.getBoundingClientRect();
    confetti({particleCount:n+1===t?220:45,spread:n+1===t?120:65,startVelocity:35,origin:{x:(r.left+r.width/2)/innerWidth,y:(r.top+r.height/2)/innerHeight},colors:[d.c,'#fff']});};
  return <div>
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">{ORDER.map((s,i)=>{const {n,t}=cnt(s),p=Math.round(n/t*100),on=s===sub;
      return <motion.button key={s} whileHover={{y:-6}} whileTap={{scale:.97}} onClick={()=>setSub(s)} className="glass p-5 text-left cursor-pointer" style={{borderColor:on?D[s].c:undefined,boxShadow:on?`0 0 40px -8px ${D[s].c}`:undefined}}>
        <div className="flex justify-between items-start"><div><div className="text-xs text-slate-400">Phase {i+1}</div><div className="font-display text-2xl font-bold">{D[s].n}</div><div className="text-sm text-slate-400 mt-1">{n}/{t} units</div></div>
        <Ring p={p} c={D[s].c} size={70} w={7}><span className="text-sm font-bold">{p}%</span></Ring></div></motion.button>})}</div>
    <AnimatePresence mode="wait"><motion.div key={sub} initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-12}} transition={{duration:.3}} style={{'--ac':d.c}}>
      {Object.entries(d.g).map(([g,arr])=><div key={g} className="mb-8"><div className="flex items-center gap-3 mb-3"><h3 className="font-display text-2xl font-bold">Grade {g}</h3><div className="flex-1 h-px bg-white/10"/><span className="text-sm text-slate-400">{arr.filter((_,i)=>done[uid(sub,g,i)]).length}/{arr.length}</span></div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">{arr.map((name,i)=>{const id=uid(sub,g,i),on=!!done[id];
          return <motion.button key={id} role="checkbox" aria-checked={on} whileHover={{x:4}} whileTap={{scale:.96}} onClick={e=>toggle(id,e)} className={'unit text-left '+(on?'d':'')}>
            <div className="chk"><AnimatePresence>{on&&<motion.span initial={{scale:0}} animate={{scale:1}} exit={{scale:0}}>✓</motion.span>}</AnimatePresence></div><span>{name}</span></motion.button>})}</div></div>)}
      <details className="card p-5"><summary>Common curriculum overlaps (reference only)</summary><p className="text-slate-400 mt-3 text-sm leading-relaxed">{d.ov}</p></details>
    </motion.div></AnimatePresence></div>;
}
