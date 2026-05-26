import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppProvider, useApp } from './hooks/useAppContext'
import BottomNav from './components/ui/BottomNav'
import LanguageSwitcher from './components/ui/LanguageSwitcher'
import OnboardingModal from './components/modals/OnboardingModal'
import SetupModal from './components/modals/SetupModal'
import Dashboard from './components/dashboard/Dashboard'
import Planner from './components/planner/Planner'
import Rewards from './components/rewards/Rewards'
import Games from './components/games/Games'
import Expenses from './components/expenses/Expenses'
import { isOnboardingDone } from './lib/dataService'

function AppShell() {
  const { setupDone, loading } = useApp()
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [showSetup, setShowSetup] = useState(false)

  useEffect(() => {
    if (loading) return
    if (!setupDone) {
      setShowSetup(true)
      return
    }
    if (!isOnboardingDone()) {
      const timer = setTimeout(() => setShowOnboarding(true), 600)
      return () => clearTimeout(timer)
    }
  }, [setupDone, loading])

  return (
    <div className="min-h-screen bg-[#f8f7ff]">
      {/* Scrollable content area */}
      <main
        className="relative max-w-lg mx-auto px-4 pt-6 pb-28"
        style={{ minHeight: '100svh' }}
      >
        {/* Logo strip */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="text-xl">♾</span>
            <span className="font-body font-bold text-lg text-slate-900 tracking-tight">DuoLife</span>
          </div>
          <LanguageSwitcher />
        </div>

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/planner" element={<Planner />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/rewards" element={<Rewards />} />
          <Route path="/games" element={<Games />} />
        </Routes>
      </main>

      <BottomNav />

      {showSetup && (
        <SetupModal onClose={() => setShowSetup(false)} />
      )}

      {!showSetup && showOnboarding && (
        <OnboardingModal onClose={() => setShowOnboarding(false)} />
      )}
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>
    </AppProvider>
  )
}
