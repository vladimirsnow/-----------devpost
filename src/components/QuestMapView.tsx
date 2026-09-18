import React, { useState } from 'react';
import { ScreenMode, UserStats } from '../types';
import { QUESTS } from '../data/questsData';
import { playCyberSound } from '../utils/audio';

interface QuestMapViewProps {
  onNavigate: (screen: ScreenMode) => void;
  stats: UserStats;
  onSelectQuest?: (questId: string) => void;
}

export const QuestMapView: React.FC<QuestMapViewProps> = ({
  onNavigate,
  stats,
  onSelectQuest,
}) => {
  const completedIds = stats.completedQuestIds || [];

  const sectors = [
    {
      id: 'sec-js-intro',
      title: 'SECTOR 01: NEURAL LINK & JS CORE',
      sectorCode: 'JS_FUNDAMENTALS',
      description: 'Master variables, data types, console streams, and arrow functions.',
      questIds: ['q1', 'q2', 'q3', 'q4'],
      icon: 'javascript',
      color: '#00c6ff',
    },
    {
      id: 'sec-css',
      title: 'SECTOR 02: NEON CSS MATRIX',
      sectorCode: 'CSS_FLEX_GRID',
      description: 'Construct glowing cyberpunk HUD interfaces, flex layouts, and responsive breakpoints.',
      questIds: ['q5'],
      icon: 'css',
      color: '#ddb7ff',
    },
    {
      id: 'sec-dom',
      title: 'SECTOR 03: DOM SPELLCASTING',
      sectorCode: 'VIRTUAL_DOM_NODES',
      description: 'QuerySelector arcana, dynamic event listener spells, and regex validation filters.',
      questIds: ['q6', 'q7', 'q8'],
      icon: 'account_tree',
      color: '#5eecaf',
    },
    {
      id: 'sec-api-storage',
      title: 'SECTOR 04: SATELLITE ASYNC & STORAGE',
      sectorCode: 'ASYNC_APIS_PERSISTENCE',
      description: 'Asynchronous fetch pipelines, promise resolutions, and encrypted LocalStorage buffers.',
      questIds: ['q9', 'q10'],
      icon: 'cloud_sync',
      color: '#ffc107',
    },
    {
      id: 'sec-boss',
      title: 'SECTOR 05: THE CORRUPTED KERNEL (BOSS ARENA)',
      sectorCode: 'RAID_COLOSSUS',
      description: 'Face the Malware Titan, CSS Glitch Fiend, and Null Pointer Dragon in live code debugging battles.',
      isBoss: true,
      icon: 'swords',
      color: '#ef4444',
    },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 font-['Space_Mono',monospace]">
      {/* HEADER BANNER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-[#191b23] to-[#10131a] border border-[#00c6ff]/30 shadow-2xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#5eecaf] animate-pulse"></span>
            <span className="text-xs font-bold text-[#5eecaf] uppercase tracking-wider">
              CYBERNETIC WORLD GRID // SECTOR MAP
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-['Space_Grotesk'] text-white">
            EXPLORE THE QUEST ARCHIPELAGO
          </h1>
          <p className="text-xs text-[#bcc8d0] max-w-2xl">
            Progress through each discipline sector sequentially to unlock advanced web development skills, earn XP, and gain entry to the Final Boss Raids.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="p-3 rounded-lg bg-[#0b0e15] border border-[#3d484f]/40 text-center">
            <span className="text-xs text-[#86929a] block">TOTAL PROGRESS</span>
            <span className="text-lg font-bold text-[#00c6ff]">
              {completedIds.length} / 10 Quests
            </span>
          </div>
        </div>
      </div>

      {/* SECTOR PROGRESSION PATHWAY */}
      <div className="space-y-8 relative">
        {sectors.map((sector, sIdx) => (
          <div
            key={sector.id}
            className="p-6 rounded-2xl bg-[#10131a] border border-[#3d484f]/40 space-y-4 relative overflow-hidden shadow-xl"
          >
            {/* Top Sector Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#1d1f27]">
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm"
                  style={{ background: `${sector.color}20`, color: sector.color, border: `1px solid ${sector.color}50` }}
                >
                  <span className="material-symbols-outlined text-base">{sector.icon}</span>
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold font-['Space_Grotesk'] text-white">
                    {sector.title}
                  </h3>
                  <p className="text-xs text-[#86929a]">{sector.description}</p>
                </div>
              </div>

              <span className="text-[11px] font-bold text-[#bcc8d0] px-2.5 py-1 rounded bg-[#191b23] border border-[#3d484f]/40 self-start sm:self-auto">
                {sector.sectorCode}
              </span>
            </div>

            {/* Sector Quests Grid or Boss Banner */}
            {sector.isBoss ? (
              <div className="p-6 rounded-xl bg-gradient-to-r from-red-950/40 via-[#191b23] to-[#10131a] border border-red-500/40 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-center sm:text-left">
                  <span className="text-[10px] text-red-400 font-bold uppercase tracking-wider block">
                    ★ PINNACLE BOSS ENCOUNTERS ★
                  </span>
                  <h4 className="text-lg font-bold text-white font-['Space_Grotesk']">
                    The Corrupted Kernel: 3 Multi-Discipline Boss Fights
                  </h4>
                  <p className="text-xs text-[#bcc8d0]">
                    Defeat Malware Titan, CSS Glitch Fiend, and Null Pointer Dragon. Earn +500 XP each.
                  </p>
                </div>
                <button
                  onClick={() => {
                    playCyberSound('laser', stats.soundEnabled);
                    onNavigate('boss-raid');
                  }}
                  className="px-6 py-2.5 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-all shadow-[0_0_15px_rgba(239,68,68,0.5)] shrink-0"
                >
                  ENTER BOSS RAID ARENA ➔
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {sector.questIds?.map((qId) => {
                  const quest = QUESTS.find((q) => q.id === qId);
                  if (!quest) return null;
                  const isCompleted = completedIds.includes(quest.id);
                  const isUnlocked = true; // All 10 accessible or sequential

                  return (
                    <div
                      key={quest.id}
                      className={`p-4 rounded-xl border flex flex-col justify-between space-y-3 transition-all ${
                        isCompleted
                          ? 'bg-[#191b23] border-[#5eecaf]/40 shadow-[0_0_10px_rgba(94,236,175,0.1)]'
                          : 'bg-[#191b23]/70 border-[#3d484f]/40 hover:border-[#00c6ff]/60'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="px-2 py-0.5 rounded bg-[#0b0e15] text-[#00c6ff] font-bold">
                            {quest.difficulty}
                          </span>
                          <span className="text-[#ddb7ff] font-bold">+{quest.xpReward} XP</span>
                        </div>
                        <h4 className="text-xs font-bold text-white font-['Space_Grotesk']">
                          {quest.title}
                        </h4>
                        <p className="text-[11px] text-[#86929a] line-clamp-2">
                          {quest.description}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-[#1d1f27] flex items-center justify-between">
                        <span className="text-[10px] font-bold">
                          {isCompleted ? (
                            <span className="text-[#5eecaf] flex items-center gap-1">
                              <span>✓</span> MASTERED
                            </span>
                          ) : (
                            <span className="text-[#00c6ff]">AVAILABLE</span>
                          )}
                        </span>
                        <button
                          onClick={() => {
                            playCyberSound('blip', stats.soundEnabled);
                            if (onSelectQuest) onSelectQuest(quest.id);
                            onNavigate('challenges');
                          }}
                          className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded transition-all ${
                            isCompleted
                              ? 'bg-[#272a32] text-white hover:bg-[#3d484f]'
                              : 'bg-[#00c6ff] text-black hover:bg-[#38d4ff] shadow-[0_0_10px_rgba(0,198,255,0.4)]'
                          }`}
                        >
                          {isCompleted ? 'REPLAY' : 'LAUNCH ➔'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
