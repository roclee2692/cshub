// ─────────────────────────────────────────────────────────────
// 路由 chunk 预热:导航链接 hover/focus 时提前拉取目标页面 chunk,
// 点击时 lazy() 直接命中模块缓存,消掉 Loading 等待。
//
// 约束:
//   - 绝不在渲染期调用 preloadRoute(等于取消代码分割)
//   - 预热失败(离线等)静默吞掉并允许下次重试,不进 monitoring
// ─────────────────────────────────────────────────────────────
import { ROUTE_LOADERS, LOADER_KEYS_BY_LENGTH } from '../routeLoaders'

const warmed = new Set()

function matchLongestPrefix(to) {
  if (!to || typeof to !== 'string') return null
  const path = to.split(/[?#]/)[0]
  for (const key of LOADER_KEYS_BY_LENGTH) {
    if (key === '/') { if (path === '/') return key; continue }
    if (path === key || path.startsWith(key + '/')) return key
  }
  return null
}

export function preloadRoute(to) {
  const key = matchLongestPrefix(to)
  if (!key || warmed.has(key)) return
  warmed.add(key)
  ROUTE_LOADERS[key]().catch(() => warmed.delete(key))
}

/** 展开到链接上:{...usePreloadHandlers(to)};鼠标悬停或键盘聚焦即预热 */
export function usePreloadHandlers(to) {
  return {
    onPointerEnter: () => preloadRoute(to),
    onFocus: () => preloadRoute(to),
  }
}
