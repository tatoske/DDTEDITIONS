import {
  MonsterCultureDef,
  TacticalAiBehavior,
  TacticalWarbandDef,
  LairChamberDef
} from '../types/dnd';

// -------------------------------------------------------------
// 1. CULTURAS Y FACCIONES MONSTRUOSAS CANÓNICAS (VOLO & MORDENKAINEN)
// -------------------------------------------------------------
export const MONSTER_CULTURES: MonsterCultureDef[] = [
  {
    id: 'beholder',
    name: 'Contempladores (Beholders)',
    subTitle: 'Paranoia Solipsista y Sueños que Deforman la Realidad',
    sourceBook: 'Guía de Monstruos de Volo & DMG 2024',
    badgeColor: '#7c3aed',
    loreSummary: 'Un contemplador cree con certeza absoluta que él es el ser perfecto del multiverso y que cualquier otra criatura —incluyendo otros contempladores— conspira secretamente para destruirlo o robar su gloria. Sus sueños vívidos pueden moldear la realidad tangible, engendrando nuevas aberraciones a su imagen.',
    cosmologyAndDeities: 'Rechazan toda deidad por considerarse a sí mismos la cúspide divina, aunque veneran en pesadillas a la Gran Madre, progenitora primigenia que habita en los vacíos astrales.',
    socialHierarchy: [
      { rank: 'Ojo Tirano Supremo', role: 'Soberano Absoluto', description: 'El contemplador patriarca que flota en el pináculo de la guarida, gobernando mediante terror y rayos desintegradores.' },
      { rank: 'Espectadores', role: 'Custodios Arcanos', description: 'Aberraciones invocadas mediante rituales de 4 ojos para custodiar tesoros durante exactamente 101 años.' },
      { rank: 'Gazers (Mirones)', role: 'Sabuesos de Plaga', description: 'Pequeñas criaturas del tamaño de un melón nacidas de los delirios del contemplador, usadas como centinelas voladores.' },
      { rank: 'Esclavos Fascinados', role: 'Carne de Cañón', description: 'Humanoides y trogloditas sometidos mentalmente mediante rayos de encanto permanente o terror absoluto.' }
    ],
    psychologicalTraits: [
      'Paranoia omnidireccional: Asume que cada sombra, sonido o parpadeo es un intento de magnicidio.',
      'Megalomanía artística: Esculpe a sus enemigos derrotados en piedra con su rayo petrificador para exhibirlos como estatuas.',
      'Xenofobia aberrante: Encuentra la anatomía de dos ojos y extremidades bípedas repulsiva y deforme.',
      'Terror al reflejo: Un espejo puede provocarle un ataque de furia homicida al interpretar su propio reflejo como un usurpador rival.'
    ],
    tacticalStyle: 'Combate tridimensional en el aire. Mantiene el Cono Antimagia fijado sobre los lanzadores de conjuros mientras dispara sus 10 rayos oculares desde 36 metros de distancia sobre los guerreros desprovistos de magia defensiva.',
    lairCharacteristics: 'Túneles cilíndricos completamente verticales excavados con rayos desintegradores, carentes de escaleras o asideros. Pozos de brea y cámaras de eco cóncavas para anular el sigilo terrestre.',
    knownWeaknesses: [
      'Punto ciego táctico: Si su cono antimagia está activo, sus propios rayos oculares no funcionan dentro del cono.',
      'Vulnerabilidad al engaño narcisista: Halagar excesivamente su belleza y perfección puede ganar asaltos cruciales de distracción.',
      'Dificultad en pasadizos estrechos de menos de 3 metros de diámetro.'
    ],
    scholarQuote: {
      quote: 'Preguntarle a un contemplador por qué odia al mundo es como preguntarle al fuego por qué quema. No concibe una existencia donde él no sea el centro y tú su ceniza.',
      author: 'Volo, Guía de Monstruos'
    }
  },
  {
    id: 'mindflayer',
    name: 'Azotamentes (Mind Flayers / Ilícidos)',
    subTitle: 'La Red Telepática del Cerebro Anciano y la Ceremorfosis',
    sourceBook: 'Guía de Monstruos de Volo & Monstruos del Multiverso',
    badgeColor: '#0ea5e9',
    loreSummary: 'Náufragos cósmicos de un imperio interdimensional que dominó el futuro, los ilícidos operan en colonias coordinadas por un Cerebro Anciano. Perciben a todas las razas sintientes como mero ganado nutricional y recipientes para la incubación de renacuajos mediante ceremorfosis.',
    cosmologyAndDeities: 'Veneran a Ilsensine, la deidad encarnada del conocimiento psiónico puro y la mente cósmica omnipresente.',
    socialHierarchy: [
      { rank: 'Cerebro Anciano (Elder Brain)', role: 'Núcleo Viviente de la Colonia', description: 'Piscina salina de biomasa cerebral que conecta telepáticamente a todos los ilícidos en un radio de 8 kilómetros.' },
      { rank: 'Azotamentes Arcanistas / Inquisidores', role: 'Comandantes Psiónicos', description: 'Ilícidos superiores especializados en manipulación mental, dominio psiónico y navegación de nautiloides.' },
      { rank: 'Azotamentes Soldados', role: 'Fuerza de Cosecha', description: 'Ejecutores de asalto con tentáculos extractores y conos de Explosión Mental.' },
      { rank: 'Esclavos Thrall (Quaggoths / Grimlocks)', role: 'Tropas de Choque Lobotomizadas', description: 'Criaturas despojadas de voluntad propia mediante cirugías psiónicas, programadas para morir por la colonia.' }
    ],
    psychologicalTraits: [
      'Lógica fría y desprovista de empatía biológica: Todo ser con cerebro es evaluado únicamente por su sabor y valor calórico intelectual.',
      'Miedo visceral a la extinción del imperio: Jamás aceptan un combate hasta la muerte a menos que el Cerebro Anciano esté en peligro directo.',
      'Orgullo psiónico: Consideran la magia arcana tradicional vulgar comparada con la pureza del poder psiónico innato.'
    ],
    tacticalStyle: 'Emboscada psiónica coordinada. Abren con una descarga concentrada de Explosión Mental (salvación de Inteligencia CD 15) para aturdir al grupo completo; inmediatamente sus esclavos fijan a los guerreros mientras los ilícidos extraen los cerebros de los personajes indefensos.',
    lairCharacteristics: 'Cámaras viscosas con arquitectura biomecánica alienígena, canales de líquido cerebroespinal brillante, pozos de larvas ilícidas y muelles de amarre para naves nautiloides.',
    knownWeaknesses: [
      'Dependencia del Cerebro Anciano: Interrumpir la red telepática provoca confusión y desorden táctico en los ilícidos menores.',
      'Aversión al combate cuerpo a cuerpo prolongado: Si los guerreros superan la salvación de Int, la baja CA (15) y PG medios del azotamentes lo fuerzan a huir usando Cambio de Plano.',
      'Vulnerabilidad al daño psíquico concentrado y protección contra aturdimiento.'
    ],
    scholarQuote: {
      quote: 'No temas que un azotamentes te mate rápidamente. Teme la lentitud quirúrgica con la que probará tus recuerdos antes de que tu corazón se detenga.',
      author: 'Mordenkainen'
    }
  },
  {
    id: 'yuanti',
    name: 'Imperio Yuan-ti',
    subTitle: 'Las Castas de Sangre y el Culto al Dios Serpiente',
    sourceBook: 'Guía de Monstruos de Volo',
    badgeColor: '#10b981',
    loreSummary: 'Antaño un imperio humano de refinamiento inigualable, los yuan-ti mutaron sus propios cuerpos mediante rituales caníbales y cruces mágicos con serpientes primigenias para erradicar las emociones humanas, a las que consideran una debilidad biológica.',
    cosmologyAndDeities: 'Rinden tributo a Sseth el Sibilante, Merrshaulk y la devoradora de mundos Dendar la Serpiente Nocturna.',
    socialHierarchy: [
      { rank: 'Yuan-ti Anathema', role: 'Semidioses Monstruosos', description: 'Gigantescas aberraciones de múltiples cabezas de serpiente que lideran las mayores ciudadelas selváticas.' },
      { rank: 'Yuan-ti Abominaciones', role: 'Sumos Sacerdotes y Generales', description: 'Cuerpos enteros de serpiente con torsos humanoides o cabezas serpentinas, dueños de poderosos conjuros rituales.' },
      { rank: 'Yuan-ti Mestizos (Malisons)', role: 'Capitanes y Asesinos', description: 'Combinación variable de extremidades humanas y rasgos de cobra o víbora constrictora.' },
      { rank: 'Yuan-ti Puros (Purebloods)', role: 'Espías e Infiltradores', description: 'Humanoides casi indistinguibles de los humanos comunes salvo por pupilas rasgadas o escamas bajo la piel.' }
    ],
    psychologicalTraits: [
      'Emoción cero: Incapaces de sentir ira, piedad o amor. Actúan por puro cálculo pragmático a largo plazo.',
      'Paciencia milenaria: Sus conspiraciones para derrocar reinos vecinos pueden desarrollarse a lo largo de varias generaciones.',
      'Fascinación por el veneno: Emplean toxinas tanto en armas como en copas ceremoniales de hospitalidad diplomática.'
    ],
    tacticalStyle: 'Ataque con ventaja desde fosas ocultas o enramadas. Los Puros envenenan suministros y abren puertas desde adentro, mientras los Mestizos constriñen y las Abominaciones desatan Sugestión y Miedo con Resistencia Mágica innata.',
    lairCharacteristics: 'Pirámides zikkurat ocultas bajo junglas impenetrables, pisos repletos de fosas de cobras vivas (inmunes a su veneno), trampas de agujas ponzoñosas y conductos estrechos para reptar.',
    knownWeaknesses: [
      'Incapacidad para comprender la devoción emocional o los lazos de lealtad heroica de los aventureros.',
      'Susceptibilidad al daño por frío (sangre fría natural que aletarga sus movimientos).',
      'Desprecio fatal hacia los humanoides no modificados, a quienes subestiman sistemáticamente.'
    ],
    scholarQuote: {
      quote: 'Una víbora no te muerde por odio, sino porque eres carne y ella tiene veneno. Los yuan-ti son peores: han elevado esa indiferencia a la categoría de religión imperial.',
      author: 'Elminster de Valle de las Sombras'
    }
  },
  {
    id: 'hags',
    name: 'Aquelarres de Brujas (Hags & Covens)',
    subTitle: 'Magia Compartida de Aquelarre y Trueques de Almas',
    sourceBook: 'Guía de Monstruos de Volo',
    badgeColor: '#ec4899',
    loreSummary: 'Seres feéricos y corruptores que encarnan la fealdad moral y espiritual. Cuando tres brujas se unen forman un Aquelarre (Coven), multiplicando exponencialmente su poder arcano para lanzar hechizos compartidos de hasta nivel 6.',
    cosmologyAndDeities: 'Rinden tributo a Cegilune, deidad lunar de las hechiceras nocturnas, y a las cortes feéricas más tenebrosas de la Niebla y el Ocaso.',
    socialHierarchy: [
      { rank: 'Bruja de la Noche (Night Hag)', role: 'Patriarca del Aquelarre', description: 'Infecciona los sueños de los justos para cosechar almas corruptas en sacos de piel para venderlas en Hades.' },
      { rank: 'Bruja Bheur / Annis', role: 'Brazo Ejecutor Brutal', description: 'Criaturas de frío glacial o fuerza titánica que devoran carne infantil y rompen huesos con facilidad.' },
      { rank: 'Bruja Verde / del Mar', role: 'Ilusionista y Manipuladora', description: 'Maestras del engaño acústico, la niebla ilusoria y la mirada de la desesperación que causa parálisis cardíaca.' }
    ],
    psychologicalTraits: [
      'Obsesión por la corrupción moral: Prefieren que un paladín cometa un acto atroz voluntario antes que matarlo.',
      'Pactos con doble filo: Siempre ofrecen soluciones mágicas con un precio horrendo e insospechado.',
      'Envidia destructiva hacia todo lo bello, inocente o puro en el mundo mortal.'
    ],
    tacticalStyle: 'Mantienen siempre un radio de 9 metros entre las tres para canalizar conjuros de aquelarre (Rayo Relampagueante, Metamorfosis, Contraconguro). Si una cae, el aquelarre se rompe y las supervivientes huyen en su Ojo Fisgón o al plano etéreo.',
    lairCharacteristics: 'Cabañas sobre patas de ave en ciénagas pantanosas, calderos humeantes con restos de inocentes, espejos parlantes atados a demonios y fetiches de espinas colgados de sauces llorones.',
    knownWeaknesses: [
      'Ruptura del Aquelarre: Si una de las tres brujas queda inconsciente o separada a más de 9 metros, pierden el acceso instantáneo a los hechizos de nivel superior.',
      'Vanidad y rivalidad oculta entre las hermanas: Con habilidad social es posible sembrar discordia entre ellas.',
      'El Ojo del Aquelarre: Si los aventureros localizan y destruyen su gema mágica compartida, las tres brujas quedan ciegas durante 24 horas y reciben 3d10 de daño psíquico.'
    ],
    scholarQuote: {
      quote: 'Nunca aceptes un pastel de una anciana sonriente en medio de una marisma donde ni los pájaros se atreven a cantar.',
      author: 'Guía de Aventuras de la Costa de la Espada'
    }
  },
  {
    id: 'goblinoid',
    name: 'La Hueste de Maglubiyet (Goblinoides)',
    subTitle: 'Disciplina Marcial Hobgoblin, Sigilo Bugbear y Hordas Trasgas',
    sourceBook: 'Guía de Monstruos de Volo & Manual de Monstruos 2024',
    badgeColor: '#f97316',
    loreSummary: 'Maglubiyet, el Señor de las Profundidades, unificó a trasgos, osgos y hobgoblins en una pirámide militar implacable. Cada casta cumple una función bélica estricta: los goblins son el enjambre de desgaste, los bugbears los asesinos de la noche y los hobgoblins los generales estrategas.',
    cosmologyAndDeities: 'Adoran a Maglubiyet con sangre enemiga, respetando también a Nomog-Geaya (dios hobgoblin del honor marcial) y Hruggek (dios bugbear de la emboscada).',
    socialHierarchy: [
      { rank: 'Señor de la Guerra Hobgoblin', role: 'Comandante Supremo', description: 'Estratega veterano con armadura de placas que dirige las formaciones y coordina las armas de asedio.' },
      { rank: 'Devastador Arcano Hobgoblin', role: 'Artillería de Guerra Arcana', description: 'Hechicero de batalla que bombardea con bolas de fuego esculpidas para no herir a sus tropas.' },
      { rank: 'Jefe Bugbear (Osgo)', role: 'Capitán de Fuerzas Especiales', description: 'Asesino gigantesco que lidera incursiones nocturnas de degüello silencioso.' },
      { rank: 'Jinete de Huargos Goblin', role: 'Caballería Ligera y Hostigadores', description: 'Exploradores rápidos que desgastan las líneas enemigas con flechas envenenadas.' },
      { rank: 'Plebe Trasga', role: 'Carne de Cañón y Tramperos', description: 'Masa de choque obligada a cruzar campos minados para activar las defensas enemigas.' }
    ],
    psychologicalTraits: [
      'Disciplina espartana en hobgoblins: Consideran el desorden y la cobardía crímenes castigados con la ejecución inmediata.',
      'Crueldad pragmática: No toman prisioneros a menos que puedan servir como mano de obra esclava o moneda de cambio militar.',
      'Miedo absoluto al dios Maglubiyet: Prefieren morir en batalla que enfrentarse a la deshonra eterna en el Aqueronte.'
    ],
    tacticalStyle: 'Ventaja Marcial (+2d6 de daño si un aliado está a 1.5 m del objetivo). Los hobgoblins cierran filas hombro con hombro con escudos torre mientras los devastadores lanzan conjuros de área y los bugbears flanquean por la retaguardia.',
    lairCharacteristics: 'Fortalezas de piedra fortificadas con fosos de estacas, aspilleras para arqueros, empalizadas dobles, perreras de huargos entrenados y rutas de escape camufladas.',
    knownWeaknesses: [
      'Rigidez táctica: Si los aventureros eliminan al Señor de la Guerra o capitán hobgoblin, los goblins rompen filas presos del pánico y los bugbears huyen por su cuenta.',
      'Desprecio inter-especie: Los hobgoblins maltratan a los goblins; incitar una rebelión interna es factible si se ofrece libertad a los trasgos.',
      'Vulnerabilidad a los ataques sorpresa que anulen su formación de falange.'
    ],
    scholarQuote: {
      quote: 'Un trasgo solo es una plaga molesta. Cien trasgos con un comandante hobgoblin detrás son una máquina de picar ejércitos.',
      author: 'Capitán de la Guardia de Aguasprofundas'
    }
  },
  {
    id: 'orcs',
    name: 'Tribus del Ojo de Gruumsh (Orcos)',
    subTitle: 'Furia Imparable, la Sangre de Luthic y la Peste de Yurtrus',
    sourceBook: 'Guía de Monstruos de Volo',
    badgeColor: '#dc2626',
    loreSummary: 'Bendecidos con la furia divina del dios tuerto Gruumsh, los orcos consideran que el mundo entero les fue robado por elfos y humanos. Su sociedad tribal se divide entre los guerreros de asalto, las videntes de las cavernas y los siniestros sacerdotes mudos de la peste.',
    cosmologyAndDeities: 'El panteón del Ojo Sangrante: Gruumsh (el destructor supremo), Ilneval (la espada de la horda), Bahgtru (la fuerza bruta), Luthic (madre de las cavernas) y Yurtrus el Silencioso (dios de la plaga).',
    socialHierarchy: [
      { rank: 'Caudillo de la Guerra (War Chief)', role: 'Líder Tribal', description: 'El guerrero más sanguinario y fuerte de la tribu, bendecido con la Furia de Gruumsh (+1d8 daño).' },
      { rank: 'Ojo de Gruumsh', role: 'Sumo Chamán Fanático', description: 'Sacerdotes tuertos que se arrancan su propio ojo derecho para canalizar visiones de conquista y conjuros de guerra.' },
      { rank: 'Garras de Luthic', role: 'Protectoras del Hogar', description: 'Sacerdotisas con garras de oso que curan a los caídos y defienden a las crías en las cavernas más profundas.' },
      { rank: 'Mano de Yurtrus', role: 'Invocador de Plagas', description: 'Monjes cadavéricos y silenciosos que caminan entre los leprosos esparciendo la Podredumbre de Carne.' },
      { rank: 'Guerreros de Asalto', role: 'Infantería Pesada', description: 'Bárbaros con hachas dobles que cargan a doble velocidad con el rasgo Agresivo.' }
    ],
    psychologicalTraits: [
      'Devoción a la gloria marcial: Morir viejo en una cama se considera la mayor de las maldiciones tribales.',
      'Furia incontenible: Ante el dolor o heridas graves, su resistencia implacable los mantiene en pie con 1 PG en vez de caer.',
      'Rencor milenario contra los elfos debido a la mutilación del ojo de Gruumsh por Corellon Larethian.'
    ],
    tacticalStyle: 'Carga frontal implacable usando la acción adicional para moverse hasta su velocidad hacia un enemigo (Agresivo). Buscan envolver al enemigo en cuerpo a cuerpo caótico para negar el uso de armas a distancia y magia de área.',
    lairCharacteristics: 'Cavernas naturales fortificadas con barricadas de troncos toscos, hogueras gigantes alimentadas con grasa de bestias, pozos de ofrendas ensangrentados y cavernas ocultas de incubación.',
    knownWeaknesses: [
      'Provocación fácil: Un desafío público al orgullo del líder tribal lo obliga a combatir en duelo singular sin el apoyo de su guardia.',
      'Poca disciplina defensiva: Carecen de formaciones organizadas; caen con frecuencia en emboscadas preparadas con terreno difícil.',
      'Terror reverencial a las señales divinas de Yurtrus (plagas incontroladas que pueden diezmar su propio campamento).'
    ],
    scholarQuote: {
      quote: 'Cuando un orco ruge hacia ti, no está pensando en sobrevivir. Está pensando en que su dios está mirando desde el cosmos y no tolerará un golpe cobarde.',
      author: 'Drizzt Do\'Urden'
    }
  },
  {
    id: 'giants',
    name: 'Gigantes y la Jerarquía de la Ordenación (The Ordning)',
    subTitle: 'La Escala Social Divina de Annam y el Poder Rúnico',
    sourceBook: 'Guía de Monstruos de Volo',
    badgeColor: '#2563eb',
    loreSummary: 'La sociedad de los gigantes no se rige por leyes mortales, sino por la Ordenación (The Ordning): un decreto cósmico inmutable del dios padre Annam que establece el rango exacto de cada raza de gigante y de cada individuo dentro de su especie.',
    cosmologyAndDeities: 'Annam el Padre de Todos, junto a sus hijos divinos Stronmaus (tormenta), Memnor (nube), Thrym (escarcha), Surtur (fuego), Skoraeus (piedra) y Grolantor (colina).',
    socialHierarchy: [
      { rank: 'Gigantes de la Tormenta (CR 13)', role: 'Profetas del Mar y el Cielo', description: 'Sabios aristócratas que habitan en ciudadelas submarinas o nubes flotantes leyendo presagios cósmicos.' },
      { rank: 'Gigantes de las Nubes (CR 9)', role: 'Magnates y Coleccionistas', description: 'Hedonistas extravagantes que compiten acumulando riquezas mágicas en castillos entre las nubes.' },
      { rank: 'Gigantes de Fuego (CR 9)', role: 'Maestros Herreros y Estrategas', description: 'Forjadores militares implacables que crean armas titánicas en las profundidades de volcanes activos.' },
      { rank: 'Gigantes de Escarcha (CR 8)', role: 'Jarls y Conquistadores del Hielo', description: 'Bárbaros glaciares que miden la posición social únicamente por la fuerza muscular y trofeos de caza.' },
      { rank: 'Gigantes de Piedra (CR 7)', role: 'Ermitaños y Escultores Místicos', description: 'Contemplativos que consideran el mundo exterior un sueño y el mundo subterráneo la única realidad tangible.' },
      { rank: 'Gigantes de la Colina (CR 5)', role: 'Glotones Primitivos', description: 'La casta más baja; miden la valía según la cantidad de comida que un gigante puede engullir en un día.' }
    ],
    psychologicalTraits: [
      'Orgullo ancestral: Consideran a los humanoides "pequeñuelos" insignificantes, comparables a insectos o roedores.',
      'Respeto absoluto a la Ordenación: Un gigante de la colina jamás osará dar una orden a un gigante de piedra o de fuego.',
      'Magia rúnica ancestral grabada en sus armas, armaduras y pilares sagrados.'
    ],
    tacticalStyle: 'Bombardeo de rocas colosales a distancia (hasta 72 metros) con 4d10 de daño contundente antes de trabarse en combate cuerpo a cuerpo donde pisotean y barren líneas enteras con sus garrotes y espadones.',
    lairCharacteristics: 'Construcciones ciclópeas con techos de 15 metros de altura, escalones de 1 metro y medio, calderas colosales, fosas de caza y pilares monolíticos con runas mágicas.',
    knownWeaknesses: [
      'Lentitud de reflejos frente a enemigos ágiles (salvaciones de Destreza bajas en gigantes pesados).',
      'Terreno estrecho: No pueden entrar en pasillos de tamaño mediano o pequeño sin agacharse o quedar restringidos.',
      'Ceguera frente a trucos arcanos sutiles (ilusiones y hechizos mentales en gigantes de la colina o de escarcha).'
    ],
    scholarQuote: {
      quote: 'No discutas con un gigante sobre justicia. Para un ser que mide siete metros, la justicia es simplemente la distancia a la que puede arrojar un peñasco.',
      author: 'Mordenkainen'
    }
  },
  {
    id: 'bloodwar',
    name: 'La Guerra de la Sangre (The Blood War)',
    subTitle: 'El Choque Eterno: Demonios del Abismo vs Diablos de los Nueve Infiernos',
    sourceBook: 'Mordenkainen: El Tomo de los Foes',
    badgeColor: '#b91c1c',
    loreSummary: 'La contienda cósmica que evita que el multiverso sea consumido. En las orillas del río Estigia, el Caos encarnado de los Demonios abisales choca sin fin contra el Orden tiránico de las legiones infernales de Diablos comandadas por Asmodeus.',
    cosmologyAndDeities: 'Señores del Abismo (Orcus, Demogorgon, Yeenoghu, Baphomet, Juiblex) contra los Archiduques de los Nueve Infiernos (Asmodeus, Zariel, Mephistopheles, Baalzebul, Dispater).',
    socialHierarchy: [
      { rank: 'Archiduques / Señores del Abismo', role: 'Gobernantes de Planos Infinitos', description: 'Entidades casi divinas con poder cósmico que comandan billones de soldados infernales.' },
      { rank: 'Generales (Pit Fiends / Balors)', role: 'Comandantes de Frente de Guerra', description: 'Colosos alados con látigos de fuego o espadas vorpales que lideran legiones en el Averno.' },
      { rank: 'Oficiales de Choque (Diablo Barbado / Vrock / Hezrou)', role: 'Fuerza de Rompimiento', description: 'Tropas veteranas que causan heridas hemorrágicas con gujas infernales o esporas tóxicas.' },
      { rank: 'Enjambre y Carne de Cañón (Dretchs / Lemures)', role: 'La Marea Infinita', description: 'Almas condenadas retorcidas que avanzan como carne de trinchera para saturar las defensas enemigas.' }
    ],
    psychologicalTraits: [
      'Demonios: Voracidad destructiva pura, carentes de estrategia a largo plazo, luchan por el placer del canibalismo y el caos.',
      'Diablos: Jerarquía inflexible, respeto absoluto a la letra de los contratos de almas, disciplina marcial calculada.',
      'Odio visceral mutuo: Un demonio y un diablo jamás cooperarán de buena fe; se destruirán mutuamente antes de prestar atención a un mortal.'
    ],
    tacticalStyle: 'Los Diablos usan falanges con lanzas barbadas y magia de fuego concentrada resistiendo al frente; los Demonios desatan avalanchas desordenadas de garras, esporas corruptoras y teletransportación caótica.',
    lairCharacteristics: 'Tierras baldías de basalto negro, ríos de lava y aguas amnésicas del Estigia, restos de máquinas de guerra infernales del Averno y torres de hierro con pinchos.',
    knownWeaknesses: [
      'Vulnerabilidad al daño radiante y armas consagradas por deidades benévolas.',
      'Demonios: Vulnerables a trampas de telequinesis y destierro por su falta de disciplina.',
      'Diablos: Quedan atados por la letra exacta de sus juramentos y contratos escritos en sangre.'
    ],
    scholarQuote: {
      quote: 'Si los diablos ganan la Guerra de la Sangre, el multiverso será una prisión de hierro eterno. Si los demonios ganan, será un matadero silencioso. Reza para que nunca termine.',
      author: 'Mordenkainen'
    }
  }
];

