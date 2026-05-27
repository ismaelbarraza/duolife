import React, { useState } from 'react'
import { X, Users } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export default function JoinSpaceModal({ onClose }) {
  const { t } = useTranslation()
  const [code, setCode] = useState('')

  return (
    <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-card bg-white rounded-3xl w-full max-w-sm mx-auto overflow-hidden shadow-xl border border-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Users size={16} className="text-emerald-500" />
            <h2 className="font-body font-bold text-lg text-slate-900">{t('setup.joinSpaceTitle')}</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
          >
            <X size={15} className="text-slate-500" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div className="text-4xl text-center">🔗</div>

          <div className="rounded-2xl p-4 bg-amber-50 border border-amber-100">
            <p className="text-amber-800 font-body text-sm leading-relaxed text-center">
              {t('setup.joinSpaceExplanation')}
            </p>
          </div>

          <div>
            <label className="text-slate-500 text-xs font-body font-medium uppercase tracking-wider block mb-1.5">
              {t('setup.inviteCodeLabel')}
            </label>
            <input
              className="input-field"
              placeholder={t('setup.inviteCodePlaceholder')}
              value={code}
              onChange={e => setCode(e.target.value.toUpperCase())}
            />
          </div>

          <button
            disabled
            className="w-full py-3 rounded-full font-body font-semibold text-sm cursor-not-allowed"
            style={{ background: '#f1f5f9', color: '#94a3b8', border: '1px solid #e2e8f0' }}
          >
            {t('setup.comingSoonBtn')}
          </button>
        </div>
      </div>
    </div>
  )
}
