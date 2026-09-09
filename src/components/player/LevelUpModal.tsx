import React, { useState } from 'react';
import { Character } from '../../types/dnd';
import {
  calculateProficiencyBonus,
  parseHitDieSize,
  getHitDieAverage,
  calculateHpIncrease,
  getSpellSlotsForClassAndLevel,
  getLevelUpMilestones,
  applyLevelUpToCharacter
} from '../../utils/levelUpMath';
import { getAbilityModifier } from '../../utils/dndMath';
import {
  ArrowUpCircle,
  Heart,
  Dices,
  Shield,
  Sparkles,
  Award,
  CheckCircle2,
  X
} from 'lucide-react';

interface LevelUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  character: Character;
  onConfirmLevelUp: (updated: Character) => void;
}

export const LevelUpModal: React.FC<LevelUpModalProps> = ({
  isOpen,
  onClose,
  character,
  onConfirmLevelUp
}) => {
  if (!isOpen) return null;

  const currentLevel = character.level || 1;
  const targetLevel = Math.min(20, currentLevel + 1);

  const dieSize = parseHitDieSize(character.hitDie || '1d8');
  const averageDieRoll = getHitDieAverage(dieSize);
  const conMod = getAbilityModifier(character.abilities.con);

  const [hpMethod, setHpMethod] = useState<'average' | 'roll'>('average');
  const [rolledDiceValue, setRolledDiceValue] = useState<number | null>(null);
  const [isRolling, setIsRolling] = useState<boolean>(false);

  // Cálculo de aumento de PG
  const diceValue = hpMethod === 'average' ? averageDieRoll : (rolledDiceValue ?? averageDieRoll);
  const hpGain = Math.max(1, diceValue + conMod);

  // Proyección de atributos
  const currentProf = character.proficiencyBonus || calculateProficiencyBonus(currentLevel);
  const newProf = calculateProficiencyBonus(targetLevel);
  const hasProfIncrease = newProf > currentProf;

  // Espacios de conjuros
  const projectedSlots = getSpellSlotsForClassAndLevel(character.className, targetLevel);

  // Hitos de nivel
  const milestones = getLevelUpMilestones(character.className, targetLevel);

  const handleRollHitDie = () => {
    setIsRolling(true);
    let counter = 0;
    const interval = setInterval(() => {
      setRolledDiceValue(Math.floor(Math.random() * dieSize) + 1);
      counter++;
      if (counter > 8) {
        clearInterval(interval);
        setIsRolling(false);
      }
    }, 60);
  };

  const handleConfirm = () => {
    const updated = applyLevelUpToCharacter(character, hpGain, projectedSlots);
    onConfirmLevelUp(updated);
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '16px'
      }}
      onClick={onClose}
    >
      <div
        className="card"
        style={{
          width: '100%',
          maxWidth: '560px',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '24px',
          borderRadius: '12px',
          border: '2px solid #b45309',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Cabecera del Modal */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--color-border, #e7e5e4)', paddingBottom: '16px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ padding: '8px', backgroundColor: 'rgba(217, 119, 6, 0.15)', color: '#b45309', borderRadius: '8px', display: 'flex' }}>
              <ArrowUpCircle size={28} />
            </span>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.35rem', color: 'var(--color-primary-dark, #292524)' }}>
                ¡Subir de Nivel!
              </h3>
              <p style={{ margin: '2px 0 0 0', color: 'var(--color-text-muted, #78716c)', fontSize: '0.85rem' }}>
                {character.name} • {character.className}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted, #78716c)' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Transición de Nivel */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', padding: '16px', backgroundColor: 'var(--color-bg-alt, #f5f5f4)', borderRadius: '8px', marginBottom: '20px' }}>
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted, #78716c)', textTransform: 'uppercase', fontWeight: 600 }}>Nivel Actual</span>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-text, #1c1917)' }}>{currentLevel}</div>
          </div>

          <div style={{ fontSize: '1.5rem', color: '#b45309', fontWeight: 700 }}>➔</div>

          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: '#b45309', textTransform: 'uppercase', fontWeight: 700 }}>Nuevo Nivel</span>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#b45309' }}>{targetLevel}</div>
          </div>
        </div>

        {/* Sección: Puntos de Golpe */}
        <div style={{ marginBottom: '20px', padding: '16px', border: '1px solid var(--color-border, #e7e5e4)', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 10px 0', fontSize: '0.95rem', color: '#b45309', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Heart size={18} /> Aumento de Puntos de Golpe (PG)
          </h4>

          <div style={{ display: 'flex', gap: '10px', marginBottom: '14px' }}>
            <button
              type="button"
              className={`btn btn-sm ${hpMethod === 'average' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setHpMethod('average')}
              style={{ flex: 1 }}
            >
              Promedio Fijo ({averageDieRoll} + CON)
            </button>
            <button
              type="button"
              className={`btn btn-sm ${hpMethod === 'roll' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => {
                setHpMethod('roll');
                if (rolledDiceValue === null) handleRollHitDie();
              }}
              style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
            >
              <Dices size={14} /> Tirar 1d{dieSize}
            </button>
          </div>

          {hpMethod === 'roll' && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', backgroundColor: 'var(--color-bg-alt, #f5f5f4)', borderRadius: '6px', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.85rem' }}>
                Tirada de 1d{dieSize}: <strong style={{ fontSize: '1.1rem', color: '#b45309' }}>{isRolling ? '...' : (rolledDiceValue ?? averageDieRoll)}</strong>
              </span>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={handleRollHitDie}
                disabled={isRolling}
                style={{ fontSize: '0.75rem' }}
              >
                Volver a Tirar
              </button>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
            <span>Fórmula: {diceValue} (Dado) + {conMod} (Mod. CON)</span>
            <span style={{ fontSize: '1rem', fontWeight: 700, color: '#16a34a' }}>
              +{hpGain} PG Máximos (Total: {character.maxHp + hpGain} PG)
            </span>
          </div>
        </div>

        {/* Sección: Bonificadores y Conjuros */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
          <div style={{ padding: '12px', border: '1px solid var(--color-border, #e7e5e4)', borderRadius: '8px', backgroundColor: 'var(--color-bg-card, #fafaf9)' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted, #78716c)', display: 'block' }}>Bonificador de Competencia</span>
            <strong style={{ fontSize: '1.1rem', color: hasProfIncrease ? '#16a34a' : 'var(--color-text, #1c1917)' }}>
              +{newProf} {hasProfIncrease && '(¡Aumenta!)'}
            </strong>
          </div>

          <div style={{ padding: '12px', border: '1px solid var(--color-border, #e7e5e4)', borderRadius: '8px', backgroundColor: 'var(--color-bg-card, #fafaf9)' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted, #78716c)', display: 'block' }}>Dados de Golpe Totales</span>
            <strong style={{ fontSize: '1.1rem', color: 'var(--color-text, #1c1917)' }}>
              {character.hitDiceTotal + 1}d{dieSize} (+1 dado)
            </strong>
          </div>
        </div>

        {/* Hitos de Nivel */}
        {milestones.length > 0 && (
          <div style={{ marginBottom: '20px', padding: '14px', backgroundColor: 'rgba(217, 119, 6, 0.08)', border: '1px solid rgba(217, 119, 6, 0.3)', borderRadius: '8px' }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '0.9rem', color: '#b45309', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={16} /> Hitos Desbloqueados en este Nivel:
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {milestones.map((m, idx) => (
                <div key={idx} style={{ fontSize: '0.85rem' }}>
                  <strong style={{ color: 'var(--color-primary-dark, #292524)' }}>{m.title}:</strong>{' '}
                  <span style={{ color: 'var(--color-text-muted, #78716c)' }}>{m.description}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Botones de Acción */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleConfirm}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700 }}
          >
            <CheckCircle2 size={18} /> ¡Confirmar Subida a Nivel {targetLevel}!
          </button>
        </div>
      </div>
    </div>
  );
};
