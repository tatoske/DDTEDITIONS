import { Sidekick, SidekickClassType, SidekickRole, SidekickFeature } from '../types/dnd';

// -------------------------------------------------------------
// TABLAS DE PROGRESIÓN DE NIVELES SEGÚN EL CALDERO DE TASHA
// -------------------------------------------------------------

export function getSidekickProficiency(level: number): number {
  if (level >= 17) return 6;
  if (level >= 13) return 5;
  if (level >= 9) return 4;
  if (level >= 5) return 3;
  return 2;
}

export const WARRIOR_FEATURES_BY_LEVEL: Record<number, SidekickFeature[]> = {
  1: [
    {
      level: 1,
      name: 'Papel Marcial (Atacante / Defensor)',
      source: 'Guerrero Nvl 1',
      description: 'Atacante: +2 a todas las tiradas de ataque. Defensor: Como reacción, impone desventaja al ataque de un enemigo contra un aliado a 5 pies (1.5 m).',
      actionType: 'reaction'
    },
    {
      level: 1,
      name: 'Competencias Marciales',
      source: 'Guerrero Nvl 1',
      description: 'Competencia con todas las armaduras, escudos, armas simples y marciales.',
      actionType: 'passive'
    }
  ],
  2: [
    {
      level: 2,
      name: 'Segundo Aire (Second Wind)',
      source: 'Guerrero Nvl 2',
      description: 'En su turno, como Acción Adicional, puede recuperar 1d10 + nivel PG. Requiere un descanso corto o largo para volver a usarse.',
      actionType: 'bonus_action'
    }
  ],
  3: [
    {
      level: 3,
      name: 'Crítico Mejorado (Improved Critical)',
      source: 'Guerrero Nvl 3',
      description: 'Sus tiradas de ataque con armas logran un golpe crítico con una tirada de 19 o 20 en el d20.',
      actionType: 'passive'
    }
  ],
  6: [
    {
      level: 6,
      name: 'Ataque Adicional (Extra Attack)',
      source: 'Guerrero Nvl 6',
      description: 'Puede atacar 2 veces siempre que realice la acción Atacar en su turno.',
      actionType: 'passive'
    }
  ],
  7: [
    {
      level: 7,
      name: 'Indomable (Indomitable)',
      source: 'Guerrero Nvl 7',
      description: 'Puede repetir una tirada de salvación fallida (1 uso por Descanso Largo).',
      actionType: 'reaction'
    }
  ],
  11: [
    {
      level: 11,
      name: 'Ataque Adicional Mejorado (3 Ataques)',
      source: 'Guerrero Nvl 11',
      description: 'Puede atacar 3 veces siempre que realice la acción Atacar en su turno.',
      actionType: 'passive'
    }
  ],
  15: [
    {
      level: 15,
      name: 'Ataque Adicional Maestro (4 Ataques)',
      source: 'Guerrero Nvl 15',
      description: 'Puede atacar 4 veces en cada turno que use la acción Atacar.',
      actionType: 'passive'
    }
  ],
  20: [
    {
      level: 20,
      name: 'Defensa Inquebrantable',
      source: 'Guerrero Nvl 20',
      description: 'Gana resistencia al daño contundente, perforante y cortante de ataques no mágicos.',
      actionType: 'passive'
    }
  ]
};

