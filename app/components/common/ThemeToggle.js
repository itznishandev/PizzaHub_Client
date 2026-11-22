"use client";

import { useAuth } from "../../context/AuthContext";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle({ className = "" }) {
  const { theme, toggleTheme } = useAuth();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      className={`relative inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)] transition-all hover:bg-[var(--bg-subtle)] hover:scale-105 active:scale-95 ${className}`}
    >
      {theme === "dark" ? (
        <Sun className="h-4 w-4 text-amber-400 transition-transform duration-300 rotate-0" />
      ) : (
        <Moon className="h-4 w-4 text-orange-600 transition-transform duration-300 rotate-0" />
      )}
    </button>
  );
}
