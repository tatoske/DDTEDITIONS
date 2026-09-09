import { AbilityName, AbilitiesRecord } from '../types/dnd';

// Modificador oficial D&D: floor((score - 10) / 2)
export function getAbilityModifier(score: number): number {
  return Math.floor((score - 10) / 2);
}

export function formatModifier(mod: number): string {
  return mod >= 0 ? `+${mod}` : `${mod}`;
}

// Bonificador por competencia según nivel (D&D 5e / 2024)
export function getProficiencyBonus(level: number): number {
  if (level < 1) return 2;
  return Math.ceil(level / 4) + 1;
}

// Tirador de dados con parseo de cadenas como "1d20+5", "2d6+3", "1d8"
export interface DiceRollResult {
  total: number;
  rolls: number[];
  bonus: number;
  diceCount: number;
  diceSides: number;
  isCrit?: boolean;
  isFumble?: boolean;
  expression: string;
}

export function rollDice(expression: string): DiceRollResult {
  const clean = expression.replace(/\s+/g, '');
  const match = clean.match(/^(\d*)d(\d+)([+-]\d+)?$/i);
  
  if (!match) {
    // Si es solo un número fijo
    const fixedNum = parseInt(clean, 10);
    if (!isNaN(fixedNum)) {
      return {
        total: fixedNum,
        rolls: [fixedNum],
        bonus: 0,
        diceCount: 1,
        diceSides: fixedNum,
        expression
      };
    }
    // Fallback: 1d20
    const roll = Math.floor(Math.random() * 20) + 1;
    return {
      total: roll,
      rolls: [roll],
      bonus: 0,
      diceCount: 1,
      diceSides: 20,
      isCrit: roll === 20,
      isFumble: roll === 1,
      expression: '1d20'
    };
  }

  const count = match[1] ? parseInt(match[1], 10) : 1;
  const sides = parseInt(match[2], 10);
  const bonus = match[3] ? parseInt(match[3], 10) : 0;

  const rolls: number[] = [];
  let sum = 0;
  for (let i = 0; i < count; i++) {
    const r = Math.floor(Math.random() * sides) + 1;
    rolls.push(r);
    sum += r;
  }

  const total = sum + bonus;
  const isCrit = sides === 20 && count === 1 && rolls[0] === 20;
  const isFumble = sides === 20 && count === 1 && rolls[0] === 1;

  return {
    total,
    rolls,
    bonus,
    diceCount: count,
    diceSides: sides,
    isCrit,
    isFumble,
    expression
  };
}

// Tirada d20 con ventaja o desventaja
export function rollD20WithAdvantage(type: 'normal' | 'advantage' | 'disadvantage', bonus: number = 0) {
  const roll1 = Math.floor(Math.random() * 20) + 1;
  const roll2 = Math.floor(Math.random() * 20) + 1;
  
  let selected = roll1;
  if (type === 'advantage') {
    selected = Math.max(roll1, roll2);
  } else if (type === 'disadvantage') {
    selected = Math.min(roll1, roll2);
  }

  return {
    total: selected + bonus,
    rolls: type === 'normal' ? [roll1] : [roll1, roll2],
    selectedRoll: selected,
    bonus,
    type,
    isCrit: selected === 20,
    isFumble: selected === 1
  };
}

// Tabla XP por Valor de Desafío (CR) oficial D&D
export const CR_XP_MAP: Record<string, number> = {
  '0': 10,
  '1/8': 25,
  '1/4': 50,
  '1/2': 100,
  '1': 200,
  '2': 450,
  '3': 700,
  '4': 1100,
  '5': 1800,
  '6': 2300,
  '7': 2900,
  '8': 3900,
  '9': 5000,
  '10': 5900,
  '11': 7200,
  '12': 8400,
  '13': 10000,
  '14': 11500,
  '15': 13000,
  '16': 15000,
  '17': 18000,
  '18': 20000,
  '19': 22000,
  '20': 25000,
  '21': 33000,
  '22': 41000,
  '23': 50000,
  '24': 62000,
  '30': 155000
};

