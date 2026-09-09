import {
  Character,
  ModernSpeciesDef,
  SpeciesAsiAllocation,
  AbilityName,
  AbilitiesRecord
} from '../types/dnd';

/**
 * Valida que la asignación de incremento de características (ASI) respete las reglas oficiales 2024:
 * Modo 1: +2 a una y +1 a otra diferente.
 * Modo 2: +1 a tres características distintas.
 */
export function validateAsiAllocation(allocation: SpeciesAsiAllocation): { isValid: boolean; error?: string } {
  if (allocation.mode === 'two_one') {
    if (!allocation.plusTwo || !allocation.plusOneA) {
      return { isValid: false, error: 'Debes seleccionar una característica para +2 y otra para +1.' };
    }
    if (allocation.plusTwo === allocation.plusOneA) {
      return { isValid: false, error: 'La característica que recibe +2 y la que recibe +1 deben ser distintas.' };
    }
    return { isValid: true };
  } else if (allocation.mode === 'three_ones') {
    const { plusOneA, plusOneB, plusOneC } = allocation;
    if (!plusOneA || !plusOneB || !plusOneC) {
      return { isValid: false, error: 'Debes seleccionar tres características distintas para +1 cada una.' };
    }
    const set = new Set([plusOneA, plusOneB, plusOneC]);
    if (set.size !== 3) {
      return { isValid: false, error: 'Las tres características seleccionadas para +1 deben ser diferentes.' };
    }
    return { isValid: true };
  }
  return { isValid: false, error: 'Modo de asignación desconocido.' };
}

/**
 * Aplica un nuevo linaje o especie modernizada a un aventurero activo.
 * Inyecta rasgos raciales, actualiza velocidad, lenguajes, armadura natural y ajusta características según ASI.
 */
export function applySpeciesToCharacter(
  character: Character,
  species: ModernSpeciesDef,
  asiAllocation?: SpeciesAsiAllocation,
  chosenSpellAbility?: AbilityName
): Character {
  const previousSpecies = character.species;

  // 1. Ajustar Atributos (ASI) si fue proporcionado
  const updatedAbilities: AbilitiesRecord = { ...character.abilities };
  if (asiAllocation) {
    const validation = validateAsiAllocation(asiAllocation);
    if (validation.isValid) {
      if (asiAllocation.mode === 'two_one' && asiAllocation.plusTwo && asiAllocation.plusOneA) {
        updatedAbilities[asiAllocation.plusTwo] = Math.min(20, updatedAbilities[asiAllocation.plusTwo] + 2);
        updatedAbilities[asiAllocation.plusOneA] = Math.min(20, updatedAbilities[asiAllocation.plusOneA] + 1);
      } else if (asiAllocation.mode === 'three_ones' && asiAllocation.plusOneA && asiAllocation.plusOneB && asiAllocation.plusOneC) {
        updatedAbilities[asiAllocation.plusOneA] = Math.min(20, updatedAbilities[asiAllocation.plusOneA] + 1);
        updatedAbilities[asiAllocation.plusOneB] = Math.min(20, updatedAbilities[asiAllocation.plusOneB] + 1);
        updatedAbilities[asiAllocation.plusOneC] = Math.min(20, updatedAbilities[asiAllocation.plusOneC] + 1);
      }
    }
  }

  // 2. Limpiar rasgos de la especie anterior y añadir los nuevos
  const existingFeatures = character.features.filter(f => f.source !== previousSpecies);
  const newRacialFeatures = species.traits.map(t => ({
    title: t.name,
    source: species.name,
    description: t.desc
  }));

  // 3. Casos especiales (Tortle tiene armadura natural base de 17)
  let newArmorClass = character.armorClass;
  if (species.id === 'tortle') {
    newArmorClass = Math.max(newArmorClass, 17);
  }

  // 4. Idiomas combinados
  const languagesSet = new Set([...character.languages, ...species.languages]);

  // 5. Devolver personaje actualizado
  return {
    ...character,
    species: species.name,
    speed: species.speed,
    armorClass: newArmorClass,
    abilities: updatedAbilities,
    languages: Array.from(languagesSet),
    features: [...existingFeatures, ...newRacialFeatures],
    spellcastingAbility: chosenSpellAbility || character.spellcastingAbility,
    updatedAt: new Date().toISOString()
  };
}
