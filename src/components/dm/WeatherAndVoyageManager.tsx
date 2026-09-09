import React, { useState } from 'react';
import {
  Character,
  WeatherConditionType,
  MistSeverity,
  SeaCondition,
  ShipType,
  NavalHazard,
  MistIncident
} from '../../types/dnd';
import {
  WEATHER_CONDITIONS,
  RAVENLOFT_MIST_INCIDENTS,
  RAVENLOFT_DOMAINS,
  SHIPS_CATALOG,
  NAVAL_HAZARDS
} from '../../data/weatherAndVoyageData';
import {
  calculateColdSaveDc,
  calculateHeatSaveDc,
  checkHeatDisadvantage,
  resolveMistWhispers,
  calculateDailyVoyageDistance,
  calculateStormDamage,
  getRandomMistIncident,
  getRandomNavalHazard
} from '../../utils/weatherMath';
import { getAbilityModifier, rollDice } from '../../utils/dndMath';
import { modifyCharacterStress } from '../../utils/ravenloftMath';
import {
  CloudRain,
  CloudSnow,
  Sun,
  Wind,
  Thermometer,
  Droplets,
  Compass,
  Anchor,
  Skull,
  Ghost,
  Ship,
  Waves,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Dices,
  Sparkles,
  Eye,
  BookOpen,
  HeartPulse,
  Plus,
  Minus,
  Info,
  Shield
} from 'lucide-react';

