import React, { useState, useEffect } from "react";
import { tackOf } from "./duelighed.js";

/* ------------------------------------------------------------------ */
/*  Duelighed — scenario-tegning + spørgsmålstyper + runde-motor       */
/* ------------------------------------------------------------------ */
/*
 * Tegningen følger Marking-invarianten: ingen permanent C.accent/C.gold på
 * noget der kan læses som "svaret". Bådene er neutrale (steel/sail), vinden
 * er tekst + pil i steel. Halse udledes af vind + kurs i tegningen (bommen
 * tegnes i læ), aldrig hardcodet.
 */

const ROUND = 12;
const KEY = (sec) => `sejl-quiz:due:${sec}`;
function loadWeak(sec) { try { const v = JSON.parse(localStorage.getItem(KEY(sec)) || "{}"); return v && typeof v === "object" && !Array.isArray(v) ? v : {}; } catch { return {}; } }
function saveWeak(sec, w) { try { localStorage.setItem(KEY(sec), JSON.stringify(w)); } catch {} }
function shuffle(a) { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }

/* ---------- Båd set ovenfra. Tegnes med stævnen mod +y lokal, roteres med hdg. ---------- */
function Boat({ C, kind, hdg, x, y, wind, label }) {
  // Bommen står i LÆ: vinden ind over styrbord => bom ud til bagbord (venstre set fra agter).
  const tack = tackOf(wind, hdg);
  const boomSide = tack === "sb" ? -1 : 1; // -1 = bagbord (lokal -x), +1 = styrbord
  const hull = "M0,-30 C11,-20 13,0 12,22 L-12,22 C-13,0 -11,-20 0,-30 Z";
  return (
    <g transform={`translate(${x},${y}) rotate(${hdg})`}>
      {/* kurslinje frem fra stævnen — gør retningen entydig */}
      <path d="M0,-34 L0,-70 M0,-70 l-5,8 M0,-70 l5,8" stroke={C.steel} strokeOpacity="0.7" strokeWidth="1.6" fill="none" strokeDasharray="3 3" />
      <path d={hull} fill={C.panelHi} stroke={C.cream} strokeWidth="1.8" />
      {kind === "sail" && (
        <g>
          {/* bom + storsejl i læ, agterud fra masten */}
          <path d={`M0,-6 L${boomSide * 17},16 Q${boomSide * 4},8 0,-6 Z`} fill={C.sail} fillOpacity="0.9" />
          <line x1="0" y1="-6" x2={boomSide * 17} y2="16" stroke={C.mast} strokeWidth="2.2" />
          <circle cx="0" cy="-6" r="2.6" fill={C.mast} />
        </g>
      )}
      {kind === "motor" && (
        <g>
          <rect x="-6" y="-8" width="12" height="14" rx="2.5" fill={C.steel} fillOpacity="0.7" />
          <path d="M-4,22 l0,5 M4,22 l0,5" stroke={C.steel} strokeWidth="2" />
        </g>
      )}
      {kind === "row" && (
        <g stroke={C.cream} strokeWidth="2.4" strokeLinecap="round">
          <line x1="-11" y1="-2" x2="-28" y2="8" /><line x1="11" y1="-2" x2="28" y2="8" />
        </g>
      )}
      {/* label altid under båden på skærmen: agter hvis båden peger op, foran stævnen hvis den peger ned */}
      {(() => { const h = ((hdg % 360) + 360) % 360; const side = h > 45 && h < 135 || h > 225 && h < 315; const ly = h > 90 && h < 270 ? (side ? -92 : -82) : (side ? 60 : 54);
        return <text x="0" y={ly} textAnchor="middle" fontSize="13" fontWeight="700" fill={C.cream} transform={`rotate(${-hdg} 0 ${ly})`}>{label}</text>; })()}
    </g>
  );
}

