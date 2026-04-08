# Design: Cloudflare Analytics + Deployment Docs

**Date:** 2026-04-07
**Status:** Approved

---

## Overview

Three deliverables:

1. **Cloudflare Web Analytics integration** — admin-configurable token injected into all pages
2. **`docs/SETUP-CLOUDFLARE.md`** — full deployment guide for the developer (GitHub repo → Cloudinary → CF Workers → CF Pages → domain → analytics)
3. **`docs/CLIENT-GUIDE.md`** — end-user guide for the client to manage site content day-to-day

---

## Deliverable 1 — Cloudflare Web Analytics Integration

### What changes

| File | Change |
|---|---|
| `src/content/config.ts` | Add `cloudflareAnalyticsToken: z.string().optional()` to `siteSettingsSchema` |
| `src/pages/it/admin/config.yml.ts` | Add "Cloudflare Analytics Token" text field in site-settings collection |
| `src/layouts/Base.astro` | Conditionally inject CF beacon `<script>` if token is set |

### Behaviour

- If `cloudflareAnalyticsToken` is set in site-settings, `Base.astro` injects:
  ```html
  <script defer src="https://static.cloudflareinsights.com/beacon.min.js"
    data-cf-beacon='{"token": "TOKEN_VALUE"}'></script>
  ```
- If the field is empty or missing, nothing is injected — safe default, no errors.
- The token is a public-facing value (it appears in HTML source), so storing it in a markdown content file is appropriate.

### Admin panel field

- Label: "Cloudflare Analytics Token"
- Widget: `string`
- Required: false
- Hint: "Paste the token from Cloudflare Web Analytics dashboard. Leave empty to disable analytics."

---

## Deliverable 2 — `docs/SETUP-CLOUDFLARE.md`

### Scope

Full step-by-step guide for deploying a new client instance of this codebase to Cloudflare Pages, from zero to live. Replaces the GitHub Pages flow from `SETUP.md` for client deployments.

### Structure

1. **Create client GitHub repo**
   - Create new repo (e.g. `mfattoru/client-name`) on GitHub (do not fork — fork ties public visibility and repo naming)
   - Clone this repo locally, add the new remote, push all branches: `git remote add client git@github.com:mfattoru/client-name.git && git push client master`
   - Add upstream remote so future updates can be pulled: `git remote add upstream git@github.com:mfattoru/mfattoru.github.io.git`
   - To pull future updates downstream: `git fetch upstream && git merge upstream/master`

2. **Customise for client**
   - Update `src/pages/it/admin/config.yml.ts`: repo name, worker base URLs
   - Update `public/robots.txt`: sitemap URL
   - Update default site-settings content (`src/content/site-settings/general.md`): email, phone, address, VAT, hours

3. **Cloudinary setup** (images CDN)
   - Create account at cloudinary.com
   - Note Cloud Name and API Key
   - Create unsigned upload preset
   - GitHub Actions secrets to add: `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_UPLOAD_PRESET`, `CLOUDINARY_CACHE_WORKER_URL` (after step 7)

4. **Cloudflare account**
   - Create free account at cloudflare.com

5. **Buy domain from Cloudflare**
   - Cloudflare dashboard → Domain Registration → Register a Domain
   - Note: domain goes live with Cloudflare DNS automatically — no external DNS config needed

6. **Cloudflare Pages**
   - New project → Connect to GitHub → select client repo
   - Build settings: Framework preset = Astro, build command = `npm run build`, output = `dist`
   - Environment variables: same as GitHub Actions secrets (Cloudinary vars)
   - Custom domain: add the purchased domain, CF auto-provisions SSL

7. **Auth Worker** (`sveltia-cms-auth`)
   - Deploy via "Deploy with Workers" button on github.com/sveltia/sveltia-cms-auth
   - Worker secrets: `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, `ALLOWED_DOMAINS` (set to the custom domain, e.g. `clientdomain.com` — not the `*.pages.dev` subdomain)
   - Create GitHub OAuth App: homepage = new domain, callback = worker URL `/callback`

8. **Cache Worker** (`cloudinary-invalidate.js`)
   - Deploy via wrangler: `npx wrangler deploy cloudflare-workers/cloudinary-invalidate.js --name client-cloudinary-cache`
   - Worker secrets: `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
   - Add worker URL as CF Pages environment variable: `CLOUDINARY_CACHE_WORKER_URL`

9. **Cloudflare Web Analytics**
   - CF dashboard → Web Analytics → Add a site → enter the custom domain
   - Copy the token
   - Paste token into Admin Panel → Site Settings → Cloudflare Analytics Token → Save

10. **Formspree** (contact forms)
    - Create account at formspree.io
    - New form → set notification email to client's address
    - Copy 8-character Form ID
    - Admin Panel → Site Settings → Formspree ID → paste ID → Save

11. **First deploy verification checklist**
    - Site loads at custom domain with SSL
    - Admin panel accessible at `/it/admin/`
    - CMS login works (GitHub OAuth)
    - Image upload works in CMS
    - Cache invalidation page works
    - Contact form delivers email
    - Analytics appearing in CF dashboard (allow ~24h)

---

## Deliverable 3 — `docs/CLIENT-GUIDE.md`

### Scope

Non-technical guide for the client to manage site content. Written in plain language. Covers only what the client interacts with directly.

### Structure

1. **Accessing the admin panel**
   - URL: `https://yourdomain.com/it/admin/`
   - Login: GitHub account (the developer will set up access)
   - First-time login flow

2. **Managing News**
   - How to add a new article
   - Fields: title, date, description, image, body (rich text)
   - How to edit or delete an existing article
   - Note: Italian content auto-translates to English on save

3. **Managing Projects**
   - How to add a project
   - Fields explained: category, year, location, role, status, summary, result, body, thumbnail, gallery
   - How to add multiple gallery photos
   - How to edit or delete

4. **Managing Solutions** (services)
   - How to add/edit a service
   - Fields: title, description, icon (emoji), order, image, body

5. **Site Settings**
   - Logo, CV file, theme
   - Contact info: email, phone, address, VAT, office hours
   - Formspree ID (contact form email routing)
   - Cloudflare Analytics Token
   - Language mode (Italian only / English only / both)

6. **CDN Cache Tool**
   - When to use it: after replacing an image that has the same filename
   - How to use: Admin → Cache CDN → select images → Invalidate
   - Why it exists: Cloudinary caches images by URL; same filename = old image served until invalidated

7. **FAQ**
   - "Why don't I see my changes immediately?" — CF Pages builds take ~1-2 minutes after saving
   - "How do I undo a change?" — contact the developer; changes are tracked in git
   - "Can I delete content by accident?" — yes, but the developer can restore from git history
   - "Can I upload any image format?" — JPG, PNG, WebP recommended; max size set by upload preset

---

## What is NOT in scope

- Changing the site design or layout (requires code changes)
- Adding new page types (requires code changes)
- Setting up local development environment (covered in `SETUP.md`)
- GoDaddy domain migration (covered in `SETUP-GODADDY.md`)
