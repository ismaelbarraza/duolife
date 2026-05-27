import React, { useState, useRef, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, RotateCcw } from 'lucide-react'
import { diceCategories } from '../../data/diceData'
import { getRandomItem, getRandomInt, pickWithAntiRepeat } from '../../utils/random'

const PAGE_BG = 'linear-gradient(160deg, #f0fdf4 0%, #f5f3ff 50%, #fff7ed 100%)'

// ── Dice face dots ────────────────────────────────────────────────────────────
const DOT_POSITIONS = {
  1: [{ x: 50, y: 50 }],
  2: [{ x: 28, y: 28 }, { x: 72, y: 72 }],
  3: [{ x: 28, y: 28 }, { x: 50, y: 50 }, { x: 72, y: 72 }],
  4: [{ x: 28, y: 28 }, { x: 72, y: 28 }, { x: 28, y: 72 }, { x: 72, y: 72 }],
  5: [{ x: 28, y: 28 }, { x: 72, y: 28 }, { x: 50, y: 50 }, { x: 28, y: 72 }, { x: 72, y: 72 }],
  6: [{ x: 28, y: 20 }, { x: 72, y: 20 }, { x: 28, y: 50 }, { x: 72, y: 50 }, { x: 28, y: 80 }, { x: 72, y: 80 }],
}

function DiceFace({ value, size = 96, rolling = false, settling = false }) {
  const dots = DOT_POSITIONS[value] || DOT_POSITIONS[1]
  const dotR = 7.5
  return (
    <div
      style={{
        display: 'inline-flex',
        animation: rolling
          ? 'diceRoll 0.25s ease-in-out infinite'
          : settling
          ? 'diceLand 0.45s cubic-bezier(0.36, 0.07, 0.19, 0.97) forwards'
          : 'none',
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        style={{
          filter: rolling
            ? 'drop-shadow(0 2px 6px rgba(0,0,0,0.22))'
            : 'drop-shadow(0 8px 20px rgba(0,0,0,0.13)) drop-shadow(0 2px 5px rgba(0,0,0,0.08))',
        }}
      >
        <defs>
          <linearGradient id="diceFaceGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#edf0f5" />
          </linearGradient>
          <radialGradient id="dotGrad" cx="35%" cy="32%" r="68%">
            <stop offset="0%" stopColor="#5a6a80" />
            <stop offset="100%" stopColor="#1e293b" />
          </radialGradient>
        </defs>
        {/* Bottom shadow layer for depth */}
        <rect x="4" y="7" width="93" height="91" rx="18" fill="#bec8d6" opacity="0.5" />
        {/* Main face */}
        <rect x="3" y="3" width="94" height="92" rx="18" fill="url(#diceFaceGrad)" />
        {/* Top highlight */}
        <rect x="3" y="3" width="94" height="36" rx="18" fill="white" opacity="0.28" />
        {/* Left edge highlight */}
        <rect x="3" y="3" width="8" height="92" rx="6" fill="white" opacity="0.18" />
        {/* Dots */}
        {dots.map((dot, i) => (
          <circle key={i} cx={dot.x} cy={dot.y} r={dotR} fill="url(#dotGrad)" />
        ))}
        {/* Dot glints */}
        {dots.map((dot, i) => (
          <circle key={`g${i}`} cx={dot.x - 2} cy={dot.y - 2.5} r={dotR * 0.28} fill="rgba(255,255,255,0.28)" />
        ))}
      </svg>
    </div>
  )
}

function playDiceSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    for (let i = 0; i < 4; i++) {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.type = 'triangle'
      const t = ctx.currentTime + i * 0.07
      osc.frequency.setValueAtTime(350 + getRandomInt(0, 200), t)
      osc.frequency.exponentialRampToValueAtTime(100, t + 0.06)
      gain.gain.setValueAtTime(0.07, t)
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08)
      osc.start(t)
      osc.stop(t + 0.1)
    }
  } catch (_) { /* silently ignore if Web Audio not supported */ }
}

