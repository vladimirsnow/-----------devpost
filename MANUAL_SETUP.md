# 🛠 DEVQUEST — ПОЛНОЕ РУКОВОДСТВО ПО РУЧНОЙ НАСТРОЙКЕ И ДЕПЛОЮ (MANUAL SETUP)

Данный документ содержит **исчерпывающие пошаговые инструкции** для всех сервисов и внешних аккаунтов, которые требуются для работы **DevQuest** и которые физически требуют твоей авторизации (Firebase, Google AI Studio, GitHub, Vercel, Devpost).

> 💡 **Режим мгновенного демо (Zero-Config):**
> В DevQuest уже встроен локальный демо-режим. Приложение можно запустить прямо сейчас командой `npm run dev` — все 10 квестов, 3 Boss-рейда, подсказки AI и лидерборд будут работать локально даже до ввода ключей.

---

## 1. Настройка Firebase

### Шаг 1.1: Создание проекта в Firebase
1. Перейди в [Firebase Console](https://console.firebase.google.com/).
2. Нажми кнопку **"Add project"** (или **"Создать проект"**).
3. В поле **Project name** введи имя проекта: `devquest-hackathon` (или любое другое).
4. Нажми **"Continue"** ("Продолжить").
5. На шаге Google Analytics можно оставить включенным или выключить (для хакатона не имеет значения). Нажми **"Create project"** ("Создать проект").
6. Дождись завершения инициализации и нажми **"Continue"**.

---

### Шаг 1.2: Регистрация веб-приложения (Web App)
1. На главной странице проекта (Project Overview) нажми на иконку веб-приложения: **`</>`** (под надписью *"Get started by adding Firebase to your app"*).
2. В поле **App nickname** введи: `DevQuest Web`.
3. Галочку *"Also set up Firebase Hosting"* можно не ставить (мы деплоим на Vercel).
4. Нажми **"Register app"** ("Зарегистрировать приложение").
5. Firebase покажет объект конфигурации `firebaseConfig`. Скопируй значения параметров.
6. В корне проекта создай файл `.env.local` (на основе `.env.example`) и вставь скопированные значения:

```env
VITE_FIREBASE_API_KEY=AIzaSyТвойКлючЗдесь
VITE_FIREBASE_AUTH_DOMAIN=devquest-hackathon.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=devquest-hackathon
VITE_FIREBASE_STORAGE_BUCKET=devquest-hackathon.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
```

---

### Шаг 1.3: Включение аутентификации (Firebase Authentication)
1. В левом боковом меню консоли Firebase перейди в раздел **"Build"** → **"Authentication"**.
2. Нажми кнопку **"Get started"** ("Начать").
3. Во вкладке **"Sign-in method"** выбери провайдера **"Email/Password"**.
4. Включи первый переключатель: **"Enable"** ("Включено").
5. Второй переключатель (*Email link / passwordless*) оставь выключенным.
6. Нажми кнопку **"Save"** ("Сохранить").

---

### Шаг 1.4: Создание базы данных Cloud Firestore
1. В левом боковом меню перейди в раздел **"Build"** → **"Firestore Database"**.
2. Нажми **"Create database"** ("Создать базу данных").
3. Выбери ближайший к тебе регион расположения базы данных (например, `nam5 (us-central)` или `eur3 (europe-west)`).
4. Выбери режим безопасности: **"Start in production mode"** ("В режиме продакшена").
5. Нажми **"Create"** ("Создать").

---

### Шаг 1.5: Установка правил безопасности (Firestore Security Rules)
1. На странице созданной базы данных Firestore нажми на вкладку **"Rules"** ("Правила").
2. Полностью замени всё содержимое редактора правил на следующий код (он также сохранён в файле `firestore.rules` проекта):

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

    // Валидатор схемы и допустимых диапазонов для лидерборда
    function isValidLeaderboardData(userId) {
      let data = request.resource.data;
      return data.uid == userId
        && data.username is string && data.username.size() >= 1 && data.username.size() <= 40
        && data.avatar is string && data.avatar.size() <= 300
        && data.level is number && data.level >= 1 && data.level <= 100
        && data.tier is string && data.tier.size() <= 40
        && data.currentXp is number && data.currentXp >= 0 && data.currentXp <= 1000000
        && data.clearedQuests is number && data.clearedQuests >= 0 && data.clearedQuests <= 100
        && data.streakDays is number && data.streakDays >= 0 && data.streakDays <= 3650
        && data.rankTitle is string && data.rankTitle.size() <= 50;
    }

    // Профиль и игровой прогресс пользователя (СТРОГО ТОЛЬКО ВЛАДЕЛЕЦ)
    match /users/{userId} {
      allow read: if isOwner(userId);
      allow write: if isOwner(userId);
      
      match /{allSubcollections=**} {
        allow read, write: if isOwner(userId);
      }
    }

    // Публичный лидерборд (чтение доступно всем, запись — только своему аккаунту с проверкой схемы)
    match /leaderboard/{userId} {
      allow read: if true;
      allow create, update: if isOwner(userId) && isValidLeaderboardData(userId);
      allow delete: if isOwner(userId);
    }

    // Статические коллекции квестов и боссов
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
3. Нажми кнопку **"Publish"** ("Опубликовать").

---

## 2. Настройка AI Mentor (Google Gemini API)

AI-наставник **Syrus** работает через serverless-функцию `/api/ai-mentor.js`, используя официальный SDK `@google/genai`. Ключ API защищён и никогда не передаётся в клиентский браузер.

### Шаг 2.1: Получение бесплатного API-ключа Gemini
1. Перейди на портал [Google AI Studio](https://aistudio.google.com/app/apikey).
2. Авторизуйся под своим Google-аккаунтом.
3. Нажми кнопку **"Create API key"** ("Создать ключ API").
4. Выбери Google Cloud проект или подтверди создание нового.
5. Скопируй полученный ключ (он начинается с `AIzaSy...`).

### Шаг 2.2: Добавление ключа в проект
- **Для локальной разработки:** Добавь ключ в файл `.env.local`:
  ```env
  GEMINI_API_KEY=AIzaSyТвойСгенерированныйКлюч
  ```
- **Для Vercel:** Добавь переменную `GEMINI_API_KEY` в настройках проекта на Vercel (Project Settings → Environment Variables).

---

## 3. Публикация в GitHub

### Шаг 3.1: Создание репозитория на GitHub
1. Зайди на [GitHub](https://github.com/new).
2. Введи имя репозитория: `devquest`.
3. Выбери **Public** (публичный).
4. **Не добавляй** README, .gitignore или лицензию (они уже созданы в проекте).
5. Нажми **"Create repository"**.

### Шаг 3.2: Отправка кода в репозиторий
Открой терминал в папке проекта и выполни команды (замени `YOUR_USERNAME` на свой логин GitHub):

```bash
git remote add origin https://github.com/YOUR_USERNAME/devquest.git
git branch -M main
git push -u origin main
```

---

## 4. Деплой на Vercel

### Шаг 4.1: Импорт репозитория
1. Войди в свой аккаунт на [Vercel](https://vercel.com/).
2. Нажми **"Add New..."** → **"Project"**.
3. Найди в списке репозиторий `devquest` и нажми кнопку **"Import"**.

### Шаг 4.2: Настройка Environment Variables
В блоке **"Environment Variables"** добавь переменные:

| Имя переменной | Значение | Описание |
|---|---|---|
| `VITE_FIREBASE_API_KEY` | `AIzaSy...` | API Key из Firebase Web App |
| `VITE_FIREBASE_AUTH_DOMAIN` | `devquest-hackathon.firebaseapp.com` | Auth Domain Firebase |
| `VITE_FIREBASE_PROJECT_ID` | `devquest-hackathon` | ID проекта Firebase |
| `VITE_FIREBASE_STORAGE_BUCKET` | `devquest-hackathon.appspot.com` | Storage Bucket Firebase |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | `123456789012` | Sender ID Firebase |
| `VITE_FIREBASE_APP_ID` | `1:123456789012:web:abcdef123456` | App ID Firebase |
| `GEMINI_API_KEY` | `AIzaSy...` | Ключ Gemini API для AI-ментора |

### Шаг 4.3: Запуск деплоя
1. Нажми кнопку **"Deploy"**.
2. Дождись завершения сборки (около 1 минуты).
3. Нажми **"Continue to Dashboard"** и скопируй публичный URL приложения (например, `https://devquest-xxxx.vercel.app`).

---

## 5. Подготовка заявки на Devpost (Submission Guide)

При отправке проекта на платформу Devpost используй следующую структуру:

### 📌 Основные данные:
- **Project Name:** `DevQuest`
- **Tagline:** `Turn learning to code into an adventure.`
- **Live Demo URL:** `https://твой-домен.vercel.app`
- **GitHub Repository:** `https://github.com/YOUR_USERNAME/devquest`

### 📝 Текстовые блоки для Devpost:

#### 💡 Inspiration (Вдохновение)
> Традиционное обучение программированию часто кажется сухим, скучным и перегруженным сложной теорией. Мы хотели превратить процесс написания кода в захватывающее cyberpunk RPG приключение, где поиск багов ощущается как битва с боссами, а решение задач — как прокачка персонажа и открытие заклинаний.

#### ⚙️ What it does (Что делает проект)
> **DevQuest** — это полноценная геймифицированная IDE-платформа с живой песочницей:
> 1. **10 интерактивных квестов:** от Hello World и стрелочных функций до манипуляций с DOM, асинхронного Fetch API и LocalStorage.
> 2. **3 Boss Raid испытания:** исправление сломанного HTML (Malware Titan), сломанного CSS с бесконечным оверфлоу (CSS Glitch Fiend) и критических ошибок JavaScript (Null Pointer Dragon). Каждое исправление в коде наносит реальный урон боссу!
> 3. **AI-наставник Syrus:** умный копайлот на базе Google Gemini, который обучает по методу Сократа (подсказки, разбор ошибок, архитектурные паттерны и пошаговые решения).
> 4. **Прокачка и Лидерборд:** система уровней, дерево навыков, автоматические достижения (Medal Deck) и синхронизация рейтинга в Cloud Firestore.
> 5. **Cyberpunk Audio:** динамические синтезированные звуковые эффекты на Web Audio API.

#### 🛠 How we built it (Как мы это создали)
> - **Frontend:** React 19, Vite, Tailwind CSS, Space Grotesk / Space Mono typography, HTML5 Canvas.
> - **Sandbox Engine:** изолированная песочница для безопасного выполнения пользовательского кода и проверки критериев тестов.
> - **Backend & Database:** Firebase Authentication (Email/Password), Cloud Firestore с правилами безопасности.
> - **AI Integration:** Google Gemini API (`@google/genai`) через безопасный serverless-эндпоинт `/api/ai-mentor.js`.

#### 🤖 AI Disclosure (Раскрытие использования AI)
> Google Gemini API используется внутри приложения для работы AI-наставника Syrus, анализируя код пользователя и давая контекстные педагогические подсказки.
