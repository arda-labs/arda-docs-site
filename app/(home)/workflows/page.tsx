'use client';

import React from 'react';
import Link from 'next/link';
import { Workflow, ArrowLeft, ArrowRight, Clock, Activity, Layers, CheckCircle2 } from 'lucide-react';
import { usePortalI18n } from '@/components/provider';
import { LanguageSwitcher } from '@/components/language-switcher';

export default function WorkflowsPage() {
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
            {locale === 'vi' ? 'Quy trình Nghiệp vụ & Vận hành' : 'Banking Workflows & Operations'}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {locale === 'vi'
              ? 'Vòng đời xử lý tác vụ ngân hàng, khóa sổ cuối ngày (COB) và kiểm thử tải hiệu năng.'
              : 'End-to-end banking lifecycles, End of Day (COB) batch sequences, and load test runbooks.'}
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
              {locale === 'vi' ? 'Tài liệu Quy trình Vận hành đang được tổng hợp' : 'Workflows & Runbooks Documentation Under Consolidation'}
            </h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {locale === 'vi'
                ? 'Đặc tả các quy trình nghiệp vụ chạy dài trên Camunda Zeebe, chu trình khóa sổ cuối ngày (COB), và kịch bản kiểm thử tải k6 đang được tổng hợp từ arda-be, arda-mfe và arda-perf. Nội dung sẽ được công bố đầy đủ trong các bản cập nhật sắp tới.'
                : 'Long-running banking workflows orchestrated by Camunda Zeebe, End of Day (COB) batch sequences, and k6 load-test runbooks are currently being synthesized from arda-be, arda-mfe, and arda-perf.'}
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
              <Workflow className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <div>
                <span className="font-medium text-foreground">
                  {locale === 'vi' ? 'Vòng đời Khởi tạo Khoản vay (Loan Formation)' : 'Loan Formation Lifecycle'}
                </span>
                <p className="text-muted-foreground mt-0.5 text-[11px]">
                  {locale === 'vi' ? 'Mô hình Maker-Checker đa cấp thẩm định và giải ngân.' : 'Multi-tier Maker-Checker appraisal and disbursement.'}
                </p>
              </div>
            </div>
            <div className="p-3 rounded border border-border/60 bg-muted/20 flex items-start gap-2.5">
              <Activity className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
              <div>
                <span className="font-medium text-foreground">
                  {locale === 'vi' ? 'Khóa sổ Cuối ngày (End of Day / COB)' : 'End of Day (COB) Batches'}
                </span>
                <p className="text-muted-foreground mt-0.5 text-[11px]">
                  {locale === 'vi' ? 'Đóng băng cutoff, dồn tích lãi và chốt số dư GL.' : 'Cutoff freeze, interest accrual, and GL balance close.'}
                </p>
              </div>
            </div>
            <div className="p-3 rounded border border-border/60 bg-muted/20 flex items-start gap-2.5">
              <Layers className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
              <div>
                <span className="font-medium text-foreground">
                  {locale === 'vi' ? 'Kiểm thử Tải & Hiệu năng (k6)' : 'Performance & Load Testing (k6)'}
                </span>
                <p className="text-muted-foreground mt-0.5 text-[11px]">
                  {locale === 'vi' ? 'Kịch bản constant-arrival-rate 800 req/s trong arda-perf.' : 'Constant-arrival-rate 800 req/s benchmark suites.'}
                </p>
              </div>
            </div>
            <div className="p-3 rounded border border-border/60 bg-muted/20 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
              <div>
                <span className="font-medium text-foreground">
                  {locale === 'vi' ? 'Chiếu tác vụ Người dùng (Work-Item Projection)' : 'Work-Item Projection'}
                </span>
                <p className="text-muted-foreground mt-0.5 text-[11px]">
                  {locale === 'vi' ? 'Chiếu tác vụ Zeebe vào PostgreSQL để FE truy vấn tức thì.' : 'Zeebe task projection into Postgres for low-latency workbench.'}
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
        <Link href="/api-reference" className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          {locale === 'vi' ? 'Xem lại: Cổng API' : 'Previous: API Gateway'}
        </Link>
        <Link href="/problems/auth.error.unauthorized/" className="text-primary hover:underline inline-flex items-center gap-1">
          {locale === 'vi' ? 'Đến: Danh mục Lỗi (152)' : 'Go to: Problem Catalog (152)'}
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
