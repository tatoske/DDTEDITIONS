import { 
  UserAccount, 
  UserRole, 
  AdventureRankClass, 
  CampaignQuest, 
  GoldTransferRecord,
  CharacterAdventureRecord
} from '../types/dnd';

// Credenciales oficiales reservadas del Super Master
export const SUPER_MASTER_EMAIL = 'TatoSenpaiSape@gmail.com';
export const SUPER_MASTER_PASS = 'Sergio123Andres123';
export const DEFAULT_USER_PASS = 'dnd2024';

export const LOCAL_STORAGE_AUTH_USER_KEY = 'dnd_t_editions_current_user_v1';
export const LOCAL_STORAGE_USERS_KEY = 'dnd_t_editions_all_users_v1';
export const LOCAL_STORAGE_QUESTS_KEY = 'dnd_t_editions_campaign_quests_v1';
export const LOCAL_STORAGE_TRANSFERS_KEY = 'dnd_t_editions_gold_transfers_v1';

// Mapeo oficial de Nivel de Aventurero a Rango de Clase
export function getRankClassFromLevel(level: number): AdventureRankClass {
  const safeLvl = Math.max(1, Math.min(20, level));
  if (safeLvl <= 2) return 'F';
  if (safeLvl <= 4) return 'E';
  if (safeLvl <= 6) return 'D';
  if (safeLvl <= 8) return 'C';
  if (safeLvl <= 10) return 'B';
  if (safeLvl <= 14) return 'A';
  if (safeLvl <= 16) return 'S';
  if (safeLvl <= 19) return 'SS';
  return 'SS+';
}

export function getRankClassTitle(rank: AdventureRankClass): string {
  switch (rank) {
    case 'F': return 'Clase F (Novato / Aprendiz - Nivel 1-2)';
    case 'E': return 'Clase E (Aventurero Prometedor - Nivel 3-4)';
    case 'D': return 'Clase D (Héroe Local - Nivel 5-6)';
    case 'C': return 'Clase C (Defensor del Reino - Nivel 7-8)';
    case 'B': return 'Clase B (Campeón Veterano - Nivel 9-10)';
    case 'A': return 'Clase A (Leyenda Provincial - Nivel 11-14)';
    case 'S': return 'Clase S (Paragón del Plano - Nivel 15-16)';
    case 'SS': return 'Clase SS (Titán Multiversal - Nivel 17-19)';
    case 'SS+': return 'Clase SS+ (Cúspide Épica / Deífica - Nivel 20)';
  }
}

export function getRankClassBadgeColor(rank: AdventureRankClass): { bg: string; color: string; border: string } {
  switch (rank) {
    case 'F': return { bg: 'rgba(108, 117, 125, 0.15)', color: '#adb5bd', border: '#6c757d' };
    case 'E': return { bg: 'rgba(43, 138, 62, 0.15)', color: '#51cf66', border: '#2b8a3e' };
    case 'D': return { bg: 'rgba(25, 113, 194, 0.15)', color: '#4dabf7', border: '#1971c2' };
    case 'C': return { bg: 'rgba(134, 46, 156, 0.15)', color: '#cc5de8', border: '#862e9c' };
    case 'B': return { bg: 'rgba(217, 72, 15, 0.15)', color: '#ff922b', border: '#d9480f' };
    case 'A': return { bg: 'rgba(201, 42, 42, 0.18)', color: '#ff6b6b', border: '#c92a2a' };
    case 'S': return { bg: 'rgba(212, 175, 55, 0.22)', color: '#ffd43b', border: '#d4af37' };
    case 'SS': return { bg: 'rgba(230, 73, 128, 0.22)', color: '#faa2c1', border: '#e64980' };
    case 'SS+': return { bg: 'linear-gradient(135deg, rgba(255, 215, 0, 0.35), rgba(255, 107, 107, 0.35))', color: '#fff3bf', border: '#ffd700' };
  }
}

// Verifica si un correo corresponde al Super Master
export function isSuperMasterEmail(email: string): boolean {
  return email.trim().toLowerCase() === SUPER_MASTER_EMAIL.toLowerCase();
}

export interface AuthResult {
  success: boolean;
  user?: UserAccount;
  error?: string;
}

