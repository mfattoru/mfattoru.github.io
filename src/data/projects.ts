export interface Project {
  slug: string;
  titleIt: string;
  titleEn: string;
  locationIt: string;
  locationEn: string;
  year: string;
  roleIt: string;
  roleEn: string;
  statusIt: string;
  statusEn: string;
  categoryIt: string;
  categoryEn: string;
  summaryIt: string;
  summaryEn: string;
  descriptionIt: string;
  descriptionEn: string;
  resultIt: string;
  resultEn: string;
  thumbnail: string;
  gallery: string[];
}

export const projects: Project[] = [
  {
    slug: 'ristrutturazione-stradale',
    titleIt: 'Ristrutturazione Stradale',
    titleEn: 'Road Resurfacing',
    locationIt: 'Lettere, NA',
    locationEn: 'Lettere, NA',
    year: '2022',
    roleIt: 'Direttore dei Lavori',
    roleEn: 'Works Director',
    statusIt: 'Completato',
    statusEn: 'Completed',
    categoryIt: 'Infrastrutture Stradali',
    categoryEn: 'Road Infrastructure',
    summaryIt: 'I lavori hanno riguardato la manutenzione di alcune stradine e Piazze site in diverse frazioni del Comune di Lettere.',
    summaryEn: 'The works involved the maintenance of small streets and squares in various districts of the Municipality of Lettere.',
    descriptionIt: 'In particolare i lavori, di fresatura e di rifacimento del manto stradale, realizzati in strade di piccola larghezza tali da non consentire l\'uso della finitrice, sono stati eseguiti con stesa a mano del conglomerato.',
    descriptionEn: 'In particular, the milling and road surface resurfacing works, carried out on narrow streets that did not allow the use of a paver, were executed with manual spreading of the asphalt conglomerate.',
    resultIt: 'Ripristino delle condizioni di sicurezza del manto stradale e miglioramento dell\'estetica degli spazi comuni.',
    resultEn: 'Restoration of road surface safety conditions and improvement of the aesthetics of common spaces.',
    thumbnail: '/projects/1/photos/1.jpg',
    gallery: [
      '/projects/1/photos/1.jpg',
      '/projects/1/photos/2.jpg',
      '/projects/1/photos/3.jpg',
      '/projects/1/photos/4.jpg',
      '/projects/1/photos/5.jpg',
      '/projects/1/photos/6.jpg',
      '/projects/1/photos/7.jpg',
      '/projects/1/photos/8.jpg',
    ],
  },
  {
    slug: 'campo-sportivo',
    titleIt: 'Campo Sportivo',
    titleEn: 'Sports Field',
    locationIt: 'Lettere, NA',
    locationEn: 'Lettere, NA',
    year: '2022',
    roleIt: 'Coordinatore per la Sicurezza',
    roleEn: 'Safety Coordinator',
    statusIt: 'Completato',
    statusEn: 'Completed',
    categoryIt: 'Opere Sportive',
    categoryEn: 'Sports Facilities',
    summaryIt: 'I lavori hanno riguardato l\'ammodernamento funzionale e tecnologico del campo sportivo comunale del Comune di Lettere.',
    summaryEn: 'The works involved the functional and technological modernisation of the municipal sports field in Lettere.',
    descriptionIt: 'Tali lavori hanno in particolar modo previsto: la realizzazione di un campo in erbetta sintetica di moderna concezione con sistema di recupero delle acque meteoriche da riutilizzare nell\'impianto di innaffiamento con pop-up automatici; la realizzazione di una scala antincendio in acciaio per l\'esodo degli spettatori in caso di pericoli; l\'ammodernamento dei locali spogliatoi e degli impianti elettrici, idrici e sanitari e di climatizzazione di servizio; la sistemazione degli spazi esterni a servizio del campo.',
    descriptionEn: 'The works included: installation of a modern synthetic turf pitch with a rainwater recovery system for automatic irrigation; construction of a steel fire escape for spectator evacuation; renovation of changing rooms and electrical, water, sanitary and climate systems; landscaping of the surrounding outdoor areas.',
    resultIt: 'Realizzazione di un campo di calcio conforme al "Regolamento impianti sportivi" della Lega Nazionale Dilettanti.',
    resultEn: 'Construction of a football pitch compliant with the "Sports Facilities Regulations" of the Lega Nazionale Dilettanti.',
    thumbnail: '/projects/2/photos/1.jpg',
    gallery: [
      '/projects/2/photos/1.jpg',
      '/projects/2/photos/2.jpg',
      '/projects/2/photos/3.jpg',
      '/projects/2/photos/4.jpg',
      '/projects/2/photos/5.jpg',
      '/projects/2/photos/6.jpg',
      '/projects/2/photos/7.jpg',
      '/projects/2/photos/8.jpg',
      '/projects/2/photos/9.jpg',
    ],
  },
];
