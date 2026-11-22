"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import NextLink from "next/link";
import { useAuth } from "../context/AuthContext";
import { authClient } from "../lib/auth-client";
import { Button, Input, Card } from "../components/ui/primitives";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import toast from "react-hot-toast";
import { Pizza, Lock, Mail, ArrowRight, ShieldCheck, UserCheck } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get("redirect");

  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleRedirectByRole = (user) => {
    if (redirectTarget && redirectTarget.startsWith("/")) {
      router.push(redirectTarget);
      return;
    }
    if (user?.role === "admin") router.push("/dashboard/admin");
    else if (user?.role === "vendor") router.push("/dashboard/vendor");
    else router.push("/dashboard/customer");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      toast.error("Please enter your email and password.");
      return;
    }

    try {
      setSubmitting(true);
      const res = await login(email.trim(), password);
      toast.success(res.message || "Welcome back to PizzaHub!");
      handleRedirectByRole(res.user);
    } catch (err) {
      toast.error(err.message || "Invalid email or password.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: window.location.origin + (redirectTarget || "/"),
      });
    } catch (err) {
      toast.error(err.message || "Google sign-in could not be initiated.");
    }
  };

  const quickFill = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    toast("Credentials filled! Click 'Sign In' to enter.", { icon: "🔑" });
  };

  return (
    <div className="container-pizza py-14 sm:py-20 flex flex-col items-center justify-center">
      <div className="w-full max-w-md space-y-6">
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
            Sign In to Your Account
          </h1>
          <p className="text-xs text-[var(--text-secondary)]">
            Welcome back! Enter your details to browse, order, or manage your pizzeria.
          </p>
        </div>

        {/* Login Card */}
        <div className="rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 sm:p-8 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[var(--text-primary)] mb-1.5">
                Email Address
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

            <div>
              <label className="block text-xs font-bold text-[var(--text-primary)] mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 mt-2"
            >
              {submitting ? "Signing In..." : "Sign In"}
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
                Or Continue With
              </span>
            </div>

            <button
              type="button"
              onClick={handleGoogleSignIn}
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

          {/* Quick Demo Credentials Fill Card */}
          <div className="mt-6 pt-5 border-t border-[var(--border-subtle)] space-y-2">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)] text-center">
              Quick Test Credentials
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => quickFill("admin@pizzahub.com", "AdminPassword123")}
                className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-2 text-center text-[10px] font-bold text-rose-700 dark:text-rose-300 hover:bg-rose-500/20 transition-colors cursor-pointer"
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => quickFill("vendor@pizzahub.com", "VendorPassword123")}
                className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-2 text-center text-[10px] font-bold text-amber-700 dark:text-amber-300 hover:bg-amber-500/20 transition-colors cursor-pointer"
              >
                Vendor
              </button>
              <button
                type="button"
                onClick={() => quickFill("customer@pizzahub.com", "CustomerPassword123")}
                className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-2 text-center text-[10px] font-bold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/20 transition-colors cursor-pointer"
              >
                Customer
              </button>
            </div>
          </div>
        </div>

        {/* Footer Link */}
        <p className="text-center text-xs text-[var(--text-secondary)]">
          Don&apos;t have an account yet?{" "}
          <NextLink
            href="/register"
            className="font-bold text-[var(--brand-primary)] hover:underline"
          >
            Create an Account
          </NextLink>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoadingSpinner text="Loading sign-in form..." />}>
      <LoginForm />
    </Suspense>
  );
}
