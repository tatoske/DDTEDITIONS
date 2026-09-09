import React, { useState, useEffect } from 'react';
import { Character, Monster, Spell } from './types/dnd';
import { INITIAL_MONSTERS } from './data/initialData';
import { CharacterWizard } from './components/player/CharacterWizard';
import { CharacterSheet } from './components/player/CharacterSheet';
import { BastionManager } from './components/player/BastionManager';
import { Bestiary } from './components/dm/Bestiary';
import { MonsterBuilder } from './components/dm/MonsterBuilder';
import { EncounterTracker } from './components/dm/EncounterTracker';
import { QuickRules } from './components/dm/QuickRules';
import { BookSearch } from './components/dm/BookSearch';
import { NpcAdventureGenerator } from './components/dm/NpcAdventureGenerator';
import { SpellsCompendium } from './components/dm/SpellsCompendium';
import { ShopGenerator } from './components/dm/ShopGenerator';
import { MagicItemsCompendium } from './components/dm/MagicItemsCompendium';
import { TrapsHazardsGenerator } from './components/dm/TrapsHazardsGenerator';
import { DowntimeManager } from './components/dm/DowntimeManager';
import { BiomesEncounterGenerator } from './components/dm/BiomesEncounterGenerator';
import { RavenloftSuite } from './components/dm/RavenloftSuite';
import { FeatsCompendium } from './components/dm/FeatsCompendium';
import { SidekicksManager } from './components/player/SidekicksManager';
import { GroupPatronsManager } from './components/dm/GroupPatronsManager';
import { DragonmarksCompendium } from './components/dm/DragonmarksCompendium';
import { ChasesAndLairsManager } from './components/dm/ChasesAndLairsManager';
import { WeatherAndVoyageManager } from './components/dm/WeatherAndVoyageManager';
import { SpeciesCompendium } from './components/dm/SpeciesCompendium';
import { PoisonsAndAlchemyManager } from './components/dm/PoisonsAndAlchemyManager';
import { MonsterTacticsAndLairsManager } from './components/dm/MonsterTacticsAndLairsManager';
import { TreasureGeneratorManager } from './components/dm/TreasureGeneratorManager';
import { VecnaDossierManager } from './components/dm/VecnaDossierManager';
import { YoungAdventurersGuide } from './components/dm/YoungAdventurersGuide';
import { BackupExportModal } from './components/common/BackupExportModal';
import { DramaticDiceOverlay } from './components/common/DramaticDiceOverlay';
import { AuthModal } from './components/auth/AuthModal';
import { LoginScreen } from './components/auth/LoginScreen';
import { CampaignQuestBoard } from './components/campaigns/CampaignQuestBoard';
import { AdventureGrimoireProfile } from './components/player/AdventureGrimoireProfile';
import { SuperMasterDashboard } from './components/supermaster/SuperMasterDashboard';
import { DmTargetAdventurerBar } from './components/dm/DmTargetAdventurerBar';
import { DmQuickRewardModal } from './components/dm/DmQuickRewardModal';
import { CompanionWidget } from './components/assistant/CompanionWidget';
import { SIDEKICK_PRESETS } from './data/sidekicksData';
import { Sidekick, ActivePatronCampaignState, UserAccount, CampaignQuest } from './types/dnd';
import { 
  INITIAL_USERS, 
  INITIAL_CAMPAIGN_QUESTS, 
  LOCAL_STORAGE_AUTH_USER_KEY, 
  LOCAL_STORAGE_USERS_KEY, 
  LOCAL_STORAGE_QUESTS_KEY 
} from './utils/campaignAuthMath';
import { DiceRollerModal } from './components/common/DiceRollerModal';
import { Shield, Skull, Plus, Dices, BookOpen, Swords, User, Sparkles, Sun, Moon, ShoppingBag, UserCheck, Wand2, Castle, AlertTriangle, Star, Clock, Trees, Ghost, Users, Award, Crown, Zap, Footprints, Compass, FlaskConical, Coins, Eye, Flame, Database, Lock, Unlock, LogIn, Key, Scroll } from 'lucide-react';

const LOCAL_STORAGE_CHAR_KEY = 'dnd_t_editions_characters_v1';
const LOCAL_STORAGE_MONSTER_KEY = 'dnd_t_editions_monsters_v1';
const LOCAL_STORAGE_THEME_KEY = 'dnd_t_editions_theme_v1';
const LOCAL_STORAGE_SIDEKICKS_KEY = 'dnd_t_editions_sidekicks_v1';
const LOCAL_STORAGE_PATRON_KEY = 'dnd_t_editions_campaign_patron_v1';

