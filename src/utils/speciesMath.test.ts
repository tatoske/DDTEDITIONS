import { describe, it, expect } from 'vitest';
import {
  validateAsiAllocation,
  applySpeciesToCharacter
} from './speciesMath';
import { Character, ModernSpeciesDef } from '../types/dnd';
import { MULTIVERSE_SPECIES_DATA } from '../data/multiverseSpeciesData';

const mockCharacter: Character = {
  id: 'char_test',
  name: 'Valeros',
  species: 'Humano',
  className: 'Guerrero',
  level: 3,
  background: 'Soldado',
  alignment: 'Neutral Bueno',
  experience: 900,
  abilities: {
    str: 16,
    dex: 12,
    con: 14,
    int: 10,
    wis: 12,
    cha: 11
  },
  maxHp: 28,
  currentHp: 28,
  tempHp: 0,
  hitDie: '1d10',
  hitDiceTotal: 3,
  hitDiceUsed: 0,
  deathSaves: { successes: 0, failures: 0 },
  armorClass: 15,
  initiativeBonus: 1,
  speed: 9,
  proficiencyBonus: 2,
  savingThrows: { str: true, dex: false, con: true, int: false, wis: false, cha: false },
  skills: {
    'Atletismo': { proficient: true, expertise: false }
  },
  languages: ['Común'],
  weaponProficiencies: ['Armas simples', 'Armas marciales'],
  armorProficiencies: ['Todas las armaduras'],
  spellSlots: [],
  knownSpells: [],
  weapons: [],
  inventory: [],
  coins: { cp: 0, sp: 0, ep: 0, gp: 50, pp: 0 },
  features: [
    { title: 'Versatilidad Ingeniosa', source: 'Humano', description: 'Ganas inspiración heroica...' }
  ],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

describe('speciesMath - Sistema de Linajes y Especies Modernizadas', () => {
  it('valida asignaciones de características (ASI) según reglas 2024', () => {
    // Válido: +2 a FUE y +1 a CON
    expect(validateAsiAllocation({ mode: 'two_one', plusTwo: 'str', plusOneA: 'con' }).isValid).toBe(true);

    // Inválido: +2 a FUE y +1 a FUE (misma característica)
    expect(validateAsiAllocation({ mode: 'two_one', plusTwo: 'str', plusOneA: 'str' }).isValid).toBe(false);

    // Válido: +1 a FUE, DES y SAB
    expect(validateAsiAllocation({ mode: 'three_ones', plusOneA: 'str', plusOneB: 'dex', plusOneC: 'wis' }).isValid).toBe(true);

    // Inválido: +1 a FUE, DES y FUE (duplicada)
    expect(validateAsiAllocation({ mode: 'three_ones', plusOneA: 'str', plusOneB: 'dex', plusOneC: 'str' }).isValid).toBe(false);
  });

  it('aplica linaje Centauro actualizando velocidad a 10.5 m e inyectando rasgos', () => {
    const centaurDef = MULTIVERSE_SPECIES_DATA.find(s => s.id === 'centaur')!;
    const updated = applySpeciesToCharacter(mockCharacter, centaurDef);

    expect(updated.species).toBe('Centauro');
    expect(updated.speed).toBe(10.5);
    // Debe haber eliminado rasgos de Humano y añadido rasgos de Centauro
    expect(updated.features.some(f => f.title === 'Versatilidad Ingeniosa')).toBe(false);
    expect(updated.features.some(f => f.title === 'Carga Devastadora')).toBe(true);
    expect(updated.languages).toContain('Silvano');
  });

  it('aplica linaje Tortuga (Tortle) otorgando Armadura Natural de CA 17', () => {
    const tortleDef = MULTIVERSE_SPECIES_DATA.find(s => s.id === 'tortle')!;
    const updated = applySpeciesToCharacter(mockCharacter, tortleDef);

    expect(updated.species).toBe('Tortuga (Tortle)');
    expect(updated.armorClass).toBe(17);
    expect(updated.features.some(f => f.title === 'Caparazón Blindado')).toBe(true);
  });

  it('aplica linaje Aasimar con asignación ASI (+2 Carisma, +1 Constitución)', () => {
    const aasimarDef = MULTIVERSE_SPECIES_DATA.find(s => s.id === 'aasimar')!;
    const updated = applySpeciesToCharacter(mockCharacter, aasimarDef, {
      mode: 'two_one',
      plusTwo: 'cha',
      plusOneA: 'con'
    });

    expect(updated.species).toBe('Aasimar');
    // Cha pasa de 11 a 13 (+2)
    expect(updated.abilities.cha).toBe(13);
    // Con pasa de 14 a 15 (+1)
    expect(updated.abilities.con).toBe(15);
    expect(updated.languages).toContain('Celestial');
    expect(updated.features.some(f => f.title === 'Revelación Celestial')).toBe(true);
  });
});
