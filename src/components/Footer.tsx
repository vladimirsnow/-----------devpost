import React from 'react';
import { ScreenMode } from '../types';

interface FooterProps {
  onNavigate: (screen: ScreenMode) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="w-full bg-[#0b0e15] border-t border-[#3d484f]/25 py-8 px-4 lg:px-12 text-[#86929a] font-['Space_Mono',monospace] text-xs">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center space-x-3">
          <div className="w-7 h-7 flex items-center justify-center bg-[#1d1f27] border border-[#00c6ff]/30 rounded text-[#00c6ff] font-bold">
            &lt;/&gt;
          </div>
          <div>
            <span className="font-bold text-[#e1e2ec] tracking-wider block">
              DEVQUEST SYSTEMS // 2025
            </span>
            <span className="text-[10px] text-[#86929a]">v4.2.0-STABLE CYBERNETIC OS</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 text-[11px] font-bold">
          <button
            onClick={() => onNavigate('campaign')}
            className="hover:text-[#00c6ff] transition-colors"
          >
            QUEST_INDEX
          </button>
          <button
            onClick={() => onNavigate('boss-raid')}
            className="hover:text-[#ffb4ab] transition-colors"
          >
            BOSS_VAULT
          </button>
          <button
            onClick={() => onNavigate('quest-map')}
            className="hover:text-[#00c6ff] transition-colors"
          >
            WORLD_TREES
          </button>
          <button
            onClick={() => onNavigate('challenges')}
            className="hover:text-[#5eecaf] transition-colors"
          >
            SIMULATION_STUDIO
          </button>
        </div>

        <div className="flex items-center space-x-2 text-[11px] text-[#bcc8d0]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#5eecaf] animate-pulse"></span>
          <span>RUNNING ON WEBGL / NODE PROTOCOL</span>
        </div>
      </div>
    </footer>
  );
};
