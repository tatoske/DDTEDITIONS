import React, { useState } from 'react';
import { Monster, AbilityName } from '../../types/dnd';
import { getAbilityModifier, formatModifier, rollDice, rollD20WithAdvantage } from '../../utils/dndMath';
import { Skull, Search, Plus, Sword, Sparkles, X, Shield, Heart, Eye, Dices } from 'lucide-react';

interface BestiaryProps {
  monsters: Monster[];
  onAddToEncounter: (monster: Monster) => void;
  onOpenCreateModal: () => void;
}

export const Bestiary: React.FC<BestiaryProps> = ({ monsters, onAddToEncounter, onOpenCreateModal }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCr, setSelectedCr] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [activeMonster, setActiveMonster] = useState<Monster | null>(null);
  const [rollFeedback, setRollFeedback] = useState<string | null>(null);

  const notifyRoll = (msg: string) => {
    setRollFeedback(msg);
    setTimeout(() => setRollFeedback(null), 5000);
  };

  // Filtrado de monstruos
  const filtered = monsters.filter(m => {
    const matchSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        m.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        m.sourceBook.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCr = selectedCr === 'all' || m.cr === selectedCr;
    const matchType = selectedType === 'all' || m.type.toLowerCase().includes(selectedType.toLowerCase());
    return matchSearch && matchCr && matchType;
  });

  // Tiradas del monstruo
  const handleRollAction = (actionName: string, atkBonus?: number, dmgDice?: string) => {
    if (atkBonus !== undefined) {
      const atkRoll = rollD20WithAdvantage('normal', atkBonus);
      let dmgMsg = '';
      if (dmgDice) {
        const dmgRoll = rollDice(dmgDice);
        dmgMsg = ` | Daño: ${dmgRoll.total} (${dmgRoll.expression})`;
      }
      notifyRoll(`${actionName}: Ataque d20 [${atkRoll.rolls[0]}] + ${atkBonus} = ${atkRoll.total} al impacto${dmgMsg}`);
    } else if (dmgDice) {
      const dmgRoll = rollDice(dmgDice);
      notifyRoll(`${actionName}: Daño ${dmgRoll.total} (${dmgRoll.expression})`);
    }
  };

  const handleRollRecharge = (actionName: string) => {
    const d6 = rollDice('1d6');
    const success = d6.total >= 5;
    notifyRoll(`Recarga de ${actionName} (5-6): Dado d6 = ${d6.total} -> ${success ? '¡RECARGADO! (Listo para usar)' : 'No recargó este turno'}`);
  };

  return (
    <div>
      {/* Toast de Tiradas */}
      {rollFeedback && (
        <div style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          background: 'linear-gradient(135deg, rgba(20, 24, 38, 0.98), rgba(11, 13, 20, 0.98))',
          border: '1px solid var(--crimson-hp)',
          borderRadius: 'var(--radius-md)',
          padding: '0.8rem 1.2rem',
          boxShadow: 'var(--shadow-crimson)',
          zIndex: 1000,
          fontFamily: 'var(--font-mono)',
          color: '#ff8b94',
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          animation: 'modalEnter 0.2s ease-out'
        }}>
          <Skull size={18} />
          <span>{rollFeedback}</span>
        </div>
      )}

      {/* Header del Bestiario */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', margin: 0 }}>Bestiario del Dungeon Master</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Compendio de criaturas con Stat Blocks interactivos de las reglas D&D 2024 y suplementos.
          </p>
        </div>
        <button className="btn btn-primary" onClick={onOpenCreateModal}>
          <Plus size={16} /> Crear Monstruo Personalizado
        </button>
      </div>

      {/* Barra de Búsqueda y Filtros */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1rem 1.2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr', gap: '1rem' }}>
          <div style={{ position: 'relative' }}>
            <label>Buscar Criatura o Libro</label>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <input 
                type="text" 
                placeholder="Ej. Goblin, Dragón, Beholder, Lobo..." 
                value={searchTerm} 
                onChange={e => setSearchTerm(e.target.value)} 
              />
            </div>
          </div>

          <div>
            <label>Valor de Desafío (CR)</label>
            <select value={selectedCr} onChange={e => setSelectedCr(e.target.value)}>
              <option value="all">Todos los CR</option>
              <option value="0">CR 0</option>
              <option value="1/8">CR 1/8</option>
              <option value="1/4">CR 1/4</option>
              <option value="1/2">CR 1/2</option>
              <option value="1">CR 1</option>
              <option value="2">CR 2</option>
              <option value="3">CR 3</option>
              <option value="5">CR 5</option>
              <option value="10">CR 10</option>
              <option value="13">CR 13</option>
              <option value="17">CR 17</option>
              <option value="20">CR 20+</option>
            </select>
          </div>

          <div>
            <label>Tipo de Criatura</label>
            <select value={selectedType} onChange={e => setSelectedType(e.target.value)}>
              <option value="all">Todos los Tipos</option>
              <option value="Humanoide">Humanoide</option>
              <option value="Bestia">Bestia</option>
              <option value="No-muerto">No-muerto</option>
              <option value="Monstruosidad">Monstruosidad</option>
              <option value="Gigante">Gigante</option>
              <option value="Dragón">Dragón</option>
              <option value="Aberración">Aberración</option>
            </select>
          </div>
        </div>
      </div>

      {/* Rejilla de Criaturas */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
        {filtered.map(monster => (
          <div 
            key={monster.id} 
            className="card" 
            style={{ 
              borderLeft: monster.cr === '0' || monster.cr === '1/4' || monster.cr === '1/2' ? '4px solid var(--emerald-heal)' : monster.cr === '1' || monster.cr === '2' || monster.cr === '3' ? '4px solid var(--gold-primary)' : '4px solid var(--crimson-hp)',
              transition: 'var(--transition)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', margin: 0, color: '#ffffff' }}>{monster.name}</h3>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  {monster.size} • {monster.type}
                </div>
              </div>
              <span className="badge badge-gold" style={{ fontSize: '0.85rem' }}>
                CR {monster.cr}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.4rem', margin: '0.8rem 0', textAlign: 'center' }}>
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.3rem', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontSize: '0.65rem', color: 'var(--gold-hover)' }}>CA</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 800 }}>{monster.ac}</div>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.3rem', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontSize: '0.65rem', color: '#ff8b94' }}>HP</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 800 }}>{monster.hp}</div>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.3rem', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>EXP</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.85rem' }}>{monster.xp}</div>
              </div>
            </div>

            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '0.8rem' }}>
              Libro: <span style={{ color: 'var(--text-gold)' }}>{monster.sourceBook}</span>
            </div>

            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <button 
                className="btn btn-secondary btn-sm" 
                style={{ flex: 1 }} 
                onClick={() => setActiveMonster(monster)}
              >
                <Eye size={14} /> Ver Stat Block
              </button>
              <button 
                className="btn btn-primary btn-sm" 
                onClick={() => onAddToEncounter(monster)}
                title="Añadir criatura al encuentro activo"
              >
                <Plus size={14} /> Encuentro
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de Stat Block Completo */}
      {activeMonster && (
        <div className="modal-overlay" onClick={() => setActiveMonster(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '650px', background: '#131623' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid var(--gold-primary)', paddingBottom: '0.5rem', marginBottom: '0.8rem' }}>
              <div>
                <h2 style={{ fontSize: '1.8rem', margin: 0, border: 'none', padding: 0, color: '#ffffff' }}>{activeMonster.name}</h2>
                <div style={{ fontSize: '0.88rem', color: 'var(--text-gold)', fontStyle: 'italic' }}>
                  {activeMonster.size} {activeMonster.type}, {activeMonster.alignment}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <button className="btn btn-primary btn-sm" onClick={() => { onAddToEncounter(activeMonster); setActiveMonster(null); }}>
                  <Plus size={14} /> Agregar a Encuentro
                </button>
                <button className="btn btn-secondary btn-sm" onClick={() => setActiveMonster(null)}>
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* CA, HP, Velocidad */}
            <div style={{ color: 'var(--text-main)', fontSize: '0.9rem', lineHeight: 1.6, borderBottom: '1px solid var(--border-gold)', paddingBottom: '0.6rem', marginBottom: '0.6rem' }}>
              <div><strong style={{ color: 'var(--text-gold)' }}>Clase de Armadura:</strong> {activeMonster.ac} {activeMonster.acType ? `(${activeMonster.acType})` : ''}</div>
              <div><strong style={{ color: 'var(--text-gold)' }}>Puntos de Golpe:</strong> {activeMonster.hp} ({activeMonster.hitDice})</div>
              <div><strong style={{ color: 'var(--text-gold)' }}>Velocidad:</strong> {activeMonster.speed}</div>
            </div>

            {/* Tabla de Atributos FUE, DES, CON, INT, SAB, CAR */}
            <div className="stat-row">
              {(Object.keys(activeMonster.abilities) as AbilityName[]).map(ab => {
                const score = activeMonster.abilities[ab];
                const mod = getAbilityModifier(score);
                return (
                  <div key={ab} className="stat-box">
                    <div className="stat-box-label">{ab.toUpperCase()}</div>
                    <div className="stat-box-score">{score}</div>
                    <div className="stat-box-mod">{formatModifier(mod)}</div>
                  </div>
                );
              })}
            </div>

            {/* Sentidos, Idiomas, CR */}
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', borderBottom: '1px solid var(--border-gold)', paddingBottom: '0.6rem', marginBottom: '0.8rem', lineHeight: 1.5 }}>
              {activeMonster.savingThrows && <div><strong style={{ color: 'var(--text-gold)' }}>Salvaciones:</strong> {activeMonster.savingThrows}</div>}
              {activeMonster.skills && <div><strong style={{ color: 'var(--text-gold)' }}>Habilidades:</strong> {activeMonster.skills}</div>}
              {activeMonster.damageResistances && <div><strong style={{ color: 'var(--text-gold)' }}>Resistencias a Daño:</strong> {activeMonster.damageResistances}</div>}
              {activeMonster.damageImmunities && <div><strong style={{ color: 'var(--text-gold)' }}>Inmunidades a Daño:</strong> {activeMonster.damageImmunities}</div>}
              {activeMonster.conditionImmunities && <div><strong style={{ color: 'var(--text-gold)' }}>Inmunidades a Condiciones:</strong> {activeMonster.conditionImmunities}</div>}
              <div><strong style={{ color: 'var(--text-gold)' }}>Sentidos:</strong> {activeMonster.senses}</div>
              <div><strong style={{ color: 'var(--text-gold)' }}>Idiomas:</strong> {activeMonster.languages}</div>
              <div><strong style={{ color: 'var(--text-gold)' }}>Desafío:</strong> {activeMonster.cr} ({activeMonster.xp.toLocaleString()} PX) | <span style={{ color: 'var(--text-dim)' }}>Fuente: {activeMonster.sourceBook}</span></div>
            </div>

            {/* Rasgos Especiales */}
            {activeMonster.traits && activeMonster.traits.length > 0 && (
              <div style={{ marginBottom: '1rem' }}>
                {activeMonster.traits.map(t => (
                  <div key={t.name} style={{ marginBottom: '0.5rem', fontSize: '0.88rem' }}>
                    <strong style={{ color: '#ffffff' }}>{t.name}.</strong> <span style={{ color: 'var(--text-muted)' }}>{t.desc}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Acciones */}
            <h3 style={{ borderBottom: '1px solid var(--border-gold)', paddingBottom: '0.3rem', marginBottom: '0.6rem' }}>Acciones</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginBottom: '1rem' }}>
              {activeMonster.actions.map(action => (
                <div key={action.name} style={{ background: 'rgba(0,0,0,0.25)', padding: '0.6rem 0.8rem', borderRadius: 'var(--radius-sm)', borderLeft: '2px solid var(--crimson-hp)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                    <strong style={{ color: '#ffffff', fontSize: '0.95rem' }}>{action.name}</strong>
                    <div style={{ display: 'flex', gap: '0.3rem' }}>
                      {action.name.includes('Recarga') && (
                        <button className="btn btn-magic btn-sm" onClick={() => handleRollRecharge(action.name)}>
                          <Dices size={12} /> Recarga (5-6)
                        </button>
                      )}
                      {(action.attackBonus !== undefined || action.damageDice) && (
                        <button 
                          className="btn btn-danger btn-sm" 
                          onClick={() => handleRollAction(action.name, action.attackBonus, action.damageDice)}
                        >
                          <Sword size={12} /> Tirar Ataque & Daño
                        </button>
                      )}
                    </div>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                    {action.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Acciones Legendarias */}
            {activeMonster.legendaryActions && activeMonster.legendaryActions.length > 0 && (
              <div>
                <h3 style={{ borderBottom: '1px solid var(--gold-primary)', paddingBottom: '0.3rem', marginBottom: '0.6rem', color: 'var(--gold-hover)' }}>
                  Acciones Legendarias (3/Ronda)
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '0.5rem' }}>
                  El monstruo puede realizar hasta 3 acciones legendarias al final del turno de otra criatura.
                </p>
                {activeMonster.legendaryActions.map(la => (
                  <div key={la.name} style={{ marginBottom: '0.5rem', fontSize: '0.88rem' }}>
                    <strong style={{ color: 'var(--gold-hover)' }}>{la.name} {la.cost ? `(Cuesta ${la.cost} Acciones)` : ''}.</strong> <span style={{ color: 'var(--text-muted)' }}>{la.desc}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
