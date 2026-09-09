import React, { useState } from 'react';
import { Character, AbilityName } from '../../types/dnd';
import { getAbilityModifier, formatModifier, getProficiencyBonus, rollDice, rollD20WithAdvantage } from '../../utils/dndMath';
import { removeFeatFromCharacter } from '../../utils/featsMath';
import { modifyCharacterStress, removeDarkGiftFromCharacter, calculateStressModifier } from '../../utils/ravenloftMath';
import { FeatsCompendium } from '../dm/FeatsCompendium';
import { LevelUpModal } from './LevelUpModal';
import { Heart, Shield, Zap, Sparkles, Sword, BookOpen, Backpack, RefreshCw, Dices, ArrowUpCircle, Download, FileText, Plus, Trash2, X, Ghost, Crown, Printer } from 'lucide-react';
import { GROUP_PATRONS_DATA } from '../../data/groupPatronsData';
import { DRAGONMARKS_DATA } from '../../data/dragonmarksData';
import { checkHasIntuitionDie, removeDragonmarkFromCharacter, removeProstheticFromCharacter } from '../../utils/dragonmarkMath';
import { triggerDramaticDiceRoll } from '../../utils/diceRollEvent';
import { ActivePatronCampaignState } from '../../types/dnd';

interface CharacterSheetProps {
  character: Character;
  onUpdate: (updated: Character) => void;
  onOpenDiceRoller?: () => void;
  activeCampaignPatron?: ActivePatronCampaignState | null;
}

const ALL_SKILLS: Array<{ id: string; name: string; ability: AbilityName }> = [
  { id: 'acrobacias', name: 'Acrobacias', ability: 'dex' },
  { id: 'atletismo', name: 'Atletismo', ability: 'str' },
  { id: 'arcanos', name: 'Conocimiento Arcano', ability: 'int' },
  { id: 'enganio', name: 'Engaño', ability: 'cha' },
  { id: 'historia', name: 'Historia', ability: 'int' },
  { id: 'interpretacion', name: 'Interpretación', ability: 'cha' },
  { id: 'intimidacion', name: 'Intimidación', ability: 'cha' },
  { id: 'investigacion', name: 'Investigación', ability: 'int' },
  { id: 'juego_manos', name: 'Juego de Manos', ability: 'dex' },
  { id: 'medicina', name: 'Medicina', ability: 'wis' },
  { id: 'naturaleza', name: 'Naturaleza', ability: 'int' },
  { id: 'percepcion', name: 'Percepción', ability: 'wis' },
  { id: 'perspicacia', name: 'Perspicacia (Intuición)', ability: 'wis' },
  { id: 'religion', name: 'Religión', ability: 'int' },
  { id: 'sigilo', name: 'Sigilo', ability: 'dex' },
  { id: 'supervivencia', name: 'Supervivencia', ability: 'wis' },
  { id: 'animales', name: 'Trato con Animales', ability: 'wis' }
];

