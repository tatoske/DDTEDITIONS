import React, { useState } from 'react';
import { Character } from '../../types/dnd';
import { Castle, Sparkles, Plus, Trash2, Shield, Wrench, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';

interface Facility {
  id: string;
  name: string;
  type: 'Básica' | 'Especial';
  minLevel: number;
  description: string;
  benefit: string;
  orderReady?: boolean;
}

const AVAILABLE_FACILITIES: Facility[] = [
  {
    id: 'fac_alchemist',
    name: 'Laboratorio Alquímico',
    type: 'Especial',
    minLevel: 5,
    description: 'Un recinto equipado con retortas, alambiques y fuegos controlados atendido por un alquimista aprendiz.',
    benefit: 'Orden de Bastión: Puede fabricar 1 Poción de Curación o Fuego de Alquimista por cada Turno de Bastión sin coste.'
  },
  {
    id: 'fac_smithy',
    name: 'Herrería de Bastión',
    type: 'Especial',
    minLevel: 5,
    description: 'Fragua de carbón de piedra y yunques de acero enano para trabajo marcial.',
    benefit: 'Orden de Bastión: Repara y forja armas marciales, escudos y armaduras con un 50% de descuento en materiales.'
  },
  {
    id: 'fac_library',
    name: 'Biblioteca Arcana & Scriptórium',
    type: 'Especial',
    minLevel: 5,
    description: 'Estanterías repletas de tomos antiguos, atriles y mesas de copiado de pergaminos.',
    benefit: 'Orden de Bastión: Copia pergaminos de conjuros de nivel 1-2 o investiga secretos históricos de la campaña.'
  },
  {
    id: 'fac_sanctuary',
    name: 'Capilla Sagrada / Santuario',
    type: 'Especial',
    minLevel: 5,
    description: 'Un altar consagrado iluminado por vitrales que canaliza la paz de los planos superiores.',
    benefit: 'Orden de Bastión: Concede Inspiración Heroica y Agua Bendita a quienes mediten aquí antes de una expedición.'
  },
  {
    id: 'fac_barracks',
    name: 'Cuartel de Guardias & Campo de Tiro',
    type: 'Especial',
    minLevel: 5,
    description: 'Alojamiento para una guarnición de 12 guardias leales con armería y torre vigía.',
    benefit: 'Orden de Bastión: Defiende el bastión contra asaltos y puede patrullar una comarca de 8 km a la redonda.'
  },
  {
    id: 'fac_teleport',
    name: 'Círculo de Teletransporte Permanente',
    type: 'Especial',
    minLevel: 9,
    description: 'Runas mágicas de obsidiana grabadas en el suelo que conectan con la red de círculos del multiverso.',
    benefit: 'Orden de Bastión: Permite el viaje instantáneo a círculos conocidos para el grupo de aventureros.'
  }
];

interface BastionManagerProps {
  character: Character;
}

export const BastionManager: React.FC<BastionManagerProps> = ({ character }) => {
  const [bastionName, setBastionName] = useState<string>(`Bastión de ${character.name}`);
  const [bastionLocation, setBastionLocation] = useState<string>('En los acantilados del Valle Corona');
  const [facilities, setFacilities] = useState<Facility[]>([
    AVAILABLE_FACILITIES[0], // Laboratorio Alquímico
    AVAILABLE_FACILITIES[1]  // Herrería
  ]);
  const [lastTurnReport, setLastTurnReport] = useState<string | null>(null);

  const handleAddFacility = (fac: Facility) => {
    if (facilities.some(f => f.id === fac.id)) {
      alert('Ya posees esta instalación en tu bastión.');
      return;
    }
    setFacilities(prev => [...prev, fac]);
  };

  const handleRemoveFacility = (id: string) => {
    setFacilities(prev => prev.filter(f => f.id !== id));
  };

  // Simulación de Turno de Bastión (cada 7 días según DMG 2024)
  const handleExecuteBastionTurn = () => {
    const events = [
      '¡Semana Próspera! Los artesanos completaron sus labores y generaron 150 PO en comercio local.',
      'Un noble viajero quedó impresionado por tu fortaleza y donó una gema preciosa (100 PO).',
      '¡Cosecha Alquímica Exitosa! Se produjo una Poción de Curación adicional sin coste.',
      'Un bardo compuso una balada sobre tus hazañas; la moral de los guardias del bastión está en su punto más alto.',
      'Rastreadores divisaron huellas de orcos en las colinas cercanas; los defensores reforzaron las atalayas.'
    ];

    const randomEvent = events[Math.floor(Math.random() * events.length)];
    setLastTurnReport(`Turno de Bastión completado (Día 7):\n${randomEvent}\nInstalaciones operativas: ${facilities.length}.`);
  };

  return (
    <div style={{ maxWidth: '1150px', margin: '0 auto' }}>
      <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-gold)', paddingBottom: '0.8rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <h1 style={{ fontSize: '1.8rem', margin: 0 }}>Sistema de Bastiones (D&D 2024)</h1>
            <span className="badge badge-gold">Reglas DMG 2024</span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            A partir de nivel 5, los aventureros construyen y administran fortalezas, torres arcanas y santuarios.
          </p>
        </div>

        <button className="btn btn-primary" onClick={handleExecuteBastionTurn}>
          <RefreshCw size={16} /> Ejecutar Turno de Bastión (7 Días)
        </button>
      </div>

      {/* Reporte de Turno */}
      {lastTurnReport && (
        <div className="card card-gold" style={{ marginBottom: '1.5rem', background: 'rgba(158, 117, 20, 0.08)', animation: 'modalEnter 0.25s ease-out' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--gold-primary)', fontWeight: 700, marginBottom: '0.4rem' }}>
            <Sparkles size={18} /> Reporte del Turno de Bastión
          </div>
          <p style={{ whiteSpace: 'pre-line', margin: 0, fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
            {lastTurnReport}
          </p>
        </div>
      )}

      {/* Datos del Bastión */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1rem' }}>
          <div>
            <label>Nombre del Bastión</label>
            <input value={bastionName} onChange={e => setBastionName(e.target.value)} />
          </div>
          <div>
            <label>Ubicación Geográfica</label>
            <input value={bastionLocation} onChange={e => setBastionLocation(e.target.value)} />
          </div>
        </div>
      </div>

      {/* Instalaciones Actuales */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.3rem', marginBottom: '0.8rem' }}>
          Instalaciones Activas en el Bastión ({facilities.length})
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
          {facilities.map(fac => (
            <div key={fac.id} className="card" style={{ borderLeft: '3px solid var(--gold-primary)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                  <h3 style={{ fontSize: '1.15rem', margin: 0, color: 'var(--text-main)' }}>{fac.name}</h3>
                  <span className="badge badge-sapphire">Nivel {fac.minLevel}+</span>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.6rem', lineHeight: 1.4 }}>
                  {fac.description}
                </p>
                <div style={{ background: 'rgba(158, 117, 20, 0.08)', padding: '0.5rem 0.6rem', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem', color: 'var(--text-gold)' }}>
                  <strong>Beneficio:</strong> {fac.benefit}
                </div>
              </div>

              <div style={{ marginTop: '0.8rem', display: 'flex', justifyContent: 'flex-end' }}>
                <button className="btn btn-secondary btn-sm" onClick={() => handleRemoveFacility(fac.id)}>
                  <Trash2 size={14} /> Retirar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Catálogo de Instalaciones para Añadir */}
      <div>
        <h2 style={{ fontSize: '1.3rem', marginBottom: '0.8rem' }}>
          Instalaciones Disponibles para Construir
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
          {AVAILABLE_FACILITIES.filter(f => !facilities.some(cur => cur.id === f.id)).map(fac => (
            <div key={fac.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                  <h3 style={{ fontSize: '1.1rem', margin: 0, color: 'var(--text-main)' }}>{fac.name}</h3>
                  <span className="badge badge-gold">Nvl {fac.minLevel}+</span>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.4, margin: '0 0 0.5rem 0' }}>
                  {fac.description}
                </p>
              </div>

              <button className="btn btn-primary btn-sm" onClick={() => handleAddFacility(fac)}>
                <Plus size={14} /> Construir en Bastión
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
