import { DragonmarkDef, ArcaneProstheticDef } from '../types/dnd';

export const DRAGONMARKS_DATA: DragonmarkDef[] = [
  // 1. MARCA DE LA CREACIÓN (CANNITH)
  {
    id: 'mark_of_making',
    name: 'Marca de la Creación (Mark of Making)',
    houseName: 'Casa Cannith (Humanos)',
    speciesBase: 'Humano',
    type: 'making',
    tagline: 'Artífices supremos, forjadores de los Forjados y maestros de la materia.',
    description:
      'La Marca de la Creación guía las manos con una intuición sobrenatural sobre la forja, los engranajes y la transmutación. Quienes la portan pueden reparar ingenios rotos con un toque e imbuir magia temporal en cualquier arma o armadura ordinaria.',
    badgeColor: '#d97706', // Ámbar bronce
    intuitionSkills: ['arcanos', 'investigacion'],
    intuitionSkillLabels: ['Conocimiento Arcano', 'Investigación', 'Herramientas de Artesano'],
    innateSpells: [
      {
        name: 'Remendar (Mending)',
        level: 0,
        castingTime: '1 minuto',
        range: 'Toque',
        description: 'Repara una rotura o desgarro en un objeto que toques, restaurando su integridad estructural.'
      },
      {
        name: 'Elemento Mágico de Arma',
        level: 1,
        castingTime: '1 acción adicional',
        range: 'Toque',
        description: 'Toca un arma no mágica. Durante 1 hora, el arma gana un bonificador de +1 a las tiradas de ataque y daño.'
      }
    ],
    spellsOfTheMark: [
      'Identificar', 'Armadura de Mago', 'Arma Mágica', 'Calentar Metal',
      'Flecha Llameante', 'Crear Elemento', 'Fabricar', 'Creación'
    ],
    specialTrait: {
      title: 'Don de Artífice (+1d4 Intuición)',
      description: 'Cada vez que realizas una prueba de Inteligencia (Arcanos) o con cualquier Herramienta de Artesano, sumas un dado de intuición (1d4) al resultado del d20.'
    }
  },

  // 2. MARCA DE LA DETECCIÓN (MEDANI)
  {
    id: 'mark_of_detection',
    name: 'Marca de la Detección (Mark of Detection)',
    houseName: 'Casa Medani (Semielfos)',
    speciesBase: 'Semielfo',
    type: 'detection',
    tagline: 'Ojos que penetran cualquier mentira, veneno oculto o conjuro disimulado.',
    description:
      'Portada por los guardianes y detectives de la Casa Medani. Esta marca permite vislumbrar anomalías imperceptibles para el ojo mortal, anticipando emboscadas, detectando auras mágicas y desenmascarando infiltradores.',
    badgeColor: '#0284c7', // Azul zafiro de investigación
    intuitionSkills: ['investigacion', 'perspicacia'],
    intuitionSkillLabels: ['Investigación', 'Perspicacia (Intuición)'],
    innateSpells: [
      {
        name: 'Detectar Magia',
        level: 1,
        castingTime: '1 acción (Ritual)',
        range: '30 pies (9 m)',
        description: 'Sientes la presencia de magia a 30 pies y detectas su escuela de magia durante 10 minutos.'
      },
      {
        name: 'Detectar Venenos y Enfermedades',
        level: 1,
        castingTime: '1 acción (Ritual)',
        range: 'Personal',
        description: 'Percibes la presencia y ubicación de venenos, sustancias tóxicas y enfermedades a 30 pies de ti.'
      }
    ],
    spellsOfTheMark: [
      'Detectar el Mal y el Bien', 'Ver lo Invisible', 'Zona de la Verdad',
      'Clarividencia', 'Localizar Criatura', 'Visión Verdadera'
    ],
    specialTrait: {
      title: 'Intuición Deductiva (+1d4 Intuición)',
      description: 'Cada vez que realizas una prueba de Inteligencia (Investigación) o Sabiduría (Perspicacia), sumas 1d4 al resultado del d20.'
    }
  },

  // 3. MARCA DEL HALLAZGO / RASTREO (THARASHK)
  {
    id: 'mark_of_finding',
    name: 'Marca del Hallazgo (Mark of Finding)',
    houseName: 'Casa Tharashk (Humanos & Semiorcos)',
    speciesBase: 'Humano o Semiorco',
    type: 'finding',
    tagline: 'Los mejores rastreadores, cazadores de fugitivos y prospectores de Khorvaire.',
    description:
      'La marca agudiza el olfato, la vista y el sentido de la orientación hasta límites legendarios. Los agentes Tharashk rastrean presas a través de selvas, páramos o callejones atestados, y localizan vetas de dragonshards ocultas bajo la roca.',
    badgeColor: '#65a30d', // Verde musgo rastreador
    intuitionSkills: ['supervivencia', 'percepcion'],
    intuitionSkillLabels: ['Supervivencia', 'Percepción'],
    innateSpells: [
      {
        name: 'Marca del Cazador (Hunter\'s Mark)',
        level: 1,
        castingTime: '1 acción adicional',
        range: '90 pies (27 m)',
        description: 'Eliges a una criatura visible; ganas +1d6 de daño adicional cada vez que la impactes con un ataque de arma.'
      },
      {
        name: 'Localizar Animales o Plantas',
        level: 2,
        castingTime: '1 acción (Ritual)',
        range: 'Personal',
        description: 'Describe un tipo específico de bestia o planta; descubres la dirección y distancia al espécimen más cercano en 5 millas.'
      }
    ],
    spellsOfTheMark: [
      'Zancada Prodigiosa', 'Pasar sin Dejar Rastro', 'Localizar Objeto',
      'Hablar con las Plantas', 'Localizar Criatura', 'Comunión con la Naturaleza'
    ],
    specialTrait: {
      title: 'Ojo de Cazador (+1d4 Intuición)',
      description: 'Suma 1d4 a cualquier prueba de Sabiduría (Percepción) o Sabiduría (Supervivencia) para rastrear o detectar objetivos.'
    }
  },

  // 4. MARCA DE LA CURACIÓN (JORASCO)
  {
    id: 'mark_of_healing',
    name: 'Marca de la Curación (Mark of Healing)',
    houseName: 'Casa Jorasco (Medianos)',
    speciesBase: 'Mediano',
    type: 'healing',
    tagline: 'El monopolio de la medicina, la regeneración celular y la salvación de la vida.',
    description:
      'La marca de Jorasco emite un calor reconfortante que sella heridas abiertas, neutraliza toxinas virulentas y purifica infecciones en cuestión de segundos. Sus portadores operan los hospitales y clínicas de campaña de Khorvaire.',
    badgeColor: '#10b981', // Verde esmeralda sanador
    intuitionSkills: ['medicina'],
    intuitionSkillLabels: ['Medicina'],
    innateSpells: [
      {
        name: 'Curar Heridas (Cure Wounds)',
        level: 1,
        castingTime: '1 acción',
        range: 'Toque',
        description: 'Una criatura que toques recupera 1d8 + tu modificador de característica en Puntos de Golpe.'
      },
      {
        name: 'Restablecimiento Menor',
        level: 2,
        castingTime: '1 acción',
        range: 'Toque',
        description: 'Curas una enfermedad o eliminas una condición de Cegado, Ensordecido, Paralizado o Envenenado.'
      }
    ],
    spellsOfTheMark: [
      'Palabra de Curación', 'Auxilio Divino', 'Rezo de Curación',
      'Faro de Esperanza', 'Revivir', 'Aura de Pureza', 'Restablecimiento Mayor'
    ],
    specialTrait: {
      title: 'Toque Médico Prodigioso (+1d4 Intuición)',
      description: 'Suma 1d4 a cualquier prueba de Sabiduría (Medicina) para estabilizar moribundos o diagnosticar dolencias.'
    }
  },

  // 5. MARCA DE LA HOSPITALIDAD (GHALLANDA)
  {
    id: 'mark_of_hospitality',
    name: 'Marca de la Hospitalidad (Mark of Hospitality)',
    houseName: 'Casa Ghallanda (Medianos)',
    speciesBase: 'Mediano',
    type: 'hospitality',
    tagline: 'Garantía de confort, comida exquisita, refugio seguro y diplomacia en cualquier rincón.',
    description:
      'Nadie ofrece mejor descanso que los medianos de Ghallanda. La marca les permite purificar alimentos corruptos, apaciguar discusiones acaloradas y levantar refugios mágicos inviolables donde recuperar el vigor tras la batalla.',
    badgeColor: '#f59e0b', // Ámbar cálido
    intuitionSkills: ['persuasion'],
    intuitionSkillLabels: ['Persuasión', 'Utensilios de Cocinero'],
    innateSpells: [
      {
        name: 'Purificar Comida y Bebida',
        level: 1,
        castingTime: '1 acción (Ritual)',
        range: '10 pies',
        description: 'Todos los alimentos y bebidas no mágicas quedan libres de venenos y enfermedades en una esfera de 5 pies.'
      },
      {
        name: 'Truco Inadvertido / Prestidigitación',
        level: 0,
        castingTime: '1 acción',
        range: '10 pies',
        description: 'Calienta o enfría comidas, condimenta raciones y limpia prendas o armaduras al instante.'
      }
    ],
    spellsOfTheMark: [
      'Alarma', 'Buenas Bayas', 'Mansión Magnífica de Mordenkainen',
      'Calmar Emociones', 'Santuario', 'Cabaña Diminuta de Leomund'
    ],
    specialTrait: {
      title: 'El Anfitrión Perfecto (+1d4 Intuición)',
      description: 'Suma 1d4 a cualquier prueba de Carisma (Persuasión) o al cocinar con Utensilios de Cocinero.'
    }
  },

  // 6. MARCA DEL PASO (ORIEN)
  {
    id: 'mark_of_passage',
    name: 'Marca del Paso (Mark of Passage)',
    houseName: 'Casa Orien (Humanos)',
    speciesBase: 'Humano',
    type: 'passage',
    tagline: 'Rutas seguras, saltos dimensionales y la velocidad del viento en los caminos.',
    description:
      'La marca concede ligereza insólita y la facultad de teletransportarse distancias cortas. Los mensajeros y pilotos Orien comandan el Expreso del Rayo y entregan cartas a través de continentes enteros desafiando el espacio físico.',
    badgeColor: '#3b82f6', // Azul eléctrico
    intuitionSkills: ['acrobacias'],
    intuitionSkillLabels: ['Acrobacias'],
    innateSpells: [
      {
        name: 'Paso Brumoso (Misty Step)',
        level: 2,
        castingTime: '1 acción adicional',
        range: 'Personal',
        description: 'Rodeado de niebla plateada, te teletransportas hasta 30 pies (9 m) a un espacio desocupado que puedas ver.'
      },
      {
        name: 'Retirada Expeditiva',
        level: 1,
        castingTime: '1 acción adicional',
        range: 'Personal',
        description: 'Puedes realizar la acción de Carrera como acción adicional en este turno y subsiguientes turnos.'
      }
    ],
    spellsOfTheMark: [
      'Salto', 'Zancada Prodigiosa', 'Parpadear', 'Puerta Dimensional',
      'Teletransporte', 'Círculo de Teletransporte', 'Paso Veloz'
    ],
    specialTrait: {
      title: 'Velocidad de Relámpago (+5 pies / +1d4 Acrobacias)',
      description: 'Tu velocidad básica al caminar aumenta a 35 pies (10.5 m) y sumas 1d4 a todas tus pruebas de Destreza (Acrobacias).'
    }
  },

  // 7. MARCA DE LA ESCRITURA (SIVIS)
  {
    id: 'mark_of_scribing',
    name: 'Marca de la Escritura (Mark of Scribing)',
    houseName: 'Casa Sivis (Gnomos)',
    speciesBase: 'Gnomo',
    type: 'scribing',
    tagline: 'Comunicaciones a larga distancia, cifrado diplomático y traducción de todas las lenguas.',
    description:
      'Los gnomos Sivis operan las estaciones de telégrafo de cristal de Khorvaire. Su marca otorga la habilidad instintiva de comprender textos prohibidos, susurrar a través de continentes enteros y sellar contratos mágicamente vinculantes.',
    badgeColor: '#8b5cf6', // Violeta erudito
    intuitionSkills: ['historia'],
    intuitionSkillLabels: ['Historia', 'Herramientas de Calígrafo'],
    innateSpells: [
      {
        name: 'Mensaje (Message)',
        level: 0,
        castingTime: '1 acción',
        range: '120 pies (36 m)',
        description: 'Apunta a una criatura y susurra un mensaje. Sólo el objetivo oye el susurro y puede responder en privado.'
      },
      {
        name: 'Comprensión de Lenguajes',
        level: 1,
        castingTime: '1 acción (Ritual)',
        range: 'Personal',
        description: 'Comprendes el significado literal de cualquier lengua hablada o texto escrito que toques durante 1 hora.'
      }
    ],
    spellsOfTheMark: [
      'Texto Ilusorio', 'Boca Mágica', 'Enviar Mensaje (Sending)',
      'Idiomas', 'Escritura Celeste', 'Vínculo Telepático de Rary'
    ],
    specialTrait: {
      title: 'Escriba Universal (+1d4 Intuición)',
      description: 'Suma 1d4 a cualquier prueba de Inteligencia (Historia) y a las pruebas realizadas con Herramientas de Calígrafo.'
    }
  },

  // 8. MARCA DEL CENTINELA (DENEITH)
  {
    id: 'mark_of_sentinel',
    name: 'Marca del Centinela (Mark of Sentinel)',
    houseName: 'Casa Deneith (Humanos)',
    speciesBase: 'Humano',
    type: 'sentinel',
    tagline: 'Los guardaespaldas supremos, defensores inquebrantables y mariscales de batalla.',
    description:
      'La marca de Deneith palpita cuando un aliado corre peligro mortal. Permite crear barreras cinéticas de protección y trocar de posición en el último instante para recibir el golpe destinado a un cliente o camarada.',
    badgeColor: '#ef4444', // Rojo escudo
    intuitionSkills: ['percepcion', 'perspicacia'],
    intuitionSkillLabels: ['Percepción', 'Perspicacia (Intuición)'],
    innateSpells: [
      {
        name: 'Escudo (Shield)',
        level: 1,
        castingTime: '1 reacción',
        range: 'Personal',
        description: 'Una barrera invisible de fuerza te otorga +5 a la CA hasta el inicio de tu siguiente turno e inmunidad a Proyectil Mágico.'
      },
      {
        name: 'Protección contra Ataques',
        level: 1,
        castingTime: '1 acción',
        range: 'Toque',
        description: 'Otorga resistencia contra daño cortante, perforante y contundente en situaciones extremas.'
      }
    ],
    spellsOfTheMark: [
      'Santuario', 'Vínculo Protector', 'Custodia contra la Muerte',
      'Ojo Centinela', 'Muro de Fuerza', 'Globo de Invulnerabilidad'
    ],
    specialTrait: {
      title: 'Escudo del Guardián (Reacción)',
      description: 'Cuando una criatura a 5 pies de ti recibe un ataque, puedes usar tu reacción para intercambiar lugares con ella y recibir el ataque en su lugar.'
    }
  },

  // 9. MARCA DE LA SOMBRA (PHIARLAN & THURANNI)
  {
    id: 'mark_of_shadow',
    name: 'Marca de la Sombra (Mark of Shadow)',
    houseName: 'Casas Phiarlan & Thuranni (Elfos)',
    speciesBase: 'Elfo',
    type: 'shadow',
    tagline: 'Artistas en el escenario, maestros del disfraz y asesinos silenciosos entre telones.',
    description:
      'La marca dobla la luz y el sonido alrededor de su portador. Los elfos de Phiarlan y Thuranni la usan tanto para deslumbrar en representaciones teatrales majestuosas como para deslizarse invisibles en las mansiones de sus objetivos.',
    badgeColor: '#475569', // Gris oscuro / sombra
    intuitionSkills: ['sigilo', 'interpretacion'],
    intuitionSkillLabels: ['Sigilo', 'Interpretación'],
    innateSpells: [
      {
        name: 'Disfrazarse (Disguise Self)',
        level: 1,
        castingTime: '1 acción',
        range: 'Personal',
        description: 'Modificas mágicamente tu aspecto físico, ropa, armadura y altura aparente durante 1 hora.'
      },
      {
        name: 'Ilusión Menor (Minor Illusion)',
        level: 0,
        castingTime: '1 acción',
        range: '30 pies',
        description: 'Creas un sonido o la imagen espectral de un objeto que dura hasta 1 minuto.'
      }
    ],
    spellsOfTheMark: [
      'Silencio', 'Invisibilidad', 'Tinieblas', 'Paso Inadvertido',
      'Imagen Mayor', 'Desplazamiento', 'Invisibilidad Mayor'
    ],
    specialTrait: {
      title: 'Tejedor de Penumbras (+1d4 Intuición)',
      description: 'Suma 1d4 a todas tus pruebas de Destreza (Sigilo) y Carisma (Interpretación).'
    }
  },

  // 10. MARCA DE LA TORMENTA (LYRANDAR)
  {
    id: 'mark_of_storm',
    name: 'Marca de la Tormenta (Mark of Storm)',
    houseName: 'Casa Lyrandar (Semielfos)',
    speciesBase: 'Semielfo',
    type: 'storm',
    tagline: 'Pilotos de galeones aéreos, señores de los vientos y del trueno en las nubes.',
    description:
      'La Casa Lyrandar gobierna los cielos de Khorvaire con sus barcos aéreos impulsados por elementales de fuego y aire. Su marca les otorga inmunidad natural contra tormentas eléctricas y el poder de dominar ráfagas huracanadas.',
    badgeColor: '#06b6d4', // Cian tormenta
    intuitionSkills: ['acrobacias', 'naturaleza'],
    intuitionSkillLabels: ['Acrobacias', 'Naturaleza', 'Vehículos Aéreos / Marítimos'],
    innateSpells: [
      {
        name: 'Ráfaga de Viento (Gust of Wind)',
        level: 2,
        castingTime: '1 acción',
        range: 'Línea de 60 pies',
        description: 'Una línea de viento huracanado empuja a las criaturas 15 pies hacia atrás y extingue llamas abiertas.'
      },
      {
        name: 'Ráfaga (Gust)',
        level: 0,
        castingTime: '1 acción',
        range: '30 pies',
        description: 'Creas un estallido de viento que empuja a un enemigo mediano hasta 5 pies o mueve objetos ligeros.'
      }
    ],
    spellsOfTheMark: [
      'Nube de Oscurecimiento', 'Muro de Viento', 'Llamar al Relámpago',
      'Tormenta de Aguanieve', 'Controlar el Clima', 'Vendaval'
    ],
    specialTrait: {
      title: 'Resistencia al Rayo y Viento (+1d4 Navegación)',
      description: 'Ganas resistencia permanente al daño por Rayo. Además, sumas 1d4 a pruebas de Naturaleza y navegación de vehículos aéreos o navíos.'
    }
  },

  // 11. MARCA DEL MANEJO / DOMA (VADALIS)
  {
    id: 'mark_of_handling',
    name: 'Marca del Manejo (Mark of Handling)',
    houseName: 'Casa Vadalis (Humanos)',
    speciesBase: 'Humano',
    type: 'handling',
    tagline: 'Criadores de bestias mágicas, terapeutas de monstruos y jinetes de élite.',
    description:
      'La Casa Vadalis cría monturas modificadas genéticamente con poderes mágicos (*Magebred*). Esta marca crea una comunión empática instantánea con cualquier animal salvaje, apaciguando incluso a grifos y quimeras agresivas.',
    badgeColor: '#84cc16', // Verde lima salvaje
    intuitionSkills: ['animales'],
    intuitionSkillLabels: ['Trato con Animales'],
    innateSpells: [
      {
        name: 'Amistad con los Animales',
        level: 1,
        castingTime: '1 acción',
        range: '30 pies',
        description: 'Convenzas a una bestia con Inteligencia 3 o menor de que no tienes intenciones hostiles.'
      },
      {
        name: 'Hablar con los Animales',
        level: 1,
        castingTime: '1 acción (Ritual)',
        range: 'Personal',
        description: 'Obtienes la capacidad de comunicarte verbalmente y comprender a las bestias durante 10 minutos.'
      }
    ],
    spellsOfTheMark: [
      'Vínculo con Bestias', 'Sentidos de la Bestia', 'Conjurar Animales',
      'Dominar Bestia', 'Despertar', 'Localizar Criatura'
    ],
    specialTrait: {
      title: 'Pastor de Quimeras (+1d4 Intuición)',
      description: 'Suma 1d4 a cualquier prueba de Sabiduría (Trato con Animales). Puedes usar conjuros que afecten a bestias también sobre monstruosidades con Inteligencia 3 o menor.'
    }
  },

  // 12. MARCA DEL DRAGÓN ABERRANTE (ABERRANT DRAGONMARK)
  {
    id: 'mark_aberrant',
    name: 'Marca del Dragón Aberrante (Aberrant Mark)',
    houseName: 'Sin Casa / Renegados de Khorvaire',
    speciesBase: 'Cualquier especie',
    type: 'aberrant',
    tagline: 'Poder salvaje, dolor físico constante, cicatrices ardientes y magia inestable.',
    description:
      'Las Marcas Aberrantes no pertenecen a las doce casas canónicas. Aparecen espontáneamente o como resultado de mestizajes prohibidos. Son temidas en toda Khorvaire por ser destructivas, incontrolables y alterar la salud de quien las manifiesta.',
    badgeColor: '#dc2626', // Carmesí aberrante
    intuitionSkills: ['intimidacion'],
    intuitionSkillLabels: ['Intimidación', 'Salvaciones de Concentración'],
    innateSpells: [
      {
        name: 'Rayo de Escarcha o Rociada de Fuego',
        level: 0,
        castingTime: '1 acción',
        range: '60 pies',
        description: 'Disparas energía caótica elemental que causa 1d8 de daño por frío o fuego según tu elección al manifestar la marca.'
      },
      {
        name: 'Manos Ardientes o Proyectil de Caos',
        level: 1,
        castingTime: '1 acción',
        range: 'Personal / 60 pies',
        description: 'Lanzas una explosión salvaje que inflige 3d6 de daño elemental usando Constitución como característica de conjuración.'
      }
    ],
    spellsOfTheMark: [
      'Proyectil Mágico', 'Onda Tronante', 'Rayo de Fuego', 'Escudo de Fuego'
    ],
    specialTrait: {
      title: 'Poder de Constitución (+1 CON & Sobrecarga)',
      description: 'Aumenta tu puntuación de Constitución en +1 (hasta un máximo de 20). Al gastar un dado de golpe para curarte, puedes forzar una sobrecarga que causa daño a los enemigos adyacentes igual al resultado del dado.'
    }
  }
];

