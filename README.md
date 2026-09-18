# 🚀 DEVQUEST — Turn Learning to Code into an Adventure

> **DevQuest** is a cyberpunk RPG IDE and gamified coding platform designed for beginner programmers. Learn HTML, CSS, JavaScript, DOM manipulation, asynchronous APIs, and Firebase by exploring interactive quest sectors, casting code spells, defeating corrupted malware raid bosses, and leveling up your developer skill tree with a neural AI mentor.

![DevQuest Banner](https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&auto=format&fit=crop&q=80)

---

## 🌟 Key Features

### 🎮 Gamified RPG Learning Experience
- **10+ Standard Coding Quests**: Spanning Hello World, Variables, Arrow Functions, Array Transformations (`map`/`filter`), Neon CSS Styling, DOM Selection, Event Listeners, Form Validation, Async Fetch API, and LocalStorage State.
- **3 Pinnacle Boss Raids**:
  - **Malware Titan** (*Broken HTML semantic layout*)
  - **CSS Glitch Fiend** (*Broken CSS flexbox/grid layout and infinite overflow*)
  - **Null Pointer Dragon** (*Broken JavaScript unhandled promises, null dereference, and recursion*)
- **Real-Time Code Execution & Test Sandbox**: In-browser sandboxed evaluation validating syntax, DOM mutations, return values, and test assertion criteria.

### 🧠 Syrus — Socratic Neural AI Mentor
- Integrated AI copilot powered by Google Gemini (`@google/genai`).
- 4 Quick-action Neural Triggers:
  - 💡 **Give me a hint** (Socratic guidance without spoiling answers)
  - 🔍 **Explain this error** (Syntax and runtime exception breakdown)
  - ⚡ **Show a pattern** (Abstract syntax examples)
  - 🔓 **Show solution** (Full solution blueprint with step-by-step walkthrough)
- Real-time conversational chat with live code context.
- Secure serverless backend routing via `/api/ai-mentor.js` with automated offline heuristic fallback.

### 📊 Progression, Skills & Leaderboard
- **XP & Level Ascension Engine**: Level progression curves, celebratory level-up animations with canvas confetti, and rank titles (*Cyber Initiate* → *Cyber Adept* → *Master Vanguard* → *Cyber Legend*).
- **Skill Tree Matrix**: Skill progression across HTML, CSS, JavaScript, DOM, APIs, Git, and Firebase.
- **Medal Deck (Achievements)**: Automated badge unlock notifications (*First Step*, *Code Operative*, *Titan Slayer*, *Master Debugger*, etc.).
- **Global Leaderboard**: Realtime synchronization with Cloud Firestore rankings.

### 🎵 Cyberpunk Audio SFX Engine
- Web Audio API synthesizer providing retro-futuristic sound effects for laser attacks, spellcasting, level ups, XP gains, errors, and UI interactions with instant mute toggle.

---

## 🛠 Tech Stack

- **Frontend**: Vite 8, Vanilla HTML5 / CSS3 / ES6+ JavaScript & React 19 UI layer, Tailwind CSS 4.
- **Editor & Sandbox**: Sandboxed Virtual DOM execution engine with custom console logger & assertion runner.
- **Backend & Database**: Firebase v10+ (Authentication, Cloud Firestore, Security Rules).
- **AI Integration**: Google Gemini API via serverless backend function (`api/ai-mentor.js`).
- **Effects & SFX**: HTML5 Canvas particle systems, `canvas-confetti`, Web Audio API sound synthesizer.
- **Deployment**: Vercel & GitHub.

---

## 📁 Project Structure

