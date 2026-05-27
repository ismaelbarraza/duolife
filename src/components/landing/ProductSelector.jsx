import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowRight } from 'lucide-react'
import LanguageSwitcher from '../ui/LanguageSwitcher'

export default function ProductSelector() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <div
      className="min-h-screen flex flex-col overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #f5f3ff 0%, #fdf2f8 55%, #fff7ed 100%)' }}
    >
      {/* Decorative blobs — absolute, behind everything */}
      <div aria-hidden className="pointer-events-none select-none">
        <div
          className="absolute rounded-full"
          style={{
            width: 320, height: 320,
            top: -80, left: -100,
            background: 'radial-gradient(circle, #ddd6fe 0%, transparent 70%)',
            opacity: 0.5,
            filter: 'blur(40px)',
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: 260, height: 260,
            top: 60, right: -80,
            background: 'radial-gradient(circle, #fbcfe8 0%, transparent 70%)',
            opacity: 0.45,
            filter: 'blur(36px)',
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: 200, height: 200,
            bottom: 120, left: '40%',
            background: 'radial-gradient(circle, #fed7aa 0%, transparent 70%)',
            opacity: 0.4,
            filter: 'blur(32px)',
          }}
        />
      </div>

      {/* Language switcher — top right, unobtrusive */}
      <div className="flex justify-end px-5 pt-5 max-w-lg md:max-w-2xl mx-auto w-full relative z-30">
        <LanguageSwitcher />
      </div>

      {/* Hero */}
      <div className="relative z-10 px-6 pt-6 pb-2 max-w-lg md:max-w-2xl mx-auto w-full">
        {/* Brand mark */}
        <div className="mb-5">
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl text-3xl mb-4"
            style={{
              background: 'rgba(255,255,255,0.7)',
              border: '1px solid #e5e7eb',
              boxShadow: '0 2px 16px rgba(124,58,237,0.10)',
            }}
          >
            ♾
          </div>
          <h1 className="font-body font-bold text-4xl text-slate-900 tracking-tight leading-none mb-2">
            DuoLife
          </h1>
          <p className="text-slate-500 font-body text-sm leading-relaxed max-w-xs">
            {t('landing.tagline')}
          </p>
        </div>
      </div>

      {/* Product cards — stacked on mobile, side-by-side on desktop */}
      <div className="relative z-10 px-5 max-w-lg md:max-w-2xl mx-auto w-full pb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <ProductCard
            emoji="♾"
            accentColor="#6d28d9"
            accentBg="#ede9fe"
            accentBorder="#c4b5fd"
            cardBg="rgba(255,255,255,0.75)"
            title={t('landing.duolife.name')}
            description={t('landing.duolife.description')}
            cta={t('landing.duolife.cta')}
            onClick={() => navigate('/app')}
          />

          <ProductCard
            emoji="🎮"
            accentColor="#c2410c"
            accentBg="#fff7ed"
            accentBorder="#fed7aa"
            cardBg="rgba(255,255,255,0.75)"
            title={t('landing.play.name')}
            description={t('landing.play.description')}
            cta={t('landing.play.cta')}
            onClick={() => navigate('/play')}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 mt-auto pb-8 text-center">
        <p className="text-slate-300 font-body text-[11px]">DuoLife · 2025</p>
      </div>
    </div>
  )
}

function ProductCard({ emoji, accentColor, accentBg, accentBorder, cardBg, title, description, cta, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left rounded-3xl p-5 border transition-all duration-200 hover:scale-[1.012] active:scale-[0.99]"
      style={{
        background: cardBg,
        borderColor: accentBorder,
        boxShadow: '0 4px 20px rgba(0,0,0,0.07)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <div className="flex items-center gap-4">
        {/* Icon */}
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0"
          style={{ background: accentBg, border: `1px solid ${accentBorder}` }}
        >
          {emoji}
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <h2 className="font-body font-bold text-base leading-tight" style={{ color: accentColor }}>
            {title}
          </h2>
          <p className="text-slate-400 font-body text-xs leading-relaxed mt-0.5">
            {description}
          </p>
        </div>

        {/* Arrow */}
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
          style={{ background: accentBg, border: `1px solid ${accentBorder}` }}
        >
          <ArrowRight size={14} style={{ color: accentColor }} />
        </div>
      </div>

      {/* CTA pill */}
      <div className="mt-3.5 flex">
        <span
          className="text-xs font-body font-semibold px-3 py-1 rounded-full"
          style={{ background: accentBg, color: accentColor, border: `1px solid ${accentBorder}` }}
        >
          {cta}
        </span>
      </div>
    </button>
  )
}
