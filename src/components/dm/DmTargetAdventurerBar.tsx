import React, { useState, useEffect } from 'react';
import { Character } from '../../types/dnd';
import { 
  Gift, 
  Users, 
  Swords, 
  Coins, 
  BookOpen, 
  FlaskConical, 
  Crown, 
  Search, 
  Shield, 
  Skull, 
  Plus, 
  Wand2, 
  Star, 
  AlertTriangle, 
  Trees, 
  Clock, 
  Ghost, 
  Zap, 
  Footprints, 
  Compass, 
  Award, 
  ShoppingBag, 
  Scale, 
  Library, 
  Eye, 
  Flame, 
  Dices,
  Sparkles
} from 'lucide-react';

export type DmCategory = 'combat' | 'treasure' | 'compendium' | 'hazards' | 'mythology';

export type DmSubTabKey = 
  | 'bestiary' | 'builder' | 'encounter' | 'tactics'
  | 'treasure' | 'magicItems' | 'shops'
  | 'spells' | 'feats' | 'species' | 'rules' | 'books'
  | 'poisons' | 'traps' | 'biomes' | 'chases' | 'weather'
  | 'vecna' | 'dragons_guide' | 'patrons' | 'tarokka' | 'dragonmarks' | 'sidekicks' | 'npc' | 'downtime';

interface ToolMeta {
  key: DmSubTabKey;
  label: string;
  category: DmCategory;
  icon: React.ReactNode;
  badge?: string | number;
}

export const DM_TOOLS_CATALOG: ToolMeta[] = [
  // 1. Combate & Encuentros
  { key: 'bestiary', label: 'Bestiario Oficial', category: 'combat', icon: <Skull size={15} /> },
  { key: 'builder', label: 'Creador de Monstruos', category: 'combat', icon: <Plus size={15} /> },
  { key: 'encounter', label: 'Rastreador de Encuentros', category: 'combat', icon: <Swords size={15} /> },
  { key: 'tactics', label: 'Tácticas & Guaridas (Volo)', category: 'combat', icon: <Shield size={15} /> },

  // 2. Tesoro, Botín & Tiendas
  { key: 'treasure', label: 'Tesoros & Botín 2024', category: 'treasure', icon: <Coins size={15} /> },
  { key: 'magicItems', label: 'Objetos Mágicos & Reliquias', category: 'treasure', icon: <Star size={15} /> },
  { key: 'shops', label: 'Tiendas, Boticas & Mercados', category: 'treasure', icon: <ShoppingBag size={15} /> },

  // 3. Compendio, Dotes & Reglas
  { key: 'spells', label: 'Grimorio de Conjuros', category: 'compendium', icon: <Wand2 size={15} /> },
  { key: 'feats', label: 'Dotes 2024 & Bendiciones', category: 'compendium', icon: <Award size={15} /> },
  { key: 'species', label: 'Especies del Multiverso', category: 'compendium', icon: <Users size={15} /> },
  { key: 'rules', label: 'Reglas Rápidas & Tablas', category: 'compendium', icon: <Scale size={15} /> },
  { key: 'books', label: 'Biblioteca de Manuales PDF', category: 'compendium', icon: <Library size={15} /> },

  // 4. Entorno, Peligros & Alquimia
  { key: 'poisons', label: 'Venenos & Taller Alquímico', category: 'hazards', icon: <FlaskConical size={15} /> },
  { key: 'traps', label: 'Trampas Complejas & Criptas', category: 'hazards', icon: <AlertTriangle size={15} /> },
  { key: 'biomes', label: 'Biomas & Encuentros Silvestres', category: 'hazards', icon: <Trees size={15} /> },
  { key: 'chases', label: 'Persecuciones & Complicaciones', category: 'hazards', icon: <Footprints size={15} /> },
  { key: 'weather', label: 'Clima & Consola Náutica', category: 'hazards', icon: <Compass size={15} /> },

  // 5. Crónicas, Horror & Mitología
  { key: 'vecna', label: 'El Dossier de Vecna', category: 'mythology', icon: <Eye size={15} /> },
  { key: 'dragons_guide', label: 'Guía de Dragones Oficial', category: 'mythology', icon: <Flame size={15} /> },
  { key: 'patrons', label: 'Patronos de Grupo & Intrigas', category: 'mythology', icon: <Crown size={15} /> },
  { key: 'tarokka', label: 'Ravenloft, Estrés & Tarokka', category: 'mythology', icon: <Ghost size={15} /> },
  { key: 'dragonmarks', label: 'Marcas del Dragón (Eberron)', category: 'mythology', icon: <Zap size={15} /> },
  { key: 'sidekicks', label: 'Escuderos & Mascotas (Tasha)', category: 'mythology', icon: <Shield size={15} /> },
  { key: 'npc', label: 'Generador de PNJ & Semillas', category: 'mythology', icon: <Dices size={15} /> },
  { key: 'downtime', label: 'Tiempo Libre & Actividades', category: 'mythology', icon: <Clock size={15} /> }
];

