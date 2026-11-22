"use client";

import { useEffect, useState } from "react";
import { apiRequest, formatPrice, formatDate } from "../../../lib/api";
import { LoadingSpinner } from "../../../components/common/LoadingSpinner";
import { Button, Badge } from "../../../components/ui/primitives";
import toast from "react-hot-toast";
import {
  Clock,
  CheckCircle2,
  XCircle,
  Pizza,
  MapPin,
  Calendar,
  User,
  MessageSquare,
  AlertCircle,
} from "lucide-react";

export default function VendorOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [activeTab, setActiveTab] = useState("all");

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await apiRequest("/orders/vendor");
      if (res?.orders) {
        setOrders(res.orders);
      }
    } catch (err) {
      console.warn("Failed to fetch vendor orders", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId, newStatus) => {
    const actionLabel = newStatus === "accepted" ? "accept" : "reject";
    if (!confirm(`Are you sure you want to ${actionLabel} this customer order?`)) return;

    try {
      setUpdatingId(orderId);
      const res = await apiRequest(`/orders/${orderId}/status`, {
        method: "PATCH",
        body: JSON.stringify({
          status: newStatus,
          note: `Order ${newStatus} by kitchen head chef.`,
        }),
      });

      toast.success(res.message || `Order has been ${newStatus}.`);
      await fetchOrders();
    } catch (err) {
      toast.error(err.message || `Failed to ${actionLabel} order.`);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (activeTab === "all") return true;
    return o.status === activeTab;
  });

  if (loading) {
    return <LoadingSpinner text="Retrieving customer order queue..." />;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">
            Customer Incoming Orders
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
            Review incoming pizza requests, confirm delivery dates, and accept orders for kitchen baking.
          </p>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none self-start">
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

      {/* Orders List */}
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
                className="rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 sm:p-6 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6"
              >
                {/* Order Details */}
                <div className="flex items-start gap-4 flex-1">
                  <img
                    src={
                      order.itemImage ||
                      order.item?.images?.[0] ||
                      order.item?.image ||
                      "https://images.unsplash.com/photo-1513104890138-7c749659a591"
                    }
                    alt={order.itemName}
                    className="h-20 w-20 rounded-2xl object-cover shrink-0 border border-[var(--border-subtle)]"
                  />

                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-bold text-[var(--text-primary)]">
                        {order.itemName}
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
                      <span className="font-extrabold text-sm text-[var(--brand-primary)] ml-auto sm:ml-0">
                        {formatPrice(order.price)}
                      </span>
                    </div>

                    {/* Customer Meta */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-xs text-[var(--text-secondary)]">
                      <p className="flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5 text-[var(--brand-primary)] shrink-0" />
                        <span>
                          Customer:{" "}
                          <strong className="text-[var(--text-primary)]">
                            {order.customerName || "Customer"}
                          </strong>
                        </span>
                      </p>

                      <p className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-[var(--brand-accent)] shrink-0" />
                        <span>
                          Delivery:{" "}
                          <strong className="text-[var(--text-primary)]">
                            {order.deliveryDate}
                          </strong>
                        </span>
                      </p>

                      <p className="flex items-center gap-1.5 sm:col-span-2">
                        <MapPin className="h-3.5 w-3.5 text-[var(--brand-primary)] shrink-0" />
                        <span className="truncate">{order.deliveryAddress}</span>
                      </p>
                    </div>

                    {order.message && (
                      <div className="rounded-xl bg-[var(--bg-elevated)] p-2.5 text-xs text-[var(--text-secondary)] flex items-start gap-1.5 mt-2">
                        <MessageSquare className="h-3.5 w-3.5 text-[var(--brand-primary)] shrink-0 mt-0.5" />
                        <span className="italic">&ldquo;{order.message}&rdquo;</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Status Update Actions */}
                <div className="border-t lg:border-t-0 border-[var(--border-subtle)] pt-4 lg:pt-0 shrink-0">
                  {isPending ? (
                    <div className="flex items-center gap-2.5">
                      <Button
                        variant="primary"
                        size="sm"
                        disabled={updatingId === order._id}
                        onClick={() => handleUpdateStatus(order._id, "accepted")}
                        className="flex items-center gap-1.5 !bg-emerald-600 hover:!bg-emerald-700"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        {updatingId === order._id ? "Updating..." : "Accept & Bake"}
                      </Button>

                      <Button
                        variant="danger"
                        size="sm"
                        disabled={updatingId === order._id}
                        onClick={() => handleUpdateStatus(order._id, "rejected")}
                        className="flex items-center gap-1.5"
                      >
                        <XCircle className="h-4 w-4" />
                        Reject
                      </Button>
                    </div>
                  ) : (
                    <span className="text-xs text-[var(--text-muted)] font-medium">
                      Order finalized ({order.status})
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-[var(--border-strong)] bg-[var(--bg-surface)] p-12 text-center max-w-md mx-auto">
          <Clock className="mx-auto h-12 w-12 text-[var(--brand-primary)]" />
          <h3 className="mt-3 text-lg font-bold text-[var(--text-primary)]">
            No Orders in This Category
          </h3>
          <p className="mt-1 text-xs text-[var(--text-secondary)]">
            Any incoming pizza orders for your restaurant will be queued right here.
          </p>
        </div>
      )}
    </div>
  );
}
