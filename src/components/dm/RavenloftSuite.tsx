import React, { useState } from 'react';
import { Character, DarkGiftDef, PanicRollResult } from '../../types/dnd';
import { DARK_GIFTS_DATA, PANIC_TABLE } from '../../data/darkGiftsData';
import { 
  calculateStressModifier, 
  rollPanicReaction, 
  modifyCharacterStress, 
  applyDarkGiftToCharacter, 
  removeDarkGiftFromCharacter 
} from '../../utils/ravenloftMath';
import { rollDice } from '../../utils/dndMath';
import { 
  Ghost, 
  Skull, 
  Moon, 
  Sparkles, 
  Flame, 
  AlertTriangle, 
  RefreshCw, 
  Eye, 
  Zap, 
  ShieldAlert, 
  Heart, 
  Check, 
  X, 
  Dices, 
  Trash2 
} from 'lucide-react';

interface RavenloftSuiteProps {
  characters: Character[];
  activeCharacter?: Character;
  onUpdateCharacter: (character: Character) => void;
}

interface TarokkaCard {
  suit: 'Espadas' | 'Estrellas' | 'Monedas' | 'Glifos' | 'Altos Arcanos';
  name: string;
  meaning: string;
  positionLabel: string;
}

const TAROKKA_POOL: Array<{ suit: TarokkaCard['suit']; name: string; meaning: string }> = [
  { suit: 'Altos Arcanos', name: 'El Artefacto', meaning: 'Un poder antiguo que no debe ser manipulado a la ligera. Revela el objeto central de la perdición.' },
  { suit: 'Altos Arcanos', name: 'La Bestia', meaning: 'Una furia ciega y una sed insaciable de sangre. Habla de licántropos o pactos oscuros.' },
  { suit: 'Altos Arcanos', name: 'El Verdugo', meaning: 'La justicia torcida por la venganza. La muerte acecha en el cadalso del tirano.' },
  { suit: 'Altos Arcanos', name: 'El Fantasma', meaning: 'Secretos no enterrados y espíritus que claman justicia antes de cruzar el velo.' },
  { suit: 'Altos Arcanos', name: 'El Inocente', meaning: 'Un alma pura atrapada en las sombras que debe ser rescatada para evitar una catástrofe.' },
  { suit: 'Espadas', name: 'El Guerrero de Hierro', meaning: 'Fuerza bruta, resistencia inquebrantable y el filo de una espada forjada en rencor.' },
  { suit: 'Espadas', name: 'El Vengador', meaning: 'Un dolor que consume el juicio; alguien que destruirá el mundo con tal de saciar su herida.' },
  { suit: 'Estrellas', name: 'El Adivino', meaning: 'Visiones del cosmos, magia que trasciende el tiempo y verdades que enloquecen.' },
  { suit: 'Estrellas', name: 'El Nigromante', meaning: 'Polvo de huesos, almas encadenadas y una voluntad que desafía las leyes naturales.' },
  { suit: 'Monedas', name: 'El Avaro', meaning: 'La avaricia que pudre el corazón; riquezas manchadas de sangre en bóvedas selladas.' },
  { suit: 'Monedas', name: 'El Mercader', meaning: 'Pactos dudosos, trueques de almas y precios que ningún mortal debería pagar.' },
  { suit: 'Glifos', name: 'El Sanador', meaning: 'Esperanza en medio de la pesadilla; una reliquia bendecida que disipa la niebla.' },
  { suit: 'Glifos', name: 'El Traidor', meaning: 'Una sonrisa cómplice que esconde un puñal en la espalda; desconfía del aliado más cercano.' }
];

