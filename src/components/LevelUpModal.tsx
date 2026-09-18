import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { playCyberSound } from '../utils/audio';

interface LevelUpModalProps {
  isOpen: boolean;
  level: number;
  rankTitle: string;
  onClose: () => void;
  soundEnabled: boolean;
}

export const LevelUpModal: React.FC<LevelUpModalProps> = ({
  isOpen,
  level,
  rankTitle,
  onClose,
  soundEnabled,
}) => {
  useEffect(() => {
    if (isOpen) {
      playCyberSound('victory', soundEnabled);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00c6ff', '#ddb7ff', '#5eecaf', '#ffffff'],
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn font-['Space_Mono',monospace]">
      <div className="relative w-full max-w-md bg-[#10131a] border-2 border-[#00c6ff] rounded-2xl p-8 text-center shadow-[0_0_50px_rgba(0,198,255,0.4)] animate-bounce-short">
        {/* Neon Crown Badge */}
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-tr from-[#00c6ff]/30 to-[#ddb7ff]/30 border-2 border-[#00c6ff] flex items-center justify-center shadow-[0_0_25px_rgba(0,198,255,0.6)]">
          <span className="material-symbols-outlined text-4xl text-[#00c6ff]">bolt</span>
        </div>

        <div className="inline-block px-3 py-1 rounded bg-[#272a32] text-[#5eecaf] text-xs font-bold uppercase tracking-widest mb-2">
          ★ LEVEL ASCENSION ★
        </div>

        <h2 className="text-3xl sm:text-4xl font-black font-['Space_Grotesk'] text-white tracking-wider">
          LEVEL {level} REACHED!
        </h2>

        <p className="text-sm text-[#00c6ff] font-bold mt-1 uppercase tracking-wide">
          NEW RANK: {rankTitle}
        </p>

        <p className="text-xs text-[#bcc8d0] mt-3 max-w-xs mx-auto">
          Your neural capacity has amplified. Additional sandbox quotas and higher difficulty sectors have been unlocked!
        </p>

        <div className="mt-6">
          <button
            onClick={() => {
              playCyberSound('surge', soundEnabled);
              onClose();
            }}
            className="w-full py-3 px-6 bg-gradient-to-r from-[#00c6ff] via-[#38d4ff] to-[#0072ff] hover:from-[#38d4ff] hover:to-[#1a82ff] text-black font-black text-xs uppercase tracking-widest rounded-lg shadow-[0_0_25px_rgba(0,198,255,0.6)] transition-transform hover:scale-105"
          >
            CLAIM ASCENSION REWARD
          </button>
        </div>
      </div>
    </div>
  );
};
