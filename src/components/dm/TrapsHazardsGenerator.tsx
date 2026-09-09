import React, { useState } from 'react';
import {
  Character,
  ComplexTrapDef,
  ComplexTrapCountermeasure,
  TrapTier,
  TrapLethality
} from '../../types/dnd';
import {
  COMPLEX_TRAPS_CATALOG,
  DMG_TRAP_BENCHMARKS
} from '../../data/complexTrapsData';
import {
  applyCountermeasureAttempt,
  damageTrapComponent,
  isTrapFullyDisarmed,
  calculateEscalatedDamage,
  resolveActiveElementAttack,
  resolveActiveElementSave
} from '../../utils/trapMath';
import { rollDice, getAbilityModifier } from '../../utils/dndMath';
import {
  AlertTriangle,
  ShieldAlert,
  Sparkles,
  RefreshCw,
  Skull,
  Shield,
  Zap,
  Flame,
  Wind,
  CheckCircle2,
  XCircle,
  Dices,
  BookOpen,
  Settings,
  Swords,
  Play,
  RotateCcw,
  Layers,
  ChevronRight,
  Info
} from 'lucide-react';

interface TrapsHazardsGeneratorProps {
  characters?: Character[];
  activeCharacter?: Character;
}

interface DungeonRoom {
  id: string;
  name: string;
  lighting: string;
  atmosphere: string;
  feature: string;
  trapOrHazard?: {
    name: string;
    trigger: string;
    detectDc: number;
    disarmDc: number;
    effect: string;
    damageRoll: string;
  };
}

const ROOM_NAMES = [
  'Cámara del Juicio Olvidado',
  'Cripta de los Caballeros de Plata',
  'Laboratorio Alquímico en Ruinas',
  'Sala del Trono de Basalto',
  'Mausoleo de la Reina de Escarcha',
  'Galería de los Susurros Malditos',
  'Cisterna Subterránea con Aguas Negras',
  'Armería Saqueada del Antiguo Gremio'
];

const LIGHTING = [
  'Oscuridad total (requiere antorchas o visión en la oscuridad)',
  'Luz tenue emitida por hongos luminiscentes azulados en el techo',
  'Luz parpadeante de antorchas eternas en apliques de bronce enano',
  'Oscuridad mágica sobrenatural que desafía la visión mundana'
];

const ATMOSPHERES = [
  'Huele a tierra húmeda y ozono residual de un conjuro antiguo.',
  'Un goteo rítmico resuena en las paredes de piedra tallada con calaveras.',
  'Un frío punzante eriza la piel de los aventureros al cruzar el umbral.',
  'El suelo está cubierto de una fina capa de ceniza y huesos calcinados.',
  'Un eco constante de respiración pesada parece venir del fondo del pasillo.'
];

const SIMPLE_TRAPS = [
  {
    name: 'Foso Oculto con Estacas de Hierro',
    trigger: 'Placa de presión oculta bajo una losa suelta en el centro del pasillo',
    detectDc: 14,
    disarmDc: 13,
    effect: 'El suelo se abre bajo los pies. Salvación de Destreza CD 14. Fallo: Cae 6 metros sobre estacas.',
    damageRoll: '2d6 contundente + 2d8 perforante'
  },
  {
    name: 'Salva de Dardos Venenosos',
    trigger: 'Cable trampa invisible a 15 cm del suelo tensado entre dos gárgolas',
    detectDc: 15,
    disarmDc: 14,
    effect: 'Tres dardos son disparados a quemarropa. +6 al ataque contra la criatura que activó el cable.',
    damageRoll: '1d4 perforante + 2d8 daño por veneno'
  },
  {
    name: 'Glifo Guardián de Fuego Arcano',
    trigger: 'Runas mágicas invisibles que se activan si un ser vivo no pronuncia la palabra secreta',
    detectDc: 16,
    disarmDc: 16,
    effect: 'Explosión ígnea en radio de 6 metros. Salvación de Destreza CD 16 para mitad de daño.',
    damageRoll: '5d8 daño por fuego'
  },
  {
    name: 'Esfera Rodante de Granito Pulido',
    trigger: 'Al abrir el cofre del fondo se libera el contrapeso en el techo inclinado',
    detectDc: 15,
    disarmDc: 15,
    effect: 'Una roca esférica de 2 metros rueda pasillo abajo a 18 m por turno. Requiere correr o superar salvación Fue CD 15.',
    damageRoll: '4d10 daño contundente y queda Tumbado'
  }
];

