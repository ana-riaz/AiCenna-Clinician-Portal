import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Seeded random number generator for deterministic history
export function generateHistory(
  seed: number,
  from: number,
  to: number,
  count: number,
  noise: number
): number[] {
  let s = ((seed * 1664525 + 1013904223) | 0) >>> 0;
  return Array.from({ length: count }, (_, i) => {
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    const base = from + (to - from) * (i / Math.max(count - 1, 1));
    return Math.round(base + ((s >>> 0) / 4294967296 - 0.5) * noise * 2);
  });
}

// Format relative time
export function formatRelativeTime(timestamp: number): string {
  const minutes = Math.floor((Date.now() - timestamp) / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

// Get risk class based on risk level
export function getRiskClass(risk: string): string {
  const classes: Record<string, string> = {
    cr: "risk-critical",
    hi: "risk-high",
    me: "risk-medium",
    st: "risk-low",
    lo: "risk-low",
  };
  return classes[risk] || "risk-low";
}

// Get avatar class based on risk level
export function getAvatarClass(risk: string): string {
  const classes: Record<string, string> = {
    cr: "avatar-critical",
    hi: "avatar-high",
    me: "avatar-medium",
    st: "avatar-low",
    lo: "avatar-low",
  };
  return classes[risk] || "avatar-low";
}

// Get score color class
export function getScoreClass(score: number): string {
  if (score >= 80) return "text-success";
  if (score >= 60) return "text-warning";
  return "text-danger";
}

// Get trend color class
export function getTrendClass(tc: string): string {
  const classes: Record<string, string> = {
    n: "trend-normal",
    e: "trend-elevated",
    c: "trend-critical",
  };
  return classes[tc] || "trend-normal";
}
