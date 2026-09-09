import React, { useState } from 'react';
import { 
  Character, 
  ChaseParticipant, 
  ChaseEnvironment, 
  ChaseComplication, 
  DragonLairDef,
  DragonLairAction 
} from '../../types/dnd';
import { 
  URBAN_CHASE_COMPLICATIONS, 
  WILDERNESS_CHASE_COMPLICATIONS, 
  DRAGON_LAIRS_DATA 
} from '../../data/chaseAndLairsData';
import { 
  calculateFreeDashes, 
  performDashAction, 
  rollChaseComplication, 
  calculateRelativeDistance, 
  checkChaseOutcome, 
  resolveLairAction 
} from '../../utils/chaseMath';
import { getAbilityModifier } from '../../utils/dndMath';
import { 
  Flame, 
  Wind, 
  Footprints, 
  Dices, 
  ShieldAlert, 
  Zap, 
  AlertTriangle, 
  Check, 
  X, 
  RotateCcw, 
  Plus, 
  Users, 
  Activity, 
  Swords, 
  Compass, 
  Mountain, 
  Building2, 
  Skull, 
  CheckCircle,
  Clock,
  Sparkles
} from 'lucide-react';

interface ChasesAndLairsManagerProps {
  characters: Character[];
  onNotify?: (msg: string) => void;
}