// Umbrales de XP por nivel de personaje (D&D 5e / 2024 DMG)
export const XP_THRESHOLDS_PER_LEVEL: Record<number, { easy: number; medium: number; hard: number; deadly: number }> = {
  1: { easy: 25, medium: 50, hard: 75, deadly: 100 },
  2: { easy: 50, medium: 100, hard: 150, deadly: 200 },
  3: { easy: 75, medium: 150, hard: 225, deadly: 400 },
  4: { easy: 125, medium: 250, hard: 375, deadly: 500 },
  5: { easy: 250, medium: 500, hard: 750, deadly: 1100 },
  6: { easy: 300, medium: 600, hard: 900, deadly: 1400 },
  7: { easy: 350, medium: 750, hard: 1100, deadly: 1700 },
  8: { easy: 450, medium: 900, hard: 1400, deadly: 2100 },
  9: { easy: 550, medium: 1100, hard: 1600, deadly: 2400 },
  10: { easy: 600, medium: 1200, hard: 1900, deadly: 2800 },
  11: { easy: 800, medium: 1600, hard: 2400, deadly: 3600 },
  12: { easy: 1000, medium: 2000, hard: 3000, deadly: 4500 },
  13: { easy: 1100, medium: 2200, hard: 3400, deadly: 5100 },
  14: { easy: 1250, medium: 2500, hard: 3800, deadly: 5700 },
  15: { easy: 1400, medium: 2800, hard: 4300, deadly: 6400 },
  16: { easy: 1600, medium: 3200, hard: 4800, deadly: 7200 },
  17: { easy: 2000, medium: 3900, hard: 5900, deadly: 8800 },
  18: { easy: 2100, medium: 4200, hard: 6300, deadly: 9500 },
  19: { easy: 2400, medium: 4900, hard: 7300, deadly: 10900 },
  20: { easy: 2800, medium: 5700, hard: 8500, deadly: 12700 }
};

// Multiplicador por cantidad de monstruos según DMG
export function getMonsterCountMultiplier(count: number, partySize: number = 4): number {
  let mult = 1;
  if (count === 1) mult = 1;
  else if (count === 2) mult = 1.5;
  else if (count >= 3 && count <= 6) mult = 2;
  else if (count >= 7 && count <= 10) mult = 2.5;
  else if (count >= 11 && count <= 14) mult = 3;
  else mult = 4;

  // Ajuste si el grupo es pequeño (< 3) o grande (>= 6)
  if (partySize < 3) {
    if (mult === 1) mult = 1.5;
    else if (mult === 1.5) mult = 2;
    else if (mult === 2) mult = 2.5;
    else if (mult === 2.5) mult = 3;
    else mult = 4;
  } else if (partySize >= 6) {
    if (mult === 1) mult = 0.5;
    else if (mult === 1.5) mult = 1;
    else if (mult === 2) mult = 1.5;
    else if (mult === 2.5) mult = 2;
    else mult = 2.5;
  }

  return mult;
}

