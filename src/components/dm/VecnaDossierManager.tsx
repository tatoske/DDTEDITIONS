import React, { useState } from 'react';
import { Monster, Character } from '../../types/dnd';
import {
  VECNA_AVATAR_MONSTER,
  VECNA_ARTIFACTS,
  VECNA_CULT_SECRETS,
  VecnaArtifactDef
} from '../../data/vecnaDossierData';
import {
  Skull,
  Eye,
  Hand,
  Book,
  Sparkles,
  AlertTriangle,
  Flame,
  CheckCircle2,
  Send,
  Shield,
  Zap,
  Swords,
  Users
} from 'lucide-react';

interface VecnaDossierManagerProps {
  onAddToEncounter: (monster: Monster) => void;
  onNavigateToEncounter: () => void;
  activeCharacter?: Character;
  onUpdateCharacter?: (updated: Character) => void;
}

export const VecnaDossierManager: React.FC<VecnaDossierManagerProps> = ({
  onAddToEncounter,
  onNavigateToEncounter,
  activeCharacter,
  onUpdateCharacter
}) => {
  const [activeTab, setActiveTab] = useState<'avatar' | 'artifacts' | 'cult'>('avatar');
  const [selectedArtifactId, setSelectedArtifactId] = useState<string>('eye_of_vecna');
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  const selectedArtifact = VECNA_ARTIFACTS.find(a => a.id === selectedArtifactId) || VECNA_ARTIFACTS[0];

  const handleSendVecnaToEncounter = () => {
    onAddToEncounter(VECNA_AVATAR_MONSTER);
    setActionSuccessMsg('¡El Avatar de Vecna (CR 26) ha sido enviado al Rastreador de Encuentros!');
    setTimeout(() => setActionSuccessMsg(null), 6000);
  };

  const handleGraftArtifactToCharacter = (artifact: VecnaArtifactDef) => {
    if (!activeCharacter || !onUpdateCharacter) return;

    // Inyectar el artefacto como rasgo épico en la ficha
    const newFeatures = [...activeCharacter.features];
    const exists = newFeatures.some(f => f.title.includes(artifact.name));

    if (exists) {
      alert(`El personaje ${activeCharacter.name} ya posee ${artifact.name}.`);
      return;
    }

    newFeatures.push({
      title: `[ARTEFACTO INJERTADO] ${artifact.name}`,
      source: 'Dossier de Vecna',
      description: `${artifact.graftingInstruction} Beneficios: ${artifact.benefitsMajor.join('. ')}. Maldición: ${artifact.curseLore}`
    });

    onUpdateCharacter({
      ...activeCharacter,
      features: newFeatures,
      updatedAt: new Date().toISOString()
    });

    setActionSuccessMsg(`¡${artifact.name} ha sido injertado en el cuerpo de ${activeCharacter.name}!`);
    setTimeout(() => setActionSuccessMsg(null), 5000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Cabecera Principal */}
      <div className="card" style={{ padding: '24px', borderLeft: '5px solid #7c3aed' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ backgroundColor: 'rgba(124, 58, 237, 0.15)', color: '#7c3aed', padding: '6px', borderRadius: '8px', display: 'flex' }}>
                <Skull size={24} />
              </span>
              <h2 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--color-primary-dark, #292524)' }}>
                El Dossier de Vecna & Artefactos Supremos
              </h2>
            </div>
            <p style={{ margin: '8px 0 0 0', color: 'var(--color-text-muted, #78716c)', fontSize: '0.95rem' }}>
              Estadísticas oficiales del Avatar de Vecna (CR 26), el Ojo y la Mano de Vecna, el Libro de la Vil Oscuridad y ritos nigrománticos prohibidos (*Dossier de Vecna* & *DMG 2024*).
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              className="btn btn-secondary"
              onClick={onNavigateToEncounter}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}
            >
              <Users size={16} /> Ir al Rastreador de Encuentros
            </button>
          </div>
        </div>

        {actionSuccessMsg && (
          <div style={{ marginTop: '16px', padding: '12px 16px', backgroundColor: 'rgba(16, 185, 129, 0.12)', border: '1px solid #10b981', borderRadius: '8px', color: '#047857', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={18} /> {actionSuccessMsg}
          </div>
        )}

        {/* Pestañas */}
        <div style={{ display: 'flex', gap: '8px', marginTop: '20px', borderBottom: '1px solid var(--color-border, #e7e5e4)', paddingBottom: '8px', flexWrap: 'wrap' }}>
          <button
            className={`btn btn-sm ${activeTab === 'avatar' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('avatar')}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Skull size={15} /> 1. El Avatar de Vecna (CR 26)
          </button>
          <button
            className={`btn btn-sm ${activeTab === 'artifacts' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('artifacts')}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Eye size={15} /> 2. Artefactos Supremos de Vecna
          </button>
          <button
            className={`btn btn-sm ${activeTab === 'cult' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('cult')}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Book size={15} /> 3. Secretos & Ritos del Culto
          </button>
        </div>
      </div>

      {/* PESTAÑA 1: AVATAR DE VECNA */}
      {activeTab === 'avatar' && (
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', borderBottom: '1px solid var(--color-border, #e7e5e4)', paddingBottom: '16px', marginBottom: '16px' }}>
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#7c3aed', textTransform: 'uppercase' }}>
                Jefe Supremo de Campaña • {VECNA_AVATAR_MONSTER.sourceBook}
              </span>
              <h3 style={{ margin: '4px 0', fontSize: '1.5rem', color: 'var(--color-primary-dark, #292524)' }}>
                {VECNA_AVATAR_MONSTER.name}
              </h3>
              <p style={{ margin: 0, color: 'var(--color-text-muted, #78716c)', fontSize: '0.9rem' }}>
                {VECNA_AVATAR_MONSTER.size} {VECNA_AVATAR_MONSTER.type} • {VECNA_AVATAR_MONSTER.alignment}
              </p>
            </div>

            <button
              className="btn btn-primary"
              onClick={handleSendVecnaToEncounter}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700 }}
            >
              <Send size={16} /> Enviar al Rastreador de Encuentros (CR 26)
            </button>
          </div>

          {/* Estadísticas Clave */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px', marginBottom: '20px' }}>
            <div style={{ padding: '10px', border: '1px solid var(--color-border, #e7e5e4)', borderRadius: '6px', textAlign: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted, #78716c)' }}>Clase de Armadura</span>
              <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>{VECNA_AVATAR_MONSTER.ac}</div>
            </div>

            <div style={{ padding: '10px', border: '1px solid var(--color-border, #e7e5e4)', borderRadius: '6px', textAlign: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted, #78716c)' }}>Puntos de Golpe</span>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#dc2626' }}>{VECNA_AVATAR_MONSTER.hp} ({VECNA_AVATAR_MONSTER.hitDice})</div>
            </div>

            <div style={{ padding: '10px', border: '1px solid var(--color-border, #e7e5e4)', borderRadius: '6px', textAlign: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted, #78716c)' }}>Velocidad</span>
              <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>{VECNA_AVATAR_MONSTER.speed}</div>
            </div>

            <div style={{ padding: '10px', border: '1px solid var(--color-border, #e7e5e4)', borderRadius: '6px', textAlign: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted, #78716c)' }}>Desafío (CR)</span>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#7c3aed' }}>CR {VECNA_AVATAR_MONSTER.cr} (90,000 XP)</div>
            </div>
          </div>

          {/* Rasgos y Reacciones */}
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '0.95rem', color: '#7c3aed' }}>Rasgos Legendarios</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {VECNA_AVATAR_MONSTER.traits.map((t, idx) => (
                <div key={idx} style={{ padding: '8px 12px', backgroundColor: 'var(--color-bg-card, #fafaf9)', border: '1px solid var(--color-border, #e7e5e4)', borderRadius: '6px', fontSize: '0.85rem' }}>
                  <strong>{t.name}:</strong> {t.desc}
                </div>
              ))}
            </div>
          </div>

          {/* Acciones y Acciones Legendarias */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '0.95rem', color: 'var(--color-primary-dark, #292524)' }}>Acciones de Combate</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {VECNA_AVATAR_MONSTER.actions.map((a, idx) => (
                  <div key={idx} style={{ padding: '8px 12px', border: '1px solid var(--color-border, #e7e5e4)', borderRadius: '6px', fontSize: '0.85rem' }}>
                    <strong>{a.name}:</strong> {a.desc}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '0.95rem', color: '#dc2626' }}>Acciones Legendarias (3/Turno)</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {VECNA_AVATAR_MONSTER.legendaryActions?.map((la, idx) => (
                  <div key={idx} style={{ padding: '8px 12px', border: '1px solid rgba(220, 38, 38, 0.2)', backgroundColor: 'rgba(220, 38, 38, 0.03)', borderRadius: '6px', fontSize: '0.85rem' }}>
                    <strong>{la.name} (Coste {la.cost}):</strong> {la.desc}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PESTAÑA 2: ARTEFACTOS SUPREMOS */}
      {activeTab === 'artifacts' && (
        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '20px' }}>
          {/* Selector de Artefactos */}
          <div className="card" style={{ padding: '16px' }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '1rem', color: 'var(--color-primary-dark, #292524)' }}>
              Reliquias Legendarias
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {VECNA_ARTIFACTS.map(art => {
                const isSel = art.id === selectedArtifactId;
                return (
                  <button
                    key={art.id}
                    onClick={() => setSelectedArtifactId(art.id)}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: isSel ? `2px solid ${art.badgeColor}` : '1px solid var(--color-border, #e7e5e4)',
                      backgroundColor: isSel ? 'rgba(124, 58, 237, 0.08)' : 'var(--color-bg-card, #fafaf9)',
                      color: 'var(--color-text, #1c1917)',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <strong style={{ fontSize: '0.9rem', color: isSel ? art.badgeColor : 'var(--color-primary-dark, #292524)' }}>
                      {art.name}
                    </strong>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted, #78716c)', marginTop: '2px' }}>
                      {art.type}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Ficha Detallada del Artefacto */}
          <div className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', borderBottom: '1px solid var(--color-border, #e7e5e4)', paddingBottom: '16px', marginBottom: '16px' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: selectedArtifact.badgeColor, textTransform: 'uppercase' }}>
                  {selectedArtifact.type}
                </span>
                <h3 style={{ margin: '4px 0', fontSize: '1.4rem', color: 'var(--color-primary-dark, #292524)' }}>
                  {selectedArtifact.name}
                </h3>
                <p style={{ margin: 0, color: '#dc2626', fontSize: '0.85rem', fontWeight: 600 }}>
                  ⚠️ {selectedArtifact.attunementRequirement}
                </p>
              </div>

              {activeCharacter && onUpdateCharacter && (
                <button
                  className="btn btn-primary"
                  onClick={() => handleGraftArtifactToCharacter(selectedArtifact)}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Sparkles size={16} /> Injertar en {activeCharacter.name}
                </button>
              )}
            </div>

            {/* Beneficios */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
              <div style={{ padding: '14px', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '8px', backgroundColor: 'rgba(16, 185, 129, 0.03)' }}>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '0.9rem', color: '#047857' }}>Beneficios Mayores & Menores</h4>
                <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {[...selectedArtifact.benefitsMinor, ...selectedArtifact.benefitsMajor].map((b, idx) => (
                    <li key={idx}>{b}</li>
                  ))}
                </ul>
              </div>

              <div style={{ padding: '14px', border: '1px solid rgba(220, 38, 38, 0.3)', borderRadius: '8px', backgroundColor: 'rgba(220, 38, 38, 0.03)' }}>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '0.9rem', color: '#b91c1c' }}>Perjuicios & Maldición</h4>
                <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '6px', color: '#991b1b' }}>
                  {[...selectedArtifact.detrimentsMinor, ...selectedArtifact.detrimentsMajor].map((d, idx) => (
                    <li key={idx}>{d}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Conjuros Concedidos */}
            <div style={{ padding: '14px', backgroundColor: 'var(--color-bg-alt, #f5f5f4)', borderRadius: '8px', marginBottom: '16px' }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '0.9rem', color: 'var(--color-primary-dark, #292524)' }}>Conjuros Concedidos por el Artefacto:</h4>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {selectedArtifact.spellsGranted.map((s, idx) => (
                  <span key={idx} style={{ padding: '4px 10px', backgroundColor: 'var(--color-bg-card, #fafaf9)', border: '1px solid var(--color-border, #e7e5e4)', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600 }}>
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Maldición Final */}
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#7c3aed', fontStyle: 'italic' }}>
              <strong>Maldición Inmortal:</strong> {selectedArtifact.curseLore}
            </p>
          </div>
        </div>
      )}

      {/* PESTAÑA 3: SECRETOS DEL CULTO */}
      {activeTab === 'cult' && (
        <div className="card" style={{ padding: '24px' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '1.2rem', color: 'var(--color-primary-dark, #292524)' }}>
            Secretos Prohibidos del Ojo Oculto
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            {VECNA_CULT_SECRETS.map((secret, idx) => (
              <div key={idx} style={{ padding: '16px', border: '1px solid var(--color-border, #e7e5e4)', borderRadius: '8px', backgroundColor: 'var(--color-bg-card, #fafaf9)' }}>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '1rem', color: '#7c3aed' }}>{secret.title}</h4>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-text-muted, #78716c)', lineHeight: '1.45' }}>
                  {secret.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
