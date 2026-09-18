import React, { useState, useEffect } from 'react';
import { LeaderboardEntry, UserStats } from '../types';
import { fetchLeaderboard } from '../firebase/firestoreService';
import { playCyberSound } from '../utils/audio';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserStats: UserStats;
  soundEnabled: boolean;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  isOpen,
  onClose,
  currentUserStats,
  soundEnabled,
}) => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    fetchLeaderboard()
      .then((data) => {
        setEntries(data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn font-['Space_Mono',monospace]">
      <div className="relative w-full max-w-3xl bg-[#10131a] border border-[#00c6ff]/40 rounded-xl p-6 sm:p-8 shadow-[0_0_40px_rgba(0,198,255,0.2)] max-h-[85vh] flex flex-col">
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

        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#1d1f27]">
          <div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#00c6ff] text-2xl">leaderboard</span>
              <h2 className="text-xl sm:text-2xl font-bold font-['Space_Grotesk'] text-white">
                CYBER GRID // GLOBAL LEADERBOARD
              </h2>
            </div>
            <p className="text-xs text-[#bcc8d0] mt-1">
              Top neural operatives ranked by total acquired XP and cleared quests.
            </p>
          </div>
          <div className="hidden sm:block text-right">
            <span className="text-[10px] text-[#5eecaf] font-bold block">FIRESTORE SYNC: ACTIVE</span>
            <span className="text-[10px] text-[#86929a]">SEASON IV</span>
          </div>
        </div>

        {/* Scrollable Leaderboard Table */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {loading ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-8 h-8 border-2 border-[#00c6ff] border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-xs text-[#86929a]">Querying Cloud Firestore Operatives Matrix...</p>
            </div>
          ) : (
            entries.map((entry) => {
              const isCurrentUser = entry.username === currentUserStats.username;
              return (
                <div
                  key={entry.uid}
                  className={`p-3 sm:p-4 rounded-lg flex items-center justify-between border transition-all ${
                    isCurrentUser
                      ? 'bg-[#00c6ff]/10 border-[#00c6ff] shadow-[0_0_15px_rgba(0,198,255,0.2)]'
                      : 'bg-[#191b23] border-[#3d484f]/40 hover:border-[#3d484f]'
                  }`}
                >
                  {/* Rank & Avatar & Name */}
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-8 text-center">
                      {entry.rank === 1 && <span className="text-xl">👑</span>}
                      {entry.rank === 2 && <span className="text-xl">🥈</span>}
                      {entry.rank === 3 && <span className="text-xl">🥉</span>}
                      {entry.rank > 3 && (
                        <span className="text-sm font-bold text-[#86929a]">#{entry.rank}</span>
                      )}
                    </div>

                    <img
                      src={entry.avatar}
                      alt={entry.username}
                      className="w-10 h-10 rounded-lg object-cover border border-[#3d484f]"
                    />

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white font-['Space_Grotesk']">
                          {entry.username}
                        </span>
                        {isCurrentUser && (
                          <span className="px-1.5 py-0.5 rounded bg-[#00c6ff] text-black text-[9px] font-bold">
                            YOU
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-[#86929a]">
                        {entry.rankTitle} • {entry.tier}
                      </span>
                    </div>
                  </div>

                  {/* Level & XP Stats */}
                  <div className="flex items-center gap-4 sm:gap-8 text-right">
                    <div className="hidden sm:block">
                      <div className="text-xs text-[#bcc8d0]">{entry.clearedQuests} Quests</div>
                      <div className="text-[10px] text-[#5eecaf]">🔥 {entry.streakDays}d Streak</div>
                    </div>
                    <div>
                      <div className="text-sm font-bold text-[#00c6ff]">
                        {entry.currentXp.toLocaleString()} XP
                      </div>
                      <div className="text-[10px] text-[#ddb7ff] font-bold">
                        LVL {entry.level}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 mt-4 border-t border-[#1d1f27] flex justify-between items-center text-xs text-[#86929a]">
          <span>Your Rank: #{entries.findIndex(e => e.username === currentUserStats.username) + 1 || 'Top 10%'}</span>
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
