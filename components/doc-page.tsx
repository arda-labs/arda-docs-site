'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Check, Copy, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/cn';
import { usePortalI18n } from './provider';

export type DocTone = 'primary' | 'neutral' | 'info' | 'success' | 'warning' | 'danger';

export interface DocNavLink {
  href: string;
  label: string;
}

const TONE_BADGE: Record<DocTone, string> = {
  primary: 'bg-primary/10 text-primary border-primary/20',
  neutral: 'bg-muted text-muted-foreground border-border',
  info: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
  success: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  warning: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20',
  danger: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
};

const TONE_CALLOUT: Record<DocTone, string> = {
  primary: 'border-primary/20 bg-primary/5',
  neutral: 'border-border bg-muted/30',
  info: 'border-blue-500/20 bg-blue-500/5',
  success: 'border-emerald-500/20 bg-emerald-500/5',
  warning: 'border-amber-500/20 bg-amber-500/5',
  danger: 'border-red-500/20 bg-red-500/5',
};

const TONE_TITLE: Record<DocTone, string> = {
  primary: 'text-primary',
  neutral: 'text-foreground',
  info: 'text-blue-600 dark:text-blue-400',
  success: 'text-emerald-600 dark:text-emerald-400',
  warning: 'text-amber-700 dark:text-amber-400',
  danger: 'text-red-600 dark:text-red-400',
};

/** Consistent reading column for every static documentation page. */
export function DocPage({ children }: { children: React.ReactNode }) {
  return <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-10">{children}</div>;
}

export function DocHeader({
  badge,
  badgeTone = 'primary',
  meta,
  title,
  description,
  actions,
}: {
  badge: string;
  badgeTone?: DocTone;
  meta?: React.ReactNode;
  title: string;
  description: string;
  actions?: React.ReactNode;
}) {
  const { locale } = usePortalI18n();
  return (
    <div className="border-b border-border pb-6 space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-1">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          {locale === 'vi' ? 'Quay lại Tổng quan' : 'Back to Overview'}
        </Link>
        {actions}
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <span
          className={cn(
            'px-2 py-0.5 rounded text-[11px] font-mono font-bold border',
            TONE_BADGE[badgeTone]
          )}
        >
          {badge}
        </span>
        {meta ? <span className="text-xs text-muted-foreground">{meta}</span> : null}
      </div>
      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">{title}</h1>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}

export function DocSection({
  index,
  icon: Icon,
  title,
  description,
  children,
  className,
}: {
  index?: string | number;
  icon?: LucideIcon;
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn('space-y-4', className)}>
      <div className="flex items-center gap-2.5">
        {index !== undefined ? (
          <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
            {index}
          </div>
        ) : null}
        {Icon ? <Icon className="w-5 h-5 text-primary shrink-0" /> : null}
        <h2 className="text-lg font-bold text-foreground">{title}</h2>
      </div>
      {description ? (
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      ) : null}
      {children}
    </section>
  );
}

export function StatCard({
  value,
  label,
  hint,
  tone = 'primary',
}: {
  value: React.ReactNode;
  label: string;
  hint?: string;
  tone?: DocTone;
}) {
  return (
    <div className="p-4 rounded-xl border border-border bg-card space-y-1">
      <div className={cn('text-2xl font-bold tracking-tight', TONE_TITLE[tone])}>{value}</div>
      <div className="text-xs font-semibold text-foreground">{label}</div>
      {hint ? <div className="text-[11px] text-muted-foreground leading-relaxed">{hint}</div> : null}
    </div>
  );
}

export function Callout({
  tone = 'primary',
  icon: Icon,
  title,
  children,
}: {
  tone?: DocTone;
  icon?: LucideIcon;
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn('rounded-xl border p-4 space-y-1.5', TONE_CALLOUT[tone])}>
      {title ? (
        <div className={cn('flex items-center gap-2 text-sm font-bold', TONE_TITLE[tone])}>
          {Icon ? <Icon className="w-4 h-4 shrink-0" /> : null}
          <span>{title}</span>
        </div>
      ) : null}
      <div className="text-xs leading-relaxed text-muted-foreground">{children}</div>
    </div>
  );
}

export function DataTable({
  columns,
  rows,
  minWidth = 560,
}: {
  columns: string[];
  rows: React.ReactNode[][];
  minWidth?: number;
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-card">
      <table className="w-full text-left text-xs" style={{ minWidth }}>
        <thead className="bg-muted/40 text-[11px] uppercase tracking-wider text-muted-foreground">
          <tr>
            {columns.map((column) => (
              <th key={column} className="px-3.5 py-2.5 font-semibold whitespace-nowrap">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-muted/30 transition-colors">
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className={cn(
                    'px-3.5 py-2.5 align-top text-muted-foreground leading-relaxed',
                    cellIndex === 0 && 'font-medium text-foreground'
                  )}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function CodeBlock({
  title,
  code,
  copyable = true,
}: {
  title?: string;
  code: string;
  copyable?: boolean;
}) {
  const { locale } = usePortalI18n();
  const [copied, setCopied] = React.useState(false);

  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl bg-[#0c111c] border border-[#1e293b] text-[#e3e8ee] overflow-hidden shadow-sm">
      <div className="flex items-center justify-between px-3.5 py-2 bg-[#0e1726] border-b border-[#1e293b] text-xs font-mono">
        <span className="text-[#87909f]">{title ?? 'code'}</span>
        {copyable ? (
          <button
            type="button"
            onClick={copy}
            className="inline-flex items-center gap-1 text-[#87909f] hover:text-white transition-colors cursor-pointer"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            <span>
              {copied
                ? locale === 'vi'
                  ? 'Đã chép'
                  : 'Copied'
                : locale === 'vi'
                  ? 'Chép'
                  : 'Copy'}
            </span>
          </button>
        ) : null}
      </div>
      <pre className="p-4 text-xs font-mono leading-relaxed overflow-x-auto text-[#cbd5e1]">
        {code}
      </pre>
    </div>
  );
}

export function DocFooterNav({
  previous,
  next,
}: {
  previous?: DocNavLink;
  next?: DocNavLink;
}) {
  return (
    <div className="pt-6 border-t border-border flex items-center justify-between gap-4">
      {previous ? (
        <Link
          href={previous.href}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          {previous.label}
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link
          href={next.href}
          className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1 text-right"
        >
          {next.label}
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      ) : null}
    </div>
  );
}
