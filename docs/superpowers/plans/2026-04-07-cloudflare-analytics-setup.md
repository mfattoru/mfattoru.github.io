# Cloudflare Analytics + Deployment Docs Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Cloudflare Web Analytics as an admin-configurable setting, and write two reference documents: a developer deployment guide for Cloudflare Pages and a client user guide.

**Architecture:** The analytics token is stored in the existing `site-settings` content collection, surfaced as a CMS field, and conditionally injected into `Base.astro` at render time. The two docs are standalone markdown files in `docs/`.

**Tech Stack:** Astro 4, Zod, Sveltia CMS config (TypeScript-generated YAML), Tailwind CSS.

---

## File Map

| Action | File | Change |
|---|---|---|
| Modify | `src/content/config.ts` | Add `cloudflareAnalyticsToken` to `siteSettingsSchema` |
| Modify | `src/pages/it/admin/config.yml.ts` | Add CMS field for the token |
| Modify | `src/layouts/Base.astro` | Conditionally inject CF beacon script |
| Create | `docs/SETUP-CLOUDFLARE.md` | Developer deployment guide |
| Create | `docs/CLIENT-GUIDE.md` | Client user guide |

---

## Task 1: Add cloudflareAnalyticsToken to schema

**Files:**
- Modify: `src/content/config.ts`

- [ ] **Step 1: Add field to siteSettingsSchema**

Open `src/content/config.ts`. After line 17 (`formspreeId: z.string().optional().default(''),`), add:

```typescript
  cloudflareAnalyticsToken: z.string().optional().default(''),
```

The schema block should now look like:

```typescript
const siteSettingsSchema = z.object({
  cvFile: z.string(),
  theme: z.string().optional().default('steel'),
  email: z.string().optional().default(''),
  phone: z.string().optional().default(''),
  phoneMobile: z.string().optional().default(''),
  address: z.string().optional().default(''),
  vatNumber: z.string().optional().default(''),
  hoursIt: z.string().optional().default(''),
  hoursEn: z.string().optional().default(''),
  linkedinUrl: z.string().optional().default(''),
  siteLanguage: z.enum(['both', 'it', 'en']).optional().default('both'),
  showThemeSwitcher: z.boolean().optional().default(true),
  logoFile: z.string().optional(),
  formspreeId: z.string().optional().default(''),
  cloudflareAnalyticsToken: z.string().optional().default(''),
  ctaBannerImage: z.string().optional(),
});
```

- [ ] **Step 2: Verify build passes**

```bash
npm run build
```

Expected: exits with code 0, no TypeScript or Zod errors.

- [ ] **Step 3: Commit**

```bash
git add src/content/config.ts
git commit -m "feat: add cloudflareAnalyticsToken to site-settings schema"
```

---

## Task 2: Add CMS field to admin config

**Files:**
- Modify: `src/pages/it/admin/config.yml.ts`

- [ ] **Step 1: Add the field after formspreeId**

In `src/pages/it/admin/config.yml.ts`, find this line (around line 63):

```typescript
          - { label: "Formspree ID", name: "formspreeId", widget: "string", required: false, hint: "L'ID del form Formspree per i moduli di contatto e preventivo. Trovalo su formspree.io → il codice dopo /f/ nell'URL del form (es: mlgobndz)." }
```

Add the following line immediately after it:

```typescript
          - { label: "Cloudflare Analytics Token", name: "cloudflareAnalyticsToken", widget: "string", required: false, hint: "Token da Cloudflare Web Analytics (dash.cloudflare.com → Web Analytics). Lascia vuoto per disabilitare il tracciamento." }
```

- [ ] **Step 2: Verify build passes**

```bash
npm run build
```

Expected: exits with code 0. The generated `/it/admin/config.yml` will include the new field.

- [ ] **Step 3: Commit**

```bash
git add src/pages/it/admin/config.yml.ts
git commit -m "feat: add Cloudflare Analytics Token field to CMS site-settings"
```

---

## Task 3: Inject analytics script in Base.astro

**Files:**
- Modify: `src/layouts/Base.astro`

- [ ] **Step 1: Extract the token from settingsData**

