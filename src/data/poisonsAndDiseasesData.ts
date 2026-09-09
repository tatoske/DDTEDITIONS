import {
  PoisonDef,
  DiseaseDef,
  HerbIngredientDef,
  AlchemicalRecipeDef
} from '../types/dnd';

// -------------------------------------------------------------
// 1. LOS 14 VENENOS CANÓNICOS OFICIALES (GUÍA DEL DUNGEON MASTER)
// -------------------------------------------------------------
export const POISONS_CATALOG: PoisonDef[] = [
  {
    id: 'assassins_blood',
    name: 'Sangre de Asesino (Assassin\'s Blood)',
    delivery: 'ingested',
    deliveryLabel: 'Ingestión',
    costGp: 150,
    saveDc: 10,
    damageDice: '1d12',
    effectDescription: 'Una criatura que ingiera este veneno debe superar una Salvación de Constitución CD 10 o sufrir 1d12 de daño por veneno y quedar Envenenada durante 24 horas. Con salvación exitosa, sufre la mitad de daño y no queda envenenada.',
    onsetTime: '10 minutos',
    duration: '24 horas',
    sourceBook: 'Guía del Dungeon Master 2024',
    badgeColor: '#ea580c'
  },
  {
    id: 'burnt_othur_fumes',
    name: 'Vaho de Othur Calcinado (Burnt Othur Fumes)',
    delivery: 'inhaled',
    deliveryLabel: 'Inhalación',
    costGp: 500,
    saveDc: 13,
    damageDice: '3d6',
    effectDescription: 'Un polvo acre que al arder llena un cubo de 1.5 metros. Toda criatura en el área debe superar una Salvación de CON CD 13 o sufrir 3d6 de daño por veneno más 1d6 de daño por veneno al inicio de cada uno de sus turnos. Tres salvaciones exitosas consecutivas terminan el efecto.',
    onsetTime: 'Inmediato',
    duration: 'Hasta 3 éxitos',
    sourceBook: 'Guía del Dungeon Master 2024',
    badgeColor: '#7c3aed'
  },
  {
    id: 'crawler_mucus',
    name: 'Mucosidad de Oruga Rastreadora (Crawler Mucus)',
    delivery: 'contact',
    deliveryLabel: 'Contacto',
    costGp: 200,
    saveDc: 13,
    damageDice: '0',
    effectDescription: 'Sustancia pegajosa extraída de los tentáculos de la oruga carroñera. Una criatura sometida a este veneno debe superar una Salvación de CON CD 13 o quedar Envenenada durante 1 minuto y Paralizada mientras esté envenenada de este modo. Puede repetir la salvación al final de cada turno.',
    onsetTime: 'Inmediato',
    duration: '1 minuto',
    sourceBook: 'Guía del Dungeon Master 2024',
    badgeColor: '#059669'
  },
  {
    id: 'drow_poison',
    name: 'Veneno Drow (Drow Poison)',
    delivery: 'injury',
    deliveryLabel: 'Lesión',
    costGp: 200,
    saveDc: 13,
    damageDice: '0',
    effectDescription: 'Elaborado solo por los elfos oscuros en las profundidades. Una criatura herida debe superar una Salvación de CON CD 13 o quedar Envenenada durante 1 hora. Si falla la salvación por 5 o más puntos (resultado 8 o menor), la criatura cae Inconsciente mientras esté envenenada.',
    onsetTime: 'Inmediato',
    duration: '1 hora',
    sourceBook: 'Guía del Dungeon Master 2024',
    badgeColor: '#3b82f6'
  },
  {
    id: 'essence_of_ether',
    name: 'Esencia de Éter (Essence of Ether)',
    delivery: 'inhaled',
    deliveryLabel: 'Inhalación',
    costGp: 300,
    saveDc: 15,
    damageDice: '0',
    effectDescription: 'Vapor narcótico incoloro e inodoro. Una criatura sometida a este gas debe superar una Salvación de CON CD 15 o quedar Envenenada durante 8 horas y caer Inconsciente mientras esté envenenada. Despertar requiere recibir daño o ser sacudida con una acción.',
    onsetTime: 'Inmediato',
    duration: '8 horas',
    sourceBook: 'Guía del Dungeon Master 2024',
    badgeColor: '#8b5cf6'
  },
  {
    id: 'malice',
    name: 'Sangre de Malicia (Malice)',
    delivery: 'inhaled',
    deliveryLabel: 'Inhalación',
    costGp: 250,
    saveDc: 15,
    damageDice: '0',
    effectDescription: 'Polvo mineral negro. Toda criatura que lo inhale debe superar una Salvación de CON CD 15 o quedar Envenenada durante 1 hora y Cegada durante ese tiempo.',
    onsetTime: 'Inmediato',
    duration: '1 hora',
    sourceBook: 'Guía del Dungeon Master 2024',
    badgeColor: '#64748b'
  },
  {
    id: 'midnight_tears',
    name: 'Lágrimas de Medianoche (Midnight Tears)',
    delivery: 'ingested',
    deliveryLabel: 'Ingestión',
    costGp: 1500,
    saveDc: 17,
    damageDice: '9d6',
    effectDescription: 'Un veneno letal e indetectable al paladar. Una criatura que lo ingiera no sufre ningún efecto hasta que el reloj marca la medianoche. En ese momento, debe superar una Salvación de CON CD 17 o sufrir 9d6 de daño por veneno (mitad con éxito).',
    onsetTime: 'Latente hasta medianoche',
    duration: 'Instantáneo a medianoche',
    sourceBook: 'Guía del Dungeon Master 2024',
    badgeColor: '#e11d48'
  },
  {
    id: 'oil_of_taggit',
    name: 'Aceite de Taggit (Oil of Taggit)',
    delivery: 'contact',
    deliveryLabel: 'Contacto',
    costGp: 400,
    saveDc: 13,
    damageDice: '0',
    effectDescription: 'Savia grasa y transparente. Una criatura expuesta por contacto en la piel debe superar una Salvación de CON CD 13 o quedar Envenenada durante 24 horas y caer Inconsciente mientras esté envenenada.',
    onsetTime: 'Inmediato',
    duration: '24 horas',
    sourceBook: 'Guía del Dungeon Master 2024',
    badgeColor: '#d97706'
  },
  {
    id: 'pale_tincture',
    name: 'Tintura Pálida (Pale Tincture)',
    delivery: 'ingested',
    deliveryLabel: 'Ingestión',
    costGp: 250,
    saveDc: 16,
    damageDice: '1d6',
    effectDescription: 'Líquido lechoso. Una criatura que lo beba debe superar una Salvación de CON CD 16 o sufrir 1d6 de daño por veneno y quedar Envenenada. La criatura no puede recuperar puntos de golpe por ningún medio y debe repetir la salvación cada 24 horas sufriendo 1d6 adicional con cada fallo hasta acumular 7 éxitos.',
    onsetTime: '1 hora',
    duration: 'Permanente hasta 7 éxitos',
    sourceBook: 'Guía del Dungeon Master 2024',
    badgeColor: '#0284c7'
  },
  {
    id: 'purple_worm_poison',
    name: 'Veneno de Gusano Púrpura (Purple Worm Poison)',
    delivery: 'injury',
    deliveryLabel: 'Lesión',
    costGp: 2000,
    saveDc: 19,
    damageDice: '12d6',
    effectDescription: 'Toxina letal extraída del aguijón de un gusano púrpura titánico. Una criatura herida debe superar una Salvación de CON CD 19 o sufrir 12d6 de daño por veneno (mitad si supera la tirada).',
    onsetTime: 'Inmediato',
    duration: 'Instantáneo',
    sourceBook: 'Guía del Dungeon Master 2024',
    badgeColor: '#9333ea'
  },
  {
    id: 'serpent_venom',
    name: 'Veneno de Serpiente (Serpent Venom)',
    delivery: 'injury',
    deliveryLabel: 'Lesión',
    costGp: 200,
    saveDc: 11,
    damageDice: '3d6',
    effectDescription: 'Extraído de víboras gigantes o serpientes marinas. Una criatura golpeada debe superar una Salvación de CON CD 11 o sufrir 3d6 de daño por veneno (mitad de daño si tiene éxito).',
    onsetTime: 'Inmediato',
    duration: 'Instantáneo',
    sourceBook: 'Guía del Dungeon Master 2024',
    badgeColor: '#16a34a'
  },
  {
    id: 'torpor',
    name: 'Tormento / Estupor (Torpor)',
    delivery: 'ingested',
    deliveryLabel: 'Ingestión',
    costGp: 450,
    saveDc: 15,
    damageDice: '0',
    effectDescription: 'Polvo amargo soluble en vino. Si una criatura lo consume, debe superar una Salvación de CON CD 15 o quedar Envenenada e Incapacitada durante 4d6 horas.',
    onsetTime: '15 minutos',
    duration: '4d6 horas',
    sourceBook: 'Guía del Dungeon Master 2024',
    badgeColor: '#475569'
  },
  {
    id: 'truth_serum',
    name: 'Suero de la Verdad (Truth Serum)',
    delivery: 'ingested',
    deliveryLabel: 'Ingestión',
    costGp: 150,
    saveDc: 11,
    damageDice: '0',
    effectDescription: 'Líquido cristalino sin olor. Una criatura sometida debe superar una Salvación de CON CD 11 o quedar Envenenada durante 1 hora. Mientras esté envenenada, la criatura no puede pronunciar una mentira deliberada (como bajo el conjuro Zona de la Verdad).',
    onsetTime: '10 minutos',
    duration: '1 hora',
    sourceBook: 'Guía del Dungeon Master 2024',
    badgeColor: '#0d9488'
  },
  {
    id: 'wyvern_poison',
    name: 'Veneno de Guiverno (Wyvern Poison)',
    delivery: 'injury',
    deliveryLabel: 'Lesión',
    costGp: 1200,
    saveDc: 15,
    damageDice: '7d6',
    effectDescription: 'Fluido esmeralda viscoso extraído del aguijón caudal de un guiverno. Una criatura herida debe superar una Salvación de CON CD 15 o sufrir 7d6 de daño por veneno (mitad con éxito).',
    onsetTime: 'Inmediato',
    duration: 'Instantáneo',
    sourceBook: 'Guía del Dungeon Master 2024',
    badgeColor: '#15803d'
  }
];

