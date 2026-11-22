"use client";

import { useEffect, useState } from "react";
import NextLink from "next/link";
import { apiRequest, formatPrice, formatDate } from "../../lib/api";
import { StatCard } from "../../components/dashboard/StatCard";
import { SimpleBarChart, StatusProgressBar } from "../../components/dashboard/Charts";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import { Button, Badge, Card } from "../../components/ui/primitives";
import {
  Users,
  Store,
  Pizza,
  Clock,
  Receipt,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
} from "lucide-react";

export default function AdminDashboardPage() {
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
        console.warn("Failed to fetch admin overview", err.message);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return <LoadingSpinner text="Retrieving platform metrics & administration audit data..." />;
  }

  const stats = data?.stats || {
    totalUsers: 0,
    totalVendors: 0,
    totalCustomers: 0,
    totalMenuItems: 0,
    pendingMenuItems: 0,
    approvedMenuItems: 0,
    totalTransactions: 0,
    totalRevenueUsd: 0,
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">
              Admin Platform Overview
            </h1>
            <Badge tone="danger">SYSTEM ROOT</Badge>
          </div>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
            Manage users, review vendor menu submissions, and audit platform transactions.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <NextLink
            href="/dashboard/admin/menu"
            className="btn-pizza-primary !py-2.5 !px-4 text-xs flex items-center gap-1.5"
          >
            <ShieldCheck className="h-4 w-4" />
            Review Menu ({stats.pendingMenuItems} Pending)
          </NextLink>
        </div>
      </div>

      {/* 1. OVERVIEW STATISTICS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          subtitle={`${stats.totalVendors} vendors, ${stats.totalCustomers} customers`}
          icon={Users}
          tone="primary"
        />
        <StatCard
          title="Total Menu Items"
          value={stats.totalMenuItems}
          subtitle={`${stats.approvedMenuItems} approved, ${stats.pendingMenuItems} pending`}
          icon={Pizza}
          tone="emerald"
        />
        <StatCard
          title="Pending Moderation"
          value={stats.pendingMenuItems}
          subtitle="Awaiting admin approval"
          icon={Clock}
          tone="amber"
        />
        <StatCard
          title="Stripe Transactions"
          value={stats.totalTransactions}
          subtitle={`Total Volume: ${formatPrice(stats.totalRevenueUsd)}`}
          icon={Receipt}
          tone="blue"
        />
      </div>

      {/* 2. CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StatusProgressBar
          title="Platform User Demographics"
          stats={[
            {
              label: "Customers",
              count: stats.totalCustomers,
              color: "bg-[var(--brand-primary)]",
            },
            {
              label: "Pizzeria Vendors",
              count: stats.totalVendors,
              color: "bg-amber-500",
            },
            {
              label: "Admins",
              count: 1,
              color: "bg-rose-500",
            },
          ]}
        />

        <SimpleBarChart
          title="Pizzas by Category"
          data={data?.charts?.menuByCategory || []}
          height={160}
          formatVal={(v) => `${v} items`}
        />
      </div>

      {/* 3. QUICK MANAGEMENT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/15 text-blue-600 mb-3">
              <Users className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-[var(--text-primary)]">
              User Management
            </h3>
            <p className="text-xs text-[var(--text-secondary)] mt-1">
              Search all registered vendors and customers. Block malicious users or unblock accounts.
            </p>
          </div>
          <NextLink
            href="/dashboard/admin/users"
            className="text-xs font-bold text-[var(--brand-primary)] hover:underline flex items-center gap-1"
          >
            Manage Users Table
            <ArrowRight className="h-3.5 w-3.5" />
          </NextLink>
        </Card>

        <Card className="p-6 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/15 text-amber-600 mb-3">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-[var(--text-primary)]">
              Menu Moderation
            </h3>
            <p className="text-xs text-[var(--text-secondary)] mt-1">
              Review vendor recipes. Approve quality items or reject policy violations before they appear in catalog.
            </p>
          </div>
          <NextLink
            href="/dashboard/admin/menu"
            className="text-xs font-bold text-[var(--brand-primary)] hover:underline flex items-center gap-1"
          >
            Moderate Items
            <ArrowRight className="h-3.5 w-3.5" />
          </NextLink>
        </Card>

        <Card className="p-6 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-600 mb-3">
              <Receipt className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-[var(--text-primary)]">
              Transaction Ledger
            </h3>
            <p className="text-xs text-[var(--text-secondary)] mt-1">
              Read-only Stripe subscription records. Immutable financial audit log.
            </p>
          </div>
          <NextLink
            href="/dashboard/admin/transactions"
            className="text-xs font-bold text-[var(--brand-primary)] hover:underline flex items-center gap-1"
          >
            View Transactions
            <ArrowRight className="h-3.5 w-3.5" />
          </NextLink>
        </Card>
      </div>
    </div>
  );
}
