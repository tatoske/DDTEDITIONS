import React, { useState } from 'react';
import { Character, DragonmarkDef, ArcaneProstheticDef } from '../../types/dnd';
import { DRAGONMARKS_DATA, ARCANE_PROSTHETICS_DATA } from '../../data/dragonmarksData';
import { 
  checkHasIntuitionDie, 
  rollIntuitionCheck, 
  applyDragonmarkToCharacter, 
  removeDragonmarkFromCharacter,
  addProstheticToCharacter,
  removeProstheticFromCharacter 
} from '../../utils/dragonmarkMath';
import { 
  Zap, 
  Sparkles, 
  Shield, 
  Flame, 
  Wand2, 
  Eye, 
  Search, 
  Dices, 
  Check, 
  Trash2, 
  AlertTriangle, 
  BookOpen, 
  Compass, 
  Layers,
  Award,
  ChevronRight
} from 'lucide-react';

interface DragonmarksCompendiumProps {
  activeCharacter?: Character;
  onUpdateCharacter?: (updated: Character) => void;
  onNotify?: (msg: string) => void;
}

export const DragonmarksCompendium: React.FC<DragonmarksCompendiumProps> = ({
  activeCharacter,
  onUpdateCharacter,
  onNotify
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'houses' | 'aberrant' | 'prosthetics'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [inspectingMark, setInspectingMark] = useState<DragonmarkDef | null>(null);
  const [inspectingProsthetic, setInspectingProsthetic] = useState<ArcaneProstheticDef | null>(null);

  // Simulador de Intuición
  const [simSkill, setSimSkill] = useState<string>('investigacion');
  const [simResult, setSimResult] = useState<{ d20: number; d4: number | null; total: number; isIntuitionApplied: boolean; formula: string } | null>(null);

  const filteredMarks = DRAGONMARKS_DATA.filter(mark => {
    if (activeTab === 'houses' && mark.type === 'aberrant') return false;
    if (activeTab === 'aberrant' && mark.type !== 'aberrant') return false;
    if (activeTab === 'prosthetics') return false;

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchName = mark.name.toLowerCase().includes(q);
      const matchHouse = mark.houseName.toLowerCase().includes(q);
      const matchDesc = mark.description.toLowerCase().includes(q);
      const matchSkill = mark.intuitionSkillLabels.some(s => s.toLowerCase().includes(q));
      return matchName || matchHouse || matchDesc || matchSkill;
    }
    return true;
  });

  const filteredProsthetics = ARCANE_PROSTHETICS_DATA.filter(p => {
    if (activeTab !== 'all' && activeTab !== 'prosthetics') return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchDesc = p.description.toLowerCase().includes(q);
      const matchTag = p.tagline.toLowerCase().includes(q);
      return matchName || matchDesc || matchTag;
    }
    return true;
  });

  const handleApplyMark = (mark: DragonmarkDef) => {
    if (!activeCharacter || !onUpdateCharacter) return;
    const updated = applyDragonmarkToCharacter(activeCharacter, mark);
    onUpdateCharacter(updated);
    if (onNotify) {
      onNotify(`¡${activeCharacter.name} ha manifestado la ${mark.name}!`);
    }
  };

  const handleRemoveMark = () => {
    if (!activeCharacter || !onUpdateCharacter) return;
    const updated = removeDragonmarkFromCharacter(activeCharacter);
    onUpdateCharacter(updated);
    if (onNotify) {
      onNotify(`Marca del Dragón retirada de ${activeCharacter.name}.`);
    }
  };

  const handleToggleProsthetic = (prosthetic: ArcaneProstheticDef) => {
    if (!activeCharacter || !onUpdateCharacter) return;
    const isEquipped = activeCharacter.prosthetics?.some(p => p.id === prosthetic.id);
    if (isEquipped) {
      const updated = removeProstheticFromCharacter(activeCharacter, prosthetic.id);
      onUpdateCharacter(updated);
      if (onNotify) onNotify(`Prótesis "${prosthetic.name}" desequipada de ${activeCharacter.name}.`);
    } else {
      const updated = addProstheticToCharacter(activeCharacter, prosthetic);
      onUpdateCharacter(updated);
      if (onNotify) onNotify(`¡Prótesis "${prosthetic.name}" acoplada con éxito a ${activeCharacter.name}!`);
    }
  };

  const handleRunSimulation = () => {
    if (!activeCharacter) return;
    const res = rollIntuitionCheck(activeCharacter, simSkill, 3);
    setSimResult(res);
  };

  return (
    <div className="space-y-6">
      {/* HEADER DEL COMPENDIO */}
      <div className="bg-[#fcfbf7] dark:bg-[#1a1c23] border border-[#e2d9c8] dark:border-gray-800 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Zap className="w-6 h-6 text-[#0284c7]" />
              <h2 className="text-2xl font-serif font-bold text-[#2d241e] dark:text-gray-100">
                Marcas del Dragón & Prótesis Arcanas
              </h2>
            </div>
            <p className="text-sm text-[#786953] dark:text-gray-400 mt-1">
              Mecánicas oficiales de <em>Eberron: Surgiendo de la Última Guerra</em>.
              Linajes marcados por las Casas de Khorvaire, dados de intuición (+1d4) y componentes tecnomágicos forjados.
            </p>
          </div>

          {/* Estado del Personaje Activo */}
          {activeCharacter && (
            <div className="bg-[#f5ede0] dark:bg-gray-800/80 p-3.5 rounded-xl border border-[#dfd2be] dark:border-gray-700 min-w-[240px]">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#8c6b3e] dark:text-amber-400 mb-1">
                Aventurero: {activeCharacter.name}
              </div>
              {activeCharacter.dragonmark ? (
                <div className="flex items-center justify-between gap-2">
                  <div className="text-xs font-bold text-emerald-800 dark:text-emerald-300 truncate">
                    ★ {activeCharacter.dragonmark.name}
                  </div>
                  <button
                    onClick={handleRemoveMark}
                    className="text-[11px] text-red-600 hover:text-red-700 font-bold flex items-center gap-0.5 flex-shrink-0"
                    title="Quitar marca del dragón"
                  >
                    <Trash2 className="w-3 h-3" /> Quitar
                  </button>
                </div>
              ) : (
                <div className="text-xs text-[#786953] dark:text-gray-400">
                  Sin Marca del Dragón asignada
                </div>
              )}
              {activeCharacter.prosthetics && activeCharacter.prosthetics.length > 0 && (
                <div className="mt-1.5 pt-1.5 border-t border-[#e2d9c8] dark:border-gray-700 text-[11px] text-[#5e4f3c] dark:text-gray-300">
                  <strong>Prótesis:</strong> {activeCharacter.prosthetics.length} equipada(s)
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* SIMULADOR DE DADO DE INTUICIÓN (1d20 + 1d4) */}
      {activeCharacter && (
        <div className="bg-[#f5ede0] dark:bg-gray-900/50 p-4 rounded-xl border border-[#ded1be] dark:border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-700 dark:text-amber-300 flex items-center justify-center flex-shrink-0 font-bold">
              <Dices className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-[#2d241e] dark:text-gray-100">
                Simulador del Dado de Intuición (+1d4)
              </h4>
              <p className="text-xs text-[#786953] dark:text-gray-400">
                Comprueba si la marca activa de {activeCharacter.name} otorga un dado extra en la prueba de habilidad.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <select
              value={simSkill}
              onChange={e => setSimSkill(e.target.value)}
              className="px-3 py-1.5 bg-[#fffefb] dark:bg-gray-800 border border-[#dfd2be] dark:border-gray-700 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              <option value="investigacion">Investigación</option>
              <option value="percepcion">Percepción</option>
              <option value="perspicacia">Perspicacia (Intuición)</option>
              <option value="supervivencia">Supervivencia</option>
              <option value="medicina">Medicina</option>
              <option value="persuasion">Persuasión</option>
              <option value="acrobacias">Acrobacias</option>
              <option value="historia">Historia</option>
              <option value="sigilo">Sigilo</option>
              <option value="interpretacion">Interpretación</option>
              <option value="animales">Trato con Animales</option>
              <option value="arcanos">Conocimiento Arcano</option>
              <option value="atletismo">Atletismo (Sin Marca)</option>
            </select>

            <button
              onClick={handleRunSimulation}
              className="px-4 py-1.5 bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5 transition-colors"
            >
              <Dices className="w-3.5 h-3.5" />
              Probar Tirada
            </button>

            {simResult && (
              <div className="px-3 py-1.5 bg-[#fffefb] dark:bg-gray-800 border border-[#e2d9c8] dark:border-gray-700 rounded-lg text-xs font-mono font-bold animate-fadeIn">
                {simResult.isIntuitionApplied ? (
                  <span className="text-emerald-700 dark:text-emerald-300">
                    ★ {simResult.formula} (¡Dado de Intuición activo!)
                  </span>
                ) : (
                  <span className="text-[#786953] dark:text-gray-400">
                    {simResult.formula} (Prueba regular sin dado de marca)
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* FILTROS Y BUSCADOR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center bg-[#ede3d1] dark:bg-gray-800 p-1 rounded-lg text-xs font-bold flex-wrap gap-1">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'all' 
                ? 'bg-[#0284c7] text-white shadow-sm' 
                : 'text-[#6e5d48] dark:text-gray-300 hover:text-black dark:hover:text-white'
            }`}
          >
            Todo ({DRAGONMARKS_DATA.length + ARCANE_PROSTHETICS_DATA.length})
          </button>
          <button
            onClick={() => setActiveTab('houses')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'houses' 
                ? 'bg-[#0284c7] text-white shadow-sm' 
                : 'text-[#6e5d48] dark:text-gray-300 hover:text-black dark:hover:text-white'
            }`}
          >
            Casas de Khorvaire (11)
          </button>
          <button
            onClick={() => setActiveTab('aberrant')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'aberrant' 
                ? 'bg-[#0284c7] text-white shadow-sm' 
                : 'text-[#6e5d48] dark:text-gray-300 hover:text-black dark:hover:text-white'
            }`}
          >
            Marca Aberrante (1)
          </button>
          <button
            onClick={() => setActiveTab('prosthetics')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'prosthetics' 
                ? 'bg-[#0284c7] text-white shadow-sm' 
                : 'text-[#6e5d48] dark:text-gray-300 hover:text-black dark:hover:text-white'
            }`}
          >
            Prótesis Arcanas ({ARCANE_PROSTHETICS_DATA.length})
          </button>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-[#8c6b3e] absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Buscar por marca, casa o habilidad..."
            className="pl-9 pr-3 py-1.5 bg-[#fffefb] dark:bg-gray-800 border border-[#dfd2be] dark:border-gray-700 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 w-72"
          />
        </div>
      </div>

      {/* SECCIÓN 1: MARCAS DEL DRAGÓN */}
      {filteredMarks.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-serif font-bold text-[#2d241e] dark:text-gray-100 flex items-center gap-2">
            <Zap className="w-5 h-5 text-[#0284c7]" />
            Marcas del Dragón ({filteredMarks.length})
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredMarks.map(mark => {
              const isEquipped = activeCharacter?.dragonmark?.markId === mark.id;
              return (
                <div
                  key={mark.id}
                  className={`bg-[#fffefb] dark:bg-gray-800/80 rounded-xl border p-5 transition-all flex flex-col justify-between ${
                    isEquipped
                      ? 'border-2 border-[#0284c7] shadow-md ring-2 ring-blue-500/20'
                      : 'border-[#e2d9c8] dark:border-gray-700 hover:border-blue-400 shadow-sm'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-2.5">
                      <span
                        className="text-[11px] font-bold px-2.5 py-0.5 rounded-full text-white"
                        style={{ backgroundColor: mark.badgeColor }}
                      >
                        {mark.houseName}
                      </span>
                      <span className="text-[10px] text-[#786953] dark:text-gray-400 bg-[#ede3d1] dark:bg-gray-700 px-2 py-0.5 rounded font-semibold">
                        {mark.speciesBase}
                      </span>
                    </div>

                    <h4 className="font-serif font-bold text-lg text-[#2d241e] dark:text-gray-100 mb-0.5">
                      {mark.name}
                    </h4>
                    <p className="text-xs text-[#786953] dark:text-gray-400 italic mb-3">
                      "{mark.tagline}"
                    </p>
                    <p className="text-xs text-[#4a3b2c] dark:text-gray-300 leading-relaxed mb-4 line-clamp-3">
                      {mark.description}
                    </p>

                    {/* Dados de Intuición (+1d4) */}
                    <div className="p-2.5 bg-blue-50/60 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800 mb-3">
                      <span className="text-[11px] font-bold text-blue-900 dark:text-blue-300 flex items-center gap-1 mb-1">
                        <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                        Dado de Intuición (+1d4) en:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {mark.intuitionSkillLabels.map((lbl, i) => (
                          <span key={i} className="text-[10px] bg-white dark:bg-gray-800 text-blue-800 dark:text-blue-200 px-2 py-0.5 rounded border border-blue-300 dark:border-blue-700 font-semibold">
                            +{lbl}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Hechizos Innatos */}
                    <div className="text-xs space-y-1 mb-3">
                      <span className="text-[11px] font-bold text-[#8c6b3e] dark:text-amber-400 uppercase tracking-wider block">
                        Conjuros Innatos:
                      </span>
                      {mark.innateSpells.map((sp, idx) => (
                        <div key={idx} className="text-[#524332] dark:text-gray-300 text-[11px]">
                          • <strong>{sp.name}</strong> ({sp.level === 0 ? 'Truco' : `Nvl ${sp.level}`})
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Acciones */}
                  <div className="pt-4 border-t border-[#f0e7d8] dark:border-gray-700 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setInspectingMark(mark)}
                      className="text-xs text-[#0284c7] dark:text-blue-400 font-bold hover:underline flex items-center gap-1"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      Detalles
                    </button>

                    {isEquipped ? (
                      <button
                        onClick={handleRemoveMark}
                        className="px-3 py-1.5 bg-red-100 dark:bg-red-950/60 hover:bg-red-200 text-red-700 dark:text-red-300 text-xs font-bold rounded-lg transition-colors flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        Retirar Marca
                      </button>
                    ) : (
                      <button
                        onClick={() => handleApplyMark(mark)}
                        disabled={!activeCharacter}
                        className="px-3 py-1.5 bg-[#0284c7] hover:bg-[#0369a1] disabled:opacity-50 text-white text-xs font-bold rounded-lg shadow-sm transition-colors flex items-center gap-1"
                      >
                        <Zap className="w-3.5 h-3.5" />
                        Manifestar
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SECCIÓN 2: PRÓTESIS ARCANAS & MEJORAS FORJADAS */}
      {filteredProsthetics.length > 0 && (
        <div className="space-y-4 pt-6">
          <h3 className="text-lg font-serif font-bold text-[#2d241e] dark:text-gray-100 flex items-center gap-2">
            <Shield className="w-5 h-5 text-amber-600" />
            Prótesis Arcanas & Componentes Forjados ({filteredProsthetics.length})
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredProsthetics.map(prosthetic => {
              const isEquipped = activeCharacter?.prosthetics?.some(p => p.id === prosthetic.id);
              return (
                <div
                  key={prosthetic.id}
                  className={`bg-[#fffefb] dark:bg-gray-800/80 rounded-xl border p-5 transition-all flex flex-col justify-between ${
                    isEquipped
                      ? 'border-2 border-amber-600 shadow-md ring-2 ring-amber-500/20'
                      : 'border-[#e2d9c8] dark:border-gray-700 hover:border-amber-400 shadow-sm'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-2.5">
                      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                        prosthetic.rarity === 'Común'
                          ? 'bg-gray-600 text-white'
                          : prosthetic.rarity === 'Poco común'
                          ? 'bg-emerald-600 text-white'
                          : prosthetic.rarity === 'Raro'
                          ? 'bg-blue-600 text-white'
                          : 'bg-purple-600 text-white'
                      }`}>
                        {prosthetic.rarity}
                      </span>
                      <span className="text-[10px] text-[#786953] dark:text-gray-400 bg-[#ede3d1] dark:bg-gray-700 px-2 py-0.5 rounded font-semibold">
                        {prosthetic.requiresAttunement ? 'Sintonización' : 'Sin Sintonización'}
                      </span>
                    </div>

                    <h4 className="font-serif font-bold text-lg text-[#2d241e] dark:text-gray-100 mb-0.5">
                      {prosthetic.name}
                    </h4>
                    <p className="text-xs text-[#786953] dark:text-gray-400 italic mb-3">
                      "{prosthetic.tagline}"
                    </p>
                    <p className="text-xs text-[#4a3b2c] dark:text-gray-300 leading-relaxed mb-4 line-clamp-3">
                      {prosthetic.description}
                    </p>

                    {/* Arma integrada si tiene */}
                    {prosthetic.integratedWeapon && (
                      <div className="p-2.5 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800 mb-3 text-xs">
                        <span className="font-bold text-amber-900 dark:text-amber-300 block mb-0.5">
                          ⚔️ {prosthetic.integratedWeapon.name}:
                        </span>
                        <div className="text-amber-800 dark:text-amber-200">
                          {prosthetic.integratedWeapon.damage} • Alcance: {prosthetic.integratedWeapon.range}
                        </div>
                      </div>
                    )}

                    {/* Beneficios */}
                    <div className="space-y-1 text-xs text-[#524332] dark:text-gray-300 mb-3">
                      {prosthetic.mechanicalBenefits.slice(0, 2).map((b, i) => (
                        <div key={i} className="flex items-start gap-1.5 text-[11px]">
                          <Check className="w-3 h-3 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <span>{b}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Acciones */}
                  <div className="pt-4 border-t border-[#f0e7d8] dark:border-gray-700 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setInspectingProsthetic(prosthetic)}
                      className="text-xs text-amber-700 dark:text-amber-400 font-bold hover:underline flex items-center gap-1"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      Detalles
                    </button>

                    <button
                      onClick={() => handleToggleProsthetic(prosthetic)}
                      disabled={!activeCharacter}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg shadow-sm transition-colors flex items-center gap-1 ${
                        isEquipped
                          ? 'bg-red-600 hover:bg-red-700 text-white'
                          : 'bg-[#b45309] hover:bg-[#92400e] text-white'
                      }`}
                    >
                      {isEquipped ? 'Desequipar' : 'Equipar Prótesis'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MODAL EXPANDIDO DE MARCA */}
      {inspectingMark && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#fffefb] dark:bg-[#1a1c23] border-2 border-[#0284c7] rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto animate-fadeIn">
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#e2d9c8] dark:border-gray-800">
              <div>
                <span
                  className="text-xs font-bold px-2.5 py-0.5 rounded-full text-white inline-block mb-1"
                  style={{ backgroundColor: inspectingMark.badgeColor }}
                >
                  {inspectingMark.houseName} • {inspectingMark.speciesBase}
                </span>
                <h3 className="text-2xl font-serif font-bold text-[#2d241e] dark:text-gray-100">
                  {inspectingMark.name}
                </h3>
                <p className="text-xs text-[#786953] dark:text-gray-400 italic">
                  "{inspectingMark.tagline}"
                </p>
              </div>
              <button
                onClick={() => setInspectingMark(null)}
                className="text-[#8c6b3e] hover:text-black dark:text-gray-400 dark:hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-[#4a3b2c] dark:text-gray-300 leading-relaxed">
              {inspectingMark.description}
            </p>

            {/* Rasgo Especial y Dados de Intuición */}
            <div className="p-3.5 bg-blue-50/60 dark:bg-blue-950/20 rounded-xl border border-blue-200 dark:border-blue-800 text-xs space-y-2">
              <div className="font-bold text-blue-900 dark:text-blue-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-blue-600" />
                {inspectingMark.specialTrait.title}
              </div>
              <p className="text-blue-800 dark:text-blue-200 leading-relaxed">
                {inspectingMark.specialTrait.description}
              </p>
            </div>

            {/* Conjuros Innatos */}
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-[#8c6b3e] dark:text-amber-400 mb-2">
                Conjuros Innatos de la Marca:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {inspectingMark.innateSpells.map((sp, idx) => (
                  <div key={idx} className="p-3 bg-[#fbf9f4] dark:bg-gray-800/60 rounded-lg border border-[#e8dfcf] dark:border-gray-700 text-xs">
                    <div className="flex items-center justify-between font-bold text-[#2d241e] dark:text-gray-100 mb-1">
                      <span>{sp.name}</span>
                      <span className="text-[10px] text-blue-600 font-semibold">{sp.level === 0 ? 'Truco' : `Nivel ${sp.level}`}</span>
                    </div>
                    <div className="text-[11px] text-[#786953] dark:text-gray-400 mb-1">
                      {sp.castingTime} • Alcance: {sp.range}
                    </div>
                    <p className="text-[11px] text-[#524332] dark:text-gray-300 leading-tight">
                      {sp.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Conjuros de la Marca para Conjuradores */}
            <div className="p-3.5 bg-[#fbf9f4] dark:bg-gray-800/60 rounded-xl border border-[#e8dfcf] dark:border-gray-700 text-xs">
              <span className="font-bold text-[#8c6b3e] dark:text-amber-400 block mb-1">
                Conjuros de la Marca (Se agregan a la lista de conjuros si eres lanzador):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {inspectingMark.spellsOfTheMark.map((sp, i) => (
                  <span key={i} className="bg-[#ede3d1] dark:bg-gray-700 text-[#524332] dark:text-gray-200 px-2 py-0.5 rounded text-[11px]">
                    {sp}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-[#e2d9c8] dark:border-gray-800 flex justify-end gap-3">
              <button
                onClick={() => setInspectingMark(null)}
                className="px-4 py-2 border border-[#dfd2be] dark:border-gray-700 rounded-lg text-xs font-bold hover:bg-[#ede3d1] transition-colors"
              >
                Cerrar
              </button>
              {activeCharacter && (
                <button
                  onClick={() => {
                    handleApplyMark(inspectingMark);
                    setInspectingMark(null);
                  }}
                  className="px-4 py-2 bg-[#0284c7] hover:bg-[#0369a1] text-white rounded-lg text-xs font-bold shadow transition-colors flex items-center gap-1.5"
                >
                  <Zap className="w-4 h-4" />
                  Manifestar en {activeCharacter.name}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL EXPANDIDO DE PRÓTESIS */}
      {inspectingProsthetic && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#fffefb] dark:bg-[#1a1c23] border-2 border-amber-600 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto animate-fadeIn">
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#e2d9c8] dark:border-gray-800">
              <div>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-600 text-white inline-block mb-1">
                  {inspectingProsthetic.rarity} • {inspectingProsthetic.requiresAttunement ? 'Requiere Sintonización' : 'Sin Sintonización'}
                </span>
                <h3 className="text-2xl font-serif font-bold text-[#2d241e] dark:text-gray-100">
                  {inspectingProsthetic.name}
                </h3>
                <p className="text-xs text-[#786953] dark:text-gray-400 italic">
                  "{inspectingProsthetic.tagline}"
                </p>
              </div>
              <button
                onClick={() => setInspectingProsthetic(null)}
                className="text-[#8c6b3e] hover:text-black dark:text-gray-400 dark:hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-[#4a3b2c] dark:text-gray-300 leading-relaxed">
              {inspectingProsthetic.description}
            </p>

            {/* Beneficios */}
            <div className="space-y-2">
              <h4 className="font-bold text-xs uppercase tracking-wider text-amber-700 dark:text-amber-400">
                Propiedades Mecánicas & Beneficios:
              </h4>
              {inspectingProsthetic.mechanicalBenefits.map((b, idx) => (
                <div key={idx} className="p-2.5 bg-[#fbf9f4] dark:bg-gray-800/60 rounded-lg border border-[#e8dfcf] dark:border-gray-700 text-xs flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span className="text-[#524332] dark:text-gray-300">{b}</span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-[#e2d9c8] dark:border-gray-800 flex justify-end gap-3">
              <button
                onClick={() => setInspectingProsthetic(null)}
                className="px-4 py-2 border border-[#dfd2be] dark:border-gray-700 rounded-lg text-xs font-bold hover:bg-[#ede3d1] transition-colors"
              >
                Cerrar
              </button>
              {activeCharacter && (
                <button
                  onClick={() => {
                    handleToggleProsthetic(inspectingProsthetic);
                    setInspectingProsthetic(null);
                  }}
                  className="px-4 py-2 bg-[#b45309] hover:bg-[#92400e] text-white rounded-lg text-xs font-bold shadow transition-colors flex items-center gap-1.5"
                >
                  <Shield className="w-4 h-4" />
                  {activeCharacter.prosthetics?.some(p => p.id === inspectingProsthetic.id) ? 'Desequipar' : 'Equipar Prótesis'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
