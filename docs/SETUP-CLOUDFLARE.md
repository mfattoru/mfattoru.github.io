# Cloudflare Deployment Guide

Complete guide to deploy a new client instance of this codebase using Cloudflare Pages and a Cloudflare-registered domain.

> **Prerequisites:** You have accounts on GitHub and Cloudflare. The client has provided their business details (name, email, phone, VAT number, address).

---

## 0. Accounts to Set Up

| Service | Purpose | URL | Free tier |
|---|---|---|---|
| **GitHub** | Repository hosting | github.com | Yes |
| **Cloudflare** | Pages hosting, domain registration, Workers (OAuth proxy + cache invalidation), Web Analytics | cloudflare.com | Yes |
| **Cloudinary** | Image hosting + CDN + multi-upload gallery picker in CMS | cloudinary.com | Yes (25 GB storage, 25 GB bandwidth/month) |
| **Formspree** | Contact and quote form submissions → email | formspree.io | Yes (50 submissions/month) |

---

## 1. Create Client GitHub Repository

1. Create a new **private**, **empty** repository under your GitHub account: `mfattoru/<client-name>` — do **not** fork, do not initialise with a README.

2. Clone it locally and push the base codebase into it:

   ```bash
   # Clone the base repo if you don't have it already
   git clone https://github.com/mfattoru/mfattoru.github.io.git <client-name>
   cd <client-name>
   git remote set-url origin https://github.com/mfattoru/<client-name>.git
   git push origin master
   ```

3. Add the client as a collaborator so they can log into the CMS:
   - The client needs a GitHub account (free, just for CMS login — no technical knowledge required)
   - Go to the repo → **Settings → Collaborators → Add people** → enter the client's GitHub username
   - Set access level to **Write**

   > The client will use this GitHub account to authenticate at `/it/admin/`. They do not need to know anything else about GitHub.

4. **GitHub Actions note:** The repo contains `.github/workflows/deploy.yml` which is used for GitHub Pages deployment. Cloudflare Pages has its own build pipeline and ignores this file — you can leave it in place.

---

## 2. Customise for the Client

Make the following changes locally on a working branch, then push to the client repo.

### 2a. Update CMS backend config

Open `src/pages/it/admin/config.yml.ts` and update the `repo` field. Leave `base_url` as a placeholder for now — it will be set in step 8d after the OAuth worker is deployed.

```typescript
const yaml = `backend:
  name: github
  repo: mfattoru/<client-name>         // ← update this
  branch: master
  base_url: https://PLACEHOLDER        // ← update in step 8d
