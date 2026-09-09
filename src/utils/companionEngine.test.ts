import { describe, it, expect } from 'vitest';
import { 
  COMPANION_PERSONAS, 
  getDefaultCompanionForRole, 
  generateCompanionResponse 
} from './companionEngine';

describe('Companion Assistant Engine', () => {
  it('defines the three official companion personas with proper stats and images', () => {
    expect(COMPANION_PERSONAS.elara).toBeDefined();
    expect(COMPANION_PERSONAS.elara.name).toContain('Elara');
    expect(COMPANION_PERSONAS.elara.stats.hp).toBe(12);
    expect(COMPANION_PERSONAS.elara.stats.dex).toBe(15);
    expect(COMPANION_PERSONAS.elara.stats.str).toBe(12);
    expect(COMPANION_PERSONAS.elara.portraitUrl).toBe('/companions/elara.jpg');

    expect(COMPANION_PERSONAS.mimic).toBeDefined();
    expect(COMPANION_PERSONAS.mimic.name).toContain('Dienteazur');
    expect(COMPANION_PERSONAS.mimic.stats.hp).toBe(28);
    expect(COMPANION_PERSONAS.mimic.stats.dex).toBe(16);
    expect(COMPANION_PERSONAS.mimic.stats.str).toBe(14);
    expect(COMPANION_PERSONAS.mimic.portraitUrl).toBe('/companions/mimic.jpg');

    expect(COMPANION_PERSONAS.archmage).toBeDefined();
    expect(COMPANION_PERSONAS.archmage.name).toContain('Aurelius');
    expect(COMPANION_PERSONAS.archmage.stats.hp).toBe(120);
    expect(COMPANION_PERSONAS.archmage.portraitUrl).toBe('/companions/archmage.jpg');
  });

  it('correctly maps roles to default companions', () => {
    expect(getDefaultCompanionForRole('player').id).toBe('elara');
    expect(getDefaultCompanionForRole('dm').id).toBe('mimic');
    expect(getDefaultCompanionForRole('supermaster').id).toBe('archmage');
  });

  it('generates knowledgeable responses for Elara (Player)', () => {
    const toppleRes = generateCompanionResponse('elara', '¿Cómo funciona Derribar Topple?');
    expect(toppleRes.text).toContain('Derribar (*Topple*)');
    expect(toppleRes.text).toContain('Tirada de Salvación de Constitución');
    expect(toppleRes.actions?.length).toBeGreaterThan(0);

    const bastionRes = generateCompanionResponse('elara', '¿Cómo funciona mi Bastión?');
    expect(bastionRes.text).toContain('Bastión');
    expect(bastionRes.text).toContain('Licencia Feudal del Super Master');
  });

  it('generates specialized DM responses for Dienteazur (Mimic)', () => {
    const rewardRes = generateCompanionResponse('mimic', '¿Cómo le otorgo botín u oro a un jugador?');
    expect(rewardRes.text).toContain('Conceder Botín y Recompensas');
    expect(rewardRes.text).toContain('Aventurero Destinatario en Mesa');

    const chaseRes = generateCompanionResponse('mimic', 'Dame una complicación para una persecución');
    expect(chaseRes.text).toContain('complicación oficial');
    expect(chaseRes.text.toLowerCase()).toContain('carrera');
  });

  it('generates sovereign administrative responses for Archimago Aurelius (Super Master)', () => {
    const goldRes = generateCompanionResponse('archmage', '¿Cómo transfiero Dragones de Oro a los Masters?');
    expect(goldRes.text).toContain('Bóveda Imperial');
    expect(goldRes.text).toContain('Dragones de Oro (DO)');

    const feudalRes = generateCompanionResponse('archmage', '¿Cómo desbloqueo las licencias feudales de Bastiones?');
    expect(feudalRes.text).toContain('Licencias Feudales');
    expect(feudalRes.text).toContain('Bastión');
  });
});
