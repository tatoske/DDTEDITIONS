import React, { useState } from 'react';
import {
  Character,
  ModernSpeciesDef,
  SpeciesAsiAllocation,
  AbilityName,
  CreatureCategoryType
} from '../../types/dnd';
import { MULTIVERSE_SPECIES_DATA } from '../../data/multiverseSpeciesData';
import {
  applySpeciesToCharacter,
  validateAsiAllocation
} from '../../utils/speciesMath';
import {
  Users,
  Search,
  BookOpen,
  Sparkles,
  Zap,
  Shield,
  Eye,
  Wind,
  Waves,
  Mountain,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  UserCheck,
  ChevronRight,
  Info,
  X
} from 'lucide-react';

interface SpeciesCompendiumProps {
  characters: Character[];
  activeCharacter?: Character;
  onUpdateCharacter: (character: Character) => void;
  onShowNotification?: (message: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
}

export const SpeciesCompendium: React.FC<SpeciesCompendiumProps> = ({
  characters,
  activeCharacter,
  onUpdateCharacter,
  onShowNotification
}) => {
  // Filtros
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [originFilter, setOriginFilter] = useState<'all' | 'multiverse' | 'phb2024' | 'ravenloft'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | CreatureCategoryType>('all');
  const [speedFilter, setSpeedFilter] = useState<'all' | 'fly' | 'swim' | 'climb'>('all');

  // Modal de Asignación a Personaje
  const [isAssignModalOpen, setIsAssignModalOpen] = useState<boolean>(false);
  const [speciesToAssign, setSpeciesToAssign] = useState<ModernSpeciesDef | null>(null);
  const [selectedCharId, setSelectedCharId] = useState<string>(activeCharacter?.id || (characters[0]?.id || ''));

  // Estado del configurador ASI en el modal
  const [asiMode, setAsiMode] = useState<'two_one' | 'three_ones'>('two_one');
  const [plusTwoStat, setPlusTwoStat] = useState<AbilityName>('str');
  const [plusOneStatA, setPlusOneStatA] = useState<AbilityName>('con');
  const [plusOneStatB, setPlusOneStatB] = useState<AbilityName>('dex');
  const [plusOneStatC, setPlusOneStatC] = useState<AbilityName>('wis');
  const [spellcastingAbility, setSpellcastingAbility] = useState<AbilityName>('cha');

  // Filtrado de especies
  const filteredSpecies = MULTIVERSE_SPECIES_DATA.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.traits.some(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.desc.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesOrigin = originFilter === 'all' || s.originTag === originFilter;
    const matchesType = typeFilter === 'all' || s.creatureType === typeFilter;
    const matchesSpeed = speedFilter === 'all' || (
      speedFilter === 'fly' ? !!s.specialSpeeds?.fly :
      speedFilter === 'swim' ? !!s.specialSpeeds?.swim :
      speedFilter === 'climb' ? !!s.specialSpeeds?.climb : true
    );

    return matchesSearch && matchesOrigin && matchesType && matchesSpeed;
  });

  // Abrir modal de asignación
  const handleOpenAssignModal = (species: ModernSpeciesDef) => {
    setSpeciesToAssign(species);
    setIsAssignModalOpen(true);
  };

