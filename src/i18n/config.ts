export const locales = ["en", "zh-hant"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export function normalizeLangParam(param?: string | null): Locale {
  if (!param) return defaultLocale;
  const lower = param.toLowerCase();
  return (locales as readonly string[]).includes(lower)
    ? (lower as Locale)
    : defaultLocale;
}

export function toHtmlLang(locale: Locale): string {
  return locale === "zh-hant" ? "zh-Hant" : "en";
}
