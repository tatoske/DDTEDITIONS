import { describe, it, expect } from 'vitest';
import {
  validateCharacterJson,
  validateCampaignBackupJson,
  createCampaignBackupPayload
} from './backupMath';
import { Character } from '../types/dnd';

describe('backupMath - Exportación, Importación y Respaldos', () => {
  const mockChar: Character = {
    id: 'c_test_1',
    name: 'Elminster',
    species: 'Humano',
    className: 'Mago',
    level: 10,
    background: 'Sabio',
    alignment: 'Caótico Bueno',
    experience: 64000,
    abilities: { str: 10, dex: 14, con: 16, int: 20, wis: 14, cha: 12 },
    maxHp: 72,
    currentHp: 72,
    tempHp: 0,
    hitDie: '1d6',
    hitDiceTotal: 10,
    hitDiceUsed: 0,
    deathSaves: { successes: 0, failures: 0 },
    armorClass: 15,
    initiativeBonus: 2,
    speed: 9,
    proficiencyBonus: 4,
    savingThrows: { str: false, dex: false, con: false, int: true, wis: true, cha: false },
    skills: {},
    languages: ['Común', 'Dracónico'],
    weaponProficiencies: [],
    armorProficiencies: [],
    spellSlots: [],
    knownSpells: [],
    weapons: [],
    inventory: [],
    coins: { cp: 0, sp: 0, ep: 0, gp: 500, pp: 0 },
    features: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  describe('validateCharacterJson', () => {
    it('valida exitosamente un JSON correcto de personaje', () => {
      const jsonStr = JSON.stringify(mockChar);
      const res = validateCharacterJson(jsonStr);
      expect(res.valid).toBe(true);
      expect(res.character?.name).toBe('Elminster');
      expect(res.character?.level).toBe(10);
    });

    it('rechaza un JSON sin nombre de personaje', () => {
      const invalid = { level: 5, maxHp: 30, abilities: {} };
      const res = validateCharacterJson(JSON.stringify(invalid));
      expect(res.valid).toBe(false);
      expect(res.error).toContain('nombre');
    });

    it('rechaza un JSON con sintaxis rota', () => {
      const res = validateCharacterJson('{"name": "Broken", level:');
      expect(res.valid).toBe(false);
      expect(res.error).toContain('sintaxis');
    });
  });

  describe('validateCampaignBackupJson', () => {
    it('valida exitosamente un respaldo completo de campaña', () => {
      const backup = createCampaignBackupPayload([mockChar], [], [], null);
      const res = validateCampaignBackupJson(JSON.stringify(backup));
      expect(res.valid).toBe(true);
      expect(res.data?.characters.length).toBe(1);
      expect(res.data?.characters[0].name).toBe('Elminster');
    });

    it('rechaza un respaldo sin lista de personajes', () => {
      const badBackup = { app: 'D&D', version: '1.0' };
      const res = validateCampaignBackupJson(JSON.stringify(badBackup));
      expect(res.valid).toBe(false);
      expect(res.error).toContain('characters');
    });
  });
});
