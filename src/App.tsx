import React, { useState, useEffect } from 'react';
import { ScreenMode, UserStats } from './types';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LandingView } from './components/LandingView';
import { DashboardView } from './components/DashboardView';
import { QuestMapView } from './components/QuestMapView';
import { ChallengeStudioView } from './components/ChallengeStudioView';
import { BossRaidView } from './components/BossRaidView';
import { AuthModal } from './components/AuthModal';
import { ProfileModal } from './components/ProfileModal';
import { LeaderboardModal } from './components/LeaderboardModal';
import { AchievementsModal } from './components/AchievementsModal';
import { LevelUpModal } from './components/LevelUpModal';
import { subscribeToAuthChanges, logoutUser } from './firebase/authService';
import { fetchUserProfile, syncUserProfile, defaultUserStats } from './firebase/firestoreService';
import { checkEligibleAchievements } from './data/achievementsData';
import { playCyberSound } from './utils/audio';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenMode>('campaign');
  const [selectedQuestId, setSelectedQuestId] = useState<string>('q1');
  const [stats, setStats] = useState<UserStats>(defaultUserStats);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Modal visibility states
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [isAchievementsOpen, setIsAchievementsOpen] = useState(false);
  const [isLevelUpOpen, setIsLevelUpOpen] = useState(false);

  // Subscribe to Firebase Auth changes
  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges(async (user) => {
      setCurrentUser(user);
      if (user) {
        const profile = await fetchUserProfile(user.uid);
        if (profile) {
          setStats((prev) => ({
            ...prev,
            ...profile,
            uid: user.uid,
            email: user.email || prev.email,
            username: user.displayName || profile.username || prev.username,
          }));
        }
      }
    });
    return () => unsubscribe();
  }, []);

  // Update user stats and sync to Firestore / LocalStorage
  const handleUpdateStats = (newStats: Partial<UserStats>) => {
    setStats((prev) => {
      let updated: UserStats = { ...prev, ...newStats };

      // Auto-level up calculation
      if (updated.currentXp >= updated.nextLevelXp) {
        updated.level += 1;
        updated.currentXp = updated.currentXp - updated.nextLevelXp;
        updated.nextLevelXp = Math.round(updated.nextLevelXp * 1.3);

        if (updated.level >= 5 && updated.tier === 'Cyber Initiate') {
          updated.tier = 'Cyber Adept';
          updated.rankTitle = 'Syntax Vanguard';
        } else if (updated.level >= 10 && updated.tier === 'Cyber Adept') {
          updated.tier = 'Master Vanguard';
          updated.rankTitle = 'Kernel Architect';
        } else if (updated.level >= 20) {
          updated.tier = 'Cyber Legend';
          updated.rankTitle = 'Grand Sovereign';
        }

        setIsLevelUpOpen(true);
      }

      // Check achievement triggers
      const newlyEarned = checkEligibleAchievements(updated);
      if (newlyEarned.length > 0) {
        const earnedIds = newlyEarned.map((a) => a.id);
        updated.unlockedAchievementIds = [
          ...(updated.unlockedAchievementIds || []),
          ...earnedIds,
        ];
        const bonusXp = newlyEarned.reduce((sum, a) => sum + a.xpReward, 0);
        updated.currentXp += bonusXp;
      }

      // Sync to cloud Firestore
      if (updated.uid || currentUser?.uid) {
        syncUserProfile(updated.uid || currentUser?.uid, updated);
      } else {
        localStorage.setItem('devquest_user_stats', JSON.stringify(updated));
      }

      return updated;
    });
  };

  const handleToggleSound = () => {
    setStats((prev) => ({ ...prev, soundEnabled: !prev.soundEnabled }));
  };

  const handleLogout = async () => {
    await logoutUser();
    setCurrentUser(null);
    setStats(defaultUserStats);
    playCyberSound('blip', stats.soundEnabled);
  };

  const handleSelectQuest = (questId: string) => {
    setSelectedQuestId(questId);
  };

  // Scroll to top whenever screen changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentScreen]);

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0e15] text-[#e1e2ec] font-['Space_Mono',monospace] selection:bg-[#00c6ff] selection:text-[#004f67]">
      {/* Top Navbar HUD */}
      <Navbar
        currentScreen={currentScreen}
        onNavigate={setCurrentScreen}
        stats={stats}
        onToggleSound={handleToggleSound}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
        onOpenAchievements={() => setIsAchievementsOpen(true)}
        isAuthenticated={Boolean(currentUser)}
      />

      {/* Main Content View with Navigation Offset */}
      <main className="flex-1 flex flex-col pt-24 pb-8 w-full">
        {currentScreen === 'campaign' && (
          <LandingView
            onNavigate={setCurrentScreen}
            soundEnabled={stats.soundEnabled}
          />
        )}

        {currentScreen === 'dashboard' && (
          <DashboardView
            onNavigate={setCurrentScreen}
            stats={stats}
            onUpdateStats={handleUpdateStats}
            onSelectQuest={handleSelectQuest}
          />
        )}

        {currentScreen === 'quest-map' && (
          <QuestMapView
            onNavigate={setCurrentScreen}
            stats={stats}
            onSelectQuest={handleSelectQuest}
          />
        )}

        {currentScreen === 'challenges' && (
          <ChallengeStudioView
            onNavigate={setCurrentScreen}
            stats={stats}
            onUpdateStats={handleUpdateStats}
            selectedQuestId={selectedQuestId}
            onSelectQuest={handleSelectQuest}
          />
        )}

        {currentScreen === 'boss-raid' && (
          <BossRaidView
            onNavigate={setCurrentScreen}
            stats={stats}
            onUpdateStats={handleUpdateStats}
          />
        )}
      </main>

      {/* Global Cyber Footer */}
      <Footer onNavigate={setCurrentScreen} />

      {/* Global Modals */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={(user) => {
          setCurrentUser(user);
          if (user.displayName) {
            handleUpdateStats({ username: user.displayName, email: user.email });
          }
        }}
        soundEnabled={stats.soundEnabled}
      />

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        stats={stats}
        onUpdateStats={handleUpdateStats}
        onLogout={handleLogout}
        soundEnabled={stats.soundEnabled}
      />

      <LeaderboardModal
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
        currentUserStats={stats}
        soundEnabled={stats.soundEnabled}
      />

      <AchievementsModal
        isOpen={isAchievementsOpen}
        onClose={() => setIsAchievementsOpen(false)}
        stats={stats}
        soundEnabled={stats.soundEnabled}
      />

      <LevelUpModal
        isOpen={isLevelUpOpen}
        level={stats.level}
        rankTitle={stats.rankTitle}
        onClose={() => setIsLevelUpOpen(false)}
        soundEnabled={stats.soundEnabled}
      />
    </div>
  );
}
