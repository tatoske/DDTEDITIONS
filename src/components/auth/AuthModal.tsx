import React, { useState } from 'react';
import { UserAccount, UserRole } from '../../types/dnd';
import { 
  SUPER_MASTER_EMAIL, 
  SUPER_MASTER_PASS, 
  INITIAL_USERS,
  isSuperMasterEmail 
} from '../../utils/campaignAuthMath';
import { Crown, Shield, User, X, Key, Mail, Sparkles, Coins, ArrowRight, UserPlus, LogOut, CheckCircle2, Lock } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount | null;
  allUsers: UserAccount[];
  onLogin: (user: UserAccount) => void;
  onRegister: (newUser: UserAccount) => void;
  onLogout: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  allUsers,
  onLogin,
  onRegister,
  onLogout
}) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('player');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  // Autocompletar y probar rol desde la pantalla de login
  const handleSelectTestAccount = (role: 'supermaster' | 'dm' | 'player') => {
    setErrorMsg(null);
    if (role === 'supermaster') {
      const sm = allUsers.find(u => isSuperMasterEmail(u.email)) || INITIAL_USERS[0];
      setEmail(SUPER_MASTER_EMAIL);
      setPassword(SUPER_MASTER_PASS);
      onLogin(sm);
      onClose();
    } else if (role === 'dm') {
      const dm = allUsers.find(u => u.role === 'dm') || INITIAL_USERS[1];
      setEmail(dm.email);
      setPassword('master123');
      onLogin(dm);
      onClose();
    } else {
      const p = allUsers.find(u => u.role === 'player') || INITIAL_USERS[2];
      setEmail(p.email);
      setPassword('sergio123');
      onLogin(p);
      onClose();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const cleanEmail = email.trim().toLowerCase();

    // Verificación especial del Super Master
    if (isSuperMasterEmail(cleanEmail)) {
      if (password !== SUPER_MASTER_PASS) {
        setErrorMsg('Contraseña incorrecta para la cuenta suprema del Super Master.');
        return;
      }
      let smUser = allUsers.find(u => isSuperMasterEmail(u.email));
      if (!smUser) {
        smUser = {
          id: 'user_supermaster_official',
          email: SUPER_MASTER_EMAIL,
          username: 'Gran Patriarca (Super Master)',
          role: 'supermaster',
          goldDragons: 999999,
          permissions: { bastionUnlocked: true, sidekicksUnlocked: true },
          createdAt: new Date().toISOString()
        };
        onRegister(smUser);
      }
      onLogin(smUser);
      onClose();
      return;
    }

    if (mode === 'login') {
      const found = allUsers.find(u => u.email.toLowerCase() === cleanEmail);
      if (!found) {
        setErrorMsg('No se encontró ninguna cuenta con este correo. Puedes crear una nueva en "Registrarse".');
        return;
      }
      onLogin(found);
      onClose();
    } else {
      // Registro
      if (!username.trim()) {
        setErrorMsg('Por favor ingresa un nombre para tu aventurero o Master.');
        return;
      }
      const existing = allUsers.find(u => u.email.toLowerCase() === cleanEmail);
      if (existing) {
        setErrorMsg('Ya existe una cuenta con este correo electrónico.');
        return;
      }

      const newUser: UserAccount = {
        id: `user_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        email: cleanEmail,
        username: username.trim(),
        role: selectedRole === 'supermaster' ? 'player' : selectedRole, // Solo TatoSenpaiSape puede ser Super Master
        goldDragons: selectedRole === 'dm' ? 1500 : 250, // Fondos iniciales de bienvenida
        permissions: { bastionUnlocked: false, sidekicksUnlocked: false }, // Bloqueados hasta aprobación del Super Master
        createdAt: new Date().toISOString()
      };

      onRegister(newUser);
      onLogin(newUser);
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '560px' }}>
        {/* Header del Modal */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', borderBottom: '1px solid var(--border-gold)', paddingBottom: '0.6rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div className="brand-icon" style={{ width: '34px', height: '34px', background: 'linear-gradient(135deg, #d4af37, #9a7d23)' }}>
              <Key size={18} color="#ffffff" />
            </div>
            <div>
              <h2 style={{ margin: 0, padding: 0, border: 'none', fontSize: '1.25rem' }}>
                {currentUser ? 'Perfil de Aventurero' : 'Acceso al Reino de D&D'}
              </h2>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                {currentUser ? 'Gestión de tu cuenta y privilegios' : 'Inicia sesión o regístrate para jugar'}
              </span>
            </div>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={onClose} style={{ padding: '0.3rem' }}>
            <X size={18} />
          </button>
        </div>

        {/* VISTA 1: Usuario con Sesión Activa */}
        {currentUser ? (
          <div>
            <div style={{
              background: 'linear-gradient(135deg, rgba(20, 24, 38, 0.95), rgba(11, 13, 20, 0.95))',
              border: `1px solid ${currentUser.role === 'supermaster' ? 'var(--gold-primary)' : 'var(--border-subtle)'}`,
              borderRadius: 'var(--radius-md)',
              padding: '1.2rem',
              marginBottom: '1.2rem',
              boxShadow: currentUser.role === 'supermaster' ? 'var(--shadow-gold)' : 'none'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem', marginBottom: '1rem' }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  background: currentUser.role === 'supermaster' ? 'linear-gradient(135deg, #ffd700, #b8860b)' : currentUser.role === 'dm' ? 'linear-gradient(135deg, #9d4edd, #5a189a)' : 'linear-gradient(135deg, #2b8a3e, #1b5e20)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  fontWeight: 900
                }}>
                  {currentUser.role === 'supermaster' ? <Crown size={26} /> : currentUser.role === 'dm' ? <Shield size={24} /> : <User size={24} />}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <strong style={{ fontSize: '1.1rem', color: '#ffffff' }}>{currentUser.username}</strong>
                    <span className={`badge ${currentUser.role === 'supermaster' ? 'badge-gold' : currentUser.role === 'dm' ? 'badge-magic' : 'badge-sapphire'}`} style={{ fontSize: '0.75rem' }}>
                      {currentUser.role === 'supermaster' ? '👑 Super Master' : currentUser.role === 'dm' ? '📜 Master' : '⚔️ Jugador'}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>{currentUser.email}</div>
                </div>
              </div>

              {/* Balance de Dragones de Oro */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.6rem 0.8rem',
                background: 'rgba(212, 175, 55, 0.08)',
                border: '1px solid rgba(212, 175, 55, 0.2)',
                borderRadius: 'var(--radius-sm)',
                marginBottom: '0.8rem'
              }}>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-dim)' }}>Bolsa Imperial:</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--gold-hover)', fontSize: '1rem', fontWeight: 800 }}>
                  <Coins size={16} />
                  {currentUser.role === 'supermaster' ? '∞ Dragones de Oro (Tesorería Ilimitada)' : `${currentUser.goldDragons.toLocaleString()} Dragones de Oro (DO)`}
                </span>
              </div>

              {/* Estado de Decretos / Privilegios Feudales */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <div style={{
                  padding: '0.5rem 0.7rem',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}>
                  {currentUser.role === 'supermaster' || currentUser.permissions?.bastionUnlocked ? (
                    <><CheckCircle2 size={13} color="#2b8a3e" /> <span>Bastión 2024: <strong>Habilitado</strong></span></>
                  ) : (
                    <><Lock size={13} color="#e03131" /> <span style={{ color: 'var(--text-dim)' }}>Bastión: <em>Bloqueado</em></span></>
                  )}
                </div>

                <div style={{
                  padding: '0.5rem 0.7rem',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}>
                  {currentUser.role === 'supermaster' || currentUser.permissions?.sidekicksUnlocked ? (
                    <><CheckCircle2 size={13} color="#2b8a3e" /> <span>Escuderos: <strong>Habilitados</strong></span></>
                  ) : (
                    <><Lock size={13} color="#e03131" /> <span style={{ color: 'var(--text-dim)' }}>Escuderos: <em>Bloqueados</em></span></>
                  )}
                </div>
              </div>
            </div>

            {/* Acciones de la cuenta */}
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.8rem' }}>
              <button 
                className="btn btn-danger btn-sm" 
                onClick={() => {
                  onLogout();
                  setEmail('');
                  setPassword('');
                }}
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <LogOut size={15} /> Cerrar Sesión
              </button>

              <button className="btn btn-secondary btn-sm" onClick={onClose}>
                Volver a la Mesa
              </button>
            </div>
          </div>
        ) : (
          /* VISTA 2: No Conectado -> Pantalla de Inicio de Sesión / Registro */
          <div>
            {/* Pestañas Login vs Registro */}
            <div style={{ display: 'flex', borderBottom: '1px solid var(--border-subtle)', marginBottom: '1.2rem' }}>
              <button
                className={`tab-btn ${mode === 'login' ? 'active' : ''}`}
                onClick={() => { setMode('login'); setErrorMsg(null); }}
                style={{ flex: 1, padding: '0.6rem', textAlign: 'center' }}
              >
                Iniciar Sesión
              </button>
              <button
                className={`tab-btn ${mode === 'register' ? 'active' : ''}`}
                onClick={() => { setMode('register'); setErrorMsg(null); }}
                style={{ flex: 1, padding: '0.6rem', textAlign: 'center' }}
              >
                Registrar Nuevo Usuario
              </button>
            </div>

            {/* Mensaje de Error */}
            {errorMsg && (
              <div style={{
                background: 'rgba(201, 42, 42, 0.15)',
                border: '1px solid #ff3344',
                borderRadius: 'var(--radius-sm)',
                padding: '0.6rem 0.8rem',
                color: '#ff6b6b',
                fontSize: '0.85rem',
                marginBottom: '1rem'
              }}>
                {errorMsg}
              </div>
            )}

            {/* Formulario */}
            <form onSubmit={handleSubmit}>
              {mode === 'register' && (
                <>
                  <div style={{ marginBottom: '1rem' }}>
                    <label>Nombre de Usuario / Aventurero</label>
                    <input
                      type="text"
                      placeholder="Ej. Gandalf el Gris o Sir Tristán"
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                      required
                    />
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <label>Rol Inicial en la Mesa</label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                      <button
                        type="button"
                        className={`btn ${selectedRole === 'player' ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setSelectedRole('player')}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                      >
                        <User size={16} /> Jugador
                      </button>
                      <button
                        type="button"
                        className={`btn ${selectedRole === 'dm' ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setSelectedRole('dm')}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                      >
                        <Shield size={16} /> Dungeon Master
                      </button>
                    </div>
                    <span style={{ fontSize: '0.74rem', color: 'var(--text-dim)', marginTop: '0.2rem', display: 'block' }}>
                      * El rol de Super Master es único y reservado exclusivamente para la cuenta imperial.
                    </span>
                  </div>
                </>
              )}

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Mail size={14} /> Correo Electrónico
                </label>
                <input
                  type="email"
                  placeholder="tu_correo@ejemplo.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>

              <div style={{ marginBottom: '1.4rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Key size={14} /> Contraseña
                </label>
                <input
                  type="password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.8rem' }}>
                <button type="button" className="btn btn-secondary" onClick={onClose}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  {mode === 'login' ? (
                    <>Entrar al Reino <ArrowRight size={16} /></>
                  ) : (
                    <>Crear Cuenta <UserPlus size={16} /></>
                  )}
                </button>
              </div>
            </form>

            {/* SECCIÓN DISCRETA DENTRO DEL LOGIN: Probar los Diferentes Roles */}
            {mode === 'login' && (
              <div style={{
                marginTop: '1.5rem',
                padding: '0.85rem 1rem',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px dashed rgba(212, 175, 55, 0.25)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-gold)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Sparkles size={13} /> Probar Roles de Demostración:
                  </span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                    Acceso rápido de prueba
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                  <button
                    type="button"
                    className="btn btn-secondary btn-xs"
                    onClick={() => handleSelectTestAccount('supermaster')}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      padding: '0.5rem 0.3rem',
                      border: '1px solid rgba(212, 175, 55, 0.4)',
                      background: 'rgba(212, 175, 55, 0.08)'
                    }}
                    title="Entrar como Super Master (TatoSenpaiSape)"
                  >
                    <Crown size={15} color="var(--gold-hover)" />
                    <span style={{ fontSize: '0.74rem', fontWeight: 800, marginTop: '0.2rem', color: 'var(--gold-hover)' }}>Super Master</span>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>TatoSenpaiSape</span>
                  </button>

                  <button
                    type="button"
                    className="btn btn-secondary btn-xs"
                    onClick={() => handleSelectTestAccount('dm')}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      padding: '0.5rem 0.3rem'
                    }}
                    title="Entrar como Master (Elminster)"
                  >
                    <Shield size={15} color="#9d4edd" />
                    <span style={{ fontSize: '0.74rem', fontWeight: 700, marginTop: '0.2rem' }}>Master</span>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>Elminster</span>
                  </button>

                  <button
                    type="button"
                    className="btn btn-secondary btn-xs"
                    onClick={() => handleSelectTestAccount('player')}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      padding: '0.5rem 0.3rem'
                    }}
                    title="Entrar como Jugador (Sergio Valeros)"
                  >
                    <User size={15} color="#2b8a3e" />
                    <span style={{ fontSize: '0.74rem', fontWeight: 700, marginTop: '0.2rem' }}>Jugador</span>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>Sergio Valeros</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
