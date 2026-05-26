import { useCallback, useEffect, useRef } from 'react'

// ─────────────────────────────────────────────────────────────
// useDrag · 通用鼠标/触摸拖动 hook
//
// 抽出项目内两处重复的拖动模板（StepController 的 scrubber、
// ResizableSplitPanel 的分隔条），统一封装鼠标按下 → 全局 mousemove/up
// 监听 → 自动清理的样板。
//
// 用法（StepController scrubber）：
//
//   const scrubberRef = useRef(null)
//   const onMouseDown = useDrag({
//     onMove: (e) => {
//       const rect = scrubberRef.current.getBoundingClientRect()
//       const ratio = (e.clientX - rect.left) / rect.width
//       seek(Math.round(ratio * (total - 1)))
//     },
//   })
//
//   <div ref={scrubberRef} onMouseDown={onMouseDown} onTouchStart={onMouseDown}>…</div>
//
// 用法（ResizableSplitPanel 分隔条）：
//
//   const onHandleDown = useDrag({
//     onMove: (e) => {
//       const rect = containerRef.current.getBoundingClientRect()
//       const newX = e.clientX - rect.left
//       const clamped = Math.max(minWidth, Math.min(newX, rect.width - minWidth - 16))
//       setRatio(clamped / rect.width)
//     },
//   })
//
// 选项：
//   - onStart(e)  鼠标/手指按下瞬间触发（可在此设置初始游标样式等）
//   - onMove(e)   拖动期间持续触发，e.clientX / e.clientY 已正确反映触摸点
//   - onEnd(e)    拖动结束时触发
//   - cursor      拖动期间应用到 document.body 的游标（如 'col-resize'）
//   - preventDefault  按下时是否调用 e.preventDefault()（默认 true）
//
// 返回值：可直接挂到 onMouseDown / onTouchStart 的事件处理器。
// ─────────────────────────────────────────────────────────────

export function useDrag({ onStart, onMove, onEnd, cursor, preventDefault = true } = {}) {
  const handlersRef = useRef({ onStart, onMove, onEnd })
  handlersRef.current = { onStart, onMove, onEnd }

  const draggingRef = useRef(false)

  // 触摸事件转换为类 MouseEvent 接口，统一回调签名
  const toPointer = (e) => {
    if (e.touches && e.touches[0]) {
      return {
        clientX: e.touches[0].clientX,
        clientY: e.touches[0].clientY,
        target: e.target,
        nativeEvent: e,
        preventDefault: () => e.preventDefault(),
      }
    }
    return e
  }

  // 拖动期间的全局监听
  useEffect(() => {
    function onMouseMove(e) {
      if (!draggingRef.current) return
      handlersRef.current.onMove?.(toPointer(e))
    }
    function onTouchMove(e) {
      if (!draggingRef.current) return
      handlersRef.current.onMove?.(toPointer(e))
    }
    function onMouseUp(e) {
      if (!draggingRef.current) return
      draggingRef.current = false
      if (cursor) document.body.style.cursor = ''
      handlersRef.current.onEnd?.(toPointer(e))
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup',   onMouseUp)
    window.addEventListener('touchmove', onTouchMove, { passive: true })
    window.addEventListener('touchend',  onMouseUp)
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup',   onMouseUp)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend',  onMouseUp)
    }
  }, [cursor])

  // 按下回调（外部挂到 onMouseDown / onTouchStart）
  return useCallback((e) => {
    if (preventDefault) e.preventDefault?.()
    draggingRef.current = true
    if (cursor) document.body.style.cursor = cursor
    handlersRef.current.onStart?.(toPointer(e))
    // 按下瞬间也立刻触发一次 onMove，让 scrubber 类组件能"点击直接跳"
    handlersRef.current.onMove?.(toPointer(e))
  }, [cursor, preventDefault])
}
