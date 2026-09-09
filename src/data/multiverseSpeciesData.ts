import { ModernSpeciesDef } from '../types/dnd';

export const MULTIVERSE_SPECIES_DATA: ModernSpeciesDef[] = [
  // -------------------------------------------------------------
  // MORDENKAINEN: MONSTRUOS DEL MULTIVERSO
  // -------------------------------------------------------------
  {
    id: 'aasimar',
    name: 'Aasimar',
    speed: 9,
    size: 'Mediano o Pequeño',
    sizeChoice: 'Mediano o Pequeño',
    darkvision: 18,
    creatureType: 'Humanoide',
    sourceBook: 'Mordenkainen: Monstruos del Multiverso',
    originTag: 'multiverse',
    asiRule: '+2 a una / +1 a otra, o +1 a tres',
    languages: ['Común', 'Celestial'],
    traits: [
      { name: 'Manos Sanadoras', desc: 'Como acción, tocas a una criatura y tiras un número de d4s igual a tu bono de competencia; la criatura recupera esa cantidad de puntos de golpe. Recuperas este uso con descanso largo.' },
      { name: 'Portador de Luz', desc: 'Conoces el truco Luz (usando Carisma, Inteligencia o Sabiduría como aptitud mágica).' },
      { name: 'Resistencia Celestial', desc: 'Tienes resistencia al daño Necrótico y al daño Radiante.' },
      { name: 'Revelación Celestial', desc: 'A partir de nivel 3, como acción adicional puedes desatar tu naturaleza celestial durante 1 minuto (Mortaja Necrótica, Consumo Radiante o Alma Radiante con vuelo de 9 m). Una vez por turno infliges daño radiante o necrótico extra igual a tu bono de competencia.' }
    ],
    description: 'Seres tocados por la chispa de los planos superiores celestiales, imbuidos con el fuego de los ángeles para combatir la oscuridad.'
  },
  {
    id: 'bugbear',
    name: 'Bugbear',
    speed: 9,
    size: 'Mediano',
    sizeChoice: 'Mediano',
    darkvision: 18,
    creatureType: 'Humanoide / Feérico',
    sourceBook: 'Mordenkainen: Monstruos del Multiverso',
    originTag: 'multiverse',
    asiRule: '+2 a una / +1 a otra, o +1 a tres',
    languages: ['Común', 'Trasgo'],
    traits: [
      { name: 'Extremidades Largas', desc: 'Al realizar un ataque cuerpo a cuerpo en tu turno, tu alcance para dicho ataque es 1.5 metros mayor de lo normal.' },
      { name: 'Complexión Poderosa', desc: 'Cuentas como un tamaño más grande para determinar tu capacidad de carga y el peso que puedes empujar, arrastrar o levantar.' },
      { name: 'Furtivo', desc: 'Eres competente en la habilidad Sigilo. Además, puedes moverte a través de espacios de criaturas de tamaño Pequeño sin considerarlo terreno difícil.' },
      { name: 'Ataque Sorpresa', desc: 'Si golpeas a una criatura con una tirada de ataque y esa criatura aún no ha actuado en el combate actual, el objetivo sufre 2d6 de daño extra.' }
    ],
    description: 'Primos mayores y fornidos de los goblins con orígenes en las sombras de las tierras feéricas, expertos en emboscadas sigilosas.'
  },
  {
    id: 'centaur',
    name: 'Centauro',
    speed: 10.5,
    size: 'Mediano',
    sizeChoice: 'Mediano',
    darkvision: 0,
    creatureType: 'Feérico',
    sourceBook: 'Mordenkainen: Monstruos del Multiverso',
    originTag: 'multiverse',
    asiRule: '+2 a una / +1 a otra, o +1 a tres',
    languages: ['Común', 'Silvano'],
    traits: [
      { name: 'Carga Devastadora', desc: 'Si te mueves al menos 9 metros en línea recta hacia un objetivo y luego le aciertas con un ataque cuerpo a cuerpo con arma en el mismo turno, puedes realizar un ataque adicional con tus cascos como acción adicional.' },
      { name: 'Cascos Poderosos', desc: 'Tus cascos son armas naturales con las que puedes realizar ataques desarmados que infligen 1d6 + modificador de Fuerza de daño contundente.' },
      { name: 'Constitución Equina', desc: 'Cuentas como un tamaño más grande para capacidad de carga. Sin embargo, cualquier escalada que requiera manos y pies cuesta 2 metros extra de movimiento por cada metro avanzado.' },
      { name: 'Superviviente Feérico', desc: 'Tienes competencia en una de las siguientes habilidades: Atletismo, Medicina, Naturaleza o Supervivencia.' }
    ],
    description: 'Nobles vagabundos que combinan el torso de un humanoide con el cuerpo fornido de un caballo de guerra, nacidos de la libertad de los prados feéricos.'
  },
  {
    id: 'changeling',
    name: 'Cambiante (Changeling)',
    speed: 9,
    size: 'Mediano o Pequeño',
    sizeChoice: 'Mediano o Pequeño',
    darkvision: 0,
    creatureType: 'Feérico',
    sourceBook: 'Mordenkainen: Monstruos del Multiverso',
    originTag: 'multiverse',
    asiRule: '+2 a una / +1 a otra, o +1 a tres',
    languages: ['Común'],
    traits: [
      { name: 'Cambio de Forma', desc: 'Como acción, puedes cambiar tu apariencia física y tu voz. Puedes determinar los detalles como estatura, peso, rasgos faciales, timbre de voz, longitud de pelo y sexo. Tus estadísticas no cambian.' },
      { name: 'Instintos de Cambiante', desc: 'Ganas competencia en dos de las siguientes habilidades a tu elección: Engaño, Perspicacia, Intimidación o Persuasión.' }
    ],
    description: 'Pueblo místico de origen feérico capaz de alterar su rostro y cuerpo con tanta facilidad como otros cambian de vestimenta.'
  },
  {
    id: 'deep_gnome',
    name: 'Gnomo de las Profundidades (Svirfneblin)',
    speed: 9,
    size: 'Pequeño',
    sizeChoice: 'Pequeño',
    darkvision: 36,
    creatureType: 'Humanoide',
    sourceBook: 'Mordenkainen: Monstruos del Multiverso',
    originTag: 'multiverse',
    asiRule: '+2 a una / +1 a otra, o +1 a tres',
    languages: ['Común', 'Gnómico', 'Infraoscuro'],
    traits: [
      { name: 'Magia de Svirfneblin', desc: 'Conoces el truco Ilusión Menor. A partir de nivel 3 puedes lanzar Disfrazarse una vez por descanso largo; a nivel 5 puedes lanzar No-detección sin componentes materiales una vez por descanso largo.' },
      { name: 'Camuflaje de Piedra', desc: 'Tienes ventaja en pruebas de Destreza (Sigilo) realizadas en terreno rocoso o subterráneo (un número de veces igual a tu bono de competencia por descanso largo).' },
      { name: 'Astucia Gnómica', desc: 'Tienes ventaja en todas las tiradas de salvación de Inteligencia, Sabiduría y Carisma contra magia.' }
    ],
    description: 'Habitantes discretos y reflexivos del Infraoscuro, maestros de las ilusiones subterráneas y el sigilo entre la roca madre.'
  },
  {
    id: 'duergar',
    name: 'Duergar (Enano Gris)',
    speed: 9,
    size: 'Mediano',
    sizeChoice: 'Mediano',
    darkvision: 36,
    creatureType: 'Humanoide',
    sourceBook: 'Mordenkainen: Monstruos del Multiverso',
    originTag: 'multiverse',
    asiRule: '+2 a una / +1 a otra, o +1 a tres',
    languages: ['Común', 'Enano', 'Infraoscuro'],
    traits: [
      { name: 'Magia de Duergar', desc: 'A partir de nivel 3 puedes lanzar Agrandar/Reducir sobre ti mismo (solo efecto de Agrandar) sin componente material una vez por descanso largo. A nivel 5 puedes lanzar Invisibilidad sobre ti mismo una vez por descanso largo.' },
      { name: 'Fortaleza Psiónica', desc: 'Tienes ventaja en tiradas de salvación para evitar o terminar las condiciones de Hechizado y Paralizado.' },
      { name: 'Resistencia Enana', desc: 'Tienes resistencia al daño por veneno y ventaja en tiradas de salvación contra venenos.' }
    ],
    description: 'Enanos de las profundidades cuya estirpe fue forjada por el cautiverio azotamentes, despertando poderes psiónicos innatos.'
  },
  {
    id: 'eladrin',
    name: 'Eladrin Feérico',
    speed: 9,
    size: 'Mediano',
    sizeChoice: 'Mediano',
    darkvision: 18,
    creatureType: 'Humanoide',
    sourceBook: 'Mordenkainen: Monstruos del Multiverso',
    originTag: 'multiverse',
    asiRule: '+2 a una / +1 a otra, o +1 a tres',
    languages: ['Común', 'Elfo'],
    traits: [
      { name: 'Paso Feérico', desc: 'Como acción adicional, puedes teletransportarte mágicamente hasta 9 metros a un espacio desocupado que puedas ver. Puedes usar este rasgo un número de veces igual a tu bono de competencia por descanso largo.' },
      { name: 'Efectos Estacionales', desc: 'A partir de nivel 3, tu Paso Feérico gana un efecto según tu estación (Otoño: hechizar criaturas; Invierno: asustar a un rival; Primavera: teletransportar a un aliado; Verano: daño de fuego igual a tu bono de carisma a enemigos adyacentes).' },
      { name: 'Ascendencia Feérica & Trance', desc: 'Ventaja contra Hechizado, inmunidad al sueño mágico y descanso largo meditando 4 horas.' }
    ],
    description: 'Elfos imbuidos con la magia salvaje de las Tierras Feéricas que reflejan el cambio de las cuatro estaciones en su temperamento y poderes.'
  },
  {
    id: 'fairy',
    name: 'Hada (Fairy)',
    speed: 9,
    size: 'Pequeño',
    sizeChoice: 'Pequeño',
    darkvision: 0,
    creatureType: 'Feérico',
    sourceBook: 'Mordenkainen: Monstruos del Multiverso',
    originTag: 'multiverse',
    asiRule: '+2 a una / +1 a otra, o +1 a tres',
    languages: ['Común', 'Silvano'],
    specialSpeeds: { fly: 9 },
    traits: [
      { name: 'Vuelo Feérico', desc: 'Tienes una velocidad de vuelo igual a tu velocidad de caminata. No puedes volar si vistes armadura pesada o media.' },
      { name: 'Magia de las Hadas', desc: 'Conoces el truco Druidismo. A partir de nivel 3 puedes lanzar Fuego Feérico una vez por descanso largo; a nivel 5 puedes lanzar Agrandar/Reducir una vez por descanso largo.' }
    ],
    description: 'Gente menuda con alas relucientes de libélula o mariposa, rebosantes de la alegría traviesa del Feywild.'
  },
  {
    id: 'firbolg',
    name: 'Firbolg',
    speed: 9,
    size: 'Mediano',
    sizeChoice: 'Mediano',
    darkvision: 0,
    creatureType: 'Humanoide',
    sourceBook: 'Mordenkainen: Monstruos del Multiverso',
    originTag: 'multiverse',
    asiRule: '+2 a una / +1 a otra, o +1 a tres',
    languages: ['Común', 'Gigante', 'Élfico'],
    traits: [
      { name: 'Magia de Firbolg', desc: 'Puedes lanzar Detectar Magia y Disfrazarse (permitiéndote parecer 90 cm más bajo) un número de veces igual a tu bono de competencia por descanso largo.' },
      { name: 'Paso Oculto', desc: 'Como acción adicional, puedes volverte mágicamente invisible hasta el inicio de tu próximo turno o hasta que ataques, tires daño o fuerces una tirada de salvación.' },
      { name: 'Complexión Poderosa', desc: 'Cuentas como un tamaño más grande al determinar peso que puedes empujar, levantar o arrastrar.' },
      { name: 'Habla de Bestia y Hoja', desc: 'Puedes comunicar ideas simples a bestias y plantas. Ellas te entienden, aunque no puedes entenderlas a menos que uses magia.' }
    ],
    description: 'Semigigantes apacibles guardianes de los bosques primigenios que prefieren la armonía de la naturaleza sobre la ambición de las ciudades.'
  },
  {
    id: 'air_genasi',
    name: 'Genasí de Aire',
    speed: 10.5,
    size: 'Mediano o Pequeño',
    sizeChoice: 'Mediano o Pequeño',
    darkvision: 18,
    creatureType: 'Humanoide',
    sourceBook: 'Mordenkainen: Monstruos del Multiverso',
    originTag: 'multiverse',
    asiRule: '+2 a una / +1 a otra, o +1 a tres',
    languages: ['Común', 'Primordial'],
    traits: [
      { name: 'Aliento Infinito', desc: 'Puedes contener la respiración indefinidamente mientras no estés incapacitado.' },
      { name: 'Resistencia a Relámpago', desc: 'Tienes resistencia al daño por Relámpago.' },
      { name: 'Mezcla con el Viento', desc: 'Conoces el truco Ráfaga. A nivel 3 puedes lanzar Caída de Pluma; a nivel 5 puedes lanzar Levitar sin componentes materiales una vez por descanso largo.' }
    ],
    description: 'Portadores de la herencia del Plano Elemental del Aire, veloces, con cabellos que flotan con brisas invisibles.'
  },
  {
    id: 'earth_genasi',
    name: 'Genasí de Tierra',
    speed: 9,
    size: 'Mediano o Pequeño',
    sizeChoice: 'Mediano o Pequeño',
    darkvision: 18,
    creatureType: 'Humanoide',
    sourceBook: 'Mordenkainen: Monstruos del Multiverso',
    originTag: 'multiverse',
    asiRule: '+2 a una / +1 a otra, o +1 a tres',
    languages: ['Común', 'Primordial'],
    traits: [
      { name: 'Caminar por Tierra', desc: 'Puedes moverte a través de terreno difícil sin coste extra si estás en suelo de tierra, piedra o roca.' },
      { name: 'Fusionarse con la Piedra', desc: 'Conoces el truco Filo de la Hoja. A partir de nivel 5 puedes lanzar Pasar sin Rastro sin componentes materiales una vez por descanso largo.' }
    ],
    description: 'Herederos de la fuerza y estabilidad del Plano Elemental de la Tierra, con piel de textura granítica o vetas de cuarzo.'
  },
  {
    id: 'fire_genasi',
    name: 'Genasí de Fuego',
    speed: 9,
    size: 'Mediano o Pequeño',
    sizeChoice: 'Mediano o Pequeño',
    darkvision: 18,
    creatureType: 'Humanoide',
    sourceBook: 'Mordenkainen: Monstruos del Multiverso',
    originTag: 'multiverse',
    asiRule: '+2 a una / +1 a otra, o +1 a tres',
    languages: ['Común', 'Primordial'],
    traits: [
      { name: 'Resistencia al Fuego', desc: 'Tienes resistencia pasiva al daño por Fuego.' },
      { name: 'Alcanzar la Llama', desc: 'Conoces el truco Producir Llama. A partir de nivel 3 puedes lanzar Manos Ardientes una vez por descanso largo; a nivel 5 puedes lanzar Hoja Flamígera una vez por descanso largo.' }
    ],
    description: 'Imbuidos con la pasión ardiente del Plano Elemental del Fuego, cuyos ojos fulguran como ascuas vivas al emocionarse.'
  },
  {
    id: 'water_genasi',
    name: 'Genasí de Agua',
    speed: 9,
    size: 'Mediano o Pequeño',
    sizeChoice: 'Mediano o Pequeño',
    darkvision: 18,
    creatureType: 'Humanoide',
    sourceBook: 'Mordenkainen: Monstruos del Multiverso',
    originTag: 'multiverse',
    asiRule: '+2 a una / +1 a otra, o +1 a tres',
    languages: ['Común', 'Primordial'],
    specialSpeeds: { swim: 9 },
    traits: [
      { name: 'Anfibio', desc: 'Puedes respirar tanto en el aire como bajo el agua.' },
      { name: 'Velocidad de Nado', desc: 'Tienes una velocidad de nado de 9 metros.' },
      { name: 'Resistencia a Ácido', desc: 'Tienes resistencia al daño por Ácido.' },
      { name: 'Llamar a la Ola', desc: 'Conoces el truco Moldear Agua. A nivel 3 lanzas Crear o Destruir Agua; a nivel 5 lanzas Caminar sobre el Agua una vez por descanso largo.' }
    ],
    description: 'Descendientes de los reinos acuáticos elementales, flexibles y fluidos con gotas de rocío perpetuas en su piel.'
  },
  {
    id: 'githyanki',
    name: 'Githyanki',
    speed: 9,
    size: 'Mediano',
    sizeChoice: 'Mediano',
    darkvision: 0,
    creatureType: 'Humanoide',
    sourceBook: 'Mordenkainen: Monstruos del Multiverso',
    originTag: 'multiverse',
    asiRule: '+2 a una / +1 a otra, o +1 a tres',
    languages: ['Común', 'Gith'],
    traits: [
      { name: 'Conocimiento Astral', desc: 'Al terminar un descanso largo, ganas competencia en una habilidad y un arma a tu elección, extrayendo recuerdos de los espíritus del Mar Astral.' },
      { name: 'Psiónica Githyanki', desc: 'Conoces Mano de Mago (invisible). A nivel 3 lanzas Salto; a nivel 5 lanzas Paso Brumoso sin componentes una vez por descanso largo.' }
    ],
    description: 'Guerreros astrales que saquearon los secretos de los ilícidos para forjar una civilización de jinetes de dragones rojos.'
  },
  {
    id: 'githzerai',
    name: 'Githzerai',
    speed: 9,
    size: 'Mediano',
    sizeChoice: 'Mediano',
    darkvision: 0,
    creatureType: 'Humanoide',
    sourceBook: 'Mordenkainen: Monstruos del Multiverso',
    originTag: 'multiverse',
    asiRule: '+2 a una / +1 a otra, o +1 a tres',
    languages: ['Común', 'Gith'],
    traits: [
      { name: 'Disciplina Mental', desc: 'Tienes ventaja en tiradas de salvación para evitar o terminar las condiciones de Hechizado y Asustado.' },
      { name: 'Psiónica Githzerai', desc: 'Conoces Mano de Mago (invisible). A nivel 3 lanzas Escudo; a nivel 5 lanzas Detectar Pensamientos sin componentes una vez por descanso largo.' }
    ],
    description: 'Filósofos ascéticos del Caos de Limbo, cuya disciplina mental inquebrantable les permite dominar la materia con la voluntad.'
  },
  {
    id: 'goblin',
    name: 'Goblin del Multiverso',
    speed: 9,
    size: 'Pequeño',
    sizeChoice: 'Pequeño',
    darkvision: 18,
    creatureType: 'Humanoide / Feérico',
    sourceBook: 'Mordenkainen: Monstruos del Multiverso',
    originTag: 'multiverse',
    asiRule: '+2 a una / +1 a otra, o +1 a tres',
    languages: ['Común', 'Trasgo'],
    traits: [
      { name: 'Escape Ágil', desc: 'Puedes realizar la acción de Destrabarse o Esconderse como acción adicional en cada uno de tus turnos.' },
      { name: 'Furia del Pequeño', desc: 'Al golpear a una criatura de tamaño mayor al tuyo con un ataque o conjuro, puedes infligir daño extra igual a tu bono de competencia un número de veces igual a dicho bono por descanso largo.' },
      { name: 'Ascendencia Feérica', desc: 'Tienes ventaja en salvaciones contra ser Hechizado.' }
    ],
    description: 'Supervivientes natos, rápidos como el relámpago y con una rabia feérica que desconcierta a rivales el triple de grandes.'
  },
  {
    id: 'goliath',
    name: 'Goliat (Hijo de Gigantes)',
    speed: 10.5,
    size: 'Mediano',
    sizeChoice: 'Mediano',
    darkvision: 0,
    creatureType: 'Humanoide',
    sourceBook: 'Mordenkainen: Monstruos del Multiverso & PHB 2024',
    originTag: 'multiverse',
    asiRule: '+2 a una / +1 a otra, o +1 a tres',
    languages: ['Común', 'Gigante'],
    traits: [
      { name: 'Ascendencia de Gigante', desc: 'Eliges una ascendencia: Fuego (+1d10 daño fuego), Escarcha (+1d6 frío y frena al rival), Nube (teletransporte de 9 m como reacción), Colina (derribar Tumbado), Piedra (reducir 1d12 de daño) o Tormenta (daño de trueno en reacción). Usable PB veces por descanso largo.' },
      { name: 'Complexión Poderosa', desc: 'Cuentas como un tamaño más grande para capacidad de carga, empuje y arrastre.' },
      { name: 'Nacido en las Montañas', desc: 'Resistencia al daño por Frío y aclimatación natural a grandes altitudes superiores a 6,000 metros.' }
    ],
    description: 'Imponentes colosos de las altas cumbres en cuyas venas palpita la sangre y el poder elemental de los gigantes antiguos.'
  },
  {
    id: 'harengon',
    name: 'Harengon (Pueblo Conejo)',
    speed: 9,
    size: 'Mediano o Pequeño',
    sizeChoice: 'Mediano o Pequeño',
    darkvision: 0,
    creatureType: 'Humanoide',
    sourceBook: 'Mordenkainen: Monstruos del Multiverso',
    originTag: 'multiverse',
    asiRule: '+2 a una / +1 a otra, o +1 a tres',
    languages: ['Común', 'Silvano'],
    traits: [
      { name: 'Gatillo de Liebre', desc: 'Añades tu bono de competencia a tus tiradas de Iniciativa.' },
      { name: 'Sentidos Lepóridos', desc: 'Tienes competencia en la habilidad Percepción.' },
      { name: 'Salto de Conejo', desc: 'Como acción adicional, puedes saltar una distancia de metros igual a 5 veces tu bono de competencia sin provocar ataques de oportunidad (PB veces por descanso largo).' },
      { name: 'Reflejos Afortunados', desc: 'Al fallar una salvación de Destreza, puedes gastar tu reacción para sumar 1d4 a la tirada, convirtiendo potencialmente el fallo en éxito.' }
    ],
    description: 'Humanoides de aspecto de conejo originarios del Feywild, conocidos por su desbordante energía, curiosidad y reflejos veloces.'
  },
  {
    id: 'hobgoblin',
    name: 'Hobgoblin',
    speed: 9,
    size: 'Mediano',
    sizeChoice: 'Mediano',
    darkvision: 18,
    creatureType: 'Humanoide / Feérico',
    sourceBook: 'Mordenkainen: Monstruos del Multiverso',
    originTag: 'multiverse',
    asiRule: '+2 a una / +1 a otra, o +1 a tres',
    languages: ['Común', 'Trasgo'],
    traits: [
      { name: 'Don Feérico', desc: 'Puedes realizar la acción de Ayudar como acción adicional (PB veces por descanso largo). A partir de nivel 3, al ayudar a un aliado puedes otorgarle además ventaja temporal, puntos de golpe temporales o velocidad extra.' },
      { name: 'Fortuna de los Muchos', desc: 'Si fallas una tirada de ataque, prueba o salvación, puedes sumar una bonificación igual al número de aliados que veas a 9 metros (máx. +3).' }
    ],
    description: 'Estrategas marciales de porte solemne que canalizan los antiguos lazos de camaradería de las cortes feéricas.'
  },
  {
    id: 'kenku',
    name: 'Kenku',
    speed: 9,
    size: 'Mediano o Pequeño',
    sizeChoice: 'Mediano o Pequeño',
    darkvision: 0,
    creatureType: 'Humanoide',
    sourceBook: 'Mordenkainen: Monstruos del Multiverso',
    originTag: 'multiverse',
    asiRule: '+2 a una / +1 a otra, o +1 a tres',
    languages: ['Común'],
    traits: [
      { name: 'Duplicación Experta', desc: 'Al copiar la escritura de otra persona o crear un duplicado de un objeto artesanal, tienes ventaja en la prueba de habilidad.' },
      { name: 'Recuerdo de Kenku', desc: 'Cuando haces una prueba con una habilidad en la que seas competente, puedes darte ventaja en la tirada (PB veces por descanso largo).' },
      { name: 'Mimetismo Prodigioso', desc: 'Puedes imitar con absoluta perfección cualquier sonido o voz que hayas escuchado, detectable solo con Perspicacia CD 8 + PB + Carisma.' }
    ],
    description: 'Pueblo de apariencia de cuervo sin alas que preserva la memoria de sus ancestros a través de un mimetismo sonoro perfecto.'
  },
  {
    id: 'kobold',
    name: 'Kobold Modernizado',
    speed: 9,
    size: 'Pequeño',
    sizeChoice: 'Pequeño',
    darkvision: 18,
    creatureType: 'Humanoide',
    sourceBook: 'Mordenkainen: Monstruos del Multiverso',
    originTag: 'multiverse',
    asiRule: '+2 a una / +1 a otra, o +1 a tres',
    languages: ['Común', 'Dracónico'],
    traits: [
      { name: 'Grito Dracónico', desc: 'Como acción adicional, lanzas un alarido de dragón. Hasta el final de tu próximo turno, tú y tus aliados tenéis ventaja en tiradas de ataque contra enemigos a 3 metros de ti (PB veces por descanso largo).' },
      { name: 'Legado Kobold', desc: 'Eliges una bendición dracónica: Artesanía trampera (competencia en juego de manos/herramientas), Coraje desafiante (ventaja contra Asustado) o Hechicería dracónica (un truco de hechicero de tu elección).' }
    ],
    description: 'Parientes lejanos de los dragones que suplen su pequeña estatura con ingenio audaz, trampas y lealtad incondicional al grupo.'
  },
  {
    id: 'lizardfolk',
    name: 'Hombre Lagarto (Lizardfolk)',
    speed: 9,
    size: 'Mediano',
    sizeChoice: 'Mediano',
    darkvision: 0,
    creatureType: 'Humanoide',
    sourceBook: 'Mordenkainen: Monstruos del Multiverso',
    originTag: 'multiverse',
    asiRule: '+2 a una / +1 a otra, o +1 a tres',
    languages: ['Común', 'Dracónico'],
    specialSpeeds: { swim: 9 },
    traits: [
      { name: 'Mordisco Feroz', desc: 'Tus fauces son armas naturales que infligen 1d6 + Fuerza de daño perforante.' },
      { name: 'Mandíbulas Hambrientas', desc: 'Como acción adicional, realizas un ataque de mordisco; si aciertas, ganas puntos de golpe temporales iguales a tu bono de competencia (PB veces por descanso largo).' },
      { name: 'Armadura Natural', desc: 'Tus escamas duras te confieren una CA base de 13 + modificador de Destreza cuando no vistes armadura.' },
      { name: 'Intuición de la Naturaleza', desc: 'Competencia en dos habilidades entre Trato con Animales, Medicina, Naturaleza, Percepción, Sigilo o Supervivencia.' }
    ],
    description: 'Cazadores pragmáticos de los pantanos con escamas duras como el cuero de dragón y reflejos de depredador anfibio.'
  },
  {
    id: 'minotaur',
    name: 'Minotauro',
    speed: 9,
    size: 'Mediano',
    sizeChoice: 'Mediano',
    darkvision: 0,
    creatureType: 'Humanoide',
    sourceBook: 'Mordenkainen: Monstruos del Multiverso',
    originTag: 'multiverse',
    asiRule: '+2 a una / +1 a otra, o +1 a tres',
    languages: ['Común', 'Minotauro'],
    traits: [
      { name: 'Cuernos de Toro', desc: 'Tus cuernos son armas naturales con las que infliges 1d6 + Fuerza de daño perforante.' },
      { name: 'Embestida Cornígera', desc: 'Si te mueves al menos 6 metros en línea recta hacia un rival y realizas la acción de Carrera en tu turno, puedes realizar un ataque de cuernos como acción adicional.' },
      { name: 'Martillazo de Cuernos', desc: 'Al golpear a un rival con un ataque en tu turno, puedes empujarlo 3 metros lejos de ti si falla una salvación de Fuerza (CD 8 + PB + Fue).' }
    ],
    description: 'Poderosos guerreros de cabeza vacuna y cuerpo ciclópeo, famosos por su furia en la vanguardia de batalla.'
  },
  {
    id: 'satyr',
    name: 'Sátiro',
    speed: 10.5,
    size: 'Mediano',
    sizeChoice: 'Mediano',
    darkvision: 0,
    creatureType: 'Feérico',
    sourceBook: 'Mordenkainen: Monstruos del Multiverso',
    originTag: 'multiverse',
    asiRule: '+2 a una / +1 a otra, o +1 a tres',
    languages: ['Común', 'Silvano'],
    traits: [
      { name: 'Resistencia Mágica', desc: 'Tienes ventaja en todas las tiradas de salvación contra conjuros y otros efectos mágicos.' },
      { name: 'Saltos Alegres', desc: 'Al realizar un salto de longitud o de altura, tiras 1d8 y sumas el resultado a la distancia o altura en pies alcanzada.' },
      { name: 'Topetazo con Cuernos', desc: 'Tus cuernos son armas naturales que causan 1d6 + Fuerza de daño contundente.' },
      { name: 'Festejante Nato', desc: 'Ganas competencia en la habilidad Interpretación y Persuasión, además de un instrumento musical.' }
    ],
    description: 'Seres feéricos de patas de cabra y cuernos espirales, celebrantes de la vida cuya naturaleza mágica dispersa los conjuros hostiles.'
  },
  {
    id: 'sea_elf',
    name: 'Elfo Marino',
    speed: 9,
    size: 'Mediano',
    sizeChoice: 'Mediano',
    darkvision: 18,
    creatureType: 'Humanoide',
    sourceBook: 'Mordenkainen: Monstruos del Multiverso',
    originTag: 'multiverse',
    asiRule: '+2 a una / +1 a otra, o +1 a tres',
    languages: ['Común', 'Elfo', 'Acuano'],
    specialSpeeds: { swim: 9 },
    traits: [
      { name: 'Hijo del Mar', desc: 'Puedes respirar bajo el agua y tienes una velocidad de nado de 9 metros.' },
      { name: 'Resistencia al Frío', desc: 'Tienes resistencia pasiva al daño por Frío de las profundidades abisales.' },
      { name: 'Amigo del Mar', desc: 'Puedes comunicar conceptos simples a cualquier bestia marina que nade.' },
      { name: 'Ascendencia Feérica & Trance', desc: 'Ventaja contra Hechizado y meditación de 4 horas para descanso largo.' }
    ],
    description: 'Elfos adaptados a las fosas y arrecifes oceánicos que custodian los secretos sumergidos de las civilizaciones perdidas.'
  },
  {
    id: 'shadar_kai',
    name: 'Shadar-kai (Elfo Sombrío)',
    speed: 9,
    size: 'Mediano',
    sizeChoice: 'Mediano',
    darkvision: 18,
    creatureType: 'Humanoide',
    sourceBook: 'Mordenkainen: Monstruos del Multiverso',
    originTag: 'multiverse',
    asiRule: '+2 a una / +1 a otra, o +1 a tres',
    languages: ['Común', 'Elfo'],
    traits: [
      { name: 'Bendición de la Reina Cuervo', desc: 'Como acción adicional, te teletransportas mágicamente hasta 9 metros a un espacio libre que veas (PB veces por descanso largo).' },
      { name: 'Resistencia Sombría', desc: 'A partir de nivel 3, tras usar tu Bendición de la Reina Cuervo, ganas resistencia a TODO tipo de daño hasta el inicio de tu próximo turno.' },
      { name: 'Resistencia Necrótica', desc: 'Tienes resistencia pasiva al daño Necrótico.' }
    ],
    description: 'Servidores devotos de la Reina Cuervo en el Páramo Sombrío, cuyos cuerpos parecen desvanecerse en niebla oscura al moverse.'
  },
  {
    id: 'shifter',
    name: 'Cambiapieles (Shifter)',
    speed: 9,
    size: 'Mediano',
    sizeChoice: 'Mediano',
    darkvision: 18,
    creatureType: 'Humanoide',
    sourceBook: 'Mordenkainen: Monstruos del Multiverso & Eberron',
    originTag: 'multiverse',
    asiRule: '+2 a una / +1 a otra, o +1 a tres',
    languages: ['Común'],
    traits: [
      { name: 'Mutación Bestial (Shifting)', desc: 'Como acción adicional, liberas tu bestia interior durante 1 minuto ganando puntos de golpe temporales iguales a tu nivel + mod. Constitución (PB veces por descanso largo).' },
      { name: 'Forma de Mutación', desc: 'Eliges una subraza: Piel de Bestia (+1 CA y más PG), Diente Largo (ataque de mordisco como acción adicional), Zancada Rápida (+3 m de velocidad y reacción de paso) o Caza Salvaje (ventaja en pruebas de Sabiduría e inmunidad a ventaja enemiga a 9 m).' }
    ],
    description: 'Descendientes de licántropos que aprendieron a controlar su metamorfosis parcial para desatar garras, colmillos y reflejos animales.'
  },
  {
    id: 'tabaxi',
    name: 'Tabaxi (Pueblo Felino)',
    speed: 9,
    size: 'Mediano o Pequeño',
    sizeChoice: 'Mediano o Pequeño',
    darkvision: 18,
    creatureType: 'Humanoide',
    sourceBook: 'Mordenkainen: Monstruos del Multiverso',
    originTag: 'multiverse',
    asiRule: '+2 a una / +1 a otra, o +1 a tres',
    languages: ['Común'],
    specialSpeeds: { climb: 9 },
    traits: [
      { name: 'Agilidad Felina', desc: 'Al moverte en tu turno en combate, puedes duplicar tu velocidad hasta el final del turno. Una vez usado, no puedes volver a usarlo hasta que te quedes quieto 1 turno completo.' },
      { name: 'Garras Retráctiles', desc: 'Tus garras infligen 1d6 + Fuerza cortante y te conceden una velocidad de escalada de 9 metros.' },
      { name: 'Talento Felino', desc: 'Tienes competencia en las habilidades Percepción y Sigilo.' }
    ],
    description: 'Viajeros ágiles y curiosos semejantes a leopardos o jaguares, atraídos por artefactos arcanos y relatos lejanos.'
  },
  {
    id: 'tortle',
    name: 'Tortuga (Tortle)',
    speed: 9,
    size: 'Mediano o Pequeño',
    sizeChoice: 'Mediano o Pequeño',
    darkvision: 0,
    creatureType: 'Humanoide',
    sourceBook: 'Mordenkainen: Monstruos del Multiverso',
    originTag: 'multiverse',
    asiRule: '+2 a una / +1 a otra, o +1 a tres',
    languages: ['Común', 'Aquan'],
    traits: [
      { name: 'Caparazón Blindado', desc: 'Tu caparazón te confiere una Clase de Armadura base de 17. No puedes vestir armaduras, pero los escudos se suman normalmente a tu CA.' },
      { name: 'Defensa en Caparazón', desc: 'Como acción, puedes retraerte dentro de tu caparazón: ganas +4 a la CA y ventaja en salvaciones de Fuerza y Constitución, pero quedas Tumbado y tu velocidad es 0.' },
      { name: 'Aguante de Respiración', desc: 'Puedes contener la respiración durante 1 hora antes de necesitar aire.' },
      { name: 'Garras Cortantes', desc: 'Tus garras infligen 1d6 + Fuerza de daño cortante.' }
    ],
    description: 'Nómadas sabios y pacientes protegidos por un caparazón acorazado que los hace prácticamente invulnerables al daño mundano.'
  },
  {
    id: 'triton',
    name: 'Tritón',
    speed: 9,
    size: 'Mediano',
    sizeChoice: 'Mediano',
    darkvision: 18,
    creatureType: 'Humanoide',
    sourceBook: 'Mordenkainen: Monstruos del Multiverso',
    originTag: 'multiverse',
    asiRule: '+2 a una / +1 a otra, o +1 a tres',
    languages: ['Común', 'Primordial'],
    specialSpeeds: { swim: 9 },
    traits: [
      { name: 'Anfibio & Nadador', desc: 'Puedes respirar aire y agua, y tienes una velocidad de nado de 9 metros.' },
      { name: 'Control de Aire y Agua', desc: 'Conoces Niebla. A nivel 3 lanzas Ráfaga de Viento; a nivel 5 lanzas Caminar sobre el Agua sin componentes una vez por descanso largo.' },
      { name: 'Emisario del Océano', desc: 'Puedes comunicarte con cualquier bestia, elemental o monstruosidad que nade.' },
      { name: 'Resistencia al Frío', desc: 'Tienes resistencia pasiva al daño por Frío.' }
    ],
    description: 'Protectores aristocráticos de los abismos marinos que patrullan las profundidades para impedir que leviatanes asolen las costas.'
  },
  {
    id: 'yuan_ti',
    name: 'Yuan-ti Puro',
    speed: 9,
    size: 'Mediano o Pequeño',
    sizeChoice: 'Mediano o Pequeño',
    darkvision: 18,
    creatureType: 'Humanoide',
    sourceBook: 'Mordenkainen: Monstruos del Multiverso',
    originTag: 'multiverse',
    asiRule: '+2 a una / +1 a otra, o +1 a tres',
    languages: ['Común', 'Abisal', 'Dracónico'],
    traits: [
      { name: 'Resistencia Mágica', desc: 'Tienes ventaja en todas las tiradas de salvación contra conjuros y otros efectos mágicos.' },
      { name: 'Resiliencia al Veneno', desc: 'Tienes resistencia al daño por Veneno y ventaja en salvaciones para evitar o terminar la condición Envenenado.' },
      { name: 'Hechicería Serpentina', desc: 'Conoces Rociada Venenosa y puedes lanzar Amistad con los Animales (solo sobre serpientes) sin límite. A nivel 3 lanzas Sugerencia una vez por descanso largo.' }
    ],
    description: 'Descendientes de un imperio que combinó magia de sangre y anatomía serpentina, dotados de resistencia mágica y fría astucia.'
  },

  // -------------------------------------------------------------
  // GUÍA DE VAN RICHTEN PARA RAVENLOFT: LINAJES GÓTICOS
  // -------------------------------------------------------------
  {
    id: 'dhampir',
    name: 'Dhampir (Linaje Vampírico)',
    speed: 10.5,
    size: 'Mediano o Pequeño',
    sizeChoice: 'Mediano o Pequeño',
    darkvision: 18,
    creatureType: 'Humanoide',
    sourceBook: 'Guía de Van Richten para Ravenloft',
    originTag: 'ravenloft',
    asiRule: '+2 a una / +1 a otra, o +1 a tres',
    languages: ['Común'],
    specialSpeeds: { climb: 10.5 },
    traits: [
      { name: 'Mordisco Vampírico', desc: 'Tus colmillos son armas naturales (usan Constitución para ataque y daño) que causan 1d4 + Con de daño perforante. Si tu vida es inferior a la mitad, al impactar recuperas vida igual al daño infligido o ganas esa cantidad como bonificación a tu próxima prueba/ataque (PB veces por descanso largo).' },
      { name: 'Trepar como Araña', desc: 'A partir de nivel 3 ganas velocidad de escalada de 10.5 metros y puedes moverte por paredes y techos dejando tus manos libres sin prueba de habilidad.' },
      { name: 'Naturaleza Inmortal', desc: 'No necesitas respirar.' }
    ],
    description: 'Atrapados entre la vida y la no-muerte por una maldición de sangre, los dhampir sacian su hambre sobrenatural mientras retienen su alma.'
  },
  {
    id: 'hexblood',
    name: 'Sangre de Bruja (Hexblood)',
    speed: 9,
    size: 'Mediano o Pequeño',
    sizeChoice: 'Mediano o Pequeño',
    darkvision: 18,
    creatureType: 'Feérico',
    sourceBook: 'Guía de Van Richten para Ravenloft',
    originTag: 'ravenloft',
    asiRule: '+2 a una / +1 a otra, o +1 a tres',
    languages: ['Común', 'Silvano'],
    traits: [
      { name: 'Magia de Bruja', desc: 'Puedes lanzar Disfrazarse y Falsa Vida una vez por descanso largo cada uno, usando Inteligencia, Sabiduría o Carisma.' },
      { name: 'Fetiche Espeluznante', desc: 'Como acción, arrancas un mechón de pelo, uña o diente para crear un fetiche mágico: puedes enviar mensajes telepáticos a quien lo porte hasta a 10 millas, o entrar en trance para ver y oír a través de él.' },
      { name: 'Ascendencia Feérica', desc: 'Ventaja en tiradas de salvación contra ser Hechizado.' }
    ],
    description: 'Marcados al nacer o por pactos con aquelarres de brujas, lucen una corona viviente de espinas o cuernos menores en su frente.'
  },
  {
    id: 'reborn',
    name: 'Renacido (Reborn)',
    speed: 9,
    size: 'Mediano o Pequeño',
    sizeChoice: 'Mediano o Pequeño',
    darkvision: 18,
    creatureType: 'Humanoide / No-muerto',
    sourceBook: 'Guía de Van Richten para Ravenloft',
    originTag: 'ravenloft',
    asiRule: '+2 a una / +1 a otra, o +1 a tres',
    languages: ['Común'],
    traits: [
      { name: 'Naturaleza Inerte', desc: 'Ventaja en salvaciones contra ser Envenenado y resistencia a daño por Veneno; ventaja en tiradas de salvación de Muerte; no necesitas comer, beber ni respirar; no necesitas dormir y completas descanso largo en 4 horas de inactividad.' },
      { name: 'Recuerdos de una Vida Pasada', desc: 'Al hacer una prueba de habilidad que falle, puedes tirar 1d6 y sumarlo al total (PB veces por descanso largo), recordando retazos de tu vida anterior antes de la muerte.' }
    ],
    description: 'Seres que escaparon de la tumba mediante magia nigromántica, experimentos de Frankenstein o caprichos del destino, con cicatrices cosidas en su carne.'
  }
];
