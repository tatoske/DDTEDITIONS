import React, { useState } from 'react';
import { Spell, Character } from '../../types/dnd';
import { INITIAL_SPELLS } from '../../data/initialData';
import { Sparkles, Search, BookOpen, Plus, CheckCircle, Flame } from 'lucide-react';

interface SpellsCompendiumProps {
  activeCharacter?: Character;
  onAddSpellToCharacter?: (spell: Spell) => void;
}

// Catálogo ampliado de conjuros icónicos de D&D 2024
const EXPANDED_SPELLS: Spell[] = [
  ...INITIAL_SPELLS,
  {
    id: 'luz',
    name: 'Luz (Light)',
    level: 0,
    school: 'Evocación',
    castingTime: '1 Acción',
    range: 'Toque',
    components: { v: true, s: false, m: true, materialText: 'Una luciérnaga o musgo fosforescente' },
    duration: '1 Hora',
    concentration: false,
    ritual: false,
    description: 'Tocas un objeto de no más de 3 metros en cualquier dimensión. Hasta que el conjuro termine, el objeto emite luz brillante en un radio de 6 metros y luz tenue en 6 metros adicionales.',
    classes: ['Bardo', 'Clérigo', 'Druida', 'Mago', 'Hechicero', 'Artífice']
  },
  {
    id: 'ilusion-menor',
    name: 'Ilusión Menor (Minor Illusion)',
    level: 0,
    school: 'Ilusión',
    castingTime: '1 Acción',
    range: '9 metros (30 pies)',
    components: { v: false, s: true, m: true, materialText: 'Un mechón de lana' },
    duration: '1 Minuto',
    concentration: false,
    ritual: false,
    description: 'Creas un sonido o una imagen espectral de un objeto dentro del alcance que dura mientras dure el conjuro.',
    classes: ['Bardo', 'Hechicero', 'Brujo', 'Mago']
  },
  {
    id: 'guia',
    name: 'Guía (Guidance)',
    level: 0,
    school: 'Adivinación',
    castingTime: '1 Acción',
    range: 'Toque',
    components: { v: true, s: true, m: false },
    duration: 'Concentración, hasta 1 Minuto',
    concentration: true,
    ritual: false,
    description: 'Tocas a una criatura voluntaria. Una vez antes de que el conjuro termine, el objetivo puede tirar 1d4 y sumar el resultado a una prueba de característica de su elección.',
    classes: ['Clérigo', 'Druida', 'Artífice']
  },
  {
    id: 'armadura-de-mago',
    name: 'Armadura de Mago (Mage Armor)',
    level: 1,
    school: 'Abjuración',
    castingTime: '1 Acción',
    range: 'Toque',
    components: { v: true, s: true, m: true, materialText: 'Un trozo de cuero curado' },
    duration: '8 Horas',
    concentration: false,
    ritual: false,
    description: 'Tocas a una criatura voluntaria que no lleve armadura. Una fuerza mágica protectora la rodea: su CA base pasa a ser 13 + su modificador de Destreza.',
    classes: ['Hechicero', 'Mago']
  },
  {
    id: 'rayo-de-escarcha',
    name: 'Rayo de Escarcha (Ray of Frost)',
    level: 0,
    school: 'Evocación',
    castingTime: '1 Acción',
    range: '18 metros (60 pies)',
    components: { v: true, s: true, m: false },
    duration: 'Instantáneo',
    concentration: false,
    ritual: false,
    description: 'Un gélido haz de luz blanquiazul surge hacia una criatura. Haz un ataque de conjuro a distancia. Si impacta, recibe 1d8 de daño por frío y su velocidad se reduce en 3 metros hasta tu próximo turno.',
    classes: ['Mago', 'Hechicero', 'Artífice']
  },
  {
    id: 'rayo-abrasador',
    name: 'Rayo Abrasador (Scorching Ray)',
    level: 2,
    school: 'Evocación',
    castingTime: '1 Acción',
    range: '36 metros (120 pies)',
    components: { v: true, s: true, m: false },
    duration: 'Instantáneo',
    concentration: false,
    ritual: false,
    description: 'Creas tres rayos de fuego y los disparas contra objetivos dentro del alcance. Haz un ataque de conjuro a distancia por cada rayo. Con cada impacto, el objetivo recibe 2d6 de daño por fuego.',
    higherLevels: 'Creas un rayo adicional por cada nivel de espacio por encima de 2.',
    classes: ['Hechicero', 'Mago']
  },
  {
    id: 'invisibilidad',
    name: 'Invisibilidad (Invisibility)',
    level: 2,
    school: 'Ilusión',
    castingTime: '1 Acción',
    range: 'Toque',
    components: { v: true, s: true, m: true, materialText: 'Una pestaña en ámbar' },
    duration: 'Concentración, hasta 1 Hora',
    concentration: true,
    ritual: false,
    description: 'Una criatura que toques se vuelve invisible hasta que el conjuro termine. El conjuro termina prematuramente si el objetivo ataca o lanza un conjuro.',
    higherLevels: 'Puedes elegir como objetivo a una criatura adicional por cada nivel por encima de 2.',
    classes: ['Bardo', 'Brujo', 'Hechicero', 'Mago', 'Artífice']
  },
  {
    id: 'espiritus-guardianes',
    name: 'Espíritus Guardianes (Spirit Guardians)',
    level: 3,
    school: 'Conjuración',
    castingTime: '1 Acción',
    range: 'Personal (esfera de 4.5 metros)',
    components: { v: true, s: true, m: true, materialText: 'Un símbolo sagrado' },
    duration: 'Concentración, hasta 10 Minutos',
    concentration: true,
    ritual: false,
    description: 'Espíritus angelicales o feéricos te rodean en un radio de 4.5 m. La velocidad de los enemigos en el área se reduce a la mitad. Cuando una criatura entra o empieza su turno en el área, hace una salvación de Sabiduría. Recibe 3d8 de daño radiante o necrótico (mitad con éxito).',
    classes: ['Clérigo']
  },
  {
    id: 'polimorfar',
    name: 'Polimorfar (Polymorph)',
    level: 4,
    school: 'Transmutación',
    castingTime: '1 Acción',
    range: '18 metros (60 pies)',
    components: { v: true, s: true, m: true, materialText: 'Una oruga en un capullo' },
    duration: 'Concentración, hasta 1 Hora',
    concentration: true,
    ritual: false,
    description: 'Transformas mágicamente a una criatura visible en una bestia cuyo valor de desafío sea igual o menor que el nivel del objetivo. Asume todos los puntos de golpe y estadísticas de la bestia.',
    classes: ['Bardo', 'Druida', 'Hechicero', 'Mago']
  }
];

