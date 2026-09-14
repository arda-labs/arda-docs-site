'use client';

import React from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  FileCode2,
  GitBranch,
  Layers,
  Lock,
  RefreshCw,
  ShieldCheck,
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
  type DocTone,
} from '@/components/doc-page';
import {
  LIST_QUERY_PARAMS,
  PLATFORM_FACTS,
  POLICY_RISK_TIERS,
  RETRY_POLICIES,
  pick,
} from '@/lib/platform';
import portalStats from '@/content/portal-stats.json';

interface CheckRow {
  name: string;
  purpose: { en: string; vi: string };
  tone: DocTone;
}

const CI_CHECKS: CheckRow[] = [
  { name: 'check-openapi.mjs', tone: 'primary', purpose: { en: 'OpenAPI 3.1 contracts stay in sync with the HTTP surfaces.', vi: 'Hợp đồng OpenAPI 3.1 đồng bộ với bề mặt HTTP.' } },
  { name: 'check-problem-catalog.mjs', tone: 'primary', purpose: { en: 'Every problem code arda-be can emit has a catalog page.', vi: 'Mọi mã lỗi arda-be có thể phát ra đều có trang catalog.' } },
  { name: 'check-migrations.mjs', tone: 'info', purpose: { en: 'Migration naming pattern, goose markers, and no destructive DDL.', vi: 'Đúng pattern tên migration, marker goose, không DDL phá hủy.' } },
  { name: 'check-bpmn.mjs', tone: 'info', purpose: { en: 'BPMN structure: dangling refs, default-flow conditions, review variables.', vi: 'Cấu trúc BPMN: tham chiếu treo, điều kiện default flow, biến review.' } },
  { name: 'check-layering.mjs', tone: 'warning', purpose: { en: 'Handlers may not import internal/repository.', vi: 'Handler không được import internal/repository.' } },
  { name: 'check-proto.mjs', tone: 'warning', purpose: { en: 'Generated protobuf matches the proto/ sources.', vi: 'Protobuf sinh ra khớp nguồn proto/.' } },
  { name: 'check-events.mjs', tone: 'success', purpose: { en: 'Event registry matches arda-events subject/code constants.', vi: 'Registry sự kiện khớp hằng subject/code trong arda-events.' } },
  { name: 'check-event-runtime.mjs', tone: 'success', purpose: { en: 'Outbox/consumer runtime wiring for notification delivery.', vi: 'Wiring runtime outbox/consumer cho phát thông báo.' } },
  { name: 'check-interactions.mjs', tone: 'neutral', purpose: { en: 'Interaction contract: protocol, timeout, retry, identity, context.', vi: 'Hợp đồng tương tác: protocol, timeout, retry, định danh, ngữ cảnh.' } },
  { name: 'check-observability-contract.mjs', tone: 'neutral', purpose: { en: 'HTTP metrics and tracing contract is implemented.', vi: 'Hợp đồng metrics/tracing HTTP được hiện thực.' } },
  { name: 'check-security-invariants.mjs', tone: 'danger', purpose: { en: 'Tenant, policy, and session invariants in gateway/iam.', vi: 'Bất biến tenant, policy, phiên ở gateway/iam.' } },
  { name: 'check-encrypted-columns.mjs', tone: 'danger', purpose: { en: 'Encrypted-column registry matches real implementations.', vi: 'Registry cột mã hóa khớp hiện thực.' } },
  { name: 'check-secrets.mjs', tone: 'danger', purpose: { en: 'No committed credentials or known weak secrets.', vi: 'Không commit credential/mật khẩu yếu đã biết.' } },
  { name: 'check-ai-catalog.mjs', tone: 'info', purpose: { en: 'AI internal surface docs match gateway permissions.', vi: 'Tài liệu bề mặt AI nội bộ khớp quyền trên gateway.' } },
  { name: 'check-rls-pilot.mjs', tone: 'warning', purpose: { en: 'RLS pilot artifact stays scratch-only, production adoption gated.', vi: 'Artifact RLS pilot chỉ ở mức thử nghiệm, chưa áp dụng production.' } },
];

