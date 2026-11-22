"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { LoadingSpinner } from "../components/common/LoadingSpinner";

export default function DashboardIndexPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push("/login?redirect=/dashboard");
      return;
    }
    if (user.role === "admin") {
      router.push("/dashboard/admin");
    } else if (user.role === "vendor") {
      router.push("/dashboard/vendor");
    } else {
      router.push("/dashboard/customer");
    }
  }, [user, loading, router]);

  return <LoadingSpinner text="Connecting to your PizzaHub workspace..." />;
}
