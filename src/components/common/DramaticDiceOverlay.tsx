import React, { useState, useEffect, useRef } from 'react';
import { 
  DramaticRollPayload, 
  subscribeToDramaticRolls, 
  getDiceSoundEnabled, 
  setDiceSoundEnabled 
} from '../../utils/diceRollEvent';
import { 
  playDiceRollSound, 
  playSpookySound, 
  playAngelicSound 
} from '../../utils/diceAudio';
import { Skull, Sparkles, Volume2, VolumeX, X, Flame, ShieldAlert } from 'lucide-react';

export const DramaticDiceOverlay: React.FC = () => {
  const [activeRoll, setActiveRoll] = useState<DramaticRollPayload | null>(null);
  const [phase, setPhase] = useState<'rolling' | 'landed'>('rolling');
  const [displayNumber, setDisplayNumber] = useState<number>(20);
  const [soundEnabled, setSoundState] = useState<boolean>(getDiceSoundEnabled());
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const rollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const toggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    const next = !soundEnabled;
    setSoundState(next);
    setDiceSoundEnabled(next);
  };

  const handleDismiss = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (rollIntervalRef.current) clearInterval(rollIntervalRef.current);
    setActiveRoll(null);
  };

  useEffect(() => {
    const unsubscribe = subscribeToDramaticRolls((payload) => {
      // Limpiar temporizadores previos
      if (timerRef.current) clearTimeout(timerRef.current);
      if (rollIntervalRef.current) clearInterval(rollIntervalRef.current);

      setActiveRoll(payload);
      setPhase('rolling');
      setDisplayNumber(Math.floor(Math.random() * payload.sides) + 1);

      // Iniciar sonido de rodar
      playDiceRollSound();

      // Ruleta rápida de números mientras gira en el aire
      rollIntervalRef.current = setInterval(() => {
        setDisplayNumber(Math.floor(Math.random() * payload.sides) + 1);
      }, 55);

      // A los 850ms, el dado aterriza con impacto
      timerRef.current = setTimeout(() => {
        if (rollIntervalRef.current) clearInterval(rollIntervalRef.current);
        setPhase('landed');
        setDisplayNumber(payload.result);

        // Disparar sonido y efectos según resultado
        if (payload.isFumble) {
          playSpookySound();
        } else if (payload.isCrit || payload.isMax) {
          playAngelicSound();
        }

        // Auto-cierre después de 3.2 segundos
        timerRef.current = setTimeout(() => {
          setActiveRoll(null);
        }, 3200);
      }, 850);
    });

    // Permitir saltar con teclas Esc o Espacio
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === ' ' || e.key === 'Enter') {
        handleDismiss();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      unsubscribe();
      window.removeEventListener('keydown', handleKeyDown);
      if (timerRef.current) clearTimeout(timerRef.current);
      if (rollIntervalRef.current) clearInterval(rollIntervalRef.current);
    };
  }, []);

  if (!activeRoll) return null;

  const isFumble = activeRoll.isFumble;
  const isMax = activeRoll.isCrit || activeRoll.isMax;

  return (
    <div 
      className={`dramatic-overlay ${isFumble && phase === 'landed' ? 'doom-shake' : ''}`}
      onClick={handleDismiss}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: isFumble && phase === 'landed'
          ? 'radial-gradient(circle at center, rgba(30, 5, 8, 0.94) 0%, rgba(10, 2, 4, 0.98) 100%)'
          : isMax && phase === 'landed'
          ? 'radial-gradient(circle at center, rgba(35, 28, 5, 0.94) 0%, rgba(8, 7, 3, 0.98) 100%)'
          : 'radial-gradient(circle at center, rgba(14, 18, 30, 0.93) 0%, rgba(4, 6, 12, 0.97) 100%)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        cursor: 'pointer',
        animation: 'overlayFadeIn 0.25s ease-out forwards',
        userSelect: 'none',
        overflow: 'hidden'
      }}
    >
      {/* Controles Superiores: Silenciar y Cerrar */}
      <div 
        style={{
          position: 'absolute',
          top: '1.5rem',
          right: '1.5rem',
          display: 'flex',
          gap: '0.8rem',
          zIndex: 1000000
        }}
      >
        <button 
          onClick={toggleSound}
          title={soundEnabled ? 'Silenciar Efectos de Audio' : 'Activar Efectos de Audio'}
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '50%',
            width: '42px',
            height: '42px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: soundEnabled ? 'var(--gold-primary)' : 'var(--text-dim)',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
        </button>

        <button 
          onClick={(e) => { e.stopPropagation(); handleDismiss(); }}
          title="Cerrar (Esc)"
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '50%',
            width: '42px',
            height: '42px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          <X size={20} />
        </button>
      </div>

      {/* EFECTO ESPECIAL: Rayos de Luz Divina cuando es Tirada Máxima */}
      {isMax && phase === 'landed' && (
        <div 
          className="divine-rays"
          style={{
            position: 'absolute',
            width: '800px',
            height: '800px',
            borderRadius: '50%',
            background: 'conic-gradient(from 0deg, transparent 0deg 20deg, rgba(255, 215, 0, 0.28) 20deg 40deg, transparent 40deg 60deg, rgba(255, 240, 150, 0.35) 60deg 80deg, transparent 80deg 100deg, rgba(255, 215, 0, 0.28) 100deg 120deg, transparent 120deg 140deg, rgba(255, 240, 150, 0.35) 140deg 160deg, transparent 160deg 180deg, rgba(255, 215, 0, 0.28) 180deg 200deg, transparent 200deg 220deg, rgba(255, 240, 150, 0.35) 220deg 240deg, transparent 240deg 260deg, rgba(255, 215, 0, 0.28) 260deg 280deg, transparent 280deg 300deg, rgba(255, 240, 150, 0.35) 300deg 320deg, transparent 320deg 340deg, rgba(255, 215, 0, 0.28) 340deg 360deg)',
            pointerEvents: 'none',
            zIndex: 1,
            animation: 'spinDivineRays 20s linear infinite'
          }}
        />
      )}

      {/* EFECTO ESPECIAL: Aura de Niebla Tétrica cuando es Pifia (1) */}
      {isFumble && phase === 'landed' && (
        <div 
          style={{
            position: 'absolute',
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(220, 20, 60, 0.35) 0%, rgba(139, 0, 0, 0.15) 50%, transparent 75%)',
            pointerEvents: 'none',
            zIndex: 1,
            animation: 'pulseFumbleAura 1.8s ease-in-out infinite'
          }}
        />
      )}

      {/* CONTENEDOR CENTRAL DEL DADO */}
      <div 
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10,
          perspective: '1200px'
        }}
      >
        {/* Encabezado / Etiqueta de la tirada */}
        <div 
          style={{
            color: isFumble && phase === 'landed' ? '#ff6b6b' : isMax && phase === 'landed' ? '#ffe066' : 'var(--text-gold)',
            fontFamily: 'var(--font-mono)',
            fontSize: '1.2rem',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            marginBottom: '1.5rem',
            textShadow: isFumble && phase === 'landed' ? '0 0 12px rgba(255, 50, 50, 0.6)' : isMax && phase === 'landed' ? '0 0 16px rgba(255, 215, 0, 0.7)' : '0 0 8px rgba(0,0,0,0.5)',
            animation: 'fadeInDown 0.3s ease-out'
          }}
        >
          {activeRoll.label || `Tirada Oficial de d${activeRoll.sides}`}
        </div>

        {/* PIEZA 3D DEL DADO */}
        <div 
          className={`dice-3d-box ${phase === 'rolling' ? 'dice-rolling-anim' : 'dice-landed-anim'} ${isFumble && phase === 'landed' ? 'dice-fumble-style' : ''} ${isMax && phase === 'landed' ? 'dice-crit-style' : ''}`}
          style={{
            width: '160px',
            height: '160px',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: activeRoll.sides === 6 ? '20px' : '50%',
            transformStyle: 'preserve-3d',
            transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
          }}
        >
          {/* Polígono de Fondo tipo Faceta de Gema */}
          <div 
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: activeRoll.sides === 6 ? '18px' : '32px',
              background: isFumble && phase === 'landed'
                ? 'radial-gradient(circle at 35% 35%, #590914 0%, #200408 80%, #100204 100%)'
                : isMax && phase === 'landed'
                ? 'radial-gradient(circle at 35% 35%, #fff4b8 0%, #d4af37 45%, #75550a 100%)'
                : 'radial-gradient(circle at 35% 35%, #2a3352 0%, #151a2b 75%, #0d101c 100%)',
              border: isFumble && phase === 'landed'
                ? '3px solid #ff3344'
                : isMax && phase === 'landed'
                ? '3px solid #ffffff'
                : '3px solid var(--gold-primary)',
              boxShadow: isFumble && phase === 'landed'
                ? '0 0 50px rgba(255, 30, 50, 0.85), inset 0 0 25px rgba(255, 50, 50, 0.5)'
                : isMax && phase === 'landed'
                ? '0 0 60px rgba(255, 215, 0, 0.95), 0 0 100px rgba(255, 255, 255, 0.8), inset 0 0 30px #ffffff'
                : '0 0 35px rgba(212, 175, 55, 0.5), inset 0 0 20px rgba(212, 175, 55, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {/* Ícono de Calavera cuando es Pifia (1) */}
            {isFumble && phase === 'landed' ? (
              <div 
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  animation: 'skullRise 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                }}
              >
                <Skull 
                  size={76} 
                  color="#ffffff" 
                  style={{
                    filter: 'drop-shadow(0 0 12px #ff1744) drop-shadow(0 0 24px #990000)',
                    animation: 'skullGlow 1.5s infinite alternate'
                  }} 
                />
                <span 
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '1.4rem',
                    fontWeight: 900,
                    color: '#ff4d4d',
                    marginTop: '0.2rem'
                  }}
                >
                  1
                </span>
              </div>
            ) : isMax && phase === 'landed' ? (
              /* Número Dorado Resplandeciente con Destello Divino cuando es Crítico Máximo */
              <div 
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  animation: 'critScale 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                }}
              >
                <span 
                  style={{
                    fontFamily: 'var(--font-title)',
                    fontSize: '4.8rem',
                    fontWeight: 900,
                    color: '#ffffff',
                    lineHeight: 1,
                    textShadow: '0 0 16px #ffffff, 0 0 30px #ffd700, 0 0 50px #ffaa00'
                  }}
                >
                  {displayNumber}
                </span>
                <div style={{ display: 'flex', gap: '0.4rem', marginTop: '-0.3rem' }}>
                  <Sparkles size={20} color="#ffffff" style={{ filter: 'drop-shadow(0 0 6px #ffd700)' }} />
                  <Sparkles size={16} color="#ffe066" style={{ filter: 'drop-shadow(0 0 6px #ffd700)' }} />
                </div>
              </div>
            ) : (
              /* Número Normal mientras rueda o aterriza estándar */
              <span 
                style={{
                  fontFamily: 'var(--font-title)',
                  fontSize: '4.2rem',
                  fontWeight: 900,
                  color: phase === 'rolling' ? 'rgba(255, 255, 255, 0.8)' : '#ffffff',
                  lineHeight: 1,
                  textShadow: '0 2px 10px rgba(0,0,0,0.8), 0 0 16px rgba(212, 175, 55, 0.6)'
                }}
              >
                {displayNumber}
              </span>
            )}
          </div>
        </div>

        {/* BANNERS Y TEXTO POST-ATERRIZAJE */}
        {phase === 'landed' && (
          <div 
            style={{
              textAlign: 'center',
              marginTop: '1.8rem',
              animation: 'fadeInUp 0.3s ease-out'
            }}
          >
            {/* Si es Pifia */}
            {isFumble && (
              <div style={{ animation: 'pulseFumbleText 1s infinite alternate' }}>
                <div 
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    background: 'rgba(220, 20, 60, 0.25)',
                    border: '1px solid #ff3344',
                    padding: '0.5rem 1.4rem',
                    borderRadius: 'var(--radius-full)',
                    color: '#ff6b6b',
                    fontWeight: 900,
                    letterSpacing: '1px',
                    fontSize: '1.1rem',
                    boxShadow: '0 0 20px rgba(255, 50, 50, 0.4)'
                  }}
                >
                  <Flame size={20} color="#ff3344" />
                  ¡PIFIA CRÍTICA / FALLO CATASTRÓFICO!
                  <Skull size={20} color="#ff3344" />
                </div>
                <div style={{ color: '#ff9999', fontSize: '0.9rem', marginTop: '0.5rem', fontFamily: 'var(--font-mono)' }}>
                  Las fuerzas del destino te han abandonado...
                </div>
              </div>
            )}

            {/* Si es Crítico Máximo */}
            {isMax && (
              <div>
                <div 
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    background: 'rgba(255, 215, 0, 0.25)',
                    border: '1px solid #ffd700',
                    padding: '0.5rem 1.6rem',
                    borderRadius: 'var(--radius-full)',
                    color: '#fff4b8',
                    fontWeight: 900,
                    letterSpacing: '1.5px',
                    fontSize: '1.15rem',
                    boxShadow: '0 0 25px rgba(255, 215, 0, 0.6)'
                  }}
                >
                  <Sparkles size={20} color="#ffe066" />
                  ¡TIRADA MÁXIMA / GOLPE CRÍTICO DIVINO!
                  <Sparkles size={20} color="#ffe066" />
                </div>
                <div style={{ color: '#fffae6', fontSize: '0.92rem', marginTop: '0.5rem', fontFamily: 'var(--font-mono)' }}>
                  ✨ ¡Un rayo de gloria y gracia celestial desciende sobre ti! ✨
                </div>
              </div>
            )}

            {/* Tirada Estándar */}
            {!isFumble && !isMax && (
              <div 
                style={{
                  background: 'rgba(20, 24, 38, 0.85)',
                  border: '1px solid var(--border-gold)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.6rem 1.6rem',
                  display: 'inline-block',
                  boxShadow: 'var(--shadow-gold)'
                }}
              >
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.25rem', color: '#ffffff', fontWeight: 800 }}>
                  Resultado: {activeRoll.result}
                </span>
                {activeRoll.bonus !== undefined && activeRoll.bonus !== 0 && (
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.1rem', color: 'var(--text-gold)', marginLeft: '0.5rem' }}>
                    {activeRoll.bonus > 0 ? `+ ${activeRoll.bonus}` : `${activeRoll.bonus}`} = <strong style={{ color: '#ffffff', fontSize: '1.3rem' }}>{activeRoll.total}</strong>
                  </span>
                )}
              </div>
            )}

            {/* Expresión del dado */}
            <div style={{ color: 'var(--text-dim)', fontSize: '0.8rem', marginTop: '0.6rem', fontFamily: 'var(--font-mono)' }}>
              Fórmula: {activeRoll.expression} • Haz clic en la pantalla o presiona Esc para continuar
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
