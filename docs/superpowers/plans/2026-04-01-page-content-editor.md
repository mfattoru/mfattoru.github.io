# Page Content Editor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make About, Pricing, and stats-strip text editable from the admin panel without a code deploy.

**Architecture:** Three markdown seed files under `src/content/page-content/` hold all editable text. A new Astro content collection (`page-content`) with a Zod schema validates the fields at build time. A new CMS `files` collection exposes the three files in the admin panel. Each static page calls `getEntry('page-content', '<slug>')` and replaces its hardcoded strings with the fetched values.

**Tech Stack:** Astro content collections, Zod, Sveltia CMS (`files` collection type), Vitest

---

## File Map

| Action | File | Purpose |
|---|---|---|
| Create | `src/content/page-content/about.md` | Seed content for about pages |
| Create | `src/content/page-content/pricing.md` | Seed content for pricing pages |
| Create | `src/content/page-content/homepage.md` | Seed content for stats strip |
| Create | `tests/page-content.test.ts` | Vitest tests for content file structure |
| Modify | `src/content/config.ts` | Add `page-content` collection schema |
| Modify | `src/pages/it/admin/config.yml.ts` | Add `📄 Contenuto Pagine` CMS collection |
| Modify | `src/pages/it/admin/index.astro` | Add `PAGE_CONTENT_FIELDS` to preSave handler |
| Modify | `src/pages/it/chi-siamo.astro` | Wire about + stats content |
| Modify | `src/pages/en/about.astro` | Wire about + stats content |
| Modify | `src/pages/it/prezzi.astro` | Wire pricing content |
| Modify | `src/pages/en/pricing.astro` | Wire pricing content |
| Modify | `src/pages/it/index.astro` | Wire stats strip |
| Modify | `src/pages/en/index.astro` | Wire stats strip |

---

## Task 1: Write failing tests and create content seed files

**Files:**
- Create: `tests/page-content.test.ts`
- Create: `src/content/page-content/about.md`
- Create: `src/content/page-content/pricing.md`
- Create: `src/content/page-content/homepage.md`

- [ ] **Step 1: Write the failing tests**

Create `tests/page-content.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

function readContent(filename: string): string {
  return readFileSync(resolve('src/content/page-content', filename), 'utf-8');
}

describe('page-content/about.md', () => {
  it('exists and contains all required IT fields', () => {
    const content = readContent('about.md');
    expect(content).toContain('firmHeadingIt:');
    expect(content).toContain('firmBodyIt:');
    expect(content).toContain('missionHeadingIt:');
    expect(content).toContain('missionBodyIt:');
  });

  it('contains all required EN fields', () => {
    const content = readContent('about.md');
    expect(content).toContain('firmHeadingEn:');
    expect(content).toContain('firmBodyEn:');
    expect(content).toContain('missionHeadingEn:');
    expect(content).toContain('missionBodyEn:');
  });
});

describe('page-content/pricing.md', () => {
  it('exists and contains all required fields', () => {
    const content = readContent('pricing.md');
    expect(content).toContain('introParagraphIt:');
    expect(content).toContain('introParagraphEn:');
    expect(content).toContain('complianceParagraphIt:');
    expect(content).toContain('complianceParagraphEn:');
  });
});

describe('page-content/homepage.md', () => {
  it('exists and contains all four stat values', () => {
    const content = readContent('homepage.md');
    expect(content).toContain('stat1Value:');
    expect(content).toContain('stat2Value:');
    expect(content).toContain('stat3Value:');
    expect(content).toContain('stat4Value:');
  });

  it('contains all IT and EN stat labels', () => {
    const content = readContent('homepage.md');
    ['stat1LabelIt','stat1LabelEn','stat2LabelIt','stat2LabelEn',
     'stat3LabelIt','stat3LabelEn','stat4LabelIt','stat4LabelEn'].forEach(field => {
      expect(content).toContain(`${field}:`);
    });
  });
});
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
npm test
```

Expected: all 4 tests fail with `ENOENT: no such file or directory`.

- [ ] **Step 3: Create the content directory and seed files**

```bash
mkdir -p src/content/page-content
```

Create `src/content/page-content/about.md`:

