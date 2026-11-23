"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/navigation";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { ThemeToggle } from "../common/ThemeToggle";
import { Badge } from "../ui/primitives";
import {
  Pizza,
  Menu,
  X,
  User,
  LayoutDashboard,
  Settings,
  LogOut,
  ShoppingBag,
  Heart,
  Store,
  ShieldCheck,
  ChevronDown,
} from "lucide-react";

export function Navbar() {
  const { user, logout, loading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const pathname = usePathname();

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setDropdownOpen(false);
  }, [pathname]);

  const getDashboardPath = () => {
    if (!user) return "/login";
    if (user.role === "admin") return "/dashboard/admin";
    if (user.role === "vendor") return "/dashboard/vendor";
    return "/dashboard/customer";
  };

  const isActive = (path) => pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[var(--border-subtle)] bg-[var(--bg-surface)]/95 backdrop-blur-md transition-colors">
      <div className="container-pizza flex h-18 items-center justify-between">
        {/* Brand Logo */}
        <NextLink href="/" className="group flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-accent)] text-white shadow-md shadow-[var(--brand-primary)]/20 transition-transform group-hover:scale-105">
            <Pizza className="h-6 w-6 transform group-hover:rotate-12 transition-transform duration-300" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-xl tracking-tight text-[var(--text-primary)]">
              Pizza<span className="text-[var(--brand-primary)]">Hub</span>
            </span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--text-muted)] -mt-1">
              Fresh & Oven-Baked
            </span>
          </div>
        </NextLink>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5">
          <NextLink
            href="/"
            className={`rounded-full px-4 py-2 text-sm font-bold transition-all ${
              isActive("/")
                ? "bg-[var(--brand-primary-soft)] text-[var(--brand-primary)] shadow-xs"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)]"
            }`}
          >
            Home
          </NextLink>

          <NextLink
            href="/menu"
            className={`rounded-full px-4 py-2 text-sm font-bold transition-all ${
              pathname?.startsWith("/menu")
                ? "bg-[var(--brand-primary-soft)] text-[var(--brand-primary)] shadow-xs"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)]"
            }`}
          >
            Browse Menu
          </NextLink>

          {user && user.role === "customer" && (
            <>
              <NextLink
                href="/dashboard/customer"
                className={`rounded-full px-4 py-2 text-sm font-bold transition-all ${
                  isActive("/dashboard/customer")
                    ? "bg-[var(--brand-primary-soft)] text-[var(--brand-primary)] shadow-xs"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)]"
                }`}
              >
                My Orders
              </NextLink>
              <NextLink
                href="/dashboard/customer/favorites"
                className={`rounded-full px-4 py-2 text-sm font-bold transition-all ${
                  isActive("/dashboard/customer/favorites")
                    ? "bg-[var(--brand-primary-soft)] text-[var(--brand-primary)] shadow-xs"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)]"
                }`}
              >
                Wishlist
              </NextLink>
            </>
          )}

          {user && user.role === "vendor" && (
            <>
              <NextLink
                href="/dashboard/vendor/menu"
                className={`rounded-full px-4 py-2 text-sm font-bold transition-all ${
                  isActive("/dashboard/vendor/menu")
                    ? "bg-[var(--brand-primary-soft)] text-[var(--brand-primary)] shadow-xs"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)]"
                }`}
              >
                My Kitchen
              </NextLink>
              <NextLink
                href="/dashboard/vendor/orders"
                className={`rounded-full px-4 py-2 text-sm font-bold transition-all ${
                  isActive("/dashboard/vendor/orders")
                    ? "bg-[var(--brand-primary-soft)] text-[var(--brand-primary)] shadow-xs"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)]"
                }`}
              >
                Customer Orders
              </NextLink>
            </>
          )}

          {user && user.role === "admin" && (
            <NextLink
              href="/dashboard/admin"
              className={`rounded-full px-4 py-2 text-sm font-bold transition-all ${
                pathname?.startsWith("/dashboard/admin")
                  ? "bg-[var(--brand-primary-soft)] text-[var(--brand-primary)] shadow-xs"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)]"
              }`}
            >
              Admin Portal
            </NextLink>
          )}
        </nav>

        {/* Right Action Bar */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle Button */}
          <ThemeToggle />

          {/* User Auth Action or Profile Dropdown */}
          {loading ? (
            <div className="h-9 w-24 rounded-xl bg-[var(--bg-subtle)] animate-pulse hidden sm:block" />
          ) : user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-1.5 pr-3 text-left transition-all hover:bg-[var(--bg-subtle)]"
              >
                <img
                  src={
                    user.image ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      user.name || "User"
                    )}&background=C83E2B&color=fff&bold=true`
                  }
                  alt={user.name || "Profile"}
                  className="h-8 w-8 rounded-lg object-cover ring-2 ring-[var(--brand-primary-soft)]"
                />
                <div className="hidden xl:flex flex-col">
                  <span className="text-xs font-bold text-[var(--text-primary)] leading-tight max-w-[110px] truncate">
                    {user.name}
                  </span>
                  <span className="text-[10px] font-medium text-[var(--text-muted)] capitalize">
                    {user.role}
                  </span>
                </div>
                <ChevronDown
                  className={`h-4 w-4 text-[var(--text-muted)] transition-transform duration-200 ${
                    dropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Profile Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-2 shadow-xl z-50 animate-in fade-in-50 zoom-in-95">
                  <div className="border-b border-[var(--border-subtle)] px-3 py-2.5">
                    <p className="text-sm font-bold text-[var(--text-primary)] truncate">
                      {user.name}
                    </p>
                    <p className="text-xs text-[var(--text-muted)] truncate mb-2">
                      {user.email}
                    </p>
                    <div className="flex items-center gap-2">
                      <Badge
                        tone={
                          user.role === "admin"
                            ? "danger"
                            : user.role === "vendor"
                            ? user.subscriptionPlan === "premium"
                              ? "premium"
                              : "amber"
                            : "primary"
                        }
                      >
                        {user.role === "vendor" && user.subscriptionPlan === "premium"
                          ? "★ Premium Vendor"
                          : `${user.role.toUpperCase()}`}
                      </Badge>
                      {user.businessName && (
                        <span className="text-[11px] text-[var(--text-secondary)] font-medium truncate">
                          {user.businessName}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="py-1">
                    <NextLink
                      href={getDashboardPath()}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-[var(--text-primary)] transition-colors hover:bg-[var(--bg-subtle)]"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <LayoutDashboard className="h-4 w-4 text-[var(--brand-primary)]" />
                      Dashboard
                    </NextLink>

                    {user.role === "customer" && (
                      <>
                        <NextLink
                          href="/dashboard/customer"
                          className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-[var(--text-primary)] transition-colors hover:bg-[var(--bg-subtle)]"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <ShoppingBag className="h-4 w-4 text-[var(--brand-accent)]" />
                          My Orders
                        </NextLink>
                        <NextLink
                          href="/dashboard/customer/favorites"
                          className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-[var(--text-primary)] transition-colors hover:bg-[var(--bg-subtle)]"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <Heart className="h-4 w-4 text-rose-500" />
                          Saved Wishlist
                        </NextLink>
                      </>
                    )}

                    {user.role === "vendor" && (
                      <>
                        <NextLink
                          href="/dashboard/vendor/menu"
                          className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-[var(--text-primary)] transition-colors hover:bg-[var(--bg-subtle)]"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <Store className="h-4 w-4 text-[var(--brand-primary)]" />
                          My Menu Items
                        </NextLink>
                        <NextLink
                          href="/dashboard/vendor/subscription"
                          className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-[var(--text-primary)] transition-colors hover:bg-[var(--bg-subtle)]"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <span className="text-amber-500 font-bold">★</span>
                          Subscription Plan
                        </NextLink>
                      </>
                    )}

                    {user.role === "admin" && (
                      <NextLink
                        href="/dashboard/admin/users"
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-[var(--text-primary)] transition-colors hover:bg-[var(--bg-subtle)]"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <ShieldCheck className="h-4 w-4 text-rose-600" />
                        Manage Users
                      </NextLink>
                    )}

                    <NextLink
                      href="/dashboard/profile"
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-[var(--text-primary)] transition-colors hover:bg-[var(--bg-subtle)]"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <Settings className="h-4 w-4 text-[var(--text-muted)]" />
                      Profile Settings
                    </NextLink>
                  </div>

                  <div className="border-t border-[var(--border-subtle)] pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setDropdownOpen(false);
                        logout();
                      }}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-rose-600 transition-colors hover:bg-rose-500/10 cursor-pointer"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2.5">
              <NextLink
                href="/login"
                className="rounded-xl px-4 py-2 text-sm font-bold text-[var(--text-primary)] transition-colors hover:bg-[var(--bg-subtle)]"
              >
                Sign In
              </NextLink>
              <NextLink
                href="/register"
                className="btn-pizza-primary text-sm !py-2 !px-4"
              >
                Sign Up
              </NextLink>
            </div>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)] transition-colors hover:bg-[var(--bg-subtle)]"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[var(--border-subtle)] bg-[var(--bg-surface)] px-4 py-5 shadow-2xl">
          <nav className="flex flex-col gap-3">
            <NextLink
              href="/"
              className="rounded-xl px-3 py-2 text-base font-semibold text-[var(--text-primary)] hover:bg-[var(--bg-subtle)]"
            >
              Home
            </NextLink>
            <NextLink
              href="/menu"
              className="rounded-xl px-3 py-2 text-base font-semibold text-[var(--text-primary)] hover:bg-[var(--bg-subtle)]"
            >
              Browse Menu
            </NextLink>

            {user ? (
              <>
                <NextLink
                  href={getDashboardPath()}
                  className="rounded-xl px-3 py-2 text-base font-semibold text-[var(--brand-primary)] hover:bg-[var(--bg-subtle)] flex items-center gap-2"
                >
                  <LayoutDashboard className="h-5 w-5" />
                  Dashboard ({user.role})
                </NextLink>
                <NextLink
                  href="/dashboard/profile"
                  className="rounded-xl px-3 py-2 text-base font-semibold text-[var(--text-primary)] hover:bg-[var(--bg-subtle)]"
                >
                  Profile Settings
                </NextLink>
                <button
                  type="button"
                  onClick={logout}
                  className="rounded-xl px-3 py-2 text-left text-base font-semibold text-rose-600 hover:bg-rose-500/10 flex items-center gap-2 mt-2"
                >
                  <LogOut className="h-5 w-5" />
                  Sign Out
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2.5 pt-3 border-t border-[var(--border-subtle)]">
                <NextLink
                  href="/login"
                  className="btn-pizza-outline w-full text-center"
                >
                  Sign In
                </NextLink>
                <NextLink
                  href="/register"
                  className="btn-pizza-primary w-full text-center"
                >
                  Sign Up
                </NextLink>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
