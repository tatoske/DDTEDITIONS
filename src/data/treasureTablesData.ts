export interface GemItem {
  name: string;
  valueGp: number;
  description: string;
}

export interface ArtObjectItem {
  name: string;
  valueGp: number;
  description: string;
}

export type TreasureCrTier = 'tier1_cr0_4' | 'tier2_cr5_10' | 'tier3_cr11_16' | 'tier4_cr17_plus';
export type TreasureType = 'individual' | 'hoard';

export const GEMS_CATALOG: Record<number, GemItem[]> = {
  10: [
    { name: 'Azurita', valueGp: 10, description: 'Mineral opaco y moteado de azul profundo.' },
    { name: 'Ágata Bandeada', valueGp: 10, description: 'Piedra con franjas translúcidas marrones y blancas.' },
    { name: 'Ojo de Tigre', valueGp: 10, description: 'Gema translúcida con un brillo dorado interior.' },
    { name: 'Malaquita', valueGp: 10, description: 'Piedra opaca con vetas verdes oscuras concéntricas.' },
    { name: 'Turquesa', valueGp: 10, description: 'Piedra opaca de color azul verdoso brillante.' },
    { name: 'Obsidiana', valueGp: 10, description: 'Vidrio volcánico negro lustroso e impenetrable.' }
  ],
  50: [
    { name: 'Jaspe Sanguíneo (Hematita)', valueGp: 50, description: 'Gema gris acero brillante o jaspe con motas rojas.' },
    { name: 'Cornalina', valueGp: 50, description: 'Calcedonia translúcida que varía de naranja a rojo sangre.' },
    { name: 'Calcedonia', valueGp: 50, description: 'Piedra translúcida con tono blanco lechoso o lavanda.' },
    { name: 'Crisoprasa', valueGp: 50, description: 'Piedra translúcida verde manzana pálido.' },
    { name: 'Ópalo de Luna (Moonstone)', valueGp: 50, description: 'Blanco traslúcido con destellos azulosos.' },
    { name: 'Citrino', valueGp: 50, description: 'Cuarzo translúcido de color amarillo pálido.' }
  ],
  100: [
    { name: 'Ámbar', valueGp: 100, description: 'Resina fósil translúcida de tono dorado, a menudo con un insecto atrapado.' },
    { name: 'Amatista', valueGp: 100, description: 'Cristal translúcido púrpura imperial profundo.' },
    { name: 'Granate', valueGp: 100, description: 'Gema transparente de color rojo intenso o musgo.' },
    { name: 'Jade', valueGp: 100, description: 'Piedra verde translúcida tallada con reverencia.' },
    { name: 'Perla Blanca', valueGp: 100, description: 'Esfera nacarada lustrosa obtenida de ostras gigantes.' },
    { name: 'Turmalina', valueGp: 100, description: 'Cristal transparente que combina verde y rosa brillante.' }
  ],
  500: [
    { name: 'Alejandrita', valueGp: 500, description: 'Gema transparente que cambia de verde a rojo según la luz.' },
    { name: 'Aguamarina', valueGp: 500, description: 'Cristal transparente de color azul océano pálido.' },
    { name: 'Perla Negra', valueGp: 500, description: 'Perla marina oscura con irisaciones violáceas.' },
    { name: 'Topacio', valueGp: 500, description: 'Gema transparente de brillo dorado o miel pura.' },
    { name: 'Espinela Azul', valueGp: 500, description: 'Cristal de un azul zafiro intenso sin imperfecciones.' }
  ],
  1000: [
    { name: 'Esmeralda', valueGp: 1000, description: 'Gema verde brillante de brillo fascinante.' },
    { name: 'Rubí', valueGp: 1000, description: 'Corindón carmesí translúcido, la gema de la pasión bélica.' },
    { name: 'Zafiro Azul', valueGp: 1000, description: 'Cristal celeste impenetrable sin fracturas.' },
    { name: 'Ópalo de Fuego', valueGp: 1000, description: 'Gema ardiente con reflejos interiores escarlata y naranja.' }
  ],
  5000: [
    { name: 'Diamante', valueGp: 5000, description: 'Gema transparente e indestructible, catalizador para resurrecciones milagrosas.' },
    { name: 'Rubí Estrella', valueGp: 5000, description: 'Rubí con una estrella de seis puntas que danza en su superficie.' },
    { name: 'Zafiro Negro', valueGp: 5000, description: 'Zafiro abisal oscuro con destellos diamantinos.' },
    { name: 'Jacinto de Fuego', valueGp: 5000, description: 'Gema naranja resplandeciente del plano elemental de fuego.' }
  ]
};