In `src/layouts/Base.astro`, the destructuring block (lines 16–20) currently reads:

```astro
const settings = await getCollection('site-settings');
const settingsData = settings[0]?.data;
const defaultTheme = settingsData?.theme ?? 'steel';
const showLangSwitcher = (settingsData?.siteLanguage ?? 'both') === 'both';
const showThemeSwitcher = settingsData?.showThemeSwitcher ?? true;
const logoFile = settingsData?.logoFile;
```

Add one line after `logoFile`:

```astro
const cloudflareToken = settingsData?.cloudflareAnalyticsToken;
```

- [ ] **Step 2: Inject the beacon script conditionally**

In the `<head>` block, after the theme flash-prevention `<script is:inline>` block (after line 53), add:

```astro
    {cloudflareToken && (
      <script is:inline defer src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon={`{"token": "${cloudflareToken}"}`}></script>
    )}
```

The bottom of `<head>` should now look like:

```astro
    <!-- Apply saved theme before first paint to prevent flash -->
    <script is:inline>
      (function () {
        try {
          var def = document.documentElement.getAttribute('data-default-theme') || 'steel';
          var saved = localStorage.getItem('theme') || def;
          document.documentElement.setAttribute('data-theme', saved);
        } catch (e) {}
      })();
    </script>
    {cloudflareToken && (
      <script is:inline defer src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon={`{"token": "${cloudflareToken}"}`}></script>
    )}
  </head>
```

- [ ] **Step 3: Verify build passes**

```bash
npm run build
```

Expected: exits with code 0.

- [ ] **Step 4: Verify script is absent when token is empty**

Check `src/content/site-settings/general.md` — it should not have a `cloudflareAnalyticsToken` key (or it should be empty). Build and inspect `dist/it/index.html`:

```bash
grep -i "cloudflareinsights" dist/it/index.html
```

Expected: no output (script not injected when token is absent).

- [ ] **Step 5: Commit**

```bash
git add src/layouts/Base.astro
git commit -m "feat: inject Cloudflare Web Analytics beacon when token is set in admin"
```

---

## Task 4: Write docs/SETUP-CLOUDFLARE.md

**Files:**
- Create: `docs/SETUP-CLOUDFLARE.md`

- [ ] **Step 1: Create the file with the full guide**

Create `docs/SETUP-CLOUDFLARE.md` with this content:

````markdown
# Cloudflare Deployment Guide

Complete guide to deploy a new client instance of this codebase using Cloudflare Pages and a Cloudflare-registered domain.

> **Prerequisites:** You have accounts on GitHub and Cloudflare. The client has provided their business details (email, phone, VAT number, address).

---

## 0. Accounts to Set Up

| Service | Purpose | URL | Free tier |
|---|---|---|---|
| **GitHub** | Source code hosting | github.com | Yes |
| **Cloudflare** | Pages hosting, domain, Workers, Analytics | cloudflare.com | Yes |
| **Cloudinary** | Image CDN and gallery uploads | cloudinary.com | Yes (25 GB) |
| **Formspree** | Contact form email delivery | formspree.io | Yes (50/month) |

---

## 1. Create Client GitHub Repository

1. On github.com, create a new repository under your account: `mfattoru/<client-name>` (e.g. `mfattoru/rossi-engineering`).
   - Visibility: Private (recommended for client repos)
   - Do NOT initialise with README or .gitignore — keep it empty.

2. In your local copy of this repo, add the client repo as a new remote and push:

```bash
git remote add client git@github.com:mfattoru/<client-name>.git
git push client master
```

3. Add this repo as `upstream` so you can push future updates to the client later:

```bash
# Already set if this is your working copy. Verify:
git remote -v
# Should show: origin → mfattoru/mfattoru.github.io
```

4. To push your updates to the client repo in future:

```bash
git fetch origin
git push client origin/master:master
```

---

## 2. Customise for the Client

Do this in a local checkout of the **client repo** (clone it fresh):

```bash
git clone git@github.com:mfattoru/<client-name>.git
cd <client-name>
```

### 2a. Update CMS backend config

Open `src/pages/it/admin/config.yml.ts` and update the `backend` block:

