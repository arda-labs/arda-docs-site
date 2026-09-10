// scripts/emit-catalog.mjs
// Emits out/index.json and out/problems/[code]/page.json after Next.js static build
// to preserve the 10-field machine contract for /api/lookup and AI consumers.

import { readFile, writeFile, access, constants } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const outDir = path.resolve(rootDir, "out");
const catalogDataPath = path.resolve(rootDir, "content/catalog-data.json");

async function fileExists(filePath) {
  try {
    await access(filePath, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  console.log(`[emit-catalog] Loading metadata from ${catalogDataPath}...`);
  const raw = await readFile(catalogDataPath, "utf8");
  const parsed = JSON.parse(raw);
  const pages = Array.isArray(parsed) ? parsed : parsed.pages;

  console.log(`[emit-catalog] Emitting machine contract files to ${outDir}...`);

  // 1. Write out/index.json
  const searchIndex = pages.map((p) => ({
    code: p.code,
    title: p.title,
    status: p.status,
    summary: (p.summary ?? "").slice(0, 200),
  }));

  await writeFile(
    path.join(outDir, "index.json"),
    JSON.stringify(searchIndex, null, 2),
    "utf8",
  );
  console.log(`[emit-catalog] Written out/index.json (${searchIndex.length} items)`);

  // 2. Write out/problems/[code]/page.json for each problem
  let emittedCount = 0;
  let missingHtmlCount = 0;

  for (const page of pages) {
    const pageDir = path.join(outDir, "problems", page.code);
    const htmlPath = path.join(pageDir, "index.html");
    const jsonPath = path.join(pageDir, "page.json");

    if (!(await fileExists(htmlPath))) {
      console.warn(`[emit-catalog] Warning: missing HTML page at ${htmlPath}`);
      missingHtmlCount++;
    }

    const payload = {
      code: page.code,
      title: page.title,
      status: page.status,
      summary: page.summary ?? "",
      client_action: page.client_action ?? "",
      operator_action: page.operator_action ?? "",
      related_routes: page.related_routes ?? [],
      body: page.body ?? "",
      example: page.example ?? "",
    };

    await writeFile(jsonPath, JSON.stringify(payload, null, 2), "utf8");
    emittedCount++;
  }

  console.log(`[emit-catalog] Emitted ${emittedCount} page.json files.`);
  if (missingHtmlCount > 0) {
    throw new Error(`[emit-catalog] Failed: ${missingHtmlCount} problems lacked built index.html!`);
  }

  console.log(`[emit-catalog] Verification passed: 100% of ${emittedCount} problems have index.html and page.json.`);
}

main().catch((err) => {
  console.error("[emit-catalog] Error:", err);
  process.exit(1);
});
