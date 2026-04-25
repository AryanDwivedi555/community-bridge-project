import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind CSS classes with clsx and tailwind-merge.
 * Critical for dynamic UI components like Mission Control.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * GEOSPATIAL LOGIC: Haversine Formula
 * Calculates the great-circle distance between two points on Earth in Kilometers.
 * Essential for your Volunteer-to-User proximity notifications.
 */
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in KM
}

/**
 * Formats distance for the UI (e.g., "2.4 km away")
 */
export function formatDistance(km: number): string {
  if (km < 1) {
    return `${(km * 1000).toFixed(0)}m away`;
  }
  return `${km.toFixed(1)}km away`;
}

/**
 * Formats a date string into a clean, readable community report format.
 * Optimized for Indian Locale (en-IN).
 */
export function formatDate(date: string | Date) {
  try {
    return new Intl.DateTimeFormat("en-IN", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(date));
  } catch (e) {
    return "Date Unavailable";
  }
}

/**
 * Advanced ID generator for local-first sync logic.
 * Uses a timestamp + random string to ensure uniqueness during live tracking.
 */
export function generateId(prefix: string = "id") {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 7);
  return `${prefix}_${timestamp}_${randomStr}`;
}

/**
 * Helper to determine urgency colors for map markers and reports.
 */
export function getUrgencyColor(level: number) {
  if (level >= 4) return "bg-red-500";
  if (level >= 2) return "bg-amber-500";
  return "bg-emerald-500";
}