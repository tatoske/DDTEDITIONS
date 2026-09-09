import React, { useState } from 'react';
import { Monster, Character } from '../../types/dnd';
import { calculateEncounterDifficulty, rollDice, rollD20WithAdvantage, getAbilityModifier, formatModifier } from '../../utils/dndMath';
import { INITIAL_CONDITIONS } from '../../data/initialData';
import { Swords, Play, RotateCcw, Plus, Trash2, Heart, Shield, Zap, Skull, CheckCircle, ChevronRight, AlertTriangle, Sparkles, Dices } from 'lucide-react';
import { generateCombatTactics } from '../../utils/combatAssistantMath';
import { evaluateDramaticRoll, triggerDramaticDiceRoll } from '../../utils/diceRollEvent';

interface Combatant {
  instanceId: string;
  name: string;
  isMonster: boolean;
  cr?: string;
  level?: number;
  maxHp: number;
  currentHp: number;
  ac: number;
  initiative: number;
  initiativeBonus: number;
  conditions: string[];
  monsterRef?: Monster;
}

interface EncounterTrackerProps {
  characters: Character[];
  monstersInEncounter: Monster[];
  onRemoveMonsterFromEncounter: (index: number) => void;
  onClearEncounter: () => void;
}

export const EncounterTracker: React.FC<EncounterTrackerProps> = ({
  characters,
  monstersInEncounter,
  onRemoveMonsterFromEncounter,
  onClearEncounter
}) => {
  // Configuración de aventureros en el encuentro
  const [activeParty, setActiveParty] = useState<Array<{ id: string; name: string; level: number; hp: number; ac: number }>>([
    ...characters.map(c => ({ id: c.id, name: c.name, level: c.level, hp: c.maxHp, ac: c.armorClass }))
  ]);

  // Si no hay personajes creados aún, dar un grupo por defecto
  const partyToUse = activeParty.length > 0 ? activeParty : [
    { id: 'p1', name: 'Guerrero (Nvl 1)', level: 1, hp: 12, ac: 16 },
    { id: 'p2', name: 'Clérigo (Nvl 1)', level: 1, hp: 10, ac: 15 },
    { id: 'p3', name: 'Pícaro (Nvl 1)', level: 1, hp: 9, ac: 14 },
    { id: 'p4', name: 'Mago (Nvl 1)', level: 1, hp: 7, ac: 12 }
  ];

  // Estado del combate en vivo
  const [inCombat, setInCombat] = useState<boolean>(false);
  const [round, setRound] = useState<number>(1);
  const [turnIndex, setTurnIndex] = useState<number>(0);
  const [combatants, setCombatants] = useState<Combatant[]>([]);
  const [combatLog, setCombatLog] = useState<string[]>([]);

  // Cálculo de Balance D&D 2024
  const playerLevels = partyToUse.map(p => p.level);
  const monsterCrs = monstersInEncounter.map(m => m.cr);
  const difficultyData = calculateEncounterDifficulty(playerLevels, monsterCrs);

  const addCombatLog = (msg: string) => {
    setCombatLog(prev => [msg, ...prev.slice(0, 14)]);
  };

  // Iniciar combate y tirar iniciativas
  const handleStartCombat = () => {
    const newCombatants: Combatant[] = [];

    // Agregar jugadores
    partyToUse.forEach(p => {
      const initRoll = rollD20WithAdvantage('normal', 2);
      newCombatants.push({
        instanceId: 'p_' + p.id + '_' + Math.random().toString(36).substring(2, 6),
        name: p.name,
        isMonster: false,
        level: p.level,
        maxHp: p.hp,
        currentHp: p.hp,
        ac: p.ac,
        initiativeBonus: 2,
        initiative: initRoll.total,
        conditions: []
      });
    });

    // Agregar monstruos
    monstersInEncounter.forEach((m, idx) => {
      const dexMod = getAbilityModifier(m.abilities.dex);
      const initRoll = rollD20WithAdvantage('normal', dexMod);
      newCombatants.push({
        instanceId: 'm_' + m.id + '_' + idx + '_' + Math.random().toString(36).substring(2, 6),
        name: `${m.name} #${idx + 1}`,
        isMonster: true,
        cr: m.cr,
        maxHp: m.hp,
        currentHp: m.hp,
        ac: m.ac,
        initiativeBonus: dexMod,
        initiative: initRoll.total,
        conditions: [],
        monsterRef: m
      });
    });

    // Ordenar por iniciativa descendente
    newCombatants.sort((a, b) => b.initiative - a.initiative);

    setCombatants(newCombatants);
    setInCombat(true);
    setRound(1);
    setTurnIndex(0);
    addCombatLog(`¡Combate iniciado! Ronda 1. Turno de ${newCombatants[0]?.name}.`);
  };

  const handleNextTurn = () => {
    if (combatants.length === 0) return;
    let nextIndex = turnIndex + 1;
    let nextRound = round;
    if (nextIndex >= combatants.length) {
      nextIndex = 0;
      nextRound = round + 1;
      addCombatLog(`--- Fin de la Ronda ${round}. Iniciando Ronda ${nextRound} ---`);
    }
    setTurnIndex(nextIndex);
    setRound(nextRound);
    addCombatLog(`Turno ${nextIndex + 1}/${combatants.length}: ${combatants[nextIndex]?.name}.`);
  };

  const handleModifyHp = (instanceId: string, delta: number) => {
    setCombatants(prev => prev.map(c => {
      if (c.instanceId === instanceId) {
        const nextHp = Math.max(0, Math.min(c.maxHp, c.currentHp + delta));
        return { ...c, currentHp: nextHp };
      }
      return c;
    }));
  };

  const handleToggleCondition = (instanceId: string, conditionName: string) => {
    setCombatants(prev => prev.map(c => {
      if (c.instanceId === instanceId) {
        const exists = c.conditions.includes(conditionName);
        const nextConditions = exists ? c.conditions.filter(con => con !== conditionName) : [...c.conditions, conditionName];
        return { ...c, conditions: nextConditions };
      }
      return c;
    }));
  };

  const activeCombatant = combatants[turnIndex];
  const tactics = (inCombat && activeCombatant) 
    ? generateCombatTactics(activeCombatant, combatants, round) 
    : null;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header del Gestor de Encuentros */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-gold)', paddingBottom: '0.8rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', margin: 0 }}>Gestor de Encuentros & Combate en Vivo</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Calculador de balance de dificultad 2024 y rastreador de turnos e iniciativa sin interrupciones.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {!inCombat ? (
            <button 
              className="btn btn-primary" 
              onClick={handleStartCombat}
              disabled={monstersInEncounter.length === 0}
            >
              <Play size={16} /> ¡Iniciar Combate & Tirar Iniciativa!
            </button>
          ) : (
            <>
              <button className="btn btn-secondary btn-sm" onClick={() => setInCombat(false)}>
                <RotateCcw size={14} /> Salir del Combate
              </button>
              <button className="btn btn-primary" onClick={handleNextTurn}>
                Siguiente Turno <ChevronRight size={16} />
              </button>
            </>
          )}
        </div>
      </div>

      {/* PANEL DE BALANCE & DIFICULTAD */}
      <div className="card card-gold" style={{ marginBottom: '1.5rem', padding: '1.2rem 1.6rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>Dificultad Estimada del Encuentro:</span>
              <span 
                className={`badge ${difficultyData.difficulty === 'Mortal' ? 'badge-crimson' : difficultyData.difficulty === 'Difícil' ? 'badge-gold' : difficultyData.difficulty === 'Medio' ? 'badge-sapphire' : 'badge-emerald'}`}
                style={{ fontSize: '1.1rem', padding: '0.3rem 0.8rem' }}
              >
                {difficultyData.difficulty}
              </span>
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginTop: '0.4rem' }}>
              PX Monstruos: <strong>{difficultyData.totalXp} PX</strong> | PX Ajustados por Grupo ({partyToUse.length} PJ): <strong>{difficultyData.adjustedXp} PX</strong>
            </div>
          </div>

          {/* Umbrales de XP */}
          <div style={{ display: 'flex', gap: '0.6rem', fontSize: '0.8rem' }}>
            <div style={{ background: 'rgba(46, 196, 182, 0.1)', padding: '0.3rem 0.6rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--emerald-heal)' }}>
              Fácil: <strong>{difficultyData.thresholds.easy}</strong>
            </div>
            <div style={{ background: 'rgba(58, 134, 255, 0.1)', padding: '0.3rem 0.6rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--sapphire-mana)' }}>
              Medio: <strong>{difficultyData.thresholds.medium}</strong>
            </div>
            <div style={{ background: 'rgba(212, 175, 55, 0.1)', padding: '0.3rem 0.6rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--gold-primary)' }}>
              Difícil: <strong>{difficultyData.thresholds.hard}</strong>
            </div>
            <div style={{ background: 'rgba(230, 57, 70, 0.1)', padding: '0.3rem 0.6rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--crimson-hp)' }}>
              Mortal: <strong>{difficultyData.thresholds.deadly}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* COMBATE EN VIVO O PREPARACIÓN */}
      {inCombat ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 300px', gap: '1.5rem' }}>
          {/* Rastreador de Iniciativa Activo */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.3rem', margin: 0 }}>
                Ronda {round} — Turno de: <span style={{ color: 'var(--gold-hover)' }}>{activeCombatant?.name}</span>
              </h2>
              <button className="btn btn-primary btn-sm" onClick={handleNextTurn}>
                Siguiente Turno <ChevronRight size={14} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              {combatants.map((c, idx) => {
                const isCurrentTurn = idx === turnIndex;
                const isDead = c.currentHp <= 0;

                return (
                  <div 
                    key={c.instanceId} 
                    className="card"
                    style={{
                      background: isCurrentTurn ? 'linear-gradient(135deg, rgba(212, 175, 55, 0.18), rgba(20, 24, 38, 0.95))' : 'var(--bg-card)',
                      border: isCurrentTurn ? '2px solid var(--gold-primary)' : isDead ? '1px solid rgba(230, 57, 70, 0.4)' : '1px solid var(--border-subtle)',
                      boxShadow: isCurrentTurn ? 'var(--shadow-gold)' : 'none',
                      opacity: isDead ? 0.6 : 1,
                      padding: '1rem'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.8rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                        {/* Indicador de Iniciativa */}
                        <div style={{ width: '40px', height: '40px', background: isCurrentTurn ? 'var(--gold-primary)' : 'rgba(0,0,0,0.4)', borderRadius: 'var(--radius-sm)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: isCurrentTurn ? '#0b0d14' : '#ffffff', fontFamily: 'var(--font-mono)' }}>
                          <span style={{ fontSize: '0.65rem', fontWeight: 600 }}>INIT</span>
                          <span style={{ fontSize: '1.1rem', fontWeight: 800 }}>{c.initiative}</span>
                        </div>

                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <h3 style={{ fontSize: '1.15rem', margin: 0, color: c.isMonster ? '#ff8b94' : '#ffffff' }}>
                              {c.name}
                            </h3>
                            {c.isMonster ? (
                              <span className="badge badge-crimson">CR {c.cr}</span>
                            ) : (
                              <span className="badge badge-sapphire">PJ Nvl {c.level}</span>
                            )}
                            {isDead && <span className="badge badge-crimson">¡CAÍDO / MUERTO!</span>}
                          </div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>
                            CA: <strong style={{ color: 'var(--gold-hover)' }}>{c.ac}</strong>
                          </div>
                        </div>
                      </div>

                      {/* Medidor de Salud & Controles */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '1.2rem', fontFamily: 'var(--font-mono)', fontWeight: 800, color: c.currentHp === 0 ? 'var(--crimson-hp)' : '#ffffff' }}>
                            {c.currentHp} <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>/ {c.maxHp} HP</span>
                          </div>
                          {/* Barra de Vida */}
                          <div style={{ width: '120px', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                            <div style={{ width: `${Math.max(0, Math.min(100, (c.currentHp / c.maxHp) * 100))}%`, height: '100%', background: c.currentHp > c.maxHp * 0.5 ? 'var(--emerald-heal)' : c.currentHp > c.maxHp * 0.25 ? 'var(--gold-primary)' : 'var(--crimson-hp)' }} />
                          </div>
                        </div>

                        {/* Botones de Daño y Curación rápida */}
                        <div style={{ display: 'flex', gap: '0.25rem' }}>
                          <button className="btn btn-danger btn-sm" style={{ padding: '0.2rem 0.5rem' }} onClick={() => handleModifyHp(c.instanceId, -5)}>-5</button>
                          <button className="btn btn-danger btn-sm" style={{ padding: '0.2rem 0.5rem' }} onClick={() => handleModifyHp(c.instanceId, -1)}>-1</button>
                          <button className="btn btn-primary btn-sm" style={{ padding: '0.2rem 0.5rem' }} onClick={() => handleModifyHp(c.instanceId, 1)}>+1</button>
                          <button className="btn btn-primary btn-sm" style={{ padding: '0.2rem 0.5rem' }} onClick={() => handleModifyHp(c.instanceId, 5)}>+5</button>
                        </div>
                      </div>
                    </div>

                    {/* Condiciones */}
                    <div style={{ marginTop: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Estados:</span>
                      {['Cegado', 'Envenenado', 'Paralizado', 'Tumbado', 'Hechizado', 'Asustado'].map(cond => {
                        const active = c.conditions.includes(cond);
                        return (
                          <button
                            key={cond}
                            onClick={() => handleToggleCondition(c.instanceId, cond)}
                            style={{
                              background: active ? 'rgba(230, 57, 70, 0.25)' : 'rgba(255,255,255,0.05)',
                              border: `1px solid ${active ? 'var(--crimson-hp)' : 'rgba(255,255,255,0.1)'}`,
                              color: active ? '#ff8b94' : 'var(--text-dim)',
                              borderRadius: 'var(--radius-full)',
                              padding: '0.15rem 0.5rem',
                              fontSize: '0.72rem',
                              cursor: 'pointer'
                            }}
                          >
                            {cond}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Panel Lateral: Consejos del Asistente & Registro de Combate */}
          <div>
            {tactics && (
              <div 
                className="card"
                style={{
                  marginBottom: '1rem',
                  background: activeCombatant?.isMonster 
                    ? 'linear-gradient(135deg, rgba(88, 28, 135, 0.28), rgba(15, 23, 42, 0.96))' 
                    : 'linear-gradient(135deg, rgba(180, 83, 9, 0.25), rgba(15, 23, 42, 0.96))',
                  border: activeCombatant?.isMonster ? '1.5px solid #a855f7' : '1.5px solid #f59e0b',
                  boxShadow: '0 4px 18px rgba(0,0,0,0.45)',
                  padding: '1rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Sparkles size={14} color={activeCombatant?.isMonster ? '#c084fc' : '#fcd34d'} />
                    <span style={{ fontSize: '0.78rem', fontWeight: 800, color: activeCombatant?.isMonster ? '#c084fc' : '#fcd34d' }}>
                      {tactics.speakerName}
                    </span>
                  </div>
                  <span style={{ fontSize: '0.68rem', padding: '0.1rem 0.4rem', borderRadius: '4px', background: 'rgba(0,0,0,0.5)', color: '#d6d3d1' }}>
                    Ronda {round}
                  </span>
                </div>

                <h4 style={{ margin: '0.2rem 0 0.4rem 0', fontSize: '0.9rem', color: '#f5f5f4' }}>
                  {tactics.title}
                </h4>

                <p style={{ fontSize: '0.78rem', color: '#e7e5e4', lineHeight: 1.4, margin: '0.3rem 0 0.5rem 0' }}>
                  {tactics.advice}
                </p>

                {tactics.priorityTarget && (
                  <div style={{ fontSize: '0.74rem', background: 'rgba(0,0,0,0.3)', padding: '0.25rem 0.5rem', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)', marginBottom: '0.5rem', color: '#fef3c7' }}>
                    🎯 <strong>Blanco Prioritario:</strong> {tactics.priorityTarget}
                  </div>
                )}

                {tactics.rechargeAction && (
                  <button
                    className="btn btn-secondary btn-sm"
                    style={{ width: '100%', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', background: 'rgba(217, 119, 6, 0.25)', border: '1px solid #f59e0b', color: '#fef3c7', fontSize: '0.75rem', fontWeight: 700 }}
                    onClick={() => {
                      const roll = Math.floor(Math.random() * 6) + 1;
                      const isSuccess = roll >= (tactics.rechargeAction?.minSuccess || 5);
                      const payload = evaluateDramaticRoll(6, roll, 0, tactics.rechargeAction?.name || 'Tirada de Recarga');
                      triggerDramaticDiceRoll(payload);
                      addCombatLog(isSuccess 
                        ? `⚡ [Recarga Exitosa]: ¡${activeCombatant?.name} sacó un ${roll} en d6 y tiene listo su ${tactics.rechargeAction?.name}!`
                        : `❌ [Recarga Fallida]: ${activeCombatant?.name} sacó un ${roll} en d6 (necesitaba ${tactics.rechargeAction?.minSuccess}+).`
                      );
                    }}
                  >
                    <Dices size={14} /> {tactics.rechargeAction.label}
                  </button>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', fontSize: '0.74rem', color: '#d6d3d1' }}>
                  {tactics.tacticalTips.map((tip, tIdx) => (
                    <div key={tIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.3rem' }}>
                      <span style={{ color: activeCombatant?.isMonster ? '#c084fc' : '#f59e0b' }}>•</span>
                      <span>
                        {tip.split(/(\*\*.*?\*\*)/g).map((part, pIdx) =>
                          part.startsWith('**') && part.endsWith('**')
                            ? <strong key={pIdx} style={{ color: '#fef3c7' }}>{part.slice(2, -2)}</strong>
                            : part
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="card" style={{ position: 'sticky', top: '5rem' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.8rem', borderBottom: '1px solid var(--border-gold)', paddingBottom: '0.4rem' }}>
                Registro del Encuentro
              </h3>
              <div style={{ maxHeight: '420px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.82rem', fontFamily: 'var(--font-mono)' }}>
                {combatLog.map((log, i) => (
                  <div key={i} style={{ color: 'var(--text-muted)', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '0.2rem' }}>
                    {log}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* MODO PREPARACIÓN DEL ENCUENTRO */
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          {/* Lista de Monstruos en el Encuentro */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
              <h2 style={{ fontSize: '1.3rem', margin: 0 }}>Monstruos Seleccionados ({monstersInEncounter.length})</h2>
              {monstersInEncounter.length > 0 && (
                <button className="btn btn-secondary btn-sm" onClick={onClearEncounter}>
                  Limpiar Todos
                </button>
              )}
            </div>

            {monstersInEncounter.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)' }}>
                <p>No has añadido monstruos al encuentro todavía.</p>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginTop: '0.4rem' }}>
                  Ve a la pestaña <strong>Bestiario</strong> y haz clic en <strong>"+ Encuentro"</strong> en cualquier criatura.
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {monstersInEncounter.map((m, idx) => (
                  <div key={idx} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.8rem 1rem' }}>
                    <div>
                      <h4 style={{ margin: 0, color: '#ffffff' }}>{m.name}</h4>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        CR {m.cr} ({m.xp} PX) • CA {m.ac} • {m.hp} HP
                      </div>
                    </div>
                    <button className="btn btn-danger btn-sm" onClick={() => onRemoveMonsterFromEncounter(idx)}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Lista del Grupo de Aventureros */}
          <div>
            <h2 style={{ fontSize: '1.3rem', marginBottom: '0.8rem' }}>Grupo de Aventureros (Party)</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {partyToUse.map(p => (
                <div key={p.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.8rem 1rem' }}>
                  <div>
                    <h4 style={{ margin: 0, color: '#ffffff' }}>{p.name}</h4>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-gold)' }}>
                      Nivel {p.level} • {p.hp} HP • CA {p.ac}
                    </div>
                  </div>
                  <span className="badge badge-sapphire">Nivel {p.level}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
