import { describe, it, expect } from 'vitest';
import { 
  checkHasIntuitionDie, 
  rollIntuitionCheck, 
  applyDragonmarkToCharacter, 
  removeDragonmarkFromCharacter,
  addProstheticToCharacter,
  removeProstheticFromCharacter
} from './dragonmarkMath';
import { DRAGONMARKS_DATA, ARCANE_PROSTHETICS_DATA } from '../data/dragonmarksData';
import { Character } from '../types/dnd';

describe('Dragonmark & Arcane Prosthetics Math Utilities', () => {
  const markDetection = DRAGONMARKS_DATA.find(m => m.id === 'mark_of_detection')!;
  const markAberrant = DRAGONMARKS_DATA.find(m => m.id === 'mark_aberrant')!;
  const propulsionArm = ARCANE_PROSTHETICS_DATA.find(p => p.id === 'arcane_propulsion_arm')!;

  const baseCharacter: Character = {
    id: 'hero_1',
    name: 'Valeros',
    playerName: 'Sergio',
    species: 'Humano',
    className: 'Guerrero',
    level: 5,
    background: 'Soldado',
    alignment: 'Neutral Bueno',
    experience: 6500,
    abilities: { str: 18, dex: 14, con: 15, int: 10, wis: 12, cha: 8 },
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
    skills: {
      'Investigación': { proficient: true, expertise: false },
      'Percepción': { proficient: true, expertise: false },
      'Atletismo': { proficient: true, expertise: false }
    },
    languages: ['Común'],
    weaponProficiencies: ['Armas simples', 'Armas marciales'],
    armorProficiencies: ['Todas las armaduras', 'Escudos'],
    spellSlots: [],
    knownSpells: [],
    weapons: [],
    inventory: [],
    coins: { cp: 0, sp: 0, ep: 0, gp: 100, pp: 0 },
    features: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  it('detects intuition die (+1d4) eligibility according to Dragonmark skills', () => {
    const withDetection = applyDragonmarkToCharacter(baseCharacter, markDetection);

    expect(checkHasIntuitionDie(withDetection, 'Investigación')).toBe(true);
    expect(checkHasIntuitionDie(withDetection, 'investigacion')).toBe(true);
    expect(checkHasIntuitionDie(withDetection, 'Perspicacia (Intuición)')).toBe(true);
    expect(checkHasIntuitionDie(withDetection, 'Atletismo')).toBe(false);
    expect(checkHasIntuitionDie(baseCharacter, 'Investigación')).toBe(false);
  });

  it('rolls intuition check adding +1d4 when Dragonmark applies', () => {
    const withDetection = applyDragonmarkToCharacter(baseCharacter, markDetection);

    // Roll on Investigación (eligible for 1d4) with forced dice: d20=12, d4=3, mod=3
    const rollEligible = rollIntuitionCheck(withDetection, 'Investigación', 3, 12, 3);
    expect(rollEligible.d20).toBe(12);
    expect(rollEligible.d4).toBe(3);
    expect(rollEligible.total).toBe(18); // 12 + 3 + 3
    expect(rollEligible.isIntuitionApplied).toBe(true);
    expect(rollEligible.formula).toContain('1d4 Intuición (3)');

    // Roll on Atletismo (not eligible) with forced dice: d20=15, mod=4
    const rollIneligible = rollIntuitionCheck(withDetection, 'Atletismo', 4, 15);
    expect(rollIneligible.d20).toBe(15);
    expect(rollIneligible.d4).toBe(null);
    expect(rollIneligible.total).toBe(19); // 15 + 4
    expect(rollIneligible.isIntuitionApplied).toBe(false);
    expect(rollIneligible.formula).not.toContain('Intuición');
  });

  it('applies and removes Aberrant Dragonmark with +1 CON adjustment', () => {
    expect(baseCharacter.abilities.con).toBe(15);

    const withAberrant = applyDragonmarkToCharacter(baseCharacter, markAberrant);
    expect(withAberrant.abilities.con).toBe(16);
    expect(withAberrant.dragonmark?.markId).toBe('mark_aberrant');
    expect(withAberrant.features.some(f => f.title.includes('Marca del Dragón'))).toBe(true);

    const reverted = removeDragonmarkFromCharacter(withAberrant);
    expect(reverted.abilities.con).toBe(15);
    expect(reverted.dragonmark).toBeUndefined();
    expect(reverted.features.some(f => f.title.includes('Marca del Dragón'))).toBe(false);
  });

  it('equips and un-equips Arcane Prosthetics including integrated weapons', () => {
    const withArm = addProstheticToCharacter(baseCharacter, propulsionArm);
    expect(withArm.prosthetics?.length).toBe(1);
    expect(withArm.prosthetics?.[0].id).toBe('arcane_propulsion_arm');
    expect(withArm.weapons.some(w => w.name === 'Puño de Propulsión Arcana')).toBe(true);

    const withoutArm = removeProstheticFromCharacter(withArm, 'arcane_propulsion_arm');
    expect(withoutArm.prosthetics?.length).toBe(0);
    expect(withoutArm.weapons.some(w => w.name === 'Puño de Propulsión Arcana')).toBe(false);
  });
});
