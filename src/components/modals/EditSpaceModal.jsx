import React, { useState } from 'react'
import { X, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useApp } from '../../hooks/useAppContext'
import { SPACE_TYPES, AVATAR_EMOJIS } from '../../data/mockData'

const FREE_PLAN_MAX_MEMBERS = 3

export default function EditSpaceModal({ space, onClose }) {
  const { t } = useTranslation()
  const { users, spaces, updateSpace, deleteSpace } = useApp()

  const [name, setName] = useState(space.name)
  const [type, setType] = useState(space.type)
  const [editedMembers, setEditedMembers] = useState(
    users.map((u, i) => ({ id: u.id, name: u.name, emoji: u.emoji, isAdmin: i === 0, removed: false }))
  )
  const [newMembers, setNewMembers] = useState([])
  const [showEmojiFor, setShowEmojiFor] = useState(null)
  const [confirmRemoveId, setConfirmRemoveId] = useState(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [error, setError] = useState('')

  const activeMembers = editedMembers.filter(m => !m.removed)
  const totalCount = activeMembers.length + newMembers.length
  const canAddMember = totalCount < FREE_PLAN_MAX_MEMBERS

  const updateMember = (id, k, v) =>
    setEditedMembers(m => m.map(mem => mem.id === id ? { ...mem, [k]: v } : mem))

  const markRemoved = (id) => {
    setEditedMembers(m => m.map(mem => mem.id === id ? { ...mem, removed: true } : mem))
    setConfirmRemoveId(null)
  }

  const addNewMember = () => {
    if (!canAddMember) return
    setNewMembers(m => [...m, { emoji: '👩', name: '' }])
  }

  const removeNewMember = (i) => {
    setNewMembers(m => m.filter((_, idx) => idx !== i))
    if (showEmojiFor === `new-${i}`) setShowEmojiFor(null)
  }

  const updateNewMember = (i, k, v) =>
    setNewMembers(m => m.map((mem, idx) => idx === i ? { ...mem, [k]: v } : mem))

  const handleSubmit = () => {
    if (!name.trim()) return setError(t('spaces.modals.edit.errors.noName'))
    setError('')

    const typeEntry = SPACE_TYPES.find(t => t.id === type)
    updateSpace(space.id, {
      name: name.trim(),
      type,
      emoji: typeEntry?.emoji || space.emoji,
      members: editedMembers,
      newMembers,
    })
    onClose()
  }

  const handleDeleteSpace = () => {
    deleteSpace(space.id)
    onClose()
  }

  if (showDeleteConfirm) {
    return (
      <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
        <div className="modal-card bg-white rounded-3xl w-full max-w-sm mx-auto overflow-hidden shadow-xl border border-slate-100">
          <div className="p-6 text-center space-y-4">
            <div className="text-4xl">⚠️</div>
            <div>
              <h3 className="font-body font-bold text-lg text-slate-900">{t('spaces.modals.edit.deleteSpaceConfirmTitle')}</h3>
              <p className="text-slate-500 text-sm font-body mt-2">{t('spaces.modals.edit.deleteSpaceConfirmBody')}</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-2.5 rounded-full font-body font-medium text-sm bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={handleDeleteSpace}
                className="flex-1 py-2.5 rounded-full font-body font-semibold text-sm text-white bg-rose-500 hover:bg-rose-600 transition-all active:scale-95"
              >
                {t('spaces.modals.edit.deleteSpaceConfirm')}
              </button>
            </div>
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
            <h2 className="font-body font-bold text-lg text-slate-900">{t('spaces.modals.edit.title')}</h2>
            <p className="text-slate-400 text-xs font-body mt-0.5">{t('spaces.modals.edit.subtitle')}</p>
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
              {t('spaces.modals.edit.name')} *
            </label>
            <input
              className="input-field"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>

          {/* Type */}
          <div>
            <label className="text-slate-500 text-xs font-body font-medium uppercase tracking-wider block mb-2">
              {t('spaces.modals.edit.type')}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {SPACE_TYPES.map(st => (
                <button
                  key={st.id}
                  onClick={() => setType(st.id)}
                  className="py-2.5 rounded-2xl text-center transition-all"
                  style={{
                    background: type === st.id ? '#ccfbf1' : '#f8fafc',
                    border: `1px solid ${type === st.id ? '#99f6e4' : '#f1f5f9'}`,
                  }}
                >
                  <div className="text-xl mb-0.5">{st.emoji}</div>
                  <div className="text-xs font-body font-medium" style={{ color: type === st.id ? '#0f766e' : '#94a3b8' }}>
                    {t(`spaces.types.${st.id}`)}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Members */}
          <div>
            <label className="text-slate-500 text-xs font-body font-medium uppercase tracking-wider block mb-2">
              {t('spaces.modals.edit.members')}
            </label>
            <div className="space-y-2">
              {/* Existing members */}
              {editedMembers.filter(m => !m.removed).map((m) => (
                <div key={m.id} className="space-y-1.5">
                  {confirmRemoveId === m.id ? (
                    <div className="rounded-2xl bg-rose-50 border border-rose-100 p-3 space-y-2">
                      <p className="text-xs font-body font-medium text-slate-700">{t('spaces.modals.edit.removeConfirmTitle')}</p>
                      <p className="text-xs text-slate-400 font-body">{t('spaces.modals.edit.removeConfirmBody')}</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setConfirmRemoveId(null)}
                          className="flex-1 py-1.5 rounded-full text-xs font-body font-medium bg-white text-slate-500 border border-slate-200 hover:bg-slate-50 transition-all"
                        >
                          {t('common.cancel')}
                        </button>
                        <button
                          onClick={() => markRemoved(m.id)}
                          className="flex-1 py-1.5 rounded-full text-xs font-body font-medium bg-rose-100 text-rose-600 border border-rose-200 hover:bg-rose-200 transition-all"
                        >
                          {t('spaces.modals.edit.removeConfirm')}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setShowEmojiFor(showEmojiFor === m.id ? null : m.id)}
                          className="w-9 h-9 rounded-xl text-xl flex items-center justify-center bg-slate-50 border border-slate-200 transition-all"
                        >
                          {m.emoji}
                        </button>
                        <input
                          className="input-field flex-1 !py-2 text-sm"
                          value={m.name}
                          onChange={e => updateMember(m.id, 'name', e.target.value)}
                        />
                        <span
                          className="text-[10px] font-body font-medium px-2 py-0.5 rounded-full shrink-0"
                          style={{
                            background: m.isAdmin ? '#ede9fe' : '#f1f5f9',
                            color: m.isAdmin ? '#7c3aed' : '#64748b',
                          }}
                        >
                          {m.isAdmin ? t('spaces.modals.edit.roleAdmin') : t('spaces.modals.edit.roleMember')}
                        </span>
                        {!m.isAdmin && (
                          <button
                            onClick={() => setConfirmRemoveId(m.id)}
                            className="w-7 h-7 rounded-full bg-slate-100 hover:bg-rose-100 flex items-center justify-center transition-colors text-slate-400 hover:text-rose-500 shrink-0"
                          >
                            <Trash2 size={12} />
                          </button>
                        )}
                      </div>
                      {showEmojiFor === m.id && (
                        <div className="flex flex-wrap gap-1 p-2 rounded-xl bg-slate-50 border border-slate-100">
                          {AVATAR_EMOJIS.map(e => (
                            <button
                              key={e}
                              onClick={() => { updateMember(m.id, 'emoji', e); setShowEmojiFor(null) }}
                              className="w-8 h-8 rounded-xl text-lg flex items-center justify-center transition-all hover:scale-110"
                              style={{
                                background: m.emoji === e ? '#ccfbf1' : 'transparent',
                                border: `1px solid ${m.emoji === e ? '#99f6e4' : 'transparent'}`,
                              }}
                            >
                              {e}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {/* New members */}
              {newMembers.map((m, i) => (
                <div key={`new-${i}`} className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowEmojiFor(showEmojiFor === `new-${i}` ? null : `new-${i}`)}
                      className="w-9 h-9 rounded-xl text-xl flex items-center justify-center bg-slate-50 border border-slate-200 transition-all"
                    >
                      {m.emoji}
                    </button>
                    <input
                      className="input-field flex-1 !py-2 text-sm"
                      placeholder="Name"
                      value={m.name}
                      onChange={e => updateNewMember(i, 'name', e.target.value)}
                    />
                    <button
                      onClick={() => removeNewMember(i)}
                      className="w-7 h-7 rounded-full bg-slate-100 hover:bg-rose-100 flex items-center justify-center transition-colors text-slate-400 hover:text-rose-500 text-sm shrink-0"
                    >
                      ×
                    </button>
                  </div>
                  {showEmojiFor === `new-${i}` && (
                    <div className="flex flex-wrap gap-1 p-2 rounded-xl bg-slate-50 border border-slate-100">
                      {AVATAR_EMOJIS.map(e => (
                        <button
                          key={e}
                          onClick={() => { updateNewMember(i, 'emoji', e); setShowEmojiFor(null) }}
                          className="w-8 h-8 rounded-xl text-lg flex items-center justify-center transition-all hover:scale-110"
                          style={{
                            background: m.emoji === e ? '#ccfbf1' : 'transparent',
                            border: `1px solid ${m.emoji === e ? '#99f6e4' : 'transparent'}`,
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
                  onClick={addNewMember}
                  className="w-full py-2 rounded-2xl text-sm font-body text-slate-400 transition-all border border-dashed border-slate-200 hover:bg-slate-50"
                >
                  {t('spaces.modals.edit.addMember')}
                </button>
              ) : (
                <div className="text-center py-2 rounded-2xl text-xs font-body bg-amber-50 border border-amber-100 text-amber-700">
                  {t('spaces.maxMembersReached')}
                </div>
              )}
            </div>
          </div>

          {/* Delete space */}
          {spaces.length > 1 && (
            <div className="pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center gap-1.5 text-slate-400 hover:text-rose-500 text-xs font-body transition-colors"
              >
                <Trash2 size={13} />
                {t('spaces.modals.edit.deleteSpace')}
              </button>
            </div>
          )}
        </div>

        <div className="flex gap-3 p-5 pt-0">
          <button onClick={onClose} className="btn-secondary flex-1">{t('common.cancel')}</button>
          <button
            onClick={handleSubmit}
            className="flex-1 py-2.5 rounded-full font-body font-semibold text-sm text-white bg-teal-500 hover:bg-teal-600 transition-all active:scale-95"
          >
            {t('spaces.modals.edit.submit')}
          </button>
        </div>
      </div>
    </div>
  )
}
