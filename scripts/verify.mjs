/*
 * Visual-verification harness driver.
 *
 *   npm run verify   →   scripts/out/del-*.png  (one contact sheet per del)
 *
 * Spins up the Vite dev server in-process, loads verify.html (which mounts
 * scripts/verifyHarness.jsx — the REAL <Diagram> for every part), and screenshots
 * each del section. Open the PNGs and check, per tile:
 *   - the correct element is the one lit in C.accent
 *   - point parts have the dot on the right spot
 *   - no permanent gold/orange where it isn't the answer
 *
 * See CLAUDE.md → "Visual verification". Requires `npx playwright install chromium`.
 */
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { mkdir } from "node:fs/promises";
import { createServer } from "vite";
import { chromium } from "playwright";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const outDir = resolve(__dirname, "out");

const GAMES = ["boat", "top", "bottom", "wind", "sides"];

const server = await createServer({
  root,
  configFile: resolve(root, "vite.config.js"),
  server: { port: 5199 },
  logLevel: "warn",
});
await server.listen();
const base = server.resolvedUrls.local[0]; // e.g. http://localhost:5199/

let exitCode = 0;
try {
  const browser = await chromium.launch();
  const page = await browser.newPage({ deviceScaleFactor: 2 });
  page.on("pageerror", (err) => {
    console.error("page error:", err.message);
    exitCode = 1;
  });

  await page.goto(`${base}verify.html`, { waitUntil: "networkidle" });
  await page.waitForSelector("#del-sides svg", { timeout: 15000 });

  await mkdir(outDir, { recursive: true });
  for (const g of GAMES) {
    const file = resolve(outDir, `del-${g}.png`);
    await page.locator(`#del-${g}`).screenshot({ path: file });
    console.log(`wrote ${file}`);
  }

  await browser.close();
} catch (err) {
  console.error(err);
  exitCode = 1;
} finally {
  await server.close();
}

console.log(
  exitCode === 0
    ? "\n✓ Contact sheets in scripts/out/. Open them and eyeball every tile."
    : "\n✗ Verification run failed — see errors above."
);
process.exit(exitCode);