// -------------------------------------------------------------
// 2. ROLES TÁCTICOS OFICIALES E INTELIGENCIA DE COMBATE (AI)
// -------------------------------------------------------------
export const TACTICAL_AI_ROLES: Record<string, TacticalAiBehavior> = {
  brute: {
    role: 'brute',
    roleName: 'Bruto (Tanque de Choque)',
    roleIcon: 'Shield',
    primaryDirective: 'Absorber castigo, fijar a los aventureros más resistentes e impedir que alcancen a los aliados más frágiles.',
    targetPriority: [
      'El aventurero más cercano cuerpo a cuerpo (guerrero, paladín o bárbaro).',
      'Cualquier enemigo que intente pasar hacia la retaguardia de los tiradores aliados.',
      'Blancos con armadura pesada a los que pueda derribar o empujar.'
    ],
    combatPhases: {
      opening: 'Carga frontal con bramidos, buscando trabar a dos o más enemigos en su zona de amenaza (1.5 a 3 metros).',
      midBattle: 'Uso repetido de Ataque Múltiple y maniobras de presa o derribo para otorgar ventaja a sus aliados.',
      criticalOrRetreat: 'Rara vez huye si sus compañeros siguen luchando. Si cae bajo el 25% de PG, realiza un último golpe temerario antes de evaluar retirada.'
    },
    preferredCover: 'Ninguna; prefiere usar su propia masa corporal como cobertura para sus aliados detrás.',
    moraleBreakingPoint: 'Se retira o desbanda si su vida cae a menos del 15% o si todos sus aliados con roles de mando han muerto.'
  },
  skirmisher: {
    role: 'skirmisher',
    roleName: 'Hostigador (Golpear y Correr)',
    roleIcon: 'Zap',
    primaryDirective: 'Maximizar el movimiento para atacar objetivos vulnerables sin quedar trabado en combate cuerpo a cuerpo.',
    targetPriority: [
      'Lanzadores de conjuros que mantienen concentración activa.',
      'Personajes heridos que se encuentren aislados de su grupo.',
      'Arqueros o tiradores con baja CA.'
    ],
    combatPhases: {
      opening: 'Rodea por los flancos utilizando terreno difícil a su favor o habilidades de trepar/saltar.',
      midBattle: 'Ataque y retirada inmediata (acción de Destrabarse o movimiento bonus sin provocar ataques de oportunidad).',
      criticalOrRetreat: 'Si su vida cae bajo el 50%, abandona el frente inmediatamente y busca cobertura total para preparar una emboscada de escape.'
    },
    preferredCover: 'Media cobertura (+2 CA) entre asaltos o escondites tras pilares y vegetación densa.',
    moraleBreakingPoint: 'Se retira inmediatamente si recibe un impacto crítico o si sus puntos de golpe caen por debajo del 40%.'
  },
  artillery: {
    role: 'artillery',
    roleName: 'Artillería (Daño a Distancia y Conjuros de Área)',
    roleIcon: 'Target',
    primaryDirective: 'Infligir el máximo daño desde la distancia más segura posible, protegido por brutos o terreno elevado.',
    targetPriority: [
      'Grupos concentrados de aventureros para maximizar el área de efecto de conjuros (Bolas de Fuego, etc.).',
      'Sanadores o clérigos que reviven a aventureros caídos.',
      'Lanzadores de conjuros arcanos desprovistos de armadura.'
    ],
    combatPhases: {
      opening: 'Apertura con su habilidad de área más devastadora o conjuro de control de masas desde más de 18 metros.',
      midBattle: 'Disparos continuos con cobertura de 3/4 (+5 a CA y tiradas de salvación de Destreza).',
      criticalOrRetreat: 'Si un enemigo logra trabarse cuerpo a cuerpo con él, gasta su turno completo en Destrabarse, Niebla Brumosa o teletransporte.'
    },
    preferredCover: 'Cobertura de tres cuartos (+5 CA) o aspilleras de piedra en alturas inalcanzables a pie.',
    moraleBreakingPoint: 'Huye en cuanto un atacante de melé potente logra franquear la barrera de tanques y amenazarlo directamente.'
  },
  leader: {
    role: 'leader',
    roleName: 'Comandante / Controlador',
    roleIcon: 'Crown',
    primaryDirective: 'Multiplicar la eficacia de sus subordinados mediante auras, órdenes de ataque extra y conjuros de control de masas.',
    targetPriority: [
      'El aventurero más peligroso o con mayor iniciativa (para neutralizarlo con Hechizo, Miedo o Parálisis).',
      'Coordinar a sus esbirros para concentrar todo el fuego sobre un único objetivo hasta abatirlo.',
      'Mantenerse a salvo a media distancia (6 a 9 metros) de sus tropas.'
    ],
    combatPhases: {
      opening: 'Lanza bufos a sus tropas o desata una habilidad de desmoralización sobre los héroes.',
      midBattle: 'Usa reacciones y acciones legendarias para otorgar ataques adicionales a los brutos aliados.',
      criticalOrRetreat: 'Si la batalla se vuelve insostenible, ordena retirada general de forma ordenada o sacrifica a sus siervos como escudo de escape.'
    },
    preferredCover: 'Protección directa de 2 o más guardaespaldas brutos que absorben impactos.',
    moraleBreakingPoint: 'Evalúa la moral de toda la banda: si más del 50% de sus tropas caen, ordena retirada táctica.'
  },
  ambusher: {
    role: 'ambusher',
    roleName: 'Emboscador (Asesino de Sombras)',
    roleIcon: 'Ghost',
    primaryDirective: 'Lograr sorpresa total en el primer asalto para abatir al objetivo más débil con daño masivo multiplicado.',
    targetPriority: [
      'El personaje con menor Constitución o armadura más ligera (pícaro, mago, bardo).',
      'Aventureros rezagados que caminan al final de la formación de marcha.',
      'El portador de la fuente de luz o antorcha para sumir al grupo en la oscuridad.'
    ],
    combatPhases: {
      opening: 'Ataque con ventaja desde el sigilo aplicando venenos de lesión y daño adicional por sorpresa.',
      midBattle: 'Si no logra eliminar a su presa en 2 asaltos, usa bombas de humo o acción de Esconderse para reposicionarse.',
      criticalOrRetreat: 'Nunca combate en una lucha prolongada y justa. Se desvanece en pasajes secretos a la primera señal de resistencia dura.'
    },
    preferredCover: 'Sombras completas, techos de cuevas o trampillas falsas.',
    moraleBreakingPoint: 'Huye tan pronto como pierde la ventaja del sigilo o recibe cualquier daño sustancial.'
  }
};

