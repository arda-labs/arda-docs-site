'use client';

import React from 'react';
import {
  AlertTriangle,
  Braces,
  Code2,
  ExternalLink,
  KeyRound,
  Search,
  ShieldCheck,
  Terminal,
} from 'lucide-react';
import { usePortalI18n } from '@/components/provider';
import {
  Callout,
  CodeBlock,
  DataTable,
  DocFooterNav,
  DocHeader,
  DocPage,
  DocSection,
  StatCard,
} from '@/components/doc-page';
import {
  AUTH_ENDPOINTS,
  AUTH_FACTS,
  KRATOS_ENDPOINTS,
  LIST_QUERY_PARAMS,
  PLATFORM_FACTS,
  POLICY_AUTH,
  POLICY_RISK_TIERS,
  RETRY_POLICIES,
  pick,
} from '@/lib/platform';
import portalStats from '@/content/portal-stats.json';
import openapiManifest from '@/content/openapi-manifest.json';

const LOOKUP_FIELDS: Array<{ field: string; content: { en: string; vi: string } }> = [
  { field: 'code', content: { en: 'Canonical problem code, e.g. auth.error.unauthorized.', vi: 'Mã lỗi chuẩn, ví dụ auth.error.unauthorized.' } },
  { field: 'title', content: { en: 'Short human-readable title of the problem.', vi: 'Tiêu đề ngắn của mã lỗi.' } },
  { field: 'status', content: { en: 'HTTP status emitted with this problem.', vi: 'Mã HTTP đi kèm mã lỗi này.' } },
  { field: 'summary', content: { en: 'One-paragraph technical summary.', vi: 'Tóm tắt kỹ thuật một đoạn.' } },
  { field: 'url', content: { en: 'Canonical docs URL (same as the type field).', vi: 'URL tài liệu chuẩn (trùng trường type).' } },
  { field: 'client_action', content: { en: 'What the calling client/app must do next.', vi: 'Việc client/ứng dụng gọi API cần làm tiếp.' } },
  { field: 'operator_action', content: { en: 'Runbook guidance for SRE/operator diagnosis.', vi: 'Hướng dẫn cho SRE/vận hành chẩn đoán.' } },
  { field: 'related_routes', content: { en: 'API routes that can emit this problem.', vi: 'Các route API có thể phát sinh mã lỗi này.' } },
  { field: 'body', content: { en: 'Full markdown specification body.', vi: 'Toàn bộ nội dung markdown của trang đặc tả.' } },
  { field: 'example', content: { en: 'Highlighted sample HTTP request/response.', vi: 'Mẫu request/response HTTP đã tô màu cú pháp.' } },
];

