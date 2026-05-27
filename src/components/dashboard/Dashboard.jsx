import React, { useState, useMemo } from 'react'
import { Plus, UserPlus, Zap, CheckCircle, Gift, TrendingUp, CalendarDays } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import { useApp } from '../../hooks/useAppContext'
import CoinBalance from '../ui/CoinBalance'
import ActivityCard from '../ui/ActivityCard'
import SpaceSwitcher from '../ui/SpaceSwitcher'
import CreateActivityModal from '../modals/CreateActivityModal'
import InviteModal from '../modals/InviteModal'

const FILTERS = ['today', 'week', 'month', 'all']

function todayStr() {
  return new Date().toISOString().split('T')[0]
}

function offsetDateStr(days) {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d.toISOString().split('T')[0]
}

export default function Dashboard() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { users, activities, coinTransactions, stats } = useApp()
  const [showCreateActivity, setShowCreateActivity] = useState(false)
  const [showInvite, setShowInvite] = useState(false)
  const [filter, setFilter] = useState('week')

  const recentTransactions = coinTransactions.slice(0, 6)

  const filterLabel = {
    today: t('dashboard.filters.today'),
    week:  t('dashboard.filters.week'),
    month: t('dashboard.filters.month'),
    all:   t('dashboard.filters.all'),
  }

  const emptyMsg = {
    today: t('dashboard.noActivitiesToday'),
    week:  t('dashboard.noActivitiesWeek'),
    month: t('dashboard.noActivitiesMonth'),
    all:   t('dashboard.noUpcoming'),
  }

  // ── Filter + group activities ─────────────────────────────────────────────────
  const groupedActivities = useMemo(() => {
    const today = todayStr()

    const now = new Date()
    const monthStart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1)
    const monthEnd = new Date(nextMonth - 1).toISOString().split('T')[0]

    const weekEnd = offsetDateStr(7)

    const filtered = activities.filter((a) => {
      if (a.status === 'cancelled') return false

      if (filter === 'today') {
        return a.date === today
      }
      if (filter === 'week') {
        return a.date >= today && a.date <= weekEnd
      }
      if (filter === 'month') {
        return a.date >= today && a.date >= monthStart && a.date <= monthEnd
      }
      // 'all' — all future (no upper bound), include past completed too
      return a.date >= today
    })

    const map = {}
    filtered.forEach((a) => {
      if (!map[a.date]) map[a.date] = []
      map[a.date].push(a)
    })

    // Sort within each day: startTime asc, no-time at end
    Object.values(map).forEach((list) => {
      list.sort((a, b) => {
        if (!a.startTime && !b.startTime) return 0
        if (!a.startTime) return 1
        if (!b.startTime) return -1
        return a.startTime.localeCompare(b.startTime)
      })
    })

    return Object.keys(map)
      .sort()
      .map((date) => ({ date, items: map[date] }))
  }, [activities, filter])

  const getDateHeader = (dateString) => {
    const today = todayStr()
    const tomorrow = offsetDateStr(1)
    const datePart = format(new Date(dateString + 'T12:00:00'), 'MMM d')
    if (dateString === today) return `${t('dashboard.today')} · ${datePart}`
    if (dateString === tomorrow) return `${t('dashboard.tomorrow')} · ${datePart}`
    return `${format(new Date(dateString + 'T12:00:00'), 'EEEE')} · ${datePart}`
  }

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
          {users.map((u) => (
            <CoinBalance key={u.id} user={u} size="md" />
          ))}
        </div>
      </div>

      {/* Stat cards */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard
            icon={<CheckCircle size={16} />}
            label={t('dashboard.stats.completed')}
            value={stats.completedActivities}
            bg="bg-emerald-50" iconBg="bg-emerald-100" iconColor="text-emerald-600"
          />
          <StatCard
            icon={<Zap size={16} />}
            label={t('dashboard.stats.pending')}
            value={stats.pendingActivities}
            bg="bg-amber-50" iconBg="bg-amber-100" iconColor="text-amber-600"
          />
          <StatCard
            icon={<Gift size={16} />}
            label={t('dashboard.stats.rewardsWon')}
            value={stats.redeemedRewards}
            bg="bg-violet-50" iconBg="bg-violet-100" iconColor="text-violet-600"
          />
          <StatCard
            icon={<TrendingUp size={16} />}
            label={t('dashboard.stats.coinsEarned')}
            value={`${stats.totalCoinsEarned} ✦`}
            bg="bg-rose-50" iconBg="bg-rose-100" iconColor="text-rose-500"
          />
        </div>
      )}

      {/* Upcoming plan + Coin history: stacked on mobile, side-by-side on desktop */}
      <div className="lg:flex lg:gap-6 lg:items-start">
        {/* Upcoming plan */}
        <div className="flex-1 min-w-0">
          {/* Section header + New button */}
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-body font-semibold text-base text-slate-800">
              {t('dashboard.upcomingPlan')}
            </h3>
            <button
              onClick={() => setShowCreateActivity(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-body font-medium btn-primary"
            >
              <Plus size={13} />
              {t('common.new')}
            </button>
          </div>

          {/* Filter chips */}
          <div className="flex gap-2 mb-4 flex-wrap">
            {FILTERS.map((f) => {
              const active = f === filter
              return (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className="px-3 py-1.5 rounded-full text-xs font-body font-medium transition-all"
                  style={{
                    background: active ? '#ede9fe' : '#ffffff',
                    border: `1px solid ${active ? '#c4b5fd' : '#e2e8f0'}`,
                    color: active ? '#6d28d9' : '#64748b',
                  }}
                >
                  {filterLabel[f]}
                </button>
              )
            })}
          </div>

          {groupedActivities.length > 0 ? (
            <div className="space-y-5">
              {groupedActivities.map(({ date, items }) => {
                const isToday = date === todayStr()
                return (
                  <div key={date}>
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className="text-xs font-body font-semibold px-2.5 py-1 rounded-full shrink-0"
                        style={{
                          background: isToday ? '#ede9fe' : '#f1f5f9',
                          color: isToday ? '#6d28d9' : '#475569',
                        }}
                      >
                        {getDateHeader(date)}
                      </span>
                      <div className="flex-1 h-px bg-slate-100" />
                    </div>

                    <div className="space-y-2">
                      {items.map((a) => (
                        <ActivityCard key={a.id} activity={a} />
                      ))}
                    </div>
                  </div>
                )
              })}

              <button
                onClick={() => navigate('/app/planner')}
                className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-2xl text-xs font-body font-medium text-slate-400 hover:text-violet-600 border border-dashed border-slate-200 hover:border-violet-200 transition-all"
              >
                <CalendarDays size={13} />
                {t('dashboard.viewInPlanner')}
              </button>
            </div>
          ) : (
            <EmptyState message={emptyMsg[filter]} />
          )}
        </div>

        {/* Coin transaction feed — sidebar on desktop */}
        {recentTransactions.length > 0 && (
          <div className="mt-6 lg:mt-0 lg:w-72 lg:shrink-0">
            <h3 className="font-body font-semibold text-base text-slate-800 mb-3">
              {t('dashboard.coinHistory')}
            </h3>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden divide-y divide-slate-50">
              {recentTransactions.map((tx) => (
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
      </div>

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

function EmptyState({ message }) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  return (
    <div className="text-center py-10 bg-white rounded-2xl border border-dashed border-slate-200">
      <div className="text-4xl mb-2">📅</div>
      <p className="text-slate-600 font-body font-medium text-base mb-1">{message}</p>
      <p className="text-slate-400 font-body text-xs mb-4">
        {t('dashboard.noUpcomingSubtitle')}
      </p>
      <button
        onClick={() => navigate('/app/planner')}
        className="text-xs font-body font-medium text-violet-500 hover:text-violet-700 transition-colors"
      >
        {t('dashboard.viewInPlanner')} →
      </button>
    </div>
  )
}
