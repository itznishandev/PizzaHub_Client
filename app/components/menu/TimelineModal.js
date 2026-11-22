"use client";

import { Modal, Badge } from "../ui/primitives";
import { formatDate } from "../../lib/api";
import { CheckCircle2, Clock, XCircle, Flame, Truck, PackageCheck } from "lucide-react";

export function TimelineModal({ order, open, onClose }) {
  if (!order) return null;

  const isCancelled = order.status === "cancelled";
  const isRejected = order.status === "rejected";
  const isAccepted = order.status === "accepted";
  const isPending = order.status === "pending";

  const steps = [
    {
      title: "Order Submitted",
      description: "Order received and queued for vendor kitchen confirmation.",
      timestamp: formatDate(order.createdAt, true),
      status: "completed",
      icon: Clock,
    },
    {
      title: isRejected
        ? "Order Rejected"
        : isCancelled
        ? "Order Cancelled"
        : "Vendor Confirmation",
      description: isRejected
        ? "The vendor was unable to fulfill this order."
        : isCancelled
        ? "Order cancelled by customer before kitchen preparation."
        : isAccepted
        ? "Order accepted by vendor! Ingredients prepped."
        : "Awaiting vendor review and acceptance.",
      timestamp:
        isAccepted || isRejected || isCancelled
          ? formatDate(order.updatedAt || order.createdAt, true)
          : "Pending confirmation",
      status: isRejected || isCancelled ? "error" : isAccepted ? "completed" : "pending",
      icon: isRejected || isCancelled ? XCircle : CheckCircle2,
    },
    {
      title: "Wood-Fired Oven Baking",
      description: isAccepted
        ? "Hand-tossed dough crafted, sauces spread, and baked to perfection."
        : "Starts following vendor acceptance.",
      timestamp: isAccepted ? "In Kitchen Oven" : "Awaiting step",
      status: isAccepted ? "active" : "pending",
      icon: Flame,
    },
    {
      title: "Hot Delivery Arrival",
      description: `Dispatched to: ${order.deliveryAddress || "Customer address"} on ${order.deliveryDate || "Target Date"}.`,
      timestamp: `Scheduled for ${order.deliveryDate || "Soon"}`,
      status: "pending",
      icon: Truck,
    },
  ];

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Order Status & Progress Timeline"
      subtitle={`Tracking Order ID #${String(order._id || "").slice(-8).toUpperCase()}`}
      maxWidth="max-w-lg"
    >
      <div className="py-2">
        {/* Status header badge */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-[var(--border-subtle)]">
          <span className="text-xs font-bold text-[var(--text-secondary)]">Current Status:</span>
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

        {/* Timeline Steps */}
        <div className="relative pl-6 space-y-7 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-[var(--border-strong)]">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isCompleted = step.status === "completed";
            const isError = step.status === "error";
            const isActive = step.status === "active";

            return (
              <div key={idx} className="relative group">
                {/* Timeline Icon Marker */}
                <div
                  className={`absolute -left-6 flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all ${
                    isError
                      ? "bg-rose-500 text-white border-rose-500"
                      : isCompleted
                      ? "bg-emerald-500 text-white border-emerald-500"
                      : isActive
                      ? "bg-[var(--brand-primary)] text-white border-[var(--brand-primary)] animate-pulse"
                      : "bg-[var(--bg-surface)] text-[var(--text-muted)] border-[var(--border-strong)]"
                  }`}
                >
                  <Icon className="h-3 w-3" />
                </div>

                {/* Step Info */}
                <div className="ml-2">
                  <div className="flex items-center justify-between">
                    <h5
                      className={`text-sm font-bold ${
                        isError
                          ? "text-rose-600 dark:text-rose-400"
                          : isCompleted || isActive
                          ? "text-[var(--text-primary)]"
                          : "text-[var(--text-muted)]"
                      }`}
                    >
                      {step.title}
                    </h5>
                    <span className="text-[11px] font-medium text-[var(--text-muted)]">
                      {step.timestamp}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-[var(--text-secondary)] leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Modal>
  );
}
