'use client';

import React from 'react';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import { usePortalI18n } from './provider';

export function Footer() {
  const { locale } = usePortalI18n();
  const isVi = locale === 'vi';

  return (
    <footer className="w-full border-t border-border bg-[#fafbfc] dark:bg-[#080d17] text-muted-foreground transition-colors mt-auto">
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Col */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-6 h-6 rounded-md bg-[#635bff] flex items-center justify-center text-white font-bold text-xs shadow-2xs group-hover:bg-[#533afd] transition-colors">
                A
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-base tracking-tight text-foreground">
                  arda
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wider font-mono bg-primary/10 text-primary border border-primary/20">
                  DOCS
                </span>
              </div>
            </Link>

            <p className="text-xs text-muted-foreground leading-relaxed">
              {isVi
                ? 'Cổng tài liệu kỹ thuật, chuẩn hóa lỗi RFC 7807 và hướng dẫn kiến trúc nền tảng ngân hàng lõi Arda Core Banking.'
                : 'Technical documentation, standardized RFC 7807 problem catalog, and architectural guidelines for Arda Core Banking.'}
            </p>

            <div className="flex items-center gap-2 text-[11px] font-mono text-muted-foreground pt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>152 Standard RFC 7807 Codes</span>
            </div>
          </div>

          {/* Col 1: Developer Documentation */}
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-foreground">
              {isVi ? 'Tài liệu Kỹ thuật' : 'Developer Docs'}
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  href="/problems/auth.error.unauthorized/"
                  className="hover:text-primary transition-colors"
                >
                  {isVi ? 'Danh mục Lỗi (Problem Catalog)' : 'Problem Catalog (152 Codes)'}
                </Link>
              </li>
              <li>
                <Link
                  href="/guidelines"
                  className="hover:text-primary transition-colors"
                >
                  {isVi ? 'Quy chuẩn Kỹ thuật & Thiết kế' : 'Engineering Guidelines'}
                </Link>
              </li>
              <li>
                <Link
                  href="/architecture"
                  className="hover:text-primary transition-colors"
                >
                  {isVi ? 'Kiến trúc Phân tán Core Banking' : 'Core Banking Architecture'}
                </Link>
              </li>
              <li>
                <Link
                  href="/api-reference"
                  className="hover:text-primary transition-colors"
                >
                  {isVi ? 'Cổng API & Phân quyền Ingress' : 'API Gateway & Ingress'}
                </Link>
              </li>
              <li>
                <Link
                  href="/workflows"
                  className="hover:text-primary transition-colors"
                >
                  {isVi ? 'Quy trình Vận hành & Sagas' : 'Banking Workflows & Sagas'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 2: Platform & Infrastructure */}
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-foreground">
              {isVi ? 'Nền tảng & Hệ thống' : 'Platform & Systems'}
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <span className="text-foreground/90 font-medium">11 Go Microservices</span>
                <span className="block text-[11px] text-muted-foreground">Internal gRPC &amp; mTLS</span>
              </li>
              <li>
                <span className="text-foreground/90 font-medium">Module Federation MFE</span>
                <span className="block text-[11px] text-muted-foreground">Bun + Vite (1 Shell + 7 Remotes)</span>
              </li>
              <li>
                <span className="text-foreground/90 font-medium">K3s 3-Node Self-Hosted</span>
                <span className="block text-[11px] text-muted-foreground">GitOps Argo CD &amp; Cloudflare Tunnel</span>
              </li>
              <li>
                <span className="text-foreground/90 font-medium">Machine Contract</span>
                <span className="block text-[11px] font-mono text-primary">GET /api/lookup?code=...</span>
              </li>
            </ul>
          </div>

          {/* Col 3: Portal & Governance */}
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-foreground">
              {isVi ? 'Thông tin & Pháp lý' : 'Governance & Legal'}
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/about" className="hover:text-primary transition-colors">
                  {isVi ? 'Giới thiệu về Arda Core Banking' : 'About Arda Platform'}
                </Link>
              </li>
              <li>
                <Link href="/terms-of-service" className="hover:text-primary transition-colors">
                  {isVi ? 'Điều khoản Dịch vụ' : 'Terms of Service'}
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-primary transition-colors">
                  {isVi ? 'Chính sách Quyền riêng tư' : 'Privacy & Data Protection'}
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/arda-labs/arda-docs-site"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-primary transition-colors inline-flex items-center gap-1"
                >
                  <span>GitHub Repository</span>
                  <ExternalLink className="w-3 h-3 opacity-70" />
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/arda-labs"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-primary transition-colors inline-flex items-center gap-1"
                >
                  <span>GitHub Organization</span>
                  <ExternalLink className="w-3 h-3 opacity-70" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="text-muted-foreground">
            &copy; 2026 Arda Core Banking Platform. {isVi ? 'Bản quyền thuộc về Arda Labs.' : 'All rights reserved.'}
          </div>

          <div className="flex items-center gap-4 text-[11px] font-mono">
            <span className="px-2 py-0.5 rounded bg-muted border border-border text-foreground">
              RFC 7807
            </span>
            <span className="px-2 py-0.5 rounded bg-muted border border-border text-foreground">
              OpenAPI 3.1
            </span>
            <span className="px-2 py-0.5 rounded bg-muted border border-border text-foreground">
              Zero-Trust
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
