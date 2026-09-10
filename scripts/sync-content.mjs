// scripts/sync-content.mjs
// Pulls markdown files from arda-be/docs/problems/ and generates
// structured catalog data with pre-rendered Shiki syntax highlighting,
// domain clusters, schema attributes, and remediation policies.

import { readdir, readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createHighlighter } from "shiki";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const contentDir = path.resolve(rootDir, "content");

const CATALOG_DIR = process.env.ARDA_BE_PATH
  ? path.resolve(process.env.ARDA_BE_PATH, "docs/problems")
  : path.resolve(rootDir, "../arda-be/docs/problems");

const DOCS_BASE = "https://docs.arda.io.vn/problems/";

const STATUS_TEXT = new Map([
  [400, "Bad Request"], [401, "Unauthorized"], [403, "Forbidden"],
  [404, "Not Found"], [405, "Method Not Allowed"], [409, "Conflict"],
  [413, "Payload Too Large"], [422, "Unprocessable Entity"],
  [429, "Too Many Requests"], [500, "Internal Server Error"],
  [502, "Bad Gateway"], [503, "Service Unavailable"], [504, "Gateway Timeout"],
]);

export function statusText(status) {
  return STATUS_TEXT.get(status) ?? `HTTP ${status}`;
}

const STATUS_DEFAULTS = new Map([
  [400, {
    summary: "The server rejected the request because its payload or parameters failed validation.",
    client: "Do not retry unchanged. Fix the request (see `errors[]` for the failing fields) and send it again.",
    operator: "Trace `request_id`, compare the payload against the endpoint's OpenAPI schema, and check whether the caller sent a field with the wrong type or format.",
    retry: "NON_RETRYABLE",
  }],
  [401, {
    summary: "The request carries no usable authenticated session or bearer token.",
    client: "Start or refresh the login flow, then repeat the request with a fresh session. Do not try to repair it by adding identity headers.",
    operator: "Trace `request_id`, inspect cookie/CORS/origin handling, and confirm the auth-gateway can resolve the IAM user context.",
    retry: "REQUIRES_REAUTH",
  }],
  [403, {
    summary: "The authenticated actor is not allowed to perform this action.",
    client: "Do not retry unchanged. Show access denied and guide the user to request the missing permission.",
    operator: "Trace `request_id` and check the actor's roles/permissions and the auth-gateway policy route matched for the request.",
    retry: "NON_RETRYABLE",
  }],
  [404, {
    summary: "The requested resource does not exist, or the actor is not allowed to see it.",
    client: "Do not retry unchanged. Verify the identifier and refresh any stale list views.",
    operator: "Trace `request_id`, confirm the resource exists in the owning service's database, and check tenant scoping of the lookup.",
    retry: "NON_RETRYABLE",
  }],
  [405, {
    summary: "The HTTP method is not supported by the requested route.",
    client: "Do not retry. Fix the client to call the documented method for this route.",
    operator: "Check whether a client or proxy is calling an outdated path or method, and compare with the published OpenAPI document.",
    retry: "NON_RETRYABLE",
  }],
  [409, {
    summary: "The request conflicts with the current state of the resource.",
    client: "Reload the resource, re-apply the change on top of the fresh state, and retry once.",
    operator: "Trace `request_id`, inspect the current resource state, and check for concurrent writers or a duplicate business key.",
    retry: "RETRY_AFTER_REFRESH",
  }],
  [429, {
    summary: "The client sent too many requests in the current time window.",
    client: "Retry later with exponential backoff and honour the `Retry-After` response header when present.",
    operator: "Check rate-limit counters and whether a misbehaving client or retry loop is generating the traffic spike.",
    retry: "EXPONENTIAL_BACKOFF",
  }],
  [500, {
    summary: "An unexpected error occurred while the server processed the request.",
    client: "Retry a limited number of times with backoff. If it persists, report the `request_id` to the operations team.",
    operator: "Correlate `request_id` and `trace_id` in the service logs for the failing handler, and check recent deployments and migrations.",
    retry: "TRANSIENT_BACKOFF",
  }],
  [502, {
    summary: "An upstream dependency answered with an error or timed out.",
    client: "Retry later with backoff. The failure is transient and not caused by the request payload.",
    operator: "Check the health of the upstream dependency named in the logs and the `trace_id` for the failing hop.",
    retry: "TRANSIENT_BACKOFF",
  }],
]);

