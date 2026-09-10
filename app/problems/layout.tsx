'use client';

import React from 'react';
import { TopNav } from '@/components/top-nav';
import { SidebarNav } from '@/components/sidebar-nav';
import { Footer } from '@/components/footer';
import { SearchDialog } from '@/components/search-dialog';
import { usePortalI18n } from '@/components/provider';
import catalogData from '@/content/catalog-data.json';

export default function ProblemsLayout({ children }: { children: React.ReactNode }) {
  const { isSearchOpen, setIsSearchOpen } = usePortalI18n();
  const categories = catalogData.categories || [];
  const clusters = catalogData.clusters || [];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <TopNav onOpenSearch={() => setIsSearchOpen(true)} />
      
      <div className="flex-1 flex flex-col lg:flex-row w-full max-w-[1720px] mx-auto min-w-0">
        <SidebarNav clusters={clusters} categories={categories} />
        <main className="flex-1 min-w-0 flex flex-col justify-between">
          <div className="flex-1">
            {children}
          </div>
          <Footer />
        </main>
      </div>

      <SearchDialog isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </div>
  );
}
