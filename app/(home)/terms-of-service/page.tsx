'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield, AlertCircle, RefreshCw, FileText } from 'lucide-react';
import { usePortalI18n } from '@/components/provider';

export default function TermsOfServicePage() {
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
            LEGAL • TERMS OF SERVICE
          </span>
          <span className="text-xs text-muted-foreground">
            {isVi ? 'Hiệu lực: 2026' : 'Effective: 2026'}
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          {isVi ? 'Điều khoản Dịch vụ Nền tảng' : 'Platform Terms of Service'}
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {isVi
            ? 'Các quy định chi phối việc truy cập, tích hợp API, sử dụng tài nguyên và khai thác tài liệu trên nền tảng Arda Core Banking.'
            : 'Terms governing the access, API integration, resource usage, and documentation retrieval across the Arda Core Banking platform.'}
        </p>
      </div>

      {/* Content sections */}
      <div className="space-y-8 text-sm">
        {/* Section 1 */}
        <section className="space-y-3">
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-muted border border-border">01</span>
            <span>{isVi ? 'Quyền Truy cập & Tích hợp API' : 'API Access & Integration'}</span>
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {isVi
              ? 'Mọi yêu cầu gọi đến API Gateway (`https://api.arda.io.vn` hoặc `http://localhost:8082` trong môi trường phát triển) phải thông qua định danh hợp lệ, bao gồm tenant_id và Bearer token. Nghiêm cấm mọi hành vi can thiệp vào token định danh, vượt rào xác thực hoặc mạo danh người dùng khác.'
              : 'All API requests targeting the Auth Gateway must carry verified authentication credentials, including tenant context and Bearer session tokens. Bypassing authentication, token forgery, or tenant impersonation is strictly prohibited.'}
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-3">
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-muted border border-border">02</span>
            <span>{isVi ? 'Chính sách Rate Limiting & Thử lại' : 'Rate Limiting & Fair Use'}</span>
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {isVi
              ? 'Để bảo đảm tính sẵn sàng của hệ thống ngân hàng lõi, Auth Gateway áp dụng giới hạn tần suất (Rate Limiting) theo từng tenant và client IP. Khi nhận phản hồi HTTP 429 (Too Many Requests), caller bắt buộc phải tuân thủ chính sách giãn cách hàm mũ (Exponential Backoff) và header `Retry-After`. Không được gửi lặp request không có độ trễ.'
              : 'To preserve system resilience, Auth Gateway enforces rate limits by tenant and client IP. When encountering HTTP 429, callers must observe exponential backoff and the Retry-After response header. Unconstrained rapid polling is considered abusive.'}
          </p>
        </section>

        {/* Section 3 */}
        <section className="space-y-3">
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-muted border border-border">03</span>
            <span>{isVi ? 'Tính Toàn vẹn Giao dịch & Bất biến Sổ cái' : 'Ledger Invariants & Transaction Safety'}</span>
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {isVi
              ? 'Các giao dịch thay đổi số dư, phong tỏa tài khoản hoặc duyệt khoản vay được bảo vệ bởi bất biến nghiệp vụ. Hệ thống sẽ từ chối và phát sinh mã lỗi RFC 7807 tương ứng (ví dụ: `finance.error.insufficient_funds`) đối với các hành động vi phạm toàn vẹn dữ liệu.'
              : 'State-mutating transactions, balance reservations, and loan fundings are guarded by database invariants. Requests violating financial integrity are automatically rejected with RFC 7807 problem envelopes.'}
          </p>
        </section>

        {/* Section 4 */}
        <section className="space-y-3">
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-muted border border-border">04</span>
            <span>{isVi ? 'Khai thác Tài liệu & Mã Nguồn' : 'Documentation & Code Artifacts'}</span>
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {isVi
              ? 'Tài liệu Problem Catalog, quy chuẩn kỹ thuật và mã mẫu (cURL, Go, TypeScript) được cung cấp theo nguyên trạng phục vụ các nhà phát triển tích hợp với nền tảng Arda. API tra cứu `/api/lookup` được mở CORS * cho phép tích hợp tự do vào công cụ CLI và AI agents.'
              : 'Problem Catalog specifications, SDK snippets, and technical schemas are provided as-is for developer integration. The machine lookup API (/api/lookup) is open via CORS * for CLI tooling and automated agent workflows.'}
          </p>
        </section>
      </div>

      {/* Navigation Links */}
      <div className="pt-6 border-t border-border flex items-center justify-between">
        <Link
          href="/privacy-policy"
          className="text-xs font-semibold text-primary hover:underline"
        >
          {isVi ? 'Xem Chính sách Quyền riêng tư →' : 'View Privacy Policy →'}
        </Link>
        <Link
          href="/"
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          {isVi ? 'Trang chủ' : 'Home'}
        </Link>
      </div>
    </div>
  );
}
