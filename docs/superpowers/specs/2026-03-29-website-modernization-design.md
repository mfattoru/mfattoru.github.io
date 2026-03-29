# Website Modernization Design Spec
**Date:** 2026-03-29
**Project:** mfattoru.github.io — Ing. Onofrio Fattoruso Engineering Solutions
**Status:** Approved

---

## Overview

Full modernization of a civil engineering consulting website. The existing site is a static HTML/Bootstrap 3/jQuery template with 83 copy-pasted HTML files, no build tools, and an outdated feel. The new site replaces this with a modern Astro + Tailwind CSS stack, deployed to GitHub Pages via GitHub Actions.

**Goals:**
- Bold, modern design appropriate for a civil engineering firm
- 3-palette theme switcher (persisted via `localStorage`)
- Bilingual Italian/English with URL-based language routing
- Single layout component eliminates copy-paste across all pages
- Contact forms via Formspree (no PHP backend)
- Makefile for local dev workflow
- Automatic production build via GitHub Actions on push to `master`

---

## Section 1: Architecture & File Structure

```
mfattoru.github.io/
├── src/
│   ├── layouts/
│   │   └── Base.astro              # Single shared layout (nav + footer)
│   ├── components/
│   │   ├── Nav.astro
│   │   ├── Footer.astro
│   │   ├── ThemeSwitcher.astro
│   │   └── LangSwitcher.astro
│   ├── pages/
│   │   ├── index.astro             # Redirects to /it/
│   │   ├── it/
│   │   │   ├── index.astro
│   │   │   ├── chi-siamo.astro
│   │   │   ├── soluzioni/
│   │   │   │   └── [slug].astro
│   │   │   ├── progetti.astro
│   │   │   ├── contatti.astro
│   │   │   ├── preventivo.astro
│   │   │   ├── news/
│   │   │   │   ├── index.astro
│   │   │   │   └── [slug].astro
│   │   │   ├── faq.astro
│   │   │   ├── prezzi.astro
│   │   │   └── carriere.astro
│   │   └── en/
│   │       └── (mirrors it/ with English slugs)
│   ├── content/
│   │   ├── it/
│   │   │   ├── solutions/          # 9 .md files, one per service
│   │   │   └── news/               # News/blog posts
│   │   └── en/
│   │       ├── solutions/
│   │       └── news/
│   ├── i18n/
│   │   ├── it.json                 # All UI strings in Italian
│   │   └── en.json                 # All UI strings in English
│   └── styles/
│       └── global.css              # CSS custom properties for themes + base styles
├── public/
│   └── image/                      # Existing images, copied as-is
├── .github/
│   └── workflows/
│       └── deploy.yml              # GitHub Actions build + deploy
├── Makefile
├── astro.config.mjs
└── package.json
```

**Key architectural decisions:**
- One `Base.astro` layout used by all pages — nav, footer, theme/lang switchers live here
- Content (service descriptions, news) stored as Markdown in `src/content/` for easy editing
- Dynamic routes `[slug].astro` handle all 9 service pages per language from Markdown files
- All old template variants (`*-alter.html`, `*-extend.html`, bitcoin pages) are dropped — they were unused demo files

---

## Section 2: Pages & Navigation

### Page Routes

| Italian Route | English Route | Page |
|---------------|---------------|------|
| `/` | — | Redirect to `/it/` |
| `/it/` | `/en/` | Homepage — hero, services grid, CTA, featured projects |
| `/it/chi-siamo` | `/en/about` | About |
| `/it/soluzioni/[slug]` | `/en/solutions/[slug]` | 9 individual service pages |
| `/it/progetti` | `/en/projects` | Projects showcase |
| `/it/contatti` | `/en/contact` | Contact + Formspree form |
| `/it/preventivo` | `/en/quote` | Get a quote form |
| `/it/news` | `/en/news` | News listing |
| `/it/news/[slug]` | `/en/news/[slug]` | News detail |
| `/it/faq` | `/en/faq` | FAQ |
| `/it/prezzi` | `/en/pricing` | Pricing |
| `/it/carriere` | `/en/careers` | Careers |

