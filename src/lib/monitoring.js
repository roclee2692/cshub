// ─────────────────────────────────────────────────────────────
// 全局错误可观测 · 轻量上报管道
//
// 设计目标:
//   1. 兜住三类未捕获错误:window error / unhandledrejection / React
//      ErrorBoundary(componentDidCatch 手动接入 reportError)。
//   2. 可插拔 reporter:默认 console + Vercel Analytics 自定义事件;
//      将来接 Sentry 等 APM 只需在应用入口 addReporter() 一处接线。
//   3. 自我保护:去重 + 滑动窗口限额,防止渲染循环类错误打爆
//      Vercel 自定义事件配额;管道内部任何异常都被吞掉。
//   4. chunk-load 自愈:部署后旧会话懒加载旧 hash chunk 会 404,
//      检测到后整页刷新一次(sessionStorage 防循环),用户无感恢复。
//
// 使用:main.jsx 在 createRoot 之前调 initMonitoring()(这样才兜得住
// AppProviders / 首屏 lazy chunk 的加载失败)。
//
// 2026-07 审计修复(#8/#9):
//   - 限额从"会话累计 20 条后永久静默"改为滑动窗口(10 分钟 20 条),
//     SPA 长会话的后续错误不再被吞
//   - chunk-load 的去重键附加 pathname——不同页面的 chunk 404 各自可见
//   - @vercel/analytics 改为动态 import,不再进入首屏关键路径
// ─────────────────────────────────────────────────────────────

const DEDUPE_WINDOW_MS = 60_000
const RATE_WINDOW_MS = 10 * 60_000   // 滑动窗口长度
const RATE_LIMIT = 20                 // 窗口内最多上报条数

const seenAt = new Map()   // dedupeKey → 上次上报时间戳
let windowStart = 0
let windowCount = 0

function truncate(str, max) {
  if (typeof str !== 'string') return ''
  return str.length > max ? str.slice(0, max) + '…' : str
}

/** 识别典型错误来源,便于在面板里按类聚合(chunk-load 是部署后旧 chunk 404 的典型症状)。
    chunk-load 按 message 判定且优先于 context.source——动态 import 失败通常
    以 unhandledrejection 形式冒泡,不能被 'unhandled-rejection' 标签掩盖。 */
function classify(message, context) {
  if (/Failed to fetch dynamically imported module|Importing a module script failed|error loading dynamically imported module/i.test(message)) {
    return 'chunk-load'
  }
  return context.source || 'unknown'
}

function consoleReporter(payload) {
  console.error('[monitoring]', payload)
}

function vercelReporter(payload) {
  if (import.meta.env.DEV) return // dev 环境不打配额;track 在非 Vercel 环境本身也是 no-op
  // 动态 import:analytics 不进首屏关键路径,加载失败也不影响业务
  import('@vercel/analytics')
    .then(({ track }) => track('client_error', payload))
    .catch(() => {})
}

const reporters = [consoleReporter, vercelReporter]

/** 将来接 Sentry:import 后在入口 addReporter(sentryReporter) 即可,业务代码零改动 */
export function addReporter(fn) {
  reporters.push(fn)
}

// ── chunk-load 自愈:一次性整页刷新 ──────────────────────────
// 部署后生产域只指向最新快照,旧会话懒加载旧 hash chunk 必然 404。
// 刷新拿到新 index.html 即恢复。sessionStorage 守卫防"刷新后仍失败"
// 的死循环(如离线),标记 5 分钟内不重复刷新。
const RELOAD_GUARD_KEY = 'algoviz-chunk-reload-at'

function tryChunkReload() {
  if (import.meta.env.DEV) return false
  try {
    const last = Number(sessionStorage.getItem(RELOAD_GUARD_KEY) || 0)
    if (Date.now() - last < 5 * 60_000) return false   // 刚刷过还失败:别循环
    sessionStorage.setItem(RELOAD_GUARD_KEY, String(Date.now()))
    window.location.reload()
    return true
  } catch {
    return false
  }
}

/**
 * 统一上报入口。error 可以是 Error、字符串或任意值(unhandledrejection
 * 的 reason 不保证是 Error);context 支持 { source, componentStack, ... }。
 */
export function reportError(error, context = {}) {
  try {
    const err = error instanceof Error ? error : new Error(String(error ?? 'unknown'))
    const message = err.message || 'unknown'
    const source = classify(message, context)

    // 滑动窗口限额(取代"会话累计后永久静默")
    const now = Date.now()
    if (now - windowStart > RATE_WINDOW_MS) {
      windowStart = now
      windowCount = 0
    }
    if (windowCount >= RATE_LIMIT) return

    // 去重:chunk-load 按"消息+页面"去重(不同页面的 404 各自可见),
    // 其他错误按消息去重
    const dedupeKey = source === 'chunk-load'
      ? `${message}@${window.location?.pathname || ''}`
      : message
    const last = seenAt.get(dedupeKey)
    if (last && now - last < DEDUPE_WINDOW_MS) return
    seenAt.set(dedupeKey, now)
    windowCount++

    const payload = {
      name: truncate(err.name || 'Error', 50),
      message: truncate(message, 200),
      stack: truncate(err.stack || '', 500),
      pathname: truncate(window.location?.pathname || '', 100),
      source,
    }
    if (context.componentStack) payload.componentStack = truncate(context.componentStack, 500)

    for (const report of reporters) {
      try { report(payload) } catch { /* reporter 自身异常不外溢 */ }
    }

    // 上报完成后尝试自愈(先上报后刷新,保证事件不丢)
    if (source === 'chunk-load') tryChunkReload()
  } catch { /* 监控管道绝不抛错 */ }
}

/** 挂全局监听。须在 React render 之前调用,兜住首屏 chunk 加载失败。 */
export function initMonitoring() {
  window.addEventListener('error', (e) => {
    // 资源加载错误(img/script 标签等)的 target 不是 window,噪声大且无 stack,忽略
    if (e.target && e.target !== window) return
    reportError(e.error || e.message, { source: undefined })
  }, true)

  window.addEventListener('unhandledrejection', (e) => {
    reportError(e.reason, { source: 'unhandled-rejection' })
  })
}
