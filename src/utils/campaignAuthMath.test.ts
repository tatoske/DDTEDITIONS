import { describe, it, expect } from 'vitest';
import {
  SUPER_MASTER_EMAIL,
  SUPER_MASTER_PASS,
  isSuperMasterEmail,
  getRankClassFromLevel,
  getRankClassTitle,
  validateCharacterForQuest,
  transferGoldDragons,
  escalateFailedQuest,
  assignUserRole,
  INITIAL_USERS,
  INITIAL_CAMPAIGN_QUESTS,
  authenticateUserCredentials,
  DEFAULT_USER_PASS
} from './campaignAuthMath';
import { UserAccount, CampaignQuest } from '../types/dnd';

describe('campaignAuthMath - Autenticación, Super Master, Clases y Campañas', () => {
  it('identifies Super Master email correctly regardless of case/whitespace', () => {
    expect(isSuperMasterEmail('TatoSenpaiSape@gmail.com')).toBe(true);
    expect(isSuperMasterEmail('  tatosenpaisape@gmail.com ')).toBe(true);
    expect(isSuperMasterEmail('otro_usuario@gmail.com')).toBe(false);
  });

  it('maps level 1-20 to correct Adventure Rank Classes (F to SS+)', () => {
    expect(getRankClassFromLevel(1)).toBe('F');
    expect(getRankClassFromLevel(2)).toBe('F');
    expect(getRankClassFromLevel(3)).toBe('E');
    expect(getRankClassFromLevel(4)).toBe('E');
    expect(getRankClassFromLevel(5)).toBe('D');
    expect(getRankClassFromLevel(6)).toBe('D');
    expect(getRankClassFromLevel(7)).toBe('C');
    expect(getRankClassFromLevel(8)).toBe('C');
    expect(getRankClassFromLevel(9)).toBe('B');
    expect(getRankClassFromLevel(10)).toBe('B');
    expect(getRankClassFromLevel(11)).toBe('A');
    expect(getRankClassFromLevel(14)).toBe('A');
    expect(getRankClassFromLevel(15)).toBe('S');
    expect(getRankClassFromLevel(16)).toBe('S');
    expect(getRankClassFromLevel(17)).toBe('SS');
    expect(getRankClassFromLevel(19)).toBe('SS');
    expect(getRankClassFromLevel(20)).toBe('SS+');
  });

  it('validates character eligibility for quest levels and classes', () => {
    // Personaje Nivel 5 califica para misión Nivel 4 a 6
    const ok = validateCharacterForQuest(5, 4, 6, 'D');
    expect(ok.eligible).toBe(true);
    expect(ok.reason).toBeUndefined();

    // Personaje Nivel 2 NO califica para misión Nivel 4 a 6 (nivel insuficiente)
    const tooLow = validateCharacterForQuest(2, 4, 6, 'D');
    expect(tooLow.eligible).toBe(false);
    expect(tooLow.reason).toContain('Nivel insuficiente');

    // Personaje Nivel 12 NO califica para misión Nivel 4 a 6 (nivel excesivo)
    const tooHigh = validateCharacterForQuest(12, 4, 6, 'D');
    expect(tooHigh.eligible).toBe(false);
    expect(tooHigh.reason).toContain('Nivel excesivo');
  });

  it('transfers Gold Dragons from Super Master to Master without depleting imperial treasury', () => {
    const superMaster = { ...INITIAL_USERS[0] };
    const master = { ...INITIAL_USERS[1], goldDragons: 1000 };

    const { updatedFrom, updatedTo, transfer } = transferGoldDragons(superMaster, master, 1500, 'Presupuesto Campaña');

    expect(updatedFrom.goldDragons).toBe(999999); // El Super Master mantiene su tesoro ilimitado
    expect(updatedTo.goldDragons).toBe(2500);
    expect(transfer.amount).toBe(1500);
    expect(transfer.fromUserId).toBe(superMaster.id);
    expect(transfer.toUserId).toBe(master.id);
  });

  it('prevents normal users from transferring more Gold Dragons than they possess', () => {
    const poorMaster: UserAccount = {
      id: 'm1',
      email: 'm1@dnd.com',
      username: 'Pobre Master',
      role: 'dm',
      goldDragons: 200,
      permissions: { bastionUnlocked: false, sidekicksUnlocked: false },
      createdAt: ''
    };
    const player: UserAccount = {
      id: 'p1',
      email: 'p1@dnd.com',
      username: 'Jugador',
      role: 'player',
      goldDragons: 50,
      permissions: { bastionUnlocked: false, sidekicksUnlocked: false },
      createdAt: ''
    };

    expect(() => transferGoldDragons(poorMaster, player, 500)).toThrow(/Fondos insuficientes/);
  });

  it('escalates a failed quest properly to a higher rank class and rewards', () => {
    const failedQuest: CampaignQuest = {
      ...INITIAL_CAMPAIGN_QUESTS[2],
      status: 'failed',
      rankClass: 'C',
      minLevel: 7,
      maxLevel: 9,
      goldReward: 1200
    };

    const escalated = escalateFailedQuest(failedQuest, 'A', 800, 11, 14, 'El Super Master envió refuerzos de élite');

    expect(escalated.status).toBe('open');
    expect(escalated.rankClass).toBe('A');
    expect(escalated.minLevel).toBe(11);
    expect(escalated.maxLevel).toBe(14);
    expect(escalated.goldReward).toBe(2000);
    expect(escalated.failureEscalated).toBe(true);
    expect(escalated.escalationCount).toBe(1);
    expect(escalated.applicants.length).toBe(0);
  });

  it('allows Super Master to assign new roles to users and protects imperial account', () => {
    const superMaster = INITIAL_USERS[0];
    const player = { ...INITIAL_USERS[2] }; // role: player, gold: 350
    const master = { ...INITIAL_USERS[1] }; // role: dm

    // Promover jugador a Master
    const promoted = assignUserRole(player, 'dm', superMaster);
    expect(promoted.role).toBe('dm');
    expect(promoted.goldDragons).toBe(1500); // Bonificación a DM

    // Degradar Master a Jugador
    const demoted = assignUserRole(master, 'player', superMaster);
    expect(demoted.role).toBe('player');

    // Error si un usuario no Super Master intenta cambiar roles
    expect(() => assignUserRole(player, 'dm', master)).toThrow(/Solo el Super Master/);

    // Error si intenta modificar la cuenta oficial del Super Master
    expect(() => assignUserRole(superMaster, 'player', superMaster)).toThrow(/única e inmutable/);

    // Error si intenta asignar el rol de supermaster a otro
    expect(() => assignUserRole(player, 'supermaster', superMaster)).toThrow(/reservado exclusivamente/);
  });

  it('authenticates Super Master only with exact master password', () => {
    // Correct credentials
    const valid = authenticateUserCredentials(INITIAL_USERS, SUPER_MASTER_EMAIL, SUPER_MASTER_PASS);
    expect(valid.success).toBe(true);
    expect(valid.user?.role).toBe('supermaster');

    // Wrong password
    const invalid = authenticateUserCredentials(INITIAL_USERS, SUPER_MASTER_EMAIL, 'wrongpass123');
    expect(invalid.success).toBe(false);
    expect(invalid.error).toContain('Contraseña incorrecta');
  });

  it('authenticates DM and player with password and blocks wrong passwords', () => {
    // Correct credentials for DM
    const dmValid = authenticateUserCredentials(INITIAL_USERS, 'master_elminster@dnd.com', DEFAULT_USER_PASS);
    expect(dmValid.success).toBe(true);
    expect(dmValid.user?.username).toContain('Elminster');

    // Wrong password for DM
    const dmInvalid = authenticateUserCredentials(INITIAL_USERS, 'master_elminster@dnd.com', 'badpassword');
    expect(dmInvalid.success).toBe(false);
    expect(dmInvalid.error).toContain('Contraseña incorrecta');

    // Non-existent user
    const noUser = authenticateUserCredentials(INITIAL_USERS, 'noexiste@dnd.com', 'anypass');
    expect(noUser.success).toBe(false);
    expect(noUser.error).toContain('No se encontró ninguna cuenta');
  });
});

