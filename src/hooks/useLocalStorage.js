import { useState, useCallback, useRef } from 'react'

// ─────────────────────────────────────────────────────────────
// useLocalStorage — localStorage-backed useState
//
// 与原生 useState 接口完全兼容（支持函数式更新）。
// 在私密浏览 / 嵌入式上下文等无法访问 Storage 时静默降级为内存态。
//
// 参数：
//   key      — localStorage 键名
//   initial  — 无缓存值时的初始值（支持惰性函数：() => defaultValue）
//   opts
//     json   — 是否 JSON 序列化（默认 true；false 时按原始字符串读写）
//
// 返回 [value, setValue]，与 useState 语义一致。
//
// 使用示例：
//   // 简单数值
//   const [speed, setSpeed] = useLocalStorage('algoviz-speed', 1000, { json: false })
//   setSpeed(500)
//
//   // 对象
//   const [prefs, setPrefs] = useLocalStorage('algoviz-prefs', { lang: 'cpp' })
//   setPrefs(p => ({ ...p, lang: 'python' }))
// ─────────────────────────────────────────────────────────────

export function useLocalStorage(key, initial, { json = true } = {}) {
  // 用 ref 跟踪最新 key，避免 key 变化时 set 回调使用旧 key
  const keyRef = useRef(key)
  keyRef.current = key
  const jsonRef = useRef(json)
  jsonRef.current = json

  const [value, setReact] = useState(() => {
    const init = typeof initial === 'function' ? initial() : initial
    if (typeof window === 'undefined') return init
    try {
      const raw = localStorage.getItem(key)
      if (raw === null) return init
      return json ? JSON.parse(raw) : raw
    } catch {
      return init
    }
  })

  // 使用函数式更新形式调用 setReact，避免 stale closure 问题
  const setValue = useCallback((next) => {
    setReact(prev => {
      const v = typeof next === 'function' ? next(prev) : next
      try {
        const k = keyRef.current
        const useJson = jsonRef.current
        localStorage.setItem(k, useJson ? JSON.stringify(v) : String(v))
      } catch {
        // Storage 不可用时静默降级（隐私浏览、iframe 沙箱等场景）
      }
      return v
    })
  }, [])

  return [value, setValue]
}

// ─────────────────────────────────────────────────────────────
// safeStorage — 不需要响应式时的底层工具函数（非 hook）
//
// 与 LocalStore.js 专注于进度数据不同，这里只做通用 KV 读写，
// 适合一次性读取（如初始化阶段）的场景。
// ─────────────────────────────────────────────────────────────

export function storageGet(key, fallback = null, { json = true } = {}) {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = localStorage.getItem(key)
    if (raw === null) return fallback
    return json ? JSON.parse(raw) : raw
  } catch {
    return fallback
  }
}

export function storageSet(key, value, { json = true } = {}) {
  try {
    localStorage.setItem(key, json ? JSON.stringify(value) : String(value))
    return true
  } catch {
    return false
  }
}

export function storageRemove(key) {
  try { localStorage.removeItem(key) } catch { /* ignore */ }
}
