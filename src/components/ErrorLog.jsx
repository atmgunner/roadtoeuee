import React,{useState} from 'react';
import {D,ORDER,TAGS,units,today} from '../data';

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

export default function ErrorLog({ errs, setErrs }) {
  const blank = { s: "chem", unit: "", img: "", note: "", tag: TAGS[0] };
  const [f, setF] = useState(blank);
  const [fs, setFs] = useState("all");
  const [ft, setFt] = useState("all");
  const [msg, setMsg] = useState("");
  const shown = errs.filter((e) => (fs === "all" || e.s === fs) && (ft === "all" || e.tag === ft));
  const add = () => {
    if (!f.note.trim() && !f.img) { setMsg("Add a note or a question image first."); return; }
    setErrs([{ ...f, unit: f.unit || "General", id: Date.now(), date: today() }, ...errs]);
    setF({ ...blank, s: f.s }); setMsg("");
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
          <select style={{ flex: 1 }} value={fs} onChange={(e) => setFs(e.target.value)}>
            <option value="all">All subjects</option>{ORDER.map((s) => <option key={s} value={s}>{D[s].n}</option>)}</select>
          <select style={{ flex: 1 }} value={ft} onChange={(e) => setFt(e.target.value)}>
            <option value="all">All tags</option>{TAGS.map((t) => <option key={t}>{t}</option>)}</select>
        </div>
        {!shown.length && <div className="card mu">No errors logged here yet. Add one from the form.</div>}
        <div style={{ display: "grid", gap: 12 }}>
          {shown.map((e) => (
            <div className="card hov" key={e.id} style={{ "--ac": D[e.s].c }}>
              <div className="row sp"><b style={{ color: D[e.s].c }}>{D[e.s].n}</b><span className="mu">{e.date}</span></div>
              <div className="mu">{e.unit}</div>
              {e.img && <img className="q" src={e.img} alt="Logged question" />}
              <p style={{ margin: "8px 0", whiteSpace: "pre-wrap" }}>{e.note}</p>
              <div className="row sp"><span className="pill on">{e.tag}</span>
                <button className="pill" onClick={() => setErrs(errs.filter((x) => x.id !== e.id))}>Delete</button></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