```typescript
const yaml = `backend:
  name: github
  repo: mfattoru/<client-name>          ← update
  branch: master
  base_url: https://<auth-worker-url>   ← update after step 5
```

Leave `base_url` as a placeholder for now — you'll update it after deploying the auth worker in step 5.

### 2b. Update robots.txt

Open `public/robots.txt` and update the sitemap URL:

```
Sitemap: https://<client-domain.com>/sitemap-index.xml
```

### 2c. Prefill site settings

Open `src/content/site-settings/general.md` and fill in the client's details:

```yaml
---
cvFile: ''
theme: steel
showThemeSwitcher: false
siteLanguage: it
email: client@example.com
phone: +39 ...
phoneMobile: +39 ...
address: Via ..., CAP, Città (Provincia)
vatNumber: '...'
hoursIt: 'Lun - Sab: 9:00 - 18:00'
hoursEn: 'Mon - Sat: 9AM - 6PM'
linkedinUrl: ''
formspreeId: ''
cloudflareAnalyticsToken: ''
---
```

Commit and push these changes to the client repo:

```bash
git add -A
git commit -m "chore: customise for client"
git push origin master
```

---

## 3. Cloudinary Setup (Image CDN)

1. Create a new Cloudinary account at cloudinary.com (or use an existing account with a new environment).
2. From the dashboard, note your **Cloud Name** and **API Key**.
3. Go to **Settings → Upload → Upload presets → Add upload preset**:
   - Signing mode: **Unsigned**
   - Optionally restrict formats to `jpg,png,webp`
   - Save. Note the **Preset name**.
4. Keep the **API Secret** handy — you'll need it for the cache Worker in step 6.

---

## 4. Cloudflare Account

Create a free account at cloudflare.com if you don't have one already.

---

## 5. Buy Client Domain from Cloudflare

1. In the Cloudflare dashboard → **Domain Registration → Register a Domain**.
2. Search for the client's preferred domain name and purchase it.
3. DNS is automatically managed by Cloudflare — no external nameserver changes needed.
4. Note the domain (e.g. `rossi-engineering.it`) — you'll use it in steps 6, 7, and 8.

---

## 6. Deploy to Cloudflare Pages

1. Cloudflare dashboard → **Workers & Pages → Create → Pages → Connect to Git**.
2. Select the client GitHub repository.
3. Build settings:
   - **Framework preset:** Astro
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
4. Under **Environment variables**, add:

| Variable | Value |
|---|---|
| `CLOUDINARY_CLOUD_NAME` | your Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | your Cloudinary API key |
| `CLOUDINARY_UPLOAD_PRESET` | your unsigned preset name |
| `CLOUDINARY_CACHE_WORKER_URL` | *(leave empty for now — fill after step 7)* |

5. Click **Save and Deploy**. The first deploy will run — check it succeeds.
6. Go to **Custom Domains → Set up a custom domain** → enter the domain from step 5.
   - Cloudflare auto-provisions SSL. No extra steps.

---

## 7. Deploy Cache Invalidation Worker

This Worker signs Cloudinary cache invalidation requests server-side (the API secret must never reach the browser).

```bash
cd cloudflare-workers
npx wrangler deploy cloudinary-invalidate.js --name <client-name>-cloudinary-cache
```

Add Worker secrets (run once each — you'll be prompted to enter the value):

```bash
npx wrangler secret put CLOUDINARY_CLOUD_NAME --name <client-name>-cloudinary-cache
npx wrangler secret put CLOUDINARY_API_KEY    --name <client-name>-cloudinary-cache
npx wrangler secret put CLOUDINARY_API_SECRET --name <client-name>-cloudinary-cache
```

Note the worker URL: `https://<client-name>-cloudinary-cache.<subdomain>.workers.dev`

Now go back to Cloudflare Pages → the client project → **Settings → Environment variables** and add:

| Variable | Value |
|---|---|
| `CLOUDINARY_CACHE_WORKER_URL` | the worker URL above |

Trigger a new deploy (Settings → Deployments → Retry latest).

---

## 8. Deploy CMS Auth Worker (GitHub OAuth Proxy)

