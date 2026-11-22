"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { apiRequest, PIZZA_CATEGORIES } from "../lib/api";
import { MenuCard } from "../components/menu/MenuCard";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import { Input, Select, Button, Badge } from "../components/ui/primitives";
import {
  Search,
  Filter,
  ArrowUpDown,
  MapPin,
  Pizza,
  RotateCcw,
  Sparkles,
} from "lucide-react";

function BrowseMenuContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [locations, setLocations] = useState([]);

  // Filter States
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "All");
  const [location, setLocation] = useState(searchParams.get("location") || "All");
  const [sort, setSort] = useState(searchParams.get("sort") || "featured");

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.set("search", search.trim());
      if (category && category !== "All") params.set("category", category);
      if (location && location !== "All") params.set("location", location);
      if (sort) params.set("sort", sort);

      const res = await apiRequest(`/menu?${params.toString()}`);
      if (res?.items) {
        setItems(res.items);
      }

      // Collect unique locations from returned/all items
      if (res?.locations && Array.isArray(res.locations)) {
        setLocations(res.locations);
      }
    } catch (err) {
      console.warn("Error fetching menu items", err.message);
    } finally {
      setLoading(false);
    }
  }, [search, category, location, sort]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchItems();
    }, 250);
    return () => clearTimeout(timer);
  }, [fetchItems]);

  const handleResetFilters = () => {
    setSearch("");
    setCategory("All");
    setLocation("All");
    setSort("featured");
  };

  const hasActiveFilters =
    search.trim() !== "" ||
    category !== "All" ||
    location !== "All" ||
    sort !== "featured";

  return (
    <div className="container-pizza py-10 sm:py-14 space-y-10">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="section-eyebrow">
          <Pizza className="h-3.5 w-3.5 text-[var(--brand-primary)]" />
          Wood-Fired Catalog
        </span>
        <h1 className="section-heading text-[var(--text-primary)]">
          Explore Our Artisan Pizza Menu
        </h1>
        <p className="text-sm sm:text-base text-[var(--text-secondary)]">
          Discover handcrafted pizzas, savory calzones, and gourmet appetizers freshly
          prepared by top local pizzerias.
        </p>
      </div>

      {/* Filter and Search Bar Card */}
      <div className="rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 sm:p-7 shadow-[var(--card-shadow)] space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Keyword Search Input */}
          <div className="md:col-span-5 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />
            <Input
              type="text"
              placeholder="Search by pizza name, toppings, or pizzeria..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-11"
            />
          </div>

          {/* Location Filter Dropdown */}
          <div className="md:col-span-3 relative">
            <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)] pointer-events-none" />
            <Select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="pl-10"
            >
              <option value="All">All Locations</option>
              <option value="Gulshan">Gulshan, Dhaka</option>
              <option value="Banani">Banani, Dhaka</option>
              <option value="Dhanmondi">Dhanmondi, Dhaka</option>
              <option value="Uttara">Uttara, Dhaka</option>
              <option value="Mirpur">Mirpur, Dhaka</option>
              {locations
                .filter(
                  (loc) =>
                    !["Gulshan", "Banani", "Dhanmondi", "Uttara", "Mirpur"].includes(loc)
                )
                .map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
            </Select>
          </div>

          {/* Sort By Price / Rating Dropdown (Challenge Requirement) */}
          <div className="md:col-span-3 relative">
            <ArrowUpDown className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)] pointer-events-none" />
            <Select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="pl-10"
            >
              <option value="featured">Featured (Premium First)</option>
              <option value="price_asc">Price: Low to High (Ascending)</option>
              <option value="price_desc">Price: High to Low (Descending)</option>
              <option value="rating">Top Rated (Highest Stars)</option>
              <option value="newest">Newest Arrivals</option>
            </Select>
          </div>

          {/* Reset Filters Button */}
          <div className="md:col-span-1 flex items-center justify-center">
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResetFilters}
                className="w-full text-xs text-[var(--brand-primary)]"
                title="Reset all filters"
              >
                <RotateCcw className="h-4 w-4 mr-1" />
                Reset
              </Button>
            )}
          </div>
        </div>

        {/* Category Pills Slider */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none pt-2 border-t border-[var(--border-subtle)]">
          <button
            type="button"
            onClick={() => setCategory("All")}
            className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all shrink-0 cursor-pointer ${
              category === "All"
                ? "bg-[var(--brand-primary)] text-white shadow-sm"
                : "bg-[var(--bg-subtle)] text-[var(--text-secondary)] hover:bg-[var(--border-subtle)]"
            }`}
          >
            All Pizzas
          </button>
          {PIZZA_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all shrink-0 cursor-pointer ${
                category === cat
                  ? "bg-[var(--brand-primary)] text-white shadow-sm"
                  : "bg-[var(--bg-subtle)] text-[var(--text-secondary)] hover:bg-[var(--border-subtle)]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs font-semibold text-[var(--text-muted)]">
        <p>
          Showing{" "}
          <span className="font-bold text-[var(--text-primary)]">
            {items.length}
          </span>{" "}
          artisan pizza choices
        </p>
        {category !== "All" && (
          <span className="inline-flex items-center gap-1 text-[var(--brand-primary)] font-bold">
            Filter: {category}
          </span>
        )}
      </div>

      {/* Menu Cards Grid */}
      {loading ? (
        <LoadingSpinner text="Searching the oven for matching pizzas..." />
      ) : items.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {items.map((item) => (
            <MenuCard key={item._id} item={item} />
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-[var(--border-strong)] bg-[var(--bg-surface)] p-12 text-center max-w-lg mx-auto">
          <Pizza className="mx-auto h-14 w-14 text-[var(--brand-primary)]" />
          <h3 className="mt-4 text-lg font-bold text-[var(--text-primary)]">
            No Pizzas Found
          </h3>
          <p className="mt-1.5 text-xs text-[var(--text-secondary)] leading-relaxed">
            We couldn&apos;t find any pizzas matching &quot;{search || category}&quot;. Try adjusting
            your filters or resetting your search.
          </p>
          <div className="mt-6">
            <Button variant="primary" size="sm" onClick={handleResetFilters}>
              Reset All Filters
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function BrowseMenuPage() {
  return (
    <Suspense fallback={<LoadingSpinner text="Loading PizzaHub Menu..." />}>
      <BrowseMenuContent />
    </Suspense>
  );
}
