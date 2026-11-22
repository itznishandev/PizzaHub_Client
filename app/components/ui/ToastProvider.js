"use client";

import { Toaster } from "react-hot-toast";

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3500,
        style: {
          background: "var(--bg-surface)",
          color: "var(--text-primary)",
          border: "1px solid var(--border-subtle)",
          borderRadius: "14px",
          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.15)",
          padding: "12px 18px",
          fontWeight: 500,
          fontSize: "14px",
        },
        success: {
          iconTheme: {
            primary: "#10b981",
            secondary: "#ffffff",
          },
        },
        error: {
          iconTheme: {
            primary: "#ef4444",
            secondary: "#ffffff",
          },
        },
      }}
    />
  );
}
