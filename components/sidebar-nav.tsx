'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ChevronDown,
  ChevronRight,
  ShieldCheck,
  Server,
  Landmark,
  Bot,
  Search,
  X,
  Layers,
  Sparkles,
} from 'lucide-react';
import type { ClusterGroup, CategoryGroup } from '@/lib/catalog';
import { usePortalI18n } from './provider';

interface SidebarNavProps {
  clusters?: ClusterGroup[];
  categories?: CategoryGroup[];
}

const CLUSTER_ICONS: Record<string, React.ElementType> = {
  security: ShieldCheck,
  platform: Server,
  core: Landmark,
  ai: Bot,
};

export function SidebarNav({ clusters = [], categories = [] }: SidebarNavProps) {
  const pathname = usePathname();
  const { locale } = usePortalI18n();
  const [filterQuery, setFilterQuery] = useState('');

  // Active code: e.g. "/problems/auth.error.forbidden/" -> "auth.error.forbidden"
  const activeCode = pathname.replace(/^\/problems\//, '').replace(/\/$/, '');

  // Locate the cluster and category for the active code
  const { activeClusterId, activeCategoryId } = useMemo(() => {
    for (const cluster of clusters) {
      for (const cat of cluster.categories) {
        if (cat.items.some((i) => i.code === activeCode)) {
          return { activeClusterId: cluster.id, activeCategoryId: cat.id };
        }
      }
    }
    return { activeClusterId: null, activeCategoryId: null };
  }, [clusters, activeCode]);

  // Keep clusters open by default
  const [openClusters, setOpenClusters] = useState<Record<string, boolean>>(() => {
    const map: Record<string, boolean> = {};
    for (const c of clusters) {
      map[c.id] = true;
    }
    return map;
  });

  // Track open state for categories
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>(() => {
    const map: Record<string, boolean> = {};
    for (const c of clusters) {
      for (const cat of c.categories) {
        map[cat.id] = cat.id === activeCategoryId || cat.id === 'auth';
      }
    }
    return map;
  });

  const toggleCluster = (id: string) => {
    setOpenClusters((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleCategory = (id: string) => {
    setOpenCategories((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const normalizedQuery = filterQuery.trim().toLowerCase();

  const totalCodesCount = useMemo(() => {
    return clusters.reduce((acc, c) => acc + c.totalCodes, 0);
  }, [clusters]);

  return (
    <aside className="w-full lg:w-72 xl:w-80 shrink-0 border-r border-border bg-[#fafbfc] dark:bg-[#0c121e] lg:sticky lg:top-[52px] lg:h-[calc(100vh-52px)] overflow-y-auto p-3.5 space-y-3.5 text-xs select-none transition-colors">
      {/* Header & Instant Filter */}
      <div className="space-y-2.5 pb-3 border-b border-border">
        <div className="flex items-center justify-between text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
          <span>{locale === 'vi' ? 'MÃ LỖI RFC 7807' : 'ERROR SPECIFICATIONS'}</span>
          <span className="font-mono text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground border border-border">
            {totalCodesCount}
          </span>
        </div>

        {/* Quick Filter Box */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            placeholder={locale === 'vi' ? 'Lọc mã lỗi (vd: auth, 401)...' : 'Filter errors (e.g. auth, 401)...'}
            className="w-full pl-8 pr-7 py-1.5 rounded-md text-xs bg-background text-foreground border border-border placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all shadow-2xs"
          />
          {filterQuery && (
            <button
              type="button"
              onClick={() => setFilterQuery('')}
              className="absolute right-2 top-2 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Cluster Navigation Hierarchy */}
      <nav className="space-y-3.5">
        {clusters.map((cluster) => {
          const ClusterIcon = CLUSTER_ICONS[cluster.id] || Layers;
          const isClusterOpen = openClusters[cluster.id] ?? true;
          const isClusterActive = cluster.id === activeClusterId;

          const filteredCategories = cluster.categories
            .map((cat) => {
              const matchedItems = normalizedQuery
                ? cat.items.filter(
                    (i) =>
                      i.code.toLowerCase().includes(normalizedQuery) ||
                      i.title.toLowerCase().includes(normalizedQuery) ||
                      String(i.status).includes(normalizedQuery)
                  )
                : cat.items;

              return {
                ...cat,
                items: matchedItems,
              };
            })
            .filter((cat) => cat.items.length > 0);

          if (normalizedQuery && filteredCategories.length === 0) {
            return null;
          }

          const clusterTitle = locale === 'vi' ? cluster.title_vi : cluster.title;

          return (
            <div key={cluster.id} className="space-y-1">
              {/* Level 1: Domain Cluster Header */}
              <button
                type="button"
                onClick={() => toggleCluster(cluster.id)}
                className={`w-full flex items-center justify-between px-2 py-1.5 rounded-md text-left transition-colors cursor-pointer ${
                  isClusterActive
                    ? 'text-primary font-bold bg-primary/10'
                    : 'text-foreground/80 hover:text-foreground hover:bg-muted/60'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <ClusterIcon className="w-3.5 h-3.5 text-primary shrink-0" />
                  <span className="text-[11.5px] font-bold tracking-tight uppercase truncate">
                    {clusterTitle}
                  </span>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <span className="font-mono text-[10px] text-muted-foreground">
                    {filteredCategories.reduce((sum, c) => sum + c.items.length, 0)}
                  </span>
                  {isClusterOpen ? (
                    <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                  )}
                </div>
              </button>

              {/* Level 2: Categories */}
              {isClusterOpen && (
                <div className="ml-2.5 pl-2 border-l border-border/80 space-y-1">
                  {filteredCategories.map((cat) => {
                    const isCatOpen = normalizedQuery ? true : (openCategories[cat.id] ?? false);
                    const containsActive = cat.items.some((i) => i.code === activeCode);
                    const catTitle = locale === 'vi' ? (cat.title_vi || cat.title) : cat.title;

                    return (
                      <div key={cat.id} className="space-y-0.5">
                        <button
                          type="button"
                          onClick={() => toggleCategory(cat.id)}
                          className={`w-full flex items-center justify-between py-1 px-1.5 rounded text-left transition-colors cursor-pointer ${
                            containsActive
                              ? 'text-foreground font-semibold bg-muted'
                              : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                          }`}
                        >
                          <div className="flex items-center gap-1.5 truncate">
                            {isCatOpen ? (
                              <ChevronDown className="w-3 h-3 text-muted-foreground shrink-0" />
                            ) : (
                              <ChevronRight className="w-3 h-3 text-muted-foreground shrink-0" />
                            )}
                            <span className="truncate text-xs">{catTitle}</span>
                          </div>
                          <span className="font-mono text-[9px] text-muted-foreground ml-1">
                            {cat.items.length}
                          </span>
                        </button>

                        {/* Level 3: Error Codes */}
                        {isCatOpen && (
                          <div className="ml-2.5 pl-1.5 border-l border-border/50 space-y-0.5 animate-in fade-in-50 duration-75">
                            {cat.items.map((item) => {
                              const isActive = item.code === activeCode;
                              const is5xx = item.status >= 500;

                              return (
                                <Link
                                  key={item.code}
                                  href={`/problems/${item.code}/`}
                                  className={`group flex items-center justify-between py-1 px-2 rounded text-[11px] font-mono transition-colors border-l-2 ${
                                    isActive
                                      ? 'border-primary bg-primary/10 text-primary font-semibold'
                                      : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/60'
                                  }`}
                                  title={`${item.status} - ${item.title}`}
                                >
                                  <span className="truncate">{item.code}</span>
                                  <span
                                    className={`text-[9px] px-1 py-0.5 rounded font-mono shrink-0 ml-1.5 border ${
                                      is5xx
                                        ? 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20'
                                        : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                                    }`}
                                  >
                                    {item.status}
                                  </span>
                                </Link>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
