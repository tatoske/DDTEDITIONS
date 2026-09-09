export type AbilityName = 'str' | 'dex' | 'con' | 'int' | 'wis' | 'cha';

export interface AbilityScore {
  score: number;
  modifier: number;
}

export type AbilitiesRecord = Record<AbilityName, number>;

export interface SkillDefinition {
  name: string;
  ability: AbilityName;
  proficient: boolean;
  expertise: boolean;
  modifier: number;
}

export interface SpellSlot {
  level: number;
  total: number;
  used: number;
}

export interface Spell {
  id: string;
  name: string;
  level: number; // 0 for cantrip
  school: string;
  castingTime: string;
  range: string;
  components: {
    v: boolean;
    s: boolean;
    m: boolean;
    materialText?: string;
  };
  duration: string;
  concentration: boolean;
  ritual: boolean;
  description: string;
  higherLevels?: string;
  classes: string[];
  sourceBook?: string;
}

export interface CharacterWeapon {
  id: string;
  name: string;
  attackBonus: number;
  damageDice: string; // e.g. "1d8 + 3"
  damageType: string; // "Cortante", "Perforante", "Contundente", etc.
  range?: string;
  properties?: string;
}

export interface CharacterItem {
  id: string;
  name: string;
  quantity: number;
  weight?: number;
  equipped?: boolean;
  description?: string;
}

export interface Character {
  id: string;
  userId?: string;
  name: string;
  playerName?: string;
  species: string; // Raza / Especie (Reglas 2024)
  subspecies?: string;
  className: string;
  subclass?: string;
  level: number;
  background: string;
  originFeat?: string;
  alignment: string;
  experience: number;
  
  // Atributos y Modificadores
  abilities: AbilitiesRecord;
  
  // Combate & Salud
  maxHp: number;
  currentHp: number;
  tempHp: number;
  hitDie: string; // ej. "1d10"
  hitDiceTotal: number;
  hitDiceUsed: number;
  deathSaves: {
    successes: number;
    failures: number;
  };
  armorClass: number;
  initiativeBonus: number;
  speed: number;
  proficiencyBonus: number;
  
  // Competencias
  savingThrows: Record<AbilityName, boolean>;
  skills: Record<string, { proficient: boolean; expertise: boolean }>;
  languages: string[];
  weaponProficiencies: string[];
  armorProficiencies: string[];
  
  // Hechizos
  spellcastingAbility?: AbilityName;
  spellSaveDc?: number;
  spellAttackBonus?: number;
  spellSlots: SpellSlot[];
  knownSpells: Spell[];
  
  // Inventario & Riqueza
  weapons: CharacterWeapon[];
  inventory: CharacterItem[];
  coins: {
    cp: number; // Cobre
    sp: number; // Plata
    ep: number; // Electro
    gp: number; // Oro
    pp: number; // Platino
  };
  goldDragons?: number; // Moneda Oficial: Dragones de Oro (DO)
  adventureChronicles?: CharacterAdventureRecord[]; // Registro histórico de campañas en el Grimorio
  
  // Rasgos, Dotes & Trasfondo
  features: Array<{ title: string; source: string; description: string }>;
  feats?: CharacterFeatEntry[];
  stressScore?: number; // Puntuación de estrés (0 a 10, penalizador -X a tiradas de d20)
  darkGifts?: CharacterDarkGiftEntry[]; // Dones oscuros de Ravenloft
  dragonmark?: CharacterDragonmarkEntry; // Marca del Dragón de Eberron (+1d4 a tiradas)
  prosthetics?: ArcaneProstheticDef[]; // Prótesis arcanas y mejoras mecanizadas de Khorvaire
  personalityTraits?: string;
  ideals?: string;
  bonds?: string;
  flaws?: string;
  notes?: string;
  
  createdAt: string;
  updatedAt: string;
}

// -------------------------------------------------------------
// SISTEMA DE DOTES 2024 Y BENDICIONES ÉPICAS (PHB & DMG 2024)
// -------------------------------------------------------------
export type FeatCategory = 'origin' | 'general' | 'epic_boon';

export interface FeatDef {
  id: string;
  name: string;
  category: FeatCategory;
  levelPrerequisite: number; // 1 (Origen), 4 (General), 19 (Épica)
  prerequisitesText?: string;
  statOptions?: AbilityName[]; // Características que pueden recibir +1
  maxStatIncrease?: number; // 20 para generales, 30 para bendiciones épicas
  description: string;
  benefits: string[];
  repeatable?: boolean;
  sourceBook: string;
}

