"use client";

import { useEffect, useState } from "react";
import { apiRequest, formatDate } from "../../../lib/api";
import { LoadingSpinner } from "../../../components/common/LoadingSpinner";
import { Input, Select, Button, Badge } from "../../../components/ui/primitives";
import toast from "react-hot-toast";
import {
  Users,
  Search,
  Filter,
  ShieldAlert,
  ShieldCheck,
  UserCheck,
  UserX,
  Mail,
  Store,
} from "lucide-react";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [togglingId, setTogglingId] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.set("search", search.trim());
      if (roleFilter !== "all") params.set("role", roleFilter);

      const res = await apiRequest(`/admin/users?${params.toString()}`);
      if (res?.users) {
        setUsers(res.users);
      }
    } catch (err) {
      console.warn("Failed to fetch users", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers();
    }, 250);
    return () => clearTimeout(timer);
  }, [search, roleFilter]);

  const handleToggleBlock = async (user) => {
    if (user.role === "admin") {
      toast.error("Administrators cannot be blocked.");
      return;
    }

    const action = user.isBlocked ? "unblock" : "block";
    if (!confirm(`Are you sure you want to ${action} ${user.name}?`)) return;

    try {
      setTogglingId(user._id || user.id);
      const res = await apiRequest(`/admin/users/${user._id || user.id}/block`, {
        method: "PATCH",
        body: JSON.stringify({ isBlocked: !user.isBlocked }),
      });

      toast.success(res.message || `User has been ${action}ed.`);
      await fetchUsers();
    } catch (err) {
      toast.error(err.message || `Failed to ${action} user.`);
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">
            Manage Registered Users
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
            Search, filter, and moderate all platform customers, pizzeria vendors, and administrators.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 shadow-xs flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />
          <Input
            type="text"
            placeholder="Search by user name, email, or restaurant name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="sm:w-56">
          <Select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="all">All Roles</option>
            <option value="customer">Customers Only</option>
            <option value="vendor">Pizzeria Vendors Only</option>
            <option value="admin">Administrators Only</option>
          </Select>
        </div>
      </div>

      {/* Users Table */}
      {loading ? (
        <LoadingSpinner text="Searching user records..." />
      ) : users.length > 0 ? (
        <div className="rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[var(--border-subtle)] bg-[var(--bg-elevated)] text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                <tr>
                  <th className="py-4 px-5">User</th>
                  <th className="py-4 px-4">Role</th>
                  <th className="py-4 px-4">Subscription</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-4">Joined</th>
                  <th className="py-4 px-5 text-right">Moderation Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
                {users.map((u) => {
                  const uid = u._id || u.id;
                  const isBlocked = Boolean(u.isBlocked);
                  const isVendor = u.role === "vendor";
                  const isAdmin = u.role === "admin";

                  return (
                    <tr key={uid} className="hover:bg-[var(--bg-subtle)]/40 transition-colors">
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              u.image ||
                              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                u.name || "User"
                              )}&background=C83E2B&color=fff&bold=true`
                            }
                            alt={u.name}
                            className="h-9 w-9 rounded-xl object-cover shrink-0 ring-1 ring-[var(--border-subtle)]"
                          />
                          <div>
                            <p className="font-bold text-[var(--text-primary)]">
                              {u.name}
                            </p>
                            <p className="text-[11px] text-[var(--text-muted)]">
                              {u.email}
                            </p>
                            {u.businessName && (
                              <p className="text-[10px] text-[var(--brand-primary)] font-semibold flex items-center gap-1 mt-0.5">
                                <Store className="h-3 w-3" />
                                {u.businessName}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <Badge
                          tone={
                            isAdmin
                              ? "danger"
                              : isVendor
                              ? "amber"
                              : "primary"
                          }
                        >
                          {u.role?.toUpperCase()}
                        </Badge>
                      </td>

                      <td className="py-3.5 px-4 font-semibold text-[var(--text-secondary)]">
                        {isVendor ? (
                          u.subscriptionPlan === "premium" ? (
                            <span className="text-amber-600 dark:text-amber-400 font-bold">
                              ★ Premium
                            </span>
                          ) : (
                            "Free Tier"
                          )
                        ) : (
                          "—"
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        {isBlocked ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-600">
                            <ShieldAlert className="h-3.5 w-3.5" />
                            Blocked
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                            <ShieldCheck className="h-3.5 w-3.5" />
                            Active
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-[var(--text-muted)] text-[11px]">
                        {formatDate(u.createdAt)}
                      </td>

                      <td className="py-3.5 px-5 text-right">
                        {isAdmin ? (
                          <span className="text-[10px] text-[var(--text-muted)] italic">
                            Protected Admin
                          </span>
                        ) : (
                          <Button
                            variant={isBlocked ? "primary" : "danger"}
                            size="sm"
                            disabled={togglingId === uid}
                            onClick={() => handleToggleBlock(u)}
                            className="text-xs !py-1 !px-3"
                          >
                            {togglingId === uid
                              ? "Updating..."
                              : isBlocked
                              ? "Unblock User"
                              : "Block User"}
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-[var(--border-strong)] bg-[var(--bg-surface)] p-12 text-center max-w-md mx-auto">
          <Users className="mx-auto h-12 w-12 text-[var(--brand-primary)]" />
          <h3 className="mt-3 text-lg font-bold text-[var(--text-primary)]">
            No Users Matching Search
          </h3>
          <p className="mt-1 text-xs text-[var(--text-secondary)]">
            Try adjusting your search keywords or role filter dropdown.
          </p>
        </div>
      )}
    </div>
  );
}