```

### 2b. Update robots.txt

Open `public/robots.txt` and update the sitemap URL:

```
Sitemap: https://<client-domain>/sitemap-index.xml
```

> ⚠️ You'll need the domain name to complete this step. If you haven't bought it yet (Step 5), come back and update this after completing Step 5.

### 2c. Prefill site settings

Open `src/content/site-settings/general.md` and fill in the client's details:

```yaml
---
cvFile: ''
theme: steel
showThemeSwitcher: true
siteLanguage: it
email: client@example.com
phone: +39 000-0000-0000
phoneMobile: +39 333-00-00-000
address: Via Example 1, 00000, Città (XX)
vatNumber: '00000000000'
hoursIt: 'Lun - Sab: 8:00 - 19:00'
hoursEn: 'Mon - Sat: 8AM - 7PM'
linkedinUrl: ''
---
```

Commit and push:

```bash
git add src/pages/it/admin/config.yml.ts public/robots.txt src/content/site-settings/general.md
git commit -m "chore: configure for <client-name>"
git push origin master
```

---

## 3. Cloudinary Setup

1. Sign up at **cloudinary.com** (free tier: 25 GB storage, 25 GB bandwidth/month).
2. From the dashboard, note your **Cloud Name** and **API Key**.
3. Create an unsigned upload preset:
   - Dashboard → **Settings → Upload → Upload presets → Add upload preset**
   - Set **Signing mode** to **Unsigned**
   - Optionally restrict allowed formats (`jpg,png,webp`) and max file size
   - Save and copy the **Preset name**
4. Note your **API Secret** from Dashboard → Settings → API Keys — you will need it in step 7 (cache worker secrets). Never put it in frontend code or environment variables visible to the browser.

---

## 4. Cloudflare Account

Create a free account at **cloudflare.com** if you do not already have one. Everything in steps 5–9 is managed from the same account.

---

## 5. Get the Client Domain

Cloudflare supports a limited set of TLDs. **`.it` domains cannot be purchased through Cloudflare.** Choose the appropriate path:

### Option A — Domain available on Cloudflare (e.g. `.com`, `.eu`, `.net`)

1. Cloudflare Dashboard → **Domain Registration → Register a Domain**
2. Search for and purchase the domain.
3. DNS is automatically managed by Cloudflare — skip to step 6.

### Option B — Domain not available on Cloudflare (e.g. `.it`)

Buy from an external registrar (e.g. **Register.it**, **Namecheap**, **Aruba**, **GoDaddy**), then point DNS management to Cloudflare:

1. Purchase the domain at the registrar of your choice.
2. In the Cloudflare Dashboard → **Add a Site** → enter the domain → select the **Free** plan.
3. Cloudflare scans existing DNS records. Review and confirm them.
4. Cloudflare gives you **two nameserver addresses** (e.g. `ada.ns.cloudflare.com`, `bob.ns.cloudflare.com`). Copy both.
5. At your registrar's control panel, replace the existing nameservers with the two Cloudflare ones (see GoDaddy instructions below).
6. Wait for propagation — typically 15 minutes to a few hours. Cloudflare will email you when the domain is active.

Once active, Cloudflare manages DNS for the domain and the rest of the setup (CF Pages custom domain, SSL) works identically to Option A.

#### GoDaddy — how to update nameservers

1. Log in to **godaddy.com → My Products → Domains**
2. Click **Manage** next to the domain
3. Scroll to the **Nameservers** section → click **Change**
4. Select **Enter my own nameservers (advanced)**
5. Delete the existing entries and add the two nameservers Cloudflare gave you in step 4
6. Click **Save** — GoDaddy will warn that incorrect nameservers can break the domain; confirm
7. Propagation typically completes in under an hour for GoDaddy domains

---

## 6. Deploy to Cloudflare Pages

### 6a. Connect the repository

1. Cloudflare Dashboard → **Workers & Pages → Create → Pages → Connect to Git**
2. Authorise Cloudflare to access your GitHub account and select the `mfattoru/<client-name>` repository.

### 6b. Configure the build

| Setting | Value |
|---|---|
| Framework preset | Astro |
| Build command | `npm run build` |
| Build output directory | `dist` |

### 6c. Add environment variables

Before deploying, add these under **Environment variables (production)**:

| Variable | Value |
|---|---|
| `CLOUDINARY_CLOUD_NAME` | your Cloudinary cloud name (e.g. `abc123xyz`) |
| `CLOUDINARY_API_KEY` | your Cloudinary API key |
| `CLOUDINARY_UPLOAD_PRESET` | your unsigned preset name |
| `CLOUDINARY_CACHE_WORKER_URL` | leave empty for now — set after step 7 |

Click **Save and Deploy**. The first deploy will succeed without the cache worker URL; you will add it and redeploy in step 7.

### 6d. Add the custom domain

After the first deploy completes:

1. Pages project → **Settings → Custom Domains → Set up a custom domain**
2. Enter the domain purchased in step 5.
3. Because the domain is registered through Cloudflare, DNS records are configured automatically.
4. Cloudflare provisions a free SSL certificate — the site will be available at `https://<client-domain>` within a few minutes.

---

## 7. Deploy Cache Invalidation Worker

This worker signs Cloudinary cache-invalidation requests server-side so the API secret never appears in browser code. It powers the admin page at `/it/admin/cache`.

### 7a. Deploy the worker

```bash
cd cloudflare-workers
npx wrangler deploy cloudinary-invalidate.js --name <client-name>-cloudinary-cache
```

The worker URL appears in the deployment output (look for a line starting with `https://`) and in the Cloudflare dashboard → Workers & Pages → your worker → Triggers.

### 7b. Add worker secrets

Run once per secret — wrangler will prompt for the value:

```bash
npx wrangler secret put CLOUDINARY_CLOUD_NAME --name <client-name>-cloudinary-cache
npx wrangler secret put CLOUDINARY_API_KEY    --name <client-name>-cloudinary-cache
npx wrangler secret put CLOUDINARY_API_SECRET --name <client-name>-cloudinary-cache
```

| Secret | Value |
|---|---|
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret (from Dashboard → Settings → API Keys) |

### 7c. Set the worker URL in Cloudflare Pages

> **Note:** `<subdomain>` is automatically assigned by Cloudflare Workers. It appears in the Cloudflare dashboard under **Workers & Pages → your worker → Triggers** tab, or in the output after running `wrangler deploy`. Copy it from there when constructing worker URLs.

1. Note the deployed worker URL: `https://<client-name>-cloudinary-cache.<subdomain>.workers.dev`
2. Cloudflare Pages project → **Settings → Environment variables → Edit**
3. Set `CLOUDINARY_CACHE_WORKER_URL` to the worker URL.
4. Click **Save** then **Create new deployment** to trigger a redeploy with the updated variable.

> If `CLOUDINARY_CACHE_WORKER_URL` is empty or wrong, the cache invalidation page will POST to an incorrect URL and return a 405 error.

---

## 8. Deploy CMS Auth Worker (GitHub OAuth Proxy)

Sveltia CMS uses GitHub as a backend. GitHub's token endpoint does not support CORS, so a Cloudflare Worker acts as a server-side OAuth proxy. This is required even for static sites.

### 8a. Deploy the worker

