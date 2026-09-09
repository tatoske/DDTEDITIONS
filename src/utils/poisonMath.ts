import {
  PoisonDef,
  DiseaseDef,
  AlchemicalRecipeDef
} from '../types/dnd';
import { rollDice } from './dndMath';

/**
 * Resuelve la exposición de una criatura a un veneno según las reglas de la DMG 2024.
 * Evalúa daño, condiciones infligidas y ventajas por antitoxina.
 */
export function resolvePoisonExposure(
  poison: PoisonDef,
  conSaveRoll: number,
  hasAntitoxin: boolean = false
): {
  passed: boolean;
  damageTaken: number;
  fullDamage: number;
  conditionsApplied: string[];
  narrativeText: string;
} {
  const dc = poison.saveDc;
  const passed = conSaveRoll >= dc;

  // Calcular daño base
  let fullDamage = 0;
  if (poison.damageDice && poison.damageDice !== '0') {
    fullDamage = rollDice(poison.damageDice).total;
  }

  let damageTaken = 0;
  const conditionsApplied: string[] = [];

  if (passed) {
    // Éxito: En la mayoría de venenos con daño, sufre la mitad y no gana condición
    damageTaken = Math.floor(fullDamage / 2);
    return {
      passed: true,
      damageTaken,
      fullDamage,
      conditionsApplied: [],
      narrativeText: `¡Salvación Exitosa! (Tirada: ${conSaveRoll} vs CD ${dc}). Tu organismo resiste la toxina. Sufres ${damageTaken} de daño (${fullDamage} base a la mitad) y evitas cualquier condición secundaria.`
    };
  } else {
    // Fracaso: Daño completo y condiciones
    damageTaken = fullDamage;
    conditionsApplied.push('Envenenado');

    // Reglas específicas por veneno canónico
    if (poison.id === 'crawler_mucus') {
      conditionsApplied.push('Paralizado');
    } else if (poison.id === 'drow_poison') {
      // Si falla por 5 o más puntos (DC 13 - 5 = 8 o menos), cae inconsciente
      if (conSaveRoll <= 8) {
        conditionsApplied.push('Inconsciente');
      }
    } else if (poison.id === 'essence_of_ether' || poison.id === 'oil_of_taggit') {
      conditionsApplied.push('Inconsciente');
    } else if (poison.id === 'malice') {
      conditionsApplied.push('Cegado');
    } else if (poison.id === 'torpor') {
      conditionsApplied.push('Incapacitado');
    } else if (poison.id === 'truth_serum') {
      conditionsApplied.push('Incapaz de Mentir');
    }

    const conditionsText = conditionsApplied.join(', ');
    return {
      passed: false,
      damageTaken,
      fullDamage,
      conditionsApplied,
      narrativeText: `¡Salvación Fallida! (Tirada: ${conSaveRoll} vs CD ${dc}). El veneno invade tu torrente sanguíneo. Sufres ${damageTaken} de daño y quedas bajo las condiciones: [${conditionsText}]. Duración: ${poison.duration}.`
    };
  }
}

/**
 * Resuelve un intento de extracción de veneno de una criatura muerta o incapacitada (Xanathar p. 130 & DMG).
 * Exige superar una prueba de Inteligencia (Naturaleza) o Sabiduría (Supervivencia) CD 20.
 * Si falla por 5 o más puntos (<= 15), el extractor se pincha accidentalmente y sufre el veneno.
 */
export function simulateHarvestingAttempt(
  skillTotal: number,
  hasPoisonerKit: boolean
): {
  success: boolean;
  accidentalSelfExposure: boolean;
  dosesExtracted: number;
  message: string;
} {
  const dc = 20;

  if (skillTotal >= dc) {
    return {
      success: true,
      accidentalSelfExposure: false,
      dosesExtracted: 1,
      message: `¡Extracción Exitosa! (Tirada: ${skillTotal} vs CD 20). Con pulso firme y el Kit de Envenenador, recolectas 1 dosis intacta del veneno.`
    };
  } else if (skillTotal <= 15) {
    // Fallo por 5 o más puntos
    return {
      success: false,
      accidentalSelfExposure: true,
      dosesExtracted: 0,
      message: `¡ACCIDENTE GRAVE! (Tirada: ${skillTotal} vs CD 20). La aguja resbala o la glándula estalla. ¡Te has expuesto directamente al veneno de la criatura!`
    };
  } else {
    return {
      success: false,
      accidentalSelfExposure: false,
      dosesExtracted: 0,
      message: `Fallo sin consecuencias graves (Tirada: ${skillTotal} vs CD 20). La glándula venenosa se secó o rasgó, perdiéndose la muestra.`
    };
  }
}

/**
 * Evalúa la salvación diaria contra una enfermedad contagiosa.
 */
export function resolveDailyDiseaseSave(
  disease: DiseaseDef,
  conSaveRoll: number,
  currentConsecutiveSuccesses: number
): {
  passed: boolean;
  newSuccesses: number;
  isCured: boolean;
  message: string;
} {
  const dc = disease.saveDc;
  const passed = conSaveRoll >= dc;

  if (passed) {
    const newSuccesses = currentConsecutiveSuccesses + 1;
    const isCured = newSuccesses >= 3;

    return {
      passed: true,
      newSuccesses,
      isCured,
      message: isCured
        ? `¡Enfermedad Superada! (Tirada: ${conSaveRoll} vs CD ${dc}). Tu sistema inmunológico ha derrotado a la ${disease.name} tras 3 salvaciones exitosas.`
        : `Mejora clínica: (Tirada: ${conSaveRoll} vs CD ${dc}). Progreso: ${newSuccesses}/3 salvaciones exitosas consecutivas para curación total.`
    };
  } else {
    return {
      passed: false,
      newSuccesses: 0,
      isCured: false,
      message: `Fiebre y empeoramiento: (Tirada: ${conSaveRoll} vs CD ${dc}). La ${disease.name} se intensifica. Los éxitos consecutivos se reinician a 0.`
    };
  }
}

/**
 * Calcula el progreso de elaboración y síntesis alquímica de una receta.
 */
export function calculateCraftingProgress(
  recipe: AlchemicalRecipeDef,
  daysWorked: number
): {
  isCompleted: boolean;
  percentProgress: number;
  daysRemaining: number;
} {
  const daysRemaining = Math.max(0, recipe.daysRequired - daysWorked);
  const percentProgress = Math.min(100, Math.round((daysWorked / recipe.daysRequired) * 100));
  const isCompleted = daysWorked >= recipe.daysRequired;

  return {
    isCompleted,
    percentProgress,
    daysRemaining
  };
}
