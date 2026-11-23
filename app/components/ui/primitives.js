"use client";

import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { X } from "lucide-react";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}) {
  const baseClass =
    variant === "outline"
      ? "btn-pizza-outline"
      : variant === "danger"
      ? "btn-pizza-danger"
      : variant === "ghost"
      ? "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-colors cursor-pointer hover:bg-[var(--bg-subtle)] text-[var(--text-primary)]"
      : "btn-pizza-primary";

  const sizeClass =
    size === "sm"
      ? "!py-2 !px-3.5 !text-xs !rounded-lg"
      : size === "lg"
      ? "!py-3.5 !px-7 !text-base"
      : "";

  return (
    <button className={cn(baseClass, sizeClass, className)} {...props}>
      {children}
    </button>
  );
}

export function Badge({ children, tone = "neutral", className = "" }) {
  const tones = {
    neutral:
      "bg-[var(--bg-subtle)] text-[var(--text-secondary)] border-[var(--border-subtle)]",
    primary:
      "bg-[var(--brand-primary-soft)] text-[var(--brand-primary)] border-[var(--border-subtle)]",
    amber:
      "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30",
    success:
      "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
    danger:
      "bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30",
    premium:
      "bg-gradient-to-r from-amber-500 to-orange-500 text-white border-transparent shadow-sm",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold tracking-tight",
        tones[tone] || tones.neutral,
        className
      )}
    >
      {children}
    </span>
  );
}

export function Card({ children, className = "", hover = true, ...props }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-[var(--card-shadow)]",
        hover &&
          "transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--border-strong)] hover:shadow-[var(--card-shadow-hover)]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function Input({ className = "", ...props }) {
  return (
    <input
      className={cn(
        "w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-4 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] transition-all duration-200 focus:border-[var(--brand-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/20 disabled:cursor-not-allowed disabled:opacity-60",
        className
      )}
      {...props}
    />
  );
}

export function Textarea({ className = "", ...props }) {
  return (
    <textarea
      className={cn(
        "w-full min-h-[100px] rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-4 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] transition-all duration-200 focus:border-[var(--brand-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/20 disabled:cursor-not-allowed disabled:opacity-60",
        className
      )}
      {...props}
    />
  );
}

export function Select({ className = "", children, ...props }) {
  return (
    <select
      className={cn(
        "w-full cursor-pointer appearance-none rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-4 py-2.5 text-sm text-[var(--text-primary)] transition-all duration-200 focus:border-[var(--brand-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/20 disabled:cursor-not-allowed disabled:opacity-60",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
}

export function Modal({ open, onClose, title, subtitle, children, maxWidth = "max-w-xl" }) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className={cn(
          "relative max-h-[90vh] w-full overflow-y-auto rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 shadow-2xl",
          maxWidth
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-start justify-between gap-4 border-b border-[var(--border-subtle)] pb-4">
          <div>
            <h3 className="text-xl font-bold text-[var(--text-primary)]">{title}</h3>
            {subtitle && (
              <p className="mt-1 text-sm text-[var(--text-secondary)]">{subtitle}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="rounded-lg p-1.5 text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-subtle)] hover:text-[var(--text-primary)]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function Skeleton({ className = "" }) {
  return <div className={cn("skeleton-shimmer rounded-xl", className)} />;
}

export function EmptyState({ icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--border-strong)] bg-[var(--bg-surface)] px-6 py-14 text-center">
      {icon && (
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--brand-primary-soft)] text-[var(--brand-primary)]">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-bold text-[var(--text-primary)]">{title}</h3>
      <p className="mt-1.5 max-w-md text-sm text-[var(--text-secondary)]">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
