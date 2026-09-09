import {
  TrapTier,
  TrapLethality,
  ComplexTrapDef
} from '../types/dnd';

// -------------------------------------------------------------
// TABLA DE REFERENCIA OFICIAL DMG 2024: SEVERIDAD DE TRAMPAS
// -------------------------------------------------------------
export interface TrapBenchmark {
  tier: TrapTier;
  lethality: TrapLethality;
  saveDc: number;
  attackBonus: number;
  damageDice: string;
  averageDamage: number;
}

export const DMG_TRAP_BENCHMARKS: TrapBenchmark[] = [
  // Rango 1 (Niveles 1-4)
  { tier: 'tier1', lethality: 'moderate', saveDc: 10, attackBonus: 5, damageDice: '2d10', averageDamage: 11 },
  { tier: 'tier1', lethality: 'dangerous', saveDc: 12, attackBonus: 6, damageDice: '4d10', averageDamage: 22 },
  { tier: 'tier1', lethality: 'deadly', saveDc: 15, attackBonus: 8, damageDice: '10d10', averageDamage: 55 },
  // Rango 2 (Niveles 5-10)
  { tier: 'tier2', lethality: 'moderate', saveDc: 13, attackBonus: 6, damageDice: '4d10', averageDamage: 22 },
  { tier: 'tier2', lethality: 'dangerous', saveDc: 15, attackBonus: 8, damageDice: '10d10', averageDamage: 55 },
  { tier: 'tier2', lethality: 'deadly', saveDc: 17, attackBonus: 10, damageDice: '18d10', averageDamage: 99 },
  // Rango 3 (Niveles 11-16)
  { tier: 'tier3', lethality: 'moderate', saveDc: 15, attackBonus: 8, damageDice: '10d10', averageDamage: 55 },
  { tier: 'tier3', lethality: 'dangerous', saveDc: 17, attackBonus: 10, damageDice: '18d10', averageDamage: 99 },
  { tier: 'tier3', lethality: 'deadly', saveDc: 19, attackBonus: 12, damageDice: '24d10', averageDamage: 132 },
  // Rango 4 (Niveles 17-20)
  { tier: 'tier4', lethality: 'moderate', saveDc: 17, attackBonus: 10, damageDice: '18d10', averageDamage: 99 },
  { tier: 'tier4', lethality: 'dangerous', saveDc: 19, attackBonus: 12, damageDice: '24d10', averageDamage: 132 },
  { tier: 'tier4', lethality: 'deadly', saveDc: 21, attackBonus: 14, damageDice: '30d10', averageDamage: 165 }
];

