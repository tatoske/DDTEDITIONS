import React, { useState } from 'react';
import { Character, CharacterItem } from '../../types/dnd';
import { ShoppingBag, Coins, Sparkles, Shield, Sword, Heart, Plus, Check } from 'lucide-react';

interface ShopItem {
  id: string;
  name: string;
  category: string;
  costGp: number;
  weightLb?: number;
  description: string;
}

interface ShopType {
  id: string;
  title: string;
  merchantName: string;
  personality: string;
  items: ShopItem[];
}

const SHOPS_DATA: Record<string, ShopType> = {
  blacksmith: {
    id: 'blacksmith',
    title: 'Herrería & Armería "El Yunque Forjafuego"',
    merchantName: 'Torik Martilloescarcha (Enano fornido con delantal de cuero quemado)',
    personality: 'Rudo pero justo. Desprecia las armas de mala calidad y premia a los guerreros con honor.',
    items: [
      { id: 'sh_1', name: 'Espada Larga de Acero Templado', category: 'Armas', costGp: 15, weightLb: 3, description: '1d8 cortante (versátil 1d10). Equilibrio perfecto.' },
      { id: 'sh_2', name: 'Espadón a Dos Manos', category: 'Armas', costGp: 50, weightLb: 6, description: '2d6 cortante (pesada, a dos manos).' },
      { id: 'sh_3', name: 'Arco Largo y Carcaj (20 flechas)', category: 'Armas', costGp: 51, weightLb: 3, description: '1d8 perforante (alcance 45/180 m).' },
      { id: 'sh_4', name: 'Cota de Malla Completa', category: 'Armaduras', costGp: 75, weightLb: 55, description: 'CA 16 (requiere Fue 13, desventaja en Sigilo).' },
      { id: 'sh_5', name: 'Armadura de Placas (Full Plate)', category: 'Armaduras', costGp: 1500, weightLb: 65, description: 'La cúspide de la protección: CA 18 (requiere Fue 15).' },
      { id: 'sh_6', name: 'Escudo Reforzado con Acero', category: 'Armaduras', costGp: 10, weightLb: 6, description: '+2 a la Clase de Armadura.' }
    ]
  },
  alchemist: {
    id: 'alchemist',
    title: 'Botica Alquímica "La Mandrágora Carmesí"',
    merchantName: 'Vespera del Sauce (Gnomo alquimista con gafas lupas y dedos teñidos de azul)',
    personality: 'Habla a toda velocidad, probando polvos misteriosos y ofreciendo descuentos a cambio de ingredientes raros.',
    items: [
      { id: 'al_1', name: 'Poción de Curación Estándar', category: 'Pociones', costGp: 50, weightLb: 0.5, description: 'Restaura 2d4 + 2 puntos de golpe al beberse (Acción Adicional en 2024).' },
      { id: 'al_2', name: 'Poción de Curación Mayor', category: 'Pociones', costGp: 150, weightLb: 0.5, description: 'Restaura 4d4 + 4 puntos de golpe.' },
      { id: 'al_3', name: 'Antitoxina Universal', category: 'Elixires', costGp: 50, weightLb: 0.5, description: 'Otorga ventaja en salvaciones contra veneno durante 1 hora.' },
      { id: 'al_4', name: 'Frasco de Fuego de Alquimista', category: 'Combate', costGp: 50, weightLb: 1, description: 'Arroja a 6 m. Inflige 1d4 de daño de fuego continuo cada turno hasta apagarse.' },
      { id: 'al_5', name: 'Aceite de Afilar (+1)', category: 'Mejoras', costGp: 100, weightLb: 1, description: 'Otorga un bonificador de +1 a ataque y daño durante 1 hora a un arma.' }
    ]
  },
  general: {
    id: 'general',
    title: 'Provisiones & Equipo "El Fardo del Explorador"',
    merchantName: 'Barnaby Piesligeros (Mediano regordete con una sonrisa amistosa)',
    personality: 'Cálido y hospitalario. Siempre tiene una taza de té caliente y los mejores rumores de la comarca.',
    items: [
      { id: 'gen_1', name: 'Cuerda de Seda (15 metros)', category: 'Equipo', costGp: 10, weightLb: 5, description: 'Resistente, ligera y no se enreda con facilidad.' },
      { id: 'gen_2', name: 'Mochila de Aventurero con Raciones (10 días)', category: 'Equipo', costGp: 5, weightLb: 20, description: 'Comida seca, odre de agua, pedernal y antorchas.' },
      { id: 'gen_3', name: 'Herramientas de Ladrón (Thieves\' Tools)', category: 'Herramientas', costGp: 25, weightLb: 1, description: 'Ganzúas, limas y espejuelo para forzar cerraduras y desactivar trampas.' },
      { id: 'gen_4', name: 'Linterna Sorda con Aceite', category: 'Iluminación', costGp: 7, weightLb: 2, description: 'Emite cono de luz de 18 metros con tapa ajustable.' },
      { id: 'gen_5', name: 'Equipo de Escalada Profesional', category: 'Equipo', costGp: 25, weightLb: 12, description: 'Clavijas de hierro, arnés y martillo para ascensos rocosos.' }
    ]
  }
};

