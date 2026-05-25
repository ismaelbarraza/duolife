import React from 'react'
import { useTranslation } from 'react-i18next'

const GAMES = [
  { id: 'slot-machine', emoji: '🎰', color: '#ffd700' },
  { id: 'flip-cards',   emoji: '🃏', color: '#00e5ff' },
  { id: 'wheel',        emoji: '🎡', color: '#b44fff' },
  { id: 'trivia',       emoji: '💬', color: '#00ff88' },
]

export default function Games() {
  const { t } = useTranslation()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl text-white">{t('games.title')}</h1>
        <p className="text-white/40 font-body text-sm mt-1">{t('games.subtitle')}</p>
      </div>

      {/* Coming soon banner */}
      <div
        className="rounded-2xl p-5 text-center relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #1a0020 0%, #001a20 100%)',
          border: '1px solid rgba(180,79,255,0.2)',
        }}
      >
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 50%, rgba(180,79,255,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(0,229,255,0.3) 0%, transparent 50%)',
          }}
        />
        <div className="relative">
          <div className="text-5xl mb-3 animate-float inline-block">🎮</div>
          <h2 className="font-display text-xl text-white mb-1">{t('games.comingSoonBanner.title')}</h2>
          <p className="text-white/50 font-body text-sm">{t('games.comingSoonBanner.subtitle')}</p>
        </div>
      </div>

      {/* Game cards */}
      <div className="grid grid-cols-2 gap-3">
        {GAMES.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>

      {/* Placeholder stats */}
      <div
        className="rounded-xl p-4 text-center"
        style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.08)' }}
      >
        <p className="text-white/30 font-body text-sm">{t('games.historyPlaceholder')}</p>
      </div>
    </div>
  )
}

function GameCard({ game }) {
  const { t } = useTranslation()

  return (
    <div
      className="rounded-2xl p-4 flex flex-col gap-3 relative overflow-hidden cursor-not-allowed"
      style={{ background: `${game.color}08`, border: `1px solid ${game.color}20` }}
    >
      <div
        className="absolute top-2.5 right-2.5 text-[9px] font-mono uppercase tracking-widest px-1.5 py-0.5 rounded-full"
        style={{
          background: `${game.color}20`,
          border: `1px solid ${game.color}40`,
          color: game.color,
        }}
      >
        {t('common.soon')}
      </div>

      <div className="text-3xl" style={{ filter: `drop-shadow(0 0 12px ${game.color}60)` }}>
        {game.emoji}
      </div>

      <div>
        <h3 className="text-white/80 font-body font-semibold text-sm">
          {t(`games.items.${game.id}.name`)}
        </h3>
        <p className="text-white/35 font-body text-xs mt-0.5 leading-tight">
          {t(`games.items.${game.id}.description`)}
        </p>
      </div>

      <div className="w-full h-1 rounded-full bg-white/5 overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{
            width: `${Math.random() * 40 + 30}%`,
            background: `linear-gradient(90deg, ${game.color}80, ${game.color})`,
          }}
        />
      </div>
    </div>
  )
}