The admin panel requires a Cloudflare Worker as an OAuth proxy for GitHub authentication.

### 8a. Deploy the worker

Go to github.com/sveltia/sveltia-cms-auth and click **Deploy with Workers**. Sign in to Cloudflare and name the worker `<client-name>-cms-auth`.

### 8b. Create GitHub OAuth App

1. github.com → **Settings → Developer settings → OAuth Apps → New OAuth App**
2. Fill in:
   - **Application name:** `<Client Name> Admin`
   - **Homepage URL:** `https://<client-domain.com>`
   - **Authorization callback URL:** `https://<client-name>-cms-auth.<subdomain>.workers.dev/callback`
     ⚠️ Must point to the Worker, not the CMS page.
3. Click **Register application**. Copy the **Client ID** and generate a **Client Secret**.

### 8c. Add Worker secrets

Cloudflare dashboard → Workers & Pages → `<client-name>-cms-auth` → **Settings → Variables → Secrets**:

| Secret | Value |
|---|---|
| `GITHUB_CLIENT_ID` | GitHub OAuth App Client ID |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth App Client Secret |
| `ALLOWED_DOMAINS` | `<client-domain.com>` (the custom domain, NOT the `.pages.dev` subdomain) |

### 8d. Update CMS config

Back in the client repo, open `src/pages/it/admin/config.yml.ts` and set `base_url`:

```typescript
  base_url: https://<client-name>-cms-auth.<subdomain>.workers.dev
```

Commit and push:

```bash
git add src/pages/it/admin/config.yml.ts
git commit -m "chore: set CMS auth worker URL"
git push origin master
```

Cloudflare Pages will auto-deploy. Wait for it to finish before testing the admin login.

---

## 9. Cloudflare Web Analytics