// Autenticación segura de credenciales para cualquier rol (Super Master, DM, Jugador)
export function authenticateUserCredentials(
  allUsers: UserAccount[],
  email: string,
  password: string
): AuthResult {
  const cleanEmail = email.trim().toLowerCase();
  const cleanPass = password.trim();

  if (!cleanEmail) {
    return { success: false, error: 'Por favor ingresa tu correo electrónico.' };
  }
  if (!cleanPass) {
    return { success: false, error: 'Por favor ingresa tu contraseña.' };
  }

  // Comprobación Super Master
  if (isSuperMasterEmail(cleanEmail)) {
    if (cleanPass !== SUPER_MASTER_PASS) {
      return { success: false, error: 'Contraseña incorrecta para la cuenta suprema del Super Master.' };
    }
    const smUser = allUsers.find(u => isSuperMasterEmail(u.email)) || INITIAL_USERS[0];
    return { success: true, user: smUser };
  }

  // Comprobación Usuarios Estándar (DM y Jugadores)
  const found = allUsers.find(u => u.email.trim().toLowerCase() === cleanEmail);
  if (!found) {
    return { success: false, error: 'No se encontró ninguna cuenta con este correo. Puedes crear una en la pestaña "Registrarse".' };
  }

  const expectedPass = found.password || DEFAULT_USER_PASS;
  if (cleanPass !== expectedPass) {
    return { success: false, error: 'Contraseña incorrecta. Por favor verifica tus credenciales.' };
  }

  return { success: true, user: found };
}

// Valida si un personaje está calificado para postularse a una misión por su nivel
export function validateCharacterForQuest(
  charLevel: number, 
  minLevel: number, 
  maxLevel: number, 
  expectedRank?: AdventureRankClass
): { eligible: boolean; reason?: string } {
  const charRank = getRankClassFromLevel(charLevel);

  if (charLevel < minLevel) {
    return {
      eligible: false,
      reason: `Nivel insuficiente: Tu personaje es Nivel ${charLevel} (${charRank}), pero esta misión requiere al menos Nivel ${minLevel} (${expectedRank || ''}).`
    };
  }

  if (charLevel > maxLevel) {
    return {
      eligible: false,
      reason: `Nivel excesivo: Tu personaje es Nivel ${charLevel} (${charRank}) y supera el nivel máximo de ${maxLevel}. Deja esta misión para aventureros novatos.`
    };
  }

  return { eligible: true };
}

