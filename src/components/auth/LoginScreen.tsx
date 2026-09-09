import React, { useState } from 'react';
import { UserAccount, UserRole } from '../../types/dnd';
import { 
  SUPER_MASTER_EMAIL, 
  SUPER_MASTER_PASS, 
  DEFAULT_USER_PASS,
  INITIAL_USERS,
  isSuperMasterEmail,
  authenticateUserCredentials
} from '../../utils/campaignAuthMath';
import { Crown, Shield, User, Key, Mail, Sparkles, Dices, ArrowRight, UserPlus, Scroll, BookOpen, Lock } from 'lucide-react';

interface LoginScreenProps {
  onLogin: (user: UserAccount) => void;
  onRegister: (newUser: UserAccount) => void;
  allUsers: UserAccount[];
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLogin,
  onRegister,
  allUsers
}) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('player');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Acceso directo con cuentas de prueba desde el login
  const handleTestAccountLogin = (role: 'supermaster' | 'dm' | 'player') => {
    setErrorMsg(null);
    if (role === 'supermaster') {
      setEmail(SUPER_MASTER_EMAIL);
      setPassword(SUPER_MASTER_PASS);
      const sm = allUsers.find(u => isSuperMasterEmail(u.email)) || INITIAL_USERS[0];
      onLogin(sm);
    } else if (role === 'dm') {
      setEmail('master_elminster@dnd.com');
      setPassword(DEFAULT_USER_PASS);
      const dm = allUsers.find(u => u.role === 'dm') || INITIAL_USERS[1];
      onLogin(dm);
    } else {
      setEmail('jugador_sergio@dnd.com');
      setPassword(DEFAULT_USER_PASS);
      const player = allUsers.find(u => u.role === 'player') || INITIAL_USERS[2];
      onLogin(player);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    if (mode === 'login') {
      const auth = authenticateUserCredentials(allUsers, cleanEmail, cleanPass);
      if (!auth.success || !auth.user) {
        setErrorMsg(auth.error || 'Credenciales inválidas.');
        return;
      }
      onLogin(auth.user);
    } else {
      // Registro de nuevo usuario
      if (!cleanEmail) {
        setErrorMsg('Por favor ingresa un correo electrónico.');
        return;
      }
      if (!username.trim()) {
        setErrorMsg('Por favor ingresa un nombre para tu aventurero o Master.');
        return;
      }
      if (!cleanPass || cleanPass.length < 6) {
        setErrorMsg('La contraseña debe contener al menos 6 caracteres.');
        return;
      }
      const existing = allUsers.find(u => u.email.toLowerCase() === cleanEmail);
      if (existing) {
        setErrorMsg('Ya existe una cuenta con este correo electrónico. Inicia sesión en su lugar.');
        return;
      }

      const newUser: UserAccount = {
        id: `user_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        email: cleanEmail,
        username: username.trim(),
        password: cleanPass,
        role: selectedRole === 'supermaster' ? 'player' : selectedRole,
        goldDragons: selectedRole === 'dm' ? 1500 : 250,
        permissions: { bastionUnlocked: false, sidekicksUnlocked: false },
        createdAt: new Date().toISOString()
      };

      onRegister(newUser);
      onLogin(newUser);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(circle at 50% 20%, rgba(212, 175, 55, 0.08) 0%, rgba(10, 12, 18, 0.98) 75%), #07090e',
      padding: '2rem 1rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Resplandor decorativo arcano */}
      <div style={{
        position: 'absolute',
        width: '600px',
        height: '600px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(212, 175, 55, 0.04) 0%, transparent 70%)',
        top: '-150px',
        pointerEvents: 'none'
      }} />

      {/* Cabecera del Reino */}
      <div style={{ textAlign: 'center', marginBottom: '2rem', maxWidth: '640px', zIndex: 1 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #d4af37, #9a7d23)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(212, 175, 55, 0.35)',
            border: '1px solid rgba(255, 215, 0, 0.6)'
          }}>
            <Dices size={28} color="#0b0d14" />
          </div>
          <h1 style={{
            margin: 0,
            fontSize: '2.4rem',
            fontWeight: 900,
            background: 'linear-gradient(135deg, #ffffff 40%, #ffd700 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '1px'
          }}>
            D&D T Editions
          </h1>
        </div>

        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.98rem', lineHeight: 1.5 }}>
          Herramienta Integral D&D 2024 • Tablero de Campañas, Grimorio de Héroes & Compendio Oficial
        </p>
      </div>

      {/* Tarjeta de Autenticación Principal */}
      <div className="card" style={{
        width: '100%',
        maxWidth: '520px',
        padding: '2rem',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-gold)',
        background: 'linear-gradient(180deg, rgba(17, 21, 33, 0.95) 0%, rgba(10, 13, 20, 0.98) 100%)',
        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.6), 0 0 30px rgba(212, 175, 55, 0.1)',
        zIndex: 1
      }}>
        {/* Selector de Pestañas: Login vs Registro */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid var(--border-subtle)',
          marginBottom: '1.5rem',
          gap: '0.5rem'
        }}>
          <button
            type="button"
            className={`tab-btn ${mode === 'login' ? 'active' : ''}`}
            onClick={() => { setMode('login'); setErrorMsg(null); }}
            style={{
              flex: 1,
              padding: '0.75rem',
              textAlign: 'center',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
          >
            <Key size={16} /> Iniciar Sesión
          </button>
          <button
            type="button"
            className={`tab-btn ${mode === 'register' ? 'active' : ''}`}
            onClick={() => { setMode('register'); setErrorMsg(null); }}
            style={{
              flex: 1,
              padding: '0.75rem',
              textAlign: 'center',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
          >
            <UserPlus size={16} /> Registrarse
          </button>
        </div>

        {/* Notificación de Error */}
        {errorMsg && (
          <div style={{
            background: 'rgba(201, 42, 42, 0.15)',
            border: '1px solid #ff3344',
            borderRadius: 'var(--radius-sm)',
            padding: '0.7rem 0.9rem',
            color: '#ff6b6b',
            fontSize: '0.85rem',
            marginBottom: '1.2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <Lock size={15} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Formulario de Entrada */}
        <form onSubmit={handleSubmit}>
          {mode === 'register' && (
            <>
              <div style={{ marginBottom: '1.1rem' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem', display: 'block' }}>
                  Nombre del Aventurero / Master:
                </label>
                <input
                  type="text"
                  placeholder="Ej. Gandalf el Gris o Sir Tristán"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  required
                />
              </div>

              <div style={{ marginBottom: '1.1rem' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem', display: 'block' }}>
                  Rol en la Mesa:
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                  <button
                    type="button"
                    className={`btn ${selectedRole === 'player' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setSelectedRole('player')}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.6rem' }}
                  >
                    <User size={16} /> ⚔️ Jugador
                  </button>
                  <button
                    type="button"
                    className={`btn ${selectedRole === 'dm' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setSelectedRole('dm')}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.6rem' }}
                  >
                    <Shield size={16} /> 📜 Dungeon Master
                  </button>
                </div>
              </div>
            </>
          )}

          <div style={{ marginBottom: '1.1rem' }}>
            <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Mail size={14} /> Correo Electrónico:
            </label>
            <input
              type="email"
              placeholder="tu_correo@ejemplo.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Key size={14} /> Contraseña:
            </label>
            <input
              type="password"
              placeholder="••••••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary glow-hover"
            style={{
              width: '100%',
              padding: '0.85rem',
              fontSize: '1rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.6rem',
              borderRadius: 'var(--radius-md)'
            }}
          >
            {mode === 'login' ? (
              <>Entrar al Reino <ArrowRight size={18} /></>
            ) : (
              <>Crear Cuenta e Ingresar <UserPlus size={18} /></>
            )}
          </button>
        </form>

        {/* SECCIÓN DISCRETA DE PRUEBA DENTRO DEL LOGIN */}
        {mode === 'login' && (
          <div style={{
            marginTop: '1.6rem',
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px dashed rgba(212, 175, 55, 0.3)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-gold)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Sparkles size={14} /> Probar Roles de Demostración:
              </span>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>Acceso rápido con 1-clic</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
              <button
                type="button"
                className="btn btn-secondary btn-xs"
                onClick={() => handleTestAccountLogin('supermaster')}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '0.55rem 0.3rem',
                  border: '1px solid rgba(212, 175, 55, 0.4)',
                  background: 'rgba(212, 175, 55, 0.08)'
                }}
                title="Ingresar como Super Master (TatoSenpaiSape)"
              >
                <Crown size={16} color="var(--gold-hover)" />
                <span style={{ fontSize: '0.74rem', fontWeight: 800, marginTop: '0.2rem', color: 'var(--gold-hover)' }}>Super Master</span>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>TatoSenpaiSape</span>
              </button>

              <button
                type="button"
                className="btn btn-secondary btn-xs"
                onClick={() => handleTestAccountLogin('dm')}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '0.55rem 0.3rem'
                }}
                title="Ingresar como Master (Elminster)"
              >
                <Shield size={16} color="#9d4edd" />
                <span style={{ fontSize: '0.74rem', fontWeight: 700, marginTop: '0.2rem' }}>Master</span>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>Elminster</span>
              </button>

              <button
                type="button"
                className="btn btn-secondary btn-xs"
                onClick={() => handleTestAccountLogin('player')}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '0.55rem 0.3rem'
                }}
                title="Ingresar como Jugador (Sergio Valeros)"
              >
                <User size={16} color="#2b8a3e" />
                <span style={{ fontSize: '0.74rem', fontWeight: 700, marginTop: '0.2rem' }}>Jugador</span>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>Sergio Valeros</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Pie de Página */}
      <div style={{ marginTop: '1.8rem', color: 'var(--text-dim)', fontSize: '0.8rem', textAlign: 'center' }}>
        <span>D&D T Editions • Todos los módulos de 5ª Edición & Actualización Oficial 2024</span>
      </div>
    </div>
  );
};
