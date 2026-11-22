"use client";

import { usePathname } from "next/navigation";
import NextLink from "next/link";
import { useAuth } from "../../context/AuthContext";
import { Badge } from "../ui/primitives";
import {
  LayoutDashboard,
  ShoppingBag,
  Heart,
  Store,
  PlusCircle,
  Clock,
  Sparkles,
  Users,
  ShieldCheck,
  Receipt,
  Settings,
  LogOut,
  Pizza,
  X,
} from "lucide-react";

export function DashboardSidebar({ mobileOpen, onCloseMobile }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  if (!user) return null;

  const isActive = (path) => pathname === path;

  const customerLinks = [
    {
      title: "My Orders & Overview",
      href: "/dashboard/customer",
      icon: ShoppingBag,
    },
    {
      title: "Saved Wishlist",
      href: "/dashboard/customer/favorites",
      icon: Heart,
    },
  ];

  const vendorLinks = [
    {
      title: "Kitchen Overview",
      href: "/dashboard/vendor",
      icon: LayoutDashboard,
    },
    {
      title: "My Menu Items",
      href: "/dashboard/vendor/menu",
      icon: Store,
    },
    {
      title: "Add New Pizza",
      href: "/dashboard/vendor/menu/add",
      icon: PlusCircle,
    },
    {
      title: "Customer Orders",
      href: "/dashboard/vendor/orders",
      icon: Clock,
    },
    {
      title: "Subscription & Billing",
      href: "/dashboard/vendor/subscription",
      icon: Sparkles,
      badge: user.subscriptionPlan === "premium" ? "PRO" : "FREE",
    },
  ];

  const adminLinks = [
    {
      title: "Platform Overview",
      href: "/dashboard/admin",
      icon: LayoutDashboard,
    },
    {
      title: "Manage Users",
      href: "/dashboard/admin/users",
      icon: Users,
    },
    {
      title: "Moderate Menu Items",
      href: "/dashboard/admin/menu",
      icon: ShieldCheck,
    },
    {
      title: "Transaction Ledger",
      href: "/dashboard/admin/transactions",
      icon: Receipt,
    },
  ];

  const currentLinks =
    user.role === "admin"
      ? adminLinks
      : user.role === "vendor"
      ? vendorLinks
      : customerLinks;

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between p-4 sm:p-5">
      <div>
        {/* Brand header */}
        <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-4 mb-5">
          <NextLink href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-accent)] text-white shadow-sm">
              <Pizza className="h-5 w-5" />
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-[var(--text-primary)]">
                Pizza<span className="text-[var(--brand-primary)]">Hub</span>
              </span>
              <span className="block text-[9px] uppercase font-bold text-[var(--text-muted)] tracking-wider">
                {user.role} workspace
              </span>
            </div>
          </NextLink>

          {mobileOpen && (
            <button
              type="button"
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded-lg text-[var(--text-muted)] hover:bg-[var(--bg-subtle)]"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* User Card */}
        <div className="mb-6 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-3 flex items-center gap-3">
          <img
            src={
              user.image ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                user.name || "User"
              )}&background=C83E2B&color=fff&bold=true`
            }
            alt={user.name}
            className="h-10 w-10 rounded-xl object-cover ring-2 ring-[var(--brand-primary-soft)]"
          />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-[var(--text-primary)] truncate">
              {user.name}
            </p>
            <p className="text-[10px] text-[var(--text-muted)] truncate">
              {user.email}
            </p>
            <div className="mt-1">
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
                  ? "★ Premium"
                  : user.role.toUpperCase()}
              </Badge>
            </div>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="space-y-1.5">
          <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-2">
            Main Navigation
          </p>
          {currentLinks.map((item, idx) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <NextLink
                key={idx}
                href={item.href}
                onClick={onCloseMobile}
                className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-bold transition-all ${
                  active
                    ? "bg-[var(--brand-primary)] text-white shadow-sm shadow-[var(--brand-primary)]/20"
                    : "text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-primary)]"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`h-4 w-4 ${active ? "text-white" : "text-[var(--text-muted)]"}`} />
                  <span>{item.title}</span>
                </div>
                {item.badge && (
                  <span
                    className={`rounded-md px-1.5 py-0.5 text-[9px] font-black ${
                      active
                        ? "bg-white/20 text-white"
                        : "bg-amber-500/20 text-amber-700 dark:text-amber-300"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </NextLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom Profile and Logout Actions */}
      <div className="border-t border-[var(--border-subtle)] pt-4 space-y-1.5">
        <NextLink
          href="/dashboard/profile"
          onClick={onCloseMobile}
          className={`flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold transition-colors ${
            isActive("/dashboard/profile")
              ? "bg-[var(--brand-primary)] text-white"
              : "text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)]"
          }`}
        >
          <Settings className="h-4 w-4 text-[var(--text-muted)]" />
          <span>Profile Settings</span>
        </NextLink>

        <button
          type="button"
          onClick={logout}
          className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-rose-600 transition-colors hover:bg-rose-500/10 cursor-pointer"
        >
          <LogOut className="h-4 w-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Permanent) */}
      <aside className="hidden lg:flex w-64 flex-col shrink-0 border-r border-[var(--border-subtle)] bg-[var(--bg-surface)] min-h-[calc(100vh-4.5rem)] sticky top-18 z-20">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer (Responsive overlay) */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={onCloseMobile}
          />
          <div className="relative z-10 w-72 max-w-[80vw] bg-[var(--bg-surface)] shadow-2xl h-full overflow-y-auto">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
