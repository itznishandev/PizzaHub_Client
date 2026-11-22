"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { apiRequest, formatPrice } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";
import { Button, Badge } from "../../components/ui/primitives";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import toast from "react-hot-toast";
import {
  CreditCard,
  ShieldCheck,
  Sparkles,
  Lock,
  ArrowRight,
  CheckCircle2,
  XCircle,
} from "lucide-react";

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { user, refreshUser } = useAuth();

  const [processing, setProcessing] = useState(false);

  const handleCompletePayment = async () => {
    try {
      setProcessing(true);
      toast("Dispatching cryptographically signed Stripe webhook...", {
        icon: "⚡",
      });

      const res = await apiRequest("/payments/webhook-dispatch", {
        method: "POST",
        body: JSON.stringify({
          sessionId,
          action: "complete",
        }),
      });

      toast.success(res.message || "Payment verified through webhook!");
      await refreshUser();
      router.push(`/payment/success?session_id=${sessionId}`);
    } catch (err) {
      toast.error(err.message || "Webhook verification failed.");
    } finally {
      setProcessing(false);
    }
  };

  const handleCancelPayment = async () => {
    try {
      setProcessing(true);
      await apiRequest("/payments/webhook-dispatch", {
        method: "POST",
        body: JSON.stringify({
          sessionId,
          action: "cancel",
        }),
      });
      router.push(`/payment/cancel?session_id=${sessionId}`);
    } catch (err) {
      router.push(`/payment/cancel?session_id=${sessionId}`);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="container-pizza py-16 max-w-xl mx-auto">
      <div className="rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 sm:p-10 shadow-xl space-y-6">
        {/* Stripe Header */}
        <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-5">
          <div className="flex items-center gap-2">
            <span className="text-xl font-black text-[#635BFF]">stripe</span>
            <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
              Checkout Gateway
            </span>
          </div>
          <Badge tone="premium">TEST CARD 4242</Badge>
        </div>

        {/* Order Summary */}
        <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-5 space-y-3">
          <div className="flex justify-between items-center text-sm font-bold text-[var(--text-primary)]">
            <span>PizzaHub Pro Vendor Subscription</span>
            <span className="text-[var(--brand-primary)]">$29.00 USD</span>
          </div>
          <p className="text-xs text-[var(--text-secondary)]">
            Includes unlimited menu items, verified kitchen badge, and featured catalog placement.
          </p>
          <div className="pt-2 border-t border-[var(--border-subtle)] flex justify-between items-center text-xs text-[var(--text-muted)]">
            <span>Billing frequency</span>
            <span>Monthly (recurring)</span>
          </div>
        </div>

        {/* Mock Card Preview */}
        <div className="space-y-3">
          <label className="block text-xs font-bold text-[var(--text-primary)]">
            Payment Card
          </label>
          <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-3.5 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2.5">
              <CreditCard className="h-4 w-4 text-[var(--brand-primary)]" />
              <span>•••• •••• •••• 4242</span>
            </div>
            <span className="text-[var(--text-muted)]">12/28</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 space-y-3">
          <Button
            variant="primary"
            size="lg"
            disabled={processing}
            onClick={handleCompletePayment}
            className="w-full flex items-center justify-center gap-2 !bg-[#635BFF] hover:!bg-[#5349e4]"
          >
            <Lock className="h-4 w-4" />
            {processing ? "Verifying Webhook Event..." : "Pay $29.00 USD & Activate"}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            disabled={processing}
            onClick={handleCancelPayment}
            className="w-full text-xs text-rose-600 hover:text-rose-700"
          >
            Cancel and Return to Pizzeria
          </Button>
        </div>

        {/* Guarantee */}
        <div className="text-center text-[11px] text-[var(--text-muted)] flex items-center justify-center gap-1.5 pt-2">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
          <span>Encrypted with Stripe Webhook Authentication Architecture</span>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<LoadingSpinner text="Connecting to payment gateway..." />}>
      <CheckoutContent />
    </Suspense>
  );
}