// -------------------------------------------------------------
// 2. ENFERMEDADES CANÓNICAS (GUÍA DEL DUNGEON MASTER & XANATHAR)
// -------------------------------------------------------------
export const DISEASES_CATALOG: DiseaseDef[] = [
  {
    id: 'sewer_plague',
    name: 'Fiebre de las Alcantarillas (Sewer Plague)',
    transmission: 'Mordedura de rata gigante, contacto con aguas residuales contaminadas u otyughs.',
    saveDc: 11,
    incubationPeriod: '1d4 días',
    symptoms: 'Fiebres ardientes, náuseas, calambres musculares y pústulas supurantes.',
    progression: 'Al terminar un descanso largo, la criatura debe superar una Salvación de CON CD 11 o ganar 1 nivel de agotamiento. Los dados de golpe gastados solo recuperan la mitad del valor.',
    cureRequirement: 'Tres tiradas de salvación exitosas consecutivas o conjuro Restablecimiento Menor.',
    sourceBook: 'Guía del Dungeon Master 2024',
    dangerSeverity: 'moderada'
  },
  {
    id: 'cackle_fever',
    name: 'Fiebre Risueña (Cackle Fever)',
    transmission: 'Inhalación de esporas de hongos parásitos transmitidas por gnomos o trasgos infectados.',
    saveDc: 13,
    incubationPeriod: '1d4 horas',
    symptoms: 'Ataques convulsivos de risa histérica y desvaríos lúcidos que impiden la concentración.',
    progression: 'Al recibir daño o entrar en combate, debe superar una Salvación de CON CD 13 o empezar a reír histéricamente quedando Incapacitada durante 1 minuto y sufriendo 1d10 de daño psíquico.',
    cureRequirement: 'Conjuro Restablecimiento Menor o 3 descansos largos con salvación exitosa y reposo absoluto.',
    sourceBook: 'Guía del Dungeon Master 2024',
    dangerSeverity: 'moderada'
  },
  {
    id: 'sight_rot',
    name: 'Podredumbre Ocular (Sight Rot)',
    transmission: 'Beber agua estancada o pantanosa infectada con bacterias parásitas.',
    saveDc: 15,
    incubationPeriod: '24 horas',
    symptoms: 'Visión borrosa, ardor agudo en las cuencas oculares y secreción viscosa amarillenta.',
    progression: 'Día 1: Desventaja en pruebas de Percepción basadas en la vista y en ataques a distancia. Día 2 en adelante: Si falla la salvación diaria, queda permanentemente Cegada.',
    cureRequirement: 'Lavarse los ojos con una infusión de Flor de Loto purificada o conjuro Restablecimiento Menor.',
    sourceBook: 'Guía del Dungeon Master 2024',
    dangerSeverity: 'moderada'
  },
  {
    id: 'mummy_rot',
    name: 'Podredumbre de Momia (Mummy Rot)',
    transmission: 'Golpe de puño maldito o toque de una Momia o Señor Momia.',
    saveDc: 12,
    incubationPeriod: 'Inmediata',
    symptoms: 'La carne se seca como pergamino quebradizo y se desmorona en polvo grisáceo.',
    progression: 'La criatura infectada no puede recuperar puntos de golpe bajo ningún concepto (ni pociones, ni descanso, ni curar heridas). Cada 24 horas su máximo de PG se reduce en 3d6. Si llega a 0 PG, el cuerpo se desintegra en polvo.',
    cureRequirement: 'Exige conjuro Quitar Maldición antes de poder sanar con Restablecimiento Mayor o Menor.',
    sourceBook: 'Manual de Monstruos & DMG 2024',
    dangerSeverity: 'mortal'
  },
  {
    id: 'ash_shakes',
    name: 'Temblores de Ceniza (Ash Shakes)',
    transmission: 'Inhalación continua de ceniza sulfurosa o polvo de tumbas profanadas.',
    saveDc: 12,
    incubationPeriod: '12 horas',
    symptoms: 'Temblores incontrolables en las manos, tos seca con restos de ceniza negra.',
    progression: 'Desventaja en todas las tiradas de ataque con armas y pruebas de Destreza (Juego de Manos, Sigilo, Acrobacias).',
    cureRequirement: 'Infusión de Raíz de Plata o dos descansos largos en aire puro de montaña.',
    sourceBook: 'Guía de Xanathar para Todo',
    dangerSeverity: 'leve'
  },
  {
    id: 'red_death',
    name: 'Peste Roja (Red Death)',
    transmission: 'Contacto con sangre o fluidos de vampiros descompuestos o demonios de sangre.',
    saveDc: 14,
    incubationPeriod: '6 horas',
    symptoms: 'Hemorragias nasales, ojos inyectados en sangre y debilidad generalizada.',
    progression: 'Sufre 2d6 de daño necrótico cada amanecer y no puede beneficiarse de descanso corto.',
    cureRequirement: 'Bálsamo de Flor de Sangre o conjuro Sanar.',
    sourceBook: 'Guía de Van Richten para Ravenloft',
    dangerSeverity: 'mortal'
  }
];

