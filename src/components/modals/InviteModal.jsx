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
      <div
        className="modal-card glass-strong rounded-2xl w-full max-w-sm mx-auto overflow-hidden"
        style={{ border: '1px solid rgba(0,229,255,0.2)' }}
      >
        <div className="flex items-center justify-between p-5 border-b border-white/8">
          <div className="flex items-center gap-2">
            <Users size={16} className="text-neon-cyan" />
            <h2 className="font-display text-lg text-white">{t('modals.invite.title')}</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center"
          >
            <X size={15} className="text-white/60" />
          </button>
        </div>

        <div className="p-6 text-center space-y-5">
          <div className="text-5xl">💌</div>
          <div>
            <h3 className="text-white font-display text-xl mb-1">{t('modals.invite.heading')}</h3>
            <p className="text-white/50 text-sm font-body">
              {t('modals.invite.body')}{' '}
              <span className="text-neon-cyan">{coupleSpace?.name}</span>
            </p>
          </div>

          <div
            className="rounded-xl p-4 text-center"
            style={{ background: 'rgba(0,229,255,0.05)', border: '1px solid rgba(0,229,255,0.2)' }}
          >
            <p className="text-xs font-mono text-white/40 mb-1 uppercase tracking-widest">
              {t('modals.invite.codeLabel')}
            </p>
            <p className="font-mono text-xl text-neon-cyan tracking-widest">{inviteCode}</p>
          </div>

          <button
            onClick={copyCode}
            className="w-full py-3 rounded-xl font-body font-medium text-sm flex items-center justify-center gap-2 transition-all"
            style={{
              background: copied ? 'rgba(0,255,136,0.15)' : 'rgba(0,229,255,0.15)',
              border: `1px solid ${copied ? 'rgba(0,255,136,0.4)' : 'rgba(0,229,255,0.3)'}`,
              color: copied ? '#00ff88' : '#00e5ff',
            }}
          >
            {copied ? (
              <><Check size={14} />{t('modals.invite.copied')}</>
            ) : (
              <><Copy size={14} />{t('modals.invite.copyCode')}</>
            )}
          </button>

          <p className="text-white/25 text-xs font-body">{t('modals.invite.emailSoon')}</p>
        </div>
      </div>
    </div>
  )
}
