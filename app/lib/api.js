"use client";

const DEFAULT_API_URL = "http://localhost:5000/api";

export function resolveApiBaseUrl() {
  const envUrl = process.env.NEXT_PUBLIC_API_URL;
  if (envUrl && envUrl.trim().length > 0) {
    const clean = envUrl.trim().replace(/\/+$/, "");
    return clean.endsWith("/api") ? clean : `${clean}/api`;
  }
  return DEFAULT_API_URL;
}

export function getStoredToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("pizzahub_jwt_token");
}

export function setStoredToken(token) {
  if (typeof window === "undefined") return;
  if (token) {
    localStorage.setItem("pizzahub_jwt_token", token);
  } else {
    localStorage.removeItem("pizzahub_jwt_token");
  }
}

export async function apiRequest(endpointPath, options = {}) {
  const token = getStoredToken();
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const normalizedPath = endpointPath.startsWith("/")
    ? endpointPath
    : `/${endpointPath}`;

  const targetUrl = `${resolveApiBaseUrl()}${normalizedPath}`;
  const response = await fetch(targetUrl, {
    ...options,
    headers,
    credentials: "include",
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const error = new Error(
      payload?.message ||
        payload?.error ||
        `Request failed with status ${response.status}`
    );
    error.status = response.status;
    error.code = payload?.code;
    throw error;
  }

  return payload;
}

export function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error("No file selected."));
      return;
    }
    if (!file.type.startsWith("image/")) {
      reject(new Error("Please select an image file (JPG, PNG, or WEBP)."));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      reject(new Error("Image file size must be less than 5 MB."));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Failed to read selected image file."));
    reader.readAsDataURL(file);
  });
}

export async function uploadImageToImgBB(file, { requireAuthUpload = true } = {}) {
  const dataUrl = await readFileAsDataUrl(file);
  const publicImgBBKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

  // Direct client ImgBB upload if public key is set
  if (publicImgBBKey && publicImgBBKey.trim()) {
    const base64 = dataUrl.replace(/^data:.*;base64,/, "");
    const formData = new FormData();
    formData.append("image", base64);
    const res = await fetch(
      `https://api.imgbb.com/1/upload?key=${encodeURIComponent(publicImgBBKey.trim())}`,
      {
        method: "POST",
        body: formData,
      }
    );
    const json = await res.json().catch(() => null);
    if (!res.ok || !json?.success || !json?.data?.url) {
      throw new Error(json?.error?.message || "ImgBB upload failed.");
    }
    return json.data.display_url || json.data.url;
  }

  if (requireAuthUpload && getStoredToken()) {
    const res = await apiRequest("/upload/imgbb", {
      method: "POST",
      body: JSON.stringify({
        imageData: dataUrl,
        fileName: file.name || "pizzahub-image",
      }),
    });
    return res.url;
  }

  // Compact resize for unauthenticated avatar upload during Sign Up
  return dataUrl;
}

export function formatPrice(amount) {
  const num = Number(amount) || 0;
  return `$${num.toFixed(2)}`;
}

export function formatDate(dateInput, withTime = false) {
  if (!dateInput) return "";
  const d = new Date(dateInput);
  if (Number.isNaN(d.getTime())) return dateInput;
  return d.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
    ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
  });
}

export const PIZZA_CATEGORIES = [
  "Classic Pizzas",
  "Vegetarian Pizzas",
  "Meat Lovers",
  "Specialty / Gourmet Pizzas",
  "Sides & Appetizers",
  "Beverages & Desserts",
];
