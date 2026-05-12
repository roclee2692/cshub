import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTheme } from '../contexts/ThemeContext'
import SearchPalette from '../components/SearchPalette'

export default function TopBar({ showMenuButton = false, onMenuClick, sidebarCollapsed = false, onToggleSidebarCollapse = null }) {
  const { pathname } = useLocation()
  const [searchOpen, setSearchOpen] = useState(false)

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setSearchOpen(o => !o)
      }
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault()
        setSearchOpen(true)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <>
      <header style={{
        height: 56,
        background: 'var(--header-bg)',
        backdropFilter: 'blur(32px) saturate(200%)',
        WebkitBackdropFilter: 'blur(32px) saturate(200%)',
        borderBottom: '1px solid var(--glass-border)',
        boxShadow: 'var(--glass-shine), 0 1px 24px rgba(0,0,0,0.18)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 24px',
        gap: 24,
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }} className="topbar">

        {showMenuButton && (
          <GlassBtn onClick={onMenuClick} aria-label="打开侧边栏">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6"/>
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </GlassBtn>
        )}

        {onToggleSidebarCollapse && (
          <GlassBtn onClick={onToggleSidebarCollapse} title={sidebarCollapsed ? '展开侧栏' : '隐藏侧栏'} aria-label={sidebarCollapsed ? '展开侧栏' : '隐藏侧栏'}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {sidebarCollapsed ? (
                <>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <line x1="3" y1="12" x2="21" y2="12"/>
                  <line x1="3" y1="18" x2="21" y2="18"/>
                </>
              ) : (
                <>
                  <line x1="21" y1="6" x2="3" y2="6"/>
                  <line x1="21" y1="12" x2="3" y2="12"/>
                  <line x1="21" y1="18" x2="3" y2="18"/>
                </>
              )}
            </svg>
          </GlassBtn>
        )}

        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Logo />
          <span style={{ fontWeight: 700, fontSize: 15, letterSpacing: '-0.03em' }}>
            AlgoViz
          </span>
          <span style={{
            fontSize: 9, padding: '2px 7px', borderRadius: 20,
            background: 'var(--accent-soft)',
            border: '1px solid var(--accent-border)',
            color: 'var(--accent-light)',
            fontWeight: 700, letterSpacing: '0.06em',
          }}>
            BETA
          </span>
        </Link>

        <nav className="topbar-nav" style={{ display: 'flex', gap: 2, marginLeft: 12 }}>
          <NavLink to="/" active={pathname === '/'}>首页</NavLink>
          <NavLink to="/algo/bubblesort" active={pathname.startsWith('/algo/')}>算法库</NavLink>
        </nav>

        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
          <SearchBox onClick={() => setSearchOpen(true)} />
          <ThemeToggle />
          <a href="https://github.com" target="_blank" rel="noreferrer"
            className="topbar-github"
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--r-md)',
              background: 'var(--glass-bg)',
              backdropFilter: 'var(--glass-blur)',
              WebkitBackdropFilter: 'var(--glass-blur)',
              border: '1px solid var(--glass-border)',
              boxShadow: 'var(--glass-shine)',
              color: 'var(--text-secondary)',
              fontSize: 13,
              fontWeight: 500,
              transition: 'all 0.18s',
              display: 'inline-block',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'var(--accent-border)'
              e.currentTarget.style.color = 'var(--text-primary)'
              e.currentTarget.style.background = 'var(--glass-bg-mid)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'var(--glass-border)'
              e.currentTarget.style.color = 'var(--text-secondary)'
              e.currentTarget.style.background = 'var(--glass-bg)'
            }}>
            GitHub
          </a>
        </div>
      </header>

      <SearchPalette open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}

function GlassBtn({ children, onClick, ...props }) {
  return (
    <button onClick={onClick} {...props} style={{
      width: 34, height: 34,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      borderRadius: 'var(--r-sm)',
      background: 'var(--glass-bg)',
      backdropFilter: 'var(--glass-blur)',
      WebkitBackdropFilter: 'var(--glass-blur)',
      border: '1px solid var(--glass-border)',
      boxShadow: 'var(--glass-shine)',
      color: 'var(--text-secondary)',
      transition: 'all 0.18s',
    }}
    onMouseEnter={e => { e.currentTarget.style.background = 'var(--glass-bg-mid)'; e.currentTarget.style.color = 'var(--text-primary)' }}
    onMouseLeave={e => { e.currentTarget.style.background = 'var(--glass-bg)'; e.currentTarget.style.color = 'var(--text-secondary)' }}>
      {children}
    </button>
  )
}

