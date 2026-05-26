import React, { useState } from 'react'
import { Plus, UserPlus, Zap, CheckCircle, XCircle, Gift, TrendingUp } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useApp } from '../../hooks/useAppContext'
import CoinBalance from '../ui/CoinBalance'
import ActivityCard from '../ui/ActivityCard'
import SpaceSwitcher from '../ui/SpaceSwitcher'
import CreateActivityModal from '../modals/CreateActivityModal'
import InviteModal from '../modals/InviteModal'
import { format } from 'date-fns'

export default function Dashboard() {
  const { t } = useTranslation()
  const { users, activities, coinTransactions, stats } = useApp()
  const [showCreateActivity, setShowCreateActivity] = useState(false)
  const [showInvite, setShowInvite] = useState(false)

  const recentActivities = activities
    .filter(a => a.status !== 'cancelled')
    .slice(0, 5)

  const recentTransactions = coinTransactions.slice(0, 6)

  return (
    <div className="space-y-6">
      {/* Header band */}
      <div className="rounded-3xl p-5 bg-gradient-to-br from-violet-50 to-rose-50 border border-violet-100">
        <div className="flex items-center justify-between mb-4">
          <SpaceSwitcher />
          <button
            onClick={() => setShowInvite(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-body font-medium bg-white border border-teal-200 text-teal-600 shadow-sm hover:shadow-md transition-all"
          >
            <UserPlus size={13} />
            {t('dashboard.invite')}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {users.map(u => (
            <CoinBalance key={u.id} user={u} size="md" />
          ))}
        </div>
      </div>

      {/* Stat cards */}
      {stats && (
        <div className="grid grid-cols-2 gap-3">
          <StatCard
            icon={<CheckCircle size={16} />}
            label={t('dashboard.stats.completed')}
            value={stats.completedActivities}
            bg="bg-emerald-50"
            iconBg="bg-emerald-100"
            iconColor="text-emerald-600"
          />
          <StatCard
            icon={<Zap size={16} />}
            label={t('dashboard.stats.pending')}
            value={stats.pendingActivities}
            bg="bg-amber-50"
            iconBg="bg-amber-100"
            iconColor="text-amber-600"
          />
          <StatCard
            icon={<Gift size={16} />}
            label={t('dashboard.stats.rewardsWon')}
            value={stats.redeemedRewards}
            bg="bg-violet-50"
            iconBg="bg-violet-100"
            iconColor="text-violet-600"
          />
          <StatCard
            icon={<TrendingUp size={16} />}
            label={t('dashboard.stats.coinsEarned')}
            value={`${stats.totalCoinsEarned} ✦`}
            bg="bg-rose-50"
            iconBg="bg-rose-100"
            iconColor="text-rose-500"
          />
        </div>
      )}

      {/* Recent activities */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-body font-semibold text-base text-slate-800">{t('dashboard.recentActivities')}</h3>
          <button
            onClick={() => setShowCreateActivity(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-body font-medium btn-primary"
          >
            <Plus size={13} />
            {t('common.new')}
          </button>
        </div>

        {recentActivities.length > 0 ? (
          <div className="space-y-2.5">
            {recentActivities.map(a => (
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
          <h3 className="font-body font-semibold text-base text-slate-800 mb-3">{t('dashboard.coinHistory')}</h3>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden divide-y divide-slate-50">
            {recentTransactions.map(tx => (
              <div key={tx.id} className="flex items-center justify-between px-4 py-3">
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-600 font-body truncate">{tx.reason}</p>
                  <p className="text-[10px] text-slate-400 font-body mt-0.5">
                    {format(new Date(tx.createdAt), 'MMM d, HH:mm')}
                  </p>
                </div>
                <span
                  className="font-body text-sm font-semibold ml-3"
                  style={{ color: tx.amount > 0 ? '#059669' : '#e11d48' }}
                >
                  {tx.amount > 0 ? '+' : ''}{tx.amount} ✦
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

function StatCard({ icon, label, value, bg, iconBg, iconColor }) {
  return (
    <div className={`${bg} rounded-2xl p-4 flex items-center gap-3 border border-white`}>
      <div className={`${iconBg} ${iconColor} w-9 h-9 rounded-full flex items-center justify-center shrink-0`}>
        {icon}
      </div>
      <div>
        <p className="font-body font-bold text-lg text-slate-800 leading-none">{value}</p>
        <p className="text-slate-500 text-xs font-body mt-0.5">{label}</p>
      </div>
    </div>
  )
}

function EmptyState({ emoji, title, subtitle }) {
  return (
    <div className="text-center py-8 bg-white rounded-2xl border border-dashed border-slate-200">
      <div className="text-4xl mb-2">{emoji}</div>
      <p className="text-slate-600 font-body font-medium text-base mb-1">{title}</p>
      <p className="text-slate-400 font-body text-xs">{subtitle}</p>
    </div>
  )
}
