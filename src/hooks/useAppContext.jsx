import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import * as db from '../lib/dataService'
import { SPACE_TYPES } from '../data/mockData'

const AppContext = createContext(null)

const USER_COLORS = ['#00e5ff', '#ff2d78', '#00ff88', '#b44fff', '#ffd700', '#ff8c00']

export const AppProvider = ({ children }) => {
  const [spaces, setSpaces] = useState([])
  const [currentSpaceId, setCurrentSpaceId] = useState(null)
  const [myProfile, setMyProfile] = useState(null)
  const [setupDone, setSetupDone] = useState(false)
  const [users, setUsers] = useState([])
  const [activities, setActivities] = useState([])
  const [rewards, setRewards] = useState([])
  const [coinTransactions, setCoinTransactions] = useState([])
  const [stats, setStats] = useState(null)
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(() => {
    const allSpaces = db.getSpaces()
    const spaceId = db.getCurrentSpaceId()
    const profile = db.getMyProfile()
    const done = db.isSetupDone()

    setSpaces(allSpaces)
    setCurrentSpaceId(spaceId)
    setMyProfile(profile)
    setSetupDone(done)

    if (spaceId) {
      const spaceActivities = db.getActivities().filter(a => a.coupleSpaceId === spaceId)
      const spaceRewards = db.getRewards().filter(r => r.coupleSpaceId === spaceId)
      const spaceTxns = db.getCoinTransactions().filter(t => t.coupleSpaceId === spaceId)
      const spaceExpenses = db.getExpenses().filter(e => e.coupleSpaceId === spaceId)

      setUsers(db.getUsers().filter(u => u.coupleSpaceId === spaceId))
      setActivities(spaceActivities)
      setRewards(spaceRewards)
      setCoinTransactions(spaceTxns)
      setExpenses(spaceExpenses)
      setStats(db.getDashboardStats(spaceActivities, spaceRewards, spaceTxns))
    } else {
      setUsers([])
      setActivities([])
      setRewards([])
      setCoinTransactions([])
      setExpenses([])
      setStats(null)
    }
  }, [])

  useEffect(() => {
    db.initializeData()
    refresh()
    setLoading(false)
  }, [refresh])

  // ─── Computed ─────────────────────────────────────────────────────────────────
  const currentSpace = spaces.find(s => s.id === currentSpaceId) || null
  const coupleSpace = currentSpace // legacy alias used by existing modals

  // ─── Space Actions ────────────────────────────────────────────────────────────

  const switchSpace = (spaceId) => {
    db.setCurrentSpaceId(spaceId)
    refresh()
  }

  const createSpace = (spaceData, membersList) => {
    const typeEntry = SPACE_TYPES.find(t => t.id === spaceData.type)
    const space = {
      id: crypto.randomUUID(),
      name: spaceData.name,
      type: spaceData.type,
      emoji: typeEntry?.emoji || '💑',
      createdAt: new Date().toISOString(),
      inviteCode: `DUOLIFE-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
    }
    db.createSpace(space)
    db.setCurrentSpaceId(space.id)

    membersList.forEach((m, i) => {
      db.addUser({
        id: crypto.randomUUID(),
        coupleSpaceId: space.id,
        name: m.name,
        emoji: m.emoji,
        color: USER_COLORS[i % USER_COLORS.length],
        coins: 0,
        createdAt: new Date().toISOString(),
      })
    })

    refresh()
    return space
  }

  const updateSpace = (id, updates) => {
    const { members: memberUpdates, newMembers: newMembersList, ...spaceUpdates } = updates
    db.updateSpace(id, spaceUpdates)

    if (memberUpdates) {
      memberUpdates.forEach(m => {
        if (m.removed) {
          db.removeUser(m.id)
        } else if (m.id) {
          db.updateUser(m.id, { name: m.name, emoji: m.emoji })
        }
      })
    }

    if (newMembersList && newMembersList.length > 0) {
      const currentUsers = db.getUsers().filter(u => u.coupleSpaceId === id)
      newMembersList.forEach((m, i) => {
        db.addUser({
          id: crypto.randomUUID(),
          coupleSpaceId: id,
          name: m.name,
          emoji: m.emoji,
          color: USER_COLORS[(currentUsers.length + i) % USER_COLORS.length],
          coins: 0,
          createdAt: new Date().toISOString(),
        })
      })
    }

    refresh()
  }

  const deleteSpace = (spaceId) => {
    db.deleteSpace(spaceId)
    const remaining = db.getSpaces()
    if (remaining.length > 0) {
      db.setCurrentSpaceId(remaining[0].id)
    }
    refresh()
  }

  const completeSetup = (profile, spaceData, additionalMembers) => {
    const profileObj = {
      id: crypto.randomUUID(),
      name: profile.name,
      emoji: profile.emoji,
      language: profile.language,
    }
    db.saveMyProfile(profileObj)

    const membersList = [
      { name: profile.name, emoji: profile.emoji },
      ...additionalMembers,
    ]
    createSpace(spaceData, membersList)
    db.markSetupDone()
    refresh()
  }

  // ─── Activity Actions ──────────────────────────────────────────────────────────

  const createActivity = (activity) => { db.createActivity(activity); refresh() }
  const updateActivity = (id, updates) => { db.updateActivity(id, updates); refresh() }

  const completeActivity = (id) => {
    const result = db.completeActivity(id)
    refresh()
    return result
  }

  const cancelActivity = (id) => { db.cancelActivity(id); refresh() }
  const deleteActivity = (id) => { db.deleteActivity(id); refresh() }

  // ─── Reward Actions ───────────────────────────────────────────────────────────

  const createReward = (reward) => { db.createReward(reward); refresh() }

  const redeemReward = (rewardId, userId) => {
    const result = db.redeemReward(rewardId, userId)
    refresh()
    return result
  }

  const deleteReward = (id) => { db.deleteReward(id); refresh() }
  const getUserById = (id) => users.find(u => u.id === id)

  // ─── Expense Actions ───────────────────────────────────────────────────────────

  const createExpense = (expense) => { db.createExpense(expense); refresh() }

  const updateExpense = (expense) => { db.updateExpense(expense); refresh() }

  const markDebtPaid = (expenseId, debtId) => {
    db.markDebtPaid(expenseId, debtId)
    refresh()
  }

  const deleteExpense = (id) => { db.deleteExpense(id); refresh() }

  return (
    <AppContext.Provider
      value={{
        // Spaces
        spaces,
        currentSpaceId,
        currentSpace,
        coupleSpace,
        myProfile,
        setupDone,
        switchSpace,
        createSpace,
        updateSpace,
        deleteSpace,
        completeSetup,
        // Core state
        users,
        activities,
        rewards,
        coinTransactions,
        stats,
        expenses,
        loading,
        refresh,
        // Activity actions
        createActivity,
        updateActivity,
        completeActivity,
        cancelActivity,
        deleteActivity,
        // Reward actions
        createReward,
        redeemReward,
        deleteReward,
        getUserById,
        // Expense actions
        createExpense,
        updateExpense,
        markDebtPaid,
        deleteExpense,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
