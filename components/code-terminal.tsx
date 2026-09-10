'use client';

import React, { useState } from 'react';
import { Copy, Check, Terminal, Code2, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { usePortalI18n } from './provider';
import type { ProblemPageData } from '@/lib/catalog';

interface CodeTerminalProps {
  problem: ProblemPageData;
}

export function CodeTerminal({ problem }: CodeTerminalProps) {
  const { locale, activeLanguage, setActiveLanguage } = usePortalI18n();
  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const [copiedResponse, setCopiedResponse] = useState(false);
  const [copiedLookup, setCopiedLookup] = useState(false);

  const snippets = problem.snippets;
  const currentSnippet = snippets[activeLanguage] || snippets.curl;

  const copySnippet = () => {
    navigator.clipboard.writeText(currentSnippet.code);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  const copyResponse = () => {
    navigator.clipboard.writeText(problem.example);
    setCopiedResponse(true);
    setTimeout(() => setCopiedResponse(false), 2000);
  };

  const copyLookupCurl = () => {
    navigator.clipboard.writeText(`curl -s "https://docs.arda.io.vn/api/lookup?code=${problem.code}"`);
    setCopiedLookup(true);
    setTimeout(() => setCopiedLookup(false), 2000);
  };

  const is5xx = problem.status >= 500;

  return (
    <aside className="w-full lg:w-[460px] xl:w-[500px] shrink-0 bg-[#0c111c] text-[#e3e8ee] border-t lg:border-t-0 lg:border-l border-[#1e293b] lg:sticky lg:top-[52px] lg:h-[calc(100vh-52px)] overflow-y-auto flex flex-col justify-between">
      <div className="p-4 space-y-6">
        {/* REQUEST SECTION */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[11px] font-bold tracking-wider text-[#87909f] uppercase font-mono">
              <Terminal className="w-3.5 h-3.5 text-[#7a73ff]" />
              <span>{locale === 'vi' ? 'MẪU GỌI API' : 'REQUEST EXAMPLE'}</span>
            </div>

            {/* Stripe Segmented Language Tabs */}
            <div className="flex items-center bg-[#162032] rounded-md p-0.5 border border-[#212c3f] text-[11px] font-mono">
              {(['curl', 'go', 'typescript'] as const).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setActiveLanguage(lang)}
                  className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                    activeLanguage === lang
                      ? 'bg-[#212c3f] text-white font-semibold shadow-xs'
                      : 'text-[#87909f] hover:text-white'
                  }`}
                >
                  {lang === 'typescript' ? 'TS' : lang.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Request Code Block */}
          <div className="rounded-lg bg-[#080d17] border border-[#1e293b] overflow-hidden shadow-sm">
            <div className="flex items-center justify-between px-3.5 py-2 bg-[#0e1726] border-b border-[#1e293b] text-[11px] font-mono text-[#87909f]">
              <span>{activeLanguage === 'curl' ? 'Terminal (cURL)' : activeLanguage === 'go' ? 'Go Client SDK' : 'TypeScript Client'}</span>
              <button
                type="button"
                onClick={copySnippet}
                className="flex items-center gap-1 text-[#87909f] hover:text-white transition-colors cursor-pointer"
                title="Copy code"
              >
                {copiedSnippet ? <Check className="w-3.5 h-3.5 text-[#76df47]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSnippet ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <div
              className="text-[11px] font-mono leading-relaxed"
              dangerouslySetInnerHTML={{ __html: currentSnippet.html }}
            />
          </div>
        </div>

        {/* RESPONSE SECTION */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[11px] font-bold tracking-wider text-[#87909f] uppercase font-mono">
              <Code2 className="w-3.5 h-3.5 text-[#75d5e8]" />
              <span>{locale === 'vi' ? 'PHẢN HỒI LỖI (RFC 7807)' : 'RESPONSE BODY'}</span>
            </div>

            {/* Status Pill with indicator dot */}
            <div
              className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                is5xx
                  ? 'bg-[#380816] text-[#fa526a] border-[#68052b]'
                  : 'bg-[#381b03] text-[#fcbd3a] border-[#5f1a05]'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  is5xx ? 'bg-[#fa526a]' : 'bg-[#fcbd3a]'
                }`}
              />
              <span>HTTP {problem.status}</span>
            </div>
          </div>

          {/* Response Payload */}
          <div className="rounded-lg bg-[#080d17] border border-[#1e293b] overflow-hidden shadow-sm">
            <div className="flex items-center justify-between px-3.5 py-2 bg-[#0e1726] border-b border-[#1e293b] text-[11px] font-mono text-[#87909f]">
              <span>application/problem+json</span>
              <button
                type="button"
                onClick={copyResponse}
                className="flex items-center gap-1 text-[#87909f] hover:text-white transition-colors cursor-pointer"
                title="Copy response JSON"
              >
                {copiedResponse ? <Check className="w-3.5 h-3.5 text-[#76df47]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedResponse ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <div
              className="text-[11px] font-mono leading-relaxed max-h-80 overflow-y-auto"
              dangerouslySetInnerHTML={{ __html: snippets.exampleHtml }}
            />
          </div>
        </div>
      </div>

      {/* FOOTER: CLI & MACHINE API LOOKUP */}
      <div className="p-4 border-t border-[#1e293b] bg-[#090e18] text-xs space-y-2">
        <div className="flex items-center justify-between text-[11px] text-[#87909f]">
          <span>{locale === 'vi' ? 'Tra cứu bằng CLI / HTTP API:' : 'Machine Lookup (AI / CLI):'}</span>
          <button
            type="button"
            onClick={copyLookupCurl}
            className="text-[#7a73ff] hover:underline flex items-center gap-1 cursor-pointer font-medium"
          >
            {copiedLookup ? <Check className="w-3 h-3 text-[#76df47]" /> : <Copy className="w-3 h-3" />}
            <span>{copiedLookup ? 'Copied' : 'Copy cURL'}</span>
          </button>
        </div>
        <div className="p-2.5 rounded-md bg-[#0e1726] border border-[#1e293b] font-mono text-[10.5px] text-[#e3e8ee] truncate">
          curl -s &quot;https://docs.arda.io.vn/api/lookup?code={problem.code}&quot;
        </div>
      </div>
    </aside>
  );
}
