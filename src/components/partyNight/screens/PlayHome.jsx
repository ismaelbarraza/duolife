import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowLeft } from 'lucide-react'
import LanguageSwitcher from '../../ui/LanguageSwitcher'

export default function PlayHome() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const PARTY_GAMES = [
    {
      id: 'impostor',
      emoji: '🕵️',
      name: t('play.partyNight.impostor.name'),
      description: t('play.partyNight.impostor.description'),
      accentColor: '#5b21b6',
      bg: '#f5f3ff',
      border: '#ddd6fe',
      path: 'party/impostor',
      active: true,
    },
    {
      id: 'truth-or-dare',
      emoji: '❓',
      name: t('play.partyNight.truthOrDare.name'),
      description: t('play.partyNight.truthOrDare.description'),
      accentColor: '#be123c',
      bg: '#fff1f2',
      border: '#fecdd3',
      path: 'party/truth-or-dare',
      active: true,
    },
    {
      id: 'bottle',
      emoji: '🍾',
      name: t('play.partyNight.bottle.name'),
      description: t('play.partyNight.bottle.description'),
      accentColor: '#92400e',
      bg: '#fffbeb',
      border: '#fde68a',
      path: 'party/bottle',
      active: true,
    },
    {
      id: 'dice',
      emoji: '🎲',
      name: t('play.partyNight.dice.name'),
      description: t('play.partyNight.dice.description'),
      accentColor: '#065f46',
      bg: '#f0fdf4',
      border: '#86efac',
      path: 'party/dice',
      active: true,
    },
    {
      id: 'guess',
      emoji: '🤔',
      name: t('play.partyNight.guess.name'),
      description: t('play.comingSoon'),
      accentColor: '#94a3b8',
      bg: '#f8fafc',
      border: '#e2e8f0',
      path: null,
      active: false,
    },
  ]

  return (
    <div
      className="min-h-screen flex flex-col overflow-x-hidden"
      style={{ background: 'linear-gradient(135deg, #fff7ed 0%, #fdf2f8 50%, #f5f3ff 100%)' }}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 pt-8 max-w-lg sm:max-w-2xl lg:max-w-4xl mx-auto w-full">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 text-sm font-body font-medium text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft size={16} />
          {t('play.backToHome')}
        </button>
        <LanguageSwitcher />
      </div>

      {/* Hero */}
      <div className="px-5 pt-8 pb-4 max-w-lg sm:max-w-2xl lg:max-w-4xl mx-auto w-full">
        <div className="text-5xl mb-3">🎉</div>
        <h1 className="font-body font-bold text-3xl text-slate-900 tracking-tight">
          {t('play.title')}
        </h1>
        <p className="text-slate-500 font-body text-sm mt-1">
          {t('play.subtitle')}
        </p>
      </div>

      {/* PartyNight label */}
      <div className="px-5 max-w-lg sm:max-w-2xl lg:max-w-4xl mx-auto w-full mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-body font-semibold uppercase tracking-widest text-slate-400">PartyNight</span>
          <div className="flex-1 h-px bg-slate-200" />
        </div>
      </div>

      {/* Game cards */}
      <div className="px-5 max-w-lg sm:max-w-2xl lg:max-w-4xl mx-auto w-full pb-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {PARTY_GAMES.map((game) =>
            game.active ? (
              <button
                key={game.id}
                onClick={() => navigate(game.path)}
                className="rounded-2xl p-4 flex flex-col gap-3 border text-left transition-all duration-200 hover:scale-[1.03] hover:shadow-md active:scale-[0.97]"
                style={{
                  background: game.bg,
                  borderColor: game.border,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                }}
              >
                <div className="text-3xl">{game.emoji}</div>
                <div>
                  <h3 className="font-body font-semibold text-sm leading-tight" style={{ color: game.accentColor }}>
                    {game.name}
                  </h3>
                  <p className="text-slate-400 font-body text-xs mt-0.5 leading-tight">
                    {game.description}
                  </p>
                </div>
              </button>
            ) : (
              <div
                key={game.id}
                className="rounded-2xl p-4 flex flex-col gap-3 border relative"
                style={{
                  background: game.bg,
                  borderColor: game.border,
                  opacity: 0.55,
                }}
              >
                <div
                  className="absolute top-2.5 right-2.5 text-[9px] font-body font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full bg-white/80 border border-slate-200 text-slate-400"
                >
                  {t('play.comingSoon')}
                </div>
                <div className="text-3xl">{game.emoji}</div>
                <div>
                  <h3 className="font-body font-semibold text-sm text-slate-400 leading-tight">
                    {game.name}
                  </h3>
                  <p className="text-slate-300 font-body text-xs mt-0.5 leading-tight">
                    {game.description}
                  </p>
                </div>
              </div>
            )
          )}
        </div>
      </div>

      <div className="flex-1" />
      <div className="pb-10 text-center">
        <p className="text-slate-300 font-body text-[11px]">DuoLife Play · PartyNight</p>
      </div>
    </div>
  )
}