export interface CharacterFeatEntry {
  featId: string;
  name: string;
  category: FeatCategory;
  chosenStat?: AbilityName;
  customNotes?: string;
}

// -------------------------------------------------------------
// SISTEMA DE RAVENLOFT: DONES OSCUROS Y ESTRÉS (VAN RICHTEN)
// -------------------------------------------------------------
export interface DarkGiftDef {
  id: string;
  name: string;
  tagline: string;
  description: string;
  boons: string[]; // Beneficios sobrenaturales
  curses: string[]; // Inconvenientes o maldición
  sourceBook: string;
}

export interface CharacterDarkGiftEntry {
  giftId: string;
  name: string;
  boons: string[];
  curses: string[];
  acquiredAt?: string;
}

export interface PanicRollResult {
  roll: number;
  title: string;
  description: string;
  severity: 'leve' | 'moderada' | 'critica' | 'adrenalina';
}

export interface MonsterAction {
  name: string;
  desc: string;
  attackBonus?: number;
  damageDice?: string;
  damageType?: string;
}

export interface MonsterLegendaryAction {
  name: string;
  desc: string;
  cost?: number;
}

export interface Monster {
  id: string;
  name: string;
  size: 'Diminuto' | 'Pequeño' | 'Mediano' | 'Grande' | 'Enorme' | 'Gargantuesco';
  type: string; // "Humanoide", "Dragón", "No-muerto", "Monstruosidad", "Elemental", etc.
  subtype?: string;
  alignment: string;
  cr: string; // "1/8", "1/4", "1/2", "1", "2", ... "30"
  xp: number;
  ac: number;
  acType?: string; // ej. "armadura natural"
  hp: number;
  hitDice: string; // ej. "2d6 + 2"
  speed: string; // ej. "9 m, volar 18 m"
  
  abilities: AbilitiesRecord;
  
  savingThrows?: string;
  skills?: string;
  damageResistances?: string;
  damageImmunities?: string;
  conditionImmunities?: string;
  senses: string;
  languages: string;
  
  traits: Array<{ name: string; desc: string }>;
  actions: MonsterAction[];
  bonusActions?: MonsterAction[];
  reactions?: MonsterAction[];
  legendaryActions?: MonsterLegendaryAction[];
  
  sourceBook: string;
  page?: number;
  isCustom?: boolean;
}

export interface EncounterMonsterEntry {
  instanceId: string;
  monster: Monster;
  currentHp: number;
  maxHp: number;
  initiative: number;
  conditions: string[];
}

export interface EncounterPlayerEntry {
  instanceId: string;
  characterId: string;
  name: string;
  maxHp: number;
  currentHp: number;
  armorClass: number;
  initiative: number;
  conditions: string[];
}

export interface Encounter {
  id: string;
  name: string;
  environment?: string;
  players: EncounterPlayerEntry[];
  monsters: EncounterMonsterEntry[];
  currentRound: number;
  currentTurnIndex: number;
  isActive: boolean;
  notes?: string;
}

export interface SpeciesDef {
  id: string;
  name: string;
  speed: number;
  size: string;
  darkvision: number; // metros o pies
  traits: Array<{ name: string; desc: string }>;
  description: string;
}

export interface ClassDef {
  id: string;
  name: string;
  hitDie: string;
  primaryAbility: AbilityName[];
  savingThrows: AbilityName[];
  armorProficiencies: string[];
  weaponProficiencies: string[];
  spellcastingAbility?: AbilityName;
  description: string;
  features: Array<{ level: number; name: string; desc: string }>;
}

export interface BackgroundDef {
  id: string;
  name: string;
  suggestedAbilities: AbilityName[];
  originFeat: string;
  skillProficiencies: string[];
  toolProficiencies: string[];
  equipment: string[];
  description: string;
}

// -------------------------------------------------------------
// SISTEMA DE COMPAÑEROS / ESCUDEROS (SIDEKICKS - EL CALDERO DE TASHA)
// -------------------------------------------------------------
export type SidekickClassType = 'warrior' | 'expert' | 'spellcaster';
export type SidekickRole = 'attacker' | 'defender' | 'mage' | 'healer';

