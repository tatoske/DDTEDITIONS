import { describe, it, expect } from 'vitest';
import {
  grantItemToCharacter,
  grantCurrencyToCharacter,
  grantExperienceToCharacter,
  processDmFullGrant,
  distributeLootAmongCharacters
} from './dmGrantMath';
import { Character } from '../types/dnd';

const testCharacter: Character = {
  id: 'char_test_1',
  name: 'Tristán el Paladín',
  playerName: 'Sergio',
  species: 'Humano',
  className: 'Paladín',
  level: 3,
  background: 'Noble',
  alignment: 'Legal Bueno',
  experience: 1000,
  abilities: { str: 16, dex: 10, con: 14, int: 10, wis: 12, cha: 16 },
  maxHp: 28,
  currentHp: 28,
  tempHp: 0,
  hitDie: '1d10',
  hitDiceTotal: 3,
  hitDiceUsed: 0,
  deathSaves: { successes: 0, failures: 0 },
  armorClass: 18,
  initiativeBonus: 0,
  speed: 9,
  proficiencyBonus: 2,
  savingThrows: { str: false, dex: false, con: false, int: false, wis: true, cha: true },
  skills: { 'Persuasión': { proficient: true, expertise: false } },
  languages: ['Común', 'Celestial'],
  weaponProficiencies: ['Armas marciales'],
  armorProficiencies: ['Todas las armaduras', 'Escudos'],
  spellSlots: [{ level: 1, total: 3, used: 0 }],
  knownSpells: [],
  weapons: [],
  inventory: [{ id: 'i1', name: 'Raciones', quantity: 5 }],
  coins: { cp: 10, sp: 20, ep: 0, gp: 50, pp: 0 },
  goldDragons: 25,
  features: [],
  createdAt: '2026-01-01',
  updatedAt: '2026-01-01'
};

describe('dmGrantMath - Concesión de Recompensas de DM a Aventureros', () => {
  it('grants an item to character inventory properly', () => {
    const updated = grantItemToCharacter(testCharacter, {
      itemName: 'Espada de Llamas',
      itemCategory: 'weapon',
      itemRarity: 'Raro',
      itemQuantity: 1,
      itemDescription: 'Inflige 2d6 de fuego adicional',
      damageDice: '1d8 + 4',
      attackBonus: 7
    });

    expect(updated.weapons.length).toBe(1);
    expect(updated.weapons[0].name).toBe('Espada de Llamas (Raro)');
    expect(updated.weapons[0].damageDice).toBe('1d8 + 4');
    expect(updated.inventory.some(i => i.name === 'Espada de Llamas (Raro)')).toBe(true);
  });

  it('increments quantity when adding an existing inventory item', () => {
    const updated = grantItemToCharacter(testCharacter, {
      itemName: 'Raciones',
      itemCategory: 'item',
      itemQuantity: 10
    });

    const rations = updated.inventory.find(i => i.name.toLowerCase() === 'raciones');
    expect(rations?.quantity).toBe(15);
  });

  it('grants standard coins and Gold Dragons (DO) with chronicle logging', () => {
    const updated = grantCurrencyToCharacter(testCharacter, {
      gp: 150,
      goldDragons: 75
    }, 'Botín de la Guarida del Dragón Rojo');

    expect(updated.coins.gp).toBe(200); // 50 + 150
    expect(updated.goldDragons).toBe(100); // 25 + 75
    expect(updated.adventureChronicles?.length).toBe(1);
    expect(updated.adventureChronicles?.[0].goldEarned).toBe(75);
  });

  it('grants experience and detects level up threshold', () => {
    // Nivel 3 tiene 1000 XP. Nivel 4 requiere 2700 XP. Si sumamos 2000 XP -> total 3000 XP (Nivel 4).
    const result = grantExperienceToCharacter(testCharacter, 2000);

    expect(result.leveledUp).toBe(true);
    expect(result.newLevel).toBe(4);
    expect(result.updatedCharacter.experience).toBe(3000);
  });

  it('processes full composite grant with descriptive summary message', () => {
    const { updatedCharacter, summaryMessage } = processDmFullGrant(testCharacter, {
      itemName: 'Poción de Invulnerabilidad',
      itemQuantity: 2,
      gp: 300,
      goldDragons: 50,
      experience: 500
    });

    expect(updatedCharacter.inventory.some(i => i.name.includes('Poción de Invulnerabilidad'))).toBe(true);
    expect(updatedCharacter.coins.gp).toBe(350);
    expect(updatedCharacter.goldDragons).toBe(75);
    expect(summaryMessage).toContain('Poción de Invulnerabilidad');
    expect(summaryMessage).toContain('300 PO');
    expect(summaryMessage).toContain('50 DO');
  });

  it('distributes loot and Gold Dragons evenly across multiple characters', () => {
    const char2: Character = {
      ...testCharacter,
      id: 'char_test_2',
      name: 'Eldrin el Mago',
      coins: { cp: 0, sp: 0, ep: 0, gp: 10, pp: 0 },
      goldDragons: 10
    };

    // 105 PO y 50 DO entre 2 personajes -> 53 PO para el primero, 52 PO para el segundo; 25 DO cada uno
    const distributed = distributeLootAmongCharacters([testCharacter, char2], {
      totalGp: 105,
      totalGoldDragons: 50
    });

    expect(distributed[0].coins.gp).toBe(50 + 53);
    expect(distributed[1].coins.gp).toBe(10 + 52);
    expect(distributed[0].goldDragons).toBe(25 + 25);
    expect(distributed[1].goldDragons).toBe(10 + 25);
  });
});
