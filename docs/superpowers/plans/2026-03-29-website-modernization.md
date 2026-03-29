# Website Modernization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild mfattoru.github.io as a modern Astro + Tailwind static site with 8 themes, bilingual IT/EN routing, and Formspree contact forms, deployed automatically to GitHub Pages.

**Architecture:** Astro 4.x with static output generates all pages from a single `Base.astro` layout, eliminating the 83-file copy-paste problem. CSS custom properties on `data-theme` attribute implement 8 named themes without any JS framework. Content lives in Markdown files under `src/content/`. Language routing uses Astro's built-in i18n with `prefixDefaultLocale: true`.

**Tech Stack:** Astro 4.x, Tailwind CSS 3.x, Vitest 1.x (unit tests), Formspree (contact forms), GitHub Actions (deploy), GitHub Pages (hosting)

---

## File Map

```
src/
  layouts/
    Base.astro                        ← single shared layout, all pages use this
  components/
    Nav.astro                         ← sticky nav, links, theme+lang switchers
    Footer.astro                      ← footer with contact info and links
    ThemeSwitcher.astro               ← dropdown palette selector (8 themes)
    LangSwitcher.astro                ← IT | EN toggle
    Hero.astro                        ← homepage hero section
    ServiceCard.astro                 ← card used in services grid
  pages/
    index.astro                       ← redirects to /it/
    it/
      index.astro                     ← homepage IT
      chi-siamo.astro
      progetti.astro
      contatti.astro
      preventivo.astro
      faq.astro
      prezzi.astro
      carriere.astro
      soluzioni/
        [slug].astro                  ← dynamic, from content collection
      news/
        index.astro
        [slug].astro
    en/
      index.astro                     ← homepage EN
      about.astro
      projects.astro
      contact.astro
      quote.astro
      faq.astro
      pricing.astro
      careers.astro
      solutions/
        [slug].astro
      news/
        index.astro
        [slug].astro
  content/
    config.ts                         ← content collection schemas
    solutions-it/                     ← 9 .md files
    solutions-en/                     ← 9 .md files
    news-it/                          ← sample posts
    news-en/
  i18n/
    it.json                           ← all UI strings in Italian
    en.json                           ← all UI strings in English
    utils.ts                          ← t(), getLangFromUrl(), getAlternateUrl()
  styles/
    themes.css                        ← 8 data-theme variable sets
    global.css                        ← @import themes, tailwind directives, base styles
tests/
  i18n.test.ts
  theme.test.ts
astro.config.mjs
tailwind.config.mjs
package.json
Makefile
.github/
  workflows/
    deploy.yml
public/
  image/                              ← existing images copied as-is
```

---

## Task 1: Archive old files and initialize Astro project

**Files:**
- Delete: all root `*.html` files, `/css/`, `/scss/`, `/js/`, `/fonts/`, `/form/`, `/docs/`, `/solutions/`, `/projects/`, `/resources/`
- Create: `package.json`, `astro.config.mjs`, `tailwind.config.mjs`, `tsconfig.json`

- [ ] **Step 1: Move existing images to a safe location**

```bash
mkdir -p /tmp/site-images-backup
cp -r image/ /tmp/site-images-backup/
```

- [ ] **Step 2: Remove old files from the repo**

```bash
cd /Users/mfattoru/Documents/repos/mfattoru.github.io
rm -rf css scss js fonts form solutions projects resources docs
find . -maxdepth 1 -name "*.html" -delete
find . -maxdepth 1 -name "*.php" -delete
find . -maxdepth 1 -name "*.xml" -delete
find . -maxdepth 1 -name "*.txt" -not -name "LICENSE*" -delete
```

- [ ] **Step 3: Create package.json**

```json
{
  "name": "mfattoru-github-io",
  "type": "module",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "check": "astro check",
    "test": "vitest run"
  },
  "dependencies": {
    "astro": "^4.15.0",
    "@astrojs/tailwind": "^5.1.0",
    "tailwindcss": "^3.4.0"
  },
  "devDependencies": {
    "@astrojs/check": "^0.9.0",
    "typescript": "^5.5.0",
    "vitest": "^1.6.0"
  }
}
```

- [ ] **Step 4: Install dependencies**

```bash
npm install
```

Expected: `node_modules/` created, no errors.

- [ ] **Step 5: Create astro.config.mjs**

```js
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://mfattoru.github.io',
  integrations: [tailwind({ applyBaseStyles: false })],
  output: 'static',
  i18n: {
    defaultLocale: 'it',
    locales: ['it', 'en'],
    routing: {
      prefixDefaultLocale: true,
    },
  },
});
```

- [ ] **Step 6: Create tailwind.config.mjs**

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,ts,jsx,tsx,md,mdx}'],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        surface: 'var(--color-surface)',
        accent: 'var(--color-accent)',
      },
      fontFamily: {
        heading: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
```

- [ ] **Step 7: Create tsconfig.json**

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

- [ ] **Step 8: Create src/ directory structure**

```bash
mkdir -p src/{layouts,components,pages/{it/{soluzioni,news},en/{solutions,news}},content/{solutions-it,solutions-en,news-it,news-en},i18n,styles}
mkdir -p public/image
mkdir -p tests
mkdir -p .github/workflows
```

- [ ] **Step 9: Copy images back**

```bash
cp -r /tmp/site-images-backup/image/* public/image/
```

- [ ] **Step 10: Verify Astro can start (add a placeholder page first)**

Create `src/pages/index.astro`:
```astro
---
---
<html><body><h1>Hello</h1></body></html>
```

```bash
npm run build
```

Expected: `dist/` created, no errors.

- [ ] **Step 11: Commit**

```bash
git add -A
git commit -m "feat: initialize Astro + Tailwind project, archive old files"
```

---

## Task 2: CSS theme system

**Files:**
- Create: `src/styles/themes.css`
- Create: `src/styles/global.css`

- [ ] **Step 1: Create src/styles/themes.css**

```css
/* Steel — structural steel, industrial (default) */
[data-theme="steel"], :root {
  --color-bg: #0F172A;
  --color-surface: #1E293B;
  --color-primary: #2563EB;
  --color-text: #F1F5F9;
  --color-accent: #64748B;
  --color-border: #334155;
}

/* Blueprint — technical drawing, deep navy */
[data-theme="blueprint"] {
  --color-bg: #0F2044;
  --color-surface: #162A5A;
  --color-primary: #0EA5E9;
  --color-text: #F0F9FF;
  --color-accent: #FDE047;
  --color-border: #1E3A6E;
}

/* Obsidian — high contrast, near black */
[data-theme="obsidian"] {
  --color-bg: #09090B;
  --color-surface: #18181B;
  --color-primary: #F59E0B;
  --color-text: #FAFAFA;
  --color-accent: #3F3F46;
  --color-border: #27272A;
}

/* Industrial — raw factory, rust orange */
[data-theme="industrial"] {
  --color-bg: #1A1A1A;
  --color-surface: #2A2A2A;
  --color-primary: #EA580C;
  --color-text: #F5F0E8;
  --color-accent: #D4C5A0;
  --color-border: #3A3A3A;
}

/* Forest — sustainability, energy efficiency */
[data-theme="forest"] {
  --color-bg: #0D1F0F;
  --color-surface: #163018;
  --color-primary: #84CC16;
  --color-text: #F7FEE7;
  --color-accent: #4D7C0F;
  --color-border: #1E4020;
}

/* Limestone — natural stone, warm professional */
[data-theme="limestone"] {
  --color-bg: #FAF9F6;
  --color-surface: #EDEBE5;
  --color-primary: #1E3A5F;
  --color-text: #1C1917;
  --color-accent: #78716C;
  --color-border: #D6D3CC;
}

/* Marble — premium architectural */
[data-theme="marble"] {
  --color-bg: #FFFFFF;
  --color-surface: #F5F5F5;
  --color-primary: #1A1A1A;
  --color-text: #111111;
  --color-accent: #B8860B;
  --color-border: #E5E5E5;
}

/* Daylight — clean modern office */
[data-theme="daylight"] {
  --color-bg: #F8FAFC;
  --color-surface: #EFF6FF;
  --color-primary: #2563EB;
  --color-text: #0F172A;
  --color-accent: #64748B;
  --color-border: #DBEAFE;
}
```

- [ ] **Step 2: Create src/styles/global.css**

```css
@import './themes.css';

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    background-color: var(--color-bg);
    color: var(--color-text);
  }

  body {
    background-color: var(--color-bg);
    color: var(--color-text);
    font-family: system-ui, sans-serif;
    min-height: 100vh;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: 'Inter', system-ui, sans-serif;
    font-weight: 700;
  }

  a {
    color: var(--color-primary);
  }
}

@layer components {
  .btn-primary {
    @apply px-6 py-3 font-semibold text-sm uppercase tracking-widest transition-opacity;
    background-color: var(--color-primary);
    color: var(--color-bg);
  }

  .btn-primary:hover {
    opacity: 0.85;
  }

  .btn-outline {
    @apply px-6 py-3 font-semibold text-sm uppercase tracking-widest border transition-colors;
    border-color: var(--color-primary);
    color: var(--color-primary);
  }

  .btn-outline:hover {
    background-color: var(--color-primary);
    color: var(--color-bg);
  }

  .card {
    background-color: var(--color-surface);
    border: 1px solid var(--color-border);
  }

  .section-title {
    @apply text-3xl font-heading font-bold uppercase tracking-wider mb-2;
  }

  .section-subtitle {
    @apply text-sm uppercase tracking-widest mb-12;
    color: var(--color-accent);
  }
}
```

- [ ] **Step 3: Run build to verify CSS compiles**

```bash
npm run build
```

Expected: build passes, `dist/` has CSS output.

- [ ] **Step 4: Commit**

```bash
git add src/styles/
git commit -m "feat: add 8-theme CSS custom property system"
```

---

## Task 3: i18n utility and translation files

**Files:**
- Create: `src/i18n/it.json`
- Create: `src/i18n/en.json`
- Create: `src/i18n/utils.ts`
- Create: `tests/i18n.test.ts`

- [ ] **Step 1: Write the failing tests**

Create `tests/i18n.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { t, getLangFromUrl, getAlternateUrl } from '../src/i18n/utils';

describe('t()', () => {
  it('returns Italian translation for known key', () => {
    expect(t('it', 'nav.home')).toBe('Home');
  });

  it('returns English translation for known key', () => {
    expect(t('en', 'nav.about')).toBe('About');
  });

  it('returns the key itself for unknown keys', () => {
    expect(t('it', 'no.such.key')).toBe('no.such.key');
  });
});

describe('getLangFromUrl()', () => {
  it('returns it for /it/ path', () => {
    expect(getLangFromUrl(new URL('https://mfattoru.github.io/it/'))).toBe('it');
  });

  it('returns en for /en/about path', () => {
    expect(getLangFromUrl(new URL('https://mfattoru.github.io/en/about'))).toBe('en');
  });

  it('defaults to it for root or unknown prefix', () => {
    expect(getLangFromUrl(new URL('https://mfattoru.github.io/'))).toBe('it');
  });
});