const CONVENTIONS: Array<{ title: { en: string; vi: string }; body: { en: string; vi: string } }> = [
  {
    title: { en: 'Migrations', vi: 'Migration' },
    body: {
      en: 'File name must match ^\\d{14}_[a-z0-9_-]+\\.sql, contain goose Up/Down markers, and must not use DROP … CASCADE.',
      vi: 'Tên file phải khớp ^\\d{14}_[a-z0-9_-]+\\.sql, có marker goose Up/Down và không dùng DROP … CASCADE.',
    },
  },
  {
    title: { en: 'Layering', vi: 'Phân tầng' },
    body: {
      en: 'handler → service → repository. Cross-service access only via HTTP/gRPC/NATS; no shared domain imports.',
      vi: 'handler → service → repository. Truy cập xuyên service chỉ qua HTTP/gRPC/NATS; không import domain chéo.',
    },
  },
  {
    title: { en: 'Time', vi: 'Thời gian' },
    body: {
      en: 'Instants persist as UTC timestamptz; business dates resolve via ardatime with the user/tenant timezone; ranges are half-open [from, to).',
      vi: 'Mốc thời gian lưu UTC timestamptz; ngày nghiệp vụ quy đổi bằng ardatime theo múi giờ user/tenant; khoảng là nửa mở [from, to).',
    },
  },
  {
    title: { en: 'Events', vi: 'Sự kiện' },
    body: {
      en: 'Publish through the transactional outbox, bump schema_version on payload evolution, and make every consumer idempotent.',
      vi: 'Phát qua outbox giao dịch, tăng schema_version khi payload đổi, và mọi consumer phải idempotent.',
    },
  },
  {
    title: { en: 'Secrets & encryption', vi: 'Bí mật & mã hóa' },
    body: {
      en: 'Secrets come from Kubernetes secrets/env; columns holding secrets must be registered in the encrypted-column contract.',
      vi: 'Bí mật lấy từ secret/env Kubernetes; cột chứa bí mật phải nằm trong contract cột mã hóa.',
    },
  },
  {
    title: { en: 'Contracts', vi: 'Hợp đồng' },
    body: {
      en: 'Response shape changes update OpenAPI and problem pages in the same change; proto edits require regenerating arda-proto.',
      vi: 'Đổi shape response phải cập nhật OpenAPI và trang problem trong cùng thay đổi; sửa proto phải regenerate arda-proto.',
    },
  },
];

