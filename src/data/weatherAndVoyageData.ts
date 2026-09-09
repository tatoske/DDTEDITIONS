import {
  WeatherConditionDef,
  MistIncident,
  RavenloftDomainDef,
  ShipStats,
  NavalHazard
} from '../types/dnd';

// -------------------------------------------------------------
// 1. CONDICIONES CLIMÁTICAS MUNDANAS, EXTREMAS Y SOBRENATURALES
// -------------------------------------------------------------
export const WEATHER_CONDITIONS: WeatherConditionDef[] = [
  {
    id: 'clear',
    name: 'Cielo Despejado y Brisa Serena',
    category: 'mundane',
    temperatureDesc: '18°C a 24°C (Templado ideal)',
    visibilityDesc: 'Visibilidad máxima (hasta el horizonte, ~3 a 5 millas).',
    mechanicalEffects: [
      'Sin penalizadores de viaje ni combate.',
      'Ventaja pasiva en pruebas de navegación y orientación celestial nocturna.',
      'Condición ideal para descansos cortos y largos al aire libre.'
    ],
    requiresSave: false,
    sourceBook: 'Guía del Dungeon Master 2024',
    badgeColor: '#10b981'
  },
  {
    id: 'extreme_cold',
    name: 'Frío Extremo y Ventisca Polar',
    category: 'extreme',
    temperatureDesc: 'Inferior a -18°C (Bajo cero severo)',
    visibilityDesc: 'Visibilidad reducida a 60 pies si hay nieve levantada por el viento.',
    mechanicalEffects: [
      'Cada hora expuesto sin ropa invernal adecuada exige una Salvación de Constitución CD 10 o sufrir 1 nivel de agotamiento.',
      'Las aguas abiertas están congeladas o a temperatura mortal: sumergirse exige salvación de CON cada minuto o 1 nivel de fatiga.',
      'El hielo fino y la nieve profunda cuentan como Terreno Difícil (la velocidad se reduce a la mitad).',
      'Desventaja en pruebas de Sabiduría (Percepción) basadas en el oído por el aullido del viento.'
    ],
    requiresSave: true,
    saveType: 'con',
    baseDc: 10,
    sourceBook: 'Guía del Dungeon Master 2024',
    badgeColor: '#0ea5e9'
  },
  {
    id: 'extreme_heat',
    name: 'Calor Extremo y Sol Abrasador',
    category: 'extreme',
    temperatureDesc: 'Superior a 38°C (Horno desértico)',
    visibilityDesc: 'Ondulaciones de calor en el aire; distancias lejanas presentan espejismos.',
    mechanicalEffects: [
      'Cada hora expuesto sin beber al menos 2 galones de agua/día exige una Salvación de Constitución CD 10 (+1 acumulativo por cada hora subsiguiente) o ganar 1 nivel de agotamiento.',
      'Portar armadura pesada o media impone automáticamente Desventaja en esta tirada de salvación.',
      'El suelo arenoso o rocoso recalentado inflige 1d4 de daño por fuego a criaturas descalzas.',
      'Viajar a marcha forzada durante las horas de mediodía duplica las tiradas de agotamiento.'
    ],
    requiresSave: true,
    saveType: 'con',
    baseDc: 10,
    sourceBook: 'Guía del Dungeon Master 2024',
    badgeColor: '#ea580c'
  },
  {
    id: 'heavy_rain',
    name: 'Lluvia Torrencial y Monzón',
    category: 'extreme',
    temperatureDesc: '12°C a 16°C (Húmedo y frío constante)',
    visibilityDesc: 'Ocultación ligera constante en toda el área (visibilidad máx. 100 pies).',
    mechanicalEffects: [
      'Todas las pruebas de Sabiduría (Percepción) basadas en la vista o el oído tienen Desventaja.',
      'Apaga automáticamente antorchas ordinarias, hogueras y llamas no mágicas desprotegidas.',
      'El barro resultante convierte caminos de tierra en Terreno Difícil para carretas y monturas.',
      'Ataques con armas a distancia tienen desventaja más allá de su alcance normal.'
    ],
    requiresSave: false,
    sourceBook: 'Guía del Dungeon Master 2024',
    badgeColor: '#3b82f6'
  },
  {
    id: 'strong_wind',
    name: 'Viento Huracanado de Frente',
    category: 'extreme',
    temperatureDesc: 'Variable con ráfagas heladas de más de 80 km/h',
    visibilityDesc: 'Polvo, hojas y arenilla en suspensión.',
    mechanicalEffects: [
      'Desventaja en todas las tiradas de ataque con armas a distancia (arcos, ballestas, jabalinas).',
      'Desventaja en pruebas de Sabiduría (Percepción) basadas en el oído.',
      'Apaga inmediatamente llamas no mágicas descubiertas y dispersa nieblas mundanas.',
      'Las criaturas voladoras que avancen contra el viento ven su velocidad reducida a la mitad y deben aterrizar al final de su turno o ser derribadas.'
    ],
    requiresSave: false,
    sourceBook: 'Guía del Dungeon Master 2024',
    badgeColor: '#64748b'
  },
  {
    id: 'high_altitude',
    name: 'Gran Altitud (Picos Rocosos > 3,000 m)',
    category: 'extreme',
    temperatureDesc: 'Frío cortante y escasez de oxígeno',
    visibilityDesc: 'Cielos diáfanos o bancos de nubes bajas circundantes.',
    mechanicalEffects: [
      'Cada hora de viaje o combate cuenta como dos horas a efectos de determinar marcha forzada y fatiga.',
      'Criaturas no aclimatadas (requiere 30 días viviendo en la altitud) sufren desventaja en pruebas de Fuerza (Atletismo) y Constitución.',
      'A más de 20,000 pies (6,000 m), las criaturas sufren asfixia progresiva sin protección mágica.'
    ],
    requiresSave: true,
    saveType: 'con',
    baseDc: 12,
    sourceBook: 'Guía del Dungeon Master 2024',
    badgeColor: '#8b5cf6'
  },
  {
    id: 'ash_rain',
    name: 'Lluvia de Ceniza Nigromántica',
    category: 'supernatural',
    temperatureDesc: 'Aire sulfuroso y seco con copos de ceniza púrpura',
    visibilityDesc: 'Niebla de polvo gris que oscurece el sol en una penumbra perenne.',
    mechanicalEffects: [
      'Toda curación mágica (pociones, conjuros como Curar Heridas) se reduce a la mitad.',
      'Los no-muertos dentro de la zona ganan Resistencia al daño Radiante y +2 a sus tiradas de salvación.',
      'Permanecer más de 4 horas al descubierto exige Salvación de Constitución CD 13 o contraer Tos de Ceniza (desventaja en pruebas de Atletismo).'
    ],
    requiresSave: true,
    saveType: 'con',
    baseDc: 13,
    sourceBook: 'Guía de Xanathar para Todo',
    badgeColor: '#7c3aed'
  },
  {
    id: 'eldritch_wind',
    name: 'Tormenta de Disyunción / Vientos Eldritch',
    category: 'supernatural',
    temperatureDesc: 'Olor a ozono cargado con descargas eléctricas violetas',
    visibilityDesc: 'Distorsiones en el espacio con destellos de luz espectral.',
    mechanicalEffects: [
      'Cualquier lanzador que mantenga la concentración en un conjuro debe superar una Salvación de Constitución CD 15 al inicio de cada uno de sus turnos o perder la concentración.',
      'Al lanzar un conjuro de nivel 1 o superior, tirar 1d20: con un 1 natural se produce una Sobrecarga Salvaje de Magia.',
      'Los objetos mágicos sintonizados zumban y emiten luz tenue en 10 pies.'
    ],
    requiresSave: true,
    saveType: 'con',
    baseDc: 15,
    sourceBook: 'Guía de Xanathar para Todo',
    badgeColor: '#ec4899'
  },
  {
    id: 'illusory_fog',
    name: 'Niebla Ilusoria y Laberíntica',
    category: 'supernatural',
    temperatureDesc: 'Humedad pegajosa con frío sobrenatural',
    visibilityDesc: 'Visibilidad bloqueada más allá de 10 pies (Ocultación Pesada).',
    mechanicalEffects: [
      'El terreno cambia ante los ojos: avanzar sin perderse requiere una prueba de Sabiduría (Supervivencia) CD 15 cada hora; si falla, el grupo vuelve al punto de partida.',
      'Susurros y sombras engañosas causan Desventaja en tiradas de Iniciativa.',
      'Las criaturas con Visión Verdadera o Visión Ciega ignoran la desorientación.'
    ],
    requiresSave: true,
    saveType: 'wis',
    baseDc: 15,
    sourceBook: 'Guía de Xanathar para Todo',
    badgeColor: '#059669'
  },
  {
    id: 'aberrant_spores',
    name: 'Bioluminiscencia Aberrante Flotante',
    category: 'supernatural',
    temperatureDesc: 'Aire tibio cargado con esporas microscópicas brillantes',
    visibilityDesc: 'Penumbra fosforescente azul verdosa que ilumina 20 pies a la redonda.',
    mechanicalEffects: [
      'Las esporas se adhieren a todo: anula por completo la Invisibilidad y la cobertura ligera.',
      'Todas las criaturas en el área brillan débilmente: los ataques contra ellas tienen Ventaja.',
      'Inhalar las esporas exige Salvación de Sabiduría CD 13 o sufrir alucinaciones cósmicas durante 1 hora (condición Asustado de las sombras).'
    ],
    requiresSave: true,
    saveType: 'wis',
    baseDc: 13,
    sourceBook: 'El Caldero de Tasha & Xanathar',
    badgeColor: '#14b8a6'
  },
  {
    id: 'acid_rain',
    name: 'Lluvia Ácida de Caos Elemental',
    category: 'supernatural',
    temperatureDesc: 'Llovizna chisporroteante de color esmeralda que quema la piel',
    visibilityDesc: 'Vaho acre y humo ascendente del suelo corroído.',
    mechanicalEffects: [
      'Cada 10 minutos pasados sin cobertura sólida infligen 1d4 de daño por ácido a cada criatura descubierta.',
      'Los escudos de madera y la ropa no mágica se degradan progresivamente (-1 a la CA tras 30 minutos continuos).',
      'El agua dulce al aire libre queda envenenada y no apta para consumo.'
    ],
    requiresSave: true,
    saveType: 'dex',
    baseDc: 12,
    sourceBook: 'Guía del Dungeon Master 2024',
    badgeColor: '#84cc16'
  }
];