export default function DiceGame() {
  const navigate = useNavigate()

  useEffect(() => {
    const id = 'dice-roll-keyframes'
    if (document.getElementById(id)) return
    const style = document.createElement('style')
    style.id = id
    style.textContent = `
      @keyframes diceRoll {
        0%   { transform: rotate(-18deg) scale(0.91) translateY(3px); }
        25%  { transform: rotate(22deg)  scale(1.07) translateY(-5px); }
        50%  { transform: rotate(-12deg) scale(0.94) translateY(2px); }
        75%  { transform: rotate(16deg)  scale(1.05) translateY(-3px); }
        100% { transform: rotate(-18deg) scale(0.91) translateY(3px); }
      }
      @keyframes diceLand {
        0%   { transform: scale(1.14) translateY(-5px); }
        30%  { transform: scale(0.92) translateY(3px); }
        60%  { transform: scale(1.05) translateY(-2px); }
        80%  { transform: scale(0.97) translateY(1px); }
        100% { transform: scale(1) translateY(0); }
      }
      @keyframes diceReveal {
        from { opacity: 0; transform: scale(0.9) translateY(8px); }
        to   { opacity: 1; transform: scale(1) translateY(0); }
      }
    `
    document.head.appendChild(style)
  }, [])

  useEffect(() => () => { if (cycleRef.current) clearInterval(cycleRef.current) }, [])

  const [mode, setMode] = useState(null) // null | 'CLASSIC' | 'MULTI'

  // Classic
  const [numDice, setNumDice] = useState(1)
  const [displayVals, setDisplayVals] = useState([1])
  const [finalVals, setFinalVals] = useState([])
  const [rolling, setRolling] = useState(false)
  const [settling, setSettling] = useState(false)
  const [settleKey, setSettleKey] = useState(0)
  const intervalRef = useRef(null)

  // Multi
  const [selectedIds, setSelectedIds] = useState(['normal', 'bebidas', 'retos'])
  const [multiPhase, setMultiPhase] = useState('IDLE') // IDLE | ROLLING_CAT | SHOW_CAT | ROLLING_ACT | SHOW_ACT
  const [selectedCat, setSelectedCat] = useState(null)
  const [selectedAction, setSelectedAction] = useState(null)
  const [displayCat, setDisplayCat] = useState(null)
  const [displayAction, setDisplayAction] = useState(null)
  const [revealKey, setRevealKey] = useState(0)
  const [history, setHistory] = useState([])
  const [error, setError] = useState('')
  const cycleRef = useRef(null)

  // ── Classic roll ────────────────────────────────────────────────────────────
  const rollClassic = useCallback(() => {
    if (rolling) return
    setRolling(true)
    setFinalVals([])
    playDiceSound()

    const finals = Array.from({ length: numDice }, () => getRandomInt(1, 6))
    let tick = 0
    const maxTicks = 16

    intervalRef.current = setInterval(() => {
      setDisplayVals(Array.from({ length: numDice }, () => getRandomInt(1, 6)))
      tick++
      if (tick >= maxTicks) {
        clearInterval(intervalRef.current)
        setDisplayVals(finals)
        setFinalVals(finals)
        setRolling(false)
        setSettleKey((k) => k + 1)
        setSettling(true)
        setTimeout(() => setSettling(false), 450)
      }
    }, 70)
  }, [rolling, numDice])

  const handleNumDiceChange = (n) => {
    if (rolling) return
    setNumDice(n)
    setDisplayVals([1])
    setFinalVals([])
  }

  // ── Multi roll ──────────────────────────────────────────────────────────────
  const rollCategory = () => {
    const available = diceCategories.filter((c) => selectedIds.includes(c.id))
    if (available.length === 0) { setError('Selecciona al menos una categoría'); return }
    setError('')
    setSelectedAction(null)
    setDisplayAction(null)
    setMultiPhase('ROLLING_CAT')
    const final = getRandomItem(available)
    let tick = 0
    const maxTicks = 12
    cycleRef.current = setInterval(() => {
      setDisplayCat(available[tick % available.length])
      tick++
      if (tick >= maxTicks) {
        clearInterval(cycleRef.current)
        setDisplayCat(final)
        setSelectedCat(final)
        setMultiPhase('SHOW_CAT')
      }
    }, 80)
  }

  const rollAction = () => {
    if (!selectedCat) return
    setMultiPhase('ROLLING_ACT')
    const final = pickWithAntiRepeat(selectedCat.actions, `dice_${selectedCat.id}`, 8)
    let tick = 0
    const maxTicks = 14
    cycleRef.current = setInterval(() => {
      setDisplayAction(selectedCat.actions[tick % selectedCat.actions.length])
      tick++
      if (tick >= maxTicks) {
        clearInterval(cycleRef.current)
        setDisplayAction(final)
        setSelectedAction(final)
        setRevealKey((k) => k + 1)
        setMultiPhase('SHOW_ACT')
        setHistory((prev) => [{ category: selectedCat, action: final }, ...prev.slice(0, 4)])
      }
    }, 80)
  }

  const nextTurn = () => {
    setSelectedCat(null)
    setSelectedAction(null)
    setDisplayCat(null)
    setDisplayAction(null)
    setMultiPhase('IDLE')
  }

  const toggleCategory = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.length > 1 ? prev.filter((x) => x !== id) : prev
        : [...prev, id]
    )
    setError('')
  }

  const isMultiRolling = multiPhase === 'ROLLING_CAT' || multiPhase === 'ROLLING_ACT'

  // ── Mode selector ───────────────────────────────────────────────────────────
  if (!mode) {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: PAGE_BG }}>
        <div className="max-w-lg sm:max-w-md mx-auto px-5 pt-8 pb-10 w-full">
          <div className="flex items-center gap-3 mb-10">
            <button
              onClick={() => navigate('/play')}
              className="w-9 h-9 rounded-full bg-white/80 border border-slate-200 flex items-center justify-center hover:bg-white transition-all shadow-sm"
            >
              <ArrowLeft size={16} className="text-slate-500" />
            </button>
            <div>
              <h1 className="font-body font-bold text-xl text-slate-900">🎲 Dado</h1>
              <p className="text-slate-400 font-body text-xs">Elige el modo de juego</p>
            </div>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => { setMode('CLASSIC'); setDisplayVals([1]) }}
              className="w-full rounded-2xl p-5 text-left border transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              style={{ background: '#f0fdf4', borderColor: '#86efac', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
            >
              <div className="text-3xl mb-2">🎲</div>
              <h2 className="font-body font-bold text-base text-emerald-800">Dado Clásico</h2>
              <p className="text-emerald-600 font-body text-xs mt-0.5">1 o 2 dados con caras visuales</p>
            </button>

            <button
              onClick={() => setMode('MULTI')}
              className="w-full rounded-2xl p-5 text-left border transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              style={{ background: '#f5f3ff', borderColor: '#ddd6fe', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
            >
              <div className="text-3xl mb-2">🎯</div>
              <h2 className="font-body font-bold text-base text-violet-800">Dado Multicategoría</h2>
              <p className="text-violet-600 font-body text-xs mt-0.5">Elige categorías y lanza para una acción</p>
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── Classic mode ────────────────────────────────────────────────────────────
  if (mode === 'CLASSIC') {
    const sum = finalVals.reduce((a, b) => a + b, 0)
    return (
      <div className="min-h-screen flex flex-col" style={{ background: PAGE_BG }}>
        <div className="max-w-lg sm:max-w-md mx-auto px-5 pt-8 pb-10 w-full flex-1 flex flex-col">
          <div className="flex items-center gap-3 mb-8">
            <button
              onClick={() => setMode(null)}
              className="w-9 h-9 rounded-full bg-white/80 border border-slate-200 flex items-center justify-center hover:bg-white transition-all shadow-sm"
            >
              <ArrowLeft size={16} className="text-slate-500" />
            </button>
            <h1 className="font-body font-bold text-xl text-slate-900">🎲 Dado Clásico</h1>
          </div>

          {/* Num dice selector */}
          <div className="flex gap-2 mb-8">
            {[1, 2].map((n) => (
              <button
                key={n}
                onClick={() => handleNumDiceChange(n)}
                className="flex-1 py-2 rounded-xl text-sm font-body font-semibold transition-all"
                style={{
                  background: numDice === n ? '#dcfce7' : '#f8fafc',
                  border: `1px solid ${numDice === n ? '#86efac' : '#e2e8f0'}`,
                  color: numDice === n ? '#166534' : '#64748b',
                }}
              >
                {n} {n === 1 ? 'dado' : 'dados'}
              </button>
            ))}
          </div>

          {/* Dice display */}
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="flex gap-6 items-center justify-center mb-6">
              {Array.from({ length: numDice }).map((_, i) => (
                <DiceFace key={`${i}-${settleKey}`} value={displayVals[i] || 1} size={96} rolling={rolling} settling={settling} />
              ))}
            </div>

            {finalVals.length > 0 && !rolling && (
              <div className="text-center mb-6">
                {numDice === 2 && (
                  <p className="font-body font-bold text-3xl text-slate-800">
                    {sum}
                    <span className="text-slate-400 text-base font-normal ml-2">= {finalVals.join(' + ')}</span>
                  </p>
                )}
                {numDice === 1 && (
                  <p className="font-body font-bold text-5xl text-slate-800">{finalVals[0]}</p>
                )}
              </div>
            )}

            <button
              onClick={rollClassic}
              disabled={rolling}
              className="px-10 py-4 rounded-2xl font-body font-bold text-base text-white transition-all active:scale-95 disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #059669, #065f46)', boxShadow: '0 4px 14px rgba(5,150,105,0.3)' }}
            >
              {rolling ? 'Lanzando...' : 'Lanzar dado'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── Multi mode ──────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col" style={{ background: PAGE_BG }}>
      <div className="max-w-lg sm:max-w-md mx-auto px-5 pt-8 pb-10 w-full">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => setMode(null)}
            className="w-9 h-9 rounded-full bg-white/80 border border-slate-200 flex items-center justify-center hover:bg-white transition-all shadow-sm"
          >
            <ArrowLeft size={16} className="text-slate-500" />
          </button>
          <h1 className="font-body font-bold text-xl text-slate-900">🎯 Multicategoría</h1>
        </div>

        {/* Category chips */}
        <div className="mb-6">
          <p className="text-slate-500 text-xs font-body font-medium uppercase tracking-wider mb-2">Categorías activas</p>
          <div className="flex flex-wrap gap-2">
            {diceCategories.map((cat) => {
              const active = selectedIds.includes(cat.id)
              return (
                <button
                  key={cat.id}
                  onClick={() => toggleCategory(cat.id)}
                  className="px-3 py-1.5 rounded-full text-xs font-body font-semibold transition-all"
                  style={{
                    background: active ? cat.bg : '#f8fafc',
                    border: `1px solid ${active ? cat.border : '#e2e8f0'}`,
                    color: active ? cat.color : '#94a3b8',
                    opacity: active ? 1 : 0.6,
                  }}
                >
                  {cat.emoji} {cat.label}
                </button>
              )
            })}
          </div>
          {error && <p className="text-rose-500 text-xs font-body mt-2">{error}</p>}
        </div>

        {/* Main area */}
        <div className="space-y-4">
          {/* Category result */}
          {(multiPhase === 'ROLLING_CAT' || multiPhase === 'SHOW_CAT' || multiPhase === 'ROLLING_ACT' || multiPhase === 'SHOW_ACT') && (
            <div
              className="rounded-2xl p-5 text-center border transition-colors duration-150"
              style={{
                background: (displayCat || selectedCat)?.bg || '#f8fafc',
                borderColor: (displayCat || selectedCat)?.border || '#e2e8f0',
              }}
            >
              {multiPhase === 'ROLLING_CAT' ? (
                <>
                  <div className="text-3xl mb-1">{displayCat?.emoji || '🎲'}</div>
                  <p className="font-body font-bold text-base animate-pulse" style={{ color: displayCat?.color || '#94a3b8' }}>
                    {displayCat?.label || '...'}
                  </p>
                  <p className="text-slate-400 font-body text-xs mt-0.5">Eligiendo categoría...</p>
                </>
              ) : (
                <>
                  <div className="text-3xl mb-1">{selectedCat?.emoji}</div>
                  <p className="font-body font-bold text-base" style={{ color: selectedCat?.color }}>
                    {selectedCat?.label}
                  </p>
                  <p className="text-slate-400 font-body text-xs mt-0.5">Categoría seleccionada</p>
                </>
              )}
            </div>
          )}

          {/* Action result */}
          {(multiPhase === 'ROLLING_ACT' || multiPhase === 'SHOW_ACT') && (
            <div
              className="rounded-2xl p-5 text-center border bg-white"
              style={{ borderColor: selectedCat?.border || '#e2e8f0' }}
            >
              {multiPhase === 'ROLLING_ACT' ? (
                <>
                  <p className="text-slate-400 font-body text-xs mb-2 animate-pulse">Eligiendo acción...</p>
                  <p className="font-body font-semibold text-base text-slate-400 leading-snug min-h-[2.5rem]">
                    {displayAction || '...'}
                  </p>
                </>
              ) : (
                <div key={revealKey} style={{ animation: 'diceReveal 0.35s ease' }}>
                  <p className="text-slate-400 font-body text-xs mb-2">Tu acción</p>
                  <p className="font-body font-semibold text-base text-slate-800 leading-snug">
                    {selectedAction}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Action buttons */}
          {multiPhase === 'IDLE' && (
            <button
              onClick={rollCategory}
              className="w-full py-4 rounded-2xl font-body font-bold text-base text-white transition-all active:scale-95 hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #5b21b6)', boxShadow: '0 4px 14px rgba(124,58,237,0.25)' }}
            >
              Lanzar categoría
            </button>
          )}
          {multiPhase === 'SHOW_CAT' && (
            <button
              onClick={rollAction}
              className="w-full py-4 rounded-2xl font-body font-bold text-base text-white transition-all active:scale-95 hover:opacity-90"
              style={{ background: `linear-gradient(135deg, ${selectedCat?.color}, ${selectedCat?.color}cc)`, boxShadow: '0 4px 14px rgba(0,0,0,0.15)' }}
            >
              Lanzar acción
            </button>
          )}
          {multiPhase === 'SHOW_ACT' && (
            <button
              onClick={nextTurn}
              className="w-full py-4 rounded-2xl font-body font-bold text-base transition-all active:scale-95 bg-slate-100 text-slate-700 hover:bg-slate-200"
            >
              Siguiente turno
            </button>
          )}
          {isMultiRolling && (
            <div className="w-full py-4 rounded-2xl font-body font-bold text-base text-center text-slate-400 bg-slate-50 border border-slate-200">
              Lanzando...
            </div>
          )}
        </div>

        {/* History */}
        {history.length > 0 && (
          <div className="mt-6">
            <div className="flex items-center gap-2 mb-3">
              <p className="text-slate-400 text-xs font-body font-medium uppercase tracking-wider">Historial</p>
              <button onClick={() => setHistory([])} className="ml-auto text-slate-300 hover:text-slate-500 transition-colors">
                <RotateCcw size={12} />
              </button>
            </div>
            <div className="space-y-2">
              {history.map((h, i) => (
                <div key={i} className="bg-white rounded-xl border border-slate-100 px-3 py-2 flex items-start gap-2">
                  <span className="text-base shrink-0">{h.category.emoji}</span>
                  <p className="text-slate-600 font-body text-xs leading-snug">{h.action}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
