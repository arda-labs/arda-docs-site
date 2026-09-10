'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  Wrench,
  Route,
  RefreshCw,
  Terminal,
  Code2,
  Server,
  Layers,
  ArrowRight,
  Info,
  Smartphone,
} from 'lucide-react';
import { usePortalI18n } from './provider';
import type { ProblemPageData } from '@/lib/catalog';
import { parseAndTransformMarkdoc, renderMarkdocReact } from '@/lib/markdoc';

interface ProblemProseProps {
  problem: ProblemPageData;
}

const RETRY_POLICY_META: Record<
  string,
  { label_vi: string; label_en: string; color: string; desc_vi: string; desc_en: string }
> = {
  NON_RETRYABLE: {
    label_vi: 'Không Thử lại (Non-Retryable)',
    label_en: 'Non-Retryable',
    color: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20',
    desc_vi: 'Yêu cầu không thể thử lại với payload cũ. Caller bắt buộc phải sửa tham số hoặc kiểm tra lại quyền.',
    desc_en: 'Do not retry unchanged. The request failed due to client payload or permission constraints.',
  },
  REQUIRES_REAUTH: {
    label_vi: 'Cần Xác thực lại (Requires Re-Auth)',
    label_en: 'Requires Re-Auth',
    color: 'bg-red-500/10 text-red-700 dark:text-red-300 border-red-500/20',
    desc_vi: 'Token hoặc phiên đăng nhập đã hết hạn. Cần refresh token hoặc redirect đăng nhập lại trước khi thử lại.',
    desc_en: 'Authentication session expired. Caller must refresh session before retrying.',
  },
  RETRY_AFTER_REFRESH: {
    label_vi: 'Tải lại Dữ liệu rồi Retry (Retry After Refresh)',
    label_en: 'Retry After Refresh',
    color: 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20',
    desc_vi: 'Xung đột phiên bản (optimistic lock). Cần GET lại bản ghi mới nhất rồi áp dụng lại thay đổi.',
    desc_en: 'State conflict. Fetch fresh resource state, re-apply changes, and retry.',
  },
  EXPONENTIAL_BACKOFF: {
    label_vi: 'Giãn cách Hàm mũ (Exponential Backoff)',
    label_en: 'Exponential Backoff',
    color: 'bg-primary/10 text-primary border-primary/20',
    desc_vi: 'Chạm giới hạn tần suất (rate limit). Cần chờ theo thời gian tăng dần và tuân thủ header Retry-After.',
    desc_en: 'Rate limited. Retry with exponential backoff and honour the Retry-After header.',
  },
  TRANSIENT_BACKOFF: {
    label_vi: 'Lỗi Tạm thời (Transient Backoff)',
    label_en: 'Transient Backoff',
    color: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20',
    desc_vi: 'Sự cố kết nối upstream tạm thời. Thử lại sau vài giây kèm khoảng trễ ngẫu nhiên (jitter).',
    desc_en: 'Transient upstream issue. Retry a limited number of times with backoff and jitter.',
  },
};

