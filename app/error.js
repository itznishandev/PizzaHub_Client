"use client";

import { useEffect } from "react";
import NextLink from "next/link";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";
import { Button } from "./components/ui/primitives";

export default function ErrorBoundary({ error, reset }) {
  useEffect(() => {
    console.error("Unhandled Route Exception:", error);
  }, [error]);

  return (
    <div className="container-pizza py-20 sm:py-28 flex flex-col items-center justify-center text-center space-y-6">
      <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-2xl bg-rose-500/15 text-rose-600 shadow-md">
        <AlertTriangle className="h-8 w-8" />
      </div>

      <div className="space-y-2 max-w-md">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">
          System Temporarily Interrupted
        </h1>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
          {error?.message || "An unexpected error occurred while processing this request."}
        </p>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <Button
          variant="primary"
          size="md"
          onClick={() => reset()}
          className="flex items-center gap-2 text-xs"
        >
          <RotateCcw className="h-4 w-4" />
          Reload Page
        </Button>

        <NextLink href="/" className="btn-pizza-outline text-xs !py-2.5 !px-5 flex items-center gap-2">
          <Home className="h-4 w-4" />
          Back to Home
        </NextLink>
      </div>
    </div>
  );
}