export interface SidekickAttack {
  id: string;
  name: string;
  type: 'melee' | 'ranged' | 'spell';
  bonus: number; // attack roll bonus
  reachOrRange: string; // e.g. "1.5 m (5 pies)" or "18/72 m"
  damageDice: string; // e.g. "1d8 + 3"
  damageType: string; // e.g. "Perforante", "Contundente", "Fuego"
  notes?: string; // e.g. "Derribo DC 12"
}

export interface SidekickFeature {
  level: number;
  name: string;
  source: string;
  description: string;
  actionType?: 'action' | 'bonus_action' | 'reaction' | 'passive';
}

export interface SidekickSpellcasting {
  ability: AbilityName;
  saveDc: number;
  attackBonus: number;
  cantrips: string[];
  knownSpells: Array<{ name: string; level: number; school: string; desc: string }>;
  slots: { [level: number]: { total: number; used: number } };
}

export interface Sidekick {
  id: string;
  name: string;
  creatureType: string; // e.g. "Mastín Guardián", "Lobo Joven", "Humanoide Escudero"
  size: 'Pequeño' | 'Mediano' | 'Grande';
  sidekickClass: SidekickClassType;
  role: SidekickRole;
  level: number; // 1-20
  armorClass: number;
  armorType?: string;
  speed: number;
  maxHp: number;
  currentHp: number;
  tempHp: number;
  hitDie: string; // e.g. "d8"
  abilities: Record<AbilityName, number>;
  savingThrows: Partial<Record<AbilityName, boolean>>;
  skills: string[];
  passivePerception: number;
  attacks: SidekickAttack[];
  features: SidekickFeature[];
  spellcasting?: SidekickSpellcasting;
  personalityTrait?: string;
  notes?: string;
  secondWindUsed?: boolean;
  assignedCharacterId?: string; // linked to hero character
  createdAt?: string;
  updatedAt?: string;
}

// -------------------------------------------------------------
// SISTEMA DE PATRONOS DE GRUPO E INTRIGAS (TASHA, EBERRON, VECNA)
// -------------------------------------------------------------
export type GroupPatronType =
  | 'academy'
  | 'ancient_being'
  | 'aristocrat'
  | 'criminal_syndicate'
  | 'guild'
  | 'military_force'
  | 'religious_order'
  | 'sovereign'
  | 'dragonmarked_house'
  | 'espionage_agency'
  | 'inquisitive_press'
  | 'vecna_cult';

export interface PatronPerk {
  title: string;
  desc: string;
}

export interface PatronContact {
  name: string;
  role: string;
  personality: string;
  secret: string;
  contactMethod: string;
}

export interface PatronMissionEntry {
  roll: number;
  title: string;
  prompt: string;
  target: string;
  defaultRewardGp: number;
  favorReward: number;
}

export interface PatronIntrigueEntry {
  roll: number;
  title: string;
  complication: string;
}

export interface GroupPatronDef {
  id: string;
  name: string;
  type: GroupPatronType;
  typeName: string;
  sourceBook: string;
  tagline: string;
  description: string;
  badgeColor: string;
  perks: PatronPerk[];
  contact: PatronContact;
  assignments: string[];
  compensation: {
    stipendPerDayGp: number;
    housingQuality: string;
    specialBenefit: string;
  };
  missionGeneratorTable: PatronMissionEntry[];
  intriguesTable: PatronIntrigueEntry[];
}

export interface PatronMission {
  id: string;
  patronId: string;
  title: string;
  prompt: string;
  target: string;
  rewardGp: number;
  favorReward: number;
  assignedDate: string;
  status: 'pending' | 'completed' | 'failed';
  completedDate?: string;
}

export interface ActivePatronCampaignState {
  patronId: string;
  customOrganizationName?: string;
  reputationScore: number; // de -5 (sospechosos/al borde de la expulsión) a +10 (héroes de la orden)
  favorsOwed: number; // favores que el patrón debe al grupo (positivo) o viceversa (negativo)
  totalGoldEarnedFromPatron: number;
  missions: PatronMission[];
  notes?: string;
}

// -------------------------------------------------------------
// SISTEMA DE MARCAS DEL DRAGÓN Y PRÓTESIS ARCANAS (EBERRON)
// -------------------------------------------------------------
export type DragonmarkType =
  | 'making'
  | 'detection'
  | 'finding'
  | 'healing'
  | 'hospitality'
  | 'passage'
  | 'scribing'
  | 'sentinel'
  | 'shadow'
  | 'storm'
  | 'handling'
  | 'aberrant';

