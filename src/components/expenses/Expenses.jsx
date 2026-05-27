import React, { useState, useMemo } from 'react'
import { Plus, ChevronDown, ChevronUp, Trash2, Check, Square, CheckSquare, Pencil } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useApp } from '../../hooks/useAppContext'
import CreateExpenseModal from '../modals/CreateExpenseModal'
import EditSpaceModal from '../modals/EditSpaceModal'
import { EXPENSE_CATEGORIES } from '../../data/mockData'

const CURRENCY_SYMBOL = { PEN: 'S/', USD: '$', EUR: '€', GBP: '£' }
const fmt = (amount, currency) =>
  `${CURRENCY_SYMBOL[currency] || currency} ${Number(amount).toFixed(2)}`

const getCategoryInfo = (id) =>
  EXPENSE_CATEGORIES.find((c) => c.id === id) || EXPENSE_CATEGORIES.find((c) => c.id === 'Other')

// Net-balance settlement across selected expenses (per currency)
function computeSettlement(selectedExpenses) {
  const byCurrency = {}

  for (const expense of selectedExpenses) {
    const { currency, amount, paidBy, participants } = expense
    if (!byCurrency[currency]) {
      byCurrency[currency] = { balances: {}, total: 0, paid: {}, involvedUsers: new Set() }
    }
    const curr = byCurrency[currency]
    curr.total += amount
    curr.involvedUsers.add(paidBy)
    curr.balances[paidBy] = (curr.balances[paidBy] || 0) + amount
    curr.paid[paidBy] = (curr.paid[paidBy] || 0) + amount

    const share = amount / participants.length
    for (const uid of participants) {
      curr.balances[uid] = (curr.balances[uid] || 0) - share
      curr.involvedUsers.add(uid)
    }
  }

  return Object.entries(byCurrency).map(([currency, { balances, total, paid, involvedUsers }]) => {
    const creditors = []
    const debtors = []

    for (const [userId, balance] of Object.entries(balances)) {
      const rounded = Math.round(balance * 100) / 100
      if (rounded > 0.005) creditors.push({ userId, amount: rounded })
      else if (rounded < -0.005) debtors.push({ userId, amount: -rounded })
    }

    creditors.sort((a, b) => b.amount - a.amount)
    debtors.sort((a, b) => b.amount - a.amount)

    const transactions = []
    const c = creditors.map(x => ({ ...x }))
    const d = debtors.map(x => ({ ...x }))
    let ci = 0, di = 0
    while (ci < c.length && di < d.length) {
      const transfer = Math.min(c[ci].amount, d[di].amount)
      if (transfer > 0.005) {
        transactions.push({
          from: d[di].userId,
          to: c[ci].userId,
          amount: Math.round(transfer * 100) / 100,
        })
      }
      c[ci].amount -= transfer
      d[di].amount -= transfer
      if (c[ci].amount <= 0.005) ci++
      if (d[di].amount <= 0.005) di++
    }

    const debtorIds = new Set(debtors.map(d => d.userId))
    const settled = [...involvedUsers].filter(uid => !debtorIds.has(uid))

    return { currency, total, paid, transactions, settled }
  })
}