```
devquest/
├── api/
│   └── ai-mentor.js             # Serverless backend handler for Gemini AI
├── public/
├── src/
│   ├── components/
│   │   ├── AchievementsModal.tsx # Medal deck modal
│   │   ├── AuthModal.tsx         # Sign in / Sign up / Recovery modal
│   │   ├── BossRaidView.tsx      # 3 Boss Raid encounters & AST debugging arena
│   │   ├── ChallengeStudioView.tsx# Quest IDE with tests, console & Syrus AI
│   │   ├── DashboardView.tsx     # Operative stats, bounties, skill matrix
│   │   ├── Footer.tsx            # Global cyberpunk footer
│   │   ├── LandingView.tsx       # Hero landing page & feature showcases
│   │   ├── LeaderboardModal.tsx  # Cloud Firestore global leaderboard
│   │   ├── LevelUpModal.tsx      # Ascension celebration modal
│   │   ├── Navbar.tsx            # HUD header with telemetry, audio & profile
│   │   ├── ProfileModal.tsx      # Dossier editor & avatar picker
│   │   └── QuestMapView.tsx      # World grid sector progression map
│   ├── data/
│   │   ├── achievementsData.ts   # Milestone achievements definitions & checker
│   │   ├── bossesData.ts         # 3 Boss raid challenges & patch validators
│   │   ├── leaderboardData.ts    # Seed leaderboard fallback
│   │   ├── questsData.ts         # 10 coding quests with test suites
│   │   └── skillsData.ts         # Skill tree matrix data
│   ├── firebase/
│   │   ├── authService.ts        # Authentication layer
│   │   ├── config.ts             # Firebase app & firestore initialization
│   │   └── firestoreService.ts   # Profile and leaderboard sync
│   ├── services/
│   │   ├── aiService.ts          # Syrus AI mentor client & heuristics
│   │   └── codeRunner.ts         # In-browser test runner & validator
│   ├── utils/
│   │   └── audio.ts              # Web Audio API cyber synth sound effects
│   ├── App.tsx                   # Main state coordinator & router
│   ├── index.css                 # Cyberpunk theme styles & animations
│   ├── main.tsx                  # App entrypoint
│   └── types.ts                  # TypeScript definitions
├── firestore.rules               # Production Firestore security rules
├── index.html                    # Application HTML entry
├── MANUAL_SETUP.md               # Step-by-step external setup manual
├── package.json
└── vite.config.ts
```

---

## 🚀 Getting Started

### 1. Installation
```bash
git clone https://github.com/YOUR_USERNAME/devquest.git
cd devquest
npm install --legacy-peer-deps
```

### 2. Environment Configuration
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
*(Optional: Refer to [MANUAL_SETUP.md](file:///c:/Users/vladimirsnov/Desktop/проект%20для%20devpost/MANUAL_SETUP.md) for Firebase and Gemini API keys. DevQuest operates in local demo mode out-of-the-box!)*

### 3. Launch Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
npm run build
```

---

## 🔒 Security Architecture & Firestore Rules

DevQuest implements a multi-layer security model designed for client-safe operation without exposing backend admin credentials:

### 1. User Data Isolation (`/users/{userId}`)
- **Strict Owner-Only Access**: A user can **only read and write their own document** (`request.auth.uid == userId`).
- Cross-user reads are explicitly **DENIED** (`allow read: if isOwner(userId)`).
- Subcollections (`progress`, `achievements`, `skills`) inherit strict owner-only access.

### 2. Leaderboard Integrity & Validation (`/leaderboard/{userId}`)
- **Public Read Access**: The leaderboard collection is globally readable so all players can view the ranking ladder.
- **Strict Owner Write + Schema Validation**: Users can only create or update their own leaderboard document matching their authenticated UID (`isOwner(userId)`).
- **Enforced Field Constraints**: Firestore rules validate that:
  - `uid` strictly matches the authenticated user ID (`data.uid == userId`).
  - `username`, `tier`, `rankTitle`, and `avatar` are valid strings within strict length bounds (1-40 chars).
  - `currentXp`, `level`, `clearedQuests`, and `streakDays` are positive numeric values within valid progression ranges (`currentXp >= 0 && currentXp <= 1000000`, `level >= 1 && level <= 100`).

### 3. Serverless AI Protection
- **Zero Client Key Leakage**: Secret `GEMINI_API_KEY` is hosted strictly in server-side environment variables on Vercel and accessed via the serverless function `/api/ai-mentor.js`.

### 4. Architectural Note on Progression & Trust Model
> **Hackathon Trust Model Disclosure:** In this architecture, quest test assertions run client-side in an isolated sandbox for zero-latency instant feedback. While Firestore security rules strictly prevent UID spoofing, cross-user tampering, and malformed database injection, true backend-authoritative progression would require a remote server-side code execution container (e.g. isolated Docker runner). For the scope of this hackathon, Firestore schema validation + UID ownership provides the optimal balance of high performance, security, and simplicity.

---

## 🏆 Hackathon & AI Usage Disclosure

- **Built For**: Student Online Hackathon / Devpost.
- **AI Usage**: Syrus Neural AI Mentor utilizes Google Gemini (`@google/genai`) to provide pedagogical Socratic hints and syntax pattern explanations.
- **License**: MIT