```markdown
---
firmHeadingIt: "Il nostro studio"
firmHeadingEn: "Our firm"
firmBodyIt: "Ing. Onofrio Fattoruso Engineering Solutions è uno studio di consulenza tecnica e ingegneria con sede a Lettere, in provincia di Napoli. Offriamo servizi professionali nel campo della progettazione architettonica, sicurezza sul lavoro, efficienza energetica e molto altro."
firmBodyEn: "Ing. Onofrio Fattoruso Engineering Solutions is a technical consulting and engineering firm based in Lettere, in the province of Naples. We offer professional services in architectural design, workplace safety, energy efficiency, and more."
missionHeadingIt: "La nostra missione"
missionHeadingEn: "Our mission"
missionBodyIt: "Il nostro obiettivo è fornire soluzioni tecniche di alta qualità, nel rispetto delle normative vigenti e con attenzione alle esigenze specifiche di ogni cliente. Crediamo nella trasparenza, nella precisione e nell'innovazione."
missionBodyEn: "Our goal is to provide high-quality technical solutions, in compliance with current regulations and with attention to the specific needs of each client. We believe in transparency, precision, and innovation."
---
```

Create `src/content/page-content/pricing.md`:

```markdown
---
introParagraphIt: "I nostri prezzi sono definiti in base alla complessità e alla specificità di ogni progetto. Offriamo sempre un preventivo gratuito e trasparente prima di iniziare qualsiasi incarico."
introParagraphEn: "Our fees are defined based on the complexity and specificity of each project. We always provide a free, transparent quote before beginning any engagement."
complianceParagraphIt: "Tutte le nostre tariffe sono conformi alle tabelle onorari di riferimento previste dalla normativa vigente e tengono conto delle specificità tecniche di ogni intervento."
complianceParagraphEn: "All our rates comply with the reference fee schedules established by current regulations and take into account the technical specifics of each intervention."
---
```

Create `src/content/page-content/homepage.md`:

```markdown
---
stat1Value: "10+"
stat1LabelIt: "Anni di esperienza"
stat1LabelEn: "Years of experience"
stat2Value: "9+"
stat2LabelIt: "Servizi offerti"
stat2LabelEn: "Services offered"
stat3Value: "100%"
stat3LabelIt: "Conformità normativa"
stat3LabelEn: "Regulatory compliance"
stat4Value: "NA"
stat4LabelIt: "Lettere, Napoli"
stat4LabelEn: "Lettere, Naples"
---
```

- [ ] **Step 4: Run tests to confirm they pass**

```bash
npm test
```

Expected: all 4 tests pass.

- [ ] **Step 5: Commit**

```bash
git add tests/page-content.test.ts src/content/page-content/
git commit -m "feat: add page-content seed files and tests"
```

---

## Task 2: Add collection schema to `config.ts`

**Files:**
- Modify: `src/content/config.ts`

- [ ] **Step 1: Add the schema and register the collection**

Open `src/content/config.ts`. Add the schema and register the collection:

```typescript
const pageContentSchema = z.object({
  // About
  firmHeadingIt: z.string().optional().default(''),
  firmHeadingEn: z.string().optional().default(''),
  firmBodyIt: z.string().optional().default(''),
  firmBodyEn: z.string().optional().default(''),
  missionHeadingIt: z.string().optional().default(''),
  missionHeadingEn: z.string().optional().default(''),
  missionBodyIt: z.string().optional().default(''),
  missionBodyEn: z.string().optional().default(''),
  // Pricing
  introParagraphIt: z.string().optional().default(''),
  introParagraphEn: z.string().optional().default(''),
  complianceParagraphIt: z.string().optional().default(''),
  complianceParagraphEn: z.string().optional().default(''),
  // Stats
  stat1Value: z.string().optional().default(''),
  stat1LabelIt: z.string().optional().default(''),
  stat1LabelEn: z.string().optional().default(''),
  stat2Value: z.string().optional().default(''),
  stat2LabelIt: z.string().optional().default(''),
  stat2LabelEn: z.string().optional().default(''),
  stat3Value: z.string().optional().default(''),
  stat3LabelIt: z.string().optional().default(''),
  stat3LabelEn: z.string().optional().default(''),
  stat4Value: z.string().optional().default(''),
  stat4LabelIt: z.string().optional().default(''),
  stat4LabelEn: z.string().optional().default(''),
});
```

Add to the `collections` export:

