import React, { useState, useEffect } from 'react';
import { ScreenMode, UserStats, BountyItem } from '../types';
import { QUESTS } from '../data/questsData';
import { ACHIEVEMENTS } from '../data/achievementsData';
import { SKILLS_DATA } from '../data/skillsData';
import { playCyberSound } from '../utils/audio';

interface DashboardViewProps {
  onNavigate: (screen: ScreenMode) => void;
  stats: UserStats;
  onUpdateStats: (newStats: Partial<UserStats>) => void;
  onSelectQuest?: (questId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigate,
  stats,
  onUpdateStats,
  onSelectQuest,
}) => {
  const [bounties, setBounties] = useState<BountyItem[]>([
    { id: 'b1', title: 'Refactor 3 callback functions into ES6 Promises', reward: '+50 XP, 10 Mana', xp: 50, mana: 10, completed: false },
    { id: 'b2', title: 'Defeat 1 Mini-glitch in CSS Grid Overflow', reward: '+80 XP, 15 Mana', xp: 80, mana: 15, completed: true },
    { id: 'b3', title: 'Submit 1 clean PR with unit test validation', reward: '+120 XP, 25 Mana', xp: 120, mana: 25, completed: false },
  ]);

  const [claimedStreakToday, setClaimedStreakToday] = useState(false);
  const [raidTimeRemaining, setRaidTimeRemaining] = useState(14400);

  // Live countdown timer for Raid Boss
  useEffect(() => {
    const timer = setInterval(() => {
      setRaidTimeRemaining((prev) => (prev > 0 ? prev - 1 : 18000));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatRaidTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const toggleBounty = (id: string) => {
    playCyberSound('blip', stats.soundEnabled);
    setBounties((prev) =>
      prev.map((b) => {
        if (b.id === id) {
          const nextState = !b.completed;
          if (nextState) {
            onUpdateStats({
              currentXp: stats.currentXp + b.xp,
              mana: stats.mana + b.mana,
            });
          }
          return { ...b, completed: nextState };
        }
        return b;
      })
    );
  };

  const handleClaimStreak = () => {
    if (claimedStreakToday) return;
    playCyberSound('surge', stats.soundEnabled);
    setClaimedStreakToday(true);
    onUpdateStats({
      streakDays: (stats.streakDays || 1) + 1,
      currentXp: stats.currentXp + 50,
      mana: stats.mana + 20,
    });
  };

  // Find next uncompleted quest
  const completedIds = stats.completedQuestIds || [];
  const nextQuest = QUESTS.find((q) => !completedIds.includes(q.id)) || QUESTS[0];

  const unlockedAchCount = stats.unlockedAchievementIds?.length || 1;
  const xpPercent = Math.min(100, Math.round((stats.currentXp / stats.nextLevelXp) * 100));

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 font-['Space_Mono',monospace]">
      {/* WELCOME BANNER & MISSION CALLOUT */}
      <div className="relative rounded-2xl bg-gradient-to-r from-[#191b23] via-[#1d1f27] to-[#10131a] border border-[#00c6ff]/30 p-6 sm:p-8 overflow-hidden shadow-2xl">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-0.5 bg-[#272a32] text-[#00c6ff] text-[10px] rounded font-bold uppercase tracking-wider">
                GRID OPERATIVE // ACTIVE RUNTIME
              </span>
              <span className="flex items-center gap-1.5 text-[10px] text-[#5eecaf] font-bold">
                <span className="w-2 h-2 rounded-full bg-[#5eecaf] animate-pulse"></span>
                SYSTEM HEALTH 100%
              </span>
            </div>

            <h1 className="font-['Space_Grotesk'] text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
              Welcome back, Operative <span className="text-[#00c6ff]">{stats.username}</span>
            </h1>

            <p className="text-xs sm:text-sm text-[#bcc8d0] max-w-2xl">
              Next scheduled objective:{' '}
              <strong className="text-white font-['Space_Grotesk']">
                {nextQuest.title}
              </strong>{' '}
              ({nextQuest.discipline}). Complete this node to earn +{nextQuest.xpReward} XP.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap gap-3 shrink-0">
            <button
              onClick={() => {
                playCyberSound('laser', stats.soundEnabled);
                if (onSelectQuest) onSelectQuest(nextQuest.id);
                onNavigate('challenges');
              }}
              className="px-6 py-3 bg-gradient-to-r from-[#00c6ff] via-[#38d4ff] to-[#0072ff] hover:from-[#38d4ff] hover:to-[#1a82ff] text-black font-bold text-xs uppercase tracking-wider rounded-lg shadow-[0_0_20px_rgba(0,198,255,0.4)] transition-all flex items-center gap-2"
            >
              <span>CONTINUE JOURNEY</span>
              <span className="text-sm">➔</span>
            </button>

            <button
              onClick={() => {
                playCyberSound('blip', stats.soundEnabled);
                onNavigate('quest-map');
              }}
              className="px-4 py-3 bg-[#191b23] hover:bg-[#272a32] border border-[#3d484f] text-[#bcc8d0] hover:text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors"
            >
              VIEW MAP
            </button>
          </div>
        </div>
      </div>

      {/* 4 STATS COUNTER CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Level & XP */}
        <div className="p-4 sm:p-5 rounded-xl bg-[#10131a] border border-[#00c6ff]/30 space-y-2">
          <div className="flex items-center justify-between text-xs text-[#86929a]">
            <span>LEVEL PROGRESS</span>
            <span className="text-[#00c6ff] font-bold">LVL {stats.level}</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold font-['Space_Grotesk'] text-white">
            {stats.currentXp.toLocaleString()} <span className="text-xs text-[#86929a]">XP</span>
          </div>
          <div className="w-full h-1.5 bg-[#0b0e15] rounded-full overflow-hidden border border-[#3d484f]/40">
            <div
              className="h-full bg-gradient-to-r from-[#00c6ff] to-[#ddb7ff] rounded-full"
              style={{ width: `${xpPercent}%` }}
            ></div>
          </div>
        </div>

        {/* Card 2: Streak */}
        <div className="p-4 sm:p-5 rounded-xl bg-[#10131a] border border-orange-500/30 space-y-2">
          <div className="flex items-center justify-between text-xs text-[#86929a]">
            <span>DAILY STREAK</span>
            <span className="text-orange-400 font-bold">ACTIVE</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold font-['Space_Grotesk'] text-white flex items-center justify-between">
            <span>🔥 {stats.streakDays} Days</span>
            <button
              onClick={handleClaimStreak}
              disabled={claimedStreakToday}
              className={`px-2 py-0.5 text-[10px] rounded font-bold uppercase transition-colors ${
                claimedStreakToday
                  ? 'bg-[#191b23] text-[#5eecaf] border border-[#5eecaf]/30'
                  : 'bg-orange-500 hover:bg-orange-400 text-black shadow-[0_0_8px_rgba(249,115,22,0.4)]'
              }`}
            >
              {claimedStreakToday ? 'CLAIMED' : '+50 XP'}
            </button>
          </div>
          <p className="text-[10px] text-[#86929a]">Check in daily to earn streak multipliers</p>
        </div>

        {/* Card 3: Cleared Quests */}
        <div className="p-4 sm:p-5 rounded-xl bg-[#10131a] border border-[#5eecaf]/30 space-y-2">
          <div className="flex items-center justify-between text-xs text-[#86929a]">
            <span>CLEARED QUESTS</span>
            <span className="text-[#5eecaf] font-bold">10 TOTAL</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold font-['Space_Grotesk'] text-white">
            {completedIds.length} <span className="text-xs text-[#86929a]">COMPLETED</span>
          </div>
          <p className="text-[10px] text-[#5eecaf]">
            {Math.round((completedIds.length / 10) * 100)}% Curriculum Mastered
          </p>
        </div>

        {/* Card 4: Raid Countdown */}
        <div className="p-4 sm:p-5 rounded-xl bg-[#10131a] border border-red-500/30 space-y-2">
          <div className="flex items-center justify-between text-xs text-[#86929a]">
            <span>NEXT BOSS RAID</span>
            <span className="text-red-400 font-bold animate-pulse">ACTIVE</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold font-['Space_Grotesk'] text-red-400">
            {formatRaidTime(raidTimeRemaining)}
          </div>
          <p className="text-[10px] text-[#86929a]">Malware Titan waiting in Sector 01</p>
        </div>
      </div>

      {/* 2-COLUMN MAIN CONTENT: SKILL MATRIX & BOUNTY BOARD */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: SKILLS PROGRESSION MATRIX (6 COLS) */}
        <div className="lg:col-span-6 p-6 rounded-2xl bg-[#10131a] border border-[#3d484f]/40 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-[#1d1f27] pb-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#00c6ff] text-xl">psychology</span>
              <h3 className="text-base font-bold font-['Space_Grotesk'] text-white">
                SKILL MASTERY MATRIX
              </h3>
            </div>
            <span className="text-[10px] text-[#86929a]">AUTOMATIC GAIN FROM QUESTS</span>
          </div>

          <div className="space-y-3">
            {SKILLS_DATA.map((skill) => {
              const percent = Math.min(100, Math.round((skill.currentXp / skill.xpToNext) * 100));
              return (
                <div
                  key={skill.id}
                  className="p-3 rounded-lg bg-[#191b23] border border-[#3d484f]/30 space-y-2"
                >
                  <div className="flex justify-between items-center text-xs">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm text-[#00c6ff]">
                        {skill.icon}
                      </span>
                      <span className="font-bold text-white">{skill.name}</span>
                    </div>
                    <span className="text-[11px] text-[#ddb7ff] font-bold">
                      LVL {skill.level} ({percent}%)
                    </span>
                  </div>

                  <div className="w-full h-1.5 bg-[#0b0e15] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#00c6ff] to-[#5eecaf] rounded-full"
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: BOUNTY BOARD & RECENT ACHIEVEMENTS (6 COLS) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Daily Bounties */}
          <div className="p-6 rounded-2xl bg-[#10131a] border border-[#3d484f]/40 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-[#1d1f27] pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#5eecaf] text-xl">verified</span>
                <h3 className="text-base font-bold font-['Space_Grotesk'] text-white">
                  GUILD BOUNTIES
                </h3>
              </div>
              <span className="text-[10px] text-[#5eecaf] font-bold">RESETS IN 08:42</span>
            </div>

            <div className="space-y-2.5">
              {bounties.map((b) => (
                <div
                  key={b.id}
                  onClick={() => toggleBounty(b.id)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all flex items-center justify-between ${
                    b.completed
                      ? 'bg-emerald-950/20 border-[#5eecaf]/40 text-[#5eecaf]'
                      : 'bg-[#191b23] border-[#3d484f]/40 text-[#bcc8d0] hover:border-[#00c6ff]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm">{b.completed ? '✓' : '○'}</span>
                    <div>
                      <h4 className="text-xs font-bold text-white">{b.title}</h4>
                      <span className="text-[10px] text-[#86929a]">{b.reward}</span>
                    </div>
                  </div>
                  <span className="text-[10px] uppercase font-bold text-[#00c6ff]">
                    {b.completed ? 'CLAIMED' : 'CLAIM'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Achievements Summary */}
          <div className="p-6 rounded-2xl bg-[#10131a] border border-[#ddb7ff]/30 space-y-3 shadow-xl">
            <div className="flex items-center justify-between border-b border-[#1d1f27] pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#ddb7ff] text-xl">military_tech</span>
                <h3 className="text-base font-bold font-['Space_Grotesk'] text-white">
                  MEDAL DECK STATUS
                </h3>
              </div>
              <span className="text-xs font-bold text-[#ddb7ff]">
                {unlockedAchCount} / {ACHIEVEMENTS.length} Unlocked
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2 text-center">
              {ACHIEVEMENTS.slice(0, 4).map((ach) => {
                const isUnlocked = stats.unlockedAchievementIds?.includes(ach.id);
                return (
                  <div
                    key={ach.id}
                    className={`p-2 rounded-lg border flex flex-col items-center justify-center gap-1 ${
                      isUnlocked
                        ? 'bg-[#191b23] border-[#ddb7ff]/50 text-[#ddb7ff]'
                        : 'bg-[#0b0e15] border-[#3d484f]/30 text-[#86929a] opacity-50'
                    }`}
                  >
                    <span className="material-symbols-outlined text-lg">{ach.icon}</span>
                    <span className="text-[9px] font-bold truncate max-w-[60px]">{ach.title}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