export interface DragonmarkInnateSpell {
  name: string;
  level: number;
  castingTime: string;
  range: string;
  description: string;
}

export interface DragonmarkDef {
  id: string;
  name: string;
  houseName: string;
  speciesBase: string;
  type: DragonmarkType;
  tagline: string;
  description: string;
  badgeColor: string;
  intuitionSkills: string[]; // Nombres de habilidad o IDs que reciben +1d4
  intuitionSkillLabels: string[]; // Texto amigable en español
  innateSpells: DragonmarkInnateSpell[];
  spellsOfTheMark: string[]; // Conjuros agregados a la lista de lanzador
  specialTrait: {
    title: string;
    description: string;
  };
}

export interface CharacterDragonmarkEntry {
  markId: string;
  name: string;
  houseName: string;
  intuitionSkills: string[];
  assignedDate: string;
}

export type ProstheticRarity = 'Común' | 'Poco común' | 'Raro' | 'Muy raro' | 'Legendario';
export type ProstheticType = 'limb' | 'propulsion_arm' | 'wand_sheath' | 'ocular' | 'embedded_armor' | 'elemental_gauntlet';

export interface ArcaneProstheticDef {
  id: string;
  name: string;
  type: ProstheticType;
  rarity: ProstheticRarity;
  requiresAttunement: boolean;
  tagline: string;
  description: string;
  mechanicalBenefits: string[];
  integratedWeapon?: {
    name: string;
    attackBonusMod: string; // e.g. "STR" or "DEX"
    damage: string; // e.g. "1d8 + STR daño por fuerza"
    range: string; // e.g. "Cuerpo a cuerpo o 60 pies (retornable)"
  };
}

// -------------------------------------------------------------
// SISTEMA DE PERSECUCIONES (DMG 2024) Y GUARIDAS DE DRAGÓN
// -------------------------------------------------------------
export type ChaseRole = 'quarry' | 'pursuer';
export type ChaseParticipantStatus = 'active' | 'exhausted' | 'captured' | 'escaped';
export type ChaseEnvironment = 'urban' | 'wilderness';
export type ComplicationCheckType = 'DEX_SAVE' | 'STR_SAVE' | 'CON_SAVE' | 'ACROBATICS' | 'ATHLETICS' | 'NONE';

export interface ChaseParticipant {
  id: string;
  name: string;
  role: ChaseRole;
  speed: number; // en pies por turno (e.g. 30 o 35)
  conMod: number;
  freeDashesTotal: number; // 3 + conMod (mínimo 1)
  dashesUsed: number;
  currentPosition: number; // Distancia acumulada en pies
  status: ChaseParticipantStatus;
  exhaustionLevel: number; // 0 a 6
  characterId?: string; // Vinculado a personaje de la party
}

export interface ChaseComplication {
  roll: number; // 1 a 20
  title: string;
  description: string;
  dc: number;
  checkType: ComplicationCheckType;
  checkLabel: string;
  penaltyDescription: string;
}

export interface DragonLairAction {
  title: string;
  dc: number;
  saveAbility: 'dex' | 'con' | 'wis' | 'str' | 'int' | 'cha';
  saveAbilityLabel: string;
  damageDice: string; // e.g. "6d6"
  damageType: string; // e.g. "Fuego", "Frío", etc.
  description: string;
}

export interface DragonLairDef {
  id: string;
  dragonSpecies: string;
  dragonName: string;
  biome: string;
  lairName: string;
  themeColor: string;
  dc: number;
  actions: DragonLairAction[];
  regionalEffects: string[];
}

// -------------------------------------------------------------
// CLIMA SOBRENATURAL, BRUMAS Y NAVEGACIÓN (DMG 2024, XANATHAR, RAVENLOFT)
// -------------------------------------------------------------
export type WeatherCategory = 'mundane' | 'extreme' | 'supernatural';

export type WeatherConditionType =
  | 'clear'
  | 'extreme_cold'
  | 'extreme_heat'
  | 'heavy_rain'
  | 'strong_wind'
  | 'high_altitude'
  | 'ash_rain'
  | 'eldritch_wind'
  | 'illusory_fog'
  | 'aberrant_spores'
  | 'acid_rain';

