import { describe, it, expect } from 'vitest';
import { findPdfReference, OFFICIAL_PDF_INDEX } from './companionPdfSearch';

describe('Official Companion PDF Manuals Indexer', () => {
  it('contains index entries across all core modules and books', () => {
    expect(OFFICIAL_PDF_INDEX.length).toBeGreaterThan(8);
  });

  it('matches weapon mastery queries to PHB 2024 Chapter 1', () => {
    const ref = findPdfReference('¿Cómo funciona la maestría Topple o Derribar?');
    expect(ref).not.toBeNull();
    expect(ref?.bookTitle).toContain('Manual del Jugador');
    expect(ref?.chapter).toContain('Capítulo 1');
    expect(ref?.pages).toContain('26-29');
    expect(ref?.officialCitation).toContain('Player\'s Handbook');
  });

  it('matches bastion queries to DMG 2024 Chapter 8', () => {
    const ref = findPdfReference('¿Cuándo puedo reclamar un Bastión y cómo funciona?');
    expect(ref).not.toBeNull();
    expect(ref?.bookTitle).toContain('Dungeon Master');
    expect(ref?.chapter).toContain('Bastiones');
    expect(ref?.pages).toContain('210-235');
  });

  it('matches sidekick queries to Tasha Chapter 4', () => {
    const ref = findPdfReference('¿Cuáles son las clases de Escudero de Tasha?');
    expect(ref).not.toBeNull();
    expect(ref?.bookTitle).toContain('Tasha');
    expect(ref?.chapter).toContain('Capítulo 4');
  });

  it('returns null for unknown queries gracefully', () => {
    const ref = findPdfReference('palabra_aleatoria_inexistente_12345');
    expect(ref).toBeNull();
  });
});
