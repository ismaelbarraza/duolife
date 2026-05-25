# DuoLife 💑♾

> A gamified couple planning app — plan activities, earn coins, redeem rewards, and play mini games together.

## Quick Start

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Deploy to Vercel

```bash
npm run build
# then push to GitHub and connect to Vercel
```

`vercel.json` is already configured for SPA routing.

---

## File Structure

```
src/
├── App.jsx                        # Root app with routing
├── main.jsx
├── styles/
│   └── globals.css                # Tailwind + custom classes
├── data/
│   └── mockData.js                # Seed data, constants
├── lib/
│   └── dataService.js             # ← ALL data access lives here
├── hooks/
│   └── useAppContext.jsx           # Global state / React context
└── components/
    ├── ui/
    │   ├── ActivityCard.jsx
    │   ├── BottomNav.jsx
    │   ├── CoinBalance.jsx
    │   └── PageHeader.jsx
    ├── modals/
    │   ├── OnboardingModal.jsx
    │   ├── CreateActivityModal.jsx
    │   ├── CreateRewardModal.jsx
    │   └── InviteModal.jsx
    ├── dashboard/
    │   └── Dashboard.jsx
    ├── planner/
    │   └── Planner.jsx
    ├── rewards/
    │   └── Rewards.jsx
    └── games/
        └── Games.jsx
```

---

## Connecting Supabase (when ready)

The app is architected so **only `src/lib/dataService.js` needs to change**.

1. Install Supabase client:
   ```bash
   npm install @supabase/supabase-js
   ```

2. Create `src/lib/supabase.js`:
   ```js
   import { createClient } from '@supabase/supabase-js'
   export const supabase = createClient(
     import.meta.env.VITE_SUPABASE_URL,
     import.meta.env.VITE_SUPABASE_ANON_KEY
   )
   ```

3. Add `.env.local`:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

4. Replace functions in `dataService.js` with Supabase queries. Example:
   ```js
   // Before (localStorage)
   export const getActivities = () => load(KEYS.ACTIVITIES, DEFAULT_ACTIVITIES)

   // After (Supabase)
   export const getActivities = async () => {
     const { data } = await supabase.from('activities').select('*')
     return data
   }
   ```

5. Update `useAppContext.jsx` to `await` the async calls.

---

## Database Schema (Supabase-ready)

```sql
-- couple_spaces
id, name, invite_code, emoji, created_at

-- users
id, couple_space_id, name, emoji, color, coins, created_at

-- activities
id, couple_space_id, title, description, assigned_to, coin_reward,
status, date, created_by, created_at, completed_at

-- rewards
id, couple_space_id, name, owner, cost, category, emoji, redeemed_at

-- coin_transactions
id, couple_space_id, user_id, amount, type, reason, created_at

-- game_attempts
id, couple_space_id, user_id, game_id, result, coins_won, created_at
```

---

## Adding More Couples

The data model is multi-tenant by design. Every record has a `coupleSpaceId`.  
To support multiple couples:
1. Add auth (Supabase Auth)
2. Scope all queries by `coupleSpaceId` from the authenticated user's profile

---

Made with ♾ for Ismael & Gabriela
