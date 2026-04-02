import type { APIRoute } from 'astro';
import { readFileSync } from 'fs';
import { resolve } from 'path';

function getSiteLanguage(): 'both' | 'it' | 'en' {
  try {
    const raw = readFileSync(resolve('src/content/site-settings/general.md'), 'utf-8');
    const match = raw.match(/siteLanguage:\s*(\w+)/);
    const val = match?.[1];
    if (val === 'it' || val === 'en' || val === 'both') return val;
  } catch {}
  return 'both';
}

export const GET: APIRoute = () => {
  const cloudName = import.meta.env.CLOUDINARY_CLOUD_NAME ?? '';
  const apiKey = import.meta.env.CLOUDINARY_API_KEY ?? '';
  const uploadPreset = import.meta.env.CLOUDINARY_UPLOAD_PRESET ?? '';
  const lang = getSiteLanguage();
  const showIt = lang !== 'en';
  const showEn = lang !== 'it';
  // itLabel/enLabel: for single-language mode, drop the flag prefix since all fields are same language
  const it = (label: string) => showEn ? `🇮🇹 ${label}` : label;
  const en = (label: string) => showIt ? `🇬🇧 ${label}` : label;

  const cloudinarySection = cloudName && !import.meta.env.DEV ? `
media_library:
  name: cloudinary
  config:
    cloud_name: ${cloudName}
    api_key: ${apiKey}
    upload_preset: ${uploadPreset}
` : '';

  // Helper: renders an EN field line or empty string
  const enField = (line: string) => showEn ? `\n      ${line}` : '';
  const enFieldIndent = (line: string) => showEn ? `\n          ${line}` : '';

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
          - { label: "Mostra selettore tema", name: "showThemeSwitcher", widget: "boolean", default: true, hint: "Se disabilitato, il pulsante per cambiare tema viene nascosto dal sito. Il tema predefinito sopra sarà l'unico usato." }
          - label: "Lingua del sito"
            name: "siteLanguage"
            widget: "select"
            default: "both"
            hint: "Controlla quali campi lingua appaiono nell'admin e se la traduzione automatica è attiva."
            options:
              - { label: "🇮🇹🇬🇧 Bilingue (IT + EN)", value: "both" }
              - { label: "🇮🇹 Solo italiano", value: "it" }
              - { label: "🇬🇧 English only", value: "en" }
          - { label: "Email", name: "email", widget: "string", hint: "Indirizzo email di contatto. Visibile nel footer, pagina contatti e carriere." }
          - { label: "Telefono fisso", name: "phone", widget: "string", hint: "Es: +39 081-1808-8820" }
          - { label: "Cellulare", name: "phoneMobile", widget: "string", hint: "Es: +39 333-40-46-355" }
          - { label: "Indirizzo", name: "address", widget: "string", hint: "Indirizzo completo dello studio." }
          - { label: "Partita IVA", name: "vatNumber", widget: "string", hint: "Solo il numero, senza 'P.IVA:' o 'VAT:'." }
          ${showIt ? `- { label: "${it('Orari')}", name: "hoursIt", widget: "string", hint: "Es: Lun - Sab: 8:00 - 19:00" }` : ''}
          ${showEn ? `- { label: "${en('Hours')}", name: "hoursEn", widget: "string", hint: "Es: Mon - Sat: 8AM - 7PM" }` : ''}
          - { label: "URL LinkedIn", name: "linkedinUrl", widget: "string", required: false, hint: "URL completo del profilo LinkedIn." }

  - name: "news"
    label: "📰 Notizie / News"
    folder: "src/content/news"
    create: true
    slug: "{{year}}-{{month}}-{{day}}-{{fields.titleIt}}"
    editor:
      preview: false
    fields:
      ${showIt ? `- { label: "${it('Titolo')}", name: "titleIt", widget: "string" }` : ''}${enField(`- { label: "${en('Title')}${showIt ? ' — auto-tradotto al salvataggio' : ''}", name: "titleEn", widget: "string"${showIt ? ', required: false' : ''} }`)}
      - { label: "Data pubblicazione", name: "date", widget: "datetime", format: "YYYY-MM-DD", date_format: "DD/MM/YYYY", time_format: false }
      ${showIt ? `- { label: "${it('Descrizione breve')}", name: "descriptionIt", widget: "string" }` : ''}${enField(`- { label: "${en('Description')}${showIt ? ' — auto-tradotto al salvataggio' : ''}", name: "descriptionEn", widget: "string"${showIt ? ', required: false' : ''} }`)}
      - { label: "Immagine copertina", name: "image", widget: "image", required: false, hint: "Dimensione consigliata: 1200×480px (rapporto 5:2). Mostrata in cima all'articolo." }
      ${showIt ? `- { label: "${it('Contenuto')}", name: "body", widget: "markdown" }` : ''}${enField(`- { label: "${en('Content')}${showIt ? ' — auto-tradotto al salvataggio' : ''}", name: "bodyEn", widget: "markdown"${showIt ? ', required: false' : ''} }`)}

  - name: "projects"
    label: "🏗️ Progetti / Projects"
    folder: "src/content/projects"
    create: true
    slug: "{{fields.titleIt}}"
    editor:
      preview: false
    fields:
      ${showIt ? `- { label: "${it('Titolo')}", name: "titleIt", widget: "string" }` : ''}${enField(`- { label: "${en('Title')}${showIt ? ' — auto-tradotto al salvataggio' : ''}", name: "titleEn", widget: "string"${showIt ? ', required: false' : ''} }`)}
      - { label: "Anno", name: "year", widget: "string" }
      ${showIt ? `- { label: "${it('Categoria')}", name: "categoryIt", widget: "string" }` : ''}${enField(`- { label: "${en('Category')}${showIt ? ' — auto-tradotto al salvataggio' : ''}", name: "categoryEn", widget: "string"${showIt ? ', required: false' : ''} }`)}
      ${showIt ? `- { label: "${it('Località')}", name: "locationIt", widget: "string" }` : ''}${enField(`- { label: "${en('Location')}${showIt ? ' — auto-tradotto al salvataggio' : ''}", name: "locationEn", widget: "string"${showIt ? ', required: false' : ''} }`)}
      ${showIt ? `- { label: "${it('Ruolo')}", name: "roleIt", widget: "string" }` : ''}${enField(`- { label: "${en('Role')}${showIt ? ' — auto-tradotto al salvataggio' : ''}", name: "roleEn", widget: "string"${showIt ? ', required: false' : ''} }`)}
      ${showIt ? `- { label: "${it('Stato')}", name: "statusIt", widget: "string", default: "Completato" }` : ''}${enField(`- { label: "${en('Status')}", name: "statusEn", widget: "string", default: "Completed" }`)}
      ${showIt ? `- { label: "${it('Descrizione breve')}", name: "summaryIt", widget: "text", hint: "Testo introduttivo visualizzato in cima alla pagina progetto." }` : ''}${enField(`- { label: "${en('Short description')}${showIt ? ' — auto-tradotto al salvataggio' : ''}", name: "summaryEn", widget: "text"${showIt ? ', required: false' : ''} }`)}
      ${showIt ? `- { label: "${it('Risultato')}", name: "resultIt", widget: "text", hint: "Evidenziato in un box a parte nella pagina." }` : ''}${enField(`- { label: "${en('Result')}${showIt ? ' — auto-tradotto al salvataggio' : ''}", name: "resultEn", widget: "text"${showIt ? ', required: false' : ''} }`)}
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
          ${showIt ? `- { label: "${it('Intestazione Studio')}", name: "firmHeadingIt", widget: "string" }` : ''}${enFieldIndent(`- { label: "${en('Firm Heading')}${showIt ? ' — auto-tradotto al salvataggio' : ''}", name: "firmHeadingEn", widget: "string"${showIt ? ', required: false' : ''} }`)}
          ${showIt ? `- { label: "${it('Testo Studio')}", name: "firmBodyIt", widget: "text" }` : ''}${enFieldIndent(`- { label: "${en('Firm Body')}${showIt ? ' — auto-tradotto al salvataggio' : ''}", name: "firmBodyEn", widget: "text"${showIt ? ', required: false' : ''} }`)}
          ${showIt ? `- { label: "${it('Intestazione Missione')}", name: "missionHeadingIt", widget: "string" }` : ''}${enFieldIndent(`- { label: "${en('Mission Heading')}${showIt ? ' — auto-tradotto al salvataggio' : ''}", name: "missionHeadingEn", widget: "string"${showIt ? ', required: false' : ''} }`)}
          ${showIt ? `- { label: "${it('Testo Missione')}", name: "missionBodyIt", widget: "text" }` : ''}${enFieldIndent(`- { label: "${en('Mission Body')}${showIt ? ' — auto-tradotto al salvataggio' : ''}", name: "missionBodyEn", widget: "text"${showIt ? ', required: false' : ''} }`)}
      - name: "pricing"
        label: "Prezzi / Pricing"
        file: "src/content/page-content/pricing.md"
        fields:
          ${showIt ? `- { label: "${it('Paragrafo intro')}", name: "introParagraphIt", widget: "text" }` : ''}${enFieldIndent(`- { label: "${en('Intro paragraph')}${showIt ? ' — auto-tradotto al salvataggio' : ''}", name: "introParagraphEn", widget: "text"${showIt ? ', required: false' : ''} }`)}
          ${showIt ? `- { label: "${it('Paragrafo conformità')}", name: "complianceParagraphIt", widget: "text" }` : ''}${enFieldIndent(`- { label: "${en('Compliance paragraph')}${showIt ? ' — auto-tradotto al salvataggio' : ''}", name: "complianceParagraphEn", widget: "text"${showIt ? ', required: false' : ''} }`)}
      - name: "homepage"
        label: "Homepage"
        file: "src/content/page-content/homepage.md"
        fields:
          - { label: "Statistica 1 — Valore", name: "stat1Value", widget: "string" }
          ${showIt ? `- { label: "${it('Statistica 1 — Etichetta')}", name: "stat1LabelIt", widget: "string" }` : ''}${enFieldIndent(`- { label: "${en('Stat 1 — Label')}", name: "stat1LabelEn", widget: "string" }`)}
          - { label: "Statistica 2 — Valore", name: "stat2Value", widget: "string" }
          ${showIt ? `- { label: "${it('Statistica 2 — Etichetta')}", name: "stat2LabelIt", widget: "string" }` : ''}${enFieldIndent(`- { label: "${en('Stat 2 — Label')}", name: "stat2LabelEn", widget: "string" }`)}
          - { label: "Statistica 3 — Valore", name: "stat3Value", widget: "string" }
          ${showIt ? `- { label: "${it('Statistica 3 — Etichetta')}", name: "stat3LabelIt", widget: "string" }` : ''}${enFieldIndent(`- { label: "${en('Stat 3 — Label')}", name: "stat3LabelEn", widget: "string" }`)}
          - { label: "Statistica 4 — Valore", name: "stat4Value", widget: "string" }
          ${showIt ? `- { label: "${it('Statistica 4 — Etichetta')}", name: "stat4LabelIt", widget: "string" }` : ''}${enFieldIndent(`- { label: "${en('Stat 4 — Label')}", name: "stat4LabelEn", widget: "string" }`)}

  - name: "solutions"
    label: "🔧 Servizi / Services"
    folder: "src/content/solutions"
    create: true
    slug: "{{fields.titleIt}}"
    identifier_field: titleIt
    editor:
      preview: false
    fields:
      ${showIt ? `- { label: "${it('Titolo')}", name: "titleIt", widget: "string" }` : ''}${enField(`- { label: "${en('Title')}${showIt ? ' — auto-tradotto al salvataggio' : ''}", name: "titleEn", widget: "string"${showIt ? ', required: false' : ''} }`)}
      ${showIt ? `- { label: "${it('Descrizione breve')}", name: "descriptionIt", widget: "string", hint: "Una riga. Mostrata nelle card e nella lista servizi." }` : ''}${enField(`- { label: "${en('Short description')}${showIt ? ' — auto-tradotto al salvataggio' : ''}", name: "descriptionEn", widget: "string"${showIt ? ', required: false' : ''} }`)}
      - { label: "Icona (emoji)", name: "icon", widget: "string", hint: "Es: 🏛️" }
      - { label: "Ordine di visualizzazione", name: "order", widget: "number", value_type: "int", min: 1 }
      - { label: "Immagine copertina", name: "image", widget: "image", required: false, hint: "Dimensione consigliata: 1200×800px (rapporto 3:2). Mostrata nella card e in cima alla pagina servizio." }
      ${showIt ? `- { label: "${it('Contenuto')}", name: "body", widget: "markdown" }` : ''}${enField(`- { label: "${en('Content')}${showIt ? ' — auto-tradotto al salvataggio' : ''}", name: "bodyEn", widget: "markdown"${showIt ? ', required: false' : ''} }`)}
      - label: "Galleria foto"
        name: "gallery"
        widget: "list"
        required: false
        hint: "Foto mostrate nel carosello nella pagina servizio. Dimensione consigliata: 1600×1067px (rapporto 3:2)."
        summary: "{{fields.photo}}"
        field:
          label: "Foto"
          name: "photo"
          widget: "image"
          media_library:
            config:
              multiple: true
`;

  return new Response(yaml, {
    headers: { 'Content-Type': 'text/yaml; charset=utf-8' },
  });
};
