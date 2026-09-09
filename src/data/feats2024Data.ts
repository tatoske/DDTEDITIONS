import { FeatDef } from '../types/dnd';

export const FEATS_2024_DATA: FeatDef[] = [
  // -------------------------------------------------------------
  // DOTES DE ORIGEN (NIVEL 1) - MANUAL DEL JUGADOR 2024
  // -------------------------------------------------------------
  {
    id: 'feat-alert',
    name: 'Alerta (Alert)',
    category: 'origin',
    levelPrerequisite: 1,
    description: 'Siempre atento al peligro, reaccionas con una velocidad sobrenatural al combate.',
    benefits: [
      'Iniciativa Bonificada: Sumas tu bonificador de competencia a tus tiradas de iniciativa.',
      'Intercambio de Iniciativa: Inmediatamente después de tirar iniciativa, puedes intercambiar tu resultado con el de un aliado voluntario que no esté incapacitado.'
    ],
    sourceBook: 'Manual del Jugador 2024 (Capítulo 5)'
  },
  {
    id: 'feat-lucky',
    name: 'Afortunado (Lucky)',
    category: 'origin',
    levelPrerequisite: 1,
    description: 'Tienes una suerte inexplicable que parece protegerte en los momentos más oscuros.',
    benefits: [
      'Puntos de Suerte: Tienes un número de puntos de suerte igual a tu bonificador de competencia. Los recuperas al terminar un Descanso Largo.',
      'Ventaja: Cuando hagas una tirada de d20, puedes gastar 1 punto de suerte para tirar con ventaja.',
      'Desventaja al Enemigo: Cuando una criatura haga una tirada de ataque contra ti, puedes gastar 1 punto de suerte como reacción para imponer desventaja al atacante.'
    ],
    sourceBook: 'Manual del Jugador 2024 (Capítulo 5)'
  },
  {
    id: 'feat-musician',
    name: 'Músico (Musician)',
    category: 'origin',
    levelPrerequisite: 1,
    description: 'Tu dominio de los instrumentos musicales inspira grandeza y heroísmo en tus compañeros de viaje.',
    benefits: [
      'Competencia: Ganas competencia con tres Instrumentos Musicales a tu elección.',
      'Inspiración de Descanso: Al terminar un Descanso Corto o Largo, tocas una melodía que otorga Inspiración Heroica a un número de aliados igual a tu bonificador de competencia.'
    ],
    sourceBook: 'Manual del Jugador 2024 (Capítulo 5)'
  },
  {
    id: 'feat-tough',
    name: 'Curtido / Dureza (Tough)',
    category: 'origin',
    levelPrerequisite: 1,
    description: 'Tu cuerpo posee una resistencia legendaria a los rigores de la guerra y las heridas.',
    benefits: [
      'Vitalidad Masiva: Tus Puntos de Golpe máximos aumentan en una cantidad igual al doble de tu nivel cuando tomas esta dote (+2 PG por nivel).',
      'Crecimiento Continuo: Cada vez que subas de nivel en el futuro, tus Puntos de Golpe máximos aumentan en 2 puntos adicionales.'
    ],
    sourceBook: 'Manual del Jugador 2024 (Capítulo 5)'
  },
  {
    id: 'feat-magic-initiate',
    name: 'Iniciado en la Magia (Magic Initiate)',
    category: 'origin',
    levelPrerequisite: 1,
    description: 'Has aprendido los rudimentos mágicos de una tradición arcana, divina o primigenia.',
    benefits: [
      'Elige una lista de conjuros: Clérigo, Druida o Mago.',
      'Trucos: Aprendes dos trucos de esa lista.',
      'Conjuro de Nivel 1: Aprendes un conjuro de nivel 1 de esa lista. Puedes lanzarlo una vez sin gastar espacio de conjuro por Descanso Largo, y también puedes usar cualquier espacio de conjuro que tengas para lanzarlo.',
      'Tu característica de conjuración para estos hechizos es INT, SAB o CAR (a tu elección al tomar la dote).'
    ],
    repeatable: true,
    sourceBook: 'Manual del Jugador 2024 (Capítulo 5)'
  },
  {
    id: 'feat-healer',
    name: 'Sanador (Healer)',
    category: 'origin',
    levelPrerequisite: 1,
    description: 'Tus conocimientos médicos y el uso de hierbas permiten estabilizar y curar heridas graves en combate.',
    benefits: [
      'Primeros Auxilios Rápidos: Puedes usar un uso de un Botiquín de Sanador para estabilizar a una criatura y hacer que recupere 1 Punto de Golpe de inmediato.',
      'Curación en Batalla: Como Acción, gasta un uso del botiquín para tocar a una criatura: recupera 1d4 + mod SAB + dados de golpe gastados PG.',
      'Remedios Eficaces: Al tirar dados para curar puntos de golpe a una criatura, puedes volver a tirar cualquier resultado de 1.'
    ],
    sourceBook: 'Manual del Jugador 2024 (Capítulo 5)'
  },
  {
    id: 'feat-tavern-brawler',
    name: 'Peleador de Taberna (Tavern Brawler)',
    category: 'origin',
    levelPrerequisite: 1,
    description: 'Acostumbrado a los altercados callejeros y peleas de taberna, conviertes cualquier objeto y tus propios puños en armas mortales.',
    benefits: [
      'Golpe Desarmado Aumentado: Tu golpe desarmado inflige 1d4 + tu modificador de Fuerza de daño contundente en lugar del daño normal.',
      'Empujón Callejero: Una vez por turno, cuando impactas a una criatura con un golpe desarmado, puedes empujarla 1.5 metros (5 pies).',
      'Impacto Contundente: Al tirar el daño de un golpe desarmado, puedes volver a tirar cualquier dado que saque un 1.'
    ],
    sourceBook: 'Manual del Jugador 2024 (Capítulo 5)'
  },
  {
    id: 'feat-skilled',
    name: 'Guía Silvestre / Versátil (Skilled)',
    category: 'origin',
    levelPrerequisite: 1,
    description: 'Tu variada experiencia te ha enseñado habilidades indispensables en múltiples disciplinas.',
    benefits: [
      'Competencias: Ganas competencia en cualquier combinación de tres Habilidades o Herramientas a tu elección.'
    ],
    repeatable: true,
    sourceBook: 'Manual del Jugador 2024 (Capítulo 5)'
  },
  {
    id: 'feat-savage-attacker',
    name: 'Salvaje (Savage Attacker)',
    category: 'origin',
    levelPrerequisite: 1,
    description: 'Tus ataques con armas van dirigidos a los puntos más vulnerables con una furia implacable.',
    benefits: [
      'Daño Máximo: Una vez por turno, cuando impactas a un objetivo con un arma cuerpo a cuerpo o a distancia, puedes tirar los dados de daño del arma dos veces y quedarte con el resultado más alto.'
    ],
    sourceBook: 'Manual del Jugador 2024 (Capítulo 5)'
  },
  {
    id: 'feat-crafter',
    name: 'Artesano Creador (Crafter)',
    category: 'origin',
    levelPrerequisite: 1,
    description: 'Eres un artesano prodigioso capaz de crear y reparar equipo en tiempo récord.',
    benefits: [
      'Herramientas de Artesano: Ganas competencia con tres Herramientas de Artesano.',
      'Descuento Comercial: Tienes un 20% de descuento en la compra de cualquier objeto o equipo no mágico.',
      'Elaboración Rápida: Puedes elaborar objetos comunes o consumibles durante un Descanso Largo en la mitad del tiempo normal.'
    ],
    sourceBook: 'Manual del Jugador 2024 (Capítulo 5)'
  },

  // -------------------------------------------------------------
  // DOTES GENERALES (NIVEL 4+) - MANUAL DEL JUGADOR 2024
  // -------------------------------------------------------------
  {
    id: 'feat-great-weapon-master',
    name: 'Gran Maestro de las Armas (Great Weapon Master)',
    category: 'general',
    levelPrerequisite: 4,
    prerequisitesText: 'Fuerza 13 o superior',
    statOptions: ['str'],
    maxStatIncrease: 20,
    description: 'Dominas las armas pesadas de dos manos con una brutalidad devastadora.',
    benefits: [
      'Aumento de Característica: Aumenta tu Fuerza en 1 (máx. 20).',
      'Golpe Devastador: Cuando consigues un golpe crítico con un arma cuerpo a cuerpo o reduces los PG de una criatura a 0, puedes hacer un ataque con arma cuerpo a cuerpo adicional como Acción Adicional.',
      'Impacto Pesado: Al impactar con un arma que tenga la propiedad Pesada (Heavy), sumas tu bonificador de competencia al daño del arma.'
    ],
    sourceBook: 'Manual del Jugador 2024 (Capítulo 5)'
  },
  {
    id: 'feat-sharpshooter',
    name: 'Tirador de Primera (Sharpshooter)',
    category: 'general',
    levelPrerequisite: 4,
    prerequisitesText: 'Destreza 13 o superior',
    statOptions: ['dex'],
    maxStatIncrease: 20,
    description: 'Tu precisión a distancia es insuperable y ningún obstáculo puede salvar a tus objetivos.',
    benefits: [
      'Aumento de Característica: Aumenta tu Destreza en 1 (máx. 20).',
      'Sin Desventaja a Quemarropa: Realizar un ataque a distancia a 1.5 metros (5 pies) de un enemigo no impone desventaja a tu tirada de ataque.',
      'Ignorar Cobertura: Tus ataques con armas a distancia ignoran la cobertura media y tres cuartos.',
      'Alcance Largo Sin Penalización: Atacar a larga distancia con armas a distancia no te impone desventaja.'
    ],
    sourceBook: 'Manual del Jugador 2024 (Capítulo 5)'
  },
  {
    id: 'feat-sentinel',
    name: 'Centinela (Sentinel)',
    category: 'general',
    levelPrerequisite: 4,
    prerequisitesText: 'Fuerza o Destreza 13 o superior',
    statOptions: ['str', 'dex'],
    maxStatIncrease: 20,
    description: 'Eres una muralla impenetrable para tus enemigos y defiendes a tus aliados a ultranza.',
    benefits: [
      'Aumento de Característica: Aumenta tu Fuerza o Destreza en 1 (máx. 20).',
      'Detener en Seco: Cuando impactas a una criatura con un ataque de oportunidad, su velocidad se reduce a 0 durante el resto del turno.',
      'Ignorar Destrabarse: Las criaturas provocan ataques de oportunidad de ti incluso si usan la acción de Destrabarse.',
      'Guardián Vengador: Cuando una criatura a 1.5 metros de ti ataca a un objetivo que no eres tú, puedes usar tu reacción para realizar un ataque con arma cuerpo a cuerpo contra esa criatura.'
    ],
    sourceBook: 'Manual del Jugador 2024 (Capítulo 5)'
  },
  {
    id: 'feat-war-caster',
    name: 'Mente de Guerra (War Caster)',
    category: 'general',
    levelPrerequisite: 4,
    prerequisitesText: 'Aptitud para lanzar al menos un conjuro',
    statOptions: ['int', 'wis', 'cha'],
    maxStatIncrease: 20,
    description: 'Entrenado para canalizar magia en medio de los combates más encarnizados.',
    benefits: [
      'Aumento de Característica: Aumenta tu Inteligencia, Sabiduría o Carisma en 1 (máx. 20).',
      'Concentración Imperturbable: Tienes ventaja en las tiradas de salvación de Constitución que hagas para mantener la concentración en un conjuro al recibir daño.',
      'Manos Marciales: Puedes realizar los componentes somáticos de los conjuros incluso cuando tienes armas o un escudo en una o ambas manos.',
      'Conjuro Reactivo: Cuando una criatura hostil provoque un ataque de oportunidad tuyo, puedes usar tu reacción para lanzarle un conjuro con tiempo de lanzamiento de 1 acción en lugar del ataque.'
    ],
    sourceBook: 'Manual del Jugador 2024 (Capítulo 5)'
  },
  {
    id: 'feat-dual-wielder',
    name: 'Combatiente con Dos Armas (Dual Wielder)',
    category: 'general',
    levelPrerequisite: 4,
    prerequisitesText: 'Fuerza o Destreza 13 o superior',
    statOptions: ['str', 'dex'],
    maxStatIncrease: 20,
    description: 'Manejas dos armas simultáneamente con fluidez mortal y reflejos defensivos.',
    benefits: [
      'Aumento de Característica: Aumenta tu Fuerza o Destreza en 1 (máx. 20).',
      'Ataque Rápido Adicional: Cuando atacas con un arma en tu turno, puedes hacer un ataque adicional con otra arma que sostengas como Acción Adicional, incluso si una de ellas no tiene la propiedad Ligera.',
      'Desenvainar Fluido: Puedes desenvainar o enfundar dos armas a la vez en el mismo turno.'
    ],
    sourceBook: 'Manual del Jugador 2024 (Capítulo 5)'
  },
  {
    id: 'feat-shield-master',
    name: 'Experto en Escudos (Shield Master)',
    category: 'general',
    levelPrerequisite: 4,
    prerequisitesText: 'Competencia con escudos',
    statOptions: ['str'],
    maxStatIncrease: 20,
    description: 'Tu escudo es tanto una muralla inexpugnable como un ariete de asalto.',
    benefits: [
      'Aumento de Característica: Aumenta tu Fuerza en 1 (máx. 20).',
      'Golpe de Escudo: Si realizas la acción Atacar en tu turno e impactas a una criatura, puedes usar una Acción Adicional para derribarla o empujarla 1.5 metros si falla una salvación de Fuerza (CD 8 + bonif. competencia + mod. Fuerza).',
      'Cobertura Defensiva: Si no estás incapacitado, sumas el bonificador de CA de tu escudo a cualquier tirada de salvación de Destreza contra conjuros u otros efectos dañinos que te tengan como único objetivo.',
      'Refugio de Escudo: Si un efecto te permite salvar Destreza para recibir solo la mitad del daño, puedes usar tu reacción para interponer el escudo y no recibir ningún daño en caso de éxito.'
    ],
    sourceBook: 'Manual del Jugador 2024 (Capítulo 5)'
  },
  {
    id: 'feat-polearm-master',
    name: 'Maestro de las Armas de Asta (Polearm Master)',
    category: 'general',
    levelPrerequisite: 4,
    prerequisitesText: 'Fuerza o Destreza 13 o superior',
    statOptions: ['str', 'dex'],
    maxStatIncrease: 20,
    description: 'Mantienes a tus enemigos a raya utilizando el alcance y el contrapeso de lanzas y alabardas.',
    benefits: [
      'Aumento de Característica: Aumenta tu Fuerza o Destreza en 1 (máx. 20).',
      'Ataque con el Regatón: Al tomar la acción Atacar empuñando una alabarda, pica, guja o bastón, puedes usar una Acción Adicional para atacar con el extremo opuesto del arma (daño contundente 1d4 + mod. característico).',
      'Alcance de Oportunidad: Mientras empuñes una de estas armas, las demás criaturas provocan un ataque de oportunidad tuyo al entrar en el alcance de tu arma.'
    ],
    sourceBook: 'Manual del Jugador 2024 (Capítulo 5)'
  },
  {
    id: 'feat-crossbow-expert',
    name: 'Experto en Ballestas (Crossbow Expert)',
    category: 'general',
    levelPrerequisite: 4,
    prerequisitesText: 'Destreza 13 o superior',
    statOptions: ['dex'],
    maxStatIncrease: 20,
    description: 'Cargas y disparas ballestas con una cadencia impresionante incluso en refriegas cerradas.',
    benefits: [
      'Aumento de Característica: Aumenta tu Destreza en 1 (máx. 20).',
      'Ignorar Carga: Ignoras la propiedad Recarga (Loading) de cualquier ballesta con la que seas competente.',
      'Sin Desventaja Cuerpo a Cuerpo: Estar a 1.5 metros de una criatura no impone desventaja a tus tiradas de ataque a distancia con ballestas.',
      'Disparo Secundario: Al atacar con un arma de una mano, puedes usar tu Acción Adicional para disparar una ballesta de mano cargada.'
    ],
    sourceBook: 'Manual del Jugador 2024 (Capítulo 5)'
  },
  {
    id: 'feat-speedy',
    name: 'Atleta Veloz / Móvil (Speedy)',
    category: 'general',
    levelPrerequisite: 4,
    prerequisitesText: 'Destreza o Constitución 13 o superior',
    statOptions: ['dex', 'con'],
    maxStatIncrease: 20,
    description: 'Posees una agilidad vertiginosa y una velocidad de desplazamiento superior.',
    benefits: [
      'Aumento de Característica: Aumenta tu Destreza o Constitución en 1 (máx. 20).',
      'Velocidad Aumentada: Tu velocidad a pie aumenta en 3 metros (10 pies).',
      'Carrera Libre: Cuando realizas la acción de Correr (Dash), el terreno difícil no te cuesta movimiento adicional durante ese turno.',
      'Paso Escurridizo: Cuando realizas un ataque cuerpo a cuerpo contra una criatura, esa criatura no puede realizar ataques de oportunidad contra ti durante el resto de tu turno, hayas acertado o fallado el ataque.'
    ],
    sourceBook: 'Manual del Jugador 2024 (Capítulo 5)'
  },
  {
    id: 'feat-skulker',
    name: 'Acechador Sigiloso (Skulker)',
    category: 'general',
    levelPrerequisite: 4,
    prerequisitesText: 'Destreza 13 o superior',
    statOptions: ['dex'],
    maxStatIncrease: 20,
    description: 'Eres un maestro de las sombras y el sigilo, invisible para tus perseguidores.',
    benefits: [
      'Aumento de Característica: Aumenta tu Destreza en 1 (máx. 20).',
      'Vista Ciega: Ganas Visión Ciega (Blindsight) con un radio de 3 metros (10 pies).',
      'Ocultación Tenue: Puedes intentar esconderte incluso cuando solo estás ligeramente oscurecido por sombras o niebla.',
      'Tirador Silencioso: Si estás oculto y fallas un ataque a distancia, el disparo no revela tu posición.'
    ],
    sourceBook: 'Manual del Jugador 2024 (Capítulo 5)'
  },
  {
    id: 'feat-inspiring-leader',
    name: 'Líder Inspirador (Inspiring Leader)',
    category: 'general',
    levelPrerequisite: 4,
    prerequisitesText: 'Sabiduría o Carisma 13 o superior',
    statOptions: ['wis', 'cha'],
    maxStatIncrease: 20,
    description: 'Tus palabras infunden valor heroico en tus camaradas antes de adentrarse en el peligro.',
    benefits: [
      'Aumento de Característica: Aumenta tu Sabiduría o Carisma en 1 (máx. 20).',
      'Discurso Alentador: Puedes dedicar 10 minutos a inspirar a tus compañeros. Hasta 6 criaturas aliadas (pudiendo incluirte a ti) ganan Puntos de Golpe Temporales iguales a tu Nivel + tu modificador de Sabiduría o Carisma.',
      'Una criatura no puede recibir este beneficio nuevamente hasta que termine un Descanso Corto o Largo.'
    ],
    sourceBook: 'Manual del Jugador 2024 (Capítulo 5)'
  },
  {
    id: 'feat-resilient',
    name: 'Resistente (Resilient)',
    category: 'general',
    levelPrerequisite: 4,
    statOptions: ['str', 'dex', 'con', 'int', 'wis', 'cha'],
    maxStatIncrease: 20,
    description: 'Entrenas tu mente y cuerpo para resistir efectos perjudiciales específicos.',
    benefits: [
      'Aumento de Característica: Elige una característica y auméntala en 1 (máx. 20).',
      'Competencia en Salvación: Ganas competencia en las tiradas de salvación de la característica elegida.'
    ],
    repeatable: true,
    sourceBook: 'Manual del Jugador 2024 (Capítulo 5)'
  },
  {
    id: 'feat-actor',
    name: 'Actor (Actor)',
    category: 'general',
    levelPrerequisite: 4,
    prerequisitesText: 'Carisma 13 o superior',
    statOptions: ['cha'],
    maxStatIncrease: 20,
    description: 'Eres un consumado imitador de voces, acentos y manierismos.',
    benefits: [
      'Aumento de Característica: Aumenta tu Carisma en 1 (máx. 20).',
      'Imitación Perfecta: Tienes ventaja en tiradas de Carisma (Engaño) y Carisma (Interpretación) cuando intentes hacerte pasar por otra persona.',
      'Mimetismo Vocal: Puedes imitar las voces y sonidos de otras criaturas que hayas escuchado hablar durante al menos 1 minuto.'
    ],
    sourceBook: 'Manual del Jugador 2024 (Capítulo 5)'
  },
  {
    id: 'feat-charger',
    name: 'Cargador de Asalto (Charger)',
    category: 'general',
    levelPrerequisite: 4,
    prerequisitesText: 'Fuerza o Destreza 13 o superior',
    statOptions: ['str', 'dex'],
    maxStatIncrease: 20,
    description: 'Aprovechas el impulso de tu carrera para infligir impactos catastróficos.',
    benefits: [
      'Aumento de Característica: Aumenta tu Fuerza o Destreza en 1 (máx. 20).',
      'Carga Impetuosa: Si te mueves al menos 3 metros en línea recta inmediatamente antes de realizar un ataque cuerpo a cuerpo, puedes elegir entre infligir 1d8 de daño adicional o empujar al objetivo hasta 3 metros (10 pies) si es de tamaño Grande o menor.'
    ],
    sourceBook: 'Manual del Jugador 2024 (Capítulo 5)'
  },
  {
    id: 'feat-heavy-armor-master',
    name: 'Defensor con Armadura Pesada (Heavy Armor Master)',
    category: 'general',
    levelPrerequisite: 4,
    prerequisitesText: 'Competencia con armadura pesada',
    statOptions: ['str', 'con'],
    maxStatIncrease: 20,
    description: 'Tu pericia portando armaduras pesadas desvía y atenúa los golpes más brutales.',
    benefits: [
      'Aumento de Característica: Aumenta tu Fuerza o Constitución en 1 (máx. 20).',
      'Reducción de Daño: Mientras vistas armadura pesada, cualquier daño contundente, perforante y cortante que recibas se reduce en una cantidad igual a tu bonificador de competencia.'
    ],
    sourceBook: 'Manual del Jugador 2024 (Capítulo 5)'
  },
  {
    id: 'feat-defensive-duelist',
    name: 'Duelista Defensivo (Defensive Duelist)',
    category: 'general',
    levelPrerequisite: 4,
    prerequisitesText: 'Destreza 13 o superior',
    statOptions: ['dex'],
    maxStatIncrease: 20,
    description: 'Manejas armas sutiles con maestría esgrimista, desviando estocadas enemigas con tu hoja.',
    benefits: [
      'Aumento de Característica: Aumenta tu Destreza en 1 (máx. 20).',
      'Parada con Estilo: Cuando estés empuñando un arma sutil (Finesse) con la que seas competente y una criatura te impacte con un ataque cuerpo a cuerpo, puedes usar tu reacción para sumar tu bonificador de competencia a tu CA contra ese ataque, pudiendo hacer que falle.'
    ],
    sourceBook: 'Manual del Jugador 2024 (Capítulo 5)'
  },

  // -------------------------------------------------------------
  // BENDICIONES ÉPICAS (NIVEL 19-20) - MANUAL DEL JUGADOR & GUÍA DM 2024
  // -------------------------------------------------------------
  {
    id: 'feat-boon-fate',
    name: 'Bendición de Destino Ineludible (Boon of Fate)',
    category: 'epic_boon',
    levelPrerequisite: 19,
    statOptions: ['str', 'dex', 'con', 'int', 'wis', 'cha'],
    maxStatIncrease: 30,
    description: 'Eres capaz de doblar los hilos del destino y reescribir la fortuna a voluntad.',
    benefits: [
      'Aumento Épico: Aumenta una característica a tu elección en 1, ¡pudiendo superar 20 hasta un máximo de 30!',
      'Hilar el Destino: Cuando tú u otra criatura que puedas ver a 18 metros (60 pies) haga una tirada de d20, puedes sumar o restar 2d4 al resultado para convertir un fallo en éxito o un éxito en fallo. Recuperas este poder tras un Descanso Corto o al tirar iniciativa al comenzar un combate.'
    ],
    sourceBook: 'Manual del Jugador & Guía del DM 2024'
  },
  {
    id: 'feat-boon-dimensional-travel',
    name: 'Bendición de Resistencia Dimensional (Boon of Dimensional Travel)',
    category: 'epic_boon',
    levelPrerequisite: 19,
    statOptions: ['str', 'dex', 'con', 'int', 'wis', 'cha'],
    maxStatIncrease: 30,
    description: 'Parpadeas a través de las fisuras del multiverso con cada golpe o conjuro que realizas.',
    benefits: [
      'Aumento Épico: Aumenta una característica a tu elección en 1 (máx. 30).',
      'Paso Entre Dimensiones: Inmediatamente después de realizar la acción de Atacar o la acción de Lanzar un Conjuro, puedes teletransportarte mágicamente hasta 9 metros (30 pies) a un espacio desocupado que puedas ver. Este movimiento no gasta tu velocidad ni provoca ataques de oportunidad.'
    ],
    sourceBook: 'Manual del Jugador & Guía del DM 2024'
  },
  {
    id: 'feat-boon-energy-recovery',
    name: 'Bendición de Recuperación de Energía (Boon of Energy Recovery)',
    category: 'epic_boon',
    levelPrerequisite: 19,
    statOptions: ['str', 'dex', 'con', 'int', 'wis', 'cha'],
    maxStatIncrease: 30,
    description: 'La esencia vital del cosmos fluye por tus venas desafiando incluso a la propia muerte.',
    benefits: [
      'Aumento Épico: Aumenta una característica a tu elección en 1 (máx. 30).',
      'Surgir de la Muerte: Cuando recibes daño que reduciría tus Puntos de Golpe a 0, no caes inconsciente; en su lugar, recuperas inmediatamente una cantidad de Puntos de Golpe igual a la mitad de tus PG máximos. Puedes usar este rasgo 1 vez por Descanso Largo.'
    ],
    sourceBook: 'Manual del Jugador & Guía del DM 2024'
  },
  {
    id: 'feat-boon-unfettered',
    name: 'Bendición de Invisibilidad Irresistible (Boon of the Unfettered / Truhan)',
    category: 'epic_boon',
    levelPrerequisite: 19,
    statOptions: ['str', 'dex', 'con', 'int', 'wis', 'cha'],
    maxStatIncrease: 30,
    description: 'Te desvaneces en el tejido de la realidad burlando los sentidos y los conjuros enemigos.',
    benefits: [
      'Aumento Épico: Aumenta una característica a tu elección en 1 (máx. 30).',
      'Invisibilidad de Batalla: Como Acción Adicional, te vuelves Invisible hasta el final de tu siguiente turno. Esta invisibilidad NO se interrumpe si atacas, infliges daño o lanzas conjuros.'
    ],
    sourceBook: 'Manual del Jugador & Guía del DM 2024'
  },
  {
    id: 'feat-boon-fortitude',
    name: 'Bendición de Hado Heroico (Boon of Fortitude)',
    category: 'epic_boon',
    levelPrerequisite: 19,
    statOptions: ['str', 'dex', 'con', 'int', 'wis', 'cha'],
    maxStatIncrease: 30,
    description: 'Posees una fortaleza física sobrehumana digna de los semidioses del panteón.',
    benefits: [
      'Aumento Épico: Aumenta una característica a tu elección en 1 (máx. 30).',
      'Vitalidad Colosal: Tus Puntos de Golpe máximos aumentan de inmediato en 40 PG.',
      'Regeneración Aumentada: Cada vez que recuperes Puntos de Golpe por cualquier motivo, sumas tu modificador de Constitución a la cantidad recuperada.'
    ],
    sourceBook: 'Manual del Jugador & Guía del DM 2024'
  },
  {
    id: 'feat-boon-truesight',
    name: 'Bendición de Puntería y Visión Verdadera (Boon of Truesight)',
    category: 'epic_boon',
    levelPrerequisite: 19,
    statOptions: ['str', 'dex', 'con', 'int', 'wis', 'cha'],
    maxStatIncrease: 30,
    description: 'Tus ojos perciben la verdad absoluta del multiverso a través de ilusiones, oscuridad y engaños.',
    benefits: [
      'Aumento Épico: Aumenta una característica a tu elección en 1 (máx. 30).',
      'Visión Verdadera: Ganas Visión Verdadera (Truesight) con un alcance de 18 metros (60 pies).',
      'Sentidos Insuperables: No puedes ser sorprendido por ninguna criatura, incluso si está oculta por magia o invisibilidad.'
    ],
    sourceBook: 'Manual del Jugador & Guía del DM 2024'
  },
  {
    id: 'feat-boon-spell-recall',
    name: 'Bendición de Magia Inagotable (Boon of Spell Recall)',
    category: 'epic_boon',
    levelPrerequisite: 19,
    statOptions: ['str', 'dex', 'con', 'int', 'wis', 'cha'],
    maxStatIncrease: 30,
    description: 'La trama mágica responde a tus mandatos reponiendo tu poder arcano instantáneamente.',
    benefits: [
      'Aumento Épico: Aumenta una característica a tu elección en 1 (máx. 30).',
      'Retención Mágica: Siempre que lances un conjuro de nivel 1 al 4 usando un espacio de conjuro, tira 1d10. Si obtienes un 10, no gastas el espacio de conjuro utilizado.'
    ],
    sourceBook: 'Manual del Jugador & Guía del DM 2024'
  },
  {
    id: 'feat-boon-combat-prowess',
    name: 'Bendición de Proeza en Combate (Boon of Combat Prowess)',
    category: 'epic_boon',
    levelPrerequisite: 19,
    statOptions: ['str', 'dex', 'con', 'int', 'wis', 'cha'],
    maxStatIncrease: 30,
    description: 'Tu maestría en las artes de la guerra asegura que ningún golpe tuyo sea en vano.',
    benefits: [
      'Aumento Épico: Aumenta una característica a tu elección en 1 (máx. 30).',
      'Impacto Infalible: Una vez por turno, cuando falles una tirada de ataque con un arma o conjuro, puedes decidir convertir el fallo en un impacto automático.'
    ],
    sourceBook: 'Manual del Jugador & Guía del DM 2024'
  }
];
