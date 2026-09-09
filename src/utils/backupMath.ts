import { Character } from '../types/dnd';

export interface CampaignBackupPayload {
  version: string;
  timestamp: string;
  app: string;
  characters: Character[];
  monsters?: any[];
  sidekicks?: any[];
  campaignPatron?: any;
}

/**
 * Valida si una cadena JSON contiene una ficha de personaje válida de D&D T Editions.
 */
export function validateCharacterJson(jsonString: string): {
  valid: boolean;
  character?: Character;
  error?: string;
} {
  try {
    const parsed = JSON.parse(jsonString);
    if (!parsed || typeof parsed !== 'object') {
      return { valid: false, error: 'El archivo no contiene un objeto JSON válido.' };
    }

    // Comprobación de campos esenciales
    if (!parsed.name || typeof parsed.name !== 'string') {
      return { valid: false, error: 'Falta el nombre del aventurero (campo "name").' };
    }
    if (typeof parsed.level !== 'number' || parsed.level < 1) {
      return { valid: false, error: 'Nivel inválido o ausente (debe ser un número >= 1).' };
    }
    if (!parsed.abilities || typeof parsed.abilities !== 'object') {
      return { valid: false, error: 'Faltan las puntuaciones de característica ("abilities").' };
    }
    if (typeof parsed.maxHp !== 'number') {
      return { valid: false, error: 'Puntos de golpe máximos inválidos ("maxHp").' };
    }

    // Asegurar estructura de campos opcionales para evitar runtime errors
    const character: Character = {
      ...parsed,
      id: parsed.id || `char_imported_${Date.now()}`,
      className: parsed.className || 'Guerrero',
      species: parsed.species || 'Humano',
      background: parsed.background || 'Aventurero',
      alignment: parsed.alignment || 'Neutral',
      experience: parsed.experience ?? 0,
      currentHp: parsed.currentHp ?? parsed.maxHp,
      tempHp: parsed.tempHp ?? 0,
      hitDie: parsed.hitDie || '1d10',
      hitDiceTotal: parsed.hitDiceTotal ?? parsed.level,
      hitDiceUsed: parsed.hitDiceUsed ?? 0,
      deathSaves: parsed.deathSaves || { successes: 0, failures: 0 },
      armorClass: parsed.armorClass ?? 10,
      initiativeBonus: parsed.initiativeBonus ?? 0,
      speed: parsed.speed ?? 9,
      proficiencyBonus: parsed.proficiencyBonus ?? 2,
      savingThrows: parsed.savingThrows || { str: false, dex: false, con: false, int: false, wis: false, cha: false },
      skills: parsed.skills || {},
      languages: parsed.languages || ['Común'],
      weaponProficiencies: parsed.weaponProficiencies || [],
      armorProficiencies: parsed.armorProficiencies || [],
      spellSlots: parsed.spellSlots || [],
      knownSpells: parsed.knownSpells || [],
      weapons: parsed.weapons || [],
      inventory: parsed.inventory || [],
      coins: parsed.coins || { cp: 0, sp: 0, ep: 0, gp: 0, pp: 0 },
      features: parsed.features || [],
      createdAt: parsed.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    return { valid: true, character };
  } catch (err: any) {
    return { valid: false, error: `Error de sintaxis JSON: ${err.message}` };
  }
}

/**
 * Valida un archivo de respaldo de campaña completa.
 */
export function validateCampaignBackupJson(jsonString: string): {
  valid: boolean;
  data?: CampaignBackupPayload;
  error?: string;
} {
  try {
    const parsed = JSON.parse(jsonString);
    if (!parsed || typeof parsed !== 'object') {
      return { valid: false, error: 'El archivo de respaldo no es un objeto JSON válido.' };
    }

    if (!Array.isArray(parsed.characters)) {
      return { valid: false, error: 'El respaldo no contiene una lista de personajes válida ("characters").' };
    }

    const payload: CampaignBackupPayload = {
      version: parsed.version || '1.0',
      timestamp: parsed.timestamp || new Date().toISOString(),
      app: parsed.app || 'D&D T Editions',
      characters: parsed.characters,
      monsters: Array.isArray(parsed.monsters) ? parsed.monsters : [],
      sidekicks: Array.isArray(parsed.sidekicks) ? parsed.sidekicks : [],
      campaignPatron: parsed.campaignPatron || null
    };

    return { valid: true, data: payload };
  } catch (err: any) {
    return { valid: false, error: `Error de sintaxis JSON: ${err.message}` };
  }
}

/**
 * Crea el paquete de respaldo de toda la campaña activa.
 */
export function createCampaignBackupPayload(
  characters: Character[],
  monsters: any[],
  sidekicks: any[],
  campaignPatron: any
): CampaignBackupPayload {
  return {
    version: '1.0',
    timestamp: new Date().toISOString(),
    app: 'D&D T Editions 2024',
    characters,
    monsters,
    sidekicks,
    campaignPatron
  };
}

/**
 * Dispara la descarga de un archivo JSON en el navegador.
 */
export function triggerJsonDownload(data: any, fileName: string): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
