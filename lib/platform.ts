// Single source for the platform facts rendered on the static documentation
// pages (about / architecture / api-reference / workflows / guidelines).
// Every row below was verified against the source repositories:
// - Services + ports: arda-be/go.work, arda-be/apps/*
// - Module Federation ports: arda-mfe/federation.shared.ts
// - Gateway upstreams: arda-be/apps/auth-gateway/internal/handler/bff_handler.go
// - Injected headers: same proxy path (X-User-*/X-Tenant-Id/X-Roles/...)
// - EOD sequence: arda-be/apps/platform-service/internal/service/eod_service.go
// - Risk tiers + route count: arda-be/apps/auth-gateway/configs/policy.yaml

export interface LocalizedText {
  en: string;
  vi: string;
}

export function pick(text: LocalizedText, locale: string) {
  return locale === 'vi' ? text.vi : text.en;
}

export interface ServiceRow {
  name: string;
  database: string;
  responsibility: LocalizedText;
}

export const SERVICES: ServiceRow[] = [
  {
    name: 'auth-gateway',
    database: '—',
    responsibility: {
      en: 'BFF edge: OAuth2/OIDC proxy, forward-auth, session cookie, header injection, policy enforcement.',
      vi: 'BFF edge: proxy OAuth2/OIDC, forward-auth, cookie phiên, bơm header định danh, thực thi policy.',
    },
  },
  {
    name: 'ai-service',
    database: 'ai',
    responsibility: {
      en: 'Olorin assistant: AG-UI agent runtime, conversations, HITL approvals, RAG knowledge, quotas.',
      vi: 'Trợ lý Olorin: runtime AG-UI, hội thoại, phê duyệt HITL, tri thức RAG, hạn ngạch.',
    },
  },
  {
    name: 'iam-service',
    database: 'iam',
    responsibility: {
      en: 'Users, Casbin RBAC, permissions, MFA devices, audit trail, login orchestration.',
      vi: 'Người dùng, RBAC Casbin, quyền, thiết bị MFA, nhật ký kiểm toán, điều phối đăng nhập.',
    },
  },
  {
    name: 'platform-service',
    database: 'platform',
    responsibility: {
      en: 'System parameters, lookups, organizations, geography, EOD/COB engine, public branding.',
      vi: 'Tham số hệ thống, danh mục, tổ chức, địa lý, động cơ EOD/COB, branding công khai.',
    },
  },
  {
    name: 'finance-service',
    database: 'finance',
    responsibility: {
      en: 'Chart of accounts, double-entry posting engine, periods, journal, trial balance, statements.',
      vi: 'Hệ thống tài khoản, động cơ hạch toán kép, kỳ kế toán, nhật ký, cân đối thử, báo cáo.',
    },
  },
  {
    name: 'workflow-service',
    database: 'workflow',
    responsibility: {
      en: 'Sole Zeebe 8.5 facade: business cases, BPMN definitions, SLA, job workers, task projection.',
      vi: 'Cửa ngõ duy nhất tới Zeebe 8.5: hồ sơ, định nghĩa BPMN, SLA, job worker, chiếu tác vụ.',
    },
  },
  {
    name: 'crm-service',
    database: 'crm',
    responsibility: {
      en: 'Customer management, registration/adjustment BPM cases, customer scoping.',
      vi: 'Quản lý khách hàng, hồ sơ đăng ký/điều chỉnh, phạm vi dữ liệu theo khách hàng.',
    },
  },
  {
    name: 'hrm-service',
    database: 'hrm',
    responsibility: {
      en: 'Positions, employees, organization units, employee registration cases.',
      vi: 'Chức danh, nhân viên, đơn vị tổ chức, hồ sơ đăng ký nhân sự.',
    },
  },
  {
    name: 'notification-service',
    database: 'noti',
    responsibility: {
      en: 'User inbox, Web Push, NATS outbox delivery worker, per-tenant sender configs.',
      vi: 'Hộp thư người dùng, Web Push, worker phát NATS outbox, cấu hình sender theo tenant.',
    },
  },
  {
    name: 'media-service',
    database: 'media',
    responsibility: {
      en: 'S3 (Garage) gateway: uploads, content streaming, file metadata and access checks.',
      vi: 'Cổng S3 (Garage): tải lên, truyền nội dung, metadata file và kiểm tra truy cập.',
    },
  },
  {
    name: 'mdm-service',
    database: 'mdm',
    responsibility: {
      en: 'Master data: currencies, countries, interest rates and reference attributes.',
      vi: 'Dữ liệu gốc: tiền tệ, quốc gia, lãi suất và thuộc tính tham chiếu.',
    },
  },
  {
    name: 'loan-service',
    database: 'loan',
    responsibility: {
      en: 'Loan lifecycle: products, formation, disbursement batches, collection, accrual, provision.',
      vi: 'Vòng đời khoản vay: sản phẩm, khởi tạo, giải ngân theo lô, thu nợ, dồn tích, dự phòng.',
    },
  },
  {
    name: 'deposit-service',
    database: 'deposit',
    responsibility: {
      en: 'Savings/term deposits, product catalog, interest accrual, interbank (IBM) flows.',
      vi: 'Tiền gửi tiết kiệm/kỳ hạn, danh mục sản phẩm, dồn tích lãi, luồng liên ngân hàng (IBM).',
    },
  },
  {
    name: 'capital-service',
    database: 'capital',
    responsibility: {
      en: 'Capital contracts, amendments, fund movements (CFC) and utilization flows.',
      vi: 'Hợp đồng vốn, điều chỉnh, luồng quỹ (CFC) và sử dụng vốn.',
    },
  },
  {
    name: 'statistical-service',
    database: 'statistical',
    responsibility: {
      en: 'Statistical report definitions, indicators, submissions and export.',
      vi: 'Định nghĩa báo cáo thống kê, chỉ tiêu, kỳ nộp và xuất dữ liệu.',
    },
  },
];

