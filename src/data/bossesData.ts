import { BossChallenge } from '../types';

export const BOSS_CHALLENGES: BossChallenge[] = [
  {
    id: 'boss-html',
    name: 'MALWARE TITAN',
    codename: 'CORRUPTED_DOM_COLOSSUS',
    sector: 'SECTOR_01 // CORRUPTED_MARKUP',
    description: 'A colossal malware entity forged from malformed semantic tags and unclosed HTML nodes. Its corrupted markup is collapsing the layout tree.',
    hp: 10000,
    maxHp: 10000,
    difficulty: 'TITANIC',
    rewardXp: 500,
    rewardTitle: 'DOM Purifier',
    starterCode: `<!-- BOSS CHALLENGE 01: BROKEN HTML STRUCTURE -->
<!-- Repair the unclosed semantic tags, add required alt/id attributes, and restore valid nesting -->

<main class="system-containr">
  <header class="core-head">
    <h1>CYBER DECK CORE</h1>
    <nav>
      <a href="#matrix">Matrix</a>
      <a href="#terminal">Terminal
    </nav>
  </header>

  <section id="terminal" class="viewport">
    <img src="/cyber-avatar.png">
    <div class="status-box">
      <span class="pulse">Active
    </div>
  </section>
<!-- Missing closing tags causing DOM collapse -->
`,
    solutionCode: `<main class="system-container">
  <header class="core-head">
    <h1>CYBER DECK CORE</h1>
    <nav>
      <a href="#matrix">Matrix</a>
      <a href="#terminal">Terminal</a>
    </nav>
  </header>

  <section id="terminal" class="viewport">
    <img src="/cyber-avatar.png" alt="Cyber Avatar" />
    <div class="status-box">
      <span class="pulse">Active</span>
    </div>
  </section>
</main>`,
    glitchDiagnostics: [
      {
        tab: 'html',
        title: 'Unclosed Anchors & Spans',
        description: 'Parser detected `<a href="#terminal">` and `<span class="pulse">` without closing tags.',
        astFindings: [
          'Unterminated <a> tag at line 8',
          'Unterminated <span> tag at line 14',
          'Missing closing </main> tag at EOF',
        ],
      },
      {
        tab: 'accessibility',
        title: 'Missing Image Alt Attributes',
        description: 'Screen reader neural relay cannot parse the avatar element.',
        astFindings: [
          '<img> element missing mandatory `alt` attribute',
          'Typo in container class `system-containr`',
        ],
      },
      {
        tab: 'dom',
        title: 'DOM Tree Integrity',
        description: 'DOM depth calculations are corrupted by dangling opening nodes.',
        astFindings: [
          'DOM Tree depth: INVALID (-1 nodes balanced)',
          'RECOMMENDATION: Balance all tags and close <main>',
        ],
      },
    ],
    validationCriteria: [
      { id: 'c1', label: 'All <a> and <span> tags properly closed' },
      { id: 'c2', label: 'Main container closed with </main>' },
      { id: 'c3', label: '<img> element contains alt attribute' },
    ],
    validatePatch: (code: string) => {
      const clean = code.trim().toLowerCase();
      const passedCriteria: string[] = [];
      let damage = 0;

      if (clean.includes('</a>') && clean.includes('</span>')) {
        passedCriteria.push('c1');
        damage += 3500;
      }
      if (clean.includes('</main>')) {
        passedCriteria.push('c2');
        damage += 3500;
      }
      if (clean.includes('alt=') || clean.includes('alt =')) {
        passedCriteria.push('c3');
        damage += 3000;
      }

      const success = passedCriteria.length === 3;
      return {
        success,
        damage,
        passedCriteria,
        log: success
          ? '[CRITICAL STRIKE] Malware Titan markup collapsed! 10,000 damage dealt!'
          : `[HIT] Dealt ${damage} damage. ${3 - passedCriteria.length} structural anomalies remain.`,
      };
    },
  },
  {
    id: 'boss-css',
    name: 'CSS GLITCH FIEND',
    codename: 'ANOMALY_OVERFLOW_X',
    sector: 'SECTOR_02 // STYLESHEET_CHAOS',
    description: 'A shapeshifting glitch entity exploiting rogue CSS properties, inverted z-indexes, and flex-shrink collapses that cause infinite horizontal scrolling.',
    hp: 10000,
    maxHp: 10000,
    difficulty: 'WARLOCK',
    rewardXp: 500,
    rewardTitle: 'Layout Master',
    starterCode: `/* BOSS CHALLENGE 02: BROKEN CSS OVERFLOW & Z-INDEX */
/* Fix the viewport blowout, center the boss container, and restore UI layer priority */

.boss-arena {
  /* BUG 1: Infinite width overflow */
  width: 1000vw;
  display: block;
}

.modal-shield {
  /* BUG 2: Hidden beneath background layers */
  z-index: -999;
  position: static;
}

.health-grid {
  /* BUG 3: Items collapsing on top of each other */
  display: flex;
  flex-wrap: nowrap;
  gap: -20px;
}
`,
    solutionCode: `.boss-arena {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  overflow: hidden;
}

.modal-shield {
  z-index: 50;
  position: relative;
}

.health-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}`,
    glitchDiagnostics: [
      {
        tab: 'css',
        title: 'Viewport Blowout (1000vw)',
        description: 'Container `.boss-arena` has width set to 1000vw causing viewport crash.',
        astFindings: [
          'width: 1000vw creates 19,200px horizontal overflow',
          'Missing overflow: hidden boundary protection',
        ],
      },
      {
        tab: 'stacking',
        title: 'Negative Stacking Context',
        description: '`.modal-shield` has negative z-index (-999) and static position.',
        astFindings: [
          'z-index ignored on position: static elements',
          'Layer buried underneath document root canvas',
        ],
      },
      {
        tab: 'flexbox',
        title: 'Negative Gap & Wrap Collision',
        description: '`.health-grid` has negative gap (-20px) compressing elements.',
        astFindings: [
          'Negative gap invalid in modern CSS specification',
          'flex-wrap: wrap recommended for responsive flow',
        ],
      },
    ],
    validationCriteria: [
      { id: 'c1', label: 'Fix `.boss-arena` width (remove 1000vw, use 100% or max-width)' },
      { id: 'c2', label: 'Restore `.modal-shield` z-index >= 1 and relative/absolute position' },
      { id: 'c3', label: 'Fix `.health-grid` gap to positive value >= 0px and valid wrap' },
    ],
    validatePatch: (code: string) => {
      const clean = code.toLowerCase().replace(/\s+/g, ' ');
      const passedCriteria: string[] = [];
      let damage = 0;

      if (!clean.includes('1000vw') && (clean.includes('width: 100%') || clean.includes('width:100%') || clean.includes('max-width'))) {
        passedCriteria.push('c1');
        damage += 3500;
      }
      if (!clean.includes('-999') && (clean.includes('z-index:') || clean.includes('z-index :')) && (clean.includes('relative') || clean.includes('absolute') || clean.includes('fixed'))) {
        passedCriteria.push('c2');
        damage += 3500;
      }
      if (!clean.includes('-20px') && (clean.includes('gap:') || clean.includes('gap :'))) {
        passedCriteria.push('c3');
        damage += 3000;
      }

      const success = passedCriteria.length === 3;
      return {
        success,
        damage,
        passedCriteria,
        log: success
          ? '[CRITICAL STRIKE] CSS Glitch Fiend neutralized! Box model restored!'
          : `[HIT] Landed ${damage} damage. Clean up remaining rogue CSS rules.`,
      };
    },
  },
  {
    id: 'boss-js',
    name: 'NULL POINTER DRAGON',
    codename: 'FATAL_EXCEPTION_HYDRA',
    sector: 'SECTOR_03 // KERNEL_PANIC',
    description: 'A terrifying serpentine exception that breathes unhandled promise rejections, crashes threads with undefined property lookups, and spawns memory leak event loops.',
    hp: 10000,
    maxHp: 10000,
    difficulty: 'APOCALYPTIC',
    rewardXp: 500,
    rewardTitle: 'Kernel Witch',
    starterCode: `// BOSS CHALLENGE 03: FATAL RUNTIME EXCEPTIONS
// Fix the 3 fatal runtime errors: Null dereference, unhandled rejection, and unbounded recursion

function getUserOperativeStats(user) {
  // BUG 1: Crashes with TypeError when user or user.stats is undefined
  return user.stats.experience + 100;
}

async function fetchBossData(endpoint) {
  // BUG 2: Missing try/catch or rejection handler causing unhandled promise rejections
  const res = await fetch(endpoint);
  const data = await res.json();
  return data;
}

function calculatePowerCascade(level) {
  // BUG 3: Missing base termination condition causing Maximum Call Stack Exceeded
  return level + calculatePowerCascade(level - 1);
}
`,
    solutionCode: `function getUserOperativeStats(user) {
  if (!user || !user.stats) return 100;
  return (user.stats.experience || 0) + 100;
}

async function fetchBossData(endpoint) {
  try {
    const res = await fetch(endpoint);
    if (!res.ok) throw new Error('Fetch failed');
    return await res.json();
  } catch (err) {
    console.error('Error fetching boss data:', err);
    return null;
  }
}

function calculatePowerCascade(level) {
  if (level <= 0) return 0;
  return level + calculatePowerCascade(level - 1);
}`,
    glitchDiagnostics: [
      {
        tab: 'null-pointer',
        title: 'Unchecked Member Expression',
        description: 'Cannot read properties of undefined (reading "experience").',
        astFindings: [
          'Direct access `user.stats.experience` without guard',
          'RECOMMENDATION: Use optional chaining `user?.stats?.experience` or defensive `if (!user || !user.stats)` check.',
        ],
      },
      {
        tab: 'async-error',
        title: 'Unhandled Promise Rejections',
        description: 'Network drops or 500 errors crash the entire async task queue.',
        astFindings: [
          'Missing `try { ... } catch (err)` block around `await fetch()`',
          'RECOMMENDATION: Wrap in try/catch block with fallback value.',
        ],
      },
      {
        tab: 'call-stack',
        title: 'Infinite Recursion Loop',
        description: 'Function `calculatePowerCascade` has no base case (level <= 0).',
        astFindings: [
          'Stack frame count: 10,000+ (RangeError: Maximum call stack size exceeded)',
          'RECOMMENDATION: Add `if (level <= 0) return 0;`',
        ],
      },
    ],
    validationCriteria: [
      { id: 'c1', label: 'Safe null guard on `getUserOperativeStats(user)`' },
      { id: 'c2', label: 'Wrap `fetchBossData` with `try / catch` handling' },
      { id: 'c3', label: 'Add base termination case to `calculatePowerCascade` (level <= 0)' },
    ],
    validatePatch: (code: string) => {
      const clean = code.replace(/\s+/g, ' ');
      const passedCriteria: string[] = [];
      let damage = 0;

      // Check bug 1: Safe guard on user
      try {
        const runFn1 = new Function(`${code}; return typeof getUserOperativeStats === 'function' ? getUserOperativeStats : null;`);
        const fn1 = runFn1();
        if (fn1 && fn1(null) !== undefined && fn1({}) !== undefined) {
          passedCriteria.push('c1');
          damage += 3500;
        }
      } catch (e) {}

      // Check bug 2: try catch in fetch
      if (clean.includes('try') && clean.includes('catch')) {
        passedCriteria.push('c2');
        damage += 3500;
      }

      // Check bug 3: recursion base case
      try {
        const runFn3 = new Function(`${code}; return typeof calculatePowerCascade === 'function' ? calculatePowerCascade : null;`);
        const fn3 = runFn3();
        if (fn3 && fn3(3) === 6 && fn3(0) === 0) {
          passedCriteria.push('c3');
          damage += 3000;
        }
      } catch (e) {}

      const success = passedCriteria.length === 3;
      return {
        success,
        damage,
        passedCriteria,
        log: success
          ? '[CRITICAL STRIKE] Null Pointer Dragon purged! Exception stack normalized!'
          : `[HIT] Dealt ${damage} damage. Fix remaining runtime safety guards.`,
      };
    },
  },
];
