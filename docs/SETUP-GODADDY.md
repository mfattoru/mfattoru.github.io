# GoDaddy Hosting Setup Guide

How to migrate from GitHub Pages to GoDaddy shared hosting while keeping GitHub as the code repository and Decap CMS backend.

---

## Overview of what changes vs GitHub Pages

| | GitHub Pages | GoDaddy |
|---|---|---|
| Hosting | GitHub | GoDaddy |
| Deploy method | GitHub Actions → Pages | GitHub Actions → FTP |
| CMS backend | GitHub (unchanged) | GitHub (unchanged) |
| Cloudinary | GitHub Actions secrets (unchanged) | GitHub Actions secrets (unchanged) |
| OAuth callback URL | mfattoru.github.io/it/admin/ | yourdomain.com/it/admin/ |

---

## 1. GoDaddy — Get FTP credentials

You need FTP access to upload files to GoDaddy's web server.

1. Log in to **godaddy.com → My Products → Hosting → Manage**
2. Go to **Settings → FTP** (or **File Manager → FTP Accounts**)
3. Note your:
   - **FTP server**: usually `ftp.yourdomain.com` or an IP address shown in the panel
   - **FTP username**: usually your cPanel username or the primary FTP user
   - **FTP password**: set or reset it here if needed
4. Find your **web root directory** — this is where files need to go. On GoDaddy shared hosting it is typically `/public_html/`. Confirm this in the File Manager.

---

## 2. Add FTP secrets to GitHub Actions

Go to your GitHub repo → **Settings → Secrets and variables → Actions** and add:

| Secret name | Value |
|---|---|
| `FTP_SERVER` | your FTP server address (e.g. `ftp.yourdomain.com`) |
| `FTP_USERNAME` | your FTP username |
| `FTP_PASSWORD` | your FTP password |

These join the existing Cloudinary secrets already there.

---

## 3. Update the deploy workflow

Replace `.github/workflows/deploy.yml` with the following:

```yaml
name: Deploy to GoDaddy

on:
  push:
    branches: [master]
  workflow_dispatch:

concurrency:
  group: deploy
  cancel-in-progress: false

jobs:
  build-and-deploy:
    runs-on: ubuntu-24.04
    permissions:
      contents: read
    steps:
      - name: Checkout
        uses: actions/checkout@v4.2.2

      - name: Setup Node.js
        uses: actions/setup-node@v4.4.0
        with:
          node-version: 22
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Build
        run: npm run build
        env:
          CLOUDINARY_CLOUD_NAME: ${{ secrets.CLOUDINARY_CLOUD_NAME }}
          CLOUDINARY_API_KEY: ${{ secrets.CLOUDINARY_API_KEY }}
          CLOUDINARY_UPLOAD_PRESET: ${{ secrets.CLOUDINARY_UPLOAD_PRESET }}

      - name: Deploy to GoDaddy via FTP
        uses: SamKirkland/FTP-Deploy-Action@v4.3.5
        with:
          server: ${{ secrets.FTP_SERVER }}
          username: ${{ secrets.FTP_USERNAME }}
          password: ${{ secrets.FTP_PASSWORD }}
          local-dir: ./dist/
          server-dir: /public_html/
```

> **Note:** If your site should live in a subdirectory instead of the root, change `server-dir` accordingly, e.g. `/public_html/engineering/`.

---

## 4. Update the site URL in Astro config

Open `astro.config.mjs` and update the `site` field:

```js
export default defineConfig({
  site: 'https://yourdomain.com',   // ← change this
  ...
});
```

This affects sitemaps, canonical URLs, and Open Graph tags.

---

## 5. Update the Cloudflare Worker allowed domain

The CMS uses a Cloudflare Worker (`sveltia-cms-auth`) as an OAuth proxy. The `ALLOWED_DOMAINS` secret must include your new domain.

1. Go to **cloudflare.com → Workers & Pages → your worker → Settings → Variables → Secrets**
2. Update `ALLOWED_DOMAINS` to include both domains (comma-separated) if running in parallel, or replace with the new domain:
   ```
   yourdomain.com
   ```
3. The GitHub OAuth App's **Authorization callback URL** stays pointing at the Cloudflare Worker — it does **not** need to change when you switch hosting domains.

---

## 6. Update the CMS backend repo reference

Open `src/pages/it/admin/config.yml.ts` and verify the backend section points to the right repo:

```typescript
  const yaml = `...
backend:
  name: github
  repo: mfattoru/mfattoru.github.io   // ← must match your GitHub repo
  branch: master
  base_url: https://onofrio-cms-auth.michele-fattoruso.workers.dev
...`;
```

If you moved the repo to a different GitHub account or renamed it, update `repo` accordingly. The `base_url` (Cloudflare Worker) does not need to change.

---

## 7. DNS — point your domain to GoDaddy

If the domain is already registered and hosted on GoDaddy, this is already done.

If you're pointing an external domain to GoDaddy hosting:
1. In your domain registrar, set the nameservers to GoDaddy's:
   - `ns1.domaincontrol.com`
   - `ns2.domaincontrol.com`
2. Or add an **A record** pointing to the IP address of your GoDaddy hosting server (found in GoDaddy Hosting → Server Details).

DNS changes can take up to 24 hours to propagate.

---

## 8. HTTPS on GoDaddy

GoDaddy shared hosting includes a free SSL certificate. Make sure it's active:

1. GoDaddy → Hosting → Manage → **SSL Certificates**
2. If not enabled, activate the free DV (Domain Validation) certificate
3. Enable **Force HTTPS** redirect in the hosting settings if available, or add this to a `.htaccess` file in `public_html/`:

```apacheconf
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

---

## 9. SPA routing — 404 fallback for Astro

Astro generates static files with clean URLs (e.g. `/it/news/` becomes `/it/news/index.html`). Apache on GoDaddy needs to be told to handle these correctly. Add a `.htaccess` file to your `public/` directory so it gets copied into `dist/`:

**`public/.htaccess`**:
```apacheconf
Options -Indexes
RewriteEngine On

# Force HTTPS
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Serve existing files and directories directly
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d

# Try with /index.html suffix
RewriteRule ^(.+[^/])$ /$1/ [R=301,L]
```

---

## 10. Local development — no changes needed

Local dev (`make cms`, `make dev`) is unaffected by the hosting change. It still uses:
- Astro dev server on `localhost:4321`
- `decap-server` on `localhost:8081`
- `.env` file for Cloudinary credentials

---

## Summary checklist

- [ ] Get FTP server, username, password from GoDaddy
- [ ] Add `FTP_SERVER`, `FTP_USERNAME`, `FTP_PASSWORD` to GitHub Actions secrets
- [ ] Replace `.github/workflows/deploy.yml` with the GoDaddy version above
- [ ] Update `site:` in `astro.config.mjs` to your GoDaddy domain
- [ ] Update Cloudflare Worker `ALLOWED_DOMAINS` secret to include your GoDaddy domain
- [ ] Create `public/.htaccess` for Apache routing and HTTPS redirect
- [ ] Confirm SSL is active on GoDaddy
- [ ] Push to `master` — GitHub Actions will build and FTP-deploy automatically
- [ ] Visit `https://yourdomain.com` to confirm the site is live
- [ ] Visit `https://yourdomain.com/it/admin/` to confirm the CMS works
