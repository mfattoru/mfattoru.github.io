# Image Prompts for AI Generation

Reference for generating website images. Upload to Cloudinary at `f_auto,q_auto/[path]`.

---

## Global Style Notes

All images should share a consistent visual language:
- **Mood**: Professional, clean, trustworthy — Italian engineering & architecture firm
- **Color palette**: Neutral tones (whites, greys, warm beiges), occasional bold accent (deep blue, anthracite)
- **Style**: Photorealistic or high-quality architectural render — no cartoons, no illustrations
- **Lighting**: Natural, soft, ample — avoid harsh shadows or overly dramatic contrast
- **People**: When included, professional attire, diverse, no direct gaze at camera (candid feel)
- **No text or watermarks** in generated images

---

## Homepage

### Hero Background
**Cloudinary path:** `site/eng_background_2`
**Display:** Full-width overlay (25% opacity) — image must work well as a muted background
**Aspect ratio:** 16:9 (landscape)
**Recommended upload size:** 1920×1080px

```
Wide-angle aerial photograph of a modern Italian city under construction, featuring a mix
of renovated historic buildings and new contemporary structures. Soft golden-hour light,
clear sky, neutral tones. No people, no text. Photorealistic, high detail.
```

---

## About Page (`/it/chi-siamo`, `/en/about`)

### Engineer Headshot
**Cloudinary path:** `site/headshot`
**Display:** 480×640px (3:4 portrait)
**Recommended upload size:** 960×1280px

```
Professional portrait photograph of a male Italian civil engineer in his late 30s, wearing
a navy blue shirt, standing in front of a modern office background with architectural
drawings subtly visible. Soft studio lighting, confident and approachable expression,
slight three-quarter angle. Clean, neutral background. No text.
```

---

## Solutions — Card Images (grid listing)

Used on `/it/soluzioni` and `/en/solutions`.
**Display:** 800×320px cards
**Recommended upload size:** 1600×640px (2.5:1 ratio)

### 1. Architectural Design & BIM
**Cloudinary path:** `solutions/progettazione_architettonica`

```
Close-up of a modern architect's desk with a large monitor displaying a detailed 3D BIM
building model, surrounded by architectural blueprints and a precision scale model. Clean,
professional studio lighting. Neutral tones with subtle blue screen glow. No people,
no text. Photorealistic.
```

### 2. Occupational Safety Training
**Cloudinary path:** `solutions/formazione_sicurezza`

```
A professional safety training session inside a bright, modern meeting room. An instructor
stands at the front facing a small group of attentive workers wearing high-visibility vests.
Presentation slides on a whiteboard in the background. Candid, natural lighting. No visible
text on slides.
```

### 3. Occupational Safety Consulting
**Cloudinary path:** `solutions/sicurezza_sul_lavoro`

```
A safety consultant wearing a hard hat and high-visibility vest conducting a risk assessment
walkthrough on an active construction site. Holding a clipboard with forms, examining
scaffolding. Natural daylight, warm tones. Photorealistic, no text.
```

### 4. Construction Supervision & Safety Coordination
**Cloudinary path:** `solutions/direzione_lavori`

```
A construction site director in a hard hat and suit jacket reviewing architectural plans
with a contractor on-site, concrete structure and cranes visible in the background.
Morning light, professional atmosphere, no text. Photorealistic.
```

### 5. Tax Incentives & Building Retrofitting (Superbonus)
**Cloudinary path:** `solutions/progettazione_interventi`

```
Exterior of a residential apartment building mid-renovation: insulation panels being
installed on the facade, scaffolding in place, workers in safety gear. Modern Italian
apartment block, daylight, clean composition. No text. Photorealistic.
```

### 6. Sustainability & Energy Efficiency
**Cloudinary path:** `solutions/sostenibilita_energetica`

```
A modern, energy-efficient building with a green roof covered in low plants, solar panels
on the south facade, and large triple-glazed windows. Surrounded by mature trees. Bright
natural light, fresh colors. No people, no text. Photorealistic architectural render.
```

### 7. Building & Environmental Acoustics
**Cloudinary path:** `solutions/acustica_edilizia`

```
Interior of a professional acoustic testing lab: a sound-level meter on a tripod in a
corridor with exposed acoustic panels on the walls. Clean, technical environment, soft
diffused lighting. No people, no text. Photorealistic.
```

### 8. Real Estate Appraisal & Property Valuation
**Cloudinary path:** `solutions/estimo_immobiliare`

```
A professional appraiser examining the interior of an empty modern apartment, taking notes
on a tablet. Large windows with a blurred city view, neutral interior finishes. Clean,
natural light. Professional and trustworthy feel. No text. Photorealistic.
```

### 9. Building Engineering & Technical Consulting
**Cloudinary path:** `solutions/edilizia`

