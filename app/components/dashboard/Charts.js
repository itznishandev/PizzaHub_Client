"use client";

import { Card } from "../ui/primitives";

export function SimpleBarChart({ title, data = [], height = 180, formatVal = (v) => v }) {
  if (!data || data.length === 0) {
    return (
      <Card className="p-5 flex items-center justify-center text-xs text-[var(--text-muted)] min-h-[220px]">
        No trend data recorded yet.
      </Card>
    );
  }

  const maxValue = Math.max(...data.map((d) => d.value), 1);

  return (
    <Card className="p-5 space-y-4">
      {title && (
        <h4 className="text-sm font-bold text-[var(--text-primary)]">{title}</h4>
      )}

      <div
        className="flex items-end gap-2 sm:gap-4 pt-4 border-b border-[var(--border-subtle)] pb-2"
        style={{ height }}
      >
        {data.map((item, idx) => {
          const heightPercent = Math.max((item.value / maxValue) * 100, 6);
          return (
            <div
              key={idx}
              className="flex-1 flex flex-col items-center justify-end h-full gap-2 group relative"
            >
              {/* Tooltip on hover */}
              <div className="absolute -top-7 opacity-0 group-hover:opacity-100 transition-opacity bg-black text-white text-[10px] font-bold py-0.5 px-2 rounded-md pointer-events-none whitespace-nowrap z-10">
                {formatVal(item.value)}
              </div>

              {/* Bar */}
              <div
                className="w-full rounded-t-lg bg-gradient-to-t from-[var(--brand-primary)] to-[var(--brand-accent)] transition-all duration-500 group-hover:brightness-110"
                style={{ height: `${heightPercent}%` }}
              />

              {/* Label */}
              <span className="text-[10px] font-semibold text-[var(--text-muted)] truncate w-full text-center">
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

export function StatusProgressBar({
  title,
  stats = [
    { label: "Pending", count: 0, color: "bg-amber-500" },
    { label: "Accepted", count: 0, color: "bg-emerald-500" },
    { label: "Rejected", count: 0, color: "bg-rose-500" },
    { label: "Cancelled", count: 0, color: "bg-neutral-400" },
  ],
}) {
  const total = stats.reduce((acc, curr) => acc + (Number(curr.count) || 0), 0);

  return (
    <Card className="p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-bold text-[var(--text-primary)]">{title}</h4>
        <span className="text-xs font-bold text-[var(--text-muted)]">
          Total: {total}
        </span>
      </div>

      {/* Progress Bar Segments */}
      <div className="flex h-3.5 w-full overflow-hidden rounded-full bg-[var(--bg-subtle)] p-0.5">
        {total === 0 ? (
          <div className="h-full w-full bg-[var(--border-subtle)] rounded-full" />
        ) : (
          stats.map((st, idx) => {
            const pct = (st.count / total) * 100;
            if (pct <= 0) return null;
            return (
              <div
                key={idx}
                className={`h-full ${st.color} transition-all duration-500`}
                style={{ width: `${pct}%` }}
                title={`${st.label}: ${st.count} (${pct.toFixed(0)}%)`}
              />
            );
          })
        )}
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
        {stats.map((st, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <span className={`h-2.5 w-2.5 rounded-full ${st.color}`} />
            <span className="text-[11px] text-[var(--text-secondary)]">
              {st.label}: <strong className="text-[var(--text-primary)]">{st.count}</strong>
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
