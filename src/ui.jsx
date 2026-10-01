import {useState,useEffect} from 'react';import {motion,animate} from 'framer-motion';
export function Ring({p,c,size=120,w=10,children}){
  const r=(size-w)/2,L=2*Math.PI*r;
  return <div className="relative grid place-items-center" style={{width:size,height:size}}>
    <svg width={size} height={size} className="-rotate-90"><circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,.08)" strokeWidth={w}/>
    <motion.circle cx={size/2} cy={size/2} r={r} fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeDasharray={L} initial={{strokeDashoffset:L}} animate={{strokeDashoffset:L*(1-Math.min(p,100)/100)}} transition={{duration:1.1,ease:'easeOut'}} style={{filter:`drop-shadow(0 0 8px ${c})`}}/></svg>
    <div className="absolute text-center">{children}</div></div>;
}
export function Spot({className='',children,...r}){
  const mv=e=>{const b=e.currentTarget.getBoundingClientRect();e.currentTarget.style.setProperty('--mx',e.clientX-b.left+'px');e.currentTarget.style.setProperty('--my',e.clientY-b.top+'px')};
  return <div onMouseMove={mv} className={'spot glass '+className} {...r}>{children}</div>;
}
export function Count({v}){
  const [n,setN]=useState(0);
  useEffect(()=>{const a=animate(n,v,{duration:.8,onUpdate:setN});return()=>a.stop()},[v]);
  return <>{Math.round(n)}</>;
}
export const Head=({t,s})=><div className="mb-8"><h2 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight">{t}</h2><p className="text-slate-400 mt-2 max-w-xl">{s}</p></div>;
