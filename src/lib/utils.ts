import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRelativeDate(value: string) {
  const diff = Date.now() - new Date(value).getTime();
  const hours = Math.max(1, Math.round(diff / (1000 * 60 * 60)));
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

export function getAccentClasses(accent: string) {
  switch (accent) {
    case "coral":
      return "bg-[rgba(239,141,141,0.14)] text-[var(--accent-coral)]";
    case "ink":
      return "bg-[var(--surface-contrast)] text-[var(--app-bg)]";
    case "lilac":
      return "bg-[rgba(147,171,239,0.1)] text-[var(--text-secondary)]";
    default:
      return "bg-[rgba(147,171,239,0.15)] text-[var(--accent-blue)]";
  }
}
