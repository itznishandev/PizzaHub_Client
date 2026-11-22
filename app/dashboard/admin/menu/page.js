"use client";

import { useEffect, useState } from "react";
import NextLink from "next/link";
import { apiRequest, formatPrice, formatDate, PIZZA_CATEGORIES } from "../../../lib/api";
import { LoadingSpinner } from "../../../components/common/LoadingSpinner";
import { Input, Select, Button, Badge } from "../../../components/ui/primitives";
import toast from "react-hot-toast";
import {
  Pizza,
  Search,
  CheckCircle2,
  XCircle,
  Trash2,
  Eye,
  Store,
  MapPin,
  Clock,
} from "lucide-react";

export default function AdminMenuModerationPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [actionId, setActionId] = useState(null);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.set("search", search.trim());
      if (statusFilter !== "all") params.set("status", statusFilter);
      if (categoryFilter !== "all") params.set("category", categoryFilter);

      const res = await apiRequest(`/admin/menu?${params.toString()}`);
      if (res?.items) {
        setItems(res.items);
      }
    } catch (err) {
      console.warn("Error fetching admin menu items", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchItems();
    }, 250);
    return () => clearTimeout(timer);
  }, [search, statusFilter, categoryFilter]);

  const handleUpdateStatus = async (itemId, newStatus) => {
    try {
      setActionId(itemId);
      const res = await apiRequest(`/admin/menu/${itemId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
      });
      toast.success(res.message || `Item status set to ${newStatus}.`);
      await fetchItems();
    } catch (err) {
      toast.error(err.message || `Failed to update status to ${newStatus}.`);
    } finally {
      setActionId(null);
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (!confirm("Are you sure you want to delete this menu item as an admin?")) return;

    try {
      setActionId(itemId);
      const res = await apiRequest(`/admin/menu/${itemId}`, {
        method: "DELETE",
      });
      toast.success(res.message || "Item deleted.");
      await fetchItems();
    } catch (err) {
      toast.error(err.message || "Failed to delete item.");
    } finally {
      setActionId(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">
            Menu Item Moderation
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
            Review vendor submissions. Approve high-quality pizzas or reject items to keep the catalog clean.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 shadow-xs grid grid-cols-1 sm:grid-cols-12 gap-4">
        <div className="sm:col-span-6 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />
          <Input
            type="text"
            placeholder="Search pizza name, ingredients, or restaurant..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="sm:col-span-3">
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Approval Statuses</option>
            <option value="pending">Pending Moderation Only</option>
            <option value="approved">Approved & Active</option>
            <option value="rejected">Rejected Only</option>
            <option value="inactive">Inactive Only</option>
          </Select>
        </div>

        <div className="sm:col-span-3">
          <Select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">All Categories</option>
            {PIZZA_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </Select>
        </div>
      </div>

      {/* Items Table */}
      {loading ? (
        <LoadingSpinner text="Searching menu submissions..." />
      ) : items.length > 0 ? (
        <div className="rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[var(--border-subtle)] bg-[var(--bg-elevated)] text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                <tr>
                  <th className="py-4 px-5">Pizza Details</th>
                  <th className="py-4 px-4">Category</th>
                  <th className="py-4 px-4">Price</th>
                  <th className="py-4 px-4">Pizzeria Vendor</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-5 text-right">Moderator Decision</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
                {items.map((item) => {
                  const isApproved = item.status === "approved";
                  const isPending = item.status === "pending";
                  const isRejected = item.status === "rejected";

                  return (
                    <tr key={item._id} className="hover:bg-[var(--bg-subtle)]/40 transition-colors">
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              Array.isArray(item.images) && item.images.length > 0
                                ? item.images[0]
                                : item.image || "https://images.unsplash.com/photo-1513104890138-7c749659a591"
                            }
                            alt={item.itemName}
                            className="h-12 w-12 rounded-xl object-cover shrink-0 border border-[var(--border-subtle)]"
                          />
                          <div>
                            <p className="font-bold text-[var(--text-primary)] text-sm">
                              {item.itemName}
                            </p>
                            <p className="text-[11px] text-[var(--text-muted)] line-clamp-1 max-w-xs">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-medium text-[var(--text-secondary)]">
                        {item.category}
                      </td>

                      <td className="py-3.5 px-4 font-extrabold text-[var(--brand-primary)]">
                        {formatPrice(item.price)}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="text-[11px] text-[var(--text-secondary)]">
                          <p className="font-bold text-[var(--text-primary)]">
                            {item.vendor?.businessName ||
                              item.vendor?.name ||
                              item.vendorName ||
                              "Pizzeria Partner"}
                          </p>
                          <p className="text-[10px] text-[var(--text-muted)] flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {item.location || "Kitchen Area"}
                          </p>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <Badge
                          tone={
                            isApproved
                              ? "success"
                              : isPending
                              ? "amber"
                              : isRejected
                              ? "danger"
                              : "neutral"
                          }
                        >
                          {item.status?.toUpperCase()}
                        </Badge>
                      </td>

                      <td className="py-3.5 px-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {isPending && (
                            <>
                              <button
                                type="button"
                                disabled={actionId === item._id}
                                onClick={() => handleUpdateStatus(item._id, "approved")}
                                className="rounded-lg bg-emerald-600 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-emerald-700 transition-colors cursor-pointer"
                                title="Approve Pizza"
                              >
                                Approve
                              </button>
                              <button
                                type="button"
                                disabled={actionId === item._id}
                                onClick={() => handleUpdateStatus(item._id, "rejected")}
                                className="rounded-lg bg-rose-600 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-rose-700 transition-colors cursor-pointer"
                                title="Reject Pizza"
                              >
                                Reject
                              </button>
                            </>
                          )}

                          {isApproved && (
                            <button
                              type="button"
                              disabled={actionId === item._id}
                              onClick={() => handleUpdateStatus(item._id, "inactive")}
                              className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-2.5 py-1 text-[11px] font-semibold text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] cursor-pointer"
                            >
                              Deactivate
                            </button>
                          )}

                          {isRejected && (
                            <button
                              type="button"
                              disabled={actionId === item._id}
                              onClick={() => handleUpdateStatus(item._id, "approved")}
                              className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/20 cursor-pointer"
                            >
                              Re-Approve
                            </button>
                          )}

                          <button
                            type="button"
                            disabled={actionId === item._id}
                            onClick={() => handleDeleteItem(item._id)}
                            className="rounded-lg p-1.5 text-rose-600 hover:bg-rose-500/10 cursor-pointer ml-1"
                            title="Delete Item"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
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
          <Pizza className="mx-auto h-12 w-12 text-[var(--brand-primary)]" />
          <h3 className="mt-3 text-lg font-bold text-[var(--text-primary)]">
            No Menu Items Found
          </h3>
          <p className="mt-1 text-xs text-[var(--text-secondary)]">
            Try resetting your search or approval status filters.
          </p>
        </div>
      )}
    </div>
  );
}