function ThemeToggle() {
  const { theme, toggle } = useTheme()
  const isDark = theme === 'dark'
  return (
    <button onClick={toggle}
      title={isDark ? '切换到浅色模式' : '切换到深色模式'}
      style={{
        width: 34, height: 34,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        borderRadius: 'var(--r-sm)',
        background: 'var(--glass-bg)',
        backdropFilter: 'var(--glass-blur)',
        WebkitBackdropFilter: 'var(--glass-blur)',
        border: '1px solid var(--glass-border)',
        boxShadow: 'var(--glass-shine)',
        color: 'var(--text-secondary)',
        position: 'relative', overflow: 'hidden',
        transition: 'all 0.18s',
      }}
      onMouseEnter={e => { e.currentTarget.style.background = 'var(--glass-bg-mid)'; e.currentTarget.style.color = 'var(--text-primary)' }}
      onMouseLeave={e => { e.currentTarget.style.background = 'var(--glass-bg)'; e.currentTarget.style.color = 'var(--text-secondary)' }}>
      <span style={{
        position: 'absolute',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'transform 0.4s cubic-bezier(0.4,0,0.2,1), opacity 0.25s',
        transform: isDark ? 'translateY(0)' : 'translateY(-34px)',
        opacity: isDark ? 1 : 0,
      }}><SunIcon /></span>
      <span style={{
        position: 'absolute',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'transform 0.4s cubic-bezier(0.4,0,0.2,1), opacity 0.25s',
        transform: !isDark ? 'translateY(0)' : 'translateY(34px)',
        opacity: !isDark ? 1 : 0,
      }}><MoonIcon /></span>
    </button>
  )
}

function NavLink({ to, active, children }) {
  return (
    <Link to={to} style={{
      padding: '6px 14px',
      borderRadius: 'var(--r-sm)',
      fontSize: 13,
      fontWeight: active ? 600 : 500,
      color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
      background: active ? 'var(--glass-bg-mid)' : 'transparent',
      border: active ? '1px solid var(--glass-border)' : '1px solid transparent',
      backdropFilter: active ? 'var(--glass-blur)' : 'none',
      WebkitBackdropFilter: active ? 'var(--glass-blur)' : 'none',
      boxShadow: active ? 'var(--glass-shine)' : 'none',
      transition: 'all 0.18s',
    }}>
      {children}
    </Link>
  )
}

function SearchBox({ onClick }) {
  const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform)
  return (
    <button onClick={onClick}
      className="topbar-search"
      style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '6px 12px',
        borderRadius: 'var(--r-md)',
        background: 'var(--glass-bg)',
        backdropFilter: 'var(--glass-blur)',
        WebkitBackdropFilter: 'var(--glass-blur)',
        border: '1px solid var(--glass-border)',
        boxShadow: 'var(--glass-shine)',
        width: 220,
        fontSize: 12.5,
        color: 'var(--text-tertiary)',
        textAlign: 'left',
        transition: 'all 0.18s',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'var(--accent-border)'
        e.currentTarget.style.background = 'var(--glass-bg-mid)'
        e.currentTarget.style.color = 'var(--text-secondary)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'var(--glass-border)'
        e.currentTarget.style.background = 'var(--glass-bg)'
        e.currentTarget.style.color = 'var(--text-tertiary)'
      }}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
      </svg>
      <span className="topbar-search-label" style={{ flex: 1 }}>搜索算法...</span>
      <kbd className="topbar-search-kbd" style={{
        padding: '1px 6px', fontSize: 10,
        background: 'var(--glass-bg-strong)',
        border: '1px solid var(--glass-border)',
        borderRadius: 5, fontFamily: 'inherit',
        color: 'var(--text-tertiary)',
      }}>{isMac ? '⌘K' : 'Ctrl K'}</kbd>
    </button>
  )
}

function Logo() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <defs>
        <linearGradient id="lg" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#a855f7"/>
          <stop offset="0.5" stopColor="#818cf8"/>
          <stop offset="1" stopColor="#ec4899"/>
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="1" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      <rect x="2" y="2" width="20" height="20" rx="6" fill="url(#lg)" opacity="0.9"/>
      <path d="M7 16 L11 8 L13 12 L17 6"
        stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
        filter="url(#glow)" />
    </svg>
  )
}

function SunIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4"/>
      <path d="M12 2v2M12 20v2m-7.07-14.07 1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2m-4.93-7.07-1.41 1.41M6.34 17.66l-1.41 1.41"/>
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  )
}