```typescript
export const collections = {
  'solutions-it': defineCollection({ type: 'content', schema: solutionSchema }),
  'solutions-en': defineCollection({ type: 'content', schema: solutionSchema }),
  'solutions': defineCollection({ type: 'content', schema: solutionBilingualSchema }),
  'news': defineCollection({ type: 'content', schema: newsSchema }),
  'projects': defineCollection({ type: 'content', schema: projectSchema }),
  'site-settings': defineCollection({ type: 'content', schema: siteSettingsSchema }),
  'page-content': defineCollection({ type: 'content', schema: pageContentSchema }),
};
```

- [ ] **Step 2: Run tests to confirm nothing broke**

```bash
npm test
```

Expected: all tests still pass.

- [ ] **Step 3: Commit**

```bash
git add src/content/config.ts
git commit -m "feat: add page-content collection schema"
```

---

## Task 3: Add CMS collection to `config.yml.ts`

**Files:**
- Modify: `src/pages/it/admin/config.yml.ts`

- [ ] **Step 1: Add the `page-content` collection**

In `config.yml.ts`, insert the new collection block **before** the `news` collection (before the line `- name: "news"`):

```typescript
  - name: "page-content"
    label: "📄 Contenuto Pagine"
    editor:
      preview: false
    files:
      - name: "about"
        label: "Chi siamo / About"
        file: "src/content/page-content/about.md"
        fields:
          - { label: "Titolo sezione studio (IT)", name: "firmHeadingIt", widget: "string" }
          - { label: "Titolo sezione studio (EN) — auto-tradotto al salvataggio", name: "firmHeadingEn", widget: "string", required: false }
          - { label: "Testo sezione studio (IT)", name: "firmBodyIt", widget: "text" }
          - { label: "Testo sezione studio (EN) — auto-tradotto al salvataggio", name: "firmBodyEn", widget: "text", required: false }
          - { label: "Titolo missione (IT)", name: "missionHeadingIt", widget: "string" }
          - { label: "Titolo missione (EN) — auto-tradotto al salvataggio", name: "missionHeadingEn", widget: "string", required: false }
          - { label: "Testo missione (IT)", name: "missionBodyIt", widget: "text" }
          - { label: "Testo missione (EN) — auto-tradotto al salvataggio", name: "missionBodyEn", widget: "text", required: false }
      - name: "pricing"
        label: "Prezzi / Pricing"
        file: "src/content/page-content/pricing.md"
        fields:
          - { label: "Paragrafo introduttivo (IT)", name: "introParagraphIt", widget: "text" }
          - { label: "Paragrafo introduttivo (EN) — auto-tradotto al salvataggio", name: "introParagraphEn", widget: "text", required: false }
          - { label: "Paragrafo conformità (IT)", name: "complianceParagraphIt", widget: "text" }
          - { label: "Paragrafo conformità (EN) — auto-tradotto al salvataggio", name: "complianceParagraphEn", widget: "text", required: false }
      - name: "homepage"
        label: "Homepage — Stats"
        file: "src/content/page-content/homepage.md"
        fields:
          - { label: "Stat 1 — Valore", name: "stat1Value", widget: "string", hint: 'Es: "10+"' }
          - { label: "Stat 1 — Etichetta (IT)", name: "stat1LabelIt", widget: "string" }
          - { label: "Stat 1 — Etichetta (EN)", name: "stat1LabelEn", widget: "string", required: false }
          - { label: "Stat 2 — Valore", name: "stat2Value", widget: "string", hint: 'Es: "9+"' }
          - { label: "Stat 2 — Etichetta (IT)", name: "stat2LabelIt", widget: "string" }
          - { label: "Stat 2 — Etichetta (EN)", name: "stat2LabelEn", widget: "string", required: false }
          - { label: "Stat 3 — Valore", name: "stat3Value", widget: "string", hint: 'Es: "100%"' }
          - { label: "Stat 3 — Etichetta (IT)", name: "stat3LabelIt", widget: "string" }
          - { label: "Stat 3 — Etichetta (EN)", name: "stat3LabelEn", widget: "string", required: false }
          - { label: "Stat 4 — Valore", name: "stat4Value", widget: "string", hint: 'Es: "NA"' }
          - { label: "Stat 4 — Etichetta (IT)", name: "stat4LabelIt", widget: "string" }
          - { label: "Stat 4 — Etichetta (EN)", name: "stat4LabelEn", widget: "string", required: false }
```

- [ ] **Step 2: Run tests**

```bash
npm test
```

Expected: all tests pass.

- [ ] **Step 3: Commit**

```bash
git add src/pages/it/admin/config.yml.ts
git commit -m "feat: add page-content CMS collection"
```