interface DmTargetAdventurerBarProps {
  characters: Character[];
  activeCharIndex: number;
  onSelectCharacterIndex: (index: number) => void;
  activeSubTab: DmSubTabKey;
  onSelectSubTab: (key: DmSubTabKey) => void;
  onOpenQuickRewardModal: () => void;
  monstersInEncounterCount: number;
}

export const DmTargetAdventurerBar: React.FC<DmTargetAdventurerBarProps> = ({
  characters,
  activeCharIndex,
  onSelectCharacterIndex,
  activeSubTab,
  onSelectSubTab,
  onOpenQuickRewardModal,
  monstersInEncounterCount
}) => {
  // Categoría activa calculada a partir de la subpestaña actual
  const currentTool = DM_TOOLS_CATALOG.find(t => t.key === activeSubTab);
  const [activeCategory, setActiveCategory] = useState<DmCategory>(currentTool?.category || 'combat');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    if (currentTool && currentTool.category !== activeCategory) {
      setActiveCategory(currentTool.category);
    }
  }, [activeSubTab]);

  const activeChar = characters[activeCharIndex] || characters[0];

  // Herramientas filtradas por la categoría activa
  const categoryTools = DM_TOOLS_CATALOG.filter(t => t.category === activeCategory);

  // Resultados de búsqueda rápida
  const searchResults = searchQuery.trim()
    ? DM_TOOLS_CATALOG.filter(t => 
        t.label.toLowerCase().includes(searchQuery.toLowerCase()) || 
        t.key.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : null;

  return (
    <div style={{ marginBottom: '1.4rem' }}>
      {/* 1. BARRA SUPERIOR DE DESTINATARIO & CONCESIÓN DE RECOMPENSAS */}
      <div className="card" style={{
        padding: '0.85rem 1.2rem',
        marginBottom: '1rem',
        border: '1px solid var(--border-gold)',
        background: 'linear-gradient(135deg, rgba(20, 25, 40, 0.98), rgba(12, 15, 25, 0.98))',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)'
      }}>
        {/* Selector de Aventurero Receptor */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ padding: '0.35rem', borderRadius: '8px', background: 'rgba(212, 175, 55, 0.15)', border: '1px solid var(--gold-primary)' }}>
              <Users size={16} color="var(--gold-hover)" />
            </div>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-gold)' }}>
              Aventurero Destinatario en Mesa:
            </span>
          </div>

          <select
            value={activeCharIndex}
            onChange={e => onSelectCharacterIndex(Number(e.target.value))}
            style={{
              padding: '0.4rem 0.8rem',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-primary)',
              fontWeight: 700,
              fontSize: '0.88rem'
            }}
          >
            {characters.map((char, idx) => (
              <option key={char.id} value={idx}>
                {char.name} ({char.className} Nvl {char.level}) — {char.playerName || 'Jugador'}
              </option>
            ))}
          </select>

          {activeChar && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.78rem' }}>
              <span className="badge badge-sapphire" style={{ padding: '0.2rem 0.5rem' }}>
                ❤️ {activeChar.currentHp}/{activeChar.maxHp} PG
              </span>
              <span className="badge badge-gold" style={{ padding: '0.2rem 0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Coins size={12} /> {activeChar.goldDragons || 0} DO
              </span>
              <span className="badge badge-silver" style={{ padding: '0.2rem 0.5rem' }}>
                💰 {activeChar.coins?.gp || 0} PO
              </span>
              <span style={{ color: 'var(--text-dim)' }}>
                🎒 {activeChar.inventory?.length || 0} ítems
              </span>
            </div>
          )}
        </div>

        {/* Botón Destacado de Concesión Rápida */}
        <button
          className="btn btn-primary btn-sm glow-hover"
          onClick={onOpenQuickRewardModal}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            borderRadius: 'var(--radius-full)',
            fontWeight: 800,
            fontSize: '0.84rem'
          }}
          title="Otorgar objetos mágicos, armas, pociones, monedas o experiencia al personaje seleccionado"
        >
          <Gift size={16} />
          <span>🎁 Conceder Recompensa a {activeChar?.name || 'Aventurero'}</span>
        </button>
      </div>

      {/* 2. SELECTOR DE CATEGORÍAS MAESTRAS (5 Categorías) */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '2px solid var(--border-subtle)',
        paddingBottom: '0.5rem',
        marginBottom: '0.8rem',
        flexWrap: 'wrap',
        gap: '0.8rem'
      }}>
        {/* Pestañas de Categoría */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            className={`btn btn-sm ${activeCategory === 'combat' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => {
              setActiveCategory('combat');
              onSelectSubTab('bestiary');
            }}
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700 }}
          >
            <Swords size={15} /> ⚔️ Combate & Encuentros
          </button>

          <button
            className={`btn btn-sm ${activeCategory === 'treasure' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => {
              setActiveCategory('treasure');
              onSelectSubTab('treasure');
            }}
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700 }}
          >
            <Coins size={15} /> 🪙 Tesoro, Botín & Tiendas
          </button>

          <button
            className={`btn btn-sm ${activeCategory === 'compendium' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => {
              setActiveCategory('compendium');
              onSelectSubTab('spells');
            }}
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700 }}
          >
            <BookOpen size={15} /> 📜 Compendio & Reglas 2024
          </button>

          <button
            className={`btn btn-sm ${activeCategory === 'hazards' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => {
              setActiveCategory('hazards');
              onSelectSubTab('poisons');
            }}
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700 }}
          >
            <FlaskConical size={15} /> 🧪 Entorno & Alquimia
          </button>

          <button
            className={`btn btn-sm ${activeCategory === 'mythology' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => {
              setActiveCategory('mythology');
              onSelectSubTab('vecna');
            }}
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700 }}
          >
            <Crown size={15} /> 👑 Crónicas & Mitología
          </button>
        </div>

        {/* Buscador Rápido de Herramientas (Filtro Instantáneo) */}
        <div style={{ position: 'relative', width: '220px' }}>
          <Search size={14} style={{ position: 'absolute', left: '0.6rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
          <input
            type="text"
            placeholder="🔍 Buscar herramienta..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              padding: '0.35rem 0.6rem 0.35rem 2rem',
              fontSize: '0.78rem',
              borderRadius: 'var(--radius-full)',
              background: 'var(--bg-input)',
              border: '1px solid var(--border-subtle)',
              width: '100%'
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{ position: 'absolute', right: '0.5rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', fontSize: '0.8rem' }}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* 3. SUBPESTAÑAS DE LA CATEGORÍA ACTIVA (O RESULTADOS DE BÚSQUEDA) */}
      <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap', alignItems: 'center' }}>
        {searchResults ? (
          searchResults.length > 0 ? (
            searchResults.map(tool => (
              <button
                key={tool.key}
                className={`btn btn-sm ${activeSubTab === tool.key ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => {
                  setActiveCategory(tool.category);
                  onSelectSubTab(tool.key);
                  setSearchQuery('');
                }}
                style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem' }}
              >
                {tool.icon}
                <span>{tool.label}</span>
              </button>
            ))
          ) : (
            <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontStyle: 'italic', padding: '0.4rem' }}>
              No se encontraron herramientas con "{searchQuery}".
            </span>
          )
        ) : (
          categoryTools.map(tool => {
            const isEncounter = tool.key === 'encounter';

            return (
              <button
                key={tool.key}
                className={`btn btn-sm ${activeSubTab === tool.key ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => onSelectSubTab(tool.key)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontSize: '0.8rem',
                  padding: '0.4rem 0.75rem',
                  border: activeSubTab === tool.key ? '1px solid var(--gold-primary)' : '1px solid var(--border-subtle)'
                }}
              >
                {tool.icon}
                <span>{tool.label}</span>
                {isEncounter && monstersInEncounterCount > 0 && (
                  <span className="badge badge-crimson" style={{ marginLeft: '0.25rem', padding: '0.1rem 0.35rem', fontSize: '0.68rem' }}>
                    {monstersInEncounterCount}
                  </span>
                )}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};
