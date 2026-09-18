import React, { useState } from 'react';
import { ScreenMode, UserStats } from '../types';
import { playCyberSound } from '../utils/audio';

interface NavbarProps {
  currentScreen: ScreenMode;
  onNavigate: (screen: ScreenMode) => void;
  stats: UserStats;
  onToggleSound: () => void;
  onOpenAuth: () => void;
  onOpenProfile: () => void;
  onOpenLeaderboard: () => void;
  onOpenAchievements: () => void;
  isAuthenticated: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentScreen,
  onNavigate,
  stats,
  onToggleSound,
  onOpenAuth,
  onOpenProfile,
  onOpenLeaderboard,
  onOpenAchievements,
  isAuthenticated,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: 1, title: 'SEASON IV: THE SYNTAX COLLAPSE', text: 'XP Multiplier 2.5x active in Sector 04.', time: '2m ago', unread: true },
    { id: 2, title: 'RAID ALERT', text: 'Malware Titan encroaching on Sector 01.', time: '14m ago', unread: true },
    { id: 3, title: 'GUILD BOUNTY CLAIMED', text: '+50 XP credited for CSS Flexbox fix.', time: '1h ago', unread: false },
  ];

  const xpPercent = Math.min(100, Math.round((stats.currentXp / stats.nextLevelXp) * 100));

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0b0e15]/90 backdrop-blur-xl border-b border-[#3d484f]/40 font-['Space_Mono',monospace]">
      {/* HUD STATUS TICKER / TELEMETRY BAR */}
      <div className="w-full bg-[#0b0e15] px-4 py-1.5 flex items-center justify-between text-[10px] uppercase tracking-widest text-[#bcc8d0] border-b border-[#1d1f27]">
        <div className="flex items-center space-x-4 md:space-x-6">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-[#5eecaf] shadow-[0_0_8px_rgba(94,236,175,0.8)] animate-pulse"></span>
            <span className="text-[#5eecaf] font-bold">GRID NODE: CYBER_ONLINE</span>
          </div>
          <div className="hidden md:flex items-center space-x-2 text-[#86929a]">
            <span>STREAK: 🔥 {stats.streakDays} DAYS</span>
            <span>//</span>
            <span>MANA: ⚡ {stats.mana} MP</span>
          </div>
        </div>
        <div className="flex items-center space-x-4 md:space-x-6">
          <div className="flex items-center space-x-1.5 text-[#96dcff]">
            <span className="material-symbols-outlined text-[14px]">bolt</span>
            <span className="font-bold">SEASON IV: SYNTAX COLLAPSE</span>
          </div>
          <div className="hidden sm:flex items-center space-x-2 text-[#ddb7ff]">
            <span>XP BOOST: 2.5X</span>
          </div>
        </div>
      </div>

      {/* PRIMARY NAVIGATION DECK */}
      <nav className="h-16 w-full px-4 lg:px-6 flex items-center justify-between gap-4">
        {/* Logo & Brand */}
        <div className="flex items-center gap-6 flex-shrink-0">
          <button
            onClick={() => {
              playCyberSound('blip', stats.soundEnabled);
              onNavigate('campaign');
            }}
            className="flex items-center gap-2 group text-left focus:outline-none"
          >
            <div className="relative w-9 h-9 flex items-center justify-center bg-[#0b0e15] border border-[#00c6ff]/40 rounded-lg shadow-[0_0_15px_rgba(0,198,255,0.25)] group-hover:border-[#00c6ff] transition-all">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 100 100">
                <polygon
                  className="opacity-80"
                  points="50,4 92,26 92,74 50,96 8,74 8,26"
                  stroke="#00c6ff"
                  strokeWidth="6"
                ></polygon>
                <path
                  d="M34 40 L22 50 L34 60"
                  stroke="#00c6ff"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="6"
                ></path>
                <path
                  d="M66 40 L78 50 L66 60"
                  stroke="#ddb7ff"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="6"
                ></path>
                <polygon
                  className="opacity-90"
                  fill="#6dd2ff"
                  points="50,22 58,50 50,78 42,50"
                ></polygon>
                <circle cx="50" cy="38" fill="#ffffff" r="4.5"></circle>
              </svg>
            </div>
            <div>
              <span className="font-['Space_Grotesk'] text-lg tracking-wider font-bold text-white flex items-center gap-1.5">
                DEV<span className="text-[#00c6ff]">QUEST</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#272a32] text-[#96dcff] font-['Space_Mono'] font-bold">
                  RPG_IDE
                </span>
              </span>
            </div>
          </button>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center space-x-1">
            <button
              onClick={() => {
                playCyberSound('blip', stats.soundEnabled);
                onNavigate('campaign');
              }}
              className={`px-3 py-1.5 rounded text-xs font-bold transition-all ${
                currentScreen === 'campaign'
                  ? 'bg-[#191b23] text-[#00c6ff] border border-[#00c6ff]/30 shadow-[0_0_10px_rgba(0,198,255,0.2)]'
                  : 'text-[#bcc8d0] hover:text-white hover:bg-[#191b23]/50'
              }`}
            >
              LANDING
            </button>
            <button
              onClick={() => {
                playCyberSound('blip', stats.soundEnabled);
                onNavigate('dashboard');
              }}
              className={`px-3 py-1.5 rounded text-xs font-bold transition-all ${
                currentScreen === 'dashboard'
                  ? 'bg-[#191b23] text-[#00c6ff] border border-[#00c6ff]/30 shadow-[0_0_10px_rgba(0,198,255,0.2)]'
                  : 'text-[#bcc8d0] hover:text-white hover:bg-[#191b23]/50'
              }`}
            >
              DASHBOARD
            </button>
            <button
              onClick={() => {
                playCyberSound('blip', stats.soundEnabled);
                onNavigate('quest-map');
              }}
              className={`px-3 py-1.5 rounded text-xs font-bold transition-all ${
                currentScreen === 'quest-map'
                  ? 'bg-[#191b23] text-[#00c6ff] border border-[#00c6ff]/30 shadow-[0_0_10px_rgba(0,198,255,0.2)]'
                  : 'text-[#bcc8d0] hover:text-white hover:bg-[#191b23]/50'
              }`}
            >
              QUEST MAP
            </button>
            <button
              onClick={() => {
                playCyberSound('blip', stats.soundEnabled);
                onNavigate('challenges');
              }}
              className={`px-3 py-1.5 rounded text-xs font-bold transition-all ${
                currentScreen === 'challenges'
                  ? 'bg-[#191b23] text-[#00c6ff] border border-[#00c6ff]/30 shadow-[0_0_10px_rgba(0,198,255,0.2)]'
                  : 'text-[#bcc8d0] hover:text-white hover:bg-[#191b23]/50'
              }`}
            >
              CHALLENGE STUDIO
            </button>
            <button
              onClick={() => {
                playCyberSound('blip', stats.soundEnabled);
                onNavigate('boss-raid');
              }}
              className={`px-3 py-1.5 rounded text-xs font-bold transition-all ${
                currentScreen === 'boss-raid'
                  ? 'bg-red-950/40 text-red-400 border border-red-500/40 shadow-[0_0_10px_rgba(239,68,68,0.2)]'
                  : 'text-red-400/80 hover:text-red-300 hover:bg-red-950/30'
              }`}
            >
              BOSS RAID
            </button>
          </div>
        </div>

        {/* User HUD Stats & Actions */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          {/* XP Gauge (Hidden on mobile) */}
          <div className="hidden md:flex flex-col items-end w-36 lg:w-44">
            <div className="flex justify-between w-full text-[10px] text-[#bcc8d0] font-bold">
              <span>LVL {stats.level}</span>
              <span className="text-[#00c6ff]">{stats.currentXp}/{stats.nextLevelXp} XP</span>
            </div>
            <div className="w-full h-1.5 bg-[#191b23] rounded-full overflow-hidden border border-[#3d484f]/40 mt-1">
              <div
                className="h-full bg-gradient-to-r from-[#00c6ff] to-[#ddb7ff] rounded-full transition-all duration-300 shadow-[0_0_6px_rgba(0,198,255,0.8)]"
                style={{ width: `${xpPercent}%` }}
              ></div>
            </div>
          </div>

          {/* Leaderboard Button */}
          <button
            onClick={() => {
              playCyberSound('blip', stats.soundEnabled);
              onOpenLeaderboard();
            }}
            title="Global Leaderboard"
            className="p-2 rounded-lg bg-[#191b23] border border-[#3d484f]/40 hover:border-[#00c6ff] text-[#bcc8d0] hover:text-[#00c6ff] transition-all"
          >
            <span className="material-symbols-outlined text-lg block">leaderboard</span>
          </button>

          {/* Achievements Button */}
          <button
            onClick={() => {
              playCyberSound('blip', stats.soundEnabled);
              onOpenAchievements();
            }}
            title="Achievements"
            className="p-2 rounded-lg bg-[#191b23] border border-[#3d484f]/40 hover:border-[#ddb7ff] text-[#bcc8d0] hover:text-[#ddb7ff] transition-all"
          >
            <span className="material-symbols-outlined text-lg block">military_tech</span>
          </button>

          {/* Sound FX Toggle */}
          <button
            onClick={() => {
              onToggleSound();
              playCyberSound('blip', !stats.soundEnabled);
            }}
            title={stats.soundEnabled ? 'Mute Audio FX' : 'Enable Audio FX'}
            className={`p-2 rounded-lg border transition-all ${
              stats.soundEnabled
                ? 'bg-[#191b23] border-[#5eecaf]/40 text-[#5eecaf]'
                : 'bg-[#191b23] border-[#3d484f]/40 text-[#86929a]'
            }`}
          >
            <span className="material-symbols-outlined text-lg block">
              {stats.soundEnabled ? 'volume_up' : 'volume_off'}
            </span>
          </button>

          {/* User Profile / Auth Button */}
          {isAuthenticated ? (
            <button
              onClick={() => {
                playCyberSound('blip', stats.soundEnabled);
                onOpenProfile();
              }}
              className="flex items-center gap-2 p-1.5 rounded-lg bg-[#191b23] border border-[#00c6ff]/40 hover:border-[#00c6ff] transition-all group"
            >
              <img
                src={stats.avatar}
                alt={stats.username}
                className="w-7 h-7 rounded object-cover border border-[#3d484f]"
              />
              <span className="hidden sm:inline text-xs font-bold text-white group-hover:text-[#00c6ff] max-w-[100px] truncate">
                {stats.username}
              </span>
            </button>
          ) : (
            <button
              onClick={() => {
                playCyberSound('blip', stats.soundEnabled);
                onOpenAuth();
              }}
              className="px-3 py-1.5 bg-gradient-to-r from-[#00c6ff] to-[#0072ff] hover:from-[#38d4ff] hover:to-[#1a82ff] text-black font-bold text-xs uppercase tracking-wider rounded transition-all shadow-[0_0_12px_rgba(0,198,255,0.3)]"
            >
              SIGN IN
            </button>
          )}
        </div>
      </nav>
    </header>
  );
};
