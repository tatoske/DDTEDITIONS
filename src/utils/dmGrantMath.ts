import { Character, CharacterItem, CharacterWeapon } from '../types/dnd';

export interface GrantRewardPayload {
  itemName?: string;
  itemCategory?: 'item' | 'weapon' | 'potion' | 'scroll' | 'relic';
  itemRarity?: 'Común' | 'Poco Común' | 'Raro' | 'Muy Raro' | 'Legendario' | 'Artefacto';
  itemQuantity?: number;
  itemDescription?: string;
  itemEquipped?: boolean;
  damageDice?: string;
  attackBonus?: number;
  damageType?: string;
  // Monedas
  gp?: number;
  goldDragons?: number;
  // Experiencia
  experience?: number;
  // Notas o motivo
  reason?: string;
}

/**
 * Concede un objeto o arma al inventario o equipo de un personaje
 */
export function grantItemToCharacter(
  character: Character,
  payload: GrantRewardPayload
): Character {
  if (!payload.itemName || !payload.itemName.trim()) {
    return character;
  }

  const cleanName = payload.itemName.trim();
  const quantity = Math.max(1, payload.itemQuantity || 1);
  const isWeapon = payload.itemCategory === 'weapon';

  let updatedInventory = [...character.inventory];
  let updatedWeapons = [...(character.weapons || [])];

  if (isWeapon) {
    const newWeapon: CharacterWeapon = {
      id: `grant_wpn_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: payload.itemRarity && payload.itemRarity !== 'Común' ? `${cleanName} (${payload.itemRarity})` : cleanName,
      attackBonus: payload.attackBonus ?? 5,
      damageDice: payload.damageDice || '1d8 + 3',
      damageType: payload.damageType || 'Cortante',
      properties: payload.itemDescription || 'Arma mágica otorgada por el Dungeon Master'
    };
    updatedWeapons.push(newWeapon);
  }

  // También se registra en el inventario general
  const existingIdx = updatedInventory.findIndex(i => i.name.toLowerCase() === cleanName.toLowerCase());
  if (existingIdx >= 0 && !isWeapon) {
    updatedInventory[existingIdx] = {
      ...updatedInventory[existingIdx],
      quantity: updatedInventory[existingIdx].quantity + quantity
    };
  } else {
    const newItem: CharacterItem = {
      id: `grant_itm_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: payload.itemRarity && payload.itemRarity !== 'Común' && !cleanName.includes('(') ? `${cleanName} (${payload.itemRarity})` : cleanName,
      quantity,
      equipped: Boolean(payload.itemEquipped),
      description: payload.itemDescription || `Otorgado por el DM. ${payload.reason || ''}`.trim()
    };
    updatedInventory.push(newItem);
  }

  return {
    ...character,
    inventory: updatedInventory,
    weapons: updatedWeapons,
    updatedAt: new Date().toISOString()
  };
}

/**
 * Concede monedas estándar o Dragones de Oro (DO) al personaje
 */
export function grantCurrencyToCharacter(
  character: Character,
  coins: { cp?: number; sp?: number; ep?: number; gp?: number; pp?: number; goldDragons?: number },
  reason: string = 'Recompensa del Dungeon Master'
): Character {
  const currentCoins = character.coins || { cp: 0, sp: 0, ep: 0, gp: 0, pp: 0 };
  const updatedCoins = {
    cp: Math.max(0, currentCoins.cp + (coins.cp || 0)),
    sp: Math.max(0, currentCoins.sp + (coins.sp || 0)),
    ep: Math.max(0, currentCoins.ep + (coins.ep || 0)),
    gp: Math.max(0, currentCoins.gp + (coins.gp || 0)),
    pp: Math.max(0, currentCoins.pp + (coins.pp || 0))
  };

  const updatedGoldDragons = Math.max(0, (character.goldDragons || 0) + (coins.goldDragons || 0));

  // Registrar en crónicas del grimorio si aplica
  let chronicles = [...(character.adventureChronicles || [])];
  if (coins.goldDragons && coins.goldDragons > 0) {
    chronicles.unshift({
      id: `record_do_${Date.now()}`,
      questId: `grant_do_${Date.now()}`,
      questTitle: reason,
      masterName: 'Dungeon Master',
      sessionDate: new Date().toLocaleDateString('es-ES'),
      rankClass: 'B',
      outcome: 'victory',
      goldEarned: coins.goldDragons,
      chronicleNotes: `Concesión directa: +${coins.goldDragons} Dragones de Oro.`,
      recordedAt: new Date().toISOString()
    });
  }

  return {
    ...character,
    coins: updatedCoins,
    goldDragons: updatedGoldDragons,
    adventureChronicles: chronicles,
    updatedAt: new Date().toISOString()
  };
}