export function ProblemProse({ problem }: ProblemProseProps) {
  const { locale } = usePortalI18n();
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const [activeTab, setActiveTab] = useState<'response' | 'curl' | 'go' | 'typescript' | 'lookup'>('response');

  const is5xx = problem.status >= 500;
  const isVi = locale === 'vi';
  const categoryTitle = isVi
    ? (problem.category_title_vi || problem.category_title)
    : problem.category_title;

  const retryMeta =
    RETRY_POLICY_META[problem.retry_policy] || RETRY_POLICY_META.NON_RETRYABLE;

  // Filter out check-problem-catalog skeleton comments to detect real markdown body
  const cleanBody = (problem.body || '').replace(/<!--[\s\S]*?-->/g, '').trim();
  const hasRealBody = cleanBody.length > 0;
  const markdocContent = hasRealBody ? parseAndTransformMarkdoc(problem.body) : null;

  const copyCode = () => {
    navigator.clipboard.writeText(problem.code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const copyActiveSnippet = () => {
    let text = '';
    if (activeTab === 'response') text = problem.example;
    else if (activeTab === 'curl') text = problem.snippets?.curl?.code || '';
    else if (activeTab === 'go') text = problem.snippets?.go?.code || '';
    else if (activeTab === 'typescript') text = problem.snippets?.typescript?.code || '';
    else if (activeTab === 'lookup') text = `curl -s "https://docs.arda.io.vn/api/lookup?code=${problem.code}"`;

    navigator.clipboard.writeText(text);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  return (
    <article className="w-full max-w-4xl mx-auto px-6 sm:px-10 lg:px-12 py-8 sm:py-10 space-y-8 min-w-0">
      {/* Breadcrumbs Navigation */}
      <nav className="flex items-center gap-1.5 text-[13px] text-muted-foreground flex-wrap">
        <Link href="/" className="hover:text-foreground transition-colors">
          {isVi ? 'Tài liệu' : 'Documentation'}
        </Link>
        <span>/</span>
        <span className="hover:text-foreground transition-colors">{categoryTitle}</span>
        <span>/</span>
        <span className="font-mono text-foreground font-medium">{problem.code}</span>
      </nav>

      {/* Main Header */}
      <header className="space-y-3.5 pb-6 border-b border-border">
        {/* Status Badges & Identifier Row */}
        <div className="flex flex-wrap items-center gap-2">
          {/* HTTP Status Badge */}
          <span
            className={`px-2.5 py-0.5 rounded-md text-xs font-mono font-bold tracking-tight border ${
              is5xx
                ? 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20'
                : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
            }`}
          >
            HTTP {problem.status}
          </span>

          {/* Canonical Code Pill with 1-click Copy */}
          <button
            type="button"
            onClick={copyCode}
            className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-mono bg-primary/10 text-primary border border-primary/20 hover:bg-primary/15 transition-colors cursor-pointer"
            title={isVi ? 'Sao chép mã lỗi' : 'Copy error code'}
          >
            <span className="font-semibold">{problem.code}</span>
            {copiedCode ? (
              <Check className="w-3.5 h-3.5 text-emerald-500" />
            ) : (
              <Copy className="w-3.5 h-3.5 opacity-70" />
            )}
          </button>

          {/* Category Pill */}
          <span className="px-2.5 py-0.5 rounded-md text-xs font-medium bg-muted text-muted-foreground border border-border">
            {categoryTitle}
          </span>

          {/* Retry Policy Pill */}
          <span className={`px-2.5 py-0.5 rounded-md text-xs font-medium border ${retryMeta.color}`}>
            {isVi ? retryMeta.label_vi : retryMeta.label_en}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          {problem.title}
        </h1>

        {/* Summary Description */}
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed pt-0.5">
          {problem.summary}
        </p>
      </header>

      {/* ACTION & REMEDIATION (HƯỚNG DẪN XỬ LÝ THEO VAI TRÒ) */}
      <section className="space-y-4">
        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
          <Wrench className="w-4 h-4 text-primary" />
          <span>{isVi ? 'HƯỚNG DẪN XỬ LÝ & KHẮC PHỤC' : 'REMEDIATION & RECOVERY ACTIONS'}</span>
        </div>

        {/* Dual Action Cards: Client Application vs SRE Platform */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card 1: Client Application */}
          <div className="p-4 sm:p-5 rounded-xl border border-border bg-card space-y-2.5 shadow-2xs hover:border-border/80 transition-colors">
            <div className="flex items-center gap-2 font-semibold text-foreground text-sm">
              <Smartphone className="w-4 h-4 text-blue-500 shrink-0" />
              <span>{isVi ? 'Phía Ứng dụng Client (Frontend / SDK)' : 'Client Application (Frontend / SDK)'}</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {problem.client_action}
            </p>
          </div>

          {/* Card 2: SRE / Platform Operations */}
          <div className="p-4 sm:p-5 rounded-xl border border-border bg-card space-y-2.5 shadow-2xs hover:border-border/80 transition-colors">
            <div className="flex items-center gap-2 font-semibold text-foreground text-sm">
              <Server className="w-4 h-4 text-primary shrink-0" />
              <span>{isVi ? 'Phía Kỹ sư Vận hành & Hệ thống (SRE / DevOps)' : 'SRE & Platform Operations'}</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {problem.operator_action}
            </p>
          </div>
        </div>

        {/* Retry Behavior Notice */}
        <div className={`p-4 sm:p-4.5 rounded-xl border ${retryMeta.color} space-y-1.5`}>
          <div className="font-semibold text-sm flex items-center gap-2">
            <RefreshCw className="w-3.5 h-3.5 shrink-0" />
            <span>{isVi ? 'Quy tắc Thử lại (Retry Policy):' : 'Caller Retry Policy:'}</span>
            <span className="font-mono underline">{isVi ? retryMeta.label_vi : retryMeta.label_en}</span>
          </div>
          <p className="text-sm leading-relaxed opacity-90 pl-6">
            {isVi ? retryMeta.desc_vi : retryMeta.desc_en}
          </p>
        </div>
      </section>

      {/* CODE & RESPONSE INSPECTOR (TÍCH HỢP GỌN GÀNG TRONG FLOW BÀI VIẾT) */}
      <section className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <Code2 className="w-4 h-4 text-primary" />
            <span>{isVi ? 'MẪU PHẢN HỒI LỖI & CÁCH GỌI API' : 'RFC 7807 ERROR RESPONSE & API SNIPPETS'}</span>
          </div>
          <span className="text-[11px] font-mono text-muted-foreground">
            application/problem+json
          </span>
        </div>

        {/* Integrated Code Box */}
        <div className="rounded-xl bg-[#0c111c] border border-[#1e293b] text-[#e3e8ee] overflow-hidden shadow-sm">
          {/* Header Bar: Tabs & Copy Button */}
          <div className="flex items-center justify-between px-3.5 py-2 bg-[#0e1726] border-b border-[#1e293b] gap-2 flex-wrap">
            <div className="flex items-center gap-1 font-mono text-xs overflow-x-auto">
              <button
                type="button"
                onClick={() => setActiveTab('response')}
                className={`px-3 py-1.5 rounded transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'response'
                    ? 'bg-[#212c3f] text-white font-semibold'
                    : 'text-[#87909f] hover:text-white hover:bg-[#1a2538]'
                }`}
              >
                <span>RFC 7807 JSON</span>
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    is5xx ? 'bg-red-400' : 'bg-amber-400'
                  }`}
                />
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('curl')}
                className={`px-3 py-1.5 rounded transition-colors cursor-pointer ${
                  activeTab === 'curl'
                    ? 'bg-[#212c3f] text-white font-semibold'
                    : 'text-[#87909f] hover:text-white hover:bg-[#1a2538]'
                }`}
              >
                cURL
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('go')}
                className={`px-3 py-1.5 rounded transition-colors cursor-pointer ${
                  activeTab === 'go'
                    ? 'bg-[#212c3f] text-white font-semibold'
                    : 'text-[#87909f] hover:text-white hover:bg-[#1a2538]'
                }`}
              >
                Go SDK
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('typescript')}
                className={`px-3 py-1.5 rounded transition-colors cursor-pointer ${
                  activeTab === 'typescript'
                    ? 'bg-[#212c3f] text-white font-semibold'
                    : 'text-[#87909f] hover:text-white hover:bg-[#1a2538]'
                }`}
              >
                TypeScript
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('lookup')}
                className={`px-3 py-1.5 rounded transition-colors cursor-pointer ${
                  activeTab === 'lookup'
                    ? 'bg-[#212c3f] text-white font-semibold'
                    : 'text-[#87909f] hover:text-white hover:bg-[#1a2538]'
                }`}
              >
                /api/lookup
              </button>
            </div>

            {/* Copy Button */}
            <button
              type="button"
              onClick={copyActiveSnippet}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono text-[#87909f] hover:text-white hover:bg-[#1a2538] transition-colors cursor-pointer shrink-0 ml-auto"
              title="Copy snippet"
            >
              {copiedSnippet ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSnippet ? (isVi ? 'Đã sao chép' : 'Copied') : (isVi ? 'Sao chép' : 'Copy')}</span>
            </button>
          </div>

          {/* Snippet Content Area */}
          <div className="text-[13px] font-mono leading-relaxed max-h-96 overflow-y-auto">
            {activeTab === 'response' && (
              <div dangerouslySetInnerHTML={{ __html: problem.snippets?.exampleHtml || '' }} />
            )}
            {activeTab === 'curl' && (
              <div dangerouslySetInnerHTML={{ __html: problem.snippets?.curl?.html || '' }} />
            )}
            {activeTab === 'go' && (
              <div dangerouslySetInnerHTML={{ __html: problem.snippets?.go?.html || '' }} />
            )}
            {activeTab === 'typescript' && (
              <div dangerouslySetInnerHTML={{ __html: problem.snippets?.typescript?.html || '' }} />
            )}
            {activeTab === 'lookup' && (
              <div className="p-4 space-y-2 bg-[#080d17]">
                <div className="text-xs text-[#87909f]">
                  {isVi ? '# Tra cứu tự động qua CLI hoặc AI agent (CORS *):' : '# Automated CLI or AI agent lookup command (CORS *):'}
                </div>
                <div className="text-sm text-[#e3e8ee] select-all font-mono">
                  curl -s &quot;https://docs.arda.io.vn/api/lookup?code={problem.code}&quot;
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* EXTENDED SPECIFICATION MARKDOC CONTENT (NẾU FILE GỐC CÓ NỘI DUNG THẬT) */}
      {markdocContent && (
        <section className="space-y-3 pt-4 border-t border-border">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <Info className="w-4 h-4 text-primary" />
            <span>{isVi ? 'GHI CHÚ & ĐẶC TẢ KỸ THUẬT MỞ RỘNG' : 'TECHNICAL SPECIFICATIONS & EXTENSIONS'}</span>
          </div>
          <div className="prose prose-slate dark:prose-invert max-w-none text-sm text-foreground/80 leading-relaxed">
            {renderMarkdocReact(markdocContent)}
          </div>
        </section>
      )}

      {/* ASSOCIATED ROUTES */}
      {problem.related_routes && problem.related_routes.length > 0 && (
        <section className="space-y-3 pt-2">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <Route className="w-4 h-4 text-primary" />
            <span>{isVi ? 'CÁC ENDPOINT HTTP LIÊN QUAN' : 'ASSOCIATED HTTP ROUTES'}</span>
          </div>

          <div className="p-4 sm:p-5 rounded-xl border border-border bg-card space-y-2.5">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {isVi
                ? 'Các route API sau đây được kiểm soát bởi auth-gateway và có thể phát sinh mã lỗi này:'
                : 'The following HTTP routes are governed by auth-gateway policies and may emit this problem code:'}
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {problem.related_routes.map((route) => (
                <span
                  key={route}
                  className="px-2.5 py-1 rounded-md text-xs font-mono bg-muted text-foreground border border-border hover:border-primary/40 hover:text-primary transition-colors"
                >
                  {route}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  );
}
