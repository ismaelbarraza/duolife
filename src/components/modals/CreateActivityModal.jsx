import React, { useState } from 'react'
import { X } from 'lucide-react'
import { v4 as uuid } from 'uuid'
import { useTranslation } from 'react-i18next'
import { useApp } from '../../hooks/useAppContext'

const COIN_PRESETS = [25, 50, 80, 100, 150, 200]

export default function CreateActivityModal({ date, onClose }) {
  const { t } = useTranslation()
  const { users, coupleSpace, createActivity } = useApp()
  const [form, setForm] = useState({
    title: '',
    description: '',
    assignedTo: users[0]?.id || '',
    coinReward: 50,
    date: date || new Date().toISOString().split('T')[0],
    createdBy: users[0]?.id || '',
  })
  const [error, setError] = useState('')

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const handleSubmit = () => {
    if (!form.title.trim()) return setError(t('modals.createActivity.errors.noTitle'))
    if (!form.assignedTo) return setError(t('modals.createActivity.errors.noAssignee'))
    if (!form.date) return setError(t('modals.createActivity.errors.noDate'))

    createActivity({
      id: uuid(),
      coupleSpaceId: coupleSpace.id,
      ...form,
      coinReward: Number(form.coinReward),
      status: 'pending',
      createdAt: new Date().toISOString(),
      completedAt: null,
    })
    onClose()
  }

  return (
    <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-card glass-strong rounded-2xl w-full max-w-md mx-auto overflow-hidden neon-border-pink">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/8">
          <div>
            <h2 className="font-display text-lg text-white">{t('modals.createActivity.title')}</h2>
            <p className="text-white/40 text-xs font-body mt-0.5">{t('modals.createActivity.subtitle')}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
          >
            <X size={15} className="text-white/60" />
          </button>
        </div>

        {/* Form */}
        <div className="p-5 space-y-4">
          {error && (
            <p className="text-neon-pink text-sm font-body bg-neon-pink/10 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <div>
            <label className="text-white/50 text-xs font-mono uppercase tracking-wider block mb-1.5">
              {t('modals.createActivity.labels.title')} *
            </label>
            <input
              className="input-field"
              placeholder={t('modals.createActivity.placeholders.title')}
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
            />
          </div>

          <div>
            <label className="text-white/50 text-xs font-mono uppercase tracking-wider block mb-1.5">
              {t('modals.createActivity.labels.description')}
            </label>
            <textarea
              className="input-field resize-none"
              rows={2}
              placeholder={t('modals.createActivity.placeholders.description')}
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-white/50 text-xs font-mono uppercase tracking-wider block mb-1.5">
                {t('modals.createActivity.labels.assignTo')}
              </label>
              <select
                className="input-field"
                value={form.assignedTo}
                onChange={(e) => set('assignedTo', e.target.value)}
              >
                {users.map((u) => (
                  <option key={u.id} value={u.id}>{u.emoji} {u.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-white/50 text-xs font-mono uppercase tracking-wider block mb-1.5">
                {t('modals.createActivity.labels.date')}
              </label>
              <input
                type="date"
                className="input-field"
                value={form.date}
                onChange={(e) => set('date', e.target.value)}
                style={{ colorScheme: 'dark' }}
              />
            </div>
          </div>

          <div>
            <label className="text-white/50 text-xs font-mono uppercase tracking-wider block mb-2">
              {t('modals.createActivity.labels.coinReward')}
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {COIN_PRESETS.map((c) => (
                <button
                  key={c}
                  onClick={() => set('coinReward', c)}
                  className="px-3 py-1.5 rounded-lg text-xs font-mono transition-all"
                  style={{
                    background: form.coinReward === c ? 'rgba(255,215,0,0.2)' : 'rgba(255,255,255,0.05)',
                    border: `1px solid ${form.coinReward === c ? 'rgba(255,215,0,0.5)' : 'rgba(255,255,255,0.1)'}`,
                    color: form.coinReward === c ? '#ffd700' : 'rgba(255,255,255,0.5)',
                  }}
                >
                  {c} 🪙
                </button>
              ))}
            </div>
            <input
              type="number"
              className="input-field"
              min={1}
              value={form.coinReward}
              onChange={(e) => set('coinReward', parseInt(e.target.value) || 0)}
              placeholder={t('modals.createActivity.placeholders.customAmount')}
            />
          </div>

          <div>
            <label className="text-white/50 text-xs font-mono uppercase tracking-wider block mb-1.5">
              {t('modals.createActivity.labels.createdBy')}
            </label>
            <select
              className="input-field"
              value={form.createdBy}
              onChange={(e) => set('createdBy', e.target.value)}
            >
              {users.map((u) => (
                <option key={u.id} value={u.id}>{u.emoji} {u.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-5 pt-0">
          <button onClick={onClose} className="btn-secondary flex-1">
            {t('common.cancel')}
          </button>
          <button onClick={handleSubmit} className="btn-primary flex-1">
            {t('modals.createActivity.submit')}
          </button>
        </div>
      </div>
    </div>
  )
}