export const EXPERT_FEATURES_BY_LEVEL: Record<number, SidekickFeature[]> = {
  1: [
    {
      level: 1,
      name: 'Ayuda Útil (Helpful)',
      source: 'Experto Nvl 1',
      description: 'Puede realizar la acción de Ayudar como Acción Adicional, y puede ayudar a un aliado a una distancia de hasta 30 pies (9 metros).',
      actionType: 'bonus_action'
    },
    {
      level: 1,
      name: 'Competencias Amplias',
      source: 'Experto Nvl 1',
      description: 'Competencia en armaduras ligeras, armas simples y 5 habilidades a elección.',
      actionType: 'passive'
    }
  ],
  2: [
    {
      level: 2,
      name: 'Acción Astuta (Cunning Action)',
      source: 'Experto Nvl 2',
      description: 'Puede realizar Correr (Dash), Destrabarse (Disengage) o Esconderse (Hide) como Acción Adicional en cada turno.',
      actionType: 'bonus_action'
    }
  ],
  3: [
    {
      level: 3,
      name: 'Pericia (Expertise)',
      source: 'Experto Nvl 3',
      description: 'Duplica su bonificador de competencia en dos de sus habilidades competentes.',
      actionType: 'passive'
    }
  ],
  6: [
    {
      level: 6,
      name: 'Ataque Coordinado (Coordinated Strike)',
      source: 'Experto Nvl 6',
      description: 'Una vez por turno, inflige 2d6 de daño adicional a un objetivo si un aliado está a 5 pies de él, o si usó Ayudar contra él.',
      actionType: 'passive'
    }
  ],
  7: [
    {
      level: 7,
      name: 'Evasión (Evasion)',
      source: 'Experto Nvl 7',
      description: 'Cuando supera una tirada de salvación de Destreza para reducir el daño a la mitad, no sufre daño, y solo la mitad si falla.',
      actionType: 'reaction'
    }
  ],
  11: [
    {
      level: 11,
      name: 'Inspirar Resolución',
      source: 'Experto Nvl 11',
      description: 'Cuando ayuda a un aliado, ese aliado también suma 1d6 a su siguiente tirada de salvación.',
      actionType: 'passive'
    }
  ],
  14: [
    {
      level: 14,
      name: 'Ataque Coordinado Mejorado',
      source: 'Experto Nvl 14',
      description: 'El daño adicional de Ataque Coordinado aumenta a 3d6.',
      actionType: 'passive'
    }
  ],
  15: [
    {
      level: 15,
      name: 'Mente Escurridiza (Slippery Mind)',
      source: 'Experto Nvl 15',
      description: 'Gana competencia en tiradas de salvación de Sabiduría.',
      actionType: 'passive'
    }
  ],
  20: [
    {
      level: 20,
      name: 'Talento Fiable (Reliable Talent)',
      source: 'Experto Nvl 20',
      description: 'Siempre que haga una prueba de habilidad con una que sea competente, una tirada de d20 de 9 o menor se trata como un 10.',
      actionType: 'passive'
    }
  ]
};

export const SPELLCASTER_FEATURES_BY_LEVEL: Record<number, SidekickFeature[]> = {
  1: [
    {
      level: 1,
      name: 'Lanzamiento de Conjuros (Spellcasting)',
      source: 'Prodigio Mágico Nvl 1',
      description: 'Aprende trucos y conjuros según su rol (Mago o Sanador). Utiliza INT (Mago) o SAB/CAR (Sanador) como característica de conjuro.',
      actionType: 'action'
    }
  ],
  2: [
    {
      level: 2,
      name: 'Enfoque Mágico (Potent Focus)',
      source: 'Prodigio Mágico Nvl 2',
      description: 'Gana un +1 a las tiradas de ataque de conjuro y a la CD de salvación de sus conjuros.',
      actionType: 'passive'
    }
  ],
  6: [
    {
      level: 6,
      name: 'Potencia de Truco (Potent Cantrip)',
      source: 'Prodigio Mágico Nvl 6',
      description: 'Suma su modificador de característica de conjuración al daño infligido con cualquier truco.',
      actionType: 'passive'
    }
  ],
  11: [
    {
      level: 11,
      name: 'Magia Enfocada (Empowered Concentration)',
      source: 'Prodigio Mágico Nvl 11',
      description: 'Tiene ventaja en tiradas de salvación de Constitución para mantener la concentración en conjuros.',
      actionType: 'passive'
    }
  ],
  20: [
    {
      level: 20,
      name: 'Resguardo Sobrenatural',
      source: 'Prodigio Mágico Nvl 20',
      description: 'Gana resistencia a todo el daño producido por conjuros y efectos mágicos.',
      actionType: 'passive'
    }
  ]
};

// Tabla de espacios de conjuro para Prodigio Mágico (Medio Conjurador de Tasha)
export const SPELLCASTER_SLOTS_BY_LEVEL: Record<number, { [lvl: number]: number }> = {
  1: { 1: 2 },
  2: { 1: 2 },
  3: { 1: 3 },
  4: { 1: 3 },
  5: { 1: 4, 2: 2 },
  6: { 1: 4, 2: 2 },
  7: { 1: 4, 2: 3 },
  8: { 1: 4, 2: 3 },
  9: { 1: 4, 2: 3, 3: 2 },
  10: { 1: 4, 2: 3, 3: 2 },
  11: { 1: 4, 2: 3, 3: 3 },
  12: { 1: 4, 2: 3, 3: 3 },
  13: { 1: 4, 2: 3, 3: 3, 4: 1 },
  14: { 1: 4, 2: 3, 3: 3, 4: 1 },
  15: { 1: 4, 2: 3, 3: 3, 4: 2 },
  16: { 1: 4, 2: 3, 3: 3, 4: 2 },
  17: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 1 },
  18: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 1 },
  19: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2 },
  20: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2 }
};

