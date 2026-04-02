## Website & Admin Panel Backlog

Always update this file after completing a task. Keep not completed tasks at top and completed tasks at the bottom. Give unique ID at each task so i can directly point at each one i need to work


### To Add to backlog (Don't remove this section)
- build
  Node.js 20 actions are deprecated. The following actions are running on Node.js 20 and may not work as expected: actions/checkout@v4, actions/configure-pages@v5, actions/setup-node@v4, actions/upload-artifact@v4. Actions will be forced to run with Node.js 24 by default starting June 2nd, 2026. Node.js 20 will be removed from the runner on September 16th, 2026. Please check if updated versions of these actions are available that support Node.js 24. To opt into Node.js 24 now, set the FORCE_JAVASCRIPT_ACTIONS_TO_NODE24=true environment variable on the runner or in your workflow file. Once Node.js 24 becomes the default, you can temporarily opt out by setting ACTIONS_ALLOW_USE_UNSECURE_NODE_VERSION=true. For more information see: https://github.blog/changelog/2025-09-19-deprecation-of-node-20-on-github-actions-runners/
- deploy
  Node.js 20 actions are deprecated. The following actions are running on Node.js 20 and may not work as expected: actions/deploy-pages@v4. Actions will be forced to run with Node.js 24 by default starting June 2nd, 2026. Node.js 20 will be removed from the runner on September 16th, 2026. Please check if updated versions of these actions are available that support Node.js 24. To opt into Node.js 24 now, set the FORCE_JAVASCRIPT_ACTIONS_TO_NODE24=true environment variable on the runner or in your workflow file. Once Node.js 24 becomes the default, you can temporarily opt out by setting ACTIONS_ALLOW_USE_UNSECURE_NODE_VERSION=true. For more information see: https://github.blog/changelog/2025-09-19-deprecation-of-node-20-on-github-actions-runners/
### Open

| ID | Task |
|----|------|
| B-11 | **CI/CD — Node.js 24 upgrade** — GitHub Actions runners will drop Node.js 20 on Sep 16 2026. Upgrade `actions/checkout`, `actions/configure-pages`, `actions/setup-node`, `actions/upload-artifact`, `actions/deploy-pages` to versions that support Node.js 24. Deadline: before June 2 2026 (forced default switch). |

---

### Completed

| ID | Task | Notes |
|----|------|-------|
| C-01 | **Image Optimization** | `loading="lazy" decoding="async"` on all CMS images; `eager` on hero images. |
| C-02 | **Language Toggle Fix** | IT label was never a link — both IT↔EN directions now work. |
| C-03 | **CV Preview** | Inline PDF iframe on the about page. |
| C-04 | **CV Download Button** | Removed — preview only. |
| C-05 | **CV Upload via Admin** | `site-settings` CMS collection; uploading a new PDF updates the about page at next deploy. |
| C-06 | **Accessibility** | High-contrast theme added; A-/A+ font size controls in nav. |
| C-07 | **Dynamic Services Management** | `solutions-it` + `solutions-en` merged into single bilingual `solutions` collection. English fields auto-translated on save if left empty. |
| C-08 | **Authentication Fix** | Migrated from Netlify OAuth to GitHub PKCE. |
| C-09 | **New Solutions Page** | `/en/solutions` and `/it/soluzioni` index pages with full service grid. |
| C-10 | **Solutions in Nav** | Soluzioni/Solutions link added to desktop and mobile nav. |
| C-11 | **Rich Text Rendering** | `white-space: pre-line` on project summary, description, and result fields. |
| C-12 | **Visual Identity: Stats Strip** | Key numbers (10+ years, 9+ services, etc.) added between hero and services on homepage. |
| C-13 | **Visual Identity: Recent Projects** | 3 most recent projects shown on homepage. |
| C-14 | **Visual Identity: High Contrast Theme** | Black/white/yellow accessibility theme added to theme switcher. |
| C-15 | **Our Services Link Fix** | Homepage CTA now points to solutions list, not a single service. |
| C-16 | **Solutions Index Cards — Images** | Cards on `/it/soluzioni` and `/en/solutions` now show cover image when present; emoji shown only when no image. |
| C-17 | **Homepage ServiceCard — Emoji/Image** | Emoji icon hidden when a card has an image. |
| C-18 | **Project List Category Filter** | Filter buttons by category on `/it/progetti` and `/en/projects`; client-side JS show/hide. |
| C-19 | **Contact Form — Multiselect Services** | `<select>` replaced with checkbox list; multiple services can now be selected and submitted. |
| C-20 | **Image Component** | All static `<img>` tags replaced with Astro `<Image>` component for automatic format optimization and layout-shift prevention. Main carousel image kept as `<img>` (src swapped by JS). |
| B-03 | **Theme Configuration** | `theme` field added to site-settings CMS collection. `Base.astro` reads `defaultTheme` and sets `data-default-theme` on `<html>`; inline anti-flash script and ThemeSwitcher both use it as fallback. |
| B-04 | **Visual Identity: Themes** | All 9 themes revised with distinctive palettes. `--logo-filter` CSS variable added per theme (dark themes: white logo; light themes: black logo). Nav updated to use `var(--logo-filter)`. |
| B-05 | **Visual Identity: Typography** | Google Fonts updated to Space Grotesk (headings) + Inter (body). `section-title` / `section-subtitle` utility classes refined; heading letter-spacing tightened. |
| B-10 | **Admin Panel — Full Page Content Editor** | `page-content` Astro collection with `about.md`, `pricing.md`, `homepage.md`. CMS `📄 Contenuto Pagine` files collection. All About, Pricing, and Homepage stats wired to content files. Auto-translation on save for IT→EN fields. |
| B-01 | **Content Guidelines** | Added `hint` text with recommended dimensions to all image fields in the CMS (news cover: 1200×480px, project thumbnail: 1200×800px, gallery: 1600×1067px, service cover: 1200×800px). |
| B-07 | **Admin Panel — Extended Site Settings** | Email, phone, mobile, address, VAT, hours (IT/EN), LinkedIn URL added to `site-settings` schema and CMS. Footer, Contact, and Careers pages now read from CMS instead of i18n JSON. |
| B-09 | **Performance — Eager Loading Above the Fold** | Headshot on chi-siamo/about gets `loading="eager" fetchpriority="high"`. First news card image on IT/EN list pages also eager-loaded. |
| B-06 | **Admin Panel — Bilingual Field UX** | 🇮🇹/🇬🇧 flag emoji prefixes on all bilingual field labels across news, projects, solutions, page-content, and site-settings collections. |
| B-08 | **Admin Panel — Language Display Mode** | `siteLanguage` field in site-settings (both/it/en). CMS config endpoint reads it at request time and hides unused language fields. Auto-translation disabled when not in `both` mode. |
| B-02 | **Admin Panel — Live Preview** | Custom styled preview templates registered for news, projects, and solutions via `CMS.registerPreviewTemplate`. Preview pane enabled on those three collections; site-settings and page-content keep `preview: false`. |
