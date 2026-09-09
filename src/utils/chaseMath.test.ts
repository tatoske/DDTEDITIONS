import { describe, it, expect } from 'vitest';
import { 
  calculateFreeDashes, 
  performDashAction, 
  rollChaseComplication,
  calculateRelativeDistance,
  checkChaseOutcome,
  resolveLairAction 
} from './chaseMath';
import { ChaseParticipant, DragonLairAction } from '../types/dnd';

describe('Chase Engine & Dragon Lair Math Utilities', () => {
  it('calculates free dashes accurately based on Constitution modifier (min 1)', () => {
    expect(calculateFreeDashes(2)).toBe(5); // 3 + 2
    expect(calculateFreeDashes(0)).toBe(3); // 3 + 0
    expect(calculateFreeDashes(-4)).toBe(1); // max(1, 3 - 4) = 1
  });

  it('performs dash action without save when free dashes remain', () => {
    const participant: ChaseParticipant = {
      id: 'p1',
      name: 'Corredor',
      role: 'quarry',
      speed: 30,
      conMod: 2,
      freeDashesTotal: 5,
      dashesUsed: 1,
      currentPosition: 30,
      status: 'active',
      exhaustionLevel: 0
    };

    const result = performDashAction(participant);
    expect(result.requiresSave).toBe(false);
    expect(result.exhaustionGained).toBe(false);
    expect(result.distanceGained).toBe(30);
    expect(result.updatedParticipant.currentPosition).toBe(60);
    expect(result.updatedParticipant.dashesUsed).toBe(2);
  });

  it('triggers CON save CD 10 and exhaustion when free dashes are exhausted', () => {
    const fatiguedParticipant: ChaseParticipant = {
      id: 'p1',
      name: 'Corredor Agotado',
      role: 'quarry',
      speed: 30,
      conMod: 1,
      freeDashesTotal: 4,
      dashesUsed: 4, // Next dash is 5th -> exceeds 4!
      currentPosition: 120,
      status: 'active',
      exhaustionLevel: 0
    };

    // Forced roll 5 (5 + 1 = 6 < 10) -> FAILS
    const failResult = performDashAction(fatiguedParticipant, 5);
    expect(failResult.requiresSave).toBe(true);
    expect(failResult.saveSuccess).toBe(false);
    expect(failResult.exhaustionGained).toBe(true);
    expect(failResult.updatedParticipant.exhaustionLevel).toBe(1);

    // Now with exhaustion level 2, speed is halved to 15
    const exhaustedParticipant: ChaseParticipant = {
      ...failResult.updatedParticipant,
      exhaustionLevel: 2
    };
    const nextDash = performDashAction(exhaustedParticipant, 15); // Succeeds save (15+1=16 >= 10)
    expect(nextDash.saveSuccess).toBe(true);
    expect(nextDash.distanceGained).toBe(15); // Halved speed
  });

  it('rolls valid chase complications for urban and wilderness environments', () => {
    const urban = rollChaseComplication('urban', 4);
    expect(urban.roll).toBe(4);
    expect(urban.title).toContain('Calzada Mojada');
    expect(urban.dc).toBe(10);

    const wilderness = rollChaseComplication('wilderness', 2);
    expect(wilderness.roll).toBe(2);
    expect(wilderness.title).toContain('Barranco');
  });

  it('evaluates relative distance and chase outcomes (ongoing, captured, escaped)', () => {
    const quarry: ChaseParticipant = {
      id: 'q',
      name: 'Presa',
      role: 'quarry',
      speed: 30,
      conMod: 1,
      freeDashesTotal: 4,
      dashesUsed: 0,
      currentPosition: 100,
      status: 'active',
      exhaustionLevel: 0
    };

    const pursuerClose: ChaseParticipant = {
      id: 'p1',
      name: 'Perseguidor Cercano',
      role: 'pursuer',
      speed: 30,
      conMod: 1,
      freeDashesTotal: 4,
      dashesUsed: 0,
      currentPosition: 60,
      status: 'active',
      exhaustionLevel: 0
    };

    expect(calculateRelativeDistance(quarry, pursuerClose)).toBe(40);
    expect(checkChaseOutcome(quarry, [pursuerClose], 120)).toBe('ongoing');

    // Pursuer catches quarry (position 100 >= 100)
    const pursuerCaught: ChaseParticipant = { ...pursuerClose, currentPosition: 100 };
    expect(checkChaseOutcome(quarry, [pursuerCaught], 120)).toBe('captured');

    // Quarry escapes (position 250 - 60 = 190 >= 120)
    const quarryFar: ChaseParticipant = { ...quarry, currentPosition: 250 };
    expect(checkChaseOutcome(quarryFar, [pursuerClose], 120)).toBe('escaped');
  });

  it('resolves Dragon Lair action on Initiative 20 with saves and halved damage', () => {
    const lairAction: DragonLairAction = {
      title: 'Géiser de Magma Ardiente',
      dc: 16,
      saveAbility: 'dex',
      saveAbilityLabel: 'Destreza',
      damageDice: '6d6',
      damageType: 'Fuego',
      description: 'Chorro de magma ardiente.'
    };

    const targets = [
      { name: 'Guerrero Resistente', saveBonus: 4, forcedRoll: 14 }, // 14 + 4 = 18 >= 16 (SUCCESS)
      { name: 'Mago Vulnerable', saveBonus: 1, forcedRoll: 8 }      // 8 + 1 = 9 < 16 (FAILURE)
    ];

    const results = resolveLairAction(lairAction, targets);
    expect(results.length).toBe(2);

    // Guerrero succeeds -> takes half damage
    expect(results[0].success).toBe(true);
    expect(results[0].message).toContain('Éxito');

    // Mago fails -> takes full damage
    expect(results[1].success).toBe(false);
    expect(results[1].message).toContain('Fallo');
    expect(results[1].damage).toBeGreaterThan(results[0].damage);
  });
});
