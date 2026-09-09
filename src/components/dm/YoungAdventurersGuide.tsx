import React, { useState } from 'react';
import {
  DRAGONS_COMPENDIUM,
  DUNGEON_GEAR_KIT,
  DUNGEON_THREATS,
  DragonProfile
} from '../../data/youngAdventurersData';
import {
  Flame,
  Shield,
  Eye,
  Package,
  AlertTriangle,
  Compass,
  Sparkles,
  BookOpen,
  CheckCircle2
} from 'lucide-react';

export const YoungAdventurersGuide: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dragons' | 'dungeon_kit'>('dragons');
  const [selectedDragonId, setSelectedDragonId] = useState<string>('red_dragon');
  const [dragonFilter, setDragonFilter] = useState<'all' | 'Cromático' | 'Metálico'>('all');

  const filteredDragons = DRAGONS_COMPENDIUM.filter(d => {
    if (dragonFilter === 'all') return true;
    return d.category === dragonFilter;
  });

  const selectedDragon = DRAGONS_COMPENDIUM.find(d => d.id === selectedDragonId) || DRAGONS_COMPENDIUM[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Cabecera */}
      <div className="card" style={{ padding: '24px', borderLeft: '5px solid #dc2626' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ backgroundColor: 'rgba(220, 38, 38, 0.15)', color: '#dc2626', padding: '6px', borderRadius: '8px', display: 'flex' }}>
            <Flame size={24} />
          </span>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--color-primary-dark, #292524)' }}>
              Guía de Dragones & Supervivencia en Mazmorras
            </h2>
            <p style={{ margin: '4px 0 0 0', color: 'var(--color-text-muted, #78716c)', fontSize: '0.95rem' }}>
              Códice de Dragones Cromáticos y Metálicos, anatomía dracónica y técnicas de supervivencia en criptas (*Guías del Joven Aventurero - Dragones & Mazmorras y Tumbas*).
            </p>
          </div>
        </div>

        {/* Pestañas */}
        <div style={{ display: 'flex', gap: '8px', marginTop: '20px', borderBottom: '1px solid var(--color-border, #e7e5e4)', paddingBottom: '8px', flexWrap: 'wrap' }}>
          <button
            className={`btn btn-sm ${activeTab === 'dragons' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('dragons')}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Flame size={15} /> 1. Códice & Anatomía de Dragones
          </button>
          <button
            className={`btn btn-sm ${activeTab === 'dungeon_kit' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('dungeon_kit')}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Compass size={15} /> 2. Manual de Mazmorras & Kit de Tumbas
          </button>
        </div>
      </div>

      {/* PESTAÑA 1: CÓDICE DE DRAGONES */}
      {activeTab === 'dragons' && (
        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '20px' }}>
          {/* Selector de Dragones */}
          <div className="card" style={{ padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h3 style={{ margin: 0, fontSize: '1rem', color: 'var(--color-primary-dark, #292524)' }}>
                Los 10 Dragones
              </h3>
              <div style={{ display: 'flex', gap: '4px' }}>
                <button
                  className={`btn btn-xs ${dragonFilter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setDragonFilter('all')}
                  style={{ fontSize: '0.7rem', padding: '2px 6px' }}
                >
                  Todos
                </button>
                <button
                  className={`btn btn-xs ${dragonFilter === 'Cromático' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setDragonFilter('Cromático')}
                  style={{ fontSize: '0.7rem', padding: '2px 6px' }}
                >
                  Crom.
                </button>
                <button
                  className={`btn btn-xs ${dragonFilter === 'Metálico' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setDragonFilter('Metálico')}
                  style={{ fontSize: '0.7rem', padding: '2px 6px' }}
                >
                  Met.
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {filteredDragons.map(dragon => {
                const isSel = dragon.id === selectedDragonId;
                return (
                  <button
                    key={dragon.id}
                    onClick={() => setSelectedDragonId(dragon.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: isSel ? `2px solid ${dragon.badgeColor}` : '1px solid var(--color-border, #e7e5e4)',
                      backgroundColor: isSel ? 'rgba(217, 119, 6, 0.08)' : 'var(--color-bg-card, #fafaf9)',
                      color: 'var(--color-text, #1c1917)',
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontWeight: isSel ? 700 : 500,
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div>
                      <span style={{ fontSize: '0.85rem' }}>{dragon.name}</span>
                      <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--color-text-muted, #78716c)' }}>
                        {dragon.category}
                      </span>
                    </div>
                    <span
                      style={{
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        backgroundColor: dragon.badgeColor
                      }}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Detalle del Dragón Seleccionado */}
          <div className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--color-border, #e7e5e4)', paddingBottom: '16px', marginBottom: '16px' }}>
              <div>
                <span
                  style={{
                    backgroundColor: `${selectedDragon.badgeColor}20`,
                    color: selectedDragon.badgeColor,
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    padding: '3px 8px',
                    borderRadius: '4px',
                    textTransform: 'uppercase'
                  }}
                >
                  Dragón {selectedDragon.category}
                </span>
                <h3 style={{ margin: '8px 0 4px 0', fontSize: '1.5rem', color: 'var(--color-primary-dark, #292524)' }}>
                  {selectedDragon.name}
                </h3>
                <p style={{ margin: 0, color: 'var(--color-text-muted, #78716c)', fontSize: '0.9rem' }}>
                  <strong>Hábitat:</strong> {selectedDragon.environment}
                </p>
              </div>
            </div>

            {/* Armas de Aliento */}
            <div style={{ display: 'grid', gridTemplateColumns: selectedDragon.secondaryBreath ? '1fr 1fr' : '1fr', gap: '12px', marginBottom: '20px' }}>
              <div style={{ padding: '12px', border: '1px solid rgba(220, 38, 38, 0.3)', backgroundColor: 'rgba(220, 38, 38, 0.03)', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#dc2626', textTransform: 'uppercase' }}>Aliento Primario</span>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, marginTop: '2px' }}>{selectedDragon.breathWeapon}</div>
              </div>

              {selectedDragon.secondaryBreath && (
                <div style={{ padding: '12px', border: '1px solid rgba(2, 132, 199, 0.3)', backgroundColor: 'rgba(2, 132, 199, 0.03)', borderRadius: '8px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0284c7', textTransform: 'uppercase' }}>Aliento Metálico Secundario</span>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, marginTop: '2px' }}>{selectedDragon.secondaryBreath}</div>
                </div>
              )}
            </div>

            {/* Personalidad y Tesoro */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
              <div style={{ padding: '14px', border: '1px solid var(--color-border, #e7e5e4)', borderRadius: '8px', backgroundColor: 'var(--color-bg-card, #fafaf9)' }}>
                <h4 style={{ margin: '0 0 6px 0', fontSize: '0.9rem', color: '#b45309' }}>Psicología y Comportamiento</h4>
                <p style={{ margin: 0, fontSize: '0.85rem', lineHeight: '1.45' }}>{selectedDragon.personality}</p>
              </div>

              <div style={{ padding: '14px', border: '1px solid var(--color-border, #e7e5e4)', borderRadius: '8px', backgroundColor: 'var(--color-bg-card, #fafaf9)' }}>
                <h4 style={{ margin: '0 0 6px 0', fontSize: '0.9rem', color: '#b45309' }}>Preferencia en el Tesoro</h4>
                <p style={{ margin: 0, fontSize: '0.85rem', lineHeight: '1.45' }}>{selectedDragon.hoardFavorite}</p>
              </div>
            </div>

            {/* Consejo de Supervivencia */}
            <div style={{ padding: '14px', borderLeft: `4px solid ${selectedDragon.badgeColor}`, backgroundColor: 'var(--color-bg-alt, #f5f5f4)', borderRadius: '4px' }}>
              <h4 style={{ margin: '0 0 4px 0', fontSize: '0.9rem', color: 'var(--color-primary-dark, #292524)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Shield size={16} /> Consejo de Supervivencia para Aventureros
              </h4>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-text, #1c1917)' }}>
                {selectedDragon.survivalTip}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* PESTAÑA 2: MANUAL DE MAZMORRAS */}
      {activeTab === 'dungeon_kit' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          {/* Columna 1: Equipo Táctico de Mazmorra */}
          <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '1.2rem', color: 'var(--color-primary-dark, #292524)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Package size={20} color="#b45309" /> Kit Esencial de Supervivencia en Mazmorras
            </h3>
            <p style={{ margin: '0 0 16px 0', fontSize: '0.85rem', color: 'var(--color-text-muted, #78716c)' }}>
              Herramientas tradicionales que salvan vidas ante fosas ocultas, placas de presión y puertas trampa.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {DUNGEON_GEAR_KIT.map((gear, idx) => (
                <div key={idx} style={{ padding: '12px 14px', border: '1px solid var(--color-border, #e7e5e4)', borderRadius: '8px', backgroundColor: 'var(--color-bg-card, #fafaf9)' }}>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '0.95rem', color: 'var(--color-primary-dark, #292524)' }}>
                    {gear.name}
                  </h4>
                  <p style={{ margin: '0 0 6px 0', fontSize: '0.8rem', color: '#b45309', fontWeight: 600 }}>
                    Función: {gear.utility}
                  </p>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--color-text-muted, #78716c)', lineHeight: '1.4' }}>
                    {gear.howToUse}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Columna 2: Amenazas Clásicas de Cripta */}
          <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '1.2rem', color: 'var(--color-primary-dark, #292524)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertTriangle size={20} color="#dc2626" /> Amenazas Clásicas de Tumbas & Mazmorras
            </h3>
            <p style={{ margin: '0 0 16px 0', fontSize: '0.85rem', color: 'var(--color-text-muted, #78716c)' }}>
              Cómo reconocer y neutralizar los mayores peligros biológicos y aberraciones de una cripta.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {DUNGEON_THREATS.map((threat, idx) => (
                <div key={idx} style={{ padding: '14px', border: '1px solid rgba(220, 38, 38, 0.3)', borderRadius: '8px', backgroundColor: 'rgba(220, 38, 38, 0.02)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <h4 style={{ margin: 0, fontSize: '1rem', color: '#b91c1c' }}>{threat.name}</h4>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted, #78716c)' }}>
                      {threat.hazardType}
                    </span>
                  </div>

                  <div style={{ marginBottom: '8px', fontSize: '0.8rem', color: 'var(--color-text, #1c1917)' }}>
                    <strong>🔍 Señales de Advertencia:</strong> {threat.warningSigns}
                  </div>

                  <div style={{ fontSize: '0.8rem', color: '#047857' }}>
                    <strong>🛡️ Contramedida Táctica:</strong> {threat.tacticalDefense}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
