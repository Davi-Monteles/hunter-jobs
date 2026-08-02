import { mkdir, readFile, writeFile } from "node:fs/promises";
import * as http from "node:http";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

import { DEMO_PROFILE } from "./profile.js";
import { scoreOpportunities } from "./scoring.js";
import type { OpportunityInput, ScoredOpportunity } from "./types.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const syntheticFile = path.join(root, "examples", "opportunities.synthetic.json");
const outputFile = path.join(root, "data", "opportunities.json");

async function loadSynthetic(): Promise<OpportunityInput[]> {
  const parsed: unknown = JSON.parse(await readFile(syntheticFile, "utf8"));
  if (!Array.isArray(parsed) || parsed.some((item) => typeof item !== "object" || item === null || (item as { synthetic?: unknown }).synthetic !== true)) {
    throw new Error("The demo accepts only records explicitly marked synthetic=true");
  }
  return parsed as OpportunityInput[];
}

async function buildDemo(): Promise<ScoredOpportunity[]> {
  return scoreOpportunities(await loadSynthetic(), DEMO_PROFILE);
}

async function writeDemo(): Promise<void> {
  const scored = await buildDemo();
  await mkdir(path.dirname(outputFile), { recursive: true });
  await writeFile(outputFile, `${JSON.stringify(scored, null, 2)}
`, "utf8");
  console.log(`Synthetic demo written to ${path.relative(root, outputFile)} (${scored.length} records)`);
}

async function serve(): Promise<void> {
  const dashboard = await readFile(path.join(root, "src", "dashboard.html"), "utf8");
  const port = Number(process.env.PORT || 7878);
  const server = http.createServer(async (request, response) => {
    const pathname = new URL(request.url || "/", `http://localhost:${port}`).pathname;
    if (pathname === "/api/opportunities") {
      response.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
      response.end(JSON.stringify(await buildDemo()));
      return;
    }
    response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    response.end(dashboard);
  });
  server.listen(port, () => console.log(`Hunter Jobs sanitized demo: http://localhost:${port}`));
}

const command = process.argv[2];
if (command === "demo") await writeDemo();
else if (command === "serve") await serve();
else throw new Error("Use: npm run demo | npm run serve");
