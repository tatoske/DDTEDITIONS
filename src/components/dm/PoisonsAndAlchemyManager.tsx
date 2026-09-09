import React, { useState } from 'react';
import {
  Character,
  PoisonDef,
  DiseaseDef,
  HerbIngredientDef,
  AlchemicalRecipeDef,
  PoisonDeliveryType
} from '../../types/dnd';
import {
  POISONS_CATALOG,
  DISEASES_CATALOG,
  HERBS_CATALOG,
  ALCHEMICAL_RECIPES
} from '../../data/poisonsAndDiseasesData';
import {
  resolvePoisonExposure,
  simulateHarvestingAttempt,
  resolveDailyDiseaseSave,
  calculateCraftingProgress
} from '../../utils/poisonMath';
import { getAbilityModifier, rollDice } from '../../utils/dndMath';
import {
  Skull,
  FlaskConical,
  HeartPulse,
  Leaf,
  ShieldAlert,
  AlertTriangle,
  Dices,
  CheckCircle2,
  XCircle,
  Plus,
  Coins,
  Clock,
  Sparkles,
  Droplets,
  PackageCheck,
  Search,
  BookOpen
} from 'lucide-react';

interface PoisonsAndAlchemyManagerProps {
  characters: Character[];
  activeCharacter?: Character;
  onUpdateCharacter: (character: Character) => void;
  onShowNotification?: (message: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
}

export const PoisonsAndAlchemyManager: React.FC<PoisonsAndAlchemyManagerProps> = ({
  characters,
  activeCharacter,
  onUpdateCharacter,
  onShowNotification
}) => {
  // Pestañas Principales: Venenos, Enfermedades, Alquimia/Herboristería
  const [activeTab, setActiveTab] = useState<'poisons' | 'diseases' | 'alchemy'>('poisons');

  // -------------------------------------------------------------
  // ESTADO 1: VENENOS & EXTRACCIÓN
  // -------------------------------------------------------------
  const [selectedPoisonId, setSelectedPoisonId] = useState<string>(POISONS_CATALOG[0].id);
  const [deliveryFilter, setDeliveryFilter] = useState<'all' | PoisonDeliveryType>('all');
  const [targetCharId, setTargetCharId] = useState<string>(activeCharacter?.id || (characters[0]?.id || ''));
  const [hasAntitoxin, setHasAntitoxin] = useState<boolean>(false);
  const [poisonSimLog, setPoisonSimLog] = useState<string | null>(null);

  const activePoison = POISONS_CATALOG.find(p => p.id === selectedPoisonId) || POISONS_CATALOG[0];

  // Extracción de Veneno de Criaturas
  const [harvestCreature, setHarvestCreature] = useState<string>('wyvern');
  const [harvestLog, setHarvestLog] = useState<string | null>(null);

  // Probar exposición al veneno
  const handleTestPoisonExposure = () => {
    const targetChar = characters.find(c => c.id === targetCharId) || activeCharacter || characters[0];
    if (!targetChar) return;

    const conMod = getAbilityModifier(targetChar.abilities.con);
    const d20_1 = rollDice('1d20').total;
    const d20_2 = rollDice('1d20').total;
    const d20 = hasAntitoxin ? Math.max(d20_1, d20_2) : d20_1;
    const total = d20 + conMod;

    const outcome = resolvePoisonExposure(activePoison, total, hasAntitoxin);
    const logText = `${targetChar.name}: ${outcome.narrativeText}${hasAntitoxin ? ' (Con ventaja por Antitoxina).' : ''}`;
    setPoisonSimLog(logText);

    if (onShowNotification) {
      onShowNotification(logText, outcome.passed ? 'success' : 'error');
    }
  };

  // Intentar extraer veneno de criatura
  const handleAttemptHarvest = () => {
    const targetChar = characters.find(c => c.id === targetCharId) || activeCharacter || characters[0];
    if (!targetChar) return;

    const natureMod = getAbilityModifier(targetChar.abilities.int);
    const profBonus = targetChar.proficiencyBonus || 2;
    const d20 = rollDice('1d20').total;
    const total = d20 + natureMod + profBonus;

    const outcome = simulateHarvestingAttempt(total, true);
    setHarvestLog(`${targetChar.name}: ${outcome.message}`);

    // Si tuvo éxito, añadir dosis al inventario
    if (outcome.success) {
      const updatedInventory = [
        ...(targetChar.inventory || []),
        {
          id: 'harvested_' + Date.now(),
          name: `Dosis de ${activePoison.name}`,
          quantity: 1,
          weightLb: 0.2
        }
      ];
      onUpdateCharacter({
        ...targetChar,
        inventory: updatedInventory,
        updatedAt: new Date().toISOString()
      });
    }

    if (onShowNotification) {
      onShowNotification(outcome.message, outcome.success ? 'success' : outcome.accidentalSelfExposure ? 'error' : 'warning');
    }
  };

  // -------------------------------------------------------------
  // ESTADO 2: ENFERMEDADES
  // -------------------------------------------------------------
  const [selectedDiseaseId, setSelectedDiseaseId] = useState<string>(DISEASES_CATALOG[0].id);
  const [diseaseSuccessCount, setDiseaseSuccessCount] = useState<number>(0);
  const [diseaseLog, setDiseaseLog] = useState<string | null>(null);

  const activeDisease = DISEASES_CATALOG.find(d => d.id === selectedDiseaseId) || DISEASES_CATALOG[0];

  const handleTestDiseaseSave = () => {
    const targetChar = characters.find(c => c.id === targetCharId) || activeCharacter || characters[0];
    if (!targetChar) return;

    const conMod = getAbilityModifier(targetChar.abilities.con);
    const d20 = rollDice('1d20').total;
    const total = d20 + conMod;

    const outcome = resolveDailyDiseaseSave(activeDisease, total, diseaseSuccessCount);
    setDiseaseSuccessCount(outcome.newSuccesses);
    setDiseaseLog(`${targetChar.name}: ${outcome.message}`);

    if (onShowNotification) {
      onShowNotification(outcome.message, outcome.passed ? 'success' : 'warning');
    }
  };

  // -------------------------------------------------------------
  // ESTADO 3: ALQUIMIA & BOTICA
  // -------------------------------------------------------------
  const [selectedRecipeId, setSelectedRecipeId] = useState<string>(ALCHEMICAL_RECIPES[0].id);
  const [craftingDaysWorked, setCraftingDaysWorked] = useState<number>(0);
  const [craftingLog, setCraftingLog] = useState<string | null>(null);

  const activeRecipe = ALCHEMICAL_RECIPES.find(r => r.id === selectedRecipeId) || ALCHEMICAL_RECIPES[0];
  const craftingProgress = calculateCraftingProgress(activeRecipe, craftingDaysWorked);

  // Avanzar un día de elaboración
  const handleWorkDay = () => {
    const nextDays = craftingDaysWorked + 1;
    setCraftingDaysWorked(nextDays);
    const prog = calculateCraftingProgress(activeRecipe, nextDays);
    if (prog.isCompleted) {
      setCraftingLog(`¡Elaboración completada! Has sintetizado: ${activeRecipe.outputItem}.`);
    } else {
      setCraftingLog(`Progreso: Día ${nextDays}/${activeRecipe.daysRequired} completado (${prog.percentProgress}%).`);
    }
  };

  // Entregar poción al inventario del personaje
  const handleDeliverToInventory = () => {
    const targetChar = characters.find(c => c.id === targetCharId) || activeCharacter || characters[0];
    if (!targetChar) return;

    const updatedInventory = [
      ...(targetChar.inventory || []),
      {
        id: 'alchem_' + Date.now(),
        name: activeRecipe.outputItem,
        quantity: 1,
        weightLb: 0.5
      }
    ];

    onUpdateCharacter({
      ...targetChar,
      inventory: updatedInventory,
      updatedAt: new Date().toISOString()
    });

    setCraftingDaysWorked(0);
    setCraftingLog(`¡${activeRecipe.outputItem} transferido con éxito al inventario de ${targetChar.name}!`);

    if (onShowNotification) {
      onShowNotification(`¡${activeRecipe.outputItem} añadido al inventario de ${targetChar.name}!`, 'success');
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER PRINCIPAL */}
      <div className="bg-[#fcfbf7] dark:bg-[#1a1c23] border border-[#e2d9c8] dark:border-gray-800 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <FlaskConical className="w-6 h-6 text-[#b45309]" />
              <h2 className="text-2xl font-serif font-bold text-[#2d241e] dark:text-gray-100">
                Catálogo de Venenos, Enfermedades & Alquimia
              </h2>
            </div>
            <p className="text-sm text-[#786953] dark:text-gray-400 mt-1">
              Sistemas oficiales de la <em>Guía del Dungeon Master 2024</em> y la <em>Guía de Xanathar para Todo</em>.
              14 venenos canónicos, extracción con riesgo de autoenvenenamiento, enfermedades contagiosas y taller de botica.
            </p>
          </div>

          {/* Selector de Pestaña */}
          <div className="flex items-center bg-[#ede3d1] dark:bg-gray-800 p-1 rounded-lg text-xs font-bold">
            <button
              onClick={() => setActiveTab('poisons')}
              className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
                activeTab === 'poisons'
                  ? 'bg-[#b45309] text-white shadow-sm'
                  : 'text-[#6e5d48] dark:text-gray-300 hover:text-black dark:hover:text-white'
              }`}
            >
              <Skull className="w-4 h-4" />
              Venenos & Extracción
            </button>
            <button
              onClick={() => setActiveTab('diseases')}
              className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
                activeTab === 'diseases'
                  ? 'bg-[#b45309] text-white shadow-sm'
                  : 'text-[#6e5d48] dark:text-gray-300 hover:text-black dark:hover:text-white'
              }`}
            >
              <HeartPulse className="w-4 h-4" />
              Enfermedades
            </button>
            <button
              onClick={() => setActiveTab('alchemy')}
              className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
                activeTab === 'alchemy'
                  ? 'bg-[#b45309] text-white shadow-sm'
                  : 'text-[#6e5d48] dark:text-gray-300 hover:text-black dark:hover:text-white'
              }`}
            >
              <FlaskConical className="w-4 h-4" />
              Taller de Alquimia
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* PESTAÑA 1: VENENOS CANÓNICOS & EXTRACCIÓN                  */}
      {/* ========================================================= */}
      {activeTab === 'poisons' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Columna Izquierda: Catálogo de Venenos */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-[#fcfbf7] dark:bg-[#1a1c23] border border-[#e2d9c8] dark:border-gray-800 rounded-xl p-4 shadow-sm">
              <h3 className="font-serif font-bold text-[#2d241e] dark:text-gray-100 flex items-center gap-2 mb-3">
                <Skull className="w-4 h-4 text-[#b45309]" />
                Los 14 Venenos de la DMG
              </h3>

              {/* Filtro por Vía */}
              <div className="flex gap-1 mb-3 text-xs">
                {(['all', 'injury', 'ingested', 'contact', 'inhaled'] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => setDeliveryFilter(f)}
                    className={`flex-1 py-1 rounded text-center capitalize transition-colors ${
                      deliveryFilter === f
                        ? 'bg-[#b45309] text-white font-bold'
                        : 'bg-[#ede3d1] dark:bg-gray-800 text-[#6e5d48] dark:text-gray-300'
                    }`}
                  >
                    {f === 'all' ? 'Todos' : f === 'injury' ? 'Lesión' : f === 'ingested' ? 'Ingestión' : f === 'contact' ? 'Contacto' : 'Inhalación'}
                  </button>
                ))}
              </div>

              {/* Lista */}
              <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
                {POISONS_CATALOG.filter(p => deliveryFilter === 'all' || p.delivery === deliveryFilter).map(poison => (
                  <button
                    key={poison.id}
                    onClick={() => {
                      setSelectedPoisonId(poison.id);
                      setPoisonSimLog(null);
                    }}
                    className={`w-full text-left p-3 rounded-lg border transition-all ${
                      selectedPoisonId === poison.id
                        ? 'border-[#b45309] bg-[#f5ede0] dark:bg-[#2a2219] shadow-sm'
                        : 'border-[#e2d9c8] dark:border-gray-800 hover:bg-[#faf7f0] dark:hover:bg-gray-800/60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-[#2d241e] dark:text-gray-100 line-clamp-1">{poison.name}</span>
                      <span
                        className="text-[10px] px-2 py-0.5 rounded font-bold uppercase"
                        style={{ backgroundColor: `${poison.badgeColor}20`, color: poison.badgeColor }}
                      >
                        {poison.deliveryLabel}
                      </span>
                    </div>
                    <div className="text-[11px] text-[#786953] dark:text-gray-400 mt-1 flex justify-between">
                      <span>CD {poison.saveDc} Constitución</span>
                      <span className="font-mono font-bold text-[#b45309]">{poison.costGp} po / dosis</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Columna Derecha: Detalle, Simulador de Exposición y Extracción */}
          <div className="lg:col-span-7 space-y-6">
            {/* Detalle del Veneno Seleccionado */}
            <div className="bg-[#fcfbf7] dark:bg-[#1a1c23] border border-[#e2d9c8] dark:border-gray-800 rounded-xl p-6 shadow-sm space-y-4">
              <div className="flex items-start justify-between border-b border-[#e2d9c8] dark:border-gray-800 pb-3">
                <div>
                  <h3 className="text-xl font-serif font-bold text-[#2d241e] dark:text-gray-100">
                    {activePoison.name}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-[#786953] dark:text-gray-400 mt-1">
                    <span className="font-bold text-[#b45309]">Vía: {activePoison.deliveryLabel}</span>
                    <span>•</span>
                    <span>Aparición: {activePoison.onsetTime}</span>
                    <span>•</span>
                    <span>Duración: {activePoison.duration}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-mono font-bold text-lg text-[#b45309] block">{activePoison.costGp} po</span>
                  <span className="text-[10px] text-[#786953] dark:text-gray-400">por frasco/dosis</span>
                </div>
              </div>

              <p className="text-xs text-[#5c4e3e] dark:text-gray-300 leading-relaxed bg-[#faf7f0] dark:bg-gray-800/60 p-3 rounded-lg border border-[#e8dfd1] dark:border-gray-700/60">
                {activePoison.effectDescription}
              </p>

              {/* Simulador de Exposición */}
              <div className="p-4 rounded-lg bg-[#f5ede0] dark:bg-[#252019] border border-[#dfd2be] dark:border-gray-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-[#2d241e] dark:text-gray-100 flex items-center gap-1.5">
                    <Dices className="w-4 h-4 text-[#b45309]" />
                    Simulador de Exposición al Veneno
                  </h4>
                  <label className="flex items-center gap-1.5 text-xs text-[#5c4e3e] dark:text-gray-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hasAntitoxin}
                      onChange={e => setHasAntitoxin(e.target.checked)}
                      className="rounded text-[#b45309] focus:ring-[#b45309]"
                    />
                    Tiene Antitoxina (Ventaja)
                  </label>
                </div>

                <div className="flex gap-2">
                  <select
                    value={targetCharId}
                    onChange={e => setTargetCharId(e.target.value)}
                    className="flex-1 p-2 rounded border border-[#e2d9c8] dark:border-gray-700 bg-white dark:bg-gray-800 text-xs font-bold"
                  >
                    {characters.map(c => (
                      <option key={c.id} value={c.id}>
                        Objetivo: {c.name} (CON {c.abilities.con > 0 ? `+${getAbilityModifier(c.abilities.con)}` : getAbilityModifier(c.abilities.con)})
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={handleTestPoisonExposure}
                    className="py-2 px-4 rounded bg-[#b45309] hover:bg-[#92400e] text-white font-bold text-xs transition-all shadow-sm"
                  >
                    Tirar Salvación CON (CD {activePoison.saveDc})
                  </button>
                </div>

                {poisonSimLog && (
                  <div className="p-2.5 rounded bg-white dark:bg-gray-800 border border-[#e2d9c8] dark:border-gray-700 text-xs text-[#3d3228] dark:text-gray-200 font-mono">
                    {poisonSimLog}
                  </div>
                )}
              </div>

              {/* Taller de Extracción de Veneno de Monstruos */}
              <div className="p-4 rounded-lg bg-stone-100 dark:bg-gray-800/80 border border-stone-300 dark:border-gray-700 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                    <Skull className="w-4 h-4 text-purple-600" />
                    Extracción de Toxinas de Criaturas (Reglas Xanathar p. 130)
                  </h4>
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 font-bold">
                    Dificultad: CD 20 (Naturaleza / Supervivencia)
                  </span>
                </div>

                <p className="text-[11px] text-[#5c4e3e] dark:text-gray-400">
                  Requiere el cadáver o cuerpo incapacitado de la criatura venenosa. Fallar por 5 o más (tirada &le; 15) causa <strong>autoenvenenamiento accidental</strong>.
                </p>

                <div className="flex gap-2">
                  <select
                    value={harvestCreature}
                    onChange={e => setHarvestCreature(e.target.value)}
                    className="flex-1 p-2 rounded border border-stone-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs font-bold"
                  >
                    <option value="wyvern">Cadáver de Guiverno (Veneno de Guiverno)</option>
                    <option value="giant_serpent">Víbora Gigante (Veneno de Serpiente)</option>
                    <option value="crawler">Oruga Carroñera (Mucosidad de Oruga)</option>
                    <option value="purple_worm">Gusano Púrpura (Veneno de Gusano Púrpura)</option>
                  </select>

                  <button
                    onClick={handleAttemptHarvest}
                    className="py-2 px-4 rounded bg-stone-800 hover:bg-stone-900 text-white font-bold text-xs transition-all shadow-sm flex items-center gap-1.5"
                  >
                    <Dices className="w-4 h-4" />
                    Intentar Extracción
                  </button>
                </div>

                {harvestLog && (
                  <div className="p-2.5 rounded bg-white dark:bg-gray-900 border border-stone-300 dark:border-gray-700 text-xs font-mono text-stone-800 dark:text-gray-200">
                    {harvestLog}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* PESTAÑA 2: ENFERMEDADES & CONTAGIOS                       */}
      {/* ========================================================= */}
      {activeTab === 'diseases' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Columna Izquierda: Selector de Enfermedad */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-[#fcfbf7] dark:bg-[#1a1c23] border border-[#e2d9c8] dark:border-gray-800 rounded-xl p-4 shadow-sm">
              <h3 className="font-serif font-bold text-[#2d241e] dark:text-gray-100 flex items-center gap-2 mb-3">
                <HeartPulse className="w-4 h-4 text-[#b45309]" />
                Enfermedades Canónicas
              </h3>

              <div className="space-y-2">
                {DISEASES_CATALOG.map(disease => (
                  <button
                    key={disease.id}
                    onClick={() => {
                      setSelectedDiseaseId(disease.id);
                      setDiseaseSuccessCount(0);
                      setDiseaseLog(null);
                    }}
                    className={`w-full text-left p-3 rounded-lg border transition-all ${
                      selectedDiseaseId === disease.id
                        ? 'border-[#b45309] bg-[#f5ede0] dark:bg-[#2a2219] shadow-sm'
                        : 'border-[#e2d9c8] dark:border-gray-800 hover:bg-[#faf7f0] dark:hover:bg-gray-800/60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-[#2d241e] dark:text-gray-100">{disease.name}</span>
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
                          disease.dangerSeverity === 'mortal'
                            ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300'
                            : 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
                        }`}
                      >
                        {disease.dangerSeverity}
                      </span>
                    </div>
                    <div className="text-[11px] text-[#786953] dark:text-gray-400 mt-1">
                      CD {disease.saveDc} CON • Incubación: {disease.incubationPeriod}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Columna Derecha: Cuadro Clínico y Salvaciones Diarias */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-[#fcfbf7] dark:bg-[#1a1c23] border border-[#e2d9c8] dark:border-gray-800 rounded-xl p-6 shadow-sm space-y-4">
              <div className="flex items-start justify-between border-b border-[#e2d9c8] dark:border-gray-800 pb-3">
                <div>
                  <h3 className="text-xl font-serif font-bold text-[#2d241e] dark:text-gray-100">
                    {activeDisease.name}
                  </h3>
                  <div className="text-xs text-[#786953] dark:text-gray-400 mt-1">
                    Transmisión: {activeDisease.transmission}
                  </div>
                </div>
                <span className="font-mono font-bold text-xs px-2.5 py-1 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
                  Salvación Diaria: CD {activeDisease.saveDc} CON
                </span>
              </div>

              {/* Ficha Clínica */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-[#faf7f0] dark:bg-gray-800/60 border border-[#e8dfd1] dark:border-gray-700/60 space-y-1">
                  <span className="font-bold text-[#b45309] block">Síntomas Clínicos</span>
                  <span className="text-[#5c4e3e] dark:text-gray-300 leading-relaxed">{activeDisease.symptoms}</span>
                </div>
                <div className="p-3 rounded-lg bg-[#faf7f0] dark:bg-gray-800/60 border border-[#e8dfd1] dark:border-gray-700/60 space-y-1">
                  <span className="font-bold text-[#b45309] block">Tratamiento & Cura</span>
                  <span className="text-[#5c4e3e] dark:text-gray-300 leading-relaxed">{activeDisease.cureRequirement}</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 text-xs text-rose-900 dark:text-rose-200">
                <strong>Progresión sin tratamiento:</strong> {activeDisease.progression}
              </div>

              {/* Simulador de Salvación Diaria */}
              <div className="p-4 rounded-lg bg-[#f5ede0] dark:bg-[#252019] border border-[#dfd2be] dark:border-gray-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-[#2d241e] dark:text-gray-100">
                    Seguimiento Clínico de Infección
                  </h4>
                  <span className="font-mono text-xs font-bold text-[#b45309]">
                    Éxitos Consecutivos: {diseaseSuccessCount} / 3
                  </span>
                </div>

                <div className="w-full bg-[#e8decb] dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-600 h-full transition-all"
                    style={{ width: `${(diseaseSuccessCount / 3) * 100}%` }}
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleTestDiseaseSave}
                    className="flex-1 py-2 px-3 rounded bg-[#b45309] hover:bg-[#92400e] text-white font-bold text-xs shadow-sm flex items-center justify-center gap-1.5"
                  >
                    <Dices className="w-4 h-4" />
                    Tirar Salvación Diaria (CD {activeDisease.saveDc} CON)
                  </button>
                  <button
                    onClick={() => setDiseaseSuccessCount(0)}
                    className="py-2 px-3 rounded bg-stone-200 dark:bg-gray-700 text-[#2d241e] dark:text-gray-200 font-bold text-xs"
                  >
                    Reiniciar
                  </button>
                </div>

                {diseaseLog && (
                  <div className="p-2.5 rounded bg-white dark:bg-gray-800 border border-[#e2d9c8] dark:border-gray-700 text-xs font-mono text-[#3d3228] dark:text-gray-200">
                    {diseaseLog}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* PESTAÑA 3: TALLER DE ALQUIMIA & BOTICA                    */}
      {/* ========================================================= */}
      {activeTab === 'alchemy' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Columna Izquierda: Fórmulas Alquímicas */}
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-[#fcfbf7] dark:bg-[#1a1c23] border border-[#e2d9c8] dark:border-gray-800 rounded-xl p-5 shadow-sm space-y-4">
              <h3 className="font-serif font-bold text-lg text-[#2d241e] dark:text-gray-100 flex items-center gap-2">
                <FlaskConical className="w-5 h-5 text-[#b45309]" />
                Recetas y Fórmulas Alquímicas (Xanathar p. 130)
              </h3>

              <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                {ALCHEMICAL_RECIPES.map(recipe => (
                  <button
                    key={recipe.id}
                    onClick={() => {
                      setSelectedRecipeId(recipe.id);
                      setCraftingDaysWorked(0);
                      setCraftingLog(null);
                    }}
                    className={`w-full text-left p-3 rounded-lg border transition-all ${
                      selectedRecipeId === recipe.id
                        ? 'border-[#b45309] bg-[#f5ede0] dark:bg-[#2a2219] shadow-sm'
                        : 'border-[#e2d9c8] dark:border-gray-800 hover:bg-[#faf7f0] dark:hover:bg-gray-800/60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-[#2d241e] dark:text-gray-100">{recipe.name}</span>
                      <span className="font-mono text-xs font-bold text-[#b45309]">{recipe.craftingCostGp} po</span>
                    </div>
                    <div className="text-[11px] text-[#786953] dark:text-gray-400 mt-1 flex justify-between">
                      <span>{recipe.toolRequired}</span>
                      <span>{recipe.daysRequired} día(s) de labor</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Consola de Elaboración */}
              <div className="p-4 rounded-lg bg-[#f5ede0] dark:bg-[#252019] border border-[#dfd2be] dark:border-gray-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs uppercase tracking-wider text-[#2d241e] dark:text-gray-100">
                    {activeRecipe.outputItem}
                  </span>
                  <span className="font-mono text-xs font-bold text-[#b45309]">
                    Progreso: {craftingDaysWorked} / {activeRecipe.daysRequired} días ({craftingProgress.percentProgress}%)
                  </span>
                </div>

                <div className="w-full bg-[#e8decb] dark:bg-gray-700 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#b45309] h-full transition-all"
                    style={{ width: `${craftingProgress.percentProgress}%` }}
                  />
                </div>

                <div className="text-xs text-[#5c4e3e] dark:text-gray-300">
                  <strong>Ingredientes requeridos: </strong> {activeRecipe.requiredIngredients.join(', ')}.
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    onClick={handleWorkDay}
                    disabled={craftingProgress.isCompleted}
                    className={`flex-1 py-2 px-3 rounded font-bold text-xs transition-all flex items-center justify-center gap-1.5 ${
                      craftingProgress.isCompleted
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-[#b45309] hover:bg-[#92400e] text-white shadow-sm'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    Dedicar 1 Día de Trabajo
                  </button>

                  <button
                    onClick={handleDeliverToInventory}
                    disabled={!craftingProgress.isCompleted}
                    className={`py-2 px-3 rounded font-bold text-xs transition-all flex items-center gap-1.5 ${
                      craftingProgress.isCompleted
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <PackageCheck className="w-3.5 h-3.5" />
                    Añadir al Inventario
                  </button>
                </div>

                {craftingLog && (
                  <div className="p-2.5 rounded bg-white dark:bg-gray-800 border border-[#e2d9c8] dark:border-gray-700 text-xs font-mono text-[#3d3228] dark:text-gray-200">
                    {craftingLog}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Columna Derecha: Catálogo de Hierbas Botánicas */}
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-[#fcfbf7] dark:bg-[#1a1c23] border border-[#e2d9c8] dark:border-gray-800 rounded-xl p-5 shadow-sm space-y-4">
              <h3 className="font-serif font-bold text-lg text-[#2d241e] dark:text-gray-100 flex items-center gap-2">
                <Leaf className="w-5 h-5 text-emerald-600" />
                Ingredientes Botánicos & Recolección en Biomas
              </h3>

              <div className="space-y-2.5 max-h-[520px] overflow-y-auto pr-1">
                {HERBS_CATALOG.map(herb => (
                  <div
                    key={herb.id}
                    className="p-3 rounded-lg bg-[#faf7f0] dark:bg-gray-800/60 border border-[#e8dfd1] dark:border-gray-700/60 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-[#2d241e] dark:text-gray-100">{herb.name}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded font-bold uppercase bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                        {herb.biome}
                      </span>
                    </div>
                    <div className="text-[#5c4e3e] dark:text-gray-300 text-[11px] italic">
                      "{herb.description}"
                    </div>
                    <div className="text-[11px] pt-1">
                      <strong className="text-[#b45309]">Uso alquímico: </strong>
                      <span className="text-[#3d3228] dark:text-gray-300">{herb.extractUse}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
