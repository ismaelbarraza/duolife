import React, { useState } from 'react'
import { X } from 'lucide-react'
import { v4 as uuid } from 'uuid'
import { useTranslation } from 'react-i18next'
import { useApp } from '../../hooks/useAppContext'
import TimePicker24 from '../ui/TimePicker24'

const COIN_PRESETS = [10, 25, 35, 50]
const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/

// activity prop = null → create mode; activity object → edit mode
export default function CreateActivityModal({ date, activity = null, onClose }) {
  const { t } = useTranslation()
  const { users, coupleSpace, createActivity, updateActivity } = useApp()
  const isEdit = !!activity

  // Backward compat: old activities may have assignedTo (single id) instead of assignedMemberIds
  const defaultAssignees = activity
    ? (activity.assignedMemberIds?.length
        ? activity.assignedMemberIds
        : activity.assignedTo ? [activity.assignedTo] : [])
    : [users[0]?.id].filter(Boolean)

  const [form, setForm] = useState({
    title:             activity?.title       || '',
    description:       activity?.description || '',
    assignedMemberIds: defaultAssignees,
    coinReward:        activity?.coinReward  ?? 25,
    date:              activity?.date        || date || new Date().toISOString().split('T')[0],
    startTime:         activity?.startTime   || '',
    endTime:           activity?.endTime     || '',
    location:          activity?.location    || '',
    createdBy:         activity?.createdBy   || users[0]?.id || '',
  })
  const [error, setError] = useState('')

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const toggleAssignee = (userId) => {
    setForm((f) => {
      const already = f.assignedMemberIds.includes(userId)
      if (already && f.assignedMemberIds.length === 1) return f // must keep at least one
      return {
        ...f,
        assignedMemberIds: already
          ? f.assignedMemberIds.filter((id) => id !== userId)
          : [...f.assignedMemberIds, userId],
      }
    })
  }

  const handleSubmit = () => {
    if (!form.title.trim()) return setError(t('modals.createActivity.errors.noTitle'))
    if (form.assignedMemberIds.length === 0) return setError(t('modals.createActivity.errors.noAssignee'))
    if (!form.date) return setError(t('modals.createActivity.errors.noDate'))
    if (form.startTime && !TIME_RE.test(form.startTime))
      return setError(t('modals.createActivity.errors.invalidTime'))
    if (form.endTime && !TIME_RE.test(form.endTime))
      return setError(t('modals.createActivity.errors.invalidTime'))

    if (isEdit) {
      updateActivity(activity.id, {
        ...form,
        coinReward: Number(form.coinReward),
        updatedAt: new Date().toISOString(),
      })
    } else {
      createActivity({
        id: uuid(),
        coupleSpaceId: coupleSpace.id,
        ...form,
        coinReward: Number(form.coinReward),
        status: 'pending',
        createdAt: new Date().toISOString(),
        completedAt: null,
      })
    }
    onClose()
  }

  return (
    <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div
        className="modal-card bg-white rounded-3xl w-full max-w-md mx-auto overflow-hidden shadow-xl border border-slate-100"
        style={{ maxHeight: '90svh', overflowY: 'auto' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <div>
            <h2 className="font-body font-bold text-lg text-slate-900">
              {isEdit ? t('modals.createActivity.editTitle') : t('modals.createActivity.title')}
            </h2>
            <p className="text-slate-400 text-xs font-body mt-0.5">
              {isEdit ? t('modals.createActivity.editSubtitle') : t('modals.createActivity.subtitle')}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
          >
            <X size={15} className="text-slate-500" />
          </button>
        </div>

        {/* Form */}
        <div className="p-5 space-y-4">
          {error && (
            <p className="text-rose-600 text-sm font-body bg-rose-50 border border-rose-100 rounded-xl px-3 py-2">
              {error}
            </p>
          )}

          {/* Title */}
          <div>
            <label className="text-slate-500 text-xs font-body font-medium uppercase tracking-wider block mb-1.5">
              {t('modals.createActivity.labels.title')} *
            </label>
            <input
              className="input-field"
              placeholder={t('modals.createActivity.placeholders.title')}
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-slate-500 text-xs font-body font-medium uppercase tracking-wider block mb-1.5">
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

          {/* Assign to (multi-select chips) */}
          <div>
            <label className="text-slate-500 text-xs font-body font-medium uppercase tracking-wider block mb-2">
              {t('modals.createActivity.labels.assignTo')} *
            </label>
            <div className="flex flex-wrap gap-2">
              {users.map((u) => {
                const active = form.assignedMemberIds.includes(u.id)
                return (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => toggleAssignee(u.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-body font-medium transition-all"
                    style={{
                      background: active ? `${u.color}18` : '#f8fafc',
                      border: `1px solid ${active ? `${u.color}50` : '#f1f5f9'}`,
                      color: active ? u.color : '#94a3b8',
                    }}
                  >
                    <span>{u.emoji}</span>
                    <span>{u.name}</span>
                    {active && <span style={{ fontSize: 10, opacity: 0.8 }}>✓</span>}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="text-slate-500 text-xs font-body font-medium uppercase tracking-wider block mb-1.5">
              {t('modals.createActivity.labels.date')}
            </label>
            <input
              type="date"
              className="input-field"
              value={form.date}
              onChange={(e) => set('date', e.target.value)}
            />
          </div>

          {/* Times */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-500 text-xs font-body font-medium uppercase tracking-wider block mb-1.5">
                {t('modals.createActivity.labels.startTime')}
              </label>
              <TimePicker24
                value={form.startTime}
                onChange={(v) => set('startTime', v)}
              />
            </div>
            <div>
              <label className="text-slate-500 text-xs font-body font-medium uppercase tracking-wider block mb-1.5">
                {t('modals.createActivity.labels.endTime')}
              </label>
              <TimePicker24
                value={form.endTime}
                onChange={(v) => set('endTime', v)}
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="text-slate-500 text-xs font-body font-medium uppercase tracking-wider block mb-1.5">
              {t('modals.createActivity.labels.location')}
            </label>
            <input
              className="input-field"
              placeholder={t('modals.createActivity.placeholders.location')}
              value={form.location}
              onChange={(e) => set('location', e.target.value)}
            />
          </div>

          {/* Point reward */}
          <div>
            <label className="text-slate-500 text-xs font-body font-medium uppercase tracking-wider block mb-2">
              {t('modals.createActivity.labels.coinReward')}
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {COIN_PRESETS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => set('coinReward', c)}
                  className="px-3 py-1.5 rounded-full text-xs font-body font-medium transition-all"
                  style={{
                    background: form.coinReward === c ? '#fef3c7' : '#f8fafc',
                    border: `1px solid ${form.coinReward === c ? '#fde68a' : '#f1f5f9'}`,
                    color: form.coinReward === c ? '#b45309' : '#94a3b8',
                  }}
                >
                  {c} ✦
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

          {/* Created by */}
          <div>
            <label className="text-slate-500 text-xs font-body font-medium uppercase tracking-wider block mb-1.5">
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
            {isEdit ? t('modals.createActivity.editSubmit') : t('modals.createActivity.submit')}
          </button>
        </div>
      </div>
    </div>
  )
}
