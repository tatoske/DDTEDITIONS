import {
  TreasureCrTier,
  GEMS_CATALOG,
  ART_OBJECTS_CATALOG,
  MAGIC_ITEMS_DMG_TABLES,
  GemItem,
  ArtObjectItem
} from '../data/treasureTablesData';
import { rollDice } from './dndMath';

export interface GeneratedTreasureResult {
  tier: TreasureCrTier;
  type: 'individual' | 'hoard';
  d100Roll: number;
  coins: {
    cp: number;
    sp: number;
    ep: number;
    gp: number;
    pp: number;
  };
  gems: Array<{ gem: GemItem; quantity: number }>;
  artObjects: Array<{ art: ArtObjectItem; quantity: number }>;
  magicItems: string[];
  totalValueGp: number;
}

/**
 * Convierte un alijo de monedas a su valor equivalente exacto en Piezas de Oro (GP).
 */
export function convertCoinsToGold(coins: { cp: number; sp: number; ep: number; gp: number; pp: number }): number {
  const gpFromCp = coins.cp / 100;
  const gpFromSp = coins.sp / 10;
  const gpFromEp = coins.ep / 2;
  const gpFromPp = coins.pp * 10;
  return Math.round((gpFromCp + gpFromSp + gpFromEp + coins.gp + gpFromPp) * 100) / 100;
}

/**
 * Selecciona una gema aleatoria de un valor determinado.
 */
function getRandomGem(value: number): GemItem {
  const list = GEMS_CATALOG[value] || GEMS_CATALOG[10];
  return list[Math.floor(Math.random() * list.length)];
}

/**
 * Selecciona un objeto de arte aleatorio de un valor determinado.
 */
function getRandomArt(value: number): ArtObjectItem {
  const list = ART_OBJECTS_CATALOG[value] || ART_OBJECTS_CATALOG[25];
  return list[Math.floor(Math.random() * list.length)];
}

/**
 * Selecciona un objeto mágico aleatorio de una tabla DMG.
 */
function getRandomMagicItem(tableName: string): string {
  const list = MAGIC_ITEMS_DMG_TABLES[tableName] || MAGIC_ITEMS_DMG_TABLES['tableA'];
  return list[Math.floor(Math.random() * list.length)];
}

/**
 * Genera tesoro individual según las tablas oficiales de la DMG 2024.
 */
export function generateIndividualTreasure(
  tier: TreasureCrTier,
  fixedD100Roll?: number
): GeneratedTreasureResult {
  const d100 = fixedD100Roll ?? Math.floor(Math.random() * 100) + 1;
  const coins = { cp: 0, sp: 0, ep: 0, gp: 0, pp: 0 };

  if (tier === 'tier1_cr0_4') {
    if (d100 <= 30) {
      coins.cp = rollDice('5d6').total;
    } else if (d100 <= 60) {
      coins.sp = rollDice('4d6').total;
    } else if (d100 <= 70) {
      coins.ep = rollDice('3d6').total;
    } else if (d100 <= 95) {
      coins.gp = rollDice('3d6').total;
    } else {
      coins.pp = rollDice('1d6').total;
    }
  } else if (tier === 'tier2_cr5_10') {
    if (d100 <= 30) {
      coins.cp = rollDice('4d6').total * 100;
      coins.ep = rollDice('1d6').total * 10;
    } else if (d100 <= 60) {
      coins.sp = rollDice('6d6').total * 10;
      coins.gp = rollDice('2d6').total * 10;
    } else if (d100 <= 70) {
      coins.ep = rollDice('3d6').total * 10;
      coins.gp = rollDice('2d6').total * 10;
    } else if (d100 <= 95) {
      coins.gp = rollDice('4d6').total * 10;
    } else {
      coins.gp = rollDice('2d6').total * 10;
      coins.pp = rollDice('3d6').total;
    }
  } else if (tier === 'tier3_cr11_16') {
    if (d100 <= 20) {
      coins.sp = rollDice('4d6').total * 100;
      coins.gp = rollDice('1d6').total * 100;
    } else if (d100 <= 35) {
      coins.ep = rollDice('1d6').total * 100;
      coins.gp = rollDice('1d6').total * 100;
    } else if (d100 <= 75) {
      coins.gp = rollDice('2d6').total * 100;
      coins.pp = rollDice('1d6').total * 10;
    } else {
      coins.gp = rollDice('2d6').total * 100;
      coins.pp = rollDice('2d6').total * 10;
    }
  } else {
    // tier4_cr17_plus
    if (d100 <= 15) {
      coins.ep = rollDice('2d6').total * 1000;
      coins.gp = rollDice('8d6').total * 100;
    } else if (d100 <= 55) {
      coins.gp = rollDice('1d6').total * 1000;
      coins.pp = rollDice('1d6').total * 100;
    } else {
      coins.gp = rollDice('1d6').total * 1000;
      coins.pp = rollDice('2d6').total * 100;
    }
  }

  const totalValueGp = convertCoinsToGold(coins);

  return {
    tier,
    type: 'individual',
    d100Roll: d100,
    coins,
    gems: [],
    artObjects: [],
    magicItems: [],
    totalValueGp
  };
}

