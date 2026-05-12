import { createContext, useContext, useRef, useEffect, useSyncExternalStore } from 'react'

// A ref-based store lives inside the provider so each algorithm page has its own.
// useStepPublish writes to it; PseudocodeBlock subscribes via useSyncExternalStore.
// No React state → no re-render cascade.
const StoreContext = createContext(null)

function createStore() {
  let data = { step: 0, current: null, total: 0 }
  const subs = new Set()
  return {
    getSnapshot: () => data,
    subscribe: (cb) => { subs.add(cb); return () => subs.delete(cb) },
    set: (next) => { data = next; subs.forEach(s => s()) },
  }
}

export function StepProvider({ children }) {
  const storeRef = useRef(null)
  if (!storeRef.current) storeRef.current = createStore()
  return (
    <StoreContext.Provider value={storeRef.current}>
      {children}
    </StoreContext.Provider>
  )
}

// Called inside useStepController — writes current step to the store
export function useStepPublish(step, steps) {
  const store = useContext(StoreContext)
  useEffect(() => {
    if (!store) return
    const current = steps[step] ?? null
    const total = steps.length
    const prev = store.getSnapshot()
    if (prev.step !== step || prev.total !== total || prev.current !== current) {
      store.set({ step, current, total })
    }
  }, [step, steps, store])
}

// Read in PseudocodeBlock — re-renders only this component on step change
export function useStepData() {
  const store = useContext(StoreContext)
  return useSyncExternalStore(
    store ? store.subscribe : () => () => {},
    store ? store.getSnapshot : () => ({ step: 0, current: null, total: 0 }),
  )
}
