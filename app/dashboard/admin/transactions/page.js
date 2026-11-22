"use client";

import { useEffect, useState } from "react";
import { apiRequest, formatPrice, formatDate } from "../../../lib/api";
import { LoadingSpinner } from "../../../components/common/LoadingSpinner";
import { StatCard } from "../../../components/dashboard/StatCard";
import { Badge, Card } from "../../../components/ui/primitives";
import { Receipt, ShieldCheck, DollarSign, Store, Lock } from "lucide-react";

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const res = await apiRequest("/admin/transactions");
        if (res?.transactions) {
          setTransactions(res.transactions);
          const revenue = res.transactions
            .filter((t) => t.status === "completed" || t.status === "succeeded")
            .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
          setTotalRevenue(revenue);
        }
      } catch (err) {
        console.warn("Failed to fetch admin transactions", err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Auditing Stripe subscription transactions..." />;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">
              Platform Transaction Ledger
            </h1>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 bg-amber-500/15 px-2.5 py-0.5 rounded-full border border-amber-500/20">
              <Lock className="h-3 w-3" />
              Immutable Read-Only
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
            Verified Stripe webhook records and vendor Premium subscriptions. Records cannot be manually altered.
          </p>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard
          title="Total Transactions"
          value={transactions.length}
          subtitle="All subscription payment attempts"
          icon={Receipt}
          tone="primary"
        />
        <StatCard
          title="Successful Volume"
          value={formatPrice(totalRevenue)}
          subtitle="Verified through Stripe webhooks"
          icon={DollarSign}
          tone="emerald"
        />
        <StatCard
          title="Security Protocol"
          value="HMAC SHA-256"
          subtitle="Cryptographically verified signatures"
          icon={ShieldCheck}
          tone="blue"
        />
      </div>

      {/* Transactions Table */}
      {transactions.length > 0 ? (
        <div className="rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[var(--border-subtle)] bg-[var(--bg-elevated)] text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                <tr>
                  <th className="py-4 px-5">Pizzeria Vendor</th>
                  <th className="py-4 px-4">Plan</th>
                  <th className="py-4 px-4">Amount</th>
                  <th className="py-4 px-4">Stripe Session ID</th>
                  <th className="py-4 px-4">Payment Status</th>
                  <th className="py-4 px-5 text-right">Transaction Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
                {transactions.map((tx) => {
                  const isSuccess =
                    tx.status === "completed" || tx.status === "succeeded";
                  const isPending = tx.status === "pending";

                  return (
                    <tr key={tx._id} className="hover:bg-[var(--bg-subtle)]/40 transition-colors">
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--brand-primary-soft)] text-[var(--brand-primary)]">
                            <Store className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-bold text-[var(--text-primary)]">
                              {tx.businessName || tx.vendorName || "Pizzeria Vendor"}
                            </p>
                            <p className="text-[10px] text-[var(--text-muted)]">
                              {tx.vendorEmail}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-bold uppercase text-[var(--text-secondary)]">
                        {tx.plan || "Premium"}
                      </td>

                      <td className="py-3.5 px-4 font-black text-emerald-600 dark:text-emerald-400">
                        {formatPrice(tx.amount)} {tx.currency?.toUpperCase() || "USD"}
                      </td>

                      <td className="py-3.5 px-4 font-mono text-[10px] text-[var(--text-muted)]">
                        {tx.stripeSessionId ? `${tx.stripeSessionId.slice(0, 16)}...` : "—"}
                      </td>

                      <td className="py-3.5 px-4">
                        <Badge
                          tone={
                            isSuccess ? "success" : isPending ? "amber" : "danger"
                          }
                        >
                          {tx.status?.toUpperCase()}
                        </Badge>
                      </td>

                      <td className="py-3.5 px-5 text-right text-[var(--text-secondary)]">
                        {formatDate(tx.createdAt, true)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-[var(--border-strong)] bg-[var(--bg-surface)] p-12 text-center max-w-md mx-auto">
          <Receipt className="mx-auto h-12 w-12 text-[var(--brand-primary)]" />
          <h3 className="mt-3 text-lg font-bold text-[var(--text-primary)]">
            No Transactions Recorded
          </h3>
          <p className="mt-1 text-xs text-[var(--text-secondary)]">
            When vendors upgrade to Premium through Stripe Checkout, verified transaction records will appear here.
          </p>
        </div>
      )}
    </div>
  );
}