export const App: React.FC = () => {
  // Tema: Claro (Pergamino Marfil) por defecto
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_THEME_KEY);
    return (saved === 'dark' || saved === 'light') ? saved : 'light';
  });

  // Modo Global: Jugador vs DM
  const [roleMode, setRoleMode] = useState<'player' | 'dm'>('player');

  // Pestaña Principal de Navegación: 'player' | 'dm' | 'quests' | 'grimoire' | 'supermaster'
  const [mainNavTab, setMainNavTab] = useState<'player' | 'dm' | 'quests' | 'grimoire' | 'supermaster'>('player');

  // Usuarios y Autenticación Multi-Rol (Jugador, Master, Super Master)
  const [allUsers, setAllUsers] = useState<UserAccount[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_USERS_KEY);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { }
    }
    return INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_AUTH_USER_KEY);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { }
    }
    return null; // ¡La primera vista obligatoria es el Login!
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isQuickRewardModalOpen, setIsQuickRewardModalOpen] = useState<boolean>(false);

  // Misiones y Campañas del Reino
  const [quests, setQuests] = useState<CampaignQuest[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_QUESTS_KEY);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { }
    }
    return INITIAL_CAMPAIGN_QUESTS;
  });

  // Persistencia de Usuarios y Sesión
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_USERS_KEY, JSON.stringify(allUsers));
  }, [allUsers]);

  // Sincronización reactiva de sesión activa: Si el Super Master u otra acción actualiza allUsers, reflejarlo en currentUser
  useEffect(() => {
    if (currentUser) {
      const freshUser = allUsers.find(u => u.id === currentUser.id);
      if (freshUser) {
        if (
          freshUser.role !== currentUser.role ||
          freshUser.goldDragons !== currentUser.goldDragons ||
          freshUser.permissions?.bastionUnlocked !== currentUser.permissions?.bastionUnlocked ||
          freshUser.permissions?.sidekicksUnlocked !== currentUser.permissions?.sidekicksUnlocked ||
          freshUser.username !== currentUser.username ||
          freshUser.email !== currentUser.email
        ) {
          setCurrentUser(freshUser);
        }
      }
    }
  }, [allUsers]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(LOCAL_STORAGE_AUTH_USER_KEY, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(LOCAL_STORAGE_AUTH_USER_KEY);
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_QUESTS_KEY, JSON.stringify(quests));
  }, [quests]);

  // Manejadores de Campañas y Usuarios
  const handleSaveQuest = (updatedQuest: CampaignQuest) => {
    setQuests(prev => {
      const idx = prev.findIndex(q => q.id === updatedQuest.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = updatedQuest;
        return copy;
      }
      return [updatedQuest, ...prev];
    });
  };

  const handleDeleteQuest = (questId: string) => {
    setQuests(prev => prev.filter(q => q.id !== questId));
  };

  const handleUpdateUser = (updatedUser: UserAccount) => {
    setAllUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    if (currentUser?.id === updatedUser.id) {
      setCurrentUser(updatedUser);
    }
  };

  const handleRegisterUser = (newUser: UserAccount) => {
    setAllUsers(prev => [newUser, ...prev]);
  };

  // Manejador de Login con redirección inteligente según rol
  const handleUserLogin = (user: UserAccount) => {
    setCurrentUser(user);
    if (user.role === 'supermaster') {
      setMainNavTab('supermaster');
    } else if (user.role === 'dm') {
      setMainNavTab('dm');
      setRoleMode('dm');
    } else {
      setMainNavTab('player');
      setRoleMode('player');
    }
  };

  // Guardián de Vistas según Rol Activo (Previene desincronizaciones y accesos no autorizados)
  useEffect(() => {
    if (currentUser) {
      if (currentUser.role === 'player' && (mainNavTab === 'dm' || mainNavTab === 'supermaster')) {
        setMainNavTab('player');
        setRoleMode('player');
      } else if (currentUser.role === 'dm' && mainNavTab === 'supermaster') {
        setMainNavTab('dm');
        setRoleMode('dm');
      }
    }
  }, [currentUser, mainNavTab]);

  // Sub-tabs de DM
  const [dmSubTab, setDmSubTab] = useState<'bestiary' | 'builder' | 'encounter' | 'spells' | 'magicItems' | 'traps' | 'biomes' | 'downtime' | 'tarokka' | 'patrons' | 'dragonmarks' | 'chases' | 'weather' | 'species' | 'poisons' | 'tactics' | 'treasure' | 'vecna' | 'dragons_guide' | 'sidekicks' | 'feats' | 'npc' | 'shops' | 'rules' | 'books'>('bestiary');

  // Patrón de Campaña Activo (Tasha, Eberron, Vecna)
  const [campaignPatron, setCampaignPatron] = useState<ActivePatronCampaignState | null>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_PATRON_KEY);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { }
    }
    return {
      patronId: 'tasha_academy',
      reputationScore: 2,
      favorsOwed: 1,
      totalGoldEarnedFromPatron: 250,
      missions: [
        {
          id: 'pm_initial_1',
          patronId: 'tasha_academy',
          title: 'El Grimorio de las Siete Lunas',
          prompt: 'Un grimorio de magia abjurativa fue robado de la sección restringida por un estudiante expulsado.',
          target: 'Torre en ruinas en los Pantanos del Este',
          rewardGp: 250,
          favorReward: 1,
          assignedDate: 'En curso',
          status: 'pending'
        }
      ]
    };
  });

  const handleUpdateCampaignPatron = (state: ActivePatronCampaignState | null) => {
    setCampaignPatron(state);
    if (state) {
      localStorage.setItem(LOCAL_STORAGE_PATRON_KEY, JSON.stringify(state));
    } else {
      localStorage.removeItem(LOCAL_STORAGE_PATRON_KEY);
    }
  };

  // Sub-tabs de Jugador
  const [playerView, setPlayerView] = useState<'sheet' | 'wizard' | 'bastion' | 'sidekicks' | 'feats'>('sheet');

  // Modal del Lanza-Dados
  const [isDiceModalOpen, setIsDiceModalOpen] = useState<boolean>(false);

  // Modal de Respaldos y Exportación
  const [isBackupModalOpen, setIsBackupModalOpen] = useState<boolean>(false);

  const handleImportCharacter = (newChar: Character) => {
    setCharacters(prev => [newChar, ...prev]);
    setActiveCharIndex(0);
    setRoleMode('player');
    setPlayerView('sheet');
  };

  const handleRestoreCampaign = (payload: any) => {
    if (payload.characters && payload.characters.length > 0) {
      setCharacters(payload.characters);
      setActiveCharIndex(0);
    }
    if (payload.monsters && payload.monsters.length > 0) {
      setMonsters(payload.monsters);
    }
    if (payload.sidekicks && payload.sidekicks.length > 0) {
      setSidekicks(payload.sidekicks);
    }
    if (payload.campaignPatron) {
      handleUpdateCampaignPatron(payload.campaignPatron);
    }
  };

  // Lista de Personajes
  const [characters, setCharacters] = useState<Character[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_CHAR_KEY);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { }
    }
    return [{
      id: 'char_default_1',
      name: 'Valeros de Bastión Corona',
      playerName: 'Sergio',
      species: 'Humano',
      className: 'Guerrero (Fighter)',
      level: 5,
      background: 'Soldado',
      originFeat: 'Brabucon / Combatiente Salvaje',
      alignment: 'Neutral Bueno',
      experience: 6500,
      abilities: { str: 18, dex: 14, con: 16, int: 10, wis: 12, cha: 8 },
      maxHp: 44,
      currentHp: 44,
      tempHp: 0,
      hitDie: '1d10',
      hitDiceTotal: 5,
      hitDiceUsed: 0,
      deathSaves: { successes: 0, failures: 0 },
      armorClass: 18,
      initiativeBonus: 2,
      speed: 9,
      proficiencyBonus: 3,
      savingThrows: { str: true, dex: false, con: true, int: false, wis: false, cha: false },
      skills: {
        'Atletismo': { proficient: true, expertise: false },
        'Intimidación': { proficient: true, expertise: false },
        'Supervivencia': { proficient: true, expertise: false }
      },
      languages: ['Común'],
      weaponProficiencies: ['Armas simples', 'Armas marciales'],
      armorProficiencies: ['Todas las armaduras', 'Escudos'],
      spellSlots: [],
      knownSpells: [],
      weapons: [
        { id: 'w1', name: 'Espada Larga +1 de Bastión', attackBonus: 8, damageDice: '1d8 + 5', damageType: 'Cortante' },
        { id: 'w2', name: 'Jabalina de Guerra', attackBonus: 7, damageDice: '1d6 + 4', damageType: 'Perforante', range: '9/36 m' }
      ],
      inventory: [
        { id: 'i1', name: 'Armadura de Placas (Full Plate)', quantity: 1, equipped: true },
        { id: 'i2', name: 'Escudo de Acero Reforzado', quantity: 1, equipped: true },
        { id: 'i3', name: 'Bolsa de Contención (Bag of Holding)', quantity: 1 },
        { id: 'i4', name: 'Poción de Curación Mayor', quantity: 2 }
      ],
      coins: { cp: 25, sp: 40, ep: 0, gp: 350, pp: 5 },
      features: [
        { title: 'Versatilidad Ingeniosa', source: 'Humano', description: 'Ganas inspiración heroica cada vez que terminas un descanso largo.' },
        { title: 'Ataque Adicional (Extra Attack)', source: 'Guerrero Nvl 5', description: 'Puedes atacar dos veces cada vez que realizas la acción Atacar en tu turno.' },
        { title: 'Maestría con Armas 2024', source: 'Guerrero', description: 'Desbloquea propiedades tácticas: Rozar (Graze), Derribar (Topple).' }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }];
  });

  const [activeCharIndex, setActiveCharIndex] = useState<number>(0);

  // Lista de Monstruos
  const [monsters, setMonsters] = useState<Monster[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_MONSTER_KEY);
    if (saved) {
      try {
        const custom = JSON.parse(saved);
        return [...custom, ...INITIAL_MONSTERS];
      } catch (e) { }
    }
    return INITIAL_MONSTERS;
  });

  // Monstruos en el encuentro
  const [monstersInEncounter, setMonstersInEncounter] = useState<Monster[]>([
    INITIAL_MONSTERS[0], // Goblin
    INITIAL_MONSTERS[0], // Goblin
    INITIAL_MONSTERS[1]  // Lobo
  ]);

  // Efecto para aplicar tema en el documento
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem(LOCAL_STORAGE_THEME_KEY, theme);
  }, [theme]);

  // Lista de Escuderos y Compañeros (Tasha)
  const [sidekicks, setSidekicks] = useState<Sidekick[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_SIDEKICKS_KEY);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { }
    }
    return SIDEKICK_PRESETS;
  });

  // Persistencia de Personajes
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_CHAR_KEY, JSON.stringify(characters));
  }, [characters]);

  // Persistencia de Escuderos
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_SIDEKICKS_KEY, JSON.stringify(sidekicks));
  }, [sidekicks]);

  // Manejadores
  const handleSaveCharacter = (newChar: Character) => {
    setCharacters(prev => [newChar, ...prev]);
    setActiveCharIndex(0);
    setPlayerView('sheet');
  };

  const handleUpdateCharacter = (updated: Character) => {
    setCharacters(prev => prev.map(c => c.id === updated.id ? updated : c));
  };

  const handleAddSpellToActiveChar = (spell: Spell) => {
    const currentChar = characters[activeCharIndex];
    if (!currentChar) return;
    const exists = currentChar.knownSpells.some(s => s.id === spell.id);
    if (exists) {
      alert(`El aventurero ${currentChar.name} ya conoce este conjuro.`);
      return;
    }
    handleUpdateCharacter({
      ...currentChar,
      knownSpells: [...currentChar.knownSpells, spell]
    });
  };

  const handleSaveCustomMonster = (newMonster: Monster) => {
    setMonsters(prev => [newMonster, ...prev]);
    const customOnly = [newMonster, ...monsters.filter(m => m.isCustom)];
    localStorage.setItem(LOCAL_STORAGE_MONSTER_KEY, JSON.stringify(customOnly));
    setDmSubTab('bestiary');
  };

  const handleAddToEncounter = (m: Monster) => {
    setMonstersInEncounter(prev => [...prev, m]);
  };

  const handleRemoveFromEncounter = (index: number) => {
    setMonstersInEncounter(prev => prev.filter((_, i) => i !== index));
  };

  const activeChar = characters[activeCharIndex] || characters[0];
  const isBastionUnlocked = currentUser?.role === 'supermaster' || Boolean(currentUser?.permissions?.bastionUnlocked);
  const isSidekicksUnlocked = currentUser?.role === 'supermaster' || Boolean(currentUser?.permissions?.sidekicksUnlocked);
  const failedQuestsCount = quests.filter(q => q.status === 'failed').length;

  const renderFeudalLock = (title: string, desc: string) => (
    <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1.8rem', maxWidth: '680px', margin: '2rem auto', border: '1px solid var(--border-gold)' }}>
      <div style={{
        width: '68px',
        height: '68px',
        margin: '0 auto 1.2rem',
        borderRadius: '50%',
        background: 'rgba(212, 175, 55, 0.12)',
        border: '2px solid var(--gold-primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: 'var(--shadow-gold)'
      }}>
        <Lock size={34} color="var(--gold-hover)" />
      </div>
      <span className="badge badge-gold" style={{ fontSize: '0.82rem', marginBottom: '0.6rem' }}>
        🔒 DECRETO FEUDAL DEL SUPER MASTER
      </span>
      <h2 style={{ fontSize: '1.65rem', color: 'var(--text-main)', margin: '0.4rem 0' }}>{title}</h2>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.5, margin: '0 auto 1.4rem', maxWidth: '520px' }}>
        {desc}
      </p>
      <div style={{ background: 'var(--bg-input)', padding: '0.7rem 1.2rem', borderRadius: 'var(--radius-sm)', display: 'inline-block', fontSize: '0.8rem', color: 'var(--text-dim)' }}>
        Estado: <strong>Acceso Restringido</strong> • El Super Master debe activar tu permiso en su Panel de Control.
      </div>
    </div>
  );

  // VISTA 1 OBLIGATORIA: Si no hay usuario autenticado, mostrar pantalla completa de Login
  if (!currentUser) {
    return (
      <div className="app-container" data-theme={theme}>
        <LoginScreen 
          onLogin={handleUserLogin}
          onRegister={handleRegisterUser}
          allUsers={allUsers}
        />
        <DramaticDiceOverlay />
      </div>
    );
  }

  return (
    <div className="app-container" data-theme={theme}>
      {/* Barra de Navegación Superior */}
      <header className="navbar">
        <div className="navbar-brand" onClick={() => { setMainNavTab('player'); setRoleMode('player'); setPlayerView('sheet'); }}>
          <div className="brand-icon">
            <Shield size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span className="brand-title">D&D T Editions</span>
              <span className="brand-edition">D&D 2024</span>
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
              11 Libros Conectados • Modo Claro Pergamino
            </div>
          </div>
        </div>

        {/* Selector de Rol y Pestañas Principales */}
        <nav className="nav-tabs">
          <button 
            className={`nav-tab-btn ${mainNavTab === 'player' ? 'active' : ''}`}
            onClick={() => { setMainNavTab('player'); setRoleMode('player'); }}
          >
            <User size={16} /> Ficha de Personaje
          </button>

          {(currentUser?.role === 'dm' || currentUser?.role === 'supermaster') && (
            <button 
              className={`nav-tab-btn ${mainNavTab === 'dm' ? 'active' : ''}`}
              onClick={() => { setMainNavTab('dm'); setRoleMode('dm'); }}
            >
              <Skull size={16} /> Herramientas de DM
            </button>
          )}

          <button 
            className={`nav-tab-btn ${mainNavTab === 'quests' ? 'active' : ''}`}
            onClick={() => setMainNavTab('quests')}
          >
            <Scroll size={16} /> Tablero de Campañas
            {quests.length > 0 && (
              <span className="badge badge-sapphire" style={{ marginLeft: '0.35rem', padding: '0.1rem 0.4rem', fontSize: '0.72rem' }}>
                {quests.length}
              </span>
            )}
          </button>

          <button 
            className={`nav-tab-btn ${mainNavTab === 'grimoire' ? 'active' : ''}`}
            onClick={() => setMainNavTab('grimoire')}
          >
            <BookOpen size={16} /> Grimorio
          </button>

          {currentUser?.role === 'supermaster' && (
            <button 
              className={`nav-tab-btn ${mainNavTab === 'supermaster' ? 'active' : ''}`}
              onClick={() => setMainNavTab('supermaster')}
              style={{
                borderColor: 'var(--gold-primary)',
                background: mainNavTab === 'supermaster' ? 'linear-gradient(135deg, rgba(212, 175, 55, 0.25), rgba(255, 215, 0, 0.4))' : 'rgba(212, 175, 55, 0.08)'
              }}
            >
              <Crown size={16} color="var(--gold-hover)" /> Panel Imperial 👑
              {failedQuestsCount > 0 && (
                <span className="badge badge-crimson" style={{ marginLeft: '0.35rem', padding: '0.1rem 0.4rem', fontSize: '0.72rem', animation: 'pulseGlow 1.5s infinite' }}>
                  {failedQuestsCount} ALERTA
                </span>
              )}
            </button>
          )}
        </nav>

        {/* Acciones Rápidas: Insignia de Usuario con Dragones de Oro, Switcher de Tema & Lanza-Dados */}
        <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
          {/* Botón de Usuario / Dragones de Oro */}
          {currentUser ? (
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setIsAuthModalOpen(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.35rem 0.75rem',
                borderRadius: 'var(--radius-full)',
                border: currentUser.role === 'supermaster' ? '1px solid var(--gold-primary)' : '1px solid var(--border-subtle)',
                background: currentUser.role === 'supermaster' ? 'rgba(212, 175, 55, 0.12)' : 'rgba(255, 255, 255, 0.04)'
              }}
              title="Administrar Perfil, Rol y Dragones de Oro"
            >
              {currentUser.role === 'supermaster' ? (
                <Crown size={16} color="var(--gold-hover)" />
              ) : currentUser.role === 'dm' ? (
                <Shield size={16} color="#9d4edd" />
              ) : (
                <User size={16} color="#2b8a3e" />
              )}
              
              <div style={{ textAlign: 'left', lineHeight: 1.1 }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, display: 'block', color: currentUser.role === 'supermaster' ? 'var(--gold-hover)' : 'inherit' }}>
                  {currentUser.username}
                </span>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>
                  {currentUser.role === 'supermaster' ? 'Super Master' : currentUser.role === 'dm' ? 'Master' : 'Jugador'}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--gold-hover)', fontSize: '0.8rem', fontWeight: 800, marginLeft: '0.2rem', paddingLeft: '0.4rem', borderLeft: '1px solid var(--border-subtle)' }}>
                <Coins size={14} />
                <span>{currentUser.role === 'supermaster' ? '∞ DO' : `${currentUser.goldDragons.toLocaleString()} DO`}</span>
              </div>
            </button>
          ) : (
            <button
              className="btn btn-primary btn-sm glow-hover"
              onClick={() => setIsAuthModalOpen(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.4rem 0.85rem',
                borderRadius: 'var(--radius-full)'
              }}
            >
              <Key size={15} />
              <span>Iniciar Sesión</span>
            </button>
          )}

          <button 
            className="btn btn-secondary btn-sm"
            onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}
            title={theme === 'light' ? 'Cambiar a Modo Oscuro' : 'Cambiar a Modo Claro Pergamino'}
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.45rem 0.8rem' }}
          >
            {theme === 'light' ? (
              <>
                <Sun size={15} color="var(--gold-primary)" />
                <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Pergamino</span>
              </>
            ) : (
              <>
                <Moon size={15} color="var(--sapphire-mana)" />
                <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Oscuro</span>
              </>
            )}
          </button>

          <button 
            className="btn btn-secondary btn-sm" 
            onClick={() => setIsBackupModalOpen(true)}
            style={{ borderRadius: 'var(--radius-full)', padding: '0.45rem 0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            title="Copias de Seguridad, Exportación/Importación y PDF"
          >
            <Database size={15} /> Respaldos
          </button>

          <button 
            className="btn btn-primary btn-sm glow-hover" 
            onClick={() => setIsDiceModalOpen(true)}
            style={{ borderRadius: 'var(--radius-full)', padding: '0.45rem 1rem' }}
          >
            <Dices size={16} /> Lanza-Dados
          </button>
        </div>
      </header>

      {/* Sub-Navegación Específica para Modo Jugador y Modo DM */}
      {(mainNavTab === 'player' || mainNavTab === 'dm') && (
        <div style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-subtle)', padding: '0.5rem 2rem' }}>
          <div style={{ maxWidth: '1440px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.8rem' }}>
          {roleMode === 'player' ? (
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
              {characters.length > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginRight: '0.8rem' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: 600 }}>Aventurero:</span>
                  <select 
                    value={activeChar?.id || ''} 
                    onChange={e => {
                      const targetId = e.target.value;
                      const idx = characters.findIndex(c => c.id === targetId);
                      if (idx >= 0) setActiveCharIndex(idx);
                      setPlayerView('sheet');
                    }}
                    style={{ width: 'auto', padding: '0.3rem 0.6rem', fontSize: '0.85rem' }}
                  >
                    {characters
                      .filter(c => currentUser?.role !== 'player' || !c.userId || c.userId === currentUser.id)
                      .map((c) => (
                        <option key={c.id} value={c.id}>{c.name} ({c.className} Nvl {c.level})</option>
                      ))}
                  </select>
                </div>
              )}

              <button 
                className={`btn btn-sm ${playerView === 'sheet' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setPlayerView('sheet')}
              >
                <Shield size={14} /> Hoja de Aventurero
              </button>
              <button 
                className={`btn btn-sm ${playerView === 'wizard' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setPlayerView('wizard')}
              >
                <Plus size={14} /> Crear Nuevo Personaje (2024)
              </button>
              <button 
                className={`btn btn-sm ${playerView === 'bastion' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setPlayerView('bastion')}
              >
                <Castle size={14} /> Mi Bastión 2024 (Nvl 5+)
              </button>
              <button 
                className={`btn btn-sm ${playerView === 'sidekicks' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setPlayerView('sidekicks')}
              >
                <Users size={14} /> Escuderos & Mascotas (Tasha)
              </button>
              <button 
                className={`btn btn-sm ${playerView === 'feats' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setPlayerView('feats')}
              >
                <Award size={14} /> Dotes 2024
              </button>
            </div>
          ) : (
            <DmTargetAdventurerBar
              characters={characters}
              activeCharIndex={activeCharIndex}
              onSelectCharacterIndex={setActiveCharIndex}
              activeSubTab={dmSubTab}
              onSelectSubTab={(tab) => setDmSubTab(tab)}
              onOpenQuickRewardModal={() => setIsQuickRewardModalOpen(true)}
              monstersInEncounterCount={monstersInEncounter.length}
            />
          )}
        </div>
      </div>
      )}

      {/* Contenido Principal */}
      <main className="main-content">
        {mainNavTab === 'quests' ? (
          <CampaignQuestBoard 
            currentUser={currentUser}
            activeCharacter={activeChar}
            characters={characters}
            quests={quests}
            onSaveQuest={handleSaveQuest}
            onDeleteQuest={handleDeleteQuest}
            onUpdateCharacter={handleUpdateCharacter}
            onUpdateAllCharacters={setCharacters}
            onOpenAuth={() => setIsAuthModalOpen(true)}
          />
        ) : mainNavTab === 'grimoire' && activeChar ? (
          <AdventureGrimoireProfile 
            character={activeChar}
            onUpdateCharacter={handleUpdateCharacter}
          />
        ) : mainNavTab === 'supermaster' && currentUser?.role === 'supermaster' ? (
          <SuperMasterDashboard 
            currentUser={currentUser}
            allUsers={allUsers}
            allQuests={quests}
            onUpdateUser={handleUpdateUser}
            onUpdateQuest={handleSaveQuest}
            onDeleteQuest={handleDeleteQuest}
          />
        ) : roleMode === 'player' ? (
          playerView === 'sheet' && activeChar ? (
            <CharacterSheet 
              character={activeChar} 
              onUpdate={handleUpdateCharacter} 
              onOpenDiceRoller={() => setIsDiceModalOpen(true)}
              activeCampaignPatron={campaignPatron}
            />
          ) : playerView === 'wizard' ? (
            <CharacterWizard 
              currentUser={currentUser}
              onSave={handleSaveCharacter} 
              onCancel={() => setPlayerView('sheet')} 
            />
          ) : playerView === 'bastion' ? (
            isBastionUnlocked ? (
              <BastionManager character={activeChar} />
            ) : (
              renderFeudalLock(
                'Mi Bastión 2024 — Módulo Feudal Bloqueado',
                'El gobierno y expansión de un Bastión (Reglas 2024) requiere el decreto formal del Super Master. Actualmente este privilegio se encuentra cerrado hasta que el Super Master te lo otorgue en su panel de control.'
              )
            )
          ) : playerView === 'sidekicks' ? (
            isSidekicksUnlocked ? (
              <SidekicksManager 
                sidekicks={sidekicks}
                onUpdateSidekicks={setSidekicks}
                onSendToEncounter={handleAddToEncounter}
                onOpenDiceRoller={() => setIsDiceModalOpen(true)}
                activeHero={activeChar}
              />
            ) : (
              renderFeudalLock(
                'Escuderos & Mascotas — Licencia de Reclutamiento Bloqueada',
                'El contrato de escuderos y compañeros arcanos (Reglas Tasha) está reservado por la Corona Imperial. Espera a que el Super Master te autorice en el Panel de Control.'
              )
            )
          ) : (
            <FeatsCompendium 
              activeCharacter={activeChar}
              onUpdateCharacter={handleUpdateCharacter}
            />
          )
        ) : (
          dmSubTab === 'bestiary' ? (
            <Bestiary 
              monsters={monsters} 
              onAddToEncounter={handleAddToEncounter} 
              onOpenCreateModal={() => setDmSubTab('builder')}
            />
          ) : dmSubTab === 'builder' ? (
            <MonsterBuilder 
              onSave={handleSaveCustomMonster} 
              onCancel={() => setDmSubTab('bestiary')}
            />
          ) : dmSubTab === 'encounter' ? (
            <EncounterTracker 
              characters={characters}
              monstersInEncounter={monstersInEncounter}
              onRemoveMonsterFromEncounter={handleRemoveFromEncounter}
              onClearEncounter={() => setMonstersInEncounter([])}
            />
          ) : dmSubTab === 'spells' ? (
            <SpellsCompendium 
              activeCharacter={activeChar}
              onAddSpellToCharacter={handleAddSpellToActiveChar}
            />
          ) : dmSubTab === 'magicItems' ? (
            <MagicItemsCompendium 
              activeCharacter={activeChar}
              onUpdateCharacter={handleUpdateCharacter}
              characters={characters}
              onUpdateAllCharacters={setCharacters}
            />
          ) : dmSubTab === 'traps' ? (
            <TrapsHazardsGenerator 
              characters={characters}
              activeCharacter={activeChar}
            />
          ) : dmSubTab === 'biomes' ? (
            <BiomesEncounterGenerator onAddToEncounter={handleAddToEncounter} />
          ) : dmSubTab === 'downtime' ? (
            <DowntimeManager activeCharacter={activeChar} onUpdateCharacter={handleUpdateCharacter} />
          ) : dmSubTab === 'tarokka' ? (
            <RavenloftSuite 
              characters={characters}
              activeCharacter={activeChar}
              onUpdateCharacter={handleUpdateCharacter}
            />
          ) : dmSubTab === 'patrons' ? (
            <GroupPatronsManager 
              characters={characters}
              onUpdateCharacters={setCharacters}
              activeCampaignPatron={campaignPatron}
              onUpdateCampaignPatron={handleUpdateCampaignPatron}
            />
          ) : dmSubTab === 'dragonmarks' ? (
            <DragonmarksCompendium 
              activeCharacter={activeChar}
              onUpdateCharacter={handleUpdateCharacter}
            />
          ) : dmSubTab === 'chases' ? (
            <ChasesAndLairsManager 
              characters={characters}
            />
          ) : dmSubTab === 'weather' ? (
            <WeatherAndVoyageManager 
              characters={characters}
              activeCharacter={activeChar}
              onUpdateCharacter={handleUpdateCharacter}
            />
          ) : dmSubTab === 'species' ? (
            <SpeciesCompendium 
              characters={characters}
              activeCharacter={activeChar}
              onUpdateCharacter={handleUpdateCharacter}
            />
          ) : dmSubTab === 'poisons' ? (
            <PoisonsAndAlchemyManager 
              characters={characters}
              activeCharacter={activeChar}
              onUpdateCharacter={handleUpdateCharacter}
            />
          ) : dmSubTab === 'tactics' ? (
            <MonsterTacticsAndLairsManager 
              onAddToEncounter={handleAddToEncounter}
              onNavigateToEncounter={() => setDmSubTab('encounter')}
            />
          ) : dmSubTab === 'treasure' ? (
            <TreasureGeneratorManager 
              activeCharacter={activeChar}
              onUpdateCharacter={handleUpdateCharacter}
              characters={characters}
              onUpdateAllCharacters={setCharacters}
            />
          ) : dmSubTab === 'vecna' ? (
            <VecnaDossierManager 
              onAddToEncounter={handleAddToEncounter}
              onNavigateToEncounter={() => setDmSubTab('encounter')}
              activeCharacter={activeChar}
              onUpdateCharacter={handleUpdateCharacter}
            />
          ) : dmSubTab === 'dragons_guide' ? (
            <YoungAdventurersGuide />
          ) : dmSubTab === 'sidekicks' ? (
            isSidekicksUnlocked ? (
              <SidekicksManager 
                sidekicks={sidekicks}
                onUpdateSidekicks={setSidekicks}
                onSendToEncounter={handleAddToEncounter}
                onOpenDiceRoller={() => setIsDiceModalOpen(true)}
                activeHero={activeChar}
              />
            ) : (
              renderFeudalLock(
                'Escuderos & Mascotas — Módulo Bloqueado para Masters',
                'El uso y asignación de Escuderos y Compañeros Animales (Reglas Tasha) requiere autorización del Super Master en el Panel de Control.'
              )
            )
          ) : dmSubTab === 'feats' ? (
            <FeatsCompendium 
              activeCharacter={activeChar}
              onUpdateCharacter={handleUpdateCharacter}
            />
          ) : dmSubTab === 'npc' ? (
            <NpcAdventureGenerator />
          ) : dmSubTab === 'shops' ? (
            <ShopGenerator 
              activeCharacter={activeChar}
              onUpdateCharacter={handleUpdateCharacter}
            />
          ) : dmSubTab === 'rules' ? (
            <QuickRules />
          ) : (
            <BookSearch />
          )
        )}
      </main>

      {/* Modal Flotante de Dados */}
      <DiceRollerModal 
        isOpen={isDiceModalOpen} 
        onClose={() => setIsDiceModalOpen(false)} 
      />

      {/* Modal de Respaldos, Exportación e Impresión */}
      <BackupExportModal
        isOpen={isBackupModalOpen}
        onClose={() => setIsBackupModalOpen(false)}
        activeCharacter={activeChar}
        allCharacters={characters}
        onImportCharacter={handleImportCharacter}
        onRestoreCampaign={handleRestoreCampaign}
        allMonsters={monsters}
        allSidekicks={sidekicks}
        campaignPatron={campaignPatron}
      />

      {/* Modal de Autenticación y Cambio de Roles */}
      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={currentUser}
        allUsers={allUsers}
        onLogin={(u) => {
          setCurrentUser(u);
          if (u.role === 'supermaster') {
            setMainNavTab('supermaster');
          } else if (u.role === 'dm') {
            setMainNavTab('dm');
            setRoleMode('dm');
          } else {
            setMainNavTab('player');
            setRoleMode('player');
          }
        }}
        onRegister={handleRegisterUser}
        onLogout={() => {
          setCurrentUser(null);
          setMainNavTab('player');
          setRoleMode('player');
        }}
      />

      {/* Modal de Recompensa Rápida de DM para Personajes */}
      <DmQuickRewardModal 
        isOpen={isQuickRewardModalOpen}
        onClose={() => setIsQuickRewardModalOpen(false)}
        characters={characters}
        targetCharacterId={activeChar?.id || characters[0]?.id || ''}
        onUpdateCharacter={handleUpdateCharacter}
        onUpdateAllCharacters={(newChars: Character[]) => setCharacters(newChars)}
      />

      {/* Capa Cinemática Global de Tirada de Dados con Animación y Efectos Especiales */}
      <DramaticDiceOverlay />

      {/* Asistentes / Compañeros Interactivos en Tiempo Real (Elara, Dienteazur, Aurelius) */}
      <CompanionWidget
        currentUser={currentUser}
        activeCharacter={activeChar}
        onOpenDiceModal={() => setIsDiceModalOpen(true)}
        onNavigateTab={(tab) => {
          if (tab === 'dm' || tab === 'player' || tab === 'supermaster' || tab === 'quests' || tab === 'grimoire') {
            setMainNavTab(tab as any);
            if (tab === 'dm') setRoleMode('dm');
            if (tab === 'player') setRoleMode('player');
          }
        }}
      />
    </div>
  );
};
