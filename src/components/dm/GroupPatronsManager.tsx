import React, { useState } from 'react';
import { 
  GroupPatronDef, 
  ActivePatronCampaignState, 
  PatronMission, 
  PatronIntrigueEntry,
  Character 
} from '../../types/dnd';
import { GROUP_PATRONS_DATA } from '../../data/groupPatronsData';
import { 
  getReputationTier, 
  modifyPatronReputation, 
  modifyPatronFavors,
  rollPatronMission, 
  rollPatronIntrigue,
  resolveMissionOutcome,
  distributeStipend 
} from '../../utils/patronMath';
import { 
  Crown, 
  Shield, 
  Coins, 
  Award, 
  Sparkles, 
  Scroll, 
  UserCheck, 
  Eye, 
  EyeOff, 
  Dices, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  BookOpen, 
  Search, 
  Compass, 
  Check, 
  ChevronRight,
  TrendingUp,
  Briefcase
} from 'lucide-react';

interface GroupPatronsManagerProps {
  characters: Character[];
  onUpdateCharacters?: (updated: Character[]) => void;
  activeCampaignPatron?: ActivePatronCampaignState | null;
  onUpdateCampaignPatron?: (state: ActivePatronCampaignState | null) => void;
  onNotify?: (msg: string) => void;
}

