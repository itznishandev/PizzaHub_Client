"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest, formatPrice } from "../../lib/api";
import { Modal, Button, Input, Textarea } from "../ui/primitives";
import toast from "react-hot-toast";
import { Calendar, MapPin, MessageSquare, CheckCircle, ShieldAlert } from "lucide-react";

export function OrderModal({ item, open, onClose, onOrderSuccess }) {
  const router = useRouter();
  const [deliveryDate, setDeliveryDate] = useState(
    new Date(Date.now() + 86400000).toISOString().slice(0, 10)
  );
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!item) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!deliveryDate) {
      toast.error("Please pick a delivery date.");
      return;
    }
    if (!deliveryAddress.trim()) {
      toast.error("Please provide your delivery address.");
      return;
    }

    try {
      setSubmitting(true);
      const res = await apiRequest("/orders", {
        method: "POST",
        body: JSON.stringify({
          itemId: item._id,
          deliveryDate,
          deliveryAddress: deliveryAddress.trim(),
          message: message.trim(),
        }),
      });

      toast.success(res.message || "Order submitted successfully!");
      if (onOrderSuccess) onOrderSuccess(res.order);
      onClose();
      router.push("/dashboard/customer");
    } catch (err) {
      toast.error(err.message || "Failed to submit order.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Complete Your Pizza Order"
      subtitle={`Order fresh ${item.itemName} directly to your doorstep`}
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Order Summary Card */}
        <div className="flex items-center gap-3.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-3">
          <img
            src={
              Array.isArray(item.images) && item.images.length > 0
                ? item.images[0]
                : item.image || "https://images.unsplash.com/photo-1513104890138-7c749659a591"
            }
            alt={item.itemName}
            className="h-16 w-16 rounded-lg object-cover"
          />
          <div className="flex-1">
            <h4 className="text-sm font-bold text-[var(--text-primary)]">{item.itemName}</h4>
            <p className="text-xs text-[var(--text-secondary)]">{item.category}</p>
            <p className="mt-0.5 text-sm font-extrabold text-[var(--brand-primary)]">
              {formatPrice(item.price)}
            </p>
          </div>
        </div>

        {/* Delivery Date */}
        <div>
          <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-[var(--text-primary)]">
            <Calendar className="h-3.5 w-3.5 text-[var(--brand-primary)]" />
            Delivery Date *
          </label>
          <Input
            type="date"
            min={new Date().toISOString().slice(0, 10)}
            value={deliveryDate}
            onChange={(e) => setDeliveryDate(e.target.value)}
            required
          />
        </div>

        {/* Delivery Address */}
        <div>
          <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-[var(--text-primary)]">
            <MapPin className="h-3.5 w-3.5 text-[var(--brand-primary)]" />
            Delivery Address *
          </label>
          <Input
            type="text"
            placeholder="e.g. House 42, Road 11, Banani, Dhaka"
            value={deliveryAddress}
            onChange={(e) => setDeliveryAddress(e.target.value)}
            required
          />
        </div>

        {/* Special Instructions */}
        <div>
          <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-[var(--text-primary)]">
            <MessageSquare className="h-3.5 w-3.5 text-[var(--brand-primary)]" />
            Special Instructions / Message (Optional)
          </label>
          <Textarea
            rows={2}
            placeholder="Extra crispy crust, ring the bell upon arrival, etc."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>

        {/* Payment notice: cash/instant confirmation */}
        <div className="rounded-xl bg-amber-500/10 p-3 text-xs text-amber-800 dark:text-amber-300 border border-amber-500/20 flex items-start gap-2">
          <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
          <span>
            Payment is settled upon delivery (Cash on Delivery / POS). The vendor will review and accept your order shortly.
          </span>
        </div>

        {/* Actions */}
        <div className="mt-6 flex items-center justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={submitting}>
            {submitting ? "Submitting Order..." : "Confirm & Place Order"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
