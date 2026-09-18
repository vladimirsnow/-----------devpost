import React, { useState } from 'react';
import { UserStats } from '../types';
import { playCyberSound } from '../utils/audio';
import { SKILLS_DATA } from '../data/skillsData';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: UserStats;
  onUpdateStats: (newStats: Partial<UserStats>) => void;
  onLogout: () => void;
  soundEnabled: boolean;
}

const AVATAR_OPTIONS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
];

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  stats,
  onUpdateStats,
  onLogout,
  soundEnabled,
}) => {
  const [username, setUsername] = useState(stats.username || 'AlexCoder');
  const [githubUrl, setGithubUrl] = useState(stats.githubUrl || 'https://github.com');
  const [selectedAvatar, setSelectedAvatar] = useState(stats.avatar || AVATAR_OPTIONS[0]);
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    playCyberSound('surge', soundEnabled);
    onUpdateStats({
      username,
      githubUrl,
      avatar: selectedAvatar,
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const xpPercent = Math.min(100, Math.round((stats.currentXp / stats.nextLevelXp) * 100));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#10131a] border border-[#00c6ff]/40 rounded-xl p-6 sm:p-8 shadow-[0_0_40px_rgba(0,198,255,0.2)] font-['Space_Mono',monospace] max-h-[90vh] overflow-y-auto">
        {/* Glow corner accents */}
        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#00c6ff]"></div>
        <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#00c6ff]"></div>
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#00c6ff]"></div>
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#00c6ff]"></div>

        {/* Close Button */}
        <button
          onClick={() => {
            playCyberSound('blip', soundEnabled);
            onClose();
          }}
          className="absolute top-4 right-4 text-[#86929a] hover:text-white transition-colors"
        >
          ✕
        </button>

        {/* Header Title */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#1d1f27]">
          <div className="w-12 h-12 rounded-lg border border-[#00c6ff] p-0.5 overflow-hidden">
            <img src={selectedAvatar} alt="Operative Avatar" className="w-full h-full object-cover rounded" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold font-['Space_Grotesk'] text-white">
                OPERATIVE DOSSIER // {stats.username}
              </h2>
              <span className="px-2 py-0.5 rounded bg-[#272a32] text-[10px] text-[#00c6ff] font-bold">
                LVL {stats.level}
              </span>
            </div>
            <p className="text-xs text-[#86929a]">{stats.rankTitle} • {stats.tier}</p>
          </div>
        </div>

        {/* Level & XP Progress Meter */}
        <div className="p-4 rounded-lg bg-[#191b23] border border-[#3d484f]/40 mb-6 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-[#bcc8d0] uppercase tracking-wider">Experience Level</span>
            <span className="text-[#00c6ff] font-bold">
              {stats.currentXp.toLocaleString()} / {stats.nextLevelXp.toLocaleString()} XP ({xpPercent}%)
            </span>
          </div>
          <div className="w-full h-3 bg-[#0b0e15] rounded-full overflow-hidden border border-[#3d484f]/50 p-0.5">
            <div
              className="h-full bg-gradient-to-r from-[#00c6ff] to-[#ddb7ff] rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(0,198,255,0.8)]"
              style={{ width: `${xpPercent}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-[10px] text-[#86929a] pt-1">
            <span>Streak: 🔥 {stats.streakDays} Days</span>
            <span>Mana Buffer: ⚡ {stats.mana} MP</span>
            <span>Quests Cleared: 🎯 {stats.completedQuestIds?.length || stats.clearedQuests}</span>
          </div>
        </div>

        {/* Profile Settings Form */}
        <form onSubmit={handleSave} className="space-y-5">
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-[#86929a] mb-2">
              Select Cyber Avatar
            </label>
            <div className="grid grid-cols-6 gap-2">
              {AVATAR_OPTIONS.map((avatar, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => {
                    playCyberSound('blip', soundEnabled);
                    setSelectedAvatar(avatar);
                  }}
                  className={`relative rounded-lg p-0.5 border-2 transition-all overflow-hidden ${
                    selectedAvatar === avatar
                      ? 'border-[#00c6ff] shadow-[0_0_12px_rgba(0,198,255,0.6)] scale-105'
                      : 'border-[#3d484f]/50 hover:border-[#86929a] opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={avatar} alt={`Avatar ${idx}`} className="w-full h-12 object-cover rounded" />
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#86929a] mb-1">
                Operative Codename
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 bg-[#191b23] border border-[#3d484f] rounded text-sm text-white focus:outline-none focus:border-[#00c6ff]"
              />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#86929a] mb-1">
                GitHub Repository / Profile URL
              </label>
              <input
                type="url"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/yourhandle"
                className="w-full px-3 py-2 bg-[#191b23] border border-[#3d484f] rounded text-sm text-white focus:outline-none focus:border-[#00c6ff]"
              />
            </div>
          </div>

          {/* Skill Matrix Summary */}
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-[#86929a] mb-2">
              Acquired Cyber Skills
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {SKILLS_DATA.map((skill) => (
                <div
                  key={skill.id}
                  className="p-2.5 rounded bg-[#191b23] border border-[#3d484f]/40 flex items-center justify-between"
                >
                  <div>
                    <div className="text-xs font-bold text-white">{skill.category}</div>
                    <div className="text-[10px] text-[#00c6ff]">Level {skill.level}</div>
                  </div>
                  <span className="material-symbols-outlined text-[18px] text-[#5eecaf]">
                    {skill.icon}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-[#1d1f27]">
            <button
              type="button"
              onClick={() => {
                playCyberSound('blip', soundEnabled);
                onLogout();
                onClose();
              }}
              className="px-4 py-2 bg-red-950/40 hover:bg-red-900/60 border border-red-500/50 text-red-300 text-xs font-bold uppercase tracking-wider rounded transition-colors"
            >
              Terminate Session (Logout)
            </button>

            <button
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-[#00c6ff] to-[#0072ff] hover:from-[#38d4ff] hover:to-[#1a82ff] text-black font-bold text-xs uppercase tracking-wider rounded transition-all shadow-[0_0_15px_rgba(0,198,255,0.4)]"
            >
              {isSaved ? '✓ DOSSIER UPDATED' : 'SAVE DOSSIER'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
