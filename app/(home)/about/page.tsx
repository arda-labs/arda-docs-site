'use client';

import React from 'react';
import Link from 'next/link';
import {
  Cpu,
  ExternalLink,
  GitBranch,
  Landmark,
  Layers,
  Server,
  ShieldCheck,
} from 'lucide-react';
import { usePortalI18n } from '@/components/provider';
import {
  Callout,
  DataTable,
  DocFooterNav,
  DocHeader,
  DocPage,
  DocSection,
  StatCard,
} from '@/components/doc-page';
import {
  MFE_MODULES,
  PLATFORM_FACTS,
  REPOSITORIES,
  SERVICES,
  TECH_STACK,
  pick,
} from '@/lib/platform';
import portalStats from '@/content/portal-stats.json';

export default function AboutPage() {
  const { locale } = usePortalI18n();
  const isVi = locale === 'vi';

  return (
    <DocPage>
      <DocHeader
        badge="PLATFORM PROFILE"
        title={isVi ? 'Giới thiệu về Arda Core Banking' : 'About Arda Core Banking Platform'}
        description={
          isVi
            ? 'Nền tảng ngân hàng lõi phân tán, đa người thuê: microservices Go sau cổng BFF, Module Federation frontend, sổ cái ghi sổ kép bất biến và hạ tầng K3s GitOps tự vận hành.'
            : 'Multi-tenant distributed core banking platform: Go microservices behind a BFF edge, Module Federation frontend, immutable double-entry ledger, and a self-hosted K3s GitOps runtime.'
        }
      />

      {/* Numbers */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          value={PLATFORM_FACTS.services}
          label={isVi ? 'Go microservices' : 'Go microservices'}
          hint={isVi ? 'HTTP/JSON + gRPC mTLS + NATS' : 'HTTP/JSON + gRPC mTLS + NATS'}
        />
        <StatCard
          value={`1 + ${PLATFORM_FACTS.remotes}`}
          label={isVi ? 'Shell + remote MFE' : 'Shell + MFE remotes'}
          hint="Bun · Vite 8 · Module Federation"
          tone="info"
        />
        <StatCard
          value={portalStats.totalProblems}
          label={isVi ? 'Mã lỗi RFC 7807' : 'RFC 7807 problem codes'}
          hint={`${portalStats.clientErrors} × 4xx · ${portalStats.serverErrors} × 5xx`}
          tone="success"
        />
        <StatCard
          value={`${PLATFORM_FACTS.clusterNodes} nodes`}
          label={isVi ? 'Cụm K3s tự vận hành' : 'Self-hosted K3s cluster'}
          hint="Argo CD · Cloudflare Tunnel"
          tone="warning"
        />
      </section>

      {/* Vision */}
      <DocSection
        icon={Landmark}
        title={isVi ? 'Tầm nhìn & Sứ mệnh Kỹ thuật' : 'Engineering Vision & Mission'}
        description={
          isVi
            ? 'Arda giải quyết ba bài toán khó của hệ tài chính hiện đại: toàn vẹn sổ cái kép, quy trình phê duyệt nhiều bước chạy dài, và cách ly dữ liệu tuyệt đối giữa các tổ chức.'
            : 'Arda targets three hard problems of modern financial systems: double-entry ledger integrity, long-running multi-step approval flows, and strict isolation between financial organizations.'
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl border border-border bg-card space-y-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-sm text-foreground">
              {isVi ? 'Toàn vẹn Sổ cái' : 'Ledger Invariants'}
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {isVi
                ? 'Mọi bút toán đi qua PostingService: kiểm tra Nợ = Có, cân bằng theo từng loại tiền, khóa kỳ kế toán, chống trùng bằng idempotency key và đảo bút toán bất biến.'
                : 'Every posting runs through PostingService: Debit = Credit parity, per-currency balance, period gates, idempotency keys, and immutable reversal links.'}
            </p>
          </div>

          <div className="p-4 rounded-xl border border-border bg-card space-y-2">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-sm text-foreground">
              {isVi ? 'Phân tán & Đa thuê' : 'Multi-Tenancy'}
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {isVi
                ? 'Tenant lấy từ phiên BFF, không cho client tự khai; đơn vị đang chọn được đối chiếu membership trước khi forward. Mỗi service sở hữu database riêng.'
                : 'Tenant comes from the BFF session — clients can never assert it; the active org is validated against membership before forwarding. Each service owns its database.'}
            </p>
          </div>

          <div className="p-4 rounded-xl border border-border bg-card space-y-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Cpu className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-sm text-foreground">
              {isVi ? 'Hợp đồng Máy đọc' : 'Contract-First'}
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {isVi
                ? `${portalStats.totalProblems} mã lỗi RFC 7807 được CI kiểm chứng 100%, OpenAPI 3.1, và API tra cứu /api/lookup mở CORS * cho AI agent/CLI.`
                : `${portalStats.totalProblems} RFC 7807 problem codes validated by CI, OpenAPI 3.1 contracts, and the CORS-open /api/lookup machine API for agents and CLI tooling.`}
            </p>
          </div>
        </div>
      </DocSection>

      {/* Service inventory */}
      <DocSection
        icon={Server}
        title={isVi ? 'Danh mục Microservices Backend' : 'Backend Service Inventory'}
        description={
          isVi
            ? `Toàn bộ ${PLATFORM_FACTS.services} service dùng chung thư viện libs/go/*, thống nhất cổng container HTTP 8080 / gRPC 9090; mỗi service sở hữu một database PostgreSQL riêng.`
            : `All ${PLATFORM_FACTS.services} services share the libs/go/* libraries and unify container ports at HTTP 8080 / gRPC 9090; every service owns its own PostgreSQL database.`}
      >
        <DataTable
          columns={[
            isVi ? 'Service' : 'Service',
            'Database',
            isVi ? 'Trách nhiệm' : 'Responsibility',
          ]}
          rows={SERVICES.map((service) => [
            <code key="name" className="font-mono text-[11px] text-primary">
              {service.name}
            </code>,
            <code key="db" className="font-mono text-[11px]">
              {service.database}
            </code>,
            pick(service.responsibility, locale),
          ])}
        />
      </DocSection>

      {/* MFE modules */}
      <DocSection
        icon={Layers}
        title={isVi ? 'Frontend Module Federation' : 'Frontend Module Federation'}
        description={
          isVi
            ? 'Mỗi remote là một deployment unit độc lập, chỉ export ./Routes; shell giữ layout, phiên đăng nhập và nạp remote theo lazy. Cổng dev là registry cố định trong federation.shared.ts.'
            : 'Each remote is an independent deployment unit exposing only ./Routes; the shell owns layout, session bootstrap and lazy loading. Dev ports come from the fixed registry in federation.shared.ts.'
        }
      >
        <DataTable
          columns={['Module', isVi ? 'Cổng dev' : 'Dev port', isVi ? 'Phạm vi' : 'Scope']}
          rows={MFE_MODULES.map((module) => [
            <code key="name" className="font-mono text-[11px] text-primary">
              {module.name}
            </code>,
            <code key="port" className="font-mono text-[11px]">
              {module.port}
            </code>,
            pick(module.scope, locale),
          ])}
        />
      </DocSection>

      {/* Tech stack */}
      <DocSection
        icon={GitBranch}
        title={isVi ? 'Ngăn xếp Công nghệ' : 'Technology Stack'}
      >
        <DataTable
          columns={[isVi ? 'Tầng' : 'Layer', isVi ? 'Công nghệ' : 'Technology']}
          minWidth={640}
          rows={TECH_STACK.map((row) => [row.layer, row.technology])}
        />
      </DocSection>

      {/* Repositories + delivery */}
      <DocSection
        icon={ExternalLink}
        title={isVi ? 'Kho mã nguồn & Luồng phát hành' : 'Repositories & Delivery'}
      >
        <DataTable
          columns={[isVi ? 'Kho' : 'Repository', isVi ? 'Mục đích' : 'Purpose']}
          rows={REPOSITORIES.map((repo) => [
            <a
              key="name"
              href={repo.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 font-mono text-[11px] text-primary hover:underline"
            >
              {repo.name}
              <ExternalLink className="w-3 h-3 opacity-70" />
            </a>,
            pick(repo.purpose, locale),
          ])}
        />
        <Callout tone="info" icon={GitBranch} title={isVi ? 'Đường phát hành' : 'Delivery pipeline'}>
          {isVi
            ? 'Push main (arda-be / arda-mfe) → GitHub Actions build & push image GHCR → Argo CD image updater ghi digest mới vào arda-infra → auto-sync + selfHeal về cụm K3s. Portal tài liệu và bản MFE edge deploy qua Cloudflare Workers.'
            : 'Push to main (arda-be / arda-mfe) → GitHub Actions builds and pushes GHCR images → the Argo CD image updater pins the new digest in arda-infra → auto-sync + selfHeal into the K3s cluster. The docs portal and edge MFE deploy via Cloudflare Workers.'}
        </Callout>
      </DocSection>

      <DocFooterNav
        previous={{ href: '/guidelines', label: isVi ? 'Quy chuẩn Kỹ thuật' : 'Engineering Guidelines' }}
        next={{ href: '/terms-of-service', label: isVi ? 'Điều khoản Dịch vụ' : 'Terms of Service' }}
      />
    </DocPage>
  );
}
