import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import * as db from '../lib/dataService'

const AppContext = createContext(null)

export const AppProvider = ({ children }) => {
  const [coupleSpace, setCoupleSpace] = useState(null)
  const [users, setUsers] = useState([])
  const [activities, setActivities] = useState([])
  const [rewards, setRewards] = useState([])
  const [coinTransactions, setCoinTransactions] = useState([])
  const [stats, setStats] = useState(null)
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(() => {
    setCoupleSpace(db.getCoupleSpace())
    setUsers(db.getUsers())
    setActivities(db.getActivities())
    setRewards(db.getRewards())
    setCoinTransactions(db.getCoinTransactions())
    setStats(db.getDashboardStats())
    setExpenses(db.getExpenses())
  }, [])

  useEffect(() => {
    db.initializeData()
    refresh()
    setLoading(false)
  }, [refresh])

  // ─── Actions ───────────────────────────────────────────────────────────────

  const createActivity = (activity) => {
    db.createActivity(activity)
    refresh()
  }

  const completeActivity = (id) => {
    const result = db.completeActivity(id)
    refresh()
    return result
  }

  const cancelActivity = (id) => {
    db.cancelActivity(id)
    refresh()
  }

  const deleteActivity = (id) => {
    db.deleteActivity(id)
    refresh()
  }

  const createReward = (reward) => {
    db.createReward(reward)
    refresh()
  }

  const redeemReward = (rewardId, userId) => {
    const result = db.redeemReward(rewardId, userId)
    refresh()
    return result
  }

  const deleteReward = (id) => {
    db.deleteReward(id)
    refresh()
  }

  const getUserById = (id) => users.find((u) => u.id === id)

  const createExpense = (expense) => {
    db.createExpense(expense)
    refresh()
  }

  const markDebtPaid = (expenseId, debtId) => {
    db.markDebtPaid(expenseId, debtId)
    refresh()
  }

  const deleteExpense = (id) => {
    db.deleteExpense(id)
    refresh()
  }

  return (
    <AppContext.Provider
      value={{
        coupleSpace,
        users,
        activities,
        rewards,
        coinTransactions,
        stats,
        expenses,
        loading,
        refresh,
        createActivity,
        completeActivity,
        cancelActivity,
        deleteActivity,
        createReward,
        redeemReward,
        deleteReward,
        getUserById,
        createExpense,
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