// -------------------------------------------------------------
// 2. LAS BRUMAS DE RAVENLOFT Y DOMINIOS DEL TERROR
// -------------------------------------------------------------
export const RAVENLOFT_MIST_INCIDENTS: MistIncident[] = [
  {
    roll: 1,
    title: 'Susurros de los Seres Amados Fallecidos',
    dc: 13,
    saveAbility: 'wis',
    description: 'De entre los vapores grisáceos emergen voces de familiares o mentores muertos, rogando ayuda o acusándote de su fin.',
    stressRisk: 1,
    consequence: 'Gana 1 punto de Estrés de Ravenloft. Desventaja en la próxima prueba de Carisma.'
  },
  {
    roll: 2,
    title: 'Bucle Espacial de Niebla Eterna',
    dc: 14,
    saveAbility: 'wis',
    description: 'Caminan durante horas siguiendo una brújula giratoria, solo para encontrar sus propias huellas frescas en el barro.',
    stressRisk: 1,
    consequence: 'El grupo pierde 4 horas de viaje y debe superar una tirada de CON CD 12 o ganar 1 nivel de agotamiento.'
  },
  {
    roll: 3,
    title: 'Garras de Vapor Asfixiante',
    dc: 15,
    saveAbility: 'con',
    description: 'La niebla se condensa en filamentos húmedos que se introducen por la garganta y la nariz de los viajeros.',
    stressRisk: 0,
    consequence: 'Sufre 2d6 de daño necrótico y no puede recuperar el aliento durante 1 minuto (silenciado).'
  },
  {
    roll: 4,
    title: 'Aparición del Rostro del Señor Oscuro',
    dc: 14,
    saveAbility: 'wis',
    description: 'Las nubes de niebla se arremolinan dibujando una silueta gigantesca que ríe con desprecio infinito hacia los intrusos.',
    stressRisk: 2,
    consequence: 'Gana 2 puntos de Estrés de Ravenloft y queda bajo la condición Asustado durante 1 hora.'
  },
  {
    roll: 5,
    title: 'Pérdida de Recuerdos Felices',
    dc: 13,
    saveAbility: 'wis',
    description: 'Un frío punzante en la frente hace que un recuerdo preciado del hogar se disuelva en la nada de la bruma.',
    stressRisk: 1,
    consequence: 'Gana 1 punto de Estrés y pierde cualquier punto de Inspiración Heroica activo.'
  },
  {
    roll: 6,
    title: 'Campanadas Espectrales del Inframundo',
    dc: 12,
    saveAbility: 'wis',
    description: 'Se oye un fúnebre tañido de campanas de catedral a pocos metros, pero al avanzar solo hay árboles muertos y cuervos silenciosos.',
    stressRisk: 1,
    consequence: 'Gana 1 punto de Estrés de Ravenloft.'
  },
  {
    roll: 7,
    title: 'Falso Claro de Luna Agradecido',
    dc: 13,
    saveAbility: 'wis',
    description: 'La niebla parece abrirse mostrando un sendero acogedor con un farol encendido. Es una ilusión de los Poderes Oscuros.',
    stressRisk: 1,
    consequence: 'El grupo cae en una ciénaga fétida o zarzal espinoso sufriendo 1d8 de daño cortante.'
  },
  {
    roll: 8,
    title: 'Eco de Pasos Incesantes a la Espalda',
    dc: 14,
    saveAbility: 'wis',
    description: 'Pasos pesados y arrastrados siguen al grupo a exactamente 10 pasos de distancia. Si se detienen, los pasos también paran.',
    stressRisk: 1,
    consequence: 'El grupo no puede obtener beneficios de descanso corto mientras permanezca en este tramo de bruma.'
  },
  {
    roll: 9,
    title: 'Aura Condensada de Maldición de Dominio',
    dc: 15,
    saveAbility: 'con',
    description: 'La bruma se tiñe de un tono carmesí oscuro y sabe a sangre de hierro en los labios.',
    stressRisk: 1,
    consequence: 'Desventaja en todas las tiradas de salvación de muerte durante las próximas 24 horas.'
  },
  {
    roll: 10,
    title: 'Cruzar el Umbral de los Poderes Oscuros',
    dc: 15,
    saveAbility: 'wis',
    description: 'La bruma se rasga como una cortina de seda negra. El grupo ha atravesado la frontera entre reinos.',
    stressRisk: 2,
    consequence: 'El grupo es depositado en el linde de un Dominio del Terror al azar (Barovia, Lamordia o Falkovnia).'
  }
];