// -------------------------------------------------------------
// 3. HIERBAS E INGREDIENTES BOTÁNICOS (XANATHAR P. 130)
// -------------------------------------------------------------
export const HERBS_CATALOG: HerbIngredientDef[] = [
  {
    id: 'mandrake_root',
    name: 'Raíz de Mandrágora Gris',
    biome: 'Bosques y Colinas',
    rarity: 'Común',
    extractUse: 'Base estabilizadora para Pociones de Curación y Antídotos.',
    description: 'Raíz nudosa con forma vagamente humanoide que exhala un vapor balsámico al ser macerada con alcohol de grano.'
  },
  {
    id: 'midnight_lily',
    name: 'Loto de Medianoche',
    biome: 'Pantanos y Ciénagas',
    rarity: 'Raro',
    extractUse: 'Ingrediente clave de Lágrimas de Medianoche y Podredumbre Ocular.',
    description: 'Flor acuática negra como el ónice que solo abre sus pétalos con la luna llena y concentra alcaloides mortales.'
  },
  {
    id: 'frost_lichen',
    name: 'Líquen Glacial de Escarcha',
    biome: 'Montañas y Picos Nevados',
    rarity: 'Poco común',
    extractUse: 'Elixires de resistencia al fuego y bálsamos antiinflamatorios.',
    description: 'Musgo blanquecino que crece sobre la roca congelada y mantiene una temperatura constante bajo cero.'
  },
  {
    id: 'sulfur_thistle',
    name: 'Cardo de Azufre Volcánico',
    biome: 'Zonas Volcánicas y Tierras Baldías',
    rarity: 'Poco común',
    extractUse: 'Componente para Fuego de Alquimista y Vaho de Othur.',
    description: 'Planta con espinas vidriosas de color amarillo canario que chisporrotean al contacto con el aire húmedo.'
  },
  {
    id: 'shadow_fungus',
    name: 'Hongo de Sombra del Infraoscuro',
    biome: 'Infraoscuro y Cavernas',
    rarity: 'Raro',
    extractUse: 'Preparación de Veneno Drow y Aceite de Taggit.',
    description: 'Hongo que absorbe la luz en un radio de 30 cm y secreta un aceite paralizante para capturar insectos ciegos.'
  },
  {
    id: 'golden_oak_sap',
    name: 'Savia de Roble Dorado',
    biome: 'Bosques Templados',
    rarity: 'Común',
    extractUse: 'Pociones de Curación Mayor y ungüentos cicatrizantes.',
    description: 'Resina espesa con reflejos ambarinos que acelera la coagulación celular de heridas cortantes.'
  },
  {
    id: 'dragon_blood_bulb',
    name: 'Bulbo de Sangre de Dragón',
    biome: 'Tierras Altas y Colinas Rocosas',
    rarity: 'Muy raro',
    extractUse: 'Elixires de fuerza de gigante y venenos devastadores.',
    description: 'Tubérculo rojo carmesí que brota únicamente donde cayó sangre de un dragón verdadero.'
  },
  {
    id: 'sweet_brine_kelp',
    name: 'Alga de Salmuera Dulce',
    biome: 'Costas y Océanos',
    rarity: 'Común',
    extractUse: 'Filtro purificador de agua y cataplasmas contra el escorbuto.',
    description: 'Alga larga y elástica que filtra la sal marina reteniendo agua dulce pura en sus vesículas.'
  },
  {
    id: 'pure_silver_moss',
    name: 'Musgo de Plata Pura',
    biome: 'Cavernas Subterráneas',
    rarity: 'Poco común',
    extractUse: 'Remedios contra licantropía y fiebres contagiosas.',
    description: 'Tapiz vegetal con microfilamentos metálicos de plata pura que desinfecta heridas infectadas por no-muertos.'
  },
  {
    id: 'crimson_belladonna',
    name: 'Belladona Carmesí',
    biome: 'Ruinas y Bosques Antiguos',
    rarity: 'Poco común',
    extractUse: 'Síntesis de Sangre de Asesino y Sueros Narcóticos.',
    description: 'Bayas oscuras de brillo tentador pero cargadas con neurotoxinas que adormecen el sistema nervioso.'
  }
];

