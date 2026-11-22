"use client";

import { useEffect, useState } from "react";
import NextLink from "next/link";
import { apiRequest, formatPrice, formatDate } from "../../lib/api";
import { StatCard } from "../../components/dashboard/StatCard";
import { StatusProgressBar } from "../../components/dashboard/Charts";
import { TimelineModal } from "../../components/menu/TimelineModal";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import { Button, Badge, Card } from "../../components/ui/primitives";
import toast from "react-hot-toast";
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  XCircle,
  Pizza,
  MapPin,
  Calendar,
  Store,
  Eye,
  AlertTriangle,
} from "lucide-react";

export default function CustomerDashboardPage() {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    accepted: 0,
    rejected: 0,
    cancelled: 0,
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [selectedTimelineOrder, setSelectedTimelineOrder] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await apiRequest("/orders/customer");
      if (res?.orders) {
        setOrders(res.orders);
        if (res.stats) setStats(res.stats);
      }
    } catch (err) {
      console.warn("Error fetching customer orders", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCancelOrder = async (orderId) => {
    if (!confirm("Are you sure you want to cancel this pending order?")) return;

    try {
      setCancellingId(orderId);
      const res = await apiRequest(`/orders/${orderId}/cancel`, {
        method: "PATCH",
      });
      toast.success(res.message || "Order cancelled successfully.");
      await fetchOrders();
    } catch (err) {
      toast.error(err.message || "Failed to cancel order.");
    } finally {
      setCancellingId(null);
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (activeTab === "all") return true;
    return o.status === activeTab;
  });

  if (loading) {
    return <LoadingSpinner text="Retrieving your pizza orders and order timeline..." />;
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">
            Customer Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
            Track your pizza orders, live oven status, and delivery schedules.
          </p>
        </div>

        <NextLink href="/menu" className="btn-pizza-primary !py-2.5 !px-5 text-xs flex items-center gap-2 self-start">
          <Pizza className="h-4 w-4" />
          Order More Pizzas
        </NextLink>
      </div>

      {/* 1. OVERVIEW STATISTICS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Total Orders"
          value={stats.total}
          subtitle="All placed pizza orders"
          icon={ShoppingBag}
          tone="primary"
        />
        <StatCard
          title="Pending Review"
          value={stats.pending}
          subtitle="Awaiting kitchen confirmation"
          icon={Clock}
          tone="amber"
        />
        <StatCard
          title="Accepted & Baking"
          value={stats.accepted}
          subtitle="In kitchen wood-fired oven"
          icon={CheckCircle2}
          tone="emerald"
        />
        <StatCard
          title="Rejected / Cancelled"
          value={stats.rejected + stats.cancelled}
          subtitle={`${stats.rejected} rejected, ${stats.cancelled} cancelled`}
          icon={XCircle}
          tone="rose"
        />
      </div>

      {/* 2. ORDER PROGRESS DISTRIBUTION */}
      <StatusProgressBar
        title="Order Fulfillment Ratio"
        stats={[
          { label: "Pending", count: stats.pending, color: "bg-amber-500" },
          { label: "Accepted", count: stats.accepted, color: "bg-emerald-500" },
          { label: "Rejected", count: stats.rejected, color: "bg-rose-500" },
          { label: "Cancelled", count: stats.cancelled, color: "bg-neutral-400" },
        ]}
      />

      {/* 3. MY ORDERS SECTION */}
      <div className="rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 sm:p-7 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-subtle)] pb-5">
          <h2 className="text-lg font-bold text-[var(--text-primary)]">
            My Pizza Orders ({filteredOrders.length})
          </h2>

          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {["all", "pending", "accepted", "rejected", "cancelled"].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`rounded-full px-3.5 py-1 text-xs font-bold capitalize transition-all cursor-pointer shrink-0 ${
                  activeTab === tab
                    ? "bg-[var(--brand-primary)] text-white shadow-xs"
                    : "bg-[var(--bg-subtle)] text-[var(--text-secondary)] hover:bg-[var(--border-subtle)]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {filteredOrders.length > 0 ? (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const isPending = order.status === "pending";
              const isAccepted = order.status === "accepted";
              const isRejected = order.status === "rejected";
              const isCancelled = order.status === "cancelled";

              return (
                <div
                  key={order._id}
                  className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:border-[var(--border-strong)]"
                >
                  {/* Left: Pizza & Vendor Meta */}
                  <div className="flex items-start gap-4 flex-1">
                    <img
                      src={
                        order.itemImage ||
                        order.item?.images?.[0] ||
                        order.item?.image ||
                        "https://images.unsplash.com/photo-1513104890138-7c749659a591"
                      }
                      alt={order.itemName || "Pizza"}
                      className="h-20 w-20 rounded-xl object-cover shrink-0 border border-[var(--border-subtle)]"
                    />

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-bold text-[var(--text-primary)]">
                          {order.itemName || order.item?.itemName || "Artisan Pizza"}
                        </h3>
                        <Badge
                          tone={
                            isAccepted
                              ? "success"
                              : isRejected || isCancelled
                              ? "danger"
                              : "amber"
                          }
                        >
                          {order.status?.toUpperCase()}
                        </Badge>
                      </div>

                      <p className="text-xs text-[var(--text-secondary)] flex items-center gap-1.5">
                        <Store className="h-3.5 w-3.5 text-[var(--brand-primary)]" />
                        <span>Pizzeria: {order.vendorName || "Chef Kitchen"}</span>
                        <span>•</span>
                        <span className="font-bold text-[var(--brand-primary)]">
                          {formatPrice(order.price || order.item?.price)}
                        </span>
                      </p>

                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-[var(--text-muted)] pt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Delivery Target:{" "}
                          <strong className="text-[var(--text-primary)]">
                            {order.deliveryDate}
                          </strong>
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {order.deliveryAddress}
                        </span>
                      </div>

                      {order.message && (
                        <p className="text-[11px] text-[var(--text-secondary)] italic pt-0.5">
                          Note: &ldquo;{order.message}&rdquo;
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex flex-wrap items-center gap-2.5 sm:self-center border-t md:border-t-0 border-[var(--border-subtle)] pt-3 md:pt-0">
                    {/* Live Timeline Tracking Modal Button */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedTimelineOrder(order)}
                      className="flex items-center gap-1.5"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      Track Timeline
                    </Button>

                    {/* Cancel Pending Order Button */}
                    {isPending && (
                      <Button
                        variant="danger"
                        size="sm"
                        disabled={cancellingId === order._id}
                        onClick={() => handleCancelOrder(order._id)}
                      >
                        {cancellingId === order._id ? "Cancelling..." : "Cancel Order"}
                      </Button>
                    )}

                    <NextLink
                      href={`/menu/${order.itemId}`}
                      className="text-xs font-bold text-[var(--brand-primary)] hover:underline ml-2"
                    >
                      View Recipe
                    </NextLink>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-12 text-center">
            <Pizza className="mx-auto h-12 w-12 text-[var(--brand-primary)]" />
            <h3 className="mt-3 text-base font-bold text-[var(--text-primary)]">
              No Orders in This View
            </h3>
            <p className="text-xs text-[var(--text-secondary)] mt-1">
              Explore our wood-fired oven pizzas and treat yourself to hot slices!
            </p>
            <div className="mt-5">
              <NextLink href="/menu" className="btn-pizza-primary text-xs !py-2 !px-4">
                Browse Menu
              </NextLink>
            </div>
          </div>
        )}
      </div>

      {/* Order Status Timeline Modal */}
      <TimelineModal
        order={selectedTimelineOrder}
        open={Boolean(selectedTimelineOrder)}
        onClose={() => setSelectedTimelineOrder(null)}
      />
    </div>
  );
}
