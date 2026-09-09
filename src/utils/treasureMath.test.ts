import { describe, it, expect } from 'vitest';
import {
  convertCoinsToGold,
  generateIndividualTreasure,
  generateHoardTreasure
} from './treasureMath';

describe('treasureMath - Generador de Tesoro DMG 2024', () => {
  describe('convertCoinsToGold', () => {
    it('convierte monedas mixtas a oro con precisión decimal', () => {
      const coins = { cp: 100, sp: 10, ep: 2, gp: 5, pp: 1 };
      // 100 cp = 1 gp, 10 sp = 1 gp, 2 ep = 1 gp, 5 gp = 5 gp, 1 pp = 10 gp -> Total = 18 gp
      expect(convertCoinsToGold(coins)).toBe(18);
    });
  });

  describe('generateIndividualTreasure', () => {
    it('genera botín para Tier 1 (CR 0-4)', () => {
      const res = generateIndividualTreasure('tier1_cr0_4', 80);
      expect(res.tier).toBe('tier1_cr0_4');
      expect(res.type).toBe('individual');
      expect(res.coins.gp).toBeGreaterThan(0);
      expect(res.totalValueGp).toBeGreaterThan(0);
    });

    it('genera platino en tiradas altas para Tier 4 (CR 17+)', () => {
      const res = generateIndividualTreasure('tier4_cr17_plus', 90);
      expect(res.coins.gp).toBeGreaterThan(0);
      expect(res.coins.pp).toBeGreaterThan(0);
    });
  });

  describe('generateHoardTreasure', () => {
    it('genera botín de guarida con gemas u objetos de arte', () => {
      const res = generateHoardTreasure('tier2_cr5_10', 50);
      expect(res.type).toBe('hoard');
      expect(res.coins.gp).toBeGreaterThan(0);
      expect(res.artObjects.length + res.gems.length).toBeGreaterThan(0);
      expect(res.totalValueGp).toBeGreaterThan(500);
    });

    it('genera objetos mágicos en tiradas de alto rango para Tier 4', () => {
      const res = generateHoardTreasure('tier4_cr17_plus', 99);
      expect(res.type).toBe('hoard');
      expect(res.artObjects.length).toBeGreaterThan(0);
      expect(res.magicItems.length).toBeGreaterThan(0);
    });
  });
});