1. Cloudflare dashboard → **Web Analytics → Add a site** → enter `<client-domain.com>`.
2. Copy the token from the snippet shown (the value of `data-cf-beacon`'s `token` key).
3. Log into the site admin panel at `https://<client-domain.com>/it/admin/`.
4. Go to **⚙️ Impostazioni Sito → Generali → Cloudflare Analytics Token** → paste the token → Save.

Analytics will appear in the Cloudflare dashboard within ~24 hours.

---

## 10. Formspree (Contact Forms)

1. Sign up at formspree.io.
2. Click **+ New Form** → name it (e.g. `Contact — <Client Name>`) → set notification email to the client's address.
3. Copy the 8-character **Form ID** from the endpoint URL (after `/f/`).
4. Admin panel → **⚙️ Impostazioni Sito → Generali → Formspree ID** → paste the ID → Save.

Test: submit the contact form and confirm the email arrives.

---

## 11. First Deploy Verification Checklist

- [ ] Site loads at `https://<client-domain.com>` with SSL padlock
- [ ] `/it/admin/` loads the CMS interface
- [ ] CMS login with GitHub works (no OAuth errors)
- [ ] Image upload in CMS works (Cloudinary picker appears)
- [ ] Cache invalidation at `/it/admin/cache` lists images and invalidates without errors
- [ ] Contact form at `/it/contatti` delivers email to client's inbox
- [ ] Analytics token is set and `cloudflareinsights` script appears in page source
- [ ] Cloudflare Web Analytics dashboard shows the site (allow up to 24h for first data)

---

## Pulling Future Updates from the Base Repo

When you make improvements to `mfattoru/mfattoru.github.io` that should go to a client:

```bash
# In the client repo working directory
git remote add upstream git@github.com:mfattoru/mfattoru.github.io.git  # first time only
git fetch upstream
git merge upstream/master
# Resolve any conflicts (usually just config.yml.ts customisations)
git push origin master
```
````

- [ ] **Step 2: Commit**

```bash
git add docs/SETUP-CLOUDFLARE.md
git commit -m "docs: add Cloudflare Pages deployment guide"
```

---

## Task 5: Write docs/CLIENT-GUIDE.md

**Files:**
- Create: `docs/CLIENT-GUIDE.md`

- [ ] **Step 1: Create the file with the full guide**

Create `docs/CLIENT-GUIDE.md` with this content:

````markdown
# Guida Utente — Pannello di Amministrazione

Questa guida spiega come gestire i contenuti del sito attraverso il pannello admin.

---

## Accesso al Pannello Admin

1. Apri il browser (preferibilmente Chrome o Edge) e vai su:
   `https://tuodominio.com/it/admin/`

2. Clicca **"Login with GitHub"** e accedi con il tuo account GitHub.
   > Se non hai ancora un account GitHub, contatta il tuo sviluppatore per ricevere l'accesso.

3. Al primo accesso potrebbe apparire una schermata di autorizzazione di GitHub — clicca **Authorize**.

---

## Notizie

La sezione **Notizie** ti permette di pubblicare articoli, aggiornamenti e comunicazioni.

### Aggiungere una notizia

1. Nel menu laterale clicca **📰 Notizie / News**.
2. Clicca **+ New News** in alto a destra.
3. Compila i campi:
   - **Titolo** — il titolo dell'articolo
   - **Data pubblicazione** — seleziona la data
   - **Descrizione breve** — un riassunto di una riga (mostrato nelle anteprime)
   - **Immagine copertina** — carica un'immagine (consigliata: 1200×480px)
   - **Contenuto** — il testo completo dell'articolo in formato ricco (grassetto, corsivo, link, ecc.)
4. Clicca **Save** in alto a destra.

> Il campo "Titolo EN" e gli altri campi in inglese vengono compilati automaticamente tramite traduzione automatica quando salvi. Puoi modificarli manualmente se la traduzione non è corretta.

### Modificare una notizia esistente

1. Clicca **📰 Notizie / News** nel menu.
2. Clicca sulla notizia che vuoi modificare.
3. Apporta le modifiche e clicca **Save**.

### Eliminare una notizia

1. Apri la notizia.
2. Clicca sui tre puntini **⋯** in alto → **Delete**.
   > ⚠️ L'eliminazione è permanente nel pannello, ma il tuo sviluppatore può recuperare il contenuto dalla cronologia Git se necessario.

---

## Progetti

La sezione **Progetti** mostra il portfolio lavori dello studio.

### Aggiungere un progetto

1. Clicca **🏗️ Progetti / Projects → + New Projects**.
2. Compila i campi:
   - **Titolo** — nome del progetto
   - **Anno** — anno di realizzazione (es: `2024`)
   - **Categoria** — tipo di lavoro (es: `Progettazione strutturale`)
   - **Località** — città o zona
   - **Ruolo** — il ruolo dello studio nel progetto
   - **Stato** — es: `Completato` o `In corso`
   - **Descrizione breve** — testo introduttivo visualizzato in cima alla pagina progetto
   - **Risultato** — evidenziato in un riquadro speciale nella pagina
   - **Descrizione completa** — testo esteso opzionale con formattazione
   - **Immagine principale** — foto principale del progetto (consigliata: 1200×800px)
   - **Galleria foto** — aggiungi tutte le foto del progetto cliccando **+ Add photos**
3. Clicca **Save**.

### Aggiungere foto alla galleria

1. Nella sezione **Galleria foto**, clicca **+ Add photos**.
2. Carica una o più immagini dalla finestra di Cloudinary.
3. Clicca **Save** per confermare.

---

## Servizi

La sezione **Servizi** gestisce i servizi offerti dallo studio mostrati nella pagina Soluzioni.

### Aggiungere un servizio

1. Clicca **🔧 Servizi / Services → + New Solutions**.
2. Compila i campi:
   - **Titolo** — nome del servizio
   - **Descrizione breve** — una riga mostrata nelle card
   - **Icona** — un'emoji che rappresenta il servizio (es: `🏛️`)
   - **Ordine di visualizzazione** — numero che determina l'ordine (1 = primo)
   - **Immagine copertina** — foto principale (consigliata: 1200×800px)
   - **Contenuto** — descrizione estesa del servizio
   - **Galleria foto** — immagini aggiuntive opzionali
3. Clicca **Save**.

---

## Impostazioni Sito

Le **Impostazioni Sito** controllano aspetti generali del sito come logo, contatti e integrazioni.

1. Clicca **⚙️ Impostazioni Sito → Generali**.

### Campi principali

| Campo | Descrizione |
|---|---|
| **Immagine banner CTA** | Foto di sfondo nella sezione "Hai un progetto in mente?" in homepage |
| **Formspree ID** | Codice per la ricezione delle email dai moduli di contatto |
| **Logo sito** | Logo mostrato nella barra di navigazione |
| **File CV (PDF)** | Il CV scaricabile dal sito |
| **Tema predefinito** | Combinazione di colori del sito per i nuovi visitatori |
| **Cloudflare Analytics Token** | Token per il monitoraggio delle visite (fornito dallo sviluppatore) |
| **Email** | Email di contatto mostrata nel footer e nella pagina contatti |
| **Telefono fisso / Cellulare** | Numeri di telefono mostrati sul sito |
| **Indirizzo** | Indirizzo completo dello studio |
| **Partita IVA** | Mostrata nel footer |
| **Orari** | Orari di apertura mostrati nella pagina contatti |
| **URL LinkedIn** | Link al profilo LinkedIn dello studio |

2. Modifica i campi necessari e clicca **Save**.

---

## Strumento Cache CDN

Lo strumento **Cache CDN** serve per aggiornare le immagini sul sito quando sostituisci una foto che ha lo stesso nome file.

**Quando usarlo:** Se hai caricato una nuova versione di un'immagine con lo stesso nome e il sito mostra ancora la versione vecchia.

### Come usarlo

1. Vai su `https://tuodominio.com/it/admin/cache`.
2. Seleziona le immagini che vuoi aggiornare con le caselle di spunta.
3. Clicca **Invalida selezionati**.
4. Attendi la conferma. Ricarica il sito dopo qualche secondo per vedere la nuova immagine.

> Non è necessario usarlo ogni volta che carichi immagini nuove con nomi diversi — solo quando sostituisci un file con lo stesso nome.

---

## Domande Frequenti

**Non vedo le mie modifiche sul sito. Cosa faccio?**
Le modifiche salvate nel pannello admin avviano automaticamente una nuova pubblicazione del sito. Questo processo richiede 1–3 minuti. Ricarica la pagina del sito dopo qualche minuto.

**Ho cancellato qualcosa per errore. Si può recuperare?**
Sì. Tutte le modifiche sono tracciate nella cronologia Git. Contatta il tuo sviluppatore con il nome del contenuto eliminato e la data approssimativa — può ripristinarlo.

**Posso caricare qualsiasi formato di immagine?**
Sono supportati JPG, PNG e WebP. Per le migliori prestazioni usa JPG o WebP. Evita immagini troppo piccole (sotto 800px di larghezza) o eccessivamente grandi (oltre 10 MB).

**Il pannello admin non si apre. Cosa controllo?**
- Usa Chrome o Edge (Firefox non è supportato per il pannello admin)
- Verifica di essere connesso a internet
- Prova a fare logout da GitHub e riaccedere

**Come faccio ad aggiungere una nuova pagina al sito?**
Le pagine del sito sono strutturate dal codice e non possono essere aggiunte dal pannello admin. Contatta il tuo sviluppatore per aggiungere nuove sezioni o pagine.
````

- [ ] **Step 2: Commit**

```bash
git add docs/CLIENT-GUIDE.md
git commit -m "docs: add client user guide for admin panel"
```

---

## Task 6: Final verification

- [ ] **Step 1: Full build check**

```bash
npm run build
```

Expected: exits with code 0, no errors.

- [ ] **Step 2: Verify analytics script is absent with empty token**

```bash
grep -i "cloudflareinsights" dist/it/index.html
```

Expected: no output.

- [ ] **Step 3: Verify analytics script is injected with a token**

Temporarily add a token to `src/content/site-settings/general.md`:

```yaml
cloudflareAnalyticsToken: 'test-token-abc123'
```

Rebuild and check:

```bash
npm run build && grep -i "cloudflareinsights" dist/it/index.html
```

Expected: one line containing `beacon.min.js` and `test-token-abc123`.

Remove the test token from `general.md` after verifying. Do not commit it.

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "chore: verify analytics injection — no token committed"
```
