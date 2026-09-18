import { Achievement, UserStats } from '../types';

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach_first_step',
    title: 'First Step into Cyber Grid',
    description: 'Complete your first coding quest.',
    icon: 'terminal',
    category: 'quests',
    xpReward: 100,
  },
  {
    id: 'ach_5_quests',
    title: 'Code Operative',
    description: 'Complete 5 coding quests across any sectors.',
    icon: 'code_blocks',
    category: 'quests',
    xpReward: 250,
  },
  {
    id: 'ach_10_quests',
    title: 'Grand Grid Scribe',
    description: 'Complete all 10 standard coding quests.',
    icon: 'military_tech',
    category: 'quests',
    xpReward: 500,
  },
  {
    id: 'ach_first_boss',
    title: 'Titan Slayer',
    description: 'Defeat your first Boss challenge in the Raid Arena.',
    icon: 'swords',
    category: 'bosses',
    xpReward: 500,
  },
  {
    id: 'ach_all_bosses',
    title: 'Corrupted Kernel Nemesis',
    description: 'Defeat all 3 Boss challenges (HTML, CSS, JS).',
    icon: 'shield_moon',
    category: 'bosses',
    xpReward: 1000,
  },
  {
    id: 'ach_level_10',
    title: 'Cyber Adept Ascent',
    description: 'Reach Player Level 10.',
    icon: 'bolt',
    category: 'xp',
    xpReward: 300,
  },
  {
    id: 'ach_streak_7',
    title: 'Unstoppable Neural Pulse',
    description: 'Maintain a 7-day coding streak.',
    icon: 'local_fire_department',
    category: 'special',
    xpReward: 350,
  },
  {
    id: 'ach_debugger',
    title: 'Master Debugger',
    description: 'Fix a Boss syntax error on the first hotfix attempt.',
    icon: 'bug_report',
    category: 'skills',
    xpReward: 400,
  },
  {
    id: 'ach_sound_enthusiast',
    title: 'Cyberpunk Audiophile',
    description: 'Execute spells with Cyber SFX active.',
    icon: 'volume_up',
    category: 'special',
    xpReward: 50,
  },
];

export const checkEligibleAchievements = (stats: UserStats): Achievement[] => {
  const unlocked = stats.unlockedAchievementIds || [];
  const newlyUnlocked: Achievement[] = [];

  const addIf = (id: string, condition: boolean) => {
    if (condition && !unlocked.includes(id)) {
      const ach = ACHIEVEMENTS.find(a => a.id === id);
      if (ach) newlyUnlocked.push(ach);
    }
  };

  addIf('ach_first_step', (stats.completedQuestIds?.length || 0) >= 1);
  addIf('ach_5_quests', (stats.completedQuestIds?.length || 0) >= 5);
  addIf('ach_10_quests', (stats.completedQuestIds?.length || 0) >= 10);
  addIf('ach_first_boss', (stats.defeatedBossIds?.length || 0) >= 1);
  addIf('ach_all_bosses', (stats.defeatedBossIds?.length || 0) >= 3);
  addIf('ach_level_10', (stats.level || 1) >= 10);
  addIf('ach_streak_7', (stats.streakDays || 1) >= 7);

  return newlyUnlocked;
};
