import { ChaseComplication, DragonLairDef } from '../types/dnd';

// ---------------------------------------------------------------------------
// 1. COMPLICACIONES DE PERSECUCIÓN URBANA (DMG 2024 - Tabla d20)
// ---------------------------------------------------------------------------
export const URBAN_CHASE_COMPLICATIONS: ChaseComplication[] = [
  {
    roll: 1,
    title: 'Carreta de Frutas y Barriles Volcada',
    description: 'Un carro de transporte ha volcado desparramando manzanas resbaladizas y barriles rodantes en la calzada.',
    dc: 10,
    checkType: 'ACROBATICS',
    checkLabel: 'Destreza (Acrobacias)',
    penaltyDescription: 'Si fallas, tropiezas y la calzada cuenta como terreno difícil (cuesta 10 pies de movimiento extra).'
  },
  {
    roll: 2,
    title: 'Multitud Presa del Pánico en el Mercado',
    description: 'Una masa compacta de transeúntes asustados corre en dirección contraria bloqueando la callejuela.',
    dc: 10,
    checkType: 'ATHLETICS',
    checkLabel: 'Fuerza (Atletismo)',
    penaltyDescription: 'Si fallas, quedas atrapado en el tumulto y no puedes avanzar más durante este asalto.'
  },
  {
    roll: 3,
    title: 'Perro Guardián Furioso',
    description: 'Un mastín de guerra o perro callejero encadenado salta ladrando ferozmente intentando morder tus piernas.',
    dc: 10,
    checkType: 'DEX_SAVE',
    checkLabel: 'Tirada de Salvación de Destreza',
    penaltyDescription: 'Si fallas, recibes 1d4 de daño perforante y pierdes 10 pies de movimiento.'
  },
  {
    roll: 4,
    title: 'Calzada Mojada y Grasa de Lamparero',
    description: 'Adoquines empapados cubiertos de limo y aceite de lámparas de ballena.',
    dc: 10,
    checkType: 'DEX_SAVE',
    checkLabel: 'Tirada de Salvación de Destreza',
    penaltyDescription: 'Si fallas, resbalas estrepitosamente y caes Derribado (Prone).'
  },
  {
    roll: 5,
    title: 'Patrulla de la Guardia Municipal',
    description: 'Dos guardias armados con alabardas dan el alto e intentan cerrarte el paso.',
    dc: 11,
    checkType: 'ATHLETICS',
    checkLabel: 'Fuerza (Atletismo) o Carisma (Engaño)',
    penaltyDescription: 'Si fallas, los guardias te retienen temporalmente haciéndote perder la acción de Carrera.'
  },
  {
    roll: 6,
    title: 'Cuerdas de Ropa Tendida y Toldos Bajos',
    description: 'Sábanas tendidas entre balcones y toldos de lona pesada que ciegan tu línea de avance.',
    dc: 10,
    checkType: 'DEX_SAVE',
    checkLabel: 'Tirada de Salvación de Destreza',
    penaltyDescription: 'Si fallas, quedas Cegado momentáneamente y tu velocidad se reduce a la mitad.'
  },
  {
    roll: 7,
    title: 'Granuja Callejero Oportunista',
    description: 'Un ratero del gremio intenta cortar las correas de tu bolsa al cruzarse contigo.',
    dc: 10,
    checkType: 'DEX_SAVE',
    checkLabel: 'Destreza (Juego de Manos) o Sabiduría (Percepción)',
    penaltyDescription: 'Si fallas, pierdes 2d6 monedas de oro o un objeto pequeño de tu cinto.'
  },
  {
    roll: 8,
    title: 'Procesión Religiosa Solemne',
    description: 'Una fila de acólitos que portan cirios y un relicario sagrado cruzan la encrucijada cantando himnos.',
    dc: 10,
    checkType: 'STR_SAVE',
    checkLabel: 'Tirada de Salvación de Fuerza',
    penaltyDescription: 'Si fallas, debes rodear la procesión respetuosamente, perdiendo 15 pies de avance.'
  },
  {
    roll: 9,
    title: 'Andamio de Albañilería Quebradizo',
    description: 'Tablones de una fachada en obras crujen y caen cascotes y ladrillos al paso de los corredores.',
    dc: 10,
    checkType: 'DEX_SAVE',
    checkLabel: 'Tirada de Salvación de Destreza',
    penaltyDescription: 'Si fallas, recibes 1d6 de daño contundente por impacto de cascote.'
  },
  {
    roll: 10,
    title: 'Cruce de Carruajes a Galope',
    description: 'Un carruaje de cuatro caballos cruza la intersección a velocidad temeraria.',
    dc: 12,
    checkType: 'DEX_SAVE',
    checkLabel: 'Tirada de Salvación de Destreza',
    penaltyDescription: 'Si fallas, eres golpeado recibiendo 2d6 de daño contundente y caes Derribado.'
  },
  {
    roll: 11,
    title: 'Escalinata Empinada de Piedra',
    description: 'Una cuesta con cincuenta peldaños de granito gastados por los siglos.',
    dc: 10,
    checkType: 'ATHLETICS',
    checkLabel: 'Fuerza (Atletismo)',
    penaltyDescription: 'Si fallas, cada peldaño te exige el doble de movimiento (terreno difícil).'
  },
  {
    roll: 12,
    title: 'Foso de Desagüe o Alcantarilla Abierta',
    description: 'Una rejilla de drenaje municipal abierta que emana vahos fétidos y agua negra.',
    dc: 10,
    checkType: 'ACROBATICS',
    checkLabel: 'Destreza (Acrobacias)',
    penaltyDescription: 'Si fallas, caes dentro del pozo: caes Derribado y hueles a cieno (-2 a Carisma durante 1 hora).'
  },
  {
    roll: 13,
    title: 'Rebaño de Ovejas o Cerdos en Tránsito',
    description: 'Un pastor conduce un tropel de ganado hacia el matadero municipal.',
    dc: 10,
    checkType: 'ATHLETICS',
    checkLabel: 'Fuerza (Atletismo) o Sabiduría (Animales)',
    penaltyDescription: 'Si fallas, los animales te desvían 15 pies hacia un callejón lateral.'
  },
  {
    roll: 14,
    title: 'Vendedora de Caldo Caliente',
    description: 'Un caldero de sopa hirviendo colocado sobre un brasero en medio de la acera estrecha.',
    dc: 10,
    checkType: 'DEX_SAVE',
    checkLabel: 'Tirada de Salvación de Destreza',
    penaltyDescription: 'Si fallas, te salpicas con caldo hirviendo: 1d4 de daño por fuego.'
  },
  {
    roll: 15,
    title: 'Tejados Bajos y Toldos Retorcidos',
    description: 'Un saliente de tejado exige agacharse en carrera para no golpearse la frente.',
    dc: 10,
    checkType: 'ACROBATICS',
    checkLabel: 'Destreza (Acrobacias)',
    penaltyDescription: 'Si fallas, te golpeas la cabeza y quedas aturdido perdiendo 10 pies.'
  },
  {
    roll: 16,
    title: 'Gatos y Palomas Asustados',
    description: 'Una bandada de palomas alza el vuelo de golpe cegando la visión directa.',
    dc: 10,
    checkType: 'DEX_SAVE',
    checkLabel: 'Tirada de Salvación de Destreza',
    penaltyDescription: 'Si fallas, pierdes de vista a tu objetivo hasta el siguiente asalto.'
  },
  {
    roll: 17,
    title: 'Cajas de Madera de Mudanza',
    description: 'Una torre de cajas de madera que bloquea parcialmente el pasaje.',
    dc: 10,
    checkType: 'ATHLETICS',
    checkLabel: 'Fuerza (Atletismo) para saltar o arremeter',
    penaltyDescription: 'Si fallas, derribas las cajas y pierdes 10 pies de avance.'
  },
  {
    roll: 18,
    title: 'Borrachos Saliendo de la Taberna',
    description: 'Un grupo de tres parroquianos ebrios tambaleándose en la puerta del mesón.',
    dc: 10,
    checkType: 'ACROBATICS',
    checkLabel: 'Destreza (Acrobacias)',
    penaltyDescription: 'Si fallas, uno de ellos te abraza creyendo que eres un viejo amigo (reducido a velocidad 0).'
  },
  {
    roll: 19,
    title: 'Vidrieras de un Taller de Artesano',
    description: 'Dos aprendices transportan un panel de cristal frágil a través de la calle.',
    dc: 11,
    checkType: 'ACROBATICS',
    checkLabel: 'Destreza (Acrobacias)',
    penaltyDescription: 'Si fallas, atraviesas el cristal: sufres 2d4 de daño cortante.'
  },
  {
    roll: 20,
    title: '¡Despejado y Callejón Abierto!',
    description: 'Encuentras una recta despejada sin obstáculos ni peatones que te permite acelerar al máximo.',
    dc: 0,
    checkType: 'NONE',
    checkLabel: 'Sin prueba requerida',
    penaltyDescription: '¡Ganas +10 pies de movimiento gratuito durante este asalto!'
  }
];

