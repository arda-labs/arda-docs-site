'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  X,
  ArrowRight,
  BookOpen,
  FileText,
  Layers,
  Shield,
  GitBranch,
  Info,
  SlidersHorizontal,
  Sparkles,
  Database,
  CheckCircle2,
} from 'lucide-react';
import { usePortalI18n } from './provider';
import catalogData from '@/content/catalog-data.json';

interface SearchDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

interface DocSearchItem {
  type: 'doc';
  id: string;
  title: string;
  title_en: string;
  description: string;
  description_en: string;
  url: string;
  badge: string;
  keywords: string[];
}

interface ProblemSearchItem {
  type: 'problem';
  id: string;
  code: string;
  status: number;
  title: string;
  summary: string;
  domain: string;
  category: string;
  url: string;
}

type SearchItem = DocSearchItem | ProblemSearchItem;

const DOC_PAGES: DocSearchItem[] = [
  {
    type: 'doc',
    id: 'doc-catalog',
    title: 'Danh mục Lỗi RFC 7807',
    title_en: 'RFC 7807 Problem Catalog',
    description: 'Tra cứu toàn bộ 152 mã lỗi chuẩn hóa RFC 7807 với hướng dẫn sửa lỗi và code mẫu.',
    description_en: 'Browse 152 RFC 7807 standardized error codes with remediation guides and code examples.',
    url: '/problems/auth.error.unauthorized/',
    badge: 'CATALOG',
    keywords: ['catalog', 'problems', 'errors', 'rfc7807', 'danh muc', 'loi', 'status', 'codes'],
  },
  {
    type: 'doc',
    id: 'doc-guidelines',
    title: 'Quy chuẩn Kỹ thuật (Guidelines)',
    title_en: 'Engineering Guidelines',
    description: 'Quy chuẩn đóng gói lỗi RFC 7807, cú pháp định danh mã lỗi, 5 cấp độ Retry Policy và 4 tầng rủi ro Gateway.',
    description_en: 'RFC 7807 packaging standards, code syntax, 5-level Retry Policy, and 4 Gateway risk tiers.',
    url: '/guidelines',
    badge: 'GUIDE',
    keywords: ['guidelines', 'quy chuan', 'retry', 'policy', 'rfc 7807', 'syntax', 'format', 'risk', 'remediation'],
  },
  {
    type: 'doc',
    id: 'doc-architecture',
    title: 'Kiến trúc Core Banking (Architecture)',
    title_en: 'Core Banking Architecture',
    description: 'Mô hình 11 Go microservices phân tán, bất biến sổ cái hai bên, Zeebe Sagas và chuẩn thời gian UTC.',
    description_en: 'Distributed 11 Go microservices, double-entry immutable ledger, Zeebe Sagas, and UTC timing.',
    url: '/architecture',
    badge: 'ARCH',
    keywords: ['architecture', 'kien truc', 'microservices', 'ledger', 'so cai', 'saga', 'zeebe', 'grpc'],
  },
  {
    type: 'doc',
    id: 'doc-api',
    title: 'Cổng API & Phân quyền Ingress (API Gateway)',
    title_en: 'API Gateway & Ingress Reference',
    description: 'Chính sách bảo mật tập trung policy.yaml, định tuyến Ingress, xác thực JWT, RBAC và Rate Limiting.',
    description_en: 'Centralized policy.yaml security, Ingress routing, JWT authentication, RBAC, and Rate Limiting.',
    url: '/api-reference',
    badge: 'GATEWAY',
    keywords: ['api', 'gateway', 'ingress', 'policy', 'jwt', 'auth-gateway', 'rbac', 'rate limit', 'token'],
  },
  {
    type: 'doc',
    id: 'doc-workflows',
    title: 'Quy trình Nghiệp vụ (Workflows)',
    title_en: 'Banking Workflows & Sagas',
    description: 'Chu trình xử lý giao dịch lõi, bù trừ bất đồng bộ, cơ chế Idempotency Key và phục hồi lỗi.',
    description_en: 'Core transaction lifecycles, asynchronous compensation, Idempotency Keys, and failure recovery.',
    url: '/workflows',
    badge: 'SAGA',
    keywords: ['workflows', 'quy trinh', 'sagas', 'idempotency', 'compensation', 'transaction', 'reversal'],
  },
  {
    type: 'doc',
    id: 'doc-about',
    title: 'Giới thiệu Nền tảng (About Arda)',
    title_en: 'About Arda Platform',
    description: 'Tổng quan kiến trúc Arda Core Banking, hạ tầng K3s self-hosted, GitOps Argo CD và Cloudflare Edge.',
    description_en: 'Arda Core Banking platform overview, self-hosted K3s infrastructure, Argo CD GitOps, and Cloudflare Edge.',
    url: '/about',
    badge: 'PLATFORM',
    keywords: ['about', 'gioi thieu', 'k3s', 'gitops', 'argo cd', 'cloudflare', 'edge', 'team', 'infra'],
  },
  {
    type: 'doc',
    id: 'doc-terms',
    title: 'Điều khoản Dịch vụ (Terms of Service)',
    title_en: 'Terms of Service',
    description: 'Cam kết SLA 99.9%, chính sách sử dụng hợp lý, hạn mức tần suất gọi API và trách nhiệm khách hàng.',
    description_en: '99.9% SLA commitment, acceptable use policy, API rate limits, and caller responsibilities.',
    url: '/terms-of-service',
    badge: 'LEGAL',
    keywords: ['terms', 'dieu khoan', 'sla', 'service', 'usage', 'rate limits', 'legal'],
  },
  {
    type: 'doc',
    id: 'doc-privacy',
    title: 'Chính sách Quyền riêng tư (Privacy Policy)',
    title_en: 'Privacy & Data Protection',
    description: 'Tiêu chuẩn bảo mật dữ liệu tài chính, cách ly dữ liệu Multi-tenant, mã hóa mTLS và kiểm toán Audit Logs.',
    description_en: 'Financial data security standards, multi-tenant data isolation, mTLS encryption, and audit logging.',
    url: '/privacy-policy',
    badge: 'SECURITY',
    keywords: ['privacy', 'quyen rieng tu', 'bao mat', 'tenant', 'encryption', 'mtls', 'audit'],
  },
];

