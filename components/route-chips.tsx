import React from 'react';

interface RouteChipsProps {
  routes: string[];
}

export function RouteChips({ routes }: RouteChipsProps) {
  if (!routes || routes.length === 0) return null;

  return (
    <div className="my-5">
      <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-2">
        <span>Related Routes</span>
        <span className="flex-1 h-px bg-border" />
      </div>
      <div className="flex flex-wrap gap-2">
        {routes.map((route, i) => (
          <span
            key={i}
            className="px-2.5 py-1 rounded-full text-xs font-mono bg-muted/60 text-foreground border border-border"
          >
            {route}
          </span>
        ))}
      </div>
    </div>
  );
}
