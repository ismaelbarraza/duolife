export const getRandomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min

export const getRandomItem = (array) => {
  if (!array || array.length === 0) return null
  return array[getRandomInt(0, array.length - 1)]
}

export const shuffleArray = (array) => {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = getRandomInt(0, i);
    [arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

export function pickWithAntiRepeat(pool, storageKey, maxRecent = 8) {
  if (!pool || pool.length === 0) return null
  const recent = JSON.parse(localStorage.getItem(storageKey) || '[]')
  const allIndices = pool.map((_, i) => i)
  const available = allIndices.filter(i => !recent.includes(i))
  const candidates = available.length > 0 ? available : allIndices
  const pickedIdx = candidates[getRandomInt(0, candidates.length - 1)]
  const newRecent = [...recent, pickedIdx].slice(-maxRecent)
  localStorage.setItem(storageKey, JSON.stringify(newRecent))
  return pool[pickedIdx]
}
