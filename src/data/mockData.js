import { v4 as uuid } from 'uuid'

// ─── Default Couple Space ────────────────────────────────────────────────────
export const DEFAULT_COUPLE_SPACE = {
  id: 'couple-ismael-gabriela',
  name: 'Ismael & Gabriela',
  createdAt: new Date('2024-01-01').toISOString(),
  inviteCode: 'DUOLIFE-IG-2024',
  emoji: '💑',
}

// ─── Default Users ────────────────────────────────────────────────────────────
export const DEFAULT_USERS = [
  {
    id: 'user-ismael',
    coupleSpaceId: 'couple-ismael-gabriela',
    name: 'Ismael',
    emoji: '🧔',
    color: '#00e5ff',
    coins: 320,
    createdAt: new Date('2024-01-01').toISOString(),
  },
  {
    id: 'user-gabriela',
    coupleSpaceId: 'couple-ismael-gabriela',
    name: 'Gabriela',
    emoji: '👩',
    color: '#ff2d78',
    coins: 480,
    createdAt: new Date('2024-01-01').toISOString(),
  },
]

// ─── Sample Activities ────────────────────────────────────────────────────────
const today = new Date()
const fmt = (d) => d.toISOString().split('T')[0]
const addDays = (d, n) => {
  const r = new Date(d)
  r.setDate(r.getDate() + n)
  return r
}

export const DEFAULT_ACTIVITIES = [
  {
    id: uuid(),
    coupleSpaceId: 'couple-ismael-gabriela',
    title: 'Morning walk at the park',
    description: 'Let\'s go for a 30-min walk before breakfast.',
    assignedTo: 'user-ismael',
    coinReward: 50,
    status: 'completed',
    date: fmt(addDays(today, -3)),
    createdBy: 'user-gabriela',
    createdAt: addDays(today, -3).toISOString(),
    completedAt: addDays(today, -3).toISOString(),
  },
  {
    id: uuid(),
    coupleSpaceId: 'couple-ismael-gabriela',
    title: 'Cook dinner together',
    description: 'Make that pasta recipe we bookmarked.',
    assignedTo: 'user-gabriela',
    coinReward: 80,
    status: 'completed',
    date: fmt(addDays(today, -2)),
    createdBy: 'user-ismael',
    createdAt: addDays(today, -2).toISOString(),
    completedAt: addDays(today, -2).toISOString(),
  },
  {
    id: uuid(),
    coupleSpaceId: 'couple-ismael-gabriela',
    title: 'Watch a movie together',
    description: 'Pick something from the watchlist — no phones!',
    assignedTo: 'user-ismael',
    coinReward: 40,
    status: 'pending',
    date: fmt(today),
    createdBy: 'user-gabriela',
    createdAt: today.toISOString(),
    completedAt: null,
  },
  {
    id: uuid(),
    coupleSpaceId: 'couple-ismael-gabriela',
    title: 'Write each other a letter',
    description: 'A handwritten note, just because.',
    assignedTo: 'user-gabriela',
    coinReward: 120,
    status: 'pending',
    date: fmt(today),
    createdBy: 'user-ismael',
    createdAt: today.toISOString(),
    completedAt: null,
  },
  {
    id: uuid(),
    coupleSpaceId: 'couple-ismael-gabriela',
    title: 'Plan next weekend trip',
    description: 'Research 3 places and vote on the best one.',
    assignedTo: 'user-ismael',
    coinReward: 100,
    status: 'pending',
    date: fmt(addDays(today, 2)),
    createdBy: 'user-gabriela',
    createdAt: today.toISOString(),
    completedAt: null,
  },
  {
    id: uuid(),
    coupleSpaceId: 'couple-ismael-gabriela',
    title: 'Surprise breakfast in bed',
    description: 'Full experience — tray, flowers, coffee.',
    assignedTo: 'user-gabriela',
    coinReward: 150,
    status: 'pending',
    date: fmt(addDays(today, 5)),
    createdBy: 'user-ismael',
    createdAt: today.toISOString(),
    completedAt: null,
  },
]

