"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { apiRequest, uploadImageToImgBB } from "../../lib/api";
import { Button, Input, Card, Badge } from "../../components/ui/primitives";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import toast from "react-hot-toast";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Store,
  Upload,
  ShieldCheck,
  Save,
  Sparkles,
} from "lucide-react";

export default function ProfileSettingsPage() {
  const { user, setUser, refreshUser } = useAuth();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setPhone(user.phone || "");
      setAddress(user.address || "");
      setBusinessName(user.businessName || "");
      setImagePreview(user.image || "");
    }
  }, [user]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Name cannot be empty.");
      return;
    }

    try {
      setSaving(true);

      let uploadedImageUrl = user?.image || "";
      if (imageFile) {
        toast("Uploading new avatar...", { icon: "☁️" });
        uploadedImageUrl = await uploadImageToImgBB(imageFile, {
          requireAuthUpload: true,
        });
      }

      const res = await apiRequest("/auth/profile", {
        method: "PUT",
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          address: address.trim(),
          businessName: user.role === "vendor" ? businessName.trim() : "",
          image: uploadedImageUrl,
        }),
      });

      toast.success(res.message || "Profile updated successfully!");
      if (res.user) {
        setUser(res.user);
      } else {
        await refreshUser();
      }
    } catch (err) {
      toast.error(err.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return <LoadingSpinner text="Loading profile preferences..." />;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">
          Profile Settings
        </h1>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
          Manage your personal account credentials, contact info, and kitchen preferences.
        </p>
      </div>

      <div className="rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 sm:p-8 shadow-sm">
        <form onSubmit={handleSaveProfile} className="space-y-6">
          {/* Avatar and Role Header */}
          <div className="flex flex-col sm:flex-row items-center gap-5 border-b border-[var(--border-subtle)] pb-6">
            <div className="relative">
              <img
                src={
                  imagePreview ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    name || "User"
                  )}&background=C83E2B&color=fff&bold=true`
                }
                alt={name}
                className="h-20 w-20 rounded-2xl object-cover ring-2 ring-[var(--brand-primary-soft)]"
              />
              <label className="absolute -bottom-2 -right-2 flex h-8 w-8 cursor-pointer items-center justify-center rounded-xl bg-[var(--brand-primary)] text-white shadow-md hover:scale-105 transition-transform">
                <Upload className="h-4 w-4" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>

            <div className="text-center sm:text-left space-y-1">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h3 className="text-lg font-bold text-[var(--text-primary)]">{name}</h3>
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
                    : user.role?.toUpperCase()}
                </Badge>
              </div>
              <p className="text-xs text-[var(--text-muted)]">{user.email}</p>
              <p className="text-[10px] text-[var(--text-muted)] italic">
                Role and Subscription status are immutable and verified on server.
              </p>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-[var(--text-primary)] mb-1.5">
                Full Name *
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {/* Email Address (Immutable) */}
            <div>
              <label className="block text-xs font-bold text-[var(--text-primary)] mb-1.5">
                Email Address (Account ID)
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />
                <Input
                  type="email"
                  value={user.email}
                  disabled
                  className="pl-10 opacity-70 bg-[var(--bg-subtle)] cursor-not-allowed"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-xs font-bold text-[var(--text-primary)] mb-1.5">
                Contact Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />
                <Input
                  type="tel"
                  placeholder="+880 1711-000101"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Vendor Business Name */}
            {user.role === "vendor" && (
              <div>
                <label className="block text-xs font-bold text-[var(--text-primary)] mb-1.5">
                  Restaurant Business Name
                </label>
                <div className="relative">
                  <Store className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />
                  <Input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            )}

            {/* Address */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-[var(--text-primary)] mb-1.5">
                Default Address / Kitchen Headquarters
              </label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />
                <Input
                  type="text"
                  placeholder="e.g. House 42, Road 11, Banani, Dhaka"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--border-subtle)]">
            <Button
              type="submit"
              variant="primary"
              disabled={saving}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {saving ? "Saving Changes..." : "Save Profile"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
