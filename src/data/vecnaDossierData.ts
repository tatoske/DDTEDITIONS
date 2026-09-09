import { Monster } from '../types/dnd';

export interface VecnaArtifactDef {
  id: string;
  name: string;
  type: string;
  attunementRequirement: string;
  graftingInstruction: string;
  benefitsMinor: string[];
  benefitsMajor: string[];
  detrimentsMinor: string[];
  detrimentsMajor: string[];
  spellsGranted: string[];
  curseLore: string;
  badgeColor: string;
}

export const VECNA_AVATAR_MONSTER: Monster = {
  id: 'vecna_archlich_avatar',
  name: 'Vecna, el Archiliche del Ojo Oculto',
  size: 'Mediano',
  type: 'No-muerto (Mago Supremo)',
  alignment: 'Neutral Maligno',
  cr: '26',
  xp: 90000,
  ac: 18,
  acType: 'Armadura natural arcana',
  hp: 272,
  hitDice: '32d8 + 128',
  speed: '9 metros, volar 9 metros (levitación)',
  abilities: { str: 14, dex: 16, con: 18, int: 22, wis: 24, cha: 16 },
  savingThrows: 'Con +12, Int +14, Sab +15',
  skills: 'Arcanos +22, Historia +14, Perspicacia +15, Percepción +15',
  damageResistances: 'Frío, Rayo, Necrótico',
  damageImmunities: 'Veneno; Contundente, Perforante y Cortante de ataques no mágicos',
  conditionImmunities: 'Hechizado, Agotamiento, Asustado, Paralizado, Envenenado, Aturdido',
  senses: 'Vista verdadera 36 m, Percepción pasiva 25',
  languages: 'Común, Dracónico, Élfico, Infernal, Subterráneo, telepatía 36 m',
  traits: [
    {
      name: 'Resistencia Legendaria (5/Día)',
      desc: 'Si Vecna falla una tirada de salvación, puede elegir tener éxito en su lugar.'
    },
    {
      name: 'Regeneración Nigromántica',
      desc: 'Vecna recupera 20 puntos de golpe al inicio de su turno si tiene al menos 1 punto de golpe.'
    },
    {
      name: 'Inmortalidad del Ojo Oculto',
      desc: 'Si Vecna es destruido, su alma se refugia en el plano de las sombras y se reconstituye en un nuevo cuerpo físico en 1d100 días.'
    }
  ],
  actions: [
    {
      name: 'Ataque Múltiple',
      desc: 'Vecna realiza dos ataques con Daga Crepuscular o usa Explosión Podrida.'
    },
    {
      name: 'Daga Crepuscular (Afterthought)',
      desc: 'Ataque de arma cuerpo a cuerpo o a distancia mágica: +13 al impacto, alcance 1.5 m o 18 m. Impacto: 7 (1d4 + 5) de daño perforante más 9 (2d8) de daño necrótico. El objetivo no puede recuperar puntos de golpe hasta el inicio del siguiente turno de Vecna.',
      attackBonus: 13,
      damageDice: '1d4 + 5 + 2d8',
      damageType: 'Perforante + Necrótico'
    },
    {
      name: 'Explosión Podrida (Rotten Burst)',
      desc: 'Vecna desata una descarga de entropía en un punto a 36 m. Cada criatura en un radio de 6 m debe hacer una salvación de Constitución CD 22, recibiendo 36 (8d8) de daño necrótico con fallo, o la mitad con éxito.',
      attackBonus: 0,
      damageDice: '8d8',
      damageType: 'Necrótico'
    },
    {
      name: 'Alarido de los Caídos (Recarga 5-6)',
      desc: 'Vecna libera las almas que ha consumido en un cono de 18 m. Cada criatura debe superar una salvación de Sabiduría CD 22 o recibir 54 (12d8) de daño psíquico y quedar Asustada durante 1 minuto.',
      attackBonus: 0,
      damageDice: '12d8',
      damageType: 'Psíquico'
    }
  ],
  reactions: [
    {
      name: 'Contramagia Sombría (3/Día)',
      desc: 'Cuando Vecna ve a una criatura a 18 m lanzar un conjuro, interrumpe el conjuro instantáneamente sin tirada. El lanzador del conjuro recibe 10 (3d6) de daño psíquico.'
    },
    {
      name: 'Paso Fantasmal',
      desc: 'En respuesta a recibir daño, Vecna se teletransporta mágicamente hasta 9 metros a un espacio desocupado que pueda ver.'
    }
  ],
  legendaryActions: [
    {
      name: 'Viaje Dimensional',
      desc: 'Vecna se teletransporta hasta 9 metros a un espacio desocupado sin provocar ataques de oportunidad.',
      cost: 1
    },
    {
      name: 'Toque de la Muerte',
      desc: 'Ataque cuerpo a cuerpo: +13 al impacto. Impacto: 22 (4d10) de daño necrótico y el objetivo queda Envenenado por 1 asalto.',
      cost: 2
    },
    {
      name: 'Rayo Desintegrador de Sombras',
      desc: 'Dispara un haz espectral a una criatura a 18 m. Salvación de Destreza CD 22 o recibe 45 (10d6 + 10) de daño de fuerza.',
      cost: 3
    }
  ],
  sourceBook: 'Dossier de Vecna'
};

