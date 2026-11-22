"use client";

import NextLink from "next/link";
import { Pizza, ArrowLeft, Home } from "lucide-react";
import { Button } from "./components/ui/primitives";

export default function NotFound() {
  return (
    <div className="container-pizza py-20 sm:py-32 flex flex-col items-center justify-center text-center space-y-6">
      <div className="relative">
        <span className="text-8xl sm:text-9xl font-black text-[var(--brand-primary)]/15 select-none">
          404
        </span>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--brand-primary-soft)] text-[var(--brand-primary)] shadow-lg animate-bounce">
            <Pizza className="h-8 w-8" />
          </div>
        </div>
      </div>

      <div className="space-y-2 max-w-md">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">
          Oops! Slice Not Found
        </h1>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
          Looks like this slice was eaten or never came out of the oven! The page you
          requested doesn&apos;t exist or may have been moved.
        </p>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <NextLink href="/" className="btn-pizza-primary text-xs !py-2.5 !px-5 flex items-center gap-2">
          <Home className="h-4 w-4" />
          Return to Home
        </NextLink>

        <NextLink href="/menu" className="btn-pizza-outline text-xs !py-2.5 !px-5 flex items-center gap-2">
          <Pizza className="h-4 w-4" />
          Browse Menu
        </NextLink>
      </div>
    </div>
  );
}
