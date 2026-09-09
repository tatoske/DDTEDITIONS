import { SpeciesDef, ClassDef, BackgroundDef, Spell, Monster } from '../types/dnd';

export const INITIAL_SPECIES: SpeciesDef[] = [
  {
    id: 'humano',
    name: 'Humano',
    speed: 9,
    size: 'Mediano',
    darkvision: 0,
    traits: [
      { name: 'Versatilidad Ingeniosa', desc: 'Ganas inspiración heroica cada vez que terminas un descanso largo.' },
      { name: 'Dote Adicional', desc: 'Obtienes una dote de origen adicional de tu elección a nivel 1.' },
      { name: 'Habilidad Extra', desc: 'Ganas competencia en una habilidad adicional de tu elección.' }
    ],
    description: 'Ambiciosos, diversos e increíblemente adaptables, los humanos son la especie más extendida en los mundos del multiverso.'
  },
  {
    id: 'elfo',
    name: 'Elfo',
    speed: 9,
    size: 'Mediano',
    darkvision: 18,
    traits: [
      { name: 'Ascendencia Feérica', desc: 'Tienes ventaja en tiradas de salvación para evitar o terminar la condición de Hechizado en ti.' },
      { name: 'Sentidos Agudos', desc: 'Tienes competencia en la habilidad Percepción.' },
      { name: 'Trance', desc: 'No necesitas dormir. En su lugar, meditas profundamente durante 4 horas para obtener el beneficio de un descanso largo.' }
    ],
    description: 'Seres mágicos y longevos de gracia sin igual, conectados profundamente con la naturaleza y el reino feérico.'
  },
  {
    id: 'enano',
    name: 'Enano',
    speed: 9,
    size: 'Mediano',
    darkvision: 36,
    traits: [
      { name: 'Resistencia Enana', desc: 'Tienes resistencia al daño por veneno y ventaja en salvaciones contra ser Envenenado.' },
      { name: 'Resistencia Pétrea', desc: 'Tu máximo de puntos de golpe aumenta en 1, y vuelve a aumentar en 1 cada vez que subes de nivel.' },
      { name: 'Afinidad con la Piedra', desc: 'Como acción adicional, ganas sentido sísmico de 18 metros durante 10 minutos cuando estés en contacto con piedra.' }
    ],
    description: 'Guerreros y artesanos robustos de las montañas y profundidades subterráneas, famosos por su resistencia inquebrantable.'
  },
  {
    id: 'mediano',
    name: 'Mediano (Halfling)',
    speed: 9,
    size: 'Pequeño',
    darkvision: 0,
    traits: [
      { name: 'Afortunado', desc: 'Cuando sacas un 1 en una tirada de d20 para un ataque, prueba o salvación, puedes volver a tirar el dado.' },
      { name: 'Valiente', desc: 'Tienes ventaja en tiradas de salvación para evitar o terminar la condición de Asustado.' },
      { name: 'Agilidad Mediana', desc: 'Puedes moverte a través del espacio de cualquier criatura que sea de un tamaño mayor que el tuyo.' }
    ],
    description: 'Gente pacífica, ingeniosa y alegre, dotada de una suerte legendaria que les permite salir airosos de los mayores peligros.'
  },
  {
    id: 'gnomo',
    name: 'Gnomo',
    speed: 9,
    size: 'Pequeño',
    darkvision: 18,
    traits: [
      { name: 'Astucia Gnómica', desc: 'Tienes ventaja en todas las tiradas de salvación de Inteligencia, Sabiduría y Carisma contra magia.' },
      { name: 'Linaje Gnómico', desc: 'Puedes elegir entre Gnomo de los Bosques (con truco Ilusión Menor y comunicación con bestias) o Gnomo de las Rocas (con truco Prestidigitación y creación de artilugios).' }
    ],
    description: 'Entusiastas investigadores, inventores e ilusionistas cuyo entusiasmo por la vida y el conocimiento no conoce límites.'
  },
  {
    id: 'tiefling',
    name: 'Tiefling',
    speed: 9,
    size: 'Mediano',
    darkvision: 18,
    traits: [
      { name: 'Legado Infernal/Abisal/Ctonio', desc: 'Obtienes resistencia al fuego, veneno o frío, y conjuros inherentes que se desbloquean a nivel 1, 3 y 5.' },
      { name: 'Taumaturgia', desc: 'Conoces el truco Taumaturgia y puedes lanzarlo a voluntad.' }
    ],
    description: 'Portadores de un legado de los planos inferiores que se manifiesta en cuernos, cola prensil y una magia ardiente en su interior.'
  },
  {
    id: 'draconido',
    name: 'Dracónido',
    speed: 9,
    size: 'Mediano',
    darkvision: 18,
    traits: [
      { name: 'Arma de Aliento', desc: 'Exhalas energía destructiva (cono de 4.5 m o línea de 9 m). El daño escala con tu nivel (1d10 a 4d10).' },
      { name: 'Resistencia Dracónica', desc: 'Tienes resistencia al tipo de daño asociado a tu ancestro dragón (Fuego, Frío, Relámpago, Ácido o Veneno).' },
      { name: 'Vuelo Dracónico (Nivel 5)', desc: 'A partir de nivel 5, puedes desplegar alas espectrales como acción adicional durante 10 minutos.' }
    ],
    description: 'Orgullosos combatientes con escamas relucientes y el poder primordial de los dragones fluyendo por sus venas.'
  },
  {
    id: 'orco',
    name: 'Orco',
    speed: 9,
    size: 'Mediano',
    darkvision: 36,
    traits: [
      { name: 'Embestida Feroz', desc: 'Como acción adicional, puedes correr hacia un enemigo y ganar puntos de golpe temporales iguales a tu bono de competencia.' },
      { name: 'Aguante Incansable', desc: 'Cuando tus puntos de golpe se reducen a 0 sin morir instantáneamente, puedes quedarte a 1 punto de golpe (1 vez por descanso largo).' }
    ],
    description: 'Criaturas tenaces, fuertes y honorables, bendecidas con una vitalidad prodigiosa frente a la adversidad.'
  },
  {
    id: 'goliat',
    name: 'Goliat',
    speed: 10.5,
    size: 'Mediano',
    darkvision: 0,
    traits: [
      { name: 'Ancestro Gigante', desc: 'Elige un linaje (Fuego, Escarcha, Colina, Nube, Tormenta, Piedra) con beneficios únicos de daño y maniobra.' },
      { name: 'Gran Constitución', desc: 'Cuentas como una criatura de un tamaño mayor para determinar tu capacidad de carga y lo que puedes empujar o levantar.' }
    ],
    description: 'Imponentes descendientes de los gigantes que habitan en cumbres escarpadas, dotados de una fuerza física colosal.'
  },
  {
    id: 'aasimar',
    name: 'Aasimar',
    speed: 9,
    size: 'Mediano',
    darkvision: 18,
    traits: [
      { name: 'Manos Curativas', desc: 'Como acción, tocas a una criatura y restauras HP iguales a tantos d4s como tu bono de competencia.' },
      { name: 'Resistencia Celestial', desc: 'Tienes resistencia al daño radiante y daño necrótico.' },
      { name: 'Revelación Celestial (Nivel 3)', desc: 'Transformación durante 1 minuto con vuelo radiante, aura de fuego sagrado o sudario de almas.' }
    ],
    description: 'Almas bendecidas por la luz de los planos superiores, nacidas para servir como campeones contra la oscuridad.'
  }
];

