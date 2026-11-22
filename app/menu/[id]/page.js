"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import NextLink from "next/link";
import { apiRequest, formatPrice, formatDate } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";
import { OrderModal } from "../../components/menu/OrderModal";
import { ReviewModal } from "../../components/menu/ReviewModal";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import { Button, Badge, Card } from "../../components/ui/primitives";
import toast from "react-hot-toast";
import {
  MapPin,
  Store,
  Star,
  Heart,
  ShoppingBag,
  ArrowLeft,
  ShieldCheck,
  Clock,
  Sparkles,
  MessageSquare,
  AlertCircle,
} from "lucide-react";

export default function ItemDetailsPage({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const id = params?.id;

  const router = useRouter();
  const { user, loading: authLoading, isFavorite, toggleFavorite } = useAuth();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);

  // Requirement: Redirect logged-out users to Sign In
  useEffect(() => {
    if (!authLoading && !user) {
      router.push(`/login?redirect=/menu/${id}`);
    }
  }, [authLoading, user, router, id]);

  const fetchItemDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiRequest(`/menu/${id}`);
      if (res?.item) {
        setItem(res.item);
        const firstImg =
          Array.isArray(res.item.images) && res.item.images.length > 0
            ? res.item.images[0]
            : res.item.image ||
              "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80";
        setSelectedImage(firstImg);
      } else {
        setError(res?.message || "Item not found.");
      }
    } catch (err) {
      setError(err.message || "Failed to load pizza details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id && user) {
      fetchItemDetails();
    }
  }, [id, user]);

  if (authLoading || (loading && !error)) {
    return (
      <div className="container-pizza py-20">
        <LoadingSpinner text="Retrieving recipe and wood-fired oven details..." />
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="container-pizza py-20 text-center max-w-lg mx-auto">
        <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-2xl bg-rose-500/10 text-rose-600 mb-4">
          <AlertCircle className="h-8 w-8" />
        </div>
        <h2 className="text-2xl font-bold text-[var(--text-primary)]">
          Item Unavailable
        </h2>
        <p className="mt-2 text-sm text-[var(--text-secondary)]">
          {error || "The pizza menu item you requested could not be located."}
        </p>
        <div className="mt-6">
          <NextLink href="/menu" className="btn-pizza-primary inline-flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Browse Menu
          </NextLink>
        </div>
      </div>
    );
  }

  const isOwner = user && String(user._id || user.id) === String(item.vendorId);
  const isAdmin = user && user.role === "admin";
  const isVendor = user && user.role === "vendor";
  const canOrder = user && user.role === "customer" && !isOwner && !isAdmin;

  const imagesList =
    Array.isArray(item.images) && item.images.length > 0
      ? item.images
      : [item.image || "https://images.unsplash.com/photo-1513104890138-7c749659a591"];

  const favorited = isFavorite(item._id);

  return (
    <div className="container-pizza py-10 sm:py-14 space-y-12">
      {/* Breadcrumb / Back button */}
      <div>
        <NextLink
          href="/menu"
          className="inline-flex items-center gap-2 text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--brand-primary)] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Browse Menu
        </NextLink>
      </div>

      {/* Main Item Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Large Display Image */}
          <div className="relative h-80 sm:h-[420px] w-full rounded-3xl overflow-hidden border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-lg">
            <img
              src={selectedImage || imagesList[0]}
              alt={item.itemName}
              className="h-full w-full object-cover transition-all duration-300"
            />
            <div className="absolute top-4 left-4 flex gap-2">
              <Badge tone="primary">{item.category}</Badge>
              {item.vendor?.subscriptionPlan === "premium" && (
                <Badge tone="premium">★ Premium Kitchen</Badge>
              )}
            </div>

            <button
              type="button"
              onClick={() => toggleFavorite(item._id)}
              aria-label={favorited ? "Remove from wishlist" : "Add to wishlist"}
              className={`absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-xl backdrop-blur-md transition-all ${
                favorited
                  ? "bg-rose-500 text-white shadow-md shadow-rose-500/30 scale-105"
                  : "bg-black/40 text-white hover:bg-black/60 hover:scale-105"
              }`}
            >
              <Heart className={`h-5 w-5 ${favorited ? "fill-current" : ""}`} />
            </button>
          </div>

          {/* Thumbnails list */}
          {imagesList.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {imagesList.map((imgUrl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImage(imgUrl)}
                  className={`relative h-20 w-24 shrink-0 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                    selectedImage === imgUrl
                      ? "border-[var(--brand-primary)] ring-2 ring-[var(--brand-primary-soft)] scale-105"
                      : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <img
                    src={imgUrl}
                    alt={`${item.itemName} view ${idx + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Details & Ordering Actions */}
        <div className="lg:col-span-5 rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 sm:p-8 shadow-xl space-y-6">
          <div>
            <div className="flex items-center justify-between text-xs text-[var(--text-muted)] mb-2">
              <span className="flex items-center gap-1 font-bold text-amber-500 text-sm">
                <Star className="h-4 w-4 fill-current" />
                {item.averageRating ? Number(item.averageRating).toFixed(1) : "5.0"}
                <span className="text-[var(--text-muted)] font-normal text-xs">
                  ({item.reviews?.length || item.totalReviews || 12} customer reviews)
                </span>
              </span>
              <span className="flex items-center gap-1 font-semibold text-[var(--text-secondary)]">
                <MapPin className="h-3.5 w-3.5 text-[var(--brand-primary)]" />
                {item.location || "Local Delivery Area"}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">
              {item.itemName}
            </h1>

            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-3xl font-black text-[var(--brand-primary)]">
                {formatPrice(item.price)}
              </span>
              <span className="text-xs text-[var(--text-muted)]">
                Includes all taxes & packaging
              </span>
            </div>
          </div>

          <div className="border-t border-b border-[var(--border-subtle)] py-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-2">
              Description & Artisan Ingredients
            </h3>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              {item.description}
            </p>
          </div>

          {/* Vendor Kitchen Information */}
          <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--brand-primary-soft)] text-[var(--brand-primary)]">
                <Store className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-[var(--text-primary)]">
                  {item.vendor?.businessName ||
                    item.vendor?.name ||
                    item.vendorName ||
                    "Artisan Pizzeria"}
                </p>
                <p className="text-[11px] text-[var(--text-muted)]">
                  {item.vendor?.phone || "Verified Pizzeria Partner"}
                </p>
              </div>
            </div>
            {item.vendor?.subscriptionPlan === "premium" && (
              <Badge tone="premium">Premium</Badge>
            )}
          </div>

          {/* Order Actions */}
          <div className="pt-2 space-y-3">
            {canOrder ? (
              <Button
                variant="primary"
                size="lg"
                onClick={() => setOrderModalOpen(true)}
                className="w-full flex items-center justify-center gap-2 shadow-lg shadow-[var(--brand-primary)]/20"
              >
                <ShoppingBag className="h-5 w-5" />
                Order This Pizza Now
              </Button>
            ) : isOwner ? (
              <div className="rounded-xl bg-amber-500/10 p-3 text-xs text-amber-800 dark:text-amber-300 border border-amber-500/20 text-center font-medium">
                You are the vendor of this menu item. (Vendors cannot order their own items)
              </div>
            ) : isAdmin ? (
              <div className="rounded-xl bg-blue-500/10 p-3 text-xs text-blue-800 dark:text-blue-300 border border-blue-500/20 text-center font-medium">
                You are signed in as Admin. (Admins cannot place customer orders)
              </div>
            ) : isVendor ? (
              <div className="rounded-xl bg-amber-500/10 p-3 text-xs text-amber-800 dark:text-amber-300 border border-amber-500/20 text-center font-medium">
                Switch to a Customer account to place food delivery orders.
              </div>
            ) : null}

            <p className="text-center text-[11px] text-[var(--text-muted)]">
              ⚡ Prepared fresh upon order acceptance. Delivered piping hot in thermal containers.
            </p>
          </div>
        </div>
      </div>

      {/* Customer Reviews & Ratings Section (Optional Requirement 1) */}
      <section className="rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 sm:p-10 shadow-sm space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-subtle)] pb-6">
          <div>
            <h3 className="text-xl font-bold text-[var(--text-primary)]">
              Customer Reviews & Community Ratings
            </h3>
            <p className="text-xs text-[var(--text-secondary)] mt-1">
              Verified feedback from food lovers who tasted this wood-fired creation.
            </p>
          </div>

          {user && user.role === "customer" && !isOwner && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setReviewModalOpen(true)}
              className="flex items-center gap-1.5"
            >
              <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
              Write a Review
            </Button>
          )}
        </div>

        {Array.isArray(item.reviews) && item.reviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {item.reviews.map((rev, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-4 space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src={
                        rev.userImage ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          rev.userName || "Customer"
                        )}&background=C83E2B&color=fff&bold=true`
                      }
                      alt={rev.userName || "Customer"}
                      className="h-8 w-8 rounded-lg object-cover"
                    />
                    <div>
                      <p className="text-xs font-bold text-[var(--text-primary)]">
                        {rev.userName || "Pizza Lover"}
                      </p>
                      <p className="text-[10px] text-[var(--text-muted)]">
                        {formatDate(rev.createdAt || new Date())}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center text-amber-500 text-xs font-bold">
                    <Star className="h-3.5 w-3.5 fill-current mr-1" />
                    {rev.rating} / 5
                  </div>
                </div>

                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  &ldquo;{rev.comment}&rdquo;
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-xs text-[var(--text-muted)]">
            No reviews submitted yet. Be the first to taste and review this pizza!
          </div>
        )}
      </section>

      {/* Modals */}
      <OrderModal
        item={item}
        open={orderModalOpen}
        onClose={() => setOrderModalOpen(false)}
        onOrderSuccess={() => {
          toast.success("Order queued! Check Customer Dashboard for updates.");
        }}
      />

      <ReviewModal
        item={item}
        open={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        onReviewAdded={() => fetchItemDetails()}
      />
    </div>
  );
}