function defaultExample(code, status) {
  const problem = {
    type: DOCS_BASE + code,
    title: statusText(status),
    status,
    code,
    message: "<human-readable message>",
    request_id: "<request_id>",
    trace_id: "<trace_id>",
  };
  const body = JSON.stringify(problem, null, 2);
  return `HTTP/1.1 ${status} ${statusText(status)}\nContent-Type: application/problem+json\n\n${body}`;
}

function stripQuotes(value) {
  if (value.length >= 2) {
    const first = value[0];
    if ((first === '"' || first === "'") && value.at(-1) === first) {
      return value.slice(1, -1);
    }
  }
  return value;
}

function parseFrontMatter(raw, filename) {
  if (!raw.startsWith("---\n") && !raw.startsWith("---\r\n")) {
    throw new Error(`${filename}: missing front-matter block (must start with ---)`);
  }
  const lines = raw.split(/\r?\n/);
  let cursor = 1;
  while (cursor < lines.length && lines[cursor] !== "---") {
    cursor++;
  }
  if (cursor >= lines.length) {
    throw new Error(`${filename}: unterminated front-matter block (no closing ---)`);
  }
  const data = {};
  let key = null;
  let blockMode = null;
  let blockIndent = 0;
  let blockLines = [];
  let listItems = null;

  const flush = () => {
    if (key === null) return;
    if (blockMode === "|") {
      data[key] = blockLines.join("\n").replace(/\s+$/, "");
    } else if (blockMode === ">") {
      data[key] = blockLines.join(" ").replace(/\s+/g, " ").trim();
    } else if (listItems !== null) {
      data[key] = listItems;
    } else if (blockLines.length > 0) {
      data[key] = blockLines.join("\n").replace(/\s+$/, "");
    }
    key = null;
    blockMode = null;
    blockIndent = 0;
    blockLines = [];
    listItems = null;
  };

  for (let i = 1; i < cursor; i++) {
    const line = lines[i];
    if (line.trim() === "") {
      if (blockMode) blockLines.push("");
      continue;
    }
    if (blockMode) {
      const indent = line.search(/\S/);
      if (indent === -1) {
        blockLines.push("");
        continue;
      }
      if (blockIndent === 0) {
        if (indent === 0) {
          flush();
        } else {
          blockIndent = indent;
          blockLines.push(line.slice(blockIndent));
          continue;
        }
      } else if (indent >= blockIndent) {
        blockLines.push(line.slice(blockIndent));
        continue;
      } else {
        flush();
      }
    }
    if (key !== null && listItems !== null) {
      const li = line.match(/^\s+-\s+(.*)$/);
      if (li) {
        listItems.push(li[1]);
        continue;
      }
      throw new Error(`${filename}: front-matter line ${i + 1} is not a list item under \`${key}\`: ${line.trim().slice(0, 60)}`);
    }
    const match = line.match(/^([a-z_]+):\s*(.*)$/);
    if (!match) {
      throw new Error(`${filename}: cannot parse front-matter line ${i + 1}: ${line.trim().slice(0, 60)}`);
    }
    flush();
    key = match[1];
    const rest = match[2];
    if (rest === "|" || rest === ">") {
      blockMode = rest;
      blockIndent = 0;
      blockLines = [];
    } else if (rest === "") {
      listItems = [];
    } else {
      data[key] = /^\d+$/.test(rest) ? Number(rest) : stripQuotes(rest);
      key = null;
    }
  }
  flush();

  const body = lines.slice(cursor + 1).join("\n").replace(/^\n+/, "").replace(/\s+$/, "");
  return { data, body };
}

