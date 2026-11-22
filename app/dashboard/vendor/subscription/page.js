"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "../../../lib/api";
import { useAuth } from "../../../context/AuthContext";
import { Button, Badge, Card } from "../../../components/ui/primitives";
import toast from "react-hot-toast";
import {
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  Zap,
  ArrowRight,
  Flame,
} from "lucide-react";

export default function VendorSubscriptionPage() {
  const router = useRouter();
  const { user, refreshUser } = useAuth();
  const [upgrading, setUpgrading] = useState(false);

  const isPremium = user?.subscriptionPlan === "premium";

  const handleUpgrade = async () => {
    try {
      setUpgrading(true);
      toast("Initiating secure Stripe Checkout...", { icon: "🔒" });

      const res = await apiRequest("/payments/create-checkout-session", {
        method: "POST",
        body: JSON.stringify({}),
      });

      if (res?.checkoutUrl) {
        window.location.href = res.checkoutUrl;
      } else {
        throw new Error("Unable to establish Stripe checkout session.");
      }
    } catch (err) {
      toast.error(err.message || "Checkout initialization failed.");
    } finally {
      setUpgrading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      {/* Header */}
      <div className="text-center space-y-2">
        <span className="section-eyebrow">
          <Sparkles className="h-3.5 w-3.5 text-amber-500" />
          Subscription Plans
        </span>
        <h1 className="section-heading text-[var(--text-primary)]">
          Pizzeria Partnership Plans
        </h1>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-lg mx-auto">
          Scale your pizzeria kitchen on PizzaHub. Upgrade to Premium for unlimited
          menu items, verified kitchen status, and priority homepage promotion.
        </p>
      </div>

      {/* Plans Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        {/* 1. Free Plan Card */}
        <div
          className={`flex flex-col justify-between rounded-3xl border p-7 sm:p-8 bg-[var(--bg-surface)] shadow-sm ${
            !isPremium
              ? "border-[var(--brand-primary)] ring-2 ring-[var(--brand-primary-soft)]"
              : "border-[var(--border-subtle)]"
          }`}
        >
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-[var(--text-primary)]">
                  Starter Free Plan
                </h3>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">
                  Essential tools for home bakers & slice popups
                </p>
              </div>
              {!isPremium && <Badge tone="amber">CURRENT PLAN</Badge>}
            </div>

            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-black text-[var(--text-primary)]">$0</span>
              <span className="text-xs text-[var(--text-muted)]">/ forever free</span>
            </div>

            <ul className="space-y-3 text-xs text-[var(--text-secondary)]">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Publish up to <strong>3 active menu items</strong></span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Incoming customer order notifications</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Accept & reject order workflow</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Standard pizzeria dashboard & stats</span>
              </li>
            </ul>
          </div>

          <div className="pt-8">
            <Button
              variant="outline"
              size="md"
              disabled
              className="w-full text-center opacity-70"
            >
              {!isPremium ? "Active Plan" : "Downgrade to Free"}
            </Button>
          </div>
        </div>

        {/* 2. Premium Plan Card */}
        <div
          className={`relative flex flex-col justify-between rounded-3xl border p-7 sm:p-8 bg-[var(--bg-surface)] shadow-xl ${
            isPremium
              ? "border-emerald-500 ring-2 ring-emerald-500/20"
              : "border-amber-500/50 ring-2 ring-amber-500/20"
          }`}
        >
          {/* Top Tag */}
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
            <Badge tone="premium" className="px-3.5 py-1 text-xs shadow-md">
              ★ RECOMMENDED FOR RESTAURANTS
            </Badge>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-[var(--text-primary)]">
                  Pro Premium Plan
                </h3>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">
                  High-volume pizzerias, wood-fired bistros & franchises
                </p>
              </div>
              {isPremium && <Badge tone="success">ACTIVE SUBSCRIBER</Badge>}
            </div>

            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-black text-[var(--brand-primary)]">
                $29
              </span>
              <span className="text-xs text-[var(--text-muted)]">/ monthly billing</span>
            </div>

            <ul className="space-y-3 text-xs text-[var(--text-secondary)]">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-[var(--brand-primary)] shrink-0" />
                <span><strong>Unlimited</strong> active menu items</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-[var(--brand-primary)] shrink-0" />
                <span><strong>Featured placement</strong> on homepage catalog</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-[var(--brand-primary)] shrink-0" />
                <span>Exclusive <strong>&ldquo;★ Premium Kitchen&rdquo;</strong> verified badge</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-[var(--brand-primary)] shrink-0" />
                <span>Advanced customer ratings & reviews promotion</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-[var(--brand-primary)] shrink-0" />
                <span>Priority order dispatch and 24/7 kitchen support</span>
              </li>
            </ul>
          </div>

          <div className="pt-8">
            {isPremium ? (
              <div className="rounded-xl bg-emerald-500/10 p-3 text-center text-xs font-bold text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                You are currently enjoying full Premium benefits!
              </div>
            ) : (
              <Button
                variant="primary"
                size="lg"
                disabled={upgrading}
                onClick={handleUpgrade}
                className="w-full flex items-center justify-center gap-2 shadow-lg shadow-[var(--brand-primary)]/25"
              >
                <Sparkles className="h-4 w-4" />
                {upgrading ? "Connecting Stripe..." : "Upgrade to Premium ($29/mo)"}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Security and Stripe Guarantee */}
      <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-6 text-center text-xs text-[var(--text-secondary)] space-y-2">
        <div className="flex items-center justify-center gap-2 font-bold text-[var(--text-primary)]">
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
          <span>Stripe Certified 256-Bit Encrypted Subscription</span>
        </div>
        <p className="max-w-md mx-auto text-[11px] text-[var(--text-muted)]">
          Payments are safely verified by Stripe webhooks before membership activation.
          Cancel anytime from your dashboard.
        </p>
      </div>
    </div>
  );
}