interface ShopGeneratorProps {
  activeCharacter?: Character;
  onUpdateCharacter?: (updated: Character) => void;
}

export const ShopGenerator: React.FC<ShopGeneratorProps> = ({ activeCharacter, onUpdateCharacter }) => {
  const [selectedShopId, setSelectedShopId] = useState<string>('blacksmith');
  const [purchaseMessage, setPurchaseMessage] = useState<string | null>(null);

  const currentShop = SHOPS_DATA[selectedShopId];

  const handleBuyItem = (item: ShopItem) => {
    if (!activeCharacter || !onUpdateCharacter) {
      alert('Debes tener un personaje activo en el Modo Jugador para comprar.');
      return;
    }

    if (activeCharacter.coins.gp < item.costGp) {
      alert(`No tienes suficiente oro. Cuesta ${item.costGp} PO y tu saldo es ${activeCharacter.coins.gp} PO.`);
      return;
    }

    const nextCoins = { ...activeCharacter.coins, gp: activeCharacter.coins.gp - item.costGp };
    const newItem: CharacterItem = {
      id: 'bought_' + Date.now(),
      name: item.name,
      quantity: 1,
      weight: item.weightLb,
      description: item.description
    };

    onUpdateCharacter({
      ...activeCharacter,
      coins: nextCoins,
      inventory: [...activeCharacter.inventory, newItem],
      updatedAt: new Date().toISOString()
    });

    setPurchaseMessage(`¡Compraste "${item.name}" por ${item.costGp} PO! Tu nuevo saldo es ${nextCoins.gp} PO.`);
    setTimeout(() => setPurchaseMessage(null), 4000);
  };

  return (
    <div style={{ maxWidth: '1150px', margin: '0 auto' }}>
      {purchaseMessage && (
        <div style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          background: 'linear-gradient(135deg, rgba(43, 138, 62, 0.95), rgba(15, 18, 30, 0.98))',
          border: '1px solid var(--emerald-heal)',
          borderRadius: 'var(--radius-md)',
          padding: '0.8rem 1.2rem',
          boxShadow: 'var(--shadow-card)',
          zIndex: 1000,
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          animation: 'modalEnter 0.2s ease-out'
        }}>
          <Check size={18} />
          <span>{purchaseMessage}</span>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-gold)', paddingBottom: '0.8rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', margin: 0 }}>Mercados & Tiendas del Reino</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Establecimientos con inventario oficial, precios en oro y compra directa para los aventureros.
          </p>
        </div>

        {activeCharacter && (
          <div className="card" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <Coins size={20} color="var(--gold-primary)" />
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Oro de {activeCharacter.name}:</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: '1.1rem', color: 'var(--gold-primary)' }}>
                {activeCharacter.coins.gp} PO
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Selector de Tienda */}
      <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <button 
          className={`btn ${selectedShopId === 'blacksmith' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setSelectedShopId('blacksmith')}
        >
          <Sword size={16} /> Herrería & Armaduras
        </button>
        <button 
          className={`btn ${selectedShopId === 'alchemist' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setSelectedShopId('alchemist')}
        >
          <Sparkles size={16} /> Botica & Alquimia
        </button>
        <button 
          className={`btn ${selectedShopId === 'general' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setSelectedShopId('general')}
        >
          <ShoppingBag size={16} /> Provisiones & Equipo
        </button>
      </div>

      {/* Ficha del Establecimiento y Tendero */}
      <div className="card card-gold" style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.4rem', color: 'var(--text-gold)', margin: 0, border: 'none', padding: 0 }}>
          {currentShop.title}
        </h2>
        <div style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
          <div><strong style={{ color: 'var(--text-gold)' }}>Tendero:</strong> {currentShop.merchantName}</div>
          <div style={{ color: 'var(--text-muted)', fontStyle: 'italic', marginTop: '0.2rem' }}>
            "{currentShop.personality}"
          </div>
        </div>
      </div>

      {/* Catálogo de Mercancías */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.2rem' }}>
        {currentShop.items.map(item => (
          <div key={item.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                <h3 style={{ fontSize: '1.1rem', margin: 0, color: 'var(--text-main)' }}>{item.name}</h3>
                <span className="badge badge-gold" style={{ fontSize: '0.9rem', padding: '0.2rem 0.6rem' }}>
                  {item.costGp} PO
                </span>
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginBottom: '0.4rem' }}>
                Categoría: {item.category} {item.weightLb ? `• Peso: ${item.weightLb} lb` : ''}
              </div>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: 1.4, margin: 0 }}>
                {item.description}
              </p>
            </div>

            <div style={{ marginTop: '1rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.6rem', display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn btn-primary btn-sm" onClick={() => handleBuyItem(item)}>
                <Coins size={14} /> Comprar ({item.costGp} PO)
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