// ---------------------------------------------------------------------------
// 2. COMPLICACIONES DE PERSECUCIÓN SALVAJE (DMG 2024 - Tabla d20)
// ---------------------------------------------------------------------------
export const WILDERNESS_CHASE_COMPLICATIONS: ChaseComplication[] = [
  {
    roll: 1,
    title: 'Zarzal de Espinos Puntiagudos',
    description: 'Una barrera espesa de espinos de zarza negra se interpone en la senda.',
    dc: 10,
    checkType: 'DEX_SAVE',
    checkLabel: 'Destreza (Acrobacias) o Fuerza',
    penaltyDescription: 'Si fallas, sufres 1d4 de daño perforante y el terreno cuesta el doble de movimiento.'
  },
  {
    roll: 2,
    title: 'Barranco o Foso Natural Rocoso',
    description: 'Una grieta de 10 pies de ancho y 15 de profundidad corta el camino abruptamente.',
    dc: 10,
    checkType: 'ATHLETICS',
    checkLabel: 'Fuerza (Atletismo) para saltar',
    penaltyDescription: 'Si fallas, caes al foso: sufres 1d6 de daño contundente y quedas Derribado.'
  },
  {
    roll: 3,
    title: 'Enjambre de Avispas Gigantes del Bosque',
    description: 'Pisas un nido subterráneo de avispas venenosas que atacan en masa.',
    dc: 10,
    checkType: 'CON_SAVE',
    checkLabel: 'Tirada de Salvación de Constitución',
    penaltyDescription: 'Si fallas, recibes 1d6 de daño por veneno y quedas Envenenado hasta el final de tu próximo turno.'
  },
  {
    roll: 4,
    title: 'Lodo Movedizo o Turbera Traicionera',
    description: 'Suelo de cieno negro que parece sólido pero se hunde bajo el peso de las botas.',
    dc: 10,
    checkType: 'STR_SAVE',
    checkLabel: 'Tirada de Salvación de Fuerza',
    penaltyDescription: 'Si fallas, te hundes hasta las rodillas y tu velocidad se reduce a la mitad.'
  },
  {
    roll: 5,
    title: 'Raíz Retorcida y Ramas Bajas',
    description: 'Raíces expuestas como garras en el sendero listas para hacer tropezar.',
    dc: 10,
    checkType: 'DEX_SAVE',
    checkLabel: 'Tirada de Salvación de Destreza',
    penaltyDescription: 'Si fallas, tropiezas y ruedas por el suelo: caes Derribado.'
  },
  {
    roll: 6,
    title: 'Banco de Niebla Mágica o Espesa',
    description: 'Una condensación fantasmal que anula la visión a más de 5 pies.',
    dc: 10,
    checkType: 'DEX_SAVE',
    checkLabel: 'Sabiduría (Supervivencia o Percepción)',
    penaltyDescription: 'Si fallas, pierdes la orientación y te desvías 10 pies en dirección equivocada.'
  },
  {
    roll: 7,
    title: 'Pedregal Inestable en Pendiente',
    description: 'Grava suelta sobre roca viva que rueda al menor contacto.',
    dc: 10,
    checkType: 'ACROBATICS',
    checkLabel: 'Destreza (Acrobacias)',
    penaltyDescription: 'Si fallas, resbalas hacia atrás perdiendo 15 pies de avance.'
  },
  {
    roll: 8,
    title: 'Madriguera de Jabalí o Foso de Caza',
    description: 'Un agujero oculto bajo hojas secas excavado por cazadores furtivos.',
    dc: 10,
    checkType: 'DEX_SAVE',
    checkLabel: 'Tirada de Salvación de Destreza',
    penaltyDescription: 'Si fallas, tu pie queda atascado: recibes 1d4 de daño y velocidad 0 este turno.'
  },
  {
    roll: 9,
    title: 'Río Torrencial con Corriente Violenta',
    description: 'Un vado poco profundo pero con corriente capaz de derribar a un poni.',
    dc: 11,
    checkType: 'ATHLETICS',
    checkLabel: 'Fuerza (Atletismo)',
    penaltyDescription: 'Si fallas, la corriente te arrastra 10 pies río abajo y caes Derribado.'
  },
  {
    roll: 10,
    title: 'Telaraña Gigante de Araña de Fase',
    description: 'Hilos pegajosos tensados entre los troncos de dos pinos ancestrales.',
    dc: 11,
    checkType: 'DEX_SAVE',
    checkLabel: 'Destreza (Acrobacias)',
    penaltyDescription: 'Si fallas, quedas Restringido en las telarañas hasta superar una prueba de Fuerza CD 11.'
  },
  {
    roll: 11,
    title: 'Tronco Podrido Atravesado',
    description: 'Un árbol caído por el rayo bloquea la senda a la altura del pecho.',
    dc: 10,
    checkType: 'ATHLETICS',
    checkLabel: 'Fuerza (Atletismo) para saltar por encima',
    penaltyDescription: 'Si fallas, te golpeas las espinillas y pierdes 10 pies de movimiento.'
  },
  {
    roll: 12,
    title: 'Grieta Humeante de Gases Volcánicos',
    description: 'Fisura de azufre que libera un chorro de gas ardiente y fétido.',
    dc: 10,
    checkType: 'CON_SAVE',
    checkLabel: 'Tirada de Salvación de Constitución',
    penaltyDescription: 'Si fallas, comienzas a toser y tienes desventaja en pruebas durante este turno.'
  },
  {
    roll: 13,
    title: 'Manada de Ciervos en Estampida',
    description: 'Un grupo de ciervos asustados por la conmoción huye en tu dirección.',
    dc: 10,
    checkType: 'DEX_SAVE',
    checkLabel: 'Tirada de Salvación de Destreza',
    penaltyDescription: 'Si fallas, un asta te impacta causando 1d6 de daño contundente.'
  },
  {
    roll: 14,
    title: 'Ciénaga de Cienpiés Carnívoros',
    description: 'Insectos gigantescos pululan sobre la hierba húmeda intentando trepar.',
    dc: 10,
    checkType: 'CON_SAVE',
    checkLabel: 'Tirada de Salvación de Constitución',
    penaltyDescription: 'Si fallas, sufres 1d4 de daño por mordeduras venenosas.'
  },
  {
    roll: 15,
    title: 'Placa de Hielo Oculta bajo la Nieve',
    description: 'Hielo negro liso disimulado por una capa fina de copos frescos.',
    dc: 10,
    checkType: 'ACROBATICS',
    checkLabel: 'Destreza (Acrobacias)',
    penaltyDescription: 'Si fallas, resbalas y te deslizas 10 pies en dirección aleatoria, cayendo Derribado.'
  },
  {
    roll: 16,
    title: 'Zanja de Riego Abandonada',
    description: 'Un canal excavado de 6 pies de profundidad cubierto de hierbajos.',
    dc: 10,
    checkType: 'ATHLETICS',
    checkLabel: 'Fuerza (Atletismo)',
    penaltyDescription: 'Si fallas, caes dentro y trepar te cuesta la mitad de tu velocidad.'
  },
  {
    roll: 17,
    title: 'Nube de Esporas Alucinógenas',
    description: 'Pisas un hongo inflado que estalla en una nube de polvo púrpura.',
    dc: 10,
    checkType: 'CON_SAVE',
    checkLabel: 'Tirada de Salvación de Constitución',
    penaltyDescription: 'Si fallas, sufres alucinaciones visuales breves que te imponen desventaja en ataques.'
  },
  {
    roll: 18,
    title: 'Ramas Espinosas a la Altura de los Ojos',
    description: 'Zarzas colgantes listas para arañar el rostro del perseguidor.',
    dc: 10,
    checkType: 'DEX_SAVE',
    checkLabel: 'Tirada de Salvación de Destreza',
    penaltyDescription: 'Si fallas, sufres 1d4 de daño cortante y visión nublada durante 1 asalto.'
  },
  {
    roll: 19,
    title: 'Pendiente Fangosa Resbaladiza',
    description: 'Una colina de tierra arcillosa empapada por las lluvias recientes.',
    dc: 11,
    checkType: 'ATHLETICS',
    checkLabel: 'Fuerza (Atletismo)',
    penaltyDescription: 'Si fallas, resbalas hasta el pie de la colina perdiendo todo el avance de este asalto.'
  },
  {
    roll: 20,
    title: '¡Senda Abierta y Viento de Cola!',
    description: 'El bosque se abre en un claro amplio con terreno firme y visibilidad perfecta.',
    dc: 0,
    checkType: 'NONE',
    checkLabel: 'Sin prueba requerida',
    penaltyDescription: '¡Ganas +10 pies de movimiento gratuito durante este asalto!'
  }
];

