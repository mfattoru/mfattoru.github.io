import type { APIRoute } from 'astro';

export const GET: APIRoute = () => {
  const cloudName = import.meta.env.CLOUDINARY_CLOUD_NAME ?? '';
  const apiKey = import.meta.env.CLOUDINARY_API_KEY ?? '';
  const uploadPreset = import.meta.env.CLOUDINARY_UPLOAD_PRESET ?? '';

  const cloudinarySection = cloudName && !import.meta.env.DEV ? `
media_library:
  name: cloudinary
  config:
    cloud_name: ${cloudName}
    api_key: ${apiKey}
    upload_preset: ${uploadPreset}
` : '';

  const yaml = `backend:
  name: github
  repo: mfattoru/mfattoru.github.io
  branch: master
  base_url: https://onofrio-cms-auth.michele-fattoruso.workers.dev

media_folder: public/image
public_folder: /image
${cloudinarySection}
collections:
  - name: "site-settings"
    label: "⚙️ Impostazioni Sito"
    editor:
      preview: false
    files:
      - name: "general"
        label: "Generali"
        file: "src/content/site-settings/general.md"
        fields:
          - label: "File CV (PDF)"
            name: "cvFile"
            widget: "file"
            media_folder: "public"
            public_folder: ""
            hint: "Carica il CV in formato PDF. Il file sarà disponibile su /nomefile.pdf"
          - label: "Tema predefinito del sito"
            name: "theme"
            widget: "select"
            default: "steel"
            hint: "Tema mostrato ai visitatori che non hanno ancora scelto un tema personale."
            options:
              - { label: "Steel (default)", value: "steel" }
              - { label: "Blueprint", value: "blueprint" }
              - { label: "Obsidian", value: "obsidian" }
              - { label: "Industrial", value: "industrial" }
              - { label: "Forest", value: "forest" }
              - { label: "Limestone", value: "limestone" }
              - { label: "Marble", value: "marble" }
              - { label: "Daylight", value: "daylight" }
              - { label: "High Contrast", value: "high-contrast" }

  - name: "news"
    label: "📰 Notizie / News"
    folder: "src/content/news"
    create: true
    slug: "{{year}}-{{month}}-{{day}}-{{fields.titleIt}}"
    editor:
      preview: false
    fields:
      - { label: "Titolo (IT)", name: "titleIt", widget: "string" }
      - { label: "Title (EN) — auto-tradotto al salvataggio", name: "titleEn", widget: "string", required: false }
      - { label: "Data pubblicazione", name: "date", widget: "datetime", format: "YYYY-MM-DD", date_format: "DD/MM/YYYY", time_format: false }
      - { label: "Descrizione breve (IT)", name: "descriptionIt", widget: "string" }
      - { label: "Description (EN) — auto-tradotto al salvataggio", name: "descriptionEn", widget: "string", required: false }
      - { label: "Immagine copertina", name: "image", widget: "image", required: false, hint: "Dimensione consigliata: 1200×480px (rapporto 5:2). Mostrata in cima all'articolo." }
      - { label: "Contenuto (IT)", name: "body", widget: "markdown" }
      - { label: "Content (EN) — auto-tradotto al salvataggio", name: "bodyEn", widget: "markdown", required: false }

  - name: "projects"
    label: "🏗️ Progetti / Projects"
    folder: "src/content/projects"
    create: true
    slug: "{{fields.titleIt}}"
    editor:
      preview: false
    fields:
      - { label: "Titolo (IT)", name: "titleIt", widget: "string" }
      - { label: "Title (EN) — auto-tradotto al salvataggio", name: "titleEn", widget: "string", required: false }
      - { label: "Anno", name: "year", widget: "string" }
      - { label: "Categoria (IT)", name: "categoryIt", widget: "string" }
      - { label: "Category (EN) — auto-tradotto al salvataggio", name: "categoryEn", widget: "string", required: false }
      - { label: "Località (IT)", name: "locationIt", widget: "string" }
      - { label: "Location (EN) — auto-tradotto al salvataggio", name: "locationEn", widget: "string", required: false }
      - { label: "Ruolo (IT)", name: "roleIt", widget: "string" }
      - { label: "Role (EN) — auto-tradotto al salvataggio", name: "roleEn", widget: "string", required: false }
      - { label: "Stato (IT)", name: "statusIt", widget: "string", default: "Completato" }
      - { label: "Status (EN)", name: "statusEn", widget: "string", default: "Completed" }
      - { label: "Descrizione breve (IT)", name: "summaryIt", widget: "text", hint: "Testo introduttivo visualizzato in cima alla pagina progetto." }
      - { label: "Short description (EN) — auto-tradotto al salvataggio", name: "summaryEn", widget: "text", required: false }
      - { label: "Risultato (IT)", name: "resultIt", widget: "text", hint: "Evidenziato in un box a parte nella pagina." }
      - { label: "Result (EN) — auto-tradotto al salvataggio", name: "resultEn", widget: "text", required: false }
      - { label: "Descrizione completa (IT/EN) — opzionale", name: "body", widget: "markdown", required: false, hint: "Testo esteso con formattazione markdown. Visualizzato dopo la descrizione breve." }
      - { label: "Immagine principale", name: "thumbnail", widget: "image", hint: "Dimensione consigliata: 1200×800px (rapporto 3:2). Usata nella lista progetti e in cima alla pagina." }
      - label: "Galleria foto"
        name: "gallery"
        widget: "list"
        hint: "Tutte le foto del progetto mostrate nel carosello. Dimensione consigliata: 1600×1067px (rapporto 3:2)."
        summary: "{{fields.photo}}"
        field:
          label: "Foto"
          name: "photo"
          widget: "image"
          media_library:
            config:
              multiple: true

  - name: "page-content"
    label: "📄 Contenuto Pagine"
    editor:
      preview: false
    files:
      - name: "about"
        label: "Chi Siamo / About"
        file: "src/content/page-content/about.md"
        fields:
          - { label: "Intestazione Studio (IT)", name: "firmHeadingIt", widget: "string" }
          - { label: "Firm Heading (EN) — auto-tradotto al salvataggio", name: "firmHeadingEn", widget: "string", required: false }
          - { label: "Testo Studio (IT)", name: "firmBodyIt", widget: "text" }
          - { label: "Firm Body (EN) — auto-tradotto al salvataggio", name: "firmBodyEn", widget: "text", required: false }
          - { label: "Intestazione Missione (IT)", name: "missionHeadingIt", widget: "string" }
          - { label: "Mission Heading (EN) — auto-tradotto al salvataggio", name: "missionHeadingEn", widget: "string", required: false }
          - { label: "Testo Missione (IT)", name: "missionBodyIt", widget: "text" }
          - { label: "Mission Body (EN) — auto-tradotto al salvataggio", name: "missionBodyEn", widget: "text", required: false }
      - name: "pricing"
        label: "Prezzi / Pricing"
        file: "src/content/page-content/pricing.md"
        fields:
          - { label: "Paragrafo intro (IT)", name: "introParagraphIt", widget: "text" }
          - { label: "Intro paragraph (EN) — auto-tradotto al salvataggio", name: "introParagraphEn", widget: "text", required: false }
          - { label: "Paragrafo conformità (IT)", name: "complianceParagraphIt", widget: "text" }
          - { label: "Compliance paragraph (EN) — auto-tradotto al salvataggio", name: "complianceParagraphEn", widget: "text", required: false }
      - name: "homepage"
        label: "Homepage"
        file: "src/content/page-content/homepage.md"
        fields:
          - { label: "Statistica 1 — Valore", name: "stat1Value", widget: "string" }
          - { label: "Statistica 1 — Etichetta (IT)", name: "stat1LabelIt", widget: "string" }
          - { label: "Statistica 1 — Label (EN)", name: "stat1LabelEn", widget: "string" }
          - { label: "Statistica 2 — Valore", name: "stat2Value", widget: "string" }
          - { label: "Statistica 2 — Etichetta (IT)", name: "stat2LabelIt", widget: "string" }
          - { label: "Statistica 2 — Label (EN)", name: "stat2LabelEn", widget: "string" }
          - { label: "Statistica 3 — Valore", name: "stat3Value", widget: "string" }
          - { label: "Statistica 3 — Etichetta (IT)", name: "stat3LabelIt", widget: "string" }
          - { label: "Statistica 3 — Label (EN)", name: "stat3LabelEn", widget: "string" }
          - { label: "Statistica 4 — Valore", name: "stat4Value", widget: "string" }
          - { label: "Statistica 4 — Etichetta (IT)", name: "stat4LabelIt", widget: "string" }
          - { label: "Statistica 4 — Label (EN)", name: "stat4LabelEn", widget: "string" }

  - name: "solutions"
    label: "🔧 Servizi / Services"
    folder: "src/content/solutions"
    create: true
    slug: "{{fields.titleIt}}"
    identifier_field: titleIt
    editor:
      preview: false
    fields:
      - { label: "Titolo (IT)", name: "titleIt", widget: "string" }
      - { label: "Title (EN) — auto-tradotto al salvataggio", name: "titleEn", widget: "string", required: false }
      - { label: "Descrizione breve (IT)", name: "descriptionIt", widget: "string", hint: "Una riga. Mostrata nelle card e nella lista servizi." }
      - { label: "Short description (EN) — auto-tradotto al salvataggio", name: "descriptionEn", widget: "string", required: false }
      - { label: "Icona (emoji)", name: "icon", widget: "string", hint: "Es: 🏛️" }
      - { label: "Ordine di visualizzazione", name: "order", widget: "number", value_type: "int", min: 1 }
      - { label: "Immagine copertina", name: "image", widget: "image", required: false, hint: "Dimensione consigliata: 1200×800px (rapporto 3:2). Mostrata nella card e in cima alla pagina servizio." }
      - { label: "Contenuto (IT)", name: "body", widget: "markdown" }
      - { label: "Content (EN) — auto-tradotto al salvataggio", name: "bodyEn", widget: "markdown", required: false }
`;

  return new Response(yaml, {
    headers: { 'Content-Type': 'text/yaml; charset=utf-8' },
  });
};
