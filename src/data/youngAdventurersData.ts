export interface DragonProfile {
  id: string;
  name: string;
  category: 'Cromático' | 'Metálico';
  breathWeapon: string;
  secondaryBreath?: string;
  environment: string;
  personality: string;
  hoardFavorite: string;
  survivalTip: string;
  badgeColor: string;
}

export interface DungeonGearItem {
  name: string;
  utility: string;
  howToUse: string;
  iconName: string;
}

export interface DungeonThreat {
  name: string;
  hazardType: string;
  tacticalDefense: string;
  warningSigns: string;
}

export const DRAGONS_COMPENDIUM: DragonProfile[] = [
  {
    id: 'red_dragon',
    name: 'Dragón Rojo',
    category: 'Cromático',
    breathWeapon: 'Cono de Fuego Incinerador (18 m)',
    environment: 'Montañas volcánicas, calderas activas y fortalezas en picos escarpados.',
    personality: 'Megalómano, arrogante y ferozmente territorial. Cree que todo tesoro del mundo le pertenece por derecho divino.',
    hoardFavorite: 'Oro puro, gemas de fuego y armas legendarias forjadas por héroes que él mismo derrotó.',
    survivalTip: 'Jamás discutas con un dragón rojo. Halaga su grandeza sin parecer falso y busca protección contra daño por fuego.',
    badgeColor: '#dc2626'
  },
  {
    id: 'blue_dragon',
    name: 'Dragón Azul',
    category: 'Cromático',
    breathWeapon: 'Línea de Relámpago Abrasador (30 m)',
    environment: 'Desiertos áridos, cañones rocosos y páramos barridos por tormentas de arena.',
    personality: 'Paciente, vanidoso y calculador. Ataca desde las alturas sumergiéndose en la arena para emboscar caravanas.',
    hoardFavorite: 'Gemas azules (zafiros), reliquias de cristal tallado y espejos pulidos.',
    survivalTip: 'No camines en fila india por cañones estrechos; su relámpago en línea atraviesa a todo el grupo a la vez.',
    badgeColor: '#2563eb'
  },
  {
    id: 'green_dragon',
    name: 'Dragón Verde',
    category: 'Cromático',
    breathWeapon: 'Cono de Gas Venenoso (18 m)',
    environment: 'Bosques milenarios, arboledas umbrías y ruinas cubiertas de enredaderas venenosas.',
    personality: 'Maestro del engaño, la manipulación psicológica y el chantaje. Prefiere someter a reyes mediante mentiras antes que quemar sus castillos.',
    hoardFavorite: 'Esmeraldas, estatuas de madera viva talladas por elfos y secretos políticos escritos.',
    survivalTip: 'Todo lo que diga un dragón verde es una trampa calculada. Lleva antídotos universales y protección contra ser envenenado.',
    badgeColor: '#16a34a'
  },
  {
    id: 'black_dragon',
    name: 'Dragón Negro',
    category: 'Cromático',
    breathWeapon: 'Línea de Ácido Corrosivo (18 m)',
    environment: 'Pantanos fétidos, ciénagas anegadas y templos inundados sumergidos.',
    personality: 'Sádico, resentido y cobarde. Disfruta viendo a sus víctimas implorar piedad mientras el ácido derrite sus armaduras.',
    hoardFavorite: 'Monedas antiguas cubiertas de limo y objetos mágicos que resistan la corrosión del ácido.',
    survivalTip: 'Lucha en tierra firme; en el agua su velocidad de nado y ventaja anfibia son casi imbatibles.',
    badgeColor: '#1c1917'
  },
  {
    id: 'white_dragon',
    name: 'Dragón Blanco',
    category: 'Cromático',
    breathWeapon: 'Cono de Frío Glacial (18 m)',
    environment: 'Picos nevados, glaciares árticos y cuevas de hielo eterno.',
    personality: 'El más bestial y feroz de los dragones cromáticos. Actúa guiado por instinto cazador y memoria sensorial implacable.',
    hoardFavorite: 'Joyas congeladas en pilares de hielo transparente y diamantes pulidos.',
    survivalTip: 'Usa fuego para limitar su movilidad en el hielo y evita superficies resbaladizas donde pueda derribarte.',
    badgeColor: '#0ea5e9'
  },
  {
    id: 'gold_dragon',
    name: 'Dragón de Oro',
    category: 'Metálico',
    breathWeapon: 'Cono de Fuego Sagrado (18 m)',
    secondaryBreath: 'Cono de Gas Debilitador (reduce la Fuerza)',
    environment: 'Picos solitarios, desfiladeros brumosos y santuarios ocultos.',
    personality: 'Sabio, benevolente y devoto de la justicia cósmica. Suele adoptar forma de anciano peregrino para poner a prueba la moral de los mortales.',
    hoardFavorite: 'Perlas, pergaminos de sabiduría ancestral y pinturas de gran valor espiritual.',
    survivalTip: 'Muéstrate humilde y sincero; un dragón de oro puede convertirse en el mayor patrón o mentor de tu grupo.',
    badgeColor: '#d97706'
  },
  {
    id: 'silver_dragon',
    name: 'Dragón de Plata',
    category: 'Metálico',
    breathWeapon: 'Cono de Frío Ártico (18 m)',
    secondaryBreath: 'Cono de Gas Paralizador (Parálisis por 1 minuto)',
    environment: 'Castillos en cumbres nubosas y ciudades humanas donde vive disfrazado de humanoide.',
    personality: 'El más amistoso con los humanoides. Le fascina la cultura mortal, la poesía y la caballerosidad heroica.',
    hoardFavorite: 'Obras de arte fino, joyas de plata y libros de historia.',
    survivalTip: 'Invítale a conversar sobre hazañas nobles o filosofía moral; prefiere la diplomacia a la violencia.',
    badgeColor: '#64748b'
  },
  {
    id: 'bronze_dragon',
    name: 'Dragón de Bronce',
    category: 'Metálico',
    breathWeapon: 'Línea de Relámpago Marino (27 m)',
    secondaryBreath: 'Cono de Gas Repulsor (empuja a 18 m)',
    environment: 'Costas rocosas, islas solitarias y barcos naufragados en el lecho marino.',
    personality: 'Inquisitivo, fascinado por la guerra marítima y protector de marineros y flotas que luchen contra la tiranía.',
    hoardFavorite: 'Tesoros rescatados de galeones hundidos, perlas negras y astrolabios.',
    survivalTip: 'Ofrécele un relato épico sobre cómo combates a piratas o monstruos de las profundidades.',
    badgeColor: '#b45309'
  },
  {
    id: 'copper_dragon',
    name: 'Dragón de Cobre',
    category: 'Metálico',
    breathWeapon: 'Línea de Ácido (18 m)',
    secondaryBreath: 'Cono de Gas de Lentitud (ralentiza movimiento y reacciones)',
    environment: 'Cerros rocosos, laberintos de cañones y mesetas áridas.',
    personality: 'Bromista incansable, amante de los acertijos, los juegos de palabras y el humor ingenioso.',
    hoardFavorite: 'Instrumentos musicales finos, gemas talladas con figuras cómicas y copas grabadas.',
    survivalTip: 'Cuéntale un buen chiste o resuelve sus adivinanzas; un grupo con buen humor ganará su simpatía instantánea.',
    badgeColor: '#ea580c'
  },
  {
    id: 'brass_dragon',
    name: 'Dragón de Latón',
    category: 'Metálico',
    breathWeapon: 'Línea de Fuego Solar (27 m)',
    secondaryBreath: 'Cono de Gas de Sueño (sume en letargo pacífico)',
    environment: 'Desiertos cálidos, ruinas arenosas y oasis brillantes.',
    personality: 'Hablador compulsivo. Es capaz de atrapar a un aventurero bajo sus garras solo para obligarlo a escuchar anécdotas durante horas.',
    hoardFavorite: 'Relojes de arena de oro, vasijas parlantes y espejos mágicos.',
    survivalTip: 'Prepárate para una larga conversación. Escuchar con paciencia es la mejor manera de no enfurecer a un dragón de latón.',
    badgeColor: '#ca8a04'
  }
];

