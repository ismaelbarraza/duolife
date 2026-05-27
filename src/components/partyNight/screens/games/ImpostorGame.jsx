import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Plus, X, Eye, EyeOff } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { impostorContent, CATEGORY_LABELS } from '../../data/impostorContent'
import { getRandomItem, shuffleArray } from '../../utils/random'

const PAGE_BG = 'linear-gradient(160deg, #f5f3ff 0%, #fdf2f8 60%, #fff7ed 100%)'
const ACCENT = { bg: 'linear-gradient(135deg, #7c3aed, #5b21b6)', border: '#ddd6fe', light: '#f5f3ff', text: '#5b21b6' }

const DIRECTION_KEYS = ['leftToRight', 'rightToLeft', 'clockwise', 'counterclockwise']

// Impostors are slightly less likely to start (weight 0.65 vs 1.0) but not excluded
function pickWeightedRandom(players, impostorIndices) {
  const weights = players.map((_, i) => impostorIndices.includes(i) ? 0.65 : 1.0)
  const total = weights.reduce((a, b) => a + b, 0)
  let r = Math.random() * total
  for (let i = 0; i < weights.length; i++) {
    r -= weights[i]
    if (r <= 0) return i
  }
  return players.length - 1
}

function BackButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-9 h-9 rounded-full bg-white/80 border border-slate-200 flex items-center justify-center hover:bg-white transition-all shadow-sm"
    >
      <ArrowLeft size={16} className="text-slate-500" />
    </button>
  )
}