/**
 * Concede experiencia (XP) al personaje y detecta subida de nivel
 */
export function grantExperienceToCharacter(
  character: Character,
  xpAmount: number
): { updatedCharacter: Character; leveledUp: boolean; newLevel: number } {
  const cleanXp = Math.max(0, xpAmount);
  const newXpTotal = (character.experience || 0) + cleanXp;

  // Umbrales oficiales de XP en 5e / 2024
  const XP_LEVELS = [
    0, 300, 900, 2700, 6500, 14000, 23000, 34000, 48000, 64000,
    85000, 100000, 120000, 140000, 165000, 195000, 225000, 265000, 305000, 355000
  ];

  let calculatedLevel = 1;
  for (let i = XP_LEVELS.length - 1; i >= 0; i--) {
    if (newXpTotal >= XP_LEVELS[i]) {
      calculatedLevel = i + 1;
      break;
    }
  }

  const leveledUp = calculatedLevel > character.level;
  const newLevel = Math.max(character.level, calculatedLevel);

  const updatedCharacter: Character = {
    ...character,
    experience: newXpTotal,
    level: newLevel,
    updatedAt: new Date().toISOString()
  };

  return { updatedCharacter, leveledUp, newLevel };
}

/**
 * Procesa una concesión compuesta de recompensa (Objeto + Monedas + XP)
 */
export function processDmFullGrant(
  character: Character,
  payload: GrantRewardPayload
): { updatedCharacter: Character; summaryMessage: string } {
  let updated = { ...character };
  const grantedParts: string[] = [];

  // 1. Objeto
  if (payload.itemName && payload.itemName.trim()) {
    updated = grantItemToCharacter(updated, payload);
    grantedParts.push(`"${payload.itemName.trim()}" (x${payload.itemQuantity || 1})`);
  }

  // 2. Monedas
  if ((payload.gp && payload.gp > 0) || (payload.goldDragons && payload.goldDragons > 0)) {
    updated = grantCurrencyToCharacter(updated, {
      gp: payload.gp || 0,
      goldDragons: payload.goldDragons || 0
    }, payload.reason || 'Recompensa del DM');

    if (payload.gp && payload.gp > 0) grantedParts.push(`${payload.gp} PO`);
    if (payload.goldDragons && payload.goldDragons > 0) grantedParts.push(`${payload.goldDragons} DO`);
  }

  // 3. Experiencia
  if (payload.experience && payload.experience > 0) {
    const { updatedCharacter, leveledUp, newLevel } = grantExperienceToCharacter(updated, payload.experience);
    updated = updatedCharacter;
    grantedParts.push(`+${payload.experience} XP`);
    if (leveledUp) {
      grantedParts.push(`¡Subió al Nivel ${newLevel}!`);
    }
  }

  const summary = grantedParts.length > 0 
    ? `Otorgado a ${character.name}: ${grantedParts.join(', ')}`
    : 'No se especificaron recompensas para otorgar.';

  return { updatedCharacter: updated, summaryMessage: summary };
}

/**
 * Divide un botín de monedas y Dragones de Oro equitativamente entre los aventureros
 */
export function distributeLootAmongCharacters(
  characters: Character[],
  loot: { totalGp: number; totalGoldDragons?: number; items?: CharacterItem[] }
): Character[] {
  if (!characters || characters.length === 0) return [];

  const count = characters.length;
  const gpPerChar = Math.floor(loot.totalGp / count);
  const gpRemainder = loot.totalGp % count;
  const doPerChar = loot.totalGoldDragons ? Math.floor(loot.totalGoldDragons / count) : 0;
  const doRemainder = loot.totalGoldDragons ? loot.totalGoldDragons % count : 0;

  return characters.map((char, idx) => {
    // El primer aventurero recibe el remanente si no es divisible exacto
    const myGp = gpPerChar + (idx === 0 ? gpRemainder : 0);
    const myDo = doPerChar + (idx === 0 ? doRemainder : 0);

    let updated = grantCurrencyToCharacter(char, {
      gp: myGp,
      goldDragons: myDo
    }, 'Reparto equitativo de botín de campaña');

    return updated;
  });
}
