import React, { useState, useEffect } from 'react';
import { Character, CharacterItem } from '../../types/dnd';
import { INITIAL_MAGIC_ITEMS } from '../../data/magicItemsData';
import { processDmFullGrant, distributeLootAmongCharacters, GrantRewardPayload } from '../../utils/dmGrantMath';
import { Gift, X, Sparkles, Coins, Swords, Award, Wand2, Check, Shield, Users } from 'lucide-react';

interface DmQuickRewardModalProps {
  isOpen: boolean;
  onClose: () => void;
  characters: Character[];
  targetCharacterId: string;
  onUpdateCharacter: (updated: Character) => void;
  onUpdateAllCharacters?: (updatedList: Character[]) => void;
}

export const DmQuickRewardModal: React.FC<DmQuickRewardModalProps> = ({
  isOpen,
  onClose,
  characters,
  targetCharacterId,
  onUpdateCharacter,
  onUpdateAllCharacters
}) => {
  const [recipientMode, setRecipientMode] = useState<'single' | 'all'>('single');
  const [selectedCharId, setSelectedCharId] = useState<string>(targetCharacterId || characters[0]?.id || '');

  useEffect(() => {
    if (targetCharacterId) {
      setSelectedCharId(targetCharacterId);
    }
  }, [targetCharacterId, isOpen]);
  
  // Tipo de Recompensa activa en el modal
  const [rewardTab, setRewardTab] = useState<'item' | 'currency' | 'xp' | 'preset'>('preset');

  // Estado para Preset de Objeto Mágico Oficial
  const [selectedPresetIndex, setSelectedPresetIndex] = useState<number>(0);
  const [presetNotes, setPresetNotes] = useState<string>('Recompensa de batalla otorgada por el Dungeon Master');

  // Estado para Objeto Personalizado
  const [customName, setCustomName] = useState<string>('');
  const [customCategory, setCustomCategory] = useState<'item' | 'weapon' | 'potion' | 'scroll'>('item');
  const [customRarity, setCustomRarity] = useState<'Común' | 'Poco Común' | 'Raro' | 'Muy Raro' | 'Legendario'>('Raro');
  const [customQty, setCustomQty] = useState<number>(1);
  const [customDesc, setCustomDesc] = useState<string>('');
  const [customDamageDice, setCustomDamageDice] = useState<string>('1d8 + 3');

  // Estado para Monedas
  const [grantGp, setGrantGp] = useState<number>(100);
  const [grantDo, setGrantDo] = useState<number>(50);
  const [currencyReason, setCurrencyReason] = useState<string>('Botín de contrato de aventura');

  // Estado para XP
  const [grantXp, setGrantXp] = useState<number>(500);

  if (!isOpen) return null;

  const targetChar = characters.find(c => c.id === selectedCharId) || characters[0];

  const handleGrantPresetItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetChar) return;

    const preset = INITIAL_MAGIC_ITEMS[selectedPresetIndex];
    if (!preset) return;

    const payload: GrantRewardPayload = {
      itemName: preset.name,
      itemCategory: preset.type.toLowerCase().includes('arma') ? 'weapon' : 'item',
      itemRarity: (preset.rarity as any) || 'Raro',
      itemQuantity: 1,
      itemDescription: preset.description,
      reason: presetNotes
    };

    const { updatedCharacter, summaryMessage } = processDmFullGrant(targetChar, payload);
    onUpdateCharacter(updatedCharacter);
    alert(`🎁 ¡Objeto Mágico Entregado!\n${summaryMessage}`);
    onClose();
  };

  const handleGrantCustomItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetChar || !customName.trim()) return;

    const payload: GrantRewardPayload = {
      itemName: customName.trim(),
      itemCategory: customCategory,
      itemRarity: customRarity,
      itemQuantity: customQty,
      itemDescription: customDesc,
      damageDice: customCategory === 'weapon' ? customDamageDice : undefined
    };

    const { updatedCharacter, summaryMessage } = processDmFullGrant(targetChar, payload);
    onUpdateCharacter(updatedCharacter);
    alert(`🎁 ¡Objeto Concedido con Éxito!\n${summaryMessage}`);
    onClose();
  };

  const handleGrantCurrency = (e: React.FormEvent) => {
    e.preventDefault();
    if (recipientMode === 'all' && onUpdateAllCharacters) {
      const updatedList = distributeLootAmongCharacters(characters, {
        totalGp: grantGp,
        totalGoldDragons: grantDo
      });
      onUpdateAllCharacters(updatedList);
      alert(`🪙 ¡Botín Repartido!\nSe repartieron ${grantGp} PO y ${grantDo} DO equitativamente entre los ${characters.length} aventureros.`);
    } else {
      if (!targetChar) return;
      const { updatedCharacter, summaryMessage } = processDmFullGrant(targetChar, {
        gp: grantGp,
        goldDragons: grantDo,
        reason: currencyReason
      });
      onUpdateCharacter(updatedCharacter);
      alert(`🪙 ¡Fondos Concedidos!\n${summaryMessage}`);
    }
    onClose();
  };

  const handleGrantExperience = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetChar || grantXp <= 0) return;

    const { updatedCharacter, summaryMessage } = processDmFullGrant(targetChar, {
      experience: grantXp
    });
    onUpdateCharacter(updatedCharacter);
    alert(`⭐ ¡Experiencia Concedida!\n${summaryMessage}`);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '640px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', borderBottom: '1px solid var(--border-gold)', paddingBottom: '0.6rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div className="brand-icon" style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, #ffd700, #b8860b)' }}>
              <Gift size={20} color="#0b0d14" />
            </div>
            <div>
              <h2 style={{ margin: 0, padding: 0, border: 'none', fontSize: '1.3rem' }}>
                Concesión de Recompensas de DM
              </h2>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                Entrega objetos mágicos, tesoro, Dragones de Oro o experiencia a los jugadores
              </span>
            </div>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={onClose} style={{ padding: '0.3rem' }}>
            <X size={18} />
          </button>
        </div>

        {/* Destinatario de la Recompensa */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.1), rgba(15, 20, 32, 0.95))',
          border: '1px solid var(--border-gold)',
          borderRadius: 'var(--radius-md)',
          padding: '0.9rem 1.1rem',
          marginBottom: '1.2rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
            <label style={{ margin: 0, fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-gold)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Users size={14} /> Destinatario en la Mesa:
            </label>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <button
                type="button"
                className={`btn btn-xs ${recipientMode === 'single' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setRecipientMode('single')}
              >
                Aventurero Individual
              </button>
              {rewardTab === 'currency' && (
                <button
                  type="button"
                  className={`btn btn-xs ${recipientMode === 'all' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setRecipientMode('all')}
                  title="Dividir equitativamente entre todo el grupo"
                >
                  Reparto Grupal
                </button>
              )}
            </div>
          </div>

          {recipientMode === 'single' ? (
            <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
              <select
                value={selectedCharId}
                onChange={e => setSelectedCharId(e.target.value)}
                style={{ flex: 1, padding: '0.5rem 0.8rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', fontWeight: 600 }}
              >
                {characters.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.className} Nvl {c.level}) — Jugador: {c.playerName || 'Héroe'}
                  </option>
                ))}
              </select>

              {targetChar && (
                <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', textAlign: 'right', lineHeight: 1.2 }}>
                  <div>PG: <strong style={{ color: '#40c057' }}>{targetChar.currentHp}/{targetChar.maxHp}</strong></div>
                  <div>DO: <strong style={{ color: 'var(--gold-hover)' }}>{targetChar.goldDragons || 0} DO</strong></div>
                </div>
              )}
            </div>
          ) : (
            <div style={{ fontSize: '0.82rem', color: 'var(--gold-hover)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Users size={15} />
              <span>Se dividirá entre los <strong>{characters.length} aventureros</strong> del grupo.</span>
            </div>
          )}
        </div>

        {/* Pestañas de Tipo de Recompensa */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', marginBottom: '1.2rem' }}>
          <button
            type="button"
            className={`btn btn-sm ${rewardTab === 'preset' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setRewardTab('preset')}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem', fontSize: '0.76rem' }}
          >
            <Wand2 size={13} /> Objeto Mágico 2024
          </button>
          <button
            type="button"
            className={`btn btn-sm ${rewardTab === 'item' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setRewardTab('item')}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem', fontSize: '0.76rem' }}
          >
            <Swords size={13} /> Objeto Personalizado
          </button>
          <button
            type="button"
            className={`btn btn-sm ${rewardTab === 'currency' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setRewardTab('currency')}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem', fontSize: '0.76rem' }}
          >
            <Coins size={13} /> Oro & Dragones (DO)
          </button>
          <button
            type="button"
            className={`btn btn-sm ${rewardTab === 'xp' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setRewardTab('xp')}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem', fontSize: '0.76rem' }}
          >
            <Award size={13} /> Experiencia (XP)
          </button>
        </div>

        {/* CONTENIDO SEGÚN PESTAÑA */}
        {/* 1. Objeto Mágico Oficial */}
        {rewardTab === 'preset' && (
          <form onSubmit={handleGrantPresetItem}>
            <div style={{ marginBottom: '1rem' }}>
              <label>Seleccionar Objeto Mágico del Compendio:</label>
              <select
                value={selectedPresetIndex}
                onChange={e => setSelectedPresetIndex(Number(e.target.value))}
                style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-sm)' }}
              >
                {INITIAL_MAGIC_ITEMS.map((item, idx) => (
                  <option key={item.id} value={idx}>
                    {item.name} ({item.rarity} • {item.type})
                  </option>
                ))}
              </select>
            </div>

            {INITIAL_MAGIC_ITEMS[selectedPresetIndex] && (
              <div style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.8rem',
                fontSize: '0.82rem',
                color: 'var(--text-secondary)',
                marginBottom: '1rem',
                maxHeight: '100px',
                overflowY: 'auto'
              }}>
                <div style={{ fontWeight: 700, color: 'var(--gold-hover)', marginBottom: '0.2rem' }}>
                  {INITIAL_MAGIC_ITEMS[selectedPresetIndex].name} — {INITIAL_MAGIC_ITEMS[selectedPresetIndex].rarity}
                </div>
                {INITIAL_MAGIC_ITEMS[selectedPresetIndex].description}
              </div>
            )}

            <div style={{ marginBottom: '1.2rem' }}>
              <label>Motivo o Nota de la Concesión:</label>
              <input
                type="text"
                value={presetNotes}
                onChange={e => setPresetNotes(e.target.value)}
                placeholder="Ej. Hallado en el cofre sellado de la cripta"
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.8rem' }}>
              <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
              <button type="submit" className="btn btn-primary glow-hover" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Gift size={16} /> Entregar Objeto Mágico a {targetChar?.name}
              </button>
            </div>
          </form>
        )}

        {/* 2. Objeto Personalizado */}
        {rewardTab === 'item' && (
          <form onSubmit={handleGrantCustomItem}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.8rem', marginBottom: '0.8rem' }}>
              <div>
                <label>Nombre del Objeto:</label>
                <input
                  type="text"
                  placeholder="Ej. Daga Silenciosa de las Sombras"
                  value={customName}
                  onChange={e => setCustomName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label>Categoría:</label>
                <select value={customCategory} onChange={e => setCustomCategory(e.target.value as any)}>
                  <option value="item">Objeto / Artefacto</option>
                  <option value="weapon">Arma</option>
                  <option value="potion">Poción</option>
                  <option value="scroll">Pergamino</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '0.8rem', marginBottom: '0.8rem' }}>
              <div>
                <label>Rareza:</label>
                <select value={customRarity} onChange={e => setCustomRarity(e.target.value as any)}>
                  <option value="Común">Común</option>
                  <option value="Poco Común">Poco Común</option>
                  <option value="Raro">Raro</option>
                  <option value="Muy Raro">Muy Raro</option>
                  <option value="Legendario">Legendario</option>
                </select>
              </div>
              <div>
                <label>Cantidad:</label>
                <input
                  type="number"
                  min={1}
                  value={customQty}
                  onChange={e => setCustomQty(Number(e.target.value))}
                />
              </div>
            </div>

            {customCategory === 'weapon' && (
              <div style={{ marginBottom: '0.8rem' }}>
                <label>Dado de Daño:</label>
                <input
                  type="text"
                  value={customDamageDice}
                  onChange={e => setCustomDamageDice(e.target.value)}
                  placeholder="Ej. 1d8 + 4"
                />
              </div>
            )}

            <div style={{ marginBottom: '1.2rem' }}>
              <label>Propiedades / Descripción del Objeto:</label>
              <textarea
                rows={2}
                value={customDesc}
                onChange={e => setCustomDesc(e.target.value)}
                placeholder="Efectos mágicos, bonos de ataque o trasfondo del objeto..."
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.8rem' }}>
              <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
              <button type="submit" className="btn btn-primary glow-hover" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Gift size={16} /> Conceder Objeto a {targetChar?.name}
              </button>
            </div>
          </form>
        )}

        {/* 3. Oro & Dragones de Oro (DO) */}
        {rewardTab === 'currency' && (
          <form onSubmit={handleGrantCurrency}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Coins size={14} color="#ffd700" /> Piezas de Oro (PO):
                </label>
                <input
                  type="number"
                  min={0}
                  step={5}
                  value={grantGp}
                  onChange={e => setGrantGp(Number(e.target.value))}
                />
              </div>
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Coins size={14} color="var(--gold-hover)" /> Dragones de Oro (DO):
                </label>
                <input
                  type="number"
                  min={0}
                  step={10}
                  value={grantDo}
                  onChange={e => setGrantDo(Number(e.target.value))}
                />
              </div>
            </div>

            <div style={{ marginBottom: '1.2rem' }}>
              <label>Motivo de la Concesión de Riqueza:</label>
              <input
                type="text"
                value={currencyReason}
                onChange={e => setCurrencyReason(e.target.value)}
                placeholder="Ej. Recompensa por rescatar la caravana real"
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.8rem' }}>
              <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
              <button type="submit" className="btn btn-primary glow-hover" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Coins size={16} /> Entregar Fondos {recipientMode === 'all' ? '(Reparto Grupal)' : `a ${targetChar?.name}`}
              </button>
            </div>
          </form>
        )}

        {/* 4. Experiencia (XP) */}
        {rewardTab === 'xp' && (
          <form onSubmit={handleGrantExperience}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Award size={14} color="#ffd700" /> Puntos de Experiencia (XP):
              </label>
              <input
                type="number"
                min={50}
                step={50}
                value={grantXp}
                onChange={e => setGrantXp(Number(e.target.value))}
                required
              />
            </div>

            {targetChar && (
              <div style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.8rem',
                fontSize: '0.82rem',
                color: 'var(--text-secondary)',
                marginBottom: '1.2rem'
              }}>
                XP Actual de <strong>{targetChar.name}</strong>: {targetChar.experience || 0} XP (Nivel {targetChar.level}).
                <div style={{ color: '#40c057', marginTop: '0.2rem', fontWeight: 600 }}>
                  Nuevo Total tras otorgar: {(targetChar.experience || 0) + grantXp} XP.
                </div>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.8rem' }}>
              <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
              <button type="submit" className="btn btn-primary glow-hover" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Award size={16} /> Conceder XP a {targetChar?.name}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