1. Go to **github.com/sveltia/sveltia-cms-auth** and click **Deploy with Workers**.
2. Sign in to Cloudflare and name the worker `<client-name>-cms-auth`.
3. Click **Deploy**.
4. Note the worker URL: `https://<client-name>-cms-auth.<subdomain>.workers.dev`
   — the worker URL appears in the deployment output and in the Cloudflare dashboard → Workers & Pages → your worker → Triggers.

### 8b. Create a GitHub OAuth App

1. **github.com → Settings → Developer settings → OAuth Apps → New OAuth App**
2. Fill in:
   - **Application name**: anything descriptive (e.g. `<Client Name> Admin`) — `<Client Name>` here is a human-readable name, e.g. `"Rossi Engineering Admin"`, not the URL slug `<client-name>`
   - **Homepage URL**: `https://<client-domain>`
   - **Authorization callback URL**: `https://<client-name>-cms-auth.<subdomain>.workers.dev/callback`
     — this must point to the **Cloudflare Worker**, not the CMS page
3. Click **Register application**, then copy the **Client ID** and generate a **Client Secret**.

### 8c. Add worker secrets

In the Cloudflare Dashboard: Worker → **Settings → Variables → Secrets**, add:

| Secret | Value |
|---|---|
| `GITHUB_CLIENT_ID` | GitHub OAuth App client ID |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth App client secret |
| `ALLOWED_DOMAINS` | `<client-domain>` — the custom domain, **not** the `.pages.dev` subdomain |

### 8d. Update CMS config and redeploy

Open `src/pages/it/admin/config.yml.ts` and set `base_url` to the worker URL from step 8a:

```typescript
const yaml = `backend:
  name: github
  repo: mfattoru/<client-name>
  branch: master
  base_url: https://<client-name>-cms-auth.<subdomain>.workers.dev
```

> Do **not** include `/callback` in `base_url` — the CMS appends that suffix automatically for the OAuth redirect.

Commit and push:

```bash
git add src/pages/it/admin/config.yml.ts
git commit -m "chore: set CMS auth worker URL"
git push origin master
```

Cloudflare Pages detects the push and redeploys automatically.

---

## 9. Cloudflare Web Analytics

1. Cloudflare Dashboard → **Web Analytics → Add a site**
2. Enter the client's custom domain and click **Done**.
3. Copy the **analytics token** (the value from the `data-cf-beacon` script tag shown on screen).
4. In the CMS: **Admin → ⚙️ Impostazioni Sito → Generali → Cloudflare Analytics Token** → paste the token → Save.
5. The CMS commit triggers a redeploy; after it completes, verify the `cloudflareinsights.com` script appears in the page source.

> Analytics data appears in the Cloudflare dashboard within approximately 24 hours of the first visit.

---

## 10. Formspree (Contact Forms)

1. Sign up at **formspree.io**.
2. Click **+ New Form**, give it a name (e.g. `Contact — <Client Name>`), and set the notification email to the client's address.
3. Copy the **Form ID** — the 8-character code after `/f/` in the form's endpoint URL (e.g. `mlgobndz`).
4. In the CMS: **Admin → ⚙️ Impostazioni Sito → Generali → Formspree ID** → paste the ID → Save.

All four forms (contact IT/EN, quote IT/EN) share the same ID automatically. If you need separate routing per form, hardcode individual IDs in `contatti.astro`, `contact.astro`, `preventivo.astro`, and `quote.astro`.

---

## 11. First Deploy Verification Checklist

- [ ] Site loads at `https://<client-domain>` with a valid SSL certificate
- [ ] `/it/admin/` loads the Sveltia CMS interface
- [ ] CMS login completes successfully (GitHub OAuth flow)
- [ ] Image upload works in the CMS media picker
- [ ] Cache invalidation at `/it/admin/cache` works without a 405 error
- [ ] Contact form on the live site delivers email to the client's inbox
- [ ] Cloudflare Analytics token is set and the `cloudflareinsights.com` script appears in page source
- [ ] Analytics data appears in the Cloudflare dashboard (allow ~24 hours)

---

## Pulling Future Updates from the Base Repo

When `mfattoru/mfattoru.github.io` (your base/template repo) receives improvements, pull them into the client repo:

```bash
# In the client repo working directory
# First time only — add the base repo as an upstream remote
git remote add upstream https://github.com/mfattoru/mfattoru.github.io.git

# Pull updates
git fetch upstream
git merge upstream/master
```

Resolve any conflicts — the most likely conflict is `src/pages/it/admin/config.yml.ts` (because `repo` and `base_url` differ per client). Keep the client-specific values. Then push:

```bash
git push origin master
```

---

## Reference

- `docs/SETUP.md` — GitHub Pages deployment path (authentication, Cloudinary, Formspree, local dev)
- `docs/INFRASTRUCTURE.md` — full overview of all external services and where to manage them
- `cloudflare-workers/cloudinary-invalidate.js` — source for the cache invalidation worker
- `github.com/sveltia/sveltia-cms-auth` — source for the OAuth proxy worker