export default function ImpostorGame() {
  const navigate = useNavigate()
  const { t } = useTranslation()

  const [gameState, setGameState] = useState('SETUP')
  const [players, setPlayers] = useState([])
  const [newPlayerName, setNewPlayerName] = useState('')
  const [categoryId, setCategoryId] = useState('comida')
  const [numImpostors, setNumImpostors] = useState(1)
  const [hintsEnabled, setHintsEnabled] = useState(false)
  const [error, setError] = useState('')

  // Game round data
  const [secretWord, setSecretWord] = useState('')
  const [impostorIndices, setImpostorIndices] = useState([])
  const [impostorHintText, setImpostorHintText] = useState('')

  // Reveal flow
  const [revealIndex, setRevealIndex] = useState(0)
  const [showRole, setShowRole] = useState(false)

  // Start instruction — generated once when entering DISCUSS, stable across re-renders
  const [startInstruction, setStartInstruction] = useState(null)

  const addPlayer = () => {
    const name = newPlayerName.trim()
    if (!name) return
    if (players.map((p) => p.toLowerCase()).includes(name.toLowerCase())) {
      setError('Ya existe un jugador con ese nombre')
      return
    }
    setPlayers((prev) => [...prev, name])
    setNewPlayerName('')
    setError('')
  }

  const removePlayer = (i) => setPlayers((prev) => prev.filter((_, idx) => idx !== i))

  const handleKeyDown = (e) => { if (e.key === 'Enter') addPlayer() }

  const startGame = () => {
    if (players.length < 3) { setError('Se necesitan mínimo 3 jugadores'); return }
    if (numImpostors === 2 && players.length < 5) { setError('Con 2 impostores se necesitan mínimo 5 jugadores'); return }

    const items = impostorContent[categoryId]
    if (!items?.length) { setError('Sin contenido en esta categoría'); return }

    const item = getRandomItem(items)
    const hint = item.impostorHint || item.hints?.[0] || item.hint || 'Pista no disponible'

    const allIdx = Array.from({ length: players.length }, (_, i) => i)
    const selected = shuffleArray(allIdx).slice(0, numImpostors)

    setSecretWord(item.word)
    setImpostorIndices(selected)
    setImpostorHintText(hint)
    setRevealIndex(0)
    setShowRole(false)
    setError('')
    setGameState('REVEAL')
  }

  const handleHideAndPass = () => {
    if (revealIndex < players.length - 1) {
      setRevealIndex((v) => v + 1)
      setShowRole(false)
    } else {
      const dirKey = DIRECTION_KEYS[Math.floor(Math.random() * DIRECTION_KEYS.length)]
      const starterIdx = pickWeightedRandom(players, impostorIndices)
      setStartInstruction({ playerName: players[starterIdx], directionKey: dirKey })
      setGameState('DISCUSS')
    }
  }

  const newGame = () => {
    setGameState('SETUP')
    setPlayers([])
    setNewPlayerName('')
    setNumImpostors(1)
    setError('')
    setStartInstruction(null)
  }

  // ── REVEAL ─────────────────────────────────────────────────────────────────
  if (gameState === 'REVEAL') {
    const isImpostor = impostorIndices.includes(revealIndex)
    const currentPlayer = players[revealIndex]

    return (
      <div className="min-h-screen flex flex-col" style={{ background: PAGE_BG }}>
        <div className="max-w-lg sm:max-w-md mx-auto px-5 pt-8 pb-10 w-full flex-1 flex flex-col">
          <div className="flex items-center gap-3 mb-8">
            <BackButton onClick={() => setGameState('SETUP')} />
            <div>
              <h1 className="font-body font-bold text-lg text-slate-900">El Impostor</h1>
              <p className="text-slate-400 font-body text-xs">{revealIndex + 1} de {players.length} jugadores</p>
            </div>
          </div>

          {/* Progress dots */}
          <div className="flex gap-2 justify-center mb-8">
            {players.map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full transition-all duration-300"
                style={{ background: i < revealIndex ? '#10b981' : i === revealIndex ? '#7c3aed' : '#e2e8f0' }}
              />
            ))}
          </div>

          <div className="flex-1 flex flex-col items-center justify-center w-full">
            {/* Whose turn */}
            <div className="w-full rounded-3xl p-6 text-center mb-5 bg-white border border-slate-100 shadow-sm">
              <p className="text-slate-400 font-body text-xs mb-1">Turno de</p>
              <p className="font-body font-bold text-2xl text-slate-900">{currentPlayer}</p>
              <p className="text-slate-300 font-body text-xs mt-1">Sostén el celular solo tú</p>
            </div>

            {!showRole ? (
              <button
                onClick={() => setShowRole(true)}
                className="w-full py-3.5 rounded-2xl font-body font-semibold text-sm text-white flex items-center justify-center gap-2 transition-all active:scale-95 hover:opacity-90"
                style={{ background: ACCENT.bg, boxShadow: '0 4px 14px rgba(124,58,237,0.3)' }}
              >
                <Eye size={16} />
                Revelar mi rol
              </button>
            ) : (
              <div className="w-full space-y-4">
                {isImpostor ? (
                  <div className="rounded-3xl p-6 text-center border border-rose-100" style={{ background: '#fff1f2' }}>
                    <div className="text-4xl mb-2">🎭</div>
                    <p className="font-body font-bold text-xl text-rose-600 mb-2">¡Eres el Impostor!</p>
                    {hintsEnabled && (
                      <p className="text-rose-400 font-body text-xs leading-relaxed">
                        Pista: <span className="font-medium">{impostorHintText}</span>
                      </p>
                    )}
                    <p className="text-rose-300 font-body text-[10px] mt-2">No reveles tu rol</p>
                  </div>
                ) : (
                  <div className="rounded-3xl p-6 text-center border border-violet-100" style={{ background: ACCENT.light }}>
                    <div className="text-4xl mb-2">🎯</div>
                    <p className="text-slate-400 font-body text-xs mb-1">La palabra secreta es</p>
                    <p className="font-body font-bold text-3xl text-violet-700">{secretWord}</p>
                    <p className="text-violet-300 font-body text-[10px] mt-2">No reveles la palabra</p>
                  </div>
                )}

                <button
                  onClick={handleHideAndPass}
                  className="w-full py-3.5 rounded-2xl font-body font-semibold text-sm flex items-center justify-center gap-2 transition-all active:scale-95 bg-slate-100 text-slate-600 hover:bg-slate-200"
                >
                  <EyeOff size={16} />
                  {revealIndex < players.length - 1 ? 'Ocultar y pasar celular' : 'Todos revelados'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // ── DISCUSS ────────────────────────────────────────────────────────────────
  if (gameState === 'DISCUSS') {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: PAGE_BG }}>
        <div className="max-w-lg sm:max-w-md mx-auto px-5 pt-8 pb-10 w-full flex-1 flex flex-col items-center justify-center text-center">
          <div className="text-6xl mb-5">🎭</div>
          <h2 className="font-body font-bold text-2xl text-slate-900 mb-3">Todos tienen su rol</h2>
          <p className="text-slate-500 font-body text-sm leading-relaxed max-w-xs mb-6">
            Ahora jueguen, conversen y traten de descubrir quién es el impostor.
          </p>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm px-5 py-3 text-sm font-body text-slate-500 mb-4">
            {players.length} jugadores · {numImpostors === 1 ? '1 impostor' : '2 impostores'}
          </div>

          {startInstruction && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm px-6 py-4 text-center mb-8 w-full max-w-xs">
              <p className="text-slate-400 font-body text-[10px] uppercase tracking-wider mb-1.5">
                {t('play.impostor.starts')}
              </p>
              <p className="font-body font-bold text-xl text-slate-800">{startInstruction.playerName}</p>
              <p className="text-slate-400 font-body text-xs mt-2">
                {t('play.impostor.direction')}: <span className="text-slate-600 font-medium">{t(`play.impostor.${startInstruction.directionKey}`)}</span>
              </p>
            </div>
          )}

          <button
            onClick={() => setGameState('RESULT')}
            className="font-body font-semibold text-base text-white px-10 py-4 rounded-2xl transition-all active:scale-95 hover:opacity-90"
            style={{ background: ACCENT.bg, boxShadow: '0 4px 14px rgba(124,58,237,0.3)' }}
          >
            Revelar impostor
          </button>
        </div>
      </div>
    )
  }

  // ── RESULT ─────────────────────────────────────────────────────────────────
  if (gameState === 'RESULT') {
    const impostorNames = impostorIndices.map((i) => players[i])
    return (
      <div className="min-h-screen flex flex-col" style={{ background: PAGE_BG }}>
        <div className="max-w-lg sm:max-w-md mx-auto px-5 pt-8 pb-10 w-full">
          <div className="flex items-center gap-3 mb-8">
            <BackButton onClick={newGame} />
            <h1 className="font-body font-bold text-xl text-slate-900">Resultado</h1>
          </div>

          <div className="space-y-4">
            {/* Secret word */}
            <div className="rounded-3xl p-6 text-center bg-white border border-violet-100 shadow-sm">
              <p className="text-slate-400 font-body text-xs mb-1">La palabra secreta era</p>
              <p className="font-body font-bold text-3xl text-violet-700">{secretWord}</p>
              <p className="text-slate-400 font-body text-xs mt-1">{CATEGORY_LABELS[categoryId]}</p>
            </div>

            {/* Impostors */}
            <div className="rounded-3xl p-6 text-center border border-rose-100" style={{ background: '#fff1f2' }}>
              <div className="text-4xl mb-2">🎭</div>
              <p className="text-rose-400 font-body text-xs mb-1">
                {impostorNames.length === 1 ? 'El impostor era' : 'Los impostores eran'}
              </p>
              {impostorNames.map((name) => (
                <p key={name} className="font-body font-bold text-2xl text-rose-600">{name}</p>
              ))}
            </div>

            {/* All players */}
            <div className="bg-white rounded-2xl border border-slate-100 p-4">
              <p className="text-slate-400 font-body text-[10px] uppercase tracking-wider mb-3">Jugadores</p>
              <div className="space-y-2">
                {players.map((player, i) => {
                  const imp = impostorIndices.includes(i)
                  return (
                    <div key={i} className="flex items-center justify-between">
                      <span className="font-body text-sm text-slate-700">{player}</span>
                      {imp && (
                        <span className="text-xs font-body font-semibold text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100">
                          Impostor
                        </span>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button onClick={newGame} className="btn-secondary flex-1 !text-sm">
                Nueva partida
              </button>
              <button
                onClick={startGame}
                className="flex-1 py-2.5 rounded-full font-body font-semibold text-sm text-white transition-all active:scale-95 hover:opacity-90"
                style={{ background: ACCENT.bg }}
              >
                Jugar de nuevo
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── SETUP ──────────────────────────────────────────────────────────────────
  const categories = Object.keys(impostorContent)

  return (
    <div className="min-h-screen flex flex-col" style={{ background: PAGE_BG }}>
      <div className="max-w-lg sm:max-w-md mx-auto px-5 pt-8 pb-10 w-full">
        <div className="flex items-center gap-3 mb-8">
          <BackButton onClick={() => navigate('/play')} />
          <div>
            <h1 className="font-body font-bold text-xl text-slate-900">🕵️ El Impostor</h1>
            <p className="text-slate-400 font-body text-xs">Descubre quién no conoce la palabra</p>
          </div>
        </div>

        <div className="space-y-4">
          {error && (
            <p className="text-rose-600 text-sm font-body bg-rose-50 border border-rose-100 rounded-xl px-3 py-2">
              {error}
            </p>
          )}

          {/* Players */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
            <label className="text-slate-500 text-xs font-body font-medium uppercase tracking-wider block mb-3">
              Jugadores · mín. 3
            </label>
            {players.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {players.map((player, i) => (
                  <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-violet-50 border border-violet-100">
                    <span className="text-xs font-body font-medium text-violet-700">{player}</span>
                    <button onClick={() => removePlayer(i)} className="text-violet-300 hover:text-violet-500 transition-colors">
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
                value={newPlayerName}
                onChange={(e) => setNewPlayerName(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button
                onClick={addPlayer}
                className="w-9 h-9 rounded-xl flex items-center justify-center transition-all active:scale-95 hover:opacity-80"
                style={{ background: ACCENT.light, color: ACCENT.text, border: `1px solid ${ACCENT.border}` }}
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* Category */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
            <label className="text-slate-500 text-xs font-body font-medium uppercase tracking-wider block mb-3">
              Categoría
            </label>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryId(cat)}
                  className="py-2.5 px-3 rounded-xl text-left text-xs font-body font-medium transition-all"
                  style={{
                    background: categoryId === cat ? '#ede9fe' : '#f8fafc',
                    border: `1px solid ${categoryId === cat ? '#c4b5fd' : '#f1f5f9'}`,
                    color: categoryId === cat ? '#6d28d9' : '#64748b',
                  }}
                >
                  {CATEGORY_LABELS[cat]}
                </button>
              ))}
            </div>
          </div>

          {/* Impostors count */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
            <label className="text-slate-500 text-xs font-body font-medium uppercase tracking-wider block mb-3">
              Impostores
            </label>
            <div className="flex gap-2">
              {[1, 2].map((n) => (
                <button
                  key={n}
                  onClick={() => setNumImpostors(n)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-body font-semibold transition-all"
                  style={{
                    background: numImpostors === n ? '#ede9fe' : '#f8fafc',
                    border: `1px solid ${numImpostors === n ? '#c4b5fd' : '#f1f5f9'}`,
                    color: numImpostors === n ? '#6d28d9' : '#64748b',
                  }}
                >
                  {n} {n === 1 ? 'impostor' : 'impostores'}
                </button>
              ))}
            </div>
            {numImpostors === 2 && (
              <p className="text-slate-400 font-body text-xs mt-2">Requiere mínimo 5 jugadores</p>
            )}
          </div>

          {/* Hints toggle */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-slate-700 font-body font-medium text-sm">Pistas para impostores</p>
              <p className="text-slate-400 font-body text-xs mt-0.5">
                {hintsEnabled ? 'El impostor recibirá una pista vaga' : 'El impostor solo sabe que es impostor'}
              </p>
            </div>
            <button
              onClick={() => setHintsEnabled((v) => !v)}
              className="relative w-11 h-6 rounded-full transition-all duration-200 shrink-0"
              style={{ background: hintsEnabled ? '#7c3aed' : '#e2e8f0' }}
              aria-label="Toggle hints for impostors"
            >
              <span
                className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all duration-200"
                style={{ left: hintsEnabled ? '22px' : '2px' }}
              />
            </button>
          </div>

          {/* Start */}
          <button
            onClick={startGame}
            className="w-full py-4 rounded-2xl font-body font-bold text-base text-white transition-all active:scale-95 hover:opacity-90"
            style={{
              background: players.length >= 3 ? ACCENT.bg : '#c4b5fd',
              boxShadow: players.length >= 3 ? '0 4px 14px rgba(124,58,237,0.3)' : 'none',
            }}
          >
            {players.length < 3
              ? `Añade ${3 - players.length} jugador${3 - players.length !== 1 ? 'es' : ''} más`
              : 'Iniciar juego'}
          </button>
        </div>
      </div>
    </div>
  )
}
