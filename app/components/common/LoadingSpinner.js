"use client";

import { Pizza } from "lucide-react";

export function LoadingSpinner({ text = "Loading PizzaHub...", size = "md" }) {
  const iconSizes = {
    sm: "h-5 w-5",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
      <div className="relative flex items-center justify-center">
        <div className="absolute h-12 w-12 rounded-full border-4 border-[var(--brand-primary-soft)] border-t-[var(--brand-primary)] animate-spin" />
        <Pizza className={`${iconSizes[size]} text-[var(--brand-primary)] animate-pulse`} />
      </div>
      {text && (
        <p className="text-sm font-medium text-[var(--text-secondary)] animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
}
