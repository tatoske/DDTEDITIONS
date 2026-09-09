import { describe, it, expect } from 'vitest';
import {
  calculateProficiencyBonus,
  parseHitDieSize,
  getHitDieAverage,
  calculateHpIncrease,
  getSpellSlotsForClassAndLevel,
  getLevelUpMilestones,
  applyLevelUpToCharacter
} from './levelUpMath';
import { Character } from '../types/dnd';

describe('levelUpMath - Asistente de Subida de Nivel 2024', () => {
  describe('calculateProficiencyBonus', () => {
    it('debe escalar correctamente de nivel 1 a 20', () => {
      expect(calculateProficiencyBonus(1)).toBe(2);
      expect(calculateProficiencyBonus(4)).toBe(2);
      expect(calculateProficiencyBonus(5)).toBe(3);
      expect(calculateProficiencyBonus(8)).toBe(3);
      expect(calculateProficiencyBonus(9)).toBe(4);
      expect(calculateProficiencyBonus(12)).toBe(4);
      expect(calculateProficiencyBonus(13)).toBe(5);
      expect(calculateProficiencyBonus(16)).toBe(5);
      expect(calculateProficiencyBonus(17)).toBe(6);
      expect(calculateProficiencyBonus(20)).toBe(6);
    });
  });

  describe('parseHitDieSize y getHitDieAverage', () => {
    it('extrae el tamaño correcto del dado de golpe', () => {
      expect(parseHitDieSize('1d10')).toBe(10);
      expect(parseHitDieSize('d8')).toBe(8);
      expect(parseHitDieSize('1d6')).toBe(6);
      expect(parseHitDieSize('1d12')).toBe(12);
    });

    it('devuelve los promedios oficiales de D&D', () => {
      expect(getHitDieAverage(6)).toBe(4);
      expect(getHitDieAverage(8)).toBe(5);
      expect(getHitDieAverage(10)).toBe(6);
      expect(getHitDieAverage(12)).toBe(7);
    });
  });

  describe('calculateHpIncrease', () => {
    it('calcula incremento con promedio fijo y bono de constitución', () => {
      // d10 -> promedio 6. Con 14 (+2) = 8
      const res = calculateHpIncrease('1d10', 14, 'average');
      expect(res.dieSize).toBe(10);
      expect(res.conMod).toBe(2);
      expect(res.diceRoll).toBe(6);
      expect(res.hpIncrease).toBe(8);
    });

    it('calcula incremento con tirada de dado fija', () => {
      // d8 tirado 7, con CON 10 (+0) = 7
      const res = calculateHpIncrease('1d8', 10, 'roll', 7);
      expect(res.diceRoll).toBe(7);
      expect(res.hpIncrease).toBe(7);
    });

    it('garantiza un mínimo de 1 PG incluso con constitución muy negativa', () => {
      // d6 tirado 1 con CON 6 (-2) -> 1 - 2 = -1, mínimo 1
      const res = calculateHpIncrease('1d6', 6, 'roll', 1);
      expect(res.hpIncrease).toBe(1);
    });
  });

  describe('getSpellSlotsForClassAndLevel', () => {
    it('calcula slots de mago (full caster) a nivel 3', () => {
      const slots = getSpellSlotsForClassAndLevel('Mago', 3);
      expect(slots.length).toBe(2);
      expect(slots[0].level).toBe(1);
      expect(slots[0].total).toBe(4);
      expect(slots[1].level).toBe(2);
      expect(slots[1].total).toBe(2);
    });

    it('calcula magia de pacto para brujo a nivel 5', () => {
      const slots = getSpellSlotsForClassAndLevel('Brujo', 5);
      expect(slots.length).toBe(1);
      expect(slots[0].level).toBe(3); // Espacio de nivel 3
      expect(slots[0].total).toBe(2); // 2 espacios
    });

    it('devuelve vacío para clases no lanzadoras como Guerrero', () => {
      const slots = getSpellSlotsForClassAndLevel('Guerrero', 5);
      expect(slots).toEqual([]);
    });
  });

  describe('getLevelUpMilestones', () => {
    it('detecta subclase a nivel 3', () => {
      const m = getLevelUpMilestones('Pícaro', 3);
      expect(m.some(x => x.title.includes('Subclase'))).toBe(true);
    });

    it('detecta mejora de características a nivel 4', () => {
      const m = getLevelUpMilestones('Clérigo', 4);
      expect(m.some(x => x.title.includes('ASI'))).toBe(true);
    });

    it('detecta Ataque Adicional para Guerrero a nivel 5', () => {
      const m = getLevelUpMilestones('Guerrero', 5);
      expect(m.some(x => x.title.includes('Ataque Adicional'))).toBe(true);
    });
  });

  describe('applyLevelUpToCharacter', () => {
    it('actualiza limpiamente nivel, PG, dados de golpe y competencia', () => {
      const mockChar: Character = {
        id: 'c1',
        name: 'Sir Galahad',
        species: 'Humano',
        className: 'Guerrero',
        level: 4,
        background: 'Soldado',
        alignment: 'Legal Bueno',
        experience: 6500,
        abilities: { str: 16, dex: 12, con: 14, int: 10, wis: 12, cha: 10 },
        maxHp: 36,
        currentHp: 36,
        tempHp: 0,
        hitDie: '1d10',
        hitDiceTotal: 4,
        hitDiceUsed: 0,
        deathSaves: { successes: 0, failures: 0 },
        armorClass: 18,
        initiativeBonus: 1,
        speed: 9,
        proficiencyBonus: 2,
        savingThrows: { str: true, con: true, dex: false, int: false, wis: false, cha: false },
        skills: {},
        languages: ['Común'],
        weaponProficiencies: [],
        armorProficiencies: [],
        spellSlots: [],
        knownSpells: [],
        weapons: [],
        inventory: [],
        coins: { cp: 0, sp: 0, ep: 0, gp: 100, pp: 0 },
        features: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const updated = applyLevelUpToCharacter(mockChar, 8);
      expect(updated.level).toBe(5);
      expect(updated.maxHp).toBe(44); // 36 + 8
      expect(updated.currentHp).toBe(44);
      expect(updated.hitDiceTotal).toBe(5);
      expect(updated.proficiencyBonus).toBe(3); // Escala a +3 a nivel 5
    });
  });
});
