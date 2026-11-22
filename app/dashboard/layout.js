"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { DashboardSidebar } from "../components/dashboard/Sidebar";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import { Menu, ShieldAlert } from "lucide-react";

export default function DashboardLayout({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    if (loading) return;

    // 1. Not logged in -> Redirect to Login
    if (!user) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    // 2. Blocked users cannot access protected dashboard
    if (user.isBlocked) {
      return;
    }

    // 3. Strict Role-based URL protection
    if (pathname.startsWith("/dashboard/admin") && user.role !== "admin") {
      router.push(user.role === "vendor" ? "/dashboard/vendor" : "/dashboard/customer");
    } else if (pathname.startsWith("/dashboard/vendor") && user.role !== "vendor") {
      router.push(user.role === "admin" ? "/dashboard/admin" : "/dashboard/customer");
    } else if (pathname.startsWith("/dashboard/customer") && user.role !== "customer") {
      router.push(user.role === "admin" ? "/dashboard/admin" : "/dashboard/vendor");
    }
  }, [user, loading, pathname, router]);

  if (loading) {
    return (
      <div className="container-pizza py-24">
        <LoadingSpinner text="Checking authentication & workspace permissions..." />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container-pizza py-24">
        <LoadingSpinner text="Redirecting to Sign In..." />
      </div>
    );
  }

  if (user.isBlocked) {
    return (
      <div className="container-pizza py-24 max-w-lg mx-auto text-center">
        <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-2xl bg-rose-500/15 text-rose-600 mb-4">
          <ShieldAlert className="h-8 w-8" />
        </div>
        <h2 className="text-2xl font-bold text-[var(--text-primary)]">
          Account Suspended
        </h2>
        <p className="mt-2 text-sm text-[var(--text-secondary)]">
          Your account has been blocked by platform administration. You cannot access
          protected features at this time. Please contact support@pizzahub.com for review.
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-4.5rem)] bg-[var(--bg-main)]">
      {/* Sidebar */}
      <DashboardSidebar
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Mobile Header Bar with Hamburger */}
        <div className="lg:hidden flex items-center justify-between border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] px-4 py-3">
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(true)}
            className="flex items-center gap-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3 py-1.5 text-xs font-bold text-[var(--text-primary)]"
          >
            <Menu className="h-4 w-4 text-[var(--brand-primary)]" />
            Workspace Menu
          </button>
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
            {user.role} Dashboard
          </span>
        </div>

        {/* Child Pages */}
        <div className="flex-1 p-4 sm:p-7 lg:p-9 max-w-7xl w-full mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