export function ScenarioDiagram({ C, s, T }) {
  const kindName = T?.kind ?? { sail: "sejl", motor: "motor", row: "robåd" };
  const windWord = T?.wind ?? "VIND";
  // Vindpil: kommer FRA s.wind. Placeres ved kanten i vindens retning.
  // Pilen sidder i kanten i vindens retning, men kan flyttes langs kanten (windAt) hvis en båd er i vejen
  const r = (s.wind * Math.PI) / 180;
  const ra = ((s.windAt ?? s.wind) * Math.PI) / 180;
  const cx = 150 + Math.sin(ra) * 104, cy = 150 - Math.cos(ra) * 104;
  return (
    <svg viewBox="0 0 300 300" width="100%" style={{ display: "block", maxHeight: 300 }}>
      <rect x="0" y="0" width="300" height="300" rx="14" fill={C.bg} />
      {/* vand-hint */}
      {[60, 120, 180, 240].map((yy) => <path key={yy} d={`M20,${yy} q20,-6 40,0 t40,0 t40,0 t40,0 t40,0 t40,0`} fill="none" stroke={C.steel} strokeOpacity="0.12" />)}
      {/* vindpil */}
      <g transform={`translate(${cx},${cy})`}>
        <g transform={`rotate(${s.wind})`}>
          <path d="M0,-10 L0,22 M0,22 l-6,-8 M0,22 l6,-8" stroke={C.steel} strokeWidth="2.2" fill="none" />
        </g>
        {/* teksten holdes vandret, placeret på vindsiden af pilen */}
        <text x={Math.max(-cx + 24, Math.min(300 - cx - 24, Math.sin(r) * 22))} y={-Math.cos(r) * 22 + 4} textAnchor="middle" fontSize="11" letterSpacing="2" fontWeight="700" fill={C.gold}>{windWord}</text>
      </g>
      {s.overtaking && (() => { const o = s.overtaking === "b" ? s.b : s.a, t = o === s.a ? s.b : s.a; return (
        <path d={`M${o.x},${o.y - 34} L${t.x},${t.y + 34}`} stroke={C.steel} strokeOpacity="0.45" strokeWidth="1.5" strokeDasharray="4 4" />
      ); })()}
      <Boat C={C} {...s.a} wind={s.wind} label={`A · ${kindName[s.a.kind]}`} />
      <Boat C={C} {...s.b} wind={s.wind} label={`B · ${kindName[s.b.kind]}`} />
    </svg>
  );
}

/* ---------- Runde-motor ---------- */
export function useDueRound(sec, DUE) {
  const [state, setState] = useState(null);
  function start() {
    const pool = DUE.filter((d) => d.sec === sec);
    const weak = loadWeak(sec);
    const weighted = pool.flatMap((d) => Array(Math.min(4, 1 + (weak[d.id] || 0))).fill(d.id));
    const q = []; for (const id of shuffle(weighted)) { if (!q.includes(id)) q.push(id); if (q.length === ROUND) break; }
    if (q.length === 0) { setState({ queue: [], cur: null, seq: 0, asked: 0, right: 0, missed: [], retry: false, done: true, weak }); return; }
    setState({ queue: q.slice(1), cur: q[0], seq: 0, asked: 0, right: 0, missed: [], retry: false, done: false, weak });
  }
  function record(ok) {
    setState((st) => {
      const weak = { ...st.weak, [st.cur]: Math.max(0, (st.weak[st.cur] || 0) + (ok ? -1 : 2)) };
      if (!weak[st.cur]) delete weak[st.cur];
      saveWeak(sec, weak);
      return { ...st, asked: st.asked + 1, right: st.right + (ok ? 1 : 0), missed: !ok && !st.missed.includes(st.cur) ? [...st.missed, st.cur] : st.missed, weak };
    });
  }
  function next() {
    setState((st) => {
      let q = st.queue, retry = st.retry, missed = st.missed;
      if (q.length === 0) {
        if (missed.length === 0 || retry) return { ...st, done: true };
        q = shuffle(missed); missed = []; retry = true;
      }
      return { ...st, cur: q[0], queue: q.slice(1), retry, missed, seq: st.seq + 1 };
    });
  }
  return { state, start, record, next };
}

/* ---------- Spørgsmåls-renderere ---------- */
function Feedback({ C, T, ok, title, note, onNext, last, btn }) {
  return (
    <div style={{ marginTop: 14, background: C.panelHi, borderRadius: 12, padding: 13, borderLeft: `3px solid ${ok ? C.good : C.accent}` }}>
      <div style={{ fontWeight: 700, color: ok ? C.good : C.accentSoft, marginBottom: 4 }}>{ok ? T.correct : title}</div>
      <div style={{ fontSize: 14, lineHeight: 1.5, color: "rgba(239,230,210,0.85)" }}>{note}</div>
      <button onClick={onNext} style={{ ...btn, textAlign: "center", background: C.accent, color: C.ink, marginTop: 12 }}>{last ? T.seeResult : T.next}</button>
    </div>
  );
}

const optStyle = (C, btn, state, isCorrect, isPicked) => {
  let bg = "rgba(157,179,196,0.10)", bd = "rgba(157,179,196,0.25)", col = C.cream;
  if (state) {
    if (isCorrect) { bg = "rgba(95,185,138,0.22)"; bd = C.good; col = C.sail; }
    else if (isPicked) { bg = "rgba(224,95,95,0.20)"; bd = C.bad; col = C.sail; }
    else col = "rgba(239,230,210,0.5)";
  }
  return { ...btn, background: bg, border: `1.5px solid ${bd}`, color: col, cursor: state ? "default" : "pointer" };
};

