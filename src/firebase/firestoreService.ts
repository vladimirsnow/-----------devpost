import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  orderBy,
  limit,
  getDocs,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './config';
import { UserStats, LeaderboardEntry } from '../types';

const USERS_COLLECTION = 'users';
const LEADERBOARD_COLLECTION = 'leaderboard';

export const defaultUserStats: UserStats = {
  username: 'AlexCoder',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  level: 1,
  tier: 'Cyber Initiate',
  currentXp: 120,
  nextLevelXp: 500,
  streakDays: 3,
  mana: 100,
  clearedQuests: 1,
  rankTitle: 'Script Novice',
  soundEnabled: true,
  githubUrl: 'https://github.com',
  completedQuestIds: ['q1'],
  unlockedAchievementIds: ['ach_first_step'],
  defeatedBossIds: [],
  skillPoints: {
    HTML: 1,
    CSS: 1,
    JavaScript: 1,
    DOM: 0,
    APIs: 0,
    Git: 0,
    Firebase: 0,
  },
};

export const syncUserProfile = async (
  uid: string,
  stats: Partial<UserStats>
): Promise<void> => {
  if (!isFirebaseConfigured() || !db) {
    const existing = localStorage.getItem('devquest_user_stats');
    const merged = { ...(existing ? JSON.parse(existing) : defaultUserStats), ...stats };
    localStorage.setItem('devquest_user_stats', JSON.stringify(merged));
    return;
  }

  try {
    const userDocRef = doc(db, USERS_COLLECTION, uid);
    await setDoc(userDocRef, { ...stats, lastActiveDate: new Date().toISOString() }, { merge: true });

    // Sync leaderboard document as well
    const leaderboardDocRef = doc(db, LEADERBOARD_COLLECTION, uid);
    await setDoc(
      leaderboardDocRef,
      {
        uid,
        username: stats.username || 'Operative',
        avatar: stats.avatar || defaultUserStats.avatar,
        level: stats.level || 1,
        tier: stats.tier || 'Initiate',
        currentXp: stats.currentXp || 0,
        clearedQuests: stats.clearedQuests || 0,
        streakDays: stats.streakDays || 1,
        rankTitle: stats.rankTitle || 'Novice',
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (error) {
    console.warn('[Firestore] Error syncing user profile:', error);
  }
};

export const fetchUserProfile = async (uid: string): Promise<UserStats | null> => {
  if (!isFirebaseConfigured() || !db) {
    const saved = localStorage.getItem('devquest_user_stats');
    return saved ? JSON.parse(saved) : defaultUserStats;
  }

  try {
    const userDocRef = doc(db, USERS_COLLECTION, uid);
    const snap = await getDoc(userDocRef);
    if (snap.exists()) {
      return snap.data() as UserStats;
    }
  } catch (error) {
    console.warn('[Firestore] Error fetching profile:', error);
  }

  return defaultUserStats;
};

export const fetchLeaderboard = async (): Promise<LeaderboardEntry[]> => {
  if (!isFirebaseConfigured() || !db) {
    return getSeedLeaderboard();
  }

  try {
    const lbRef = collection(db, LEADERBOARD_COLLECTION);
    const q = query(lbRef, orderBy('currentXp', 'desc'), limit(20));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return getSeedLeaderboard();
    }

    const list: LeaderboardEntry[] = [];
    let rank = 1;
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      list.push({
        rank: rank++,
        uid: data.uid || docSnap.id,
        username: data.username || 'Operative',
        avatar: data.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        level: data.level || 1,
        tier: data.tier || 'Initiate',
        currentXp: data.currentXp || 0,
        clearedQuests: data.clearedQuests || 0,
        streakDays: data.streakDays || 1,
        rankTitle: data.rankTitle || 'Novice',
      });
    });

    return list;
  } catch (error) {
    console.warn('[Firestore] Leaderboard query error, returning seed data:', error);
    return getSeedLeaderboard();
  }
};

export const getSeedLeaderboard = (): LeaderboardEntry[] => {
  return [
    {
      rank: 1,
      uid: 'seed-1',
      username: 'NeonViper',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
      level: 28,
      tier: 'Cyber Legend',
      currentXp: 18940,
      clearedQuests: 56,
      streakDays: 42,
      rankTitle: 'Grand Architect',
    },
    {
      rank: 2,
      uid: 'seed-2',
      username: 'Zero_Day',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      level: 24,
      tier: 'Master Vanguard',
      currentXp: 14200,
      clearedQuests: 48,
      streakDays: 29,
      rankTitle: 'Kernel Witch',
    },
    {
      rank: 3,
      uid: 'seed-3',
      username: 'BytePhantom',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
      level: 20,
      tier: 'Cyber Adept',
      currentXp: 10850,
      clearedQuests: 38,
      streakDays: 19,
      rankTitle: 'DOM Enchanter',
    },
    {
      rank: 4,
      uid: 'seed-4',
      username: 'QuantumGlitch',
      avatar: 'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?w=150&auto=format&fit=crop&q=80',
      level: 17,
      tier: 'Cyber Adept',
      currentXp: 7420,
      clearedQuests: 29,
      streakDays: 14,
      rankTitle: 'Async Phantom',
    },
    {
      rank: 5,
      uid: 'seed-5',
      username: 'PixelRonin',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      level: 14,
      tier: 'Cyber Initiate',
      currentXp: 4950,
      clearedQuests: 21,
      streakDays: 8,
      rankTitle: 'Flexbox Shifter',
    },
    {
      rank: 6,
      uid: 'seed-6',
      username: 'CypherValkyrie',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      level: 11,
      tier: 'Cyber Initiate',
      currentXp: 3100,
      clearedQuests: 14,
      streakDays: 5,
      rankTitle: 'Syntax Scribe',
    },
  ];
};
