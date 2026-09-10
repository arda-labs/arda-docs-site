'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Terminal,
  Database,
  ShieldCheck,
  Workflow,
  ArrowRight,
  Code2,
  Copy,
  Check,
  Search,
  ExternalLink,
  Layers,
  Sparkles,
} from 'lucide-react';
import { usePortalI18n } from './provider';

interface HomeCatalogProps {
  onOpenSearch?: () => void;
}

export function HomeCatalog({ onOpenSearch }: HomeCatalogProps) {
  const { locale } = usePortalI18n();
  const [copied, setCopied] = useState(false);

  const copyCurl = () => {
    navigator.clipboard.writeText('curl -s "https://docs.arda.io.vn/api/lookup?code=auth.error.unauthorized"');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isVi = locale === 'vi';

  const POPULAR_CODES = [
    { code: 'auth.error.unauthorized', status: 401, title: 'Unauthorized Session' },
    { code: 'iam.error.forbidden', status: 403, title: 'Forbidden Access' },
    { code: 'validation.error.invalid_payload', status: 400, title: 'Invalid Payload' },
    { code: 'tenant_context_unavailable', status: 400, title: 'Tenant Context Required' },
    { code: 'gateway.error.rate_limited', status: 429, title: 'Rate Limited' },
    { code: 'ai.model_unavailable', status: 503, title: 'Model Unavailable' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-14">
      {/* HERO SECTION - STRIPE STYLE */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
          <span>{isVi ? 'Tài liệu Kỹ thuật Arda Core Banking' : 'Arda Core Banking Documentation'}</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground">
          {isVi ? 'Tài liệu Nền tảng Arda' : 'Arda Documentation'}
        </h1>

        <p className="text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed">
          {isVi
            ? 'Khám phá kiến trúc hệ thống, hướng dẫn tích hợp cổng API, danh mục mã lỗi chuẩn RFC 7807 và quy trình nghiệp vụ ngân hàng lõi.'
            : 'Explore our guides, architecture specifications, API gateway policies, and standardized RFC 7807 problem diagnostics.'}
        </p>

        {/* Hero Search Bar */}
        {onOpenSearch && (
          <div className="pt-2 max-w-xl">
            <button
              type="button"
              onClick={onOpenSearch}
              className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-card hover:bg-muted/50 text-muted-foreground border border-border hover:border-primary/50 text-sm transition-all shadow-2xs cursor-pointer group"
            >
              <div className="flex items-center gap-2.5 truncate">
                <Search className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                <span className="text-muted-foreground group-hover:text-foreground transition-colors">
                  {isVi ? 'Tìm kiếm trong 152 mã lỗi, endpoints, kiến trúc...' : 'Search 152 error codes, endpoints, architecture...'}
                </span>
              </div>
              <kbd className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-mono bg-muted text-muted-foreground rounded border border-border">
                ⌘K
              </kbd>
            </button>
          </div>
        )}
      </div>

      {/* CORE MODULES GRID - STRIPE STYLE */}
      <div className="space-y-4">
        <div className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
          {isVi ? 'CHUYÊN MỤC TÀI LIỆU' : 'CORE DOCUMENTATION MODULES'}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Card 1: Problem Catalog */}
          <Link
            href="/problems/auth.error.unauthorized/"
            className="p-6 rounded-xl border border-border bg-card hover:border-primary/50 hover:shadow-md transition-all flex flex-col justify-between group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <Terminal className="w-5 h-5" />
                </div>
                <span className="text-[10.5px] font-bold font-mono px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                  152 CODES • RFC 7807
                </span>
              </div>

              <h2 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                {isVi ? 'Danh mục Mã lỗi RFC 7807' : 'RFC 7807 Problem Catalog'}
              </h2>

              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {isVi
                  ? 'Thư mục 152 mã lỗi chuẩn máy đọc, cẩm nang khắc phục cho Client & SRE, và API tra cứu tự động.'
                  : '152 standardized machine-readable problem specifications with remediation guides and live /api/lookup.'}
              </p>
            </div>

            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary mt-5 group-hover:translate-x-1 transition-transform">
              <span>{isVi ? 'Khám phá danh mục mã lỗi' : 'Explore problem catalog'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          {/* Card 2: Guidelines */}
          <Link
            href="/guidelines"
            className="p-6 rounded-xl border border-border bg-card hover:border-purple-500/50 hover:shadow-md transition-all flex flex-col justify-between group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                  <Code2 className="w-5 h-5" />
                </div>
                <span className="text-[10.5px] font-bold font-mono px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                  STANDARDS • INVARIANTS
                </span>
              </div>

              <h2 className="text-base font-bold text-foreground group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                {isVi ? 'Quy chuẩn Kỹ thuật & Thiết kế' : 'Engineering Guidelines'}
              </h2>

              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {isVi
                  ? 'Quy chuẩn bao đóng RFC 7807, cú pháp phân cấp mã lỗi, cơ chế thử lại Retry Policies và 4 tầng rủi ro Gateway.'
                  : 'RFC 7807 envelope rules, hierarchical code conventions, client retry semantics, and Gateway risk tiers.'}
              </p>
            </div>

            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-600 dark:text-purple-400 mt-5 group-hover:translate-x-1 transition-transform">
              <span>{isVi ? 'Xem quy chuẩn kỹ thuật' : 'View engineering guidelines'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          {/* Card 3: Architecture */}
          <Link
            href="/architecture"
            className="p-6 rounded-xl border border-border bg-card hover:border-emerald-500/50 hover:shadow-md transition-all flex flex-col justify-between group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Database className="w-5 h-5" />
                </div>
                <span className="text-[10.5px] font-bold font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  SYSTEM DESIGN
                </span>
              </div>

              <h2 className="text-base font-bold text-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                {isVi ? 'Kiến trúc Core Banking' : 'Core Banking Architecture'}
              </h2>

              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {isVi
                  ? 'Quy tắc hạch toán kép General Ledger, bất biến cân bằng Nợ = Có, hệ thống phân tán Zeebe và cách ly đa tổ chức.'
                  : 'Double-entry GL posting rules, Debit = Credit invariants, Zeebe distributed sagas, and tenant isolation.'}
              </p>
            </div>

            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-5 group-hover:translate-x-1 transition-transform">
              <span>{isVi ? 'Xem đặc tả kiến trúc' : 'View architecture specs'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          {/* Card 4: API Gateway */}
          <Link
            href="/api-reference"
            className="p-6 rounded-xl border border-border bg-card hover:border-blue-500/50 hover:shadow-md transition-all flex flex-col justify-between group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <span className="text-[10.5px] font-bold font-mono px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                  OPENAPI 3.1 • BFF
                </span>
              </div>

              <h2 className="text-base font-bold text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {isVi ? 'Cổng API & Phân quyền Ingress' : 'API Gateway & Policies'}
              </h2>

              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {isVi
                  ? 'Mô hình Ingress Auth Gateway (cổng 8082), khai báo phân quyền tập trung tại policy.yaml và các tiêu đề chuẩn.'
                  : 'Single ingress Auth Gateway on port 8082, declarative route authorization in policy.yaml, and standard headers.'}
              </p>
            </div>

            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 mt-5 group-hover:translate-x-1 transition-transform">
              <span>{isVi ? 'Xem tài liệu cổng API' : 'View API reference'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          {/* Card 5: Workflows */}
          <Link
            href="/workflows"
            className="p-6 rounded-xl border border-border bg-card hover:border-amber-500/50 hover:shadow-md transition-all flex flex-col justify-between group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <Workflow className="w-5 h-5" />
                </div>
                <span className="text-[10.5px] font-bold font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                  RUNBOOKS • ZEEBE
                </span>
              </div>

              <h2 className="text-base font-bold text-foreground group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                {isVi ? 'Quy trình Nghiệp vụ & Sagas' : 'Banking Workflows & Sagas'}
              </h2>

              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {isVi
                  ? 'Vòng đời khởi tạo tín dụng qua các cấp phê duyệt, chu trình khóa sổ cuối ngày (EOD) tự động và k6 benchmarking.'
                  : 'Tiered loan formation lifecycle, automated End of Day (EOD) cutoff batches, and constant-arrival k6 benchmarking.'}
              </p>
            </div>

            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400 mt-5 group-hover:translate-x-1 transition-transform">
              <span>{isVi ? 'Xem các quy trình vận hành' : 'View workflow runbooks'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          {/* Card 6: Platform Profile & Governance */}
          <Link
            href="/about"
            className="p-6 rounded-xl border border-border bg-card hover:border-teal-500/50 hover:shadow-md transition-all flex flex-col justify-between group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                  <Layers className="w-5 h-5" />
                </div>
                <span className="text-[10.5px] font-bold font-mono px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20">
                  PLATFORM • 11 SERVICES
                </span>
              </div>

              <h2 className="text-base font-bold text-foreground group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                {isVi ? 'Giới thiệu về Nền tảng Arda' : 'About Arda Core Banking'}
              </h2>

              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {isVi
                  ? 'Hệ sinh thái 11 Go microservices, kiến trúc frontend Module Federation (Bun + Vite) và cụm hạ tầng K3s GitOps.'
                  : 'Ecosystem of 11 Go microservices, Bun + Vite Module Federation, and self-hosted K3s GitOps cluster.'}
              </p>
            </div>

            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-600 dark:text-teal-400 mt-5 group-hover:translate-x-1 transition-transform">
              <span>{isVi ? 'Tìm hiểu về nền tảng' : 'Learn about the platform'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>
        </div>
      </div>

      {/* POPULAR CODES CHIPS */}
      <div className="space-y-3">
        <div className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
          {isVi ? 'MÃ LỖI THƯỜNG GẶP' : 'COMMON ERROR CODES'}
        </div>

        <div className="flex flex-wrap gap-2.5">
          {POPULAR_CODES.map((item) => (
            <Link
              key={item.code}
              href={`/problems/${item.code}/`}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-card hover:border-primary/50 hover:bg-muted/50 text-xs transition-colors shadow-2xs group"
            >
              <span
                className={`font-mono font-bold text-[10px] px-1.5 py-0.5 rounded border ${
                  item.status >= 500
                    ? 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20'
                    : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                }`}
              >
                {item.status}
              </span>
              <span className="font-mono text-foreground font-medium group-hover:text-primary transition-colors">
                {item.code}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* DEVELOPER QUICK REFERENCE */}
      <div className="rounded-xl border border-border bg-card p-6 space-y-4 shadow-2xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-mono text-xs font-bold text-foreground">
            <Code2 className="w-4 h-4 text-primary" />
            <span>{isVi ? 'THAM CHIẾU MÔI TRƯỜNG & CỔNG API' : 'GATEWAY & ENVIRONMENT REFERENCE'}</span>
          </div>
          <span className="text-[11px] font-mono text-muted-foreground">Port 8082</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-muted/40 border border-border hover:border-border/80 transition-colors">
            <div className="text-[11px] text-muted-foreground">Production Ingress</div>
            <div className="font-mono font-bold text-foreground mt-0.5 truncate">https://api.arda.io.vn</div>
          </div>
          <div className="p-3 rounded-lg bg-muted/40 border border-border hover:border-border/80 transition-colors">
            <div className="text-[11px] text-muted-foreground">Local BFF Gateway</div>
            <div className="font-mono font-bold text-foreground mt-0.5 truncate">http://localhost:8082</div>
          </div>
          <div className="p-3 rounded-lg bg-muted/40 border border-border hover:border-border/80 transition-colors">
            <div className="text-[11px] text-muted-foreground">Microservices Network</div>
            <div className="font-mono font-bold text-foreground mt-0.5 truncate">11 Services (Go + mTLS)</div>
          </div>
        </div>

        {/* Machine lookup curl */}
        <div className="pt-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
            <span>{isVi ? 'Tra cứu lỗi máy đọc tự động (CORS *):' : 'Machine error lookup command (CORS *):'}</span>
            <button
              type="button"
              onClick={copyCurl}
              className="text-primary hover:underline inline-flex items-center gap-1 cursor-pointer font-medium"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? (isVi ? 'Đã sao chép' : 'Copied') : (isVi ? 'Sao chép' : 'Copy cURL')}</span>
            </button>
          </div>
          <div className="p-3 rounded-lg bg-[#0c111c] text-[#e3e8ee] font-mono text-xs overflow-x-auto border border-[#1e293b]">
            curl -s &quot;https://docs.arda.io.vn/api/lookup?code=auth.error.unauthorized&quot;
          </div>
        </div>
      </div>
    </div>
  );
}
