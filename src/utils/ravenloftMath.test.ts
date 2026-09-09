import { describe, it, expect } from 'vitest';
import { 
  calculateStressModifier, 
  rollPanicReaction, 
  modifyCharacterStress, 
  applyDarkGiftToCharacter, 
  removeDarkGiftFromCharacter 
} from './ravenloftMath';
import { DARK_GIFTS_DATA } from '../data/darkGiftsData';
import { Character } from '../types/dnd';

const createMockCharacter = (overrides?: Partial<Character>): Character => ({
  id: 'test_char',
  name: 'Valeros Ravenloft',
  species: 'Humano',
  className: 'Guerrero',
  level: 5,
  background: 'Soldado',
  alignment: 'Neutral',
  experience: 6500,
  abilities: { str: 18, dex: 14, con: 16, int: 10, wis: 12, cha: 8 },
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
  coins: { cp: 0, sp: 0, ep: 0, gp: 50, pp: 0 },
  features: [],
  stressScore: 0,
  darkGifts: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides
});

describe('ravenloftMath', () => {
  it('calcula el penalizador a d20 por estrés según Van Richten', () => {
    expect(calculateStressModifier(0)).toBe(0);
    expect(calculateStressModifier(1)).toBe(-1);
    expect(calculateStressModifier(4)).toBe(-4);
    expect(calculateStressModifier(10)).toBe(-10);
    expect(calculateStressModifier(15)).toBe(-10); // Límite máximo 10
  });

  it('resuelve tiradas en la Tabla de Pánico y Miedo correctamente', () => {
    const r1 = rollPanicReaction(2);
    expect(r1.title).toBe('Petrificado por el Terror');
    expect(r1.severity).toBe('critica');

    const r16 = rollPanicReaction(16);
    expect(r16.title).toBe('Adrenalina Desesperada');
    expect(r16.severity).toBe('adrenalina');

    const r20 = rollPanicReaction(20);
    expect(r20.title).toBe('Claridad Sobrenatural');
  });

  it('modifica el estrés de un aventurero manteniéndolo entre 0 y 10', () => {
    const char = createMockCharacter({ stressScore: 1 });
    
    // Sumar +3 de estrés por un susto eldritch
    const { updatedCharacter, newScore, penalty } = modifyCharacterStress(char, 3);
    expect(newScore).toBe(4);
    expect(penalty).toBe(-4);
    expect(updatedCharacter.stressScore).toBe(4);

    // Reducir estrés en -10 (no debe bajar de 0)
    const { newScore: safeScore } = modifyCharacterStress(updatedCharacter, -10);
    expect(safeScore).toBe(0);
  });

  it('aplica y remueve un Don Oscuro preservando la ficha', () => {
    const char = createMockCharacter();
    const symbioteGift = DARK_GIFTS_DATA[0]; // Piel Simbiótica

    const { updatedCharacter, message } = applyDarkGiftToCharacter(char, symbioteGift);
    expect(updatedCharacter.darkGifts?.length).toBe(1);
    expect(updatedCharacter.darkGifts?.[0].giftId).toBe('gift-symbiote');
    expect(message).toContain('¡Pacto sellado!');
    expect(updatedCharacter.features.some(f => f.title.includes('Piel Simbiótica'))).toBe(true);

    // Remover el don oscuro
    const cleansed = removeDarkGiftFromCharacter(updatedCharacter, 'gift-symbiote');
    expect(cleansed.darkGifts?.length).toBe(0);
    expect(cleansed.features.some(f => f.title.includes('Piel Simbiótica'))).toBe(false);
  });
});
