"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { apiRequest, setStoredToken, getStoredToken } from "../lib/api";
import { authClient } from "../lib/auth-client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState("light");
  const router = useRouter();

  // Initialize theme
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem("pizzahub_theme");
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const initialTheme = savedTheme || (prefersDark ? "dark" : "light");
      setTheme(initialTheme);
      document.documentElement.setAttribute("data-theme", initialTheme);
    } catch {
      // Default to light
      document.documentElement.setAttribute("data-theme", "light");
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    try {
      localStorage.setItem("pizzahub_theme", nextTheme);
      document.documentElement.setAttribute("data-theme", nextTheme);
    } catch {}
  };

  // Sync session and verify JWT
  const refreshUser = useCallback(async () => {
    const storedToken = getStoredToken();
    if (!storedToken) {
      // Check Better Auth session for OAuth
      try {
        const session = await authClient.getSession();
        if (session?.data?.user) {
          // Sync with express backend
          const syncRes = await apiRequest("/auth/oauth-sync", {
            method: "POST",
            body: JSON.stringify({
              email: session.data.user.email,
              name: session.data.user.name,
              image: session.data.user.image,
            }),
          });
          if (syncRes?.token) {
            setStoredToken(syncRes.token);
            setToken(syncRes.token);
            setUser(syncRes.user);
            return syncRes.user;
          }
        }
      } catch (err) {
        console.warn("Session check failed", err.message);
      }
      setUser(null);
      setToken(null);
      return null;
    }

    try {
      setToken(storedToken);
      const res = await apiRequest("/auth/me");
      if (res?.user) {
        setUser(res.user);
        return res.user;
      }
    } catch (err) {
      console.warn("Verify token failed", err.message);
      setStoredToken(null);
      setToken(null);
      setUser(null);
    }
    return null;
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      await refreshUser();
      if (mounted) setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, [refreshUser]);

  const login = async (email, password) => {
    const res = await apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    if (res?.token && res?.user) {
      setStoredToken(res.token);
      setToken(res.token);
      setUser(res.user);
    }
    return res;
  };

  const register = async (userData) => {
    const res = await apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });

    if (res?.token && res?.user) {
      setStoredToken(res.token);
      setToken(res.token);
      setUser(res.user);
    }
    return res;
  };

  const logout = async () => {
    try {
      await authClient.signOut().catch(() => {});
    } catch {}
    setStoredToken(null);
    setToken(null);
    setUser(null);
    router.push("/");
  };

  const toggleFavorite = async (itemId) => {
    if (!user || !token) {
      router.push(`/login?redirect=/menu/${itemId}`);
      return;
    }
    const res = await apiRequest(`/favorites/${itemId}`, {
      method: "POST",
    });
    if (res?.favorites) {
      setUser((prev) => (prev ? { ...prev, favorites: res.favorites } : prev));
    }
    return res;
  };

  const isFavorite = (itemId) => {
    return Array.isArray(user?.favorites) && user.favorites.includes(itemId);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        theme,
        toggleTheme,
        login,
        register,
        logout,
        refreshUser,
        setUser,
        toggleFavorite,
        isFavorite,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
