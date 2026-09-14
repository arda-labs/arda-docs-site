'use client';

import React from 'react';
import {
  Activity,
  Database,
  GitBranch,
  Layers,
  Network,
  ShieldCheck,
  Workflow,
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
  AUTH_FACTS,
  GATEWAY_UPSTREAMS,
  INJECTED_HEADERS,
  PLATFORM_FACTS,
  pick,
} from '@/lib/platform';

const BPMN_CONTRACT = [
  {
    element: 'bpmn:userTask',
    rule: {
      en: 'Human steps use zeebe:userTask + assignmentDefinition. Never a serviceTask waiting on people.',
      vi: 'Bước con người dùng zeebe:userTask + assignmentDefinition. Không bao giờ dùng serviceTask chờ người.',
    },
  },
  {
    element: 'bpmn:serviceTask',
    rule: {
      en: 'Domain side effects use job type {service}.{aggregate}.{op}.{action} with explicit retries.',
      vi: 'Side effect nghiệp vụ dùng job type {service}.{aggregate}.{op}.{action} với retry tường minh.',
    },
  },
  {
    element: 'Error boundary',
    rule: {
      en: 'Business failures throw BPMN errors caught by an error boundary event — not gateway flags.',
      vi: 'Lỗi nghiệp vụ throw BPMN error và được bắt bằng error boundary event — không dùng cờ gateway.',
    },
  },
  {
    element: 'Variables',
    rule: {
      en: 'Workflow variables carry references only (caseId, primaryObjectId, approvalResult) — no PII, no blobs.',
      vi: 'Biến workflow chỉ mang tham chiếu (caseId, primaryObjectId, approvalResult) — không PII, không blob.',
    },
  },
  {
    element: 'SLA timer',
    rule: {
      en: 'SLA is a non-interrupting timer boundary on user tasks; a timeout escalates but never fails the task.',
      vi: 'SLA là timer boundary không ngắt trên user task; quá hạn chỉ escalate, không làm fail tác vụ.',
    },
  },
];

const NAMESPACES = [
  { ns: 'auth', contents: 'Ory Hydra, Ory Kratos' },
  { ns: 'database', contents: 'CloudNativePG PostgreSQL 18 cluster (3-node HA)' },
  { ns: 'platform', contents: 'NATS (3-node), Valkey (3-node), Garage S3 (3-node), Zeebe 8.5, cloudflared' },
  { ns: 'arda-app', contents: 'Backend microservices + auth-gateway' },
  { ns: 'arda-web', contents: 'MFE shell and static assets' },
];

const DEV_PORTS = [
  { resource: 'PostgreSQL', access: 'NodePort 30432' },
  { resource: 'Valkey', access: 'NodePort 30379 (primary) · 30380 (sentinel)' },
  { resource: 'Hydra admin', access: 'NodePort 30445' },
  { resource: 'Kratos admin', access: 'NodePort 30446' },
  { resource: 'NATS', access: 'kubectl port-forward svc/nats 4222:4222' },
];