export interface ModuleRow {
  name: string;
  port: number;
  scope: LocalizedText;
}

export const MFE_MODULES: ModuleRow[] = [
  {
    name: 'shell',
    port: 5000,
    scope: {
      en: 'Host container: layout, auth bootstrap, navigation, lazy remote loading, AI dock.',
      vi: 'Host: layout, khởi tạo phiên, điều hướng, nạp remote theo lazy, AI dock.',
    },
  },
  {
    name: 'iam',
    port: 5101,
    scope: {
      en: 'Identity & access admin: users, groups, roles, permissions, audit, tenants, system settings.',
      vi: 'Quản trị định danh: người dùng, nhóm, vai trò, quyền, kiểm toán, tenant, cấu hình hệ thống.',
    },
  },
  {
    name: 'platform',
    port: 5102,
    scope: {
      en: 'Master data & platform admin: organizations, parameters, lookups, menus, EOD jobs.',
      vi: 'Dữ liệu nền & quản trị nền tảng: tổ chức, tham số, danh mục, menu, tác vụ EOD.',
    },
  },
  {
    name: 'finance',
    port: 5103,
    scope: {
      en: 'Finance operations: chart of accounts, journal, posting flows, trial balance, statements.',
      vi: 'Nghiệp vụ kế toán: hệ thống tài khoản, nhật ký, luồng hạch toán, cân đối thử, báo cáo.',
    },
  },
  {
    name: 'account',
    port: 5104,
    scope: {
      en: 'Profile & account settings: security, sessions, devices, appearance.',
      vi: 'Hồ sơ & cài đặt tài khoản: bảo mật, phiên, thiết bị, giao diện.',
    },
  },
  {
    name: 'hrm',
    port: 5105,
    scope: {
      en: 'HRM: positions, employees, org units, registration cases.',
      vi: 'Nhân sự: chức danh, nhân viên, đơn vị, hồ sơ đăng ký.',
    },
  },
  {
    name: 'workflow',
    port: 5106,
    scope: {
      en: 'BPMN admin & monitoring: case types, process definitions, instances, jobs, incidents.',
      vi: 'Quản trị & giám sát BPMN: loại hồ sơ, định nghĩa quy trình, instance, job, sự cố.',
    },
  },
  {
    name: 'crm',
    port: 5107,
    scope: {
      en: 'CRM & workbench: customers, registration/adjustment cases, transaction workbench.',
      vi: 'CRM & bàn xử lý: khách hàng, hồ sơ đăng ký/điều chỉnh, bàn giao dịch.',
    },
  },
  {
    name: 'ai',
    port: 5108,
    scope: {
      en: 'AI workspace: assistant, knowledge/RAG, approvals, tools, analytics, settings.',
      vi: 'Không gian AI: trợ lý, tri thức/RAG, phê duyệt, công cụ, phân tích, cấu hình.',
    },
  },
  {
    name: 'loan',
    port: 5109,
    scope: {
      en: 'Loan: products, VFU, formation, disbursements, collections, provisions.',
      vi: 'Tín dụng: sản phẩm, VFU, khởi tạo, giải ngân, thu nợ, dự phòng.',
    },
  },
  {
    name: 'mdm',
    port: 5110,
    scope: {
      en: 'Master data: currencies, countries, interest rates.',
      vi: 'Dữ liệu gốc: tiền tệ, quốc gia, lãi suất.',
    },
  },
  {
    name: 'deposit',
    port: 8110,
    scope: {
      en: 'Deposit: savings, term products, interest, interbank.',
      vi: 'Tiền gửi: tiết kiệm, sản phẩm kỳ hạn, lãi, liên ngân hàng.',
    },
  },
  {
    name: 'capital',
    port: 8111,
    scope: {
      en: 'Capital: contracts, amendments, movements.',
      vi: 'Vốn: hợp đồng, điều chỉnh, luồng quỹ.',
    },
  },
  {
    name: 'statistical',
    port: 8112,
    scope: {
      en: 'Statistical reporting: definitions, indicators, submissions, export.',
      vi: 'Báo cáo thống kê: định nghĩa, chỉ tiêu, kỳ nộp, xuất dữ liệu.',
    },
  },
];