---

## Task 4: Wire About pages (IT + EN)

**Files:**
- Modify: `src/pages/it/chi-siamo.astro`
- Modify: `src/pages/en/about.astro`

- [ ] **Step 1: Update `src/pages/it/chi-siamo.astro` frontmatter**

Replace the frontmatter block (the `---` section) with:

```typescript
---
import Base from '../../layouts/Base.astro';
import { t } from '../../i18n/utils';
import { getCollection, getEntry } from 'astro:content';
import { Image } from 'astro:assets';
const lang = 'it';
const settings = await getCollection('site-settings');
const cvFile = settings[0]?.data.cvFile ?? '/Cv_ing_Onofrio_Fattoruso.pdf';
const about = (await getEntry('page-content', 'about'))!.data;
const stats = (await getEntry('page-content', 'homepage'))!.data;
---
```

- [ ] **Step 2: Replace hardcoded about text in `chi-siamo.astro`**

Replace the two `<div>` blocks containing firm and mission text:

```astro
<div>
  <h2 class="text-xl font-heading font-bold mb-4" style="color: var(--color-text);">{about.firmHeadingIt}</h2>
  <p class="text-sm leading-relaxed" style="color: var(--color-accent);">
    {about.firmBodyIt}
  </p>
</div>
<div>
  <h2 class="text-xl font-heading font-bold mb-4" style="color: var(--color-text);">{about.missionHeadingIt}</h2>
  <p class="text-sm leading-relaxed" style="color: var(--color-accent);">
    {about.missionBodyIt}
  </p>
</div>
```

- [ ] **Step 3: Replace hardcoded stats array in `chi-siamo.astro`**

Replace the hardcoded `.map()` array:

```astro
<div class="grid grid-cols-2 md:grid-cols-4 gap-4">
  {[
    { value: stats.stat1Value, label: stats.stat1LabelIt },
    { value: stats.stat2Value, label: stats.stat2LabelIt },
    { value: stats.stat3Value, label: stats.stat3LabelIt },
    { value: stats.stat4Value, label: stats.stat4LabelIt },
  ].map(stat => (
    <div class="card p-6 text-center">
      <p class="text-3xl font-heading font-black mb-2" style="color: var(--color-primary);">{stat.value}</p>
      <p class="text-xs uppercase tracking-widest" style="color: var(--color-accent);">{stat.label}</p>
    </div>
  ))}
</div>
```

- [ ] **Step 4: Update `src/pages/en/about.astro` frontmatter**

```typescript
---
import Base from '../../layouts/Base.astro';
import { t } from '../../i18n/utils';
import { getCollection, getEntry } from 'astro:content';
import { Image } from 'astro:assets';
const lang = 'en';
const settings = await getCollection('site-settings');
const cvFile = settings[0]?.data.cvFile ?? '/Cv_ing_Onofrio_Fattoruso.pdf';
const about = (await getEntry('page-content', 'about'))!.data;
const stats = (await getEntry('page-content', 'homepage'))!.data;
---
```

- [ ] **Step 5: Replace hardcoded about text in `en/about.astro`**

```astro
<div>
  <h2 class="text-xl font-heading font-bold mb-4" style="color: var(--color-text);">{about.firmHeadingEn}</h2>
  <p class="text-sm leading-relaxed" style="color: var(--color-accent);">
    {about.firmBodyEn}
  </p>
</div>
<div>
  <h2 class="text-xl font-heading font-bold mb-4" style="color: var(--color-text);">{about.missionHeadingEn}</h2>
  <p class="text-sm leading-relaxed" style="color: var(--color-accent);">
    {about.missionBodyEn}
  </p>
</div>
```

- [ ] **Step 6: Replace hardcoded stats array in `en/about.astro`**

```astro
<div class="grid grid-cols-2 md:grid-cols-4 gap-4">
  {[
    { value: stats.stat1Value, label: stats.stat1LabelEn },
    { value: stats.stat2Value, label: stats.stat2LabelEn },
    { value: stats.stat3Value, label: stats.stat3LabelEn },
    { value: stats.stat4Value, label: stats.stat4LabelEn },
  ].map(stat => (
    <div class="card p-6 text-center">
      <p class="text-3xl font-heading font-black mb-2" style="color: var(--color-primary);">{stat.value}</p>
      <p class="text-xs uppercase tracking-widest" style="color: var(--color-accent);">{stat.label}</p>
    </div>
  ))}
</div>
```

