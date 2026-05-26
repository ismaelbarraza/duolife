import React from 'react'
import { useTranslation } from 'react-i18next'

const GAMES = [
  { id: 'slot-machine', emoji: '🎰', color: '#f59e0b', bg: '#fffbeb', border: '#fde68a' },
  { id: 'flip-cards',   emoji: '🃏', color: '#6366f1', bg: '#eef2ff', border: '#c7d2fe' },
  { id: 'wheel',        emoji: '🎡', color: '#8b5cf6', bg: '#f5f3ff', border: '#ddd6fe' },
  { id: 'trivia',       emoji: '💬', color: '#10b981', bg: '#ecfdf5', border: '#a7f3d0' },
]

export default function Games() {
  const { t } = useTranslation()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-body font-bold text-2xl text-slate-900">{t('games.title')}</h1>
        <p className="text-slate-500 font-body text-sm mt-1">{t('games.subtitle')}</p>
      </div>

      {/* Coming soon banner */}
      <div className="rounded-3xl p-5 text-center bg-gradient-to-br from-violet-50 via-rose-50 to-amber-50 border border-violet-100">
        <div className="text-5xl mb-3 animate-float inline-block">🎮</div>
        <h2 className="font-body font-bold text-xl text-slate-900 mb-1">{t('games.comingSoonBanner.title')}</h2>
        <p className="text-slate-500 font-body text-sm">{t('games.comingSoonBanner.subtitle')}</p>
      </div>

      {/* Game cards */}
      <div className="grid grid-cols-2 gap-3">
        {GAMES.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>

      {/* Placeholder stats */}
      <div className="rounded-2xl p-4 text-center bg-white border border-dashed border-slate-200">
        <p className="text-slate-400 font-body text-sm">{t('games.historyPlaceholder')}</p>
      </div>
    </div>
  )
}

function GameCard({ game }) {
  const { t } = useTranslation()

  return (
    <div
      className="rounded-2xl p-4 flex flex-col gap-3 relative overflow-hidden cursor-not-allowed border"
      style={{ background: game.bg, borderColor: game.border }}
    >
      <div
        className="absolute top-2.5 right-2.5 text-[9px] font-body font-medium uppercase tracking-widest px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 border border-slate-200"
      >
        {t('common.soon')}
      </div>

      <div className="text-3xl">{game.emoji}</div>

      <div>
        <h3 className="text-slate-700 font-body font-semibold text-sm">
          {t(`games.items.${game.id}.name`)}
        </h3>
        <p className="text-slate-400 font-body text-xs mt-0.5 leading-tight">
          {t(`games.items.${game.id}.description`)}
        </p>
      </div>

      <div className="w-full h-1.5 rounded-full bg-white overflow-hidden">
        <div
          className="h-full rounded-full opacity-40"
          style={{
            width: `${Math.random() * 40 + 30}%`,
            background: game.color,
          }}
        />
      </div>
    </div>
  )
}