export interface UpstreamRow {
  prefix: string;
  service: string;
}

/** auth-gateway proxy prefix → upstream service (bff_handler.go). */
export const GATEWAY_UPSTREAMS: UpstreamRow[] = [
  { prefix: '/api/admin/*', service: 'iam-service' },
  { prefix: '/api/iam/*', service: 'iam-service' },
  { prefix: '/api/platform/*', service: 'platform-service' },
  { prefix: '/api/finance/*', service: 'finance-service' },
  { prefix: '/api/media/*', service: 'media-service' },
  { prefix: '/api/workflow/*', service: 'workflow-service' },
  { prefix: '/api/crm/*', service: 'crm-service' },
  { prefix: '/api/hrm/*', service: 'hrm-service' },
  { prefix: '/api/notifications/*', service: 'notification-service' },
  { prefix: '/api/mdm/*', service: 'mdm-service' },
  { prefix: '/api/ai/*', service: 'ai-service' },
  { prefix: '/api/rag/*', service: 'ai-service (RAG)' },
  { prefix: '/api/loan/*', service: 'loan-service' },
  { prefix: '/api/deposit/*', service: 'deposit-service' },
  { prefix: '/api/capital/*', service: 'capital-service' },
  { prefix: '/api/statistical/*', service: 'statistical-service' },
];

export interface HeaderRow {
  header: string;
  purpose: LocalizedText;
}

