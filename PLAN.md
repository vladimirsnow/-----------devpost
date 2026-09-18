# DEVQUEST // SYSTEM ARCHITECTURE & IMPLEMENTATION PLAN

## 1. Executive Summary
DevQuest is an RPG-themed developer learning platform designed to bridge the gap between abstract programming concepts and practical software engineering through gamification, live interactive debugging, and Socratic AI mentoring.

---

## 2. Core Architecture Modules

```
┌────────────────────────────────────────────────────────┐
│                   DEVQUEST FRONTEND                    │
│   (React 19 / Vite / Space Mono Cyberpunk Theme)       │
├─────────────┬─────────────┬─────────────┬──────────────┤
│  Landing &  │  Dashboard  │  Quest Map  │  Challenge   │
│  Hero Deck  │  & Bounties │  Sectors    │  Studio IDE  │
├─────────────┴─────────────┴─────────────┴──────────────┤
│               Syrus Neural AI Copilot                  │
└──────────┬───────────────────────────────┬─────────────┘
           │                               │
           ▼                               ▼
┌──────────────────────┐      ┌──────────────────────────┐
│  Vercel Serverless   │      │   Firebase Cloud Grid    │
│  /api/ai-mentor      │      │   Auth & Cloud Firestore │
│  (Gemini 2.5 Flash)  │      │   (User Profile & Ranks) │
└──────────────────────┘      └──────────────────────────┘
```

---

## 3. Curriculum & Quest Matrix

| ID | Title | Sector | Topic | XP |
|---|---|---|---|---|
| `q1` | Hello World | JS | Functions & Console streams | 100 XP |
| `q2` | Cyberdeck Power Matrix | JS | Variables & Arithmetic | 120 XP |
| `q3` | Firewall Packet Filter | JS | Arrow Functions & Booleans | 140 XP |
| `q4` | Data Grid Transformer | JS | Array `.map()` and `.filter()` | 160 XP |
| `q5` | Neon HUD Matrix | CSS | Flexbox, Glow & Borders | 150 XP |
| `q6` | DOM Scanner | DOM | `querySelector` & Node count | 160 XP |
| `q7` | Event Spellcasting | DOM | `addEventListener` & Clicks | 180 XP |
| `q8` | Operative Shield | DOM | Regex & Input Validation | 200 XP |
| `q9` | Satellite Telemetry | APIs | Async / Await & Fetch API | 250 XP |
| `q10` | Cyberdeck Firmware | Storage | LocalStorage & JSON State | 300 XP |

---

## 4. Boss Raid Arena

1. **Malware Titan (HTML)**: Broken tags, missing semantic elements, invalid alt attributes.
2. **CSS Glitch Fiend (CSS)**: Viewport blowout (1000vw), negative z-index layering, negative flex gaps.
3. **Null Pointer Dragon (JS)**: Unhandled promise rejections, null property dereferences, unbounded recursive loops.

---

## 5. Security & Verification
- Cloud Firestore rules prevent cross-user profile modification.
- API keys are handled server-side via serverless endpoints.
- Code execution is scoped to custom environments with sandboxed log interceptors.
