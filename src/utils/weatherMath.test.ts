import { describe, it, expect } from 'vitest';
import {
  calculateColdSaveDc,
  calculateHeatSaveDc,
  checkHeatDisadvantage,
  resolveMistWhispers,
  calculateDailyVoyageDistance,
  calculateStormDamage,
  getRandomMistIncident,
  getRandomNavalHazard
} from './weatherMath';

describe('weatherMath - Reglas de Supervivencia y Clima DMG 2024 & Xanathar', () => {
  it('calcula correctamente la CD de Salvación contra Frío Extremo', () => {
    // Exposición estándar (hora 1 a 4: CD 10)
    expect(calculateColdSaveDc(1, false)).toBe(10);
    expect(calculateColdSaveDc(4, false)).toBe(10);
    // Exposición prolongada (> 4 horas: +1 cada 2 horas)
    expect(calculateColdSaveDc(6, false)).toBe(11);
    expect(calculateColdSaveDc(8, false)).toBe(12);
    // Inmersión en agua helada (base + 5 = 15)
    expect(calculateColdSaveDc(1, true)).toBe(15);
  });

  it('calcula la progresión de CD por Calor Extremo (CD 10 + 1 por hora adicional)', () => {
    expect(calculateHeatSaveDc(1)).toBe(10);
    expect(calculateHeatSaveDc(2)).toBe(11);
    expect(calculateHeatSaveDc(4)).toBe(13);
    expect(calculateHeatSaveDc(6)).toBe(15);
  });

  it('determina desventaja en salvación de calor por armadura pesada o media', () => {
    expect(checkHeatDisadvantage('none')).toBe(false);
    expect(checkHeatDisadvantage('light')).toBe(false);
    expect(checkHeatDisadvantage('medium')).toBe(true);
    expect(checkHeatDisadvantage('heavy')).toBe(true);
  });

  it('resuelve los susurros de las Brumas de Ravenloft y el impacto en el medidor de estrés', () => {
    // Éxito en salvación
    const passResult = resolveMistWhispers(16, 14, 2, 1);
    expect(passResult.success).toBe(true);
    expect(passResult.stressChange).toBe(0);
    expect(passResult.newStress).toBe(2);

    // Fracaso en salvación
    const failResult = resolveMistWhispers(11, 14, 2, 2);
    expect(failResult.success).toBe(false);
    expect(failResult.stressChange).toBe(2);
    expect(failResult.newStress).toBe(4);
  });

  it('calcula distancias de navegación diaria según condición marítima y pericia', () => {
    // Carabela (4 nudos * 24h = 96 millas base)
    // Con viento favorable (+35%) y buen navegante (+15%)
    const favorableDist = calculateDailyVoyageDistance('sailing_ship', 'favorable', true);
    expect(favorableDist).toBeGreaterThan(140);

    // En calma chicha, un barco puramente de vela apenas avanza
    const calmSailDist = calculateDailyVoyageDistance('sailing_ship', 'calm', false);
    expect(calmSailDist).toBeLessThan(10);

    // Pero una galera con remeros (4 nudos * 24h = 96 base) en calma mantiene avance
    const calmGalleyDist = calculateDailyVoyageDistance('galley', 'calm', true);
    expect(calmGalleyDist).toBeGreaterThan(50);
  });

  it('gestiona el daño del casco por tormentas respetando el umbral de daño', () => {
    // En mar en calma o favorable nunca hay daño
    expect(calculateStormDamage('calm', 15)).toBe(0);
    expect(calculateStormDamage('rough', 15)).toBe(0);

    // Con umbral de daño astronómico (999), absorbe todo daño
    expect(calculateStormDamage('hurricane', 999)).toBe(0);
  });

  it('obtiene incidentes de bruma y peligros marítimos canónicos reproducibles', () => {
    const mist1 = getRandomMistIncident(1);
    expect(mist1.title).toContain('Susurros');
    expect(mist1.saveAbility).toBe('wis');

    const hazard1 = getRandomNavalHazard(1);
    expect(hazard1.title).toContain('Arrecife');
    expect(hazard1.hullDamageDice).toBe('4d10');

    const hazard5 = getRandomNavalHazard(5);
    expect(hazard5.title).toContain('Kraken');
  });
});
