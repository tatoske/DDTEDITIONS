import { 
  GroupPatronDef, 
  ActivePatronCampaignState, 
  PatronMission, 
  PatronIntrigueEntry,
  Character 
} from '../types/dnd';

export const MIN_REPUTATION = -5;
export const MAX_REPUTATION = 10;

/**
 * Obtiene el rango narrativo y color correspondiente a la reputación con el Patrón.
 */
export function getReputationTier(score: number): { label: string; badgeColor: string; description: string } {
  if (score >= 8) {
    return {
      label: 'Héroes Consagrados',
      badgeColor: '#10b981', // Verde esmeralda
      description: 'El patrón confía ciegamente en el grupo y les encomienda el destino de la organización.'
    };
  }
  if (score >= 4) {
    return {
      label: 'Agentes de Confianza',
      badgeColor: '#0ea5e9', // Azul cian
      description: 'El grupo tiene acceso a recursos reservados y consideración prioritaria.'
    };
  }
  if (score >= 1) {
    return {
      label: 'Operativos en Buen Término',
      badgeColor: '#6366f1', // Indigo
      description: 'Cumplen sus asignaciones con diligencia y cobran sus estipendios con puntualidad.'
    };
  }
  if (score === 0) {
    return {
      label: 'Nuevos Reclutas / A Prueba',
      badgeColor: '#f59e0b', // Ámbar
      description: 'El patrón evalúa su lealtad y capacidad antes de otorgar privilegios mayores.'
    };
  }
  if (score >= -3) {
    return {
      label: 'En Observación y Sospecha',
      badgeColor: '#f97316', // Naranja
      description: 'Misiones pasadas han salido mal o se sospecha de deslealtad. Se asignan vigilantes.'
    };
  }
  return {
    label: 'Al Borde de la Purga',
    badgeColor: '#ef4444', // Rojo intenso
    description: 'El patrón considera al grupo una carga o una amenaza; cualquier fallo será letal.'
  };
}

/**
 * Modifica la reputación dentro de los límites canónicos [-5, +10].
 */
export function modifyPatronReputation(currentReputation: number, delta: number): number {
  const next = currentReputation + delta;
  return Math.max(MIN_REPUTATION, Math.min(MAX_REPUTATION, next));
}

/**
 * Modifica los favores debidos (acumulativos).
 */
export function modifyPatronFavors(currentFavors: number, delta: number): number {
  return currentFavors + delta;
}

/**
 * Genera una misión para el patrón seleccionado (aleatoria o por tirada dada).
 */
export function rollPatronMission(patron: GroupPatronDef, chosenRoll?: number): PatronMission {
  const table = patron.missionGeneratorTable;
  if (!table || table.length === 0) {
    throw new Error(`El patrón ${patron.name} no tiene misiones configuradas.`);
  }

  const roll = chosenRoll !== undefined 
    ? chosenRoll 
    : Math.floor(Math.random() * table.length) + 1;

  const entry = table.find(m => m.roll === roll) || table[0];
  const uniqueId = `pm_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

  return {
    id: uniqueId,
    patronId: patron.id,
    title: entry.title,
    prompt: entry.prompt,
    target: entry.target,
    rewardGp: entry.defaultRewardGp,
    favorReward: entry.favorReward,
    assignedDate: new Date().toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    }),
    status: 'pending'
  };
}

/**
 * Obtiene una complicación o intriga aleatoria del patrón.
 */
export function rollPatronIntrigue(patron: GroupPatronDef, chosenRoll?: number): PatronIntrigueEntry {
  const table = patron.intriguesTable;
  if (!table || table.length === 0) {
    return {
      roll: 1,
      title: 'Sospecha Silenciosa',
      complication: 'El patrón mantiene vigilancia discreta sobre los movimientos del grupo.'
    };
  }

  const roll = chosenRoll !== undefined 
    ? chosenRoll 
    : Math.floor(Math.random() * table.length) + 1;

  return table.find(i => i.roll === roll) || table[0];
}

/**
 * Resuelve el resultado de una misión activa.
 */
export function resolveMissionOutcome(
  state: ActivePatronCampaignState,
  missionId: string,
  outcome: 'completed' | 'failed'
): { 
  updatedState: ActivePatronCampaignState; 
  goldAwarded: number; 
  favorsAwarded: number;
  reputationDelta: number;
} {
  const missionIndex = state.missions.findIndex(m => m.id === missionId);
  if (missionIndex === -1) {
    return { 
      updatedState: state, 
      goldAwarded: 0, 
      favorsAwarded: 0, 
      reputationDelta: 0 
    };
  }

  const mission = state.missions[missionIndex];
  if (mission.status !== 'pending') {
    return { 
      updatedState: state, 
      goldAwarded: 0, 
      favorsAwarded: 0, 
      reputationDelta: 0 
    };
  }

  let goldAwarded = 0;
  let favorsAwarded = 0;
  let reputationDelta = 0;

  if (outcome === 'completed') {
    goldAwarded = mission.rewardGp;
    favorsAwarded = mission.favorReward;
    reputationDelta = 1;
  } else {
    goldAwarded = 0;
    favorsAwarded = -1;
    reputationDelta = -1;
  }

  const updatedMission: PatronMission = {
    ...mission,
    status: outcome,
    completedDate: new Date().toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  };

  const updatedMissions = [...state.missions];
  updatedMissions[missionIndex] = updatedMission;

  const nextReputation = modifyPatronReputation(state.reputationScore, reputationDelta);
  const nextFavors = modifyPatronFavors(state.favorsOwed, favorsAwarded);
  const nextTotalGold = state.totalGoldEarnedFromPatron + goldAwarded;

  return {
    updatedState: {
      ...state,
      reputationScore: nextReputation,
      favorsOwed: nextFavors,
      totalGoldEarnedFromPatron: nextTotalGold,
      missions: updatedMissions
    },
    goldAwarded,
    favorsAwarded,
    reputationDelta
  };
}

/**
 * Reparte el estipendio diario del patrón entre los aventureros del grupo.
 */
export function distributeStipend(characters: Character[], gpPerCharacter: number): {
  updatedCharacters: Character[];
  totalDistributedGp: number;
} {
  if (gpPerCharacter <= 0 || characters.length === 0) {
    return { updatedCharacters: characters, totalDistributedGp: 0 };
  }

  const updatedCharacters = characters.map(char => {
    const currentGp = char.coins?.gp ?? 0;
    return {
      ...char,
      coins: {
        ...char.coins,
        gp: currentGp + gpPerCharacter
      }
    };
  });

  return {
    updatedCharacters,
    totalDistributedGp: gpPerCharacter * characters.length
  };
}
