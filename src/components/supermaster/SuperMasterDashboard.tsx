import React, { useState } from 'react';
import { 
  UserAccount, 
  UserRole,
  CampaignQuest, 
  AdventureRankClass,
  GoldTransferRecord
} from '../../types/dnd';
import { 
  getRankClassBadgeColor, 
  getRankClassTitle, 
  transferGoldDragons, 
  escalateFailedQuest,
  assignUserRole 
} from '../../utils/campaignAuthMath';
import { 
  Crown, 
  Coins, 
  AlertTriangle, 
  ShieldAlert, 
  Users, 
  Castle, 
  ArrowUpRight, 
  Trash2, 
  CheckCircle2, 
  Lock, 
  Unlock, 
  Sparkles, 
  TrendingUp, 
  RefreshCw, 
  X, 
  Shield,
  User,
  UserCheck,
  UserCog 
} from 'lucide-react';

interface SuperMasterDashboardProps {
  currentUser: UserAccount;
  allUsers: UserAccount[];
  allQuests: CampaignQuest[];
  onUpdateUser: (updated: UserAccount) => void;
  onUpdateQuest: (updated: CampaignQuest) => void;
  onDeleteQuest: (questId: string) => void;
}

export const SuperMasterDashboard: React.FC<SuperMasterDashboardProps> = ({
  currentUser,
  allUsers,
  allQuests,
  onUpdateUser,
  onUpdateQuest,
  onDeleteQuest
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'failed_alerts' | 'treasury' | 'permissions' | 'all_quests'>('overview');
  const [escalatingQuest, setEscalatingQuest] = useState<CampaignQuest | null>(null);

  // Formulario de Escalado
  const [newRankClass, setNewRankClass] = useState<AdventureRankClass>('A');
  const [newMinLevel, setNewMinLevel] = useState<number>(11);
  const [newMaxLevel, setNewMaxLevel] = useState<number>(14);
  const [extraGold, setExtraGold] = useState<number>(800);
  const [escalateReason, setEscalateReason] = useState<string>('Refuerzos imperiales solicitados tras la caída de los aventureros precedentes.');

  // Formulario de Transferencia de Oro a Master
  const [selectedMasterId, setSelectedMasterId] = useState<string>('');
  const [transferAmount, setTransferAmount] = useState<number>(500);
  const [transferConcept, setTransferConcept] = useState<string>('Subsidio Imperial para Nuevas Campañas');
  const [transferHistory, setTransferHistory] = useState<GoldTransferRecord[]>([]);

  // Estado para Nombramiento y Asignación de Roles
  const [roleAssignUserId, setRoleAssignUserId] = useState<string>('');
  const [roleAssignTargetRole, setRoleAssignTargetRole] = useState<UserRole>('dm');
  const [roleSuccessNotice, setRoleSuccessNotice] = useState<string | null>(null);

  // Métricas
  const totalPlayers = allUsers.filter(u => u.role === 'player').length;
  const totalMasters = allUsers.filter(u => u.role === 'dm').length;
  const activeQuests = allQuests.filter(q => q.status === 'open' || q.status === 'in_progress').length;
  const failedQuests = allQuests.filter(q => q.status === 'failed');
  const totalGoldInMasters = allUsers.filter(u => u.role === 'dm').reduce((acc, u) => acc + u.goldDragons, 0);

  // Abrir modal de escalado para una misión fallida
  const handleOpenEscalate = (quest: CampaignQuest) => {
    setEscalatingQuest(quest);
    // Sugerir clase superior
    if (quest.rankClass === 'F' || quest.rankClass === 'E') {
      setNewRankClass('D');
      setNewMinLevel(5);
      setNewMaxLevel(6);
    } else if (quest.rankClass === 'D' || quest.rankClass === 'C') {
      setNewRankClass('B');
      setNewMinLevel(9);
      setNewMaxLevel(10);
    } else {
      setNewRankClass('A');
      setNewMinLevel(11);
      setNewMaxLevel(14);
    }
    setExtraGold(500);
  };

  const handleConfirmEscalation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!escalatingQuest) return;

    const escalated = escalateFailedQuest(
      escalatingQuest,
      newRankClass,
      extraGold,
      newMinLevel,
      newMaxLevel,
      escalateReason
    );

    onUpdateQuest(escalated);
    setEscalatingQuest(null);
  };

  // Transferencia de Dragones de Oro a un Master
  const handleExecuteTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    const targetMaster = allUsers.find(u => u.id === selectedMasterId);
    if (!targetMaster) {
      alert('Por favor selecciona un Master para transferir Dragones de Oro.');
      return;
    }

    try {
      const { updatedFrom, updatedTo, transfer } = transferGoldDragons(
        currentUser,
        targetMaster,
        transferAmount,
        transferConcept
      );

      onUpdateUser(updatedTo);
      setTransferHistory(prev => [transfer, ...prev]);
      alert(`¡Transferencia de ${transferAmount} Dragones de Oro a ${targetMaster.username} completada con éxito!`);
      setTransferAmount(500);
    } catch (err: any) {
      alert(err.message || 'Error al procesar la transferencia imperial.');
    }
  };

  // Toggles de Permisos Feudales (Bastión y Escuderos)
  const handleToggleBastion = (user: UserAccount) => {
    const updated: UserAccount = {
      ...user,
      permissions: {
        ...user.permissions,
        bastionUnlocked: !user.permissions.bastionUnlocked
      }
    };
    onUpdateUser(updated);
  };

  const handleToggleSidekicks = (user: UserAccount) => {
    const updated: UserAccount = {
      ...user,
      permissions: {
        ...user.permissions,
        sidekicksUnlocked: !user.permissions.sidekicksUnlocked
      }
    };
    onUpdateUser(updated);
  };

  // Asignación y Nombramiento de Roles por Decreto Imperial
  const handleAssignRole = (targetUser: UserAccount, newRole: UserRole) => {
    try {
      const updated = assignUserRole(targetUser, newRole, currentUser);
      onUpdateUser(updated);
      setRoleSuccessNotice(`¡Decreto Imperial aplicado! "${targetUser.username}" ahora tiene el rol de "${newRole === 'dm' ? 'Dungeon Master' : 'Jugador'}".`);
      setTimeout(() => setRoleSuccessNotice(null), 5000);
    } catch (err: any) {
      alert(err.message || 'Error al modificar rol');
    }
  };

  const handleExecuteRoleDecree = (e: React.FormEvent) => {
    e.preventDefault();
    const userToUpdate = allUsers.find(u => u.id === roleAssignUserId);
    if (!userToUpdate) {
      alert('Por favor selecciona un usuario para nombrar.');
      return;
    }
    handleAssignRole(userToUpdate, roleAssignTargetRole);
    setRoleAssignUserId('');
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', paddingBottom: '3rem' }}>
      {/* Banner Imperial del Super Master */}
      <div 
        className="card card-gold" 
        style={{ 
          marginBottom: '1.5rem', 
          padding: '1.8rem 2.2rem',
          background: 'linear-gradient(135deg, rgba(20, 24, 38, 0.96) 0%, rgba(11, 13, 20, 0.98) 100%)',
          border: '2px solid var(--gold-primary)',
          boxShadow: 'var(--shadow-gold)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div 
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #ffd700, #b8860b)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 20px rgba(255, 215, 0, 0.4)'
              }}
            >
              <Crown size={32} color="#000000" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <h1 style={{ margin: 0, fontSize: '2rem', color: '#ffffff' }}>Panel del Super Master Supremo</h1>
                <span className="badge badge-gold" style={{ fontSize: '0.85rem' }}>Control Total del Reino</span>
              </div>
              <div style={{ color: 'var(--gold-hover)', fontSize: '0.95rem', marginTop: '0.2rem' }}>
                Administrador Feudal: <strong>{currentUser.email}</strong> • Tesorería Imperial Ilimitada
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
            <div style={{ background: 'rgba(212, 175, 55, 0.15)', border: '1px solid var(--gold-primary)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Coins size={20} color="var(--gold-hover)" />
              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', display: 'block' }}>TESORO IMPERIAL</span>
                <strong style={{ fontSize: '1.2rem', color: 'var(--gold-hover)', fontFamily: 'var(--font-mono)' }}>∞ Ilimitado (DO)</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Pestañas del Panel de Control */}
        <div style={{ display: 'flex', gap: '0.6rem', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.08)', flexWrap: 'wrap' }}>
          <button 
            className={`btn btn-sm ${activeSubTab === 'overview' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveSubTab('overview')}
          >
            📊 Resumen del Reino
          </button>
          <button 
            className={`btn btn-sm ${activeSubTab === 'failed_alerts' ? 'btn-danger' : 'btn-secondary'}`}
            onClick={() => setActiveSubTab('failed_alerts')}
            style={{ position: 'relative' }}
          >
            <AlertTriangle size={14} /> Misiones Fallidas ({failedQuests.length})
            {failedQuests.length > 0 && (
              <span className="badge badge-crimson" style={{ marginLeft: '0.4rem', padding: '0.1rem 0.4rem' }}>
                ¡ALERTA!
              </span>
            )}
          </button>
          <button 
            className={`btn btn-sm ${activeSubTab === 'treasury' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveSubTab('treasury')}
          >
            <Coins size={14} /> Balance & Tesorería Masters
          </button>
          <button 
            className={`btn btn-sm ${activeSubTab === 'permissions' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveSubTab('permissions')}
          >
            <UserCog size={14} /> Asignación de Roles & Privilegios
          </button>
          <button 
            className={`btn btn-sm ${activeSubTab === 'all_quests' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveSubTab('all_quests')}
          >
            ⚔️ Supervisión de Campañas ({allQuests.length})
          </button>
        </div>
      </div>

      {/* 1. VISTA DE RESUMEN DEL REINO */}
      {activeSubTab === 'overview' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
            <div className="card" style={{ textAlign: 'center', padding: '1.2rem' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)', fontWeight: 600 }}>JUGADORES REGISTRADOS</div>
              <div style={{ fontSize: '2.4rem', fontWeight: 900, color: 'var(--emerald-heal)', margin: '0.3rem 0' }}>{totalPlayers}</div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Héroes activos en mesas</span>
            </div>

            <div className="card" style={{ textAlign: 'center', padding: '1.2rem' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)', fontWeight: 600 }}>DUNGEON MASTERS</div>
              <div style={{ fontSize: '2.4rem', fontWeight: 900, color: 'var(--amethyst-magic)', margin: '0.3rem 0' }}>{totalMasters}</div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Narradores de campaña</span>
            </div>

            <div className="card" style={{ textAlign: 'center', padding: '1.2rem' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)', fontWeight: 600 }}>MISIONES ACTIVAS</div>
              <div style={{ fontSize: '2.4rem', fontWeight: 900, color: 'var(--sapphire-mana)', margin: '0.3rem 0' }}>{activeQuests}</div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>En convocatoria o en curso</span>
            </div>

            <div className="card" style={{ textAlign: 'center', padding: '1.2rem', borderColor: failedQuests.length > 0 ? '#ff3344' : 'var(--border-subtle)' }}>
              <div style={{ fontSize: '0.85rem', color: '#ff6b6b', fontWeight: 700 }}>MISIONES EN DERROTA</div>
              <div style={{ fontSize: '2.4rem', fontWeight: 900, color: '#ff3344', margin: '0.3rem 0' }}>{failedQuests.length}</div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Requieren escalado de amenaza</span>
            </div>
          </div>

          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.25rem', color: 'var(--text-gold)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={18} /> Resumen Financiero: Circulación de Dragones de Oro (DO)
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div style={{ background: 'var(--bg-input)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Dragones de Oro en arcas de Dungeon Masters:</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--gold-hover)', fontFamily: 'var(--font-mono)' }}>
                  {totalGoldInMasters.toLocaleString()} DO
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', margin: '0.4rem 0 0 0' }}>
                  Fondos presupuestados para recompensar a los aventureros que superen campañas.
                </p>
              </div>

              <div style={{ background: 'var(--bg-input)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Política Imperial de Recompensas:</div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '0.4rem 0 0 0' }}>
                  El Super Master puede inyectar Dragones de Oro en cualquier momento desde la pestaña <strong>Balance & Tesorería Masters</strong> para financiar campañas épicas.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. BANDEJA DE ALERTAS DE MISIONES FALLIDAS */}
      {activeSubTab === 'failed_alerts' && (
        <div>
          <div className="card" style={{ marginBottom: '1.2rem', borderColor: '#ff3344', background: 'rgba(201, 42, 42, 0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <AlertTriangle size={26} color="#ff3344" />
              <div>
                <h2 style={{ margin: 0, fontSize: '1.3rem', color: '#ff4d4d' }}>Bandeja Imperial de Alertas: Misiones Fracasadas</h2>
                <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                  Cuando un grupo de aventureros cae en combate o fracasa en su contrato, la misión queda en estado de amenaza latente. Como Super Master, puedes elevar su <strong>Clase de Rango</strong> (ej. a Clase A o S), aumentar su nivel numérico y otorgar más Dragones de Oro para reclutar héroes más poderosos.
                </p>
              </div>
            </div>
          </div>

          {failedQuests.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-dim)' }}>
              <CheckCircle2 size={46} color="#2b8a3e" style={{ marginBottom: '0.8rem' }} />
              <h3 style={{ margin: 0, color: 'var(--emerald-heal)' }}>¡Ninguna misión en estado de fracaso!</h3>
              <p style={{ margin: '0.4rem 0 0 0', fontSize: '0.9rem' }}>El reino permanece seguro y las aventuras en curso progresan favorablemente.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {failedQuests.map(quest => (
                <div key={quest.id} className="card" style={{ border: '2px solid #ff3344', padding: '1.4rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <h3 style={{ margin: 0, fontSize: '1.3rem' }}>{quest.title}</h3>
                        <span className="badge badge-crimson" style={{ fontSize: '0.8rem' }}>
                          💀 Derrota Registrada
                        </span>
                        <span className="badge badge-gold" style={{ fontSize: '0.8rem' }}>
                          Actual: Clase {quest.rankClass} (Nvl {quest.minLevel}-{quest.maxLevel})
                        </span>
                      </div>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: '0.5rem 0' }}>
                        {quest.description}
                      </p>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-dim)' }}>
                        Master a cargo: <strong>{quest.masterName}</strong> | Recompensa previa: <strong>{quest.goldReward} DO</strong> | Fecha: {quest.sessionDate}
                      </div>
                      {quest.notes && (
                        <div style={{ marginTop: '0.4rem', fontSize: '0.82rem', color: '#ff9999', fontStyle: 'italic' }}>
                          Nota del Master: {quest.notes}
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                      <button 
                        className="btn btn-primary"
                        onClick={() => handleOpenEscalate(quest)}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                      >
                        <TrendingUp size={16} /> Escalar Amenaza y Recompensa
                      </button>
                      <button 
                        className="btn btn-danger btn-sm"
                        onClick={() => {
                          if (window.confirm(`¿Confirmas purgar definitivamente la misión "${quest.title}"?`)) {
                            onDeleteQuest(quest.id);
                          }
                        }}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 3. PANEL DE BALANCE Y TESORERÍA MASTERS */}
      {activeSubTab === 'treasury' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem' }}>
          {/* Formulario de Asignación */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.3rem', color: 'var(--text-gold)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Coins size={20} /> Asignar Dragones de Oro a un Dungeon Master
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.2rem' }}>
              Los Dungeon Masters utilizan los Dragones de Oro otorgados por la Corona Imperial para presupuestar las recompensas de sus misiones.
            </p>

            <form onSubmit={handleExecuteTransfer}>
              <div style={{ marginBottom: '1rem' }}>
                <label>Seleccionar Dungeon Master Destinatario</label>
                <select 
                  value={selectedMasterId} 
                  onChange={e => setSelectedMasterId(e.target.value)}
                  required
                >
                  <option value="">-- Elige un Master --</option>
                  {allUsers.filter(u => u.role === 'dm').map(dm => (
                    <option key={dm.id} value={dm.id}>
                      {dm.username} ({dm.email}) — Saldo actual: {dm.goldDragons.toLocaleString()} DO
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label>Cantidad de Dragones de Oro (DO)</label>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  {[250, 500, 1000, 2500, 5000].map(amt => (
                    <button 
                      key={amt} 
                      type="button" 
                      className={`btn btn-sm ${transferAmount === amt ? 'btn-primary' : 'btn-secondary'}`}
                      onClick={() => setTransferAmount(amt)}
                    >
                      +{amt} DO
                    </button>
                  ))}
                </div>
                <input 
                  type="number" 
                  min={1} 
                  value={transferAmount} 
                  onChange={e => setTransferAmount(parseInt(e.target.value, 10) || 1)} 
                  required 
                />
              </div>

              <div style={{ marginBottom: '1.2rem' }}>
                <label>Concepto del Decreto Imperial</label>
                <input 
                  type="text" 
                  value={transferConcept} 
                  onChange={e => setTransferConcept(e.target.value)} 
                  placeholder="Ej. Subsidio para Campaña de Ravenloft"
                  required 
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                <Crown size={16} /> Emitir y Transferir Dragones de Oro
              </button>
            </form>
          </div>

          {/* Tabla de Balances de los Masters */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.2rem', color: 'var(--text-gold)' }}>
              Balances de Masters del Reino ({allUsers.filter(u => u.role === 'dm').length})
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', maxHeight: '350px', overflowY: 'auto' }}>
              {allUsers.filter(u => u.role === 'dm').map(dm => (
                <div key={dm.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem 0.8rem', background: 'var(--bg-input)', borderRadius: 'var(--radius-sm)' }}>
                  <div>
                    <strong style={{ fontSize: '0.9rem' }}>{dm.username}</strong>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{dm.email}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--gold-hover)', fontWeight: 800, fontSize: '1rem' }}>
                    <Coins size={16} /> {dm.goldDragons.toLocaleString()} DO
                  </div>
                </div>
              ))}
            </div>

            {transferHistory.length > 0 && (
              <div style={{ marginTop: '1.2rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-dim)', marginBottom: '0.4rem' }}>
                  Transferencias Recientes en esta Sesión:
                </div>
                {transferHistory.slice(0, 3).map(tx => (
                  <div key={tx.id} style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                    • Transferidos <strong>{tx.amount} DO</strong> a {tx.toUserName}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. CONTROL DE USUARIOS, ASIGNACIÓN DE ROLES & PRIVILEGIOS FEUDALES */}
      {activeSubTab === 'permissions' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>
          {/* Alerta de Éxito en Nombramiento */}
          {roleSuccessNotice && (
            <div style={{
              background: 'linear-gradient(135deg, rgba(43, 138, 62, 0.2), rgba(20, 80, 40, 0.3))',
              border: '1px solid #2b8a3e',
              padding: '0.8rem 1.2rem',
              borderRadius: 'var(--radius-md)',
              color: '#d3f9d8',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              boxShadow: '0 4px 15px rgba(43, 138, 62, 0.25)',
              animation: 'slideIn 0.3s ease-out'
            }}>
              <CheckCircle2 size={18} color="#40c057" />
              <strong style={{ fontSize: '0.92rem' }}>{roleSuccessNotice}</strong>
            </div>
          )}

          {/* Tarjeta 1: Decreto Imperial de Nombramiento de Roles */}
          <div className="card" style={{ padding: '1.5rem', border: '1px solid var(--border-gold)', background: 'linear-gradient(180deg, rgba(20, 24, 38, 0.95), rgba(12, 14, 22, 0.95))' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', marginBottom: '1rem' }}>
              <div style={{ padding: '0.4rem', borderRadius: '8px', background: 'rgba(212, 175, 55, 0.15)', border: '1px solid var(--gold-primary)' }}>
                <UserCheck size={20} color="var(--gold-hover)" />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.18rem', color: '#ffffff' }}>Decreto Imperial: Nombramiento de Roles</h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Otorga el rango de Dungeon Master o cambia a Jugador a cualquier miembro registrado de la comunidad.
                </span>
              </div>
            </div>

            <form onSubmit={handleExecuteRoleDecree} style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr auto', gap: '1rem', alignItems: 'end' }}>
              <div>
                <label style={{ fontSize: '0.82rem', color: 'var(--text-gold)', marginBottom: '0.35rem', display: 'block' }}>
                  Seleccionar Usuario / Aventurero:
                </label>
                <select
                  value={roleAssignUserId}
                  onChange={e => setRoleAssignUserId(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }}
                  required
                >
                  <option value="">-- Elige un usuario del reino --</option>
                  {allUsers
                    .filter(u => u.role !== 'supermaster')
                    .map(u => (
                      <option key={u.id} value={u.id}>
                        {u.username} ({u.email}) — Rol actual: {u.role === 'dm' ? 'Master' : 'Jugador'}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', color: 'var(--text-gold)', marginBottom: '0.35rem', display: 'block' }}>
                  Nuevo Rol a Conferir:
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  <button
                    type="button"
                    className={`btn btn-sm ${roleAssignTargetRole === 'player' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setRoleAssignTargetRole('player')}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem' }}
                  >
                    <User size={14} /> Jugador
                  </button>
                  <button
                    type="button"
                    className={`btn btn-sm ${roleAssignTargetRole === 'dm' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setRoleAssignTargetRole('dm')}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem' }}
                  >
                    <Shield size={14} /> Master (DM)
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary glow-hover"
                style={{ height: '40px', padding: '0 1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <Crown size={15} /> Aplicar Decreto
              </button>
            </form>
          </div>

          {/* Tarjeta 2: Matriz Completa de Usuarios, Roles y Cerrojors Feudales */}
          <div className="card" style={{ padding: '1.6rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1rem' }}>
              <Lock size={22} color="var(--gold-primary)" />
              <div>
                <h3 style={{ margin: 0, fontSize: '1.3rem' }}>Matriz de Usuarios, Roles & Privilegios Feudales</h3>
                <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                  Cambia roles al vuelo o habilita/bloquea los módulos de <strong>Bastión 2024</strong> y <strong>Escuderos & Mascotas (Tasha)</strong> para cada usuario.
                </p>
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border-gold)', textAlign: 'left', color: 'var(--text-gold)' }}>
                    <th style={{ padding: '0.6rem' }}>Usuario / Correo</th>
                    <th style={{ padding: '0.6rem' }}>Rol Actual</th>
                    <th style={{ padding: '0.6rem', textAlign: 'center' }}>👑 Asignar Nuevo Rol</th>
                    <th style={{ padding: '0.6rem' }}>Dragones de Oro</th>
                    <th style={{ padding: '0.6rem', textAlign: 'center' }}>🏰 Bastión 2024</th>
                    <th style={{ padding: '0.6rem', textAlign: 'center' }}>🐾 Escuderos & Mascotas</th>
                  </tr>
                </thead>
                <tbody>
                  {allUsers.map(user => {
                    const isSM = user.role === 'supermaster';

                    return (
                      <tr key={user.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                        <td style={{ padding: '0.7rem 0.6rem' }}>
                          <strong>{user.username}</strong>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{user.email}</div>
                        </td>
                        <td style={{ padding: '0.7rem 0.6rem' }}>
                          <span className={`badge ${user.role === 'supermaster' ? 'badge-gold' : user.role === 'dm' ? 'badge-magic' : 'badge-sapphire'}`} style={{ fontSize: '0.75rem' }}>
                            {user.role === 'supermaster' ? '👑 Super Master' : user.role === 'dm' ? '📜 Master' : '⚔️ Jugador'}
                          </span>
                        </td>
                        <td style={{ padding: '0.7rem 0.6rem', textAlign: 'center' }}>
                          {isSM ? (
                            <span className="badge badge-gold" style={{ fontSize: '0.72rem' }}>👑 Corona Imperial</span>
                          ) : (
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                              <select
                                value={user.role}
                                onChange={(e) => handleAssignRole(user, e.target.value as UserRole)}
                                style={{
                                  padding: '0.28rem 0.6rem',
                                  fontSize: '0.78rem',
                                  borderRadius: 'var(--radius-sm)',
                                  background: user.role === 'dm' ? 'rgba(157, 78, 221, 0.18)' : 'rgba(43, 138, 62, 0.18)',
                                  border: user.role === 'dm' ? '1px solid #9d4edd' : '1px solid #2b8a3e',
                                  color: '#ffffff',
                                  fontWeight: 700,
                                  cursor: 'pointer'
                                }}
                              >
                                <option value="player" style={{ background: '#111521', color: '#ffffff' }}>⚔️ Jugador</option>
                                <option value="dm" style={{ background: '#111521', color: '#ffffff' }}>📜 Master (DM)</option>
                              </select>
                            </div>
                          )}
                        </td>
                        <td style={{ padding: '0.7rem 0.6rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--gold-hover)' }}>
                          {user.role === 'supermaster' ? '∞ Ilimitado' : `${user.goldDragons.toLocaleString()} DO`}
                        </td>
                        <td style={{ padding: '0.7rem 0.6rem', textAlign: 'center' }}>
                          {isSM ? (
                            <span className="badge badge-gold" style={{ fontSize: '0.7rem' }}>Soberano</span>
                          ) : (
                            <button
                              className={`btn btn-sm ${user.permissions.bastionUnlocked ? 'btn-heal' : 'btn-secondary'}`}
                              onClick={() => handleToggleBastion(user)}
                              style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                            >
                              {user.permissions.bastionUnlocked ? (
                                <><Unlock size={12} /> Habilitado</>
                              ) : (
                                <><Lock size={12} /> Bloqueado</>
                              )}
                            </button>
                          )}
                        </td>
                        <td style={{ padding: '0.7rem 0.6rem', textAlign: 'center' }}>
                          {isSM ? (
                            <span className="badge badge-gold" style={{ fontSize: '0.7rem' }}>Soberano</span>
                          ) : (
                            <button
                              className={`btn btn-sm ${user.permissions.sidekicksUnlocked ? 'btn-heal' : 'btn-secondary'}`}
                              onClick={() => handleToggleSidekicks(user)}
                              style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                            >
                              {user.permissions.sidekicksUnlocked ? (
                                <><Unlock size={12} /> Habilitado</>
                              ) : (
                                <><Lock size={12} /> Bloqueado</>
                              )}
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 5. SUPERVISIÓN Y PURGADO DE TODAS LAS CAMPAÑAS */}
      {activeSubTab === 'all_quests' && (
        <div className="card" style={{ padding: '1.6rem' }}>
          <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.3rem', color: 'var(--text-gold)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            ⚔️ Supervisión General de Campañas del Reino ({allQuests.length})
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.2rem' }}>
            Como Super Master tienes el privilegio exclusivo de purgar o remover cualquier misión que infrinja las reglas o esté desactualizada.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            {allQuests.map(quest => (
              <div key={quest.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.8rem 1rem', background: 'var(--bg-input)', borderRadius: 'var(--radius-sm)', flexWrap: 'wrap', gap: '0.8rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <strong>{quest.title}</strong>
                    <span className="badge badge-gold" style={{ fontSize: '0.75rem' }}>
                      Clase {quest.rankClass} (Nvl {quest.minLevel}-{quest.maxLevel})
                    </span>
                    <span className={`badge ${quest.status === 'completed' ? 'badge-heal' : quest.status === 'failed' ? 'badge-crimson' : 'badge-sapphire'}`} style={{ fontSize: '0.7rem' }}>
                      {quest.status}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>
                    Master: <strong>{quest.masterName}</strong> • Recompensa: {quest.goldReward} DO • Fecha: {quest.sessionDate}
                  </div>
                </div>

                <button 
                  className="btn btn-danger btn-sm"
                  onClick={() => {
                    if (window.confirm(`¿Confirmas la purga de "${quest.title}"? Esta acción es irreversible.`)) {
                      onDeleteQuest(quest.id);
                    }
                  }}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                >
                  <Trash2 size={13} /> Purgar Campaña
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal de Escalado de Misión Fallida */}
      {escalatingQuest && (
        <div className="modal-overlay" onClick={() => setEscalatingQuest(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '560px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', borderBottom: '1px solid var(--border-gold)', paddingBottom: '0.6rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <TrendingUp size={22} color="var(--gold-primary)" />
                <h2 style={{ margin: 0, padding: 0, border: 'none', fontSize: '1.3rem' }}>
                  Escalado Imperial de Misión Fallida
                </h2>
              </div>
              <button className="btn btn-secondary btn-sm" onClick={() => setEscalatingQuest(null)}>
                <X size={16} />
              </button>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.2rem' }}>
              La misión <strong>"{escalatingQuest.title}"</strong> resultó en derrota. Establece el nuevo rango de poder y recompensa para reabrirla a aventureros más preparados.
            </p>

            <form onSubmit={handleConfirmEscalation}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label>Nueva Clase de Misión</label>
                  <select 
                    value={newRankClass} 
                    onChange={e => setNewRankClass(e.target.value as AdventureRankClass)}
                  >
                    {['F', 'E', 'D', 'C', 'B', 'A', 'S', 'SS', 'SS+'].map(r => (
                      <option key={r} value={r}>{getRankClassTitle(r as AdventureRankClass)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label>Dragones de Oro Adicionales (+DO)</label>
                  <input 
                    type="number" 
                    min={0} 
                    value={extraGold} 
                    onChange={e => setExtraGold(parseInt(e.target.value, 10) || 0)} 
                    required 
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label>Nuevo Nivel Mínimo</label>
                  <input 
                    type="number" 
                    min={1} 
                    max={20} 
                    value={newMinLevel} 
                    onChange={e => setNewMinLevel(parseInt(e.target.value, 10) || 1)} 
                    required 
                  />
                </div>
                <div>
                  <label>Nuevo Nivel Máximo</label>
                  <input 
                    type="number" 
                    min={1} 
                    max={20} 
                    value={newMaxLevel} 
                    onChange={e => setNewMaxLevel(parseInt(e.target.value, 10) || 20)} 
                    required 
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1.4rem' }}>
                <label>Decreto y Justificación del Escalado</label>
                <textarea 
                  rows={3} 
                  value={escalateReason} 
                  onChange={e => setEscalateReason(e.target.value)} 
                  required 
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.8rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setEscalatingQuest(null)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <TrendingUp size={16} /> Reabrir y Escalar Misión
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
