import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Plus, X, RotateCcw } from 'lucide-react'
import { bottleModes, bottleActions, SPIN_DURATION_MS } from '../../data/bottleData'
import { getRandomInt, pickWithAntiRepeat } from '../../utils/random'

const PAGE_BG = 'linear-gradient(160deg, #fffbeb 0%, #fdf2f8 50%, #f5f3ff 100%)'
const POINTER_OFFSET = 0 // degrees — adjust if visual pointer is misaligned

function BottleSVG() {
  return (
    <svg width="182" height="56" viewBox="0 0 182 56" fill="none">
      <defs>
        <linearGradient id="bBodyG" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1a5220" />
          <stop offset="18%" stopColor="#2e7d32" />
          <stop offset="42%" stopColor="#43a047" />
          <stop offset="58%" stopColor="#43a047" />
          <stop offset="82%" stopColor="#2e7d32" />
          <stop offset="100%" stopColor="#0f3312" />
        </linearGradient>
        <linearGradient id="bNeckG" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1a4d1e" />
          <stop offset="50%" stopColor="#256028" />
          <stop offset="100%" stopColor="#0f3012" />
        </linearGradient>
        <linearGradient id="bHlG" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.82)" />
          <stop offset="50%" stopColor="rgba(255,255,255,0.28)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>
        <linearGradient id="bCapG" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#555" />
          <stop offset="100%" stopColor="#1a1a1a" />
        </linearGradient>
      </defs>
      {/* Shadow */}
      <ellipse cx="112" cy="53.5" rx="66" ry="4" fill="rgba(0,0,0,0.15)" />
      {/* Body */}
      <rect x="62" y="10" width="112" height="34" rx="17" fill="url(#bBodyG)" />
      {/* Shoulder */}
      <rect x="40" y="16" width="32" height="22" rx="9" fill="url(#bNeckG)" />
      {/* Neck — narrower */}
      <rect x="6" y="21" width="44" height="12" rx="5" fill="url(#bNeckG)" />
      {/* Cap */}
      <rect x="2" y="22" width="9" height="10" rx="3.5" fill="url(#bCapG)" />
      <rect x="2" y="22" width="9" height="5" rx="3.5" fill="rgba(255,255,255,0.12)" />
      {/* Glass highlight — main vertical band */}
      <rect x="70" y="12" width="11" height="22" rx="5.5" fill="url(#bHlG)" opacity="0.9" />
      {/* Thin secondary reflection */}
      <rect x="85" y="12" width="3" height="24" rx="1.5" fill="rgba(255,255,255,0.22)" />
      {/* Label recess */}
      <rect x="90" y="19" width="58" height="16" rx="5" fill="rgba(0,0,0,0.08)" />
      {/* Glass tint — subtle transparency on top half */}
      <rect x="62" y="10" width="112" height="17" rx="17" fill="rgba(255,255,255,0.05)" />
    </svg>
  )
}

function getPlayerByAngle(totalAngle, numPlayers) {
  if (numPlayers === 0) return null
  const normalized = ((totalAngle % 360) + 360) % 360
  const adjusted = (normalized + POINTER_OFFSET + 360) % 360
  const degreesPerPlayer = 360 / numPlayers
  return Math.floor(adjusted / degreesPerPlayer) % numPlayers
}

