import React, { useState } from 'react';
import { MagicItem, INITIAL_MAGIC_ITEMS } from '../../data/magicItemsData';
import { Character } from '../../types/dnd';
import { Sparkles, Search, Shield, Plus, Check, Star } from 'lucide-react';

interface MagicItemsCompendiumProps {
  activeCharacter?: Character;
  onUpdateCharacter?: (updated: Character) => void;
  characters?: Character[];
  onUpdateAllCharacters?: (updated: Character[]) => void;
}

export const MagicItemsCompendium: React.FC<MagicItemsCompendiumProps> = ({ 
  activeCharacter, 
  onUpdateCharacter,
  characters = [],
  onUpdateAllCharacters
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedRarity, setSelectedRarity] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [onlyAttunement, setOnlyAttunement] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [recipientId, setRecipientId] = useState<string>(activeCharacter?.id || '');

  const targetChar = characters.find(c => c.id === recipientId) || activeCharacter || characters[0];

  const filteredItems = INITIAL_MAGIC_ITEMS.filter(item => {
    const matchSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchRarity = selectedRarity === 'all' || item.rarity === selectedRarity;
    const matchType = selectedType === 'all' || item.type === selectedType;
    const matchAttunement = !onlyAttunement || item.requiresAttunement;

    return matchSearch && matchRarity && matchType && matchAttunement;
  });

  const handleEquipItem = (item: MagicItem) => {
    if (!targetChar) {
      alert('Debes tener un personaje seleccionado en el Modo Jugador.');
      return;
    }

    const updatedChar: Character = {
      ...targetChar,
      inventory: [
        ...(targetChar.inventory || []),
        {
          id: 'magic_' + Date.now(),
          name: `${item.name} (${item.rarity})`,
          quantity: 1,
          description: item.description,
          equipped: true
        }
      ],
      updatedAt: new Date().toISOString()
    };

    if (onUpdateAllCharacters && characters.length > 0) {
      const newChars = characters.map(c => c.id === targetChar.id ? updatedChar : c);
      onUpdateAllCharacters(newChars);
    } else if (onUpdateCharacter) {
      onUpdateCharacter(updatedChar);
    }

    setToastMessage(`¡"${item.name}" otorgado y añadido al inventario de ${targetChar.name}!`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          background: 'linear-gradient(135deg, rgba(158, 117, 20, 0.95), rgba(15, 18, 30, 0.98))',
          border: '1px solid var(--gold-primary)',
          borderRadius: 'var(--radius-md)',
          padding: '0.8rem 1.2rem',
          boxShadow: 'var(--shadow-gold)',
          zIndex: 1000,
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          animation: 'modalEnter 0.2s ease-out'
        }}>
          <Sparkles size={18} />
          <span>{toastMessage}</span>
        </div>
      )}

      <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-gold)', paddingBottom: '0.8rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', margin: 0 }}>Compendio de Objetos Mágicos & Reliquias</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Armas legendarias, artefactos, pociones y maravillas de la Guía del Dungeon Master 2024.
          </p>
        </div>

        {targetChar && (
          <div className="card" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Star size={18} color="var(--gold-primary)" />
            {characters.length > 1 ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-dim)' }}>Destinatario:</span>
                <select 
                  value={recipientId} 
                  onChange={e => setRecipientId(e.target.value)}
                  style={{ padding: '0.2rem 0.5rem', fontSize: '0.82rem', fontWeight: 700 }}
                >
                  {characters.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            ) : (
              <span style={{ fontSize: '0.85rem' }}>
                Destinatario: <strong style={{ color: 'var(--gold-primary)' }}>{targetChar.name}</strong>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Filtros */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1.2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr', gap: '0.8rem', marginBottom: '0.8rem' }}>
          <div>
            <label>Buscar Objeto</label>
            <input 
              type="text" 
              placeholder="Nombre o propiedad (ej. Espada, Curación, Dragón)..." 
              value={searchTerm} 
              onChange={e => setSearchTerm(e.target.value)} 
            />
          </div>

          <div>
            <label>Rareza</label>
            <select value={selectedRarity} onChange={e => setSelectedRarity(e.target.value)}>
              <option value="all">Todas las Rarezas</option>
              <option value="Común">Común</option>
              <option value="Poco común">Poco común</option>
              <option value="Raro">Raro</option>
              <option value="Muy raro">Muy raro</option>
              <option value="Legendario">Legendario</option>
              <option value="Artefacto">Artefacto</option>
            </select>
          </div>

          <div>
            <label>Tipo de Objeto</label>
            <select value={selectedType} onChange={e => setSelectedType(e.target.value)}>
              <option value="all">Todos los Tipos</option>
              <option value="Arma">Arma</option>
              <option value="Armadura">Armadura</option>
              <option value="Poción">Poción</option>
              <option value="Anillo">Anillo</option>
              <option value="Objeto Maravilloso">Objeto Maravilloso</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', margin: 0 }}>
            <input 
              type="checkbox" 
              checked={onlyAttunement} 
              onChange={e => setOnlyAttunement(e.target.checked)} 
              style={{ width: '16px', height: '16px' }}
            />
            <span>Requiere Armonización (Attunement)</span>
          </label>
          <span style={{ marginLeft: 'auto', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Mostrando <strong>{filteredItems.length}</strong> objetos mágicos
          </span>
        </div>
      </div>

      {/* Grid de Objetos Mágicos */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.2rem' }}>
        {filteredItems.map(item => (
          <div key={item.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderLeft: item.rarity === 'Artefacto' ? '4px solid var(--amethyst-magic)' : item.rarity === 'Legendario' ? '4px solid var(--gold-primary)' : '4px solid var(--sapphire-mana)' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                <h3 style={{ fontSize: '1.15rem', margin: 0, color: 'var(--text-main)' }}>{item.name}</h3>
                <span className={`badge ${item.rarity === 'Artefacto' ? 'badge-crimson' : item.rarity === 'Legendario' ? 'badge-gold' : 'badge-sapphire'}`}>
                  {item.rarity}
                </span>
              </div>

              <div style={{ fontSize: '0.78rem', color: 'var(--text-gold)', fontWeight: 600, marginBottom: '0.4rem' }}>
                {item.type} {item.requiresAttunement ? `• Requiere Armonización ${item.attunementDetails ? '(' + item.attunementDetails + ')' : ''}` : ''}
              </div>

              <p style={{ fontSize: '0.88rem', color: 'var(--text-main)', lineHeight: 1.5, marginBottom: '0.8rem' }}>
                {item.description}
              </p>
            </div>

            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.6rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                Fuente: {item.sourceBook}
              </span>
              {activeCharacter && (
                <button className="btn btn-primary btn-sm" onClick={() => handleEquipItem(item)}>
                  <Plus size={14} /> Entregar a PJ
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
