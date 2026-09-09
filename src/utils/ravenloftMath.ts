import { Character, DarkGiftDef, PanicRollResult } from '../types/dnd';
import { PANIC_TABLE } from '../data/darkGiftsData';
import { rollDice } from './dndMath';

/**
 * Calcula el penalizador a tiradas de d20 por puntuación de Estrés según Van Richten:
 * Cada punto de Estrés impone un -1 a tiradas de ataque, salvaciones y pruebas de habilidad (hasta -10).
 */
export function calculateStressModifier(stressScore?: number): number {
  if (!stressScore || stressScore <= 0) return 0;
  const clamped = Math.min(10, Math.max(0, stressScore));
  return -clamped;
}

/**
 * Resuelve una tirada de la Tabla de Pánico y Miedo de Ravenloft (Van Richten p. 195)
 */
export function rollPanicReaction(forcedRoll?: number): PanicRollResult {
  const d20 = forcedRoll ? Math.max(1, Math.min(20, forcedRoll)) : rollDice('1d20').total;
  const entry = PANIC_TABLE.find(p => d20 >= p.min && d20 <= p.max) || PANIC_TABLE[0];

  return {
    roll: d20,
    title: entry.title,
    description: entry.description,
    severity: entry.severity
  };
}

/**
 * Modifica la puntuación de estrés de un personaje (entre 0 y 10)
 */
export function modifyCharacterStress(
  character: Character, 
  delta: number
): { updatedCharacter: Character; newScore: number; penalty: number } {
  const current = character.stressScore || 0;
  const newScore = Math.max(0, Math.min(10, current + delta));
  const penalty = calculateStressModifier(newScore);

  const updatedCharacter: Character = {
    ...character,
    stressScore: newScore,
    updatedAt: new Date().toISOString()
  };

  return { updatedCharacter, newScore, penalty };
}

/**
 * Otorga un Don Oscuro a un personaje con sus beneficios y maldiciones
 */
export function applyDarkGiftToCharacter(
  character: Character, 
  gift: DarkGiftDef
): { updatedCharacter: Character; message: string } {
  const currentGifts = character.darkGifts || [];
  const alreadyHas = currentGifts.some(g => g.giftId === gift.id);
  if (alreadyHas) {
    return {
      updatedCharacter: character,
      message: `El personaje ya tiene sellado el Don Oscuro "${gift.name}".`
    };
  }

  const newGiftEntry = {
    giftId: gift.id,
    name: gift.name,
    boons: gift.boons,
    curses: gift.curses,
    acquiredAt: new Date().toISOString()
  };

  const newFeature = {
    title: `Don Oscuro: ${gift.name}`,
    source: 'Ravenloft (Pacto Oscuro)',
    description: `[BENEFICIOS]: ${gift.boons.join(' ')} | [MALDICIÓN]: ${gift.curses.join(' ')}`
  };

  const updatedCharacter: Character = {
    ...character,
    darkGifts: [...currentGifts, newGiftEntry],
    features: [...character.features.filter(f => !f.title.includes(gift.name)), newFeature],
    updatedAt: new Date().toISOString()
  };

  return {
    updatedCharacter,
    message: `¡Pacto sellado! "${gift.name}" ha sido grabado en el alma de ${character.name}.`
  };
}

/**
 * Purifica o remueve un Don Oscuro de un personaje
 */
export function removeDarkGiftFromCharacter(
  character: Character, 
  giftId: string
): Character {
  const currentGifts = character.darkGifts || [];
  const giftEntry = currentGifts.find(g => g.giftId === giftId);
  if (!giftEntry) return character;

  return {
    ...character,
    darkGifts: currentGifts.filter(g => g.giftId !== giftId),
    features: character.features.filter(f => !f.title.includes(giftEntry.name)),
    updatedAt: new Date().toISOString()
  };
}