export const CharacterSheet: React.FC<CharacterSheetProps> = ({ character, onUpdate, activeCampaignPatron }) => {
  const [activeTab, setActiveTab] = useState<'stats' | 'spells' | 'inventory' | 'features'>('stats');
  const [damageInput, setDamageInput] = useState<number>(0);
  const [healInput, setHealInput] = useState<number>(0);
  const [tempHpInput, setTempHpInput] = useState<number>(0);
  const [lastRollMessage, setLastRollMessage] = useState<string | null>(null);
  const [showFeatsModal, setShowFeatsModal] = useState<boolean>(false);
  const [showLevelUpModal, setShowLevelUpModal] = useState<boolean>(false);

  const profBonus = getProficiencyBonus(character.level);

  const notifyRoll = (msg: string) => {
    setLastRollMessage(msg);
    setTimeout(() => setLastRollMessage(null), 5000);
  };

  // Salud Controls
  const handleTakeDamage = () => {
    if (damageInput <= 0) return;
    let remDmg = damageInput;
    let newTemp = character.tempHp;
    if (newTemp > 0) {
      if (remDmg <= newTemp) {
        newTemp -= remDmg;
        remDmg = 0;
      } else {
        remDmg -= newTemp;
        newTemp = 0;
      }
    }
    const newCurrent = Math.max(0, character.currentHp - remDmg);
    onUpdate({ ...character, currentHp: newCurrent, tempHp: newTemp, updatedAt: new Date().toISOString() });
    setDamageInput(0);
  };

  const handleHeal = () => {
    if (healInput <= 0) return;
    const newCurrent = Math.min(character.maxHp, character.currentHp + healInput);
    onUpdate({ ...character, currentHp: newCurrent, updatedAt: new Date().toISOString() });
    setHealInput(0);
  };

  const handleSetTempHp = () => {
    if (tempHpInput < 0) return;
    onUpdate({ ...character, tempHp: tempHpInput, updatedAt: new Date().toISOString() });
    setTempHpInput(0);
  };

  // Descansos
  const handleShortRest = () => {
    // Gastar 1 dado de golpe
    if (character.hitDiceUsed < character.hitDiceTotal) {
      const conMod = getAbilityModifier(character.abilities.con);
      const roll = rollDice(`${character.hitDie}+${conMod}`);
      const healed = Math.max(1, roll.total);
      const newCurrent = Math.min(character.maxHp, character.currentHp + healed);
      onUpdate({
        ...character,
        currentHp: newCurrent,
        hitDiceUsed: character.hitDiceUsed + 1,
        updatedAt: new Date().toISOString()
      });
      notifyRoll(`Descanso Corto: Tiraste ${character.hitDie} (${roll.rolls[0]}) + ${conMod} = ¡Curaste ${healed} HP!`);
    } else {
      alert('No te quedan dados de golpe disponibles para gastar. Toma un Descanso Largo.');
    }
  };

  const handleLongRest = () => {
    const recoveredDice = Math.max(1, Math.floor(character.hitDiceTotal / 2));
    const newDiceUsed = Math.max(0, character.hitDiceUsed - recoveredDice);
    const restoredSlots = character.spellSlots.map(s => ({ ...s, used: 0 }));

    onUpdate({
      ...character,
      currentHp: character.maxHp,
      tempHp: 0,
      hitDiceUsed: newDiceUsed,
      deathSaves: { successes: 0, failures: 0 },
      spellSlots: restoredSlots,
      updatedAt: new Date().toISOString()
    });
    notifyRoll('¡Descanso Largo completado! HP restaurado al 100%, espacios de conjuro recuperados y dados de golpe restaurados.');
  };

  // Tiradas de Atributo y Salvación
  const rollAbilityCheck = (ability: AbilityName) => {
    const mod = getAbilityModifier(character.abilities[ability]);
    const res = rollD20WithAdvantage('normal', mod);
    notifyRoll(`Prueba de ${ability.toUpperCase()}: Tiraste [${res.rolls[0]}] ${formatModifier(mod)} = ${res.total}`);
    triggerDramaticDiceRoll({
      sides: 20,
      result: res.rolls[0],
      total: res.total,
      bonus: mod,
      expression: `1d20${formatModifier(mod)}`,
      label: `Prueba de ${ability.toUpperCase()}`,
      isCrit: res.rolls[0] === 20,
      isFumble: res.rolls[0] === 1,
      isMax: res.rolls[0] === 20
    });
  };

  const rollSavingThrow = (ability: AbilityName) => {
    const isProf = character.savingThrows[ability];
    const mod = getAbilityModifier(character.abilities[ability]) + (isProf ? profBonus : 0);
    const res = rollD20WithAdvantage('normal', mod);
    notifyRoll(`Salvación de ${ability.toUpperCase()} (${isProf ? 'Competente' : 'Normal'}): Tiraste [${res.rolls[0]}] ${formatModifier(mod)} = ${res.total}`);
    triggerDramaticDiceRoll({
      sides: 20,
      result: res.rolls[0],
      total: res.total,
      bonus: mod,
      expression: `1d20${formatModifier(mod)}`,
      label: `Salvación de ${ability.toUpperCase()}`,
      isCrit: res.rolls[0] === 20,
      isFumble: res.rolls[0] === 1,
      isMax: res.rolls[0] === 20
    });
  };

  const rollSkillCheck = (skillName: string, ability: AbilityName) => {
    const skillData = character.skills[skillName] || { proficient: false, expertise: false };
    const baseMod = getAbilityModifier(character.abilities[ability]);
    const skillBonus = skillData.expertise ? profBonus * 2 : skillData.proficient ? profBonus : 0;
    const totalMod = baseMod + skillBonus;
    
    // Comprobar si la Marca del Dragón otorga dado de intuición (+1d4)
    const hasIntuition = checkHasIntuitionDie(character, skillName);
    const d4Roll = hasIntuition ? Math.floor(Math.random() * 4) + 1 : 0;
    const res = rollD20WithAdvantage('normal', totalMod);
    const finalTotal = res.total + d4Roll;

    if (hasIntuition) {
      notifyRoll(`Habilidad ${skillName}: d20 [${res.rolls[0]}] ${formatModifier(totalMod)} + 1d4 Intuición (${d4Roll}) = ¡${finalTotal}!`);
    } else {
      notifyRoll(`Habilidad ${skillName}: Tiraste [${res.rolls[0]}] ${formatModifier(totalMod)} = ${res.total}`);
    }

    triggerDramaticDiceRoll({
      sides: 20,
      result: res.rolls[0],
      total: finalTotal,
      bonus: totalMod,
      expression: `1d20${formatModifier(totalMod)}${hasIntuition ? `+1d4(${d4Roll})` : ''}`,
      label: `Habilidad: ${skillName}`,
      isCrit: res.rolls[0] === 20,
      isFumble: res.rolls[0] === 1,
      isMax: res.rolls[0] === 20
    });
  };

  const rollWeaponAttack = (weaponName: string, atkBonus: number, dmgDice: string) => {
    const atkRoll = rollD20WithAdvantage('normal', atkBonus);
    const dmgRoll = rollDice(dmgDice);
    notifyRoll(`Ataque con ${weaponName}: d20 [${atkRoll.rolls[0]}] + ${atkBonus} = ${atkRoll.total} al impacto. Daño: ${dmgRoll.total} (${dmgRoll.expression})`);
    triggerDramaticDiceRoll({
      sides: 20,
      result: atkRoll.rolls[0],
      total: atkRoll.total,
      bonus: atkBonus,
      expression: `1d20${formatModifier(atkBonus)}`,
      label: `Ataque con ${weaponName}`,
      isCrit: atkRoll.rolls[0] === 20,
      isFumble: atkRoll.rolls[0] === 1,
      isMax: atkRoll.rolls[0] === 20
    });
  };

  // Nivel Superior (Level Up)
  const handleLevelUp = () => {
    const nextLevel = character.level + 1;
    const conMod = getAbilityModifier(character.abilities.con);
    const hitDieNum = parseInt(character.hitDie.replace('1d', ''), 10) || 8;
    const avgHpGain = Math.floor(hitDieNum / 2) + 1 + conMod;

    onUpdate({
      ...character,
      level: nextLevel,
      maxHp: character.maxHp + avgHpGain,
      currentHp: character.currentHp + avgHpGain,
      hitDiceTotal: character.hitDiceTotal + 1,
      proficiencyBonus: getProficiencyBonus(nextLevel),
      updatedAt: new Date().toISOString()
    });

    let featNotice = '';
    if ([4, 8, 12, 16, 19, 20].includes(nextLevel)) {
      featNotice = ' 🌟 ¡Has desbloqueado una nueva Dote 2024 o Bendición Épica! Puedes elegirla en "Rasgos & Dotes".';
    }

    notifyRoll(`¡Subiste a Nivel ${nextLevel}! Ganaste +${avgHpGain} HP y un nuevo dado de golpe.${featNotice}`);
  };

  // Exportar ficha a JSON
  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(character, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${character.name.toLowerCase().replace(/\s+/g, '_')}_dnd2024.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Banner de Notificación de Tirada */}
      {lastRollMessage && (
        <div style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          background: 'linear-gradient(135deg, rgba(20, 24, 38, 0.98), rgba(11, 13, 20, 0.98))',
          border: '1px solid var(--gold-primary)',
          borderRadius: 'var(--radius-md)',
          padding: '0.8rem 1.2rem',
          boxShadow: 'var(--shadow-gold)',
          zIndex: 1000,
          fontFamily: 'var(--font-mono)',
          color: 'var(--gold-hover)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          animation: 'modalEnter 0.2s ease-out'
        }}>
          <Dices size={18} />
          <span>{lastRollMessage}</span>
        </div>
      )}

      {/* Header Principal de la Hoja */}
      <div className="card card-gold" style={{ marginBottom: '1.5rem', padding: '1.2rem 1.6rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <h1 style={{ fontSize: '2.2rem', margin: 0 }}>{character.name}</h1>
              <span className="badge badge-gold" style={{ fontSize: '0.9rem', padding: '0.2rem 0.6rem' }}>
                Nivel {character.level}
              </span>
            </div>
            <div style={{ color: 'var(--text-gold)', fontSize: '0.95rem', marginTop: '0.2rem' }}>
              {character.species} • {character.className} • Trasfondo: {character.background}
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
              Alineamiento: {character.alignment} | Jugador: {character.playerName || 'Anónimo'}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn-secondary btn-sm" onClick={handleShortRest} title="Gasta 1 dado de golpe para curar">
              <RefreshCw size={14} /> Descanso Corto
            </button>
            <button className="btn btn-primary btn-sm" onClick={handleLongRest} title="Restaura 100% de HP y conjuros">
              <Sparkles size={14} /> Descanso Largo
            </button>
            <button className="btn btn-magic btn-sm" onClick={() => setShowLevelUpModal(true)} title="Asistente de Subida de Nivel (Reglas 2024)">
              <ArrowUpCircle size={14} /> Subir Nivel ({character.level + 1})
            </button>
            <button className="btn btn-secondary btn-sm" onClick={handleExportJson} title="Exportar JSON">
              <Download size={14} /> Exportar
            </button>
            <button className="btn btn-secondary btn-sm" onClick={() => window.print()} title="Imprimir Hoja o Guardar como PDF">
              <Printer size={14} /> Imprimir / PDF
            </button>
          </div>
        </div>
      </div>

      {/* Barra de Combate y Estado Rápido */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        {/* Puntos de Golpe */}
        <div className="card" style={{ border: '1px solid rgba(230, 57, 70, 0.4)', background: 'rgba(230, 57, 70, 0.08)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
            <label style={{ margin: 0, color: '#ff8b94', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Heart size={14} /> SALUD (HP)
            </label>
            {character.tempHp > 0 && <span className="badge badge-sapphire">+{character.tempHp} Temp</span>}
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.3rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '2.2rem', fontFamily: 'var(--font-mono)', fontWeight: 900, color: character.currentHp === 0 ? 'var(--crimson-hp)' : '#ffffff' }}>
              {character.currentHp}
            </span>
            <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '1rem' }}>
              / {character.maxHp}
            </span>
          </div>

          {/* Controles de Daño / Curación */}
          <div style={{ display: 'flex', gap: '0.3rem' }}>
            <input 
              type="number" 
              placeholder="Dmg" 
              value={damageInput || ''} 
              onChange={e => setDamageInput(parseInt(e.target.value, 10) || 0)} 
              style={{ width: '55px', padding: '0.2rem', textAlign: 'center', fontSize: '0.8rem' }}
            />
            <button className="btn btn-danger btn-sm" style={{ padding: '0.2rem 0.4rem', fontSize: '0.75rem' }} onClick={handleTakeDamage}>
              Daño
            </button>
            <input 
              type="number" 
              placeholder="Heal" 
              value={healInput || ''} 
              onChange={e => setHealInput(parseInt(e.target.value, 10) || 0)} 
              style={{ width: '55px', padding: '0.2rem', textAlign: 'center', fontSize: '0.8rem' }}
            />
            <button className="btn btn-primary btn-sm" style={{ padding: '0.2rem 0.4rem', fontSize: '0.75rem' }} onClick={handleHeal}>
              Curar
            </button>
          </div>
        </div>

        {/* Clase de Armadura */}
        <div className="card" style={{ textAlign: 'center' }}>
          <label style={{ color: 'var(--gold-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem' }}>
            <Shield size={14} /> ARMADURA (CA)
          </label>
          <div style={{ fontSize: '2.2rem', fontFamily: 'var(--font-mono)', fontWeight: 900, color: '#ffffff' }}>
            {character.armorClass}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Base + Des + Escudo</span>
        </div>

        {/* Iniciativa */}
        <div className="card" style={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => {
          const res = rollD20WithAdvantage('normal', character.initiativeBonus);
          notifyRoll(`Tirada de Iniciativa: [${res.rolls[0]}] ${formatModifier(character.initiativeBonus)} = ${res.total}`);
          triggerDramaticDiceRoll({
            sides: 20,
            result: res.rolls[0],
            total: res.total,
            bonus: character.initiativeBonus,
            expression: `1d20${formatModifier(character.initiativeBonus)}`,
            label: 'Tirada de Iniciativa',
            isCrit: res.rolls[0] === 20,
            isFumble: res.rolls[0] === 1,
            isMax: res.rolls[0] === 20
          });
        }}>
          <label style={{ color: 'var(--text-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem' }}>
            <Zap size={14} /> INICIATIVA
          </label>
          <div style={{ fontSize: '2.2rem', fontFamily: 'var(--font-mono)', fontWeight: 900, color: 'var(--gold-hover)' }}>
            {formatModifier(character.initiativeBonus)}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-gold)' }}>Click para tirar d20</span>
        </div>

        {/* Velocidad */}
        <div className="card" style={{ textAlign: 'center' }}>
          <label>VELOCIDAD</label>
          <div style={{ fontSize: '2.2rem', fontFamily: 'var(--font-mono)', fontWeight: 900, color: '#ffffff' }}>
            {character.speed} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>m</span>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{(character.speed * 3.28).toFixed(0)} pies</span>
        </div>

        {/* Bonificador de Competencia */}
        <div className="card" style={{ textAlign: 'center' }}>
          <label>COMPETENCIA</label>
          <div style={{ fontSize: '2.2rem', fontFamily: 'var(--font-mono)', fontWeight: 900, color: 'var(--gold-primary)' }}>
            +{profBonus}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Nivel {character.level}</span>
        </div>

        {/* Medidor de Estrés de Ravenloft */}
        <div className="card" style={{ textAlign: 'center', border: (character.stressScore || 0) > 0 ? '1px solid var(--accent-crimson)' : '1px solid var(--border-subtle)', background: (character.stressScore || 0) > 0 ? 'rgba(230, 57, 70, 0.05)' : undefined }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem', color: (character.stressScore || 0) > 0 ? 'var(--accent-crimson)' : 'var(--text-dim)' }}>
            <Ghost size={14} /> <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>ESTRÉS</span>
          </div>
          <div style={{ fontSize: '1.9rem', fontFamily: 'var(--font-mono)', fontWeight: 900, color: (character.stressScore || 0) > 0 ? 'var(--accent-crimson)' : 'var(--text-main)', margin: '0.1rem 0' }}>
            {character.stressScore || 0}/10
          </div>
          <div style={{ fontSize: '0.72rem', color: (character.stressScore || 0) > 0 ? 'var(--accent-crimson)' : 'var(--text-dim)', marginBottom: '0.3rem' }}>
            {(character.stressScore || 0) > 0 ? `${calculateStressModifier(character.stressScore)} a tiradas d20` : 'Calma (Sin penalizador)'}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.3rem' }}>
            <button 
              className="btn btn-secondary btn-sm" 
              style={{ padding: '0.15rem 0.4rem', fontSize: '0.75rem' }} 
              disabled={!character.stressScore || character.stressScore <= 0} 
              onClick={() => {
                const updated = modifyCharacterStress(character, -1).updatedCharacter;
                onUpdate(updated);
                notifyRoll(`Estrés reducido a ${updated.stressScore}/10`);
              }}
            >
              -1
            </button>
            <button 
              className="btn btn-secondary btn-sm" 
              style={{ padding: '0.15rem 0.4rem', fontSize: '0.75rem' }} 
              disabled={(character.stressScore || 0) >= 10} 
              onClick={() => {
                const updated = modifyCharacterStress(character, 1).updatedCharacter;
                onUpdate(updated);
                notifyRoll(`¡Estrés aumentado a ${updated.stressScore}/10! Penalizador ${calculateStressModifier(updated.stressScore)} a d20.`);
              }}
            >
              +1
            </button>
          </div>
        </div>

        {/* Dados de Golpe */}
        <div className="card" style={{ textAlign: 'center' }}>
          <label>DADOS DE GOLPE</label>
          <div style={{ fontSize: '1.6rem', fontFamily: 'var(--font-mono)', fontWeight: 800, color: '#ffffff' }}>
            {character.hitDiceTotal - character.hitDiceUsed} / {character.hitDiceTotal}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-gold)' }}>Tipo: {character.hitDie}</span>
        </div>
      </div>

      {/* Tabs de Contenido */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-gold)', paddingBottom: '0.5rem' }}>
        <button className={`nav-tab-btn ${activeTab === 'stats' ? 'active' : ''}`} onClick={() => setActiveTab('stats')}>
          <Shield size={16} /> Atributos & Habilidades
        </button>
        <button className={`nav-tab-btn ${activeTab === 'spells' ? 'active' : ''}`} onClick={() => setActiveTab('spells')}>
          <Sparkles size={16} /> Conjuros & Magia
        </button>
        <button className={`nav-tab-btn ${activeTab === 'inventory' ? 'active' : ''}`} onClick={() => setActiveTab('inventory')}>
          <Backpack size={16} /> Armas & Equipo
        </button>
        <button className={`nav-tab-btn ${activeTab === 'features' ? 'active' : ''}`} onClick={() => setActiveTab('features')}>
          <BookOpen size={16} /> Rasgos & Dotes
        </button>
      </div>

      {/* TAB 1: ATRIBUTOS & HABILIDADES */}
      {activeTab === 'stats' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '1.5rem' }}>
          {/* Columna de Atributos */}
          <div>
            <h2 style={{ fontSize: '1.2rem' }}>Puntuaciones de Característica</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.8rem' }}>
              {(Object.keys(character.abilities) as AbilityName[]).map(ab => {
                const score = character.abilities[ab];
                const mod = getAbilityModifier(score);
                const isSavingProf = character.savingThrows[ab];
                const savingMod = mod + (isSavingProf ? profBonus : 0);

                return (
                  <div key={ab} className="card" style={{ textAlign: 'center', padding: '1rem 0.6rem' }}>
                    <div style={{ fontFamily: 'var(--font-title)', fontSize: '0.9rem', color: 'var(--text-gold)', fontWeight: 700, textTransform: 'uppercase' }}>
                      {ab === 'str' ? 'Fuerza' : ab === 'dex' ? 'Destreza' : ab === 'con' ? 'Constitución' : ab === 'int' ? 'Inteligencia' : ab === 'wis' ? 'Sabiduría' : 'Carisma'}
                    </div>

                    <div style={{ fontSize: '2.2rem', fontFamily: 'var(--font-mono)', fontWeight: 900, color: '#ffffff', margin: '0.2rem 0' }}>
                      {formatModifier(mod)}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.8rem' }}>
                      Puntuación: <strong>{score}</strong>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                      <button className="btn btn-secondary btn-sm" onClick={() => rollAbilityCheck(ab)} style={{ fontSize: '0.75rem' }}>
                        Prueba {formatModifier(mod)}
                      </button>
                      <button 
                        className={`btn btn-sm ${isSavingProf ? 'btn-primary' : 'btn-secondary'}`} 
                        onClick={() => rollSavingThrow(ab)}
                        style={{ fontSize: '0.75rem' }}
                      >
                        Salvación {formatModifier(savingMod)} {isSavingProf ? '★' : ''}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Columna de Habilidades */}
          <div>
            <h2 style={{ fontSize: '1.2rem' }}>Habilidades (D&D 2024)</h2>
            <div className="card" style={{ padding: '0.8rem' }}>
              <div style={{ maxHeight: '520px', overflowY: 'auto' }}>
                {ALL_SKILLS.map(skill => {
                  const skillData = character.skills[skill.name] || { proficient: false, expertise: false };
                  const baseMod = getAbilityModifier(character.abilities[skill.ability]);
                  const skillBonus = skillData.expertise ? profBonus * 2 : skillData.proficient ? profBonus : 0;
                  const totalMod = baseMod + skillBonus;
                  const hasIntuition = checkHasIntuitionDie(character, skill.name);

                  return (
                    <div 
                      key={skill.id}
                      style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center', 
                        padding: '0.5rem 0.6rem',
                        borderBottom: '1px solid rgba(255,255,255,0.05)',
                        background: skillData.proficient ? 'rgba(212, 175, 55, 0.06)' : 'transparent'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <span style={{ 
                          width: '10px', 
                          height: '10px', 
                          borderRadius: '50%', 
                          background: skillData.expertise ? 'var(--gold-hover)' : skillData.proficient ? 'var(--gold-primary)' : 'rgba(255,255,255,0.15)',
                          display: 'inline-block'
                        }} />
                        <span style={{ fontSize: '0.92rem', color: skillData.proficient ? '#ffffff' : 'var(--text-muted)' }}>
                          {skill.name}
                        </span>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                          ({skill.ability})
                        </span>
                        {hasIntuition && (
                          <span className="badge badge-sapphire" style={{ fontSize: '0.68rem', padding: '0.1rem 0.4rem', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                            <Zap size={10} /> +1d4 Intuición
                          </span>
                        )}
                      </div>

                      <button 
                        className="btn btn-secondary btn-sm" 
                        onClick={() => rollSkillCheck(skill.name, skill.ability)}
                        style={{ fontFamily: 'var(--font-mono)', minWidth: '45px', padding: '0.2rem 0.5rem' }}
                        title={hasIntuition ? 'Incluye +1d4 dado de intuición por Marca del Dragón' : undefined}
                      >
                        {formatModifier(totalMod)} {hasIntuition ? '+1d4' : ''}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CONJUROS & MAGIA */}
      {activeTab === 'spells' && (
        <div>
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', textAlign: 'center' }}>
              <div>
                <label>Aptitud Mágica</label>
                <div style={{ fontSize: '1.4rem', fontFamily: 'var(--font-title)', color: 'var(--gold-hover)', textTransform: 'uppercase' }}>
                  {character.spellcastingAbility ? character.spellcastingAbility : 'Ninguna'}
                </div>
              </div>
              <div>
                <label>CD Salvación de Conjuros</label>
                <div style={{ fontSize: '1.8rem', fontFamily: 'var(--font-mono)', fontWeight: 800, color: '#ffffff' }}>
                  {character.spellSaveDc || (character.spellcastingAbility ? 8 + profBonus + getAbilityModifier(character.abilities[character.spellcastingAbility]) : '-')}
                </div>
              </div>
              <div>
                <label>Bono de Ataque de Conjuro</label>
                <div style={{ fontSize: '1.8rem', fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--sapphire-mana)' }}>
                  {character.spellAttackBonus ? formatModifier(character.spellAttackBonus) : (character.spellcastingAbility ? formatModifier(profBonus + getAbilityModifier(character.abilities[character.spellcastingAbility])) : '-')}
                </div>
              </div>
            </div>
          </div>

          {/* Espacios de Conjuro */}
          <h2 style={{ fontSize: '1.2rem' }}>Espacios de Conjuro</h2>
          {character.spellSlots && character.spellSlots.length > 0 ? (
            <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
              {character.spellSlots.map(slot => (
                <div key={slot.level} className="card" style={{ padding: '0.8rem 1.2rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-gold)', fontWeight: 600 }}>Nivel {slot.level}</div>
                  <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'center', margin: '0.5rem 0' }}>
                    {Array.from({ length: slot.total }).map((_, i) => (
                      <input 
                        key={i} 
                        type="checkbox" 
                        checked={i < (slot.total - slot.used)}
                        onChange={() => {
                          const newSlots = character.spellSlots.map(s => {
                            if (s.level === slot.level) {
                              const newUsed = i < (slot.total - slot.used) ? s.used + 1 : Math.max(0, s.used - 1);
                              return { ...s, used: newUsed };
                            }
                            return s;
                          });
                          onUpdate({ ...character, spellSlots: newSlots });
                        }}
                        style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                      />
                    ))}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {slot.total - slot.used} / {slot.total} disp.
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Esta clase no posee espacios de conjuro propios a nivel 1.</p>
          )}

          {/* Lista de Conjuros Conocidos */}
          <h2 style={{ fontSize: '1.2rem' }}>Grimorio de Conjuros</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
            {character.knownSpells && character.knownSpells.length > 0 ? (
              character.knownSpells.map(spell => (
                <div key={spell.id} className="card" style={{ borderLeft: '3px solid var(--amethyst-magic)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                    <h3 style={{ fontSize: '1.05rem', margin: 0, color: '#ffffff' }}>{spell.name}</h3>
                    <span className="badge badge-sapphire">{spell.level === 0 ? 'Truco' : `Nvl ${spell.level}`}</span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-gold)', marginBottom: '0.4rem' }}>
                    {spell.school} • {spell.castingTime} • Alcance: {spell.range}
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                    {spell.description}
                  </p>
                </div>
              ))
            ) : (
              <p style={{ color: 'var(--text-muted)' }}>No hay conjuros añadidos aún.</p>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: ARMAS & EQUIPO */}
      {activeTab === 'inventory' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
              <h2 style={{ fontSize: '1.2rem', margin: 0 }}>Ataques & Armas</h2>
              <span className="badge badge-gold" title="Reglas 2024: Las armas marciales desbloquean propiedades tácticas">
                Maestría con Armas 2024
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              {character.weapons && character.weapons.map(weapon => {
                const masteryProperty = weapon.name.toLowerCase().includes('larga') ? 'Rozar (Graze)' :
                                       weapon.name.toLowerCase().includes('jabalina') ? 'Ralentizar (Slow)' :
                                       weapon.name.toLowerCase().includes('daga') ? 'Pinchar (Nick)' :
                                       weapon.name.toLowerCase().includes('arco') ? 'Incomodar (Vex)' :
                                       weapon.name.toLowerCase().includes('espadón') ? 'Chocar (Cleave)' : 'Derribar (Topple)';
                return (
                  <div key={weapon.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.8rem 1rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <h4 style={{ margin: 0, color: 'var(--text-main)', fontSize: '1.05rem' }}>{weapon.name}</h4>
                        <span className="badge badge-sapphire" style={{ fontSize: '0.72rem' }}>{masteryProperty}</span>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-gold)', marginTop: '0.2rem' }}>
                        Daño: {weapon.damageDice} ({weapon.damageType}) {weapon.range ? `• Alcance: ${weapon.range}` : ''}
                      </div>
                    </div>
                    <button 
                      className="btn btn-primary btn-sm" 
                      onClick={() => rollWeaponAttack(weapon.name, weapon.attackBonus, weapon.damageDice)}
                    >
                      <Sword size={14} /> Atacar ({formatModifier(weapon.attackBonus)})
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Ranuras de Armonización Mágica (Attunement 3 max) */}
            <div className="card" style={{ marginTop: '1.2rem', padding: '0.8rem 1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>
                  Armonización Mágica (Attunement):
                </span>
                <span className="badge badge-gold">Máximo 3 Objetos</span>
              </div>
              <div style={{ display: 'flex', gap: '0.6rem', marginTop: '0.5rem' }}>
                {[1, 2, 3].map(slotNum => (
                  <div key={slotNum} style={{ flex: 1, background: 'rgba(0,0,0,0.04)', border: '1px solid var(--border-gold)', borderRadius: 'var(--radius-sm)', padding: '0.4rem', textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Ranura {slotNum}: <span style={{ color: 'var(--gold-primary)', fontWeight: 700 }}>Libre</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Prótesis Arcanas & Componentes Forjados Equipados */}
            {character.prosthetics && character.prosthetics.length > 0 && (
              <div className="card" style={{ marginTop: '1.2rem', padding: '1rem', borderLeft: '3px solid #0284c7' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Zap size={16} style={{ color: '#0284c7' }} />
                    <h4 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-main)' }}>
                      Prótesis Arcanas & Componentes Forjados Equipados
                    </h4>
                  </div>
                  <span className="badge badge-sapphire">{character.prosthetics.length} Activa(s)</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {character.prosthetics.map(p => (
                    <div key={p.id} style={{ padding: '0.7rem 0.9rem', background: 'var(--bg-main)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.6rem' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <strong style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>{p.name}</strong>
                          <span className="badge badge-gold" style={{ fontSize: '0.68rem' }}>{p.rarity}</span>
                        </div>
                        <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.76rem', color: 'var(--text-dim)' }}>
                          {p.tagline}
                        </p>
                      </div>
                      <button
                        className="btn btn-secondary btn-sm"
                        style={{ fontSize: '0.72rem', color: 'var(--accent-crimson)', padding: '0.2rem 0.5rem', flexShrink: 0 }}
                        onClick={() => {
                          const updated = removeProstheticFromCharacter(character, p.id);
                          onUpdate(updated);
                          notifyRoll(`Prótesis "${p.name}" desequipada.`);
                        }}
                      >
                        <Trash2 size={12} /> Desequipar
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Monedero */}
            <h2 style={{ fontSize: '1.2rem', marginTop: '1.5rem' }}>Riqueza & Monedas</h2>
            <div className="card" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.5rem', textAlign: 'center' }}>
              <div>
                <label>Cobre (PC)</label>
                <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{character.coins.cp}</div>
              </div>
              <div>
                <label>Plata (PP)</label>
                <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{character.coins.sp}</div>
              </div>
              <div>
                <label>Electro (PE)</label>
                <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{character.coins.ep}</div>
              </div>
              <div>
                <label style={{ color: 'var(--gold-hover)' }}>Oro (PO)</label>
                <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--gold-primary)' }}>{character.coins.gp}</div>
              </div>
              <div>
                <label>Platino (PT)</label>
                <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{character.coins.pp}</div>
              </div>
            </div>
          </div>

          <div>
            <h2 style={{ fontSize: '1.2rem' }}>Inventario de Equipo</h2>
            <div className="card" style={{ padding: '0.8rem' }}>
              <div style={{ maxHeight: '450px', overflowY: 'auto' }}>
                {character.inventory.map(item => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0.6rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <span>{item.name}</span>
                    <span className="badge">x{item.quantity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: RASGOS & DOTES */}
      {activeTab === 'features' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Patrono de Grupo de la Campaña */}
          {(() => {
            if (!activeCampaignPatron) return null;
            const patronDef = GROUP_PATRONS_DATA.find(p => p.id === activeCampaignPatron.patronId);
            if (!patronDef) return null;
            return (
              <div className="card" style={{ padding: '1.2rem', borderLeft: '4px solid #b45309', background: 'var(--bg-surface)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Crown size={20} style={{ color: '#b45309' }} />
                    <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-main)' }}>
                      Patrón de Grupo Activo: {patronDef.name}
                    </h3>
                  </div>
                  <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                    <span className="badge badge-gold">{patronDef.typeName}</span>
                    <span className="badge badge-sapphire">{patronDef.sourceBook}</span>
                  </div>
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-dim)', fontStyle: 'italic', margin: '0 0 0.8rem 0' }}>
                  "{patronDef.tagline}"
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '0.6rem' }}>
                  {patronDef.perks.map((perk, i) => (
                    <div key={i} style={{ padding: '0.6rem 0.8rem', background: 'var(--bg-main)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                      <strong style={{ fontSize: '0.82rem', color: 'var(--text-main)', display: 'block' }}>★ {perk.title}</strong>
                      <span style={{ fontSize: '0.76rem', color: 'var(--text-dim)' }}>{perk.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}

          {/* Sección de Dotes 2024 & Bendiciones Épicas */}
          <div className="card" style={{ padding: '1.2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.6rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <h2 style={{ fontSize: '1.25rem', margin: 0, color: 'var(--accent-gold)' }}>
                    Dotes 2024 & Bendiciones Épicas
                  </h2>
                  <span className="badge badge-gold">
                    {character.feats?.length || 0} Aprendidas
                  </span>
                </div>
                <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                  Dotes de Origen, Generales (+1 característica) y Bendiciones Épicas (hasta máx. 30) del sistema D&D 2024.
                </p>
              </div>

              <button 
                className="btn btn-primary btn-sm"
                onClick={() => setShowFeatsModal(true)}
              >
                <Plus size={15} /> Añadir Dote 2024 / Bendición Épica
              </button>
            </div>

            {/* Listado de Dotes Aprendidas */}
            {character.feats && character.feats.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '0.8rem' }}>
                {character.feats.map((f, idx) => (
                  <div 
                    key={idx}
                    style={{
                      padding: '0.9rem',
                      background: 'var(--bg-main)',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-subtle)',
                      borderLeft: f.category === 'epic_boon' ? '3px solid #9d4edd' : f.category === 'general' ? '3px solid var(--accent-azure)' : '3px solid var(--accent-gold)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: '0.5rem'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                        <strong style={{ fontSize: '0.95rem', color: 'var(--text-main)' }}>{f.name}</strong>
                        <span className="badge badge-gold" style={{ fontSize: '0.68rem' }}>
                          {f.category === 'origin' ? 'Origen (Nvl 1)' : f.category === 'general' ? 'General' : 'Bendición Épica'}
                        </span>
                      </div>

                      {f.chosenStat && (
                        <div style={{ fontSize: '0.78rem', color: 'var(--accent-gold)', fontWeight: 600, marginTop: '0.2rem' }}>
                          ⭐ Aumento: +1 a {f.chosenStat.toUpperCase()}
                        </div>
                      )}

                      {f.customNotes && (
                        <p style={{ margin: '0.3rem 0 0 0', fontSize: '0.78rem', color: 'var(--text-dim)', lineHeight: 1.35 }}>
                          {f.customNotes}
                        </p>
                      )}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '0.4rem', borderTop: '1px solid var(--border-subtle)' }}>
                      <button 
                        className="btn btn-secondary btn-sm"
                        onClick={() => {
                          const updated = removeFeatFromCharacter(character, f.featId);
                          onUpdate(updated);
                          notifyRoll(`Dote "${f.name}" eliminada y sus bonificadores revertidos.`);
                        }}
                        style={{ fontSize: '0.72rem', padding: '0.2rem 0.5rem', color: 'var(--accent-crimson)' }}
                      >
                        <Trash2 size={12} /> Olvidar Dote
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-dim)', background: 'var(--bg-main)', borderRadius: 'var(--radius-sm)' }}>
                <p style={{ margin: '0 0 0.6rem 0', fontSize: '0.9rem' }}>Aún no has registrado dotes para este aventurero.</p>
                <button className="btn btn-secondary btn-sm" onClick={() => setShowFeatsModal(true)}>
                  <Plus size={14} /> Explorar Catálogo de Dotes 2024
                </button>
              </div>
            )}
          </div>

          {/* Dones Oscuros de Ravenloft */}
          {character.darkGifts && character.darkGifts.length > 0 && (
            <div className="card" style={{ padding: '1.2rem', borderLeft: '4px solid #7b2cbf' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Ghost size={18} style={{ color: '#9d4edd' }} />
                  <h3 style={{ margin: 0, fontSize: '1.15rem', color: 'var(--text-main)' }}>
                    Dones Oscuros Sellados (Pactos de Ravenloft)
                  </h3>
                </div>
                <span className="badge badge-crimson">{character.darkGifts.length} Activo(s)</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                {character.darkGifts.map(gift => (
                  <div 
                    key={gift.giftId}
                    style={{
                      padding: '0.9rem',
                      background: 'var(--bg-main)',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-subtle)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.5rem'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <strong style={{ fontSize: '1rem', color: 'var(--text-main)' }}>{gift.name}</strong>
                      <button 
                        className="btn btn-secondary btn-sm"
                        style={{ fontSize: '0.72rem', color: 'var(--accent-crimson)', padding: '0.2rem 0.5rem' }}
                        onClick={() => {
                          const updated = removeDarkGiftFromCharacter(character, gift.giftId);
                          onUpdate(updated);
                          notifyRoll(`Don Oscuro "${gift.name}" purificado del alma de ${character.name}.`);
                        }}
                      >
                        <Trash2 size={12} /> Purificar Don
                      </button>
                    </div>

                    <div style={{ fontSize: '0.8rem', color: 'var(--accent-emerald)' }}>
                      <strong>Bendición:</strong> {gift.boons.join(' ')}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--accent-crimson)' }}>
                      <strong>Maldición:</strong> {gift.curses.join(' ')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Marca del Dragón de Eberron */}
          {character.dragonmark && (
            <div className="card" style={{ padding: '1.2rem', borderLeft: '4px solid #0284c7', background: 'var(--bg-surface)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Zap size={20} style={{ color: '#0284c7' }} />
                  <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-main)' }}>
                    {character.dragonmark.name}
                  </h3>
                </div>
                <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                  <span className="badge badge-sapphire">{character.dragonmark.houseName}</span>
                  <button
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '0.72rem', color: 'var(--accent-crimson)', padding: '0.2rem 0.5rem' }}
                    onClick={() => {
                      const updated = removeDragonmarkFromCharacter(character);
                      onUpdate(updated);
                      notifyRoll(`Marca del Dragón retirada de ${character.name}.`);
                    }}
                  >
                    <Trash2 size={12} /> Retirar Marca
                  </button>
                </div>
              </div>
              <div style={{ padding: '0.6rem 0.8rem', background: 'var(--bg-main)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '0.82rem', color: 'var(--accent-azure)', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>
                  ★ Dado de Intuición (+1d4) activo en:
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {character.dragonmark.intuitionSkills.map((sk, idx) => (
                    <span key={idx} className="badge badge-sapphire" style={{ fontSize: '0.72rem' }}>
                      +{sk.toUpperCase()}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Rasgos de Clase y Especie */}
          <div>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '0.8rem' }}>Rasgos de Clase y Especie</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              {character.features && character.features.map((feat, i) => (
                <div key={i} className="card" style={{ borderLeft: '3px solid var(--gold-primary)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                    <h3 style={{ fontSize: '1.05rem', margin: 0, color: 'var(--text-main)' }}>{feat.title}</h3>
                    <span className="badge badge-gold">{feat.source}</span>
                  </div>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-dim)', margin: 0 }}>{feat.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal Flotante de Compendio de Dotes 2024 */}
      {showFeatsModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(3px)',
          zIndex: 10000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem'
        }}>
          <div className="card" style={{ maxWidth: '1100px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.6rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Zap size={20} style={{ color: 'var(--accent-gold)' }} />
                <h2 style={{ margin: 0, fontSize: '1.35rem', color: 'var(--accent-gold)' }}>
                  Añadir Dote para {character.name} (Nvl {character.level})
                </h2>
              </div>
              <button className="btn btn-secondary btn-sm" onClick={() => setShowFeatsModal(false)}>
                <X size={16} /> Cerrar
              </button>
            </div>

            <FeatsCompendium 
              activeCharacter={character}
              onUpdateCharacter={(updated) => {
                onUpdate(updated);
                notifyRoll(`¡Dote aprendida y ficha actualizada!`);
              }}
            />
          </div>
        </div>
      )}

      {/* Modal Guiado de Subida de Nivel (Reglas 2024) */}
      {showLevelUpModal && (
        <LevelUpModal
          isOpen={showLevelUpModal}
          onClose={() => setShowLevelUpModal(false)}
          character={character}
          onConfirmLevelUp={(updated) => {
            onUpdate(updated);
            notifyRoll(`¡${updated.name} ha ascendido a Nivel ${updated.level}!`);
          }}
        />
      )}
    </div>
  );
};
