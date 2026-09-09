import {
  SeaCondition,
  ShipType,
  MistIncident,
  NavalHazard
} from '../types/dnd';
import {
  SHIPS_CATALOG,
  RAVENLOFT_MIST_INCIDENTS,
  NAVAL_HAZARDS
} from '../data/weatherAndVoyageData';

/**
 * Calcula la CD de Salvación de Constitución para Frío Extremo según DMG 2024.
 * Base CD 10 por cada hora sin ropa de abrigo. Si está sumergido en agua gélida, la CD se incrementa drásticamente (+5).
 */
export function calculateColdSaveDc(hoursExposed: number, isSubmerged: boolean = false): number {
  const base = 10;
  if (isSubmerged) {
    return base + 5;
  }
  // En DMG la CD base es 10 fija cada hora, pero si se prolonga por más de 4 horas el frío cala hondo (+1 cada 2 horas extra)
  const extra = hoursExposed > 4 ? Math.floor((hoursExposed - 4) / 2) : 0;
  return base + extra;
}

/**
 * Calcula la CD de Salvación de Constitución para Calor Extremo según DMG 2024.
 * CD 10 la primera hora, incrementando en +1 por cada hora subsiguiente si no se beben al menos 2 galones de agua.
 */
export function calculateHeatSaveDc(hoursExposed: number): number {
  if (hoursExposed <= 1) return 10;
  return 10 + (hoursExposed - 1);
}

/**
 * Determina si el personaje tiene desventaja en la tirada de calor extremo debido a su armadura.
 * Armaduras medias y pesadas imponen Desventaja automática.
 */
export function checkHeatDisadvantage(armorType: 'none' | 'light' | 'medium' | 'heavy'): boolean {
  return armorType === 'medium' || armorType === 'heavy';
}

/**
 * Evalúa el resultado de un susurro o incidente de las Brumas de Ravenloft.
 * Si falla la salvación de Sabiduría, incrementa el nivel de Estrés del personaje.
 */
export function resolveMistWhispers(
  saveRoll: number,
  dc: number,
  currentStress: number,
  stressRisk: number = 1
): {
  success: boolean;
  stressChange: number;
  newStress: number;
  narrativeText: string;
} {
  const success = saveRoll >= dc;
  if (success) {
    return {
      success: true,
      stressChange: 0,
      newStress: currentStress,
      narrativeText: `¡Éxito! (Tirada: ${saveRoll} vs CD ${dc}). Tu mente rechaza los ecos y delirios de la niebla.`
    };
  } else {
    const change = Math.max(1, stressRisk);
    const newStress = currentStress + change;
    return {
      success: false,
      stressChange: change,
      newStress,
      narrativeText: `¡Fallo! (Tirada: ${saveRoll} vs CD ${dc}). Los susurros calan en tu alma. Ganas +${change} nivel de Estrés de Ravenloft (Total: ${newStress}).`
    };
  }
}

/**
 * Calcula la distancia navegada en millas náuticas durante una jornada de 24 horas.
 * Toma en cuenta la velocidad en nudos del barco, el estado del mar y la prueba del navegante.
 */
export function calculateDailyVoyageDistance(
  shipType: ShipType,
  seaCondition: SeaCondition,
  isNavigatorSuccess: boolean
): number {
  const ship = SHIPS_CATALOG.find(s => s.id === shipType) || SHIPS_CATALOG[2]; // Sailing ship default
  // 24 horas * velocidad base en nudos = millas teóricas
  const baseMiles = ship.speedKnots * 24;

  let conditionMultiplier = 1.0;
  switch (seaCondition) {
    case 'calm':
      // Si es barco de remos/galera aún avanza a fuerza de brazos, si es solo vela avanza casi nada
      conditionMultiplier = (shipType === 'rowboat' || shipType === 'galley' || shipType === 'longship') ? 0.5 : 0.05;
      break;
    case 'favorable':
      conditionMultiplier = 1.35;
      break;
    case 'rough':
      conditionMultiplier = 0.75;
      break;
    case 'storm':
      conditionMultiplier = 0.4;
      break;
    case 'hurricane':
      conditionMultiplier = 0.1;
      break;
  }

  const navigatorBonus = isNavigatorSuccess ? 1.15 : 0.85;
  const total = Math.round(baseMiles * conditionMultiplier * navigatorBonus);
  return Math.max(0, total);
}

/**
 * Calcula el daño que una tormenta o marejada puede infligir al casco del navío.
 * Solo inflige daño si supera el Umbral de Daño (Damage Threshold) del barco.
 */
export function calculateStormDamage(seaCondition: SeaCondition, damageThreshold: number): number {
  if (seaCondition === 'calm' || seaCondition === 'favorable' || seaCondition === 'rough') {
    return 0;
  }

  // Daño estimado por viento huracanado o tormenta
  let rawDamage = 0;
  if (seaCondition === 'storm') {
    // Media de 4d10 (~22)
    rawDamage = Math.floor(Math.random() * 25) + 10;
  } else if (seaCondition === 'hurricane') {
    // Media de 6d10 (~33)
    rawDamage = Math.floor(Math.random() * 40) + 15;
  }

  // Si el daño no supera el umbral, el casco de roble reforzado lo absorbe
  if (rawDamage < damageThreshold) {
    return 0;
  }

  return rawDamage;
}

/**
 * Obtiene un incidente aleatorio de las Brumas de Ravenloft (1 a 10).
 */
export function getRandomMistIncident(forcedRoll?: number): MistIncident {
  const roll = forcedRoll || Math.floor(Math.random() * RAVENLOFT_MIST_INCIDENTS.length) + 1;
  const incident = RAVENLOFT_MIST_INCIDENTS.find(i => i.roll === roll);
  return incident || RAVENLOFT_MIST_INCIDENTS[0];
}

/**
 * Obtiene un peligro náutico aleatorio de la tabla de 20 (d20).
 */
export function getRandomNavalHazard(forcedRoll?: number): NavalHazard {
  const roll = forcedRoll || Math.floor(Math.random() * NAVAL_HAZARDS.length) + 1;
  const hazard = NAVAL_HAZARDS.find(h => h.roll === roll);
  return hazard || NAVAL_HAZARDS[0];
}
