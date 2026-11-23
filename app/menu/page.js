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
  ChevronDown,
  X,
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
      <div className="rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 sm:p-7 shadow-[var(--card-shadow)] space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4 items-center">
          {/* Keyword Search Input */}
          <div className="md:col-span-5 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--brand-primary)] pointer-events-none" />
            <Input
              type="text"
              placeholder="Search by pizza name, toppings, or pizzeria..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-9 bg-[var(--bg-elevated)]"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Location Filter Dropdown */}
          <div className="md:col-span-3 relative">
            <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--brand-accent)] pointer-events-none" />
            <Select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="pl-10 pr-9 bg-[var(--bg-elevated)]"
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
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />
          </div>

          {/* Sort By Price / Rating Dropdown (Challenge Requirement) */}
          <div className="md:col-span-3 relative">
            <ArrowUpDown className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-amber-500 pointer-events-none" />
            <Select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="pl-10 pr-9 bg-[var(--bg-elevated)]"
            >
              <option value="featured">Featured (Premium First)</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Top Rated (Highest Stars)</option>
              <option value="newest">Newest Arrivals</option>
            </Select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />
          </div>

          {/* Reset Filters Button */}
          <div className="md:col-span-1 flex items-center justify-center">
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResetFilters}
                className="w-full text-xs font-bold text-[var(--brand-primary)] hover:bg-[var(--brand-primary-soft)] rounded-xl py-2.5"
                title="Reset all filters"
              >
                <RotateCcw className="h-3.5 w-3.5 mr-1" />
                Reset
              </Button>
            )}
          </div>
        </div>

        {/* Category Pills Slider */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none pt-3 border-t border-[var(--border-subtle)]">
          <button
            type="button"
            onClick={() => setCategory("All")}
            className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all shrink-0 cursor-pointer ${
              category === "All"
                ? "bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-accent)] text-white shadow-sm shadow-[var(--brand-primary)]/25"
                : "bg-[var(--bg-elevated)] text-[var(--text-secondary)] border border-[var(--border-subtle)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-primary)]"
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
                  ? "bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-accent)] text-white shadow-sm shadow-[var(--brand-primary)]/25"
                  : "bg-[var(--bg-elevated)] text-[var(--text-secondary)] border border-[var(--border-subtle)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-primary)]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Active Filters Summary Chips */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 pt-2 text-xs border-t border-[var(--border-subtle)]/60">
            <span className="text-[var(--text-muted)] font-medium">Active Filters:</span>
            {search.trim() && (
              <span className="inline-flex items-center gap-1 rounded-full bg-[var(--brand-primary-soft)] text-[var(--brand-primary)] px-2.5 py-0.5 font-bold">
                Search: "{search}"
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="hover:opacity-75 cursor-pointer ml-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {category !== "All" && (
              <span className="inline-flex items-center gap-1 rounded-full bg-[var(--brand-accent-soft)] text-[var(--brand-accent)] px-2.5 py-0.5 font-bold">
                Category: {category}
                <button
                  type="button"
                  onClick={() => setCategory("All")}
                  className="hover:opacity-75 cursor-pointer ml-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {location !== "All" && (
              <span className="inline-flex items-center gap-1 rounded-full bg-[var(--bg-subtle)] text-[var(--text-secondary)] px-2.5 py-0.5 font-bold">
                Location: {location}
                <button
                  type="button"
                  onClick={() => setLocation("All")}
                  className="hover:opacity-75 cursor-pointer ml-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {sort !== "featured" && (
              <span className="inline-flex items-center gap-1 rounded-full bg-[var(--bg-subtle)] text-[var(--text-secondary)] px-2.5 py-0.5 font-bold">
                Sort: {sort.replace("_", " ")}
                <button
                  type="button"
                  onClick={() => setSort("featured")}
                  className="hover:opacity-75 cursor-pointer ml-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
          </div>
        )}
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