export const ChasesAndLairsManager: React.FC<ChasesAndLairsManagerProps> = ({
  characters,
  onNotify
}) => {
  const [activeMainTab, setActiveMainTab] = useState<'chase' | 'lairs'>('chase');

  // -------------------------------------------------------------------------
  // ESTADO DEL MOTOR DE PERSECUCIÓN
  // -------------------------------------------------------------------------
  const [environment, setEnvironment] = useState<ChaseEnvironment>('urban');
  const [escapeThreshold, setEscapeThreshold] = useState<number>(120); // 120 pies de ventaja para escapar
  const [chaseRound, setChaseRound] = useState<number>(1);
  const [chaseLogs, setChaseLogs] = useState<string[]>([
    '¡La persecución ha comenzado! La presa intenta perderse entre la multitud.'
  ]);
  const [activeComplication, setActiveComplication] = useState<ChaseComplication | null>(null);
  const [complicationTarget, setComplicationTarget] = useState<string | null>(null);

  // Presa inicial
  const [quarry, setQuarry] = useState<ChaseParticipant>({
    id: 'quarry_spy',
    name: 'Espía Fugitivo de Breland',
    role: 'quarry',
    speed: 35,
    conMod: 2,
    freeDashesTotal: 5,
    dashesUsed: 0,
    currentPosition: 60, // Comienza con 60 pies de ventaja
    status: 'active',
    exhaustionLevel: 0
  });

  // Perseguidores iniciales (Aventureros o la guardia)
  const [pursuers, setPursuers] = useState<ChaseParticipant[]>(() => {
    if (characters.length > 0) {
      return characters.slice(0, 3).map(char => {
        const conMod = getAbilityModifier(char.abilities.con);
        return {
          id: `p_${char.id}`,
          name: char.name,
          role: 'pursuer' as const,
          speed: char.speed > 0 ? char.speed * 3.3 : 30, // convertir metros a aprox pies o 30 pies
          conMod,
          freeDashesTotal: calculateFreeDashes(conMod),
          dashesUsed: 0,
          currentPosition: 0,
          status: 'active' as const,
          exhaustionLevel: 0,
          characterId: char.id
        };
      });
    }
    return [
      {
        id: 'p_valeros',
        name: 'Valeros el Guerrero',
        role: 'pursuer',
        speed: 30,
        conMod: 2,
        freeDashesTotal: 5,
        dashesUsed: 0,
        currentPosition: 0,
        status: 'active',
        exhaustionLevel: 0
      }
    ];
  });

  // -------------------------------------------------------------------------
  // ESTADO DE GUARIDAS DE DRAGÓN
  // -------------------------------------------------------------------------
  const [selectedLair, setSelectedLair] = useState<DragonLairDef>(DRAGON_LAIRS_DATA[0]);
  const [lastLairActionResults, setLastLairActionResults] = useState<Array<{ targetName: string; totalSave: number; success: boolean; damage: number; message: string }> | null>(null);

  // -------------------------------------------------------------------------
  // MANEJADORES DE PERSECUCIÓN
  // -------------------------------------------------------------------------
  const logEvent = (msg: string) => {
    setChaseLogs(prev => [msg, ...prev.slice(0, 25)]);
    if (onNotify) onNotify(msg);
  };

  const handleDashQuarry = () => {
    const result = performDashAction(quarry);
    setQuarry(result.updatedParticipant);
    logEvent(`[Presa] ${result.message}`);
    evaluateOutcome(result.updatedParticipant, pursuers);
  };

  const handleDashPursuer = (pursuerId: string) => {
    const pIndex = pursuers.findIndex(p => p.id === pursuerId);
    if (pIndex === -1) return;

    const result = performDashAction(pursuers[pIndex]);
    const nextPursuers = [...pursuers];
    nextPursuers[pIndex] = result.updatedParticipant;
    setPursuers(nextPursuers);

    logEvent(`[Perseguidor] ${result.message}`);
    evaluateOutcome(quarry, nextPursuers);
  };

  const handleRollComplicationFor = (participantName: string) => {
    const comp = rollChaseComplication(environment);
    setActiveComplication(comp);
    setComplicationTarget(participantName);
    logEvent(`¡Obstáculo para ${participantName}! (d20 = ${comp.roll}): ${comp.title} (CD ${comp.dc} ${comp.checkLabel})`);
  };

  const evaluateOutcome = (currentQuarry: ChaseParticipant, currentPursuers: ChaseParticipant[]) => {
    const outcome = checkChaseOutcome(currentQuarry, currentPursuers, escapeThreshold);
    if (outcome === 'captured') {
      logEvent(`🚨 ¡OBJETIVO CAPTURADO! Uno de los perseguidores ha alcanzado a la presa cuerpo a cuerpo.`);
    } else if (outcome === 'escaped') {
      logEvent(`💨 ¡LA PRESA HA ESCAPADO! Logró una ventaja de más de ${escapeThreshold} pies o los perseguidores cayeron exhaustos.`);
    }
  };

  const handleAdvanceRound = () => {
    setChaseRound(r => r + 1);
    logEvent(`--- INICIO DE LA RONDA ${chaseRound + 1} ---`);
    setActiveComplication(null);
    setComplicationTarget(null);
  };

  const handleResetChase = () => {
    setChaseRound(1);
    setQuarry({
      ...quarry,
      dashesUsed: 0,
      currentPosition: 60,
      status: 'active',
      exhaustionLevel: 0
    });
    setPursuers(pursuers.map(p => ({
      ...p,
      dashesUsed: 0,
      currentPosition: 0,
      status: 'active',
      exhaustionLevel: 0
    })));
    setActiveComplication(null);
    setComplicationTarget(null);
    setChaseLogs(['Persecución reiniciada. Presa a 60 pies de ventaja inicial.']);
  };

  const handleLoadPartyAsPursuers = () => {
    if (characters.length === 0) return;
    const loaded = characters.map(char => {
      const conMod = getAbilityModifier(char.abilities.con);
      return {
        id: `p_${char.id}`,
        name: char.name,
        role: 'pursuer' as const,
        speed: 30,
        conMod,
        freeDashesTotal: calculateFreeDashes(conMod),
        dashesUsed: 0,
        currentPosition: 0,
        status: 'active' as const,
        exhaustionLevel: 0,
        characterId: char.id
      };
    });
    setPursuers(loaded);
    logEvent(`Se cargaron ${loaded.length} aventureros de la partida como perseguidores.`);
  };

  // -------------------------------------------------------------------------
  // MANEJADORES DE GUARIDAS DE DRAGÓN
  // -------------------------------------------------------------------------
  const handleTriggerLairAction = (action: DragonLairAction) => {
    if (characters.length === 0) {
      if (onNotify) onNotify('No hay aventureros activos en la partida para resolver la acción.');
      return;
    }

    const targets = characters.map(char => {
      const mod = getAbilityModifier(char.abilities[action.saveAbility]);
      const prof = char.savingThrows[action.saveAbility] ? char.proficiencyBonus : 0;
      return {
        name: char.name,
        saveBonus: mod + prof
      };
    });

    const results = resolveLairAction(action, targets);
    setLastLairActionResults(results);
    if (onNotify) {
      onNotify(`¡Iniciativa 20! ${selectedLair.dragonName} activa "${action.title}" contra el grupo.`);
    }
  };

  const chaseOutcome = checkChaseOutcome(quarry, pursuers, escapeThreshold);

  return (
    <div className="space-y-6">
      {/* HEADER PRINCIPAL */}
      <div className="bg-[#fcfbf7] dark:bg-[#1a1c23] border border-[#e2d9c8] dark:border-gray-800 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Footprints className="w-6 h-6 text-[#b45309]" />
              <h2 className="text-2xl font-serif font-bold text-[#2d241e] dark:text-gray-100">
                Persecuciones Dinámicas & Guaridas de Dragón
              </h2>
            </div>
            <p className="text-sm text-[#786953] dark:text-gray-400 mt-1">
              Sistemas oficiales de la <em>Guía del Dungeon Master 2024</em>, <em>Manual de Monstruos</em> y <em>Guías del Joven Aventurero</em>.
              Control de carreras, aguante por Constitución (3 + Mod. CON), complicaciones urbanas/salvajes y acciones de guarida en iniciativa 20.
            </p>
          </div>

          {/* Switcher de Módulo */}
          <div className="flex items-center bg-[#ede3d1] dark:bg-gray-800 p-1 rounded-lg text-xs font-bold">
            <button
              onClick={() => setActiveMainTab('chase')}
              className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
                activeMainTab === 'chase'
                  ? 'bg-[#b45309] text-white shadow-sm'
                  : 'text-[#6e5d48] dark:text-gray-300 hover:text-black dark:hover:text-white'
              }`}
            >
              <Footprints className="w-4 h-4" />
              Persecuciones (DMG 2024)
            </button>
            <button
              onClick={() => setActiveMainTab('lairs')}
              className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
                activeMainTab === 'lairs'
                  ? 'bg-[#b45309] text-white shadow-sm'
                  : 'text-[#6e5d48] dark:text-gray-300 hover:text-black dark:hover:text-white'
              }`}
            >
              <Flame className="w-4 h-4" />
              Guaridas de Dragón (Inic 20)
            </button>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* PESTAÑA 1: MOTOR DE PERSECUCIONES DINÁMICAS (DMG 2024)              */}
      {/* ------------------------------------------------------------------- */}
      {activeMainTab === 'chase' && (
        <div className="space-y-6">
          {/* BARRA DE CONTROL & CONFIGURACIÓN */}
          <div className="bg-[#fffefb] dark:bg-[#1a1c23] border border-[#e2d9c8] dark:border-gray-800 rounded-xl p-5 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase text-[#8c6b3e] dark:text-amber-400">
                  Entorno:
                </span>
                <div className="flex items-center bg-[#ede3d1] dark:bg-gray-800 p-0.5 rounded-lg text-xs font-bold">
                  <button
                    onClick={() => setEnvironment('urban')}
                    className={`px-2.5 py-1 rounded transition-colors flex items-center gap-1 ${
                      environment === 'urban' ? 'bg-[#b45309] text-white' : 'text-[#6e5d48] dark:text-gray-300'
                    }`}
                  >
                    <Building2 className="w-3.5 h-3.5" /> Urbano
                  </button>
                  <button
                    onClick={() => setEnvironment('wilderness')}
                    className={`px-2.5 py-1 rounded transition-colors flex items-center gap-1 ${
                      environment === 'wilderness' ? 'bg-[#b45309] text-white' : 'text-[#6e5d48] dark:text-gray-300'
                    }`}
                  >
                    <Mountain className="w-3.5 h-3.5" /> Salvaje
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="font-bold text-[#8c6b3e] dark:text-amber-400">Ronda:</span>
                <span className="px-2.5 py-0.5 bg-amber-100 dark:bg-amber-950 font-bold rounded text-amber-900 dark:text-amber-200">
                  {chaseRound}
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="font-bold text-[#8c6b3e] dark:text-amber-400">Meta Escape:</span>
                <span className="font-mono font-bold text-[#524332] dark:text-gray-300">
                  {escapeThreshold} pies de ventaja
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={handleAdvanceRound}
                className="px-3 py-1.5 bg-[#451a03] hover:bg-[#2e1002] text-amber-100 text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5 transition-colors"
              >
                <Clock className="w-3.5 h-3.5" />
                Siguiente Ronda
              </button>
              <button
                onClick={handleLoadPartyAsPursuers}
                className="px-3 py-1.5 bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5 transition-colors"
              >
                <Users className="w-3.5 h-3.5" />
                Cargar Héroes
              </button>
              <button
                onClick={handleResetChase}
                className="px-3 py-1.5 border border-[#dfd2be] dark:border-gray-700 hover:bg-[#ede3d1] text-xs font-bold rounded-lg transition-colors flex items-center gap-1"
                title="Reiniciar persecución"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reiniciar
              </button>
            </div>
          </div>

          {/* ESTADO GLOBAL DEL ENCUENTRO */}
          {chaseOutcome !== 'ongoing' && (
            <div className={`p-4 rounded-xl text-center font-bold text-sm shadow-md animate-fadeIn flex items-center justify-center gap-2 ${
              chaseOutcome === 'captured' 
                ? 'bg-emerald-600 text-white' 
                : 'bg-red-600 text-white'
            }`}>
              {chaseOutcome === 'captured' ? (
                <>
                  <CheckCircle className="w-5 h-5" />
                  ¡LA PRESA HA SIDO ALCANZADA Y CAPTURADA!
                </>
              ) : (
                <>
                  <AlertTriangle className="w-5 h-5" />
                  ¡LA PRESA LOGRÓ ESCAPAR CON ÉXITO!
                </>
              )}
            </div>
          )}

          {/* CARRIL VISUAL DE PERSECUCIÓN (TRACK DE DISTANCIA) */}
          <div className="bg-[#fcfbf7] dark:bg-[#1a1c23] border border-[#e2d9c8] dark:border-gray-800 rounded-xl p-6 shadow-sm">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#8c6b3e] dark:text-amber-400 mb-4 flex items-center justify-between">
              <span>Carril de Carrera y Posiciones Relativas (en pies)</span>
              <span className="text-xs font-mono lowercase">
                Distancia a la presa: {quarry.currentPosition - Math.max(...pursuers.map(p => p.currentPosition))} pies
              </span>
            </h3>

            {/* Pista de Carreras */}
            <div className="space-y-4">
              {/* Carril de la Presa */}
              <div className="bg-amber-50/70 dark:bg-amber-950/20 p-3 rounded-xl border border-amber-300 dark:border-amber-800">
                <div className="flex items-center justify-between text-xs font-bold mb-1">
                  <span className="text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                    <Footprints className="w-4 h-4 text-amber-600" />
                    PRESA: {quarry.name}
                  </span>
                  <span className="font-mono text-amber-800 dark:text-amber-300">
                    {quarry.currentPosition} pies
                  </span>
                </div>
                <div className="w-full bg-[#eadecb] dark:bg-gray-700 h-3 rounded-full overflow-hidden relative">
                  <div 
                    className="bg-amber-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, (quarry.currentPosition / (escapeThreshold + 60)) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Carriles de los Perseguidores */}
              {pursuers.map(p => {
                const distanceToQuarry = quarry.currentPosition - p.currentPosition;
                return (
                  <div key={p.id} className="bg-[#f5f3ed] dark:bg-gray-800/60 p-3 rounded-xl border border-[#e2d9c8] dark:border-gray-700">
                    <div className="flex items-center justify-between text-xs font-bold mb-1">
                      <span className="text-[#2d241e] dark:text-gray-100 flex items-center gap-1.5">
                        <Swords className="w-4 h-4 text-[#0284c7]" />
                        {p.name}
                      </span>
                      <span className="font-mono text-xs text-[#6e5d48] dark:text-gray-400">
                        {p.currentPosition} pies (a {distanceToQuarry} pies de la presa)
                      </span>
                    </div>
                    <div className="w-full bg-[#eadecb] dark:bg-gray-700 h-3 rounded-full overflow-hidden relative">
                      <div 
                        className="bg-[#0284c7] h-full rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(100, (p.currentPosition / (escapeThreshold + 60)) * 100)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* COMPLICACIÓN ACTIVA DE LA RONDA */}
          {activeComplication && (
            <div className="p-4 bg-amber-50 dark:bg-amber-950/40 rounded-xl border-2 border-amber-500 shadow-sm animate-fadeIn">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs bg-amber-600 text-white font-bold px-2 py-0.5 rounded">
                      COMPLICACIÓN d20 ({activeComplication.roll})
                    </span>
                    <span className="text-xs font-bold text-amber-900 dark:text-amber-200">
                      Objetivo: {complicationTarget}
                    </span>
                  </div>
                  <h4 className="font-serif font-bold text-base text-[#2d241e] dark:text-gray-100">
                    {activeComplication.title}
                  </h4>
                  <p className="text-xs text-[#524332] dark:text-gray-300 mt-1 leading-relaxed">
                    {activeComplication.description}
                  </p>
                  <div className="mt-2 text-xs text-amber-900 dark:text-amber-300 font-semibold">
                    • <strong>Tirada requerida:</strong> CD {activeComplication.dc} {activeComplication.checkLabel}.
                    <br />
                    • <strong>Penalización si falla:</strong> {activeComplication.penaltyDescription}
                  </div>
                </div>
                <button
                  onClick={() => setActiveComplication(null)}
                  className="text-xs text-[#8c6b3e] hover:text-black dark:text-gray-400 p-1"
                >
                  ✕
                </button>
              </div>
            </div>
          )}

          {/* PANEL DE PARTICIPANTES Y ACCIONES */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Tarjeta de la Presa */}
            <div className="bg-[#fffefb] dark:bg-gray-800 border-2 border-amber-500 rounded-xl p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-950 px-2 py-0.5 rounded">
                    Presa / Fugitivo
                  </span>
                  <h4 className="text-lg font-serif font-bold text-[#2d241e] dark:text-gray-100 mt-0.5">
                    {quarry.name}
                  </h4>
                </div>
                <div className="text-right">
                  <div className="text-xs text-[#786953] dark:text-gray-400 font-semibold">Carreras Libres</div>
                  <div className="text-sm font-bold text-amber-700 dark:text-amber-300">
                    {quarry.dashesUsed} / {quarry.freeDashesTotal}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-[#524332] dark:text-gray-300 py-1 border-y border-[#ede3d1] dark:border-gray-700">
                <span>Velocidad: <strong>{quarry.speed} pies</strong></span>
                <span>Mod CON: <strong>{quarry.conMod >= 0 ? `+${quarry.conMod}` : quarry.conMod}</strong></span>
                <span>Agotamiento: <strong>{quarry.exhaustionLevel}/6</strong></span>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={handleDashQuarry}
                  disabled={chaseOutcome !== 'ongoing'}
                  className="flex-1 py-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white text-xs font-bold rounded-lg shadow-sm flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Footprints className="w-4 h-4" />
                  Carrera ({quarry.speed} pies)
                </button>
                <button
                  onClick={() => handleRollComplicationFor(quarry.name)}
                  className="px-3 py-2 bg-[#451a03] hover:bg-[#2e1002] text-amber-100 text-xs font-bold rounded-lg shadow-sm flex items-center gap-1 transition-colors"
                  title="Tirar obstáculo para la presa"
                >
                  <Dices className="w-3.5 h-3.5" />
                  Obstáculo (d20)
                </button>
              </div>
            </div>

            {/* Perseguidores */}
            <div className="space-y-3">
              <h4 className="font-serif font-bold text-base text-[#2d241e] dark:text-gray-100 flex items-center gap-2">
                <Swords className="w-4 h-4 text-[#0284c7]" />
                Perseguidores ({pursuers.length})
              </h4>

              <div className="space-y-3">
                {pursuers.map(p => (
                  <div key={p.id} className="bg-[#fffefb] dark:bg-gray-800 border border-[#e2d9c8] dark:border-gray-700 rounded-xl p-4 shadow-sm space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="font-bold text-sm text-[#2d241e] dark:text-gray-100">
                          {p.name}
                        </h5>
                        <span className="text-[11px] text-[#786953] dark:text-gray-400">
                          Posición: {p.currentPosition} pies • Carreras: {p.dashesUsed}/{p.freeDashesTotal}
                        </span>
                      </div>
                      <div className="text-right text-xs">
                        <span className="text-[#6e5d48] dark:text-gray-300">
                          Agotamiento: <strong>{p.exhaustionLevel}/6</strong>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => handleDashPursuer(p.id)}
                        disabled={chaseOutcome !== 'ongoing'}
                        className="flex-1 py-1.5 bg-[#0284c7] hover:bg-[#0369a1] disabled:opacity-50 text-white text-xs font-bold rounded-lg shadow-sm flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Footprints className="w-3.5 h-3.5" />
                        Acción de Carrera (+{p.speed} pies)
                      </button>
                      <button
                        onClick={() => handleRollComplicationFor(p.name)}
                        className="px-3 py-1.5 border border-[#dfd2be] dark:border-gray-700 hover:bg-[#ede3d1] text-xs font-bold rounded-lg transition-colors flex items-center gap-1"
                        title="Tirar obstáculo para este perseguidor"
                      >
                        <Dices className="w-3.5 h-3.5" />
                        Obstáculo
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* HISTORIAL DE EVENTOS DE LA PERSECUCIÓN */}
          <div className="bg-[#f5ede0] dark:bg-gray-900/50 p-4 rounded-xl border border-[#ded1be] dark:border-gray-800">
            <span className="text-xs font-bold uppercase tracking-wider text-[#8c6b3e] dark:text-amber-400 flex items-center gap-1.5 mb-2">
              <Activity className="w-4 h-4" />
              Registro de Eventos de la Persecución
            </span>
            <div className="space-y-1 max-h-40 overflow-y-auto font-mono text-xs text-[#524332] dark:text-gray-300">
              {chaseLogs.map((log, idx) => (
                <div key={idx} className="leading-tight">
                  • {log}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* PESTAÑA 2: GUARIDAS DE DRAGÓN & ACCIONES EN INICIATIVA 20           */}
      {/* ------------------------------------------------------------------- */}
      {activeMainTab === 'lairs' && (
        <div className="space-y-6">
          {/* SELECTOR DE GUARIDA DRAGONTINA */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {DRAGON_LAIRS_DATA.map(lair => {
              const isSelected = selectedLair.id === lair.id;
              return (
                <button
                  key={lair.id}
                  onClick={() => {
                    setSelectedLair(lair);
                    setLastLairActionResults(null);
                  }}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'border-2 border-[#b45309] bg-[#fffefb] dark:bg-gray-800 shadow-md ring-2 ring-amber-500/20'
                      : 'border-[#e2d9c8] dark:border-gray-700 bg-[#f9f6f0] dark:bg-gray-800/60 hover:border-amber-400'
                  }`}
                >
                  <div 
                    className="w-3 h-3 rounded-full mb-1.5"
                    style={{ backgroundColor: lair.themeColor }}
                  />
                  <div className="font-bold text-xs text-[#2d241e] dark:text-gray-100 truncate">
                    {lair.dragonSpecies}
                  </div>
                  <div className="text-[10px] text-[#786953] dark:text-gray-400 truncate">
                    {lair.biome}
                  </div>
                </button>
              );
            })}
          </div>

          {/* FICHA DETALLADA DE LA GUARIDA SELECCIONADA */}
          <div className="bg-[#fffefb] dark:bg-[#1a1c23] border-2 border-[#d4af37] dark:border-amber-600 rounded-xl p-6 shadow-md space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#e2d9c8] dark:border-gray-800">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span 
                    className="text-xs font-bold px-2.5 py-0.5 rounded-full text-white"
                    style={{ backgroundColor: selectedLair.themeColor }}
                  >
                    {selectedLair.dragonSpecies}
                  </span>
                  <span className="text-xs bg-[#ede3d1] dark:bg-gray-800 text-[#6e5d48] dark:text-gray-300 font-semibold px-2 py-0.5 rounded">
                    CD de Salvación: {selectedLair.dc}
                  </span>
                </div>
                <h3 className="text-2xl font-serif font-bold text-[#2d241e] dark:text-gray-100">
                  {selectedLair.lairName}
                </h3>
                <p className="text-xs text-[#786953] dark:text-gray-400 italic">
                  Dragón: {selectedLair.dragonName} • Bioma: {selectedLair.biome}
                </p>
              </div>

              <div className="bg-amber-100/80 dark:bg-amber-950/60 px-4 py-2.5 rounded-xl border border-amber-300 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200">
                <span className="font-bold block flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  Regla de Iniciativa 20:
                </span>
                El dragón ejecuta 1 acción de guarida en cuenta 20 (perdiendo empates).
              </div>
            </div>

            {/* ACCIONES DE GUARIDA EN INICIATIVA 20 */}
            <div>
              <h4 className="font-serif font-bold text-base text-[#2d241e] dark:text-gray-100 mb-3 flex items-center gap-2">
                <Flame className="w-5 h-5 text-[#b45309]" />
                Acciones de Guarida Disponibles (Iniciativa 20)
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {selectedLair.actions.map((act, idx) => (
                  <div key={idx} className="bg-[#fbf9f4] dark:bg-gray-800/60 p-4 rounded-xl border border-[#e8dfcf] dark:border-gray-700 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h5 className="font-bold text-sm text-[#2d241e] dark:text-gray-100">
                          {act.title}
                        </h5>
                        <span className="text-[10px] bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 font-bold px-2 py-0.5 rounded">
                          CD {act.dc} {act.saveAbilityLabel}
                        </span>
                      </div>
                      <p className="text-xs text-[#524332] dark:text-gray-300 leading-relaxed">
                        {act.description}
                      </p>
                    </div>

                    <button
                      onClick={() => handleTriggerLairAction(act)}
                      className="w-full py-2 bg-[#b45309] hover:bg-[#92400e] text-white text-xs font-bold rounded-lg shadow transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      Disparar contra el Grupo
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* RESULTADOS DE LA ÚLTIMA ACCIÓN DE GUARIDA */}
            {lastLairActionResults && (
              <div className="bg-[#fffefb] dark:bg-gray-800 p-4 rounded-xl border-2 border-amber-500 shadow-sm animate-fadeIn space-y-2">
                <div className="font-bold text-xs uppercase tracking-wider text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                  <Activity className="w-4 h-4" />
                  Resolución de Acción de Guarida en Iniciativa 20:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {lastLairActionResults.map((r, i) => (
                    <div 
                      key={i} 
                      className={`p-2.5 rounded-lg border text-xs font-mono ${
                        r.success 
                          ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 text-emerald-900 dark:text-emerald-200' 
                          : 'bg-red-50 dark:bg-red-950/30 border-red-300 text-red-900 dark:text-red-200'
                      }`}
                    >
                      {r.message}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* EFECTOS REGIONALES ACTIVOS (6 MILLAS) */}
            <div className="p-4 bg-[#f5ede0] dark:bg-gray-900/40 rounded-xl border border-[#ded1be] dark:border-gray-800 text-xs">
              <span className="font-bold uppercase tracking-wider text-[#8c6b3e] dark:text-amber-400 block mb-2 flex items-center gap-1.5">
                <Compass className="w-4 h-4" />
                Efectos Regionales Activos (Radio de 6 millas / 10 km):
              </span>
              <ul className="space-y-1.5 text-[#524332] dark:text-gray-300">
                {selectedLair.regionalEffects.map((eff, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-amber-600 font-bold">•</span>
                    <span>{eff}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
