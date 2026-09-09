import { describe, it, expect } from 'vitest';
import { computeGrimoireSummary, generateGrimoirePrintableHtml } from './grimoireExportMath';
import { Character, CharacterAdventureRecord } from '../types/dnd';

describe('Grimoire PDF & Print Formatter', () => {
  const dummyChar: Character = {
    id: 'char_test',
    name: 'Valeros Bastión',
    className: 'Guerrero (Fighter)',
    level: 5,
    goldDragons: 750,
    coins: { cp: 0, sp: 0, ep: 0, gp: 250, pp: 0 },
    stats: { str: 16, dex: 14, con: 16, int: 10, wis: 12, cha: 10 },
    hp: 44,
    maxHp: 44,
    armorClass: 18,
    speed: 30,
    proficiencyBonus: 3,
    inventory: []
  } as any;

  const dummyChronicles: CharacterAdventureRecord[] = [
    {
      id: 'chr_1',
      questId: 'q_1',
      questTitle: 'La Cripta del Dragón Carmesí',
      masterName: 'DM Sergio',
      sessionDate: '2026-09-08',
      rankClass: 'D',
      outcome: 'victory',
      goldEarned: 300,
      chronicleNotes: 'Gran valentía derrotando a los kobolds.',
      recordedAt: new Date().toISOString()
    },
    {
      id: 'chr_2',
      questId: 'q_2',
      questTitle: 'Emboscada en el Pantano',
      masterName: 'DM Andrea',
      sessionDate: '2026-09-07',
      rankClass: 'D',
      outcome: 'defeat',
      goldEarned: 50,
      chronicleNotes: 'Retirada táctica tras sufrir una trampa de gas.',
      recordedAt: new Date().toISOString()
    }
  ];

  it('computes grimoire summary correctly', () => {
    const summary = computeGrimoireSummary(dummyChar, dummyChronicles);
    expect(summary.characterName).toBe('Valeros Bastión');
    expect(summary.level).toBe(5);
    expect(summary.rankClass).toBe('Clase D');
    expect(summary.goldDragons).toBe(1000); // 750 + 250
    expect(summary.totalMissions).toBe(2);
    expect(summary.victories).toBe(1);
    expect(summary.defeats).toBe(1);
    expect(summary.winRate).toBe(50);
  });

  it('generates HTML with parchment borders, heraldry and mission rows', () => {
    const html = generateGrimoirePrintableHtml(dummyChar, dummyChronicles);
    expect(html).toContain('Valeros Bastión');
    expect(html).toContain('La Cripta del Dragón Carmesí');
    expect(html).toContain('1.000 DO');
    expect(html).toContain('50%');
    expect(html).toContain('Victoria 🏆');
    expect(html).toContain('Derrota 💀');
    expect(html).toContain('@media print');
  });
});