const POPULAR_ERROR_CODES = [
  'auth.error.unauthorized',
  'auth.error.forbidden',
  'ai.rate_limited',
  'common.error.bad_gateway',
  'common.error.internal_error',
  'iam.superadmin.role_protected',
  'rag.missing_file',
  'tenant.error.scope_required',
  'validation.invalid_json',
  'calendar.error.not_found',
];

export function SearchDialog({ isOpen, onClose }: SearchDialogProps) {
  const { locale } = usePortalI18n();
  const isVi = locale === 'vi';
  const router = useRouter();

  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'docs' | '4xx' | '5xx' | 'auth' | 'ai' | 'rag'>('all');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  // Build full problems list
  const allProblems: ProblemSearchItem[] = useMemo(() => {
    return (catalogData.pages || []).map((p: any) => ({
      type: 'problem' as const,
      id: p.code,
      code: p.code,
      status: p.status,
      title: p.title,
      summary: p.summary || '',
      domain: p.domain || p.code.split('.')[0] || 'common',
      category: p.category || 'common',
      url: `/problems/${p.code}/`,
    }));
  }, []);

  // Filter items based on query & active tab
  const { filteredDocs, filteredProblems, displayItems } = useMemo(() => {
    const q = query.trim().toLowerCase();

    // 1. Filter Docs
    let docs = DOC_PAGES;
    if (activeFilter === '4xx' || activeFilter === '5xx' || activeFilter === 'ai' || activeFilter === 'rag' || activeFilter === 'auth') {
      docs = [];
    } else if (q !== '') {
      docs = DOC_PAGES.filter((d) => {
        return (
          d.title.toLowerCase().includes(q) ||
          d.title_en.toLowerCase().includes(q) ||
          d.description.toLowerCase().includes(q) ||
          d.description_en.toLowerCase().includes(q) ||
          d.keywords.some((k) => k.toLowerCase().includes(q))
        );
      });
    }

    // 2. Filter Problems
    let problems = allProblems;

    if (activeFilter === 'docs') {
      problems = [];
    } else if (activeFilter === '4xx') {
      problems = problems.filter((p) => p.status >= 400 && p.status < 500);
    } else if (activeFilter === '5xx') {
      problems = problems.filter((p) => p.status >= 500);
    } else if (activeFilter === 'auth') {
      problems = problems.filter((p) => p.code.startsWith('auth.') || p.code.startsWith('iam.'));
    } else if (activeFilter === 'ai') {
      problems = problems.filter((p) => p.code.startsWith('ai.'));
    } else if (activeFilter === 'rag') {
      problems = problems.filter((p) => p.code.startsWith('rag.'));
    }

    if (q !== '') {
      problems = problems.filter((p) => {
        const statusCodeStr = String(p.status);
        return (
          p.code.toLowerCase().includes(q) ||
          p.title.toLowerCase().includes(q) ||
          p.summary.toLowerCase().includes(q) ||
          statusCodeStr === q ||
          p.domain.toLowerCase().includes(q)
        );
      });
    }

    // Flat combined items for keyboard navigation
    // If empty query and 'all' filter, highlight common codes first, but allow browsing all
    let flatItems: SearchItem[] = [];
    if (q === '' && activeFilter === 'all') {
      const popularSpecs = allProblems.filter((p) => POPULAR_ERROR_CODES.includes(p.code));
      const otherSpecs = allProblems.filter((p) => !POPULAR_ERROR_CODES.includes(p.code));
      flatItems = [...docs, ...popularSpecs, ...otherSpecs];
    } else {
      flatItems = [...docs, ...problems];
    }

    return {
      filteredDocs: docs,
      filteredProblems: problems,
      displayItems: flatItems,
    };
  }, [query, activeFilter, allProblems]);

  // Focus on open & reset
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
    } else {
      setQuery('');
      setActiveFilter('all');
    }
  }, [isOpen]);

  // Auto scroll active item into view
  useEffect(() => {
    if (itemRefs.current[selectedIndex]) {
      itemRefs.current[selectedIndex]?.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex]);

  // Keyboard navigation & shortcut handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        onClose();
        return;
      }
      if (!isOpen) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % Math.max(1, displayItems.length));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + displayItems.length) % Math.max(1, displayItems.length));
      } else if (e.key === 'Enter') {
        const item = displayItems[selectedIndex];
        if (item) {
          e.preventDefault();
          router.push(item.url);
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, displayItems, selectedIndex, onClose, router]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-14 sm:pt-20 p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-100"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-background border border-border rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-100 flex flex-col max-h-[82vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top: Search Input */}
        <div className="flex items-center px-4 py-3 border-b border-border gap-2.5 bg-background">
          <Search className="w-4 h-4 text-muted-foreground shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder={
              isVi
                ? 'Tìm kiếm tài liệu, mã lỗi RFC 7807, mã HTTP (401, 500, 429)...'
                : 'Search guides, RFC 7807 codes, HTTP status (401, 500, 429)...'
            }
            className="w-full text-sm bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none"
          />

          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setSelectedIndex(0);
                inputRef.current?.focus();
              }}
              className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
              title={isVi ? 'Xóa ô tìm kiếm' : 'Clear search'}
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="px-2 py-1 text-[11px] font-mono text-muted-foreground bg-muted hover:bg-muted/80 rounded border border-border transition-colors cursor-pointer flex items-center gap-1"
            title={isVi ? 'Đóng (ESC hoặc bấm ra ngoài)' : 'Close (ESC or click outside)'}
          >
            <span>ESC</span>
          </button>
        </div>

        {/* Filter Chips Bar */}
        <div className="flex items-center gap-1.5 px-3.5 py-2 border-b border-border/80 bg-muted/20 overflow-x-auto text-xs scrollbar-none">
          <button
            type="button"
            onClick={() => {
              setActiveFilter('all');
              setSelectedIndex(0);
            }}
            className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors shrink-0 cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-primary text-primary-foreground font-semibold shadow-2xs'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            {isVi ? 'Tất cả (160)' : 'All (160)'}
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveFilter('docs');
              setSelectedIndex(0);
            }}
            className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors shrink-0 cursor-pointer ${
              activeFilter === 'docs'
                ? 'bg-primary text-primary-foreground font-semibold shadow-2xs'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            {isVi ? 'Tài liệu (8)' : 'Docs (8)'}
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveFilter('4xx');
              setSelectedIndex(0);
            }}
            className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors shrink-0 cursor-pointer ${
              activeFilter === '4xx'
                ? 'bg-amber-500 text-white font-semibold shadow-2xs'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            HTTP 4xx
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveFilter('5xx');
              setSelectedIndex(0);
            }}
            className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors shrink-0 cursor-pointer ${
              activeFilter === '5xx'
                ? 'bg-red-500 text-white font-semibold shadow-2xs'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            HTTP 5xx
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveFilter('auth');
              setSelectedIndex(0);
            }}
            className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors shrink-0 cursor-pointer ${
              activeFilter === 'auth'
                ? 'bg-primary text-primary-foreground font-semibold shadow-2xs'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            Auth &amp; IAM
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveFilter('ai');
              setSelectedIndex(0);
            }}
            className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors shrink-0 cursor-pointer ${
              activeFilter === 'ai'
                ? 'bg-primary text-primary-foreground font-semibold shadow-2xs'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            AI Agents
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveFilter('rag');
              setSelectedIndex(0);
            }}
            className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors shrink-0 cursor-pointer ${
              activeFilter === 'rag'
                ? 'bg-primary text-primary-foreground font-semibold shadow-2xs'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            RAG Base
          </button>
        </div>

        {/* Scrollable Results List */}
        <div ref={listRef} className="flex-1 overflow-y-auto p-2 space-y-4 max-h-[58vh]">
          {displayItems.length === 0 ? (
            <div className="py-12 text-center text-xs text-muted-foreground space-y-2">
              <p className="font-medium text-foreground">
                {isVi ? 'Không tìm thấy kết quả phù hợp.' : 'No matching results found.'}
              </p>
              <p className="text-[11px]">
                {isVi
                  ? 'Hãy thử tìm bằng từ khóa khác như "unauthorized", "401", "gateway", "saga"...'
                  : 'Try searching for keywords like "unauthorized", "401", "gateway", "saga"...'}
              </p>
            </div>
          ) : (
            <>
              {/* Group 1: Documentation Pages (if matching) */}
              {filteredDocs.length > 0 && (
                <div className="space-y-1">
                  <div className="px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
                    <span>{isVi ? 'Tài liệu Kỹ thuật' : 'Documentation'}</span>
                    <span className="text-[10px] font-mono opacity-70">
                      {filteredDocs.length} {isVi ? 'trang' : 'pages'}
                    </span>
                  </div>

                  <div className="space-y-0.5">
                    {filteredDocs.map((doc) => {
                      const globalIdx = displayItems.findIndex((i) => i.id === doc.id);
                      const isSelected = globalIdx === selectedIndex;

                      return (
                        <Link
                          key={doc.id}
                          ref={(el) => {
                            if (globalIdx >= 0) itemRefs.current[globalIdx] = el;
                          }}
                          href={doc.url}
                          onClick={onClose}
                          className={`flex items-start justify-between p-2.5 rounded-lg text-xs transition-colors group ${
                            isSelected
                              ? 'bg-primary/10 text-primary font-medium border border-primary/20 shadow-2xs'
                              : 'text-muted-foreground hover:bg-muted/70 hover:text-foreground border border-transparent'
                          }`}
                        >
                          <div className="flex items-start gap-2.5 min-w-0 pr-2">
                            <div className="p-1 rounded bg-primary/10 text-primary shrink-0 mt-0.5">
                              <BookOpen className="w-3.5 h-3.5" />
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-foreground group-hover:text-primary transition-colors truncate">
                                  {isVi ? doc.title : doc.title_en}
                                </span>
                                <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-muted text-muted-foreground border border-border shrink-0">
                                  {doc.badge}
                                </span>
                              </div>
                              <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">
                                {isVi ? doc.description : doc.description_en}
                              </p>
                            </div>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Group 2: Problem Specifications */}
              {filteredProblems.length > 0 && (
                <div className="space-y-1">
                  <div className="px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
                    <span>
                      {query.trim() === '' && activeFilter === 'all'
                        ? isVi
                          ? 'Mã Lỗi RFC 7807 (Toàn bộ 152 Specs)'
                          : 'RFC 7807 Error Specs (All 152)'
                        : isVi
                        ? 'Mã Lỗi RFC 7807 Phù hợp'
                        : 'Matching Error Specs'}
                    </span>
                    <span className="text-[10px] font-mono opacity-70">
                      {filteredProblems.length} {isVi ? 'mã' : 'codes'}
                    </span>
                  </div>

                  <div className="space-y-0.5">
                    {filteredProblems.map((prob) => {
                      const globalIdx = displayItems.findIndex((i) => i.id === prob.id);
                      const isSelected = globalIdx === selectedIndex;
                      const is5xx = prob.status >= 500;

                      return (
                        <Link
                          key={prob.code}
                          ref={(el) => {
                            if (globalIdx >= 0) itemRefs.current[globalIdx] = el;
                          }}
                          href={prob.url}
                          onClick={onClose}
                          className={`flex items-center justify-between p-2.5 rounded-lg text-xs transition-colors group ${
                            isSelected
                              ? 'bg-primary/10 text-primary font-medium border border-primary/20 shadow-2xs'
                              : 'text-muted-foreground hover:bg-muted/70 hover:text-foreground border border-transparent'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0 pr-2">
                            <span
                              className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold shrink-0 border ${
                                is5xx
                                  ? 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20'
                                  : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                              }`}
                            >
                              {prob.status}
                            </span>
                            <span className="font-mono text-foreground font-semibold group-hover:text-primary transition-colors truncate">
                              {prob.code}
                            </span>
                            <span className="text-muted-foreground truncate hidden sm:inline text-[11px]">
                              — {prob.title}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <span className="hidden md:inline px-1.5 py-0.2 rounded text-[9px] font-mono text-muted-foreground bg-muted border border-border uppercase">
                              {prob.domain}
                            </span>
                            <ArrowRight className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Bottom Information Footer */}
        <div className="px-4 py-2.5 border-t border-border bg-muted/30 flex items-center justify-between text-[11px] text-muted-foreground">
          <div className="flex items-center gap-2">
            <span>{isVi ? 'Dùng phím ↑ ↓ để di chuyển, Enter để mở' : 'Use ↑ ↓ to navigate, Enter to open'}</span>
            <span className="hidden sm:inline opacity-50">•</span>
            <span className="hidden sm:inline">{isVi ? 'Bấm ra ngoài hoặc ESC để thoát' : 'Click outside or ESC to close'}</span>
          </div>

          <div className="font-mono text-[10px] text-foreground font-medium">
            {displayItems.length} / 160 items
          </div>
        </div>
      </div>
    </div>
  );
}
