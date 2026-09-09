import React, { useState } from 'react';
import { SpeciesDef, ClassDef, BackgroundDef, Character, AbilityName, AbilitiesRecord, UserAccount } from '../../types/dnd';
import { INITIAL_SPECIES, INITIAL_CLASSES, INITIAL_BACKGROUNDS, INITIAL_SPELLS } from '../../data/initialData';
import { FEATS_2024_DATA } from '../../data/feats2024Data';
import { getAbilityModifier, formatModifier, rollDice } from '../../utils/dndMath';
import { Shield, Heart, Sparkles, Wand2, User, ChevronRight, ChevronLeft, CheckCircle, Dices, Zap } from 'lucide-react';

interface CharacterWizardProps {
  currentUser?: UserAccount | null;
  onSave: (character: Character) => void;
  onCancel: () => void;
}

const ABILITY_LABELS: Record<AbilityName, string> = {
  str: 'Fuerza (FUE)',
  dex: 'Destreza (DES)',
  con: 'Constitución (CON)',
  int: 'Inteligencia (INT)',
  wis: 'Sabiduría (SAB)',
  cha: 'Carisma (CAR)'
};

const POINT_BUY_COSTS: Record<number, number> = {
  8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5, 14: 7, 15: 9
};

export const CharacterWizard: React.FC<CharacterWizardProps> = ({ currentUser, onSave, onCancel }) => {
  const [step, setStep] = useState<number>(1);

  // Form State
  const [selectedSpecies, setSelectedSpecies] = useState<SpeciesDef>(INITIAL_SPECIES[0]);
  const [selectedClass, setSelectedClass] = useState<ClassDef>(INITIAL_CLASSES[4]); // Guerrero por defecto
  const [selectedBackground, setSelectedBackground] = useState<BackgroundDef>(INITIAL_BACKGROUNDS[0]);
  const [selectedOriginFeatId, setSelectedOriginFeatId] = useState<string>('feat-alert');

  // Ability Scores
  const [method, setMethod] = useState<'standard' | 'pointbuy' | 'roll'>('standard');
  const [baseScores, setBaseScores] = useState<AbilitiesRecord>({
    str: 15, dex: 14, con: 13, int: 12, wis: 10, cha: 8
  });
  
  // Trasfondo 2024 bonuses: +2 to one, +1 to another
  const [bonusPlus2, setBonusPlus2] = useState<AbilityName>('str');
  const [bonusPlus1, setBonusPlus1] = useState<AbilityName>('con');

  // Details
  const [charName, setCharName] = useState<string>('Valeros');
  const [playerName, setPlayerName] = useState<string>(currentUser?.username || '');
  const [alignment, setAlignment] = useState<string>('Neutral Bueno');

  // Compute final scores
  const finalScores: AbilitiesRecord = {
    str: baseScores.str + (bonusPlus2 === 'str' ? 2 : 0) + (bonusPlus1 === 'str' ? 1 : 0),
    dex: baseScores.dex + (bonusPlus2 === 'dex' ? 2 : 0) + (bonusPlus1 === 'dex' ? 1 : 0),
    con: baseScores.con + (bonusPlus2 === 'con' ? 2 : 0) + (bonusPlus1 === 'con' ? 1 : 0),
    int: baseScores.int + (bonusPlus2 === 'int' ? 2 : 0) + (bonusPlus1 === 'int' ? 1 : 0),
    wis: baseScores.wis + (bonusPlus2 === 'wis' ? 2 : 0) + (bonusPlus1 === 'wis' ? 1 : 0),
    cha: baseScores.cha + (bonusPlus2 === 'cha' ? 2 : 0) + (bonusPlus1 === 'cha' ? 1 : 0)
  };

  // Compute initial derived values
  const conMod = getAbilityModifier(finalScores.con);
  const dexMod = getAbilityModifier(finalScores.dex);
  const hitDieNumber = parseInt(selectedClass.hitDie.replace('1d', ''), 10) || 10;
  const initialMaxHp = hitDieNumber + conMod;
  const initialAc = 10 + dexMod;

  // Point Buy Points remaining
  const pointBuyTotalUsed = Object.values(baseScores).reduce((acc, score) => acc + (POINT_BUY_COSTS[score] || 0), 0);
  const pointBuyRemaining = 27 - pointBuyTotalUsed;

  const handlePointBuyChange = (ability: AbilityName, delta: number) => {
    const current = baseScores[ability];
    const next = current + delta;
    if (next < 8 || next > 15) return;

    const currentCost = POINT_BUY_COSTS[current];
    const nextCost = POINT_BUY_COSTS[next];
    const costDiff = nextCost - currentCost;

    if (pointBuyRemaining - costDiff < 0) return;

    setBaseScores(prev => ({ ...prev, [ability]: next }));
  };

  const handleRollStats = () => {
    const newScores: AbilitiesRecord = { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 };
    (Object.keys(newScores) as AbilityName[]).forEach(ab => {
      // 4d6 descartando el menor
      const rolls = [rollDice('1d6').total, rollDice('1d6').total, rollDice('1d6').total, rollDice('1d6').total];
      rolls.sort((a, b) => b - a);
      const sumTop3 = rolls[0] + rolls[1] + rolls[2];
      newScores[ab] = sumTop3;
    });
    setBaseScores(newScores);
  };

  const handleFinish = () => {
    const chosenFeat = FEATS_2024_DATA.find(f => f.id === selectedOriginFeatId) || FEATS_2024_DATA[0];
    const isTough = chosenFeat.id === 'feat-tough';
    const computedMaxHp = initialMaxHp + (isTough ? 2 : 0);

    const newChar: Character = {
      id: 'char_' + Date.now(),
      userId: currentUser?.id,
      name: charName || 'Héroe sin Nombre',
      playerName: playerName || currentUser?.username || 'Jugador',
      species: selectedSpecies.name,
      className: selectedClass.name,
      level: 1,
      background: selectedBackground.name,
      originFeat: chosenFeat.name,
      feats: [
        {
          featId: chosenFeat.id,
          name: chosenFeat.name,
          category: 'origin',
          customNotes: chosenFeat.benefits.join(' | ')
        }
      ],
      alignment,
      experience: 0,
      abilities: finalScores,
      maxHp: computedMaxHp,
      currentHp: computedMaxHp,
      tempHp: 0,
      hitDie: selectedClass.hitDie,
      hitDiceTotal: 1,
      hitDiceUsed: 0,
      deathSaves: { successes: 0, failures: 0 },
      armorClass: initialAc,
      initiativeBonus: dexMod,
      speed: selectedSpecies.speed,
      proficiencyBonus: 2,
      savingThrows: {
        str: selectedClass.savingThrows.includes('str'),
        dex: selectedClass.savingThrows.includes('dex'),
        con: selectedClass.savingThrows.includes('con'),
        int: selectedClass.savingThrows.includes('int'),
        wis: selectedClass.savingThrows.includes('wis'),
        cha: selectedClass.savingThrows.includes('cha')
      },
      skills: selectedBackground.skillProficiencies.reduce((acc, skill) => {
        acc[skill] = { proficient: true, expertise: false };
        return acc;
      }, {} as Record<string, { proficient: boolean; expertise: boolean }>),
      languages: ['Común', 'Élfico'],
      weaponProficiencies: selectedClass.weaponProficiencies,
      armorProficiencies: selectedClass.armorProficiencies,
      spellcastingAbility: selectedClass.spellcastingAbility,
      spellSaveDc: selectedClass.spellcastingAbility ? 8 + 2 + getAbilityModifier(finalScores[selectedClass.spellcastingAbility]) : undefined,
      spellAttackBonus: selectedClass.spellcastingAbility ? 2 + getAbilityModifier(finalScores[selectedClass.spellcastingAbility]) : undefined,
      spellSlots: selectedClass.spellcastingAbility ? [
        { level: 1, total: 2, used: 0 }
      ] : [],
      knownSpells: selectedClass.spellcastingAbility ? INITIAL_SPELLS.filter(s => s.classes.includes(selectedClass.name)).slice(0, 4) : [],
      weapons: [
        {
          id: 'w1',
          name: selectedClass.weaponProficiencies.includes('Armas marciales') ? 'Espada Larga' : 'Maza de Hierro',
          attackBonus: 2 + getAbilityModifier(finalScores.str),
          damageDice: '1d8 + ' + getAbilityModifier(finalScores.str),
          damageType: selectedClass.weaponProficiencies.includes('Armas marciales') ? 'Cortante' : 'Contundente'
        },
        {
          id: 'w2',
          name: 'Daga de Acero',
          attackBonus: 2 + dexMod,
          damageDice: '1d4 + ' + dexMod,
          damageType: 'Perforante',
          range: '6/18 m'
        }
      ],
      inventory: selectedBackground.equipment.map((eq, i) => ({
        id: 'eq_' + i,
        name: eq,
        quantity: 1,
        equipped: true
      })),
      coins: { cp: 0, sp: 0, ep: 0, gp: 50, pp: 0 },
      features: [
        ...selectedSpecies.traits.map(t => ({ title: t.name, source: selectedSpecies.name, description: t.desc })),
        ...selectedClass.features.filter(f => f.level === 1).map(f => ({ title: f.name, source: selectedClass.name, description: f.desc })),
        { title: `Dote de Origen: ${chosenFeat.name}`, source: selectedBackground.name, description: chosenFeat.benefits.join(' • ') }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onSave(newChar);
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      {/* Header Wizard */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-gold)', paddingBottom: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', margin: 0 }}>Creador de Aventureros — Reglas D&D 2024</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Diseña tu personaje paso a paso con las nuevas opciones de especies, clases y trasfondos.</p>
        </div>
        <button className="btn btn-secondary" onClick={onCancel}>Cancelar</button>
      </div>

      {/* Wizard Step Indicator */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
        {[
          { num: 1, label: '1. Especie' },
          { num: 2, label: '2. Clase' },
          { num: 3, label: '3. Trasfondo' },
          { num: 4, label: '4. Atributos' },
          { num: 5, label: '5. Identidad & Finalizar' }
        ].map(s => (
          <button
            key={s.num}
            onClick={() => setStep(s.num)}
            className={`btn btn-sm ${step === s.num ? 'btn-primary' : 'btn-secondary'}`}
            style={{ flex: 1, minWidth: '130px' }}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 320px', gap: '2rem' }}>
        {/* Contenido del Paso */}
        <div>
          {/* PASO 1: ESPECIE */}
          {step === 1 && (
            <div className="card">
              <h2>Paso 1: Elige tu Especie (Linaje)</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.2rem', fontSize: '0.95rem' }}>
                En las reglas D&D 2024, tu especie define tus sentidos (como visión en la oscuridad), velocidad y rasgos innatos de supervivencia y magia.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.8rem' }}>
                {INITIAL_SPECIES.map(species => (
                  <div
                    key={species.id}
                    onClick={() => setSelectedSpecies(species)}
                    style={{
                      background: selectedSpecies.id === species.id ? 'rgba(212, 175, 55, 0.18)' : 'rgba(0,0,0,0.3)',
                      border: `1px solid ${selectedSpecies.id === species.id ? 'var(--gold-primary)' : 'var(--border-subtle)'}`,
                      borderRadius: 'var(--radius-md)',
                      padding: '1rem',
                      cursor: 'pointer',
                      transition: 'var(--transition)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                      <h3 style={{ fontSize: '1.05rem', margin: 0 }}>{species.name}</h3>
                      {selectedSpecies.id === species.id && <CheckCircle size={16} color="var(--gold-primary)" />}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                      Velocidad: {species.speed} m | {species.size}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', lineClamp: 2, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {species.description}
                    </div>
                  </div>
                ))}
              </div>

              {/* Rasgos de la especie seleccionada */}
              <div style={{ marginTop: '1.5rem', background: 'rgba(0,0,0,0.25)', padding: '1rem', borderRadius: 'var(--radius-md)', borderLeft: '3px solid var(--gold-primary)' }}>
                <h4 style={{ color: 'var(--text-gold)', marginBottom: '0.5rem' }}>Rasgos de {selectedSpecies.name}:</h4>
                {selectedSpecies.traits.map(t => (
                  <div key={t.name} style={{ marginBottom: '0.4rem', fontSize: '0.88rem' }}>
                    <strong style={{ color: '#ffffff' }}>{t.name}:</strong> <span style={{ color: 'var(--text-muted)' }}>{t.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PASO 2: CLASE */}
          {step === 2 && (
            <div className="card">
              <h2>Paso 2: Elige tu Clase</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.2rem', fontSize: '0.95rem' }}>
                Tu clase define tu vocación, tus habilidades en combate, tus puntos de golpe y tu magia.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.8rem' }}>
                {INITIAL_CLASSES.map(cls => (
                  <div
                    key={cls.id}
                    onClick={() => setSelectedClass(cls)}
                    style={{
                      background: selectedClass.id === cls.id ? 'rgba(212, 175, 55, 0.18)' : 'rgba(0,0,0,0.3)',
                      border: `1px solid ${selectedClass.id === cls.id ? 'var(--gold-primary)' : 'var(--border-subtle)'}`,
                      borderRadius: 'var(--radius-md)',
                      padding: '1rem',
                      cursor: 'pointer',
                      transition: 'var(--transition)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                      <h3 style={{ fontSize: '1.05rem', margin: 0 }}>{cls.name}</h3>
                      {selectedClass.id === cls.id && <CheckCircle size={16} color="var(--gold-primary)" />}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                      Dado de Golpe: <span className="badge badge-gold">{cls.hitDie}</span>
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', lineClamp: 2, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {cls.description}
                    </div>
                  </div>
                ))}
              </div>

              {/* Rasgos de la clase seleccionada */}
              <div style={{ marginTop: '1.5rem', background: 'rgba(0,0,0,0.25)', padding: '1rem', borderRadius: 'var(--radius-md)', borderLeft: '3px solid var(--gold-primary)' }}>
                <h4 style={{ color: 'var(--text-gold)', marginBottom: '0.5rem' }}>Rasgos de Nivel 1 ({selectedClass.name}):</h4>
                {selectedClass.features.map(f => (
                  <div key={f.name} style={{ marginBottom: '0.4rem', fontSize: '0.88rem' }}>
                    <strong style={{ color: '#ffffff' }}>{f.name}:</strong> <span style={{ color: 'var(--text-muted)' }}>{f.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PASO 3: TRASFONDO */}
          {step === 3 && (
            <div className="card">
              <h2>Paso 3: Elige tu Trasfondo (Reglas 2024)</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.2rem', fontSize: '0.95rem' }}>
                En D&D 2024, el trasfondo otorga tus mejoras de atributos (+2 y +1), una dote de origen gratuita, competencias y equipo inicial.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '0.8rem' }}>
                {INITIAL_BACKGROUNDS.map(bg => (
                  <div
                    key={bg.id}
                    onClick={() => {
                      setSelectedBackground(bg);
                      setBonusPlus2(bg.suggestedAbilities[0] || 'str');
                      setBonusPlus1(bg.suggestedAbilities[1] || 'con');
                    }}
                    style={{
                      background: selectedBackground.id === bg.id ? 'rgba(212, 175, 55, 0.18)' : 'rgba(0,0,0,0.3)',
                      border: `1px solid ${selectedBackground.id === bg.id ? 'var(--gold-primary)' : 'var(--border-subtle)'}`,
                      borderRadius: 'var(--radius-md)',
                      padding: '1rem',
                      cursor: 'pointer',
                      transition: 'var(--transition)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                      <h3 style={{ fontSize: '1.05rem', margin: 0 }}>{bg.name}</h3>
                      {selectedBackground.id === bg.id && <CheckCircle size={16} color="var(--gold-primary)" />}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-gold)', marginBottom: '0.3rem' }}>
                      Dote de Origen: {bg.originFeat}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                      Habilidades: {bg.skillProficiencies.join(', ')}
                    </div>
                  </div>
                ))}
              </div>

              {/* Bonificadores de Atributo del Trasfondo */}
              <div style={{ marginTop: '1.5rem', background: 'rgba(0,0,0,0.25)', padding: '1.2rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-gold)' }}>
                <h4 style={{ color: 'var(--text-gold)', marginBottom: '0.8rem' }}>Ajuste de Bonificadores del Trasfondo ({selectedBackground.name})</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label>Bonificador +2 a:</label>
                    <select value={bonusPlus2} onChange={e => setBonusPlus2(e.target.value as AbilityName)}>
                      {(Object.keys(ABILITY_LABELS) as AbilityName[]).map(ab => (
                        <option key={ab} value={ab} disabled={ab === bonusPlus1}>{ABILITY_LABELS[ab]}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label>Bonificador +1 a:</label>
                    <select value={bonusPlus1} onChange={e => setBonusPlus1(e.target.value as AbilityName)}>
                      {(Object.keys(ABILITY_LABELS) as AbilityName[]).map(ab => (
                        <option key={ab} value={ab} disabled={ab === bonusPlus2}>{ABILITY_LABELS[ab]}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Selección de Dote de Origen (2024) */}
              <div style={{ marginTop: '1.5rem', background: 'rgba(0,0,0,0.25)', padding: '1.2rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-gold)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                  <h4 style={{ color: 'var(--text-gold)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Zap size={16} /> Dote de Origen D&D 2024
                  </h4>
                  <span className="badge badge-gold">Nivel 1</span>
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-dim)', marginBottom: '0.8rem' }}>
                  Elige la Dote de Origen otorgada por tu trasfondo o personalízala según las reglas 2024:
                </p>

                <select 
                  value={selectedOriginFeatId} 
                  onChange={e => setSelectedOriginFeatId(e.target.value)}
                  style={{ marginBottom: '0.8rem' }}
                >
                  {FEATS_2024_DATA.filter(f => f.category === 'origin').map(f => (
                    <option key={f.id} value={f.id}>{f.name}</option>
                  ))}
                </select>

                {(() => {
                  const feat = FEATS_2024_DATA.find(f => f.id === selectedOriginFeatId);
                  if (!feat) return null;
                  return (
                    <div style={{ padding: '0.8rem', background: 'var(--bg-main)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', fontSize: '0.82rem' }}>
                      <p style={{ fontStyle: 'italic', margin: '0 0 0.4rem 0', color: 'var(--text-dim)' }}>
                        "{feat.description}"
                      </p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        {feat.benefits.map((b, i) => (
                          <div key={i} style={{ color: 'var(--text-main)' }}>• {b}</div>
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          )}

          {/* PASO 4: ATRIBUTOS */}
          {step === 4 && (
            <div className="card">
              <h2>Paso 4: Asignación de Puntuaciones de Atributos</h2>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <button
                  className={`btn btn-sm ${method === 'standard' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => {
                    setMethod('standard');
                    setBaseScores({ str: 15, dex: 14, con: 13, int: 12, wis: 10, cha: 8 });
                  }}
                >
                  Conjunto Estándar (15, 14, 13, 12, 10, 8)
                </button>
                <button
                  className={`btn btn-sm ${method === 'pointbuy' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => {
                    setMethod('pointbuy');
                    setBaseScores({ str: 8, dex: 8, con: 8, int: 8, wis: 8, cha: 8 });
                  }}
                >
                  Compra por Puntos (27 Pts)
                </button>
                <button
                  className={`btn btn-sm ${method === 'roll' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => {
                    setMethod('roll');
                    handleRollStats();
                  }}
                >
                  <Dices size={14} style={{ marginRight: '0.2rem' }} /> Tirada de Dados (4d6)
                </button>
              </div>

              {method === 'pointbuy' && (
                <div style={{ marginBottom: '1rem', background: 'rgba(212, 175, 55, 0.1)', padding: '0.6rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--gold-primary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Puntos restantes disponibles:</span>
                  <strong style={{ fontFamily: 'var(--font-mono)', fontSize: '1.2rem', color: pointBuyRemaining === 0 ? 'var(--emerald-heal)' : 'var(--gold-hover)' }}>
                    {pointBuyRemaining} / 27
                  </strong>
                </div>
              )}

              {method === 'roll' && (
                <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
                  <button className="btn btn-secondary btn-sm" onClick={handleRollStats}>
                    <Dices size={14} /> Volver a tirar todos los dados (4d6)
                  </button>
                </div>
              )}

              {/* Selector de Puntuaciones */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.8rem' }}>
                {(Object.keys(baseScores) as AbilityName[]).map(ab => {
                  const base = baseScores[ab];
                  const bonus = (bonusPlus2 === ab ? 2 : 0) + (bonusPlus1 === ab ? 1 : 0);
                  const total = base + bonus;
                  const mod = getAbilityModifier(total);

                  return (
                    <div key={ab} style={{ background: 'rgba(0,0,0,0.35)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '0.8rem', textAlign: 'center' }}>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-gold)', fontWeight: 600, marginBottom: '0.4rem' }}>
                        {ABILITY_LABELS[ab]}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                        {method === 'pointbuy' && (
                          <button className="btn btn-secondary btn-sm" style={{ padding: '0.2rem 0.5rem' }} onClick={() => handlePointBuyChange(ab, -1)}>-</button>
                        )}
                        <span style={{ fontSize: '1.5rem', fontFamily: 'var(--font-mono)', fontWeight: 800 }}>{base}</span>
                        {method === 'pointbuy' && (
                          <button className="btn btn-secondary btn-sm" style={{ padding: '0.2rem 0.5rem' }} onClick={() => handlePointBuyChange(ab, 1)}>+</button>
                        )}
                      </div>

                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        Bono Trasfondo: <span style={{ color: bonus > 0 ? 'var(--gold-hover)' : 'inherit', fontWeight: 700 }}>+{bonus}</span>
                      </div>

                      <div style={{ marginTop: '0.4rem', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '0.4rem' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>TOTAL: </span>
                        <strong style={{ fontFamily: 'var(--font-mono)', fontSize: '1.1rem', color: '#ffffff' }}>{total}</strong>
                        <span className="badge badge-gold" style={{ marginLeft: '0.4rem' }}>{formatModifier(mod)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* PASO 5: IDENTIDAD & FINALIZAR */}
          {step === 5 && (
            <div className="card">
              <h2>Paso 5: Identidad de tu Aventurero</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem', marginBottom: '1.5rem' }}>
                <div>
                  <label>Nombre del Personaje</label>
                  <input type="text" value={charName} onChange={e => setCharName(e.target.value)} placeholder="Ej. Valeros, Lyra, Torben..." />
                </div>
                <div>
                  <label>Nombre del Jugador</label>
                  <input type="text" value={playerName} onChange={e => setPlayerName(e.target.value)} placeholder="Tu nombre" />
                </div>
                <div>
                  <label>Alineamiento</label>
                  <select value={alignment} onChange={e => setAlignment(e.target.value)}>
                    <option>Legal Bueno</option>
                    <option>Neutral Bueno</option>
                    <option>Caótico Bueno</option>
                    <option>Legal Neutral</option>
                    <option>Neutral Auténtico</option>
                    <option>Caótico Neutral</option>
                    <option>Legal Maligno</option>
                    <option>Neutral Maligno</option>
                    <option>Caótico Maligno</option>
                  </select>
                </div>
              </div>

              <div style={{ background: 'rgba(212, 175, 55, 0.08)', border: '1px solid var(--border-gold)', borderRadius: 'var(--radius-md)', padding: '1.2rem', marginBottom: '1.5rem' }}>
                <h4 style={{ color: 'var(--text-gold)', marginBottom: '0.6rem' }}>Resumen del Aventurero</h4>
                <p style={{ fontSize: '0.92rem', color: 'var(--text-main)', marginBottom: '0.4rem' }}>
                  <strong>{charName || 'Aventurero'}</strong> es un <strong>{selectedSpecies.name}</strong> de clase <strong>{selectedClass.name}</strong> (Nivel 1) con trasfondo de <strong>{selectedBackground.name}</strong>.
                </p>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Puntos de Golpe Máximos: <strong>{initialMaxHp} HP</strong> | Clase de Armadura: <strong>{initialAc} CA</strong> | Velocidad: <strong>{selectedSpecies.speed} m</strong> | Dote de Origen: <strong>{selectedBackground.originFeat}</strong>.
                </p>
              </div>

              <button className="btn btn-primary" style={{ width: '100%', padding: '0.9rem', fontSize: '1.1rem' }} onClick={handleFinish}>
                <Sparkles size={18} /> ¡Crear y Guardar Hoja de Aventurero!
              </button>
            </div>
          )}

          {/* Botones de Navegación del Wizard */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem' }}>
            <button
              className="btn btn-secondary"
              disabled={step === 1}
              onClick={() => setStep(s => Math.max(1, s - 1))}
            >
              <ChevronLeft size={16} /> Anterior
            </button>
            {step < 5 ? (
              <button
                className="btn btn-primary"
                onClick={() => setStep(s => Math.min(5, s + 1))}
              >
                Siguiente <ChevronRight size={16} />
              </button>
            ) : (
              <button className="btn btn-primary" onClick={handleFinish}>
                Crear Hoja <CheckCircle size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Panel Lateral: Vista Previa en Vivo de la Ficha */}
        <div>
          <div className="card card-gold" style={{ position: 'sticky', top: '5rem' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.8rem', borderBottom: '1px solid var(--border-gold)', paddingBottom: '0.4rem' }}>
              Ficha en Creación
            </h3>

            <div style={{ marginBottom: '0.8rem' }}>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff' }}>{charName || 'Sin Nombre'}</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-gold)' }}>
                {selectedSpecies.name} • {selectedClass.name} Nvl 1
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Trasfondo: {selectedBackground.name}
              </div>
            </div>

            {/* Vitrinas Rápidas de Salud y CA */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1rem' }}>
              <div style={{ background: 'rgba(230, 57, 70, 0.15)', border: '1px solid rgba(230, 57, 70, 0.3)', borderRadius: 'var(--radius-sm)', padding: '0.5rem', textAlign: 'center' }}>
                <div style={{ fontSize: '0.72rem', color: '#ff8b94', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.2rem' }}>
                  <Heart size={12} /> HP MÁXIMO
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.3rem', fontWeight: 800, color: '#ffffff' }}>
                  {initialMaxHp}
                </div>
              </div>
              <div style={{ background: 'rgba(212, 175, 55, 0.15)', border: '1px solid rgba(212, 175, 55, 0.3)', borderRadius: 'var(--radius-sm)', padding: '0.5rem', textAlign: 'center' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--gold-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.2rem' }}>
                  <Shield size={12} /> CLASE ARMADURA
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.3rem', fontWeight: 800, color: '#ffffff' }}>
                  {initialAc}
                </div>
              </div>
            </div>

            {/* Cuadrícula Resumida de Atributos */}
            <label style={{ fontSize: '0.75rem' }}>Atributos Finales</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.35rem', marginBottom: '1rem' }}>
              {(Object.keys(finalScores) as AbilityName[]).map(ab => (
                <div key={ab} style={{ background: 'rgba(0,0,0,0.3)', padding: '0.3rem', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>{ab}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.95rem' }}>{finalScores[ab]}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--gold-hover)' }}>{formatModifier(getAbilityModifier(finalScores[ab]))}</div>
                </div>
              ))}
            </div>

            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
              • Dote: <span style={{ color: 'var(--text-gold)' }}>{selectedBackground.originFeat}</span><br />
              • Velocidad: {selectedSpecies.speed} m<br />
              • Competencia: +2
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
