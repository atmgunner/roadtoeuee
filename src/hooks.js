import {useState,useEffect} from 'react';
export function useLocalStorage(key,init){
  const [v,setV]=useState(()=>{try{const x=localStorage.getItem(key);return x?JSON.parse(x):init}catch(e){return init}});
  useEffect(()=>{try{localStorage.setItem(key,JSON.stringify(v))}catch(e){console.error('Storage failed',e)}},[key,v]);
  return [v,setV];
}
