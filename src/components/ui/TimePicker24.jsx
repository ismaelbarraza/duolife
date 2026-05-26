import React, { useState, useRef, useEffect } from 'react'
import { Clock, X } from 'lucide-react'

const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'))
const MINUTES = ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55']
const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/

export default function TimePicker24({ value = '', onChange, placeholder = 'HH:mm' }) {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState(value)
  const containerRef = useRef(null)
  const hourListRef = useRef(null)
  const minListRef = useRef(null)

  // Keep draft in sync when value changes externally
  useEffect(() => { setDraft(value) }, [value])

  // Close on outside click (using mousedown so it fires before blur)
  useEffect(() => {
    if (!open) return
    const handler = (e) => {
      if (!containerRef.current?.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  // Scroll selected items into view whenever picker opens
  useEffect(() => {
    if (!open) return
    const id = setTimeout(() => {
      if (TIME_RE.test(value)) {
        const [h, m] = value.split(':')
        hourListRef.current?.querySelector(`[data-h="${h}"]`)
          ?.scrollIntoView({ block: 'center', behavior: 'instant' })
        minListRef.current?.querySelector(`[data-m="${m}"]`)
          ?.scrollIntoView({ block: 'center', behavior: 'instant' })
      }
    }, 0)
    return () => clearTimeout(id)
  }, [open])

  const selHour = TIME_RE.test(value) ? value.split(':')[0] : null
  const selMin  = TIME_RE.test(value) ? value.split(':')[1] : null

  const commit = (h, m) => {
    const newVal = `${h}:${m}`
    onChange(newVal)
    setDraft(newVal)
  }

  const pickHour = (h) => {
    // Update value immediately with current or default minute; keep picker open
    commit(h, selMin ?? '00')
  }

  const pickMin = (m) => {
    commit(selHour ?? '00', m)
    setOpen(false)
  }

  const clear = () => {
    onChange('')
    setDraft('')
    setOpen(false)
  }

  const handleInputChange = (e) => {
    const v = e.target.value
    setDraft(v)
    if (v === '' || TIME_RE.test(v)) onChange(v)
  }

  const handleInputBlur = () => {
    // Reset draft to last valid value if user typed something invalid
    if (draft !== '' && !TIME_RE.test(draft)) setDraft(value)
  }

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger field */}
      <div className="relative">
        <input
          type="text"
          inputMode="numeric"
          className="input-field"
          style={{ paddingRight: '2rem' }}
          placeholder={placeholder}
          value={draft}
          maxLength={5}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onFocus={() => setOpen(true)}
        />
        {draft ? (
          <button
            type="button"
            tabIndex={-1}
            onMouseDown={(e) => { e.preventDefault(); clear() }}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-rose-400 transition-colors"
          >
            <X size={13} />
          </button>
        ) : (
          <button
            type="button"
            tabIndex={-1}
            onMouseDown={(e) => { e.preventDefault(); setOpen((o) => !o) }}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-violet-400 transition-colors"
          >
            <Clock size={13} />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute z-50 mt-1 left-0 bg-white rounded-2xl border border-slate-100 overflow-hidden"
          style={{ boxShadow: '0 8px 30px rgba(0,0,0,0.10)', minWidth: 152 }}
        >
          <div className="flex divide-x divide-slate-100">
            {/* Hours column */}
            <div className="flex-1 flex flex-col">
              <div className="text-center text-[10px] font-body font-semibold text-slate-400 uppercase tracking-widest py-1.5 bg-slate-50 shrink-0 border-b border-slate-100">
                Hr
              </div>
              <div ref={hourListRef} className="overflow-y-auto py-1" style={{ maxHeight: 188 }}>
                {HOURS.map((h) => {
                  const active = h === selHour
                  return (
                    <button
                      key={h}
                      data-h={h}
                      type="button"
                      onMouseDown={(e) => { e.preventDefault(); pickHour(h) }}
                      className="w-full text-center py-2 text-sm font-body font-medium transition-colors"
                      style={{
                        background: active ? '#ede9fe' : 'transparent',
                        color: active ? '#6d28d9' : '#64748b',
                      }}
                    >
                      {h}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Minutes column */}
            <div className="flex-1 flex flex-col">
              <div className="text-center text-[10px] font-body font-semibold text-slate-400 uppercase tracking-widest py-1.5 bg-slate-50 shrink-0 border-b border-slate-100">
                Min
              </div>
              <div ref={minListRef} className="overflow-y-auto py-1" style={{ maxHeight: 188 }}>
                {MINUTES.map((m) => {
                  const active = m === selMin
                  return (
                    <button
                      key={m}
                      data-m={m}
                      type="button"
                      onMouseDown={(e) => { e.preventDefault(); pickMin(m) }}
                      className="w-full text-center py-2 text-sm font-body font-medium transition-colors"
                      style={{
                        background: active ? '#ede9fe' : 'transparent',
                        color: active ? '#6d28d9' : '#64748b',
                      }}
                    >
                      {m}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
