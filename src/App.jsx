import React, { useState, useMemo } from "react";
import { PARTS, GAMES, BASICS } from "./data.js";

/* ------------------------------------------------------------------ */
/*  Theme tokens                                                       */
/* ------------------------------------------------------------------ */

const C = {
  bg: "#0c2334", panel: "#103247", panelHi: "#16415c",
  sail: "#f1e9d6", steel: "#9db3c4", mast: "#d3dde4", cream: "#efe6d2",
  accent: "#e8693c", accentSoft: "#f4a07a", gold: "#d8a657",
  ink: "#08161f", good: "#5fb98a", bad: "#e05f5f",
};
const DEEP = "#1b4a66", DEEPER = "#0d2b3e";

function shuffle(a) { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }

/* ------------------------------------------------------------------ */
/*  Fælles markør + label                                              */
/* ------------------------------------------------------------------ */

function Marker({ x, y, r1, r2, dot }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r1} fill="none" stroke={C.accent} strokeWidth="2" opacity="0.9">
        <animate attributeName="r" values={`${r1};${r2};${r1}`} dur="1.6s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.95;0.1;0.95" dur="1.6s" repeatCount="indefinite" />
      </circle>
      <circle cx={x} cy={y} r={dot} fill={C.accent} />
    </g>
  );
}
function Label({ p, label, size }) {
  if (!p || !label) return null;
  const y = p.ay < 80 ? p.ay + size + 8 : p.ay - 12;
  return (
    <text x={p.ax} y={y} textAnchor="middle" fontFamily="'Hanken Grotesk',sans-serif"
      fontSize={size} fontWeight="700" fill={C.sail} stroke={C.ink} strokeWidth="3.2"
      style={{ paintOrder: "stroke" }}>{label}</text>
  );
}
const glow = (
  <filter id="glow" filterUnits="userSpaceOnUse" x="0" y="0" width="440" height="400">
    <feGaussianBlur stdDeviation="2.6" result="b" />
    <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
  </filter>
);

/* ------------------------------------------------------------------ */
/*  DEL 1 — Hele båden                                                 */
/* ------------------------------------------------------------------ */

