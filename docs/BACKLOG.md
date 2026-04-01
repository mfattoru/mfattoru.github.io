## Website & Admin Panel Backlog

Always update this file after completing a task. Keep not completed tasks at top and completed tasks at the bottom. Give unique ID at each task so i can directly point at each one i need to work

### Open

| ID | Task |
|----|------|
| B-01 | **Content Guidelines** — Add recommended image sizes within the admin panel for optimal display. |
| B-02 | **Live Preview** — Update the admin page preview to show a 1:1 representation of the live website rather than a raw data blob. |
| B-03 | **Theme Configuration** — Move theme selection to the admin panel to allow the admin to set a global site theme. |
| B-04 | **Visual Identity: Themes** — Revise existing themes to move further from default styling. |
| B-05 | **Visual Identity: Typography** — Improve typography scale and color contrast across interior pages. |

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
