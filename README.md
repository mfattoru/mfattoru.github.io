# mfattoru.github.io

Personal website and portfolio for Ing. Onofrio Fattoruso — Engineering Solutions.

Built with **Astro 4**, **Tailwind CSS**, and **Sveltia CMS**. Deployed to **GitHub Pages** via GitHub Actions.

---

## Quick start

```bash
make install   # install dependencies (first time only)
make dev       # dev server at http://localhost:4321/it/
make cms       # dev server + CMS admin at http://localhost:4321/it/admin/
make build     # production build → dist/
make deploy    # build + push to master (triggers auto-deploy)
```

---

## Project structure

```
src/
  pages/          # Astro pages (IT + EN routes)
  content/        # CMS-managed content (news, projects, solutions)
  components/     # Reusable Astro components
  layouts/        # Page layouts
  i18n/           # Translation strings
  styles/         # Global CSS and theme variables
  assets/         # Static assets processed by Astro (logo, etc.)
public/
  image/          # CMS-uploaded images (committed to repo)
docs/
  SETUP.md        # Full setup guide (GitHub Pages, CMS, Cloudinary)
  SETUP-GODADDY.md  # Migration guide for GoDaddy hosting
  INFRASTRUCTURE.md # All external services and credentials map
  BACKLOG.md      # Open and completed feature backlog
```

---

## Content management

The admin panel is at `/it/admin/`. Log in with your GitHub account.

- **News** — articles with IT/EN bilingual fields (EN auto-translated on save)
- **Projects** — portfolio entries with gallery, category, and metadata
- **Services** — solution pages with icon, description, and markdown body
- **Site settings** — CV file upload

---

## Docs

| Document | Description |
|---|---|
| [SETUP.md](docs/SETUP.md) | How to reproduce the full setup on a new account |
| [INFRASTRUCTURE.md](docs/INFRASTRUCTURE.md) | External services, credentials, and architecture |
| [SETUP-GODADDY.md](docs/SETUP-GODADDY.md) | Migration guide for GoDaddy hosting |
| [BACKLOG.md](docs/BACKLOG.md) | Feature backlog and completed work |