function BoatWhole({ active, label }) {
  const isA = (id) => active === id;
  const p = PARTS.find((x) => x.id === active);
  const ln = (id, base) => (isA(id) ? C.accent : base);
  const lw = (id, base) => (isA(id) ? base + 1.6 : base);
  const F = (id) => (isA(id) ? "url(#glow)" : undefined);

  return (
    <svg viewBox="0 0 420 380" style={{ width: "100%", height: "auto", display: "block" }}>
      <defs>{glow}
        <linearGradient id="sailG" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={C.sail} stopOpacity="0.2" /><stop offset="100%" stopColor={C.sail} stopOpacity="0.07" />
        </linearGradient>
      </defs>

      <line x1="8" y1="332" x2="412" y2="332" stroke={C.steel} strokeOpacity="0.25" />
      <line x1="8" y1="338" x2="412" y2="338" stroke={C.steel} strokeOpacity="0.12" />

      {/* stag og vant */}
      <line x1="200" y1="40" x2="35" y2="320" stroke={ln("agterstag", C.steel)} strokeWidth={lw("agterstag", 1.4)} filter={F("agterstag")} />
      <line x1="200" y1="40" x2="398" y2="320" stroke={ln("forstag", C.steel)} strokeWidth={lw("forstag", 1.4)} filter={F("forstag")} />
      <line x1="200" y1="40" x2="172" y2="312" stroke={ln("topvant", C.steel)} strokeWidth={lw("topvant", 1.3)} filter={F("topvant")} />
      <line x1="200" y1="160" x2="182" y2="312" stroke={ln("undervant", C.steel)} strokeWidth={lw("undervant", 1.3)} filter={F("undervant")} />

      {/* sejl (bag masten) */}
      <polygon points="196,54 196,300 100,305" fill={isA("storsejl") ? "rgba(232,105,60,0.22)" : "url(#sailG)"} stroke={isA("storsejl") ? C.accent : C.sail} strokeOpacity={isA("storsejl") ? 1 : 0.55} strokeWidth={isA("storsejl") ? 2 : 1} strokeLinejoin="round" />
      <polygon points="204,95 398,310 256,256" fill={isA("fok") ? "rgba(232,105,60,0.22)" : "url(#sailG)"} stroke={isA("fok") ? C.accent : C.sail} strokeOpacity={isA("fok") ? 1 : 0.55} strokeWidth={isA("fok") ? 2 : 1} strokeLinejoin="round" />

      {/* mast — spar oven på sejlene, helt ned til dækket */}
      <polygon points="198,40 202,40 203,316 197,316" fill={isA("mast") ? C.accent : C.mast} stroke={C.steel} strokeOpacity="0.5" strokeWidth="0.8" filter={F("mast")} />
      <line x1="200" y1="158" x2="168" y2="166" stroke={ln("salingshorn", C.mast)} strokeWidth={lw("salingshorn", 2.4)} strokeLinecap="round" filter={F("salingshorn")} />
      {/* storfald — løber langs masten (op til toppen) */}
      <line x1="201" y1="46" x2="201" y2="300" stroke={ln("storfald", "transparent")} strokeWidth={isA("storfald") ? 2 : 1.6} strokeLinecap="round" filter={F("storfald")} />

      {/* sejlkanter på storsejlet (til venstre/agter for masten) */}
      <line x1="196" y1="54" x2="196" y2="300" stroke={ln("forlig", "transparent")} strokeWidth={isA("forlig") ? 5 : 3} filter={F("forlig")} />
      <line x1="196" y1="54" x2="100" y2="305" stroke={ln("agterlig", "transparent")} strokeWidth={lw("agterlig", 2.4)} filter={F("agterlig")} />
      <line x1="196" y1="300" x2="100" y2="305" stroke={ln("underlig", "transparent")} strokeWidth={lw("underlig", 2.4)} filter={F("underlig")} />

      {/* bom + storskøde (fra bommen ned til dækket) */}
      <line x1="200" y1="301" x2="96" y2="305" stroke={ln("bom", C.mast)} strokeWidth={lw("bom", 3.4)} strokeLinecap="round" filter={F("bom")} />
      <line x1="120" y1="303" x2="124" y2="316" stroke={ln("storskode", "transparent")} strokeWidth={isA("storskode") ? 3.5 : 1.6} strokeLinecap="round" filter={F("storskode")} />

      <path d="M30,316 Q34,338 80,341 L330,341 Q392,339 400,316 Z" fill={C.panelHi} stroke={C.steel} strokeOpacity="0.5" strokeWidth="1.4" strokeLinejoin="round" />
      <line x1="30" y1="316" x2="400" y2="316" stroke={C.steel} strokeOpacity="0.45" />

      {p && !p.line && <Marker x={p.ax} y={p.ay} r1={7} r2={15} dot={3.5} />}
      <Label p={p} label={label} size={11} />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  DEL 2 — Mastetoppen                                                */
/* ------------------------------------------------------------------ */

function MastTop({ active, label }) {
  const isA = (id) => active === id;
  const p = PARTS.find((x) => x.id === active);
  const hl = (id, base) => (isA(id) ? C.accent : base);
  const F = (id) => (isA(id) ? "url(#glow)" : undefined);

  return (
    <svg viewBox="0 0 300 320" style={{ width: "100%", height: "auto", display: "block" }}>
      <defs>{glow}</defs>

      {/* kontekst-stag og -vant */}
      <line x1="197" y1="104" x2="276" y2="300" stroke={C.steel} strokeOpacity="0.22" strokeWidth="1.5" />
      <line x1="124" y1="104" x2="34" y2="300" stroke={C.steel} strokeOpacity="0.22" strokeWidth="1.5" />
      <line x1="132" y1="134" x2="92" y2="312" stroke={C.steel} strokeOpacity="0.2" strokeWidth="1.5" />

      {/* mast */}
      <rect x="132" y="116" width="36" height="204" rx="4" fill={C.mast} />

      {/* hulkel — rille på agterkanten */}
      <line x1="135" y1="124" x2="135" y2="316" stroke={hl("hulkel", C.steel)} strokeWidth={isA("hulkel") ? 3.5 : 2} strokeDasharray="3 4" filter={F("hulkel")} />
      <line x1="138" y1="124" x2="138" y2="316" stroke={C.steel} strokeOpacity="0.35" strokeWidth="1" />

      {/* skivgat (slot i forkanten) */}
      <rect x="145" y="134" width="10" height="32" rx="5" fill={DEEPER} stroke={hl("skivgat", C.steel)} strokeWidth={isA("skivgat") ? 3 : 1.5} filter={F("skivgat")} />
      {/* faldskive (udskåret hjul) + fald */}
      <rect x="140" y="176" width="22" height="46" rx="9" fill={DEEPER} />
      <circle cx="151" cy="190" r="13" fill={hl("faldskive", C.steel)} stroke={C.mast} strokeWidth="2" filter={F("faldskive")} />
      <circle cx="151" cy="190" r="4" fill={C.mast} />
      <path d="M151,316 L151,203 a13,13 0 0 1 0,-26" fill="none" stroke={C.steel} strokeOpacity="0.4" strokeWidth="2.5" />
      <line x1="162" y1="186" x2="190" y2="176" stroke={C.steel} strokeOpacity="0.4" strokeWidth="2.5" strokeLinecap="round" />

      {/* masthead-beslag (mastetop) */}
      <rect x="126" y="92" width="48" height="26" rx="5" fill={hl("mastetop", C.steel)} stroke={C.mast} strokeWidth="1.5" filter={F("mastetop")} />

      {/* forreste kran + forstagsbeslag */}
      <line x1="174" y1="100" x2="193" y2="100" stroke={C.steel} strokeWidth="4" strokeLinecap="round" />
      <circle cx="197" cy="104" r="5.5" fill="none" stroke={hl("forstagsbeslag", C.mast)} strokeWidth={isA("forstagsbeslag") ? 4 : 2.5} filter={F("forstagsbeslag")} />
      {/* agterstagsbeslag (kontekst) */}
      <circle cx="123" cy="104" r="4" fill="none" stroke={C.steel} strokeWidth="2" />

      {/* vantbeslag (hounds) */}
      <rect x="127" y="128" width="9" height="11" rx="2.5" fill={hl("vantbeslag", C.steel)} filter={F("vantbeslag")} />

      {/* toplanterne (på forkanten) */}
      <line x1="168" y1="112" x2="184" y2="112" stroke={C.steel} strokeWidth="3" />
      <circle cx="192" cy="112" r="9" fill={isA("toplanterne") ? C.accent : DEEP} stroke={C.steel} strokeWidth="2" filter={F("toplanterne")} />
      <circle cx="192" cy="112" r="4.5" fill={isA("toplanterne") ? C.sail : C.gold} />

      {/* VHF-antenne */}
      <rect x="134" y="88" width="8" height="9" rx="2" fill={C.steel} />
      <line x1="138" y1="88" x2="138" y2="32" stroke={hl("vhf", C.steel)} strokeWidth={isA("vhf") ? 3.5 : 2} strokeLinecap="round" filter={F("vhf")} />

      {/* vindex */}
      <g filter={F("vindex")}>
        <line x1="158" y1="92" x2="158" y2="56" stroke={hl("vindex", C.steel)} strokeWidth="3" />
        <line x1="158" y1="60" x2="200" y2="60" stroke={hl("vindex", C.mast)} strokeWidth="3" />
        <path d="M200,60 l-12,-6 l0,12 z" fill={hl("vindex", C.steel)} />
        <path d="M158,60 l14,-7 l0,14 z" fill={hl("vindex", C.steel)} />
        <line x1="158" y1="60" x2="188" y2="44" stroke={hl("vindex", C.steel)} strokeWidth="2" />
        <line x1="158" y1="60" x2="188" y2="76" stroke={hl("vindex", C.steel)} strokeWidth="2" />
      </g>

      {p && !p.line && <Marker x={p.ax} y={p.ay} r1={8} r2={16} dot={4} />}
      <Label p={p} label={label} size={12} />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  DEL 3 — Mastefoden                                                 */
/* ------------------------------------------------------------------ */

function MastBottom({ active, label }) {
  const isA = (id) => active === id;
  const p = PARTS.find((x) => x.id === active);
  const hl = (id, base) => (isA(id) ? C.accent : base);
  const F = (id) => (isA(id) ? "url(#glow)" : undefined);

  return (
    <svg viewBox="0 0 320 300" style={{ width: "100%", height: "auto", display: "block" }}>
      <defs>{glow}</defs>

      {/* skrog + dæk */}
      <rect x="0" y="224" width="320" height="76" fill={DEEPER} />
      <rect x="0" y="206" width="320" height="20" fill={C.panelHi} />
      <line x1="0" y1="206" x2="320" y2="206" stroke={C.steel} strokeOpacity="0.4" />

      {/* shroud + vantskrue */}
      <line x1="80" y1="16" x2="58" y2="190" stroke={C.steel} strokeOpacity="0.5" strokeWidth="2.5" />
      <rect x="52" y="190" width="12" height="24" rx="5" fill="none" stroke={hl("vantskrue", C.steel)} strokeWidth={isA("vantskrue") ? 4.5 : 3} filter={F("vantskrue")} />
      <rect x="50" y="214" width="16" height="10" rx="1.5" fill={C.steel} />

      {/* mast */}
      <rect x="148" y="16" width="36" height="194" rx="4" fill={C.mast} />
      <line x1="158" y1="18" x2="158" y2="206" stroke={C.steel} strokeOpacity="0.4" />

      {/* gooseneck + bom */}
      <rect x="184" y="146" width="132" height="15" rx="4" fill={C.mast} />
      <circle cx="186" cy="153" r="5" fill={C.steel} />

      {/* hækvang / kicker */}
      <line x1="170" y1="190" x2="250" y2="160" stroke={hl("haekvang", C.steel)} strokeWidth={isA("haekvang") ? 5.5 : 3.5} strokeLinecap="round" filter={F("haekvang")} />
      <rect x="200" y="168" width="16" height="9" rx="3" fill={DEEP} transform="rotate(-20 208 172)" />

      {/* fald fra masten til blokke -> klemmer -> spil */}
      <path d="M160,150 C176,176 198,196 210,202" fill="none" stroke={C.steel} strokeOpacity="0.4" strokeWidth="2.5" />
      <path d="M236,205 L246,205" stroke={C.steel} strokeOpacity="0.4" strokeWidth="2.5" />
      <path d="M278,205 C284,205 290,200 294,196" fill="none" stroke={C.steel} strokeOpacity="0.4" strokeWidth="2.5" />

      {/* mastefod */}
      <rect x="138" y="204" width="56" height="16" rx="3" fill={hl("mastefod", C.steel)} stroke={C.mast} strokeWidth="1.5" filter={F("mastefod")} />
      <circle cx="146" cy="212" r="2.4" fill={DEEPER} /><circle cx="186" cy="212" r="2.4" fill={DEEPER} />

      {/* fordelerblokke */}
      <rect x="196" y="206" width="40" height="13" rx="4" fill={hl("fordelerblokke", C.steel)} filter={F("fordelerblokke")} />
      {[204, 216, 228].map((x) => <g key={x}><circle cx={x} cy="205" r="5" fill={DEEP} stroke={C.mast} strokeWidth="1.5" /><circle cx={x} cy="205" r="1.6" fill={C.mast} /></g>)}

      {/* spilaflaster (klemmebank) */}
      <rect x="244" y="206" width="40" height="12" rx="3" fill={hl("spilaflaster", C.steel)} filter={F("spilaflaster")} />
      {[252, 262, 272].map((x) => <g key={x} transform={`rotate(-22 ${x} 202)`}><rect x={x - 4} y="190" width="9" height="16" rx="3" fill={isA("spilaflaster") ? C.accentSoft : C.mast} /></g>)}

      {/* faldspil (winch) */}
      <ellipse cx="296" cy="206" rx="17" ry="5" fill={DEEPER} />
      <rect x="279" y="190" width="34" height="16" fill={hl("faldspil", DEEP)} />
      <ellipse cx="296" cy="190" rx="17" ry="5" fill={hl("faldspil", C.steel)} filter={F("faldspil")} />
      <ellipse cx="296" cy="185" rx="13" ry="4" fill={C.mast} />
      <line x1="296" y1="184" x2="316" y2="174" stroke={C.steel} strokeWidth="4" strokeLinecap="round" />

      {p && !p.line && <Marker x={p.ax} y={p.ay} r1={8} r2={17} dot={4} />}
      <Label p={p} label={label} size={13} />
    </svg>
  );
}

function WindDiagram({ active, label }) {
  const isA = (id) => active === id;
  const p = PARTS.find((x) => x.id === active);
  const F = (id) => (isA(id) ? "url(#glow)" : undefined);
  const mini = (x, y, deg, id) => (
    <g transform={`translate(${x} ${y}) rotate(${deg})`} filter={F(id)}>
      <polygon points="0,-13 7,11 0,15 -7,11" fill={isA(id) ? C.accent : C.mast} stroke={C.ink} strokeOpacity="0.3" />
      <line x1="0" y1="-5" x2="5" y2="7" stroke={isA(id) ? C.sail : C.steel} strokeWidth="1.6" />
    </g>
  );

  return (
    <svg viewBox="0 0 330 360" style={{ width: "100%", height: "auto", display: "block" }}>
      <defs>{glow}</defs>

      {/* vind ovenfra */}
      <text x="165" y="16" textAnchor="middle" fontFamily="'Hanken Grotesk',sans-serif" fontSize="11" fontWeight="700" fill={C.gold} letterSpacing="3">VIND</text>
      {[120, 165, 210].map((x) => (
        <g key={x} stroke={C.steel} strokeOpacity="0.5" strokeWidth="2" fill="none">
          <line x1={x} y1="26" x2={x} y2="64" />
          <path d={`M${x - 5},56 L${x},66 L${x + 5},56`} />
        </g>
      ))}

      {/* central båd — peger op i vinden */}
      <polygon points="165,172 181,224 165,240 149,224" fill={isA("invinden") ? "rgba(232,105,60,0.30)" : C.panelHi} stroke={isA("invinden") ? C.accent : C.steel} strokeWidth="1.6" />
      <circle cx="165" cy="212" r="3" fill={C.mast} />

      {/* sejladser i forhold til vinden */}
      {mini(245, 150, 45, "bidevind")}
      {mini(278, 210, 90, "halvvind")}
      {mini(245, 270, 135, "rumskods")}
      {mini(165, 292, 180, "laens")}

      {/* stagvending (bue over toppen) */}
      <g filter={F("vende")}>
        <path d="M198,168 Q165,134 132,168" fill="none" stroke={isA("vende") ? C.accent : C.steel} strokeOpacity={isA("vende") ? 1 : 0.55} strokeWidth={isA("vende") ? 4 : 2.4} />
        <path d="M132,168 l3,-10 l8,5 z" fill={isA("vende") ? C.accent : C.steel} fillOpacity={isA("vende") ? 1 : 0.55} />
      </g>
      {/* bomning (bue under) */}
      <g filter={F("halse")}>
        <path d="M198,302 Q165,340 132,302" fill="none" stroke={isA("halse") ? C.accent : C.steel} strokeOpacity={isA("halse") ? 1 : 0.55} strokeWidth={isA("halse") ? 4 : 2.4} />
        <path d="M132,302 l3,10 l8,-5 z" fill={isA("halse") ? C.accent : C.steel} fillOpacity={isA("halse") ? 1 : 0.55} />
      </g>

      {p && !p.line && <Marker x={p.ax} y={p.ay} r1={8} r2={17} dot={4} />}
      <Label p={p} label={label} size={12} />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  DEL 5 — Sider & halse                                              */
/* ------------------------------------------------------------------ */

function SideDiagram({ active, label }) {
  const isA = (id) => active === id;
  const p = PARTS.find((x) => x.id === active);
  const F = (id) => (isA(id) ? "url(#glow)" : undefined);

  const tackBoat = (cx, cy, windRight, id) => {
    const ex = windRight ? cx + 22 : cx - 22; // hvor pilen peger hen (mod båden)
    const sx = windRight ? cx + 48 : cx - 48; // hvor vinden kommer fra
    const head = windRight ? `M${ex + 6},${cy - 5} L${ex},${cy} L${ex + 6},${cy + 5}` : `M${ex - 6},${cy - 5} L${ex},${cy} L${ex - 6},${cy + 5}`;
    return (
      <g filter={F(id)}>
        <g stroke={C.steel} strokeOpacity="0.55" strokeWidth="2" fill="none">
          <line x1={sx} y1={cy} x2={ex} y2={cy} /><path d={head} />
        </g>
        <polygon points={`${cx},${cy - 22} ${cx + 12},${cy + 16} ${cx},${cy + 24} ${cx - 12},${cy + 16}`} fill={isA(id) ? C.accent : C.mast} stroke={C.ink} strokeOpacity="0.3" />
        <line x1={cx} y1={cy - 6} x2={windRight ? cx - 24 : cx + 24} y2={cy + 12} stroke={isA(id) ? C.sail : C.steel} strokeWidth="2.6" strokeLinecap="round" />
      </g>
    );
  };

  return (
    <svg viewBox="0 0 330 340" style={{ width: "100%", height: "auto", display: "block" }}>
      <defs>{glow}</defs>

      {/* retningspil (ingen tekst, for ikke at røbe svar) */}
      <line x1="165" y1="44" x2="165" y2="62" stroke={C.steel} strokeOpacity="0.4" strokeWidth="2" />
      <path d="M160,50 L165,42 L170,50" fill="none" stroke={C.steel} strokeOpacity="0.4" strokeWidth="2" />

      {/* vind ind fra styrbord (højre) — definerer luv og læ */}
      <text x="248" y="82" textAnchor="middle" fontFamily="'Hanken Grotesk',sans-serif" fontSize="10" fontWeight="700" fill={C.gold} letterSpacing="2">VIND</text>
      {[100, 116, 132].map((y) => (
        <g key={y} stroke={C.steel} strokeOpacity="0.5" strokeWidth="2" fill="none">
          <line x1="256" y1={y} x2="214" y2={y} />
          <path d={`M220,${y - 5} L214,${y} L220,${y + 5}`} />
        </g>
      ))}

      {/* hovedbåd (top-down, peger op) */}
      <polygon points="165,72 184,138 165,156 146,138" fill={C.panelHi} stroke={C.steel} strokeWidth="1.6" />
      <circle cx="165" cy="128" r="3" fill={C.mast} />

      {/* halse-både */}
      {tackBoat(100, 255, true, "sbhalse")}
      {tackBoat(230, 255, false, "bbhalse")}

      {p && !p.line && <Marker x={p.ax} y={p.ay} r1={8} r2={16} dot={4} />}
      <Label p={p} label={label} size={12} />
    </svg>
  );
}

function Diagram({ game, active, label }) {
  if (game === "top") return <MastTop active={active} label={label} />;
  if (game === "bottom") return <MastBottom active={active} label={label} />;
  if (game === "wind") return <WindDiagram active={active} label={label} />;
  if (game === "sides") return <SideDiagram active={active} label={label} />;
  return <BoatWhole active={active} label={label} />;
}

/* `Diagram` is also a named export so the verification harness (scripts/) can render
   the real component. It's a component, so this keeps App.jsx Fast-Refresh-eligible —
   the content arrays deliberately live in ./data.js, not here. */
export { Diagram };

/* ------------------------------------------------------------------ */
/*  App                                                                */
/* ------------------------------------------------------------------ */

export default function App() {
  const [mode, setMode] = useState("home"); // home | basics | study | quiz | result
  const [game, setGame] = useState("boat");
  const [studyActive, setStudyActive] = useState(null);
  const [order, setOrder] = useState([]);
  const [idx, setIdx] = useState(0);
  const [options, setOptions] = useState([]);
  const [picked, setPicked] = useState(null);
  const [correct, setCorrect] = useState(0);

  const pool = useMemo(() => PARTS.filter((p) => p.game === game), [game]);
  const current = mode === "quiz" ? PARTS.find((p) => p.id === order[idx]) : null;

  const makeOptions = (part) => shuffle([part, ...shuffle(pool.filter((p) => p.id !== part.id)).slice(0, 3)]);

  function openDel(id) {
    const first = PARTS.find((p) => p.game === id);
    setGame(id); setStudyActive(first ? first.id : null); setPicked(null); setMode("study");
  }
  function startQuiz() {
    const ord = shuffle(pool.map((p) => p.id));
    setOrder(ord); setIdx(0); setCorrect(0); setPicked(null);
    setOptions(makeOptions(PARTS.find((p) => p.id === ord[0])));
    setMode("quiz");
  }
  function answer(o) { if (picked) return; setPicked(o); if (o.id === current.id) setCorrect((c) => c + 1); }
  function next() {
    const n = idx + 1;
    if (n >= order.length) { setMode("result"); return; }
    setIdx(n); setPicked(null); setOptions(makeOptions(PARTS.find((x) => x.id === order[n])));
  }

  const activeId = mode === "study" ? studyActive : (mode === "quiz" && current) ? current.id : null;
  const labelText =
    mode === "study" && studyActive ? PARTS.find((p) => p.id === studyActive)?.da :
    mode === "quiz" && picked && current ? current.da : null;
  const gameMeta = GAMES.find((g) => g.id === game);

  const wrap = { minHeight: "100vh", background: `radial-gradient(120% 90% at 50% 0%, #14405b 0%, ${C.bg} 55%)`, color: C.cream, fontFamily: "'Hanken Grotesk',sans-serif", padding: "20px 16px 40px", boxSizing: "border-box" };
  const shell = { maxWidth: 460, margin: "0 auto" };
  const card = { background: C.panel, border: "1px solid rgba(157,179,196,0.18)", borderRadius: 16, padding: 16, boxShadow: "0 18px 40px -24px #000" };
  const btn = { width: "100%", padding: "14px 16px", border: "none", borderRadius: 12, fontFamily: "'Hanken Grotesk',sans-serif", fontSize: 16, fontWeight: 600, cursor: "pointer", textAlign: "left", transition: "transform .08s ease, background .15s ease" };
  const back = { background: "none", border: "none", color: C.gold, fontSize: 14, cursor: "pointer", fontWeight: 600 };

  return (
    <div style={wrap}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,600;1,9..144,500&family=Hanken+Grotesk:wght@400;500;600;700&display=swap');
        * { -webkit-tap-highlight-color: transparent; }
        button:active { transform: scale(0.985); }`}</style>

      <div style={shell}>
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <div style={{ fontSize: 12, letterSpacing: 3, textTransform: "uppercase", color: C.gold, fontWeight: 600 }}>Sejl &amp; rig</div>
          <h1 style={{ fontFamily: "'Fraunces',serif", fontWeight: 600, fontStyle: "italic", fontSize: 32, margin: "2px 0 0", color: C.sail }}>Lær bådens dele</h1>
        </div>

        {(mode === "home" || mode === "study" || mode === "quiz") && (
          <div style={{ ...card, padding: 8, marginBottom: 14, background: "#0d2b3e" }}>
            <Diagram game={mode === "home" ? "boat" : game} active={mode === "home" ? null : activeId} label={mode === "home" ? null : labelText} />
          </div>
        )}

        {/* ---------------- HOME ---------------- */}
        {mode === "home" && (
          <div style={card}>
            <button onClick={() => setMode("basics")} style={{ ...btn, textAlign: "center", background: "transparent", color: C.gold, border: `1.5px solid ${C.gold}`, marginBottom: 14 }}>Forstå grundbegreberne →</button>
            <p style={{ margin: "0 0 14px", lineHeight: 1.5, color: "rgba(239,230,210,0.8)", fontSize: 15 }}>
              Vælg et spil. Hver del har sin egen tegning, så du tydeligt kan se hvad der peges på.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              {GAMES.map((g) => {
                const n = PARTS.filter((p) => p.game === g.id).length;
                return (
                  <button key={g.id} onClick={() => openDel(g.id)}
                    style={{ ...btn, background: C.panelHi, border: "1.5px solid rgba(216,166,87,0.4)", color: C.cream, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span><span style={{ display: "block", fontSize: 16 }}>{g.t}</span><span style={{ fontSize: 13, color: "rgba(239,230,210,0.65)", fontWeight: 500 }}>{g.s}</span></span>
                    <span style={{ fontSize: 13, color: C.gold }}>{n} dele →</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ---------------- BASICS ---------------- */}
        {mode === "basics" && (
          <div style={card}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
              <h2 style={{ fontFamily: "'Fraunces',serif", fontStyle: "italic", fontSize: 22, margin: 0, color: C.sail }}>Grundbegreber</h2>
              <button onClick={() => setMode("home")} style={back}>← Forside</button>
            </div>
            <p style={{ margin: "0 0 14px", fontSize: 14, color: "rgba(239,230,210,0.75)", lineHeight: 1.5 }}>De vigtigste ord-typer. Når du forstår disse, giver de fleste enkeltdele sig selv.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {BASICS.map((b) => (
                <div key={b.t} style={{ background: C.panelHi, borderRadius: 12, padding: 13, borderLeft: `3px solid ${C.gold}` }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap" }}>
                    <span style={{ fontFamily: "'Fraunces',serif", fontSize: 19, color: C.sail }}>{b.t}</span>
                    <span style={{ fontSize: 12.5, color: C.gold }}>{b.e}</span>
                  </div>
                  <div style={{ fontSize: 14, lineHeight: 1.5, color: "rgba(239,230,210,0.85)", marginTop: 3 }}>{b.d}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ---------------- STUDY ---------------- */}
        {mode === "study" && (
          <div style={card}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
              <h2 style={{ fontFamily: "'Fraunces',serif", fontStyle: "italic", fontSize: 19, margin: 0, color: C.sail }}>{gameMeta.t}</h2>
              <button onClick={() => setMode("home")} style={back}>← Forside</button>
            </div>

            {studyActive && (() => {
              const pp = PARTS.find((x) => x.id === studyActive);
              return (
                <div style={{ background: C.panelHi, borderRadius: 12, padding: 14, marginBottom: 14, borderLeft: `3px solid ${C.accent}` }}>
                  <div style={{ fontFamily: "'Fraunces',serif", fontSize: 22, color: C.sail }}>{pp.da}</div>
                  <div style={{ fontSize: 13, color: C.gold, marginBottom: 6 }}>engelsk: {pp.en}</div>
                  <div style={{ fontSize: 14.5, lineHeight: 1.5, color: "rgba(239,230,210,0.85)" }}>{pp.note}</div>
                </div>
              );
            })()}

            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {pool.map((p) => (
                <button key={p.id} onClick={() => setStudyActive(p.id)}
                  style={{ padding: "9px 13px", borderRadius: 999, cursor: "pointer", fontSize: 14, fontWeight: 600, fontFamily: "'Hanken Grotesk',sans-serif", background: studyActive === p.id ? C.accent : "rgba(157,179,196,0.12)", color: studyActive === p.id ? C.ink : C.cream, border: `1px solid ${studyActive === p.id ? C.accent : "rgba(157,179,196,0.25)"}` }}>
                  {p.da}
                </button>
              ))}
            </div>

            <button onClick={startQuiz} style={{ ...btn, textAlign: "center", background: C.accent, color: C.ink, marginTop: 16 }}>Start quiz · {pool.length} dele</button>
          </div>
        )}

        {/* ---------------- QUIZ ---------------- */}
        {mode === "quiz" && current && (
          <div style={card}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "rgba(239,230,210,0.7)", marginBottom: 8 }}>
              <span>{gameMeta.t.split(" · ")[0]} — {idx + 1}/{order.length}</span>
              <span style={{ color: C.gold }}>{correct} rigtige</span>
            </div>
            <div style={{ height: 5, background: "rgba(157,179,196,0.2)", borderRadius: 99, marginBottom: 16, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${(idx / order.length) * 100}%`, background: C.gold, borderRadius: 99, transition: "width .3s" }} />
            </div>
            <p style={{ margin: "0 0 14px", fontSize: 16, color: C.sail }}>Hvad hedder den markerede del?</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              {options.map((o) => {
                let bg = "rgba(157,179,196,0.10)", bd = "rgba(157,179,196,0.25)", col = C.cream;
                if (picked) {
                  if (o.id === current.id) { bg = "rgba(95,185,138,0.22)"; bd = C.good; col = C.sail; }
                  else if (o.id === picked.id) { bg = "rgba(224,95,95,0.20)"; bd = C.bad; col = C.sail; }
                  else col = "rgba(239,230,210,0.5)";
                }
                return <button key={o.id} onClick={() => answer(o)} disabled={!!picked} style={{ ...btn, background: bg, border: `1.5px solid ${bd}`, color: col, cursor: picked ? "default" : "pointer" }}>{o.da}</button>;
              })}
            </div>
            {picked && (
              <div style={{ marginTop: 14, background: C.panelHi, borderRadius: 12, padding: 13, borderLeft: `3px solid ${picked.id === current.id ? C.good : C.accent}` }}>
                <div style={{ fontWeight: 700, color: picked.id === current.id ? C.good : C.accentSoft, marginBottom: 4 }}>{picked.id === current.id ? "Rigtigt!" : `Det var: ${current.da}`}</div>
                <div style={{ fontSize: 14, lineHeight: 1.5, color: "rgba(239,230,210,0.85)" }}><span style={{ color: C.gold }}>{current.en}.</span> {current.note}</div>
                <button onClick={next} style={{ ...btn, textAlign: "center", background: C.accent, color: C.ink, marginTop: 12 }}>{idx + 1 >= order.length ? "Se resultat" : "Næste →"}</button>
              </div>
            )}
          </div>
        )}

        {/* ---------------- RESULT ---------------- */}
        {mode === "result" && (
          <div style={{ ...card, textAlign: "center" }}>
            <div style={{ fontSize: 13, letterSpacing: 2, textTransform: "uppercase", color: C.gold }}>{gameMeta.t}</div>
            <div style={{ fontFamily: "'Fraunces',serif", fontStyle: "italic", fontSize: 52, color: C.sail, lineHeight: 1.1, margin: "6px 0" }}>{correct}<span style={{ fontSize: 28, color: "rgba(239,230,210,0.6)" }}>/{order.length}</span></div>
            <p style={{ margin: "0 0 18px", color: "rgba(239,230,210,0.8)", fontSize: 15 }}>{correct === order.length ? "Helt perfekt! ⚓" : correct >= order.length * 0.7 ? "Flot sejlet — et par stykker mangler endnu." : "God start — kør en runde til, så sidder de fast."}</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <button onClick={startQuiz} style={{ ...btn, textAlign: "center", background: C.accent, color: C.ink }}>Prøv igen</button>
              <button onClick={() => setMode("study")} style={{ ...btn, textAlign: "center", background: "transparent", color: C.gold, border: `1.5px solid ${C.gold}` }}>Gennemgå delene</button>
              <button onClick={() => setMode("home")} style={{ ...btn, textAlign: "center", background: "transparent", color: "rgba(239,230,210,0.7)", border: "1px solid rgba(157,179,196,0.3)" }}>Forside</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