// -------------------------------------------------------------
// 3. ESCUADRONES TÁCTICOS TEMÁTICOS (WARBANDS PARA EL ENCOUNTER TRACKER)
// -------------------------------------------------------------
export const TACTICAL_WARBANDS: TacticalWarbandDef[] = [
  {
    id: 'hobgoblin_patrol',
    name: 'Falange de Vanguardia Hobgoblin',
    faction: 'goblinoid',
    factionName: 'La Hueste de Maglubiyet',
    description: 'Una escuadra militar con disciplina de hierro. El capitán dirige la línea de choque mientras los arqueros disparan desde cobertura y los trasgos sirven de hostigamiento caótico.',
    partyLevelTarget: 'Nivel 3 - 5',
    totalCreatures: 6,
    rawXp: 850,
    adjustedXp: 1700,
    difficultyRating: 'Media',
    battlefieldRoleOverview: '1 Líder comandante, 2 Brutos con escudos entrelazados, 1 Artillero devastador y 2 Hostigadores goblin.',
    monsters: [
      {
        monsterId: 'hobgoblin_captain',
        name: 'Capitán Hobgoblin',
        cr: '3',
        xp: 700,
        quantity: 1,
        tacticalRole: 'leader',
        tacticalNote: 'Usa Liderazgo (+1d4 a ataques y salvaciones de aliados cercanos) y Ventaja Marcial (+2d6 daño).',
        size: 'Mediano',
        type: 'Humanoide (Goblin)',
        hp: 39,
        ac: 17,
        speed: '9 metros',
        attackBonus: 5,
        damageDice: '1d8 + 3',
        damageType: 'Cortante'
      },
      {
        monsterId: 'hobgoblin_soldier',
        name: 'Soldados Hobgoblin',
        cr: '1/2',
        xp: 100,
        quantity: 2,
        tacticalRole: 'brute',
        tacticalNote: 'Forman pared de escudos. Activan Ventaja Marcial si están adyacentes a un aliado.',
        size: 'Mediano',
        type: 'Humanoide (Goblin)',
        hp: 18,
        ac: 18,
        speed: '9 metros',
        attackBonus: 3,
        damageDice: '1d8 + 1',
        damageType: 'Cortante'
      },
      {
        monsterId: 'goblin_skirmisher',
        name: 'Goblins Hostigadores',
        cr: '1/4',
        xp: 50,
        quantity: 2,
        tacticalRole: 'skirmisher',
        tacticalNote: 'Disparan arcos cortos y usan Escapada Ágil para esconderse en cada turno.',
        size: 'Pequeño',
        type: 'Humanoide (Goblin)',
        hp: 7,
        ac: 15,
        speed: '9 metros',
        attackBonus: 4,
        damageDice: '1d6 + 2',
        damageType: 'Perforante'
      },
      {
        monsterId: 'goblin_wolf',
        name: 'Lobo de Rastreo Hobgoblin',
        cr: '1/4',
        xp: 50,
        quantity: 1,
        tacticalRole: 'brute',
        tacticalNote: 'Táctica de Manada (ventaja si hay aliado cerca) y derriba a la presa con salvación de Fuerza CD 11.',
        size: 'Mediano',
        type: 'Bestia',
        hp: 11,
        ac: 13,
        speed: '12 metros',
        attackBonus: 4,
        damageDice: '2d4 + 2',
        damageType: 'Perforante'
      }
    ]
  },
  {
    id: 'mindflayer_harvest',
    name: 'Incursión de Extracción Ilícida',
    faction: 'mindflayer',
    factionName: 'Azotamentes (Mind Flayers)',
    description: 'Un destacamento de caza del Cerebro Anciano enviado a la superficie para capturar especímenes con cerebros de alto intelecto.',
    partyLevelTarget: 'Nivel 7 - 9',
    totalCreatures: 4,
    rawXp: 5900,
    adjustedXp: 11800,
    difficultyRating: 'Difícil',
    battlefieldRoleOverview: '1 Líder psiónico ilícito, 2 Brutos quaggoths esclavizados y 1 Acechador devorador de intelecto.',
    monsters: [
      {
        monsterId: 'mind_flayer_core',
        name: 'Azotamentes Inquisidor',
        cr: '7',
        xp: 2900,
        quantity: 1,
        tacticalRole: 'leader',
        tacticalNote: 'Abre con Explosión Mental (cono 18 m, 4d8 psíquico y Aturdido CD 15 Int). Extrae cerebro de objetivos aturdidos (10d10).',
        size: 'Mediano',
        type: 'Aberración',
        hp: 71,
        ac: 15,
        speed: '9 metros',
        attackBonus: 7,
        damageDice: '2d10 + 4',
        damageType: 'Psíquico'
      },
      {
        monsterId: 'quaggoth_thrall',
        name: 'Quaggoths Esclavizados',
        cr: '2',
        xp: 450,
        quantity: 2,
        tacticalRole: 'brute',
        tacticalNote: 'Furia de Sangre cuando bajan de 15 PG (ventaja en ataques y daño extra). Inmunes al veneno.',
        size: 'Mediano',
        type: 'Monstruosidad',
        hp: 45,
        ac: 13,
        speed: '9 metros, escalar 9 m',
        attackBonus: 5,
        damageDice: '2d6 + 3',
        damageType: 'Cortante'
      },
      {
        monsterId: 'intellect_devourer',
        name: 'Devorador de Intelecto',
        cr: '2',
        xp: 450,
        quantity: 1,
        tacticalRole: 'ambusher',
        tacticalNote: 'Drena Inteligencia con prueba enfrentada y consume el cerebro para apoderarse del cuerpo.',
        size: 'Diminuto',
        type: 'Aberración',
        hp: 21,
        ac: 12,
        speed: '12 metros',
        attackBonus: 4,
        damageDice: '2d6',
        damageType: 'Psíquico'
      }
    ]
  },
  {
    id: 'coven_of_the_mire',
    name: 'Aquelarre del Cenagal Brumoso',
    faction: 'hags',
    factionName: 'Aquelarre de Brujas',
    description: 'Tres brujas hermanadas que comparten una reserva mágica de conjuros devastadores. Operan en perfecta coordinación siniestra.',
    partyLevelTarget: 'Nivel 6 - 8',
    totalCreatures: 3,
    rawXp: 4600,
    adjustedXp: 9200,
    difficultyRating: 'Difícil',
    battlefieldRoleOverview: '3 Conjuradoras de aquelarre con ranuras de conjuro compartidas (Rayo Relampagueante, Metamorfosis, Contraconguro).',
    monsters: [
      {
        monsterId: 'green_hag_elder',
        name: 'Bruja Verde Anciana',
        cr: '3',
        xp: 700,
        quantity: 1,
        tacticalRole: 'leader',
        tacticalNote: 'Invisibilidad innata y mimetismo sonoro para atraer a víctimas aisladas a la trampa.',
        size: 'Mediano',
        type: 'Feérico',
        hp: 82,
        ac: 17,
        speed: '9 metros',
        attackBonus: 6,
        damageDice: '2d8 + 4',
        damageType: 'Cortante'
      },
      {
        monsterId: 'night_hag_coven',
        name: 'Bruja de la Noche',
        cr: '5',
        xp: 1800,
        quantity: 1,
        tacticalRole: 'artillery',
        tacticalNote: 'Portadora del Ojo del Aquelarre. Cambia de forma y drena vigor en el plano etéreo.',
        size: 'Mediano',
        type: 'Infernal',
        hp: 112,
        ac: 17,
        speed: '9 metros',
        attackBonus: 7,
        damageDice: '2d8 + 4',
        damageType: 'Cortante'
      },
      {
        monsterId: 'sea_hag_coven',
        name: 'Bruja del Mar',
        cr: '2',
        xp: 450,
        quantity: 1,
        tacticalRole: 'skirmisher',
        tacticalNote: 'Mirada Mortal: Si una criatura asustada falla una salvación de Sabiduría CD 11, cae a 0 PG.',
        size: 'Mediano',
        type: 'Feérico',
        hp: 52,
        ac: 14,
        speed: '9 m, nadar 12 m',
        attackBonus: 5,
        damageDice: '2d6 + 3',
        damageType: 'Cortante'
      }
    ]
  },
  {
    id: 'orc_warband_yurtrus',
    name: 'Partida de Asalto de la Mano de Yurtrus',
    faction: 'orcs',
    factionName: 'Tribus del Ojo de Gruumsh',
    description: 'Guerreros fanáticos acompañados por sacerdotes silenciosos portadores de plagas y un jefe brutal con hacha doble.',
    partyLevelTarget: 'Nivel 4 - 6',
    totalCreatures: 5,
    rawXp: 1850,
    adjustedXp: 3700,
    difficultyRating: 'Media',
    battlefieldRoleOverview: '1 Líder Caudillo, 1 Artillero de plagas de Yurtrus y 3 Brutos agresivos.',
    monsters: [
      {
        monsterId: 'orc_war_chief',
        name: 'Caudillo Orco de Guerra',
        cr: '4',
        xp: 1100,
        quantity: 1,
        tacticalRole: 'leader',
        tacticalNote: 'Furia de Gruumsh (+1d8 daño en todos los golpes) y Grito de Batalla con ventaja para sus guerreros.',
        size: 'Mediano',
        type: 'Humanoide (Orco)',
        hp: 93,
        ac: 16,
        speed: '9 metros',
        attackBonus: 6,
        damageDice: '1d12 + 4 + 1d8',
        damageType: 'Cortante'
      },
      {
        monsterId: 'orc_hand_yurtrus',
        name: 'Mano de Yurtrus',
        cr: '2',
        xp: 450,
        quantity: 1,
        tacticalRole: 'artillery',
        tacticalNote: 'Sacerdote mudo. Lanza Niebla Pútrida, Ceguera y contagia la Peste de Cloacas con su toque.',
        size: 'Mediano',
        type: 'Humanoide (Orco)',
        hp: 38,
        ac: 12,
        speed: '9 metros',
        attackBonus: 4,
        damageDice: '2d8 + 2',
        damageType: 'Necrótico'
      },
      {
        monsterId: 'orc_warrior_grunts',
        name: 'Guerreros Orcos Furiosos',
        cr: '1/2',
        xp: 100,
        quantity: 3,
        tacticalRole: 'brute',
        tacticalNote: 'Rasgo Agresivo (se mueve hasta su velocidad hacia un enemigo como acción bonus) y Resistencia Implacable.',
        size: 'Mediano',
        type: 'Humanoide (Orco)',
        hp: 15,
        ac: 13,
        speed: '9 metros',
        attackBonus: 5,
        damageDice: '1d12 + 3',
        damageType: 'Cortante'
      }
    ]
  },
  {
    id: 'yuanti_inquisition',
    name: 'Guardia del Templo Serpentino',
    faction: 'yuanti',
    factionName: 'Imperio Yuan-ti',
    description: 'Una patrulla de élite que defiende el zikkurat sagrado de Sseth, combinando inmunidad a venenos y constricción mortal.',
    partyLevelTarget: 'Nivel 6 - 8',
    totalCreatures: 4,
    rawXp: 3800,
    adjustedXp: 7600,
    difficultyRating: 'Difícil',
    battlefieldRoleOverview: '1 Bruto Abominación, 2 Hostigadores Mestizos y 1 Emboscador Puro.',
    monsters: [
      {
        monsterId: 'yuanti_abomination',
        name: 'Abominación Yuan-ti',
        cr: '7',
        xp: 2900,
        quantity: 1,
        tacticalRole: 'leader',
        tacticalNote: 'Gran serpiente con brazos humanos. Resistencia Mágica, constricción letal y Sugestión masiva.',
        size: 'Grande',
        type: 'Monstruosidad (Yuan-ti)',
        hp: 127,
        ac: 15,
        speed: '12 metros, nadar 9 m',
        attackBonus: 7,
        damageDice: '2d6 + 4',
        damageType: 'Perforante + Veneno'
      },
      {
        monsterId: 'yuanti_malison',
        name: 'Mestizo Yuan-ti (Malison)',
        cr: '3',
        xp: 700,
        quantity: 2,
        tacticalRole: 'skirmisher',
        tacticalNote: 'Dispara flechas con veneno adicional (2d6 veneno) y usa Sugestión una vez al día.',
        size: 'Mediano',
        type: 'Monstruosidad (Yuan-ti)',
        hp: 66,
        ac: 12,
        speed: '9 metros',
        attackBonus: 5,
        damageDice: '1d10 + 3 + 2d6',
        damageType: 'Perforante + Veneno'
      },
      {
        monsterId: 'yuanti_pureblood',
        name: 'Puro Yuan-ti Infiltrador',
        cr: '1',
        xp: 200,
        quantity: 1,
        tacticalRole: 'ambusher',
        tacticalNote: 'Piel con escamas disimuladas. Lanza Rociada de Veneno y Amistad con Animales (serpientes).',
        size: 'Mediano',
        type: 'Humanoide (Yuan-ti)',
        hp: 40,
        ac: 11,
        speed: '9 metros',
        attackBonus: 3,
        damageDice: '1d6 + 1',
        damageType: 'Perforante'
      }
    ]
  },
  {
    id: 'beholder_sanctum_guard',
    name: 'Vigilantes de la Cámara Ocular',
    faction: 'beholder',
    factionName: 'Contempladores (Beholders)',
    description: 'La vanguardia de defensa del contemplador supremo, compuesta por esferas oculares menores que saturan de rayos el pasillo de acceso.',
    partyLevelTarget: 'Nivel 5 - 7',
    totalCreatures: 4,
    rawXp: 1800,
    adjustedXp: 3600,
    difficultyRating: 'Media',
    battlefieldRoleOverview: '1 Espectador centinela de 4 ojos y 3 Mirones (Gazers) de hostigamiento.',
    monsters: [
      {
        monsterId: 'spectator_sentry',
        name: 'Espectador Guardián',
        cr: '3',
        xp: 700,
        quantity: 1,
        tacticalRole: 'leader',
        tacticalNote: 'Reflejo de Conjuros (si supera salvación contra conjuro, lo refleja al lanzador) y 4 rayos oculares.',
        size: 'Mediano',
        type: 'Aberración',
        hp: 39,
        ac: 14,
        speed: '0 m, volar 9 m (levitación)',
        attackBonus: 4,
        damageDice: '3d6',
        damageType: 'Fuerza'
      },
      {
        monsterId: 'gazer_swarm',
        name: 'Gazers (Mirones Voladores)',
        cr: '1/2',
        xp: 100,
        quantity: 3,
        tacticalRole: 'skirmisher',
        tacticalNote: 'Disparan rayos de aturdimiento y miedo desde el techo, mordiendo con dientes afilados si bajan.',
        size: 'Diminuto',
        type: 'Aberración',
        hp: 13,
        ac: 13,
        speed: '0 m, volar 9 m (levitación)',
        attackBonus: 5,
        damageDice: '1d4 + 3',
        damageType: 'Perforante'
      }
    ]
  },
  {
    id: 'frost_giant_hunting',
    name: 'Partida de Caza del Jarl Glacial',
    faction: 'giants',
    factionName: 'Gigantes y la Ordenación',
    description: 'Un gigante de escarcha descendiendo de los picos congelados acompañado de sus fieles lobos de invierno.',
    partyLevelTarget: 'Nivel 8 - 10',
    totalCreatures: 3,
    rawXp: 6700,
    adjustedXp: 13400,
    difficultyRating: 'Difícil',
    battlefieldRoleOverview: '1 Bruto Gigante Colosal y 2 Hostigadores con aliento helado.',
    monsters: [
      {
        monsterId: 'frost_giant_warrior',
        name: 'Gigante de Escarcha',
        cr: '8',
        xp: 3900,
        quantity: 1,
        tacticalRole: 'brute',
        tacticalNote: 'Lanza peñascos a 72 m (4d10+6) y ataca con su hacha a dos manos (3d12+6). Inmune al frío.',
        size: 'Enorme',
        type: 'Gigante',
        hp: 138,
        ac: 15,
        speed: '12 metros',
        attackBonus: 9,
        damageDice: '3d12 + 6',
        damageType: 'Cortante'
      },
      {
        monsterId: 'winter_wolf_pack',
        name: 'Lobos de Invierno',
        cr: '3',
        xp: 700,
        quantity: 2,
        tacticalRole: 'skirmisher',
        tacticalNote: 'Aliento Frío (cono 4.5 m, 4d8 frío CD 12 Des) y Táctica de Manada con derribo automático si falla Fuerza.',
        size: 'Grande',
        type: 'Monstruosidad',
        hp: 75,
        ac: 13,
        speed: '15 metros',
        attackBonus: 6,
        damageDice: '2d6 + 4 + 1d8 frío',
        damageType: 'Perforante'
      }
    ]
  },
  {
    id: 'bloodwar_infernal_phalanx',
    name: 'Falange Infernal del Averno',
    faction: 'bloodwar',
    factionName: 'La Guerra de la Sangre',
    description: 'Un destacamento de la legión de hierro de los Nueve Infiernos entrenado para masacrar hordas caóticas.',
    partyLevelTarget: 'Nivel 5 - 7',
    totalCreatures: 3,
    rawXp: 2500,
    adjustedXp: 5000,
    difficultyRating: 'Media',
    battlefieldRoleOverview: '1 Bruto Diablo Barbado con heridas hemorrágicas y 2 Artilleros Diablos Espinados.',
    monsters: [
      {
        monsterId: 'bearded_devil_phalanx',
        name: 'Diablo Barbado (Barbazu)',
        cr: '3',
        xp: 700,
        quantity: 1,
        tacticalRole: 'brute',
        tacticalNote: 'Guja con herida infernal (1d10 daño necrótico por turno hasta que se cure con medicina CD 12) y barba ponzoñosa.',
        size: 'Mediano',
        type: 'Infernal (Diablo)',
        hp: 52,
        ac: 13,
        speed: '9 metros',
        attackBonus: 5,
        damageDice: '1d10 + 3',
        damageType: 'Cortante'
      },
      {
        monsterId: 'spined_devil_scouts',
        name: 'Diablos Espinados (Spinagons)',
        cr: '2',
        xp: 450,
        quantity: 2,
        tacticalRole: 'artillery',
        tacticalNote: 'Vuelan a 12 m lanzando espinas ígneas (2d4 perforante + 1d6 fuego). Resistencia a armas no mágicas.',
        size: 'Pequeño',
        type: 'Infernal (Diablo)',
        hp: 22,
        ac: 13,
        speed: '6 m, volar 12 m',
        attackBonus: 4,
        damageDice: '2d4 + 2 + 1d6',
        damageType: 'Perforante + Fuego'
      }
    ]
  }
];

