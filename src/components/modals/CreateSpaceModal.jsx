import React, { useState } from 'react'
import { X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useApp } from '../../hooks/useAppContext'
import { SPACE_TYPES, AVATAR_EMOJIS } from '../../data/mockData'

const FREE_PLAN_MAX_SPACES = 2
const FREE_PLAN_MAX_MEMBERS = 3

export default function CreateSpaceModal({ onClose }) {
  const { t } = useTranslation()
  const { myProfile, spaces, createSpace } = useApp()
  const [form, setForm] = useState({ name: '', type: '' })
  const [members, setMembers] = useState([])
  const [error, setError] = useState('')
  const [showEmojiFor, setShowEmojiFor] = useState(null)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const canAddMember = 1 + members.length < FREE_PLAN_MAX_MEMBERS
  const atSpaceLimit = spaces.length >= FREE_PLAN_MAX_SPACES

  const addMember = () => {
    if (!canAddMember) return
    setMembers(m => [...m, { emoji: '👩', name: '' }])
  }

  const removeMember = (i) => {
    setMembers(m => m.filter((_, idx) => idx !== i))
    if (showEmojiFor === i) setShowEmojiFor(null)
  }

  const updateMember = (i, k, v) =>
    setMembers(m => m.map((mem, idx) => idx === i ? { ...mem, [k]: v } : mem))

  const handleSubmit = () => {
    if (!form.name.trim()) return setError(t('spaces.modals.create.errors.noName'))
    if (!form.type) return setError(t('spaces.modals.create.errors.noType'))
    setError('')

    const me = myProfile ? { name: myProfile.name, emoji: myProfile.emoji } : { name: 'Me', emoji: '🧔' }
    createSpace(form, [me, ...members])
    onClose()
  }

  if (atSpaceLimit) {
    return (
      <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
        <div className="modal-card bg-white rounded-3xl w-full max-w-sm mx-auto overflow-hidden shadow-xl border border-slate-100">
          <div className="flex items-center justify-between p-5 border-b border-slate-100">
            <h2 className="font-body font-bold text-lg text-slate-900">{t('spaces.modals.create.title')}</h2>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors">
              <X size={15} className="text-slate-500" />
            </button>
          </div>
          <div className="p-6 text-center space-y-4">
            <div className="text-4xl">🔒</div>
            <p className="text-amber-700 font-body text-sm font-medium">{t('spaces.maxSpacesReached')}</p>
            <p className="text-slate-400 text-xs font-body">{t('spaces.upgradeMessage')}</p>
            <button className="w-full py-2.5 rounded-full font-body font-medium text-sm bg-amber-100 border border-amber-200 text-amber-700 transition-all active:scale-95">
              {t('spaces.upgrade')} ✨
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div
        className="modal-card bg-white rounded-3xl w-full max-w-md mx-auto overflow-hidden shadow-xl border border-slate-100"
        style={{ maxHeight: '90svh', overflowY: 'auto' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <div>
            <h2 className="font-body font-bold text-lg text-slate-900">{t('spaces.modals.create.title')}</h2>
            <p className="text-slate-400 text-xs font-body mt-0.5">{t('spaces.modals.create.subtitle')}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors">
            <X size={15} className="text-slate-500" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {error && (
            <p className="text-rose-600 text-sm font-body bg-rose-50 border border-rose-100 rounded-xl px-3 py-2">
              {error}
            </p>
          )}

          {/* Name */}
          <div>
            <label className="text-slate-500 text-xs font-body font-medium uppercase tracking-wider block mb-1.5">
              {t('spaces.modals.create.name')} *
            </label>
            <input
              className="input-field"
              placeholder={t('spaces.modals.create.namePlaceholder')}
              value={form.name}
              onChange={e => set('name', e.target.value)}
            />
          </div>

          {/* Type */}
          <div>
            <label className="text-slate-500 text-xs font-body font-medium uppercase tracking-wider block mb-2">
              {t('spaces.modals.create.type')} *
            </label>
            <div className="grid grid-cols-3 gap-2">
              {SPACE_TYPES.map(st => (
                <button
                  key={st.id}
                  onClick={() => set('type', st.id)}
                  className="py-2.5 rounded-2xl text-center transition-all"
                  style={{
                    background: form.type === st.id ? '#ede9fe' : '#f8fafc',
                    border: `1px solid ${form.type === st.id ? '#c4b5fd' : '#f1f5f9'}`,
                  }}
                >
                  <div className="text-xl mb-0.5">{st.emoji}</div>
                  <div className="text-xs font-body font-medium" style={{ color: form.type === st.id ? '#7c3aed' : '#94a3b8' }}>
                    {t(`spaces.types.${st.id}`)}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Members */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-slate-500 text-xs font-body font-medium uppercase tracking-wider">
                {t('spaces.modals.create.members')}
              </label>
              <span className="text-slate-300 text-xs font-body">{t('setup.membersHint')}</span>
            </div>

            <div className="space-y-2">
              {myProfile && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-violet-50 border border-violet-100">
                  <span className="text-xl">{myProfile.emoji}</span>
                  <span className="text-sm font-body text-slate-700 flex-1">{myProfile.name}</span>
                  <span className="text-xs font-body text-violet-500 font-medium">you</span>
                </div>
              )}

              {members.map((m, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowEmojiFor(showEmojiFor === i ? null : i)}
                      className="w-9 h-9 rounded-xl text-xl flex items-center justify-center bg-slate-50 border border-slate-200 transition-all"
                    >
                      {m.emoji}
                    </button>
                    <input
                      className="input-field flex-1 !py-2 text-sm"
                      placeholder="Name"
                      value={m.name}
                      onChange={e => updateMember(i, 'name', e.target.value)}
                    />
                    <button
                      onClick={() => removeMember(i)}
                      className="w-7 h-7 rounded-full bg-slate-100 hover:bg-rose-100 flex items-center justify-center transition-colors text-slate-400 hover:text-rose-500 text-sm"
                    >
                      ×
                    </button>
                  </div>
                  {showEmojiFor === i && (
                    <div className="flex flex-wrap gap-1 p-2 rounded-xl bg-slate-50 border border-slate-100">
                      {AVATAR_EMOJIS.map(e => (
                        <button
                          key={e}
                          onClick={() => { updateMember(i, 'emoji', e); setShowEmojiFor(null) }}
                          className="w-8 h-8 rounded-xl text-lg flex items-center justify-center transition-all hover:scale-110"
                          style={{
                            background: m.emoji === e ? '#ede9fe' : 'transparent',
                            border: `1px solid ${m.emoji === e ? '#c4b5fd' : 'transparent'}`,
                          }}
                        >
                          {e}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {canAddMember ? (
                <button
                  onClick={addMember}
                  className="w-full py-2 rounded-2xl text-sm font-body text-slate-400 transition-all border border-dashed border-slate-200 hover:bg-slate-50"
                >
                  {t('spaces.modals.create.addMember')}
                </button>
              ) : (
                <div className="text-center py-2 rounded-2xl text-xs font-body bg-amber-50 border border-amber-100 text-amber-700">
                  {t('spaces.maxMembersReached')}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-3 p-5 pt-0">
          <button onClick={onClose} className="btn-secondary flex-1">{t('common.cancel')}</button>
          <button onClick={handleSubmit} className="btn-primary flex-1">{t('spaces.modals.create.submit')}</button>
        </div>
      </div>
    </div>
  )
}
