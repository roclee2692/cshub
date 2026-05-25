/**
 * MobileBottomNav — 手机端 (≤640px) 固定底部主导航
 *
 * 仅在 viewport === 'phone' 时由 AppLayout 渲染。
 * 6 个 tab：图标 + 2 字短标签，活跃项顶部细线 + 淡色背景 pill。
 * z-index: 78 — 低于 Sidebar 遮罩 (80)，打开侧栏时底栏被自然遮盖。
 *
 * 数据源来自 layout/navItems.js (与 TopBar 共用)。
 */
import { Link, useLocation } from 'react-router-dom'
import { NAV_ITEMS } from './navItems'

export default function MobileBottomNav() {
  const { pathname } = useLocation()
  const activeId = NAV_ITEMS.find(t => t.match(pathname))?.id

  return (
    <nav
      aria-label="主导航"
      className="mobile-bottom-nav"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 78,
        display: 'flex',
        alignItems: 'stretch',
        // 56px 可点击区 + iPhone Home 指示器安全区
        height: 'calc(56px + env(safe-area-inset-bottom, 0px))',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        boxSizing: 'border-box',
        background: 'var(--glass-bg-strong)',
        backdropFilter: 'blur(28px) saturate(180%)',
        WebkitBackdropFilter: 'blur(28px) saturate(180%)',
        borderTop: '1px solid var(--glass-border)',
        boxShadow: '0 -4px 24px rgba(0,0,0,0.10)',
      }}
    >
      {NAV_ITEMS.map(tab => {
        const active = tab.id === activeId
        return (
          <Link
            key={tab.id}
            to={tab.to}
            aria-current={active ? 'page' : undefined}
            aria-label={tab.label}
            className="mobile-bottom-tab"
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 3,
              padding: '4px 2px 6px',
              minWidth: 0,
              textDecoration: 'none',
              color: active ? 'var(--accent)' : 'var(--text-tertiary)',
              transition: 'color 0.18s ease',
              position: 'relative',
              WebkitTapHighlightColor: 'transparent',
              outline: 'none',
            }}
          >
            {/* 顶部细线指示 */}
            <span
              aria-hidden="true"
              style={{
                position: 'absolute',
                top: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                width: active ? 28 : 0,
                height: 2.5,
                borderRadius: '0 0 3px 3px',
                background: 'var(--accent)',
                transition: 'width 0.22s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            />

            {/* 活跃项淡色背景 pill */}
            {active && (
              <span
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  inset: '6px 6px 4px',
                  borderRadius: 10,
                  background: 'var(--accent-soft)',
                  pointerEvents: 'none',
                }}
              />
            )}

            <span
              style={{
                fontSize: 19,
                lineHeight: 1,
                position: 'relative',
                transition: 'transform 0.18s ease',
                transform: active ? 'scale(1.08)' : 'scale(1)',
              }}
              aria-hidden
            >
              {tab.icon}
            </span>
            <span
              style={{
                fontSize: 10,
                fontWeight: active ? 700 : 500,
                letterSpacing: '-0.01em',
                whiteSpace: 'nowrap',
                lineHeight: 1,
                position: 'relative',
                color: active ? 'var(--accent)' : 'var(--text-secondary)',
              }}
            >
              {tab.shortLabel}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
