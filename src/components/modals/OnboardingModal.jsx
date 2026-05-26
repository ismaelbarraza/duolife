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
      <div className="modal-card bg-white rounded-3xl w-full max-w-sm mx-auto overflow-hidden shadow-xl border border-slate-100">
        {/* Progress dots */}
        <div className="flex gap-1.5 justify-center pt-6 px-6">
          {ONBOARDING_STEPS.map((_, i) => (
            <div
              key={i}
              className="h-1.5 rounded-full transition-all duration-300"
              style={{
                width: i === step ? '28px' : '8px',
                background: i <= step ? '#8b5cf6' : '#e2e8f0',
              }}
            />
          ))}
        </div>

        {/* Content */}
        <div className="p-8 text-center">
          <div className="text-6xl mb-5 animate-float inline-block">
            {current.emoji}
          </div>

          <div className="text-xs font-body font-semibold tracking-widest uppercase mb-2 text-violet-500">
            {t(`onboarding.steps.${current.id}.subtitle`)}
          </div>

          <h2 className="font-body font-bold text-2xl text-slate-900 mb-4 leading-tight">
            {t(`onboarding.steps.${current.id}.title`)}
          </h2>

          <p className="text-slate-500 font-body text-sm leading-relaxed">
            {t(`onboarding.steps.${current.id}.body`)}
          </p>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 space-y-3">
          <button
            onClick={handleNext}
            className="w-full py-3 rounded-full font-body font-semibold text-sm text-white bg-violet-500 hover:bg-violet-600 transition-all duration-200 active:scale-95"
          >
            {isLast ? t('onboarding.getStarted') : t('onboarding.next')}
          </button>

          {!isLast && (
            <button
              onClick={handleSkip}
              className="w-full py-2 text-slate-400 text-sm font-body hover:text-slate-600 transition-colors"
            >
              {t('onboarding.skip')}
            </button>
          )}

          <label className="flex items-center justify-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={dontShow}
              onChange={(e) => setDontShow(e.target.checked)}
              className="accent-violet-500 w-3.5 h-3.5"
            />
            <span className="text-slate-400 text-xs font-body">{t('onboarding.dontShow')}</span>
          </label>
        </div>
      </div>
    </div>
  )
}
