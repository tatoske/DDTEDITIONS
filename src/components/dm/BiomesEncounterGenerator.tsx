import React, { useState } from 'react';
import { Monster } from '../../types/dnd';
import { INITIAL_MONSTERS } from '../../data/initialData';
import { Compass, Trees, Mountain, CloudFog, Castle, SunMedium, Waves, Swords, Plus, RefreshCw, Wind } from 'lucide-react';

interface BiomeEncounter {
  id: string;
  biome: string;
  title: string;
  description: string;
  monstersSuggested: Monster[];
  weather: string;
  tacticalAdvantage: string;
}

interface BiomesEncounterGeneratorProps {
  onAddToEncounter: (monster: Monster) => void;
}

export const BiomesEncounterGenerator: React.FC<BiomesEncounterGeneratorProps> = ({ onAddToEncounter }) => {
  const [selectedBiome, setSelectedBiome] = useState<string>('bosque');
  const [selectedTier, setSelectedTier] = useState<string>('1');
  const [currentEncounter, setCurrentEncounter] = useState<BiomeEncounter | null>(null);

  const handleGenerate = () => {
    let title = '';
    let description = '';
    let monstersSuggested: Monster[] = [];
    let weather = '';
    let tacticalAdvantage = '';

    if (selectedBiome === 'bosque') {
      title = 'Emboscada en la Senda de los Sauces';
      description = 'Ramas crujen en la espesura. Tres goblins acechan subidos a los árboles con arcos tensados, mientras un lobo salvaje intenta cortar la retirada por la retaguardia.';
      monstersSuggested = [INITIAL_MONSTERS[0], INITIAL_MONSTERS[0], INITIAL_MONSTERS[1]]; // 2 Goblins + 1 Lobo
      weather = 'Niebla baja matutina: Visibilidad reducida a 18 metros; las criaturas más allá tienen media cobertura.';
      tacticalAdvantage = 'Los arqueros en los árboles tienen ventaja de altura y cobertura de follaje.';
    } else if (selectedBiome === 'montana') {
      title = 'El Desfiladero del Eco Aullante';
      description = 'Un ogro salvaje ha bloqueado el paso estrecho arrojando cantos rodados, exigiendo un tributo de comida o sangre.';
      monstersSuggested = [INITIAL_MONSTERS[3]]; // Ogro
      weather = 'Vientos gélidos huracanados: Todas las tiradas de ataque con armas a distancia tienen desventaja.';
      tacticalAdvantage = 'Riesgo de derrumbe si se usan conjuros de trueno o explosiones.';
    } else if (selectedBiome === 'pantano') {
      title = 'Las Ciénagas de las Almas en Pena';
      description = 'Entre aguas fétidas que llegan a las rodillas, esqueletos cubiertos de algas emergen silenciosamente de un túmulo funerario profanado.';
      monstersSuggested = [INITIAL_MONSTERS[2], INITIAL_MONSTERS[2], INITIAL_MONSTERS[2]]; // 3 Esqueletos
      weather = 'Gas pantanoso pestilente: Salvar Constitución CD 11 o quedar Envenenado durante 1 minuto.';
      tacticalAdvantage = 'Terreno difícil: El movimiento en el agua cuesta el doble de velocidad.';
    } else {
      // Mazmorra / Subterráneo
      title = 'La Guarida del Oso Lechuza';
      description = 'En una caverna repleta de huesos royados y plumas gigantes, un oso lechuza territorial ruge ferozmente al divisar la luz de las antorchas.';
      monstersSuggested = [INITIAL_MONSTERS[4]]; // Oso Lechuza
      weather = 'Oscuridad subterránea absoluta: Requiere visión en la oscuridad o fuentes de fuego.';
      tacticalAdvantage = 'Espacio cerrado: La criatura puede alcanzar a los aventureros en una sola embestida.';
    }

    setCurrentEncounter({
      id: 'enc_' + Date.now(),
      biome: selectedBiome,
      title,
      description,
      monstersSuggested,
      weather,
      tacticalAdvantage
    });
  };

  return (
    <div style={{ maxWidth: '1150px', margin: '0 auto' }}>
      <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-gold)', paddingBottom: '0.8rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <h1 style={{ fontSize: '1.8rem', margin: 0 }}>Generador de Encuentros por Bioma</h1>
            <span className="badge badge-gold">Guía de Xanathar / DMG</span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Tablas dinámicas de encuentros de viaje según el terreno: clima extremo, ventajas tácticas y monstruos del bestiario listos.
          </p>
        </div>

        <button className="btn btn-primary" onClick={handleGenerate}>
          <RefreshCw size={16} /> ¡Generar Encuentro de Terreno!
        </button>
      </div>

      {/* Selectores de Bioma */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1rem 1.2rem' }}>
        <label style={{ marginBottom: '0.6rem' }}>Selecciona el Entorno del Viaje</label>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button 
            className={`btn btn-sm ${selectedBiome === 'bosque' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setSelectedBiome('bosque')}
          >
            <Trees size={15} /> Bosques & Selvas
          </button>
          <button 
            className={`btn btn-sm ${selectedBiome === 'montana' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setSelectedBiome('montana')}
          >
            <Mountain size={15} /> Montañas & Cumbres
          </button>
          <button 
            className={`btn btn-sm ${selectedBiome === 'pantano' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setSelectedBiome('pantano')}
          >
            <CloudFog size={15} /> Pantanos & Ciénagas
          </button>
          <button 
            className={`btn btn-sm ${selectedBiome === 'subterraneo' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setSelectedBiome('subterraneo')}
          >
            <Castle size={15} /> Subterráneo & Cuevas
          </button>
        </div>
      </div>

      {/* Resultado del Encuentro */}
      {currentEncounter ? (
        <div className="card card-gold" style={{ animation: 'modalEnter 0.25s ease-out' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.8rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.6rem' }}>
            <div>
              <h2 style={{ fontSize: '1.4rem', color: 'var(--text-gold)', margin: 0, border: 'none', padding: 0 }}>
                {currentEncounter.title}
              </h2>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)', textTransform: 'capitalize', marginTop: '0.2rem' }}>
                Entorno: {currentEncounter.biome}
              </div>
            </div>
            <span className="badge badge-crimson">Combate / Encuentro</span>
          </div>

          <p style={{ fontSize: '0.95rem', color: 'var(--text-main)', lineHeight: 1.6, marginBottom: '1rem' }}>
            {currentEncounter.description}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.2rem' }}>
            <div style={{ background: 'rgba(25, 113, 194, 0.08)', border: '1px solid var(--sapphire-mana)', borderRadius: 'var(--radius-sm)', padding: '0.8rem' }}>
              <strong style={{ color: 'var(--sapphire-mana)', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem', marginBottom: '0.2rem' }}>
                <Wind size={15} /> Clima & Visibilidad
              </strong>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>
                {currentEncounter.weather}
              </div>
            </div>

            <div style={{ background: 'rgba(158, 117, 20, 0.08)', border: '1px solid var(--border-gold)', borderRadius: 'var(--radius-sm)', padding: '0.8rem' }}>
              <strong style={{ color: 'var(--gold-primary)', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem', marginBottom: '0.2rem' }}>
                <Swords size={15} /> Factor Táctico del Terreno
              </strong>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>
                {currentEncounter.tacticalAdvantage}
              </div>
            </div>
          </div>

          {/* Monstruos Sugeridos con Botón Directo a Combate */}
          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.8rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-gold)' }}>
                Criaturas presentes en el encuentro:
              </span>
              <button 
                className="btn btn-primary btn-sm"
                onClick={() => {
                  currentEncounter.monstersSuggested.forEach(m => onAddToEncounter(m));
                  alert('¡Todas las criaturas fueron añadidas al Gestor de Encuentros!');
                }}
              >
                <Plus size={14} /> Cargar Todas al Gestor de Combate
              </button>
            </div>

            <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
              {currentEncounter.monstersSuggested.map((m, i) => (
                <div key={i} style={{ background: 'rgba(0,0,0,0.04)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '0.4rem 0.8rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.88rem' }}>{m.name}</span>
                  <span className="badge badge-gold">CR {m.cr}</span>
                  <button className="btn btn-secondary btn-sm" style={{ padding: '0.15rem 0.4rem', fontSize: '0.72rem' }} onClick={() => onAddToEncounter(m)}>
                    +1
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
          <Trees size={36} color="var(--gold-primary)" style={{ marginBottom: '0.8rem' }} />
          <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)', marginBottom: '0.4rem' }}>
            Generador de Viajes y Peligros de Xanathar
          </h3>
          <p style={{ fontSize: '0.9rem', maxWidth: '500px', margin: '0 auto 1.2rem auto' }}>
            Elige el bioma por donde viajan los personajes y pulsa el botón para generar una escena de encuentro completa con clima y criaturas.
          </p>
          <button className="btn btn-primary" onClick={handleGenerate}>
            ¡Generar Encuentro de Viaje!
          </button>
        </div>
      )}
    </div>
  );
};
