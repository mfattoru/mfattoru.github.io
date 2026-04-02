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
          - { label: "Email", name: "email", widget: "string", hint: "Indirizzo email di contatto. Visibile nel footer, pagina contatti e carriere." }
          - { label: "Telefono fisso", name: "phone", widget: "string", hint: "Es: +39 081-1808-8820" }
          - { label: "Cellulare", name: "phoneMobile", widget: "string", hint: "Es: +39 333-40-46-355" }
          - { label: "Indirizzo", name: "address", widget: "string", hint: "Indirizzo completo dello studio." }
          - { label: "Partita IVA", name: "vatNumber", widget: "string", hint: "Solo il numero, senza 'P.IVA:' o 'VAT:'." }
          - { label: "🇮🇹 Orari", name: "hoursIt", widget: "string", hint: "Es: Lun - Sab: 8:00 - 19:00" }
          - { label: "🇬🇧 Hours", name: "hoursEn", widget: "string", hint: "Es: Mon - Sat: 8AM - 7PM" }
          - { label: "URL LinkedIn", name: "linkedinUrl", widget: "string", required: false, hint: "URL completo del profilo LinkedIn." }

  - name: "news"
    label: "📰 Notizie / News"
    folder: "src/content/news"
    create: true
    slug: "{{year}}-{{month}}-{{day}}-{{fields.titleIt}}"
    editor:
      preview: false
    fields:
      - { label: "🇮🇹 Titolo", name: "titleIt", widget: "string" }
      - { label: "🇬🇧 Title — auto-tradotto al salvataggio", name: "titleEn", widget: "string", required: false }
      - { label: "Data pubblicazione", name: "date", widget: "datetime", format: "YYYY-MM-DD", date_format: "DD/MM/YYYY", time_format: false }
      - { label: "🇮🇹 Descrizione breve", name: "descriptionIt", widget: "string" }
      - { label: "🇬🇧 Description — auto-tradotto al salvataggio", name: "descriptionEn", widget: "string", required: false }
      - { label: "Immagine copertina", name: "image", widget: "image", required: false, hint: "Dimensione consigliata: 1200×480px (rapporto 5:2). Mostrata in cima all'articolo." }
      - { label: "🇮🇹 Contenuto", name: "body", widget: "markdown" }
      - { label: "🇬🇧 Content — auto-tradotto al salvataggio", name: "bodyEn", widget: "markdown", required: false }

  - name: "projects"
    label: "🏗️ Progetti / Projects"
    folder: "src/content/projects"
    create: true
    slug: "{{fields.titleIt}}"
    editor:
      preview: false
    fields:
      - { label: "🇮🇹 Titolo", name: "titleIt", widget: "string" }
      - { label: "🇬🇧 Title — auto-tradotto al salvataggio", name: "titleEn", widget: "string", required: false }
      - { label: "Anno", name: "year", widget: "string" }
      - { label: "🇮🇹 Categoria", name: "categoryIt", widget: "string" }
      - { label: "🇬🇧 Category — auto-tradotto al salvataggio", name: "categoryEn", widget: "string", required: false }
      - { label: "🇮🇹 Località", name: "locationIt", widget: "string" }
      - { label: "🇬🇧 Location — auto-tradotto al salvataggio", name: "locationEn", widget: "string", required: false }
      - { label: "🇮🇹 Ruolo", name: "roleIt", widget: "string" }
      - { label: "🇬🇧 Role — auto-tradotto al salvataggio", name: "roleEn", widget: "string", required: false }
      - { label: "🇮🇹 Stato", name: "statusIt", widget: "string", default: "Completato" }
      - { label: "🇬🇧 Status", name: "statusEn", widget: "string", default: "Completed" }
      - { label: "🇮🇹 Descrizione breve", name: "summaryIt", widget: "text", hint: "Testo introduttivo visualizzato in cima alla pagina progetto." }
      - { label: "🇬🇧 Short description — auto-tradotto al salvataggio", name: "summaryEn", widget: "text", required: false }
      - { label: "🇮🇹 Risultato", name: "resultIt", widget: "text", hint: "Evidenziato in un box a parte nella pagina." }
      - { label: "🇬🇧 Result — auto-tradotto al salvataggio", name: "resultEn", widget: "text", required: false }
      - { label: "Descrizione completa (opzionale)", name: "body", widget: "markdown", required: false, hint: "Testo esteso con formattazione markdown. Visualizzato dopo la descrizione breve." }
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
          - { label: "🇮🇹 Intestazione Studio", name: "firmHeadingIt", widget: "string" }
          - { label: "🇬🇧 Firm Heading — auto-tradotto al salvataggio", name: "firmHeadingEn", widget: "string", required: false }
          - { label: "🇮🇹 Testo Studio", name: "firmBodyIt", widget: "text" }
          - { label: "🇬🇧 Firm Body — auto-tradotto al salvataggio", name: "firmBodyEn", widget: "text", required: false }
          - { label: "🇮🇹 Intestazione Missione", name: "missionHeadingIt", widget: "string" }
          - { label: "🇬🇧 Mission Heading — auto-tradotto al salvataggio", name: "missionHeadingEn", widget: "string", required: false }
          - { label: "🇮🇹 Testo Missione", name: "missionBodyIt", widget: "text" }
          - { label: "🇬🇧 Mission Body — auto-tradotto al salvataggio", name: "missionBodyEn", widget: "text", required: false }
      - name: "pricing"
        label: "Prezzi / Pricing"
        file: "src/content/page-content/pricing.md"
        fields:
          - { label: "🇮🇹 Paragrafo intro", name: "introParagraphIt", widget: "text" }
          - { label: "🇬🇧 Intro paragraph — auto-tradotto al salvataggio", name: "introParagraphEn", widget: "text", required: false }
          - { label: "🇮🇹 Paragrafo conformità", name: "complianceParagraphIt", widget: "text" }
          - { label: "🇬🇧 Compliance paragraph — auto-tradotto al salvataggio", name: "complianceParagraphEn", widget: "text", required: false }
      - name: "homepage"
        label: "Homepage"
        file: "src/content/page-content/homepage.md"
        fields:
          - { label: "Statistica 1 — Valore", name: "stat1Value", widget: "string" }
          - { label: "🇮🇹 Statistica 1 — Etichetta", name: "stat1LabelIt", widget: "string" }
          - { label: "🇬🇧 Stat 1 — Label", name: "stat1LabelEn", widget: "string" }
          - { label: "Statistica 2 — Valore", name: "stat2Value", widget: "string" }
          - { label: "🇮🇹 Statistica 2 — Etichetta", name: "stat2LabelIt", widget: "string" }
          - { label: "🇬🇧 Stat 2 — Label", name: "stat2LabelEn", widget: "string" }
          - { label: "Statistica 3 — Valore", name: "stat3Value", widget: "string" }
          - { label: "🇮🇹 Statistica 3 — Etichetta", name: "stat3LabelIt", widget: "string" }
          - { label: "🇬🇧 Stat 3 — Label", name: "stat3LabelEn", widget: "string" }
          - { label: "Statistica 4 — Valore", name: "stat4Value", widget: "string" }
          - { label: "🇮🇹 Statistica 4 — Etichetta", name: "stat4LabelIt", widget: "string" }
          - { label: "🇬🇧 Stat 4 — Label", name: "stat4LabelEn", widget: "string" }

  - name: "solutions"
    label: "🔧 Servizi / Services"
    folder: "src/content/solutions"
    create: true
    slug: "{{fields.titleIt}}"
    identifier_field: titleIt
    editor:
      preview: false
    fields:
      - { label: "🇮🇹 Titolo", name: "titleIt", widget: "string" }
      - { label: "🇬🇧 Title — auto-tradotto al salvataggio", name: "titleEn", widget: "string", required: false }
      - { label: "🇮🇹 Descrizione breve", name: "descriptionIt", widget: "string", hint: "Una riga. Mostrata nelle card e nella lista servizi." }
      - { label: "🇬🇧 Short description — auto-tradotto al salvataggio", name: "descriptionEn", widget: "string", required: false }
      - { label: "Icona (emoji)", name: "icon", widget: "string", hint: "Es: 🏛️" }
      - { label: "Ordine di visualizzazione", name: "order", widget: "number", value_type: "int", min: 1 }
      - { label: "Immagine copertina", name: "image", widget: "image", required: false, hint: "Dimensione consigliata: 1200×800px (rapporto 3:2). Mostrata nella card e in cima alla pagina servizio." }
      - { label: "🇮🇹 Contenuto", name: "body", widget: "markdown" }
      - { label: "🇬🇧 Content — auto-tradotto al salvataggio", name: "bodyEn", widget: "markdown", required: false }
`;

  return new Response(yaml, {
    headers: { 'Content-Type': 'text/yaml; charset=utf-8' },
  });
};