export default function ArchitecturePage() {
  const { locale } = usePortalI18n();
  const isVi = locale === 'vi';

  return (
    <DocPage>
      <DocHeader
        badge="SYSTEM DESIGN"
        badgeTone="success"
        title={isVi ? 'Kiến trúc Core Banking' : 'Core Banking Architecture'}
        description={
          isVi
            ? 'Ranh giới hệ thống phân tán, hợp đồng nhất quán giao dịch, bất biến sổ cái và cách dữ liệu/định danh lan truyền qua từng tầng.'
            : 'Distributed system boundaries, transactional consistency contracts, ledger invariants, and how identity/data propagate through each layer.'
        }
      />

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard value={PLATFORM_FACTS.services} label={isVi ? 'Microservices' : 'Microservices'} hint="Go 1.27 · HTTP + gRPC" />
        <StatCard value={GATEWAY_UPSTREAMS.length} label={isVi ? 'Tiền tố định tuyến' : 'Gateway route prefixes'} hint="/api/* → service" tone="info" />
        <StatCard value={PLATFORM_FACTS.policyRoutes} label={isVi ? 'Route được policy hóa' : 'Policy-enforced routes'} hint="auth · risk · permissions" tone="warning" />
        <StatCard value={PLATFORM_FACTS.bpmnProcesses} label={isVi ? 'Quy trình BPMN' : 'BPMN processes'} hint="Zeebe 8.5" tone="success" />
      </section>

      {/* 1. Edge & request path */}
      <DocSection
        index="1"
        icon={Network}
        title={isVi ? 'Đường đi Request & Vành Edge' : 'Request Path & Edge Boundary'}
        description={
          isVi
            ? 'Không có client nào gọi thẳng microservice. Mọi request đi qua Cloudflare, tunnel, Traefik forward-auth rồi mới tới auth-gateway.'
            : 'No client calls a microservice directly. Every request crosses Cloudflare, the tunnel, and Traefik forward-auth before reaching auth-gateway.'
        }
      >
        <CodeBlock
          title="request-path"
          code={`Browser / Mobile / API client
  │
  ▼  Cloudflare (DDoS / WAF / CDN)
cloudflared Tunnel
  │
  ▼  Traefik Ingress — ForwardAuth → auth-gateway /auth/check
auth-gateway (BFF, dev :8082)
  │   resolve session cookie → verify Kratos identity → IAM user context
  │   enforce policy.yaml (auth / permissions / risk)
  ▼
Domain services (HTTP/JSON in, gRPC mTLS between services, NATS events)
  │
  ▼
Data layer: CloudNativePG PostgreSQL 18 · Valkey · Garage S3 · Zeebe 8.5`}
        />

        <Callout tone="danger" icon={ShieldCheck} title={isVi ? 'Quy tắc bất biến' : 'Boundary rule'}>
          {isVi
            ? 'Service nội bộ không tự kiểm tra đăng nhập: chúng tin vào header do auth-gateway bơm vào và chỉ chạy phía sau mạng nội bộ. Trình duyệt không bao giờ tự đặt được X-Tenant-Id hay X-User-Id.'
            : 'Internal services do not authenticate: they trust headers injected by auth-gateway and only run inside the cluster network. A browser can never set X-Tenant-Id or X-User-Id itself.'}
        </Callout>
      </DocSection>

      {/* 2. Gateway routing */}
      <DocSection
        index="2"
        icon={GitBranch}
        title={isVi ? 'Định tuyến Auth Gateway' : 'Auth Gateway Routing'}
        description={
          isVi
            ? 'auth-gateway khớp tiền tố theo thứ tự cố định và forward sang upstream tương ứng; tiền tố không cấu hình trả 503 upstream_not_configured ngay tại biên.'
            : 'auth-gateway matches prefixes in a fixed order and forwards to the matching upstream; an unconfigured prefix fails fast at the edge with 503 upstream_not_configured.'
        }
      >
        <DataTable
          columns={[isVi ? 'Tiền tố' : 'Prefix', 'Upstream service']}
          minWidth={520}
          rows={GATEWAY_UPSTREAMS.map((route) => [
            <code key="prefix" className="font-mono text-[11px] text-primary">
              {route.prefix}
            </code>,
            <code key="service" className="font-mono text-[11px]">
              {route.service}
            </code>,
          ])}
        />
      </DocSection>

      {/* 3. Identity propagation */}
      <DocSection
        index="3"
        icon={ShieldCheck}
        title={isVi ? 'Lan truyền Định danh' : 'Identity Propagation'}
        description={
          isVi
            ? `Sau khi xác thực, gateway bơm bộ header chuẩn vào request nội bộ. Route rủi ro high bắt buộc phiên còn "recent auth" trong ${AUTH_FACTS.recentAuthWindowSeconds} giây.`
            : `After authentication the gateway injects the standard header set into the internal request. High-risk routes require the session to be "recent auth" within ${AUTH_FACTS.recentAuthWindowSeconds} seconds.`
        }
      >
        <DataTable
          columns={['Header', isVi ? 'Ý nghĩa' : 'Purpose']}
          minWidth={620}
          rows={INJECTED_HEADERS.map((header) => [
            <code key="header" className="font-mono text-[11px] text-primary">
              {header.header}
            </code>,
            pick(header.purpose, locale),
          ])}
        />
      </DocSection>

      {/* 4. Ledger & persistence */}
      <DocSection
        index="4"
        icon={Database}
        title={isVi ? 'Sổ cái & Tầng Dữ liệu' : 'Ledger & Data Layer'}
        description={
          isVi
            ? 'finance-service sở hữu động cơ hạch toán; mọi service khác đi qua gRPC PostingService thay vì ghi thẳng bảng kế toán.'
            : 'finance-service owns the posting engine; every other service calls the gRPC PostingService instead of writing accounting tables directly.'
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Callout tone="primary" icon={Activity} title="PostingService pipeline">
            {isVi
              ? 'Validate (Nợ = Có, cân bằng theo loại tiền, tài khoản nature, kỳ mở) → Post (idempotency key, bút toán bất biến) → Reverse (liên kết bút toán gốc, không sửa/xóa).'
              : 'Validate (Debit = Credit, per-currency balance, account nature, open period) → Post (idempotency key, immutable entry) → Reverse (linked to the original entry; nothing is edited or deleted).'}
          </Callout>
          <Callout tone="info" icon={Database} title={isVi ? 'Lưu trữ' : 'Storage'}>
            {isVi
              ? 'CloudNativePG PostgreSQL 18 chạy 3-node HA, failover tự động. Valkey cho cache/hạn ngạch, Garage S3 cho media, mỗi service một database.'
              : 'CloudNativePG PostgreSQL 18 runs 3-node HA with automated failover. Valkey backs cache/quotas, Garage S3 stores media, and each service owns one database.'}
          </Callout>
          <Callout tone="success" icon={Activity} title={isVi ? 'Tổng hợp số dư' : 'Daily balances'}>
            {isVi
              ? 'fin_trial_balance_daily được rebuild mỗi ngày sau khi dồn tích/dự phòng post xong, phục vụ cân đối thử và báo cáo tài chính.'
              : 'fin_trial_balance_daily is rebuilt every day after accrual/provision postings, powering trial balance and financial statements.'}
          </Callout>
          <Callout tone="warning" icon={ShieldCheck} title={isVi ? 'Kỳ kế toán' : 'Accounting periods'}>
            {isVi
              ? 'Ghi sổ/đảo bút toán đều đi qua kiểm tra kỳ đang mở tại ngày hạch toán; kỳ đóng sẽ trả lỗi thay vì âm thầm ghi nhận.'
              : 'Posting and reversal always pass an open-period check on the accounting date; closed periods fail loudly instead of silently accepting writes.'}
          </Callout>
        </div>
      </DocSection>

      {/* 5. Events */}
      <DocSection
        index="5"
        icon={Layers}
        title={isVi ? 'Sự kiện & Outbox' : 'Events & Transactional Outbox'}
        description={
          isVi
            ? 'Tương tác bất đồng bộ chạy trên NATS JetStream với envelope chuẩn hóa; event nghiệp vụ được ghi cùng transaction qua outbox.'
            : 'Asynchronous integration runs on NATS JetStream with a standard envelope; business events are written in the same transaction via an outbox.'
        }
      >
        <CodeBlock
          title="ardaevents.Envelope"
          code={`subject:  arda.<domain>.<aggregate>.<action>.v1
{
  "id": "uuid",
  "event_code": "notification.inbox.created",
  "schema_version": 1,
  "occurred_at": "2026-07-04T12:00:00Z",
  "source_service": "notification-service",
  "tenant_id": "uuid",
  "actor": { "user_id": "uuid" },
  "payload": {}
}`}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Callout tone="primary" title={isVi ? 'Outbox mặc định' : 'Outbox first'}>
            {isVi
              ? 'Ghi outbox row trong cùng transaction với dữ liệu nghiệp vụ; worker nền phát lên NATS. Chỉ publish trực tiếp khi chấp nhận được mất mát.'
              : 'Insert an outbox row in the same transaction as the business write; a background worker publishes to NATS. Direct publish only when loss is acceptable.'}
          </Callout>
          <Callout tone="info" title={isVi ? 'Consumer idempotent' : 'Idempotent consumers'}>
            {isVi
              ? 'NATS giao ít nhất một lần, nên consumer phải chống trùng; schema_version dùng để tiến hóa payload không phá vỡ hợp đồng.'
              : 'NATS delivers at-least-once, so consumers must be idempotent; schema_version evolves payloads without breaking the contract.'}
          </Callout>
        </div>
      </DocSection>

      {/* 6. Workflow boundary */}
      <DocSection
        index="6"
        icon={Workflow}
        title={isVi ? 'Ranh giới Workflow (Zeebe)' : 'Workflow Boundary (Zeebe)'}
        description={
          isVi
            ? 'Chỉ workflow-service nói chuyện với Zeebe. Domain service tạo hồ sơ qua gRPC CreateCase/SubmitCase; UI gọi HTTP /api/workflow/* qua gateway.'
            : 'Only workflow-service talks to Zeebe. Domain services create cases via gRPC CreateCase/SubmitCase; the UI calls HTTP /api/workflow/* through the gateway.'
        }
      >
        <DataTable
          columns={[isVi ? 'Thành phần BPMN' : 'BPMN element', isVi ? 'Quy ước' : 'Contract']}
          minWidth={620}
          rows={BPMN_CONTRACT.map((row) => [
            <code key="element" className="font-mono text-[11px] text-primary">
              {row.element}
            </code>,
            pick(row.rule, locale),
          ])}
        />
        <Callout tone="neutral" icon={Workflow} title={isVi ? 'Tích hợp một luồng phê duyệt' : 'Starting an approval flow'}>
          {isVi
            ? '1) Lưu bản nháp ở domain service → 2) gọi workflowClient.CreateCase(caseType, primaryObjectId) → 3) SubmitCase(caseId, actor, variables) bắt đầu process instance → 4) lưu workflow_case_id trên bản ghi nghiệp vụ.'
            : '1) Persist the draft in the domain service → 2) call workflowClient.CreateCase(caseType, primaryObjectId) → 3) SubmitCase(caseId, actor, variables) starts the process instance → 4) store workflow_case_id on the domain row.'}
        </Callout>
      </DocSection>

      {/* 7. Runtime */}
      <DocSection
        index="7"
        icon={GitBranch}
        title={isVi ? 'Runtime, Namespace & GitOps' : 'Runtime, Namespaces & GitOps'}
        description={
          isVi
            ? 'Một cụm K3s self-hosted 3 node (192.168.10.201–203) phục vụ mọi môi trường; trạng thái mong muốn nằm hoàn toàn trong arda-infra, Argo CD auto-sync + selfHeal.'
            : 'One self-hosted 3-node K3s cluster (192.168.10.201–203) serves every environment; all desired state lives in arda-infra with Argo CD auto-sync + selfHeal.'
        }
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <DataTable
            columns={['Namespace', isVi ? 'Thành phần' : 'Contents']}
            minWidth={420}
            rows={NAMESPACES.map((row) => [
              <code key="ns" className="font-mono text-[11px] text-primary">
                {row.ns}
              </code>,
              row.contents,
            ])}
          />
          <DataTable
            columns={[isVi ? 'Tài nguyên dev' : 'Dev resource', 'Access']}
            minWidth={420}
            rows={DEV_PORTS.map((row) => [row.resource, row.access])}
          />
        </div>
      </DocSection>

      <DocFooterNav
        previous={{ href: '/guidelines', label: isVi ? 'Xem lại: Quy chuẩn Kỹ thuật' : 'Previous: Engineering Guidelines' }}
        next={{ href: '/api-reference', label: isVi ? 'Xem tiếp: Cổng API & Chính sách' : 'Next: API Gateway & Policies' }}
      />
    </DocPage>
  );
}
