# Page Content Editor — Design Spec

**Date:** 2026-04-01
**Backlog item:** B-10
**Status:** Approved

---

## Goal

Make the hardcoded text on static pages (About, Pricing, stats strip) editable from the admin panel without requiring a code deploy.

---

## Content Inventory

### `src/content/page-content/about.md`

| Field | Type | Notes |
|---|---|---|
| `firmHeadingIt` | string | "Il nostro studio" |
| `firmHeadingEn` | string | Auto-translated |
| `firmBodyIt` | string (text) | Paragraph about the firm |
| `firmBodyEn` | string (text) | Auto-translated |
| `missionHeadingIt` | string | "La nostra missione" |
| `missionHeadingEn` | string | Auto-translated |
| `missionBodyIt` | string (text) | Paragraph about mission |
| `missionBodyEn` | string (text) | Auto-translated |

### `src/content/page-content/pricing.md`

| Field | Type | Notes |
|---|---|---|
| `introParagraphIt` | string (text) | First pricing paragraph |
| `introParagraphEn` | string (text) | Auto-translated |
| `complianceParagraphIt` | string (text) | Second pricing paragraph |
| `complianceParagraphEn` | string (text) | Auto-translated |

### `src/content/page-content/homepage.md`

Four stats, each with a fixed value and bilingual label. Flat fields (no list widget) since the count is fixed.

| Field | Type | Example |
|---|---|---|
| `stat1Value` | string | `"10+"` |
| `stat1LabelIt` | string | `"Anni di esperienza"` |
| `stat1LabelEn` | string | `"Years of experience"` |
| `stat2Value` | string | `"9+"` |
| `stat2LabelIt` | string | `"Servizi offerti"` |
| `stat2LabelEn` | string | `"Services offered"` |
| `stat3Value` | string | `"100%"` |
| `stat3LabelIt` | string | `"Conformità normativa"` |
| `stat3LabelEn` | string | `"Regulatory compliance"` |
| `stat4Value` | string | `"Lettere, Napoli"` |
| `stat4LabelIt` | string | `"Sede"` |
| `stat4LabelEn` | string | `"Location"` |

---

## CMS Changes (`config.yml.ts`)

Add a new collection before `news`:

```yaml
- name: "page-content"
  label: "📄 Contenuto Pagine"
  editor:
    preview: false
  files:
    - name: "about"
      label: "Chi siamo / About"
      file: "src/content/page-content/about.md"
      fields: [ ... ]
    - name: "pricing"
      label: "Prezzi / Pricing"
      file: "src/content/page-content/pricing.md"
      fields: [ ... ]
    - name: "homepage"
      label: "Homepage — Stats"
      file: "src/content/page-content/homepage.md"
      fields: [ ... ]
```

All EN fields: `required: false`, hint: `"— auto-tradotto al salvataggio"`.

---

## Auto-Translation (`index.astro`)

Add `PAGE_CONTENT_FIELDS` to the `preSave` handler, covering IT→EN pairs for `about`, `pricing`, and `homepage` entries. The `collection` value for files collections in Sveltia is the collection name (`page-content`); the specific file is identified via `entry.get('slug')`.

```js
const PAGE_CONTENT_FIELDS = {
  about: [
    ['firmHeadingIt',      'firmHeadingEn'],
    ['firmBodyIt',         'firmBodyEn'],
    ['missionHeadingIt',   'missionHeadingEn'],
    ['missionBodyIt',      'missionBodyEn'],
  ],
  pricing: [
    ['introParagraphIt',      'introParagraphEn'],
    ['complianceParagraphIt', 'complianceParagraphEn'],
  ],
  homepage: [
    ['stat1LabelIt', 'stat1LabelEn'],
    ['stat2LabelIt', 'stat2LabelEn'],
    ['stat3LabelIt', 'stat3LabelEn'],
    ['stat4LabelIt', 'stat4LabelEn'],
  ],
};
```

---

## Content Schema (`src/content/config.ts`)

Add a `page-content` collection with `type: 'data'` and a Zod schema covering all three files. Use `.optional().default('')` for all EN fields.

---

## Page Wiring

Each page calls `getEntry('page-content', '<slug>')` in its frontmatter and replaces hardcoded strings with `entry.data.<field>`.

| Page | Entry slug | Fields used |
|---|---|---|
| `it/chi-siamo.astro` | `about` | IT fields |
| `en/about.astro` | `about` | EN fields |
| `it/prezzi.astro` | `pricing` | IT fields |
| `en/pricing.astro` | `pricing` | EN fields |
| `it/index.astro` | `homepage` | IT stat labels + values |
| `en/index.astro` | `homepage` | EN stat labels + values |
| `it/chi-siamo.astro` | `homepage` | Stats strip (same data) |
| `en/about.astro` | `homepage` | Stats strip (same data) |

---

## Initial Content Files

Seed files are created with the current hardcoded values so the site builds correctly before the admin ever touches them. No visual change on first deploy.

---

## Out of Scope

- Hero tagline (too stable)
- Footer brand text (too stable)
- Nav labels (already in i18n system)
- CV fallback messages (browser copy, never changes)