describe('getAlternateUrl()', () => {
  it('swaps /it/ to /en/ in path', () => {
    expect(getAlternateUrl(new URL('https://mfattoru.github.io/it/chi-siamo'), 'en')).toBe('/en/chi-siamo');
  });

  it('swaps /en/ to /it/ in path', () => {
    expect(getAlternateUrl(new URL('https://mfattoru.github.io/en/about'), 'it')).toBe('/it/about');
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm test
```

Expected: FAIL — "Cannot find module '../src/i18n/utils'"

- [ ] **Step 3: Create src/i18n/it.json**

```json
{
  "nav.home": "Home",
  "nav.about": "Chi Siamo",
  "nav.solutions": "Soluzioni",
  "nav.projects": "Progetti",
  "nav.contact": "Contatti",
  "nav.news": "News",
  "nav.faq": "FAQ",
  "nav.pricing": "Prezzi",
  "nav.careers": "Carriere",
  "nav.quote": "Preventivo",

  "hero.title": "Ingegneria. Precisione. Risultati.",
  "hero.subtitle": "Soluzioni tecniche e progettuali per l'edilizia e la sicurezza.",
  "hero.cta.primary": "Scopri i servizi",
  "hero.cta.secondary": "Contattaci",

  "home.services.title": "I Nostri Servizi",
  "home.services.subtitle": "Competenza tecnica al servizio del territorio",
  "home.projects.title": "Progetti Recenti",
  "home.cta.title": "Hai un progetto in mente?",
  "home.cta.text": "Contattaci per un preventivo gratuito e senza impegno.",
  "home.cta.button": "Richiedi un preventivo",

  "about.title": "Chi Siamo",
  "about.subtitle": "Ing. Onofrio Fattoruso — Engineering Solutions",

  "solutions.title": "Le Nostre Soluzioni",
  "solutions.subtitle": "Servizi professionali di ingegneria e consulenza tecnica",
  "solutions.back": "← Tutte le soluzioni",

  "projects.title": "Progetti",
  "projects.subtitle": "Una selezione dei nostri lavori",

  "contact.title": "Contatti",
  "contact.subtitle": "Siamo a tua disposizione",
  "contact.name": "Nome e Cognome",
  "contact.email": "Email",
  "contact.phone": "Telefono",
  "contact.service": "Servizio di interesse",
  "contact.service.placeholder": "Seleziona un servizio",
  "contact.message": "Messaggio",
  "contact.send": "Invia messaggio",
  "contact.success": "Messaggio inviato! Ti risponderemo presto.",
  "contact.error": "Errore nell'invio. Riprova o scrivici direttamente.",
  "contact.address": "Via San Nicola del Vaglio 2, 80050, Lettere (NA)",
  "contact.phone.value": "+39 081-1808-8820",
  "contact.email.value": "fattoruso.engineeringsolutions@gmail.com",
  "contact.vat": "P.IVA 09348851214",

  "quote.title": "Richiedi un Preventivo",
  "quote.subtitle": "Compila il modulo per ricevere una valutazione gratuita",
  "quote.project.type": "Tipo di progetto",
  "quote.budget": "Budget indicativo",
  "quote.timeline": "Tempistica desiderata",
  "quote.send": "Invia richiesta",

  "news.title": "News",
  "news.subtitle": "Aggiornamenti e approfondimenti",
  "news.read.more": "Leggi di più →",

  "faq.title": "Domande Frequenti",
  "faq.subtitle": "Risposte alle domande più comuni",

  "pricing.title": "Prezzi",
  "pricing.subtitle": "Trasparenza e professionalità",

  "careers.title": "Carriere",
  "careers.subtitle": "Unisciti al team",

  "footer.rights": "Tutti i diritti riservati",
  "footer.vat": "P.IVA 09348851214"
}
```

- [ ] **Step 4: Create src/i18n/en.json**

```json
{
  "nav.home": "Home",
  "nav.about": "About",
  "nav.solutions": "Solutions",
  "nav.projects": "Projects",
  "nav.contact": "Contact",
  "nav.news": "News",
  "nav.faq": "FAQ",
  "nav.pricing": "Pricing",
  "nav.careers": "Careers",
  "nav.quote": "Get a Quote",

  "hero.title": "Engineering. Precision. Results.",
  "hero.subtitle": "Technical and design solutions for construction and safety.",
  "hero.cta.primary": "Our services",
  "hero.cta.secondary": "Contact us",

  "home.services.title": "Our Services",
  "home.services.subtitle": "Technical expertise at the service of the territory",
  "home.projects.title": "Recent Projects",
  "home.cta.title": "Have a project in mind?",
  "home.cta.text": "Contact us for a free, no-obligation quote.",
  "home.cta.button": "Request a quote",

  "about.title": "About Us",
  "about.subtitle": "Ing. Onofrio Fattoruso — Engineering Solutions",

  "solutions.title": "Our Solutions",
  "solutions.subtitle": "Professional engineering and technical consulting services",
  "solutions.back": "← All solutions",

  "projects.title": "Projects",
  "projects.subtitle": "A selection of our work",

  "contact.title": "Contact",
  "contact.subtitle": "We are at your disposal",
  "contact.name": "Full Name",
  "contact.email": "Email",
  "contact.phone": "Phone",
  "contact.service": "Service of interest",
  "contact.service.placeholder": "Select a service",
  "contact.message": "Message",
  "contact.send": "Send message",
  "contact.success": "Message sent! We will get back to you soon.",
  "contact.error": "Send error. Please try again or contact us directly.",
  "contact.address": "Via San Nicola del Vaglio 2, 80050, Lettere (NA), Italy",
  "contact.phone.value": "+39 081-1808-8820",
  "contact.email.value": "fattoruso.engineeringsolutions@gmail.com",
  "contact.vat": "VAT 09348851214",

  "quote.title": "Request a Quote",
  "quote.subtitle": "Fill in the form to receive a free assessment",
  "quote.project.type": "Project type",
  "quote.budget": "Estimated budget",
  "quote.timeline": "Desired timeline",
  "quote.send": "Send request",

  "news.title": "News",
  "news.subtitle": "Updates and insights",
  "news.read.more": "Read more →",

  "faq.title": "Frequently Asked Questions",
  "faq.subtitle": "Answers to common questions",

  "pricing.title": "Pricing",
  "pricing.subtitle": "Transparency and professionalism",

  "careers.title": "Careers",
  "careers.subtitle": "Join our team",

  "footer.rights": "All rights reserved",
  "footer.vat": "VAT 09348851214"
}
```

- [ ] **Step 5: Create src/i18n/utils.ts**

```ts
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
```

- [ ] **Step 6: Run tests to verify they pass**

```bash
npm test
```

Expected: all 7 tests PASS.

- [ ] **Step 7: Commit**

```bash
git add src/i18n/ tests/i18n.test.ts
git commit -m "feat: add i18n utility with IT/EN translations"
```

---

## Task 4: ThemeSwitcher and LangSwitcher components

**Files:**
- Create: `src/components/ThemeSwitcher.astro`
- Create: `src/components/LangSwitcher.astro`

- [ ] **Step 1: Create src/components/ThemeSwitcher.astro**

```astro
---
const themes = [
  { id: 'steel',      label: 'Steel',      swatch: '#2563EB' },
  { id: 'blueprint',  label: 'Blueprint',  swatch: '#0EA5E9' },
  { id: 'obsidian',   label: 'Obsidian',   swatch: '#F59E0B' },
  { id: 'industrial', label: 'Industrial', swatch: '#EA580C' },
  { id: 'forest',     label: 'Forest',     swatch: '#84CC16' },
  { id: 'limestone',  label: 'Limestone',  swatch: '#1E3A5F' },
  { id: 'marble',     label: 'Marble',     swatch: '#B8860B' },
  { id: 'daylight',   label: 'Daylight',   swatch: '#2563EB' },
];
---

<div class="relative" id="theme-switcher">
  <button
    id="theme-toggle"
    class="flex items-center gap-2 px-3 py-1.5 text-xs uppercase tracking-widest border transition-colors"
    style="border-color: var(--color-border); color: var(--color-text);"
    aria-label="Change theme"
  >
    <span id="theme-swatch" class="w-2.5 h-2.5 rounded-full inline-block"></span>
    <span id="theme-label">Theme</span>
    <svg class="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
    </svg>
  </button>

  <div
    id="theme-menu"
    class="hidden absolute right-0 top-full mt-1 z-50 min-w-[140px] shadow-lg"
    style="background: var(--color-surface); border: 1px solid var(--color-border);"
  >
    {themes.map(theme => (
      <button
        data-theme-id={theme.id}
        class="theme-option flex items-center gap-2 w-full px-3 py-2 text-xs uppercase tracking-widest text-left transition-colors"
        style="color: var(--color-text);"
      >
        <span
          class="w-2.5 h-2.5 rounded-full inline-block flex-shrink-0"
          style={`background: ${theme.swatch}`}
        ></span>
        {theme.label}
      </button>
    ))}
  </div>
</div>

<script>
  const THEMES = [
    { id: 'steel',      label: 'Steel',      swatch: '#2563EB' },
    { id: 'blueprint',  label: 'Blueprint',  swatch: '#0EA5E9' },
    { id: 'obsidian',   label: 'Obsidian',   swatch: '#F59E0B' },
    { id: 'industrial', label: 'Industrial', swatch: '#EA580C' },
    { id: 'forest',     label: 'Forest',     swatch: '#84CC16' },
    { id: 'limestone',  label: 'Limestone',  swatch: '#1E3A5F' },
    { id: 'marble',     label: 'Marble',     swatch: '#B8860B' },
    { id: 'daylight',   label: 'Daylight',   swatch: '#2563EB' },
  ];

  function applyTheme(id: string) {
    document.documentElement.setAttribute('data-theme', id);
    localStorage.setItem('theme', id);
    const theme = THEMES.find(t => t.id === id);
    if (!theme) return;
    const swatchEl = document.getElementById('theme-swatch');
    const labelEl = document.getElementById('theme-label');
    if (swatchEl) swatchEl.style.background = theme.swatch;
    if (labelEl) labelEl.textContent = theme.label;
  }

  const toggle = document.getElementById('theme-toggle');
  const menu = document.getElementById('theme-menu');

  toggle?.addEventListener('click', () => menu?.classList.toggle('hidden'));

  document.querySelectorAll<HTMLElement>('.theme-option').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.themeId;
      if (id) applyTheme(id);
      menu?.classList.add('hidden');
    });
  });

  document.addEventListener('click', (e) => {
    const switcher = document.getElementById('theme-switcher');
    if (switcher && !switcher.contains(e.target as Node)) {
      menu?.classList.add('hidden');
    }
  });

  // Initialize on load
  const saved = localStorage.getItem('theme') || 'steel';
  applyTheme(saved);
