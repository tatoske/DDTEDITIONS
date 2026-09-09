export type CompanionId = 'elara' | 'mimic' | 'archmage';

export interface CompanionStats {
  hp: number;
  maxHp: number;
  dex: number;
  str: number;
  int?: number;
}

export interface CompanionQuickPrompt {
  id: string;
  label: string;
  query: string;
  category?: string;
}

export interface CompanionPersona {
  id: CompanionId;
  name: string;
  subtitle: string;
  title: string;
  roleTarget: 'player' | 'dm' | 'supermaster';
  portraitUrl: string;
  avatarUrl?: string;
  stats: CompanionStats;
  personality: string;
  greeting: string;
  badgeColor: string;
  themeColor?: string;
  quickPrompts: CompanionQuickPrompt[];
}

export interface ChatAction {
  label: string;
  actionType: 'navigate' | 'roll' | 'reward' | 'info';
  payload?: any;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'companion';
  companionId?: CompanionId;
  text: string;
  timestamp: string;
  actions?: ChatAction[];
}
