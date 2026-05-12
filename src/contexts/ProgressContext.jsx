import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

const ProgressContext = createContext(null)

const FAV_KEY = 'algoviz-favorites'
const DONE_KEY = 'algoviz-completed'

function loadSet(key) {
  if (typeof window === 'undefined') return new Set()
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return new Set()
    const arr = JSON.parse(raw)
    return new Set(Array.isArray(arr) ? arr : [])
  } catch {
    return new Set()
  }
}

function saveSet(key, set) {
  try {
    localStorage.setItem(key, JSON.stringify([...set]))
  } catch {
    /* ignore quota errors */
  }
}

export function ProgressProvider({ children }) {
  const [favorites, setFavorites] = useState(() => loadSet(FAV_KEY))
  const [completed, setCompleted] = useState(() => loadSet(DONE_KEY))

  useEffect(() => { saveSet(FAV_KEY, favorites) }, [favorites])
  useEffect(() => { saveSet(DONE_KEY, completed) }, [completed])

  // Sync across tabs
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === FAV_KEY) setFavorites(loadSet(FAV_KEY))
      if (e.key === DONE_KEY) setCompleted(loadSet(DONE_KEY))
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const toggleFavorite = useCallback((slug) => {
    setFavorites(prev => {
      const next = new Set(prev)
      next.has(slug) ? next.delete(slug) : next.add(slug)
      return next
    })
  }, [])

  const toggleCompleted = useCallback((slug) => {
    setCompleted(prev => {
      const next = new Set(prev)
      next.has(slug) ? next.delete(slug) : next.add(slug)
      return next
    })
  }, [])

  const clearAll = useCallback(() => {
    setFavorites(new Set())
    setCompleted(new Set())
  }, [])

  const value = useMemo(() => ({
    favorites,
    completed,
    isFavorite: (slug) => favorites.has(slug),
    isCompleted: (slug) => completed.has(slug),
    toggleFavorite,
    toggleCompleted,
    clearAll,
  }), [favorites, completed, toggleFavorite, toggleCompleted, clearAll])

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  )
}

export function useProgress() {
  const ctx = useContext(ProgressContext)
  if (!ctx) throw new Error('useProgress must be used within ProgressProvider')
  return ctx
}