export default function ApiReferencePage() {
  const { locale } = usePortalI18n();
  const isVi = locale === 'vi';

  return (
    <DocPage>
      <DocHeader
        badge="OPENAPI 3.1 • BFF"
        badgeTone="info"
        title={isVi ? 'Cổng API & Chính sách Gateway' : 'API Gateway & Policies'}
        description={
          isVi
            ? 'Mô hình BFF duy nhất, chính sách định tuyến tập trung trong policy.yaml, hợp đồng response chuẩn hóa và API tra cứu mã lỗi máy đọc.'
            : 'Single BFF ingress, declarative route authorization in policy.yaml, standardized response contracts, and the machine-readable problem lookup API.'
        }
      />

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard value={PLATFORM_FACTS.policyRoutes} label={isVi ? 'Route được policy hóa' : 'Policy-enforced routes'} hint={`auth: ${POLICY_AUTH.required} · public: ${POLICY_AUTH.public}`} />
        <StatCard value={POLICY_RISK_TIERS[3].count} label={isVi ? 'Route rủi ro high' : 'High-risk routes'} hint="recent auth ≤ 5 phút" tone="danger" />
        <StatCard value={portalStats.totalProblems} label={isVi ? 'Mã lỗi tra cứu được' : 'Lookup-able problem codes'} hint="RFC 7807 · /api/lookup" tone="success" />
        <StatCard value={AUTH_FACTS.aiRateLimitPerMinute} label={isVi ? 'Req/phút cho endpoint AI' : 'AI requests per minute'} hint="per user/tenant · 429" tone="warning" />
      </section>

      {/* 1. Access */}
      <DocSection
        index="1"
        icon={Terminal}
        title={isVi ? 'Truy cập & Môi trường' : 'Access & Environments'}
      >
        <DataTable
          columns={['Environment', 'Base URL']}
          minWidth={520}
          rows={[
            ['Production', <code key="p" className="font-mono text-[11px] text-primary">https://api.arda.io.vn</code>],
            [isVi ? 'Gateway dev (BFF)' : 'Local BFF gateway', <code key="l" className="font-mono text-[11px]">http://localhost:8082</code>],
            ['OIDC issuer', <code key="i" className="font-mono text-[11px]">https://auth.arda.io.vn</code>],
          ]}
        />
        <Callout tone="info" icon={ShieldCheck} title={isVi ? 'Mọi request đi qua BFF' : 'Everything goes through the BFF'}>
          {isVi
            ? 'Frontend không bao giờ gọi trực tiếp Ory Hydra/Kratos hay microservice. Gateway proxy /api/kratos/* cho luồng tự phục vụ và /api/* cho nghiệp vụ, giữ cookie phiên same-origin.'
            : 'The frontend never calls Ory Hydra/Kratos or a microservice directly. The gateway proxies /api/kratos/* for self-service flows and /api/* for business APIs, keeping the session cookie same-origin.'}
        </Callout>
      </DocSection>

      {/* 2. Session endpoints */}
      <DocSection
        index="2"
        icon={KeyRound}
        title={isVi ? 'Phiên & Luồng Đăng nhập' : 'Session & Login Flow'}
        description={
          isVi
            ? 'Chuỗi BFF cho OAuth2/OIDC: bắt đầu uỷ quyền → Kratos xác thực mật khẩu → Hydra accept-login → callback đổi token → phiên BFF; sau đó /api/auth/me cấp ngữ cảnh tenant.'
            : 'The BFF chain for OAuth2/OIDC: start authorization → Kratos validates credentials → Hydra accept-login → callback exchanges tokens → BFF session; /api/auth/me then serves tenant context.'
        }
      >
        <DataTable
          columns={['Method', 'Endpoint', isVi ? 'Chức năng' : 'Purpose']}
          minWidth={680}
          rows={AUTH_ENDPOINTS.map((endpoint) => [
            <code key="m" className="font-mono text-[11px] text-primary">
              {endpoint.method}
            </code>,
            <code key="p" className="font-mono text-[11px]">
              {endpoint.path}
            </code>,
            pick(endpoint.purpose, locale),
          ])}
        />
      </DocSection>

      {/* 3. Kratos proxy */}
      <DocSection
        index="3"
        icon={ShieldCheck}
        title={isVi ? 'Proxy Ory Kratos (Self-service)' : 'Ory Kratos Proxy (Self-service)'}
      >
        <DataTable
          columns={['Method', 'Endpoint', isVi ? 'Chức năng' : 'Purpose']}
          minWidth={680}
          rows={KRATOS_ENDPOINTS.map((endpoint) => [
            <code key="m" className="font-mono text-[11px] text-primary">
              {endpoint.method}
            </code>,
            <code key="p" className="font-mono text-[11px]">
              {endpoint.path}
            </code>,
            pick(endpoint.purpose, locale),
          ])}
        />
      </DocSection>

      {/* 4. Policy */}
      <DocSection
        index="4"
        icon={ShieldCheck}
        title={isVi ? 'Chính sách Phân quyền Route' : 'Route Authorization Policy'}
        description={
          isVi
            ? 'Toàn bộ 78 route được khai báo tập trung trong apps/auth-gateway/configs/policy.yaml. Gateway khớp path + method, kiểm tra phiên, permission và mức rủi ro trước khi forward.'
            : 'All 78 routes are declared in apps/auth-gateway/configs/policy.yaml. The gateway matches path + method, then checks session, permissions, and risk tier before forwarding.'
        }
      >
        <DataTable
          columns={[isVi ? 'Mức rủi ro' : 'Risk tier', isVi ? 'Số route' : 'Routes', isVi ? 'Hành vi' : 'Behavior']}
          minWidth={560}
          rows={POLICY_RISK_TIERS.map((tier) => [
            <code key="t" className="font-mono text-[11px] text-primary">
              {tier.tier}
            </code>,
            tier.count,
            pick(tier.behavior, locale),
          ])}
        />
        <CodeBlock
          title="policy.yaml — route mẫu"
          code={`routes:
  - id: ai-settings-write
    path: /api/ai/settings/**
    methods: [POST, PUT, PATCH, DELETE]
    auth: true
    risk: high
    permissions:
      - ai.admin
      - superadmin
      - platform.manage`}
        />
        <Callout tone="warning" icon={AlertTriangle} title={isVi ? 'Mã lỗi bị từ chối' : 'Denial codes'}>
          {isVi
            ? '401 user_context_unavailable (phiên không giải được), 403 insufficient_permissions (thiếu quyền), 403 organization_forbidden (đơn vị không thuộc membership), 403 recent_auth_required (rủi ro cao nhưng phiên đã cũ).'
            : '401 user_context_unavailable (session not resolvable), 403 insufficient_permissions (missing grant), 403 organization_forbidden (org not in membership), 403 recent_auth_required (high risk with a stale session).'}
        </Callout>
      </DocSection>

      {/* 5. Response contracts */}
      <DocSection
        index="5"
        icon={Code2}
        title={isVi ? 'Hợp đồng Response' : 'Response Contracts'}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <CodeBlock
            title="success envelope"
            code={`{
  "result": { ... },
  "success": true,
  "errors": [],
  "messages": [],
  "meta": { "request_id": "...", "trace_id": "...", "timestamp": "..." }
}`}
          />
          <CodeBlock
            title="problem+json (error)"
            code={`HTTP/1.1 401 Unauthorized
Content-Type: application/problem+json

{
  "type": "https://docs.arda.io.vn/problems/auth.error.unauthorized/",
  "title": "Unauthorized",
  "status": 401,
  "code": "auth.error.unauthorized",
  "message": "Bearer token is missing or has expired",
  "errors": [],
  "request_id": "req_88f912a7d4c",
  "trace_id": "trc_4b9a110ef"
}`}
          />
        </div>
        <Callout tone="neutral" title={isVi ? 'Danh sách phân trang' : 'Paginated lists'}>
          {isVi
            ? 'Endpoint list trả result dạng { items, page, per_page, total } (hoặc bare list ở surface cũ). Query chuẩn: page, per_page (≤100), sort, order, q, view, all=1 (tối đa 500 dòng).'
            : 'List endpoints return result as { items, page, per_page, total } (bare lists exist on legacy surfaces). Standard query: page, per_page (≤100), sort, order, q, view, all=1 (capped at 500 rows).'}
        </Callout>
        <DataTable
          columns={[isVi ? 'Tham số' : 'Parameter', isVi ? 'Giá trị' : 'Value']}
          minWidth={520}
          rows={LIST_QUERY_PARAMS.map((row) => [
            <code key="p" className="font-mono text-[11px] text-primary">
              {row.param}
            </code>,
            row.value,
          ])}
        />
        <Callout tone="info" title={isVi ? 'Tương quan & truy vết' : 'Correlation'}>
          {isVi
            ? 'Mọi response mang X-Request-Id (và X-Trace-Id khi có traceparent). Header trùng với request_id/trace_id trong body lỗi, phục vụ đối soát xuyên service.'
            : 'Every response carries X-Request-Id (plus X-Trace-Id when traceparent exists). The headers match request_id/trace_id in the error body for cross-service reconciliation.'}
        </Callout>
      </DocSection>

      {/* 6. Published OpenAPI documents */}
      <DocSection
        index="6"
        icon={Braces}
        title={isVi ? 'Tài liệu OpenAPI Đã xuất bản' : 'Published OpenAPI Documents'}
        description={
          isVi
            ? `${openapiManifest.totals.documents} tài liệu OpenAPI 3.1 (${openapiManifest.totals.operations} operation) được đồng bộ tự động từ arda-be/contracts/openapi khi build. Mỗi URL bên dưới là JSON thô, dùng trực tiếp cho Postman, IDE, codegen và agent.`
            : `${openapiManifest.totals.documents} OpenAPI 3.1 documents (${openapiManifest.totals.operations} operations) synced automatically from arda-be/contracts/openapi at build time. Every URL below is raw JSON for Postman, IDEs, codegen, and agents.`
        }
      >
        <DataTable
          columns={['Document', 'Version', isVi ? 'Operation' : 'Operations', 'Service', isVi ? 'URL máy đọc' : 'Raw URL']}
          minWidth={780}
          rows={openapiManifest.documents.map((doc) => [
            <span key="t" className="block">
              <a
                href={doc.url}
                target="_blank"
                rel="noreferrer"
                className="font-medium text-primary hover:underline"
              >
                {doc.title}
              </a>
              <span className="block font-mono text-[11px] text-muted-foreground">{doc.file}</span>
            </span>,
            doc.version,
            doc.operationCount,
            <code key="s" className="font-mono text-[11px]">
              {doc.service}
            </code>,
            <a
              key="u"
              href={doc.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 font-mono text-[11px] text-primary hover:underline break-all"
            >
              {doc.url}
              <ExternalLink className="w-3 h-3 shrink-0" />
            </a>,
          ])}
        />
        <Callout tone="neutral" icon={Braces} title={isVi ? 'Nguồn & độ phủ' : 'Source & coverage'}>
          {isVi
            ? 'Spec là nguồn duy nhất ở arda-be/contracts/openapi; docs-site chỉ validate (cùng invariant với check-openapi.mjs) và sao chép khi build, không commit bản sao. Hiện mới có các pilot đã migrate (auth, iam, media); các service còn lại chưa có spec nên vẫn dùng policy.yaml làm tham chiếu route.'
            : 'Specs are sourced only from arda-be/contracts/openapi; this site validates them (same invariants as check-openapi.mjs) and copies at build time without committing a duplicate. Only migrated pilots exist today (auth, iam, media); the remaining services have no spec yet, so policy.yaml remains the route reference.'}
        </Callout>
      </DocSection>

      {/* 7. Lookup API */}
      <DocSection
        index="7"
        icon={Search}
        title={isVi ? 'API Tra cứu Máy đọc' : 'Machine Lookup API'}
        description={
          isVi
            ? 'Cho AI agent, IDE plugin và runbook: tra cứu đặc tả lỗi trực tiếp từ Cloudflare Edge với CORS mở.'
            : 'For AI agents, IDE plugins, and runbooks: fetch a problem specification straight from the Cloudflare edge with open CORS.'
        }
      >
        <CodeBlock
          title="lookup"
          code={`$ curl -s "https://docs.arda.io.vn/api/lookup?code=auth.error.unauthorized"
# 200 + cache-control: no-store, access-control-allow-origin: *
# 404 + { "suggestions": ["...nearest codes..."] }`}
        />
        <DataTable
          columns={['Field', isVi ? 'Nội dung' : 'Content']}
          minWidth={520}
          rows={LOOKUP_FIELDS.map((entry) => [
            <code key="f" className="font-mono text-[11px] text-primary">
              {entry.field}
            </code>,
            pick(entry.content, locale),
          ])}
        />
      </DocSection>

      {/* 8. Retry policies */}
      <DocSection
        index="8"
        icon={AlertTriangle}
        title={isVi ? 'Chính sách Thử lại theo Mã lỗi' : 'Per-Code Retry Policies'}
        description={
          isVi
            ? 'Mỗi mã lỗi gắn một chính sách thử lại; số lượng bên dưới được đếm từ danh mục khi build.'
            : 'Every problem code carries a retry policy; the counts below are computed from the catalog at build time.'
        }
      >
        <DataTable
          columns={['Policy', isVi ? 'Số mã' : 'Codes', isVi ? 'Ngữ nghĩa' : 'Semantics']}
          minWidth={680}
          rows={RETRY_POLICIES.map((policy) => {
            const count = portalStats.retryPolicies.find((p) => p.policy === policy.policy)?.count ?? 0;
            return [
              <code key="p" className="font-mono text-[11px] text-primary">
                {policy.policy}
              </code>,
              count,
              pick(policy.meaning, locale),
            ];
          })}
        />
      </DocSection>

      <DocFooterNav
        previous={{ href: '/architecture', label: isVi ? 'Xem lại: Kiến trúc' : 'Previous: Architecture' }}
        next={{ href: '/workflows', label: isVi ? 'Xem tiếp: Quy trình Vận hành' : 'Next: Workflows & Operations' }}
      />
    </DocPage>
  );
}
