import React, { useState, useRef, useEffect } from 'react';
import { ScreenMode, UserStats, ChatMessage, Quest } from '../types';
import { QUESTS } from '../data/questsData';
import { executeQuestCode } from '../services/codeRunner';
import { requestAiMentor } from '../services/aiService';
import { playCyberSound } from '../utils/audio';

interface ChallengeStudioViewProps {
  onNavigate: (screen: ScreenMode) => void;
  stats: UserStats;
  onUpdateStats: (newStats: Partial<UserStats>) => void;
  selectedQuestId?: string;
  onSelectQuest?: (questId: string) => void;
}

export const ChallengeStudioView: React.FC<ChallengeStudioViewProps> = ({
  onNavigate,
  stats,
  onUpdateStats,
  selectedQuestId = 'q1',
  onSelectQuest,
}) => {
  // Find currently active quest
  const currentQuest = QUESTS.find((q) => q.id === selectedQuestId) || QUESTS[0];

  const [activeTab, setActiveTab] = useState<'js' | 'html' | 'css'>('js');
  const [jsCode, setJsCode] = useState<string>(currentQuest.starterJs || '');
  const [htmlCode, setHtmlCode] = useState<string>(currentQuest.starterHtml || '');
  const [cssCode, setCssCode] = useState<string>(currentQuest.starterCss || '');

  const [consoleLogs, setConsoleLogs] = useState<string[]>([
    `[KERNEL] Sandboxed Virtual DOM v2.4.9 mounted for Quest: ${currentQuest.title}.`,
    '[READY] Enter code and press RUN or ask Syrus Copilot for guidance.',
  ]);

  const [criteriaResults, setCriteriaResults] = useState<{ [id: string]: boolean }>({});
  const [hasRunTests, setHasRunTests] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  // Syrus AI chat state
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'SYRUS',
      text: `Greetings Operative ${stats.username}. I am SYRUS, your Socratic neural copilot. In "${currentQuest.title}", what approach are you taking to solve this objective?`,
      timestamp: '12:00',
    },
  ]);

  // Sync code whenever currentQuest changes
  useEffect(() => {
    setJsCode(currentQuest.starterJs || '');
    setHtmlCode(currentQuest.starterHtml || '');
    setCssCode(currentQuest.starterCss || '');
    setCriteriaResults({});
    setHasRunTests(false);
    setIsSuccess(false);
    setIsSubmitted(stats.completedQuestIds?.includes(currentQuest.id) || false);
    setConsoleLogs([
      `[KERNEL] Switched node to: ${currentQuest.title}`,
      `[DIFFICULTY] ${currentQuest.difficulty} // XP REWARD: +${currentQuest.xpReward} XP`,
    ]);
  }, [currentQuest.id]);

  const handleRunCode = () => {
    playCyberSound('laser', stats.soundEnabled);
    const result = executeQuestCode(currentQuest, { js: jsCode, html: htmlCode, css: cssCode });

    setHasRunTests(true);
    setCriteriaResults(result.results);
    setIsSuccess(result.success);

    const newLogs = [
      `[TEST_RUNNER] Executed validation test suite at ${new Date().toLocaleTimeString()}...`,
      ...(result.logs || []),
    ];

    if (result.error) {
      playCyberSound('error', stats.soundEnabled);
      newLogs.push(`[FATAL_RUNTIME] ${result.error}`);
    } else if (result.success) {
      playCyberSound('victory', stats.soundEnabled);
      newLogs.push(`[SUCCESS] All ${currentQuest.criteria.length} criteria passed! You can now SUBMIT.`);
    } else {
      playCyberSound('blip', stats.soundEnabled);
      newLogs.push(`[PARTIAL] Some criteria failed. Review the criteria checklist or ask SYRUS.`);
    }

    setConsoleLogs(newLogs);
  };

  const handleSubmitSolution = () => {
    if (!isSuccess) {
      handleRunCode();
      return;
    }

    playCyberSound('level-up', stats.soundEnabled);
    setIsSubmitted(true);

    const alreadyCompleted = stats.completedQuestIds?.includes(currentQuest.id);
    if (!alreadyCompleted) {
      const nextCompleted = [...(stats.completedQuestIds || []), currentQuest.id];
      const nextXp = stats.currentXp + currentQuest.xpReward;
      const nextMana = stats.mana + currentQuest.manaReward;
      const nextCleared = nextCompleted.length;

      onUpdateStats({
        completedQuestIds: nextCompleted,
        currentXp: nextXp,
        mana: nextMana,
        clearedQuests: nextCleared,
      });

      setConsoleLogs((prev) => [
        ...prev,
        `[CLAIMED] +${currentQuest.xpReward} XP and +${currentQuest.manaReward} Mana credited to profile!`,
        `[PROGRESSION] Next quest node unlocked on Quest Map!`,
      ]);
    }
  };

  const handleReset = () => {
    playCyberSound('blip', stats.soundEnabled);
    setJsCode(currentQuest.starterJs || '');
    setHtmlCode(currentQuest.starterHtml || '');
    setCssCode(currentQuest.starterCss || '');
    setHasRunTests(false);
    setCriteriaResults({});
    setConsoleLogs((prev) => [...prev, '[RESET] Code editor buffer restored to starter template.']);
  };

  const handleAiAction = async (action: 'hint' | 'explain' | 'example' | 'solution') => {
    playCyberSound('surge', stats.soundEnabled);
    setAiLoading(true);

    const userMessage: ChatMessage = {
      id: 'usr-' + Date.now(),
      sender: 'YOU',
      text: action === 'hint'
        ? 'Can you give me a hint on this quest?'
        : action === 'explain'
        ? 'Can you explain this error or why my code might fail?'
        : action === 'example'
        ? 'Show me an example pattern for this concept.'
        : 'Please show me the full solution.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);

    const res = await requestAiMentor({
      action,
      questTitle: currentQuest.title,
      questDescription: currentQuest.description,
      userCode: { js: jsCode, html: htmlCode, css: cssCode },
      errorMessage: consoleLogs.find((l) => l.includes('[FATAL_RUNTIME]')),
    });

    setAiLoading(false);
    playCyberSound('blip', stats.soundEnabled);

    const aiMessage: ChatMessage = {
      id: 'syrus-' + Date.now(),
      sender: 'SYRUS',
      text: res.message,
      codeSnippet: res.codeSnippet || (action === 'solution' ? currentQuest.solutionJs : undefined),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, aiMessage]);
  };

  const handleSendCustomChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || aiLoading) return;

    playCyberSound('blip', stats.soundEnabled);
    const query = chatInput.trim();
    setChatInput('');
    setAiLoading(true);

    const userMsg: ChatMessage = {
      id: 'usr-' + Date.now(),
      sender: 'YOU',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, userMsg]);

    const res = await requestAiMentor({
      action: 'chat',
      questTitle: currentQuest.title,
      questDescription: currentQuest.description,
      userCode: { js: jsCode, html: htmlCode, css: cssCode },
      customMessage: query,
    });

    setAiLoading(false);
    playCyberSound('blip', stats.soundEnabled);

    const aiMsg: ChatMessage = {
      id: 'syrus-' + Date.now(),
      sender: 'SYRUS',
      text: res.message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, aiMsg]);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 font-['Space_Mono',monospace]">
      {/* TOP QUEST SELECTOR BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-[#10131a] border border-[#00c6ff]/30 shadow-xl">
        <div className="flex items-center gap-3 overflow-x-auto pb-1 md:pb-0">
          <span className="text-xs uppercase text-[#86929a] font-bold shrink-0">SELECT QUEST:</span>
          {QUESTS.map((q, idx) => {
            const isCompleted = stats.completedQuestIds?.includes(q.id);
            const isCurrent = q.id === currentQuest.id;
            return (
              <button
                key={q.id}
                onClick={() => {
                  playCyberSound('blip', stats.soundEnabled);
                  if (onSelectQuest) onSelectQuest(q.id);
                }}
                className={`px-2.5 py-1 text-xs rounded font-bold shrink-0 transition-all ${
                  isCurrent
                    ? 'bg-[#00c6ff] text-black shadow-[0_0_10px_rgba(0,198,255,0.6)]'
                    : isCompleted
                    ? 'bg-[#191b23] text-[#5eecaf] border border-[#5eecaf]/40'
                    : 'bg-[#191b23] text-[#86929a] hover:text-white border border-[#3d484f]/40'
                }`}
              >
                #{idx + 1} {isCompleted ? '✓' : ''}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="px-2.5 py-1 bg-[#191b23] text-[#00c6ff] text-[10px] rounded font-bold border border-[#00c6ff]/40">
            SECTOR: {currentQuest.sector}
          </span>
          <span className="px-2.5 py-1 bg-[#191b23] text-[#ddb7ff] text-[10px] rounded font-bold border border-[#ddb7ff]/40">
            +{currentQuest.xpReward} XP
          </span>
        </div>
      </div>

      {/* MAIN 3-COLUMN WORKSPACE: BRIEF/CRITERIA | CODE EDITOR | AI COPILOT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: MISSION BRIEF & CRITERIA (3 COLS) */}
        <div className="lg:col-span-3 space-y-4">
          {/* Mission Brief Card */}
          <div className="p-4 rounded-xl bg-[#10131a] border border-[#3d484f]/40 shadow-lg space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-white font-['Space_Grotesk']">
              <span className="material-symbols-outlined text-[#00c6ff] text-base">assignment</span>
              <h3>MISSION BRIEF</h3>
            </div>
            <h4 className="text-sm font-bold text-[#00c6ff] font-['Space_Grotesk']">
              {currentQuest.title}
            </h4>
            <p className="text-xs text-[#bcc8d0] leading-relaxed">
              {currentQuest.description}
            </p>
            <div className="p-2.5 rounded bg-[#191b23] border border-[#3d484f]/30 text-[11px] text-[#96dcff]">
              <strong>Requirement:</strong> {currentQuest.missionBrief}
            </div>
          </div>

          {/* Criteria Checklist Card */}
          <div className="p-4 rounded-xl bg-[#10131a] border border-[#3d484f]/40 shadow-lg space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-white font-['Space_Grotesk']">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#5eecaf] text-base">task_alt</span>
                <h3>TEST CRITERIA</h3>
              </div>
              <span className="text-[10px] text-[#86929a]">
                {Object.values(criteriaResults).filter(Boolean).length}/{currentQuest.criteria.length}
              </span>
            </div>

            <div className="space-y-2">
              {currentQuest.criteria.map((crit) => {
                const passed = Boolean(criteriaResults[crit.id]);
                return (
                  <div
                    key={crit.id}
                    className={`p-2 rounded text-xs border flex items-start gap-2 transition-all ${
                      hasRunTests && passed
                        ? 'bg-emerald-950/40 border-[#5eecaf]/50 text-[#5eecaf]'
                        : hasRunTests && !passed
                        ? 'bg-red-950/30 border-red-500/40 text-red-300'
                        : 'bg-[#191b23] border-[#3d484f]/40 text-[#bcc8d0]'
                    }`}
                  >
                    <span className="mt-0.5">
                      {hasRunTests && passed ? '✓' : hasRunTests && !passed ? '✗' : '○'}
                    </span>
                    <span className="text-[11px] leading-tight">{crit.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* CENTER COLUMN: CODE EDITOR & CONSOLE (6 COLS) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="rounded-xl bg-[#10131a] border border-[#00c6ff]/30 overflow-hidden shadow-xl flex flex-col">
            {/* Editor Tab Bar */}
            <div className="px-4 py-2 bg-[#0b0e15] border-b border-[#1d1f27] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('js')}
                  className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                    activeTab === 'js'
                      ? 'bg-[#191b23] text-[#00c6ff] border border-[#00c6ff]/40'
                      : 'text-[#86929a] hover:text-white'
                  }`}
                >
                  main.js
                </button>
                {currentQuest.starterHtml && (
                  <button
                    onClick={() => setActiveTab('html')}
                    className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                      activeTab === 'html'
                        ? 'bg-[#191b23] text-[#00c6ff] border border-[#00c6ff]/40'
                        : 'text-[#86929a] hover:text-white'
                    }`}
                  >
                    index.html
                  </button>
                )}
                {currentQuest.starterCss && (
                  <button
                    onClick={() => setActiveTab('css')}
                    className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                      activeTab === 'css'
                        ? 'bg-[#191b23] text-[#00c6ff] border border-[#00c6ff]/40'
                        : 'text-[#86929a] hover:text-white'
                    }`}
                  >
                    styles.css
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleReset}
                  className="px-2.5 py-1 text-[11px] bg-[#191b23] text-[#86929a] hover:text-white rounded border border-[#3d484f]/40 transition-colors"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Code Input Area */}
            <div className="p-3 bg-[#0b0e15] relative">
              <textarea
                value={activeTab === 'js' ? jsCode : activeTab === 'html' ? htmlCode : cssCode}
                onChange={(e) => {
                  if (activeTab === 'js') setJsCode(e.target.value);
                  else if (activeTab === 'html') setHtmlCode(e.target.value);
                  else setCssCode(e.target.value);
                }}
                spellCheck={false}
                rows={12}
                className="w-full bg-transparent text-[#00c6ff] font-['Space_Mono',monospace] text-xs sm:text-sm leading-relaxed resize-y focus:outline-none selection:bg-[#00c6ff]/30 selection:text-white border-0"
              />
            </div>

            {/* Editor Action Buttons */}
            <div className="p-3 bg-[#0b0e15] border-t border-[#1d1f27] flex items-center justify-between gap-3">
              <button
                onClick={handleRunCode}
                className="flex-1 py-2 px-4 bg-[#191b23] hover:bg-[#272a32] border border-[#00c6ff]/50 text-[#00c6ff] font-bold text-xs uppercase tracking-wider rounded transition-all shadow-[0_0_10px_rgba(0,198,255,0.2)]"
              >
                ▶ RUN TESTS
              </button>

              <button
                onClick={handleSubmitSolution}
                disabled={!isSuccess}
                className={`flex-1 py-2 px-4 font-bold text-xs uppercase tracking-wider rounded transition-all ${
                  isSuccess
                    ? 'bg-gradient-to-r from-[#5eecaf] to-[#00c6ff] text-black shadow-[0_0_20px_rgba(94,236,175,0.5)] cursor-pointer'
                    : 'bg-[#191b23] text-[#86929a] opacity-50 cursor-not-allowed border border-[#3d484f]/30'
                }`}
              >
                {isSubmitted ? '✓ COMPLETED' : '★ SUBMIT QUEST'}
              </button>
            </div>
          </div>

          {/* Sandboxed Console Output */}
          <div className="rounded-xl bg-[#10131a] border border-[#3d484f]/40 p-4 space-y-2 shadow-lg">
            <div className="flex items-center justify-between text-xs text-[#86929a] border-b border-[#1d1f27] pb-2">
              <span className="font-bold flex items-center gap-1.5 text-white">
                <span className="w-2 h-2 rounded-full bg-[#5eecaf]"></span>
                SANDBOX CONSOLE
              </span>
              <span>LOGS: {consoleLogs.length}</span>
            </div>
            <div className="h-32 overflow-y-auto space-y-1 text-xs font-['Space_Mono'] pr-1">
              {consoleLogs.map((log, i) => (
                <div
                  key={i}
                  className={`${
                    log.includes('[SUCCESS]') || log.includes('[CLAIMED]')
                      ? 'text-[#5eecaf]'
                      : log.includes('[FATAL') || log.includes('[ERR')
                      ? 'text-red-400'
                      : log.includes('[TEST_RUNNER]')
                      ? 'text-[#ddb7ff]'
                      : 'text-[#bcc8d0]'
                  }`}
                >
                  {log}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: SYRUS AI COPILOT (3 COLS) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="rounded-xl bg-[#10131a] border border-[#ddb7ff]/30 overflow-hidden shadow-xl flex flex-col h-[580px]">
            {/* Syrus Header */}
            <div className="p-3 bg-[#0b0e15] border-b border-[#1d1f27] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[#ddb7ff]/20 border border-[#ddb7ff] flex items-center justify-center text-[10px] text-[#ddb7ff] font-bold">
                  S
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white font-['Space_Grotesk']">
                    SYRUS // AI COPILOT
                  </h4>
                  <span className="text-[9px] text-[#5eecaf] font-bold block">NEURAL LINK ACTIVE</span>
                </div>
              </div>
            </div>

            {/* Quick Prompt Trigger Buttons */}
            <div className="p-2.5 bg-[#191b23] border-b border-[#1d1f27] grid grid-cols-2 gap-1.5">
              <button
                onClick={() => handleAiAction('hint')}
                disabled={aiLoading}
                className="px-2 py-1 bg-[#10131a] hover:bg-[#272a32] border border-[#00c6ff]/30 text-[#00c6ff] text-[10px] font-bold rounded transition-colors"
              >
                💡 Give Hint
              </button>
              <button
                onClick={() => handleAiAction('explain')}
                disabled={aiLoading}
                className="px-2 py-1 bg-[#10131a] hover:bg-[#272a32] border border-[#ddb7ff]/30 text-[#ddb7ff] text-[10px] font-bold rounded transition-colors"
              >
                🔍 Explain Error
              </button>
              <button
                onClick={() => handleAiAction('example')}
                disabled={aiLoading}
                className="px-2 py-1 bg-[#10131a] hover:bg-[#272a32] border border-[#5eecaf]/30 text-[#5eecaf] text-[10px] font-bold rounded transition-colors"
              >
                ⚡ Show Pattern
              </button>
              <button
                onClick={() => handleAiAction('solution')}
                disabled={aiLoading}
                className="px-2 py-1 bg-[#10131a] hover:bg-[#272a32] border border-red-500/30 text-red-300 text-[10px] font-bold rounded transition-colors"
              >
                🔓 Show Solution
              </button>
            </div>

            {/* Chat Message Stream */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`p-2.5 rounded-lg text-xs leading-relaxed ${
                    m.sender === 'SYRUS'
                      ? 'bg-[#191b23] border border-[#ddb7ff]/30 text-[#e1e2ec]'
                      : 'bg-[#00c6ff]/10 border border-[#00c6ff]/40 text-[#96dcff] ml-4'
                  }`}
                >
                  <div className="flex justify-between items-center text-[9px] text-[#86929a] mb-1">
                    <span className="font-bold text-[#ddb7ff]">{m.sender}</span>
                    <span>{m.timestamp}</span>
                  </div>
                  <p className="whitespace-pre-wrap">{m.text}</p>
                  {m.codeSnippet && (
                    <pre className="mt-2 p-2 rounded bg-black/60 border border-[#3d484f] text-[10px] text-[#00c6ff] overflow-x-auto">
                      {m.codeSnippet}
                    </pre>
                  )}
                </div>
              ))}
              {aiLoading && (
                <div className="p-2.5 rounded bg-[#191b23] border border-[#ddb7ff]/30 text-xs text-[#ddb7ff] flex items-center gap-2">
                  <span className="w-3 h-3 border-2 border-[#ddb7ff] border-t-transparent rounded-full animate-spin"></span>
                  <span>Syrus is synthesizing neural guidance...</span>
                </div>
              )}
            </div>

            {/* Chat Input Box */}
            <form onSubmit={handleSendCustomChat} className="p-2.5 bg-[#0b0e15] border-t border-[#1d1f27] flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask Syrus anything..."
                className="flex-1 px-3 py-1.5 bg-[#191b23] border border-[#3d484f] rounded text-xs text-white focus:outline-none focus:border-[#ddb7ff]"
              />
              <button
                type="submit"
                disabled={aiLoading || !chatInput.trim()}
                className="px-3 py-1.5 bg-[#ddb7ff] hover:bg-white text-black font-bold text-xs rounded transition-colors disabled:opacity-50"
              >
                ➔
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
