import Markdoc, { type Config, type RenderableTreeNode } from '@markdoc/markdoc';
import React from 'react';
import Link from 'next/link';

// Custom tags schema
export const markdocConfig: Config = {
  tags: {
    callout: {
      render: 'Callout',
      attributes: {
        type: {
          type: String,
          default: 'info',
          matches: ['info', 'warning', 'error', 'success'],
        },
        title: {
          type: String,
        },
      },
    },
    badge: {
      render: 'Badge',
      attributes: {
        text: { type: String, required: true },
        variant: { type: String, default: 'default' },
      },
    },
  },
  nodes: {
    link: {
      render: 'CustomLink',
      attributes: {
        href: { type: String, required: true },
        title: { type: String },
      },
    },
  },
};

// React components for custom tags
function Callout({ type = 'info', title, children }: { type?: string; title?: string; children: React.ReactNode }) {
  const styles = {
    info: 'border-blue-500/30 bg-blue-50/50 dark:bg-blue-950/20 text-blue-900 dark:text-blue-300',
    warning: 'border-amber-500/30 bg-amber-50/50 dark:bg-amber-950/20 text-amber-900 dark:text-amber-300',
    error: 'border-red-500/30 bg-red-50/50 dark:bg-red-950/20 text-red-900 dark:text-red-300',
    success: 'border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-900 dark:text-emerald-300',
  }[type] || 'border-border bg-muted/40 text-foreground';

  return (
    <div className={`my-4 p-4 rounded-lg border text-sm leading-relaxed ${styles}`}>
      {title && <div className="font-semibold text-xs tracking-wide uppercase mb-1.5">{title}</div>}
      <div className="text-xs space-y-2">{children}</div>
    </div>
  );
}

function Badge({ text, variant = 'default' }: { text: string; variant?: string }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-muted text-foreground border border-border">
      {text}
    </span>
  );
}

function CustomLink({ href, title, children }: { href: string; title?: string; children: React.ReactNode }) {
  if (href.startsWith('http')) {
    return (
      <a href={href} title={title} target="_blank" rel="noreferrer" className="text-primary hover:underline underline-offset-2">
        {children}
      </a>
    );
  }
  return (
    <Link href={href} title={title} className="text-primary hover:underline underline-offset-2">
      {children}
    </Link>
  );
}

const customComponents = {
  Callout,
  Badge,
  CustomLink,
};

export function parseAndTransformMarkdoc(markdown: string): RenderableTreeNode {
  const ast = Markdoc.parse(markdown);
  return Markdoc.transform(ast, markdocConfig);
}

export function renderMarkdocReact(content: RenderableTreeNode): React.ReactNode {
  return Markdoc.renderers.react(content, React, {
    components: customComponents,
  });
}
