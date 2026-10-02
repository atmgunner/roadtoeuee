import React from 'react';

export default function PastPapers({ papers, setPapers }) {
  const years = Array.from({ length: 17 }, (_, i) => 2026 - i);
  const upd = (y, k, v) => setPapers({ ...papers, [y]: { c: "", t: 60, ...papers[y], [k]: v } });
  const pc = (p) => (p && p.c !== "" && +p.t > 0 ? Math.min(100, Math.round((+p.c / +p.t) * 100)) : null);
  const all = years.map((y) => pc(papers[y])).filter((x) => x !== null);
  const avg = all.length ? Math.round(all.reduce((a, b) => a + b, 0) / all.length) : null;
  const cls = (p) => (p >= 80 ? "gr" : p >= 60 ? "ye" : "rd");
  return (
    <div className="card">
      <div className="row sp"><h3>EUEE past papers, 2010–2026</h3>
        <span className="mu">{all.length} done{avg !== null ? ` · average ${avg}/100` : ""}</span></div>
      <div className="mu" style={{ margin: "6px 0 12px" }}>Enter correct answers and total questions. Green is 80 or above, yellow is 60–79, red is below 60.</div>
      {years.map((y) => {
        const p = papers[y]; const v = pc(p);
        return (
          <div className="pp" key={y}>
            <b>{y}</b>
            <input type="number" min="0" placeholder="Correct" aria-label={`${y} correct`} value={p ? p.c : ""} onChange={(e) => upd(y, "c", e.target.value)} />
            <input type="number" min="1" placeholder="Total" aria-label={`${y} total`} value={p ? p.t : 60} onChange={(e) => upd(y, "t", e.target.value)} />
            {v !== null ? <span className={"badge " + cls(v)}>{v}/100</span> : <span className="mu">Not scored</span>}
          </div>
        );
      })}
    </div>
  );
}