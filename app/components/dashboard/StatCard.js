"use client";

import { Card } from "../ui/primitives";

export function StatCard({ title, value, subtitle, icon: Icon, tone = "primary", change }) {
  const tones = {
    primary: "bg-[var(--brand-primary-soft)] text-[var(--brand-primary)]",
    amber: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
    emerald: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
    blue: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
    rose: "bg-rose-500/15 text-rose-600 dark:text-rose-400",
  };

  return (
    <Card className="p-5 flex items-start justify-between gap-4">
      <div className="space-y-1">
        <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
          {title}
        </p>
        <p className="text-2xl sm:text-3xl font-black text-[var(--text-primary)] tracking-tight">
          {value}
        </p>
        {subtitle && (
          <p className="text-[11px] text-[var(--text-secondary)] font-medium">
            {subtitle}
          </p>
        )}
        {change && (
          <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
            {change}
          </p>
        )}
      </div>

      {Icon && (
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
            tones[tone] || tones.primary
          }`}
        >
          <Icon className="h-6 w-6" />
        </div>
      )}
    </Card>
  );
}
