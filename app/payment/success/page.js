"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import NextLink from "next/link";
import { apiRequest, formatDate } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";
import { Button, Badge } from "../../components/ui/primitives";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import {
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Store,
  ShieldCheck,
  Receipt,
} from "lucide-react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { user, refreshUser } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        await refreshUser();
      } catch (err) {
        console.warn("Could not refresh user session", err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [refreshUser]);

  if (loading) {
    return <LoadingSpinner text="Confirming your verified Stripe subscription..." />;
  }

  return (
    <div className="container-pizza py-16 sm:py-24 max-w-xl mx-auto text-center space-y-8">
      {/* Success Badge */}
      <div className="flex h-20 w-20 mx-auto items-center justify-center rounded-3xl bg-emerald-500/15 text-emerald-600 shadow-lg ring-8 ring-emerald-500/10">
        <CheckCircle2 className="h-10 w-10" />
      </div>

      <div className="space-y-2">
        <Badge tone="premium" className="mb-2">
          ★ VERIFIED STRIPE PAYMENT
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)] tracking-tight">
          Welcome to Premium!
        </h1>
        <p className="text-sm text-[var(--text-secondary)] max-w-md mx-auto leading-relaxed">
          Your payment was successfully confirmed through our verified Stripe webhook.
          Your pizzeria profile has been upgraded to Premium status.
        </p>
      </div>

      {/* Benefits Confirmation Box */}
      <div className="rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 text-left shadow-sm space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
          Activated Benefits
        </h4>
        <ul className="space-y-2.5 text-xs text-[var(--text-secondary)]">
          <li className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
            <span>Unlimited active pizza recipes and appetizers</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
            <span>&ldquo;★ Premium Kitchen&rdquo; badge visible to customers</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
            <span>Featured priority placement on the homepage catalog</span>
          </li>
        </ul>
      </div>

      {/* Next Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <NextLink
          href="/dashboard/vendor"
          className="btn-pizza-primary !py-3 !px-7 text-xs flex items-center justify-center gap-2 w-full sm:w-auto"
        >
          <Store className="h-4 w-4" />
          Go to Vendor Dashboard
        </NextLink>

        <NextLink
          href="/dashboard/vendor/menu/add"
          className="btn-pizza-outline !py-3 !px-7 text-xs flex items-center justify-center gap-2 w-full sm:w-auto"
        >
          Publish Another Pizza
        </NextLink>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<LoadingSpinner text="Verifying payment receipt..." />}>
      <SuccessContent />
    </Suspense>
  );
}
