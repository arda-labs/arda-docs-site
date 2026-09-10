'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Landmark,
  ShieldCheck,
  Server,
  Layers,
  GitBranch,
  Terminal,
  Cpu,
  ExternalLink,
} from 'lucide-react';
import { usePortalI18n } from '@/components/provider';

export default function AboutPage() {
  const { locale } = usePortalI18n();
  const isVi = locale === 'vi';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      {/* Header */}
      <div className="border-b border-border pb-6 space-y-2">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground mb-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          {isVi ? 'Quay lại Tổng quan' : 'Back to Overview'}
        </Link>
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-primary/10 text-primary border border-primary/20">
            PLATFORM PROFILE
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          {isVi ? 'Giới thiệu về Arda Core Banking' : 'About Arda Core Banking Platform'}
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {isVi
            ? 'Nền tảng ngân hàng lõi phân tán thế hệ mới, xây dựng trên kiến trúc hướng sự kiện, bảo vệ bất biến sổ cái và kiểm soát truy cập Zero-Trust.'
            : 'Next-generation distributed core banking system built on event-driven sagas, ledger invariant safety, and Zero-Trust access control.'}
        </p>
      </div>

      {/* Overview */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
          <Landmark className="w-5 h-5 text-primary" />
          <span>{isVi ? 'Tầm nhìn & Sứ mệnh Kỹ thuật' : 'Engineering Vision & Mission'}</span>
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {isVi
            ? 'Arda được thiết kế nhằm giải quyết các bài toán hóc búa nhất của hệ thống tài chính hiện đại: duy trì tính toàn vẹn của sổ cái kép (double-entry bookkeeping), xử lý các quy trình phê duyệt tín dụng nhiều bước qua saga phân tán, và hỗ trợ đa người thuê (multi-tenant) với độ bảo mật tuyệt đối.'
            : 'Arda is engineered to address the core challenges of modern financial systems: guaranteeing double-entry ledger invariants, coordinating multi-step loan workflows via distributed sagas, and enforcing strict multi-tenant isolation.'}
        </p>

        {/* 3 Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-xl border border-border bg-card space-y-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-sm text-foreground">
              {isVi ? 'Toàn vẹn Sổ cái' : 'Ledger Invariants'}
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {isVi
                ? 'Nguyên tắc hạch toán kép bất biến. Số dư không bao giờ âm khi chưa được cấp hạn mức thấu chi.'
                : 'Immutable double-entry balance accounting. Zero drift tolerance across all accounts.'}
            </p>
          </div>

          <div className="p-4 rounded-xl border border-border bg-card space-y-2">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
              <Layers className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-sm text-foreground">
              {isVi ? 'Phân tán & Đa thuê' : 'Multi-Tenancy'}
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {isVi
                ? 'Mọi yêu cầu đều được ràng buộc ngữ cảnh tenant_id, dữ liệu được cô lập logic hoàn toàn ở tầng DB.'
                : 'Strict tenant context propagation. Row-level tenancy boundaries enforced across all queries.'}
            </p>
          </div>

          <div className="p-4 rounded-xl border border-border bg-card space-y-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold">
              <Cpu className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-sm text-foreground">
              {isVi ? 'Hợp đồng Máy đọc' : 'Contract-First'}
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {isVi
                ? '152 mã lỗi chuẩn RFC 7807, OpenAPI 3.1 và endpoint tra cứu tự động cho AI agent / CLI.'
                : '152 standardized RFC 7807 problem codes, OpenAPI 3.1, and live machine lookup API.'}
            </p>
          </div>
        </div>
      </section>

      {/* Tech Stack Breakdown */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
          <Server className="w-5 h-5 text-primary" />
          <span>{isVi ? 'Hệ sinh thái & Công nghệ Lõi' : 'Technology Architecture'}</span>
        </h2>

        <div className="p-5 rounded-xl border border-border bg-card space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <div className="font-bold text-foreground flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <span>Backend Services (`arda-be`)</span>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                {isVi
                  ? '11 microservices viết bằng Golang, liên lạc nội bộ bằng gRPC qua TLS, quản lý luồng bằng Camunda Zeebe và cơ sở dữ liệu PostgreSQL.'
                  : '11 Go microservices communicating via internal gRPC over mTLS, orchestrated by Zeebe Sagas with PostgreSQL storage.'}
              </p>
            </div>

            <div className="space-y-1.5">
              <div className="font-bold text-foreground flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Frontend MFE (`arda-mfe`)</span>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                {isVi
                  ? 'Kiến trúc Module Federation: 1 Shell điều phối + 7 Remotes độc lập, phát triển trên nền Bun, React và Vite, bảo đảm tính tự chủ deploy.'
                  : 'Module Federation architecture: 1 Shell + 7 autonomous Remotes built with Bun, React, and Vite for independent releases.'}
              </p>
            </div>

            <div className="space-y-1.5">
              <div className="font-bold text-foreground flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span>Hạ tầng GitOps (`arda-infra`)</span>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                {isVi
                  ? 'Cụm K3s self-hosted 3-node, triển khai hoàn toàn qua GitOps với Argo CD (auto-sync, self-heal) và định tuyến bảo mật Cloudflare Tunnel.'
                  : 'Self-hosted 3-node K3s cluster managed via Argo CD GitOps with automated self-healing and Cloudflare Tunnel routing.'}
              </p>
            </div>

            <div className="space-y-1.5">
              <div className="font-bold text-foreground flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-purple-500" />
                <span>Cổng Tài liệu (`arda-docs-site`)</span>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                {isVi
                  ? 'Next.js SSG bespoke, hiển thị Markdoc & Shiki syntax highlighter, tích hợp máy tra cứu mã lỗi tự động CORS * tại Cloudflare Edge.'
                  : 'Next.js static site powered by Markdoc and Shiki, backed by a Cloudflare Edge Worker for zero-latency machine code lookups.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Links */}
      <div className="pt-6 border-t border-border flex items-center justify-between">
        <Link
          href="/guidelines"
          className="text-xs font-semibold text-primary hover:underline"
        >
          {isVi ? '← Đọc Quy chuẩn Kỹ thuật' : '← Read Engineering Guidelines'}
        </Link>
        <Link
          href="/terms-of-service"
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          {isVi ? 'Điều khoản Dịch vụ →' : 'Terms of Service →'}
        </Link>
      </div>
    </div>
  );
}
