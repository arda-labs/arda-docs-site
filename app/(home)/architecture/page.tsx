'use client';

import React from 'react';
import Link from 'next/link';
import { Database, ArrowLeft, ArrowRight, Clock, ShieldCheck, GitBranch, Layers } from 'lucide-react';
import { usePortalI18n } from '@/components/provider';
import { LanguageSwitcher } from '@/components/language-switcher';

export default function ArchitecturePage() {
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
            {locale === 'vi' ? 'Kiến trúc Core Banking' : 'Core Banking Architecture'}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {locale === 'vi'
              ? 'Mô hình hệ thống phân tán, hợp đồng giao dịch toàn vẹn và các nguyên tắc bảo toàn số dư.'
              : 'Distributed system boundaries, transactional consistency contracts, and ledger balance invariants.'}
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
              {locale === 'vi' ? 'Tài liệu kiến trúc đang được tái cấu trúc' : 'Architecture Documentation Under Consolidation'}
            </h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {locale === 'vi'
                ? 'Nội dung chi tiết về kiến trúc phân tán, mô hình dữ liệu và các bất biến giao dịch đang được tổng hợp từ các repository dịch vụ (arda-be, arda-mfe, arda-infra) và sẽ được hoàn thiện trong các đợt phát hành sắp tới.'
                : 'Detailed architectural specifications, distributed transaction boundaries, and ledger invariants are currently being consolidated from service repositories and will be published in upcoming releases.'}
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
              <Database className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
              <div>
                <span className="font-medium text-foreground">
                  {locale === 'vi' ? 'Sổ cái Ghi sổ kép (General Ledger)' : 'Double-Entry General Ledger'}
                </span>
                <p className="text-muted-foreground mt-0.5 text-[11px]">
                  {locale === 'vi' ? 'Bất biến cân bằng Nợ = Có và tính bất biến bút toán.' : 'Debit = Credit parity and immutable postings.'}
                </p>
              </div>
            </div>
            <div className="p-3 rounded border border-border/60 bg-muted/20 flex items-start gap-2.5">
              <GitBranch className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
              <div>
                <span className="font-medium text-foreground">
                  {locale === 'vi' ? 'Saga Phân tán Zeebe BPMN 8.5' : 'Zeebe BPMN Distributed Sagas'}
                </span>
                <p className="text-muted-foreground mt-0.5 text-[11px]">
                  {locale === 'vi' ? 'Worker Idempotency và cơ chế bù trừ giao dịch lỗi.' : 'Worker deduplication and compensation rollbacks.'}
                </p>
              </div>
            </div>
            <div className="p-3 rounded border border-border/60 bg-muted/20 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
              <div>
                <span className="font-medium text-foreground">
                  {locale === 'vi' ? 'Cách ly Đa Người thuê & Zero-Trust' : 'Multi-Tenancy & Zero-Trust'}
                </span>
                <p className="text-muted-foreground mt-0.5 text-[11px]">
                  {locale === 'vi' ? 'Metadata gRPC và cách ly dữ liệu tầng repository.' : 'gRPC metadata propagation and tenant scoping.'}
                </p>
              </div>
            </div>
            <div className="p-3 rounded border border-border/60 bg-muted/20 flex items-start gap-2.5">
              <Layers className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
              <div>
                <span className="font-medium text-foreground">
                  {locale === 'vi' ? 'Chuẩn hóa Thời gian & Múi giờ' : 'Enterprise Time & Timezones'}
                </span>
                <p className="text-muted-foreground mt-0.5 text-[11px]">
                  {locale === 'vi' ? 'Lưu trữ UTC timestamptz và truy vấn nửa mở [from, to).' : 'UTC storage and half-open interval queries.'}
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
        <Link href="/" className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          {locale === 'vi' ? 'Về trang chủ' : 'Home'}
        </Link>
        <Link href="/api-reference" className="text-primary hover:underline inline-flex items-center gap-1">
          {locale === 'vi' ? 'Xem tiếp: Cổng API & Chính sách' : 'Next: API Gateway & Policies'}
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