// -------------------------------------------------------------
// CATÁLOGO DE 8 GRANDES TRAMPAS COMPLEJAS (XANATHAR & DMG 2024)
// -------------------------------------------------------------
export const COMPLEX_TRAPS_CATALOG: ComplexTrapDef[] = [
  {
    id: 'path_of_blades',
    name: 'El Camino de las Cuchillas Giratorias y Viento Aullador',
    tier: 'tier1',
    tierLabel: 'Rango 1 (Niveles 1-4)',
    lethality: 'dangerous',
    lethalityLabel: 'Peligrosa',
    trigger: 'Pisar la losa de runas enanas a 3 metros del umbral de entrada sella las puertas con rejas de hierro y activa los engranajes en el techo y paredes.',
    description: 'Un pasillo de 24 metros de largo flanqueado por hendiduras en la piedra de donde emergen cuchillas semicirculares giratorias a gran velocidad, mientras un ventilador gigante al fondo sopla ráfagas que arrastran a las víctimas hacia el acero.',
    sourceBook: 'Guía de Xanathar para Todo (p. 114)',
    activeElements: [
      {
        id: 'blade_strike',
        initiativeCount: 20,
        title: 'Cuchillas Guadaña Sincronizadas',
        description: 'Tres conjuntos de cuchillas en forma de guadaña barren el pasillo con un chirrido ensordecedor.',
        attackBonus: 6,
        damageDice: '4d10',
        damageType: 'Cortante',
        affectedArea: 'Todo el pasillo central (24 metros)'
      },
      {
        id: 'wind_gust',
        initiativeCount: 10,
        title: 'Ráfaga de Viento Huracanado del Ventilador',
        description: 'El colosal ventilador de aspas de bronce al fondo expulsa un vendaval violento.',
        saveDc: 12,
        saveAbility: 'str',
        damageDice: '1d6',
        damageType: 'Fuerza',
        affectedArea: 'Línea de 24 metros empujando 3 metros hacia las cuchillas'
      }
    ],
    dynamicElements: [
      {
        triggerRound: 2,
        title: 'Aceleración del Regulador Centrífugo',
        description: 'Los contrapesos mecánicos liberan más vapor. Las cuchillas aumentan su velocidad de giro.',
        escalationEffect: '+2 a las tiradas de ataque y +1d10 al daño cortante a partir del Asalto 2.'
      }
    ],
    countermeasures: [
      {
        id: 'blade_gears',
        title: 'Trabar los Engranajes de las Cuchillas',
        skillOrTool: 'Herramientas de Ladrón o Fuerza (Atletismo)',
        dc: 13,
        requiredSuccesses: 3,
        currentSuccesses: 0,
        description: 'Introducir palancas de hierro o cuñas entre los dientes de transmisión mecánica para inmovilizar los brazos cortantes.',
        componentAc: 15,
        maxHp: 35,
        currentHp: 35,
        isDisarmed: false
      },
      {
        id: 'fan_shutoff',
        title: 'Cerrar la Válvula del Ventilador',
        skillOrTool: 'Fuerza (Atletismo) o Inteligencia (Investigación)',
        dc: 12,
        requiredSuccesses: 2,
        currentSuccesses: 0,
        description: 'Girar la rueda de presión en el marco de la rejilla norte para cortar el flujo de aire.',
        componentAc: 14,
        maxHp: 25,
        currentHp: 25,
        isDisarmed: false
      }
    ]
  },
  {
    id: 'flooding_acid_tomb',
    name: 'La Cripta Inundada de Ácido Sulfúrico',
    tier: 'tier2',
    tierLabel: 'Rango 2 (Niveles 5-10)',
    lethality: 'deadly',
    lethalityLabel: 'Letal',
    trigger: 'Intentar abrir el sarcófago dorado sin la llave de hueso hace descender losas de granito que sellan todas las salidas.',
    description: 'Gárgolas talladas en las cornisas escupen chorros de ácido verdoso y denso, mientras el nivel del líquido sube inexorablemente quemando la carne y el metal.',
    sourceBook: 'Guía de Xanathar para Todo & DMG 2024',
    activeElements: [
      {
        id: 'acid_spouts',
        initiativeCount: 20,
        title: 'Chorros de Ácido Concentrado de las Gárgolas',
        description: 'Cuatro cabezas de piedra descargan ácido a presión hacia el centro de la sala.',
        saveDc: 16,
        saveAbility: 'dex',
        damageDice: '8d10',
        damageType: 'Ácido',
        affectedArea: 'Toda criatura en el suelo o hasta 1.5 metros de altura'
      },
      {
        id: 'fume_inhalation',
        initiativeCount: 10,
        title: 'Vapores Ácidos Corrosivos',
        description: 'El vaho sofocante llena el aire quemando pulmones y ojos.',
        saveDc: 15,
        saveAbility: 'con',
        damageDice: '3d10',
        damageType: 'Veneno',
        affectedArea: 'Toda la cámara sellada'
      }
    ],
    dynamicElements: [
      {
        triggerRound: 2,
        title: 'Aumento del Nivel de Ácido (Inundación Progresiva)',
        description: 'El ácido alcanza las rodillas (Asalto 2) y el pecho (Asalto 4).',
        escalationEffect: 'El suelo se vuelve Terreno Difícil; comenzar el turno en el líquido inflige 4d10 de ácido automático.'
      }
    ],
    countermeasures: [
      {
        id: 'drain_levers',
        title: 'Abrir los Desagües de Suelo Ocultos',
        skillOrTool: 'Herramientas de Ladrón o Sabiduría (Percepción)',
        dc: 15,
        requiredSuccesses: 3,
        currentSuccesses: 0,
        description: 'Localizar y destrabar las compuertas de drenaje en las cuatro esquinas sumergidas de la cripta.',
        componentAc: 16,
        maxHp: 45,
        currentHp: 45,
        isDisarmed: false
      },
      {
        id: 'gargoyle_statues',
        title: 'Destruir las Gárgolas de Ácido',
        skillOrTool: 'Ataque de Armas o Conjuros de Fuerza/Trueno',
        dc: 14,
        requiredSuccesses: 2,
        currentSuccesses: 0,
        description: 'Hacer pedazos las cabezas de piedra talladas para redirigir el flujo a las paredes.',
        componentAc: 17,
        maxHp: 50,
        currentHp: 50,
        isDisarmed: false
      }
    ]
  },
  {
    id: 'spinning_fire_pillars',
    name: 'El Templo de los Pilares de Fuego y Espejos Arcanos',
    tier: 'tier2',
    tierLabel: 'Rango 2 (Niveles 5-10)',
    lethality: 'dangerous',
    lethalityLabel: 'Peligrosa',
    trigger: 'Retirar el Cáliz de Rubí del altar dispara una secuencia pirotécnica que enciende tres columnas de obsidiana.',
    description: 'Columnas cilíndricas giratorias expulsan chorros continuos de fuego líquido, mientras espejos cóncavos en las paredes concentran los rayos calóricos.',
    sourceBook: 'Guía de Xanathar para Todo (p. 118)',
    activeElements: [
      {
        id: 'pillar_sweeps',
        initiativeCount: 20,
        title: 'Barrido Ígneo de las Columnas Giratorias',
        description: 'Llamaradas de 9 metros de longitud giran como manecillas de reloj ardientes.',
        attackBonus: 8,
        damageDice: '6d10',
        damageType: 'Fuego',
        affectedArea: 'Tres arcos giratorios de 9 metros'
      },
      {
        id: 'blinding_mirrors',
        initiativeCount: 10,
        title: 'Destello Concentrado de los Espejos Parabólicos',
        description: 'Reflejos incandescentes ciegan a los aventureros.',
        saveDc: 15,
        saveAbility: 'con',
        damageDice: '2d10',
        damageType: 'Radiante',
        affectedArea: 'Línea de visión directa a cualquier espejo'
      }
    ],
    dynamicElements: [
      {
        triggerRound: 3,
        title: 'Sobrecarga Ígnea del Núcleo Alquímico',
        description: 'La nafta en las tuberías subterráneas hierve aumentando el radio de los fuegos a 15 metros.',
        escalationEffect: 'El daño de los pilares aumenta a 8d10 fuego.'
      }
    ],
    countermeasures: [
      {
        id: 'mirror_panels',
        title: 'Romper o Cubrir los Espejos de Enfoque',
        skillOrTool: 'Ataque Físico o Destreza (Acrobacias)',
        dc: 14,
        requiredSuccesses: 2,
        currentSuccesses: 0,
        description: 'Romper las láminas de plata pulida o cubrirlas con telas para anular los destellos cegadores.',
        componentAc: 13,
        maxHp: 20,
        currentHp: 20,
        isDisarmed: false
      },
      {
        id: 'fuel_valves',
        title: 'Cerrar las Llaves de Nafta en el Altar',
        skillOrTool: 'Herramientas de Ladrón o Inteligencia (Arcanos)',
        dc: 15,
        requiredSuccesses: 3,
        currentSuccesses: 0,
        description: 'Interrumpir el conducto de aceite elemental que alimenta las columnas.',
        componentAc: 15,
        maxHp: 40,
        currentHp: 40,
        isDisarmed: false
      }
    ]
  },
  {
    id: 'crushing_poison_chamber',
    name: 'La Cámara de Gas Tóxico y Paredes Aplastantes',
    tier: 'tier1',
    tierLabel: 'Rango 1 (Niveles 1-4)',
    lethality: 'deadly',
    lethalityLabel: 'Letal',
    trigger: 'Presionar la palanca falsa en el extremo opuesto cierra las rejas de salida y activa el mecanismo hidráulico de las paredes.',
    description: 'Los dos muros laterales de 6 metros de largo comienzan a deslizarse hacia adentro, reduciendo el ancho de la sala mientras el techo expulsa niebla de cloro.',
    sourceBook: 'D&D 2024 Guía del Dungeon Master',
    activeElements: [
      {
        id: 'chlorine_gas',
        initiativeCount: 20,
        title: 'Emanación de Gas Cloro desde las Rejillas',
        description: 'Un gas amarillento y pesado inunda la habitación a ras de suelo.',
        saveDc: 13,
        saveAbility: 'con',
        damageDice: '3d10',
        damageType: 'Veneno',
        affectedArea: 'Toda la habitación (las criaturas tienen desventaja si están en el suelo)'
      },
      {
        id: 'wall_advance',
        initiativeCount: 10,
        title: 'Avance de las Paredes de Granito',
        description: 'Las paredes avanzan 1.5 metros, apretando a los ocupantes contra el centro.',
        saveDc: 12,
        saveAbility: 'str',
        damageDice: '2d10',
        damageType: 'Contundente',
        affectedArea: 'Bordes exteriores de la habitación'
      }
    ],
    dynamicElements: [
      {
        triggerRound: 3,
        title: 'Espacio Reducido y Claustrofobia',
        description: 'La sala tiene ahora solo 1.5 metros de ancho.',
        escalationEffect: 'Todas las tiradas de ataque y pruebas de Destreza tienen Desventaja; en el asalto 5 las paredes se tocan infligiendo 10d10 contundente mortal.'
      }
    ],
    countermeasures: [
      {
        id: 'hydraulic_gears',
        title: 'Bloquear la Cremallera de Tracción',
        skillOrTool: 'Herramientas de Ladrón o Fuerza (Atletismo)',
        dc: 14,
        requiredSuccesses: 3,
        currentSuccesses: 0,
        description: 'Introducir una barra de acero o descalzar los engranajes de tracción del muro sur.',
        componentAc: 16,
        maxHp: 30,
        currentHp: 30,
        isDisarmed: false
      },
      {
        id: 'gas_plugs',
        title: 'Tapar las Rejillas de Ventilación',
        skillOrTool: 'Destreza (Juego de Manos) o Fuerza (Atletismo)',
        dc: 12,
        requiredSuccesses: 2,
        currentSuccesses: 0,
        description: 'Obstruir las aberturas del techo con ropa, mochilas o escudos.',
        componentAc: 12,
        maxHp: 20,
        currentHp: 20,
        isDisarmed: false
      }
    ]
  },
  {
    id: 'sphere_of_crushing_doom',
    name: 'El Pozo de la Esfera Rodante de Acero Negro',
    tier: 'tier2',
    tierLabel: 'Rango 2 (Niveles 5-10)',
    lethality: 'moderate',
    lethalityLabel: 'Moderada',
    trigger: 'Cortar el hilo de plata invisible a media altura desengancha un contrapeso de plomo de 10 toneladas.',
    description: 'Una esfera maciza de acero de 3 metros de diámetro rueda pendiente abajo por un pasillo inclinado a 18 metros por asalto, rebotando en nichos.',
    sourceBook: 'Guía de Xanathar para Todo',
    activeElements: [
      {
        id: 'rolling_sphere',
        initiativeCount: 20,
        title: 'Avance Arrollador de la Esfera Maciza',
        description: 'La esfera aplasta todo a su paso avanzando 18 metros por turno.',
        saveDc: 15,
        saveAbility: 'dex',
        damageDice: '5d10',
        damageType: 'Contundente',
        affectedArea: 'Ancho total del pasillo inclinado (3 metros)'
      }
    ],
    dynamicElements: [
      {
        triggerRound: 2,
        title: 'Aceleración Gravitacional por Pendiente',
        description: 'La pendiente se acentúa en el segundo tramo del túnel.',
        escalationEffect: 'La velocidad de la esfera aumenta a 24 metros por asalto y la CD de Destreza sube a 16.'
      }
    ],
    countermeasures: [
      {
        id: 'track_obstacles',
        title: 'Arrojar Obstáculos y Cuñas de Bloqueo',
        skillOrTool: 'Fuerza (Atletismo)',
        dc: 15,
        requiredSuccesses: 2,
        currentSuccesses: 0,
        description: 'Colocar vigas de madera o rocas pesadas para desviar la esfera hacia un foso lateral.',
        componentAc: 18,
        maxHp: 80,
        currentHp: 80,
        isDisarmed: false
      }
    ]
  },
  {
    id: 'abyssal_lightning_grid',
    name: 'La Rejilla Electrificada del Abismo Arcano',
    tier: 'tier3',
    tierLabel: 'Rango 3 (Niveles 11-16)',
    lethality: 'dangerous',
    lethalityLabel: 'Peligrosa',
    trigger: 'Interrumpir el campo de contención de la bóveda activa los generadores de relámpago en las estalagmitas de cuarzo.',
    description: 'Arcos voltaicos de energía abisal azulada trazan una cuadrícula geométrica entre el suelo y el techo, descargando rayos letales.',
    sourceBook: 'D&D 2024 Guía del Dungeon Master',
    activeElements: [
      {
        id: 'arc_discharge',
        initiativeCount: 20,
        title: 'Descarga Cruzada de Rayos Abisales',
        description: 'Arcos eléctricos saltan entre postes de ferrofluido.',
        saveDc: 17,
        saveAbility: 'dex',
        damageDice: '10d10',
        damageType: 'Relámpago',
        affectedArea: 'Cuadrículas alternas de 3x3 metros en toda la bóveda'
      },
      {
        id: 'magnetic_pull',
        initiativeCount: 10,
        title: 'Atracción Magnética de Armaduras y Metal',
        description: 'Una fuerza polar jala a cualquier criatura que porte armadura metálica o armas hacia los electrodos.',
        saveDc: 16,
        saveAbility: 'str',
        damageDice: '2d10',
        damageType: 'Fuerza',
        affectedArea: 'Radio de 9 metros alrededor de los postes'
      }
    ],
    dynamicElements: [
      {
        triggerRound: 2,
        title: 'Frecuencia Armónica de Sobrecarga',
        description: 'Los relámpagos se tornan violáceos y queman el aire con ozono infernal.',
        escalationEffect: 'El daño por relámpago aumenta en +2d10 por cada asalto consecutivo.'
      }
    ],
    countermeasures: [
      {
        id: 'crystal_pylons',
        title: 'Disipar los Glifos Rúnicos de Cuarzo',
        skillOrTool: 'Inteligencia (Arcanos) o Religión',
        dc: 17,
        requiredSuccesses: 3,
        currentSuccesses: 0,
        description: 'Canalizar energía para invertir la polaridad de las runas talladas en los cristales.',
        componentAc: 15,
        maxHp: 60,
        currentHp: 60,
        isDisarmed: false
      },
      {
        id: 'grounding_rods',
        title: 'Conectar Cables de Toma a Tierra',
        skillOrTool: 'Herramientas de Ladrón o Inteligencia (Naturaleza)',
        dc: 16,
        requiredSuccesses: 2,
        currentSuccesses: 0,
        description: 'Derivar los electrodos conductores hacia el foso de agua no electrificada.',
        componentAc: 14,
        maxHp: 35,
        currentHp: 35,
        isDisarmed: false
      }
    ]
  },
  {
    id: 'clockwork_death_needles',
    name: 'El Reloj Funerario de Agujas de Nigromancia',
    tier: 'tier3',
    tierLabel: 'Rango 3 (Niveles 11-16)',
    lethality: 'deadly',
    lethalityLabel: 'Letal',
    trigger: 'El reloj comienza su cuenta regresiva cuando cualquier criatura no autorizada pisa el círculo rúnico central.',
    description: 'Un autómata colosal en forma de reloj de pie gótico proyecta cientos de agujas de hueso y mithral cargadas con energía marchitadora.',
    sourceBook: 'Guía de Xanathar para Todo',
    activeElements: [
      {
        id: 'needle_salvo',
        initiativeCount: 20,
        title: 'Salva en Abanico de Agujas Marchitadoras',
        description: 'Cientos de dardos finos como espinas son disparados en todas direcciones.',
        attackBonus: 12,
        damageDice: '14d10',
        damageType: 'Necrótico',
        affectedArea: 'Cono de 18 metros o radio circular de 9 metros'
      }
    ],
    dynamicElements: [
      {
        triggerRound: 2,
        title: 'Las Campanadas del Juicio Final',
        description: 'El reloj marca las horas con tañidos ensordecedores que desgarran el alma.',
        escalationEffect: 'Toda curación queda anulada y las tiradas de ataque tienen +2.'
      }
    ],
    countermeasures: [
      {
        id: 'pendulum_catch',
        title: 'Detener el Péndulo de Hueso del Reloj',
        skillOrTool: 'Fuerza (Atletismo) o Destreza (Acrobacias)',
        dc: 18,
        requiredSuccesses: 3,
        currentSuccesses: 0,
        description: 'Atrapar y fijar el péndulo oscilante que regula el disparador mecánico.',
        componentAc: 18,
        maxHp: 75,
        currentHp: 75,
        isDisarmed: false
      }
    ]
  },
  {
    id: 'glacial_cage_of_frost',
    name: 'La Jaula Glacial de Estalagmitas Inversas',
    tier: 'tier4',
    tierLabel: 'Rango 4 (Niveles 17-20)',
    lethality: 'deadly',
    lethalityLabel: 'Letal',
    trigger: 'La activación del sello del Trono de Hielos Épico desencadena el congelamiento absoluto de la sala.',
    description: 'Barras de hielo irrompible surgen del suelo enrejando a los héroes, mientras estalagmitas de escarcha helada caen del techo a cero absoluto.',
    sourceBook: 'D&D 2024 Guía del Dungeon Master',
    activeElements: [
      {
        id: 'frost_stalactites',
        initiativeCount: 20,
        title: 'Lluvia de Estalagmitas Glaciales Devastadoras',
        description: 'Lanzas de hielo puro caen a velocidades terminales.',
        saveDc: 21,
        saveAbility: 'dex',
        damageDice: '20d10',
        damageType: 'Frío',
        affectedArea: 'Toda la sala del trono (30x30 metros)'
      },
      {
        id: 'absolute_zero_chill',
        initiativeCount: 10,
        title: 'Ola de Frío de Cero Absoluto',
        description: 'El frío petrifica la carne en hielo sólido.',
        saveDc: 20,
        saveAbility: 'con',
        damageDice: '8d10',
        damageType: 'Frío',
        affectedArea: 'Criaturas dentro de la jaula (quedan paralizadas si fallan)'
      }
    ],
    dynamicElements: [
      {
        triggerRound: 2,
        title: 'Cristalización Espacial Espontánea',
        description: 'El hielo se expande engrosando las barras de la jaula a 60 cm de espesor.',
        escalationEffect: 'Cualquier teletransporte o conjuro de conjuración exige superar una prueba de Arcanos CD 20 o fallar.'
      }
    ],
    countermeasures: [
      {
        id: 'elemental_hearth',
        title: 'Sobrecargar el Brasero Elemental de Fuego Primordial',
        skillOrTool: 'Inteligencia (Arcanos) o Daño por Fuego (mín. 50 PG en un turno)',
        dc: 20,
        requiredSuccesses: 3,
        currentSuccesses: 0,
        description: 'Reavivar la llama del Fuego Primordial para que el calor descongele los sellos arcanos.',
        componentAc: 20,
        maxHp: 120,
        currentHp: 120,
        isDisarmed: false
      }
    ]
  }
];
