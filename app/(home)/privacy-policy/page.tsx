'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Lock, ShieldCheck, EyeOff, Database } from 'lucide-react';
import { usePortalI18n } from '@/components/provider';

export default function PrivacyPolicyPage() {
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
          <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-muted text-muted-foreground border border-border">
            LEGAL • PRIVACY POLICY
          </span>
          <span className="text-xs text-muted-foreground">
            {isVi ? 'Hiệu lực: 2026' : 'Effective: 2026'}
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          {isVi ? 'Chính sách Quyền riêng tư & Bảo vệ Dữ liệu' : 'Privacy & Data Protection Policy'}
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {isVi
            ? 'Các nguyên tắc bảo vệ quyền riêng tư, phân tách dữ liệu đa người thuê (multi-tenant) và an toàn thông tin tại Arda Core Banking.'
            : 'Data protection principles, multi-tenant isolation, and telemetry privacy commitments across Arda systems.'}
        </p>
      </div>

      {/* Content sections */}
      <div className="space-y-8 text-sm">
        {/* Section 1 */}
        <section className="space-y-3">
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-muted border border-border">01</span>
            <span>{isVi ? 'Cô lập Dữ liệu Đa người thuê (Multi-Tenancy Isolation)' : 'Multi-Tenant Data Boundaries'}</span>
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {isVi
              ? 'Arda vận hành theo mô hình Multi-Tenant nghiêm ngặt. Dữ liệu của từng tổ chức tài chính được phân tách hoàn toàn ở tầng cơ sở dữ liệu và qua middleware bảo mật. Tuyệt đối không có cơ chế rò rỉ dữ liệu chéo giữa các tenant, mọi truy vấn bắt buộc có ngữ cảnh `tenant_id` hợp lệ.'
              : 'Arda operates on strict multi-tenant boundaries. Data belonging to distinct financial organizations is logically isolated at the database level. Queries without verified tenant context are rejected unconditionally.'}
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-3">
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-muted border border-border">02</span>
            <span>{isVi ? 'Bảo vệ Dữ liệu Định danh (No PII in Error Telemetry)' : 'No Personally Identifiable Information (PII)'}</span>
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {isVi
              ? 'Theo quy chuẩn RFC 7807 của nền tảng, các gói tin phản hồi lỗi và nhật ký hệ thống KHÔNG ĐƯỢC CHỨA thông tin định danh cá nhân nhạy cảm (PII), mật khẩu, số thẻ thanh toán hoặc số dư chi tiết. Các trường lỗi chỉ chứa thông tin chẩn đoán kỹ thuật, mã lỗi, thời gian và ID truy vết (`request_id`, `trace_id`).'
              : 'RFC 7807 problem payloads and error telemetry strictly omit sensitive PII, plaintext passwords, payment card numbers, or proprietary ledger values. Only technical diagnostics, canonical codes, and correlation IDs are emitted.'}
          </p>
        </section>

        {/* Section 3 */}
        <section className="space-y-3">
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-muted border border-border">03</span>
            <span>{isVi ? 'Nhật ký Kiểm toán Bất biến (Immutable Audit Logs)' : 'Immutable Banking Audit Logs'}</span>
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {isVi
              ? 'Mọi hành động quan trọng (đăng nhập, thay đổi hạn mức, phân quyền IAM, phê duyệt tín dụng, chạy chu trình EOD) đều được ghi nhận vào bảng audit log bất biến (append-only) phục vụ mục đích tuân thủ quy chế tài chính và kiểm toán an toàn.'
              : 'All security-critical actions (sessions, permission grants, loan approvals, EOD executions) are recorded in append-only audit stores for banking regulatory compliance.'}
          </p>
        </section>

        {/* Section 4 */}
        <section className="space-y-3">
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-muted border border-border">04</span>
            <span>{isVi ? 'Lưu trữ Cục bộ trên Trình duyệt (Local Storage)' : 'Local Storage & Browser Persistence'}</span>
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {isVi
              ? 'Cổng tài liệu Arda Docs chỉ sử dụng `localStorage` của trình duyệt để ghi nhớ tùy chọn giao diện của bạn: ngôn ngữ hiển thị (`arda_docs_locale`), theme sáng/tối (`arda_docs_theme`), và tab ngôn ngữ lập trình ưa thích (`arda_docs_lang`). Chúng tôi không theo dõi cookies của bên thứ ba.'
              : 'Arda Docs utilizes client-side localStorage solely to retain display preferences: locale (arda_docs_locale), color theme (arda_docs_theme), and code snippet language (arda_docs_lang). No third-party tracking cookies are deployed.'}
          </p>
        </section>
      </div>

      {/* Navigation Links */}
      <div className="pt-6 border-t border-border flex items-center justify-between">
        <Link
          href="/terms-of-service"
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          {isVi ? '← Điều khoản Dịch vụ' : '← Terms of Service'}
        </Link>
        <Link
          href="/guidelines"
          className="text-xs font-semibold text-primary hover:underline"
        >
          {isVi ? 'Quy chuẩn Kỹ thuật →' : 'Engineering Guidelines →'}
        </Link>
      </div>
    </div>
  );
}
