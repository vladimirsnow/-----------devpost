# DEVQUEST // MANUAL SETUP & DEPLOYMENT MANUAL

This document contains step-by-step instructions for every service required by **DevQuest** that requires your personal credentials, external account authorizations, or manual web portal actions.

> **Zero-Config Notice:** DevQuest includes an automated local fallback and demo sandbox. You can run `npm run dev` right away to explore all quests, boss raids, AI hints, and leaderboards even before configuring external credentials.

---

## 1. Firebase Configuration

### Step 1.1: Create a Firebase Project
1. Open the [Firebase Console](https://console.firebase.google.com/).
2. Click **"Add project"** (or **"Create a project"**).
3. Enter Project Name: `devquest-hackathon` (or your preferred name).
4. (Optional) Disable Google Analytics or keep default, then click **"Create project"**.
5. Wait for the project creation to complete and click **"Continue"**.

---

### Step 1.2: Register a Web Application
1. On the Project Overview page, click the **Web icon (`</>`)** under *"Get started by adding Firebase to your app"*.
2. Enter App nickname: `DevQuest Web`.
3. (Optional) Check *"Also set up Firebase Hosting for this app"*.
4. Click **"Register app"**.
5. Firebase will display your `firebaseConfig` object. Copy the values into your local `.env.local` file:

```env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=devquest-hackathon.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=devquest-hackathon
VITE_FIREBASE_STORAGE_BUCKET=devquest-hackathon.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
```

---

### Step 1.3: Enable Firebase Authentication
1. In the Firebase Console left sidebar, click **"Build"** → **"Authentication"**.
2. Click **"Get started"**.
3. Under the **"Sign-in method"** tab, click **"Email/Password"**.
4. Toggle **"Enable"** (the first toggle).
5. (Optional) Leave "Email link (passwordless sign-in)" disabled.
6. Click **"Save"**.

---

### Step 1.4: Create Cloud Firestore Database
1. In the left sidebar, click **"Build"** → **"Firestore Database"**.
2. Click **"Create database"**.
3. Choose a Database location close to your region (e.g., `nam5 (us-central)` or `eur3 (europe-west)`).
4. Select **"Start in production mode"** (we provide custom security rules).
5. Click **"Create"**.

---

### Step 1.5: Apply Firestore Security Rules
1. In the Firestore Database dashboard, click the **"Rules"** tab.
2. Replace all existing text with the content from the [firestore.rules](file:///c:/Users/vladimirsnov/Desktop/проект%20для%20devpost/firestore.rules) file in this repository:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }

    match /users/{userId} {
      allow read: if isAuthenticated();
      allow write: if isOwner(userId);
      
      match /{allSubcollections=**} {
        allow read, write: if isOwner(userId);
      }
    }

    match /leaderboard/{userId} {
      allow read: if true;
      allow write: if isOwner(userId);
    }

    match /quests/{questId} {
      allow read: if true;
      allow write: if false;
    }

    match /bosses/{bossId} {
      allow read: if true;
      allow write: if false;
    }
  }
}
```
3. Click **"Publish"**.

---

## 2. AI Mentor Setup (Google Gemini API)

### Step 2.1: Obtain API Key from Google AI Studio
1. Navigate to [Google AI Studio](https://aistudio.google.com/app/apikey).
2. Sign in with your Google account.
3. Click **"Create API key"** (or **"Get API key"**).
4. Select your Google Cloud Project or create a new one.
5. Copy the generated API key (format: `AIzaSy...`).

### Step 2.2: Add Key to Server Environment
- In local development: Add to `.env.local`:
  ```env
  GEMINI_API_KEY=AIzaSyYourGeneratedGeminiKey
  ```
- In Vercel: Add `GEMINI_API_KEY` under **Project Settings → Environment Variables**.

> **Security Note:** DevQuest uses server-side routing via `api/ai-mentor.js` so your `GEMINI_API_KEY` is never leaked to the client browser.

---

## 3. GitHub Repository Setup

### Step 3.1: Initialize & Push Code
1. Open your terminal in this project folder.
2. Verify git status and commit all files:
   ```bash
   git add .
   git commit -m "feat: complete DevQuest hackathon platform with Firebase & AI mentor"
   ```
3. Create a new repository on [GitHub](https://github.com/new) named `devquest`.
4. Link and push to your remote:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/devquest.git
   git branch -M main
   git push -u origin main
   ```

---

## 4. Vercel Production Deployment

### Step 4.1: Import Project
1. Log in to [Vercel](https://vercel.com/).
2. Click **"Add New..."** → **"Project"**.
3. Select your `devquest` GitHub repository and click **"Import"**.

### Step 4.2: Set Environment Variables
Under the **"Environment Variables"** section in the Vercel import screen, add:

| Name | Value |
|---|---|
| `VITE_FIREBASE_API_KEY` | `AIzaSy...` |
| `VITE_FIREBASE_AUTH_DOMAIN` | `devquest-hackathon.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | `devquest-hackathon` |
| `VITE_FIREBASE_STORAGE_BUCKET` | `devquest-hackathon.appspot.com` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | `123456789012` |
| `VITE_FIREBASE_APP_ID` | `1:123456789012:web:abcdef123456` |
| `GEMINI_API_KEY` | `AIzaSy...` |

### Step 4.3: Deploy & Verify
1. Click **"Deploy"**.
2. Once the build finishes, click **"Visit"** to test your live production deployment.

---

## 5. Devpost Submission Guide

When submitting DevQuest on Devpost, use the following structured information:

- **Project Title:** `DevQuest`
- **Tagline:** `Turn learning to code into an adventure.`
- **Links to Include:**
  - Live Demo URL (from Vercel)
  - GitHub Repository URL
  - Video Demo / Walkthrough link
- **Inspiration:** Learning to code can be intimidating and tedious. We built DevQuest to turn programming into an immersive cyberpunk RPG where debugging feels like casting spells and defeating corrupted malware colossi.
- **What It Does:**
  - 10+ interactive JavaScript, CSS, and DOM coding quests with real sandbox execution.
  - 3 Boss Raid challenges (Broken HTML, Broken CSS, Broken JavaScript) where players repair syntax bugs to deal damage.
  - Syrus AI Neural Mentor with Socratic hints, error explanations, syntax patterns, and complete walkthroughs.
  - Full Firebase Authentication and Cloud Firestore sync for profile XP, skill tree progression, achievements, and global leaderboard rankings.
  - Web Audio synthesizer sound effects with full audio mute toggle.