// -------------------------------------------------------------
// PLANTILLAS PRECONFIGURADAS DE EL CALDERO DE TASHA
// -------------------------------------------------------------

export const SIDEKICK_PRESETS: Sidekick[] = [
  {
    id: 'preset-mastiff',
    name: 'Colmillo el Fiel',
    creatureType: 'Mastín Guardián',
    size: 'Mediano',
    sidekickClass: 'warrior',
    role: 'defender',
    level: 1,
    armorClass: 13,
    armorType: 'Pelaje grueso (Natural)',
    speed: 12,
    maxHp: 13,
    currentHp: 13,
    tempHp: 0,
    hitDie: 'd8',
    abilities: { str: 14, dex: 14, con: 14, int: 3, wis: 12, cha: 7 },
    savingThrows: { str: true, con: true },
    skills: ['Percepción (+3)', 'Atletismo (+4)'],
    passivePerception: 13,
    attacks: [
      {
        id: 'atk-bite',
        name: 'Mordisco Defensivo',
        type: 'melee',
        bonus: 4,
        reachOrRange: '1.5 m (5 pies)',
        damageDice: '1d6 + 2',
        damageType: 'Perforante',
        notes: 'Si el objetivo es una criatura, debe superar salvación de FUERZA CD 12 o ser derribada (Prone).'
      }
    ],
    features: [
      {
        level: 1,
        name: 'Olfato y Oído Aguzados',
        source: 'Mastín',
        description: 'Ventaja en tiradas de Sabiduría (Percepción) que dependan del oído o el olfato.',
        actionType: 'passive'
      },
      ...WARRIOR_FEATURES_BY_LEVEL[1]
    ],
    personalityTrait: 'Inquebrantablemente leal; se sienta frente a su amo ante cualquier señal de peligro.'
  },
  {
    id: 'preset-wolf',
    name: 'Sombra de la Manada',
    creatureType: 'Lobo Joven',
    size: 'Mediano',
    sidekickClass: 'warrior',
    role: 'attacker',
    level: 1,
    armorClass: 13,
    speed: 12,
    maxHp: 12,
    currentHp: 12,
    tempHp: 0,
    hitDie: 'd8',
    abilities: { str: 13, dex: 15, con: 13, int: 3, wis: 12, cha: 6 },
    savingThrows: { dex: true, con: true },
    skills: ['Percepción (+3)', 'Sigilo (+4)'],
    passivePerception: 13,
    attacks: [
      {
        id: 'atk-wolf-bite',
        name: 'Mordisco con Furia de Manada',
        type: 'melee',
        bonus: 6, // 4 base + 2 por papel marcial Atacante
        reachOrRange: '1.5 m (5 pies)',
        damageDice: '1d6 + 2',
        damageType: 'Perforante',
        notes: 'Ventaja en el ataque si al menos un aliado está a 5 pies del objetivo y no está incapacitado.'
      }
    ],
    features: [
      {
        level: 1,
        name: 'Tácticas de Manada (Pack Tactics)',
        source: 'Lobo',
        description: 'Tiene ventaja en tiradas de ataque contra una criatura si al menos uno de sus aliados está a 5 pies de esa criatura.',
        actionType: 'passive'
      },
      ...WARRIOR_FEATURES_BY_LEVEL[1]
    ],
    personalityTrait: 'Vigila constantemente los flancos del grupo y gruñe en silencio ante las emboscadas.'
  },
  {
    id: 'preset-squire',
    name: 'Valen de Oakhaven',
    creatureType: 'Escudero Humanoide',
    size: 'Mediano',
    sidekickClass: 'warrior',
    role: 'attacker',
    level: 1,
    armorClass: 16,
    armorType: 'Cota de malla y escudo',
    speed: 9,
    maxHp: 12,
    currentHp: 12,
    tempHp: 0,
    hitDie: 'd8',
    abilities: { str: 15, dex: 12, con: 14, int: 10, wis: 12, cha: 11 },
    savingThrows: { str: true, con: true },
    skills: ['Atletismo (+4)', 'Supervivencia (+3)'],
    passivePerception: 11,
    attacks: [
      {
        id: 'atk-sword',
        name: 'Espada Larga de Escudero',
        type: 'melee',
        bonus: 6, // +4 base + 2 de Atacante
        reachOrRange: '1.5 m (5 pies)',
        damageDice: '1d8 + 2',
        damageType: 'Cortante'
      },
      {
        id: 'atk-crossbow',
        name: 'Ballesta Ligera',
        type: 'ranged',
        bonus: 5,
        reachOrRange: '24/96 m',
        damageDice: '1d8 + 1',
        damageType: 'Perforante'
      }
    ],
    features: [...WARRIOR_FEATURES_BY_LEVEL[1]],
    personalityTrait: 'Sueña con ser nombrado caballero y anota diligentemente cada lección de combate de su mentor.'
  },
  {
    id: 'preset-apprentice',
    name: 'Eldrin Chispa',
    creatureType: 'Aprendiz Arcano',
    size: 'Mediano',
    sidekickClass: 'spellcaster',
    role: 'mage',
    level: 1,
    armorClass: 12,
    armorType: 'Ropajes de estudioso',
    speed: 9,
    maxHp: 9,
    currentHp: 9,
    tempHp: 0,
    hitDie: 'd8',
    abilities: { str: 9, dex: 14, con: 12, int: 16, wis: 13, cha: 11 },
    savingThrows: { int: true, wis: true },
    skills: ['Arcanos (+5)', 'Historia (+5)', 'Investigación (+5)'],
    passivePerception: 11,
    attacks: [
      {
        id: 'atk-firebolt',
        name: 'Rayo de Fuego (Fire Bolt)',
        type: 'spell',
        bonus: 5,
        reachOrRange: '36 m (120 pies)',
        damageDice: '1d10',
        damageType: 'Fuego',
        notes: 'Prende objetos inflamables que no se estén vistiendo o portando.'
      },
      {
        id: 'atk-dagger',
        name: 'Daga Plateada',
        type: 'melee',
        bonus: 4,
        reachOrRange: '1.5 m / Arrojadiza 6/18 m',
        damageDice: '1d4 + 2',
        damageType: 'Perforante'
      }
    ],
    features: [...SPELLCASTER_FEATURES_BY_LEVEL[1]],
    spellcasting: {
      ability: 'int',
      saveDc: 13,
      attackBonus: 5,
      cantrips: ['Rayo de Fuego', 'Luz', 'Prestidigitación'],
      knownSpells: [
        { name: 'Proyectil Mágico', level: 1, school: 'Evocación', desc: '3 dardos infalibles que infligen 1d4 + 1 de daño de fuerza cada uno.' },
        { name: 'Escudo', level: 1, school: 'Abjuración', desc: 'Reacción: +5 a la CA hasta el inicio de tu siguiente turno; anula Proyectil Mágico.' },
        { name: 'Manos Ardientes', level: 1, school: 'Evocación', desc: 'Cono de 15 pies; 3d6 de daño de fuego (Salvación DES mitad).' }
      ],
      slots: {
        1: { total: 2, used: 0 }
      }
    },
    personalityTrait: 'Nervioso pero entusiasta; lleva un pergamino lleno de apuntes que consulta antes de lanzar cada conjuro.'
  },
  {
    id: 'preset-acolyte',
    name: 'Hermana Lira',
    creatureType: 'Acólita Curandera',
    size: 'Mediano',
    sidekickClass: 'spellcaster',
    role: 'healer',
    level: 1,
    armorClass: 14,
    armorType: 'Cota de escamas de bronce',
    speed: 9,
    maxHp: 10,
    currentHp: 10,
    tempHp: 0,
    hitDie: 'd8',
    abilities: { str: 10, dex: 12, con: 14, int: 11, wis: 16, cha: 13 },
    savingThrows: { wis: true, cha: true },
    skills: ['Medicina (+5)', 'Perspicacia (+5)', 'Religión (+2)'],
    passivePerception: 13,
    attacks: [
      {
        id: 'atk-sacred-flame',
        name: 'Llama Sagrada (Sacred Flame)',
        type: 'spell',
        bonus: 5,
        reachOrRange: '18 m (60 pies)',
        damageDice: '1d8',
        damageType: 'Radiante',
        notes: 'Salvación de DESTREZA CD 13. El objetivo no obtiene beneficio de cobertura.'
      },
      {
        id: 'atk-mace',
        name: 'Maza de Clérigo',
        type: 'melee',
        bonus: 2,
        reachOrRange: '1.5 m (5 pies)',
        damageDice: '1d6',
        damageType: 'Contundente'
      }
    ],
    features: [...SPELLCASTER_FEATURES_BY_LEVEL[1]],
    spellcasting: {
      ability: 'wis',
      saveDc: 13,
      attackBonus: 5,
      cantrips: ['Llama Sagrada', 'Piedad con los Moribundos', 'Guía'],
      knownSpells: [
        { name: 'Curar Heridas', level: 1, school: 'Evocación', desc: 'Acción: Toca a una criatura y recupera 1d8 + 3 puntos de golpe.' },
        { name: 'Palabra de Curación', level: 1, school: 'Evocación', desc: 'Acción Adicional: Una criatura a hasta 60 pies recupera 1d4 + 3 PG.' },
        { name: 'Bendición (Bless)', level: 1, school: 'Encantamiento', desc: 'Hasta 3 aliados suman 1d4 a tiradas de ataque y salvación durante 1 minuto.' }
      ],
      slots: {
        1: { total: 2, used: 0 }
      }
    },
    personalityTrait: 'Tranquilizadora y serena en medio del caos; lleva vendajes limpios y hierbas de olor dulce.'
  },
  {
    id: 'preset-rogue-goblin',
    name: 'Snick Ganzúas',
    creatureType: 'Trasgo Pillo',
    size: 'Pequeño',
    sidekickClass: 'expert',
    role: 'attacker',
    level: 1,
    armorClass: 14,
    armorType: 'Cuero endurecido',
    speed: 9,
    maxHp: 9,
    currentHp: 9,
    tempHp: 0,
    hitDie: 'd6',
    abilities: { str: 8, dex: 17, con: 12, int: 13, wis: 10, cha: 12 },
    savingThrows: { dex: true, int: true },
    skills: ['Sigilo (+5)', 'Juego de Manos (+5)', 'Acrobacias (+5)', 'Percepción (+2)', 'Engaño (+3)'],
    passivePerception: 12,
    attacks: [
      {
        id: 'atk-dagger-snick',
        name: 'Daga Envenenada Sutil',
        type: 'melee',
        bonus: 5,
        reachOrRange: '1.5 m / Arrojadiza 6/18 m',
        damageDice: '1d4 + 3',
        damageType: 'Perforante'
      },
      {
        id: 'atk-shortbow-snick',
        name: 'Arco Corto Silencioso',
        type: 'ranged',
        bonus: 5,
        reachOrRange: '24/96 m',
        damageDice: '1d6 + 3',
        damageType: 'Perforante'
      }
    ],
    features: [
      {
        level: 1,
        name: 'Escape Ágil de Trasgo',
        source: 'Especie Trasgo',
        description: 'Puede Destrabarse o Esconderse como Acción Adicional.',
        actionType: 'bonus_action'
      },
      ...EXPERT_FEATURES_BY_LEVEL[1]
    ],
    personalityTrait: 'Siempre está jugando con una moneda entre los dedos y husmeando cerraduras sospechosas.'
  },
  {
    id: 'preset-construct',
    name: 'Cíclope VII',
    creatureType: 'Autómata Centinela',
    size: 'Mediano',
    sidekickClass: 'warrior',
    role: 'defender',
    level: 1,
    armorClass: 17,
    armorType: 'Placas de bronce integradas (Natural)',
    speed: 9,
    maxHp: 15,
    currentHp: 15,
    tempHp: 0,
    hitDie: 'd8',
    abilities: { str: 16, dex: 10, con: 16, int: 6, wis: 10, cha: 5 },
    savingThrows: { str: true, con: true },
    skills: ['Atletismo (+5)', 'Percepción (+2)'],
    passivePerception: 12,
    attacks: [
      {
        id: 'atk-fist',
        name: 'Puño de Impacto Hidráulico',
        type: 'melee',
        bonus: 5,
        reachOrRange: '1.5 m (5 pies)',
        damageDice: '1d8 + 3',
        damageType: 'Contundente'
      }
    ],
    features: [
      {
        level: 1,
        name: 'Naturaleza de Constructo',
        source: 'Constructo',
        description: 'Inmune a veneno y a la condición envenenado. No necesita respirar, comer ni dormir.',
        actionType: 'passive'
      },
      ...WARRIOR_FEATURES_BY_LEVEL[1]
    ],
    personalityTrait: 'Emite un suave zumbido mecánico rítmico y se interpone rígidamente ante las flechas enemigas.'
  }
];
