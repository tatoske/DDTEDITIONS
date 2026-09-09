import {
  TrapTier,
  TrapLethality,
  ComplexTrapActiveElement,
  ComplexTrapDynamicElement,
  ComplexTrapCountermeasure
} from '../types/dnd';
import { DMG_TRAP_BENCHMARKS, TrapBenchmark } from '../data/complexTrapsData';
import { rollDice } from './dndMath';

/**
 * Obtiene las estadísticas base de referencia según la DMG 2024 para un rango de nivel y letalidad.
 */
export function getTrapBenchmark(tier: TrapTier, lethality: TrapLethality): TrapBenchmark {
  const benchmark = DMG_TRAP_BENCHMARKS.find(b => b.tier === tier && b.lethality === lethality);
  return benchmark || DMG_TRAP_BENCHMARKS[0];
}

/**
 * Resuelve un intento de desactivación mediante una prueba de habilidad o herramientas.
 */
export function applyCountermeasureAttempt(
  countermeasure: ComplexTrapCountermeasure,
  checkTotal: number
): {
  success: boolean;
  newSuccesses: number;
  isNowDisarmed: boolean;
  message: string;
} {
  if (countermeasure.isDisarmed) {
    return {
      success: true,
      newSuccesses: countermeasure.currentSuccesses,
      isNowDisarmed: true,
      message: `El componente "${countermeasure.title}" ya se encuentra neutralizado.`
    };
  }

  const success = checkTotal >= countermeasure.dc;
  if (success) {
    const newSuccesses = countermeasure.currentSuccesses + 1;
    const isNowDisarmed = newSuccesses >= countermeasure.requiredSuccesses;

    return {
      success: true,
      newSuccesses,
      isNowDisarmed,
      message: isNowDisarmed
        ? `¡Componente Neutralizado! (Tirada: ${checkTotal} vs CD ${countermeasure.dc}). Has completado los ${countermeasure.requiredSuccesses} éxitos necesarios.`
        : `¡Éxito Parcial! (Tirada: ${checkTotal} vs CD ${countermeasure.dc}). Progreso: ${newSuccesses}/${countermeasure.requiredSuccesses} éxitos acumulados.`
    };
  } else {
    return {
      success: false,
      newSuccesses: countermeasure.currentSuccesses,
      isNowDisarmed: false,
      message: `Fallo (Tirada: ${checkTotal} vs CD ${countermeasure.dc}). La aguja o engranaje resiste tu intento.`
    };
  }
}

/**
 * Aplica daño físico o mágico directo a la estructura de un componente de la trampa.
 */
export function damageTrapComponent(
  countermeasure: ComplexTrapCountermeasure,
  damage: number
): {
  newHp: number;
  isNowDestroyed: boolean;
  message: string;
} {
  const currentHp = countermeasure.currentHp !== undefined ? countermeasure.currentHp : (countermeasure.maxHp || 30);
  const newHp = Math.max(0, currentHp - damage);
  const isNowDestroyed = newHp === 0;

  return {
    newHp,
    isNowDestroyed,
    message: isNowDestroyed
      ? `¡Estructura Destruida! El impacto infligió ${damage} de daño. El componente "${countermeasure.title}" queda deshecho en pedazos e inoperativo.`
      : `Impacto en la estructura: ${damage} de daño recibido. Puntos de Golpe restantes: ${newHp}/${countermeasure.maxHp || 30}.`
  };
}

/**
 * Determina si una trampa compleja ha sido completamente neutralizada.
 */
export function isTrapFullyDisarmed(countermeasures: ComplexTrapCountermeasure[]): boolean {
  if (countermeasures.length === 0) return true;
  return countermeasures.every(c => c.isDisarmed);
}

/**
 * Calcula el escalado de daño y ataque de un elemento activo en función del asalto actual.
 */
export function calculateEscalatedDamage(
  activeElement: ComplexTrapActiveElement,
  currentRound: number,
  dynamicElements: ComplexTrapDynamicElement[]
): {
  effectiveDamageDice: string;
  attackBonusMod: number;
  activeEscalationNotes: string[];
} {
  let attackBonusMod = 0;
  const activeEscalationNotes: string[] = [];

  dynamicElements.forEach(dyn => {
    if (currentRound >= dyn.triggerRound) {
      activeEscalationNotes.push(dyn.escalationEffect);
      if (dyn.escalationEffect.includes('+2 a las tiradas de ataque')) {
        attackBonusMod += 2;
      }
    }
  });

  return {
    effectiveDamageDice: activeElement.damageDice,
    attackBonusMod,
    activeEscalationNotes
  };
}

/**
 * Resuelve una tirada de ataque de la trampa contra la Clase de Armadura (CA) del objetivo.
 */
export function resolveActiveElementAttack(
  activeElement: ComplexTrapActiveElement,
  targetAc: number,
  attackBonusMod: number = 0,
  forcedD20?: number
): {
  d20: number;
  totalAttack: number;
  isHit: boolean;
  isCritical: boolean;
  damageRolled: number;
} {
  const d20 = forcedD20 || rollDice('1d20').total;
  const baseBonus = activeElement.attackBonus || 0;
  const totalAttack = d20 + baseBonus + attackBonusMod;
  const isCritical = d20 === 20;
  const isFumble = d20 === 1;

  const isHit = !isFumble && (isCritical || totalAttack >= targetAc);
  const damageDiceFormula = isCritical
    ? `${activeElement.damageDice} + ${activeElement.damageDice}`
    : activeElement.damageDice;

  const damageRolled = isHit ? rollDice(damageDiceFormula).total : 0;

  return {
    d20,
    totalAttack,
    isHit,
    isCritical,
    damageRolled
  };
}

/**
 * Resuelve una tirada de salvación de un aventurero contra un elemento activo de área.
 */
export function resolveActiveElementSave(
  activeElement: ComplexTrapActiveElement,
  saveRoll: number,
  forcedDamage?: number
): {
  saveRoll: number;
  passed: boolean;
  damageTaken: number;
  fullDamage: number;
} {
  const dc = activeElement.saveDc || 10;
  const passed = saveRoll >= dc;
  const fullDamage = forcedDamage || rollDice(activeElement.damageDice).total;
  // La mayoría de trampas infligen mitad de daño con salvación exitosa
  const damageTaken = passed ? Math.floor(fullDamage / 2) : fullDamage;

  return {
    saveRoll,
    passed,
    damageTaken,
    fullDamage
  };
}
