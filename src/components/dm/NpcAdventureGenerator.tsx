import React, { useState } from 'react';
import { rollDice, rollD20WithAdvantage } from '../../utils/dndMath';
import { UserCheck, Compass, Sparkles, Sword, RefreshCw, Shield, Heart, Eye } from 'lucide-react';

interface GeneratedNpc {
  id: string;
  name: string;
  species: string;
  occupation: string;
  alignment: string;
  physicalTrait: string;
  personality: string;
  secret: string;
  hp: number;
  ac: number;
  attack: string;
}

interface GeneratedQuest {
  id: string;
  title: string;
  patron: string;
  objective: string;
  location: string;
  complication: string;
  reward: string;
}

const FIRST_NAMES = ['Kaelen', 'Thora', 'Baelor', 'Morrigan', 'Eldrin', 'Vespera', 'Garrick', 'Lyanna', 'Durnan', 'Bryn', 'Kaelthas', 'Sylvan', 'Orin', 'Miriel'];
const SURNAMES = ['Garra de Cuervo', 'Martillo Brillante', 'Caminasombras', 'Ojos de Halcón', 'Rocacertera', 'Llamafría', 'Corona Plateada', 'Ríohondo', 'Rompeolas', 'Vientoplata'];
const OCCUPATIONS = ['Tabernero de posada concurrida', 'Herrero maestro de armas', 'Erudito arcano y cartógrafo', 'Capitán de la guardia urbana', 'Mercader de reliquias exóticas', 'Cazador de recompensas astuto', 'Sacerdotisa de un templo en ruinas', 'Contrabandista de los bajos fondos', 'Alquimista excéntrico', 'Noble cortesano influyente'];
const SPECIES = ['Humano', 'Elfo', 'Enano', 'Mediano', 'Gnomo', 'Tiefling', 'Dracónido', 'Orco', 'Goliat', 'Aasimar'];
const ALIGNMENTS = ['Legal Bueno', 'Neutral Bueno', 'Caótico Bueno', 'Legal Neutral', 'Neutral Auténtico', 'Caótico Neutral', 'Neutral Maligno'];
const PHYSICAL_TRAITS = ['Cicatriz profunda de garra en el ojo izquierdo', 'Ojos de diferente color (uno dorado y otro violeta)', 'Voz grave y susurrante que hiela la sangre', 'Manos marcadas por quemaduras de fuego arcano', 'Tatuajes rúnicos que brillan levemente en penumbra', 'Lleva una capa remendada con plumas de cuervo', 'Sonrisa enigmática y dedos que siempre cuentan monedas'];
const PERSONALITIES = ['Jovial y fanfarrón, pero guarda silencio al oír sobre monstruos', 'Extremadamente paranoico, siempre se sienta de espaldas a la pared', 'Curioso sin límites, hace preguntas incómodas a los aventureros', 'Formal, educado y frío como el mármol', 'Melancólico, suspira al recordar tiempos pasados', 'Valiente hasta la imprudencia, admira a los guerreros'];
const SECRETS = ['Tiene una deuda de sangre con un gremio de asesinos locales', 'Custodia la llave de una cripta prohibida bajo su negocio', 'Es el heredero fugitivo de un linaje noble caído en desgracia', 'Fue maldecido por una bruja y no puede mentir después del ocaso', 'Sabe la ubicación exacta de un nido de dragón joven herido', 'Es un espía infiltrado que reporta a un Señor Oscuro'];

const QUEST_PATRONS = ['Un mago senil que perdió su libro de conjuros primigenio', 'La capitana de un barco mercante cuya tripulación fue hipnotizada', 'Un espíritu atrapado en un espejo de plata encantado', 'La sacerdotisa mayor de la deidad de la luz ante una herejía', 'Un noble arrepentido que busca borrar las pruebas de su pasado', 'Un líder orco honorario que pide ayuda contra una plaga demoníaca'];
const QUEST_OBJECTIVES = ['Recuperar un fragmento de meteorito caído en un pantano ponzoñoso', 'Investigar una serie de desapariciones en las catacumbas de la catedral', 'Escoltar una reliquia sagrada a través de un paso de montaña helado', 'Infiltrarse en una fortaleza flotante antes de que cruce la frontera', 'Capturar con vida a un nigromante que profanó los cementerios reales', 'Romper la maldición de una aldea donde nadie ha dormido en siete días'];
const QUEST_LOCATIONS = ['Las Cavernas del Eco de Cristal', 'El Pantano de los Lamentos Olvidados', 'La Cima del Volcán Durmiente', 'Las Ruinas de la Ciudad Sumergida', 'El Bosque Susurrante de las Hadas Grises', 'La Fortaleza Abandonada de Bastión Negro'];
const QUEST_COMPLICATIONS = ['El patrón que los contrató es en realidad el antagonista disfrazado', 'El objeto a rescatar tiene conciencia propia y se niega a ser movido', 'Una facción rival de cazadores de élite ya va dos días por delante', 'El lugar está bajo una tormenta de magia salvaje donde los conjuros fallan o mutan', 'La criatura que custodian resulta ser la cría inocente de una bestia milenaria'];
const QUEST_REWARDS = ['1,200 Monedas de Oro (PO) y un Pergamino de Revivir', 'Un Carruaje blindado y el favor político del Gran Ducado', 'Una Espada Larga +1 que emite luz radiante a voluntad', 'Una Botella de Almacenamiento Infinito y 800 PO', 'Un favor arcano que permite consultar a los planos superiores'];