export const RAVENLOFT_DOMAINS: RavenloftDomainDef[] = [
  {
    id: 'barovia',
    name: 'Barovia',
    darklord: 'Conde Strahd von Zarovich (Vampiro Anciano)',
    genre: 'Terror Gótico & Desesperanza',
    mistTalisman: 'Moneda de plata con el blasón de los von Zarovich o pétalo de rosa negra disecada.',
    description: 'Un valle escarpado entre las montañas de Balinok bajo una penumbra perpetua donde los lobos aúllan y el castillo Ravenloft domina el abismo.',
    dangerLevel: 'Mortal (Niveles 1 a 10+)'
  },
  {
    id: 'lamordia',
    name: 'Lamordia',
    darklord: 'Dra. Viktra Mordenheim (Científica Obsesiva)',
    genre: 'Terror de Ciencia Corporal & Frankenstein',
    mistTalisman: 'Bisturí oxidado o válvula de latón con un corazón biomecánico en miniatura.',
    description: 'Una costa ártica azotada por ventiscas y mares de hielo flotante, donde fábricas humeantes experimentan con la reanimación de la carne.',
    dangerLevel: 'Severo (Niveles 4 a 12)'
  },
  {
    id: 'falkovnia',
    name: 'Falkovnia',
    darklord: 'Vladeska Drakov (Comandante Tiraníca)',
    genre: 'Apocalipsis Zombie & Asedio Militar',
    mistTalisman: 'Insignia de halcón de hierro ensangrentada o bala de mosquete hendida.',
    description: 'Un estado policial amurallado sitiado permanentemente por hordas infinitas de muertos vivientes que emergen de los bosques cada luna nueva.',
    dangerLevel: 'Desesperado (Niveles 3 a 10)'
  },
  {
    id: 'har_akir',
    name: 'Har\'Akir',
    darklord: 'Ankhtepot (Momia Faraónica Condenada)',
    genre: 'Terror Desértico & Maldiciones Milenarias',
    mistTalisman: 'Escarabajo de lapislázuli o venda de lino aromatizada con mirra y polvo de tumba.',
    description: 'Dunas ardientes y templos colosales semienterrados donde los sacerdotes momificados cobran tributo en almas y agua dulce.',
    dangerLevel: 'Alto (Niveles 5 a 14)'
  },
  {
    id: 'dementlieu',
    name: 'Dementlieu',
    darklord: 'Saidra d\'Honaire (La Falsa Duquesa)',
    genre: 'Terror Psicológico & Apariencias Mortales',
    mistTalisman: 'Máscara de carnaval veneciana de porcelana o invitación a un baile de gala sellada en cera.',
    description: 'Una urbe resplandeciente de salones de ópera, banquetes y bailes de máscaras donde cualquier desliz social es castigado con la ejecución o el destierro a las cloacas.',
    dangerLevel: 'Medio (Intriga & Engaño)'
  },
  {
    id: 'kalakeri',
    name: 'Kalakeri',
    darklord: 'Ramya Vasavadan (Reina Asesina & Hermanos Traidores)',
    genre: 'Terror de Guerra Civil Dinástica',
    mistTalisman: 'Daga con mango de jade grabada con una cobra dorada.',
    description: 'Selvas tropicales exhuberantes y palacios en ruinas desgarrados por una guerra fratricida entre tres pretendientes inmortales.',
    dangerLevel: 'Alto (Niveles 6 a 12)'
  }
];