- [ ] **Step 7: Run tests + build check**

```bash
npm test && npm run build
```

Expected: all tests pass, build succeeds.

- [ ] **Step 8: Commit**

```bash
git add src/pages/it/chi-siamo.astro src/pages/en/about.astro
git commit -m "feat: wire about page content from CMS"
```

---

## Task 5: Wire Pricing pages (IT + EN)

**Files:**
- Modify: `src/pages/it/prezzi.astro`
- Modify: `src/pages/en/pricing.astro`

- [ ] **Step 1: Update `src/pages/it/prezzi.astro` frontmatter**

```typescript
---
import Base from '../../layouts/Base.astro';
import { t } from '../../i18n/utils';
import { getEntry } from 'astro:content';
const lang = 'it';
const pricing = (await getEntry('page-content', 'pricing'))!.data;
---
```

- [ ] **Step 2: Replace hardcoded paragraphs in `prezzi.astro`**

```astro
<p class="text-sm leading-relaxed mb-6" style="color: var(--color-accent);">
  {pricing.introParagraphIt}
</p>
<p class="text-sm leading-relaxed mb-8" style="color: var(--color-accent);">
  {pricing.complianceParagraphIt}
</p>
```

- [ ] **Step 3: Update `src/pages/en/pricing.astro` frontmatter**

```typescript
---
import Base from '../../layouts/Base.astro';
import { t } from '../../i18n/utils';
import { getEntry } from 'astro:content';
const lang = 'en';
const pricing = (await getEntry('page-content', 'pricing'))!.data;
---
```

- [ ] **Step 4: Replace hardcoded paragraphs in `en/pricing.astro`**

```astro
<p class="text-sm leading-relaxed mb-6" style="color: var(--color-accent);">
  {pricing.introParagraphEn}
</p>
<p class="text-sm leading-relaxed mb-8" style="color: var(--color-accent);">
  {pricing.complianceParagraphEn}
</p>
```

- [ ] **Step 5: Run tests + build check**

```bash
npm test && npm run build
```

Expected: all tests pass, build succeeds.

- [ ] **Step 6: Commit**

```bash
git add src/pages/it/prezzi.astro src/pages/en/pricing.astro
git commit -m "feat: wire pricing page content from CMS"
```

---

## Task 6: Wire Stats Strip on Homepage (IT + EN)

**Files:**
- Modify: `src/pages/it/index.astro`
- Modify: `src/pages/en/index.astro`

- [ ] **Step 1: Update `src/pages/it/index.astro` frontmatter**

Add `getEntry` to the existing import line and fetch stats. The current frontmatter is:

```typescript
---
import Base from '../../layouts/Base.astro';
import Hero from '../../components/Hero.astro';
import ServiceCard from '../../components/ServiceCard.astro';
import { t } from '../../i18n/utils';
import { getCollection } from 'astro:content';
import { Image } from 'astro:assets';

const lang = 'it';
const solutions = (await getCollection('solutions')).sort((a, b) => a.data.order - b.data.order);
const recentProjects = (await getCollection('projects'))
  .sort((a, b) => b.data.year.localeCompare(a.data.year))
  .slice(0, 3);
---
```

Change to:

```typescript
---
import Base from '../../layouts/Base.astro';
import Hero from '../../components/Hero.astro';
import ServiceCard from '../../components/ServiceCard.astro';
import { t } from '../../i18n/utils';
import { getCollection, getEntry } from 'astro:content';
import { Image } from 'astro:assets';

const lang = 'it';
const solutions = (await getCollection('solutions')).sort((a, b) => a.data.order - b.data.order);
const recentProjects = (await getCollection('projects'))
  .sort((a, b) => b.data.year.localeCompare(a.data.year))
  .slice(0, 3);
const stats = (await getEntry('page-content', 'homepage'))!.data;
---
```

- [ ] **Step 2: Replace hardcoded stats array in `it/index.astro`**

Find the stats strip section and replace the hardcoded array:

```astro
<div class="max-w-6xl mx-auto px-6 md:px-12 py-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
  {[
    { value: stats.stat1Value, label: stats.stat1LabelIt },
    { value: stats.stat2Value, label: stats.stat2LabelIt },
    { value: stats.stat3Value, label: stats.stat3LabelIt },
    { value: stats.stat4Value, label: stats.stat4LabelIt },
  ].map(stat => (
    <div>
      <p class="text-4xl font-heading font-black mb-1" style="color: var(--color-primary);">{stat.value}</p>
      <p class="text-xs uppercase tracking-widest" style="color: var(--color-accent);">{stat.label}</p>
    </div>
  ))}
</div>
```