interface WeatherAndVoyageManagerProps {
  characters: Character[];
  activeCharacter?: Character;
  onUpdateCharacter?: (character: Character) => void;
  onShowNotification?: (message: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
}

export const WeatherAndVoyageManager: React.FC<WeatherAndVoyageManagerProps> = ({
  characters,
  activeCharacter,
  onUpdateCharacter,
  onShowNotification
}) => {
  // Pestaña Principal (Clima, Brumas, Náutica)
  const [activeTab, setActiveTab] = useState<'weather' | 'mists' | 'naval'>('weather');

  // -------------------------------------------------------------
  // ESTADO 1: CLIMA & ENTORNOS EXTREMOS
  // -------------------------------------------------------------
  const [selectedWeatherId, setSelectedWeatherId] = useState<WeatherConditionType>('extreme_cold');
  const [weatherCategoryFilter, setWeatherCategoryFilter] = useState<'all' | 'mundane' | 'extreme' | 'supernatural'>('all');
  const [hoursExposed, setHoursExposed] = useState<number>(2);
  const [isSubmergedInCold, setIsSubmergedInCold] = useState<boolean>(false);
  const [weatherSaveLog, setWeatherSaveLog] = useState<Array<{ name: string; roll: number; total: number; dc: number; passed: boolean; note?: string }>>([]);

  const activeWeather = WEATHER_CONDITIONS.find(w => w.id === selectedWeatherId) || WEATHER_CONDITIONS[0];

  // Cálculo dinámico de CD de clima según horas
  const currentSaveDc = activeWeather.id === 'extreme_cold'
    ? calculateColdSaveDc(hoursExposed, isSubmergedInCold)
    : activeWeather.id === 'extreme_heat'
    ? calculateHeatSaveDc(hoursExposed)
    : activeWeather.baseDc || 10;

  // Realizar salvación en grupo contra el clima
  const handleRollGroupWeatherSave = () => {
    if (characters.length === 0) return;

    const results: Array<{ name: string; roll: number; total: number; dc: number; passed: boolean; note?: string }> = [];

    characters.forEach(char => {
      const conMod = getAbilityModifier(char.abilities.con);
      const wisMod = getAbilityModifier(char.abilities.wis);
      const dexMod = getAbilityModifier(char.abilities.dex);

      let mod = conMod;
      if (activeWeather.saveType === 'wis') mod = wisMod;
      if (activeWeather.saveType === 'dex') mod = dexMod;

      // Comprobar desventaja en calor por armadura pesada/media
      const isHeavyArmor = char.inventory?.some(i => i.equipped && (i.name.toLowerCase().includes('placas') || i.name.toLowerCase().includes('cota') || i.name.toLowerCase().includes('malla')));
      const hasDisadvantage = activeWeather.id === 'extreme_heat' && isHeavyArmor;

      const d20Roll1 = rollDice('1d20').total;
      const d20Roll2 = rollDice('1d20').total;
      const d20 = hasDisadvantage ? Math.min(d20Roll1, d20Roll2) : d20Roll1;
      const total = d20 + mod;
      const passed = total >= currentSaveDc;

      results.push({
        name: char.name,
        roll: d20,
        total,
        dc: currentSaveDc,
        passed,
        note: hasDisadvantage ? 'Desventaja por armadura pesada/media' : undefined
      });
    });

    setWeatherSaveLog(results);
    const failures = results.filter(r => !r.passed).length;
    if (onShowNotification) {
      if (failures === 0) {
        onShowNotification(`¡Todo el grupo resistió el clima (${activeWeather.name}) con éxito!`, 'success');
      } else {
        onShowNotification(`${failures} miembro(s) sufren agotamiento por el clima (CD ${currentSaveDc}).`, 'warning');
      }
    }
  };

  // -------------------------------------------------------------
  // ESTADO 2: LAS BRUMAS DE RAVENLOFT
  // -------------------------------------------------------------
  const [mistSeverity, setMistSeverity] = useState<MistSeverity>('dense');
  const [activeMistIncident, setActiveMistIncident] = useState<MistIncident | null>(null);
  const [mistResolutionLog, setMistResolutionLog] = useState<string | null>(null);
  const [selectedDomainId, setSelectedDomainId] = useState<string>('barovia');

  const activeDomain = RAVENLOFT_DOMAINS.find(d => d.id === selectedDomainId) || RAVENLOFT_DOMAINS[0];

  // Disparar susurros de la bruma
  const handleTriggerMistWhispers = () => {
    const incident = getRandomMistIncident();
    setActiveMistIncident(incident);
    setMistResolutionLog(null);
  };

  // Resolver tirada de salvación contra susurros de la bruma
  const handleResolveMistSave = (targetChar?: Character) => {
    const char = targetChar || activeCharacter || characters[0];
    if (!char || !activeMistIncident) return;

    const ability = activeMistIncident.saveAbility;
    const mod = getAbilityModifier(char.abilities[ability]);
    const d20 = rollDice('1d20').total;
    const total = d20 + mod;
    const currentStress = char.stressScore || 0;

    const outcome = resolveMistWhispers(total, activeMistIncident.dc, currentStress, activeMistIncident.stressRisk);

    if (!outcome.success && onUpdateCharacter) {
      const { updatedCharacter } = modifyCharacterStress(char, outcome.stressChange);
      onUpdateCharacter(updatedCharacter);
    }

    setMistResolutionLog(`${char.name}: ${outcome.narrativeText}`);
    if (onShowNotification) {
      onShowNotification(outcome.narrativeText, outcome.success ? 'success' : 'error');
    }
  };

  // -------------------------------------------------------------
  // ESTADO 3: PELIGROS NÁUTICOS & ALTAMAR
  // -------------------------------------------------------------
  const [selectedShipType, setSelectedShipType] = useState<ShipType>('sailing_ship');
  const activeShipStats = SHIPS_CATALOG.find(s => s.id === selectedShipType) || SHIPS_CATALOG[2];

  const [shipName, setShipName] = useState<string>('La Dama de las Olas');
  const [currentHullHp, setCurrentHullHp] = useState<number>(activeShipStats.maxHp);
  const [crewCount, setCrewCount] = useState<number>(activeShipStats.crewMin + 5);
  const [waterDays, setWaterDays] = useState<number>(14);
  const [milesTraveled, setMilesTraveled] = useState<number>(120);
  const [seaCondition, setSeaCondition] = useState<SeaCondition>('rough');
  const [activeHazard, setActiveHazard] = useState<NavalHazard | null>(null);
  const [shipLog, setShipLog] = useState<string[]>([
    'Zarpamos del puerto en marea alta con raciones completas y velamen afinado.',
    'Día 1: Viento de popa constante, recorridas 95 millas náuticas sin novedad.'
  ]);

  // Cambiar tipo de barco
  const handleShipTypeChange = (type: ShipType) => {
    setSelectedShipType(type);
    const stats = SHIPS_CATALOG.find(s => s.id === type);
    if (stats) {
      setCurrentHullHp(stats.maxHp);
      setCrewCount(stats.crewMin);
    }
  };

  // Avanzar una jornada de navegación (24 horas)
  const handleAdvanceVoyageDay = () => {
    // Prueba de navegante simulada (d20 + 4 >= 12)
    const navRoll = rollDice('1d20').total + 4;
    const isSuccess = navRoll >= 12;

    const dailyMiles = calculateDailyVoyageDistance(selectedShipType, seaCondition, isSuccess);
    const newMiles = milesTraveled + dailyMiles;
    setMilesTraveled(newMiles);

    // Consumo de agua dulce
    const newWater = Math.max(0, waterDays - 1);
    setWaterDays(newWater);

    // Daño de tormenta al casco si aplica
    const stormDmg = calculateStormDamage(seaCondition, activeShipStats.damageThreshold);
    let hpRemaining = currentHullHp;
    if (stormDmg > 0) {
      hpRemaining = Math.max(0, currentHullHp - stormDmg);
      setCurrentHullHp(hpRemaining);
    }

    let logMsg = `Jornada 24h: Avanzadas ${dailyMiles} millas náuticas (Total: ${newMiles} mn). Agua dulce restante: ${newWater} días.`;
    if (stormDmg > 0) {
      logMsg += ` ¡El oleaje azotó el casco infligiendo ${stormDmg} de daño! (Casco: ${hpRemaining}/${activeShipStats.maxHp}).`;
    }
    if (newWater === 0) {
      logMsg += ' ¡ALERTA! Se han agotado las reservas de agua dulce. Riesgo inminente de deshidratación extrema.';
    }

    setShipLog(prev => [logMsg, ...prev]);

    if (onShowNotification) {
      onShowNotification(logMsg, stormDmg > 0 || newWater === 0 ? 'warning' : 'info');
    }
  };

  // Tirar peligro náutico
  const handleRollNavalHazard = () => {
    const hazard = getRandomNavalHazard();
    setActiveHazard(hazard);
  };

  // Aplicar daño del peligro al casco
  const handleApplyHazardDamage = () => {
    if (!activeHazard || !activeHazard.hullDamageDice || activeHazard.hullDamageDice === '0') return;
    const dmg = rollDice(activeHazard.hullDamageDice).total;
    const actualDmg = Math.max(0, dmg - activeShipStats.damageThreshold);
    const newHp = Math.max(0, currentHullHp - actualDmg);
    setCurrentHullHp(newHp);

    const logEntry = `Peligro [${activeHazard.title}]: Daño al casco tirado ${dmg} (absorbido por umbral: ${activeShipStats.damageThreshold}) -> Daño neto: ${actualDmg} PG. Casco actual: ${newHp}/${activeShipStats.maxHp}.`;
    setShipLog(prev => [logEntry, ...prev]);

    if (onShowNotification) {
      onShowNotification(logEntry, actualDmg > 0 ? 'error' : 'info');
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER PRINCIPAL */}
      <div className="bg-[#fcfbf7] dark:bg-[#1a1c23] border border-[#e2d9c8] dark:border-gray-800 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Compass className="w-6 h-6 text-[#b45309]" />
              <h2 className="text-2xl font-serif font-bold text-[#2d241e] dark:text-gray-100">
                Clima Sobrenatural, Brumas & Travesías Náuticas
              </h2>
            </div>
            <p className="text-sm text-[#786953] dark:text-gray-400 mt-1">
              Sistemas canónicos de supervivencia extrema de la <em>Guía del Dungeon Master 2024</em>, <em>Guía de Xanathar</em> y <em>Guía de Van Richten</em>.
              Frío ártico, calor del desierto, nieblas vivientes de Ravenloft y navegación transoceánica.
            </p>
          </div>

          {/* Switcher de Pestaña Principal */}
          <div className="flex items-center bg-[#ede3d1] dark:bg-gray-800 p-1 rounded-lg text-xs font-bold">
            <button
              onClick={() => setActiveTab('weather')}
              className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
                activeTab === 'weather'
                  ? 'bg-[#b45309] text-white shadow-sm'
                  : 'text-[#6e5d48] dark:text-gray-300 hover:text-black dark:hover:text-white'
              }`}
            >
              <CloudRain className="w-4 h-4" />
              Clima Extremo
            </button>
            <button
              onClick={() => setActiveTab('mists')}
              className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
                activeTab === 'mists'
                  ? 'bg-[#b45309] text-white shadow-sm'
                  : 'text-[#6e5d48] dark:text-gray-300 hover:text-black dark:hover:text-white'
              }`}
            >
              <Ghost className="w-4 h-4" />
              Brumas de Ravenloft
            </button>
            <button
              onClick={() => setActiveTab('naval')}
              className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
                activeTab === 'naval'
                  ? 'bg-[#b45309] text-white shadow-sm'
                  : 'text-[#6e5d48] dark:text-gray-300 hover:text-black dark:hover:text-white'
              }`}
            >
              <Ship className="w-4 h-4" />
              Navegación & Altamar
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* PESTAÑA 1: CLIMA EXTREMO & SOBRENATURAL                  */}
      {/* ========================================================= */}
      {activeTab === 'weather' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Columna Izquierda: Selector de Clima */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-[#fcfbf7] dark:bg-[#1a1c23] border border-[#e2d9c8] dark:border-gray-800 rounded-xl p-4 shadow-sm">
              <h3 className="font-serif font-bold text-[#2d241e] dark:text-gray-100 flex items-center gap-2 mb-3">
                <Thermometer className="w-4 h-4 text-[#b45309]" />
                Condiciones Climáticas
              </h3>

              {/* Filtro de Categoría */}
              <div className="flex gap-1 mb-3 text-xs">
                {(['all', 'mundane', 'extreme', 'supernatural'] as const).map(cat => (
                  <button
                    key={cat}
                    onClick={() => setWeatherCategoryFilter(cat)}
                    className={`flex-1 py-1 rounded text-center capitalize transition-colors ${
                      weatherCategoryFilter === cat
                        ? 'bg-[#b45309] text-white font-bold'
                        : 'bg-[#ede3d1] dark:bg-gray-800 text-[#6e5d48] dark:text-gray-300'
                    }`}
                  >
                    {cat === 'all' ? 'Todos' : cat === 'mundane' ? 'Mundano' : cat === 'extreme' ? 'Extremo' : 'Sobrenatural'}
                  </button>
                ))}
              </div>

              {/* Lista de Climas */}
              <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
                {WEATHER_CONDITIONS.filter(w => weatherCategoryFilter === 'all' || w.category === weatherCategoryFilter).map(w => (
                  <button
                    key={w.id}
                    onClick={() => setSelectedWeatherId(w.id)}
                    className={`w-full text-left p-3 rounded-lg border transition-all ${
                      selectedWeatherId === w.id
                        ? 'border-[#b45309] bg-[#f5ede0] dark:bg-[#2a2219] shadow-sm'
                        : 'border-[#e2d9c8] dark:border-gray-800 hover:bg-[#faf7f0] dark:hover:bg-gray-800/60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-[#2d241e] dark:text-gray-100">{w.name}</span>
                      <span
                        className="text-[10px] px-2 py-0.5 rounded font-bold uppercase"
                        style={{ backgroundColor: `${w.badgeColor}20`, color: w.badgeColor }}
                      >
                        {w.category}
                      </span>
                    </div>
                    <div className="text-xs text-[#786953] dark:text-gray-400 mt-1 line-clamp-1">
                      {w.temperatureDesc}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Columna Derecha: Panel de Efectos y Simulador de Salvaciones */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-[#fcfbf7] dark:bg-[#1a1c23] border border-[#e2d9c8] dark:border-gray-800 rounded-xl p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#e2d9c8] dark:border-gray-800 pb-4 mb-4">
                <div>
                  <h3 className="text-xl font-serif font-bold text-[#2d241e] dark:text-gray-100">
                    {activeWeather.name}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-[#786953] dark:text-gray-400 mt-1">
                    <span className="flex items-center gap-1 font-semibold text-[#b45309]">
                      <BookOpen className="w-3.5 h-3.5" />
                      {activeWeather.sourceBook}
                    </span>
                    <span>•</span>
                    <span>{activeWeather.temperatureDesc}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300">
                    Visibilidad: {activeWeather.visibilityDesc}
                  </span>
                </div>
              </div>

              {/* Efectos Mecánicos Oficiales */}
              <div className="mb-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#786953] dark:text-gray-400 mb-2">
                  Consecuencias Mecánicas & Reglas Canónicas
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {activeWeather.mechanicalEffects.map((effect, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg bg-[#faf7f0] dark:bg-gray-800/60 border border-[#e8dfd1] dark:border-gray-700/60 text-xs text-[#3d3228] dark:text-gray-300 flex items-start gap-2"
                    >
                      <AlertTriangle className="w-4 h-4 text-[#b45309] shrink-0 mt-0.5" />
                      <span>{effect}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Parámetros de Exposición Dinámica */}
              <div className="bg-[#f5ede0] dark:bg-[#252019] border border-[#dfd2be] dark:border-gray-800 rounded-lg p-4 mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h5 className="font-bold text-sm text-[#2d241e] dark:text-gray-100">
                      Simulador de Exposición en Marcha
                    </h5>
                    <p className="text-xs text-[#786953] dark:text-gray-400">
                      Calcula la dificultad de la salvación de Constitución/Sabiduría en función del tiempo a la intemperie.
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-[#5c4e3e] dark:text-gray-300">Horas:</span>
                      <button
                        onClick={() => setHoursExposed(Math.max(1, hoursExposed - 1))}
                        className="p-1 rounded bg-[#e8decb] dark:bg-gray-700 text-[#2d241e] dark:text-gray-100"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="font-mono font-bold text-sm px-2 text-[#b45309]">{hoursExposed} h</span>
                      <button
                        onClick={() => setHoursExposed(hoursExposed + 1)}
                        className="p-1 rounded bg-[#e8decb] dark:bg-gray-700 text-[#2d241e] dark:text-gray-100"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {activeWeather.id === 'extreme_cold' && (
                      <label className="flex items-center gap-1.5 text-xs text-[#5c4e3e] dark:text-gray-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isSubmergedInCold}
                          onChange={e => setIsSubmergedInCold(e.target.checked)}
                          className="rounded text-[#b45309] focus:ring-[#b45309]"
                        />
                        Sumergido en agua gélida (+5 CD)
                      </label>
                    )}

                    <div className="bg-[#e8decb] dark:bg-gray-800 px-3 py-1.5 rounded-md text-center">
                      <span className="text-[10px] uppercase font-bold text-[#786953] dark:text-gray-400 block">Dificultad</span>
                      <span className="font-mono font-bold text-base text-[#b45309]">CD {currentSaveDc}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Botón de Tirada en Grupo */}
              {activeWeather.requiresSave && (
                <div>
                  <button
                    onClick={handleRollGroupWeatherSave}
                    className="w-full py-3 px-4 rounded-lg bg-[#b45309] hover:bg-[#92400e] text-white font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2"
                  >
                    <Dices className="w-4 h-4" />
                    Tirar Salvación en Grupo ({characters.length} héroes) vs CD {currentSaveDc}
                  </button>

                  {/* Resultados de la Salvación */}
                  {weatherSaveLog.length > 0 && (
                    <div className="mt-4 bg-[#faf7f0] dark:bg-gray-800/60 border border-[#e8dfd1] dark:border-gray-700/60 rounded-lg p-4">
                      <h5 className="font-bold text-xs uppercase tracking-wider text-[#786953] dark:text-gray-400 mb-2">
                        Resultado de Salvaciones del Grupo
                      </h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                        {weatherSaveLog.map((log, idx) => (
                          <div
                            key={idx}
                            className={`p-2 rounded border text-xs flex items-center justify-between ${
                              log.passed
                                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                                : 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-300'
                            }`}
                          >
                            <div>
                              <div className="font-bold">{log.name}</div>
                              <div className="text-[10px] opacity-80">
                                1d20 ({log.roll}) {log.total >= 0 ? '+' : ''}{log.total - log.roll} = {log.total} vs CD {log.dc}
                              </div>
                              {log.note && <div className="text-[9px] text-amber-700 dark:text-amber-400">{log.note}</div>}
                            </div>
                            <div className="flex items-center gap-1 font-bold">
                              {log.passed ? (
                                <>
                                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                  <span>Resiste</span>
                                </>
                              ) : (
                                <>
                                  <XCircle className="w-4 h-4 text-rose-600" />
                                  <span>+1 Agotamiento</span>
                                </>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* PESTAÑA 2: LAS BRUMAS DE RAVENLOFT                       */}
      {/* ========================================================= */}
      {activeTab === 'mists' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Columna Izquierda: Controlador de la Bruma & Susurros */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-[#fcfbf7] dark:bg-[#1a1c23] border border-[#e2d9c8] dark:border-gray-800 rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-[#e2d9c8] dark:border-gray-800 pb-4 mb-4">
                <div>
                  <h3 className="text-xl font-serif font-bold text-[#2d241e] dark:text-gray-100 flex items-center gap-2">
                    <Ghost className="w-5 h-5 text-[#b45309]" />
                    La Naturaleza de las Brumas
                  </h3>
                  <p className="text-xs text-[#786953] dark:text-gray-400 mt-1">
                    Entidad viva omnisciente al servicio de los Poderes Oscuros. Imposible de disipar con magia mundana de viento.
                  </p>
                </div>
              </div>

              {/* Selector de Densidad de la Bruma */}
              <div className="mb-6">
                <label className="text-xs font-bold uppercase tracking-wider text-[#786953] dark:text-gray-400 block mb-2">
                  Densidad de la Niebla
                </label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <button
                    onClick={() => setMistSeverity('light')}
                    className={`p-3 rounded-lg border text-center transition-all ${
                      mistSeverity === 'light'
                        ? 'border-[#b45309] bg-[#f5ede0] dark:bg-[#252019] font-bold text-[#b45309]'
                        : 'border-[#e2d9c8] dark:border-gray-800 text-[#5c4e3e] dark:text-gray-300'
                    }`}
                  >
                    <div className="font-bold">Bruma Leve</div>
                    <div className="text-[10px] opacity-75 mt-0.5">Penumbra & Sombras</div>
                  </button>

                  <button
                    onClick={() => setMistSeverity('dense')}
                    className={`p-3 rounded-lg border text-center transition-all ${
                      mistSeverity === 'dense'
                        ? 'border-[#b45309] bg-[#f5ede0] dark:bg-[#252019] font-bold text-[#b45309]'
                        : 'border-[#e2d9c8] dark:border-gray-800 text-[#5c4e3e] dark:text-gray-300'
                    }`}
                  >
                    <div className="font-bold">Bruma Densa</div>
                    <div className="text-[10px] opacity-75 mt-0.5">Visibilidad 10 pies</div>
                  </button>

                  <button
                    onClick={() => setMistSeverity('domain_border')}
                    className={`p-3 rounded-lg border text-center transition-all ${
                      mistSeverity === 'domain_border'
                        ? 'border-purple-600 bg-purple-50 dark:bg-purple-950/40 font-bold text-purple-700 dark:text-purple-300'
                        : 'border-[#e2d9c8] dark:border-gray-800 text-[#5c4e3e] dark:text-gray-300'
                    }`}
                  >
                    <div className="font-bold">Borde de Dominio</div>
                    <div className="text-[10px] opacity-75 mt-0.5">Muro Asfixiante</div>
                  </button>
                </div>
              </div>

              {/* Botón Disparador de Susurros */}
              <div className="space-y-4">
                <button
                  onClick={handleTriggerMistWhispers}
                  className="w-full py-3 px-4 rounded-lg bg-stone-800 hover:bg-stone-900 dark:bg-purple-900/60 dark:hover:bg-purple-900 text-white font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  <Skull className="w-4 h-4 text-purple-400" />
                  Hacer que las Brumas Susurren (Tirada d10 de Incidente)
                </button>

                {/* Incidente Activo */}
                {activeMistIncident && (
                  <div className="p-4 rounded-lg bg-[#faf7f0] dark:bg-gray-800/70 border border-[#e8dfd1] dark:border-gray-700/60 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-serif font-bold text-base text-[#2d241e] dark:text-gray-100 flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-purple-500" />
                        {activeMistIncident.title}
                      </span>
                      <span className="font-mono text-xs px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-200 font-bold">
                        Salvación {activeMistIncident.saveAbility.toUpperCase()} CD {activeMistIncident.dc}
                      </span>
                    </div>

                    <p className="text-xs text-[#5c4e3e] dark:text-gray-300 leading-relaxed italic">
                      "{activeMistIncident.description}"
                    </p>

                    <div className="p-2.5 rounded bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/50 text-xs text-amber-800 dark:text-amber-300">
                      <strong>Consecuencia si falla:</strong> {activeMistIncident.consequence}
                    </div>

                    {/* Botón para resolver salvación con el personaje activo */}
                    <div className="pt-2">
                      <button
                        onClick={() => handleResolveMistSave()}
                        className="w-full py-2 px-3 rounded bg-[#b45309] hover:bg-[#92400e] text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                      >
                        <HeartPulse className="w-3.5 h-3.5" />
                        Tirar Salvación para {activeCharacter ? activeCharacter.name : 'el Héroe Activo'}
                      </button>
                    </div>

                    {mistResolutionLog && (
                      <div className="p-2.5 rounded bg-stone-100 dark:bg-gray-900/80 border border-stone-300 dark:border-gray-700 text-xs font-medium text-stone-800 dark:text-gray-200">
                        {mistResolutionLog}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Columna Derecha: Catálogo de Dominios del Terror */}
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-[#fcfbf7] dark:bg-[#1a1c23] border border-[#e2d9c8] dark:border-gray-800 rounded-xl p-6 shadow-sm">
              <h3 className="font-serif font-bold text-lg text-[#2d241e] dark:text-gray-100 flex items-center gap-2 mb-2">
                <BookOpen className="w-5 h-5 text-[#b45309]" />
                Dominios del Terror Canónicos (Ravenloft)
              </h3>
              <p className="text-xs text-[#786953] dark:text-gray-400 mb-4">
                Tierras atrapadas en el Semiplano de la Desesperación gobernadas por Señores Oscuros malditos.
              </p>

              {/* Selector de Dominio */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                {RAVENLOFT_DOMAINS.map(d => (
                  <button
                    key={d.id}
                    onClick={() => setSelectedDomainId(d.id)}
                    className={`p-2 rounded-lg border text-left transition-all ${
                      selectedDomainId === d.id
                        ? 'border-[#b45309] bg-[#f5ede0] dark:bg-[#252019]'
                        : 'border-[#e2d9c8] dark:border-gray-800 hover:bg-[#faf7f0] dark:hover:bg-gray-800/60'
                    }`}
                  >
                    <div className="font-bold text-xs text-[#2d241e] dark:text-gray-100">{d.name}</div>
                    <div className="text-[10px] text-[#786953] dark:text-gray-400 truncate">{d.genre}</div>
                  </button>
                ))}
              </div>

              {/* Tarjeta Detallada del Dominio Seleccionado */}
              <div className="p-4 rounded-lg bg-[#faf7f0] dark:bg-gray-800/60 border border-[#e8dfd1] dark:border-gray-700/60 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif font-bold text-base text-[#2d241e] dark:text-gray-100">
                    {activeDomain.name}
                  </h4>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 font-bold">
                    Peligro: {activeDomain.dangerLevel}
                  </span>
                </div>

                <div className="text-xs text-[#5c4e3e] dark:text-gray-300 leading-relaxed">
                  {activeDomain.description}
                </div>

                <div className="border-t border-[#e8dfd1] dark:border-gray-700/60 pt-3 space-y-2 text-xs">
                  <div>
                    <span className="font-bold text-[#b45309]">Señor Oscuro: </span>
                    <span className="text-[#3d3228] dark:text-gray-300">{activeDomain.darklord}</span>
                  </div>
                  <div>
                    <span className="font-bold text-[#b45309]">Talismán de las Brumas: </span>
                    <span className="text-[#3d3228] dark:text-gray-300 italic">{activeDomain.mistTalisman}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* PESTAÑA 3: PELIGROS NÁUTICOS & ALTAMAR                   */}
      {/* ========================================================= */}
      {activeTab === 'naval' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Columna Izquierda: Consola de Mando del Navío */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#fcfbf7] dark:bg-[#1a1c23] border border-[#e2d9c8] dark:border-gray-800 rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-[#e2d9c8] dark:border-gray-800 pb-4 mb-4">
                <div>
                  <h3 className="text-xl font-serif font-bold text-[#2d241e] dark:text-gray-100 flex items-center gap-2">
                    <Ship className="w-5 h-5 text-[#b45309]" />
                    Pabellón del Barco
                  </h3>
                  <input
                    type="text"
                    value={shipName}
                    onChange={e => setShipName(e.target.value)}
                    className="font-serif font-bold text-sm bg-transparent border-b border-dashed border-[#b45309] text-[#2d241e] dark:text-gray-100 focus:outline-none mt-1"
                  />
                </div>

                <select
                  value={selectedShipType}
                  onChange={e => handleShipTypeChange(e.target.value as ShipType)}
                  className="text-xs font-bold px-2 py-1.5 rounded border border-[#e2d9c8] dark:border-gray-700 bg-white dark:bg-gray-800 text-[#2d241e] dark:text-gray-100"
                >
                  {SHIPS_CATALOG.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Barra de Salud del Casco */}
              <div className="mb-4">
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-[#5c4e3e] dark:text-gray-300 flex items-center gap-1">
                    <Shield className="w-3.5 h-3.5 text-[#b45309]" />
                    Integridad del Casco (CA {activeShipStats.ac})
                  </span>
                  <span className="font-mono text-[#b45309]">
                    {currentHullHp} / {activeShipStats.maxHp} PG
                  </span>
                </div>
                <div className="w-full bg-[#e8decb] dark:bg-gray-700 h-3 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      currentHullHp / activeShipStats.maxHp > 0.5
                        ? 'bg-emerald-600'
                        : currentHullHp / activeShipStats.maxHp > 0.25
                        ? 'bg-amber-500'
                        : 'bg-rose-600 animate-pulse'
                    }`}
                    style={{ width: `${Math.min(100, (currentHullHp / activeShipStats.maxHp) * 100)}%` }}
                  />
                </div>
                <div className="flex justify-end gap-2 mt-2">
                  <button
                    onClick={() => setCurrentHullHp(Math.max(0, currentHullHp - 10))}
                    className="px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 text-[10px] font-bold"
                  >
                    -10 PG Daño
                  </button>
                  <button
                    onClick={() => setCurrentHullHp(Math.min(activeShipStats.maxHp, currentHullHp + 10))}
                    className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold"
                  >
                    +10 Reparación
                  </button>
                </div>
              </div>

              {/* Estadísticas Operativas */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs mb-4">
                <div className="p-2.5 rounded bg-[#faf7f0] dark:bg-gray-800/60 border border-[#e8dfd1] dark:border-gray-700/60">
                  <span className="text-[10px] uppercase font-bold text-[#786953] dark:text-gray-400 block">Velocidad</span>
                  <span className="font-mono font-bold text-sm text-[#b45309]">{activeShipStats.speedKnots} nudos</span>
                </div>

                <div className="p-2.5 rounded bg-[#faf7f0] dark:bg-gray-800/60 border border-[#e8dfd1] dark:border-gray-700/60">
                  <span className="text-[10px] uppercase font-bold text-[#786953] dark:text-gray-400 block">Umbral Daño</span>
                  <span className="font-mono font-bold text-sm text-[#b45309]">{activeShipStats.damageThreshold}</span>
                </div>

                <div className="p-2.5 rounded bg-[#faf7f0] dark:bg-gray-800/60 border border-[#e8dfd1] dark:border-gray-700/60">
                  <span className="text-[10px] uppercase font-bold text-[#786953] dark:text-gray-400 block">Tripulación</span>
                  <span className="font-mono font-bold text-sm text-[#b45309]">{crewCount} / {activeShipStats.crewMax}</span>
                </div>
              </div>

              {/* Suministros y Millas Recorridas */}
              <div className="grid grid-cols-2 gap-2 text-xs mb-4">
                <div className="p-3 rounded bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-blue-900 dark:text-blue-200 block">Agua Dulce</span>
                    <span className="text-[10px] text-blue-700 dark:text-blue-400">1 galón / pers / día</span>
                  </div>
                  <span className="font-mono font-bold text-base text-blue-700 dark:text-blue-300">
                    {waterDays} días
                  </span>
                </div>

                <div className="p-3 rounded bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-amber-900 dark:text-amber-200 block">Millas Náuticas</span>
                    <span className="text-[10px] text-amber-700 dark:text-amber-400">Distancia total</span>
                  </div>
                  <span className="font-mono font-bold text-base text-amber-700 dark:text-amber-300">
                    {milesTraveled} mn
                  </span>
                </div>
              </div>

              {/* Selector de Estado del Mar */}
              <div className="mb-4">
                <label className="text-xs font-bold uppercase tracking-wider text-[#786953] dark:text-gray-400 block mb-1.5">
                  Estado del Mar Actual
                </label>
                <div className="grid grid-cols-5 gap-1 text-[11px] font-bold">
                  {(['calm', 'favorable', 'rough', 'storm', 'hurricane'] as const).map(c => (
                    <button
                      key={c}
                      onClick={() => setSeaCondition(c)}
                      className={`py-1.5 rounded border capitalize transition-all ${
                        seaCondition === c
                          ? 'bg-[#b45309] text-white border-[#b45309]'
                          : 'border-[#e2d9c8] dark:border-gray-800 bg-[#faf7f0] dark:bg-gray-800 text-[#6e5d48] dark:text-gray-300'
                      }`}
                    >
                      {c === 'calm' ? 'Calma' : c === 'favorable' ? 'Favorable' : c === 'rough' ? 'Gruesa' : c === 'storm' ? 'Tormenta' : 'Huracán'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Acciones de Navegación */}
              <div className="space-y-2">
                <button
                  onClick={handleAdvanceVoyageDay}
                  className="w-full py-2.5 px-4 rounded-lg bg-[#b45309] hover:bg-[#92400e] text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  <Waves className="w-4 h-4" />
                  Avanzar Jornada de Navegación (24 horas)
                </button>

                <button
                  onClick={handleRollNavalHazard}
                  className="w-full py-2.5 px-4 rounded-lg bg-stone-800 hover:bg-stone-900 dark:bg-stone-700 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  <Dices className="w-4 h-4" />
                  Tirar Peligro Náutico o Encuentro (d20)
                </button>
              </div>
            </div>
          </div>

          {/* Columna Derecha: Resolución de Peligros y Cuaderno de Bitácora */}
          <div className="lg:col-span-7 space-y-6">
            {/* Peligro Marino Activo */}
            {activeHazard && (
              <div className="bg-[#fcfbf7] dark:bg-[#1a1c23] border border-[#e2d9c8] dark:border-gray-800 rounded-xl p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-[#e2d9c8] dark:border-gray-800 pb-3">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-[#b45309]" />
                    <h4 className="font-serif font-bold text-lg text-[#2d241e] dark:text-gray-100">
                      d20 ({activeHazard.roll}): {activeHazard.title}
                    </h4>
                  </div>
                  <span className="text-xs px-2.5 py-0.5 rounded font-bold uppercase bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
                    {activeHazard.hazardType}
                  </span>
                </div>

                <p className="text-xs text-[#5c4e3e] dark:text-gray-300 leading-relaxed">
                  {activeHazard.description}
                </p>

                <div className="p-3 rounded bg-[#f5ede0] dark:bg-[#252019] border border-[#e8dfd1] dark:border-gray-800 text-xs">
                  <div className="font-bold text-[#b45309] mb-1">
                    Prueba Requerida: CD {activeHazard.dc} ({activeHazard.checkSkill})
                  </div>
                  <div className="text-[#3d3228] dark:text-gray-300">
                    <strong>Consecuencia si falla:</strong> {activeHazard.consequences}
                  </div>
                </div>

                {activeHazard.hullDamageDice && activeHazard.hullDamageDice !== '0' && (
                  <div className="flex justify-end">
                    <button
                      onClick={handleApplyHazardDamage}
                      className="py-1.5 px-3 rounded bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1.5"
                    >
                      <ShieldAlert className="w-3.5 h-3.5" />
                      Tirar Daño al Casco ({activeHazard.hullDamageDice})
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Cuaderno de Bitácora */}
            <div className="bg-[#fcfbf7] dark:bg-[#1a1c23] border border-[#e2d9c8] dark:border-gray-800 rounded-xl p-6 shadow-sm">
              <h4 className="font-serif font-bold text-base text-[#2d241e] dark:text-gray-100 flex items-center gap-2 mb-3">
                <BookOpen className="w-4 h-4 text-[#b45309]" />
                Cuaderno de Bitácora del Navío
              </h4>
              <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1 text-xs">
                {shipLog.map((entry, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded bg-[#faf7f0] dark:bg-gray-800/60 border border-[#e8dfd1] dark:border-gray-700/60 text-[#4a3f33] dark:text-gray-300 font-mono"
                  >
                    {entry}
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