export const NpcAdventureGenerator: React.FC = () => {
  const [generatedNpc, setGeneratedNpc] = useState<GeneratedNpc | null>(null);
  const [generatedQuest, setGeneratedQuest] = useState<GeneratedQuest | null>(null);

  const handleGenerateNpc = () => {
    const firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
    const surname = SURNAMES[Math.floor(Math.random() * SURNAMES.length)];
    const hp = rollDice('3d8+6').total;
    const ac = Math.floor(Math.random() * 5) + 11; // 11 to 15
    const atkMod = Math.floor(Math.random() * 4) + 2; // +2 to +5

    setGeneratedNpc({
      id: 'npc_' + Date.now(),
      name: `${firstName} ${surname}`,
      species: SPECIES[Math.floor(Math.random() * SPECIES.length)],
      occupation: OCCUPATIONS[Math.floor(Math.random() * OCCUPATIONS.length)],
      alignment: ALIGNMENTS[Math.floor(Math.random() * ALIGNMENTS.length)],
      physicalTrait: PHYSICAL_TRAITS[Math.floor(Math.random() * PHYSICAL_TRAITS.length)],
      personality: PERSONALITIES[Math.floor(Math.random() * PERSONALITIES.length)],
      secret: SECRETS[Math.floor(Math.random() * SECRETS.length)],
      hp,
      ac,
      attack: `Arma de Combate: +${atkMod} al impacto, 1d8+${atkMod - 2} de daño`
    });
  };

  const handleGenerateQuest = () => {
    const location = QUEST_LOCATIONS[Math.floor(Math.random() * QUEST_LOCATIONS.length)];
    const title = `El Misterio de ${location}`;

    setGeneratedQuest({
      id: 'quest_' + Date.now(),
      title,
      patron: QUEST_PATRONS[Math.floor(Math.random() * QUEST_PATRONS.length)],
      objective: QUEST_OBJECTIVES[Math.floor(Math.random() * QUEST_OBJECTIVES.length)],
      location,
      complication: QUEST_COMPLICATIONS[Math.floor(Math.random() * QUEST_COMPLICATIONS.length)],
      reward: QUEST_REWARDS[Math.floor(Math.random() * QUEST_REWARDS.length)]
    });
  };

  return (
    <div style={{ maxWidth: '1150px', margin: '0 auto' }}>
      <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-gold)', paddingBottom: '0.8rem' }}>
        <h1 style={{ fontSize: '1.8rem', margin: 0 }}>Generador de PNJ & Semillas de Aventura</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Herramienta de improvisación instantánea para el Dungeon Master: crea personajes no jugadores con personalidad y secretos, o tramas de aventura al vuelo.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* SECCIÓN 1: GENERADOR DE PNJ */}
        <div>
          <div className="card card-gold" style={{ marginBottom: '1.2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.3rem', margin: 0, border: 'none', padding: 0 }}>
                <UserCheck size={20} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '0.4rem' }} />
                Generador de PNJ Inmediato
              </h2>
              <button className="btn btn-primary btn-sm" onClick={handleGenerateNpc}>
                <RefreshCw size={14} /> ¡Generar PNJ!
              </button>
            </div>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', margin: 0 }}>
              Genera taberneros, guardias, eruditos, mercaderes o villanos con estadísticas de combate listas.
            </p>
          </div>

          {generatedNpc ? (
            <div className="card" style={{ borderLeft: '4px solid var(--gold-primary)', animation: 'modalEnter 0.25s ease-out' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.6rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.3rem', margin: 0, color: 'var(--text-main)' }}>{generatedNpc.name}</h3>
                  <div style={{ fontSize: '0.85rem', color: 'var(--gold-primary)', fontWeight: 600 }}>
                    {generatedNpc.species} • {generatedNpc.occupation}
                  </div>
                </div>
                <span className="badge badge-gold">{generatedNpc.alignment}</span>
              </div>

              {/* Estadísticas de Combate Rápido */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.4rem', margin: '0.8rem 0', textAlign: 'center' }}>
                <div style={{ background: 'rgba(0,0,0,0.04)', padding: '0.4rem', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>SALUD</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--crimson-hp)' }}>{generatedNpc.hp} HP</div>
                </div>
                <div style={{ background: 'rgba(0,0,0,0.04)', padding: '0.4rem', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>ARMADURA</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--gold-primary)' }}>{generatedNpc.ac} CA</div>
                </div>
                <div style={{ background: 'rgba(0,0,0,0.04)', padding: '0.4rem', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>COMBATE</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.8rem' }}>Marcial</div>
                </div>
              </div>

              <div style={{ fontSize: '0.88rem', lineHeight: 1.5, color: 'var(--text-main)' }}>
                <p style={{ marginBottom: '0.4rem' }}>
                  <strong style={{ color: 'var(--text-gold)' }}>Apariencia Distintiva:</strong> {generatedNpc.physicalTrait}.
                </p>
                <p style={{ marginBottom: '0.4rem' }}>
                  <strong style={{ color: 'var(--text-gold)' }}>Personalidad:</strong> {generatedNpc.personality}.
                </p>
                <p style={{ marginBottom: '0.4rem', background: 'rgba(201, 42, 42, 0.08)', padding: '0.4rem 0.6rem', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--crimson-hp)' }}>
                  <strong style={{ color: 'var(--crimson-hp)' }}>Secreto Oculto:</strong> {generatedNpc.secret}.
                </p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '0.4rem' }}>
                  {generatedNpc.attack}
                </p>
              </div>
            </div>
          ) : (
            <div className="card" style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)' }}>
              Haz clic en <strong>"¡Generar PNJ!"</strong> para obtener un personaje no jugador con historia y secretos.
            </div>
          )}
        </div>

        {/* SECCIÓN 2: GENERADOR DE MISIONES Y AVENTURAS */}
        <div>
          <div className="card card-gold" style={{ marginBottom: '1.2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.3rem', margin: 0, border: 'none', padding: 0 }}>
                <Compass size={20} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '0.4rem' }} />
                Ganchos de Misión & Aventura
              </h2>
              <button className="btn btn-primary btn-sm" onClick={handleGenerateQuest}>
                <Sparkles size={14} /> ¡Crear Misión!
              </button>
            </div>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', margin: 0 }}>
              Construye semillas de trama con patrones misteriosos, localizaciones peligrosas y giros inesperados.
            </p>
          </div>

          {generatedQuest ? (
            <div className="card" style={{ borderLeft: '4px solid var(--sapphire-mana)', animation: 'modalEnter 0.25s ease-out' }}>
              <h3 style={{ fontSize: '1.3rem', margin: '0 0 0.8rem 0', color: 'var(--sapphire-mana)' }}>
                {generatedQuest.title}
              </h3>

              <div style={{ fontSize: '0.88rem', lineHeight: 1.6, color: 'var(--text-main)' }}>
                <p style={{ marginBottom: '0.5rem' }}>
                  <strong style={{ color: 'var(--text-gold)' }}>Patrón / Demandante:</strong> {generatedQuest.patron}.
                </p>
                <p style={{ marginBottom: '0.5rem' }}>
                  <strong style={{ color: 'var(--text-gold)' }}>Objetivo Principal:</strong> {generatedQuest.objective}.
                </p>
                <p style={{ marginBottom: '0.5rem' }}>
                  <strong style={{ color: 'var(--text-gold)' }}>Localización:</strong> {generatedQuest.location}.
                </p>
                <div style={{ background: 'rgba(158, 117, 20, 0.08)', padding: '0.6rem 0.8rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-gold)', margin: '0.8rem 0' }}>
                  <strong style={{ color: 'var(--gold-hover)', display: 'block', marginBottom: '0.2rem' }}>
                    ¡Giro Dramático / Complicación!:
                  </strong>
                  <span>{generatedQuest.complication}.</span>
                </div>
                <p style={{ margin: 0 }}>
                  <strong style={{ color: 'var(--emerald-heal)' }}>Recompensa Ofrecida:</strong> {generatedQuest.reward}.
                </p>
              </div>
            </div>
          ) : (
            <div className="card" style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)' }}>
              Haz clic en <strong>"¡Crear Misión!"</strong> para armar una aventura lista para dirigir en tu sesión.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
