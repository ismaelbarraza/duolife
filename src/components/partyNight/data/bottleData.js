export const bottleModes = [
  { id: 'classic', label: 'Clásico', emoji: '🍾', color: '#475569' },
  { id: 'truthOrDare', label: 'Verdad o Reto', emoji: '❓', color: '#7c3aed' },
  { id: 'kissOrShot', label: 'Beso o Shot', emoji: '💋', color: '#be123c' },
  { id: 'softPunishment', label: 'Castigo Suave', emoji: '😅', color: '#065f46' },
  { id: 'spicy', label: 'Picante', emoji: '🌶️', color: '#9f1239' },
]

export const bottleActions = {
  classic: [
    'Elige a alguien para responder una pregunta.',
    'Cuenta una anécdota rápida.',
    'Elige el próximo turno.',
    'Haz una pregunta al grupo.',
    'Pasa turno.',
  ],
  truthOrDare: [
    'Elige verdad o reto.',
    'Responde una verdad incómoda.',
    'Cumple un reto suave.',
    'Haz una pregunta a quien quieras.',
    'Pasa turno.',
  ],
  kissOrShot: [
    'Elige beso, shot simbólico o pasar.',
    'Elige a alguien para brindar.',
    'Manda un cumplido coqueto.',
    'Haz contacto visual 10 segundos.',
    'Pasa turno.',
  ],
  softPunishment: [
    'Haz 10 sentadillas.',
    'Canta una frase de una canción.',
    'Imita a alguien del grupo.',
    'Baila 10 segundos.',
    'Pasa turno.',
  ],
  spicy: [
    'Haz una pregunta sugerente a alguien.',
    'Da un cumplido atrevido.',
    'Elige a alguien para una pregunta incómoda.',
    'Mantén mirada intensa 10 segundos.',
    'Pasa turno.',
  ],
}

export const SPIN_DURATION_MS = 3000