export interface WeatherConditionDef {
  id: WeatherConditionType;
  name: string;
  category: WeatherCategory;
  temperatureDesc: string;
  visibilityDesc: string;
  mechanicalEffects: string[];
  requiresSave: boolean;
  saveType?: 'con' | 'wis' | 'dex';
  baseDc?: number;
  sourceBook: string;
  badgeColor: string;
}

export type MistSeverity = 'light' | 'dense' | 'domain_border';

export interface MistIncident {
  roll: number;
  title: string;
  dc: number;
  saveAbility: 'wis' | 'con';
  description: string;
  stressRisk: number;
  consequence: string;
}

export interface RavenloftDomainDef {
  id: string;
  name: string;
  darklord: string;
  genre: string;
  mistTalisman: string;
  description: string;
  dangerLevel: string;
}

export type SeaCondition = 'calm' | 'favorable' | 'rough' | 'storm' | 'hurricane';

export type ShipType = 'rowboat' | 'keelboat' | 'sailing_ship' | 'warship' | 'longship' | 'galley';

export interface ShipStats {
  id: ShipType;
  name: string;
  ac: number;
  maxHp: number;
  crewMin: number;
  crewMax: number;
  speedKnots: number;
  cargoTons: number;
  damageThreshold: number;
  costGp: number;
  description: string;
}

export interface ActiveShipVoyage {
  shipName: string;
  shipType: ShipType;
  currentHp: number;
  crewCount: number;
  freshWaterDays: number;
  milesTraveled: number;
  currentSeaCondition: SeaCondition;
  logEntries: string[];
}

export interface NavalHazard {
  roll: number;
  title: string;
  hazardType: 'environment' | 'supernatural' | 'creature' | 'wreck';
  dc: number;
  checkSkill: string;
  description: string;
  consequences: string;
  hullDamageDice?: string;
}

// -------------------------------------------------------------
// SISTEMA DE TRAMPAS COMPLEJAS (XANATHAR & DMG 2024)
// -------------------------------------------------------------
export type TrapTier = 'tier1' | 'tier2' | 'tier3' | 'tier4'; // Niveles 1-4, 5-10, 11-16, 17-20
export type TrapLethality = 'moderate' | 'dangerous' | 'deadly';

export interface ComplexTrapActiveElement {
  id: string;
  initiativeCount: number; // e.g. 20 or 10
  title: string;
  description: string;
  attackBonus?: number; // e.g. +8
  saveDc?: number; // e.g. 15
  saveAbility?: AbilityName;
  damageDice: string; // e.g. "4d10"
  damageType: string; // e.g. "Cortante", "Fuego", "Veneno"
  affectedArea: string; // e.g. "Pasillo central de 6 metros"
}

export interface ComplexTrapDynamicElement {
  triggerRound: number; // A partir del asalto N
  title: string;
  description: string;
  escalationEffect: string;
}

export interface ComplexTrapCountermeasure {
  id: string;
  title: string;
  skillOrTool: string; // e.g. "Herramientas de Ladrón", "Inteligencia (Arcanos)"
  dc: number;
  requiredSuccesses: number; // Típicamente 3 éxitos acumulativos
  currentSuccesses: number;
  description: string;
  componentAc?: number;
  maxHp?: number;
  currentHp?: number;
  isDisarmed: boolean;
}

export interface ComplexTrapDef {
  id: string;
  name: string;
  tier: TrapTier;
  tierLabel: string;
  lethality: TrapLethality;
  lethalityLabel: string;
  trigger: string;
  description: string;
  sourceBook: string;
  activeElements: ComplexTrapActiveElement[];
  dynamicElements: ComplexTrapDynamicElement[];
  countermeasures: ComplexTrapCountermeasure[];
}

export interface ActiveTrapCombatState {
  trapId: string;
  name: string;
  currentRound: number;
  activeInitiative: number;
  isFullyDisarmed: boolean;
  countermeasures: ComplexTrapCountermeasure[];
  combatLog: string[];
}

// -------------------------------------------------------------
// SISTEMA DE LINAJES Y ESPECIES MODERNIZADAS (MORDENKAINEN & 2024)
// -------------------------------------------------------------
export type CreatureCategoryType = 'Humanoide' | 'Feérico' | 'Monstruosidad' | 'No-muerto' | 'Humanoide / No-muerto' | 'Humanoide / Feérico';

export interface ModernSpeciesTrait {
  name: string;
  desc: string;
  actionType?: 'action' | 'bonus_action' | 'reaction' | 'passive';
  resourceMaxFormula?: string;
}