function normalizeCategory(code) {
  if (code.startsWith("ai.") || code === "ai_runtime_identity_unavailable") return "ai";
  if (code.startsWith("rag.")) return "rag";
  if (code.startsWith("iam.")) return "iam";
  if (code.startsWith("auth.") || ["not_authenticated", "insufficient_permissions", "recent_auth_required", "organization_forbidden"].includes(code)) return "auth";
  if (code.startsWith("tenant.") || code === "tenant_context_unavailable") return "tenant";
  if (code.startsWith("calendar.")) return "calendar";
  if (code.startsWith("validation.")) return "validation";
  if (code.startsWith("media.")) return "media";
  if (code.startsWith("loan.")) return "loan";
  if (code.startsWith("deposit.")) return "deposit";
  if (code.startsWith("finance.")) return "finance";
  if (code.startsWith("workflow.")) return "workflow";
  if (code.startsWith("crm.")) return "crm";
  return "gateway";
}

// 4 High-level Domain Clusters
const CLUSTERS = {
  security: {
    id: "security",
    title: "Bảo mật & Định danh",
    title_en: "Security & Identity",
    categories: ["auth", "iam", "tenant"],
  },
  platform: {
    id: "platform",
    title: "Cổng Dịch vụ & Hạ tầng",
    title_en: "Gateway & Platform",
    categories: ["gateway", "validation", "calendar", "media"],
  },
  core: {
    id: "core",
    title: "Nghiệp vụ Ngân hàng Lõi",
    title_en: "Core Banking Engine",
    categories: ["finance", "loan", "deposit", "workflow", "crm"],
  },
  ai: {
    id: "ai",
    title: "Trí tuệ Nhân tạo & RAG",
    title_en: "AI & Knowledge Engine",
    categories: ["ai", "rag"],
  },
};

const CATEGORY_TITLES = {
  auth: { vi: "Xác thực & Phiên (Auth)", en: "Authentication & Security" },
  iam: { vi: "Phân quyền & Định danh (IAM)", en: "Identity & Permissions (IAM)" },
  gateway: { vi: "Cổng API & Định tuyến", en: "API Gateway & Routing" },
  tenant: { vi: "Cách ly Đa Người thuê", en: "Multi-Tenant Isolation" },
  calendar: { vi: "Lịch & Khóa sổ Cutoff", en: "Calendar & Cutoff" },
  validation: { vi: "Kiểm tra Dữ liệu Vào", en: "Validation Errors" },
  media: { vi: "Lưu trữ Đa phương tiện", en: "Media & Streaming" },
  rag: { vi: "Động cơ Tri thức RAG", en: "RAG & Knowledge Engine" },
  ai: { vi: "Mô hình AI & Agents", en: "AI & Agents" },
  loan: { vi: "Tín dụng & Khoản vay", en: "Loan & Credit" },
  deposit: { vi: "Tiền gửi & Tài khoản", en: "Deposit & Accounts" },
  finance: { vi: "Sổ cái Kế toán GL", en: "Finance & Ledger" },
  workflow: { vi: "Quy trình Zeebe Sagas", en: "Workflow & Sagas" },
  crm: { vi: "Khách hàng & Đối tác CRM", en: "CRM & Customers" },
};

function getClusterForCategory(cat) {
  for (const [clusterKey, cluster] of Object.entries(CLUSTERS)) {
    if (cluster.categories.includes(cat)) return clusterKey;
  }
  return "platform";
}

