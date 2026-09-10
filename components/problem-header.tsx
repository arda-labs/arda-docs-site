'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { StatusBadge } from './status-badge';
import { Copy, Check, ChevronRight } from 'lucide-react';

interface ProblemHeaderProps {
  code: string;
  status: number;
  title: string;
  domain: string;
}

export function ProblemHeader({ code, status, title, domain }: ProblemHeaderProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <div className="mb-6">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4">
        <Link href="/" className="hover:text-foreground transition-colors">
          Catalog
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/60" />
        <span>{domain.toUpperCase()}</span>
        <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/60" />
        <span className="font-mono">{code}</span>
      </nav>

      {/* Badges bar */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <StatusBadge status={status} />

        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-mono bg-muted/60 text-foreground border border-border">
          <code>{code}</code>
          <button
            type="button"
            onClick={handleCopy}
            className="p-1 hover:text-primary transition-colors cursor-pointer"
            title="Copy code"
          >
            {copied ? (
              <Check className="w-3 h-3 text-emerald-500" />
            ) : (
              <Copy className="w-3 h-3 text-muted-foreground" />
            )}
          </button>
        </div>

        {domain && (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold uppercase tracking-wider bg-primary/10 text-primary">
            {domain}
          </span>
        )}
      </div>

      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
        {title}
      </h1>
    </div>
  );
}