export const ARCANE_PROSTHETICS_DATA: ArcaneProstheticDef[] = [
  {
    id: 'prosthetic_limb_common',
    name: 'Extremidad Protésica Arcana (Prosthetic Limb)',
    type: 'limb',
    rarity: 'Común',
    requiresAttunement: false,
    tagline: 'Reemplazo biomecánico perfecto de brazo, mano, pierna o pie.',
    description:
      'Creada originalmente por la Casa Cannith durante la Última Guerra para devolver a los soldados mutilados al campo de batalla. Esta prótesis de madera de roble, cuero y filigrana de latón se acopla al muñón y responde con la misma agilidad y fuerza que la extremidad original.',
    mechanicalBenefits: [
      'Reemplaza completamente un brazo, mano, pierna o pie perdido.',
      'No requiere sintonización. Se acopla o desacopla mediante una acción.',
      'No puede ser desarmada ni arrancada contra la voluntad de su portador mientras esté consciente.',
      'Funciona de manera indistinguible de la parte del cuerpo natural a efectos mecánicos.'
    ]
  },
  {
    id: 'arcane_propulsion_arm',
    name: 'Brazo de Propulsión Arcana (Arcane Propulsion Arm)',
    type: 'propulsion_arm',
    rarity: 'Muy raro',
    requiresAttunement: true,
    tagline: 'Extremidad reforzada con resorte electromágico y puño-cohete retráctil a distancia.',
    description:
      'Una obra maestra de la tecnomagia militar de Cannith. Fabricado en acero pulido y cobre grabado con runas de impulso. El puño puede ser disparado a 60 pies como proyectil devastador, volviendo de inmediato a la muñeca mediante un vórtice magnético.',
    mechanicalBenefits: [
      'Ganas +1 a las tiradas de ataque y daño con ataques desarmados realizados con este brazo.',
      'Ataques desarmados con este puño infligen 1d8 de daño por Fuerza en lugar del daño habitual.',
      'Acción de Ataque a Distancia: Puedes lanzar el puño a una criatura hasta 60 pies. Se considera un arma a distancia arrojadiza que regresa de inmediato a tu muñeca tras el impacto.'
    ],
    integratedWeapon: {
      name: 'Puño de Propulsión Arcana',
      attackBonusMod: 'Fuerza',
      damage: '1d8 + FUE de daño por Fuerza',
      range: 'Cuerpo a cuerpo o 60 pies (retornable)'
    }
  },
  {
    id: 'wand_sheath_component',
    name: 'Funda de Varita Subdérmica (Wand Sheath)',
    type: 'wand_sheath',
    rarity: 'Poco común',
    requiresAttunement: true,
    tagline: 'Compartimento retráctil en el antebrazo para desenfundar varitas al instante.',
    description:
      'Popular entre artífices, magos de guerra y Forjados. Se incrusta bajo la piel o en las placas del antebrazo. Permite alojar cualquier varita mágica y extenderla a la palma de la mano con un simple impulso mental como acción adicional.',
    mechanicalBenefits: [
      'Permite insertar cualquier varita mágica en el compartimento interior del antebrazo.',
      'Extender o retraer la varita cuesta solo una Acción Adicional o parte del movimiento de ataque.',
      'Mientras la varita esté extendida, puedes usarla para lanzar conjuros manteniendo la mano parcialmente libre para sujetar escudos o trepar.',
      'La varita dentro de la funda no puede ser arrebatada ni desarmada.'
    ]
  },
  {
    id: 'erudite_ocular_eye',
    name: 'Ojo Arcano Erudito (Erudite Arcane Eye)',
    type: 'ocular',
    rarity: 'Raro',
    requiresAttunement: true,
    tagline: 'Globo ocular de cuarzo y cristal imbuido con visión en la penumbra y detección.',
    description:
      'Una joya protésica que sustituye un ojo dañado. Fabricado con lentes superpuestas de cristal de cuarzo azulado. Permite sintonizar la visión con frecuencias electromágicas para ver en la más absoluta oscuridad y descubrir trampas.',
    mechanicalBenefits: [
      'Otorga Visión en la Oscuridad (Darkvision) hasta un alcance de 60 pies (18 metros).',
      'Ventaja en tiradas de salvación contra ser Cegado.',
      'Una vez por descanso prolongado, puedes lanzar el conjuro *Detectar Trampas* o *Ver lo Invisible* sin consumir espacios de conjuro.'
    ]
  },
  {
    id: 'embedded_warforged_armor',
    name: 'Blindaje Compuesto Forjado (Integrated Armored Plating)',
    type: 'embedded_armor',
    rarity: 'Raro',
    requiresAttunement: true,
    tagline: 'Refuerzo de aleación de mithral y madera petrificada integrado en la osamenta.',
    description:
      'Placas de blindaje que se fusionan con la estructura muscular o exoesqueleto del personaje. Diseñado originalmente para los titanes de la Última Guerra, este blindaje absorbe impactos balísticos sin restar un ápice de movilidad.',
    mechanicalBenefits: [
      'Ganas un bonificador de +1 a tu Clase de Armadura (CA).',
      'No impone desventaja en las pruebas de Destreza (Sigilo), incluso si se combina con armaduras pesadas.',
      'No puede ser retirado contra tu voluntad y no añade peso a la carga de inventario.'
    ]
  },
  {
    id: 'elemental_discharge_gauntlet',
    name: 'Guantelete de Descarga Elemental (Elemental Discharge Gauntlet)',
    type: 'elemental_gauntlet',
    rarity: 'Raro',
    requiresAttunement: true,
    tagline: 'Canalizador de esquirlas elementales atadas para golpes de fuego y trueno.',
    description:
      'Una prótesis o guantelete articulado con bobinas conductoras conectadas a un receptáculo de dragonshard. Permite infundir energía flamígera o relampagueante en los ataques cuerpo a cuerpo.',
    mechanicalBenefits: [
      'Al realizar un ataque con arma o desarmado, puedes activar el guantelete para causar 1d6 puntos de daño adicional por Fuego o Rayo (a elegir).',
      'Puedes usar una acción para liberar un cono de chispas de 15 pies que inflige 3d6 de daño por Rayo (Salvación de Destreza CD 14 para la mitad), recargable tras descanso corto.'
    ]
  }
];