export const INITIAL_CLASSES: ClassDef[] = [
  {
    id: 'barbaro',
    name: 'Bárbaro',
    hitDie: '1d12',
    primaryAbility: ['str', 'con'],
    savingThrows: ['str', 'con'],
    armorProficiencies: ['Armaduras ligeras', 'Armaduras intermedias', 'Escudos'],
    weaponProficiencies: ['Armas simples', 'Armas marciales'],
    description: 'Un guerrero feroz de instinto primario que entra en una cólera devastadora en el campo de batalla.',
    features: [
      { level: 1, name: 'Furia (Rage)', desc: 'Ganas resistencia a contundente, perforante y cortante, daño extra en ataques con Fuerza y ventaja en pruebas de Fuerza.' },
      { level: 1, name: 'Defensa sin Armadura', desc: 'Tu CA es igual a 10 + Mod. Destreza + Mod. Constitución cuando no llevas armadura.' },
      { level: 2, name: 'Ataque Temerario', desc: 'Ganas ventaja en tus tiradas de ataque con Fuerza, a cambio de otorgar ventaja a los ataques contra ti.' }
    ]
  },
  {
    id: 'bardo',
    name: 'Bardo',
    hitDie: '1d8',
    primaryAbility: ['cha', 'dex'],
    savingThrows: ['dex', 'cha'],
    armorProficiencies: ['Armaduras ligeras'],
    weaponProficiencies: ['Armas simples'],
    spellcastingAbility: 'cha',
    description: 'Un maestro de la música, el relato y la magia arcana que inspira a sus aliados y manipula a sus enemigos.',
    features: [
      { level: 1, name: 'Lanzamiento de Conjuros', desc: 'Lanzas conjuros arcanos usando tu Carisma como aptitud mágica.' },
      { level: 1, name: 'Inspiración Bárdica (d6)', desc: 'Otorga un dado de inspiración a un aliado como acción adicional para sumarlo a tiradas de d20 o curación.' },
      { level: 2, name: 'Todoterreno (Jack of All Trades)', desc: 'Suma la mitad de tu bono de competencia a cualquier prueba que no incluya ya tu competencia.' }
    ]
  },
  {
    id: 'clerigo',
    name: 'Clérigo',
    hitDie: '1d8',
    primaryAbility: ['wis'],
    savingThrows: ['wis', 'cha'],
    armorProficiencies: ['Armaduras ligeras', 'Armaduras intermedias', 'Escudos'],
    weaponProficiencies: ['Armas simples'],
    spellcastingAbility: 'wis',
    description: 'Un intermediario sacerdotal imbuido del poder sagrado de una deidad o fuerza cósmica.',
    features: [
      { level: 1, name: 'Orden Sagrada (Protector o Erudito)', desc: 'Elige competencia en armaduras pesadas/armas marciales o bono a habilidades religiosas y taumaturgia.' },
      { level: 1, name: 'Lanzamiento de Conjuros', desc: 'Canalizas milagros divinos usando tu Sabiduría.' },
      { level: 2, name: 'Canalizar Divinidad', desc: 'Expulsar no-muertos y chispas divinas de sanación o castigo.' }
    ]
  },
  {
    id: 'druida',
    name: 'Druida',
    hitDie: '1d8',
    primaryAbility: ['wis'],
    savingThrows: ['int', 'wis'],
    armorProficiencies: ['Armaduras ligeras', 'Armaduras intermedias', 'Escudos'],
    weaponProficiencies: ['Armas simples'],
    spellcastingAbility: 'wis',
    description: 'Un guardián del equilibrio natural capaz de adoptar formas de bestias salvajes y manipular los elementos.',
    features: [
      { level: 1, name: 'Orden Primigenia (Mago o Guardián)', desc: 'Mejora en trucos y magia de la naturaleza o armaduras intermedias y armas marciales.' },
      { level: 1, name: 'Lanzamiento de Conjuros Primigenios', desc: 'Magia conectada con la tierra y el cosmos usando Sabiduría.' },
      { level: 2, name: 'Forma Salvaje (Wild Shape)', desc: 'Te transformas mágicamente en una bestia que hayas visto.' }
    ]
  },
  {
    id: 'guerrero',
    name: 'Guerrero (Fighter)',
    hitDie: '1d10',
    primaryAbility: ['str', 'dex'],
    savingThrows: ['str', 'con'],
    armorProficiencies: ['Todas las armaduras', 'Escudos'],
    weaponProficiencies: ['Armas simples', 'Armas marciales'],
    description: 'Un maestro táctico y experto en todo tipo de armas y armaduras, disciplinado y letal.',
    features: [
      { level: 1, name: 'Estilo de Combate', desc: 'Elige un estilo como Arquería, Defensa, Duelo, Armas a dos manos, etc.' },
      { level: 1, name: 'Maestría con Armas (Weapon Mastery)', desc: 'Desbloquea propiedades tácticas de tus armas (Derribar, Mellar, Rozar, Empujar).' },
      { level: 1, name: 'Tomar Aliento (Second Wind)', desc: 'Como acción adicional, recuperas 1d10 + nivel puntos de golpe (usos por descanso corto/largo).' },
      { level: 2, name: 'Oleada de Acción (Action Surge)', desc: 'Realiza una acción adicional en tu turno.' }
    ]
  },
  {
    id: 'monje',
    name: 'Monje',
    hitDie: '1d8',
    primaryAbility: ['dex', 'wis'],
    savingThrows: ['str', 'dex'],
    armorProficiencies: ['Ninguna'],
    weaponProficiencies: ['Armas simples', 'Espadas cortas'],
    description: 'Un combatiente marcial que canaliza la energía espiritual del Ki / Foco para desatar golpes veloces.',
    features: [
      { level: 1, name: 'Artes Marciales (d6)', desc: 'Ataca con Destreza usando impactos desarmados, con daño aumentado y ataque adicional como acción bonus.' },
      { level: 1, name: 'Defensa sin Armadura', desc: 'Tu CA es igual a 10 + Mod. Destreza + Mod. Sabiduría.' },
      { level: 2, name: 'Puntos de Foco (Ki)', desc: 'Ráfaga de Golpes, Defensa Paciente y Paso del Viento.' }
    ]
  },
  {
    id: 'paladin',
    name: 'Paladín',
    hitDie: '1d10',
    primaryAbility: ['str', 'cha'],
    savingThrows: ['wis', 'cha'],
    armorProficiencies: ['Todas las armaduras', 'Escudos'],
    weaponProficiencies: ['Armas simples', 'Armas marciales'],
    spellcastingAbility: 'cha',
    description: 'Un guerrero consagrado por un juramento sagrado, portador de castigos radiantes y auras protectoras.',
    features: [
      { level: 1, name: 'Imposición de Manos (Lay on Hands)', desc: 'Reserva de curación sagrada igual a 5 × nivel de paladín.' },
      { level: 1, name: 'Sentido Divino y Conjuros', desc: 'Lanzas conjuros divinos basados en Carisma.' },
      { level: 2, name: 'Castigo Divino (Divine Smite)', desc: 'Canaliza energía radiante en tus golpes para daño destructivo extra.' }
    ]
  },
  {
    id: 'explorador',
    name: 'Explorador (Ranger)',
    hitDie: '1d10',
    primaryAbility: ['dex', 'wis'],
    savingThrows: ['str', 'dex'],
    armorProficiencies: ['Armaduras ligeras', 'Armaduras intermedias', 'Escudos'],
    weaponProficiencies: ['Armas simples', 'Armas marciales'],
    spellcastingAbility: 'wis',
    description: 'Un cazador y rastreador letal que domina los confines del mundo salvaje con magia y flechas certeras.',
    features: [
      { level: 1, name: 'Marca del Cazador Experta', desc: 'Lanza Marca del Cazador sin gastar espacios de conjuro varias veces al día.' },
      { level: 1, name: 'Maestría con Armas', desc: 'Utiliza las propiedades especiales de tus armas marciales.' },
      { level: 2, name: 'Lanzamiento de Conjuros y Estilo de Combate', desc: 'Conjuros de supervivencia, sigilo y daño basados en Sabiduría.' }
    ]
  },
  {
    id: 'picaro',
    name: 'Pícaro (Rogue)',
    hitDie: '1d8',
    primaryAbility: ['dex'],
    savingThrows: ['dex', 'int'],
    armorProficiencies: ['Armaduras ligeras'],
    weaponProficiencies: ['Armas simples', 'Armas marciales sutiles'],
    description: 'Un especialista en sigilo, trampas, trucos sucios y ataques demoledores a puntos vitales.',
    features: [
      { level: 1, name: 'Pericia (Expertise)', desc: 'Duplica tu bonificador de competencia en 2 habilidades de tu elección.' },
      { level: 1, name: 'Ataque Furtivo (Sneak Attack)', desc: 'Inflige 1d6 extra (escala por nivel) cuando tienes ventaja o un aliado a 1.5 m del objetivo.' },
      { level: 2, name: 'Acción Astuta (Cunning Action)', desc: 'Correr, Destrabarse o Esconderse como Acción Adicional.' }
    ]
  },
  {
    id: 'hechicero',
    name: 'Hechicero (Sorcerer)',
    hitDie: '1d6',
    primaryAbility: ['cha', 'con'],
    savingThrows: ['con', 'cha'],
    armorProficiencies: ['Ninguna'],
    weaponProficiencies: ['Armas simples'],
    spellcastingAbility: 'cha',
    description: 'Un mago innato con magia pura en la sangre, capaz de moldear sus hechizos con metamagia.',
    features: [
      { level: 1, name: 'Hechicería Innata', desc: 'Entra en un estado de éxtasis mágico que otorga ventaja en ataques de conjuro y aumenta la CD.' },
      { level: 1, name: 'Lanzamiento de Conjuros', desc: 'Lanzas magia basada en Carisma con salvación en Constitución.' },
      { level: 2, name: 'Puntos de Hechicería y Metamagia', desc: 'Acelerar conjuros, extender rango, sutilizar sin componentes verbales/somáticos.' }
    ]
  },
  {
    id: 'brujo',
    name: 'Brujo (Warlock)',
    hitDie: '1d8',
    primaryAbility: ['cha'],
    savingThrows: ['wis', 'cha'],
    armorProficiencies: ['Armaduras ligeras'],
    weaponProficiencies: ['Armas simples'],
    spellcastingAbility: 'cha',
    description: 'Un buscador de secretos cósmicos que pacta con entidades de inmenso poder a cambio de magia única.',
    features: [
      { level: 1, name: 'Magia del Pacto', desc: 'Espacios de conjuro que siempre se lanzan a su máximo nivel y se recuperan en descansos cortos.' },
      { level: 1, name: 'Descarga Sobrenatural (Eldritch Blast)', desc: 'El truco de daño por fuerza más icónico del multiverso.' },
      { level: 2, name: 'Invocaciones Sobrenaturales', desc: 'Mejoras permanentes de visión en oscuridad mágica, armadura espectral o empujes.' }
    ]
  },
  {
    id: 'mago',
    name: 'Mago (Wizard)',
    hitDie: '1d6',
    primaryAbility: ['int'],
    savingThrows: ['int', 'wis'],
    armorProficiencies: ['Ninguna'],
    weaponProficiencies: ['Armas simples'],
    spellcastingAbility: 'int',
    description: 'Un erudito supremo de las artes arcanas capaz de aprender y registrar cientos de conjuros en su libro.',
    features: [
      { level: 1, name: 'Libro de Conjuros', desc: 'Registras y preparas conjuros de la lista más amplia de todo D&D.' },
      { level: 1, name: 'Lanzamiento Ritual', desc: 'Lanza cualquier conjuro ritual de tu libro sin gastar espacio de conjuro.' },
      { level: 1, name: 'Recuperación Arcana', desc: 'Recupera espacios de conjuro gastados durante un descanso corto.' }
    ]
  }
];

