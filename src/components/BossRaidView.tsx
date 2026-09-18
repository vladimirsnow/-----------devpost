import React, { useState, useEffect } from 'react';
import { ScreenMode, UserStats, BossChallenge } from '../types';
import { BOSS_CHALLENGES } from '../data/bossesData';
import { playCyberSound } from '../utils/audio';

interface BossRaidViewProps {
  onNavigate: (screen: ScreenMode) => void;
  stats: UserStats;
  onUpdateStats: (newStats: Partial<UserStats>) => void;
}

export const BossRaidView: React.FC<BossRaidViewProps> = ({
  onNavigate,
  stats,
  onUpdateStats,
}) => {
  const [selectedBossId, setSelectedBossId] = useState<string>('boss-html');
  const activeBoss: BossChallenge =
    BOSS_CHALLENGES.find((b) => b.id === selectedBossId) || BOSS_CHALLENGES[0];

  const [bossHp, setBossHp] = useState<number>(activeBoss.hp);
  const [manaBuffer, setManaBuffer] = useState<number>(stats.mana || 240);
  const [shieldIntegrity, setShieldIntegrity] = useState<number>(100);
  const [countdownSeconds, setCountdownSeconds] = useState<number>(525);
  const [activeDiagnosticIndex, setActiveDiagnosticIndex] = useState<number>(0);
  const [isBossDefeated, setIsBossDefeated] = useState<boolean>(false);
  const [patchCode, setPatchCode] = useState<string>(activeBoss.starterCode);
  const [passedCriteriaIds, setPassedCriteriaIds] = useState<string[]>([]);
  const [combatLogs, setCombatLogs] = useState<string[]>([
    `[INIT] Emergency response engaged in ${activeBoss.sector}.`,
    `[BOSS_DETECTED] ${activeBoss.name} spawned with ${activeBoss.maxHp.toLocaleString()} HP.`,
    '[ALERT] Corrupted code injection destabilizing the sector runtime.',
  ]);

  // Sync state whenever activeBoss changes
  useEffect(() => {
    setBossHp(activeBoss.hp);
    setPatchCode(activeBoss.starterCode);
    setPassedCriteriaIds([]);
    setIsBossDefeated(stats.defeatedBossIds?.includes(activeBoss.id) || false);
    setActiveDiagnosticIndex(0);
    setCombatLogs([
      `[ENGAGE] Locked target on ${activeBoss.name} (${activeBoss.codename}).`,
      `[DIFFICULTY] ${activeBoss.difficulty} // REWARD: +${activeBoss.rewardXp} XP, Title: "${activeBoss.rewardTitle}"`,
    ]);
  }, [activeBoss.id]);

  // Boss battle countdown
  useEffect(() => {
    if (isBossDefeated) return;
    const interval = setInterval(() => {
      setCountdownSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isBossDefeated]);

  const formatCountdown = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleCastHotfix = () => {
    playCyberSound('laser', stats.soundEnabled);
    const result = activeBoss.validatePatch(patchCode);

    setPassedCriteriaIds(result.passedCriteria);
    const remainingHp = Math.max(0, activeBoss.maxHp - result.damage);
    setBossHp(remainingHp);

    setCombatLogs((prev) => [
      ...prev,
      result.log,
      `[TELEMETRY] Boss HP: ${remainingHp.toLocaleString()} / ${activeBoss.maxHp.toLocaleString()}`,
    ]);

    if (result.success || remainingHp <= 0) {
      handleBossDefeat();
    }
  };

  const handleBossDefeat = () => {
    playCyberSound('victory', stats.soundEnabled);
    setIsBossDefeated(true);
    setBossHp(0);

    const alreadyDefeated = stats.defeatedBossIds?.includes(activeBoss.id);
    if (!alreadyDefeated) {
      const nextDefeated = [...(stats.defeatedBossIds || []), activeBoss.id];
      const nextXp = stats.currentXp + activeBoss.rewardXp;

      onUpdateStats({
        defeatedBossIds: nextDefeated,
        currentXp: nextXp,
        rankTitle: activeBoss.rewardTitle,
      });

      setCombatLogs((prev) => [
        ...prev,
        `[VICTORY] ${activeBoss.name} neutralized!`,
        `[REWARDS] Claimed +${activeBoss.rewardXp} XP and Title "${activeBoss.rewardTitle}"!`,
      ]);
    }
  };

  const handleSummonShield = () => {
    if (manaBuffer < 30) {
      playCyberSound('error', stats.soundEnabled);
      setCombatLogs((prev) => [...prev, '[WARNING] Insufficient Mana Buffer for Shield!']);
      return;
    }
    playCyberSound('surge', stats.soundEnabled);
    setManaBuffer((prev) => prev - 30);
    setShieldIntegrity(100);
    setCombatLogs((prev) => [
      ...prev,
      '[DEFENSE] Mentor Firewall Shield engaged (-30 MP). Shield restored to 100%.',
    ]);
  };

  const handleAstDump = () => {
    playCyberSound('blip', stats.soundEnabled);
    const activeDiag = activeBoss.glitchDiagnostics[activeDiagnosticIndex];
    setCombatLogs((prev) => [
      ...prev,
      `[AST_SCAN] Analyzing: ${activeDiag?.title || 'Syntax Tree'}`,
      ...(activeDiag?.astFindings.map((f) => `  > ${f}`) || []),
    ]);
  };

  const hpPercent = Math.round((bossHp / activeBoss.maxHp) * 100);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 font-['Space_Mono',monospace]">
      {/* BOSS SELECTOR TABS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-[#10131a] border border-red-500/30 shadow-2xl">
        <div className="flex items-center gap-3 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs uppercase text-red-400 font-bold shrink-0">SELECT RAID BOSS:</span>
          {BOSS_CHALLENGES.map((boss) => {
            const isSelected = boss.id === activeBoss.id;
            const isBeaten = stats.defeatedBossIds?.includes(boss.id);
            return (
              <button
                key={boss.id}
                onClick={() => {
                  playCyberSound('blip', stats.soundEnabled);
                  setSelectedBossId(boss.id);
                }}
                className={`px-3 py-1.5 text-xs rounded font-bold shrink-0 transition-all ${
                  isSelected
                    ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(239,68,68,0.6)]'
                    : isBeaten
                    ? 'bg-[#191b23] text-[#5eecaf] border border-[#5eecaf]/40'
                    : 'bg-[#191b23] text-[#bcc8d0] hover:text-white border border-[#3d484f]/40'
                }`}
              >
                {boss.name} {isBeaten ? '✓' : '⚡'}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <span className="px-2.5 py-1 bg-[#191b23] text-red-400 text-xs rounded font-bold border border-red-500/40">
            TIME LEFT: {formatCountdown(countdownSeconds)}
          </span>
          <span className="px-2.5 py-1 bg-[#191b23] text-[#00c6ff] text-xs rounded font-bold border border-[#00c6ff]/40">
            REWARD: +{activeBoss.rewardXp} XP
          </span>
        </div>
      </div>

      {/* BOSS COMBAT HUD BANNER */}
      <div className="relative rounded-2xl bg-gradient-to-r from-red-950/40 via-[#191b23] to-[#10131a] border-2 border-red-500/40 p-6 sm:p-8 overflow-hidden shadow-2xl">
        <div className="relative z-10 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded bg-red-950/80 text-red-400 text-[10px] font-bold border border-red-500/50">
                  {activeBoss.sector}
                </span>
                <span className="text-[10px] text-[#86929a]">CODENAME: {activeBoss.codename}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black font-['Space_Grotesk'] text-white mt-1">
                {activeBoss.name}
              </h1>
            </div>

            <div className="text-right">
              <span className="text-xl sm:text-2xl font-black text-red-400">
                {bossHp.toLocaleString()} / {activeBoss.maxHp.toLocaleString()} HP
              </span>
              <span className="text-xs text-[#86929a] block">INTEGRITY: {hpPercent}%</span>
            </div>
          </div>

          {/* Boss HP Bar */}
          <div className="w-full h-4 bg-[#0b0e15] rounded-full overflow-hidden border border-red-500/50 p-0.5">
            <div
              className="h-full bg-gradient-to-r from-red-600 via-orange-500 to-yellow-400 rounded-full transition-all duration-500 shadow-[0_0_15px_rgba(239,68,68,0.8)]"
              style={{ width: `${hpPercent}%` }}
            ></div>
          </div>

          <p className="text-xs text-[#bcc8d0] max-w-3xl leading-relaxed">
            {activeBoss.description}
          </p>
        </div>
      </div>

      {/* 2-COLUMN ARENA: DIAGNOSTICS & LOGS | HOTFIX CODE INJECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: GLITCH DIAGNOSTICS & CRITERIA (5 COLS) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Glitch Diagnostic Tabs */}
          <div className="p-4 rounded-xl bg-[#10131a] border border-[#3d484f]/40 space-y-3 shadow-lg">
            <div className="flex items-center justify-between border-b border-[#1d1f27] pb-2">
              <span className="text-xs font-bold text-white flex items-center gap-1.5 font-['Space_Grotesk']">
                <span className="material-symbols-outlined text-[#00c6ff] text-base">troubleshoot</span>
                GLITCH DIAGNOSTICS
              </span>
              <span className="text-[10px] text-[#86929a]">AST SCANNER</span>
            </div>

            <div className="flex gap-2">
              {activeBoss.glitchDiagnostics.map((diag, i) => (
                <button
                  key={i}
                  onClick={() => {
                    playCyberSound('blip', stats.soundEnabled);
                    setActiveDiagnosticIndex(i);
                  }}
                  className={`px-2.5 py-1 text-xs rounded font-bold transition-all ${
                    activeDiagnosticIndex === i
                      ? 'bg-[#191b23] text-[#00c6ff] border border-[#00c6ff]/40'
                      : 'text-[#86929a] hover:text-white'
                  }`}
                >
                  {diag.tab.toUpperCase()}
                </button>
              ))}
            </div>

            <div className="p-3 rounded bg-[#191b23] border border-[#3d484f]/30 space-y-2">
              <h4 className="text-xs font-bold text-[#96dcff]">
                {activeBoss.glitchDiagnostics[activeDiagnosticIndex]?.title}
              </h4>
              <p className="text-xs text-[#bcc8d0]">
                {activeBoss.glitchDiagnostics[activeDiagnosticIndex]?.description}
              </p>
              <ul className="text-[11px] text-red-300 space-y-1 list-disc list-inside">
                {activeBoss.glitchDiagnostics[activeDiagnosticIndex]?.astFindings.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Validation Criteria */}
          <div className="p-4 rounded-xl bg-[#10131a] border border-[#3d484f]/40 space-y-3 shadow-lg">
            <h4 className="text-xs font-bold text-white font-['Space_Grotesk'] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#5eecaf] text-base">verified</span>
              HOTFIX OBJECTIVES
            </h4>
            <div className="space-y-2">
              {activeBoss.validationCriteria.map((c) => {
                const passed = passedCriteriaIds.includes(c.id);
                return (
                  <div
                    key={c.id}
                    className={`p-2 rounded text-xs border flex items-center gap-2 ${
                      passed
                        ? 'bg-emerald-950/40 border-[#5eecaf]/50 text-[#5eecaf]'
                        : 'bg-[#191b23] border-[#3d484f]/40 text-[#bcc8d0]'
                    }`}
                  >
                    <span>{passed ? '✓' : '○'}</span>
                    <span className="text-[11px]">{c.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Combat Log Stream */}
          <div className="p-4 rounded-xl bg-[#10131a] border border-[#3d484f]/40 space-y-2 shadow-lg">
            <span className="text-xs font-bold text-white block">COMBAT EVENT LOGS</span>
            <div className="h-36 overflow-y-auto space-y-1 text-xs font-['Space_Mono'] pr-1">
              {combatLogs.map((log, i) => (
                <div
                  key={i}
                  className={`${
                    log.includes('[CRITICAL') || log.includes('[VICTORY]')
                      ? 'text-[#5eecaf] font-bold'
                      : log.includes('[ALERT') || log.includes('[WARNING')
                      ? 'text-red-400'
                      : 'text-[#bcc8d0]'
                  }`}
                >
                  {log}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: HOTFIX CODE EDITOR & ACTIONS (7 COLS) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-xl bg-[#10131a] border border-red-500/30 overflow-hidden shadow-xl flex flex-col">
            <div className="px-4 py-2 bg-[#0b0e15] border-b border-[#1d1f27] flex items-center justify-between">
              <span className="text-xs font-bold text-red-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                EMERGENCY_PATCH_BUFFER
              </span>
              <button
                onClick={() => {
                  playCyberSound('blip', stats.soundEnabled);
                  setPatchCode(activeBoss.starterCode);
                  setCombatLogs((p) => [...p, '[RESET] Restored original corrupted code buffer.']);
                }}
                className="text-[11px] text-[#86929a] hover:text-white"
              >
                Reset Patch
              </button>
            </div>

            <div className="p-4 bg-[#0b0e15]">
              <textarea
                value={patchCode}
                onChange={(e) => setPatchCode(e.target.value)}
                spellCheck={false}
                rows={14}
                className="w-full bg-transparent text-emerald-300 font-['Space_Mono',monospace] text-xs sm:text-sm leading-relaxed resize-y focus:outline-none selection:bg-red-500/30 selection:text-white border-0"
              />
            </div>

            {/* Combat Spell Action Buttons */}
            <div className="p-4 bg-[#0b0e15] border-t border-[#1d1f27] grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <button
                onClick={handleCastHotfix}
                className="py-2.5 px-3 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-bold text-xs uppercase tracking-wider rounded transition-all shadow-[0_0_15px_rgba(239,68,68,0.5)]"
              >
                ⚡ CAST HOTFIX STRIKE
              </button>

              <button
                onClick={handleSummonShield}
                className="py-2.5 px-3 bg-[#191b23] hover:bg-[#272a32] border border-[#00c6ff]/40 text-[#00c6ff] font-bold text-xs uppercase tracking-wider rounded transition-all"
              >
                🛡 FIREWALL (-30 MP)
              </button>

              <button
                onClick={handleAstDump}
                className="py-2.5 px-3 bg-[#191b23] hover:bg-[#272a32] border border-[#ddb7ff]/40 text-[#ddb7ff] font-bold text-xs uppercase tracking-wider rounded transition-all"
              >
                🔍 SCAN AST
              </button>
            </div>
          </div>

          {/* Victory Modal State */}
          {isBossDefeated && (
            <div className="p-6 rounded-xl bg-gradient-to-r from-emerald-950/80 to-[#10131a] border-2 border-[#5eecaf] shadow-[0_0_30px_rgba(94,236,175,0.4)] text-center space-y-3">
              <span className="text-3xl">🏆</span>
              <h3 className="text-2xl font-black font-['Space_Grotesk'] text-[#5eecaf]">
                RAID BOSS PURGED SUCCESSFULLY!
              </h3>
              <p className="text-xs text-[#bcc8d0] max-w-md mx-auto">
                Corrupted code neutralized. +{activeBoss.rewardXp} XP added to your neural profile. You earned the title "{activeBoss.rewardTitle}".
              </p>
              <button
                onClick={() => {
                  playCyberSound('blip', stats.soundEnabled);
                  onNavigate('quest-map');
                }}
                className="px-6 py-2.5 bg-[#5eecaf] hover:bg-white text-black font-bold text-xs uppercase tracking-wider rounded-lg transition-colors"
              >
                RETURN TO QUEST MAP
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
