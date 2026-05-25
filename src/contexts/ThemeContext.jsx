import { createContext, useContext, useEffect, useState } from 'react'
import { flushSync } from 'react-dom'

const ThemeContext   = createContext(null)
const STORAGE_KEY    = 'algoviz-theme'

const TRANSITION_STYLE = 'circle'

function getInitialTheme() {
  if (typeof window === 'undefined') return 'dark'
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved === 'light' || saved === 'dark') return saved
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

export function ThemeProvider({ children }) {
  const [theme, setTheme]                   = useState(getInitialTheme)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem(STORAGE_KEY, theme)
  }, [theme])

  /**
   * 切换明暗主题，使用当前选定的过渡动画。
   */
  const toggle = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'

    // ── 不支持 View Transitions 时使用 CSS 变量的颜色补间 ───────
    if (!document.startViewTransition) {
      // fallback：给 root 加 class，由 CSS 做颜色过渡
      const root = document.documentElement
      root.classList.add('theme-transitioning')
      setTimeout(() => root.classList.remove('theme-transitioning'), 520)
      setTheme(newTheme)
      return
    }

    // ── 圆形切换固定从右上角展开 ──────────────────────────────
    const x = window.innerWidth
    const y = 0
    const radius = Math.hypot(
      Math.max(x, window.innerWidth  - x),
      Math.max(y, window.innerHeight - y),
    )
    const root = document.documentElement
    root.style.setProperty('--vt-x',      `${x}px`)
    root.style.setProperty('--vt-y',      `${y}px`)
    root.style.setProperty('--vt-radius', `${radius}px`)
    root.setAttribute('data-vt', TRANSITION_STYLE)

    // ── 启动 View Transition ────────────────────────────────────
    const transition = document.startViewTransition(() => {
      root.setAttribute('data-theme', newTheme)
      localStorage.setItem(STORAGE_KEY, newTheme)
      flushSync(() => setTheme(newTheme))
    })

    transition.finished
      .then(()  => root.removeAttribute('data-vt'))
      .catch(() => root.removeAttribute('data-vt'))
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggle }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