```
Detailed macro shot of construction engineering documents: a quantity surveyor's bill of
quantities spreadsheet, a measuring tape, and a technical pen laid on architectural
blueprints. Warm desk lighting. No faces, no visible text content, no text. Photorealistic.
```

---

## Solutions — Banner Images (detail pages)

Used on individual solution pages as the full-width hero banner.
**Display:** 1200×480px
**Recommended upload size:** 2400×960px (2.5:1 ratio)

Use the same prompts as the card images above but **add this suffix** to each prompt:

```
Ultra-wide cinematic crop, horizontal banner format, strong depth of field, subject
centered with negative space on both sides for text overlay.
```

---

## Projects

### Thumbnail Images (listing & homepage)
**Display:** 800×384px
**Recommended upload size:** 1600×768px (approx. 2:1 ratio)

#### Sports Field Renovation
**Cloudinary path:** `projects/campo-sportivo/thumb`

```
Aerial drone photograph of a freshly renovated municipal sports field with synthetic green
turf, white line markings, and surrounding running track in red. Clear afternoon light,
no people. Clean top-down composition. Photorealistic.
```

#### Road / Street Reconstruction
**Cloudinary path:** `projects/ristrutturazione-stradale/thumb`

```
Street-level photograph of a newly completed urban road reconstruction: fresh black
asphalt, crisp white road markings, new kerbs, and modern street lighting posts. Suburban
Italian setting, golden-hour light, no traffic. Photorealistic.
```

### Gallery Images (project detail carousel)
**Display:** 1200×675px (16:9)
**Recommended upload size:** 1920×1080px

#### Generic Construction Progress — Before State
```
Wide-angle photograph of a construction site in early phase: excavated ground, foundation
formwork, workers in hard hats and high-visibility vests. Overcast natural light. No text.
Photorealistic.
```

#### Generic Construction Progress — Mid Phase
```
Medium shot of a concrete structure under construction, rebar visible, concrete pouring
equipment in use, construction workers in PPE in the background. Daylight. No text.
Photorealistic.
```

#### Generic Construction Progress — After State (Completion)
```
Wide-angle photograph of a completed modern public infrastructure project in an Italian
town: clean surfaces, fresh landscaping, clear blue sky. No people, no text. Photorealistic.
```

---

## News

### News Card Thumbnail
**Display:** 800×320px (2.5:1 ratio)
**Recommended upload size:** 1600×640px

#### Industry Update — Generic
```
Flat-lay of construction industry objects: a hard hat, rolled-up blueprints, a safety
manual, and a smartphone on a clean white surface. Top-down shot, soft even lighting,
neutral background. No text. Photorealistic.
```

#### Regulatory / Legal News
```
Professional photograph of a desk with a pen resting on an official-looking document,
a gavel nearby, and an architectural model in the background. Warm desk lamp light,
minimal and clean. No readable text. Photorealistic.
```

#### Energy Efficiency / Incentive News
```
Close-up of solar panels installed on a tiled Italian rooftop with terracotta tiles,
blue sky and white clouds reflected in the panels. Warm afternoon light. No text.
Photorealistic.
```

#### Safety / Training News
```
Wide-angle shot of a safety training class in progress: instructor at a whiteboard, workers
seated with notebooks, all wearing reflective vests. Bright classroom, natural light.
No visible text on board. Photorealistic.
```

### News Featured Image (article detail)
**Display:** 900×450px (2:1 ratio)
**Recommended upload size:** 1800×900px

Use the same prompts as card thumbnails above with this **suffix**:

```
Wide horizontal crop, 2:1 aspect ratio, strong visual hierarchy — key subject in the
left-center third, clean right portion for headline text overlay.
```

---

## Technical Reference

| Section | Upload Size | Astro Component Size | Aspect Ratio | Cloudinary Path Prefix |
|---|---|---|---|---|
| Hero background | 1920×1080 | CSS bg-image | 16:9 | `site/` |
| Headshot | 960×1280 | 480×640 | 3:4 | `site/` |
| Solution card | 1600×640 | 800×320 | 2.5:1 | `solutions/` |
| Solution banner | 2400×960 | 1200×480 | 2.5:1 | `solutions/` |
| Project thumbnail | 1600×768 | 800×384 | ~2:1 | `projects/[slug]/` |
| Project gallery | 1920×1080 | 1200×675 | 16:9 | `projects/[slug]/` |
| News card | 1600×640 | 800×320 | 2.5:1 | `news/` |
| News featured | 1800×900 | 900×450 | 2:1 | `news/` |

**Upload workflow:**
1. Generate image with AI tool (Midjourney, DALL·E, Firefly, etc.)
2. Upload to Cloudinary under the correct path
3. Cloudinary URL format: `https://res.cloudinary.com/dd3aknabk/image/upload/f_auto,q_auto/[path]`
4. Use that URL in the CMS content field