/** Identity headers injected by auth-gateway on the upstream request. */
export const INJECTED_HEADERS: HeaderRow[] = [
  {
    header: 'X-User-Id · X-Actor-User-Id',
    purpose: {
      en: 'Authenticated IAM user UUID (actor kept explicit for downstream audit).',
      vi: 'UUID người dùng IAM đã xác thực (actor tách riêng phục vụ kiểm toán).',
    },
  },
  {
    header: 'X-Tenant-Id',
    purpose: {
      en: 'Active tenant resolved from the BFF session; browser cannot override it.',
      vi: 'Tenant đang hoạt động lấy từ phiên BFF; trình duyệt không thể tự đặt.',
    },
  },
  {
    header: 'X-Roles · X-Permissions',
    purpose: {
      en: 'Tenant-scoped roles/permissions used by downstream services.',
      vi: 'Vai trò/quyền theo tenant cho các service phía sau.',
    },
  },
  {
    header: 'X-Global-Roles · X-Global-Permissions · X-Global-Admin',
    purpose: {
      en: 'Platform-wide grants, kept separate from tenant context.',
      vi: 'Quyền phạm vi toàn nền tảng, tách biệt khỏi ngữ cảnh tenant.',
    },
  },
  {
    header: 'X-Org-Id · X-User-Org-Ids · X-User-Group-Ids',
    purpose: {
      en: 'Active org (validated against membership) plus the full org/group inventory.',
      vi: 'Đơn vị đang chọn (đã đối chiếu membership) và toàn bộ đơn vị/nhóm của user.',
    },
  },
  {
    header: 'X-Username · X-User-Subject · X-User-Email · X-Nickname',
    purpose: {
      en: 'Identity profile fields from the IAM user record.',
      vi: 'Trường hồ sơ định danh từ bản ghi IAM.',
    },
  },
  {
    header: 'X-User-Timezone',
    purpose: {
      en: 'IANA timezone used to resolve business dates per request (`ardatime`).',
      vi: 'Múi giờ IANA dùng để quy đổi ngày nghiệp vụ mỗi request (`ardatime`).',
    },
  },
  {
    header: 'X-Auth-Time · X-Auth-Version · X-Session-Id',
    purpose: {
      en: 'Session freshness/version markers and the IAM session UUID for revocation.',
      vi: 'Mốc thời gian/phiên bản phiên và UUID phiên IAM phục vụ thu hồi.',
    },
  },
  {
    header: 'X-Auth-Risk · X-Auth-Checked',
    purpose: {
      en: 'Matched policy risk tier and the marker that auth was already enforced.',
      vi: 'Mức rủi ro của route đã khớp policy và dấu xác nhận đã kiểm tra auth.',
    },
  },
  {
    header: 'X-Request-Id · X-Trace-Id',
    purpose: {
      en: 'Correlation ids echoed in every response and propagated across services.',
      vi: 'ID tương quan được trả về mọi response và lan truyền qua các service.',
    },
  },
];

export interface EodJobRow {
  code: string;
  sequence: number;
  name: LocalizedText;
  endpoint: string;
}

export const EOD_JOBS: EodJobRow[] = [
  {
    code: 'LNM_ACCRUAL_DAILY',
    sequence: 10,
    name: { en: 'Loan interest accrual', vi: 'Tính lãi cho vay' },
    endpoint: 'loan-service /internal/jobs/accrual-daily',
  },
  {
    code: 'DPM_ACCRUAL_DAILY',
    sequence: 15,
    name: { en: 'Deposit interest accrual', vi: 'Dự chi lãi tiền gửi' },
    endpoint: 'deposit-service /internal/jobs/deposit-accrual-daily',
  },
  {
    code: 'LNM_PROVISION_DAILY',
    sequence: 20,
    name: { en: 'Loan loss provisioning', vi: 'Trích lập dự phòng' },
    endpoint: 'loan-service /internal/jobs/provision-daily',
  },
  {
    code: 'FIN_TRIAL_BALANCE_DAILY',
    sequence: 30,
    name: { en: 'Daily trial balance rebuild', vi: 'Tổng hợp số dư hằng ngày' },
    endpoint: 'finance-service /internal/jobs/trial-balance-daily',
  },
];

export interface RetryPolicyRow {
  policy: string;
  meaning: LocalizedText;
}

