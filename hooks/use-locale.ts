"use client";

import { useEffect, useMemo, useState } from "react";
import { translations } from "@/data/translations";
import { getStoredLocale } from "@/lib/utils";
import type { Locale, TranslationKey } from "@/types/content";

const storageKey = "aubierge-locale";

export function useLocale() {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    const stored = getStoredLocale(window.localStorage.getItem(storageKey));
    setLocaleState(stored);
    document.documentElement.lang = stored;
  }, []);

  const setLocale = (nextLocale: Locale) => {
    setLocaleState(nextLocale);
    window.localStorage.setItem(storageKey, nextLocale);
    document.documentElement.lang = nextLocale;
  };

  const bundle = translations[locale];

  const t = useMemo(() => {
    return (key: TranslationKey) => bundle[key];
  }, [bundle]);

  return {
    locale,
    setLocale,
    t,
    bundle
  };
}
