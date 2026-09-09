import { Character, DragonmarkDef, ArcaneProstheticDef } from '../types/dnd';

/**
 * Mapeo canónico de nombres o identificadores de habilidad a claves normalizadas.
 */
export const SKILL_KEY_MAP: Record<string, string> = {
  'acrobacias': 'acrobacias',
  'atletismo': 'atletismo',
  'arcanos': 'arcanos',
  'conocimiento arcano': 'arcanos',
  'enganio': 'enganio',
  'engaño': 'enganio',
  'historia': 'historia',
  'interpretacion': 'interpretacion',
  'interpretación': 'interpretacion',
  'intimidacion': 'intimidacion',
  'intimidación': 'intimidacion',
  'investigacion': 'investigacion',
  'investigación': 'investigacion',
  'juego_manos': 'juego_manos',
  'medicina': 'medicina',
  'naturaleza': 'naturaleza',
  'percepcion': 'percepcion',
  'percepción': 'percepcion',
  'perspicacia': 'perspicacia',
  'perspicacia (intuición)': 'perspicacia',
  'religion': 'religion',
  'religión': 'religion',
  'sigilo': 'sigilo',
  'supervivencia': 'supervivencia',
  'animales': 'animales',
  'trato con animales': 'animales'
};

/**
 * Normaliza una cadena de habilidad a su clave estándar.
 */
export function normalizeSkillKey(skillNameOrId: string): string {
  const lower = skillNameOrId.trim().toLowerCase();
  return SKILL_KEY_MAP[lower] || lower;
}

/**
 * Verifica si el aventurero posee una Marca del Dragón que otorgue dado de intuición (+1d4) a la habilidad dada.
 */
export function checkHasIntuitionDie(character: Character, skillNameOrId: string): boolean {
  if (!character.dragonmark || !character.dragonmark.intuitionSkills) {
    return false;
  }
  const key = normalizeSkillKey(skillNameOrId);
  return character.dragonmark.intuitionSkills.some(s => normalizeSkillKey(s) === key);
}

/**
 * Realiza una tirada de habilidad aplicando automáticamente el dado de intuición (+1d4) si la Marca del Dragón aplica.
 */
export function rollIntuitionCheck(
  character: Character,
  skillNameOrId: string,
  baseModifier: number,
  forcedD20?: number,
  forcedD4?: number
): {
  d20: number;
  d4: number | null;
  total: number;
  isIntuitionApplied: boolean;
  formula: string;
} {
  const d20 = forcedD20 !== undefined ? forcedD20 : Math.floor(Math.random() * 20) + 1;
  const hasIntuition = checkHasIntuitionDie(character, skillNameOrId);

  let d4: number | null = null;
  if (hasIntuition) {
    d4 = forcedD4 !== undefined ? forcedD4 : Math.floor(Math.random() * 4) + 1;
  }

  const intuitionBonus = d4 ?? 0;
  const total = d20 + baseModifier + intuitionBonus;

  let formula = `d20 (${d20}) + mod (${baseModifier >= 0 ? `+${baseModifier}` : baseModifier})`;
  if (hasIntuition && d4 !== null) {
    formula += ` + 1d4 Intuición (${d4}) = ${total}`;
  } else {
    formula += ` = ${total}`;
  }

  return {
    d20,
    d4,
    total,
    isIntuitionApplied: hasIntuition,
    formula
  };
}

/**
 * Aplica una Marca del Dragón a la ficha del aventurero.
 */
export function applyDragonmarkToCharacter(character: Character, mark: DragonmarkDef): Character {
  // Si ya tiene una marca aberrante anterior, revertir su bono antes de cambiar
  let nextAbilities = { ...character.abilities };
  if (character.dragonmark?.markId === 'mark_aberrant' && mark.id !== 'mark_aberrant') {
    nextAbilities.con = Math.max(1, nextAbilities.con - 1);
  } else if (mark.id === 'mark_aberrant' && character.dragonmark?.markId !== 'mark_aberrant') {
    // La marca aberrante aumenta CON en +1 (máx 20)
    nextAbilities.con = Math.min(20, nextAbilities.con + 1);
  }

  const updatedMarkEntry = {
    markId: mark.id,
    name: mark.name,
    houseName: mark.houseName,
    intuitionSkills: mark.intuitionSkills,
    assignedDate: new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' })
  };

  // Agregar rasgo oficial a features si no existe
  const featureTitle = `Marca del Dragón: ${mark.name}`;
  const filteredFeatures = (character.features || []).filter(f => !f.title.startsWith('Marca del Dragón'));
  filteredFeatures.unshift({
    title: featureTitle,
    source: `Eberron: ${mark.houseName}`,
    description: `${mark.description} Rasgo especial: ${mark.specialTrait.title} - ${mark.specialTrait.description}`
  });

  return {
    ...character,
    abilities: nextAbilities,
    dragonmark: updatedMarkEntry,
    features: filteredFeatures,
    updatedAt: new Date().toISOString()
  };
}

/**
 * Retira la Marca del Dragón de la ficha del aventurero.
 */
export function removeDragonmarkFromCharacter(character: Character): Character {
  if (!character.dragonmark) return character;

  let nextAbilities = { ...character.abilities };
  if (character.dragonmark.markId === 'mark_aberrant') {
    nextAbilities.con = Math.max(1, nextAbilities.con - 1);
  }

  const filteredFeatures = (character.features || []).filter(f => !f.title.startsWith('Marca del Dragón'));

  return {
    ...character,
    abilities: nextAbilities,
    dragonmark: undefined,
    features: filteredFeatures,
    updatedAt: new Date().toISOString()
  };
}

/**
 * Equipa una Prótesis Arcana o Componente Forjado al aventurero.
 */
export function addProstheticToCharacter(character: Character, prosthetic: ArcaneProstheticDef): Character {
  const currentProsthetics = character.prosthetics || [];
  if (currentProsthetics.some(p => p.id === prosthetic.id)) {
    return character; // Ya la tiene equipada
  }

  const updatedProsthetics = [...currentProsthetics, prosthetic];

  // Si incluye un arma integrada (como el Brazo de Propulsión Arcana), agregarla a las armas
  let updatedWeapons = [...(character.weapons || [])];
  if (prosthetic.integratedWeapon) {
    const weaponId = `w_prosthetic_${prosthetic.id}`;
    if (!updatedWeapons.some(w => w.id === weaponId)) {
      updatedWeapons.push({
        id: weaponId,
        name: prosthetic.integratedWeapon.name,
        attackBonus: (character.abilities?.str ? Math.floor((character.abilities.str - 10) / 2) : 0) + 1 + 2, // mod + 1 magico + prof
        damageDice: '1d8 + FUE',
        damageType: 'Fuerza',
        range: prosthetic.integratedWeapon.range
      });
    }
  }

  return {
    ...character,
    prosthetics: updatedProsthetics,
    weapons: updatedWeapons,
    updatedAt: new Date().toISOString()
  };
}

/**
 * Desequipa o remueve una Prótesis Arcana del aventurero.
 */
export function removeProstheticFromCharacter(character: Character, prostheticId: string): Character {
  if (!character.prosthetics) return character;

  const updatedProsthetics = character.prosthetics.filter(p => p.id !== prostheticId);
  const weaponId = `w_prosthetic_${prostheticId}`;
  const updatedWeapons = (character.weapons || []).filter(w => w.id !== weaponId);

  return {
    ...character,
    prosthetics: updatedProsthetics,
    weapons: updatedWeapons,
    updatedAt: new Date().toISOString()
  };
}
