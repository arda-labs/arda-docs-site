'use client';

import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface ExampleBlockProps {
  example: string;
}

export function ExampleBlock({ example }: ExampleBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!example) return;
    navigator.clipboard.writeText(example).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <div className="rounded-xl overflow-hidden border border-border shadow-sm bg-zinc-950 text-zinc-100 my-6">
      {/* Header bar */}
      <div className="flex items-center px-4 py-2 bg-zinc-900/80 border-b border-zinc-800 text-xs text-zinc-400 gap-2">
        <div className="flex gap-1.5 mr-2">
          <span className="w-2.5 h-2.5 rounded-full bg-zinc-700 inline-block" />
          <span className="w-2.5 h-2.5 rounded-full bg-zinc-700 inline-block" />
          <span className="w-2.5 h-2.5 rounded-full bg-zinc-700 inline-block" />
        </div>
        <span className="font-mono font-medium text-zinc-300">
          HTTP · application/problem+json
        </span>
        <div className="flex-1" />
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-zinc-800/80 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors cursor-pointer"
          title="Copy example"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-medium">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code pre */}
      <pre className="p-4 text-xs sm:text-sm font-mono leading-relaxed overflow-x-auto text-zinc-200">
        <code>{example}</code>
      </pre>
    </div>
  );
}
