import { Sidekick, SidekickClassType, SidekickFeature } from '../types/dnd';
import { 
  WARRIOR_FEATURES_BY_LEVEL, 
  EXPERT_FEATURES_BY_LEVEL, 
  SPELLCASTER_FEATURES_BY_LEVEL,
  SPELLCASTER_SLOTS_BY_LEVEL 
} from '../data/sidekicksData';
import { getAbilityModifier } from './dndMath';

/**
 * Bonificador de competencia oficial para Escuderos de Tasha según nivel (1-20)
 */
export function getSidekickProficiency(level: number): number {
  if (level >= 17) return 6;
  if (level >= 13) return 5;
  if (level >= 9) return 4;
  if (level >= 5) return 3;
  return 2;
}

/**
 * Obtiene el valor numérico promedio de un Dado de Golpe (ej. "d8" -> 5, "1d10" -> 6, "d12" -> 7)
 */
export function getHitDieAverage(hitDie: string): number {
  const match = hitDie.match(/d(\d+)/i);
  if (match && match[1]) {
    const sides = parseInt(match[1], 10);
    return Math.floor(sides / 2) + 1;
  }
  return 5; // Default d8
}

/**
 * Calcula los Puntos de Golpe máximos de un Escudero a un nivel determinado según Tasha:
 * PG base de la criatura + (Promedio DG + Mod CON) por cada nivel adicional después del 1.
 */
export function calculateSidekickHp(baseHpLvl1: number, hitDie: string, conScore: number, targetLevel: number): number {
  if (targetLevel <= 1) return baseHpLvl1;
  const conMod = getAbilityModifier(conScore);
  const dieAvg = getHitDieAverage(hitDie);
  const hpPerLevel = Math.max(1, dieAvg + conMod);
  return baseHpLvl1 + hpPerLevel * (targetLevel - 1);
}

/**
 * Obtiene la lista de todos los rasgos acumulados hasta el nivel especificado
 */
export function getAccumulatedFeatures(sidekickClass: SidekickClassType, targetLevel: number): SidekickFeature[] {
  const table = 
    sidekickClass === 'warrior' 
      ? WARRIOR_FEATURES_BY_LEVEL 
      : sidekickClass === 'expert' 
        ? EXPERT_FEATURES_BY_LEVEL 
        : SPELLCASTER_FEATURES_BY_LEVEL;

  const features: SidekickFeature[] = [];
  for (let lvl = 1; lvl <= targetLevel; lvl++) {
    if (table[lvl]) {
      features.push(...table[lvl]);
    }
  }
  return features;
}

/**
 * Actualiza los espacios de conjuro para un Prodigio Mágico según su nivel
 */
export function getUpdatedSpellSlots(targetLevel: number, existingSlots?: { [lvl: number]: { total: number; used: number } }) {
  const slotsTable = SPELLCASTER_SLOTS_BY_LEVEL[targetLevel] || {};
  const result: { [lvl: number]: { total: number; used: number } } = {};
  
  for (let slotLvl = 1; slotLvl <= 5; slotLvl++) {
    const total = slotsTable[slotLvl] || 0;
    if (total > 0) {
      const previouslyUsed = existingSlots?.[slotLvl]?.used || 0;
      result[slotLvl] = {
        total,
        used: Math.min(previouslyUsed, total)
      };
    }
  }
  return result;
}

/**
 * Actualiza un Escudero a un nuevo nivel recalculando PG, bonos de competencia y rasgos
 */
export function scaleSidekickToLevel(sidekick: Sidekick, newLevel: number): Sidekick {
  const clampedLevel = Math.max(1, Math.min(20, newLevel));
  const oldProf = getSidekickProficiency(sidekick.level);
  const newProf = getSidekickProficiency(clampedLevel);
  const profDelta = newProf - oldProf;

  // Recalcular PG Máximos
  const conMod = getAbilityModifier(sidekick.abilities.con);
  const dieAvg = getHitDieAverage(sidekick.hitDie);
  const hpPerLevel = Math.max(1, dieAvg + conMod);
  const lvl1Hp = Math.max(1, sidekick.maxHp - hpPerLevel * (sidekick.level - 1));
  const newMaxHp = calculateSidekickHp(lvl1Hp, sidekick.hitDie, sidekick.abilities.con, clampedLevel);

  // Mantener ratio o ajustar HP actual
  const currentRatio = sidekick.currentHp / sidekick.maxHp;
  const newCurrentHp = Math.max(1, Math.round(newMaxHp * currentRatio));

  // Ajustar bonificadores de ataque con el delta de competencia
  const updatedAttacks = sidekick.attacks.map(atk => ({
    ...atk,
    bonus: atk.bonus + profDelta
  }));

  // Obtener rasgos acumulados de clase
  const classFeatures = getAccumulatedFeatures(sidekick.sidekickClass, clampedLevel);
  // Mantener rasgos de criatura (los que no provienen de la clase de escudero)
  const creatureFeatures = sidekick.features.filter(
    f => !f.source.includes('Guerrero') && !f.source.includes('Experto') && !f.source.includes('Prodigio Mágico')
  );

  // Magia si aplica
  let updatedSpellcasting = sidekick.spellcasting;
  if (sidekick.sidekickClass === 'spellcaster' && updatedSpellcasting) {
    const abilityMod = getAbilityModifier(sidekick.abilities[updatedSpellcasting.ability]);
    const focusBonus = clampedLevel >= 2 ? 1 : 0;
    updatedSpellcasting = {
      ...updatedSpellcasting,
      attackBonus: abilityMod + newProf + focusBonus,
      saveDc: 8 + newProf + abilityMod + focusBonus,
      slots: getUpdatedSpellSlots(clampedLevel, updatedSpellcasting.slots)
    };
  }

  return {
    ...sidekick,
    level: clampedLevel,
    maxHp: newMaxHp,
    currentHp: newCurrentHp,
    attacks: updatedAttacks,
    features: [...creatureFeatures, ...classFeatures],
    spellcasting: updatedSpellcasting,
    updatedAt: new Date().toISOString()
  };
}
