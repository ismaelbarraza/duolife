import React, { useState } from 'react'
import { Plus, Lock, Check, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useApp } from '../../hooks/useAppContext'
import CreateRewardModal from '../modals/CreateRewardModal'
import CoinBalance from '../ui/CoinBalance'
import { format } from 'date-fns'
import { REWARD_CATEGORIES } from '../../data/mockData'

export default function Rewards() {
  const { t } = useTranslation()
  const { rewards, users, getUserById, redeemReward, deleteReward } = useApp()
  const [showCreate, setShowCreate] = useState(false)
  const [filterCategory, setFilterCategory] = useState('All')
  const [redeemingAs, setRedeemingAs] = useState(users[0]?.id || '')
  const [toast, setToast] = useState(null)

  const categories = ['All', ...REWARD_CATEGORIES]
  const available = rewards.filter((r) => !r.redeemedAt)
  const redeemed = rewards.filter((r) => r.redeemedAt)

  const filtered = available.filter(
    (r) => filterCategory === 'All' || r.category === filterCategory
  )

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 2500)
  }

  const handleRedeem = (reward) => {
    const currentUser = getUserById(redeemingAs)
    if (!currentUser) return

    if (reward.owner !== redeemingAs) {
      showToast(t('rewards.belongsTo', { name: getUserById(reward.owner)?.name }), 'error')
      return
    }

    const result = redeemReward(reward.id, redeemingAs)
    if (result.success) {
      showToast(t('rewards.redeemedToast', { name: reward.name }))
    } else {
      const msg =
        result.reason === 'already_redeemed'
          ? t('rewards.errors.alreadyRedeemed')
          : result.reason === 'not_enough_coins'
          ? t('rewards.errors.notEnoughCoins')
          : result.reason
      showToast(msg, 'error')
    }
  }

  return (
    <div className="space-y-5">
      {/* Toast */}
      {toast && (
        <div
          className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-xl text-sm font-body font-medium shadow-glass"
          style={{
            background: toast.type === 'error' ? 'rgba(255,45,120,0.9)' : 'rgba(0,255,136,0.9)',
            color: '#0a0a0f',
            minWidth: '200px',
            textAlign: 'center',
          }}
        >
          {toast.msg}
        </div>
      )}

      {/* Coin balances */}
      <div className="grid grid-cols-2 gap-2.5">
        {users.map((u) => (
          <CoinBalance key={u.id} user={u} size="md" />
        ))}
      </div>

      {/* Redeeming as selector */}
      <div
        className="rounded-xl p-3 flex items-center gap-3"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
      >
        <span className="text-white/40 text-xs font-body whitespace-nowrap">{t('rewards.redeemingAs')}</span>
        <div className="flex gap-2 flex-1">
          {users.map((u) => (
            <button
              key={u.id}
              onClick={() => setRedeemingAs(u.id)}
              className="flex-1 py-1.5 rounded-lg text-xs font-body font-medium transition-all"
              style={{
                background: redeemingAs === u.id ? `${u.color}25` : 'rgba(255,255,255,0.04)',
                border: `1px solid ${redeemingAs === u.id ? `${u.color}50` : 'rgba(255,255,255,0.08)'}`,
                color: redeemingAs === u.id ? u.color : 'rgba(255,255,255,0.5)',
              }}
            >
              {u.emoji} {u.name}
            </button>
          ))}
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl text-white">{t('rewards.title')}</h2>
        <button
          onClick={() => setShowCreate(true)}
          className="btn-primary flex items-center gap-1.5 text-xs px-3 py-2"
          style={{ background: '#b44fff', boxShadow: '0 0 20px rgba(180,79,255,0.4)' }}
        >
          <Plus size={13} />
          {t('rewards.newReward')}
        </button>
      </div>

      {/* Category filters */}
      <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className="px-3 py-1.5 rounded-full text-xs font-body whitespace-nowrap transition-all"
            style={{
              background: filterCategory === cat ? 'rgba(180,79,255,0.2)' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${filterCategory === cat ? 'rgba(180,79,255,0.5)' : 'rgba(255,255,255,0.08)'}`,
              color: filterCategory === cat ? '#b44fff' : 'rgba(255,255,255,0.45)',
            }}
          >
            {t(`rewards.categoryLabels.${cat}`, cat)}
          </button>
        ))}
      </div>

      {/* Reward cards */}
      {filtered.length > 0 ? (
        <div className="space-y-3">
          {filtered.map((reward) => (
            <RewardCard
              key={reward.id}
              reward={reward}
              redeemingAs={redeemingAs}
              getUserById={getUserById}
              onRedeem={handleRedeem}
              onDelete={deleteReward}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="text-4xl mb-2">🎁</div>
          <p className="text-white/40 font-body text-sm">{t('rewards.noRewardsInCategory')}</p>
        </div>
      )}

      {/* Redeemed section */}
      {redeemed.length > 0 && (
        <div>
          <h3 className="font-display text-sm text-white/40 mb-3 uppercase tracking-widest">
            {t('rewards.redeemed')}
          </h3>
          <div className="space-y-2">
            {redeemed.map((reward) => (
              <div
                key={reward.id}
                className="flex items-center gap-3 rounded-xl px-4 py-3 opacity-50"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                <span className="text-xl">{reward.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white/60 font-body line-through truncate">{reward.name}</p>
                  <p className="text-xs text-white/25 font-body">
                    {t('rewards.redeemedOn', { date: format(new Date(reward.redeemedAt), 'MMM d, yyyy') })}
                  </p>
                </div>
                <Check size={14} className="shrink-0" style={{ color: '#00ff88' }} />
              </div>
            ))}
          </div>
        </div>
      )}

      {showCreate && <CreateRewardModal onClose={() => setShowCreate(false)} />}
    </div>
  )
}

function RewardCard({ reward, redeemingAs, getUserById, onRedeem, onDelete }) {
  const { t } = useTranslation()
  const owner = getUserById(reward.owner)
  const redeemer = getUserById(redeemingAs)
  const isOwner = reward.owner === redeemingAs
  const canAfford = redeemer && redeemer.coins >= reward.cost

  return (
    <div
      className="rounded-xl p-4 relative overflow-hidden group"
      style={{ background: 'rgba(26,26,36,0.7)', border: `1px solid ${owner?.color}20` }}
    >
      <div
        className="absolute top-0 left-0 w-1 h-full rounded-l-xl"
        style={{ background: owner?.color }}
      />

      <div className="pl-3">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            <span className="text-2xl">{reward.emoji}</span>
            <div className="min-w-0">
              <h4 className="text-white/90 font-body font-medium text-sm leading-tight truncate">
                {reward.name}
              </h4>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs font-body" style={{ color: owner?.color }}>
                  {owner?.emoji} {owner?.name}
                </span>
                <span className="text-white/20 text-xs">·</span>
                <span className="text-white/35 text-xs font-body">
                  {t(`rewards.categoryLabels.${reward.category}`, reward.category)}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onDelete(reward.id)}
            className="opacity-0 group-hover:opacity-100 w-6 h-6 rounded-md bg-white/5 hover:bg-red-500/20 flex items-center justify-center transition-all shrink-0"
          >
            <Trash2 size={11} className="text-white/30" />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <span className="coin-badge">{reward.cost} 🪙</span>

          <button
            onClick={() => onRedeem(reward)}
            disabled={!isOwner || !canAfford}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-body font-medium transition-all"
            style={{
              background: !isOwner ? 'rgba(255,255,255,0.04)' : canAfford ? 'rgba(180,79,255,0.2)' : 'rgba(255,45,120,0.1)',
              border: `1px solid ${!isOwner ? 'rgba(255,255,255,0.08)' : canAfford ? 'rgba(180,79,255,0.4)' : 'rgba(255,45,120,0.3)'}`,
              color: !isOwner ? 'rgba(255,255,255,0.2)' : canAfford ? '#b44fff' : '#ff2d78',
              cursor: !isOwner || !canAfford ? 'not-allowed' : 'pointer',
            }}
          >
            {!isOwner ? (
              <><Lock size={11} />{t('rewards.notYours')}</>
            ) : !canAfford ? (
              <><Lock size={11} />{t('rewards.notEnough')}</>
            ) : (
              t('rewards.redeem')
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