  // Confirmar asignación
  const handleConfirmAssignment = () => {
    if (!speciesToAssign) return;
    const targetChar = characters.find(c => c.id === selectedCharId) || activeCharacter || characters[0];
    if (!targetChar) return;

    const allocation: SpeciesAsiAllocation = asiMode === 'two_one'
      ? { mode: 'two_one', plusTwo: plusTwoStat, plusOneA: plusOneStatA }
      : { mode: 'three_ones', plusOneA: plusOneStatA, plusOneB: plusOneStatB, plusOneC: plusOneStatC };

    const validation = validateAsiAllocation(allocation);
    if (!validation.isValid) {
      if (onShowNotification) {
        onShowNotification(validation.error || 'Error en la asignación de características', 'error');
      }
      return;
    }

    const updated = applySpeciesToCharacter(targetChar, speciesToAssign, allocation, spellcastingAbility);
    onUpdateCharacter(updated);
    setIsAssignModalOpen(false);

    if (onShowNotification) {
      onShowNotification(`¡Especie ${speciesToAssign.name} asignada a ${targetChar.name} con éxito!`, 'success');
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER PRINCIPAL */}
      <div className="bg-[#fcfbf7] dark:bg-[#1a1c23] border border-[#e2d9c8] dark:border-gray-800 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Users className="w-6 h-6 text-[#b45309]" />
              <h2 className="text-2xl font-serif font-bold text-[#2d241e] dark:text-gray-100">
                Compendio de Linajes & Especies del Multiverso
              </h2>
            </div>
            <p className="text-sm text-[#786953] dark:text-gray-400 mt-1">
              Catálogo oficial de más de 35 linajes jugables de <em>Mordenkainen: Monstruos del Multiverso</em>, <em>PHB 2024</em> y <em>Guía de Van Richten</em>.
              Reglas modernas de características flexibles (+2/+1 o +1/+1/+1), tipos de criatura y rasgos innatos.
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs font-mono font-bold px-3 py-1.5 rounded-lg bg-[#ede3d1] dark:bg-gray-800 text-[#b45309]">
              {filteredSpecies.length} / {MULTIVERSE_SPECIES_DATA.length} Especies Disponibles
            </span>
          </div>
        </div>

        {/* BARRA DE FILTROS & BÚSQUEDA */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Búsqueda */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-[#786953] dark:text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nombre o rasgo..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-[#e2d9c8] dark:border-gray-700 bg-white dark:bg-gray-800 text-xs text-[#2d241e] dark:text-gray-100 placeholder-[#786953] dark:placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#b45309]"
            />
          </div>

          {/* Filtro por Libro de Origen */}
          <div>
            <select
              value={originFilter}
              onChange={e => setOriginFilter(e.target.value as any)}
              className="w-full py-2 px-3 rounded-lg border border-[#e2d9c8] dark:border-gray-700 bg-white dark:bg-gray-800 text-xs font-medium text-[#2d241e] dark:text-gray-100"
            >
              <option value="all">Origen: Todos los Manuales</option>
              <option value="multiverse">Monstruos del Multiverso (MPMM)</option>
              <option value="ravenloft">Guía de Van Richten (Ravenloft)</option>
              <option value="phb2024">Player's Handbook 2024</option>
            </select>
          </div>

          {/* Filtro por Tipo de Criatura */}
          <div>
            <select
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value as any)}
              className="w-full py-2 px-3 rounded-lg border border-[#e2d9c8] dark:border-gray-700 bg-white dark:bg-gray-800 text-xs font-medium text-[#2d241e] dark:text-gray-100"
            >
              <option value="all">Tipo: Todos los Tipos</option>
              <option value="Humanoide">Humanoide</option>
              <option value="Feérico">Feérico</option>
              <option value="Monstruosidad">Monstruosidad</option>
              <option value="Humanoide / Feérico">Humanoide / Feérico</option>
              <option value="Humanoide / No-muerto">Humanoide / No-muerto</option>
            </select>
          </div>

          {/* Filtro por Desplazamiento Especial */}
          <div>
            <select
              value={speedFilter}
              onChange={e => setSpeedFilter(e.target.value as any)}
              className="w-full py-2 px-3 rounded-lg border border-[#e2d9c8] dark:border-gray-700 bg-white dark:bg-gray-800 text-xs font-medium text-[#2d241e] dark:text-gray-100"
            >
              <option value="all">Movimiento: Cualquiera</option>
              <option value="fly">Vuelo Innato</option>
              <option value="swim">Velocidad de Nado</option>
              <option value="climb">Velocidad de Escalada</option>
            </select>
          </div>
        </div>
      </div>

      {/* GRID DE ESPECIES */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSpecies.map(species => (
          <div
            key={species.id}
            className="bg-[#fcfbf7] dark:bg-[#1a1c23] border border-[#e2d9c8] dark:border-gray-800 rounded-xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              {/* Encabezado de la Tarjeta */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#2d241e] dark:text-gray-100">
                    {species.name}
                  </h3>
                  <div className="text-[11px] text-[#786953] dark:text-gray-400 font-medium">
                    {species.sourceBook}
                  </div>
                </div>

                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                    species.creatureType.includes('Feérico')
                      ? 'bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300'
                      : species.creatureType.includes('No-muerto')
                      ? 'bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-300'
                      : 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
                  }`}
                >
                  {species.creatureType}
                </span>
              </div>

              {/* Insignias de Estadísticas Base */}
              <div className="flex flex-wrap gap-1.5 mb-3 text-[11px] font-mono">
                <span className="px-2 py-0.5 rounded bg-[#ede3d1] dark:bg-gray-800 text-[#5c4e3e] dark:text-gray-300">
                  {species.speed} m
                </span>
                {species.specialSpeeds?.fly && (
                  <span className="px-2 py-0.5 rounded bg-sky-100 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 font-bold flex items-center gap-1">
                    <Wind className="w-3 h-3" /> Vuelo {species.specialSpeeds.fly} m
                  </span>
                )}
                {species.specialSpeeds?.swim && (
                  <span className="px-2 py-0.5 rounded bg-cyan-100 dark:bg-cyan-950/60 text-cyan-800 dark:text-cyan-300 font-bold flex items-center gap-1">
                    <Waves className="w-3 h-3" /> Nado {species.specialSpeeds.swim} m
                  </span>
                )}
                {species.specialSpeeds?.climb && (
                  <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold flex items-center gap-1">
                    <Mountain className="w-3 h-3" /> Escalar {species.specialSpeeds.climb} m
                  </span>
                )}
                {species.darkvision > 0 && (
                  <span className="px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300 flex items-center gap-1">
                    <Eye className="w-3 h-3" /> Visión {species.darkvision} m
                  </span>
                )}
                <span className="px-2 py-0.5 rounded bg-[#f5ede0] dark:bg-[#252019] text-[#786953] dark:text-gray-400">
                  Tamaño: {species.size}
                </span>
              </div>

              {/* Descripción Narrativa */}
              <p className="text-xs text-[#5c4e3e] dark:text-gray-300 italic mb-4 line-clamp-2">
                "{species.description}"
              </p>

              {/* Rasgos Notables */}
              <div className="space-y-2 mb-4">
                <span className="text-[10px] uppercase tracking-wider font-bold text-[#786953] dark:text-gray-400 block">
                  Rasgos Raciales ({species.traits.length})
                </span>
                <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
                  {species.traits.map((trait, idx) => (
                    <div
                      key={idx}
                      className="p-2 rounded bg-[#faf7f0] dark:bg-gray-800/60 border border-[#e8dfd1] dark:border-gray-700/60 text-xs"
                    >
                      <strong className="text-[#b45309]">{trait.name}: </strong>
                      <span className="text-[#4a3f33] dark:text-gray-300 text-[11px]">{trait.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Botón de Asignación */}
            <div className="pt-3 border-t border-[#e2d9c8] dark:border-gray-800">
              <button
                onClick={() => handleOpenAssignModal(species)}
                className="w-full py-2 px-3 rounded-lg bg-[#b45309] hover:bg-[#92400e] text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-1.5"
              >
                <UserCheck className="w-3.5 h-3.5" />
                Asignar Linaje al Aventurero
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ========================================================= */}
      {/* MODAL: ASIGNACIÓN Y CONFIGURACIÓN DE CARACTERÍSTICAS (ASI) */}
      {/* ========================================================= */}
      {isAssignModalOpen && speciesToAssign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-[#fcfbf7] dark:bg-[#1a1c23] border border-[#e2d9c8] dark:border-gray-800 rounded-xl p-6 max-w-lg w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#e2d9c8] dark:border-gray-800 pb-3">
              <div>
                <h3 className="text-xl font-serif font-bold text-[#2d241e] dark:text-gray-100">
                  Asignar Linaje: {speciesToAssign.name}
                </h3>
                <span className="text-xs text-[#786953] dark:text-gray-400">
                  {speciesToAssign.sourceBook}
                </span>
              </div>
              <button
                onClick={() => setIsAssignModalOpen(false)}
                className="p-1 rounded text-gray-500 hover:text-black dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Selector de Aventurero */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#786953] dark:text-gray-400 block mb-1.5">
                Seleccionar Aventurero Objetivo
              </label>
              <select
                value={selectedCharId}
                onChange={e => setSelectedCharId(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-[#e2d9c8] dark:border-gray-700 bg-white dark:bg-gray-800 text-xs font-bold text-[#2d241e] dark:text-gray-100"
              >
                {characters.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.species} • {c.className} Nvl {c.level})
                  </option>
                ))}
              </select>
            </div>

            {/* Selector de Regla ASI */}
            <div className="bg-[#faf7f0] dark:bg-gray-800/60 p-4 rounded-lg border border-[#e8dfd1] dark:border-gray-700 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#b45309] block">
                Mejora de Características Flexible (Reglas 2024)
              </span>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setAsiMode('two_one')}
                  className={`flex-1 py-1.5 px-2 rounded text-xs font-bold transition-all ${
                    asiMode === 'two_one'
                      ? 'bg-[#b45309] text-white shadow-sm'
                      : 'bg-[#ede3d1] dark:bg-gray-700 text-[#5c4e3e] dark:text-gray-300'
                  }`}
                >
                  +2 a una / +1 a otra
                </button>
                <button
                  type="button"
                  onClick={() => setAsiMode('three_ones')}
                  className={`flex-1 py-1.5 px-2 rounded text-xs font-bold transition-all ${
                    asiMode === 'three_ones'
                      ? 'bg-[#b45309] text-white shadow-sm'
                      : 'bg-[#ede3d1] dark:bg-gray-700 text-[#5c4e3e] dark:text-gray-300'
                  }`}
                >
                  +1 a tres distintas
                </button>
              </div>

              {/* Controles de selección de estadísticas */}
              {asiMode === 'two_one' ? (
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-[11px] font-bold text-[#5c4e3e] dark:text-gray-300 mb-1">
                      Característica (+2)
                    </label>
                    <select
                      value={plusTwoStat}
                      onChange={e => setPlusTwoStat(e.target.value as AbilityName)}
                      className="w-full p-2 rounded border border-[#e2d9c8] dark:border-gray-700 bg-white dark:bg-gray-800 font-bold"
                    >
                      <option value="str">Fuerza (STR)</option>
                      <option value="dex">Destreza (DEX)</option>
                      <option value="con">Constitución (CON)</option>
                      <option value="int">Inteligencia (INT)</option>
                      <option value="wis">Sabiduría (WIS)</option>
                      <option value="cha">Carisma (CHA)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#5c4e3e] dark:text-gray-300 mb-1">
                      Característica (+1)
                    </label>
                    <select
                      value={plusOneStatA}
                      onChange={e => setPlusOneStatA(e.target.value as AbilityName)}
                      className="w-full p-2 rounded border border-[#e2d9c8] dark:border-gray-700 bg-white dark:bg-gray-800 font-bold"
                    >
                      <option value="str">Fuerza (STR)</option>
                      <option value="dex">Destreza (DEX)</option>
                      <option value="con">Constitución (CON)</option>
                      <option value="int">Inteligencia (INT)</option>
                      <option value="wis">Sabiduría (WIS)</option>
                      <option value="cha">Carisma (CHA)</option>
                    </select>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <label className="block text-[10px] font-bold text-[#5c4e3e] dark:text-gray-300 mb-1">
                      Primera (+1)
                    </label>
                    <select
                      value={plusOneStatA}
                      onChange={e => setPlusOneStatA(e.target.value as AbilityName)}
                      className="w-full p-1.5 rounded border border-[#e2d9c8] dark:border-gray-700 bg-white dark:bg-gray-800 text-xs"
                    >
                      <option value="str">Fuerza</option>
                      <option value="dex">Destreza</option>
                      <option value="con">Constitución</option>
                      <option value="int">Inteligencia</option>
                      <option value="wis">Sabiduría</option>
                      <option value="cha">Carisma</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-[#5c4e3e] dark:text-gray-300 mb-1">
                      Segunda (+1)
                    </label>
                    <select
                      value={plusOneStatB}
                      onChange={e => setPlusOneStatB(e.target.value as AbilityName)}
                      className="w-full p-1.5 rounded border border-[#e2d9c8] dark:border-gray-700 bg-white dark:bg-gray-800 text-xs"
                    >
                      <option value="str">Fuerza</option>
                      <option value="dex">Destreza</option>
                      <option value="con">Constitución</option>
                      <option value="int">Inteligencia</option>
                      <option value="wis">Sabiduría</option>
                      <option value="cha">Carisma</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-[#5c4e3e] dark:text-gray-300 mb-1">
                      Tercera (+1)
                    </label>
                    <select
                      value={plusOneStatC}
                      onChange={e => setPlusOneStatC(e.target.value as AbilityName)}
                      className="w-full p-1.5 rounded border border-[#e2d9c8] dark:border-gray-700 bg-white dark:bg-gray-800 text-xs"
                    >
                      <option value="str">Fuerza</option>
                      <option value="dex">Destreza</option>
                      <option value="con">Constitución</option>
                      <option value="int">Inteligencia</option>
                      <option value="wis">Sabiduría</option>
                      <option value="cha">Carisma</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Aptitud Mágica para Conjuros Innatos */}
            <div className="text-xs space-y-1">
              <label className="font-bold text-[#5c4e3e] dark:text-gray-300 block">
                Aptitud Mágica para Conjuros Innatos (si aplica)
              </label>
              <div className="flex gap-2">
                {(['int', 'wis', 'cha'] as const).map(ab => (
                  <button
                    key={ab}
                    type="button"
                    onClick={() => setSpellcastingAbility(ab)}
                    className={`flex-1 py-1.5 rounded font-bold uppercase transition-all ${
                      spellcastingAbility === ab
                        ? 'bg-[#b45309] text-white shadow-sm'
                        : 'bg-[#ede3d1] dark:bg-gray-700 text-[#5c4e3e] dark:text-gray-300'
                    }`}
                  >
                    {ab === 'int' ? 'Inteligencia' : ab === 'wis' ? 'Sabiduría' : 'Carisma'}
                  </button>
                ))}
              </div>
            </div>

            {/* Resumen de Cambios */}
            <div className="p-3 rounded bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/50 text-xs text-amber-900 dark:text-amber-200 space-y-1">
              <div className="font-bold flex items-center gap-1">
                <Info className="w-3.5 h-3.5" />
                Resumen de Actualización:
              </div>
              <div>• Especie pasará a: <strong>{speciesToAssign.name}</strong></div>
              <div>• Velocidad: <strong>{speciesToAssign.speed} metros</strong></div>
              <div>• {speciesToAssign.traits.length} rasgos raciales serán agregados a la pestaña de Rasgos.</div>
              {speciesToAssign.id === 'tortle' && (
                <div>• Armadura Natural fija de <strong>CA 17</strong> será aplicada.</div>
              )}
            </div>

            {/* Botones de Confirmación */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsAssignModalOpen(false)}
                className="py-2 px-4 rounded-lg bg-stone-200 hover:bg-stone-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-[#2d241e] dark:text-gray-200 text-xs font-bold"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmAssignment}
                className="py-2 px-4 rounded-lg bg-[#b45309] hover:bg-[#92400e] text-white text-xs font-bold shadow-sm"
              >
                Confirmar y Aplicar Especie
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