export const RETRY_POLICIES: RetryPolicyRow[] = [
  {
    policy: 'NON_RETRYABLE',
    meaning: {
      en: 'Validation or business denial (400/403/404/405). Fix the payload or permissions — retrying unchanged always fails.',
      vi: 'Lỗi tham số hoặc bị từ chối nghiệp vụ (400/403/404/405). Sửa payload/quyền — thử lại y nguyên luôn thất bại.',
    },
  },
  {
    policy: 'TRANSIENT_BACKOFF',
    meaning: {
      en: 'Unexpected or upstream failure (500/502/503). Retry a limited number of times with backoff and log request_id.',
      vi: 'Lỗi bất ngờ hoặc phía upstream (500/502/503). Thử lại số lần giới hạn kèm backoff và ghi lại request_id.',
    },
  },
  {
    policy: 'RETRY_AFTER_REFRESH',
    meaning: {
      en: 'State conflict (409). Reload the resource, re-apply the change on fresh state, retry once.',
      vi: 'Xung đột trạng thái (409). Tải lại tài nguyên, áp dụng lại thay đổi trên dữ liệu mới, thử lại một lần.',
    },
  },
  {
    policy: 'REQUIRES_REAUTH',
    meaning: {
      en: 'Session expired or invalid (401). Re-authenticate (or step-up) before resending.',
      vi: 'Phiên hết hạn/không hợp lệ (401). Đăng nhập lại (hoặc step-up) trước khi gửi lại.',
    },
  },
  {
    policy: 'EXPONENTIAL_BACKOFF',
    meaning: {
      en: 'Rate limit or quota (429). Wait with exponential backoff and honour Retry-After.',
      vi: 'Chạm giới hạn tần suất/hạn ngạch (429). Chờ theo exponential backoff và tuân thủ Retry-After.',
    },
  },
];

export const TECH_STACK: Array<{ layer: string; technology: string }> = [
  { layer: 'Backend', technology: 'Go 1.27 · net/http stdlib · gRPC (mTLS) · protobuf · goose migrations' },
  { layer: 'Frontend', technology: 'React 19 · TypeScript 6 · Vite 8 · Module Federation · Tailwind CSS 4 · shadcn/ui' },
  { layer: 'State & contracts', technology: 'Zustand · TanStack Query · React Hook Form + Zod · i18next' },
  { layer: 'Auth', technology: 'Ory Hydra (OAuth2/OIDC) · Ory Kratos (identity) · Casbin RBAC · BFF session' },
  { layer: 'Workflow', technology: 'Zeebe 8.5 · BPMN 2.0 · bpmn-js modeler' },
  { layer: 'Events', technology: 'NATS JetStream · transactional outbox · ardaevents.Envelope[T]' },
  { layer: 'Data', technology: 'CloudNativePG PostgreSQL 18 (3-node HA) · Valkey (3-node) · Garage S3 (3-node)' },
  { layer: 'Edge & runtime', technology: 'Cloudflare (CDN/WAF) + Tunnel · Traefik forward-auth · K3s v1.35.5+k3s1 (3 nodes)' },
  { layer: 'Delivery', technology: 'GHCR images · Argo CD auto-sync + image updater · Kustomize · Cloudflare Workers (docs/MFE)' },
];

