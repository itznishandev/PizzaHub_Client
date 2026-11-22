"use client";

import { useState } from "react";
import { apiRequest } from "../../lib/api";
import { Modal, Button, Textarea } from "../ui/primitives";
import toast from "react-hot-toast";
import { Star } from "lucide-react";

export function ReviewModal({ item, open, onClose, onReviewAdded }) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!item) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      toast.error("Please enter your review comments.");
      return;
    }

    try {
      setSubmitting(true);
      const res = await apiRequest(`/menu/${item._id}/reviews`, {
        method: "POST",
        body: JSON.stringify({
          rating: Number(rating),
          comment: comment.trim(),
        }),
      });

      toast.success(res.message || "Review submitted successfully!");
      if (onReviewAdded) onReviewAdded(res);
      setComment("");
      onClose();
    } catch (err) {
      toast.error(err.message || "Failed to submit review.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Write a Pizza Review"
      subtitle={`Share your culinary thoughts on ${item.itemName}`}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Star Rating Selector */}
        <div>
          <label className="block text-xs font-bold text-[var(--text-primary)] mb-2">
            Your Rating (1 to 5 Stars) *
          </label>
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="p-1 text-amber-400 hover:scale-110 transition-transform cursor-pointer"
              >
                <Star
                  className={`h-7 w-7 ${
                    (hoverRating || rating) >= star
                      ? "fill-current text-amber-500"
                      : "text-neutral-300 dark:text-neutral-700"
                  }`}
                />
              </button>
            ))}
            <span className="ml-2 text-sm font-bold text-amber-500">
              {hoverRating || rating} / 5
            </span>
          </div>
        </div>

        {/* Comment input */}
        <div>
          <label className="block text-xs font-bold text-[var(--text-primary)] mb-1.5">
            Your Review *
          </label>
          <Textarea
            rows={4}
            placeholder="Tell us about the crust, toppings, flavor, cheese pull, and delivery..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          />
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
            {submitting ? "Posting Review..." : "Submit Review"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