export const SpellsCompendium: React.FC<SpellsCompendiumProps> = ({ activeCharacter, onAddSpellToCharacter }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedSchool, setSelectedSchool] = useState<string>('all');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [onlyRitual, setOnlyRitual] = useState<boolean>(false);
  const [onlyConcentration, setOnlyConcentration] = useState<boolean>(false);
  const [addedMessage, setAddedMessage] = useState<string | null>(null);

  const filteredSpells = EXPANDED_SPELLS.filter(spell => {
    const matchSearch = spell.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        spell.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchLevel = selectedLevel === 'all' || spell.level.toString() === selectedLevel;
    const matchSchool = selectedSchool === 'all' || spell.school.toLowerCase().includes(selectedSchool.toLowerCase());
    const matchClass = selectedClass === 'all' || spell.classes.includes(selectedClass);
    const matchRitual = !onlyRitual || spell.ritual;
    const matchConcentration = !onlyConcentration || spell.concentration;

    return matchSearch && matchLevel && matchSchool && matchClass && matchRitual && matchConcentration;
  });

  const handleAdd = (spell: Spell) => {
    if (!activeCharacter) {
      alert('Debes tener un personaje seleccionado en el Modo Jugador para añadirle este conjuro.');
      return;
    }
    if (onAddSpellToCharacter) {
      onAddSpellToCharacter(spell);
      setAddedMessage(`¡"${spell.name}" añadido al grimorio de ${activeCharacter.name}!`);
      setTimeout(() => setAddedMessage(null), 4000);
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {addedMessage && (
        <div style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          background: 'linear-gradient(135deg, rgba(25, 113, 194, 0.95), rgba(15, 18, 30, 0.98))',
          border: '1px solid var(--sapphire-mana)',
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
          <Sparkles size={18} />
          <span>{addedMessage}</span>
        </div>
      )}

      <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-gold)', paddingBottom: '0.8rem' }}>
        <h1 style={{ fontSize: '1.8rem', margin: 0 }}>Grimorio Supremo de Conjuros (D&D 2024)</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Catálogo completo de magia con filtros por nivel, escuela y clase para Masters y Jugadores.
        </p>
      </div>

      {/* Barra de Búsqueda y Filtros */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1.2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', gap: '0.8rem', marginBottom: '0.8rem' }}>
          <div>
            <label>Buscar Conjuro</label>
            <input 
              type="text" 
              placeholder="Nombre o efecto (ej. Fuego, Curar, Escudo)..." 
              value={searchTerm} 
              onChange={e => setSearchTerm(e.target.value)} 
            />
          </div>

          <div>
            <label>Nivel de Conjuro</label>
            <select value={selectedLevel} onChange={e => setSelectedLevel(e.target.value)}>
              <option value="all">Todos los Niveles</option>
              <option value="0">Trucos (Nivel 0)</option>
              <option value="1">Nivel 1</option>
              <option value="2">Nivel 2</option>
              <option value="3">Nivel 3</option>
              <option value="4">Nivel 4</option>
              <option value="5">Nivel 5</option>
            </select>
          </div>

          <div>
            <label>Escuela de Magia</label>
            <select value={selectedSchool} onChange={e => setSelectedSchool(e.target.value)}>
              <option value="all">Todas las Escuelas</option>
              <option value="Evocación">Evocación</option>
              <option value="Abjuración">Abjuración</option>
              <option value="Conjuración">Conjuración</option>
              <option value="Ilusión">Ilusión</option>
              <option value="Adivinación">Adivinación</option>
              <option value="Transmutación">Transmutación</option>
            </select>
          </div>

          <div>
            <label>Clase Lanzadora</label>
            <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)}>
              <option value="all">Todas las Clases</option>
              <option value="Mago">Mago</option>
              <option value="Clérigo">Clérigo</option>
              <option value="Druida">Druida</option>
              <option value="Bardo">Bardo</option>
              <option value="Hechicero">Hechicero</option>
              <option value="Brujo">Brujo</option>
              <option value="Paladín">Paladín</option>
              <option value="Artífice">Artífice</option>
            </select>
          </div>
        </div>

        {/* Toggles de Filtro Extra */}
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', margin: 0 }}>
            <input 
              type="checkbox" 
              checked={onlyConcentration} 
              onChange={e => setOnlyConcentration(e.target.checked)} 
              style={{ width: '16px', height: '16px' }}
            />
            <span>Solo Concentración</span>
          </label>
          <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', margin: 0 }}>
            <input 
              type="checkbox" 
              checked={onlyRitual} 
              onChange={e => setOnlyRitual(e.target.checked)} 
              style={{ width: '16px', height: '16px' }}
            />
            <span>Solo Rituales</span>
          </label>
          <span style={{ marginLeft: 'auto', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Mostrando <strong>{filteredSpells.length}</strong> conjuros
          </span>
        </div>
      </div>

      {/* Grid de Conjuros */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.2rem' }}>
        {filteredSpells.map(spell => (
          <div key={spell.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderLeft: '3px solid var(--amethyst-magic)' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                <h3 style={{ fontSize: '1.15rem', margin: 0, color: 'var(--text-main)' }}>{spell.name}</h3>
                <span className="badge badge-sapphire">
                  {spell.level === 0 ? 'Truco' : `Nivel ${spell.level}`}
                </span>
              </div>

              <div style={{ fontSize: '0.8rem', color: 'var(--text-gold)', fontWeight: 600, marginBottom: '0.4rem' }}>
                {spell.school} {spell.ritual ? '• Ritual' : ''} {spell.concentration ? '• Concentración' : ''}
              </div>

              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.6rem', lineHeight: 1.4 }}>
                <strong>Tiempo:</strong> {spell.castingTime} | <strong>Alcance:</strong> {spell.range} | <strong>Duración:</strong> {spell.duration}
              </div>

              <p style={{ fontSize: '0.88rem', color: 'var(--text-main)', lineHeight: 1.5, marginBottom: '0.8rem' }}>
                {spell.description}
              </p>

              {spell.higherLevels && (
                <div style={{ background: 'rgba(158, 117, 20, 0.08)', padding: '0.4rem 0.6rem', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', color: 'var(--text-gold)', marginBottom: '0.8rem' }}>
                  <strong>A Niveles Superiores:</strong> {spell.higherLevels}
                </div>
              )}
            </div>

            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.6rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                {spell.classes.join(', ')}
              </span>
              {activeCharacter && (
                <button className="btn btn-secondary btn-sm" onClick={() => handleAdd(spell)}>
                  <Plus size={14} /> Aprender
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
