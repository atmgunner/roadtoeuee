import React, { useState, useEffect } from 'react';
import { D, ORDER, TAGS, units, today } from '../data';

const PER = 6;

const shrink = (file) => new Promise((res, rej) => {
  const r = new FileReader();
  r.onerror = rej;
  r.onload = () => {
    const im = new Image();
    im.onerror = rej;
    im.onload = () => {
      const k = Math.min(1, 800 / Math.max(im.width, im.height));
      const c = document.createElement("canvas");
      c.width = im.width * k; c.height = im.height * k;
      c.getContext("2d").drawImage(im, 0, 0, c.width, c.height);
      res(c.toDataURL("image/jpeg", 0.7));
    };
    im.src = r.result;
  };
  r.readAsDataURL(file);
});

async function exportPDF(list) {
  const { jsPDF } = await import('jspdf');
  const SC = 2, PW = 595.28, PH = 841.89, M = 40, TW = PW - 2 * M;
  const FONT = '"Noto Sans Ethiopic","Nyala","Abyssinica SIL",system-ui,Arial,sans-serif';
  const pages = [];
  let cv, cx, y;

  const newPage = () => {
    cv = document.createElement('canvas');
    cv.width = Math.round(PW * SC); cv.height = Math.round(PH * SC);
    cx = cv.getContext('2d');
    cx.scale(SC, SC);
    cx.fillStyle = '#fff'; cx.fillRect(0, 0, PW, PH);
    cx.textBaseline = 'top';
    pages.push(cv); y = M;
  };
  const need = (h) => { if (y + h > PH - M) newPage(); };

  const wrap = (str, font) => {
    cx.font = font;
    const out = [];
    String(str).split('\n').forEach((par) => {
      let line = '';
      par.split(' ').forEach((word) => {
        const test = line ? line + ' ' + word : word;
        if (cx.measureText(test).width <= TW) { line = test; return; }
        if (line) out.push(line);
        let chunk = '';
        for (const ch of word) {
          if (cx.measureText(chunk + ch).width > TW) { out.push(chunk); chunk = ch; } else chunk += ch;
        }
        line = chunk;
      });
      out.push(line);
    });
    return out;
  };
  const text = (str, font, color, lh) => {
    wrap(str, font).forEach((l) => {
      need(lh);
      cx.font = font; cx.fillStyle = color;
      cx.fillText(l, M, y); y += lh;
    });
  };
  const load = (src) => new Promise((res) => {
    const im = new Image();
    im.onload = () => res(im); im.onerror = () => res(null); im.src = src;
  });

  newPage();
  text('EUEE Mistake Notebook', `700 22px ${FONT}`, '#111', 30);
  text(`${list.length} entries · ${today()}`, `13px ${FONT}`, '#777', 24);

  for (let i = 0; i < list.length; i++) {
    const e = list[i];
    need(80);
    cx.strokeStyle = '#d4d4d8'; cx.beginPath(); cx.moveTo(M, y); cx.lineTo(PW - M, y); cx.stroke();
    y += 12;
    text(`${i + 1}. ${D[e.s].n} · ${e.unit}`, `700 15px ${FONT}`, '#111', 20);
    text(`${e.tag} · ${e.date}`, `12px ${FONT}`, '#777', 18);
    if (e.img) {
      const im = await load(e.img);
      if (im) {
        let w = Math.min(TW, im.width), h = (w * im.height) / im.width;
        if (h > 300) { h = 300; w = (h * im.width) / im.height; }
        need(h + 8); cx.drawImage(im, M, y, w, h); y += h + 8;
      }
    }
    if (e.note) text(e.note, `14px ${FONT}`, '#222', 20);
    y += 14;
  }

  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  pages.forEach((p, i) => {
    if (i) doc.addPage();
    doc.addImage(p.toDataURL('image/jpeg', 0.92), 'JPEG', 0, 0, PW, PH);
  });
  doc.save(`EUEE-mistakes-${today()}.pdf`);
}

