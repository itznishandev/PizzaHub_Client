"use client";

import NextLink from "next/link";
import { formatPrice } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";
import { Badge } from "../ui/primitives";
import { MapPin, Store, Star, Heart, ArrowRight } from "lucide-react";

export function MenuCard({ item, onFavoriteToggle }) {
  const { isFavorite, toggleFavorite, user } = useAuth();
  const favorited = isFavorite(item._id);

  const isPremiumVendor =
    item.vendor?.subscriptionPlan === "premium" ||
    item.vendorSubscriptionPlan === "premium";

  const handleFavoriteClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onFavoriteToggle) {
      onFavoriteToggle(item._id);
    } else {
      await toggleFavorite(item._id);
    }
  };

  const primaryImage =
    Array.isArray(item.images) && item.images.length > 0
      ? item.images[0]
      : item.image ||
        "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80";

  return (
    <div className="group flex flex-col h-full rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] overflow-hidden shadow-[var(--card-shadow)] transition-all duration-300 hover:-translate-y-1.5 hover:border-[var(--border-strong)] hover:shadow-[var(--card-shadow-hover)]">
      {/* Pizza Image Frame */}
      <div className="relative h-52 sm:h-56 w-full overflow-hidden bg-[var(--bg-subtle)]">
        <img
          src={primaryImage}
          alt={item.itemName || "Pizza item"}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
          loading="lazy"
        />

        {/* Gradient Overlay for high-contrast badge legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/25 pointer-events-none" />

        {/* Category & Status Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          <span className="inline-flex items-center rounded-full bg-black/60 backdrop-blur-md px-2.5 py-0.5 text-[11px] font-bold text-white border border-white/20 shadow-xs">
            {item.category || "Pizza"}
          </span>
          {isPremiumVendor && (
            <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-2.5 py-0.5 text-[11px] font-extrabold text-white shadow-xs">
              ★ Premium Kitchen
            </span>
          )}
        </div>

        {/* Wishlist Heart Button */}
        <button
          type="button"
          onClick={handleFavoriteClick}
          aria-label={favorited ? "Remove from wishlist" : "Add to wishlist"}
          className={`absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-xl backdrop-blur-md transition-all duration-200 z-10 cursor-pointer ${
            favorited
              ? "bg-rose-500 text-white shadow-md shadow-rose-500/40 scale-105"
              : "bg-black/45 text-white hover:bg-black/75 hover:scale-105 border border-white/10"
          }`}
        >
          <Heart
            className={`h-4 w-4 transition-transform ${
              favorited ? "fill-current text-white scale-110" : "text-white"
            }`}
          />
        </button>

        {/* Price Tag Overlay */}
        <div className="absolute bottom-3 right-3 rounded-xl bg-black/80 px-3 py-1 text-sm font-black text-amber-400 backdrop-blur-md border border-white/15 shadow-md">
          {formatPrice(item.price)}
        </div>
      </div>

      {/* Card Content Area (Equal height flex column) */}
      <div className="flex flex-1 flex-col p-5 justify-between">
        <div>
          {/* Rating & Location Meta */}
          <div className="flex items-center justify-between text-xs text-[var(--text-muted)] mb-2.5">
            <span className="inline-flex items-center gap-1 font-bold text-amber-500">
              <Star className="h-3.5 w-3.5 fill-current" />
              {item.averageRating ? Number(item.averageRating).toFixed(1) : "4.9"}
              <span className="text-[var(--text-muted)] font-normal ml-0.5">
                ({item.totalReviews || 12})
              </span>
            </span>

            {item.location && (
              <span className="inline-flex items-center gap-1 text-[var(--text-secondary)] truncate max-w-[150px] font-medium">
                <MapPin className="h-3 w-3 text-[var(--brand-primary)] shrink-0" />
                <span className="truncate">{item.location}</span>
              </span>
            )}
          </div>

          {/* Pizza Title */}
          <h3 className="text-base sm:text-lg font-extrabold text-[var(--text-primary)] tracking-tight line-clamp-1 group-hover:text-[var(--brand-primary)] transition-colors">
            {item.itemName}
          </h3>

          {/* Description snippet */}
          <p className="mt-1.5 text-xs text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Card Footer: Vendor Name & Action */}
        <div className="mt-4 pt-3.5 border-t border-[var(--border-subtle)] flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] truncate max-w-[130px]">
            <Store className="h-3.5 w-3.5 text-[var(--brand-accent)] shrink-0" />
            <span className="font-semibold text-[var(--text-secondary)] truncate">
              {item.vendor?.businessName ||
                item.vendor?.name ||
                item.vendorName ||
                "PizzaHub Chef"}
            </span>
          </div>

          <NextLink
            href={`/menu/${item._id}`}
            className="inline-flex items-center gap-1 rounded-xl bg-[var(--brand-primary-soft)] hover:bg-[var(--brand-primary)] text-[var(--brand-primary)] hover:text-white px-3 py-1.5 text-xs font-bold transition-all shadow-xs group/btn"
          >
            <span>Order</span>
            <ArrowRight className="h-3 w-3 transform group-hover/btn:translate-x-0.5 transition-transform" />
          </NextLink>
        </div>
      </div>
    </div>
  );
}