// -------------------------------------------------------------
// 4. CÁMARAS Y ECOLOGÍA DE GUARIDA FUNCIONAL
// -------------------------------------------------------------
export const LAIR_CHAMBERS: LairChamberDef[] = [
  {
    id: 'beholder_vertical_shaft',
    faction: 'beholder',
    name: 'El Pozo Cilíndrico de la Paranoia',
    purpose: 'Cámara de acceso y emboscada vertical tridimensional.',
    physicalDescription: 'Un túnel cilíndrico perfecto de 24 metros de profundidad y 6 metros de diámetro sin asideros, esculpido con rayos desintegradores. Las paredes están pulidas como obsidiana.',
    tacticalHazards: [
      'Caída libre sin asideros: Cualquier criatura que caiga sufre 1d6 de daño por cada 3 metros.',
      'Corrientes de viento ascendentes que dificultan el vuelo de criaturas con alas no mágicas.',
      'Paredes resbaladizas con limo reflectante que imponen desventaja en pruebas de Atletismo para escalar.'
    ],
    defensiveMechanisms: [
      'Gazers apostados en hornacinas en el techo que disparan rayos de miedo a quienes intenten trepar.',
      'Palancas que liberan brea hirviente desde el piso superior.'
    ],
    investigationClues: [
      'Surcos circulares idénticos al diámetro de un rayo de desintegración.',
      'Estatuas de aventureros con expresiones de horror petrificadas, alineadas como trofeos.'
    ],
    suggestedEncounterCr: 'CR 10+'
  },
  {
    id: 'mindflayer_brine_pool',
    faction: 'mindflayer',
    name: 'Piscina de Salmuera del Renacuajo',
    purpose: 'Cámara de incubación de larvas y comunión telepática.',
    physicalDescription: 'Una alberca central de líquido salino espeso que brilla con bioluminiscencia cerúlea, repleta de renacuajos ilícidos que se retuercen en espiral. Conductos biológicos bombean nutrientes desde el techo.',
    tacticalHazards: [
      'Vaho psicoactivo: Criaturas que no sean aberraciones deben superar una salvación de Sabiduría CD 13 o sufrir desventaja en pruebas de concentración.',
      'Suelo cubierto de fango conductor psiónico que reduce la velocidad a la mitad.'
    ],
    defensiveMechanisms: [
      'Si un renacuajo toca la piel expuesta de un personaje incapacitado, intenta barrenar el canal auditivo.',
      'Campanas de cristal que emiten un pulso mental ensordecedor si se altera el nivel de salmuera.'
    ],
    investigationClues: [
      'Cráneos humanoides con la bóveda superior limpiamente serruchada con precisión quirúrgica.',
      'Pizarras de obsidiana con caracteres cualith grabados táctilmente en relieve de tentáculo.'
    ],
    suggestedEncounterCr: 'CR 7+'
  },
  {
    id: 'yuanti_snake_pit_altar',
    faction: 'yuanti',
    name: 'El Altar de los Pozos de Víboras',
    purpose: 'Área ceremonial de sacrificios humanos y devoción a Sseth.',
    physicalDescription: 'Una pirámide escalonada de piedra musgosa con una losa de sacrificio en la cumbre, rodeada por tres fosas de 4 metros de profundidad que hierven con miles de víboras venenosas vivas.',
    tacticalHazards: [
      'Fosas de Serpientes: Caer en una fosa inflige 2d6 de daño contundente más 4d6 de veneno por turno.',
      'Vapores de incienso ponzoñoso que imponen la condición de Envenenado a quienes no tengan sangre de serpiente.'
    ],
    defensiveMechanisms: [
      'La losa de sacrificio tiene surcos que drenan sangre hacia los colmillos de la estatua de Sseth, activando un glifo de Sugestión masiva.',
      'Mestizos apostados con arcos en las columnas superiores con tres cuartos de cobertura (+5 CA).'
    ],
    investigationClues: [
      'Mudas de piel gigantescas de más de 6 metros de longitud.',
      'Copas doradas con restos de sangre humana mezclada con veneno de escorpión.'
    ],
    suggestedEncounterCr: 'CR 6+'
  },
  {
    id: 'hags_coven_kitchen',
    faction: 'hags',
    name: 'El Caldero de los Recuerdos Perdidos',
    purpose: 'Laboratorio de maldiciones, cocina caníbal y preparación de filtros.',
    physicalDescription: 'Un caldero de hierro de 300 kilos burbujea con una sopa verde viscosa sobre huesos de gigantes. Las paredes están decoradas con pieles secas de rostros humanos cosidas como cortinas.',
    tacticalHazards: [
      'Salpicaduras del caldero: Si un impacto de área golpea el caldero, salpica líquido hirviente a 3 metros (2d6 fuego + 2d6 ácido).',
      'Fetiches colgantes que gimen cuando un intruso de alineamiento bueno cruza el umbral.'
    ],
    defensiveMechanisms: [
      'Un espejo con el alma atrapada de un paladín que lanza Rayo Relampagueante si las brujas pronuncian su palabra de mando.',
      'Suelo con grasa de cerdo podrida que requiere salvación de Destreza CD 12 o quedar Tumbado.'
    ],
    investigationClues: [
      'Un frasco sellado con una etiqueta que dice "La voz de la princesa de Cormyr (1492 CV)".',
      'Un contrato de piel humana firmado con sangre que promete salvar una aldea a cambio de su primogénito.'
    ],
    suggestedEncounterCr: 'CR 5+'
  },
  {
    id: 'goblinoid_armory_gate',
    faction: 'goblinoid',
    name: 'El Rastrillo de las Aspilleras de Maglubiyet',
    purpose: 'Punto de control de acceso y zona de aniquilación fortificada.',
    physicalDescription: 'Un pasaje estrecho de 3 metros de ancho flanqueado por gruesos muros de sillería con aspilleras cada metro. Dos rastrillos de hierro macizo pueden caer a la vez para atrapar intrusos en una caja de muerte.',
    tacticalHazards: [
      'Zona de tiro cruzado: Los arqueros hobgoblin disparan con cobertura de 3/4 (+5 CA).',
      'Agujeros en el techo (asesinos) por donde vierten aceite hirviendo (4d6 fuego) o alimañas.'
    ],
    defensiveMechanisms: [
      'Muelle de disparo de resorte que activa el cierre simultáneo de ambos rastrillos si se pisa la losa central.',
      'Cuernos de alarma que alertan a toda la guarnición en menos de 1 asalto.'
    ],
    investigationClues: [
      'Diagramas tácticos en piel de huargo mostrando el orden de marcha y guardias.',
      'Flechas cuidadosamente alineadas con puntas melladas diseñadas para rasgar armaduras.'
    ],
    suggestedEncounterCr: 'CR 4+'
  },
  {
    id: 'orc_shrine_of_gruumsh',
    faction: 'orcs',
    name: 'El Osario del Ojo Ensangrentado',
    purpose: 'Templo de guerra, preparación de la horda y comunión bárbara.',
    physicalDescription: 'Una caverna natural con estalagmitas afiladas como lanzas. En el centro se erige un pilar de cráneos de elfos y enanos coronado por un gran ojo tallado en rubí de sangre que parece parpadear.',
    tacticalHazards: [
      'Furia del dios: Los orcos que luchen dentro de 9 metros del pilar tienen ventaja en salvaciones contra ser asustados o hechizados.',
      'Piso resbaladizo cubierto de sangre fresca coagulada.'
    ],
    defensiveMechanisms: [
      'Chamanes Ojos de Gruumsh que pueden sacrificar 10 PG de un siervo para invocar un Espíritu de Guerra.',
      'Cuerdas tensoras que hacen caer rocas puntiagudas del techo.'
    ],
    investigationClues: [
      'Armaduras élficas abolladas colgadas como trofeos de victoria.',
      'Marcas tribales en ceniza y sangre que señalan el próximo asentamiento humano a saquear.'
    ],
    suggestedEncounterCr: 'CR 4+'
  }
];
