import {useMemo} from 'react';import {D,ORDER,units,today} from './data';import {useLocalStorage} from './hooks';import {Head} from './ui';
import Hero from './components/Hero';import Dashboard from './components/Dashboard';import Subjects from './components/Subjects';import ErrorLog from './components/ErrorLog';import PastPapers from './components/PastPapers';
export default function App(){
  const [s0,setSet]=useLocalStorage('euee.settings',{daily:5,hpu:8,exam:''}),set={exam:'',...s0};
  const [done,setDone]=useLocalStorage('euee.done',{}),[log,setLog]=useLocalStorage('euee.log',{}),[errs,setErrs]=useLocalStorage('euee.errs',[]),[papers,setPapers]=useLocalStorage('euee.papers',{});
  const stats=useMemo(()=>{let t=0,d=0;const per={};ORDER.forEach(s=>{const u=units(s),n=u.filter(x=>done[x.id]).length;per[s]={t:u.length,d:n};t+=u.length;d+=n});
    let off=0;const sch=ORDER.map(s=>{const left=per[s].t-per[s].d,days=Math.ceil(left*set.hpu/Math.max(set.daily,.5));const a=new Date();a.setDate(a.getDate()+off);const b=new Date();b.setDate(b.getDate()+off+Math.max(days-1,0));off+=days;return {s,left,days,a,b}});
    return {t,d,per,sch,total:off}},[done,s0]);
  const pct=Math.round(stats.d/stats.t*100);
  const hours=Object.values(log).reduce((a,b)=>a+b,0),scored=Object.values(papers).filter(p=>p.c!=='').length;
  const xp=Math.round(stats.d*100+hours*20+scored*50),level=Math.floor(Math.sqrt(xp/150))+1,base=150*(level-1)**2,lp=(xp-base)/(150*level**2-base)*100;
  let streak=0;{const d=new Date();for(let i=0;i<400;i++){if((log[d.toISOString().slice(0,10)]||0)>=set.daily)streak++;else if(i>0)break;d.setDate(d.getDate()-1)}}
  const days=set.exam?Math.max(0,Math.ceil((new Date(set.exam)-new Date())/864e5)):null;
  const nav=[['dash','Dashboard'],['subjects','Subjects'],['errors','Error log'],['papers','Past papers']];
  return <div className="relative text-slate-100 min-h-screen" style={{paddingTop:'env(safe-area-inset-top)'}}>
    <div className="blob w-[520px] h-[520px] bg-cyan-500 -top-40 -left-40"/><div className="blob w-[480px] h-[480px] bg-purple-600 top-1/3 -right-40" style={{animationDelay:'-6s'}}/><div className="blob w-[420px] h-[420px] bg-amber-500 bottom-0 left-1/4" style={{animationDelay:'-12s'}}/><div className="grain"/>
    <div className="fixed top-3 inset-x-3 z-20 flex justify-center" style={{top:'calc(12px + env(safe-area-inset-top))'}}><div className="glass !rounded-full flex items-center gap-1 pl-2 pr-2 py-1.5 max-w-full overflow-x-auto">
      <span className="font-display font-extrabold px-3 py-1 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 text-slate-900">ATM</span>
      {nav.map(([id,l])=><a key={id} href={'#'+id} className="px-3 py-1.5 rounded-full text-sm text-slate-300 hover:bg-white/10 hover:text-white whitespace-nowrap transition">{l}</a>)}
      <span className="text-xs text-slate-400 pl-2 whitespace-nowrap">Lv {level}</span></div></div>
    <main className="relative z-10 max-w-6xl mx-auto px-4">
      <Hero pct={pct} days={days} streak={streak} left={stats.t-stats.d}/>
      <section id="dash" className="py-16 scroll-mt-24"><Head t="Your command center" s="Log hours, run a focus session, and watch the schedule adjust as you finish units."/><Dashboard stats={stats} set={set} setSet={setSet} log={log} setLog={setLog} xp={xp} level={level} lp={lp}/></section>
      <section id="subjects" className="py-16 scroll-mt-24"><Head t="Chemistry first. Biology last." s="Four subjects, Grades 9–12 merged. Tick a unit and feel it land."/><Subjects done={done} setDone={setDone}/></section>
      <section id="errors" className="py-16 scroll-mt-24"><Head t="Mistake notebook" s="Every error you log is a mark you won't lose on exam day."/><ErrorLog errs={errs} setErrs={setErrs}/></section>
      <section id="papers" className="py-16 scroll-mt-24"><Head t="Past paper arena" s="EUEE 2010–2026. Enter your score and get an instant verdict."/><PastPapers papers={papers} setPapers={setPapers}/></section>
      <footer className="text-center text-sm text-slate-500 py-12">Created for ATM · Progress saves automatically in this browser</footer>
    </main></div>;
}
