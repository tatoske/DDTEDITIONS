import React, { useState } from 'react';
import {
  Monster,
  MonsterFactionType,
  MonsterTacticalRole,
  TacticalWarbandDef,
  MonsterMoraleCheckResult
} from '../../types/dnd';
import {
  MONSTER_CULTURES,
  TACTICAL_AI_ROLES,
  TACTICAL_WARBANDS,
  LAIR_CHAMBERS
} from '../../data/monsterTacticsData';
import {
  evaluateMoraleCheck,
  calculateCoverBonus,
  calculateAmbushAdvantage
} from '../../utils/monsterTacticsMath';
import {
  Skull,
  Shield,
  Zap,
  Target,
  Crown,
  Ghost,
  Swords,
  BookOpen,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Dices,
  Eye,
  Castle,
  ArrowRight,
  Send,
  HelpCircle,
  Users
} from 'lucide-react';

interface MonsterTacticsAndLairsManagerProps {
  onAddToEncounter: (monster: Monster) => void;
  onNavigateToEncounter: () => void;
}

export const MonsterTacticsAndLairsManager: React.FC<MonsterTacticsAndLairsManagerProps> = ({
  onAddToEncounter,
  onNavigateToEncounter
}) => {
  // Pestaña principal
  const [activeTab, setActiveTab] = useState<'cultures' | 'tactics' | 'warbands' | 'lairs'>('cultures');

  // Selección en pestaña de Culturas
  const [selectedCultureId, setSelectedCultureId] = useState<MonsterFactionType>('goblinoid');

  // Selección en pestaña de Roles Tácticos
  const [selectedRole, setSelectedRole] = useState<MonsterTacticalRole>('brute');
  const [selectedCover, setSelectedCover] = useState<'none' | 'half' | 'three_quarters' | 'total'>('half');
  const [isSurpriseRound, setIsSurpriseRound] = useState<boolean>(true);

  // Simulador de Moral
  const [moraleFaction, setMoraleFaction] = useState<MonsterFactionType>('goblinoid');
  const [moraleMaxHp, setMoraleMaxHp] = useState<number>(40);
  const [moraleCurrentHp, setMoraleCurrentHp] = useState<number>(10);
  const [moraleLeaderDead, setMoraleLeaderDead] = useState<boolean>(true);
  const [moraleWisMod, setMoraleWisMod] = useState<number>(0);
  const [moraleResult, setMoraleResult] = useState<MonsterMoraleCheckResult | null>(null);

  // Selección en pestaña de Escuadrones (Warbands)
  const [selectedWarbandId, setSelectedWarbandId] = useState<string>('hobgoblin_patrol');
  const [injectedWarbandSuccess, setInjectedWarbandSuccess] = useState<string | null>(null);

  // Selección en pestaña de Guaridas
  const [selectedLairChamberId, setSelectedLairChamberId] = useState<string>('beholder_vertical_shaft');

  // Datos activos
  const activeCulture = MONSTER_CULTURES.find(c => c.id === selectedCultureId) || MONSTER_CULTURES[0];
  const activeAiRole = TACTICAL_AI_ROLES[selectedRole];
  const activeWarband = TACTICAL_WARBANDS.find(w => w.id === selectedWarbandId) || TACTICAL_WARBANDS[0];
  const activeLairChamber = LAIR_CHAMBERS.find(l => l.id === selectedLairChamberId) || LAIR_CHAMBERS[0];

  const coverStats = calculateCoverBonus(selectedCover);
  const ambushStats = calculateAmbushAdvantage(selectedRole, isSurpriseRound);

  // Disparar chequeo de moral
  const handleRollMorale = () => {
    const res = evaluateMoraleCheck(
      moraleCurrentHp,
      moraleMaxHp,
      moraleLeaderDead,
      moraleWisMod,
      moraleFaction
    );
    setMoraleResult(res);
  };

  // Inyectar escuadrón completo al Encuentro
  const handleInjectWarbandToEncounter = (wb: TacticalWarbandDef) => {
    for (const item of wb.monsters) {
      for (let i = 0; i < item.quantity; i++) {
        const monsterObj: Monster = {
          id: `${item.monsterId}_${Date.now()}_${i + 1}`,
          name: item.quantity > 1 ? `${item.name} #${i + 1}` : item.name,
          size: item.size,
          type: item.type,
          alignment: 'Hostil',
          cr: item.cr,
          xp: item.xp,
          ac: item.ac,
          acType: 'Táctico',
          hp: item.hp,
          hitDice: 'd8',
          speed: item.speed,
          abilities: { str: 14, dex: 12, con: 14, int: 10, wis: 10, cha: 10 },
          senses: 'Visión en la oscuridad 18 m',
          languages: 'Común y lengua natal',
          traits: [
            { name: `Rol Táctico: ${item.tacticalRole.toUpperCase()}`, desc: item.tacticalNote }
          ],
          actions: [
            {
              name: 'Ataque Táctico',
              desc: `Ataque +${item.attackBonus} al impacto. Daño: ${item.damageDice} (${item.damageType}).`,
              attackBonus: item.attackBonus,
              damageDice: item.damageDice,
              damageType: item.damageType
            }
          ],
          sourceBook: 'Guía de Volo / Mordenkainen'
        };
        onAddToEncounter(monsterObj);
      }
    }
    setInjectedWarbandSuccess(`¡Escuadrón "${wb.name}" inyectado con éxito (${wb.totalCreatures} monstruos añadidos al Rastreador de Encuentros)!`);
    setTimeout(() => setInjectedWarbandSuccess(null), 6000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Cabecera Principal */}
      <div className="card" style={{ padding: '24px', borderLeft: '5px solid #d97706' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ backgroundColor: 'rgba(217, 119, 6, 0.15)', color: '#d97706', padding: '6px', borderRadius: '8px', display: 'flex' }}>
                <Swords size={24} />
              </span>
              <h2 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--color-primary-dark, #292524)' }}>
                Cultura, Tácticas de Monstruos & Ecología de Guaridas
              </h2>
            </div>
            <p style={{ margin: '8px 0 0 0', color: 'var(--color-text-muted, #78716c)', fontSize: '0.95rem' }}>
              Compendio canónico de psicología monstruosa, roles tácticos en combate, IA para el DM, escuadrones listos para combate y arquitectura de guaridas (*Guía de Monstruos de Volo*, *Mordenkainen: El Tomo de los Foes* y *DMG 2024*).
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              className="btn btn-secondary"
              onClick={onNavigateToEncounter}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}
            >
              <Users size={16} /> Ver Rastreador de Encuentros
            </button>
          </div>
        </div>

        {/* Notificación de inyección de escuadrón */}
        {injectedWarbandSuccess && (
          <div style={{ marginTop: '16px', padding: '12px 16px', backgroundColor: 'rgba(16, 185, 129, 0.12)', border: '1px solid #10b981', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ color: '#047857', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={18} /> {injectedWarbandSuccess}
            </span>
            <button
              className="btn btn-primary btn-sm"
              onClick={onNavigateToEncounter}
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              Ir al Combate <ArrowRight size={14} />
            </button>
          </div>
        )}

        {/* Pestañas de Navegación del Módulo */}
        <div style={{ display: 'flex', gap: '8px', marginTop: '20px', borderBottom: '1px solid var(--color-border, #e7e5e4)', paddingBottom: '8px', flexWrap: 'wrap' }}>
          <button
            className={`btn btn-sm ${activeTab === 'cultures' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('cultures')}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <BookOpen size={15} /> 1. Cultura & Cosmovisión (Volo)
          </button>
          <button
            className={`btn btn-sm ${activeTab === 'tactics' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('tactics')}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Target size={15} /> 2. Roles Tácticos & IA de Combate
          </button>
          <button
            className={`btn btn-sm ${activeTab === 'warbands' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('warbands')}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Shield size={15} /> 3. Escuadrones Tácticos (Warbands)
          </button>
          <button
            className={`btn btn-sm ${activeTab === 'lairs' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('lairs')}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Castle size={15} /> 4. Ecología & Salas de Guarida
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* PESTAÑA 1: CULTURA & COSMOVISIÓN MONSTRUOSA                    */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'cultures' && (
        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '20px' }}>
          {/* Selector de Facciones */}
          <div className="card" style={{ padding: '16px', height: 'fit-content' }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '1rem', color: 'var(--color-primary-dark, #292524)' }}>
              Facciones Canónicas
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {MONSTER_CULTURES.map(cult => {
                const isSel = cult.id === selectedCultureId;
                return (
                  <button
                    key={cult.id}
                    onClick={() => setSelectedCultureId(cult.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: isSel ? `2px solid ${cult.badgeColor}` : '1px solid var(--color-border, #e7e5e4)',
                      backgroundColor: isSel ? 'rgba(217, 119, 6, 0.08)' : 'var(--color-bg-card, #fafaf9)',
                      color: 'var(--color-text, #1c1917)',
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontWeight: isSel ? 700 : 500,
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <span style={{ fontSize: '0.9rem' }}>{cult.name}</span>
                    <span
                      style={{
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        backgroundColor: cult.badgeColor
                      }}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Detalle Cultural Completo */}
          <div className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--color-border, #e7e5e4)', paddingBottom: '16px', marginBottom: '16px' }}>
              <div>
                <span
                  style={{
                    backgroundColor: `${activeCulture.badgeColor}20`,
                    color: activeCulture.badgeColor,
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    padding: '3px 8px',
                    borderRadius: '4px',
                    textTransform: 'uppercase'
                  }}
                >
                  {activeCulture.sourceBook}
                </span>
                <h3 style={{ margin: '8px 0 4px 0', fontSize: '1.4rem', color: 'var(--color-primary-dark, #292524)' }}>
                  {activeCulture.name}
                </h3>
                <p style={{ margin: 0, color: 'var(--color-text-muted, #78716c)', fontStyle: 'italic', fontSize: '0.95rem' }}>
                  {activeCulture.subTitle}
                </p>
              </div>
            </div>

            {/* Cita de Erudito */}
            <div style={{ padding: '12px 16px', backgroundColor: 'var(--color-bg-alt, #f5f5f4)', borderLeft: `4px solid ${activeCulture.badgeColor}`, borderRadius: '4px', marginBottom: '20px' }}>
              <p style={{ margin: 0, fontStyle: 'italic', color: 'var(--color-text, #1c1917)', fontSize: '0.95rem' }}>
                "{activeCulture.scholarQuote.quote}"
              </p>
              <span style={{ display: 'block', marginTop: '6px', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-muted, #78716c)' }}>
                — {activeCulture.scholarQuote.author}
              </span>
            </div>

            {/* Resumen de Lore y Cosmovisión */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
              <div style={{ padding: '14px', backgroundColor: 'var(--color-bg-card, #fafaf9)', borderRadius: '8px', border: '1px solid var(--color-border, #e7e5e4)' }}>
                <h4 style={{ margin: '0 0 6px 0', fontSize: '0.9rem', color: 'var(--color-primary, #b45309)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Sparkles size={16} /> Filosofía & Cosmovisión
                </h4>
                <p style={{ margin: 0, fontSize: '0.85rem', lineHeight: '1.45' }}>{activeCulture.loreSummary}</p>
              </div>

              <div style={{ padding: '14px', backgroundColor: 'var(--color-bg-card, #fafaf9)', borderRadius: '8px', border: '1px solid var(--color-border, #e7e5e4)' }}>
                <h4 style={{ margin: '0 0 6px 0', fontSize: '0.9rem', color: 'var(--color-primary, #b45309)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Eye size={16} /> Panteón & Deidades
                </h4>
                <p style={{ margin: 0, fontSize: '0.85rem', lineHeight: '1.45' }}>{activeCulture.cosmologyAndDeities}</p>
              </div>
            </div>

            {/* Jerarquía Social */}
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ margin: '0 0 10px 0', fontSize: '0.95rem', color: 'var(--color-primary-dark, #292524)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Crown size={16} /> Jerarquía Social y Estructura de Castas
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
                {activeCulture.socialHierarchy.map((h, idx) => (
                  <div key={idx} style={{ padding: '10px 12px', border: '1px solid var(--color-border, #e7e5e4)', borderRadius: '6px', backgroundColor: 'var(--color-bg-card, #fafaf9)' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: activeCulture.badgeColor, textTransform: 'uppercase' }}>
                      {h.role}
                    </span>
                    <h5 style={{ margin: '2px 0 4px 0', fontSize: '0.9rem', color: 'var(--color-primary-dark, #292524)' }}>
                      {h.rank}
                    </h5>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--color-text-muted, #78716c)' }}>
                      {h.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Rasgos Psicológicos & Debilidades Explotables */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ padding: '14px', border: '1px solid var(--color-border, #e7e5e4)', borderRadius: '8px' }}>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '0.9rem', color: '#0369a1', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <HelpCircle size={16} /> Rasgos Psicológicos & Obsesiones
                </h4>
                <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {activeCulture.psychologicalTraits.map((t, idx) => (
                    <li key={idx}>{t}</li>
                  ))}
                </ul>
              </div>

              <div style={{ padding: '14px', border: '1px solid rgba(220, 38, 38, 0.3)', borderRadius: '8px', backgroundColor: 'rgba(220, 38, 38, 0.03)' }}>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '0.9rem', color: '#b91c1c', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <AlertTriangle size={16} /> Debilidades Explotables por los Aventureros
                </h4>
                <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '6px', color: '#991b1b' }}>
                  {activeCulture.knownWeaknesses.map((w, idx) => (
                    <li key={idx}>{w}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* PESTAÑA 2: ROLES TÁCTICOS & IA DE COMBATE                      */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'tactics' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          {/* Columna Izquierda: Guía de Roles de Combate */}
          <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '1.2rem', color: 'var(--color-primary-dark, #292524)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Target size={20} color="#b45309" /> Guía de Comportamiento e IA de Combate
            </h3>

            {/* Selector de Rol Táctico */}
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '18px' }}>
              {(['brute', 'skirmisher', 'artillery', 'leader', 'ambusher'] as MonsterTacticalRole[]).map(roleKey => {
                const rData = TACTICAL_AI_ROLES[roleKey];
                const isSel = roleKey === selectedRole;
                return (
                  <button
                    key={roleKey}
                    className={`btn btn-sm ${isSel ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setSelectedRole(roleKey)}
                    style={{ fontSize: '0.8rem' }}
                  >
                    {rData.roleName.split(' ')[0]}
                  </button>
                );
              })}
            </div>

            {/* Tarjeta del Rol Activo */}
            <div style={{ padding: '16px', border: '1px solid var(--color-border, #e7e5e4)', borderRadius: '8px', backgroundColor: 'var(--color-bg-card, #fafaf9)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span style={{ padding: '4px', backgroundColor: 'rgba(217, 119, 6, 0.15)', color: '#b45309', borderRadius: '4px' }}>
                  <Target size={18} />
                </span>
                <h4 style={{ margin: 0, fontSize: '1.05rem', color: 'var(--color-primary-dark, #292524)' }}>
                  {activeAiRole.roleName}
                </h4>
              </div>

              <p style={{ margin: '0 0 14px 0', fontSize: '0.85rem', color: 'var(--color-text-muted, #78716c)' }}>
                <strong>Directiva Principal:</strong> {activeAiRole.primaryDirective}
              </p>

              {/* Prioridades de Blanco */}
              <div style={{ marginBottom: '14px' }}>
                <h5 style={{ margin: '0 0 6px 0', fontSize: '0.85rem', color: '#b45309' }}>
                  🎯 Prioridad de Selección de Blancos:
                </h5>
                <ol style={{ margin: 0, paddingLeft: '18px', fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {activeAiRole.targetPriority.map((p, idx) => (
                    <li key={idx}>{p}</li>
                  ))}
                </ol>
              </div>

              {/* Fases de Combate */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
                <div style={{ padding: '8px', backgroundColor: 'var(--color-bg-alt, #f5f5f4)', borderRadius: '4px', fontSize: '0.8rem' }}>
                  <strong style={{ color: '#0284c7' }}>1. Apertura (Ronda 1):</strong> {activeAiRole.combatPhases.opening}
                </div>
                <div style={{ padding: '8px', backgroundColor: 'var(--color-bg-alt, #f5f5f4)', borderRadius: '4px', fontSize: '0.8rem' }}>
                  <strong style={{ color: '#d97706' }}>2. Combate Medio:</strong> {activeAiRole.combatPhases.midBattle}
                </div>
                <div style={{ padding: '8px', backgroundColor: 'var(--color-bg-alt, #f5f5f4)', borderRadius: '4px', fontSize: '0.8rem' }}>
                  <strong style={{ color: '#dc2626' }}>3. Punto Crítico / Retirada:</strong> {activeAiRole.combatPhases.criticalOrRetreat}
                </div>
              </div>

              {/* Cobertura y Moral */}
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted, #78716c)' }}>
                <p style={{ margin: '0 0 4px 0' }}>
                  <strong>🛡️ Cobertura Preferida:</strong> {activeAiRole.preferredCover}
                </p>
                <p style={{ margin: 0 }}>
                  <strong>⚠️ Disparador de Retirada:</strong> {activeAiRole.moraleBreakingPoint}
                </p>
              </div>
            </div>

            {/* Calculadora Táctica de Cobertura y Sorpresa */}
            <div style={{ marginTop: '20px', padding: '16px', border: '1px solid var(--color-border, #e7e5e4)', borderRadius: '8px' }}>
              <h4 style={{ margin: '0 0 10px 0', fontSize: '0.95rem', color: 'var(--color-primary-dark, #292524)' }}>
                Calculadora Táctica de Cobertura & Emboscada
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: '4px' }}>
                    Tipo de Cobertura del Monstruo:
                  </label>
                  <select
                    className="form-control form-control-sm"
                    value={selectedCover}
                    onChange={e => setSelectedCover(e.target.value as any)}
                  >
                    <option value="none">Sin cobertura (0)</option>
                    <option value="half">Media cobertura (+2 CA / Des)</option>
                    <option value="three_quarters">Tres cuartos (+5 CA / Des)</option>
                    <option value="total">Cobertura total (Bloqueado)</option>
                  </select>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '16px' }}>
                  <input
                    type="checkbox"
                    id="surpriseCheck"
                    checked={isSurpriseRound}
                    onChange={e => setIsSurpriseRound(e.target.checked)}
                  />
                  <label htmlFor="surpriseCheck" style={{ fontSize: '0.8rem', cursor: 'pointer' }}>
                    ¿Asalto de Sorpresa Activo?
                  </label>
                </div>
              </div>

              {/* Resumen de Modificadores */}
              <div style={{ marginTop: '12px', padding: '10px', backgroundColor: 'var(--color-bg-alt, #f5f5f4)', borderRadius: '6px', fontSize: '0.8rem', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <span><strong>Bono CA:</strong> +{coverStats.acBonus}</span>
                <span><strong>Bono Salv. Des:</strong> +{coverStats.dexSaveBonus}</span>
                <span><strong>Ataques Bloqueados:</strong> {coverStats.attacksBlocked ? 'SÍ' : 'NO'}</span>
                <span><strong>Ventaja en Ataque:</strong> {ambushStats.hasAdvantage ? 'SÍ (Sorpresa)' : 'NO'}</span>
                {ambushStats.extraDamageDice && <span><strong>Daño Extra:</strong> +{ambushStats.extraDamageDice}</span>}
              </div>
            </div>
          </div>

          {/* Columna Derecha: Simulador de Chequeo de Moral */}
          <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '1.2rem', color: 'var(--color-primary-dark, #292524)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Dices size={20} color="#b45309" /> Simulador de Moral y Desbandada (DMG)
            </h3>
            <p style={{ margin: '0 0 16px 0', fontSize: '0.85rem', color: 'var(--color-text-muted, #78716c)' }}>
              Determina si un grupo de monstruos mantiene la formación de combate o si huye en desbandada al sufrir bajas de líderes o heridas mortales.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '4px' }}>
                  Facción o Cultura del Monstruo:
                </label>
                <select
                  className="form-control form-control-sm"
                  value={moraleFaction}
                  onChange={e => setMoraleFaction(e.target.value as any)}
                >
                  <option value="goblinoid">Trasgos / Hobgoblins (Disciplinados pero temerosos)</option>
                  <option value="orcs">Orcos (Fanáticos de Gruumsh)</option>
                  <option value="yuanti">Yuan-ti (Pragmáticos fríos)</option>
                  <option value="beholder">Contemplador / Espectadores</option>
                  <option value="mindflayer">Azotamentes (Autopreservación)</option>
                  <option value="hags">Brujas (Ruptura de aquelarre)</option>
                  <option value="giants">Gigantes (Honor de la Ordenación)</option>
                  <option value="bloodwar">Guerra de la Sangre (Inmunes a Moral)</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '4px' }}>
                    Puntos de Golpe Máximos:
                  </label>
                  <input
                    type="number"
                    className="form-control form-control-sm"
                    value={moraleMaxHp}
                    onChange={e => setMoraleMaxHp(Math.max(1, parseInt(e.target.value) || 1))}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '4px' }}>
                    Puntos de Golpe Actuales:
                  </label>
                  <input
                    type="number"
                    className="form-control form-control-sm"
                    value={moraleCurrentHp}
                    onChange={e => setMoraleCurrentHp(Math.max(0, parseInt(e.target.value) || 0))}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '4px' }}>
                    Modificador de Sabiduría:
                  </label>
                  <input
                    type="number"
                    className="form-control form-control-sm"
                    value={moraleWisMod}
                    onChange={e => setMoraleWisMod(parseInt(e.target.value) || 0)}
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '20px' }}>
                  <input
                    type="checkbox"
                    id="leaderDeadCheck"
                    checked={moraleLeaderDead}
                    onChange={e => setMoraleLeaderDead(e.target.checked)}
                  />
                  <label htmlFor="leaderDeadCheck" style={{ fontSize: '0.8rem', cursor: 'pointer' }}>
                    ¿El Comandante / Líder ha muerto? (+3 CD)
                  </label>
                </div>
              </div>

              <button
                className="btn btn-primary"
                onClick={handleRollMorale}
                style={{ marginTop: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                <Dices size={16} /> Evaluar Moral (Tirada d20 + Mod)
              </button>

              {/* Resultado del Chequeo */}
              {moraleResult && (
                <div
                  style={{
                    marginTop: '16px',
                    padding: '16px',
                    borderRadius: '8px',
                    border: moraleResult.breaks ? '1px solid #dc2626' : '1px solid #16a34a',
                    backgroundColor: moraleResult.breaks ? 'rgba(220, 38, 38, 0.05)' : 'rgba(22, 163, 74, 0.05)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span
                      style={{
                        fontWeight: 700,
                        fontSize: '0.95rem',
                        color: moraleResult.breaks ? '#dc2626' : '#16a34a',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      {moraleResult.breaks ? <AlertTriangle size={18} /> : <CheckCircle2 size={18} />}
                      {moraleResult.breaks ? '¡DESBANDADA / RETIRADA!' : '¡MANTIENE LA POSICIÓN!'}
                    </span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                      Tirada: {moraleResult.roll} + {moraleResult.modifier} = {moraleResult.total} (CD {moraleResult.dc})
                    </span>
                  </div>

                  <p style={{ margin: 0, fontSize: '0.85rem', lineHeight: '1.4' }}>
                    {moraleResult.description}
                  </p>

                  <div style={{ marginTop: '10px', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--color-text-muted, #78716c)' }}>
                    Acción Táctica Inmediata: {moraleResult.actionTaken.replace('_', ' ')}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* PESTAÑA 3: GENERADOR DE ESCUADRONES TÁCTICOS (WARBANDS)        */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'warbands' && (
        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '20px' }}>
          {/* Selector de Warbands */}
          <div className="card" style={{ padding: '16px' }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '1rem', color: 'var(--color-primary-dark, #292524)' }}>
              Escuadrones Tácticos Disponibles
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {TACTICAL_WARBANDS.map(wb => {
                const isSel = wb.id === selectedWarbandId;
                return (
                  <button
                    key={wb.id}
                    onClick={() => setSelectedWarbandId(wb.id)}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: isSel ? '2px solid #b45309' : '1px solid var(--color-border, #e7e5e4)',
                      backgroundColor: isSel ? 'rgba(217, 119, 6, 0.08)' : 'var(--color-bg-card, #fafaf9)',
                      color: 'var(--color-text, #1c1917)',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                      <span style={{ fontWeight: isSel ? 700 : 600, fontSize: '0.85rem' }}>{wb.name}</span>
                      <span
                        style={{
                          fontSize: '0.7rem',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          backgroundColor: wb.difficultyRating === 'Difícil' ? 'rgba(220, 38, 38, 0.15)' : 'rgba(217, 119, 6, 0.15)',
                          color: wb.difficultyRating === 'Difícil' ? '#dc2626' : '#b45309',
                          fontWeight: 700
                        }}
                      >
                        {wb.difficultyRating}
                      </span>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted, #78716c)', marginTop: '2px' }}>
                      {wb.partyLevelTarget} • {wb.totalCreatures} criaturas
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Ficha Detallada del Escuadrón con Botón de Inyección */}
          <div className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', borderBottom: '1px solid var(--color-border, #e7e5e4)', paddingBottom: '16px', marginBottom: '16px' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#b45309', textTransform: 'uppercase' }}>
                  {activeWarband.factionName}
                </span>
                <h3 style={{ margin: '4px 0', fontSize: '1.4rem', color: 'var(--color-primary-dark, #292524)' }}>
                  {activeWarband.name}
                </h3>
                <p style={{ margin: 0, color: 'var(--color-text-muted, #78716c)', fontSize: '0.9rem' }}>
                  {activeWarband.description}
                </p>
              </div>

              {/* Botón de Inyección al Encounter Tracker */}
              <button
                className="btn btn-primary"
                onClick={() => handleInjectWarbandToEncounter(activeWarband)}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', fontWeight: 600 }}
              >
                <Send size={16} /> Enviar Escuadrón al Rastreador de Encuentros
              </button>
            </div>

            {/* Métricas de Combate (Reglas DMG 2024) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '20px' }}>
              <div style={{ padding: '12px', border: '1px solid var(--color-border, #e7e5e4)', borderRadius: '8px', textAlign: 'center', backgroundColor: 'var(--color-bg-card, #fafaf9)' }}>
                <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-text-muted, #78716c)' }}>Nivel Aventurero Sugerido</span>
                <strong style={{ fontSize: '1rem', color: 'var(--color-primary-dark, #292524)' }}>{activeWarband.partyLevelTarget}</strong>
              </div>

              <div style={{ padding: '12px', border: '1px solid var(--color-border, #e7e5e4)', borderRadius: '8px', textAlign: 'center', backgroundColor: 'var(--color-bg-card, #fafaf9)' }}>
                <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-text-muted, #78716c)' }}>Total de Criaturas</span>
                <strong style={{ fontSize: '1rem', color: 'var(--color-primary-dark, #292524)' }}>{activeWarband.totalCreatures} enemigos</strong>
              </div>

              <div style={{ padding: '12px', border: '1px solid var(--color-border, #e7e5e4)', borderRadius: '8px', textAlign: 'center', backgroundColor: 'var(--color-bg-card, #fafaf9)' }}>
                <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-text-muted, #78716c)' }}>XP Base / XP Ajustada (DMG)</span>
                <strong style={{ fontSize: '1rem', color: '#b45309' }}>{activeWarband.rawXp} XP / {activeWarband.adjustedXp} XP</strong>
              </div>

              <div style={{ padding: '12px', border: '1px solid var(--color-border, #e7e5e4)', borderRadius: '8px', textAlign: 'center', backgroundColor: 'var(--color-bg-card, #fafaf9)' }}>
                <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-text-muted, #78716c)' }}>Dificultad Estimada</span>
                <strong style={{ fontSize: '1rem', color: activeWarband.difficultyRating === 'Difícil' ? '#dc2626' : '#16a34a' }}>
                  {activeWarband.difficultyRating}
                </strong>
              </div>
            </div>

            {/* Resumen Táctico de Batalla */}
            <div style={{ padding: '12px 16px', backgroundColor: 'var(--color-bg-alt, #f5f5f4)', borderRadius: '8px', marginBottom: '20px', fontSize: '0.85rem' }}>
              <strong>📋 Formación Táctica:</strong> {activeWarband.battlefieldRoleOverview}
            </div>

            {/* Lista de Monstruos del Escuadrón */}
            <h4 style={{ margin: '0 0 12px 0', fontSize: '0.95rem', color: 'var(--color-primary-dark, #292524)' }}>
              Componentes del Escuadrón Táctico
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {activeWarband.monsters.map((m, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px 16px',
                    border: '1px solid var(--color-border, #e7e5e4)',
                    borderRadius: '8px',
                    backgroundColor: 'var(--color-bg-card, #fafaf9)',
                    flexWrap: 'wrap',
                    gap: '12px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span
                      style={{
                        padding: '6px 10px',
                        backgroundColor: 'var(--color-primary-dark, #292524)',
                        color: '#fff',
                        borderRadius: '6px',
                        fontWeight: 700,
                        fontSize: '0.9rem'
                      }}
                    >
                      {m.quantity}x
                    </span>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <strong style={{ fontSize: '0.95rem', color: 'var(--color-primary-dark, #292524)' }}>{m.name}</strong>
                        <span
                          style={{
                            fontSize: '0.75rem',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            backgroundColor: 'rgba(217, 119, 6, 0.15)',
                            color: '#b45309',
                            fontWeight: 600,
                            textTransform: 'uppercase'
                          }}
                        >
                          {m.tacticalRole}
                        </span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted, #78716c)' }}>
                          CR {m.cr} ({m.xp} XP c/u)
                        </span>
                      </div>
                      <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: 'var(--color-text-muted, #78716c)' }}>
                        {m.tacticalNote}
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '16px', fontSize: '0.8rem', color: 'var(--color-text, #1c1917)' }}>
                    <span><strong>CA:</strong> {m.ac}</span>
                    <span><strong>PG:</strong> {m.hp}</span>
                    <span><strong>Vel:</strong> {m.speed}</span>
                    <span><strong>Ataque:</strong> +{m.attackBonus} ({m.damageDice})</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* PESTAÑA 4: ECOLOGÍA & SALAS DE GUARIDA                         */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'lairs' && (
        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '20px' }}>
          {/* Selector de Cámaras de Guarida */}
          <div className="card" style={{ padding: '16px' }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '1rem', color: 'var(--color-primary-dark, #292524)' }}>
              Cámaras y Ecosistemas
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {LAIR_CHAMBERS.map(chamber => {
                const isSel = chamber.id === selectedLairChamberId;
                return (
                  <button
                    key={chamber.id}
                    onClick={() => setSelectedLairChamberId(chamber.id)}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: isSel ? '2px solid #b45309' : '1px solid var(--color-border, #e7e5e4)',
                      backgroundColor: isSel ? 'rgba(217, 119, 6, 0.08)' : 'var(--color-bg-card, #fafaf9)',
                      color: 'var(--color-text, #1c1917)',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <span style={{ fontWeight: isSel ? 700 : 600, fontSize: '0.85rem' }}>{chamber.name}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted, #78716c)', marginTop: '2px' }}>
                      {chamber.suggestedEncounterCr} • {chamber.purpose.slice(0, 35)}...
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Ficha Detallada de la Cámara */}
          <div className="card" style={{ padding: '24px' }}>
            <div style={{ borderBottom: '1px solid var(--color-border, #e7e5e4)', paddingBottom: '16px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#b45309', textTransform: 'uppercase' }}>
                  Facción: {activeLairChamber.faction.toUpperCase()}
                </span>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, padding: '3px 8px', borderRadius: '4px', backgroundColor: 'var(--color-bg-alt, #f5f5f4)' }}>
                  Desafío Recomendado: {activeLairChamber.suggestedEncounterCr}
                </span>
              </div>
              <h3 style={{ margin: '6px 0 4px 0', fontSize: '1.35rem', color: 'var(--color-primary-dark, #292524)' }}>
                {activeLairChamber.name}
              </h3>
              <p style={{ margin: 0, color: 'var(--color-text-muted, #78716c)', fontStyle: 'italic', fontSize: '0.9rem' }}>
                <strong>Propósito en la Guarida:</strong> {activeLairChamber.purpose}
              </p>
            </div>

            {/* Descripción Física y Atmosférica */}
            <div style={{ padding: '14px', backgroundColor: 'var(--color-bg-alt, #f5f5f4)', borderRadius: '8px', marginBottom: '20px', fontSize: '0.9rem', lineHeight: '1.5' }}>
              {activeLairChamber.physicalDescription}
            </div>

            {/* Peligros y Mecanismos Defensivos */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
              <div style={{ padding: '14px', border: '1px solid rgba(220, 38, 38, 0.3)', borderRadius: '8px', backgroundColor: 'rgba(220, 38, 38, 0.02)' }}>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '0.9rem', color: '#b91c1c', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <AlertTriangle size={16} /> Peligros Ambientales de la Cámara
                </h4>
                <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {activeLairChamber.tacticalHazards.map((h, idx) => (
                    <li key={idx}>{h}</li>
                  ))}
                </ul>
              </div>

              <div style={{ padding: '14px', border: '1px solid var(--color-border, #e7e5e4)', borderRadius: '8px', backgroundColor: 'var(--color-bg-card, #fafaf9)' }}>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '0.9rem', color: '#0369a1', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Shield size={16} /> Mecanismos Defensivos & Alarmas
                </h4>
                <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {activeLairChamber.defensiveMechanisms.map((d, idx) => (
                    <li key={idx}>{d}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Pistas de Investigación */}
            <div style={{ padding: '14px', border: '1px solid var(--color-border, #e7e5e4)', borderRadius: '8px' }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '0.9rem', color: 'var(--color-primary-dark, #292524)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Eye size={16} color="#b45309" /> Pistas de Investigación & Saber Monstruoso
              </h4>
              <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '6px', color: 'var(--color-text-muted, #78716c)' }}>
                {activeLairChamber.investigationClues.map((c, idx) => (
                  <li key={idx}>{c}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
