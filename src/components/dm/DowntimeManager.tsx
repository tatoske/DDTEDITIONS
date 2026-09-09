import React, { useState } from 'react';
import { Character } from '../../types/dnd';
import { rollDice, rollD20WithAdvantage, getAbilityModifier, formatModifier } from '../../utils/dndMath';
import { Clock, Coins, Sparkles, Sword, BookOpen, Dice5, AlertCircle, CheckCircle } from 'lucide-react';

interface DowntimeManagerProps {
  activeCharacter?: Character;
  onUpdateCharacter?: (updated: Character) => void;
}

export const DowntimeManager: React.FC<DowntimeManagerProps> = ({ activeCharacter, onUpdateCharacter }) => {
  const [selectedActivity, setSelectedActivity] = useState<'gambling' | 'pit_fighting' | 'crafting' | 'carousing' | 'research'>('gambling');
  const [activityResult, setActivityResult] = useState<{ title: string; outcome: string; goldDelta: number; details: string; complication?: string } | null>(null);

  // 1. Apuestas en Tabernas (Xanathar)
  const handleGambling = () => {
    const bet = 50; // Apuesta estándar de 50 PO
    if (activeCharacter && activeCharacter.coins.gp < bet) {
      alert(`Necesitas al menos ${bet} PO para apostar en los garitos.`);
      return;
    }

    // 3 tiradas: Intuición (Wis), Engaño (Cha) y Juego de Dados (Dex)
    const wisMod = activeCharacter ? getAbilityModifier(activeCharacter.abilities.wis) : 0;
    const chaMod = activeCharacter ? getAbilityModifier(activeCharacter.abilities.cha) : 0;
    const dexMod = activeCharacter ? getAbilityModifier(activeCharacter.abilities.dex) : 0;

    const roll1 = rollD20WithAdvantage('normal', wisMod);
    const roll2 = rollD20WithAdvantage('normal', chaMod);
    const roll3 = rollD20WithAdvantage('normal', dexMod);

    const successes = (roll1.total >= 15 ? 1 : 0) + (roll2.total >= 15 ? 1 : 0) + (roll3.total >= 15 ? 1 : 0);

    let goldDelta = 0;
    let outcome = '';
    let complication = undefined;

    if (successes === 0) {
      goldDelta = -bet * 2;
      outcome = `Derrota aplastante. Perdiste tu apuesta y contrajiste deudas por ${Math.abs(goldDelta)} PO.`;
      complication = 'Un prestamista de los bajos fondos ahora te busca para cobrar con intereses.';
    } else if (successes === 1) {
      goldDelta = -Math.floor(bet / 2);
      outcome = `Mala racha. Perdiste la mitad de tu dinero (${Math.abs(goldDelta)} PO).`;
    } else if (successes === 2) {
      goldDelta = bet * 1.5;
      outcome = `¡Buena noche! Ganaste ${goldDelta} PO tras varias rondas reñidas de dados.`;
    } else {
      goldDelta = bet * 3;
      outcome = `¡Racha legendaria! Limpiaste la mesa y ganaste ${goldDelta} PO.`;
      complication = 'Los tahúres locales sospechan que hiciste trampa con magia o dados cargados.';
    }

    if (activeCharacter && onUpdateCharacter) {
      const nextGp = Math.max(0, activeCharacter.coins.gp + goldDelta);
      onUpdateCharacter({
        ...activeCharacter,
        coins: { ...activeCharacter.coins, gp: nextGp },
        updatedAt: new Date().toISOString()
      });
    }

    setActivityResult({
      title: 'Resultado de las Apuestas (Semana de Taberna)',
      outcome,
      goldDelta,
      details: `Pruebas realizadas: Intuición (${roll1.total}), Engaño (${roll2.total}), Destreza (${roll3.total}) -> ${successes}/3 éxitos (CD 15).`,
      complication
    });
  };

  // 2. Peleas Clandestinas en el Foso (Xanathar)
  const handlePitFighting = () => {
    const strMod = activeCharacter ? getAbilityModifier(activeCharacter.abilities.str) : 2;
    const conMod = activeCharacter ? getAbilityModifier(activeCharacter.abilities.con) : 2;

    const r1 = rollD20WithAdvantage('normal', strMod + 2); // Atletismo
    const r2 = rollD20WithAdvantage('normal', conMod);     // Constitución
    const r3 = rollD20WithAdvantage('normal', strMod);     // Ataque desarmado

    const successes = (r1.total >= 15 ? 1 : 0) + (r2.total >= 15 ? 1 : 0) + (r3.total >= 15 ? 1 : 0);
    let goldDelta = 0;
    let outcome = '';

    if (successes === 0) {
      goldDelta = 0;
      outcome = 'Fuiste noqueado en la primera ronda. Saliste magullado y sin recompensa.';
    } else if (successes === 1) {
      goldDelta = 25;
      outcome = 'Ganaste combates menores y recibiste 25 PO de los organizadores.';
    } else if (successes === 2) {
      goldDelta = 75;
      outcome = '¡Llegaste a la final y ganaste 75 PO entre aplausos de la multitud!';
    } else {
      goldDelta = 150;
      outcome = '¡Campeón indiscutido del foso! Ganaste 150 PO y el respeto de los gladiadores locales.';
    }

    if (activeCharacter && onUpdateCharacter && goldDelta > 0) {
      onUpdateCharacter({
        ...activeCharacter,
        coins: { ...activeCharacter.coins, gp: activeCharacter.coins.gp + goldDelta },
        updatedAt: new Date().toISOString()
      });
    }

    setActivityResult({
      title: 'Combates en el Foso Clandestino',
      outcome,
      goldDelta,
      details: `Rondas: Atletismo (${r1.total}), Aguante (${r2.total}), Golpe Final (${r3.total}) -> ${successes}/3 victorias (CD 15).`
    });
  };

  // 3. Investigación en Bibliotecas y Archivos
  const handleResearch = () => {
    const intMod = activeCharacter ? getAbilityModifier(activeCharacter.abilities.int) : 1;
    const roll = rollD20WithAdvantage('normal', intMod + 2);

    let outcome = '';
    if (roll.total >= 20) {
      outcome = '¡Descubrimiento monumental! Desenterraste un mapa secreto con la ubicación exacta de una cámara sellada y una debilidad del villano principal.';
    } else if (roll.total >= 15) {
      outcome = 'Información valiosa: Averiguaste el nombre del lugarteniente enemigo y las criaturas que custodian sus guaridas.';
    } else if (roll.total >= 10) {
      outcome = 'Rumores comunes: Encontraste fragmentos históricos dispersos y mitos populares de la región.';
    } else {
      outcome = 'Pérdida de tiempo: Los manuscritos estaban carcomidos por polillas o escritos en una lengua muerta ininteligible.';
    }

    setActivityResult({
      title: 'Investigación en Archivos y Bibliotecas',
      outcome,
      goldDelta: -10, // Costo de acceso a manuscritos
      details: `Prueba de Inteligencia (Investigación): d20 [${roll.rolls[0]}] ${formatModifier(intMod + 2)} = ${roll.total}.`
    });
  };

  return (
    <div style={{ maxWidth: '1150px', margin: '0 auto' }}>
      <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-gold)', paddingBottom: '0.8rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <h1 style={{ fontSize: '1.8rem', margin: 0 }}>Actividades de Tiempo Libre (Downtime)</h1>
            <span className="badge badge-gold">Guía de Xanathar</span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Reglas para lo que hacen los aventureros entre misiones: apuestas, peleas clandestinas, investigación y juergas.
          </p>
        </div>

        {activeCharacter && (
          <div className="card" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Coins size={18} color="var(--gold-primary)" />
            <span style={{ fontSize: '0.85rem' }}>
              Oro de {activeCharacter.name}: <strong style={{ color: 'var(--gold-primary)' }}>{activeCharacter.coins.gp} PO</strong>
            </span>
          </div>
        )}
      </div>

      {/* Selector de Actividad */}
      <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <button 
          className={`btn ${selectedActivity === 'gambling' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setSelectedActivity('gambling')}
        >
          <Dice5 size={16} /> Apuestas en Tabernas
        </button>
        <button 
          className={`btn ${selectedActivity === 'pit_fighting' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setSelectedActivity('pit_fighting')}
        >
          <Sword size={16} /> Peleas en el Foso
        </button>
        <button 
          className={`btn ${selectedActivity === 'research' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setSelectedActivity('research')}
        >
          <BookOpen size={16} /> Investigación en Archivos
        </button>
      </div>

      {/* Tarjeta de Acción */}
      <div className="card card-gold" style={{ marginBottom: '1.5rem' }}>
        {selectedActivity === 'gambling' && (
          <div>
            <h2 style={{ fontSize: '1.3rem', margin: 0, border: 'none', paddingBottom: '0.4rem' }}>
              Apuestas & Juegos de Azar
            </h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              El aventurero pasa una semana tentando a la suerte en tabernas y salas clandestinas. Requiere apostar 50 PO y realizar pruebas de Intuición, Engaño y Destreza.
            </p>
            <button className="btn btn-primary" onClick={handleGambling}>
              ¡Simular Semana de Apuestas! (50 PO)
            </button>
          </div>
        )}

        {selectedActivity === 'pit_fighting' && (
          <div>
            <h2 style={{ fontSize: '1.3rem', margin: 0, border: 'none', paddingBottom: '0.4rem' }}>
              Peleas Clandestinas en el Foso
            </h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Combates desarmados en sótanos y arenas improvisadas. Pon a prueba la Fuerza, Constitución y técnica marcial para ganar bolsas de oro.
            </p>
            <button className="btn btn-primary" onClick={handlePitFighting}>
              ¡Pelear en el Foso!
            </button>
          </div>
        )}

        {selectedActivity === 'research' && (
          <div>
            <h2 style={{ fontSize: '1.3rem', margin: 0, border: 'none', paddingBottom: '0.4rem' }}>
              Investigación Histórica y Mágica
            </h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Revisa pergaminos y mapas olvidados en monasterios o universidades arcanas para desentrañar debilidades enemigas o reliquias perdidas (costo: 10 PO en tasas).
            </p>
            <button className="btn btn-primary" onClick={handleResearch}>
              ¡Investigar en la Biblioteca!
            </button>
          </div>
        )}
      </div>

      {/* Resultado de la Actividad */}
      {activityResult && (
        <div className="card" style={{ borderLeft: activityResult.goldDelta >= 0 ? '4px solid var(--emerald-heal)' : '4px solid var(--crimson-hp)', animation: 'modalEnter 0.25s ease-out' }}>
          <h3 style={{ fontSize: '1.25rem', color: 'var(--text-gold)', marginBottom: '0.6rem' }}>
            {activityResult.title}
          </h3>
          <p style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
            {activityResult.outcome}
          </p>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.6rem' }}>
            {activityResult.details}
          </div>

          {activityResult.complication && (
            <div style={{ background: 'rgba(201, 42, 42, 0.08)', border: '1px solid var(--crimson-hp)', borderRadius: 'var(--radius-sm)', padding: '0.6rem 0.8rem', marginTop: '0.8rem', color: 'var(--crimson-hp)', fontSize: '0.88rem' }}>
              <strong>¡Complicación Inesperada de Xanathar!:</strong> {activityResult.complication}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