- [ ] **Step 3: Update `src/pages/en/index.astro` frontmatter**

Same change as IT — add `getEntry` to the import and fetch `stats`:

```typescript
---
import Base from '../../layouts/Base.astro';
import Hero from '../../components/Hero.astro';
import ServiceCard from '../../components/ServiceCard.astro';
import { t } from '../../i18n/utils';
import { getCollection, getEntry } from 'astro:content';
import { Image } from 'astro:assets';

const lang = 'en';
const solutions = (await getCollection('solutions')).sort((a, b) => a.data.order - b.data.order);
const recentProjects = (await getCollection('projects'))
  .sort((a, b) => b.data.year.localeCompare(a.data.year))
  .slice(0, 3);
const stats = (await getEntry('page-content', 'homepage'))!.data;
---
```

- [ ] **Step 4: Replace hardcoded stats array in `en/index.astro`**

```astro
<div class="max-w-6xl mx-auto px-6 md:px-12 py-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
  {[
    { value: stats.stat1Value, label: stats.stat1LabelEn },
    { value: stats.stat2Value, label: stats.stat2LabelEn },
    { value: stats.stat3Value, label: stats.stat3LabelEn },
    { value: stats.stat4Value, label: stats.stat4LabelEn },
  ].map(stat => (
    <div>
      <p class="text-4xl font-heading font-black mb-1" style="color: var(--color-primary);">{stat.value}</p>
      <p class="text-xs uppercase tracking-widest" style="color: var(--color-accent);">{stat.label}</p>
    </div>
  ))}
</div>
```

- [ ] **Step 5: Run tests + build check**

```bash
npm test && npm run build
```

Expected: all tests pass, build succeeds.

- [ ] **Step 6: Commit**

```bash
git add src/pages/it/index.astro src/pages/en/index.astro
git commit -m "feat: wire homepage stats strip from CMS"
```

---

## Task 7: Add auto-translation for page-content in preSave handler

**Files:**
- Modify: `src/pages/it/admin/index.astro`

- [ ] **Step 1: Add `PAGE_CONTENT_FIELDS` constant**

In `src/pages/it/admin/index.astro`, inside the `<script is:inline>` block, add after `SOLUTION_FIELDS`:

```javascript
const PAGE_CONTENT_FIELDS = {
  about: [
    ['firmHeadingIt',    'firmHeadingEn'],
    ['firmBodyIt',       'firmBodyEn'],
    ['missionHeadingIt', 'missionHeadingEn'],
    ['missionBodyIt',    'missionBodyEn'],
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

- [ ] **Step 2: Update the preSave handler to handle `page-content`**

Find this block in the preSave handler:

```javascript
const fields = collection === 'news' ? NEWS_FIELDS
             : collection === 'projects' ? PROJECT_FIELDS
             : collection === 'solutions' ? SOLUTION_FIELDS
             : null;
if (!fields) return entry;
```

Replace with:

```javascript
let fields = collection === 'news' ? NEWS_FIELDS
           : collection === 'projects' ? PROJECT_FIELDS
           : collection === 'solutions' ? SOLUTION_FIELDS
           : collection === 'page-content' ? PAGE_CONTENT_FIELDS[entry.get('slug')] ?? null
           : null;
if (!fields) return entry;
```

- [ ] **Step 3: Run tests + build check**

```bash
npm test && npm run build
```

Expected: all tests pass, build succeeds.

- [ ] **Step 4: Commit**

```bash
git add src/pages/it/admin/index.astro
git commit -m "feat: add auto-translation for page-content entries"
```

---

## Task 8: Mark B-10 complete in backlog

**Files:**
- Modify: `docs/BACKLOG.md`

- [ ] **Step 1: Move B-10 from Open to Completed**

In `docs/BACKLOG.md`, remove the B-10 row from the Open table and add it to the Completed table:

```markdown
| B-10 | **Admin Panel — Full Page Content Editor** | About, pricing, and stats-strip text editable from `📄 Contenuto Pagine` CMS collection. |
```

- [ ] **Step 2: Commit**

```bash
git add docs/BACKLOG.md
git commit -m "docs: mark B-10 complete"
```
