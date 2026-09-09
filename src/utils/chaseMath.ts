import { 
  ChaseParticipant, 
  ChaseEnvironment, 
  ChaseComplication, 
  DragonLairAction 
} from '../types/dnd';
import { 
  URBAN_CHASE_COMPLICATIONS, 
  WILDERNESS_CHASE_COMPLICATIONS 
} from '../data/chaseAndLairsData';
import { rollDice } from './dndMath';

/**
 * Calcula las acciones de Carrera gratuitas según la regla oficial de la DMG 2024:
 * 3 + Modificador de Constitución (mínimo 1).
 */
export function calculateFreeDashes(conMod: number): number {
  return Math.max(1, 3 + conMod);
}

/**
 * Ejecuta una acción de Carrera (Dash) durante la persecución.
 * Si se supera el límite de carreras gratuitas, se debe superar una tirada de salvación
 * de Constitución CD 10 para no sufrir un nivel de agotamiento.
 */
export function performDashAction(
  participant: ChaseParticipant,
  forcedConSaveRoll?: number
): {
  updatedParticipant: ChaseParticipant;
  requiresSave: boolean;
  saveSuccess: boolean;
  exhaustionGained: boolean;
  distanceGained: number;
  message: string;
} {
  const nextDashesUsed = participant.dashesUsed + 1;
  const requiresSave = nextDashesUsed > participant.freeDashesTotal;
  let saveSuccess = true;
  let exhaustionGained = false;
  let nextExhaustion = participant.exhaustionLevel;

  if (requiresSave) {
    const roll = forcedConSaveRoll !== undefined 
      ? forcedConSaveRoll 
      : Math.floor(Math.random() * 20) + 1;
    const totalSave = roll + participant.conMod;
    saveSuccess = totalSave >= 10;

    if (!saveSuccess) {
      nextExhaustion = Math.min(6, participant.exhaustionLevel + 1);
      exhaustionGained = true;
    }
  }

  // Velocidad según agotamiento
  let effectiveSpeed = participant.speed;
  if (nextExhaustion >= 2 && nextExhaustion < 5) {
    effectiveSpeed = Math.floor(effectiveSpeed / 2);
  } else if (nextExhaustion >= 5) {
    effectiveSpeed = 0;
  }

  const nextPosition = participant.currentPosition + effectiveSpeed;
  let nextStatus = participant.status;
  if (nextExhaustion >= 5) {
    nextStatus = 'exhausted';
  }

  let message = `${participant.name} corre a toda velocidad (+${effectiveSpeed} pies, total: ${nextPosition} pies).`;
  if (requiresSave) {
    if (saveSuccess) {
      message += ` Salvación de Constitución CD 10 superada.`;
    } else {
      message += ` ¡Falló la salvación de Constitución (CD 10)! Ganó 1 nivel de agotamiento (${nextExhaustion}/6).`;
    }
  }

  return {
    updatedParticipant: {
      ...participant,
      dashesUsed: nextDashesUsed,
      currentPosition: nextPosition,
      exhaustionLevel: nextExhaustion,
      status: nextStatus
    },
    requiresSave,
    saveSuccess,
    exhaustionGained,
    distanceGained: effectiveSpeed,
    message
  };
}

/**
 * Obtiene una complicación aleatoria (1d20) según el entorno de la persecución.
 */
export function rollChaseComplication(
  environment: ChaseEnvironment,
  forcedRoll?: number
): ChaseComplication {
  const table = environment === 'urban' 
    ? URBAN_CHASE_COMPLICATIONS 
    : WILDERNESS_CHASE_COMPLICATIONS;

  const roll = forcedRoll !== undefined 
    ? forcedRoll 
    : Math.floor(Math.random() * 20) + 1;

  const clampedRoll = Math.max(1, Math.min(20, roll));
  return table.find(c => c.roll === clampedRoll) || table[0];
}

/**
 * Calcula la distancia relativa en pies entre la presa y un perseguidor.
 */
export function calculateRelativeDistance(quarry: ChaseParticipant, pursuer: ChaseParticipant): number {
  return Math.max(0, quarry.currentPosition - pursuer.currentPosition);
}

/**
 * Determina el estado actual de la persecución.
 * - 'captured' si algún perseguidor activo alcanza o sobrepasa la posición de la presa (distancia 0).
 * - 'escaped' si la presa saca más de escapeThresholdFeet (def: 120 pies) de ventaja sobre todos los perseguidores activos, o si todos caen agotados.
 * - 'ongoing' si la carrera continúa.
 */
export function checkChaseOutcome(
  quarry: ChaseParticipant,
  pursuers: ChaseParticipant[],
  escapeThresholdFeet: number = 120
): 'ongoing' | 'captured' | 'escaped' {
  if (quarry.status === 'exhausted' || quarry.status === 'captured') {
    return 'captured';
  }

  const activePursuers = pursuers.filter(p => p.status === 'active');
  if (activePursuers.length === 0) {
    return 'escaped';
  }

  // Comprobar si algún perseguidor la interceptó
  for (const pursuer of activePursuers) {
    if (pursuer.currentPosition >= quarry.currentPosition) {
      return 'captured';
    }
  }

  // Comprobar si la presa sacó suficiente ventaja a todos
  const closestPursuer = Math.max(...activePursuers.map(p => p.currentPosition));
  const leadDistance = quarry.currentPosition - closestPursuer;

  if (leadDistance >= escapeThresholdFeet) {
    return 'escaped';
  }

  return 'ongoing';
}

/**
 * Resuelve una Acción de Guarida en Iniciativa 20 contra un grupo de objetivos.
 */
export function resolveLairAction(
  action: DragonLairAction,
  targets: Array<{ name: string; saveBonus: number; forcedRoll?: number }>
): Array<{
  targetName: string;
  roll: number;
  totalSave: number;
  success: boolean;
  damage: number;
  message: string;
}> {
  // Tirar el daño de la acción de guarida si aplica
  let baseDamage = 0;
  if (action.damageDice && action.damageDice !== '0') {
    try {
      const rolled = rollDice(action.damageDice);
      baseDamage = Math.max(1, rolled.total);
    } catch {
      baseDamage = 20;
    }
  }

  return targets.map(target => {
    const d20 = target.forcedRoll !== undefined 
      ? target.forcedRoll 
      : Math.floor(Math.random() * 20) + 1;
    const totalSave = d20 + target.saveBonus;
    const success = totalSave >= action.dc;

    const damage = baseDamage > 0 
      ? (success ? Math.floor(baseDamage / 2) : baseDamage) 
      : 0;

    let message = `${target.name}: Tiró ${d20} + ${target.saveBonus} = ${totalSave} vs CD ${action.dc}. `;
    if (success) {
      message += `¡Éxito! ${damage > 0 ? `Sufre la mitad de daño (${damage} daño por ${action.damageType}).` : 'Efecto evitado.'}`;
    } else {
      message += `¡Fallo! ${damage > 0 ? `Recibe ${damage} de daño por ${action.damageType}.` : 'Afectado por la guarida.'}`;
    }

    return {
      targetName: target.name,
      roll: d20,
      totalSave,
      success,
      damage,
      message
    };
  });
}
