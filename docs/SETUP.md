# Deployment & Integration Setup Guide

Complete guide to reproduce the full setup on a new GitHub account or repository.

---

## 1. GitHub Repository

1. Create a new repository named `<username>.github.io` (must match your GitHub username exactly for the free Pages domain).
2. Push the codebase to the `master` branch.
3. Go to **Settings → Pages**:
   - Source: **GitHub Actions**
   - This is required — the workflow in `.github/workflows/deploy.yml` handles building and deploying.

---

## 2. GitHub Pages — First Deploy

After setting the Pages source, push any commit to `master`. GitHub Actions will:
1. Install dependencies (`npm ci`)
2. Build the Astro site (`npm run build`)
3. Deploy `dist/` to GitHub Pages

The site will be live at `https://<username>.github.io` within a few minutes.

---

## 3. Admin Panel — Sveltia CMS (GitHub OAuth via Cloudflare Worker)

The admin panel at `/it/admin/` uses **Sveltia CMS** with GitHub as the backend. Authentication requires a Cloudflare Worker as an OAuth proxy (GitHub's token endpoint does not support CORS, so a server-side middleman is unavoidable for static sites).

### 3a. Deploy the OAuth proxy (Cloudflare Worker)

1. Go to **github.com/sveltia/sveltia-cms-auth** and click **Deploy with Workers**.
2. Sign in to Cloudflare (free account is sufficient) and give the worker a name (e.g. `my-cms-auth`).
3. Click **Deploy**.
4. In the worker's **Settings → Variables → Secrets**, add:

| Secret name | Value |
|---|---|
| `GITHUB_CLIENT_ID` | your OAuth App's Client ID (see step 3b) |
| `GITHUB_CLIENT_SECRET` | your OAuth App's Client Secret |
| `ALLOWED_DOMAINS` | `<username>.github.io` |

5. Note the worker URL: `https://<worker-name>.<subdomain>.workers.dev`

### 3b. Create a GitHub OAuth App

1. Go to **github.com → Settings → Developer settings → OAuth Apps → New OAuth App**
2. Fill in:
   - **Application name**: anything (e.g. `Fattoruso Admin`)
   - **Homepage URL**: `https://<username>.github.io`
   - **Authorization callback URL**: `https://<worker-name>.<subdomain>.workers.dev/callback`
     ⚠️ This must point to the **Cloudflare Worker**, not the CMS page.
3. Click **Register application**.
4. Copy the **Client ID** and generate a **Client Secret**.
5. Add both to the Cloudflare Worker secrets (step 3a).

### 3c. Update `robots.txt`

Open `public/robots.txt` and update the sitemap URL to match your domain:

```
Sitemap: https://<username>.github.io/sitemap-index.xml
```

### 3d. Update the CMS config

Open `src/pages/it/admin/config.yml.ts` and update `base_url`:

```typescript
backend:
  name: github
  repo: <username>/<username>.github.io   // ← update this
  branch: master
  base_url: https://<worker-name>.<subdomain>.workers.dev
```

> **Note:** The `base_url` must NOT include `/callback` — that suffix is appended automatically by the CMS for the OAuth redirect.

---

## 4. Cloudinary — Multi-image Gallery Upload

Cloudinary provides the media picker that allows selecting multiple photos at once for project galleries.

### 4a. Create a Cloudinary account

1. Sign up at **cloudinary.com** (free tier: 25 GB storage, 25 GB bandwidth/month).
2. From the dashboard, note your **Cloud Name** and **API Key**.
   - ⚠️ Never use the **API Secret** in frontend code — it stays on Cloudinary's side.

### 4b. Create an unsigned upload preset

1. Cloudinary dashboard → **Settings** → **Upload**
2. Scroll to **Upload presets** → **Add upload preset**
3. Set **Signing mode** to **Unsigned**
4. Optionally restrict: allowed formats (`jpg,png,webp`), max file size
5. Save and copy the **Preset name**

### 4c. Add GitHub Actions secrets

Go to your GitHub repo → **Settings → Secrets and variables → Actions → New repository secret** and add:

| Secret name | Value |
|---|---|
| `CLOUDINARY_CLOUD_NAME` | your cloud name (e.g. `abc123xyz`) |
| `CLOUDINARY_API_KEY` | your API key (e.g. `479373179279441`) |
| `CLOUDINARY_UPLOAD_PRESET` | your unsigned preset name |

These are injected at build time into `dist/it/admin/config.yml` — they never appear in the repository.

---

## 5. CDN Cache Invalidation Worker

The admin page at `/it/admin/cache` lets you invalidate Cloudinary CDN cache for any site image. It requires a Cloudflare Worker to sign requests with the API secret (which must never be in browser code).

### 5a. Deploy the worker via wrangler

```bash
cd cloudflare-workers
npx wrangler deploy cloudinary-invalidate.js --name onofrio-cloudinary-cache
```

### 5b. Add worker secrets

Via wrangler (run once per secret):

```bash
npx wrangler secret put CLOUDINARY_CLOUD_NAME --name onofrio-cloudinary-cache
npx wrangler secret put CLOUDINARY_API_KEY    --name onofrio-cloudinary-cache
npx wrangler secret put CLOUDINARY_API_SECRET --name onofrio-cloudinary-cache
```

Or via the dashboard: Worker → **Settings → Variables → Secrets**.

| Secret name | Value |
|---|---|
| `CLOUDINARY_CLOUD_NAME` | your Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | your Cloudinary API key |
| `CLOUDINARY_API_SECRET` | your Cloudinary API secret — from cloudinary.com → Settings → API Keys |

### 5c. Add the worker URL as a GitHub Actions secret

Go to your repo → **Settings → Secrets and variables → Actions → New repository secret**:

| Secret name | Value |
|---|---|
| `CLOUDINARY_CACHE_WORKER_URL` | `https://onofrio-cloudinary-cache.<subdomain>.workers.dev` |

This URL is injected at build time into the admin cache page so it knows where to call.

### 5d. Local `.env`

Add the same URL to your `.env` for local development:

```
CLOUDINARY_CACHE_WORKER_URL=https://onofrio-cloudinary-cache.<subdomain>.workers.dev
```

---

## 6. Git History — Removing Accidentally Committed Secrets

If credentials were ever committed to git, remove them from history:

```bash
# Install git-filter-repo
pip install git-filter-repo

# Remove the file from all history
git filter-repo --path public/it/admin/config.yml --invert-paths

# Force-push (coordinate with anyone who has cloned the repo)
git push origin --force --all
```

After this, rotate the exposed credentials immediately (revoke and create new ones).

---

## 7. Local Development

### 6a. Environment variables

Create a `.env` file in the repo root (already gitignored):

```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_UPLOAD_PRESET=your_preset_name
```

Astro reads `.env` automatically in dev mode.

### 6b. Running the dev server

```bash
make install   # first time only — installs node_modules
make dev       # site at http://localhost:4321/it/
make cms       # alias for make dev — see note below
```

Sveltia CMS uses the browser's **File System Access API** for local development — no proxy server is needed.

To edit content locally:
1. Run `make cms` (starts the Astro dev server)
2. Open `http://localhost:4321/it/admin/` in **Chrome or another Chromium-based browser** (Firefox is not supported — File System Access API is Chromium-only)
3. Click **"Work with Local Repository"** and select the project root folder
4. The CMS will read and write files directly on disk; commit changes manually with `git`

### 6c. Available commands

| Command | Description |
|---|---|
| `make install` | Install dependencies |
| `make dev` | Start dev server |
| `make cms` | Start dev server (use with "Work with Local Repository" in Chrome) |
| `make build` | Production build (output in `dist/`) |
| `make preview` | Preview production build locally |
| `make clean` | Remove `dist/` |

---

## 8. Summary of What Lives Where

| Thing | Where |
|---|---|
| Site source | `src/` |
| Admin panel page | `src/pages/it/admin/index.astro` |
| CMS config (generated) | `src/pages/it/admin/config.yml.ts` |
| News articles | `src/content/news/*.md` |
| Projects | `src/content/projects/*.md` |
| Solutions | `src/content/solutions/*.md` |
| Images | `public/image/` |
| Deploy workflow | `.github/workflows/deploy.yml` |
| Cloudinary credentials | GitHub Actions secrets (never in repo) |
| OAuth proxy | Cloudflare Worker (`sveltia-cms-auth`) |
| OAuth Worker URL | `src/pages/it/admin/config.yml.ts` (`base_url`) |
| Cache invalidation page | `src/pages/it/admin/cache.astro` |
| Cache invalidation worker | `cloudflare-workers/cloudinary-invalidate.js` |
| Cache Worker URL | GitHub Actions secret `CLOUDINARY_CACHE_WORKER_URL` |