export const INITIAL_BACKGROUNDS: BackgroundDef[] = [
  {
    id: 'acolito',
    name: 'Acólito',
    suggestedAbilities: ['wis', 'int', 'cha'],
    originFeat: 'Iniciado en la Magia (Clérigo)',
    skillProficiencies: ['Intuición', 'Religión'],
    toolProficiencies: ['Herramientas de caligrafía'],
    equipment: ['Símbolo sagrado', 'Libro de plegarias', 'Túnica sacerdotal', '50 PO'],
    description: 'Dedicaste tu juventud al servicio de un templo, aprendiendo ritos sagrados y devoción divina.'
  },
  {
    id: 'criminal',
    name: 'Criminal',
    suggestedAbilities: ['dex', 'con', 'int'],
    originFeat: 'Alerta (Alert)',
    skillProficiencies: ['Sigilo', 'Juego de Manos'],
    toolProficiencies: ['Herramientas de ladrón'],
    equipment: ['Palanca', 'Ropa oscura con capucha', 'Herramientas de ladrón', '50 PO'],
    description: 'Operaste en los bajos fondos, dominando el sigilo, cerraduras y las sombras urbanas.'
  },
  {
    id: 'soldado',
    name: 'Soldado',
    suggestedAbilities: ['str', 'con', 'dex'],
    originFeat: 'Brabucon / Combatiente Salvaje',
    skillProficiencies: ['Atletismo', 'Intimidación'],
    toolProficiencies: ['Set de juego (Dados o Cartas)', 'Vehículos terrestres'],
    equipment: ['Insignia de rango', 'Daga de combate', 'Uniforme militar', '50 PO'],
    description: 'Entrenado en táctica de combate y disciplina marcial en el ejército de una nación o compañía mercenaria.'
  },
  {
    id: 'sabio',
    name: 'Sabio (Sage)',
    suggestedAbilities: ['int', 'wis', 'con'],
    originFeat: 'Iniciado en la Magia (Mago)',
    skillProficiencies: ['Arcanos', 'Historia'],
    toolProficiencies: ['Herramientas de caligrafía'],
    equipment: ['Tinta y pluma', 'Libro de apuntes filosóficos', 'Ropas de erudito', '50 PO'],
    description: 'Pasaste años en bibliotecas y academias estudiando los secretos del universo y la historia antigua.'
  },
  {
    id: 'heroe-del-pueblo',
    name: 'Héroe del Pueblo (Folk Hero)',
    suggestedAbilities: ['con', 'str', 'wis'],
    originFeat: 'Duro (Tough)',
    skillProficiencies: ['Supervivencia', 'Trato con Animales'],
    toolProficiencies: ['Herramientas de artesano'],
    equipment: ['Pala', 'Olla de hierro', 'Ropa de trabajo resistente', '50 PO'],
    description: 'Te levantaste contra la tiranía o un peligro monstruoso para defender a la gente común de tu aldea.'
  },
  {
    id: 'noble',
    name: 'Noble',
    suggestedAbilities: ['cha', 'int', 'wis'],
    originFeat: 'Líder Inspirador / Hábil',
    skillProficiencies: ['Persuasión', 'Historia'],
    toolProficiencies: ['Set de ajedrez dragón'],
    equipment: ['Sello familiar', 'Ropas finas de seda', 'Monedero con 50 PO'],
    description: 'Nacido en la alta sociedad, entrenado en etiqueta cortesana, política y liderazgo.'
  }
];