export interface ModernSpeciesInnateSpell {
  name: string;
  level: number;
  minCharLevel: number;
  castingTime: string;
  resetOn: 'short_rest' | 'long_rest';
  description?: string;
}

export interface ModernSpeciesDef extends SpeciesDef {
  creatureType: CreatureCategoryType;
  sourceBook: string;
  originTag: 'multiverse' | 'phb2024' | 'ravenloft' | 'eberron';
  asiRule: string;
  sizeChoice: 'Mediano' | 'Pequeño' | 'Mediano o Pequeño';
  specialSpeeds?: {
    fly?: number;
    swim?: number;
    climb?: number;
  };
  innateSpells?: ModernSpeciesInnateSpell[];
  languages: string[];
}

export interface SpeciesAsiAllocation {
  mode: 'two_one' | 'three_ones';
  plusTwo?: AbilityName;
  plusOneA?: AbilityName;
  plusOneB?: AbilityName;
  plusOneC?: AbilityName;
}

// -------------------------------------------------------------
// SISTEMA DE VENENOS, ENFERMEDADES Y ALQUIMIA (DMG 2024 & XANATHAR)
// -------------------------------------------------------------
export type PoisonDeliveryType = 'contact' | 'ingested' | 'inhaled' | 'injury';

export interface PoisonDef {
  id: string;
  name: string;
  delivery: PoisonDeliveryType;
  deliveryLabel: string;
  costGp: number;
  saveDc: number;
  damageDice?: string;
  effectDescription: string;
  onsetTime: string;
  duration: string;
  sourceBook: string;
  badgeColor: string;
}

export interface DiseaseDef {
  id: string;
  name: string;
  transmission: string;
  saveDc: number;
  incubationPeriod: string;
  symptoms: string;
  progression: string;
  cureRequirement: string;
  sourceBook: string;
  dangerSeverity: 'leve' | 'moderada' | 'mortal';
}

export interface HerbIngredientDef {
  id: string;
  name: string;
  biome: string;
  rarity: 'Común' | 'Poco común' | 'Raro' | 'Muy raro';
  extractUse: string;
  description: string;
}

export interface AlchemicalRecipeDef {
  id: string;
  name: string;
  outputItem: string;
  toolRequired: 'Kit de Envenenador' | 'Kit de Herboristería' | 'Suministros de Alquimista';
  craftingCostGp: number;
  daysRequired: number;
  requiredIngredients: string[];
  effectDescription: string;
}

// -------------------------------------------------------------
// SISTEMA DE CULTURA, TÁCTICAS DE MONSTRUOS Y GUARIDAS (VOLO, MORDENKAINEN, MULTIVERSO)
// -------------------------------------------------------------
export type MonsterTacticalRole = 'brute' | 'skirmisher' | 'artillery' | 'leader' | 'ambusher';

export type MonsterFactionType =
  | 'beholder'
  | 'mindflayer'
  | 'yuanti'
  | 'hags'
  | 'goblinoid'
  | 'orcs'
  | 'giants'
  | 'bloodwar';

export interface MonsterCultureDef {
  id: MonsterFactionType;
  name: string;
  subTitle: string;
  sourceBook: string;
  badgeColor: string;
  loreSummary: string;
  cosmologyAndDeities: string;
  socialHierarchy: Array<{ rank: string; role: string; description: string }>;
  psychologicalTraits: string[];
  tacticalStyle: string;
  lairCharacteristics: string;
  knownWeaknesses: string[];
  scholarQuote: { quote: string; author: string };
}

export interface TacticalWarbandMonster {
  monsterId: string;
  name: string;
  cr: string;
  xp: number;
  quantity: number;
  tacticalRole: MonsterTacticalRole;
  tacticalNote: string;
  // Plantilla rápida de atributos por si se inyecta directamente al encounter
  size: 'Diminuto' | 'Pequeño' | 'Mediano' | 'Grande' | 'Enorme' | 'Gargantuesco';
  type: string;
  hp: number;
  ac: number;
  speed: string;
  attackBonus: number;
  damageDice: string;
  damageType: string;
}

