/**
 * DuoLife Data Service
 *
 * Architecture: All data access goes through this service layer.
 * Currently uses localStorage as the backend.
 * To connect Supabase later: replace each function body with Supabase calls.
 * The component API stays identical.
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
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const load = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
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

// ─── Initialize seed data on first load ──────────────────────────────────────
export const initializeData = () => {
  if (!localStorage.getItem(KEYS.COUPLE_SPACE)) {
    save(KEYS.COUPLE_SPACE, DEFAULT_COUPLE_SPACE)
  }
  if (!localStorage.getItem(KEYS.USERS)) {
    save(KEYS.USERS, DEFAULT_USERS)
  }
  if (!localStorage.getItem(KEYS.ACTIVITIES)) {
    save(KEYS.ACTIVITIES, DEFAULT_ACTIVITIES)
  }
  if (!localStorage.getItem(KEYS.REWARDS)) {
    save(KEYS.REWARDS, DEFAULT_REWARDS)
  }
  if (!localStorage.getItem(KEYS.COIN_TRANSACTIONS)) {
    save(KEYS.COIN_TRANSACTIONS, DEFAULT_COIN_TRANSACTIONS)
  }
  if (!localStorage.getItem(KEYS.GAME_ATTEMPTS)) {
    save(KEYS.GAME_ATTEMPTS, DEFAULT_GAME_ATTEMPTS)
  }
}

// ─── Couple Space ─────────────────────────────────────────────────────────────
export const getCoupleSpace = () => load(KEYS.COUPLE_SPACE, DEFAULT_COUPLE_SPACE)

export const updateCoupleSpace = (updates) => {
  const current = getCoupleSpace()
  const updated = { ...current, ...updates }
  save(KEYS.COUPLE_SPACE, updated)
  return updated
}

// ─── Users ────────────────────────────────────────────────────────────────────
export const getUsers = () => load(KEYS.USERS, DEFAULT_USERS)

export const getUserById = (id) => getUsers().find((u) => u.id === id)

export const updateUserCoins = (userId, delta) => {
  const users = getUsers()
  const updated = users.map((u) =>
    u.id === userId ? { ...u, coins: Math.max(0, u.coins + delta) } : u
  )
  save(KEYS.USERS, updated)
  return updated
}

// ─── Activities ───────────────────────────────────────────────────────────────
export const getActivities = () => load(KEYS.ACTIVITIES, DEFAULT_ACTIVITIES)

export const getActivitiesByDate = (date) =>
  getActivities().filter((a) => a.date === date)

export const createActivity = (activity) => {
  const activities = getActivities()
  const updated = [activity, ...activities]
  save(KEYS.ACTIVITIES, updated)
  return activity
}

export const updateActivity = (id, updates) => {
  const activities = getActivities()
  const updated = activities.map((a) => (a.id === id ? { ...a, ...updates } : a))
  save(KEYS.ACTIVITIES, updated)
  return updated.find((a) => a.id === id)
}

export const completeActivity = (activityId) => {
  const activities = getActivities()
  const activity = activities.find((a) => a.id === activityId)
  if (!activity || activity.status !== 'pending') return null

  // Update activity status
  updateActivity(activityId, {
    status: 'completed',
    completedAt: new Date().toISOString(),
  })

  // Add coins to assigned user
  updateUserCoins(activity.assignedTo, activity.coinReward)

  // Create coin transaction
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

export const cancelActivity = (activityId) => {
  return updateActivity(activityId, { status: 'cancelled' })
}

export const deleteActivity = (activityId) => {
  const activities = getActivities().filter((a) => a.id !== activityId)
  save(KEYS.ACTIVITIES, activities)
}

// ─── Rewards ──────────────────────────────────────────────────────────────────
export const getRewards = () => load(KEYS.REWARDS, DEFAULT_REWARDS)

export const createReward = (reward) => {
  const rewards = getRewards()
  const updated = [reward, ...rewards]
  save(KEYS.REWARDS, updated)
  return reward
}

export const redeemReward = (rewardId, userId) => {
  const rewards = getRewards()
  const reward = rewards.find((r) => r.id === rewardId)
  if (!reward || reward.redeemedAt) return { success: false, reason: 'already_redeemed' }

  const user = getUserById(userId)
  if (!user || user.coins < reward.cost) {
    return { success: false, reason: 'not_enough_coins' }
  }

  // Deduct coins
  updateUserCoins(userId, -reward.cost)

  // Mark reward as redeemed
  const updated = rewards.map((r) =>
    r.id === rewardId ? { ...r, redeemedAt: new Date().toISOString() } : r
  )
  save(KEYS.REWARDS, updated)

  // Create coin transaction
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
  const rewards = getRewards().filter((r) => r.id !== rewardId)
  save(KEYS.REWARDS, rewards)
}

// ─── Coin Transactions ────────────────────────────────────────────────────────
export const getCoinTransactions = () =>
  load(KEYS.COIN_TRANSACTIONS, DEFAULT_COIN_TRANSACTIONS)

export const addCoinTransaction = (transaction) => {
  const transactions = getCoinTransactions()
  save(KEYS.COIN_TRANSACTIONS, [transaction, ...transactions])
  return transaction
}

// ─── Game Attempts ────────────────────────────────────────────────────────────
export const getGameAttempts = () =>
  load(KEYS.GAME_ATTEMPTS, DEFAULT_GAME_ATTEMPTS)

// ─── Expenses ─────────────────────────────────────────────────────────────────
export const getExpenses = () => load(KEYS.EXPENSES, [])

export const createExpense = (expense) => {
  const expenses = getExpenses()
  save(KEYS.EXPENSES, [expense, ...expenses])
  return expense
}

export const markDebtPaid = (expenseId, debtId) => {
  const expenses = getExpenses()
  const updated = expenses.map((e) => {
    if (e.id !== expenseId) return e
    return { ...e, debts: e.debts.map((d) => (d.id === debtId ? { ...d, status: 'paid' } : d)) }
  })
  save(KEYS.EXPENSES, updated)
}

export const deleteExpense = (expenseId) => {
  const expenses = getExpenses().filter((e) => e.id !== expenseId)
  save(KEYS.EXPENSES, expenses)
}

// ─── Onboarding ───────────────────────────────────────────────────────────────
export const isOnboardingDone = () => {
  return localStorage.getItem(KEYS.ONBOARDING) === 'true'
}

export const markOnboardingDone = () => {
  localStorage.setItem(KEYS.ONBOARDING, 'true')
}

// ─── Dashboard Stats ──────────────────────────────────────────────────────────
export const getDashboardStats = () => {
  const activities = getActivities()
  const rewards = getRewards()
  const users = getUsers()
  const transactions = getCoinTransactions()

  return {
    users,
    completedActivities: activities.filter((a) => a.status === 'completed').length,
    pendingActivities: activities.filter((a) => a.status === 'pending').length,
    cancelledActivities: activities.filter((a) => a.status === 'cancelled').length,
    redeemedRewards: rewards.filter((r) => r.redeemedAt).length,
    totalCoinsEarned: transactions
      .filter((t) => t.type === 'earned')
      .reduce((sum, t) => sum + t.amount, 0),
    recentTransactions: transactions.slice(0, 10),
  }
}
