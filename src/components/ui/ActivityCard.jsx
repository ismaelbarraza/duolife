import React, { useState } from 'react'
import { Check, X, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useApp } from '../../hooks/useAppContext'
import { format } from 'date-fns'

const STATUS_COLORS = {
  pending: '#ffd700',
  completed: '#00ff88',
  cancelled: 'rgba(255,255,255,0.2)',
}

export default function ActivityCard({ activity, showDate = false }) {
  const { t } = useTranslation()
  const { completeActivity, cancelActivity, deleteActivity, getUserById } = useApp()
  const [expanded, setExpanded] = useState(false)
  const [completing, setCompleting] = useState(false)

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
              className={`text-xs px-2 py-0.5 rounded-full font-mono ${
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
              {activity.status === 'completed' ? '+' : ''}{activity.coinReward} 🪙
            </span>
          </div>
          <h4
            className="font-body font-medium text-sm mt-1.5 leading-tight"
            style={{
              color: activity.status === 'cancelled' ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.9)',
              textDecoration: activity.status === 'cancelled' ? 'line-through' : 'none',
            }}
          >
            {activity.title}
          </h4>
        </div>

        <div
          className="w-7 h-7 rounded-full flex items-center justify-center text-sm shrink-0 mt-0.5"
          style={{ background: `${assigned?.color}20`, border: `1px solid ${assigned?.color}40` }}
          title={assigned?.name}
        >
          {assigned?.emoji}
        </div>
      </div>

      {/* Date badge */}
      {showDate && (
        <div className="mt-1.5 text-xs text-white/30 font-mono">
          {format(new Date(activity.date + 'T12:00:00'), 'MMM d, yyyy')}
        </div>
      )}

      {/* Expanded content */}
      {expanded && (
        <div className="mt-2 pt-2 border-t border-white/8 space-y-1.5">
          {activity.description && (
            <p className="text-xs text-white/50 font-body leading-relaxed">
              {activity.description}
            </p>
          )}
          <div className="flex items-center gap-3 text-xs text-white/30 font-body">
            {createdBy && (
              <span>{t('activity.by')} {createdBy.emoji} {createdBy.name}</span>
            )}
            {activity.completedAt && (
              <span>✓ {format(new Date(activity.completedAt), 'MMM d')}</span>
            )}
          </div>
        </div>
      )}

      {/* Action row */}
      <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-white/8">
        <button
          onClick={() => setExpanded((e) => !e)}
          className="text-white/30 hover:text-white/60 transition-colors"
        >
          {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
        </button>

        {activity.status === 'pending' && (
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => cancelActivity(activity.id)}
              className="w-6 h-6 rounded-md bg-white/5 hover:bg-red-500/20 flex items-center justify-center transition-all"
              title="Cancel"
            >
              <X size={11} className="text-white/40 hover:text-red-400" />
            </button>
            <button
              onClick={handleComplete}
              disabled={completing}
              className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-mono font-medium transition-all"
              style={{
                background: completing ? 'rgba(0,255,136,0.3)' : 'rgba(0,255,136,0.15)',
                border: '1px solid rgba(0,255,136,0.3)',
                color: '#00ff88',
                transform: completing ? 'scale(1.05)' : 'scale(1)',
              }}
            >
              <Check size={11} />
              {t('activity.done')}
            </button>
          </div>
        )}

        {(activity.status === 'completed' || activity.status === 'cancelled') && (
          <button
            onClick={() => deleteActivity(activity.id)}
            className="w-6 h-6 rounded-md bg-white/5 hover:bg-red-500/10 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
          >
            <Trash2 size={11} className="text-white/30 hover:text-red-400" />
          </button>
        )}
      </div>
    </div>
  )
}
