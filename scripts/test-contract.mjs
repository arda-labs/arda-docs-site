// scripts/test-contract.mjs
// Verifies the 10-field machine contract, status codes, and worker lookup logic.

import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.resolve(__dirname, "../out");

const REQUIRED_PAGE_FIELDS = [
  "code", "title", "status", "summary",
  "client_action", "operator_action",
  "related_routes", "body", "example"
];

async function runTests() {
  console.log("=== Testing Problem Catalog Contract ===");

  // 1. Validate out/index.json
  const indexRaw = await readFile(path.join(outDir, "index.json"), "utf8");
  const index = JSON.parse(indexRaw);

  if (!Array.isArray(index) || index.length === 0) {
    throw new Error(`Invalid index.json: expected non-empty array, got ${typeof index}`);
  }
  console.log(`[PASS] index.json contains ${index.length} problems`);

  for (const item of index) {
    if (!item.code || !item.title || !item.status) {
      throw new Error(`Invalid index entry: ${JSON.stringify(item)}`);
    }
  }
  console.log(`[PASS] All ${index.length} index entries have required metadata`);

  // 2. Validate out/problems/[code]/page.json for every problem
  let verifiedPages = 0;
  for (const item of index) {
    const pageJsonPath = path.join(outDir, "problems", item.code, "page.json");
    const raw = await readFile(pageJsonPath, "utf8");
    const page = JSON.parse(raw);

    for (const field of REQUIRED_PAGE_FIELDS) {
      if (page[field] === undefined) {
        throw new Error(`Page ${item.code} missing required field '${field}'`);
      }
    }

    if (typeof page.status !== "number" || page.status < 400 || page.status > 599) {
      throw new Error(`Page ${item.code} has invalid status: ${page.status}`);
    }

    verifiedPages++;
  }
  console.log(`[PASS] All ${verifiedPages} page.json files adhere to the 9-field static schema`);

  // 3. Simulate Worker handleLookup behavior
  console.log("\n=== Testing Cloudflare Worker Lookup Logic ===");

  // Mock Env with ASSETS fetch
  const env = {
    ASSETS: {
      async fetch(request) {
        const url = new URL(request.url);
        let filePath;
        if (url.pathname === "/index.json") {
          filePath = path.join(outDir, "index.json");
        } else if (url.pathname.endsWith("/page.json")) {
          filePath = path.join(outDir, url.pathname.slice(1));
        } else {
          return new Response("Not Found", { status: 404 });
        }
        try {
          const content = await readFile(filePath, "utf8");
          return new Response(content, {
            status: 200,
            headers: { "content-type": "application/json" }
          });
        } catch {
          return new Response("Not Found", { status: 404 });
        }
      }
    }
  };

  // Re-create worker logic for verification
  async function handleLookup(url) {
    const code = (url.searchParams.get("code") ?? "").trim();
    if (!code) return { status: 400, body: { found: false, error: "missing code query parameter" } };

    const full = url.searchParams.get("full") !== "0";
    const res = await env.ASSETS.fetch(new Request(new URL("/index.json", url)));
    const catalogIndex = await res.json();

    const page = catalogIndex.find((e) => e.code === code);
    if (page) {
      const base = {
        code: page.code,
        title: page.title,
        status: page.status,
        summary: page.summary,
        url: `https://docs.arda.io.vn/problems/${page.code}/`,
      };
      if (!full) return { status: 200, body: { found: true, page: base } };

      const docRes = await env.ASSETS.fetch(new Request(new URL(`/problems/${page.code}/page.json`, url)));
      if (docRes.ok) {
        const doc = await docRes.json();
        return { status: 200, body: { found: true, page: { ...base, ...doc } } };
      }
      return { status: 200, body: { found: true, page: base } };
    }

    const lower = code.toLowerCase();
    const suggestions = catalogIndex
      .filter((e) => e.code.toLowerCase().includes(lower) || lower.includes(e.code.split(".")[0]))
      .slice(0, 8)
      .map((e) => ({ code: e.code, title: e.title, status: e.status }));
    return { status: 404, body: { found: false, suggestions } };
  }

  // Test Case A: Known code lookup with full=1
  const testA = await handleLookup(new URL("https://docs.arda.io.vn/api/lookup?code=ai.model_unavailable&full=1"));
  if (testA.status !== 200 || !testA.body.found) {
    throw new Error(`Test A failed: expected 200 found, got ${JSON.stringify(testA)}`);
  }
  const pageA = testA.body.page;
  const EXPECTED_TEN_FIELDS = [
    "code", "title", "status", "summary", "url",
    "client_action", "operator_action", "related_routes", "body", "example"
  ];
  for (const f of EXPECTED_TEN_FIELDS) {
    if (pageA[f] === undefined) {
      throw new Error(`Test A failed: missing expected field '${f}' in 10-field contract`);
    }
  }
  if (pageA.url !== "https://docs.arda.io.vn/problems/ai.model_unavailable/") {
    throw new Error(`Test A failed: unexpected URL '${pageA.url}'`);
  }
  console.log(`[PASS] Case A: Known code 'ai.model_unavailable' returned exact 10-field contract`);

  // Test Case B: Unknown code suggestions
  const testB = await handleLookup(new URL("https://docs.arda.io.vn/api/lookup?code=ai.unknown_code"));
  if (testB.status !== 404 || testB.body.found !== false || !Array.isArray(testB.body.suggestions)) {
    throw new Error(`Test B failed: expected 404 with suggestions, got ${JSON.stringify(testB)}`);
  }
  if (testB.body.suggestions.length === 0) {
    throw new Error(`Test B failed: suggestions array is empty`);
  }
  console.log(`[PASS] Case B: Unknown code 'ai.unknown_code' returned 404 with ${testB.body.suggestions.length} suggestions`);

  // Test Case C: Missing code parameter
  const testC = await handleLookup(new URL("https://docs.arda.io.vn/api/lookup"));
  if (testC.status !== 400 || testC.body.found !== false) {
    throw new Error(`Test C failed: expected 400, got ${JSON.stringify(testC)}`);
  }
  console.log(`[PASS] Case C: Missing code query parameter correctly returned 400`);

  // 4. Validate published OpenAPI documents under out/openapi/
  console.log("\n=== Testing OpenAPI Publishing Contract ===");

  const openApiDir = path.join(outDir, "openapi");
  const manifest = JSON.parse(await readFile(path.join(openApiDir, "index.json"), "utf8"));

  if (!Array.isArray(manifest.documents) || manifest.documents.length === 0) {
    throw new Error("openapi/index.json: expected a non-empty documents array");
  }

  let verifiedSpecs = 0;
  let verifiedOperations = 0;
  for (const doc of manifest.documents) {
    if (doc.url !== `/openapi/${doc.file}`) {
      throw new Error(`OpenAPI manifest: ${doc.file} has unexpected url '${doc.url}'`);
    }

    const spec = JSON.parse(await readFile(path.join(openApiDir, doc.file), "utf8"));
    if (spec.openapi !== "3.1.0") throw new Error(`${doc.file}: OpenAPI 3.1.0 is required`);
    if (!spec.paths || Object.keys(spec.paths).length === 0) {
      throw new Error(`${doc.file}: OpenAPI document has no paths`);
    }
    for (const required of ["ResponseMeta", "Problem"]) {
      if (!spec.components?.schemas?.[required]) {
        throw new Error(`${doc.file}: missing canonical schema ${required}`);
      }
    }

    let counted = 0;
    for (const [route, item] of Object.entries(spec.paths)) {
      for (const [method, operation] of Object.entries(item)) {
        if (!["get", "post", "put", "patch", "delete"].includes(method)) continue;
        if (!operation.operationId) {
          throw new Error(`${doc.file}: ${method.toUpperCase()} ${route} has no operationId`);
        }
        const hasSuccess = Object.keys(operation.responses ?? {}).some(
          (status) => status[0] === "2" || status[0] === "3",
        );
        if (!hasSuccess) {
          throw new Error(`${doc.file}: ${operation.operationId} has no 2xx/3xx success response`);
        }
        counted++;
      }
    }
    if (counted !== doc.operationCount) {
      throw new Error(`${doc.file}: manifest says ${doc.operationCount} operations, spec has ${counted}`);
    }
    verifiedSpecs++;
    verifiedOperations += counted;
  }
  if (manifest.totals.documents !== verifiedSpecs || manifest.totals.operations !== verifiedOperations) {
    throw new Error(
      `OpenAPI manifest totals mismatch: ${JSON.stringify(manifest.totals)} vs ${verifiedSpecs}/${verifiedOperations}`,
    );
  }
  console.log(
    `[PASS] ${verifiedSpecs} OpenAPI documents (${verifiedOperations} operations) published with valid contracts`,
  );

  console.log("\nALL CONTRACT VERIFICATION TESTS PASSED!");
}

runTests().catch((err) => {
  console.error("Verification failed:", err);
  process.exit(1);
});
