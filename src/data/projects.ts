export interface Project {
  slug: string;
  titleIt: string;
  titleEn: string;
  locationIt: string;
  locationEn: string;
  year: string;
  categoryIt: string;
  categoryEn: string;
  descriptionIt: string;
  descriptionEn: string;
  thumbnail: string;
  gallery: string[]; // array of /image/gallery/ paths
}

export const projects: Project[] = [
  {
    slug: 'riqualificazione-energetica-residenziale',
    titleIt: 'Riqualificazione energetica edificio residenziale',
    titleEn: 'Residential Energy Retrofit',
    locationIt: 'Lettere, NA',
    locationEn: 'Lettere, NA',
    year: '2023',
    categoryIt: 'Superbonus 110%',
    categoryEn: 'Superbonus 110%',
    descriptionIt: 'Intervento di riqualificazione energetica su edificio residenziale plurifamiliare. Il progetto ha incluso l\'installazione di cappotto termico, sostituzione degli infissi e installazione di impianto fotovoltaico, accedendo agli incentivi Superbonus 110%.',
    descriptionEn: 'Energy retrofit of a multi-family residential building. The project included external thermal insulation, window replacement, and photovoltaic system installation under the Superbonus 110% incentive scheme.',
    thumbnail: '/image/work-sm-a.jpg',
    gallery: [
      '/image/gallery/gallery1-large.jpg',
      '/image/gallery/gallery2-large.jpg',
      '/image/gallery/gallery3-large.jpg',
      '/image/gallery/gallery4-large.jpg',
    ],
  },
  {
    slug: 'progettazione-villa-bifamiliare',
    titleIt: 'Progettazione villa bifamiliare',
    titleEn: 'Semi-detached Villa Design',
    locationIt: 'Gragnano, NA',
    locationEn: 'Gragnano, NA',
    year: '2022',
    categoryIt: 'Progettazione Architettonica',
    categoryEn: 'Architectural Design',
    descriptionIt: 'Progettazione architettonica e strutturale di una villa bifamiliare su due livelli. Il progetto ha compreso la redazione del progetto architettonico, delle relazioni tecniche e il coordinamento con gli uffici comunali per il rilascio dei permessi.',
    descriptionEn: 'Architectural and structural design of a two-storey semi-detached villa. The project covered architectural drawings, technical reports, and coordination with the municipal offices for permit approval.',
    thumbnail: '/image/work-sm-b.jpg',
    gallery: [
      '/image/gallery/gallery5-large.jpg',
      '/image/gallery/gallery6-large.jpg',
      '/image/gallery/gallery7-large.jpg',
      '/image/gallery/gallery8-large.jpg',
    ],
  },
  {
    slug: 'piano-sicurezza-cantiere-industriale',
    titleIt: 'Piano di sicurezza cantiere industriale',
    titleEn: 'Industrial Site Safety Plan',
    locationIt: 'Nocera Inferiore, SA',
    locationEn: 'Nocera Inferiore, SA',
    year: '2023',
    categoryIt: 'Sicurezza Sul Lavoro',
    categoryEn: 'Workplace Safety',
    descriptionIt: 'Redazione del Piano di Sicurezza e Coordinamento (PSC) e del Piano Operativo di Sicurezza (POS) per un cantiere industriale di media complessità. Sopralluogo, analisi dei rischi e formazione del personale inclusi.',
    descriptionEn: 'Drafting of the Safety and Coordination Plan (PSC) and Operational Safety Plan (POS) for a medium-complexity industrial site. Site inspection, risk analysis, and staff training included.',
    thumbnail: '/image/work-sm-c.jpg',
    gallery: [
      '/image/gallery/gallery9-large.jpg',
      '/image/gallery/gallery10-large.jpg',
      '/image/gallery/gallery11-large.jpg',
      '/image/gallery/gallery12-large.jpg',
    ],
  },
  {
    slug: 'perizia-immobiliare-residenziale',
    titleIt: 'Perizia immobiliare complesso residenziale',
    titleEn: 'Residential Complex Appraisal',
    locationIt: 'Castellammare di Stabia, NA',
    locationEn: 'Castellammare di Stabia, NA',
    year: '2022',
    categoryIt: 'Estimo Immobiliare',
    categoryEn: 'Real Estate Appraisal',
    descriptionIt: 'Perizia estimativa di un complesso residenziale composto da quattro unità immobiliari. La valutazione ha considerato parametri urbanistici, consistenza catastale, stato manutentivo e valori di mercato dell\'area.',
    descriptionEn: 'Valuation appraisal of a residential complex comprising four housing units. The assessment considered urban planning parameters, cadastral data, maintenance condition, and local market values.',
    thumbnail: '/image/work-sm-d.jpg',
    gallery: [
      '/image/gallery/gallery1-large.jpg',
      '/image/gallery/gallery3-large.jpg',
      '/image/gallery/gallery5-large.jpg',
      '/image/gallery/gallery7-large.jpg',
    ],
  },
];