async function main() {
  console.log(`[sync-content] Reading problem catalog from: ${CATALOG_DIR}`);
  const files = (await readdir(CATALOG_DIR)).filter((n) => n.endsWith(".md") && n !== "README.md").sort();
  if (files.length === 0) {
    throw new Error(`No problem markdown files found in ${CATALOG_DIR}`);
  }

  console.log(`[sync-content] Initializing Shiki syntax highlighter...`);
  const highlighter = await createHighlighter({
    themes: ["github-dark-dimmed"],
    langs: ["json", "bash", "go", "typescript", "http"],
  });

  const pages = [];
  for (const file of files) {
    const raw = await readFile(path.join(CATALOG_DIR, file), "utf8");
    const { data, body } = parseFrontMatter(raw, file);
    const def = STATUS_DEFAULTS.get(data.status) ?? STATUS_DEFAULTS.get(500);
    const client = data.client_action ?? def.client;
    const operator = data.operator_action ?? def.operator;
    const retryPolicy = def.retry ?? "NON_RETRYABLE";
    const example = data.example ?? defaultExample(data.code, data.status);
    const related = data.related_routes ?? [];
    const cat = normalizeCategory(data.code);
    const cluster = getClusterForCategory(cat);

    // Build code snippets
    const sampleRoute = related[0] || "/api/v1/resource";
    const curlSnippet = `curl -i -X GET "https://api.arda.io.vn${sampleRoute}" \\
  -H "Authorization: Bearer $ARDA_API_TOKEN" \\
  -H "X-Tenant-Id: 00000000-0000-0000-0000-000000000010"`;

    const goSnippet = `// Go Core Banking Client
resp, err := ardaClient.Do(ctx, req)
if err != nil {
    var prob *ardaerrors.Problem
    if errors.As(err, &prob) && prob.Code == "${data.code}" {
        // Handle ${data.title}
        log.Printf("[ARDA] Request %s failed: %s", prob.RequestID, prob.Message)
    }
}`;

    const tsSnippet = `// TypeScript / Frontend Client
try {
  await apiClient.get('${sampleRoute}');
} catch (error: any) {
  if (error.code === '${data.code}') {
    // ${data.title}
    console.error('Client Action:', error.client_action);
  }
}`;

    // Syntax highlight with Shiki
    const exampleHtml = highlighter.codeToHtml(example, { lang: "http", theme: "github-dark-dimmed" });
    const curlHtml = highlighter.codeToHtml(curlSnippet, { lang: "bash", theme: "github-dark-dimmed" });
    const goHtml = highlighter.codeToHtml(goSnippet, { lang: "go", theme: "github-dark-dimmed" });
    const tsHtml = highlighter.codeToHtml(tsSnippet, { lang: "typescript", theme: "github-dark-dimmed" });

    pages.push({
      code: data.code,
      status: Number(data.status),
      title: data.title,
      summary: data.summary ?? def.summary,
      client_action: client,
      operator_action: operator,
      retry_policy: retryPolicy,
      related_routes: related,
      example,
      body,
      category: cat,
      category_title: CATEGORY_TITLES[cat]?.en || cat.toUpperCase(),
      category_title_vi: CATEGORY_TITLES[cat]?.vi || cat.toUpperCase(),
      cluster,
      domain: data.code.split(".")[0],
      snippets: {
        exampleHtml,
        curl: { code: curlSnippet, html: curlHtml },
        go: { code: goSnippet, html: goHtml },
        typescript: { code: tsSnippet, html: tsHtml },
      },
    });
  }

  pages.sort((a, b) => a.status - b.status || a.code.localeCompare(b.code));
  console.log(`[sync-content] Loaded and highlighted ${pages.length} problem pages.`);

  await mkdir(contentDir, { recursive: true });

  // Build Cluster Tree
  const clusterGroups = [];
  for (const [clusterKey, clusterMeta] of Object.entries(CLUSTERS)) {
    const categoriesInCluster = [];
    for (const cat of clusterMeta.categories) {
      const items = pages
        .filter((p) => p.category === cat)
        .map((p) => ({
          code: p.code,
          title: p.title,
          status: p.status,
        }));

      if (items.length > 0) {
        categoriesInCluster.push({
          id: cat,
          title: CATEGORY_TITLES[cat]?.en || cat.toUpperCase(),
          title_vi: CATEGORY_TITLES[cat]?.vi || cat.toUpperCase(),
          items,
        });
      }
    }

    if (categoriesInCluster.length > 0) {
      clusterGroups.push({
        id: clusterKey,
        title: clusterMeta.title_en,
        title_vi: clusterMeta.title,
        categories: categoriesInCluster,
        totalCodes: categoriesInCluster.reduce((sum, c) => sum + c.items.length, 0),
      });
    }
  }

  // Flat category list for backwards-compatibility
  const flatCategories = [];
  for (const c of clusterGroups) {
    for (const cat of c.categories) {
      flatCategories.push(cat);
    }
  }

  // Write content/catalog-data.json
  await writeFile(
    path.join(contentDir, "catalog-data.json"),
    JSON.stringify({ pages, clusters: clusterGroups, categories: flatCategories }, null, 2),
    "utf8"
  );
  console.log(`[sync-content] Written content/catalog-data.json (${pages.length} items, ${clusterGroups.length} clusters).`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
