import React, { useState } from 'react'
import { X } from 'lucide-react'
import { v4 as uuid } from 'uuid'
import { useTranslation } from 'react-i18next'
import { useApp } from '../../hooks/useAppContext'
import { REWARD_CATEGORIES } from '../../data/mockData'

const EMOJI_OPTIONS = ['🎁', '💆', '🍽️', '🎬', '✈️', '🛋️', '🎮', '🧖', '💅', '🎂', '🌹', '🍷']

export default function CreateRewardModal({ onClose }) {
  const { t } = useTranslation()
  const { users, coupleSpace, createReward } = useApp()
  const [form, setForm] = useState({
    name: '',
    owner: users[0]?.id || '',
    cost: 100,
    category: 'Fun',
    emoji: '🎁',
  })
  const [error, setError] = useState('')

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const handleSubmit = () => {
    if (!form.name.trim()) return setError(t('modals.createReward.errors.noName'))

    createReward({
      id: uuid(),
      coupleSpaceId: coupleSpace.id,
      ...form,
      cost: Number(form.cost),
      redeemedAt: null,
    })
    onClose()
  }

  return (
    <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div
        className="modal-card glass-strong rounded-2xl w-full max-w-md mx-auto overflow-hidden"
        style={{ borderColor: '#b44fff40', border: '1px solid #b44fff40' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/8">
          <div>
            <h2 className="font-display text-lg text-white">{t('modals.createReward.title')}</h2>
            <p className="text-white/40 text-xs font-body mt-0.5">{t('modals.createReward.subtitle')}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center"
          >
            <X size={15} className="text-white/60" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {error && (
            <p className="text-neon-pink text-sm font-body bg-neon-pink/10 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          {/* Emoji picker */}
          <div>
            <label className="text-white/50 text-xs font-mono uppercase tracking-wider block mb-2">
              {t('modals.createReward.labels.icon')}
            </label>
            <div className="flex flex-wrap gap-2">
              {EMOJI_OPTIONS.map((e) => (
                <button
                  key={e}
                  onClick={() => set('emoji', e)}
                  className="w-9 h-9 rounded-lg text-xl flex items-center justify-center transition-all"
                  style={{
                    background: form.emoji === e ? 'rgba(180,79,255,0.2)' : 'rgba(255,255,255,0.05)',
                    border: `1px solid ${form.emoji === e ? 'rgba(180,79,255,0.5)' : 'rgba(255,255,255,0.1)'}`,
                    transform: form.emoji === e ? 'scale(1.15)' : 'scale(1)',
                  }}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-white/50 text-xs font-mono uppercase tracking-wider block mb-1.5">
              {t('modals.createReward.labels.name')} *
            </label>
            <input
              className="input-field"
              placeholder={t('modals.createReward.placeholders.name')}
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-white/50 text-xs font-mono uppercase tracking-wider block mb-1.5">
                {t('modals.createReward.labels.owner')}
              </label>
              <select
                className="input-field"
                value={form.owner}
                onChange={(e) => set('owner', e.target.value)}
              >
                {users.map((u) => (
                  <option key={u.id} value={u.id}>{u.emoji} {u.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-white/50 text-xs font-mono uppercase tracking-wider block mb-1.5">
                {t('modals.createReward.labels.category')}
              </label>
              <select
                className="input-field"
                value={form.category}
                onChange={(e) => set('category', e.target.value)}
              >
                {REWARD_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {t(`rewards.categoryLabels.${c}`, c)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-white/50 text-xs font-mono uppercase tracking-wider block mb-1.5">
              {t('modals.createReward.labels.cost')}
            </label>
            <input
              type="number"
              className="input-field"
              min={1}
              value={form.cost}
              onChange={(e) => set('cost', parseInt(e.target.value) || 0)}
            />
          </div>
        </div>

        <div className="flex gap-3 p-5 pt-0">
          <button onClick={onClose} className="btn-secondary flex-1">
            {t('common.cancel')}
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 py-2.5 rounded-xl font-body font-medium text-sm text-white transition-all"
            style={{ background: '#b44fff', boxShadow: '0 0 20px rgba(180,79,255,0.4)' }}
          >
            {t('modals.createReward.submit')}
          </button>
        </div>
      </div>
    </div>
  )
}