export const REPOSITORIES: Array<{ name: string; url: string; purpose: LocalizedText }> = [
  {
    name: 'arda-be',
    url: 'https://github.com/arda-labs/arda-be',
    purpose: {
      en: 'Go 1.27 workspace — 15 services, shared libs, protobuf contracts, NATS events, BPMN assets.',
      vi: 'Workspace Go 1.27 — 15 service, thư viện dùng chung, hợp đồng protobuf, sự kiện NATS, BPMN.',
    },
  },
  {
    name: 'arda-mfe',
    url: 'https://github.com/arda-labs/arda-mfe',
    purpose: {
      en: 'Bun + Vite MFE — 1 shell + 13 remotes, shared @workspace/* packages, Cloudflare Workers deploy.',
      vi: 'MFE Bun + Vite — 1 shell + 13 remote, gói @workspace/* dùng chung, deploy Cloudflare Workers.',
    },
  },
  {
    name: 'arda-infra',
    url: 'https://github.com/arda-labs/arda-infra',
    purpose: {
      en: 'GitOps desired state: K3s manifests, Argo CD, Traefik, Ory auth, CloudNativePG, platform runtime.',
      vi: 'Trạng thái GitOps: manifest K3s, Argo CD, Traefik, Ory, CloudNativePG, runtime nền tảng.',
    },
  },
  {
    name: 'arda-docs-site',
    url: 'https://github.com/arda-labs/arda-docs-site',
    purpose: {
      en: 'This developer portal: RFC 7807 catalog, machine lookup API, platform documentation.',
      vi: 'Portal tài liệu này: danh mục RFC 7807, API tra cứu máy đọc, tài liệu nền tảng.',
    },
  },
  {
    name: 'arda-perf',
    url: 'https://github.com/arda-labs/arda-perf',
    purpose: {
      en: 'k6 load-test scenarios (constant-arrival-rate) against the production edge.',
      vi: 'Kịch bản kiểm thử tải k6 (constant-arrival-rate) chạy vào production edge.',
    },
  },
  {
    name: '.github',
    url: 'https://github.com/arda-labs/.github',
    purpose: {
      en: 'Organization profile and architecture reference.',
      vi: 'Hồ sơ tổ chức và tài liệu tham chiếu kiến trúc.',
    },
  },
];

/** Aggregate counts surfaced on the static pages. */
export const PLATFORM_FACTS = {
  services: SERVICES.length,
  remotes: MFE_MODULES.length - 1,
  bpmnProcesses: 42,
  policyRoutes: 78,
  checkScripts: 15,
  clusterNodes: 3,
  eodJobs: EOD_JOBS.length,
  goVersion: '1.27.1',
} as const;

/** Session/authorization constants (auth-gateway config defaults). */
export const AUTH_FACTS = {
  recentAuthWindowSeconds: 300,
  kratosSessionLifespan: '720h (30 days)',
  aiRateLimitPerMinute: 30,
  rememberForSeconds: 60 * 60 * 24 * 30,
} as const;

export interface PolicyTierRow {
  tier: string;
  count: number;
  behavior: LocalizedText;
}

/** policy.yaml risk tiers — counts verified from the 78-route policy file. */
export const POLICY_RISK_TIERS: PolicyTierRow[] = [
  {
    tier: 'public',
    count: 3,
    behavior: {
      en: 'No session required (login, OAuth callback, health/public branding).',
      vi: 'Không cần phiên (đăng nhập, OAuth callback, health/branding công khai).',
    },
  },
  {
    tier: 'low',
    count: 22,
    behavior: {
      en: 'Valid BFF session required; read-mostly and assistant routes.',
      vi: 'Yêu cầu phiên BFF hợp lệ; phần lớn là route đọc và trợ lý AI.',
    },
  },
  {
    tier: 'medium',
    count: 31,
    behavior: {
      en: 'Session + matching permission; state-changing operations.',
      vi: 'Phiên + quyền tương ứng; thao tác thay đổi trạng thái.',
    },
  },
  {
    tier: 'high',
    count: 22,
    behavior: {
      en: 'Session + permission + recent auth (step-up ≤ 5 minutes) for sensitive administration.',
      vi: 'Phiên + quyền + recent auth (step-up ≤ 5 phút) cho quản trị nhạy cảm.',
    },
  },
];

export const POLICY_AUTH = { required: 75, public: 3 } as const;

export interface EndpointRow {
  method: string;
  path: string;
  purpose: LocalizedText;
}

