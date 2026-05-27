import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Plus, X, ShuffleIcon, ListOrdered, RefreshCw } from 'lucide-react'
import { truthOrDareContent, adultRules } from '../../data/truthOrDareContent'
import { getRandomInt, pickWithAntiRepeat } from '../../utils/random'

const PAGE_BG = 'linear-gradient(160deg, #fff1f2 0%, #fdf2f8 50%, #f5f3ff 100%)'

const MODES = [
  { id: 'normal', label: 'Normal', emoji: '😄', color: '#475569', activeBg: '#f1f5f9', activeBorder: '#cbd5e1' },
  { id: 'picante', label: 'Picante', emoji: '🌶️', color: '#9f1239', activeBg: '#fff1f2', activeBorder: '#fecdd3' },
  { id: 'adulto', label: 'Adulto +18', emoji: '🔞', color: '#be123c', activeBg: '#fff1f2', activeBorder: '#fda4af' },
]

const REVEAL_STYLE_ID = 'tor-reveal-keyframes'

function AdultModal({ onConfirm, onCancel }) {
  return (
    <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && onCancel()}>
      <div className="modal-card bg-white rounded-3xl w-full max-w-sm mx-auto overflow-hidden shadow-xl border border-slate-100 p-6">
        <div className="text-center space-y-4">
          <div className="text-4xl">🔞</div>
          <div>
            <h3 className="font-body font-bold text-lg text-slate-900">Modo Adulto +18</h3>
            <p className="text-slate-500 font-body text-xs mt-1 leading-relaxed">
              Contenido para adultos. Confirma que todos los participantes son mayores de edad.
            </p>
          </div>
          <div className="bg-rose-50 rounded-xl border border-rose-100 p-3 text-left">
            <p className="text-rose-700 font-body text-xs font-semibold mb-1.5">Reglas</p>
            <ul className="space-y-1">
              {adultRules.map((rule, i) => (
                <li key={i} className="text-rose-600 font-body text-xs flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-rose-400 shrink-0" />
                  {rule}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex gap-3">
            <button onClick={onCancel} className="btn-secondary flex-1 !text-sm">
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 py-2.5 rounded-full font-body font-semibold text-sm text-white bg-rose-500 hover:bg-rose-600 transition-all active:scale-95"
            >
              Confirmar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function TruthOrDareGame() {
  const navigate = useNavigate()

  const [phase, setPhase] = useState('SETUP')
  const [players, setPlayers] = useState([])
  const [newPlayer, setNewPlayer] = useState('')
  const [mode, setMode] = useState('normal')
  const [turnMode, setTurnMode] = useState('sequential')
  const [showAdultModal, setShowAdultModal] = useState(false)
  const [error, setError] = useState('')

  const [currentIdx, setCurrentIdx] = useState(0)
  const [promptType, setPromptType] = useState(null)
  const [prompt, setPrompt] = useState(null)
  const [revealKey, setRevealKey] = useState(0)

  useEffect(() => {
    if (document.getElementById(REVEAL_STYLE_ID)) return
    const style = document.createElement('style')
    style.id = REVEAL_STYLE_ID
    style.textContent = `
      @keyframes torReveal {
        from { opacity: 0; transform: scale(0.93) translateY(10px); }
        to   { opacity: 1; transform: scale(1) translateY(0); }
      }
    `
    document.head.appendChild(style)
  }, [])

  const addPlayer = () => {
    const name = newPlayer.trim()
    if (!name) return
    if (players.map((p) => p.toLowerCase()).includes(name.toLowerCase())) {
      setError('Nombre duplicado')
      return
    }
    setPlayers((prev) => [...prev, name])
    setNewPlayer('')
    setError('')
  }

  const removePlayer = (i) => setPlayers((prev) => prev.filter((_, idx) => idx !== i))

  const handleKeyDown = (e) => { if (e.key === 'Enter') addPlayer() }

  const requestMode = (m) => {
    if (m === 'adulto') { setShowAdultModal(true); return }
    setMode(m)
    setPrompt(null)
    setPromptType(null)
  }

  const confirmAdult = () => {
    setMode('adulto')
    setShowAdultModal(false)
    setPrompt(null)
    setPromptType(null)
  }

  const startGame = () => {
    if (players.length < 2) { setError('Se necesitan mínimo 2 jugadores'); return }
    setCurrentIdx(0)
    setPrompt(null)
    setPromptType(null)
    setPhase('PLAYING')
  }

  const choosePrompt = (type) => {
    const content = truthOrDareContent[mode]
    const pool = type === 'truth' ? content.truths : content.dares
    const storageKey = `tor_${type}_${mode}`
    const picked = pickWithAntiRepeat(pool, storageKey, 8)
    setPromptType(type)
    setPrompt(picked)
    setRevealKey((k) => k + 1)
  }

  const nextPlayer = () => {
    let next
    if (turnMode === 'sequential') {
      next = (currentIdx + 1) % players.length
    } else {
      const others = players.map((_, i) => i).filter((i) => i !== currentIdx || players.length === 1)
      next = others[getRandomInt(0, others.length - 1)]
    }
    setCurrentIdx(next)
    setPrompt(null)
    setPromptType(null)
  }

  const nextCard = () => {
    choosePrompt(promptType)
  }

  const currentMode = MODES.find((m) => m.id === mode)

  if (phase === 'PLAYING') {
    const currentPlayer = players[currentIdx]

    return (
      <div className="min-h-screen flex flex-col" style={{ background: PAGE_BG }}>
        <div className="max-w-lg sm:max-w-md mx-auto px-5 pt-8 pb-10 w-full">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => { setPhase('SETUP'); setPrompt(null); setPromptType(null) }}
                className="w-9 h-9 rounded-full bg-white/80 border border-slate-200 flex items-center justify-center hover:bg-white transition-all shadow-sm"
              >
                <ArrowLeft size={16} className="text-slate-500" />
              </button>
              <h1 className="font-body font-bold text-lg text-slate-900">Verdad o Reto</h1>
            </div>
            <span
              className="text-xs font-body font-semibold px-2.5 py-1 rounded-full"
              style={{ background: currentMode?.activeBg, color: currentMode?.color, border: `1px solid ${currentMode?.activeBorder}` }}
            >
              {currentMode?.emoji} {currentMode?.label}
            </span>
          </div>

          {/* Current player */}
          <div className="rounded-3xl p-5 text-center mb-5 bg-white border border-slate-100 shadow-sm">
            <p className="text-slate-400 font-body text-xs mb-1">
              {turnMode === 'sequential' ? `Jugador ${currentIdx + 1} de ${players.length}` : 'Turno de'}
            </p>
            <p className="font-body font-bold text-2xl text-slate-900">{currentPlayer}</p>
          </div>

          {/* Prompt display */}
          {prompt ? (
            <div
              key={revealKey}
              className="rounded-2xl p-5 mb-4 text-center border"
              style={{
                background: promptType === 'truth' ? '#f0fdf4' : '#fff7ed',
                borderColor: promptType === 'truth' ? '#86efac' : '#fde68a',
                animation: 'torReveal 0.35s ease',
              }}
            >
              <span
                className="text-xs font-body font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3 inline-block"
                style={{
                  background: promptType === 'truth' ? '#dcfce7' : '#fffbeb',
                  color: promptType === 'truth' ? '#166534' : '#92400e',
                }}
              >
                {promptType === 'truth' ? '🤔 Verdad' : '💪 Reto'}
              </span>
              <p className="font-body font-semibold text-base text-slate-800 leading-snug mt-2">
                {prompt}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 mb-5">
              <button
                onClick={() => choosePrompt('truth')}
                className="py-4 rounded-2xl font-body font-bold text-base text-white transition-all active:scale-95 hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #059669, #065f46)', boxShadow: '0 4px 12px rgba(5,150,105,0.3)' }}
              >
                🤔 Verdad
              </button>
              <button
                onClick={() => choosePrompt('dare')}
                className="py-4 rounded-2xl font-body font-bold text-base text-white transition-all active:scale-95 hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #f59e0b, #b45309)', boxShadow: '0 4px 12px rgba(245,158,11,0.3)' }}
              >
                💪 Reto
              </button>
            </div>
          )}

          {prompt && (
            <div className="space-y-2.5">
              <button
                onClick={nextPlayer}
                className="w-full py-3.5 rounded-2xl font-body font-semibold text-sm text-white transition-all active:scale-95"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #5b21b6)', boxShadow: '0 4px 12px rgba(124,58,237,0.2)' }}
              >
                Siguiente jugador →
              </button>
              <button
                onClick={nextCard}
                className="w-full py-3 rounded-2xl font-body font-medium text-sm text-slate-500 bg-white border border-slate-200 hover:bg-slate-50 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <RefreshCw size={13} />
                Otra carta
              </button>
            </div>
          )}

          <div className="mt-5 flex flex-wrap gap-2 justify-center">
            {players.map((p, i) => (
              <span
                key={i}
                className="px-2.5 py-1 rounded-full text-xs font-body transition-all"
                style={{
                  background: i === currentIdx ? '#ede9fe' : '#f8fafc',
                  color: i === currentIdx ? '#6d28d9' : '#94a3b8',
                  border: `1px solid ${i === currentIdx ? '#c4b5fd' : '#e2e8f0'}`,
                  fontWeight: i === currentIdx ? 700 : 400,
                }}
              >
                {p}
              </span>
            ))}
          </div>
        </div>

        {showAdultModal && (
          <AdultModal onConfirm={confirmAdult} onCancel={() => setShowAdultModal(false)} />
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: PAGE_BG }}>
      <div className="max-w-lg sm:max-w-md mx-auto px-5 pt-8 pb-10 w-full">
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => navigate('/play')}
            className="w-9 h-9 rounded-full bg-white/80 border border-slate-200 flex items-center justify-center hover:bg-white transition-all shadow-sm"
          >
            <ArrowLeft size={16} className="text-slate-500" />
          </button>
          <div>
            <h1 className="font-body font-bold text-xl text-slate-900">❓ Verdad o Reto</h1>
            <p className="text-slate-400 font-body text-xs">Responde o cumple un reto</p>
          </div>
        </div>

        <div className="space-y-4">
          {error && (
            <p className="text-rose-600 text-sm font-body bg-rose-50 border border-rose-100 rounded-xl px-3 py-2">{error}</p>
          )}

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
            <label className="text-slate-500 text-xs font-body font-medium uppercase tracking-wider block mb-3">
              Jugadores · mín. 2
            </label>
            {players.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {players.map((p, i) => (
                  <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-50 border border-rose-100">
                    <span className="text-xs font-body font-medium text-rose-700">{p}</span>
                    <button onClick={() => removePlayer(i)} className="text-rose-300 hover:text-rose-500 transition-colors">
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className="flex gap-2">
              <input
                className="input-field flex-1 !py-2 !text-sm"
                placeholder="Nombre del jugador..."
                value={newPlayer}
                onChange={(e) => setNewPlayer(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button
                onClick={addPlayer}
                className="w-9 h-9 rounded-xl flex items-center justify-center transition-all active:scale-95"
                style={{ background: '#fff1f2', color: '#be123c', border: '1px solid #fecdd3' }}
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
            <label className="text-slate-500 text-xs font-body font-medium uppercase tracking-wider block mb-3">
              Modo
            </label>
            <div className="flex rounded-2xl bg-slate-100 p-1 gap-1">
              {MODES.map((m) => (
                <button
                  key={m.id}
                  onClick={() => requestMode(m.id)}
                  className="flex-1 py-2 px-1 rounded-xl text-xs font-body font-semibold transition-all"
                  style={
                    mode === m.id
                      ? { background: 'white', color: m.color, boxShadow: '0 1px 4px rgba(0,0,0,0.1)' }
                      : { color: '#94a3b8' }
                  }
                >
                  {m.emoji} {m.label}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
            <label className="text-slate-500 text-xs font-body font-medium uppercase tracking-wider block mb-3">
              Orden de turnos
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setTurnMode('sequential')}
                className="flex-1 py-2.5 rounded-xl text-xs font-body font-semibold flex items-center justify-center gap-1.5 transition-all"
                style={{
                  background: turnMode === 'sequential' ? '#ede9fe' : '#f8fafc',
                  border: `1px solid ${turnMode === 'sequential' ? '#c4b5fd' : '#e2e8f0'}`,
                  color: turnMode === 'sequential' ? '#6d28d9' : '#64748b',
                }}
              >
                <ListOrdered size={13} />
                Secuencial
              </button>
              <button
                onClick={() => setTurnMode('random')}
                className="flex-1 py-2.5 rounded-xl text-xs font-body font-semibold flex items-center justify-center gap-1.5 transition-all"
                style={{
                  background: turnMode === 'random' ? '#ede9fe' : '#f8fafc',
                  border: `1px solid ${turnMode === 'random' ? '#c4b5fd' : '#e2e8f0'}`,
                  color: turnMode === 'random' ? '#6d28d9' : '#64748b',
                }}
              >
                <ShuffleIcon size={13} />
                Aleatorio
              </button>
            </div>
          </div>

          <button
            onClick={startGame}
            className="w-full py-4 rounded-2xl font-body font-bold text-base text-white transition-all active:scale-95 hover:opacity-90"
            style={{
              background: players.length >= 2
                ? 'linear-gradient(135deg, #be123c, #9f1239)'
                : '#fda4af',
              boxShadow: players.length >= 2 ? '0 4px 14px rgba(190,18,60,0.3)' : 'none',
            }}
          >
            {players.length < 2
              ? `Añade ${2 - players.length} jugador${2 - players.length !== 1 ? 'es' : ''} más`
              : 'Iniciar juego'}
          </button>
        </div>
      </div>

      {showAdultModal && (
        <AdultModal onConfirm={confirmAdult} onCancel={() => setShowAdultModal(false)} />
      )}
    </div>
  )
}
