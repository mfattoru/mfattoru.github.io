## Website & Admin Panel Backlog

Always update this file after completing a task. Keep not completed tasks at top and completed tasks at the bottom. Give unique ID at each task so i can directly point at each one i need to work

### Open

| ID | Task |
|----|------|
| B-01 | **Content Guidelines** — Add recommended image sizes within the admin panel for optimal display. |
| B-02 | **Live Preview** — Update the admin page preview to show a 1:1 representation of the live website rather than a raw data blob. |
| B-06 | **Admin Panel — Bilingual Field UX** — Clearly distinguish IT vs EN fields in content creation forms (flag icons, grouping, color coding). IT and EN fields should never share content. |
| B-07 | **Admin Panel — Extended Site Settings** — Add common admin panel options to the Impostazioni section (social links, contact info, etc.). |
| B-08 | **Admin Panel — Language Display Mode** — Setting to choose site language (IT only, EN only, or both). Controls: field visibility in content forms (hide unused language fields), auto-translation toggle (disabled for single-language), and auto-translate only populates empty fields to avoid overwriting manual content. |
| B-09 | **Performance — Eager Loading Above the Fold** — News list page hero and chi-siamo headshot are above the fold but use `loading="lazy"`. Switch them to `loading="eager"` (or `fetchpriority="high"`) to improve LCP. |
| B-10 | **Admin Panel — Full Page Content Editor** — Extend the admin panel to allow editing all hardcoded page content (about page bio, homepage tagline, pricing copy, etc.). Currently only news and projects are editable; static pages require a code deploy to update. |

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