/** auth-gateway BFF endpoints (transport/http/router.go). */
export const AUTH_ENDPOINTS: EndpointRow[] = [
  { method: 'GET', path: '/api/auth/start', purpose: { en: 'Start the OAuth2/OIDC authorization flow (PKCE).', vi: 'Bắt đầu luồng uỷ quyền OAuth2/OIDC (PKCE).' } },
  { method: 'GET', path: '/api/auth/login', purpose: { en: 'Hydra login bridge rendered by the SPA.', vi: 'Cầu nối login Hydra do SPA hiển thị.' } },
  { method: 'POST', path: '/api/auth/kratos/accept-login', purpose: { en: 'Accept the Hydra login challenge with a Kratos session token.', vi: 'Chấp nhận login challenge của Hydra bằng session token Kratos.' } },
  { method: 'GET', path: '/api/auth/callback', purpose: { en: 'OAuth callback: exchange code for tokens and create the BFF session.', vi: 'OAuth callback: đổi code lấy token và tạo phiên BFF.' } },
  { method: 'GET', path: '/api/auth/login-challenge/validate', purpose: { en: 'Validate a login_challenge before rendering the form.', vi: 'Kiểm tra login_challenge trước khi render form.' } },
  { method: 'GET', path: '/api/auth/me', purpose: { en: 'Current user context: tenant memberships, roles, permissions.', vi: 'Ngữ cảnh người dùng hiện tại: tenant, vai trò, quyền.' } },
  { method: 'POST', path: '/api/auth/tenant/switch', purpose: { en: 'Switch active tenant and rebuild the session user context.', vi: 'Đổi tenant đang hoạt động và dựng lại ngữ cảnh phiên.' } },
  { method: 'POST', path: '/api/auth/step-up', purpose: { en: 'Step-up verification (MFA / recent auth) for high-risk actions.', vi: 'Xác minh tăng cường (MFA / recent auth) cho thao tác rủi ro cao.' } },
  { method: 'GET', path: '/api/auth/recent-auth', purpose: { en: 'Report whether recent auth is still valid for this session.', vi: 'Cho biết recent auth còn hiệu lực cho phiên này hay không.' } },
  { method: 'GET', path: '/api/auth/me/sessions', purpose: { en: 'List active sessions/devices for the current user.', vi: 'Liệt kê phiên/thiết bị đang hoạt động của người dùng.' } },
  { method: 'POST', path: '/api/auth/logout', purpose: { en: 'Revoke the BFF session and redirect through Hydra logout.', vi: 'Thu hồi phiên BFF và chuyển qua logout Hydra.' } },
  { method: 'GET', path: '/api/admin/policy-routes', purpose: { en: 'Introspect the route policy loaded by the gateway (admin).', vi: 'Tra cứu policy route mà gateway đang nạp (admin).' } },
];

/** Kratos self-service proxy endpoints owned by the BFF. */
export const KRATOS_ENDPOINTS: EndpointRow[] = [
  { method: 'GET', path: '/api/kratos/whoami', purpose: { en: 'Resolve the Kratos session for the browser.', vi: 'Xác định phiên Kratos cho trình duyệt.' } },
  { method: 'GET', path: '/api/kratos/login/api', purpose: { en: 'Create a login flow (API flavour) for SPA submission.', vi: 'Tạo login flow (API) cho SPA submit.' } },
  { method: 'GET/POST', path: '/api/kratos/login', purpose: { en: 'Fetch or submit a login flow (password + CSRF).', vi: 'Lấy hoặc submit login flow (mật khẩu + CSRF).' } },
  { method: 'GET/POST', path: '/api/kratos/settings', purpose: { en: 'Self-service settings: password, MFA, profile changes.', vi: 'Self-service settings: mật khẩu, MFA, hồ sơ.' } },
  { method: 'GET/POST', path: '/api/kratos/recovery', purpose: { en: 'Password recovery flow (email/code challenge).', vi: 'Luồng khôi phục mật khẩu (thử thách email/code).' } },
  { method: 'GET/POST', path: '/api/kratos/verification', purpose: { en: 'Identity verification flow (disabled by default in Kratos).', vi: 'Luồng xác minh định danh (Kratos mặc định tắt).' } },
];

export const LIST_QUERY_PARAMS: Array<{ param: string; value: string }> = [
  { param: 'page', value: '≥ 1, default 1' },
  { param: 'per_page', value: '≤ 100, default 20' },
  { param: 'sort', value: 'allow-listed field per endpoint' },
  { param: 'order', value: 'asc | desc' },
  { param: 'q', value: 'free-text search' },
  { param: 'view', value: 'tree | options' },
  { param: 'all=1', value: 'full set, capped at 500 rows' },
];

