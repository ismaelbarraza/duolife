/**
 * DuoLife Data Service
 *
 * Architecture: All data access goes through this service layer.
 * Currently uses localStorage as the backend.
 * To connect Supabase later: replace each function body with Supabase calls.
 */

import {
  DEFAULT_COUPLE_SPACE,
  DEFAULT_USERS,
  DEFAULT_ACTIVITIES,
  DEFAULT_REWARDS,
  DEFAULT_COIN_TRANSACTIONS,
  DEFAULT_GAME_ATTEMPTS,
} from '../data/mockData'

// ─── Storage Keys ─────────────────────────────────────────────────────────────
const KEYS = {
  COUPLE_SPACE: 'dl_couple_space',
  USERS: 'dl_users',
  ACTIVITIES: 'dl_activities',
  REWARDS: 'dl_rewards',
  COIN_TRANSACTIONS: 'dl_coin_transactions',
  GAME_ATTEMPTS: 'dl_game_attempts',
  ONBOARDING: 'dl_onboarding_done',
  EXPENSES: 'dl_expenses',
  // Multi-space keys
  SPACES: 'dl_spaces',
  CURRENT_SPACE_ID: 'dl_current_space_id',
  MY_PROFILE: 'dl_my_profile',
  SETUP_DONE: 'dl_setup_done',
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const load = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key)
    return raw !== null ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

const save = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

// ─── Migration: old couple space → spaces array ───────────────────────────────
export const migrateToSpaces = () => {
  if (localStorage.getItem(KEYS.SPACES)) return // already migrated

  const oldSpace = load(KEYS.COUPLE_SPACE, null)
  if (!oldSpace) return // fresh install — setup flow handles

  const space = {
    id: oldSpace.id,
    name: oldSpace.name,
    type: 'Couple',
    emoji: oldSpace.emoji || '💑',
    createdAt: oldSpace.createdAt,
    inviteCode: oldSpace.inviteCode,
  }
  save(KEYS.SPACES, [space])
  save(KEYS.CURRENT_SPACE_ID, space.id)

  // Stamp coupleSpaceId on expenses that may not have it
  const expenses = load(KEYS.EXPENSES, [])
  if (expenses.length > 0) {
    save(KEYS.EXPENSES, expenses.map(e => ({ ...e, coupleSpaceId: e.coupleSpaceId || space.id })))
  }

  // Create myProfile from first user
  const users = load(KEYS.USERS, [])
  if (users.length > 0) {
    const u = users[0]
    save(KEYS.MY_PROFILE, {
      id: u.id,
      name: u.name,
      emoji: u.emoji,
      language: localStorage.getItem('dl_language') || 'en',
    })
  }

  localStorage.setItem(KEYS.SETUP_DONE, 'true')
}

// ─── Initialize ───────────────────────────────────────────────────────────────
export const initializeData = () => {
  migrateToSpaces()
  // New users go through setup flow — no default seeding
}

// ─── Setup ────────────────────────────────────────────────────────────────────
export const isSetupDone = () => localStorage.getItem(KEYS.SETUP_DONE) === 'true'
export const markSetupDone = () => localStorage.setItem(KEYS.SETUP_DONE, 'true')

// ─── My Profile ───────────────────────────────────────────────────────────────
export const getMyProfile = () => load(KEYS.MY_PROFILE, null)
export const saveMyProfile = (profile) => save(KEYS.MY_PROFILE, profile)

// ─── Spaces ───────────────────────────────────────────────────────────────────
export const getSpaces = () => load(KEYS.SPACES, [])

export const getCurrentSpaceId = () => load(KEYS.CURRENT_SPACE_ID, null)

export const setCurrentSpaceId = (id) => save(KEYS.CURRENT_SPACE_ID, id)

export const createSpace = (space) => {
  const spaces = getSpaces()
  save(KEYS.SPACES, [...spaces, space])
  return space
}

export const updateSpace = (id, updates) => {
  const spaces = getSpaces()
  const updated = spaces.map(s => s.id === id ? { ...s, ...updates } : s)
  save(KEYS.SPACES, updated)
  return updated.find(s => s.id === id)
}

export const deleteSpace = (spaceId) => {
  save(KEYS.SPACES, getSpaces().filter(s => s.id !== spaceId))
  save(KEYS.USERS, getUsers().filter(u => u.coupleSpaceId !== spaceId))
  save(KEYS.ACTIVITIES, getActivities().filter(a => a.coupleSpaceId !== spaceId))
  save(KEYS.REWARDS, getRewards().filter(r => r.coupleSpaceId !== spaceId))
  save(KEYS.EXPENSES, getExpenses().filter(e => e.coupleSpaceId !== spaceId))
  save(KEYS.COIN_TRANSACTIONS, getCoinTransactions().filter(t => t.coupleSpaceId !== spaceId))
}

// ─── Couple Space (legacy alias — returns current space) ──────────────────────
export const getCoupleSpace = () => {
  const spaceId = getCurrentSpaceId()
  const spaces = getSpaces()
  return spaces.find(s => s.id === spaceId) || spaces[0] || load(KEYS.COUPLE_SPACE, DEFAULT_COUPLE_SPACE)
}

export const updateCoupleSpace = (updates) => {
  const spaceId = getCurrentSpaceId()
  if (spaceId) return updateSpace(spaceId, updates)
  const current = load(KEYS.COUPLE_SPACE, DEFAULT_COUPLE_SPACE)
  const updated = { ...current, ...updates }
  save(KEYS.COUPLE_SPACE, updated)
  return updated
}

// ─── Users ────────────────────────────────────────────────────────────────────
export const getUsers = () => load(KEYS.USERS, DEFAULT_USERS)

export const getUserById = (id) => getUsers().find(u => u.id === id)

