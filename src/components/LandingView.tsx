import React, { useState } from 'react';
import { ScreenMode } from '../types';
import { playCyberSound } from '../utils/audio';

interface LandingViewProps {
  onNavigate: (screen: ScreenMode) => void;
  soundEnabled: boolean;
}

export const LandingView: React.FC<LandingViewProps> = ({ onNavigate, soundEnabled }) => {
  const [selectedClass, setSelectedClass] = useState<'frontend' | 'backend' | 'cyberpaladin'>('frontend');
  const [bossHp, setBossHp] = useState(3820);
  const [raidTestsPassing, setRaidTestsPassing] = useState(false);
  const [activeCodeTab, setActiveCodeTab] = useState<'raidHandler' | 'targetSystem'>('raidHandler');

  const handleQuickHack = (hackType: string, damage: number) => {
    playCyberSound('laser', soundEnabled);
    setBossHp((prev) => Math.max(0, prev - damage));
  };

  const handleRunRaidTests = () => {
    playCyberSound('blip', soundEnabled);
    setRaidTestsPassing(true);
    setTimeout(() => {
      setBossHp((prev) => Math.max(0, prev - 450));
      playCyberSound('victory', soundEnabled);
    }, 400);
  };

  return (
    <div className="flex flex-col w-full text-[#e1e2ec] font-['Space_Mono',monospace]">
      {/* HERO SECTION */}
      <section className="relative w-full px-6 lg:px-12 py-16 lg:py-24 bg-[#10131a] flex flex-col items-center justify-center overflow-hidden">
        {/* Ambient Sci-Fi Backglows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-[#00c6ff]/10 via-[#6f00be]/15 to-transparent blur-[120px] pointer-events-none"></div>

        <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center">
          {/* Terminal Protocol Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#272a32] rounded text-[10px] text-[#96dcff] mb-8 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00c6ff] animate-ping"></span>
            <span>// TRANSMISSION RECEIVED: OPERATIVE ENROLLMENT OPEN</span>
            <span className="text-[#3d484f]">|</span>
            <span className="text-[#ddb7ff] font-bold">12,840 CODER HEROES ACTIVE</span>
          </div>

          {/* Main Headline */}
          <h1 className="font-['Space_Grotesk'] text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white mb-6 uppercase leading-tight">
            Turn coding into an{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00c6ff] via-[#96dcff] to-[#ddb7ff]">
              adventure.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-[#bcc8d0] max-w-3xl mb-10 leading-relaxed">
            Master modern software engineering through interactive tactical quests, distributed
            systems bug raids, and epic multi-tier boss battles. Build production muscle memory, not
            just tutorials.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-14">
            <button
              onClick={() => {
                playCyberSound('surge', soundEnabled);
                onNavigate('dashboard');
              }}
              className="group px-8 py-4 bg-[#00c6ff] hover:bg-[#6dd2ff] text-[#003547] text-xs font-bold uppercase tracking-wider rounded shadow-[0_0_24px_rgba(0,198,255,0.5)] transition-all flex items-center gap-3 cursor-pointer"
            >
              <span>Start Your Journey</span>
              <span className="px-2 py-0.5 bg-[#0b0e15]/40 text-[#003547] rounded text-[10px] font-mono group-hover:bg-[#0b0e15]/60">
                ↵ ENTER
              </span>
            </button>

            <button
              onClick={() => {
                playCyberSound('click', soundEnabled);
                onNavigate('challenges');
              }}
              className="px-8 py-4 bg-[#272a32] hover:bg-[#363941] text-[#e1e2ec] text-xs font-bold uppercase tracking-wider rounded transition-all flex items-center gap-2 shadow-sm cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px] text-[#00c6ff]">
                play_arrow
              </span>
              <span>Explore Live Demo</span>
            </button>
          </div>

          {/* Tech Stack Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 max-w-2xl">
            <span className="px-2.5 py-1 bg-[#191b23] border border-[#3d484f]/40 text-[#86929a] text-[10px] rounded">
              HTML5 SEMANTICS
            </span>
            <span className="px-2.5 py-1 bg-[#191b23] border border-[#3d484f]/40 text-[#86929a] text-[10px] rounded">
              CSS GRID &amp; FLEXBOX
            </span>
            <span className="px-2.5 py-1 bg-[#191b23] border border-[#3d484f]/40 text-[#86929a] text-[10px] rounded">
              MODERN ES6+
            </span>
            <span className="px-2.5 py-1 bg-[#191b23] border border-[#3d484f]/40 text-[#86929a] text-[10px] rounded">
              ASYNC WEB APIS
            </span>
            <span className="px-2.5 py-1 bg-[#191b23] border border-[#ddb7ff]/30 text-[#ddb7ff] text-[10px] rounded">
              REACT 19 ARCHITECTURE
            </span>
            <span className="px-2.5 py-1 bg-[#191b23] border border-[#5eecaf]/30 text-[#5eecaf] text-[10px] rounded">
              REALTIME FIREBASE ENGINES
            </span>
          </div>
        </div>
      </section>

      {/* LIVE GAME HUD / INTERACTIVE MISSION SHOWCASE */}
      <section className="w-full px-4 lg:px-12 py-10 bg-[#0b0e15]">
        <div className="max-w-7xl mx-auto">
          {/* HUD Header Panel */}
          <div className="bg-[#1d1f27] px-6 py-3 rounded-t-lg flex flex-wrap items-center justify-between gap-4 border-b border-[#3d484f]/30">
            <div className="flex items-center space-x-3">
              <span className="w-3 h-3 rounded-full bg-[#ffb4ab]"></span>
              <span className="w-3 h-3 rounded-full bg-[#3acf95]"></span>
              <span className="w-3 h-3 rounded-full bg-[#00c6ff]"></span>
              <span className="text-[10px] text-[#bcc8d0] ml-2 font-mono">
                // LIVE_SIMULATION_CHAMBER: SECTOR_07
              </span>
            </div>
            <div className="flex items-center space-x-4 text-[10px]">
              <span className="text-[#5eecaf] flex items-center gap-1 font-bold">
                <span className="material-symbols-outlined text-[14px]">shield</span> SHIELD: 100%
              </span>
              <span className="text-[#ddb7ff] flex items-center gap-1 font-bold">
                <span className="material-symbols-outlined text-[14px]">auto_awesome</span> MANA (XP):
                2,450
              </span>
              <span className="text-[#00c6ff] flex items-center gap-1 font-bold">
                <span className="material-symbols-outlined text-[14px]">memory</span> TICK: 60FPS
              </span>
            </div>
          </div>

          {/* Triple-Pane Cockpit Matrix */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-px bg-[#272a32] rounded-b-lg overflow-hidden shadow-2xl border border-[#3d484f]/30">
            {/* PANE 1: QUEST MAP & CAMPAIGN PATH (4 cols) */}
            <div className="lg:col-span-4 bg-[#191b23] p-6 flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] text-[#86929a] uppercase tracking-widest font-bold">
                    TACTICAL CAMPAIGN MAP
                  </span>
                  <span className="px-2 py-0.5 bg-[#00c6ff]/20 text-[#00c6ff] text-[10px] rounded font-bold">
                    ACT II
                  </span>
                </div>
                <h3 className="font-['Space_Grotesk'] text-base font-bold text-white mb-1">
                  The Async Underworld
                </h3>
                <p className="text-[11px] text-[#bcc8d0] mb-6">
                  Resolve promise deadlocks before the memory leak consumes the sector.
                </p>

                {/* Mission Path Nodes */}
                <div className="space-y-3 relative">
                  <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-[#363941] -z-0"></div>

                  {/* Node 1: Completed */}
                  <div className="relative z-10 flex items-start gap-3 p-2.5 rounded bg-[#1d1f27] border border-[#3d484f]/30">
                    <div className="w-8 h-8 rounded bg-[#3acf95]/20 text-[#5eecaf] flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[16px]">check</span>
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-white">01. Callback Purgatory</span>
                        <span className="text-[9px] text-[#5eecaf] font-mono font-bold">+150 XP</span>
                      </div>
                      <p className="text-[10px] text-[#bcc8d0] truncate">
                        Refactor pyramid of doom into chaining
                      </p>
                    </div>
                  </div>

                  {/* Node 2: Active / Current Focus */}
                  <div className="relative z-10 flex items-start gap-3 p-3 rounded bg-[#272a32] border border-[#00c6ff]/40 shadow-[0_0_12px_rgba(0,198,255,0.15)]">
                    <div className="w-8 h-8 rounded bg-[#00c6ff] text-[#003547] flex items-center justify-center shrink-0 font-bold font-mono text-xs shadow-[0_0_10px_rgba(0,198,255,0.6)]">
                      02
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-[#00c6ff]">
                          Promise.all Settled Raid
                        </span>
                        <span className="px-1.5 py-0.5 bg-[#6f00be] text-[#ddb7ff] text-[9px] font-bold rounded">
                          IN PROGRESS
                        </span>
                      </div>
                      <p className="text-[10px] text-white">
                        Coordinate 4 concurrent API fetches without crashing on 404.
                      </p>
                    </div>
                  </div>

                  {/* Node 3: Locked Boss */}
                  <div className="relative z-10 flex items-start gap-3 p-2.5 rounded bg-[#1d1f27] opacity-60">
                    <div className="w-8 h-8 rounded bg-[#363941] text-[#86929a] flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[16px]">lock</span>
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-[#86929a]">
                          03. BOSS: Memory Reaper
                        </span>
                        <span className="text-[9px] text-[#ffb4ab] font-mono">BOSS ENCOUNTER</span>
                      </div>
                      <p className="text-[10px] text-[#86929a] truncate">
                        Slay infinite loop detached DOM nodes.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress Card */}
              <div className="p-3 bg-[#1d1f27] rounded border border-[#3d484f]/25">
                <div className="flex justify-between items-center text-[10px] text-[#bcc8d0] mb-2 font-bold">
                  <span>ACTIVE OBJECTIVE PROGRESS</span>
                  <span className="text-[#5eecaf]">75% COMPLETE</span>
                </div>
                <div className="w-full bg-[#32353d] h-2 rounded overflow-hidden">
                  <div className="bg-[#5eecaf] h-full w-3/4 rounded shadow-[0_0_8px_rgba(94,236,175,0.8)]"></div>
                </div>
              </div>
            </div>

            {/* PANE 2: LIVE CYBER CODE IDE (5 cols) */}
            <div className="lg:col-span-5 bg-[#0b0e15] p-6 flex flex-col justify-between font-mono text-xs">
              <div>
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#1d1f27]">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setActiveCodeTab('raidHandler')}
                      className={`px-3 py-1 font-mono text-[11px] rounded transition-colors ${
                        activeCodeTab === 'raidHandler'
                          ? 'bg-[#1d1f27] text-[#00c6ff] font-bold border border-[#00c6ff]/30'
                          : 'text-[#86929a] hover:text-white'
                      }`}
                    >
                      raidHandler.js
                    </button>
                    <button
                      onClick={() => setActiveCodeTab('targetSystem')}
                      className={`px-3 py-1 font-mono text-[11px] rounded transition-colors ${
                        activeCodeTab === 'targetSystem'
                          ? 'bg-[#1d1f27] text-[#00c6ff] font-bold border border-[#00c6ff]/30'
                          : 'text-[#86929a] hover:text-white'
                      }`}
                    >
                      targetSystem.ts
                    </button>
                  </div>
                  <span className="text-[10px] text-[#86929a]">AUTOSAVE: ENGAGED</span>
                </div>

                {/* Code Buffer */}
                <div className="space-y-1 text-[12px] leading-relaxed">
                  {activeCodeTab === 'raidHandler' ? (
                    <>
                      <p className="text-[#86929a]">
                        <span className="text-[#3d484f] mr-2">01</span>{' '}
                        <span className="text-[#ddb7ff] font-bold">import</span> &#123; breachFirewall, patchKernel &#125;{' '}
                        <span className="text-[#ddb7ff] font-bold">from</span>{' '}
                        <span className="text-[#5eecaf]">&apos;@devquest/sentinel&apos;</span>;
                      </p>
                      <p className="text-[#3d484f]">02</p>
                      <p className="text-[#86929a]">
                        <span className="text-[#3d484f] mr-2">03</span> // RAID LEVEL 04: MITIGATE EVENT STREAM SPIKE
                      </p>
                      <p>
                        <span className="text-[#3d484f] mr-2">04</span>{' '}
                        <span className="text-[#ddb7ff] font-bold">async function</span>{' '}
                        <span className="text-[#00c6ff] font-bold">executePayloadDefense</span>(streams) &#123;
                      </p>
                      <p>
                        <span className="text-[#3d484f] mr-2">05</span>{' '}
                        <span className="text-[#ddb7ff] font-bold">const</span> results ={' '}
                        <span className="text-[#ddb7ff] font-bold">await</span> Promise.
                        <span className="text-[#00c6ff]">allSettled</span>(
                      </p>
                      <p className="pl-4">
                        <span className="text-[#3d484f] mr-2">06</span> streams.
                        <span className="text-[#00c6ff]">map</span>(stream =&gt;{' '}
                        <span className="text-[#00c6ff]">breachFirewall</span>(stream.endpoint))
                      </p>
                      <p>
                        <span className="text-[#3d484f] mr-2">07</span> );
                      </p>
                      <p className="text-[#3d484f]">08</p>
                      <p className="text-[#86929a]">
                        <span className="text-[#3d484f] mr-2">09</span> // CRITICAL: DETECT AND CLEANSE REJECTED SIGNALS
                      </p>
                      <p>
                        <span className="text-[#3d484f] mr-2">10</span>{' '}
                        <span className="text-[#ddb7ff] font-bold">return</span> results.
                        <span className="text-[#00c6ff]">reduce</span>((acc, res) =&gt; &#123;
                      </p>
                      <p className="pl-4">
                        <span className="text-[#3d484f] mr-2">11</span>{' '}
                        <span className="text-[#ddb7ff] font-bold">if</span> (res.status ==={' '}
                        <span className="text-[#5eecaf]">&apos;rejected&apos;</span>) &#123;
                      </p>
                      <p className="pl-8">
                        <span className="text-[#3d484f] mr-2">12</span>{' '}
                        <span className="text-[#ddb7ff] font-bold">return</span> acc +{' '}
                        <span className="text-[#00c6ff]">patchKernel</span>(res.reason);
                      </p>
                      <p className="pl-4">
                        <span className="text-[#3d484f] mr-2">13</span> &#125;
                      </p>
                      <p className="pl-4">
                        <span className="text-[#3d484f] mr-2">14</span>{' '}
                        <span className="text-[#ddb7ff] font-bold">return</span> acc + 1;
                      </p>
                      <p>
                        <span className="text-[#3d484f] mr-2">15</span> &#125;, 0);
                      </p>
                      <p>
                        <span className="text-[#3d484f] mr-2">16</span> &#125;
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-[#86929a]">
                        <span className="text-[#3d484f] mr-2">01</span>{' '}
                        <span className="text-[#ddb7ff] font-bold">interface</span>{' '}
                        <span className="text-[#00c6ff]">SentinelTarget</span> &#123;
                      </p>
                      <p className="pl-4">
                        <span className="text-[#3d484f] mr-2">02</span> endpoint: string;
                      </p>
                      <p className="pl-4">
                        <span className="text-[#3d484f] mr-2">03</span> telemetryFreqHz: number;
                      </p>
                      <p className="pl-4">
                        <span className="text-[#3d484f] mr-2">04</span> firewallArmed: boolean;
                      </p>
                      <p>
                        <span className="text-[#3d484f] mr-2">05</span> &#125;
                      </p>
                    </>
                  )}
                </div>
              </div>

              {/* Terminal Output Strip */}
              <div className="mt-4 p-3 bg-[#1d1f27] rounded border border-[#3d484f]/30 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-[11px]">
                  <span className={raidTestsPassing ? 'text-[#5eecaf] font-bold' : 'text-[#5eecaf]'}>
                    ✓ 14/14 UNIT TESTS PASSING
                  </span>
                  <span className="text-[#3d484f]">|</span>
                  <span className="text-[#bcc8d0]">HEAP: 24.1 MB</span>
                </div>
                <button
                  onClick={handleRunRaidTests}
                  className="px-3 py-1 bg-[#00c6ff] hover:bg-[#6dd2ff] text-[#003547] font-bold rounded text-[10px] uppercase shadow-[0_0_10px_rgba(0,198,255,0.4)] transition-all cursor-pointer"
                >
                  RUN RAID TESTS
                </button>
              </div>
            </div>

            {/* PANE 3: LIVE BOSS FIGHT ENCOUNTER HUD (3 cols) */}
            <div className="lg:col-span-3 bg-[#1d1f27] p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-2 py-0.5 bg-[#93000a] text-[#ffb4ab] text-[10px] rounded font-bold uppercase tracking-wider flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ffb4ab] animate-ping"></span> BOSS RAID
                  </span>
                  <span className="font-mono text-[#86929a] text-[11px]">TIER 3</span>
                </div>

                <div className="relative w-full h-40 mb-4 rounded overflow-hidden bg-[#272a32] flex flex-col items-center justify-center border border-[#ffb4ab]/20">
                  <img
                    className="w-full h-full object-cover opacity-80 mix-blend-screen"
                    alt="A glowing cybernetic monolith titan radiating crimson and violet lightning pulses"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBFc-tSBzKa7DeJ7cREV8fw_5J4tKTwtw_kWJvGT-bgHL7OMvmi4Howl-JaO1_F68UcqO2-QEw10beGPYVIHSVmvDm1VX4DPn6gixk53m8tXvvkAZAn_D32XpoKnfaUS8gtCGhawLLKRWYBiQ3JTl8s5iUnglpZx6gvERUQH4riTeQ5_pCcTqZnzWJ-l414UHUA68xuv_jLgvmWyBueuaioF7_aosxW4VCuc-RK4r2jLs4Cf5omHy1j"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1d1f27] via-transparent to-transparent"></div>
                  <div className="absolute bottom-2 text-center">
                    <p className="font-['Space_Grotesk'] text-xs font-bold text-white tracking-wide">
                      NULL_POINTER_COLOSSUS
                    </p>
                    <p className="text-[10px] text-[#ffb4ab] uppercase tracking-wider font-bold">
                      CORRUPTION: LVL 42
                    </p>
                  </div>
                </div>

                {/* Boss Health Bar */}
                <div className="space-y-1 mb-5">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-[#ffb4ab] font-bold">BOSS HP</span>
                    <span className="font-mono text-[#bcc8d0]">{bossHp.toLocaleString()} / 10,000 HP</span>
                  </div>
                  <div className="w-full bg-[#0b0e15] h-2 rounded overflow-hidden">
                    <div
                      className="bg-[#ffb4ab] h-full rounded shadow-[0_0_12px_rgba(244,63,94,0.7)] transition-all duration-300"
                      style={{ width: `${(bossHp / 10000) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Active Bug Debuffs */}
                <div className="space-y-2">
                  <span className="text-[10px] text-[#86929a] uppercase tracking-wider block font-bold">
                    ACTIVE DEBUFFS
                  </span>
                  <div className="flex items-center justify-between p-2 rounded bg-[#0b0e15] text-[11px]">
                    <span className="text-[#e1e2ec]">Uncaught TypeError</span>
                    <span className="text-[#ffb4ab] font-mono font-bold">-250 DPS</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-[#0b0e15] text-[11px]">
                    <span className="text-[#e1e2ec]">Race Condition</span>
                    <span className="text-[#ddb7ff] font-mono font-bold">-15% ACC</span>
                  </div>
                </div>
              </div>

              {/* Quick Hacks Buttons */}
              <div className="pt-4">
                <span className="text-[10px] text-[#86929a] uppercase tracking-wider block mb-2 font-bold">
                  QUICK HACKS READY
                </span>
                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  <button
                    onClick={() => handleQuickHack('tryCatch', 600)}
                    className="p-2 bg-[#272a32] hover:bg-[#363941] text-[#00c6ff] border border-[#00c6ff]/30 text-center rounded transition-all cursor-pointer font-bold"
                  >
                    [Q] TryCatch()
                  </button>
                  <button
                    onClick={() => handleQuickHack('abort', 800)}
                    className="p-2 bg-[#272a32] hover:bg-[#363941] text-[#ddb7ff] border border-[#ddb7ff]/30 text-center rounded transition-all cursor-pointer font-bold"
                  >
                    [W] AbortController
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LIVE METRICS TICKER */}
      <section className="w-full bg-[#191b23] py-6 px-6 border-y border-[#3d484f]/25">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-6 text-xs">
          <div className="flex items-center space-x-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00c6ff] animate-pulse"></span>
            <span className="font-bold tracking-wide text-white uppercase">WEEKLY GUILD METRICS:</span>
          </div>
          <div className="flex flex-wrap items-center gap-8 font-mono text-xs text-[#bcc8d0]">
            <div className="flex items-center gap-2">
              <span className="text-[#00c6ff] font-bold text-sm">12,800+</span>
              <span>QUESTS COMPLETED</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#ffb4ab] font-bold text-sm">45</span>
              <span>SYSTEM BOSSES FELLED</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#5eecaf] font-bold text-sm">99.4%</span>
              <span>CODE REPOSITORY INTEGRITY</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#ddb7ff] font-bold text-sm">3,120,000</span>
              <span>TOTAL XP DISTRIBUTED</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4 PILLARS BENTO GRID */}
      <section className="w-full px-6 lg:px-12 py-20 bg-[#10131a]" id="quests">
        <div className="max-w-7xl mx-auto">
          <div className="mb-14">
            <span className="text-[10px] text-[#00c6ff] uppercase tracking-widest block mb-2 font-bold">
              // CAMPAIGN PILLARS
            </span>
            <h2 className="font-['Space_Grotesk'] text-3xl md:text-4xl font-bold text-white tracking-tight">
              How DevQuest Transforms Novices Into Architects
            </h2>
            <p className="text-sm text-[#bcc8d0] mt-2 max-w-2xl leading-relaxed">
              Traditional tutorials bore you with static calculators. DevQuest drops you into
              production crisis scenarios where your code directly changes world outcomes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Pillar 1 */}
            <div
              onClick={() => {
                playCyberSound('click', soundEnabled);
                onNavigate('challenges');
              }}
              className="bg-[#1d1f27] p-6 rounded flex flex-col justify-between shadow-lg hover:shadow-[0_0_24px_rgba(0,198,255,0.2)] border border-[#3d484f]/30 hover:border-[#00c6ff]/50 transition-all cursor-pointer group"
            >
              <div>
                <div className="w-12 h-12 rounded bg-[#32353d] flex items-center justify-center text-[#00c6ff] mb-6 group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-[24px]">terminal</span>
                </div>
                <div className="text-[10px] text-[#00c6ff] mb-1 uppercase font-bold">QUEST ENGINE</div>
                <h3 className="font-['Space_Grotesk'] text-lg font-bold text-white mb-2">
                  Live Coding Quests
                </h3>
                <p className="text-xs text-[#bcc8d0] leading-relaxed">
                  Complete bite-sized interactive challenges inside an in-browser IDE with instant test
                  feedback, telemetry reports, and progressive XP rewards.
                </p>
              </div>
              <div className="mt-6 pt-3 bg-[#191b23] p-3 rounded">
                <span className="text-[10px] text-[#86929a] block mb-1">REWARD YIELD</span>
                <div className="flex items-center justify-between text-[11px] text-[#5eecaf] font-bold">
                  <span>+350 Base XP</span>
                  <span>+1 Logic Gem</span>
                </div>
              </div>
            </div>

            {/* Pillar 2 */}
            <div
              onClick={() => {
                playCyberSound('click', soundEnabled);
                onNavigate('boss-raid');
              }}
              className="bg-[#1d1f27] p-6 rounded flex flex-col justify-between shadow-lg hover:shadow-[0_0_24px_rgba(244,63,94,0.2)] border border-[#3d484f]/30 hover:border-[#ffb4ab]/50 transition-all cursor-pointer group"
            >
              <div>
                <div className="w-12 h-12 rounded bg-[#32353d] flex items-center justify-center text-[#ffb4ab] mb-6 group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-[24px]">swords</span>
                </div>
                <div className="text-[10px] text-[#ffb4ab] mb-1 uppercase font-bold">MULTI-TIER RAIDS</div>
                <h3 className="font-['Space_Grotesk'] text-lg font-bold text-white mb-2">
                  Bug Fix Raids
                </h3>
                <p className="text-xs text-[#bcc8d0] leading-relaxed">
                  Encounter high-stakes intentional codebase crashes. Hunt down rogue race conditions,
                  memory leaks, and broken security policies under tick-down timers.
                </p>
              </div>
              <div className="mt-6 pt-3 bg-[#191b23] p-3 rounded">
                <span className="text-[10px] text-[#86929a] block mb-1">RAID MECHANIC</span>
                <div className="flex items-center justify-between text-[11px] text-[#ffb4ab] font-bold">
                  <span>Dynamic Health Bars</span>
                  <span>Team Co-op</span>
                </div>
              </div>
            </div>

            {/* Pillar 3 */}
            <div
              onClick={() => {
                playCyberSound('click', soundEnabled);
                onNavigate('challenges');
              }}
              className="bg-[#1d1f27] p-6 rounded flex flex-col justify-between shadow-lg hover:shadow-[0_0_24px_rgba(221,183,255,0.2)] border border-[#3d484f]/30 hover:border-[#ddb7ff]/50 transition-all cursor-pointer group"
            >
              <div>
                <div className="w-12 h-12 rounded bg-[#32353d] flex items-center justify-center text-[#ddb7ff] mb-6 group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-[24px]">psychology</span>
                </div>
                <div className="text-[10px] text-[#ddb7ff] mb-1 uppercase font-bold">SYNAPSE AI</div>
                <h3 className="font-['Space_Grotesk'] text-lg font-bold text-white mb-2">
                  AI Quest Mentor
                </h3>
                <p className="text-xs text-[#bcc8d0] leading-relaxed">
                  Receive Socratic guidance that nudges your architectural thinking rather than dumping
                  answers. Contextual hints adapt to your personalized skill telemetry.
                </p>
              </div>
              <div className="mt-6 pt-3 bg-[#191b23] p-3 rounded">
                <span className="text-[10px] text-[#86929a] block mb-1">MENTOR MODE</span>
                <div className="flex items-center justify-between text-[11px] text-[#ddb7ff] font-bold">
                  <span>Non-Spoiler Logic</span>
                  <span>Real-time AST</span>
                </div>
              </div>
            </div>

            {/* Pillar 4 */}
            <div
              onClick={() => {
                playCyberSound('click', soundEnabled);
                onNavigate('quest-map');
              }}
              className="bg-[#1d1f27] p-6 rounded flex flex-col justify-between shadow-lg hover:shadow-[0_0_24px_rgba(94,236,175,0.2)] border border-[#3d484f]/30 hover:border-[#5eecaf]/50 transition-all cursor-pointer group"
            >
              <div>
                <div className="w-12 h-12 rounded bg-[#32353d] flex items-center justify-center text-[#5eecaf] mb-6 group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-[24px]">account_tree</span>
                </div>
                <div className="text-[10px] text-[#5eecaf] mb-1 uppercase font-bold">RPG CLASS EVOLUTION</div>
                <h3 className="font-['Space_Grotesk'] text-lg font-bold text-white mb-2">
                  Dynamic Skill Tree
                </h3>
                <p className="text-xs text-[#bcc8d0] leading-relaxed">
                  Specialize into three battle-tested disciplines: Frontend Mage, Backend Architect, or
                  Full-Stack Cyberpaladin. Unlocking master nodes yields verified credentials.
                </p>
              </div>
              <div className="mt-6 pt-3 bg-[#191b23] p-3 rounded">
                <span className="text-[10px] text-[#86929a] block mb-1">SPECIALIZATIONS</span>
                <div className="flex items-center justify-between text-[11px] text-[#5eecaf] font-bold">
                  <span>3 Base Classes</span>
                  <span>36 Perk Nodes</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CLASS ARSENAL SPECIALIZATION SHOWCASE */}
      <section className="w-full px-6 lg:px-12 py-16 bg-[#0b0e15]" id="skill-tree">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-10">
            <div>
              <span className="text-[10px] text-[#ddb7ff] uppercase tracking-widest block mb-2 font-bold">
                // CLASS ARSENAL
              </span>
              <h2 className="font-['Space_Grotesk'] text-3xl font-bold text-white tracking-tight">
                Choose Your Class Specialization
              </h2>
            </div>
            <div className="flex items-center space-x-2 bg-[#1d1f27] p-1 rounded text-xs">
              <button
                onClick={() => setSelectedClass('frontend')}
                className={`px-4 py-2 font-bold rounded transition-colors ${
                  selectedClass === 'frontend'
                    ? 'bg-[#00c6ff] text-[#003547]'
                    : 'text-[#86929a] hover:text-white'
                }`}
              >
                FRONTEND MAGE
              </button>
              <button
                onClick={() => setSelectedClass('backend')}
                className={`px-4 py-2 font-bold rounded transition-colors ${
                  selectedClass === 'backend'
                    ? 'bg-[#00c6ff] text-[#003547]'
                    : 'text-[#86929a] hover:text-white'
                }`}
              >
                BACKEND ARCHITECT
              </button>
              <button
                onClick={() => setSelectedClass('cyberpaladin')}
                className={`px-4 py-2 font-bold rounded transition-colors ${
                  selectedClass === 'cyberpaladin'
                    ? 'bg-[#00c6ff] text-[#003547]'
                    : 'text-[#86929a] hover:text-white'
                }`}
              >
                CYBERPALADIN
              </button>
            </div>
          </div>

          <div className="bg-[#1d1f27] p-8 rounded-lg shadow-xl relative overflow-hidden border border-[#3d484f]/30">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
              {/* Branch 1 */}
              <div className="p-6 bg-[#191b23] rounded space-y-4 border border-[#3d484f]/30">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[#00c6ff] text-xs font-bold">TIER 1: FOUNDATION</span>
                  <span className="text-[#5eecaf] text-xs font-mono font-bold">UNLOCKED</span>
                </div>
                <h4 className="font-['Space_Grotesk'] text-base font-bold text-white">
                  DOM Manipulation &amp; CSS Optics
                </h4>
                <p className="text-xs text-[#bcc8d0]">
                  Command the visual layout layer with CSS Flex/Grid mastery and event-delegation
                  sorcery.
                </p>
                <div className="w-full bg-[#32353d] h-1.5 rounded overflow-hidden">
                  <div className="bg-[#00c6ff] h-full w-full"></div>
                </div>
              </div>

              {/* Branch 2 */}
              <div className="p-6 bg-[#272a32] rounded space-y-4 shadow-[0_0_15px_rgba(0,198,255,0.1)] border border-[#00c6ff]/40">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[#00c6ff] text-xs font-bold">TIER 2: ADVANCED</span>
                  <span className="text-[#00c6ff] text-xs font-mono font-bold">CURRENT NODE</span>
                </div>
                <h4 className="font-['Space_Grotesk'] text-base font-bold text-white">
                  Reactive State Architecture
                </h4>
                <p className="text-xs text-[#bcc8d0]">
                  Harness React components, unidirectional data streams, custom hooks, and concurrent
                  memoization.
                </p>
                <div className="w-full bg-[#32353d] h-1.5 rounded overflow-hidden">
                  <div className="bg-[#00c6ff] h-full w-2/3 shadow-[0_0_8px_rgba(0,198,255,0.8)]"></div>
                </div>
              </div>

              {/* Branch 3 */}
              <div className="p-6 bg-[#191b23] rounded space-y-4 opacity-50 border border-[#3d484f]/20">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[#86929a] text-xs font-bold">TIER 3: TRANSCENDENT</span>
                  <span className="text-[#86929a] text-xs font-mono">LOCKED [REQ: LVL 20]</span>
                </div>
                <h4 className="font-['Space_Grotesk'] text-base font-bold text-[#86929a]">
                  WebGL &amp; GPU Shaders
                </h4>
                <p className="text-xs text-[#86929a]">
                  Manipulate graphics hardware pipelines to render 60FPS fluid physics and holographic
                  spatial HUDs.
                </p>
                <div className="w-full bg-[#32353d] h-1.5 rounded overflow-hidden">
                  <div className="bg-[#86929a] h-full w-0"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LEADERBOARD / HACKATHON ARENA */}
      <section className="w-full px-6 lg:px-12 py-16 bg-[#10131a]" id="telemetry">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-6">
              <span className="text-[10px] text-[#00c6ff] uppercase tracking-widest block font-bold">
                // GLOBAL HACKATHON ARENA
              </span>
              <h2 className="font-['Space_Grotesk'] text-3xl font-bold text-white tracking-tight">
                Compete in Weekly High-Voltage Code Raids
              </h2>
              <p className="text-sm text-[#bcc8d0] leading-relaxed">
                Form parties with fellow developers around the world. Race against the clock in
                scheduled Friday night server breaches to earn exclusive NFT-verified gear and profile
                titles.
              </p>
              <div className="flex items-center space-x-4 pt-2">
                <div className="p-4 bg-[#1d1f27] border border-[#3d484f]/30 rounded flex items-center space-x-4">
                  <span className="material-symbols-outlined text-[#00c6ff] text-[32px]">
                    trophy
                  </span>
                  <div>
                    <p className="text-xs font-bold text-white">SEASON PRIZE POOL</p>
                    <p className="text-xs text-[#5eecaf] font-mono font-bold">$10,000 + Top Tech Hires</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Leaderboard Terminal */}
            <div className="lg:col-span-7 bg-[#1d1f27] rounded-lg p-6 shadow-xl border border-[#3d484f]/30">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#3d484f]/30">
                <span className="text-[10px] text-[#86929a] uppercase tracking-wider font-bold">
                  LIVE OPERATIVE RANKINGS
                </span>
                <span className="text-[#5eecaf] font-mono text-xs font-bold">
                  STATUS: LIVE STREAMING
                </span>
              </div>
              <div className="space-y-3">
                {/* Rank 1 */}
                <div className="flex items-center justify-between p-3.5 rounded bg-[#272a32] border border-[#00c6ff]/30 shadow-[0_0_10px_rgba(0,198,255,0.1)]">
                  <div className="flex items-center space-x-4">
                    <span className="font-mono font-bold text-[#00c6ff] text-sm">#01</span>
                    <div className="w-8 h-8 rounded bg-[#00c6ff] text-[#003547] font-bold flex items-center justify-center font-mono text-xs">
                      0xV
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white leading-none">Valkyrie_Null</p>
                      <span className="text-[10px] text-[#00c6ff] uppercase font-mono mt-1 block">
                        ARCHITECT LVL 58
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-xs font-bold text-[#5eecaf]">42,850 XP</p>
                    <span className="text-[10px] text-[#86929a]">18 Bosses Slain</span>
                  </div>
                </div>

                {/* Rank 2 */}
                <div className="flex items-center justify-between p-3.5 rounded bg-[#191b23] border border-[#3d484f]/20">
                  <div className="flex items-center space-x-4">
                    <span className="font-mono font-bold text-[#ddb7ff] text-sm">#02</span>
                    <div className="w-8 h-8 rounded bg-[#6f00be] text-[#ddb7ff] font-bold flex items-center justify-center font-mono text-xs">
                      KD
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white leading-none">KernelDaemon</p>
                      <span className="text-[10px] text-[#ddb7ff] uppercase font-mono mt-1 block">
                        CYBERPALADIN LVL 54
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-xs font-bold text-[#5eecaf]">38,120 XP</p>
                    <span className="text-[10px] text-[#86929a]">14 Bosses Slain</span>
                  </div>
                </div>

                {/* Rank 3 */}
                <div className="flex items-center justify-between p-3.5 rounded bg-[#191b23] border border-[#3d484f]/20">
                  <div className="flex items-center space-x-4">
                    <span className="font-mono font-bold text-[#5eecaf] text-sm">#03</span>
                    <div className="w-8 h-8 rounded bg-[#3acf95]/30 text-[#5eecaf] font-bold flex items-center justify-center font-mono text-xs">
                      SF
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white leading-none">StackOverflowed</p>
                      <span className="text-[10px] text-[#5eecaf] uppercase font-mono mt-1 block">
                        FRONTEND MAGE LVL 51
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-xs font-bold text-[#5eecaf]">34,900 XP</p>
                    <span className="text-[10px] text-[#86929a]">12 Bosses Slain</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CALLOUT BANNER */}
      <section className="w-full px-6 lg:px-12 py-16 bg-[#191b23]">
        <div className="max-w-7xl mx-auto rounded-lg bg-[#1d1f27] border border-[#00c6ff]/30 p-8 lg:p-12 relative overflow-hidden shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#272a32] rounded text-[10px] text-[#00c6ff] mb-4 font-bold">
              <span className="material-symbols-outlined text-[14px]">terminal</span>
              <span>GLOBAL CODENIGHT: INITIATING IN 3 DAYS</span>
            </div>
            <h3 className="font-['Space_Grotesk'] text-2xl sm:text-3xl font-bold text-white uppercase tracking-tight mb-4">
              Ready to Claim Your First Skill Node?
            </h3>
            <p className="text-sm text-[#bcc8d0] leading-relaxed">
              Sign up with your GitHub account, join your guild squad, and conquer the introductory
              terminal quest line in under 15 minutes.
            </p>
          </div>
          <div className="relative z-10 flex flex-col sm:flex-row gap-4 shrink-0">
            <button
              onClick={() => {
                playCyberSound('surge', soundEnabled);
                onNavigate('dashboard');
              }}
              className="px-8 py-4 bg-[#00c6ff] hover:bg-[#6dd2ff] text-[#003547] text-xs font-bold uppercase tracking-wider rounded shadow-[0_0_24px_rgba(0,198,255,0.4)] transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Authorize with GitHub</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
            <button
              onClick={() => {
                playCyberSound('click', soundEnabled);
                alert("Redirecting to DevQuest Guild Discord frequency...");
              }}
              className="px-6 py-4 bg-[#272a32] hover:bg-[#363941] text-[#e1e2ec] text-xs uppercase tracking-wider rounded transition-all flex items-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">forum</span>
              <span>Join Discord Guild</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
