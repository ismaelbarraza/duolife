import React, { useState } from 'react'
import { X } from 'lucide-react'
import { v4 as uuid } from 'uuid'
import { useTranslation } from 'react-i18next'
import { useApp } from '../../hooks/useAppContext'
import { EXPENSE_CATEGORIES } from '../../data/mockData'

const CURRENCIES = [
  { code: 'PEN', symbol: 'S/' },
  { code: 'USD', symbol: '$' },
  { code: 'EUR', symbol: '€' },
  { code: 'GBP', symbol: '£' },
]

// expense prop = null → create mode; expense object → edit mode
export default function CreateExpenseModal({ expense = null, onClose }) {
  const { t } = useTranslation()
  const { users, coupleSpace, createExpense, updateExpense } = useApp()
  const isEdit = !!expense

  const today = new Date().toISOString().split('T')[0]
  const [form, setForm] = useState({
    title:        expense?.title        || '',
    amount:       expense?.amount?.toString() || '',
    currency:     expense?.currency     || 'PEN',
    category:     expense?.category     || '',
    paidBy:       expense?.paidBy       || users[0]?.id || '',
    participants: expense?.participants || users.map((u) => u.id),
    date:         expense?.date         || today,
    note:         expense?.note         || '',
  })
  const [error, setError] = useState('')

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const toggleParticipant = (userId) => {
    setForm((f) => {
      const already = f.participants.includes(userId)
      if (already && f.participants.length === 1) return f
      return {
        ...f,
        participants: already
          ? f.participants.filter((id) => id !== userId)
          : [...f.participants, userId],
      }
    })
  }

  const handleSubmit = () => {
    if (!form.title.trim()) return setError(t('modals.createExpense.errors.noTitle'))
    const amount = parseFloat(form.amount)
    if (!amount || amount <= 0) return setError(t('modals.createExpense.errors.noAmount'))
    if (!form.category) return setError(t('modals.createExpense.errors.noCategory'))
    if (!form.paidBy) return setError(t('modals.createExpense.errors.noPaidBy'))
    if (form.participants.length === 0) return setError(t('modals.createExpense.errors.noParticipants'))
    if (!form.date) return setError(t('modals.createExpense.errors.noDate'))

    const share = amount / form.participants.length
    const debts = form.participants
      .filter((id) => id !== form.paidBy)
      .map((id) => ({
        id: uuid(),
        fromUserId: id,
        toUserId: form.paidBy,
        amount: share,
        status: 'pending',
      }))

    if (isEdit) {
      updateExpense({
        ...expense,
        title: form.title.trim(),
        amount,
        currency: form.currency,
        category: form.category,
        paidBy: form.paidBy,
        participants: form.participants,
        date: form.date,
        note: form.note.trim(),
        debts,
        updatedAt: new Date().toISOString(),
      })
    } else {
      createExpense({
        id: uuid(),
        coupleSpaceId: coupleSpace.id,
        title: form.title.trim(),
        amount,
        currency: form.currency,
        category: form.category,
        paidBy: form.paidBy,
        participants: form.participants,
        date: form.date,
        note: form.note.trim(),
        debts,
        createdAt: new Date().toISOString(),
      })
    }
    onClose()
  }

  const activeCurrency = CURRENCIES.find((c) => c.code === form.currency)

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
              {isEdit ? t('modals.createExpense.editTitle') : t('modals.createExpense.title')}
            </h2>
            <p className="text-slate-400 text-xs font-body mt-0.5">
              {isEdit ? t('modals.createExpense.editSubtitle') : t('modals.createExpense.subtitle')}
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
              {t('modals.createExpense.labels.title')} *
            </label>
            <input
              className="input-field"
              placeholder={t('modals.createExpense.placeholders.title')}
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
            />
          </div>

          {/* Category */}
          <div>
            <label className="text-slate-500 text-xs font-body font-medium uppercase tracking-wider block mb-2">
              {t('modals.createExpense.labels.category')} *
            </label>
            <div className="flex flex-wrap gap-2">
              {EXPENSE_CATEGORIES.map((cat) => {
                const active = form.category === cat.id
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => set('category', cat.id)}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-body font-medium transition-all"
                    style={{
                      background: active ? '#ccfbf1' : '#f8fafc',
                      border: `1px solid ${active ? '#99f6e4' : '#f1f5f9'}`,
                      color: active ? '#0f766e' : '#94a3b8',
                    }}
                  >
                    <span>{cat.emoji}</span>
                    <span>{t(`expenses.categoryLabels.${cat.id}`)}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Amount + Currency */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-500 text-xs font-body font-medium uppercase tracking-wider block mb-1.5">
                {t('modals.createExpense.labels.amount')} *
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                className="input-field"
                placeholder="0.00"
                value={form.amount}
                onChange={(e) => set('amount', e.target.value)}
              />
            </div>
            <div>
              <label className="text-slate-500 text-xs font-body font-medium uppercase tracking-wider block mb-1.5">
                {t('modals.createExpense.labels.currency')}
              </label>
              <select
                className="input-field"
                value={form.currency}
                onChange={(e) => set('currency', e.target.value)}
              >
                {CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code}>{c.code} ({c.symbol})</option>
                ))}
              </select>
            </div>
          </div>

          {/* Paid by + Date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-500 text-xs font-body font-medium uppercase tracking-wider block mb-1.5">
                {t('modals.createExpense.labels.paidBy')} *
              </label>
              <select
                className="input-field"
                value={form.paidBy}
                onChange={(e) => set('paidBy', e.target.value)}
              >
                {users.map((u) => (
                  <option key={u.id} value={u.id}>{u.emoji} {u.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-slate-500 text-xs font-body font-medium uppercase tracking-wider block mb-1.5">
                {t('modals.createExpense.labels.date')} *
              </label>
              <input
                type="date"
                className="input-field"
                value={form.date}
                onChange={(e) => set('date', e.target.value)}
              />
            </div>
          </div>

          {/* Participants */}
          <div>
            <label className="text-slate-500 text-xs font-body font-medium uppercase tracking-wider block mb-2">
              {t('modals.createExpense.labels.participants')} *
            </label>
            <div className="flex flex-wrap gap-2">
              {users.map((u) => {
                const active = form.participants.includes(u.id)
                return (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => toggleParticipant(u.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-body transition-all"
                    style={{
                      background: active ? `${u.color}15` : '#f8fafc',
                      border: `1px solid ${active ? `${u.color}40` : '#f1f5f9'}`,
                      color: active ? u.color : '#94a3b8',
                    }}
                  >
                    <span>{u.emoji}</span>
                    <span>{u.name}</span>
                  </button>
                )
              })}
            </div>
            {form.participants.length > 0 && form.amount && parseFloat(form.amount) > 0 && (
              <p className="text-slate-400 text-xs font-body mt-2">
                {t('modals.createExpense.eachPaysPreview', {
                  symbol: activeCurrency?.symbol,
                  amount: (parseFloat(form.amount) / form.participants.length).toFixed(2),
                })}
              </p>
            )}
          </div>

          {/* Note */}
          <div>
            <label className="text-slate-500 text-xs font-body font-medium uppercase tracking-wider block mb-1.5">
              {t('modals.createExpense.labels.note')}
            </label>
            <input
              className="input-field"
              placeholder={t('modals.createExpense.placeholders.note')}
              value={form.note}
              onChange={(e) => set('note', e.target.value)}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-5 pt-0">
          <button onClick={onClose} className="btn-secondary flex-1">
            {t('common.cancel')}
          </button>
          <button onClick={handleSubmit} className="btn-primary flex-1 !bg-teal-500 hover:!bg-teal-600">
            {isEdit ? t('modals.createExpense.editSubmit') : t('modals.createExpense.submit')}
          </button>
        </div>
      </div>
    </div>
  )
}
