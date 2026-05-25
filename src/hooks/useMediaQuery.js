import { useEffect, useState } from 'react'

export function useMediaQuery(query) {
  const get = () => typeof window !== 'undefined' && window.matchMedia(query).matches
  const [matches, setMatches] = useState(get)
  useEffect(() => {
    const mq = window.matchMedia(query)
    const handler = (e) => setMatches(e.matches)
    setMatches(mq.matches)
    mq.addEventListener?.('change', handler)
    return () => mq.removeEventListener?.('change', handler)
  }, [query])
  return matches
}

// 旧 API：保留向后兼容（≤768px 视为移动端）
// 仅在「需要让 iPad 也走移动布局」的场景下用；新代码请用 useViewport()
export function useIsMobile() {
  return useMediaQuery('(max-width: 768px)')
}

// 新增 · 三档断点策略
//   phone   ≤ 640px  ：手机；走底部导航 + 全宽输入 + 单列堆叠
//   ipad    641-1024 ：iPad 竖屏/小笔记本；桌面布局但收紧
//   desktop > 1024px ：桌面；现状不动
export function useViewport() {
  const isPhone = useMediaQuery('(max-width: 640px)')
  const isIpad  = useMediaQuery('(min-width: 641px) and (max-width: 1024px)')
  if (isPhone) return 'phone'
  if (isIpad)  return 'ipad'
  return 'desktop'
}

export function useIsPhone() {
  return useMediaQuery('(max-width: 640px)')
}

export function useIsTabletPortrait() {
  return useMediaQuery('(min-width: 641px) and (max-width: 1024px)')
}

// 触摸设备探测（不仅看屏幕宽度，还看输入方式）
export function useIsTouch() {
  return useMediaQuery('(hover: none) and (pointer: coarse)')
}
