import { describe, it, expect } from 'vitest';
import { 
  getReputationTier, 
  modifyPatronReputation, 
  modifyPatronFavors,
  rollPatronMission, 
  rollPatronIntrigue,
  resolveMissionOutcome,
  distributeStipend,
  MIN_REPUTATION,
  MAX_REPUTATION
} from './patronMath';
import { GROUP_PATRONS_DATA } from '../data/groupPatronsData';
import { ActivePatronCampaignState, Character } from '../types/dnd';

describe('Patron Math & Logic Utilities', () => {
  const samplePatron = GROUP_PATRONS_DATA[0]; // Colegio de Altos Estudios Arcanos

  it('calculates narrative reputation tiers and respects boundary values', () => {
    expect(getReputationTier(10).label).toBe('Héroes Consagrados');
    expect(getReputationTier(8).label).toBe('Héroes Consagrados');
    expect(getReputationTier(5).label).toBe('Agentes de Confianza');
    expect(getReputationTier(2).label).toBe('Operativos en Buen Término');
    expect(getReputationTier(0).label).toBe('Nuevos Reclutas / A Prueba');
    expect(getReputationTier(-2).label).toBe('En Observación y Sospecha');
    expect(getReputationTier(-5).label).toBe('Al Borde de la Purga');
  });

  it('clamps reputation changes between MIN_REPUTATION (-5) and MAX_REPUTATION (10)', () => {
    expect(modifyPatronReputation(9, 3)).toBe(MAX_REPUTATION);
    expect(modifyPatronReputation(-4, -5)).toBe(MIN_REPUTATION);
    expect(modifyPatronReputation(2, 3)).toBe(5);
  });

  it('rolls a valid mission and intrigue for a canonical patron', () => {
    const mission = rollPatronMission(samplePatron, 1);
    expect(mission.id).toMatch(/^pm_/);
    expect(mission.patronId).toBe(samplePatron.id);
    expect(mission.title).toBe('El Grimorio de las Siete Lunas');
    expect(mission.rewardGp).toBe(250);
    expect(mission.status).toBe('pending');

    const intrigue = rollPatronIntrigue(samplePatron, 2);
    expect(intrigue.title).toBe('Artefacto Maldito Oculto');
    expect(intrigue.complication).toContain('aura de confusión');
  });

  it('resolves a mission outcome correctly on completion and failure', () => {
    const mission = rollPatronMission(samplePatron, 1);
    const initialState: ActivePatronCampaignState = {
      patronId: samplePatron.id,
      reputationScore: 2,
      favorsOwed: 0,
      totalGoldEarnedFromPatron: 100,
      missions: [mission]
    };

    // Completing the mission
    const completedResult = resolveMissionOutcome(initialState, mission.id, 'completed');
    expect(completedResult.goldAwarded).toBe(250);
    expect(completedResult.favorsAwarded).toBe(1);
    expect(completedResult.reputationDelta).toBe(1);
    expect(completedResult.updatedState.reputationScore).toBe(3);
    expect(completedResult.updatedState.favorsOwed).toBe(1);
    expect(completedResult.updatedState.totalGoldEarnedFromPatron).toBe(350);
    expect(completedResult.updatedState.missions[0].status).toBe('completed');

    // Trying to resolve again should have no effect
    const secondResolution = resolveMissionOutcome(completedResult.updatedState, mission.id, 'failed');
    expect(secondResolution.goldAwarded).toBe(0);

    // Failing a mission
    const mission2 = rollPatronMission(samplePatron, 2);
    const stateBeforeFail: ActivePatronCampaignState = {
      ...completedResult.updatedState,
      missions: [mission2]
    };

    const failResult = resolveMissionOutcome(stateBeforeFail, mission2.id, 'failed');
    expect(failResult.goldAwarded).toBe(0);
    expect(failResult.favorsAwarded).toBe(-1);
    expect(failResult.reputationDelta).toBe(-1);
    expect(failResult.updatedState.reputationScore).toBe(2);
    expect(failResult.updatedState.favorsOwed).toBe(0);
    expect(failResult.updatedState.missions[0].status).toBe('failed');
  });

  it('distributes daily stipend among active adventurers accurately', () => {
    const mockParty = [
      {
        id: 'c1',
        name: 'Aventurero 1',
        coins: { cp: 0, sp: 0, ep: 0, gp: 50, pp: 0 }
      },
      {
        id: 'c2',
        name: 'Aventurero 2',
        coins: { cp: 0, sp: 0, ep: 0, gp: 10, pp: 0 }
      }
    ] as Character[];

    const result = distributeStipend(mockParty, 2);
    expect(result.totalDistributedGp).toBe(4);
    expect(result.updatedCharacters[0].coins.gp).toBe(52);
    expect(result.updatedCharacters[1].coins.gp).toBe(12);
  });
});