export interface TacticalWarbandDef {
  id: string;
  name: string;
  faction: MonsterFactionType;
  factionName: string;
  description: string;
  partyLevelTarget: string; // ej. "Nivel 3-5", "Nivel 7-9"
  totalCreatures: number;
  rawXp: number;
  adjustedXp: number;
  difficultyRating: 'Fácil' | 'Media' | 'Difícil' | 'Mortal';
  battlefieldRoleOverview: string;
  monsters: TacticalWarbandMonster[];
}

export interface LairChamberDef {
  id: string;
  faction: MonsterFactionType;
  name: string;
  purpose: string;
  physicalDescription: string;
  tacticalHazards: string[];
  defensiveMechanisms: string[];
  investigationClues: string[];
  suggestedEncounterCr: string;
}

export interface TacticalAiBehavior {
  role: MonsterTacticalRole;
  roleName: string;
  roleIcon: string;
  primaryDirective: string;
  targetPriority: string[];
  combatPhases: {
    opening: string;
    midBattle: string;
    criticalOrRetreat: string;
  };
  preferredCover: string;
  moraleBreakingPoint: string;
}

export interface MonsterMoraleCheckResult {
  breaks: boolean;
  roll: number;
  modifier: number;
  total: number;
  dc: number;
  actionTaken: 'fight_to_death' | 'orderly_retreat' | 'panic_flight' | 'surrender';
  description: string;
}

// -------------------------------------------------------------
// SISTEMA DE ROLES, AUTENTICACIÓN Y SUPER MASTER
// -------------------------------------------------------------
export type UserRole = 'player' | 'dm' | 'supermaster';

export interface UserAccountPermissions {
  bastionUnlocked: boolean; // Desbloqueado exclusivamente por el Super Master
  sidekicksUnlocked: boolean; // Desbloqueado exclusivamente por el Super Master
}

export interface UserAccount {
  id: string;
  email: string;
  username: string;
  password?: string; // Credenciales protegidas
  role: UserRole;
  goldDragons: number; // Moneda: Dragones de Oro (DO)
  permissions: UserAccountPermissions;
  createdAt: string;
}

// -------------------------------------------------------------
// CLASES Y RANGOS DE AVENTURERO (MISIONES Y CAMPAÑAS)
// -------------------------------------------------------------
// F: Niveles 1-2 (Novatos)
// E: Niveles 3-4 (Aventureros Prometedores)
// D: Niveles 5-6 (Héroes Locales)
// C: Niveles 7-8 (Defensores del Reino)
// B: Niveles 9-10 (Campeones Veteranos)
// A: Niveles 11-14 (Leyendas Provinciales)
// S: Niveles 15-16 (Paragones del Plano)
// SS: Niveles 17-19 (Titanes Multiversales)
// SS+: Nivel 20 (Cúspide Épica / Deífica)
export type AdventureRankClass = 'F' | 'E' | 'D' | 'C' | 'B' | 'A' | 'S' | 'SS' | 'SS+';

export type QuestStatus = 'open' | 'in_progress' | 'completed' | 'failed' | 'retreated';

export interface CampaignApplicant {
  characterId: string;
  characterName: string;
  playerName: string;
  characterLevel: number;
  characterClass: string;
  appliedAt: string;
  status: 'pending' | 'accepted' | 'rejected';
}

export interface CampaignQuest {
  id: string;
  title: string;
  description: string;
  masterId: string;
  masterName: string;
  sessionDate: string; // Fecha y hora de la partida
  maxPlayers: number;
  goldReward: number; // Recompensa en Dragones de Oro (DO)
  minLevel: number;
  maxLevel: number;
  rankClass: AdventureRankClass;
  status: QuestStatus;
  applicants: CampaignApplicant[];
  acceptedPlayerIds: string[];
  failureEscalated?: boolean; // Indicador de que fue escalada por el Super Master
  escalationCount?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Registro histórico para el Grimorio / Perfil de Aventuras
export interface CharacterAdventureRecord {
  id: string;
  questId: string;
  questTitle: string;
  masterName: string;
  sessionDate: string;
  rankClass: AdventureRankClass;
  outcome: 'victory' | 'defeat' | 'retreat';
  goldEarned: number; // Dragones de Oro obtenidos
  xpEarned?: number;
  chronicleNotes: string;
  recordedAt: string;
}

// Registro de Transferencias de Dragones de Oro
export interface GoldTransferRecord {
  id: string;
  fromUserId: string;
  fromUserName: string;
  toUserId: string;
  toUserName: string;
  amount: number;
  concept: string;
  timestamp: string;
}

