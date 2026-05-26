import React, { useState } from 'react'
import { Check, X, Trash2, ChevronDown, ChevronUp, MapPin, Clock } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useApp } from '../../hooks/useAppContext'
import { format } from 'date-fns'

const STATUS_COLORS = {
  pending: '#f59e0b',
  completed: '#10b981',
  cancelled: '#cbd5e1',
}

export default function ActivityCard({ activity, showDate = false }) {
  const { t } = useTranslation()
  const { completeActivity, cancelActivity, deleteActivity, getUserById } = useApp()
  const [expanded, setExpanded] = useState(false)
  const [completing, setCompleting] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const assigned = getUserById(activity.assignedTo)
  const createdBy = getUserById(activity.createdBy)
  const color = STATUS_COLORS[activity.status]

  const handleComplete = () => {
    setCompleting(true)
    setTimeout(() => {
      completeActivity(activity.id)
      setCompleting(false)
    }, 400)
  }

  return (
    <div className="postit p-3 group relative" style={{ borderLeftColor: color }}>
      {/* Top row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-body font-medium ${
                activity.status === 'pending'
                  ? 'status-pending'
                  : activity.status === 'completed'
                  ? 'status-completed'
                  : 'status-cancelled'
              }`}
            >
              {t(`activity.status.${activity.status}`)}
            </span>
            <span className="coin-badge">
              {activity.status === 'completed' ? '+' : ''}{activity.coinReward} ✦
            </span>
          </div>
          <h4
            className="font-body font-medium text-sm mt-1.5 leading-tight"
            style={{
              color: activity.status === 'cancelled' ? '#94a3b8' : '#1e293b',
              textDecoration: activity.status === 'cancelled' ? 'line-through' : 'none',
            }}
          >
            {activity.title}
          </h4>
        </div>

        <div
          className="w-7 h-7 rounded-full flex items-center justify-center text-sm shrink-0 mt-0.5"
          style={{ background: `${assigned?.color}18`, border: `1px solid ${assigned?.color}30` }}
          title={assigned?.name}
        >
          {assigned?.emoji}
        </div>
      </div>

      {/* Date badge */}
      {showDate && (
        <div className="mt-1.5 text-xs text-slate-400 font-body">
          {format(new Date(activity.date + 'T12:00:00'), 'MMM d, yyyy')}
        </div>
      )}

      {/* Time and location meta */}
      {(activity.startTime || activity.location) && (
        <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-slate-400 font-body">
          {activity.startTime && (
            <span className="flex items-center gap-1">
              <Clock size={10} />
              {activity.startTime}{activity.endTime ? ` – ${activity.endTime}` : ''}
            </span>
          )}
          {activity.location && (
            <span className="flex items-center gap-1">
              <MapPin size={10} />
              {activity.location}
            </span>
          )}
        </div>
      )}

      {/* Expanded content */}
      {expanded && (
        <div className="mt-2 pt-2 border-t border-slate-100 space-y-1.5">
          {activity.description && (
            <p className="text-xs text-slate-500 font-body leading-relaxed">
              {activity.description}
            </p>
          )}
          <div className="flex items-center gap-3 text-xs text-slate-400 font-body">
            {createdBy && (
              <span>{t('activity.by')} {createdBy.emoji} {createdBy.name}</span>
            )}
            {activity.completedAt && (
              <span>✓ {format(new Date(activity.completedAt), 'MMM d')}</span>
            )}
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {confirmDelete && (
        <div className="mt-2 pt-2 border-t border-rose-100 space-y-2">
          <div>
            <p className="text-xs font-body font-medium text-slate-700">{t('activity.deleteConfirmTitle')}</p>
            <p className="text-xs text-slate-400 font-body">{t('activity.deleteConfirmBody')}</p>
            <p className="text-[10px] text-slate-300 font-body mt-0.5">{t('activity.deleteFutureNote')}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setConfirmDelete(false)}
              className="flex-1 py-1.5 rounded-full text-xs font-body font-medium bg-slate-100 text-slate-500 hover:bg-slate-200 transition-all"
            >
              {t('common.cancel')}
            </button>
            <button
              onClick={() => deleteActivity(activity.id)}
              className="flex-1 py-1.5 rounded-full text-xs font-body font-medium bg-rose-100 text-rose-600 border border-rose-200 hover:bg-rose-200 transition-all"
            >
              {t('common.delete')}
            </button>
          </div>
        </div>
      )}

      {/* Action row */}
      {!confirmDelete && (
        <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-slate-100">
          <button
            onClick={() => setExpanded((e) => !e)}
            className="text-slate-300 hover:text-slate-500 transition-colors"
          >
            {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </button>

          <div className="flex items-center gap-1.5">
            {activity.status === 'pending' && (
              <>
                <button
                  onClick={() => cancelActivity(activity.id)}
                  className="w-6 h-6 rounded-full bg-slate-100 hover:bg-rose-100 flex items-center justify-center transition-all"
                  title="Cancel"
                >
                  <X size={11} className="text-slate-400 hover:text-rose-500" />
                </button>
                <button
                  onClick={handleComplete}
                  disabled={completing}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-body font-medium transition-all"
                  style={{
                    background: completing ? '#d1fae5' : '#ecfdf5',
                    border: '1px solid #a7f3d0',
                    color: '#047857',
                    transform: completing ? 'scale(1.05)' : 'scale(1)',
                  }}
                >
                  <Check size={11} />
                  {t('activity.done')}
                </button>
              </>
            )}
            <button
              onClick={() => setConfirmDelete(true)}
              className="w-6 h-6 rounded-full bg-slate-100 hover:bg-rose-100 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
            >
              <Trash2 size={11} className="text-slate-400 hover:text-rose-500" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
