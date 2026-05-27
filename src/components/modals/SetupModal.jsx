import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ChevronLeft, PlusCircle, Users } from 'lucide-react'
import { useApp } from '../../hooks/useAppContext'
import { SPACE_TYPES, AVATAR_EMOJIS } from '../../data/mockData'

const FREE_PLAN_MAX_MEMBERS = 3

const LANGUAGES = [
  { code: 'en', label: 'EN' },
  { code: 'es', label: 'ES' },
  { code: 'pt', label: 'PT' },
  { code: 'it', label: 'IT' },
]

export default function SetupModal({ onClose }) {
  const { t, i18n } = useTranslation()
  const { completeSetup } = useApp()
  // mode: 'choice' | 'create' | 'join'
  const [mode, setMode] = useState('choice')
  const [step, setStep] = useState(1)
  const [error, setError] = useState('')

  const [profile, setProfile] = useState({
    name: '',
    emoji: '🧔',
    language: i18n.language?.slice(0, 2) || 'en',
  })

  const [space, setSpace] = useState({
    name: '',
    type: '',
  })

  const [members, setMembers] = useState([])
  const [showEmojiFor, setShowEmojiFor] = useState(null)

  const setProfileField = (k, v) => setProfile(p => ({ ...p, [k]: v }))
  const setSpaceField = (k, v) => setSpace(s => ({ ...s, [k]: v }))

  const handleLanguageChange = (code) => {
    setProfileField('language', code)
    i18n.changeLanguage(code)
  }

  const handleStep1Next = () => {
    if (!profile.name.trim()) return setError(t('setup.errors.noName'))
    setError('')
    setStep(2)
  }

  const handleFinish = () => {
    if (!space.name.trim()) return setError(t('setup.errors.noSpaceName'))
    if (!space.type) return setError(t('setup.errors.noSpaceType'))
    setError('')
    completeSetup(profile, space, members)
    onClose()
  }

  const addMember = () => {
    if (1 + members.length >= FREE_PLAN_MAX_MEMBERS) return
    setMembers(m => [...m, { emoji: '👩', name: '' }])
  }

  const removeMember = (i) => {
    setMembers(m => m.filter((_, idx) => idx !== i))
    if (showEmojiFor === i) setShowEmojiFor(null)
  }

  const updateMember = (i, k, v) => {
    setMembers(m => m.map((mem, idx) => idx === i ? { ...mem, [k]: v } : mem))
  }

  const totalMembers = 1 + members.length
  const canAddMember = totalMembers < FREE_PLAN_MAX_MEMBERS
  const currentType = SPACE_TYPES.find(t => t.id === space.type)

  return (
    <div className="modal-backdrop">
      <div
        className="modal-card bg-white rounded-3xl w-full max-w-sm mx-auto overflow-hidden shadow-xl border border-slate-100"
        style={{ maxHeight: '92svh', overflowY: 'auto' }}
      >
        {mode === 'choice' && (
          <StepChoice
            onCreate={() => setMode('create')}
            onJoin={() => setMode('join')}
            t={t}
          />
        )}

        {mode === 'join' && (
          <StepJoin
            onBack={() => setMode('choice')}
            t={t}
          />
        )}

        {mode === 'create' && (
          <>
            {/* Progress bar */}
            <div className="flex gap-1.5 justify-center pt-6 px-6">
              {[1, 2].map(n => (
                <div
                  key={n}
                  className="h-1.5 rounded-full transition-all duration-300"
                  style={{
                    width: n === step ? '36px' : '12px',
                    background: n <= step ? '#8b5cf6' : '#e2e8f0',
                  }}
                />
              ))}
            </div>

            {step === 1 ? (
              <StepProfile
                profile={profile}
                setProfileField={setProfileField}
                handleLanguageChange={handleLanguageChange}
                showEmojiFor={showEmojiFor}
                setShowEmojiFor={setShowEmojiFor}
                error={error}
                onNext={handleStep1Next}
                onBack={() => { setError(''); setMode('choice') }}
                t={t}
              />
            ) : (
              <StepSpace
                space={space}
                setSpaceField={setSpaceField}
                profile={profile}
                members={members}
                addMember={addMember}
                removeMember={removeMember}
                updateMember={updateMember}
                canAddMember={canAddMember}
                currentType={currentType}
                showEmojiFor={showEmojiFor}
                setShowEmojiFor={setShowEmojiFor}
                error={error}
                onBack={() => { setError(''); setStep(1) }}
                onFinish={handleFinish}
                t={t}
              />
            )}
          </>
        )}
      </div>
    </div>
  )
}

