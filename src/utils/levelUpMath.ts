import { Character, SpellSlot } from '../types/dnd';
import { getAbilityModifier } from './dndMath';

/**
 * Calcula el Bonificador de Competencia según el nivel del personaje (Reglas D&D 2024 / 5e).
 */
export function calculateProficiencyBonus(level: number): number {
  if (level >= 17) return 6;
  if (level >= 13) return 5;
  if (level >= 9) return 4;
  if (level >= 5) return 3;
  return 2;
}

/**
 * Extrae el tamaño del dado de golpe (ej. "1d10" -> 10, "d8" -> 8).
 */
export function parseHitDieSize(hitDie: string): number {
  const match = hitDie.match(/d(\d+)/i);
  return match ? parseInt(match[1], 10) : 8;
}

/**
 * Calcula el valor promedio oficial de puntos de golpe para un dado de golpe.
 */
export function getHitDieAverage(dieSize: number): number {
  switch (dieSize) {
    case 6: return 4;
    case 8: return 5;
    case 10: return 6;
    case 12: return 7;
    default: return Math.floor(dieSize / 2) + 1;
  }
}

/**
 * Calcula el incremento de puntos de golpe al subir de nivel.
 */
export function calculateHpIncrease(
  hitDie: string,
  conScore: number,
  method: 'average' | 'roll',
  fixedRoll?: number
): {
  hpIncrease: number;
  diceRoll: number;
  conMod: number;
  dieSize: number;
} {
  const dieSize = parseHitDieSize(hitDie);
  const conMod = getAbilityModifier(conScore);

  let diceRoll: number;
  if (method === 'average') {
    diceRoll = getHitDieAverage(dieSize);
  } else {
    diceRoll = fixedRoll ?? Math.floor(Math.random() * dieSize) + 1;
  }

  // En D&D siempre se gana al menos 1 punto de golpe al subir de nivel
  const hpIncrease = Math.max(1, diceRoll + conMod);

  return {
    hpIncrease,
    diceRoll,
    conMod,
    dieSize
  };
}

/**
 * Tabla oficial de espacios de conjuros para lanzadores completos (Full Casters).
 * Mago, Clérigo, Druida, Hechicero, Bardo.
 */
export const FULL_CASTER_SLOTS_TABLE: Record<number, number[]> = {
  1: [2],
  2: [3],
  3: [4, 2],
  4: [4, 3],
  5: [4, 3, 2],
  6: [4, 3, 3],
  7: [4, 3, 3, 1],
  8: [4, 3, 3, 2],
  9: [4, 3, 3, 3, 1],
  10: [4, 3, 3, 3, 2],
  11: [4, 3, 3, 3, 2, 1],
  12: [4, 3, 3, 3, 2, 1],
  13: [4, 3, 3, 3, 2, 1, 1],
  14: [4, 3, 3, 3, 2, 1, 1],
  15: [4, 3, 3, 3, 2, 1, 1, 1],
  16: [4, 3, 3, 3, 2, 1, 1, 1],
  17: [4, 3, 3, 3, 2, 1, 1, 1, 1],
  18: [4, 3, 3, 3, 3, 1, 1, 1, 1],
  19: [4, 3, 3, 3, 3, 2, 1, 1, 1],
  20: [4, 3, 3, 3, 3, 2, 2, 1, 1]
};

/**
 * Tabla oficial de espacios de conjuros para medio lanzadores (Half Casters).
 * Paladín, Explorador (Ranger).
 */
export const HALF_CASTER_SLOTS_TABLE: Record<number, number[]> = {
  1: [],
  2: [2],
  3: [3],
  4: [3],
  5: [4, 2],
  6: [4, 2],
  7: [4, 3],
  8: [4, 3],
  9: [4, 3, 2],
  10: [4, 3, 2],
  11: [4, 3, 3],
  12: [4, 3, 3],
  13: [4, 3, 3, 1],
  14: [4, 3, 3, 1],
  15: [4, 3, 3, 2],
  16: [4, 3, 3, 2],
  17: [4, 3, 3, 3, 1],
  18: [4, 3, 3, 3, 1],
  19: [4, 3, 3, 3, 2],
  20: [4, 3, 3, 3, 2]
};

/**
 * Tabla oficial de magia de pacto para el Brujo (Warlock).
 */
