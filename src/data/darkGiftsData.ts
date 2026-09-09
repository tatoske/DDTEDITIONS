import { DarkGiftDef, PanicRollResult } from '../types/dnd';

export const DARK_GIFTS_DATA: DarkGiftDef[] = [
  {
    id: 'gift-symbiote',
    name: 'Piel Simbiótica (Symbiotic Being)',
    tagline: 'Un ente consciente alienígena, demoníaco o fúngico comparte tu cuerpo.',
    description: 'Una criatura u órgano parasitario consciente vive incrustado en tu carne (un rostro parlante en la espalda, zarcillos de sombra o un tentáculo en el torso).',
    boons: [
      'Alerta Constante: El simbionte nunca duerme del todo; tienes ventaja en tiradas de iniciativa y no puedes ser sorprendido.',
      'Conocimiento Compartido: Ganas competencia en dos habilidades a tu elección entre Arcanos, Historia, Naturaleza, Religión, Percepción o Supervivencia.',
      'Soporte Vital: Si tus Puntos de Golpe caen a 0, el simbionte puede forzarte a estabilizarte inmediatamente (1 uso por Descanso Largo).'
    ],
    curses: [
      'Agenda Siniestra: El simbionte tiene sus propios deseos oscuros. Cada vez que obtengas un 1 en el d20 en cualquier tirada, el simbionte toma el control momentáneo de tu cuerpo durante 1 turno para satisfacer su apetito o sabotearte.',
      'Deformidad Física: Tu cuerpo exhibe bultos reptantes, zarcillos o susurros guturales que imponen desventaja en pruebas de Carisma (Persuasión) con gentes que no conozcan tu secreto.'
    ],
    sourceBook: 'Guía de Van Richten para Ravenloft (Capítulo 1)'
  },
  {
    id: 'gift-touch-death',
    name: 'Toque de la Muerte (Touch of Death)',
    tagline: 'Tus extremidades irradian un frío mortal que marchita la vida.',
    description: 'Un aura necrótica concentrada habita tus manos. La ceniza y el frío sepulcral siguen cada una de tus caricias.',
    boons: [
      'Impacto Funesto: Tus ataques desarmados o al tocar infligen 1d10 de daño necrótico adicional. Este daño aumenta a 2d10 a nivel 5, 3d10 a nivel 11 y 4d10 a nivel 17.',
      'Toque Devastador: Puedes canalizar este poder a través de un arma cuerpo a cuerpo que sostengas, imbuyéndola de daño necrótico una vez por turno.'
    ],
    curses: [
      'Marchitez Incontrolable: Todo tejido vegetal vivo que toques se marchita y muere en segundos. Objetos de metal o cristal que sostengas durante más de 1 minuto comienzan a agrietarse y perder durabilidad.',
      'Rechazo Sanador: La magia de curación normal rechaza tu toque; cualquier criatura que intente curarte mediante un toque físico sin guantes bendecidos recibe la mitad del daño necrótico de tu toque.'
    ],
    sourceBook: 'Guía de Van Richten para Ravenloft (Capítulo 1)'
  },
  {
    id: 'gift-mist-walker',
    name: 'Caminante de la Niebla (Mist Walker)',
    tagline: 'La bruma insondable de Ravenloft te reconoce como uno de los suyos.',
    description: 'Las brumas fronterizas que atrapan a los demás viajeros se abren a tu paso, reconociendo la marca de los Poderes Oscuros en tu alma.',
    boons: [
      'Navegante de las Nieblas: Eres inmune a perderte en las Nieblas de Ravenloft o en brumas mágicas, y puedes guiar a hasta 8 acompañantes a través de ellas.',
      'Magia Brumosa: Puedes lanzar los conjuros Bruma de Niebla (Fog Cloud) y Paso Brumoso (Misty Step) sin gastar espacios de conjuro ni componentes materiales (1 vez cada uno por Descanso Largo).'
    ],
    curses: [
      'Disolución Corpórea: Cuando descanses en un lugar que no esté completamente sellado de la niebla, despiertas con partes de tu cuerpo semitraslúcidas y sufres 1 punto de Estrés.',
      'Vulnerabilidad Psíquica: Los susurros de los muertos atrapados en las nieblas invaden tu mente; tienes vulnerabilidad al daño psíquico.'
    ],
    sourceBook: 'Guía de Van Richten para Ravenloft (Capítulo 1)'
  },
  {
    id: 'gift-shadow',
    name: 'Sombra Viviente (Living Shadow)',
    tagline: 'Tu propia sombra tiene apetito y se mueve por su cuenta.',
    description: 'Tu sombra proyectada no coincide exactamente con tus movimientos; a veces se estira, afila sus garras o acecha a espaldas de tus compañeros.',
    boons: [
      'Alcance Sombrío: El alcance de tus ataques cuerpo a cuerpo y conjuros de toque aumenta en 3 metros (10 pies), ya que tu sombra extiende sus garras para golpear por ti.',
      'Manipulación Oscura: Puedes usar tu sombra para interactuar con objetos, abrir cerrojos o recoger armas a hasta 9 metros (30 pies) como Acción Adicional.'
    ],
    curses: [
      'Rebelión de las Sombras: Si fallas una tirada de ataque con un 1 natural en el d20 o si un enemigo consigue un crítico contra ti, tu sombra aprovecha para lanzar un golpe traicionero contra un aliado a 1.5 metros, infligiéndole 1d8 de daño necrótico.',
      'Fobia a la Luz Pura: Cuando te encuentras en un área de luz brillante o mágica, sufres desventaja en tiradas de salvación de Fuerza y Destreza.'
    ],
    sourceBook: 'Guía de Van Richten para Ravenloft (Capítulo 1)'
  },
  {
    id: 'gift-whispers',
    name: 'Susurros del Segador (Gathered Whispers)',
    tagline: 'Un coro de espíritus inquietos zumba en tus oídos día y noche.',
    description: 'Espíritus de aquellos que perecieron en el Dominio del Terror te rodean constantemente, revelando secretos ocultos pero amenazando tu cordura.',
    boons: [
      'Advertencia Espiritual: Los espíritus gritan cuando un enemigo se acerca; sumas +2 a tu Percepción Pasiva y no puedes ser sorprendido.',
      'Manto de Espíritus: Como Acción Adicional, puedes hacer que los espíritus se arremolinen visiblemente a tu alrededor, imponiendo desventaja en los ataques enemigos dirigidos a ti durante 1 ronda (1 uso por descanso corto o largo).'
    ],
    curses: [
      'Cacofonía Enloquecedora: En momentos de combate o pánico intenso (cuando tu puntuación de Estrés es 2 o superior), los espíritus aúllan en tu mente: debes superar una salvación de Sabiduría CD 12 o quedar Ensordecido y Aturdido durante 1 turno.',
      'Insomnio Macabro: Los susurros no cesan mientras duermes; recuperar dados de golpe durante un descanso requiere superar una prueba de Constitución CD 10.'
    ],
    sourceBook: 'Guía de Van Richten para Ravenloft (Capítulo 1)'
  },
  {
    id: 'gift-echoes',
    name: 'Ecos de la Muerte (Echoes of the Death)',
    tagline: 'Ya has visitado el otro lado y la tumba te reclama.',
    description: 'Moriste en algún rincón olvidado de los Dominios del Terror y regresaste, pero tu respiración es gélida y tu corazón late a un ritmo agónicamente lento.',
    boons: [
      'Retorno Tenaz: Tienes ventaja en todas las tiradas de salvación contra la muerte (Death Saves).',
      'Venganza Agónica: Cuando un ataque reduzca tus Puntos de Golpe a 0, puedes usar tu reacción inmediatamente para realizar un ataque o lanzar un truco antes de caer inconsciente.'
    ],
    curses: [
      'Hedor a Mortaja: Desprendes un frío sepulcral; los animales domésticos se rehúsan a acercarse a ti y sufres desventaja en tiradas de Trato con Animales.',
      'Atracción de los No-Muertos: Los muertos vivientes perciben tu afinidad y siempre te priorizarán como objetivo en combate si tienen opción.'
    ],
    sourceBook: 'Guía de Van Richten para Ravenloft (Capítulo 1)'
  },
  {
    id: 'gift-second-skin',
    name: 'Segunda Piel Monstruosa (Second Skin)',
    tagline: 'Una forma bestial o demoníaca duerme bajo tus poros.',
    description: 'Ocultas una metamorfosis temible que altera tu apariencia física revelando garras, escamas serpentinas o pelaje de depredador.',
    boons: [
      'Forma Teratológica: Como Acción Adicional, adoptas tu forma monstruosa durante 10 minutos. Mientras dure, tu Clase de Armadura aumenta en +1 y tus ataques desarmados infligen 1d8 + mod. Fuerza de daño cortante o perforante.',
      'Presencia Aterradora: Tienes ventaja en tiradas de Carisma (Intimidación) mientras estás en tu forma monstruosa.'
    ],
    curses: [
      'Transformación Involuntaria: Si sufres un impacto crítico de un enemigo o tu puntuación de Estrés sube a 4 o más, debes superar una salvación de Sabiduría CD 13 o transformarte inmediatamente sin tu consentimiento.',
      'Rechazo Social: Si eres visto en tu forma monstruosa en una aldea o ciudadela, la población local te considerará una abominación hostil.'
    ],
    sourceBook: 'Guía de Van Richten para Ravenloft (Capítulo 1)'
  }
];

