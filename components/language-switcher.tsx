'use client';

import React from 'react';
import { usePortalI18n } from './provider';
import { Languages, ChevronDown } from 'lucide-react';

export function LanguageSwitcher({ className = '' }: { className?: string }) {
  const { locale, setLocale } = usePortalI18n();

  return (
    <div className={`relative inline-flex items-center h-8 ${className}`}>
      <Languages className="w-3.5 h-3.5 absolute left-2 text-muted-foreground pointer-events-none" />
      <select
        value={locale}
        onChange={(e) => setLocale(e.target.value as 'vi' | 'en')}
        className="h-8 appearance-none bg-muted/60 hover:bg-muted text-foreground border border-border hover:border-primary/40 rounded-md pl-7 pr-5.5 text-xs font-semibold cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary transition-colors shadow-2xs"
        aria-label="Select language"
        title={locale === 'vi' ? 'Ngôn ngữ: Tiếng Việt' : 'Language: English'}
      >
        <option value="vi" className="bg-background text-foreground">
          VI
        </option>
        <option value="en" className="bg-background text-foreground">
          EN
        </option>
      </select>
      <ChevronDown className="w-3 h-3 absolute right-1.5 text-muted-foreground pointer-events-none opacity-60" />
    </div>
  );
}