export const INITIAL_SPELLS: Spell[] = [
  {
    id: 'descarga-sobrenatural',
    name: 'Descarga Sobrenatural (Eldritch Blast)',
    level: 0,
    school: 'Evocación',
    castingTime: '1 Acción',
    range: '36 metros (120 pies)',
    components: { v: true, s: true, m: false },
    duration: 'Instantáneo',
    concentration: false,
    ritual: false,
    description: 'Un rayo de energía chisporroteante golpea a una criatura. Haz un ataque de conjuro a distancia. Si impacta, el objetivo recibe 1d10 de daño por fuerza. A nivel 5 lanzas 2 rayos, a nivel 11 lanzas 3 rayos y a nivel 17 lanzas 4 rayos.',
    classes: ['Brujo']
  },
  {
    id: 'saeta-de-fuego',
    name: 'Saeta de Fuego (Fire Bolt)',
    level: 0,
    school: 'Evocación',
    castingTime: '1 Acción',
    range: '36 metros (120 pies)',
    components: { v: true, s: true, m: false },
    duration: 'Instantáneo',
    concentration: false,
    ritual: false,
    description: 'Lanzas una mota de fuego a una criatura u objeto. Haz un ataque de conjuro a distancia. Si impacta, inflige 1d10 de daño por fuego (enciende objetos inflamables no portados). Escala a 2d10 (nivel 5), 3d10 (nivel 11) y 4d10 (nivel 17).',
    classes: ['Mago', 'Hechicero', 'Artífice']
  },
  {
    id: 'curar-heridas',
    name: 'Curar Heridas (Cure Wounds)',
    level: 1,
    school: 'Abjuración / Evocación',
    castingTime: '1 Acción',
    range: 'Toque',
    components: { v: true, s: true, m: false },
    duration: 'Instantáneo',
    concentration: false,
    ritual: false,
    description: 'En las reglas D&D 2024, Curar Heridas ahora restaura la impresionante cantidad de 2d8 + tu modificador de aptitud mágica en puntos de golpe a la criatura tocada (+2d8 por cada nivel superior).',
    higherLevels: 'La curación aumenta en 2d8 por cada espacio de conjuro por encima de nivel 1.',
    classes: ['Bardo', 'Clérigo', 'Druida', 'Paladín', 'Explorador', 'Artífice']
  },
  {
    id: 'palabra-de-curacion',
    name: 'Palabra de Curación (Healing Word)',
    level: 1,
    school: 'Evocación',
    castingTime: '1 Acción Adicional',
    range: '18 metros (60 pies)',
    components: { v: true, s: false, m: false },
    duration: 'Instantáneo',
    concentration: false,
    ritual: false,
    description: 'En las reglas D&D 2024, restaura 2d4 + tu modificador de aptitud mágica en puntos de golpe a una criatura visible dentro del alcance como acción adicional.',
    higherLevels: 'Aumenta en 2d4 por cada nivel de espacio superior.',
    classes: ['Bardo', 'Clérigo', 'Druida']
  },
  {
    id: 'proyectil-magico',
    name: 'Proyectil Mágico (Magic Missile)',
    level: 1,
    school: 'Evocación',
    castingTime: '1 Acción',
    range: '36 metros (120 pies)',
    components: { v: true, s: true, m: false },
    duration: 'Instantáneo',
    concentration: false,
    ritual: false,
    description: 'Creas tres dardos brillantes de fuerza mágica. Cada dardo impacta automáticamente a una criatura visible sin necesidad de tirada de ataque, infligiendo 1d4 + 1 de daño de fuerza por dardo.',
    higherLevels: 'Creas un dardo adicional por cada nivel de espacio superior al 1.',
    classes: ['Mago', 'Hechicero']
  },
  {
    id: 'escudo',
    name: 'Escudo (Shield)',
    level: 1,
    school: 'Abjuración',
    castingTime: '1 Reacción (al ser impactado por un ataque o proyectil mágico)',
    range: 'Personal',
    components: { v: true, s: true, m: false },
    duration: '1 Asalto (hasta el inicio de tu siguiente turno)',
    concentration: false,
    ritual: false,
    description: 'Una barrera invisible de fuerza mágica surge para protegerte. Obtienes un bonificador de +5 a tu CA, incluyendo el ataque desencadenante, y recibes cero daño de proyectil mágico.',
    classes: ['Mago', 'Hechicero']
  },
  {
    id: 'bola-de-fuego',
    name: 'Bola de Fuego (Fireball)',
    level: 3,
    school: 'Evocación',
    castingTime: '1 Acción',
    range: '45 metros (150 pies)',
    components: { v: true, s: true, m: true, materialText: 'Una bolita de azufre y guano de murciélago' },
    duration: 'Instantáneo',
    concentration: false,
    ritual: false,
    description: 'Un brillante haz de luz surge de tu dedo hasta un punto a tu elección y estalla en una ensordecedora explosión ígnea en una esfera de 6 metros (20 pies) de radio. Cada criatura debe hacer una salvación de Destreza. Recibe 8d6 de daño por fuego con fallo, o la mitad con éxito.',
    higherLevels: 'El daño aumenta en 1d6 por cada nivel de espacio por encima de 3.',
    classes: ['Mago', 'Hechicero']
  },
  {
    id: 'paso-brumoso',
    name: 'Paso Brumoso (Misty Step)',
    level: 2,
    school: 'Conjuración',
    castingTime: '1 Acción Adicional',
    range: 'Personal',
    components: { v: true, s: false, m: false },
    duration: 'Instantáneo',
    concentration: false,
    ritual: false,
    description: 'Rodeado brevemente de una niebla plateada, te teletransportas hasta 9 metros (30 pies) a un espacio desocupado que puedas ver.',
    classes: ['Mago', 'Hechicero', 'Brujo']
  }
];

