# Infrastructure Overview

All external services used by this project, what they do, and where to manage them.

---

## Hosting — GitHub Pages

| | |
|---|---|
| **URL** | `https://mfattoru.github.io` |
| **Managed at** | github.com/mfattoru/mfattoru.github.io → Settings → Pages |
| **Deploy trigger** | Push to `master` branch |
| **Build pipeline** | `.github/workflows/deploy.yml` (GitHub Actions) |

The site is a static Astro build. GitHub Actions runs `npm run build`, injects secrets as environment variables, and deploys the `dist/` folder to GitHub Pages automatically on every push to `master`.

---

## Source Code — GitHub Repository

| | |
|---|---|
| **Repo** | github.com/mfattoru/mfattoru.github.io |
| **Main branch** | `master` |
| **Stack** | Astro 4, Tailwind CSS, TypeScript |

---

## CMS — Sveltia CMS

| | |
|---|---|
| **Admin URL** | `https://mfattoru.github.io/it/admin/` |
| **CMS software** | Sveltia CMS (loaded from unpkg CDN) |
| **Backend** | GitHub (commits content directly to the repo) |
| **Config source** | `src/pages/it/admin/config.yml.ts` (generated at build time) |
| **Local dev** | `make cms` then click "Work with Local Repository" in Chrome (uses File System Access API — no proxy needed) |

Content edits made through the CMS create commits on `master`, which automatically trigger a new deploy via GitHub Actions.

---

## CMS Authentication — Cloudflare Worker

| | |
|---|---|
| **Worker name** | `onofrio-cms-auth` |
| **Worker URL** | `https://onofrio-cms-auth.michele-fattoruso.workers.dev` |
| **Source** | github.com/sveltia/sveltia-cms-auth |
| **Managed at** | cloudflare.com → Workers & Pages → `onofrio-cms-auth` |
| **Purpose** | OAuth proxy — handles the GitHub token exchange that browsers cannot do directly (CORS restriction) |

### Worker secrets

| Secret | Description |
|---|---|
| `GITHUB_CLIENT_ID` | GitHub OAuth App client ID |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth App client secret |
| `ALLOWED_DOMAINS` | `mfattoru.github.io` — only this domain can use the proxy |

---

## GitHub OAuth App

| | |
|---|---|
| **Managed at** | github.com → Settings → Developer settings → OAuth Apps |
| **App name** | Fattoruso Admin (or similar) |
| **Homepage URL** | `https://mfattoru.github.io` |
| **Callback URL** | `https://onofrio-cms-auth.michele-fattoruso.workers.dev/callback` |

The callback URL points to the Cloudflare Worker, not the CMS page. The worker exchanges the OAuth code for a GitHub token and passes it back to the CMS.

---

## Media — Cloudinary (optional)

| | |
|---|---|
| **Purpose** | Multi-image picker for project galleries in the CMS |
| **Managed at** | cloudinary.com |
| **Credentials stored** | GitHub Actions secrets (never in the repo) |
| **Active in** | Production builds only (disabled in local dev) |

### GitHub Actions secrets

| Secret | Description |
|---|---|
| `CLOUDINARY_CLOUD_NAME` | Cloud name from Cloudinary dashboard |
| `CLOUDINARY_API_KEY` | API key (public — safe to use in frontend) |
| `CLOUDINARY_UPLOAD_PRESET` | Unsigned upload preset name |

Manage at: github.com/mfattoru/mfattoru.github.io → Settings → Secrets and variables → Actions

---

## Domain — GoDaddy (optional migration path)

Not currently active. See `docs/SETUP-GODADDY.md` for the full migration guide if the site moves from GitHub Pages to a custom domain on GoDaddy hosting.

---

## Summary

```
Browser
  └─► GitHub Pages (static site)
        └─► GitHub Actions (builds & deploys on push to master)

CMS Admin (browser)
  └─► Sveltia CMS (CDN script)
        └─► Cloudflare Worker (OAuth proxy)
              └─► GitHub OAuth App
                    └─► GitHub API (read/write repo content)

CMS Media Upload (browser)
  └─► Cloudinary (direct unsigned upload)
```
