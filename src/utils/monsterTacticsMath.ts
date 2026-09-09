import { MonsterMoraleCheckResult } from '../types/dnd';

/**
 * Calcula la experiencia (XP) ajustada y multiplicador de dificultad
 * según la cantidad de criaturas en el encuentro (Reglas DMG 2024 / 5e).
 */
export function calculateAdjustedEncounterXp(
  monsters: Array<{ xp: number; quantity?: number }>
): {
  rawXp: number;
  monsterCount: number;
  multiplier: number;
  adjustedXp: number;
} {
  let rawXp = 0;
  let monsterCount = 0;

  for (const m of monsters) {
    const qty = m.quantity || 1;
    rawXp += m.xp * qty;
    monsterCount += qty;
  }

  let multiplier = 1;
  if (monsterCount === 1) {
    multiplier = 1;
  } else if (monsterCount === 2) {
    multiplier = 1.5;
  } else if (monsterCount >= 3 && monsterCount <= 6) {
    multiplier = 2;
  } else if (monsterCount >= 7 && monsterCount <= 10) {
    multiplier = 2.5;
  } else if (monsterCount >= 11 && monsterCount <= 14) {
    multiplier = 3;
  } else if (monsterCount >= 15) {
    multiplier = 4;
  }

  const adjustedXp = Math.round(rawXp * multiplier);

  return {
    rawXp,
    monsterCount,
    multiplier,
    adjustedXp
  };
}

/**
 * Evalúa el chequeo de moral y desbandada ante bajas de líderes o heridas críticas.
 */
export function evaluateMoraleCheck(
  currentHp: number,
  maxHp: number,
  leaderDead: boolean,
  wisModifier: number,
  faction: string,
  fixedD20Roll?: number
): MonsterMoraleCheckResult {
  // Criaturas fanáticas o inmunes a la moral (Guerra de la Sangre / No-muertos)
  if (faction === 'bloodwar') {
    return {
      breaks: false,
      roll: 20,
      modifier: wisModifier,
      total: 20 + wisModifier,
      dc: 10,
      actionTaken: 'fight_to_death',
      description: 'Los combatientes de la Guerra de la Sangre están impulsados por odio cósmico absoluto y jamás se rinden ni huyen.'
    };
  }

  let dc = 11;
  if (leaderDead) dc += 3;
  const hpRatio = maxHp > 0 ? currentHp / maxHp : 0;
  if (hpRatio <= 0.25) dc += 2;

  const roll = fixedD20Roll ?? Math.floor(Math.random() * 20) + 1;
  const total = roll + wisModifier;

  if (total >= dc) {
    return {
      breaks: false,
      roll,
      modifier: wisModifier,
      total,
      dc,
      actionTaken: 'fight_to_death',
      description: `Mantiene la compostura y la posición de combate (Total ${total} vs CD ${dc}).`
    };
  }

  const margin = dc - total;
  let actionTaken: 'orderly_retreat' | 'panic_flight' | 'surrender';
  let description = '';

  if (margin <= 3) {
    actionTaken = 'orderly_retreat';
    description = `Retirada táctica ordenada: Se repliega cubriéndose con escudos y terreno difícil (Total ${total} vs CD ${dc}).`;
  } else if (margin <= 7) {
    actionTaken = 'panic_flight';
    description = `Huida en pánico: Rompe filas, arroja armas pesadas y corre a máxima velocidad hacia las salidas (Total ${total} vs CD ${dc}).`;
  } else {
    actionTaken = 'surrender';
    description = `Rendición incondicional: Cae de rodillas con las manos en alto implorando piedad o clemencia (Total ${total} vs CD ${dc}).`;
  }

  return {
    breaks: true,
    roll,
    modifier: wisModifier,
    total,
    dc,
    actionTaken,
    description
  };
}

/**
 * Calcula los bonificadores de cobertura táctica en combate (DMG 2024).
 */
export function calculateCoverBonus(
  coverType: 'none' | 'half' | 'three_quarters' | 'total'
): {
  acBonus: number;
  dexSaveBonus: number;
  attacksBlocked: boolean;
} {
  switch (coverType) {
    case 'half':
      return { acBonus: 2, dexSaveBonus: 2, attacksBlocked: false };
    case 'three_quarters':
      return { acBonus: 5, dexSaveBonus: 5, attacksBlocked: false };
    case 'total':
      return { acBonus: 0, dexSaveBonus: 0, attacksBlocked: true };
    case 'none':
    default:
      return { acBonus: 0, dexSaveBonus: 0, attacksBlocked: false };
  }
}

/**
 * Determina las bonificaciones del rol táctico en asalto de sorpresa.
 */
export function calculateAmbushAdvantage(
  role: string,
  isSurpriseRound: boolean
): {
  hasAdvantage: boolean;
  extraDamageDice: string;
} {
  if (!isSurpriseRound) {
    return { hasAdvantage: false, extraDamageDice: '' };
  }

  if (role === 'ambusher') {
    return { hasAdvantage: true, extraDamageDice: '2d6' };
  }

  if (role === 'skirmisher') {
    return { hasAdvantage: true, extraDamageDice: '' };
  }

  return { hasAdvantage: false, extraDamageDice: '' };
}
