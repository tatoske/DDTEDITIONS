import { describe, it, expect } from 'vitest';
import { generateCombatTactics, CombatantInfo } from './combatAssistantMath';

describe('Combat Live Assistant Tactics (Encounter Tracker)', () => {
  const dummyCombatants: CombatantInfo[] = [
    {
      instanceId: 'p1',
      name: 'Valeros Guerrero',
      isMonster: false,
      level: 5,
      maxHp: 44,
      currentHp: 40,
      ac: 18,
      initiative: 19,
      conditions: []
    },
    {
      instanceId: 'p2',
      name: 'Elaria Maga',
      isMonster: false,
      level: 5,
      maxHp: 28,
      currentHp: 12, // Malherida
      ac: 12,
      initiative: 14,
      conditions: []
    },
    {
      instanceId: 'm1',
      name: 'Dragón Rojo Joven #1',
      isMonster: true,
      cr: '10',
      maxHp: 178,
      currentHp: 178,
      ac: 18,
      initiative: 16,
      conditions: []
    }
  ];

  it('generates Mimic advice with recharge check for dragon monster turn', () => {
    const dragonCombatant = dummyCombatants[2];
    const tactics = generateCombatTactics(dragonCombatant, dummyCombatants, 1);

    expect(tactics.speaker).toBe('mimic');
    expect(tactics.speakerName).toContain('Mímico');
    expect(tactics.rechargeAction).toBeDefined();
    expect(tactics.rechargeAction?.dice).toBe('1d6');
    expect(tactics.priorityTarget).toBe('Elaria Maga'); // Enemigo con menos vida
    expect(tactics.tacticalTips.length).toBeGreaterThan(1);
  });

  it('generates Elara advice with weapon mastery recommendation for player turn', () => {
    const playerCombatant = dummyCombatants[0];
    const tactics = generateCombatTactics(playerCombatant, dummyCombatants, 1);

    expect(tactics.speaker).toBe('elara');
    expect(tactics.speakerName).toContain('Elara');
    expect(tactics.priorityTarget).toContain('Dragón');
    expect(tactics.tacticalTips.some(t => t.includes('Maestría con Armas'))).toBe(true);
  });
});