export const INITIAL_MONSTERS: Monster[] = [
  {
    id: 'goblin',
    name: 'Goblin (Trasgo)',
    size: 'Pequeño',
    type: 'Humanoide (Goblin)',
    alignment: 'Neutral Maligno',
    cr: '1/4',
    xp: 50,
    ac: 15,
    acType: 'Armadura de cuero, escudo',
    hp: 7,
    hitDice: '2d6',
    speed: '9 metros (30 pies)',
    abilities: { str: 8, dex: 14, con: 10, int: 10, wis: 8, cha: 8 },
    skills: 'Sigilo +6',
    senses: 'Visión en la oscuridad 18 m, Percepción pasiva 9',
    languages: 'Común, Trasgo',
    traits: [
      { name: 'Escapada Ágil', desc: 'El goblin puede realizar la acción Destrabarse o Esconderse como una acción adicional en cada uno de sus turnos.' }
    ],
    actions: [
      { name: 'Cimitarra', desc: 'Ataque de arma cuerpo a cuerpo: +4 al impacto, alcance 1.5 m. Impacto: 5 (1d6 + 2) de daño cortante.', attackBonus: 4, damageDice: '1d6+2', damageType: 'Cortante' },
      { name: 'Arco Corto', desc: 'Ataque de arma a distancia: +4 al impacto, alcance 24/96 m. Impacto: 5 (1d6 + 2) de daño perforante.', attackBonus: 4, damageDice: '1d6+2', damageType: 'Perforante' }
    ],
    sourceBook: 'Manual de Monstruos 2024'
  },
  {
    id: 'lobo',
    name: 'Lobo (Wolf)',
    size: 'Mediano',
    type: 'Bestia',
    alignment: 'Sin alineamiento',
    cr: '1/4',
    xp: 50,
    ac: 13,
    acType: 'Armadura natural',
    hp: 11,
    hitDice: '2d8 + 2',
    speed: '12 metros (40 pies)',
    abilities: { str: 12, dex: 15, con: 12, int: 3, wis: 12, cha: 6 },
    skills: 'Percepción +3, Sigilo +4',
    senses: 'Percepción pasiva 13',
    languages: 'Ninguno',
    traits: [
      { name: 'Oído y Olfato Agudizados', desc: 'El lobo tiene ventaja en las pruebas de Sabiduría (Percepción) basadas en el oído o el olfato.' },
      { name: 'Táctica de Manada', desc: 'El lobo tiene ventaja en las tiradas de ataque contra una criatura si al menos uno de los aliados del lobo está a 1.5 m de la criatura y no está incapacitado.' }
    ],
    actions: [
      { name: 'Mordisco', desc: 'Ataque de arma cuerpo a cuerpo: +4 al impacto, alcance 1.5 m. Impacto: 7 (2d4 + 2) de daño perforante. Si el objetivo es una criatura, debe superar una salvación de Fuerza CD 11 o quedar Tumbada.', attackBonus: 4, damageDice: '2d4+2', damageType: 'Perforante' }
    ],
    sourceBook: 'Manual de Monstruos 2024'
  },
  {
    id: 'esqueleto',
    name: 'Esqueleto (Skeleton)',
    size: 'Mediano',
    type: 'No-muerto',
    alignment: 'Legal Maligno',
    cr: '1/4',
    xp: 50,
    ac: 13,
    acType: 'Restos de armadura',
    hp: 13,
    hitDice: '2d8 + 4',
    speed: '9 metros (30 pies)',
    abilities: { str: 10, dex: 14, con: 15, int: 6, wis: 8, cha: 5 },
    damageResistances: '',
    damageImmunities: 'Veneno',
    conditionImmunities: 'Envenenado, Fatiga',
    senses: 'Visión en la oscuridad 18 m, Percepción pasiva 9',
    languages: 'Entiende todos los idiomas que conocía en vida pero no puede hablar',
    traits: [
      { name: 'Vulnerabilidad al Daño', desc: 'El esqueleto es vulnerable al daño Contundente.' }
    ],
    actions: [
      { name: 'Espada Corta', desc: 'Ataque de arma cuerpo a cuerpo: +4 al impacto, alcance 1.5 m. Impacto: 5 (1d6 + 2) de daño perforante.', attackBonus: 4, damageDice: '1d6+2', damageType: 'Perforante' },
      { name: 'Arco Corto', desc: 'Ataque de arma a distancia: +4 al impacto, alcance 24/96 m. Impacto: 5 (1d6 + 2) de daño perforante.', attackBonus: 4, damageDice: '1d6+2', damageType: 'Perforante' }
    ],
    sourceBook: 'Manual de Monstruos 2024'
  },
  {
    id: 'ogro',
    name: 'Ogro (Ogre)',
    size: 'Grande',
    type: 'Gigante',
    alignment: 'Caótico Maligno',
    cr: '2',
    xp: 450,
    ac: 11,
    acType: 'Pieles',
    hp: 59,
    hitDice: '7d10 + 21',
    speed: '12 metros (40 pies)',
    abilities: { str: 19, dex: 8, con: 16, int: 5, wis: 7, cha: 7 },
    senses: 'Visión en la oscuridad 18 m, Percepción pasiva 8',
    languages: 'Común, Gigante',
    traits: [],
    actions: [
      { name: 'Gran Garrote', desc: 'Ataque de arma cuerpo a cuerpo: +6 al impacto, alcance 1.5 m. Impacto: 13 (2d8 + 4) de daño contundente.', attackBonus: 6, damageDice: '2d8+4', damageType: 'Contundente' },
      { name: 'Jabalina', desc: 'Ataque de arma cuerpo a cuerpo o a distancia: +6 al impacto, alcance 9/36 m. Impacto: 11 (2d6 + 4) de daño perforante.', attackBonus: 6, damageDice: '2d6+4', damageType: 'Perforante' }
    ],
    sourceBook: 'Manual de Monstruos 2024'
  },
  {
    id: 'oso-lechuza',
    name: 'Oso Lechuza (Owlbear)',
    size: 'Grande',
    type: 'Monstruosidad',
    alignment: 'Sin alineamiento',
    cr: '3',
    xp: 700,
    ac: 13,
    acType: 'Armadura natural',
    hp: 59,
    hitDice: '7d10 + 21',
    speed: '12 metros (40 pies)',
    abilities: { str: 20, dex: 12, con: 17, int: 3, wis: 12, cha: 7 },
    skills: 'Percepción +5',
    senses: 'Visión en la oscuridad 18 m, Percepción pasiva 15',
    languages: 'Ninguno',
    traits: [
      { name: 'Vista y Olfato Aguzados', desc: 'Tiene ventaja en pruebas de Percepción que dependan de la vista o el olfato.' }
    ],
    actions: [
      { name: 'Ataque Múltiple', desc: 'El oso lechuza realiza dos ataques: uno con su pico y otro con sus garras.' },
      { name: 'Pico', desc: 'Ataque de arma cuerpo a cuerpo: +7 al impacto, alcance 1.5 m. Impacto: 10 (1d10 + 5) de daño perforante.', attackBonus: 7, damageDice: '1d10+5', damageType: 'Perforante' },
      { name: 'Garras', desc: 'Ataque de arma cuerpo a cuerpo: +7 al impacto, alcance 1.5 m. Impacto: 14 (2d8 + 5) de daño cortante.', attackBonus: 7, damageDice: '2d8+5', damageType: 'Cortante' }
    ],
    sourceBook: 'Manual de Monstruos 2024'
  },
  {
    id: 'beholder',
    name: 'Contemplador (Beholder)',
    size: 'Grande',
    type: 'Aberración',
    alignment: 'Legal Maligno',
    cr: '13',
    xp: 10000,
    ac: 18,
    acType: 'Armadura natural',
    hp: 180,
    hitDice: '19d10 + 76',
    speed: '0 m, volar 6 m (levitación)',
    abilities: { str: 10, dex: 14, con: 18, int: 17, wis: 15, cha: 17 },
    savingThrows: 'Int +8, Sab +7, Car +8',
    skills: 'Percepción +12',
    conditionImmunities: 'Tumbado',
    senses: 'Visión en la oscuridad 36 m, Percepción pasiva 22',
    languages: 'Infracomún, Habla profunda',
    traits: [
      { name: 'Cono Antimagia', desc: 'El ojo central del contemplador crea una zona de antimagia en un cono de 45 metros (150 pies). Al inicio de cada uno de sus turnos decide hacia dónde apunta el cono.' }
    ],
    actions: [
      { name: 'Mordisco', desc: 'Ataque de arma cuerpo a cuerpo: +5 al impacto, alcance 1.5 m. Impacto: 14 (4d6) de daño perforante.', attackBonus: 5, damageDice: '4d6', damageType: 'Perforante' },
      { name: 'Rayos Oculares', desc: 'Dispara al azar 3 de los 10 rayos oculares a objetivos visibles dentro de 36 m (Encanto, Parálisis, Miedo, Ralentización, Enervación, Telequinesis, Sueño, Petrificación, Desintegración o Muerte).' }
    ],
    legendaryActions: [
      { name: 'Rayo Ocular', desc: 'El contemplador dispara un rayo ocular al azar.', cost: 1 }
    ],
    sourceBook: 'Manual de Monstruos 2024'
  },
  {
    id: 'dragon-rojo-adulto',
    name: 'Dragón Rojo Adulto',
    size: 'Enorme',
    type: 'Dragón',
    alignment: 'Caótico Maligno',
    cr: '17',
    xp: 18000,
    ac: 19,
    acType: 'Armadura natural',
    hp: 256,
    hitDice: '19d12 + 133',
    speed: '12 m, escalar 12 m, volar 24 m',
    abilities: { str: 27, dex: 10, con: 25, int: 16, wis: 13, cha: 21 },
    savingThrows: 'Des +6, Con +13, Sab +7, Car +11',
    skills: 'Percepción +13, Sigilo +6',
    damageImmunities: 'Fuego',
    senses: 'Vista ciega 18 m, Visión en la oscuridad 36 m, Percepción pasiva 23',
    languages: 'Común, Dracónico',
    traits: [
      { name: 'Resistencia Legendaria (3/Día)', desc: 'Si el dragón falla una tirada de salvación, puede elegir tener éxito en su lugar.' }
    ],
    actions: [
      { name: 'Ataque Múltiple', desc: 'El dragón puede usar su Presencia Pavorosa y realizar tres ataques: un mordisco y dos con garras.' },
      { name: 'Mordisco', desc: 'Ataque de arma cuerpo a cuerpo: +14 al impacto, alcance 3 m. Impacto: 19 (2d10 + 8) de daño perforante más 7 (2d6) de daño por fuego.', attackBonus: 14, damageDice: '2d10+8', damageType: 'Perforante' },
      { name: 'Aliento de Fuego (Recarga 5-6)', desc: 'El dragón exhala fuego en un cono de 18 m. Cada criatura debe hacer una salvación de Destreza CD 21, recibiendo 63 (18d6) de daño por fuego si falla, o la mitad si tiene éxito.', attackBonus: 0, damageDice: '18d6', damageType: 'Fuego' }
    ],
    legendaryActions: [
      { name: 'Detectar', desc: 'Realiza una prueba de Sabiduría (Percepción).', cost: 1 },
      { name: 'Coletazo', desc: 'Ataque cuerpo a cuerpo con la cola: +14 al impacto, 17 (2d8 + 8) de daño contundente.', cost: 1 },
      { name: 'Ataque de Alas (Cuesta 2 Acciones)', desc: 'Bate sus alas. Cada criatura a 3 m debe superar una salvación de Des CD 22 o quedar Tumbada y recibir 15 (2d6 + 8) de daño contundente. El dragón luego vuela hasta la mitad de su velocidad.', cost: 2 }
    ],
    sourceBook: 'Manual de Monstruos 2024'
  }
];

