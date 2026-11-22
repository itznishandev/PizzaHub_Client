"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import NextLink from "next/link";
import { apiRequest, uploadImageToImgBB, PIZZA_CATEGORIES } from "../../../../lib/api";
import { useAuth } from "../../../../context/AuthContext";
import { Button, Input, Textarea, Select, Badge } from "../../../../components/ui/primitives";
import { LoadingSpinner } from "../../../../components/common/LoadingSpinner";
import toast from "react-hot-toast";
import {
  Pizza,
  Upload,
  ArrowLeft,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Image as ImageIcon,
} from "lucide-react";

export default function AddMenuItemPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [itemName, setItemName] = useState("");
  const [category, setCategory] = useState("Classic Pizzas");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState(user?.address || "Gulshan, Dhaka");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [vendorItems, setVendorItems] = useState([]);
  const [checkingCap, setCheckingCap] = useState(true);

  // Check current items cap for Free tier
  useEffect(() => {
    (async () => {
      try {
        const res = await apiRequest("/vendor/menu");
        if (res?.items) {
          setVendorItems(res.items);
        }
      } catch (err) {
        console.warn("Could not check vendor items cap", err.message);
      } finally {
        setCheckingCap(false);
      }
    })();
  }, []);

  const activeCount = vendorItems.filter((i) =>
    ["pending", "approved"].includes(i.status)
  ).length;

  const isFreePlan = user?.subscriptionPlan !== "premium";
  const hasReachedFreeCap = isFreePlan && activeCount >= 3;

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (hasReachedFreeCap) {
      toast.error(
        "You have reached the 3-item limit on the Free Plan. Please upgrade to Premium."
      );
      router.push("/dashboard/vendor/subscription");
      return;
    }

    if (!itemName.trim()) {
      toast.error("Please enter a pizza item name.");
      return;
    }
    if (!price || Number(price) <= 0) {
      toast.error("Please enter a valid price.");
      return;
    }
    if (!description.trim()) {
      toast.error("Please enter the pizza description and ingredients.");
      return;
    }
    if (!imageFile && !imagePreview) {
      toast.error("An item image is required (ImgBB upload).");
      return;
    }

    try {
      setSubmitting(true);

      // Upload file using ImgBB helper
      toast("Uploading image to ImgBB...", { icon: "☁️" });
      const imageUrl = await uploadImageToImgBB(imageFile, {
        requireAuthUpload: true,
      });

      const payload = {
        itemName: itemName.trim(),
        category,
        price: Number(price),
        location: location.trim(),
        description: description.trim(),
        image: imageUrl,
        images: [imageUrl],
      };

      const res = await apiRequest("/menu", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      toast.success(
        res.message || "Pizza published! It is now pending admin moderation."
      );
      router.push("/dashboard/vendor/menu");
    } catch (err) {
      toast.error(err.message || "Failed to publish pizza menu item.");
    } finally {
      setSubmitting(false);
    }
  };

  if (checkingCap) {
    return <LoadingSpinner text="Checking kitchen publishing quota..." />;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Breadcrumb */}
      <div>
        <NextLink
          href="/dashboard/vendor/menu"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--brand-primary)]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to My Menu Items
        </NextLink>
      </div>

      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">
          Publish a New Pizza Item
        </h1>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
          Add your artisan recipe to the PizzaHub catalog. Items are submitted as{" "}
          <span className="font-bold text-amber-600">Pending</span> until approved by an admin.
        </p>
      </div>

      {/* Free Plan Cap Warning */}
      {hasReachedFreeCap ? (
        <div className="rounded-3xl border border-amber-500/40 bg-amber-500/10 p-6 sm:p-8 text-center space-y-4">
          <div className="flex h-14 w-14 mx-auto items-center justify-center rounded-2xl bg-amber-500/20 text-amber-600">
            <Sparkles className="h-7 w-7" />
          </div>
          <h3 className="text-lg font-bold text-amber-950 dark:text-amber-100">
            Free Plan Item Limit Reached ({activeCount} / 3 Items)
          </h3>
          <p className="text-xs text-amber-800 dark:text-amber-300 max-w-md mx-auto leading-relaxed">
            Your kitchen currently has {activeCount} active menu items on the Free Plan.
            To publish unlimited recipes, receive featured placement, and get the Premium badge,
            please upgrade to Premium.
          </p>
          <div className="pt-2">
            <NextLink
              href="/dashboard/vendor/subscription"
              className="btn-pizza-primary inline-flex items-center gap-2 text-xs"
            >
              <Sparkles className="h-4 w-4" />
              Upgrade to Premium ($29/mo)
            </NextLink>
          </div>
        </div>
      ) : (
        /* Form Card */
        <div className="rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 sm:p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Item Name */}
            <div>
              <label className="block text-xs font-bold text-[var(--text-primary)] mb-1.5">
                Pizza Item Name *
              </label>
              <Input
                type="text"
                placeholder="e.g. Wood-Fired Margherita Con Bufala"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Category */}
              <div>
                <label className="block text-xs font-bold text-[var(--text-primary)] mb-1.5">
                  Category *
                </label>
                <Select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                >
                  {PIZZA_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </Select>
              </div>

              {/* Price */}
              <div>
                <label className="block text-xs font-bold text-[var(--text-primary)] mb-1.5">
                  Price ($ USD) *
                </label>
                <Input
                  type="number"
                  step="0.01"
                  min="0.99"
                  placeholder="14.99"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Location (Area / City) */}
            <div>
              <label className="block text-xs font-bold text-[var(--text-primary)] mb-1.5">
                Kitchen Location (Area / City) *
              </label>
              <Input
                type="text"
                placeholder="e.g. Gulshan-2, Dhaka"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-[var(--text-primary)] mb-1.5">
                Description, Dough Type & Ingredients *
              </label>
              <Textarea
                rows={4}
                placeholder="Describe your fermented sourdough, San Marzano tomato sauce, fresh mozzarella, extra virgin olive oil, and baking instructions..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            {/* ImgBB Required Image Upload */}
            <div>
              <label className="block text-xs font-bold text-[var(--text-primary)] mb-1.5">
                Pizza Picture (Required — Uploaded via ImgBB) *
              </label>

              <div className="rounded-2xl border-2 border-dashed border-[var(--border-strong)] bg-[var(--bg-elevated)] p-5 text-center">
                {imagePreview ? (
                  <div className="space-y-3">
                    <img
                      src={imagePreview}
                      alt="Upload preview"
                      className="h-44 w-full max-w-sm mx-auto rounded-xl object-cover shadow-sm"
                    />
                    <div>
                      <label className="cursor-pointer text-xs font-bold text-[var(--brand-primary)] hover:underline">
                        Change Picture
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                ) : (
                  <label className="cursor-pointer flex flex-col items-center justify-center space-y-2 py-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--brand-primary-soft)] text-[var(--brand-primary)]">
                      <Upload className="h-6 w-6" />
                    </div>
                    <div className="text-xs">
                      <span className="font-bold text-[var(--brand-primary)]">
                        Click to upload
                      </span>{" "}
                      <span className="text-[var(--text-muted)]">
                        or drag & drop pizza photo (JPG, PNG, WEBP)
                      </span>
                    </div>
                    <p className="text-[10px] text-[var(--text-muted)]">
                      Images are hosted on ImgBB and cached for maximum speed.
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      required
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Submit Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--border-subtle)]">
              <Button
                type="button"
                variant="ghost"
                onClick={() => router.push("/dashboard/vendor/menu")}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={submitting}>
                {submitting ? "Uploading & Publishing..." : "Submit for Moderation"}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
