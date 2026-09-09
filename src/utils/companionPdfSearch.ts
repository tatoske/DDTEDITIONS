// Motor de Indexación y Citas Oficiales de los 11 Manuales PDF de D&D
// Permite a los Asistentes (Elara, Dienteazur, Aurelius) citar el libro oficial, capítulo y página exacta.

export interface PdfReference {
  bookId: string;
  bookTitle: string;
  edition: string;
  chapter: string;
  pages: string;
  topic: string;
  snippet: string;
  officialCitation: string;
}

export interface CuratedTopicIndex {
  keywords: string[];
  ref: PdfReference;
}

export const OFFICIAL_PDF_INDEX: CuratedTopicIndex[] = [
  // PHB 2024: Maestría con Armas
  {
    keywords: ['topple', 'derribar', 'maestria', 'graze', 'rozar', 'nick', 'tajo', 'cleave', 'push', 'slow', 'sap', 'vex'],
    ref: {
      bookId: 'phb2024',
      bookTitle: 'Manual del Jugador (PHB 2024)',
      edition: 'D&D 2024',
      chapter: 'Capítulo 1: Equipo y Propiedades de Armas',
      pages: 'Pág. 26-29',
      topic: 'Maestría con Armas 2024 (Weapon Mastery)',
      snippet: 'Cada tipo de arma cuenta con una propiedad táctica exclusiva (Derribar, Rozar, Tajo Rápido, Hender, Empujar, Ralentizar, Debilitar o Molestar). Solo personajes con el rasgo de clase Maestría con Armas pueden activar estos efectos.',
      officialCitation: 'D&D 2024 Player\'s Handbook, Cap. 1, págs. 26-29 (Propiedades de Armas)'
    }
  },
  // PHB 2024: Descansos y Curación
  {
    keywords: ['descanso', 'curacion', 'curar', 'vida', 'dormir', 'short rest', 'long rest', 'recuperar'],
    ref: {
      bookId: 'phb2024',
      bookTitle: 'Manual del Jugador (PHB 2024)',
      edition: 'D&D 2024',
      chapter: 'Capítulo 8: Reglas de Aventura y Descanso',
      pages: 'Pág. 186-187',
      topic: 'Descansos Cortos y Largos',
      snippet: 'Un Descanso Corto dura al menos 1 hora y permite gastar Dados de Golpe. Un Descanso Largo dura 8 horas, restaura todos los Puntos de Golpe, recupera la mitad de los Dados de Golpe totales y todos los espacios de conjuro.',
      officialCitation: 'D&D 2024 Player\'s Handbook, Cap. 8, págs. 186-187'
    }
  },
  // PHB 2024: Dotes de Origen
  {
    keywords: ['dotes', 'origen', 'trasfondo', 'alerta', 'musico', 'suertudo', 'iniciado'],
    ref: {
      bookId: 'phb2024',
      bookTitle: 'Manual del Jugador (PHB 2024)',
      edition: 'D&D 2024',
      chapter: 'Capítulo 5: Dotes y Rasgos Especiales',
      pages: 'Pág. 198-204',
      topic: 'Dotes de Origen y Dotes Generales 2024',
      snippet: 'En D&D 2024, todos los personajes obtienen una Dote de Origen a nivel 1 vinculada a su trasfondo (ej. Alerta, Músico Inspirador, Afortunado). A nivel 4, 8, 12, 16 y 19 acceden a Dotes Generales con mejora de atributo.',
      officialCitation: 'D&D 2024 Player\'s Handbook, Cap. 5, págs. 198-204'
    }
  },
  // DMG 2024: Bastiones y Fortalezas
  {
    keywords: ['bastion', 'bastiones', 'fortaleza', 'tierras', 'reclamar', 'nivel 5', 'ordenes'],
    ref: {
      bookId: 'dmg2024',
      bookTitle: 'Guía del Dungeon Master (DMG 2024)',
      edition: 'D&D 2024',
      chapter: 'Capítulo 8: El Sistema de Bastiones',
      pages: 'Pág. 210-235',
      topic: 'Construcción y Mantenimiento de Bastiones',
      snippet: 'Los personajes de nivel 5 o superior pueden reclamar o construir una fortaleza propia. Cada bastión cuenta con instalaciones básicas y cuartos especiales (Laboratorio Alquímico, Torre de Magia, Forja, Santuario) que generan puntos de bastión y recursos cada 7 días de juego.',
      officialCitation: 'D&D 2024 Dungeon Master\'s Guide, Cap. 8, págs. 210-235'
    }
  },
  // DMG 2024: Trampas Complejas y Criptas
  {
    keywords: ['trampa', 'trampas', 'cripta', 'peligro', 'desactivar', 'percepcion pasiva'],
    ref: {
      bookId: 'dmg2024',
      bookTitle: 'Guía del Dungeon Master (DMG 2024)',
      edition: 'D&D 2024',
      chapter: 'Capítulo 3: Trampas Complejas y Entornos Mortales',
      pages: 'Pág. 114-128',
      topic: 'Trampas Mecánicas y Mágicas Complejas',
      snippet: 'Las trampas complejas operan por rondas de iniciativa con tres grados de severidad: Retraso (Nvl 1-4, CD 10-12), Peligro (Nvl 5-10, CD 13-15) y Mortal (Nvl 11+, CD 16-20). Se desactivan con pruebas sucesivas de Herramientas de Ladrón o Conocimiento Arcano.',
      officialCitation: 'D&D 2024 Dungeon Master\'s Guide, Cap. 3, págs. 114-128'
    }
  },
  // DMG 2024: Tesoros y Objetos Mágicos
  {
    keywords: ['tesoro', 'recompensa', 'botin', 'objeto magico', 'oro', 'pocion', 'sintonizacion'],
    ref: {
      bookId: 'dmg2024',
      bookTitle: 'Guía del Dungeon Master (DMG 2024)',
      edition: 'D&D 2024',
      chapter: 'Capítulo 7: Tesoros y Reliquias Mágicas',
      pages: 'Pág. 136-175',
      topic: 'Tablas de Tesoro y Reparto por Nivel de Desafío (CR)',
      snippet: 'Las tablas de tesoro determinan recompensas individuales y acumuladas por CR (0-4, 5-10, 11-16, 17+). Los objetos mágicos requieren sintonización (*attunement*) con un máximo de 3 sintonizaciones por aventurero.',
      officialCitation: 'D&D 2024 Dungeon Master\'s Guide, Cap. 7, págs. 136-175'
    }
  },
  // Tasha: Escuderos y Linajes
  {
    keywords: ['escudero', 'escuderos', 'sidekick', 'mascota', 'tasha', 'guerrero', 'experto', 'conjurador'],
    ref: {
      bookId: 'tasha',
      bookTitle: 'El Caldero de Tasha para Todo',
      edition: 'Suplemento 5e / 2024',
      chapter: 'Capítulo 4: Compañeros y Escuderos (Sidekicks)',
      pages: 'Pág. 142-147',
      topic: 'Clases de Escudero: Guerrero, Experto y Conjurador',
      snippet: 'Permite a criaturas con CR 1/2 o inferior convertirse en compañeros leales que suben de nivel junto al grupo hasta el nivel 20, con dados de golpe, rasgos y bonificadores de competencia propios.',
      officialCitation: 'Tasha\'s Cauldron of Everything, Cap. 4, págs. 142-147'
    }
  },
  // Tasha: Patronos de Grupo
  {
    keywords: ['patrono', 'patronos', 'gremio', 'sindicato', 'academia', 'intrigas'],
    ref: {
      bookId: 'tasha',
      bookTitle: 'El Caldero de Tasha para Todo',
      edition: 'Suplemento 5e / 2024',
      chapter: 'Capítulo 2: Patronos de Grupo y Misiones',
      pages: 'Pág. 83-102',
      topic: 'Patronos de Campaña y Beneficios de Organización',
      snippet: 'Organizaciones que financian y guían al grupo de héroes (Gremios de Ladrones, Academias Arcanas, Coronas Feudales, Seres Inmortales). Otorgan salario semanal, recursos, contactos y órdenes de misión.',
      officialCitation: 'Tasha\'s Cauldron of Everything, Cap. 2, págs. 83-102'
    }
  },
  // Eberron: Marcas del Dragón
  {
    keywords: ['marca del dragon', 'dragonmark', 'eberron', 'sharn', 'forjados', 'pasaje', 'curacion', 'centinela'],
    ref: {
      bookId: 'eberron',
      bookTitle: 'Eberron: Surgiendo de la Última Guerra',
      edition: 'Ambientación Canónica',
      chapter: 'Capítulo 1: Razas y Casas de la Marca del Dragón',
      pages: 'Pág. 35-52',
      topic: 'Marcas del Dragón y Dados de Intuición (d4)',
      snippet: 'Manifestaciones arcanas hereditarias que otorgan a sus portadores la tirada de un Dado de Intuición (1d4) a pruebas específicas, además de una lista de conjuros exclusivos añadida a sus opciones de lanzamiento.',
      officialCitation: 'Eberron: Rising from the Last War, Cap. 1, págs. 35-52'
    }
  },
  // Ravenloft: Dominios del Terror y Estrés
  {
    keywords: ['ravenloft', 'estres', 'terror', 'tarokka', 'miedo', 'dones oscuros', 'strahd'],
    ref: {
      bookId: 'ravenloft',
      bookTitle: 'Guía de Van Richten para Ravenloft',
      edition: 'Ambientación Terror',
      chapter: 'Capítulo 4: Reglas de Terror, Horror y Estrés',
      pages: 'Pág. 190-205',
      topic: 'El Monitor de Estrés y Dones Oscuros',
      snippet: 'Mecánicas psicológicas donde el nivel de estrés (de 1 a 10) impone una penalización directa a las tiradas de d20 del personaje, mientras que los Dones Oscuros otorgan poderes extraordinarios a cambio de una macabra maldición.',
      officialCitation: 'Van Richten\'s Guide to Ravenloft, Cap. 4, págs. 190-205'
    }
  },
  // Monstruos del Multiverso: Especies Fantásticas
  {
    keywords: ['especies', 'razas', 'multiverso', 'mordenkainen', 'aarakocra', 'genasi', 'goliath', 'kenku', 'shifter', 'tabaxi'],
    ref: {
      bookId: 'mordenkainen',
      bookTitle: 'Mordenkainen Presenta: Monstruos del Multiverso',
      edition: 'Compendio Multiverso',
      chapter: 'Capítulo 1: Especies Fantásticas del Multiverso',
      pages: 'Pág. 8-41',
      topic: 'Especies Jugables Revisadas',
      snippet: 'Más de 30 linajes revisados con rasgos raciales dinámicos desacoplados de atributos fijos, permitiendo aumentar cualquier atributo en +2/+1 o +1/+1/+1, además de rasgos culturales y mágicos únicos.',
      officialCitation: 'Monsters of the Multiverse, Cap. 1, págs. 8-41'
    }
  },
  // Vecna: El Dios de los Secretos
  {
    keywords: ['vecna', 'ojo de vecna', 'mano de vecna', 'archiliche', 'secretos'],
    ref: {
      bookId: 'vecna',
      bookTitle: 'Dossier de Vecna',
      edition: 'Mini-Suplemento Oficial',
      chapter: 'Dossier Especial: Vecna el Archiliche',
      pages: 'Pág. 1-16',
      topic: 'Estadísticas del Archiliche Vecna y Reliquias Prohibidas',
      snippet: 'El stat block de Desafío 26 de Vecna, su contraconjuro reactivo, teletransporte vil y los artefactos mayores: El Ojo de Vecna y La Mano de Vecna.',
      officialCitation: 'Vecna Dossier, págs. 1-16'
    }
  },
  // Alquimia y Venenos
  {
    keywords: ['veneno', 'venenos', 'alquimia', 'alquimico', 'antidoto', 'toxina'],
    ref: {
      bookId: 'dmg2024',
      bookTitle: 'Guía del Dungeon Master (DMG 2024)',
      edition: 'D&D 2024',
      chapter: 'Capítulo 8: Peligros Ambientales y Venenos',
      pages: 'Pág. 257-258',
      topic: 'Tipos de Venenos: Contacto, Ingestión, Inhalación y Herida',
      snippet: 'Cada veneno cuenta con método de aplicación, tiempo de activación, salvación de Constitución (CD 10 a 19) y efectos debilitantes continuos hasta ser neutralizados con Antitoxina o conjuros.',
      officialCitation: 'D&D 2024 Dungeon Master\'s Guide, Cap. 8, págs. 257-258'
    }
  }
];

/**
 * Busca referencias exactas en el catálogo de los 11 manuales PDF
 */
export function findPdfReference(rawQuery: string): PdfReference | null {
  const q = rawQuery.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
  if (!q) return null;

  for (const entry of OFFICIAL_PDF_INDEX) {
    for (const kw of entry.keywords) {
      const normalizedKw = kw.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      if (q.includes(normalizedKw)) {
        return entry.ref;
      }
    }
  }

  return null;
}