/**
 * Genera una acumulación de tesoro de guarida (Hoard) según las tablas oficiales de la DMG 2024.
 */
export function generateHoardTreasure(
  tier: TreasureCrTier,
  fixedD100Roll?: number
): GeneratedTreasureResult {
  const d100 = fixedD100Roll ?? Math.floor(Math.random() * 100) + 1;
  const coins = { cp: 0, sp: 0, ep: 0, gp: 0, pp: 0 };
  const gems: Array<{ gem: GemItem; quantity: number }> = [];
  const artObjects: Array<{ art: ArtObjectItem; quantity: number }> = [];
  const magicItems: string[] = [];

  if (tier === 'tier1_cr0_4') {
    coins.cp = rollDice('6d6').total * 100;
    coins.sp = rollDice('3d6').total * 100;
    coins.gp = rollDice('2d6').total * 10;

    if (d100 >= 37 && d100 <= 60) {
      const q = rollDice('2d6').total;
      gems.push({ gem: getRandomGem(10), quantity: q });
    } else if (d100 >= 61 && d100 <= 75) {
      const q = rollDice('2d4').total;
      artObjects.push({ art: getRandomArt(25), quantity: q });
    } else if (d100 >= 76 && d100 <= 85) {
      const q = rollDice('2d6').total;
      gems.push({ gem: getRandomGem(50), quantity: q });
      const magicQty = rollDice('1d6').total;
      for (let i = 0; i < magicQty; i++) magicItems.push(getRandomMagicItem('tableA'));
    } else if (d100 >= 86 && d100 <= 97) {
      const q = rollDice('2d4').total;
      artObjects.push({ art: getRandomArt(25), quantity: q });
      const magicQty = rollDice('1d4').total;
      for (let i = 0; i < magicQty; i++) magicItems.push(getRandomMagicItem('tableB'));
    } else if (d100 >= 98) {
      const q = rollDice('2d6').total;
      gems.push({ gem: getRandomGem(50), quantity: q });
      const magicQty = rollDice('1d4').total;
      for (let i = 0; i < magicQty; i++) magicItems.push(getRandomMagicItem('tableC'));
    }
  } else if (tier === 'tier2_cr5_10') {
    coins.cp = rollDice('2d6').total * 100;
    coins.sp = rollDice('2d6').total * 1000;
    coins.gp = rollDice('6d6').total * 100;
    coins.pp = rollDice('3d6').total * 10;

    if (d100 >= 29 && d100 <= 40) {
      gems.push({ gem: getRandomGem(50), quantity: rollDice('3d6').total });
    } else if (d100 >= 41 && d100 <= 60) {
      artObjects.push({ art: getRandomArt(250), quantity: rollDice('2d4').total });
      const magicQty = rollDice('1d4').total;
      for (let i = 0; i < magicQty; i++) magicItems.push(getRandomMagicItem('tableB'));
    } else if (d100 >= 61 && d100 <= 78) {
      gems.push({ gem: getRandomGem(100), quantity: rollDice('3d6').total });
      const magicQty = rollDice('1d4').total;
      for (let i = 0; i < magicQty; i++) magicItems.push(getRandomMagicItem('tableC'));
    } else if (d100 >= 79 && d100 <= 94) {
      artObjects.push({ art: getRandomArt(250), quantity: rollDice('2d4').total });
      const magicQty = rollDice('1d4').total;
      for (let i = 0; i < magicQty; i++) magicItems.push(getRandomMagicItem('tableF'));
    } else if (d100 >= 95) {
      gems.push({ gem: getRandomGem(100), quantity: rollDice('3d6').total });
      const magicQty = rollDice('1d4').total;
      for (let i = 0; i < magicQty; i++) magicItems.push(getRandomMagicItem('tableG'));
    }
  } else if (tier === 'tier3_cr11_16') {
    coins.gp = rollDice('4d6').total * 1000;
    coins.pp = rollDice('5d6').total * 100;

    if (d100 >= 16 && d100 <= 35) {
      artObjects.push({ art: getRandomArt(250), quantity: rollDice('2d4').total });
    } else if (d100 >= 36 && d100 <= 50) {
      gems.push({ gem: getRandomGem(500), quantity: rollDice('3d6').total });
      const magicQty = rollDice('1d4').total;
      for (let i = 0; i < magicQty; i++) magicItems.push(getRandomMagicItem('tableF'));
    } else if (d100 >= 51 && d100 <= 72) {
      artObjects.push({ art: getRandomArt(750), quantity: rollDice('2d4').total });
      const magicQty = rollDice('1d4').total;
      for (let i = 0; i < magicQty; i++) magicItems.push(getRandomMagicItem('tableG'));
    } else if (d100 >= 73 && d100 <= 92) {
      gems.push({ gem: getRandomGem(500), quantity: rollDice('3d6').total });
      const magicQty = rollDice('1d4').total;
      for (let i = 0; i < magicQty; i++) magicItems.push(getRandomMagicItem('tableH'));
    } else if (d100 >= 93) {
      artObjects.push({ art: getRandomArt(750), quantity: rollDice('2d4').total });
      magicItems.push(getRandomMagicItem('tableI'));
    }
  } else {
    // tier4_cr17_plus
    coins.gp = rollDice('12d6').total * 1000;
    coins.pp = rollDice('8d6').total * 1000;

    if (d100 <= 15) {
      gems.push({ gem: getRandomGem(1000), quantity: rollDice('3d6').total });
      const magicQty = rollDice('1d8').total;
      for (let i = 0; i < magicQty; i++) magicItems.push(getRandomMagicItem('tableC'));
    } else if (d100 <= 55) {
      artObjects.push({ art: getRandomArt(2500), quantity: rollDice('1d10').total });
      const magicQty = rollDice('1d6').total;
      for (let i = 0; i < magicQty; i++) magicItems.push(getRandomMagicItem('tableG'));
    } else if (d100 <= 80) {
      gems.push({ gem: getRandomGem(5000), quantity: rollDice('1d4').total });
      const magicQty = rollDice('1d6').total;
      for (let i = 0; i < magicQty; i++) magicItems.push(getRandomMagicItem('tableH'));
    } else {
      artObjects.push({ art: getRandomArt(7500), quantity: rollDice('1d4').total });
      const magicQty = rollDice('1d4').total;
      for (let i = 0; i < magicQty; i++) magicItems.push(getRandomMagicItem('tableI'));
    }
  }

  let gemsValue = 0;
  gems.forEach(g => { gemsValue += g.gem.valueGp * g.quantity; });

  let artValue = 0;
  artObjects.forEach(a => { artValue += a.art.valueGp * a.quantity; });

  const totalValueGp = Math.round((convertCoinsToGold(coins) + gemsValue + artValue) * 100) / 100;

  return {
    tier,
    type: 'hoard',
    d100Roll: d100,
    coins,
    gems,
    artObjects,
    magicItems,
    totalValueGp
  };
}
