"use client";

import NextLink from "next/link";
import { Pizza, Phone, Mail, MapPin, Heart } from "lucide-react";

// Modern X (Twitter) Logo SVG component
function XLogo({ className = "h-4 w-4" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-[var(--border-subtle)] bg-[var(--bg-elevated)] transition-colors">
      <div className="container-pizza py-14 lg:py-18">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
          {/* Brand Info */}
          <div className="lg:col-span-2">
            <NextLink href="/" className="group inline-flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-accent)] text-white shadow-md">
                <Pizza className="h-6 w-6 transform group-hover:rotate-12 transition-transform duration-300" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-[var(--text-primary)]">
                Pizza<span className="text-[var(--brand-primary)]">Hub</span>
              </span>
            </NextLink>
            <p className="mt-4 max-w-sm text-sm text-[var(--text-secondary)] leading-relaxed">
              PizzaHub is the premier artisan pizza ordering and delivery marketplace.
              Connecting pizza enthusiasts with top local pizzerias, wood-fired masters,
              and authentic slice shops.
            </p>

            <div className="mt-6 flex items-center gap-3">
              {/* New X (Twitter) Logo */}
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow PizzaHub on X"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)] transition-all hover:bg-[var(--brand-primary-soft)] hover:text-[var(--brand-primary)] hover:-translate-y-0.5"
              >
                <XLogo className="h-4 w-4" />
              </a>

              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow PizzaHub on Facebook"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)] transition-all hover:bg-[var(--brand-primary-soft)] hover:text-[var(--brand-primary)] hover:-translate-y-0.5"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </a>

              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow PizzaHub on Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)] transition-all hover:bg-[var(--brand-primary-soft)] hover:text-[var(--brand-primary)] hover:-translate-y-0.5"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-[var(--text-primary)]">
              Explore
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm text-[var(--text-secondary)]">
              <li>
                <NextLink href="/" className="transition-colors hover:text-[var(--brand-primary)]">
                  Home
                </NextLink>
              </li>
              <li>
                <NextLink href="/menu" className="transition-colors hover:text-[var(--brand-primary)]">
                  Browse All Pizzas
                </NextLink>
              </li>
              <li>
                <NextLink
                  href="/menu?category=Classic+Pizzas"
                  className="transition-colors hover:text-[var(--brand-primary)]"
                >
                  Classic Margherita & Pepperoni
                </NextLink>
              </li>
              <li>
                <NextLink
                  href="/menu?category=Meat+Lovers"
                  className="transition-colors hover:text-[var(--brand-primary)]"
                >
                  Meat Lovers Special
                </NextLink>
              </li>
              <li>
                <NextLink
                  href="/menu?category=Vegetarian+Pizzas"
                  className="transition-colors hover:text-[var(--brand-primary)]"
                >
                  Vegetarian & Vegan Slices
                </NextLink>
              </li>
            </ul>
          </div>

          {/* For Restaurants & Vendors */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-[var(--text-primary)]">
              Pizzeria Partners
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm text-[var(--text-secondary)]">
              <li>
                <NextLink href="/register?role=vendor" className="transition-colors hover:text-[var(--brand-primary)]">
                  Partner With PizzaHub
                </NextLink>
              </li>
              <li>
                <NextLink href="/dashboard/vendor/subscription" className="transition-colors hover:text-[var(--brand-primary)]">
                  Premium Vendor Plan
                </NextLink>
              </li>
              <li>
                <NextLink href="/dashboard/vendor" className="transition-colors hover:text-[var(--brand-primary)]">
                  Vendor Dashboard
                </NextLink>
              </li>
              <li>
                <NextLink href="/dashboard/vendor/menu/add" className="transition-colors hover:text-[var(--brand-primary)]">
                  Publish New Pizza
                </NextLink>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-[var(--text-primary)]">
              Contact & Support
            </h4>
            <ul className="mt-4 space-y-3 text-sm text-[var(--text-secondary)]">
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-[var(--brand-primary)] mt-0.5 shrink-0" />
                <span>Gulshan Avenue, Dhaka 1212, Bangladesh</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-[var(--brand-primary)] shrink-0" />
                <span>+880 1711-000101</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-[var(--brand-primary)] shrink-0" />
                <span>support@pizzahub.com</span>
              </li>
              <li className="pt-2">
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                  Kitchens Open 24/7
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[var(--border-subtle)] pt-8 text-xs text-[var(--text-muted)] sm:flex-row">
          <p>© {new Date().getFullYear()} PizzaHub Inc. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Crafted with <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500" /> for Pizza Lovers Everywhere
          </p>
          <div className="flex gap-4">
            <span className="hover:text-[var(--text-primary)] cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-[var(--text-primary)] cursor-pointer">Terms of Service</span>
            <span>•</span>
            <span className="hover:text-[var(--text-primary)] cursor-pointer">Stripe Verified</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
