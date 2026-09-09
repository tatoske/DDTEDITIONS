import React, { useState } from 'react';
import { Monster, MonsterAction, AbilityName } from '../../types/dnd';
import { estimateMonsterCr, CR_XP_MAP, getAbilityModifier, formatModifier } from '../../utils/dndMath';
import { Sparkles, Plus, Trash2, Shield, Heart, Skull, X } from 'lucide-react';

interface MonsterBuilderProps {
  onSave: (monster: Monster) => void;
  onCancel: () => void;
}

export const MonsterBuilder: React.FC<MonsterBuilderProps> = ({ onSave, onCancel }) => {
  const [name, setName] = useState<string>('Horror Sombrío');
  const [size, setSize] = useState<Monster['size']>('Mediano');
  const [type, setType] = useState<string>('Monstruosidad');
  const [alignment, setAlignment] = useState<string>('Caótico Maligno');
  
  const [hp, setHp] = useState<number>(45);
  const [hitDice, setHitDice] = useState<string>('6d8 + 18');
  const [ac, setAc] = useState<number>(14);
  const [acType, setAcType] = useState<string>('armadura natural');
  const [speed, setSpeed] = useState<string>('9 metros (30 pies)');

  const [abilities, setAbilities] = useState<Record<AbilityName, number>>({
    str: 16, dex: 14, con: 16, int: 8, wis: 12, cha: 8
  });

  const [dpr, setDpr] = useState<number>(18); // Daño estimado por ronda
  const [attackBonus, setAttackBonus] = useState<number>(5);

  const [senses, setSenses] = useState<string>('Visión en la oscuridad 18 m, Percepción pasiva 13');
  const [languages, setLanguages] = useState<string>('Común, Infracomún');

  const [traits, setTraits] = useState<Array<{ name: string; desc: string }>>([
    { name: 'Sigilo de las Sombras', desc: 'Mientras esté en luz tenue u oscuridad, el monstruo puede realizar la acción Esconderse como acción adicional.' }
  ]);

  const [actions, setActions] = useState<MonsterAction[]>([
    { name: 'Garras de Sombra', desc: 'Ataque cuerpo a cuerpo: +5 al impacto, alcance 1.5 m. Impacto: 10 (2d6 + 3) de daño cortante más 4 (1d8) de daño necrótico.', attackBonus: 5, damageDice: '2d6+3', damageType: 'Cortante' }
  ]);

  // Cálculo automático del CR
  const estimatedCr = estimateMonsterCr(hp, ac, dpr, attackBonus);
  const estimatedXp = CR_XP_MAP[estimatedCr] || 200;

  const handleAddTrait = () => {
    setTraits(prev => [...prev, { name: 'Nuevo Rasgo', desc: 'Descripción del rasgo o poder especial...' }]);
  };

  const handleRemoveTrait = (idx: number) => {
    setTraits(prev => prev.filter((_, i) => i !== idx));
  };

  const handleAddAction = () => {
    setActions(prev => [...prev, { name: 'Nuevo Ataque', desc: 'Ataque cuerpo a cuerpo o a distancia...', attackBonus: 4, damageDice: '1d8+2', damageType: 'Perforante' }]);
  };

  const handleRemoveAction = (idx: number) => {
    setActions(prev => prev.filter((_, i) => i !== idx));
  };

  const handleFinish = () => {
    const newMonster: Monster = {
      id: 'custom_monster_' + Date.now(),
      name: name || 'Monstruo Sin Nombre',
      size,
      type,
      alignment,
      cr: estimatedCr,
      xp: estimatedXp,
      ac,
      acType,
      hp,
      hitDice,
      speed,
      abilities,
      senses,
      languages,
      traits,
      actions,
      sourceBook: 'Creador Personalizado D&D 2024',
      isCustom: true
    };

    onSave(newMonster);
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-gold)', paddingBottom: '0.8rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', margin: 0 }}>Creador & Balanceador de Monstruos</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Diseña criaturas con cálculo automático de Desafío (CR) según las tablas de la Guía del DM.
          </p>
        </div>
        <button className="btn btn-secondary" onClick={onCancel}>Cancelar</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem' }}>
        {/* Formulario de Diseño */}
        <div className="card">
          <h2 style={{ fontSize: '1.2rem' }}>1. Datos Básicos</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '0.8rem', marginBottom: '1rem' }}>
            <div>
              <label>Nombre de la Criatura</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div>
              <label>Tamaño</label>
              <select value={size} onChange={e => setSize(e.target.value as Monster['size'])}>
                <option>Diminuto</option>
                <option>Pequeño</option>
                <option>Mediano</option>
                <option>Grande</option>
                <option>Enorme</option>
                <option>Gargantuesco</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem', marginBottom: '1.5rem' }}>
            <div>
              <label>Tipo de Monstruo</label>
              <input type="text" value={type} onChange={e => setType(e.target.value)} placeholder="Ej. Bestia, Dragón, etc." />
            </div>
            <div>
              <label>Alineamiento</label>
              <input type="text" value={alignment} onChange={e => setAlignment(e.target.value)} />
            </div>
          </div>

          <h2 style={{ fontSize: '1.2rem' }}>2. Defensas & Vitalidad</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.8rem', marginBottom: '1.5rem' }}>
            <div>
              <label>Puntos Golpe (HP)</label>
              <input type="number" value={hp} onChange={e => setHp(parseInt(e.target.value, 10) || 1)} />
            </div>
            <div>
              <label>Dados de Golpe</label>
              <input type="text" value={hitDice} onChange={e => setHitDice(e.target.value)} placeholder="Ej. 5d8+10" />
            </div>
            <div>
              <label>Clase Armadura (CA)</label>
              <input type="number" value={ac} onChange={e => setAc(parseInt(e.target.value, 10) || 10)} />
            </div>
          </div>

          <h2 style={{ fontSize: '1.2rem' }}>3. Puntuaciones de Característica</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '0.5rem', marginBottom: '1.5rem' }}>
            {(Object.keys(abilities) as AbilityName[]).map(ab => (
              <div key={ab} style={{ textAlign: 'center' }}>
                <label style={{ fontSize: '0.7rem' }}>{ab.toUpperCase()}</label>
                <input 
                  type="number" 
                  value={abilities[ab]} 
                  onChange={e => setAbilities({ ...abilities, [ab]: parseInt(e.target.value, 10) || 10 })}
                  style={{ textAlign: 'center', fontFamily: 'var(--font-mono)' }}
                />
                <span style={{ fontSize: '0.75rem', color: 'var(--gold-hover)', fontFamily: 'var(--font-mono)' }}>
                  {formatModifier(getAbilityModifier(abilities[ab]))}
                </span>
              </div>
            ))}
          </div>

          <h2 style={{ fontSize: '1.2rem' }}>4. Ofensiva & Balance CR</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem', marginBottom: '1.5rem' }}>
            <div>
              <label>Daño Estimado por Ronda (DPR)</label>
              <input type="number" value={dpr} onChange={e => setDpr(parseInt(e.target.value, 10) || 0)} />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Suma del daño promedio de sus ataques en 1 turno</span>
            </div>
            <div>
              <label>Bono de Ataque Principal (+)</label>
              <input type="number" value={attackBonus} onChange={e => setAttackBonus(parseInt(e.target.value, 10) || 0)} />
            </div>
          </div>

          {/* Rasgos */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <h2 style={{ fontSize: '1.2rem', margin: 0 }}>5. Rasgos & Poderes</h2>
              <button className="btn btn-secondary btn-sm" onClick={handleAddTrait}>
                <Plus size={14} /> Añadir Rasgo
              </button>
            </div>
            {traits.map((t, i) => (
              <div key={i} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'center' }}>
                <input style={{ width: '35%' }} value={t.name} onChange={e => {
                  const updated = [...traits];
                  updated[i].name = e.target.value;
                  setTraits(updated);
                }} placeholder="Nombre del rasgo" />
                <input style={{ flex: 1 }} value={t.desc} onChange={e => {
                  const updated = [...traits];
                  updated[i].desc = e.target.value;
                  setTraits(updated);
                }} placeholder="Efecto del rasgo..." />
                <button className="btn btn-secondary btn-sm" onClick={() => handleRemoveTrait(i)}><Trash2 size={14} /></button>
              </div>
            ))}
          </div>

          {/* Acciones de Combate */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <h2 style={{ fontSize: '1.2rem', margin: 0 }}>6. Acciones de Ataque</h2>
              <button className="btn btn-secondary btn-sm" onClick={handleAddAction}>
                <Plus size={14} /> Añadir Ataque
              </button>
            </div>
            {actions.map((a, i) => (
              <div key={i} style={{ background: 'rgba(0,0,0,0.25)', padding: '0.8rem', borderRadius: 'var(--radius-sm)', marginBottom: '0.5rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr auto', gap: '0.5rem', marginBottom: '0.4rem', alignItems: 'center' }}>
                  <input value={a.name} onChange={e => {
                    const updated = [...actions];
                    updated[i].name = e.target.value;
                    setActions(updated);
                  }} placeholder="Nombre del ataque" />
                  <input type="number" placeholder="Bono Atk (+)" value={a.attackBonus ?? ''} onChange={e => {
                    const updated = [...actions];
                    updated[i].attackBonus = parseInt(e.target.value, 10) || 0;
                    setActions(updated);
                  }} />
                  <input placeholder="Dados Daño (ej. 2d6+3)" value={a.damageDice || ''} onChange={e => {
                    const updated = [...actions];
                    updated[i].damageDice = e.target.value;
                    setActions(updated);
                  }} />
                  <button className="btn btn-secondary btn-sm" onClick={() => handleRemoveAction(i)}><Trash2 size={14} /></button>
                </div>
                <input value={a.desc} onChange={e => {
                  const updated = [...actions];
                  updated[i].desc = e.target.value;
                  setActions(updated);
                }} placeholder="Descripción completa del impacto y efectos..." />
              </div>
            ))}
          </div>
        </div>

        {/* Panel Lateral: Cálculo en Tiempo Real del CR y Stat Block */}
        <div>
          <div className="card card-gold" style={{ position: 'sticky', top: '5rem' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.8rem', borderBottom: '1px solid var(--border-gold)', paddingBottom: '0.4rem' }}>
              Balance & Desafío Estimado
            </h3>

            {/* Vitrina de CR */}
            <div style={{ background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.2), rgba(0,0,0,0.4))', border: '1px solid var(--gold-primary)', borderRadius: 'var(--radius-md)', padding: '1.2rem', textAlign: 'center', marginBottom: '1.2rem' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--gold-hover)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                VALOR DE DESAFÍO (CR)
              </div>
              <div style={{ fontSize: '3.5rem', fontFamily: 'var(--font-mono)', fontWeight: 900, color: '#ffffff', lineHeight: 1.1 }}>
                {estimatedCr}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-gold)', fontFamily: 'var(--font-mono)' }}>
                {estimatedXp.toLocaleString()} Puntos de Experiencia (PX)
              </div>
            </div>

            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '1.5rem' }}>
              • <strong>Defensivo:</strong> {hp} HP con CA {ac}<br />
              • <strong>Ofensivo:</strong> {dpr} daño/turno con Bono +{attackBonus}
            </div>

            <button className="btn btn-primary" style={{ width: '100%', padding: '0.8rem' }} onClick={handleFinish}>
              <Sparkles size={16} /> ¡Guardar Monstruo en el Bestiario!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
