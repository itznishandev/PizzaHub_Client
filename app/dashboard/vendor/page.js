"use client";

import { useEffect, useState } from "react";
import NextLink from "next/link";
import { apiRequest, formatPrice, formatDate } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";
import { StatCard } from "../../components/dashboard/StatCard";
import { SimpleBarChart, StatusProgressBar } from "../../components/dashboard/Charts";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import { Button, Badge, Card } from "../../components/ui/primitives";
import {
  Store,
  Pizza,
  Clock,
  CheckCircle2,
  Sparkles,
  PlusCircle,
  ArrowRight,
  TrendingUp,
} from "lucide-react";

export default function VendorDashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await apiRequest("/dashboard/overview");
        if (mounted && res?.stats) {
          setData(res);
        }
      } catch (err) {
        console.warn("Failed to fetch vendor overview", err.message);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return <LoadingSpinner text="Loading kitchen statistics & order metrics..." />;
  }

  const stats = data?.stats || {
    totalMenuItems: 0,
    activeMenuItems: 0,
    pendingMenuItems: 0,
    pendingOrders: 0,
    acceptedOrders: 0,
    totalOrders: 0,
    totalOrderRevenue: 0,
    subscriptionPlan: user?.subscriptionPlan || "free",
  };

  const isPremium = stats.subscriptionPlan === "premium";

  return (
    <div className="space-y-8">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">
              Pizzeria Kitchen Overview
            </h1>
            <Badge tone={isPremium ? "premium" : "amber"}>
              {isPremium ? "★ PREMIUM PLAN" : "FREE PLAN"}
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
            Manage your menu catalog, incoming orders, and subscription benefits.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <NextLink
            href="/dashboard/vendor/menu/add"
            className="btn-pizza-primary !py-2.5 !px-5 text-xs flex items-center gap-2"
          >
            <PlusCircle className="h-4 w-4" />
            Add New Pizza
          </NextLink>

          {!isPremium && (
            <NextLink
              href="/dashboard/vendor/subscription"
              className="btn-pizza-outline !py-2.5 !px-5 text-xs flex items-center gap-2"
            >
              <Sparkles className="h-4 w-4 text-amber-500" />
              Upgrade to Premium
            </NextLink>
          )}
        </div>
      </div>

      {/* Free Plan Limit Notice */}
      {!isPremium && (
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-amber-900 dark:text-amber-200 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-600" />
              Free Plan Notice ({stats.activeMenuItems} of 3 Active Items Used)
            </h3>
            <p className="text-xs text-amber-800 dark:text-amber-300">
              Free kitchens can publish up to 3 active menu items. Upgrade to Premium for
              unlimited pizzas, featured homepage placement, and a verified kitchen badge.
            </p>
          </div>
          <NextLink
            href="/dashboard/vendor/subscription"
            className="rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2 text-xs font-bold text-white shadow-sm hover:from-amber-600 hover:to-orange-600 self-start sm:self-auto shrink-0"
          >
            Upgrade ($29/mo)
          </NextLink>
        </div>
      )}

      {/* 1. OVERVIEW STATISTICS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Active Menu Items"
          value={`${stats.activeMenuItems} ${isPremium ? "" : "/ 3"}`}
          subtitle={`${stats.totalMenuItems} total items published`}
          icon={Store}
          tone="primary"
        />
        <StatCard
          title="Pending Customer Orders"
          value={stats.pendingOrders}
          subtitle="Waiting for kitchen confirmation"
          icon={Clock}
          tone="amber"
        />
        <StatCard
          title="Accepted Orders"
          value={stats.acceptedOrders}
          subtitle="Confirmed and baked"
          icon={CheckCircle2}
          tone="emerald"
        />
        <StatCard
          title="Current Subscription"
          value={isPremium ? "Premium" : "Free Tier"}
          subtitle={isPremium ? "Unlimited item access" : "Max 3 items cap"}
          icon={Sparkles}
          tone={isPremium ? "primary" : "amber"}
        />
      </div>

      {/* 2. CHARTS & ANALYTICS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StatusProgressBar
          title="Kitchen Order Status Distribution"
          stats={[
            {
              label: "Pending",
              count: stats.pendingOrders,
              color: "bg-amber-500",
            },
            {
              label: "Accepted",
              count: stats.acceptedOrders,
              color: "bg-emerald-500",
            },
            {
              label: "Total Orders",
              count: stats.totalOrders,
              color: "bg-[var(--brand-primary)]",
            },
          ]}
        />

        <SimpleBarChart
          title="Catalog by Pizza Category"
          data={data?.charts?.menuByCategory || []}
          height={160}
          formatVal={(v) => `${v} pizzas`}
        />
      </div>

      {/* 3. RECENT ORDERS TABLE */}
      <div className="rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 sm:p-7 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-4">
          <h2 className="text-base font-bold text-[var(--text-primary)]">
            Recent Incoming Orders
          </h2>
          <NextLink
            href="/dashboard/vendor/orders"
            className="text-xs font-bold text-[var(--brand-primary)] hover:underline flex items-center gap-1"
          >
            View All Orders
            <ArrowRight className="h-3.5 w-3.5" />
          </NextLink>
        </div>

        {Array.isArray(data?.recentOrders) && data.recentOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[var(--border-subtle)] text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                <tr>
                  <th className="pb-3">Pizza</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Delivery Date</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
                {data.recentOrders.map((ord) => (
                  <tr key={ord._id} className="hover:bg-[var(--bg-subtle)]/50">
                    <td className="py-3 font-bold text-[var(--text-primary)]">
                      {ord.itemName}
                    </td>
                    <td className="py-3 text-[var(--text-secondary)]">
                      {ord.customerName}
                    </td>
                    <td className="py-3 text-[var(--text-secondary)]">
                      {ord.deliveryDate}
                    </td>
                    <td className="py-3">
                      <Badge
                        tone={
                          ord.status === "accepted"
                            ? "success"
                            : ord.status === "rejected" || ord.status === "cancelled"
                            ? "danger"
                            : "amber"
                        }
                      >
                        {ord.status}
                      </Badge>
                    </td>
                    <td className="py-3 text-right font-bold text-[var(--brand-primary)]">
                      {formatPrice(ord.price)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-xs text-[var(--text-muted)]">
            No customer orders received yet. Make sure your menu items are published!
          </div>
        )}
      </div>
    </div>
  );
}
