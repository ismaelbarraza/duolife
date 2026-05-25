import React from 'react'
import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Calendar, Gift, Gamepad2, Receipt } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export default function BottomNav() {
  const { t } = useTranslation()

  const NAV_ITEMS = [
    { to: '/', icon: LayoutDashboard, label: t('nav.home') },
    { to: '/planner', icon: Calendar, label: t('nav.planner') },
    { to: '/expenses', icon: Receipt, label: t('nav.expenses') },
    { to: '/rewards', icon: Gift, label: t('nav.rewards') },
    { to: '/games', icon: Gamepad2, label: t('nav.games') },
  ]

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 glass-strong border-t border-white/5"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex items-center justify-around max-w-lg mx-auto px-1">
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 py-3 px-2 flex-1 transition-all duration-200 ${
                isActive ? 'nav-active' : 'text-white/35 hover:text-white/60'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className="relative">
                  <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
                  {isActive && (
                    <div
                      className="absolute -inset-1.5 rounded-full opacity-20"
                      style={{ background: '#ff2d78' }}
                    />
                  )}
                </div>
                <span
                  className="text-[10px] font-body font-medium tracking-wide"
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
