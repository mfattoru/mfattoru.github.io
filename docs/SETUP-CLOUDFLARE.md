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

4. **GitHub Actions note:** The repo contains `.github/workflows/deploy.yml` which is used for GitHub Pages deployment. Cloudflare Workers has its own build pipeline and ignores this file — you can leave it in place.

---

## 2. Customise for the Client

Make the following changes locally on a working branch, then push to the client repo.

### 2a. Update wrangler.toml

Open `wrangler.toml` at the repo root and set `name` to the client's CF project name (e.g. `<client-name>`). This must match exactly what you create in Cloudflare in step 6.

### 2c. Update CMS backend config

Open `src/pages/it/admin/config.yml.ts` and update the `repo` field. Leave `base_url` as a placeholder for now — it will be set in step 8d after the OAuth worker is deployed.

```typescript
const yaml = `backend:
  name: github
  repo: mfattoru/<client-name>         // ← update this
  branch: master
  base_url: https://PLACEHOLDER        // ← update in step 8d
```

### 2d. Update robots.txt

Open `public/robots.txt` and update the sitemap URL:

```
Sitemap: https://<client-domain>/sitemap-index.xml
```

> ⚠️ You'll need the domain name to complete this step. If you haven't bought it yet (Step 5), come back and update this after completing Step 5.

### 2e. Prefill site settings

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

> **Note on initial content images:** The base codebase's content files may reference images from the developer's Cloudinary account. This is expected — the client will replace all content through the CMS, and new images they upload will go to the client's Cloudinary account automatically. No action needed here.

---

## 4. Cloudflare Account

Create a free account at **cloudflare.com** if you do not already have one. Everything in steps 5–9 is managed from the same account.

> **New accounts — claim your workers.dev subdomain first:** New Cloudflare accounts must activate their workers.dev subdomain before any Worker URLs resolve. Go to **Workers & Pages → Overview** and follow the prompt to choose and claim your subdomain. Without this, Worker URLs return `NXDOMAIN` (not found) even after a successful deployment.

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

Once active, Cloudflare manages DNS for the domain and the rest of the setup (custom domain, SSL) works identically to Option A.

#### GoDaddy — how to update nameservers

1. Log in to **godaddy.com → My Products → Domains**
2. Click **Manage** next to the domain
3. Scroll to the **Nameservers** section → click **Change**
4. Select **Enter my own nameservers (advanced)**
5. Delete the existing entries and add the two nameservers Cloudflare gave you in step 4
6. Click **Save** — GoDaddy will warn that incorrect nameservers can break the domain; confirm
7. Propagation typically completes in under an hour for GoDaddy domains

---

## 6. Deploy the Site (Cloudflare Workers + Static Assets)

> Cloudflare has merged Pages into Workers. Static sites are now deployed as Workers with Static Assets — the result is identical to Pages but uses `npx wrangler deploy` instead of the Pages UI. The Cloudflare Dashboard UI only shows **"Create a Worker"** — there is no separate "Create a Pages project" option.

### 6a. Update wrangler.toml

Open `wrangler.toml` at the repo root and set the `name` to match the client's CF project name:

```toml
name = "<client-name>"
compatibility_date = "2026-04-01"

[assets]
directory = "./dist"
```

Commit and push:

```bash
git add wrangler.toml
git commit -m "chore: set worker name for <client-name>"
git push origin master
```

### 6b. Create the Worker project in Cloudflare

> ⚠️ **UI quirk:** The only option is **"Create a Worker"**. Do not look for a Pages option — it no longer exists separately.

1. Cloudflare Dashboard (client's account) → **Workers & Pages → Create**
2. Choose **Worker** → give it the same name as in `wrangler.toml` (e.g. `<client-name>`)
3. Click **Deploy** on the default Hello World script — this creates the project shell
4. Go to the project → **Settings → Build** → **Connect to Git**
5. Authorise Cloudflare to access GitHub and select `mfattoru/<client-name>`

   > ⚠️ **If you don't see the repo in the list:** The Cloudflare GitHub App may not have access to that specific repository. Go to **GitHub → Settings → Applications → Installed GitHub Apps → Cloudflare Workers → Configure** and add the client repo explicitly.

6. Set build configuration:

| Setting | Value |
|---|---|
| Build command | `npm run build` |
| Deploy command | `npx wrangler deploy` |

> ⚠️ **After connecting Git, pushes to the repo will trigger automatic builds.** The first deployment will appear in the project's Deployments tab. If no deployment appears after pushing, check the GitHub App access (step above).

### 6c. Add environment variables

> ⚠️ **Two separate variable sections exist:** The Worker project has both **runtime** variables (used when the Worker handles requests) and **build-time** variables (injected during `npm run build`). Cloudinary variables are needed at **build time**, so they must be added in **Build → Variables and Secrets** — setting them only in the runtime section will cause build failures.

In the Worker project → **Settings → Build → Variables and Secrets**, add:

| Variable | Value |
|---|---|
| `CLOUDINARY_CLOUD_NAME` | your Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | your Cloudinary API key |
| `CLOUDINARY_UPLOAD_PRESET` | your unsigned preset name |
| `CLOUDINARY_CACHE_WORKER_URL` | leave empty for now — set after step 7 |
| `SITE_URL` | `https://<client-domain>` |