export const TrapsHazardsGenerator: React.FC<TrapsHazardsGeneratorProps> = ({
  characters = [],
  activeCharacter
}) => {
  // Pestañas del Gestor: Trampas Complejas vs Mazmorras Simples vs Benchmarks DMG
  const [mainView, setMainView] = useState<'complex' | 'simple' | 'benchmarks'>('complex');

  // -------------------------------------------------------------
  // ESTADO: TRAMPAS COMPLEJAS (XANATHAR & DMG 2024)
  // -------------------------------------------------------------
  const [selectedTrapId, setSelectedTrapId] = useState<string>(COMPLEX_TRAPS_CATALOG[0].id);
  const [tierFilter, setTierFilter] = useState<'all' | TrapTier>('all');
  const [currentRound, setCurrentRound] = useState<number>(1);
  const [trapLog, setTrapLog] = useState<string[]>([
    'La trampa ha sido activada por intrusión. Se inicia el encuentro táctico (Iniciativa 20 y 10).'
  ]);

  const activeTrapDef = COMPLEX_TRAPS_CATALOG.find(t => t.id === selectedTrapId) || COMPLEX_TRAPS_CATALOG[0];

  // Estado mutable de las contramedidas de la trampa activa
  const [countermeasures, setCountermeasures] = useState<ComplexTrapCountermeasure[]>(() => {
    return activeTrapDef.countermeasures.map(c => ({ ...c }));
  });

  // Si cambia la trampa seleccionada, reiniciar estado
  const handleSelectTrap = (trapId: string) => {
    setSelectedTrapId(trapId);
    const def = COMPLEX_TRAPS_CATALOG.find(t => t.id === trapId) || COMPLEX_TRAPS_CATALOG[0];
    setCountermeasures(def.countermeasures.map(c => ({ ...c })));
    setCurrentRound(1);
    setTrapLog([`La trampa [${def.name}] ha sido activada. Se inicia el asalto 1.`]);
  };

  const isDisarmed = isTrapFullyDisarmed(countermeasures);

  // Ejecutar el turno de la trampa (Asalto)
  const handleExecuteTrapRound = () => {
    if (isDisarmed) {
      setTrapLog(prev => ['La trampa está completamente neutralizada y no puede actuar.', ...prev]);
      return;
    }

    const newLogs: string[] = [];
    newLogs.push(`--- ASALTO ${currentRound} DE LA TRAMPA ---`);

    // Elementos Dinámicos
    activeTrapDef.dynamicElements.forEach(dyn => {
      if (currentRound >= dyn.triggerRound) {
        newLogs.push(`[Elemento Dinámico]: ${dyn.title} -> ${dyn.escalationEffect}`);
      }
    });

    // Elementos Activos
    activeTrapDef.activeElements.forEach(elem => {
      const escal = calculateEscalatedDamage(elem, currentRound, activeTrapDef.dynamicElements);
      const targetChar = activeCharacter || (characters.length > 0 ? characters[0] : undefined);

      if (elem.attackBonus !== undefined) {
        const targetAc = targetChar ? targetChar.armorClass : 15;
        const attackRes = resolveActiveElementAttack(elem, targetAc, escal.attackBonusMod);
        if (attackRes.isHit) {
          newLogs.push(`[Inic ${elem.initiativeCount}] ${elem.title} ATACA: d20 (${attackRes.d20}) + ${elem.attackBonus + escal.attackBonusMod} = ${attackRes.totalAttack} vs CA ${targetAc}. ¡IMPACTO! Inflige ${attackRes.damageRolled} daño ${elem.damageType}.`);
        } else {
          newLogs.push(`[Inic ${elem.initiativeCount}] ${elem.title} ATACA: d20 (${attackRes.d20}) + ${elem.attackBonus + escal.attackBonusMod} = ${attackRes.totalAttack} vs CA ${targetAc}. Fallo.`);
        }
      } else if (elem.saveDc !== undefined) {
        const saveAbility = elem.saveAbility || 'dex';
        const mod = targetChar ? getAbilityModifier(targetChar.abilities[saveAbility]) : 2;
        const d20 = rollDice('1d20').total;
        const saveTotal = d20 + mod;
        const saveRes = resolveActiveElementSave(elem, saveTotal);
        if (saveRes.passed) {
          newLogs.push(`[Inic ${elem.initiativeCount}] ${elem.title} ÁREA: Salvación ${saveAbility.toUpperCase()} d20 (${d20}) + ${mod} = ${saveTotal} vs CD ${elem.saveDc}. Éxito (mitad de daño: ${saveRes.damageTaken}/${saveRes.fullDamage} ${elem.damageType}).`);
        } else {
          newLogs.push(`[Inic ${elem.initiativeCount}] ${elem.title} ÁREA: Salvación ${saveAbility.toUpperCase()} d20 (${d20}) + ${mod} = ${saveTotal} vs CD ${elem.saveDc}. ¡FALLO! Daño completo: ${saveRes.damageTaken} ${elem.damageType}.`);
        }
      }
    });

    setTrapLog(prev => [...newLogs, ...prev]);
  };

  // Avanzar Asalto
  const handleAdvanceRound = () => {
    const nextRound = currentRound + 1;
    setCurrentRound(nextRound);
    setTrapLog(prev => [`Avanzado al Asalto ${nextRound}.`, ...prev]);
  };

  // Reiniciar Trampa
  const handleResetTrap = () => {
    setCountermeasures(activeTrapDef.countermeasures.map(c => ({ ...c })));
    setCurrentRound(1);
    setTrapLog([`La trampa [${activeTrapDef.name}] ha sido reiniciada.`]);
  };

  // Intentar contramedida (tirada de habilidad)
  const handleAttemptCountermeasure = (cmId: string) => {
    const targetChar = activeCharacter || (characters.length > 0 ? characters[0] : undefined);
    const cm = countermeasures.find(c => c.id === cmId);
    if (!cm) return;

    // Bono de habilidad aproximado (Dex/Int + Prof = +5 o +7)
    const bonus = targetChar ? getAbilityModifier(targetChar.abilities.dex) + targetChar.proficiencyBonus : 5;
    const d20 = rollDice('1d20').total;
    const total = d20 + bonus;

    const outcome = applyCountermeasureAttempt(cm, total);

    const updated = countermeasures.map(c => {
      if (c.id === cmId) {
        return {
          ...c,
          currentSuccesses: outcome.newSuccesses,
          isDisarmed: outcome.isNowDisarmed
        };
      }
      return c;
    });

    setCountermeasures(updated);
    setTrapLog(prev => [`[Contramedida: ${cm.title}]: ${outcome.message} (Tirador: ${targetChar?.name || 'Héroe'}, d20: ${d20} + ${bonus} = ${total})`, ...prev]);
  };

  // Atacar físicamente un componente de la trampa
  const handleDamageComponent = (cmId: string) => {
    const cm = countermeasures.find(c => c.id === cmId);
    if (!cm) return;

    const damage = rollDice('2d10 + 4').total;
    const outcome = damageTrapComponent(cm, damage);

    const updated = countermeasures.map(c => {
      if (c.id === cmId) {
        return {
          ...c,
          currentHp: outcome.newHp,
          isDisarmed: outcome.isNowDestroyed ? true : c.isDisarmed
        };
      }
      return c;
    });

    setCountermeasures(updated);
    setTrapLog(prev => [`[Ataque a Componente]: ${outcome.message}`, ...prev]);
  };

  // -------------------------------------------------------------
  // ESTADO: GENERADOR DE MAZMORRAS Y TRAMPAS SIMPLES
  // -------------------------------------------------------------
  const [currentRoom, setCurrentRoom] = useState<DungeonRoom | null>(null);

  const handleGenerateRoom = () => {
    const name = ROOM_NAMES[Math.floor(Math.random() * ROOM_NAMES.length)];
    const lighting = LIGHTING[Math.floor(Math.random() * LIGHTING.length)];
    const atmosphere = ATMOSPHERES[Math.floor(Math.random() * ATMOSPHERES.length)];
    const hasTrap = Math.random() > 0.25;
    const trap = hasTrap ? SIMPLE_TRAPS[Math.floor(Math.random() * SIMPLE_TRAPS.length)] : undefined;

    setCurrentRoom({
      id: 'room_' + Date.now(),
      name,
      lighting,
      atmosphere,
      feature: 'En el centro de la sala descansa un sarcófago tallado con bajorrelieves de una batalla celestial.',
      trapOrHazard: trap
    });
  };

  return (
    <div className="space-y-6">
      {/* HEADER PRINCIPAL */}
      <div className="bg-[#fcfbf7] dark:bg-[#1a1c23] border border-[#e2d9c8] dark:border-gray-800 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-6 h-6 text-[#b45309]" />
              <h2 className="text-2xl font-serif font-bold text-[#2d241e] dark:text-gray-100">
                Trampas Complejas & Peligros de Mazmorra
              </h2>
            </div>
            <p className="text-sm text-[#786953] dark:text-gray-400 mt-1">
              Sistemas tácticos de la <em>Guía de Xanathar para Todo</em> y la <em>Guía del Dungeon Master 2024</em>.
              Encuentros de combate con iniciativa (20 y 10), elementos dinámicos escalables y contramedidas multifase.
            </p>
          </div>

          {/* Selector de Vistas */}
          <div className="flex items-center bg-[#ede3d1] dark:bg-gray-800 p-1 rounded-lg text-xs font-bold">
            <button
              onClick={() => setMainView('complex')}
              className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
                mainView === 'complex'
                  ? 'bg-[#b45309] text-white shadow-sm'
                  : 'text-[#6e5d48] dark:text-gray-300 hover:text-black dark:hover:text-white'
              }`}
            >
              <Settings className="w-4 h-4" />
              Trampas Complejas
            </button>
            <button
              onClick={() => setMainView('simple')}
              className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
                mainView === 'simple'
                  ? 'bg-[#b45309] text-white shadow-sm'
                  : 'text-[#6e5d48] dark:text-gray-300 hover:text-black dark:hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4" />
              Generador de Salas
            </button>
            <button
              onClick={() => setMainView('benchmarks')}
              className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
                mainView === 'benchmarks'
                  ? 'bg-[#b45309] text-white shadow-sm'
                  : 'text-[#6e5d48] dark:text-gray-300 hover:text-black dark:hover:text-white'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              Tablas DMG 2024
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* VISTA 1: TRAMPAS COMPLEJAS (XANATHAR & DMG 2024)          */}
      {/* ========================================================= */}
      {mainView === 'complex' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Columna Izquierda: Catálogo y Filtros */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-[#fcfbf7] dark:bg-[#1a1c23] border border-[#e2d9c8] dark:border-gray-800 rounded-xl p-4 shadow-sm">
              <h3 className="font-serif font-bold text-[#2d241e] dark:text-gray-100 flex items-center gap-2 mb-3">
                <Skull className="w-4 h-4 text-[#b45309]" />
                Trampas Complejas Canónicas
              </h3>

              {/* Filtro por Rango */}
              <div className="flex gap-1 mb-3 text-xs">
                {(['all', 'tier1', 'tier2', 'tier3', 'tier4'] as const).map(t => (
                  <button
                    key={t}
                    onClick={() => setTierFilter(t)}
                    className={`flex-1 py-1 rounded text-center transition-colors ${
                      tierFilter === t
                        ? 'bg-[#b45309] text-white font-bold'
                        : 'bg-[#ede3d1] dark:bg-gray-800 text-[#6e5d48] dark:text-gray-300'
                    }`}
                  >
                    {t === 'all' ? 'Todas' : t === 'tier1' ? '1-4' : t === 'tier2' ? '5-10' : t === 'tier3' ? '11-16' : '17-20'}
                  </button>
                ))}
              </div>

              {/* Lista de Trampas */}
              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                {COMPLEX_TRAPS_CATALOG.filter(t => tierFilter === 'all' || t.tier === tierFilter).map(trap => (
                  <button
                    key={trap.id}
                    onClick={() => handleSelectTrap(trap.id)}
                    className={`w-full text-left p-3 rounded-lg border transition-all ${
                      selectedTrapId === trap.id
                        ? 'border-[#b45309] bg-[#f5ede0] dark:bg-[#2a2219] shadow-sm'
                        : 'border-[#e2d9c8] dark:border-gray-800 hover:bg-[#faf7f0] dark:hover:bg-gray-800/60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-[#2d241e] dark:text-gray-100 line-clamp-1">{trap.name}</span>
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
                          trap.lethality === 'deadly'
                            ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300'
                            : trap.lethality === 'dangerous'
                            ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
                            : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                        }`}
                      >
                        {trap.lethalityLabel}
                      </span>
                    </div>
                    <div className="text-[11px] text-[#786953] dark:text-gray-400 mt-1">
                      {trap.tierLabel}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Columna Derecha: Panel Táctico de Combate */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-[#fcfbf7] dark:bg-[#1a1c23] border border-[#e2d9c8] dark:border-gray-800 rounded-xl p-6 shadow-sm">
              {/* Header de la Trampa Activa */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#e2d9c8] dark:border-gray-800 pb-4 mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-serif font-bold text-[#2d241e] dark:text-gray-100">
                      {activeTrapDef.name}
                    </h3>
                    {isDisarmed && (
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        ¡NEUTRALIZADA!
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#786953] dark:text-gray-400 mt-1">
                    <span className="font-semibold text-[#b45309]">{activeTrapDef.tierLabel}</span>
                    <span>•</span>
                    <span className="italic">{activeTrapDef.sourceBook}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="bg-[#ede3d1] dark:bg-gray-800 px-3 py-1.5 rounded-lg text-center">
                    <span className="text-[10px] uppercase font-bold text-[#786953] dark:text-gray-400 block">Asalto</span>
                    <span className="font-mono font-bold text-base text-[#b45309]">{currentRound}</span>
                  </div>
                </div>
              </div>

              {/* Descripción y Disparador */}
              <div className="mb-4 text-xs text-[#5c4e3e] dark:text-gray-300 leading-relaxed bg-[#faf7f0] dark:bg-gray-800/60 p-3 rounded-lg border border-[#e8dfd1] dark:border-gray-700/60">
                <div className="mb-1">
                  <strong className="text-[#b45309]">Disparador: </strong>
                  {activeTrapDef.trigger}
                </div>
                <div>
                  <strong className="text-[#b45309]">Mecánica: </strong>
                  {activeTrapDef.description}
                </div>
              </div>

              {/* Botones de Control de Asalto */}
              <div className="grid grid-cols-3 gap-2 mb-6">
                <button
                  onClick={handleExecuteTrapRound}
                  disabled={isDisarmed}
                  className={`py-2.5 px-3 rounded-lg font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-1.5 ${
                    isDisarmed
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-[#b45309] hover:bg-[#92400e] text-white'
                  }`}
                >
                  <Play className="w-4 h-4" />
                  Turno Trampa (Inic 20 & 10)
                </button>

                <button
                  onClick={handleAdvanceRound}
                  className="py-2.5 px-3 rounded-lg bg-stone-700 hover:bg-stone-800 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-1.5"
                >
                  <ChevronRight className="w-4 h-4" />
                  Avanzar Asalto (+1)
                </button>

                <button
                  onClick={handleResetTrap}
                  className="py-2.5 px-3 rounded-lg bg-[#e8decb] hover:bg-[#dfd2be] dark:bg-gray-800 dark:hover:bg-gray-700 text-[#2d241e] dark:text-gray-200 font-bold text-xs transition-all flex items-center justify-center gap-1.5"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reiniciar
                </button>
              </div>

              {/* Elementos Activos y Dinámicos */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#786953] dark:text-gray-400">
                    Elementos Activos en Combate
                  </h4>
                  {activeTrapDef.activeElements.map(el => (
                    <div
                      key={el.id}
                      className="p-3 rounded-lg bg-[#faf7f0] dark:bg-gray-800/60 border border-[#e8dfd1] dark:border-gray-700/60 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#2d241e] dark:text-gray-100">{el.title}</span>
                        <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-bold">
                          Inic {el.initiativeCount}
                        </span>
                      </div>
                      <div className="text-[#5c4e3e] dark:text-gray-300 text-[11px]">{el.description}</div>
                      <div className="font-mono font-bold text-[#b45309] text-[11px] pt-1">
                        {el.attackBonus !== undefined && `Ataque: +${el.attackBonus} `}
                        {el.saveDc !== undefined && `Salvación: CD ${el.saveDc} ${el.saveAbility?.toUpperCase()} `}
                        • Daño: {el.damageDice} ({el.damageType})
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#786953] dark:text-gray-400">
                    Elementos Dinámicos Escalables
                  </h4>
                  {activeTrapDef.dynamicElements.map((dyn, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-lg border text-xs space-y-1 ${
                        currentRound >= dyn.triggerRound
                          ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200'
                          : 'bg-[#faf7f0] dark:bg-gray-800/60 border-[#e8dfd1] dark:border-gray-700/60 text-[#5c4e3e] dark:text-gray-400'
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold">
                        <span>{dyn.title}</span>
                        <span className="text-[10px] uppercase">
                          {currentRound >= dyn.triggerRound ? '¡ACTIVO!' : `Desde Asalto ${dyn.triggerRound}`}
                        </span>
                      </div>
                      <div className="text-[11px]">{dyn.description}</div>
                      <div className="font-semibold text-[11px] italic pt-1">{dyn.escalationEffect}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contramedidas Interactivas para Pícaros / Artífices */}
              <div className="space-y-3 mb-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#786953] dark:text-gray-400">
                  Contramedidas & Neutralización de Componentes
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {countermeasures.map(cm => (
                    <div
                      key={cm.id}
                      className={`p-4 rounded-lg border transition-all text-xs space-y-2 ${
                        cm.isDisarmed
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800'
                          : 'bg-[#faf7f0] dark:bg-gray-800/60 border-[#e8dfd1] dark:border-gray-700/60'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-[#2d241e] dark:text-gray-100 flex items-center gap-1.5">
                          {cm.isDisarmed ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <Settings className="w-4 h-4 text-[#b45309]" />
                          )}
                          {cm.title}
                        </span>
                        <span className="font-mono text-xs font-bold text-[#b45309]">
                          CD {cm.dc} ({cm.skillOrTool})
                        </span>
                      </div>

                      <p className="text-[11px] text-[#5c4e3e] dark:text-gray-300">
                        {cm.description}
                      </p>

                      {/* Progreso de Éxitos Acumulativos */}
                      <div>
                        <div className="flex justify-between text-[11px] font-bold mb-1">
                          <span>Éxitos Acumulados</span>
                          <span>{cm.currentSuccesses} / {cm.requiredSuccesses}</span>
                        </div>
                        <div className="w-full bg-[#e8decb] dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-emerald-600 h-full transition-all"
                            style={{ width: `${Math.min(100, (cm.currentSuccesses / cm.requiredSuccesses) * 100)}%` }}
                          />
                        </div>
                      </div>

                      {/* Puntos de Golpe si es destruible físicamente */}
                      {cm.maxHp && (
                        <div>
                          <div className="flex justify-between text-[10px] font-bold mb-1">
                            <span>Estructura (CA {cm.componentAc})</span>
                            <span>{cm.currentHp ?? cm.maxHp} / {cm.maxHp} PG</span>
                          </div>
                          <div className="w-full bg-[#e8decb] dark:bg-gray-700 h-1.5 rounded-full overflow-hidden">
                            <div
                              className="bg-amber-600 h-full transition-all"
                              style={{ width: `${Math.min(100, ((cm.currentHp ?? cm.maxHp) / cm.maxHp) * 100)}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Botones de Acción */}
                      {!cm.isDisarmed && (
                        <div className="flex gap-2 pt-1">
                          <button
                            onClick={() => handleAttemptCountermeasure(cm.id)}
                            className="flex-1 py-1.5 px-2.5 rounded bg-[#b45309] hover:bg-[#92400e] text-white font-bold text-[11px] flex items-center justify-center gap-1 shadow-sm"
                          >
                            <Dices className="w-3.5 h-3.5" />
                            Intentar Tirada (d20)
                          </button>
                          {cm.maxHp && (
                            <button
                              onClick={() => handleDamageComponent(cm.id)}
                              className="py-1.5 px-2.5 rounded bg-rose-700 hover:bg-rose-800 text-white font-bold text-[11px] flex items-center justify-center gap-1 shadow-sm"
                            >
                              <Swords className="w-3.5 h-3.5" />
                              Atacar Estructura
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Registro de Combate de la Trampa */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#786953] dark:text-gray-400 mb-2">
                  Registro de Combate de la Trampa
                </h4>
                <div className="bg-[#faf7f0] dark:bg-gray-800/60 border border-[#e8dfd1] dark:border-gray-700/60 rounded-lg p-3 max-h-[180px] overflow-y-auto space-y-1.5 text-xs font-mono text-[#4a3f33] dark:text-gray-300">
                  {trapLog.map((log, idx) => (
                    <div key={idx} className="border-b border-stone-200 dark:border-gray-700/40 pb-1">
                      {log}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* VISTA 2: GENERADOR DE SALAS & TRAMPAS SIMPLES            */}
      {/* ========================================================= */}
      {mainView === 'simple' && (
        <div className="bg-[#fcfbf7] dark:bg-[#1a1c23] border border-[#e2d9c8] dark:border-gray-800 rounded-xl p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e2d9c8] dark:border-gray-800 pb-4">
            <div>
              <h3 className="text-xl font-serif font-bold text-[#2d241e] dark:text-gray-100 flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#b45309]" />
                Generador de Cámaras & Peligros Ambientales
              </h3>
              <p className="text-xs text-[#786953] dark:text-gray-400 mt-1">
                Genera al instante salas de mazmorra con iluminación, atmósfera inmersiva y trampas simples (fosos, dardos, glifos).
              </p>
            </div>
            <button
              onClick={handleGenerateRoom}
              className="py-2.5 px-4 rounded-lg bg-[#b45309] hover:bg-[#92400e] text-white font-bold text-xs shadow-sm transition-all flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Generar Nueva Sala
            </button>
          </div>

          {currentRoom ? (
            <div className="p-6 rounded-xl bg-[#faf7f0] dark:bg-gray-800/60 border border-[#e8dfd1] dark:border-gray-700/60 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-serif font-bold text-xl text-[#2d241e] dark:text-gray-100">
                  {currentRoom.name}
                </h4>
                {currentRoom.trapOrHazard ? (
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 font-bold flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Trampa Activa
                  </span>
                ) : (
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Sala Despejada
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-3 rounded bg-white dark:bg-gray-800 border border-[#e2d9c8] dark:border-gray-700 space-y-1">
                  <span className="font-bold text-[#b45309] block">Iluminación</span>
                  <span className="text-[#5c4e3e] dark:text-gray-300">{currentRoom.lighting}</span>
                </div>
                <div className="p-3 rounded bg-white dark:bg-gray-800 border border-[#e2d9c8] dark:border-gray-700 space-y-1">
                  <span className="font-bold text-[#b45309] block">Atmósfera & Olores</span>
                  <span className="text-[#5c4e3e] dark:text-gray-300">{currentRoom.atmosphere}</span>
                </div>
              </div>

              {currentRoom.trapOrHazard && (
                <div className="p-4 rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 space-y-2 text-xs text-rose-900 dark:text-rose-200">
                  <div className="flex items-center justify-between font-bold">
                    <span className="text-sm font-serif">{currentRoom.trapOrHazard.name}</span>
                    <span className="font-mono">
                      Detectar: CD {currentRoom.trapOrHazard.detectDc} • Desarmar: CD {currentRoom.trapOrHazard.disarmDc}
                    </span>
                  </div>
                  <div>
                    <strong>Disparador: </strong> {currentRoom.trapOrHazard.trigger}
                  </div>
                  <div>
                    <strong>Efecto: </strong> {currentRoom.trapOrHazard.effect}
                  </div>
                  <div className="font-mono font-bold text-rose-700 dark:text-rose-400">
                    Daño: {currentRoom.trapOrHazard.damageRoll}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 text-sm text-[#786953] dark:text-gray-400">
              Haz clic en "Generar Nueva Sala" para explorar pasillos y criptas con trampas aleatorias.
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* VISTA 3: TABLAS OFICIALES DE BENCHMARKS DMG 2024          */}
      {/* ========================================================= */}
      {mainView === 'benchmarks' && (
        <div className="bg-[#fcfbf7] dark:bg-[#1a1c23] border border-[#e2d9c8] dark:border-gray-800 rounded-xl p-6 shadow-sm space-y-4">
          <div>
            <h3 className="text-xl font-serif font-bold text-[#2d241e] dark:text-gray-100 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#b45309]" />
              Tablas Oficiales de Severidad de Trampas (DMG 2024)
            </h3>
            <p className="text-xs text-[#786953] dark:text-gray-400 mt-1">
              Estándares oficiales de la <em>Guía del Dungeon Master 2024</em> para calcular CDs de salvación, bonificadores de ataque y dados de daño según el nivel del grupo.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border border-[#e2d9c8] dark:border-gray-800 rounded-lg">
              <thead className="bg-[#ede3d1] dark:bg-gray-800 text-[#5c4e3e] dark:text-gray-200 font-bold uppercase text-[10px]">
                <tr>
                  <th className="p-3">Rango de Nivel</th>
                  <th className="p-3">Letalidad</th>
                  <th className="p-3">CD de Salvación</th>
                  <th className="p-3">Bonif. de Ataque</th>
                  <th className="p-3">Dados de Daño</th>
                  <th className="p-3">Daño Promedio</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e2d9c8] dark:divide-gray-800">
                {DMG_TRAP_BENCHMARKS.map((b, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-[#faf7f0] dark:hover:bg-gray-800/50 text-[#3d3228] dark:text-gray-300"
                  >
                    <td className="p-3 font-semibold">
                      {b.tier === 'tier1' ? 'Rango 1 (Niveles 1–4)' : b.tier === 'tier2' ? 'Rango 2 (Niveles 5–10)' : b.tier === 'tier3' ? 'Rango 3 (Niveles 11–16)' : 'Rango 4 (Niveles 17–20)'}
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded font-bold uppercase text-[10px] ${
                          b.lethality === 'deadly'
                            ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300'
                            : b.lethality === 'dangerous'
                            ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
                            : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                        }`}
                      >
                        {b.lethality === 'deadly' ? 'Letal' : b.lethality === 'dangerous' ? 'Peligrosa' : 'Moderada'}
                      </span>
                    </td>
                    <td className="p-3 font-mono font-bold text-[#b45309]">CD {b.saveDc}</td>
                    <td className="p-3 font-mono">+{b.attackBonus}</td>
                    <td className="p-3 font-mono font-bold">{b.damageDice}</td>
                    <td className="p-3 font-mono">{b.averageDamage}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