// -------------------------------------------------------------
// 3. NAVÍOS CANÓNICOS (DMG 2024 & NAVEGACIÓN)
// -------------------------------------------------------------
export const SHIPS_CATALOG: ShipStats[] = [
  {
    id: 'rowboat',
    name: 'Bote de Remos / Chalupa',
    ac: 11,
    maxHp: 50,
    crewMin: 1,
    crewMax: 4,
    speedKnots: 2,
    cargoTons: 0.5,
    damageThreshold: 0,
    costGp: 50,
    description: 'Embarcación ligera de madera para cruzar ríos o transportar exploradores desde un barco fondeado a la orilla.'
  },
  {
    id: 'keelboat',
    name: 'Falúa / Quilla Fluvial',
    ac: 15,
    maxHp: 100,
    crewMin: 1,
    crewMax: 6,
    speedKnots: 3,
    cargoTons: 7,
    damageThreshold: 10,
    costGp: 3000,
    description: 'Barco fluvial de fondo plano ideal para navegar por deltas, canales y costas calmas con velas pequeñas y pértigas.'
  },
  {
    id: 'longship',
    name: 'Dracar / Navío Largo Nórdico',
    ac: 15,
    maxHp: 160,
    crewMin: 20,
    crewMax: 40,
    speedKnots: 5,
    cargoTons: 10,
    damageThreshold: 15,
    costGp: 10000,
    description: 'Rápido y temible barco vikingo de guerra impulsado por filas de remeros vigorosos y una vela cuadrada para asaltos costeros relámpago.'
  },
  {
    id: 'sailing_ship',
    name: 'Carabela / Velero Mercante de Tres Mástiles',
    ac: 15,
    maxHp: 300,
    crewMin: 20,
    crewMax: 30,
    speedKnots: 4,
    cargoTons: 100,
    damageThreshold: 15,
    costGp: 10000,
    description: 'El clásico buque transoceánico para expediciones a tierras lejanas, con bodegas espaciosas y velas latinas para navegar contra el viento.'
  },
  {
    id: 'galley',
    name: 'Galera Imperial de Remo y Espolón',
    ac: 15,
    maxHp: 500,
    crewMin: 80,
    crewMax: 120,
    speedKnots: 4,
    cargoTons: 150,
    damageThreshold: 20,
    costGp: 30000,
    description: 'Navío bélico de gran porte con un espolón de bronce reforzado en proa y catapultas o balistas sobre cubierta.'
  },
  {
    id: 'warship',
    name: 'Navío de Guerra / Galeón Real',
    ac: 15,
    maxHp: 500,
    crewMin: 60,
    crewMax: 80,
    speedKnots: 4,
    cargoTons: 200,
    damageThreshold: 20,
    costGp: 25000,
    description: 'Fortaleza flotante de doble puente con baterías de cañones arcanos o balistas dobles, diseñada para dominar los mares soberanos.'
  }
];