Trigger a deployment — the build will run `npm run build` then `npx wrangler deploy`, publishing the static site.

### 6d. Add the custom domain

After the first successful deployment:

1. Worker project → **Settings → Domains & Routes → Add Custom Domain**
2. Enter the domain from step 5.

> ⚠️ **"This domain is already in use" error:** When you add a domain to your Cloudflare account, it sometimes creates a default parking Worker or DNS record that conflicts with a new Worker project. Fix it by:
> - Going to **DNS → Records** and deleting any `Worker` type CNAME record pointing to the domain
> - Or going to **Workers & Pages** and deleting any pre-existing Worker project with the same domain attached
>
> After removing the conflict, try adding the custom domain again.

3. Cloudflare provisions SSL automatically — the site will be live at `https://<client-domain>` within minutes.

---

## 7. Deploy Cache Invalidation Worker

This worker signs Cloudinary cache-invalidation requests server-side so the API secret never appears in browser code. It powers the admin page at `/it/admin/cache`.

### 7a. Authenticate wrangler with the client's Cloudflare account

The worker must be deployed to the **client's** Cloudflare account, not yours. Authenticate before deploying:

```bash
npx wrangler login
```

This opens a browser — log in with the **client's** Cloudflare credentials. Once authenticated, all subsequent wrangler commands in this session run against their account.

> To switch back to your own account afterwards, run `npx wrangler login` again with your credentials.

### 7b. Deploy the worker

```bash
cd cloudflare-workers
npx wrangler deploy cloudinary-invalidate.js --name <client-name>-cloudinary-cache
```

The worker URL appears in the deployment output (look for a line starting with `https://`) and in the client's Cloudflare dashboard → Workers & Pages → your worker → Triggers.

### 7c. Add worker secrets

Run once per secret — wrangler will prompt for the value:

```bash
npx wrangler secret put CLOUDINARY_CLOUD_NAME --name <client-name>-cloudinary-cache
npx wrangler secret put CLOUDINARY_API_KEY    --name <client-name>-cloudinary-cache
npx wrangler secret put CLOUDINARY_API_SECRET --name <client-name>-cloudinary-cache
npx wrangler secret put ALLOWED_ORIGINS       --name <client-name>-cloudinary-cache
```

| Secret | Value |
|---|---|
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret (from Cloudinary Dashboard → Settings → API Keys) |
| `ALLOWED_ORIGINS` | `https://<client-domain>,http://localhost:4321` |

> ⚠️ **Never add credentials to `wrangler.toml` as `[vars]`:** Values in `[vars]` are deployed as plaintext and **override** any secrets you set via `wrangler secret put`. If you add placeholder values to `[vars]` to document the shape of variables, they will overwrite the real secrets. The `wrangler.toml` in `cloudflare-workers/` contains only comments — keep it that way.

### 7d. Set the worker URL in the main Worker project

> **Note:** `<subdomain>` is automatically assigned by Cloudflare Workers. It appears in the Cloudflare dashboard under **Workers & Pages → your worker → Triggers** tab, or in the output after running `wrangler deploy`. Copy it from there when constructing worker URLs.

1. Note the deployed worker URL: `https://<client-name>-cloudinary-cache.<subdomain>.workers.dev`
2. Main Worker project → **Settings → Build → Variables and Secrets → Edit**
3. Set `CLOUDINARY_CACHE_WORKER_URL` to the worker URL.
4. Click **Save** then trigger a new deployment.

> If `CLOUDINARY_CACHE_WORKER_URL` is empty or wrong, the cache invalidation page will POST to an incorrect URL and return a 405 error.

---

## 8. Deploy CMS Auth Worker (GitHub OAuth Proxy)

Sveltia CMS uses GitHub as a backend. GitHub's token endpoint does not support CORS, so a Cloudflare Worker acts as a server-side OAuth proxy. This is required even for static sites.

### 8a. Deploy the worker

1. Go to **github.com/sveltia/sveltia-cms-auth** and click **Deploy with Workers**.
2. Sign in to Cloudflare with the **client's** Cloudflare account and name the worker `<client-name>-cms-auth`.
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

In the Cloudflare Dashboard: Worker → **Settings → Variables → Secrets**, add **all three**:

