import React, { useState } from 'react'
import { X, Copy, Check, Users } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useApp } from '../../hooks/useAppContext'

export default function InviteModal({ onClose }) {
  const { t } = useTranslation()
  const { coupleSpace } = useApp()
  const [copied, setCopied] = useState(false)

  const inviteCode = coupleSpace?.inviteCode || 'DUOLIFE-0000'

  const copyCode = () => {
    navigator.clipboard.writeText(inviteCode).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-card bg-white rounded-3xl w-full max-w-sm mx-auto overflow-hidden shadow-xl border border-slate-100">
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Users size={16} className="text-teal-500" />
            <h2 className="font-body font-bold text-lg text-slate-900">{t('modals.invite.title')}</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
          >
            <X size={15} className="text-slate-500" />
          </button>
        </div>

        <div className="p-6 text-center space-y-5">
          <div className="text-5xl">💌</div>
          <div>
            <h3 className="text-slate-900 font-body font-bold text-xl mb-1">{t('modals.invite.heading')}</h3>
            <p className="text-slate-500 text-sm font-body">
              {t('modals.invite.body')}{' '}
              <span className="text-violet-600 font-medium">{coupleSpace?.name}</span>
            </p>
          </div>

          <div className="rounded-2xl p-4 text-center bg-violet-50 border border-violet-100">
            <p className="text-xs font-body text-slate-400 mb-1 uppercase tracking-widest">
              {t('modals.invite.codeLabel')}
            </p>
            <p className="font-body font-bold text-xl text-violet-700 tracking-widest">{inviteCode}</p>
          </div>

          <button
            onClick={copyCode}
            className="w-full py-3 rounded-full font-body font-medium text-sm flex items-center justify-center gap-2 transition-all"
            style={{
              background: copied ? '#ecfdf5' : '#f5f3ff',
              border: `1px solid ${copied ? '#a7f3d0' : '#ddd6fe'}`,
              color: copied ? '#047857' : '#7c3aed',
            }}
          >
            {copied ? (
              <><Check size={14} />{t('modals.invite.copied')}</>
            ) : (
              <><Copy size={14} />{t('modals.invite.copyCode')}</>
            )}
          </button>

          <p className="text-slate-300 text-xs font-body">{t('modals.invite.emailSoon')}</p>

          <div className="rounded-2xl p-3 bg-amber-50 border border-amber-100">
            <p className="text-amber-700 font-body text-xs leading-relaxed text-center">
              {t('modals.invite.previewNote')}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
