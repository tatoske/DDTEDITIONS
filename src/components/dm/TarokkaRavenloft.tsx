import React, { useState } from 'react';
import { Eye, Sparkles, RefreshCw, Skull, Moon, Ghost } from 'lucide-react';

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

export const TarokkaRavenloft: React.FC = () => {
  const [spread, setSpread] = useState<TarokkaCard[] | null>(null);

  const handleDrawCards = () => {
    // Tomar 5 cartas al azar
    const shuffled = [...TAROKKA_POOL].sort(() => 0.5 - Math.random());
    const positions = [
      '1. El Pasado (El Tomo del Conocimiento)',
      '2. El Presente (El Símbolo de la Esperanza)',
      '3. El Futuro (El Filo de la Venganza)',
      '4. La Amenaza (El Señor de las Tinieblas)',
      '5. El Clímax (El Destino Final)'
    ];

    const drawn: TarokkaCard[] = positions.map((pos, i) => ({
      positionLabel: pos,
      name: shuffled[i].name,
      suit: shuffled[i].suit,
      meaning: shuffled[i].meaning
    }));

    setSpread(drawn);
  };

  return (
    <div style={{ maxWidth: '1150px', margin: '0 auto' }}>
      <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-gold)', paddingBottom: '0.8rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <h1 style={{ fontSize: '1.8rem', margin: 0 }}>Oráculo de Tarokka de Ravenloft</h1>
            <span className="badge badge-crimson">Guía de Van Richten</span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Lectura tradicional de 5 cartas de las Vistani para predecir el destino de la campaña, ubicar reliquias sagradas y desvelar al Señor Oscuro.
          </p>
        </div>

        <button className="btn btn-primary" onClick={handleDrawCards}>
          <Moon size={16} /> ¡Echar las Cartas de Tarokka!
        </button>
      </div>

      {spread ? (
        <div>
          <div className="card card-gold" style={{ marginBottom: '1.5rem', textAlign: 'center', background: 'rgba(158, 117, 20, 0.05)' }}>
            <h2 style={{ fontSize: '1.3rem', color: 'var(--text-gold)', margin: 0, border: 'none', padding: 0 }}>
              "Las nieblas se apartan y las cartas susurran el destino de los condenados..."
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            {spread.map((card, i) => (
              <div 
                key={i} 
                className="card"
                style={{
                  borderTop: '4px solid var(--crimson-hp)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  textAlign: 'center',
                  padding: '1.2rem 1rem',
                  animation: 'modalEnter 0.3s ease-out'
                }}
              >
                <div>
                  <span className="badge badge-gold" style={{ fontSize: '0.72rem', marginBottom: '0.6rem' }}>
                    {card.positionLabel}
                  </span>

                  <div style={{ fontSize: '1.4rem', fontFamily: 'var(--font-title)', fontWeight: 800, color: 'var(--text-main)', margin: '0.4rem 0' }}>
                    {card.name}
                  </div>

                  <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.8rem' }}>
                    Palo de {card.suit}
                  </div>

                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                    {card.meaning}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1rem', color: 'var(--text-muted)' }}>
          <Ghost size={40} color="var(--gold-primary)" style={{ marginBottom: '0.8rem' }} />
          <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main)', marginBottom: '0.4rem' }}>
            La Baraja de Tarokka de las Brumas
          </h3>
          <p style={{ fontSize: '0.9rem', maxWidth: '520px', margin: '0 auto 1.4rem auto' }}>
            Utiliza el oráculo de Madame Eva y los Dominios del Terror para inspirar sesiones góticas de misterio, traición y maldiciones ancestrales.
          </p>
          <button className="btn btn-primary" onClick={handleDrawCards}>
            ¡Realizar Tirada de 5 Cartas!
          </button>
        </div>
      )}
    </div>
  );
};
