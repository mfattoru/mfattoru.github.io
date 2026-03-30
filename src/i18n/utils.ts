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

/** Maps a page-slug in any language to its equivalent in both languages */
const pageSlugMap: Record<string, Record<Lang, string>> = {
  'chi-siamo':  { it: 'chi-siamo', en: 'about' },
  'about':      { it: 'chi-siamo', en: 'about' },
  'progetti':   { it: 'progetti',  en: 'projects' },
  'projects':   { it: 'progetti',  en: 'projects' },
  'contatti':   { it: 'contatti',  en: 'contact' },
  'contact':    { it: 'contatti',  en: 'contact' },
  'preventivo': { it: 'preventivo', en: 'quote' },
  'quote':      { it: 'preventivo', en: 'quote' },
  'prezzi':     { it: 'prezzi',    en: 'pricing' },
  'pricing':    { it: 'prezzi',    en: 'pricing' },
  'carriere':   { it: 'carriere',  en: 'careers' },
  'careers':    { it: 'carriere',  en: 'careers' },
  'soluzioni':  { it: 'soluzioni', en: 'solutions' },
  'solutions':  { it: 'soluzioni', en: 'solutions' },
  'news':       { it: 'news',      en: 'news' },
  'faq':        { it: 'faq',       en: 'faq' },
};

/** Maps IT solution slug → EN solution slug (and vice-versa) */
export const solutionSlugMap: Record<string, Record<Lang, string>> = {
  'progettazione-architettonica': { it: 'progettazione-architettonica', en: 'architectural-design' },
  'architectural-design':         { it: 'progettazione-architettonica', en: 'architectural-design' },
  'formazione-sicurezza':         { it: 'formazione-sicurezza',         en: 'safety-training' },
  'safety-training':              { it: 'formazione-sicurezza',         en: 'safety-training' },
  'sicurezza-sul-lavoro':         { it: 'sicurezza-sul-lavoro',         en: 'workplace-safety' },
  'workplace-safety':             { it: 'sicurezza-sul-lavoro',         en: 'workplace-safety' },
  'direzione-lavori':             { it: 'direzione-lavori',             en: 'construction-management' },
  'construction-management':      { it: 'direzione-lavori',             en: 'construction-management' },
  'superbonus-110':               { it: 'superbonus-110',               en: 'superbonus-110' },
  'sostenibilita-energetica':     { it: 'sostenibilita-energetica',     en: 'sustainability-energy' },
  'sustainability-energy':        { it: 'sostenibilita-energetica',     en: 'sustainability-energy' },
  'acustica-edilizia':            { it: 'acustica-edilizia',            en: 'acoustic-engineering' },
  'acoustic-engineering':         { it: 'acustica-edilizia',            en: 'acoustic-engineering' },
  'estimo-immobiliare':           { it: 'estimo-immobiliare',           en: 'real-estate-appraisal' },
  'real-estate-appraisal':        { it: 'estimo-immobiliare',           en: 'real-estate-appraisal' },
  'edilizia':                     { it: 'edilizia',                     en: 'construction' },
  'construction':                 { it: 'edilizia',                     en: 'construction' },
};

/**
 * Returns the equivalent URL in `targetLang`.
 * Handles: /it/progetti → /en/projects
 *          /it/soluzioni/progettazione-architettonica → /en/solutions/architectural-design
 */
export function getAlternateUrl(url: URL, targetLang: Lang): string {
  const parts = url.pathname.split('/').filter(Boolean);
  // parts = ['it', 'progetti'] or ['it', 'soluzioni', 'progettazione-architettonica']

  if (parts.length === 0) return `/${targetLang}/`;

  // parts[0] = lang prefix (ignore, we use targetLang)
  const pageSlug = parts[1]; // e.g. 'progetti', 'soluzioni', 'news'
  const subSlug  = parts[2]; // e.g. solution slug or news slug

  if (!pageSlug) return `/${targetLang}/`;

  // Translate the page slug
  const pageMapping = pageSlugMap[pageSlug];
  const targetPage = pageMapping ? pageMapping[targetLang] : pageSlug;

  if (!subSlug) {
    return `/${targetLang}/${targetPage}/`;
  }

  // Translate the sub-slug (only needed for solution pages)
  const solutionMapping = solutionSlugMap[subSlug];
  const targetSubSlug = solutionMapping ? solutionSlugMap[subSlug][targetLang] : subSlug;

  return `/${targetLang}/${targetPage}/${targetSubSlug}/`;
}
