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

## 3. Admin Panel — Decap CMS (GitHub OAuth)

The admin panel at `/it/admin/` uses Decap CMS with GitHub as the backend. Authentication uses PKCE (no server required).

### 3a. Create a GitHub OAuth App

1. Go to **github.com → Settings → Developer settings → OAuth Apps → New OAuth App**
2. Fill in:
   - **Application name**: anything (e.g. `Fattoruso Admin`)
   - **Homepage URL**: `https://<username>.github.io`
   - **Authorization callback URL**: `https://<username>.github.io/it/admin/`
   - ⚠️ GitHub OAuth Apps allow only **one** callback URL. For local dev, use the `local_backend` (see section 6).
3. Click **Register application**.
4. On the next page, copy the **Client ID**.

### 3b. Update the CMS config

Open `src/pages/it/admin/config.yml.ts` and update:

```typescript
backend:
  name: github
  repo: <username>/<username>.github.io   // ← update this
  branch: master
  auth_type: pkce
  app_id: <YOUR_CLIENT_ID>               // ← paste Client ID here
```

> **Note:** With `auth_type: pkce` you do **not** need a Client Secret. The Client ID alone is safe to commit — it only works for the registered callback URL.

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

## 5. Git History — Removing Accidentally Committed Secrets

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

## 6. Local Development

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
make cms       # site + Decap local backend at http://localhost:4321/it/admin/
```

`make cms` starts `decap-server` on port 8081, which lets the admin panel read/write local files without GitHub OAuth. The admin page automatically detects `localhost` and activates `local_backend`.

### 6c. Available commands

| Command | Description |
|---|---|
| `make install` | Install dependencies |
| `make dev` | Start dev server |
| `make cms` | Start dev server + Decap local backend |
| `make build` | Production build (output in `dist/`) |
| `make preview` | Preview production build locally |
| `make clean` | Remove `dist/` |

---

## 7. Summary of What Lives Where

| Thing | Where |
|---|---|
| Site source | `src/` |
| Admin panel page | `src/pages/it/admin/index.astro` |
| CMS config (generated) | `src/pages/it/admin/config.yml.ts` |
| News articles | `src/content/news/*.md` |
| Projects | `src/content/projects/*.md` |
| Uploaded images (git) | `public/image/uploads/` |
| Project photos (git) | `public/projects/<id>/photos/` |
| Deploy workflow | `.github/workflows/deploy.yml` |
| Cloudinary credentials | GitHub Actions secrets (never in repo) |
| OAuth Client ID | `src/pages/it/admin/config.yml.ts` (safe to commit) |
