'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, X, ArrowRight } from 'lucide-react';
import { usePortalI18n } from './provider';
import catalogData from '@/content/catalog-data.json';

interface SearchDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchDialog({ isOpen, onClose }: SearchDialogProps) {
  const { locale } = usePortalI18n();
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const items = catalogData.pages || [];
  const filtered = query.trim() === ''
    ? items.slice(0, 8)
    : items.filter((p) => {
        const q = query.toLowerCase();
        return (
          p.code.toLowerCase().includes(q) ||
          p.title.toLowerCase().includes(q) ||
          (p.summary && p.summary.toLowerCase().includes(q))
        );
      }).slice(0, 12);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(); // parent will toggle
      }
      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % Math.max(1, filtered.length));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filtered.length) % Math.max(1, filtered.length));
      } else if (e.key === 'Enter') {
        if (filtered[selectedIndex]) {
          e.preventDefault();
          router.push(`/problems/${filtered[selectedIndex].code}/`);
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filtered, selectedIndex, onClose, router]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-100">
      <div
        className="w-full max-w-xl bg-background border border-border rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-3.5 border-b border-border">
          <Search className="w-4 h-4 text-muted-foreground mr-2.5 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder={locale === 'vi' ? 'Tìm mã lỗi, tiêu đề, HTTP status...' : 'Search error codes, titles, HTTP status...'}
            className="w-full py-3 text-sm bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground bg-muted rounded border border-border ml-2">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-1.5 space-y-0.5">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-xs text-muted-foreground">
              {locale === 'vi' ? 'Không tìm thấy mã lỗi phù hợp.' : 'No matching problem codes found.'}
            </div>
          ) : (
            filtered.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              const is5xx = item.status >= 500;
              return (
                <Link
                  key={item.code}
                  href={`/problems/${item.code}/`}
                  onClick={onClose}
                  className={`flex items-center justify-between p-2.5 rounded-lg text-xs transition-colors ${
                    isSelected ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold shrink-0 border ${
                        is5xx
                          ? 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20'
                          : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                      }`}
                    >
                      {item.status}
                    </span>
                    <span className="font-mono text-foreground font-semibold truncate">{item.code}</span>
                    <span className="text-muted-foreground truncate hidden sm:inline">— {item.title}</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 opacity-60 shrink-0 ml-2" />
                </Link>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="px-3.5 py-2 border-t border-border/80 bg-muted/20 flex items-center justify-between text-[11px] text-muted-foreground">
          <span>{locale === 'vi' ? 'Dùng phím ↑ ↓ để chọn, Enter để mở' : 'Use ↑ ↓ to navigate, Enter to select'}</span>
          <span>152 specs</span>
        </div>
      </div>
    </div>
  );
}
