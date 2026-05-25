import React, { useState } from 'react'
import { Plus, ChevronDown, ChevronUp, Trash2, Check } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useApp } from '../../hooks/useAppContext'
import CreateExpenseModal from '../modals/CreateExpenseModal'

const CURRENCY_SYMBOL = { PEN: 'S/', USD: '$', EUR: '€', GBP: '£' }
const fmt = (amount, currency) =>
  `${CURRENCY_SYMBOL[currency] || currency} ${Number(amount).toFixed(2)}`

export default function Expenses() {
  const { t } = useTranslation()
  const { expenses, getUserById, markDebtPaid, deleteExpense } = useApp()
  const [showModal, setShowModal] = useState(false)
  const [expandedId, setExpandedId] = useState(null)

  const toggle = (id) => setExpandedId((prev) => (prev === id ? null : id))

  const pendingDebtCount = expenses.reduce(
    (n, e) => n + e.debts.filter((d) => d.status === 'pending').length,
    0
  )

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-white">{t('expenses.title')}</h1>
          <p className="text-white/40 text-sm font-body mt-0.5">
            {pendingDebtCount > 0
              ? t('expenses.pendingDebts', { count: pendingDebtCount })
              : t('expenses.allSettled')}
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center gap-2 !px-4 !py-2.5"
          style={{ background: '#00e5ff', boxShadow: '0 0 20px rgba(0,229,255,0.35)' }}
        >
          <Plus size={16} />
          <span className="text-[13px]">{t('common.add')}</span>
        </button>
      </div>

      {/* Empty state */}
      {expenses.length === 0 && (
        <div className="glass rounded-2xl p-10 text-center">
          <div className="text-4xl mb-3">🧾</div>
          <p className="text-white/60 font-body text-sm">{t('expenses.noExpenses.title')}</p>
          <p className="text-white/30 font-body text-xs mt-1">{t('expenses.noExpenses.subtitle')}</p>
        </div>
      )}

      {/* Expense list */}
      <div className="space-y-3">
        {expenses.map((expense) => {
          const paidBy = getUserById(expense.paidBy)
          const isOpen = expandedId === expense.id
          const allPaid = expense.debts.length > 0 && expense.debts.every((d) => d.status === 'paid')
          const share = expense.amount / expense.participants.length
          const pendingDebts = expense.debts.filter((d) => d.status === 'pending')

          // ── Closed-card debt summary text ────────────────────────────────
          let debtLine = ''
          let debtLineColor = 'rgba(255,255,255,0.30)'
          if (expense.debts.length === 0) {
            debtLine = t('expenses.debtSummary.noneNeeded')
          } else if (allPaid) {
            debtLine = t('expenses.debtSummary.allSettled')
            debtLineColor = '#00ff88'
          } else if (pendingDebts.length === 1) {
            const debtor = getUserById(pendingDebts[0].fromUserId)
            debtLine = t('expenses.debtSummary.one', {
              debtor: debtor?.name,
              payer: paidBy?.name,
              amount: fmt(pendingDebts[0].amount, expense.currency),
            })
            debtLineColor = '#ffd700'
          } else {
            debtLine = t('expenses.debtSummary.many', {
              count: pendingDebts.length,
              payer: paidBy?.name,
              amount: fmt(share, expense.currency),
            })
            debtLineColor = '#ffd700'
          }

          // ── Settlement calculations ───────────────────────────────────────
          const payerIsParticipant = expense.participants.includes(expense.paidBy)
          const payerShare = payerIsParticipant ? share : 0
          const toReceive = expense.debts.reduce((s, d) => s + d.amount, 0)
          const receivedAmount = expense.debts
            .filter((d) => d.status === 'paid')
            .reduce((s, d) => s + d.amount, 0)
          const stillPending = expense.debts
            .filter((d) => d.status === 'pending')
            .reduce((s, d) => s + d.amount, 0)

          return (
            <div key={expense.id} className="glass rounded-2xl overflow-hidden">
              {/* ── Closed card ────────────────────────────────────────────── */}
              <button
                className="w-full flex items-center gap-3 p-4 text-left"
                onClick={() => toggle(expense.id)}
              >
                {/* Status dot */}
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0 self-start mt-1.5"
                  style={{ background: allPaid ? '#00ff88' : pendingDebts.length > 0 ? '#ffd700' : 'rgba(255,255,255,0.2)' }}
                />

                {/* Left: title + meta + debt line */}
                <div className="flex-1 min-w-0">
                  <p className="text-white font-body text-sm font-medium truncate">
                    {expense.title}
                  </p>
                  <p className="text-white/40 text-xs font-mono mt-0.5">
                    {expense.date} · {t('expenses.paidByLine', { name: paidBy?.name })}
                  </p>
                  <p className="text-xs font-body mt-1 truncate" style={{ color: debtLineColor }}>
                    {debtLine}
                  </p>
                </div>

                {/* Right: total + per-person + chevron */}
                <div className="flex flex-col items-end gap-0.5 flex-shrink-0">
                  <span className="font-mono text-sm font-medium" style={{ color: '#00e5ff' }}>
                    {fmt(expense.amount, expense.currency)}
                  </span>
                  <span className="text-white/35 text-[11px] font-mono">
                    {t('expenses.cardShare', { amount: fmt(share, expense.currency) })}
                  </span>
                  <span className="mt-0.5">
                    {isOpen
                      ? <ChevronUp size={13} className="text-white/40" />
                      : <ChevronDown size={13} className="text-white/40" />}
                  </span>
                </div>
              </button>

              {/* ── Expanded detail ────────────────────────────────────────── */}
              {isOpen && (
                <div className="border-t border-white/6 px-4 pb-4 pt-3 space-y-4">

                  {/* Basic breakdown */}
                  <div
                    className="rounded-xl p-3 space-y-1.5"
                    style={{ background: 'rgba(0,229,255,0.05)', border: '1px solid rgba(0,229,255,0.12)' }}
                  >
                    <Row label={t('expenses.labels.total')} value={fmt(expense.amount, expense.currency)} cyan />
                    <Row label={t('expenses.labels.paidBy')} value={`${paidBy?.emoji} ${paidBy?.name}`} />
                    <Row label={t('expenses.labels.participants')} value={expense.participants.length} />
                    <Row label={t('expenses.labels.eachPays')} value={fmt(share, expense.currency)} />
                    {expense.note && (
                      <Row label={t('expenses.labels.note')} value={expense.note} />
                    )}
                  </div>

                  {/* Settlement Summary */}
                  {expense.debts.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-white/40 text-xs font-mono uppercase tracking-wider">
                        {t('expenses.settlement.title')}
                      </p>
                      <div
                        className="rounded-xl p-3 space-y-1.5"
                        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
                      >
                        <Row
                          label={t('expenses.settlement.payerShare')}
                          value={fmt(payerShare, expense.currency)}
                        />
                        <Row
                          label={t('expenses.settlement.toReceive')}
                          value={fmt(toReceive, expense.currency)}
                        />
                        <div className="border-t border-white/8 my-1" />
                        <Row
                          label={t('expenses.settlement.received')}
                          value={fmt(receivedAmount, expense.currency)}
                          green
                        />
                        <Row
                          label={t('expenses.settlement.pending')}
                          value={fmt(stillPending, expense.currency)}
                          gold={stillPending > 0}
                        />
                      </div>
                    </div>
                  )}

                  {/* Debt rows */}
                  <div className="space-y-2">
                    <p className="text-white/40 text-xs font-mono uppercase tracking-wider">
                      {t('expenses.labels.debts')}
                    </p>

                    {expense.debts.length === 0 ? (
                      <p className="text-white/30 text-xs font-body text-center py-1">
                        {t('expenses.labels.noDebts')}
                      </p>
                    ) : (
                      expense.debts.map((debt) => {
                        const from = getUserById(debt.fromUserId)
                        const to = getUserById(debt.toUserId)
                        const paid = debt.status === 'paid'
                        return (
                          <div
                            key={debt.id}
                            className="flex items-center justify-between gap-2 rounded-xl px-3 py-2.5"
                            style={{
                              background: paid ? 'rgba(0,255,136,0.06)' : 'rgba(255,255,255,0.04)',
                              border: `1px solid ${paid ? 'rgba(0,255,136,0.2)' : 'rgba(255,255,255,0.08)'}`,
                            }}
                          >
                            <div className="flex-1 min-w-0">
                              <p className="text-white/80 text-sm font-body">
                                <span style={{ color: from?.color }}>{from?.name}</span>
                                <span className="text-white/30 mx-1">{t('common.owes')}</span>
                                <span style={{ color: to?.color }}>{to?.name}</span>
                              </p>
                              <p
                                className="font-mono text-xs mt-0.5"
                                style={{ color: paid ? '#00ff88' : '#ffd700' }}
                              >
                                {fmt(debt.amount, expense.currency)}
                                {paid && ` · ${t('common.paid')}`}
                              </p>
                            </div>

                            {!paid && (
                              <button
                                onClick={() => markDebtPaid(expense.id, debt.id)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-body transition-all flex-shrink-0"
                                style={{
                                  background: 'rgba(0,255,136,0.1)',
                                  border: '1px solid rgba(0,255,136,0.3)',
                                  color: '#00ff88',
                                }}
                              >
                                <Check size={12} />
                                {t('common.markPaid')}
                              </button>
                            )}
                          </div>
                        )
                      })
                    )}
                  </div>

                  {/* Delete */}
                  <button
                    onClick={() => deleteExpense(expense.id)}
                    className="flex items-center gap-1.5 text-white/25 hover:text-red-400 text-xs font-body transition-colors"
                  >
                    <Trash2 size={12} />
                    {t('expenses.deleteExpense')}
                  </button>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {showModal && <CreateExpenseModal onClose={() => setShowModal(false)} />}
    </div>
  )
}

function Row({ label, value, cyan, green, gold }) {
  const color = cyan
    ? '#00e5ff'
    : green
    ? '#00ff88'
    : gold
    ? '#ffd700'
    : 'rgba(255,255,255,0.75)'
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-white/40 text-xs font-mono">{label}</span>
      <span className="text-xs font-mono font-medium" style={{ color }}>
        {value}
      </span>
    </div>
  )
}