export const WARLOCK_SLOTS_TABLE: Record<number, { count: number; slotLevel: number }> = {
  1: { count: 1, slotLevel: 1 },
  2: { count: 2, slotLevel: 1 },
  3: { count: 2, slotLevel: 2 },
  4: { count: 2, slotLevel: 2 },
  5: { count: 2, slotLevel: 3 },
  6: { count: 2, slotLevel: 3 },
  7: { count: 2, slotLevel: 4 },
  8: { count: 2, slotLevel: 4 },
  9: { count: 2, slotLevel: 5 },
  10: { count: 2, slotLevel: 5 },
  11: { count: 3, slotLevel: 5 },
  12: { count: 3, slotLevel: 5 },
  13: { count: 3, slotLevel: 5 },
  14: { count: 3, slotLevel: 5 },
  15: { count: 3, slotLevel: 5 },
  16: { count: 3, slotLevel: 5 },
  17: { count: 4, slotLevel: 5 },
  18: { count: 4, slotLevel: 5 },
  19: { count: 4, slotLevel: 5 },
  20: { count: 4, slotLevel: 5 }
};

/**
 * Obtiene los espacios de conjuros oficiales según la clase y nivel (D&D 2024).
 */
export function getSpellSlotsForClassAndLevel(className: string, level: number): SpellSlot[] {
  const norm = (className || '').toLowerCase();

  const isFullCaster = ['mago', 'clérigo', 'clerigo', 'bardo', 'druida', 'hechicero'].some(c => norm.includes(c));
  const isHalfCaster = ['paladín', 'paladin', 'explorador', 'ranger'].some(c => norm.includes(c));
  const isWarlock = norm.includes('brujo') || norm.includes('warlock');

  if (isFullCaster) {
    const counts = FULL_CASTER_SLOTS_TABLE[level] || [];
    return counts.map((total, idx) => ({
      level: idx + 1,
      total,
      used: 0
    }));
  }

  if (isHalfCaster) {
    const counts = HALF_CASTER_SLOTS_TABLE[level] || [];
    return counts.map((total, idx) => ({
      level: idx + 1,
      total,
      used: 0
    }));
  }

  if (isWarlock) {
    const pact = WARLOCK_SLOTS_TABLE[level];
    if (!pact) return [];
    return [{
      level: pact.slotLevel,
      total: pact.count,
      used: 0
    }];
  }

  return [];
}

/**
 * Detecta hitos y rasgos clave de subida de nivel para orientar al jugador.
 */
export function getLevelUpMilestones(className: string, newLevel: number): Array<{ title: string; description: string }> {
  const milestones: Array<{ title: string; description: string }> = [];

  // Hitos de D&D 2024
  if (newLevel === 3) {
    milestones.push({
      title: 'Desbloqueo de Subclase (Reglas 2024)',
      description: 'A nivel 3 todas las clases eligen y desbloquean las primeras funciones de su Subclase.'
    });
  }

  if ([4, 8, 12, 16, 19].includes(newLevel)) {
    milestones.push({
      title: 'Mejora de Características (ASI) o Dote',
      description: 'Ganas una Mejora de Características (+2 a una o +1 a dos) o una nueva Dote General o Épica.'
    });
  }

  if (newLevel === 5) {
    const norm = (className || '').toLowerCase();
    if (['guerrero', 'bárbaro', 'barbaro', 'paladín', 'paladin', 'explorador', 'monje'].some(c => norm.includes(c))) {
      milestones.push({
        title: 'Ataque Adicional (Extra Attack)',
        description: 'Puedes atacar dos veces cada vez que realizas la acción Atacar en tu turno.'
      });
    } else {
      milestones.push({
        title: 'Conjuros de Nivel 3',
        description: 'Desbloqueas acceso a conjuros icónicos de nivel 3 (como Bola de Fuego, Revivir o Relámpago).'
      });
    }
  }

  if (newLevel === 20) {
    milestones.push({
      title: 'Cúspide Legendaria (Nivel 20 / Bendición Épica)',
      description: 'Alcanzas el nivel 20: desbloqueas la Bendición Épica definitiva y puedes elevar tus características hasta 30.'
    });
  }

  return milestones;
}

/**
 * Aplica la subida de nivel de forma pura y retorna el personaje actualizado.
 */
export function applyLevelUpToCharacter(
  character: Character,
  hpIncrease: number,
  newSpellSlots?: SpellSlot[]
): Character {
  const newLevel = Math.min(20, character.level + 1);
  const newProfBonus = calculateProficiencyBonus(newLevel);
  const newMaxHp = character.maxHp + hpIncrease;
  const newCurrentHp = character.currentHp + hpIncrease;
  const newHitDiceTotal = character.hitDiceTotal + 1;

  const updatedSlots = newSpellSlots && newSpellSlots.length > 0
    ? newSpellSlots
    : character.spellSlots;

  return {
    ...character,
    level: newLevel,
    maxHp: newMaxHp,
    currentHp: newCurrentHp,
    hitDiceTotal: newHitDiceTotal,
    proficiencyBonus: newProfBonus,
    spellSlots: updatedSlots,
    updatedAt: new Date().toISOString()
  };
}
