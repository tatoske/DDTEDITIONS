import React, { useState } from 'react';
import { Character, CharacterAdventureRecord } from '../../types/dnd';
import { 
  getRankClassFromLevel, 
  getRankClassTitle, 
  getRankClassBadgeColor 
} from '../../utils/campaignAuthMath';
import { 
  BookOpen, 
  Coins, 
  Trophy, 
  Skull, 
  Footprints, 
  Calendar, 
  Sparkles, 
  Shield, 
  Heart, 
  Plus, 
  X, 
  User,
  Printer 
} from 'lucide-react';
import { triggerGrimoirePrint } from '../../utils/grimoireExportMath';

interface AdventureGrimoireProfileProps {
  character: Character;
  onUpdateCharacter: (updated: Character) => void;
}

export const AdventureGrimoireProfile: React.FC<AdventureGrimoireProfileProps> = ({
  character,
  onUpdateCharacter
}) => {
  const [showAddNoteModal, setShowAddNoteModal] = useState<boolean>(false);
  const [newNoteTitle, setNewNoteTitle] = useState<string>('');
  const [newNoteMaster, setNewNoteMaster] = useState<string>('');
  const [newNoteOutcome, setNewNoteOutcome] = useState<'victory' | 'defeat' | 'retreat'>('victory');
  const [newNoteGold, setNewNoteGold] = useState<number>(100);
  const [newNoteText, setNewNoteText] = useState<string>('');

  const rankClass = getRankClassFromLevel(character.level);
  const badgeColors = getRankClassBadgeColor(rankClass);

  const chronicles: CharacterAdventureRecord[] = character.adventureChronicles || [];

  const totalVictories = chronicles.filter(c => c.outcome === 'victory').length;
  const totalDefeats = chronicles.filter(c => c.outcome === 'defeat').length;
  const totalRetreats = chronicles.filter(c => c.outcome === 'retreat').length;
  const totalMissions = chronicles.length;
  const winRate = totalMissions > 0 ? Math.round((totalVictories / totalMissions) * 100) : 100;

  const totalGoldFromChronicles = chronicles.reduce((acc, c) => acc + (c.goldEarned || 0), 0);
  const totalGoldDragons = character.goldDragons || 0;

  const handleAddManualChronicle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteTitle.trim()) return;

    const newRecord: CharacterAdventureRecord = {
      id: `chr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      questId: `manual_${Date.now()}`,
      questTitle: newNoteTitle.trim(),
      masterName: newNoteMaster.trim() || 'Dungeon Master',
      sessionDate: new Date().toLocaleDateString(),
      rankClass,
      outcome: newNoteOutcome,
      goldEarned: newNoteGold,
      chronicleNotes: newNoteText.trim() || 'Crónica inscrita en el libro del héroe.',
      recordedAt: new Date().toISOString()
    };

    const updated = [newRecord, ...chronicles];
    const newGold = (character.goldDragons || 0) + newNoteGold;

    onUpdateCharacter({
      ...character,
      goldDragons: newGold,
      adventureChronicles: updated,
      updatedAt: new Date().toISOString()
    });

    setShowAddNoteModal(false);
    setNewNoteTitle('');
    setNewNoteText('');
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', paddingBottom: '3rem' }}>
      {/* Portada del Grimorio */}
      <div 
        className="card card-gold" 
        style={{ 
          marginBottom: '2rem', 
          padding: '2rem',
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.96) 0%, rgba(245, 241, 230, 0.98) 100%)',
          border: '2px solid var(--border-gold)',
          boxShadow: 'var(--shadow-card), inset 0 0 30px rgba(158, 117, 20, 0.08)',
          position: 'relative'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '1.2rem', alignItems: 'center' }}>
            <div 
              style={{
                width: '80px',
                height: '80px',
                borderRadius: 'var(--radius-md)',
                background: 'linear-gradient(135deg, #2a3352, #151a2b)',
                border: '2px solid var(--gold-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'var(--shadow-gold)'
              }}
            >
              <BookOpen size={42} color="var(--gold-hover)" />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                <h1 style={{ margin: 0, fontSize: '2.2rem' }}>{character.name}</h1>
                <span 
                  style={{
                    padding: '0.25rem 0.8rem',
                    borderRadius: 'var(--radius-full)',
                    background: badgeColors.bg,
                    color: badgeColors.color,
                    border: `1px solid ${badgeColors.border}`,
                    fontWeight: 900,
                    fontSize: '0.9rem'
                  }}
                >
                  RANGO CLASE {rankClass}
                </span>
              </div>
              <div style={{ color: 'var(--text-gold)', fontSize: '1rem', marginTop: '0.2rem', fontWeight: 600 }}>
                {character.species} • {character.className} • Nivel {character.level}
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                {getRankClassTitle(rankClass)} | Jugador: {character.playerName || 'Anónimo'}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <button 
              className="btn btn-secondary btn-sm"
              onClick={() => triggerGrimoirePrint(character, chronicles)}
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', border: '1px solid var(--border-gold)' }}
              title="Descargar o imprimir el Grimorio oficial en PDF"
            >
              <Printer size={15} color="var(--gold-hover)" />
              <span>Exportar Grimorio en PDF</span>
            </button>
            <button 
              className="btn btn-primary btn-sm"
              onClick={() => setShowAddNoteModal(true)}
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <Plus size={15} /> Inscribir Nueva Crónica
            </button>
          </div>
        </div>

        {/* Cajas de Estadísticas de Gloria y Fortuna */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginTop: '1.8rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-subtle)' }}>
          <div className="card" style={{ textAlign: 'center', padding: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem', color: 'var(--gold-hover)', fontSize: '0.85rem', fontWeight: 700 }}>
              <Coins size={16} /> DRAGONES DE ORO (DO)
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 900, fontFamily: 'var(--font-mono)', color: 'var(--gold-hover)', marginTop: '0.2rem' }}>
              {totalGoldDragons.toLocaleString()}
            </div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>{totalGoldFromChronicles.toLocaleString()} DO de misiones</span>
          </div>

          <div className="card" style={{ textAlign: 'center', padding: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem', color: '#2b8a3e', fontSize: '0.85rem', fontWeight: 700 }}>
              <Trophy size={16} /> VICTORIAS ÉPICAS
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 900, fontFamily: 'var(--font-mono)', color: '#2b8a3e', marginTop: '0.2rem' }}>
              {totalVictories}
            </div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>{winRate}% Tasa de éxito</span>
          </div>

          <div className="card" style={{ textAlign: 'center', padding: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem', color: '#c92a2a', fontSize: '0.85rem', fontWeight: 700 }}>
              <Skull size={16} /> DERROTAS / CAÍDAS
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 900, fontFamily: 'var(--font-mono)', color: '#c92a2a', marginTop: '0.2rem' }}>
              {totalDefeats}
            </div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Ciclos de resurrección</span>
          </div>

          <div className="card" style={{ textAlign: 'center', padding: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem', color: 'var(--sapphire-mana)', fontSize: '0.85rem', fontWeight: 700 }}>
              <Footprints size={16} /> RETIRADAS TÁCTICAS
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 900, fontFamily: 'var(--font-mono)', color: 'var(--sapphire-mana)', marginTop: '0.2rem' }}>
              {totalRetreats}
            </div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Supervivencia estratégica</span>
          </div>
        </div>
      </div>

      {/* Páginas del Grimorio: Listado Cronológico de Aventuras */}
      <div>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sparkles size={20} color="var(--gold-primary)" /> Crónicas Registradas en el Grimorio ({chronicles.length})
        </h2>

        {chronicles.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1.5rem', color: 'var(--text-dim)' }}>
            <BookOpen size={48} style={{ opacity: 0.25, marginBottom: '0.8rem' }} />
            <h3 style={{ margin: 0, color: 'var(--text-muted)' }}>El Grimorio de Aventuras está en Blanco</h3>
            <p style={{ margin: '0.5rem 0 1.2rem 0', fontSize: '0.9rem' }}>
              Participa en las misiones del <strong>Tablero de Anuncios</strong> o inscribe manualmente tus hazañas pasadas.
            </p>
            <button className="btn btn-primary btn-sm" onClick={() => setShowAddNoteModal(true)}>
              <Plus size={14} /> Escribir Primera Crónica
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {chronicles.map(record => {
              const isWin = record.outcome === 'victory';
              const isDefeat = record.outcome === 'defeat';

              return (
                <div 
                  key={record.id}
                  className="card"
                  style={{
                    borderLeft: `5px solid ${isWin ? '#2b8a3e' : isDefeat ? '#c92a2a' : '#6c757d'}`,
                    padding: '1.2rem 1.6rem',
                    background: 'var(--bg-card)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.8rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <h3 style={{ margin: 0, fontSize: '1.25rem' }}>{record.questTitle}</h3>
                        <span 
                          className={`badge ${isWin ? 'badge-heal' : isDefeat ? 'badge-crimson' : 'badge-secondary'}`}
                          style={{ fontSize: '0.75rem' }}
                        >
                          {isWin ? '🏆 Victoria Heroica' : isDefeat ? '💀 Derrota Amarga' : '🏃 Retirada Táctica'}
                        </span>
                        <span className="badge badge-sapphire" style={{ fontSize: '0.72rem' }}>
                          Clase {record.rankClass}
                        </span>
                      </div>

                      <div style={{ color: 'var(--text-dim)', fontSize: '0.8rem', marginTop: '0.3rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        <span>Master: <strong>{record.masterName}</strong></span>
                        <span>Fecha: {record.sessionDate}</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--gold-hover)', fontWeight: 800, fontSize: '1.05rem' }}>
                      <Coins size={18} /> +{record.goldEarned} DO
                    </div>
                  </div>

                  <p style={{ margin: '0.8rem 0 0 0', color: 'var(--text-muted)', fontSize: '0.92rem', fontStyle: 'italic', lineHeight: 1.5 }}>
                    "{record.chronicleNotes}"
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal para Inscribir Crónica Manual */}
      {showAddNoteModal && (
        <div className="modal-overlay" onClick={() => setShowAddNoteModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '540px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', borderBottom: '1px solid var(--border-gold)', paddingBottom: '0.6rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <BookOpen size={20} color="var(--gold-primary)" />
                <h2 style={{ margin: 0, padding: 0, border: 'none', fontSize: '1.3rem' }}>
                  Inscribir Nueva Crónica en el Grimorio
                </h2>
              </div>
              <button className="btn btn-secondary btn-sm" onClick={() => setShowAddNoteModal(false)}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleAddManualChronicle}>
              <div style={{ marginBottom: '1rem' }}>
                <label>Título de la Aventura</label>
                <input 
                  type="text" 
                  value={newNoteTitle} 
                  onChange={e => setNewNoteTitle(e.target.value)} 
                  placeholder="Ej. El Rescate de la Marquesa en los Páramos"
                  required 
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '0.8rem', marginBottom: '1rem' }}>
                <div>
                  <label>Master de la Mesa</label>
                  <input 
                    type="text" 
                    value={newNoteMaster} 
                    onChange={e => setNewNoteMaster(e.target.value)} 
                    placeholder="Ej. Master Elminster"
                  />
                </div>
                <div>
                  <label>Desenlace</label>
                  <select 
                    value={newNoteOutcome} 
                    onChange={e => setNewNoteOutcome(e.target.value as any)}
                  >
                    <option value="victory">🏆 Victoria Heroica</option>
                    <option value="defeat">💀 Derrota Amarga</option>
                    <option value="retreat">🏃 Retirada Táctica</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label>Dragones de Oro (DO) Obtenidos</label>
                <input 
                  type="number" 
                  min={0} 
                  value={newNoteGold} 
                  onChange={e => setNewNoteGold(parseInt(e.target.value, 10) || 0)} 
                />
              </div>

              <div style={{ marginBottom: '1.4rem' }}>
                <label>Testimonio del Cronista / Resumen Épico</label>
                <textarea 
                  rows={3} 
                  value={newNoteText} 
                  onChange={e => setNewNoteText(e.target.value)} 
                  placeholder="Escribe cómo el héroe triunfó, las heridas sufridas o las lecciones aprendidas..."
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.8rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddNoteModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Inscribir en el Grimorio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