export default function Expenses() {
  const { t } = useTranslation()
  const { expenses, users, currentSpace, getUserById, markDebtPaid, deleteExpense } = useApp()
  const [showModal, setShowModal] = useState(false)
  const [editingExpense, setEditingExpense] = useState(null)
  const [showEditSpace, setShowEditSpace] = useState(false)
  const [expandedId, setExpandedId] = useState(null)
  const [selectedIds, setSelectedIds] = useState(new Set())

  const toggle = (id) => setExpandedId((prev) => (prev === id ? null : id))

  const toggleSelected = (id, e) => {
    e.stopPropagation()
    setSelectedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const selectAll = () => setSelectedIds(new Set(expenses.map(e => e.id)))
  const clearSelection = () => setSelectedIds(new Set())

  const selectedExpenses = useMemo(
    () => expenses.filter(e => selectedIds.has(e.id)),
    [expenses, selectedIds]
  )

  const pendingDebtCount = expenses.reduce(
    (n, e) => n + e.debts.filter((d) => d.status === 'pending').length,
    0
  )

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-body font-bold text-2xl text-slate-900">{t('expenses.title')}</h1>
          <p className="text-slate-500 text-sm font-body mt-0.5">
            {pendingDebtCount > 0
              ? t('expenses.pendingDebts', { count: pendingDebtCount })
              : t('expenses.allSettled')}
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center gap-2 !bg-teal-500 hover:!bg-teal-600"
        >
          <Plus size={16} />
          <span className="text-[13px]">{t('common.add')}</span>
        </button>
      </div>

      {/* Single-member empty state */}
      {users.length < 2 && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-10 text-center space-y-3">
          <div className="text-4xl">👥</div>
          <p className="text-slate-600 font-body text-sm">{t('expenses.needsMoreMembers')}</p>
          <button
            onClick={() => setShowEditSpace(true)}
            className="mx-auto px-4 py-2 rounded-full text-sm font-body font-medium bg-teal-50 border border-teal-200 text-teal-700 hover:bg-teal-100 transition-all"
          >
            {t('expenses.goToEditSpace')}
          </button>
        </div>
      )}

      {/* Empty state */}
      {users.length >= 2 && expenses.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-10 text-center">
          <div className="text-4xl mb-3">🧾</div>
          <p className="text-slate-600 font-body text-sm">{t('expenses.noExpenses.title')}</p>
          <p className="text-slate-400 font-body text-xs mt-1">{t('expenses.noExpenses.subtitle')}</p>
        </div>
      )}

      {/* Selection controls */}
      {expenses.length > 0 && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-body flex-1">
            {selectedIds.size > 0
              ? `${selectedIds.size} ${selectedIds.size === 1 ? 'expense' : 'expenses'} selected`
              : t('expenses.selectToCalculate')}
          </span>
          <button
            onClick={selectAll}
            className="text-xs font-body font-medium text-violet-600 hover:text-violet-700 px-2 py-1 rounded-lg hover:bg-violet-50 transition-all"
          >
            {t('expenses.selectAll')}
          </button>
          {selectedIds.size > 0 && (
            <button
              onClick={clearSelection}
              className="text-xs font-body font-medium text-slate-400 hover:text-slate-600 px-2 py-1 rounded-lg hover:bg-slate-100 transition-all"
            >
              {t('expenses.clearSelection')}
            </button>
          )}
        </div>
      )}

      {/* Expense list + Settlement: stacked on mobile, side-by-side on desktop */}
      {expenses.length > 0 && (
        <div className="lg:grid lg:grid-cols-[1fr,340px] lg:gap-6 lg:items-start">
          {/* Expense list */}
          <div className="space-y-3">
      {expenses.map((expense) => {
          const paidBy = getUserById(expense.paidBy)
          const isOpen = expandedId === expense.id
          const isSelected = selectedIds.has(expense.id)
          const allPaid = expense.debts.length > 0 && expense.debts.every((d) => d.status === 'paid')
          const share = expense.amount / expense.participants.length
          const pendingDebts = expense.debts.filter((d) => d.status === 'pending')
          const catInfo = getCategoryInfo(expense.category)

          let debtLine = ''
          let debtLineColor = '#94a3b8'
          if (expense.debts.length === 0) {
            debtLine = t('expenses.debtSummary.noneNeeded')
          } else if (allPaid) {
            debtLine = t('expenses.debtSummary.allSettled')
            debtLineColor = '#059669'
          } else if (pendingDebts.length === 1) {
            const debtor = getUserById(pendingDebts[0].fromUserId)
            debtLine = t('expenses.debtSummary.one', {
              debtor: debtor?.name,
              payer: paidBy?.name,
              amount: fmt(pendingDebts[0].amount, expense.currency),
            })
            debtLineColor = '#b45309'
          } else {
            debtLine = t('expenses.debtSummary.many', {
              count: pendingDebts.length,
              payer: paidBy?.name,
              amount: fmt(share, expense.currency),
            })
            debtLineColor = '#b45309'
          }

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
            <div
              key={expense.id}
              className="bg-white rounded-2xl shadow-sm overflow-hidden transition-all"
              style={{
                border: `1px solid ${isSelected ? '#c4b5fd' : '#f1f5f9'}`,
                boxShadow: isSelected ? '0 0 0 2px #ede9fe' : undefined,
              }}
            >
              {/* Card header row */}
              <div className="flex items-center min-w-0">
                {/* Checkbox */}
                <button
                  onClick={(e) => toggleSelected(expense.id, e)}
                  className="pl-4 pr-2 py-4 flex items-center shrink-0 transition-colors"
                  style={{ color: isSelected ? '#7c3aed' : '#cbd5e1' }}
                >
                  {isSelected ? <CheckSquare size={16} /> : <Square size={16} />}
                </button>

                {/* Clickable content area */}
                <div
                  className="flex-1 flex items-center gap-3 py-4 cursor-pointer min-w-0"
                  onClick={() => toggle(expense.id)}
                >
                  <div
                    className="w-2 h-2 rounded-full flex-shrink-0 self-start mt-1.5"
                    style={{ background: allPaid ? '#10b981' : pendingDebts.length > 0 ? '#f59e0b' : '#e2e8f0' }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                      <p className="text-slate-800 font-body text-sm font-medium truncate">
                        {expense.title}
                      </p>
                      {catInfo && (
                        <span className="inline-flex items-center gap-0.5 text-[10px] font-body px-1.5 py-0.5 rounded-full bg-teal-50 text-teal-600 border border-teal-100 shrink-0">
                          {catInfo.emoji} {t(`expenses.categoryLabels.${catInfo.id}`)}
                        </span>
                      )}
                    </div>
                    <p className="text-slate-400 text-xs font-body">
                      {expense.date} · {t('expenses.paidByLine', { name: paidBy?.name })}
                    </p>
                    <p className="text-xs font-body mt-0.5 truncate" style={{ color: debtLineColor }}>
                      {debtLine}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-0.5 flex-shrink-0">
                    <span className="font-body font-semibold text-sm text-violet-600">
                      {fmt(expense.amount, expense.currency)}
                    </span>
                    <span className="text-slate-400 text-[11px] font-body">
                      {t('expenses.cardShare', { amount: fmt(share, expense.currency) })}
                    </span>
                  </div>
                </div>

                {/* Edit + chevron buttons */}
                <div className="flex items-center gap-0.5 pr-3 shrink-0">
                  <button
                    onClick={(e) => { e.stopPropagation(); setEditingExpense(expense) }}
                    className="w-7 h-7 rounded-full flex items-center justify-center text-slate-300 hover:text-teal-500 hover:bg-teal-50 transition-all"
                    title="Edit"
                  >
                    <Pencil size={12} />
                  </button>
                  <button
                    onClick={() => toggle(expense.id)}
                    className="w-7 h-7 rounded-full flex items-center justify-center text-slate-300 hover:text-slate-500 transition-all"
                  >
                    {isOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                  </button>
                </div>
              </div>

              {/* Expanded detail */}
              {isOpen && (
                <div className="border-t border-slate-100 px-4 pb-4 pt-3 space-y-4">

                  {/* Basic breakdown */}
                  <div className="rounded-2xl p-3 space-y-1.5 bg-violet-50 border border-violet-100">
                    <Row label={t('expenses.labels.total')} value={fmt(expense.amount, expense.currency)} violet />
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
                      <p className="text-slate-500 text-xs font-body uppercase tracking-wider">
                        {t('expenses.settlement.title')}
                      </p>
                      <div className="rounded-2xl p-3 space-y-1.5 bg-slate-50 border border-slate-100">
                        <Row
                          label={t('expenses.settlement.payerShare')}
                          value={fmt(payerShare, expense.currency)}
                        />
                        <Row
                          label={t('expenses.settlement.toReceive')}
                          value={fmt(toReceive, expense.currency)}
                        />
                        <div className="border-t border-slate-200 my-1" />
                        <Row
                          label={t('expenses.settlement.received')}
                          value={fmt(receivedAmount, expense.currency)}
                          green
                        />
                        <Row
                          label={t('expenses.settlement.pending')}
                          value={fmt(stillPending, expense.currency)}
                          amber={stillPending > 0}
                        />
                      </div>
                    </div>
                  )}

                  {/* Debt rows */}
                  <div className="space-y-2">
                    <p className="text-slate-500 text-xs font-body uppercase tracking-wider">
                      {t('expenses.labels.debts')}
                    </p>
                    {expense.debts.length === 0 ? (
                      <p className="text-slate-400 text-xs font-body text-center py-1">
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
                            className="flex items-center justify-between gap-2 rounded-2xl px-3 py-2.5"
                            style={{
                              background: paid ? '#ecfdf5' : '#fff7ed',
                              border: `1px solid ${paid ? '#a7f3d0' : '#fed7aa'}`,
                            }}
                          >
                            <div className="flex-1 min-w-0">
                              <p className="text-slate-700 text-sm font-body">
                                <span style={{ color: from?.color }}>{from?.name}</span>
                                <span className="text-slate-400 mx-1">{t('common.owes')}</span>
                                <span style={{ color: to?.color }}>{to?.name}</span>
                              </p>
                              <p
                                className="font-body text-xs mt-0.5 font-medium"
                                style={{ color: paid ? '#059669' : '#b45309' }}
                              >
                                {fmt(debt.amount, expense.currency)}
                                {paid && ` · ${t('common.paid')}`}
                              </p>
                            </div>
                            {!paid && (
                              <button
                                onClick={() => markDebtPaid(expense.id, debt.id)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-body font-medium transition-all flex-shrink-0 bg-emerald-100 border border-emerald-200 text-emerald-700 hover:bg-emerald-200"
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
                    className="flex items-center gap-1.5 text-slate-400 hover:text-rose-500 text-xs font-body transition-colors"
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

          {/* Settlement sidebar */}
          {users.length >= 2 && (
            <div className="mt-5 lg:mt-0 lg:sticky lg:top-6">
              <GlobalSettlement
                selectedExpenses={selectedExpenses}
                getUserById={getUserById}
                t={t}
              />
            </div>
          )}
        </div>
      )}

      {showModal && <CreateExpenseModal onClose={() => setShowModal(false)} />}
      {editingExpense && (
        <CreateExpenseModal
          expense={editingExpense}
          onClose={() => setEditingExpense(null)}
        />
      )}
      {showEditSpace && currentSpace && (
        <EditSpaceModal space={currentSpace} onClose={() => setShowEditSpace(false)} />
      )}
    </div>
  )
}

function GlobalSettlement({ selectedExpenses, getUserById, t }) {
  if (selectedExpenses.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-dashed border-slate-200 px-6 py-8 text-center">
        <div className="text-3xl mb-3">🧮</div>
        <p className="text-slate-400 text-sm font-body">{t('expenses.selectToCalculate')}</p>
      </div>
    )
  }

  const settlements = computeSettlement(selectedExpenses)

  return (
    <div className="space-y-3">
      {settlements.map(({ currency, total, paid, transactions, settled }) => (
        <div key={currency} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-body font-semibold text-sm text-slate-800">
              {t('expenses.summary.title')}
            </h3>
            <span className="text-[11px] font-body text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
              {selectedExpenses.length} {selectedExpenses.length === 1 ? 'expense' : 'expenses'}
            </span>
          </div>

          <div className="p-4 space-y-4">
            <div className="rounded-2xl p-3 space-y-2 bg-violet-50 border border-violet-100">
              <Row label={t('expenses.summary.totalSpent')} value={fmt(total, currency)} violet />
              {Object.entries(paid).length > 0 && (
                <div className="border-t border-violet-100 my-1" />
              )}
              {Object.entries(paid).map(([userId, amount]) => {
                const user = getUserById(userId)
                return user ? (
                  <Row key={userId} label={`${user.emoji} ${user.name}`} value={fmt(amount, currency)} />
                ) : null
              })}
            </div>

            <div>
              <p className="text-slate-500 text-xs font-body uppercase tracking-wider mb-2">
                {t('expenses.summary.netSettlement')}
              </p>
              <div className="space-y-2">
                {transactions.map((tx, i) => {
                  const from = getUserById(tx.from)
                  const to = getUserById(tx.to)
                  return (
                    <div
                      key={i}
                      className="flex items-center justify-between gap-2 rounded-2xl px-3 py-2.5 bg-rose-50 border border-rose-100"
                    >
                      <p className="text-sm font-body flex-1 min-w-0">
                        <span style={{ color: from?.color }} className="font-medium">{from?.name}</span>
                        <span className="text-slate-400 mx-1.5 text-xs">{t('common.owes')}</span>
                        <span style={{ color: to?.color }} className="font-medium">{to?.name}</span>
                      </p>
                      <span className="text-rose-700 text-sm font-body font-semibold shrink-0">
                        {fmt(tx.amount, currency)}
                      </span>
                    </div>
                  )
                })}
                {settled.map((userId) => {
                  const user = getUserById(userId)
                  return user ? (
                    <div
                      key={userId}
                      className="flex items-center justify-between gap-2 rounded-2xl px-3 py-2.5 bg-emerald-50 border border-emerald-100"
                    >
                      <p className="text-sm font-body">
                        <span style={{ color: user.color }} className="font-medium">{user.name}</span>
                      </p>
                      <span className="text-emerald-700 text-xs font-body font-medium">
                        {t('expenses.summary.owesNothing')}
                      </span>
                    </div>
                  ) : null
                })}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function Row({ label, value, violet, green, amber }) {
  const color = violet ? '#7c3aed' : green ? '#059669' : amber ? '#b45309' : '#475569'
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-slate-500 text-xs font-body">{label}</span>
      <span className="text-xs font-body font-medium" style={{ color }}>{value}</span>
    </div>
  )
}
