'use client';

import React from 'react';
import Link from 'next/link';
import {
  FileCode2,
  ArrowLeft,
  ShieldCheck,
  RefreshCw,
  Layers,
  AlertTriangle,
  Lock,
  CheckCircle2,
  Copy,
  Check,
} from 'lucide-react';
import { usePortalI18n } from '@/components/provider';

export default function GuidelinesPage() {
  const { locale } = usePortalI18n();
  const isVi = locale === 'vi';
  const [copiedSnippet, setCopiedSnippet] = React.useState(false);

  const copyEnvelope = () => {
    const text = `{
  "type": "https://docs.arda.io.vn/problems/auth.error.unauthorized/",
  "title": "Unauthorized Request",
  "status": 401,
  "code": "auth.error.unauthorized",
  "message": "Bearer token is missing or has expired",
  "instance": "/v1/finance/accounts/ACC-1001",
  "timestamp": "2026-09-10T08:00:00Z",
  "request_id": "req_88f912a7d4c",
  "trace_id": "trc_4b9a110ef"
}`;
    navigator.clipboard.writeText(text);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

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
            RFC 7807 • REST CONTRACT
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          {isVi ? 'Quy chuẩn Kỹ thuật & Chuẩn hóa Lỗi' : 'Engineering & Error Handling Guidelines'}
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {isVi
            ? 'Bộ quy chuẩn bắt buộc áp dụng xuyên suốt 11 microservices backend, Gateway Ingress và ứng dụng frontend trong hệ sinh thái Arda Core Banking.'
            : 'Mandatory engineering contracts, error schemas, and retry semantics across all 11 microservices and frontend clients.'}
        </p>
      </div>

      {/* Principle 1: RFC 7807 Standard Envelope */}
      <section className="space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
            1
          </div>
          <h2 className="text-lg font-bold text-foreground">
            {isVi ? 'Quy chuẩn Cấu trúc Lỗi RFC 7807' : 'RFC 7807 Standard Error Envelope'}
          </h2>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed">
          {isVi
            ? 'Mọi phản hồi lỗi HTTP 4xx và 5xx từ API Gateway hoặc microservice đều BẮT BUỘC trả về Content-Type `application/problem+json` và tuân thủ chặt chẽ định dạng bao đóng 10 trường dữ liệu:'
            : 'All HTTP 4xx and 5xx responses must return Content-Type `application/problem+json` adhering strictly to the RFC 7807 envelope schema:'}
        </p>

        {/* Code Box */}
        <div className="rounded-xl bg-[#0c111c] border border-[#1e293b] text-[#e3e8ee] overflow-hidden shadow-sm">
          <div className="flex items-center justify-between px-3.5 py-2 bg-[#0e1726] border-b border-[#1e293b] text-xs font-mono">
            <span className="text-[#87909f]">application/problem+json</span>
            <button
              type="button"
              onClick={copyEnvelope}
              className="inline-flex items-center gap-1 text-[#87909f] hover:text-white transition-colors cursor-pointer"
            >
              {copiedSnippet ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSnippet ? (isVi ? 'Đã chép' : 'Copied') : (isVi ? 'Chép JSON' : 'Copy JSON')}</span>
            </button>
          </div>
          <pre className="p-4 text-xs font-mono leading-relaxed overflow-x-auto text-[#cbd5e1]">
{`{
  "type": "https://docs.arda.io.vn/problems/auth.error.unauthorized/",
  "title": "Unauthorized Request",
  "status": 401,
  "code": "auth.error.unauthorized",
  "message": "Bearer token is missing or has expired",
  "instance": "/v1/finance/accounts/ACC-1001",
  "timestamp": "2026-09-10T08:00:00Z",
  "request_id": "req_88f912a7d4c",
  "trace_id": "trc_4b9a110ef"
}`}
          </pre>
        </div>

        {/* Schema requirements checklist */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
          <div className="p-3 rounded-lg border border-border bg-card space-y-1">
            <div className="font-semibold text-foreground flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>{isVi ? 'type (Canonical URL)' : 'type (Canonical URL)'}</span>
            </div>
            <p className="text-muted-foreground">
              {isVi
                ? 'Bắt buộc là URL tuyệt đối có trailing slash, trỏ thẳng về trang tài liệu phân giải của mã lỗi.'
                : 'Must be an absolute URL with trailing slash pointing directly to the problem docs page.'}
            </p>
          </div>

          <div className="p-3 rounded-lg border border-border bg-card space-y-1">
            <div className="font-semibold text-foreground flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>{isVi ? 'request_id & trace_id' : 'request_id & trace_id'}</span>
            </div>
            <p className="text-muted-foreground">
              {isVi
                ? 'Được Gateway gán xuyên suốt chuỗi microservice nhằm đối soát và truy vết phân tán trong OpenTelemetry.'
                : 'Assigned by Auth Gateway and propagated across services for OpenTelemetry distributed tracing.'}
            </p>
          </div>
        </div>
      </section>

      {/* Principle 2: Code Naming Conventions */}
      <section className="space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
            2
          </div>
          <h2 className="text-lg font-bold text-foreground">
            {isVi ? 'Quy tắc Đặt Mã Lỗi (Code Naming Hierarchy)' : 'Problem Code Hierarchy & Naming'}
          </h2>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed">
          {isVi
            ? 'Mọi mã lỗi được phân cấp theo cú pháp dấu chấm cố định: `<domain>.<subdomain>.<specific_error>`. Toàn bộ ký tự viết thường, dùng dấu gạch dưới `_` cho từ ghép.'
            : 'All problem codes follow a dot-delimited hierarchy: `<domain>.<subdomain>.<specific_error>`, written strictly in snake_case lowercase.'}
        </p>

        <div className="p-4 rounded-xl border border-border bg-card space-y-3 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="space-y-1">
              <div className="font-mono font-bold text-primary">auth.*</div>
              <p className="text-muted-foreground">
                {isVi ? 'Xác thực, phân quyền, phiên làm việc IAM, CSRF.' : 'Authentication, RBAC permissions, IAM sessions, CSRF tokens.'}
              </p>
            </div>
            <div className="space-y-1">
              <div className="font-mono font-bold text-emerald-600 dark:text-emerald-400">finance.*</div>
              <p className="text-muted-foreground">
                {isVi ? 'Tài khoản, số dư sổ cái, khóa sổ EOD, bút toán đối soát.' : 'Ledger accounts, balance invariants, EOD cutoffs, reconciliations.'}
              </p>
            </div>
            <div className="space-y-1">
              <div className="font-mono font-bold text-blue-600 dark:text-blue-400">ai.* / workflow.*</div>
              <p className="text-muted-foreground">
                {isVi ? 'Hạn ngạch mô hình LLM, chạy quy trình Zeebe Sagas, timeout.' : 'LLM quota thresholds, Zeebe process instances, task timeouts.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Principle 3: Retry Policy Semantics */}
      <section className="space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
            3
          </div>
          <h2 className="text-lg font-bold text-foreground">
            {isVi ? 'Quy định về Cơ chế Thử lại (Retry Policies)' : 'Client Retry Policies & Semantics'}
          </h2>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed">
          {isVi
            ? 'Mỗi mã lỗi trong catalog đều gắn liền với một chính sách thử lại bắt buộc. Frontend và SDK client KHÔNG ĐƯỢC tự ý retry nếu vi phạm quy định sau:'
            : 'Every problem definition has an explicit retry policy. Clients and SDKs must strictly honor these semantics:'}
        </p>

        <div className="space-y-2.5 text-xs">
          <div className="p-3.5 rounded-xl border border-amber-500/20 bg-amber-500/5 space-y-1">
            <div className="font-bold text-amber-700 dark:text-amber-400 flex items-center gap-2">
              <span className="font-mono">NON_RETRYABLE</span>
              <span>•</span>
              <span>{isVi ? 'Không Thử lại' : 'Do Not Retry'}</span>
            </div>
            <p className="text-muted-foreground">
              {isVi
                ? 'Lỗi do tham số sai (400), vi phạm nghiệp vụ hoặc thiếu quyền. Thử lại với cùng dữ liệu sẽ luôn luôn thất bại.'
                : 'Validation or business logic failure. Retrying with identical payload is guaranteed to fail.'}
            </p>
          </div>

          <div className="p-3.5 rounded-xl border border-red-500/20 bg-red-500/5 space-y-1">
            <div className="font-bold text-red-700 dark:text-red-400 flex items-center gap-2">
              <span className="font-mono">REQUIRES_REAUTH</span>
              <span>•</span>
              <span>{isVi ? 'Yêu cầu Tái xác thực' : 'Requires Re-Authentication'}</span>
            </div>
            <p className="text-muted-foreground">
              {isVi
                ? 'Phiên đăng nhập hoặc token đã mất hiệu lực (401). Phải refresh token hoặc điều hướng đăng nhập trước khi gọi lại API.'
                : 'Session expired or invalidated. Client must refresh tokens or re-authenticate before resending.'}
            </p>
          </div>

          <div className="p-3.5 rounded-xl border border-primary/20 bg-primary/5 space-y-1">
            <div className="font-bold text-primary flex items-center gap-2">
              <span className="font-mono">EXPONENTIAL_BACKOFF</span>
              <span>•</span>
              <span>{isVi ? 'Giãn cách Hàm mũ' : 'Exponential Backoff'}</span>
            </div>
            <p className="text-muted-foreground">
              {isVi
                ? 'Quá tải hoặc chạm trần Rate Limit (429). Client phải chờ khoảng thời gian tăng dần và tuân thủ header `Retry-After`.'
                : 'Rate limit or resource throttle. Wait for exponentially increasing delays and observe Retry-After headers.'}
            </p>
          </div>
        </div>
      </section>

      {/* Principle 4: Gateway Authorization Policy */}
      <section className="space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
            4
          </div>
          <h2 className="text-lg font-bold text-foreground">
            {isVi ? 'Phân tầng Rủi ro Cổng Gateway (Risk Tiers)' : 'Gateway Risk Tiers & Authorization'}
          </h2>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed">
          {isVi
            ? 'Theo nguyên tắc kiến trúc Arda, các microservice nội bộ không tự kiểm tra phân quyền. Toàn bộ chính sách truy cập được khai báo tập trung tại `apps/auth-gateway/configs/policy.yaml` theo 4 cấp độ:'
            : 'Internal services delegate all authorization checks to Auth Gateway. All routes are declaratively protected under 4 tiers in policy.yaml:'}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-lg border border-border bg-card space-y-1">
            <div className="font-mono font-bold text-emerald-600 dark:text-emerald-400">1. public</div>
            <p className="text-muted-foreground">
              {isVi ? 'Endpoint công khai không cần phiên đăng nhập (Health check, Login, OAuth callback).' : 'Unauthenticated public endpoints (Health, Login, OAuth callback).'}
            </p>
          </div>

          <div className="p-3 rounded-lg border border-border bg-card space-y-1">
            <div className="font-mono font-bold text-blue-600 dark:text-blue-400">2. read_only</div>
            <p className="text-muted-foreground">
              {isVi ? 'Yêu cầu phiên hợp lệ, chỉ đọc dữ liệu, không làm thay đổi trạng thái sổ cái.' : 'Requires authenticated session, read-only queries, no state changes.'}
            </p>
          </div>

          <div className="p-3 rounded-lg border border-border bg-card space-y-1">
            <div className="font-mono font-bold text-amber-600 dark:text-amber-400">3. standard_write</div>
            <p className="text-muted-foreground">
              {isVi ? 'Thao tác ghi dữ liệu thông thường, yêu cầu kiểm tra RBAC permission tương ứng.' : 'Standard state-mutating requests guarded by verified RBAC permissions.'}
            </p>
          </div>

          <div className="p-3 rounded-lg border border-border bg-card space-y-1">
            <div className="font-mono font-bold text-red-600 dark:text-red-400">4. high_risk</div>
            <p className="text-muted-foreground">
              {isVi ? 'Giao dịch chuyển tiền lớn, phê duyệt tín dụng, chạy EOD — bắt buộc kiểm tra Step-Up 2FA hoặc Dual Control.' : 'High-value transfers, loan approvals, EOD cutoff — requires 2FA step-up or dual-control authorization.'}
            </p>
          </div>
        </div>
      </section>

      {/* Link to catalog */}
      <div className="pt-6 border-t border-border flex items-center justify-between">
        <Link
          href="/problems/auth.error.unauthorized/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium text-xs hover:bg-primary/90 transition-colors shadow-2xs"
        >
          <span>{isVi ? 'Tra cứu 152 Mã Lỗi trong Catalog' : 'Explore 152 Problem Catalog Codes'}</span>
        </Link>
        <Link
          href="/architecture"
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          {isVi ? 'Xem Kiến trúc Hệ thống →' : 'View System Architecture →'}
        </Link>
      </div>
    </div>
  );
}
