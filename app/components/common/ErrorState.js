"use client";

import { AlertTriangle, RefreshCcw } from "lucide-react";
import { Button } from "../ui/primitives";

export function ErrorState({
  title = "Something went wrong",
  message = "An unexpected error occurred while loading this section.",
  onRetry,
}) {
  return (
    <div className="rounded-3xl border border-rose-500/20 bg-rose-500/5 p-8 text-center max-w-md mx-auto space-y-4">
      <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-2xl bg-rose-500/15 text-rose-600">
        <AlertTriangle className="h-6 w-6" />
      </div>
      <div>
        <h3 className="text-base font-bold text-[var(--text-primary)]">{title}</h3>
        <p className="mt-1 text-xs text-[var(--text-secondary)] leading-relaxed">
          {message}
        </p>
      </div>
      {onRetry && (
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          className="inline-flex items-center gap-1.5 text-xs"
        >
          <RefreshCcw className="h-3.5 w-3.5" />
          Try Again
        </Button>
      )}
    </div>
  );
}
