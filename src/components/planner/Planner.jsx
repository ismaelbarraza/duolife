import React, { useState, useMemo, useRef, useEffect } from 'react'
import { ChevronLeft, ChevronRight, ChevronDown, Plus, LayoutList, CalendarDays } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval,
  isSameMonth, isToday, isSameDay } from 'date-fns'
import { useApp } from '../../hooks/useAppContext'
import ActivityCard from '../ui/ActivityCard'
import CreateActivityModal from '../modals/CreateActivityModal'

const CURRENT_YEAR = new Date().getFullYear()
const MIN_YEAR = CURRENT_YEAR - 10
const MAX_YEAR = CURRENT_YEAR + 10

function sortByTime(activities) {
  return [...activities].sort((a, b) => {
    if (!a.startTime && !b.startTime) return 0
    if (!a.startTime) return 1
    if (!b.startTime) return -1
    return a.startTime.localeCompare(b.startTime)
  })
}

export default function Planner() {
  const { t, i18n } = useTranslation()
  const { activities } = useApp()

  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [showAllDays, setShowAllDays] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [createDate, setCreateDate] = useState(null)

  const [showJump, setShowJump] = useState(false)
  const [jumpMonth, setJumpMonth] = useState(0)
  const [jumpYear, setJumpYear] = useState(CURRENT_YEAR)
  const jumpRef = useRef(null)

  const monthNames = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) =>
        new Intl.DateTimeFormat(i18n.language, { month: 'short' }).format(new Date(2000, i, 1))
      ),
    [i18n.language]
  )

  const weekdayNames = useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) =>
        new Intl.DateTimeFormat(i18n.language, { weekday: 'narrow' }).format(new Date(2000, 0, 2 + i))
      ),
    [i18n.language]
  )

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

  const days = useMemo(
    () => eachDayOfInterval({ start: startOfMonth(currentMonth), end: endOfMonth(currentMonth) }),
    [currentMonth]
  )

  const activitiesByDate = useMemo(() => {
    const map = {}
    activities.forEach((a) => {
      if (!map[a.date]) map[a.date] = []
      map[a.date].push(a)
    })
    return map
  }, [activities])

  const selectedDateStr = format(selectedDate, 'yyyy-MM-dd')
  const selectedActivities = useMemo(
    () => sortByTime(activitiesByDate[selectedDateStr] || []),
    [activitiesByDate, selectedDateStr]
  )

  const sortedAllDays = useMemo(
    () =>
      Object.entries(activitiesByDate)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([dateStr, acts]) => ({ dateStr, acts: sortByTime(acts) })),
    [activitiesByDate]
  )

  // Clicking same day toggles all-days view; clicking a different day focuses it
  const handleDayClick = (day) => {
    if (isSameDay(day, selectedDate)) {
      setShowAllDays((v) => !v)
    } else {
      setSelectedDate(day)
      setShowAllDays(false)
    }
  }

  const handleCreateForDate = (date) => {
    setCreateDate(format(date, 'yyyy-MM-dd'))
    setShowCreateModal(true)
  }

  const getDotColor = (dateStr) => {
    const acts = activitiesByDate[dateStr] || []
    if (!acts.length) return null
    if (acts.some((a) => a.status === 'pending')) return '#f59e0b'
    if (acts.some((a) => a.status === 'completed')) return '#10b981'
    return '#cbd5e1'
  }

  return (
    <div>
      {/* Responsive layout: stacked on mobile, 2-column on desktop */}
      <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-start space-y-5 lg:space-y-0">

        {/* LEFT: Calendar */}
        <div className="space-y-4">
          {/* Month header + jump dropdown */}
          <div className="relative" ref={jumpRef}>
            <div className="flex items-center justify-between">
              <button
                onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                className="w-9 h-9 rounded-full bg-white border border-slate-200 hover:bg-slate-50 flex items-center justify-center transition-colors shadow-sm"
              >
                <ChevronLeft size={16} className="text-slate-500" />
              </button>

              <button
                onClick={openJump}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all hover:bg-white hover:shadow-sm"
              >
                <span className="font-body font-bold text-xl text-slate-900">
                  {format(currentMonth, 'MMMM yyyy')}
                </span>
                <ChevronDown
                  size={14}
                  className="text-slate-400 transition-transform duration-200"
                  style={{ transform: showJump ? 'rotate(180deg)' : 'rotate(0deg)' }}
                />
              </button>

              <button
                onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                className="w-9 h-9 rounded-full bg-white border border-slate-200 hover:bg-slate-50 flex items-center justify-center transition-colors shadow-sm"
              >
                <ChevronRight size={16} className="text-slate-500" />
              </button>
            </div>

            {/* Jump-to dropdown */}
            {showJump && (
              <div
                className="absolute left-1/2 top-full mt-2 z-30 w-72 rounded-2xl overflow-hidden bg-white border border-slate-100 shadow-lg"
                style={{ transform: 'translateX(-50%)' }}
              >
                <div className="px-4 pt-4 pb-3 border-b border-slate-100">
                  <p className="text-xs font-body font-medium uppercase tracking-widest text-slate-400">
                    {t('planner.jumpTo.title')}
                  </p>
                </div>
                <div className="p-4 space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <button
                      onClick={() => adjustYear(-1)}
                      disabled={jumpYear <= MIN_YEAR}
                      className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors disabled:opacity-30"
                    >
                      <ChevronLeft size={15} className="text-slate-600" />
                    </button>
                    <span className="font-body font-bold text-2xl text-slate-900 tabular-nums">{jumpYear}</span>
                    <button
                      onClick={() => adjustYear(1)}
                      disabled={jumpYear >= MAX_YEAR}
                      className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors disabled:opacity-30"
                    >
                      <ChevronRight size={15} className="text-slate-600" />
                    </button>
                  </div>

                  <div className="grid grid-cols-4 gap-1.5">
                    {monthNames.map((name, idx) => {
                      const isActive = idx === jumpMonth
                      return (
                        <button
                          key={idx}
                          onClick={() => setJumpMonth(idx)}
                          className="py-2 rounded-xl text-xs font-body font-medium transition-all"
                          style={{
                            background: isActive ? '#ede9fe' : '#f8fafc',
                            border: `1px solid ${isActive ? '#c4b5fd' : '#f1f5f9'}`,
                            color: isActive ? '#6d28d9' : '#64748b',
                          }}
                        >
                          {name}
                        </button>
                      )
                    })}
                  </div>

                  <div className="flex gap-2 pt-1">
                    <button onClick={() => setShowJump(false)} className="btn-secondary flex-1 !py-2 text-sm">
                      {t('common.cancel')}
                    </button>
                    <button
                      onClick={handleJumpGo}
                      className="flex-1 py-2 rounded-full font-body font-medium text-sm text-white bg-violet-500 hover:bg-violet-600 transition-all"
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
              <div key={i} className="text-center text-slate-400 text-xs font-body py-1">{d}</div>
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

              return (
                <button
                  key={dateStr}
                  onClick={() => handleDayClick(day)}
                  className="aspect-square rounded-full flex flex-col items-center justify-center gap-0.5 transition-all duration-150"
                  style={{
                    background: isSelected ? '#8b5cf6' : _isToday ? '#f5f3ff' : 'transparent',
                    border: isSelected
                      ? '2px solid #7c3aed'
                      : _isToday
                      ? '1.5px solid #c4b5fd'
                      : '1px solid transparent',
                  }}
                >
                  <span
                    className="text-sm font-body leading-none"
                    style={{
                      color: isSelected ? '#ffffff' : _isToday ? '#6d28d9' : '#475569',
                      fontWeight: isSelected || _isToday ? 700 : 400,
                    }}
                  >
                    {format(day, 'd')}
                  </span>
                  {dotColor && !isSelected && (
                    <div className="w-1 h-1 rounded-full" style={{ background: dotColor }} />
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* RIGHT: Selected day panel + all planned days */}
        <div className="space-y-4">
          {/* Selected day panel */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-body font-semibold text-base text-slate-800">
                  {isToday(selectedDate) ? t('planner.today') : format(selectedDate, 'EEEE')}
                </h3>
                <p className="text-slate-400 text-xs font-body">
                  {format(selectedDate, 'MMMM d, yyyy')}
                </p>
              </div>
              <button
                onClick={() => handleCreateForDate(selectedDate)}
                className="btn-primary flex items-center gap-1.5 text-xs !px-3 !py-2"
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
              <div className="rounded-2xl p-6 text-center bg-white/70 border border-dashed border-slate-200">
                <p className="text-slate-400 font-body text-sm">{t('planner.noActivities')}</p>
                <button
                  onClick={() => handleCreateForDate(selectedDate)}
                  className="mt-2 text-violet-500 text-xs font-body hover:underline"
                >
                  {t('planner.addSomething')}
                </button>
              </div>
            )}

            {/* Toggle: show all days / focus selected */}
            {sortedAllDays.length > 0 && (
              <button
                onClick={() => setShowAllDays((v) => !v)}
                className="mt-3 w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-body text-slate-400 hover:text-violet-600 border border-dashed border-slate-200 hover:border-violet-200 transition-all"
              >
                {showAllDays ? (
                  <><CalendarDays size={12} />{t('planner.focusDay')}</>
                ) : (
                  <><LayoutList size={12} />{t('planner.showAllDays')}</>
                )}
              </button>
            )}
          </div>

          {/* All planned days — only when toggled on */}
          {showAllDays && sortedAllDays.length > 0 && (
            <div>
              <h3 className="font-body font-semibold text-base text-slate-600 mb-3">
                {t('planner.allPlannedDays')}
              </h3>
              <div className="space-y-4">
                {sortedAllDays.map(({ dateStr, acts }) => (
                  <div key={dateStr}>
                    <button
                      onClick={() => {
                        const d = new Date(dateStr + 'T12:00:00')
                        setSelectedDate(d)
                        setShowAllDays(false)
                        if (!isSameMonth(d, currentMonth)) setCurrentMonth(d)
                      }}
                      className="text-xs font-body text-slate-400 hover:text-violet-500 mb-1.5 block transition-colors"
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
        </div>
      </div>

      {showCreateModal && (
        <CreateActivityModal date={createDate} onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  )
}
