// Asistente Táctico de Combate en Vivo para el Rastreador de Encuentros
// Analiza el combatiente activo, su stat block, vida restante y genera sugerencias tácticas instantáneas.

export interface CombatantInfo {
  instanceId: string;
  name: string;
  isMonster: boolean;
  cr?: string;
  level?: number;
  maxHp: number;
  currentHp: number;
  ac: number;
  initiative: number;
  conditions: string[];
  monsterRef?: any;
}

export interface TacticalRechargeCheck {
  name: string;
  dice: string;
  minSuccess: number;
  label: string;
}

export interface CombatTacticalAdvice {
  speaker: 'mimic' | 'elara';
  speakerName: string;
  title: string;
  advice: string;
  priorityTarget?: string;
  rechargeAction?: TacticalRechargeCheck;
  suggestedReaction?: string;
  tacticalTips: string[];
}

/**
 * Genera el consejo táctico en tiempo real para el turno actual
 */
export function generateCombatTactics(
  activeCombatant: CombatantInfo,
  allCombatants: CombatantInfo[],
  round: number
): CombatTacticalAdvice {
  const isMonster = activeCombatant.isMonster;
  const hpPercent = activeCombatant.maxHp > 0 
    ? Math.round((activeCombatant.currentHp / activeCombatant.maxHp) * 100) 
    : 100;

  // -------------------------------------------------------------
  // 1. TURNO DE MONSTRUO -> Habla el Mímico Dienteazur (Guía del DM)
  // -------------------------------------------------------------
  if (isMonster) {
    const m = activeCombatant.monsterRef;
    const monsterName = activeCombatant.name.split('#')[0].trim();
    const enemies = allCombatants.filter(c => !c.isMonster && c.currentHp > 0);
    
    // Identificar objetivo más vulnerable o prioritario
    const lowestHpEnemy = enemies.length > 0
      ? [...enemies].sort((a, b) => a.currentHp - b.currentHp)[0]
      : null;

    const lowestAcEnemy = enemies.length > 0
      ? [...enemies].sort((a, b) => a.ac - b.ac)[0]
      : null;

    const priorityTarget = lowestHpEnemy ? lowestHpEnemy.name : 'Aventurero más cercano';

    // Detección de habilidades con recarga (Aliento de dragón, etc.)
    let rechargeAction: TacticalRechargeCheck | undefined;
    const nameLower = monsterName.toLowerCase();
    const actionsDesc = m?.actions ? JSON.stringify(m.actions).toLowerCase() : '';

    if (nameLower.includes('drag') || actionsDesc.includes('aliento') || actionsDesc.includes('breath') || actionsDesc.includes('recharge') || actionsDesc.includes('recarga')) {
      rechargeAction = {
        name: 'Aliento de Furia / Recarga Táctica',
        dice: '1d6',
        minSuccess: 5,
        label: '🎲 Tirar Recarga (5-6 en 1d6)'
      };
    }

    const tips: string[] = [];

    // Monstruo malherido (< 35% HP)
    if (hpPercent < 35) {
      tips.push('⚠️ **Vida Crítica:** Considera usar la acción de Retirada (Disengage), huir volando o invocar refuerzos.');
      tips.push('🛡️ Si no puede huir, entra en furia desesperada concentrando todo su daño en el héroe más debilitado.');
    } else {
      tips.push(`🎯 **Foco Táctico:** Apunta a **${lowestHpEnemy?.name || 'objetivo débil'}** para reducir la economía de acciones del grupo.`);
      if (lowestAcEnemy && lowestAcEnemy.name !== lowestHpEnemy?.name) {
        tips.push(`🛡️ **Blanco Fácil:** ${lowestAcEnemy.name} posee la CA más baja (${lowestAcEnemy.ac}). Impactos casi asegurados.`);
      }
    }

    // Acciones legendarias o de guarida
    const crNum = parseFloat(activeCombatant.cr || '1');
    if (crNum >= 5) {
      tips.push('👑 **Acciones Legendarias:** Recuerda que puedes gastar 1 acción legendaria al final del turno de cualquier jugador.');
    }

    if (round === 1) {
      tips.push('⚔️ **Ronda de Apertura:** Abre combate con ataques zonales (AoE) o control de masas antes de trabarte cuerpo a cuerpo.');
    }

    let mainAdvice = `*¡Krak-clic!* Es el turno de **${activeCombatant.name}** (HP: ${activeCombatant.currentHp}/${activeCombatant.maxHp}). `;
    if (rechargeAction) {
      mainAdvice += `¡Verifica si su ataque de **${rechargeAction.name}** está recargado con una tirada de 1d6 (5-6)! `;
    }
    mainAdvice += `Aprovecha su bonificador de ataque para presionar a ${priorityTarget}.`;

    return {
      speaker: 'mimic',
      speakerName: 'Grimorio Mímico Dienteazur',
      title: `Estrategia de Asedio para ${activeCombatant.name}`,
      advice: mainAdvice,
      priorityTarget,
      rechargeAction,
      suggestedReaction: 'Ataque de Oportunidad si un héroe se aleja sin destrabarse.',
      tacticalTips: tips
    };
  }

  // -------------------------------------------------------------
  // 2. TURNO DE JUGADOR -> Habla Elara Rompealbas (Guía del Aventurero)
  // -------------------------------------------------------------
  const aliveMonsters = allCombatants.filter(c => c.isMonster && c.currentHp > 0);
  const weakestMonster = aliveMonsters.length > 0
    ? [...aliveMonsters].sort((a, b) => a.currentHp - b.currentHp)[0]
    : null;

  const targetName = weakestMonster ? weakestMonster.name : 'Monstruo más cercano';
  const tips: string[] = [
    '🗡️ **Maestría con Armas 2024:** Si usas un arma con *Topple* (Derribar), haz caer al enemigo para que todo el grupo ataque con Ventaja.',
    '⚡ **Movimiento Libre:** Recuerda que en D&D 2024 puedes dividir tu movimiento antes y después de atacar.',
    `🎯 **Foco del Grupo:** Concentrar el daño en **${targetName}** eliminará una amenaza del tablero este turno.`
  ];

  if (hpPercent < 40) {
    tips.push('❤️ **Salud Baja:** Valora usar Acción Adicional para una Poción de Curación o tomar cobertura (+2 o +5 a CA).');
  }

  return {
    speaker: 'elara',
    speakerName: 'Elara Rompealbas',
    title: `Consejo de Combate para ${activeCombatant.name}`,
    advice: `¡Tu momento de brillar, ${activeCombatant.name}! Mantén la calma, coordina con tus aliados y derriba la defensa de ${targetName}.`,
    priorityTarget: targetName,
    suggestedReaction: 'Escudo arcano o Parada reactiva si el enemigo contraataca.',
    tacticalTips: tips
  };
}
