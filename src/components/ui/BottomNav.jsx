import React from 'react'
import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Calendar, Gift, Gamepad2, Receipt } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export default function BottomNav() {
  const { t } = useTranslation()

  const NAV_ITEMS = [
    { to: '/app', icon: LayoutDashboard, label: t('nav.home'), end: true },
    { to: '/app/planner', icon: Calendar, label: t('nav.planner'), end: false },
    { to: '/app/expenses', icon: Receipt, label: t('nav.expenses'), end: false },
    { to: '/app/rewards', icon: Gift, label: t('nav.rewards'), end: false },
    { to: '/app/games', icon: Gamepad2, label: t('nav.games'), end: false },
  ]

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-sm border-t border-slate-100"
      style={{
        paddingBottom: 'env(safe-area-inset-bottom)',
        boxShadow: '0 -2px 12px rgba(0,0,0,0.06)',
      }}
    >
      <div className="flex items-center justify-around max-w-lg sm:max-w-2xl lg:max-w-4xl mx-auto px-1">
        {NAV_ITEMS.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 py-3 sm:py-4 lg:py-5 px-2 flex-1 transition-all duration-200 ${
                isActive ? 'nav-active' : 'text-slate-400 hover:text-slate-500'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className="relative sm:scale-[1.18] sm:origin-center transition-transform">
                  <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
                  {isActive && (
                    <div className="absolute -inset-1.5 rounded-full bg-violet-100 opacity-60 -z-10" />
                  )}
                </div>
                <span
                  className="text-[10px] sm:text-[11.5px] font-body font-medium tracking-wide"
                  style={{ lineHeight: 1 }}
                >
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
