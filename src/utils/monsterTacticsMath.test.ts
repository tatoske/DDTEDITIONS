import { describe, it, expect } from 'vitest';
import {
  calculateAdjustedEncounterXp,
  evaluateMoraleCheck,
  calculateCoverBonus,
  calculateAmbushAdvantage
} from './monsterTacticsMath';

describe('monsterTacticsMath - Módulo 11 Tácticas y Encuentros', () => {
  describe('calculateAdjustedEncounterXp', () => {
    it('debe aplicar multiplicador 1x para 1 solo monstruo', () => {
      const result = calculateAdjustedEncounterXp([{ xp: 1000, quantity: 1 }]);
      expect(result.rawXp).toBe(1000);
      expect(result.monsterCount).toBe(1);
      expect(result.multiplier).toBe(1);
      expect(result.adjustedXp).toBe(1000);
    });

    it('debe aplicar multiplicador 1.5x para 2 monstruos', () => {
      const result = calculateAdjustedEncounterXp([
        { xp: 500, quantity: 1 },
        { xp: 500, quantity: 1 }
      ]);
      expect(result.monsterCount).toBe(2);
      expect(result.multiplier).toBe(1.5);
      expect(result.adjustedXp).toBe(1500);
    });

    it('debe aplicar multiplicador 2x para 3 a 6 monstruos', () => {
      const result = calculateAdjustedEncounterXp([
        { xp: 100, quantity: 4 }
      ]);
      expect(result.monsterCount).toBe(4);
      expect(result.multiplier).toBe(2);
      expect(result.adjustedXp).toBe(800);
    });

    it('debe aplicar multiplicadores superiores (2.5x, 3x, 4x) según la cantidad', () => {
      const eightMonsters = calculateAdjustedEncounterXp([{ xp: 100, quantity: 8 }]);
      expect(eightMonsters.multiplier).toBe(2.5);

      const twelveMonsters = calculateAdjustedEncounterXp([{ xp: 100, quantity: 12 }]);
      expect(twelveMonsters.multiplier).toBe(3);

      const sixteenMonsters = calculateAdjustedEncounterXp([{ xp: 100, quantity: 16 }]);
      expect(sixteenMonsters.multiplier).toBe(4);
    });
  });

  describe('evaluateMoraleCheck', () => {
    it('criaturas de la Guerra de la Sangre nunca rompen moral', () => {
      const result = evaluateMoraleCheck(1, 100, true, -2, 'bloodwar', 1);
      expect(result.breaks).toBe(false);
      expect(result.actionTaken).toBe('fight_to_death');
    });

    it('mantiene la posición si supera la CD de moral', () => {
      // CD base 11, roll 15 + mod 0 = 15 >= 11
      const result = evaluateMoraleCheck(50, 100, false, 0, 'goblinoid', 15);
      expect(result.breaks).toBe(false);
      expect(result.actionTaken).toBe('fight_to_death');
    });

    it('ejecuta retirada ordenada si falla por 1 a 3 puntos', () => {
      // CD 11 + 3 (líder muerto) = 14. Roll 12 -> falla por 2
      const result = evaluateMoraleCheck(50, 100, true, 0, 'goblinoid', 12);
      expect(result.breaks).toBe(true);
      expect(result.actionTaken).toBe('orderly_retreat');
    });

    it('huye en pánico si falla por 4 a 7 puntos', () => {
      // CD 11 + 3 (líder) + 2 (vida <= 25%) = 16. Roll 10 -> falla por 6
      const result = evaluateMoraleCheck(10, 100, true, 0, 'orcs', 10);
      expect(result.breaks).toBe(true);
      expect(result.actionTaken).toBe('panic_flight');
    });

    it('se rinde incondicionalmente si el fallo es catastrófico (8 o más)', () => {
      // CD 16. Roll 2 + mod 0 = 2 -> falla por 14
      const result = evaluateMoraleCheck(5, 100, true, 0, 'yuanti', 2);
      expect(result.breaks).toBe(true);
      expect(result.actionTaken).toBe('surrender');
    });
  });

  describe('calculateCoverBonus', () => {
    it('otorga +2 CA y salvaciones de Des para media cobertura', () => {
      const res = calculateCoverBonus('half');
      expect(res.acBonus).toBe(2);
      expect(res.dexSaveBonus).toBe(2);
      expect(res.attacksBlocked).toBe(false);
    });

    it('otorga +5 CA y salvaciones de Des para cobertura tres cuartos', () => {
      const res = calculateCoverBonus('three_quarters');
      expect(res.acBonus).toBe(5);
      expect(res.dexSaveBonus).toBe(5);
      expect(res.attacksBlocked).toBe(false);
    });

    it('bloquea ataques directos con cobertura total', () => {
      const res = calculateCoverBonus('total');
      expect(res.attacksBlocked).toBe(true);
    });
  });

  describe('calculateAmbushAdvantage', () => {
    it('otorga ventaja y 2d6 de daño a emboscadores en asalto de sorpresa', () => {
      const res = calculateAmbushAdvantage('ambusher', true);
      expect(res.hasAdvantage).toBe(true);
      expect(res.extraDamageDice).toBe('2d6');
    });

    it('no otorga bonificaciones si no es ronda de sorpresa', () => {
      const res = calculateAmbushAdvantage('ambusher', false);
      expect(res.hasAdvantage).toBe(false);
      expect(res.extraDamageDice).toBe('');
    });
  });
});