// Calculador de dificultad de encuentro
export function calculateEncounterDifficulty(
  playerLevels: number[],
  monstersCr: string[]
): {
  difficulty: 'Trivial' | 'Fácil' | 'Medio' | 'Difícil' | 'Mortal';
  totalXp: number;
  adjustedXp: number;
  thresholds: { easy: number; medium: number; hard: number; deadly: number };
} {
  const partySize = playerLevels.length || 1;
  
  // Umbrales acumulados de la party
  const thresholds = playerLevels.reduce(
    (acc, lvl) => {
      const t = XP_THRESHOLDS_PER_LEVEL[Math.min(Math.max(lvl, 1), 20)];
      return {
        easy: acc.easy + t.easy,
        medium: acc.medium + t.medium,
        hard: acc.hard + t.hard,
        deadly: acc.deadly + t.deadly
      };
    },
    { easy: 0, medium: 0, hard: 0, deadly: 0 }
  );

  // Total de XP de los monstruos
  const totalXp = monstersCr.reduce((acc, cr) => acc + (CR_XP_MAP[cr] || 0), 0);
  const mult = getMonsterCountMultiplier(monstersCr.length, partySize);
  const adjustedXp = Math.round(totalXp * mult);

  let difficulty: 'Trivial' | 'Fácil' | 'Medio' | 'Difícil' | 'Mortal' = 'Trivial';
  if (adjustedXp >= thresholds.deadly) {
    difficulty = 'Mortal';
  } else if (adjustedXp >= thresholds.hard) {
    difficulty = 'Difícil';
  } else if (adjustedXp >= thresholds.medium) {
    difficulty = 'Medio';
  } else if (adjustedXp >= thresholds.easy) {
    difficulty = 'Fácil';
  }

  return {
    difficulty,
    totalXp,
    adjustedXp,
    thresholds
  };
}

// Calculador dinámico de CR para el Monster Builder (reglas DMG)
export function estimateMonsterCr(hp: number, ac: number, dpr: number, attackBonus: number): string {
  // CR defensivo básico basado en HP
  let defCr = 0;
  if (hp <= 6) defCr = 0;
  else if (hp <= 35) defCr = 1/4;
  else if (hp <= 49) defCr = 1/2;
  else if (hp <= 70) defCr = 1;
  else if (hp <= 85) defCr = 2;
  else if (hp <= 100) defCr = 3;
  else if (hp <= 115) defCr = 4;
  else if (hp <= 130) defCr = 5;
  else if (hp <= 145) defCr = 6;
  else if (hp <= 160) defCr = 7;
  else if (hp <= 175) defCr = 8;
  else if (hp <= 190) defCr = 9;
  else if (hp <= 205) defCr = 10;
  else if (hp <= 220) defCr = 11;
  else if (hp <= 235) defCr = 12;
  else if (hp <= 250) defCr = 13;
  else if (hp <= 265) defCr = 14;
  else if (hp <= 280) defCr = 15;
  else if (hp <= 295) defCr = 16;
  else if (hp <= 310) defCr = 17;
  else if (hp <= 325) defCr = 18;
  else if (hp <= 340) defCr = 19;
  else if (hp <= 355) defCr = 20;
  else defCr = 21;

  // CR ofensivo básico basado en Daño por Ronda (DPR)
  let offCr = 0;
  if (dpr <= 1) offCr = 0;
  else if (dpr <= 5) offCr = 1/4;
  else if (dpr <= 8) offCr = 1/2;
  else if (dpr <= 14) offCr = 1;
  else if (dpr <= 20) offCr = 2;
  else if (dpr <= 26) offCr = 3;
  else if (dpr <= 32) offCr = 4;
  else if (dpr <= 38) offCr = 5;
  else if (dpr <= 44) offCr = 6;
  else if (dpr <= 50) offCr = 7;
  else if (dpr <= 56) offCr = 8;
  else if (dpr <= 62) offCr = 9;
  else if (dpr <= 68) offCr = 10;
  else if (dpr <= 74) offCr = 11;
  else if (dpr <= 80) offCr = 12;
  else if (dpr <= 86) offCr = 13;
  else if (dpr <= 92) offCr = 14;
  else if (dpr <= 98) offCr = 15;
  else if (dpr <= 104) offCr = 16;
  else if (dpr <= 110) offCr = 17;
  else if (dpr <= 116) offCr = 18;
  else if (dpr <= 122) offCr = 19;
  else if (dpr <= 140) offCr = 20;
  else offCr = 22;

  const avgCr = (defCr + offCr) / 2;

  if (avgCr <= 0.125) return '0';
  if (avgCr <= 0.25) return '1/4';
  if (avgCr <= 0.5) return '1/2';
  return Math.round(avgCr).toString();
}