export const addUser = (user) => {
  save(KEYS.USERS, [...getUsers(), user])
  return user
}

export const updateUser = (id, updates) => {
  save(KEYS.USERS, getUsers().map(u => u.id === id ? { ...u, ...updates } : u))
}

export const removeUser = (userId) => {
  save(KEYS.USERS, getUsers().filter(u => u.id !== userId))
}

export const updateUserCoins = (userId, delta) => {
  const updated = getUsers().map(u =>
    u.id === userId ? { ...u, coins: Math.max(0, u.coins + delta) } : u
  )
  save(KEYS.USERS, updated)
  return updated
}

// ─── Activities ───────────────────────────────────────────────────────────────
export const getActivities = () => load(KEYS.ACTIVITIES, DEFAULT_ACTIVITIES)

export const getActivitiesByDate = (date) =>
  getActivities().filter(a => a.date === date)

export const createActivity = (activity) => {
  save(KEYS.ACTIVITIES, [activity, ...getActivities()])
  return activity
}

export const updateActivity = (id, updates) => {
  const activities = getActivities()
  const updated = activities.map(a => a.id === id ? { ...a, ...updates } : a)
  save(KEYS.ACTIVITIES, updated)
  return updated.find(a => a.id === id)
}

export const completeActivity = (activityId) => {
  const activity = getActivities().find(a => a.id === activityId)
  if (!activity || activity.status !== 'pending') return null

  updateActivity(activityId, {
    status: 'completed',
    completedAt: new Date().toISOString(),
  })
  updateUserCoins(activity.assignedTo, activity.coinReward)
  addCoinTransaction({
    id: crypto.randomUUID(),
    coupleSpaceId: activity.coupleSpaceId,
    userId: activity.assignedTo,
    amount: activity.coinReward,
    type: 'earned',
    reason: `Completed: ${activity.title}`,
    createdAt: new Date().toISOString(),
  })
  return activity
}

export const cancelActivity = (activityId) =>
  updateActivity(activityId, { status: 'cancelled' })

export const deleteActivity = (activityId) => {
  save(KEYS.ACTIVITIES, getActivities().filter(a => a.id !== activityId))
}

// ─── Rewards ──────────────────────────────────────────────────────────────────
export const getRewards = () => load(KEYS.REWARDS, DEFAULT_REWARDS)

export const createReward = (reward) => {
  save(KEYS.REWARDS, [reward, ...getRewards()])
  return reward
}

export const redeemReward = (rewardId, userId) => {
  const reward = getRewards().find(r => r.id === rewardId)
  if (!reward || reward.redeemedAt) return { success: false, reason: 'already_redeemed' }

  const user = getUserById(userId)
  if (!user || user.coins < reward.cost) return { success: false, reason: 'not_enough_coins' }

  updateUserCoins(userId, -reward.cost)
  save(KEYS.REWARDS, getRewards().map(r =>
    r.id === rewardId ? { ...r, redeemedAt: new Date().toISOString() } : r
  ))
  addCoinTransaction({
    id: crypto.randomUUID(),
    coupleSpaceId: reward.coupleSpaceId,
    userId,
    amount: -reward.cost,
    type: 'redeemed',
    reason: `Redeemed: ${reward.name}`,
    createdAt: new Date().toISOString(),
  })
  return { success: true }
}

export const deleteReward = (rewardId) => {
  save(KEYS.REWARDS, getRewards().filter(r => r.id !== rewardId))
}

// ─── Coin Transactions ────────────────────────────────────────────────────────
export const getCoinTransactions = () =>
  load(KEYS.COIN_TRANSACTIONS, DEFAULT_COIN_TRANSACTIONS)

export const addCoinTransaction = (transaction) => {
  save(KEYS.COIN_TRANSACTIONS, [transaction, ...getCoinTransactions()])
  return transaction
}

// ─── Game Attempts ────────────────────────────────────────────────────────────
export const getGameAttempts = () =>
  load(KEYS.GAME_ATTEMPTS, DEFAULT_GAME_ATTEMPTS)

// ─── Expenses ─────────────────────────────────────────────────────────────────
export const getExpenses = () => load(KEYS.EXPENSES, [])

export const createExpense = (expense) => {
  save(KEYS.EXPENSES, [expense, ...getExpenses()])
  return expense
}

export const markDebtPaid = (expenseId, debtId) => {
  save(KEYS.EXPENSES, getExpenses().map(e => {
    if (e.id !== expenseId) return e
    return { ...e, debts: e.debts.map(d => d.id === debtId ? { ...d, status: 'paid' } : d) }
  }))
}

export const updateExpense = (expense) => {
  save(KEYS.EXPENSES, getExpenses().map(e => e.id === expense.id ? expense : e))
}

export const deleteExpense = (expenseId) => {
  save(KEYS.EXPENSES, getExpenses().filter(e => e.id !== expenseId))
}

// ─── Onboarding ───────────────────────────────────────────────────────────────
export const isOnboardingDone = () => localStorage.getItem(KEYS.ONBOARDING) === 'true'
export const markOnboardingDone = () => localStorage.setItem(KEYS.ONBOARDING, 'true')

// ─── Dashboard Stats ──────────────────────────────────────────────────────────
export const getDashboardStats = (activities, rewards, transactions) => ({
  completedActivities: activities.filter(a => a.status === 'completed').length,
  pendingActivities: activities.filter(a => a.status === 'pending').length,
  cancelledActivities: activities.filter(a => a.status === 'cancelled').length,
  redeemedRewards: rewards.filter(r => r.redeemedAt).length,
  totalCoinsEarned: transactions
    .filter(t => t.type === 'earned')
    .reduce((sum, t) => sum + t.amount, 0),
  recentTransactions: transactions.slice(0, 10),
})
