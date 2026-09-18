export type ScreenMode = 'campaign' | 'dashboard' | 'quest-map' | 'challenges' | 'boss-raid';

export interface UserStats {
  uid?: string;
  email?: string;
  username: string;
  avatar: string;
  level: number;
  tier: string;
  currentXp: number;
  nextLevelXp: number;
  streakDays: number;
  mana: number;
  clearedQuests: number;
  rankTitle: string;
  soundEnabled: boolean;
  githubUrl?: string;
  completedQuestIds: string[];
  unlockedAchievementIds: string[];
  defeatedBossIds: string[];
  skillPoints: Record<string, number>;
  lastActiveDate?: string;
}

export interface QuestCriterion {
  id: string;
  label: string;
  passed: boolean;
  hint?: string;
}

export interface Quest {
  id: string;
  title: string;
  sector: 'HTML' | 'CSS' | 'JS' | 'DOM' | 'APIs' | 'STORAGE' | 'FIREBASE';
  discipline: string;
  difficulty: 'Novice' | 'Adept' | 'Master' | 'Cyber Elite';
  xpReward: number;
  manaReward: number;
  skillsReward: { skill: string; xp: number }[];
  description: string;
  missionBrief: string;
  objectives: string[];
  starterJs?: string;
  starterHtml?: string;
  starterCss?: string;
  solutionJs?: string;
  solutionHtml?: string;
  solutionCss?: string;
  expectedOutput?: string;
  criteria: QuestCriterion[];
  validate: (code: { js: string; html: string; css: string }) => {
    success: boolean;
    results: { [criterionId: string]: boolean };
    logs: string[];
    error?: string;
  };
}

export interface BossChallenge {
  id: string;
  name: string;
  codename: string;
  sector: string;
  description: string;
  hp: number;
  maxHp: number;
  difficulty: string;
  rewardXp: number;
  rewardTitle: string;
  starterCode: string;
  solutionCode: string;
  glitchDiagnostics: {
    tab: string;
    title: string;
    description: string;
    astFindings: string[];
  }[];
  validationCriteria: {
    id: string;
    label: string;
  }[];
  validatePatch: (code: string) => {
    success: boolean;
    damage: number;
    passedCriteria: string[];
    log: string;
  };
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'quests' | 'bosses' | 'xp' | 'skills' | 'special';
  xpReward: number;
  isSecret?: boolean;
}

export interface SkillNode {
  id: string;
  name: string;
  category: 'HTML' | 'CSS' | 'JavaScript' | 'DOM' | 'APIs' | 'Git' | 'Firebase';
  description: string;
  level: number;
  maxLevel: number;
  currentXp: number;
  xpToNext: number;
  icon: string;
  unlocked: boolean;
}

export interface BountyItem {
  id: string;
  title: string;
  reward: string;
  xp: number;
  mana: number;
  completed: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'SYRUS' | 'YOU';
  text: string;
  timestamp: string;
  isCode?: boolean;
  codeSnippet?: string;
}

export interface LeaderboardEntry {
  rank: number;
  uid: string;
  username: string;
  avatar: string;
  level: number;
  tier: string;
  currentXp: number;
  clearedQuests: number;
  streakDays: number;
  rankTitle: string;
}
