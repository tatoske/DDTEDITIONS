import { describe, it, expect } from 'vitest';
import {
  getTrapBenchmark,
  applyCountermeasureAttempt,
  damageTrapComponent,
  isTrapFullyDisarmed,
  calculateEscalatedDamage,
  resolveActiveElementAttack,
  resolveActiveElementSave
} from './trapMath';
import { ComplexTrapCountermeasure, ComplexTrapActiveElement, ComplexTrapDynamicElement } from '../types/dnd';

describe('trapMath - Motor de Trampas Complejas de Xanathar & DMG 2024', () => {
  it('obtiene benchmarks oficiales de severidad de la DMG 2024 según nivel y letalidad', () => {
    // Rango 1 (1-4) Peligrosa
    const b1 = getTrapBenchmark('tier1', 'dangerous');
    expect(b1.saveDc).toBe(12);
    expect(b1.attackBonus).toBe(6);
    expect(b1.damageDice).toBe('4d10');

    // Rango 2 (5-10) Letal
    const b2 = getTrapBenchmark('tier2', 'deadly');
    expect(b2.saveDc).toBe(17);
    expect(b2.attackBonus).toBe(10);
    expect(b2.damageDice).toBe('18d10');

    // Rango 4 (17-20) Letal
    const b4 = getTrapBenchmark('tier4', 'deadly');
    expect(b4.saveDc).toBe(21);
    expect(b4.damageDice).toBe('30d10');
  });

  it('procesa contramedidas de desactivación acumulativas correctamente', () => {
    const cm: ComplexTrapCountermeasure = {
      id: 'test_gear',
      title: 'Engranaje de Cuchillas',
      skillOrTool: 'Herramientas de Ladrón',
      dc: 15,
      requiredSuccesses: 3,
      currentSuccesses: 0,
      description: 'Trabar engranajes',
      isDisarmed: false
    };

    // Fallo de tirada (< 15)
    const failRes = applyCountermeasureAttempt(cm, 12);
    expect(failRes.success).toBe(false);
    expect(failRes.newSuccesses).toBe(0);
    expect(failRes.isNowDisarmed).toBe(false);

    // Éxito 1 (>= 15)
    const succ1 = applyCountermeasureAttempt(cm, 16);
    expect(succ1.success).toBe(true);
    expect(succ1.newSuccesses).toBe(1);
    expect(succ1.isNowDisarmed).toBe(false);

    // Éxito con 2 ya acumulados -> Completa el tercer éxito y neutraliza el componente
    const cm2 = { ...cm, currentSuccesses: 2 };
    const succ3 = applyCountermeasureAttempt(cm2, 18);
    expect(succ3.success).toBe(true);
    expect(succ3.newSuccesses).toBe(3);
    expect(succ3.isNowDisarmed).toBe(true);
  });

  it('permite dañar y destruir físicamente los componentes mecánicos de la trampa', () => {
    const cm: ComplexTrapCountermeasure = {
      id: 'gargoyle',
      title: 'Cabeza de Gárgola',
      skillOrTool: 'Ataque Físico',
      dc: 14,
      requiredSuccesses: 2,
      currentSuccesses: 0,
      description: 'Estatua de piedra',
      componentAc: 16,
      maxHp: 40,
      currentHp: 40,
      isDisarmed: false
    };

    // Daño parcial (15 PG de 40)
    const dmg1 = damageTrapComponent(cm, 15);
    expect(dmg1.newHp).toBe(25);
    expect(dmg1.isNowDestroyed).toBe(false);

    // Daño que supera los PG restantes (30 PG de 25)
    const cmDamaged = { ...cm, currentHp: 25 };
    const dmg2 = damageTrapComponent(cmDamaged, 30);
    expect(dmg2.newHp).toBe(0);
    expect(dmg2.isNowDestroyed).toBe(true);
  });

  it('determina si la trampa completa ha sido neutralizada', () => {
    const cm1: ComplexTrapCountermeasure = {
      id: '1',
      title: 'Engranaje',
      skillOrTool: 'Ladrón',
      dc: 15,
      requiredSuccesses: 3,
      currentSuccesses: 3,
      description: '',
      isDisarmed: true
    };
    const cm2: ComplexTrapCountermeasure = {
      id: '2',
      title: 'Válvula',
      skillOrTool: 'Fuerza',
      dc: 14,
      requiredSuccesses: 2,
      currentSuccesses: 1,
      description: '',
      isDisarmed: false
    };

    // Con una desactivada y otra activa, no está completamente desarmada
    expect(isTrapFullyDisarmed([cm1, cm2])).toBe(false);

    // Cuando ambas están desactivadas
    const cm2Disarmed = { ...cm2, isDisarmed: true };
    expect(isTrapFullyDisarmed([cm1, cm2Disarmed])).toBe(true);
  });

  it('resuelve tiradas de ataque y salvación de elementos activos', () => {
    const bladeElement: ComplexTrapActiveElement = {
      id: 'blade',
      initiativeCount: 20,
      title: 'Cuchillas',
      description: '',
      attackBonus: 6,
      damageDice: '4d10',
      damageType: 'Cortante',
      affectedArea: 'Pasillo'
    };

    // Ataque forzado con d20 = 12 (+6 = 18 vs CA 15 -> Impacto)
    const attackHit = resolveActiveElementAttack(bladeElement, 15, 0, 12);
    expect(attackHit.isHit).toBe(true);
    expect(attackHit.totalAttack).toBe(18);
    expect(attackHit.damageRolled).toBeGreaterThan(0);

    // Ataque forzado con d20 = 2 (+6 = 8 vs CA 15 -> Fallo)
    const attackMiss = resolveActiveElementAttack(bladeElement, 15, 0, 2);
    expect(attackMiss.isHit).toBe(false);
    expect(attackMiss.damageRolled).toBe(0);

    // Salvación contra ácido (CD 15, 40 de daño base)
    const acidElement: ComplexTrapActiveElement = {
      id: 'acid',
      initiativeCount: 20,
      title: 'Ácido',
      description: '',
      saveDc: 15,
      damageDice: '4d10',
      damageType: 'Ácido',
      affectedArea: 'Suelo'
    };

    // Éxito en salvación (Tirada 16 vs CD 15): Recibe la mitad (20 de 40)
    const savePassed = resolveActiveElementSave(acidElement, 16, 40);
    expect(savePassed.passed).toBe(true);
    expect(savePassed.damageTaken).toBe(20);

    // Fracaso en salvación (Tirada 10 vs CD 15): Recibe el daño completo (40)
    const saveFailed = resolveActiveElementSave(acidElement, 10, 40);
    expect(saveFailed.passed).toBe(false);
    expect(saveFailed.damageTaken).toBe(40);
  });
});
