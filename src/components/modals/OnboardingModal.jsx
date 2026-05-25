import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ONBOARDING_STEPS } from '../../data/mockData'
import { markOnboardingDone } from '../../lib/dataService'

export default function OnboardingModal({ onClose }) {
  const { t } = useTranslation()
  const [step, setStep] = useState(0)
  const [dontShow, setDontShow] = useState(false)

  const current = ONBOARDING_STEPS[step]
  const isLast = step === ONBOARDING_STEPS.length - 1

  const handleNext = () => {
    if (isLast) {
      if (dontShow) markOnboardingDone()
      onClose()
    } else {
      setStep((s) => s + 1)
    }
  }

  const handleSkip = () => {
    if (dontShow) markOnboardingDone()
    onClose()
  }

  return (
    <div className="modal-backdrop">
      <div
        className="modal-card glass-strong rounded-2xl w-full max-w-sm mx-auto overflow-hidden"
        style={{ border: `1px solid ${current.color}30` }}
      >
        {/* Progress dots */}
        <div className="flex gap-1.5 justify-center pt-5 px-6">
          {ONBOARDING_STEPS.map((_, i) => (
            <div
              key={i}
              className="h-1 rounded-full transition-all duration-300"
              style={{
                width: i === step ? '24px' : '8px',
                background: i <= step ? current.color : 'rgba(255,255,255,0.15)',
              }}
            />
          ))}
        </div>

        {/* Content */}
        <div className="p-8 text-center">
          <div
            className="text-6xl mb-5 animate-float inline-block"
            style={{ filter: `drop-shadow(0 0 20px ${current.color}80)` }}
          >
            {current.emoji}
          </div>

          <div
            className="text-xs font-mono tracking-widest uppercase mb-2"
            style={{ color: current.color }}
          >
            {t(`onboarding.steps.${current.id}.subtitle`)}
          </div>

          <h2 className="font-display text-2xl text-white mb-4 leading-tight">
            {t(`onboarding.steps.${current.id}.title`)}
          </h2>

          <p className="text-white/60 font-body text-sm leading-relaxed">
            {t(`onboarding.steps.${current.id}.body`)}
          </p>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 space-y-3">
          <button
            onClick={handleNext}
            className="w-full py-3 rounded-xl font-body font-medium text-sm text-white transition-all duration-200 active:scale-95"
            style={{ background: current.color, boxShadow: `0 0 24px ${current.color}50` }}
          >
            {isLast ? t('onboarding.getStarted') : t('onboarding.next')}
          </button>

          {!isLast && (
            <button
              onClick={handleSkip}
              className="w-full py-2 text-white/40 text-sm font-body hover:text-white/60 transition-colors"
            >
              {t('onboarding.skip')}
            </button>
          )}

          <label className="flex items-center justify-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={dontShow}
              onChange={(e) => setDontShow(e.target.checked)}
              className="accent-pink-500 w-3.5 h-3.5"
            />
            <span className="text-white/40 text-xs font-body">{t('onboarding.dontShow')}</span>
          </label>
        </div>
      </div>
    </div>
  )
}
