import type { APIRoute } from 'astro';

export const GET: APIRoute = () => {
  const cloudName = import.meta.env.CLOUDINARY_CLOUD_NAME ?? '';
  const apiKey = import.meta.env.CLOUDINARY_API_KEY ?? '';
  const uploadPreset = import.meta.env.CLOUDINARY_UPLOAD_PRESET ?? '';

  const localBackend = import.meta.env.DEV ? 'local_backend: true\n' : '';

  const cloudinarySection = cloudName && !import.meta.env.DEV ? `
media_library:
  name: cloudinary
  config:
    cloud_name: ${cloudName}
    api_key: ${apiKey}
    upload_preset: ${uploadPreset}
` : '';

  const yaml = `${localBackend}backend:
  name: github
  repo: mfattoru/mfattoru.github.io
  branch: master
  auth_type: pkce
  app_id: Ov23ct12dUUR3BNAddag

media_folder: public/image/uploads
public_folder: /image/uploads
${cloudinarySection}
collections:
  - name: "news"
    label: "Notizie / News"
    folder: "src/content/news"
    create: true
    slug: "{{year}}-{{month}}-{{day}}-{{slug}}"
    fields:
      - { label: "Titolo (IT)", name: "titleIt", widget: "string" }
      - { label: "Title (EN) — auto-tradotto al salvataggio", name: "titleEn", widget: "string", required: false }
      - { label: "Data pubblicazione", name: "date", widget: "datetime", format: "YYYY-MM-DD", date_format: "DD/MM/YYYY", time_format: false }
      - { label: "Descrizione breve (IT)", name: "descriptionIt", widget: "string" }
      - { label: "Description (EN) — auto-tradotto al salvataggio", name: "descriptionEn", widget: "string", required: false }
      - { label: "Immagine copertina", name: "image", widget: "image", required: false }
      - { label: "Contenuto (IT)", name: "body", widget: "markdown" }
      - { label: "Content (EN) — auto-tradotto al salvataggio", name: "bodyEn", widget: "markdown", required: false }

  - name: "projects"
    label: "Progetti / Projects"
    folder: "src/content/projects"
    create: true
    slug: "{{slug}}"
    fields:
      - { label: "Titolo (IT)", name: "titleIt", widget: "string" }
      - { label: "Title (EN) — auto-tradotto al salvataggio", name: "titleEn", widget: "string", required: false }
      - { label: "Anno", name: "year", widget: "string" }
      - { label: "Località (IT)", name: "locationIt", widget: "string" }
      - { label: "Location (EN) — auto-tradotto al salvataggio", name: "locationEn", widget: "string", required: false }
      - { label: "Ruolo (IT)", name: "roleIt", widget: "string" }
      - { label: "Role (EN) — auto-tradotto al salvataggio", name: "roleEn", widget: "string", required: false }
      - { label: "Stato (IT)", name: "statusIt", widget: "string", default: "Completato" }
      - { label: "Status (EN)", name: "statusEn", widget: "string", default: "Completed" }
      - { label: "Categoria (IT)", name: "categoryIt", widget: "string" }
      - { label: "Category (EN) — auto-tradotto al salvataggio", name: "categoryEn", widget: "string", required: false }
      - { label: "Sommario (IT)", name: "summaryIt", widget: "text" }
      - { label: "Summary (EN) — auto-tradotto al salvataggio", name: "summaryEn", widget: "text", required: false }
      - { label: "Risultato (IT)", name: "resultIt", widget: "text" }
      - { label: "Result (EN) — auto-tradotto al salvataggio", name: "resultEn", widget: "text", required: false }
      - { label: "Immagine principale", name: "thumbnail", widget: "image" }
      - label: "Galleria foto"
        name: "gallery"
        widget: "list"
        field:
          label: "Foto"
          name: "photo"
          widget: "image"
          media_library:
            config:
              multiple: true
      - { label: "Descrizione (IT/EN)", name: "body", widget: "markdown", required: false }
`;

  return new Response(yaml, {
    headers: { 'Content-Type': 'text/yaml; charset=utf-8' },
  });
};
