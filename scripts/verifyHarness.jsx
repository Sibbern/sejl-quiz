import React from "react";
import ReactDOM from "react-dom/client";
import { Diagram } from "../src/App.jsx";
import { PARTS, GAMES } from "../src/data.js";

/*
 * Renders the REAL <Diagram> component once per part, each with that part active
 * and labelled, grouped into a contact sheet per del. No re-implementation of the
 * SVG geometry, so it cannot drift from src/App.jsx. scripts/verify.mjs screenshots
 * each `#del-<game>` section. See CLAUDE.md → "Visual verification".
 */

const C = { bg: "#0c2334", cream: "#efe6d2", gold: "#d8a657", diagram: "#0d2b3e" };

function Tile({ part }) {
  return (
    <figure
      id={`part-${part.id}`}
      style={{ margin: 0, background: C.diagram, borderRadius: 10, padding: 8 }}
    >
      <Diagram game={part.game} active={part.id} label={part.da} />
      <figcaption
        style={{
          marginTop: 6,
          fontSize: 12,
          lineHeight: 1.35,
          color: C.cream,
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <strong>{part.da}</strong>{" "}
        <span style={{ color: C.gold }}>{part.en}</span>
        <br />
        <span style={{ opacity: 0.6 }}>
          {part.id} · {part.line ? "line" : "point"}
        </span>
      </figcaption>
    </figure>
  );
}

function Harness() {
  return (
    <div
      style={{
        background: C.bg,
        color: C.cream,
        fontFamily: "system-ui, sans-serif",
        padding: 20,
        minHeight: "100vh",
      }}
    >
      {GAMES.map((g) => (
        <section key={g.id} id={`del-${g.id}`} style={{ marginBottom: 28, padding: 12 }}>
          <h2 style={{ fontSize: 16, margin: "0 0 12px" }}>
            {g.t} <span style={{ color: C.gold, fontWeight: 400 }}>· {g.s}</span>
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 12,
            }}
          >
            {PARTS.filter((p) => p.game === g.id).map((p) => (
              <Tile key={p.id} part={p} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<Harness />);
