import React, { useState } from 'react';
import { FeatDef, FeatCategory, Character, AbilityName } from '../../types/dnd';
import { FEATS_2024_DATA } from '../../data/feats2024Data';
import { applyFeatToCharacter } from '../../utils/featsMath';
import { 
  Sparkles, 
  Search, 
  Shield, 
  Sword, 
  Crown, 
  Zap, 
  BookOpen, 
  Check, 
  X, 
  ArrowUpRight,
  Filter
} from 'lucide-react';

interface FeatsCompendiumProps {
  activeCharacter?: Character;
  onUpdateCharacter?: (character: Character) => void;
}

export const FeatsCompendium: React.FC<FeatsCompendiumProps> = ({
  activeCharacter,
  onUpdateCharacter
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatFilter, setSelectedStatFilter] = useState<string>('all');
  const [selectedFeatForModal, setSelectedFeatForModal] = useState<FeatDef | null>(null);
  const [chosenStat, setChosenStat] = useState<AbilityName>('str');
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  const notify = (msg: string) => {
    setFeedbackToast(msg);
    setTimeout(() => setFeedbackToast(null), 5000);
  };

  // Filtrado de Dotes
  const filteredFeats = FEATS_2024_DATA.filter(feat => {
    const matchText = feat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      feat.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      feat.benefits.some(b => b.toLowerCase().includes(searchQuery.toLowerCase())) ||
                      (feat.prerequisitesText && feat.prerequisitesText.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchCategory = selectedCategory === 'all' || feat.category === selectedCategory;
    
    const matchStat = selectedStatFilter === 'all' || 
                      (feat.statOptions && feat.statOptions.includes(selectedStatFilter as AbilityName));

    return matchText && matchCategory && matchStat;
  });

  // Manejar el clic de Aprender / Añadir Dote
  const handleOpenLearnModal = (feat: FeatDef) => {
    if (!activeCharacter) {
      notify('⚠️ No hay ningún personaje activo seleccionado para aprender esta dote.');
      return;
    }
    // Si tiene opciones de características, abrir modal para elegir
    if (feat.statOptions && feat.statOptions.length > 0) {
      setSelectedFeatForModal(feat);
      setChosenStat(feat.statOptions[0]);
    } else {
      // Dote sin elección de característica (ej. Alerta, Afortunado, Curtido)
      handleConfirmLearn(feat, undefined);
    }
  };

  const handleConfirmLearn = (feat: FeatDef, stat?: AbilityName) => {
    if (!activeCharacter || !onUpdateCharacter) return;
    const { updatedCharacter, message } = applyFeatToCharacter(activeCharacter, feat, stat);
    onUpdateCharacter(updatedCharacter);
    notify(`✨ ${message}`);
    setSelectedFeatForModal(null);
  };

  const isAlreadyLearned = (featId: string) => {
    if (!activeCharacter || !activeCharacter.feats) return false;
    return activeCharacter.feats.some(f => f.featId === featId);
  };

  const getCategoryBadge = (category: FeatCategory) => {
    switch (category) {
      case 'origin':
        return <span className="badge badge-gold">Origen (Nvl 1)</span>;
      case 'general':
        return <span className="badge badge-primary">General (Nvl 4+)</span>;
      case 'epic_boon':
        return <span className="badge badge-crimson" style={{ background: 'linear-gradient(135deg, #7b2cbf 0%, #9d4edd 100%)', color: '#fff' }}>Bendición Épica (Nvl 19-20)</span>;
    }
  };

  const STAT_LABELS: Record<AbilityName, string> = {
    str: 'Fuerza (FUE)',
    dex: 'Destreza (DES)',
    con: 'Constitución (CON)',
    int: 'Inteligencia (INT)',
    wis: 'Sabiduría (SAB)',
    cha: 'Carisma (CAR)'
  };

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', paddingBottom: '3rem' }}>
      {/* Toast Flotante */}
      {feedbackToast && (
        <div style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          background: 'var(--bg-surface-elevated)',
          border: '1px solid var(--accent-gold)',
          borderRadius: 'var(--radius-md)',
          padding: '1rem 1.4rem',
          boxShadow: 'var(--shadow-xl)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: '0.8rem',
          maxWidth: '460px',
          animation: 'fadeIn 0.2s ease-in'
        }}>
          <Sparkles size={22} style={{ color: 'var(--accent-gold)', flexShrink: 0 }} />
          <div style={{ fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: 1.4 }}>
            {feedbackToast}
          </div>
        </div>
      )}

      {/* Encabezado */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '1.5rem',
        paddingBottom: '1rem',
        borderBottom: '1px solid var(--border-subtle)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <h1 style={{ margin: 0, fontSize: '1.7rem', color: 'var(--accent-gold)' }}>
              Compendio de Dotes 2024 & Bendiciones Épicas
            </h1>
            <span className="badge badge-gold" style={{ fontSize: '0.75rem' }}>
              D&D 2024 PHB & DMG
            </span>
          </div>
          <p style={{ margin: '0.3rem 0 0 0', color: 'var(--text-dim)', fontSize: '0.88rem' }}>
            Catálogo exhaustivo de Dotes de Origen (Nivel 1), Dotes Generales (Nivel 4+ con +1 a Característica) y las nuevas Bendiciones Épicas (Nivel 19-20 con límite de hasta 30).
          </p>
        </div>

        {activeCharacter && (
          <div style={{
            padding: '0.5rem 1rem',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem'
          }}>
            <Shield size={18} style={{ color: 'var(--accent-gold)' }} />
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Aventurero Activo:</div>
              <strong style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>
                {activeCharacter.name} ({activeCharacter.className} Nvl {activeCharacter.level})
              </strong>
            </div>
          </div>
        )}
      </div>

      {/* Barra de Filtros y Búsqueda */}
      <div className="card" style={{ padding: '1.2rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Búsqueda */}
          <div style={{ flex: '1 1 280px', position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
            <input 
              type="text"
              placeholder="Buscar dote por nombre, prerrequisito o beneficio..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ width: '100%', paddingLeft: '2.4rem' }}
            />
          </div>

          {/* Filtro de Categoría */}
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            <button 
              className={`btn btn-sm ${selectedCategory === 'all' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setSelectedCategory('all')}
            >
              Todas ({FEATS_2024_DATA.length})
            </button>
            <button 
              className={`btn btn-sm ${selectedCategory === 'origin' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setSelectedCategory('origin')}
            >
              Origen (Nvl 1)
            </button>
            <button 
              className={`btn btn-sm ${selectedCategory === 'general' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setSelectedCategory('general')}
            >
              Generales (Nvl 4+)
            </button>
            <button 
              className={`btn btn-sm ${selectedCategory === 'epic_boon' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setSelectedCategory('epic_boon')}
            >
              Bendiciones Épicas (19+)
            </button>
          </div>

          {/* Filtro de Característica Mejorada */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Filter size={15} style={{ color: 'var(--text-dim)' }} />
            <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Mejora:</span>
            <select 
              value={selectedStatFilter}
              onChange={e => setSelectedStatFilter(e.target.value)}
              style={{ width: 'auto', padding: '0.35rem 0.6rem', fontSize: '0.82rem' }}
            >
              <option value="all">Cualquier Característica</option>
              <option value="str">+1 Fuerza</option>
              <option value="dex">+1 Destreza</option>
              <option value="con">+1 Constitución</option>
              <option value="int">+1 Inteligencia</option>
              <option value="wis">+1 Sabiduría</option>
              <option value="cha">+1 Carisma</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid de Dotes */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.2rem' }}>
        {filteredFeats.map(feat => {
          const learned = isAlreadyLearned(feat.id);

          return (
            <div 
              key={feat.id}
              className="card"
              style={{
                padding: '1.2rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                borderLeft: feat.category === 'epic_boon' ? '4px solid #9d4edd' : feat.category === 'general' ? '4px solid var(--accent-azure)' : '4px solid var(--accent-gold)',
                background: learned ? 'rgba(46, 196, 182, 0.05)' : undefined
              }}
            >
              <div>
                {/* Cabecera de la Tarjeta */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.6rem', marginBottom: '0.4rem' }}>
                  <h3 style={{ margin: 0, fontSize: '1.15rem', color: 'var(--text-main)' }}>
                    {feat.name}
                  </h3>
                  {getCategoryBadge(feat.category)}
                </div>

                {/* Prerrequisitos */}
                {feat.prerequisitesText && (
                  <div style={{ fontSize: '0.78rem', color: 'var(--accent-gold)', fontWeight: 600, marginBottom: '0.4rem' }}>
                    Prerrequisito: {feat.prerequisitesText}
                  </div>
                )}

                {/* Opciones de aumento de característica */}
                {feat.statOptions && feat.statOptions.length > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', flexWrap: 'wrap', marginBottom: '0.6rem' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Aumento de Característica:</span>
                    {feat.statOptions.map(st => (
                      <span key={st} className="badge badge-secondary" style={{ fontSize: '0.68rem', textTransform: 'uppercase', padding: '0.15rem 0.4rem' }}>
                        +1 {st}
                      </span>
                    ))}
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                      (máx. {feat.maxStatIncrease || 20})
                    </span>
                  </div>
                )}

                {/* Descripción general */}
                <p style={{ margin: '0 0 0.8rem 0', fontSize: '0.85rem', color: 'var(--text-dim)', fontStyle: 'italic', lineHeight: 1.4 }}>
                  "{feat.description}"
                </p>

                {/* Beneficios y Reglas 2024 */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1rem' }}>
                  {feat.benefits.map((benefit, i) => (
                    <div key={i} style={{ display: 'flex', gap: '0.4rem', fontSize: '0.82rem', lineHeight: 1.35, color: 'var(--text-main)' }}>
                      <span style={{ color: 'var(--accent-gold)' }}>•</span>
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Botón de Aprender */}
              <div style={{ paddingTop: '0.8rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                  {feat.sourceBook}
                </span>

                {activeCharacter && onUpdateCharacter && (
                  <button
                    className={`btn btn-sm ${learned ? 'btn-secondary' : 'btn-primary'}`}
                    disabled={learned && !feat.repeatable}
                    onClick={() => handleOpenLearnModal(feat)}
                    style={{ borderRadius: 'var(--radius-full)' }}
                  >
                    {learned ? (
                      <>
                        <Check size={14} style={{ color: 'var(--accent-emerald)' }} /> Ya Aprendida
                      </>
                    ) : (
                      <>
                        <Zap size={14} /> Aprender Dote
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal para Elegir Característica (+1) al Aprender Dote */}
      {selectedFeatForModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.65)',
          backdropFilter: 'blur(3px)',
          zIndex: 10000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem'
        }}>
          <div className="card" style={{ maxWidth: '480px', width: '100%', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.6rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--accent-gold)' }}>
                Aprender Dote: {selectedFeatForModal.name}
              </h3>
              <button className="btn btn-secondary btn-sm" onClick={() => setSelectedFeatForModal(null)}>
                <X size={16} />
              </button>
            </div>

            <p style={{ fontSize: '0.88rem', color: 'var(--text-dim)', marginBottom: '1.2rem' }}>
              Esta dote oficial de D&D 2024 otorga un <strong>aumento de +1</strong> a una de las siguientes características a tu elección (hasta máx. {selectedFeatForModal.maxStatIncrease || 20}):
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.5rem' }}>
              {selectedFeatForModal.statOptions?.map(stat => {
                const currentScore = activeCharacter?.abilities[stat] || 10;
                const isSelected = chosenStat === stat;

                return (
                  <div
                    key={stat}
                    onClick={() => setChosenStat(stat)}
                    style={{
                      padding: '0.8rem 1rem',
                      background: isSelected ? 'var(--bg-main)' : 'var(--bg-surface)',
                      border: isSelected ? '2px solid var(--accent-gold)' : '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div>
                      <strong style={{ fontSize: '0.92rem', color: isSelected ? 'var(--accent-gold)' : 'var(--text-main)' }}>
                        {STAT_LABELS[stat]}
                      </strong>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                        Puntuación actual: {currentScore} → Subirá a <strong>{currentScore + 1}</strong>
                      </div>
                    </div>
                    {isSelected && <Check size={18} style={{ color: 'var(--accent-gold)' }} />}
                  </div>
                );
              })}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.6rem' }}>
              <button className="btn btn-secondary" onClick={() => setSelectedFeatForModal(null)}>
                Cancelar
              </button>
              <button 
                className="btn btn-primary"
                onClick={() => handleConfirmLearn(selectedFeatForModal, chosenStat)}
              >
                <Zap size={16} /> Confirmar y Aprender (+1 {chosenStat.toUpperCase()})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