function StepChoice({ onCreate, onJoin, t }) {
  return (
    <div className="p-6 space-y-5">
      <div className="text-center pt-2">
        <div className="text-5xl mb-3 inline-block animate-float">♾</div>
        <h2 className="font-body font-bold text-xl text-slate-900">{t('setup.choiceTitle')}</h2>
        <p className="text-slate-400 text-xs font-body uppercase tracking-widest mt-1">{t('setup.choiceSubtitle')}</p>
      </div>

      <div className="space-y-3 pt-2">
        <button
          onClick={onCreate}
          className="w-full flex items-center gap-4 p-4 rounded-2xl text-left transition-all border hover:scale-[1.02] active:scale-[0.98]"
          style={{ background: '#f5f3ff', borderColor: '#ddd6fe' }}
        >
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#ede9fe' }}>
            <PlusCircle size={20} style={{ color: '#7c3aed' }} />
          </div>
          <div>
            <div className="font-body font-semibold text-sm text-slate-800">{t('setup.createSpace')}</div>
            <div className="font-body text-xs text-slate-400 mt-0.5">{t('setup.createSpaceDesc')}</div>
          </div>
        </button>

        <button
          onClick={onJoin}
          className="w-full flex items-center gap-4 p-4 rounded-2xl text-left transition-all border hover:scale-[1.02] active:scale-[0.98]"
          style={{ background: '#f0fdf4', borderColor: '#bbf7d0' }}
        >
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#dcfce7' }}>
            <Users size={20} style={{ color: '#16a34a' }} />
          </div>
          <div>
            <div className="font-body font-semibold text-sm text-slate-800">{t('setup.joinSpace')}</div>
            <div className="font-body text-xs text-slate-400 mt-0.5">{t('setup.joinSpaceDesc')}</div>
          </div>
        </button>
      </div>
    </div>
  )
}

function StepJoin({ onBack, t }) {
  const [code, setCode] = useState('')

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
        >
          <ChevronLeft size={16} className="text-slate-600" />
        </button>
        <div>
          <h2 className="font-body font-bold text-xl text-slate-900">{t('setup.joinSpaceTitle')}</h2>
        </div>
      </div>

      <div className="rounded-2xl p-4 bg-amber-50 border border-amber-100">
        <p className="text-amber-800 font-body text-sm leading-relaxed">
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
          disabled
        />
      </div>

      <button
        disabled
        className="w-full py-3 rounded-full font-body font-semibold text-sm transition-all cursor-not-allowed"
        style={{ background: '#f1f5f9', color: '#94a3b8', border: '1px solid #e2e8f0' }}
      >
        {t('setup.comingSoonBtn')}
      </button>
    </div>
  )
}

