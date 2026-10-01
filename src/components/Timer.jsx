import {useState,useEffect} from 'react';import {Ring} from '../ui';
const M={focus:25*60,break:5*60};
export default function Timer({onFocusDone}){
  const [mode,setMode]=useState('focus'),[left,setLeft]=useState(M.focus),[run,setRun]=useState(false);
  useEffect(()=>{if(!run)return;const id=setInterval(()=>setLeft(l=>l-1),1000);return()=>clearInterval(id)},[run]);
  useEffect(()=>{if(left>0)return;if(mode==='focus')onFocusDone(25/60);const m=mode==='focus'?'break':'focus';setMode(m);setLeft(M[m])},[left]);
  const mm=String(Math.floor(left/60)).padStart(2,'0'),ss=String(left%60).padStart(2,'0');
  useEffect(()=>{document.title=run?`${mm}:${ss} · ${mode}`:'EUEE Planner · ATM'});
  const c=mode==='focus'?'#f59e0b':'#22c55e';
  return <div className="flex flex-col items-center gap-4">
    <Ring p={(1-left/M[mode])*100} c={c} size={190} w={12}><div className="font-display text-5xl font-bold tabular-nums">{mm}:{ss}</div><div className="text-xs text-slate-400">{mode==='focus'?'deep focus':'break'}</div></Ring>
    <div className="flex gap-2"><button className="btn" style={{'--ac':c}} onClick={()=>setRun(!run)}>{run?'Pause':'Start'}</button>
    <button className="btn g" onClick={()=>{setRun(false);setLeft(M[mode])}}>Reset</button></div>
    <p className="text-xs text-slate-500 text-center">Each finished 25-minute session adds to today's hours automatically.</p></div>;
}
