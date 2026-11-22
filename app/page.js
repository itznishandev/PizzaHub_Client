"use client";

import { useEffect, useState } from "react";
import NextLink from "next/link";
import { apiRequest } from "./lib/api";
import { MenuCard } from "./components/menu/MenuCard";
import { LoadingSpinner } from "./components/common/LoadingSpinner";
import { Button, Badge } from "./components/ui/primitives";
import {
  Pizza,
  Flame,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Award,
  ChevronRight,
  Truck,
  Heart,
  Store,
  Star,
} from "lucide-react";

export default function HomePage() {
  const [featuredItems, setFeaturedItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await apiRequest("/menu/featured");
        if (mounted && res?.items) {
          setFeaturedItems(res.items);
        }
      } catch (err) {
        console.warn("Could not fetch featured pizzas", err.message);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const categories = [
    {
      name: "Classic Pizzas",
      tagline: "Timeless Margherita, Marinara & NY Slices",
      icon: "🍕",
      image:
        "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Meat Lovers",
      tagline: "Loaded Pepperoni, Sausage, Bacon & BBQ Chicken",
      icon: "🥓",
      image:
        "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Vegetarian Pizzas",
      tagline: "Garden Fresh Bell Peppers, Olives & Truffle Mushrooms",
      icon: "🌿",
      image:
        "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Specialty / Gourmet Pizzas",
      tagline: "Artisan Burrata, Pesto, Prosciutto & Hot Honey",
      icon: "✨",
      image:
        "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Sides & Appetizers",
      tagline: "Garlic Knots, Cheesy Breadsticks & Buffalo Wings",
      icon: "🥖",
      image:
        "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Beverages & Desserts",
      tagline: "Authentic Tiramisu, Cannoli & Craft Sodas",
      icon: "🥤",
      image:
        "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=600&q=80",
    },
  ];

  const whyChooseUs = [
    {
      title: "Wood-Fired Perfection",
      description:
        "Fermented dough rested for 48 hours and charred at 800°F in stone ovens for an irresistible crisp airy crust.",
      icon: Flame,
    },
    {
      title: "Farm-Fresh Local Produce",
      description:
        "San Marzano tomatoes, freshly pulled fior di latte mozzarella, and cold-pressed extra virgin olive oil.",
      icon: ShieldCheck,
    },
    {
      title: "30-Minute Steaming Hot Delivery",
      description:
        "Thermal delivery bags ensure that every pizza reaches your table blistering hot with melted cheese.",
      icon: Truck,
    },
    {
      title: "Direct Support for Local Chefs",
      description:
        "PizzaHub empowers independent artisanal pizzerias with zero predatory fees and direct kitchen-to-customer connection.",
      icon: Award,
    },
  ];

  const howItWorks = [
    {
      step: "01",
      title: "Discover Local Pizzerias",
      description:
        "Browse curated menus, wood-fired specials, and verified customer ratings in your neighborhood.",
    },
    {
      step: "02",
      title: "Customize & Order",
      description:
        "Select your favorite pizza, set delivery date, customize crust instructions, and confirm instantly.",
    },
    {
      step: "03",
      title: "Artisanal Kitchen Baking",
      description:
        "The vendor accepts your order and stone-bakes your pizza with genuine Italian passion.",
    },
    {
      step: "04",
      title: "Hot Doorstep Arrival",
      description:
        "Track your pizza's journey through our live order timeline straight to your doorstep.",
    },
  ];

  return (
    <div className="flex flex-col gap-20 sm:gap-28 pb-20">
      {/* 1. HERO BANNER SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[var(--bg-hero-tint)] via-[var(--bg-main)] to-[var(--bg-main)] pt-12 pb-20 md:pt-20 md:pb-28 border-b border-[var(--border-subtle)]">
        {/* Decorative backdrop blobs */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-r from-red-500/10 via-orange-500/10 to-amber-500/10 blur-3xl pointer-events-none rounded-full" />

        <div className="container-pizza relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-4 py-1.5 shadow-xs">
                <span className="flex h-2 w-2 rounded-full bg-[var(--brand-primary)] animate-ping" />
                <span className="text-xs font-bold text-[var(--brand-primary)] uppercase tracking-wider">
                  Authentic Artisan Pizzerias
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[var(--text-primary)] leading-[1.12]">
                Hot & Fresh Pizza{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-accent)]">
                  Delivered
                </span>{" "}
                to Your Door
              </h1>

              <p className="max-w-xl mx-auto lg:mx-0 text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed">
                Discover local pizzerias, taste stone-baked perfection, and enjoy blistered
                crusts loaded with authentic mozzarella and hand-crafted toppings.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <NextLink
                  href="/menu"
                  className="btn-pizza-primary text-base !py-3.5 !px-8 flex items-center justify-center gap-2.5 shadow-lg shadow-[var(--brand-primary)]/25 w-full sm:w-auto"
                >
                  <Pizza className="h-5 w-5" />
                  Explore Pizza Menu
                </NextLink>

                <NextLink
                  href="/register?role=vendor"
                  className="btn-pizza-outline text-base !py-3.5 !px-7 flex items-center justify-center gap-2 w-full sm:w-auto"
                >
                  <Store className="h-4 w-4" />
                  Become a Partner Kitchen
                </NextLink>
              </div>

              {/* Trust stats counter */}
              <div className="pt-8 border-t border-[var(--border-subtle)] grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0">
                <div>
                  <p className="text-2xl sm:text-3xl font-black text-[var(--brand-primary)]">
                    50+
                  </p>
                  <p className="text-xs font-medium text-[var(--text-muted)]">
                    Local Kitchens
                  </p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-black text-[var(--brand-accent)]">
                    30 Min
                  </p>
                  <p className="text-xs font-medium text-[var(--text-muted)]">
                    Avg Delivery
                  </p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-black text-amber-500">
                    4.9 ★
                  </p>
                  <p className="text-xs font-medium text-[var(--text-muted)]">
                    Customer Score
                  </p>
                </div>
              </div>
            </div>

            {/* Right Hero Image Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Glowing border card */}
                <div className="relative rounded-3xl overflow-hidden border-2 border-[var(--border-strong)] bg-[var(--bg-surface)] p-3 shadow-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1000&q=80"
                    alt="Artisan Margherita Pizza with basil and olive oil"
                    className="h-80 sm:h-96 w-full rounded-2xl object-cover transform hover:scale-102 transition-transform duration-500"
                  />
                  {/* Floating delivery pill */}
                  <div className="absolute bottom-6 left-6 right-6 rounded-2xl bg-[var(--bg-surface)]/95 p-3.5 shadow-xl border border-[var(--border-subtle)] backdrop-blur-md flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-600">
                        <Truck className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[var(--text-primary)]">
                          Fast Heat-Sealed Delivery
                        </p>
                        <p className="text-[11px] text-[var(--text-muted)]">
                          Direct from wood-fire oven to doorstep
                        </p>
                      </div>
                    </div>
                    <Badge tone="success">Active</Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. DYNAMIC SECTION 1: FEATURED MENU ITEMS */}
      <section className="container-pizza">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <span className="section-eyebrow">
              <Flame className="h-3.5 w-3.5 text-[var(--brand-primary)]" />
              Chef Specials
            </span>
            <h2 className="section-heading mt-3 text-[var(--text-primary)]">
              Featured Menu Items
            </h2>
            <p className="mt-2 text-sm text-[var(--text-secondary)] max-w-xl">
              Hand-tossed crusts, premium melted mozzarella, and signature recipes crafted
              by our top-rated pizzeria partners.
            </p>
          </div>

          <NextLink
            href="/menu"
            className="inline-flex items-center gap-2 text-sm font-bold text-[var(--brand-primary)] hover:text-[var(--brand-primary-hover)] transition-colors"
          >
            Explore Complete Menu ({featuredItems.length > 0 ? "20+" : "Loading..."})
            <ArrowRight className="h-4 w-4" />
          </NextLink>
        </div>

        {loading ? (
          <LoadingSpinner text="Fetching freshly baked pizzas..." />
        ) : featuredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {featuredItems.map((item) => (
              <MenuCard key={item._id} item={item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 rounded-2xl border border-dashed border-[var(--border-subtle)] bg-[var(--bg-surface)]">
            <Pizza className="mx-auto h-12 w-12 text-[var(--brand-primary)]" />
            <h3 className="mt-3 text-lg font-bold text-[var(--text-primary)]">
              Menu Items Loading
            </h3>
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              Fresh pizzas will appear right here as vendors submit them.
            </p>
          </div>
        )}
      </section>

      {/* 3. DYNAMIC SECTION 2: PIZZA CATEGORIES */}
      <section className="container-pizza">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="section-eyebrow">
            <Sparkles className="h-3.5 w-3.5 text-[var(--brand-accent)]" />
            Flavor Profiles
          </span>
          <h2 className="section-heading mt-3 text-[var(--text-primary)]">
            Explore by Pizza Category
          </h2>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">
            From classic Neapolitan slices to carnivore feasts and artisan appetizers,
            find your ultimate craving.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, idx) => (
            <NextLink
              key={idx}
              href={`/menu?category=${encodeURIComponent(cat.name)}`}
              className="group relative flex flex-col justify-between h-64 rounded-3xl overflow-hidden border border-[var(--border-subtle)] p-6 shadow-[var(--card-shadow)] transition-all duration-300 hover:-translate-y-1 hover:border-[var(--brand-primary)] hover:shadow-[var(--card-shadow-hover)]"
            >
              {/* Category Background Image with gradient overlay */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url(${cat.image})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30" />

              {/* Top tag */}
              <div className="relative z-10 flex items-center justify-between">
                <span className="text-3xl">{cat.icon}</span>
                <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold text-white backdrop-blur-md">
                  Explore
                </span>
              </div>

              {/* Bottom text */}
              <div className="relative z-10 text-white">
                <h3 className="text-xl font-bold tracking-tight group-hover:text-amber-300 transition-colors">
                  {cat.name}
                </h3>
                <p className="mt-1 text-xs text-neutral-200 line-clamp-1">
                  {cat.tagline}
                </p>
              </div>
            </NextLink>
          ))}
        </div>
      </section>

      {/* 4. EXTRA SECTION: WHY CHOOSE PIZZAHUB */}
      <section className="border-y border-[var(--border-subtle)] bg-[var(--bg-elevated)] py-18">
        <div className="container-pizza">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="section-eyebrow">
              <Award className="h-3.5 w-3.5 text-[var(--brand-primary)]" />
              Our Culinary Standard
            </span>
            <h2 className="section-heading mt-3 text-[var(--text-primary)]">
              Why Choose PizzaHub?
            </h2>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              We connect real neighborhood pizzerias and dedicated dough artisans with
              passionate pizza lovers.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyChooseUs.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 shadow-xs transition-all hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--brand-primary-soft)] text-[var(--brand-primary)] mb-5">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-base font-bold text-[var(--text-primary)]">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-xs text-[var(--text-secondary)] leading-relaxed">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. EXTRA SECTION: HOW PIZZAHUB WORKS */}
      <section className="container-pizza">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="section-eyebrow">
            <Clock className="h-3.5 w-3.5 text-[var(--brand-accent)]" />
            Seamless Experience
          </span>
          <h2 className="section-heading mt-3 text-[var(--text-primary)]">
            How PizzaHub Works
          </h2>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">
            From craving to piping-hot bite in four simple, transparent steps.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {howItWorks.map((step, idx) => (
            <div key={idx} className="relative flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-accent)] text-white font-black text-sm shadow-md">
                  {step.step}
                </span>
                <span className="h-0.5 flex-1 bg-[var(--border-subtle)] hidden lg:block" />
              </div>
              <h3 className="text-base font-bold text-[var(--text-primary)]">
                {step.title}
              </h3>
              <p className="mt-2 text-xs text-[var(--text-secondary)] leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. PARTNER CTA BANNER */}
      <section className="container-pizza">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#8b2315] via-[var(--brand-primary)] to-[var(--brand-accent)] px-8 py-12 sm:px-14 sm:py-16 text-white shadow-2xl">
          <div className="relative z-10 max-w-2xl">
            <Badge tone="premium" className="mb-4 bg-white/20 text-white border-white/30">
              For Restaurant Owners & Chefs
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Grow Your Pizzeria with PizzaHub
            </h2>
            <p className="mt-3 text-sm sm:text-base text-neutral-100 leading-relaxed">
              Publish your signature pizzas, manage real customer orders, upgrade to
              Premium for unlimited listings, and reach thousands of hungry pizza fans.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <NextLink
                href="/register?role=vendor"
                className="rounded-xl bg-white px-7 py-3 text-sm font-bold text-[var(--brand-primary)] shadow-lg hover:bg-neutral-100 transition-colors"
              >
                Register Your Kitchen
              </NextLink>
              <NextLink
                href="/dashboard/vendor/subscription"
                className="rounded-xl border border-white/40 bg-white/10 px-7 py-3 text-sm font-bold text-white hover:bg-white/20 transition-colors backdrop-blur-xs"
              >
                View Premium Benefits
              </NextLink>
            </div>
          </div>
          <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-20 pointer-events-none hidden md:flex items-center justify-center">
            <Pizza className="h-96 w-96 transform rotate-45" />
          </div>
        </div>
      </section>
    </div>
  );
}