export default function ErrorLog({ errs, setErrs }) {
  const blank = { s: "chem", unit: "", img: "", note: "", tag: TAGS[0] };
  const [f, setF] = useState(blank);
  const [fs, setFs] = useState("all");
  const [ft, setFt] = useState("all");
  const [msg, setMsg] = useState("");
  const [open, setOpen] = useState(null);
  const [page, setPage] = useState(0);
  const [busy, setBusy] = useState(false);

  useEffect(() => { setPage(0); setOpen(null); }, [fs, ft]);

  const shown = errs.filter((e) => (fs === "all" || e.s === fs) && (ft === "all" || e.tag === ft));
  const pages = Math.max(1, Math.ceil(shown.length / PER));
  const cur = Math.min(page, pages - 1);
  const slice = shown.slice(cur * PER, cur * PER + PER);

  const add = () => {
    if (!f.note.trim() && !f.img) { setMsg("Add a note or a question image first."); return; }
    setErrs([{ ...f, unit: f.unit || "General", id: Date.now(), date: today() }, ...errs]);
    setF({ ...blank, s: f.s }); setMsg(""); setPage(0);
  };
  const pick = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try { setF({ ...f, img: await shrink(file) }); } catch (err) { setMsg("Could not read that image."); }
  };

  return (
    <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", alignItems: "start" }}>
      <div className="card">
        <h3 style={{ marginBottom: 12 }}>Log a mistake</h3>
        <div className="g2">
          <div><label>Subject</label>
            <select value={f.s} onChange={(e) => setF({ ...f, s: e.target.value, unit: "" })}>
              {ORDER.map((s) => <option key={s} value={s}>{D[s].n}</option>)}</select></div>
          <div><label>Unit</label>
            <select value={f.unit} onChange={(e) => setF({ ...f, unit: e.target.value })}>
              <option value="">Select unit</option>
              {units(f.s).map((o) => <option key={o.id} value={`G${o.g} ${o.u}`}>G{o.g} {o.u}</option>)}</select></div>
        </div>
        <label style={{ marginTop: 12 }}>Question image</label>
        <input type="file" accept="image/*" onChange={pick} />
        {f.img && <img className="q" src={f.img} alt="Preview of uploaded question" />}
        <label style={{ marginTop: 12 }}>Misconception / key note</label>
        <textarea rows="3" value={f.note} onChange={(e) => setF({ ...f, note: e.target.value })} />
        <div className="row" style={{ margin: "12px 0" }}>
          {TAGS.map((t) => <button key={t} className={"pill" + (f.tag === t ? " on" : "")} onClick={() => setF({ ...f, tag: t })}>{t}</button>)}
        </div>
        {msg && <div style={{ color: "#f87171", marginBottom: 8 }}>{msg}</div>}
        <button className="btn" onClick={add}>Save to error log</button>
      </div>

      <div>
        <div className="row" style={{ marginBottom: 12 }}>
          <select style={{ flex: 1, minWidth: 120 }} value={fs} onChange={(e) => setFs(e.target.value)}>
            <option value="all">All subjects</option>{ORDER.map((s) => <option key={s} value={s}>{D[s].n}</option>)}</select>
          <select style={{ flex: 1, minWidth: 120 }} value={ft} onChange={(e) => setFt(e.target.value)}>
            <option value="all">All tags</option>{TAGS.map((t) => <option key={t}>{t}</option>)}</select>
          <button className="btn g disabled:opacity-40" disabled={!shown.length || busy}
            onClick={async () => {
              setBusy(true);
              try { await exportPDF(shown); }
              catch (e) { console.error(e); setMsg('PDF export failed. Check the console.'); }
              setBusy(false);
            }}>
            {busy ? 'Preparing…' : `Download PDF (${shown.length})`}
          </button>
        </div>

        {!shown.length ? (
          <div className="card mu">No errors logged here yet. Add one from the form.</div>
        ) : (
          <div className="card !p-0 overflow-hidden">
            {slice.map((e) => {
              const o = open === e.id;
              return (
                <div key={e.id} className="border-b border-white/5 last:border-0">
                  <button aria-expanded={o} onClick={() => setOpen(o ? null : e.id)}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/5 transition">
                    <span className="size-2.5 rounded-full shrink-0" style={{ background: D[e.s].c, boxShadow: `0 0 8px ${D[e.s].c}` }} />
                    <span className="flex-1 min-w-0">
                      <span className="block truncate font-medium">{e.unit}</span>
                      <span className="block truncate text-xs text-slate-400">{D[e.s].n} · {e.date}</span>
                    </span>
                    {e.img && <span title="Has image">🖼</span>}
                    <span className="pill on hidden sm:inline-block" style={{ "--ac": D[e.s].c }}>{e.tag}</span>
                    <span className={"text-slate-400 transition-transform " + (o ? "rotate-90" : "")}>›</span>
                  </button>
                  {o && (
                    <div className="px-4 pb-4">
                      <span className="pill on sm:hidden" style={{ "--ac": D[e.s].c }}>{e.tag}</span>
                      {e.img && <img className="q" src={e.img} alt="Logged question" />}
                      {e.note && <p style={{ margin: "8px 0", whiteSpace: "pre-wrap" }}>{e.note}</p>}
                      <button className="pill" onClick={() => { setErrs(errs.filter((x) => x.id !== e.id)); setOpen(null); }}>Delete</button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {shown.length > PER && (
          <div className="row sp" style={{ marginTop: 12 }}>
            <button className="btn g disabled:opacity-40" disabled={cur === 0} onClick={() => { setPage(cur - 1); setOpen(null); }}>‹ Prev</button>
            <span className="mu">Page {cur + 1} of {pages} · {shown.length} entries</span>
            <button className="btn g disabled:opacity-40" disabled={cur >= pages - 1} onClick={() => { setPage(cur + 1); setOpen(null); }}>Next ›</button>
          </div>
        )}
      </div>
    </div>
  );
}