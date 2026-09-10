'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, ArrowLeft, ArrowRight, Clock, KeyRound, AlertTriangle, Code2 } from 'lucide-react';
import { usePortalI18n } from '@/components/provider';
import { LanguageSwitcher } from '@/components/language-switcher';

export default function ApiReferencePage() {
  const { locale } = usePortalI18n();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 border-b border-border pb-6 mb-8">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            {locale === 'vi' ? 'Quay lại Tổng quan' : 'Back to Overview'}
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            {locale === 'vi' ? 'Cổng API & Chính sách Gateway' : 'API Gateway & Policies'}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {locale === 'vi'
              ? 'Mô hình Ingress BFF, chính sách định tuyến tập trung và hợp đồng giao tiếp chuẩn OpenAPI 3.1.'
              : 'Ingress BFF architecture, centralized route policy enforcement, and OpenAPI 3.1 specifications.'}
          </p>
        </div>
        <LanguageSwitcher />
      </div>

      {/* Synthesis Notice / Placeholder Box */}
      <div className="rounded-lg border border-border bg-card p-6 sm:p-8 space-y-6">
        <div className="flex items-start gap-4">
          <div className="p-2.5 rounded-md bg-muted text-muted-foreground border border-border">
            <Clock className="w-5 h-5" />
          </div>
          <div className="space-y-1.5 flex-1">
            <div className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-muted text-muted-foreground border border-border">
              {locale === 'vi' ? 'Đang tổng hợp & chuẩn hóa' : 'Documentation Under Synthesis'}
            </div>
            <h2 className="text-base font-semibold text-foreground">
              {locale === 'vi' ? 'Tài liệu Cổng API & Chính sách đang được tổng hợp' : 'API Gateway & Policy Documentation Under Consolidation'}
            </h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {locale === 'vi'
                ? 'Đặc tả các endpoint HTTP, mô hình xác thực Ingress BFF, và cơ chế quản lý phân quyền tập trung đang được tổng hợp từ policy.yaml và các bộ hợp đồng OpenAPI. Nội dung sẽ được cập nhật đồng bộ trong các phiên bản sắp tới.'
                : 'HTTP route specifications, Ingress BFF authentication flows, and centralized access control contracts are being consolidated from policy.yaml and OpenAPI manifests. Specifications will be updated in upcoming releases.'}
            </p>
          </div>
        </div>

        {/* Planned Topics Outline */}
        <div className="border-t border-border/80 pt-6 space-y-3">
          <div className="text-xs font-semibold text-foreground uppercase tracking-wider">
            {locale === 'vi' ? 'Các chủ đề đang được chuẩn hóa:' : 'Planned topics in progress:'}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded border border-border/60 bg-muted/20 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <div>
                <span className="font-medium text-foreground">
                  {locale === 'vi' ? 'Mô hình Ingress Auth Gateway (Port 8082)' : 'Ingress Auth Gateway Model (Port 8082)'}
                </span>
                <p className="text-muted-foreground mt-0.5 text-[11px]">
                  {locale === 'vi' ? 'Cổng giao tiếp đơn điểm BFF, giải mã phiên và dịch gRPC.' : 'Single BFF ingress, session resolution, and gRPC dispatch.'}
                </p>
              </div>
            </div>
            <div className="p-3 rounded border border-border/60 bg-muted/20 flex items-start gap-2.5">
              <KeyRound className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
              <div>
                <span className="font-medium text-foreground">
                  {locale === 'vi' ? 'Quản lý Quyền tập trung (policy.yaml)' : 'Centralized Authorization (policy.yaml)'}
                </span>
                <p className="text-muted-foreground mt-0.5 text-[11px]">
                  {locale === 'vi' ? 'Chính sách RBAC định tuyến tập trung, microservice không tự auth.' : 'Declarative route policy; internal services assume verified auth.'}
                </p>
              </div>
            </div>
            <div className="p-3 rounded border border-border/60 bg-muted/20 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
              <div>
                <span className="font-medium text-foreground">
                  {locale === 'vi' ? '4 Phân cấp Rủi ro (Risk Tiers)' : 'Four Route Risk Tiers'}
                </span>
                <p className="text-muted-foreground mt-0.5 text-[11px]">
                  {locale === 'vi' ? 'Phân loại none, low, medium, high (yêu cầu recent auth 5 phút).' : 'Tiers: none, low, medium, and high (requires step-up auth).'}
                </p>
              </div>
            </div>
            <div className="p-3 rounded border border-border/60 bg-muted/20 flex items-start gap-2.5">
              <Code2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
              <div>
                <span className="font-medium text-foreground">
                  {locale === 'vi' ? 'Hợp đồng Lỗi RFC 7807 & API Tra cứu' : 'RFC 7807 Contract & Lookup API'}
                </span>
                <p className="text-muted-foreground mt-0.5 text-[11px]">
                  {locale === 'vi' ? 'API /api/lookup tra cứu mã lỗi máy đọc phục vụ AI và CI/CD.' : 'Automated machine-readable lookup endpoint for AI agents.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Live Catalog CTA */}
        <div className="border-t border-border/80 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <span className="text-muted-foreground">
            {locale === 'vi' ? 'Bạn có thể tra cứu toàn bộ 152 mã lỗi đã chuẩn hóa tại:' : 'Explore the live 152 problem specifications at:'}
          </span>
          <Link
            href="/problems/auth.error.unauthorized/"
            className="text-primary hover:underline font-medium inline-flex items-center gap-1 shrink-0"
          >
            {locale === 'vi' ? 'Mở Danh mục Mã Lỗi' : 'Open Problem Catalog'}
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="flex items-center justify-between border-t border-border pt-6 mt-12 text-xs">
        <Link href="/architecture" className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          {locale === 'vi' ? 'Xem lại: Kiến trúc' : 'Previous: Architecture'}
        </Link>
        <Link href="/workflows" className="text-primary hover:underline inline-flex items-center gap-1">
          {locale === 'vi' ? 'Xem tiếp: Quy trình Vận hành' : 'Next: Workflows & Runbooks'}
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
