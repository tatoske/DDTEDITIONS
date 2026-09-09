import React, { useState } from 'react';
import { Sidekick, SidekickClassType, SidekickRole, Monster, AbilityName, Character } from '../../types/dnd';
import { SIDEKICK_PRESETS } from '../../data/sidekicksData';
import { 
  getSidekickProficiency, 
  scaleSidekickToLevel, 
  calculateSidekickHp 
} from '../../utils/sidekickMath';
import { getAbilityModifier, formatModifier, rollDice, rollD20WithAdvantage } from '../../utils/dndMath';
import { 
  Shield, 
  Sword, 
  Heart, 
  Sparkles, 
  Flame, 
  Zap, 
  Plus, 
  Trash2, 
  Copy, 
  Download, 
  Upload, 
  Swords, 
  RotateCcw, 
  Dices, 
  Footprints, 
  Key, 
  Check, 
  X, 
  ChevronRight,
  BookOpen
} from 'lucide-react';

interface SidekicksManagerProps {
  sidekicks: Sidekick[];
  onUpdateSidekicks: (sidekicks: Sidekick[]) => void;
  onSendToEncounter: (monster: Monster) => void;
  onOpenDiceRoller?: () => void;
  activeHero?: Character;
}

export const SidekicksManager: React.FC<SidekicksManagerProps> = ({
  sidekicks,
  onUpdateSidekicks,
  onSendToEncounter,
  onOpenDiceRoller,
  activeHero
}) => {
  const [activeSidekickId, setActiveSidekickId] = useState<string>(
    sidekicks.length > 0 ? sidekicks[0].id : SIDEKICK_PRESETS[0].id
  );
  const [showPresetModal, setShowPresetModal] = useState<boolean>(false);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [rollToast, setRollToast] = useState<string | null>(null);

  // Formulario de creación personalizada
  const [customForm, setCustomForm] = useState<{
    name: string;
    creatureType: string;
    size: 'Pequeño' | 'Mediano' | 'Grande';
    sidekickClass: SidekickClassType;
    role: SidekickRole;
    hitDie: string;
    baseHp: number;
    armorClass: number;
    speed: number;
    str: number;
    dex: number;
    con: number;
    int: number;
    wis: number;
    cha: number;
    attackName: string;
    attackDamage: string;
    attackType: string;
  }>({
    name: 'Nuevo Acompañante',
    creatureType: 'Compañero Fiel',
    size: 'Mediano',
    sidekickClass: 'warrior',
    role: 'defender',
    hitDie: 'd8',
    baseHp: 12,
    armorClass: 14,
    speed: 9,
    str: 14,
    dex: 12,
    con: 14,
    int: 8,
    wis: 12,
    cha: 10,
    attackName: 'Golpe Marcial',
    attackDamage: '1d8 + 2',
    attackType: 'Cortante'
  });

  const activeSidekick = sidekicks.find(s => s.id === activeSidekickId) || sidekicks[0] || SIDEKICK_PRESETS[0];

  const notify = (msg: string) => {
    setRollToast(msg);
    setTimeout(() => setRollToast(null), 5500);
  };

  // Guardar cambios en el escudero actual
  const updateCurrentSidekick = (updated: Sidekick) => {
    const list = sidekicks.map(s => s.id === updated.id ? updated : s);
    onUpdateSidekicks(list);
  };

  // Cambiar nivel del escudero interactivo (1-20)
  const handleLevelChange = (newLevel: number) => {
    if (!activeSidekick) return;
    const clamped = Math.max(1, Math.min(20, newLevel));
    const scaled = scaleSidekickToLevel(activeSidekick, clamped);
    updateCurrentSidekick(scaled);
    notify(`¡${scaled.name} ahora es Nivel ${clamped}! PG, competencia y rasgos recalculados.`);
  };

  // Modificar vida rápida
  const handleModifyHp = (delta: number) => {
    if (!activeSidekick) return;
    const newHp = Math.max(0, Math.min(activeSidekick.maxHp, activeSidekick.currentHp + delta));
    updateCurrentSidekick({ ...activeSidekick, currentHp: newHp });
    notify(`${activeSidekick.name}: PG modificados en ${delta > 0 ? '+' : ''}${delta} -> ${newHp}/${activeSidekick.maxHp} PG`);
  };

  // Descanso largo para el escudero
  const handleLongRest = () => {
    if (!activeSidekick) return;
    let updatedSlots = activeSidekick.spellcasting?.slots;
    if (updatedSlots) {
      const resetSlots: { [lvl: number]: { total: number; used: number } } = {};
      Object.entries(updatedSlots).forEach(([lvl, data]) => {
        resetSlots[Number(lvl)] = { total: data.total, used: 0 };
      });
      updatedSlots = resetSlots;
    }

    const rested: Sidekick = {
      ...activeSidekick,
      currentHp: activeSidekick.maxHp,
      tempHp: 0,
      secondWindUsed: false,
      spellcasting: activeSidekick.spellcasting ? {
        ...activeSidekick.spellcasting,
        slots: updatedSlots || {}
      } : undefined
    };
    updateCurrentSidekick(rested);
    notify(`🌙 Descanso Largo completado para ${activeSidekick.name}: PG restaurados al 100% y habilidades reiniciadas.`);
  };

  // Tirar Segundo Aire (Guerrero)
  const handleSecondWind = () => {
    if (!activeSidekick) return;
    if (activeSidekick.secondWindUsed) {
      notify(`⚠️ ${activeSidekick.name} ya utilizó su Segundo Aire. Requiere un descanso corto o largo.`);
      return;
    }
    const roll = rollDice(`1d10 + ${activeSidekick.level}`);
    const healedHp = Math.min(activeSidekick.maxHp, activeSidekick.currentHp + roll.total);
    const recovered = healedHp - activeSidekick.currentHp;
    updateCurrentSidekick({
      ...activeSidekick,
      currentHp: healedHp,
      secondWindUsed: true
    });
    notify(`🛡️ ¡Segundo Aire de ${activeSidekick.name}! Tirada [${roll.rolls[0]}] + ${activeSidekick.level} = +${roll.total} PG curados (${healedHp}/${activeSidekick.maxHp}).`);
  };

  // Tirar Ataque
  const handleAttackRoll = (attack: Sidekick['attacks'][0]) => {
    if (!activeSidekick) return;
    // Guerrero nivel 3+ tiene crítico mejorado con 19-20
    const critThreshold = (activeSidekick.sidekickClass === 'warrior' && activeSidekick.level >= 3) ? 19 : 20;
    const d20 = rollD20WithAdvantage('normal', attack.bonus);
    const natural = d20.rolls[0];
    const isCrit = natural >= critThreshold;
    const isFumble = natural === 1;

    let critText = '';
    if (isCrit) critText = ' 💥 ¡GOLPE CRÍTICO! (Dado ' + natural + ')';
    if (isFumble) critText = ' ⚠️ ¡PIFIA! (Dado 1)';

    notify(`⚔️ ${activeSidekick.name} ataca con ${attack.name}: d20 [${natural}] + ${attack.bonus} = ${d20.total} al impacto.${critText}`);
  };

  // Tirar Daño
  const handleDamageRoll = (attack: Sidekick['attacks'][0]) => {
    if (!activeSidekick) return;
    const dmg = rollDice(attack.damageDice);
    notify(`💥 Daño de ${attack.name}: ${dmg.total} (${dmg.expression}) [${dmg.rolls.join(', ')}] de daño ${attack.damageType}.`);
  };

  // Gastar / recuperar espacio de conjuro
  const handleToggleSpellSlot = (slotLevel: number, slotIndex: number) => {
    if (!activeSidekick || !activeSidekick.spellcasting) return;
    const slots = { ...activeSidekick.spellcasting.slots };
    const currentData = slots[slotLevel];
    if (!currentData) return;

    const currentlyUsed = currentData.used;
    // Si el slotIndex < currentlyUsed, desmarcarlo
    const newUsed = slotIndex < currentlyUsed ? slotIndex : slotIndex + 1;
    slots[slotLevel] = {
      ...currentData,
      used: Math.max(0, Math.min(currentData.total, newUsed))
    };

    updateCurrentSidekick({
      ...activeSidekick,
      spellcasting: {
        ...activeSidekick.spellcasting,
        slots
      }
    });
  };

  // Enviar escudero al encuentro de combate
  const handleSendSidekickToCombat = () => {
    if (!activeSidekick) return;
    const savingThrowsList = Object.entries(activeSidekick.savingThrows)
      .filter(([_, v]) => v)
      .map(([k]) => `${k.toUpperCase()} +${getSidekickProficiency(activeSidekick.level) + getAbilityModifier(activeSidekick.abilities[k as AbilityName])}`)
      .join(', ');

    const convertedMonster: Monster = {
      id: `sidekick-${activeSidekick.id}-${Date.now()}`,
      name: `${activeSidekick.name} (Escudero Nvl ${activeSidekick.level})`,
      size: activeSidekick.size,
      type: `Aliado de la Party (${activeSidekick.creatureType})`,
      alignment: 'Aliado Leal',
      ac: activeSidekick.armorClass,
      acType: activeSidekick.armorType || 'Armadura',
      hp: activeSidekick.maxHp,
      hitDice: `${activeSidekick.level}${activeSidekick.hitDie}`,
      speed: `${activeSidekick.speed} m`,
      abilities: activeSidekick.abilities,
      cr: '1/2',
      xp: 100,
      savingThrows: savingThrowsList || undefined,
      skills: activeSidekick.skills.join(', '),
      senses: `Percepción Pasiva ${activeSidekick.passivePerception}`,
      languages: 'Común y comprende órdenes de su mentor',
      traits: activeSidekick.features.map(f => ({ name: f.name, desc: f.description })),
      actions: activeSidekick.attacks.map(a => ({
        name: a.name,
        desc: `${a.type === 'melee' ? 'Ataque cuerpo a cuerpo' : 'Ataque a distancia'}: +${a.bonus} al impacto, alcance ${a.reachOrRange}. Impacto: ${a.damageDice} daño ${a.damageType}. ${a.notes || ''}`,
        attackBonus: a.bonus,
        damageDice: a.damageDice,
        damageType: a.damageType
      })),
      sourceBook: 'El caldero de Tasha'
    };

    onSendToEncounter(convertedMonster);
    notify(`⚔️ ¡${activeSidekick.name} ha sido enviado al Rastreador de Encuentros de Combate!`);
  };

  // Añadir un preset
  const handleSelectPreset = (preset: Sidekick) => {
    const newSidekick: Sidekick = {
      ...preset,
      id: `sidekick-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const newList = [...sidekicks, newSidekick];
    onUpdateSidekicks(newList);
    setActiveSidekickId(newSidekick.id);
    setShowPresetModal(false);
    notify(`✨ ¡${newSidekick.name} (${newSidekick.creatureType}) añadido a tus Escuderos!`);
  };

  // Crear criatura personalizada
  const handleCreateCustom = (e: React.FormEvent) => {
    e.preventDefault();
    const prof = 2;
    const conMod = getAbilityModifier(customForm.con);
    const strMod = getAbilityModifier(customForm.str);
    const dexMod = getAbilityModifier(customForm.dex);
    const atkMod = customForm.attackType === 'melee' ? strMod : dexMod;

    const newSidekick: Sidekick = {
      id: `sidekick-custom-${Date.now()}`,
      name: customForm.name,
      creatureType: customForm.creatureType,
      size: customForm.size,
      sidekickClass: customForm.sidekickClass,
      role: customForm.role,
      level: 1,
      armorClass: customForm.armorClass,
      speed: customForm.speed,
      maxHp: customForm.baseHp,
      currentHp: customForm.baseHp,
      tempHp: 0,
      hitDie: customForm.hitDie,
      abilities: {
        str: customForm.str,
        dex: customForm.dex,
        con: customForm.con,
        int: customForm.int,
        wis: customForm.wis,
        cha: customForm.cha
      },
      savingThrows: {
        [customForm.sidekickClass === 'warrior' ? 'str' : customForm.sidekickClass === 'expert' ? 'dex' : 'int']: true,
        [customForm.sidekickClass === 'warrior' ? 'con' : customForm.sidekickClass === 'expert' ? 'int' : 'wis']: true
      },
      skills: ['Percepción (+2)', 'Atletismo (+2)'],
      passivePerception: 10 + getAbilityModifier(customForm.wis),
      attacks: [
        {
          id: 'atk-custom-1',
          name: customForm.attackName,
          type: 'melee',
          bonus: atkMod + prof + (customForm.role === 'attacker' ? 2 : 0),
          reachOrRange: '1.5 m (5 pies)',
          damageDice: customForm.attackDamage,
          damageType: customForm.attackType
        }
      ],
      features: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Escalar al nivel 1 para inicializar rasgos de clase
    const scaled = scaleSidekickToLevel(newSidekick, 1);
    const newList = [...sidekicks, scaled];
    onUpdateSidekicks(newList);
    setActiveSidekickId(scaled.id);
    setShowCreateModal(false);
    notify(`✨ ¡Nuevo Escudero personalizado "${scaled.name}" creado con éxito!`);
  };

  // Eliminar escudero
  const handleDeleteSidekick = (id: string) => {
    if (sidekicks.length <= 1) {
      alert('Debes mantener al menos un escudero o plantilla.');
      return;
    }
    const filtered = sidekicks.filter(s => s.id !== id);
    onUpdateSidekicks(filtered);
    setActiveSidekickId(filtered[0].id);
    notify('Escudero eliminado de la lista.');
  };

  // Exportar a JSON
  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(sidekicks, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `sidekicks_dnd_t_editions_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    notify('💾 Lista de Escuderos exportada en archivo JSON.');
  };

  // Importar JSON
  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (Array.isArray(parsed) && parsed.length > 0) {
            onUpdateSidekicks(parsed);
            setActiveSidekickId(parsed[0].id);
            notify(`✅ ¡${parsed.length} Escuderos importados correctamente!`);
          }
        } catch (err) {
          alert('Error al leer el archivo JSON de Escuderos.');
        }
      };
    }
  };

  const hpPercent = Math.round((activeSidekick.currentHp / activeSidekick.maxHp) * 100);
  const hpColor = hpPercent > 50 ? 'var(--accent-emerald)' : hpPercent > 20 ? 'var(--accent-amber)' : 'var(--accent-crimson)';

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', paddingBottom: '3rem' }}>
      {/* Notificación Toast de Tiradas */}
      {rollToast && (
        <div style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          background: 'var(--bg-surface-elevated)',
          border: '1px solid var(--accent-gold)',
          borderRadius: 'var(--radius-md)',
          padding: '1rem 1.4rem',
          boxShadow: 'var(--shadow-xl)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: '0.8rem',
          maxWidth: '460px',
          animation: 'fadeIn 0.2s ease-in'
        }}>
          <Dices size={24} style={{ color: 'var(--accent-gold)', flexShrink: 0 }} />
          <div style={{ fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: 1.4 }}>
            {rollToast}
          </div>
        </div>
      )}

      {/* Encabezado Principal */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '1.5rem',
        paddingBottom: '1rem',
        borderBottom: '1px solid var(--border-subtle)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <h1 style={{ margin: 0, fontSize: '1.7rem', color: 'var(--accent-gold)' }}>
              Compañeros y Escuderos (Sidekicks)
            </h1>
            <span className="badge badge-gold" style={{ fontSize: '0.75rem' }}>
              El Caldero de Tasha
            </span>
          </div>
          <p style={{ margin: '0.3rem 0 0 0', color: 'var(--text-dim)', fontSize: '0.88rem' }}>
            Reglas oficiales para crear y gestionar aliados, mascotas y aprendices de combate que suben de nivel (1 al 20) al ritmo de la party.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button 
            className="btn btn-primary btn-sm"
            onClick={() => setShowPresetModal(true)}
          >
            <Plus size={15} /> Plantillas Oficiales de Tasha
          </button>
          <button 
            className="btn btn-secondary btn-sm"
            onClick={() => setShowCreateModal(true)}
          >
            <Sword size={15} /> Criatura Personalizada
          </button>
          <button 
            className="btn btn-secondary btn-sm"
            onClick={handleExportJson}
            title="Exportar Escuderos a JSON"
          >
            <Download size={15} /> Exportar
          </button>
          <label className="btn btn-secondary btn-sm" style={{ cursor: 'pointer', margin: 0 }}>
            <Upload size={15} /> Importar
            <input type="file" accept=".json" onChange={handleImportJson} style={{ display: 'none' }} />
          </label>
        </div>
      </div>

      {/* Selector de Escudero Activo */}
      <div style={{
        display: 'flex',
        gap: '0.6rem',
        overflowX: 'auto',
        paddingBottom: '0.8rem',
        marginBottom: '1.5rem'
      }}>
        {sidekicks.map(sk => {
          const isSelected = sk.id === activeSidekick.id;
          const classColor = 
            sk.sidekickClass === 'warrior' ? 'var(--accent-crimson)' :
            sk.sidekickClass === 'expert' ? 'var(--accent-amber)' : 'var(--accent-azure)';

          return (
            <div
              key={sk.id}
              onClick={() => setActiveSidekickId(sk.id)}
              style={{
                background: isSelected ? 'var(--bg-surface-elevated)' : 'var(--bg-surface)',
                border: isSelected ? `2px solid ${classColor}` : '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '0.6rem 1rem',
                cursor: 'pointer',
                minWidth: '220px',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.3rem',
                transition: 'all 0.15s ease',
                boxShadow: isSelected ? 'var(--shadow-md)' : 'none'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, fontSize: '0.95rem', color: isSelected ? classColor : 'var(--text-main)' }}>
                  {sk.name}
                </span>
                <span className="badge badge-gold" style={{ fontSize: '0.7rem' }}>
                  Nvl {sk.level}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                <span>{sk.creatureType}</span>
                <span style={{ textTransform: 'capitalize', fontWeight: 600 }}>
                  {sk.sidekickClass === 'warrior' ? '⚔️ Guerrero' : sk.sidekickClass === 'expert' ? '🗝️ Experto' : '✨ Prodigio'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Ficha Completa del Escudero Activo */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '1.5rem' }}>
        {/* Columna Izquierda: Estadísticas, Acciones y Combate */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Tarjeta de Encabezado y Nivel */}
          <div className="card" style={{ padding: '1.4rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                  <h2 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--text-main)' }}>
                    {activeSidekick.name}
                  </h2>
                  <span className="badge badge-primary">
                    {activeSidekick.size} • {activeSidekick.creatureType}
                  </span>
                  <span className="badge badge-gold">
                    {activeSidekick.sidekickClass === 'warrior' ? 'Guerrero' : activeSidekick.sidekickClass === 'expert' ? 'Experto' : 'Prodigio Mágico'} 
                    {' (' + (activeSidekick.role === 'attacker' ? 'Atacante' : activeSidekick.role === 'defender' ? 'Defensor' : activeSidekick.role === 'mage' ? 'Mago' : 'Sanador') + ')'}
                  </span>
                </div>
                {activeSidekick.personalityTrait && (
                  <p style={{ margin: '0.4rem 0 0 0', fontStyle: 'italic', fontSize: '0.82rem', color: 'var(--text-dim)' }}>
                    "{activeSidekick.personalityTrait}"
                  </p>
                )}
              </div>

              {/* Botón para enviar a combate */}
              <button 
                className="btn btn-primary"
                onClick={handleSendSidekickToCombat}
                style={{ borderRadius: 'var(--radius-full)', padding: '0.5rem 1.1rem' }}
              >
                <Swords size={16} /> Enviar a Encuentro de Combate
              </button>
            </div>

            {/* Stepper de Nivel (1 al 20) */}
            <div style={{
              marginTop: '1.2rem',
              padding: '0.8rem 1rem',
              background: 'var(--bg-main)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-dim)' }}>
                  Nivel de Escudero:
                </span>
                <button 
                  className="btn btn-secondary btn-sm"
                  disabled={activeSidekick.level <= 1}
                  onClick={() => handleLevelChange(activeSidekick.level - 1)}
                  style={{ width: '32px', height: '32px', padding: 0 }}
                >
                  -
                </button>
                <span style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--accent-gold)', minWidth: '32px', textAlign: 'center' }}>
                  {activeSidekick.level}
                </span>
                <button 
                  className="btn btn-secondary btn-sm"
                  disabled={activeSidekick.level >= 20}
                  onClick={() => handleLevelChange(activeSidekick.level + 1)}
                  style={{ width: '32px', height: '32px', padding: 0 }}
                >
                  +
                </button>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-dim)' }}>
                  (1 al 20 según El Caldero de Tasha)
                </span>
              </div>

              <div style={{ display: 'flex', gap: '1.2rem', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'block' }}>Bonif. Competencia</span>
                  <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent-gold)' }}>
                    +{getSidekickProficiency(activeSidekick.level)}
                  </span>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'block' }}>Dado de Golpe</span>
                  <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    {activeSidekick.level}{activeSidekick.hitDie}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Barra de Combate Rápido: PG, CA, Velocidad */}
          <div className="card" style={{ padding: '1.2rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
              {/* Armadura */}
              <div style={{ textAlign: 'center', padding: '0.8rem', background: 'var(--bg-main)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem', color: 'var(--accent-gold)', marginBottom: '0.2rem' }}>
                  <Shield size={16} /> <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>CLASE DE ARMADURA</span>
                </div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  {activeSidekick.armorClass}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                  {activeSidekick.armorType || 'Natural'}
                </div>
              </div>

              {/* Velocidad */}
              <div style={{ textAlign: 'center', padding: '0.8rem', background: 'var(--bg-main)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem', color: 'var(--accent-gold)', marginBottom: '0.2rem' }}>
                  <Footprints size={16} /> <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>VELOCIDAD</span>
                </div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  {activeSidekick.speed} m
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                  ({Math.round(activeSidekick.speed * 3.3)} pies)
                </div>
              </div>

              {/* Percepción Pasiva */}
              <div style={{ textAlign: 'center', padding: '0.8rem', background: 'var(--bg-main)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem', color: 'var(--accent-gold)', marginBottom: '0.2rem' }}>
                  <Sparkles size={16} /> <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>PERCEPCIÓN PASIVA</span>
                </div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  {activeSidekick.passivePerception}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                  Sabiduría Pasiva
                </div>
              </div>
            </div>

            {/* Gestor de Puntos de Golpe (PG) */}
            <div style={{ padding: '1rem', background: 'var(--bg-main)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Heart size={18} style={{ color: hpColor }} />
                  <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>PUNTOS DE GOLPE (PG)</span>
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>
                  <span style={{ color: hpColor }}>{activeSidekick.currentHp}</span> / {activeSidekick.maxHp} PG
                  {activeSidekick.tempHp > 0 && (
                    <span style={{ color: 'var(--accent-azure)', fontSize: '0.85rem', marginLeft: '0.4rem' }}>
                      (+{activeSidekick.tempHp} temp)
                    </span>
                  )}
                </div>
              </div>

              {/* Barra de Progreso de PG */}
              <div style={{ height: '8px', background: 'var(--border-subtle)', borderRadius: '4px', overflow: 'hidden', marginBottom: '0.8rem' }}>
                <div style={{ width: `${Math.min(100, Math.max(0, hpPercent))}%`, height: '100%', background: hpColor, transition: 'width 0.3s ease' }} />
              </div>

              {/* Botones de Modificación Rápida */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  <button className="btn btn-secondary btn-sm" onClick={() => handleModifyHp(-5)}>-5 PG</button>
                  <button className="btn btn-secondary btn-sm" onClick={() => handleModifyHp(-1)}>-1 PG</button>
                  <button className="btn btn-secondary btn-sm" onClick={() => handleModifyHp(1)}>+1 PG</button>
                  <button className="btn btn-secondary btn-sm" onClick={() => handleModifyHp(5)}>+5 PG</button>
                </div>
                <button 
                  className="btn btn-secondary btn-sm"
                  onClick={handleLongRest}
                  title="Restaura todos los PG y reinicia habilidades"
                >
                  <RotateCcw size={14} /> Descanso Largo
                </button>
              </div>
            </div>
          </div>

          {/* Habilidades y Acciones Especiales de Tasha */}
          <div className="card" style={{ padding: '1.2rem' }}>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', color: 'var(--accent-gold)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Zap size={18} /> Acciones Especiales de Clase (Tasha)
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.8rem' }}>
              {/* Segundo Aire para Guerrero */}
              {activeSidekick.sidekickClass === 'warrior' && activeSidekick.level >= 2 && (
                <div style={{
                  padding: '0.8rem',
                  background: 'var(--bg-main)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>🛡️ Segundo Aire</span>
                    <span className={`badge ${activeSidekick.secondWindUsed ? 'badge-crimson' : 'badge-emerald'}`}>
                      {activeSidekick.secondWindUsed ? 'Usado' : 'Disponible'}
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                    Acción Adicional: Recupera 1d10 + {activeSidekick.level} PG (1 uso por descanso corto/largo).
                  </p>
                  <button 
                    className={`btn btn-sm ${activeSidekick.secondWindUsed ? 'btn-secondary' : 'btn-primary'}`}
                    disabled={activeSidekick.secondWindUsed}
                    onClick={handleSecondWind}
                  >
                    <Heart size={14} /> Curar 1d10+{activeSidekick.level}
                  </button>
                </div>
              )}

              {/* Ayuda Útil para Experto */}
              {activeSidekick.sidekickClass === 'expert' && (
                <div style={{
                  padding: '0.8rem',
                  background: 'var(--bg-main)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>🤝 Ayuda Útil (Helpful)</span>
                    <span className="badge badge-gold">Acción Adicional</span>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                    Otorga ventaja a un aliado en su siguiente ataque o prueba de característica hasta 30 pies (9 m).
                  </p>
                  <button 
                    className="btn btn-secondary btn-sm"
                    onClick={() => notify(`🤝 ¡${activeSidekick.name} usa Ayuda Útil! Un aliado a 30 pies gana VENTAJA en su siguiente tirada.`)}
                  >
                    <Check size={14} /> Otorgar Ventaja a Aliado
                  </button>
                </div>
              )}

              {/* Acción Astuta para Experto */}
              {activeSidekick.sidekickClass === 'expert' && activeSidekick.level >= 2 && (
                <div style={{
                  padding: '0.8rem',
                  background: 'var(--bg-main)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>🏃 Acción Astuta</span>
                    <span className="badge badge-gold">Acción Adicional</span>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                    Puede Correr (Dash), Destrabarse (Disengage) o Esconderse (Hide) en cada turno.
                  </p>
                  <div style={{ display: 'flex', gap: '0.3rem' }}>
                    <button className="btn btn-secondary btn-sm" style={{ flex: 1 }} onClick={() => notify(`🏃 ${activeSidekick.name} usa Acción Astuta: CORRER (Doble movimiento este turno)`)}>
                      Correr
                    </button>
                    <button className="btn btn-secondary btn-sm" style={{ flex: 1 }} onClick={() => notify(`🛡️ ${activeSidekick.name} usa Acción Astuta: DESTRABARSE (No provoca ataques de oportunidad)`)}>
                      Destrabarse
                    </button>
                    <button 
                      className="btn btn-secondary btn-sm" 
                      style={{ flex: 1 }} 
                      onClick={() => {
                        const roll = rollD20WithAdvantage('normal', getSidekickProficiency(activeSidekick.level) + getAbilityModifier(activeSidekick.abilities.dex));
                        notify(`👤 ${activeSidekick.name} se esconde: Tirada de Sigilo d20 [${roll.rolls[0]}] + mod = ${roll.total}`);
                      }}
                    >
                      Esconderse
                    </button>
                  </div>
                </div>
              )}

              {/* Ataque Coordinado para Experto Nvl 6+ */}
              {activeSidekick.sidekickClass === 'expert' && activeSidekick.level >= 6 && (
                <div style={{
                  padding: '0.8rem',
                  background: 'var(--bg-main)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>🎯 Ataque Coordinado</span>
                    <span className="badge badge-emerald">+{activeSidekick.level >= 14 ? '3d6' : '2d6'} daño</span>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                    Daño extra una vez por turno si un aliado está a 5 pies del objetivo o si fue ayudado.
                  </p>
                  <button 
                    className="btn btn-secondary btn-sm"
                    onClick={() => {
                      const dice = activeSidekick.level >= 14 ? '3d6' : '2d6';
                      const roll = rollDice(dice);
                      notify(`🎯 ¡Ataque Coordinado de ${activeSidekick.name}! Daño extra ${roll.total} (${roll.expression}) [${roll.rolls.join(', ')}].`);
                    }}
                  >
                    Tirar +{activeSidekick.level >= 14 ? '3d6' : '2d6'} Daño
                  </button>
                </div>
              )}

              {/* Espacios de Conjuro para Prodigio Mágico */}
              {activeSidekick.sidekickClass === 'spellcaster' && activeSidekick.spellcasting && (
                <div style={{
                  gridColumn: '1 / -1',
                  padding: '0.8rem',
                  background: 'var(--bg-main)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.6rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>✨ Espacios de Conjuro</span>
                      <span className="badge badge-azure">
                        CD Salvación: {activeSidekick.spellcasting.saveDc} | Bonif. Ataque: +{activeSidekick.spellcasting.attackBonus}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    {Object.entries(activeSidekick.spellcasting.slots).map(([lvlStr, slotData]) => {
                      const lvl = Number(lvlStr);
                      return (
                        <div key={lvl} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'var(--bg-surface)', padding: '0.4rem 0.6rem', borderRadius: 'var(--radius-sm)' }}>
                          <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--accent-gold)' }}>Nivel {lvl}:</span>
                          <div style={{ display: 'flex', gap: '0.3rem' }}>
                            {Array.from({ length: slotData.total }).map((_, i) => {
                              const isUsed = i < slotData.used;
                              return (
                                <button
                                  key={i}
                                  onClick={() => handleToggleSpellSlot(lvl, i)}
                                  style={{
                                    width: '20px',
                                    height: '20px',
                                    borderRadius: '4px',
                                    border: '1px solid var(--accent-gold)',
                                    background: isUsed ? 'transparent' : 'var(--accent-gold)',
                                    cursor: 'pointer',
                                    padding: 0
                                  }}
                                  title={isUsed ? 'Espacio gastado (clic para recuperar)' : 'Espacio disponible (clic para gastar)'}
                                />
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Ataques y Acciones de Combate */}
          <div className="card" style={{ padding: '1.2rem' }}>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', color: 'var(--accent-gold)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sword size={18} /> Ataques & Acciones
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              {activeSidekick.attacks.map(atk => (
                <div 
                  key={atk.id}
                  style={{
                    padding: '0.9rem',
                    background: 'var(--bg-main)',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '0.8rem'
                  }}
                >
                  <div style={{ minWidth: '200px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{atk.name}</span>
                      <span className="badge badge-secondary" style={{ fontSize: '0.7rem' }}>
                        {atk.type === 'melee' ? 'Cuerpo a cuerpo' : atk.type === 'ranged' ? 'A distancia' : 'Conjuro'}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>
                      Alcance: {atk.reachOrRange} • Daño: <strong>{atk.damageDice}</strong> {atk.damageType}
                    </div>
                    {atk.notes && (
                      <div style={{ fontSize: '0.75rem', color: 'var(--accent-gold)', marginTop: '0.2rem' }}>
                        ℹ️ {atk.notes}
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button 
                      className="btn btn-primary btn-sm"
                      onClick={() => handleAttackRoll(atk)}
                    >
                      <Dices size={14} /> Atacar (+{atk.bonus})
                    </button>
                    <button 
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleDamageRoll(atk)}
                    >
                      Daño ({atk.damageDice})
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Columna Derecha: Atributos, Rasgos de Nivel y Gestión */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Tarjeta de Atributos */}
          <div className="card" style={{ padding: '1.2rem' }}>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', color: 'var(--accent-gold)' }}>
              Puntuaciones de Característica
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.6rem' }}>
              {(['str', 'dex', 'con', 'int', 'wis', 'cha'] as AbilityName[]).map(ability => {
                const score = activeSidekick.abilities[ability];
                const mod = getAbilityModifier(score);
                const hasSave = !!activeSidekick.savingThrows[ability];
                const labels: Record<AbilityName, string> = {
                  str: 'FUE',
                  dex: 'DES',
                  con: 'CON',
                  int: 'INT',
                  wis: 'SAB',
                  cha: 'CAR'
                };

                return (
                  <div 
                    key={ability}
                    style={{
                      padding: '0.6rem 0.4rem',
                      background: 'var(--bg-main)',
                      borderRadius: 'var(--radius-sm)',
                      border: hasSave ? '1px solid var(--accent-gold)' : '1px solid var(--border-subtle)',
                      textAlign: 'center'
                    }}
                  >
                    <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-dim)' }}>
                      {labels[ability]}
                    </div>
                    <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-main)', margin: '0.1rem 0' }}>
                      {formatModifier(mod)}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                      {score} {hasSave && '⭐'}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Habilidades y Competencias */}
            <div style={{ marginTop: '1rem', paddingTop: '0.8rem', borderTop: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-dim)', marginBottom: '0.4rem' }}>
                Habilidades con Pericia:
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                {activeSidekick.skills.map(sk => (
                  <span key={sk} className="badge badge-secondary" style={{ fontSize: '0.72rem' }}>
                    {sk}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Rasgos Desbloqueados de Nivel (Tasha) */}
          <div className="card" style={{ padding: '1.2rem', maxHeight: '520px', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--accent-gold)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <BookOpen size={16} /> Rasgos de Nivel ({activeSidekick.features.length})
              </h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                Hasta Nivel {activeSidekick.level}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {activeSidekick.features.map((feat, idx) => (
                <div 
                  key={idx}
                  style={{
                    padding: '0.7rem',
                    background: 'var(--bg-main)',
                    borderRadius: 'var(--radius-sm)',
                    borderLeft: '3px solid var(--accent-gold)',
                    fontSize: '0.82rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
                    <strong style={{ color: 'var(--text-main)' }}>{feat.name}</strong>
                    <span className="badge badge-gold" style={{ fontSize: '0.65rem' }}>
                      {feat.source}
                    </span>
                  </div>
                  <p style={{ margin: 0, color: 'var(--text-dim)', lineHeight: 1.35 }}>
                    {feat.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Zona de Peligro / Eliminar */}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button 
              className="btn btn-secondary btn-sm"
              onClick={() => handleDeleteSidekick(activeSidekick.id)}
              style={{ color: 'var(--accent-crimson)', borderColor: 'var(--accent-crimson)' }}
            >
              <Trash2 size={14} /> Eliminar este Escudero
            </button>
          </div>
        </div>
      </div>

      {/* Modal para Seleccionar Plantillas Oficiales de Tasha */}
      {showPresetModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.65)',
          backdropFilter: 'blur(3px)',
          zIndex: 10000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem'
        }}>
          <div className="card" style={{ maxWidth: '880px', width: '100%', maxHeight: '85vh', display: 'flex', flexDirection: 'column', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.8rem' }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--accent-gold)' }}>
                  Plantillas de Escuderos de El Caldero de Tasha
                </h2>
                <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.82rem', color: 'var(--text-dim)' }}>
                  Elige una criatura base de VD 1/2 o menor preconfigurada con su clase marcial o mágica:
                </p>
              </div>
              <button className="btn btn-secondary btn-sm" onClick={() => setShowPresetModal(false)}>
                <X size={16} />
              </button>
            </div>

            <div style={{ overflowY: 'auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', paddingRight: '0.5rem' }}>
              {SIDEKICK_PRESETS.map(preset => (
                <div 
                  key={preset.id}
                  style={{
                    padding: '1rem',
                    background: 'var(--bg-main)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '0.8rem'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                      <strong style={{ fontSize: '1rem', color: 'var(--text-main)' }}>{preset.name}</strong>
                      <span className="badge badge-gold" style={{ fontSize: '0.7rem' }}>
                        {preset.sidekickClass === 'warrior' ? 'Guerrero' : preset.sidekickClass === 'expert' ? 'Experto' : 'Prodigio'}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '0.5rem' }}>
                      {preset.creatureType} • CA {preset.armorClass} • {preset.maxHp} PG
                    </div>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)', fontStyle: 'italic', margin: 0 }}>
                      "{preset.personalityTrait}"
                    </p>
                  </div>

                  <button 
                    className="btn btn-primary btn-sm"
                    onClick={() => handleSelectPreset(preset)}
                    style={{ width: '100%' }}
                  >
                    <Plus size={14} /> Seleccionar y Añadir
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal para Crear Criatura Personalizada */}
      {showCreateModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.65)',
          backdropFilter: 'blur(3px)',
          zIndex: 10000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem'
        }}>
          <div className="card" style={{ maxWidth: '650px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.8rem' }}>
              <h2 style={{ margin: 0, fontSize: '1.3rem', color: 'var(--accent-gold)' }}>
                Crear Escudero Personalizado (Tasha)
              </h2>
              <button className="btn btn-secondary btn-sm" onClick={() => setShowCreateModal(false)}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateCustom} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.2rem' }}>Nombre</label>
                  <input 
                    type="text" 
                    required 
                    value={customForm.name} 
                    onChange={e => setCustomForm({ ...customForm, name: e.target.value })} 
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.2rem' }}>Tipo de Criatura</label>
                  <input 
                    type="text" 
                    required 
                    value={customForm.creatureType} 
                    onChange={e => setCustomForm({ ...customForm, creatureType: e.target.value })} 
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.8rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.2rem' }}>Clase de Escudero</label>
                  <select 
                    value={customForm.sidekickClass}
                    onChange={e => setCustomForm({ ...customForm, sidekickClass: e.target.value as SidekickClassType })}
                  >
                    <option value="warrior">Guerrero (Warrior)</option>
                    <option value="expert">Experto (Expert)</option>
                    <option value="spellcaster">Prodigio Mágico</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.2rem' }}>Papel / Rol</label>
                  <select 
                    value={customForm.role}
                    onChange={e => setCustomForm({ ...customForm, role: e.target.value as SidekickRole })}
                  >
                    <option value="attacker">Atacante (+2 Ataque)</option>
                    <option value="defender">Defensor (Reacción Desventaja)</option>
                    <option value="mage">Mago (Arcano - INT)</option>
                    <option value="healer">Sanador (Divino - SAB/CAR)</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.2rem' }}>Dado de Golpe</label>
                  <select 
                    value={customForm.hitDie}
                    onChange={e => setCustomForm({ ...customForm, hitDie: e.target.value })}
                  >
                    <option value="d6">d6 (Pequeño)</option>
                    <option value="d8">d8 (Mediano)</option>
                    <option value="d10">d10 (Grande)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.8rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.2rem' }}>PG Base (Nivel 1)</label>
                  <input 
                    type="number" 
                    min={4} 
                    max={50} 
                    value={customForm.baseHp} 
                    onChange={e => setCustomForm({ ...customForm, baseHp: parseInt(e.target.value, 10) || 10 })} 
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.2rem' }}>Clase de Armadura</label>
                  <input 
                    type="number" 
                    min={10} 
                    max={22} 
                    value={customForm.armorClass} 
                    onChange={e => setCustomForm({ ...customForm, armorClass: parseInt(e.target.value, 10) || 12 })} 
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.2rem' }}>Velocidad (metros)</label>
                  <input 
                    type="number" 
                    min={4} 
                    max={24} 
                    value={customForm.speed} 
                    onChange={e => setCustomForm({ ...customForm, speed: parseInt(e.target.value, 10) || 9 })} 
                  />
                </div>
              </div>

              {/* Características */}
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.4rem' }}>Puntuaciones de Atributos</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '0.4rem' }}>
                  {(['str', 'dex', 'con', 'int', 'wis', 'cha'] as const).map(ab => (
                    <div key={ab} style={{ textAlign: 'center' }}>
                      <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-dim)' }}>{ab}</span>
                      <input 
                        type="number" 
                        min={1} 
                        max={20} 
                        value={customForm[ab]} 
                        onChange={e => setCustomForm({ ...customForm, [ab]: parseInt(e.target.value, 10) || 10 })} 
                        style={{ textAlign: 'center', padding: '0.3rem' }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Ataque Principal */}
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '0.8rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.2rem' }}>Nombre del Ataque</label>
                  <input 
                    type="text" 
                    value={customForm.attackName} 
                    onChange={e => setCustomForm({ ...customForm, attackName: e.target.value })} 
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.2rem' }}>Dados de Daño</label>
                  <input 
                    type="text" 
                    value={customForm.attackDamage} 
                    onChange={e => setCustomForm({ ...customForm, attackDamage: e.target.value })} 
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.2rem' }}>Tipo de Daño</label>
                  <input 
                    type="text" 
                    value={customForm.attackType} 
                    onChange={e => setCustomForm({ ...customForm, attackType: e.target.value })} 
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.6rem', marginTop: '0.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  <Plus size={16} /> Crear Escudero
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
