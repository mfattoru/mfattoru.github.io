import it from './it.json';
import en from './en.json';

export type Lang = 'it' | 'en';
type Translations = Record<string, string>;

const translations: Record<Lang, Translations> = { it, en };

export function t(lang: Lang, key: string): string {
  return translations[lang][key] ?? key;
}

export function getLangFromUrl(url: URL): Lang {
  const [, lang] = url.pathname.split('/');
  if (lang === 'en') return 'en';
  return 'it';
}

export function getAlternateUrl(url: URL, targetLang: Lang): string {
  const parts = url.pathname.split('/');
  parts[1] = targetLang;
  return parts.join('/');
}
