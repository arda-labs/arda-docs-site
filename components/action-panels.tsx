import React from 'react';
import { Laptop, Terminal } from 'lucide-react';

interface ActionPanelsProps {
  client: string;
  operator: string;
}

function renderFormatted(text: string) {
  // Simple regex parser for inline backticks `foo` -> <code>foo</code>
  const parts = text.split(/(`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code
          key={i}
          className="px-1.5 py-0.5 rounded bg-muted font-mono text-xs text-primary font-medium"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}

export function ActionPanels({ client, operator }: ActionPanelsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
      {/* Client Remediation Panel */}
      <div className="rounded-xl border border-border bg-card p-5 shadow-sm flex flex-col transition-all hover:border-primary/40">
        <div className="flex items-center gap-2.5 pb-3 mb-3 border-b border-border/60">
          <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0">
            <Laptop className="w-4 h-4" />
          </div>
          <span className="font-semibold text-sm text-card-foreground">
            What the client should do
          </span>
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground flex-1">
          {renderFormatted(client)}
        </p>
      </div>

      {/* Operator Diagnostics Panel */}
      <div className="rounded-xl border border-border bg-card p-5 shadow-sm flex flex-col transition-all hover:border-emerald-500/40">
        <div className="flex items-center gap-2.5 pb-3 mb-3 border-b border-border/60">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
            <Terminal className="w-4 h-4" />
          </div>
          <span className="font-semibold text-sm text-card-foreground">
            What operators should check
          </span>
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground flex-1">
          {renderFormatted(operator)}
        </p>
      </div>
    </div>
  );
}