function StepProfile({ profile, setProfileField, handleLanguageChange, showEmojiFor, setShowEmojiFor, error, onNext, onBack, t }) {
  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center gap-2">
        <button
          onClick={onBack}
          className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors flex-shrink-0"
        >
          <ChevronLeft size={16} className="text-slate-600" />
        </button>
        <div className="flex-1 text-center pr-8">
          <div className="text-5xl mb-1 inline-block animate-float">{profile.emoji}</div>
          <h2 className="font-body font-bold text-xl text-slate-900">{t('setup.step1Title')}</h2>
          <p className="text-slate-400 text-xs font-body uppercase tracking-widest mt-0.5">{t('setup.step1Sub')}</p>
        </div>
      </div>

      {error && (
        <p className="text-rose-600 text-sm font-body bg-rose-50 border border-rose-100 rounded-xl px-3 py-2 text-center">
          {error}
        </p>
      )}

      {/* Avatar */}
      <div>
        <label className="text-slate-500 text-xs font-body font-medium uppercase tracking-wider block mb-2">
          {t('setup.avatar')}
        </label>
        {showEmojiFor === 'profile' ? (
          <div className="flex flex-wrap gap-1.5">
            {AVATAR_EMOJIS.map(e => (
              <button
                key={e}
                onClick={() => { setProfileField('emoji', e); setShowEmojiFor(null) }}
                className="w-9 h-9 rounded-xl text-xl flex items-center justify-center transition-all"
                style={{
                  background: profile.emoji === e ? '#ede9fe' : '#f8fafc',
                  border: `1px solid ${profile.emoji === e ? '#c4b5fd' : '#f1f5f9'}`,
                  transform: profile.emoji === e ? 'scale(1.15)' : 'scale(1)',
                }}
              >
                {e}
              </button>
            ))}
          </div>
        ) : (
          <button
            onClick={() => setShowEmojiFor('profile')}
            className="flex items-center gap-3 px-4 py-2.5 rounded-2xl transition-all bg-violet-50 border border-violet-100 hover:bg-violet-100"
          >
            <span className="text-2xl">{profile.emoji}</span>
            <span className="text-slate-500 text-sm font-body">Tap to change</span>
          </button>
        )}
      </div>

      {/* Name */}
      <div>
        <label className="text-slate-500 text-xs font-body font-medium uppercase tracking-wider block mb-1.5">
          {t('setup.name')} *
        </label>
        <input
          className="input-field"
          placeholder={t('setup.namePlaceholder')}
          value={profile.name}
          onChange={e => setProfileField('name', e.target.value)}
          onKeyDown={e => e.key === 'Enter' && onNext()}
        />
      </div>

      {/* Language */}
      <div>
        <label className="text-slate-500 text-xs font-body font-medium uppercase tracking-wider block mb-2">
          {t('setup.language')}
        </label>
        <div className="flex gap-2">
          {LANGUAGES.map(l => (
            <button
              key={l.code}
              onClick={() => handleLanguageChange(l.code)}
              className="flex-1 py-2 rounded-full text-sm font-body font-medium transition-all"
              style={{
                background: profile.language === l.code ? '#ede9fe' : '#f8fafc',
                border: `1px solid ${profile.language === l.code ? '#c4b5fd' : '#f1f5f9'}`,
                color: profile.language === l.code ? '#7c3aed' : '#94a3b8',
              }}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={onNext}
        className="w-full py-3 rounded-full font-body font-semibold text-sm text-white bg-violet-500 hover:bg-violet-600 transition-all active:scale-95"
      >
        {t('setup.continue')}
      </button>
    </div>
  )
}

function StepSpace({
  space, setSpaceField, profile, members, addMember, removeMember, updateMember,
  canAddMember, currentType, showEmojiFor, setShowEmojiFor, error, onBack, onFinish, t
}) {
  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
        >
          <ChevronLeft size={16} className="text-slate-600" />
        </button>
        <div>
          <h2 className="font-body font-bold text-xl text-slate-900">{t('setup.step2Title')}</h2>
          <p className="text-slate-400 text-xs font-body uppercase tracking-widest">{t('setup.step2Sub')}</p>
        </div>
      </div>

      {error && (
        <p className="text-rose-600 text-sm font-body bg-rose-50 border border-rose-100 rounded-xl px-3 py-2 text-center">
          {error}
        </p>
      )}

      {/* Space name */}
      <div>
        <label className="text-slate-500 text-xs font-body font-medium uppercase tracking-wider block mb-1.5">
          {t('setup.spaceName')} *
        </label>
        <input
          className="input-field"
          placeholder={t('setup.spaceNamePlaceholder')}
          value={space.name}
          onChange={e => setSpaceField('name', e.target.value)}
        />
      </div>

      {/* Space type */}
      <div>
        <label className="text-slate-500 text-xs font-body font-medium uppercase tracking-wider block mb-2">
          {t('setup.spaceType')} *
        </label>
        <div className="grid grid-cols-3 gap-2">
          {SPACE_TYPES.map(st => (
            <button
              key={st.id}
              onClick={() => setSpaceField('type', st.id)}
              className="py-2.5 rounded-2xl text-center transition-all"
              style={{
                background: space.type === st.id ? '#ede9fe' : '#f8fafc',
                border: `1px solid ${space.type === st.id ? '#c4b5fd' : '#f1f5f9'}`,
              }}
            >
              <div className="text-xl mb-0.5">{st.emoji}</div>
              <div
                className="text-xs font-body font-medium"
                style={{ color: space.type === st.id ? '#7c3aed' : '#94a3b8' }}
              >
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
            {t('setup.members')}
          </label>
          <span className="text-slate-300 text-xs font-body">{t('setup.membersHint')}</span>
        </div>

        <div className="space-y-2">
          {/* Me row */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-violet-50 border border-violet-100">
            <span className="text-xl">{profile.emoji}</span>
            <span className="text-sm font-body text-slate-700 flex-1">{profile.name}</span>
            <span className="text-xs font-body text-violet-500 font-medium">you</span>
          </div>

          {/* Additional members */}
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
              {t('setup.addMember')}
            </button>
          ) : (
            <div className="text-center py-2 rounded-2xl text-xs font-body bg-amber-50 border border-amber-100 text-amber-700">
              {t('spaces.maxMembersReached')}
            </div>
          )}
        </div>
      </div>

      <button
        onClick={onFinish}
        className="w-full py-3 rounded-full font-body font-semibold text-sm text-white bg-violet-500 hover:bg-violet-600 transition-all active:scale-95"
      >
        {t('setup.finish')}
      </button>
    </div>
  )
}
