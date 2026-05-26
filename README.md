# ✦ SoulLink — Viral Relationship Quiz Game

A production-ready viral social relationship quiz game. Create your Soul Profile, share a unique link, and discover your compatibility — powered by deterministic rule-based scoring. Zero AI.

---

## Tech Stack

- **Next.js 15** (App Router, TypeScript)
- **TailwindCSS** — custom cyber-romantic design
- **MongoDB + Mongoose** — all data storage
- **nanoid** — unique game IDs
- **No AI / No LLMs** — pure rule-based scoring engine

---

## Project Structure

```
/app
  page.tsx                    # Landing page
  /create/page.tsx            # Multi-step profile creation
  /share/[id]/page.tsx        # Share link page (after creation)
  /game/[id]/page.tsx         # Quiz game engine
  /result/[id]/page.tsx       # Animated results page
  /api/
    /create-profile/route.ts  # POST: save profile, return gameId
    /game/[id]/route.ts       # GET: questions for a game
    /submit-answers/route.ts  # POST: score and save result
    /result/[id]/route.ts     # GET: fetch result data

/lib
  db.ts                       # MongoDB connection with caching
  game-engine.ts              # Question bank + question generation
  scoring.ts                  # Deterministic scoring algorithm
  /models/
    Profile.ts                # Mongoose schema: Soul Profiles
    Result.ts                 # Mongoose schema: Quiz Results
```

---

## Game Engine Logic

### Scoring Categories & Weights

| Category       | Weight |
|----------------|--------|
| Romance        | 30%    |
| Trust          | 25%    |
| Compatibility  | 25%    |
| Personality    | 20%    |

### How Scoring Works

1. Each question belongs to a category (romance/trust/compatibility/personality)
2. Each answer option has a numeric value (0–100)
3. Questions have weight multipliers (1.0–1.5) based on importance
4. Category score = `Σ(answer_value × question_weight) / Σ(100 × question_weight)`
5. Final score = weighted average across all 4 categories

### Match Tiers

| Score | Title             |
|-------|-------------------|
| 90+   | ✨ Twin Flames    |
| 80+   | 💫 Soulmates      |
| 70+   | 🔥 Magnetic Match |
| 60+   | 💚 Kindred Spirits|
| 50+   | 🌊 Potential Energy|
| 35+   | 🌱 Growing Ground |
| 0+    | 🌍 Parallel Universes|

---

## Local Development

```bash
# 1. Clone and install
npm install

# 2. Set up environment
cp .env.example .env.local
# Edit .env.local with your MongoDB URI

# 3. Run dev server
npm run dev

# 4. Open http://localhost:3000
```

### MongoDB Setup (local)

Option A — MongoDB Atlas (recommended):
1. Create free cluster at https://cloud.mongodb.com
2. Get connection string
3. Set `MONGODB_URI=mongodb+srv://...`

Option B — Local MongoDB:
1. Install MongoDB Community
2. Set `MONGODB_URI=mongodb://localhost:27017/soullink`

---

## Deploy to Railway

### Step 1: Create Railway Project

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
railway init
```

### Step 2: Add MongoDB

1. In Railway dashboard → Add Plugin → MongoDB
2. Copy the `MONGO_URL` from the plugin
3. Add to environment variables as `MONGODB_URI`

### Step 3: Set Environment Variables

In Railway dashboard → Variables:
```
MONGODB_URI=<from MongoDB plugin>
NEXT_PUBLIC_BASE_URL=https://your-project.railway.app
NODE_ENV=production
```

### Step 4: Deploy

```bash
railway up
```

Or connect your GitHub repo for automatic deployments.

---

## API Reference

### POST `/api/create-profile`
Creates a new Soul Profile.

**Body:**
```json
{
  "name": "Alex",
  "age": 27,
  "gender": "woman",
  "personalityTraits": ["Empathetic", "Creative"],
  "favoriteThings": ["Music", "Travel"],
  "dislikes": ["rudeness"],
  "relationshipPreference": "serious",
  "loveLanguage": "words_of_affirmation",
  "communicationStyle": "direct",
  "dealbreakers": ["Dishonesty"],
  "customQuestions": [
    { "question": "What's my biggest fear?", "correctAnswer": "Losing people I love" }
  ]
}
```

**Response:** `{ "gameId": "xk2mPq9aLz" }`

### GET `/api/game/[id]`
Returns questions for a game (answers NOT included — kept server-side).

### POST `/api/submit-answers`
Scores answers and saves result.

**Body:**
```json
{
  "gameId": "xk2mPq9aLz",
  "playerName": "Jordan",
  "answers": [
    { "questionId": "r1", "answer": "Physical touch (hugs, kisses)" }
  ]
}
```

**Response:** `{ "resultId": "abc123def456" }`

### GET `/api/result/[id]`
Returns full result with scores and match description.

---

## Features

- ✅ Multi-step profile creation (4 steps)
- ✅ 20+ base questions across 4 categories
- ✅ Profile-adaptive question injection
- ✅ Custom personal questions (up to 2)
- ✅ Deterministic shuffle seeded by gameId
- ✅ Animated result cards with live score counters
- ✅ Social sharing (WhatsApp, Twitter/X, Instagram)
- ✅ Glassmorphism dark UI
- ✅ Mobile-first responsive design
- ✅ Railway-ready standalone build
- ✅ MongoDB with connection caching

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `MONGODB_URI` | ✅ | MongoDB connection string |
| `NEXT_PUBLIC_BASE_URL` | ✅ | Your deployed URL (for share links) |
| `NODE_ENV` | — | Set to `production` for Railway |

---

Made with ♥ — Zero AI. Pure soul science.
