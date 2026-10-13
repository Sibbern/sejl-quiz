import React from "react";
import { createRoot } from "react-dom/client";
import { ScenarioDiagram } from "../src/Duelighed.jsx";
import { DUE, tackOf } from "../src/duelighed.js";
const C = { bg: "#0c2334", panel: "#103247", panelHi: "#16415c", sail: "#f1e9d6", steel: "#9db3c4", mast: "#d3dde4", cream: "#efe6d2", accent: "#e8693c", accentSoft: "#f4a07a", gold: "#d8a657", ink: "#08161f", good: "#5fb98a", bad: "#e05f5f" };
const sc = DUE.filter((d) => d.type === "scenario");
function Sheet() {
  return <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 260px)", gap: 10, padding: 10, fontFamily: "sans-serif", color: "#efe6d2" }}>
    {sc.map((s) => <div key={s.id} style={{ background: "#103247", padding: 6, borderRadius: 8 }}>
      <div style={{ fontSize: 12, marginBottom: 4 }}>{s.id} · wind {s.wind}° · A {s.a.kind} {s.a.hdg}° {s.a.kind==="sail" ? tackOf(s.wind,s.a.hdg):""} · B {s.b.kind} {s.b.hdg}° {s.b.kind==="sail"?tackOf(s.wind,s.b.hdg):""} → <b>{s.answer}</b> (r{s.rule})</div>
      <ScenarioDiagram C={C} s={s} />
    </div>)}
  </div>;
}
createRoot(document.getElementById("root")).render(<Sheet />);