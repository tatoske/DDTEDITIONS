import { GroupPatronDef } from '../types/dnd';

export const GROUP_PATRONS_DATA: GroupPatronDef[] = [
  // -------------------------------------------------------------------------
  // 1. EL CALDERO DE TASHA PARA TODO - ACADEMIA
  // -------------------------------------------------------------------------
  {
    id: 'tasha_academy',
    name: 'Colegio de Altos Estudios Arcanos',
    type: 'academy',
    typeName: 'Academia Arcana & Erudita',
    sourceBook: 'El Caldero de Tasha',
    tagline: 'Guardianes del conocimiento arcano, excavadores de reliquias y sabios de los planos.',
    description:
      'Una prestigiosa institución de magos, historiadores y filósofos arcanos. El Colegio contrata aventureros para recuperar manuscritos perdidos, catalogar fauna exótica de otros planos y contener anomalías arcanas antes de que arrasen ciudades enteras.',
    badgeColor: '#6366f1', // Indigo arcano
    perks: [
      {
        title: 'Acceso a la Gran Biblioteca Arcana',
        desc: 'El grupo tiene ventaja en pruebas de Inteligencia (Arcanos, Historia, Religión y Naturaleza) realizadas consultando los archivos del Colegio.'
      },
      {
        title: 'Servicios de Identificación y Análisis',
        desc: 'Los sabios del colegio identifican objetos mágicos y traducen lenguas arcanas o runas antiguas sin coste para el grupo.'
      },
      {
        title: 'Laboratorios y Suministros Arcanos',
        desc: 'Descuento del 20% en pergaminos de conjuros (niveles 1 a 3) y pociones de curación adquiridas en los dispensarios del campus.'
      }
    ],
    contact: {
      name: 'Decana Vaeloria Arcanis',
      role: 'Gran Rectora de Estudios Extraplanares',
      personality: 'Metódica, brillante y exigente; valora la precisión empírica por encima de la fuerza bruta.',
      secret: 'Mantiene un portal planar inestable sellado en los sótanos prohibidos que consume energía del núcleo de la ciudad.',
      contactMethod: 'Mensajes mágicos mediante lechuzas mecánicas y proyecciones de ilusión en pedestales del campus.'
    },
    assignments: [
      'Recuperación de tomos y grimorios perdidos en ruinas subterráneas',
      'Captura de especímenes mágicos vivos para su disección o estudio',
      'Neutralización de brechas salvajes de magia en zonas fronterizas',
      'Protección de expediciones arqueológicas en tumbas olvidadas'
    ],
    compensation: {
      stipendPerDayGp: 1,
      housingQuality: 'Alojamiento espacioso en la residencia de becarios con acceso a talleres.',
      specialBenefit: 'Copia gratuita de 1 conjuro de nivel 1 o 2 en el libro de conjuros de los miembros arcanos cada mes.'
    },
    missionGeneratorTable: [
      {
        roll: 1,
        title: 'El Grimorio de las Siete Lunas',
        prompt: 'Un grimorio de magia abjurativa fue robado de la sección restringida por un estudiante expulsado.',
        target: 'Torre en ruinas en los Pantanos del Este',
        defaultRewardGp: 250,
        favorReward: 1
      },
      {
        roll: 2,
        title: 'Anomalía en el Observatorio Celeste',
        prompt: 'Un telescopio encantado ha abierto una fisura de baja gravedad que atrae criaturas del Plano Elemental del Aire.',
        target: 'Observatorio de Monte Velo',
        defaultRewardGp: 300,
        favorReward: 1
      },
      {
        roll: 3,
        title: 'Veneno de Hidra Astral',
        prompt: 'La facultad de Alquimia requiere tres frascos de bilis fresca de una hidra para sintetizar un antídoto planar.',
        target: 'Cuevas de Cuarzo Carmesí',
        defaultRewardGp: 450,
        favorReward: 2
      },
      {
        roll: 4,
        title: 'La Tumba del Archicanciller Olar',
        prompt: 'Un terremoto expuso la cripta de un antiguo rector; se teme que los sellos de protección se hayan quebrado.',
        target: 'Necrópolis Subterránea del Colegio',
        defaultRewardGp: 500,
        favorReward: 2
      },
      {
        roll: 5,
        title: 'Escolta del Cartógrafo Dimensional',
        prompt: 'El maestro Elidor debe trazar el mapa de un bosque afectado por una zona de magia salvaje y necesita guardaespaldas.',
        target: 'Bosque de los Espejos Quebrados',
        defaultRewardGp: 350,
        favorReward: 1
      },
      {
        roll: 6,
        title: 'El Misterio del Constructo Fugitivo',
        prompt: 'Un golem de bronce despertó con autoconciencia y escapó con los planos de un motor elemental experimental.',
        target: 'Alcantarillas de la Ciudadela',
        defaultRewardGp: 400,
        favorReward: 1
      }
    ],
    intriguesTable: [
      {
        roll: 1,
        title: 'Facultad Rival Celosa',
        complication: 'El departamento de Transmutación envía espías para sabotear la misión y reclamar el mérito.'
      },
      {
        roll: 2,
        title: 'Artefacto Maldito Oculto',
        complication: 'El objeto de la misión emana un aura de confusión que afecta a quien lo porte sin guantes de plomo.'
      },
      {
        roll: 3,
        title: 'Auditoría del Consejo de la Corona',
        complication: 'Inspectores de la Corona interrogan al grupo sobre el uso de fondos y la legalidad de sus conjuros.'
      },
      {
        roll: 4,
        title: 'Especimen Escapado en el Retorno',
        complication: 'La criatura u objeto transportado despierta o altera el clima en un radio de 1 milla.'
      }
    ]
  },

  // -------------------------------------------------------------------------
  // 2. EL CALDERO DE TASHA PARA TODO - SER DEL MÁS ALLÁ / ANTIGUO
  // -------------------------------------------------------------------------
  {
    id: 'tasha_ancient_being',
    name: 'El Concilio de las Cortes Feéricas',
    type: 'ancient_being',
    typeName: 'Ser del Más Allá / Feérico',
    sourceBook: 'El Caldero de Tasha',
    tagline: 'Patronazgo de entidades inmortales, señores del Feywild y guardianes cósmicos.',
    description:
      'Una alianza de nobles de la Corte de Verano y la Corte Crepuscular. Sus motivos son inescrutables, guiados por profecías poéticas, pactos antiguos y el equilibrio de las fuerzas naturales frente a la corrupción aberrante o infernal.',
    badgeColor: '#10b981', // Esmeralda feérico
    perks: [
      {
        title: 'Bendición de la Gracia Feérica',
        desc: 'Una vez por descanso largo, cada miembro del grupo puede sumar 1d4 a una tirada de salvación contra ser Hechizado o Asustado.'
      },
      {
        title: 'Veredas del Feywild',
        desc: 'El grupo puede utilizar cruces feéricos naturales para reducir a la mitad el tiempo de viaje entre bosques ancestrales.'
      },
      {
        title: 'Visión en los Sueños',
        desc: 'El patrón se comunica durante los descansos prolongados, otorgando revelaciones proféticas o avisos de emboscadas inminentes.'
      }
    ],
    contact: {
      name: 'Lord Silvanis el Burlón',
      role: 'Heraldo de la Reina del Rocío',
      personality: 'Elegante, caprichoso y enigmático; habla con adivinanzas y desprecia las leyes rígidas de los mortales.',
      secret: 'Teme mortalmente el contacto con el hierro frío y oculta una deuda de sangre con un archidiablo de las Nueve Infiernos.',
      contactMethod: 'Apariciones en reflejos de agua pura, flores de loto parlantes y mensajeros de aves de plumaje tornasol.'
    },
    assignments: [
      'Castigo a cazadores furtivos que talan arboledas sagradas',
      'Desbaratar maquinaciones de hechiceros que atan espíritus elementales',
      'Recuperación de reliquias feéricas trocadas por mortales ingenuos',
      'Proteger celebraciones y solsticios sagrados en círculos de piedras'
    ],
    compensation: {
      stipendPerDayGp: 1,
      housingQuality: 'Refugios naturales mágicos en claros del bosque donde el tiempo transcurre con paz infinita.',
      specialBenefit: 'Un saquito de polvo de hada mensual (otorga velocidad de vuelo 30 pies durante 1 minuto a 1 criatura).'
    },
    missionGeneratorTable: [
      {
        roll: 1,
        title: 'El Ladrón de Canciones',
        prompt: 'Un bardo mortal robó una melodía celestial del banquete de la reina y la canta en tabernas, atrayendo duergars.',
        target: 'Taberna El Jabalí de Plata',
        defaultRewardGp: 200,
        favorReward: 1
      },
      {
        roll: 2,
        title: 'La Espina de Hierro Frío',
        prompt: 'Un nigromante ha clavado clavos de hierro en el Roble del Corazón del bosque, marchitando las criaturas faéricas.',
        target: 'Corazón del Bosque Espino',
        defaultRewardGp: 350,
        favorReward: 2
      },
      {
        roll: 3,
        title: 'El Espejo de las Sombras',
        prompt: 'Una hechicera del Shadowfell intenta trocar un lago de cristal por un foso de podredumbre espectral.',
        target: 'Lago Cristalino de las Hadas',
        defaultRewardGp: 450,
        favorReward: 2
      },
      {
        roll: 4,
        title: 'El Juicio del Ciervo Dorado',
        prompt: 'Un noble local ha atrapado al Gran Ciervo Dorado en su coto de caza privado y planea servirlo en su boda.',
        target: 'Castillo del Barón de Valterra',
        defaultRewardGp: 300,
        favorReward: 1
      },
      {
        roll: 5,
        title: 'Pacto de Sangre Roto',
        prompt: 'Un brujo renegado se niega a entregar el tributo pactado de lágrimas de pesar y convoca demonios menores.',
        target: 'Círculo de Menhires Rotos',
        defaultRewardGp: 400,
        favorReward: 1
      },
      {
        roll: 6,
        title: 'El Vino de la Euforia Olvidada',
        prompt: 'Recuperar un tonel de vino de bayas estelares robado por una partida de trasgos ebrios que han ganado poderes ilusorios.',
        target: 'Guarida Subterránea de los Comehongos',
        defaultRewardGp: 280,
        favorReward: 1
      }
    ],
    intriguesTable: [
      {
        roll: 1,
        title: 'El Precio del Don',
        complication: 'El patrón exige a un personaje que nunca coma sal o que hable en rima durante las próximas 24 horas.'
      },
      {
        roll: 2,
        title: 'Engaño Ilusorio',
        complication: 'El objetivo de la misión no era quien parecía, sino un cambiaformas feérico que estaba probando la moral del grupo.'
      },
      {
        roll: 3,
        title: 'Rival de la Corte Oscura',
        complication: 'Un emisario de la Corte Unseelie intercepta al grupo con una oferta que duplica la recompensa a cambio de traición.'
      },
      {
        roll: 4,
        title: 'Distorsión Temporal',
        complication: 'Al regresar de la misión, han pasado 3 días más de lo previsto en el plano material.'
      }
    ]
  },

  // -------------------------------------------------------------------------
  // 3. EL CALDERO DE TASHA PARA TODO - ARISTÓCRATA / NOBLEZA
  // -------------------------------------------------------------------------
  {
    id: 'tasha_aristocrat',
    name: 'Casa Ducal de Bellaluna',
    type: 'aristocrat',
    typeName: 'Aristócrata / Dinastía Noble',
    sourceBook: 'El Caldero de Tasha',
    tagline: 'Mecenas de sangre noble, intrigas cortesanas y poder financiero sin par.',
    description:
      'Una de las familias de la alta nobleza más influyentes del reino. Financia a aventureros audaces para proteger sus tierras, recuperar tesoros de familia, salvaguardar a sus herederos y neutralizar discretamente a dinastías rivales.',
    badgeColor: '#eab308', // Dorado noble
    perks: [
      {
        title: 'Inmunidad Legal Menor',
        desc: 'El grupo cuenta con salvoconductos firmados por el Duque que reducen o anulan arrestos por ofensas menores (alteración del orden, porte de armas en palacios).'
      },
      {
        title: 'Acceso a la Alta Sociedad',
        desc: 'Ventaja en pruebas de Carisma (Persuasión y Engaño) al interactuar con la nobleza, magistrados y cortesanos del reino.'
      },
      {
        title: 'Mecenazgo y Préstamos de Emergencia',
        desc: 'El grupo puede solicitar un adelanto de hasta 500 po para pertrechos de expedición sin intereses.'
      }
    ],
    contact: {
      name: 'Senescal Lord Cassian Bellaluna',
      role: 'Primer Magistrado de la Casa Ducal',
      personality: 'Refinado, astuto, de modales impecables; exige discreción absoluta sobre cualquier escándalo.',
      secret: 'Paga sobornos a un sindicato criminal para proteger a la primogénita del Duque de un intento de secuestro orquestado por su propio tío.',
      contactMethod: 'Invitaciones lacradas con sello de cera escarlata entregadas por cocheros uniformados en tabernas selectas.'
    },
    assignments: [
      'Guardaespaldas encubiertos en fiestas de gala y banquetes reales',
      'Recuperación de pagarés comprometedores de cajas fuertes rivales',
      'Investigación de rumores de envenenamiento en la corte',
      'Desalojo de bestias o rebeldes de las fincas y viñedos de la familia'
    ],
    compensation: {
      stipendPerDayGp: 2,
      housingQuality: 'Alojamiento de lujo en el ala de invitados de la mansión ducal o posadas de primera categoría.',
      specialBenefit: 'Uso gratuito de caballos de tiro, carruajes ducales y sastres de gala para eventos diplomáticos.'
    },
    missionGeneratorTable: [
      {
        roll: 1,
        title: 'El Banquete de las Máscaras',
        prompt: 'Infiltrarse en el baile de máscaras de un barón rival para confirmar si está contratando asesinos extranjeros.',
        target: 'Palacete del Lago de los Cisnes',
        defaultRewardGp: 300,
        favorReward: 1
      },
      {
        roll: 2,
        title: 'El Collar de la Duquesa Viuda',
        prompt: 'Un ladrón de guante blanco sustrajo el zafiro ancestral de la familia; debe recuperarse antes del amanecer.',
        target: 'Distrito de las Luces y Teatros',
        defaultRewardGp: 400,
        favorReward: 2
      },
      {
        roll: 3,
        title: 'Revuelta en la Mina de Plata',
        prompt: 'Los mineros han tomado el control de los pozos alegando que criaturas subterráneas brotaron del subsuelo.',
        target: 'Minas de Monte Plateado',
        defaultRewardGp: 450,
        favorReward: 1
      },
      {
        roll: 4,
        title: 'El Testamento Secreto',
        prompt: 'Encontrar el testamento original del abuelo del Duque en una mansión abandonada infestada de apariciones.',
        target: 'Finca Abandonada de Bellaluna',
        defaultRewardGp: 350,
        favorReward: 1
      },
      {
        roll: 5,
        title: 'Chantaje en el Club de Caballeros',
        prompt: 'Un usurero amenaza con publicar cartas íntimas del heredero si no se le paga una suma exorbitante; neutralizar el chantaje.',
        target: 'Club Privado La Rosa Blanca',
        defaultRewardGp: 380,
        favorReward: 1
      },
      {
        roll: 6,
        title: 'El Duelo de Honor Ilegal',
        prompt: 'Un caballero rival ha retado al sobrino del Duque a un duelo a muerte a medianoche; el grupo debe intervenir o representarlo.',
        target: 'Ruinas del Templo del Alba',
        defaultRewardGp: 500,
        favorReward: 2
      }
    ],
    intriguesTable: [
      {
        roll: 1,
        title: 'Espía en el Servicio Doméstico',
        complication: 'Un mayordomo vende información de los movimientos del grupo a la prensa sensacionalista o a los rivales.'
      },
      {
        roll: 2,
        title: 'Capricho del Heredero',
        complication: 'El joven conde insiste en acompañar al grupo a la misión sin entrenamiento previo.'
      },
      {
        roll: 3,
        title: 'Conflicto de Etiqueta',
        complication: 'Cometer un faux pas diplomático reduce la reputación de la familia en la corte real.'
      },
      {
        roll: 4,
        title: 'Deudas de Juego',
        complication: 'Los bienes incautados resultan pertenecer a un prestamista que cuenta con la protección de la guardia de la ciudad.'
      }
    ]
  },

  // -------------------------------------------------------------------------
  // 4. EL CALDERO DE TASHA PARA TODO - SINDICATO CRIMINAL
  // -------------------------------------------------------------------------
  {
    id: 'tasha_criminal_syndicate',
    name: 'La Cofradía del Velo Sombrío',
    type: 'criminal_syndicate',
    typeName: 'Sindicato Criminal & Bajo Mundo',
    sourceBook: 'El Caldero de Tasha',
    tagline: 'Maestros del robo, el contrabando, la extorsión y los secretos del hampa.',
    description:
      'Una telaraña de ladrones, peristas, contrabandistas e informantes que opera en las sombras de las grandes urbes. El sindicato ofrece protección, riqueza y contactos a cambio de obediencia, lealtad y un porcentaje de cada botín conseguido.',
    badgeColor: '#8b5cf6', // Púrpura oscuro / sombrío
    perks: [
      {
        title: 'Red de Casas de Seguridad',
        desc: 'El grupo puede descansar en refugios ocultos en cualquier ciudad grande sin riesgo de ser emboscados o rastreados por la guardia.'
      },
      {
        title: 'Acceso al Mercado Negro',
        desc: 'Descuento del 15% en venenos, herramientas de ladrón, disfraces mágicos y objetos confiscados o robados.'
      },
      {
        title: 'Identidades y Falsificaciones',
        desc: 'El sindicato provee documentos de viaje, permisos mercantiles y sellos oficiales falsos con dificultad CD 18 para ser detectados.'
      }
    ],
    contact: {
      name: '"Ojos Grises" Karr',
      role: 'Lugarteniente de Contrabando y Peritaje',
      personality: 'Cínico, observador y extremadamente puntual; mide la lealtad en monedas de oro y promesas cumplidas.',
      secret: 'Planea un golpe interno para derrocar al líder del sindicato y quiere a los aventureros como su guardia pretoriana.',
      contactMethod: 'Tizas con marcas de gremio en callejones, mensajes en el fondo de jarras de cerveza en tabernas portuarias.'
    },
    assignments: [
      'Golpes a cajas fuertes y bóvedas acorazadas de prestamistas corruptos',
      'Extracción y contrabando de bienes prohibidos más allá de los puestos aduaneros',
      'Ajuste de cuentas con bandas rivales o traidores internos',
      'Espionaje y robo de sellos oficiales en despachos de magistrados'
    ],
    compensation: {
      stipendPerDayGp: 1,
      housingQuality: 'Habitaciones en áticos camuflados y sótanos de tabernas del bajo mundo.',
      specialBenefit: 'Venta de cualquier botín o joya robada al 60% de su valor comercial sin hacer preguntas (frente al 50% habitual).'
    },
    missionGeneratorTable: [
      {
        roll: 1,
        title: 'El Asalto a la Aduana Fluvial',
        prompt: 'Un cargamento de seda élfica y especias raras fue confiscado por la capitanía; debe recuperarse del muelle número 4.',
        target: 'Almacenes de la Capitanía de Puerto',
        defaultRewardGp: 350,
        favorReward: 1
      },
      {
        roll: 2,
        title: 'Silenciar al Soplón',
        prompt: 'Un antiguo asociado fue capturado por los guardias y está a punto de cantar; sacarlo de las mazmorras o asegurar su silencio.',
        target: 'Cárcel Municipal de Roca Negra',
        defaultRewardGp: 400,
        favorReward: 2
      },
      {
        roll: 3,
        title: 'La Bóveda del Prestamista Malgar',
        prompt: 'Abrir la cerradura arcana de la caja fuerte del mayor usurero de la ciudad y sustraer los pagarés del sindicato.',
        target: 'Mansión Fortificada de Malgar',
        defaultRewardGp: 550,
        favorReward: 2
      },
      {
        roll: 4,
        title: 'Guerra de Bandas en los Muelles',
        prompt: 'La banda de los Cuchillos Rojos ha invadido el territorio del sindicato; darles un escarmiento ejemplar.',
        target: 'Distrito Portuario de los Muelles Viejos',
        defaultRewardGp: 300,
        favorReward: 1
      },
      {
        roll: 5,
        title: 'Falsificación de Alta Cuna',
        prompt: 'Intercambiar el retrato al óleo original de la familia real en la galería por una copia perfecta antes de la subasta.',
        target: 'Galería de Arte Imperial',
        defaultRewardGp: 450,
        favorReward: 1
      },
      {
        roll: 6,
        title: 'El Envío de Veneno de Manticora',
        prompt: 'Interceptar una carreta de contrabandistas independientes y asegurar los frascos de veneno para el sindicato.',
        target: 'Camino de los Desfiladeros del Viento',
        defaultRewardGp: 380,
        favorReward: 1
      }
    ],
    intriguesTable: [
      {
        roll: 1,
        title: 'Infiltrado de la Guardia',
        complication: 'Uno de los informantes del sindicato es un topo que ha alertado a la patrulla nocturna.'
      },
      {
        roll: 2,
        title: 'La Marca del Gremio Rival',
        complication: 'Un asesino de una banda competidora deja una moneda negra en el bolsillo de un aventurero como advertencia.'
      },
      {
        roll: 3,
        title: 'Botín Maldito',
        complication: 'Una de las joyas robadas está sintonizada con un conjuro de Localizar Objeto lanzado por un inquisidor.'
      },
      {
        roll: 4,
        title: 'Avaricia del Contacto',
        complication: 'El contacto intenta retener un 20% adicional de la recompensa alegando costes imprevistos.'
      }
    ]
  },

  // -------------------------------------------------------------------------
  // 5. EL CALDERO DE TASHA PARA TODO - GREMIO COMERCIAL
  // -------------------------------------------------------------------------
  {
    id: 'tasha_guild',
    name: 'Consorcio Mercante de los Tres Ríos',
    type: 'guild',
    typeName: 'Gremio Comercial & Artesanal',
    sourceBook: 'El Caldero de Tasha',
    tagline: 'Comercio, caravanas, forjas legendarias y monopolio de recursos.',
    description:
      'Una confederación de artesanos, herreros, armadores y mercaderes que domina las rutas comerciales del continente. Protegen las caravanas, aseguran minas ricas en mineral y aplastan la piratería para mantener el libre flujo de la riqueza.',
    badgeColor: '#0ea5e9', // Azul cian mercantil
    perks: [
      {
        title: 'Pase Libre de Caravana',
        desc: 'Transporte y pasaje gratuito para el grupo y sus monturas en cualquier caravana o navío fletado por el gremio.'
      },
      {
        title: 'Descuento de Artesano',
        desc: 'Descuento permanente del 20% en armas, armaduras no mágicas, monturas y equipamiento de aventurero en tiendas afiliadas.'
      },
      {
        title: 'Línea de Crédito Comercial',
        desc: 'El grupo puede comprar pertrechos pagando a 30 días mediante pagarés del Consorcio.'
      }
    ],
    contact: {
      name: 'Maestre Thorgar Martillofuerte',
      role: 'Director de Seguridad de Rutas y Caravanas',
      personality: 'Pragmático, testarudo, con un ojo infalible para tasar gemas y evaluar el coraje de un guerrero.',
      secret: 'Oculta que un cargamento de mithral perdido fue en realidad vendido a piratas por su propio sobrino.',
      contactMethod: 'Reuniones en lonjas gremiales, mesas reservadas en posadas de postas y notas selladas con cera azul.'
    },
    assignments: [
      'Escolta armada de caravanas de alta prioridad a través de tierras salvajes',
      'Apertura y aseguramiento de pasos montañosos infestados de monstruos',
      'Negociación de contratos exclusivos con clanes enanos o tribus nómadas',
      'Investigación de sabotajes a talleres y fundiciones del gremio'
    ],
    compensation: {
      stipendPerDayGp: 1,
      housingQuality: 'Habitaciones confortables en casas gremiales con acceso a fraguas y establos.',
      specialBenefit: 'Reparación gratuita de armaduras y afilado de armas que otorga +1 al daño en el primer ataque de cada combate.'
    },
    missionGeneratorTable: [
      {
        roll: 1,
        title: 'El Paso de los Ogros Hambrientos',
        prompt: 'Una tribu de ogros bloquea el paso del norte exigiendo un peaje de 10 bueyes por carromato; despejar la ruta.',
        target: 'Garganta del Trueno',
        defaultRewardGp: 300,
        favorReward: 1
      },
      {
        roll: 2,
        title: 'La Caravana Fantasma de Mithral',
        prompt: 'Una caravana con lingotes de mithral desapareció sin dejar huellas en las llanuras; rastrear los restos.',
        target: 'Llanuras Ventosas del Sur',
        defaultRewardGp: 450,
        favorReward: 2
      },
      {
        roll: 3,
        title: 'Sabotaje en la Fundición Real',
        prompt: 'Alguien vertió icor de babosa negra en los altos hornos, deteniendo la producción de armas para la guardia.',
        target: 'Distrito de las Forjas',
        defaultRewardGp: 350,
        favorReward: 1
      },
      {
        roll: 4,
        title: 'El Contrato con los Gigantes de las Colinas',
        prompt: 'Entregar un tributo de cerveza y ganado a un cacique gigante para que no derribe los puentes de madera del río.',
        target: 'Valle de las Piedras Rodantes',
        defaultRewardGp: 400,
        favorReward: 1
      },
      {
        roll: 5,
        title: 'Piratas en el Estuario',
        prompt: 'Un corsario fluvial ha tomado tres barcazas repletas de grano; abordar su barco insignia y recuperar la carga.',
        target: 'Desembocadura del Río Serpiente',
        defaultRewardGp: 500,
        favorReward: 2
      },
      {
        roll: 6,
        title: 'El Monopolio de la Seda de Araña',
        prompt: 'Asegurar una cueva de arañas de fase para recolectar seda mágica antes de que lo haga un gremio rival extranjero.',
        target: 'Cavernas de las Telarañas Plateadas',
        defaultRewardGp: 380,
        favorReward: 1
      }
    ],
    intriguesTable: [
      {
        roll: 1,
        title: 'Inspección de Impuestos Sorpresa',
        complication: 'Un recaudador real congela las mercancías reclamando aranceles atrasados de dudosa procedencia.'
      },
      {
        roll: 2,
        title: 'Huelga de Transportistas',
        complication: 'Los carreteros se niegan a avanzar a menos que se les duplique la ración diaria por peligro inminente.'
      },
      {
        roll: 3,
        title: 'Mercancía de Calidad Fraudulenta',
        complication: 'Uno de los cofres entregados contiene barras de plomo pintadas con barniz dorado.'
      },
      {
        roll: 4,
        title: 'Competencia Desleal Armada',
        complication: 'Mercenarios contratados por un consorcio rival atacan fingiendo ser bandidos comunes.'
      }
    ]
  },

  // -------------------------------------------------------------------------
  // 6. EL CALDERO DE TASHA PARA TODO - FUERZA MILITAR
  // -------------------------------------------------------------------------
  {
    id: 'tasha_military_force',
    name: 'Compañía de los Halcones de Hierro',
    type: 'military_force',
    typeName: 'Fuerza Militar & Compañía Mercenaria',
    sourceBook: 'El Caldero de Tasha',
    tagline: 'Disciplina marcial, armas de asedio, táctica y gloria en el campo de batalla.',
    description:
      'Una experimentada legión de mercenarios veteranos y soldados profesionales. Contratan escuadras de aventureros para misiones de reconocimiento tras las líneas enemigas, decapitación de mandos rivales y misiones suicidas donde un ejército regular sería detectado.',
    badgeColor: '#dc2626', // Rojo escarlata militar
    perks: [
      {
        title: 'Rango Militar y Salvoconducto Marcial',
        desc: 'El grupo ostenta el rango de Suboficiales de Campo, pudiendo comandar milicias locales y requisar suministros de campaña de emergencia.'
      },
      {
        title: 'Acceso a la Armería de Asedio',
        desc: 'Acceso gratuito a munición estándar, flechas, virotes, antorchas y equipo de zapador en cualquier fuerte de la compañía.'
      },
      {
        title: 'Apoyo de Flanco en Combate',
        desc: 'En situaciones críticas al aire libre, el DM puede permitir la intervención de una salva de arqueros o 1d4 soldados de infantería como refuerzo.'
      }
    ],
    contact: {
      name: 'Comandante Valeria Thorne',
      role: 'Capitana General de la Vanguardia',
      personality: 'Austera, directa y con profundo respeto por el valor en combate; aborrece la cobardía y los rodeos diplomáticos.',
      secret: 'Sabe que el Alto Mando del ejército planea traicionar al Duque que los contrató una vez asegurada la fortaleza fronteriza.',
      contactMethod: 'Órdenes selladas entregadas por jinetes de posta o toques de corneta en campamentos fortificados.'
    },
    assignments: [
      'Reconocimiento y cartografía de campamentos enemigos en territorio hostil',
      'Asesinato o captura de caudillos orcos, gigantes o nigromantes rivales',
      'Destrucción de catapultas y máquinas de asedio enemigas antes de la batalla',
      'Extracción de generales capturados en prisiones de campaña'
    ],
    compensation: {
      stipendPerDayGp: 1.5,
      housingQuality: 'Tiendas de campaña de oficiales con raciones de campaña abundantes y guardias de guardia 24 horas.',
      specialBenefit: 'Entrenamiento militar: +1 a las tiradas de iniciativa una vez al día para todo el grupo cuando combaten juntos.'
    },
    missionGeneratorTable: [
      {
        roll: 1,
        title: 'La Cabeza de la Hidra',
        prompt: 'Infiltrarse en el campamento de una horda de incursores y eliminar al caudillo orco antes de que lance el asalto.',
        target: 'Desfiladero de los Cráneos Pintados',
        defaultRewardGp: 400,
        favorReward: 1
      },
      {
        roll: 2,
        title: 'Sabotaje al Tren de Suministros',
        prompt: 'Quemar los carros de víveres y envenenar los silos de grano de una columna enemiga acampada en la frontera.',
        target: 'Encrucijada del Árbol Ahorcado',
        defaultRewardGp: 350,
        favorReward: 1
      },
      {
        roll: 3,
        title: 'Rescate en el Bastión Roto',
        prompt: 'Un grupo de zapadores y exploradores quedó atrapado en un torreón derruido rodeado por monstruos; rescatarlos.',
        target: 'Bastión del Cuervo Solitario',
        defaultRewardGp: 450,
        favorReward: 2
      },
      {
        roll: 4,
        title: 'El Estandarte Perdido de la 4ª Legión',
        prompt: 'Recuperar el águila de bronce ceremonial de las garras de un dragón joven que la atesora en su nido.',
        target: 'Pico de la Tormenta',
        defaultRewardGp: 600,
        favorReward: 2
      },
      {
        roll: 5,
        title: 'El Traidor en el Estado Mayor',
        prompt: 'Descubrir cuál de los tres capitanes de división está vendiendo los mapas de trincheras al bando enemigo.',
        target: 'Campamento Central de los Halcones',
        defaultRewardGp: 300,
        favorReward: 1
      },
      {
        roll: 6,
        title: 'Despejar las Minas Terrestres Arcanas',
        prompt: 'Los enemigos han sembrado un valle con glifos explosivos de fuego; desactivarlos para permitir el paso de la caballería.',
        target: 'Valle de las Cenizas Rojas',
        defaultRewardGp: 500,
        favorReward: 1
      }
    ],
    intriguesTable: [
      {
        roll: 1,
        title: 'Fuego Amigo Inesperado',
        complication: 'Una batería de catapultas aliadas dispara sobre la posición del grupo por error de cálculo del artillero.'
      },
      {
        roll: 2,
        title: 'Motín de Reclutas Forzados',
        complication: 'Una escuadra de novatos se niega a cargar y amenaza con abandonar sus armas a menos que el grupo los lidere.'
      },
      {
        roll: 3,
        title: 'Órdenes Contradictorias',
        complication: 'Llega un mensajero del general en jefe con instrucciones que anulan por completo la misión del contacto.'
      },
      {
        roll: 4,
        title: 'Heridas Infectadas de Plaga',
        complication: 'Las armas de los enemigos estaban untadas con viruela de cementerio; riesgo de contagio tras la batalla.'
      }
    ]
  },

  // -------------------------------------------------------------------------
  // 7. EL CALDERO DE TASHA PARA TODO - ORDEN RELIGIOSA
  // -------------------------------------------------------------------------
  {
    id: 'tasha_religious_order',
    name: 'Inquisición de la Llama Purificadora',
    type: 'religious_order',
    typeName: 'Orden Religiosa & Cruzada Sagrada',
    sourceBook: 'El Caldero de Tasha',
    tagline: 'Defensores de la fe, cazadores de no-muertos y purificadores de aberraciones.',
    description:
      'Una orden de clérigos, paladines y zealotas dedicados a erradicar la corrupción demoníaca, los cultos nigrománticos y las herejías que amenazan las almas de los inocentes. Envían a aventureros como su puño ejecutor en tierras oscuras.',
    badgeColor: '#f97316', // Naranja / Fuego sagrado
    perks: [
      {
        title: 'Lanzamiento de Conjuros Divinos Gratuito',
        desc: 'Los sacerdotes de cualquier templo de la orden lanzan conjuros de *Curar Heridas*, *Restablecimiento Menor* y *Quitar Maldición* sin coste para el grupo.'
      },
      {
        title: 'Suministros Consagrados',
        desc: 'El grupo recibe gratuitamente hasta 4 viales de Agua Bendita y 2 símbolos sagrados bendecidos al iniciar cada asignación importante.'
      },
      {
        title: 'Refugio Sagrado',
        desc: 'Los monasterios y abadías de la orden ofrecen asilo inviolable al grupo frente a autoridades seculares o cazarrecompensas.'
      }
    ],
    contact: {
      name: 'Padre Inquisidor Miguel de la Llama',
      role: 'Prior de la Vigilia Nocturna',
      personality: 'Sereno, penitente y austero; carga el peso de pecados pasados y busca la salvación a través de la justicia justa.',
      secret: 'Esconde que él mismo fue marcado por un culto demoníaco en su juventud y teme que la corrupción despierte en su sangre.',
      contactMethod: 'Confesionarios sellados en catedrales, cirios encendidos con fragancia a mirra y rosarios de plata.'
    },
    assignments: [
      'Exorcismo de demonios que poseen a miembros de la nobleza o clérigos',
      'Purificación y sellado de criptas y catacumbas profanadas por nigromantes',
      'Recuperación de reliquias sagradas robadas por cultistas del caos',
      'Caza de liches, vampiros o criaturas de la oscuridad que aterrorizan aldeas'
    ],
    compensation: {
      stipendPerDayGp: 1,
      housingQuality: 'Celdas monacales limpias y silenciosas con comida bendecida y agua bendita.',
      specialBenefit: 'Una vez por semana, el grupo puede solicitar una bendición matutina que otorga 5 PG temporales a cada miembro.'
    },
    missionGeneratorTable: [
      {
        roll: 1,
        title: 'El Santo Sudario Desaparecido',
        prompt: 'Una reliquia que cura la ceguera fue sustraída del relicario de la abadía; los rastros huelen a azufre y ceniza.',
        target: 'Ruinas de la Capilla Desolada',
        defaultRewardGp: 300,
        favorReward: 1
      },
      {
        roll: 2,
        title: 'La Cripta de los Condenados',
        prompt: 'Los muertos de las catacumbas de la catedral arañan las losas y cantan himnos blasfemos; bajar y purificar el osario.',
        target: 'Catacumbas de San Valerio',
        defaultRewardGp: 450,
        favorReward: 2
      },
      {
        roll: 3,
        title: 'Posesión en la Casa del Magistrado',
        prompt: 'La hija del juez municipal habla en lenguas infernales y arroja muebles; someter al demonio y expulsarlo al abismo.',
        target: 'Mansión del Distrito Alto',
        defaultRewardGp: 400,
        favorReward: 1
      },
      {
        roll: 4,
        title: 'El Hereje de los Mil Nombres',
        prompt: 'Un antiguo paladín caído predica la destrucción de los templos y reúne a bandidos en los bosques; capturarlo vivo.',
        target: 'Arboleda de los Ídolos Quebrados',
        defaultRewardGp: 500,
        favorReward: 2
      },
      {
        roll: 5,
        title: 'El Monstruo del Agua Amarga',
        prompt: 'El pozo sagrado de una aldea devota fue corrompido por un engendro del cieno que devora la fe de los lugareños.',
        target: 'Aldea de Fuente Clara',
        defaultRewardGp: 320,
        favorReward: 1
      },
      {
        roll: 6,
        title: 'Escolta del Patriarca Ciego',
        prompt: 'Guiar al anciano obispo a través de un valle infestado de hombres lobo para consagrar un nuevo altar.',
        target: 'Camino de los Lobos Aullantes',
        defaultRewardGp: 480,
        favorReward: 1
      }
    ],
    intriguesTable: [
      {
        roll: 1,
        title: 'Fanatismo de la Escuadra de Purga',
        complication: 'Una partida de templarios fanáticos quiere quemar toda la aldea en lugar de rescatar a los infectados.'
      },
      {
        roll: 2,
        title: 'Duda de Fe',
        complication: 'Se descubre que la supuesta reliquia santa encierra en realidad la esencia de un diablo menor.'
      },
      {
        roll: 3,
        title: 'Inquisición Interna',
        complication: 'Un inspector de la orden acusa a uno de los aventureros de practicar brujería o herejía menor.'
      },
      {
        roll: 4,
        title: 'Pecado Imperdonable',
        complication: 'El objetivo de la misión suplica piedad demostrando que cometió el delito para salvar a sus hijos enfermos.'
      }
    ]
  },

  // -------------------------------------------------------------------------
  // 8. EL CALDERO DE TASHA PARA TODO - SOBERANO / CORONA
  // -------------------------------------------------------------------------
  {
    id: 'tasha_sovereign',
    name: 'El Alto Consejo Real de la Corona',
    type: 'sovereign',
    typeName: 'Soberano & Corte de la Corona',
    sourceBook: 'El Caldero de Tasha',
    tagline: 'El servicio directo al Monarca, la soberanía territorial y la ley del reino.',
    description:
      'El mismísimo trono del reino o imperio. Los aventureros operan como agentes de la corona con cartas de marca oficiales, facultados para actuar por encima de señores locales, desbaratar traiciones y defender las fronteras contra invasiones.',
    badgeColor: '#e11d48', // Rubí real
    perks: [
      {
        title: 'Carta de Marca y Salvoconducto Real',
        desc: 'El grupo porta el sello del Monarca. Las autoridades locales y guardias municipales deben colaborar plenamente bajo pena de alta traición.'
      },
      {
        title: 'Salario y Pensión de la Corona',
        desc: 'Cada personaje recibe un estipendio garantizado de 2 po al día, cobrable en cualquier tesorería real del reino.'
      },
      {
        title: 'Audiencia con el Consejo',
        desc: 'El grupo tiene derecho a solicitar audiencia formal con ministros y cancilleres de la corona en casos de emergencia nacional.'
      }
    ],
    contact: {
      name: 'Canciller Darian Ravenscroft',
      role: 'Guardián del Sello Real y Primer Ministro',
      personality: 'Diplomático impecable, calculador y distante; ve el reino como un tablero de ajedrez donde el bien común prima.',
      secret: 'El verdadero Rey está en coma inducido por veneno y el canciller gobierna usando un doble ilusorio para evitar una guerra civil.',
      contactMethod: 'Envío de emisarios a caballo con la librea de la corona y pergaminos cerrados con sello de oro fundido.'
    },
    assignments: [
      'Protección encubierta de príncipes y princesas herederas fuera del palacio',
      'Desarticulación de conspiraciones de duques rebeldes que planean golpes de estado',
      'Neutralización de espías de imperios fronterizos en la capital',
      'Misiones diplomáticas de alto riesgo en tierras bárbaras o reinos hostiles'
    ],
    compensation: {
      stipendPerDayGp: 2,
      housingQuality: 'Aposentos reales en castillos de la corona o suites privadas en las mejores posadas de la capital.',
      specialBenefit: 'Indulto real de 1 cargo criminal menor por personaje a lo largo de la campaña.'
    },
    missionGeneratorTable: [
      {
        roll: 1,
        title: 'El Príncipe Desaparecido',
        prompt: 'El segundo hijo del monarca escapó del palacio para vivir una aventura y fue visto en una taberna fronteriza.',
        target: 'Ciudad Fronteriza de Roca Alta',
        defaultRewardGp: 400,
        favorReward: 1
      },
      {
        roll: 2,
        title: 'Complot en el Salón del Trono',
        prompt: 'Un cocinero real intentó envenenar las copas del banquete real; rastrear quién pagó las 1.000 monedas de oro por el veneno.',
        target: 'Distrito de los Mercaderes Extranjeros',
        defaultRewardGp: 500,
        favorReward: 2
      },
      {
        roll: 3,
        title: 'La Rebelión del Barón de Hierro',
        prompt: 'Un señor feudal se niega a pagar tributos y ha fortificado su castillo con mercenarios; forzar su rendición.',
        target: 'Fortaleza del Desfiladero de Hierro',
        defaultRewardGp: 650,
        favorReward: 2
      },
      {
        roll: 4,
        title: 'El Tratado de Paz Manchado de Sangre',
        prompt: 'Proteger a los emisarios del imperio vecino durante la firma del armisticio contra fanáticos que buscan la guerra.',
        target: 'Pabellón Neutral de los Valles',
        defaultRewardGp: 550,
        favorReward: 1
      },
      {
        roll: 5,
        title: 'El Tesoro del Galeón Real',
        prompt: 'Un barco que transportaba los impuestos de las colonias naufragó en una costa de arrecifes; recuperar las arcas reales.',
        target: 'Costa de los Naufragios Malditos',
        defaultRewardGp: 600,
        favorReward: 1
      },
      {
        roll: 6,
        title: 'La Cacería del Regicida',
        prompt: 'Un asesino arcano que mató al anterior canciller ha regresado a la ciudad con un nuevo objetivo; darle caza.',
        target: 'Tejados y Campanarios de la Capital',
        defaultRewardGp: 700,
        favorReward: 2
      }
    ],
    intriguesTable: [
      {
        roll: 1,
        title: 'Envidia de la Guardia Real',
        complication: 'El capitán de la Guardia Pretoriana resiente a los aventureros y filtra detalles de su misión para verlos fallar.'
      },
      {
        roll: 2,
        title: 'Giro Político Repentino',
        complication: 'El noble contra el que investigaban es nombrado repentinamente Ministro de Justicia por el Consejo.'
      },
      {
        roll: 3,
        title: 'Prensa Crítica en la Capital',
        complication: 'Panfletos anónimos acusan al grupo de ser mercenarios sanguinarios a sueldo de la tiranía.'
      },
      {
        roll: 4,
        title: 'Trampa Diplomática',
        complication: 'El enemigo capturado posee inmunidad como embajador de ultramar y liberarlo enfurecerá a la corona.'
      }
    ]
  },

  // -------------------------------------------------------------------------
  // 9. EBERRON: SURGIENDO DE LA ÚLTIMA GUERRA - CASAS MARCADAS POR EL DRAGÓN
  // -------------------------------------------------------------------------
  {
    id: 'eberron_dragonmarked_consortium',
    name: 'Consorcio de Casas Marcadas (Cannith, Deneith & Tharashk)',
    type: 'dragonmarked_house',
    typeName: 'Casas Marcadas por el Dragón',
    sourceBook: 'Eberron: Surgiendo de la Última Guerra',
    tagline: 'Monopolios arcanos, artífices de la Marca de la Creación y el poder de Khorvaire.',
    description:
      'Un triunvirato de conveniencia entre la Casa Cannith (creadores de los Forjados y armas mágicas), Casa Deneith (los mayores defensores y mercenarios) y Casa Tharashk (rastreadores y mineros de dragonshard). Emplean aventureros para asegurar tecnología arcana, rescatar artefactos de la Última Guerra y explorar el peligroso Lamento.',
    badgeColor: '#0284c7', // Azul electromágico de Khorvaire
    perks: [
      {
        title: 'Pasaje en el Expreso del Rayo',
        desc: 'El grupo viaja gratis en los vagones de primera clase del Expreso del Rayo operado por la Casa Orien a cuenta del Consorcio.'
      },
      {
        title: 'Talleres de Artificería Cannith',
        desc: 'Acceso a forjas mágicas para reparar objetos, imbuir equipo y adquirir esquemas mágicos con un 25% de descuento.'
      },
      {
        title: 'Rastreadores y Sabuesos de Tharashk',
        desc: 'Ventaja en pruebas de Sabiduría (Supervivencia) para rastrear objetivos en ciudades o tierras salvajes con ayuda de la red de Tharashk.'
      }
    ],
    contact: {
      name: 'Barón D\'Cannith el Mayor',
      role: 'Director de Recuperación de Prototipos de la Última Guerra',
      personality: 'Obsesivo, visionario de la tecnomagia e implacable con los plazos; considera los descubrimientos el único progreso real.',
      secret: 'Oculta en su laboratorio privado una matriz de creación de Forjados operativa, violando el Tratado de Thronehold.',
      contactMethod: 'Terminales de telégrafo Sivis, autómatas mensajeros con discos de voz grabada y citas en torres flotantes de Sharn.'
    },
    assignments: [
      'Expediciones a la Tierra del Lamento (*Mournland*) para recuperar prototipos bélicos',
      'Captura de renegados de las Casas que venden secretos a naciones rivales',
      'Extracción de esquirlas de dragón (*dragonshards*) en zonas de cataclismo',
      'Prueba de campo de armas arcanas y armaduras mecanizadas experimentales'
    ],
    compensation: {
      stipendPerDayGp: 2,
      housingQuality: 'Suites tecnomágicas con calefacción elemental y sirvientes homúnculos en enclaves de las Casas.',
      specialBenefit: 'Un objeto común o infusión de artífice garantizada por cada 2 misiones completadas con éxito.'
    },
    missionGeneratorTable: [
      {
        roll: 1,
        title: 'El Coloso Caído de Cyre',
        prompt: 'Localizar un Coloso Forjado inerte en el Lamento y extraer su batería de esquirlas vivas antes de que se corrompa.',
        target: 'Tierras del Lamento (Borde de Cyre)',
        defaultRewardGp: 500,
        favorReward: 2
      },
      {
        roll: 2,
        title: 'El Sabotaje del Expreso del Rayo',
        prompt: 'Terroristas de la Espada Rompedora colocaron un artefacto en las vías de la ruta Sharn-Wroat; desactivarlo a toda velocidad.',
        target: 'Ruta Ferroviaria de Khorvaire',
        defaultRewardGp: 450,
        favorReward: 1
      },
      {
        roll: 3,
        title: 'Cacería del Asesino de Tharashk',
        prompt: 'Un cazador que portaba la Marca de la Búsqueda vendió información a la nación de Karrnath; capturarlo para juicio de la Casa.',
        target: 'Altos de Sharn (La Ciudad de las Torres)',
        defaultRewardGp: 400,
        favorReward: 1
      },
      {
        roll: 4,
        title: 'La Vena de Siberys en las Cumbres',
        prompt: 'Asegurar un yacimiento de esquirlas de dragón doradas recién descubiertas frente a incursores drows y monstruos salvajes.',
        target: 'Cumbres de Xen\'drik',
        defaultRewardGp: 650,
        favorReward: 2
      },
      {
        roll: 5,
        title: 'El Forjado Despertado',
        prompt: 'Un guerrero Forjado con recuerdos del Día del Lamento busca refugio; escoltarlo al santuario de Cannith antes de que lo desguacen.',
        target: 'Bajos Fondos de Sharn',
        defaultRewardGp: 380,
        favorReward: 1
      },
      {
        roll: 6,
        title: 'Robo en la Bóveda de Kundarak',
        prompt: 'Un ladrón que empleó magia aberrante burló los sellos de la Casa Kundarak; recuperad el plano de motor elemental robado.',
        target: 'Gran Bóveda Subterránea',
        defaultRewardGp: 550,
        favorReward: 1
      }
    ],
    intriguesTable: [
      {
        roll: 1,
        title: 'Interferencia de la Marca Aberrante',
        complication: 'Aparece un grupo con Marcas Aberrantes que afirma que el artefacto es la cura para su dolor.'
      },
      {
        roll: 2,
        title: 'Espías de la Nación de Thrane',
        complication: 'Inquisidores de la Llama Plateada reclaman el objeto por considerarlo una abominación herética.'
      },
      {
        roll: 3,
        title: 'Fallo Elemental',
        complication: 'El motor elemental del transporte entra en sobrecarga y amenaza con estallar a menos que se supere una prueba CD 15.'
      },
      {
        roll: 4,
        title: 'Tratado de Thronehold Quebrantado',
        complication: 'La guardia de la ciudad confisca el equipo alegando que viola los tratados de desarme internacional.'
      }
    ]
  },

  // -------------------------------------------------------------------------
  // 10. EBERRON: SURGIENDO DE LA ÚLTIMA GUERRA - AGENCIA DE ESPIONAJE REAL
  // -------------------------------------------------------------------------
  {
    id: 'eberron_dark_lanterns',
    name: 'Los Faroles Oscuros de Breland',
    type: 'espionage_agency',
    typeName: 'Servicio de Inteligencia & Espías de la Corona',
    sourceBook: 'Eberron: Surgiendo de la Última Guerra',
    tagline: 'Operaciones encubiertas, engaño, guerra psicológica y secretos de estado.',
    description:
      'La división secreta del Servicio de la Corona de Breland. Actúan como espías, asesinos encubiertos y analistas de inteligencia para proteger a la nación contra amenazas exteriores y traiciones de las Cinco Naciones.',
    badgeColor: '#475569', // Gris acero espía
    perks: [
      {
        title: 'Identidades y Tapaderas Oficiales',
        desc: 'Cada aventurero recibe una identidad falsa con documentos oficiales, antecedentes verificables y profesión creíble.'
      },
      {
        title: 'Dispositivos de Espionaje Arcana',
        desc: 'El grupo recibe 1 objeto mágico común o poco común utilitario (por ejemplo, *Poción de Invisibilidad*, *Tinta Oculta* o *Gema de Comprensión de Lenguas*) por misión.'
      },
      {
        title: 'Inmunidad Diplomática Brelish',
        desc: 'Si son arrestados dentro del territorio de Breland o consulados aliados, pueden usar un código secreto para ser liberados de inmediato.'
      }
    ],
    contact: {
      name: 'Capitana Lucinda "Cero"',
      role: 'Coordinadora de Células Durmientes',
      personality: 'Fría, perspicaz, con memoria eidética; nunca repite un punto de encuentro y siempre tiene tres planes de escape.',
      secret: 'Es una cambiante (*changelin*) que ha suplantado a la auténtica capitana desde hace dos años tras su asesinato.',
      contactMethod: 'Buzones muertos en farolas huecas, notas en libros de bibliotecas públicas y mensajes en clave por el telégrafo Sivis.'
    },
    assignments: [
      'Infiltración en fiestas diplomáticas para copiar despachos militares extranjeros',
      'Desarticulación de células terroristas antes de atentados en Sharn o Wroat',
      'Extracción de científicos y artífices desertores de Karrnath o Aundair',
      'Vigilancia y eliminación encubierta de doppelgangers y cambiaformas traidores'
    ],
    compensation: {
      stipendPerDayGp: 2.5,
      housingQuality: 'Pisos francos seguros distribuidos por las principales urbes de Khorvaire.',
      specialBenefit: 'Acceso a la red de archivos secretos de Breland: información clasificada sobre cualquier PNJ o facción enemiga.'
    },
    missionGeneratorTable: [
      {
        roll: 1,
        title: 'Operación Despacho Negro',
        prompt: 'Copiar los planes de movilización del embajador de Karrnath durante la recepción de invierno sin alertar a sus guardias.',
        target: 'Embajada de Karrnath en Wroat',
        defaultRewardGp: 450,
        favorReward: 1
      },
      {
        roll: 2,
        title: 'El Desertor de las Forjas Arcanas',
        prompt: 'Un artífice de Aundair huyó con los planos de una varita de asedio; extraerlo a través de la frontera.',
        target: 'Frontera Norte de Breland',
        defaultRewardGp: 500,
        favorReward: 2
      },
      {
        roll: 3,
        title: 'La Célula Durmiente del Lamento',
        prompt: 'Una célula de soldados de Cyre planea un ataque con gas ponzoñoso en el mercado central de Sharn; neutralizarlos.',
        target: 'Nivel Medio de Sharn',
        defaultRewardGp: 400,
        favorReward: 1
      },
      {
        roll: 4,
        title: 'El Fantasma en el Telégrafo',
        prompt: 'Alguien está interceptando los mensajes cifrados del Rey Boranel en la torre Sivis; descubrir la fuga.',
        target: 'Enclave Sivis de Sharn',
        defaultRewardGp: 380,
        favorReward: 1
      },
      {
        roll: 5,
        title: 'El Intercambio en el Puente Flotante',
        prompt: 'Entregar una maleta con esquirlas de dragón modificadas a un contacto doble en una plataforma suspendedora.',
        target: 'Puentes Superiores de Sharn',
        defaultRewardGp: 420,
        favorReward: 1
      },
      {
        roll: 6,
        title: 'La Trampa de los Mil Rostros',
        prompt: 'Un cambiaformas hostil ha usurpado el puesto de un juez del tribunal real; desenmascararlo en plena sesión.',
        target: 'Corte de Justicia de Wroat',
        defaultRewardGp: 600,
        favorReward: 2
      }
    ],
    intriguesTable: [
      {
        roll: 1,
        title: 'Identidad Comprometida',
        complication: 'La tapadera de un miembro del grupo fue descubierta por un sabueso de Tharashk contratado por el enemigo.'
      },
      {
        roll: 2,
        title: 'Agente Doble',
        complication: 'El informante que facilitó los datos trabaja en realidad para los espías de Aundair.'
      },
      {
        roll: 3,
        title: 'Protocolo de Negación Plausible',
        complication: 'Si el grupo es descubierto, la agencia negará toda vinculación oficial con ellos.'
      },
      {
        roll: 4,
        title: 'Cianuro en el Diente',
        complication: 'El objetivo capturado intenta suicidarse antes de ser interrogado con un veneno oculto.'
      }
    ]
  },

  // -------------------------------------------------------------------------
  // 11. EBERRON: SURGIENDO DE LA ÚLTIMA GUERRA - AGENCIA INQUISITIVA / PRENSA
  // -------------------------------------------------------------------------
  {
    id: 'eberron_korranberg_chronicle',
    name: 'La Crónica de Korranberg',
    type: 'inquisitive_press',
    typeName: 'Agencia Inquisitiva & Prensa de Investigación',
    sourceBook: 'Eberron: Surgiendo de la Última Guerra',
    tagline: 'El periódico más influyente de Khorvaire, primicias, verdad y revelación de escándalos.',
    description:
      'La mayor organización de noticias e investigación de las Cinco Naciones. Emplean a detectives inquisitivos y aventureros para descubrir complots corruptos, fotografiar criaturas míticas y desvelar conspiraciones que los gobiernos y las Casas Marcadas intentan silenciar.',
    badgeColor: '#14b8a6', // Turquesa inquisitivo
    perks: [
      {
        title: 'Pase de Prensa Oficial de Khorvaire',
        desc: 'El grupo cuenta con credenciales de prensa que les permiten entrevistar a sospechosos, entrar en escenas de crímenes y asistir a recepciones de estado.'
      },
      {
        title: 'El Poder de la Opinión Pública',
        desc: 'Tras publicar una primicia exitosa, el grupo gana ventaja en todas las pruebas de Carisma contra ciudadanos de esa urbe durante 1 semana.'
      },
      {
        title: 'Archivos de la Crónica y Despacho Sivis',
        desc: 'Acceso a todas las ediciones pasadas y a la red de teletipos para enviar consultas urgentes a sabios de todo el continente.'
      }
    ],
    contact: {
      name: 'Editor Jefe Brandis d\'Sivis',
      role: 'Director General de Redacción e Información',
      personality: 'Gnomo parlanchín, enérgico, obsesionado con la verdad y las portadas de impacto; nada escapa a su lupa mágica.',
      secret: 'Paga a espías en el palacio real para tener primicias 24 horas antes que el gobierno anuncie sus leyes.',
      contactMethod: 'Despachos por gnomos mensajeros en bicicleta de vapor, salas de redacción bulliciosas y telégrafos de cristal.'
    },
    assignments: [
      'Investigación de crímenes sin resolver en los barrios marginales',
      'Desvelar escándalos de malversación de fondos en gremios o templos',
      'Entrevistar a monstruos o seres míticos pacíficos antes de que sean cazados',
      'Confirmar la autenticidad de ruinas o cataclismos mágicos en zonas aisladas'
    ],
    compensation: {
      stipendPerDayGp: 1.5,
      housingQuality: 'Despachos privados en las sucursales de la Crónica con máquinas de escribir y archivos.',
      specialBenefit: 'Recompensa adicional de +50 po por cada prueba fotográfica o testimonio clave entregado para la portada.'
    },
    missionGeneratorTable: [
      {
        roll: 1,
        title: 'El Escándalo del Barón d\'Medani',
        prompt: 'Comprobar si el jefe de seguridad de la Casa Medani está cobrando sobornos para desviar patrullas de los almacenes.',
        target: 'Bajos Fondos de Wroat',
        defaultRewardGp: 350,
        favorReward: 1
      },
      {
        roll: 2,
        title: 'El Monstruo de la Niebla de Sharn',
        prompt: 'Vecinos de los niveles bajos aseguran haber visto a un dinosaurio con alas espectrales; capturar una prueba visual.',
        target: 'Los Bajos Fondos de Sharn (Los Fondos)',
        defaultRewardGp: 400,
        favorReward: 1
      },
      {
        roll: 3,
        title: 'La Primicia de la Peste Negra',
        prompt: 'Descubrir quién introdujo una enfermedad mágica en el agua del orfanato municipal de la ciudadela.',
        target: 'Distrito de los Hospitales de Jorasco',
        defaultRewardGp: 450,
        favorReward: 2
      },
      {
        roll: 4,
        title: 'La Fuga del Asesino del Zodiaco',
        prompt: 'Un asesino serial de nobles escapó de la prisión de Kundarak; seguir las pistas antes de que vuelva a matar.',
        target: 'Alcantarillas Antiguas de Sharn',
        defaultRewardGp: 500,
        favorReward: 2
      },
      {
        roll: 5,
        title: 'El Fraude de la Mina de Oro',
        prompt: 'Un consorcio está vendiendo acciones de una mina que en realidad está vacía e infestada de trogloditas; destapar el fraude.',
        target: 'Bolsa de Valores de Korranberg',
        defaultRewardGp: 380,
        favorReward: 1
      },
      {
        roll: 6,
        title: 'Entrevista con el Forjado Libertador',
        prompt: 'El Señor de las Espadas (*Lord of Blades*) ha aceptado una entrevista exclusiva; entrar en el Lamento y regresar vivos con el texto.',
        target: 'Corazón del Lamento',
        defaultRewardGp: 650,
        favorReward: 2
      }
    ],
    intriguesTable: [
      {
        roll: 1,
        title: 'Censura del Magistrado',
        complication: 'Un juez emite una orden de mordaza judicial confiscando las notas y negativos del grupo.'
      },
      {
        roll: 2,
        title: 'Prensa Competidora Agresiva',
        complication: 'Periodistas de un tabloide amarillista intentan robar las pruebas del grupo en la escena del crimen.'
      },
      {
        roll: 3,
        title: 'Amenazas de Muerte Anónimas',
        complication: 'El grupo recibe una nota con una bala grabada advirtiéndoles que dejen de escarbar en el caso.'
      },
      {
        roll: 4,
        title: 'Testigo No Fiable',
        complication: 'El testigo principal mintió descaradamente para inculpar a su ex-esposo.'
      }
    ]
  },

  // -------------------------------------------------------------------------
  // 12. DOSSIER DE VECNA - CULTO DEL OJO Y LA MANO
  // -------------------------------------------------------------------------
  {
    id: 'vecna_cult_eye_hand',
    name: 'El Culto del Ojo y la Mano',
    type: 'vecna_cult',
    typeName: 'Culto del Secreto Prohibido & Nigromancia',
    sourceBook: 'Dossier de Vecna',
    tagline: 'Guardianes de secretos inconfesables, reliquias arcanas y el susurro del Dios Mutilado.',
    description:
      'Una sociedad secreta de arcanistas, nigromantes e infiltrados dedicados a la veneración de Vecna, el Señor de los Secretos Podridos. Sus agentes buscan manuscritos prohibidos, fragmentos de liches legendarios y desentierran verdades que harían enloquecer a reyes y dioses.',
    badgeColor: '#a855f7', // Púrpura nigromántico / velo oscuro
    perks: [
      {
        title: 'Ojo de los Secretos Ocultos',
        desc: 'Una vez al día, un miembro del grupo puede lanzar *Detectar Magia* o *Identificar* sin consumir espacios de conjuro ni componentes materiales.'
      },
      {
        title: 'Silencio Sepulcral',
        desc: 'Ventaja en pruebas de Destreza (Sigilo) cuando se mueven entre tumbas, mausoleos, catacumbas o lugares donde ha habido muertes masivas.'
      },
      {
        title: 'Susurro del Ojo de Vecna',
        desc: 'El culto provee pergaminos de conjuros nigrománticos oscuros (hasta nivel 3) y venenos especiales que impiden la resurrección de la víctima durante 24 horas.'
      }
    ],
    contact: {
      name: '"El Silencioso" Oakhaven',
      role: 'Guardián del Códice de las Sombras',
      personality: 'Mago momificado envuelto en gasas de seda oscura; habla mediante susurros telepáticos fríos como el hielo de una tumba.',
      secret: 'Posee un dedo momificado que resuena con la verdadera Mano de Vecna y planea sacrificar a sus propios agentes cuando llegue la conjunción.',
      contactMethod: 'Tinta que sólo se revela a la luz de una vela negra fabricada con grasa humana y medallones de obsidiana grabados con un ojo.'
    },
    assignments: [
      'Robo de páginas y fragmentos del Libro de la Vil Oscuridad custodiados en catedrales solares',
      'Asesinato silencioso de historiadores que han descifrado los rituales de ascensión liche',
      'Desentierro de osarios ancestrales para alimentar de almas a las filacterias de la orden',
      'Infiltración en universidades arcanas para robar esferas de aniquilación y talismanes'
    ],
    compensation: {
      stipendPerDayGp: 2,
      housingQuality: 'Criptas subterráneas suntuosas decoradas con terciopelo negro, braseros de incienso y sirvientes esqueléticos silenciosos.',
      specialBenefit: 'Un pergamino de *Animar a los Muertos* o *Falsa Vida* garantizado mensualmente para los lanzadores de conjuros.'
    },
    missionGeneratorTable: [
      {
        roll: 1,
        title: 'El Fragmento del Códice Podrido',
        prompt: 'Una página del grimorio de Vecna fue expuesta en el museo de una basílica solar; recuperarla antes de que la quemen.',
        target: 'Catedral del Sol Invencible',
        defaultRewardGp: 500,
        favorReward: 2
      },
      {
        roll: 2,
        title: 'La Filacteria del Liche Renegado',
        prompt: 'Un liche menor ha roto su pacto con el Culto; localizar su filacteria oculta en un faro abandonado y traerla al Silencioso.',
        target: 'Faro de las Rocas Negras',
        defaultRewardGp: 600,
        favorReward: 2
      },
      {
        roll: 3,
        title: 'El Ojo de Jade del Faraón Muerto',
        prompt: 'Excavar la tumba de un rey hechicero en el desierto y extraer el amuleto ocular antes de que despierten sus guardianes.',
        target: 'Valle de las Pirámides Olvidadas',
        defaultRewardGp: 450,
        favorReward: 1
      },
      {
        roll: 4,
        title: 'Silenciar al Archivero Real',
        prompt: 'Un sabio de la corte descubrió la identidad de los diez líderes del culto en la capital; eliminarlo y quemar sus cuadernos.',
        target: 'Biblioteca Privada del Palacio',
        defaultRewardGp: 550,
        favorReward: 1
      },
      {
        roll: 5,
        title: 'La Vela de Almas de la Bruja',
        prompt: 'Recuperar un candelabro de bronce que absorbe la última exhalación de los moribundos de la cabaña de una bruja de la ciénaga.',
        target: 'Ciénaga de las Aguas Negras',
        defaultRewardGp: 420,
        favorReward: 1
      },
      {
        roll: 6,
        title: 'El Ritual de la Luna de Sangre',
        prompt: 'Consagrar un círculo de runas con sangre de una bestia mágica en el centro de un bosque durante el eclipse lunar.',
        target: 'Colina de los Sacrificios',
        defaultRewardGp: 650,
        favorReward: 2
      }
    ],
    intriguesTable: [
      {
        roll: 1,
        title: 'Caza de Paladines de la LUZ',
        complication: 'Un escuadrón de paladines sagrados con perros cazadores rastrea el olor a muerte del grupo.'
      },
      {
        roll: 2,
        title: 'Susurros de Locura',
        complication: 'El artefacto susurra mentiras en la mente de un miembro del grupo, obligándole a tirar una salvación de Sabiduría CD 13.'
      },
      {
        roll: 3,
        title: 'Traición en la Cripta',
        complication: 'Los acólitos menores del culto intentan envenenar las raciones del grupo para quedarse con la gloria de la entrega.'
      },
      {
        roll: 4,
        title: 'La Maldición del Ojo de Vecna',
        complication: 'Quien sostenga el objeto sufre una marca necrosada temporal que reduce su Carisma en 1 hasta el próximo descanso largo.'
      }
    ]
  }
];