export const RavenloftSuite: React.FC<RavenloftSuiteProps> = ({
  characters,
  activeCharacter,
  onUpdateCharacter
}) => {
  const [activeTab, setActiveTab] = useState<'stress' | 'gifts' | 'tarokka'>('stress');
  const [horrorFeedback, setHorrorFeedback] = useState<string | null>(null);
  const [selectedPanicResult, setSelectedPanicResult] = useState<PanicRollResult | null>(null);

  // Tarokka State
  const [spread, setSpread] = useState<TarokkaCard[] | null>(null);

  const notify = (msg: string) => {
    setHorrorFeedback(msg);
    setTimeout(() => setHorrorFeedback(null), 6000);
  };

  // Modificar estrés de un personaje
  const handleAdjustStress = (char: Character, delta: number) => {
    const { updatedCharacter, newScore, penalty } = modifyCharacterStress(char, delta);
    onUpdateCharacter(updatedCharacter);
    const mood = newScore >= 7 ? '¡En Terror Extremo!' : newScore >= 4 ? 'Bajo Ansiedad Severa' : 'Bajo Tensión';
    notify(`🧠 Estrés de ${char.name}: ${newScore}/10 (${mood}, penalizador ${penalty} a tiradas de d20).`);
  };

  // Tirar Salvación contra el Horror
  const handleHorrorSave = (char: Character) => {
    const d20 = rollDice('1d20').total;
    const stressMod = calculateStressModifier(char.stressScore);
    const wisMod = Math.floor(((char.abilities.wis || 10) - 10) / 2);
    const total = d20 + wisMod + stressMod;
    const targetDc = 13;
    const success = total >= targetDc;

    if (success) {
      notify(`🛡️ ¡Salvación de Terror EXITOSA para ${char.name}! Tirada [${d20}] + SAB (${wisMod}) + Estrés (${stressMod}) = ${total} (CD ${targetDc}). Mantiene la compostura.`);
    } else {
      const { updatedCharacter } = modifyCharacterStress(char, 1);
      onUpdateCharacter(updatedCharacter);
      notify(`💀 ¡Salvación de Terror FALLIDA para ${char.name}! Tirada [${d20}] + SAB (${wisMod}) + Estrés (${stressMod}) = ${total} (CD ${targetDc}). Sufre +1 de Estrés (${updatedCharacter.stressScore}/10).`);
    }
  };

  // Tirar en la Tabla de Pánico
  const handleRollPanic = (char: Character) => {
    const result = rollPanicReaction();
    setSelectedPanicResult(result);
    notify(`⚡ ¡Pánico para ${char.name}! Dado [${result.roll}]: "${result.title}" -> ${result.description}`);
  };

  // Otorgar Don Oscuro
  const handleGrantGift = (char: Character, gift: DarkGiftDef) => {
    const { updatedCharacter, message } = applyDarkGiftToCharacter(char, gift);
    onUpdateCharacter(updatedCharacter);
    notify(`🩸 ${message}`);
  };

  // Ruleta del Pacto Macabro (Pacto de Resurrección)
  const handleRoulettePact = (char: Character) => {
    const randomGift = DARK_GIFTS_DATA[Math.floor(Math.random() * DARK_GIFTS_DATA.length)];
    const { updatedCharacter, message } = applyDarkGiftToCharacter(char, randomGift);
    onUpdateCharacter(updatedCharacter);
    notify(`🎲 ¡Los Poderes Oscuros han respondido a la plegaria de ${char.name}! Le otorgan: "${randomGift.name}". ${message}`);
  };

  // Tirada de Tarokka
  const handleDrawTarokka = () => {
    const shuffled = [...TAROKKA_POOL].sort(() => 0.5 - Math.random());
    const positions = [
      '1. El Pasado (El Tomo del Conocimiento)',
      '2. El Presente (El Símbolo Sagrado)',
      '3. El Futuro (La Espada de la Venganza)',
      '4. La Amenaza (El Señor del Terror)',
      '5. El Clímax (El Destino Final)'
    ];

    const drawn: TarokkaCard[] = positions.map((pos, i) => ({
      positionLabel: pos,
      name: shuffled[i].name,
      suit: shuffled[i].suit,
      meaning: shuffled[i].meaning
    }));

    setSpread(drawn);
    notify('🔮 Las cartas de Tarokka han sido reveladas por las Vistani.');
  };

  const getSeverityBadge = (sev: PanicRollResult['severity']) => {
    switch (sev) {
      case 'critica':
        return <span className="badge badge-crimson">Crítica (Parálisis)</span>;
      case 'moderada':
        return <span className="badge badge-amber">Moderada (Huida / Temblores)</span>;
      case 'adrenalina':
        return <span className="badge badge-emerald">Adrenalina / Ira Heroica</span>;
      default:
        return <span className="badge badge-gold">Leve</span>;
    }
  };

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', paddingBottom: '3rem' }}>
      {/* Toast Flotante de Terror */}
      {horrorFeedback && (
        <div style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          background: 'var(--bg-surface-elevated)',
          border: '1px solid var(--accent-crimson)',
          borderRadius: 'var(--radius-md)',
          padding: '1rem 1.4rem',
          boxShadow: 'var(--shadow-xl)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: '0.8rem',
          maxWidth: '480px',
          animation: 'fadeIn 0.2s ease-in'
        }}>
          <Ghost size={24} style={{ color: 'var(--accent-crimson)', flexShrink: 0 }} />
          <div style={{ fontSize: '0.88rem', color: 'var(--text-main)', lineHeight: 1.4 }}>
            {horrorFeedback}
          </div>
        </div>
      )}

      {/* Encabezado Principal */}
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
            <h1 style={{ margin: 0, fontSize: '1.7rem', color: 'var(--accent-crimson)' }}>
              Ravenloft: Terror, Estrés y Dones Oscuros
            </h1>
            <span className="badge badge-crimson" style={{ fontSize: '0.75rem' }}>
              Guía de Van Richten
            </span>
          </div>
          <p style={{ margin: '0.3rem 0 0 0', color: 'var(--text-dim)', fontSize: '0.88rem' }}>
            Mecánicas oficiales de terror gótico: rastreador de estrés acumulativo (-X en d20), resolución de pánico, pactos sobrenaturales con Dones Oscuros y el Oráculo de Tarokka.
          </p>
        </div>

        {/* Selector de Sub-pestañas de Ravenloft */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button 
            className={`btn btn-sm ${activeTab === 'stress' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('stress')}
          >
            <AlertTriangle size={15} /> Monitor de Estrés & Terror
          </button>
          <button 
            className={`btn btn-sm ${activeTab === 'gifts' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('gifts')}
          >
            <Skull size={15} /> Dones Oscuros (Dark Gifts)
          </button>
          <button 
            className={`btn btn-sm ${activeTab === 'tarokka' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('tarokka')}
          >
            <Ghost size={15} /> Oráculo de Tarokka
          </button>
        </div>
      </div>

      {/* SUB-PESTAÑA 1: MONITOR DE ESTRÉS Y TERROR */}
      {activeTab === 'stress' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Banner de Reglas de Estrés de Van Richten */}
          <div className="card" style={{ padding: '1rem 1.4rem', borderLeft: '4px solid var(--accent-crimson)', background: 'var(--bg-surface)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
              <ShieldAlert size={18} style={{ color: 'var(--accent-crimson)' }} />
              <strong style={{ fontSize: '0.95rem', color: 'var(--text-main)' }}>
                Regla Oficial de Estrés (Van Richten p. 195)
              </strong>
            </div>
            <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--text-dim)', lineHeight: 1.4 }}>
              Cada punto de Estrés impone un <strong>penalizador acumulativo de -1 a todas las tiradas de d20</strong> (ataques, salvaciones y pruebas de habilidad) del aventurero. El estrés aumenta al fallar salvaciones contra monstruos aterradores y se disipa descansando en lugares seguros o con momentos de sosiego.
            </p>
          </div>

          {/* Cuadrícula de Aventureros en el Monitor de Estrés */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.2rem' }}>
            {characters.map(char => {
              const stress = char.stressScore || 0;
              const penalty = calculateStressModifier(stress);
              const stressPercent = Math.round((stress / 10) * 100);
              const stressColor = stress >= 7 ? 'var(--accent-crimson)' : stress >= 4 ? 'var(--accent-amber)' : 'var(--accent-gold)';

              return (
                <div 
                  key={char.id}
                  className="card"
                  style={{
                    padding: '1.2rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '1rem',
                    borderLeft: `4px solid ${stressColor}`
                  }}
                >
                  <div>
                    {/* Cabecera del Héroe */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.6rem' }}>
                      <div>
                        <strong style={{ fontSize: '1.1rem', color: 'var(--text-main)' }}>{char.name}</strong>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                          {char.className} Nvl {char.level} • {char.species}
                        </div>
                      </div>
                      <span className="badge" style={{ background: stressColor, color: '#fff', fontWeight: 800 }}>
                        Estrés: {stress}/10
                      </span>
                    </div>

                    {/* Barra de Estrés */}
                    <div style={{ marginBottom: '0.6rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-dim)', marginBottom: '0.25rem' }}>
                        <span>Tensión Psicológica:</span>
                        <span style={{ color: stressColor, fontWeight: 700 }}>
                          {stress === 0 ? 'Calma' : stress >= 7 ? 'Terror Crítico' : stress >= 4 ? 'Ansiedad Severa' : 'Alerta'}
                        </span>
                      </div>
                      <div style={{ height: '8px', background: 'var(--border-subtle)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ width: `${stressPercent}%`, height: '100%', background: stressColor, transition: 'width 0.3s ease' }} />
                      </div>
                    </div>

                    {/* Indicador de Penalizador a Tiradas */}
                    <div style={{
                      padding: '0.6rem 0.8rem',
                      background: 'var(--bg-main)',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-subtle)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '0.8rem'
                    }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Penalizador en tiradas de d20:</span>
                      <strong style={{ fontSize: '1.05rem', color: stress > 0 ? 'var(--accent-crimson)' : 'var(--accent-emerald)' }}>
                        {penalty !== 0 ? `${penalty}` : 'Sin penalizador'}
                      </strong>
                    </div>

                    {/* Dones Oscuros del Personaje */}
                    {char.darkGifts && char.darkGifts.length > 0 && (
                      <div style={{ marginBottom: '0.8rem' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'block', marginBottom: '0.3rem' }}>
                          Dones Oscuros Sellados:
                        </span>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                          {char.darkGifts.map(dg => (
                            <span key={dg.giftId} className="badge badge-crimson" style={{ fontSize: '0.7rem' }}>
                              💀 {dg.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Acciones de Terror */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.8rem' }}>
                    {/* Botones de Control de Estrés */}
                    <div style={{ display: 'flex', gap: '0.3rem', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>Modificar Estrés:</span>
                      <div style={{ display: 'flex', gap: '0.3rem' }}>
                        <button 
                          className="btn btn-secondary btn-sm"
                          disabled={stress <= 0}
                          onClick={() => handleAdjustStress(char, -1)}
                          title="Alivio menor (-1)"
                        >
                          -1
                        </button>
                        <button 
                          className="btn btn-secondary btn-sm"
                          disabled={stress >= 10}
                          onClick={() => handleAdjustStress(char, 1)}
                          title="Susto / Horror (+1)"
                        >
                          +1
                        </button>
                        <button 
                          className="btn btn-secondary btn-sm"
                          disabled={stress <= 0}
                          onClick={() => handleAdjustStress(char, -10)}
                          title="Sosiego en Refugio Seguro (0)"
                        >
                          Calmar (0)
                        </button>
                      </div>
                    </div>

                    {/* Botones de Tirada */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem' }}>
                      <button 
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleHorrorSave(char)}
                        title="Tirar Salvación de Sabiduría CD 13"
                      >
                        <ShieldAlert size={14} /> Salvación Terror
                      </button>
                      <button 
                        className="btn btn-primary btn-sm"
                        onClick={() => handleRollPanic(char)}
                        title="Tirar en la Tabla de Pánico de Van Richten"
                      >
                        <Zap size={14} /> Tirar Pánico (d20)
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Resultado de la Tabla de Pánico */}
          {selectedPanicResult && (
            <div className="card" style={{ padding: '1.2rem', border: '2px solid var(--accent-crimson)', background: 'var(--bg-surface)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.6rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <Zap size={20} style={{ color: 'var(--accent-crimson)' }} />
                  <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--accent-crimson)' }}>
                    Resultado de Pánico: {selectedPanicResult.title} (Dado {selectedPanicResult.roll})
                  </h3>
                </div>
                {getSeverityBadge(selectedPanicResult.severity)}
              </div>
              <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: 1.45 }}>
                {selectedPanicResult.description}
              </p>
            </div>
          )}
        </div>
      )}

      {/* SUB-PESTAÑA 2: DONES OSCUROS & PACTOS */}
      {activeTab === 'gifts' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Banner de Ruleta de Resurrección */}
          <div className="card" style={{ padding: '1.2rem 1.6rem', borderLeft: '4px solid #7b2cbf', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                <Skull size={18} style={{ color: '#9d4edd' }} />
                <h3 style={{ margin: 0, fontSize: '1.15rem', color: 'var(--text-main)' }}>
                  Pacto de Muerte & Ruleta de Resurrección
                </h3>
              </div>
              <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--text-dim)' }}>
                En Ravenloft, un aventurero caído puede implorar auxilio a los Poderes Oscuros. Regresará a la vida con 1 PG a cambio de un Don Oscuro al azar.
              </p>
            </div>

            {activeCharacter && (
              <button 
                className="btn btn-primary"
                onClick={() => handleRoulettePact(activeCharacter)}
                style={{ background: 'linear-gradient(135deg, #7b2cbf 0%, #9d4edd 100%)', border: 'none' }}
              >
                <Dices size={16} /> Pacto para {activeCharacter.name}
              </button>
            )}
          </div>

          {/* Grid de Dones Oscuros Oficiales */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.2rem' }}>
            {DARK_GIFTS_DATA.map(gift => {
              const alreadyHas = activeCharacter?.darkGifts?.some(g => g.giftId === gift.id);

              return (
                <div 
                  key={gift.id}
                  className="card"
                  style={{
                    padding: '1.2rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '1rem',
                    borderLeft: '4px solid #9d4edd',
                    background: alreadyHas ? 'rgba(157, 78, 221, 0.05)' : undefined
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.3rem' }}>
                      <h3 style={{ margin: 0, fontSize: '1.15rem', color: 'var(--text-main)' }}>
                        {gift.name}
                      </h3>
                      <span className="badge badge-crimson" style={{ fontSize: '0.68rem' }}>
                        Pacto Oscuro
                      </span>
                    </div>

                    <div style={{ fontSize: '0.8rem', color: 'var(--accent-gold)', fontStyle: 'italic', marginBottom: '0.6rem' }}>
                      "{gift.tagline}"
                    </div>

                    <p style={{ margin: '0 0 0.8rem 0', fontSize: '0.82rem', color: 'var(--text-dim)', lineHeight: 1.35 }}>
                      {gift.description}
                    </p>

                    {/* Beneficios Sobrenaturales */}
                    <div style={{ marginBottom: '0.8rem' }}>
                      <strong style={{ fontSize: '0.78rem', color: 'var(--accent-emerald)', display: 'block', marginBottom: '0.3rem' }}>
                        ✨ BENDICIÓN SOBRENATURAL:
                      </strong>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        {gift.boons.map((b, i) => (
                          <div key={i} style={{ fontSize: '0.78rem', color: 'var(--text-main)', lineHeight: 1.3 }}>
                            • {b}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Maldición / Inconveniente */}
                    <div>
                      <strong style={{ fontSize: '0.78rem', color: 'var(--accent-crimson)', display: 'block', marginBottom: '0.3rem' }}>
                        💀 LA MALDICIÓN / INCONVENIENTE:
                      </strong>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        {gift.curses.map((c, i) => (
                          <div key={i} style={{ fontSize: '0.78rem', color: 'var(--text-dim)', lineHeight: 1.3 }}>
                            • {c}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Acciones */}
                  <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.8rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                      {gift.sourceBook}
                    </span>

                    {activeCharacter && (
                      <button 
                        className={`btn btn-sm ${alreadyHas ? 'btn-secondary' : 'btn-primary'}`}
                        disabled={alreadyHas}
                        onClick={() => handleGrantGift(activeCharacter, gift)}
                        style={{ borderRadius: 'var(--radius-full)' }}
                      >
                        {alreadyHas ? (
                          <>
                            <Check size={14} style={{ color: 'var(--accent-emerald)' }} /> Sellado
                          </>
                        ) : (
                          <>
                            <Flame size={14} /> Otorgar a {activeCharacter.name}
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUB-PESTAÑA 3: ORÁCULO DE TAROKKA */}
      {activeTab === 'tarokka' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--accent-gold)' }}>
                Tirada Tradicional de 5 Cartas de Tarokka
              </h2>
              <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-dim)' }}>
                Revela el Pasado (Tomo), el Presente (Símbolo), el Futuro (Espada), la Amenaza (Señor) y el Clímax de la campaña.
              </p>
            </div>

            <button className="btn btn-primary" onClick={handleDrawTarokka}>
              <RefreshCw size={16} /> Barajar y Tirar Cartas
            </button>
          </div>

          {spread ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              {spread.map((card, i) => (
                <div 
                  key={i}
                  className="card"
                  style={{
                    padding: '1.2rem',
                    textAlign: 'center',
                    border: '1px solid var(--border-gold)',
                    background: 'var(--bg-surface)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    minHeight: '260px'
                  }}
                >
                  <div style={{ fontSize: '0.78rem', color: 'var(--accent-gold)', fontWeight: 700, textTransform: 'uppercase' }}>
                    {card.positionLabel}
                  </div>

                  <div style={{ margin: '1rem 0' }}>
                    <div style={{ fontSize: '2.4rem', marginBottom: '0.4rem' }}>
                      {card.suit === 'Altos Arcanos' ? '👑' : card.suit === 'Espadas' ? '⚔️' : card.suit === 'Estrellas' ? '✨' : card.suit === 'Monedas' ? '🪙' : '📜'}
                    </div>
                    <strong style={{ fontSize: '1.15rem', color: 'var(--text-main)', display: 'block' }}>
                      {card.name}
                    </strong>
                    <span className="badge badge-gold" style={{ fontSize: '0.7rem', marginTop: '0.3rem' }}>
                      {card.suit}
                    </span>
                  </div>

                  <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', margin: 0, lineHeight: 1.35, fontStyle: 'italic' }}>
                    "{card.meaning}"
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px dashed var(--border-gold)' }}>
              <Ghost size={48} style={{ color: 'var(--accent-gold)', opacity: 0.5, marginBottom: '1rem' }} />
              <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-main)' }}>Las cartas descansan en el terciopelo</h3>
              <p style={{ margin: '0 0 1.2rem 0', color: 'var(--text-dim)', fontSize: '0.9rem' }}>
                Haz clic en "Barajar y Tirar Cartas" para que las Vistani desvelen los hilos del destino en Ravenloft.
              </p>
              <button className="btn btn-primary" onClick={handleDrawTarokka}>
                <RefreshCw size={16} /> Tirar Oráculo de Tarokka
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