export const VECNA_ARTIFACTS: VecnaArtifactDef[] = [
  {
    id: 'eye_of_vecna',
    name: 'El Ojo de Vecna (Eye of Vecna)',
    type: 'Artefacto Mayor Legendario (Ocular)',
    attunementRequirement: 'Requiere extirpar el propio ojo e incrustar el artefacto en la cuenca vacía.',
    graftingInstruction: 'Para sintonizarse, el portador debe arrancarse uno de sus propios ojos e insertar el Ojo de Vecna. El artefacto se injerta al instante mediante nervios de sangre negra.',
    benefitsMinor: [
      'Ganas Vista Verdadera de 36 metros de alcance permanente.',
      '+1 a todas las tiradas de salvación de Inteligencia y Sabiduría.'
    ],
    benefitsMajor: [
      'Ganas Resistencia al daño Necrótico y por Veneno.',
      'Tu puntuación de Inteligencia o Sabiduría aumenta en 2 (hasta un máximo de 24).'
    ],
    detrimentsMinor: [
      'Tu aspecto se vuelve cadavérico y tu sombra parece moverse independientemente.',
      'Los animales domésticos a menos de 9 metros se ponen nerviosos y aúllan.'
    ],
    detrimentsMajor: [
      'Cada vez que lanzas un conjuro del Ojo, hay un 5% de probabilidad de que el espíritu de Vecna intente poseer tu cuerpo permanentemente.'
    ],
    spellsGranted: [
      'Clarividencia (a voluntad)',
      'Corona de Locura (a voluntad)',
      'Desintegrar (1/Día)',
      'Dominar Monstruo (1/Día)',
      'Rayo Ocular de la Muerte (1/Día)'
    ],
    curseLore: 'Si el portador muere mientras está sintonizado, su alma es devorada inmediatamente por Vecna y su cuerpo se alza como un siervo no-muerto.',
    badgeColor: '#7c3aed'
  },
  {
    id: 'hand_of_vecna',
    name: 'La Mano de Vecna (Hand of Vecna)',
    type: 'Artefacto Mayor Legendario (Brazo Izquierdo)',
    attunementRequirement: 'Requiere amputar la propia mano izquierda en la muñeca y presionar la Mano de Vecna al muñón.',
    graftingInstruction: 'La Mano de Vecna se fusiona instantáneamente a la carne y hueso del brazo izquierdo con tendones momificados negros.',
    benefitsMinor: [
      'Tu puntuación de Fuerza se convierte automáticamente en 20 (a menos que ya fuera superior).',
      'Tus ataques desarmados o armas empuñadas con esta mano infligen 2d8 adicionales de daño por frío.'
    ],
    benefitsMajor: [
      'Ganas la capacidad de lanzar Dedo de la Muerte (Finger of Death) una vez al día.',
      'Tus golpes críticos cuerpo a cuerpo restauran puntos de golpe iguales al daño infligido.'
    ],
    detrimentsMinor: [
      'Tus uñas crecen como garras negras y no puedes sostener agua bendita sin que hierva.',
      'Emite un hedor tenue a tumba antigua perceptible a 3 metros.'
    ],
    detrimentsMajor: [
      'Cualquier acto de bondad o piedad requiere superar una salvación de Sabiduría CD 18 para no verse obligado a cometer un acto de crueldad despiadada.'
    ],
    spellsGranted: [
      'Rayo Abrasador (a voluntad)',
      'Ralentizar (1/Día)',
      'Dedo de la Muerte (1/Día)',
      'Telequinesis (1/Día)',
      'Deseo (solo si el Ojo y la Mano están injertados en el mismo cuerpo)'
    ],
    curseLore: 'Si tanto el Ojo como la Mano están injertados en el mismo ser, el personaje puede lanzar Deseo una vez cada 30 días, pero cada uso tiene un 10% de probabilidad de convocar al Avatar de Vecna para reclamar su cuerpo.',
    badgeColor: '#b91c1c'
  },
  {
    id: 'book_of_vile_darkness',
    name: 'El Libro de la Vil Oscuridad (Book of Vile Darkness)',
    type: 'Tomo de Conocimiento Supremo Prohibido',
    attunementRequirement: 'Requiere 80 horas de lectura concentrada por un lanzador de conjuros no alineado con el Bien.',
    graftingInstruction: 'El tomo está encuadernado en piel de ángel desollado y cerrado con cerrojos de hierro negro.',
    benefitsMinor: [
      'Ganas competencia y pericia (doble competencia) en la habilidad Conocimiento Arcano y Religión.',
      'Comprendes todos los idiomas oscuros y abisales del multiverso.'
    ],
    benefitsMajor: [
      'Una característica mental a tu elección (Inteligencia o Carisma) aumenta en 2 puntos hasta un máximo de 22.',
      'Tus conjuros de nigromancia infligen su daño máximo posible contra celestiales y humanoides.'
    ],
    detrimentsMinor: [
      'La luz solar te resulta molesta (ojos inyectados en sangre).',
      'Las plantas a tu paso se marchitan.'
    ],
    detrimentsMajor: [
      'El tomo susurra constantemente crueldades en tu mente; si pasas 24 horas sin leerlo, sufres 2 niveles de agotamiento.'
    ],
    spellsGranted: [
      'Animar a los Muertos (a voluntad)',
      'Crear No-Muerto (1/Día)',
      'Círculo de Muerte (1/Día)',
      'Palabra de Poder: Matar (1/Mes)'
    ],
    curseLore: 'Destruir el libro requiere que sea bañado en las lágrimas de un dios solar puro o arrojado a la Forja Solar de Mount Celestia.',
    badgeColor: '#0f172a'
  }
];

export const VECNA_CULT_SECRETS = [
  {
    title: 'El Ritual de la Ascensión Oculta',
    desc: 'Los sectarios de Vecna creen que cada secreto susurrado que alguien guarda en el mundo añade un hilo de poder a la red del dios de los secretos.'
  },
  {
    title: 'La Cripta de los Tres Sellos',
    desc: 'Bajo las ruinas de Oerth descansa la tumba falsa donde Vecna dejó copias imperfectas de su Ojo para probar la ambición de los mortales.'
  },
  {
    title: 'El Sacrificio de la Memoria',
    desc: 'Para obtener un favor del Culto del Ojo Oculto, el suplicante debe borrar permanentemente de su propia mente el recuerdo de su primer amor o de su hogar natal.'
  }
];
