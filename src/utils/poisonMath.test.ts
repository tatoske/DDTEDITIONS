import { describe, it, expect } from 'vitest';
import {
  resolvePoisonExposure,
  simulateHarvestingAttempt,
  resolveDailyDiseaseSave,
  calculateCraftingProgress
} from './poisonMath';
import { POISONS_CATALOG, DISEASES_CATALOG, ALCHEMICAL_RECIPES } from '../data/poisonsAndDiseasesData';

describe('poisonMath - Sistema Canónico de Venenos, Enfermedades y Alquimia', () => {
  it('resuelve exposición a Veneno Drow con caída en inconsciencia al fallar por 5 o más', () => {
    const drowPoison = POISONS_CATALOG.find(p => p.id === 'drow_poison')!;

    // Éxito en salvación (Tirada 14 vs CD 13)
    const passRes = resolvePoisonExposure(drowPoison, 14);
    expect(passRes.passed).toBe(true);
    expect(passRes.conditionsApplied.length).toBe(0);

    // Fallo estándar (Tirada 10 vs CD 13 -> Envenenado, pero no inconsciente)
    const standardFail = resolvePoisonExposure(drowPoison, 10);
    expect(standardFail.passed).toBe(false);
    expect(standardFail.conditionsApplied).toContain('Envenenado');
    expect(standardFail.conditionsApplied).not.toContain('Inconsciente');

    // Fallo crítico por 5 o más (Tirada 7 <= 8 -> Envenenado e Inconsciente)
    const severeFail = resolvePoisonExposure(drowPoison, 7);
    expect(severeFail.passed).toBe(false);
    expect(severeFail.conditionsApplied).toContain('Envenenado');
    expect(severeFail.conditionsApplied).toContain('Inconsciente');
  });

  it('aplica daño a la mitad y evita condiciones al superar la salvación de Sangre de Asesino', () => {
    const assassinsBlood = POISONS_CATALOG.find(p => p.id === 'assassins_blood')!;

    // Éxito
    const passRes = resolvePoisonExposure(assassinsBlood, 12);
    expect(passRes.passed).toBe(true);
    expect(passRes.damageTaken).toBe(Math.floor(passRes.fullDamage / 2));
    expect(passRes.conditionsApplied.length).toBe(0);

    // Fracaso
    const failRes = resolvePoisonExposure(assassinsBlood, 8);
    expect(failRes.passed).toBe(false);
    expect(failRes.damageTaken).toBe(failRes.fullDamage);
    expect(failRes.conditionsApplied).toContain('Envenenado');
  });

  it('evalúa la extracción de veneno de monstruos con riesgo de autoenvenenamiento accidental', () => {
    // Éxito (Tirada 21 >= 20)
    const successRes = simulateHarvestingAttempt(21, true);
    expect(successRes.success).toBe(true);
    expect(successRes.dosesExtracted).toBe(1);
    expect(successRes.accidentalSelfExposure).toBe(false);

    // Fallo normal sin accidente (Tirada 17: entre 16 y 19)
    const normalFail = simulateHarvestingAttempt(17, true);
    expect(normalFail.success).toBe(false);
    expect(normalFail.dosesExtracted).toBe(0);
    expect(normalFail.accidentalSelfExposure).toBe(false);

    // Fallo grave por 5 o más (Tirada 14 <= 15 -> Autoexposición)
    const severeFail = simulateHarvestingAttempt(14, true);
    expect(severeFail.success).toBe(false);
    expect(severeFail.accidentalSelfExposure).toBe(true);
  });

  it('gestiona la progresión y curación de enfermedades con 3 salvaciones consecutivas', () => {
    const sewerPlague = DISEASES_CATALOG.find(d => d.id === 'sewer_plague')!;

    // Día 1: Salvación exitosa (1/3)
    const day1 = resolveDailyDiseaseSave(sewerPlague, 15, 0);
    expect(day1.passed).toBe(true);
    expect(day1.newSuccesses).toBe(1);
    expect(day1.isCured).toBe(false);

    // Día 2: Salvación fallida (reinicio de racha a 0)
    const day2Fail = resolveDailyDiseaseSave(sewerPlague, 8, 1);
    expect(day2Fail.passed).toBe(false);
    expect(day2Fail.newSuccesses).toBe(0);
    expect(day2Fail.isCured).toBe(false);

    // Día 3 a 5: Tres éxitos consecutivos -> Curación
    const day3Success = resolveDailyDiseaseSave(sewerPlague, 12, 2);
    expect(day3Success.passed).toBe(true);
    expect(day3Success.newSuccesses).toBe(3);
    expect(day3Success.isCured).toBe(true);
  });

  it('calcula correctamente el avance en la elaboración de pociones alquímicas', () => {
    const greaterHealing = ALCHEMICAL_RECIPES.find(r => r.id === 'craft_greater_healing')!; // Requiere 3 días

    // 1 día trabajado (33%)
    const prog1 = calculateCraftingProgress(greaterHealing, 1);
    expect(prog1.isCompleted).toBe(false);
    expect(prog1.daysRemaining).toBe(2);
    expect(prog1.percentProgress).toBe(33);

    // 3 días trabajados (100% completada)
    const prog3 = calculateCraftingProgress(greaterHealing, 3);
    expect(prog3.isCompleted).toBe(true);
    expect(prog3.daysRemaining).toBe(0);
    expect(prog3.percentProgress).toBe(100);
  });
});
