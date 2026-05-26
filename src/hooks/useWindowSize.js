import { useEffect, useState } from 'react'

// ─────────────────────────────────────────────────────────────
// useWindowSize · 响应式窗口尺寸 hook
//
// 项目内多个文件手写 useEffect + window.addEventListener('resize', …)
// + 自己维护 state。本 hook 提供 [width, height] 元组及预派生的断点 flag。
//
// 用法 1：基本元组
//
//   const { width, height } = useWindowSize()
//
// 用法 2：只关心阈值变化（性能更优，避免每次 resize 触发组件 rerender）
//
//   const isNarrow = useBreakpoint(900)        // width < 900 时为 true
//   const isWide   = useBreakpoint(1200, 'gte') // width >= 1200 时为 true
//
// SSR 安全：服务端渲染时返回 width=0 height=0，挂载后立即更新。
// ─────────────────────────────────────────────────────────────

function read() {
  if (typeof window === 'undefined') return { width: 0, height: 0 }
  return { width: window.innerWidth, height: window.innerHeight }
}

export function useWindowSize() {
  const [size, setSize] = useState(read)

  useEffect(() => {
    let raf = 0
    function onResize() {
      // rAF 节流，避免 resize 期间高频 setState
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => setSize(read()))
    }
    window.addEventListener('resize', onResize)
    setSize(read())   // 挂载后同步一次（SSR 兜底）
    return () => {
      window.removeEventListener('resize', onResize)
      cancelAnimationFrame(raf)
    }
  }, [])

  return size
}

/**
 * 监听一个布尔型断点 —— width < threshold（默认）或 width >= threshold。
 * 只在跨越阈值时 setState，比 useWindowSize 性能更友好。
 *
 * @param {number} threshold
 * @param {'lt' | 'gte'} mode  - 'lt' (默认): width < threshold；'gte': width >= threshold
 */
export function useBreakpoint(threshold, mode = 'lt') {
  const [match, setMatch] = useState(() => {
    if (typeof window === 'undefined') return false
    const w = window.innerWidth
    return mode === 'lt' ? w < threshold : w >= threshold
  })

  useEffect(() => {
    function check() {
      const w = window.innerWidth
      const next = mode === 'lt' ? w < threshold : w >= threshold
      setMatch(prev => (prev === next ? prev : next))
    }
    window.addEventListener('resize', check)
    check()
    return () => window.removeEventListener('resize', check)
  }, [threshold, mode])

  return match
}
