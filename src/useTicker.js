import { useEffect, useRef } from 'react';
export function useTicker(active, cb, ms = 500) {
  const ref = useRef(cb);
  ref.current = cb;
  useEffect(() => {
    if (!active) return;
    let w, id;
    try {
      w = new Worker(URL.createObjectURL(new Blob([`setInterval(()=>postMessage(0),${ms})`], { type: 'text/javascript' })));
      w.onmessage = () => ref.current();
    } catch (e) {
      id = setInterval(() => ref.current(), ms);
    }
    return () => { if (w) w.terminate(); if (id) clearInterval(id); };
  }, [active, ms]);
}