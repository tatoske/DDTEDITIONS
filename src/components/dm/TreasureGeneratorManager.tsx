import React, { useState } from 'react';
import { Character } from '../../types/dnd';
import {
  TreasureCrTier,
  TreasureType
} from '../../data/treasureTablesData';
import {
  generateIndividualTreasure,
  generateHoardTreasure,
  GeneratedTreasureResult
} from '../../utils/treasureMath';
import {
  Coins,
  Gem,
  Sparkles,
  Dices,
  CheckCircle2,
  Package,
  Wand2,
  Send,
  Plus
} from 'lucide-react';

interface TreasureGeneratorManagerProps {
  activeCharacter?: Character;
  onUpdateCharacter?: (updated: Character) => void;
  characters?: Character[];
  onUpdateAllCharacters?: (updatedList: Character[]) => void;
}

export const TreasureGeneratorManager: React.FC<TreasureGeneratorManagerProps> = ({
  activeCharacter,
  onUpdateCharacter,
  characters = [],
  onUpdateAllCharacters
}) => {
  const [selectedTier, setSelectedTier] = useState<TreasureCrTier>('tier1_cr0_4');
  const [selectedType, setSelectedType] = useState<TreasureType>('hoard');
  const [treasureResult, setTreasureResult] = useState<GeneratedTreasureResult | null>(() => {
    return generateHoardTreasure('tier1_cr0_4');
  });
  const [awardSuccessMsg, setAwardSuccessMsg] = useState<string | null>(null);
  const [recipientChoice, setRecipientChoice] = useState<string>(activeCharacter?.id || '');

  const targetChar = characters.find(c => c.id === recipientChoice) || activeCharacter || characters[0];

  const handleGenerateTreasure = () => {
    const res = selectedType === 'individual'
      ? generateIndividualTreasure(selectedTier)
      : generateHoardTreasure(selectedTier);
    setTreasureResult(res);
  };

  const handleAwardTreasureToCharacter = () => {
    if (!treasureResult) return;

    if (recipientChoice === 'ALL_GROUP' && characters.length > 0 && onUpdateAllCharacters) {
      const count = characters.length;
      const gpEach = Math.floor(treasureResult.coins.gp / count);
      const spEach = Math.floor(treasureResult.coins.sp / count);
      const cpEach = Math.floor(treasureResult.coins.cp / count);
      const ppEach = Math.floor(treasureResult.coins.pp / count);

      const updatedAll = characters.map((c, idx) => {
        const extraGp = idx === 0 ? (treasureResult.coins.gp % count) : 0;
        return {
          ...c,
          coins: {
            cp: (c.coins?.cp || 0) + cpEach,
            sp: (c.coins?.sp || 0) + spEach,
            ep: c.coins?.ep || 0,
            gp: (c.coins?.gp || 0) + gpEach + extraGp,
            pp: (c.coins?.pp || 0) + ppEach
          },
          updatedAt: new Date().toISOString()
        };
      });

      onUpdateAllCharacters(updatedAll);
      setAwardSuccessMsg(`¡Botín dividido equitativamente entre los ${count} aventureros!`);
      setTimeout(() => setAwardSuccessMsg(null), 5000);
      return;
    }

    if (!targetChar || !onUpdateCharacter) return;

    // Actualizar monedas
    const updatedCoins = {
      cp: (targetChar.coins?.cp || 0) + treasureResult.coins.cp,
      sp: (targetChar.coins?.sp || 0) + treasureResult.coins.sp,
      ep: (targetChar.coins?.ep || 0) + treasureResult.coins.ep,
      gp: (targetChar.coins?.gp || 0) + treasureResult.coins.gp,
      pp: (targetChar.coins?.pp || 0) + treasureResult.coins.pp
    };

    // Añadir gemas y objetos de arte al inventario
    const newItems = [...(targetChar.inventory || [])];

    treasureResult.gems.forEach((g, idx) => {
      newItems.push({
        id: `gem_${Date.now()}_${idx}`,
        name: `${g.gem.name} (${g.gem.valueGp} po c/u)`,
        quantity: g.quantity,
        description: g.gem.description
      });
    });

    treasureResult.artObjects.forEach((a, idx) => {
      newItems.push({
        id: `art_${Date.now()}_${idx}`,
        name: `${a.art.name} (${a.art.valueGp} po)`,
        quantity: a.quantity,
        description: a.art.description
      });
    });

    treasureResult.magicItems.forEach((m, idx) => {
      newItems.push({
        id: `magic_loot_${Date.now()}_${idx}`,
        name: m,
        quantity: 1,
        description: 'Objeto mágico obtenido de botín de guarida (DMG 2024).'
      });
    });

    onUpdateCharacter({
      ...targetChar,
      coins: updatedCoins,
      inventory: newItems,
      updatedAt: new Date().toISOString()
    });

    setAwardSuccessMsg(`¡Botín transferido con éxito a la ficha de ${targetChar.name}! (${treasureResult.totalValueGp} po equivalentes).`);
    setTimeout(() => setAwardSuccessMsg(null), 5000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Cabecera */}
      <div className="card" style={{ padding: '24px', borderLeft: '5px solid #d97706' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ backgroundColor: 'rgba(217, 119, 6, 0.15)', color: '#d97706', padding: '6px', borderRadius: '8px', display: 'flex' }}>
                <Coins size={24} />
              </span>
              <h2 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--color-primary-dark, #292524)' }}>
                Generador Oficial de Botín, Gemas y Tesoro (*DMG 2024*)
              </h2>
            </div>
            <p style={{ margin: '8px 0 0 0', color: 'var(--color-text-muted, #78716c)', fontSize: '0.95rem' }}>
              Tablas oficiales de tesoros individuales y acumulaciones de guarida (Hoard) por rango de desafío (CR 0 a 17+), con gemas, orfebrería y objetos mágicos de la Guía del Dungeon Master.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            {characters.length > 0 && (
              <select
                value={recipientChoice}
                onChange={e => setRecipientChoice(e.target.value)}
                style={{ padding: '8px 12px', borderRadius: '6px', fontWeight: 600, fontSize: '0.85rem' }}
              >
                {characters.map(c => (
                  <option key={c.id} value={c.id}>Transferir a: {c.name}</option>
                ))}
                <option value="ALL_GROUP">👥 Reparto Equitativo al Grupo</option>
              </select>
            )}

            <button
              className="btn btn-primary"
              onClick={handleAwardTreasureToCharacter}
              disabled={!treasureResult}
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <Send size={16} /> Transferir Botín
            </button>
          </div>
        </div>

        {awardSuccessMsg && (
          <div style={{ marginTop: '16px', padding: '12px 16px', backgroundColor: 'rgba(16, 185, 129, 0.12)', border: '1px solid #10b981', borderRadius: '8px', color: '#047857', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={18} /> {awardSuccessMsg}
          </div>
        )}
      </div>

      {/* Controles de Generación */}
      <div className="card" style={{ padding: '20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', alignItems: 'flex-end' }}>
          {/* Selector de Rango de Desafío (CR Tier) */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px' }}>
              Rango de Desafío (CR Tier):
            </label>
            <select
              className="form-control"
              value={selectedTier}
              onChange={e => setSelectedTier(e.target.value as TreasureCrTier)}
            >
              <option value="tier1_cr0_4">Nivel de Desafío 0 - 4 (Aventureros Locales)</option>
              <option value="tier2_cr5_10">Nivel de Desafío 5 - 10 (Héroes del Reino)</option>
              <option value="tier3_cr11_16">Nivel de Desafío 11 - 16 (Maestros del Mundo)</option>
              <option value="tier4_cr17_plus">Nivel de Desafío 17+ (Campeones del Multiverso)</option>
            </select>
          </div>

          {/* Selector de Tipo de Tesoro */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px' }}>
              Tipo de Tesoro:
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                className={`btn btn-sm ${selectedType === 'individual' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setSelectedType('individual')}
                style={{ flex: 1 }}
              >
                Individual (Bolsillos)
              </button>
              <button
                type="button"
                className={`btn btn-sm ${selectedType === 'hoard' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setSelectedType('hoard')}
                style={{ flex: 1 }}
              >
                Acumulación de Guarida (Hoard)
              </button>
            </div>
          </div>

          {/* Botón de Tirada */}
          <div>
            <button
              className="btn btn-primary"
              onClick={handleGenerateTreasure}
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px 16px', fontWeight: 700 }}
            >
              <Dices size={18} /> Tirar Botín en las Tablas (d100)
            </button>
          </div>
        </div>
      </div>

      {/* Resultados del Botín Generado */}
      {treasureResult && (
        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '20px' }}>
          {/* Columna Izquierda: Monedas y Valor Total */}
          <div className="card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-border, #e7e5e4)', paddingBottom: '12px', marginBottom: '16px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-muted, #78716c)' }}>
                Tirada d100: <strong>{treasureResult.d100Roll}</strong>
              </span>
              <span
                style={{
                  fontSize: '0.75rem',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  backgroundColor: 'rgba(217, 119, 6, 0.15)',
                  color: '#b45309',
                  fontWeight: 700,
                  textTransform: 'uppercase'
                }}
              >
                {treasureResult.type === 'hoard' ? 'Guarida' : 'Individual'}
              </span>
            </div>

            <h3 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', color: 'var(--color-primary-dark, #292524)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Coins size={18} color="#b45309" /> Monedas Obtenidas
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', backgroundColor: 'var(--color-bg-card, #fafaf9)', border: '1px solid var(--color-border, #e7e5e4)', borderRadius: '6px' }}>
                <span style={{ color: '#b45309', fontWeight: 600 }}>Cobre (pc):</span>
                <strong>{treasureResult.coins.cp.toLocaleString()}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', backgroundColor: 'var(--color-bg-card, #fafaf9)', border: '1px solid var(--color-border, #e7e5e4)', borderRadius: '6px' }}>
                <span style={{ color: '#71717a', fontWeight: 600 }}>Plata (pp):</span>
                <strong>{treasureResult.coins.sp.toLocaleString()}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', backgroundColor: 'var(--color-bg-card, #fafaf9)', border: '1px solid var(--color-border, #e7e5e4)', borderRadius: '6px' }}>
                <span style={{ color: '#0284c7', fontWeight: 600 }}>Electro (pe):</span>
                <strong>{treasureResult.coins.ep.toLocaleString()}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', backgroundColor: 'var(--color-bg-card, #fafaf9)', border: '1px solid var(--color-border, #e7e5e4)', borderRadius: '6px' }}>
                <span style={{ color: '#d97706', fontWeight: 700 }}>Oro (po):</span>
                <strong style={{ color: '#d97706', fontSize: '1.05rem' }}>{treasureResult.coins.gp.toLocaleString()}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', backgroundColor: 'var(--color-bg-card, #fafaf9)', border: '1px solid var(--color-border, #e7e5e4)', borderRadius: '6px' }}>
                <span style={{ color: '#6366f1', fontWeight: 600 }}>Platino (ppt):</span>
                <strong>{treasureResult.coins.pp.toLocaleString()}</strong>
              </div>
            </div>

            {/* Valor Total Estimado */}
            <div style={{ padding: '14px', backgroundColor: 'var(--color-bg-alt, #f5f5f4)', borderRadius: '8px', textAlign: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted, #78716c)' }}>Valor Total Estimado</span>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#b45309' }}>
                {treasureResult.totalValueGp.toLocaleString()} po
              </div>
            </div>
          </div>

          {/* Columna Derecha: Gemas, Objetos de Arte y Objetos Mágicos */}
          <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '1.2rem', color: 'var(--color-primary-dark, #292524)' }}>
              Tesoros Especiales & Objetos Mágicos
            </h3>

            {/* Gemas Preciosas */}
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ margin: '0 0 10px 0', fontSize: '0.95rem', color: '#b45309', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Gem size={16} /> Gemas Preciosas ({treasureResult.gems.length > 0 ? treasureResult.gems.reduce((acc, g) => acc + g.quantity, 0) : 0})
              </h4>
              {treasureResult.gems.length === 0 ? (
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-text-muted, #78716c)', fontStyle: 'italic' }}>
                  No se encontraron gemas en esta tirada.
                </p>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
                  {treasureResult.gems.map((g, idx) => (
                    <div key={idx} style={{ padding: '10px 12px', border: '1px solid var(--color-border, #e7e5e4)', borderRadius: '6px', backgroundColor: 'var(--color-bg-card, #fafaf9)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <strong style={{ fontSize: '0.9rem' }}>{g.quantity}x {g.gem.name}</strong>
                        <span style={{ fontSize: '0.8rem', color: '#b45309', fontWeight: 700 }}>{g.gem.valueGp} po c/u</span>
                      </div>
                      <p style={{ margin: '4px 0 0 0', fontSize: '0.75rem', color: 'var(--color-text-muted, #78716c)' }}>
                        {g.gem.description}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Objetos de Arte */}
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ margin: '0 0 10px 0', fontSize: '0.95rem', color: '#b45309', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={16} /> Objetos de Arte & Orfebrería ({treasureResult.artObjects.length > 0 ? treasureResult.artObjects.reduce((acc, a) => acc + a.quantity, 0) : 0})
              </h4>
              {treasureResult.artObjects.length === 0 ? (
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-text-muted, #78716c)', fontStyle: 'italic' }}>
                  No se encontraron objetos de arte en esta tirada.
                </p>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
                  {treasureResult.artObjects.map((a, idx) => (
                    <div key={idx} style={{ padding: '10px 12px', border: '1px solid var(--color-border, #e7e5e4)', borderRadius: '6px', backgroundColor: 'var(--color-bg-card, #fafaf9)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <strong style={{ fontSize: '0.9rem' }}>{a.quantity}x {a.art.name}</strong>
                        <span style={{ fontSize: '0.8rem', color: '#b45309', fontWeight: 700 }}>{a.art.valueGp} po</span>
                      </div>
                      <p style={{ margin: '4px 0 0 0', fontSize: '0.75rem', color: 'var(--color-text-muted, #78716c)' }}>
                        {a.art.description}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Objetos Mágicos */}
            <div>
              <h4 style={{ margin: '0 0 10px 0', fontSize: '0.95rem', color: '#6366f1', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Wand2 size={16} /> Objetos Mágicos Obtenidos ({treasureResult.magicItems.length})
              </h4>
              {treasureResult.magicItems.length === 0 ? (
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-text-muted, #78716c)', fontStyle: 'italic' }}>
                  No se descubrieron objetos mágicos en este alijo.
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {treasureResult.magicItems.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', border: '1px solid rgba(99, 102, 241, 0.3)', backgroundColor: 'rgba(99, 102, 241, 0.05)', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600, color: '#4338ca' }}>
                      <Sparkles size={15} /> {item}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
