'use client';

import { HomeCatalog } from '@/components/home-catalog';
import { usePortalI18n } from '@/components/provider';

export default function HomePage() {
  const { setIsSearchOpen } = usePortalI18n();

  return <HomeCatalog onOpenSearch={() => setIsSearchOpen(true)} />;
}
