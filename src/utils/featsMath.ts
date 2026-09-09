import { Character, FeatDef, AbilityName } from '../types/dnd';
import { getAbilityModifier } from './dndMath';

/**
 * Aplica una Dote o Bendición Épica a un personaje, actualizando automáticamente
 * sus puntuaciones de característica, límites (20 para generales, 30 para épicas)
 * y efectos de Puntos de Golpe como Curtido (+2 PG/nvl) o Hado Heroico (+40 PG).
 */
export function applyFeatToCharacter(
  character: Character, 
  feat: FeatDef, 
  chosenStat?: AbilityName
): { updatedCharacter: Character; message: string } {
  const currentFeats = character.feats || [];
  const alreadyHas = currentFeats.some(f => f.featId === feat.id);
  if (alreadyHas && !feat.repeatable) {
    return {
      updatedCharacter: character,
      message: `El personaje ya posee la dote "${feat.name}".`
    };
  }

  const updatedAbilities = { ...character.abilities };
  let hpGain = 0;
  let statGainMsg = '';

  // 1. Aplicar aumento de característica (+1) si corresponde
  if (chosenStat && feat.statOptions?.includes(chosenStat)) {
    const currentScore = updatedAbilities[chosenStat];
    const maxLimit = feat.maxStatIncrease || 20;

    if (currentScore < maxLimit) {
      const oldConMod = getAbilityModifier(updatedAbilities.con);
      updatedAbilities[chosenStat] = currentScore + 1;
      const newConMod = getAbilityModifier(updatedAbilities.con);

      statGainMsg = ` (+1 a ${chosenStat.toUpperCase()}: ${currentScore} -> ${updatedAbilities[chosenStat]})`;

      // Si subió CON y aumentó el modificador, gana +1 PG por cada nivel del personaje
      if (chosenStat === 'con' && newConMod > oldConMod) {
        hpGain += character.level * (newConMod - oldConMod);
      }
    } else {
      statGainMsg = ` (${chosenStat.toUpperCase()} ya está en el límite máximo de ${maxLimit})`;
    }
  }

  // 2. Beneficios especiales de PG:
  // Dote "Curtido / Dureza" (+2 PG x nivel)
  if (feat.id === 'feat-tough') {
    hpGain += character.level * 2;
  }
  // Bendición Épica de Hado Heroico (+40 PG)
  if (feat.id === 'feat-boon-fortitude') {
    hpGain += 40;
  }

  // 3. Registrar entrada de dote
  const newFeatEntry = {
    featId: feat.id,
    name: feat.name,
    category: feat.category,
    chosenStat,
    customNotes: feat.benefits.join(' | ')
  };

  // 4. Agregar a features
  const newFeature = {
    title: feat.name,
    source: feat.category === 'origin' ? 'Dote de Origen (Nvl 1)' : feat.category === 'general' ? 'Dote General (Nvl 4+)' : 'Bendición Épica (Nvl 19-20)',
    description: feat.benefits.join(' • ')
  };

  const updatedCharacter: Character = {
    ...character,
    abilities: updatedAbilities,
    maxHp: character.maxHp + hpGain,
    currentHp: character.currentHp + hpGain,
    feats: [...currentFeats, newFeatEntry],
    features: [...character.features.filter(f => f.title !== feat.name), newFeature],
    updatedAt: new Date().toISOString()
  };

  const hpMsg = hpGain > 0 ? ` ¡Ganó +${hpGain} PG máximos!` : '';
  return {
    updatedCharacter,
    message: `¡Aprendida con éxito: "${feat.name}"!${statGainMsg}${hpMsg}`
  };
}

/**
 * Elimina una dote y revierte sus bonificadores de característica o vida
 */
export function removeFeatFromCharacter(
  character: Character, 
  featId: string
): Character {
  const currentFeats = character.feats || [];
  const featEntry = currentFeats.find(f => f.featId === featId);
  if (!featEntry) return character;

  const updatedAbilities = { ...character.abilities };
  let hpLoss = 0;

  if (featEntry.chosenStat && updatedAbilities[featEntry.chosenStat] > 1) {
    const oldConMod = getAbilityModifier(updatedAbilities.con);
    updatedAbilities[featEntry.chosenStat] -= 1;
    const newConMod = getAbilityModifier(updatedAbilities.con);
    if (featEntry.chosenStat === 'con' && newConMod < oldConMod) {
      hpLoss += character.level * (oldConMod - newConMod);
    }
  }

  if (featId === 'feat-tough') {
    hpLoss += character.level * 2;
  }
  if (featId === 'feat-boon-fortitude') {
    hpLoss += 40;
  }

  return {
    ...character,
    abilities: updatedAbilities,
    maxHp: Math.max(1, character.maxHp - hpLoss),
    currentHp: Math.max(1, Math.min(character.currentHp, character.maxHp - hpLoss)),
    feats: currentFeats.filter(f => f.featId !== featId),
    features: character.features.filter(f => f.title !== featEntry.name),
    updatedAt: new Date().toISOString()
  };
}