export const GroupPatronsManager: React.FC<GroupPatronsManagerProps> = ({
  characters,
  onUpdateCharacters,
  activeCampaignPatron,
  onUpdateCampaignPatron,
  onNotify
}) => {
  const [selectedBook, setSelectedBook] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [inspectingPatron, setInspectingPatron] = useState<GroupPatronDef | null>(null);
  const [revealedSecrets, setRevealedSecrets] = useState<Record<string, boolean>>({});
  const [generatedMission, setGeneratedMission] = useState<PatronMission | null>(null);
  const [generatedIntrigue, setGeneratedIntrigue] = useState<PatronIntrigueEntry | null>(null);

  // Local fallback state if not supplied from parent App
  const [localPatronState, setLocalPatronState] = useState<ActivePatronCampaignState | null>(() => {
    // Default to Tasha Academy if none
    return {
      patronId: 'tasha_academy',
      reputationScore: 2,
      favorsOwed: 1,
      totalGoldEarnedFromPatron: 250,
      missions: [
        {
          id: 'pm_initial_1',
          patronId: 'tasha_academy',
          title: 'El Grimorio de las Siete Lunas',
          prompt: 'Un grimorio de magia abjurativa fue robado de la sección restringida por un estudiante expulsado.',
          target: 'Torre en ruinas en los Pantanos del Este',
          rewardGp: 250,
          favorReward: 1,
          assignedDate: 'En curso',
          status: 'pending'
        }
      ]
    };
  });

  const campaignPatron = activeCampaignPatron !== undefined ? activeCampaignPatron : localPatronState;

  const updatePatronState = (newState: ActivePatronCampaignState | null) => {
    if (onUpdateCampaignPatron) {
      onUpdateCampaignPatron(newState);
    } else {
      setLocalPatronState(newState);
    }
  };

  const activePatronDef = campaignPatron 
    ? GROUP_PATRONS_DATA.find(p => p.id === campaignPatron.patronId) 
    : null;

  const filteredPatrons = GROUP_PATRONS_DATA.filter(patron => {
    if (selectedBook !== 'all') {
      if (selectedBook === 'tasha' && !patron.sourceBook.includes('Tasha')) return false;
      if (selectedBook === 'eberron' && !patron.sourceBook.includes('Eberron')) return false;
      if (selectedBook === 'vecna' && !patron.sourceBook.includes('Vecna')) return false;
    }
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchName = patron.name.toLowerCase().includes(q);
      const matchType = patron.typeName.toLowerCase().includes(q);
      const matchDesc = patron.description.toLowerCase().includes(q);
      const matchPerk = patron.perks.some(p => p.title.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q));
      return matchName || matchType || matchDesc || matchPerk;
    }
    return true;
  });

  const toggleSecret = (patronId: string) => {
    setRevealedSecrets(prev => ({
      ...prev,
      [patronId]: !prev[patronId]
    }));
  };

  const handleSelectPatron = (patron: GroupPatronDef) => {
    const newState: ActivePatronCampaignState = {
      patronId: patron.id,
      reputationScore: 0,
      favorsOwed: 0,
      totalGoldEarnedFromPatron: 0,
      missions: []
    };
    updatePatronState(newState);
    if (onNotify) {
      onNotify(`¡"${patron.name}" ha sido establecido como Patrón de Grupo de la Campaña!`);
    }
  };

  const handleRollMission = () => {
    if (!activePatronDef) return;
    const mission = rollPatronMission(activePatronDef);
    setGeneratedMission(mission);
    setGeneratedIntrigue(null);
  };

  const handleAcceptMission = () => {
    if (!generatedMission || !campaignPatron) return;
    const nextMissions = [generatedMission, ...campaignPatron.missions];
    updatePatronState({
      ...campaignPatron,
      missions: nextMissions
    });
    if (onNotify) {
      onNotify(`Misión aceptada: "${generatedMission.title}". Añadida al tablero de asignaciones.`);
    }
    setGeneratedMission(null);
  };

  const handleRollIntrigue = () => {
    if (!activePatronDef) return;
    const intrigue = rollPatronIntrigue(activePatronDef);
    setGeneratedIntrigue(intrigue);
  };

  const handleResolveMission = (missionId: string, outcome: 'completed' | 'failed') => {
    if (!campaignPatron) return;
    const result = resolveMissionOutcome(campaignPatron, missionId, outcome);
    updatePatronState(result.updatedState);

    if (outcome === 'completed') {
      if (onNotify) {
        onNotify(`¡Misión completada con éxito! +${result.goldAwarded} po ganadas y +${result.favorsAwarded} favor del patrón.`);
      }
      // Offer distributing the gold
      if (characters.length > 0 && result.goldAwarded > 0 && onUpdateCharacters) {
        const share = Math.floor(result.goldAwarded / characters.length);
        const { updatedCharacters } = distributeStipend(characters, share);
        onUpdateCharacters(updatedCharacters);
        if (onNotify) {
          onNotify(`Recompensa repartida: ${share} po agregadas a cada uno de los ${characters.length} héroes.`);
        }
      }
    } else {
      if (onNotify) {
        onNotify(`Misión marcada como fallida. Reputación y favores reducidos con ${activePatronDef?.name}.`);
      }
    }
  };

  const handlePayDailyStipend = () => {
    if (!activePatronDef || !campaignPatron) return;
    const stipend = activePatronDef.compensation.stipendPerDayGp;
    if (characters.length === 0) {
      if (onNotify) onNotify('No hay aventureros activos en la partida para recibir el estipendio.');
      return;
    }
    if (onUpdateCharacters) {
      const { updatedCharacters, totalDistributedGp } = distributeStipend(characters, stipend);
      onUpdateCharacters(updatedCharacters);
      if (onNotify) {
        onNotify(`Estipendio pagado: ${stipend} po transferidas a cada aventurero (${totalDistributedGp} po en total).`);
      }
    }
  };

  const repTier = campaignPatron ? getReputationTier(campaignPatron.reputationScore) : null;

  return (
    <div className="space-y-6">
      {/* HEADER PRINCIPAL */}
      <div className="bg-[#fcfbf7] dark:bg-[#1a1c23] border border-[#e2d9c8] dark:border-gray-800 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Crown className="w-6 h-6 text-[#b45309]" />
              <h2 className="text-2xl font-serif font-bold text-[#2d241e] dark:text-gray-100">
                Patronos de Grupo e Intrigas
              </h2>
            </div>
            <p className="text-sm text-[#786953] dark:text-gray-400 mt-1">
              Mecánica oficial de <em>El Caldero de Tasha</em>, <em>Eberron: Surgiendo de la Última Guerra</em> y <em>Dossier de Vecna</em>.
              Establece la organización o benefactor que respalda a los héroes con estipendios, privilegios y misiones secretas.
            </p>
          </div>

          {/* Resumen Rápido del Patrón Activo */}
          {activePatronDef && campaignPatron && (
            <div className="flex items-center gap-3 bg-[#f5ede0] dark:bg-gray-800/80 px-4 py-2.5 rounded-lg border border-[#dfd2be] dark:border-gray-700">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-sm"
                style={{ backgroundColor: activePatronDef.badgeColor }}
              >
                <Crown className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs uppercase font-bold text-[#8c6b3e] dark:text-amber-400 tracking-wider">
                  Patrón Activo de la Campaña
                </span>
                <div className="font-bold text-sm text-[#2d241e] dark:text-gray-200">
                  {activePatronDef.name}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* TABLERO DE CONTROL DEL PATRÓN ACTIVO (SI EXISTE) */}
      {activePatronDef && campaignPatron && (
        <div className="bg-[#fffefb] dark:bg-[#1e2029] border-2 border-[#d4af37] dark:border-amber-600/60 rounded-xl p-6 shadow-md relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-amber-500/5 dark:bg-amber-400/5 rounded-full pointer-events-none" />

          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-[#e8dfcf] dark:border-gray-800">
            <div className="flex items-start gap-4">
              <div 
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-md flex-shrink-0"
                style={{ backgroundColor: activePatronDef.badgeColor }}
              >
                <Crown className="w-8 h-8" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full text-white" style={{ backgroundColor: activePatronDef.badgeColor }}>
                    {activePatronDef.typeName}
                  </span>
                  <span className="text-xs bg-[#eadecb] dark:bg-gray-800 text-[#63533c] dark:text-gray-300 font-semibold px-2 py-0.5 rounded">
                    {activePatronDef.sourceBook}
                  </span>
                </div>
                <h3 className="text-2xl font-serif font-bold text-[#2d241e] dark:text-gray-100">
                  {activePatronDef.name}
                </h3>
                <p className="text-sm text-[#665641] dark:text-gray-400 italic mt-0.5">
                  "{activePatronDef.tagline}"
                </p>
              </div>
            </div>

            {/* Marcadores de Reputación y Favores */}
            <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
              {/* Reputación */}
              <div className="flex-1 lg:flex-initial bg-[#fbf9f4] dark:bg-gray-800 p-3.5 rounded-xl border border-[#e2d9c8] dark:border-gray-700 min-w-[200px]">
                <div className="flex items-center justify-between text-xs text-[#8c6b3e] dark:text-amber-400 font-bold mb-1">
                  <span>REPUTACIÓN & RANGO</span>
                  <span className="font-mono text-sm">{campaignPatron.reputationScore > 0 ? `+${campaignPatron.reputationScore}` : campaignPatron.reputationScore}</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span 
                    className="text-xs font-bold px-2 py-0.5 rounded-md text-white"
                    style={{ backgroundColor: repTier?.badgeColor }}
                  >
                    {repTier?.label}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => updatePatronState({
                        ...campaignPatron,
                        reputationScore: modifyPatronReputation(campaignPatron.reputationScore, -1)
                      })}
                      className="w-6 h-6 rounded bg-[#ede3d1] dark:bg-gray-700 text-xs font-bold hover:bg-[#decbb2] transition-colors"
                      title="Reducir reputación"
                    >
                      -
                    </button>
                    <button
                      onClick={() => updatePatronState({
                        ...campaignPatron,
                        reputationScore: modifyPatronReputation(campaignPatron.reputationScore, 1)
                      })}
                      className="w-6 h-6 rounded bg-[#ede3d1] dark:bg-gray-700 text-xs font-bold hover:bg-[#decbb2] transition-colors"
                      title="Aumentar reputación"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Favores Pendientes */}
              <div className="flex-1 lg:flex-initial bg-[#fbf9f4] dark:bg-gray-800 p-3.5 rounded-xl border border-[#e2d9c8] dark:border-gray-700 min-w-[170px]">
                <div className="flex items-center justify-between text-xs text-[#8c6b3e] dark:text-amber-400 font-bold mb-1">
                  <span>FAVORES DEBIDOS</span>
                  <span className="font-mono text-sm font-bold text-amber-700 dark:text-amber-300">{campaignPatron.favorsOwed}</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-[#6e5d48] dark:text-gray-300">
                    {campaignPatron.favorsOwed >= 0 ? 'A favor del grupo' : 'Deuda con el patrón'}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => updatePatronState({
                        ...campaignPatron,
                        favorsOwed: modifyPatronFavors(campaignPatron.favorsOwed, -1)
                      })}
                      className="w-6 h-6 rounded bg-[#ede3d1] dark:bg-gray-700 text-xs font-bold hover:bg-[#decbb2] transition-colors"
                      title="Cobrar/gastar favor"
                    >
                      -
                    </button>
                    <button
                      onClick={() => updatePatronState({
                        ...campaignPatron,
                        favorsOwed: modifyPatronFavors(campaignPatron.favorsOwed, 1)
                      })}
                      className="w-6 h-6 rounded bg-[#ede3d1] dark:bg-gray-700 text-xs font-bold hover:bg-[#decbb2] transition-colors"
                      title="Ganar favor"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Botón Pagar Estipendio */}
              <button
                onClick={handlePayDailyStipend}
                className="w-full lg:w-auto px-4 py-3 bg-[#b45309] hover:bg-[#92400e] text-white font-bold rounded-xl shadow transition-all flex items-center justify-center gap-2"
                title={`Pagar ${activePatronDef.compensation.stipendPerDayGp} po a cada héroe`}
              >
                <Coins className="w-5 h-5" />
                <span>Cobrar Estipendio ({activePatronDef.compensation.stipendPerDayGp} po/día)</span>
              </button>
            </div>
          </div>

          {/* CONTACTO & PRIVILEGIOS DEL PATRÓN ACTIVO */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
            {/* Tarjeta de Contacto */}
            <div className="bg-[#f9f6f0] dark:bg-gray-800/60 p-4 rounded-xl border border-[#e2d9c8] dark:border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#8c6b3e] dark:text-amber-400 flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4" />
                  Contacto Principal
                </span>
                <button
                  onClick={() => toggleSecret(activePatronDef.id)}
                  className="text-xs flex items-center gap-1 text-[#8c6b3e] hover:text-[#b45309] dark:text-amber-400 font-semibold"
                >
                  {revealedSecrets[activePatronDef.id] ? (
                    <>
                      <EyeOff className="w-3.5 h-3.5" /> Ocultar Secreto DM
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5" /> Revelar Secreto DM
                    </>
                  )}
                </button>
              </div>
              <h4 className="font-bold text-base text-[#2d241e] dark:text-gray-100">
                {activePatronDef.contact.name}
              </h4>
              <p className="text-xs text-[#786953] dark:text-gray-400 mb-2">
                {activePatronDef.contact.role}
              </p>
              <p className="text-xs text-[#4a3b2c] dark:text-gray-300 leading-relaxed mb-2">
                <strong>Personalidad:</strong> {activePatronDef.contact.personality}
              </p>
              <p className="text-xs text-[#4a3b2c] dark:text-gray-300 leading-relaxed mb-2">
                <strong>Canal:</strong> {activePatronDef.contact.contactMethod}
              </p>
              {revealedSecrets[activePatronDef.id] && (
                <div className="mt-2 p-2.5 bg-amber-100/70 dark:bg-amber-950/40 rounded border border-amber-300 dark:border-amber-700 text-xs text-amber-900 dark:text-amber-200">
                  <span className="font-bold flex items-center gap-1 mb-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    Secreto Oculto (Sólo DM):
                  </span>
                  {activePatronDef.contact.secret}
                </div>
              )}
            </div>

            {/* Privilegios Oficiales (Perks) */}
            <div className="md:col-span-2 bg-[#f9f6f0] dark:bg-gray-800/60 p-4 rounded-xl border border-[#e2d9c8] dark:border-gray-700">
              <span className="text-xs font-bold uppercase tracking-wider text-[#8c6b3e] dark:text-amber-400 flex items-center gap-1.5 mb-2">
                <Sparkles className="w-4 h-4" />
                Privilegios de Grupo Activos (*Perks*)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {activePatronDef.perks.map((perk, idx) => (
                  <div key={idx} className="bg-[#fffefb] dark:bg-gray-900/60 p-3 rounded-lg border border-[#e8dfcf] dark:border-gray-800">
                    <div className="font-bold text-xs text-[#2d241e] dark:text-gray-100 mb-1 flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                      {perk.title}
                    </div>
                    <p className="text-[11px] text-[#5e4f3c] dark:text-gray-400 leading-tight">
                      {perk.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ACCIONES DE MISIÓN E INTRIGA */}
          <div className="bg-[#f5ede0] dark:bg-gray-900/50 p-4 rounded-xl border border-[#ded1be] dark:border-gray-800 mb-6">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
              <div className="font-bold text-sm text-[#2d241e] dark:text-gray-100 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-[#b45309]" />
                Generador Dinámico de Misiones e Intrigas
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleRollMission}
                  className="px-3 py-1.5 bg-[#451a03] hover:bg-[#2e1002] text-amber-100 text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5 transition-colors"
                >
                  <Dices className="w-3.5 h-3.5" />
                  Generar Misión (d6)
                </button>
                <button
                  onClick={handleRollIntrigue}
                  className="px-3 py-1.5 bg-amber-700/80 hover:bg-amber-800 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5 transition-colors"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Tirar Complicación / Intriga
                </button>
              </div>
            </div>

            {/* Misión Generada */}
            {generatedMission && (
              <div className="bg-[#fffefb] dark:bg-gray-800 p-4 rounded-lg border-2 border-amber-500 mb-3 animate-fadeIn">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-amber-500 text-white font-bold px-2 py-0.5 rounded">
                        NUEVA ASIGNACIÓN
                      </span>
                      <h5 className="font-serif font-bold text-base text-[#2d241e] dark:text-gray-100">
                        {generatedMission.title}
                      </h5>
                    </div>
                    <p className="text-xs text-[#524332] dark:text-gray-300 mt-1 leading-relaxed">
                      {generatedMission.prompt}
                    </p>
                    <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-[#786953] dark:text-gray-400">
                      <span><strong>Destino:</strong> {generatedMission.target}</span>
                      <span className="text-amber-700 dark:text-amber-300 font-bold"><strong>Recompensa:</strong> {generatedMission.rewardGp} po</span>
                      <span className="text-emerald-700 dark:text-emerald-400 font-bold"><strong>Favores:</strong> +{generatedMission.favorReward}</span>
                    </div>
                  </div>
                  <button
                    onClick={handleAcceptMission}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow flex items-center gap-1.5 flex-shrink-0 transition-colors"
                  >
                    <Check className="w-4 h-4" />
                    Aceptar Misión
                  </button>
                </div>
              </div>
            )}

            {/* Intriga Generada */}
            {generatedIntrigue && (
              <div className="bg-amber-50 dark:bg-amber-950/40 p-3.5 rounded-lg border border-amber-300 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 animate-fadeIn">
                <div className="font-bold flex items-center gap-1.5 mb-1 text-amber-800 dark:text-amber-300">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  Intriga / Complicación Imprevista: {generatedIntrigue.title}
                </div>
                <p className="leading-relaxed">{generatedIntrigue.complication}</p>
              </div>
            )}
          </div>

          {/* TABLERO DE MISIONES ACTIVAS & HISTORIAL */}
          <div>
            <h4 className="font-serif font-bold text-base text-[#2d241e] dark:text-gray-100 mb-3 flex items-center gap-2">
              <Scroll className="w-5 h-5 text-[#b45309]" />
              Tablero de Asignaciones ({campaignPatron.missions.length})
            </h4>

            {campaignPatron.missions.length === 0 ? (
              <div className="p-6 text-center text-xs text-[#786953] dark:text-gray-400 bg-[#fbf9f4] dark:bg-gray-800/40 rounded-xl border border-dashed border-[#dfd2be] dark:border-gray-700">
                No hay misiones activas registradas con este patrón. ¡Usa el botón "Generar Misión" arriba para encomendar una tarea!
              </div>
            ) : (
              <div className="space-y-2.5">
                {campaignPatron.missions.map(mission => (
                  <div
                    key={mission.id}
                    className={`p-3.5 rounded-xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                      mission.status === 'completed'
                        ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/40 opacity-80'
                        : mission.status === 'failed'
                        ? 'bg-red-50/60 dark:bg-red-950/20 border-red-200 dark:border-red-800/40 opacity-70'
                        : 'bg-[#fffefb] dark:bg-gray-800 border-[#e2d9c8] dark:border-gray-700 shadow-sm'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                          mission.status === 'completed'
                            ? 'bg-emerald-600 text-white'
                            : mission.status === 'failed'
                            ? 'bg-red-600 text-white'
                            : 'bg-amber-500 text-white'
                        }`}>
                          {mission.status === 'completed' ? 'Completada' : mission.status === 'failed' ? 'Fallida' : 'En Curso'}
                        </span>
                        <h5 className="font-bold text-sm text-[#2d241e] dark:text-gray-100">
                          {mission.title}
                        </h5>
                        <span className="text-[11px] text-[#786953] dark:text-gray-400">
                          • {mission.assignedDate}
                        </span>
                      </div>
                      <p className="text-xs text-[#524332] dark:text-gray-300">
                        {mission.prompt}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-[#786953] dark:text-gray-400">
                        <span><strong>Lugar:</strong> {mission.target}</span>
                        <span className="text-amber-700 dark:text-amber-300 font-bold"><strong>Recompensa:</strong> {mission.rewardGp} po</span>
                      </div>
                    </div>

                    {mission.status === 'pending' && (
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={() => handleResolveMission(mission.id, 'completed')}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1 transition-colors"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          Completar
                        </button>
                        <button
                          onClick={() => handleResolveMission(mission.id, 'failed')}
                          className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1 transition-colors"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          Fallar
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* CATÁLOGO Y GALERÍA DE PATRONOS OFICIALES */}
      <div className="bg-[#fcfbf7] dark:bg-[#1a1c23] border border-[#e2d9c8] dark:border-gray-800 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-xl font-serif font-bold text-[#2d241e] dark:text-gray-100 flex items-center gap-2">
              <Compass className="w-5 h-5 text-[#b45309]" />
              Catálogo de Patronos de Campaña ({filteredPatrons.length})
            </h3>
            <p className="text-xs text-[#786953] dark:text-gray-400 mt-0.5">
              Selecciona o cambia el patrón de tu campaña entre las 12 organizaciones oficiales.
            </p>
          </div>

          {/* Filtros y Buscador */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center bg-[#ede3d1] dark:bg-gray-800 p-1 rounded-lg text-xs font-bold">
              <button
                onClick={() => setSelectedBook('all')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  selectedBook === 'all' 
                    ? 'bg-[#b45309] text-white shadow-sm' 
                    : 'text-[#6e5d48] dark:text-gray-300 hover:text-black dark:hover:text-white'
                }`}
              >
                Todos (12)
              </button>
              <button
                onClick={() => setSelectedBook('tasha')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  selectedBook === 'tasha' 
                    ? 'bg-[#b45309] text-white shadow-sm' 
                    : 'text-[#6e5d48] dark:text-gray-300 hover:text-black dark:hover:text-white'
                }`}
              >
                Tasha (8)
              </button>
              <button
                onClick={() => setSelectedBook('eberron')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  selectedBook === 'eberron' 
                    ? 'bg-[#b45309] text-white shadow-sm' 
                    : 'text-[#6e5d48] dark:text-gray-300 hover:text-black dark:hover:text-white'
                }`}
              >
                Eberron (3)
              </button>
              <button
                onClick={() => setSelectedBook('vecna')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  selectedBook === 'vecna' 
                    ? 'bg-[#b45309] text-white shadow-sm' 
                    : 'text-[#6e5d48] dark:text-gray-300 hover:text-black dark:hover:text-white'
                }`}
              >
                Vecna (1)
              </button>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-[#8c6b3e] absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Buscar por nombre, tipo o privilegio..."
                className="pl-9 pr-3 py-1.5 bg-[#fffefb] dark:bg-gray-800 border border-[#dfd2be] dark:border-gray-700 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-amber-500 w-64"
              />
            </div>
          </div>
        </div>

        {/* Grid de Patronos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPatrons.map(patron => {
            const isActive = campaignPatron?.patronId === patron.id;
            return (
              <div
                key={patron.id}
                className={`bg-[#fffefb] dark:bg-gray-800/80 rounded-xl border p-5 transition-all flex flex-col justify-between ${
                  isActive 
                    ? 'border-2 border-[#b45309] shadow-md ring-2 ring-amber-500/20' 
                    : 'border-[#e2d9c8] dark:border-gray-700 hover:border-amber-400 dark:hover:border-amber-500 shadow-sm'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2.5">
                    <span 
                      className="text-[11px] font-bold px-2.5 py-0.5 rounded-full text-white"
                      style={{ backgroundColor: patron.badgeColor }}
                    >
                      {patron.typeName}
                    </span>
                    <span className="text-[10px] text-[#786953] dark:text-gray-400 bg-[#ede3d1] dark:bg-gray-700 px-2 py-0.5 rounded font-semibold">
                      {patron.sourceBook}
                    </span>
                  </div>

                  <h4 className="font-serif font-bold text-lg text-[#2d241e] dark:text-gray-100 mb-1">
                    {patron.name}
                  </h4>
                  <p className="text-xs text-[#786953] dark:text-gray-400 italic mb-3">
                    "{patron.tagline}"
                  </p>
                  <p className="text-xs text-[#4a3b2c] dark:text-gray-300 line-clamp-3 leading-relaxed mb-4">
                    {patron.description}
                  </p>

                  {/* Beneficios Resumidos */}
                  <div className="space-y-1.5 mb-4">
                    <span className="text-[11px] font-bold text-[#8c6b3e] dark:text-amber-400 uppercase tracking-wider block">
                      Privilegios Clave:
                    </span>
                    {patron.perks.slice(0, 2).map((perk, i) => (
                      <div key={i} className="text-xs text-[#524332] dark:text-gray-300 flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                        <span className="font-semibold">{perk.title}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Botones de Acción */}
                <div className="pt-4 border-t border-[#f0e7d8] dark:border-gray-700 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setInspectingPatron(patron)}
                    className="text-xs text-[#b45309] dark:text-amber-400 font-bold hover:underline flex items-center gap-1"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    Dossier Completo
                  </button>

                  {isActive ? (
                    <span className="text-xs font-bold text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/60 px-3 py-1.5 rounded-lg flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      Patrón Activo
                    </span>
                  ) : (
                    <button
                      onClick={() => handleSelectPatron(patron)}
                      className="px-3 py-1.5 bg-[#451a03] hover:bg-[#2e1002] text-amber-100 text-xs font-bold rounded-lg shadow-sm transition-colors flex items-center gap-1"
                    >
                      <Crown className="w-3.5 h-3.5" />
                      Elegir Patrón
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MODAL / PANEL EXPANDIDO DEL PATRÓN */}
      {inspectingPatron && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#fffefb] dark:bg-[#1a1c23] border-2 border-[#d4af37] dark:border-amber-600 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto animate-fadeIn">
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#e2d9c8] dark:border-gray-800">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full text-white" style={{ backgroundColor: inspectingPatron.badgeColor }}>
                    {inspectingPatron.typeName}
                  </span>
                  <span className="text-xs bg-[#ede3d1] dark:bg-gray-800 text-[#6e5d48] dark:text-gray-300 px-2 py-0.5 rounded font-semibold">
                    {inspectingPatron.sourceBook}
                  </span>
                </div>
                <h3 className="text-2xl font-serif font-bold text-[#2d241e] dark:text-gray-100">
                  {inspectingPatron.name}
                </h3>
                <p className="text-xs text-[#786953] dark:text-gray-400 italic">
                  "{inspectingPatron.tagline}"
                </p>
              </div>
              <button
                onClick={() => setInspectingPatron(null)}
                className="text-[#8c6b3e] hover:text-black dark:text-gray-400 dark:hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-[#4a3b2c] dark:text-gray-300 leading-relaxed">
              {inspectingPatron.description}
            </p>

            {/* Privilegios */}
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-[#8c6b3e] dark:text-amber-400 mb-2 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                Privilegios de Grupo (*Perks*)
              </h4>
              <div className="space-y-2">
                {inspectingPatron.perks.map((perk, i) => (
                  <div key={i} className="p-3 bg-[#fbf9f4] dark:bg-gray-800/60 rounded-lg border border-[#e8dfcf] dark:border-gray-700">
                    <div className="font-bold text-xs text-[#2d241e] dark:text-gray-100 mb-0.5">
                      {perk.title}
                    </div>
                    <div className="text-xs text-[#6e5d48] dark:text-gray-300 leading-relaxed">
                      {perk.desc}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Compensación & Alojamiento */}
            <div className="p-3.5 bg-amber-50/60 dark:bg-amber-950/20 rounded-xl border border-amber-200 dark:border-amber-800 text-xs">
              <span className="font-bold text-amber-900 dark:text-amber-300 uppercase tracking-wider block mb-1">
                Compensación y Recursos Suministrados:
              </span>
              <ul className="space-y-1 text-amber-800 dark:text-amber-200">
                <li>• <strong>Estipendio Diario:</strong> {inspectingPatron.compensation.stipendPerDayGp} po por aventurero.</li>
                <li>• <strong>Alojamiento:</strong> {inspectingPatron.compensation.housingQuality}</li>
                <li>• <strong>Beneficio Extraordinario:</strong> {inspectingPatron.compensation.specialBenefit}</li>
              </ul>
            </div>

            {/* Contacto & Secreto */}
            <div className="p-3.5 bg-[#fbf9f4] dark:bg-gray-800/60 rounded-xl border border-[#e8dfcf] dark:border-gray-700 text-xs">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-[#8c6b3e] dark:text-amber-400 uppercase tracking-wider">
                  Contacto: {inspectingPatron.contact.name} ({inspectingPatron.contact.role})
                </span>
                <button
                  onClick={() => toggleSecret(inspectingPatron.id)}
                  className="text-[11px] text-[#b45309] font-bold hover:underline"
                >
                  {revealedSecrets[inspectingPatron.id] ? 'Ocultar Secreto DM' : 'Revelar Secreto DM'}
                </button>
              </div>
              <p className="text-[#524332] dark:text-gray-300 mb-1">
                <strong>Canal:</strong> {inspectingPatron.contact.contactMethod}
              </p>
              {revealedSecrets[inspectingPatron.id] && (
                <div className="mt-2 p-2 bg-amber-100 dark:bg-amber-950/40 rounded border border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200">
                  <strong>Secreto Oculto del Patrón:</strong> {inspectingPatron.contact.secret}
                </div>
              )}
            </div>

            {/* Botón de Confirmación */}
            <div className="pt-3 border-t border-[#e2d9c8] dark:border-gray-800 flex justify-end gap-3">
              <button
                onClick={() => setInspectingPatron(null)}
                className="px-4 py-2 border border-[#dfd2be] dark:border-gray-700 rounded-lg text-xs font-bold hover:bg-[#ede3d1] transition-colors"
              >
                Cerrar
              </button>
              <button
                onClick={() => {
                  handleSelectPatron(inspectingPatron);
                  setInspectingPatron(null);
                }}
                className="px-4 py-2 bg-[#b45309] hover:bg-[#92400e] text-white rounded-lg text-xs font-bold shadow transition-colors flex items-center gap-1.5"
              >
                <Crown className="w-4 h-4" />
                Asignar a la Campaña
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
