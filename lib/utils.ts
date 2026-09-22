import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function getStoredLocale(value: string | null) {
  if (value === "fr" || value === "es" || value === "en") {
    return value;
  }

  return "en";
}