export const ART_OBJECTS_CATALOG: Record<number, ArtObjectItem[]> = {
  25: [
    { name: 'Jarra de plata labrada', valueGp: 25, description: 'Jarra con relieves de ciervos y hojas de roble.' },
    { name: 'Estatuilla de hueso tallado', valueGp: 25, description: 'Figura pequeña de una doncella o bestia feérica.' },
    { name: 'Cáliz de peltre y latón dorado', valueGp: 25, description: 'Copa grabada con el escudo de una casa noble extinta.' },
    { name: 'Peineta de carey con incrustaciones de plata', valueGp: 25, description: 'Accesorio ornamental de alcurnia.' }
  ],
  250: [
    { name: 'Anillo de oro con camafeo tallado', valueGp: 250, description: 'Anillo de sello con un perfil en ónice.' },
    { name: 'Cáliz de plata dorada con azuritas', valueGp: 250, description: 'Copa litúrgica con cuatro gemas azules en la base.' },
    { name: 'Tapiz de seda bordado con hilo de oro', valueGp: 250, description: 'Representa una batalla contra un dragón verde.' },
    { name: 'Estatuilla de bronce de un grifo', valueGp: 250, description: 'Escultura con ojos de malaquita verde brillante.' }
  ],
  750: [
    { name: 'Cáliz de oro puro con amatistas', valueGp: 750, description: 'Obra maestra de orfebrería con seis amatistas engastadas.' },
    { name: 'Máscara ceremonial de plata y jade', valueGp: 750, description: 'Máscara sacerdotal que representa un rostro celestial.' },
    { name: 'Joyero de ébano con incrustaciones de nácar y oro', valueGp: 750, description: 'Caja con cerradura de alta artesanía.' }
  ],
  2500: [
    { name: 'Corona enjoyada de oro y esmeraldas', valueGp: 2500, description: 'Diadema imperial de un antiguo soberano de Faerûn.' },
    { name: 'Cetro de platino con un rubí en la cúspide', valueGp: 2500, description: 'Símbolo de realeza y autoridad marcial.' },
    { name: 'Guantelete ceremonial de oro con zafiros', valueGp: 2500, description: 'Armadura ornamental con joyas en cada nudillo.' }
  ],
  7500: [
    { name: 'Corona imperial de diamantes y platino', valueGp: 7500, description: 'La cúspide de la orfebrería real, codiciada por imperios enteros.' },
    { name: 'Ídolo de oro macizo con ojos de rubí estrella', valueGp: 7500, description: 'Reliquia sagrada de tres palmos de altura y 20 kilos de oro.' }
  ]
};

export const MAGIC_ITEMS_DMG_TABLES: Record<string, string[]> = {
  tableA: [
    'Poción de Curación (2d4+2)',
    'Pergamino de Truco (Cantrip)',
    'Poción de Trepar',
    'Pergamino de Nivel 1',
    'Bolsa de Trucos Gris'
  ],
  tableB: [
    'Poción de Curación Mayor (4d4+4)',
    'Poción de Aliento de Fuego',
    'Poción de Resistencia al Fuego',
    'Pergamino de Nivel 2',
    'Ungüento de Keoghtom',
    'Bolsa de Contención (Bag of Holding)',
    'Capa de Respirar en el Agua'
  ],
  tableC: [
    'Poción de Curación Superior (8d4+8)',
    'Pergamino de Nivel 4',
    'Poción de Clarividencia',
    'Poción de Invulnerabilidad',
    'Perlas de Poder',
    'Piedra de la Buena Suerte (+1)',
    'Collar de Adaptación'
  ],
  tableD: [
    'Poción de Curación Suprema (10d4+20)',
    'Poción de Invisibilidad',
    'Poción de Velocidad',
    'Pergamino de Nivel 6',
    'Herraduras de Velocidad'
  ],
  tableF: [
    'Arma +1 (Espada Larga / Arco)',
    'Escudo +1',
    'Broche de Escudo',
    'Botas de Élficas',
    'Capa de Protección (+1 CA y Salvaciones)',
    'Varita de Proyectiles Mágicos'
  ],
  tableG: [
    'Arma +2 (Flamígera / Cazadora)',
    'Armadura de Cuero Tachonado +1',
    'Cinturón de Fuerza de Gigante de la Colina (Fuerza 21)',
    'Anillo de Protección (+1 CA)',
    'Capa del Murciélago',
    'Casco de Telepatía'
  ],
  tableH: [
    'Arma +3 Legendaria',
    'Armadura de Placas +2',
    'Amuleto de los Planos',
    'Cinturón de Gigante de Fuego (Fuerza 25)',
    'Túnica de los Archimagos',
    'Espejo de Atrapamiento de Vida'
  ],
  tableI: [
    'Espada Sagrada Vengadora',
    'Armadura de Placas +3',
    'Anillo de los Tres Deseos',
    'Orbe de Dragón',
    'Martillo de los Rayos'
  ]
};
