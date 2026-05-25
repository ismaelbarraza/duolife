import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AppProvider } from './hooks/useAppContext'
import { isOnboardingDone } from './lib/dataService'
import BottomNav from './components/ui/BottomNav'
import LanguageSwitcher from './components/ui/LanguageSwitcher'
import OnboardingModal from './components/modals/OnboardingModal'
import Dashboard from './components/dashboard/Dashboard'
import Planner from './components/planner/Planner'
import Rewards from './components/rewards/Rewards'
import Games from './components/games/Games'
import Expenses from './components/expenses/Expenses'

// Page titles
const PAGE_TITLES = {
  '/': null, // Dashboard handles its own header
  '/planner': { title: 'Planner', sub: 'Your shared calendar' },
  '/rewards': null,
  '/games': null,
}

function AppShell() {
  const [showOnboarding, setShowOnboarding] = useState(false)
  const location = useLocation()

  useEffect(() => {
    if (!isOnboardingDone()) {
      const timer = setTimeout(() => setShowOnboarding(true), 600)
      return () => clearTimeout(timer)
    }
  }, [])

  return (
    <div className="min-h-screen bg-bg-900">
      {/* Background texture */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(ellipse at 20% 0%, rgba(255,45,120,0.06) 0%, transparent 60%),
            radial-gradient(ellipse at 80% 100%, rgba(0,229,255,0.06) 0%, transparent 60%)`,
          zIndex: 0,
        }}
      />

      {/* Scrollable content area */}
      <main
        className="relative z-10 max-w-lg mx-auto px-4 pt-6 pb-28"
        style={{ minHeight: '100svh' }}
      >
        {/* Logo strip */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span
              className="text-xl"
              style={{ filter: 'drop-shadow(0 0 8px rgba(255,45,120,0.6))' }}
            >
              ♾
            </span>
            <span className="font-display text-lg text-white tracking-wide">DuoLife</span>
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

      {showOnboarding && (
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
