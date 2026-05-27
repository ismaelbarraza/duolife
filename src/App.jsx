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
import ProductSelector from './components/landing/ProductSelector'
import PlayHub from './components/play/PlayHub'
import { isOnboardingDone } from './lib/dataService'
import { useNavigate } from 'react-router-dom'

// ── DuoLife app shell (lives under /app/*) ────────────────────────────────────
function AppShell() {
  const { setupDone, loading, currentSpace } = useApp()
  const navigate = useNavigate()
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

  const bgImage = currentSpace?.backgroundImage

  return (
    <div className="min-h-screen bg-[#f8f7ff] overflow-x-hidden">
      {bgImage && (
        <div
          aria-hidden
          className="fixed inset-0 pointer-events-none overflow-hidden"
          style={{
            backgroundImage: `url(${bgImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(24px) saturate(0.5) brightness(1.2)',
            opacity: 0.15,
            transform: 'scale(1.1)',
            zIndex: 0,
          }}
        />
      )}
      <main
        className="relative max-w-lg sm:max-w-2xl lg:max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-28"
        style={{ minHeight: '100svh', zIndex: 1 }}
      >
        {/* Logo strip — clicking returns to product selector */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 hover:opacity-70 transition-opacity"
            aria-label="Back to home"
          >
            <span className="text-xl">♾</span>
            <span className="font-body font-bold text-lg text-slate-900 tracking-tight">DuoLife</span>
          </button>
          <LanguageSwitcher />
        </div>

        <Routes>
          <Route index element={<Dashboard />} />
          <Route path="planner" element={<Planner />} />
          <Route path="expenses" element={<Expenses />} />
          <Route path="rewards" element={<Rewards />} />
          <Route path="games" element={<Games />} />
        </Routes>
      </main>

      <BottomNav />

      {showSetup && <SetupModal onClose={() => setShowSetup(false)} />}
      {!showSetup && showOnboarding && (
        <OnboardingModal onClose={() => setShowOnboarding(false)} />
      )}
    </div>
  )
}

// ── Root app ──────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Product selector landing */}
        <Route path="/" element={<ProductSelector />} />

        {/* DuoLife Play hub */}
        <Route path="/play/*" element={<PlayHub />} />

        {/* DuoLife planner app — AppProvider only mounts here */}
        <Route
          path="/app/*"
          element={
            <AppProvider>
              <AppShell />
            </AppProvider>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}
