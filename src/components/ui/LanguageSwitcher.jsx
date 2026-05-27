import React, { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Globe } from 'lucide-react'

const LANGUAGES = [
  { code: 'en', native: 'English',    display: 'EN' },
  { code: 'es', native: 'Español',    display: 'ES' },
  { code: 'pt', native: 'Português',  display: 'PT' },
  { code: 'it', native: 'Italiano',   display: 'IT' },
  { code: 'nl', native: 'Nederlands', display: 'NL' },
  { code: 'de', native: 'Deutsch',    display: 'DE' },
  { code: 'zh', native: '中文',       display: '中文' },
  { code: 'fr', native: 'Français',   display: 'FR' },
  { code: 'ru', native: 'Русский',    display: 'RU' },
]

export default function LanguageSwitcher() {
  const { i18n } = useTranslation()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  const activeLang = LANGUAGES.find((l) => l.code === i18n.language) || LANGUAGES[0]

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-body font-medium bg-white border border-slate-200 text-slate-500 hover:border-slate-300 transition-all"
      >
        <Globe size={11} />
        <span>{activeLang.display}</span>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1.5 rounded-2xl overflow-hidden z-50 bg-white border border-slate-100 shadow-md min-w-[130px] max-h-72 overflow-y-auto">
          {LANGUAGES.map((lang) => {
            const active = lang.code === i18n.language
            return (
              <button
                key={lang.code}
                onClick={() => {
                  i18n.changeLanguage(lang.code)
                  setOpen(false)
                }}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-left text-xs font-body transition-colors hover:bg-slate-50"
                style={{ color: active ? '#7c3aed' : '#64748b' }}
              >
                {active && (
                  <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 bg-violet-500" />
                )}
                {!active && <span className="w-1.5 h-1.5 flex-shrink-0" />}
                {lang.native}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