</script>
```

- [ ] **Step 2: Create src/components/LangSwitcher.astro**

```astro
---
import { getAlternateUrl } from '../i18n/utils';
import type { Lang } from '../i18n/utils';

interface Props {
  lang: Lang;
  currentUrl: URL;
}

const { lang, currentUrl } = Astro.props;
const alternateUrl = getAlternateUrl(currentUrl, lang === 'it' ? 'en' : 'it');
---

<div class="flex items-center gap-1 text-xs uppercase tracking-widest">
  <span
    class="px-2 py-1 font-bold"
    style={lang === 'it' ? 'color: var(--color-primary);' : 'color: var(--color-accent);'}
  >
    IT
  </span>
  <span style="color: var(--color-border);">|</span>
  <a
    href={alternateUrl}
    class="px-2 py-1 transition-colors"
    style={lang === 'en' ? 'color: var(--color-primary);' : 'color: var(--color-accent);'}
  >
    EN
  </a>
</div>
```

- [ ] **Step 3: Run build to verify components compile**

```bash
npm run build
```

Expected: build passes.

- [ ] **Step 4: Commit**

```bash
git add src/components/ThemeSwitcher.astro src/components/LangSwitcher.astro
git commit -m "feat: add ThemeSwitcher and LangSwitcher components"
```

---

## Task 5: Nav, Footer, and Base layout

**Files:**
- Create: `src/components/Nav.astro`
- Create: `src/components/Footer.astro`
- Create: `src/layouts/Base.astro`

- [ ] **Step 1: Create src/components/Nav.astro**

```astro
---
import ThemeSwitcher from './ThemeSwitcher.astro';
import LangSwitcher from './LangSwitcher.astro';
import { t } from '../i18n/utils';
import type { Lang } from '../i18n/utils';

interface Props {
  lang: Lang;
  currentPath: string;
}

const { lang, currentPath } = Astro.props;
const base = `/${lang}`;

const links = lang === 'it'
  ? [
      { href: `${base}/`, label: t(lang, 'nav.home') },
      { href: `${base}/chi-siamo`, label: t(lang, 'nav.about') },
      { href: `${base}/soluzioni/progettazione-architettonica`, label: t(lang, 'nav.solutions') },
      { href: `${base}/progetti`, label: t(lang, 'nav.projects') },
      { href: `${base}/news`, label: t(lang, 'nav.news') },
      { href: `${base}/contatti`, label: t(lang, 'nav.contact') },
    ]
  : [
      { href: `${base}/`, label: t(lang, 'nav.home') },
      { href: `${base}/about`, label: t(lang, 'nav.about') },
      { href: `${base}/solutions/architectural-design`, label: t(lang, 'nav.solutions') },
      { href: `${base}/projects`, label: t(lang, 'nav.projects') },
      { href: `${base}/news`, label: t(lang, 'nav.news') },
      { href: `${base}/contact`, label: t(lang, 'nav.contact') },
    ];

const currentUrl = new URL(Astro.request.url);
---

<header
  class="sticky top-0 z-40 flex items-center justify-between px-6 md:px-12 h-16"
  style="background: var(--color-bg); border-bottom: 1px solid var(--color-border);"
>
  <!-- Logo -->
  <a href={`${base}/`} class="font-heading font-black text-lg uppercase tracking-widest" style="color: var(--color-text);">
    <span style="color: var(--color-primary);">ING.</span> FATTORUSO
  </a>

  <!-- Desktop nav links -->
  <nav class="hidden md:flex items-center gap-6">
    {links.map(link => (
      <a
        href={link.href}
        class="text-xs uppercase tracking-widest transition-colors"
        style={currentPath.startsWith(link.href) && link.href !== `${base}/`
          ? 'color: var(--color-primary);'
          : 'color: var(--color-accent);'}
      >
        {link.label}
      </a>
    ))}
  </nav>

  <!-- Right controls -->
  <div class="hidden md:flex items-center gap-4">
    <ThemeSwitcher />
    <LangSwitcher lang={lang} currentUrl={currentUrl} />
    <a href={lang === 'it' ? `${base}/preventivo` : `${base}/quote`} class="btn-primary text-xs">
      {t(lang, 'nav.quote')}
    </a>
  </div>

  <!-- Mobile hamburger -->
  <button id="mobile-toggle" class="md:hidden p-2" style="color: var(--color-text);" aria-label="Open menu">
    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path id="hamburger-icon" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
    </svg>
  </button>
</header>

<!-- Mobile menu overlay -->
<div
  id="mobile-menu"
  class="hidden fixed inset-0 z-30 flex flex-col items-center justify-center gap-8"
  style="background: var(--color-bg);"
>
  {links.map(link => (
    <a
      href={link.href}
      class="text-2xl font-heading font-bold uppercase tracking-widest"
      style="color: var(--color-text);"
    >
      {link.label}
    </a>
  ))}
  <div class="flex items-center gap-4 mt-8">
    <LangSwitcher lang={lang} currentUrl={currentUrl} />
  </div>
</div>

<script>
  const toggle = document.getElementById('mobile-toggle');
  const menu = document.getElementById('mobile-menu');

  toggle?.addEventListener('click', () => {
    menu?.classList.toggle('hidden');
  });

  document.querySelectorAll('#mobile-menu a').forEach(link => {
    link.addEventListener('click', () => menu?.classList.add('hidden'));
  });
</script>
```

- [ ] **Step 2: Create src/components/Footer.astro**

```astro
---
import { t } from '../i18n/utils';
import type { Lang } from '../i18n/utils';

interface Props {
  lang: Lang;
}

const { lang } = Astro.props;
const base = `/${lang}`;

const solutionLinks = lang === 'it'
  ? [
      { href: `${base}/soluzioni/progettazione-architettonica`, label: 'Progettazione Architettonica' },
      { href: `${base}/soluzioni/sicurezza-sul-lavoro`, label: 'Sicurezza Sul Lavoro' },
      { href: `${base}/soluzioni/direzione-lavori`, label: 'Direzione Lavori' },
      { href: `${base}/soluzioni/superbonus-110`, label: 'Superbonus 110%' },
      { href: `${base}/soluzioni/sostenibilita-energetica`, label: 'Sostenibilità Energetica' },
    ]
  : [
      { href: `${base}/solutions/architectural-design`, label: 'Architectural Design' },
      { href: `${base}/solutions/workplace-safety`, label: 'Workplace Safety' },
      { href: `${base}/solutions/construction-management`, label: 'Construction Management' },
      { href: `${base}/solutions/superbonus-110`, label: 'Superbonus 110%' },
      { href: `${base}/solutions/sustainability-energy`, label: 'Sustainability & Energy' },
    ];
---

