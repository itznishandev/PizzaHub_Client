"use client";

import { useEffect, useState } from "react";
import NextLink from "next/link";
import { apiRequest, formatPrice, formatDate } from "../../../lib/api";
import { LoadingSpinner } from "../../../components/common/LoadingSpinner";
import { Button, Badge, Modal, Input, Textarea, Select } from "../../../components/ui/primitives";
import toast from "react-hot-toast";
import {
  Store,
  PlusCircle,
  Edit2,
  Trash2,
  Eye,
  MapPin,
  Sparkles,
  AlertTriangle,
} from "lucide-react";

export default function VendorMenuItemsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCount, setActiveCount] = useState(0);
  const [maxFreeItems, setMaxFreeItems] = useState(3);
  const [subscriptionPlan, setSubscriptionPlan] = useState("free");

  // Edit Modal State
  const [editingItem, setEditingItem] = useState(null);
  const [editPrice, setEditPrice] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [editSaving, setEditSaving] = useState(false);

  // Delete State
  const [deletingId, setDeletingId] = useState(null);

  const fetchVendorItems = async () => {
    setLoading(true);
    try {
      const res = await apiRequest("/vendor/menu");
      if (res?.items) {
        setItems(res.items);
        setActiveCount(res.activeCount || 0);
        setMaxFreeItems(res.maxFreeItems || 3);
        setSubscriptionPlan(res.subscriptionPlan || "free");
      }
    } catch (err) {
      console.warn("Error fetching vendor menu", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendorItems();
  }, []);

  const openEditModal = (item) => {
    setEditingItem(item);
    setEditPrice(String(item.price || ""));
    setEditDescription(item.description || "");
    setEditLocation(item.location || "");
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editPrice || Number(editPrice) <= 0) {
      toast.error("Please enter a valid price.");
      return;
    }
    if (!editDescription.trim()) {
      toast.error("Please enter a description.");
      return;
    }

    try {
      setEditSaving(true);
      const res = await apiRequest(`/menu/${editingItem._id}`, {
        method: "PUT",
        body: JSON.stringify({
          price: Number(editPrice),
          description: editDescription.trim(),
          location: editLocation.trim(),
        }),
      });

      toast.success(res.message || "Menu item updated successfully!");
      setEditingItem(null);
      await fetchVendorItems();
    } catch (err) {
      toast.error(err.message || "Failed to update item.");
    } finally {
      setEditSaving(false);
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (!confirm("Are you sure you want to permanently delete this menu item?")) return;

    try {
      setDeletingId(itemId);
      const res = await apiRequest(`/menu/${itemId}`, {
        method: "DELETE",
      });
      toast.success(res.message || "Item deleted successfully.");
      await fetchVendorItems();
    } catch (err) {
      toast.error(err.message || "Failed to delete item.");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Retrieving your pizzeria catalog..." />;
  }

  const isFreePlan = subscriptionPlan === "free";

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">
            My Menu Items
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
            Review, edit, and manage all pizzas published under your restaurant profile.
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
        </div>
      </div>

      {/* Plan Capacity Bar */}
      {isFreePlan && (
        <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div>
            <span className="font-bold text-[var(--text-primary)]">
              Free Plan Item Usage:{" "}
            </span>
            <span className="font-extrabold text-[var(--brand-primary)]">
              {activeCount} of {maxFreeItems} Active Items
            </span>
            <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
              Active items include pending review and approved items. Upgrade to publish unlimited recipes.
            </p>
          </div>
          <NextLink
            href="/dashboard/vendor/subscription"
            className="btn-pizza-outline !py-1.5 !px-3 text-xs self-start sm:self-auto"
          >
            Upgrade to Premium
          </NextLink>
        </div>
      )}

      {/* Items Table / Cards */}
      {items.length > 0 ? (
        <div className="rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[var(--border-subtle)] bg-[var(--bg-elevated)] text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                <tr>
                  <th className="py-4 px-5">Pizza Item</th>
                  <th className="py-4 px-4">Category</th>
                  <th className="py-4 px-4">Price</th>
                  <th className="py-4 px-4">Location</th>
                  <th className="py-4 px-4">Approval Status</th>
                  <th className="py-4 px-5 text-right">Actions</th>
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

                      <td className="py-3.5 px-4 text-[var(--text-secondary)]">
                        {item.location || "Kitchen Area"}
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
                        <div className="flex items-center justify-end gap-2">
                          {isApproved && (
                            <NextLink
                              href={`/menu/${item._id}`}
                              className="rounded-lg p-1.5 text-[var(--text-muted)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-primary)]"
                              title="View Public Page"
                            >
                              <Eye className="h-4 w-4" />
                            </NextLink>
                          )}

                          <button
                            type="button"
                            onClick={() => openEditModal(item)}
                            className="rounded-lg p-1.5 text-blue-600 hover:bg-blue-500/10 cursor-pointer"
                            title="Edit Item"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>

                          <button
                            type="button"
                            disabled={deletingId === item._id}
                            onClick={() => handleDeleteItem(item._id)}
                            className="rounded-lg p-1.5 text-rose-600 hover:bg-rose-500/10 cursor-pointer"
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
          <Store className="mx-auto h-12 w-12 text-[var(--brand-primary)]" />
          <h3 className="mt-3 text-lg font-bold text-[var(--text-primary)]">
            No Menu Items Published
          </h3>
          <p className="mt-1 text-xs text-[var(--text-secondary)]">
            Publish your first pizza recipe to start receiving orders from local customers.
          </p>
          <div className="mt-5">
            <NextLink
              href="/dashboard/vendor/menu/add"
              className="btn-pizza-primary text-xs !py-2 !px-4"
            >
              Add First Pizza
            </NextLink>
          </div>
        </div>
      )}

      {/* Edit Item Modal */}
      {editingItem && (
        <Modal
          open={Boolean(editingItem)}
          onClose={() => setEditingItem(null)}
          title={`Edit ${editingItem.itemName}`}
          subtitle="Update price, description, and kitchen location"
          maxWidth="max-w-md"
        >
          <form onSubmit={handleSaveEdit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[var(--text-primary)] mb-1">
                Price ($ USD) *
              </label>
              <Input
                type="number"
                step="0.01"
                min="1"
                value={editPrice}
                onChange={(e) => setEditPrice(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[var(--text-primary)] mb-1">
                Kitchen / Pickup Location
              </label>
              <Input
                type="text"
                value={editLocation}
                onChange={(e) => setEditLocation(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[var(--text-primary)] mb-1">
                Description & Ingredients *
              </label>
              <Textarea
                rows={3}
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                required
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setEditingItem(null)}
                disabled={editSaving}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={editSaving}>
                {editSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