### Navigation

- Sticky top nav: logo left, page links center, theme switcher (3 colored dots) + language switcher (`IT | EN`) right
- Active page link highlighted
- Mobile: hamburger icon → full-screen overlay menu
- Language switcher maps current page to its equivalent in the other language

---

## Section 3: Theme System

Three palettes defined as CSS custom property sets. Applied via a class on `<html>`. Default: `theme-steel`.

| CSS Token | `theme-steel` | `theme-blueprint` | `theme-earth` |
|-----------|--------------|-------------------|---------------|
| `--color-primary` | `#2563EB` | `#0EA5E9` | `#EA580C` |
| `--color-bg` | `#0F172A` | `#0F2044` | `#1C1917` |
| `--color-surface` | `#1E293B` | `#162A5A` | `#292524` |
| `--color-text` | `#F1F5F9` | `#F0F9FF` | `#FAFAF9` |
| `--color-accent` | `#64748B` | `#FDE047` | `#D6D3D1` |

**ThemeSwitcher component:** Renders 3 colored dots in the nav. Click applies the corresponding class to `<html>` and saves to `localStorage`. On page load, `global.css` reads `localStorage` and applies the saved theme before first paint (no flash).

**Visual language (all themes):**
- Dark backgrounds throughout
- Large display typography: Inter or Poppins for headings, system-ui for body
- Hero sections with subtle grid/blueprint SVG texture overlay
- Sharp-edged cards (no border-radius) — structural, architectural aesthetic
- Bold section dividers, heavy heading weights

---

## Section 4: i18n (Bilingual)

**Approach:** URL-based routing. No `localStorage` needed — the URL is the source of truth.

**UI strings:** Stored in `src/i18n/it.json` and `src/i18n/en.json`. Each page imports the file matching its language.

```json
// Example structure
{
  "nav.home": "Home",
  "nav.about": "Chi Siamo",
  "nav.solutions": "Soluzioni",
  "nav.projects": "Progetti",
  "nav.contact": "Contatti",
  "hero.title": "Ingegneria. Precisione. Risultati.",
  "hero.cta": "Scopri i nostri servizi",
  "footer.address": "Via San Nicola del Vaglio 2, 80050, Lettere, Napoli"
}
```

**Page content:** Stored as Markdown in `src/content/it/` and `src/content/en/`. Frontmatter holds metadata (title, slug, description); body holds the full content. This means content editors never touch `.astro` files.

**Language switcher behavior:** `IT | EN` toggle in nav. Each page knows its equivalent route in the other language and links to it directly.

---

## Section 5: Contact Form & Makefile

### Contact Form — Formspree

- Free tier: 50 submissions/month with email notifications
- Both `/it/contatti` and `/en/contact` POST to the same Formspree endpoint
- Fields: Name, Email, Phone, Message, Service (dropdown — 9 options)
- `/it/preventivo` / `/en/quote` adds: Project Type, Budget Range, Timeline
- Success/error state handled with vanilla JS (no jQuery) — show inline message
- Formspree endpoint ID configured in a single constant in `src/i18n/config.ts`

### Makefile

```makefile
install:    ## Install dependencies
	npm install

dev:        ## Start local dev server at http://localhost:4321
	npm run dev

build:      ## Build for production
	npm run build

preview:    ## Preview production build locally
	npm run preview

clean:      ## Remove build output
	rm -rf dist/

deploy:     ## Push to GitHub (triggers Actions build + deploy)
	git push origin master
```

### GitHub Actions (`deploy.yml`)

Triggers on push to `master`:
1. Checkout repo
2. Setup Node.js
3. `npm install`
4. `npm run build`
5. Deploy `dist/` to GitHub Pages via `peaceiris/actions-gh-pages`

---

## Out of Scope

- Backend / server-side functionality
- CMS integration (content edited via Markdown files directly)
- E-commerce or payment processing
- The old PHP Mailer (replaced by Formspree)
- Template variant files (`*-alter.html`, bitcoin pages) — dropped entirely