// -------------------------------------------------------------
// 4. PELIGROS NÁUTICOS Y DE ALTAMAR (d20)
// -------------------------------------------------------------
export const NAVAL_HAZARDS: NavalHazard[] = [
  {
    roll: 1,
    title: 'Arrecife de Dientes de Tiburón Oculto',
    hazardType: 'environment',
    dc: 14,
    checkSkill: 'Herramientas de Navegante o Vehículos (Acuáticos)',
    description: 'Formación de coral afilado oculta bajo la superficie del agua en marea baja.',
    consequences: 'Si falla la prueba del timonel, el casco encalla y sufre 4d10 de daño contundente, comenzando a hacer agua.',
    hullDamageDice: '4d10'
  },
  {
    roll: 2,
    title: 'El Navío Fantasma a la Deriva',
    hazardType: 'supernatural',
    dc: 13,
    checkSkill: 'Sabiduría (Percepción)',
    description: 'Un bergantín carcomido con velámenes negros desgarrados surge entre la niebla marina sin nadie al timón.',
    consequences: 'Al abordarlo para rescatar el cuaderno de bitácora, 1d4 Sombras o Espectros atacan a los marineros.',
    hullDamageDice: '0'
  },
  {
    roll: 3,
    title: 'El Canto Hechizante de las Sirenas',
    hazardType: 'creature',
    dc: 14,
    checkSkill: 'Tirada de Salvación de Sabiduría',
    description: 'Melodías celestiales resuenan en los peñascos. Toda la tripulación en cubierta siente el impulso irresistible de arrojarse al mar.',
    consequences: 'Quienes fallen quedan Hechizados e intentan nadar hacia las rocas hasta ser devorados o atados al mástil.'
  },
  {
    roll: 4,
    title: 'Fuego de San Telmo y Arcos Voltaicos',
    hazardType: 'supernatural',
    dc: 13,
    checkSkill: 'Inteligencia (Arcanos) o Destreza (Acrobacias)',
    description: 'Llamas azuladas sin calor bailan sobre los mástiles y jarcias antes de emitir una descarga eléctrica.',
    consequences: 'Los marineros en el aparejo deben descender con éxito o sufrir 3d6 de daño por relámpago.',
    hullDamageDice: '2d8'
  },
  {
    roll: 5,
    title: 'Avistamiento de Tentáculos de Kraken',
    hazardType: 'creature',
    dc: 15,
    checkSkill: 'Carisma (Intimidación o Persuasión del Capitán)',
    description: 'Una masa oscura del tamaño de una isla emerge brevemente y un tentáculo descomunal golpea el costado del barco.',
    consequences: 'El barco sufre 6d10 de daño por fuerza si no se sacrifica ganado o se huye a toda vela.',
    hullDamageDice: '6d10'
  },
  {
    roll: 6,
    title: 'Banco de Niebla Bioluminiscente Espesa',
    hazardType: 'supernatural',
    dc: 14,
    checkSkill: 'Sabiduría (Supervivencia marina)',
    description: 'Una niebla densa que brilla en color aguamarina confunde las brújulas y anula la orientación por estrellas.',
    consequences: 'El barco pierde 1 día de viaje completo navegando en círculos y consume 1 ración adicional de agua dulce.'
  },
  {
    roll: 7,
    title: 'El Maelstrom / Gran Remolino Devorador',
    hazardType: 'environment',
    dc: 16,
    checkSkill: 'Fuerza (Atletismo) y Vehículos (Acuáticos)',
    description: 'Un embudo gigantesco en el océano arrastra los restos de maderas hacia un abismo submarino.',
    consequences: 'Exige una maniobra crítica de virada; si falla, el barco sufre 8d10 de daño y pierde 1d4 marineros por la borda.',
    hullDamageDice: '8d10'
  },
  {
    roll: 8,
    title: 'Banco de Algas Asfixiantes (El Mar de los Sargazos)',
    hazardType: 'environment',
    dc: 13,
    checkSkill: 'Fuerza (Atletismo) para cortar algas',
    description: 'Millas de vegetación marina espesa que se enreda en el timón y frena las quillas hasta inmovilizar la nave.',
    consequences: 'La velocidad del barco se reduce a 0 nudos durante 24 horas a menos que la tripulación trabaje a brazo partido.'
  },
  {
    roll: 9,
    title: 'Motín Incipiente por Agua Podrida',
    hazardType: 'supernatural',
    dc: 14,
    checkSkill: 'Carisma (Persuasión o Intimidación)',
    description: 'Los barriles de agua potable se han llenado de gusanos verdosos; marineros desesperados amenazan con romper las bodegas del capitán.',
    consequences: 'Si el capitán falla la prueba, se desata una revuelta violenta en cubierta.'
  },
  {
    roll: 10,
    title: 'Calma Chicha Sobrenatural',
    hazardType: 'environment',
    dc: 12,
    checkSkill: 'Sabiduría (Naturaleza o Religión)',
    description: 'El viento cesa por completo. El mar parece un espejo de mercurio congelado bajo un sol que no perdona.',
    consequences: 'El barco no puede avanzar a vela (0 millas) en las siguientes 24 horas y se consumen raciones dobles de agua dulce.'
  },
  {
    roll: 11,
    title: 'Tormenta de Granizo del Tamaño de Melones',
    hazardType: 'environment',
    dc: 13,
    checkSkill: 'Destreza (Salvación) para refugiarse bajo cubierta',
    description: 'Nubarrones negros descargan esferas de hielo sólido que perforan las lonas y abollan los mamparos.',
    consequences: '2d10 de daño contundente a las velas y 2d6 a cualquier personaje que permanezca en cubierta desprotegido.',
    hullDamageDice: '2d10'
  },
  {
    roll: 12,
    title: 'Iceberg Azul a la Deriva en Aguas Cálidas',
    hazardType: 'environment',
    dc: 15,
    checkSkill: 'Sabiduría (Percepción del Vigía)',
    description: 'Un bloque de hielo glacial de origen mágico flota camuflado entre la bruma matutina en rumbo de colisión directa.',
    consequences: 'Si el vigía falla, colisión frontal: 5d10 de daño penetrante al casco.',
    hullDamageDice: '5d10'
  },
  {
    roll: 13,
    title: 'Tromba Marina / Torbellino de Agua Flotante',
    hazardType: 'environment',
    dc: 15,
    checkSkill: 'Destreza (Vehículos Acuáticos del Timonel)',
    description: 'Una columna vertical de agua salada que conecta el cielo con las olas gira hacia la banda de babor.',
    consequences: 'El navío es azotado violentamente: el mástil de mesana sufre 3d10 de daño y el rumbo se desvía 20 millas.',
    hullDamageDice: '3d10'
  },
  {
    roll: 14,
    title: 'Aparición de Tiburones Cazadores de Sangre',
    hazardType: 'creature',
    dc: 12,
    checkSkill: 'Sabiduría (Trato con Animales o Supervivencia)',
    description: 'Una jauría de tiburones gigantes rodea la quilla, golpeando el timón atraídos por el olor a raciones.',
    consequences: 'Cualquier marinero o personaje que caiga al agua es blanco inmediato de 2 ataques con ventaja.'
  },
  {
    roll: 15,
    title: 'Brote de Fiebre de Altamar',
    hazardType: 'environment',
    dc: 13,
    checkSkill: 'Sabiduría (Medicina)',
    description: 'Fiebre alta, delirios y erupciones cutáneas debilitan a un tercio de la tripulación en los camarotes.',
    consequences: 'La nave opera a tripulación reducida (-2 nudos a la velocidad diaria) hasta que sean tratados con magia o descanso.'
  },
  {
    roll: 16,
    title: 'Fuegos Fatuos de Ahogados en el Mascarón',
    hazardType: 'supernatural',
    dc: 14,
    checkSkill: 'Inteligencia (Religión o Arcanos)',
    description: 'Esferas espectrales luminosas se posan sobre el mascarón de proa, susurrando coordenadas hacia una fosa abisal.',
    consequences: 'Seguir sus luces lleva a un cementerio de naves sumergidas repleto de tesoros pero vigilado por ahogados.'
  },
  {
    roll: 17,
    title: 'Corriente Traicionera del Abismo',
    hazardType: 'environment',
    dc: 14,
    checkSkill: 'Herramientas de Navegante',
    description: 'Una corriente submarina invisible arrastra el barco a doble velocidad pero en dirección errónea.',
    consequences: 'El barco amanece a 40 millas de su destino planificado a menos que el navegante corrija el curso a tiempo.'
  },
  {
    roll: 18,
    title: 'Enjambre de Rayas Eléctricas en el Casco',
    hazardType: 'creature',
    dc: 13,
    checkSkill: 'Constitución (Salvación) al tocar el timón o ancla de metal',
    description: 'Cientos de criaturas bioluminiscentes se adhieren al fondo de cobre de la nave, electrificando las partes metálicas.',
    consequences: 'Tocar las cadenas o el ancla provoca 2d8 de daño por relámpago.'
  },
  {
    roll: 19,
    title: 'Restos de Naufragio con Cofre Sellado',
    hazardType: 'wreck',
    dc: 12,
    checkSkill: 'Fuerza (Atletismo) para izar el botín',
    description: 'Tablones de una nave mercante hundida recientemente flotan con un barril sellado en brea y un cofre de hierro.',
    consequences: '¡Botín náutico! Contiene 150 po en especias raras, un catalejo de latón y una carta náutica sin abrir.'
  },
  {
    roll: 20,
    title: 'Bendición de la Sirena Protectora y Viento Favorable',
    hazardType: 'supernatural',
    dc: 10,
    checkSkill: 'Carisma (Interpretación o Diplomacia)',
    description: 'Un cortejo de delfines plateados y una náyade emergen ante la proa, concediendo un aura de buena fortuna.',
    consequences: '¡Gran éxito! Viento a favor durante 48 horas (+15 millas náuticas por día) e inspiración heroica para el timonel.'
  }
];
