"use client";

import { useEffect, useState } from "react";
import NextLink from "next/link";
import { apiRequest } from "../../../lib/api";
import { useAuth } from "../../../context/AuthContext";
import { MenuCard } from "../../../components/menu/MenuCard";
import { LoadingSpinner } from "../../../components/common/LoadingSpinner";
import { Button } from "../../../components/ui/primitives";
import { Heart, Pizza, ArrowLeft } from "lucide-react";

export default function CustomerFavoritesPage() {
  const { user, toggleFavorite } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = async () => {
    setLoading(true);
    try {
      const res = await apiRequest("/auth/favorites");
      if (res?.items) {
        setItems(res.items);
      }
    } catch (err) {
      console.warn("Error fetching favorites", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const handleToggle = async (itemId) => {
    await toggleFavorite(itemId);
    setItems((prev) => prev.filter((i) => i._id !== itemId));
  };

  if (loading) {
    return <LoadingSpinner text="Retrieving your favorite pizzas..." />;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight flex items-center gap-2.5">
            <Heart className="h-7 w-7 text-rose-500 fill-rose-500" />
            Saved Wishlist
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
            Your personal collection of favorite pizzas and cravings ready for instant ordering.
          </p>
        </div>

        <NextLink
          href="/menu"
          className="btn-pizza-outline !py-2.5 !px-5 text-xs flex items-center gap-2 self-start"
        >
          <Pizza className="h-4 w-4" />
          Explore More Pizzas
        </NextLink>
      </div>

      {items.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <MenuCard key={item._id} item={item} onFavoriteToggle={handleToggle} />
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-[var(--border-strong)] bg-[var(--bg-surface)] p-12 text-center max-w-md mx-auto">
          <Heart className="mx-auto h-12 w-12 text-rose-400" />
          <h3 className="mt-3 text-lg font-bold text-[var(--text-primary)]">
            Your Wishlist is Empty
          </h3>
          <p className="mt-1 text-xs text-[var(--text-secondary)] leading-relaxed">
            Click the heart icon on any pizza card across PizzaHub to save your favorite slices here.
          </p>
          <div className="mt-5">
            <NextLink href="/menu" className="btn-pizza-primary text-xs !py-2 !px-4">
              Browse Menu
            </NextLink>
          </div>
        </div>
      )}
    </div>
  );
}