// -------------------------------------------------------------
// 4. FÓRMULAS Y RECETAS ALQUÍMICAS (XANATHAR P. 130)
// -------------------------------------------------------------
export const ALCHEMICAL_RECIPES: AlchemicalRecipeDef[] = [
  {
    id: 'craft_healing_potion',
    name: 'Poción de Curación Estándar',
    outputItem: 'Poción de Curación (2d4 + 2 PG)',
    toolRequired: 'Kit de Herboristería',
    craftingCostGp: 25,
    daysRequired: 1,
    requiredIngredients: ['Raíz de Mandrágora Gris', 'Agua de manantial purificada'],
    effectDescription: 'Restaura 2d4 + 2 puntos de golpe al beberse (usando acción adicional en reglas 2024).'
  },
  {
    id: 'craft_greater_healing',
    name: 'Poción de Curación Mayor',
    outputItem: 'Poción de Curación Mayor (4d4 + 4 PG)',
    toolRequired: 'Kit de Herboristería',
    craftingCostGp: 100,
    daysRequired: 3,
    requiredIngredients: ['Savia de Roble Dorado', 'Raíz de Mandrágora Gris'],
    effectDescription: 'Restaura 4d4 + 4 puntos de golpe al consumirse.'
  },
  {
    id: 'craft_antitoxin',
    name: 'Antitoxina Universal',
    outputItem: 'Frasco de Antitoxina',
    toolRequired: 'Suministros de Alquimista',
    craftingCostGp: 25,
    daysRequired: 1,
    requiredIngredients: ['Musgo de Plata Pura', 'Alga de Salmuera Dulce'],
    effectDescription: 'Otorga Ventaja en todas las tiradas de salvación contra venenos durante 1 hora completa.'
  },
  {
    id: 'craft_alchemist_fire',
    name: 'Fuego de Alquimista',
    outputItem: 'Frasco de Fuego de Alquimista',
    toolRequired: 'Suministros de Alquimista',
    craftingCostGp: 25,
    daysRequired: 1,
    requiredIngredients: ['Cardo de Azufre Volcánico', 'Aceite mineral refinado'],
    effectDescription: 'Arma arrojadiza (alcance 6 m). Inflige 1d4 de fuego continuo cada asalto hasta que el objetivo gaste una acción en apagarlo.'
  },
  {
    id: 'craft_oil_of_taggit',
    name: 'Aceite de Taggit Narcótico',
    outputItem: 'Dosis de Aceite de Taggit (Contacto)',
    toolRequired: 'Kit de Envenenador',
    craftingCostGp: 200,
    daysRequired: 4,
    requiredIngredients: ['Hongo de Sombra del Infraoscuro', 'Belladona Carmesí'],
    effectDescription: 'Veneno de contacto (CD 13 CON). Provoca Inconsciencia durante 24 horas.'
  },
  {
    id: 'craft_serpent_venom',
    name: 'Veneno de Serpiente Sintético',
    outputItem: 'Dosis de Veneno de Serpiente (Lesión)',
    toolRequired: 'Kit de Envenenador',
    craftingCostGp: 100,
    daysRequired: 2,
    requiredIngredients: ['Belladona Carmesí', 'Glándula de reptil venenoso'],
    effectDescription: 'Veneno de lesión para armas (CD 11 CON). Inflige 3d6 de daño por veneno.'
  },
  {
    id: 'craft_fever_remedy',
    name: 'Ungüento contra la Fiebre de Alcantarilla',
    outputItem: 'Bálsamo Antipestilente',
    toolRequired: 'Kit de Herboristería',
    craftingCostGp: 30,
    daysRequired: 1,
    requiredIngredients: ['Musgo de Plata Pura', 'Líquen Glacial de Escarcha'],
    effectDescription: 'Concede ventaja en la próxima salvación diaria contra Fiebre de las Alcantarillas o Temblores de Ceniza.'
  },
  {
    id: 'craft_acid_flask',
    name: 'Frasco de Ácido Concentrado',
    outputItem: 'Frasco de Ácido',
    toolRequired: 'Suministros de Alquimista',
    craftingCostGp: 12,
    daysRequired: 1,
    requiredIngredients: ['Cardo de Azufre Volcánico', 'Sal de roca sulfúrica'],
    effectDescription: 'Ataque a distancia arrojadizo que inflige 2d6 de daño por ácido al estallar.'
  }
];
