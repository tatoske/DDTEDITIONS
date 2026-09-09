import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Sparkles, RefreshCw, Dices, ChevronRight, Shield, Heart, Zap, Volume2, VolumeX } from 'lucide-react';
import { CompanionId, ChatMessage, ChatAction } from '../../types/assistant';
import { Character, UserAccount } from '../../types/dnd';
import {
  COMPANION_PERSONAS,
  getDefaultCompanionForRole,
  generateCompanionResponse
} from '../../utils/companionEngine';
import { evaluateDramaticRoll, triggerDramaticDiceRoll } from '../../utils/diceRollEvent';
import {
  getCompanionSoundEnabled,
  setCompanionSoundEnabled,
  playCompanionGreetingSound,
  playParchmentFlutterSound
} from '../../utils/companionAudio';

interface CompanionWidgetProps {
  currentUser: UserAccount | null;
  activeCharacter?: Character | null;
  onOpenDiceModal?: () => void;
  onNavigateTab?: (tab: string) => void;
}

export const CompanionWidget: React.FC<CompanionWidgetProps> = ({
  currentUser,
  activeCharacter,
  onOpenDiceModal,
  onNavigateTab
}) => {
  // Las mascotas aparecen en función del rol y solo para usuarios autenticados
  if (!currentUser) return null;

  const [isOpen, setIsOpen] = useState(false);
  const currentRole = currentUser.role;

  // La mascota aparece ESTRICTAMENTE en función del rol (no todas están para todos):
  // - Jugador: La Aventurera (Elara)
  // - Dungeon Master: El Mímico Grimorio (Dienteazur)
  // - Super Master: El DM Supremo (Aurelius)
  const companionId: CompanionId = currentRole === 'supermaster' ? 'archmage' : currentRole === 'dm' ? 'mimic' : 'elara';

  // Historial de mensajes por compañero
  const [messagesByCompanion, setMessagesByCompanion] = useState<Record<CompanionId, ChatMessage[]>>({
    elara: [],
    mimic: [],
    archmage: []
  });

  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => getCompanionSoundEnabled());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeCompanion = COMPANION_PERSONAS[companionId];
  const companionColor = activeCompanion.themeColor || activeCompanion.badgeColor;
  const companionAvatar = activeCompanion.avatarUrl || activeCompanion.portraitUrl;

  // Inicializar saludo del compañero si el historial está vacío
  useEffect(() => {
    setMessagesByCompanion(prev => {
      if (prev[companionId].length > 0) return prev;
      const initialMsg: ChatMessage = {
        id: `welcome-${companionId}`,
        sender: 'companion',
        companionId: companionId,
        text: activeCompanion.greeting,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      return {
        ...prev,
        [companionId]: [initialMsg]
      };
    });
  }, [companionId, activeCompanion]);

  // Auto-scroll al fondo al recibir mensajes
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messagesByCompanion, companionId, isOpen]);

  // Enviar mensaje
  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      companionId: companionId,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessagesByCompanion(prev => ({
      ...prev,
      [companionId]: [...prev[companionId], userMsg]
    }));

    if (!textToSend) {
      setInputValue('');
    }

    setIsTyping(true);

    // Simular tiempo de respuesta orgánico
    setTimeout(() => {
      const response = generateCompanionResponse(companionId, text, {
        character: activeCharacter,
        user: currentUser
      });

      const companionMsg: ChatMessage = {
        id: `comp-${Date.now()}`,
        sender: 'companion',
        companionId: companionId,
        text: response.text,
        actions: response.actions,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessagesByCompanion(prev => ({
        ...prev,
        [companionId]: [...prev[companionId], companionMsg]
      }));
      setIsTyping(false);
      playParchmentFlutterSound();
    }, 400);
  };

  // Manejador de acciones interactivas en respuestas (Tiradas, Navegación)
  const handleActionClick = (action: ChatAction) => {
    if (action.actionType === 'roll') {
      const dice = action.payload?.dice || '1d20';
      const label = action.label.replace(/^🎲\s*/, '');
      
      const match = dice.match(/1d(\d+)(?:([+-]\d+))?/);
      const sides = match ? parseInt(match[1], 10) : 20;
      const bonus = match && match[2] ? parseInt(match[2], 10) : 0;
      const rollResult = Math.floor(Math.random() * sides) + 1;
      
      const payload = evaluateDramaticRoll(sides, rollResult, bonus, label);
      triggerDramaticDiceRoll(payload);
    } else if (action.actionType === 'navigate' && action.payload?.tab) {
      if (onNavigateTab) {
        onNavigateTab(action.payload.tab);
      }
    }
  };

  // Limpiar conversación actual
  const handleClearHistory = () => {
    setMessagesByCompanion(prev => ({
      ...prev,
      [companionId]: [
        {
          id: `welcome-${companionId}-${Date.now()}`,
          sender: 'companion',
          companionId: companionId,
          text: activeCompanion.greeting,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]
    }));
  };

  // Formateador de texto con negritas, viñetas, citas
  const renderFormattedText = (rawText: string) => {
    const lines = rawText.split('\n');
    return lines.map((line, idx) => {
      if (!line.trim()) {
        return <div key={idx} style={{ height: '0.4rem' }} />;
      }

      // Citas (> texto)
      if (line.startsWith('>')) {
        const quoteText = line.replace(/^>\s*/, '');
        return (
          <div 
            key={idx} 
            style={{
              borderLeft: `3px solid ${companionColor}`,
              paddingLeft: '0.6rem',
              paddingTop: '0.2rem',
              paddingBottom: '0.2rem',
              margin: '0.3rem 0',
              fontSize: '0.78rem',
              fontStyle: 'italic',
              color: '#fef3c7',
              backgroundColor: 'rgba(217, 119, 6, 0.1)',
              borderRadius: '0 4px 4px 0'
            }}
          >
            {formatInlineText(quoteText)}
          </div>
        );
      }

      // Viñetas (- o *)
      if (line.match(/^[\*\-]\s+/)) {
        const itemText = line.replace(/^[\*\-]\s+/, '');
        return (
          <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem', marginLeft: '0.4rem', margin: '0.15rem 0', fontSize: '0.78rem', color: '#e7e5e4' }}>
            <span style={{ color: companionColor, userSelect: 'none' }}>•</span>
            <span>{formatInlineText(itemText)}</span>
          </div>
        );
      }

      // Pasos numerados (1. item)
      const numMatch = line.match(/^(\d+)\.\s+(.*)/);
      if (numMatch) {
        return (
          <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem', marginLeft: '0.4rem', margin: '0.15rem 0', fontSize: '0.78rem', color: '#e7e5e4' }}>
            <span style={{ color: companionColor, fontWeight: 700, userSelect: 'none' }}>{numMatch[1]}.</span>
            <span>{formatInlineText(numMatch[2])}</span>
          </div>
        );
      }

      // Línea regular
      return (
        <p key={idx} style={{ fontSize: '0.78rem', lineHeight: '1.45', color: '#f5f5f4', margin: '0.2rem 0' }}>
          {formatInlineText(line)}
        </p>
      );
    });
  };

  // Formatear negritas **texto** e itálicas *texto* y código `code`
  const formatInlineText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} style={{ color: '#fcd34d', fontWeight: 600 }}>{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        return <em key={i} style={{ color: '#fde68a', fontStyle: 'italic' }}>{part.slice(1, -1)}</em>;
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return <code key={i} style={{ padding: '0.1rem 0.3rem', backgroundColor: '#0c0a09', border: '1px solid rgba(217, 119, 6, 0.3)', color: '#fcd34d', borderRadius: '4px', fontSize: '0.72rem', fontFamily: 'monospace' }}>{part.slice(1, -1)}</code>;
      }
      return part;
    });
  };

  const currentMessages = messagesByCompanion[companionId] || [];

  return (
    <div 
      style={{
        position: 'fixed',
        bottom: '1.5rem',
        right: '1.5rem',
        zIndex: 99999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        pointerEvents: 'none'
      }}
    >
      {/* Ventana de Chat Expandible */}
      {isOpen && (
        <div 
          style={{
            pointerEvents: 'auto',
            marginBottom: '0.75rem',
            width: '410px',
            maxWidth: 'calc(100vw - 2rem)',
            height: '570px',
            maxHeight: 'calc(100vh - 6rem)',
            backgroundColor: 'rgba(24, 24, 27, 0.98)',
            backdropFilter: 'blur(12px)',
            border: `1.5px solid ${companionColor}`,
            borderRadius: '1rem',
            boxShadow: `0 12px 35px -5px ${companionColor}44, 0 0 25px rgba(0,0,0,0.85)`,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            color: '#f5f5f4'
          }}
        >
          {/* Cabecera del Compañero */}
          <div 
            style={{
              padding: '0.75rem',
              borderBottom: '1px solid rgba(217, 119, 6, 0.3)',
              backgroundColor: 'rgba(12, 10, 9, 0.95)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div style={{ position: 'relative' }}>
                  <img 
                    src={companionAvatar} 
                    alt={activeCompanion.name}
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: `2px solid ${companionColor}`,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.5)'
                    }}
                  />
                  <span 
                    style={{
                      position: 'absolute',
                      bottom: '-2px',
                      right: '-2px',
                      width: '15px',
                      height: '15px',
                      borderRadius: '50%',
                      border: '2px solid #0c0a09',
                      backgroundColor: companionColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '8px'
                    }}
                  >
                    ✨
                  </span>
                </div>
                <div>
                  <h3 style={{ margin: 0, fontWeight: 700, fontSize: '0.9rem', color: '#f5f5f4', letterSpacing: '0.02em' }}>
                    {activeCompanion.name}
                  </h3>
                  <p style={{ margin: 0, fontSize: '0.72rem', color: '#f59e0b', fontWeight: 500 }}>
                    {activeCompanion.title}
                  </p>
                </div>
              </div>

              {/* Botones de Control */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <button
                  onClick={() => {
                    const next = !soundEnabled;
                    setSoundEnabled(next);
                    setCompanionSoundEnabled(next);
                    if (next) playCompanionGreetingSound(companionId);
                  }}
                  title={soundEnabled ? 'Silenciar audio del asistente' : 'Activar efectos de sonido del asistente'}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    padding: '0.35rem',
                    cursor: 'pointer',
                    color: soundEnabled ? '#f59e0b' : '#71717a',
                    borderRadius: '6px'
                  }}
                >
                  {soundEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
                </button>
                <button
                  onClick={handleClearHistory}
                  title="Reiniciar conversación"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    padding: '0.35rem',
                    cursor: 'pointer',
                    color: '#a8a29e',
                    borderRadius: '6px'
                  }}
                >
                  <RefreshCw size={15} />
                </button>
                {onOpenDiceModal && (
                  <button
                    onClick={onOpenDiceModal}
                    title="Lanzador de dados"
                    style={{
                      background: 'transparent',
                      border: 'none',
                      padding: '0.35rem',
                      cursor: 'pointer',
                      color: '#a8a29e',
                      borderRadius: '6px'
                    }}
                  >
                    <Dices size={15} />
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  title="Cerrar asistente"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    padding: '0.35rem',
                    cursor: 'pointer',
                    color: '#a8a29e',
                    borderRadius: '6px'
                  }}
                >
                  <X size={17} />
                </button>
              </div>
            </div>

            {/* Estadísticas de Ficha y Selector de Compañero */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.72rem' }}>
              {/* Stat Badges */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#d6d3d1' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', background: '#292524', padding: '0.15rem 0.45rem', borderRadius: '4px', border: '1px solid #44403c' }}>
                  <Heart size={12} color="#f87171" />
                  <span style={{ fontFamily: 'monospace', fontWeight: 700 }}>{activeCompanion.stats.hp}</span>
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', background: '#292524', padding: '0.15rem 0.45rem', borderRadius: '4px', border: '1px solid #44403c' }}>
                  <Zap size={12} color="#38bdf8" />
                  DES <span style={{ fontFamily: 'monospace', fontWeight: 700 }}>{activeCompanion.stats.dex}</span>
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', background: '#292524', padding: '0.15rem 0.45rem', borderRadius: '4px', border: '1px solid #44403c' }}>
                  <Shield size={12} color="#fbbf24" />
                  FUE <span style={{ fontFamily: 'monospace', fontWeight: 700 }}>{activeCompanion.stats.str}</span>
                </span>
              </div>

              {/* Insignia Exclusiva de Mascota por Rol */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.35rem', 
                background: '#1c1917', 
                border: `1px solid ${companionColor}66`, 
                borderRadius: '6px', 
                padding: '0.2rem 0.6rem',
                color: companionColor,
                fontWeight: 700,
                fontSize: '0.7rem'
              }}>
                <Sparkles size={11} />
                <span>
                  {currentRole === 'player' ? 'Guía del Aventurero' : currentRole === 'dm' ? 'Grimorio del DM' : 'Vigilante Supremo'}
                </span>
              </div>
            </div>
          </div>

          {/* Área de Mensajes */}
          <div 
            style={{
              flex: 1,
              padding: '0.75rem',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.65rem',
              backgroundColor: '#18181b'
            }}
          >
            {currentMessages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: isUser ? 'flex-end' : 'flex-start'
                  }}
                >
                  <div
                    style={{
                      maxWidth: '88%',
                      borderRadius: isUser ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                      padding: '0.65rem 0.8rem',
                      backgroundColor: isUser ? '#451a03' : '#27272a',
                      border: isUser ? '1px solid #b45309' : '1px solid #3f3f46',
                      color: isUser ? '#fef3c7' : '#f5f5f4',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
                    }}
                  >
                    {!isUser && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.35rem', fontSize: '0.68rem', color: '#fbbf24', fontWeight: 600 }}>
                        <Sparkles size={11} />
                        <span>{activeCompanion.name}</span>
                        <span style={{ marginLeft: 'auto', color: '#71717a' }}>{msg.timestamp}</span>
                      </div>
                    )}

                    {isUser ? (
                      <p style={{ margin: 0, fontSize: '0.8rem', lineHeight: 1.4, color: '#fef3c7' }}>{msg.text}</p>
                    ) : (
                      <div>
                        {renderFormattedText(msg.text)}
                      </div>
                    )}

                    {/* Botones de Acción Interactivos */}
                    {msg.actions && msg.actions.length > 0 && (
                      <div style={{ marginTop: '0.5rem', paddingTop: '0.4rem', borderTop: '1px solid #3f3f46', display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                        {msg.actions.map((act, aIdx) => (
                          <button
                            key={aIdx}
                            onClick={() => handleActionClick(act)}
                            style={{
                              fontSize: '0.72rem',
                              padding: '0.25rem 0.6rem',
                              backgroundColor: 'rgba(217, 119, 6, 0.25)',
                              color: '#fcd34d',
                              border: '1px solid rgba(217, 119, 6, 0.5)',
                              borderRadius: '6px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.25rem',
                              cursor: 'pointer',
                              fontWeight: 600
                            }}
                          >
                            <span>{act.label}</span>
                            <ChevronRight size={11} />
                          </button>
                        ))}
                      </div>
                    )}

                    {isUser && (
                      <div style={{ fontSize: '0.65rem', color: 'rgba(252, 211, 77, 0.6)', textAlign: 'right', marginTop: '0.2rem' }}>
                        {msg.timestamp}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Animación de Pensamiento */}
            {isTyping && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.4rem 0.75rem', backgroundColor: '#27272a', borderRadius: '8px', border: '1px solid #3f3f46', width: 'fit-content' }}>
                <span style={{ fontSize: '0.72rem', color: '#a1a1aa' }}>
                  {activeCompanion.name.split(' ')[0]} está consultando los pergaminos arcanos...
                </span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Carrusel de Consultas Rápidas */}
          <div style={{ padding: '0.5rem 0.75rem', backgroundColor: '#18181b', borderTop: '1px solid rgba(217, 119, 6, 0.2)' }}>
            <div style={{ fontSize: '0.68rem', color: '#fbbf24', marginBottom: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Sparkles size={11} />
              <span>Consultas rápidas con {activeCompanion.name.split(' ')[0]}:</span>
            </div>
            <div style={{ display: 'flex', gap: '0.4rem', overflowX: 'auto', paddingBottom: '0.2rem' }}>
              {activeCompanion.quickPrompts.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleSendMessage(p.query)}
                  style={{
                    whiteSpace: 'nowrap',
                    padding: '0.2rem 0.55rem',
                    fontSize: '0.72rem',
                    backgroundColor: '#27272a',
                    color: '#e4e4e7',
                    border: '1px solid #3f3f46',
                    borderRadius: '9999px',
                    cursor: 'pointer',
                    flexShrink: 0
                  }}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Campo de Entrada de Mensajes */}
          <div style={{ padding: '0.6rem 0.75rem', backgroundColor: '#09090b', borderTop: '1px solid #27272a' }}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={`Pregunta a ${activeCompanion.name.split(' ')[0]} sobre reglas, dados o la partida...`}
                style={{
                  flex: 1,
                  backgroundColor: '#18181b',
                  border: '1px solid #3f3f46',
                  borderRadius: '8px',
                  padding: '0.45rem 0.65rem',
                  fontSize: '0.78rem',
                  color: '#f5f5f4',
                  outline: 'none'
                }}
              />
              <button
                type="submit"
                disabled={!inputValue.trim()}
                title="Enviar pregunta"
                style={{
                  padding: '0.45rem 0.7rem',
                  backgroundColor: inputValue.trim() ? '#d97706' : '#52525b',
                  color: '#09090b',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: inputValue.trim() ? 'pointer' : 'default',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Send size={15} />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Botón Flotante / Orbe de Asistente */}
      <button
        onClick={() => {
          const nextState = !isOpen;
          setIsOpen(nextState);
          if (nextState) playCompanionGreetingSound(companionId);
        }}
        style={{
          pointerEvents: 'auto',
          cursor: 'pointer',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '0.45rem 1rem 0.45rem 0.45rem',
          borderRadius: '9999px',
          backgroundColor: '#18181b',
          border: `2px solid ${companionColor}`,
          boxShadow: `0 0 20px -3px ${companionColor}aa, 0 10px 25px rgba(0,0,0,0.85)`,
          transition: 'all 0.2s ease'
        }}
        title={`Consultar a ${activeCompanion.name}`}
      >
        <div style={{ position: 'relative' }}>
          <img
            src={companionAvatar}
            alt={activeCompanion.name}
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: `2px solid ${companionColor}`,
              display: 'block'
            }}
          />
          <span 
            style={{
              position: 'absolute',
              bottom: '-2px',
              right: '-2px',
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              border: '2px solid #18181b',
              backgroundColor: companionColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '9px'
            }}
          >
            💬
          </span>
        </div>

        <div style={{ textAlign: 'left' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f5f5f4' }}>
              {activeCompanion.name.split(' ')[0]}
            </span>
            <span 
              style={{
                fontSize: '0.62rem',
                padding: '0.1rem 0.35rem',
                borderRadius: '4px',
                fontWeight: 700,
                color: '#09090b',
                backgroundColor: companionColor
              }}
            >
              Guía
            </span>
          </div>
          <div style={{ fontSize: '0.68rem', color: '#a1a1aa' }}>
            {activeCompanion.title}
          </div>
        </div>
      </button>
    </div>
  );
};
