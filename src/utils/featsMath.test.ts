import { describe, it, expect } from 'vitest';
import { applyFeatToCharacter, removeFeatFromCharacter } from './featsMath';
import { FEATS_2024_DATA } from '../data/feats2024Data';
import { Character } from '../types/dnd';

const createMockCharacter = (overrides?: Partial<Character>): Character => ({
  id: 'test_char',
  name: 'Valeros Test',
  species: 'Humano',
  className: 'Guerrero',
  level: 5,
  background: 'Soldado',
  alignment: 'Neutral Bueno',
  experience: 6500,
  abilities: { str: 18, dex: 14, con: 14, int: 10, wis: 12, cha: 8 },
  maxHp: 44,
  currentHp: 44,
  tempHp: 0,
  hitDie: '1d10',
  hitDiceTotal: 5,
  hitDiceUsed: 0,
  deathSaves: { successes: 0, failures: 0 },
  armorClass: 18,
  initiativeBonus: 2,
  speed: 9,
  proficiencyBonus: 3,
  savingThrows: { str: true, dex: false, con: true, int: false, wis: false, cha: false },
  skills: {},
  languages: ['Común'],
  weaponProficiencies: ['Armas simples', 'Armas marciales'],
  armorProficiencies: ['Todas'],
  spellSlots: [],
  knownSpells: [],
  weapons: [],
  inventory: [],
  coins: { cp: 0, sp: 0, ep: 0, gp: 10, pp: 0 },
  features: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides
});

describe('featsMath', () => {
  it('aplica un aumento de +1 en característica con una dote general', () => {
    const char = createMockCharacter({ abilities: { str: 18, dex: 14, con: 14, int: 10, wis: 12, cha: 8 } });
    const gwmFeat = FEATS_2024_DATA.find(f => f.id === 'feat-great-weapon-master')!;

    const { updatedCharacter, message } = applyFeatToCharacter(char, gwmFeat, 'str');

    expect(updatedCharacter.abilities.str).toBe(19);
    expect(message).toContain('+1 a STR: 18 -> 19');
    expect(updatedCharacter.feats?.length).toBe(1);
    expect(updatedCharacter.feats?.[0].featId).toBe('feat-great-weapon-master');
  });

  it('respeta el límite de 20 para dotes generales', () => {
    const char = createMockCharacter({ abilities: { str: 20, dex: 14, con: 14, int: 10, wis: 12, cha: 8 } });
    const gwmFeat = FEATS_2024_DATA.find(f => f.id === 'feat-great-weapon-master')!;

    const { updatedCharacter } = applyFeatToCharacter(char, gwmFeat, 'str');

    expect(updatedCharacter.abilities.str).toBe(20); // No supera 20
  });

  it('permite que una Bendición Épica supere el límite de 20 hasta 30', () => {
    const char = createMockCharacter({ 
      level: 20,
      abilities: { str: 20, dex: 14, con: 14, int: 10, wis: 12, cha: 8 } 
    });
    const epicBoon = FEATS_2024_DATA.find(f => f.id === 'feat-boon-fate')!;

    const { updatedCharacter } = applyFeatToCharacter(char, epicBoon, 'str');

    expect(updatedCharacter.abilities.str).toBe(21); // Superó 20
  });

  it('calcula los Puntos de Golpe correctamente para la dote Curtido (Tough, +2 PG x nivel)', () => {
    const char = createMockCharacter({ level: 5, maxHp: 44, currentHp: 44 });
    const toughFeat = FEATS_2024_DATA.find(f => f.id === 'feat-tough')!;

    const { updatedCharacter } = applyFeatToCharacter(char, toughFeat);

    // Nivel 5 * 2 = +10 PG
    expect(updatedCharacter.maxHp).toBe(54);
    expect(updatedCharacter.currentHp).toBe(54);
  });

  it('revierte los atributos y PG al eliminar una dote', () => {
    const char = createMockCharacter({ level: 5, maxHp: 44, currentHp: 44 });
    const toughFeat = FEATS_2024_DATA.find(f => f.id === 'feat-tough')!;

    const { updatedCharacter: withTough } = applyFeatToCharacter(char, toughFeat);
    expect(withTough.maxHp).toBe(54);

    const reverted = removeFeatFromCharacter(withTough, 'feat-tough');
    expect(reverted.maxHp).toBe(44);
    expect(reverted.feats?.length).toBe(0);
  });
});
