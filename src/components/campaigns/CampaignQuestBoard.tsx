import React, { useState } from 'react';
import { 
  CampaignQuest, 
  UserAccount, 
  Character, 
  AdventureRankClass,
  QuestStatus
} from '../../types/dnd';
import { 
  getRankClassFromLevel, 
  getRankClassTitle, 
  getRankClassBadgeColor, 
  validateCharacterForQuest 
} from '../../utils/campaignAuthMath';
import { 
  Scroll, 
  Plus, 
  Coins, 
  Calendar, 
  Users, 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  Lock, 
  Trash2, 
  Edit3, 
  Crown, 
  Sparkles, 
  Play, 
  Flag, 
  AlertTriangle, 
  Filter,
  Check,
  X
} from 'lucide-react';

interface CampaignQuestBoardProps {
  currentUser: UserAccount | null;
  activeCharacter: Character | null;
  characters?: Character[];
  quests: CampaignQuest[];
  onSaveQuest: (quest: CampaignQuest) => void;
  onDeleteQuest: (questId: string) => void;
  onUpdateCharacter?: (updated: Character) => void;
  onUpdateAllCharacters?: (updatedList: Character[]) => void;
  onOpenAuth: () => void;
}

export const CampaignQuestBoard: React.FC<CampaignQuestBoardProps> = ({
  currentUser,
  activeCharacter,
  characters,
  quests,
  onSaveQuest,
  onDeleteQuest,
  onUpdateCharacter,
  onUpdateAllCharacters,
  onOpenAuth
}) => {
  const [selectedClassFilter, setSelectedClassFilter] = useState<string>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [editingQuest, setEditingQuest] = useState<CampaignQuest | null>(null);
  const [managingQuestId, setManagingQuestId] = useState<string | null>(null);

  // Campos de formulario para nueva misión
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [sessionDate, setSessionDate] = useState<string>('');
  const [maxPlayers, setMaxPlayers] = useState<number>(4);
  const [goldReward, setGoldReward] = useState<number>(300);
  const [minLevel, setMinLevel] = useState<number>(3);
  const [maxLevel, setMaxLevel] = useState<number>(5);

  const isMasterOrSuper = currentUser?.role === 'dm' || currentUser?.role === 'supermaster';

  // Filtrado
  const filteredQuests = quests.filter(q => {
    if (selectedClassFilter !== 'all' && q.rankClass !== selectedClassFilter) return false;
    if (selectedStatusFilter !== 'all' && q.status !== selectedStatusFilter) return false;
    return true;
  });

  const handleOpenCreate = () => {
    if (!currentUser) {
      onOpenAuth();
      return;
    }
    setEditingQuest(null);
    setTitle('');
    setDescription('');
    setSessionDate('Sábado 20:00 Horas');
    setMaxPlayers(4);
    setGoldReward(350);
    setMinLevel(3);
    setMaxLevel(5);
    setShowCreateModal(true);
  };

  const handleOpenEdit = (q: CampaignQuest) => {
    setEditingQuest(q);
    setTitle(q.title);
    setDescription(q.description);
    setSessionDate(q.sessionDate);
    setMaxPlayers(q.maxPlayers);
    setGoldReward(q.goldReward);
    setMinLevel(q.minLevel);
    setMaxLevel(q.maxLevel);
    setShowCreateModal(true);
  };

  const handleSaveQuestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    const rankClass = getRankClassFromLevel(Math.round((minLevel + maxLevel) / 2));

    const newOrUpdated: CampaignQuest = {
      id: editingQuest ? editingQuest.id : `quest_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      title: title.trim(),
      description: description.trim(),
      masterId: editingQuest ? editingQuest.masterId : currentUser.id,
      masterName: editingQuest ? editingQuest.masterName : currentUser.username,
      sessionDate: sessionDate.trim(),
      maxPlayers,
      goldReward,
      minLevel,
      maxLevel,
      rankClass,
      status: editingQuest ? editingQuest.status : 'open',
      applicants: editingQuest ? editingQuest.applicants : [],
      acceptedPlayerIds: editingQuest ? editingQuest.acceptedPlayerIds : [],
      createdAt: editingQuest ? editingQuest.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onSaveQuest(newOrUpdated);
    setShowCreateModal(false);
  };

  // Postulación del jugador
  const handleApplyToQuest = (quest: CampaignQuest) => {
    if (!currentUser) {
      onOpenAuth();
      return;
    }
    if (!activeCharacter) {
      alert('Debes tener una ficha de personaje activa para postularte a una misión.');
      return;
    }

    const validation = validateCharacterForQuest(activeCharacter.level, quest.minLevel, quest.maxLevel, quest.rankClass);
    if (!validation.eligible) {
      alert(validation.reason);
      return;
    }

    const alreadyApplied = quest.applicants.some(a => a.characterId === activeCharacter.id);
    if (alreadyApplied) {
      alert('Tu aventurero ya se ha postulado a esta misión.');
      return;
    }

    const updatedApplicants = [
      ...quest.applicants,
      {
        characterId: activeCharacter.id,
        characterName: activeCharacter.name,
        playerName: currentUser.username,
        characterLevel: activeCharacter.level,
        characterClass: `${activeCharacter.species} ${activeCharacter.className}`,
        appliedAt: new Date().toISOString(),
        status: 'pending' as const
      }
    ];

    onSaveQuest({
      ...quest,
      applicants: updatedApplicants,
      updatedAt: new Date().toISOString()
    });
  };

  // El Master acepta a un postulante
  const handleAcceptApplicant = (quest: CampaignQuest, charId: string) => {
    const updatedApplicants = quest.applicants.map(a => 
      a.characterId === charId ? { ...a, status: 'accepted' as const } : a
    );
    const updatedAccepted = Array.from(new Set([...quest.acceptedPlayerIds, charId]));

    onSaveQuest({
      ...quest,
      applicants: updatedApplicants,
      acceptedPlayerIds: updatedAccepted,
      updatedAt: new Date().toISOString()
    });
  };

  // El Master rechaza a un postulante
  const handleRejectApplicant = (quest: CampaignQuest, charId: string) => {
    const updatedApplicants = quest.applicants.map(a => 
      a.characterId === charId ? { ...a, status: 'rejected' as const } : a
    );
    const updatedAccepted = quest.acceptedPlayerIds.filter(id => id !== charId);

    onSaveQuest({
      ...quest,
      applicants: updatedApplicants,
      acceptedPlayerIds: updatedAccepted,
      updatedAt: new Date().toISOString()
    });
  };

  // Resolución de la Misión (Victoria, Derrota, Retirada)
  const handleResolveQuest = (quest: CampaignQuest, outcome: 'completed' | 'failed' | 'retreated') => {
    const isWin = outcome === 'completed';
    const isDefeat = outcome === 'failed';

    const confirmMsg = isWin
      ? `¿Declarar VICTORIA en "${quest.title}"? Cada aventurero aceptado recibirá su parte de ${quest.goldReward} Dragones de Oro y se inscribirá en su Grimorio.`
      : isDefeat
      ? `¿Declarar DERROTA en "${quest.title}"? Esto registrará la caída en el Grimorio y generará una ALERTA INMEDIATA al Super Master para escalar la misión.`
      : `¿Registrar RETIRADA TÁCTICA en "${quest.title}"?`;

    if (!window.confirm(confirmMsg)) return;

    // Distribuir crónicas y Dragones de Oro a TODOS los aventureros aceptados
    const goldShare = isWin ? Math.round(quest.goldReward / Math.max(1, quest.acceptedPlayerIds.length)) : 0;
    const makeChronicle = () => ({
      id: `chr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      questId: quest.id,
      questTitle: quest.title,
      masterName: quest.masterName,
      sessionDate: quest.sessionDate,
      rankClass: quest.rankClass,
      outcome: isWin ? 'victory' as const : isDefeat ? 'defeat' as const : 'retreat' as const,
      goldEarned: goldShare,
      xpEarned: isWin ? 500 : 100,
      chronicleNotes: isWin 
        ? '¡Hazaña heroica completada con éxito glorioso!'
        : isDefeat
        ? 'Los aventureros sucumbieron ante los horrores del desafío.'
        : 'Retirada estratégica para preservar la vida del grupo.',
      recordedAt: new Date().toISOString()
    });

    if (onUpdateAllCharacters && characters && characters.length > 0) {
      const updatedList = characters.map(c => {
        if (!quest.acceptedPlayerIds.includes(c.id)) return c;
        return {
          ...c,
          goldDragons: (c.goldDragons || 0) + goldShare,
          adventureChronicles: [makeChronicle(), ...(c.adventureChronicles || [])],
          updatedAt: new Date().toISOString()
        };
      });
      onUpdateAllCharacters(updatedList);
    } else if (activeCharacter && onUpdateCharacter && quest.acceptedPlayerIds.includes(activeCharacter.id)) {
      const updatedChronicles = [makeChronicle(), ...(activeCharacter.adventureChronicles || [])];
      const updatedGoldDragons = (activeCharacter.goldDragons || 0) + goldShare;

      onUpdateCharacter({
        ...activeCharacter,
        goldDragons: updatedGoldDragons,
        adventureChronicles: updatedChronicles,
        updatedAt: new Date().toISOString()
      });
    }

    onSaveQuest({
      ...quest,
      status: outcome,
      updatedAt: new Date().toISOString()
    });
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', paddingBottom: '3rem' }}>
      {/* Encabezado del Tablón */}
      <div className="card card-gold" style={{ marginBottom: '1.5rem', padding: '1.4rem 1.8rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <div className="brand-icon" style={{ width: '38px', height: '38px', background: 'linear-gradient(135deg, #d4af37, #7d5a0a)' }}>
                <Scroll size={22} color="#ffffff" />
              </div>
              <h1 style={{ fontSize: '1.8rem', margin: 0 }}>Tablero de Anuncios y Campañas del Reino</h1>
            </div>
            <p style={{ color: 'var(--text-muted)', margin: '0.4rem 0 0 0', fontSize: '0.92rem' }}>
              Misiones oficiales de los Masters. Postula tus aventureros por rango de clase (F a SS+), gana <strong>Dragones de Oro (DO)</strong> y forja tu legado.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
            {isMasterOrSuper && (
              <button className="btn btn-primary" onClick={handleOpenCreate} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Plus size={16} /> Publicar Nueva Misión
              </button>
            )}
          </div>
        </div>

        {/* Barra de Filtros */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.8rem', marginTop: '1.2rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-dim)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Filter size={14} /> Clase de Rango:
            </span>
            {['all', 'F', 'E', 'D', 'C', 'B', 'A', 'S', 'SS', 'SS+'].map(rank => (
              <button
                key={rank}
                className={`btn btn-sm ${selectedClassFilter === rank ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setSelectedClassFilter(rank)}
                style={{ padding: '0.25rem 0.6rem', fontSize: '0.8rem' }}
              >
                {rank === 'all' ? 'Todas' : `Clase ${rank}`}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-dim)', fontWeight: 600 }}>Estado:</span>
            <select
              value={selectedStatusFilter}
              onChange={e => setSelectedStatusFilter(e.target.value)}
              style={{ padding: '0.25rem 0.6rem', fontSize: '0.82rem', width: 'auto' }}
            >
              <option value="all">Todos los Estados</option>
              <option value="open">En Convocatoria</option>
              <option value="in_progress">En Curso</option>
              <option value="completed">Completadas (Victoria)</option>
              <option value="failed">Fallidas (Alerta)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de Misiones */}
      {filteredQuests.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem 1.5rem', color: 'var(--text-dim)' }}>
          <Scroll size={48} style={{ opacity: 0.3, marginBottom: '0.8rem' }} />
          <p style={{ margin: 0, fontSize: '1.1rem' }}>No hay anuncios de misiones que coincidan con los filtros seleccionados.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '1.2rem' }}>
          {filteredQuests.map(quest => {
            const badgeColors = getRankClassBadgeColor(quest.rankClass);
            const isCreatorMaster = currentUser?.id === quest.masterId;
            const isSuperMaster = currentUser?.role === 'supermaster';
            const canManage = isCreatorMaster || isSuperMaster;

            // Comprobar estado de postulación del personaje activo
            const activeApplicant = activeCharacter 
              ? quest.applicants.find(a => a.characterId === activeCharacter.id)
              : null;
            
            const validation = activeCharacter 
              ? validateCharacterForQuest(activeCharacter.level, quest.minLevel, quest.maxLevel, quest.rankClass)
              : { eligible: false, reason: 'Inicia sesión con un personaje activo' };

            return (
              <div 
                key={quest.id} 
                className="card" 
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  justifyContent: 'space-between',
                  border: quest.status === 'failed' 
                    ? '2px solid #ff3344' 
                    : quest.status === 'completed' 
                    ? '2px solid #2b8a3e' 
                    : `1px solid ${badgeColors.border}`,
                  boxShadow: quest.status === 'failed' ? '0 0 15px rgba(255, 50, 50, 0.2)' : 'var(--shadow-card)',
                  background: 'var(--bg-card)',
                  position: 'relative'
                }}
              >
                {/* Badge Superior de Clase y Recompensa */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                    <span 
                      style={{
                        padding: '0.2rem 0.6rem',
                        borderRadius: 'var(--radius-sm)',
                        background: badgeColors.bg,
                        color: badgeColors.color,
                        border: `1px solid ${badgeColors.border}`,
                        fontSize: '0.8rem',
                        fontWeight: 800
                      }}
                    >
                      CLASE {quest.rankClass} • Nivel {quest.minLevel}-{quest.maxLevel}
                    </span>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--gold-hover)', fontWeight: 800, fontSize: '0.95rem' }}>
                      <Coins size={16} /> {quest.goldReward.toLocaleString()} DO
                    </div>
                  </div>

                  <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem', color: 'var(--text-main)' }}>
                    {quest.title}
                  </h3>

                  <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: '0 0 1rem 0', lineHeight: 1.4 }}>
                    {quest.description}
                  </p>

                  {/* Metadatos */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '1rem', background: 'var(--bg-input)', padding: '0.6rem 0.8rem', borderRadius: 'var(--radius-sm)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Calendar size={13} color="var(--gold-primary)" />
                      <span>Sesión: <strong>{quest.sessionDate}</strong></span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Users size={13} color="var(--sapphire-mana)" />
                      <span>Cupo: <strong>{quest.acceptedPlayerIds.length} / {quest.maxPlayers} Aventureros</strong> ({quest.applicants.length} postulados)</span>
                    </div>
                    <div>
                      <span>Master a cargo: <strong>{quest.masterName}</strong></span>
                    </div>
                  </div>

                  {/* Estado de la Misión */}
                  <div style={{ marginBottom: '1rem' }}>
                    {quest.status === 'open' && (
                      <span className="badge badge-sapphire" style={{ fontSize: '0.78rem' }}>
                        ● Convocatoria Abierta
                      </span>
                    )}
                    {quest.status === 'in_progress' && (
                      <span className="badge badge-gold" style={{ fontSize: '0.78rem' }}>
                        ▶ En Curso en la Mesa
                      </span>
                    )}
                    {quest.status === 'completed' && (
                      <span className="badge badge-heal" style={{ fontSize: '0.78rem' }}>
                        ✓ Misión Completada (Victoria)
                      </span>
                    )}
                    {quest.status === 'failed' && (
                      <span className="badge badge-crimson" style={{ fontSize: '0.78rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                        <AlertTriangle size={13} /> Derrota / Requiere Escalado Imperial
                      </span>
                    )}
                    {quest.status === 'retreated' && (
                      <span className="badge badge-secondary" style={{ fontSize: '0.78rem' }}>
                        Retirada Estratégica
                      </span>
                    )}
                  </div>
                </div>

                {/* Subpanel de Gestión para el Master Creador */}
                {managingQuestId === quest.id && canManage && (
                  <div style={{
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-gold)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '0.8rem',
                    marginBottom: '1rem',
                    animation: 'fadeInDown 0.2s ease-out'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                      <strong style={{ fontSize: '0.85rem', color: 'var(--text-gold)' }}>Postulantes ({quest.applicants.length}):</strong>
                      <button className="btn btn-secondary btn-sm" onClick={() => setManagingQuestId(null)} style={{ padding: '0.1rem 0.4rem', fontSize: '0.75rem' }}>
                        Cerrar
                      </button>
                    </div>

                    {quest.applicants.length === 0 ? (
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Aún no hay postulantes para esta misión.</div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', maxHeight: '180px', overflowY: 'auto' }}>
                        {quest.applicants.map(app => (
                          <div key={app.characterId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', padding: '0.3rem 0.5rem', background: 'rgba(0,0,0,0.05)', borderRadius: 'var(--radius-sm)' }}>
                            <div>
                              <strong>{app.characterName}</strong> (Nvl {app.characterLevel} {app.characterClass})
                              <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Jugador: {app.playerName}</div>
                            </div>
                            <div style={{ display: 'flex', gap: '0.3rem' }}>
                              {app.status === 'accepted' ? (
                                <span className="badge badge-heal" style={{ fontSize: '0.7rem' }}>Aceptado</span>
                              ) : app.status === 'rejected' ? (
                                <span className="badge badge-crimson" style={{ fontSize: '0.7rem' }}>Rechazado</span>
                              ) : (
                                <>
                                  <button 
                                    className="btn btn-primary btn-sm" 
                                    onClick={() => handleAcceptApplicant(quest, app.characterId)}
                                    style={{ padding: '0.2rem 0.4rem', fontSize: '0.7rem' }}
                                    title="Aceptar en la partida"
                                  >
                                    <Check size={12} />
                                  </button>
                                  <button 
                                    className="btn btn-danger btn-sm" 
                                    onClick={() => handleRejectApplicant(quest, app.characterId)}
                                    style={{ padding: '0.2rem 0.4rem', fontSize: '0.7rem' }}
                                    title="Rechazar"
                                  >
                                    <X size={12} />
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Controles de Estado de la Partida */}
                    <div style={{ marginTop: '0.8rem', paddingTop: '0.6rem', borderTop: '1px solid var(--border-subtle)' }}>
                      <label style={{ fontSize: '0.75rem', marginBottom: '0.3rem' }}>Desenlace de la Misión:</label>
                      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                        {quest.status === 'open' && (
                          <button 
                            className="btn btn-primary btn-sm" 
                            onClick={() => onSaveQuest({ ...quest, status: 'in_progress', updatedAt: new Date().toISOString() })}
                            style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                          >
                            <Play size={12} /> Iniciar Sesión
                          </button>
                        )}
                        <button 
                          className="btn btn-heal btn-sm" 
                          onClick={() => handleResolveQuest(quest, 'completed')}
                          style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                        >
                          🏆 Victoria
                        </button>
                        <button 
                          className="btn btn-danger btn-sm" 
                          onClick={() => handleResolveQuest(quest, 'failed')}
                          style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                        >
                          💀 Derrota / Fallo
                        </button>
                        <button 
                          className="btn btn-secondary btn-sm" 
                          onClick={() => handleResolveQuest(quest, 'retreated')}
                          style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                        >
                          🏃 Retirada
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Acciones del Pie de la Tarjeta */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem', paddingTop: '0.8rem', borderTop: '1px solid var(--border-subtle)' }}>
                  {/* Zona de Postulación para el Jugador */}
                  <div>
                    {activeApplicant ? (
                      <span style={{ fontSize: '0.82rem', fontWeight: 700, color: activeApplicant.status === 'accepted' ? 'var(--emerald-heal)' : activeApplicant.status === 'rejected' ? 'var(--crimson-hp)' : 'var(--text-gold)' }}>
                        {activeApplicant.status === 'accepted' ? '✓ ¡Aceptado en la partida!' : activeApplicant.status === 'rejected' ? '✗ Postulación declinada' : '⏳ Postulación pendiente'}
                      </span>
                    ) : quest.status === 'open' ? (
                      validation.eligible ? (
                        <button 
                          className="btn btn-primary btn-sm"
                          onClick={() => handleApplyToQuest(quest)}
                        >
                          Postular Aventurero
                        </button>
                      ) : (
                        <button 
                          className="btn btn-secondary btn-sm" 
                          disabled 
                          title={validation.reason}
                          style={{ opacity: 0.6, cursor: 'not-allowed', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                        >
                          <Lock size={13} /> Bloqueado por Nivel
                        </button>
                      )
                    ) : (
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Convocatoria cerrada</span>
                    )}
                  </div>

                  {/* Acciones de Edición / Gestión del Master o Super Master */}
                  <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                    {canManage && (
                      <>
                        <button 
                          className="btn btn-secondary btn-sm" 
                          onClick={() => setManagingQuestId(managingQuestId === quest.id ? null : quest.id)}
                          style={{ padding: '0.3rem 0.6rem', fontSize: '0.78rem' }}
                          title="Gestionar postulaciones y estado"
                        >
                          Gestionar ({quest.applicants.length})
                        </button>
                        {isCreatorMaster && (
                          <button 
                            className="btn btn-secondary btn-sm" 
                            onClick={() => handleOpenEdit(quest)}
                            style={{ padding: '0.3rem 0.5rem' }}
                            title="Editar Misión"
                          >
                            <Edit3 size={13} />
                          </button>
                        )}
                      </>
                    )}

                    {/* Exclusivo del Super Master: Purgar Misión */}
                    {isSuperMaster && (
                      <button 
                        className="btn btn-danger btn-sm" 
                        onClick={() => {
                          if (window.confirm(`¿Confirmas la purga imperial de la misión "${quest.title}"? Esta acción solo puede realizarla el Super Master.`)) {
                            onDeleteQuest(quest.id);
                          }
                        }}
                        style={{ padding: '0.3rem 0.5rem' }}
                        title="Eliminar Misión del Reino (Super Master)"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal para Crear / Editar Misión */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '580px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', borderBottom: '1px solid var(--border-gold)', paddingBottom: '0.6rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Scroll size={20} color="var(--gold-primary)" />
                <h2 style={{ margin: 0, padding: 0, border: 'none', fontSize: '1.3rem' }}>
                  {editingQuest ? 'Editar Misión de Campaña' : 'Publicar Nueva Misión en el Tablón'}
                </h2>
              </div>
              <button className="btn btn-secondary btn-sm" onClick={() => setShowCreateModal(false)}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveQuestSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <label>Título de la Aventura / Misión</label>
                <input 
                  type="text" 
                  value={title} 
                  onChange={e => setTitle(e.target.value)} 
                  placeholder="Ej. El Enigma de la Torre Nublada"
                  required 
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label>Descripción y Rumores</label>
                <textarea 
                  value={description} 
                  onChange={e => setDescription(e.target.value)} 
                  rows={3} 
                  placeholder="Describe la premisa del contrato, peligros conocidos y objetivos..."
                  required 
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label>Horario y Fecha de la Sesión</label>
                  <input 
                    type="text" 
                    value={sessionDate} 
                    onChange={e => setSessionDate(e.target.value)} 
                    placeholder="Ej. Sábado 20:00 Horas"
                    required 
                  />
                </div>
                <div>
                  <label>Cupo Máximo de Héroes</label>
                  <input 
                    type="number" 
                    min={1} 
                    max={10} 
                    value={maxPlayers} 
                    onChange={e => setMaxPlayers(parseInt(e.target.value, 10) || 4)} 
                    required 
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.2fr', gap: '0.8rem', marginBottom: '1.2rem' }}>
                <div>
                  <label>Nivel Mínimo</label>
                  <input 
                    type="number" 
                    min={1} 
                    max={20} 
                    value={minLevel} 
                    onChange={e => setMinLevel(parseInt(e.target.value, 10) || 1)} 
                    required 
                  />
                </div>
                <div>
                  <label>Nivel Máximo</label>
                  <input 
                    type="number" 
                    min={1} 
                    max={20} 
                    value={maxLevel} 
                    onChange={e => setMaxLevel(parseInt(e.target.value, 10) || 20)} 
                    required 
                  />
                </div>
                <div>
                  <label>Recompensa (Dragones de Oro)</label>
                  <input 
                    type="number" 
                    min={10} 
                    value={goldReward} 
                    onChange={e => setGoldReward(parseInt(e.target.value, 10) || 100)} 
                    required 
                  />
                </div>
              </div>

              <div style={{ background: 'var(--bg-input)', padding: '0.8rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.4rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                <strong>Clase Asignada Automáticamente:</strong> {getRankClassTitle(getRankClassFromLevel(Math.round((minLevel + maxLevel) / 2)))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.8rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingQuest ? 'Guardar Cambios' : 'Publicar Misión'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