export const INITIAL_CONDITIONS = [
  { name: 'Cegado (Blinded)', desc: 'Falla automáticamente cualquier prueba que dependa de la vista. Las tiradas de ataque contra la criatura tienen ventaja, y los ataques de la criatura tienen desventaja.' },
  { name: 'Hechizado (Charmed)', desc: 'No puede atacar al encantador ni elegirlo como objetivo de habilidades o efectos dañinos. El encantador tiene ventaja en cualquier prueba social.' },
  { name: 'Ensordecido (Deafened)', desc: 'Falla automáticamente cualquier prueba que dependa del oído.' },
  { name: 'Asustado (Frightened)', desc: 'Tiene desventaja en pruebas de característica y tiradas de ataque mientras la fuente de su miedo esté en su línea de visión. No puede acercarse voluntariamente a la fuente.' },
  { name: 'Agarrado (Grappled)', desc: 'La velocidad de la criatura pasa a ser 0 y no puede beneficiarse de ningún bonificador a su velocidad.' },
  { name: 'Incapacitado (Incapacitated)', desc: 'No puede realizar acciones ni reacciones. Rompe la concentración en conjuros.' },
  { name: 'Invisible', desc: 'Es imposible de ver sin magia o sentidos especiales. Tiene ventaja en tiradas de ataque, y los ataques contra ella tienen desventaja.' },
  { name: 'Paralizado (Paralyzed)', desc: 'Está incapacitada y no puede moverse ni hablar. Falla automáticamente salvaciones de Fuerza y Destreza. Ataques contra ella tienen ventaja y cualquier impacto a 1.5 m es un golpe crítico automático.' },
  { name: 'Petrificado (Petrified)', desc: 'Transformada en sustancia inanimada sólida (usualmente piedra). Su peso se multiplica por diez y deja de envejecer. Resistencia a todo el daño.' },
  { name: 'Envenenado (Poisoned)', desc: 'Tiene desventaja en tiradas de ataque y pruebas de característica.' },
  { name: 'Tumbado (Prone)', desc: 'Solo puede arrastrarse (cuesta doble movimiento). Tiene desventaja en ataques. Ataques cuerpo a cuerpo a 1.5 m contra ella tienen ventaja; ataques a distancia tienen desventaja.' },
  { name: 'Restringido (Restrained)', desc: 'Velocidad 0. Ataques contra ella tienen ventaja y sus ataques tienen desventaja. Desventaja en salvaciones de Destreza.' },
  { name: 'Aturdido (Stunned)', desc: 'Incapacitada, no puede moverse, balbucea de forma vacilante. Falla automáticamente salvaciones de Fuerza y Destreza. Ataques contra ella tienen ventaja.' },
  { name: 'Inconsciente (Unconscious)', desc: 'Incapacitada, suelta lo que sostiene y cae tumbada. Falla salvaciones de Fuerza y Destreza. Ataques contra ella tienen ventaja y a 1.5 m son críticos automáticos.' },
  { name: 'Agotamiento (Exhaustion)', desc: 'En las reglas D&D 2024, cada nivel de agotamiento (del 1 al 6) resta 2 a todas las tiradas de d20 y reduce la velocidad en 1.5 m (5 pies). A nivel 6 sobreviene la muerte.' }
];
