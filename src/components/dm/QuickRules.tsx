import React, { useState } from 'react';
import { INITIAL_CONDITIONS } from '../../data/initialData';
import { rollDice } from '../../utils/dndMath';
import { BookOpen, Sparkles, Coins, ShieldAlert, HeartPulse, RefreshCw } from 'lucide-react';

export const QuickRules: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'conditions' | 'actions' | 'rest_cover' | 'loot'>('conditions');
  const [lootCrTier, setLootCrTier] = useState<'0-4' | '5-10' | '11-16' | '17+'>('0-4');
  const [generatedLoot, setGeneratedLoot] = useState<{ title: string; coins: string; items: string[] } | null>(null);

  const generateLoot = (tier: '0-4' | '5-10' | '11-16' | '17+', type: 'individual' | 'hoard') => {
    let coins = '';
    const items: string[] = [];

    if (type === 'individual') {
      if (tier === '0-4') {
        const d = rollDice('3d6').total;
        coins = `${d * 10} Cobre (PC), ${rollDice('1d6').total} Plata (PP)`;
      } else if (tier === '5-10') {
        const gp = rollDice('4d6').total * 10;
        coins = `${gp} Oro (PO), ${rollDice('2d6').total * 10} Plata (PP)`;
      } else if (tier === '11-16') {
        const gp = rollDice('4d6').total * 100;
        const pp = rollDice('1d6').total * 10;
        coins = `${gp} Oro (PO), ${pp} Platino (PT)`;
      } else {
        const gp = rollDice('8d6').total * 100;
        const pp = rollDice('3d6').total * 100;
        coins = `${gp} Oro (PO), ${pp} Platino (PT)`;
      }
    } else {
      // Hoard (Tesoro de Guarida)
      if (tier === '0-4') {
        const gp = rollDice('6d6').total * 100;
        coins = `${gp} Oro (PO), ${rollDice('3d6').total * 100} Plata (PP)`;
        items.push(`${rollDice('2d4').total} Gemas de malaquita / ojo de tigre (10 PO c/u)`);
        items.push(`Objeto Mágico Común: ${['Poción de Curación', 'Pergamino de Proyectil Mágico', 'Poción de Escalar', 'Cuerda de Enredadera'][Math.floor(Math.random() * 4)]}`);
      } else if (tier === '5-10') {
        const gp = rollDice('8d6').total * 100;
        const pp = rollDice('2d6').total * 10;
        coins = `${gp} Oro (PO), ${pp} Platino (PT)`;
        items.push(`${rollDice('3d6').total} Gemas de topacio / amatista (100 PO c/u)`);
        items.push(`Objeto Mágico Poco Común: ${['Arma +1', 'Escudo +1', 'Botas Élficas', 'Bolsa de Contención (Bag of Holding)', 'Poción de Curación Mayor'][Math.floor(Math.random() * 5)]}`);
      } else if (tier === '11-16') {
        const gp = rollDice('12d6').total * 1000;
        const pp = rollDice('8d6').total * 100;
        coins = `${gp} Oro (PO), ${pp} Platino (PT)`;
        items.push(`${rollDice('3d6').total} Obras de arte de oro y gemas (750 PO c/u)`);
        items.push(`Objeto Mágico Raro: ${['Arma +2', 'Anillo de Protección', 'Capa del Desplazador', 'Amuleto de Salud'][Math.floor(Math.random() * 4)]}`);
      } else {
        const gp = rollDice('12d6').total * 10000;
        const pp = rollDice('8d6').total * 1000;
        coins = `${gp} Oro (PO), ${pp} Platino (PT)`;
        items.push(`${rollDice('3d6').total} Diamantes de gran pureza (5,000 PO c/u)`);
        items.push(`Objeto Legendario / Muy Raro: ${['Arma +3', 'Espada del Segador de Almas', 'Tomo de Entendimiento', 'Anillo de Tres Deseos'][Math.floor(Math.random() * 4)]}`);
      }
    }

    setGeneratedLoot({
      title: `Tesoro ${type === 'hoard' ? 'de Guarida' : 'Individual'} (Desafío CR ${tier})`,
      coins,
      items
    });
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-gold)', paddingBottom: '0.8rem' }}>
        <h1 style={{ fontSize: '1.8rem', margin: 0 }}>Guía Rápida de Reglas & Tesoros 2024</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Consulta instantánea durante tus sesiones: estados, acciones de combate, descansos y generador de recompensas.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>
        <button className={`nav-tab-btn ${activeTab === 'conditions' ? 'active' : ''}`} onClick={() => setActiveTab('conditions')}>
          <ShieldAlert size={16} /> Estados & Condiciones
        </button>
        <button className={`nav-tab-btn ${activeTab === 'actions' ? 'active' : ''}`} onClick={() => setActiveTab('actions')}>
          <Sparkles size={16} /> Acciones en Combate
        </button>
        <button className={`nav-tab-btn ${activeTab === 'rest_cover' ? 'active' : ''}`} onClick={() => setActiveTab('rest_cover')}>
          <HeartPulse size={16} /> Descansos & Coberturas
        </button>
        <button className={`nav-tab-btn ${activeTab === 'loot' ? 'active' : ''}`} onClick={() => setActiveTab('loot')}>
          <Coins size={16} /> Generador de Tesoro
        </button>
      </div>

      {/* TAB 1: CONDICIONES */}
      {activeTab === 'conditions' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
          {INITIAL_CONDITIONS.map(cond => (
            <div key={cond.name} className="card" style={{ borderLeft: '3px solid var(--crimson-hp)' }}>
              <h3 style={{ fontSize: '1.05rem', color: '#ff8b94', marginBottom: '0.4rem' }}>{cond.name}</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>{cond.desc}</p>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: ACCIONES EN COMBATE */}
      {activeTab === 'actions' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
          {[
            { name: 'Atacar (Attack)', desc: 'Realizas un ataque cuerpo a cuerpo o a distancia. Con la propiedad Extra Attack puedes atacar múltiples veces.' },
            { name: 'Lanzar un Conjuro (Cast a Spell)', desc: 'Lanzas un hechizo cuyo tiempo de lanzamiento sea 1 Acción. En 2024 solo puedes lanzar un conjuro con espacio por turno.' },
            { name: 'Correr (Dash)', desc: 'Obtienes movimiento adicional para el turno en curso igual a tu velocidad.' },
            { name: 'Destrabarse (Disengage)', desc: 'Tu movimiento no provoca ataques de oportunidad por el resto del turno.' },
            { name: 'Esquivar (Dodge)', desc: 'Cualquier tirada de ataque contra ti tiene desventaja si puedes ver al atacante, y tienes ventaja en salvaciones de Destreza.' },
            { name: 'Ayudar (Help)', desc: 'Prestas auxilio a un aliado. Otorga ventaja en la siguiente prueba o en el siguiente ataque contra un enemigo a 1.5 m.' },
            { name: 'Esconderse (Hide)', desc: 'Realizas una prueba de Destreza (Sigilo) CD 15 para quedar invisible tras cobertura.' },
            { name: 'Preparar (Ready)', desc: 'Esperas una circunstancia específica para actuar con tu Reacción.' },
            { name: 'Buscar (Search)', desc: 'Dedicas tu atención a encontrar algo mediante una prueba de Percepción o Investigación.' },
            { name: 'Usar un Objeto (Utilize)', desc: 'Interactúas con un mecanismo complejo, abres una puerta cerrada o bebes una poción (¡en 2024 beber una poción es Acción Adicional!).' }
          ].map(act => (
            <div key={act.name} className="card" style={{ borderLeft: '3px solid var(--gold-primary)' }}>
              <h3 style={{ fontSize: '1.05rem', color: 'var(--gold-hover)', marginBottom: '0.4rem' }}>{act.name}</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>{act.desc}</p>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: DESCANSOS & COBERTURA */}
      {activeTab === 'rest_cover' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div className="card">
            <h2>Reglas de Descanso 2024</h2>
            <div style={{ marginBottom: '1rem' }}>
              <h3 style={{ color: 'var(--text-gold)', fontSize: '1.05rem' }}>Descanso Corto (Short Rest)</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                Un período de inactividad de al menos 1 hora. Puedes gastar uno o más de tus Dados de Golpe para recuperar puntos de golpe (Tirada del dado + Mod. Constitución por cada dado).
              </p>
            </div>
            <div>
              <h3 style={{ color: 'var(--text-gold)', fontSize: '1.05rem' }}>Descanso Largo (Long Rest)</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                Un período de reposo de al menos 8 horas (al menos 6 durmiendo y hasta 2 de actividad ligera). Recuperas todos tus puntos de golpe perdidos, todos tus espacios de conjuro y la mitad de tus dados de golpe gastados.
              </p>
            </div>
          </div>

          <div className="card">
            <h2>Reglas de Cobertura</h2>
            <div style={{ marginBottom: '1rem' }}>
              <h3 style={{ color: 'var(--emerald-heal)', fontSize: '1.05rem' }}>Media Cobertura (+2 CA y Salvaciones Des)</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                Un muro bajo, un mueble grande, el tronco de un árbol o el cuerpo de otra criatura (amiga o enemiga).
              </p>
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <h3 style={{ color: 'var(--sapphire-mana)', fontSize: '1.05rem' }}>Tres Cuartos de Cobertura (+5 CA y Salvaciones Des)</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                Una tronera de saetera, una reja de hierro o la mayor parte del cuerpo tras una esquina de roca.
              </p>
            </div>
            <div>
              <h3 style={{ color: 'var(--gold-hover)', fontSize: '1.05rem' }}>Cobertura Total</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                Un objetivo con cobertura total no puede ser elegido como blanco directo de ataques o conjuros.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: GENERADOR DE TESORO */}
      {activeTab === 'loot' && (
        <div>
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Generador de Botín por Nivel de Desafío (CR)</h2>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <div>
                <label>Rango de CR:</label>
                <select value={lootCrTier} onChange={e => setLootCrTier(e.target.value as any)}>
                  <option value="0-4">CR 0 - 4 (Tier 1)</option>
                  <option value="5-10">CR 5 - 10 (Tier 2)</option>
                  <option value="11-16">CR 11 - 16 (Tier 3)</option>
                  <option value="17+">CR 17+ (Tier 4)</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.2rem' }}>
                <button className="btn btn-primary" onClick={() => generateLoot(lootCrTier, 'individual')}>
                  <Coins size={16} /> Generar Botín Individual
                </button>
                <button className="btn btn-magic" onClick={() => generateLoot(lootCrTier, 'hoard')}>
                  <Sparkles size={16} /> Generar Tesoro de Guarida (Hoard)
                </button>
              </div>
            </div>
          </div>

          {generatedLoot && (
            <div className="card card-gold" style={{ animation: 'modalEnter 0.25s ease-out' }}>
              <h2 style={{ fontSize: '1.4rem', color: 'var(--gold-hover)', marginBottom: '0.8rem' }}>
                {generatedLoot.title}
              </h2>
              <div style={{ marginBottom: '1rem' }}>
                <strong style={{ color: 'var(--text-gold)', fontSize: '1rem' }}>Monedas Obtenidas:</strong>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.2rem', color: '#ffffff', marginTop: '0.2rem' }}>
                  {generatedLoot.coins}
                </div>
              </div>

              {generatedLoot.items.length > 0 && (
                <div>
                  <strong style={{ color: 'var(--text-gold)', fontSize: '1rem' }}>Objetos de Valor & Magia:</strong>
                  <ul style={{ marginTop: '0.4rem', paddingLeft: '1.2rem', color: 'var(--text-main)', lineHeight: 1.6 }}>
                    {generatedLoot.items.map((it, i) => (
                      <li key={i}>{it}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
