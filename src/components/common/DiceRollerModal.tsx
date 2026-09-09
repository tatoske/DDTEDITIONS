import React, { useState } from 'react';
import { rollDice, rollD20WithAdvantage, DiceRollResult } from '../../utils/dndMath';
import { triggerDramaticDiceRoll } from '../../utils/diceRollEvent';
import { Dices, X, RotateCcw, Sparkles, Skull, Flame } from 'lucide-react';

interface DiceRollerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRollComplete?: (result: DiceRollResult) => void;
}

export const DiceRollerModal: React.FC<DiceRollerModalProps> = ({ isOpen, onClose, onRollComplete }) => {
  const [bonus, setBonus] = useState<number>(0);
  const [advantageType, setAdvantageType] = useState<'normal' | 'advantage' | 'disadvantage'>('normal');
  const [history, setHistory] = useState<Array<{ id: string; text: string; total: number; details: string; isCrit?: boolean; isFumble?: boolean; timestamp: string }>>([]);
  const [latestRoll, setLatestRoll] = useState<{ total: number; expression: string; details: string; isCrit?: boolean; isFumble?: boolean } | null>(null);

  if (!isOpen) return null;

  const handleRoll = (sides: number) => {
    let result: DiceRollResult;
    let details = '';
    let chosenDie = 1;

    if (sides === 20 && advantageType !== 'normal') {
      const advResult = rollD20WithAdvantage(advantageType, bonus);
      chosenDie = advResult.selectedRoll;
      result = {
        total: advResult.total,
        rolls: advResult.rolls,
        bonus,
        diceCount: 1,
        diceSides: 20,
        isCrit: advResult.isCrit,
        isFumble: advResult.isFumble,
        expression: `1d20${bonus >= 0 ? '+' + bonus : bonus} (${advantageType === 'advantage' ? 'Ventaja' : 'Desventaja'})`
      };
      details = `Dados: [${advResult.rolls.join(', ')}] -> Elegido: ${advResult.selectedRoll} ${bonus ? (bonus >= 0 ? '+' + bonus : bonus) : ''}`;
    } else {
      const expr = `1d${sides}${bonus !== 0 ? (bonus > 0 ? '+' + bonus : bonus) : ''}`;
      result = rollDice(expr);
      chosenDie = result.rolls[0];
      details = `Tirada: [${result.rolls.join(', ')}] ${bonus !== 0 ? (bonus > 0 ? '+' + bonus : bonus) : ''}`;
    }

    const item = {
      id: Math.random().toString(36).substring(2, 9),
      expression: result.expression,
      text: result.expression,
      total: result.total,
      details,
      isCrit: result.isCrit,
      isFumble: result.isFumble,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };

    setLatestRoll(item);
    setHistory(prev => [item, ...prev.slice(0, 19)]);
    if (onRollComplete) onRollComplete(result);

    // Disparar animación dramática en pantalla completa
    triggerDramaticDiceRoll({
      sides,
      result: chosenDie,
      total: result.total,
      bonus,
      expression: result.expression,
      label: `Lanza-Dados Arcano (d${sides})`,
      isCrit: result.isCrit,
      isFumble: result.isFumble || chosenDie === 1,
      isMax: chosenDie === sides
    });
  };

  const handleCustomRoll = (count: number, sides: number) => {
    const expr = `${count}d${sides}${bonus !== 0 ? (bonus > 0 ? '+' + bonus : bonus) : ''}`;
    const result = rollDice(expr);
    const details = `Dados: [${result.rolls.join(', ')}] ${bonus !== 0 ? (bonus > 0 ? '+' + bonus : bonus) : ''}`;

    const item = {
      id: Math.random().toString(36).substring(2, 9),
      expression: expr,
      text: expr,
      total: result.total,
      details,
      isCrit: result.isCrit,
      isFumble: result.isFumble,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };

    setLatestRoll(item);
    setHistory(prev => [item, ...prev.slice(0, 19)]);
    if (onRollComplete) onRollComplete(result);

    // Disparar animación dramática
    const maxPoss = count * sides;
    triggerDramaticDiceRoll({
      sides,
      result: result.rolls[0] || result.total,
      total: result.total,
      bonus,
      expression: expr,
      label: `Tirada Múltiple (${expr})`,
      isCrit: result.total === maxPoss + bonus,
      isFumble: result.total === count + bonus,
      isMax: result.total === maxPoss + bonus
    });
  };

  // Acciones directas para probar Pifia y Crítico
  const handleTestFumble = () => {
    triggerDramaticDiceRoll({
      sides: 20,
      result: 1,
      total: 1 + bonus,
      bonus,
      expression: `1d20${bonus >= 0 ? '+' + bonus : bonus}`,
      label: 'Demostración de Pifia Catastrófica (1)',
      isCrit: false,
      isFumble: true,
      isMax: false
    });
  };

  const handleTestCrit = () => {
    triggerDramaticDiceRoll({
      sides: 20,
      result: 20,
      total: 20 + bonus,
      bonus,
      expression: `1d20${bonus >= 0 ? '+' + bonus : bonus}`,
      label: 'Demostración de Crítico Divino Supremo (20)',
      isCrit: true,
      isFumble: false,
      isMax: true
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '580px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', borderBottom: '1px solid var(--border-gold)', paddingBottom: '0.6rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div className="brand-icon" style={{ width: '32px', height: '32px' }}>
              <Dices size={20} />
            </div>
            <h2 style={{ margin: 0, padding: 0, border: 'none', fontSize: '1.4rem' }}>Lanza-Dados Arcano</h2>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={onClose} style={{ padding: '0.3rem' }}>
            <X size={18} />
          </button>
        </div>

        {/* Display del Último Resultado */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(20, 24, 38, 0.95), rgba(11, 13, 20, 0.95))',
          border: `2px solid ${latestRoll?.isCrit ? 'var(--gold-primary)' : latestRoll?.isFumble ? 'var(--crimson-hp)' : 'var(--border-subtle)'}`,
          borderRadius: 'var(--radius-lg)',
          padding: '1.2rem',
          textAlign: 'center',
          marginBottom: '1.5rem',
          boxShadow: latestRoll?.isCrit ? 'var(--shadow-gold)' : latestRoll?.isFumble ? 'var(--shadow-crimson)' : 'none',
          position: 'relative'
        }}>
          {latestRoll ? (
            <>
              {latestRoll.isCrit && (
                <div style={{ color: 'var(--gold-primary)', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', fontSize: '0.9rem', marginBottom: '0.2rem' }}>
                  <Sparkles size={16} /> ¡GOLPE CRÍTICO NATURAL! (20)
                </div>
              )}
              {latestRoll.isFumble && (
                <div style={{ color: 'var(--crimson-hp)', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.2rem' }}>
                  ¡PIFIA / FALLO CRÍTICO NATURAL! (1)
                </div>
              )}
              <div style={{ fontSize: '3rem', fontFamily: 'var(--font-mono)', fontWeight: 900, color: latestRoll.isCrit ? 'var(--gold-hover)' : latestRoll.isFumble ? 'var(--crimson-hp)' : '#ffffff' }}>
                {latestRoll.total}
              </div>
              <div style={{ color: 'var(--text-gold)', fontSize: '0.9rem', fontFamily: 'var(--font-mono)' }}>
                {latestRoll.expression}
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.2rem' }}>
                {latestRoll.details}
              </div>
            </>
          ) : (
            <div style={{ color: 'var(--text-dim)', padding: '1rem 0' }}>
              Selecciona un dado a continuación para realizar tu tirada
            </div>
          )}
        </div>

        {/* Modificadores & Ventaja */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.2rem' }}>
          <div>
            <label>Modificador (+ / -)</label>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <button className="btn btn-secondary btn-sm" onClick={() => setBonus(b => b - 1)}>-</button>
              <input 
                type="number" 
                value={bonus} 
                onChange={e => setBonus(parseInt(e.target.value, 10) || 0)} 
                style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontWeight: 700 }}
              />
              <button className="btn btn-secondary btn-sm" onClick={() => setBonus(b => b + 1)}>+</button>
              <button className="btn btn-secondary btn-sm" onClick={() => setBonus(0)} title="Resetear"><RotateCcw size={14} /></button>
            </div>
          </div>

          <div>
            <label>Tipo de Tirada d20</label>
            <div style={{ display: 'flex', gap: '0.3rem' }}>
              <button 
                className={`btn btn-sm ${advantageType === 'normal' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ flex: 1 }}
                onClick={() => setAdvantageType('normal')}
              >
                Normal
              </button>
              <button 
                className={`btn btn-sm ${advantageType === 'advantage' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ flex: 1 }}
                onClick={() => setAdvantageType('advantage')}
              >
                Ventaja
              </button>
              <button 
                className={`btn btn-sm ${advantageType === 'disadvantage' ? 'btn-danger' : 'btn-secondary'}`}
                style={{ flex: 1 }}
                onClick={() => setAdvantageType('disadvantage')}
              >
                Desv.
              </button>
            </div>
          </div>
        </div>

        {/* Dados Principales */}
        <label>Dados Estándar</label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.4rem', marginBottom: '1.2rem' }}>
          {[4, 6, 8, 10, 12, 20, 100].map(sides => (
            <button 
              key={sides} 
              className="btn btn-secondary" 
              onClick={() => handleRoll(sides)}
              style={{ 
                padding: '0.7rem 0.2rem', 
                flexDirection: 'column', 
                fontFamily: 'var(--font-mono)', 
                borderColor: sides === 20 ? 'var(--gold-primary)' : 'var(--border-subtle)',
                background: sides === 20 ? 'rgba(212, 175, 55, 0.12)' : 'rgba(255, 255, 255, 0.04)'
              }}
            >
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>DADO</span>
              <span style={{ fontSize: '1.1rem', fontWeight: 800, color: sides === 20 ? 'var(--gold-hover)' : '#ffffff' }}>d{sides}</span>
            </button>
          ))}
        </div>

        {/* Tiradas Rápidas Múltiples */}
        <label>Tiradas de Daño Frecuentes</label>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.2rem' }}>
          <button className="btn btn-secondary btn-sm" onClick={() => handleCustomRoll(2, 6)}>2d6</button>
          <button className="btn btn-secondary btn-sm" onClick={() => handleCustomRoll(3, 6)}>3d6</button>
          <button className="btn btn-secondary btn-sm" onClick={() => handleCustomRoll(2, 8)}>2d8</button>
          <button className="btn btn-secondary btn-sm" onClick={() => handleCustomRoll(4, 6)}>4d6</button>
          <button className="btn btn-secondary btn-sm" onClick={() => handleCustomRoll(8, 6)}>8d6 (Bola Fuego)</button>
        </div>

        {/* Efectos Cinemáticos Especiales (Pifia 1 & Crítico Divino) */}
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-gold)' }}>
          <Sparkles size={14} /> Demostración de Efectos Especiales (Pantalla & Audio)
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem', marginBottom: '1.2rem' }}>
          <button 
            className="btn btn-danger btn-sm" 
            onClick={handleTestFumble}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '0.4rem',
              background: 'linear-gradient(135deg, rgba(201, 42, 42, 0.25), rgba(139, 0, 0, 0.4))',
              border: '1px solid #ff3344'
            }}
          >
            <Skull size={15} /> Probar Pifia (1) [Calavera]
          </button>
          <button 
            className="btn btn-primary btn-sm" 
            onClick={handleTestCrit}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '0.4rem',
              background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.3), rgba(255, 215, 0, 0.45))',
              border: '1px solid #ffd700'
            }}
          >
            <Sparkles size={15} /> Probar Crítico (20) [Luz Divina]
          </button>
        </div>

        {/* Historial de Tiradas */}
        {history.length > 0 && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <label style={{ margin: 0 }}>Historial de Tiradas</label>
              <button 
                onClick={() => setHistory([])} 
                style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', fontSize: '0.75rem' }}
              >
                Limpiar
              </button>
            </div>
            <div style={{ maxHeight: '150px', overflowY: 'auto', background: 'rgba(0,0,0,0.3)', borderRadius: 'var(--radius-sm)', padding: '0.5rem' }}>
              {history.map(item => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.25rem 0.4rem', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: '0.85rem' }}>
                  <div>
                    <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-gold)', marginRight: '0.5rem' }}>{item.text}</span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{item.details}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '1rem', color: item.isCrit ? 'var(--gold-primary)' : item.isFumble ? 'var(--crimson-hp)' : '#ffffff' }}>
                      {item.total}
                    </span>
                    <span style={{ color: 'var(--text-dim)', fontSize: '0.7rem' }}>{item.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
