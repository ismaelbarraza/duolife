import React, { useState, useMemo, useRef, useEffect } from 'react'
import { ChevronLeft, ChevronRight, ChevronDown, Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval,
  isSameMonth, isToday, isSameDay } from 'date-fns'
import { useApp } from '../../hooks/useAppContext'
import ActivityCard from '../ui/ActivityCard'
import CreateActivityModal from '../modals/CreateActivityModal'

const CURRENT_YEAR = new Date().getFullYear()
const MIN_YEAR = CURRENT_YEAR - 10
const MAX_YEAR = CURRENT_YEAR + 10

export default function Planner() {
  const { t, i18n } = useTranslation()
  const { activities } = useApp()

  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [createDate, setCreateDate] = useState(null)

  // Jump-to state
  const [showJump, setShowJump] = useState(false)
  const [jumpMonth, setJumpMonth] = useState(0)
  const [jumpYear, setJumpYear] = useState(CURRENT_YEAR)
  const jumpRef = useRef(null)

  // Localized short month names via Intl — no extra translation keys needed
  const monthNames = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) =>
        new Intl.DateTimeFormat(i18n.language, { month: 'short' }).format(new Date(2000, i, 1))
      ),
    [i18n.language]
  )

  // Jan 2 2000 is a Sunday — gives Sun→Sat for indices 0–6
  const weekdayNames = useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) =>
        new Intl.DateTimeFormat(i18n.language, { weekday: 'narrow' }).format(new Date(2000, 0, 2 + i))
      ),
    [i18n.language]
  )

  // Close jump dropdown on outside click
  useEffect(() => {
    if (!showJump) return
    const handler = (e) => {
      if (jumpRef.current && !jumpRef.current.contains(e.target)) setShowJump(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [showJump])

  const openJump = () => {
    setJumpMonth(currentMonth.getMonth())
    setJumpYear(currentMonth.getFullYear())
    setShowJump(true)
  }

  const handleJumpGo = () => {
    setCurrentMonth(new Date(jumpYear, jumpMonth, 1))
    setShowJump(false)
  }

  const adjustYear = (delta) => {
    setJumpYear((y) => Math.min(MAX_YEAR, Math.max(MIN_YEAR, y + delta)))
  }

  // Calendar data
  const days = useMemo(() => {
    return eachDayOfInterval({ start: startOfMonth(currentMonth), end: endOfMonth(currentMonth) })
  }, [currentMonth])

  const activitiesByDate = useMemo(() => {
    const map = {}
    activities.forEach((a) => {
      if (!map[a.date]) map[a.date] = []
      map[a.date].push(a)
    })
    return map
  }, [activities])

  const selectedDateStr = format(selectedDate, 'yyyy-MM-dd')
  const selectedActivities = activitiesByDate[selectedDateStr] || []

  const handleCreateForDate = (date) => {
    setCreateDate(format(date, 'yyyy-MM-dd'))
    setShowCreateModal(true)
  }

  const getDotColor = (dateStr) => {
    const acts = activitiesByDate[dateStr] || []
    if (!acts.length) return null
    if (acts.some((a) => a.status === 'pending')) return '#ffd700'
    if (acts.some((a) => a.status === 'completed')) return '#00ff88'
    return 'rgba(255,255,255,0.2)'
  }

  return (
    <div className="space-y-5">
      {/* Month header */}
      <div className="relative" ref={jumpRef}>
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
          >
            <ChevronLeft size={16} className="text-white/60" />
          </button>

          {/* Clickable month/year title */}
          <button
            onClick={openJump}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all hover:bg-white/5 group"
          >
            <span className="font-display text-xl text-white">
              {format(currentMonth, 'MMMM yyyy')}
            </span>
            <ChevronDown
              size={14}
              className="transition-transform duration-200"
              style={{
                color: 'rgba(255,255,255,0.35)',
                transform: showJump ? 'rotate(180deg)' : 'rotate(0deg)',
              }}
            />
          </button>

          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
          >
            <ChevronRight size={16} className="text-white/60" />
          </button>
        </div>

        {/* Jump-to dropdown */}
        {showJump && (
          <div
            className="absolute left-1/2 top-full mt-2 z-30 w-72 rounded-2xl overflow-hidden"
            style={{
              transform: 'translateX(-50%)',
              background: 'rgba(17,17,24,0.97)',
              border: '1px solid rgba(255,45,120,0.25)',
              boxShadow: '0 12px 40px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,45,120,0.1)',
            }}
          >
            {/* Header */}
            <div className="px-4 pt-4 pb-3 border-b border-white/6">
              <p className="text-xs font-mono uppercase tracking-widest text-white/40">
                {t('planner.jumpTo.title')}
              </p>
            </div>

            <div className="p-4 space-y-4">
              {/* Year stepper */}
              <div className="flex items-center justify-between gap-2">
                <button
                  onClick={() => adjustYear(-1)}
                  disabled={jumpYear <= MIN_YEAR}
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    color: jumpYear <= MIN_YEAR ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.6)',
                  }}
                >
                  <ChevronLeft size={15} />
                </button>

                <span className="font-display text-2xl text-white tabular-nums">
                  {jumpYear}
                </span>

                <button
                  onClick={() => adjustYear(1)}
                  disabled={jumpYear >= MAX_YEAR}
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    color: jumpYear >= MAX_YEAR ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.6)',
                  }}
                >
                  <ChevronRight size={15} />
                </button>
              </div>

              {/* Month grid */}
              <div className="grid grid-cols-4 gap-1.5">
                {monthNames.map((name, idx) => {
                  const isActive = idx === jumpMonth
                  return (
                    <button
                      key={idx}
                      onClick={() => setJumpMonth(idx)}
                      className="py-2 rounded-lg text-xs font-mono font-medium transition-all"
                      style={{
                        background: isActive ? 'rgba(255,45,120,0.2)' : 'rgba(255,255,255,0.04)',
                        border: `1px solid ${isActive ? 'rgba(255,45,120,0.5)' : 'rgba(255,255,255,0.07)'}`,
                        color: isActive ? '#ff2d78' : 'rgba(255,255,255,0.55)',
                        textShadow: isActive ? '0 0 10px rgba(255,45,120,0.5)' : 'none',
                      }}
                    >
                      {name}
                    </button>
                  )
                })}
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => setShowJump(false)}
                  className="btn-secondary flex-1 !py-2 text-sm"
                >
                  {t('common.cancel')}
                </button>
                <button
                  onClick={handleJumpGo}
                  className="flex-1 py-2 rounded-xl font-body font-medium text-sm text-white transition-all"
                  style={{
                    background: '#ff2d78',
                    boxShadow: '0 0 16px rgba(255,45,120,0.4)',
                  }}
                >
                  {t('planner.jumpTo.go')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Weekday labels */}
      <div className="grid grid-cols-7 gap-1">
        {weekdayNames.map((d, i) => (
          <div key={i} className="text-center text-white/25 text-xs font-mono py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: days[0].getDay() }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}

        {days.map((day) => {
          const dateStr = format(day, 'yyyy-MM-dd')
          const dotColor = getDotColor(dateStr)
          const isSelected = isSameDay(day, selectedDate)
          const _isToday = isToday(day)
          const actCount = (activitiesByDate[dateStr] || []).length

          return (
            <button
              key={dateStr}
              onClick={() => setSelectedDate(day)}
              className="aspect-square rounded-xl flex flex-col items-center justify-center gap-0.5 transition-all duration-150"
              style={{
                background: isSelected
                  ? 'rgba(255,45,120,0.2)'
                  : _isToday
                  ? 'rgba(255,255,255,0.06)'
                  : actCount > 0
                  ? 'rgba(255,255,255,0.03)'
                  : 'transparent',
                border: isSelected
                  ? '1px solid rgba(255,45,120,0.5)'
                  : _isToday
                  ? '1px solid rgba(255,255,255,0.1)'
                  : '1px solid transparent',
              }}
            >
              <span
                className="text-sm font-body leading-none"
                style={{
                  color: isSelected ? '#ff2d78' : _isToday ? '#fff' : 'rgba(255,255,255,0.65)',
                  fontWeight: isSelected || _isToday ? 600 : 400,
                }}
              >
                {format(day, 'd')}
              </span>
              {dotColor && (
                <div className="w-1 h-1 rounded-full" style={{ background: dotColor }} />
              )}
            </button>
          )
        })}
      </div>

      {/* Selected day panel */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-display text-base text-white">
              {isToday(selectedDate) ? t('planner.today') : format(selectedDate, 'EEEE')}
            </h3>
            <p className="text-white/40 text-xs font-body">
              {format(selectedDate, 'MMMM d, yyyy')}
            </p>
          </div>
          <button
            onClick={() => handleCreateForDate(selectedDate)}
            className="btn-primary flex items-center gap-1.5 text-xs px-3 py-2"
          >
            <Plus size={13} />
            {t('planner.addActivity')}
          </button>
        </div>

        {selectedActivities.length > 0 ? (
          <div className="space-y-2.5">
            {selectedActivities.map((a) => (
              <ActivityCard key={a.id} activity={a} />
            ))}
          </div>
        ) : (
          <div
            className="rounded-xl p-6 text-center"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.08)' }}
          >
            <p className="text-white/30 font-body text-sm">{t('planner.noActivities')}</p>
            <button
              onClick={() => handleCreateForDate(selectedDate)}
              className="mt-2 text-neon-pink text-xs font-body hover:underline"
            >
              {t('planner.addSomething')}
            </button>
          </div>
        )}
      </div>

      {/* All planned days */}
      {Object.keys(activitiesByDate).length > 0 && (
        <div>
          <h3 className="font-display text-base text-white/70 mb-3">{t('planner.allPlannedDays')}</h3>
          <div className="space-y-3">
            {Object.entries(activitiesByDate)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([dateStr, acts]) => (
                <div key={dateStr}>
                  <button
                    onClick={() => {
                      setSelectedDate(new Date(dateStr + 'T12:00:00'))
                      const d = new Date(dateStr + 'T12:00:00')
                      if (!isSameMonth(d, currentMonth)) setCurrentMonth(d)
                    }}
                    className="text-xs font-mono text-white/40 hover:text-white/70 mb-1.5 block transition-colors"
                  >
                    {format(new Date(dateStr + 'T12:00:00'), 'EEEE, MMM d')}
                  </button>
                  <div className="space-y-2">
                    {acts.map((a) => (
                      <ActivityCard key={a.id} activity={a} />
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {showCreateModal && (
        <CreateActivityModal
          date={createDate}
          onClose={() => setShowCreateModal(false)}
        />
      )}
    </div>
  )
}