export default function BottleGame() {
  const navigate = useNavigate()

  const [players, setPlayers] = useState([])
  const [newPlayer, setNewPlayer] = useState('')
  const [mode, setMode] = useState('normal')
  const [rotation, setRotation] = useState(0)
  const [isSpinning, setIsSpinning] = useState(false)
  const [result, setResult] = useState(null)
  const [targetPlayerIndex, setTargetPlayerIndex] = useState(null)
  const [history, setHistory] = useState([])

  const addPlayer = () => {
    const name = newPlayer.trim()
    if (!name) return
    if (players.map((p) => p.toLowerCase()).includes(name.toLowerCase())) return
    setPlayers((prev) => [...prev, name])
    setNewPlayer('')
  }

  const removePlayer = (i) => setPlayers((prev) => prev.filter((_, idx) => idx !== i))

  const handleKeyDown = (e) => { if (e.key === 'Enter') addPlayer() }

  const handleSpin = () => {
    if (isSpinning) return
    setIsSpinning(true)
    setResult(null)
    setTargetPlayerIndex(null)

    const extraTurns = 5 + getRandomInt(2, 4) // 5-8 full rotations
    let landingDeg = 0
    let tpi = null

    if (players.length > 0) {
      tpi = getRandomInt(0, players.length - 1)
      const degreesPerPlayer = 360 / players.length
      landingDeg = tpi * degreesPerPlayer + getRandomInt(5, degreesPerPlayer * 0.85)
    } else {
      landingDeg = getRandomInt(0, 359)
    }

    const newRotation = rotation + extraTurns * 360 + landingDeg
    setRotation(newRotation)
    setTargetPlayerIndex(tpi)

    setTimeout(() => {
      setIsSpinning(false)
      const action = pickWithAntiRepeat(bottleActions[mode], `bottle_${mode}`, 8)
      const player = tpi !== null ? players[tpi] : null
      const entry = { player, action, mode }
      setResult(entry)
      setHistory((prev) => [entry, ...prev.slice(0, 4)])
    }, SPIN_DURATION_MS + 80)
  }

  const currentMode = bottleModes.find((m) => m.id === mode)

  // Circular player positions
  const TABLE_SIZE = Math.min(260, window.innerWidth - 60)
  const PLAYER_R = TABLE_SIZE * 0.42

  return (
    <div className="min-h-screen flex flex-col" style={{ background: PAGE_BG }}>
      <div className="max-w-lg sm:max-w-md mx-auto px-5 pt-8 pb-10 w-full">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate('/play')}
            className="w-9 h-9 rounded-full bg-white/80 border border-slate-200 flex items-center justify-center hover:bg-white transition-all shadow-sm"
          >
            <ArrowLeft size={16} className="text-slate-500" />
          </button>
          <div>
            <h1 className="font-body font-bold text-xl text-slate-900">🍾 Botella Borracha</h1>
            <p className="text-slate-400 font-body text-xs">Gira la botella</p>
          </div>
        </div>

        {/* Mode selector */}
        <div className="mb-5">
          <p className="text-slate-500 text-xs font-body font-medium uppercase tracking-wider mb-2">Modo</p>
          <div className="flex flex-wrap gap-2">
            {bottleModes.map((m) => (
              <button
                key={m.id}
                onClick={() => { if (!isSpinning) setMode(m.id) }}
                className="px-3 py-1.5 rounded-full text-xs font-body font-semibold transition-all"
                style={{
                  background: mode === m.id ? '#ede9fe' : '#f8fafc',
                  border: `1px solid ${mode === m.id ? '#c4b5fd' : '#e2e8f0'}`,
                  color: mode === m.id ? '#6d28d9' : '#64748b',
                }}
              >
                {m.emoji} {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Players */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 mb-5">
          <p className="text-slate-400 text-xs font-body font-medium uppercase tracking-wider mb-2">
            Jugadores <span className="normal-case text-slate-300">(opcional)</span>
          </p>
          {players.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {players.map((p, i) => (
                <div key={i} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-100">
                  <span className="text-xs font-body font-medium text-amber-700">{p}</span>
                  <button onClick={() => removePlayer(i)} className="text-amber-300 hover:text-amber-500 transition-colors">
                    <X size={11} />
                  </button>
                </div>
              ))}
            </div>
          )}
          <div className="flex gap-2">
            <input
              className="input-field flex-1 !py-2 !text-sm"
              placeholder="Nombre..."
              value={newPlayer}
              onChange={(e) => setNewPlayer(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              onClick={addPlayer}
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-all active:scale-95"
              style={{ background: '#fffbeb', color: '#92400e', border: '1px solid #fde68a' }}
            >
              <Plus size={15} />
            </button>
          </div>
        </div>

        {/* Table with bottle */}
        <div className="relative mx-auto mb-5" style={{ width: TABLE_SIZE, height: TABLE_SIZE }}>
          {/* Table circle */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(245,243,255,0.6) 100%)',
              border: '2px dashed #e2e8f0',
              boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
            }}
          />

          {/* Players arranged in circle */}
          {players.map((player, i) => {
            const angle = (i / players.length) * 2 * Math.PI - Math.PI / 2
            const x = Math.cos(angle) * PLAYER_R
            const y = Math.sin(angle) * PLAYER_R
            const isSelected = !isSpinning && result && targetPlayerIndex === i
            return (
              <div
                key={i}
                className="absolute flex items-center justify-center rounded-full font-body font-bold text-xs transition-all duration-500"
                style={{
                  width: 36,
                  height: 36,
                  left: '50%',
                  top: '50%',
                  transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(${isSelected ? 1.2 : 1})`,
                  background: isSelected ? '#7c3aed' : 'white',
                  color: isSelected ? 'white' : '#475569',
                  border: `2px solid ${isSelected ? '#7c3aed' : '#e2e8f0'}`,
                  boxShadow: isSelected ? '0 0 0 3px rgba(124,58,237,0.25)' : '0 2px 6px rgba(0,0,0,0.06)',
                  zIndex: 2,
                  fontSize: '10px',
                }}
              >
                {player.slice(0, 3)}
              </div>
            )
          })}

          {/* Bottle */}
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ zIndex: 3 }}
          >
            <div
              style={{
                transform: `rotate(${rotation}deg)`,
                transition: isSpinning
                  ? `transform ${SPIN_DURATION_MS}ms cubic-bezier(0.17, 0.67, 0.12, 0.99)`
                  : 'none',
                transformOrigin: 'center center',
                willChange: 'transform',
              }}
            >
              <BottleSVG />
            </div>
          </div>
        </div>

        {/* Spin button */}
        <button
          onClick={handleSpin}
          disabled={isSpinning}
          className="w-full py-4 rounded-2xl font-body font-bold text-base text-white transition-all active:scale-95 disabled:opacity-60 mb-4"
          style={{
            background: isSpinning
              ? '#c4b5fd'
              : 'linear-gradient(135deg, #7c3aed, #5b21b6)',
            boxShadow: isSpinning ? 'none' : '0 4px 14px rgba(124,58,237,0.3)',
          }}
        >
          {isSpinning ? 'Girando...' : 'Girar botella'}
        </button>

        {/* Result */}
        {result && !isSpinning && (
          <div
            className="rounded-2xl p-5 text-center border animate-[slideUp_0.3s_ease]"
            style={{ background: '#faf5ff', borderColor: '#ddd6fe' }}
          >
            {result.player && (
              <p className="font-body font-bold text-lg text-violet-700 mb-1">
                🎯 {result.player}
              </p>
            )}
            <p className="text-slate-600 font-body text-sm leading-snug">{result.action}</p>
            <p className="text-violet-300 font-body text-[10px] mt-1.5">
              {currentMode?.emoji} {currentMode?.label}
            </p>
          </div>
        )}

        {/* History */}
        {history.length > 1 && (
          <div className="mt-5">
            <div className="flex items-center gap-2 mb-2">
              <p className="text-slate-400 text-xs font-body font-medium uppercase tracking-wider">Historial</p>
              <button onClick={() => setHistory([])} className="ml-auto text-slate-300 hover:text-slate-400 transition-colors">
                <RotateCcw size={11} />
              </button>
            </div>
            <div className="space-y-2">
              {history.slice(1).map((h, i) => (
                <div key={i} className="bg-white rounded-xl border border-slate-100 px-3 py-2">
                  <p className="text-slate-500 font-body text-xs">
                    {h.player ? <span className="font-semibold">{h.player} · </span> : null}
                    {h.action}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
