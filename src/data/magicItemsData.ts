export interface MagicItem {
  id: string;
  name: string;
  type: 'Arma' | 'Armadura' | 'Poción' | 'Pergamino' | 'Anillo' | 'Vara' | 'Varita' | 'Objeto Maravilloso';
  rarity: 'Común' | 'Poco común' | 'Raro' | 'Muy raro' | 'Legendario' | 'Artefacto';
  requiresAttunement: boolean;
  attunementDetails?: string;
  description: string;
  sourceBook: string;
}

export const INITIAL_MAGIC_ITEMS: MagicItem[] = [
  {
    id: 'pocion-curacion-suprema',
    name: 'Poción de Curación Suprema',
    type: 'Poción',
    rarity: 'Muy raro',
    requiresAttunement: false,
    description: 'Restaura 10d4 + 20 puntos de golpe al beberse. En las reglas D&D 2024, beber una poción propia es una Acción Adicional.',
    sourceBook: 'Guía del Dungeon Master 2024'
  },
  {
    id: 'bolsa-de-contencion',
    name: 'Bolsa de Contención (Bag of Holding)',
    type: 'Objeto Maravilloso',
    rarity: 'Poco común',
    requiresAttunement: false,
    description: 'Esta bolsa tiene un espacio interior mucho mayor que sus dimensiones exteriores: 0.6 m de diámetro en la boca y 1.2 m de profundidad. Puede albergar hasta 225 kg (500 lb) sin exceder un volumen de 1.8 metros cúbicos. Pesa siempre 6.8 kg.',
    sourceBook: 'Guía del Dungeon Master 2024'
  },
  {
    id: 'arma-mas-uno',
    name: 'Arma +1 (Espada, Hacha, Arco, etc.)',
    type: 'Arma',
    rarity: 'Poco común',
    requiresAttunement: false,
    description: 'Obtienes un bonificador de +1 en las tiradas de ataque y daño realizadas con esta arma mágica.',
    sourceBook: 'Guía del Dungeon Master 2024'
  },
  {
    id: 'espada-flamigera',
    name: 'Espada Flamígera (Flame Tongue)',
    type: 'Arma',
    rarity: 'Raro',
    requiresAttunement: true,
    attunementDetails: 'Cualquier espada',
    description: 'Como acción adicional, pronuncias la palabra de mando y la hoja se envuelve en llamas. Emite luz brillante en 12 m. Mientras esté en llamas, inflige 2d6 de daño por fuego adicional en cada impacto.',
    sourceBook: 'Guía del Dungeon Master 2024'
  },
  {
    id: 'anillo-de-proteccion',
    name: 'Anillo de Protección',
    type: 'Anillo',
    rarity: 'Raro',
    requiresAttunement: true,
    description: 'Ganas un bonificador de +1 a tu Clase de Armadura y a todas las tiradas de salvación mientras lleves puesto este anillo.',
    sourceBook: 'Guía del Dungeon Master 2024'
  },
  {
    id: 'botas-elficas',
    name: 'Botas Élficas (Boots of Elvenkind)',
    type: 'Objeto Maravilloso',
    rarity: 'Poco común',
    requiresAttunement: false,
    description: 'Tus pasos no hacen ningún ruido independientemente de la superficie sobre la que camines. Tienes ventaja en pruebas de Destreza (Sigilo) que dependan de moverte en silencio.',
    sourceBook: 'Guía del Dungeon Master 2024'
  },
  {
    id: 'capa-del-desplazador',
    name: 'Capa del Desplazador (Cloak of Displacement)',
    type: 'Objeto Maravilloso',
    rarity: 'Raro',
    requiresAttunement: true,
    description: 'La capa proyecta una ilusión engañosa de tu posición. Las criaturas tienen desventaja en las tiradas de ataque contra ti. Si recibes daño, la propiedad se interrumpe hasta el inicio de tu siguiente turno.',
    sourceBook: 'Guía del Dungeon Master 2024'
  },
  {
    id: 'amuleto-de-salud',
    name: 'Amuleto de Salud',
    type: 'Objeto Maravilloso',
    rarity: 'Raro',
    requiresAttunement: true,
    description: 'Tu puntuación de Constitución pasa a ser 19 mientras lleves este amuleto. No tiene efecto si tu Constitución ya es 19 o superior.',
    sourceBook: 'Guía del Dungeon Master 2024'
  },
  {
    id: 'vengadora-sagrada',
    name: 'Vengadora Sagrada (Holy Avenger)',
    type: 'Arma',
    rarity: 'Legendario',
    requiresAttunement: true,
    attunementDetails: 'Exclusivo para Paladín',
    description: 'Bono de +3 a ataque y daño. Inflige 2d10 de daño radiante adicional contra infernales y no-muertos. Emite un aura sagrada de 3 metros que otorga ventaja en tiradas de salvación contra conjuros y efectos mágicos a ti y a todos tus aliados.',
    sourceBook: 'Guía del Dungeon Master 2024'
  },
  {
    id: 'ojo-de-vecna',
    name: 'El Ojo de Vecna',
    type: 'Objeto Maravilloso',
    rarity: 'Artefacto',
    requiresAttunement: true,
    attunementDetails: 'Requiere arrancarse un ojo e implantarse el artefacto en la cuenca',
    description: 'Otorga Visión Verdadera constante de 36 metros, visión en rayos X y permite lanzar conjuros de poder descomunal: Clarividencia, Desintegrar, Ocurrencia, Telequinesis y Corona de Locura. Cada vez que lanzas un conjuro, Vecna intenta poseer tu cuerpo.',
    sourceBook: 'Dossier de Vecna'
  }
];