<footer class="mt-24" style="background: var(--color-surface); border-top: 1px solid var(--color-border);">
  <div class="max-w-6xl mx-auto px-6 md:px-12 py-16 grid grid-cols-1 md:grid-cols-3 gap-12">
    <!-- Brand -->
    <div>
      <p class="font-heading font-black text-lg uppercase tracking-widest mb-4" style="color: var(--color-text);">
        <span style="color: var(--color-primary);">ING.</span> FATTORUSO
      </p>
      <p class="text-sm leading-relaxed" style="color: var(--color-accent);">
        Engineering Solutions<br />
        {t(lang, 'contact.address')}
      </p>
    </div>

    <!-- Services -->
    <div>
      <p class="text-xs font-bold uppercase tracking-widest mb-4" style="color: var(--color-text);">
        {t(lang, 'nav.solutions')}
      </p>
      <ul class="space-y-2">
        {solutionLinks.map(link => (
          <li>
            <a href={link.href} class="text-sm transition-colors" style="color: var(--color-accent);">
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>

    <!-- Contact -->
    <div>
      <p class="text-xs font-bold uppercase tracking-widest mb-4" style="color: var(--color-text);">
        {t(lang, 'nav.contact')}
      </p>
      <ul class="space-y-2 text-sm" style="color: var(--color-accent);">
        <li>
          <a href={`mailto:${t(lang, 'contact.email.value')}`} class="transition-colors hover:text-[var(--color-primary)]">
            {t(lang, 'contact.email.value')}
          </a>
        </li>
        <li>
          <a href={`tel:${t(lang, 'contact.phone.value')}`} class="transition-colors hover:text-[var(--color-primary)]">
            {t(lang, 'contact.phone.value')}
          </a>
        </li>
        <li>{t(lang, 'contact.vat')}</li>
      </ul>
    </div>
  </div>

  <div
    class="border-t px-6 md:px-12 py-4 text-center text-xs"
    style="border-color: var(--color-border); color: var(--color-accent);"
  >
    © {new Date().getFullYear()} Ing. Onofrio Fattoruso — {t(lang, 'footer.rights')}
  </div>
</footer>
```

- [ ] **Step 3: Create src/layouts/Base.astro**

```astro
---
import Nav from '../components/Nav.astro';
import Footer from '../components/Footer.astro';
import '../styles/global.css';
import type { Lang } from '../i18n/utils';

interface Props {
  lang: Lang;
  title: string;
  description?: string;
  currentPath?: string;
}

const { lang, title, description = 'Ing. Onofrio Fattoruso — Engineering Solutions', currentPath = Astro.url.pathname } = Astro.props;
---

<!doctype html>
<html lang={lang}>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{title} — Ing. Fattoruso Engineering Solutions</title>
    <meta name="description" content={description} />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap" rel="stylesheet" />

    <!-- Prevent theme flash: apply saved theme before paint -->
    <script is:inline>
      (function () {
        var saved = localStorage.getItem('theme') || 'steel';
        document.documentElement.setAttribute('data-theme', saved);
      })();
    </script>
  </head>
  <body>
    <Nav lang={lang} currentPath={currentPath} />
    <main>
      <slot />
    </main>
    <Footer lang={lang} />
  </body>
</html>
```

- [ ] **Step 4: Create a minimal test page to verify layout renders**

Replace `src/pages/index.astro`:
```astro
---
return Astro.redirect('/it/');
---
```

Create `src/pages/it/index.astro`:
```astro
---
import Base from '../../layouts/Base.astro';
---
<Base lang="it" title="Home">
  <section class="min-h-screen flex items-center justify-center">
    <h1 class="section-title">Ingegneria. Precisione. Risultati.</h1>
  </section>
</Base>
```

- [ ] **Step 5: Run build to verify layout compiles**

```bash
npm run build
```

Expected: build passes, `dist/it/index.html` exists.

- [ ] **Step 6: Commit**

```bash
git add src/layouts/ src/components/Nav.astro src/components/Footer.astro src/pages/
git commit -m "feat: add Base layout, Nav, and Footer components"
```

---

## Task 6: Content Collections (services + news)

**Files:**
- Create: `src/content/config.ts`
- Create: `src/content/solutions-it/*.md` (9 files)
- Create: `src/content/solutions-en/*.md` (9 files)
- Create: `src/content/news-it/benvenuto.md`
- Create: `src/content/news-en/welcome.md`

- [ ] **Step 1: Create src/content/config.ts**

```ts
import { defineCollection, z } from 'astro:content';

const solutionSchema = z.object({
  title: z.string(),
  description: z.string(),
  icon: z.string(),
  order: z.number(),
});

const newsSchema = z.object({
  title: z.string(),
  date: z.date(),
  description: z.string(),
  image: z.string().optional(),
});

export const collections = {
  'solutions-it': defineCollection({ type: 'content', schema: solutionSchema }),
  'solutions-en': defineCollection({ type: 'content', schema: solutionSchema }),
  'news-it': defineCollection({ type: 'content', schema: newsSchema }),
  'news-en': defineCollection({ type: 'content', schema: newsSchema }),
};
```

- [ ] **Step 2: Create the 9 Italian service files**

`src/content/solutions-it/progettazione-architettonica.md`:
```markdown
---
title: "Progettazione Architettonica"
description: "Progettazione di edifici residenziali, commerciali e industriali con attenzione alla funzionalità e all'estetica."
icon: "🏛"
order: 1
---

La progettazione architettonica richiede una profonda comprensione delle esigenze del cliente, delle normative vigenti e delle tecniche costruttive più avanzate. Il nostro studio offre soluzioni progettuali complete, dal concept fino alla realizzazione, per edifici residenziali, commerciali e industriali.

Ogni progetto è sviluppato con attenzione alla sostenibilità, all'efficienza energetica e al rispetto del contesto ambientale e urbanistico.
```

`src/content/solutions-it/formazione-sicurezza.md`:
```markdown
---
title: "Formazione Sicurezza"
description: "Corsi e programmi di formazione sulla sicurezza nei cantieri e nei luoghi di lavoro."
icon: "📋"
order: 2
---

La formazione in materia di sicurezza è un obbligo di legge e un investimento fondamentale per ogni azienda. Offriamo corsi personalizzati per lavoratori, preposti e datori di lavoro, conformi alle normative D.Lgs. 81/2008.
```

`src/content/solutions-it/sicurezza-sul-lavoro.md`:
```markdown
---
title: "Sicurezza Sul Lavoro"
description: "Consulenza e supporto per la gestione della sicurezza nei cantieri e nelle imprese."
icon: "🦺"
order: 3
---

Offriamo servizi completi di consulenza per la sicurezza sul lavoro: redazione del DVR, valutazione dei rischi, piani di sicurezza e coordinamento della sicurezza in fase di progettazione ed esecuzione.
```

`src/content/solutions-it/direzione-lavori.md`:
```markdown
---
title: "Direzione Lavori e Coordinamento"
description: "Supervisione tecnica e coordinamento nella fase esecutiva dei progetti edilizi."
icon: "🏗"
order: 4
---

Il direttore dei lavori è la figura tecnica responsabile della corretta esecuzione del progetto. Garantiamo il rispetto dei capitolati, dei tempi e dei costi, assicurando la qualità dell'opera realizzata.
```

`src/content/solutions-it/superbonus-110.md`:
```markdown
---
title: "Progettazione Interventi Superbonus 110%"
description: "Assistenza tecnica completa per accedere agli incentivi fiscali del Superbonus 110%."
icon: "⚡"
order: 5
---

Il Superbonus 110% rappresenta una straordinaria opportunità per riqualificare il patrimonio edilizio. Offriamo supporto tecnico completo: diagnosi energetica, progettazione degli interventi, asseverazioni e pratiche burocratiche.
```

`src/content/solutions-it/sostenibilita-energetica.md`:
```markdown
---
title: "Sostenibilità ed Efficienza Energetica"
description: "Soluzioni per migliorare l'efficienza energetica degli edifici e ridurre l'impatto ambientale."
icon: "🌱"
order: 6
---

La transizione energetica è una priorità per il settore delle costruzioni. Progettiamo interventi di isolamento termico, sistemi di riscaldamento efficienti e impianti da fonti rinnovabili per ridurre i consumi e le emissioni.
```

`src/content/solutions-it/acustica-edilizia.md`:
```markdown
---
title: "Acustica Edilizia ed Ambientale"
description: "Valutazioni e soluzioni per il comfort acustico degli edifici e la mitigazione dell'inquinamento sonoro."
icon: "🔊"
order: 7
---

L'acustica è un elemento fondamentale per la qualità della vita negli edifici. Effettuiamo valutazioni del clima acustico, progettazione di soluzioni fonoisolanti e redazione delle documentazioni di impatto acustico.
```

`src/content/solutions-it/estimo-immobiliare.md`:
```markdown
---
title: "Estimo Immobiliare"
description: "Perizie e valutazioni tecniche del valore di immobili per compravendite, successioni e contenziosi."
icon: "🏠"
order: 8
---

La corretta valutazione di un immobile richiede competenze tecniche, conoscenza del mercato e metodologie rigorose. Realizziamo perizie giurate e stime di valore per privati, imprese e istituti di credito.
```

`src/content/solutions-it/edilizia.md`:
```markdown
---
title: "Edilizia"
description: "Consulenza tecnica per pratiche edilizie, ristrutturazioni e nuove costruzioni."
icon: "🧱"
order: 9
---

Offriamo supporto tecnico completo per tutte le pratiche edilizie: permessi di costruire, SCIA, CILA, collaudi e certificazioni di agibilità. Gestiamo le pratiche presso gli enti competenti garantendo conformità alle normative vigenti.
```

- [ ] **Step 3: Create the 9 English service files**

`src/content/solutions-en/architectural-design.md`:
```markdown
---
title: "Architectural Design"
description: "Design of residential, commercial and industrial buildings with attention to functionality and aesthetics."
icon: "🏛"
order: 1
---

Architectural design requires a deep understanding of client needs, current regulations, and the most advanced construction techniques. Our firm offers complete design solutions, from concept to completion, for residential, commercial, and industrial buildings.
```

`src/content/solutions-en/safety-training.md`:
```markdown
---
title: "Safety Training"
description: "Training courses and programs on safety in construction sites and workplaces."
icon: "📋"
order: 2
---

Safety training is a legal requirement and a fundamental investment for every company. We offer customized courses for workers, supervisors, and employers, compliant with Legislative Decree 81/2008.
```

`src/content/solutions-en/workplace-safety.md`:
```markdown
---
title: "Workplace Safety"
description: "Consulting and support for safety management on construction sites and in companies."
icon: "🦺"
order: 3
---

We offer comprehensive safety consulting services: drafting of the DVR risk assessment document, risk evaluation, safety plans, and safety coordination in both design and execution phases.
```

`src/content/solutions-en/construction-management.md`:
```markdown
---
title: "Construction Management & Coordination"
description: "Technical supervision and coordination during the construction phase of building projects."
icon: "🏗"
order: 4
---

The construction manager is the technical figure responsible for the correct execution of the project. We ensure compliance with specifications, timelines, and costs, guaranteeing the quality of the completed work.
```

`src/content/solutions-en/superbonus-110.md`:
```markdown
---
title: "Superbonus 110% Projects"
description: "Complete technical assistance to access the Superbonus 110% tax incentives."
icon: "⚡"
order: 5
---

The Superbonus 110% represents an extraordinary opportunity to retrofit the building stock. We offer full technical support: energy diagnosis, intervention design, certifications, and administrative procedures.
```

`src/content/solutions-en/sustainability-energy.md`:
```markdown
---
title: "Sustainability & Energy Efficiency"
description: "Solutions to improve the energy efficiency of buildings and reduce environmental impact."
icon: "🌱"
order: 6
---

The energy transition is a priority for the construction sector. We design thermal insulation interventions, efficient heating systems, and renewable energy installations to reduce consumption and emissions.
```

`src/content/solutions-en/acoustic-engineering.md`:
```markdown
---
title: "Building & Environmental Acoustics"
description: "Assessments and solutions for acoustic comfort in buildings and mitigation of noise pollution."
icon: "🔊"
order: 7
---

Acoustics is a fundamental element for quality of life in buildings. We carry out acoustic climate assessments, design soundproofing solutions, and prepare acoustic impact documentation.
```

`src/content/solutions-en/real-estate-appraisal.md`:
```markdown
---
title: "Real Estate Appraisal"
description: "Technical assessments and valuations of property value for sales, succession, and disputes."
icon: "🏠"
order: 8
---

The correct valuation of a property requires technical expertise, market knowledge, and rigorous methodologies. We produce sworn appraisals and value estimates for private individuals, companies, and credit institutions.
```

`src/content/solutions-en/construction.md`:
```markdown
---
title: "Construction Consulting"
description: "Technical consulting for building permits, renovations, and new constructions."
icon: "🧱"
order: 9
---

We offer comprehensive technical support for all building permits and procedures: construction permits, SCIA, CILA, inspections, and habitability certificates. We handle all administrative procedures with the competent authorities.
```

- [ ] **Step 4: Create sample news files**

`src/content/news-it/benvenuto.md`:
```markdown
---
title: "Benvenuti nel nuovo sito"
date: 2026-01-15
description: "Il nostro studio si rinnova con un nuovo sito web moderno e accessibile."
---

Siamo lieti di presentare il nuovo sito dello studio Ing. Fattoruso Engineering Solutions. Il nuovo portale offre una navigazione più intuitiva e un accesso facilitato a tutti i nostri servizi.
```

`src/content/news-en/welcome.md`:
```markdown
---
title: "Welcome to the new website"
date: 2026-01-15
description: "Our firm is renewing itself with a new modern and accessible website."
---

We are pleased to present the new website of Ing. Fattoruso Engineering Solutions. The new portal offers more intuitive navigation and easier access to all our services.
```

- [ ] **Step 5: Run build to verify content collections compile**

```bash
npm run build
```

Expected: build passes, no content schema errors.

- [ ] **Step 6: Commit**

```bash
git add src/content/
git commit -m "feat: add content collections for services and news (IT + EN)"
```

---

## Task 7: Homepage

**Files:**
- Create: `src/components/Hero.astro`
- Create: `src/components/ServiceCard.astro`
- Modify: `src/pages/it/index.astro`
- Create: `src/pages/en/index.astro`

- [ ] **Step 1: Create src/components/Hero.astro**

```astro
---
interface Props {
  title: string;
  subtitle: string;
  ctaPrimary: { label: string; href: string };
  ctaSecondary: { label: string; href: string };
}

const { title, subtitle, ctaPrimary, ctaSecondary } = Astro.props;
---

<section
  class="relative min-h-[90vh] flex items-center overflow-hidden"
  style="background: var(--color-bg);"
>
  <!-- Blueprint grid texture -->
  <div
    class="absolute inset-0 opacity-5 pointer-events-none"
    style="background-image: linear-gradient(var(--color-primary) 1px, transparent 1px), linear-gradient(90deg, var(--color-primary) 1px, transparent 1px); background-size: 40px 40px;"
  ></div>

  <div class="relative max-w-6xl mx-auto px-6 md:px-12 py-24">
    <p class="text-xs uppercase tracking-widest mb-6" style="color: var(--color-primary);">
      Engineering Solutions
    </p>
    <h1
      class="text-5xl md:text-7xl font-heading font-black uppercase leading-none mb-8"
      style="color: var(--color-text);"
    >
      {title}
    </h1>
    <p class="text-lg max-w-xl mb-12" style="color: var(--color-accent);">
      {subtitle}
    </p>
    <div class="flex flex-wrap gap-4">
      <a href={ctaPrimary.href} class="btn-primary">{ctaPrimary.label}</a>
      <a href={ctaSecondary.href} class="btn-outline">{ctaSecondary.label}</a>
    </div>
  </div>

  <!-- Decorative vertical line -->
  <div
    class="absolute right-12 top-0 bottom-0 w-px hidden md:block opacity-20"
    style="background: var(--color-primary);"
  ></div>
</section>
```

- [ ] **Step 2: Create src/components/ServiceCard.astro**

```astro
---
interface Props {
  title: string;
  description: string;
  icon: string;
  href: string;
}

const { title, description, icon, href } = Astro.props;
---

<a
  href={href}
  class="card block p-6 transition-all group hover:-translate-y-1"
  style="border-color: var(--color-border);"
>
  <div class="text-3xl mb-4">{icon}</div>
  <h3
    class="font-heading font-bold text-sm uppercase tracking-wider mb-3"
    style="color: var(--color-text);"
  >
    {title}
  </h3>
  <p class="text-sm leading-relaxed mb-4" style="color: var(--color-accent);">
    {description}
  </p>
  <span
    class="text-xs uppercase tracking-widest font-semibold transition-colors"
    style="color: var(--color-primary);"
  >
    Scopri →
  </span>
</a>
```

- [ ] **Step 3: Update src/pages/it/index.astro**

```astro
---
import Base from '../../layouts/Base.astro';
import Hero from '../../components/Hero.astro';
import ServiceCard from '../../components/ServiceCard.astro';
import { t } from '../../i18n/utils';
import { getCollection } from 'astro:content';

const lang = 'it';
const solutions = (await getCollection('solutions-it')).sort((a, b) => a.data.order - b.data.order);
---

<Base lang={lang} title={t(lang, 'nav.home')}>
  <Hero
    title={t(lang, 'hero.title')}
    subtitle={t(lang, 'hero.subtitle')}
    ctaPrimary={{ label: t(lang, 'hero.cta.primary'), href: '/it/soluzioni/progettazione-architettonica' }}
    ctaSecondary={{ label: t(lang, 'hero.cta.secondary'), href: '/it/contatti' }}
  />

  <!-- Services grid -->
  <section class="max-w-6xl mx-auto px-6 md:px-12 py-24">
    <p class="section-subtitle">{t(lang, 'home.services.subtitle')}</p>
    <h2 class="section-title" style="color: var(--color-text);">{t(lang, 'home.services.title')}</h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-12">
      {solutions.map(sol => (
        <ServiceCard
          title={sol.data.title}
          description={sol.data.description}
          icon={sol.data.icon}
          href={`/it/soluzioni/${sol.slug}`}
        />
      ))}
    </div>
  </section>

  <!-- CTA banner -->
  <section
    class="py-24"
    style="background: var(--color-surface); border-top: 1px solid var(--color-border); border-bottom: 1px solid var(--color-border);"
  >
    <div class="max-w-6xl mx-auto px-6 md:px-12 text-center">
      <h2 class="section-title mb-4" style="color: var(--color-text);">{t(lang, 'home.cta.title')}</h2>
      <p class="mb-8" style="color: var(--color-accent);">{t(lang, 'home.cta.text')}</p>
      <a href="/it/preventivo" class="btn-primary">{t(lang, 'home.cta.button')}</a>
    </div>
  </section>
</Base>
```

- [ ] **Step 4: Create src/pages/en/index.astro**

```astro
---
import Base from '../../layouts/Base.astro';
import Hero from '../../components/Hero.astro';
import ServiceCard from '../../components/ServiceCard.astro';
import { t } from '../../i18n/utils';
import { getCollection } from 'astro:content';

const lang = 'en';
const solutions = (await getCollection('solutions-en')).sort((a, b) => a.data.order - b.data.order);
---

<Base lang={lang} title={t(lang, 'nav.home')}>
  <Hero
    title={t(lang, 'hero.title')}
    subtitle={t(lang, 'hero.subtitle')}
    ctaPrimary={{ label: t(lang, 'hero.cta.primary'), href: '/en/solutions/architectural-design' }}
    ctaSecondary={{ label: t(lang, 'hero.cta.secondary'), href: '/en/contact' }}
  />

  <section class="max-w-6xl mx-auto px-6 md:px-12 py-24">
    <p class="section-subtitle">{t(lang, 'home.services.subtitle')}</p>
    <h2 class="section-title" style="color: var(--color-text);">{t(lang, 'home.services.title')}</h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-12">
      {solutions.map(sol => (
        <ServiceCard
          title={sol.data.title}
          description={sol.data.description}
          icon={sol.data.icon}
          href={`/en/solutions/${sol.slug}`}
        />
      ))}
    </div>
  </section>

  <section
    class="py-24"
    style="background: var(--color-surface); border-top: 1px solid var(--color-border); border-bottom: 1px solid var(--color-border);"
  >
    <div class="max-w-6xl mx-auto px-6 md:px-12 text-center">
      <h2 class="section-title mb-4" style="color: var(--color-text);">{t(lang, 'home.cta.title')}</h2>
      <p class="mb-8" style="color: var(--color-accent);">{t(lang, 'home.cta.text')}</p>
      <a href="/en/quote" class="btn-primary">{t(lang, 'home.cta.button')}</a>
    </div>
  </section>
</Base>
```

- [ ] **Step 5: Run build**

```bash
npm run build
```

Expected: build passes, `dist/it/index.html` and `dist/en/index.html` exist.

- [ ] **Step 6: Commit**

```bash
git add src/components/Hero.astro src/components/ServiceCard.astro src/pages/
git commit -m "feat: add homepage with hero and services grid (IT + EN)"
```

---

## Task 8: Solutions dynamic pages

**Files:**
- Create: `src/pages/it/soluzioni/[slug].astro`
- Create: `src/pages/en/solutions/[slug].astro`

- [ ] **Step 1: Create src/pages/it/soluzioni/[slug].astro**

```astro
---
import Base from '../../../layouts/Base.astro';
import { t } from '../../../i18n/utils';
import { getCollection } from 'astro:content';

export async function getStaticPaths() {
  const solutions = await getCollection('solutions-it');
  return solutions.map(entry => ({
    params: { slug: entry.slug },
    props: { entry },
  }));
}

const { entry } = Astro.props;
const { Content } = await entry.render();
const lang = 'it';
---

<Base lang={lang} title={entry.data.title} description={entry.data.description}>
  <div class="max-w-4xl mx-auto px-6 md:px-12 py-24">
    <a href="/it/" class="text-xs uppercase tracking-widest mb-8 block" style="color: var(--color-primary);">
      {t(lang, 'solutions.back')}
    </a>

    <div class="text-4xl mb-6">{entry.data.icon}</div>
    <h1 class="section-title mb-4" style="color: var(--color-text);">{entry.data.title}</h1>
    <p class="text-lg mb-12" style="color: var(--color-accent);">{entry.data.description}</p>

    <div
      class="prose max-w-none"
      style="color: var(--color-text);"
    >
      <Content />
    </div>

    <div class="mt-16 pt-8" style="border-top: 1px solid var(--color-border);">
      <p class="text-sm mb-4" style="color: var(--color-accent);">Hai bisogno di questo servizio?</p>
      <a href="/it/preventivo" class="btn-primary">{t(lang, 'home.cta.button')}</a>
    </div>
  </div>
</Base>
```

- [ ] **Step 2: Create src/pages/en/solutions/[slug].astro**

```astro
---
import Base from '../../../layouts/Base.astro';
import { t } from '../../../i18n/utils';
import { getCollection } from 'astro:content';

export async function getStaticPaths() {
  const solutions = await getCollection('solutions-en');
  return solutions.map(entry => ({
    params: { slug: entry.slug },
    props: { entry },
  }));
}

const { entry } = Astro.props;
const { Content } = await entry.render();
const lang = 'en';
---

<Base lang={lang} title={entry.data.title} description={entry.data.description}>
  <div class="max-w-4xl mx-auto px-6 md:px-12 py-24">
    <a href="/en/" class="text-xs uppercase tracking-widest mb-8 block" style="color: var(--color-primary);">
      {t(lang, 'solutions.back')}
    </a>

    <div class="text-4xl mb-6">{entry.data.icon}</div>
    <h1 class="section-title mb-4" style="color: var(--color-text);">{entry.data.title}</h1>
    <p class="text-lg mb-12" style="color: var(--color-accent);">{entry.data.description}</p>

    <div class="prose max-w-none" style="color: var(--color-text);">
      <Content />
    </div>

    <div class="mt-16 pt-8" style="border-top: 1px solid var(--color-border);">
      <p class="text-sm mb-4" style="color: var(--color-accent);">Need this service?</p>
      <a href="/en/quote" class="btn-primary">{t(lang, 'home.cta.button')}</a>
    </div>
  </div>
</Base>
```

- [ ] **Step 3: Run build**

```bash
npm run build
```

Expected: 9 IT solution pages + 9 EN solution pages generated in `dist/`.

- [ ] **Step 4: Commit**

```bash
git add src/pages/it/soluzioni/ src/pages/en/solutions/
git commit -m "feat: add dynamic solutions pages (IT + EN)"
```

---

## Task 9: Contact and Quote pages

**Files:**
- Create: `src/pages/it/contatti.astro`
- Create: `src/pages/en/contact.astro`
- Create: `src/pages/it/preventivo.astro`
- Create: `src/pages/en/quote.astro`

> **Note:** Replace `YOUR_FORMSPREE_ID` with the actual Formspree form ID from https://formspree.io after creating a free account with the email fattoruso.engineeringsolutions@gmail.com.

- [ ] **Step 1: Create src/pages/it/contatti.astro**

```astro
---
import Base from '../../layouts/Base.astro';
import { t } from '../../i18n/utils';

const lang = 'it';
const FORMSPREE_ID = 'YOUR_FORMSPREE_ID';

const services = [
  'Progettazione Architettonica',
  'Formazione Sicurezza',
  'Sicurezza Sul Lavoro',
  'Direzione Lavori e Coordinamento',
  'Superbonus 110%',
  'Sostenibilità ed Efficienza Energetica',
  'Acustica Edilizia ed Ambientale',
  'Estimo Immobiliare',
  'Edilizia',
];
---

<Base lang={lang} title={t(lang, 'contact.title')}>
  <div class="max-w-6xl mx-auto px-6 md:px-12 py-24 grid grid-cols-1 md:grid-cols-2 gap-16">
    <!-- Contact info -->
    <div>
      <p class="section-subtitle">{t(lang, 'contact.subtitle')}</p>
      <h1 class="section-title mb-12" style="color: var(--color-text);">{t(lang, 'contact.title')}</h1>

      <ul class="space-y-6">
        <li>
          <p class="text-xs uppercase tracking-widest mb-1" style="color: var(--color-accent);">Indirizzo</p>
          <p style="color: var(--color-text);">{t(lang, 'contact.address')}</p>
        </li>
        <li>
          <p class="text-xs uppercase tracking-widest mb-1" style="color: var(--color-accent);">Telefono</p>
          <a href={`tel:${t(lang, 'contact.phone.value')}`} style="color: var(--color-primary);">
            {t(lang, 'contact.phone.value')}
          </a>
        </li>
        <li>
          <p class="text-xs uppercase tracking-widest mb-1" style="color: var(--color-accent);">Email</p>
          <a href={`mailto:${t(lang, 'contact.email.value')}`} style="color: var(--color-primary);">
            {t(lang, 'contact.email.value')}
          </a>
        </li>
        <li>
          <p class="text-xs uppercase tracking-widest mb-1" style="color: var(--color-accent);">Partita IVA</p>
          <p style="color: var(--color-text);">{t(lang, 'contact.vat')}</p>
        </li>
      </ul>
    </div>

    <!-- Form -->
    <div>
      <form
        id="contact-form"
        action={`https://formspree.io/f/${FORMSPREE_ID}`}
        method="POST"
        class="space-y-6"
      >
        <div>
          <label class="block text-xs uppercase tracking-widest mb-2" style="color: var(--color-accent);">
            {t(lang, 'contact.name')} *
          </label>
          <input
            type="text"
            name="name"
            required
            class="w-full px-4 py-3 text-sm"
            style="background: var(--color-surface); border: 1px solid var(--color-border); color: var(--color-text);"
          />
        </div>
        <div>
          <label class="block text-xs uppercase tracking-widest mb-2" style="color: var(--color-accent);">
            {t(lang, 'contact.email')} *
          </label>
          <input
            type="email"
            name="email"
            required
            class="w-full px-4 py-3 text-sm"
            style="background: var(--color-surface); border: 1px solid var(--color-border); color: var(--color-text);"
          />
        </div>
        <div>
          <label class="block text-xs uppercase tracking-widest mb-2" style="color: var(--color-accent);">
            {t(lang, 'contact.phone')}
          </label>
          <input
            type="tel"
            name="phone"
            class="w-full px-4 py-3 text-sm"
            style="background: var(--color-surface); border: 1px solid var(--color-border); color: var(--color-text);"
          />
        </div>
        <div>
          <label class="block text-xs uppercase tracking-widest mb-2" style="color: var(--color-accent);">
            {t(lang, 'contact.service')}
          </label>
          <select
            name="service"
            class="w-full px-4 py-3 text-sm"
            style="background: var(--color-surface); border: 1px solid var(--color-border); color: var(--color-text);"
          >
            <option value="">{t(lang, 'contact.service.placeholder')}</option>
            {services.map(s => <option value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label class="block text-xs uppercase tracking-widest mb-2" style="color: var(--color-accent);">
            {t(lang, 'contact.message')} *
          </label>
          <textarea
            name="message"
            required
            rows="5"
            class="w-full px-4 py-3 text-sm resize-none"
            style="background: var(--color-surface); border: 1px solid var(--color-border); color: var(--color-text);"
          ></textarea>
        </div>

        <button type="submit" class="btn-primary w-full">{t(lang, 'contact.send')}</button>

        <p id="form-success" class="hidden text-sm text-center py-3" style="color: var(--color-primary);">
          {t(lang, 'contact.success')}
        </p>
        <p id="form-error" class="hidden text-sm text-center py-3 text-red-400">
          {t(lang, 'contact.error')}
        </p>
      </form>
    </div>
  </div>
</Base>

<script>
  const form = document.getElementById('contact-form') as HTMLFormElement;
  const success = document.getElementById('form-success');
  const error = document.getElementById('form-error');

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = new FormData(form);
    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      });
      if (res.ok) {
        form.reset();
        success?.classList.remove('hidden');
        error?.classList.add('hidden');
      } else {
        error?.classList.remove('hidden');
        success?.classList.add('hidden');
      }
    } catch {
      error?.classList.remove('hidden');
      success?.classList.add('hidden');
    }
  });
</script>
```

- [ ] **Step 2: Create src/pages/en/contact.astro**

Same structure as `it/contatti.astro` but with `lang = 'en'` and English service names:

```astro
---
import Base from '../../layouts/Base.astro';
import { t } from '../../i18n/utils';

const lang = 'en';
const FORMSPREE_ID = 'YOUR_FORMSPREE_ID';

const services = [
  'Architectural Design',
  'Safety Training',
  'Workplace Safety',
  'Construction Management',
  'Superbonus 110%',
  'Sustainability & Energy Efficiency',
  'Building & Environmental Acoustics',
  'Real Estate Appraisal',
  'Construction Consulting',
];
---

<Base lang={lang} title={t(lang, 'contact.title')}>
  <div class="max-w-6xl mx-auto px-6 md:px-12 py-24 grid grid-cols-1 md:grid-cols-2 gap-16">
    <div>
      <p class="section-subtitle">{t(lang, 'contact.subtitle')}</p>
      <h1 class="section-title mb-12" style="color: var(--color-text);">{t(lang, 'contact.title')}</h1>
      <ul class="space-y-6">
        <li>
          <p class="text-xs uppercase tracking-widest mb-1" style="color: var(--color-accent);">Address</p>
          <p style="color: var(--color-text);">{t(lang, 'contact.address')}</p>
        </li>
        <li>
          <p class="text-xs uppercase tracking-widest mb-1" style="color: var(--color-accent);">Phone</p>
          <a href={`tel:${t(lang, 'contact.phone.value')}`} style="color: var(--color-primary);">
            {t(lang, 'contact.phone.value')}
          </a>
        </li>
        <li>
          <p class="text-xs uppercase tracking-widest mb-1" style="color: var(--color-accent);">Email</p>
          <a href={`mailto:${t(lang, 'contact.email.value')}`} style="color: var(--color-primary);">
            {t(lang, 'contact.email.value')}
          </a>
        </li>
        <li>
          <p class="text-xs uppercase tracking-widest mb-1" style="color: var(--color-accent);">VAT</p>
          <p style="color: var(--color-text);">{t(lang, 'contact.vat')}</p>
        </li>
      </ul>
    </div>

    <div>
      <form id="contact-form" action={`https://formspree.io/f/${FORMSPREE_ID}`} method="POST" class="space-y-6">
        <div>
          <label class="block text-xs uppercase tracking-widest mb-2" style="color: var(--color-accent);">{t(lang, 'contact.name')} *</label>
          <input type="text" name="name" required class="w-full px-4 py-3 text-sm" style="background: var(--color-surface); border: 1px solid var(--color-border); color: var(--color-text);" />
        </div>
        <div>
          <label class="block text-xs uppercase tracking-widest mb-2" style="color: var(--color-accent);">{t(lang, 'contact.email')} *</label>
          <input type="email" name="email" required class="w-full px-4 py-3 text-sm" style="background: var(--color-surface); border: 1px solid var(--color-border); color: var(--color-text);" />
        </div>
        <div>
          <label class="block text-xs uppercase tracking-widest mb-2" style="color: var(--color-accent);">{t(lang, 'contact.phone')}</label>
          <input type="tel" name="phone" class="w-full px-4 py-3 text-sm" style="background: var(--color-surface); border: 1px solid var(--color-border); color: var(--color-text);" />
        </div>
        <div>
          <label class="block text-xs uppercase tracking-widest mb-2" style="color: var(--color-accent);">{t(lang, 'contact.service')}</label>
          <select name="service" class="w-full px-4 py-3 text-sm" style="background: var(--color-surface); border: 1px solid var(--color-border); color: var(--color-text);">
            <option value="">{t(lang, 'contact.service.placeholder')}</option>
            {services.map(s => <option value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label class="block text-xs uppercase tracking-widest mb-2" style="color: var(--color-accent);">{t(lang, 'contact.message')} *</label>
          <textarea name="message" required rows="5" class="w-full px-4 py-3 text-sm resize-none" style="background: var(--color-surface); border: 1px solid var(--color-border); color: var(--color-text);"></textarea>
        </div>
        <button type="submit" class="btn-primary w-full">{t(lang, 'contact.send')}</button>
        <p id="form-success" class="hidden text-sm text-center py-3" style="color: var(--color-primary);">{t(lang, 'contact.success')}</p>
        <p id="form-error" class="hidden text-sm text-center py-3 text-red-400">{t(lang, 'contact.error')}</p>
      </form>
    </div>
  </div>
</Base>

<script>
  const form = document.getElementById('contact-form') as HTMLFormElement;
  const success = document.getElementById('form-success');
  const error = document.getElementById('form-error');
  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = new FormData(form);
    try {
      const res = await fetch(form.action, { method: 'POST', body: data, headers: { Accept: 'application/json' } });
      if (res.ok) { form.reset(); success?.classList.remove('hidden'); error?.classList.add('hidden'); }
      else { error?.classList.remove('hidden'); success?.classList.add('hidden'); }
    } catch { error?.classList.remove('hidden'); success?.classList.add('hidden'); }
  });
</script>
```

- [ ] **Step 3: Create src/pages/it/preventivo.astro**

```astro
---
import Base from '../../layouts/Base.astro';
import { t } from '../../i18n/utils';

const lang = 'it';
const FORMSPREE_ID = 'YOUR_FORMSPREE_ID';
---

<Base lang={lang} title={t(lang, 'quote.title')}>
  <div class="max-w-2xl mx-auto px-6 md:px-12 py-24">
    <p class="section-subtitle">{t(lang, 'quote.subtitle')}</p>
    <h1 class="section-title mb-12" style="color: var(--color-text);">{t(lang, 'quote.title')}</h1>

    <form id="quote-form" action={`https://formspree.io/f/${FORMSPREE_ID}`} method="POST" class="space-y-6">
      <div>
        <label class="block text-xs uppercase tracking-widest mb-2" style="color: var(--color-accent);">{t(lang, 'contact.name')} *</label>
        <input type="text" name="name" required class="w-full px-4 py-3 text-sm" style="background: var(--color-surface); border: 1px solid var(--color-border); color: var(--color-text);" />
      </div>
      <div>
        <label class="block text-xs uppercase tracking-widest mb-2" style="color: var(--color-accent);">{t(lang, 'contact.email')} *</label>
        <input type="email" name="email" required class="w-full px-4 py-3 text-sm" style="background: var(--color-surface); border: 1px solid var(--color-border); color: var(--color-text);" />
      </div>
      <div>
        <label class="block text-xs uppercase tracking-widest mb-2" style="color: var(--color-accent);">{t(lang, 'contact.phone')}</label>
        <input type="tel" name="phone" class="w-full px-4 py-3 text-sm" style="background: var(--color-surface); border: 1px solid var(--color-border); color: var(--color-text);" />
      </div>
      <div>
        <label class="block text-xs uppercase tracking-widest mb-2" style="color: var(--color-accent);">{t(lang, 'quote.project.type')} *</label>
        <input type="text" name="project_type" required class="w-full px-4 py-3 text-sm" style="background: var(--color-surface); border: 1px solid var(--color-border); color: var(--color-text);" />
      </div>
      <div>
        <label class="block text-xs uppercase tracking-widest mb-2" style="color: var(--color-accent);">{t(lang, 'quote.budget')}</label>
        <input type="text" name="budget" class="w-full px-4 py-3 text-sm" style="background: var(--color-surface); border: 1px solid var(--color-border); color: var(--color-text);" />
      </div>
      <div>
        <label class="block text-xs uppercase tracking-widest mb-2" style="color: var(--color-accent);">{t(lang, 'quote.timeline')}</label>
        <input type="text" name="timeline" class="w-full px-4 py-3 text-sm" style="background: var(--color-surface); border: 1px solid var(--color-border); color: var(--color-text);" />
      </div>
      <div>
        <label class="block text-xs uppercase tracking-widest mb-2" style="color: var(--color-accent);">{t(lang, 'contact.message')}</label>
        <textarea name="message" rows="4" class="w-full px-4 py-3 text-sm resize-none" style="background: var(--color-surface); border: 1px solid var(--color-border); color: var(--color-text);"></textarea>
      </div>
      <button type="submit" class="btn-primary w-full">{t(lang, 'quote.send')}</button>
      <p id="form-success" class="hidden text-sm text-center py-3" style="color: var(--color-primary);">{t(lang, 'contact.success')}</p>
      <p id="form-error" class="hidden text-sm text-center py-3 text-red-400">{t(lang, 'contact.error')}</p>
    </form>
  </div>
</Base>

<script>
  const form = document.getElementById('quote-form') as HTMLFormElement;
  const success = document.getElementById('form-success');
  const error = document.getElementById('form-error');
  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
      if (res.ok) { form.reset(); success?.classList.remove('hidden'); error?.classList.add('hidden'); }
      else { error?.classList.remove('hidden'); success?.classList.add('hidden'); }
    } catch { error?.classList.remove('hidden'); success?.classList.add('hidden'); }
  });
</script>
```

- [ ] **Step 4: Create src/pages/en/quote.astro**

Identical to `it/preventivo.astro` but with `lang = 'en'` and English labels. Copy the structure:

```astro
---
import Base from '../../layouts/Base.astro';
import { t } from '../../i18n/utils';

const lang = 'en';
const FORMSPREE_ID = 'YOUR_FORMSPREE_ID';
---
<!-- same form structure as preventivo.astro with lang = 'en' -->
```

(Full code is identical to `preventivo.astro` with `lang = 'en'` substituted.)

- [ ] **Step 5: Run build**

```bash
npm run build
```

Expected: 4 form pages in `dist/`.

- [ ] **Step 6: Commit**

```bash
git add src/pages/it/contatti.astro src/pages/en/contact.astro src/pages/it/preventivo.astro src/pages/en/quote.astro
git commit -m "feat: add contact and quote pages with Formspree forms"
```

---

## Task 10: Remaining pages (About, Projects, News, FAQ, Pricing, Careers)

**Files:**
- Create: `src/pages/it/chi-siamo.astro` + `src/pages/en/about.astro`
- Create: `src/pages/it/progetti.astro` + `src/pages/en/projects.astro`
- Create: `src/pages/it/news/index.astro` + `src/pages/en/news/index.astro`
- Create: `src/pages/it/news/[slug].astro` + `src/pages/en/news/[slug].astro`
- Create: `src/pages/it/faq.astro` + `src/pages/en/faq.astro`
- Create: `src/pages/it/prezzi.astro` + `src/pages/en/pricing.astro`
- Create: `src/pages/it/carriere.astro` + `src/pages/en/careers.astro`

- [ ] **Step 1: Create About pages**

`src/pages/it/chi-siamo.astro`:
```astro
---
import Base from '../../layouts/Base.astro';
import { t } from '../../i18n/utils';
const lang = 'it';
---
<Base lang={lang} title={t(lang, 'about.title')}>
  <div class="max-w-4xl mx-auto px-6 md:px-12 py-24">
    <p class="section-subtitle">{t(lang, 'about.subtitle')}</p>
    <h1 class="section-title mb-12" style="color: var(--color-text);">{t(lang, 'about.title')}</h1>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
      <div>
        <h2 class="text-xl font-heading font-bold mb-4" style="color: var(--color-text);">Il nostro studio</h2>
        <p class="text-sm leading-relaxed" style="color: var(--color-accent);">
          Ing. Onofrio Fattoruso Engineering Solutions è uno studio di consulenza tecnica e ingegneria con sede a Lettere, in provincia di Napoli. Offriamo servizi professionali nel campo della progettazione architettonica, sicurezza sul lavoro, efficienza energetica e molto altro.
        </p>
      </div>
      <div>
        <h2 class="text-xl font-heading font-bold mb-4" style="color: var(--color-text);">La nostra missione</h2>
        <p class="text-sm leading-relaxed" style="color: var(--color-accent);">
          Il nostro obiettivo è fornire soluzioni tecniche di alta qualità, nel rispetto delle normative vigenti e con attenzione alle esigenze specifiche di ogni cliente. Crediamo nella trasparenza, nella precisione e nell'innovazione.
        </p>
      </div>
    </div>

    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[
        { value: '9+', label: 'Servizi offerti' },
        { value: '100%', label: 'Conformità normativa' },
        { value: '10+', label: 'Anni di esperienza' },
        { value: 'NA', label: 'Lettere, Napoli' },
      ].map(stat => (
        <div class="card p-6 text-center">
          <p class="text-3xl font-heading font-black mb-2" style="color: var(--color-primary);">{stat.value}</p>
          <p class="text-xs uppercase tracking-widest" style="color: var(--color-accent);">{stat.label}</p>
        </div>
      ))}
    </div>
  </div>
</Base>
```

`src/pages/en/about.astro`:
```astro
---
import Base from '../../layouts/Base.astro';
import { t } from '../../i18n/utils';
const lang = 'en';
---
<Base lang={lang} title={t(lang, 'about.title')}>
  <div class="max-w-4xl mx-auto px-6 md:px-12 py-24">
    <p class="section-subtitle">{t(lang, 'about.subtitle')}</p>
    <h1 class="section-title mb-12" style="color: var(--color-text);">{t(lang, 'about.title')}</h1>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
      <div>
        <h2 class="text-xl font-heading font-bold mb-4" style="color: var(--color-text);">Our firm</h2>
        <p class="text-sm leading-relaxed" style="color: var(--color-accent);">
          Ing. Onofrio Fattoruso Engineering Solutions is a technical consulting and engineering firm based in Lettere, in the province of Naples. We offer professional services in architectural design, workplace safety, energy efficiency, and more.
        </p>
      </div>
      <div>
        <h2 class="text-xl font-heading font-bold mb-4" style="color: var(--color-text);">Our mission</h2>
        <p class="text-sm leading-relaxed" style="color: var(--color-accent);">
          Our goal is to provide high-quality technical solutions, in compliance with current regulations and with attention to the specific needs of each client. We believe in transparency, precision, and innovation.
        </p>
      </div>
    </div>

    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[
        { value: '9+', label: 'Services offered' },
        { value: '100%', label: 'Regulatory compliance' },
        { value: '10+', label: 'Years of experience' },
        { value: 'NA', label: 'Lettere, Naples' },
      ].map(stat => (
        <div class="card p-6 text-center">
          <p class="text-3xl font-heading font-black mb-2" style="color: var(--color-primary);">{stat.value}</p>
          <p class="text-xs uppercase tracking-widest" style="color: var(--color-accent);">{stat.label}</p>
        </div>
      ))}
    </div>
  </div>
</Base>
```

- [ ] **Step 2: Create Projects pages**

`src/pages/it/progetti.astro`:
```astro
---
import Base from '../../layouts/Base.astro';
import { t } from '../../i18n/utils';
const lang = 'it';

const projects = [
  {
    title: 'Riqualificazione energetica edificio residenziale',
    location: 'Lettere, NA',
    year: '2023',
    category: 'Superbonus 110%',
    image: '/image/project1.jpg',
  },
  {
    title: 'Progettazione villa bifamiliare',
    location: 'Gragnano, NA',
    year: '2022',
    category: 'Progettazione Architettonica',
    image: '/image/project2.jpg',
  },
];
---
<Base lang={lang} title={t(lang, 'projects.title')}>
  <div class="max-w-6xl mx-auto px-6 md:px-12 py-24">
    <p class="section-subtitle">{t(lang, 'projects.subtitle')}</p>
    <h1 class="section-title mb-12" style="color: var(--color-text);">{t(lang, 'projects.title')}</h1>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      {projects.map(p => (
        <div class="card overflow-hidden">
          <div class="h-48 bg-[var(--color-surface)] flex items-center justify-center" style="border-bottom: 1px solid var(--color-border);">
            <span class="text-xs uppercase tracking-widest" style="color: var(--color-accent);">{p.category}</span>
          </div>
          <div class="p-6">
            <p class="text-xs uppercase tracking-widest mb-2" style="color: var(--color-primary);">{p.year} — {p.location}</p>
            <h3 class="font-heading font-bold" style="color: var(--color-text);">{p.title}</h3>
          </div>
        </div>
      ))}
    </div>
  </div>
</Base>
```

`src/pages/en/projects.astro`: same structure with `lang = 'en'` and English project titles.

- [ ] **Step 3: Create News listing and detail pages**

`src/pages/it/news/index.astro`:
```astro
---
import Base from '../../../layouts/Base.astro';
import { t } from '../../../i18n/utils';
import { getCollection } from 'astro:content';

const lang = 'it';
const posts = (await getCollection('news-it')).sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
---
<Base lang={lang} title={t(lang, 'news.title')}>
  <div class="max-w-4xl mx-auto px-6 md:px-12 py-24">
    <p class="section-subtitle">{t(lang, 'news.subtitle')}</p>
    <h1 class="section-title mb-12" style="color: var(--color-text);">{t(lang, 'news.title')}</h1>

    <div class="space-y-6">
      {posts.map(post => (
        <a href={`/it/news/${post.slug}`} class="card block p-6 transition-all hover:-translate-y-1">
          <p class="text-xs uppercase tracking-widest mb-2" style="color: var(--color-primary);">
            {post.data.date.toLocaleDateString('it-IT', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
          <h2 class="font-heading font-bold text-lg mb-2" style="color: var(--color-text);">{post.data.title}</h2>
          <p class="text-sm" style="color: var(--color-accent);">{post.data.description}</p>
          <span class="inline-block mt-4 text-xs uppercase tracking-widest" style="color: var(--color-primary);">
            {t(lang, 'news.read.more')}
          </span>
        </a>
      ))}
    </div>
  </div>
</Base>
```

`src/pages/it/news/[slug].astro`:
```astro
---
import Base from '../../../layouts/Base.astro';
import { getCollection } from 'astro:content';

export async function getStaticPaths() {
  const posts = await getCollection('news-it');
  return posts.map(entry => ({ params: { slug: entry.slug }, props: { entry } }));
}

const { entry } = Astro.props;
const { Content } = await entry.render();
const lang = 'it';
---
<Base lang={lang} title={entry.data.title}>
  <div class="max-w-3xl mx-auto px-6 md:px-12 py-24">
    <a href="/it/news" class="text-xs uppercase tracking-widest mb-8 block" style="color: var(--color-primary);">← News</a>
    <p class="text-xs uppercase tracking-widest mb-4" style="color: var(--color-accent);">
      {entry.data.date.toLocaleDateString('it-IT', { year: 'numeric', month: 'long', day: 'numeric' })}
    </p>
    <h1 class="section-title mb-8" style="color: var(--color-text);">{entry.data.title}</h1>
    <div class="prose max-w-none" style="color: var(--color-text);">
      <Content />
    </div>
  </div>
</Base>
```

`src/pages/en/news/index.astro` and `src/pages/en/news/[slug].astro`: same structure with `lang = 'en'`, `getCollection('news-en')`, and English date locale `'en-GB'`.

- [ ] **Step 4: Create FAQ, Pricing, and Careers pages**

`src/pages/it/faq.astro`:
```astro
---
import Base from '../../layouts/Base.astro';
import { t } from '../../i18n/utils';
const lang = 'it';

const faqs = [
  { q: 'Cosa comprende la consulenza per il Superbonus 110%?', a: 'Offriamo diagnosi energetica, progettazione degli interventi trainanti e trainati, asseverazioni tecniche e assistenza per le pratiche ENEA e fiscali.' },
  { q: 'In quali zone operate?', a: 'Operiamo principalmente in provincia di Napoli e nelle regioni limitrofe, ma siamo disponibili per incarichi su tutto il territorio nazionale.' },
  { q: 'Come posso richiedere un preventivo?', a: 'Puoi contattarci tramite il modulo di contatto, via email o telefonicamente. Risponderemo entro 48 ore lavorative.' },
  { q: 'Fornite documentazione tecnica per pratiche comunali?', a: 'Sì, gestiamo tutte le pratiche edilizie incluse SCIA, CILA, permessi di costruire e certificazioni di agibilità.' },
];
---
<Base lang={lang} title={t(lang, 'faq.title')}>
  <div class="max-w-3xl mx-auto px-6 md:px-12 py-24">
    <p class="section-subtitle">{t(lang, 'faq.subtitle')}</p>
    <h1 class="section-title mb-12" style="color: var(--color-text);">{t(lang, 'faq.title')}</h1>

    <div class="space-y-4">
      {faqs.map((faq, i) => (
        <details class="card p-6 group" style="border-color: var(--color-border);">
          <summary class="font-heading font-bold text-sm cursor-pointer list-none flex justify-between items-center" style="color: var(--color-text);">
            {faq.q}
            <span class="ml-4 text-lg" style="color: var(--color-primary);">+</span>
          </summary>
          <p class="mt-4 text-sm leading-relaxed" style="color: var(--color-accent);">{faq.a}</p>
        </details>
      ))}
    </div>
  </div>
</Base>
```

`src/pages/en/faq.astro`: same with `lang = 'en'` and English FAQ content.

`src/pages/it/prezzi.astro`:
```astro
---
import Base from '../../layouts/Base.astro';
import { t } from '../../i18n/utils';
const lang = 'it';
---
<Base lang={lang} title={t(lang, 'pricing.title')}>
  <div class="max-w-4xl mx-auto px-6 md:px-12 py-24">
    <p class="section-subtitle">{t(lang, 'pricing.subtitle')}</p>
    <h1 class="section-title mb-12" style="color: var(--color-text);">{t(lang, 'pricing.title')}</h1>
    <div class="card p-8 text-center mb-12">
      <p class="text-sm leading-relaxed mb-6" style="color: var(--color-accent);">
        I nostri prezzi sono definiti in base alla complessità e alla specificità di ogni progetto. Offriamo sempre un preventivo gratuito e trasparente prima di iniziare qualsiasi incarico.
      </p>
      <a href="/it/preventivo" class="btn-primary">{t(lang, 'home.cta.button')}</a>
    </div>
  </div>
</Base>
```

`src/pages/en/pricing.astro`: same with `lang = 'en'`.

`src/pages/it/carriere.astro`:
```astro
---
import Base from '../../layouts/Base.astro';
import { t } from '../../i18n/utils';
const lang = 'it';
---
<Base lang={lang} title={t(lang, 'careers.title')}>
  <div class="max-w-4xl mx-auto px-6 md:px-12 py-24">
    <p class="section-subtitle">{t(lang, 'careers.subtitle')}</p>
    <h1 class="section-title mb-12" style="color: var(--color-text);">{t(lang, 'careers.title')}</h1>
    <div class="card p-8">
      <p class="text-sm leading-relaxed mb-6" style="color: var(--color-accent);">
        Al momento non abbiamo posizioni aperte, ma siamo sempre interessati a conoscere professionisti motivati nel campo dell'ingegneria e dell'edilizia. Invia la tua candidatura spontanea.
      </p>
      <a href={`mailto:${t(lang, 'contact.email.value')}?subject=Candidatura spontanea`} class="btn-outline">
        Invia candidatura spontanea
      </a>
    </div>
  </div>
</Base>
```

`src/pages/en/careers.astro`: same with `lang = 'en'`.

- [ ] **Step 5: Run build**

```bash
npm run build
```

Expected: all pages in `dist/`, no errors.

- [ ] **Step 6: Commit**

```bash
git add src/pages/
git commit -m "feat: add all remaining pages (about, projects, news, faq, pricing, careers)"
```

---

## Task 11: Makefile and GitHub Actions

**Files:**
- Create: `Makefile`
- Create: `.github/workflows/deploy.yml`

- [ ] **Step 1: Create Makefile**

```makefile
.PHONY: install dev build preview clean deploy help

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-12s\033[0m %s\n", $$1, $$2}'

install: ## Install dependencies
	npm install

dev: ## Start local dev server at http://localhost:4321
	npm run dev

build: ## Build for production
	npm run build

preview: ## Preview production build locally
	npm run preview

test: ## Run unit tests
	npm test

check: ## Run TypeScript type checking
	npm run check

clean: ## Remove build output
	rm -rf dist/

deploy: ## Push to GitHub (triggers Actions build + deploy)
	git push origin master
```

- [ ] **Step 2: Verify Makefile works**

```bash
make help
make build
```

Expected: help table printed, build passes.

- [ ] **Step 3: Create .github/workflows/deploy.yml**

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [master]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Build
        run: npm run build

      - name: Setup Pages
        uses: actions/configure-pages@v5

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: dist/

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

> **Note:** After pushing, go to the GitHub repo Settings → Pages → Source → set to "GitHub Actions" to enable this workflow.

- [ ] **Step 4: Run full test + build locally**

```bash
make test && make build
```

Expected: all tests pass, build succeeds.

- [ ] **Step 5: Commit**

```bash
git add Makefile .github/
git commit -m "feat: add Makefile and GitHub Actions deploy workflow"
```

---

## Task 12: Root redirect and favicon

**Files:**
- Modify: `src/pages/index.astro`
- Create: `public/favicon.svg`

- [ ] **Step 1: Update src/pages/index.astro to redirect**

```astro
---
return Astro.redirect('/it/', 301);
---
```

- [ ] **Step 2: Create public/favicon.svg**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" fill="#0F172A"/>
  <text y=".9em" font-size="80" font-family="sans-serif" font-weight="900" fill="#2563EB" x="10">F</text>
</svg>
```

- [ ] **Step 3: Final build and verify all routes exist**

```bash
npm run build
ls dist/it/
ls dist/en/
```

Expected output from `ls dist/it/`:
```
index.html  chi-siamo/  soluzioni/  progetti/  contatti/  preventivo/  news/  faq/  prezzi/  carriere/
```

Expected output from `ls dist/en/`:
```
index.html  about/  solutions/  projects/  contact/  quote/  news/  faq/  pricing/  careers/
```

- [ ] **Step 4: Run local preview and manually verify**

```bash
make preview
```

Open http://localhost:4321 — should redirect to http://localhost:4321/it/

- [ ] **Step 5: Commit and push**

```bash
git add src/pages/index.astro public/favicon.svg
git commit -m "feat: add root redirect and favicon"
git push origin master
```

Expected: GitHub Actions starts build on GitHub, deploys to https://mfattoru.github.io

---

## Post-Deploy Checklist

After the GitHub Actions workflow completes:

- [ ] Visit https://mfattoru.github.io — redirects to `/it/`
- [ ] Theme switcher changes palette and persists on reload
- [ ] Language switcher toggles between `/it/` and `/en/`
- [ ] All 9 service pages load at `/it/soluzioni/[slug]` and `/en/solutions/[slug]`
- [ ] Contact form at `/it/contatti` — submit a test message (requires Formspree ID to be set)
- [ ] Mobile nav opens and closes
- [ ] Go to GitHub repo Settings → Pages → Source → GitHub Actions (if not already set)

---

## Notes

- **Formspree ID:** Sign up at https://formspree.io, create a form, copy the ID (e.g. `xpwzqkrn`), replace all `YOUR_FORMSPREE_ID` occurrences in `src/pages/it/contatti.astro`, `src/pages/en/contact.astro`, `src/pages/it/preventivo.astro`, and `src/pages/en/quote.astro`. One Formspree form can receive submissions from multiple pages.
- **Google Fonts:** The Inter font loads from Google Fonts CDN in `Base.astro`. For offline/privacy, download and self-host in `public/fonts/` instead.
- **Images:** Existing images are in `public/image/`. Reference them as `/image/filename.jpg` in Astro pages.
- **Content updates:** Edit Markdown files in `src/content/` to update service descriptions and news posts. No code changes needed.
