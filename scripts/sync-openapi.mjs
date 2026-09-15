// scripts/sync-openapi.mjs
// Publishes the Arda public OpenAPI documents (arda-be/contracts/openapi/*.json)
// as machine-readable static assets under /openapi/ and records a build-time
// manifest for the API Gateway page.
//
// Single Source of Truth: the specs live in arda-be. This script never edits
// them; it validates the same invariants as arda-be/scripts/check-openapi.mjs
// and copies the documents byte-for-byte.

import { readdir, readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const contentDir = path.resolve(rootDir, "content");
const outOpenApiDir = path.resolve(rootDir, "public/openapi");

const OPENAPI_DIR = process.env.ARDA_BE_PATH
  ? path.resolve(process.env.ARDA_BE_PATH, "contracts/openapi")
  : path.resolve(rootDir, "../arda-be/contracts/openapi");

const METHODS = ["get", "post", "put", "patch", "delete"];

// Pilot documents map to their owning service; new specs follow <stem>-service.
const SERVICE_BY_STEM = {
  auth: "auth-gateway",
  iam: "iam-service",
  media: "media-service",
};

function serviceFor(filename) {
  const stem = filename.replace(/\.json$/, "").replace(/-v\d+$/, "");
  return SERVICE_BY_STEM[stem] ?? `${stem}-service`;
}

function validateDocument(file, document) {
  if (document.openapi !== "3.1.0") throw new Error(`${file}: OpenAPI 3.1.0 is required`);
  if (!document.paths || Object.keys(document.paths).length === 0) {
    throw new Error(`${file}: OpenAPI document has no paths`);
  }

  const operations = [];
  for (const [route, item] of Object.entries(document.paths)) {
    for (const [method, operation] of Object.entries(item)) {
      if (!METHODS.includes(method)) continue;
      if (!operation.operationId) throw new Error(`${file}: ${method.toUpperCase()} ${route} has no operationId`);
      const hasSuccessResponse = Object.keys(operation.responses ?? {}).some((status) => {
        const first = status[0];
        return first === "2" || first === "3";
      });
      if (!hasSuccessResponse) {
        throw new Error(`${file}: ${operation.operationId} has no 2xx/3xx success response`);
      }
      operations.push({
        method: method.toUpperCase(),
        path: route,
        operationId: operation.operationId,
      });
    }
  }

  const schemas = document.components?.schemas ?? {};
  for (const required of ["ResponseMeta", "Problem"]) {
    if (!schemas[required]) throw new Error(`${file}: missing canonical schema ${required}`);
  }
  if (document.components?.securitySchemes?.ardaSession?.["x-browser-credentials"] !== "include") {
    throw new Error(`${file}: browser API security scheme must require credentials: include`);
  }
  return operations;
}

async function main() {
  console.log(`[sync-openapi] Reading OpenAPI documents from: ${OPENAPI_DIR}`);
  let files;
  try {
    files = (await readdir(OPENAPI_DIR)).filter((name) => name.endsWith(".json")).sort();
  } catch {
    throw new Error(
      `OpenAPI directory not found: ${OPENAPI_DIR} (set ARDA_BE_PATH to the arda-be checkout)`,
    );
  }
  if (files.length === 0) {
    throw new Error(`No OpenAPI documents found in ${OPENAPI_DIR}`);
  }

  await mkdir(outOpenApiDir, { recursive: true });

  const documents = [];
  let totalOperations = 0;
  for (const file of files) {
    const raw = await readFile(path.join(OPENAPI_DIR, file), "utf8");
    const document = JSON.parse(raw);
    const operations = validateDocument(file, document);
    operations.sort((a, b) => a.path.localeCompare(b.path) || a.method.localeCompare(b.method));

    await writeFile(path.join(outOpenApiDir, file), raw, "utf8");

    documents.push({
      file,
      url: `/openapi/${file}`,
      title: document.info?.title ?? file,
      version: document.info?.version ?? "",
      openapi: document.openapi,
      service: serviceFor(file),
      server: document.servers?.[0]?.url ?? "",
      operationCount: operations.length,
      operations,
    });
    totalOperations += operations.length;
  }

  const manifest = {
    documents,
    totals: { documents: documents.length, operations: totalOperations },
  };
  const manifestJson = JSON.stringify(manifest, null, 2) + "\n";

  await mkdir(contentDir, { recursive: true });
  await writeFile(path.join(contentDir, "openapi-manifest.json"), manifestJson, "utf8");
  // Machine-readable listing for Postman/IDE/codegen consumers.
  await writeFile(path.join(outOpenApiDir, "index.json"), manifestJson, "utf8");

  console.log(
    `[sync-openapi] Published ${documents.length} documents (${totalOperations} operations) to public/openapi/`,
  );
  console.log(`[sync-openapi] Written content/openapi-manifest.json + public/openapi/index.json`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