// Transferencia de Dragones de Oro (DO)
export function transferGoldDragons(
  fromUser: UserAccount,
  toUser: UserAccount,
  amount: number,
  concept: string = 'Subsidio de la Tesorería Imperial'
): { updatedFrom: UserAccount; updatedTo: UserAccount; transfer: GoldTransferRecord } {
  if (amount <= 0) {
    throw new Error('La cantidad de Dragones de Oro a transferir debe ser mayor a cero.');
  }

  // Si no es Super Master, debe tener fondos suficientes
  if (fromUser.role !== 'supermaster' && fromUser.goldDragons < amount) {
    throw new Error(`Fondos insuficientes: Tienes ${fromUser.goldDragons} DO, requieres ${amount} DO.`);
  }

  const newFromBalance = fromUser.role === 'supermaster' 
    ? fromUser.goldDragons // El tesoro imperial no se agota
    : fromUser.goldDragons - amount;

  const newToBalance = toUser.goldDragons + amount;

  const updatedFrom: UserAccount = { ...fromUser, goldDragons: newFromBalance };
  const updatedTo: UserAccount = { ...toUser, goldDragons: newToBalance };

  const transfer: GoldTransferRecord = {
    id: `tx_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    fromUserId: fromUser.id,
    fromUserName: fromUser.username,
    toUserId: toUser.id,
    toUserName: toUser.username,
    amount,
    concept,
    timestamp: new Date().toISOString()
  };

  return { updatedFrom, updatedTo, transfer };
}

// Escalado de Misión Fallida por el Super Master
export function escalateFailedQuest(
  quest: CampaignQuest,
  newRankClass: AdventureRankClass,
  extraGoldReward: number,
  newMinLevel: number,
  newMaxLevel: number,
  reason: string = 'Escalado imperial de amenaza debido a derrota de aventureros'
): CampaignQuest {
  return {
    ...quest,
    rankClass: newRankClass,
    minLevel: newMinLevel,
    maxLevel: newMaxLevel,
    goldReward: quest.goldReward + Math.max(0, extraGoldReward),
    status: 'open',
    failureEscalated: true,
    escalationCount: (quest.escalationCount || 0) + 1,
    applicants: [], // Se limpia para nueva convocatoria de mayor nivel
    acceptedPlayerIds: [],
    notes: `${quest.notes ? quest.notes + ' | ' : ''}${reason}`,
    updatedAt: new Date().toISOString()
  };
}

// Asignación de Roles por el Super Master
export function assignUserRole(
  targetUser: UserAccount,
  newRole: UserRole,
  superMasterUser: UserAccount
): UserAccount {
  if (superMasterUser.role !== 'supermaster') {
    throw new Error('Solo el Super Master tiene la potestad de decretar y modificar roles.');
  }

  // La cuenta del Super Master no puede ser alterada
  if (isSuperMasterEmail(targetUser.email)) {
    throw new Error('La cuenta oficial del Super Master es única e inmutable.');
  }

  // Si se intenta promover a supermaster a otra persona, restringir
  if (newRole === 'supermaster') {
    throw new Error('El rol de Super Master está reservado exclusivamente para la Corona Imperial.');
  }

  if (targetUser.role === newRole) {
    return targetUser;
  }

  // Bonificación de bienvenida a DM si tenía pocos fondos para misiones
  let updatedDragons = targetUser.goldDragons;
  if (newRole === 'dm' && targetUser.goldDragons < 1000) {
    updatedDragons = 1500;
  }

  return {
    ...targetUser,
    role: newRole,
    goldDragons: updatedDragons
  };
}

// Cuentas iniciales por defecto (Seed inicial)
export const INITIAL_USERS: UserAccount[] = [
  {
    id: 'user_supermaster_official',
    email: SUPER_MASTER_EMAIL,
    username: 'Gran Patriarca (Super Master)',
    password: SUPER_MASTER_PASS,
    role: 'supermaster',
    goldDragons: 999999, // Tesoro Imperial
    permissions: { bastionUnlocked: true, sidekicksUnlocked: true },
    createdAt: new Date().toISOString()
  },
  {
    id: 'user_master_elminster',
    email: 'master_elminster@dnd.com',
    username: 'Elminster el Archimago (Master)',
    password: DEFAULT_USER_PASS,
    role: 'dm',
    goldDragons: 3500, // Presupuesto para misiones
    permissions: { bastionUnlocked: false, sidekicksUnlocked: false },
    createdAt: new Date().toISOString()
  },
  {
    id: 'user_player_sergio',
    email: 'jugador_sergio@dnd.com',
    username: 'Sergio Valeros (Jugador)',
    password: DEFAULT_USER_PASS,
    role: 'player',
    goldDragons: 350, // Fortuna personal
    permissions: { bastionUnlocked: false, sidekicksUnlocked: false },
    createdAt: new Date().toISOString()
  }
];

// Misiones de Campaña iniciales por defecto (Seed inicial)
export const INITIAL_CAMPAIGN_QUESTS: CampaignQuest[] = [
  {
    id: 'quest_1_cripta',
    title: 'La Cripta Profanada del Rey Demonio',
    description: 'Criaturas de las sombras han despertado en los túmulos del oeste. Se busca un grupo experimentado capaz de purificar el altar sagrado y desarmar las trampas nigrománticas.',
    masterId: 'user_master_elminster',
    masterName: 'Elminster el Archimago',
    sessionDate: 'Sábado 20:00 Horas (Hora del Reino)',
    maxPlayers: 4,
    goldReward: 500,
    minLevel: 4,
    maxLevel: 6,
    rankClass: 'D',
    status: 'open',
    applicants: [
      {
        characterId: 'char_default_1',
        characterName: 'Valeros de Bastión Corona',
        playerName: 'Sergio',
        characterLevel: 5,
        characterClass: 'Guerrero (Fighter)',
        appliedAt: new Date().toISOString(),
        status: 'pending'
      }
    ],
    acceptedPlayerIds: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'quest_2_taberna',
    title: 'Infestación en las Bodegas del Jabalí Risueño',
    description: 'Ratas aberrantes con colmillos elementales están arruinando los barriles de hidromiel añeja. Tarea idónea para novatos y aventureros recién llegados.',
    masterId: 'user_master_elminster',
    masterName: 'Elminster el Archimago',
    sessionDate: 'Viernes 18:00 Horas',
    maxPlayers: 3,
    goldReward: 120,
    minLevel: 1,
    maxLevel: 2,
    rankClass: 'F',
    status: 'open',
    applicants: [],
    acceptedPlayerIds: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'quest_3_gigantes',
    title: 'El Despertar del Gigante de Magma en el Cráter Sulfuroso',
    description: '¡ALERTA MÁXIMA! Un grupo de aventureros fue aniquilado la semana pasada al intentar infiltrarse en la caldera. Se requiere que el Super Master apruebe el escalado de esta misión para reclutar héroes legendarios.',
    masterId: 'user_master_elminster',
    masterName: 'Elminster el Archimago',
    sessionDate: 'Domingo 21:00 Horas',
    maxPlayers: 5,
    goldReward: 1200,
    minLevel: 7,
    maxLevel: 9,
    rankClass: 'C',
    status: 'failed', // Misión fallida que activará la alerta al Super Master
    applicants: [],
    acceptedPlayerIds: [],
    notes: 'El grupo anterior sucumbió al aliento abrasador. Requiere escalado a Clase B o A.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];
