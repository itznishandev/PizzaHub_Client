"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import NextLink from "next/link";
import { useAuth } from "../context/AuthContext";
import { authClient } from "../lib/auth-client";
import { uploadImageToImgBB } from "../lib/api";
import { Button, Input, Select } from "../components/ui/primitives";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import toast from "react-hot-toast";
import {
  Pizza,
  Lock,
  Mail,
  User,
  Store,
  Upload,
  ArrowRight,
  CheckCircle2,
  XCircle,
} from "lucide-react";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRole = searchParams.get("role") === "vendor" ? "vendor" : "customer";

  const { register } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(initialRole);
  const [businessName, setBusinessName] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Password validation rules
  const hasMinLength = password.length >= 6;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const isPasswordValid = hasMinLength && hasUpper && hasLower;

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Please provide your full name.");
      return;
    }
    if (!email.trim()) {
      toast.error("Please provide your email address.");
      return;
    }
    if (!isPasswordValid) {
      toast.error(
        "Password must be at least 6 characters and contain both uppercase and lowercase letters."
      );
      return;
    }

    try {
      setSubmitting(true);

      let uploadedImageUrl = "";
      if (imageFile) {
        try {
          uploadedImageUrl = await uploadImageToImgBB(imageFile, {
            requireAuthUpload: false,
          });
        } catch (uploadErr) {
          console.warn("Avatar upload fallback", uploadErr.message);
          uploadedImageUrl = imagePreview || "";
        }
      }

      const payload = {
        name: name.trim(),
        email: email.trim(),
        password,
        role: role === "vendor" ? "vendor" : "customer",
        image: uploadedImageUrl,
        businessName: role === "vendor" ? businessName.trim() : "",
      };

      const res = await register(payload);
      toast.success(res.message || "Account registered successfully!");

      if (res.user?.role === "vendor") {
        router.push("/dashboard/vendor");
      } else {
        router.push("/dashboard/customer");
      }
    } catch (err) {
      toast.error(err.message || "Registration failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: window.location.origin + "/dashboard",
      });
    } catch (err) {
      toast.error(err.message || "Google registration failed.");
    }
  };

  return (
    <div className="container-pizza py-14 sm:py-20 flex flex-col items-center justify-center">
      <div className="w-full max-w-lg space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <NextLink href="/" className="inline-flex items-center gap-2 mb-2">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-accent)] text-white shadow-md">
              <Pizza className="h-6 w-6" />
            </div>
            <span className="text-2xl font-black text-[var(--text-primary)]">
              Pizza<span className="text-[var(--brand-primary)]">Hub</span>
            </span>
          </NextLink>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">
            Create a New Account
          </h1>
          <p className="text-xs text-[var(--text-secondary)]">
            Join PizzaHub to place orders or register your pizzeria kitchen.
          </p>
        </div>

        {/* Form Card */}
        <div className="rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 sm:p-8 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Account Role Selector */}
            <div>
              <label className="block text-xs font-bold text-[var(--text-primary)] mb-2">
                Account Role *
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole("customer")}
                  className={`flex flex-col items-center justify-center rounded-2xl border p-4 text-center transition-all cursor-pointer ${
                    role === "customer"
                      ? "border-[var(--brand-primary)] bg-[var(--brand-primary-soft)] text-[var(--brand-primary)] shadow-sm"
                      : "border-[var(--border-subtle)] bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:border-[var(--border-strong)]"
                  }`}
                >
                  <User className="h-6 w-6 mb-1" />
                  <span className="text-sm font-bold">Customer</span>
                  <span className="text-[10px] text-[var(--text-muted)]">
                    Browse & Order Pizzas
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole("vendor")}
                  className={`flex flex-col items-center justify-center rounded-2xl border p-4 text-center transition-all cursor-pointer ${
                    role === "vendor"
                      ? "border-[var(--brand-primary)] bg-[var(--brand-primary-soft)] text-[var(--brand-primary)] shadow-sm"
                      : "border-[var(--border-subtle)] bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:border-[var(--border-strong)]"
                  }`}
                >
                  <Store className="h-6 w-6 mb-1" />
                  <span className="text-sm font-bold">Restaurant Vendor</span>
                  <span className="text-[10px] text-[var(--text-muted)]">
                    Publish & Manage Kitchen
                  </span>
                </button>
              </div>
            </div>

            {/* Vendor Business Name */}
            {role === "vendor" && (
              <div>
                <label className="block text-xs font-bold text-[var(--text-primary)] mb-1.5">
                  Restaurant / Business Name *
                </label>
                <div className="relative">
                  <Store className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />
                  <Input
                    type="text"
                    placeholder="e.g. Bella Napoli Artisan Pizzeria"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="pl-10"
                    required={role === "vendor"}
                  />
                </div>
              </div>
            )}

            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-[var(--text-primary)] mb-1.5">
                Full Name *
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />
                <Input
                  type="text"
                  placeholder="e.g. John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-bold text-[var(--text-primary)] mb-1.5">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />
                <Input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-[var(--text-primary)] mb-1.5">
                Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />
                <Input
                  type="password"
                  placeholder="Minimum 6 chars, uppercase & lowercase"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>

              {/* Password Rules Indicators */}
              <div className="mt-2 grid grid-cols-3 gap-2 text-[10px]">
                <div
                  className={`flex items-center gap-1 font-medium ${
                    hasMinLength ? "text-emerald-600" : "text-[var(--text-muted)]"
                  }`}
                >
                  {hasMinLength ? (
                    <CheckCircle2 className="h-3 w-3" />
                  ) : (
                    <XCircle className="h-3 w-3" />
                  )}
                  6+ chars
                </div>
                <div
                  className={`flex items-center gap-1 font-medium ${
                    hasUpper ? "text-emerald-600" : "text-[var(--text-muted)]"
                  }`}
                >
                  {hasUpper ? (
                    <CheckCircle2 className="h-3 w-3" />
                  ) : (
                    <XCircle className="h-3 w-3" />
                  )}
                  1 Uppercase
                </div>
                <div
                  className={`flex items-center gap-1 font-medium ${
                    hasLower ? "text-emerald-600" : "text-[var(--text-muted)]"
                  }`}
                >
                  {hasLower ? (
                    <CheckCircle2 className="h-3 w-3" />
                  ) : (
                    <XCircle className="h-3 w-3" />
                  )}
                  1 Lowercase
                </div>
              </div>
            </div>

            {/* Optional Profile Image */}
            <div>
              <label className="block text-xs font-bold text-[var(--text-primary)] mb-1.5">
                Profile Avatar (Optional)
              </label>
              <div className="flex items-center gap-3">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-12 w-12 rounded-xl object-cover border border-[var(--border-subtle)]"
                  />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--bg-subtle)] text-[var(--text-muted)] border border-dashed border-[var(--border-strong)]">
                    <User className="h-5 w-5" />
                  </div>
                )}
                <label className="flex-1 cursor-pointer">
                  <span className="inline-flex items-center gap-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-3 py-2 text-xs font-semibold text-[var(--text-primary)] hover:bg-[var(--bg-subtle)]">
                    <Upload className="h-3.5 w-3.5 text-[var(--brand-primary)]" />
                    Choose Picture
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 mt-4"
            >
              {submitting ? "Creating Account..." : "Complete Registration"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          {/* Google OAuth Option */}
          <div className="mt-5">
            <div className="relative flex items-center justify-center mb-4">
              <span className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-[var(--border-subtle)]" />
              </span>
              <span className="relative bg-[var(--bg-surface)] px-3 text-[11px] font-semibold text-[var(--text-muted)] uppercase">
                Or Register With
              </span>
            </div>

            <button
              type="button"
              onClick={handleGoogleSignUp}
              className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-4 py-2.5 text-xs font-bold text-[var(--text-primary)] transition-all hover:bg-[var(--bg-subtle)] cursor-pointer"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.9c2.28-2.1 3.645-5.19 3.645-9.15z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.9-3.05c-1.08.72-2.45 1.16-4.03 1.16-3.1 0-5.72-2.1-6.66-4.92H1.3v3.15C3.33 21.45 7.38 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.34 14.28c-.24-.72-.38-1.49-.38-2.28s.14-1.56.38-2.28V6.57H1.3C.47 8.22 0 10.05 0 12s.47 3.78 1.3 5.43l4.04-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.38 0 3.33 2.55 1.3 6.57l4.04 3.15c.94-2.82 3.56-4.97 6.66-4.97z"
                />
              </svg>
              Google Account
            </button>
          </div>
        </div>

        {/* Footer Link */}
        <p className="text-center text-xs text-[var(--text-secondary)]">
          Already have an account?{" "}
          <NextLink
            href="/login"
            className="font-bold text-[var(--brand-primary)] hover:underline"
          >
            Sign In Here
          </NextLink>
        </p>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<LoadingSpinner text="Loading registration form..." />}>
      <RegisterForm />
    </Suspense>
  );
}
