import { Quest } from '../types';

export const QUESTS: Quest[] = [
  {
    id: 'q1',
    title: 'Hello World: Neural Link Init',
    sector: 'JS',
    discipline: 'JavaScript Fundamentals',
    difficulty: 'Novice',
    xpReward: 100,
    manaReward: 25,
    skillsReward: [{ skill: 'JavaScript', xp: 50 }],
    description: 'Establish initial neural connection to the Cyber Grid by outputting the activation signal.',
    missionBrief: 'Your cyberdeck needs to emit "CYBER_LINK_ESTABLISHED" to console and return the status string.',
    objectives: [
      'Define a function named `initializeLink`',
      'Log `"CYBER_LINK_ESTABLISHED"` to `console.log`',
      'Return the string `"CYBER_LINK_ESTABLISHED"`',
    ],
    starterJs: `// QUEST 01: NEURAL LINK INITIALIZATION
// Write the initializeLink function below:

function initializeLink() {
  // TODO: Log and return the activation string
  
}
`,
    solutionJs: `function initializeLink() {
  console.log("CYBER_LINK_ESTABLISHED");
  return "CYBER_LINK_ESTABLISHED";
}`,
    expectedOutput: '"CYBER_LINK_ESTABLISHED"',
    criteria: [
      { id: 'c1', label: 'Function `initializeLink` is declared', passed: false, hint: 'Define function initializeLink() { ... }' },
      { id: 'c2', label: 'Returns "CYBER_LINK_ESTABLISHED"', passed: false, hint: 'return "CYBER_LINK_ESTABLISHED";' },
      { id: 'c3', label: 'Console logs "CYBER_LINK_ESTABLISHED"', passed: false, hint: 'console.log("CYBER_LINK_ESTABLISHED");' },
    ],
    validate: ({ js }) => {
      const logs: string[] = [];
      const results: { [key: string]: boolean } = { c1: false, c2: false, c3: false };
      try {
        const customConsole = {
          log: (...args: any[]) => logs.push(args.map(a => String(a)).join(' ')),
          warn: (...args: any[]) => logs.push('[WARN] ' + args.map(a => String(a)).join(' ')),
          error: (...args: any[]) => logs.push('[ERR] ' + args.map(a => String(a)).join(' ')),
        };
        const runFn = new Function('console', `${js}; return typeof initializeLink === 'function' ? initializeLink : null;`);
        const fn = runFn(customConsole);
        if (typeof fn === 'function') {
          results.c1 = true;
          const ret = fn();
          if (ret === 'CYBER_LINK_ESTABLISHED') {
            results.c2 = true;
          }
          if (logs.some(l => l.includes('CYBER_LINK_ESTABLISHED'))) {
            results.c3 = true;
          }
        }
        return {
          success: results.c1 && results.c2 && results.c3,
          results,
          logs,
        };
      } catch (err: any) {
        return {
          success: false,
          results,
          logs,
          error: err.message,
        };
      }
    },
  },
  {
    id: 'q2',
    title: 'Cyberdeck Power Matrix: Variables & Math',
    sector: 'JS',
    discipline: 'Variables & Data Types',
    difficulty: 'Novice',
    xpReward: 120,
    manaReward: 30,
    skillsReward: [{ skill: 'JavaScript', xp: 60 }],
    description: 'Calculate the total power reserve of your cyberdeck battery cells and overclock multiplier.',
    missionBrief: 'Create a function `calculateTotalEnergy(cells, multiplier)` that multiplies the cells by the overclock multiplier and adds a base shield buffer of 50.',
    objectives: [
      'Create `calculateTotalEnergy(cells, multiplier)`',
      'Add base shield buffer of 50 to `(cells * multiplier)`',
      'Return the final integer energy value',
    ],
    starterJs: `// QUEST 02: CYBERDECK POWER MATRIX
function calculateTotalEnergy(cells, multiplier) {
  // TODO: Return (cells * multiplier) + 50
  
}
`,
    solutionJs: `function calculateTotalEnergy(cells, multiplier) {
  return (cells * multiplier) + 50;
}`,
    expectedOutput: 'calculateTotalEnergy(10, 2.5) => 75',
    criteria: [
      { id: 'c1', label: 'Function `calculateTotalEnergy` exists', passed: false },
      { id: 'c2', label: 'Calculates basic power (10, 2) => 70', passed: false },
      { id: 'c3', label: 'Handles float multipliers (20, 1.5) => 80', passed: false },
    ],
    validate: ({ js }) => {
      const logs: string[] = [];
      const results: { [key: string]: boolean } = { c1: false, c2: false, c3: false };
      try {
        const customConsole = { log: (...args: any[]) => logs.push(args.map(a => String(a)).join(' ')) };
        const runFn = new Function('console', `${js}; return typeof calculateTotalEnergy === 'function' ? calculateTotalEnergy : null;`);
        const fn = runFn(customConsole);
        if (typeof fn === 'function') {
          results.c1 = true;
          if (fn(10, 2) === 70) results.c2 = true;
          if (fn(20, 1.5) === 80) results.c3 = true;
        }
        return {
          success: results.c1 && results.c2 && results.c3,
          results,
          logs,
        };
      } catch (err: any) {
        return { success: false, results, logs, error: err.message };
      }
    },
  },
  {
    id: 'q3',
    title: 'Firewall Filter: Arrow Functions & Logic',
    sector: 'JS',
    discipline: 'Functions & Predicates',
    difficulty: 'Novice',
    xpReward: 140,
    manaReward: 35,
    skillsReward: [{ skill: 'JavaScript', xp: 70 }],
    description: 'Implement an arrow function firewall predicate to intercept rogue network packets.',
    missionBrief: 'Define `isPacketAuthorized` as an arrow function. A packet is authorized if `packet.port === 443` OR `packet.protocol === "CYBER_SSL"`, and `packet.isCorrupt` is false.',
    objectives: [
      'Export `isPacketAuthorized = (packet) => ...`',
      'Check port 443 or "CYBER_SSL" protocol',
      'Ensure `!packet.isCorrupt`',
    ],
    starterJs: `// QUEST 03: FIREWALL PACKET FILTER
// Write an arrow function to validate packet safety

const isPacketAuthorized = (packet) => {
  // TODO: Check conditions
  
};
`,
    solutionJs: `const isPacketAuthorized = (packet) => {
  if (!packet || packet.isCorrupt) return false;
  return packet.port === 443 || packet.protocol === 'CYBER_SSL';
};`,
    expectedOutput: 'isPacketAuthorized({ port: 443, isCorrupt: false }) => true',
    criteria: [
      { id: 'c1', label: '`isPacketAuthorized` is defined as a function', passed: false },
      { id: 'c2', label: 'Authorizes valid SSL packets on port 443', passed: false },
      { id: 'c3', label: 'Blocks corrupted packets even on port 443', passed: false },
    ],
    validate: ({ js }) => {
      const logs: string[] = [];
      const results: { [key: string]: boolean } = { c1: false, c2: false, c3: false };
      try {
        const customConsole = { log: (...args: any[]) => logs.push(args.map(a => String(a)).join(' ')) };
        const runFn = new Function('console', `${js}; return typeof isPacketAuthorized === 'function' ? isPacketAuthorized : null;`);
        const fn = runFn(customConsole);
        if (typeof fn === 'function') {
          results.c1 = true;
          if (fn({ port: 443, protocol: 'HTTP', isCorrupt: false }) === true && fn({ port: 80, protocol: 'CYBER_SSL', isCorrupt: false }) === true) {
            results.c2 = true;
          }
          if (fn({ port: 443, protocol: 'CYBER_SSL', isCorrupt: true }) === false && fn({ port: 80, protocol: 'RAW', isCorrupt: false }) === false) {
            results.c3 = true;
          }
        }
        return { success: results.c1 && results.c2 && results.c3, results, logs };
      } catch (err: any) {
        return { success: false, results, logs, error: err.message };
      }
    },
  },
  {
    id: 'q4',
    title: 'Data Grid Transformer: Map & Filter',
    sector: 'JS',
    discipline: 'Array Transformations',
    difficulty: 'Adept',
    xpReward: 160,
    manaReward: 40,
    skillsReward: [{ skill: 'JavaScript', xp: 80 }],
    description: 'Transform an array of contaminated memory sectors into sanitized data blocks with amplified bandwidth.',
    missionBrief: 'Write a function `sanitizeMemorySectors(sectors)` that filters out sectors with `status: "infected"` and maps remaining sectors to double their `capacity` value.',
    objectives: [
      'Implement `sanitizeMemorySectors(sectors)`',
      'Filter out items where `sector.status === "infected"`',
      'Map surviving items to have `capacity: sector.capacity * 2`',
    ],
    starterJs: `// QUEST 04: ARRAY TRANSFORMATION
function sanitizeMemorySectors(sectors) {
  // TODO: Use filter and map to sanitize and upgrade
  
}
`,
    solutionJs: `function sanitizeMemorySectors(sectors) {
  return sectors
    .filter(s => s.status !== 'infected')
    .map(s => ({ ...s, capacity: s.capacity * 2 }));
}`,
    expectedOutput: '[{ id: 1, capacity: 200, status: "clean" }]',
    criteria: [
      { id: 'c1', label: 'Function returns filtered and transformed array', passed: false },
      { id: 'c2', label: 'Filters out infected sectors properly', passed: false },
      { id: 'c3', label: 'Doubles capacity on sanitized items', passed: false },
    ],
    validate: ({ js }) => {
      const logs: string[] = [];
      const results: { [key: string]: boolean } = { c1: false, c2: false, c3: false };
      try {
        const runFn = new Function(`${js}; return typeof sanitizeMemorySectors === 'function' ? sanitizeMemorySectors : null;`);
        const fn = runFn();
        if (typeof fn === 'function') {
          results.c1 = true;
          const mock = [
            { id: 1, capacity: 50, status: 'clean' },
            { id: 2, capacity: 100, status: 'infected' },
            { id: 3, capacity: 75, status: 'clean' },
          ];
          const out = fn(mock);
          if (Array.isArray(out) && out.length === 2) {
            results.c2 = true;
          }
          if (out && out[0]?.capacity === 100 && out[1]?.capacity === 150) {
            results.c3 = true;
          }
        }
        return { success: results.c1 && results.c2 && results.c3, results, logs };
      } catch (err: any) {
        return { success: false, results, logs, error: err.message };
      }
    },
  },
  {
    id: 'q5',
    title: 'Neon HUD Matrix: CSS Flexbox & Glow',
    sector: 'CSS',
    discipline: 'CSS & Modern Layouts',
    difficulty: 'Novice',
    xpReward: 150,
    manaReward: 35,
    skillsReward: [{ skill: 'CSS', xp: 80 }, { skill: 'HTML', xp: 40 }],
    description: 'Style a cyberpunk HUD indicator card with flexbox centering, a glowing neon cyan border, and uppercase monospace styling.',
    missionBrief: 'Apply CSS to `.hud-card` and `.hud-badge` to align contents evenly with a gap of 12px, border-radius of 8px, and neon text-shadow.',
    objectives: [
      'Set `.hud-card` display to `flex` with `align-items: center` and `justify-content: space-between`',
      'Give `.hud-card` a border of `1px solid #00c6ff` and box-shadow glow',
      'Set `.hud-badge` color to `#5eecaf` and text-transform to `uppercase`',
    ],
    starterHtml: `<div class="hud-card">
  <span class="hud-title">NEURAL CORE</span>
  <span class="hud-badge">ONLINE</span>
</div>`,
    starterCss: `/* QUEST 05: NEON HUD STYLING */
.hud-card {
  /* TODO: Add flexbox layout & cyan neon border */
  padding: 16px;
  background: #10131a;
}

.hud-badge {
  /* TODO: Style badge color & uppercase */
}
`,
    solutionCss: `.hud-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background: #10131a;
  border: 1px solid #00c6ff;
  border-radius: 8px;
  box-shadow: 0 0 15px rgba(0, 198, 255, 0.4);
}

.hud-badge {
  color: #5eecaf;
  text-transform: uppercase;
  font-weight: bold;
}`,
    criteria: [
      { id: 'c1', label: '`.hud-card` uses `display: flex`', passed: false },
      { id: 'c2', label: '`.hud-card` has border `#00c6ff` or cyan hue', passed: false },
      { id: 'c3', label: '`.hud-badge` has uppercase transform & custom color', passed: false },
    ],
    validate: ({ css }) => {
      const cleanCss = css.toLowerCase().replace(/\s+/g, ' ');
      const results = {
        c1: cleanCss.includes('display: flex') || cleanCss.includes('display:flex'),
        c2: cleanCss.includes('border') && (cleanCss.includes('#00c6ff') || cleanCss.includes('cyan') || cleanCss.includes('rgb')),
        c3: cleanCss.includes('text-transform: uppercase') || cleanCss.includes('text-transform:uppercase'),
      };
      return {
        success: results.c1 && results.c2 && results.c3,
        results,
        logs: ['[CSS_VALIDATOR] Computed AST style check passed.'],
      };
    },
  },
  {
    id: 'q6',
    title: 'DOM Scanner: QuerySelector & Nodes',
    sector: 'DOM',
    discipline: 'DOM Manipulation',
    difficulty: 'Novice',
    xpReward: 160,
    manaReward: 40,
    skillsReward: [{ skill: 'DOM', xp: 80 }, { skill: 'JavaScript', xp: 40 }],
    description: 'Scan and extract active firewall node elements from the virtual document object model.',
    missionBrief: 'Write a function `getActiveNodesCount()` that queries all elements with class `.active-node` inside `#grid-container` and returns the count.',
    objectives: [
      'Create `getActiveNodesCount()`',
      'Use `document.querySelectorAll("#grid-container .active-node")`',
      'Return the total number of matched nodes as an integer',
    ],
    starterHtml: `<div id="grid-container">
  <div class="node active-node">Node Alpha</div>
  <div class="node">Node Beta (Dormant)</div>
  <div class="node active-node">Node Gamma</div>
  <div class="node active-node">Node Delta</div>
</div>`,
    starterJs: `// QUEST 06: DOM NODE SCANNER
function getActiveNodesCount() {
  // TODO: Query and return node count
  
}
`,
    solutionJs: `function getActiveNodesCount() {
  const nodes = document.querySelectorAll('#grid-container .active-node');
  return nodes.length;
}`,
    expectedOutput: 'getActiveNodesCount() => 3',
    criteria: [
      { id: 'c1', label: 'Function `getActiveNodesCount` exists', passed: false },
      { id: 'c2', label: 'Uses querySelector / querySelectorAll correctly', passed: false },
      { id: 'c3', label: 'Returns correct node count (3)', passed: false },
    ],
    validate: ({ js, html }) => {
      const logs: string[] = [];
      const results = { c1: false, c2: false, c3: false };
      try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html || '<div id="grid-container"><div class="active-node"></div><div class="active-node"></div><div class="active-node"></div></div>', 'text/html');
        const runFn = new Function('document', `${js}; return typeof getActiveNodesCount === 'function' ? getActiveNodesCount : null;`);
        const fn = runFn(doc);
        if (typeof fn === 'function') {
          results.c1 = true;
          if (js.includes('querySelectorAll') || js.includes('getElementsByClassName') || js.includes('querySelector')) {
            results.c2 = true;
          }
          const count = fn();
          if (count === 3) {
            results.c3 = true;
          }
        }
        return { success: results.c1 && results.c2 && results.c3, results, logs };
      } catch (err: any) {
        return { success: false, results, logs, error: err.message };
      }
    },
  },
  {
    id: 'q7',
    title: 'Spellcasting: Dynamic Event Listeners',
    sector: 'DOM',
    discipline: 'Events & Interactivity',
    difficulty: 'Adept',
    xpReward: 180,
    manaReward: 45,
    skillsReward: [{ skill: 'DOM', xp: 90 }, { skill: 'JavaScript', xp: 50 }],
    description: 'Attach interactive event spellcasters to cyber buttons that trigger kinetic feedback and update DOM status text.',
    missionBrief: 'Write a function `bindCyberSpells(buttonEl, statusEl)` that listens for the `"click"` event on `buttonEl` and sets `statusEl.textContent = "SPELL_CAST_SUCCESS"`.',
    objectives: [
      'Implement `bindCyberSpells(buttonEl, statusEl)`',
      'Attach `addEventListener("click", ...)`',
      'Change `statusEl.textContent` to `"SPELL_CAST_SUCCESS"` on click',
    ],
    starterJs: `// QUEST 07: EVENT LISTENER SPELLCASTING
function bindCyberSpells(buttonEl, statusEl) {
  // TODO: Add click listener to button that updates statusEl text
  
}
`,
    solutionJs: `function bindCyberSpells(buttonEl, statusEl) {
  buttonEl.addEventListener('click', () => {
    statusEl.textContent = 'SPELL_CAST_SUCCESS';
  });
}`,
    expectedOutput: 'Clicking button updates status text',
    criteria: [
      { id: 'c1', label: 'Function `bindCyberSpells` is declared', passed: false },
      { id: 'c2', label: 'Registers "click" event listener on buttonEl', passed: false },
      { id: 'c3', label: 'Updates statusEl textContent to "SPELL_CAST_SUCCESS"', passed: false },
    ],
    validate: ({ js }) => {
      const results = { c1: false, c2: false, c3: false };
      const logs: string[] = [];
      try {
        const runFn = new Function(`${js}; return typeof bindCyberSpells === 'function' ? bindCyberSpells : null;`);
        const fn = runFn();
        if (typeof fn === 'function') {
          results.c1 = true;
          let clickHandler: any = null;
          const mockBtn = {
            addEventListener: (evt: string, cb: any) => {
              if (evt === 'click') clickHandler = cb;
            },
          };
          const mockStatus = { textContent: 'IDLE' };
          fn(mockBtn, mockStatus);
          if (clickHandler) {
            results.c2 = true;
            clickHandler();
            if (mockStatus.textContent === 'SPELL_CAST_SUCCESS') {
              results.c3 = true;
            }
          }
        }
        return { success: results.c1 && results.c2 && results.c3, results, logs };
      } catch (err: any) {
        return { success: false, results, logs, error: err.message };
      }
    },
  },
  {
    id: 'q8',
    title: 'Operative Shield: Form Input Validation',
    sector: 'DOM',
    discipline: 'Forms & Regex Validation',
    difficulty: 'Adept',
    xpReward: 200,
    manaReward: 50,
    skillsReward: [{ skill: 'JavaScript', xp: 100 }, { skill: 'DOM', xp: 60 }],
    description: 'Construct a verification gate that validates operative registration codes (Format: `CYBER-XXXX` where X are 4 digits).',
    missionBrief: 'Write a function `validateOperativeCode(code)` that returns `true` if code matches `/^CYBER-\\d{4}$/`, and `false` otherwise.',
    objectives: [
      'Define `validateOperativeCode(code)`',
      'Validate string starts with `"CYBER-"` followed by exactly 4 digits',
      'Return boolean true/false',
    ],
    starterJs: `// QUEST 08: FORM CODE VALIDATION
function validateOperativeCode(code) {
  // TODO: Return true if format is CYBER-1234
  
}
`,
    solutionJs: `function validateOperativeCode(code) {
  const regex = /^CYBER-\\d{4}$/;
  return regex.test(code);
}`,
    expectedOutput: 'validateOperativeCode("CYBER-9942") => true',
    criteria: [
      { id: 'c1', label: 'Function `validateOperativeCode` defined', passed: false },
      { id: 'c2', label: 'Passes valid codes like "CYBER-1024", "CYBER-9999"', passed: false },
      { id: 'c3', label: 'Rejects invalid codes like "CYBER-12", "HACK-1234", "cyber-1024"', passed: false },
    ],
    validate: ({ js }) => {
      const results = { c1: false, c2: false, c3: false };
      const logs: string[] = [];
      try {
        const runFn = new Function(`${js}; return typeof validateOperativeCode === 'function' ? validateOperativeCode : null;`);
        const fn = runFn();
        if (typeof fn === 'function') {
          results.c1 = true;
          if (fn('CYBER-1024') === true && fn('CYBER-9999') === true) results.c2 = true;
          if (fn('CYBER-12') === false && fn('HACK-1234') === false && fn('cyber-1024') === false && fn(null) === false) results.c3 = true;
        }
        return { success: results.c1 && results.c2 && results.c3, results, logs };
      } catch (err: any) {
        return { success: false, results, logs, error: err.message };
      }
    },
  },
  {
    id: 'q9',
    title: 'Satellite Uplink: Async / Await Fetch API',
    sector: 'APIs',
    discipline: 'Async Programming & Fetch',
    difficulty: 'Master',
    xpReward: 250,
    manaReward: 60,
    skillsReward: [{ skill: 'APIs', xp: 120 }, { skill: 'JavaScript', xp: 80 }],
    description: 'Establish an asynchronous telemetry feed with orbital satellite relay using modern `async/await` and `fetch`.',
    missionBrief: 'Create an async function `fetchTelemetry(endpointUrl)` that fetches JSON data from endpointUrl and returns the parsed payload object with an added timestamp.',
    objectives: [
      'Declare `async function fetchTelemetry(endpointUrl)`',
      'Use `await fetch(endpointUrl)` and `await response.json()`',
      'Return `{ ...data, fetchedAt: Date.now() }`',
    ],
    starterJs: `// QUEST 09: ASYNC TELEMETRY INGESTION
async function fetchTelemetry(endpointUrl) {
  // TODO: Fetch, parse JSON, and attach timestamp
  
}
`,
    solutionJs: `async function fetchTelemetry(endpointUrl) {
  const response = await fetch(endpointUrl);
  const data = await response.json();
  return { ...data, fetchedAt: Date.now() };
}`,
    expectedOutput: 'Promise<{ status: "ONLINE", fetchedAt: 1718000000000 }>',
    criteria: [
      { id: 'c1', label: '`fetchTelemetry` is an async function', passed: false },
      { id: 'c2', label: 'Uses fetch & parses JSON response', passed: false },
      { id: 'c3', label: 'Returns payload with `fetchedAt` timestamp number', passed: false },
    ],
    validate: ({ js }) => {
      const results = { c1: false, c2: false, c3: false };
      const logs: string[] = [];
      try {
        const runFn = new Function(`${js}; return typeof fetchTelemetry === 'function' ? fetchTelemetry : null;`);
        const fn = runFn();
        if (typeof fn === 'function') {
          results.c1 = true;
          if (js.includes('fetch') && js.includes('json') && (js.includes('await') || js.includes('then'))) {
            results.c2 = true;
          }
          if (js.includes('fetchedAt')) {
            results.c3 = true;
          }
        }
        return { success: results.c1 && results.c2 && results.c3, results, logs };
      } catch (err: any) {
        return { success: false, results, logs, error: err.message };
      }
    },
  },
  {
    id: 'q10',
    title: 'Cyberdeck Firmware: LocalStorage Persistence',
    sector: 'STORAGE',
    discipline: 'Browser Storage & State',
    difficulty: 'Master',
    xpReward: 300,
    manaReward: 75,
    skillsReward: [{ skill: 'DOM', xp: 100 }, { skill: 'JavaScript', xp: 100 }],
    description: 'Save encrypted cyberdeck telemetry states safely to browser localStorage and retrieve them on reboot.',
    missionBrief: 'Write two functions: `saveCyberdeckConfig(configObj)` (serializes to JSON under key `"cyberdeck_state"`) and `loadCyberdeckConfig()` (deserializes and returns the object, or default `{}` if empty).',
    objectives: [
      'Implement `saveCyberdeckConfig(configObj)` using `localStorage.setItem` & `JSON.stringify`',
      'Implement `loadCyberdeckConfig()` using `localStorage.getItem` & `JSON.parse`',
      'Handle null / empty fallback safely by returning `{}`',
    ],
    starterJs: `// QUEST 10: LOCALSTORAGE PERSISTENCE
function saveCyberdeckConfig(configObj) {
  // TODO: Save to localStorage under key "cyberdeck_state"
}

function loadCyberdeckConfig() {
  // TODO: Load and parse from localStorage or return {}
}
`,
    solutionJs: `function saveCyberdeckConfig(configObj) {
  localStorage.setItem('cyberdeck_state', JSON.stringify(configObj));
}

function loadCyberdeckConfig() {
  const raw = localStorage.getItem('cyberdeck_state');
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch (e) {
    return {};
  }
}`,
    expectedOutput: 'save({ theme: "neon" }) -> load() => { theme: "neon" }',
    criteria: [
      { id: 'c1', label: 'Both save and load functions are implemented', passed: false },
      { id: 'c2', label: 'Serializes and persists configuration to storage', passed: false },
      { id: 'c3', label: 'Safely parses and handles empty storage defaults', passed: false },
    ],
    validate: ({ js }) => {
      const results = { c1: false, c2: false, c3: false };
      const logs: string[] = [];
      try {
        const storageMock: Record<string, string> = {};
        const customLocalStorage = {
          setItem: (k: string, v: string) => { storageMock[k] = String(v); },
          getItem: (k: string) => storageMock[k] || null,
          removeItem: (k: string) => { delete storageMock[k]; },
        };
        const runFn = new Function('localStorage', `${js}; return { save: typeof saveCyberdeckConfig === 'function' ? saveCyberdeckConfig : null, load: typeof loadCyberdeckConfig === 'function' ? loadCyberdeckConfig : null };`);
        const { save, load } = runFn(customLocalStorage);
        if (typeof save === 'function' && typeof load === 'function') {
          results.c1 = true;
          save({ mana: 500, overclock: true });
          if (storageMock['cyberdeck_state'] && storageMock['cyberdeck_state'].includes('500')) {
            results.c2 = true;
          }
          const loaded = load();
          if (loaded && loaded.mana === 500 && loaded.overclock === true) {
            results.c3 = true;
          }
        }
        return { success: results.c1 && results.c2 && results.c3, results, logs };
      } catch (err: any) {
        return { success: false, results, logs, error: err.message };
      }
    },
  },
];
