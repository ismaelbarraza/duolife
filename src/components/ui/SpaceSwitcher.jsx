import React, { useState } from 'react'
import { ChevronDown, X, Check, Pencil, Plus, Users } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useApp } from '../../hooks/useAppContext'
import CreateSpaceModal from '../modals/CreateSpaceModal'
import EditSpaceModal from '../modals/EditSpaceModal'
import JoinSpaceModal from '../modals/JoinSpaceModal'

const FREE_PLAN_MAX_SPACES = 2

export default function SpaceSwitcher() {
  const { t } = useTranslation()
  const { spaces, currentSpace, currentSpaceId, switchSpace } = useApp()
  const [open, setOpen] = useState(false)
  const [showCreate, setShowCreate] = useState(false)
  const [showJoin, setShowJoin] = useState(false)
  const [editingSpace, setEditingSpace] = useState(null)

  const atLimit = spaces.length >= FREE_PLAN_MAX_SPACES

  if (!currentSpace) return null

  return (
    <>
      {/* Trigger */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm transition-all hover:shadow-md active:scale-[0.98]"
        >
          <span className="text-base leading-none">{currentSpace.emoji}</span>
          <span className="font-body font-medium text-sm text-slate-800 max-w-[120px] truncate">{currentSpace.name}</span>
          <ChevronDown size={12} className="text-slate-400 shrink-0" />
        </button>

        <span className="px-2 py-0.5 rounded-full text-[10px] font-body font-medium bg-amber-50 border border-amber-200 text-amber-700 uppercase tracking-wider">
          {t('spaces.freePlan')}
        </span>
      </div>

      {/* Sheet overlay */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
          style={{ background: 'rgba(15,23,42,0.3)', backdropFilter: 'blur(4px)' }}
          onClick={e => e.target === e.currentTarget && setOpen(false)}
        >
          <div
            className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-lg mb-20 sm:mb-0 border-t sm:border border-slate-100 sm:shadow-xl"
            style={{
              animation: 'slideUp 0.25s ease',
              maxHeight: '75svh',
              overflowY: 'auto',
              paddingBottom: 'env(safe-area-inset-bottom)',
            }}
          >
            {/* Sheet header */}
            <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-slate-100">
              <h3 className="font-body font-semibold text-base text-slate-900">{t('spaces.mySpaces')}</h3>
              <button
                onClick={() => setOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
              >
                <X size={14} className="text-slate-500" />
              </button>
            </div>

            {/* Space list */}
            <div className="p-4 space-y-2">
              {spaces.map(space => {
                const isActive = space.id === currentSpaceId
                return (
                  <div
                    key={space.id}
                    className="flex items-center gap-3 px-3 py-3 rounded-2xl transition-all"
                    style={{
                      background: isActive ? '#f5f3ff' : '#fafaf9',
                      border: `1px solid ${isActive ? '#ddd6fe' : '#f1f5f9'}`,
                    }}
                  >
                    <span className="text-2xl">{space.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-body font-medium text-slate-800 truncate">{space.name}</p>
                      <p className="text-xs font-body text-slate-400 mt-0.5">
                        {t(`spaces.types.${space.type}`) || space.type}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {isActive && (
                        <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-body font-medium bg-violet-100 text-violet-700">
                          <Check size={9} />
                          {t('spaces.active')}
                        </span>
                      )}
                      <button
                        onClick={e => { e.stopPropagation(); setOpen(false); setEditingSpace(space) }}
                        className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
                        title={t('spaces.edit')}
                      >
                        <Pencil size={12} className="text-slate-400" />
                      </button>
                      {!isActive && (
                        <button
                          onClick={() => { switchSpace(space.id); setOpen(false) }}
                          className="px-2.5 py-1 rounded-full text-xs font-body font-medium transition-all hover:scale-105 bg-violet-100 text-violet-700 border border-violet-200"
                        >
                          Switch
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Add space / upgrade */}
            <div className="px-4 pb-5 space-y-2">
              {atLimit ? (
                <div className="rounded-2xl p-3 text-center space-y-2 bg-amber-50 border border-amber-100">
                  <p className="text-xs font-body text-amber-700">{t('spaces.maxSpacesReached')}</p>
                  <p className="text-[11px] font-body text-slate-500">{t('spaces.upgradeMessage')}</p>
                  <button className="px-4 py-1.5 rounded-full text-xs font-body font-medium bg-amber-100 border border-amber-200 text-amber-700 transition-all">
                    {t('spaces.upgrade')} ✨
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => { setOpen(false); setShowCreate(true) }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl text-sm font-body text-slate-400 transition-all hover:bg-slate-50 border border-dashed border-slate-200"
                >
                  <Plus size={14} />
                  {t('spaces.create')}
                </button>
              )}

              <button
                onClick={() => { setOpen(false); setShowJoin(true) }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl text-sm font-body font-medium transition-all hover:bg-emerald-50 border border-dashed"
                style={{ color: '#059669', borderColor: '#a7f3d0' }}
              >
                <Users size={14} />
                {t('spaces.joinSpace')}
              </button>

              <div className="flex items-center justify-center gap-1.5 pt-1">
                <span className="text-[10px] font-body text-slate-300 uppercase tracking-wider">FREE PLAN</span>
                <span className="text-slate-200 text-xs">·</span>
                <span className="text-[10px] font-body text-slate-300">{spaces.length}/{FREE_PLAN_MAX_SPACES} spaces</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {showCreate && <CreateSpaceModal onClose={() => setShowCreate(false)} />}
      {showJoin && <JoinSpaceModal onClose={() => setShowJoin(false)} />}
      {editingSpace && (
        <EditSpaceModal
          space={editingSpace}
          onClose={() => setEditingSpace(null)}
        />
      )}
    </>
  )
}
