import React from 'react';
import { UserStats } from '../types';
import { ACHIEVEMENTS } from '../data/achievementsData';
import { playCyberSound } from '../utils/audio';

interface AchievementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: UserStats;
  soundEnabled: boolean;
}

export const AchievementsModal: React.FC<AchievementsModalProps> = ({
  isOpen,
  onClose,
  stats,
  soundEnabled,
}) => {
  if (!isOpen) return null;

  const unlockedIds = stats.unlockedAchievementIds || [];
  const completedCount = ACHIEVEMENTS.filter((a) => unlockedIds.includes(a.id)).length;
  const totalCount = ACHIEVEMENTS.length;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn font-['Space_Mono',monospace]">
      <div className="relative w-full max-w-3xl bg-[#10131a] border border-[#ddb7ff]/40 rounded-xl p-6 sm:p-8 shadow-[0_0_40px_rgba(221,183,255,0.2)] max-h-[85vh] flex flex-col">
        {/* Glow corner accents */}
        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#ddb7ff]"></div>
        <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#ddb7ff]"></div>
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#ddb7ff]"></div>
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#ddb7ff]"></div>

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

        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#1d1f27]">
          <div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#ddb7ff] text-2xl">military_tech</span>
              <h2 className="text-xl sm:text-2xl font-bold font-['Space_Grotesk'] text-white">
                GRID ACHIEVEMENTS // MEDAL DECK
              </h2>
            </div>
            <p className="text-xs text-[#bcc8d0] mt-1">
              Unlock milestones by completing quests, defeating raid bosses, and mastering code.
            </p>
          </div>
          <div className="text-right">
            <span className="text-sm font-bold text-[#ddb7ff] block">
              {completedCount} / {totalCount} UNLOCKED
            </span>
            <span className="text-[10px] text-[#86929a]">{progressPercent}% COMPLETED</span>
          </div>
        </div>

        {/* Overall Progress Bar */}
        <div className="w-full h-2 bg-[#0b0e15] rounded-full overflow-hidden border border-[#3d484f]/40 mb-6">
          <div
            className="h-full bg-gradient-to-r from-[#ddb7ff] to-[#00c6ff] rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(221,183,255,0.8)]"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>

        {/* Achievement Cards Grid */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-3 pr-1">
          {ACHIEVEMENTS.map((ach) => {
            const isUnlocked = unlockedIds.includes(ach.id);
            return (
              <div
                key={ach.id}
                className={`p-4 rounded-lg border transition-all flex items-start gap-3.5 ${
                  isUnlocked
                    ? 'bg-[#191b23] border-[#ddb7ff]/50 shadow-[0_0_12px_rgba(221,183,255,0.15)]'
                    : 'bg-[#10131a]/60 border-[#3d484f]/30 opacity-60'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border ${
                    isUnlocked
                      ? 'bg-[#ddb7ff]/20 border-[#ddb7ff] text-[#ddb7ff]'
                      : 'bg-[#1d1f27] border-[#3d484f] text-[#86929a]'
                  }`}
                >
                  <span className="material-symbols-outlined text-xl">{ach.icon}</span>
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white font-['Space_Grotesk']">
                      {ach.title}
                    </h4>
                    <span className="text-[10px] text-[#00c6ff] font-bold">
                      +{ach.xpReward} XP
                    </span>
                  </div>
                  <p className="text-xs text-[#86929a] mt-1">{ach.description}</p>
                  <div className="mt-2 flex items-center gap-2">
                    {isUnlocked ? (
                      <span className="text-[10px] font-bold text-[#5eecaf] flex items-center gap-1">
                        <span>✓</span> UNLOCKED
                      </span>
                    ) : (
                      <span className="text-[10px] text-[#86929a] flex items-center gap-1">
                        <span>🔒</span> LOCKED
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-4 mt-4 border-t border-[#1d1f27] flex justify-end">
          <button
            onClick={() => {
              playCyberSound('blip', soundEnabled);
              onClose();
            }}
            className="px-4 py-1.5 bg-[#272a32] hover:bg-[#3d484f] text-white rounded text-xs transition-colors"
          >
            DISMISS HUD
          </button>
        </div>
      </div>
    </div>
  );
};