export default function GuidelinesPage() {
  const { locale } = usePortalI18n();
  const isVi = locale === 'vi';

  return (
    <DocPage>
      <DocHeader
        badge="RFC 7807 • REST CONTRACT"
        title={isVi ? 'Quy chuẩn Kỹ thuật & Chuẩn hóa Lỗi' : 'Engineering & Error Handling Guidelines'}
        description={
          isVi
            ? `Bộ quy chuẩn bắt buộc cho ${PLATFORM_FACTS.services} microservices, gateway BFF và client: bao đóng lỗi, phân cấp mã, chính sách thử lại, phân tầng rủi ro và các invariant được CI kiểm chứng.`
            : `Mandatory contracts for ${PLATFORM_FACTS.services} microservices, the BFF gateway, and clients: error envelope, code hierarchy, retry semantics, risk tiers, and CI-enforced invariants.`
        }
      />

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard value={portalStats.totalProblems} label={isVi ? 'Mã lỗi chuẩn hóa' : 'Standardized problem codes'} hint={`${portalStats.clientErrors} × 4xx · ${portalStats.serverErrors} × 5xx`} />
        <StatCard value={RETRY_POLICIES.length} label={isVi ? 'Chính sách thử lại' : 'Retry policies'} hint="gắn theo từng mã lỗi" tone="warning" />
        <StatCard value={POLICY_RISK_TIERS.length} label={isVi ? 'Tầng rủi ro Gateway' : 'Gateway risk tiers'} hint="public → low → medium → high" tone="info" />
        <StatCard value={PLATFORM_FACTS.checkScripts} label={isVi ? 'Script invariant trong CI' : 'CI invariant scripts'} hint="arda-be/scripts/check-*.mjs" tone="success" />
      </section>

      {/* 1. Envelope */}
      <DocSection
        index="1"
        icon={FileCode2}
        title={isVi ? 'Bao đóng Lỗi Chuẩn (Contract)' : 'Canonical Error Envelope'}
        description={
          isVi
            ? 'Bề mặt đã migrate trả Content-Type application/problem+json với các trường phẳng sau. Lưu ý: instance/timestamp KHÔNG thuộc envelope hiện tại.'
            : 'Migrated surfaces return Content-Type application/problem+json with the flat fields below. Note: instance/timestamp are NOT part of the current envelope.'
        }
      >
        <CodeBlock
          title="application/problem+json"
          code={`HTTP/1.1 401 Unauthorized
Content-Type: application/problem+json

{
  "type": "https://docs.arda.io.vn/problems/auth.error.unauthorized/",
  "title": "Unauthorized",
  "status": 401,
  "code": "auth.error.unauthorized",
  "message": "Bearer token is missing or has expired",
  "errors": [
    { "code": "validation.required", "message": "email is required", "field": "email" }
  ],
  "request_id": "req_88f912a7d4c",
  "trace_id": "trc_4b9a110ef"
}`}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <Callout tone="success" icon={CheckCircle2} title="type · status · code">
            {isVi
              ? 'type luôn là URL tuyệt đối https://docs.arda.io.vn/problems/<code>/; code là định danh máy đọc, ổn định theo thời gian.'
              : 'type is always the absolute URL https://docs.arda.io.vn/problems/<code>/; code is the stable machine identifier.'}
          </Callout>
          <Callout tone="success" icon={CheckCircle2} title="errors[] · request_id · trace_id">
            {isVi
              ? 'errors[] mô tả lỗi từng trường; request_id do biên request sinh và echo qua header X-Request-Id; trace_id theo W3C traceparent.'
              : 'errors[] lists per-field failures; request_id is generated at the request boundary and echoed via X-Request-Id; trace_id follows W3C traceparent.'}
          </Callout>
        </div>
        <Callout tone="neutral" icon={Layers} title={isVi ? 'Hai shape lỗi đang tồn tại song song' : 'Two error shapes coexist today'}>
          {isVi
            ? 'Ngoài problem+json (bề mặt đã migrate), một số surface cũ trả bao đóng arda-errors { error: { code, message, fields, request_id } } với application/json. Client nên đọc code/message và ưu tiên problem+json khi có.'
            : 'Besides problem+json (migrated surfaces), some legacy surfaces return the arda-errors envelope { error: { code, message, fields, request_id } } as application/json. Clients should read code/message and prefer problem+json when present.'}
        </Callout>
      </DocSection>

      {/* 2. Code hierarchy */}
      <DocSection
        index="2"
        icon={GitBranch}
        title={isVi ? 'Phân cấp Mã lỗi' : 'Problem Code Hierarchy'}
        description={
          isVi
            ? 'Cú pháp <domain>.<subdomain>.<specific_error> viết thường, snake_case; catalog được chia 3 cụm và 9 namespace dưới đây.'
            : 'Syntax is <domain>.<subdomain>.<specific_error>, lowercase snake_case; the catalog spans 3 clusters and the 9 namespaces below.'
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {portalStats.clusters.map((cluster) => (
            <div key={cluster.id} className="p-4 rounded-xl border border-border bg-card space-y-1">
              <div className="text-2xl font-bold text-primary">{cluster.totalCodes}</div>
              <div className="text-xs font-semibold text-foreground">
                {isVi ? cluster.title_vi : cluster.title}
              </div>
              <div className="text-[11px] text-muted-foreground font-mono">{cluster.id}</div>
            </div>
          ))}
        </div>
        <DataTable
          columns={[isVi ? 'Namespace' : 'Namespace', isVi ? 'Tên' : 'Name', isVi ? 'Số mã' : 'Codes']}
          minWidth={520}
          rows={portalStats.categories.map((category) => [
            <code key="id" className="font-mono text-[11px] text-primary">
              {category.id}.*
            </code>,
            isVi ? category.title_vi : category.title,
            category.count,
          ])}
        />
      </DocSection>

      {/* 3. Retry */}
      <DocSection
        index={3}
        icon={RefreshCw}
        title={isVi ? 'Chính sách Thử lại (5 loại)' : 'Retry Policies (5 kinds)'}
        description={
          isVi
            ? 'SDK/client không được tự ý retry ngoài chính sách gắn với mã lỗi; số lượng mã theo từng chính sách được đếm khi build.'
            : 'Clients must not retry outside the policy attached to a problem code; per-policy counts are computed at build time.'
        }
      >
        <DataTable
          columns={['Policy', isVi ? 'Số mã' : 'Codes', isVi ? 'Ngữ nghĩa' : 'Semantics']}
          minWidth={680}
          rows={RETRY_POLICIES.map((policy) => {
            const count = portalStats.retryPolicies.find((p) => p.policy === policy.policy)?.count ?? 0;
            return [
              <code key="policy" className="font-mono text-[11px] text-primary">
                {policy.policy}
              </code>,
              count,
              pick(policy.meaning, locale),
            ];
          })}
        />
        <Callout tone="warning" icon={AlertTriangle} title={isVi ? 'Luôn log request_id' : 'Always log request_id'}>
          {isVi
            ? 'Khi retry hoặc báo sự cố, đính kèm request_id (header X-Request-Id) để đối soát xuyên service và tra log nhanh.'
            : 'When retrying or escalating, attach request_id (X-Request-Id) so operators can correlate across services and jump to logs.'}
        </Callout>
      </DocSection>

      {/* 4. Risk tiers */}
      <DocSection
        index={4}
        icon={ShieldCheck}
        title={isVi ? 'Phân tầng Rủi ro Gateway' : 'Gateway Risk Tiers'}
        description={
          isVi
            ? 'Microservice nội bộ không tự kiểm tra auth; toàn bộ 78 route nằm trong policy.yaml với 4 tầng rủi ro. Tầng high yêu cầu thêm recent auth (step-up).'
            : 'Internal services do not authenticate; all 78 routes live in policy.yaml under 4 risk tiers. The high tier additionally requires recent auth (step-up).'
        }
      >
        <DataTable
          columns={[isVi ? 'Tầng' : 'Tier', isVi ? 'Số route' : 'Routes', isVi ? 'Yêu cầu' : 'Requirement']}
          minWidth={560}
          rows={POLICY_RISK_TIERS.map((tier) => [
            <code key="tier" className="font-mono text-[11px] text-primary">
              {tier.tier}
            </code>,
            tier.count,
            pick(tier.behavior, locale),
          ])}
        />
        <Callout tone="danger" icon={Lock} title={isVi ? 'Từ chối & recent auth' : 'Denials & recent auth'}>
          {isVi
            ? 'Thiếu phiên → 401 user_context_unavailable; thiếu quyền → 403 insufficient_permissions; sai đơn vị → 403 organization_forbidden; phiên cũ trên route high → 403 recent_auth_required.'
            : 'Missing session → 401 user_context_unavailable; missing grant → 403 insufficient_permissions; org not in membership → 403 organization_forbidden; stale session on a high route → 403 recent_auth_required.'}
        </Callout>
      </DocSection>

      {/* 5. Response contract */}
      <DocSection
        index={5}
        icon={FileCode2}
        title={isVi ? 'Hợp đồng Response & Phân trang' : 'Response & Pagination Contract'}
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
          <DataTable
            columns={[isVi ? 'Tham số list' : 'List parameter', isVi ? 'Giá trị' : 'Value']}
            minWidth={320}
            rows={LIST_QUERY_PARAMS.map((row) => [
              <code key="p" className="font-mono text-[11px] text-primary">
                {row.param}
              </code>,
              row.value,
            ])}
          />
        </div>
        <Callout tone="info" title={isVi ? 'Một envelope cho mọi kết quả' : 'One envelope for results'}>
          {isVi
            ? 'Endpoint đã migrate trả { result, success, errors, messages, meta }; danh sách nằm trong result dạng { items, page, per_page, total }. Không đoán shape ở runtime.'
            : 'Migrated endpoints return { result, success, errors, messages, meta }; lists live inside result as { items, page, per_page, total }. Never guess shapes at runtime.'}
        </Callout>
      </DocSection>

      {/* 6. CI invariants */}
      <DocSection
        index={6}
        icon={Lock}
        title={isVi ? 'Bất biến được CI Kiểm chứng' : 'CI-Enforced Invariants'}
        description={
          isVi
            ? 'CI arda-be chạy 15 script check-*.mjs; thay đổi vi phạm sẽ fail trước khi merge. Bảng dưới là phạm vi từng script.'
            : 'arda-be CI runs 15 check-*.mjs scripts; violating changes fail before merge. The table maps each script to its scope.'
        }
      >
        <DataTable
          columns={['Script', isVi ? 'Phạm vi' : 'Scope']}
          minWidth={620}
          rows={CI_CHECKS.map((check) => [
            <code key="name" className="font-mono text-[11px] text-primary">
              {check.name}
            </code>,
            pick(check.purpose, locale),
          ])}
        />
      </DocSection>

      {/* 7. Conventions */}
      <DocSection
        index={7}
        icon={Layers}
        title={isVi ? 'Quy ước Bắt buộc' : 'Required Conventions'}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {CONVENTIONS.map((rule) => (
            <Callout key={rule.title.en} tone="neutral" title={pick(rule.title, locale)}>
              {pick(rule.body, locale)}
            </Callout>
          ))}
        </div>
      </DocSection>

      <DocFooterNav
        previous={{ href: '/problems/auth.error.unauthorized/', label: isVi ? 'Danh mục Lỗi RFC 7807' : 'RFC 7807 Problem Catalog' }}
        next={{ href: '/architecture', label: isVi ? 'Xem Kiến trúc Hệ thống' : 'View System Architecture' }}
      />
    </DocPage>
  );
}
