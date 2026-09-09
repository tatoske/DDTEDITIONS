import { describe, it, expect } from 'vitest';
import { 
  getSidekickProficiency, 
  getHitDieAverage, 
  calculateSidekickHp, 
  getAccumulatedFeatures, 
  scaleSidekickToLevel 
} from './sidekickMath';
import { SIDEKICK_PRESETS } from '../data/sidekicksData';

describe('sidekickMath', () => {
  it('calcula el bonificador de competencia según el nivel oficial de Tasha', () => {
    expect(getSidekickProficiency(1)).toBe(2);
    expect(getSidekickProficiency(4)).toBe(2);
    expect(getSidekickProficiency(5)).toBe(3);
    expect(getSidekickProficiency(8)).toBe(3);
    expect(getSidekickProficiency(9)).toBe(4);
    expect(getSidekickProficiency(12)).toBe(4);
    expect(getSidekickProficiency(13)).toBe(5);
    expect(getSidekickProficiency(16)).toBe(5);
    expect(getSidekickProficiency(17)).toBe(6);
    expect(getSidekickProficiency(20)).toBe(6);
  });

  it('obtiene el promedio de dado de golpe correctamente', () => {
    expect(getHitDieAverage('d6')).toBe(4);
    expect(getHitDieAverage('d8')).toBe(5);
    expect(getHitDieAverage('1d10')).toBe(6);
    expect(getHitDieAverage('d12')).toBe(7);
  });

  it('calcula los Puntos de Golpe correctamente según la fórmula de Tasha', () => {
    // Mastín: Base 13, d8 (avg 5), CON 14 (+2) -> 7 PG por nivel adicional
    // Nivel 1: 13
    expect(calculateSidekickHp(13, 'd8', 14, 1)).toBe(13);
    // Nivel 2: 13 + 7 = 20
    expect(calculateSidekickHp(13, 'd8', 14, 2)).toBe(20);
    // Nivel 5: 13 + 7 * 4 = 41
    expect(calculateSidekickHp(13, 'd8', 14, 5)).toBe(41);
  });

  it('acumula los rasgos por clase hasta el nivel objetivo', () => {
    const warriorFeaturesLvl6 = getAccumulatedFeatures('warrior', 6);
    const names = warriorFeaturesLvl6.map(f => f.name);
    expect(names).toContain('Papel Marcial (Atacante / Defensor)');
    expect(names).toContain('Segundo Aire (Second Wind)');
    expect(names).toContain('Crítico Mejorado (Improved Critical)');
    expect(names).toContain('Ataque Adicional (Extra Attack)');
    expect(names).not.toContain('Indomable (Indomitable)'); // Es de nivel 7
  });

  it('escala un Escudero completo de nivel 1 a nivel 6', () => {
    const mastiff = SIDEKICK_PRESETS[0]; // Mastín Guerrero Nvl 1
    const scaled = scaleSidekickToLevel(mastiff, 6);

    expect(scaled.level).toBe(6);
    expect(scaled.maxHp).toBe(48); // 13 base + (5+2)*5 = 48
    // Ataque sube con el aumento de competencia (+2 a +3, delta +1)
    expect(scaled.attacks[0].bonus).toBe(mastiff.attacks[0].bonus + 1);
    // Debe tener el rasgo de Ataque Adicional
    const hasExtraAttack = scaled.features.some(f => f.name.includes('Ataque Adicional'));
    expect(hasExtraAttack).toBe(true);
  });
});
