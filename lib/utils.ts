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

export const githubUrl = "https://github.com/Aubierge-codes/";
export const emailAddress = "aubierge7557@gmail.com";