export const DUNGEON_GEAR_KIT: DungeonGearItem[] = [
  {
    name: 'El Poste de 3 Metros (10-Foot Pole)',
    utility: 'Detección física de trampas a distancia de seguridad.',
    howToUse: 'Toca cada losa del suelo y techo antes de pisar. Activa placas de presión, losas falsas y cables trampa sin exponerte a la explosión o caída.',
    iconName: 'Shield'
  },
  {
    name: 'Espejo Metálico Pequeño',
    utility: 'Inspección de esquinas y bajo puertas sin asomar la cabeza.',
    howToUse: 'Coloca el espejo en el suelo o deslízalo bajo la rendija de la puerta para observar a los centinelas y verificar la presencia de trampas sin perder cobertura total.',
    iconName: 'Eye'
  },
  {
    name: 'Tiza de Colores & Clavos de Hierro',
    utility: 'Cartografía de escape y bloqueo de puertas.',
    howToUse: 'Marca flechas en las bifurcaciones para no perderte. Usa los clavos de hierro para atrancar puertas tras de ti e impedir que los refuerzos enemigos te flanqueen.',
    iconName: 'Package'
  },
  {
    name: 'Abrojos y Cojinetes de Bolas',
    utility: 'Control de multitudes y ralentización de persecuciones.',
    howToUse: 'Espárcelos en un pasillo estrecho mientras te retiras. Obligan a pruebas de Destreza CD 15 para no quedar tumbados y reducen la velocidad a la mitad.',
    iconName: 'AlertTriangle'
  },
  {
    name: 'Cuerda de Seda de 15 m con Garfio',
    utility: 'Movilidad tridimensional y rescate de fosas.',
    howToUse: 'Pesa la mitad que la cuerda de cáñamo y soporta hasta 500 kilos. Esencial para descender por simas o escapar de túneles verticales de contempladores.',
    iconName: 'Sparkles'
  }
];

export const DUNGEON_THREATS: DungeonThreat[] = [
  {
    name: 'Cubo Gelatinoso',
    hazardType: 'Aberración limpiadora transparente',
    warningSigns: 'El pasillo está sospechosamente reluciente y libre de polvo, pero hay huesos suspendidos flotando en el aire a media altura.',
    tacticalDefense: 'No corras a ciegas. Ataca a distancia con fuego y ácido; si alguien queda engullido, tira de él con una prueba de Fuerza CD 12.'
  },
  {
    name: 'Mímico (Mimic)',
    hazardType: 'Monstruosidad cambiaformas con adhesivo mortal',
    warningSigns: 'Un cofre del tesoro que no tiene cerradura ni polvo encima, o una puerta cuya madera huele a carne cruda.',
    tacticalDefense: 'Golpea el cofre con el poste de 3 metros antes de tocarlo. El alcohol puro disuelve temporalmente su pegamento adhesivo.'
  },
  {
    name: 'Moho Amarillo (Yellow Mold)',
    hazardType: 'Peligro biológico vegetal fúngico',
    warningSigns: 'Manchas doradas opacas en paredes y techos húmedos.',
    tacticalDefense: 'El menor toque hace estallar una nube de esporas (salvación de Con CD 15 o 2d10 veneno y asfixia). Destrúyelo desde lejos con una antorcha o fuego.'
  }
];