// ─── Default Rewards ─────────────────────────────────────────────────────────
export const DEFAULT_REWARDS = [
  {
    id: uuid(),
    coupleSpaceId: 'couple-ismael-gabriela',
    name: 'Full back massage (30 min)',
    owner: 'user-ismael',
    cost: 200,
    category: 'Wellness',
    emoji: '💆',
    redeemedAt: null,
  },
  {
    id: uuid(),
    coupleSpaceId: 'couple-ismael-gabriela',
    name: 'Pick any restaurant for date night',
    owner: 'user-gabriela',
    cost: 150,
    category: 'Food',
    emoji: '🍽️',
    redeemedAt: null,
  },
  {
    id: uuid(),
    coupleSpaceId: 'couple-ismael-gabriela',
    name: 'Lazy Sunday — no chores allowed',
    owner: 'user-ismael',
    cost: 100,
    category: 'Fun',
    emoji: '🛋️',
    redeemedAt: null,
  },
  {
    id: uuid(),
    coupleSpaceId: 'couple-ismael-gabriela',
    name: 'Movie night of my choice',
    owner: 'user-gabriela',
    cost: 80,
    category: 'Entertainment',
    emoji: '🎬',
    redeemedAt: new Date('2024-03-15').toISOString(),
  },
  {
    id: uuid(),
    coupleSpaceId: 'couple-ismael-gabriela',
    name: 'Spa day together',
    owner: 'user-gabriela',
    cost: 500,
    category: 'Wellness',
    emoji: '🧖',
    redeemedAt: null,
  },
]

// ─── Default Coin Transactions ────────────────────────────────────────────────
export const DEFAULT_COIN_TRANSACTIONS = [
  {
    id: uuid(),
    coupleSpaceId: 'couple-ismael-gabriela',
    userId: 'user-ismael',
    amount: 50,
    type: 'earned',
    reason: 'Completed: Morning walk at the park',
    createdAt: addDays(today, -3).toISOString(),
  },
  {
    id: uuid(),
    coupleSpaceId: 'couple-ismael-gabriela',
    userId: 'user-gabriela',
    amount: 80,
    type: 'earned',
    reason: 'Completed: Cook dinner together',
    createdAt: addDays(today, -2).toISOString(),
  },
  {
    id: uuid(),
    coupleSpaceId: 'couple-ismael-gabriela',
    userId: 'user-gabriela',
    amount: -80,
    type: 'redeemed',
    reason: 'Redeemed: Movie night of my choice',
    createdAt: new Date('2024-03-15').toISOString(),
  },
]

// ─── Default Game Attempts ────────────────────────────────────────────────────
export const DEFAULT_GAME_ATTEMPTS = []

// ─── Onboarding Steps ────────────────────────────────────────────────────────
// Text content lives in src/i18n/locales/*/translation.json under onboarding.steps
export const ONBOARDING_STEPS = [
  { id: 'welcome',    emoji: '💑', color: '#ff2d78' },
  { id: 'activities', emoji: '📅', color: '#00e5ff' },
  { id: 'coins',      emoji: '🪙', color: '#ffd700' },
  { id: 'rewards',    emoji: '🎁', color: '#b44fff' },
  { id: 'games',      emoji: '🎮', color: '#00ff88' },
]

export const REWARD_CATEGORIES = ['Wellness', 'Food', 'Fun', 'Entertainment', 'Travel', 'Other']

export const SPACE_TYPES = [
  { id: 'Couple',   emoji: '💑' },
  { id: 'Friends',  emoji: '👫' },
  { id: 'Family',   emoji: '👨‍👩‍👧' },
  { id: 'Travel',   emoji: '✈️' },
  { id: 'Personal', emoji: '🎯' },
  { id: 'Other',    emoji: '💫' },
]

export const EXPENSE_CATEGORIES = [
  { id: 'Food',          emoji: '🍽️' },
  { id: 'Transport',     emoji: '🚕' },
  { id: 'Accommodation', emoji: '🏨' },
  { id: 'Entertainment', emoji: '🎬' },
  { id: 'Shopping',      emoji: '🛍️' },
  { id: 'Travel',        emoji: '✈️' },
  { id: 'Health',        emoji: '🩺' },
  { id: 'Gifts',         emoji: '🎁' },
  { id: 'Home',          emoji: '🏠' },
  { id: 'Other',         emoji: '✨' },
]

export const AVATAR_EMOJIS = [
  '🧔', '👩', '🧑', '👨', '🧒', '🦱',
  '🧙', '🦸', '🧜', '🧝', '🦊', '🐼',
  '🌸', '⭐', '🌙', '🔥', '💎', '🚀',
  '🎭', '🦋',
]
