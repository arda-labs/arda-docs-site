'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Sun, Moon } from 'lucide-react';
import { usePortalI18n } from './provider';
import { LanguageSwitcher } from './language-switcher';

interface TopNavProps {
  onOpenSearch: () => void;
}

export function TopNav({ onOpenSearch }: TopNavProps) {
  const pathname = usePathname();
  const { locale, setLocale, theme, resolvedTheme, setTheme, toggleTheme } = usePortalI18n();

  const isProblems = pathname.startsWith('/problems');
  const isGuidelines = pathname.startsWith('/guidelines');
  const isArch = pathname.startsWith('/architecture');
  const isApi = pathname.startsWith('/api-reference');
  const isWorkflows = pathname.startsWith('/workflows');

  return (
    <header className="sticky top-0 z-40 w-full h-[52px] border-b border-border bg-background/95 backdrop-blur-md flex items-center px-4 sm:px-6 transition-colors">
      <div className="flex items-center justify-between w-full max-w-[1720px] mx-auto gap-4">
        {/* Left: Brand & Main Navigation Tabs */}
        <div className="flex items-center gap-6 lg:gap-8 min-w-0">
          {/* Stripe-style Logo */}
          <Link href="/" className="flex items-center gap-2 group shrink-0">
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

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 text-xs font-medium">
            <Link
              href="/problems/auth.error.unauthorized/"
              className={`px-3 py-1.5 rounded-md transition-colors ${
                isProblems
                  ? 'text-primary bg-primary/10 font-semibold border border-primary/20'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/70'
              }`}
            >
              {locale === 'vi' ? 'Danh mục Lỗi' : 'Problem Catalog'}
            </Link>
            <Link
              href="/guidelines"
              className={`px-3 py-1.5 rounded-md transition-colors ${
                isGuidelines
                  ? 'text-primary bg-primary/10 font-semibold border border-primary/20'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/70'
              }`}
            >
              {locale === 'vi' ? 'Quy chuẩn' : 'Guidelines'}
            </Link>
            <Link
              href="/architecture"
              className={`px-3 py-1.5 rounded-md transition-colors ${
                isArch
                  ? 'text-primary bg-primary/10 font-semibold border border-primary/20'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/70'
              }`}
            >
              {locale === 'vi' ? 'Kiến trúc' : 'Architecture'}
            </Link>
            <Link
              href="/api-reference"
              className={`px-3 py-1.5 rounded-md transition-colors ${
                isApi
                  ? 'text-primary bg-primary/10 font-semibold border border-primary/20'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/70'
              }`}
            >
              {locale === 'vi' ? 'Cổng API' : 'API Gateway'}
            </Link>
            <Link
              href="/workflows"
              className={`px-3 py-1.5 rounded-md transition-colors ${
                isWorkflows
                  ? 'text-primary bg-primary/10 font-semibold border border-primary/20'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/70'
              }`}
            >
              {locale === 'vi' ? 'Quy trình' : 'Workflows'}
            </Link>
          </nav>
        </div>

        {/* Right: Search Pill & Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Stripe-style Pill Search Bar */}
          <button
            type="button"
            onClick={onOpenSearch}
            className="h-8 w-44 sm:w-64 lg:w-72 flex items-center justify-between px-3 rounded-full bg-muted/60 hover:bg-muted text-muted-foreground border border-border hover:border-primary/40 text-xs transition-colors shadow-2xs cursor-pointer group"
          >
            <div className="flex items-center gap-2 truncate">
              <Search className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
              <span className="truncate text-muted-foreground group-hover:text-foreground transition-colors">
                {locale === 'vi' ? 'Tìm kiếm tài liệu & mã lỗi...' : 'Search docs & codes...'}
              </span>
            </div>
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono bg-background text-muted-foreground rounded-full border border-border">
              ⌘K
            </kbd>
          </button>

          {/* Language Switcher (Select Dropdown Style) */}
          <LanguageSwitcher />

          {/* Theme Switcher (Single Icon Toggle) */}
          <button
            type="button"
            onClick={toggleTheme}
            className="w-8 h-8 rounded-md flex items-center justify-center bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground border border-border hover:border-primary/40 transition-colors cursor-pointer shadow-2xs shrink-0"
            title={
              resolvedTheme === 'dark'
                ? (locale === 'vi' ? 'Chuyển sang Giao diện Sáng' : 'Switch to Light mode')
                : (locale === 'vi' ? 'Chuyển sang Giao diện Tối' : 'Switch to Dark mode')
            }
            aria-label="Toggle theme"
          >
            {resolvedTheme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400 transition-transform hover:rotate-45" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700 dark:text-slate-300 transition-transform hover:-rotate-12" />
            )}
          </button>

          {/* GitHub Repository Link */}
          <a
            href="https://github.com/arda-labs/arda-docs-site"
            target="_blank"
            rel="noreferrer"
            className="w-8 h-8 rounded-md flex items-center justify-center bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground border border-border hover:border-primary/40 transition-colors shadow-2xs shrink-0"
            title={locale === 'vi' ? 'Kho lưu trữ GitHub (arda-docs-site)' : 'GitHub Repository (arda-docs-site)'}
            aria-label="GitHub Repository"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
          </a>
        </div>
      </div>
    </header>
  );
}
