import { useEffect, useRef } from 'react'

// ─────────────────────────────────────────────────────────────
// useKeydown · 全局键盘事件 hook（Observer 模式）
//
// 项目内 10 个文件直接 addEventListener('keydown', …) + 手动清理。本 hook
// 封装挂载/卸载并提供 keymap 形式的声明式 API。
//
// 用法 1：keymap 形式（最常见）
//
//   useKeydown({
//     ' ':         () => playing ? stop() : play(),  // 空格
//     ArrowLeft:   prev,
//     ArrowRight:  goNext,
//     KeyR:        reset,
//   }, { ignoreInInputs: true })
//
//   keymap 的键支持：
//   - 字符（' ' / 'a' / 'Enter' / 'Escape' / 'ArrowLeft' …）— 匹配 e.key
//   - e.code 形式（'Space' / 'KeyR' / 'Digit1' …）— 匹配 e.code
//   - 加修饰键前缀：'Ctrl+K' / 'Meta+K' / 'Shift+Enter' / 'Alt+ArrowLeft'
//
// 用法 2：单回调形式
//
//   useKeydown(e => {
//     if (e.key === 'Escape') onClose()
//   })
//
// 选项：
//   - ignoreInInputs（默认 true）：当焦点在 <input> / <textarea> /
//     [contenteditable] 时不触发，避免与输入冲突。
//   - target（默认 window）：监听的事件源，可传 HTMLElement / window / document。
//   - enabled（默认 true）：false 时跳过挂载，等价于条件 hook 但符合规则。
// ─────────────────────────────────────────────────────────────

const MOD_KEYS = ['Ctrl', 'Meta', 'Shift', 'Alt']

function parseBinding(binding) {
  // 把 "Ctrl+Shift+K" 解析为 { mods: { ctrl: true, shift: true }, key: 'K' }
  const parts = binding.split('+').map(s => s.trim())
  const key = parts.pop()
  const mods = { ctrl: false, meta: false, shift: false, alt: false }
  for (const p of parts) {
    const mod = MOD_KEYS.find(m => m.toLowerCase() === p.toLowerCase())
    if (mod) mods[mod.toLowerCase()] = true
  }
  return { mods, key }
}

function matches(e, parsed) {
  const { mods, key } = parsed
  if (mods.ctrl  !== e.ctrlKey)  return false
  if (mods.meta  !== e.metaKey)  return false
  if (mods.shift !== e.shiftKey) return false
  if (mods.alt   !== e.altKey)   return false
  // 同时尝试匹配 e.key 和 e.code，支持两种风格
  return e.key === key || e.code === key
}

function isEditableTarget(target) {
  if (!target) return false
  const tag = target.tagName
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true
  if (target.isContentEditable) return true
  return false
}

export function useKeydown(handlerOrMap, options = {}) {
  const { ignoreInInputs = true, target, enabled = true } = options

  // 使用 ref 保存最新 handlerOrMap，避免 keymap 函数引用变化导致重新订阅
  const ref = useRef(handlerOrMap)
  ref.current = handlerOrMap

  useEffect(() => {
    if (!enabled) return undefined
    const el = target || (typeof window !== 'undefined' ? window : null)
    if (!el) return undefined

    function onKey(e) {
      if (ignoreInInputs && isEditableTarget(e.target)) return
      const h = ref.current
      if (typeof h === 'function') {
        h(e)
        return
      }
      if (h && typeof h === 'object') {
        for (const binding of Object.keys(h)) {
          if (matches(e, parseBinding(binding))) {
            const fn = h[binding]
            if (typeof fn === 'function') fn(e)
          }
        }
      }
    }

    el.addEventListener('keydown', onKey)
    return () => el.removeEventListener('keydown', onKey)
  }, [enabled, ignoreInInputs, target])
}
