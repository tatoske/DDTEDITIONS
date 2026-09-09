import { describe, it, expect } from 'vitest';
import { 
  getAbilityModifier, 
  formatModifier, 
  getProficiencyBonus, 
  rollDice, 
  calculateEncounterDifficulty,
  estimateMonsterCr
} from './dndMath';

describe('D&D 2024 Math & Rule Utilities', () => {
  it('correctly calculates ability modifiers for standard values', () => {
    expect(getAbilityModifier(10)).toBe(0);
    expect(getAbilityModifier(11)).toBe(0);
    expect(getAbilityModifier(12)).toBe(1);
    expect(getAbilityModifier(14)).toBe(2);
    expect(getAbilityModifier(16)).toBe(3);
    expect(getAbilityModifier(18)).toBe(4);
    expect(getAbilityModifier(20)).toBe(5);
    expect(getAbilityModifier(8)).toBe(-1);
    expect(getAbilityModifier(6)).toBe(-2);
    expect(getAbilityModifier(1)).toBe(-5);
  });

  it('formats modifiers with + or - signs cleanly', () => {
    expect(formatModifier(3)).toBe('+3');
    expect(formatModifier(0)).toBe('+0');
    expect(formatModifier(-2)).toBe('-2');
  });

  it('calculates proficiency bonus by level according to D&D 2024 rules', () => {
    expect(getProficiencyBonus(1)).toBe(2);
    expect(getProficiencyBonus(4)).toBe(2);
    expect(getProficiencyBonus(5)).toBe(3);
    expect(getProficiencyBonus(8)).toBe(3);
    expect(getProficiencyBonus(9)).toBe(4);
    expect(getProficiencyBonus(13)).toBe(5);
    expect(getProficiencyBonus(17)).toBe(6);
    expect(getProficiencyBonus(20)).toBe(6);
  });

  it('rolls dice within expected range', () => {
    for (let i = 0; i < 20; i++) {
      const d20 = rollDice('1d20+3');
      expect(d20.total).toBeGreaterThanOrEqual(4);
      expect(d20.total).toBeLessThanOrEqual(23);
      expect(d20.bonus).toBe(3);
      expect(d20.diceSides).toBe(20);
    }
  });

  it('calculates encounter difficulty correctly for a 4-player level 1 party', () => {
    // 4 level 1 players: easy: 100, med: 200, hard: 300, deadly: 400
    // 1 Goblin (CR 1/4 = 50 XP, 1 monster mult = 1) -> 50 XP < 100 -> Trivial
    const res1 = calculateEncounterDifficulty([1, 1, 1, 1], ['1/4']);
    expect(res1.difficulty).toBe('Trivial');
    expect(res1.totalXp).toBe(50);

    // 2 Goblins (2 * 50 = 100 * 1.5 = 150 XP) -> >= easy 100 y < med 200 -> Fácil
    const res2 = calculateEncounterDifficulty([1, 1, 1, 1], ['1/4', '1/4']);
    expect(res2.difficulty).toBe('Fácil');
    expect(res2.adjustedXp).toBe(150);

    // 4 Goblins (4 * 50 = 200 XP * mult 2 = 400 XP) -> >= deadly 400 -> Mortal
    const res3 = calculateEncounterDifficulty([1, 1, 1, 1], ['1/4', '1/4', '1/4', '1/4']);
    expect(res3.difficulty).toBe('Mortal');
    expect(res3.adjustedXp).toBe(400);
  });

  it('estimates monster CR appropriately', () => {
    const crGoblin = estimateMonsterCr(7, 15, 5, 4);
    expect(['1/4', '1/2', '0']).toContain(crGoblin);

    const crOgre = estimateMonsterCr(59, 11, 13, 6);
    expect(['1', '2', '3']).toContain(crOgre);
  });
});