export function ScenarioQ({ C, T, btn, q, onAnswer, onNext, last }) {
  const [picked, setPicked] = useState(null);
  useEffect(() => setPicked(null), [q.id]);
  const opts = [["a", T.aGives], ["b", T.bGives], ["both", T.bothGive], ["none", T.noneGive]];
  const label = { a: T.aGives, b: T.bGives, both: T.bothGive, none: T.noneLbl };
  return (
    <div>
      <div style={{ background: C.bg, borderRadius: 12, padding: 6, marginBottom: 12 }}><ScenarioDiagram C={C} s={q} T={T} /></div>
      <p style={{ margin: "0 0 12px", fontSize: 16, color: C.sail }}>{T.whoGives}</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
        {opts.map(([k, l]) => (
          <button key={k} disabled={!!picked} onClick={() => { setPicked(k); onAnswer(k === q.answer); }} style={optStyle(C, btn, picked, k === q.answer, k === picked)}>{l}</button>
        ))}
      </div>
      {picked && <Feedback C={C} T={T} btn={btn} ok={picked === q.answer} title={`${T.rightAnswer} ${label[q.answer]} (${q.rule})`} note={q.note} onNext={onNext} last={last} />}
    </div>
  );
}

export function McqQ({ C, T, btn, q, onAnswer, onNext, last }) {
  const [opts, setOpts] = useState([]);
  const [picked, setPicked] = useState(null);
  useEffect(() => { setOpts(shuffle([q.a, ...q.wrong])); setPicked(null); }, [q.id]);
  return (
    <div>
      <p style={{ margin: "0 0 14px", fontSize: 17, lineHeight: 1.4, color: C.sail, fontFamily: "'Fraunces',serif" }}>{q.q}</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
        {opts.map((o) => (
          <button key={o} disabled={!!picked} onClick={() => { setPicked(o); onAnswer(o === q.a); }} style={{ ...optStyle(C, btn, picked, o === q.a, o === picked), fontSize: 15, lineHeight: 1.35 }}>{o}</button>
        ))}
      </div>
      {picked && <Feedback C={C} T={T} btn={btn} ok={picked === q.a} title={`${T.rightIs} ${q.a}`} note={q.note} onNext={onNext} last={last} />}
    </div>
  );
}

export function OrderQ({ C, T, btn, q, onAnswer, onNext, last }) {
  const [pool, setPool] = useState([]);       // indices tilbage, blandet
  const [placed, setPlaced] = useState([]);   // indices i den rækkefølge brugeren har valgt
  const [wrongHit, setWrongHit] = useState(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => { setPool(shuffle(q.steps.map((_, i) => i))); setPlaced([]); setWrongHit(null); setFailed(false); }, [q.id]);
  const done = placed.length === q.steps.length && q.steps.length > 0;
  function pick(i) {
    if (done) return;
    if (i === placed.length) {
      const np = [...placed, i]; setPlaced(np); setPool(pool.filter((x) => x !== i)); setWrongHit(null);
      if (np.length === q.steps.length) onAnswer(!failed);
    } else { setWrongHit(i); setFailed(true); }
  }
  return (
    <div>
      <p style={{ margin: "0 0 4px", fontSize: 17, lineHeight: 1.4, color: C.sail, fontFamily: "'Fraunces',serif" }}>{q.q}</p>
      <p style={{ margin: "0 0 12px", fontSize: 13, color: "rgba(239,230,210,0.65)" }}>{T.tapSteps}</p>
      {placed.length > 0 && (
        <ol style={{ margin: "0 0 12px", paddingLeft: 22, display: "flex", flexDirection: "column", gap: 6 }}>
          {placed.map((i, n) => <li key={i} style={{ fontSize: 14, lineHeight: 1.4, color: C.good }}>{q.steps[i]}</li>)}
        </ol>
      )}
      {!done && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {pool.map((i) => (
            <button key={i} onClick={() => pick(i)} style={{ ...btn, fontSize: 14, lineHeight: 1.35, fontWeight: 500, background: wrongHit === i ? "rgba(224,95,95,0.20)" : "rgba(157,179,196,0.10)", border: `1.5px solid ${wrongHit === i ? C.bad : "rgba(157,179,196,0.25)"}`, color: C.cream }}>{q.steps[i]}</button>
          ))}
        </div>
      )}
      {done && <Feedback C={C} T={T} btn={btn} ok={!failed} title={T.orderWrong} note={q.note} onNext={onNext} last={last} />}
    </div>
  );
}

