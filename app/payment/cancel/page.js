"use client";

import { Suspense } from "react";
import NextLink from "next/link";
import { Button } from "../../components/ui/primitives";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import { XCircle, Sparkles, ArrowLeft, Store } from "lucide-react";

function CancelContent() {
  return (
    <div className="container-pizza py-16 sm:py-24 max-w-lg mx-auto text-center space-y-6">
      <div className="flex h-18 w-18 mx-auto items-center justify-center rounded-3xl bg-rose-500/15 text-rose-600 shadow-md">
        <XCircle className="h-9 w-9" />
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">
          Payment Cancelled
        </h1>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
          The Stripe checkout process was not completed. No charges were made to your
          card. Your current Free tier membership remains unchanged.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
        <NextLink
          href="/dashboard/vendor/subscription"
          className="btn-pizza-primary !py-2.5 !px-6 text-xs flex items-center justify-center gap-2 w-full sm:w-auto"
        >
          <Sparkles className="h-4 w-4" />
          Try Upgrade Again
        </NextLink>

        <NextLink
          href="/dashboard/vendor"
          className="btn-pizza-outline !py-2.5 !px-6 text-xs flex items-center justify-center gap-2 w-full sm:w-auto"
        >
          <Store className="h-4 w-4" />
          Return to Dashboard
        </NextLink>
      </div>
    </div>
  );
}

export default function PaymentCancelPage() {
  return (
    <Suspense fallback={<LoadingSpinner text="Loading..." />}>
      <CancelContent />
    </Suspense>
  );
}