// ---------------------------------------------------------------------------
// 3. GUARIDAS DE DRAGÓN CANÓNICAS (DMG 2024 & MANUAL DE MONSTRUOS)
// ---------------------------------------------------------------------------
export const DRAGON_LAIRS_DATA: DragonLairDef[] = [
  // 1. DRAGÓN ROJO (VOLCÁN Y MAGMA)
  {
    id: 'lair_red_dragon',
    dragonSpecies: 'Dragón Rojo Adulto o Anciano',
    dragonName: 'Klauth / El Señor de las Cenizas',
    biome: 'Volcán Activo & Cavernas de Magma',
    lairName: 'La Fosa de la Forja Ardiente',
    themeColor: '#dc2626', // Rojo fuego
    dc: 16,
    actions: [
      {
        title: 'Géiser de Magma Ardiente',
        dc: 16,
        saveAbility: 'dex',
        saveAbilityLabel: 'Destreza',
        damageDice: '6d6',
        damageType: 'Fuego',
        description: 'Un chorro de roca fundida brota de una grieta en el suelo en un punto a elección del dragón. Criaturas a 15 pies deben superar salvación de Destreza o recibir 6d6 de daño por fuego (la mitad si salvan).'
      },
      {
        title: 'Temblor Sísmico y Desprendimiento del Techo',
        dc: 16,
        saveAbility: 'dex',
        saveAbilityLabel: 'Destreza',
        damageDice: '4d6',
        damageType: 'Contundente',
        description: 'Un temblor sacude la caverna; estalactitas afiladas caen en un radio de 20 pies. Las criaturas reciben 4d6 de daño contundente y caen Derribadas (salvación de Destreza para mitad y no caer).'
      },
      {
        title: 'Nube de Ceniza Volcánica Asfixiante',
        dc: 16,
        saveAbility: 'con',
        saveAbilityLabel: 'Constitución',
        damageDice: '2d6',
        damageType: 'Fuego',
        description: 'Humo denso y asfixiante brota de respiraderos llenando una esfera de 20 pies. Las criaturas quedan Cegadas y tosiendo hasta la iniciativa 20 de la próxima ronda salvo que superen salvación de Constitución.'
      }
    ],
    regionalEffects: [
      'Calor extremo y opresivo en un radio de 6 millas; las fuentes de agua no mágica hierven a 40°C.',
      'Temblores sísmicos menores ocurren cada 1d4 horas agrietando caminos y desprendiendo piedras.',
      'Portales menores al Plano Elemental del Fuego se abren espontáneamente, atrayendo mefits de humo y elementales ígneos menores.'
    ]
  },

  // 2. DRAGÓN BLANCO (GLACIAR Y CUEVA HELADA)
  {
    id: 'lair_white_dragon',
    dragonSpecies: 'Dragón Blanco Adulto o Anciano',
    dragonName: 'Icingdeath / La Furia Helada',
    biome: 'Glaciar Eterno & Caverna de Escarcha',
    lairName: 'El Abismo de Hielo Quebrado',
    themeColor: '#38bdf8', // Azul hielo
    dc: 15,
    actions: [
      {
        title: 'Estalagmitas de Hielo Afilado',
        dc: 15,
        saveAbility: 'dex',
        saveAbilityLabel: 'Destreza',
        damageDice: '3d6 + 3d6',
        damageType: 'Perforante y Frío',
        description: 'Enormes témpanos de hielo caen del techo cavernoso. Criaturas en un radio de 15 pies reciben 3d6 perforante + 3d6 daño por frío (la mitad si superan salvación de Destreza).'
      },
      {
        title: 'Muro de Hielo Instantáneo',
        dc: 15,
        saveAbility: 'str',
        saveAbilityLabel: 'Fuerza',
        damageDice: '0',
        damageType: 'Especial',
        description: 'Una pared de hielo opaco de 30 pies de largo y 10 de grosor se alza súbitamente del suelo, separando a los miembros del grupo o encerrando a un personaje.'
      },
      {
        title: 'Ráfaga de Frío Ártico a -40°C',
        dc: 15,
        saveAbility: 'con',
        saveAbilityLabel: 'Constitución',
        damageDice: '4d6',
        damageType: 'Frío',
        description: 'Un viento glacial congela las lágrimas y la ropa de los aventureros. Criaturas afectadas reciben 4d6 de daño por frío y su velocidad se reduce a 0 hasta superar salvación de Constitución.'
      }
    ],
    regionalEffects: [
      'Ventiscas constantes en un radio de 6 millas que imponen desventaja en pruebas de Percepción que dependan de la vista o el oído.',
      'Paredes y suelos dentro de la guarida son de hielo resbaladizo (moverse más de la mitad de velocidad exige prueba de Acrobacias CD 10 o caer Derribado).',
      'Esculturas perfectas de aventureros congelados en posturas de terror adornan las entradas de la cueva.'
    ]
  },

  // 3. DRAGÓN NEGRO (CIÉNAGA ÁCIDA Y RUINAS SUMERGIDAS)
  {
    id: 'lair_black_dragon',
    dragonSpecies: 'Dragón Negro Adulto o Anciano',
    dragonName: 'Voaraghamanthar / La Sombra del Cieno',
    biome: 'Ciénaga Pestilente & Templo Hundido',
    lairName: 'El Osario del Pantano Negro',
    themeColor: '#15803d', // Verde oscuro ácido
    dc: 15,
    actions: [
      {
        title: 'Géiser de Ácido Sulfúrico',
        dc: 15,
        saveAbility: 'dex',
        saveAbilityLabel: 'Destreza',
        damageDice: '5d6',
        damageType: 'Ácido',
        description: 'Burbujas de lodo sulfuroso estallan arrojando chorros de ácido corrosivo en un radio de 20 pies. Salvación de Destreza para reducir el daño a la mitad.'
      },
      {
        title: 'Lodo Devorador Subterráneo',
        dc: 15,
        saveAbility: 'str',
        saveAbilityLabel: 'Fuerza',
        damageDice: '2d6',
        damageType: 'Contundente',
        description: 'El barro se vuelve líquido bajo los pies y luego se solidifica como cemento. Criaturas afectadas quedan Restringidas hasta superar una prueba de Fuerza CD 15.'
      },
      {
        title: 'Enjambre de Moscas de Ciénaga Asfixiantes',
        dc: 15,
        saveAbility: 'con',
        saveAbilityLabel: 'Constitución',
        damageDice: '3d6',
        damageType: 'Veneno',
        description: 'Millones de insectos alados carnívoros llenan el aire mordiendo ojos y bocas. Sufren 3d6 de daño por veneno y tienen desventaja en tiradas de ataque hasta la siguiente ronda.'
      }
    ],
    regionalEffects: [
      'Toda agua no mágica en un radio de 6 millas tiene un sabor agrio y podrido; beberla exige salvación de Constitución CD 11 o sufrir diarrea mágica.',
      'Vegetación marchita con espinas negras y niebla densa de olor a cadáver.',
      'Cocodrilos gigantes y bestias de la ciénaga adquieren ojos blancos lechosos y atacan a cualquier intruso con furia ciega.'
    ]
  },

  // 4. DRAGÓN VERDE (BOSQUE VENENOSO Y ENGAÑO)
  {
    id: 'lair_green_dragon',
    dragonSpecies: 'Dragón Verde Adulto o Anciano',
    dragonName: 'Venomfang / El Conspirador Verde',
    biome: 'Bosque Ancestral Espinoso & Gruta Esmeralda',
    lairName: 'El Laberinto de Espinos Ponzoñosos',
    themeColor: '#16a34a', // Verde veneno
    dc: 15,
    actions: [
      {
        title: 'Nube de Gas Cloro Concentrado',
        dc: 15,
        saveAbility: 'con',
        saveAbilityLabel: 'Constitución',
        damageDice: '5d6',
        damageType: 'Veneno',
        description: 'Una niebla densa de gas venenoso emerge de la vegetación. Quienes fallen la salvación reciben 5d6 de daño y sufren la condición de Envenenado durante 1 minuto.'
      },
      {
        title: 'Espinos Constrictores Vivos',
        dc: 15,
        saveAbility: 'dex',
        saveAbilityLabel: 'Destreza',
        damageDice: '3d6',
        damageType: 'Perforante',
        description: 'Lianas y raíces espinosas cobran vida y atenazan los cuerpos de los aventureros. Quedan Agarrados y Restringidos (salvación de Destreza CD 15 para zafarse).'
      },
      {
        title: 'Susurros Ilusorios de Duda y Traición',
        dc: 15,
        saveAbility: 'wis',
        saveAbilityLabel: 'Sabiduría',
        damageDice: '0',
        damageType: 'Psíquico',
        description: 'Voces espectrales imitan a los seres queridos de los aventureros. Quien falle gasta su siguiente turno atacando a un aliado o huyendo asustado.'
      }
    ],
    regionalEffects: [
      'Los senderos forestales cambian de posición cuando nadie los mira en un radio de 6 millas, perdiendo a exploradores experimentados.',
      'Roedores y aves del bosque espían para el dragón, transmitiéndole mentalmente las conversaciones de los intrusos.',
      'Flores carnívoras y hongos gigantes crecen en abundancia grotesca.'
    ]
  },

  // 5. DRAGÓN AZUL (DESIERTO Y RELÁMPAGOS)
  {
    id: 'lair_blue_dragon',
    dragonSpecies: 'Dragón Azul Adulto o Anciano',
    dragonName: 'Iymrith / El Azote del Desierto',
    biome: 'Garganta Rocosa del Desierto & Cueva de Cristales',
    lairName: 'El Abismo de las Agujas de Rayo',
    themeColor: '#2563eb', // Azul relámpago
    dc: 16,
    actions: [
      {
        title: 'Arco Voltaico entre Pilares de Cuarzo',
        dc: 16,
        saveAbility: 'dex',
        saveAbilityLabel: 'Destreza',
        damageDice: '6d6',
        damageType: 'Rayo',
        description: 'Un rayo zigzaguea violentamente entre dos cristales gigantescos en la caverna. Criaturas en la línea reciben 6d6 de daño por rayo (mitad con salvación de Destreza).'
      },
      {
        title: 'Torbellino de Arena de Cuarzo Cegadora',
        dc: 16,
        saveAbility: 'con',
        saveAbilityLabel: 'Constitución',
        damageDice: '2d6',
        damageType: 'Cortante',
        description: 'Un vórtice de arena de sílice afilada desgarra y ciega los ojos de los aventureros. Quedan Cegados hasta superar salvación de Constitución.'
      },
      {
        title: 'Arenas Movedizas Electrificadas',
        dc: 16,
        saveAbility: 'str',
        saveAbilityLabel: 'Fuerza',
        damageDice: '3d6',
        damageType: 'Rayo',
        description: 'El suelo bajo los pies cede y se carga de electricidad estática. Las criaturas quedan sepultadas hasta la cintura (velocidad 0) y reciben daño eléctrico continuo.'
      }
    ],
    regionalEffects: [
      'Tormentas eléctricas secas azotan el cielo en un radio de 6 millas sin derramar una sola gota de lluvia.',
      'Espejismos mágicos de oasis y ciudades doradas confunden a los viajeros sedientos.',
      'El vello de los brazos y las crines de los caballos se erizan continuamente por la electricidad ambiental.'
    ]
  },

  // 6. DRAGÓN DORADO O PLATEADO (PICOS CELESTIALES Y BASTIÓN SAGRADO)
  {
    id: 'lair_metallic_dragon',
    dragonSpecies: 'Dragón Dorado o Plateado Adulto/Anciano',
    dragonName: 'Proctiv el Sabio / Guardián del Alba',
    biome: 'Picos Celestiales & Bastión de Mármol Sagrado',
    lairName: 'El Santuario de la Luz Primordial',
    themeColor: '#eab308', // Dorado solar
    dc: 17,
    actions: [
      {
        title: 'Estallido de Luz Radiante Purificadora',
        dc: 17,
        saveAbility: 'con',
        saveAbilityLabel: 'Constitución',
        damageDice: '5d6',
        damageType: 'Radiante',
        description: 'Luz solar sagrada inunda la caverna. Criaturas de alineamiento malvado o no-muertos reciben 5d6 de daño radiante y quedan Cegadas (mitad de daño si salvan).'
      },
      {
        title: 'Viento de Serenidad y Paz Inviolable',
        dc: 17,
        saveAbility: 'wis',
        saveAbilityLabel: 'Sabiduría',
        damageDice: '0',
        damageType: 'Encantamiento',
        description: 'Una brisa cálida con aroma a loto desarma la hostilidad. Las criaturas hostiles que fallen la salvación de Sabiduría no pueden atacar durante este asalto.'
      },
      {
        title: 'Mirada de Destierro Dimensional Temporal',
        dc: 17,
        saveAbility: 'cha',
        saveAbilityLabel: 'Carisma',
        damageDice: '0',
        damageType: 'Abjuración',
        description: 'Un rayo dorado transporta a un enemigo a un semiplano de meditación pacífica. Reaparece en su espacio al inicio de la siguiente ronda de iniciativa 20.'
      }
    ],
    regionalEffects: [
      'El clima en un radio de 6 millas es siempre templado, dulce y primaveral, libre de tormentas dañinas.',
      'Cualquier veneno o enfermedad natural se cura pasadas 24 horas de reposar dentro de la región.',
      'Los fuegos no mágicos no pueden propagarse accidentalmente por el bosque o los valles.'
    ]
  }
];