// -------------------------------------------------------------
// TABLA OFICIAL DE REACCIONES DE PÁNICO Y MIEDO (VAN RICHTEN P. 195)
// -------------------------------------------------------------
export const PANIC_TABLE: Array<{ min: number; max: number; title: string; description: string; severity: PanicRollResult['severity'] }> = [
  {
    min: 1,
    max: 4,
    title: 'Petrificado por el Terror',
    description: 'El horror paraliza tus músculos. Caes bajo la condición Asustado (Frightened), tu velocidad se reduce a 0 y no puedes realizar acciones ni reacciones durante 1 turno.',
    severity: 'critica'
  },
  {
    min: 5,
    max: 8,
    title: 'Huida Frenética',
    description: 'El pánico nubla tu razón. En tu turno debes usar todo tu movimiento y la acción de Correr para alejarte lo más posible de la fuente del horror, sin importar el peligro del terreno.',
    severity: 'moderada'
  },
  {
    min: 9,
    max: 11,
    title: 'Temblores Incontrolables',
    description: 'Tus manos tiemblan espasmódicamente. Sufres desventaja en todas tus tiradas de ataque y pruebas de Destreza durante 1 minuto (o hasta superar una salvación de Sabiduría CD 13 al final de tu turno).',
    severity: 'moderada'
  },
  {
    min: 12,
    max: 14,
    title: 'Grito Desgarrador',
    description: 'No puedes contener un chillido agudo de puro pavor. Gastas tu reacción inmediatamente y revelas tu posición exacta a cualquier enemigo a 90 metros a la redonda.',
    severity: 'leve'
  },
  {
    min: 15,
    max: 17,
    title: 'Adrenalina Desesperada',
    description: '¡El instinto animal toma el control! Durante 1 ronda, ignoras tu penalizador de estrés, tu velocidad aumenta en 3 metros y sumas +2 a todas las tiradas de daño por pura furia desesperada.',
    severity: 'adrenalina'
  },
  {
    min: 18,
    max: 19,
    title: 'Ira Salvaje de Supervivencia',
    description: 'El horror despierta tu sed de sangre. Realizas inmediatamente un ataque con arma como reacción contra la criatura hostil más cercana con Ventaja.',
    severity: 'adrenalina'
  },
  {
    min: 20,
    max: 20,
    title: 'Claridad Sobrenatural',
    description: '¡Miras al abismo y el abismo parpadea! Superas el pánico al instante, tu puntuación de Estrés se reduce en 2 puntos y ganas Inspiración Heroica para tu siguiente tirada.',
    severity: 'adrenalina'
  }
];