| Secret | Value |
|---|---|
| `GITHUB_CLIENT_ID` | GitHub OAuth App client ID |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth App client secret |
| `ALLOWED_DOMAINS` | `<client-domain>` — the custom domain, **not** the `.workers.dev` subdomain |

> ⚠️ **`GITHUB_CLIENT_SECRET` is commonly missed.** If the CMS login shows "OAuth App client ID or secret not configured", the secret is missing or incorrectly named. Check that all three secrets are present in the Worker → Variables → Secrets section.

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

Cloudflare detects the push and redeploys automatically.

---

## 9. Cloudflare Web Analytics

No setup required if the site is proxied through Cloudflare (the default when using a Cloudflare-managed domain). Cloudflare automatically collects **network-level analytics** — visitors, countries, bandwidth, requests — without any beacon script or token.

**To view analytics:** Cloudflare Dashboard → **Analytics & Logs → Traffic**

> **Why you won't find a token:** The `cloudflareAnalyticsToken` setting in the CMS admin exists for sites that are **not** fully proxied through Cloudflare (e.g. DNS-only mode, or external hosting). In that case you would add a JavaScript beacon. For standard Cloudflare-proxied deployments, leave it empty and use the dashboard directly.

> **Data appears ~24 hours after first visit.**

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
- [ ] Analytics data appears in Cloudflare Dashboard → Analytics & Logs → Traffic (allow ~24 hours)

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

## Troubleshooting

### Workers.dev URL returns NXDOMAIN (not found)

New Cloudflare accounts must claim their workers.dev subdomain before Worker URLs resolve.

**Fix:** Go to **Workers & Pages → Overview** and follow the prompt to choose and register your subdomain. This is a one-time step per account.

### Build not triggering after git push

The Cloudflare GitHub App may not have access to the client repo.

**Fix:** GitHub → **Settings → Applications → Installed GitHub Apps → Cloudflare Workers → Configure** → add the client repo to the allowed repositories list.

### Site shows "Hello World" instead of the built site

This happens when the Worker was created from a Dashboard template (deployed Hello World script) and the Git connection wasn't set up correctly, or the first Git-connected build hasn't deployed yet.

**Fix:** Go to the Worker project → **Settings → Build** and verify it is connected to the correct Git repo with the correct build command (`npm run build`) and deploy command (`npx wrangler deploy`). Push a commit to trigger a fresh build.

### "This domain is already in use" when adding a custom domain

Cloudflare creates a default parking record when a domain is first added to the account, which conflicts with the new Worker project.

**Fix:**
1. Go to **DNS → Records** and delete any `Worker` type CNAME record for the domain
2. Or go to **Workers & Pages** and delete any pre-existing Worker project that has this domain attached
3. Retry adding the custom domain to your Worker project

### Site doesn't load but dnschecker.org shows all green

Local DNS cache is stale. The propagation has completed globally but your machine hasn't picked up the new records yet.

**Fix (macOS):**
```bash
sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder
```

### CMS login shows "OAuth App client ID or secret not configured"

One or more secrets are missing from the CMS auth Worker.

**Fix:** Go to the auth Worker → **Settings → Variables → Secrets** and verify all three are present: `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, `ALLOWED_DOMAINS`. The most commonly missed one is `GITHUB_CLIENT_SECRET`.

### Cloudinary variables missing at build time

Build fails with Cloudinary-related errors even though variables are set in the Worker project.

**Fix:** Variables set in the Worker's runtime section are not available during the build step. Add `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_UPLOAD_PRESET`, and `CLOUDINARY_CACHE_WORKER_URL` under **Settings → Build → Variables and Secrets** as well.

### Cache invalidation returns 405 Method Not Allowed

The `CLOUDINARY_CACHE_WORKER_URL` variable is empty or set to an incorrect URL.

**Fix:** Verify the variable is set in **Settings → Build → Variables and Secrets** and points to the correct worker URL (format: `https://<client-name>-cloudinary-cache.<subdomain>.workers.dev`). Trigger a redeploy after updating.

### wrangler deploy warns about `[vars]` overwriting secrets

If `cloudflare-workers/wrangler.toml` contains a `[vars]` section with placeholder values, they will be deployed as plaintext and overwrite any secrets set via `wrangler secret put`.

**Fix:** Remove the entire `[vars]` section from `cloudflare-workers/wrangler.toml`. Credentials belong exclusively in secrets, never in `wrangler.toml`.

---

## Reference

- `docs/SETUP.md` — GitHub Pages deployment path (authentication, Cloudinary, Formspree, local dev)
- `docs/INFRASTRUCTURE.md` — full overview of all external services and where to manage them
- `cloudflare-workers/cloudinary-invalidate.js` — source for the cache invalidation worker
- `github.com/sveltia/sveltia-cms-auth` — source for the OAuth proxy worker
