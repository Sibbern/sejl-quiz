# CLAUDE.md — Sejl-quiz (dansk sejlerterminologi)

Interactive React app for learning Danish sailing/rigging terminology.
Each "del" is a hand-drawn SVG boat diagram with a study mode and a multiple-choice quiz.
UI is in Danish. Mobile-first. Dark nautical theme.

> Two rules below (**Marking invariant** + **Visual verification**) exist because
> getting them wrong is the single recurring bug in this project. Read them before
> touching any diagram.

---

## Run / build / test

Vite + React. The whole app is one component in `src/App.jsx` (default export `App`);
`src/main.jsx` mounts it into `index.html`.

- `npm install` — once.
- `npm run dev` — dev server with HMR (http://localhost:5173).
- `npm run build` — static build to `dist/`. **This is the parse/compile smoke test —
  run it after every edit.** There is no linter configured; the build is the check.
- `npm run preview` — serve the built `dist/` exactly as Cloudflare will (http://localhost:4173).
- `npm run verify` — render every part and screenshot it (see **Visual verification**).

Deploy: Cloudflare Pages — build command `npm run build`, output directory `dist`. Pure
static SPA, no routing fallback or env vars needed. See `README.md`.

---

## Architecture

Two source files:
- **`src/data.js`** — the content arrays (`PARTS`, `GAMES`, `BASICS`). All exported.
- **`src/App.jsx`** — the UI: theme tokens, diagram components, and the `App` state machine.

The content lives in `data.js` (not `App.jsx`) on purpose: it keeps `App.jsx`'s only exports
React components (`App`, `Diagram`), which is what React Fast Refresh requires — mixing data
exports into `App.jsx` forces a full page reload on every edit instead of a hot update.

**`src/data.js`:**
- **`PARTS` array** — every labelled part across all dels. Shape:
  `{ id, da, en, game, ax, ay, note, line? }`
  - `id` — internal key used by `isA(id)` everywhere in the diagrams.
  - `da` / `en` — Danish label / English gloss.
  - `game` — which del it belongs to (`boat|top|bottom|wind|sides`).
  - `ax,ay` — anchor coords for the `Marker` dot (in that diagram's viewBox space).
  - `note` — explanation shown in study + after a quiz answer.
  - `line: true` — this is a **line part** (see Marking invariant). Omit for **point parts**.
- **`GAMES` array** — the five dels shown on the home hub (title, subtitle, game key).
- **`BASICS` array** — the Grundbegreber concept cards.

**`src/App.jsx` (top → bottom):**
- **`C` object** — color tokens. **Source of truth for all colors. Never hardcode hexes; use `C.*`.**
- **`Marker`** — the pulsing accent ring+dot. The *only* thing that is unconditionally `C.accent`.
- **`Label`** — renders the active part's name near its anchor.
- **Diagram components**, one per del:
  - `BoatWhole`  → game `boat`  (Del 1, viewBox `0 0 420 380`)
  - `MastTop`    → game `top`   (Del 2, viewBox `0 0 300 320`)
  - `MastBottom` → game `bottom`(Del 3, viewBox `0 0 320 300`)
  - `WindDiagram`→ game `wind`  (Del 4, viewBox `0 0 330 360`)
  - `SideDiagram`→ game `sides` (Del 5, viewBox `0 0 330 340`)
- **`Diagram({game,...})`** — router that maps `game` → the component above.
- **`App`** — state machine + screens.

`Diagram` is **named-exported** alongside the default `App` so the verification harness can
render the real component; the harness gets `PARTS`/`GAMES` from `data.js`. Keep `App.jsx`'s
exports limited to components (App, Diagram) — adding a data export there breaks Fast Refresh.

**Mode flow:** `home` (hub) → pick a del → `basics`/`study`/`quiz` → `result`.
The `basics` screen (Grundbegreber) is concept-only, no diagram.

**Per-diagram helpers** (defined inside each component, keep them identical across components):
- `isA(id)` → `active === id`
- `hl(id, base)` / `ln(id, base)` → returns `C.accent` when active, else `base`
- `F(id)` → returns `"url(#glow)"` when active, else `undefined`

---

## ⚠️ Marking invariant (the core rule)

**Only the active part may show a warm color (`C.accent`). Nothing drawn permanently
may be `C.accent` or `C.gold` — those read as "this is the answer" and create false markings.**

Two part types, two ways to highlight:

| Type | `line?` | How it highlights | Has a `Marker` dot? |
|------|---------|-------------------|---------------------|
| **Point** (corners, fittings, winches, sails-as-area) | omitted | its element recolors to `C.accent` **and** a `Marker` dot is drawn at `ax,ay` | yes |
| **Line** (sail edges, stays, halyards, arcs) | `true` | the whole line/path recolors to `C.accent`, thicker | **no** dot |

The `Marker` is gated on `!p.line`:
```jsx
{p && !p.line && <Marker x={p.ax} y={p.ay} r1={8} r2={17} dot={4} />}
```

**Consequences for drawing anything:**
- A part's element uses `hl(id, neutralBase)` for color — never a fixed warm color.
- `neutralBase` is a structural color (`C.steel` / `C.mast`) or `"transparent"` if the
  element should only appear when selected (e.g. sail edges, halyards).
- **Decoration** (ropes/arcs that aren't a quizzed part) must be muted: `C.steel` at
  `strokeOpacity ~0.4–0.55`. Never gold, never full-opacity warm.
- Allowed permanent warm colors, by exception only: the small round **toplanterne** lens,
  and `"VIND"` **text** labels. These are obviously not line-markings.

---

## ⚠️ Visual verification (definition of done)

You cannot eyeball SVG correctness from the JSX. **Before claiming any diagram change is
done, render every part highlighted and look at it.** This is how every marking bug here
was found and fixed.

The harness renders the **real `<Diagram>` component** for every `PARTS` id, so there is no
re-implementation to drift out of sync with the source.

```bash
npm install
npx playwright install chromium   # once — downloads the browser
npm run verify                    # → scripts/out/del-*.png (one contact sheet per del)
```

What it does:
1. `scripts/verify.mjs` starts the Vite dev server in-process and loads `verify.html`,
   which mounts `scripts/verifyHarness.jsx` — a grid of every part, each rendering its own
   `<Diagram>` with that part active and labelled.
2. It screenshots one contact sheet per del into `scripts/out/` (gitignored).

**Open each sheet** and check, for every tile:
- the **correct** element is the one lit in `C.accent`;
- point parts have the dot on the right spot;
- **no permanent gold/orange** appears on a tile where it isn't the answer.

Fix, re-run, re-check. Then `npm run build`.

Because the harness auto-iterates `PARTS`, adding a part or a whole del needs **no change
to the verification code** — new entries show up in the sheets automatically.

> This replaced an older Python/cairosvg re-implementation of each diagram. That approach
> had to be hand-kept in sync with the JSX and silently lied when it drifted. Screenshotting
> the real component removes drift entirely — keep it that way.

Cosmetic caveat: the contact sheet puts many SVGs on one page, so the shared `#glow` filter
id is duplicated across them. Glow is decoration and does **not** determine which element is
accent-colored (that comes from `hl()`/`ln()` strokes/fills), so markings stay trustworthy.
The real app only ever mounts one diagram at a time, so there's no duplication there.

---

## Known gotchas (already paid for — don't reintroduce)

- **Glow filter must be `userSpaceOnUse`.** The shared `#glow` filter uses
  `filterUnits="userSpaceOnUse" x=0 y=0 width=440 height=400` (covers all viewBoxes).
  The earlier `objectBoundingBox` version clipped/vanished on thin (near-degenerate) line
  bounding boxes in browsers, so highlighted lines were invisible. Keep it userSpaceOnUse.
  (`npm run verify` screenshots the real browser render, so this class of bug now shows up
  directly in the contact sheet.)
- **`localStorage` is available now.** This is a normal browser app on Cloudflare Pages —
  the old artifact-host storage ban is lifted, which unblocks progress persistence (roadmap).
  If you add it, guard the calls: storage access can throw in private-mode browsers.
- Past false markings all came from the same source: a part or decoration drawn permanently
  in `C.gold` (Del 1 storfald, Del 2 fald/vindex arrow, Del 3 hækvang + fald, Del 4
  vende/halse arcs). All fixed by applying the Marking invariant. Watch for it on new art.

---

## Playbook: add a part to an existing del

1. Add an entry to `PARTS` with `game` set, `da/en/note`, and `ax,ay`.
   Add `line: true` only if it's a line/path part.
2. In that del's diagram component, draw the element using `hl(id, neutralBase)` for color
   and `filter={F(id)}`. Pick `neutralBase`: structural color, or `"transparent"` if it
   should only appear when selected.
3. Make sure the anchor `ax,ay` sits on the element (point parts) — this is where the dot lands.
4. `npm run verify` and look at the del's contact sheet: confirm the new part marks correctly
   and nothing else changed. (No verification-code changes needed.)
5. `npm run build`.

## Playbook: add a whole new del

1. New `GAMES` entry + new diagram component with its own `viewBox`.
2. Copy the `isA/hl/F` helpers and the `Marker`/`Label` gating block verbatim.
3. Register it in the `Diagram` router.
4. Add its parts to `PARTS` with the new `game` key.
5. `npm run verify` (the new del appears in the sheets automatically) → check the full set.
   Then `npm run build`.

---

## Conventions / tone

- Danish UI throughout; English only in `en` glosses and code.
- Keep formatting/structure minimal in user-facing copy.
- Quiz options are drawn from the *same del's* part pool (don't mix dels).
- Don't reveal the answer in the diagram before the user answers (e.g. Del 5 wind arrows
  are intentionally label-free so the boat orientation doesn't give away luv/læ).

## Roadmap (ideas, not commitments)

- Progress/score persistence — now feasible (`localStorage` available; guard for private mode).
- Audio or pronunciation for terms.
- "Mixed" quiz mode across all dels once per-del pools are solid.
