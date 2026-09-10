'use client';

import React from 'react';
import { TopNav } from '@/components/top-nav';
import { Footer } from '@/components/footer';
import { SearchDialog } from '@/components/search-dialog';
import { usePortalI18n } from '@/components/provider';

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  const { isSearchOpen, setIsSearchOpen } = usePortalI18n();

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <TopNav onOpenSearch={() => setIsSearchOpen(true)} />
      <main className="flex-1">{children}</main>
      <Footer />
      <SearchDialog isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </div>
  );
}
