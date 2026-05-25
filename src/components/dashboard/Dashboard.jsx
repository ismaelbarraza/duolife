import React, { useState } from 'react'
import { Plus, UserPlus, Zap, CheckCircle, XCircle, Gift, TrendingUp } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useApp } from '../../hooks/useAppContext'
import CoinBalance from '../ui/CoinBalance'
import ActivityCard from '../ui/ActivityCard'
import CreateActivityModal from '../modals/CreateActivityModal'
import InviteModal from '../modals/InviteModal'
import { format } from 'date-fns'

export default function Dashboard() {
  const { t } = useTranslation()
  const { users, activities, coinTransactions, stats, coupleSpace } = useApp()
  const [showCreateActivity, setShowCreateActivity] = useState(false)
  const [showInvite, setShowInvite] = useState(false)

  const recentActivities = activities
    .filter((a) => a.status !== 'cancelled')
    .slice(0, 5)

  const recentTransactions = coinTransactions.slice(0, 6)

  return (
    <div className="space-y-6">
      {/* Header band */}
      <div
        className="rounded-2xl p-5 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #1a0a1a 0%, #0a1020 100%)',
          border: '1px solid rgba(255,45,120,0.15)',
        }}
      >
        <div
          className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-20 blur-2xl"
          style={{ background: '#ff2d78' }}
        />
        <div
          className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full opacity-20 blur-2xl"
          style={{ background: '#00e5ff' }}
        />

        <div className="relative">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-lg">♾</span>
                <span className="text-white/40 text-xs font-mono tracking-widest uppercase">DuoLife</span>
              </div>
              <h2 className="font-display text-xl text-white">{coupleSpace?.name}</h2>
            </div>
            <button
              onClick={() => setShowInvite(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-body font-medium text-neon-cyan transition-all hover:scale-105"
              style={{ background: 'rgba(0,229,255,0.1)', border: '1px solid rgba(0,229,255,0.2)' }}
            >
              <UserPlus size={13} />
              {t('dashboard.invite')}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {users.map((u) => (
              <CoinBalance key={u.id} user={u} size="md" />
            ))}
          </div>
        </div>
      </div>

      {/* Stat cards */}
      {stats && (
        <div className="grid grid-cols-2 gap-3">
          <StatCard icon={<CheckCircle size={16} />} label={t('dashboard.stats.completed')} value={stats.completedActivities} color="#00ff88" />
          <StatCard icon={<Zap size={16} />} label={t('dashboard.stats.pending')} value={stats.pendingActivities} color="#ffd700" />
          <StatCard icon={<Gift size={16} />} label={t('dashboard.stats.rewardsWon')} value={stats.redeemedRewards} color="#b44fff" />
          <StatCard icon={<TrendingUp size={16} />} label={t('dashboard.stats.coinsEarned')} value={`${stats.totalCoinsEarned} 🪙`} color="#00e5ff" />
        </div>
      )}

      {/* Recent activities */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display text-base text-white/80">{t('dashboard.recentActivities')}</h3>
          <button
            onClick={() => setShowCreateActivity(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-body font-medium btn-primary"
          >
            <Plus size={13} />
            {t('common.new')}
          </button>
        </div>

        {recentActivities.length > 0 ? (
          <div className="space-y-2.5">
            {recentActivities.map((a) => (
              <ActivityCard key={a.id} activity={a} showDate />
            ))}
          </div>
        ) : (
          <EmptyState
            emoji="📅"
            title={t('dashboard.empty.title')}
            subtitle={t('dashboard.empty.subtitle')}
          />
        )}
      </div>

      {/* Coin transaction feed */}
      {recentTransactions.length > 0 && (
        <div>
          <h3 className="font-display text-base text-white/80 mb-3">{t('dashboard.coinHistory')}</h3>
          <div className="glass rounded-xl overflow-hidden divide-y divide-white/5">
            {recentTransactions.map((t_) => (
              <div key={t_.id} className="flex items-center justify-between px-4 py-3">
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-white/60 font-body truncate">{t_.reason}</p>
                  <p className="text-[10px] text-white/25 font-mono mt-0.5">
                    {format(new Date(t_.createdAt), 'MMM d, HH:mm')}
                  </p>
                </div>
                <span
                  className="font-mono text-sm font-medium ml-3"
                  style={{ color: t_.amount > 0 ? '#00ff88' : '#ff2d78' }}
                >
                  {t_.amount > 0 ? '+' : ''}{t_.amount} 🪙
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {showCreateActivity && (
        <CreateActivityModal onClose={() => setShowCreateActivity(false)} />
      )}
      {showInvite && <InviteModal onClose={() => setShowInvite(false)} />}
    </div>
  )
}

function StatCard({ icon, label, value, color }) {
  return (
    <div
      className="rounded-xl p-4 flex flex-col gap-2"
      style={{ background: `${color}0a`, border: `1px solid ${color}1a` }}
    >
      <div style={{ color }} className="opacity-70">{icon}</div>
      <div>
        <p className="font-mono font-semibold text-lg text-white leading-none">{value}</p>
        <p className="text-white/40 text-xs font-body mt-0.5">{label}</p>
      </div>
    </div>
  )
}

function EmptyState({ emoji, title, subtitle }) {
  return (
    <div className="text-center py-8">
      <div className="text-4xl mb-2">{emoji}</div>
      <p className="text-white/60 font-display text-base mb-1">{title}</p>
      <p className="text-white/30 font-body text-xs">{subtitle}</p>
    </div>
  )
}
